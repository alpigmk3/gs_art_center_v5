import json
import os
import pandas as pd
import numpy as np

def convert_csv_to_json(csv_path, json_path, js_path):
    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} 파일이 존재하지 않습니다.")
        return

    df = pd.read_csv(csv_path)
    records = []

    for _, row in df.iterrows():
        record = {}
        for col in df.columns:
            val = row[col]
            if pd.isna(val):
                record[col] = None
                continue
            
            if col in ["Seat_Number"]:
                record[col] = int(val)
            elif col in ["X", "Y", "Z"]:
                record[col] = float(val)
            elif col == "Display_Text":
                try:
                    f_val = float(val)
                    record[col] = int(f_val) if f_val.is_integer() else f_val
                except ValueError:
                    record[col] = str(val)
            else:
                if isinstance(val, (int, float)):
                    record[col] = int(val) if isinstance(val, float) and val.is_integer() else val
                else:
                    record[col] = str(val)
        records.append(record)

    json_content = json.dumps(records, ensure_ascii=False, indent=4)
    with open(json_path, "w", encoding="utf-8") as f:
        f.write(json_content)
    print(f"JSON 변환 완료: {json_path}")

    js_content = f"GS_ARTS_CENTER_SEAT_MAP_DATA = {json_content};\n"
    with open(js_path, "w", encoding="utf-8") as f:
        f.write(js_content)
    print(f"JS 변환 완료: {js_path}")

if __name__ == "__main__":
    csv_file = "gs_arts_center_seatmap.csv" 
    convert_csv_to_json(csv_file, "gs_arts_center_seatmap.json", "gs_arts_center_seatmap.js")
