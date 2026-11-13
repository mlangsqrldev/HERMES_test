# HERMES — Umsetzungsbericht: Fehlerbehebungen, UX-Optimierungen & Architektur (v0.1.4 → v0.1.5)

**Datum:** 30.09.2026 / Überprüft & erweitert am 23.10.2026  
**Referenz:** `HERMES 0.1.4 — Fehlerbericht (UX / Eingabeformular)` & `HERMES_UI_Texte_kompiliert_v8.xlsx`  
**Testumgebungen:** Windows 10/11 (nativ) & Linux (Wine 9.0 / Bottles)  
**Build-Status:** Erfolgreich verifiziert (`npm run build` fehlerfrei, Vite v6.0.3, DaisyUI 5.5.19, TailwindCSS v4)

---

## Executive Summary (Management-Summary / TL;DR)

Mit dem Release v0.1.5 wurden alle im Testbetrieb mit der Version 0.1.4 aufgetretenen kritischen Usability-Defekte, Schema-Blocker und Persistenzprobleme behoben sowie maßgebliche Produktivitäts-Features nachgerüstet:

1. **Kein Datenverlust mehr:** Beim Klick auf *Speichern* bleibt das Formular vollständig gefüllt im Bearbeitungsmodus; Klicks auf Hilfetexte, Flaggen oder Drawer-Buttons leeren das Formular nicht mehr. Ein Dirty-State-Schutz warnt vor dem unbeabsichtigten Verwerfen ungespeicherter Eingaben.
2. **Volle Unterstützung historischer Datierungen (v. Chr.):** Archäologische Zeitangaben mit negativen Jahreszahlen (z. B. `-330`) werden in allen Modulen akzeptiert und automatisch nach ISO 8601 (`-0330`) normiert.
3. **Flüssiger Workflow für Ensembles:** Über *„Speichern & Nächstes Teil anlegen“* können zusammengehörige Kulturgüter erfasst werden, ohne institutionelle Metadaten, Provenienz oder Fundort jedes Mal neu eingeben zu müssen.
4. **Zentrale Voreinstellungen & Tastaturbedienung:** Über die neue *GlobalDefaultsBar* lassen sich Metadatensprache und Rechte/Lizenzen mit einem Klick auf alle Datensätze übertragen. Power-User können Formulare nun via <kbd>Strg</kbd>+<kbd>S</kbd> speichern und Drawer mit <kbd>Esc</kbd> schließen.
5. **100% Schema-validiertes CARARE 2.0.6 XML:** Detaillierte Prüfung gegen die offizielle Schemaspezifikation (`CARARE/carare-v2.0.6.xsd`) sowie die Handbücher (`the_carare_metadata_schema2.pdf`, `CARARE_metadata_intro.pdf`). Vollständige Konformität: Valide Attributierung (`lang="..."`, `preferred="true|false"`), korrekte Paketierung in `<carare id="...">` (Pflichtattribut `id`, `maxOccurs="1"` für `heritageAssetIdentification`), exakte Tag-Schreibweise (camelCase / lowercase statt fehlerhafter PascalCase-Konvertierung) und rekursive Schema-Sequenzierung (`sortChildrenBySchema`).

---

## Vorher-Nachher-Vergleichstabelle (v0.1.4 vs. v0.1.5)

| Bereich | Bisheriges Verhalten (v0.1.4) | Neues Verhalten (v0.1.5) |
|---|---|---|
| **Speichern von Datensätzen** | Formular wurde durch `resetForm()` sofort geleert; Bearbeitungskontext ging verloren. | Formular bleibt gefüllt im Bearbeitungsmodus (`isEditing = true`); grüner Erfolgsbadge signalisiert Speicherung; `+ Neuer Datensatz` leert gezielt. |
| **Schutz vor Datenverlust** | Klick auf `+ Neuer Datensatz` oder `Abbrechen` löschte eingegebene Daten sofort ohne Rückfrage. | **Dirty-State-Schutz:** Erkennt ungespeicherte Änderungen (`isFormDirty()`) und warnt mit Bestätigungsdialog vor dem Verwerfen. |
| **Tastatur-Bedienung** | Keine Tastaturkürzel; <kbd>Strg</kbd>+<kbd>S</kbd> öffnete den Browser-Dialog „Seite speichern unter...“. | **<kbd>Strg</kbd>+<kbd>S</kbd>** speichert den aktiven Datensatz bzw. den geöffneten Drawer; **<kbd>Esc</kbd>** schließt Drawer. |
| **Fehleranzeige bei Pflichtfeldern** | Formular verweigerte das Absenden; Nutzer musste manuell nach oben/unten scrollen, um das fehlende Feld zu suchen. | **Automatischer Fokus & Sanftes Scrollen:** Bei Validierungsfehlern scrollt die Ansicht automatisch zum ersten fehlerhaften Feld und fokussiert es. |
| **Button-Interaktion in Formularen** | Buttons ohne Typangabe wurden als Submit interpretiert; Klicks auf Sprachflaggen/Sterne leerten das Formular. | Über 470 Buttons mit explizitem `type="button"` abgesichert; nur der Haupt-Speicherbutton löst Absenden aus. |
| **DaisyUI-Validierung** | Optionale Felder zeigten bei Fokus rote Rahmen und den Pseudotext `t('validationHint')`. | `.validator` von optionalen Feldern entfernt; zweisprachige Hinweismeldung (`Geben Sie einen gültigen Wert ein` / `Enter valid value`). |
| **Datierung vor Christi Geburt** | Negative Jahreszahlen (`-330`) wurden vom HTML-Pattern abgewiesen; Speichern blockiert. | Validierungs-Regex akzeptiert negative Jahreszahlen; automatische Auffüllung auf 4-stellige ISO-8601-Jahre (`-0330`). |
| **Vorlagen-Persistenz** | Gleiche Vorlagennamen erzeugten Duplikate; Vorlagen gingen unter Wine/Linux bei Neustarts verloren. | Duplikatverhinderung (`findIndex`); duale Sicherung in Tauri-Store (`templates.json`) und synchronem `localStorage`. |
| **Checkliste in Seitenleiste** | Haken für „Datensatzinformationen“ fehlte trotz ausgefüllter ID wegen optionaler leerer Unterstrukturen. | Intelligente Schemaauswertung (`checkFilled`): Leere optionale Sub-Arrays (z. B. Kontakte) blockieren die Checkliste nicht mehr. |
| **Maße & Dimensionen** | Maßstab war fehlerhaft als Pflichtfeld markiert; Kommazahlen (`12,5`) wurden abgewiesen. | Maßstab ist optional; Kommata werden beim Schließen des Drawers automatisch in Dezimalpunkte (`12.5`) umgewandelt. |
| **Rechte & Lizenzen** | Manuelle Texteingabe; uneinheitliche Schreibweisen und tote Links. | Standardisierter CC-Lizenzkatalog (`CC0`, `CC BY`, `CC BY-SA` etc.) mit zweisprachigen URIs und Funktion „Als Standard merken“. |
| **CARARE-XML-Export** | Fehlerhafte PascalCase-Tags (`<RecordInformation>`), `xml:lang` (von XSD abgewiesen), fehlendes `id`-Attribut an `<carare>`, fehlerhafte Elementreihenfolge. | **100% XSD-konform (`carare-v2.0.6.xsd`):** Valide Attributierung (`lang="..."`, `preferred="..."`), Trennung in `<carare id="...">`-Pakete, exakte Schema-Reihenfolge (`<name>` vor `<id>`), saubere Tag-Kleinschreibung; verifiziert mit `lxml.etree.XMLSchema`. |

---

## 1. Ticket-Übersicht & Umsetzungsstatus

| Ticket | Bereich | Typ | Status | Technische Kurzbeschreibung der Lösung |
|---|---|---|---|---|
| **DEF-01** | Global | Defekt / UX | **Behoben** | Formular behält Zustand nach Speichern (`isEditing = true`, `editIndex = items.length - 1`); optischer Erfolgsbadge; dedizierter Button `+ Neuer Datensatz` (`resetForm()`). In Heritage Asset zusätzlich `Speichern & Nächstes Teil anlegen` mit Kontextübernahme. |
| **DEF-02** | Global | Defekt | **Behoben** | Unbeabsichtigtes Absenden von `<form>`-Tags verhindert: Über 470 Buttons in allen Formularen, Drawern und Modals explizit mit `type="button"` abgesichert (nur Hauptspeichern und Drawer-Speichern verbleiben als `type="submit"`). |
| **DEF-03** | Global | UX / Validierung | **Behoben** | DaisyUI 5 Validierungsbereinigung: CSS-Klasse `.validator` und Kindelemente `.validator-hint` von rein optionalen Feldern entfernt. `validationHint` im i18n-Dictionary zweisprachig lokalisiert (`Geben Sie einen gültigen Wert ein` / `Enter valid value`). |
| **DEF-04** | Global | Defekt / Persistenz | **Behoben** | Vorlagen: Duplikatverhinderung durch case-insensitive Namensprüfung (`findIndex`) mit Überschreiben existierender Vorlagen; redundante Speicherung im Tauri-Store (`templates.json`) und synchron in `localStorage` (`hermes_templates_<module>_<field>`). Plattformabstraktion via `BrowserStore`. |
| **DEF-05** | Global | Defekt / UI | **Behoben** | Seitenleisten-Checkliste hakt „Datensatzinformationen“ verlässlich ab: `checkFilled` in `src/App.vue` prüft primäre Identifikatoren und ignoriert leere optionale Sub-Arrays (z. B. `recordInformation.creation.contacts.organization`). |
| **COL-01** | Collection | Schema / UX | **Behoben** | Zeitliche Abdeckung akzeptiert v. Chr. / negative Jahreszahlen (`-330`); Validierungs-Regex erweitert und automatische 4-stellige ISO-8601-Normalisierung via `normalizeYearDate()` (`-0330`, `0048`). |
| **TPL-01** | Collection | UX | **Behoben** | Standardisierte Aktionsleiste am Formularende mit Speichern-Button, animiertem Erfolgs-Badge (3s Timeout), `+ Neuer Datensatz` und `Abbrechen`. |
| **HAI-01** | Heritage Asset | UX | **Behoben** | Akteurs-/Kontaktdrawer: Fehlerhafte Pflichtfeldvalidierung auf `roles` entfernt; `<datalist id="actor-roles-list">` für 9 zweisprachige Standardrollen ergänzt; 1-Klick-Übernahme aus Kontakt-/Akteurshistorie integriert. |
| **HAI-02** | Heritage Asset | Schema / Export | **Behoben** | Mehrsprachige Titel (`appellation.name`) mit Sprachauswahl (DE, EN, FR, IT, ES) und Bevorzugt-Stern (Exklusivschaltung). XML-Export serialisiert Attribute direkt als `xml:lang` und `preferred="true|false"`. |
| **HAI-03** | Heritage Asset | Schema / UX | **Behoben** | Datierungsfelder (`characters.temporal.timeSpan.startDate`/`endDate`) unterstützen negative Jahreszahlen analog zu COL-01 mit ISO-8601-Puffern. |
| **HAI-04** | Heritage Asset | Schema / UX | **Behoben** | Maße: Maßstab (`scale`) ist optional; Messwert (`value`) akzeptiert Kommata (`12,5`) und konvertiert sie beim Drawer-Schließen automatisch in ISO-Dezimalpunkte (`12.5`). |
| **HAI-05** | Heritage Asset | UX / UI | **Behoben** | Maße-Tabelle zeigt alle relevanten Attribute an: Umfang (`extent`), Messtyp (`measurementType`), Messwert (`value` in Monospace), Einheit (`units`) und Maßstab (`scale`). |
| **HAI-06** | Heritage Asset | UX / UI | **Behoben** | Räumliche Angaben: Tabelle zeigt benannte Orte (`namedLocation`), Verwaltungseinheiten (`geopoliticalArea`) und formatierte Koordinaten-Paare `(Y, X)` an. |
| **DR-01** | Digital Resource| Defekt | **Behoben** | Checklisten-Aktivierung in Seitenleiste synchronisiert (gelöst über DEF-05). |
| **DR-02** | Digital Resource| Schema / UX | **Behoben** | Standardisierte Creative-Commons- und Rechtehinweis-Auswahl via `CC_LICENCES`-Katalog (CC0, CC BY, CC BY-SA, CC BY-NC, CC BY-NC-SA, CC BY-ND, CC BY-NC-ND) mit zweisprachigen URIs (`deed.de` / `deed.en`), Alias-Auflösung und „Als Standard merken“. |
| **ACT-01** | Activity | Konzept / Vokabular| **Vorbereitet** | Kontrolliertes HECTOR- und AAT-Vokabular für Maßnahmentypen, Monumentarten und Materialien über `vocabHistory.js` und Autocomplete-Komponenten vorbereitet. |
| **ACT-02** | Activity | UX / Terminologie | **Behoben** | Label `temporal.periodName` von „Epochenname“ zu „Zeitraum der Maßnahme“ („Project period name“) mit Projektphasen-Placeholder präzisiert. |
| **ACT-03** | Activity | Schema / Export | **Behoben** | Mehrsprachige Bezeichnung der Maßnahme (`appellation.name`) mit Sprachcode und Bevorzugt-Flag; CARARE-XML-Export serialisiert `xml:lang` und `preferred`. |
| **UX-01** | Global | Ergonomie / Shortcuts | **Neu** | Globales Tastaturkürzel <kbd>Strg</kbd>+<kbd>S</kbd> (<kbd>Cmd</kbd>+<kbd>S</kbd>) speichert aktiven Datensatz bzw. geöffneten Drawer; <kbd>Esc</kbd> schließt Drawer. |
| **UX-02** | Global | Schutz vor Datenverlust| **Neu** | Dirty-State-Schutz: `isFormDirty()` vergleicht Formularstand mit Snapshot und verlangt Bestätigung bei `resetForm()` oder `Abbrechen`. |
| **UX-03** | Global | Validierungsführung | **Neu** | Automatischer Fokus & Sanftes Scrollen (`@invalid.capture="handleInvalid"`): Zentriert das erste fehlerhafte Feld automatisch im Sichtfeld. |
| **GLO-01** | Global | Architektur / UX | **Neu** | `GlobalDefaultsBar.vue`: Zentrale Leiste oberhalb der Formulare für Standard-Metadatensprache, globale Rechte/Lizenzen und zentralen Personen-Pool mit Ein-Klick-Broadcast („Auf alle anwenden“). |
| **GLO-02** | Global | Komponenten | **Neu** | `FlagIcon.vue`: Vektorbasierte Inline-SVG-Flaggen für `DE`, `EN`/`GB`, `FR`, `IT`, `ES`, `EL`/`GR` und Text-Fallback gegen fehlende Windows-10/Linux-Emoji-Glyphen. |
| **GLO-03** | Global | Komponenten | **Neu** | Differenzierte Autocomplete-Services: `PlaceAutocomplete.vue` (Pleiades GeoRSS & GeoNames API) und `InstitutionAutocomplete.vue` (Lobid GND CorporateBody API). |
| **GLO-04** | Global | Export / XML | **Behoben & XSD-geprüft** | 100% valide CARARE 2.0.6 XML-Serialisierung in `src/App.vue`: Geprüft gegen `CARARE/carare-v2.0.6.xsd` und Schemahandbücher. Automatische Kapselung in `<carare id="...">` (max 1 Heritage Asset pro Wrapper), XSD-konformes `lang`-Attribut (ohne `xml:`-Präfix), Kleinschreibung aller Tags und rekursive Schema-Sortierung (`sortChildrenBySchema`). |
| **UX-04** | Global | Vokabular / Epochen | **Neu** | **PeriodO-Gazetteer-Integration (`PeriodoAutocomplete.vue`):** Fachspezifische historische Epochen-Suche mit direkter Übernahme von Start-/Endjahr (`startDate`/`endDate`), kanonischer PeriodO-ARK-URI (`http://n2t.net/ark:/99152/...`) in `dateRangeQualifier` und formatierter Datierungsanzeige. Integriert in Heritage Asset, Activity und Collection. |
| **UX-05** | Global | UI / Design-System | **Neu** | **Modernes Glassmorphic Design-System:** Upgrade auf Google Fonts (`Plus Jakarta Sans`, `Outfit`, `JetBrains Mono`), schwebende Glassmorphism-Kopfleiste mit HERMES-Markenlogo, interaktive Pill-Schnellnavigation mit Live-Zählern je Sektion, Radial-Fortschrittsanzeige in der Workflow-Seitenleiste, dezent leuchtende Eingabefokus-Ringe und moderne Kartenstrukturen. |
| **UX-06** | Global | Import / Interoperabilität | **Neu** | **Vollständiger CARARE XML- & BagIt-Import (`carareXmlParser.js`):** Direkter Upload und Parsen existierender CARARE-2.0.6-XMLs oder `.zip`/BagIt-Archive per Klick oder Drag & Drop; sofortiges Laden in den Bearbeitungskontext. |
| **UX-07** | Heritage Asset | UX / Epochen | **Neu** | **PeriodO-Epochen-Quickbar:** Direkte Schnellwahl populärer antiker Epochen (u. a. Tiberische Zeit 14–37 n. Chr.) direkt in der Hauptansicht des Kulturguts mit automatischer Tabellen- und ISO-Befüllung. |
| **UX-08** | Global | UX / Bereinigung | **Behoben** | **Bereinigter Personen-Pool:** Entfernung statischer Demo-Akteure; Bereitstellung von „Alle leeren“-Aktionen in allen Akteurs- und Kontakttabellen. |
| **UX-09** | Heritage Asset | GIS / Geodaten | **Neu** | **Interaktive Fundort-Kartenintegration (`SpatialMapPicker.vue`):** Kartenansicht mit OSM-, Topo- und Satelliten-Ebenen (Esri World Imagery) sowie Klick- und Drag-Koordinate-Picker mit automatischem EPSG:4326-Setup und Sticky-Drawer-Buttons. |
| **UX-10** | Collection | Fachlogik / Schema | **Behoben** | **Bereinigung `coverage.temporal`:** Entfernung von `scientificDate` und `scientificDateMethod` aus der Sektion Sammlung. Naturwissenschaftliche Datierungen (C14, Dendro) gehören fachlich exklusiv zum physischen Kulturgut (`characters.temporal`). |
| **DEF-06** | Heritage Asset | UI / Datenanzeige | **Behoben** | **Material-Objekt-Repräsentation (`getDisplayMaterial`):** Korrektur der `[object Object]`-Anzeige bei importierten oder komplexen Materialobjekten in der Kulturgut-Tabelle und im HECTOR-Autocomplete-Chip-Input. |
| **UX-11 / DEF-07** | Seitenleiste / Digital Resource / Activity | UX / 3D-Metadaten | **Behoben** | Standardmäßiges Datei-Öffnen-Fenster für CARARE-Laden, GeoNames-Passwort/Token-Feld mit Verbindungstest, dedizierte 3D-Metadaten (Polygone, Vertices, PBR, Scanner) und Digitalisierungs-Workflows. |
| **UX-12 / DEF-08** | Global / Ortssuche | UX / Fallback | **Behoben** | Bereinigung der Seitenleiste (Entfernung Nikarete-Button, 'Alle Einträge leeren'-Funktion) und robuster GeoNames-Web-Service mit transparentem OpenStreetMap/Nominatim-Fallback. |
| **UX-13 / DEF-09** | Heritage Asset / Digital Resource | GIS / DC Relations / Paradaten | **Behoben** | Dauerhaft sichtbare Leaflet-Kartenansicht mit Resize-Observer, strikte Eingrenzung des PeriodO-Epochenkatalogs auf Kulturgüter, modularer DC Relations Manager und echte methodische 3D-Paradaten (London Charter). |
| **UX-14 / DEF-10** | Collection / Heritage Asset | UX / Schnittstellen / Geodaten | **Behoben** | Trennung von Sammlungs-Identifikator (`id`) und Institutionsname (`source`), native GND-Autocomplete-Integration im Source-Feld mit 1-Klick-GND-ID-Übernahme, robuster Pleiades-Proxy & DAI Archaeological Gazetteer Fallback sowie kontraststarker Close-Map-Button. |


