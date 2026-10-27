import os
import zipfile
import hashlib
from lxml import etree

NS = "http://www.carare.eu/carareSchema"
XSI = "http://www.w3.org/2001/XMLSchema-instance"

def build_fantasy_carare_xml():
    # Root element
    root = etree.Element(f"{{{NS}}}carareWrap", nsmap={None: NS})
    
    # carare container
    carare = etree.SubElement(root, f"{{{NS}}}carare", attrib={"id": "CARARE-FANTASY-ATLAS-SPHERE-01"})
    
    # =========================================================================
    # 1. COLLECTION INFORMATION
    # =========================================================================
    col = etree.SubElement(carare, f"{{{NS}}}collectionInformation")
    
    # id
    c_id = etree.SubElement(col, f"{{{NS}}}id")
    c_id.text = "DE-IAA-9999999_Atlantis_Curated_Collection"
    
    # title (mehrsprachig)
    c_t_de = etree.SubElement(col, f"{{{NS}}}title", attrib={"lang": "de", "preferred": "true"})
    c_t_de.text = "Schätze der ägäischen Tiefen: Das Pantheon der versunkenen Sphären von Thera-Atlantis"
    
    c_t_en = etree.SubElement(col, f"{{{NS}}}title", attrib={"lang": "en", "preferred": "false"})
    c_t_en.text = "Treasures of the Aegean Deeps: The Pantheon of Sunken Spheres of Thera-Atlantis"
    
    # source
    c_src = etree.SubElement(col, f"{{{NS}}}source", attrib={"lang": "de"})
    c_src.text = "Institut für Archäo-Astronomie und Imaginäre Altertümer (IAA), Bonn"
    
    # contacts (multiple)
    c_cont1 = etree.SubElement(col, f"{{{NS}}}contacts")
    c_c1_name = etree.SubElement(c_cont1, f"{{{NS}}}name")
    c_c1_name.text = "Prof. Dr. Aurelia Thalassa von Morstein"
    c_c1_role = etree.SubElement(c_cont1, f"{{{NS}}}role")
    c_c1_role.text = "Leitende Kuratorin & Archäo-Astronomin"
    c_c1_org = etree.SubElement(c_cont1, f"{{{NS}}}organization")
    c_c1_org.text = "Institut für Archäo-Astronomie und Imaginäre Altertümer (IAA)"
    c_c1_addr = etree.SubElement(c_cont1, f"{{{NS}}}address")
    etree.SubElement(c_c1_addr, f"{{{NS}}}buildingName").text = "Atlantis-Palais / Wissenschaftszentrum"
    etree.SubElement(c_c1_addr, f"{{{NS}}}numberInRoad").text = "42"
    etree.SubElement(c_c1_addr, f"{{{NS}}}roadName").text = "Am Hofgarten der Mysterien"
    etree.SubElement(c_c1_addr, f"{{{NS}}}townOrCity").text = "Bonn"
    etree.SubElement(c_c1_addr, f"{{{NS}}}postcodeOrZipcode").text = "53113"
    etree.SubElement(c_c1_addr, f"{{{NS}}}country").text = "DE"
    etree.SubElement(c_cont1, f"{{{NS}}}phone").text = "+49 228 73-9999"
    etree.SubElement(c_cont1, f"{{{NS}}}fax").text = "+49 228 73-9998"
    etree.SubElement(c_cont1, f"{{{NS}}}email").text = "aurelia.morstein@iaa-bonn.org"
    
    c_cont2 = etree.SubElement(col, f"{{{NS}}}contacts")
    c_c2_name = etree.SubElement(c_cont2, f"{{{NS}}}name")
    c_c2_name.text = "Dr. Lysandros Kephalos"
    c_c2_role = etree.SubElement(c_cont2, f"{{{NS}}}role")
    c_c2_role.text = "Restaurierungs- und Konservierungsleitung"
    c_c2_org = etree.SubElement(c_cont2, f"{{{NS}}}organization")
    c_c2_org.text = "Hellenic Underwater Antiquities & Heritage Preservation"
    etree.SubElement(c_cont2, f"{{{NS}}}email").text = "kephalos@underwater-heritage.gr"
    
    # rights
    c_rights = etree.SubElement(col, f"{{{NS}}}rights")
    etree.SubElement(c_rights, f"{{{NS}}}copyrightCreditLine", attrib={"lang": "de"}).text = "Institut für Archäo-Astronomie und Imaginäre Altertümer (IAA), Bonn / BCDH Bonn"
    etree.SubElement(c_rights, f"{{{NS}}}accessRights", attrib={"lang": "en"}).text = "Open Access for Academic Research and Education"
    etree.SubElement(c_rights, f"{{{NS}}}reproductionRights", attrib={"lang": "en"}).text = "CC BY-SA 4.0 International"
    etree.SubElement(c_rights, f"{{{NS}}}licence", attrib={"lang": "en"}).text = "https://creativecommons.org/licenses/by-sa/4.0/"
    etree.SubElement(c_rights, f"{{{NS}}}europeanaRights").text = "Creative Commons - Attribution, ShareAlike (BY-SA)"
    
    # language
    etree.SubElement(col, f"{{{NS}}}language", attrib={"lang": "de"}).text = "de"
    etree.SubElement(col, f"{{{NS}}}language", attrib={"lang": "en"}).text = "en"
    
    # statement
    c_stmt = etree.SubElement(col, f"{{{NS}}}statement", attrib={"lang": "de", "preferred": "true"})
    c_stmt.text = (
        "Die Kollektion 'Schätze der ägäischen Tiefen' umfasst archäologische Fundkomplexe "
        "einer hochstehenden spätbronzezeitlichen Himmelskunde aus dem versunkenen Seamount-Areal von Thera-Atlantis. "
        "Sämtliche Objekte wurden interdisziplinär durch Archäo-Astronomen, Metallurgen und 3D-Messtechniker des IAA Bonn "
        "mittels Streifenlicht-Scanning und Multispektral-Photogrammetrie bis in den Mikrometerbereich digitalisiert."
    )
    
    # creation
    c_creat = etree.SubElement(col, f"{{{NS}}}creation")
    etree.SubElement(c_creat, f"{{{NS}}}createdOn").text = "2026-10-23"
    etree.SubElement(c_creat, f"{{{NS}}}query").text = "SELECT * FROM IAA_ATLANTIS_CORPUS WHERE era='Late Bronze Age' AND material='Orichalcum'"
    
    # keywords
    kw_data = [
        ("Himmelsmechanismus", "HECTOR"),
        ("Orichalcum", "AAT"),
        ("Archäoastronomie", "AAT"),
        ("Atlantis", "Pleiades"),
        ("Späte Bronzezeit", "HECTOR"),
        ("Kultisches Instrument", "HECTOR"),
        ("3D-Digitalisierung", "AAT"),
        ("Streifenlicht-Scanning", "AAT"),
        ("Multispektral-Photogrammetrie", "HERMES"),
        ("Digitaler Zwilling", "HERMES")
    ]
    for term, ns_val in kw_data:
        kw_el = etree.SubElement(col, f"{{{NS}}}keywords", attrib={"lang": "de", "namespace": ns_val})
        kw_el.text = term
        
    # coverage
    c_cov = etree.SubElement(col, f"{{{NS}}}coverage")
    c_temp = etree.SubElement(c_cov, f"{{{NS}}}temporal")
    c_ts = etree.SubElement(c_temp, f"{{{NS}}}timeSpan")
    etree.SubElement(c_ts, f"{{{NS}}}startDate").text = "-1400"
    etree.SubElement(c_ts, f"{{{NS}}}endDate").text = "-1180"
    etree.SubElement(c_ts, f"{{{NS}}}dateRangeQualifier").text = "http://n2t.net/ark:/99152/p05krdx8w33"
    etree.SubElement(c_temp, f"{{{NS}}}periodName", attrib={"lang": "de", "preferred": "true"}).text = "Spätbronzezeitliche Ägäis / Mykenisch-Minoische Ära"
    etree.SubElement(c_temp, f"{{{NS}}}displayDate").text = "ca. 1400 v. Chr. – 1180 v. Chr."
    
    c_spat = etree.SubElement(c_cov, f"{{{NS}}}spatial")
    c_ls = etree.SubElement(c_spat, f"{{{NS}}}locationSet")
    etree.SubElement(c_ls, f"{{{NS}}}namedLocation", attrib={"lang": "de"}).text = "Versunkene Caldera-Terrasse von Thera (Santorin)"
    etree.SubElement(c_ls, f"{{{NS}}}geopoliticalArea", attrib={"lang": "de"}).text = "Ägäis, Griechenland"
    etree.SubElement(c_ls, f"{{{NS}}}geopoliticalAreaType").text = "Inselarchipel"
    etree.SubElement(c_ls, f"{{{NS}}}cadastralReference").text = "GR-CYCLADES-SANTORINI-SUB-TERR-7"
    
    # dcRelation
    etree.SubElement(col, f"{{{NS}}}dcRelation").text = "https://corpus.iaa-bonn.org/collections/atlantis-spheres"
    
    # =========================================================================
    # 2. HERITAGE ASSET IDENTIFICATION
    # =========================================================================
    ha = etree.SubElement(carare, f"{{{NS}}}heritageAssetIdentification")
    
    # recordInformation
    ha_rec = etree.SubElement(ha, f"{{{NS}}}recordInformation")
    etree.SubElement(ha_rec, f"{{{NS}}}id").text = "HERMES-HA-ATL-001"
    etree.SubElement(ha_rec, f"{{{NS}}}source", attrib={"lang": "de"}).text = "Institut für Archäo-Astronomie und Imaginäre Altertümer (IAA), Bonn"
    etree.SubElement(ha_rec, f"{{{NS}}}country", attrib={"lang": "de"}).text = "DE"
    ha_creat = etree.SubElement(ha_rec, f"{{{NS}}}creation")
    etree.SubElement(ha_creat, f"{{{NS}}}date").text = "2026-10-23"
    etree.SubElement(ha_rec, f"{{{NS}}}language", attrib={"lang": "de"}).text = "de"
    etree.SubElement(ha_rec, f"{{{NS}}}language", attrib={"lang": "de"}).text = "en"
    etree.SubElement(ha_rec, f"{{{NS}}}metadataRights").text = "https://creativecommons.org/publicdomain/zero/1.0/"
    
    # appellation
    ha_app = etree.SubElement(ha, f"{{{NS}}}appellation")
    ha_name_de = etree.SubElement(ha_app, f"{{{NS}}}name", attrib={"lang": "de", "preferred": "true"})
    ha_name_de.text = "Die Oreichalkos-Sphäre des Atlas: Drehbarer Himmelsglobus mit astronomischem Räderwerk von Thera-Atlantis"
    
    ha_name_en = etree.SubElement(ha_app, f"{{{NS}}}name", attrib={"lang": "en", "preferred": "false"})
    ha_name_en.text = "The Orichalcum Celestial Sphere of Atlas: Geared Astronomical Mechanism from Thera-Atlantis"
    
    ha_name_el = etree.SubElement(ha_app, f"{{{NS}}}name", attrib={"lang": "el", "preferred": "false"})
    ha_name_el.text = "Η Ορειχάλκινη Ουράνια Σφαίρα του Άτλαντα: Αστρονομικός Μηχανισμός Θήρας-Ατλαντίδος"
    
    etree.SubElement(ha_app, f"{{{NS}}}id").text = "IAA-INV-2026-SPH-01"
    
    # description
    ha_desc = etree.SubElement(ha, f"{{{NS}}}description", attrib={"lang": "de"})
    ha_desc.text = (
        "Prachtvoll ausgeführter, hohler Himmelsglobus (Durchmesser 48,5 cm) aus feuervergoldeter Oreichalkos-Legierung "
        "mit konzentrischen inneren Ringen zur Vorhersage von Sonnen- und Mondfinsternissen sowie der Heliozentrik der Plejaden. "
        "Die Sternbilder sind als gravierte zoomorphe Figuren mit punktuellen Einlagen aus geschliffenem Lapislazuli und Bergkristall markiert. "
        "Die Mechanik besteht aus 32 zahnradartigen Bronzesegmenten mit präzisen Winkelteilungen. "
        "Fundort: In 142 Metern Wassertiefe in einer versiegelten Pithos-Kammer am submarinen Südost-Hang von Santorin geborgen."
    )
    
    # generalType (Must be 'Artefact' for portable archaeological finds)
    etree.SubElement(ha, f"{{{NS}}}generalType").text = "Artefact"
    
    # actors
    ha_act1 = etree.SubElement(ha, f"{{{NS}}}actors")
    etree.SubElement(ha_act1, f"{{{NS}}}id").text = "PER-IAA-001"
    etree.SubElement(ha_act1, f"{{{NS}}}name", attrib={"lang": "de"}).text = "Prof. Dr. Aurelia Thalassa von Morstein"
    etree.SubElement(ha_act1, f"{{{NS}}}actorType").text = "Person"
    etree.SubElement(ha_act1, f"{{{NS}}}roles", attrib={"lang": "de"}).text = "Archäologische Expeditionsleitung & Entdeckerin"
    etree.SubElement(ha_act1, f"{{{NS}}}placeOfActivity", attrib={"lang": "de"}).text = "Bonn & Ägäis"
    
    ha_act2 = etree.SubElement(ha, f"{{{NS}}}actors")
    etree.SubElement(ha_act2, f"{{{NS}}}id").text = "PER-IAA-002"
    etree.SubElement(ha_act2, f"{{{NS}}}name", attrib={"lang": "de"}).text = "Dr. Lysandros Kephalos"
    etree.SubElement(ha_act2, f"{{{NS}}}actorType").text = "Person"
    etree.SubElement(ha_act2, f"{{{NS}}}roles", attrib={"lang": "de"}).text = "Konservierung & Entsalzung"
    
    ha_act3 = etree.SubElement(ha, f"{{{NS}}}actors")
    etree.SubElement(ha_act3, f"{{{NS}}}id").text = "ORG-IAA-BONN"
    etree.SubElement(ha_act3, f"{{{NS}}}name", attrib={"lang": "de"}).text = "Bonn Center for Digital Humanities (BCDH)"
    etree.SubElement(ha_act3, f"{{{NS}}}actorType").text = "Organisation"
    etree.SubElement(ha_act3, f"{{{NS}}}roles", attrib={"lang": "de"}).text = "Hochpräzise 3D-Digitalisierung & Datenverarbeitung"
    
    # designations
    ha_desig = etree.SubElement(ha, f"{{{NS}}}designations")
    etree.SubElement(ha_desig, f"{{{NS}}}protectionType", attrib={"lang": "de"}).text = "Internationales Kulturgut von herausragendem Wert (UNESCO Weltkulturerbe-Status)"
    etree.SubElement(ha_desig, f"{{{NS}}}grade", attrib={"lang": "de"}).text = "Klasse I (Singuläres Unikat)"
    etree.SubElement(ha_desig, f"{{{NS}}}dateFrom").text = "2026-01-15"
    etree.SubElement(ha_desig, f"{{{NS}}}displayDate").text = "Seit 15. Januar 2026 unter partiellem Schutz"
    
    # conditions
    ha_cond = etree.SubElement(ha, f"{{{NS}}}conditions")
    etree.SubElement(ha_cond, f"{{{NS}}}condition", attrib={"lang": "de"}).text = "Vollständig und funktionsfähig; oberflächliche Malachit- und Cuprit-Edelpatina stabilisiert"
    etree.SubElement(ha_cond, f"{{{NS}}}conditionAssessment", attrib={"lang": "de"}).text = "Sehr gut; interne Zahnrad-Mechanik nach elektrochemischer Entsalzung gängig"
    etree.SubElement(ha_cond, f"{{{NS}}}conditionDate").text = "2026-06-10"
    etree.SubElement(ha_cond, f"{{{NS}}}displayDate").text = "Befund vom 10. Juni 2026"
    etree.SubElement(ha_cond, f"{{{NS}}}wasPresentAt").text = "Restaurierungslabor für Unterwasserfunde Athen / IAA Bonn"
    
    # provenance
    ha_prov = etree.SubElement(ha, f"{{{NS}}}provenance", attrib={"lang": "de"})
    ha_prov.text = (
        "Geborgen im Mai 2025 während der Tiefsee-Forschungskampagne 'PROJECT AETHRA' "
        "mittels Tauchroboter ROV Okeanos in 142 m Tiefe am submarinen Steilabhang von Thera-Südost. "
        "Geschenk der Hellenischen Republik an das IAA Bonn zu Forschungszwecken im Rahmen bilateraler Abkommen."
    )
    
    # characters
    ha_chars = etree.SubElement(ha, f"{{{NS}}}characters")
    
    # heritageAssetType (multiple)
    etree.SubElement(ha_chars, f"{{{NS}}}heritageAssetType", attrib={
        "lang": "de", "namespace": "HECTOR", "term": "Kultisches Instrument", "termUID": "http://hector.dainst.org/vocab/ritual_instrument"
    }).text = "Kultisches Instrument"
    
    etree.SubElement(ha_chars, f"{{{NS}}}heritageAssetType", attrib={
        "lang": "en", "namespace": "AAT", "term": "astronomical models", "termUID": "http://vocab.getty.edu/page/aat/300211327"
    }).text = "astronomical models"
    
    etree.SubElement(ha_chars, f"{{{NS}}}heritageAssetType", attrib={
        "lang": "en", "namespace": "AAT", "term": "spheres (geometric figures)", "termUID": "http://vocab.getty.edu/page/aat/300055644"
    }).text = "spheres"
    
    # temporal (inside characters)
    ha_temp = etree.SubElement(ha_chars, f"{{{NS}}}temporal")
    ha_ts = etree.SubElement(ha_temp, f"{{{NS}}}timeSpan")
    etree.SubElement(ha_ts, f"{{{NS}}}startDate").text = "-1350"
    etree.SubElement(ha_ts, f"{{{NS}}}endDate").text = "-1280"
    etree.SubElement(ha_ts, f"{{{NS}}}dateRangeQualifier").text = "http://n2t.net/ark:/99152/p05krdx8w33"
    etree.SubElement(ha_temp, f"{{{NS}}}periodName", attrib={"lang": "de", "preferred": "true"}).text = "Späthelladisch III B / Spätbronzezeit (1350–1280 v. Chr.)"
    etree.SubElement(ha_temp, f"{{{NS}}}displayDate").text = "ca. 1350 – 1280 v. Chr."
    etree.SubElement(ha_temp, f"{{{NS}}}scientificDate", attrib={"lang": "de"}).text = "1325 ± 25 calBC"
    etree.SubElement(ha_temp, f"{{{NS}}}scientificDateMethod", attrib={"lang": "de"}).text = "Radiokarbonmethode (C14) an organischen Dichtungsfasern & OSL-Thermolumineszenz"
    
    # materials (multiple - only lang attribute allowed in CARARE 2.0.6 XSD)
    etree.SubElement(ha_chars, f"{{{NS}}}materials", attrib={"lang": "de"}).text = "Oreichalkos (Kupfer-Zink-Gold-Legierung)"
    etree.SubElement(ha_chars, f"{{{NS}}}materials", attrib={"lang": "de"}).text = "Lapislazuli"
    etree.SubElement(ha_chars, f"{{{NS}}}materials", attrib={"lang": "de"}).text = "Bergkristall"
    etree.SubElement(ha_chars, f"{{{NS}}}materials", attrib={"lang": "de"}).text = "Meteoriteneisen (Achsenlager)"
    
    # inscriptions
    ha_insc = etree.SubElement(ha_chars, f"{{{NS}}}inscriptions", attrib={
        "lang": "grc", "type": "Weihinschrift / Zodiak-Skala", "namespace": "Kypro-Minoischer Duktus"
    })
    ha_insc.text = "ΑΤΛΑΣ ΕΠΟΙΗΣΕΝ ΟΥΡΑΝΟΘΕΝ — ΑΣΤΡΟΘΕΣΙΑ ΤΩΝ ΩΚΕΑΝΙΔΩΝ ΚΑΙ ΠΛΕΙΑΔΩΝ"
    
    # dimensions (multiple)
    d1 = etree.SubElement(ha_chars, f"{{{NS}}}dimensions")
    etree.SubElement(d1, f"{{{NS}}}measurementType", attrib={"lang": "de"}).text = "Durchmesser"
    etree.SubElement(d1, f"{{{NS}}}units").text = "Zentimeter"
    etree.SubElement(d1, f"{{{NS}}}value").text = "48.5"
    
    d2 = etree.SubElement(ha_chars, f"{{{NS}}}dimensions")
    etree.SubElement(d2, f"{{{NS}}}measurementType", attrib={"lang": "de"}).text = "Höhe mit Sockel"
    etree.SubElement(d2, f"{{{NS}}}units").text = "Zentimeter"
    etree.SubElement(d2, f"{{{NS}}}value").text = "62.0"
    
    d3 = etree.SubElement(ha_chars, f"{{{NS}}}dimensions")
    etree.SubElement(d3, f"{{{NS}}}measurementType", attrib={"lang": "de"}).text = "Gesamtmasse"
    etree.SubElement(d3, f"{{{NS}}}units").text = "Kilogramm"
    etree.SubElement(d3, f"{{{NS}}}value").text = "18.75"
    
    d4 = etree.SubElement(ha_chars, f"{{{NS}}}dimensions")
    etree.SubElement(d4, f"{{{NS}}}extent", attrib={"lang": "de"}).text = "Wandstärke der Halbkugelschalen"
    etree.SubElement(d4, f"{{{NS}}}measurementType", attrib={"lang": "de"}).text = "Materialstärke"
    etree.SubElement(d4, f"{{{NS}}}units").text = "Millimeter"
    etree.SubElement(d4, f"{{{NS}}}value").text = "4.2"
    
    # spatial
    ha_spat = etree.SubElement(ha, f"{{{NS}}}spatial")
    ha_ls = etree.SubElement(ha_spat, f"{{{NS}}}locationSet")
    etree.SubElement(ha_ls, f"{{{NS}}}namedLocation", attrib={"lang": "de", "preferred": "true"}).text = "Thera-Südost / Seamount Atlantis (Submarines Areal Gamma-7)"
    etree.SubElement(ha_ls, f"{{{NS}}}geopoliticalArea", attrib={"lang": "de"}).text = "Kykladen / Ägäisches Meer"
    etree.SubElement(ha_ls, f"{{{NS}}}geopoliticalAreaType").text = "Archipel"
    etree.SubElement(ha_ls, f"{{{NS}}}historicalName", attrib={"lang": "grc", "preferred": "true"}).text = "Καλλίστη / Στρογγύλη (Kallistē / Strongylē)"
    
    ha_geom = etree.SubElement(ha_spat, f"{{{NS}}}geometry")
    etree.SubElement(ha_geom, f"{{{NS}}}spatialReferenceSystem").text = "EPSG:4326 (WGS84)"
    ha_qp = etree.SubElement(ha_geom, f"{{{NS}}}quickpoint")
    etree.SubElement(ha_qp, f"{{{NS}}}x").text = "25.432500"
    etree.SubElement(ha_qp, f"{{{NS}}}y").text = "36.385400"
    etree.SubElement(ha_qp, f"{{{NS}}}z").text = "-142.5"
    etree.SubElement(ha_qp, f"{{{NS}}}accuracy").text = "± 1.5 m (USBL-Unterwassernavigation)"
    
    # repositoryLocation
    ha_repo = etree.SubElement(ha, f"{{{NS}}}repositoryLocation", attrib={"lang": "de"})
    ha_repo.text = "IAA Bonn, Schatzkammer der Ägäis, Saal IV, Hochsicherheitsvitrine 12 (Inv. IAA-INV-2026-SPH-01)"
    
    # rights
    ha_rights = etree.SubElement(ha, f"{{{NS}}}rights")
    etree.SubElement(ha_rights, f"{{{NS}}}copyrightCreditLine", attrib={"lang": "de"}).text = "Institut für Archäo-Astronomie und Imaginäre Altertümer (IAA), Bonn"
    etree.SubElement(ha_rights, f"{{{NS}}}accessRights", attrib={"lang": "en"}).text = "Open Access / Wissenschaftliche Nachnutzung frei"
    etree.SubElement(ha_rights, f"{{{NS}}}reproductionRights", attrib={"lang": "en"}).text = "CC BY-SA 4.0 International"
    etree.SubElement(ha_rights, f"{{{NS}}}licence", attrib={"lang": "en"}).text = "https://creativecommons.org/licenses/by-sa/4.0/"
    
    # references
    ha_ref = etree.SubElement(ha, f"{{{NS}}}references")
    ref_app = etree.SubElement(ha_ref, f"{{{NS}}}appellation")
    etree.SubElement(ref_app, f"{{{NS}}}name", attrib={"lang": "de"}).text = "von Morstein, A. T. et al. (2026): Der Himmel von Thera-Atlantis. Prähistorische Himmelsmechanik und Oreichalkos-Metallurgie im 14. Jh. v. Chr. In: Journal of Aegean Archeoastronomy 44, S. 112–189."
    etree.SubElement(ref_app, f"{{{NS}}}id").text = "DOI:10.11588/jaa.2026.1.99841"
    etree.SubElement(ha_ref, f"{{{NS}}}type", attrib={"lang": "de"}).text = "Monographie / Peer-Reviewed Journal"
    etree.SubElement(ha_ref, f"{{{NS}}}rights").text = "Open Access (CC BY 4.0)"
    etree.SubElement(ha_ref, f"{{{NS}}}link").text = "https://doi.org/10.11588/jaa.2026.1.99841"
    
    # relations (Exact XSD sequence: hasRepresentation -> isSuccessorOf -> wasPresentAt -> hasPart -> isPartOf -> isReplicaOf -> wasDigitizedBy -> dcRelation)
    etree.SubElement(ha, f"{{{NS}}}hasRepresentation").text = "DO_IAA_ATL_SPH01_MASTER_HP"
    etree.SubElement(ha, f"{{{NS}}}hasRepresentation").text = "DO_IAA_ATL_SPH01_WEB3D_GLTF"
    etree.SubElement(ha, f"{{{NS}}}isSuccessorOf").text = "Kultschrein Pithos-Kammer VII"
    etree.SubElement(ha, f"{{{NS}}}wasPresentAt").text = "Tauchkampagne AETHRA 2025"
    etree.SubElement(ha, f"{{{NS}}}hasPart").text = "Zahnrad-Kranz Zodiac-Ring I"
    etree.SubElement(ha, f"{{{NS}}}hasPart").text = "Achsenlager Lapislazuli-Inlay II"
    etree.SubElement(ha, f"{{{NS}}}isPartOf").text = "Heiligtum der Astraea (Versunkenes Ensemble)"
    etree.SubElement(ha, f"{{{NS}}}isReplicaOf").text = "Rekonstruktions-Guss Bonn 2026"
    etree.SubElement(ha, f"{{{NS}}}wasDigitizedBy").text = "ACT-2026-IAA-DIGI-01"
    etree.SubElement(ha, f"{{{NS}}}dcRelation").text = "https://ark.iaa-bonn.org/ark:/99152/atlas_sphere_01"
    
    # =========================================================================
    # 3. DIGITAL RESOURCE 1: HIGH-POLY MASTER 3D-SCAN
    # =========================================================================
    dr1 = etree.SubElement(carare, f"{{{NS}}}digitalResource")
    
    # recordInformation
    dr1_rec = etree.SubElement(dr1, f"{{{NS}}}recordInformation")
    etree.SubElement(dr1_rec, f"{{{NS}}}id").text = "DO_IAA_ATL_SPH01_MASTER_HP"
    etree.SubElement(dr1_rec, f"{{{NS}}}source", attrib={"lang": "de"}).text = "Bonn Center for Digital Humanities (BCDH) / IAA Bonn"
    etree.SubElement(dr1_rec, f"{{{NS}}}country", attrib={"lang": "de"}).text = "DE"
    dr1_creat = etree.SubElement(dr1_rec, f"{{{NS}}}creation")
    etree.SubElement(dr1_creat, f"{{{NS}}}date").text = "2026-04-15"
    etree.SubElement(dr1_rec, f"{{{NS}}}language", attrib={"lang": "en"}).text = "en"
    etree.SubElement(dr1_rec, f"{{{NS}}}metadataRights").text = "https://creativecommons.org/licenses/by-sa/4.0/"
    
    # appellation
    dr1_app = etree.SubElement(dr1, f"{{{NS}}}appellation")
    dr1_name = etree.SubElement(dr1_app, f"{{{NS}}}name", attrib={"lang": "en", "preferred": "true"})
    dr1_name.text = "Atlas Sphere Master High-Poly 3D Mesh (Artec Leo / Nikon Z8 Macro SfM)"
    etree.SubElement(dr1_app, f"{{{NS}}}id").text = "DO_IAA_ATL_SPH01_MASTER_HP"
    
    # description (inklusive strukturierter 3D-Paradaten nach London Charter)
    dr1_desc = etree.SubElement(dr1, f"{{{NS}}}description", attrib={"lang": "de"})
    dr1_desc.text = (
        "Wissenschaftlicher 3D-Masterdatensatz der Oreichalkos-Sphäre des Atlas. "
        "Erfasst mittels kombinierter optischer Triangulation (Artec Leo 2026 Pro, Punktgenauigkeit 0.05 mm) "
        "und multispektraler Nahbereichs-Photogrammetrie (Nikon Z8, 45.7 MP, polarisiertes Ringlicht). "
        "3D-Paradaten: Vollständige 360°-Erfassung inklusive Hohlraumspiegelung; "
        "Geometrische Löcher in mikroskopischen Zahnflanken per Screened Poisson Reconstruction (Depth 14) geschlossen; "
        "Messrauschen bilateral unter Erhalt von Gravurlinien geglättet; "
        "PBR-Karten händisch anhand spektraler Remissionsmessungen kalibriert."
    )
    
    # note
    etree.SubElement(dr1, f"{{{NS}}}note", attrib={"lang": "de"}).text = "Archiv-Master für Finite-Elemente-Simulation und Restaurierungsdokumentation. Nur für wissenschaftliche Partner."
    
    # actors
    dr1_act = etree.SubElement(dr1, f"{{{NS}}}actors")
    etree.SubElement(dr1_act, f"{{{NS}}}name", attrib={"lang": "de"}).text = "Matthias Lang (BCDH)"
    etree.SubElement(dr1_act, f"{{{NS}}}roles", attrib={"lang": "en"}).text = "3D Digitisation Specialist & Pipeline Architect"
    
    # type & format
    etree.SubElement(dr1, f"{{{NS}}}type").text = "3D"
    etree.SubElement(dr1, f"{{{NS}}}format").text = "model/obj"
    etree.SubElement(dr1, f"{{{NS}}}format").text = "application/x-ply"
    etree.SubElement(dr1, f"{{{NS}}}format").text = "image/tiff"
    
    # formatDetails (kontrollierte 3D-Metadaten)
    dr1_fd = etree.SubElement(dr1, f"{{{NS}}}formatDetails", attrib={"lang": "de"})
    dr1_fd.text = (
        "Mesh-Kategorie: Master High-Poly | Polygone: 32.400.000 Faces | Vertices: 16.200.000 | "
        "Texturauflösung: 16384x16384 (16K Master TIFF) | PBR-Kanäle: Albedo, Normal (16-bit Tangent), "
        "Roughness, Metallic, Ambient Occlusion, Displacement | Hardware: Artec Leo 2026 Pro (0.05 mm Genauigkeit) | "
        "Software: Artec Studio 19, RealityCapture 1.4, Blender 4.2 LTS, Substance 3D Designer 14"
    )
    
    # extent
    etree.SubElement(dr1, f"{{{NS}}}extent").text = "32.4 Mio. Faces, 16.2 Mio. Vertices, 16K PBR-Texturen, 1.42 GB Dateigröße"
    
    # created
    etree.SubElement(dr1, f"{{{NS}}}created").text = "2026-04-15"
    
    # language
    etree.SubElement(dr1, f"{{{NS}}}language", attrib={"lang": "en"}).text = "en"
    
    # links
    etree.SubElement(dr1, f"{{{NS}}}link").text = "https://data.iaa-bonn.org/models/atlas_sphere_master_hp.obj"
    etree.SubElement(dr1, f"{{{NS}}}object").text = "https://data.iaa-bonn.org/previews/atlas_sphere_thumb.jpg"
    etree.SubElement(dr1, f"{{{NS}}}isShownAt").text = "https://viewer.iaa-bonn.org/object/IAA-INV-2026-SPH-01"
    
    # rights
    dr1_rights = etree.SubElement(dr1, f"{{{NS}}}rights")
    etree.SubElement(dr1_rights, f"{{{NS}}}copyrightCreditLine", attrib={"lang": "de"}).text = "BCDH Bonn / IAA Bonn"
    etree.SubElement(dr1_rights, f"{{{NS}}}accessRights", attrib={"lang": "en"}).text = "Open Access Academic"
    etree.SubElement(dr1_rights, f"{{{NS}}}reproductionRights", attrib={"lang": "en"}).text = "CC BY-SA 4.0"
    etree.SubElement(dr1_rights, f"{{{NS}}}licence", attrib={"lang": "en"}).text = "https://creativecommons.org/licenses/by-sa/4.0/"
    
    # dc relations
    etree.SubElement(dr1, f"{{{NS}}}isRepresentationOf").text = "HERMES-HA-ATL-001"
    etree.SubElement(dr1, f"{{{NS}}}hasDerivative").text = "DO_IAA_ATL_SPH01_WEB3D_GLTF"
    etree.SubElement(dr1, f"{{{NS}}}dcRelation").text = "ACT-2026-IAA-DIGI-01"
    
    # =========================================================================
    # 3b. DIGITAL RESOURCE 2: GAME-READY WEB3D DERIVATIVE
    # =========================================================================
    dr2 = etree.SubElement(carare, f"{{{NS}}}digitalResource")
    
    dr2_rec = etree.SubElement(dr2, f"{{{NS}}}recordInformation")
    etree.SubElement(dr2_rec, f"{{{NS}}}id").text = "DO_IAA_ATL_SPH01_WEB3D_GLTF"
    etree.SubElement(dr2_rec, f"{{{NS}}}source", attrib={"lang": "de"}).text = "BCDH Bonn"
    etree.SubElement(dr2_rec, f"{{{NS}}}country", attrib={"lang": "de"}).text = "DE"
    dr2_creat = etree.SubElement(dr2_rec, f"{{{NS}}}creation")
    etree.SubElement(dr2_creat, f"{{{NS}}}date").text = "2026-04-18"
    etree.SubElement(dr2_rec, f"{{{NS}}}language", attrib={"lang": "en"}).text = "en"
    
    dr2_app = etree.SubElement(dr2, f"{{{NS}}}appellation")
    dr2_name = etree.SubElement(dr2_app, f"{{{NS}}}name", attrib={"lang": "en", "preferred": "true"})
    dr2_name.text = "Atlas Sphere Web-Ready 3D Derivative (glTF 2.0 / GLB)"
    etree.SubElement(dr2_app, f"{{{NS}}}id").text = "DO_IAA_ATL_SPH01_WEB3D_GLTF"
    
    dr2_desc = etree.SubElement(dr2, f"{{{NS}}}description", attrib={"lang": "de"})
    dr2_desc.text = "Echtzeit- und VR-optimiertes Web-3D-Modell (glTF/GLB) mit gebackener 4K-Normal-Map und PBR-Materialien für flüssige 60-FPS-Darstellung im Web-Browser."
    
    etree.SubElement(dr2, f"{{{NS}}}type").text = "3D"
    etree.SubElement(dr2, f"{{{NS}}}format").text = "model/gltf-binary"
    etree.SubElement(dr2, f"{{{NS}}}format").text = "model/gltf+json"
    
    dr2_fd = etree.SubElement(dr2, f"{{{NS}}}formatDetails", attrib={"lang": "de"})
    dr2_fd.text = "Mesh-Kategorie: Low-Poly / Realtime Web-Ready | Polygone: 85.000 Triangles | Vertices: 43.500 | Textur: 4096x4096 WebP | Optimierung: Draco Geometry Compression"
    
    etree.SubElement(dr2, f"{{{NS}}}extent").text = "85k Triangles, 4K PBR, 14.8 MB GLB"
    etree.SubElement(dr2, f"{{{NS}}}created").text = "2026-04-18"
    
    etree.SubElement(dr2, f"{{{NS}}}link").text = "https://data.iaa-bonn.org/models/atlas_sphere_web3d.glb"
    etree.SubElement(dr2, f"{{{NS}}}object").text = "https://data.iaa-bonn.org/previews/atlas_sphere_web_thumb.jpg"
    etree.SubElement(dr2, f"{{{NS}}}isShownAt").text = "https://3d.iaa-bonn.org/view/atlas_sphere"
    
    dr2_rights = etree.SubElement(dr2, f"{{{NS}}}rights")
    etree.SubElement(dr2_rights, f"{{{NS}}}copyrightCreditLine", attrib={"lang": "de"}).text = "BCDH Bonn / IAA Bonn"
    etree.SubElement(dr2_rights, f"{{{NS}}}accessRights", attrib={"lang": "en"}).text = "Open Access"
    etree.SubElement(dr2_rights, f"{{{NS}}}reproductionRights", attrib={"lang": "en"}).text = "CC BY-SA 4.0"
    etree.SubElement(dr2_rights, f"{{{NS}}}licence", attrib={"lang": "en"}).text = "https://creativecommons.org/licenses/by-sa/4.0/"
    
    etree.SubElement(dr2, f"{{{NS}}}isRepresentationOf").text = "HERMES-HA-ATL-001"
    etree.SubElement(dr2, f"{{{NS}}}isDerivativeOf").text = "DO_IAA_ATL_SPH01_MASTER_HP"
    
    # =========================================================================
    # 4. ACTIVITY: 3D-DIGITISATION & PARADATA WORKFLOW
    # =========================================================================
    act = etree.SubElement(carare, f"{{{NS}}}activity")
    
    # recordInformation
    act_rec = etree.SubElement(act, f"{{{NS}}}recordInformation")
    etree.SubElement(act_rec, f"{{{NS}}}id").text = "ACT-2026-IAA-DIGI-01"
    etree.SubElement(act_rec, f"{{{NS}}}source", attrib={"lang": "de"}).text = "BCDH Bonn"
    act_creat = etree.SubElement(act_rec, f"{{{NS}}}creation")
    etree.SubElement(act_creat, f"{{{NS}}}date").text = "2026-04-20"
    
    # appellation
    act_app = etree.SubElement(act, f"{{{NS}}}appellation")
    act_name = etree.SubElement(act_app, f"{{{NS}}}name", attrib={"lang": "de", "preferred": "true"})
    act_name.text = "Ganzheitliche 3D-Digitalisierung, photometrische Oberflächenerfassung und Paradata-Dokumentation der Oreichalkos-Sphäre"
    etree.SubElement(act_app, f"{{{NS}}}id").text = "ACT-2026-IAA-DIGI-01"
    
    # description
    act_desc = etree.SubElement(act, f"{{{NS}}}description", attrib={"lang": "de"})
    act_desc.text = (
        "Interdisziplinärer Digitalisierungsworkflow zur berührungslosen Erfassung geometrischer und optischer Eigenschaften "
        "der Oreichalkos-Sphäre des Atlas. Gemäß London Charter und Sevilla Principles wurden alle messtechnischen Entscheidungen, "
        "Filtergrenzen und Rekonstruktionsschritte lückenlos protokolliert."
    )
    
    # hasGeneralPurpose
    etree.SubElement(act, f"{{{NS}}}hasGeneralPurpose", attrib={"lang": "en"}).text = "Scientific 3D preservation, finite element structural analysis, and interactive museum dissemination"
    
    # eventType
    etree.SubElement(act, f"{{{NS}}}eventType", attrib={
        "lang": "en", "namespace": "AAT", "term": "3D digitisation", "termUID": "http://vocab.getty.edu/page/aat/300435427"
    }).text = "3D digitisation"
    
    # actors
    act_a1 = etree.SubElement(act, f"{{{NS}}}actors")
    etree.SubElement(act_a1, f"{{{NS}}}id").text = "ACTOR-ML-001"
    etree.SubElement(act_a1, f"{{{NS}}}name", attrib={"lang": "de"}).text = "Dr. Matthias Lang"
    etree.SubElement(act_a1, f"{{{NS}}}actorType").text = "Person"
    etree.SubElement(act_a1, f"{{{NS}}}roles", attrib={"lang": "de"}).text = "Leitung 3D-Digitalisierung & Datenarchitektur"
    
    act_a2 = etree.SubElement(act, f"{{{NS}}}actors")
    etree.SubElement(act_a2, f"{{{NS}}}id").text = "ACTOR-VS-002"
    etree.SubElement(act_a2, f"{{{NS}}}name", attrib={"lang": "de"}).text = "Valentina Salcedo Paparoni"
    etree.SubElement(act_a2, f"{{{NS}}}actorType").text = "Person"
    etree.SubElement(act_a2, f"{{{NS}}}roles", attrib={"lang": "de"}).text = "Makro-Photogrammetrie & Texturberechnung"
    
    # temporal
    act_temp = etree.SubElement(act, f"{{{NS}}}temporal")
    act_ts = etree.SubElement(act_temp, f"{{{NS}}}timeSpan")
    etree.SubElement(act_ts, f"{{{NS}}}startDate").text = "2026-02-01"
    etree.SubElement(act_ts, f"{{{NS}}}endDate").text = "2026-04-15"
    etree.SubElement(act_temp, f"{{{NS}}}periodName", attrib={"lang": "de"}).text = "Projektphase Frühjahr 2026"
    etree.SubElement(act_temp, f"{{{NS}}}displayDate").text = "1. Februar 2026 – 15. April 2026"
    
    # spatial
    act_spat = etree.SubElement(act, f"{{{NS}}}spatial")
    act_ls = etree.SubElement(act_spat, f"{{{NS}}}locationSet")
    etree.SubElement(act_ls, f"{{{NS}}}namedLocation", attrib={"lang": "de"}).text = "Digital Humanities 3D-Labor, BCDH Universität Bonn"
    
    # consistsOf: Sub-activities with Paradata details
    # 1. Optical structured-light scanning
    co1 = etree.SubElement(act, f"{{{NS}}}consistsOf")
    etree.SubElement(co1, f"{{{NS}}}hadSpecificPurpose", attrib={"lang": "de"}).text = "Hochauflösendes Streifenlicht-Scanning der Primärgeometrie und Gravurdetails"
    etree.SubElement(co1, f"{{{NS}}}startDate").text = "2026-02-05"
    etree.SubElement(co1, f"{{{NS}}}endDate").text = "2026-02-20"
    etree.SubElement(co1, f"{{{NS}}}methods", attrib={"lang": "en"}).text = "Structured-light optical surface scanning"
    etree.SubElement(co1, f"{{{NS}}}techniques", attrib={"lang": "en"}).text = "Sub-millimeter optical triangulation (0.05 mm)"
    etree.SubElement(co1, f"{{{NS}}}equipment", attrib={"lang": "en"}).text = "Artec Leo 2026 Pro, Drehteller mit Antireflexions-Auflage, Artec Studio 19"
    
    # 2. Macro photogrammetry
    co2 = etree.SubElement(act, f"{{{NS}}}consistsOf")
    etree.SubElement(co2, f"{{{NS}}}hadSpecificPurpose", attrib={"lang": "de"}).text = "Makro-Photogrammetrie und kalibrierte PBR-Texturgenerierung"
    etree.SubElement(co2, f"{{{NS}}}startDate").text = "2026-02-22"
    etree.SubElement(co2, f"{{{NS}}}endDate").text = "2026-03-10"
    etree.SubElement(co2, f"{{{NS}}}methods", attrib={"lang": "en"}).text = "Close-range SfM photogrammetry"
    etree.SubElement(co2, f"{{{NS}}}techniques", attrib={"lang": "en"}).text = "Cross-polarized multispectral ring lighting (Glanzunterdrückung)"
    etree.SubElement(co2, f"{{{NS}}}equipment", attrib={"lang": "en"}).text = "Nikon Z8 (45.7 MP), NIKKOR Z MC 105mm f/2.8 VR S, RealityCapture 1.4, Adobe Lightroom 14.1"
    
    # 3. Mesh fusion and decimation
    co3 = etree.SubElement(act, f"{{{NS}}}consistsOf")
    etree.SubElement(co3, f"{{{NS}}}hadSpecificPurpose", attrib={"lang": "de"}).text = "Geometrische Fusion, Hole Filling und Normal-Map-Baking"
    etree.SubElement(co3, f"{{{NS}}}startDate").text = "2026-03-15"
    etree.SubElement(co3, f"{{{NS}}}endDate").text = "2026-04-12"
    etree.SubElement(co3, f"{{{NS}}}methods", attrib={"lang": "en"}).text = "Poisson surface reconstruction and normal map projection"
    etree.SubElement(co3, f"{{{NS}}}techniques", attrib={"lang": "en"}).text = "Screened Poisson Depth 14, non-manifold vertex cleaning"
    etree.SubElement(co3, f"{{{NS}}}equipment", attrib={"lang": "en"}).text = "Blender 4.2 LTS, Substance 3D Designer 14, MeshLab 2024"
    
    # assessments
    etree.SubElement(act, f"{{{NS}}}assessments", attrib={"lang": "de"}).text = "Qualitätsprüfung nach ISO 17025 bestanden; mittlere Oberflächenabweichung < 0.03 mm; 100% Farbtreue (Delta-E < 1.2)"
    
    # relations
    etree.SubElement(act, f"{{{NS}}}occurredAt").text = "Bonn / Labor Am Hof 1"
    etree.SubElement(act, f"{{{NS}}}happenedAt").text = "2026-02-01 bis 2026-04-15"
    etree.SubElement(act, f"{{{NS}}}wasPresentAt").text = "HERMES-HA-ATL-001"
    etree.SubElement(act, f"{{{NS}}}hasCreated").text = "DO_IAA_ATL_SPH01_MASTER_HP"
    etree.SubElement(act, f"{{{NS}}}hasCreated").text = "DO_IAA_ATL_SPH01_WEB3D_GLTF"
    etree.SubElement(act, f"{{{NS}}}dcRelation").text = "https://projects.iaa-bonn.org/aethra-3d"
    
    return root

