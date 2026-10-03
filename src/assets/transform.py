import json
import csv

def json_to_csv(input_json_path, output_csv_path):
    # Read the JSON data with utf-8 encoding
    try:
        with open(input_json_path, 'r', encoding='utf-8') as json_file:
            data = json.load(json_file)
    except FileNotFoundError:
        print(f"Error: Could not find the file '{input_json_path}'.")
        return
    except json.JSONDecodeError:
        print(f"Error: '{input_json_path}' does not contain valid JSON.")
        return

    # Open the CSV file for writing with utf-8 encoding
    with open(output_csv_path, 'w', newline='', encoding='utf-8') as csv_file:
        writer = csv.writer(csv_file, delimiter=';', quoting=1)
        
        # Write the CSV header
        writer.writerow(['fieldPath', 'nameEN', 'nameDE', 'documentationEN', 'documentationDE'])
        
        # Parse the JSON and extract the data
        for group_name, items in data.items():
            # Ensure items is a list to handle potential malformed JSON gracefully
            if isinstance(items, list):
                for item in items:
                    if item.get('hide',False): continue
                    # Concatenate group name and field path
                    # Using .get() prevents KeyErrors if a specific dictionary misses a key
                    original_field_path = item.get('fieldPath', '')
                    combined_field_path = f"{group_name}.{original_field_path}"
                    
                    name_en = item.get('nameEN', '')
                    name_de = item.get('nameDE', '')
                    doc_en = item.get('documentationEN', '')
                    doc_de = item.get('documentationDE', '')
                    
                    # Write the extracted row to the CSV
                    writer.writerow([
                        combined_field_path, 
                        name_en, 
                        name_de, 
                        doc_en, 
                        doc_de
                    ])

    print(f"Successfully transformed '{input_json_path}' to '{output_csv_path}'.")

# Example usage
if __name__ == "__main__":
    # Replace these filenames with your actual file paths
    input_filename = 'schema_dictionary.json'
    output_filename = 'schema_tl.csv'
    
    json_to_csv(input_filename, output_filename)