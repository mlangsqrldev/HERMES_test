import { reactive, ref, watch } from 'vue';

// 1. Global Metadata Default Language ('de', 'en', 'fr', 'it', 'es')
const storedLang = localStorage.getItem('hermes_default_meta_lang') || 'de';
export const defaultMetadataLanguage = ref(storedLang);

watch(defaultMetadataLanguage, (newVal) => {
  if (newVal) localStorage.setItem('hermes_default_meta_lang', newVal);
});

// 2. Global Rights & Licenses
export const CC_LICENCES = [
  {
    code: 'CC BY 4.0',
    short: 'CC BY 4.0',
    canonicalUri: 'https://creativecommons.org/licenses/by/4.0/',
    uriDe: 'https://creativecommons.org/licenses/by/4.0/deed.de',
    uriEn: 'https://creativecommons.org/licenses/by/4.0/deed.en',
    labelDe: 'Creative Commons - Namensnennung (CC BY 4.0)',
    labelEn: 'Creative Commons - Attribution (CC BY 4.0)',
    fullName: 'Creative Commons - Attribution (BY)',
    aliases: ['cc by 4.0', 'cc by', 'cc-by', 'cc-by 4.0', 'https://creativecommons.org/licenses/by/4.0/', 'https://creativecommons.org/licenses/by/4.0/deed.de', 'https://creativecommons.org/licenses/by/4.0/deed.en', 'creative commons - attribution (by)']
  },
  {
    code: 'CC BY-SA 4.0',
    short: 'CC BY-SA 4.0',
    canonicalUri: 'https://creativecommons.org/licenses/by-sa/4.0/',
    uriDe: 'https://creativecommons.org/licenses/by-sa/4.0/deed.de',
    uriEn: 'https://creativecommons.org/licenses/by-sa/4.0/deed.en',
    labelDe: 'Creative Commons - Namensnennung, Weitergabe unter gleichen Bedingungen (CC BY-SA 4.0)',
    labelEn: 'Creative Commons - Attribution, ShareAlike (CC BY-SA 4.0)',
    fullName: 'Creative Commons - Attribution, ShareAlike (BY-SA)',
    aliases: ['cc by-sa 4.0', 'cc by-sa', 'cc-by-sa', 'cc-by-sa 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'https://creativecommons.org/licenses/by-sa/4.0/deed.de', 'https://creativecommons.org/licenses/by-sa/4.0/deed.en', 'creative commons - attribution, sharealike (by-sa)']
  },
  {
    code: 'CC0 1.0',
    short: 'CC0 1.0',
    canonicalUri: 'https://creativecommons.org/publicdomain/zero/1.0/',
    uriDe: 'https://creativecommons.org/publicdomain/zero/1.0/deed.de',
    uriEn: 'https://creativecommons.org/publicdomain/zero/1.0/deed.en',
    labelDe: 'CC0 1.0 Universell (Public Domain / Gemeinfrei)',
    labelEn: 'The Creative Commons CC0 1.0 Universal Public Domain Dedication (CC0)',
    fullName: 'The Creative Commons CC0 1.0 Universal Public Domain Dedication (CC0)',
    aliases: ['cc0', 'cc0 1.0', 'cc0 1.0 universal', 'cc0 1.0 universal (public domain)', 'https://creativecommons.org/publicdomain/zero/1.0/', 'https://creativecommons.org/publicdomain/zero/1.0/deed.de', 'https://creativecommons.org/publicdomain/zero/1.0/deed.en', 'the creative commons cc0 1.0 universal public domain dedication (cc0)']
  },
  {
    code: 'CC BY-NC 4.0',
    short: 'CC BY-NC 4.0',
    canonicalUri: 'https://creativecommons.org/licenses/by-nc/4.0/',
    uriDe: 'https://creativecommons.org/licenses/by-nc/4.0/deed.de',
    uriEn: 'https://creativecommons.org/licenses/by-nc/4.0/deed.en',
    labelDe: 'Creative Commons - Namensnennung, Nicht-kommerziell (CC BY-NC 4.0)',
    labelEn: 'Creative Commons - Attribution, Non-Commercial (CC BY-NC 4.0)',
    fullName: 'Creative Commons - Attribution, Non-Commercial (BY-NC)',
    aliases: ['cc by-nc 4.0', 'cc by-nc', 'cc-by-nc', 'https://creativecommons.org/licenses/by-nc/4.0/', 'https://creativecommons.org/licenses/by-nc/4.0/deed.de', 'https://creativecommons.org/licenses/by-nc/4.0/deed.en', 'creative commons - attribution, non-commercial (by-nc)']
  },
  {
    code: 'CC BY-NC-SA 4.0',
    short: 'CC BY-NC-SA 4.0',
    canonicalUri: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    uriDe: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.de',
    uriEn: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en',
    labelDe: 'Creative Commons - Namensnennung, Nicht-kommerziell, ShareAlike (CC BY-NC-SA 4.0)',
    labelEn: 'Creative Commons - Attribution, Non-Commercial, ShareAlike (CC BY-NC-SA 4.0)',
    fullName: 'Creative Commons - Attribution, Non-Commercial, ShareAlike (BY-NC-SA)',
    aliases: ['cc by-nc-sa 4.0', 'cc by-nc-sa', 'cc-by-nc-sa', 'https://creativecommons.org/licenses/by-nc-sa/4.0/', 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.de', 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en', 'creative commons - attribution, non-commercial, sharealike (by-nc-sa)']
  },
  {
    code: 'CC BY-ND 4.0',
    short: 'CC BY-ND 4.0',
    canonicalUri: 'https://creativecommons.org/licenses/by-nd/4.0/',
    uriDe: 'https://creativecommons.org/licenses/by-nd/4.0/deed.de',
    uriEn: 'https://creativecommons.org/licenses/by-nd/4.0/deed.en',
    labelDe: 'Creative Commons - Namensnennung, Keine Bearbeitung (CC BY-ND 4.0)',
    labelEn: 'Creative Commons - Attribution, No Derivatives (CC BY-ND 4.0)',
    fullName: 'Creative Commons - Attribution, No Derivatives (BY-ND)',
    aliases: ['cc by-nd 4.0', 'cc by-nd', 'cc-by-nd', 'https://creativecommons.org/licenses/by-nd/4.0/', 'https://creativecommons.org/licenses/by-nd/4.0/deed.de', 'https://creativecommons.org/licenses/by-nd/4.0/deed.en', 'creative commons - attribution, no derivatives (by-nd)']
  },
  {
    code: 'CC BY-NC-ND 4.0',
    short: 'CC BY-NC-ND 4.0',
    canonicalUri: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
    uriDe: 'https://creativecommons.org/licenses/by-nc-nd/4.0/deed.de',
    uriEn: 'https://creativecommons.org/licenses/by-nc-nd/4.0/deed.en',
    labelDe: 'Creative Commons - Namensnennung, Nicht-kommerziell, Keine Bearbeitung (CC BY-NC-ND 4.0)',
    labelEn: 'Creative Commons - Attribution, Non-Commercial, No Derivatives (CC BY-NC-ND 4.0)',
    fullName: 'Creative Commons - Attribution, Non-Commercial, No Derivatives (BY-NC-ND)',
    aliases: ['cc by-nc-nd 4.0', 'cc by-nc-nd', 'cc-by-nc-nd', 'https://creativecommons.org/licenses/by-nc-nd/4.0/', 'https://creativecommons.org/licenses/by-nc-nd/4.0/deed.de', 'https://creativecommons.org/licenses/by-nc-nd/4.0/deed.en', 'creative commons - attribution, non-commercial, no derivatives (by-nc-nd)']
  }
];

export const resolveLicenceUri = (val, locale = 'de') => {
  if (!val) return '';
  const s = String(val).trim().toLowerCase();
  for (const lic of CC_LICENCES) {
    if (lic.aliases.some(alias => s === alias.toLowerCase() || s === alias.toLowerCase().replace(/\/$/, ''))) {
      return locale === 'en' ? lic.uriEn : lic.uriDe;
    }
  }
  return val;
};

export const getLicenceShortCode = (val) => {
  if (!val) return '';
  const s = String(val).trim().toLowerCase();
  for (const lic of CC_LICENCES) {
    if (lic.aliases.some(alias => s === alias.toLowerCase() || s === alias.toLowerCase().replace(/\/$/, ''))) {
      return lic.short;
    }
  }
  return val;
};

const defaultRights = {
  metadataRights: 'CC0 1.0 Universal',
  copyrightCreditLine: 'Staatliche Museen zu Berlin, Ägyptisches Museum und Papyrussammlung / BCDH Universität Bonn',
  accessRights: 'Open access',
  licence: 'https://creativecommons.org/licenses/by/4.0/deed.de',
  reproductionRights: 'Freie Nutzung für Wissenschaft und Forschung unter Nennung der Quelle'
};

const savedRights = (() => {
  try {
    const raw = localStorage.getItem('hermes_global_rights');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.licence) {
        parsed.licence = resolveLicenceUri(parsed.licence, 'de');
      }
      return { ...defaultRights, ...parsed };
    }
    return defaultRights;
  } catch (e) {
    return defaultRights;
  }
})();

