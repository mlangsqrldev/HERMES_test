import os
import zipfile
import hashlib
from lxml import etree

NS = "http://www.carare.eu/carareSchema"
XSI = "http://www.w3.org/2001/XMLSchema-instance"

def build_nikarete_xml():
    # Root
    root = etree.Element(f"{{{NS}}}carareWrap", nsmap={None: NS})
    
    # carare container
    carare = etree.SubElement(root, f"{{{NS}}}carare", attrib={"id": "SPK-SMB-ANT_SK740"})
    
    # ----------------------------------------------------
    # 1. Collection Information
    # ----------------------------------------------------
    col_wrap = etree.SubElement(carare, f"{{{NS}}}collectionInformation")
    
    col_id = etree.SubElement(col_wrap, f"{{{NS}}}id")
    col_id.text = "DE-MUS-814111_Nikarete_Collection"
    
    col_title_de = etree.SubElement(col_wrap, f"{{{NS}}}title", attrib={"lang": "de", "preferred": "true"})
    col_title_de.text = "Grabnaiskos der Nikarete: Weibliches Fragment vom Grabmal der Nikarete"
    
    col_title_en = etree.SubElement(col_wrap, f"{{{NS}}}title", attrib={"lang": "en", "preferred": "false"})
    col_title_en.text = "Female fragment of the tomb of Nikarete"
    
    col_source = etree.SubElement(col_wrap, f"{{{NS}}}source", attrib={"lang": "de"})
    col_source.text = "Antikensammlung, Berlin. Staatliche Museen zu Berlin"
    
    # Contacts
    col_contacts_val = etree.SubElement(col_wrap, f"{{{NS}}}contacts")
    c_name_v = etree.SubElement(col_contacts_val, f"{{{NS}}}name")
    c_name_v.text = "Valentina Salcedo Paparoni"
    c_role_v = etree.SubElement(col_contacts_val, f"{{{NS}}}role")
    c_role_v.text = "Documentation"
    c_org_v = etree.SubElement(col_contacts_val, f"{{{NS}}}organization")
    c_org_v.text = "Staatliche Museen zu Berlin, Stiftung Preußischer Kulturbesitz"
    
    col_contacts_ml = etree.SubElement(col_wrap, f"{{{NS}}}contacts")
    c_name_m = etree.SubElement(col_contacts_ml, f"{{{NS}}}name")
    c_name_m.text = "Matthias Lang"
    c_role_m = etree.SubElement(col_contacts_ml, f"{{{NS}}}role")
    c_role_m.text = "Project Lead"
    c_org_m = etree.SubElement(col_contacts_ml, f"{{{NS}}}organization")
    c_org_m.text = "Bonn Center for Digital Humanities, Bonn University"
    
    # Rights
    col_rights = etree.SubElement(col_wrap, f"{{{NS}}}rights")
    c_credit = etree.SubElement(col_rights, f"{{{NS}}}copyrightCreditLine", attrib={"lang": "de"})
    c_credit.text = "Staatliche Museen zu Berlin, Stiftung Preußischer Kulturbesitz / BCDH Bonn University"
    c_acc = etree.SubElement(col_rights, f"{{{NS}}}accessRights", attrib={"lang": "en"})
    c_acc.text = "Open Access"
    c_rep = etree.SubElement(col_rights, f"{{{NS}}}reproductionRights", attrib={"lang": "en"})
    c_rep.text = "CC BY-SA 4.0"
    c_lic = etree.SubElement(col_rights, f"{{{NS}}}licence", attrib={"lang": "en"})
    c_lic.text = "https://creativecommons.org/licenses/by-sa/4.0/"
    
    col_lang_de = etree.SubElement(col_wrap, f"{{{NS}}}language", attrib={"lang": "de"})
    col_lang_de.text = "de"
    col_lang_en = etree.SubElement(col_wrap, f"{{{NS}}}language", attrib={"lang": "de"})
    col_lang_en.text = "en"
    
    col_stmt = etree.SubElement(col_wrap, f"{{{NS}}}statement", attrib={"lang": "de", "preferred": "true"})
    col_stmt.text = "Grabnaiskos der Nikarete (SK 740). Weibliches Fragment eines attischen Grabmals der Spätklassik (ca. 330–320 v. Chr.) aus pentelischem Marmor auf Sandsteinsockel, gefunden im Kerameikos zu Athen. Erworben 1820. Hochpräzise 3D-Digitalisierung (Streifenlicht-Scanning Artec Leo und Makro-Photogrammetrie Nikon Z8) durchgeführt durch das Bonn Center for Digital Humanities (BCDH) im Auftrag der Staatlichen Museen zu Berlin."
    
    col_creation = etree.SubElement(col_wrap, f"{{{NS}}}creation")
    col_createdOn = etree.SubElement(col_creation, f"{{{NS}}}createdOn")
    col_createdOn.text = "2025-04-17"
    
    # Keywords (HECTOR & Getty AAT)
    keywords_list = [
        ("Grabrelief", "HECTOR"),
        ("Grabmonument", "HECTOR"),
        ("Pentelischer Marmor", "AAT"),
        ("Kerameikos", "Pleiades"),
        ("Attika", "Pleiades"),
        ("Spätklassik", "HECTOR"),
        ("3D-Digitalisierung", "AAT"),
        ("Streifenlicht-Scanning", "AAT"),
        ("Photogrammetrie", "AAT"),
        ("Digitaler Zwilling", "HERMES"),
        ("Digitaler Schatten", "CAA-Preprint"),
        ("VR-Lernumgebung", "AAT")
    ]
    for kw, ns_attr in keywords_list:
        kw_el = etree.SubElement(col_wrap, f"{{{NS}}}keywords", attrib={"lang": "de", "namespace": ns_attr})
        kw_el.text = kw
        
    # Coverage
    cov = etree.SubElement(col_wrap, f"{{{NS}}}coverage")
    cov_temp = etree.SubElement(cov, f"{{{NS}}}temporal")
    cov_ts = etree.SubElement(cov_temp, f"{{{NS}}}timeSpan")
    cov_start = etree.SubElement(cov_ts, f"{{{NS}}}startDate")
    cov_start.text = "-0330"
    cov_end = etree.SubElement(cov_ts, f"{{{NS}}}endDate")
    cov_end.text = "-0320"
    cov_period = etree.SubElement(cov_temp, f"{{{NS}}}periodName", attrib={"lang": "de", "preferred": "true"})
    cov_period.text = "Spätklassik (330 - 320 v. Chr.)"
    cov_disp = etree.SubElement(cov_temp, f"{{{NS}}}displayDate", attrib={"lang": "de", "preferred": "true"})
    cov_disp.text = "330 – 320 v. Chr."
    
    cov_spat = etree.SubElement(cov, f"{{{NS}}}spatial")
    cov_loc = etree.SubElement(cov_spat, f"{{{NS}}}locationSet")
    cov_nl = etree.SubElement(cov_loc, f"{{{NS}}}namedLocation", attrib={"lang": "de", "preferred": "true", "namespace": "Pleiades", "term": "Kerameikos", "termUID": "579986"})
    cov_nl.text = "Kerameikos, Athen, Attika"
    cov_geo = etree.SubElement(cov_loc, f"{{{NS}}}geopoliticalArea", attrib={"lang": "de"})
    cov_geo.text = "Griechenland"
    
    # ----------------------------------------------------
    # 2. Heritage Asset Identification
    # ----------------------------------------------------
    ha_wrap = etree.SubElement(carare, f"{{{NS}}}heritageAssetIdentification")
    
    ha_rec = etree.SubElement(ha_wrap, f"{{{NS}}}recordInformation")
    ha_rec_id = etree.SubElement(ha_rec, f"{{{NS}}}id")
    ha_rec_id.text = "SK 740"
    ha_rec_src = etree.SubElement(ha_rec, f"{{{NS}}}source", attrib={"lang": "de"})
    ha_rec_src.text = "Antikensammlung, Berlin. Staatliche Museen zu Berlin"
    ha_rec_country = etree.SubElement(ha_rec, f"{{{NS}}}country", attrib={"lang": "de"})
    ha_rec_country.text = "DE"
    ha_rec_create = etree.SubElement(ha_rec, f"{{{NS}}}creation")
    ha_rec_date = etree.SubElement(ha_rec_create, f"{{{NS}}}date")
    ha_rec_date.text = "2025-04-17"
    ha_rec_l1 = etree.SubElement(ha_rec, f"{{{NS}}}language", attrib={"lang": "de"})
    ha_rec_l1.text = "de"
    ha_rec_l2 = etree.SubElement(ha_rec, f"{{{NS}}}language", attrib={"lang": "de"})
    ha_rec_l2.text = "en"
    ha_rec_mr = etree.SubElement(ha_rec, f"{{{NS}}}metadataRights", attrib={"lang": "en"})
    ha_rec_mr.text = "https://creativecommons.org/licenses/by-sa/4.0/"
    
    # Appellation
    ha_app = etree.SubElement(ha_wrap, f"{{{NS}}}appellation")
    ha_name_de = etree.SubElement(ha_app, f"{{{NS}}}name", attrib={"lang": "de", "preferred": "true"})
    ha_name_de.text = "Grabnaiskos der Nikarete: Weibliches Fragment vom Grabmal der Nikarete"
    ha_name_en = etree.SubElement(ha_app, f"{{{NS}}}name", attrib={"lang": "en", "preferred": "false"})
    ha_name_en.text = "Female fragment of the tomb of Nikarete"
    ha_app_id = etree.SubElement(ha_app, f"{{{NS}}}id")
    ha_app_id.text = "SK 740"
    
    ha_desc = etree.SubElement(ha_wrap, f"{{{NS}}}description", attrib={"lang": "de"})
    ha_desc.text = "Weibliches Fragment vom Grabmal der Nikarete. Attischer Grabnaiskos aus pentelischem Marmor auf Sandsteinsockel. Dargestellt ist eine sitzende, trauernde Frauengestalt im Hochrelief. Gefunden im Kerameikos zu Athen. Datierung: Spätklassik, ca. 330–320 v. Chr. Inventarnummer SK 740 der Antikensammlung Berlin."
    
    ha_gen = etree.SubElement(ha_wrap, f"{{{NS}}}generalType")
    ha_gen.text = "Artefact"
    
    # Actors
    ha_actor1 = etree.SubElement(ha_wrap, f"{{{NS}}}actors")
    ha_a1_name = etree.SubElement(ha_actor1, f"{{{NS}}}name", attrib={"lang": "de"})
    ha_a1_name.text = "Nikarete"
    ha_a1_role = etree.SubElement(ha_actor1, f"{{{NS}}}roles", attrib={"lang": "de"})
    ha_a1_role.text = "Verstorbene / Dargestellte"
    
    ha_actor2 = etree.SubElement(ha_wrap, f"{{{NS}}}actors")
    ha_a2_id = etree.SubElement(ha_actor2, f"{{{NS}}}id")
    ha_a2_id.text = "https://lobid.org/organisations/DE-MUS-814111"
    ha_a2_name = etree.SubElement(ha_actor2, f"{{{NS}}}name", attrib={"lang": "de"})
    ha_a2_name.text = "Antikensammlung, Staatliche Museen zu Berlin"
    ha_a2_role = etree.SubElement(ha_actor2, f"{{{NS}}}roles", attrib={"lang": "de"})
    ha_a2_role.text = "Eigentümer / Verwahrer"
    
    # Conditions
    ha_cond = etree.SubElement(ha_wrap, f"{{{NS}}}conditions")
    ha_c_status = etree.SubElement(ha_cond, f"{{{NS}}}condition", attrib={"lang": "de"})
    ha_c_status.text = "Fragment erhalten (bestoßen, Kopf und rechte Hand beschädigt)"
    ha_c_date = etree.SubElement(ha_cond, f"{{{NS}}}conditionDate", attrib={"lang": "de"})
    ha_c_date.text = "2025-01-30"
    
    # Provenance
    ha_prov = etree.SubElement(ha_wrap, f"{{{NS}}}provenance", attrib={"lang": "de"})
    ha_prov.text = "Gefunden im Kerameikos, Athen (Griechenland). Erworben 1820 für die Antikensammlung Berlin. Provenienznachweis: https://doi.org/10.11588/diglit.69318#0219"
    
    # Characters
    ha_char = etree.SubElement(ha_wrap, f"{{{NS}}}characters")
    
    # heritageAssetType
    types = [
        ("Grabrelief", "HECTOR", "http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_9b922858"),
        ("tombstone", "AAT", "http://vocab.getty.edu/page/aat/300005923"),
        ("sculpture", "AAT", "http://vocab.getty.edu/page/aat/300184633"),
        ("pedestal", "AAT", "http://vocab.getty.edu/page/aat/300001744"),
        ("relief", "AAT", "http://vocab.getty.edu/page/aat/300053622")
    ]
    for t_val, ns_val, uid in types:
        hat = etree.SubElement(ha_char, f"{{{NS}}}heritageAssetType", attrib={"lang": "de", "namespace": ns_val, "term": t_val, "termUID": uid})
        hat.text = t_val
        
    # temporal
    ha_temp = etree.SubElement(ha_char, f"{{{NS}}}temporal")
    ha_ts = etree.SubElement(ha_temp, f"{{{NS}}}timeSpan")
    ha_start = etree.SubElement(ha_ts, f"{{{NS}}}startDate")
    ha_start.text = "-0330"
    ha_end = etree.SubElement(ha_ts, f"{{{NS}}}endDate")
    ha_end.text = "-0320"
    ha_pname = etree.SubElement(ha_temp, f"{{{NS}}}periodName", attrib={"lang": "de", "preferred": "true"})
    ha_pname.text = "Spätklassik (330 - 320 v. Chr.)"
    ha_dd = etree.SubElement(ha_temp, f"{{{NS}}}displayDate", attrib={"lang": "de", "preferred": "true"})
    ha_dd.text = "330 – 320 v. Chr."
    
    # materials
    mat_marm = etree.SubElement(ha_char, f"{{{NS}}}materials", attrib={"lang": "de"})
    mat_marm.text = "Pentelischer Marmor"
    mat_sand = etree.SubElement(ha_char, f"{{{NS}}}materials", attrib={"lang": "de"})
    mat_sand.text = "Sandstein"
        
    # dimensions
    dims = [
        ("base", "Height", "centimeters", "118"),
        ("base", "Length", "centimeters", "56"),
        ("base", "Weight", "kilograms", "256"),
        ("pedestal", "Height", "centimeters", "90"),
        ("pedestal", "Length", "centimeters", "59"),
        ("pedestal", "Width", "centimeters", "40")
    ]
    for ext, m_type, unit, val in dims:
        dim_el = etree.SubElement(ha_char, f"{{{NS}}}dimensions")
        ex = etree.SubElement(dim_el, f"{{{NS}}}extent", attrib={"lang": "en"})
        ex.text = ext
        mt = etree.SubElement(dim_el, f"{{{NS}}}measurementType", attrib={"lang": "en"})
        mt.text = m_type
        un = etree.SubElement(dim_el, f"{{{NS}}}units")
        un.text = unit
        vl = etree.SubElement(dim_el, f"{{{NS}}}value")
        vl.text = val
    
    # Spatial
    ha_spat = etree.SubElement(ha_wrap, f"{{{NS}}}spatial")
    ha_loc = etree.SubElement(ha_spat, f"{{{NS}}}locationSet")
    ha_nl = etree.SubElement(ha_loc, f"{{{NS}}}namedLocation", attrib={"lang": "de", "preferred": "true", "namespace": "Pleiades", "term": "Kerameikos", "termUID": "579986"})
    ha_nl.text = "Kerameikos, Athen, Attika"
    ha_gp = etree.SubElement(ha_loc, f"{{{NS}}}geopoliticalArea", attrib={"lang": "de"})
    ha_gp.text = "Griechenland"
    ha_hn = etree.SubElement(ha_loc, f"{{{NS}}}historicalName", attrib={"lang": "de", "preferred": "true"})
    ha_hn.text = "Kerameikos"
    
    # Repository Location
    ha_repo = etree.SubElement(ha_wrap, f"{{{NS}}}repositoryLocation", attrib={"lang": "de"})
    ha_repo.text = "Antikensammlung, Berlin. Staatliche Museen zu Berlin (ISIL: DE-MUS-814111, Inv.-Nr. SK 740)"
    
    # Rights
    ha_rights = etree.SubElement(ha_wrap, f"{{{NS}}}rights")
    ha_ccl = etree.SubElement(ha_rights, f"{{{NS}}}copyrightCreditLine", attrib={"lang": "de"})
    ha_ccl.text = "Antikensammlung, Staatliche Museen zu Berlin – Preußischer Kulturbesitz"
    ha_ar = etree.SubElement(ha_rights, f"{{{NS}}}accessRights", attrib={"lang": "en"})
    ha_ar.text = "Freely accessible"
    ha_lic = etree.SubElement(ha_rights, f"{{{NS}}}licence", attrib={"lang": "en"})
    ha_lic.text = "https://creativecommons.org/licenses/by-sa/4.0/"
    
    # References
    ha_ref1 = etree.SubElement(ha_wrap, f"{{{NS}}}references")
    ha_r1_app = etree.SubElement(ha_ref1, f"{{{NS}}}appellation")
    ha_r1_name = etree.SubElement(ha_r1_app, f"{{{NS}}}name", attrib={"lang": "de"})
    ha_r1_name.text = "Permalink SMB Objekt 699203"
    ha_r1_id = etree.SubElement(ha_r1_app, f"{{{NS}}}id")
    ha_r1_id.text = "https://id.smb.museum/object/699203"
    ha_r1_link = etree.SubElement(ha_ref1, f"{{{NS}}}link")
    ha_r1_link.text = "https://id.smb.museum/object/699203"
    
    ha_ref2 = etree.SubElement(ha_wrap, f"{{{NS}}}references")
    ha_r2_app = etree.SubElement(ha_ref2, f"{{{NS}}}appellation")
    ha_r2_name = etree.SubElement(ha_r2_app, f"{{{NS}}}name", attrib={"lang": "de"})
    ha_r2_name.text = "Diglit Provenienzbericht 1820"
    ha_r2_id = etree.SubElement(ha_r2_app, f"{{{NS}}}id")
    ha_r2_id.text = "https://doi.org/10.11588/diglit.69318#0219"
    ha_r2_link = etree.SubElement(ha_ref2, f"{{{NS}}}link")
    ha_r2_link.text = "https://doi.org/10.11588/diglit.69318#0219"
    
    # Linkages
    ha_hasRep1 = etree.SubElement(ha_wrap, f"{{{NS}}}hasRepresentation")
    ha_hasRep1.text = "DO_3816816_HP"
    ha_hasRep2 = etree.SubElement(ha_wrap, f"{{{NS}}}hasRepresentation")
    ha_hasRep2.text = "DO_3816816_LP"
    
    ha_digBy = etree.SubElement(ha_wrap, f"{{{NS}}}wasDigitizedBy")
    ha_digBy.text = "ACT_BCDH_2025_NIKARETE"
    
    # ----------------------------------------------------
    # 3. Digital Resource: High-Poly Master
    # ----------------------------------------------------
    dr1 = etree.SubElement(carare, f"{{{NS}}}digitalResource")
    dr1_rec = etree.SubElement(dr1, f"{{{NS}}}recordInformation")
    dr1_id = etree.SubElement(dr1_rec, f"{{{NS}}}id")
    dr1_id.text = "DO_3816816_HP"
    dr1_src = etree.SubElement(dr1_rec, f"{{{NS}}}source", attrib={"lang": "en"})
    dr1_src.text = "Bonn Center for Digital Humanities, Bonn University"
    dr1_country = etree.SubElement(dr1_rec, f"{{{NS}}}country", attrib={"lang": "de"})
    dr1_country.text = "DE"
    dr1_create = etree.SubElement(dr1_rec, f"{{{NS}}}creation")
    dr1_date = etree.SubElement(dr1_create, f"{{{NS}}}date")
    dr1_date.text = "2025-04-19"
    dr1_mr = etree.SubElement(dr1_rec, f"{{{NS}}}metadataRights", attrib={"lang": "en"})
    dr1_mr.text = "https://creativecommons.org/licenses/by-sa/4.0/"
    
    dr1_app = etree.SubElement(dr1, f"{{{NS}}}appellation")
    dr1_name = etree.SubElement(dr1_app, f"{{{NS}}}name", attrib={"lang": "en", "preferred": "true"})
    dr1_name.text = "SK 740 Nikarete High-Poly Master 3D-Mesh (Artec Leo / Nikon Z8)"
    dr1_appid = etree.SubElement(dr1_app, f"{{{NS}}}id")
    dr1_appid.text = "3816816_HP"
    
    dr1_desc = etree.SubElement(dr1, f"{{{NS}}}description", attrib={"lang": "en"})
    dr1_desc.text = "High-Poly 3D Master Mesh of SK 740 Nikarete. Generated from structured-light 3D scanning with Artec Leo (resolution: 0.1 mm) and high-resolution texture photogrammetry with Nikon Z8. Mesh metrics: 15.8 million faces, 7.9 million vertices."
    
    dr1_note1 = etree.SubElement(dr1, f"{{{NS}}}note", attrib={"lang": "en"})
    dr1_note1.text = "SK_740_Nikarete_HP.obj | SHA256: 1f6d9d3de5e9eb3db5ae0197d7518f484a02dd3ca9a525cb6f6dfcb6b0c3e04d | 06.03.2025 10:30:52"
    dr1_note2 = etree.SubElement(dr1, f"{{{NS}}}note", attrib={"lang": "en"})
    dr1_note2.text = "SK_740_Nikarete_HP.mtl | SHA256: 474852e87764e5c092abbb9ae222f0a0f1addea4b6d4ad1050a36ef5405fa711 | 19.04.2025 12:46:30"
    dr1_note3 = etree.SubElement(dr1, f"{{{NS}}}note", attrib={"lang": "en"})
    dr1_note3.text = "SK_740_Nikarete_HP.png | SHA256: d4cbe3b97c34bec8f58a9f083a24b6ab67636d0a5bd8edc72c80455cf859a3fe | 06.03.2025 10:30:52"
    
    dr1_type = etree.SubElement(dr1, f"{{{NS}}}type")
    dr1_type.text = "3D"
    
    dr1_fmt1 = etree.SubElement(dr1, f"{{{NS}}}format", attrib={"lang": "en"})
    dr1_fmt1.text = "model/obj"
    dr1_fmt2 = etree.SubElement(dr1, f"{{{NS}}}format", attrib={"lang": "en"})
    dr1_fmt2.text = "image/png"
    
    dr1_fmtd = etree.SubElement(dr1, f"{{{NS}}}formatDetails", attrib={"lang": "en"})
    dr1_fmtd.text = "High-Poly Wavefront OBJ + Material MTL + PNG 16k Texture"
    
    dr1_ext1 = etree.SubElement(dr1, f"{{{NS}}}extent", attrib={"lang": "en"})
    dr1_ext1.text = "15.8 million faces"
    dr1_ext2 = etree.SubElement(dr1, f"{{{NS}}}extent", attrib={"lang": "en"})
    dr1_ext2.text = "7.9 million vertices"
    dr1_ext3 = etree.SubElement(dr1, f"{{{NS}}}extent", attrib={"lang": "en"})
    dr1_ext3.text = "16384 x 16384 pixel texture"
    
    dr1_created = etree.SubElement(dr1, f"{{{NS}}}created")
    dr1_created.text = "2025-04-19"
    
    dr1_link = etree.SubElement(dr1, f"{{{NS}}}link")
    dr1_link.text = "https://id.smb.museum/object/699203/SK_740_Nikarete_HP.obj"
    
    dr1_obj = etree.SubElement(dr1, f"{{{NS}}}object")
    dr1_obj.text = "https://id.smb.museum/object/699203/SK_740_Nikarete_HP.png"
    
    dr1_shown = etree.SubElement(dr1, f"{{{NS}}}isShownAt")
    dr1_shown.text = "https://id.smb.museum/object/699203"
    
    dr1_rights = etree.SubElement(dr1, f"{{{NS}}}rights")
    dr1_ccl = etree.SubElement(dr1_rights, f"{{{NS}}}copyrightCreditLine", attrib={"lang": "de"})
    dr1_ccl.text = "Staatliche Museen zu Berlin, Stiftung Preußischer Kulturbesitz / BCDH Bonn University"
    dr1_acc = etree.SubElement(dr1_rights, f"{{{NS}}}accessRights", attrib={"lang": "en"})
    dr1_acc.text = "Open Access"
    dr1_rep = etree.SubElement(dr1_rights, f"{{{NS}}}reproductionRights", attrib={"lang": "en"})
    dr1_rep.text = "CC BY-SA 4.0"
    dr1_lic = etree.SubElement(dr1_rights, f"{{{NS}}}licence", attrib={"lang": "en"})
    dr1_lic.text = "https://creativecommons.org/licenses/by-sa/4.0/"
    
    dr1_repOf = etree.SubElement(dr1, f"{{{NS}}}isRepresentationOf")
    dr1_repOf.text = "SK 740"
    
    dr1_hasDer = etree.SubElement(dr1, f"{{{NS}}}hasDerivative")
    dr1_hasDer.text = "DO_3816816_LP"

    # ----------------------------------------------------
    # 4. Digital Resource: Low-Poly Real-Time Model (VR)
    # ----------------------------------------------------
    dr2 = etree.SubElement(carare, f"{{{NS}}}digitalResource")
    dr2_rec = etree.SubElement(dr2, f"{{{NS}}}recordInformation")
    dr2_id = etree.SubElement(dr2_rec, f"{{{NS}}}id")
    dr2_id.text = "DO_3816816_LP"
    dr2_src = etree.SubElement(dr2_rec, f"{{{NS}}}source", attrib={"lang": "en"})
    dr2_src.text = "Bonn Center for Digital Humanities, Bonn University"
    dr2_country = etree.SubElement(dr2_rec, f"{{{NS}}}country", attrib={"lang": "de"})
    dr2_country.text = "DE"
    dr2_create = etree.SubElement(dr2_rec, f"{{{NS}}}creation")
    dr2_date = etree.SubElement(dr2_create, f"{{{NS}}}date")
    dr2_date.text = "2025-03-06"
    dr2_mr = etree.SubElement(dr2_rec, f"{{{NS}}}metadataRights", attrib={"lang": "en"})
    dr2_mr.text = "https://creativecommons.org/licenses/by-sa/4.0/"
    
    dr2_app = etree.SubElement(dr2, f"{{{NS}}}appellation")
    dr2_name = etree.SubElement(dr2_app, f"{{{NS}}}name", attrib={"lang": "en", "preferred": "true"})
    dr2_name.text = "SK 740 Nikarete Low-Poly Real-Time Model (VR Derivative with PBR Maps)"
    dr2_appid = etree.SubElement(dr2_app, f"{{{NS}}}id")
    dr2_appid.text = "3816816_LP"
    
    dr2_desc = etree.SubElement(dr2, f"{{{NS}}}description", attrib={"lang": "en"})
    dr2_desc.text = "Decimated, real-time ready 3D mesh designed for WebXR and Virtual Reality (VR Kerameikos Learning Environment). Includes baked Normal Map, Ambient Occlusion Map, and transferred diffuse texture."
    
    dr2_note1 = etree.SubElement(dr2, f"{{{NS}}}note", attrib={"lang": "en"})
    dr2_note1.text = "SK_740_Nikarete_LP.obj | SHA256: f413506cdd1b9c11a935b8134bf9601bdf9368fe64556b1420bea816e8e841bf | 06.03.2025 11:09:50"
    dr2_note2 = etree.SubElement(dr2, f"{{{NS}}}note", attrib={"lang": "en"})
    dr2_note2.text = "sk_740_nikarete_lp_uv_Ambient Occlusion Map from Mesh.jpg | SHA256: 1c9070d58ae52243ca4b42e694055a96d52eae91fc839d45aedc14c0d346c380"
    dr2_note3 = etree.SubElement(dr2, f"{{{NS}}}note", attrib={"lang": "en"})
    dr2_note3.text = "sk_740_nikarete_lp_uv_Normal Map from Mesh.jpg | SHA256: b31f5835a3b7a19bc8b69a3fe3056d5134b35f0a4c68ec370370d2f4d01c6642"
    dr2_note4 = etree.SubElement(dr2, f"{{{NS}}}note", attrib={"lang": "en"})
    dr2_note4.text = "sk_740_nikarete_lp_uv_Transferred Texture from Mesh.jpg | SHA256: 690d2cc6641777c2feb5e197a5fba351305caa68c68bcc909506cd6652fd0698"
    
    dr2_type = etree.SubElement(dr2, f"{{{NS}}}type")
    dr2_type.text = "3D"
    
    dr2_fmt1 = etree.SubElement(dr2, f"{{{NS}}}format", attrib={"lang": "en"})
    dr2_fmt1.text = "model/obj"
    dr2_fmt2 = etree.SubElement(dr2, f"{{{NS}}}format", attrib={"lang": "en"})
    dr2_fmt2.text = "image/jpeg"
    
    dr2_fmtd = etree.SubElement(dr2, f"{{{NS}}}formatDetails", attrib={"lang": "en"})
    dr2_fmtd.text = "Low-Poly OBJ + PBR Maps (Normal, AO, Transferred Diffuse)"
    
    dr2_created = etree.SubElement(dr2, f"{{{NS}}}created")
    dr2_created.text = "2025-03-06"
    
    dr2_link = etree.SubElement(dr2, f"{{{NS}}}link")
    dr2_link.text = "https://id.smb.museum/object/699203/SK_740_Nikarete_LP.obj"
    
    dr2_obj = etree.SubElement(dr2, f"{{{NS}}}object")
    dr2_obj.text = "https://id.smb.museum/object/699203/sk_740_nikarete_lp_uv_Transferred Texture from Mesh.jpg"
    
    dr2_shown = etree.SubElement(dr2, f"{{{NS}}}isShownAt")
    dr2_shown.text = "https://id.smb.museum/object/699203"
    
    dr2_rights = etree.SubElement(dr2, f"{{{NS}}}rights")
    dr2_ccl = etree.SubElement(dr2_rights, f"{{{NS}}}copyrightCreditLine", attrib={"lang": "de"})
    dr2_ccl.text = "Staatliche Museen zu Berlin, Stiftung Preußischer Kulturbesitz / BCDH Bonn University"
    dr2_acc = etree.SubElement(dr2_rights, f"{{{NS}}}accessRights", attrib={"lang": "en"})
    dr2_acc.text = "Open Access"
    dr2_rep = etree.SubElement(dr2_rights, f"{{{NS}}}reproductionRights", attrib={"lang": "en"})
    dr2_rep.text = "CC BY-SA 4.0"
    dr2_lic = etree.SubElement(dr2_rights, f"{{{NS}}}licence", attrib={"lang": "en"})
    dr2_lic.text = "https://creativecommons.org/licenses/by-sa/4.0/"
    
    dr2_repOf = etree.SubElement(dr2, f"{{{NS}}}isRepresentationOf")
    dr2_repOf.text = "SK 740"
    
    dr2_isDerOf = etree.SubElement(dr2, f"{{{NS}}}isDerivativeOf")
    dr2_isDerOf.text = "DO_3816816_HP"

    # ----------------------------------------------------
    # 5. Activity: Digitization and Modeling
    # ----------------------------------------------------
    act = etree.SubElement(carare, f"{{{NS}}}activity")
    act_rec = etree.SubElement(act, f"{{{NS}}}recordInformation")
    act_id = etree.SubElement(act_rec, f"{{{NS}}}id")
    act_id.text = "ACT_BCDH_2025_NIKARETE"
    act_src = etree.SubElement(act_rec, f"{{{NS}}}source", attrib={"lang": "en"})
    act_src.text = "Bonn Center for Digital Humanities, Bonn University"
    act_country = etree.SubElement(act_rec, f"{{{NS}}}country", attrib={"lang": "de"})
    act_country.text = "DE"
    act_create = etree.SubElement(act_rec, f"{{{NS}}}creation")
    act_date = etree.SubElement(act_create, f"{{{NS}}}date")
    act_date.text = "2025-01-30"
    act_mr = etree.SubElement(act_rec, f"{{{NS}}}metadataRights", attrib={"lang": "en"})
    act_mr.text = "https://creativecommons.org/licenses/by-sa/4.0/"
    
    act_app = etree.SubElement(act, f"{{{NS}}}appellation")
    act_name = etree.SubElement(act_app, f"{{{NS}}}name", attrib={"lang": "de", "preferred": "true"})
    act_name.text = "3D-Digitalisierung und Texturierung des Grabmals der Nikarete (SK 740)"
    act_appid = etree.SubElement(act_app, f"{{{NS}}}id")
    act_appid.text = "ACT_NIKARETE_3D_2025"
    
    act_desc = etree.SubElement(act, f"{{{NS}}}description", attrib={"lang": "de"})
    act_desc.text = "Streifenlicht-Scanning (Artec Leo, 0,1 mm) und Makro-Photogrammetrie (Nikon Z8, Textur 16384x16384 px) des Grabmals der Nikarete (SK 740). Datenverarbeitung in Artec Studio 19, Blender 4.2, Substance Designer 14 und Lightroom 14.1. Erstellung von Master High-Poly und VR Low-Poly Derivaten."
    
    act_gp = etree.SubElement(act, f"{{{NS}}}hasGeneralPurpose", attrib={"lang": "en"})
    act_gp.text = "Capture & Representation (3D Documentation and Interactive Virtual Reality Environment)"
    
    act_et = etree.SubElement(act, f"{{{NS}}}eventType", attrib={"lang": "en", "namespace": "AAT", "term": "3D digitisation", "termUID": "http://vocab.getty.edu/page/aat/300266025"})
    act_et.text = "3D digitisation"
    
    # Actors
    act_a1 = etree.SubElement(act, f"{{{NS}}}actors")
    act_a1_id = etree.SubElement(act_a1, f"{{{NS}}}id")
    act_a1_id.text = "https://d-nb.info/gnd/36150-1"
    act_a1_name = etree.SubElement(act_a1, f"{{{NS}}}name", attrib={"lang": "de"})
    act_a1_name.text = "Bonn Center for Digital Humanities, Bonn University"
    act_a1_role = etree.SubElement(act_a1, f"{{{NS}}}roles", attrib={"lang": "en"})
    act_a1_role.text = "digitizer"
    
    act_a2 = etree.SubElement(act, f"{{{NS}}}actors")
    act_a2_id = etree.SubElement(act_a2, f"{{{NS}}}id")
    act_a2_id.text = "https://lobid.org/organisations/DE-MUS-710014"
    act_a2_name = etree.SubElement(act_a2, f"{{{NS}}}name", attrib={"lang": "de"})
    act_a2_name.text = "Staatliche Museen zu Berlin, Stiftung Preußischer Kulturbesitz"
    act_a2_role = etree.SubElement(act_a2, f"{{{NS}}}roles", attrib={"lang": "en"})
    act_a2_role.text = "documented_by"
    
    # Temporal
    act_temp = etree.SubElement(act, f"{{{NS}}}temporal")
    act_ts = etree.SubElement(act_temp, f"{{{NS}}}timeSpan")
    act_s = etree.SubElement(act_ts, f"{{{NS}}}startDate")
    act_s.text = "2025-01-30"
    act_e = etree.SubElement(act_ts, f"{{{NS}}}endDate")
    act_e.text = "2025-04-19"
    act_dd = etree.SubElement(act_temp, f"{{{NS}}}displayDate", attrib={"lang": "de", "preferred": "true"})
    act_dd.text = "30.01.2025 – 19.04.2025"
    
    # Spatial
    act_spat = etree.SubElement(act, f"{{{NS}}}spatial")
    act_loc = etree.SubElement(act_spat, f"{{{NS}}}locationSet")
    act_nl = etree.SubElement(act_loc, f"{{{NS}}}namedLocation", attrib={"lang": "de", "preferred": "true"})
    act_nl.text = "Antikensammlung, Berlin. Staatliche Museen zu Berlin"
    
    # ConsistsOf: Pillar 2 (Capture) & Pillar 3 (Representation) according to Digital Authenticity Profile
    # Sub-Activity 1: Datenerfassung (Capture)
    act_c1 = etree.SubElement(act, f"{{{NS}}}consistsOf")
    act_c1_purp = etree.SubElement(act_c1, f"{{{NS}}}hadSpecificPurpose", attrib={"lang": "de"})
    act_c1_purp.text = "Datenerfassung (Capture) – Streifenlicht-Scanning & Makro-Photogrammetrie"
    act_c1_start = etree.SubElement(act_c1, f"{{{NS}}}startDate")
    act_c1_start.text = "2025-01-30"
    act_c1_end = etree.SubElement(act_c1, f"{{{NS}}}endDate")
    act_c1_end.text = "2025-01-30"
    
    act_c1_m1 = etree.SubElement(act_c1, f"{{{NS}}}methods", attrib={"lang": "en"})
    act_c1_m1.text = "Structured-light 3D scanning"
    act_c1_m2 = etree.SubElement(act_c1, f"{{{NS}}}methods", attrib={"lang": "en"})
    act_c1_m2.text = "Close-range photogrammetry"
    
    act_c1_t1 = etree.SubElement(act_c1, f"{{{NS}}}techniques", attrib={"lang": "de"})
    act_c1_t1.text = "Freihand-Erfassung im Ausstellungsraum (keine Stative/Kabel erlaubt). Grenzen: Rückseite wandseitig und Unterseite aus konservatorischen Gründen nicht erfasst (Limit)."
    
    act_c1_mat1 = etree.SubElement(act_c1, f"{{{NS}}}materials", attrib={"lang": "de"})
    act_c1_mat1.text = "Pentelischer Marmor"
    act_c1_mat2 = etree.SubElement(act_c1, f"{{{NS}}}materials", attrib={"lang": "de"})
    act_c1_mat2.text = "Sandstein"
    
    act_c1_eq1 = etree.SubElement(act_c1, f"{{{NS}}}equipment", attrib={"lang": "en"})
    act_c1_eq1.text = "Artec Leo (structured-light 3D scanner, 0.1 mm resolution)"
    act_c1_eq2 = etree.SubElement(act_c1, f"{{{NS}}}equipment", attrib={"lang": "en"})
    act_c1_eq2.text = "Nikon Z8 (digital camera, 16k textures)"
    
    # Sub-Activity 2: Modellierung (Representation)
    act_c2 = etree.SubElement(act, f"{{{NS}}}consistsOf")
    act_c2_purp = etree.SubElement(act_c2, f"{{{NS}}}hadSpecificPurpose", attrib={"lang": "de"})
    act_c2_purp.text = "Modellierung (Representation) – Master-Mesh & VR-Echtzeitderivat"
    act_c2_start = etree.SubElement(act_c2, f"{{{NS}}}startDate")
    act_c2_start.text = "2025-02-01"
    act_c2_end = etree.SubElement(act_c2, f"{{{NS}}}endDate")
    act_c2_end.text = "2025-04-19"
    
    act_c2_m1 = etree.SubElement(act_c2, f"{{{NS}}}methods", attrib={"lang": "en"})
    act_c2_m1.text = "High-poly scan fusion, Mesh decimation, PBR texture baking"
    
    act_c2_t1 = etree.SubElement(act_c2, f"{{{NS}}}techniques", attrib={"lang": "de"})
    act_c2_t1.text = "Sandsteinsockel für didaktische VR-Nutzung entfernt (Entscheidung). Marmor-Transluzenz mittels Subsurface Scattering simuliert (Simulation). Normal- und AO-Maps aus High-Poly-Master gebacken. Mesh-Fusion und Oberflächenschließung via Artec Studio 19 (deklarierte Blackbox)."
    
    act_c2_mat = etree.SubElement(act_c2, f"{{{NS}}}materials", attrib={"lang": "de"})
    act_c2_mat.text = "Pentelischer Marmor"
    
    rep_eq_list = [
        "Artec Studio 19",
        "Blender 4.2",
        "Substance Designer 14",
        "Adobe Photoshop Lightroom 14.1"
    ]
    for eq in rep_eq_list:
        act_c2_eq = etree.SubElement(act_c2, f"{{{NS}}}equipment", attrib={"lang": "en"})
        act_c2_eq.text = eq
    
    # Created
    act_hc1 = etree.SubElement(act, f"{{{NS}}}hasCreated")
    act_hc1.text = "DO_3816816_HP"
    act_hc2 = etree.SubElement(act, f"{{{NS}}}hasCreated")
    act_hc2.text = "DO_3816816_LP"
    
    return root

