# server

server of chatFoodie.

## dependency

* java version: [JAVA 17.0.2](https://jdk.java.net/archive/)
* spring boot version: 3.1.0

## API

### User

#### POST /join

* Request Body  
    ```json
    {
      "loginId": "test",
      "password": "test1234",
      "passwordCheck": "test1234",
      "name": "test회원",
      "gender": false,
      "birth": "2000-01-01",
      "email": "test@test.com"
    }
    ```
    * name, gender, birth 필수 X
    * ('회원', false, '2000-01-01') 이 기본 값으로 설정되어있음
    * 성별 -> 남자: false, 여자: true
    * 현재 위 데이터의 회원은 기본 가입 처리되어있음

* Response Body  
    ```json
    {
        "status": 200,
        "response": null,
        "errorMessage": null
    }
    ```

#### POST /login

* Request Body  
    ```json
    {
      "loginId": "test",
      "password": "test1234"
    }
    ```

* Response Header
    ```
    Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0IiwiaWQiOjEsImV4cCI6MTY5MTEzMzc2NH0.lC2RxRr_NHm23JCsccAIucBcIW21Dew-JgSLdKRRfd6hkSw3CyD_8r6D7kpcBkTtMjjDV8ptU5Blafqu3HIVGQ
    ```
  * JWT 토큰 헤더로 전달

* Response Body  
    ```json
    {
        "status": 200,
        "response": null,
        "errorMessage": null
    }
    ```

#### GET /users/{id}

* Response Body  
    ```
    {
    "status": 200,
    "response": {
        "id": 1,
        "loginId": "test",
        "name": "test회원",
        "gender": false,
        "birth": "2000-01-01",
        "email": "test@test.com",
        "favors": [
            {
                "id": 1,
                "foodName": "쌀국수",
                "likeScore": 1
            },
            {
                "id": 2,
                "foodName": "카레",
                "likeScore": 1
            }
        ]
    },
    "errorMessage": null
    }
    ```

