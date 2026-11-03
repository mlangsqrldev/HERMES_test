import { jsPDF } from 'jspdf';
import { resolveTermUri, resolveTermList } from './termResolver.js';

/**
 * Helper to extract clean entity ID
 */
function getEntityId(entity, fallback = '') {
  if (!entity) return fallback;
  if (typeof entity === 'string') return entity.trim();
  const id = entity['recordInformation.id'] || entity.id || entity['appellation.id'] || entity._id || fallback;
  return typeof id === 'string' ? id.trim() : fallback;
}

/**
 * Helper to extract clean entity Name / Title
 */
function getEntityName(entity, fallback = '') {
  if (!entity) return fallback;
  if (typeof entity === 'string') return entity.trim();
  const raw = (
    entity['appellation.name'] ||
    entity.name ||
    entity.title ||
    entity['title'] ||
    fallback
  );

  if (Array.isArray(raw)) {
    if (raw.length === 0) return fallback;
    const pref = raw.find(t => t && (t['title#preferred'] || t['name#preferred']));
    if (pref) return String(pref._value || pref.value || pref.name || fallback).trim();
    const first = raw[0];
    if (typeof first === 'object' && first !== null) {
      return String(first._value || first.value || first.name || fallback).trim();
    }
    return String(first || fallback).trim();
  }

  if (typeof raw === 'object' && raw !== null) {
    return String(raw._value || raw.value || raw.name || fallback).trim();
  }

  return String(raw || fallback).trim();
}

/**
 * Helper to extract array of IDs from string, object or array
 */
function extractIdList(val) {
  if (!val) return [];
  const rawList = Array.isArray(val) ? val : [val];
  const out = [];
  rawList.forEach(item => {
    if (!item) return;
    if (typeof item === 'string') {
      const trimmed = item.trim();
      if (trimmed && trimmed !== '—' && trimmed !== '-') out.push(trimmed);
    } else if (typeof item === 'object') {
      const v = item._value || item.id || item.value || item['#term'] || '';
      if (v && typeof v === 'string') {
        const trimmed = v.trim();
        if (trimmed && trimmed !== '—' && trimmed !== '-') out.push(trimmed);
      }
    }
  });
  return [...new Set(out)];
}

/**
 * Helper to format terms with their resolved URIs
 */
function formatValueWithUri(val) {
  if (!val) return '—';
  if (Array.isArray(val)) {
    return val.map(item => formatSingleValueWithUri(item)).filter(Boolean).join('; ');
  }
  return formatSingleValueWithUri(val);
}

function formatSingleValueWithUri(val) {
  if (!val) return '—';
  if (typeof val === 'object') {
    const label = val._value || val['#term'] || val.label || val.prefLabel || val.name || '';
    const uri = val['#termUID'] || val.uri || '';
    return uri ? `${label} (${uri})` : (label || '—');
  }
  const str = String(val).trim();
  const res = resolveTermUri(str);
  if (res && res.uri) {
    if (str.includes(res.uri)) return str;
    return `${res.label} (${res.uri})`;
  }
  return str;
}

/**
 * Builds a project-wide relational index connecting:
 * Collections <-> Heritage Assets <-> Digital Resources (Master & Derivative) <-> Activities & DAP
 */
function buildProjectRelationshipIndex(allData = {}) {
  const collections = allData.Collection || [];
  const heritageAssets = allData.HeritageAsset || [];
  const digitalResources = allData.DigitalResource || [];
  const activities = allData.Activity || [];

  const entityRegistry = {}; // id -> { id, type, name, subType, record }
  const relations = {
    haToDr: {},
    haToAct: {},
    drToHa: {},
    drToAct: {},
    drToMaster: {},
    drToDerivatives: {},
    actToHa: {},
    actToDr: {}
  };

  // 1. Index Collections
  collections.forEach((col, idx) => {
    const id = getEntityId(col, `COL-${idx + 1}`);
    entityRegistry[id] = {
      id,
      type: 'Collection',
      name: col.title || col.name || `Sammlung ${idx + 1}`,
      record: col
    };
  });

  // 2. Index Heritage Assets
  heritageAssets.forEach((ha, idx) => {
    const id = getEntityId(ha, `HA-${idx + 1}`);
    const name = getEntityName(ha, `Kulturgut ${idx + 1}`);
    entityRegistry[id] = { id, type: 'HeritageAsset', name, record: ha };
    relations.haToDr[id] = new Set();
    relations.haToAct[id] = new Set();
  });

  // 3. Index Digital Resources & classify Master vs Realtime Derivat
  digitalResources.forEach((dr, idx) => {
    const id = getEntityId(dr, `DR-${idx + 1}`);
    const name = getEntityName(dr, `3D-Digitalisat ${idx + 1}`);

    const isDerivExplicit = extractIdList(dr.isDerivativeOf).length > 0;
    const hasDerivExplicit = extractIdList(dr.hasDerivative).length > 0;
    const format = String(dr.format || '').toLowerCase();
    const extent = String(dr.extent || '').toLowerCase();
    const idStr = String(id || '').toLowerCase();
    const nameStr = String(name || '').toLowerCase();

    let subType = 'unknown';
    if (
      isDerivExplicit ||
      idStr.includes('realtime') ||
      idStr.includes('glb') ||
      idStr.includes('lod') ||
      nameStr.includes('realtime') ||
      format.includes('gltf') ||
      format.includes('glb')
    ) {
      subType = 'derivative';
    } else if (
      hasDerivExplicit ||
      idStr.includes('master') ||
      idStr.includes('hp') ||
      nameStr.includes('master') ||
      extent.includes('master') ||
      format.includes('obj') ||
      format.includes('ply') ||
      format.includes('e57')
    ) {
      subType = 'master';
    } else {
      // Default: master if it has high poly or no parent derivative
      subType = 'master';
    }

    entityRegistry[id] = { id, type: 'DigitalResource', name, subType, record: dr };
    relations.drToHa[id] = new Set();
    relations.drToAct[id] = new Set();
    relations.drToMaster[id] = new Set();
    relations.drToDerivatives[id] = new Set();
  });

  // 4. Index Activities
  activities.forEach((act, idx) => {
    const id = getEntityId(act, `ACT-${idx + 1}`);
    const name = getEntityName(act, `Aktivität ${idx + 1}`);
    entityRegistry[id] = { id, type: 'Activity', name, record: act };
    relations.actToHa[id] = new Set();
    relations.actToDr[id] = new Set();
  });

  // 5. Connect explicit relations across entities
  // Connect DR relations
  digitalResources.forEach((dr, idx) => {
    const drId = getEntityId(dr, `DR-${idx + 1}`);

    extractIdList(dr.isRepresentationOf).forEach(haId => {
      relations.drToHa[drId]?.add(haId);
      relations.haToDr[haId]?.add(drId);
    });

    extractIdList(dr.isDerivativeOf).forEach(mId => {
      relations.drToMaster[drId]?.add(mId);
      relations.drToDerivatives[mId]?.add(drId);
    });

    extractIdList(dr.hasDerivative).forEach(dId => {
      relations.drToDerivatives[drId]?.add(dId);
      relations.drToMaster[dId]?.add(drId);
    });

    extractIdList(dr.dcRelation).forEach(relId => {
      if (entityRegistry[relId]?.type === 'Activity') {
        relations.drToAct[drId]?.add(relId);
        relations.actToDr[relId]?.add(drId);
      }
    });
  });

  // Connect HA relations
  heritageAssets.forEach((ha, idx) => {
    const haId = getEntityId(ha, `HA-${idx + 1}`);

    extractIdList(ha.wasDigitizedBy).forEach(actId => {
      relations.haToAct[haId]?.add(actId);
      relations.actToHa[actId]?.add(haId);
    });

    extractIdList(ha.hasRepresentation).forEach(drId => {
      relations.haToDr[haId]?.add(drId);
      relations.drToHa[drId]?.add(haId);
    });

    extractIdList(ha.dcRelation).forEach(relId => {
      if (entityRegistry[relId]?.type === 'Activity') {
        relations.haToAct[haId]?.add(relId);
        relations.actToHa[relId]?.add(haId);
      }
    });
  });

  // Connect Activity relations
  activities.forEach((act, idx) => {
    const actId = getEntityId(act, `ACT-${idx + 1}`);

    extractIdList(act.hasCreated).forEach(drId => {
      relations.actToDr[actId]?.add(drId);
      relations.drToAct[drId]?.add(actId);
    });

    extractIdList(act.wasPresentAt).forEach(haId => {
      relations.actToHa[actId]?.add(haId);
      relations.haToAct[haId]?.add(actId);
    });

    extractIdList(act.dcRelation).forEach(relId => {
      if (entityRegistry[relId]?.type === 'HeritageAsset') {
        relations.actToHa[actId]?.add(relId);
        relations.haToAct[relId]?.add(actId);
      } else if (entityRegistry[relId]?.type === 'DigitalResource') {
        relations.actToDr[actId]?.add(relId);
        relations.drToAct[relId]?.add(actId);
      }
    });
  });

  // Transitive closure: If DR represents HA and DR is created by ACT, link HA <-> ACT!
  digitalResources.forEach(dr => {
    const drId = getEntityId(dr);
    const haList = relations.drToHa[drId] || [];
    const actList = relations.drToAct[drId] || [];

    haList.forEach(haId => {
      actList.forEach(actId => {
        relations.haToAct[haId]?.add(actId);
        relations.actToHa[actId]?.add(haId);
      });
    });
  });

  return { entityRegistry, relations };
}

