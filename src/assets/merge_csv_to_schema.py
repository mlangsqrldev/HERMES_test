import json
import csv
import glob
import os

def update_schema():
    # 1. Load the existing schema dictionary
    with open('schema_dictionary.json', 'r', encoding='utf-8') as f:
        schema = json.load(f)

    # 2. Find all mapped CSVs in the directory
    csv_files = glob.glob('mapped_*.csv')

    for csv_file in csv_files:
        with open(csv_file, 'r', encoding='utf-8-sig') as f:
            # Assuming CSV uses a semicolon ';' delimiter based on typical European format / your file preview
            reader = csv.DictReader(f, delimiter=';')
            
            for row in reader:
                full_field_path = row.get('fieldPath', '').strip()
                if not full_field_path:
                    continue
                
                # Split into {groupName} and {fieldPath}
                # We use maxsplit=1 in case the fieldPath itself contains dots (e.g., recordInformation.id)
                parts = full_field_path.split('.', 1)
                if len(parts) != 2:
                    continue
                    
                group_name, field_path = parts
                
                # Ensure the groupName exists in the schema
                if group_name not in schema:
                    schema[group_name] = []
                    
                group_items = schema[group_name]
                
                # Check if the fieldPath already exists in this group
                existing_item = None
                for item in group_items:
                    if item.get('fieldPath') == field_path:
                        existing_item = item
                        break
                        
                # Extract data to update/insert, ignoring 'type' and 'fieldPath' (already handled)
                update_data = {k: v for k, v in row.items() if k not in ['type', 'fieldPath']}
                
                # Convert 'isArray' string values into actual boolean types
                if 'isArray' in update_data:
                    val = str(update_data['isArray']).strip().lower()
                    update_data['isArray'] = val in ['true', 'wahr', '1', 'yes']
                
                if existing_item:
                    # Update existing item with values from CSV
                    existing_item.update(update_data)
                else:
                    # Create a new item and append to the list
                    new_item = {'fieldPath': field_path}
                    new_item.update(update_data)
                    # We can add 'type' as None or a default if creating from scratch to maintain structure
                    if 'type' not in new_item: 
                        new_item['type'] = None 
                    group_items.append(new_item)

    # 3. Save the updated schema to a new JSON file
    output_filename = 'updated_schema_dictionary.json'
    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(schema, f, indent=2, ensure_ascii=False)
        
    print(f"Update complete. Output saved to: {output_filename}")

if __name__ == "__main__":
    update_schema()