import json, os
from collections import OrderedDict
if __name__ == '__main__':
    # 절대 경로 가져오기
    FILE_DIR = os.path.dirname(os.path.abspath(__file__))
    
    # PATH 세팅
    SEED_PATH = os.path.join(FILE_DIR, "foodie_dataset_v0.0.2.json")
    OUTPUT_PATH = os.path.join(FILE_DIR, "foodie_dataset_v1.jsonl")

    # 파일 오픈
    with open(SEED_PATH, 'r', encoding='UTF-8') as fin:
        json_data = json.load(fin)

    with open(OUTPUT_PATH, 'w', encoding='UTF-8') as fout:
        for idx, data in enumerate(json_data):
            new_data = OrderedDict()
            
            new_data["instruction"] = data["instruction"]
            new_data["input"] = ""
            new_data["output"] = data["output"]
            fout.write(json.dumps(new_data, ensure_ascii=False) + '\n')
    


