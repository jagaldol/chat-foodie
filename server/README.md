# server

server of chatFoodie.

## dependency

* java version: [JAVA 17.0.2](https://jdk.java.net/archive/)
* spring boot version: 3.1.0

## API

### User

#### POST /api/join

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

#### POST /api/login

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

#### GET /api/users/{id}

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
            "foodName": "쌀국수"
          },
          {
            "id": 2,
            "foodName": "카레"
          }
        ]
      },
      "errorMessage": null
    }
    ```

#### PUT /api/users/{id}

* Request Body
  ```json
  {
    "loginId": "changedId",
    "password": "changedPassword",
    "passwordCheck": "changedPassword",
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
  
  * 보내진 정보 중 비어 있지 않은 정보에 대한 업데이트

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

#### GET /api/foods/random?size=30

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
  
### Favor

#### POST /api/favor/saveUserFoodPreference

유저의 음식 선호도 저장
* 기존 선호도 존재 시 삭제 후 요청 받은 값으로 저장

* Request Body
  ```json
  {
    "userId": 1,
    "favorIds": [ 1, 15, ... ]
  }
  ```
  
* Response Body
  ```json
  {
    "status": 200,
    "response": null,
    "errorMessage": null
  }
  ```

### Email-Verification

#### POST /api/email-verifications

이메일 인증 코드 전송

* Request Body
  ```json
  {
    "userId": "user@example.com"
  }
  ```

* Response Body
  ```json
  {
    "status": 200,
    "response": null,
    "errorMessage": null
  }
  ```
  
#### POST /api/email-verifications/confirm

이메일 인증 코드 확인

* Request Body
  ```json
  {
    "userId": "user@example.com",
    "verificationCode": "123456"
  }
  ```

* Response Body
  ```json
  {
    "status": 200,
    "response": null,
    "errorMessage": null
  }
  ```

### Message

### Post /api/message/message-exchange

챗봇에 사용자의 메시지 전달과 챗봇에서 생성된 메시지 사용자에게 출력

* Request Body
  ```json
  {
    "content" : "저녁 메뉴 추천해줘",
    "isFromChatbot" : false,
    "isRegenerate" : false
  }
  ```

* Response Body
  ```json
  {
    "status": 200,
    "response": {
      "content" : "오리고기, 김치찌개, 생선구이, 들깨나물무침 등이 좋은 저녁 식사가 될 수 있습니다.",
      "isFromChatbot" : true
    },
    "errorMessage": null
  }
  ```

### Post /api/message/regenerate-message

답변 재생성

* Request Body
  ```json
  {
    "content" : "저녁 메뉴 추천해줘",
    "isFromChatbot" : false,
    "isRegenerate" : true
  }
  ```

* Response Body
  ```json
  {
    "status": 200,
    "response": {
      "content" : "돈까스를 추천드립니다!",
      "isFromChatbot" : true
    },
    "errorMessage": null
  }
  ```
  
### Get /api/message/chat-history

저장된 대화 기록 조회

* Response Body
  ```json
  {
    "status": 200,
    "response": [
    {
      "id": 1,
      "isFromChatbot" : false,
      "content": "안녕하세요!",
      "created_at": "2023-08-01T12:34:56"
    },
    {
      "id": 2,
      "isFromChatbot" : true,
      "content": "안녕하세요! 반갑습니다.",
      "created_at": "2023-08-01T12:35:02"
    },
    {
      "id": 3,
      "isFromChatbot" : false,
      "content": "저녁 메뉴 추천해줘",
      "created_at": "2023-08-01T12:36:18"
    },
    {
      "id": 4,
      "isFromChatbot" : true,
      "content": "오리고기, 김치찌개, 생선구이, 들깨나물무침 등이 좋은 저녁 식사가 될 수 있습니다.",
      "created_at": "2023-08-01T12:36:24"
    }
    ],
    "errorMessage": null
  }
  ```

### Post /api/message/save-chat-history

대화 기록 저장

* Request Body
  ```json
  {
    "userId": 1,
    "content" : "저녁 메뉴 추천해줘"
  }
  ```

* Response Body
  ```json
  {
    "status": 200,
    "response": null,
    "errorMessage": null
  }
  ```

### Post /api/message/create-new-chat

새로운 대화창 생성

* Request Body
  ```json
  {
    "userId": 1
  }
  ```

* Response Body
  ```json
  {
    "status": 200,
    "response": null,
    "errorMessage": null
  }
  ```
  





