# HERMES – Überarbeitungs- und Anpassungskonzept

Dieses Dokument fasst die abgestimmten Anforderungen und Umsetzungsvorschläge für das Refactoring von HERMES zusammen (inkl. Feedback von Valentina und Stand des CARARE-DAP-Beispiels `2026-11-11_dap-carare-beispiel-03.xml`).

---

## 1. Personen, Rollenzuweisung & das Feld „Type“

* **Feld „Type“ (Akteurstyp):**
  * Bleibt unverzichtbar: Unterscheidung zwischen `person` (natürliche Person) und `organisation` (Körperschaft/Institution) gemäß CARARE `<actorType>`.
  * Das Feld wird standardmäßig auf `person` gesetzt, kann aber bei Bedarf auf `organisation` (z. B. für Werkstätten, Institute oder Dienstleister) umgestellt werden.
* **Zentraler Personen-Pool:**
  * Speichert ausschließlich Identitäts- und Kontaktdaten: Vorname, Nachname, Typ (`person`/`organisation`), GND-ID, ORCID, Institution/Affiliation, E-Mail.
  * Im zentralen Pool werden **keine** fest verdrahteten Rollen hinterlegt, da Rollen stets aufgabenspezifisch sind.
* **Mehrfachrollen innerhalb desselben Wraps:**
  * Eine Person kann innerhalb desselben Wraps (insbesondere in der Aktivität) **mehrere Rollen gleichzeitig** einnehmen (z. B. *Scan-Operator*, *3D-Modelleur* und *Postprocessing*).
  * Die Zuweisung erfolgt flexibel als Tag-Auswahl / Multi-Select mit Freitext- und HECTOR-Ergänzung.
  * Im CARARE-XML werden die Rollen standardkonform über wiederholte `<roles>`-Tags abgebildet.

---

## 2. Klare Trennung: Historische Urheber (Heritage Asset) vs. Moderne Kontakte & Digitalisierer

* **Heritage Asset → Actors (Historische Urheber / Schöpfer des Originals):**
  * Bezieht sich **ausschließlich** auf die Personen/Körperschaften, die das physische Kulturgut historisch geschaffen haben (z. B. *Bildhauer*, *Architekt*, *Maler*, *Töpfer*, *Münzmeister*, *Werkstatt*, *Stifter*).
  * Bleibt bei anonymen antiken/historischen Objekten standardmäßig **leer**.
  * Nutzt **keine** modernen Digitalisierungsrollen (kein Kurator, kein Scan-Operator), sondern ein spezifisches historisches Rollenspektrum.
* **Record Information → Contacts (Ansprechpartner des Datensatzes):**
  * Moderne Kontakte (z. B. *Datenlieferant*, *Katalogisierer*, *Digitalisierungsbeauftragter*, *Kuratierende Institution*).
  * Können global definiert und vererbt werden.
* **Activity → Actors (Digitalisierungsteam):**
  * Moderne Akteure der Erfassung und Modellierung (*Scan-Operator*, *Fotograf*, *3D-Modelleur*, *Restauratorische Begleitung*).
  * Hier greift der moderne Personen-Pool mit Mehrfachrollen.

---

## 3. Kulturgüter (Heritage Asset): Sichtbarkeit in der Übersicht

* In der Tabellen- und Kachelübersicht der Kulturgüter werden zugewiesene Urheber/Akteure inklusive ihrer Rolle transparent angezeigt (z. B. `Phidias (Bildhauer)` oder bei Aktivitäts-Beteiligten `Dr. Lukas Weber (Scan-Operator, 3D-Modelleur)`).

---

## 4. Zeit- und Kalenderangaben: Keine Zukunftsdaten

* **Aktivität (Kalendarische Daten):** Kalender-Inputs mit Begrenzung auf maximal das heutige Tagesdatum (`max="YYYY-MM-DD"`).
* **Historische Datierung (Kulturgüter):** Historische Jahreszahlen (inkl. v. Chr. / negative Jahreszahlen) bleiben uneingeschränkt möglich. Eingaben größer als das aktuelle Kalenderjahr werden abgewiesen.
* **Systemweit:** Speichern und Weitergehen wird blockiert, wenn ein Datum in der Zukunft liegt.

---

## 5. Linkes Navigationsmenü: Sprung zu Untereinträgen

* Die linke Seitenleiste wird hierarchisch als ausklappbare Baumstruktur aufgebaut:
  * Unter **Kulturgüter** klappen alle angelegten Objekte auf (`HA-1: Grabrelief`, `HA-2: ...`).
  * Ein Klick scrollt direkt zum Objekt und öffnet es zur Bearbeitung.
  * Unter **Aktivität** sind die Abschnitte (*Basisdaten*, *3D-Aufnahme*, *Prozessierung*, *DAP*) direkt ansteuerbar.

