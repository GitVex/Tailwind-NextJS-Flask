# plot the data from track_anyl for testing visualisation
from re import A
import matplotlib.pyplot as plt
from track_anyl import getIntensityArray, reduce_array, denoise_iterate
import json
import ast

# load the intensity array from the json object
data = getIntensityArray("https://www.youtube.com/watch?v=wzrbpG6UI7c")

# convert the string to a list
intensityArray = ast.literal_eval(data["intensityArray"])
beat_times = ast.literal_eval(data["beat_times"])

# normalise the intensity array
intensityArray = [x / max(intensityArray) for x in intensityArray]

plt.plot(beat_times ,intensityArray)
plt.show()