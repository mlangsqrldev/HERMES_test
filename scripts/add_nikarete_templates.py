import json

with open('src/assets/default_templates.json', 'r', encoding='utf-8') as f:
    templates = json.load(f)

# 1. collectionInformation
nikarete_col = {
    "name": "Grabnaiskos der Nikarete (SK 740)",
    "data": {
        "id": "DE-MUS-814111_Nikarete_Collection",
        "title": [
            {
                "_value": "Grabnaiskos der Nikarete: Weibliches Fragment vom Grabmal der Nikarete",
                "title#lang": "de",
                "title#preferred": True
            },
            {
                "_value": "Female fragment of the tomb of Nikarete",
                "title#lang": "en",
                "title#preferred": False
            }
        ],
        "source": "Antikensammlung, Berlin. Staatliche Museen zu Berlin",
        "source#lang": "de",
        "contacts": [
            {
                "name": "Valentina Salcedo Paparoni",
                "role": "Documentation",
                "organization": "Staatliche Museen zu Berlin, Stiftung Preußischer Kulturbesitz",
                "email": "",
                "address.buildingName": "Bodestraße",
                "address.numberInRoad": "1-3",
                "address.roadName": "Bodestraße",
                "address.townOrCity": "Berlin",
                "address.postcodeOrZipcode": "10178",
                "address.country": "DE"
            },
            {
                "name": "Matthias Lang",
                "role": "Project Lead",
                "organization": "Bonn Center for Digital Humanities, Bonn University",
                "email": "",
                "address.buildingName": "",
                "address.numberInRoad": "1",
                "address.roadName": "Am Hof",
                "address.townOrCity": "Bonn",
                "address.postcodeOrZipcode": "53113",
                "address.country": "DE"
            }
        ],
        "rights.copyrightCreditLine": "Staatliche Museen zu Berlin, Stiftung Preußischer Kulturbesitz / BCDH Bonn University",
        "rights.copyrightCreditLine#lang": "de",
        "rights.accessRights": "Open Access",
        "rights.accessRights#lang": "en",
        "rights.reproductionRights": "CC BY-SA 4.0",
        "rights.reproductionRights#lang": "en",
        "rights.licence": "https://creativecommons.org/licenses/by-sa/4.0/",
        "rights.licence#lang": "en",
        "language": [
            "de",
            "en"
        ],
        "language#lang": "de",
        "statement": "Grabnaiskos der Nikarete (SK 740). Weibliches Fragment eines attischen Grabmals der Spätklassik (ca. 330–320 v. Chr.) aus pentelischem Marmor auf Sandsteinsockel, gefunden im Kerameikos zu Athen. Erworben 1820. Hochpräzise 3D-Digitalisierung (Streifenlicht-Scanning Artec Leo und Makro-Photogrammetrie Nikon Z8) durchgeführt durch das Bonn Center for Digital Humanities (BCDH) im Auftrag der Staatlichen Museen zu Berlin.",
        "statement#lang": "de",
        "statement#preferred": True,
        "creation.createdOn": "2025-04-17",
        "creation.query": "",
        "keywords": [
            "Grabrelief",
            "Grabmonument",
            "Pentelischer Marmor",
            "Kerameikos",
            "Attika",
            "Spätklassik",
            "3D-Digitalisierung",
            "Streifenlicht-Scanning",
            "Photogrammetrie",
            "Digitaler Zwilling",
            "Digitaler Schatten",
            "VR-Lernumgebung"
        ],
        "keywords#lang": "de",
        "keywords#namespace": "HECTOR / Getty AAT",
        "coverage.temporal.timeSpan.startDate": "-0330",
        "coverage.temporal.timeSpan.endDate": "-0320",
        "coverage.temporal.timeSpan.dateRangeQualifier": "",
        "coverage.temporal.periodName": "Spätklassik (330 - 320 v. Chr.)",
        "coverage.temporal.periodName#lang": "de",
        "coverage.temporal.periodName#preferred": True,
        "coverage.spatial.locationSet.namedLocation": [
            "Kerameikos, Athen, Attika"
        ],
        "coverage.spatial.locationSet.namedLocation#lang": "de",
        "coverage.spatial.locationSet.namedLocation#preferred": True,
        "coverage.spatial.locationSet.namedLocation#namespace": "Pleiades",
        "coverage.spatial.locationSet.namedLocation#term": "Kerameikos",
        "coverage.spatial.locationSet.namedLocation#termUID": "579986",
        "coverage.spatial.locationSet.geopoliticalArea": "Griechenland",
        "coverage.spatial.locationSet.geopoliticalArea#lang": "de"
    }
}

