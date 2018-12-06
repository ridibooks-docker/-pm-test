# pm-test 
postman api test 이미지


## Feature
테스트가 성공하면 success, 실패하면 failure 과 exit code 1을 뱉는다. 

### Environment
1. PM_API_KEY : [postman api key](https://docs.api.getpostman.com/#authentication)
2. COLLECTION_NAMES : 테스트 할 postman collection 이름들 (string 배열)
3. ENVIRONMENT : 테스트 할 postman environment 이름
4. STATUS_CHECK_URL : 서버가 정상 작동 함을 확인 할 수 있는 url (postman 테스트 전, 서버 정상작동을 확인 한 후, 실행함)

## How to use
1. 환경 변수 세팅을 한 후, 도커를 띄운다
2. 도커내에서 pm-test.sh를 실행한다.

## Installed
- node:slim

## TODO
- 에러 발생 시, slack api call