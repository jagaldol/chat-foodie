import os
import json
import random
import re
import string
import tqdm
import argparse
import numpy as np
import pandas as pd
import time
from multiprocessing import Pool
from functools import partial
from rouge_score import rouge_scorer
from gpt3_api import make_requests

def encode_prompt(prompt_instructions):
    """Encode multiple prompt instructions into a single string."""
    prompt = open("./chatbot/self_instruct/prompt.txt").read() + "\n"

    for idx, task_dict in enumerate(prompt_instructions):
        (instruction, input, output) = task_dict["instruction"], task_dict["input"], task_dict["output"]
        instruction = re.sub(r"\s+", " ", instruction).strip().rstrip(":")
        input = "<noinput>" if input.lower() == "" else input
        prompt += f"###\n"
        prompt += f"{idx + 1}. Instruction: {instruction}\n"
        prompt += f"{idx + 1}. Input: {input}\n"
        prompt += f"{idx + 1}. Output: {output}\n"
    prompt += f"###\n"
    prompt += f"{idx + 2}. Instruction: "
    return prompt

def post_process_gpt3_response(num_prompt_instructions, result):
    if result is None:
        return []

    
    instructions = []
    raw_instructoins = f"\n{num_prompt_instructions+1}. Instruction: " + result["message"]["content"]
    raw_instructoins = re.split("###", raw_instructoins)
    
    for idx, inst in enumerate(raw_instructoins):
        if idx == len(raw_instructoins) - 1 and result["finish_reason"] == "length":
            continue

        idx += num_prompt_instructions + 1
        splitted_data = re.split(f"{idx}\.\s+(Instruction|Input|Output):", inst)
        if len(splitted_data) != 7:
            # print("길이가 7이 안됨")
            continue
        else:
            inst = splitted_data[2].strip()
            input = splitted_data[4].strip()
            input = "" if input.lower() == "<noinput>" else input
            output = splitted_data[6].strip()
        
        # instruction의 길이가 너무 짧거나 너무 길면 버린다.
        if len(inst.split()) <= 3 or len(inst.split()) > 150:
            # print("instruction 길이가 너무 짧거나 김")
            continue
        
        blacklist = [
            "사진",
            "사진을",
            "이미지",
            "이미지를",
            "그래프",
            "그래프를",
            "파일",
            "파일을",
            "맵",
            "맵을",
            "영상",
            "영상을",
            "동영상",
            "동영상을",
            "비디오",
            "비디오를",
            "음악",
            "음악을",
            "다이어그램",
            "다이어그램을"
        ]
        blacklist += []
        if any(find_word_in_string(word, inst) for word in blacklist):
            # print("금지 단어 찾음")
            continue
        
        if inst[0] in string.punctuation:
            # print("punctuation에 걸림")
            continue

        instructions.append({"instruction": inst, "input": input, "output": output})
    return instructions

def find_word_in_string(w, s):
    return re.compile(r"\b({0})\b".format(w), flags=re.IGNORECASE).search(s)

def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--out_dir",
        type=str,
        required=True,
        default="datasets/gpt3_generations/",
        help="출력이 저장되는 directory",
    )
    parser.add_argument(
        "--seed_tasks_path",
        type=str,
        required=True,
        default="datasets/seed_tasks.jsonl",
        help="사람이 적은 데이터 경로",
    )
    parser.add_argument(
        "--num_instructions_to_generate",
        type=int,
        default=10,
        help="생성할 instruction 개수",
    )
    parser.add_argument(
        "--model",
        type=str,
        default="gpt-3.5-turbo",
        help="사용할 모델(엔진)",
    )
    parser.add_argument(
        "--num_prompt_instructions",
        type=int,
        default=8,
        help="prompt에 사용할 instruction의 개수",
    )
    parser.add_argument(
        "--request_batch_size",
        type=int,
        default=5,
        help="gpt3.5에게 한 번에 보낼 요청 수",
    )
    parser.add_argument(
        "--api_key",
        type=str,
        help="API키",
    )
    parser.add_argument(
        "--organization",
        type=str,
        help="The organization to use. If not specified, the default organization id will be used.",
    )
    return parser.parse_args()

