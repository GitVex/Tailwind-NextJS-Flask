import zmq, json, sys, uuid

# create a socket to communicate with a worker
OUTsocket = zmq.Context().socket(zmq.PUSH)
OUTsocket.bind("tcp://*:5001")

# create a socket to communicate with a job
jobSocket = zmq.Context().socket(zmq.REP)
jobSocket.bind("tcp://*:5002")

# create a pull socket to receive workerIDs from a worker
workerIDSocket = zmq.Context().socket(zmq.PULL)
workerIDSocket.bind("tcp://*:5003")

# when a job is received, send the job url and id to a worker and return the workerID to the job
while True:

    # poll the 

    job_url, job_id = jobSocket.recv_json()
    OUTsocket.send_json({"url": job_url, "id": job_id})
    worker_id = workerIDSocket.recv_string()
    jobSocket.send_string(worker_id)