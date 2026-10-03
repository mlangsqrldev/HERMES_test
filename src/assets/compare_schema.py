import json
import csv
import glob

# --- 1. Load JSON Schema ---
json_path = "schema_dictionary.json"
with open(json_path, 'r', encoding='utf-8') as f:
    schema_json = json.load(f)

json_fields = {}
for root_key, fields in schema_json.items():
    for field in fields:
        field_path = field.get("fieldPath")
        if field_path is None:
            continue
        if field_path == "":
            full_path = root_key
        else:
            full_path = f"{root_key}.{field_path}"
        json_fields[full_path] = field.get("isArray", False)


# --- 2. Load CSV Schema ---
csv_schema_path = "schema_dictionary.csv"
schema_csv_fields = {}
with open(csv_schema_path, 'r', encoding='utf-8-sig') as f:
    # Handle possible BOM or quotes by using csv.reader or csv.DictReader
    reader = csv.DictReader(f)
    for row in reader:
        group = row.get("Group")
        field_path = row.get("Field Path")
        if not group or not field_path:
            continue
        
        full_path = f"{group}.{field_path}"
        is_array_str = row.get("Is Array", "").strip().lower()
        is_array = (is_array_str == 'yes')
        schema_csv_fields[full_path] = is_array


# --- 3. Load mapped CSVs ---
mapped_files = glob.glob("mapped_*.csv")

mapped_fields = {}
for mapped_file in mapped_files:
    with open(mapped_file, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f, delimiter=';')
        for row in reader:
            field_path = row.get("fieldPath")
            if not field_path:
                continue
            is_array_str = row.get("isArray", "").strip().lower()
            is_array = (is_array_str == 'true' or is_array_str == 'wahr')
            mapped_fields[field_path] = is_array


# --- 4. Compare ---
out_path = r"C:\Users\Edouard Grigowski\Desktop\HERMES\HERMES\src\assets\diff_output.txt"
with open(out_path, "w", encoding="utf-8") as out_f:
    out_f.write("# Schema Comparison Results\n\n")
    out_f.write("## Comparison: mapped_*.csv vs schema_dictionary.json\n")
    # out_f.write("```text\n")
    for f in sorted(mapped_fields.keys()):
        if f in json_fields and f in schema_csv_fields:
            if mapped_fields[f] != json_fields[f]:
                out_f.write(f"{f}: mapped={mapped_fields[f]}, json={json_fields[f]}, schema_csv={schema_csv_fields[f]} Different to Miro\n")
            elif mapped_fields[f] != schema_csv_fields[f]:
                out_f.write(f"{f}: mapped={mapped_fields[f]}, json={json_fields[f]}, schema_csv={schema_csv_fields[f]} Different to CARARE\n")
        else:
            out_f.write(f"{f}: mapped={mapped_fields[f]}, json={json_fields.get(f, 'Not present')}, schema_csv={schema_csv_fields.get(f, 'Not present')}\n")
    # out_f.write("```\n\n")
    
    # out_f.write("## Comparison: mapped_*.csv vs schema_dictionary.csv\n")
    # out_f.write("```text\n")
    # for f in sorted(mapped_fields.keys()):
    #     if f in schema_csv_fields:
    # out_f.write("```\n")