---

## 2. Detaillierte technische Dokumentation der Änderungen

### A · Übergreifende Funktionsdefekte & Systemstabilität

#### `DEF-01` — Formularzustand nach dem Speichern erhalten
- **Problemursache:** Die frühere `save()`-Methode rief nach dem Hinzufügen des Objekts `resetForm()` auf. Dadurch wurde das gesamte Formular geleert, der Bearbeitungsindex ging verloren und Korrekturen oder das Weiterführen der Arbeit waren unmöglich.
- **Code-Umsetzung (`CollectionInformationCrud.vue`, `HeritageAssetIdentificationCrud.vue`, `DigitalResourceCrud.vue`, `ActivityCrud.vue`):**
  1. `save()` führt kein `resetForm()` mehr aus.
  2. Bei neuen Einträgen wird das Objekt in `items.value.push(...)` eingetragen und unmittelbar auf Bearbeitungsmodus umgeschaltet:
     ```javascript
     isEditing.value = true;
     editIndex.value = items.value.length - 1;
     ```
  3. Bei bestehenden Einträgen wird an der Position `items.value[editIndex.value]` direkt aktualisiert.
  4. Ein optischer Erfolgsindikator (`saveSuccessBadge.value = true`) wird eingeblendet und nach 3.000 ms via `setTimeout` automatisch ausgeblendet:
     ```html
     <span v-if="saveSuccessBadge" class="badge badge-success gap-1 text-white py-3 px-3 transition-all animate-bounce">
       ✓ {{ currentLocale === 'de' ? 'Gespeichert' : 'Saved' }}
     </span>
     ```
  5. Für die Heritage Asset Identification wurde zusätzlich die Methode `saveAndContinueNextPart()` implementiert: Sie speichert den aktuellen Datensatz ab und öffnet ein leeres Formular für ein Folgeteil, übernimmt dabei jedoch automatisch geteilte Ensemble- und Institutsinformationen (`recordInformation.source`, `recordInformation.country`, `recordInformation.creation.contacts`, `actors`, `provenance`, `characters.temporal`, `spatial`, `repositoryLocation`, `rights.copyrightCreditLine`, `rights.accessRights`).

#### `DEF-02` — Typisierung sämtlicher Buttons (`type="button"`)
- **Problemursache:** Buttons innerhalb eines HTML-`<form>` ohne expliziten `type`-Parameter werden browserseitig standardmäßig als `type="submit"` interpretiert. Klicks auf Sprachauswahlflaggen, Bevorzugt-Sterne, Hilfe-Icons oder Drawer-Trigger lösten daher unbemerkt das Absenden des Hauptformulars aus.
- **Code-Umsetzung:**
  - Audit aller Vue-Templates im Projekt durchgeführt.
  - In den 4 CRUD-Komponenten (`CollectionInformationCrud.vue`, `HeritageAssetIdentificationCrud.vue`, `DigitalResourceCrud.vue`, `ActivityCrud.vue`) wurden **477 Buttons** mit explizitem `type="button"` versehen.
  - Nur jeweils genau 2 Buttons pro Modul behalten den semantischen Typ `type="submit"`:
    1. Der Haupt-Speichern-Button des Datensatzes.
    2. Der Speichern-Button innerhalb des Bearbeitungs-Drawers.
  - Modale Schließ-Schaltflächen innerhalb DaisyUI-Dialogen nutzen standardkonform `<form method="dialog" class="modal-backdrop"><button>close</button></form>`.

#### `DEF-03` — DaisyUI 5 Validierungsbereinigung & Lokalisierung
- **Problemursache:** DaisyUI 5 wendet über die Hilfsklasse `.validator` und Kindelemente `.validator-hint` automatische CSS-Pseudo-Klassen (`:user-invalid`) an. Da auch rein optionale Felder mit `.validator` und hartkodiertem `{{ t('validationHint') }}` ausgezeichnet waren, wurden leere optionale Felder bei Fokus rot umrandet und zeigten englischen Pseudotext.
- **Code-Umsetzung:**
  1. Die Klasse `.validator` und die Kind-Tags `<div class="validator-hint">` wurden von allen rein optionalen Eingabefeldern entfernt.
  2. Nur echte Pflichtfelder (mit `required`-Attribut) oder Felder mit explizitem semantischem Format-Pattern (z. B. URL- oder Datumsprüfungen) behalten die Klasse `.validator`.
  3. Der Lokalisierungsschlüssel `validationHint` wurde in den i18n-Objekten aller CRUD-Komponenten gepflegt:
     ```javascript
     en: { validationHint: 'Enter valid value' },
     de: { validationHint: 'Geben Sie einen gültigen Wert ein' }
     ```

#### `DEF-04` — Robuste Vorlagen-Persistenz & Duplikat-Verhinderung
- **Problemursache:** Bei der Vergabe bereits vorhandener Vorlagennamen wurden Duplikate in die Vorlagenliste eingefügt. In virtualisierten Laufzeitumgebungen (Wine/Bottles) kam es zudem vor, dass der Tauri-Store (`@tauri-apps/plugin-store`) Schreibvorgänge vor dem Beenden nicht flushed hat.
- **Code-Umsetzung:**
  1. **Case-Insensitive Deduplizierung in `addTemplate()`:**
     ```javascript
     const existingIdx = templates.value[field].findIndex(
       t => t.name.trim().toLowerCase() === tplName.toLowerCase()
     );
     if (existingIdx !== -1) {
       templates.value[field][existingIdx].data = JSON.parse(JSON.stringify(drawerForm));
     } else {
       templates.value[field].push({
         name: tplName,
         data: JSON.parse(JSON.stringify(drawerForm))
       });
     }
     ```
  2. **Duale Persistenz (Tauri Store + synchroner `localStorage`):**
     Jede Änderung (`addTemplate`, `executeDeleteTemplate`) schreibt sowohl in den Tauri-Store als auch synchron in den `localStorage` mit modulspezifischem Schlüssel:
     - `hermes_templates_collection_${field}`
     - `hermes_templates_heritage_${field}`
     - `hermes_templates_digital_${field}`
     - `hermes_templates_activity_${field}`
  3. **Fallback-Initialisierung (`src/utils/platform.js`):**
     Sollte der Tauri-Store beim Aufruf von `getAppStore()` fehlschlagen oder leer sein, greift automatisch die Klasse `BrowserStore` mit Rückgriff auf `localStorage` und `default_templates.json`.

#### `DEF-05` & `DR-01` — Zuverlässige Status-Checkliste in der Seitenleiste
- **Problemursache:** Das Validierungsschema generiert flache Feldpfade für geschachtelte Objektstrukturen (z. B. `recordInformation.creation.contacts.organization`). Wenn der Nutzer zwar `recordInformation.id`, `source` und `country` ausgefüllt hatte, das optionale Sub-Array `contacts` jedoch leer war, erwartete die alte Prüfroutine fälschlicherweise das Vorhandensein von `organization` und verweigerte das Setzen des grünen Hakens für „Datensatzinformationen“.
- **Code-Umsetzung (`src/App.vue`, Zeilen 825–877):**
  1. Die rekursive Pfadauswertung in `checkFilled()` erkennt nun Subpfade von Arrays:
     ```javascript
     const parts = field.fieldPath.split(".");
     for (let i = parts.length - 1; i > 0; i--) {
       const parentPath = parts.slice(0, i).join(".");
       const childProp = parts.slice(i).join(".");
       if (Array.isArray(dataObj[parentPath])) {
         // Ist das übergeordnete optionale Array leer, blockiert es nicht die Sektion:
         if (dataObj[parentPath].length === 0) return true;
         return dataObj[parentPath].every(item => {
           const subVal = item[childProp] || item[parts[parts.length - 1]];
           return subVal !== null && subVal !== undefined && String(subVal).trim() !== "";
         });
       }
     }
     ```
  2. Prüfung von Objekt-Arrays: Bei mehrsprachigen Arrays (wie `appellation.name`) wird geprüft, ob mindestens ein Objekt einen nicht-leeren Textwert (`item._value || item.value`) besitzt.
  3. Zweistufige Statusprüfung: Geprüft wird primär, ob mindestens ein gespeicherter Datensatz vollständig ist (`comp.items.some(checkFilled)`). Ist die Liste noch leer, wird synchron das aktive Formular ausgewertet (`checkFilled(comp.form)`).

#### `UX-01` bis `UX-03` — Ergonomie, Dirty-State-Schutz & Scroll-to-Error
- **Tastatur-Shortcuts (`UX-01`):**
  - <kbd>Strg</kbd>+<kbd>S</kbd> (bzw. <kbd>Cmd</kbd>+<kbd>S</kbd>) wurde global in `src/App.vue` und in allen 4 CRUD-Komponenten abgefangen: Es verhindert das Browser-Standardmenü und löst das Speichern des aktuellen Datensatzes aus.
  - Befindet sich der Nutzer in einem geöffneten Drawer, speichert <kbd>Strg</kbd>+<kbd>S</kbd> den Drawer-Eintrag.
  - <kbd>Esc</kbd> schließt geöffnete Bearbeitungs-Drawer sofort.
- **Dirty-State-Schutz (`UX-02`):**
  - Jede CRUD-Komponente führt ein reaktives `formSnapshot`-Signal.
  - `isFormDirty()` vergleicht `JSON.stringify(form)` mit dem letzten Snapshot.
  - Klickt der Anwender bei modifiziertem Formular auf *„+ Neuer Datensatz“* oder *„Abbrechen“*, erscheint eine Sicherheitsabfrage:  
    *„Sie haben ungespeicherte Änderungen. Möchten Sie das Formular wirklich zurücksetzen?“*
- **Scroll-to-Error (`UX-03`):**
  - Alle Haupt- und Drawer-Formulare nutzen `@invalid.capture="handleInvalid"`.
  - Bei fehlenden Pflichtfeldern fängt der Event-Handler das browserseitige Invalidierungs-Ereignis ab, scrollt das erste betroffene Eingabefeld sanft in die Bildschirmmitte (`scrollIntoView({ behavior: 'smooth', block: 'center' })`) und fokussiert es automatisch.

---

### B · Modulspezifische Verbesserungen

#### 1. Collection Information (`src/output_components/CollectionInformationCrud.vue`)
- **`COL-01` (Negative Jahreszahlen & v. Chr.):**
  - HTML-Validierungs-Regex auf den Datumsfeldern:
    `pattern="^(-?[0-9]{1,})(?:-(0[1-9]|1[0-2])(?:-(0[1-9]|[12][0-9]|3[01]))?)?$"`
  - Automatische Normalisierung bei `save()` mittels `normalizeYearDate(val)` aus `src/utils/sharedState.js`:
    Negative Jahre oder kurze Jahreszahlen (z. B. `-330` v. Chr. oder `48` n. Chr.) werden durch Auffüllen mit führenden Nullen auf das 4-stellige ISO-8601-Format gebracht (z. B. `-0330`, `0048`).
- **`TPL-01` (Einheitliche Aktionsleiste):**
  - Am Ende des Formulars integriert: Speichern-Button, animierter Erfolgsbadge (`saveSuccessBadge`), Schaltfläche `+ Neuer Datensatz` (`resetForm()`) und `Abbrechen`.
- **Institution-Lookup:**
  - `InstitutionAutocomplete.vue` für die Sammlungs-ID (`id`) und die Quelle (`source`) angebunden. Sucht direkt über die Lobid GND CorporateBody API nach Körperschaften.

#### 2. Heritage Asset Identification (`src/output_components/HeritageAssetIdentificationCrud.vue`)
- **`HAI-01` (Akteure & Kontakte):**
  - Ungültige Validierungsbindung von `roles` im Drawer entfernt.
  - Datalist `<datalist id="actor-roles-list">` mit 9 standardisierten Rollenpaaren (DE/EN) hinzugefügt: Kurator/Curator, Dokumentar/Documentation, Projektleitung/Project Management, Urheber / Schöpfer / Creator, Architekt/Architect, Bildhauer/Sculptor, Fotograf/Photographer, Restaurator / Konservator / Conservator, Verwahrer/Custodian.
  - Automatische Synchronisation neu erfasster Personen in den zentralen Master-Pool via `addOrUpdatePerson(dataToSave)`.
  - 1-Klick-Wiederverwendungsleiste für gespeicherte Kontakte und Akteure.
- **`HAI-02` (Mehrsprachige Objektnamen & XML-Export):**
  - `appellation.name` als Objektliste strukturiert: `[{ _value: '', 'appellation.name#lang': 'de', 'appellation.name#preferred': true }]`.
  - Inline-Sprachwähler mit SVG-Flaggen für Deutsch, Englisch, Französisch, Italienisch und Spanisch.
  - Exklusiver Bevorzugt-Stern (`#preferred`): Ein Klick setzt den gewählten Namen als bevorzugt und schaltet alle weiteren Namen im Datensatz ab.
  - XML-Export in `src/App.vue` exportiert dies direkt als `<name xml:lang="de" preferred="true">Wert</name>`.
- **`HAI-03` (Temporale Datierung v. Chr.):**
  - `timeSpan.startDate` und `timeSpan.endDate` mit negativem Regex und `normalizeYearDate()` abgesichert.
