FROM node:slim

ADD ./bin /tmp
WORKDIR /tmp
RUN npm install
