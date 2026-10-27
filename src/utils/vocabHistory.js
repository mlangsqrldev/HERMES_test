import { ref } from 'vue';

const MAX_RECENT_TERMS = 20;

const defaultSeeds = {
  materials: [
    { label: 'Marmor', uri: 'https://hector.bcdh.uni-bonn.de/marble' },
    { label: 'Bronze', uri: 'https://hector.bcdh.uni-bonn.de/bronze' },
    { label: 'Kalkstein', uri: 'https://hector.bcdh.uni-bonn.de/limestone' },
    { label: 'Ton', uri: 'https://hector.bcdh.uni-bonn.de/clay' },
    { label: 'Terrakotta', uri: 'https://hector.bcdh.uni-bonn.de/terracotta' },
    { label: 'Gold', uri: 'https://hector.bcdh.uni-bonn.de/gold' },
    { label: 'Silber', uri: 'https://hector.bcdh.uni-bonn.de/silver' },
    { label: 'Holz', uri: 'https://hector.bcdh.uni-bonn.de/wood' },
    { label: 'Elfenbein', uri: 'https://hector.bcdh.uni-bonn.de/ivory' },
    { label: 'Alabaster', uri: 'https://hector.bcdh.uni-bonn.de/alabaster' },
    { label: 'Granit', uri: 'https://hector.bcdh.uni-bonn.de/granite' },
    { label: 'Glas', uri: 'https://hector.bcdh.uni-bonn.de/glass' },
    { label: 'Eisen', uri: 'https://hector.bcdh.uni-bonn.de/iron' },
    { label: 'Sandstein', uri: 'https://hector.bcdh.uni-bonn.de/sandstone' },
    { label: 'Kupfer', uri: 'https://hector.bcdh.uni-bonn.de/copper' },
    { label: 'Porphyr', uri: 'https://hector.bcdh.uni-bonn.de/porphyry' },
    { label: 'Basalt', uri: 'https://hector.bcdh.uni-bonn.de/basalt' },
    { label: 'Blei', uri: 'https://hector.bcdh.uni-bonn.de/lead' },
    { label: 'Stuck', uri: 'https://hector.bcdh.uni-bonn.de/stucco' },
    { label: 'Knochen', uri: 'https://hector.bcdh.uni-bonn.de/bone' }
  ],
  monument_type: [
    { label: 'Grab', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_d33a8f22', facet: 'Architekturtyp' },
    { label: 'Grabrelief', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_9b922858', facet: 'Plastik' },
    { label: 'Grabbau', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_c97ec1e6', facet: 'Architekturtyp' },
    { label: 'Grabpfeiler', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_fd246759', facet: 'Architekturtyp' },
    { label: 'Statue', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_40fa8b34', facet: 'Plastik' },
    { label: 'Statuengruppe', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_a83004fb', facet: 'Plastik' },
    { label: 'Relief', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_3081a4fd', facet: 'Plastik' },
    { label: 'Sarkophag', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_d5445979', facet: 'Behälter' },
    { label: 'Tempel', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_3ce7e57c', facet: 'Architekturtyp' },
    { label: 'Tempelgrab', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_7fffdd00', facet: 'Architekturtyp' },
    { label: 'Altar', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_9863d832', facet: 'Architekturtyp' },
    { label: 'Altargrab', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_568f16c9', facet: 'Architekturtyp' },
    { label: 'Porträt', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_2677f8ad', facet: 'Plastik' },
    { label: 'Bauplastik', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_ec5847fa', facet: 'Plastik' },
    { label: 'Gefäß', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_43d07f2a', facet: 'Behälter' },
    { label: 'Stele', uri: 'https://hector.bcdh.uni-bonn.de/steleon', facet: 'Architekturtyp' },
    { label: 'Büste', uri: 'https://hector.bcdh.uni-bonn.de/bust', facet: 'Plastik' },
    { label: 'Wohnhaus', uri: 'https://hector.bcdh.uni-bonn.de/dwelling', facet: 'Architekturtyp' },
    { label: 'Heiligtum', uri: 'https://hector.bcdh.uni-bonn.de/sanctuary', facet: 'Architekturtyp' },
    { label: 'Kandelaber', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_0014d071', facet: 'Beleuchtungsgerät' }
  ],
  epochs: [
    { label: 'Spätklassik', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_9c4fae85' },
    { label: 'Klassische Periode', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_4a572b1e' },
    { label: 'Frühklassik', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_08466b04' },
    { label: 'Hellenismus', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_b3634024' },
    { label: 'Archaik', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_c0199182' },
    { label: 'Römische Kaiserzeit', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_8b1d9bf5' },
    { label: 'Spätantike', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_703080c9' },
    { label: 'Geometrische Periode', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_651a2eb3' },
    { label: 'Orientalisierende Periode', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_5fe19b67' },
    { label: 'Bronzezeit', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_5f4e0c4b' }
  ],
  keywords: [
    { label: 'Grabrelief', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_9b922858', source: 'HECTOR' },
    { label: 'Grabmonument', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_c97ec1e6', source: 'HECTOR' },
    { label: 'Statue', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_40fa8b34', source: 'HECTOR' },
    { label: 'Statuengruppe', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_a83004fb', source: 'HECTOR' },
    { label: 'Relief', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_3081a4fd', source: 'HECTOR' },
    { label: 'Sarkophag', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_d5445979', source: 'HECTOR' },
    { label: 'Stele', uri: 'https://hector.bcdh.uni-bonn.de/steleon', source: 'HECTOR' },
    { label: 'Büste', uri: 'https://hector.bcdh.uni-bonn.de/bust', source: 'HECTOR' },
    { label: 'Tempel', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_3ce7e57c', source: 'HECTOR' },
    { label: 'Altar', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/concept_9863d832', source: 'HECTOR' },
    { label: 'Marmor', uri: 'https://hector.bcdh.uni-bonn.de/marble', source: 'HECTOR' },
    { label: 'Bronze', uri: 'https://hector.bcdh.uni-bonn.de/bronze', source: 'HECTOR' },
    { label: 'Kalkstein', uri: 'https://hector.bcdh.uni-bonn.de/limestone', source: 'HECTOR' },
    { label: 'Spätklassik', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_9c4fae85', source: 'HECTOR' },
    { label: 'Hellenismus', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_b3634024', source: 'HECTOR' },
    { label: 'Archaik', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_c0199182', source: 'HECTOR' },
    { label: 'Klassische Periode', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_4a572b1e', source: 'HECTOR' },
    { label: 'Römische Kaiserzeit', uri: 'http://vocabs.bcdh.uni-bonn.de/hector_epochs/c_8b1d9bf5', source: 'HECTOR' }
  ]
};

const vocabRefs = {};

export function getRecentVocabList(vocabKey) {
  const key = String(vocabKey || 'general').toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  if (!vocabRefs[key]) {
    const storageKey = `hermes_recent_vocab_${key}`;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filtered = parsed.filter(item => item && item.source !== 'Getty AAT');
          if (filtered.length > 0) {
            vocabRefs[key] = ref(filtered.slice(0, MAX_RECENT_TERMS));
            return vocabRefs[key];
          }
        }
      }
    } catch (e) {
      console.warn('Failed reading recent vocab from localStorage:', e);
    }

    const initial = defaultSeeds[key] ? [...defaultSeeds[key]] : [];
    vocabRefs[key] = ref(initial.slice(0, MAX_RECENT_TERMS));
    try {
      localStorage.setItem(storageKey, JSON.stringify(vocabRefs[key].value));
    } catch (e) {
      // ignore
    }
  }
  return vocabRefs[key];
}

export function recordRecentVocabTerm(vocabKey, termItem) {
  if (!termItem) return;
  const key = String(vocabKey || 'general').toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  const listRef = getRecentVocabList(key);

  let label = '';
  let uri = '';
  let facet = '';

  if (typeof termItem === 'string') {
    const trimmed = termItem.trim();
    if (!trimmed) return;
    const match = trimmed.match(/^(.*?)\s*<([^>]+)>$/);
    if (match) {
      label = match[1].trim();
      uri = match[2].trim();
    } else {
      label = trimmed;
    }
  } else if (typeof termItem === 'object') {
    label = termItem.label || termItem.prefLabel || termItem._value || termItem.name || '';
    uri = termItem.uri || termItem['#termUID'] || termItem.id || '';
    facet = termItem.facet || '';
  }

  label = String(label).trim();
  if (!label) return;

  const current = listRef.value || [];
  const lowerLabel = label.toLowerCase();

  // Remove existing duplicate (by label or URI)
  const filtered = current.filter(item => {
    const itemLabel = typeof item === 'object' ? (item.label || item.prefLabel || '').toLowerCase() : String(item).toLowerCase();
    const itemUri = typeof item === 'object' ? (item.uri || '') : '';
    if (uri && itemUri && uri === itemUri) return false;
    return itemLabel !== lowerLabel;
  });

  const entry = {
    label,
    uri: uri || '',
    ...(facet ? { facet } : {})
  };

  filtered.unshift(entry);
  const updated = filtered.slice(0, MAX_RECENT_TERMS);
  listRef.value = updated;

  try {
    localStorage.setItem(`hermes_recent_vocab_${key}`, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed saving recent vocab terms:', e);
  }
}
