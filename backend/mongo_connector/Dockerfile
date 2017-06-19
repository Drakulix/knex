FROM python:3

RUN pip install 'mongo-connector[elastic5]'

COPY mongo-connector-config.json ./
CMD /bin/sh -c 'sleep 15; mongo-connector --auto-commit-interval=0 -m mongodb_replica:27017 -t elasticsearch:9200 -d elastic2_doc_manager -c mongo-connector-config.json'