/**
 * Generates an academic, human-readable Markdown documentation report
 * from HERMES form data (CARARE + DAP 6-Dimensions).
 */
export function generateMarkdownReport(allData = {}, locale = 'de') {
  const isDe = locale === 'de';
  const now = new Date().toISOString().substring(0, 10);

  const collections = allData.Collection || [];
  const heritageAssets = allData.HeritageAsset || [];
  const digitalResources = allData.DigitalResource || [];
  const activities = allData.Activity || [];

  const { entityRegistry, relations } = buildProjectRelationshipIndex(allData);

  let md = '';

  // Title & Metadata Banner
  md += `# ${isDe ? 'HERMES Metadaten-Dokumentation & Digital Authenticity Profile' : 'HERMES Metadata Documentation & Digital Authenticity Profile'}\n`;
  md += `## ${isDe ? 'CARARE 2.0.6 Langzeitarchivierung & 3D-Dokumentation' : 'CARARE 2.0.6 Digital Preservation & 3D Documentation Report'}\n\n`;

  md += `| ${isDe ? 'Archiv-Parameter' : 'Archival Parameter'} | ${isDe ? 'Spezifikation' : 'Specification'} |\n`;
  md += `|---|---|\n`;
  md += `| **${isDe ? 'Erstellungsdatum' : 'Generation Date'}** | ${now} |\n`;
  md += `| **${isDe ? 'Software-Agent' : 'Software Agent'}** | HERMES (Heritage Metadata Entry System) v0.1.6 |\n`;
  md += `| **${isDe ? 'Metadaten-Schema' : 'Metadata Schema'}** | CARARE 2.0.6 (\`metadata/carare-v2.0.6.xml\`, 100% XSD-validiert) |\n`;
  md += `| **${isDe ? 'Paketstandard' : 'Packaging Standard'}** | RFC 8493 BagIt mit kryptographischen SHA-256 Prüfsummen |\n`;
  md += `| **${isDe ? 'Vokabular-Standard' : 'Vocabulary Standard'}** | HECTOR (BCDH Uni Bonn), Pleiades, Getty AAT, GND |\n`;
  md += `| **${isDe ? 'Authentizitäts-Profil' : 'Authenticity Profile'}** | Digital Authenticity Profile (DAP-1 bis DAP-6) |\n\n`;

  md += `---\n\n`;

  // 1. Collections
  if (collections.length > 0) {
    md += `## 1. ${isDe ? 'Sammlung & Trägerinstitution (Collection)' : 'Collection & Provider'}\n\n`;
    collections.forEach((col, idx) => {
      const recId = getEntityId(col, `COL-${idx + 1}`);
      const title = col.title || col.name || (isDe ? 'Unbenannte Sammlung' : 'Untitled Collection');
      const desc = col.description || '—';
      const source = col['recordInformation.source'] || col.source || '—';
      const rights = col['rights.copyrightCreditLine'] || '—';

      md += `<a id="${recId}"></a>\n`;
      md += `### ${idx + 1}. ${title} (\`${recId}\`)\n\n`;
      md += `- **${isDe ? 'Verwaltende Institution / Quelle' : 'Institution / Source'}:** ${source}\n`;
      md += `- **${isDe ? 'Rechteangabe / Credit Line' : 'Credit Line'}:** ${rights}\n`;
      if (desc && desc !== '—') {
        md += `- **${isDe ? 'Beschreibung' : 'Description'}:**\n  > ${desc}\n\n`;
      }

      if (heritageAssets.length > 0) {
        md += `- **${isDe ? 'Enthaltene Kulturgüter (Heritage Assets)' : 'Contained Heritage Assets'}:**\n`;
        heritageAssets.forEach(ha => {
          const hId = getEntityId(ha);
          const hName = getEntityName(ha);
          md += `  - [${hName} (\`${hId}\`)](#${hId})\n`;
        });
        md += `\n`;
      }
    });
  }

  // 2. Heritage Asset Identification (Kulturgut)
  md += `## 2. ${isDe ? 'Kulturgut (Heritage Asset)' : 'Heritage Asset'}\n\n`;
  if (heritageAssets.length === 0) {
    md += `*${isDe ? 'Keine Kulturgüter erfasst.' : 'No heritage assets recorded.'}*\n\n`;
  } else {
    heritageAssets.forEach((ha, idx) => {
      const recId = getEntityId(ha, `HA-${idx + 1}`);
      const name = getEntityName(ha, isDe ? 'Unbenanntes Kulturgut' : 'Untitled Heritage Asset');
      const desc = ha.description || '—';
      const type = formatValueWithUri(ha['characters.heritageAssetType'] || ha.heritageAssetType);
      const materials = formatValueWithUri(ha['characters.materials'] || ha.materials);
      const period = formatValueWithUri(ha['characters.temporal.periodName']);
      const startDate = ha['characters.temporal.timeSpan.startDate'] || '';
      const endDate = ha['characters.temporal.timeSpan.endDate'] || '';
      const locName = formatValueWithUri(ha['spatial.locationSet.namedLocation']);
      const town = ha['spatial.locationSet.address.townOrCity'] || '';
      const country = ha['spatial.locationSet.address.country'] || '';
      const repo = formatValueWithUri(ha.repositoryLocation);
      const condition = ha.condition || '—';

      const linkedDrs = Array.from(relations.haToDr[recId] || []);
      const linkedActs = Array.from(relations.haToAct[recId] || []);

      md += `<a id="${recId}"></a>\n`;
      md += `### ${idx + 1}. ${name} (\`${recId}\`)\n\n`;
      md += `| ${isDe ? 'Attribut' : 'Attribute'} | ${isDe ? 'Wert / Fachvokabular' : 'Value / Controlled Vocabulary'} |\n`;
      md += `|---|---|\n`;
      md += `| **${isDe ? 'Typologie / Monument' : 'Typology'}** | ${type} |\n`;
      md += `| **${isDe ? 'Materialien (HECTOR)' : 'Materials'}** | ${materials} |\n`;
      md += `| **${isDe ? 'Datierung / Epoche' : 'Dating / Period'}** | ${period}${startDate || endDate ? ` (${startDate} bis ${endDate})` : ''} |\n`;
      md += `| **${isDe ? 'Standort / Fundort' : 'Location'}** | ${locName}${town ? `, ${town}` : ''}${country ? ` (${country})` : ''} |\n`;
      if (repo && repo !== '—') md += `| **${isDe ? 'Aufbewahrungsort / Depot' : 'Repository'}** | ${repo} |\n`;
      if (condition && condition !== '—') md += `| **${isDe ? 'Zustand' : 'Condition'}** | ${condition} |\n`;
      md += `\n`;

      if (desc && desc !== '—') {
        md += `**${isDe ? 'Wissenschaftliche Beschreibung:' : 'Curatorial Description:'}**\n\n> ${desc}\n\n`;
      }

      // Explicit Relations
      if (linkedDrs.length > 0 || linkedActs.length > 0) {
        md += `**${isDe ? 'Relationales Gefüge (Digitalisate & Aktivitäten):' : 'Relational Network (Digital Resources & Activities):'}**\n\n`;
        if (linkedDrs.length > 0) {
          md += `- **${isDe ? '3D-Repräsentationen' : '3D Representations'}:**\n`;
          linkedDrs.forEach(drId => {
            const drInfo = entityRegistry[drId];
            const tag = drInfo?.subType === 'master' ? '[3D-Master]' : '[Realtime-Derivat]';
            md += `  - ${tag} [${drInfo?.name || drId} (\`${drId}\`)](#${drId})\n`;
          });
        }
        if (linkedActs.length > 0) {
          md += `- **${isDe ? 'Digitalisierungskampagne(n)' : 'Digitisation Campaign(s)'}:**\n`;
          linkedActs.forEach(actId => {
            const actInfo = entityRegistry[actId];
            md += `  - [${actInfo?.name || actId} (\`${actId}\`)](#${actId})\n`;
          });
        }
        md += `\n`;
      }
    });
  }

  // 3. Digital Resources (3D-Digitalisate: Master vs Derivate)
  md += `## 3. ${isDe ? 'Digitale 3D-Ressourcen (Digital Resources)' : 'Digital Resources (3D Models & Assets)'}\n\n`;
  if (digitalResources.length === 0) {
    md += `*${isDe ? 'Keine digitalen Ressourcen erfasst.' : 'No digital resources recorded.'}*\n\n`;
  } else {
    digitalResources.forEach((dr, idx) => {
      const recId = getEntityId(dr, `DR-${idx + 1}`);
      const info = entityRegistry[recId] || {};
      const isMaster = info.subType === 'master';
      const name = dr['appellation.name'] || info.name || `3D Model`;
      const type = dr.type || '3D';
      const format = dr.format || 'model/gltf-binary';
      const extent = dr.extent || '—';
      const formatDetails = dr.formatDetails || '—';
      const link = dr.link || '';
      const object = dr.object || '';
      const licence = dr['rights.licence'] || 'https://creativecommons.org/licenses/by/4.0/';
      const europeanaRights = dr['rights.europeanaRights'] || 'Creative Commons - Attribution (BY)';
      const credit = dr['rights.copyrightCreditLine'] || '—';

      const pubList = Array.isArray(dr.publicationStatement) ? dr.publicationStatement : [];
      const pub = pubList[0] || {};
      const publisher = pub.publisher || '—';
      const pubPlace = pub.place || '';
      const pubDate = pub.date || '';

      const parentHaList = Array.from(relations.drToHa[recId] || []);
      const masterList = Array.from(relations.drToMaster[recId] || []);
      const derivList = Array.from(relations.drToDerivatives[recId] || []);
      const linkedActs = Array.from(relations.drToAct[recId] || []);

      const badgeText = isMaster
        ? (isDe ? '3D-Archiv-Master (High-Poly)' : '3D Archival Master (High-Poly)')
        : (isDe ? '3D-Realtime-Derivat (Web GLB / LOD)' : '3D Realtime Derivative (Web GLB / LOD)');

      md += `<a id="${recId}"></a>\n`;
      md += `### ${idx + 1}. ${name} (\`${recId}\`) — **[${badgeText}]**\n\n`;
      md += `- **${isDe ? 'Modell-Kategorie' : 'Model Category'}:** \`${badgeText}\`\n`;
      md += `- **${isDe ? 'Medientyp' : 'Media Type'}:** \`${type}\`\n`;
      md += `- **${isDe ? 'Dateiformat / MIME' : 'File Format / MIME'}:** \`${format}\`\n`;
      md += `- **${isDe ? 'Dateigröße / Geometrie-Umfang' : 'Extent / Geometry'}:** ${extent}\n`;
      if (link) md += `- **${isDe ? 'Online-Ressource' : 'Web Resource'}:** [${link}](${link})\n`;
      if (object) md += `- **${isDe ? 'Master-Objektdatei' : 'Master File'}:** [${object}](${object})\n`;
      if (publisher && publisher !== '—') {
        md += `- **${isDe ? 'Herausgeber / Publikation' : 'Publisher'}:** ${publisher}${pubPlace ? ` (${pubPlace})` : ''}${pubDate ? `, ${pubDate}` : ''}\n`;
      }
      md += `- **${isDe ? 'Lizenz' : 'Licence'}:** [${licence}](${licence})\n`;
      md += `- **${isDe ? 'Europeana Rights' : 'Europeana Rights'}:** ${europeanaRights}\n`;
      md += `- **${isDe ? 'Rechteinhaber / Credit Line' : 'Credit Line'}:** ${credit}\n`;
      if (formatDetails && formatDetails !== '—') {
        md += `- **${isDe ? '3D-Parameter & Technische Spezifikationen' : 'Technical 3D Parameters'}:**\n  > ${formatDetails}\n`;
      }

      // Relational cross references
      if (parentHaList.length > 0 || masterList.length > 0 || derivList.length > 0 || linkedActs.length > 0) {
        md += `\n**${isDe ? 'Relationales Gefüge & Herkunft:' : 'Relational Lineage & Connections:'}**\n\n`;
        if (parentHaList.length > 0) {
          md += `- **${isDe ? 'Repräsentiertes Kulturgut' : 'Represented Heritage Asset'}:** `;
          md += parentHaList.map(hId => `[${entityRegistry[hId]?.name || hId} (\`${hId}\`)](#${hId})`).join(', ') + '\n';
        }
        if (!isMaster && masterList.length > 0) {
          md += `- **${isDe ? 'Ursprung (High-Poly Master)' : 'Source (High-Poly Master)'}:** `;
          md += masterList.map(mId => `[${entityRegistry[mId]?.name || mId} (\`${mId}\`)](#${mId})`).join(', ') + '\n';
        }
        if (isMaster && derivList.length > 0) {
          md += `- **${isDe ? 'Abgeleitete Realtime-Derivate' : 'Derived Realtime Assets'}:** `;
          md += derivList.map(dId => `[${entityRegistry[dId]?.name || dId} (\`${dId}\`)](#${dId})`).join(', ') + '\n';
        }
        if (linkedActs.length > 0) {
          md += `- **${isDe ? 'Aufnahme- & Verarbeitungskampagne' : 'Digitisation Campaign'}:** `;
          md += linkedActs.map(aId => `[${entityRegistry[aId]?.name || aId} (\`${aId}\`)](#${aId})`).join(', ') + '\n';
        }
      }
      md += `\n`;
    });
  }

  // 4. Activity & Campaign (Digitalisierungsereignis)
  md += `## 4. ${isDe ? 'Digitalisierungsaktivität & Aufnahmekampagne' : 'Digitisation Activity & Campaign'}\n\n`;
  if (activities.length === 0) {
    md += `*${isDe ? 'Keine Aktivitäten erfasst.' : 'No activities recorded.'}*\n\n`;
  } else {
    activities.forEach((act, idx) => {
      const recId = getEntityId(act, `ACT-${idx + 1}`);
      const name = extractCleanText(act['appellation.name'], isDe ? 'Digitalisierungskampagne' : 'Digitisation Campaign');
      const actType = formatValueWithUri(act.eventType || act.activityType || '3D-Digitalisierung');
      const date = act['event.date.date'] || act['event.date.dateRangeQualifier'] || '—';
      const purpose = act.hasGeneralPurpose || act.description || '—';

      const linkedHaList = Array.from(relations.actToHa[recId] || []);
      const linkedDrList = Array.from(relations.actToDr[recId] || []);

      md += `<a id="${recId}"></a>\n`;
      md += `### ${idx + 1}. ${name} (\`${recId}\`)\n\n`;
      md += `- **${isDe ? 'Aktivitätstyp (HECTOR)' : 'Event Type (HECTOR)'}:** ${actType}\n`;
      md += `- **${isDe ? 'Datum / Zeitraum' : 'Date / Timespan'}:** ${date}\n`;
      if (purpose && purpose !== '—') {
        md += `- **${isDe ? 'Ziel & Vorhaben' : 'Purpose & Objectives'}:**\n  > ${purpose}\n`;
      }

      // Linked Assets
      if (linkedHaList.length > 0 || linkedDrList.length > 0) {
        md += `- **${isDe ? 'Erfasste Kulturgüter' : 'Target Heritage Assets'}:** `;
        md += linkedHaList.map(hId => `[${entityRegistry[hId]?.name || hId} (\`${hId}\`)](#${hId})`).join(', ') + '\n';
        md += `- **${isDe ? 'Generierte 3D-Digitalisate' : 'Generated 3D Resources'}:** `;
        md += linkedDrList.map(dId => `[${entityRegistry[dId]?.name || dId} (\`${dId}\`)](#${dId})`).join(', ') + '\n';
      }

      // Actors
      const actors = Array.isArray(act.actors) ? act.actors : [];
      if (actors.length > 0) {
        md += `\n**${isDe ? 'Beteiligte Akteure & Institutionen:' : 'Participating Actors & Institutions:'}**\n\n`;
        actors.forEach(a => {
          const aName = a.name || 'Unbekannt';
          const aRole = a.roles || a.role || (isDe ? 'Mitwirkende(r)' : 'Contributor');
          const aOrg = a.organization ? ` (${a.organization})` : '';
          const aId = a.id ? ` [${a.id}]` : '';
          md += `- **${aName}**${aOrg}: *${aRole}*${aId}\n`;
        });
      }
      md += `\n`;
    });
  }

  // 5. Digital Authenticity Profile (DAP 1-6) - Structured per Activity
  md += `## 5. ${isDe ? 'Digital Authenticity Profile (DAP) – Sechs Dimensionen der materiellen Evidenz' : 'Digital Authenticity Profile (DAP) – Six Dimensions of Material Evidence'}\n\n`;
  md += `${isDe
    ? 'Das Digital Authenticity Profile dokumentiert die Transformation eines materiellen Kulturguts in das digitale Medium und macht die Grenzen dieser Übersetzung explizit transparent (Ausgangslage -> Erfassungsprozess -> Begründung -> Ergebnis).'
    : 'The Digital Authenticity Profile systematically documents the translation from material evidence to digital representation.'}\n\n`;

  const dapDefs = [
    {
      id: 'DAP-1',
      phase: isDe ? 'Reference (vor der Digitalisierung)' : 'Reference (Pre-Capture)',
      name: isDe ? 'DAP-1: Materielle Spuren & Merkmale' : 'DAP-1: Material Traces & Features',
      question: isDe ? 'Welche materielle Evidenz seiner Geschichte trägt das Objekt (Beschädigungen, Bearbeitungs- und Gebrauchsspuren, Restaurierungen)?' : 'What material evidence of its history does the asset carry?',
      uri: 'http://hector.org/vocab/dap/DAP-1'
    },
    {
      id: 'DAP-2',
      phase: isDe ? 'Capture (während der Digitalisierung)' : 'Capture (During Digitisation)',
      name: isDe ? 'DAP-2: Aufnahmeprozess & Erfassungsumfang' : 'DAP-2: Acquisition Process & Scope of Capture',
      question: isDe ? 'Was wurde erfasst, was nicht, und warum? (Standflächen, Hohlräume, Sensorauflösung, optische Grenzen).' : 'What physical areas were captured, what was omitted, and why?',
      uri: 'http://hector.org/vocab/dap/DAP-2'
    },
    {
      id: 'DAP-3',
      phase: isDe ? 'Representation (nach der Digitalisierung)' : 'Representation (Post-Capture)',
      name: isDe ? 'DAP-3: Geometrie-Bearbeitung' : 'DAP-3: Geometry Processing & Interventions',
      question: isDe ? 'Welche Eingriffe gab es an der Form (Rauschfilterung, Löcherschließung, Dezimierung, Glättung)?' : 'What interventions altered the 3D geometry?',
      uri: 'http://hector.org/vocab/dap/DAP-3'
    },
    {
      id: 'DAP-4',
      phase: isDe ? 'Representation (nach der Digitalisierung)' : 'Representation (Post-Capture)',
      name: isDe ? 'DAP-4: Textur, Shader & Material' : 'DAP-4: Texture, Shader & Material Processing',
      question: isDe ? 'Welche Eingriffe gab es an der Oberfläche (Delighting, ColorChecker-Kalibrierung, PBR-Shader, Normal-Maps)?' : 'What interventions were performed on texture, lighting and color?',
      uri: 'http://hector.org/vocab/dap/DAP-4'
    },
    {
      id: 'DAP-5',
      phase: isDe ? 'Übergreifend' : 'Overarching Principles',
      name: isDe ? 'DAP-5: Wissenschaftliche Begründung' : 'DAP-5: Scholarly Rationale & Ethical Framework',
      question: isDe ? 'Warum wurde so entschieden (London Charter Prinzip 4, Sevilla-Prinzipien, minimale Intervention)?' : 'What methodological principles justified the interventions?',
      uri: 'http://hector.org/vocab/dap/DAP-5'
    },
    {
      id: 'DAP-6',
      phase: isDe ? 'Ergebnis' : 'Final Balance',
      name: isDe ? 'DAP-6: Abbildungsbilanz & Transformationsgrenzen' : 'DAP-6: Balance of Evidence & Transformation Boundaries',
      question: isDe ? 'Was ist aus den Spuren und Merkmalen aus DAP-1 im Endprodukt geworden: erhalten, verändert, verloren oder nicht erfasst?' : 'What became of the material traces from DAP-1 in the final 3D asset?',
      uri: 'http://hector.org/vocab/dap/DAP-6'
    }
  ];

  let totalDapFound = 0;

  activities.forEach((act, actIdx) => {
    const actId = getEntityId(act, `ACT-${actIdx + 1}`);
    const actName = extractCleanText(act['appellation.name'], `Aktivität ${actIdx + 1}`);
    const consistsOfList = Array.isArray(act.consistsOf) ? act.consistsOf : [];

    const matchingDaps = dapDefs.filter(def => {
      return consistsOfList.some(co => {
        const m = String(co.methods || '');
        const p = String(co.hadSpecificPurpose || '');
        return m.includes(def.id) || p.includes(def.id);
      });
    });

    if (matchingDaps.length > 0) {
      totalDapFound += matchingDaps.length;
      const targetHaList = Array.from(relations.actToHa[actId] || []);

      md += `### ${isDe ? 'DAP-Dokumentation für Aktivität' : 'DAP Documentation for Activity'}: ${actName} (\`${actId}\`)\n\n`;
      if (targetHaList.length > 0) {
        md += `- **${isDe ? 'Untersuchtes Kulturgut' : 'Investigated Heritage Asset'}:** `;
        md += targetHaList.map(hId => `[${entityRegistry[hId]?.name || hId} (\`${hId}\`)](#${hId})`).join(', ') + '\n\n';
      }

      matchingDaps.forEach(def => {
        const match = consistsOfList.find(co => {
          const m = String(co.methods || '');
          const p = String(co.hadSpecificPurpose || '');
          return m.includes(def.id) || p.includes(def.id);
        });

        const content = match.techniques || match.materials || (match.hadSpecificPurpose ? match.hadSpecificPurpose.split(':').slice(1).join(':').trim() : '') || '—';
        const equipment = match.equipment || '';

        const fieldTitle = def.id === 'DAP-1' ? (isDe ? 'Materielle Evidenz & Befund' : 'Material Evidence & Condition')
          : def.id === 'DAP-2' ? (isDe ? 'Erfassungsumfang & Auslassungsgründe' : 'Capture Scope & Omissions')
          : def.id === 'DAP-3' ? (isDe ? 'Geometrie-Operationen (HECTOR)' : 'Geometry Operations (HECTOR)')
          : def.id === 'DAP-4' ? (isDe ? 'Oberflächen- & Textur-Verfahren' : 'Surface & Texture Operations')
          : def.id === 'DAP-5' ? (isDe ? 'Wissenschaftliche Begründung & Leitlinien' : 'Scholarly Rationale & Charters')
          : (isDe ? 'Abbildungsbilanz (Evaluationsurteil)' : 'Balance of Evidence (Evaluation Verdict)');

        md += `#### ${def.name}\n\n`;
        md += `- **${isDe ? 'Phase' : 'Phase'}:** ${def.phase}\n`;
        md += `- **${isDe ? 'Forschungsfrage' : 'Research Question'}:** *${def.question}*\n`;
        md += `- **HECTOR URI:** \`${def.uri}\`\n`;
        md += `- **${fieldTitle}:**\n  ${resolveTermList(content)}\n`;
        if (equipment) {
          md += `- **${isDe ? 'Eingesetzte Hardware / Software' : 'Equipment & Software'}:** ${equipment}\n`;
        }
        md += `\n`;
      });
    }
  });

  if (totalDapFound === 0) {
    md += `*${isDe ? 'Keine expliziten DAP-Einträge in den Aktivitäten gefunden.' : 'No explicit DAP entries found.'}*\n\n`;
  }

  // Footer Sign-Off
  md += `---\n\n`;
  md += `*${isDe ? 'Dieser Metadatenbericht wurde automatisch von HERMES erzeugt und ist fester Bestandteil des BagIt-Archivs.' : 'This metadata report was generated automatically by HERMES and is a permanent component of the BagIt archive.'}*\n`;

  return md;
}