export const globalRights = reactive({ ...savedRights });

export const saveGlobalRights = (rightsObj) => {
  Object.assign(globalRights, rightsObj);
  localStorage.setItem('hermes_global_rights', JSON.stringify(globalRights));
};

// 3. Date / Year Normalization Helper
// Allows natural inputs like: -500, 48, -7, 2025, -500-06, etc.
// Pads year to 4 digits: -0500, 0048, -0007, 2025, -0500-06
export const normalizeYearDate = (val) => {
  if (val === null || val === undefined) return val;
  const str = String(val).trim();
  if (!str) return str;
  // Match optional leading +/- sign, 1 or more digits for year, optional month/day (-MM or -MM-DD)
  const match = str.match(/^([+-]?)(\d+)((?:-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12]\d|3[01]))?)?)$/);
  if (!match) return str;
  const sign = match[1] === '+' ? '' : match[1]; // drop '+' if present, keep '-'
  const yearDigits = match[2];
  const rest = match[3] || '';
  const paddedYear = yearDigits.padStart(4, '0');
  return `${sign}${paddedYear}${rest}`;
};

// 4. Unified Saved Persons / Actors / Contacts Master Pool
const defaultPersons = [
  {
    id: 'https://orcid.org/0000-0002-1234-5678',
    name: 'Prof. Dr. Frank Müller',
    roles: 'Documentation / Author',
    role: 'Documentation',
    organization: 'Stiftung Preußischer Kulturbesitz, Staatliche Museen zu Berlin, Ägyptisches Museum und Papyrussammlung',
    email: 'f.mueller@smb.spk-berlin.de',
    type: 'person'
  },
  {
    id: 'https://d-nb.info/gnd/1029471181',
    name: 'Dr. Olivia Zorn',
    roles: 'Custodian / Curator',
    role: 'Custodian',
    organization: 'Stiftung Preußischer Kulturbesitz, Staatliche Museen zu Berlin, Ägyptisches Museum und Papyrussammlung',
    email: 'o.zorn@smb.spk-berlin.de',
    type: 'person'
  },
  {
    id: 'https://www.wikidata.org/wiki/Q153006',
    name: 'BCDH 3D Lab',
    roles: 'Digitisation / 3D Lab',
    role: 'Documentation',
    organization: 'Bonn Center for Digital Humanities, Universität Bonn',
    email: 'hector@bcdh.uni-bonn.de',
    type: 'organization'
  },
  {
    id: 'http://vocab.getty.edu/page/ulan/500305847',
    name: 'Staatliche Museen zu Berlin, Ägyptisches Museum und Papyrussammlung',
    roles: 'Custodian / Institution',
    role: 'Custodian',
    organization: 'Stiftung Preußischer Kulturbesitz',
    email: '',
    type: 'organization'
  },
  {
    id: 'https://d-nb.info/gnd/4000537-9',
    name: 'Unbekannter ägyptischer Kunsthandwerker / Werkstatt',
    roles: 'Creator',
    role: 'Creator',
    organization: 'Werkstatt / Collective',
    email: '',
    type: 'workshop'
  },
  {
    id: 'https://orcid.org/0000-0002-0000-0000',
    name: 'Dr. Michael Lang',
    roles: 'Documentation / Digitisation',
    role: 'Documentation',
    organization: 'Bonn Center for Digital Humanities, Universität Bonn',
    email: 'mlang@uni-bonn.de',
    type: 'person'
  }
];

