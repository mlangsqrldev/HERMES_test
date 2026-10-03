# HERMES — Umsetzungsbericht: Fehlerbehebungen & UX-Optimierungen (v0.1.4 → v0.1.5)

**Datum:** 30.09.2026  
**Referenz:** `HERMES 0.1.4 — Fehlerbericht (UX / Eingabeformular)` & `HERMES_UI_Texte_kompiliert_v8.xlsx`  
**Testumgebungen:** Windows 10 (nativ) & Linux (Wine / Bottles)  
**Build-Status:** Erfolgreich kompiliert (`npm run build` fehlerfrei)

---

## 1. Ticket-Übersicht & Umsetzungsstatus

| Ticket | Bereich | Typ | Status | Kurzbeschreibung der Lösung |
|---|---|---|---|---|
| **DEF-01** | Global | Defekt | **Behoben** | Formular leert sich nach Speichern nicht mehr; Datensatz bleibt im Bearbeitungsmodus; Neuer Datensatz via Button. |
| **DEF-02** | Global | Defekt | **Behoben** | Klick auf Sprachflagge/Stern/Hilfe leert Formular nicht mehr (`type="button"` für alle internen Buttons ergänzt). |
| **DEF-03** | Global | UX | **Behoben** | DaisyUI 5 Validierungshinweise (`t('validationHint')`) von optionalen Feldern entfernt. |
| **DEF-04** | Global | Defekt | **Behoben** | Vorlagen: Überschreiben bei Namensgleichheit statt Duplikaten; persistente Speicherung über Neustarts hinweg. |
| **DEF-05** | Global | Defekt | **Behoben** | Seitenleisten-Checkliste hakt Datensatzinformationen bei Eingabe von ID, Quelle und Land verlässlich ab. |
| **COL-01** | Collection | UX / Schema | **Behoben** | Zeitliche Abdeckung akzeptiert negative Jahreszahlen / v. Chr. (z. B. `-330`) und normalisiert diese nach ISO 8601. |
| **TPL-01** | Collection | UX | **Behoben** | Einheitliche Aktionsleiste mit Speichern, Status-Badge und "+ Neuer Datensatz" am Formularende ergänzt. |
| **HAI-01** | Heritage Asset | UX | **Behoben** | Akteurs-/Kontaktdrawer: Fehlerhafte Validierung entfernt; Datalist für Standard-Rollenhinweise ergänzt. |
| **HAI-02** | Heritage Asset | Schema / UX | **Behoben** | Mehrsprachige Titel/Namen mit Sprachcode & Bevorzugt-Stern; XML-Export serialisiert `xml:lang` und `preferred`. |
| **HAI-03** | Heritage Asset | UX / Schema | **Behoben** | Datierungsfelder unterstützen v. Chr. / negative Jahreszahlen analog zu COL-01. |
| **HAI-04** | Heritage Asset | UX / Schema | **Behoben** | Maße: Maßstab ist optional; Wert akzeptiert Dezimal-Kommata (`12,5` → `12.5`). |
| **HAI-05** | Heritage Asset | UX | **Behoben** | Maße-Tabelle zeigt alle relevanten Attribute (Umfang, Typ, Wert, Einheit, Maßstab) an. |
| **HAI-06** | Heritage Asset | UX | **Behoben** | Räumliche Angaben: Benannter Ort, Verwaltungseinheit und Koordinaten `(Y, X)` in Tabelle sichtbar. |
| **DR-01** | Digital Resource| Defekt | **Behoben** | Checklisten-Aktivierung in Seitenleiste synchronisiert (gelöst über DEF-05). |
| **DR-02** | Digital Resource| UX / Schema | **Behoben** | Standardisierte Creative-Commons- und Rechtehinweis-Auswahl integriert. |
| **ACT-01** | Activity | Konzept | **Vorbereitet** | AAT-Vokabular für Maßnahmentypen als kontrolliertes Vokabular vorbereitet. |
| **ACT-02** | Activity | UX | **Behoben** | Label `temporal.periodName` von „Epochenname“ zu „Zeitraum der Maßnahme“ präzisiert. |
| **ACT-03** | Activity | Schema / UX | **Behoben** | Mehrsprachige Bezeichnung der Maßnahme mit Sprachcode und Bevorzugt-Flag; CARARE-XML-Export angepasst. |

---

## 2. Detaillierte Beschreibung der Änderungen

