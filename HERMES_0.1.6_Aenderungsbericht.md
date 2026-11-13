# HERMES v0.1.6 – Änderungsbericht (Changelog & Nachvollziehbarkeit)

**Datum:** 13.11.2026  
**Commits:** `e4b27a2` (Änderungskonzept Phasen 1–3) & `ce8a045` (Usability-Optimierungen für die Museumspraxis)  
**Release-Paket:** `HERMES_Windows_Release_Package/` (`HERMES.exe`, `HERMES_Setup_v0.1.6.exe`, `HERMES_Installer_v0.1.6.msi`)

---

## 1. Personen-Pool, Rollenmodell & Historische Urheber

- **Rollen vom globalen Personen-Pool getrennt (`src/utils/sharedState.js`, `src/components/PersonPickerModal.vue`)**
  - Personen werden im Pool nur noch als Stammdaten (`name`, `type`, `id`, `organization`, `email`) gespeichert – ohne feste Rolle.
  - Das Feld `type` (`person`, `organization`, `workshop`) bleibt im Personen-Pool erhalten und wird im XML als `<actorType>` (`person` / `organisation`) ausgegeben.
- **Einheitliche Zuweisungskomponente (`src/components/PersonAssignmentList.vue`)**
  - Ersetzt die bisherigen unterschiedlichen Tabellen und Quick-Bars in allen 4 Modulen durch eine einheitliche UI mit drei getrennten Modi:
    1. **Kulturgut (`historical`)**: Ausschließlich für historische Urheber:innen/Schöpfer:innen (z. B. Bildhauer, Architekt, Maler, Werkstatt). Enthält einen klaren Hinweis, dass das Feld bei unbekanntem Urheber leer bleibt.
    2. **Kontakte (`contact`)**: Moderne Ansprechpartner:innen (`Datenlieferant`, `Katalogisierer`, `Digitalisierungsbeauftragter`, `Kurator`) – vererbbar über alle Module.
    3. **Aktivität & 3D-Modell (`activity`)**: Unterstützt **Mehrfachrollen pro Person innerhalb derselben Kampagne** (z. B. gleichzeitig `Scan-Operator`, `3D-Modelleur` und `Postprocessing`) über Klick-Chips und eigene Rollen.
- **Sichtbarkeit in der Kulturgut-Übersicht (`src/output_components/HeritageAssetIdentificationCrud.vue`)**
  - Die Kulturgut-Tabelle zeigt nun eine eigene Spalte **„Urheber / Akteure“** inklusive der jeweils zugewiesenen Rollen als Badges.

---

## 2. Aktivität, 5-Dimensionen-DAP & CARARE-Reihenfolge

- **Digital Authenticity Profile (DAP) auf 5 Freitext-Dimensionen umgestellt (`src/components/ActivityParadata.vue`)**
  - Die bisherige Dimension 5 („Wissenschaftliche Begründung“) wurde entfernt; die bisherige Dimension 6 („Abbildungsbilanz“) ist nun **DAP-5**:
    - **DAP-1:** Materielle Spuren und Merkmale (Ausgangsbefund am Objekt)
    - **DAP-2:** Aufnahmeprozess und Erfassungsumfang
    - **DAP-3:** Geometrie-Bearbeitung
    - **DAP-4:** Textur, Shader und Material
    - **DAP-5:** Abbildungsbilanz
  - Jede Dimension besitzt genau **ein Freitextfeld** ohne kontrollierte Vokabular-Blöcke.
  - Die Pflichtfeld-Prüfung in `ActivityCrud.vue` prüft nun auf diese 5 Dimensionen.
- **Lineare Reihenfolge & sichtbare 3D-Verarbeitungsschritte (`src/output_components/ActivityCrud.vue`, `src/components/ActivityConsistsOf3D.vue`)**
  - Reihenfolge im Formular mit direkten Sprungankern aus der Seitenleiste:
    1. Basisangaben (`act-basics`)
    2. Beteiligte Personen & Rollen (`act-actors`)
    3. 3D-Digitalisierungsmethoden & Equipment (`act-3d`) – nicht mehr in einem eingeklappten Panel versteckt
    4. Verarbeitungs- & Teilschritte (`act-processing`, ohne DAP-Einträge vermischt anzuzeigen)
    5. Digital Authenticity Profile (`act-dap`)
- **CARARE-XML-Export & Re-Import (`src/App.vue`, `src/utils/carareXmlParser.js`)**
  - `normalizeActorsForXml` erzeugt `<actorType>` (`person` / `organisation`) und wiederholte `<roles>`-Tags pro Akteur.
  - Reguläre Verarbeitungs-`<consistsOf>`-Schritte werden im XML immer **vor** den 5 DAP-`<consistsOf>`-Blöcken ausgegeben; der XML-Parser liest wiederholte `<roles>`-Tags und die 5 DAP-Dimensionen beim Re-Import wieder sauber ein.

