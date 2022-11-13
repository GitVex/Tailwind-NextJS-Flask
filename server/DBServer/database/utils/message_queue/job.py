import sys, zmq

# get the information from the command line
# the first argument is the url of the track
# the second argument is the id of the job
job_url = sys.argv[1]
job_id = sys.argv[2]

# create sockets to communicate with the sink and ventilator
sinkSub = zmq.Context().socket(zmq.SUB)
sinkSub.connect("tcp://localhost:5901") 

vent = zmq.Context().socket(zmq.REQ)
vent.connect("tcp://localhost:5001")

# subscribe to the sink
sinkSub.setsockopt_string(zmq.SUBSCRIBE, "")

# send the job url and id to the ventilator
vent.send_json({"url": job_url, "id": job_id})
# wait for the ventilator to send the job and worker id back
vent.recv_string()

# wait for the sink to send the result back
# messages from the sink are multipart messages containing the job id and the result
# continue to wait for messages until the job id matches the job id of the current job
while True:
    job_id, result = sinkSub.recv_multipart()
    if job_id.decode() == job_id:
        break

# save the result to the django database using the job url and id