# 2. heritageAssetIdentification
nikarete_ha = {
    "name": "Grabnaiskos der Nikarete (SK 740)",
    "data": {
        "recordInformation.id": "SK 740",
        "recordInformation.source": "Antikensammlung, Berlin. Staatliche Museen zu Berlin",
        "recordInformation.source#lang": "de",
        "recordInformation.country": "DE",
        "recordInformation.country#lang": "de",
        "recordInformation.country#authority": "iso31661a2",
        "recordInformation.creation.date": "2025-04-17",
        "recordInformation.creation.contacts": [],
        "recordInformation.language": [
            "de",
            "en"
        ],
        "recordInformation.language#lang": "de",
        "recordInformation.metadataRights": "https://creativecommons.org/licenses/by-sa/4.0/",
        "recordInformation.metadataRights#lang": "en",
        "appellation.id": "SK 740",
        "appellation.name": [
            {
                "_value": "Grabnaiskos der Nikarete: Weibliches Fragment vom Grabmal der Nikarete",
                "appellation.name#lang": "de",
                "appellation.name#preferred": True
            },
            {
                "_value": "Female fragment of the tomb of Nikarete",
                "appellation.name#lang": "en",
                "appellation.name#preferred": False
            }
        ],
        "description": "Weibliches Fragment vom Grabmal der Nikarete. Attischer Grabnaiskos aus pentelischem Marmor auf Sandsteinsockel. Dargestellt ist eine sitzende, trauernde Frauengestalt im Hochrelief. Gefunden im Kerameikos zu Athen. Datierung: Spätklassik, ca. 330–320 v. Chr. Inventarnummer SK 740 der Antikensammlung Berlin.",
        "generalType": "physical object",
        "actors": [
            {
                "actor": "Nikarete",
                "actorUID": "",
                "role": "Verstorbene / Dargestellte"
            },
            {
                "actor": "Antikensammlung, Staatliche Museen zu Berlin",
                "actorUID": "https://lobid.org/organisations/DE-MUS-814111",
                "role": "Eigentümer / Verwahrer"
            }
        ],
        "conditions.condition": "Fragment erhalten (bestoßen, Kopf und rechte Hand beschädigt)",
        "conditions.condition#lang": "de",
        "conditions.conditionAssessment": "Guter Zustand für Ausstellung und 3D-Digitalisierung",
        "conditions.conditionAssessment#lang": "de",
        "conditions.conditionDate": "2025-01-30",
        "conditions.conditionDate#lang": "de",
        "conditions.wasPresentAt": "",
        "provenance": "Gefunden im Kerameikos, Athen (Griechenland). Erworben 1820 für die Antikensammlung Berlin. https://doi.org/10.11588/diglit.69318#0219",
        "provenance#lang": "de",
        "characters.heritageAssetType": [
            {
                "_value": "Grabrelief",
                "#term": "Grabrelief",
                "#lang": "de",
                "#namespace": "HECTOR",
                "#termUID": "http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_9b922858"
            },
            {
                "_value": "tombstone",
                "#term": "tombstone",
                "#lang": "en",
                "#namespace": "AAT",
                "#termUID": "http://vocab.getty.edu/page/aat/300005923"
            },
            {
                "_value": "sculpture",
                "#term": "sculpture",
                "#lang": "en",
                "#namespace": "AAT",
                "#termUID": "http://vocab.getty.edu/page/aat/300184633"
            },
            {
                "_value": "pedestal",
                "#term": "pedestal",
                "#lang": "en",
                "#namespace": "AAT",
                "#termUID": "http://vocab.getty.edu/page/aat/300001744"
            },
            {
                "_value": "relief",
                "#term": "relief",
                "#lang": "en",
                "#namespace": "AAT",
                "#termUID": "http://vocab.getty.edu/page/aat/300053622"
            }
        ],
        "characters.temporal": [
            {
                "timeSpan.startDate": "-0330",
                "timeSpan.endDate": "-0320",
                "displayDate": "330 – 320 v. Chr."
            }
        ],
        "characters.materials": [
            {
                "_value": "Pentelischer Marmor",
                "#lang": "de"
            },
            {
                "_value": "Sandstein",
                "#lang": "de"
            }
        ],
        "characters.inscriptions": [],
        "characters.dimensions": [
            {
                "extent": "base",
                "measurementType": "Height",
                "units": "centimeters",
                "scale": "",
                "value": 118
            },
            {
                "extent": "base",
                "measurementType": "Length",
                "units": "centimeters",
                "scale": "",
                "value": 56
            },
            {
                "extent": "base",
                "measurementType": "Weight",
                "units": "kilograms",
                "scale": "",
                "value": 256
            },
            {
                "extent": "pedestal",
                "measurementType": "Height",
                "units": "centimeters",
                "scale": "",
                "value": 90
            },
            {
                "extent": "pedestal",
                "measurementType": "Length",
                "units": "centimeters",
                "scale": "",
                "value": 59
            },
            {
                "extent": "pedestal",
                "measurementType": "Width",
                "units": "centimeters",
                "scale": "",
                "value": 40
            }
        ],
        "spatial": [
            {
                "locationSet.namedLocation": "Kerameikos, Athen, Attika",
                "locationSet.namedLocation#lang": "de",
                "locationSet.namedLocation#preferred": True,
                "locationSet.namedLocation#namespace": "Pleiades",
                "locationSet.namedLocation#term": "Kerameikos",
                "locationSet.namedLocation#termUID": "579986",
                "locationSet.geopoliticalArea": "Griechenland",
                "locationSet.geopoliticalArea#lang": "de"
            }
        ],
        "repositoryLocation": "Antikensammlung, Berlin. Staatliche Museen zu Berlin (ISIL: DE-MUS-814111, Inv.-Nr. SK 740)",
        "repositoryLocation#lang": "de",
        "rights.copyrightCreditLine": "Antikensammlung, Staatliche Museen zu Berlin – Preußischer Kulturbesitz",
        "rights.copyrightCreditLine#lang": "de",
        "rights.accessRights": "Open Access",
        "rights.accessRights#lang": "en",
        "rights.reproductionRights": "CC BY-SA 4.0",
        "rights.reproductionRights#lang": "en",
        "rights.licence": "https://creativecommons.org/licenses/by-sa/4.0/",
        "rights.licence#lang": "en",
        "references": [
            {
                "appellation.name": "SMB Online-Datenbank Permalink",
                "appellation.name#lang": "de",
                "appellation.id": "https://id.smb.museum/object/699203",
                "link": "https://id.smb.museum/object/699203"
            },
            {
                "appellation.name": "Diglit Provenienzbericht 1820",
                "appellation.name#lang": "de",
                "appellation.id": "https://doi.org/10.11588/diglit.69318#0219",
                "link": "https://doi.org/10.11588/diglit.69318#0219"
            }
        ],
        "hasRepresentation": [
            "DO_3816816_HP",
            "DO_3816816_LP"
        ],
        "wasDigitizedBy": [
            "ACT_BCDH_2025_NIKARETE"
        ]
    }
}

