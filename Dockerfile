FROM ubuntu:latest

RUN apt-get update
RUN apt-get install -y --no-install-recommends ca-certificates curl apt-transport-https lsb-release
RUN curl https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -
RUN echo 'deb https://deb.nodesource.com/node_8.x xenial main' > /etc/apt/sources.list.d/nodesource.list
RUN echo 'deb-src https://deb.nodesource.com/node_8.x xenial main' >> /etc/apt/sources.list.d/nodesource.list
RUN apt-get update
RUN apt-get install -y --no-install-recommends python3 python3-pip nodejs build-essential

WORKDIR /usr/src/app

COPY backend backend
COPY web web

RUN pip3 install -U pip setuptools
RUN pip3 install --no-cache-dir -r backend/requirements.txt
RUN npm install -g yarn
RUN cd web; yarn; yarn build; cd ..

RUN mkdir /usr/app
RUN cp -R backend/* /usr/app
RUN cp -R web/build /usr/app/static
RUN rm -rf /usr/src/app

WORKDIR /usr/app
CMD [ "python3", "flask_api.py" ]
