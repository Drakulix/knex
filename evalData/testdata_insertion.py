import http.client
import io
import os
import json

if __name__ == "__main__":
    conn = http.client.HTTPConnection("0.0.0.0", 5000)

    for file in os.listdir("."):

        if file.endswith(".json"):
            str = open(file, "r").read()
            conn.request("POST", "/api/projects", str.encode('utf-8'),
                         headers={'Content-Type': 'application/json'})
            res = conn.getresponse()
            print(res.status, res.reason)

        elif file.endswith(".json5"):
            str = open(file, "r").read()
            conn.request("POST", "/api/projects", str.encode('utf-8'),
                         headers={'Content-Type': 'application/json5'})
            res = conn.getresponse()
            print(res.status, res.reason)
