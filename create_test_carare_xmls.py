import json
from lxml import etree

NS = "http://www.carare.eu/carareSchema"

def generate_tairkap_xml():
    root = etree.Element(f"{{{NS}}}carareWrap", nsmap={None: NS})
    carare = etree.SubElement(root, f"{{{NS}}}carare", attrib={"id": "SPK-SMB-AEMP_AM3_01"})
    
    # 1. Collection
    col = etree.SubElement(carare, f"{{{NS}}}collectionInformation")
    c_id = etree.SubElement(col, f"{{{NS}}}id")
    c_id.text = "DE-MUS-015418_Tairkap_Ensemble"
    
    c_title = etree.SubElement(col, f"{{{NS}}}title", attrib={"lang": "en", "preferred": "true"})
    c_title.text = "Funerary ensemble of the Lady Tairkap"
    c_title_de = etree.SubElement(col, f"{{{NS}}}title", attrib={"lang": "de", "preferred": "false"})
    c_title_de.text = "Grabensemble der Dame Tairkap"
    
    c_src = etree.SubElement(col, f"{{{NS}}}source", attrib={"lang": "de"})
    c_src.text = "Staatliche Museen zu Berlin, Stiftung Preußischer Kulturbesitz"
    
    c_rights = etree.SubElement(col, f"{{{NS}}}rights")
    cr_ccl = etree.SubElement(c_rights, f"{{{NS}}}copyrightCreditLine", attrib={"lang": "de"})
    cr_ccl.text = "Staatliche Museen zu Berlin / BCDH Bonn University"
    cr_acc = etree.SubElement(c_rights, f"{{{NS}}}accessRights", attrib={"lang": "en"})
    cr_acc.text = "Open Access"
    cr_lic = etree.SubElement(c_rights, f"{{{NS}}}licence", attrib={"lang": "en"})
    cr_lic.text = "https://creativecommons.org/licenses/by-sa/4.0/"
    
    c_stmt = etree.SubElement(col, f"{{{NS}}}statement", attrib={"lang": "en", "preferred": "true"})
    c_stmt.text = "Central components of the burial of the Lady Tairkap (ÄM 3 - ÄM 6), 7th century BCE, Thebes."
    
    # 2. Heritage Asset
    ha = etree.SubElement(carare, f"{{{NS}}}heritageAssetIdentification")
    ha_rec = etree.SubElement(ha, f"{{{NS}}}recordInformation")
    ha_id = etree.SubElement(ha_rec, f"{{{NS}}}id")
    ha_id.text = "DE-MUS-015418_ÄM_3_01"
    ha_src = etree.SubElement(ha_rec, f"{{{NS}}}source", attrib={"lang": "de"})
    ha_src.text = "Ägyptisches Museum und Papyrussammlung, Berlin"
    ha_country = etree.SubElement(ha_rec, f"{{{NS}}}country", attrib={"lang": "de"})
    ha_country.text = "DE"
    
    ha_app = etree.SubElement(ha, f"{{{NS}}}appellation")
    ha_name = etree.SubElement(ha_app, f"{{{NS}}}name", attrib={"lang": "de", "preferred": "true"})
    ha_name.text = "Äußerer, anthropomorpher Sarg der Tairkap (Deckel)"
    ha_name_en = etree.SubElement(ha_app, f"{{{NS}}}name", attrib={"lang": "en", "preferred": "false"})
    ha_name_en.text = "Anthropoid Outer Coffin of a Woman Named Ta-ir-kap (Lid)"
    ha_appid = etree.SubElement(ha_app, f"{{{NS}}}id")
    ha_appid.text = "ÄM 3/01"
    
    ha_desc = etree.SubElement(ha, f"{{{NS}}}description", attrib={"lang": "de"})
    ha_desc.text = "Sargdeckel aus Holz der Spätzeit (25./26. Dynastie) aus Theben (Ägypten). Bemaltes Holz mit Inschriften."
    
    ha_char = etree.SubElement(ha, f"{{{NS}}}characters")
    hat = etree.SubElement(ha_char, f"{{{NS}}}heritageAssetType", attrib={"lang": "en", "namespace": "AAT", "term": "coffins", "termUID": "http://vocab.getty.edu/page/aat/300197585"})
    hat.text = "coffins"
    
    ha_temp = etree.SubElement(ha_char, f"{{{NS}}}temporal")
    ha_ts = etree.SubElement(ha_temp, f"{{{NS}}}timeSpan")
    ha_s = etree.SubElement(ha_ts, f"{{{NS}}}startDate")
    ha_s.text = "-0746"
    ha_e = etree.SubElement(ha_ts, f"{{{NS}}}endDate")
    ha_e.text = "-0525"
    ha_pn = etree.SubElement(ha_temp, f"{{{NS}}}periodName", attrib={"lang": "en", "preferred": "true"})
    ha_pn.text = "Late Period (746 - 525 B.C.)"
    
    ha_mat = etree.SubElement(ha_char, f"{{{NS}}}materials", attrib={"lang": "en"})
    ha_mat.text = "wood"
    
    ha_dim = etree.SubElement(ha_char, f"{{{NS}}}dimensions")
    ha_d_mt = etree.SubElement(ha_dim, f"{{{NS}}}measurementType", attrib={"lang": "en"})
    ha_d_mt.text = "Height"
    ha_d_un = etree.SubElement(ha_dim, f"{{{NS}}}units")
    ha_d_un.text = "centimeters"
    ha_d_val = etree.SubElement(ha_dim, f"{{{NS}}}value")
    ha_d_val.text = "54"
    
    ha_spat = etree.SubElement(ha, f"{{{NS}}}spatial")
    ha_loc = etree.SubElement(ha_spat, f"{{{NS}}}locationSet")
    ha_nl = etree.SubElement(ha_loc, f"{{{NS}}}namedLocation", attrib={"lang": "en", "preferred": "true", "namespace": "TGN", "term": "Thebes", "termUID": "7001297"})
    ha_nl.text = "Thebes, Egypt"
    ha_gp = etree.SubElement(ha_loc, f"{{{NS}}}geopoliticalArea", attrib={"lang": "en"})
    ha_gp.text = "Egypt"
    
    # 3. Digital Resource
    dr = etree.SubElement(carare, f"{{{NS}}}digitalResource")
    dr_rec = etree.SubElement(dr, f"{{{NS}}}recordInformation")
    dr_id = etree.SubElement(dr_rec, f"{{{NS}}}id")
    dr_id.text = "SMB-SPK_DO_AM_3_01"
    
    dr_app = etree.SubElement(dr, f"{{{NS}}}appellation")
    dr_name = etree.SubElement(dr_app, f"{{{NS}}}name", attrib={"lang": "en", "preferred": "true"})
    dr_name.text = "Tairkap Outer Coffin Lid 3D-Mesh"
    dr_appid = etree.SubElement(dr_app, f"{{{NS}}}id")
    dr_appid.text = "DO_AM_3_01"
    
    dr_type = etree.SubElement(dr, f"{{{NS}}}type")
    dr_type.text = "3D"
    
    dr_fmt = etree.SubElement(dr, f"{{{NS}}}format", attrib={"lang": "en"})
    dr_fmt.text = "model/obj"
    
    dr_link = etree.SubElement(dr, f"{{{NS}}}link")
    dr_link.text = "https://id.smb.museum/object/12345/tairkap.obj"
    
    dr_obj = etree.SubElement(dr, f"{{{NS}}}object")
    dr_obj.text = "https://id.smb.museum/object/12345/tairkap_thumb.jpg"
    
    # 4. Activity
    act = etree.SubElement(carare, f"{{{NS}}}activity")
    act_rec = etree.SubElement(act, f"{{{NS}}}recordInformation")
    act_id = etree.SubElement(act_rec, f"{{{NS}}}id")
    act_id.text = "ACT_BCDH_2021_TAIRKAP"
    
    act_app = etree.SubElement(act, f"{{{NS}}}appellation")
    act_name = etree.SubElement(act_app, f"{{{NS}}}name", attrib={"lang": "en", "preferred": "true"})
    act_name.text = "3D Digitization of the Tairkap Funerary Ensemble"
    act_appid = etree.SubElement(act_app, f"{{{NS}}}id")
    act_appid.text = "ACT_TAIRKAP_3D_2021"
    
    act_et = etree.SubElement(act, f"{{{NS}}}eventType", attrib={"lang": "en", "namespace": "AAT", "term": "photogrammetry", "termUID": "http://vocab.getty.edu/page/aat/300053580"})
    act_et.text = "photogrammetry"
    
    xml_bytes = etree.tostring(root, pretty_print=True, xml_declaration=True, encoding="utf-8")
    
    # Validate against schema
    with open('CARARE/carare-v2.0.6.xsd', 'rb') as f:
        schema_doc = etree.XML(f.read())
    schema = etree.XMLSchema(schema_doc)
    doc = etree.XML(xml_bytes)
    assert schema.validate(doc), "Schema validation failed!"
    
    with open('CARARE/CARARE_Tairkap_AM3_01.xml', 'wb') as f:
        f.write(xml_bytes)
    print("Created CARARE/CARARE_Tairkap_AM3_01.xml and successfully validated against XSD!")

if __name__ == '__main__':
    generate_tairkap_xml()