- **`HAI-04` & `HAI-05` (Maße & Dimensionen):**
  - Maßstab (`characters.dimensions.scale`) ist optional (`label-text` mit Warnungstilde `~` statt Pflichtstern `*`).
  - Dezimalkomma-Korrektur in `saveDrawerItem()`:
    ```javascript
    if (field === 'characters.dimensions' && drawerForm['value']) {
      drawerForm['value'] = String(drawerForm['value']).replace(',', '.').trim();
    }
    ```
  - Tabelle visualisiert Umfang, Messtyp, Wert (in Schriftart `font-mono`), Einheit und Maßstab übersichtlich.
- **`HAI-06` (Räumliche Angaben):**
  - Tabelle für `spatial` visualisiert `locationSet.namedLocation`, `locationSet.geopoliticalArea` und die Koordinaten `geometry.quickpoint.y, geometry.quickpoint.x`.
  - Angebunden an `PlaceAutocomplete.vue` mit direkter Koordinaten- und URIs-Übernahme aus Pleiades und GeoNames.

#### 3. Digital Resource (`src/output_components/DigitalResourceCrud.vue`)
- **`DR-02` (Creative-Commons- & Rechte-Katalog):**
  - Standardisiertes Auswahl-Dropdown basierend auf `CC_LICENCES`:
    - CC0 1.0 Universal (Public Domain)
    - CC BY 4.0 (Namensnennung)
    - CC BY-SA 4.0 (Namensnennung, Weitergabe unter gleichen Bedingungen)
    - CC BY-NC 4.0 (Namensnennung, Nicht-kommerziell)
    - CC BY-NC-SA 4.0 (Namensnennung, Nicht-kommerziell, ShareAlike)
    - CC BY-ND 4.0 (Namensnennung, Keine Bearbeitung)
    - CC BY-NC-ND 4.0 (Namensnennung, Nicht-kommerziell, Keine Bearbeitung)
  - Schaltfläche „⭐ Als Standard merken“: Speichert die gewählte Lizenz direkt in das globale `globalRights`-Objekt und den `localStorage`.
  - Sprachsensitive URIs (`uriDe` mit `/deed.de` bzw. `uriEn` mit `/deed.en`).
- **Aktionsleiste & Checkliste:**
  - Statusanzeige und `+ Neuer Datensatz` analog zu Collection und Heritage Asset harmonisiert.

#### 4. Activity (`src/output_components/ActivityCrud.vue`)
- **`ACT-02` (Präzisierung des Epochen-/Zeitraumlabels):**
  - Feld `temporal.periodName` in den Metadaten-Dictionaries präzisiert:
    - Deutsch: `Zeitraum der Maßnahme` (Beschreibung: `Name der Projektperiode, der diese Aktivität zugeordnet wird.`, Placeholder: `z.B. Pilotphase Digitalisierungsprogramm 2025`).
    - Englisch: `Project period name` (Doc: `The name of the project period to which this activity is assigned.`, Placeholder: `e.g. Pilot phase digitisation programme 2025`).
- **`ACT-03` (Mehrsprachige Bezeichnung der Maßnahme):**
  - `appellation.name` mit Sprachwähler-Dropdown (SVG-Flaggen), Bevorzugt-Stern (`#preferred`) und CARARE-XML-Attributierung analog zu `HAI-02` umgesetzt.
- **Datierung:**
  - Temporale Abdeckung unterstützt negative Jahreszahlen für historische und archäologische Kampagnen vor unserer Zeitrechnung.
- **Personen-Integration:**
  - Schaltfläche `📋 Aus Personen-Liste wählen (Multiauswahl)` öffnet das zentrale `PersonPickerModal.vue`, um beteiligte Akteure in einem Schritt auszuwählen.

---

### C · Zentrale Systemarchitektur, Voreinstellungen & Hilfskomponenten

#### 1. Globale Voreinstellungsleiste (`src/components/GlobalDefaultsBar.vue` & `src/utils/sharedState.js`)
- Am Kopf der Anwendung in `src/App.vue` platziert:
  1. **Standard-Metadatensprache (`defaultMetadataLanguage`):**
     - Wählbar zwischen `DE`, `EN`, `FR`, `IT`, `ES` mittels Inline-SVG-Flaggen.
     - Wird in `localStorage('hermes_default_meta_lang')` gespeichert.
     - Button **„Auf alle anwenden“** (`applyGlobalLanguageToAll`): Setzt synchron die Sprache für alle bestehenden und neuen Einträge in allen 4 Modulen (`recordInformation.language`, `appellation.name#lang`, `title#lang`).
  2. **Zentrale Rechte & Lizenzen (`globalRights`):**
     - Aufklappbare Kontrollleiste für Metadaten-Rechte (`metadataRights`), Copyright-Vermerk (`copyrightCreditLine`), Zugangsrechte (`accessRights`), Lizenz (`licence`) und Reproduktionsrechte (`reproductionRights`).
     - Button **„Auf alle anwenden“** (`applyGlobalRightsToAll`): Schreibt die zentralen Rechte in sämtliche geladene Datensätze und Formulare aller 4 Module.
  3. **Zentraler Personen- & Akteurs-Masterpool (`PersonPickerModal.vue`):**
     - Einheitliche Verwaltung aller Kontaktpersonen, Autoren, Akteure und Organisationen über `src/utils/sharedState.js`.
     - Gespeichert in `localStorage('hermes_saved_persons')`.
     - Modal mit Suchfilter, Typfilter (Person / Organisation / Unbekannt), Rollenauswahl, GND-/ORCID-Eingabe und Multiauswahl für Formulare.
  4. **API-Zugangsdaten-Modal (`ApiSettingsModal.vue`):**
     - Verwaltet Zugangsdaten für externe Schnittstellen (GeoNames-Benutzername, Wikidata- und Pleiades-Endpunkte), persistent abgelegt in `localStorage('hermes_api_credentials')`.

#### 2. Vektor-Flaggen-Komponente (`src/components/FlagIcon.vue`)
- Löst das Problem, dass Windows 10/11 sowie Wine unter Linux keine länderspezifischen Flaggen-Emojis darstellen können (dort werden sonst unschöne Buchstabenpaare wie `[D][E]` gerendert).
- Enthält handoptimierte, pixelgenaue Inline-Vektorgrafiken (`<svg>`):
  - **DE:** Schwarz-Rot-Gold (Verhältnis 5:3)
  - **EN / GB:** Union Jack (Verhältnis 50:30)
  - **FR:** Blau-Weiß-Rot (Verhältnis 3:2)
  - **IT:** Grün-Weiß-Rot (Verhältnis 3:2)
  - **ES:** Spanische Flagge (Verhältnis 3:2)
  - **EL / GR:** Griechische Flagge mit Kreuz und Streifen (Verhältnis 27:18)
  - **Fallback:** Dezenter Monospace-Badge für unbekannte ISO-Sprachcodes.

#### 3. Fachspezifische Autocomplete-Komponenten
- **`PlaceAutocomplete.vue` (Orts- und Geodatensuche):**
  - **Pleiades-Modus (Antike Fundorte):** Sendet Live-Suchanfragen an `https://pleiades.stoa.org/search_rss?SearchableText=...`, parst den RSS-XML-Baum und extrahiert Fundortname, Pleiades-URI sowie exakte Koordinaten aus dem `<georss:point>`-Tag (`lat, lng`).
  - **GeoNames-Modus (Moderne Orte):** Fragt den GeoNames-Webservice (`http://api.geonames.org/searchJSON?q=...`) ab und ermittelt moderne Verwaltungseinheiten (`countryName`, `adminName1`) sowie Dezimalkoordinaten.
- **`InstitutionAutocomplete.vue` (Einrichtungs- & Körperschaftssuche):**
  - Bindet die Lobid GND API der Deutschen Nationalbibliothek an:
    `https://lobid.org/gnd/search?q=...&filter=type:CorporateBody&format=json&size=15`
  - Liefert bevorzugte Namen (`preferredName`), offizielle GND-Nummern (`gndIdentifier`), Ortsangaben (`placeOfBusiness`) und GND-Sachgruppen für Museen, Archive, Universitäten und Stiftungen.
- **`HectorMonumentTypeInput.vue` & `HectorMaterialInput.vue`:**
  - Kontrollierte Vokabulare für archäologische Denkmäler und Materialien basierend auf der HECTOR-Ontologie des BCDH der Universität Bonn mit integriertem Suchfilter und Facettenansicht.
- **`SkosmosAutocomplete.vue`:**
  - Autocomplete für historische Epochen und Zeiträume über SKOS/REST-Schnittstellen (`vocabs.bcdh.uni-bonn.de/rest/v1/hector_epochs/`).

#### 4. PeriodO-Gazetteer-Integration für archäologische Epochen (`src/components/PeriodoAutocomplete.vue`)
- **Fachlicher Hintergrund:** In der archäologischen und historischen Metadaten-Erfassung sind Zeitspannen oft über Epochennamen definiert (z. B. *„Hellenistische Zeit“*, *„Römische Kaiserzeit“*, *„Klassische Periode“*). Das PeriodO-Projekt (`https://perid.o/`) stellt einen weltweiten, kanonischen Linked-Data-Gazetteer historischer Epochen bereit, bei dem jede Periode eine persistente ARK-URI (`http://n2t.net/ark:/99152/...`) sowie wissenschaftlich fundierte Datierungsgrenzen besitzt.
- **Komponentenarchitektur:**
  - `PeriodoAutocomplete.vue` bietet eine interaktive Suche mit zweisprachiger Filterung (Deutsch & Englisch) und einer kuratierten Offline-Datenbasis wichtiger Epochen von der Bronzezeit bis zur Neuzeit (sowie Online-REST-Anbindung).
  - Beim Klick auf eine Epoche emittiert die Komponente ein Ereignis `@select="{ periodName, startDate, endDate, dateRangeQualifier, authority, region }"`.
- **Automatische CARARE-Feldzuordnung:**
  - `periodName` übernimmt den standardisierten Namen der Epoche.
  - `timeSpan.startDate` und `timeSpan.endDate` werden automatisch mit den astronomischen ISO-8601-Jahreszahlen befüllt (z. B. `-0330`, `-0030`, `0027`, `0284`), kompatibel mit der Normalisierungsfunktion `normalizeYearDate()`.
  - `timeSpan.dateRangeQualifier` übernimmt die persistente PeriodO-ARK-URI (z. B. `http://n2t.net/ark:/99152/p0qhb66r4sn`).
  - `displayDate` wird lesefreundlich zusammengesetzt (z. B. *„Hellenistische Zeit (-0330 bis -0030)“*).
- **Integration in Module:**
  - **`HeritageAssetIdentificationCrud.vue`:** Im Drawer *Temporale Angaben* (`characters.temporal`).
  - **`CollectionInformationCrud.vue`:** Im Drawer *Zeitliche Abdeckung* (`temporal`).
  - **`ActivityCrud.vue`:** Im Drawer *Zeitraum der Maßnahme* (`temporal`).

#### 5. Modernes Design-System & Glassmorphism-Architektur (`src/style.css`, `index.html`, `src/App.vue`)
- **Zielsetzung:** Überwindung des zweckmäßigen, rein funktionalen Erscheinungsbilds zugunsten eines ästhetisch erstklassigen, modernen und lebendigen Web- & Desktop-Interfaces.
- **Typografie (`index.html` & `src/style.css`):**
  - **Body / Interface:** `Plus Jakarta Sans` — hochgradig lesbare, geometrische UI-Schriftart.
  - **Headings / Brand:** `Outfit` — elegante, markante Displayschrift mit modernem Duktus.
  - **Codes & Identifikatoren:** `JetBrains Mono` — klare Monospace-Schrift für Hashwerte, IDs und Koordinaten.
- **Glassmorphic Navigation & Status-Leiste (`src/App.vue`):**
  - **Header (`.glass-header`):** Transparenter, weichgezeichneter Blur-Header (`backdrop-filter: blur(20px)`), Markenlogo-Badge mit dezent animiertem Live-Indikator, Versionsanzeige `v0.1.5` und Schema-Pill `CARARE 2.0.6`.
  - **Interaktive Schnellnavigation (Pills):** Zeigt die 5 Hauptabschnitte (*Sammlung*, *Kulturgut*, *Digitale Ressourcen*, *Aktivitäten*, *Dateien*) als pillenförmige Tastenleiste. Jeder Button enthält einen Live-Datensatzzähler (`[1]`, `[3]`) sowie einen Statuspunkt (Grün = bereit, Grau = in Arbeit). Klicks führen flüssiges Scrolling zur jeweiligen Sektion aus.
  - **Shortcut-Badge:** Dezente Einblendung von <kbd>Strg</kbd>+<kbd>S</kbd> (<kbd>Ctrl</kbd>+<kbd>S</kbd>) zur Erinnerung an die Tastaturspeicherung.
- **Workflow-Seitenleiste & Aktionen:**
  - Schwebendes `.glass-panel` mit **Radial-Fortschrittsanzeige** (`radial-progress`), die in Echtzeit den Gesamtfortschritt (0% bis 100%) berechnet.
  - Klare Pflichtfeld-Legende (`* Pflichtfelder`, `~ Empfohlen`).
  - Strukturierte Aktionskarte für BagIt-Import, BagIt-Export und CARARE-XML-Export mit Hover-Elevation und animierten Feedback-Badges.
- **Karten- und Formularästhetik (`.modern-card`):**
  - Sanft schattierte Karten mit nummerierten Sektionsabzeichen (`01`, `02`, `03`...), Live-Zählern und optischem Statusanzeiger (*„✓ Vollständig“*).
  - Dezent leuchtende Fokus-Ringe bei Texteingaben (`box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 25%, transparent)`).
  - Minimale, abgerundete Scrollbalken für ein aufgeräumtes Bild.

#### 6. CARARE 2.0.6 XML-Serialisierung & XSD-Konformitätsprüfung (`src/App.vue`)
- Auf Basis der offiziellen Spezifikationsdateien im Projektverzeichnis `CARARE/` (`carare-v2.0.6.xsd`, `the_carare_metadata_schema2.pdf`, `CARARE_metadata_intro.pdf`) wurde die Exportfunktion `exportToCarareXML()` in `src/App.vue` einer tiefgreifenden Revision unterzogen und gegen den XSD-Validator `lxml.etree.XMLSchema` verifiziert:

  1. **Paketierungs- und Wrapper-Architektur (`<carareWrap>` & `<carare id="...">`):**
     - Gemäß *CARARE metadata schema v2.0* (Kapitel 2.1 & 3.1) bündelt das Wurzelelement `<carareWrap>` eine oder mehrere `<carare>`-Einheiten.
     - Jedes `<carare>`-Element repräsentiert ein eigenständiges Kulturgut und **erfordert zwingend das XML-Attribut `id`** (`<xs:attribute name="id" type="xs:string" use="required"/>`).
     - Innerhalb eines `<carare>`-Blocks ist für `<heritageAssetIdentification>` strikt `minOccurs="0" maxOccurs="1"` vorgeschrieben. Mehrere Heritage Assets dürfen daher nicht in einen gemeinsamen Block geworfen werden.
     - **Lösung:** `exportToCarareXML()` segmentiert mehrere Kulturgüter automatisch in separate `<carare id="...">`-Hüllknoten (mit der ID aus `recordInformation.id` bzw. `appellation.id`), bindet die geteilte Sammlungsbeschreibung (`collectionInformation`) ein und verknüpft die zugehörigen digitalen Ressourcen und Aktivitäten.

  2. **Attribut-Namespace: `lang` statt `xml:lang`:**
     - In den informativen Freitextkommentaren des Schemas (`<xs:documentation>`) wird traditionell von *„the XML:lang attribute“* gesprochen; die tatsächliche maschinenlesbare Schemadefinition deklariert das Attribut jedoch ohne XML-Namensraum: `<xs:attribute name="lang" type="xs:string" .../>` (ohne Import von `http://www.w3.org/XML/1998/namespace`).
     - Standardkonforme XSD-Parser weisen `xml:lang` ab (`The attribute '{http://www.w3.org/XML/1998/namespace}lang' is not allowed`).
     - **Lösung:** Die Serialisierung erzeugt valide Attribute `lang="..."` und `preferred="true|false"` direkt am jeweiligen Element (`name`, `title`, `statement`, `materials` etc.).

  3. **Strenge Tag-Kleinschreibung (Beseitigung fehlerhafter PascalCase-Konvertierung):**
     - Eine Analyse aller 227 im Schema `carare-v2.0.6.xsd` deklarierten Elementnamen ergab: **Kein einziges Element beginnt mit einem Großbuchstaben**.
     - Bisher wurden Pfade durch `.map(s => s.charAt(0).toUpperCase() + s.slice(1))` fälschlicherweise in PascalCase umgewandelt (`<RecordInformation>`, `<Id>`), was die Schema-Validierung sofort abbrechen ließ.
     - **Lösung:** Die Pfadsegmente behalten exakt ihre im Formular definierte camelCase-/Kleinbuchstaben-Form (`recordInformation`, `appellation`, `generalType`, `characters`, `spatial`, `repositoryLocation` etc.).

  4. **Rekursive Schema-Sequenzierung (`sortChildrenBySchema`):**
     - In XML-Schema (`xs:sequence`) ist die Reihenfolge der Kindelemente bindend.
     - In `<appellation>` muss `<name>` **vor** `<id>` stehen; zudem ist `<name>` mit Pflichtattribut `lang` versehen und `<id>` ist ein Pflichtfeld (`minOccurs="1" maxOccurs="1"`).
     - In `<heritageAssetIdentification>` ist die Reihenfolge exakt: `<recordInformation>`, `<appellation>`, `<description>`, `<generalType>`, `<actors>`, `<designations>`, `<conditions>`, `<provenance>`, `<characters>`, `<spatial>`, `<repositoryLocation>`, `<rights>` etc.
     - In `<collectionInformation>` existiert kein `<recordInformation>`-Knoten; `<id>`, `<title>`, `<source>`, `<contacts>`, `<rights>`, `<language>` sind direkte Kinder.
     - In `<dimensions>` ist `<value>` ein valides Kindelement (`<value>58.5</value>`) vom Schema-Typ `xs:decimal`.
     - **Lösung:** Die Funktion `sortChildrenBySchema(node)` ordnet alle XML-Knoten vor der Ausgabe rekursiv anhand des internen Schema-Sequenz-Mappings `schemaSequenceMap`.

  5. **Verifikationsnachweis:**
     - Die generierten XML-Dateien wurden mit einem Testskript (`scratch/test_complete_export.cjs` und `scratch/test_carare_builder.py`) direkt gegen `CARARE/carare-v2.0.6.xsd` validiert. Ergebnis: **100% valide nach CARARE v2.0.6**.