### A · Übergreifende Funktionsdefekte

#### `DEF-01` — Formularzustand nach dem Speichern erhalten
- **Problem:** Nach Klick auf „Speichern“ wurde `resetForm()` ausgeführt. Dadurch wirkte das Formular gelöscht und ein Weiterschreiben oder Korrigieren war unmöglich.
- **Lösung:**
  - `save()` leert das Formular nicht mehr.
  - Der Datensatz verbleibt im Zustand `isEditing = true` mit `editIndex = items.length - 1`.
  - Eine grüne Erfolgsmeldung (`saveSuccessBadge`) signalisiert optisch das erfolgreiche Speichern.
  - Das Formular kann explizit über den neuen Button **„+ Neuer Datensatz“** oder „Abbrechen“ geleert werden.

#### `DEF-02` — Ungewolltes Absenden/Leeren durch Buttons ohne Typangabe
- **Problem:** Buttons innerhalb von `<form>`-Tags ohne expliziten Typ interpretiert der HTML-Standard als `type="submit"`. Ein Klick auf Sprachflaggen, Bevorzugt-Sterne, Tooltip-Icons oder Drawer-Buttons löste unbemerkt das Absenden des Formulars aus.
- **Lösung:** 
  - Mehr als 290 Buttons in allen Formularen und Drawern wurden mit explizitem `type="button"` versehen.

#### `DEF-03` — Beseitigung unübersetzter DaisyUI 5 Validierungsmeldungen
- **Problem:** Optionale Felder zeigten im leeren Zustand oder bei Fokus rote Ränder und den englischen Pseudotext `t('validationHint')`.
- **Lösung:**
  - Klassen `.validator` und Kind-Elemente `.validator-hint` von rein optionalen Feldern entfernt.
  - Validierungsanzeigen greifen nur noch bei echten Pflichtfeldern oder semantisch ungültigen Formaten.

#### `DEF-04` — Robuste Vorlagen-Persistenz & Duplikat-Verhinderung
- **Problem:** Gleiche Vorlagennamen führten zu Duplikaten in der Liste; Vorlagen gingen bei Neustarts in bestimmten Laufzeitumgebungen (Wine/Bottles) verloren.
- **Lösung:**
  - `addTemplate` prüft auf bestehende Namen und überschreibt diese sauber.
  - Redundante Sicherung: Neben dem Tauri-Store wird jede Vorlagenänderung zusätzlich synchron in `localStorage` (`hermes_templates_<module>_...`) abgelegt und beim Start geladen.

#### `DEF-05` & `DR-01` — Zuverlässige Status-Checkliste in der Seitenleiste
- **Problem:** Der Haken für „Datensatzinformationen“ erschien trotz ausgefüllter ID nicht, da das Schema optionale Kind-Felder (`recordInformation.creation.contacts.organization`) fälschlicherweise als Pflichtprüfung im Formularbaum auswertete.
- **Lösung:**
  - `checkFilled` in `src/App.vue` angepasst: Für „Datensatzinformationen“ werden die primären Identifikatoren (`id`, `source`, `country`) geprüft; leere optionale Sub-Arrays blockieren den Status nicht mehr.

---

### B · Modulspezifische Verbesserungen

#### 1. Collection Information (`src/output_components/CollectionInformationCrud.vue`)
- **`COL-01` (Negative Jahreszahlen):**
  - Regex für Datums- und Jahresfelder erweitert: `^(-?[0-9]{1,})(?:-(0[1-9]|1[0-2])(?:-(0[1-9]|[12][0-9]|3[01]))?)?$`.
  - Negative Eingaben (z. B. `-330` v. Chr.) werden akzeptiert und über `normalizeYearDate()` ISO-8601-konform aufbereitet (z. B. `-0330`).
- **`TPL-01` (Aktionsleiste):**
  - Feste Aktionsleiste am Ende des Hauptformulars ergänzt mit „Speichern“, Erfolgs-Badge und „+ Neuer Datensatz“.

#### 2. Heritage Asset Identification (`src/output_components/HeritageAssetIdentificationCrud.vue`)
- **`HAI-01` (Kontakte / Akteure):**
  - Fehlerhafte Validierung im Akteurs-Drawer entfernt.
  - Vorschlagsliste `<datalist id="actor-roles-list">` für Standardrollen (Finder, Ausgräber, Eigentümer, Autor, Restaurator etc.) integriert.
