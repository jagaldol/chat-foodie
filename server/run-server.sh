#!/bin/bash

java -jar -Dspring.profiles.active=product,mysql,private build/libs/server-0.0.1.jar