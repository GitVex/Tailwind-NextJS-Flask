# use librosa to extract the intensity of the audio at each time step
# use youtube-dl to download the audio file
# download only the audio file without the use of ffmpeg
# return the features as a json object

import librosa
import youtube_dl
import numpy as np


def getIntensityArray(url):

    # give the download file a unique name
    filename = f"temp_{url.split('=')[1]}"

    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": f"./database/anyl_Temp/{filename}.%(ext)s",
        "postprocessors": [
            {
                "key": "FFmpegExtractAudio",
                "preferredcodec": "wav",
                "preferredquality": "192",
            }
        ],
    }
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

    intensityArray, beats, tempo, beat_times = generate_intensity_array(f".\\database\\anyl_Temp\\{filename}.wav")
    # reduce_array(intensityArray, 400, inplace=True)
    # reduce_array(beat_times, 400, inplace=True)
    # intensityArray = denoise_iterate(intensityArray, 5)
    return {
            "intensityArray": str(denoise_iterate(intensityArray, 5, inplace=True)),
            "beat_times": str(beat_times[:-1]),
            "length": len(intensityArray),
        }

# reduce the intensity array to a length of n without losing the overall shape of the array
# if the length of the array is less than n, return the array
# provide an inplace option to modify the array in place
# no recursion
def reduce_array(array, n, inplace=False):
    if len(array) <= n:
        return array
    if inplace:
        array = array
    else:
        array = array.copy()
    while len(array) > n:
        for i in range(len(array)):
            if i == 0:
                array[i] = (array[i] + array[i + 1]) / 2
            elif i == len(array) - 1:
                array[i] = (array[i] + array[i - 1]) / 2
            else:
                array[i] = (array[i - 1] + array[i] + array[i + 1]) / 3
        array.pop()
    return array

# generate a smoothed intensity array on every 0.5 seconds of the audio track
def generate_intensity_array(track):
    y, sr = librosa.load(track)
    tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
    onset_env = librosa.onset.onset_strength(y, sr=sr)
    tempo, beats = librosa.beat.beat_track(onset_envelope=onset_env, sr=sr)
    beat_times = librosa.frames_to_time(beats, sr=sr)
    beat_times = np.insert(beat_times, 0, 0)
    beat_times = np.append(beat_times, librosa.get_duration(y=y, sr=sr))
    intensityArray = []
    for i in range(len(beat_times) - 1):
        intensityArray.append(
            librosa.feature.rms(
                y=y[int(beat_times[i] * sr) : int(beat_times[i + 1] * sr)]
            )[0][0]
        )
    return (intensityArray, beats, tempo, [float(x) for x in beat_times])


# denoise the intensity array by a factor of n using a weighted moving average
def denoise_iterate(array, n, inplace=False):
    if inplace:
        array = array
    else:
        array = array.copy()
    for i in range(n):
        array = denoise(array)
    return array


def denoise(array):
    denoised = []
    for i in range(len(array)):
        if i == 0:
            denoised.append(array[i])
        elif i == len(array) - 1:
            denoised.append(array[i])
        else:
            denoised.append((array[i - 1] + array[i] + array[i + 1]) / 3)
    return denoised


if __name__ == "__main__":
    print(getIntensityArray("https://www.youtube.com/watch?v=1gJBqV0Ect4"))
