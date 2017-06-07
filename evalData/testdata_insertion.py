import http.client
import io
import os

if __name__ == "__main__":
    conn = http.client.HTTPConnection("0.0.0.0", 5000)

    for file in os.listdir("."):
        if file.endswith(".json"):
            str = open(file, "r", encoding="utf-8").read()
            conn.request("POST", "/api/projects", str.encode('utf-8'))
            res = conn.getresponse()
            print(res.status, res.reason)
