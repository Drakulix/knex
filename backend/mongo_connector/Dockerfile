FROM python:3.4

RUN pip install 'mongo-connector[elastic5]'


COPY mongo-connector-config.json ./
CMD ["sleep", "15"]
CMD mongo-connector -m mongodb:27017 -t elasticsearch:9200 -d elastic2_doc_manager -c mongo-connector-config.json