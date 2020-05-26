# pm-test 
postman api test 이미지

## Feature
1. 테스트가 성공하면 exit code 0, 실패하면 exit code 1을 리턴한다
2. 테스트 실행 전 서버가 정상 작동함을 사전 체크한다. 5분간 health check url에서 응답이 없으면 exit code 1을 리턴한다.

### Environment
1. PM_API_KEY : [postman api key](https://docs.api.getpostman.com/#authentication)

## How to use
```sh
$ git clone https://github.com/ridibooks-docker/pm-test.git
$ cd pm-test

$ # launch locally
$ node pm-test.js --help

$ # or install globally
$ npm install -g .
$ pm-test --help
```

### 예시
1. 로컬 파일 이용
```sh
$ pm-test dir docs/postman/src  # local 환경으로 src 폴더 내의 모든 컬렉션 실행

$ cd docs/postman/src
$ pm-test dir .  # 아무 경로나 가능

$ pm-test dir . -e development  # development 환경으로 현위치의 모든 컬렉션 실행 (-e 옵션 생략시 local)
$ pm-test dir . -c Annotations,Progress  # 현위치의 컬렉션들 중 이름이 Annotations, Progress인 것만 실행 (없으면 에러, 생략시 전부 실행)

$ pm-test dir . --health-check-url "https://libray-api/health"  # 테스트를 시작하기 전 해당 url에 HEAD 요청을 날려 200 응답이 올 때까지 최대 5분간 대기한다

$ pm-test dir . -q  # CI 등 화려한 출력 필요가 없을 경우 -q 사용
```

2. API 이용
```sh
$ pm-test api "Library Api" PMAK-12345  # 해당 키로 인증해 Library Api 워크스페이스를 가져와 local 환경으로 해당 워크스페이스의 모든 컬렉션을 실행
$ pm-test api "Library Api" PMAK-12345 -e development -c ShelfOperation  # 위 옵션들 다 사용 가능

$ export PM_API_KEY=PMAK-12345
$ pm-test api "Library Api"  # API KEY는 편한 로컬 테스팅을 위해 셸 환경변수에 담아둘 수 있다
$ pm-test api "Library Api" PMAK-56789  # 우선순위는 인자에 있음
```