const savedPersonsRaw = (() => {
  try {
    const raw = localStorage.getItem('hermes_saved_persons');
    if (raw) return JSON.parse(raw);

    // Merge existing actors / contacts if present from previous sessions
    const merged = [...defaultPersons];
    const actorsRaw = localStorage.getItem('hermes_saved_actors');
    if (actorsRaw) {
      const parsed = JSON.parse(actorsRaw);
      parsed.forEach(a => {
        if (a && a.name && !merged.some(p => p.name.trim().toLowerCase() === a.name.trim().toLowerCase())) {
          merged.push({
            id: a.id || '',
            name: a.name.trim(),
            roles: a.roles || '',
            role: a.roles || '',
            organization: '',
            email: '',
            type: 'person'
          });
        }
      });
    }

    const contactsRaw = localStorage.getItem('hermes_saved_contacts');
    if (contactsRaw) {
      const parsed = JSON.parse(contactsRaw);
      parsed.forEach(c => {
        if (c && c.name && !merged.some(p => p.name.trim().toLowerCase() === c.name.trim().toLowerCase())) {
          merged.push({
            id: '',
            name: c.name.trim(),
            roles: c.role || '',
            role: c.role || '',
            organization: c.organization || '',
            email: c.email || '',
            type: 'person'
          });
        }
      });
    }

    return merged;
  } catch (e) {
    return defaultPersons;
  }
})();

