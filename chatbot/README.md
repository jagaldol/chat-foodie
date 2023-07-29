# Chatbot

AI Chatbot of chatFoodie.

## Environment
> using python 3.11.2

### set python virtual environment
* Linux  
    ```sh
    $ source ./activate_venv.sh
    (.venv) $
    ```
* Windows  
    ```cmd
    > activate_venv.bat
    (.venv) >
    ```

### install packages
```shell
(venv) $ pip install -r requirements.txt
```

## Websocket Server for Chatbot AI

Deploy using API extensions from [oobabooga/text-generation-webui](https://github.com/oobabooga/text-generation-webui).

Please visit [chat-foodie-chatbot-server repo](https://github.com/jagaldol/chat-foodie-chatbot-server) that forked [text-generation-webui](https://github.com/oobabooga/text-generation-webui).

### Execution

```sh
$ git clone https://github.com/jagaldol/chat-foodie-chatbot-server.git
$ cd chat-foodie-chatbot-server
$ python download-model.py beomi/KoAlpaca-Polyglot-5.8B
$ python download-model.py sm136599/chatfoodie-koalpaca-polyglot-5_8b-2050step-4batch_1epoch
```

* Run in CPU  
    ```sh
    python server.py --api --api-streaming-port 80 --cpu --model beomi_KoAlpaca-Polyglot-5.8B --lora sm136599_chatfoodie-koalpaca-polyglot-5_8b-2050step-4batch_1epoch
    ```
* Run in GPU  
    ```sh
    python server.py --api --api-streaming-port 80 --load-in-4bit --model beomi_KoAlpaca-Polyglot-5.8B --lora sm136599_chatfoodie-koalpaca-polyglot-5_8b-2050step-4batch_1epoch
    ```

### Example of Deploy with Google Colab

<a href="https://colab.research.google.com/github/jagaldol/chat-foodie/blob/feature%2Frun-chatbot-server/chatbot/Deploy_chatbot_server_as_public_with_colab.ipynb" target="_parent"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/></a>

Deploy_chatbot_server_as_public_with_colab.ipynb

### Request Message Structure

```json
{
    "user_input": "그러면 비빔밥에 들어가는 재료를 알려줘",
    "max_new_tokens": 250,
    "history": { 
        "internal": [
            [
                "오늘 저녁 메뉴는 뭐가 좋을까?",
                "오늘 저녁 메뉴로는 비빔밥, 김치찌개, 제육볶음, 계란말이, 볶음밥 등이 좋을 것 같아요. 이러한 음식들은 풍부한 영양소와 맛있는 맛을 제공할 뿐 아니라 다양한 조리법을 활용하여 쉽게 만들 수 있으며, 간편하게 즐길 수 있습니다."
            ]
        ],
        "visible": [
            [
                "오늘 저녁 메뉴는 뭐가 좋을까?",
                "오늘 저녁 메뉴로는 비빔밥, 김치찌개, 제육볶음, 계란말이, 볶음밥 등이 좋을 것 같아요. 이러한 음식들은 풍부한 영양소와 맛있는 맛을 제공할 뿐 아니라 다양한 조리법을 활용하여 쉽게 만들 수 있으며, 간편하게 즐길 수 있습니다."
            ]
        ]
        },
    "mode": "chat",
    "character": "Example",
    "instruction_template": "Alpaca",
    "your_name": "You",

    "regenerate": false,
    "_continue": false,
    "stop_at_newline": false,
    "chat_prompt_size": 2048,
    "chat_generation_attempts": 1,
    "chat-instruct_command": "Continue the chat dialogue below. Write a single reply for the character '<|character|>'.\n\n<|prompt|>",
    "preset": "None",  
    "do_sample": true,
    "temperature": 0.7,
    "top_p": 0.9,
    "typical_p": 1,
    "epsilon_cutoff": 0,
    "eta_cutoff": 0,
    "tfs": 1,
    "top_a": 0,
    "repetition_penalty": 1.15,
    "top_k": 20,
    "min_length": 0,
    "no_repeat_ngram_size": 0,
    "num_beams": 1,
    "penalty_alpha": 0,
    "length_penalty": 1,
    "early_stopping": false,
    "mirostat_mode": 0,
    "mirostat_tau": 5,
    "mirostat_eta": 0.1,
    "seed": -1,
    "add_bos_token": true,
    "truncation_length": 2048,
    "ban_eos_token": false,
    "skip_special_tokens": true,
    "stopping_strings": []
}
```

* Put the message you want to send to the chatbot into user_input.
* By putting the conversation history into the `history`, Chatbot can remember the context of the conversation.

### Response Structure

Responses are passed continuously for each token generated. When the response is finished, an `"event": "stream_end"` is delivered.

* first message
```json
{
    "event": "text_stream",
    "message_num": 1,
    "history": {
        "internal": [
            [
                "오늘 저녁 메뉴는 뭐가 좋을까?",
                "오늘 저녁"
            ]
        ],
        "visible": [
            [
                "오늘 저녁 메뉴는 뭐가 좋을까?",
                "오늘 저녁"
            ]
        ]
    }
}
```

* complete response
```json
{
    "event": "text_stream",
    "message_num": 73,
    "history": {
        "internal": [
            [
                "오늘 저녁 메뉴는 뭐가 좋을까?",
                "오늘 저녁 메뉴로는 비빔밥, 김치찌개, 제육볶음, 계란말이, 볶음밥 등이 좋을 것 같아요. 이러한 음식들은 풍부한 영양소와 맛있는 맛을 제공할 뿐 아니라 다양한 조리법을 활용하여 쉽게 만들 수 있으며, 간편하게 즐길 수 있습니다."
            ]
        ],
        "visible": [
            [
                "오늘 저녁 메뉴는 뭐가 좋을까?",
                "오늘 저녁 메뉴로는 비빔밥, 김치찌개, 제육볶음, 계란말이, 볶음밥 등이 좋을 것 같아요. 이러한 음식들은 풍부한 영양소와 맛있는 맛을 제공할 뿐 아니라 다양한 조리법을 활용하여 쉽게 만들 수 있으며, 간편하게 즐길 수 있습니다."
            ]
        ]
    }
}
```

* end sign
```json
{
    "event": "stream_end",
    "message_num": 74
}
```