---

## 6. Sammlung (Collection): Spatial Coverage als Herkunftsraum

* **Bedeutung:** Keine Museums-Postadresse, sondern der geografische Herkunfts- und Kulturraum der Sammlung (z. B. *Attika*, *Peloponnes*).
* **Lösung:** Vollwertiges `SpatialMapPicker`-Interface wie beim Heritage Asset:
  * Orts- und Regionenname
  * Normdaten über **GeoNames** und **Pleiades** (antike Geografie)
  * Karten-Picker für Koordinaten und Bounding-Box
  * Beschriftung: *„Geografischer Herkunftsraum / Kulturraum der Sammlung“*

---

## 7. Reihenfolge der Elemente in der Aktivität (Strikte CARARE-Sequenz)

Die Reihenfolge im UI und im erzeugten XML folgt strikt der vorgegebenen CARARE-Sequenz:

1. **Basisdaten der Aktivität:** ID, `activityType`, `generalType`, kalendarischer Zeitraum, DC-Relations.
2. **Akteure (`actors`):** Beteiligte mit `actorType` (`person`/`organisation`) und flexiblen Mehrfachrollen (`roles`).
3. **3D-Digitalisierung (Aufnahmeblock):** `eventType`, Aufnahmeverfahren, Geräte, Kalibriertargets.
4. **Prozessierungsschritte (Post-Processing & Pipeline – Reguläre `<consistsOf>`):**
   * Direkt unter der Aufnahme und **vor** dem DAP positioniert.
   * Bereinigung, Alignment, Meshing, Retopologie/Dezimierung, Texturierung, Software & Versionen.
   * Technische Umsetzung: Reguläre `<consistsOf>`-Elemente mit `<hadSpecificPurpose>`, `<methods>`, `<techniques>` und `<equipment>`.
5. **DAP: Digital Object Authenticity Profile (Wissenschaftliche Dokumentation):**
   * Befund, Auslassung, Geometrie, Farbe/Material, Abbildungsbilanz.

---

## 8. Digital Authenticity Profile (DAP): 5 Dimensionen mit je genau 1 Freitextfeld

Gemäß dem aktuellen Stand (`2026-11-11_dap-carare-beispiel-03.xml`) entfällt die frühere Dimension 5 („Wissenschaftliche Begründung“); die frühere Dimension 6 („Abbildungsbilanz“) rückt auf Position 5.

Im Interface erhält jede Dimension **exakt ein strukturiertes Freitextfeld (Textarea)** mit klaren, praxisnahen Leitfragen:

### DAP-1: Materielle Spuren & Merkmale (Ausgangsbefund am Objekt)
* **URI:** `http://hector.org/vocab/dap/DAP-1`
* **UI-Feldbezeichnung:** *1. Ausgangsbefund am Objekt (Materielle Spuren & Merkmale)*
* **Leitfrage / Platzhalter im Formular:**
  > *Welche materiellen Spuren, Beschädigungen, Fehlstellen oder historischen Restaurierungen weist das Original auf, die für das Verständnis oder die Zuschreibung wichtig sind?*
  > *Beispiel: „An der linken Körperseite befindet sich ein etwa handgroßes Loch (Kriegsbeschädigung 1945). Der linke Arm fehlt seit der Auffindung. Auf der Rückseite sind antike Meißelspuren gut erkennbar, die für die Werkstattzuschreibung wesentlich sind.“*

### DAP-2: Aufnahmeprozess & Erfassungsumfang
* **URI:** `http://hector.org/vocab/dap/DAP-2`
* **UI-Feldbezeichnung:** *2. Erfassungsumfang & Auslassungen (Aufnahmeprozess)*
* **Leitfrage / Platzhalter im Formular:**
  > *Welche Bereiche des Objekts wurden vollständig erfasst und welche Bereiche wurden bewusst oder technisch bedingt ausgelassen? Aus welchen konservatorischen oder optischen Gründen?*
  > *Beispiel: „Die Statue wurde rundum erfasst, einschließlich des Lochs und der Bruchfläche am Arm. Die Standfläche konnte aus konservatorischen Gründen nicht erfasst werden. Das Innere des Lochs ist nur teilweise aufgenommen, da es tief verschattet ist.“*

### DAP-3: Geometrie-Bearbeitung & Modellierung
* **URI:** `http://hector.org/vocab/dap/DAP-3`
* **UI-Feldbezeichnung:** *3. Geometrie-Bearbeitung & Ergänzungen*
* **Leitfrage / Platzhalter im Formular:**
  > *Welche geometrischen Eingriffe, Schließungen von Löchern oder hypothetischen Ergänzungen/Simulationen wurden am 3D-Modell vorgenommen und wie sind sie gekennzeichnet?*
  > *Beispiel: „Die fehlende Standfläche wurde rein technisch geschlossen (ohne Aussagewert). Das Loch wurde bewusst offengelassen. Der linke Arm wurde auf Basis typgleicher Statuen als separate Simulation modelliert und farblich abgesetzt.“*

