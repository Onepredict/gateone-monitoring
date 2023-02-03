# Repository name
gateone 계정 사용에 대한 상태를 확인하는 화면 (등록,반환 등의 이벤트 포함)

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
# docker build -t gateone-dashboard ./
# docker run -d --name gateone-dashboard -p 5000:5000 gateone-dashboard

2. json-server 실행
# cd data
# docker build -t common-json-server ./
# docker run -d --name common-json-server -p 4000:3000 common-json-server
```

# Dockerize
```
docker save -o gateone-dashboard.tar gateone-dashboard
docker load -i gateone-dashboard.tar
docker run -d --name gateone-dashboard -p 5000:5000 gateone-dashboard

docker save -o common-json-server.tar common-json-server
docker load -i common-json-server.tar
docker run -d --name common-json-server -p 4000:3000 common-json-server
```
