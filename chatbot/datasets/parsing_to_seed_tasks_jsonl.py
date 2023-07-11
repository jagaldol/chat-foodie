import json, os
from collections import OrderedDict
if __name__ == '__main__':
    # 절대 경로 가져오기
    FILE_DIR = os.path.dirname(os.path.abspath(__file__))
    
    # PATH 세팅
    INPUT_PATH = os.path.join(FILE_DIR, "foodie_dataset_v0.0.1.json")
    OUTPUT_PATH = os.path.join(FILE_DIR, "seed_tasks.jsonl")

    # 파일 오픈
    with open(INPUT_PATH, 'r', encoding='UTF-8') as fin:
        json_data = json.load(fin)

    with open(OUTPUT_PATH, 'w', encoding='UTF-8') as fout:
        for idx, data in enumerate(json_data):
            new_data = OrderedDict()
            
            new_data["id"] = "seed_task_" + str(idx)
            if data["ref"] == "AI hub - SNS 데이터 고도화":
                new_data["name"] = "food recommand"
            else:
                new_data["name"] = "food information"
            new_data["instruction"] = data["instruction"]
            instances = OrderedDict()
            instances["input"] = ""
            instances["output"] = data["output"]
            new_data["instances"] = [instances]
            new_data["is_classification"] = False
            fout.write(json.dumps(new_data, ensure_ascii=False) + '\n')
        