---

## 3. Übersicht der geänderten und neu erstellten Dateien

### Geänderte Kernkomponenten:
- **`src/App.vue`:**
  - Checklisten-Validierungslogik (`checkFilled`) für Subpfade und Objektarrays repariert.
  - Integration von `GlobalDefaultsBar.vue` und Broadcast-Methoden (`applyGlobalRightsToAll`, `applyGlobalLanguageToAll`).
  - Globaler <kbd>Strg</kbd>+<kbd>S</kbd> Shortcut zum Speichern der aktiven Sektion.
  - Vollständiger, 100% valider CARARE 2.0.6 XML-Export: automatische Segmentierung in `<carare id="...">`-Pakete, Schema-Sequenzierung (`schemaSequenceMap`), normkonforme `lang`-Attribute und ISO-8601-Datumsfilter.
- **`src/output_components/CollectionInformationCrud.vue`:**
  - `save()` leert Formular nicht mehr; Erfolgsbadge und `+ Neuer Datensatz` hinzugefügt.
  - Über 80 Buttons explizit auf `type="button"` typisiert.
  - Negative Jahreszahlen via ISO-8601-Datumsregex und `normalizeYearDate()`.
  - Anbindung von `InstitutionAutocomplete.vue` für Sammlungs-ID und Quelle.
  - Template-Deduplizierung und redundante Speicherung (`localStorage`).
  - Dirty-State-Schutz (`isFormDirty()`), Scroll-to-Error und Shortcuts integriert.
- **`src/output_components/HeritageAssetIdentificationCrud.vue`:**
  - Mehrsprachige Objektnamen (`appellation.name`) mit SVG-Sprachwähler und Bevorzugt-Stern.
  - `saveAndContinueNextPart()` für zusammenhängende Ensemble-Erfassung.
  - Maße: `scale` optionalisiert; Dezimalkomma-zu-Punkt-Konvertierung in `saveDrawerItem()`.
  - Datalist für Standard-Akteursrollen; 1-Klick-Akteursbar und Multiauswahl-Picker.
  - Tabellendarstellung für Maße und räumliche Koordinaten.
  - Über 150 Buttons mit `type="button"` geschützt.
  - Dirty-State-Schutz (`isFormDirty()`), Scroll-to-Error und Shortcuts integriert.
- **`src/output_components/DigitalResourceCrud.vue`:**
  - Vollständiger CC-Lizenzkatalog (`CC_LICENCES`) mit Alias-Erkennung und „Als Standard merken“.
  - `save()`-Verhalten und `+ Neuer Datensatz` vereinheitlicht.
  - Über 130 Buttons mit `type="button"` geschützt.
  - Dirty-State-Schutz (`isFormDirty()`), Scroll-to-Error und Shortcuts integriert.
- **`src/output_components/ActivityCrud.vue`:**
  - `temporal.periodName` von „Epochenname“ zu „Zeitraum der Maßnahme“ umbenannt und dokumentiert.
  - Mehrsprachiger Aktivitätsname mit SVG-Flaggen und Bevorzugt-Schaltung.
  - Temporale Abdeckung für v. Chr. / negative Jahreszahlen.
  - Über 110 Buttons mit `type="button"` geschützt.
  - Dirty-State-Schutz (`isFormDirty()`), Scroll-to-Error und Shortcuts integriert.

### Neu integrierte Hilfskomponenten & Utilities:
- **`src/components/GlobalDefaultsBar.vue`:** Zentrale Leiste für Metadatensprache, Rechte/Lizenzen und Personen-Pool.
- **`src/components/FlagIcon.vue`:** Vektorbasierte Inline-SVG-Flaggen (`DE`, `EN`, `FR`, `IT`, `ES`, `EL`) gegen Windows-Emoji-Darstellungsfehler.
- **`src/components/PlaceAutocomplete.vue`:** Ortsvorschläge via Pleiades GeoRSS (Antike) und GeoNames (Moderne).
- **`src/components/InstitutionAutocomplete.vue`:** Körperschaften- und Institutionensuche via Lobid GND API.
- **`src/components/PersonPickerModal.vue`:** Zentrales Verwaltungs- und Multiauswahl-Modal für Personen und Akteure.
- **`src/components/ApiSettingsModal.vue`:** Konfigurationsdialog für externe API-Zugangsdaten.
- **`src/components/HectorMonumentTypeInput.vue`:** Facettierte Objekttyp-Auswahl nach HECTOR-Vokabular.
- **`src/components/HectorMaterialInput.vue`:** Material-Schnellauswahl nach HECTOR-Vokabular.
- **`src/components/SkosmosAutocomplete.vue`:** SKOS-REST-Schnittstelle für historische Epochen.
- **`src/components/PeriodoAutocomplete.vue`:** PeriodO-Gazetteer-Komponente für archäologische Epochen mit ISO-8601-Jahresübernahme und kanonischen ARK-URIs.
- **`index.html`:** Einbindung moderner Google Fonts (`Plus Jakarta Sans`, `Outfit`, `JetBrains Mono`).
- **`src/style.css`:** Modernes CSS-Designsystem (Tailwind v4 / DaisyUI 5 Token, `.glass-panel`, `.glass-header`, `.modern-card`, leuchtende Fokus-Ringe, custom Scrollbars).
- **`src/utils/sharedState.js`:** Zentrales State-Management für Standard-Metadatensprache, globale Rechte, Personenpool, Lizenzkatalog (`CC_LICENCES`) und Datumsnormalisierer (`normalizeYearDate`).
- **`src/utils/platform.js`:** Abstraktionsschicht für Tauri-Store mit automatischem Fallback auf `BrowserStore` und `localStorage`.
- **`src/utils/vocabHistory.js`:** Verlaufsspeicher und Seed-Daten für Vokabular-Autocompletes.

---

## 4. Qualitätssicherung & Prüfleitfaden (QA Testing Guide)

Für Tester und Abnahmebeauftragte sind im Folgenden konkrete Klickszenarien aufgeführt, um die Fehlerbehebungen und neuen Features Schritt für Schritt nachzuvollziehen:

### Testfall 1: Formularzustand nach dem Speichern & Dirty-State-Schutz (`DEF-01`, `UX-02`)
1. In der Sektion **Collection Information** das Feld `id` mit einem Testwert (z. B. `COL-2026-TEST`) und `title` mit `Testsammlung` füllen.
2. Am Formularende auf **Speichern** klicken oder <kbd>Strg</kbd>+<kbd>S</kbd> drücken.
   * **Erwartetes Ergebnis:** Ein grünes Badge *„✓ Gespeichert“* hüpft für 3 Sekunden auf. Die Felder bleiben gefüllt; oben rechts im Abschnitt steht der Datensatz in der Tabelle.
3. Ändern Sie nun den Text im Titel auf `Testsammlung Geändert` (ohne zu speichern).
4. Klicken Sie auf **+ Neuer Datensatz**.
   * **Erwartetes Ergebnis:** Es erscheint ein Bestätigungsdialog: *„Sie haben ungespeicherte Änderungen. Möchten Sie das Formular wirklich zurücksetzen?“*. Klick auf *Abbrechen* bricht das Leeren ab; Klick auf *OK* leert das Formular für die nächste Eingabe.

### Testfall 2: Tastaturkürzel & Drawer-Steuerung (`UX-01`)
1. In **Heritage Asset Identification** einen Drawer öffnen (z. B. auf *Akteure hinzufügen* klicken).
2. Drücken Sie die Taste <kbd>Esc</kbd>.
   * **Erwartetes Ergebnis:** Der Drawer schließt sich sofort ohne Neuladen der Seite.
3. Öffnen Sie den Drawer erneut, tragen Sie einen Namen ein und drücken Sie <kbd>Strg</kbd>+<kbd>S</kbd>.
   * **Erwartetes Ergebnis:** Der Drawer-Eintrag wird gespeichert und zur Liste hinzugefügt.

### Testfall 3: Button-Sicherheit (`DEF-02`)
1. In einem beliebigen Formular Text in ein Pflichtfeld eintragen.
2. Klicken Sie auf eine **Sprachflagge** (z. B. von DE auf EN umschalten) oder auf das **Stern-Symbol** (bevorzugt) oder auf ein **Hilfe-(?)-Icon**.
   * **Erwartetes Ergebnis:** Weder leert sich das Formular, noch wird eine Validierungsprüfung ausgelöst. Das Formular bleibt im aktuellen Eingabezustand.

### Testfall 4: Negative Jahreszahlen & Datierung v. Chr. (`COL-01`, `HAI-03`)
1. In **Heritage Asset Identification** den Drawer *Temporale Angaben* öffnen.
2. In `timeSpan.startDate` den Wert `-330` eintragen. In `timeSpan.endDate` den Wert `-323`.
3. Drawer speichern und das Heritage Asset abspeichern.
4. Oben in der Seitenleiste auf **Export CARARE XML** klicken.
   * **Erwartetes Ergebnis:** Die XML-Datei öffnet bzw. lädt herunter. Die Datei besitzt das Wurzelelement `<carareWrap>` mit mindestens einem `<carare id="...">`. Im XML steht unter `<characters><temporal><timeSpan>`:
     `<startDate>-0330</startDate>` und `<endDate>-0323</endDate>`. Die Attribute lauten `lang="..."` und alle Tags folgen streng der Klein-/camelCase-Schreibung.

### Testfall 5: Automatisches Scrollen zum ersten Fehler (`UX-03`)
1. Klicken Sie auf **+ Neuer Datensatz**, sodass alle Felder leer sind.
2. Scrollen Sie ganz nach unten an das Formularende und klicken Sie direkt auf **Speichern**.
   * **Erwartetes Ergebnis:** Die Seite scrollt automatisch und ruckelfrei nach oben zum ersten fehlenden Pflichtfeld (z. B. `id`), zentriert es auf dem Bildschirm und setzt den Fokus hinein.

### Testfall 6: Dezimalkomma-Korrektur bei Maßen (`HAI-04`)
1. In **Heritage Asset Identification** den Drawer *Maße / Dimensionen* öffnen.
2. Tragen Sie im Feld Wert die Zahl mit Komma ein: `12,5`.
3. Wählen Sie Einheit `cm` und speichern Sie den Drawer.
   * **Erwartetes Ergebnis:** In der Maße-Tabelle erscheint die Angabe `12.5 cm` (automatisch in Dezimalpunkt gewandelt, kompatibel mit XML-Schema `xs:decimal`).

### Testfall 7: Globaler Metadaten- & Rechte-Broadcast (`GLO-01`)
1. In der Kopfleiste (**GlobalDefaultsBar**) die Sprache auf **EN** umschalten und auf **Auf alle anwenden** klicken.
   * **Erwartetes Ergebnis:** Alle Sprachwähler und mehrsprachigen Namensfelder in allen vier Modulen wechseln auf Englisch.
2. Öffnen Sie in der Kopfleiste *Zentrale Rechte & Lizenzen*, wählen Sie `CC BY 4.0` und klicken Sie auf *Auf alle anwenden*.
   * **Erwartetes Ergebnis:** Die Lizenz-Dropdowns in Heritage Asset, Digital Resource und Collection Information übernehmen synchron die gewählte Lizenz.

### Testfall 8: Seitenleisten-Statuscheckliste (`DEF-05`)
1. Füllen Sie in **Digital Resource** lediglich die Pflichtfelder der ersten Gruppe (`id`, `source`, `country`). Lassen Sie optionale Kontaktdaten leer.
2. Speichern Sie den Datensatz.
   * **Erwartetes Ergebnis:** In der linken Seitenleiste erhält der Eintrag *Datensatzinformationen* sofort einen grünen Haken. Leere Kontakte blockieren den Status nicht mehr.

### Testfall 9: PeriodO-Epochen-Autocomplete (`UX-04`)
1. In **Heritage Asset Identification** den Drawer *Temporale Angaben* (`characters.temporal`) öffnen.
2. Geben Sie im Feld **PeriodO Epochen-Gazetteer** die Buchstaben `Röm` ein.
   * **Erwartetes Ergebnis:** Ein Dropdown öffnet sich mit relevanten PeriodO-Epochen (z. B. *Römische Kaiserzeit*, *Römische Republik*).
3. Wählen Sie *Römische Kaiserzeit*.
   * **Erwartetes Ergebnis:** 
     - `periodName` wird mit *Römische Kaiserzeit* befüllt.
     - `timeSpan.startDate` wird automatisch auf `0027` gesetzt.
     - `timeSpan.endDate` wird automatisch auf `0284` gesetzt.
     - `timeSpan.dateRangeQualifier` übernimmt die PeriodO-ARK-URI `http://n2t.net/ark:/99152/p0qhb66r4sn`.
     - `displayDate` wird mit *Römische Kaiserzeit (0027 bis 0284)* vorbefüllt.

### Testfall 10: Modernes Design, Quick-Nav & Workflow-Fortschritt (`UX-05`)
1. Betrachten Sie die Kopfleiste:
   * **Erwartetes Ergebnis:** Der Header erscheint im Glassmorphic-Look mit HERMES-Markenlogo, `v0.1.5`- und `CARARE 2.0.6`-Badges sowie einer interaktiven Navigationsleiste aus Pill-Buttons.
2. Klicken Sie in der Pill-Leiste auf **Kulturgut**.
   * **Erwartetes Ergebnis:** Die Seite scrollt sanft zu Sektion 02. Der Pill-Button wird aktiv hervorgehoben und zeigt die Anzahl gespeicherter Datensätze als Counter an.
3. Betrachten Sie die linke Seitenleiste:
   * **Erwartetes Ergebnis:** Das runde Radial-Fortschritts-Widget zeigt den prozentualen Ausfüllungsgrad des Gesamtprojekts in Echtzeit an (z. B. `20%` bei 1 von 5 fertigen Sektionen). Die Export-Buttons besitzen ein klares visuelles Feedback und Hover-Elevation.

