# Repository name

gateone 계정 사용에 대한 상태를 확인하는 화면 (등록,반환 등의 이벤트 포함)

# User guide

```
https://onepredict.atlassian.net/wiki/spaces/FST/pages/1387888848/Manual+2023-02-03
```

# Prerequisite

```
[local 실행시]

1. gateone 화면 실행
# npm ci
# npm run dev

2. json-server 실행
# cd data
# npm install json-server
# json-server --port 3000 --watch db.json

[docker 실행시]

1. gateone 화면 실행
# docker build -t gateone-monitoring ./
# docker run -d --name gateone-monitoring -p 5000:3000 gateone-monitoring

2. json-server 실행
# cd data
# docker build -t common-json-server ./
# docker run -d --name common-json-server -p 4000:3000 -v /home/backoffice/yoonyoung/data:/app/data common-json-server
```

# Dockerize

```
# docker save -o gateone-monitoring.tar gateone-monitoring
# docker load -i gateone-monitoring.tar
# docker run -d --name gateone-monitoring -p 5000:3000 gateone-monitoring
# docker save -o common-json-server.tar common-json-server
# docker load -i common-json-server.tar
# docker run -d --name common-json-server -p 4000:3000 -v /home/backoffice/yoonyoung/data:/app/data common-json-server
```
