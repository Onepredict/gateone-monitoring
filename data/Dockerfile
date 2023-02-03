FROM node:16.18.1-alpine
RUN mkdir -p /app
WORKDIR /app
RUN npm install -g json-server
COPY . /app
CMD json-server --watch /app/db.json --port 4000 --host 0.0.0.0