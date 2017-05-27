import requests
from elasticsearch import Elasticsearch

es = Elasticsearch(['http://elasticsearch:9200'])

def ping_elastic():
    res = requests.get('http://elasticsearch:9200')
    print("Elasticsearch ping: ", res.content)

def store_json(idx, doctype, docbody={}):
    res = es.index(index=idx, doc_type=doctype, id=1, body=docbody)
    print(res)
    print()
