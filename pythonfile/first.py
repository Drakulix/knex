from pymongo import MongoClient
import elastic
import time

time.sleep(5) #wait for initialisation of elasticsearch and mongodb...
#FIXME: exception handling

jsonstring = {
    "title": "test_project",
    "url": "www.github.com/knex/",
    "analysis":
    {
      "url": "here-you-find-the-analysis.com",
      "description": "thats what this analysis is about"
    },
    "authors":
    [
      {
      "name": "test_owner",
      "email": "email@address.com"
      }
    ],
    "team":
    {
      "team_name": "teamname",
      "members":
      [
        {
          "name": "member1",
          "email": "member1@team.com"
        },
        {
          "name": "member2",
          "email": "member2@team.com"
        }
      ]
    },
    "status": "DONE",
    "description": "can this be a multiline description?",
    "date_creation": "1970-01-01",
    "date_last_updated": "2017-05-11",
    "tags":
    [
      "tag",
      "bio"
    ],
    "future_work":
    [
      {
        "title": "this is something related to this work",
        "author": "the_author_of_this_awesome_work",
        "email": "email@example.com",
        "description": "some description of the work that will be done in the future"
      }
    ],
    "related_projects":
    [
      {
        "id": 0,
        "name": "name of the listed project",
        "author": "author",
        "url": "www.my.url"
      }
    ]
}

def get_db():
    client = MongoClient('mongodb:27017')
    db = client.knexDBmh1 #client.database
    return db

def add_json(db, json):
    db.jsoncollection.insert(json)
    
def get_random_json(db):
    return db.jsoncollection.find_one()

def find_by_title(db, title):
    return db.jsoncollection.find({"title": title})

if __name__ == "__main__":
    db = get_db()
    res = find_by_title(db, "test_project")
    print("Found ", res.count(), "projects:")
    print()
    if res.count() is 0:
        add_json(db, jsonstring)
    for project in res:
        print(project)
        print()
    elastic.elastic_example()
