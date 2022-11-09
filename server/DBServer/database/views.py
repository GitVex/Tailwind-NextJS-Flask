import logging
from django.contrib.auth.models import User, Group
from .models import track, preset, tag
from rest_framework import viewsets, permissions
from .serializers import (
    UserSerializer,
    GroupSerializer,
    trackSerializer,
    presetSerializer,
    tagSerializer,
)
import environ
from functools import wraps
import jwt
from django.http import JsonResponse
from .utils import track_anyl
import json
import logging

# configure logger
logging.basicConfig(
    filename="server.log",
    filemode="a",
    format="%(asctime)s,%(msecs)d %(name)s %(levelname)s %(message)s",
    datefmt="%H:%M:%S",
    level=logging.DEBUG,
)

logger = logging.getLogger(__name__)

env = environ.Env()
environ.Env.read_env()


def get_token_auth_header(request):
    """
    Obtains the Access Token from the Authorization Header
    """
    auth = request.META.get("HTTP_AUTHORIZATION", None)
    parts = auth.split()
    token = parts[1]

    return token


def requires_scope(required_scope):
    """
    Determines if the required scope is present in the Access Token
    Args:
        required_scope (str): The scope required to access the resource
    """

    def require_scope(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = get_token_auth_header(args[0])
            decoded = jwt.decode(token, verify=False)
            if decoded.get("scope"):
                token_scopes = decoded["scope"].split()
                for token_scope in token_scopes:
                    if token_scope == required_scope:
                        return f(*args, **kwargs)
            response = JsonResponse(
                {"message": "You don't have access to this resource"}
            )
            response.status_code = 403
            return response

        return decorated

    return require_scope


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """

    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


# createa viewset for ambiencetrack model but is only allowed to view and not edit when not authenticated
# permission to edit only as the user who created the preset or as an admin
class trackViewSet(viewsets.ModelViewSet):

    queryset = track.objects.all()
    serializer_class = trackSerializer
    permission_classes = [
        #permissions.IsAuthenticated
    ]

    # access data from the request and log it
    def create(self, request, *args, **kwargs):
        # get the url from the request and generate the intensity array
        url = request.data.get("url")
        # if the duration is below 10 minutes, generate the intensity array
        duration = json.loads(request.data.get("duration"))
        duration = int(duration[0]) * 60 + int(duration[1])
        if duration <= 10:
            intensityArray = track_anyl.getIntensityArray(url)['intensityArray']
            request.data["intensityArray"] = intensityArray

        return super().create(request, *args, **kwargs)

    # get data from a track based on the query parameters from the url, if no parameters are given, return all tracks
    def list(self, request, *args, **kwargs):
        queryset = track.objects.all()
        # get the query parameters from the url
        query_params = request.query_params
        # if the query parameters are not empty, filter the queryset based on the query parameters
        if query_params:
            # filter the queryset based on the query parameters
            logging.debug(query_params)
            queryset = queryset.filter(**query_params)
        # return the filtered queryset
        serializer = trackSerializer(queryset, many=True)
        return JsonResponse(serializer.data, safe=False)

class presetViewSet(viewsets.ModelViewSet):
    queryset = preset.objects.all()
    serializer_class = presetSerializer
    permission_classes = [permissions.IsAuthenticated]


class tagViewSet(viewsets.ModelViewSet):
    queryset = tag.objects.all()
    serializer_class = tagSerializer
    permission_classes = []
