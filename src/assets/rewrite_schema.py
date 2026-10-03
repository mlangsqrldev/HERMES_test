import json

def update_schema(input_file, output_file):
    # Load the JSON data
    with open(input_file, 'r', encoding='utf-8') as file:
        schema = json.load(file)

    print("--- FieldPaths with 'status' already defined ---")
    
    # Iterate through each top-level key in the schema
    for collection_name, elements in schema.items():
        for element in elements:
            
            
            
            # 2. Rewrite "hide": true to "status": "hidden"
            if element.get('hide') is True:
                # 1. Print the fieldPath if 'status' is already defined
                if 'status' in element:
                    field_path = element.get('fieldPath', 'Unknown FieldPath')
                    print(f"[{collection_name}] {field_path}")
                else:
                    del element['hide']
                    element['status'] = 'hidden'

    # Save the modified schema to the output file
    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(schema, file, indent=2, ensure_ascii=False)
        
    print(f"\nProcess complete. Updated schema saved to '{output_file}'.")

if __name__ == "__main__":
    # Define your input and output file names
    input_filename = 'schema_dictionary.json'
    output_filename = 'updated_schema_dictionary.json'
    
    update_schema(input_filename, output_filename)



'''
collectionInformation.rights.copyrightCreditLine                was hidden
collectionInformation.rights.reproductionRights                 was hidden
collectionInformation.language
heritageAssetIdentification.conditions.conditionAssessment
heritageAssetIdentification.conditions.conditionDate
heritageAssetIdentification.conditions.wasPresentAt
heritageAssetIdentification.rights.accessRights
heritageAssetIdentification.rights.reproductionRights
heritageAssetIdentification.references.note
digitalResource.recordInformation.language
digitalResource.note
digitalResource.language
digitalResource.object
digitalResource.rights.reproductionRights
activity.recordInformation.language
activity.consistsOf.materials
activity.assessments
activity.occurredAt
activity.happenedAt
activity.wasPresentAt
activity.hasPart
activity.isPartOf
'''