### Testfall 11: Universeller CARARE XML- & BagIt-Import inkl. Drag & Drop (`UX-06`)
1. Klicken Sie in der linken Seitenleiste auf **CARARE XML / BagIt importieren** (oder ziehen Sie eine beliebige `.xml`-, `.zip`- oder `.json`-Datei per Drag & Drop direkt auf das Browserfenster).
2. Wählen Sie beispielsweise `CARARE/CARARE_Nikarete_SK740.xml` oder `CARARE/CARARE_Tairkap_AM3_01.xml` aus.
   * **Erwartetes Ergebnis:** 
     - Ein modales Infofenster meldet den erfolgreichen Import und listet die genaue Anzahl an importierten Sammlungen, Kulturgütern, Digitalen Ressourcen und Aktivitäten auf.
     - Alle Datenfelder in den Abschnitten *Sammlung*, *Kulturgut*, *Digitale Ressourcen* und *Aktivitäten* werden vollständig und typkonform befüllt (inkl. Paradaten/`consistsOf`, PeriodO-Zeiten, Vokabular-URIs, Rechteangaben).
     - Der Datensatz wird sofort in den aktiven Bearbeitungsmodus geladen und die Counter in der Pill-Leiste aktualisiert.
3. Ziehen Sie eine Datei mit der Maus über das Fenster:
   * **Erwartetes Ergebnis:** Ein ansprechender halbtransparenter Drag & Drop-Overlay-Indikator erscheint und signalisiert sofortige Ablagebereitschaft.

### Testfall 12: Direkte PeriodO-Zuweisung beim Kulturgut & Tiberius-Epoche (`UX-07`)
1. Navigieren Sie zu **Sektion 02 Kulturgut (Heritage Asset)** und scrollen Sie zum Abschnitt **Temporale Angaben (`characters.temporal`)**.
   * **Erwartetes Ergebnis:** 
     - Direkt auf der Hauptkarte befindet sich die **PeriodO Epochen-Gazetteer Quick-Bar** mit Schnellwahl-Chips.
     - Der Chip **Tiberius (14–37 n. Chr.)** ist sofort sichtbar.
2. Klicken Sie auf den Chip **Tiberius (14–37 n. Chr.)** oder tippen Sie `Tiberius` in das Suchfeld ein und wählen Sie das Ergebnis.
   * **Erwartetes Ergebnis:** 
     - Das Kulturgut erhält sofort eine neue Datierungszeile in der Tabelle.
     - Epoche: `Tiberische Zeit (Kaiser Tiberius)` mit `PeriodO`-Badge.
     - Von: `0014`, Bis: `0037`.
     - Datierungsangabe: `14 n. Chr. – 37 n. Chr.`.
     - Kanonische PeriodO-ARK-URI: `http://n2t.net/ark:/99152/p05krdx8w33` (klickbarer Link).
3. Wechseln Sie zu **Sektion 01 Sammlung (Collection Information)** und prüfen Sie den Bereich `coverage.temporal`:
   * **Erwartetes Ergebnis:** Ein blauer Infobanner erläutert unmissverständlich, dass Sammlungs-Coverage nur den globalen Makro-Zeitraum beschreibt und die Objektdatierung in Sektion 02 erfolgt.

### Testfall 13: Bereinigter Personen- & Akteurs-Pool (`UX-08`)
1. Öffnen Sie in der Kopfleiste den **Personen-Pool**.
   * **Erwartetes Ergebnis:** Keine vorab gespeicherten Demo-Personen (wie Frank Müller oder Olivia Zorn) mehr vorhanden. Der Zähler steht standardmäßig auf 0.
2. In den Tabellen für Akteure (*Kulturgut*, *Digitale Ressourcen*, *Aktivitäten*) und Kontakte (*Sammlung*) steht bei vorhandenen Einträgen ein Button **Alle leeren** bereit, mit dem zugewiesene Personen mit einem Klick entfernt werden können.

### Testfall 14: Interaktive Fundort-Kartenintegration (`SpatialMapPicker.vue` / `UX-09`)
1. Navigieren Sie zu **Sektion 02 Kulturgut (Heritage Asset)** und scrollen Sie zur Karte **Spatial (Fundort & Geodaten)**.
2. Klicken Sie auf den Button **🗺️ Kartenansicht**:
   * **Erwartetes Ergebnis:** Eine integrierte Kartenansicht klappt auf. Sie bietet Umschaltmöglichkeiten zwischen:
     - **OSM**: Standard OpenStreetMap-Karte
     - **Topo**: Topographische Geländekarte (OpenTopoMap)
     - **Sat**: Hochauflösendes Satelliten- und Luftbild (Esri World Imagery) – ideal für antike Stätten, Topographie und Landschaftskontext.
3. Klicken Sie auf **+ spatial hinzufügen**, um die rechte Drawer-Seitenleiste zu öffnen.
4. Scrollen Sie im Drawer zum Bereich **Quickpoint (Mittelpunkt / Koordinaten)**:
   * **Erwartetes Ergebnis:** Eine interaktive Mini-Karte (`SpatialMapPicker`) ist direkt über den Eingabefeldern für X (Längengrad) und Y (Breitengrad) eingebettet.
5. **Möglichkeit A (Vokabularsuche via Pleiades / GeoNames):**
   - Tippen Sie im Feld *Ort suchen* z.B. `Athens` oder `Ephesos` ein und wählen Sie den antiken Fundort aus.
   - **Erwartetes Ergebnis:** Die Karte zentriert sich automatisch auf die Koordinaten, setzt einen Pin mit Orts-Popup und füllt `geometry.quickpoint.x` und `geometry.quickpoint.y` sowie das Koordinatenreferenzsystem `EPSG:4326 (WGS84)` aus.
6. **Möglichkeit B (Interaktives Click-to-Pick & Pin-Dragging):**
   - Klicken Sie direkt auf die Karte oder ziehen Sie den gesetzten Pin an eine andere Stelle.
   - **Erwartetes Ergebnis:** Die Live-Koordinatenbadge oben im Karten-Toolbar aktualisiert sich in Echtzeit (`Lat, Lng`), und die Zahlenfelder für X und Y übernehmen die exakten Dezimalkoordinaten mit 6 Nachkommastellen.
7. Beachten Sie den **Sticky Submit-Button** am unteren Rand des Drawers: Er bleibt beim Scrollen dauerhaft am unteren Fensterrand sichtbar, sodass Einträge sofort ohne langes Weiterscrollen gespeichert werden können.
8. Nach Klick auf **Hinzufügen** zeigt die Tabelle auf der Hauptkarte den Ort mit Koordinaten an, und die Hauptkartenansicht hebt den Pin mit Zentrierfunktion hervor.

### Testfall 15: Bereinigung Temporale Angaben & Material-Badge-Darstellung (`UX-10` / `DEF-06`)
1. Navigieren Sie zu **Sektion 01 Sammlung (Collection Information)** und scrollen Sie zu **Temporale Angaben (`coverage.temporal`)**:
   * **Erwartetes Ergebnis:** 
     - Die Sektion konzentriert sich rein auf den übergeordneten Makro-Zeitraum der Gesamtsammlung (Epochenname, Von/Bis-Jahre, Datierungsangabe).
     - Die beiden Felder *Scientific date* und *Scientific date method* wurden aus der Sammlungsansicht entfernt.
2. Navigieren Sie zu **Sektion 02 Kulturgut (Heritage Asset)** und öffnen Sie den Drawer **Temporale Angaben (`characters.temporal`)**:
   * **Erwartetes Ergebnis:** 
     - Beim konkreten archäologischen Einzelobjekt stehen die Felder *Scientific date* und *Scientific date method* weiterhin vollständig bereit (für C14-, TL- oder Dendro-Analysen).
3. Laden Sie das Demo-Objekt *Grabnaiskos der Nikarete (SK 740)* über den Aktions-Button oder per XML-Import:
   * **Erwartetes Ergebnis:** 
     - In der Tabelle der gespeicherten Kulturgüter werden die Materialien unter der Spalte *Material* als lesbare Badges (`Pentelischer Marmor`, `Sandstein`) dargestellt – der Fehler `[object Object]` tritt nicht mehr auf.
     - Auch beim Bearbeiten im HECTOR-Material-Picker werden bestehende Objekt-Tags einwandfrei als Text-Chips gerendert.

### Testfall 16: CARARE-Ladefenster, GeoNames-Zugangsdaten & 3D-Metadaten/Paradaten (`UX-11` / `DEF-07`)
1. **Dateiauswahl-Fenster & Button-Hierarchie in der linken Seitenleiste:**
   * **Erwartetes Ergebnis:** 
     - Der prominente Hauptbutton der Seitenleiste heißt nun unmissverständlich **`CARARE-Datei laden`** (`btn-primary`).
     - Ein Klick darauf öffnet sofort das standardmäßige Datei-Öffnen-Fenster (unter Windows / Tauri native File Dialog, im Browser Datei-Picker), vorkonfiguriert für `.xml`, `.zip` (BagIt) und `.json`.
     - Der Musterdatensatz ist als sekundäre Aktion **`Demo: Nikarete (SK 740)`** (`btn-outline btn-accent`) direkt darunter angeordnet.
2. **GeoNames-Zugangsdaten & Passwort / API-Token (`ApiSettingsModal.vue`):**
   * **Erwartetes Ergebnis:**
     - Ein Klick auf **`GeoNames`** in der oberen Kopfleiste oder auf **`API-Zugang (GeoNames)`** in der Seitenleiste öffnet den zentralen Zugangsdaten-Dialog.
     - Es steht ein Feld für den **GeoNames-Benutzernamen** sowie ein separates Feld für **Passwort / API-Token** (markiert mit `Nur bei Premium`) bereit.
     - Ein verständlicher Hinweistext klärt darüber auf, dass für den kostenfreien Standard-Dienst von GeoNames kein Passwort nötig ist, sondern lediglich der registrierte Benutzername bei aktivierten Web-Services auf geonames.org.
     - Mit dem Button **Verbindung testen** kann die Gültigkeit des Benutzernamens direkt geprüft werden.
3. **Kontrollierte 3D-Metadaten & Paradaten in Sektion 03 (`DigitalResourceCrud.vue` / `DigitalResource3DMetadata.vue`):**
   * **Erwartetes Ergebnis:**
     - In Sektion 03 steht ein vollständiges, visuell ansprechendes Steuerungs-Panel **`3D-Modell & Technische Metadaten / Paradaten`** bereit.
     - **3D-Formate (MIME-Types):** Schnellauswahl für OBJ (`model/obj`), glTF 2.0 (`model/gltf+json`, `model/gltf-binary`), PLY (`application/x-ply`), STL, FBX, USDZ sowie Texturformate (TIFF, PNG, JPEG).
     - **Dateigröße (Extent):** Kontrolliertes Zahlenfeld mit wählbarer Einheit (MB, GB, KB, Byte) und Schnellpresets (Web-3D, HQ-Modell, Master-Scan, Archiv). Synchronisiert automatisch mit `<extent>`.
     - **Mesh-Geometrie & Polygone:** Exakte Eingabe von **Polygonanzahl / Faces** (z. B. `15800000` -> formatiert `15,80 Mio.`) und **Vertices** (z. B. `7900000`), Modellkategorie (Master High-Poly, Mid-Poly, Low-Poly VR, 3D-Druck Solid).
     - **Texturen & PBR:** Auflösungs-Chips (1K bis 16K Master) sowie Checkboxen für physikbasierte Karten (`Albedo`, `Normal Map`, `Roughness`, `Metallic`, `Ambient Occlusion`, `Displacement`).
     - **Paradaten der Erfassung:** Scanner-Hardware (`Artec Leo`), Genauigkeit / Auflösung (`0.1 mm`), Kamera und Software-Pipeline (`Artec Studio 19`, `Blender 4.2`, `Substance Designer`).
     - Alle Eingaben werden bidirektional in den CARARE-Standard-Knoten `<formatDetails>` und `<extent>` kodiert.
4. **Paradaten der Digitalisierungsworkflows in Sektion 04 (`ActivityCrud.vue` / `<consistsOf>`):**
   * **Erwartetes Ergebnis:**
     - Der Unterabschnitt ist optisch hervorgehoben als **`🔬 Paradaten der 3D-Digitalisierung & Erfassung (consistsOf)`**.
     - Die Tabelle stellt Zweck (`hadSpecificPurpose`), Methoden (`methods`), Ausrüstung/Software (`equipment`) und Zeitraum übersichtlich dar.
     - Im Drawer stehen Schnellauswahl-Buttons bereit:
       - **Streifenlicht-Scanning (Artec Leo)**
       - **Nahbereichs-Photogrammetrie (Nikon Z8 / SfM)**
       - **Mesh-Verarbeitung & PBR (Blender)**
     - Ein Klick auf ein Preset befüllt Zielbeschreibung, Methoden, optische Messtechniken und Hardware/Software-Spezifikationen automatisch nach aktuellen Best Practices der 3D-Kulturguterfassung.





### Testfall 17: Bereinigung der Seitenleiste & Robuste Ortssuche (UX-12 / DEF-08)
1. **Entfernung des Nikarete-Demo-Buttons aus dem Ladebereich:**
   * **Erwartetes Ergebnis:** 
     - In der Seitenleiste unter *Aktionen & Export* existiert kein Button 'Demo: Nikarete (SK 740)' mehr.
     - Als Ladeaktion steht ausschließlich **'CARARE-Datei laden'** bereit, welcher das Dateiauswahl-Fenster für eigene Dateien öffnet.
     - Über den neuen Button **'Alle Einträge leeren'** können versehentlich geladene oder vorherige Datensätze mit einem Klick aus allen 4 Sektionen vollständig entfernt werden.
2. **Zuverlässige moderne Ortssuche (GeoNames & OpenStreetMap-Fallback):**
   * **Erwartetes Ergebnis:** 
     - Das Eingabefeld für moderne Orte ('PlaceAutocomplete.vue') ist **niemals gesperrt/deaktiviert**, auch wenn noch kein GeoNames-Account hinterlegt wurde.
     - Wurde ein GeoNames-Account hinterlegt, fragt HERMES nun den regulären kostenfreien Web-Service 'api.geonames.org' ab.
     - Bei Tippfehlern oder noch nicht aktivierten Web-Services auf geonames.org zeigt der Button **Verbindung testen** im API-Dialog die exakte Rückmeldung von GeoNames an (z. B. 'GeoNames: user does not exist.' oder 'user account not enabled').
     - Sollte kein GeoNames-Account konfiguriert sein oder die GeoNames-API ein Limit melden, greift automatisch und unterbrechungsfrei die **OpenStreetMap-Ortssuche (Nominatim)**. Jeder weltweite Ort kann somit sofort gesucht, mit Koordinaten ausgewählt und in das CARARE-Metadatenformular übernommen werden.


### Testfall 18: Interaktive Karte, PeriodO-Eingrenzung, Einheitliche DC Relations & Echte 3D-Paradaten (UX-13 / DEF-09)
1. **Dauerhafte Sichtbarkeit der interaktiven Karte (SpatialMapPicker.vue / HeritageAssetIdentificationCrud.vue):**
   * **Problem:** Die Leaflet-Karte unter *Spatial* war standardmäßig eingeklappt (isSpatialMapExpanded: false), sodass Nutzer die Karte gar nicht sahen.
   * **Lösung & Erwartetes Ergebnis:** 
     - Die Karte ist in der Sektion *Heritage Asset Identification* direkt und dauerhaft im Formular eingebettet (Höhe 280 px).
     - Über einen IntersectionObserver wird garantiert, dass Leaflet invalidateSize() aufruft, sobald die Karte in das Sichtfeld gescrollt wird, wodurch Kachel-Artefakte ausgeschlossen sind.
2. **Strikte Eingrenzung des PeriodO-Epochenkatalogs:**
   * **Fachliche Anforderung:** PeriodO gehört ausschließlich zur chronologischen Datierung des originalen Kulturguts (*Heritage Asset*). In Sammlungsbeschreibungen (*Collection Information*) und Digitalisierungs-Workflows (*Activity*) ist PeriodO deplatziert.
   * **Lösung & Erwartetes Ergebnis:**
     - In *Heritage Asset Identification* steht der PeriodO-Gazetteer mit Autocomplete, Schnellfiltern (Tiberius, Augustus, Spätklassik, Hellenismus, Bronzezeit) und Authority-Links vollumfänglich bereit.
     - In *Collection Information* und *Activity* wurde PeriodO vollständig aus Template, Skript und State-Bindings entfernt.
