# HERMES v0.1.6 – Änderungsbericht (Changelog & Nachvollziehbarkeit)

**Datum:** 13.11.2026  
**Commits:** `e4b27a2` (Änderungskonzept Phasen 1–3), `ce8a045` (Usability-Optimierungen), `49a968e` (Layout, Kontrast & Lokalisierung), `6f0816d` (Globale Leiste, Source/Spatial, GLB & Rechte-Ausblendung), `4f65b94` (Feedbackloop Philippe: Pools, Temporal & Spatial)  
**Release-Paket:** `HERMES_Windows_Release_Package/` (`HERMES.exe`, `hermes_0.1.6_x64-setup.exe`, `hermes_0.1.6_x64_en-US.msi`)

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

---

## 5. Layout-, Kontrast- & Lokalisierungskorrekturen (`49a968e`)

- **Überlaufende Boxen & Buttons behoben (`src/style.css`, `src/App.vue`, CRUD-Komponenten)**
  - `.input`, `.select`, `.textarea`, `.grid > *` und `.form-control` auf `min-width: 0; max-width: 100%` gesetzt.
  - Buttons (`.btn`) erlauben nun sauberen Zeilenumbruch (`white-space: normal; height: auto`), damit längere deutsche und englische Beschriftungen nicht mehr aus schmalen Karten herauslaufen.
  - Karten-Container auf `overflow-x-clip` umgestellt, damit `sticky`-Speichern-Leisten korrekt funktionieren.
- **Kontrast von Warnfarben im hellen Theme verbessert (`src/style.css`, `src/App.vue`)**
  - Im Theme `corporate` nutzen `.text-warning`, `.badge-warning`, `.btn-warning` und `.text-accent` nun kontraststarke Amber-/Orange-Töne (`#b45309`, `#92400e`, `#c2410c`) statt schwer lesbarem Gelb.
- **DE/EN-Lokalisierung vereinheitlicht (`src/App.vue`, `src/components/PersonAssignmentList.vue`, `src/components/RightsSettingsModal.vue`, `src/components/DigitalResource3DMetadata.vue`, CRUDs)**
  - Gemischte Texte (z. B. `ODER / OR` -> `OR` / `ODER`) und fehlende Übersetzungsschlüssel (`actions` / `Aktionen`) sauber getrennt.

---

## 6. Globale Leiste, Rechte-Ausblendung, Source/Spatial-Fix & GLB-Parsing (`6f0816d`)

- **Globale Leiste oben angedockt & Sammlung-Pool entfernt (`src/components/GlobalDefaultsBar.vue`, `src/App.vue`)**
  - `GlobalDefaultsBar` bleibt oben fixiert sichtbar und scrollt nicht mehr aus dem Blickfeld.
  - Der Button/Modal-Zugriff für „Sammlungen“ (`Collections`) wurde aus der globalen Leiste entfernt.
- **Inline-Rechteformulare ausgeblendet (`src/App.vue`, `src/output_components/HeritageAssetIdentificationCrud.vue`, `src/output_components/DigitalResourceCrud.vue`)**
  - Die Rechte-Abschnitte und -Hinweise wurden aus der linken Workflow-Seitenleiste und den Inline-Formularen entfernt; die Rechtepflege erfolgt zentral über **Rights & Licenses Management** (CARARE-XML-Export bleibt vollständig erhalten).
- **Workflow-Box-Überlauf behoben (`src/style.css`)**
  - `.menu`, `.menu li` und `.menu li > *` auf `min-width: 0; max-width: 100%` begrenzt, damit die linke Workflow-Liste nicht mehr überläuft.
- **Collection Information: `Source` vs. `Spatial` getrennt (`src/output_components/CollectionInformationCrud.vue`)**
  - Bei Auswahl einer Institution über den Organisations-Pool wird nicht mehr `applyOrgToSpatial(org)` aufgerufen – `Source` landet wieder sauber im `source`/Kontext-Bereich und überschreibt nicht mehr `coverage.spatial`.
  - Bei Auswahl über die Autocomplete-Suche werden Adress-/Ortsdaten (`city`, `country`, `gnd`, `uri`) über `recordRecentOrganization` vollständig mitübernommen.
- **GLB-Polygon- & Vertex-Auslesung (`src/components/DigitalResource3DMetadata.vue`)**
  - Die 3D-Datei-Dropzone parst nun auch binäre `.glb`-Dateien (JSON-Chunk-Header) zur automatischen Ermittlung von Polygon- und Vertex-Zahlen.
- **XML-Editor standardmäßig ausgeblendet (`src/App.vue`)**
  - Die Live-XML-Vorschau ist beim Start standardmäßig ausgeschaltet und wird bei Bedarf über den Toggle eingeblendet.

---

## 7. Feedbackloop Philippe: Pools, Temporal & Spatial vereinheitlicht (`4f65b94`)

