import requests
from elasticsearch import Elasticsearch

es = Elasticsearch(['http://elasticsearch:9200'])


def ping_elastic():
    res = requests.get('http://elasticsearch:9200')
    print("Elasticsearch ping: ", res.content)


def store_json(idx, doctype, docbody):
    res = es.index(index=idx, doc_type=doctype, id=1, body=docbody)
    print(res)
    print()


def print_results(results, field):
    data = [doc for doc in results['hits']['hits']]
    for doc in data:
        print("id = %s, %s = %s" % (doc['_id'], field, doc['_source'][field]))
        print()
        print(doc)


def elastic_example():
    ping_elastic()
    store_json("test", "projects", "dummy")
    res = es.search(index="test", doc_type="projects", body={"query": {"match": {"status": "DONE"}}})
    print("jsonfile: %d documents found" % res['hits']['total'])
    print()
    print_results(res, 'status')
    return "jsonfile: %d documents found" % res['hits']['total']
