MONGODB=`ping -c 1 mongodb_replica | head -1  | cut -d "(" -f 2 | cut -d ")" -f 1`

echo "Waiting for startup.."
mongo --nodb wait.js
echo "Started.."

echo SETUP.sh time now: `date +"%T" `
mongo --host ${MONGODB}:27017 <<EOF
   var cfg = {
        "_id": "projectsRepSet",

        "members": [
            {
                "_id": 0,
                "host": "${MONGODB}:27017",
            }
        ]
    };
    rs.initiate(cfg, { force: true });
    rs.reconfig(cfg, { force: true });
    db.getMongo().setReadPref('nearest');
    rs.slaveOk();
EOF

sleep infinity
