import json
import os
import subprocess
import sys
import threading
import time
import uuid

import zmq

from models import preset, tag, track

# create a job datatype to store the information of a job
# When a job object is created, it spawns a new process to run the job
class Job:
    def __init__(self, job_url, job_id=uuid.uuid4().hex):
        self.job_url = job_url
        self.job_id = job_id
        self.job_status = "waiting"
        self.job_result = None
        self.run(self)

    def serialize(self):
        return json.dumps(
            {
                "job_url": self.job_url,
                "job_id": self.job_id,
                "job_status": self.job_status,
                "job_result": self.job_result,
            }
        )

    # load a Job object from a serelized json
    @classmethod
    def load(cls, serialized_job):
        job_dict = json.loads(serialized_job)
        job = cls(job_dict["job_url"], job_dict["job_id"])
        job.job_status = job_dict["job_status"]
        job.job_result = job_dict["job_result"]
        return job

    @classmethod
    def __str__(self):
        return (
            f"Job({self.job_url}, {self.job_id}, {self.job_status}, {self.job_result})"
        )

    @staticmethod
    def __repr__(self):
        return f"Job({self.job_url}, {self.job_id})"

    def run(self):
        self.job_status: str = "running"
        # run the job
        # the job is run in a subprocess
        # the subprocess is created with the job_url as the argument
        # the subprocess will return the result of the job as a json string
        # the result is then stored in the job_result attribute
        self.job_process = subprocess.Popen(
            [sys.executable, "job.py", self.job_url, self.job_id]
        )
        # return the pid of the subprocess
        return self.job_process.pid

    # method to save the result of the job to the django database
    # the result is assigned using the job_url
    # only called if intensityArray is expected to not be None and the job has a "finished" status
    def dunk(self):
        if self.job_status == "finished":
            track_obj = track.objects.get(url=self.job_url)
            track_obj.intensityArray = self.job_result
            track_obj.save()

# create a job manager to manage the jobs
# the job manager is a singleton class
class JobManager:
    def __init__(self):
        # create a dictionary to store the jobs
        self.jobs = {}
        # create a socket to communicate with the ventilator
        self.vent = zmq.Context().socket(zmq.REQ)
        self.vent.connect("tcp://localhost:5001")
        # create a socket to communicate with the sink
        self.sinkSub = zmq.Context().socket(zmq.SUB)
        self.sinkSub.connect("tcp://localhost:5901")
        self.sinkSub.setsockopt_string(zmq.SUBSCRIBE, "")
        # create a thread to listen for messages from the sink
        self.sink_thread = threading.Thread(target=self.sink_listener)
        self.sink_thread.start()

        # run the check_jobs method at an 1 hour interval
        self.check_jobs_thread = threading.Thread(target=self.check_jobs)
        self.check_jobs_thread.start()

    def __repr__(self):
        return f"JobManager({[i.__str__() for i in self.jobs]})"

    def sink_listener(self):
        # listen for messages from the sink
        # messages from the sink are multipart messages containing the job id and the result
        # continue to wait for messages until the job id matches the job id of the current job
        while True:
            job_id, result = self.sinkSub.recv_multipart()
            job_id = job_id.decode()
            result = json.loads(result.decode())
            if job_id in self.jobs:
                self.jobs[job_id].job_status = "finished"
                self.jobs[job_id].job_result = result
                self.jobs[job_id].job_process.kill()
                self.jobs[job_id].job_process.wait()
                self.jobs[job_id].dunk()

    def create_job(self, job_url):
        # create a new job and add it to the jobs dictionary
        job = Job(job_url)
        self.jobs[job.job_id] = job
        # send the job url and id to the ventilator
        self.vent.send_json({"url": job_url, "id": job.job_id})
        # wait for the ventilator to send the job and worker id back
        self.vent.recv_string()
        return job.job_id

    def get_job(self, job_id):
        # return the job with the given job id
        if job_id in self.jobs:
            return self.jobs[job_id]
        else:
            return None

    def get_jobs(self):
        # return all the jobs
        return self.jobs

    def get_job_status(self, job_id):
        # return the status of the job with the given job id
        if job_id in self.jobs:
            return self.jobs[job_id].job_status
        else:
            return None

    # create a method that runs at an interval to check the status of the jobs, and remove the jobs that have finished
    def check_jobs(self):

        deleted_jobs = []

        for job_id in self.jobs:
            if self.jobs[job_id].job_status == "finished":
                deleted_jobs.append(job_id)
                del self.jobs[job_id]

        return deleted_jobs
