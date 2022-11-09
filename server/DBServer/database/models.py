from email.policy import default
from django.db import models
from django.contrib.auth.models import User

# Create your models here.
# create django model for ambience tags to be used for filtering
class tag(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


# create django model for an ambience track from spotify, youtube or soundcloud
class track(models.Model):
    title = models.CharField(max_length=100)
    artist = models.CharField(max_length=100)
    duration = models.TextField(default="[]")
    url = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.CharField(max_length=300)
    tags = models.ManyToManyField(tag, blank=True)
    intensityArray = models.TextField(default="[]")


    def __str__(self):
        return self.title

# create django model for an ambience preset consisting of multiple ambience tracks along with their settings
class preset(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    tracks = models.ManyToManyField(track, through='presetTrack')

    def __str__(self):
        return self.name

class presetTrack(models.Model):
    ambiencePreset = models.ForeignKey(preset, on_delete=models.CASCADE)
    ambienceTrack = models.ForeignKey(track, on_delete=models.CASCADE)
    volume = models.IntegerField(default=50)
    clampStart = models.IntegerField(default=0)
    clampEnd = models.IntegerField(default=100)

    def __str__(self):
        return self.ambiencePreset.name + " - " + self.ambienceTrack.title