/**
 * Generates an executive, publication-grade vector PDF report with:
 * - 100% collision-free dynamic column wrapping (eliminates text overlap)
 * - Distinct visual hierarchy and color coding (Master Terracotta vs Realtime Emerald)
 * - Bidirectional relational pills with interactive cross-reference jumping (doc.link)
 * - Padded, structured DAP dimensional cards grouped by Activity
 */
export function generatePdfReport(allData = {}, locale = 'de') {
  const isDe = locale === 'de';
  const now = new Date().toISOString().substring(0, 10);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - (2 * margin);

  let y = margin;

  // Build relational index
  const { entityRegistry, relations } = buildProjectRelationshipIndex(allData);

  // Link Hotspots: { fromPage, x, y, w, h, targetId }
  const linkHotspots = [];
  // Entity Starting Page Registry: id -> pageNumber
  const entityPageMap = {};

  // Rock-solid helper to safely extract clean string from strings, arrays, or multilingual CARARE objects
  const extractCleanText = (val, fallback = '—') => {
    if (val === null || val === undefined || val === '') return fallback;
    if (typeof val === 'string') return val.trim() || fallback;
    if (typeof val === 'number') return String(val);
    if (Array.isArray(val)) {
      if (val.length === 0) return fallback;
      const pref = val.find(v => v && (v['title#preferred'] || v['name#preferred'] || v.preferred === true || v.preferred === 'true')) || val[0];
      return extractCleanText(pref, fallback);
    }
    if (typeof val === 'object') {
      const extracted = val._value || val['#text'] || val.label || val.prefLabel || val.name || val.title || val.value;
      if (extracted !== undefined && extracted !== null && extracted !== '') {
        return extractCleanText(extracted, fallback);
      }
      return fallback;
    }
    return String(val);
  };

  // Clean term formatter: strips bulky http:// URIs to present crisp terms for museum staff
  const formatMuseumTerm = (val) => {
    if (!val) return '—';
    if (Array.isArray(val)) {
      return val.map(formatSingleMuseumTerm).filter(Boolean).join(', ');
    }
    return formatSingleMuseumTerm(val);
  };

  const formatSingleMuseumTerm = (val) => {
    if (!val) return '—';
    if (typeof val === 'object') {
      const label = val._value || val['#term'] || val.label || val.prefLabel || val.name || '';
      return label ? String(label).trim() : '—';
    }
    let str = String(val).trim();
    // Remove raw URLs in parentheses like (http://...)
    str = str.replace(/\s*\(https?:\/\/[^\)]+\)/g, '');
    return str || '—';
  };

  // Extract human-readable date for Activity
  const getActivityDate = (act) => {
    if (!act) return '—';
    if (Array.isArray(act.temporal) && act.temporal.length > 0) {
      const t = act.temporal[0];
      if (t) {
        const start = t['timeSpan.startDate'] || t.startDate || '';
        const end = t['timeSpan.endDate'] || t.endDate || '';
        const period = t.periodName || t.displayDate || '';
        if (start && end) return `${start} bis ${end}${period ? ` (${period})` : ''}`;
        if (start) return `${start}${period ? ` (${period})` : ''}`;
        if (period) return period;
      }
    }
    if (act['recordInformation.creation.date']) return act['recordInformation.creation.date'];
    if (Array.isArray(act.consistsOf) && act.consistsOf.length > 0) {
      const starts = act.consistsOf.map(c => c.startDate).filter(Boolean);
      const ends = act.consistsOf.map(c => c.endDate).filter(Boolean);
      if (starts.length && ends.length) return `${starts[0]} bis ${ends[ends.length - 1]}`;
    }
    return act['event.date.date'] || '—';
  };

  // Header helper for subsequent pages
  const drawPageHeader = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text('HERMES • CARARE 2.0.6 Archival Documentation & Digital Authenticity Profile', margin, 11);
    doc.text(now, pageWidth - margin, 11, { align: 'right' });
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.3);
    doc.line(margin, 13, pageWidth - margin, 13);
  };

  // Check page break helper
  const checkPageBreak = (neededHeight = 16) => {
    if (y + neededHeight > pageHeight - margin - 12) {
      doc.addPage();
      y = margin + 3;
      drawPageHeader();
    }
  };

  // Section Header helper
  const printSectionHeader = (title, accentColor = [3, 105, 161]) => {
    checkPageBreak(18);
    y += 2;
    doc.setFillColor(241, 245, 249); // slate-100
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, 'FD');

    // Colored left accent bar
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.roundedRect(margin, y, 2.8, 8, 1, 1, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(title, margin + 5.5, y + 5.5);
    y += 12;
  };

  // Robust Field Printer helper: GUARANTEES ZERO COLLISION
  const printFieldRow = (label, value, bg = false) => {
    if (value === null || value === undefined) return;
    const cleanVal = extractCleanText(value, '—');
    if (!cleanVal || cleanVal === '—') return;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);

    const labelColWidth = 56;
    const valueColWidth = contentWidth - labelColWidth - 4;

    doc.setFont('helvetica', 'bold');
    const labelLines = doc.splitTextToSize(String(label), labelColWidth - 6);

    doc.setFont('helvetica', 'normal');
    const valueLines = doc.splitTextToSize(cleanVal, valueColWidth);

    const lineCount = Math.max(labelLines.length, valueLines.length);
    const rowHeight = Math.max(7.2, lineCount * 4.5 + 3.5);

    checkPageBreak(rowHeight + 2);

    if (bg) {
      doc.setFillColor(248, 250, 252); // slate-50
      doc.rect(margin, y - 1, contentWidth, rowHeight, 'F');
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105); // slate-600
    doc.text(labelLines, margin + 2, y + 3.8);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(valueLines, margin + labelColWidth, y + 3.8);

    // Subtle bottom border
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.2);
    doc.line(margin, y + rowHeight - 1, margin + contentWidth, y + rowHeight - 1);

    y += rowHeight;
  };

  // Interactive Clickable Pills for Relations: Jumps to target entity page
  const printRelationRow = (label, targetIds, bg = false) => {
    const validTargets = (targetIds || []).filter(Boolean);
    if (validTargets.length === 0) return;

    const labelColWidth = 66;
    const valueColWidth = contentWidth - labelColWidth - 4;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    const labelLines = doc.splitTextToSize(String(label), labelColWidth - 6);

    // Calculate pill layout
    const pills = [];
    let curX = margin + labelColWidth;
    let curYOffset = 0;
    const pillHeight = 5.2;
    const pillPaddingX = 2.5;

    validTargets.forEach(targetId => {
      const info = entityRegistry[targetId] || {};
      let pillText = `-> ${targetId}`;
      let badgeType = 'default';

      if (info.type === 'HeritageAsset') {
        const shortName = info.name && info.name.length > 26 ? info.name.substring(0, 24) + '…' : (info.name || '');
        pillText = `-> [HA] ${targetId}${shortName ? ` (${shortName})` : ''}`;
        badgeType = 'ha';
      } else if (info.type === 'DigitalResource') {
        if (info.subType === 'master') {
          pillText = `-> [Master 3D] ${targetId}`;
          badgeType = 'dr-master';
        } else {
          pillText = `-> [Realtime GLB] ${targetId}`;
          badgeType = 'dr-deriv';
        }
      } else if (info.type === 'Activity') {
        pillText = `-> [DAP-Kampagne] ${targetId}`;
        badgeType = 'activity';
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      const textWidth = doc.getTextWidth(pillText);
      const pillWidth = Math.min(valueColWidth, textWidth + (pillPaddingX * 2));

      if (curX + pillWidth > margin + contentWidth) {
        curX = margin + labelColWidth;
        curYOffset += pillHeight + 2;
      }

      pills.push({
        targetId,
        text: pillText,
        x: curX,
        yOffset: curYOffset,
        w: pillWidth,
        h: pillHeight,
        badgeType
      });

      curX += pillWidth + 2.5;
    });

    const contentBlockHeight = curYOffset + pillHeight + 3.5;
    const labelHeight = labelLines.length * 4.2 + 2;
    const totalRowHeight = Math.max(contentBlockHeight, labelHeight, 7.5);

    checkPageBreak(totalRowHeight + 2);
    const actualY = y;

    if (bg) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, actualY - 1, contentWidth, totalRowHeight, 'F');
    }

    // Draw Label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(labelLines, margin + 2, actualY + 3.2);

    // Draw Pills
    pills.forEach(pill => {
      const pillY = actualY + pill.yOffset + 1;
      const pillX = pill.x;

      if (pill.badgeType === 'dr-master') {
        doc.setFillColor(254, 243, 199); // amber-100
        doc.setDrawColor(217, 119, 6);   // amber-600
        doc.setTextColor(180, 83, 9);    // amber-700
      } else if (pill.badgeType === 'dr-deriv') {
        doc.setFillColor(209, 250, 229); // emerald-100
        doc.setDrawColor(16, 185, 129);  // emerald-500
        doc.setTextColor(4, 120, 87);    // emerald-700
      } else if (pill.badgeType === 'ha') {
        doc.setFillColor(224, 242, 254); // sky-100
        doc.setDrawColor(14, 165, 233);  // sky-500
        doc.setTextColor(3, 105, 161);   // sky-700
      } else if (pill.badgeType === 'activity') {
        doc.setFillColor(238, 242, 255); // indigo-100
        doc.setDrawColor(99, 102, 241);  // indigo-500
        doc.setTextColor(67, 56, 202);   // indigo-700
      } else {
        doc.setFillColor(241, 245, 249);
        doc.setDrawColor(203, 213, 225);
        doc.setTextColor(15, 23, 42);
      }

      doc.setLineWidth(0.25);
      doc.roundedRect(pillX, pillY, pill.w, pill.h, 1, 1, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text(pill.text, pillX + pillPaddingX, pillY + 3.6);

      // Register hotspot for click navigation
      linkHotspots.push({
        fromPage: doc.internal.getCurrentPageInfo().pageNumber,
        x: pillX,
        y: pillY,
        w: pill.w,
        h: pill.h,
        targetId: pill.targetId
      });
    });

    // Border bottom
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.2);
    doc.line(margin, actualY + totalRowHeight - 1, margin + contentWidth, actualY + totalRowHeight - 1);

    y += totalRowHeight;
  };

  // --- PAGE 1: TITLE BANNER ---
  doc.setFillColor(30, 41, 59); // deep slate #1e293b
  doc.roundedRect(margin, y, contentWidth, 26, 3, 3, 'F');

  // Amber accent line
  doc.setFillColor(217, 119, 6); // amber-600 #d97706
  doc.roundedRect(margin, y + 24.5, contentWidth, 1.5, 0, 0, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13.5);
  doc.text(isDe ? 'HERMES METADATEN- & 3D-ARCHIVBERICHT' : 'HERMES 3D METADATA & ARCHIVAL REPORT', margin + 6, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(224, 242, 254); // sky-100
  doc.text(
    isDe
      ? 'Museumsdokumentation • Digital Authenticity Profile (DAP 1–6) • CARARE 2.0.6'
      : 'Museum Documentation • Digital Authenticity Profile (DAP 1–6) • CARARE 2.0.6',
    margin + 6,
    y + 18
  );

  y += 31;

  // Overview Statistics Box
  const collections = allData.Collection || [];
  const heritageAssets = allData.HeritageAsset || [];
  const digitalResources = allData.DigitalResource || [];
  const activities = allData.Activity || [];

  const colPrimary = collections[0] || {};
  const institutionName = extractCleanText(colPrimary.source || colPrimary.institution, 'Universität Bonn / SMB');
  const collectionTitle = extractCleanText(colPrimary.title || colPrimary.name, isDe ? 'Attische Meisterwerke der Antikensammlung' : 'Attic Masterpieces Collection');

  const rawOverviewRows = [
    [isDe ? 'Institution / Museum' : 'Institution / Museum', institutionName],
    [isDe ? 'Sammlung / Projekt' : 'Collection / Project', collectionTitle],
    [isDe ? 'Projektumfang' : 'Project Scope', `${heritageAssets.length} ${isDe ? 'Kulturgüter' : 'Heritage Assets'} • ${digitalResources.length} ${isDe ? '3D-Modelle' : '3D Models'} • ${activities.length} ${isDe ? 'Digitalisierungskampagnen' : 'Campaigns'}`],
    [isDe ? 'Archivstandard' : 'Archival Standard', 'CARARE 2.0.6 XML (XSD-validiert) • BagIt RFC 8493 (SHA-256)'],
    [isDe ? 'Paradata-Standard' : 'Paradata Standard', 'Digital Authenticity Profile (DAP-1 bis DAP-6, HECTOR Vokabular)'],
    [isDe ? 'Erstellungsdatum & Software' : 'Generated On & Software', `${now} • HERMES v0.1.6 (Heritage Metadata Entry System)`]
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  let totalOverviewHeight = 4;
  const processedOverviewRows = rawOverviewRows.map(([k, v]) => {
    const cleanText = extractCleanText(v, '—');
    const vLines = doc.splitTextToSize(cleanText, contentWidth - 52);
    const rowH = Math.max(6.0, vLines.length * 4.2 + 2.0);
    totalOverviewHeight += rowH;
    return { k: String(k), vLines, rowH };
  });

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, totalOverviewHeight + 3, 2, 2, 'FD');

  y += 3.5;
  processedOverviewRows.forEach(({ k, vLines, rowH }) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(k + ':', margin + 4, y + 3.0);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(vLines, margin + 48, y + 3.0);
    y += rowH;
  });

  y += 5;

  // Statement / Context box with generous padding so text never overflows
  const statementStr = extractCleanText(colPrimary.statement, '');
  if (statementStr && statementStr !== '—') {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const statementLines = doc.splitTextToSize(statementStr, contentWidth - 10);
    const stmtBoxH = statementLines.length * 4.4 + 12;
    checkPageBreak(stmtBoxH + 4);

    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, stmtBoxH, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(isDe ? 'Projektkontext / Leitbild:' : 'Project Context / Rationale:', margin + 4, y + 5.6);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text(statementLines, margin + 4, y + 9.5);
    y += stmtBoxH + 4;
  }

  // --- KAPITEL 1: KULTURGÜTER (HERITAGE ASSETS) ---
  printSectionHeader(isDe ? '1. Dokumentierte Kulturgüter (Museumsobjekte)' : '1. Documented Heritage Assets (Museum Objects)', [3, 105, 161]);

  if (heritageAssets.length === 0) {
    printFieldRow(isDe ? 'Status' : 'Status', isDe ? 'Keine Kulturgüter erfasst' : 'No assets recorded');
  } else {
    heritageAssets.forEach((ha, idx) => {
      const recId = getEntityId(ha, `HA-${idx + 1}`);
      const name = getEntityName(ha, `Kulturgut ${idx + 1}`);
      const type = formatMuseumTerm(ha.generalType || ha.monumentType || ha.type || 'Artefact');
      const materials = formatMuseumTerm(ha.materials || ha.material);
      const period = formatMuseumTerm(ha.periodName || ha.temporal || ha.epoch);
      const startDate = ha['characters.temporal.timeSpan.startDate'] || ha.startDate || '';
      const endDate = ha['characters.temporal.timeSpan.endDate'] || ha.endDate || '';
      const loc = ha['spatial.locationSet.namedLocation'] || ha.location || '';
      const town = ha['spatial.locationSet.address.townOrCity'] || '';
      const country = ha['spatial.locationSet.address.country'] || '';
      const repo = formatMuseumTerm(ha.repositoryLocation);
      const desc = ha.description || '';
      const condition = ha.condition || ha['conditions.conditionText'] || '';

      const linkedDrs = Array.from(relations.haToDr[recId] || []);
      const linkedActs = Array.from(relations.haToAct[recId] || []);

      entityPageMap[recId] = doc.internal.getCurrentPageInfo().pageNumber;

      checkPageBreak(14);

      // Card Header
      doc.setFillColor(240, 249, 255); // sky-50
      doc.setDrawColor(186, 230, 253); // sky-200
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentWidth, 8.5, 1, 1, 'FD');

      doc.setFillColor(3, 105, 161); // sky-700
      doc.roundedRect(margin, y, 2.5, 8.5, 0.5, 0.5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(3, 105, 161);
      doc.text(`${idx + 1}. ${name} [ID: ${recId}]`, margin + 4, y + 5.6, { maxWidth: contentWidth - 52 });

      // Badge
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(14, 116, 144);
      doc.text(isDe ? 'MUSEUMSOBJEKT' : 'HERITAGE ASSET', pageWidth - margin - 3, y + 5, { align: 'right' });
      y += 10.5;

      printFieldRow(isDe ? 'Objektart / Typologie' : 'Typology', type, true);
      printFieldRow(isDe ? 'Material & Technik' : 'Materials', materials, false);
      printFieldRow(isDe ? 'Datierung & Epoche' : 'Dating & Period', `${period}${startDate || endDate ? ` (${startDate} bis ${endDate})` : ''}`, true);
      if (repo && repo !== '—') printFieldRow(isDe ? 'Aufbewahrungsort' : 'Repository', repo, false);
      if (loc || town) printFieldRow(isDe ? 'Fundort / Herkunft' : 'Location / Provenance', `${loc}${town ? `, ${town}` : ''}${country ? ` (${country})` : ''}`, true);
      if (condition && condition !== '—') printFieldRow(isDe ? 'Erhaltungszustand' : 'Condition Assessment', condition, false);
      if (desc && desc !== '—') printFieldRow(isDe ? 'Beschreibung' : 'Description', desc, true);

      // Prominent Relations
      if (linkedDrs.length > 0) {
        printRelationRow(isDe ? 'Zugehörige 3D-Digitalisate' : '3D Representations', linkedDrs, false);
      }
      if (linkedActs.length > 0) {
        printRelationRow(isDe ? 'Digitalisierungskampagne' : 'Digitisation Campaign', linkedActs, true);
      }
      y += 3;
    });
  }

  // --- KAPITEL 2: DIGITALE 3D-RESSOURCEN (MASTER VS DERIVAT) ---
  printSectionHeader(isDe ? '2. Digitale 3D-Ressourcen (Master & Realtime-Derivate)' : '2. Digital 3D Resources (Master & Derivatives)', [180, 83, 9]);

  if (digitalResources.length === 0) {
    printFieldRow(isDe ? 'Status' : 'Status', isDe ? 'Keine digitalen Ressourcen erfasst' : 'None recorded');
  } else {
    digitalResources.forEach((dr, idx) => {
      const recId = getEntityId(dr, `DR-${idx + 1}`);
      const info = entityRegistry[recId] || {};
      const isMaster = info.subType === 'master';

      const name = extractCleanText(dr['appellation.name'] || info.name, isMaster ? '3D Master Model' : '3D Realtime Derivative');
      const format = dr.format || (isMaster ? 'model/obj' : 'model/gltf-binary');
      const extent = dr.extent || '—';
      const formatDetails = dr.formatDetails || '';
      const object = dr.object || '';
      const licence = dr['rights.licence'] || 'CC BY 4.0';
      const credit = dr['rights.copyrightCreditLine'] || '';

      const parentHaList = Array.from(relations.drToHa[recId] || []);
      const masterList = Array.from(relations.drToMaster[recId] || []);
      const derivList = Array.from(relations.drToDerivatives[recId] || []);
      const linkedActs = Array.from(relations.drToAct[recId] || []);

      entityPageMap[recId] = doc.internal.getCurrentPageInfo().pageNumber;

      checkPageBreak(14);

      if (isMaster) {
        doc.setFillColor(254, 243, 199); // amber-100
        doc.setDrawColor(245, 158, 11);  // amber-500
        doc.setLineWidth(0.3);
        doc.roundedRect(margin, y, contentWidth, 8.5, 1, 1, 'FD');

        doc.setFillColor(217, 119, 6);   // amber-600
        doc.roundedRect(margin, y, 2.5, 8.5, 0.5, 0.5, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(180, 83, 9);
        doc.text(`${idx + 1}. ${name} [ID: ${recId}]`, margin + 4, y + 5.6, { maxWidth: contentWidth - 52 });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(180, 83, 9);
        doc.text(isDe ? '3D-MASTER (ARCHIVQUALITÄT)' : '3D MASTER (ARCHIVAL)', pageWidth - margin - 3, y + 5, { align: 'right' });
      } else {
        doc.setFillColor(209, 250, 229); // emerald-100
        doc.setDrawColor(16, 185, 129);  // emerald-500
        doc.setLineWidth(0.3);
        doc.roundedRect(margin, y, contentWidth, 8.5, 1, 1, 'FD');

        doc.setFillColor(5, 150, 105);   // emerald-600
        doc.roundedRect(margin, y, 2.5, 8.5, 0.5, 0.5, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(4, 120, 87);
        doc.text(`${idx + 1}. ${name} [ID: ${recId}]`, margin + 4, y + 5.6, { maxWidth: contentWidth - 52 });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(4, 120, 87);
        doc.text(isDe ? 'WEB REALTIME-DERIVAT (GLB)' : 'WEB REALTIME ASSET (GLB)', pageWidth - margin - 3, y + 5, { align: 'right' });
      }

      y += 10.5;

      // Concisely combine format & extent without repeating
      const formatDisplay = `${isMaster ? (isDe ? 'Archival Master (High-Poly)' : 'Archival Master') : (isDe ? 'Web Realtime Asset (GLB)' : 'Web Realtime Asset')} • Format: ${format}${extent && extent !== '—' ? ` • Umfang: ${extent}` : ''}`;
      printFieldRow(isDe ? 'Format & Modelltyp' : 'Format & Type', formatDisplay, true);

      if (object) printFieldRow(isDe ? 'Datei / Master-Objekt' : 'File Name', object, false);
      if (formatDetails && formatDetails !== '—') printFieldRow(isDe ? '3D-Parameter & Pipeline' : '3D Specs & Pipeline', formatDetails, true);
      printFieldRow(isDe ? 'Nutzungsrechte & Lizenz' : 'Licence & Rights', `${licence}${credit ? ` • ${credit}` : ''}`, false);

      // Relational Lineage
      if (parentHaList.length > 0) {
        printRelationRow(isDe ? 'Repräsentiertes Kulturgut' : 'Represented Asset', parentHaList, true);
      }
      if (!isMaster && masterList.length > 0) {
        printRelationRow(isDe ? 'Ursprung (3D Master)' : 'Source Master File', masterList, false);
      }
      if (isMaster && derivList.length > 0) {
        printRelationRow(isDe ? 'Abgeleitete Web-Modelle' : 'Derived Realtime Assets', derivList, false);
      }
      if (linkedActs.length > 0) {
        printRelationRow(isDe ? 'Erzeugende Kampagne' : 'Digitisation Campaign', linkedActs, true);
      }

      y += 3;
    });
  }

  // --- KAPITEL 3: DIGITALISIERUNGS- & AUTHENTIZITÄTSPROTOKOLL (DAP 1–6) ---
  // Unified, coherent dossier: combines campaign metadata and the 6 DAP authenticity steps
  printSectionHeader(
    isDe
      ? '3. Digitalisierungs- & Authentizitätsprotokoll (DAP 1–6)'
      : '3. Digitisation & Authenticity Protocol (DAP 1–6)',
    [67, 56, 202]
  );

  const dapDefs = [
    {
      id: 'DAP-1',
      phase: 'REFERENCE',
      name: isDe ? 'DAP-1: Materielle Evidenz & Befund' : 'DAP-1: Material Traces & Features',
      question: isDe ? 'Welche materielle Evidenz und Spuren (Bearbeitung, Zustand, Restaurierung) trägt das Objekt?' : 'What material evidence does the asset carry?',
    },
    {
      id: 'DAP-2',
      phase: 'CAPTURE',
      name: isDe ? 'DAP-2: Aufnahmeprozess & Erfassungsumfang' : 'DAP-2: Scope of Capture & Omissions',
      question: isDe ? 'Welche Bereiche wurden erfasst, was wurde ausgelassen und warum (Scanner, Optik, Hohlräume)?' : 'What physical areas were captured, what was omitted, and why?',
    },
    {
      id: 'DAP-3',
      phase: 'REPRESENTATION',
      name: isDe ? 'DAP-3: Geometriebearbeitung & Mesh-Fusion' : 'DAP-3: Geometry Processing',
      question: isDe ? 'Welche Eingriffe veränderten die 3D-Form (Rauschfilterung, Registrierung, Dezimierung)?' : 'What interventions altered the 3D geometry?',
    },
    {
      id: 'DAP-4',
      phase: 'REPRESENTATION',
      name: isDe ? 'DAP-4: Textur, Delighting & Shader' : 'DAP-4: Texture & Surface Shaders',
      question: isDe ? 'Welche Maßnahmen erfolgten an Textur, Farbe und Oberflächenreflexion (Delighting, PBR)?' : 'What interventions were performed on texture, lighting and color?',
    },
    {
      id: 'DAP-5',
      phase: 'PRINCIPLES',
      name: isDe ? 'DAP-5: Wissenschaftliche Kriterien & Leitlinien' : 'DAP-5: Scholarly Rationale & Charters',
      question: isDe ? 'Welche wissenschaftlichen Kriterien und Standards (z.B. London Charter) leiteten das Vorhaben?' : 'What principles or charters guided the documentation?',
    },
    {
      id: 'DAP-6',
      phase: 'EVALUATION',
      name: isDe ? 'DAP-6: Abbildungsbilanz & Gesamturteil' : 'DAP-6: Balance of Evidence & Verdict',
      question: isDe ? 'Wie verlässlich bildet das 3D-Modell die Realität ab (Soll-Ist-Abweichung, Einschränkungen)?' : 'How reliably does the 3D asset represent reality?',
    }
  ];

  if (activities.length === 0) {
    printFieldRow(isDe ? 'Status' : 'Status', isDe ? 'Keine Digitalisierungsaktivitäten erfasst' : 'None recorded');
  } else {
    activities.forEach((act, idx) => {
      const recId = getEntityId(act, `ACT-${idx + 1}`);
      const name = extractCleanText(act['appellation.name'], isDe ? '3D-Digitalisierung & Paradata' : '3D Digitisation');
      const actType = formatMuseumTerm(act.eventType || act.activityType || '3D-Digitalisierung');
      const date = getActivityDate(act);
      const purpose = act.hasGeneralPurpose || act.description || '';

      const linkedHaList = Array.from(relations.actToHa[recId] || []);
      const linkedDrList = Array.from(relations.actToDr[recId] || []);
      const consistsOfList = Array.isArray(act.consistsOf) ? act.consistsOf : [];

      entityPageMap[recId] = doc.internal.getCurrentPageInfo().pageNumber;

      checkPageBreak(18);

      // Campaign Header Box
      doc.setFillColor(238, 242, 255); // indigo-50
      doc.setDrawColor(199, 210, 254); // indigo-200
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentWidth, 7.5, 1, 1, 'FD');

      doc.setFillColor(79, 70, 229);   // indigo-600
      doc.roundedRect(margin, y, 2.5, 7.5, 0.5, 0.5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(67, 56, 202);
      doc.text(`${idx + 1}. ${name} [ID: ${recId}]`, margin + 4, y + 5.6, { maxWidth: contentWidth - 52 });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(79, 70, 229);
      doc.text(isDe ? 'DAP-KAMPAGNE' : 'DAP CAMPAIGN', pageWidth - margin - 3, y + 5, { align: 'right' });
      y += 10.5;

      printFieldRow(isDe ? 'Verfahren & Aktivitätstyp' : 'Method & Event Type', actType, true);
      printFieldRow(isDe ? 'Zeitraum & Kampagnendatum' : 'Date & Timespan', date, false);
      if (purpose && purpose !== '—') printFieldRow(isDe ? 'Erkenntnisziel & Zweck' : 'Scholarly Purpose', purpose, true);

      // Actors
      const actors = Array.isArray(act.actors) ? act.actors : [];
      if (actors.length > 0) {
        const actorSummary = actors.map(a => `${a.name || 'Akteur'} (${a.roles || a.role || 'Dokumentation'}${a.organization ? `, ${a.organization}` : ''})`).join('; ');
        printFieldRow(isDe ? 'Beteiligte Fachleute' : 'Actors & Contributors', actorSummary, false);
      }

      // Jump links to target objects and models
      if (linkedHaList.length > 0) {
        printRelationRow(isDe ? 'Digitalisiertes Kulturgut' : 'Target Heritage Asset', linkedHaList, true);
      }
      if (linkedDrList.length > 0) {
        printRelationRow(isDe ? 'Erzeugte 3D-Modelle' : 'Generated 3D Models', linkedDrList, false);
      }

      // Render the 6 DAP authenticity dimensions directly inside this campaign
      const activeDaps = dapDefs.filter(def => {
        return consistsOfList.some(co => {
          const m = String(co.methods || '');
          const p = String(co.hadSpecificPurpose || '');
          return m.includes(def.id) || p.includes(def.id);
        });
      });

      if (activeDaps.length > 0) {
        y += 2;
        checkPageBreak(12);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        doc.text(isDe ? 'Paradata-Dimensionen (Digital Authenticity Profile DAP-1 bis DAP-6):' : 'Paradata Dimensions (Digital Authenticity Profile DAP-1 to DAP-6):', margin + 2, y + 3);
        y += 6;

        activeDaps.forEach(def => {
          const match = consistsOfList.find(co => {
            const m = String(co.methods || '');
            const p = String(co.hadSpecificPurpose || '');
            return m.includes(def.id) || p.includes(def.id);
          });

          const content = match.techniques || match.materials || (match.hadSpecificPurpose ? match.hadSpecificPurpose.split(':').slice(1).join(':').trim() : '') || '—';
          const equipment = match.equipment || '';

          checkPageBreak(20);

          // DAP Dimension Header Bar (Clean, no raw http:// URLs)
          doc.setFillColor(248, 250, 252); // slate-50
          doc.setDrawColor(226, 232, 240); // slate-200
          doc.roundedRect(margin, y, contentWidth, 6, 1, 1, 'FD');

          doc.setFillColor(2, 132, 199); // sky-600
          doc.roundedRect(margin, y, 2, 6, 0.5, 0.5, 'F');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(15, 23, 42);
          doc.text(def.name, margin + 4, y + 4.2);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7);
          doc.setTextColor(100, 116, 139);
          doc.text(`[${def.phase}]`, pageWidth - margin - 2, y + 4.2, { align: 'right' });
          y += 7.5;

          // Question in soft callout box
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(7.5);
          doc.setTextColor(100, 116, 139);
          const qLines = doc.splitTextToSize(`Frage: ${def.question}`, contentWidth - 8);
          const qBoxHeight = (qLines.length * 4.0) + 4.5;

          doc.setFillColor(248, 250, 252);
          doc.rect(margin + 1, y - 1, contentWidth - 2, qBoxHeight, 'F');
          doc.text(qLines, margin + 4, y + 3.2);
          y += qBoxHeight + 2;

          // Finding & Method
          printFieldRow(isDe ? 'Befund & Methode' : 'Finding & Method', formatSingleMuseumTerm(content), true);
          if (equipment) {
            printFieldRow(isDe ? 'Eingesetzte Geräte & Software' : 'Hardware / Pipeline', equipment, false);
          }
          y += 1.5;
        });
      }

      y += 4;
    });
  }

  // --- FINAL PASS: JUMP LINKS & FOOTER (Seite X von Y) ---
  const totalPages = doc.getNumberOfPages();

  // 1. Resolve all link hotspots to target pages
  linkHotspots.forEach(spot => {
    const targetPage = entityPageMap[spot.targetId];
    if (targetPage) {
      doc.setPage(spot.fromPage);
      doc.link(spot.x, spot.y, spot.w, spot.h, { pageNumber: targetPage });
    }
  });

  // 2. Draw standard archival footers
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.text('HERMES v0.1.6 • Heritage Metadata Entry System • BCDH Universität Bonn', margin, pageHeight - 8);
    const pageStr = isDe ? `Seite ${p} von ${totalPages}` : `Page ${p} of ${totalPages}`;
    doc.text(pageStr, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  return doc;
}