### DAP-4: Textur, Shader & Material
* **URI:** `http://hector.org/vocab/dap/DAP-4`
* **UI-Feldbezeichnung:** *4. Textur, Farbe & Oberflächenmaterial*
* **Leitfrage / Platzhalter im Formular:**
  > *Wie wurden Farbe und Textur behandelt? Wurde eine Farbkalibrierung durchgeführt? Wurden historische Spuren in Textur und Shader erhalten? Wie sind simulierte Teile visualisiert?*
  > *Beispiel: „Die Marmortextur stammt aus farbkalibrierten RAW-Aufnahmen (ColorChecker). Meißelspuren auf der Rückseite sind in Geometrie und Normal-Map erhalten. Der simulierte Arm hat eine neutrale graue Oberfläche zur klaren Unterscheidung vom Original.“*

### DAP-5: Abbildungsbilanz
* **URI:** `http://hector.org/vocab/dap/DAP-5`
* **UI-Feldbezeichnung:** *5. Abbildungsbilanz (Gesamtfazit & Aussagegrenzen)*
* **Leitfrage / Platzhalter im Formular:**
  > *Für welche wissenschaftlichen oder musealen Fragestellungen ist das Modell uneingeschränkt belastbar und wofür eignet es sich methodisch nicht? Welche Grenzen der Transformation bestehen?*
  > *Beispiel: „Das Modell gibt den heutigen Erhaltungszustand einschließlich der Kriegsbeschädigung authentisch wieder. Der linke Arm stellt eine wissenschaftliche Simulation dar, keinen Originalbefund. Für Werkstattzuschreibungen eignen sich die Meißelspuren der Rückseite; für Aussagen zur Unterseite eignet sich das Modell nicht.“*

---

## 9. Bereinigung aller CARARE-Fachbegriffe aus dem Interface

* Alle XML-Tags (`<consistsOf>`, `<hadSpecificPurpose>`, `<wasDigitizedBy>` etc.) und CARARE-Versionsplaketten werden aus der Benutzeroberfläche verbannt.
* Durchgängige Verwendung selbsterklärender Fachbegriffe (*Sammlungsinformationen*, *Kulturgut*, *3D-Modell*, *Dokumentationsaktivität*, *Aufnahmeverfahren*, *Prozessierungsschritte*, *Digital Authenticity Profile*). CARARE bleibt als Standard im Hintergrund.

---

## 10. CARARE-XML-Export des DAP

Der Export folgt exakt dem Muster aus `2026-11-11_dap-carare-beispiel-03.xml`:

```xml
<!-- Reguläre Prozessierungsschritte (Wie & Womit) -->
<consistsOf>
  <hadSpecificPurpose lang="de">Teilschritt Erfassung: Photogrammetrie</hadSpecificPurpose>
  <methods lang="de">Photogrammetrie</methods>
  <techniques lang="de">Kreuzpolarisation</techniques>
  <!-- Hardware, Software usw. -->
</consistsOf>

<!-- DAP: Eine consistsOf je Dimension, genau ein methods für den Freitext (Warum & Inwieweit) -->
<consistsOf>
  <hadSpecificPurpose lang="de">Digital Authenticity Profile, Dimension 1 von 5: Materielle Spuren und Merkmale (Ausgangsbefund am Objekt) (http://hector.org/vocab/dap/DAP-1)</hadSpecificPurpose>
  <methods lang="de">An der linken Körperseite befindet sich ein etwa handgroßes Loch ...</methods>
</consistsOf>
<consistsOf>
  <hadSpecificPurpose lang="de">Digital Authenticity Profile, Dimension 2 von 5: Aufnahmeprozess und Erfassungsumfang (http://hector.org/vocab/dap/DAP-2)</hadSpecificPurpose>
  <methods lang="de">Die Statue wurde rundum erfasst, einschließlich des Lochs ...</methods>
</consistsOf>
<consistsOf>
  <hadSpecificPurpose lang="de">Digital Authenticity Profile, Dimension 3 von 5: Geometrie-Bearbeitung (http://hector.org/vocab/dap/DAP-3)</hadSpecificPurpose>
  <methods lang="de">Die fehlende Standfläche wurde geschlossen ...</methods>
</consistsOf>
<consistsOf>
  <hadSpecificPurpose lang="de">Digital Authenticity Profile, Dimension 4 von 5: Textur, Shader und Material (http://hector.org/vocab/dap/DAP-4)</hadSpecificPurpose>
  <methods lang="de">Die Marmortextur stammt aus den Aufnahmen, farbkalibriert ...</methods>
</consistsOf>
<consistsOf>
  <hadSpecificPurpose lang="de">Digital Authenticity Profile, Dimension 5 von 5: Abbildungsbilanz (http://hector.org/vocab/dap/DAP-5)</hadSpecificPurpose>
  <methods lang="de">Das Modell gibt die Statue im heutigen Zustand wieder ...</methods>
</consistsOf>
```