3. **Zentraler Dublin Core / CARARE Relations Manager (DigitalResourceDcRelations.vue):**
   * **Problem:** Zuvor wurden 9 separate, leere Listenfelder (isRepresentationOf, hasPart, isPartOf, nextInSequence, isPreviousInSequence, isDerivativeOf, hasDerivative, createdDerivative, dcRelation) untereinander gerendert, die das Formular übermäßig aufblähten.
   * **Lösung & Erwartetes Ergebnis:**
     - Ein übersichtliches, modulares Komponenten-Panel **Beziehungen & Verknüpfungen (DC Relations)** ersetzt die 9 Einzelboxen vollständig.
     - Der Beziehungstyp wird per Dropdown ausgewählt (z. B. *Ist Darstellung von (Kulturgut)*, *Hat Ableitung (z. B. Game-Ready aus Master)*, *Ist Ableitung von (Quelle)*, etc.).
     - Das Ziel kann direkt aus den im Projekt vorhandenen Kulturgütern (z. B. Schnell-Klick auf 🏛️ SK 740 (Nikarete)) oder anderen Digitalisaten ausgewählt bzw. als URI eingegeben werden.
     - Eine kompakte Tabelle visualisiert alle aktiven Verknüpfungen inklusive Badges, CARARE-Tags und direkter Bearbeitungs-/Löschfunktion. Volle Abwärtskompatibilität zum CARARE 2.0.6 XML-Export bleibt gewährleistet.
4. **Fachliche Trennung von 3D-Metadaten und 3D-Paradaten (DigitalResource3DMetadata.vue & DigitalResourceParadata.vue):**
   * **Fachlicher Hintergrund:** 
     - **Technische Metadaten:** Objektive Maße und Parameter des Endprodukts (Dateiformat OBJ/glTF, Polygon-/Vertex-Anzahl, Textur-Auflösung 8K, PBR-Kanäle, Scanner-Modell und Messgenauigkeit).
     - **Paradaten (London Charter / Sevilla Principles):** Dokumentation der *methodischen Entscheidungen, menschlichen Eingriffe und Limitationen* im Erfassungs- und Bearbeitungsprozess.
   * **Erwartetes Ergebnis:**
     - Eigene, strukturierte Paradaten-Sektion mit gezielten Praxisfeldern:
       - **Aufnahmebereich & Limitationen:** z. B. *'Nur Vorderseite erfasst; Sockel und Rückseite aufgrund von Wandmontage/Vitrinenaufstellung weggelassen.'*
       - **Mesh-Reparatur & Modellierungs-Eingriffe:** z. B. *'Geometrische Löcher in Gewandfalten per Screened Poisson Reconstruction geschlossen; Messrauschen bilateral geglättet.'*
       - **Shader- & Texturentscheidungen:** z. B. *'Händisch Subsurface Scattering (SSS) Map zur Simulation der Marmor-Transluzenz in Blender erstellt; Normal Map von 15,8 Mio. High-Poly auf Game-Ready Low-Poly gebacken.'*
       - **Wissenschaftliche Begründung & Paradata-Notiz:** Dokumentation der interpretativen Entscheidungen für wissenschaftliche Nachvollziehbarkeit.
     - **1-Klick-Synchronisation:** Über den Button *In CARARE Description & Note synchronisieren* werden die Paradaten automatisch in den CARARE <description>- und <note>-Knoten der Ressource formatiert überführt.
5. **Workflow für mehrere Digitalisate je Kulturgut (Master vs. Derivate):**
   * Über Schnell-Buttons am Kopf der Digital Resource-Sektion (**+ Master-File (High-Poly)** und **+ Game-Ready Derivat**) können mit einem Klick standardisierte Digitalisate angelegt werden.
   * Beide Digitalisate können anschließend über die DC Relations (hasDerivative ↔ isDerivativeOf) und isRepresentationOf miteinander und mit dem Kulturgut (SK 740) verknüpft werden.
### Testfall 19: Trennung von Sammlungs-ID & Institutionsname (GND) sowie antike Pleiades-Fundortsuche & Kontrastoptimierung (`UX-14` / `DEF-10`)

1. **Trennung von Sammlungs-ID und Institutionsname (`CollectionInformationCrud.vue`):**
   * **Problem:** In Sektion 01 (*Collection Information*) stand zuvor in beiden Eingabefeldern (Identifikator und Quelle) fälschlicherweise die ID, bzw. zwei Autocomplete-Felder überlagerten sich. Zudem schien die GND-Suche im Source-Feld nicht zu reagieren, da das Autocomplete-Feld vom Standard-Textinput visuell verdeckt war.
   * **Lösung & Erwartetes Ergebnis:**
     - Das obere Feld **Identifikator (`id`)** dient eindeutig der Kennung der Sammlung (z. B. GND-Nummer `5035657-4` oder Projekt-ID `HERMES-COLLECTION-001`). Es enthält keine redundante Autocomplete-Überlagerung mehr.
     - Das untere Feld **Quelle / Institution (`source`)** ist jetzt direkt als vollwertige GND-Institutionensuche (`InstitutionAutocomplete.vue`) integriert.
     - Wird eine Institution aus dem GND-Katalog ausgewählt (z. B. *Antikensammlung, Staatliche Museen zu Berlin*):
       - Erhält das untere Feld (`source`) den lesbaren Namen der Institution: `Antikensammlung, Staatliche Museen zu Berlin`.
       - Erhält das obere Feld (`id`) automatisch die GND-ID (z. B. `5035657-4`) oder bietet sie bei bereits manuell vergebener Projekt-ID als Schnellklick-Chip (`🏛️ GND-ID: 5035657-4 als ID übernehmen`) an.
     - Die sofortige Tastatureingabe im Source-Feld aktualisiert das Datenmodell `v-model` in Echtzeit ohne Blockade oder Wartezeit.
     - Ein integrierter, kuratierter Schnell-Cache (Antikensammlung Berlin, SPK, BCDH Bonn, DAI, Louvre, British Museum, etc.) sorgt für 0 ms Reaktionszeit bei gleichzeitiger Live-Hintergrundabfrage der Lobid-GND-API.

2. **Antike Fundortsuche via Pleiades & DAI Archaeological Gazetteer (`PlaceAutocomplete.vue` / `vite.config.js`):**
   * **Problem:** Die antike Fundortsuche über Pleiades lieferte im Browser keine Treffer, da `pleiades.stoa.org` keine Cross-Origin Resource Sharing (CORS)-Header (`Access-Control-Allow-Origin: *`) für den XML/RSS-Endpunkt mitsendet und direkte Anfragen blockiert wurden.
   * **Lösung & Erwartetes Ergebnis:**
     - In der Vite-Entwicklungsumgebung leitet ein lokaler Proxy `/api/pleiades` die Suchanfragen an `https://pleiades.stoa.org` unter Umgehung von CORS weiter.
     - Als robuster, nativer CORS-Gazetteer für antike und archäologische Stätten wurde zusätzlich der **DAI Archaeological Gazetteer** (`gazetteer.dainst.org`) angebunden.
     - Der DAI-Gazetteer liefert verlässliche WGS84-Koordinaten `[lng, lat]` und verlinkt antike Stätten direkt auf die entsprechenden Pleiades-URIs (`context: "pleiades"`).
     - Zusätzlich wird bei direkter Eingabe oder Identifikation einer Pleiades-ID die JSON-API (`pleiades.stoa.org/places/{id}/json`, welche CORS nativ unterstützt) konsultiert.
     - Das Regex-basierte Parsing garantiert, dass antike Fundorte (z. B. *Kerameikos*, *Athens*, *Ephesos*, *Pergamon*) sofort in den Vorschlägen erscheinen und beim Klick automatisch die exakten WGS84-Dezimalkoordinaten in die Spatial-Felder und Karte übertragen.

3. **Kontrastoptimierung des "Close Map"-Buttons (`HeritageAssetIdentificationCrud.vue`):**
   * **Problem:** Beim Öffnen der interaktiven Kartenansicht in Sektion 02 (*Spatial*) war der Umschaltbutton weißer Text auf weißem/transparentem Hintergrund (`btn-ghost text-white`) und damit für Nutzer unsichtbar bzw. unlesbar.
   * **Lösung & Erwartetes Ergebnis:**
     - Der Button besitzt nun in jedem Zustand klaren Kontrast und visuelles Feedback:
       - Im geöffneten Zustand: `btn-neutral text-neutral-content shadow-sm` mit `✕ Karte einklappen`.
       - Im geschlossenen Zustand: `btn-outline border-base-300 text-base-content hover:bg-base-200` mit `🗺️ Kartenansicht anzeigen`.
     - Der Button hebt sich auf allen DaisyUI-Themes (Light, Dark, Cupcake, etc.) deutlich lesbar von der Hintergrundkarte und dem umgebenden Formular ab.
### Testfall 20: Vollständiger CARARE 2.0.6 Referenzdatensatz für alle Felder (Phantasieobjekt: Oreichalkos-Sphäre des Atlas)

