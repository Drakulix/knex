import io
import os
import json
import requests

if __name__ == "__main__":
    session = requests.Session()
    data = {"email": "admin@knex.com", "password": "admin"}
    session.post("http://localhost:3000/api/users/login", data=data)

    for file in os.listdir("."):

        if file.endswith(".json"):
            str = open(file, "r").read()
            res = session.post("http://localhost:3000/api/projects", data=str.encode('utf-8'),
                               headers={'Content-Type': 'application/json'})
            print(res)

        elif file.endswith(".json5"):
            str = open(file, "r").read()
            res = session.post("http://localhost:3000/api/projects", data=str.encode('utf-8'),
                               headers={'Content-Type': 'application/json5'})
            print(res)

    session.get("http://localhost:3000/api/users/logout")