---

## 3. Zentrales Rechte-Modal & UI-Bereinigung

- **Zentrales Rechte-Formular (`src/components/RightsSettingsModal.vue`, `src/components/GlobalDefaultsBar.vue`)**
  - Neue zentrale Modal-Oberfläche mit Reitern für **Global (Standard)**, **Sammlung**, **Kulturgüter** und **3D-Modelle** sowie Schnellvorlagen (`CC-BY 4.0`, `CC0 1.0`, `CC-BY-SA 4.0`).
- **Sammlung: Räumliche Abdeckung & Statement (`src/output_components/CollectionInformationCrud.vue`)**
  - Die räumliche Abdeckung der Sammlung beschreibt nun den geografischen Ursprung / Kulturraum (`PlaceAutocomplete` + `SpatialMapPicker`) statt der Museumsadresse.
  - Doppeltes Sprach-Badge am `statement`-Feld entfernt; Titel-Verwaltung aufgeräumt (dauerhaft sichtbarer Papierkorb, kompakter `+ Weiterer Titel`-Button).
  - Rotes `✕`-Symbol in `InstitutionAutocomplete.vue` ohne doppeltes Auswahl-Badge.
- **Navigation, Modals & Dropdowns (`src/App.vue`, `src/components/LiveXmlPreview.vue`, Modals)**
  - Redundante Header-Elemente (doppelte Step-Pills, statisches `Ctrl+S`-Badge, doppelter GeoNames-Button) entfernt.
  - Linke Seitenleiste bietet direkte Baum-Navigation zu Untersektionen und einzelnen Kulturgütern/3D-Modellen.
  - Einheitliche abgedunkelte Modal-Backdrops (`bg-black/50 backdrop-blur-sm`) und behobene transparente Dropdown-Hintergründe in `LiveXmlPreview.vue`.
- **CARARE-Jargon aus Eingabeformularen entfernt**
  - Technische XML-Begriffe (`CARARE 2.0.6`, `<consistsOf>`, `<wasDigitizedBy>`, `<activity>`) wurden aus den Formulartexten und Badges entfernt (die technische Vorschau in `LiveXmlPreview.vue` bleibt davon unberührt).
- **Zukunftsdaten-Sperre**: Alle Kalenderfelder (`type="date"`) erzwingen `:max="maxDate"`.

---

## 4. Usability-Verbesserungen für die Museumspraxis

- **Fixierte Speichern-Leiste (`sticky bottom-0`) in allen 4 Modulen**
  - Die Aktionsleiste mit **Speichern / Abbrechen / Neuer Datensatz** bleibt beim Scrollen immer am unteren Bildschirmrand sichtbar.
- **Automatisches Aufklappen bei Validierungsfehlern (`handleInvalid`)**
  - Wenn ein Pflichtfeld in einem eingeklappten Bereich fehlt, öffnet HERMES beim Klick auf Speichern automatisch alle übergeordneten `<details>`-/`.collapse`-Bereiche und scrollt direkt zum betroffenen Feld.
- **Automatische `recordInformation.id`-Ableitung**
  - Bleibt `recordInformation.id` leer, wird es beim Speichern automatisch aus der Objekt-/Inventar-ID (`appellation.id`) oder einer generierten ID (`HA-...`, `DR-...`, `ACT-...`) befüllt.
- **Direkter `🎯 +3D`-Shortcut am Kulturgut**
  - In der Kulturgut-Tabelle öffnet ein Klick auf `🎯 +3D` direkt ein neues 3D-Modell mit automatisch vorausgefülltem Namen (`3D-Modell: ...`) sowie gesetzten Verknüpfungen (`isRepresentationOf` und `wasDigitizedBy`).
- **3D-Datei-Inspektor-Dropzone (`src/components/DigitalResource3DMetadata.vue`)**
  - `.glb`, `.gltf`, `.obj`, `.ply` und `.stl` können per Drag & Drop abgelegt werden; Dateigröße, Format sowie (bei `.obj` und `.stl`) Polygon- und Vertex-Anzahl werden lokal ausgelesen.
- **Klare Unterscheidung von UI-Sprache, Metadatensprache & Export-Status**
  - Der Header-Umschalter ist explizit mit **`UI`** beschriftet; in der Global-Leiste steht klar **`Metadaten-Sprache (xml:lang)`**.
  - Unter *Aktionen & Export* zeigt ein Status-Badge an, ob der Stand nur lokal im Speicher liegt (`Lokal gesichert`) oder wann zuletzt exportiert wurde (`✓ HH:MM`).