export const savedPersons = ref(savedPersonsRaw);

// Synced legacy refs for backward compatibility
export const savedActors = ref(
  savedPersons.value.map(p => ({
    id: p.id || '',
    name: p.name,
    roles: p.roles || p.role || ''
  }))
);

export const savedContacts = ref(
  savedPersons.value.map(p => ({
    name: p.name,
    role: p.role || p.roles || '',
    organization: p.organization || '',
    email: p.email || ''
  }))
);

const syncPersonsToStorage = () => {
  try {
    localStorage.setItem('hermes_saved_persons', JSON.stringify(savedPersons.value));
    
    // Update synced actors & contacts
    savedActors.value = savedPersons.value.map(p => ({
      id: p.id || '',
      name: p.name,
      roles: p.roles || p.role || ''
    }));
    savedContacts.value = savedPersons.value.map(p => ({
      name: p.name,
      role: p.role || p.roles || '',
      organization: p.organization || '',
      email: p.email || ''
    }));

    localStorage.setItem('hermes_saved_actors', JSON.stringify(savedActors.value));
    localStorage.setItem('hermes_saved_contacts', JSON.stringify(savedContacts.value));
  } catch (e) {
    console.error('Failed to sync persons to storage:', e);
  }
};

export const addOrUpdatePerson = (person) => {
  if (!person || !person.name) return;
  const nameTrimmed = String(person.name).trim();
  if (!nameTrimmed) return;
  const lowerName = nameTrimmed.toLowerCase();

  const idVal = person.id || person['actors.id'] || '';
  const rolesVal = person.roles || person['actors.roles'] || person.role || '';
  const roleVal = person.role || person.roles || person['actors.roles'] || '';
  const orgVal = person.organization || '';
  const emailVal = person.email || '';
  const phoneVal = person.phone || '';
  const addressVal = person.address || '';
  const typeVal = person.type || (rolesVal.toLowerCase().includes('institution') || rolesVal.toLowerCase().includes('museum') ? 'organization' : 'person');

  const existingIndex = savedPersons.value.findIndex(p => (p.name || '').trim().toLowerCase() === lowerName);

  if (existingIndex > -1) {
    const existing = savedPersons.value[existingIndex];
    savedPersons.value[existingIndex] = {
      ...existing,
      id: idVal || existing.id || '',
      roles: rolesVal || existing.roles || existing.role || '',
      role: roleVal || existing.role || existing.roles || '',
      organization: orgVal || existing.organization || '',
      email: emailVal || existing.email || '',
      phone: phoneVal || existing.phone || '',
      address: addressVal || existing.address || '',
      type: typeVal || existing.type || 'person'
    };
  } else {
    savedPersons.value.unshift({
      id: idVal,
      name: nameTrimmed,
      roles: rolesVal,
      role: roleVal,
      organization: orgVal,
      email: emailVal,
      phone: phoneVal,
      address: addressVal,
      type: typeVal
    });
  }
  syncPersonsToStorage();
};