- **`HAI-02` (Mehrsprachigkeit & XML-Export):**
  - Sprachauswahl (DE, EN, FR, IT, ES) und Bevorzugt-Stern für Bezeichnungen integriert.
  - In `src/App.vue` serialisiert `exportToCarareXML` die Metadaten direkt als `xml:lang="..."` und `preferred="true|false"` in das CARARE-XML `<name>`.
- **`HAI-03` (Datierung v. Chr.):**
  - Analog zu `COL-01` volle Unterstützung negativer Jahreszahlen in temporalen Angaben.
- **`HAI-04` & `HAI-05` (Maße & Dimensionen):**
  - Maßstab (`scale`) ist nun optional.
  - Messwert (`value`) akzeptiert Kommata (z. B. `12,5`) und wandelt sie automatisch in ISO-Dezimalpunkte (`12.5`) um.
  - Maße-Tabelle zeigt Umfang, Messtyp, Wert, Einheit und Maßstab übersichtlich an.
- **`HAI-06` (Räumliche Angaben):**
  - Tabelle für räumliche Angaben stellt benannte Orte, Verwaltungseinheiten und Koordinaten-Paare `(Y, X)` vollständig dar.

#### 3. Digital Resource (`src/output_components/DigitalResourceCrud.vue`)
- **`DR-02` (Lizenzen / CC-Auswahl):**
  - Dropdown für Creative-Commons-Lizenzen (CC0, CC BY, CC BY-SA, CC BY-NC, Public Domain Mark etc.) mit standardisierten URIs hinterlegt.
- **Aktionsleiste & Status:**
  - Status-Feedback und neuer Datensatz-Workflow analog vereinheitlicht.

#### 4. Activity (`src/output_components/ActivityCrud.vue`)
- **`ACT-02` (Präzisierung Zeitraum):**
  - Feld `temporal.periodName` von „Epochenname“ zu **„Zeitraum der Maßnahme“** umbenannt.
- **`ACT-03` (Mehrsprachige Bezeichnung):**
  - Titel der Maßnahme unterstützt Sprachcodes und Bevorzugt-Status inklusive XML-Export (`xml:lang` & `preferred`).
- **Temporale Abdeckung:**
  - Unterstützung negativer Datumsformate für archäologische Maßnahmen vor unserer Zeitrechnung.

---

### C · Neu integrierte Hilfskomponenten

1. **`src/components/FlagIcon.vue`:**
   - Vektorbasierte Inline-SVG-Flaggen für `DE`, `EN`, `FR`, `IT`, `ES` und `UN`.
   - Löst das Problem fehlender oder fehlerhafter Flaggen-Emojis unter Windows 10 und Wine.

2. **`src/components/PlaceAutocomplete.vue`:**
   - Differenzierte Datenquellen für Ortsvorschläge:
     - **Wikidata:** für ISIL-Institutions- und Standort-IDs.
     - **GeoNames:** für moderne Verwaltungseinheiten und Orte.
     - **Pleiades:** für historische und archäologische Fundplätze der Antike.

---

## 3. Geänderte Dateien

- `src/App.vue` — Checklisten-Validierungslogik (`DEF-05`, `DR-01`) & CARARE-XML-Attribut-Export (`HAI-02`, `ACT-03`).
- `src/output_components/CollectionInformationCrud.vue` — `COL-01`, `TPL-01`, `DEF-01`, `DEF-02`, `DEF-04`.
- `src/output_components/HeritageAssetIdentificationCrud.vue` — `HAI-01` bis `HAI-06`, `DEF-01` bis `DEF-04`.
- `src/output_components/DigitalResourceCrud.vue` — `DR-01`, `DR-02`, `DEF-01`, `DEF-02`, `DEF-04`.
- `src/output_components/ActivityCrud.vue` — `ACT-02`, `ACT-03`, `DEF-01`, `DEF-02`, `DEF-04`.
- `src/components/FlagIcon.vue` — Neues Vektor-Flaggen-Element.
- `src/components/PlaceAutocomplete.vue` — Autocomplete-Differenzierung.

---

## 4. Ausblick & Nachbereitung
- **Vokabulareinbindung (`ACT-01`, `ACT-04`):** Getty AAT für Maßnahmentypen und LOC-FDD / PRONOM für Dateiformate folgen im nächsten Schritt bei der Anbindung kontrollierter Vokabulare.
