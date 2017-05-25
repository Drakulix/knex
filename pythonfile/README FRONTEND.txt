Usage for search API and testing for frontend:


when you start the docker image, first go to: 

http://localhost:5000/api/projects/dummyadd

This will add 3 projects to the elastic search indexer.

You can then search by sending a Elastic search request via POST to this url

http://localhost:5000/api/projects/search

The request has to send a json object like this:

{
  "query": {
    "bool": {
      "should": [
        {
          "query_string": {
            "query": "great project",
            "fields": [
              "description","title","tags"
            ]
          }
        }
      ]
    }
  }
}



This query is a very simple query and will search the text field and the tags field. You will get a result like this:

{
  "_shards": {
    "failed": 0, 
    "successful": 5, 
    "total": 5
  }, 
  "hits": {
    "hits": [
      {
        "_id": "3", 
        "_index": "projects-index", 
        "_score": 0.5716521, 
        "_source": {
          "author": "Mr x", 
          "description": "Here is anonther project not so great", 
          "tags": [
            "Something", 
            "XY-Testing", 
            "AnotherTag"
          ], 
          "timestamp": "2017-05-25T00:53:18.201116", 
          "title": "Building a database"
        }, 
        "_type": "Project"
      }, 
      {
        "_id": "2", 
        "_index": "projects-index", 
        "_score": 0.28488502, 
        "_source": {
          "author": "Max Mustermann", 
          "description": "Wow an awesome project I got here, check it out", 
          "tags": [
            "Project", 
            "Computer", 
            "TagsAreGreat"
          ], 
          "timestamp": "2017-05-25T00:53:18.201115", 
          "title": "My crazy Project"
        }, 
        "_type": "Project"
      }, 
      {
        "_id": "1", 
        "_index": "projects-index", 
        "_score": 0.24257512, 
        "_source": {
          "author": "James Comey", 
          "description": "Hi, I am a cool new project lets search for me ^^", 
          "tags": [
            "Performance", 
            "AB-Testing", 
            "AnotherTag"
          ], 
          "timestamp": "2017-05-25T00:53:18.201111", 
          "title": "AB Testing makes the difference"
        }, 
        "_type": "Project"
      }
    ], 
    "max_score": 0.5716521, 
    "total": 3
  }, 
  "timed_out": false, 
  "took": 44
}




These are not the final fields that will be used but I hope it is at least something for now and I guess enough so we can present at least something on Monday. For more info on the single fields, google "elasticsearch DSL query"
