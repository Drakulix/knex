import os
import requests

if __name__ == "__main__":
    session = requests.Session()
    data = {"email": "admin@knex.com", "password": "admin"}
    session.post("http://localhost:5000/api/users/login", data=data)

    for file in os.listdir("."):

        if file.endswith(".json"):
            text = open(file, "r").read()
            res = session.post("http://localhost:5000/api/projects", data=text.encode('utf-8'),
                               headers={'Content-Type': 'application/json'})
            print(res)

        elif file.endswith(".json5"):
            text = open(file, "r").read()
            res = session.post("http://localhost:5000/api/projects", data=text.encode('utf-8'),
                               headers={'Content-Type': 'application/json5'})
            print(res)

    session.get("http://localhost:5000/api/users/logout")
