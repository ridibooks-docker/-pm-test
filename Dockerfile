FROM node:14-slim

WORKDIR /app
COPY *.js* ./
RUN npm install