# 3. digitalResource (HP & LP)
nikarete_dr_hp = {
    "name": "Nikarete High-Poly Master 3D-Mesh (Artec Leo / Nikon Z8)",
    "data": {
        "recordInformation.id": "DO_3816816_HP",
        "recordInformation.source": "Bonn Center for Digital Humanities, Bonn University",
        "recordInformation.source#lang": "en",
        "recordInformation.country": "DE",
        "recordInformation.country#lang": "de",
        "recordInformation.country#authority": "iso31661a2",
        "recordInformation.creation.date": "2025-04-19",
        "recordInformation.creation.contacts": [],
        "recordInformation.language": [
            "en",
            "de"
        ],
        "recordInformation.language#lang": "en",
        "recordInformation.metadataRights": "https://creativecommons.org/licenses/by-sa/4.0/",
        "recordInformation.metadataRights#lang": "en",
        "appellation.name": [
            {
                "_value": "SK 740 Nikarete High-Poly Master 3D-Mesh (Artec Leo / Nikon Z8)",
                "appellation.name#lang": "en",
                "appellation.name#preferred": True
            }
        ],
        "appellation.id": "3816816_HP",
        "description": "High-Poly 3D Master Mesh of SK 740 Nikarete. Generated from structured-light 3D scanning with Artec Leo (resolution: 0.1 mm) and high-resolution texture photogrammetry with Nikon Z8. Mesh metrics: 15.8 million faces, 7.9 million vertices.",
        "note": [
            "SK_740_Nikarete_HP.obj | SHA256: 1f6d9d3de5e9eb3db5ae0197d7518f484a02dd3ca9a525cb6f6dfcb6b0c3e04d",
            "SK_740_Nikarete_HP.mtl | SHA256: 474852e87764e5c092abbb9ae222f0a0f1addea4b6d4ad1050a36ef5405fa711",
            "SK_740_Nikarete_HP.png | SHA256: d4cbe3b97c34bec8f58a9f083a24b6ab67636d0a5bd8edc72c80455cf859a3fe"
        ],
        "note#lang": "en",
        "actors": [],
        "type": "3D",
        "format": [
            "model/obj",
            "image/png"
        ],
        "format#lang": "en",
        "formatDetails": "High-Poly Wavefront OBJ + Material MTL + PNG 16k Texture",
        "formatDetails#lang": "en",
        "extent": "15.8M faces, 7.9M vertices, 16k texture",
        "extent#term": "",
        "extent#lang": "en",
        "extent#namespace": "",
        "extent#termUID": "",
        "publicationStatement": [],
        "created": "2025-04-19",
        "language": [
            "en"
        ],
        "language#lang": "en",
        "link": "https://id.smb.museum/object/699203/SK_740_Nikarete_HP.obj",
        "object": "https://id.smb.museum/object/699203/SK_740_Nikarete_HP.png",
        "isShownAt": "https://id.smb.museum/object/699203",
        "rights.copyrightCreditLine": "Staatliche Museen zu Berlin, Stiftung Preußischer Kulturbesitz / BCDH Bonn University",
        "rights.copyrightCreditLine#lang": "de",
        "rights.accessRights": "Open Access",
        "rights.accessRights#lang": "en",
        "rights.reproductionRights": "CC BY-SA 4.0",
        "rights.reproductionRights#lang": "en",
        "rights.licence": "https://creativecommons.org/licenses/by-sa/4.0/",
        "rights.licence#lang": "en",
        "isRepresentationOf": [
            "SK 740"
        ],
        "hasDerivative": [
            "DO_3816816_LP"
        ]
    }
}

