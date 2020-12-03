#!/bin/sh

docker build -t deca/siribot ./bot -f ./bot/Dockerfile.production
docker tag deca/siribot smartdockerrepo.azurecr.io/deca/siribot
docker push smartdockerrepo.azurecr.io/deca/siribot
