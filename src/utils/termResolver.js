/**
 * HERMES Term & Vocabulary URI Resolver
 * Automatically resolves terms (monuments, materials, epochs, DAP steps, roles, techniques)
 * to their authoritative HECTOR, Pleiades, Getty AAT, or GND URIs.
 */

// Core HECTOR & Authority Vocabularies Index
export const HECTOR_VOCABULARY_INDEX = {
  // 1. Materials (HECTOR / BCDH)
  'marmor': { uri: 'https://hector.bcdh.uni-bonn.de/marble', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Marmor' },
  'marble': { uri: 'https://hector.bcdh.uni-bonn.de/marble', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Marble' },
  'bronze': { uri: 'https://hector.bcdh.uni-bonn.de/bronze', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Bronze' },
  'kalkstein': { uri: 'https://hector.bcdh.uni-bonn.de/limestone', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Kalkstein' },
  'limestone': { uri: 'https://hector.bcdh.uni-bonn.de/limestone', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Limestone' },
  'ton': { uri: 'https://hector.bcdh.uni-bonn.de/clay', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Ton' },
  'clay': { uri: 'https://hector.bcdh.uni-bonn.de/clay', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Clay' },
  'terrakotta': { uri: 'https://hector.bcdh.uni-bonn.de/terracotta', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Terrakotta' },
  'terracotta': { uri: 'https://hector.bcdh.uni-bonn.de/terracotta', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Terracotta' },
  'gold': { uri: 'https://hector.bcdh.uni-bonn.de/gold', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Gold' },
  'silber': { uri: 'https://hector.bcdh.uni-bonn.de/silver', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Silber' },
  'silver': { uri: 'https://hector.bcdh.uni-bonn.de/silver', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Silver' },
  'holz': { uri: 'https://hector.bcdh.uni-bonn.de/wood', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Holz' },
  'wood': { uri: 'https://hector.bcdh.uni-bonn.de/wood', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Wood' },
  'elfenbein': { uri: 'https://hector.bcdh.uni-bonn.de/ivory', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Elfenbein' },
  'alabaster': { uri: 'https://hector.bcdh.uni-bonn.de/alabaster', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Alabaster' },
  'granit': { uri: 'https://hector.bcdh.uni-bonn.de/granite', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Granit' },
  'glas': { uri: 'https://hector.bcdh.uni-bonn.de/glass', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Glas' },
  'sandstein': { uri: 'https://hector.bcdh.uni-bonn.de/sandstone', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Sandstein' },
  'kupfer': { uri: 'https://hector.bcdh.uni-bonn.de/copper', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Kupfer' },
  'porphyr': { uri: 'https://hector.bcdh.uni-bonn.de/porphyry', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Porphyr' },
  'basalt': { uri: 'https://hector.bcdh.uni-bonn.de/basalt', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Basalt' },
  'blei': { uri: 'https://hector.bcdh.uni-bonn.de/lead', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Blei' },
  'stuck': { uri: 'https://hector.bcdh.uni-bonn.de/stucco', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Stuck' },
  'knochen': { uri: 'https://hector.bcdh.uni-bonn.de/bone', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Knochen' },

  // 2. Monument Types (HECTOR Kulturgut)
  'grab': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_d33a8f22', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/', label: 'Grab' },
  'tomb': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_d33a8f22', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/', label: 'Tomb' },
  'grabrelief': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_9b922858', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/', label: 'Grabrelief' },
  'grave relief': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_9b922858', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/', label: 'Grave Relief' },
  'grabbau': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_c97ec1e6', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/', label: 'Grabbau' },
  'funerary monument': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_c97ec1e6', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/', label: 'Funerary Monument' },
  'grabpfeiler': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_fd246759', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/', label: 'Grabpfeiler' },
  'statue': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_40fa8b34', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/', label: 'Statue' },
  'statuengruppe': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_a83004fb', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/', label: 'Statuengruppe' },
  'relief': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_3081a4fd', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/', label: 'Relief' },
  'sarkophag': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_d5445979', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/', label: 'Sarkophag' },
  'sarcophagus': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_d5445979', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/', label: 'Sarcophagus' },
  'tempel': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_3ce7e57c', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/', label: 'Tempel' },
  'temple': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_3ce7e57c', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/', label: 'Temple' },
  'altar': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_9863d832', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/', label: 'Altar' },
  'porträt': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_2677f8ad', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/', label: 'Porträt' },
  'bauplastik': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_ec5847fa', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/', label: 'Bauplastik' },
  'gefäß': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_43d07f2a', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/', label: 'Gefäß' },
  'vessel': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_43d07f2a', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/', label: 'Vessel' },
  'stele': { uri: 'https://hector.bcdh.uni-bonn.de/steleon', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Stele' },
  'büste': { uri: 'https://hector.bcdh.uni-bonn.de/bust', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Büste' },
  'bust': { uri: 'https://hector.bcdh.uni-bonn.de/bust', namespace: 'https://hector.bcdh.uni-bonn.de/', label: 'Bust' },
  'kandelaber': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_0014d071', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/', label: 'Kandelaber' },

  // 3. Epochs & Periods (HECTOR Epochen)
  'spätklassik': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_9c4fae85', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/', label: 'Spätklassik' },
  'late classical': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_9c4fae85', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/', label: 'Late Classical' },
  'klassische periode': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_4a572b1e', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/', label: 'Klassische Periode' },
  'classical period': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_4a572b1e', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/', label: 'Classical Period' },
  'frühklassik': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_08466b04', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/', label: 'Frühklassik' },
  'early classical': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_08466b04', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/', label: 'Early Classical' },
  'hellenismus': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_b3634024', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/', label: 'Hellenismus' },
  'hellenistic': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_b3634024', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/', label: 'Hellenistic' },
  'archaik': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_c0199182', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/', label: 'Archaik' },
  'archaic': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_c0199182', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/', label: 'Archaic' },
  'römische kaiserzeit': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_8b1d9bf5', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/', label: 'Römische Kaiserzeit' },
  'roman imperial': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_8b1d9bf5', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/', label: 'Roman Imperial' },
  'spätantike': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_703080c9', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/', label: 'Spätantike' },
  'late antiquity': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_703080c9', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/', label: 'Late Antiquity' },

  // 4. DAP 6 Dimensions (HECTOR DAP Vocabulary)
  'dap-1': { uri: 'http://hector.org/vocab/dap/DAP-1', namespace: 'http://hector.org/vocab/dap/', label: 'DAP-1: Materielle Spuren & Merkmale' },
  'dap-2': { uri: 'http://hector.org/vocab/dap/DAP-2', namespace: 'http://hector.org/vocab/dap/', label: 'DAP-2: Aufnahmeprozess & Erfassungsumfang' },
  'dap-3': { uri: 'http://hector.org/vocab/dap/DAP-3', namespace: 'http://hector.org/vocab/dap/', label: 'DAP-3: Geometrie-Bearbeitung' },
  'dap-4': { uri: 'http://hector.org/vocab/dap/DAP-4', namespace: 'http://hector.org/vocab/dap/', label: 'DAP-4: Textur, Shader & Material' },
  'dap-5': { uri: 'http://hector.org/vocab/dap/DAP-5', namespace: 'http://hector.org/vocab/dap/', label: 'DAP-5: Wissenschaftliche Begründung' },
  'dap-6': { uri: 'http://hector.org/vocab/dap/DAP-6', namespace: 'http://hector.org/vocab/dap/', label: 'DAP-6: Abbildungsbilanz' },

  // 5. 3D & DAP Operations & Techniques (HECTOR)
  'holes filled': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/holes_filled', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'holes filled' },
  'löcher geschlossen': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/holes_filled', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'Löcher geschlossen' },
  'icp registration': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/icp_registration', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'icp registration' },
  'icp-registrierung': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/icp_registration', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'ICP-Registrierung' },
  'decimation': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/decimation', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'decimation' },
  'dezimierung': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/decimation', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'Dezimierung' },
  'noise removal': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/noise_removal', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'noise removal' },
  'rauschfilterung': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/noise_removal', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'Rauschfilterung' },
  'point cloud alignment': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/point_cloud_alignment', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'point cloud alignment' },
  'surface reconstruction': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/surface_reconstruction', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'surface reconstruction' },
  'non-manifold cleanup': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/non_manifold_cleanup', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'non-manifold cleanup' },
  'retopologizing': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/retopologizing', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'retopologizing' },
  'delighting': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/delighting', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'delighting' },
  'uv unwrapping': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/uv_unwrapping', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'uv unwrapping' },
  'texture baking': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/texture_baking', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'texture baking' },
  'scale bar alignment': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/scale_bar_alignment', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'scale bar alignment' },
  'color checker calibration': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/color_calibration', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'color checker calibration' },
  'farbkalibrierung': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/color_calibration', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'Farbkalibrierung' },
  'pbr roughness mapping': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/pbr_mapping', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'pbr roughness mapping' },
  'normal map baking': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/normal_map_baking', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'normal map baking' },
  '360°-rundumerfassung': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/360_capture', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: '360°-Rundumerfassung' },
  'standfläche ausgespart': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/base_omitted', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'Standfläche ausgespart' },
  'hohlraum abgeschattet': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/cavity_omitted', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'Hohlraum abgeschattet' },
  'berührungslos': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/markerless', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'Berührungslos' },
  'markerless': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/markerless', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'markerless' },
  'bestoßungen': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/chippings', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'Bestoßungen' },
  'bestoßungen & absplitterungen': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/chippings', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'Bestoßungen & Absplitterungen' },
  'rissbildung': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/cracks', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'Rissbildung' },
  'antike drehspuren': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/turning_marks', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'Antike Drehspuren' },
  'brandspuren': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/fire_traces', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'Brandspuren' },
  'brandspuren / ruß': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/fire_traces', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'Brandspuren / Ruß' },
  'historische restaurierungskittung': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/restoration_fill', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'Historische Restaurierungskittung' },
  'london charter': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/london_charter_4', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'London Charter' },
  'london charter principle 4': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/london_charter_4', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'London Charter Principle 4' },
  'seville principles': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/seville_principles', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'Seville Principles' },
  'keine spekulative ergänzung': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/no_speculation', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'Keine spekulative Ergänzung' },
  'materielle spuren erhalten': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/traces_preserved', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'Materielle Spuren erhalten' },
  'beschädigungen dokumentiert': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/damage_documented', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'Beschädigungen dokumentiert' },
  'standfläche plan geschlossen': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/base_closed', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'Standfläche plan geschlossen' },
  'originalgeometrie intakt': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/geometry_intact', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'Originalgeometrie intakt' },

  // 6. Event Types (Aktivitätstypen)
  '3d-digitalisierung': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/event_3d_digitisation', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: '3D-Digitalisierung' },
  '3d digitisation': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/event_3d_digitisation', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: '3D Digitisation' },
  'streifenlicht-scanning': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/event_sls_scan', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'Streifenlicht-Scanning' },
  'nahbereichs-photogrammetrie': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/event_photogrammetry', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'Nahbereichs-Photogrammetrie' },
  'photogrammetry': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/event_photogrammetry', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'Photogrammetry' },
  'terrestrisches laserscanning': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/event_tls_scan', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'Terrestrisches Laserscanning' },
  'restaurierung': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/event_restoration', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'Restaurierung' },
  'ausgrabung': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/event_excavation', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'Ausgrabung' },
  'survey': { uri: 'http://vocabs.bcdh.uni-bonn.de/hector/event_survey', namespace: 'http://vocabs.bcdh.uni-bonn.de/hector/', label: 'Survey' }
};

