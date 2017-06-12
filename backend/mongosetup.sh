#!/bin/bash

mongod --replSet rs0

mongo <<EOF
	rs.initiate()
	rs.conf()
	rs.status()
EOF