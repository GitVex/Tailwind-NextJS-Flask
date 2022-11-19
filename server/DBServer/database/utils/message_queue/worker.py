import sys, json, zmq, uuid, os
from ..track_anyl import track_anyl

# assign the process id as the worker id
worker_id = os.getpid()

# create a socket to communicate with the ventilator
IN_Vent = zmq.Context().socket(zmq.PULL)
IN_Vent.connect("tcp://localhost:5001")

# create a socket to send a reply to the ventilator
ventReply = zmq.Context().socket(zmq.PUSH)
ventReply.connect("tcp://localhost:5003")

# create a socket to communicate with the sink
OUT_Sink = zmq.Context().socket(zmq.PUSH)
OUT_Sink.connect("tcp://localhost:5900")

# when a job is received from the ventilator, send the worker id to the ventilator, start the analysis, and send the result to the sink
while True:
    job_url, job_id = IN_Vent.recv_json()
    ventReply.send_multipart([job_id.encode(), worker_id.encode()])
    result = track_anyl.getIntensityArray(job_url)
    OUT_Sink.send_multipart([job_id.encode(), json.dumps(result).encode()])