nikarete_dr_lp = {
    "name": "Nikarete Low-Poly VR-Modell (PBR Texture Maps)",
    "data": {
        "recordInformation.id": "DO_3816816_LP",
        "recordInformation.source": "Bonn Center for Digital Humanities, Bonn University",
        "recordInformation.source#lang": "en",
        "recordInformation.country": "DE",
        "recordInformation.country#lang": "de",
        "recordInformation.country#authority": "iso31661a2",
        "recordInformation.creation.date": "2025-03-06",
        "recordInformation.creation.contacts": [],
        "recordInformation.language": [
            "en",
            "de"
        ],
        "recordInformation.language#lang": "en",
        "recordInformation.metadataRights": "https://creativecommons.org/licenses/by-sa/4.0/",
        "recordInformation.metadataRights#lang": "en",
        "appellation.name": [
            {
                "_value": "SK 740 Nikarete Low-Poly Real-Time Model (VR Derivative with PBR Maps)",
                "appellation.name#lang": "en",
                "appellation.name#preferred": True
            }
        ],
        "appellation.id": "3816816_LP",
        "description": "Decimated, real-time ready 3D mesh designed for WebXR and Virtual Reality (VR Kerameikos Learning Environment). Includes baked Normal Map, Ambient Occlusion Map, and transferred diffuse texture.",
        "note": [
            "SK_740_Nikarete_LP.obj | SHA256: f413506cdd1b9c11a935b8134bf9601bdf9368fe64556b1420bea816e8e841bf",
            "sk_740_nikarete_lp_uv_Ambient Occlusion Map from Mesh.jpg | SHA256: 1c9070d58ae52243ca4b42e694055a96d52eae91fc839d45aedc14c0d346c380",
            "sk_740_nikarete_lp_uv_Normal Map from Mesh.jpg | SHA256: b31f5835a3b7a19bc8b69a3fe3056d5134b35f0a4c68ec370370d2f4d01c6642",
            "sk_740_nikarete_lp_uv_Transferred Texture from Mesh.jpg | SHA256: 690d2cc6641777c2feb5e197a5fba351305caa68c68bcc909506cd6652fd0698"
        ],
        "note#lang": "en",
        "actors": [],
        "type": "3D",
        "format": [
            "model/obj",
            "image/jpeg"
        ],
        "format#lang": "en",
        "formatDetails": "Low-Poly OBJ + PBR Maps (Normal, AO, Transferred Diffuse)",
        "formatDetails#lang": "en",
        "extent": "Real-time VR-ready model",
        "created": "2025-03-06",
        "language": [
            "en"
        ],
        "language#lang": "en",
        "link": "https://id.smb.museum/object/699203/SK_740_Nikarete_LP.obj",
        "object": "https://id.smb.museum/object/699203/sk_740_nikarete_lp_uv_Transferred Texture from Mesh.jpg",
        "isShownAt": "https://id.smb.museum/object/699203",
        "rights.copyrightCreditLine": "Staatliche Museen zu Berlin, Stiftung Preußischer Kulturbesitz / BCDH Bonn University",
        "rights.copyrightCreditLine#lang": "de",
        "rights.accessRights": "Open Access",
        "rights.accessRights#lang": "en",
        "rights.reproductionRights": "CC BY-SA 4.0",
        "rights.reproductionRights#lang": "en",
        "rights.licence": "https://creativecommons.org/licenses/by-sa/4.0/",
        "rights.licence#lang": "en",
        "isRepresentationOf": [
            "SK 740"
        ],
        "isDerivativeOf": [
            "DO_3816816_HP"
        ]
    }
}

