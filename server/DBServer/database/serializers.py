from django.contrib.auth.models import User, Group
from .models import track, preset, tag
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class trackSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = track
        fields = ['url', 'title', 'artist', 'duration', 'url', 'created_at', 'updated_at', 'created_by', 'tags', 'intensityArray']

class presetSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = preset
        fields = ['url', 'name', 'created_at', 'updated_at', 'created_by', 'tracks']

class tagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = tag
        fields = ['name']