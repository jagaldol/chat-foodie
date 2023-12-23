#!/bin/bash

export $(cat .env | xargs)

java -jar -Dspring.profiles.active=product build/libs/server-1.0.0.jar