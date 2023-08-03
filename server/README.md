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
    ```json
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

#### PUT /users/{id}

* Request Body
  ```json
  {
    "loginId": "changedId",
    "password": "changedPassword",
    "name": "changedName",
    "gender": true (or false),
    "birth": "changedBirth(2000-01-01)"
  }
  ```
  * 변경 가능한 개인 정보
    * 아이디
    * 비밀번호
    * 이름
    * 성별
    * 생년월일
  
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

### Food

#### GET /foods/random?size=30

음식 목록을 랜덤하게 리턴

* Query String

| Param | Description    |
|-------|----------------|
| size  | 음식 개수(기본 값 30) |

* Response Body

    ```json
    {
      "status": 200,
      "response": {
        "foods": [
          {
            "id": 29,
            "name": "불고기",
            "imageUrl": "/images/불고기.jpg"
          },
          {
            "id": 6,
            "name": "스테이크",
            "imageUrl": "/images/스테이크.jpg"
          },
          ...
          {
            "id": 13,
            "name": "돈카츠",
            "imageUrl": "/images/돈카츠.jpg"
          }
        ]
      },
      "errorMessage": null
    }
    ```

#### POST /foods/saveUserFoodPreference

