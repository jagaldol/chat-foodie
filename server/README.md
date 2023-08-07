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
            "foodId": 1,
            "foodName": "쌀국수"
          },
          {
            "foodId": 2,
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

#### POST /api/favors

유저의 음식 선호도 저장
* 기존 선호도 존재 시 삭제 후 요청 받은 값으로 저장

* Request Body
  ```json
  {
    "foodIds": [ 1, 15, ... ]
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
    "email": "user@example.com"
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
    "email": "user@example.com",
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

### Chatroom

#### POST /api/chatrooms

새로운 대화방 생성

* Response Body
  ```json
  {
    "status": 200,
    "response": null,
    "errorMessage": null
  }
  ```

#### GET /api/chatrooms

회원의 채팅방 목록 조회

최근에 만든 채팅방이 제일 앞에 있음 채팅방 제목은 `2023-08-06 09:31 생성`의 형태로 현재 시간에 따라 자동 부여 된다.

* Response Body
  ```json
  {
    "status": 200,
    "response": [
      {
        "id": 3,
        "title": "저녁 메뉴 추천",
      },
      {
        "id": 2,
        "isFromChatbot" : true,
        "title": "2023-08-06 09:31 생성"
      },
      {
        "id": 1,
        "title" : "2023-08-06 21:30 생성"
      }
    ],
    "errorMessage": null
  }
  ```

#### PUT /api/chatrooms/{chatroomID}

채팅방 제목 변경

* Request Body
  ```json
  {
    "title": "오늘의 저녁 메뉴"
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

#### DELETE /api/chatrooms/{chatroomID}

채팅방 삭제 및 채팅방에 존재하던 대화내역(message)도 함께 삭제

* Response Body
  ```json
  {
    "status": 200,
    "response": null,
    "errorMessage": null
  }
  ```

#### GET /api/chatrooms/{chatroomId}/messages

대화 기록 조회

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

## WebSocket

### WebSocket /api/public-chat

(비회원 메서드)사용자의 입력을 전달하고 답변을 스트리밍으로 돌려 받음

하루에 메시지 생성 가능 횟수 제한

* Request Message
  ```json
  {
    "input" : "피자 때문에 배가 아픈데 속이 편한 음식을 알려줘",
    "history" : [
      [
        "안녕하세요!",
        "안녕하세요! 반갑습니다."
      ],
      [
        "저녁 메뉴 추천해줘",
        "오리고기, 김치찌개, 생선구이, 들깨나물무침 등이 좋은 저녁 식사가 될 수 있습니다."
      ]
    ],
    "regenerate" : false,
    "continue" : false,
  }
  ```
  * `regenerate`와 `continue`를 사용하여 이전 답변 재 생성과 답변 이어서 생성이 가능하다.

* Response Messages
  ```json
  {
    "event"  : "text_stream",
    "response": "부드러운"
  }
  ```

  ```json
  {
    "event"  : "text_stream",
    "response": "부드러운 계란말이나, 매콤한 김치찌개"
  }
  ```

  ...

  ```json
  {
    "event"  : "text_stream",
    "response": "부드러운 계란말이나, 매콤한 김치찌개, 콩나물국, 그리고 야채볶음밥 등이 속을 편안하게 해 줄 수 있는 음식입니다. 이러한 음식들은 소화가 잘 되고 건강에도 좋으며, 간단하면서도 맛있어서 야식으로 많이 즐겨먹는 음식입니다"
  }
  ```
  ```json
  {
    "event"  : "stream_end"
  }
  ```

### WebSocket /api/chat

(회원 전용 메서드)사용자의 입력을 전달하고 답변을 스트리밍으로 돌려 받음

* 하루 채팅 제한 존재 X
* 서버에서 회원 선호도를 추가하여 챗봇에게 전달하게 된다.
* 별도의 history는 없이 채팅방 번호가 전달된다.


* Request Message
  ```json
  {
    "input" : "피자 때문에 배가 아픈데 속이 편한 음식을 알려줘",
    "chatroomId" : 1,
    "regenerate" : false,
    "continue" : false,
  }
  ```
  * `regenerate`와 `continue`를 사용하여 이전 답변 재 생성과 답변 이어서 생성이 가능하다.

* Response Messages
  ```json
  {
    "event"  : "text_stream",
    "response": "부드러운"
  }
  ```

  ```json
  {
    "event"  : "text_stream",
    "response": "부드러운 계란말이나, 매콤한 김치찌개"
  }
  ```

  ...

  ```json
  {
    "event"  : "text_stream",
    "response": "부드러운 계란말이나, 매콤한 김치찌개, 콩나물국, 그리고 야채볶음밥 등이 속을 편안하게 해 줄 수 있는 음식입니다. 이러한 음식들은 소화가 잘 되고 건강에도 좋으며, 간단하면서도 맛있어서 야식으로 많이 즐겨먹는 음식입니다"
  }
  ```
  ```json
  {
    "event"  : "stream_end"
  }
  ```