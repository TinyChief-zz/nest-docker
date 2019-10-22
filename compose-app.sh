#! /usr/bin/env bash
sh create-image.sh
docker-compose -f ./docker-compose.yml up