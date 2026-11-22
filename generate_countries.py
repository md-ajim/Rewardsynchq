import json
import re

try:
    with open("countries.json", "r") as f:
        data = json.load(f)
except Exception as e:
    print(f"Error: {e}")
    exit(1)

countries = []
for c in data:
    name = c.get("name", {}).get("common", "")
    iso = c.get("cca2", "")
    flag = c.get("flag", "")
    idd = c.get("idd", {})
    root = idd.get("root", "")
    suffixes = idd.get("suffixes", [])
    
    if root and suffixes:
        code = root + suffixes[0]
    elif root:
        code = root
    else:
        code = ""
        
    if name and iso and flag:
        countries.append({
            "name": name,
            "code": code,
            "flag": flag,
            "iso": iso
        })

# Sort alphabetically by name
countries.sort(key=lambda x: x["name"])

# Format to JS object array string
js_array = "const COUNTRIES = [\n"
for c in countries:
    name = c["name"].replace('"', '\\"')
    js_array += f'  {{ name: "{name}", code: "{c["code"]}", flag: "{c["flag"]}", iso: "{c["iso"]}" }},\n'
js_array += "];"

# Read the file
file_path = "/run/media/md-ajim/Linux_Data/Repo/DealVerse/frontend/components/auth/RegisterCard.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Replace the COUNTRIES array
pattern = re.compile(r"const COUNTRIES = \[.*?\];", re.DOTALL)
new_content = pattern.sub(js_array, content)

with open(file_path, "w") as f:
    f.write(new_content)

print("Updated RegisterCard.tsx with all countries correctly.")
