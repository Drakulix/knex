#!/bin/bash

mongod --replSet rs0

mongo <<EOF
	rs.initiate( {
		"_id": 'rs0',
		"members": [
			{
				"_id": 1,
				"host": "mongodb:27017"
			}
		]
	})
EOF>>