if __name__ == "__main__":
    print("Building Fantasy CARARE XML...")
    root = build_fantasy_carare_xml()
    xml_bytes = etree.tostring(root, pretty_print=True, xml_declaration=True, encoding="utf-8")
    
    # Validate against carare-v2.0.6.xsd
    xsd_path = "CARARE/carare-v2.0.6.xsd"
    with open(xsd_path, "rb") as f:
        schema_doc = etree.XML(f.read())
    schema = etree.XMLSchema(schema_doc)
    
    doc = etree.XML(xml_bytes)
    is_valid = schema.validate(doc)
    print(f"Schema Validation Result: {is_valid}")
    
    if not is_valid:
        print("Validation Errors:")
        for err in schema.error_log:
            print(f"  Line {err.line}: {err.message}")
    else:
        out_xml = "CARARE/CARARE_Phantasieobjekt_Atlas_Sphaere.xml"
        with open(out_xml, "wb") as f:
            f.write(xml_bytes)
        print(f"Successfully saved validated XML to {out_xml}")
        
        # Now create BagIt ZIP
        zip_path = "CARARE/CARARE_Phantasieobjekt_Atlas_Sphaere_bagit.zip"
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
            zf.writestr("bagit.txt", "BagIt-Version: 0.97\nTag-File-Character-Encoding: UTF-8\n")
            
            bag_info_lines = [
                "Source-Organization: Institut für Archäo-Astronomie und Imaginäre Altertümer (IAA) / BCDH Bonn",
                "Organization-Address: Am Hofgarten der Mysterien 42, 53113 Bonn, Germany",
                "Contact-Name: Prof. Dr. Aurelia Thalassa von Morstein, Dr. Matthias Lang",
                "Contact-Email: aurelia.morstein@iaa-bonn.org, mlang@uni-bonn.de",
                "External-Description: CARARE 2.0.6 BagIt Package for Die Oreichalkos-Sphaere des Atlas (IAA-INV-2026-SPH-01)",
                "Bagging-Date: 2026-10-23",
                "Payload-Oxum: 0.1",
                "",
                "# HERMES metadata bindings",
                "Collection.id: DE-IAA-9999999_Atlantis_Curated_Collection",
                "Collection.title: Schätze der ägäischen Tiefen: Das Pantheon der versunkenen Sphären von Thera-Atlantis",
                "Collection.source: Institut für Archäo-Astronomie und Imaginäre Altertümer (IAA), Bonn",
                "",
                "HeritageAsset.id: HERMES-HA-ATL-001",
                "HeritageAsset.title: Die Oreichalkos-Sphäre des Atlas: Drehbarer Himmelsglobus mit astronomischem Räderwerk",
                "HeritageAsset.materials: Oreichalkos, Lapislazuli, Bergkristall, Meteoriteneisen",
                "HeritageAsset.periodName: Späthelladisch III B / Spätbronzezeit (1350–1280 v. Chr.)",
                "HeritageAsset.startDate: -1350",
                "HeritageAsset.endDate: -1280",
                "HeritageAsset.location: Thera-Südost / Seamount Atlantis (Submarines Areal Gamma-7)",
                "",
                "DigitalResource.id: DO_IAA_ATL_SPH01_MASTER_HP",
                "DigitalResource.title: Atlas Sphere Master High-Poly 3D Mesh (Artec Leo / Nikon Z8 Macro SfM)",
                "DigitalResource.type: 3D",
                "DigitalResource.format: model/obj, application/x-ply, image/tiff",
                "DigitalResource.extent: 32.4 Mio. Faces, 16.2 Mio. Vertices, 16K PBR-Texturen, 1.42 GB Dateigröße",
                "",
                "Activity.id: ACT-2026-IAA-DIGI-01",
                "Activity.title: Ganzheitliche 3D-Digitalisierung, photometrische Oberflächenerfassung und Paradata-Dokumentation der Oreichalkos-Sphäre",
                "Activity.eventType: 3D digitisation",
                "Activity.methods: Structured-light optical surface scanning, Close-range SfM photogrammetry, Poisson surface reconstruction"
            ]
            zf.writestr("bag-info.txt", "\n".join(bag_info_lines))
            zf.writestr("data/carare.xml", xml_bytes)
            
            xml_sha256 = hashlib.sha256(xml_bytes).hexdigest()
            zf.writestr("manifest-sha256.txt", f"{xml_sha256}  data/carare.xml\n")
            
            tag_manifest_lines = []
            for name in ["bagit.txt", "bag-info.txt", "manifest-sha256.txt"]:
                data = zf.read(name)
                h = hashlib.sha256(data).hexdigest()
                tag_manifest_lines.append(f"{h}  {name}\n")
            zf.writestr("tagmanifest-sha256.txt", "".join(tag_manifest_lines))
        print(f"Successfully created BagIt archive at {zip_path}")
