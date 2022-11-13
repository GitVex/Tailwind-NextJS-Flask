import zmq, json, sys, uuid

socket = zmq.Context().socket(zmq.PUSH)
socket.bind("tcp://*:5001")

