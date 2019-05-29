FROM node:10-slim

ADD ./bin /tmp
WORKDIR /tmp
RUN npm install