/**
 * Searches localStorage recent vocabs for a matching label
 */
function findInLocalStorageVocabs(termLower) {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('hermes_recent_vocab_')) {
        const raw = localStorage.getItem(k);
        if (raw) {
          const arr = JSON.parse(raw);
          if (Array.isArray(arr)) {
            for (const item of arr) {
              const l = String(item.label || item.prefLabel || '').toLowerCase().trim();
              if (l === termLower && (item.uri || item.termUID)) {
                const uri = item.uri || item.termUID;
                const nsMatch = uri.match(/^(https?:\/\/[^\/]+\/[^\/]+\/)/);
                return {
                  uri,
                  namespace: nsMatch ? nsMatch[1] : (uri.substring(0, uri.lastIndexOf('/') + 1)),
                  label: item.label || item.prefLabel
                };
              }
            }
          }
        }
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
}

/**
 * Resolves a term, string or object to an authoritative URI record.
 * Handles:
 *  - "Label <http://...>"
 *  - "Label (http://...)"
 *  - "http://..."
 *  - plain label looked up in HECTOR index or localStorage
 */
export function resolveTermUri(rawInput) {
  if (!rawInput) return null;

  // 1. If object
  if (typeof rawInput === 'object') {
    const label = rawInput._value || rawInput['#term'] || rawInput.label || rawInput.prefLabel || rawInput.name || '';
    const uri = rawInput['#termUID'] || rawInput.uri || rawInput['geometry.quickpoint.uri'] || '';
    const ns = rawInput['#namespace'] || rawInput.namespace || (uri ? uri.substring(0, uri.lastIndexOf('/') + 1) : '');
    if (uri) {
      return { label: label || uri, uri, namespace: ns, termUID: uri };
    }
    if (label) {
      return resolveTermUri(label);
    }
    return null;
  }

  const str = String(rawInput).trim();
  if (!str) return null;

  // 2. Format: "Label <http://uri...>"
  const angleMatch = str.match(/^(.*?)\s*<([^>]+)>$/);
  if (angleMatch) {
    const label = angleMatch[1].trim();
    const uri = angleMatch[2].trim();
    const ns = uri.substring(0, uri.lastIndexOf('/') + 1);
    return { label, uri, namespace: ns, termUID: uri };
  }

  // 3. Format: "Label (http://uri...)"
  const parenMatch = str.match(/^(.*?)\s*\((https?:\/\/[^\)]+)\)$/);
  if (parenMatch) {
    const label = parenMatch[1].trim();
    const uri = parenMatch[2].trim();
    const ns = uri.substring(0, uri.lastIndexOf('/') + 1);
    return { label, uri, namespace: ns, termUID: uri };
  }

  // 4. Standalone URI
  if (/^https?:\/\//i.test(str)) {
    const ns = str.substring(0, str.lastIndexOf('/') + 1);
    return { label: str, uri: str, namespace: ns, termUID: str };
  }

  // 5. Look up in predefined HECTOR index
  const lower = str.toLowerCase().trim();
  if (HECTOR_VOCABULARY_INDEX[lower]) {
    const found = HECTOR_VOCABULARY_INDEX[lower];
    return {
      label: str, // keep user casing
      uri: found.uri,
      namespace: found.namespace,
      termUID: found.uri
    };
  }

  // 5b. Match DAP dimensions (DAP-1 to DAP-6)
  const dapMatch = lower.match(/\b(dap-[1-6])\b/i);
  if (dapMatch && HECTOR_VOCABULARY_INDEX[dapMatch[1].toLowerCase()]) {
    const found = HECTOR_VOCABULARY_INDEX[dapMatch[1].toLowerCase()];
    return {
      label: str,
      uri: found.uri,
      namespace: found.namespace,
      termUID: found.uri
    };
  }

  // 6. Look up in localStorage recent vocabs
  const localMatch = findInLocalStorageVocabs(lower);
  if (localMatch) {
    return {
      label: str,
      uri: localMatch.uri,
      namespace: localMatch.namespace,
      termUID: localMatch.uri
    };
  }

  return null;
}

/**
 * Resolves a list of terms separated by ';' or ',' and appends URIs where available
 */
export function resolveTermList(rawText) {
  if (!rawText || typeof rawText !== 'string') return rawText;
  
  // If it already has structured note separator ' — '
  const parts = rawText.split(' — ');
  const termsPart = parts[0];
  const notePart = parts.slice(1).join(' — ').trim();

  // Split on ';' or ','
  const delimiter = termsPart.includes(';') ? ';' : ',';
  const tokens = termsPart.split(delimiter).map(t => t.trim()).filter(Boolean);

  const resolvedTokens = tokens.map(token => {
    const res = resolveTermUri(token);
    if (res && res.uri) {
      // Don't duplicate if already present in token
      if (token.includes(res.uri)) return token;
      return `${res.label} (${res.uri})`;
    }
    return token;
  });

  let result = resolvedTokens.join('; ');
  if (notePart) {
    result = `${result} — ${notePart}`;
  }
  return result;
}
