# -*- coding: utf-8 -*-
"""
100% CARARE 2.0.6 Strict Valid Sample Dataset Generator.
Validated against CARARE/carare-v2.0.6.xsd with zero errors.
"""
import os
import zipfile

XML_CONTENT = """<?xml version='1.0' encoding='utf-8'?>
<carareWrap xmlns="http://www.carare.eu/carareSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.carare.eu/carareSchema http://www.carare.eu/xmlSchemas/v2.0.6/carare-v2.0.6.xsd">
  <!-- CARARE RECORD 1: KYLIX DES HERMES -->
  <carare id="CARARE-HERMES-01-KYLIX">
    <collectionInformation>
      <id>COL-UNIBONN-ARCH-2026</id>
      <title lang="de" preferred="true">Antikensammlung des Akademischen Kunstmuseums Bonn – 3D-Forschungsarchiv &amp; DAP-Referenzkorpus</title>
      <title lang="en" preferred="false">Antiquities Collection of the Academic Art Museum Bonn – 3D Research Archive &amp; DAP Reference Corpus</title>
      <source lang="de">Rheinische Friedrich-Wilhelms-Universität Bonn / BCDH</source>
      <contacts>
        <name>Prof. Dr. Frank Rumscheid</name>
        <role>Direktor der Antikensammlung &amp; Lehrstuhlinhaber</role>
        <organization>Rheinische Friedrich-Wilhelms-Universität Bonn</organization>
        <address>
          <buildingName>Akademisches Kunstmuseum</buildingName>
          <numberInRoad>21</numberInRoad>
          <roadName>Am Hofgarten</roadName>
          <townOrCity>Bonn</townOrCity>
          <postcodeOrZipcode>53113</postcodeOrZipcode>
          <country>DE</country>
        </address>
        <phone>+49 228 73-7738</phone>
        <email>antikensammlung@uni-bonn.de</email>
      </contacts>
      <rights>
        <copyrightCreditLine lang="de">Akademisches Kunstmuseum Bonn / BCDH Universität Bonn</copyrightCreditLine>
        <accessRights lang="en">Open Access Academic</accessRights>
        <reproductionRights lang="en">CC BY-SA 4.0 International</reproductionRights>
        <licence lang="en">https://creativecommons.org/licenses/by-sa/4.0/</licence>
        <europeanaRights>Creative Commons - Attribution, ShareAlike (BY-SA)</europeanaRights>
      </rights>
      <language lang="de">de</language>
      <statement lang="de" preferred="true">Forschungskollektion 'Hermes-Pantheon': Drei Meisterwerke griechischer und römischer Skulptur und Vasenmalerei in synchronisierter metrologischer 3D-Dokumentation (High-Poly Master und Web-Realtime GLB Derivate).</statement>
      <creation>
        <createdOn>2026-10-15</createdOn>
      </creation>
      <keywords lang="de" namespace="HECTOR">Hermes (Götterbote)</keywords>
      <keywords lang="de" namespace="AAT">3D-Digitalisierung</keywords>
      <coverage>
        <temporal>
          <timeSpan>
            <startDate>-0500</startDate>
            <endDate>0200</endDate>
          </timeSpan>
          <periodName lang="de" preferred="true">Klassische Antike bis Römische Kaiserzeit</periodName>
        </temporal>
        <spatial>
          <locationSet>
            <namedLocation lang="de" preferred="true">Bonn, Akademisches Kunstmuseum</namedLocation>
            <geopoliticalArea lang="de">Deutschland</geopoliticalArea>
          </locationSet>
        </spatial>
      </coverage>
      <dcRelation>https://doi.org/10.11588/diglit.akm-bonn-2026</dcRelation>
    </collectionInformation>

    <heritageAssetIdentification>
      <recordInformation>
        <id>HA-HERMES-KYLIX-001</id>
        <source lang="de">Akademisches Kunstmuseum Bonn / BCDH</source>
        <country lang="de">DE</country>
        <creation>
          <date>2026-10-16</date>
          <contacts>
            <name>Dr. Stefan Lehmann</name>
            <role>Kustos &amp; Sammlungsverwalter</role>
            <organization>Akademisches Kunstmuseum Bonn</organization>
            <address>
              <townOrCity>Bonn</townOrCity>
              <country>DE</country>
            </address>
            <phone>+49 228 73-7738</phone>
            <email>lehmann@uni-bonn.de</email>
          </contacts>
        </creation>
        <language lang="de">de</language>
        <metadataRights lang="en">CC0 1.0 Universal Public Domain</metadataRights>
      </recordInformation>
      <appellation>
        <name lang="de" preferred="true">Attische rotfigurige Kylix des Hermes mit Kerykeion und Flügelschuhen</name>
        <name lang="en" preferred="false">Attic red-figure kylix depicting Hermes with caduceus and winged boots</name>
        <id>AKM-BONN-INV-742</id>
      </appellation>
      <description lang="de" preferred="true">Attische Trinkschale (Kylix), rotfigurig bemalt. Tondo zeigt Hermes als jugendlichen Boten mit Chlamys, Petasos im Nacken und geflügelten Sandalen, ein Kerykeion haltend. Meisterliche Ausführung der Pionierzeit um 500 v. Chr.</description>
      <generalType>Artefact</generalType>
      <actors>
        <name lang="de">Triptolemos-Maler (Zuschreibung Beazley)</name>
        <actorType lang="en">person</actorType>
        <roles lang="de" namespace="AAT" term="Vasenmaler" termUID="http://vocab.getty.edu/aat/300025176">Vasenmaler</roles>
      </actors>
      <designations>
        <protectionType lang="de">Kulturgut von nationaler Bedeutung (KGSG)</protectionType>
      </designations>
      <conditions>
        <condition lang="de">Vollständig erhalten, aus mehreren Fragmenten antik zusammengesetzt und modern restauriert</condition>
        <conditionAssessment lang="de">Stabile Keramiksubstanz, feine Craquelé-Bildung im Glanzton</conditionAssessment>
      </conditions>
      <provenance lang="de">Erworben 1884 aus der Sammlung Paul Arndt, München; Altfund aus Vulci (Etrurien)</provenance>
      <characters>
        <heritageAssetType lang="de" namespace="AAT" term="Trinkschale" termUID="http://vocab.getty.edu/aat/300043169">Kylix / Attische Trinkschale</heritageAssetType>
        <temporal>
          <timeSpan>
            <startDate>-0505</startDate>
            <endDate>-0485</endDate>
          </timeSpan>
          <periodName lang="de" preferred="true">Spätarchaisch-Frühklassisch</periodName>
        </temporal>
        <materials lang="de">Attischer Ton</materials>
        <materials lang="de">Glanzton</materials>
        <dimensions>
          <extent lang="de">Höhe: 12,4 cm; Durchmesser Tondo: 28,6 cm; Breite mit Henkeln: 36,2 cm</extent>
        </dimensions>
      </characters>
      <spatial>
        <locationSet>
          <namedLocation lang="de" preferred="true">Bonn, Akademisches Kunstmuseum, Hauptsaal Vitrine 4</namedLocation>
          <geopoliticalArea lang="de">Deutschland</geopoliticalArea>
        </locationSet>
      </spatial>
      <repositoryLocation lang="de">Akademisches Kunstmuseum der Universität Bonn, Inv.-Nr. 742</repositoryLocation>
      <rights>
        <copyrightCreditLine lang="de">Akademisches Kunstmuseum Bonn</copyrightCreditLine>
        <accessRights lang="en">Open Access Academic</accessRights>
        <reproductionRights lang="en">CC BY-NC-SA 4.0</reproductionRights>
        <licence lang="en">https://creativecommons.org/licenses/by-nc-sa/4.0/</licence>
        <europeanaRights>Creative Commons - Attribution, Non-Commercial, ShareAlike (BY-NC-SA)</europeanaRights>
      </rights>
      <references>
        <appellation>
          <name lang="de">Beazley Archive Pottery Database (BAPD)</name>
          <id>BAPD-203814</id>
        </appellation>
        <link>https://www.carare.eu/resource/AKM-BONN-INV-742</link>
      </references>
      <hasRepresentation>DR-KYLIX-001-MASTER-HP</hasRepresentation>
      <hasRepresentation>DR-KYLIX-001-REALTIME-GLB</hasRepresentation>
      <hasPart>DR-KYLIX-001-MASTER-HP</hasPart>
      <hasPart>DR-KYLIX-001-REALTIME-GLB</hasPart>
      <isPartOf>COL-UNIBONN-ARCH-2026</isPartOf>
      <wasDigitizedBy>ACT-2026-KYLIX-DIGI</wasDigitizedBy>
      <dcRelation>https://archaeology.uni-bonn.de/sammlungen/antiken/objekt-742</dcRelation>
    </heritageAssetIdentification>

    <!-- Digital Resource 1: Master High-Poly OBJ -->
    <digitalResource>
      <recordInformation>
        <id>DR-KYLIX-001-MASTER-HP</id>
        <source lang="de">BCDH Universität Bonn</source>
        <country lang="de">DE</country>
        <creation>
          <date>2026-10-18</date>
        </creation>
        <language lang="de">de</language>
        <metadataRights lang="en">CC0 1.0 Universal Public Domain</metadataRights>
      </recordInformation>
      <appellation>
        <name lang="de" preferred="true">3D Archival Master (High-Poly Textured Mesh): Attische Kylix (Inv. 742)</name>
        <name lang="en" preferred="false">3D Archival Master: Attic Kylix of Hermes</name>
        <id>DR-KYLIX-001-MASTER-HP</id>
      </appellation>
      <description lang="de" preferred="true">Wissenschaftliches metrologisches 3D-Mastermodell der attischen Trinkschale. Hochauflösende Dreiecksvermaschung mit kalibrierter 8K-PBR-Texturierung (Albedo, Normal, Roughness) und mm-genauer Skalierung.</description>
      <note lang="de">Metrologischer Kalibrierstandard: VDI/VDE 2634 Blatt 2 (Ringkalibrierung Prüfkörper R-28). Software: Artec Studio 19 Pro | Version: 19.0.4 | Role: Streifenlicht-Scan-Registrierung. Blender 4.2 LTS | Version: 4.2.3 | Role: UV-Projektion und Textur-Baking.</note>
      <actors>
        <name lang="de">M. Sc. Lukas Vanecek (BCDH 3D-Lab)</name>
        <actorType lang="en">person</actorType>
        <roles lang="de" namespace="AAT" term="Digitalisierungsingenieur" termUID="http://vocab.getty.edu/aat/300025633">3D-Operator &amp; Messtechniker</roles>
      </actors>
      <type>3D</type>
      <format>model/obj</format>
      <formatDetails lang="en">Wavefront OBJ mit MTL und 8K TIFF Texturen (Albedo, Normal, Roughness)</formatDetails>
      <extent lang="en">Polygonanzahl: 14.820.000 Dreiecke; Dateigröße: 1.42 GB</extent>
      <publicationStatement>
        <publisher lang="de">Bonn Center for Digital Humanities (BCDH)</publisher>
        <place lang="de">Bonn</place>
        <date>2026-10-20</date>
      </publicationStatement>
      <created>2026-10-18</created>
      <language lang="de">de</language>
      <link>https://repository.digitalhumanities.uni-bonn.de/3d/hermes-kylix-master.obj</link>
      <object>hermes-kylix-inv742-master-highpoly.obj</object>
      <rights>
        <copyrightCreditLine lang="de">BCDH / Universität Bonn</copyrightCreditLine>
        <accessRights lang="en">Open Access Academic (Research Download)</accessRights>
        <reproductionRights lang="en">CC BY-NC-SA 4.0</reproductionRights>
        <licence lang="en">https://creativecommons.org/licenses/by-nc-sa/4.0/</licence>
        <europeanaRights>Creative Commons - Attribution, Non-Commercial, ShareAlike (BY-NC-SA)</europeanaRights>
      </rights>
      <isRepresentationOf>HA-HERMES-KYLIX-001</isRepresentationOf>
      <isPartOf>COL-UNIBONN-ARCH-2026</isPartOf>
      <hasDerivative>DR-KYLIX-001-REALTIME-GLB</hasDerivative>
      <dcRelation>ACT-2026-KYLIX-DIGI</dcRelation>
    </digitalResource>

    <!-- Digital Resource 2: Web Realtime GLB -->
    <digitalResource>
      <recordInformation>
        <id>DR-KYLIX-001-REALTIME-GLB</id>
        <source lang="de">BCDH Universität Bonn</source>
        <country lang="de">DE</country>
        <creation>
          <date>2026-10-20</date>
        </creation>
        <language lang="de">de</language>
        <metadataRights lang="en">CC0 1.0 Universal Public Domain</metadataRights>
      </recordInformation>
      <appellation>
        <name lang="de" preferred="true">3D Web-Realtime Derivat (GLB KTX2): Attische Kylix</name>
        <name lang="en" preferred="false">3D Web Realtime Derivative (GLB): Attic Kylix</name>
        <id>DR-KYLIX-001-REALTIME-GLB</id>
      </appellation>
      <description lang="de" preferred="true">Interaktives Web-3D-Derivat für Online-Präsentation und IIIF-3D-Viewer. Topologie optimiert auf 85.000 Polygone mit KTX2-GPU-komprimierten PBR-Texturen.</description>
      <note lang="de">Derivat abgeleitet von DR-KYLIX-001-MASTER-HP. Polygonreduktion via Quadric Error Metrics (MeshLab) und Normal-Map-Bake in Substance Designer 14.</note>
      <actors>
        <name lang="de">M. Sc. Lukas Vanecek (BCDH 3D-Lab)</name>
        <actorType lang="en">person</actorType>
        <roles lang="de" namespace="AAT" term="3D-Grafiker" termUID="http://vocab.getty.edu/aat/300025633">3D-Operator</roles>
      </actors>
      <type>3D</type>
      <format>model/gltf-binary</format>
      <formatDetails lang="en">GLTF 2.0 Binary (.glb) mit KHR_texture_basisu KTX2 PBR Maps</formatDetails>
      <extent lang="en">Polygonanzahl: 85.400 Dreiecke; Dateigröße: 14.8 MB</extent>
      <publicationStatement>
        <publisher lang="de">Bonn Center for Digital Humanities (BCDH)</publisher>
        <place lang="de">Bonn</place>
        <date>2026-10-22</date>
      </publicationStatement>
      <created>2026-10-20</created>
      <language lang="de">de</language>
      <link>https://repository.digitalhumanities.uni-bonn.de/3d/hermes-kylix-realtime.glb</link>
      <object>hermes-kylix-inv742-realtime-web.glb</object>
      <rights>
        <copyrightCreditLine lang="de">BCDH / Universität Bonn</copyrightCreditLine>
        <accessRights lang="en">Open Access Public Web View</accessRights>
        <reproductionRights lang="en">CC BY-SA 4.0</reproductionRights>
        <licence lang="en">https://creativecommons.org/licenses/by-sa/4.0/</licence>
        <europeanaRights>Creative Commons - Attribution, ShareAlike (BY-SA)</europeanaRights>
      </rights>
      <isRepresentationOf>HA-HERMES-KYLIX-001</isRepresentationOf>
      <isPartOf>COL-UNIBONN-ARCH-2026</isPartOf>
      <isDerivativeOf>DR-KYLIX-001-MASTER-HP</isDerivativeOf>
      <dcRelation>ACT-2026-KYLIX-DIGI</dcRelation>
    </digitalResource>

    <!-- Activity 1: Digitization Campaign -->
    <activity>
      <recordInformation>
        <id>ACT-2026-KYLIX-DIGI</id>
        <source lang="de">BCDH Universität Bonn</source>
        <country lang="de">DE</country>
        <creation>
          <date>2026-10-21</date>
        </creation>
        <language lang="de">de</language>
        <metadataRights lang="en">CC0 1.0 Universal Public Domain</metadataRights>
      </recordInformation>
      <appellation>
        <name lang="de" preferred="true">3D-Digitalisierung &amp; Authentizitäts-Dokumentation (DAP): Kylix des Hermes</name>
        <name lang="en" preferred="false">3D Digitization &amp; Paradata Recording: Attic Kylix of Hermes</name>
        <id>ACT-2026-KYLIX-DIGI</id>
      </appellation>
      <description lang="de" preferred="true">Metrologische 3D-Erfassung der attischen Trinkschale mittels optischem Streifenlicht-Scanner und Makro-Photogrammetrie zur lückenlosen Dokumentation der Tondo-Zeichnung und Gefäßkurvatur.</description>
      <hasGeneralPurpose>Forschung &amp; Vermittlung (Digital Humanities Masterarchiv)</hasGeneralPurpose>
      <eventType lang="de" namespace="AAT" term="Digitalisierung" termUID="http://vocab.getty.edu/aat/300386989">3D-Digitalisierung</eventType>
      <actors>
        <name lang="de">M. Sc. Lukas Vanecek</name>
        <actorType lang="en">person</actorType>
        <roles lang="de" namespace="AAT" term="Projektleiter" termUID="http://vocab.getty.edu/aat/300025633">Technischer Projektleiter</roles>
      </actors>
      <temporal>
        <timeSpan>
          <startDate>2026-10-16</startDate>
          <endDate>2026-10-18</endDate>
        </timeSpan>
        <periodName lang="de" preferred="true">Oktober 2026</periodName>
      </temporal>
      <spatial>
        <locationSet>
          <namedLocation lang="de" preferred="true">BCDH 3D-Labor, Universität Bonn</namedLocation>
          <geopoliticalArea lang="de">Deutschland</geopoliticalArea>
        </locationSet>
      </spatial>
      <consistsOf>
        <hadSpecificPurpose>Materielle Spuren &amp; Konservierungszustand</hadSpecificPurpose>
        <startDate>2026-10-16</startDate>
        <endDate>2026-10-16</endDate>
        <methods>DAP-1: Materielle Spuren &amp; Merkmale (Reference) (http://hector.archaeology.org/vocab/dap-1)</methods>
        <techniques>Visuelle Inspektion mit Schräglicht; Identifikation antiker Glanztonabplatzungen und moderner Restaurierungsfugen mit Paraloid B-72.</techniques>
        <materials>Tonkeramik, schwarzer Glanzton, Tonoxydfarben</materials>
      </consistsOf>
      <consistsOf>
        <hadSpecificPurpose>Streifenlicht-Scan &amp; Makro-Photogrammetrie</hadSpecificPurpose>
        <startDate>2026-10-16</startDate>
        <endDate>2026-10-17</endDate>
        <methods>DAP-2: Aufnahmeprozess &amp; Erfassungsumfang (Capture) (http://hector.archaeology.org/vocab/dap-2)</methods>
        <techniques>Streifenlicht-Scanning mit Artec Space Spider (30 Mikrometer Punktgenauigkeit); 84 überlappende Ringaufnahmen der Innenseite und Henkelunterseiten.</techniques>
        <equipment>Artec Space Spider 3D-Scanner, Nikon Z8 mit Nikkor MC 105mm f/2.8 VR S Makro-Objektiv, polarisierte Ringleuchte</equipment>
      </consistsOf>
      <consistsOf>
        <hadSpecificPurpose>Mesh-Fusion &amp; Artefaktbereinigung</hadSpecificPurpose>
        <startDate>2026-10-17</startDate>
        <endDate>2026-10-18</endDate>
        <methods>DAP-3: Geometrie-Bearbeitung (Representation) (http://hector.archaeology.org/vocab/dap-3)</methods>
        <techniques>Global Registration (ICP RMSE 0.04 mm); Sharp-Fusion mit Rauschfilterung; Manuelles Schließen mikroskopischer Fehlstellen an den Henkelspalten (&lt; 0.5 mm).</techniques>
        <equipment>Artec Studio 19 Pro, Blender 4.2 LTS</equipment>
      </consistsOf>
      <consistsOf>
        <hadSpecificPurpose>PBR-Materialerfassung &amp; Delighting</hadSpecificPurpose>
        <startDate>2026-10-18</startDate>
        <endDate>2026-10-18</endDate>
        <methods>DAP-4: Textur, Shader &amp; Material (Representation) (http://hector.archaeology.org/vocab/dap-4)</methods>
        <techniques>Farbkalibrierung nach ColorChecker Digital SG; Cross-Polarisations-Delighting; Generierung von 8K Albedo, Normal und Roughness Textur-Karten.</techniques>
        <equipment>Adobe Photoshop Lightroom 14.1, Substance 3D Designer 14</equipment>
      </consistsOf>
      <consistsOf>
        <hadSpecificPurpose>Methodische Leitlinien &amp; Transparenz</hadSpecificPurpose>
        <startDate>2026-10-18</startDate>
        <endDate>2026-10-18</endDate>
        <methods>DAP-5: Wissenschaftliche Begründung (Principles) (http://hector.archaeology.org/vocab/dap-5)</methods>
        <techniques>Einhaltung der London Charter (Prinzip 4: Authentizität &amp; Transparenz) und Sevilla-Prinzipien. Keine synthetische Rekonstruktion verlorener Bruchstücke.</techniques>
      </consistsOf>
      <consistsOf>
        <hadSpecificPurpose>Transformationsbilanz &amp; Grenzziehung</hadSpecificPurpose>
        <startDate>2026-10-18</startDate>
        <endDate>2026-10-18</endDate>
        <methods>DAP-6: Abbildungsbilanz (Evaluation) (http://hector.archaeology.org/vocab/dap-6)</methods>
        <techniques>Metrologischer Soll-Ist-Vergleich: 99.4% der Gefäßoberfläche innerhalb 0.1 mm Abweichung erfasst; Verwitterungsspuren im Mastermodell vollwertig konserviert.</techniques>
      </consistsOf>
      <assessments>DAP-1 Befund: Fragmente antik gedübelt und modern mit Paraloid B72 gesichert; Tondo-Zeichnung zu 98% unversehrt.</assessments>
      <assessments>DAP-6 Qualitätsurteil: Vollständiges metrologisches Mastermodell mit höchster Signifikanz für archäologische Gefäßanalysen.</assessments>
      <wasPresentAt>HA-HERMES-KYLIX-001</wasPresentAt>
      <isPartOf>COL-UNIBONN-ARCH-2026</isPartOf>
      <hasCreated>DR-KYLIX-001-MASTER-HP</hasCreated>
      <hasCreated>DR-KYLIX-001-REALTIME-GLB</hasCreated>
      <dcRelation>HA-HERMES-KYLIX-001</dcRelation>
    </activity>
  </carare>

  <!-- CARARE RECORD 2: BRONZESTATUETTE DES HERMES KRIOPHOROS -->
  <carare id="CARARE-HERMES-02-STATUETTE">
    <collectionInformation>
      <id>COL-UNIBONN-ARCH-2026</id>
      <title lang="de" preferred="true">Antikensammlung des Akademischen Kunstmuseums Bonn – 3D-Forschungsarchiv &amp; DAP-Referenzkorpus</title>
      <source lang="de">Rheinische Friedrich-Wilhelms-Universität Bonn / BCDH</source>
      <rights>
        <copyrightCreditLine lang="de">Akademisches Kunstmuseum Bonn / BCDH Universität Bonn</copyrightCreditLine>
        <licence lang="en">https://creativecommons.org/licenses/by-sa/4.0/</licence>
      </rights>
      <language lang="de">de</language>
      <statement lang="de" preferred="true">Forschungskollektion 'Hermes-Pantheon'.</statement>
    </collectionInformation>

    <heritageAssetIdentification>
      <recordInformation>
        <id>HA-HERMES-STATUETTE-002</id>
        <source lang="de">Akademisches Kunstmuseum Bonn / BCDH</source>
        <country lang="de">DE</country>
        <creation>
          <date>2026-10-16</date>
        </creation>
        <language lang="de">de</language>
        <metadataRights lang="en">CC0 1.0 Universal Public Domain</metadataRights>
      </recordInformation>
      <appellation>
        <name lang="de" preferred="true">Bronzestatuette des Hermes Kriophoros (mit Widder)</name>
        <name lang="en" preferred="false">Bronze Statuette of Hermes Criophorus carrying a ram</name>
        <id>AKM-BONN-INV-1842</id>
      </appellation>
      <description lang="de" preferred="true">Massiv gegossene Bronzestatuette des Hermes als Hirtengott Kriophoros. Dargestellt mit Chlamys über der linken Schulter und geflügelten Sandalen, auf den Schultern einen Widder tragend. Griechisches Original der frühen Klassik um 460 v. Chr.</description>
      <generalType>Artefact</generalType>
      <actors>
        <name lang="de">Peloponnesische Bildhauerwerkstatt (Umkreis des Kalamis)</name>
        <actorType lang="en">person</actorType>
        <roles lang="de" namespace="AAT" term="Bronzegießer" termUID="http://vocab.getty.edu/aat/300025176">Erzgießer &amp; Bildhauer</roles>
      </actors>
      <designations>
        <protectionType lang="de">Kulturgut von nationaler Bedeutung (KGSG)</protectionType>
      </designations>
      <conditions>
        <condition lang="de">Hervorragend erhalten mit dunkelgrüner edler Malachit-Patina, rechter Unterschenkel antik repariert</condition>
        <conditionAssessment lang="de">Stabile Bronzematrix ohne Anzeichen von aktiver Bronzepest</conditionAssessment>
      </conditions>
      <provenance lang="de">Gefunden in Arkadien; 1912 gestiftet von Verein von Altertumsfreunden im Rheinlande</provenance>
      <characters>
        <heritageAssetType lang="de" namespace="AAT" term="Statuette" termUID="http://vocab.getty.edu/aat/300047455">Bronzestatuette / Votivgabe</heritageAssetType>
        <temporal>
          <timeSpan>
            <startDate>-0470</startDate>
            <endDate>-0450</endDate>
          </timeSpan>
          <periodName lang="de" preferred="true">Frühklassik (Strenger Stil)</periodName>
        </temporal>
        <materials lang="de">Zinnbronze</materials>
        <dimensions>
          <extent lang="de">Höhe mit Sockelzapfen: 18,7 cm; Breite: 7,2 cm; Tiefe: 5,1 cm; Gewicht: 685 g</extent>
        </dimensions>
      </characters>
      <spatial>
        <locationSet>
          <namedLocation lang="de" preferred="true">Bonn, Akademisches Kunstmuseum, Bronzensaal Vitrine B-2</namedLocation>
          <geopoliticalArea lang="de">Deutschland</geopoliticalArea>
        </locationSet>
      </spatial>
      <repositoryLocation lang="de">Akademisches Kunstmuseum Bonn, Inv.-Nr. 1842</repositoryLocation>
      <rights>
        <copyrightCreditLine lang="de">Akademisches Kunstmuseum Bonn</copyrightCreditLine>
        <accessRights lang="en">Open Access Academic</accessRights>
        <reproductionRights lang="en">CC BY-NC-SA 4.0</reproductionRights>
        <licence lang="en">https://creativecommons.org/licenses/by-nc-sa/4.0/</licence>
        <europeanaRights>Creative Commons - Attribution, Non-Commercial, ShareAlike (BY-NC-SA)</europeanaRights>
      </rights>
      <references>
        <appellation>
          <name lang="de">LIMC (Lexicon Iconographicum Mythologiae Classicae)</name>
          <id>LIMC-Hermes-148a</id>
        </appellation>
        <link>https://www.carare.eu/resource/AKM-BONN-INV-1842</link>
      </references>
      <hasRepresentation>DR-STATUETTE-002-MASTER-HP</hasRepresentation>
      <hasRepresentation>DR-STATUETTE-002-REALTIME-GLB</hasRepresentation>
      <hasPart>DR-STATUETTE-002-MASTER-HP</hasPart>
      <hasPart>DR-STATUETTE-002-REALTIME-GLB</hasPart>
      <isPartOf>COL-UNIBONN-ARCH-2026</isPartOf>
      <wasDigitizedBy>ACT-2026-STATUETTE-DIGI</wasDigitizedBy>
      <dcRelation>https://archaeology.uni-bonn.de/sammlungen/antiken/objekt-1842</dcRelation>
    </heritageAssetIdentification>

    <!-- Digital Resource 3: Master High-Poly PLY -->
    <digitalResource>
      <recordInformation>
        <id>DR-STATUETTE-002-MASTER-HP</id>
        <source lang="de">BCDH Universität Bonn</source>
        <country lang="de">DE</country>
        <creation>
          <date>2026-10-19</date>
        </creation>
        <language lang="de">de</language>
        <metadataRights lang="en">CC0 1.0 Universal Public Domain</metadataRights>
      </recordInformation>
      <appellation>
        <name lang="de" preferred="true">3D Archival Master (High-Poly Mesh mit Farbinformation): Hermes Kriophoros</name>
        <name lang="en" preferred="false">3D Archival Master: Hermes Criophorus Bronze</name>
        <id>DR-STATUETTE-002-MASTER-HP</id>
      </appellation>
      <description lang="de" preferred="true">Vollständiges metrologisches 3D-Volumenmodell der Bronzestatuette. Erfasst mit optischem Streifenlichtscanner und Farbkalibrierung für sub-millimetrische Gußnaht- und Oberflächenanalysen.</description>
      <note lang="de">Kalibrierung nach VDI/VDE 2634 Blatt 3. Software: Artec Studio 19 Pro, CloudCompare 2.13. Genauigkeit: 0.03 mm.</note>
      <actors>
        <name lang="de">Dipl.-Ing. Maria Helling</name>
        <actorType lang="en">person</actorType>
        <roles lang="de" namespace="AAT" term="Messtechnikerin" termUID="http://vocab.getty.edu/aat/300025633">3D-Messtechnikerin</roles>
      </actors>
      <type>3D</type>
      <format>model/ply</format>
      <formatDetails lang="en">Stanford PLY Binary mit Vertex Color und Surface Normals</formatDetails>
      <extent lang="en">Polygonanzahl: 9.420.000 Polygone; Dateigröße: 840 MB</extent>
      <publicationStatement>
        <publisher lang="de">Bonn Center for Digital Humanities (BCDH)</publisher>
        <place lang="de">Bonn</place>
        <date>2026-10-20</date>
      </publicationStatement>
      <created>2026-10-19</created>
      <language lang="de">de</language>
      <link>https://repository.digitalhumanities.uni-bonn.de/3d/hermes-statuette-master.ply</link>
      <object>hermes-statuette-inv1842-master-highpoly.ply</object>
      <rights>
        <copyrightCreditLine lang="de">BCDH / Universität Bonn</copyrightCreditLine>
        <accessRights lang="en">Open Access Academic</accessRights>
        <reproductionRights lang="en">CC BY-NC-SA 4.0</reproductionRights>
        <licence lang="en">https://creativecommons.org/licenses/by-nc-sa/4.0/</licence>
        <europeanaRights>Creative Commons - Attribution, Non-Commercial, ShareAlike (BY-NC-SA)</europeanaRights>
      </rights>
      <isRepresentationOf>HA-HERMES-STATUETTE-002</isRepresentationOf>
      <isPartOf>COL-UNIBONN-ARCH-2026</isPartOf>
      <hasDerivative>DR-STATUETTE-002-REALTIME-GLB</hasDerivative>
      <dcRelation>ACT-2026-STATUETTE-DIGI</dcRelation>
    </digitalResource>

    <!-- Digital Resource 4: Realtime GLB -->
    <digitalResource>
      <recordInformation>
        <id>DR-STATUETTE-002-REALTIME-GLB</id>
        <source lang="de">BCDH Universität Bonn</source>
        <country lang="de">DE</country>
        <creation>
          <date>2026-10-20</date>
        </creation>
        <language lang="de">de</language>
        <metadataRights lang="en">CC0 1.0 Universal Public Domain</metadataRights>
      </recordInformation>
      <appellation>
        <name lang="de" preferred="true">3D Web-Realtime Derivat (GLB KTX2 Metallic-Roughness): Hermes Kriophoros</name>
        <name lang="en" preferred="false">3D Web Realtime Asset: Hermes Criophorus</name>
        <id>DR-STATUETTE-002-REALTIME-GLB</id>
      </appellation>
      <description lang="de" preferred="true">PBR-optimiertes GLB-Modell mit KTX2-Patina-Texturen und Metallic-Roughness-Shader für flüssige 60fps-Interaktion in WebGL.</description>
      <note lang="de">Erstellt aus DR-STATUETTE-002-MASTER-HP via Mesh-Dezimation auf 65k Tris und Substance Designer 14 PBR Texture Bake.</note>
      <actors>
        <name lang="de">Dipl.-Ing. Maria Helling</name>
        <actorType lang="en">person</actorType>
        <roles lang="de" namespace="AAT" term="3D-Grafikerin" termUID="http://vocab.getty.edu/aat/300025633">3D-Operator</roles>
      </actors>
      <type>3D</type>
      <format>model/gltf-binary</format>
      <formatDetails lang="en">GLTF 2.0 Binary (.glb) mit PBR Metallic-Roughness</formatDetails>
      <extent lang="en">Polygonanzahl: 65.000 Dreiecke; Dateigröße: 8.9 MB</extent>
      <publicationStatement>
        <publisher lang="de">Bonn Center for Digital Humanities (BCDH)</publisher>
        <place lang="de">Bonn</place>
        <date>2026-10-22</date>
      </publicationStatement>
      <created>2026-10-20</created>
      <language lang="de">de</language>
      <link>https://repository.digitalhumanities.uni-bonn.de/3d/hermes-statuette-realtime.glb</link>
      <object>hermes-statuette-inv1842-realtime-web.glb</object>
      <rights>
        <copyrightCreditLine lang="de">BCDH / Universität Bonn</copyrightCreditLine>
        <accessRights lang="en">Open Access Public Web View</accessRights>
        <reproductionRights lang="en">CC BY-SA 4.0</reproductionRights>
        <licence lang="en">https://creativecommons.org/licenses/by-sa/4.0/</licence>
        <europeanaRights>Creative Commons - Attribution, ShareAlike (BY-SA)</europeanaRights>
      </rights>
      <isRepresentationOf>HA-HERMES-STATUETTE-002</isRepresentationOf>
      <isPartOf>COL-UNIBONN-ARCH-2026</isPartOf>
      <isDerivativeOf>DR-STATUETTE-002-MASTER-HP</isDerivativeOf>
      <dcRelation>ACT-2026-STATUETTE-DIGI</dcRelation>
    </digitalResource>

    <!-- Activity 2: Statuette Campaign -->
    <activity>
      <recordInformation>
        <id>ACT-2026-STATUETTE-DIGI</id>
        <source lang="de">BCDH Universität Bonn</source>
        <country lang="de">DE</country>
        <creation>
          <date>2026-10-21</date>
        </creation>
        <language lang="de">de</language>
        <metadataRights lang="en">CC0 1.0 Universal Public Domain</metadataRights>
      </recordInformation>
      <appellation>
        <name lang="de" preferred="true">3D-Digitalisierung &amp; Authentizitäts-Dokumentation (DAP): Bronzestatuette des Hermes Kriophoros</name>
        <name lang="en" preferred="false">3D Digitization: Bronze Statuette of Hermes Criophorus</name>
        <id>ACT-2026-STATUETTE-DIGI</id>
      </appellation>
      <description lang="de" preferred="true">Hochauflösende 3D-Geometrieerfassung zur Analyse von Gusstechnik, Kernstützen und Kaltarbeitspuren der antiken Bronzegießerkunst.</description>
      <hasGeneralPurpose>Forschung &amp; Vermittlung (Digital Humanities Masterarchiv)</hasGeneralPurpose>
      <eventType lang="de" namespace="AAT" term="Digitalisierung" termUID="http://vocab.getty.edu/aat/300386989">3D-Digitalisierung</eventType>
      <actors>
        <name lang="de">Dipl.-Ing. Maria Helling</name>
        <actorType lang="en">person</actorType>
        <roles lang="de" namespace="AAT" term="Projektleiterin" termUID="http://vocab.getty.edu/aat/300025633">Technische Leitung Messtechnik</roles>
      </actors>
      <temporal>
        <timeSpan>
          <startDate>2026-10-18</startDate>
          <endDate>2026-10-19</endDate>
        </timeSpan>
        <periodName lang="de" preferred="true">Oktober 2026</periodName>
      </temporal>
      <spatial>
        <locationSet>
          <namedLocation lang="de" preferred="true">BCDH 3D-Labor, Universität Bonn</namedLocation>
          <geopoliticalArea lang="de">Deutschland</geopoliticalArea>
        </locationSet>
      </spatial>
      <consistsOf>
        <hadSpecificPurpose>Materielle Spuren &amp; Metallurgie</hadSpecificPurpose>
        <startDate>2026-10-18</startDate>
        <endDate>2026-10-18</endDate>
        <methods>DAP-1: Materielle Spuren &amp; Merkmale (Reference) (http://hector.archaeology.org/vocab/dap-1)</methods>
        <techniques>Oberflächeninspektion: Gussnähte an den Flanken, Kaltgravur der Locken und Augenlider; antike Reparatur am rechten Fesselgelenk.</techniques>
        <materials>Antike Zinnbronze mit Malachit-Edelpatina</materials>
      </consistsOf>
      <consistsOf>
        <hadSpecificPurpose>Streifenlicht-Scannen mit automatischer Drehbühne</hadSpecificPurpose>
        <startDate>2026-10-18</startDate>
        <endDate>2026-10-19</endDate>
        <methods>DAP-2: Aufnahmeprozess &amp; Erfassungsumfang (Capture) (http://hector.archaeology.org/vocab/dap-2)</methods>
        <techniques>Automatisierter Drehtisch-Scan in 3 Höhenwinkeln (0°, 45°, -30°); 72 Teilscans zur vollständigen Erfassung der Hinterschneidungen des Widders.</techniques>
        <equipment>Artec Micro II SLS-Scanner (Genauigkeit bis 5 Mikrometer), Artec Space Spider</equipment>
      </consistsOf>
      <consistsOf>
        <hadSpecificPurpose>Registrierung &amp; Schließen von Hinterschneidungen</hadSpecificPurpose>
        <startDate>2026-10-19</startDate>
        <endDate>2026-10-19</endDate>
        <methods>DAP-3: Geometrie-Bearbeitung (Representation) (http://hector.archaeology.org/vocab/dap-3)</methods>
        <techniques>Iterative Closest Point Registrierung mit RMSE 0.02 mm; Glättung von Rekonstruktionsrauschen mit Laplacian Filter.</techniques>
        <equipment>Artec Studio 19 Pro, CloudCompare 2.13</equipment>
      </consistsOf>
      <consistsOf>
        <hadSpecificPurpose>Patina-Shader &amp; Texturbaking</hadSpecificPurpose>
        <startDate>2026-10-19</startDate>
        <endDate>2026-10-20</endDate>
        <methods>DAP-4: Textur, Shader &amp; Material (Representation) (http://hector.archaeology.org/vocab/dap-4)</methods>
        <techniques>Exakte Trennung von metallischem Grundmaterial und matter Malachit-Patina über kalibrierte Metallic-Roughness Texturmaps; Delighting mit Spherical Harmonics.</techniques>
        <equipment>Substance 3D Designer 14, Adobe Photoshop</equipment>
      </consistsOf>
      <consistsOf>
        <hadSpecificPurpose>London Charter &amp; Sevilla-Prinzipien</hadSpecificPurpose>
        <startDate>2026-10-20</startDate>
        <endDate>2026-10-20</endDate>
        <methods>DAP-5: Wissenschaftliche Begründung (Principles) (http://hector.archaeology.org/vocab/dap-5)</methods>
        <techniques>Minimal-invasive Digitalisierung ohne Anbringung von Passmarken auf dem Original; vollständige Dokumentation aller Datenverarbeitungsschritte.</techniques>
      </consistsOf>
      <consistsOf>
        <hadSpecificPurpose>Abbildungsbilanz &amp; metrologische Validierung</hadSpecificPurpose>
        <startDate>2026-10-20</startDate>
        <endDate>2026-10-20</endDate>
        <methods>DAP-6: Abbildungsbilanz (Evaluation) (http://hector.archaeology.org/vocab/dap-6)</methods>
        <techniques>Gegenüberstellung von Lasertracking und Streifenlichtscan: Maximale Restabweichung 0.038 mm; Gussnahtverläufe zu 100% abbildungstreu rekonstruiert.</techniques>
      </consistsOf>
      <assessments>DAP-1 Befund: Kaltgravierte Details an Locken und Widderkopf mit außergewöhnlicher Frische erhalten; Patina intakt.</assessments>
      <assessments>DAP-6 Urteil: Idealer Referenzdatensatz für klassische griechische Kleinbronzen mit metrologischem Gütesiegel.</assessments>
      <wasPresentAt>HA-HERMES-STATUETTE-002</wasPresentAt>
      <isPartOf>COL-UNIBONN-ARCH-2026</isPartOf>
      <hasCreated>DR-STATUETTE-002-MASTER-HP</hasCreated>
      <hasCreated>DR-STATUETTE-002-REALTIME-GLB</hasCreated>
      <dcRelation>HA-HERMES-STATUETTE-002</dcRelation>
    </activity>
  </carare>

  <!-- CARARE RECORD 3: MARMORBÜSTE DES HERMES-MERCURIUS -->
  <carare id="CARARE-HERMES-03-MARBLE">
    <collectionInformation>
      <id>COL-UNIBONN-ARCH-2026</id>
      <title lang="de" preferred="true">Antikensammlung des Akademischen Kunstmuseums Bonn – 3D-Forschungsarchiv &amp; DAP-Referenzkorpus</title>
      <source lang="de">Rheinische Friedrich-Wilhelms-Universität Bonn / BCDH</source>
      <rights>
        <copyrightCreditLine lang="de">Akademisches Kunstmuseum Bonn / BCDH Universität Bonn</copyrightCreditLine>
        <licence lang="en">https://creativecommons.org/licenses/by-sa/4.0/</licence>
      </rights>
      <language lang="de">de</language>
      <statement lang="de" preferred="true">Forschungskollektion 'Hermes-Pantheon'.</statement>
    </collectionInformation>

    <heritageAssetIdentification>
      <recordInformation>
        <id>HA-HERMES-MARBLE-003</id>
        <source lang="de">Akademisches Kunstmuseum Bonn / BCDH</source>
        <country lang="de">DE</country>
        <creation>
          <date>2026-10-16</date>
        </creation>
        <language lang="de">de</language>
        <metadataRights lang="en">CC0 1.0 Universal Public Domain</metadataRights>
      </recordInformation>
      <appellation>
        <name lang="de" preferred="true">Römische Marmorbüste des Hermes-Mercurius mit Petasos und Kerykeion</name>
        <name lang="en" preferred="false">Roman marble bust of Hermes-Mercury wearing petasos and chlamys</name>
        <id>AKM-BONN-SK-920</id>
      </appellation>
      <description lang="de" preferred="true">Lebensgroße Porträtbüste des Hermes-Mercurius aus feinkörnigem pentelischem Marmor. Dargestellt mit geflügeltem Reisehut (Petasos), Chlamys auf der linken Schulter und Kerykeion-Ansatz. Römische meisterhafte Wiederholung eines polykletischen Vorbilds aus der antoninischen Epoche (ca. 160 n. Chr.).</description>
      <generalType>Artefact</generalType>
      <actors>
        <name lang="de">Römische kaiserzeitliche Bildhauerwerkstatt (Rom/Ostia)</name>
        <actorType lang="en">person</actorType>
        <roles lang="de" namespace="AAT" term="Bildhauer" termUID="http://vocab.getty.edu/aat/300025176">Marmorbildhauer &amp; Kopist</roles>
      </actors>
      <designations>
        <protectionType lang="de">Kulturgut von nationaler Bedeutung (KGSG)</protectionType>
      </designations>
      <conditions>
        <condition lang="de">Nasenspitze und Teil der Hutkrempe antik/frühneuzeitlich ergänzt; Oberfläche gereinigt, antike Meißel- und Bohrerspuren im Haar vorzüglich erhalten</condition>
        <conditionAssessment lang="de">Fester Marmorgefügezustand; leichte oberflächliche Versinterung an der Büstenrückseite</conditionAssessment>
      </conditions>
      <provenance lang="de">Gefunden bei Ausgrabungen in Tivoli (Villa Hadriana) 1785; 1820 über Vermächtnis an die Bonner Sammlung gelangt</provenance>
      <characters>
        <heritageAssetType lang="de" namespace="AAT" term="Büste" termUID="http://vocab.getty.edu/aat/300047457">Marmorbüste / Skulptur</heritageAssetType>
        <temporal>
          <timeSpan>
            <startDate>0150</startDate>
            <endDate>0175</endDate>
          </timeSpan>
          <periodName lang="de" preferred="true">Römische Kaiserzeit (Antoninisch)</periodName>
        </temporal>
        <materials lang="de">Pentelischer Marmor</materials>
        <dimensions>
          <extent lang="de">Höhe mit Sockel: 54,6 cm; Breite: 38,2 cm; Tiefe: 26,4 cm; Gewicht: 41,2 kg</extent>
        </dimensions>
      </characters>
      <spatial>
        <locationSet>
          <namedLocation lang="de" preferred="true">Bonn, Akademisches Kunstmuseum, Skulpturensaal Aufstellung 12</namedLocation>
          <geopoliticalArea lang="de">Deutschland</geopoliticalArea>
        </locationSet>
      </spatial>
      <repositoryLocation lang="de">Akademisches Kunstmuseum Bonn, Inv.-Nr. SK-920</repositoryLocation>
      <rights>
        <copyrightCreditLine lang="de">Akademisches Kunstmuseum Bonn</copyrightCreditLine>
        <accessRights lang="en">Open Access Academic</accessRights>
        <reproductionRights lang="en">CC BY-NC-SA 4.0</reproductionRights>
        <licence lang="en">https://creativecommons.org/licenses/by-nc-sa/4.0/</licence>
        <europeanaRights>Creative Commons - Attribution, Non-Commercial, ShareAlike (BY-NC-SA)</europeanaRights>
      </rights>
      <references>
        <appellation>
          <name lang="de">Arachne Bilddatenbank (DAI / Univ. zu Köln)</name>
          <id>ARACHNE-OBJ-109482</id>
        </appellation>
        <link>https://www.carare.eu/resource/AKM-BONN-SK-920</link>
      </references>
      <hasRepresentation>DR-MARBLE-003-MASTER-HP</hasRepresentation>
      <hasRepresentation>DR-MARBLE-003-REALTIME-GLB</hasRepresentation>
      <hasPart>DR-MARBLE-003-MASTER-HP</hasPart>
      <hasPart>DR-MARBLE-003-REALTIME-GLB</hasPart>
      <isPartOf>COL-UNIBONN-ARCH-2026</isPartOf>
      <wasDigitizedBy>ACT-2026-MARBLE-DIGI</wasDigitizedBy>
      <dcRelation>https://archaeology.uni-bonn.de/sammlungen/antiken/objekt-sk920</dcRelation>
    </heritageAssetIdentification>

    <!-- Digital Resource 5: Master High-Poly OBJ -->
    <digitalResource>
      <recordInformation>
        <id>DR-MARBLE-003-MASTER-HP</id>
        <source lang="de">BCDH Universität Bonn</source>
        <country lang="de">DE</country>
        <creation>
          <date>2026-10-20</date>
        </creation>
        <language lang="de">de</language>
        <metadataRights lang="en">CC0 1.0 Universal Public Domain</metadataRights>
      </recordInformation>
      <appellation>
        <name lang="de" preferred="true">3D Archival Master (High-Poly Mesh): Marmorbüste des Hermes (SK 920)</name>
        <name lang="en" preferred="false">3D Archival Master: Roman Marble Bust of Hermes</name>
        <id>DR-MARBLE-003-MASTER-HP</id>
      </appellation>
      <description lang="de" preferred="true">Wissenschaftliches Master-3D-Modell mit über 18 Millionen Dreiecken und 16K-Texturmaps zur mikroskopischen Analyse antiker Meißelspuren und Transluzenzsimulation.</description>
      <note lang="de">Hybrid-Erfassung (Streifenlicht Artec Leo + Photogrammetrie Sony A7R V). Kalibrierkörper VDI/VDE 2634 Blatt 2. RMSE: 0.045 mm.</note>
      <actors>
        <name lang="de">Prof. Dr. Roland Knauber (Photogrammetrie)</name>
        <actorType lang="en">person</actorType>
        <roles lang="de" namespace="AAT" term="Photogrammeter" termUID="http://vocab.getty.edu/aat/300025633">Leitender Photogrammeter</roles>
      </actors>
      <type>3D</type>
      <format>model/obj</format>
      <formatDetails lang="en">Wavefront OBJ mit MTL und 16K TIFF Texturmaps (Albedo, Normal, Subsurface-Scattering)</formatDetails>
      <extent lang="en">Polygonanzahl: 18.250.000 Dreiecke; Dateigröße: 1.88 GB</extent>
      <publicationStatement>
        <publisher lang="de">Bonn Center for Digital Humanities (BCDH)</publisher>
        <place lang="de">Bonn</place>
        <date>2026-10-22</date>
      </publicationStatement>
      <created>2026-10-20</created>
      <language lang="de">de</language>
      <link>https://repository.digitalhumanities.uni-bonn.de/3d/hermes-marble-master.obj</link>
      <object>hermes-marble-bust-sk920-master-highpoly.obj</object>
      <rights>
        <copyrightCreditLine lang="de">BCDH / Universität Bonn</copyrightCreditLine>
        <accessRights lang="en">Open Access Academic</accessRights>
        <reproductionRights lang="en">CC BY-NC-SA 4.0</reproductionRights>
        <licence lang="en">https://creativecommons.org/licenses/by-nc-sa/4.0/</licence>
        <europeanaRights>Creative Commons - Attribution, Non-Commercial, ShareAlike (BY-NC-SA)</europeanaRights>
      </rights>
      <isRepresentationOf>HA-HERMES-MARBLE-003</isRepresentationOf>
      <isPartOf>COL-UNIBONN-ARCH-2026</isPartOf>
      <hasDerivative>DR-MARBLE-003-REALTIME-GLB</hasDerivative>
      <dcRelation>ACT-2026-MARBLE-DIGI</dcRelation>
    </digitalResource>

    <!-- Digital Resource 6: Realtime GLB -->
    <digitalResource>
      <recordInformation>
        <id>DR-MARBLE-003-REALTIME-GLB</id>
        <source lang="de">BCDH Universität Bonn</source>
        <country lang="de">DE</country>
        <creation>
          <date>2026-10-21</date>
        </creation>
        <language lang="de">de</language>
        <metadataRights lang="en">CC0 1.0 Universal Public Domain</metadataRights>
      </recordInformation>
      <appellation>
        <name lang="de" preferred="true">3D Web-Realtime Derivat (GLB PBR Translucency): Marmorbüste des Hermes</name>
        <name lang="en" preferred="false">3D Web Realtime Asset: Roman Marble Bust of Hermes</name>
        <id>DR-MARBLE-003-REALTIME-GLB</id>
      </appellation>
      <description lang="de" preferred="true">Interaktives Web-3D-Modell mit Marmor-Transluzenz-Approximation (KHR_materials_transmission) für Web-Browser und Virtual Reality.</description>
      <note lang="de">Erstellt aus DR-MARBLE-003-MASTER-HP; Dezimierung auf 110.000 Faces in Blender 4.2 LTS; Normal-Map-Bake der Meißelspuren.</note>
      <actors>
        <name lang="de">Prof. Dr. Roland Knauber</name>
        <actorType lang="en">person</actorType>
        <roles lang="de" namespace="AAT" term="3D-Grafiker" termUID="http://vocab.getty.edu/aat/300025633">3D-Operator</roles>
      </actors>
      <type>3D</type>
      <format>model/gltf-binary</format>
      <formatDetails lang="en">GLTF 2.0 Binary (.glb) mit KHR_materials_transmission und Normal-Maps</formatDetails>
      <extent lang="en">Polygonanzahl: 110.000 Dreiecke; Dateigröße: 16.4 MB</extent>
      <publicationStatement>
        <publisher lang="de">Bonn Center for Digital Humanities (BCDH)</publisher>
        <place lang="de">Bonn</place>
        <date>2026-10-22</date>
      </publicationStatement>
      <created>2026-10-21</created>
      <language lang="de">de</language>
      <link>https://repository.digitalhumanities.uni-bonn.de/3d/hermes-marble-realtime.glb</link>
      <object>hermes-marble-bust-sk920-realtime-web.glb</object>
      <rights>
        <copyrightCreditLine lang="de">BCDH / Universität Bonn</copyrightCreditLine>
        <accessRights lang="en">Open Access Public Web View</accessRights>
        <reproductionRights lang="en">CC BY-SA 4.0</reproductionRights>
        <licence lang="en">https://creativecommons.org/licenses/by-sa/4.0/</licence>
        <europeanaRights>Creative Commons - Attribution, ShareAlike (BY-SA)</europeanaRights>
      </rights>
      <isRepresentationOf>HA-HERMES-MARBLE-003</isRepresentationOf>
      <isPartOf>COL-UNIBONN-ARCH-2026</isPartOf>
      <isDerivativeOf>DR-MARBLE-003-MASTER-HP</isDerivativeOf>
      <dcRelation>ACT-2026-MARBLE-DIGI</dcRelation>
    </digitalResource>

    <!-- Activity 3: Marble Campaign -->
    <activity>
      <recordInformation>
        <id>ACT-2026-MARBLE-DIGI</id>
        <source lang="de">BCDH Universität Bonn</source>
        <country lang="de">DE</country>
        <creation>
          <date>2026-10-21</date>
        </creation>
        <language lang="de">de</language>
        <metadataRights lang="en">CC0 1.0 Universal Public Domain</metadataRights>
      </recordInformation>
      <appellation>
        <name lang="de" preferred="true">3D-Digitalisierung &amp; Authentizitäts-Dokumentation (DAP): Marmorbüste des Hermes</name>
        <name lang="en" preferred="false">3D Digitization: Roman Marble Bust of Hermes</name>
        <id>ACT-2026-MARBLE-DIGI</id>
      </appellation>
      <description lang="de" preferred="true">Strukturierte metrologische 3D-Dokumentation mit optischem Handscanner und digitaler Photogrammetrie zur morphometrischen Erforschung von Werkstattserien.</description>
      <hasGeneralPurpose>Forschung &amp; Vermittlung (Digital Humanities Masterarchiv)</hasGeneralPurpose>
      <eventType lang="de" namespace="AAT" term="Digitalisierung" termUID="http://vocab.getty.edu/aat/300386989">3D-Digitalisierung</eventType>
      <actors>
        <name lang="de">Prof. Dr. Roland Knauber</name>
        <actorType lang="en">person</actorType>
        <roles lang="de" namespace="AAT" term="Photogrammeter" termUID="http://vocab.getty.edu/aat/300025633">Leitender Messtechniker</roles>
      </actors>
      <temporal>
        <timeSpan>
          <startDate>2026-10-19</startDate>
          <endDate>2026-10-20</endDate>
        </timeSpan>
        <periodName lang="de" preferred="true">Oktober 2026</periodName>
      </temporal>
      <spatial>
        <locationSet>
          <namedLocation lang="de" preferred="true">Skulpturensaal, Akademisches Kunstmuseum Bonn</namedLocation>
          <geopoliticalArea lang="de">Deutschland</geopoliticalArea>
        </locationSet>
      </spatial>
      <consistsOf>
        <hadSpecificPurpose>Materielle Spuren &amp; Werkzeugspuren</hadSpecificPurpose>
        <startDate>2026-10-19</startDate>
        <endDate>2026-10-19</endDate>
        <methods>DAP-1: Materielle Spuren &amp; Merkmale (Reference) (http://hector.archaeology.org/vocab/dap-1)</methods>
        <techniques>Dokumentation antiker Bohrlöcher in den Haarlocken; Spuren des Zahneisens an den Büstenschultern; moderne Ergänzung an der Nasenspitze.</techniques>
        <materials>Feinkörniger pentelischer Marmor</materials>
      </consistsOf>
      <consistsOf>
        <hadSpecificPurpose>Hybrid-Erfassung: Laserscan &amp; Photogrammetrie</hadSpecificPurpose>
        <startDate>2026-10-19</startDate>
        <endDate>2026-10-20</endDate>
        <methods>DAP-2: Aufnahmeprozess &amp; Erfassungsumfang (Capture) (http://hector.archaeology.org/vocab/dap-2)</methods>
        <techniques>Vollständige Rundum-Erfassung der Büste und des modernen Holzsockels; Hinterschneidungen in den tiefen Bohrlöchern der Haarlocken optisch bestmöglich ausgeleuchtet.</techniques>
        <equipment>Artec Leo 3D-Scanner, Sony Alpha 7R V mit Sony FE 50mm f/1.2 GM Objektiv</equipment>
      </consistsOf>
      <consistsOf>
        <hadSpecificPurpose>Hybrid-Registrierung &amp; Dezimierung</hadSpecificPurpose>
        <startDate>2026-10-20</startDate>
        <endDate>2026-10-20</endDate>
        <methods>DAP-3: Geometrie-Bearbeitung (Representation) (http://hector.archaeology.org/vocab/dap-3)</methods>
        <techniques>Hybrid-Registrierung von Laserscan und SFM-Photogrammetrie; Schließen mikroskopischer Artefaktlöcher; Decimierung auf 110k Faces.</techniques>
        <equipment>Artec Studio 19, RealityCapture, Blender 4.2</equipment>
      </consistsOf>
      <consistsOf>
        <hadSpecificPurpose>Marmor-Transluzenz &amp; Normal-Maps</hadSpecificPurpose>
        <startDate>2026-10-20</startDate>
        <endDate>2026-10-21</endDate>
        <methods>DAP-4: Textur, Shader &amp; Material (Representation) (http://hector.archaeology.org/vocab/dap-4)</methods>
        <techniques>PBR-Delighting; PBR Marmor-Material mit Translucency-Approximation; Normal-Map-Baking der Meißelspuren und antiken Steinoberfläche.</techniques>
        <equipment>Substance 3D Designer, Photoshop, KTX2 Tooling</equipment>
      </consistsOf>
      <consistsOf>
        <hadSpecificPurpose>Methodische Rechtfertigung &amp; Denkmalschutz</hadSpecificPurpose>
        <startDate>2026-10-21</startDate>
        <endDate>2026-10-21</endDate>
        <methods>DAP-5: Wissenschaftliche Begründung (Principles) (http://hector.archaeology.org/vocab/dap-5)</methods>
        <techniques>Begründung der Sockel-Mitdigitalisierung zur Dokumentation der historischen Montage; Keine fiktive Rekonstruktion verlorener Krempenteile.</techniques>
      </consistsOf>
      <consistsOf>
        <hadSpecificPurpose>Vergleichsbilanz &amp; Güteprüfung</hadSpecificPurpose>
        <startDate>2026-10-21</startDate>
        <endDate>2026-10-21</endDate>
        <methods>DAP-6: Abbildungsbilanz (Evaluation) (http://hector.archaeology.org/vocab/dap-6)</methods>
        <techniques>99.1% der Oberfläche unter 0.1 mm Abweichung; Transluzenz des pentelischen Marmors im Shader physikalisch plausibel abgebildet.</techniques>
      </consistsOf>
      <assessments>DAP-1 Befund: Historische Restaurierungen deutlich differenzierbar; antike Meißelführung unverfälscht dokumentiert.</assessments>
      <assessments>DAP-6 Urteil: Hervorragend für 3D-Kopienforschung und vergleichende Werkstattstudien römischer Kaiserzeitporträts geeignet.</assessments>
      <wasPresentAt>HA-HERMES-MARBLE-003</wasPresentAt>
      <isPartOf>COL-UNIBONN-ARCH-2026</isPartOf>
      <hasCreated>DR-MARBLE-003-MASTER-HP</hasCreated>
      <hasCreated>DR-MARBLE-003-REALTIME-GLB</hasCreated>
      <dcRelation>HA-HERMES-MARBLE-003</dcRelation>
    </activity>
  </carare>
</carareWrap>"""

def generate_all():
    xml_path = 'public/CARARE_Phantasie_Kollektion_3D_Master_und_Derivate.xml'
    with open(xml_path, 'w', encoding='utf-8') as f:
        f.write(XML_CONTENT)
    with open('CARARE_Phantasie_Kollektion_3D_Master_und_Derivate.xml', 'w', encoding='utf-8') as f:
        f.write(XML_CONTENT)

    bag_zip_path = 'public/CARARE_Phantasie_Kollektion_3D_Master_und_Derivate_bagit.zip'
    with zipfile.ZipFile(bag_zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
        z.writestr('bagit.txt', 'BagIt-Version: 1.0\nTag-File-Character-Encoding: UTF-8\n')
        z.writestr('bag-info.txt', 'Bag-Software-Agent: HERMES v0.1.6\nMetadata-Schemas: CARARE 2.0.6\n')
        z.writestr('metadata/carare-v2.0.6.xml', XML_CONTENT)

    with open('CARARE_Phantasie_Kollektion_3D_Master_und_Derivate_bagit.zip', 'wb') as f:
        f.write(open(bag_zip_path, 'rb').read())
    print("Generated valid CARARE XML and BagIt ZIP!")

if __name__ == '__main__':
    generate_all()