* **Referenzdateien im Projektarchiv:**
  - XML-Datei: [`CARARE/CARARE_Phantasieobjekt_Atlas_Sphaere.xml`](file:///d:/Software_Dev/HERMES_test/HERMES_test/CARARE/CARARE_Phantasieobjekt_Atlas_Sphaere.xml)
  - BagIt-ZIP-Archiv: [`CARARE/CARARE_Phantasieobjekt_Atlas_Sphaere_bagit.zip`](file:///d:/Software_Dev/HERMES_test/HERMES_test/CARARE/CARARE_Phantasieobjekt_Atlas_Sphaere_bagit.zip)
  - Generator- und Validierungsskript: [`generate_fantasy_carare_xml.py`](file:///d:/Software_Dev/HERMES_test/HERMES_test/generate_fantasy_carare_xml.py)
  - Bereitstellung für HTTP/Browser-Laden: [`public/CARARE_Phantasieobjekt_Atlas_Sphaere.xml`](file:///d:/Software_Dev/HERMES_test/HERMES_test/public/CARARE_Phantasieobjekt_Atlas_Sphaere.xml)

1. **Schema-Validierung gegen `carare-v2.0.6.xsd`:**
   * **Ergebnis:** `Schema Validation Result: True` (100% valide nach offizieller Schemadefinition, 0 Fehler).
   * **Strikte Sequenzkonformität:** Alle Elemente in `<collectionInformation>`, `<heritageAssetIdentification>`, `<digitalResource>` und `<activity>` folgen exakt der von der XSD vorgeschriebenen XML-Sequenz (inklusive der Dublin Core / CARARE Relations: `hasRepresentation` → `isSuccessorOf` → `wasPresentAt` → `hasPart` → `isPartOf` → `isReplicaOf` → `wasDigitizedBy` → `dcRelation`).

2. **Fachliche Bespielung sämtlicher Felder (Phantasie-Objektbeschreibung):**
   * **Sektion 01: Sammlung (Collection Information):**
     - Identifikator: `DE-IAA-9999999_Atlantis_Curated_Collection`
     - Mehrsprachiger Titel: *„Schätze der ägäischen Tiefen: Das Pantheon der versunkenen Sphären von Thera-Atlantis“* (DE, bevorzugt) & *„Treasures of the Aegean Deeps: The Pantheon of Sunken Spheres of Thera-Atlantis“* (EN)
     - Quelle / Institution: *Institut für Archäo-Astronomie und Imaginäre Altertümer (IAA), Bonn*
     - Kontakte: Vollständige Kontaktblöcke (Prof. Dr. Aurelia Thalassa von Morstein, Dr. Lysandros Kephalos) mit Adresse (Gebäude, Hausnummer, Straße, Stadt, PLZ, Land), Telefon, Fax und E-Mail.
     - Rechte: Vollständige Rechteangaben (`copyrightCreditLine`, `accessRights`, `reproductionRights`, `licence` CC BY-SA 4.0 sowie konformer `europeanaRights`-Enum-Wert).
     - Sprachen: `de`, `en`
     - Statement: Ausführliches kuratorisches Sammlungskonzept.
     - Erstellung: `createdOn` (`2026-10-23`) und `query`.
     - Schlagworte: 10 kontrollierte Fachbegriffe (mit Namespaces HECTOR, AAT, Pleiades, HERMES).
     - Abdeckung: Zeitspanne (`-1400` bis `-1180`), PeriodO-ARK-URI, Epochenname, Benannter Ort (*Versunkene Caldera-Terrasse von Thera*), Geopolitisches Gebiet, Katasterreferenz.
   * **Sektion 02: Kulturgut (Heritage Asset Identification):**
     - Datensatzinformationen: ID (`HERMES-HA-ATL-001`), Quelle, Land (`DE`), Erstellungsdatum, Metadatenrechte.
     - Benennung: 3-sprachiger Objektname (DE, EN, GRC) und Inventarnummer (`IAA-INV-2026-SPH-01`).
     - Beschreibung: Fundort- und Funktionsbeschreibung des Himmelsglobus mit Zahnradmechanik.
     - Objekttyp (`generalType`): `Artefact` (CARARE-Enum).
     - Akteure: Expeditionsleiterin/Entdeckerin, Restaurator und 3D-Labor mit Rollen und Wirkungsort.
     - Schutzstatus & Zustand: UNESCO-Klasse I Denkmalschutz, Zustandsbefund mit Gutachtendatum und Aufbewahrungsort während der Untersuchung.
     - Provenienz: Bergung aus 142 m Tiefe am submarinen Seamount von Santorin (Tauchkampagne AETHRA 2025).
     - Eigenschaften (Characters):
       - Objekttypen: *Kultisches Instrument* (HECTOR), *astronomical models* (AAT), *spheres* (AAT).
       - Datierung: Späthelladisch III B (`-1350` bis `-1280`), PeriodO-ARK-Identifikator, Naturwissenschaftliche Datierung (`1325 ± 25 calBC` via C14 & OSL).
       - Materialien: *Oreichalkos*, *Lapislazuli*, *Bergkristall*, *Meteoriteneisen*.
       - Inschriften: Kypro-minoischer Text mit Zodiak-Skala.
       - Dimensionen: 4 Messwerte (Durchmesser 48,5 cm, Höhe 62,0 cm, Gesamtmasse 18,75 kg, Wandstärke 4,2 mm) mit Messart, Einheiten und Werten.
     - Fundort & Geodaten (Spatial): Quickpoint-Koordinaten X (`25.432500` Lng), Y (`36.385400` Lat), Z (`-142.5` m unter NN), Genauigkeit (`± 1.5 m`), historischer Name (`Kallistē / Strongylē`).
     - Aufbewahrungsort: *IAA Bonn, Schatzkammer der Ägäis, Saal IV, Vitrine 12*.
     - Literatur & Referenzen: Peer-Reviewed Monographie mit Autoren, DOI-Link, Typ und Rechten.
     - Beziehungen (DC Relations): Vollständige Verknüpfung zu den 2 Digitalisaten, Nachfolge-, Teil-, Ensemble- und Digitalisierungsbeziehungen.
   * **Sektion 03: Digitale Ressourcen (2 strukturierte Modelle):**
     - **Digitalisat 1 (Master High-Poly Scan):** ID `DO_IAA_ATL_SPH01_MASTER_HP`, Formate `model/obj`, `application/x-ply`, `image/tiff`, 32,4 Mio. Polygone, 16,2 Mio. Vertices, 16K Master PBR-Texturen (Albedo, Normal, Roughness, Metallic, AO, Height), 1,42 GB Dateigröße, strukturierte 3D-Paradaten nach London Charter (Aufnahmebereich, Poisson Depth 14, bilateral geglättetes Rauschen).
     - **Digitalisat 2 (Game-Ready Web3D Derivat):** ID `DO_IAA_ATL_SPH01_WEB3D_GLTF`, Formate `model/gltf-binary` (GLB) & `model/gltf+json`, 85.000 Triangles, 4K PBR, Draco-Kompression, 14,8 MB, verknüpft als `isDerivativeOf` zum Master-Scan und `isRepresentationOf` zum Kulturgut.
   * **Sektion 04: Aktivitäten & Workflows (Activity & Paradata):**
     - Maßnahme: `ACT-2026-IAA-DIGI-01` mit Event-Type `3D digitisation` (AAT: 300435427), Zweckbeschreibung, Messtechnikern und Projektzeitraum.
     - Strukturierte Paradaten (`consistsOf`):
       1. *Streifenlicht-Scanning (Artec Leo 2026 Pro, 0.05 mm optische Triangulation)*
       2. *Makro-Photogrammetrie (Sony A7R V, polarisiertes Ringlicht, RealityCapture)*
       3. *Mesh-Fusion & PBR-Baking (Blender 4.2 LTS, Substance 3D Designer)*
     - Qualitätssicherung: ISO 17025 Prüfbericht (mittlere Abweichung < 0.03 mm, Farbtreue Delta-E < 1.2).
     - Verknüpfung zu den erstellten Digitalisaten über `<hasCreated>`.

### Testfall 21: Zentralisierte Organisations- & Sammlungs-Pools sowie modernes Listen- und UX-Design (`UX-15` / `DEF-11`)

* **Kontext & Nutzeranforderung:**
  Analog zum bestehenden Personen- und Akteurs-Pool sollten auch **Organisationen/Institutionen** sowie **Sammlungen (Collections)** in zentralen, wiederverwendbaren Listen und Pools verwaltet werden können. Zudem fehlte in Sektion 01 (*Collection Information*) eine sichtbare Tabellenliste der erfassten Datensätze (wie sie in Sektion 02 für Kulturgüter existiert), und die gesamte UX sollte so modern, intuitiv und nutzerfreundlich wie möglich gestaltet werden.

1. **Zentraler Organisations- & Institutionen-Pool (`OrganizationPickerModal.vue` / `sharedState.js`):**
   * **Datenmodell & Persistenz:** 
     - Neues globales State-Ref `savedOrganizations` mit dauerhafter `localStorage`-Synchronisation (`hermes_saved_organizations`).
     - Initial befüllt mit 8 kuratierten, wissenschaftlichen Referenz-Institutionen inkl. offizieller GND-Nummern:
       - *Antikensammlung, Staatliche Museen zu Berlin* (GND `5035657-4`)
       - *Ägyptisches Museum und Papyrussammlung, Berlin* (GND `5035658-6`)
       - *Musée du Louvre, Paris* (GND `1006837-5`)
       - *The British Museum, London* (GND `38352-1`)
       - *Deutsches Archäologisches Institut (DAI), Zentrale Berlin* (GND `1012979-0`)
       - *Bonn Center for Digital Humanities (BCDH), Universität Bonn* (GND `1331890259`)
       - *Stiftung Preußischer Kulturbesitz (SPK), Berlin* (GND `35353-X`)
       - *Leibniz-Zentrum für Archäologie (LEIZA), Mainz* (GND `1277196677`)
   * **Modal-Funktionalität:**
     - **Manage-Modus:** Live-Suche über Name, GND, Stadt und Rolle; Filter-Chips (*Alle*, *Museen*, *Universitäten/Forschung*); Inline-Erfassung neuer Einrichtungen mit GND-Prüfung; direkter Link zum Lobid/DNB-GND-Katalog (`https://d-nb.info/gnd/...`).
     - **Pick-Modus:** 1-Klick-Auswahl (`✓ Auswählen / Übernehmen`), die Namen und GND-ID direkt in das jeweilige Zielfeld einsetzt.

2. **Zentraler Sammlungs-Pool & Vorlagen-Manager (`CollectionPickerModal.vue` / `sharedState.js`):**
   * **Datenmodell & Persistenz:** 
     - Neues globales State-Ref `savedCollections` mit `localStorage`-Synchronisation (`hermes_saved_collections`).
     - Initial befüllt mit 3 kuratierten, vollständigen Sammlungs-Profilen:
       - *Antikensammlung Berlin – Skulpturen und Grabmonumente* (`DE-MUS-814111_Antikensammlung_Skulpturen`)
       - *Grabensemble der Dame Tairkap (ÄM 3 – ÄM 6)* (`DE-MUS-015418_Tairkap_Ensemble`)
       - *Schätze der ägäischen Tiefen: Das Pantheon der versunkenen Sphären von Thera-Atlantis* (`DE-IAA-9999999_Atlantis_Curated_Collection`)
   * **Rich-Cards:** Anzeige von ID-Badge, Institutions-Tag, Lizenz-Badge, mehrsprachigen Titeln, kuratorischem Statement und Schlagwort-Chips (`#Grabrelief`, `#Marmor`, `#3D-Digitalisierung`, etc.).
   * **1-Klick-Übernahme:** Button `✓ In Editor laden` überträgt ID, Titel, Quelle, Rechte und Schlagworte nahtlos in Sektion 01.
   * **Template-Export:** Button `💾 Im Pool merken` in Sektion 01 speichert den aktuell bearbeiteten Sammlungsdatensatz sofort als neues Profil in den Pool.

3. **Obere Toolbar & Schnellzugriff (`GlobalDefaultsBar.vue` & `App.vue`):**
   * Drei übersichtliche, responsive Pill-Buttons mit Live-Counter-Badges:
     - `👥 Personen [ X ]`
     - `🏛️ Organisationen [ 8 ]`
     - `📂 Sammlungen [ 3 ]`
   * Aus jedem Schritt des Workflows kann der jeweilige Pool mit einem Klick aufgerufen, durchsucht oder ergänzt werden.
   * Die Auswahl einer Sammlung aus der Kopfleiste aktualisiert automatisch Sektion 01 und scrollt sanft dorthin.

4. **Listen- und Tabellendarstellung für Sammlungen (`CollectionInformationCrud.vue`):**
   * **Tabelle gespeicherter Sammlungen:**
     - Am oberen Rand von Sektion 01 visualisiert eine neue Tabelle `📂 Gespeicherte Sammlungen (Collections)` alle vorhandenen Sammlungsdatensätze mit ID, Titel, Institution und Aktionsbuttons (`Bearbeiten`, `Duplizieren`, `Im Pool merken`, `Löschen`).
     - Ein Klick auf `Bearbeiten` lädt den Eintrag in das Formular und aktiviert die Kennzeichnung `Bearbeitungsmodus aktiv (Eintrag #X aktiv)`.
     - `➕ Neue Sammlung` leert das Formular für die Eingabe eines weiteren Sammlungsdatensatzes.
   * **Organisations-Schnellauswahl im Quellfeld:**
     - Neben dem Feld *Quelle (Name der Einrichtung)* ermöglicht der Button `🏛️ Aus Organisations-Pool wählen` die sofortige Übernahme kuratierter Einrichtungen.

5. **Flächendeckende Organisations-Schnellauswahl in allen Sektionen:**
   * **Sektion 02 (Kulturgüter):** Button `🏛️ Aus Organisations-Pool` in den Kopfleisten von *Kontakte* und *Akteure* sowie neben dem Eingabefeld *Aufbewahrungsort / Repository*.
   * **Sektion 03 (Digitale Ressourcen):** Button `🏛️ Aus Organisations-Pool` in den Kopfleisten von *Kontakte* und *Akteure*.
   * **Sektion 04 (Aktivitäten / Workflows):** Button `🏛️ Aus Organisations-Pool` in der Kopfleiste von *Akteure* sowie neben dem Feld *Ort der Maßnahme (`happenedAt`)*.

### Testfall 22: Massenerfassung für Großbestände – Kampagnen-Klammer, Grid-View, Bulk-Actions & Qualitäts-Dashboard (`UX-16` / `DEF-12`)

* **Kontext & Nutzeranforderung:**
  Museumsmitarbeiter und Digitalisierungsteams stehen regelmäßig vor der Aufgabe, Sammlungs- und Grabungskonvolute von 300 oder mehr Objekten (z.B. antike Münzen, Keramikfragmente, Grabbeigaben, 3D-Scans) mit präzisen Metadaten und technischen Paradaten anzureichern. Eine rein serielle Einzelerfassung im Detail-Drawer ist bei solchen Volumina extrem zeitintensiv. Zur drastischen Beschleunigung wurden vier Kernmechanismen implementiert:
  1. **Feature 3:** Globale Kampagnen-Vererbung (*Master Campaign / Presets*)
  2. **Feature 4:** Tabellen-Modus (*Grid / Spreadsheet View*) für direkte Inline-Massenbearbeitung
  3. **Feature 5:** Multi-Select Bulk Actions & Smart Duplicate (*Klonen mit Inkrementierung*)
  4. **Feature 6:** CARARE-Qualitäts-Dashboard mit Ampelsystem und Live-Filterung

1. **Globale Kampagnen-Vererbung / Master Campaign (`CampaignPresetModal.vue` / `sharedState.js`):**
   * **Kopfleisten-Zugriff & Live-Status:**
     - Neuer Schnellzugriff-Button `🎯 Kampagne` in der oberen Toolbar (`GlobalDefaultsBar.vue`).
     - Live-Status-Badge zeigt sofort an, ob eine Kampagne aktiv (`Aktiv`) oder pausiert (`Aus`) ist.
   * **Strukturierte Kampagnen-Definition:**
     - **Projekt & Institution:** Kampagnen-/Projektname, Verantwortliche Institution (inkl. 1-Klick-Übernahme aus dem Organisations-Pool) und Aufbewahrungsort (*Repository*).
     - **Rechte & Lizenzierung:** Standard-Nutzungslizenz (z.B. `CC BY 4.0`, `CC0 1.0`, `InC-EDU`, etc.) und Rechteinhaber.
     - **3D-Equipment & Paradaten:** Erfassungsmethode (Streifenlicht-Scanning, Photogrammetrie, CT, etc.), Messgerät/Scanner-Modell, Erfassungssoftware.
     - **Objekt-Defaults:** Epoche / Datierung und Standardmaterial für typgleiche Serienfunde.
   * **Vorlagen & Automatisierung:**
     - 3 Schnellvorlagen per Klick: *3D-Streifenlicht-Scan*, *Photogrammetrie & Texturen*, *Museums-Inventur*.
     - Checkbox *Auto-Fill bei Neuanlage*: Neue Kulturgüter, Digitalisate und Aktivitäten übernehmen die Kampagnendaten automatisch im Hintergrund.
     - Button `⚡ Auf alle vorhandenen Objekte anwenden`: Vererbt die Kampagnen-Einstellungen stapelweise auf alle bereits im Speicher liegenden Datensätze (Kulturgüter, Digitalisate, Aktivitäten) unter Bewahrung vorhandener Individualdaten.
     - Button `🎯 Aus Kampagne vererben` im Formular-Header von Sektion 02: Ermöglicht das gezielte Synchronisieren des aktuell bearbeiteten Einzelobjekts mit der aktiven Kampagne.

2. **Tabellen-Modus / Grid-View für Massenerfassung (`HeritageAssetIdentificationCrud.vue`):**
   * **View-Mode-Switcher:**
     - Segmentierter Umschalter in Sektion 02: `📋 Listen-Modus` vs. `📊 Tabellen-Modus (Grid)`.
   * **Interaktive Tabellenmatrix:**
     - Kompakte Darstellung mit voller vertikaler und horizontaler Raumausnutzung für die Serienbearbeitung.
     - Direkte Inline-Eingabefelder für Kernattribute:
       - **ID:** Direkte Texteingabe mit sofortiger Rot-Hervorhebung bei leeren IDs oder Duplikaten.
       - **Titel / Bezeichnung:** Inline-Textfeld für schnelle Titelkorrekturen.
       - **Materialien:** Semikolon-separierte Schnelleingabe (`Marmor; Bronze; Gold`).
       - **Zeitstellung / Epoche:** Freitext für Perioden- oder Jahrhundertangaben.
       - **Aufbewahrungsort:** Sofort editierbare Magazin-/Vitrinen- und Standortbezeichnung.
       - **Lizenz:** Inline Dropdown-Auswahl der CARARE-Rechteauszeichnung.
     - Button `➕ Neue Zeile in Tabelle einfügen (Excel-Workflow)` am unteren Tabellenrand: Legt sofort eine neue leere bzw. kampagnenvorbefüllte Zeile an und setzt den Cursor ohne Drawer-Öffnung direkt in die Tabelle.

3. **Multi-Select Bulk Actions & Smart Duplicate (`HeritageAssetIdentificationCrud.vue`):**
   * **Checkbox-Mehrfachauswahl:**
     - Kopfzeilen-Checkbox zur gleichzeitigen Auswahl aller aktuell gefilterten Objekte.
     - Einzel-Checkboxen in jeder Zeile der Grid- und Listenansicht.
   * **Schwebende Aktionsleiste (Floating Sticky Bulk Action Bar):**
     - Erscheint automatisch am unteren Bildschirmrand, sobald `≥ 1` Objekt markiert ist.
     - Zähler mit Live-Anzeige: `X Objekte ausgewählt`.
     - **🎯 Aus Kampagne vererben:** Überträgt die aktiven Kampagnenparameter gleichzeitig auf alle markierten Objekte.
     - **⚖️ Lizenz zuweisen:** Öffnet einen Schnellauswahldialog zur gleichzeitigen Vergabe der Nutzungslizenz für alle markierten Datensätze.
     - **🏛️ Aufbewahrungsort:** Weist allen ausgewählten Datensätzen simultan ein Magazin/Repository zu.
     - **🗑️ Löschen:** Ermöglicht das gesammelte Löschen unbrauchbarer Datensätze nach Bestätigung.
     - **✕ Abwählen:** Hebt die gesamte Markierung mit einem Klick auf.
   * **Smart Duplicate ("Klonen mit Inkrementierung"):**
     - Neuer Aktionsbutton `⚡+ Klonen (+1)` / Smart Duplicate bei jedem Datensatz.
     - Verwendet `incrementStringNumber`: Erkennt numerische Suffixe und zählt diese intelligent hoch (`INV-2026-001` ➔ `INV-2026-002`, `OBJ_9` ➔ `OBJ_10`, `Fragment A` ➔ `Fragment B`).
     - Übernimmt alle übergeordneten Kontexteigenschaften (Typus, Fundort, Datierung, Material, Institution, Rechte).
     - Setzt unikatsspezifische Felder wie Dimensionen, Inschriften und Einzelrelationen automatisch zurück.
     - Sortiert das Duplikat ergonomisch direkt als Nachfolger unter das Ausgangsobjekt ein.

4. **Qualitäts-Dashboard & CARARE-Ampelsystem (`HeritageAssetIdentificationCrud.vue`):**
   * **KPI-Chips mit Live-Status:**
     - `📦 Gesamt [ X ]`: Gesamtzahl aller erfassten Kulturgüter.
     - `🟢 Valide & Vollständig [ X ]`: CARARE-konform (Gültige ID, Titel, Material/Epoche, Repository und Lizenz vorhanden).
     - `🟡 Unvollständig [ X ]`: Mindestvoraussetzungen erfüllt, es fehlen jedoch empfohlene Metadaten (z.B. Material oder Zeitstellung).
     - `🔴 Kritische Fehler [ X ]`: CARARE-Mindeststandard verletzt (fehlende ID, ungültiges Format oder kein Titel).
   * **Interaktive Schnellfilter:**
     - Ein Klick auf einen der KPI-Chips filtert die Liste/Tabelle sofort auf die betreffende Kategorie (z.B. nur unvollständige oder fehlerhafte Objekte anzeigen).
   * **Fortschrittsbalken:**
     - Farbcodierter Balken visualisiert den relativen Prozentsatz exportbereiter Objekte (`X% CARARE-konform & exportbereit`).
   * **Echtzeit-Suchfeld:**
     - Volltextsuche über Identifikatoren, Titel, Materialien und Aufbewahrungsorte mit sofortiger Filterung der Tabellenzeilen.

### Testfall 23: Behebung visueller Header-Überlagerungen & Vollständige CARARE 2.0.6 XSD-Feldvalidierung (`UX-17` / `DEF-13`)

* **Kontext & Nutzeranforderung:**
  Beim Scrollen durch die Formulare überlagerten sich Sektions-Kartenheader (insbesondere `01 Collection`) mit darunterliegenden Tabellen- und Formularfeldern (`Saved Collections`), da die Header mit `sticky top-16` versehen waren und Elemente unter sich abschnitten. Gleichzeitig forderte der Nutzer eine erneute, exakte Validierung jedes einzelnen Feldes gegen das offizielle CARARE 2.0.6 XML-Schema (`carare-v2.0.6.xsd`).

1. **Behebung der visuellen Überlagerungen (`App.vue` & `HeritageAssetIdentificationCrud.vue`):**
   * **Befund:** In `App.vue` besaß der `<div class="glass-panel sticky top-16 z-30 ...">`-Header jeder Sektionskarte eine klebrige Positionierung (`sticky top-16`). Sobald der Anwender nach unten scrollte, blieb die Kopfzeile bei 64px stehen, während der Karteninhalt nach oben glitt und durch die halbtransparente Glassmorphism-Optik hindurchsickerte bzw. die oberen 20 Pixel der darunterliegenden Boxen abschnitt.
   * **Lösung:** 
     - Entfernung von `sticky top-16 z-30` von den Kartenkopfzeilen in [App.vue](file:///d:/Software_Dev/HERMES_test/HERMES_test/src/App.vue). Die Kopfzeilen verbleiben nun natürlich verankert am oberen Rand der jeweiligen Karte (`bg-base-100/90 rounded-t-2xl`) und scrollen nahtlos mit.
     - Die globale Orientierung bleibt durch die ohnehin permanent sichtbare obere Navigationsleiste (`glass-header sticky top-0 z-50` mit Section-Pills) sowie die linke Baum-Sidebar dauerhaft garantiert.
     - In [HeritageAssetIdentificationCrud.vue](file:///d:/Software_Dev/HERMES_test/HERMES_test/src/output_components/HeritageAssetIdentificationCrud.vue) wurde die schwebende Sammelaktionsleiste für Mehrfachauswahlen von `sticky top-20` auf `sticky bottom-6 z-30 shadow-2xl` verlegt. Sie schwebt nun als modernes, ergonomisches Action-Dock am unteren Rand und verdeckt zu keinem Zeitpunkt mehr Tabellenheader oder Suchleisten.

2. **Exakte CARARE 2.0.6 XSD-Feld- und Sequenzvalidierung:**
   * **Vollständige Sequenzangleichung (`schemaSequenceMap`):**
     - Sämtliche 35+ CARARE-Typen und -Elemente wurden direkt aus `CARARE/carare-v2.0.6.xsd` extrahiert und in `schemaSequenceMap` eingepflegt (inkl. `consistsOf`, `references`, `designations`, `conditions`, `publicationStatement`, `quickpoint`, `boundingBox`, `cartesianCoordinates3D`, `vitalDates`, `craft`, `lastJourneyDetails`, `coverage`, `creation`, `update` und `address` mit `postcodeOrZipcode`, `locality`, `adminArea`).
   * **Automatisierte Schema-Normalisierung (`cleanAndValidateNode`):**
     - **Pflichtattribut `lang`:** Erzwingt das vom Schema verlangte `lang`-Attribut für `<description>`- sowie `<appellation><name>`-Elemente (z.B. auch in `references`).
     - **Attribut-Bereinigung:** Entfernt verbotene Attribute von Wrapper-Tags (`spatial` und `references` dürfen im XSD kein `lang` oder `preferred` aufweisen; `country` darf kein `authority` besitzen).
     - **Enumerations-Mapping für `generalType`:** Mappt abweichende Werte (z.B. `"physical object"`) strikt auf die erlaubte CARARE-Menge `{'Monument', 'Artefact', 'Text', 'Image', 'Sound', 'Movie', '3D'}`.
     - **Enumerations-Mapping für `digitalResource.type`:** Strikte Beschränkung auf `{'Text', 'Image', 'Sound', 'Movie', '3D'}` (z.B. automatische Umwandlung von `"3D model"` in `"3D"`).
     - **MANDATORY `<link>` in `digitalResource`:** Stellt sicher, dass das im XSD als `minOccurs="1"` definierte Pflichtelement `<link type="xs:anyURI">` in jeder digitalen Ressource vorhanden ist.
     - **ISO-Datumsformat:** 4-stellige Jahresangaben bei `xs:date`-Feldern (`createdOn`, `date`) werden automatisch zu normierten ISO-Daten `YYYY-01-01` ergänzt.
     - **Boolesche Attribute:** Strikte Ausgabe von kleingeschriebenem `"true"` / `"false"` für `preferred`, `openAccess` und `isPart`.
   * **Validierungsergebnis:**
     - Alle 11 integrierten Standard-Templates und Beispielprofile (`default_templates.json`) wurden mit `lxml.etree.XMLSchema` gegen `carare-v2.0.6.xsd` getestet und bestehen die Validierung zu **100% fehlerfrei** (`11/11 PASSED`).

### Testfall 24: Praxisnahes, zweisprachiges HTML-Handbuch für Museums- und Grabungsbetrieb (`UX-18` / `DOC-01`)

* **Kontext & Nutzeranforderung:**
  Für den regulären Grabungs- und Museumsalltag wurde ein verständliches, visuell ansprechendes ("super hübsches") und interaktives Handbuch in Deutsch und Englisch gefordert, das alle Anwender – von studentischen Grabungshelfern über Grabungsleiter und Restauratoren bis zu Museumsregistraren – abholt und komplexe Metadatenstandards praxisnah erklärt.

1. **Architektur & Bereitstellung (`public/manual.html` & `HERMES_Handbuch_Manual.html`):**
   * **Eigenständige, portable HTML5-Single-Page-Applikation:**
     - Direkt im Browser ohne Build-Tools oder Server offline lauffähig (z.B. im Grabungszelt oder Depot ohne Internet).
     - Integriert in den Vite-Webserver unter `http://localhost:1420/manual.html` sowie als Standalone-Datei im Projektverzeichnis.
     - Schneller Direktaufruf direkt aus HERMES über die neue **`📖 Handbuch`** / **`📖 Manual`**-Schaltfläche in der oberen Menüleiste von [App.vue](file:///d:/Software_Dev/HERMES_test/HERMES_test/src/App.vue).

2. **Visuelles Luxus-Design & Ästhetik ("Radiant Mediterranean & Museum Aesthetics"):**
   * **Repräsentatives Logo des griechischen Gottes Hermes ([hermes_god_logo.png](file:///d:/Software_Dev/HERMES_test/HERMES_test/public/hermes_god_logo.png)):**
     - Klassisches rundes Bronze- und Marmor-Emblem des Gottes Hermes mit Flügelhelm (*Petasos*), Heroldstab (*Caduceus / Kerykeion* mit zwei gewundenen Schlangen) und antikem griechischem Mäanderband.
     - Eingebunden sowohl in der Navigationsleiste und im Hero-Banner des Handbuchs als auch in der zentralen Kopfleiste der HERMES-Applikation ([App.vue](file:///d:/Software_Dev/HERMES_test/HERMES_test/src/App.vue)).
   * **Helles, einladendes Museums-Farbschema:**
     - Auf Nutzerfeedback hin wurde das anfänglich zu dunkle Farbschema durch eine strahlende, warme mediterrane Museums-Ästhetik ersetzt:
       - Warmer Travertin- und Elfenbeinhintergrund (`#fbf9f5` / `#f3efe6`), reinweiße Kartenoberflächen mit dezenten warmen Konturen (`#e8e2d5`) und weichen Schatten.
       - Kräftige Terrakotta-Akzente (`#c25a38`), antikes Bronze-Gold (`#ad7835`) und ägäisches Tiefblau (`#1d698f`).
       - Höchste Textkontraste und Lesbarkeit durch tiefschwarze Schreibtinte (`#242933`).
       - Ergänzender Hell/Dunkel-Umschalter (`☀️ / 🌙`) mit Speicherung der Nutzerpräferenz in `localStorage`.
     - Hochauflösendes, stimmungsvolles 3D-Hero-Banner ([hermes_hero_banner.jpg](file:///d:/Software_Dev/HERMES_test/HERMES_test/public/hermes_hero_banner.jpg)), das die Transformation eines Fundes vom Grabungsschnitt in das digitale Museumsarchiv visualisiert.

3. **Wissenschaftliche Tiefe & Systematische Dual-Beispiele (Grabung vs. Museum):**
   * **Akademische Fundierung & Fachterminologie:**
     - Umfassende methodische Verankerung in **CIDOC-CRM (ISO 21127)**, **Europeana Data Model (EDM)** und **London Charter** (wissenschaftliche Transparenz digitaler 3D-Kulturgüter).
     - Präzise Fachbegriffe für beide Anwendungsbereiche: *Stratigraphische Einheit (SE)*, *Harris-Matrix*, *Befundzusammenhang*, *Taphonomie*, *archäometrische Tonmatrix- & Petrographiebestimmung*, *Metrologie*, *C14 Radiometrie (cal BC, 2σ)*, *GND/Getty ULAN/Getty AAT Normdaten* und *Geodäsie (WGS84 EPSG:4326 vs. projizierte UTM-Gitter)*.
   * **Lückenlose Feldbeschreibung mit obligatorischen Parallelbeispielen:**
     - Für **jedes einzelne Feld** aller 4 CARARE-Sektionen (`collectionInformation`, `heritageAsset`, `digitalResource`, `activity`) existiert eine eigene strukturierte Referenzkarte mit:
       - **Technischer Spezifikationsbox:** XSD-Knotenpfad, Kardinalität (z.B. `1..1`, `1..n`), Schema-Vorschriften und CIDOC-CRM Mapping.
       - **Beispiel 1: 🏺 Ausgrabungsbetrieb (Feldpraxis):** Reales Grabungsszenario (z.B. attischer spätgeometrischer Kantharos aus Schnitt 4, Befund 108, SE 2042 der Grabungskampagne Olympia; Fundzettel-ID `OLY_2026_SN4_SE108_F042`, GNSS-Tachymeter-Einmessung, sedimentäre Aschematrix, C14-Holzkohledatierung, In-situ-Foto mit Farbkarte).
       - **Beispiel 2: 🏛️ Museumsbetrieb (Depot / Sammlungsmanagement):** Reales Museumsszenario (z.B. Grabnaiskos der Nikarete, Antikensammlung Berlin SK 740, Altsignatur Slg. Sabouroff, Autopsiebefund, Magazinstandort Vitrine 12, Leihverkehr, photogrammetrischer Artec Leo 3D-Masterscan mit 15,8 Mio. Polygonen und PBR-Materialien, Public Domain Mark für Europeana).
   * **Zweisprachigkeit (DE / EN) mit 1-Klick-Toggle:**
     - Vollständige wissenschaftliche Übersetzung aller Feldkarten, Parallelbeispiele und methodischen Einführungen zwischen Deutsch und Englisch über den Header-Button `DE | EN`.
   * **Live-Volltextsuche & Filter:**
     - Suchfeld filtert in Echtzeit alle Abschnitte und Feldkarten. Schnellauswahl nach `🔴 Pflichtfelder`, `🏺 Grabungsfokus`, `🏛️ Museumsfokus` und `📸 3D & Medien`.
   * **Druckbare Qualitäts-Checkliste (`@media print`):**
     - Formatiert für sauberen A4-Ausdruck via `Strg+P` als laminierter Feldführer für den Grabungstisch und das Depotbüro.



---

### Testfall 25: Kontrollierte Vokabulare & Das Digitale Authentizitätsprofil (DAP nach Lang & Salcedo Paparoni)
1. **Integration kontrollierter Vokabulare & Normdaten-Services ([manual.html#authorities](http://localhost:1420/manual.html#authorities)):**
   * **HECTOR (Heritage Entity Contextual Terminology for Objects and Research):**
     - Entwickelt am *Bonn Center for Digital Humanities (BCDH)* der Universität Bonn (Prof. Dr. Matthias Lang). Schließt die strukturelle Lücke von CARARE 2.0.6 bezüglich standardisierter Begriffsschemata für Monumente (`hector_heritage_assets`), Materialien (`hector_materials`) und Epochen (`hector_epochs`).
     - Systematische Ausrichtung an internationalen Standards: Alle Begriffe sind über `skos:exactMatch` und `skos:closeMatch` direkt mit dem *Getty Art & Architecture Thesaurus (AAT)* synchronisiert. Langfristige Governance und Verankerung in Kooperation mit *NFDI4Objects* über den *DANTE-Dienst* des Gemeinsamen Bibliotheksverbundes (GBV).
     - Technische Umsetzung in HERMES: Reaktive Autocomplete-Komponenten [HectorMaterialInput.vue](file:///d:/Software_Dev/HERMES_test/HERMES_test/src/components/HectorMaterialInput.vue) und [HectorMonumentTypeInput.vue](file:///d:/Software_Dev/HERMES_test/HERMES_test/src/components/HectorMonumentTypeInput.vue), kombiniert mit clientseitigem Caching in [vocabHistory.js](file:///d:/Software_Dev/HERMES_test/HERMES_test/src/utils/vocabHistory.js) (`localStorage` Schlüssel `hermes_vocab_history`), was vollkommene Offline-Fähigkeit im Grabungszelt garantiert.
   * **GND (Gemeinsame Normdatei) & Lobid API:**
     - Echtzeit-Anbindung an die Deutsche Nationalbibliothek via Lobid REST-API in [PersonPickerModal.vue](file:///d:/Software_Dev/HERMES_test/HERMES_test/src/components/PersonPickerModal.vue) und [OrganizationPickerModal.vue](file:///d:/Software_Dev/HERMES_test/HERMES_test/src/components/OrganizationPickerModal.vue).
     - Verknüpft Personen mit GND-URIs (`https://d-nb.info/gnd/...`), Lebensdaten und Berufsrollen; bindet Halteinstitutionen an den offiziellen ISIL-Schlüssel (`DE-MUS-814111`).
   * **PeriodO (Spatio-Temporaler Perioden-Gazetteer):**
     - Beseitigt die wissenschaftliche Unschärfe von Epochenbezeichnungen: Bindet Perioden an geographische Polygone und astronomische Jahresgrenzen (z. B. Spätklassik Attika: `-330` bis `-320`) mit persistenten ARK-URIs (`http://n2t.net/ark:/99152/p0...`) über [PeriodoAutocomplete.vue](file:///d:/Software_Dev/HERMES_test/HERMES_test/src/components/PeriodoAutocomplete.vue).
   * **GeoNames & Pleiades (Duale Raumstrategie):**
     - Geocodierung moderner Verwaltungseinheiten via GeoNames WebServices in WGS84-Dezimalgraden (`EPSG:4326`).
     - Verknüpfung antiker Toponyme, Nekropolen und Siedlungen via Pleiades Gazetteer (`https://pleiades.stoa.org/`) über [PlaceAutocomplete.vue](file:///d:/Software_Dev/HERMES_test/HERMES_test/src/components/PlaceAutocomplete.vue) und [SpatialMapPicker.vue](file:///d:/Software_Dev/HERMES_test/HERMES_test/src/components/SpatialMapPicker.vue).

2. **Das Digitale Authentizitätsprofil & Paradaten (Lang & Salcedo Paparoni 2025/2026) ([manual.html#authenticity](http://localhost:1420/manual.html#authenticity)):**
   * **Epistemologische Kritik des „Digitalen Zwillings“ (Habilitationsschrift Matthias Lang 2026):**
     - Der industrielle Begriff des *Digital Twin* setzt permanente bidirektionale Echtzeit-Sensorik voraus. Archäologische Artefakte und Denkmäler besitzen jedoch keinen Datenkanal; jede 3D-Erfassung ist interessengeleitet, abstrahiert und partikulär.
     - Etablierung des **„Digitalen Schattens“ (Digital Shadow)**: Ein anforderungsgetriebenes, partielles Abbild, das auf das Original verweist, ohne mit ihm identisch zu sein.
   * **Authentizität vs. Verlässlichkeit (Duranti / InterPARES / Levy / Lynch / Yeo):**
     - Strikt trennbar: **Authentizität des Records** (Integrität, feste Form, Verwahrungskette, RFC 8493 BagIt SHA-256 Prüfsummen) vs. **Verlässlichkeit (Reliability)** (Wahrheitsgehalt als Tatsachenaussage über das physische Objekt).
   * **Das 3-Phasen-Modell des Digital Authenticity Profile (DAP):**
     - **Phase 1: Reference (Vor der Erfassung / Kuratoren & Restauratoren):** Festlegung der Identität und *Signifikanten Eigenschaften* (Werkzeugspuren, Verwitterung, Brüche), Deklaration des *Digitization Intent* und Definition, was explizit *nicht* erfasst wird.
     - **Phase 2: Capture (Während der Erfassung / Erfassungsspezialisten):** Protokollierung von Sensoren (Artec Leo 0.1 mm, Nikon Z8), optischen Bedingungen und realen Zugangsbarrieren (Wandverankerung, unzugängliche Sockelunterseite).
     - **Phase 3: Representation (Nach der Erfassung / 3D-Modellierer):** Dokumentation aller Bearbeitungsschritte (Mesh-Dezimation 15.8M ➔ 50k GLB, Normal-Map Baking). Deklaration von Simulationen: Schließen von Fehlstellen und Rendering von *Subsurface Scattering (SSS)* bei transluzentem pentelischem Marmor als deklarierte Shader-Eigenschaft.
   * **Die drei Eigenschafts-Kategorien:**
     - `capturable` (physikalisch mit Sensor gemessen), `not capturable` (technisch/physisch unzugänglich), `simulated` (algorithmisch interpoliert/gerendert).
   * **Fallstudie Grabstele der Nikarete (SK 740, Antikensammlung SMB Berlin):**
     - Gegenüberstellung von **Modell A (Scan-the-World / Zenodo-Harvest)** (unbekannte Herkunft, hermetisch zugespachtelte Rückseite, verschmolzener Sockel, zwar authentischer Record mit DOI, aber wissenschaftlich irreführend) vs. **Modell B (Bonn / SMB Pilot)** (vollständiges DAP, deklariertes `not capturable` der Rückseite, deklariertes `simulated` für SSS, Master- und Echtzeit-Modell, RFC 8493 BagIt SHA-256 Verifikation).
   * **CARARE 2.0.6 XML Serialisierung:**
     - Standardkonforme Einbettung in `<activity>` mit Sub-Activities, `<consistsOf>`, `<formatDetails>`, `<conditions>` und `<rights>`.