# 4. activity
nikarete_act = {
    "name": "3D-Digitalisierung Grabnaiskos der Nikarete (BCDH 2025)",
    "data": {
        "recordInformation.id": "ACT_BCDH_2025_NIKARETE",
        "recordInformation.source": "Bonn Center for Digital Humanities, Bonn University",
        "recordInformation.source#lang": "en",
        "recordInformation.country": "DE",
        "recordInformation.country#lang": "de",
        "recordInformation.country#authority": "iso31661a2",
        "recordInformation.creation.date": "2025-01-30",
        "recordInformation.creation.contacts": [],
        "recordInformation.language": [
            "en",
            "de"
        ],
        "recordInformation.language#lang": "en",
        "recordInformation.metadataRights": "https://creativecommons.org/licenses/by-sa/4.0/",
        "recordInformation.metadataRights#lang": "en",
        "appellation.name": [
            {
                "_value": "3D-Digitalisierung und Texturierung des Grabmals der Nikarete (SK 740)",
                "appellation.name#lang": "de",
                "appellation.name#preferred": True
            }
        ],
        "appellation.id": "ACT_NIKARETE_3D_2025",
        "description": "Streifenlicht-Scanning (Artec Leo, 0,1 mm) und Makro-Photogrammetrie (Nikon Z8, Textur 16384x16384 px) des Grabmals der Nikarete (SK 740). Datenverarbeitung in Artec Studio 19, Blender 4.2, Substance Designer 14 und Lightroom 14.1. Erstellung von Master High-Poly und VR Low-Poly Derivaten.",
        "hasGeneralPurpose": "Capture & Representation (3D Documentation and Interactive Virtual Reality Environment)",
        "hasGeneralPurpose#lang": "en",
        "eventType": "3D digitisation",
        "eventType#term": "3D digitisation",
        "eventType#namespace": "AAT",
        "eventType#lang": "en",
        "eventType#termUID": "http://vocab.getty.edu/page/aat/300266025",
        "actors": [
            {
                "actor": "Bonn Center for Digital Humanities, Bonn University",
                "actorUID": "https://d-nb.info/gnd/36150-1",
                "role": "digitizer"
            },
            {
                "actor": "Staatliche Museen zu Berlin, Stiftung Preußischer Kulturbesitz",
                "actorUID": "https://lobid.org/organisations/DE-MUS-710014",
                "role": "documented_by"
            }
        ],
        "temporal": [
            {
                "timeSpan.startDate": "2025-01-30",
                "timeSpan.endDate": "2025-04-19",
                "displayDate": "30.01.2025 – 19.04.2025"
            }
        ],
        "spatial.locationSet.namedLocation": "Antikensammlung, Berlin. Staatliche Museen zu Berlin",
        "spatial.locationSet.namedLocation#lang": "de",
        "spatial.locationSet.namedLocation#preferred": True,
        "spatial.locationSet.namedLocation#namespace": "",
        "spatial.locationSet.namedLocation#term": "Berlin",
        "spatial.locationSet.namedLocation#termUID": "",
        "spatial.locationSet.geopoliticalArea": "Deutschland",
        "spatial.locationSet.geopoliticalArea#lang": "de",
        "spatial.locationSet.geopoliticalAreaType": "Bundesland / Berlin",
        "spatial.locationSet.geopoliticalAreaType#lang": "de",
        "spatial.locationSet.geopoliticalAreaType#namespace": "",
        "spatial.locationSet.historicalName": [],
        "consistsOf": [
            {
                "hadSpecificPurpose": "Datenerfassung (Capture) – Streifenlicht-Scanning & Makro-Photogrammetrie",
                "startDate": "2025-01-30",
                "endDate": "2025-01-30",
                "methods": ["Structured-light 3D scanning", "Close-range photogrammetry"],
                "techniques": ["Freihand-Erfassung im Ausstellungsraum (keine Stative/Kabel erlaubt). Grenzen: Rückseite wandseitig und Unterseite aus konservatorischen Gründen nicht erfasst (Limit)."],
                "materials": ["Pentelischer Marmor", "Sandstein"],
                "equipment": ["Artec Leo (structured-light 3D scanner, 0.1 mm resolution)", "Nikon Z8 (digital camera, 16k textures)"]
            },
            {
                "hadSpecificPurpose": "Modellierung (Representation) – Master-Mesh & VR-Echtzeitderivat",
                "startDate": "2025-02-01",
                "endDate": "2025-04-19",
                "methods": ["High-poly scan fusion", "Mesh decimation", "PBR texture baking"],
                "techniques": ["Sandsteinsockel für didaktische VR-Nutzung entfernt (Entscheidung). Marmor-Transluzenz mittels Subsurface Scattering simuliert (Simulation). Normal- und AO-Maps aus High-Poly-Master gebacken. Mesh-Fusion und Oberflächenschließung via Artec Studio 19 (deklarierte Blackbox)."],
                "materials": ["Pentelischer Marmor"],
                "equipment": ["Artec Studio 19", "Blender 4.2", "Substance Designer 14", "Adobe Photoshop Lightroom 14.1"]
            }
        ],
        "hasCreated": [
            "DO_3816816_HP",
            "DO_3816816_LP"
        ]
    }
}

def upsert_template(section_list, new_tpl):
    idx = next((i for i, item in enumerate(section_list) if item.get("name") == new_tpl["name"]), -1)
    if idx >= 0:
        section_list[idx] = new_tpl
    else:
        section_list.append(new_tpl)

upsert_template(templates["collectionInformation"], nikarete_col)
upsert_template(templates["heritageAssetIdentification"], nikarete_ha)
upsert_template(templates["digitalResource"], nikarete_dr_hp)
upsert_template(templates["digitalResource"], nikarete_dr_lp)
upsert_template(templates["activity"], nikarete_act)

with open('src/assets/default_templates.json', 'w', encoding='utf-8') as f:
    json.dump(templates, f, indent=2, ensure_ascii=False)

print("default_templates.json updated successfully with Nikarete presets!")
