import json
import pandas as pd

with open("gs_arts_center_seatmap.json", "r", encoding="utf-8") as f:
    content = f.read()

# Remove JS assignment prefix if present
if content.strip().startswith("GS_ARTS_CENTER_SEAT_MAP_DATA ="):
    content = content.split("=", 1)[1].strip()

# Replace JS NaN with JSON-compliant null
content = content.replace("NaN", "null")

data = json.loads(content)

df = pd.DataFrame(data)
df.to_csv(
    "gs_arts_center_seatmap.csv",
    index=False,
    encoding="utf-8-sig"
)