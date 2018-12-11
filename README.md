# pm-test 
postman api test 이미지

## Feature
1. 테스트가 성공하면 success, 실패하면 failure 과 exit code 1을 뱉는다. 
2. src에 이름에 맞는 collection 혹은 environment이 존재하면 사용하고, 존재하지 않으면 postman api로 가져 온다.
3. STATUS_CHECK_URL을 통해 서버가 정상 작동함을 체크를 하고 테스트를 실행한다. 5분간 해당 url에서 응답이 없으면 exit code1을 뱉는다.

### Environment
1. PM_API_KEY : [postman api key](https://docs.api.getpostman.com/#authentication)
2. COLLECTION_NAMES : 테스트 할 postman collection 이름들 (","로 구분함)
3. ENVIRONMENT : 테스트 할 postman environment 이름
4. STATUS_CHECK_URL : 서버가 정상 작동 함을 확인 할 수 있는 url (postman 테스트 전, 서버 정상작동을 확인 한 후, 실행함)

## How to use
1. 환경 변수 세팅을 하고, 사용하고 싶은 파일이 있으면 "/tmp/src/"에 마운트를 해서 도커를 띄운다

2. 도커 내에서 pm-test.sh를 실행한다.

### 예시
1. src 파일
```
 # src/
 COLLECTION_NAME1.postman_collection.json (postman export 그대로)
 COLLECTION_NAME2.postman_collection.jso로
 ENVIRONMENT.postman_environment.json
```
2. COLLECTION_NAMES
```
COLLECTION_NAMES="COLLECTION_NAME1,COLLECTION_NAME2"
```
## Installed
- node:slim

## TODO
- 에러 발생 시, slack api call