- **Persons-Pool (`src/components/PersonPickerModal.vue`)**
  - Titel in **`Manage Persons`** / **`Personen verwalten`** umbenannt; die drei Filter-Chips (`All`, `Persons`, `Organizations`) entfernt.
  - Im Erstellen-/Bearbeiten-Formular das `Type`-Dropdown entfernt (`formData.type` bleibt intern `"person"`) und `Name / Institution` in **`Name`** umbenannt.
  - Schließen über `✕` repariert (`cancelEditForm` ruft `resetFormData()` auf).
  - Padding-Fehler beim ersten Eintrag behoben (`divide-y divide-base-200` und `pt-2 first:pt-0` entfernt), sodass alle Einträge einheitlich im Card-Stil (`p-3.5 rounded-xl border`) erscheinen.
- **Organizations-Pool (`src/components/OrganizationPickerModal.vue` & Picker-Buttons)**
  - `Recently used`-Leiste entfernt und Papierkorb-Emoji durch das einheitliche SVG-Icon ersetzt.
  - `Select` / `Auswählen`-Button und Zeilen-Klickauswahl werden nur noch bei `mode !== 'manage'` angezeigt (nicht beim Aufruf über den globalen Header-Button).
  - Button **`Clear All`** / **`Alle löschen`** (`clearAllOrganizations()`) im Footer ergänzt.
  - Alle Picker-Buttons in `PersonAssignmentList.vue`, `CollectionInformationCrud.vue`, `HeritageAssetIdentificationCrud.vue`, `DigitalResourceCrud.vue` und `ActivityCrud.vue` einheitlich auf **`Pick Organizations`** (EN) / **`Organisation wählen`** (DE) umbenannt.
- **Temporal & Spatial in allen 3 CRUDs vereinheitlicht (`src/components/TemporalSection.vue`, `src/components/SpatialSection.vue`)**
  - Neue wiederverwendbare Komponenten `TemporalSection.vue` und `SpatialSection.vue` mit Mehrfacheinträgen, einheitlicher Übersichtstabelle, **`Add Temporal`**- bzw. **`Add Spatial`**-Button und zentriertem `<dialog class="modal">` (statt rechtem Seiten-Drawer).
  - Direkt freiliegende Time-Span- und Spatial-Felder in `CollectionInformationCrud.vue` entfernt; alle drei Module (`CollectionInformationCrud.vue`, `HeritageAssetIdentificationCrud.vue`, `ActivityCrud.vue`) nutzen nun dieselbe UI und Mehrfach-Datenhaltung.
  - Guard `hasSpatialArr` in `src/App.vue` ergänzt, damit das Collection-Fallback Array-Einträge in `coverage.spatial` nicht überschreibt.

---

## 8. Header-Titel, 3D-Name-Fix, Lesbarkeit & Repo-Konsolidierung

- **Gesamtüberschrift im Header (`src/App.vue`)**
  - Neben dem `ΗΕΡΜΗΣ`-Logo werden nun **`HERMES`** (`v0.1.6`) und der zweisprachige Untertitel (*CARARE 2.0.6 Metadaten-Editor für 3D-Kulturgut* / *CARARE 2.0.6 Metadata Editor for 3D Cultural Heritage*) angezeigt.
- **Kryptische JSON-Anzeige bei `DigitalResourceCrud -> Name` behoben (`src/output_components/DigitalResourceCrud.vue`)**
  - `appellation.name` wird nun wie bei Aktivität und Kulturgut als mehrsprachiges Objekt-Array (`_value`, Sprachflaggen-Dropdown, Preferred-Stern) gerendert, statt das rohe JSON-Objekt `{ "_value": "", ... }` anzuzeigen.
- **Kontrast der `⚠️ Not available yet`-Hinweisboxen (`ActivityDcRelations.vue`, `DigitalResourceDcRelations.vue`, `HeritageAssetDcRelations.vue`)**
  - Gelbe `text-warning`-Schrift auf hellem Hintergrund wurde auf `text-base-content/90` mit `bg-amber-500/10 border-amber-500/35` umgestellt.
- **3D-Datei-Inspektor-Hinweis erweitert (`src/components/DigitalResource3DMetadata.vue`)**
  - Hinweis ergänzt, dass das Auslesen von `.glb`/`.obj`/`.stl` je nach Dateigröße etwas dauern kann.
- **DE/EN-Lokalisierung nachgezogen**
  - Hartcodierte englische Strings (`Set as preferred`, `Enter valid value`, `Open Link`) in `ActivityCrud.vue`, `CollectionInformationCrud.vue`, `DigitalResourceCrud.vue`, `HeritageAssetIdentificationCrud.vue`, `ActivityDcRelations.vue` und `DigitalResourceDcRelations.vue` zweisprachig gemacht.
- **Repository aufgeräumt & konsolidiert**
  - Doppelte Assets/Handbuch-Kopien im Root-Verzeichnis entfernt (liegen zentral in `public/`).
  - Generator- & Testskripte nach `scripts/` und ältere Konzepte/Berichte nach `docs/` verschoben.
  - `HERMES_Windows_Release_Package/` auf die in `LIESMICH.txt` dokumentierten Paketnamen (`HERMES.exe`, `HERMES_Setup_v0.1.6.exe`, `HERMES_Installer_v0.1.6.msi`, `HERMES_Handbuch_Manual.html`) konsolidiert.



