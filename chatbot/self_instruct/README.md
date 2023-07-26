# self-instruct

## description
generate_instruction.py 파일을 통해 OpenAI사의 API를 사용해 gpt3.5 turbo 모델로 데이터를 생성합니다. 데이터에는 instruction, input, output이 포함됩니다.

prompt 는 Alpaca 모델의 prompt를 참고하여 작성하였습니다.

* 사용 예시
  ```shell
  python generate_instruction.py --out_dir "생성된 데이터를 저장할 directory" --seed_tasks_path "seed 데이터(json) 위치" --num_instructions_to_generate 10000 --api_key "openAI API-KEY"

  python generate_instruction.py --out_dir "../datasets/gpt3_generations/" --seed_tasks_path "../datasets/seed_tasks.jsonl" --num_instructions_to_generate 10000 --api_key "KEY"
  ```

### parameters
--out_dir
* 생성된 데이터를 저장할 directory path
* required

--seed_tasks_path
* 데이터를 생성하기 위한 seed data 파일 path
* required

--num_instructions_to_generate
* 생성할 데이터 수
* default: 10

--model
* 사용할 모델 (openai chat 모델한정)
* default: gpt-3.5-turbo

--num_prompt_instructions
* prompt에 사용할 데이터 개수
* default: 8

--request_batch_size
* gpt3.5에 한 번에 보낼 요청 수
* default: 5

--api_key
* openAI에서 사용할 API KEY

--organization
* apenAI에 등록된 기관

## Citation
다음을 참고하여 코드를 작성하였음.
```bibtex
@misc{selfinstruct,
  title={Self-Instruct: Aligning Language Model with Self Generated Instructions},
  author={Wang, Yizhong and Kordi, Yeganeh and Mishra, Swaroop and Liu, Alisa and Smith, Noah A. and Khashabi, Daniel and Hajishirzi, Hannaneh},
  journal={arXiv preprint arXiv:2212.10560},
  year={2022}
}
```