
# Knex

Knex is a knowledge sharing platform for research projects and papers.

This project is work in progress and not meant for production yet.

## Deployment

Knex contains a `docker-compose.yml` that shows roughly how to install and run knex on docker.

Follow the `Dockerfile` on how to compile knex manually, if you don't run docker.
Contribution on extending this explanation further would be appreciated.

## Development

For development a separate `docker-compose-dev.yml` is provided. Run it using:

```
sudo docker-compose -f docker-compose-dev.yml up
```

You should not need to rebuild the development container unless you change the dependencies of either the frontend or backend code.
Both will automatically reload, if changed, during runtime. Starting the containers is the only thing required to start hacking on knex!
