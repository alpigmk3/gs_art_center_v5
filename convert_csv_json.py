import csv
import json
import os

def convert_csv_to_json(csv_path, json_path, js_path):
    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} 파일이 존재하지 않습니다.")
        return

    records = []
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            record = {}
            for col, val in row.items():
                if val is None or val == "":
                    record[col] = None
                elif col == "Seat_Number":
                    try:
                        record[col] = int(val)
                    except ValueError:
                        record[col] = val
                elif col in ("X", "Y", "Z"):
                    try:
                        record[col] = float(val)
                    except ValueError:
                        record[col] = val
                else:
                    record[col] = val
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
