#!/bin/bash
docker rm -f narsacgm/nest-backend
docker rmi -f narsacgm/nest-backend
# docker image prune
# docker volume prune
docker build -t narsacgm/nest-backend .