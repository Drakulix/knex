#!/bin/bash

/usr/bin/mongod --replSet rs

mongo <<EOF
	rs.initiate( {
		"_id": 'rs',
		"members": [
			{
				"_id": 1,
				"host": "mongodb:27017"
			}
		]
	})
EOF