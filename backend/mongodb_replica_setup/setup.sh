echo "Waiting for startup.."
mongo --nodb wait.js
echo "Started.."

echo SETUP.sh time now: `date +"%T" `

mongo --host mongodb:27017 <<EOF
   var cfg = {
        "_id": "projectsRepSet",

        "members": [
            {
                "_id": 0,
                "host": "mongodb:27017",
                "priority": 1,
            }
        ]
    };
    rs.initiate(cfg);
EOF

sleep infinity