if __name__ == "__main__":
    num_cpus = 4
    num_to_include_machine_instruction = 2

    args = parse_args()
    seed_tasks = [json.loads(l) for l in open(args.seed_tasks_path, "r", encoding="utf-8")]
    seed_instructions = [
        {"instruction": t["instruction"], "input": t["instances"][0]["input"], "output": t["instances"][0]["output"]}
        for t in seed_tasks
    ]
    print(f"Loaded {len(seed_instructions)} human-written seed instructions")
    # print(seed_instructions)

    os.makedirs(args.out_dir, exist_ok=True)
    request_idx = 0

    # gpt3.5를 통해 생성된 instruction 
    machine_instructions = []
    # 이미 생성된 instruction이 있으면 불러오기
    if os.path.exists(os.path.join(args.out_dir, "machine_generated_instructions.jsonl")):
        with open(os.path.join(args.out_dir, "machine_generated_instructions.jsonl"), "r", encoding="utf-8") as fin:
            for l in fin:
                tmp = json.loads(l) 
                machine_instructions.append(tmp)
            print(f"Loaded {len(machine_instructions)} machine-generated instructions")

    # 유사도 = {}
    scorer = rouge_scorer.RougeScorer(["rougeL"], use_stemmer=False)
    
    # new instructions 생성
    progress_bar = tqdm.tqdm(total=args.num_instructions_to_generate)
    if machine_instructions:
        progress_bar.update(len(machine_instructions))

    # seed instruction and machine instructions 를 모두 token으로 만든다.
    all_instructions = [d["instruction"] for d in seed_instructions] + \
                       [d["instruction"] for d in machine_instructions]
    all_instruction_tokens = [scorer._tokenizer.tokenize(inst) for inst in all_instructions]

    # with open(os.path.join(args.batch_dir, "machine_generated_instructions.jsonl"), "a", encoding="utf-8") as fout:
    while len(machine_instructions) < args.num_instructions_to_generate:
        request_idx += 1

        batch_inputs = []
        for _ in range(args.request_batch_size):
            if len(machine_instructions) > num_to_include_machine_instruction:
                prompt_instructions = random.sample(seed_instructions, args.num_prompt_instructions - num_to_include_machine_instruction)
                prompt_instructions += random.sample(machine_instructions, num_to_include_machine_instruction)
            else:
                prompt_instructions = random.sample(seed_instructions, args.num_prompt_instructions)
            prompt = encode_prompt(prompt_instructions)
            batch_inputs.append(prompt)

        print("요청 시작")
        request_start = time.time()
        results = make_requests(
            model=args.model,
            messages=batch_inputs, 
            max_tokens=2048, 
            temperature=1, 
            top_p=1,
            n=1, 
            stream=False,  
            frequency_penalty=0, 
            presence_penalty=0, 
            stop=["\n20", "20.", "20."], 
            logit_bias={"50256": -100},
            user=None,
            retries=3, 
            api_key=args.api_key, 
            organization=args.organization
        )
        request_duration = time.time() - request_start
        print("요청 끝")

        print("후처리 시작")
        process_start = time.time()
        instruction_data = []
        for result in results:
            new_instructions = post_process_gpt3_response(args.num_prompt_instructions, result)
            instruction_data += new_instructions
        
        total = len(instruction_data)
        keep = 0

        for instruction_data_entry in instruction_data:
            new_instruction_tokens = scorer._tokenizer.tokenize(instruction_data_entry["instruction"])
            with Pool(num_cpus) as p:
                rouge_scores = p.map(
                    partial(rouge_scorer._score_lcs, new_instruction_tokens),
                    all_instruction_tokens
                )
            rouge_scores = [score.fmeasure for score in rouge_scores]
            most_similar_instructions = {
                all_instructions[i]: rouge_scores[i] for i in np.argsort(rouge_scores)[-10:][::-1]
            }
            if max(rouge_scores) > 0.7:
                # print("유사도가 너무 높음")
                continue
            else:
                keep += 1

            # instruction_data_entry["most_similar_instructions"] = most_similar_instructions
            # instruction_data_entry["avg_similarity_score"] = float(np.mean(rouge_scores))
            machine_instructions.append(instruction_data_entry)
            all_instructions.append(instruction_data_entry["instruction"])
            all_instruction_tokens.append(new_instruction_tokens)
            with open(os.path.join(args.out_dir, "machine_generated_instructions.jsonl"), "a", encoding="utf-8") as fout:
                json.dump(instruction_data_entry, fout, ensure_ascii=False)
                fout.write("\n")
            progress_bar.update(1)
        process_duration = time.time() - process_start
        print("후처리 끝")
        print(f"Request {request_idx} took {request_duration:.2f}s, processing took {process_duration:.2f}s")
        print(f"Generated {total} instructions, kept {keep} instructions")