---

## 11. Zentrales Rechte-Modal (Global & bereichsspezifisch)

* **Prinzip:** Rechte sollen **nicht** in den einzelnen Eingabeformularen (*Sammlung*, *Kulturgut*, *3D-Modell*) gepflegt werden, sondern zentral an einem Ort.
* **Lösung (`RightsSettingsModal.vue`):**
  * **Eigenes Modal:** Der Button **Rights** öffnet – wie alle anderen globalen Werkzeuge – ein fokussiertes Modal-Fenster mit einheitlichem Blur-Hintergrund (`bg-black/50 backdrop-blur-sm`).
  * **Modus 1 – Global (Standard):** Einmaliges Festlegen von Lizenz (`licence`), Zugangsrechten (`accessRights`), Credit Line (`copyrightCreditLine`) und Reproduktionsrechten (`reproductionRights`) für das gesamte Projekt.
  * **Modus 2 – Bereichs-/Objektspezifische Anpassung:** Innerhalb desselben Rechte-Modals können (z. B. über Tabs oder Umschalter) bei Bedarf gezielt abweichende Rechte für einzelne Bereiche (*Sammlung*, *Kulturgüter*, *3D-Modelle*) oder einzelne Datensätze überschrieben werden.
  * **Validierung:** Änderungen im Rechte-Modal aktualisieren die hinterlegten Datensätze und die Statusanzeige in der linken Navigationsleiste sofort konsistent.

---

## 12. UI/UX-Bereinigungen & Bugfixes (Feedback Philippe)

### A. Oberste Leiste & Navigation
* **Redundante Quick-Nav-Leiste entfernen:** Die mittlere 5-Schritte-Leiste im Header (`App.vue`) entfällt, da die linke Seitenleiste denselben Zweck erfüllt. Stattdessen werden die allgemeinen Einstellungen (*Default Language, Persons, Organizations, Collections, Software, Equipment, APIs, Rights*) sauber oben platziert.
* **Doppelter `GeoNames`-Button raus:** Der `GeoNames`-Button oben rechts wird entfernt (Konfiguration erfolgt einheitlich über `APIs`).
* **Statisches `Ctrl+S Save`-Badge raus:** Das funktionslose Hinweis-Badge oben rechts wird entfernt.
* **Blaue Pfeile in der linken Leiste:** Die `collapse-arrow`-Pfeile unter *Workflow & Status* werden entfernt (bzw. nur für die neue aufklappbare Objekt-Hierarchie genutzt).

### B. Einheitliches Modal-Design
* Alle Modals (*Persons, Organizations, Collections, Software, Equipment, APIs, Rights*) erhalten denselben abgedunkelten Blur-Hintergrund (`bg-black/50 backdrop-blur-sm`) und dieselbe Fensterstruktur.

### C. XML-Vorschau (`LiveXmlPreview.vue`)
* **Dropdown-Fix:** Bei den Ressourcen-Dropdowns (z. B. mehrere Heritage Assets) wird `select-ghost` durch explizite `bg-base-100 text-base-content`-Klassen ersetzt, damit der Hintergrund der Auswahlliste nicht mehr transparent gerendert wird.

### D. Sammlung (`CollectionInformationCrud.vue`)
* **Sprach-Dropdown bei `Statement` entfernen:** `Statement` nutzt automatisch die globale `Default Metadata Language` statt eines separaten Sprach-Pickers.
* **`Source (Institution Name)` & GND-Vorschlag:**
  * Die doppelte Bestätigungskarte unter dem Eingabefeld wird entfernt.
  * Das `×`-Icon rechts im Eingabefeld wird rot eingefärbt (`text-error`), um die Löschfunktion klar zu signalisieren.
  * Beim Löschen von `Source` wird auch der übernommene GND-Vorschlag im `ID`-Feld automatisch mitzurückgesetzt.
* **`Title`-Liste optimieren:**
  * Der rote Mülleimer neben dem Titel wird dauerhaft sichtbar gemacht (`opacity-0 group-hover:opacity-100` entfernen).
  * Der obere `Add Title`-Button entfällt und wird durch ein kompaktes `+` direkt unter dem vorhandenen Titel-Eintrag ersetzt.

