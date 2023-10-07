#!/bin/bash

java -jar -Dspring.profiles.active=product,mysql,private build/libs/server-1.0.0.jar