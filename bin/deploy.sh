#!/bin/sh

docker build -t deca/siribot .
docker tag deca/siribot smartdockerrepo.azurecr.io/deca/siribot
docker push smartdockerrepo.azurecr.io/deca/siribot