root = build_nikarete_xml()
xml_bytes = etree.tostring(root, pretty_print=True, xml_declaration=True, encoding="utf-8")

# Validate
with open('CARARE/carare-v2.0.6.xsd', 'rb') as f:
    schema_doc = etree.XML(f.read())
schema = etree.XMLSchema(schema_doc)

doc = etree.XML(xml_bytes)
is_valid = schema.validate(doc)
print(f"Validation result: {is_valid}")
if not is_valid:
    for err in schema.error_log:
        print(f"Line {err.line}: {err.message}")
else:
    with open('CARARE/CARARE_Nikarete_SK740.xml', 'wb') as f:
        f.write(xml_bytes)
    print("Saved to CARARE/CARARE_Nikarete_SK740.xml successfully!")

    # Now create BagIt ZIP
    zip_path = 'CARARE/CARARE_Nikarete_SK740_bagit.zip'
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        zf.writestr('bagit.txt', 'BagIt-Version: 0.97\nTag-File-Character-Encoding: UTF-8\n')
        
        # bag-info.txt with HERMES key conventions
        bag_info_lines = [
            "Source-Organization: Staatliche Museen zu Berlin / Bonn Center for Digital Humanities",
            "Organization-Address: Bodestraße 1-3, 10178 Berlin / Am Hof 1, 53113 Bonn",
            "Contact-Name: Valentina Salcedo Paparoni, Matthias Lang",
            "Contact-Email: v.salcedo@smb.spk-berlin.de, mlang@uni-bonn.de",
            "External-Description: CARARE 2.0.6 BagIt Package for Grabnaiskos der Nikarete (SK 740)",
            "Bagging-Date: 2025-04-19",
            "Payload-Oxum: 0.64",
            "",
            "# HERMES metadata bindings",
            "Collection.id: DE-MUS-814111_Nikarete_Collection",
            "Collection.title: Grabnaiskos der Nikarete: Weibliches Fragment vom Grabmal der Nikarete",
            "Collection.title_en: Female fragment of the tomb of Nikarete",
            "Collection.source: Antikensammlung, Berlin. Staatliche Museen zu Berlin",
            "Collection.rights: CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)",
            "Collection.keywords: Grabrelief, Grabmonument, Pentelischer Marmor, Kerameikos, Spätklassik, 3D-Digitalisierung",
            "",
            "HeritageAsset.id: SK 740",
            "HeritageAsset.title: Grabnaiskos der Nikarete: Weibliches Fragment vom Grabmal der Nikarete",
            "HeritageAsset.title_en: Female fragment of the tomb of Nikarete",
            "HeritageAsset.description: Weibliches Fragment vom Grabmal der Nikarete. Attischer Grabnaiskos aus pentelischem Marmor auf Sandsteinsockel. Datierung: Spätklassik, ca. 330–320 v. Chr. Inventarnummer SK 740 der Antikensammlung Berlin.",
            "HeritageAsset.heritageAssetType: Grabrelief, tombstone, sculpture, pedestal, relief",
            "HeritageAsset.materials: Pentelischer Marmor, Sandstein",
            "HeritageAsset.provenance: Gefunden im Kerameikos, Athen (Griechenland). Erworben 1820 für die Antikensammlung Berlin. https://doi.org/10.11588/diglit.69318#0219",
            "HeritageAsset.periodName: Spätklassik (330 - 320 v. Chr.)",
            "HeritageAsset.startDate: -0330",
            "HeritageAsset.endDate: -0320",
            "HeritageAsset.location: Kerameikos, Athen, Attika (Griechenland)",
            "HeritageAsset.dimensions_height: 118",
            "HeritageAsset.dimensions_length: 56",
            "HeritageAsset.dimensions_weight: 256",
            "HeritageAsset.dimensions_pedestal: 90 x 59 x 40 cm",
            "HeritageAsset.permalink: https://id.smb.museum/object/699203",
            "",
            "DigitalResource.id: DO_3816816_HP",
            "DigitalResource.title: SK 740 Nikarete High-Poly Master 3D-Mesh (Artec Leo / Nikon Z8)",
            "DigitalResource.type: 3D",
            "DigitalResource.format: model/obj, image/png",
            "DigitalResource.formatDetails: High-Poly Wavefront OBJ + Material MTL + PNG 16k Texture",
            "DigitalResource.rights: CC BY-SA 4.0",
            "DigitalResource.extent: 15.8M faces, 7.9M vertices, 16k texture",
            "",
            "Activity.id: ACT_BCDH_2025_NIKARETE",
            "Activity.title: 3D-Digitalisierung und Texturierung des Grabmals der Nikarete (SK 740)",
            "Activity.eventType: 3D digitisation",
            "Activity.actors: Bonn Center for Digital Humanities, Staatliche Museen zu Berlin",
            "Activity.timeSpan: 2025-01-30 to 2025-04-19",
            "Activity.methods: Structured-light 3D scanning, Close-range photogrammetry",
            "Activity.equipment: Artec Leo, Nikon Z8, Artec Studio 19, Blender 4.2, Substance Designer 14, Adobe Photoshop Lightroom 14.1"
        ]
        zf.writestr('bag-info.txt', '\n'.join(bag_info_lines))
        zf.writestr('data/carare.xml', xml_bytes)
        
        # Manifest
        xml_sha256 = hashlib.sha256(xml_bytes).hexdigest()
        zf.writestr('manifest-sha256.txt', f"{xml_sha256}  data/carare.xml\n")
        
        tag_manifest_lines = []
        for name in ['bagit.txt', 'bag-info.txt', 'manifest-sha256.txt']:
            data = zf.read(name)
            h = hashlib.sha256(data).hexdigest()
            tag_manifest_lines.append(f"{h}  {name}\n")
        zf.writestr('tagmanifest-sha256.txt', ''.join(tag_manifest_lines))
    print(f"Created BagIt archive at {zip_path}")
