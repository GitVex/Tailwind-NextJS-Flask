from django.contrib.auth import authenticate
import json
import jwt
import requests
import environ

env = environ.Env()
environ.Env.read_env()

def jwt_get_username_from_payload_handler(payload):
    username = payload.get('created_by').replace("|", ".")
    if not username:
        raise Exception('Payload does not contain username')
    authenticate(remote_user=username)
    return username

def jwt_decode_token(token):
    header = jwt.get_unverified_header(token)
    jwks = requests.get(f'https://{"dev-on8asmzunu8x7eec.us.auth0.com"}/.well-known/jwks.json').json()
    public_key = None
    for jwk in jwks['keys']:
        if jwk['kid'] == header['kid']:
            public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk))

    if public_key is None:
        raise Exception('Public key not found.')

    issuer = f'https:// {"dev-on8asmzunu8x7eec.us.auth0.com"} /'
    return jwt.decode(token, public_key, audience=env('AUTH0_IDENTIFIER'), issuer=issuer, algorithms=['RS256'])
