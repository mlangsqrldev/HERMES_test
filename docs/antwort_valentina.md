Hallo Valentina,

danke für das präzise Beispiel-XML (`2026-11-11_dap-carare-beispiel-03.xml`)! Das bringt maximale Klarheit und vereinfacht die Eingabe für Museen enorm. 

Hier ist der abgestimmte Vorschlag für die 5 DAP-Felder in HERMES, ihre Bezeichnungen und die Strukturierung:

---

### 1. Die 5 DAP-Felder im HERMES-Interface

Jede Dimension erhält **exakt ein großzügiges Freitextfeld** mit einer konkreten Leitfrage und dem Beispiel aus deinem Entwurf als Hilfestellung:

1. **DAP-1: Ausgangsbefund am Objekt (Materielle Spuren & Merkmale)**
   * *Leitfrage:* Welche materiellen Spuren, Beschädigungen, Fehlstellen oder historischen Restaurierungen weist das Original auf, die für das Verständnis oder die Zuschreibung wesentlich sind?
   * *Beispiel:* „An der linken Körperseite befindet sich ein etwa handgroßes Loch (Kriegsbeschädigung 1945). Der linke Arm fehlt seit der Auffindung. Auf der Rückseite sind antike Meißelspuren gut erkennbar; sie sind für die Werkstattzuschreibung wichtig.“

2. **DAP-2: Erfassungsumfang & Auslassungen (Aufnahmeprozess)**
   * *Leitfrage:* Welche Bereiche wurden erfasst und welche Bereiche wurden bewusst oder technisch bedingt ausgelassen? Aus welchen konservatorischen oder optischen Gründen?
   * *Beispiel:* „Die Statue wurde rundum erfasst, einschließlich des Lochs und der Bruchfläche am Arm. Die Standfläche konnte aus konservatorischen Gründen nicht erfasst werden. Das Innere des Lochs ist nur teilweise aufgenommen, weil es tief verschattet ist.“

3. **DAP-3: Geometrie-Bearbeitung & Modellierung**
   * *Leitfrage:* Welche Eingriffe, Lochschließungen oder hypothetischen Ergänzungen/Simulationen wurden an der Modellgeometrie vorgenommen und wie sind sie gekennzeichnet?
   * *Beispiel:* „Die fehlende Standfläche wurde geschlossen (rein technisch, ohne Aussagewert). Das Loch wurde bewusst nicht geschlossen. Der linke Arm wurde im Projekt als Simulation modelliert, auf Grundlage vergleichbarer Statuen desselben Typs. Er ist als separates Objekt im Modell angelegt.“

4. **DAP-4: Textur, Farbe & Oberflächenmaterial**
   * *Leitfrage:* Wie wurden Farbe und Textur behandelt? Wurde eine Farbkalibrierung durchgeführt? Wurden historische Spuren in Textur und Shader erhalten? Wie sind simulierte Teile visualisiert?
   * *Beispiel:* „Die Marmortextur stammt aus den Aufnahmen, farbkalibriert. Die Meißelspuren auf der Rückseite sind in der Geometrie und in der Normal-Map erhalten. Der simulierte Arm hat eine neutrale graue Oberfläche, damit er sich sichtbar vom Original unterscheidet.“

5. **DAP-5: Abbildungsbilanz (Gesamtfazit & Aussagegrenzen)**
   * *Leitfrage:* Für welche wissenschaftlichen oder musealen Fragestellungen ist das 3D-Modell belastbar und wofür eignet es sich methodisch nicht?
   * *Beispiel:* „Das Modell gibt die Statue im heutigen Zustand wieder, einschließlich der Kriegsbeschädigung. Der linke Arm gehört nicht zum Objekt. Er ist Teil der Simulation und stellt eine mögliche Rekonstruktion dar, keinen Befund. Die Standfläche ist technisch ergänzt. Für Aussagen zur Werkstatt eignen sich die Meißelspuren der Rückseite, für Aussagen zur Unterseite eignet sich das Modell nicht.“

---

### 2. Trennung: Reguläre Teilschritte (Wie & Womit) vs. DAP (Warum & Inwieweit)

Im Activity-Modul wird die Reihenfolge nun absolut sauber getrennt:
1. **Basisdaten:** Titel, ID, `activityType`, `generalType`, kalendarischer Zeitraum, DC-Relations.
2. **Akteure (`actors`):** Beteiligte mit `actorType` (`person`/`organisation`) und flexiblen Mehrfachrollen (`roles`, z. B. Scan-Operator, 3D-Modelleur, Postprocessing).
3. **3D-Aufnahme:** `eventType`, Aufnahmeverfahren, Geräte, Kalibriertargets.
4. **Prozessierungsschritte (Reguläre `<consistsOf>`):**
   * Direkt unter der Aufnahme und **vor** dem DAP.
   * Bereinigung, Alignment, Meshing, Retopologie, Texturierung, Software & Versionen.
5. **DAP: Digital Authenticity Profile:**
   * Schließt die Aktivität mit den 5 oben genannten Freitextfeldern ab.

---

### 3. XML-Export (Exakt nach deinem Muster `2026-11-11_dap-carare-beispiel-03.xml`)

Im CARARE-XML werden die regulären Arbeitsschritte und die 5 DAP-Dimensionen als getrennte `<consistsOf>`-Blöcke serialisiert:
* Reguläre Schritte: `<consistsOf>` mit `<hadSpecificPurpose>Teilschritt Erfassung...</hadSpecificPurpose>`, `<methods>`, `<techniques>`, Software und Hardware.
* DAP: 5 `<consistsOf>` mit:
  * `<hadSpecificPurpose lang="de">Digital Authenticity Profile, Dimension X von 5: [Name] (http://hector.org/vocab/dap/DAP-X)</hadSpecificPurpose>`
  * Genau ein `<methods lang="de">[Eingegebener Freitext]</methods>`.