export const removeSavedPerson = (index) => {
  savedPersons.value.splice(index, 1);
  syncPersonsToStorage();
};

export const updateSavedPerson = (index, person) => {
  if (!person || !person.name) return;
  savedPersons.value[index] = { ...savedPersons.value[index], ...person };
  syncPersonsToStorage();
};

export const addSavedActor = (actor) => {
  addOrUpdatePerson(actor);
};

export const addSavedContact = (contact) => {
  addOrUpdatePerson(contact);
};

// ────────────────────────────────────────────────────────────
// 5. API Credentials (GeoNames, Wikidata, Pleiades)
// ────────────────────────────────────────────────────────────
const defaultApiCredentials = {
  geonamesUsername: '',   // free account at geonames.org required
  wikidataLang: 'de',     // preferred language for Wikidata labels
};

const savedApiCredentialsRaw = (() => {
  try {
    const raw = localStorage.getItem('hermes_api_credentials');
    if (raw) return { ...defaultApiCredentials, ...JSON.parse(raw) };
    return defaultApiCredentials;
  } catch (e) {
    return defaultApiCredentials;
  }
})();

export const apiCredentials = reactive({ ...savedApiCredentialsRaw });

export const saveApiCredentials = (creds) => {
  Object.assign(apiCredentials, creds);
  localStorage.setItem('hermes_api_credentials', JSON.stringify(apiCredentials));
};

// ────────────────────────────────────────────────────────────
// 6. Global Collection Institution & Repository Location Sync
// ────────────────────────────────────────────────────────────
const savedCollectionInstitutionRaw = (() => {
  try {
    const raw = localStorage.getItem('hermes_collection_institution');
    if (raw) return JSON.parse(raw);
    return { name: '', gnd: '', uri: '', fullLabel: '' };
  } catch (e) {
    return { name: '', gnd: '', uri: '', fullLabel: '' };
  }
})();

export const collectionInstitution = reactive({ ...savedCollectionInstitutionRaw });

export const setCollectionInstitution = ({ name, gnd, uri } = {}) => {
  if (name !== undefined) collectionInstitution.name = String(name || '').trim();
  if (gnd !== undefined) collectionInstitution.gnd = String(gnd || '').trim();
  if (uri !== undefined) collectionInstitution.uri = String(uri || '').trim();

  if (collectionInstitution.name && collectionInstitution.gnd) {
    collectionInstitution.fullLabel = `${collectionInstitution.name} (GND: ${collectionInstitution.gnd})`;
  } else if (collectionInstitution.name) {
    collectionInstitution.fullLabel = collectionInstitution.name;
  } else if (collectionInstitution.gnd) {
    collectionInstitution.fullLabel = `GND: ${collectionInstitution.gnd}`;
  } else if (collectionInstitution.uri) {
    collectionInstitution.fullLabel = collectionInstitution.uri;
  } else {
    collectionInstitution.fullLabel = '';
  }

  try {
    localStorage.setItem('hermes_collection_institution', JSON.stringify(collectionInstitution));
  } catch (e) {
    console.error('Failed to save collection institution to localStorage', e);
  }
};
