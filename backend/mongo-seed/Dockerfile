FROM mongo

COPY ./init.json ./init.json
CMD mongoimport --host mongodb:27017 --db knex --collection projects --type json --file init.json --jsonArray