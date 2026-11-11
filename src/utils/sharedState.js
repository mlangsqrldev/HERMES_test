import { reactive, ref, watch } from "vue";

// 1. Global Metadata Default Language ('de', 'en', 'fr', 'it', 'es')
const storedLang = localStorage.getItem("hermes_default_meta_lang") || "de";
export const defaultMetadataLanguage = ref(storedLang);

watch(defaultMetadataLanguage, (newVal) => {
  if (newVal) localStorage.setItem("hermes_default_meta_lang", newVal);
});

// 2. Global Rights & Licenses
export const CC_LICENCES = [
  {
    code: "CC BY 4.0",
    short: "CC BY 4.0",
    canonicalUri: "https://creativecommons.org/licenses/by/4.0/",
    uriDe: "https://creativecommons.org/licenses/by/4.0/deed.de",
    uriEn: "https://creativecommons.org/licenses/by/4.0/deed.en",
    labelDe: "Creative Commons - Namensnennung (CC BY 4.0)",
    labelEn: "Creative Commons - Attribution (CC BY 4.0)",
    fullName: "Creative Commons - Attribution (BY)",
    aliases: [
      "cc by 4.0",
      "cc by",
      "cc-by",
      "cc-by 4.0",
      "https://creativecommons.org/licenses/by/4.0/",
      "https://creativecommons.org/licenses/by/4.0/deed.de",
      "https://creativecommons.org/licenses/by/4.0/deed.en",
      "creative commons - attribution (by)",
    ],
  },
  {
    code: "CC BY-SA 4.0",
    short: "CC BY-SA 4.0",
    canonicalUri: "https://creativecommons.org/licenses/by-sa/4.0/",
    uriDe: "https://creativecommons.org/licenses/by-sa/4.0/deed.de",
    uriEn: "https://creativecommons.org/licenses/by-sa/4.0/deed.en",
    labelDe:
      "Creative Commons - Namensnennung, Weitergabe unter gleichen Bedingungen (CC BY-SA 4.0)",
    labelEn: "Creative Commons - Attribution, ShareAlike (CC BY-SA 4.0)",
    fullName: "Creative Commons - Attribution, ShareAlike (BY-SA)",
    aliases: [
      "cc by-sa 4.0",
      "cc by-sa",
      "cc-by-sa",
      "cc-by-sa 4.0",
      "https://creativecommons.org/licenses/by-sa/4.0/",
      "https://creativecommons.org/licenses/by-sa/4.0/deed.de",
      "https://creativecommons.org/licenses/by-sa/4.0/deed.en",
      "creative commons - attribution, sharealike (by-sa)",
    ],
  },
  {
    code: "CC0 1.0",
    short: "CC0 1.0",
    canonicalUri: "https://creativecommons.org/publicdomain/zero/1.0/",
    uriDe: "https://creativecommons.org/publicdomain/zero/1.0/deed.de",
    uriEn: "https://creativecommons.org/publicdomain/zero/1.0/deed.en",
    labelDe: "CC0 1.0 Universell (Public Domain / Gemeinfrei)",
    labelEn:
      "The Creative Commons CC0 1.0 Universal Public Domain Dedication (CC0)",
    fullName:
      "The Creative Commons CC0 1.0 Universal Public Domain Dedication (CC0)",
    aliases: [
      "cc0",
      "cc0 1.0",
      "cc0 1.0 universal",
      "cc0 1.0 universal (public domain)",
      "https://creativecommons.org/publicdomain/zero/1.0/",
      "https://creativecommons.org/publicdomain/zero/1.0/deed.de",
      "https://creativecommons.org/publicdomain/zero/1.0/deed.en",
      "the creative commons cc0 1.0 universal public domain dedication (cc0)",
    ],
  },
  {
    code: "CC BY-NC 4.0",
    short: "CC BY-NC 4.0",
    canonicalUri: "https://creativecommons.org/licenses/by-nc/4.0/",
    uriDe: "https://creativecommons.org/licenses/by-nc/4.0/deed.de",
    uriEn: "https://creativecommons.org/licenses/by-nc/4.0/deed.en",
    labelDe:
      "Creative Commons - Namensnennung, Nicht-kommerziell (CC BY-NC 4.0)",
    labelEn: "Creative Commons - Attribution, Non-Commercial (CC BY-NC 4.0)",
    fullName: "Creative Commons - Attribution, Non-Commercial (BY-NC)",
    aliases: [
      "cc by-nc 4.0",
      "cc by-nc",
      "cc-by-nc",
      "https://creativecommons.org/licenses/by-nc/4.0/",
      "https://creativecommons.org/licenses/by-nc/4.0/deed.de",
      "https://creativecommons.org/licenses/by-nc/4.0/deed.en",
      "creative commons - attribution, non-commercial (by-nc)",
    ],
  },
  {
    code: "CC BY-NC-SA 4.0",
    short: "CC BY-NC-SA 4.0",
    canonicalUri: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    uriDe: "https://creativecommons.org/licenses/by-nc-sa/4.0/deed.de",
    uriEn: "https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en",
    labelDe:
      "Creative Commons - Namensnennung, Nicht-kommerziell, ShareAlike (CC BY-NC-SA 4.0)",
    labelEn:
      "Creative Commons - Attribution, Non-Commercial, ShareAlike (CC BY-NC-SA 4.0)",
    fullName:
      "Creative Commons - Attribution, Non-Commercial, ShareAlike (BY-NC-SA)",
    aliases: [
      "cc by-nc-sa 4.0",
      "cc by-nc-sa",
      "cc-by-nc-sa",
      "https://creativecommons.org/licenses/by-nc-sa/4.0/",
      "https://creativecommons.org/licenses/by-nc-sa/4.0/deed.de",
      "https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en",
      "creative commons - attribution, non-commercial, sharealike (by-nc-sa)",
    ],
  },
  {
    code: "CC BY-ND 4.0",
    short: "CC BY-ND 4.0",
    canonicalUri: "https://creativecommons.org/licenses/by-nd/4.0/",
    uriDe: "https://creativecommons.org/licenses/by-nd/4.0/deed.de",
    uriEn: "https://creativecommons.org/licenses/by-nd/4.0/deed.en",
    labelDe:
      "Creative Commons - Namensnennung, Keine Bearbeitung (CC BY-ND 4.0)",
    labelEn: "Creative Commons - Attribution, No Derivatives (CC BY-ND 4.0)",
    fullName: "Creative Commons - Attribution, No Derivatives (BY-ND)",
    aliases: [
      "cc by-nd 4.0",
      "cc by-nd",
      "cc-by-nd",
      "https://creativecommons.org/licenses/by-nd/4.0/",
      "https://creativecommons.org/licenses/by-nd/4.0/deed.de",
      "https://creativecommons.org/licenses/by-nd/4.0/deed.en",
      "creative commons - attribution, no derivatives (by-nd)",
    ],
  },
  {
    code: "CC BY-NC-ND 4.0",
    short: "CC BY-NC-ND 4.0",
    canonicalUri: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    uriDe: "https://creativecommons.org/licenses/by-nc-nd/4.0/deed.de",
    uriEn: "https://creativecommons.org/licenses/by-nc-nd/4.0/deed.en",
    labelDe:
      "Creative Commons - Namensnennung, Nicht-kommerziell, Keine Bearbeitung (CC BY-NC-ND 4.0)",
    labelEn:
      "Creative Commons - Attribution, Non-Commercial, No Derivatives (CC BY-NC-ND 4.0)",
    fullName:
      "Creative Commons - Attribution, Non-Commercial, No Derivatives (BY-NC-ND)",
    aliases: [
      "cc by-nc-nd 4.0",
      "cc by-nc-nd",
      "cc-by-nc-nd",
      "https://creativecommons.org/licenses/by-nc-nd/4.0/",
      "https://creativecommons.org/licenses/by-nc-nd/4.0/deed.de",
      "https://creativecommons.org/licenses/by-nc-nd/4.0/deed.en",
      "creative commons - attribution, non-commercial, no derivatives (by-nc-nd)",
    ],
  },
];

/**
 * Resolves any licence input (code, alias, short name, or URL) into a canonical deed URI.
 *
 * @param {string} val - Licence code or URI.
 * @param {string} locale - Target locale ('de' or 'en').
 * @returns {string} Fully resolved Creative Commons deed URI.
 */
export const resolveLicenceUri = (val, locale = "de") => {
  if (!val) return "";
  const s = String(val).trim().toLowerCase();
  for (const lic of CC_LICENCES) {
    if (
      lic.aliases.some(
        (alias) =>
          s === alias.toLowerCase() ||
          s === alias.toLowerCase().replace(/\/$/, ""),
      )
    ) {
      return locale === "en" ? lic.uriEn : lic.uriDe;
    }
  }
  return val;
};

/**
 * Returns the standardized short code for a Creative Commons licence (e.g. 'CC BY 4.0').
 *
 * @param {string} val - Licence string or URI.
 * @returns {string} Standard short code.
 */
export const getLicenceShortCode = (val) => {
  if (!val) return "";
  const s = String(val).trim().toLowerCase();
  for (const lic of CC_LICENCES) {
    if (
      lic.aliases.some(
        (alias) =>
          s === alias.toLowerCase() ||
          s === alias.toLowerCase().replace(/\/$/, ""),
      )
    ) {
      return lic.short;
    }
  }
  return val;
};

const defaultRights = {
  // 1. CARARE / Europeana record metadata rights (standard: CC0)
  metadataRights: "",
  // 2. Physical Heritage Asset rights (Originalobjekt / Eigentum)
  haCopyrightCreditLine: "",
  haAccessRights: "",
  haReproductionRights: "",
  haLicence: "",
  // 3. Digital Resource rights (3D-Digitalisate / Medien / Scans)
  copyrightCreditLine: "",
  accessRights: "",
  licence: "",
  reproductionRights: "",
};

const savedRights = (() => {
  try {
    const raw = localStorage.getItem("hermes_global_rights");
    if (raw) {
      const parsed = JSON.parse(raw);
      // Clean legacy mock defaults so restart is truly blank
      if (
        parsed.copyrightCreditLine &&
        parsed.copyrightCreditLine.includes("Staatliche Museen zu Berlin")
      ) {
        localStorage.removeItem("hermes_global_rights");
        return { ...defaultRights };
      }
      if (parsed.licence) {
        parsed.licence = resolveLicenceUri(parsed.licence, "de");
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
  localStorage.setItem("hermes_global_rights", JSON.stringify(globalRights));
};

export const resetGlobalRights = () => {
  Object.assign(globalRights, {
    metadataRights: "",
    haCopyrightCreditLine: "",
    haAccessRights: "",
    haReproductionRights: "",
    haLicence: "",
    copyrightCreditLine: "",
    accessRights: "",
    licence: "",
    reproductionRights: "",
  });
  try {
    localStorage.removeItem("hermes_global_rights");
  } catch (e) {}
};

// 3. Date / Year Normalization Helper
// Allows natural inputs like: -500, 48, -7, 2025, -500-06, etc.
/**
 * Normalizes year and ISO date strings into 4-digit padded format.
 * Examples: -500 -> -0500, 48 -> 0048, 2025-5 -> 2025-05.
 *
 * @param {string|number|null} val - Date or year string.
 * @returns {string} Padded and normalized date string.
 */
export const normalizeYearDate = (val) => {
  if (val === null || val === undefined) return val;
  const str = String(val).trim();
  if (!str) return str;
  // Match optional leading +/- sign, 1 or more digits for year, optional month/day (-MM or -MM-DD)
  const match = str.match(
    /^([+-]?)(\d+)((?:-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12]\d|3[01]))?)?)$/,
  );
  if (!match) return str;
  const sign = match[1] === "+" ? "" : match[1]; // drop '+' if present, keep '-'
  const yearDigits = match[2];
  const rest = match[3] || "";
  const paddedYear = yearDigits.padStart(4, "0");
  return `${sign}${paddedYear}${rest}`;
};

/**
 * Validates whether a given year or ISO date string lies in the future.
 * Negative years (BCE / v. Chr.) are always treated as valid past events.
 * Positive CE dates are evaluated against current client system time.
 *
 * @param {string|number|null} val - Date or year string.
 * @returns {boolean} True if the date is strictly in the future.
 */
export const isFutureDate = (val) => {
  if (val === null || val === undefined) return false;
  const str = String(val).trim();
  if (!str) return false;
  // Negative years (BCE / v. Chr.) are in the past
  if (str.startsWith("-")) return false;

  const now = new Date();
  const curYear = now.getFullYear();
  const curMonth = now.getMonth() + 1;
  const curDay = now.getDate();

  // Matches YYYY, YYYY-MM, or YYYY-MM-DD (with optional leading +)
  const match = str.match(
    /^\+?(\d{1,4})(?:-(0[1-9]|1[0-2])(?:-(0[1-9]|[12]\d|3[01]))?)?$/,
  );
  if (!match) return false;

  const year = parseInt(match[1], 10);
  if (year > curYear) return true;
  if (year < curYear) return false;

  // Year is current year: check month if present
  if (!match[2]) return false;
  const month = parseInt(match[2], 10);
  if (month > curMonth) return true;
  if (month < curMonth) return false;

  // Month is current month: check day if present
  if (!match[3]) return false;
  const day = parseInt(match[3], 10);
  return day > curDay;
};

// 4. Unified Saved Persons / Actors / Contacts Master Pool (clean slate, no dummy data)
const defaultPersons = [];

const LEGACY_DUMMY_NAMES = [
  "frank müller",
  "frank mueller",
  "olivia zorn",
  "michael lang",
  "bcdh 3d lab",
  "unbekannter ägyptischer",
  "unbekannter aegyptischer",
  "staatliche museen zu berlin",
];

const filterOutDummies = (list) => {
  if (!Array.isArray(list)) return [];
  return list.filter((item) => {
    if (!item || !item.name) return false;
    const n = String(item.name).toLowerCase();
    return !LEGACY_DUMMY_NAMES.some((dummy) => n.includes(dummy));
  });
};

const savedPersonsRaw = (() => {
  try {
    const raw = localStorage.getItem("hermes_saved_persons");
    if (raw) {
      const parsed = JSON.parse(raw);
      const cleaned = filterOutDummies(parsed);
      if (cleaned.length !== parsed.length) {
        localStorage.setItem("hermes_saved_persons", JSON.stringify(cleaned));
      }
      return cleaned;
    }

    // Merge existing actors / contacts if present from previous sessions (excluding dummies)
    const merged = [];
    const actorsRaw = localStorage.getItem("hermes_saved_actors");
    if (actorsRaw) {
      const parsed = filterOutDummies(JSON.parse(actorsRaw));
      parsed.forEach((a) => {
        if (
          a &&
          a.name &&
          !merged.some(
            (p) => p.name.trim().toLowerCase() === a.name.trim().toLowerCase(),
          )
        ) {
          merged.push({
            id: a.id || "",
            name: a.name.trim(),
            roles: a.roles || "",
            role: a.roles || "",
            organization: "",
            email: "",
            type: "person",
          });
        }
      });
    }

    const contactsRaw = localStorage.getItem("hermes_saved_contacts");
    if (contactsRaw) {
      const parsed = filterOutDummies(JSON.parse(contactsRaw));
      parsed.forEach((c) => {
        if (
          c &&
          c.name &&
          !merged.some(
            (p) => p.name.trim().toLowerCase() === c.name.trim().toLowerCase(),
          )
        ) {
          merged.push({
            id: "",
            name: c.name.trim(),
            roles: c.role || "",
            role: c.role || "",
            organization: c.organization || "",
            email: c.email || "",
            type: "person",
          });
        }
      });
    }

    if (merged.length > 0) {
      localStorage.setItem("hermes_saved_persons", JSON.stringify(merged));
    }
    return merged;
  } catch (e) {
    return [];
  }
})();

export const savedPersons = ref(savedPersonsRaw);

// Synced legacy refs for backward compatibility
export const savedActors = ref(
  savedPersons.value.map((p) => ({
    id: p.id || "",
    name: p.name,
    roles: p.roles || p.role || "",
  })),
);

export const savedContacts = ref(
  savedPersons.value.map((p) => ({
    name: p.name,
    role: p.role || p.roles || "",
    organization: p.organization || "",
    email: p.email || "",
  })),
);

const syncPersonsToStorage = () => {
  try {
    localStorage.setItem(
      "hermes_saved_persons",
      JSON.stringify(savedPersons.value),
    );

    // Update synced actors & contacts
    savedActors.value = savedPersons.value.map((p) => ({
      id: p.id || "",
      name: p.name,
      roles: p.roles || p.role || "",
    }));
    savedContacts.value = savedPersons.value.map((p) => ({
      name: p.name,
      role: p.role || p.roles || "",
      organization: p.organization || "",
      email: p.email || "",
    }));

    localStorage.setItem(
      "hermes_saved_actors",
      JSON.stringify(savedActors.value),
    );
    localStorage.setItem(
      "hermes_saved_contacts",
      JSON.stringify(savedContacts.value),
    );
  } catch (e) {
    console.error("Failed to sync persons to storage:", e);
  }
};

export const addOrUpdatePerson = (person) => {
  if (!person || !person.name) return;
  const nameTrimmed = String(person.name).trim();
  if (!nameTrimmed) return;
  const lowerName = nameTrimmed.toLowerCase();

  const idVal = person.id || person["actors.id"] || "";
  const rolesVal = person.roles || person["actors.roles"] || person.role || "";
  const roleVal = person.role || person.roles || person["actors.roles"] || "";
  const orgVal = person.organization || "";
  const emailVal = person.email || "";
  const phoneVal = person.phone || "";
  const addressVal = person.address || "";
  const typeVal =
    person.type ||
    (rolesVal.toLowerCase().includes("institution") ||
    rolesVal.toLowerCase().includes("museum")
      ? "organization"
      : "person");

  const existingIndex = savedPersons.value.findIndex(
    (p) => (p.name || "").trim().toLowerCase() === lowerName,
  );

  if (existingIndex > -1) {
    const existing = savedPersons.value[existingIndex];
    savedPersons.value[existingIndex] = {
      ...existing,
      id: idVal || existing.id || "",
      roles: rolesVal || existing.roles || existing.role || "",
      role: roleVal || existing.role || existing.roles || "",
      organization: orgVal || existing.organization || "",
      email: emailVal || existing.email || "",
      phone: phoneVal || existing.phone || "",
      address: addressVal || existing.address || "",
      type: typeVal || existing.type || "person",
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
      type: typeVal,
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

export const clearAllPersons = () => {
  savedPersons.value = [];
  savedActors.value = [];
  savedContacts.value = [];
  try {
    localStorage.removeItem("hermes_saved_persons");
    localStorage.removeItem("hermes_saved_actors");
    localStorage.removeItem("hermes_saved_contacts");
  } catch (e) {
    console.error("Failed to clear storage:", e);
  }
};

// ────────────────────────────────────────────────────────────
// 4b. Reusable Spatial Coverage Pool (Locations & Coordinates)
// ────────────────────────────────────────────────────────────
export const DEFAULT_CURATED_SPATIAL = [
  {
    name: "Kerameikos (Athen)",
    namedLocation: "Kerameikos",
    historicalName: "Kerameikos",
    geopoliticalArea: "",
    x: "23.7176",
    y: "37.9785",
    uri: "https://pleiades.stoa.org/places/579979",
  },
  {
    name: "Akropolis (Athen)",
    namedLocation: "Akropolis",
    historicalName: "Akropolis",
    geopoliticalArea: "",
    x: "23.7257",
    y: "37.9715",
    uri: "https://pleiades.stoa.org/places/579888",
  },
  {
    name: "Pergamon",
    namedLocation: "Pergamon",
    historicalName: "Pergamon",
    geopoliticalArea: "",
    x: "27.1842",
    y: "39.1325",
    uri: "https://pleiades.stoa.org/places/550812",
  },
  {
    name: "Olympia",
    namedLocation: "Olympia (Heiligtum)",
    historicalName: "Olympia",
    geopoliticalArea: "",
    x: "21.6300",
    y: "37.6386",
    uri: "https://pleiades.stoa.org/places/570531",
  },
  {
    name: "Theben (Ägypten / Luxor)",
    namedLocation: "Theben / Luxor",
    historicalName: "Theben",
    geopoliticalArea: "",
    x: "32.6553",
    y: "25.7206",
    uri: "https://pleiades.stoa.org/places/786123",
  },
  {
    name: "Museumsinsel Berlin",
    namedLocation: "Museumsinsel Berlin",
    historicalName: "",
    geopoliticalArea: "Berlin, Deutschland",
    geopoliticalAreaType: "country",
    x: "13.3986",
    y: "52.5208",
    uri: "https://www.geonames.org/2950159",
  },
];

const savedSpatialRaw = (() => {
  try {
    const raw = localStorage.getItem("hermes_saved_spatial");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    return DEFAULT_CURATED_SPATIAL;
  } catch (e) {
    return DEFAULT_CURATED_SPATIAL;
  }
})();

export const savedSpatial = ref(savedSpatialRaw);

const syncSpatialToStorage = () => {
  try {
    localStorage.setItem(
      "hermes_saved_spatial",
      JSON.stringify(savedSpatial.value),
    );
  } catch (e) {
    console.error("Failed to sync spatial to storage:", e);
  }
};

export const COUNTRY_NAMES_DE = {
  DE: "Deutschland",
  GR: "Griechenland",
  TR: "Türkei",
  IT: "Italien",
  EG: "Ägypten",
  CY: "Zypern",
  FR: "Frankreich",
  GB: "Großbritannien",
  UK: "Großbritannien",
  ES: "Spanien",
  AT: "Österreich",
  CH: "Schweiz",
  NL: "Niederlande",
  BE: "Belgien",
  IL: "Israel",
  JO: "Jordanien",
  SY: "Syrien",
  LB: "Libanon",
  IQ: "Irak",
  IR: "Iran",
  TN: "Tunesien",
  DZ: "Algerien",
  MA: "Marokko",
  LY: "Libyen",
  US: "USA",
  USA: "USA",
};

export const formatGeopoliticalCountry = (country, countryCode = "") => {
  const code = (countryCode || "").trim().toUpperCase();
  if (code && COUNTRY_NAMES_DE[code]) return COUNTRY_NAMES_DE[code];
  const c = (country || "").trim();
  if (!c) return "";
  const upperC = c.toUpperCase();
  if (COUNTRY_NAMES_DE[upperC]) return COUNTRY_NAMES_DE[upperC];
  const lc = c.toLowerCase();
  if (lc === "germany") return "Deutschland";
  if (lc === "greece") return "Griechenland";
  if (lc === "turkey" || lc === "türkiye") return "Türkei";
  if (lc === "italy") return "Italien";
  if (lc === "egypt") return "Ägypten";
  if (lc === "france") return "Frankreich";
  if (lc === "united kingdom") return "Großbritannien";
  if (lc === "spain") return "Spanien";
  if (lc === "austria") return "Österreich";
  if (lc === "switzerland") return "Schweiz";
  if (lc === "cyprus") return "Zypern";
  return c;
};

export const resolveGeopoliticalArea = (query) => {
  if (!query || typeof query !== "string") return null;
  const q = query.trim();
  if (!q) return null;

  // Check saved spatial pool
  const pool = savedSpatial.value || [];
  const found = pool.find(
    (s) =>
      (s.name && s.name.toLowerCase() === q.toLowerCase()) ||
      (s.namedLocation && s.namedLocation.toLowerCase() === q.toLowerCase()),
  );
  if (found && found.geopoliticalArea) {
    return {
      geopoliticalArea: found.geopoliticalArea,
      geopoliticalAreaType: found.geopoliticalAreaType || "country",
    };
  }

  const lower = q.toLowerCase();
  if (
    lower.includes("berlin") ||
    lower.includes("bonn") ||
    lower.includes("münchen") ||
    lower.includes("mainz") ||
    lower.includes("hamburg") ||
    lower.includes("frankfurt") ||
    lower.includes("deutschland") ||
    lower.includes("germany")
  ) {
    return { geopoliticalArea: "Deutschland", geopoliticalAreaType: "country" };
  }
  if (
    lower.includes("athen") ||
    lower.includes("thessaloniki") ||
    lower.includes("kreta") ||
    lower.includes("griechenland") ||
    lower.includes("greece")
  ) {
    return {
      geopoliticalArea: "Griechenland",
      geopoliticalAreaType: "country",
    };
  }
  if (
    lower.includes("rom") ||
    lower.includes("rome") ||
    lower.includes("neapel") ||
    lower.includes("mailand") ||
    lower.includes("italien") ||
    lower.includes("italy")
  ) {
    return { geopoliticalArea: "Italien", geopoliticalAreaType: "country" };
  }
  if (
    lower.includes("paris") ||
    lower.includes("frankreich") ||
    lower.includes("france")
  ) {
    return { geopoliticalArea: "Frankreich", geopoliticalAreaType: "country" };
  }
  if (
    lower.includes("london") ||
    lower.includes("oxford") ||
    lower.includes("cambridge") ||
    lower.includes("großbritannien") ||
    lower.includes("united kingdom")
  ) {
    return {
      geopoliticalArea: "Großbritannien",
      geopoliticalAreaType: "country",
    };
  }
  if (
    lower.includes("istanbul") ||
    lower.includes("ankara") ||
    lower.includes("izmir") ||
    lower.includes("antalya") ||
    lower.includes("türkei") ||
    lower.includes("turkey")
  ) {
    return { geopoliticalArea: "Türkei", geopoliticalAreaType: "country" };
  }
  if (
    lower.includes("kairo") ||
    lower.includes("cairo") ||
    lower.includes("alexandria") ||
    lower.includes("ägypten") ||
    lower.includes("egypt")
  ) {
    return { geopoliticalArea: "Ägypten", geopoliticalAreaType: "country" };
  }
  if (
    lower.includes("wien") ||
    lower.includes("österreich") ||
    lower.includes("austria")
  ) {
    return { geopoliticalArea: "Österreich", geopoliticalAreaType: "country" };
  }
  if (
    lower.includes("zürich") ||
    lower.includes("bern") ||
    lower.includes("basel") ||
    lower.includes("schweiz") ||
    lower.includes("switzerland")
  ) {
    return { geopoliticalArea: "Schweiz", geopoliticalAreaType: "country" };
  }

  return null;
};

export const addOrUpdateSavedSpatial = (sp) => {
  if (!sp) return;
  const namedLoc = String(
    sp["locationSet.namedLocation"] || sp.namedLocation || sp.name || "",
  ).trim();
  const histName = String(
    sp["locationSet.historicalName"] || sp.historicalName || "",
  ).trim();
  const isHist = Boolean(
    histName ||
    (sp.uri && sp.uri.includes("pleiades")) ||
    (sp["geometry.quickpoint.uri"] &&
      sp["geometry.quickpoint.uri"].includes("pleiades")),
  );
  const geoArea = isHist
    ? ""
    : String(
        sp["locationSet.geopoliticalArea"] || sp.geopoliticalArea || "",
      ).trim();
  const x = String(sp["geometry.quickpoint.x"] ?? sp.x ?? "").trim();
  const y = String(sp["geometry.quickpoint.y"] ?? sp.y ?? "").trim();
  const uri = String(sp["geometry.quickpoint.uri"] || sp.uri || "").trim();

  if (!namedLoc && !histName && !geoArea) return;
  const displayName = histName || namedLoc || geoArea;
  const lowerName = displayName.toLowerCase();

  const existingIndex = savedSpatial.value.findIndex(
    (s) =>
      (s.name || s.historicalName || s.namedLocation || "")
        .trim()
        .toLowerCase() === lowerName,
  );

  const entry = {
    name: displayName,
    namedLocation: namedLoc || displayName,
    historicalName: histName,
    geopoliticalArea: geoArea,
    geopoliticalAreaType: isHist
      ? ""
      : sp.geopoliticalAreaType || (geoArea ? "country" : ""),
    x,
    y,
    uri,
  };

  if (existingIndex > -1) {
    savedSpatial.value[existingIndex] = {
      ...savedSpatial.value[existingIndex],
      ...entry,
    };
  } else {
    savedSpatial.value.unshift(entry);
  }
  syncSpatialToStorage();
};

export const removeSavedSpatial = (index) => {
  savedSpatial.value.splice(index, 1);
  syncSpatialToStorage();
};

// ────────────────────────────────────────────────────────────
// 5. API Credentials (GeoNames, Wikidata, Pleiades)
// ────────────────────────────────────────────────────────────
const defaultApiCredentials = {
  geonamesUsername: "", // free account at geonames.org required
  geonamesPassword: "", // optional password or token
  wikidataLang: "de", // preferred language for Wikidata labels
};

const savedApiCredentialsRaw = (() => {
  try {
    const raw = localStorage.getItem("hermes_api_credentials");
    if (raw) return { ...defaultApiCredentials, ...JSON.parse(raw) };
    return defaultApiCredentials;
  } catch (e) {
    return defaultApiCredentials;
  }
})();

export const apiCredentials = reactive({ ...savedApiCredentialsRaw });

export const saveApiCredentials = (creds) => {
  Object.assign(apiCredentials, creds);
  localStorage.setItem(
    "hermes_api_credentials",
    JSON.stringify(apiCredentials),
  );
};

export const isApiSettingsOpen = ref(false);
export const openApiSettings = () => {
  isApiSettingsOpen.value = true;
};
export const closeApiSettings = () => {
  isApiSettingsOpen.value = false;
};

// ────────────────────────────────────────────────────────────
// 6. Global Collection Institution & Repository Location Sync
// ────────────────────────────────────────────────────────────
const savedCollectionInstitutionRaw = (() => {
  try {
    const raw = localStorage.getItem("hermes_collection_institution");
    if (raw) return JSON.parse(raw);
    return { name: "", gnd: "", uri: "", fullLabel: "" };
  } catch (e) {
    return { name: "", gnd: "", uri: "", fullLabel: "" };
  }
})();

export const collectionInstitution = reactive({
  ...savedCollectionInstitutionRaw,
});

export const setCollectionInstitution = ({ name, gnd, uri } = {}) => {
  if (name !== undefined)
    collectionInstitution.name = String(name || "").trim();
  if (gnd !== undefined) collectionInstitution.gnd = String(gnd || "").trim();
  if (uri !== undefined) collectionInstitution.uri = String(uri || "").trim();

  if (collectionInstitution.name && collectionInstitution.gnd) {
    collectionInstitution.fullLabel = `${collectionInstitution.name} (GND: ${collectionInstitution.gnd})`;
  } else if (collectionInstitution.name) {
    collectionInstitution.fullLabel = collectionInstitution.name;
  } else if (collectionInstitution.gnd) {
    collectionInstitution.fullLabel = `GND: ${collectionInstitution.gnd}`;
  } else if (collectionInstitution.uri) {
    collectionInstitution.fullLabel = collectionInstitution.uri;
  } else {
    collectionInstitution.fullLabel = "";
  }

  try {
    localStorage.setItem(
      "hermes_collection_institution",
      JSON.stringify(collectionInstitution),
    );
  } catch (e) {
    console.error("Failed to save collection institution to localStorage", e);
  }
};

// ----------------------------------------------------
// Project Heritage Assets Registry (for DC Relations & Cross-linking)
// ----------------------------------------------------
export const projectHeritageAssets = ref([]);

export const updateProjectHeritageAssets = (list) => {
  if (!Array.isArray(list)) return;
  projectHeritageAssets.value = list
    .map((item) => {
      let name = "";
      if (
        Array.isArray(item["appellation.name"]) &&
        item["appellation.name"].length > 0
      ) {
        const pref = item["appellation.name"].find(
          (n) =>
            n &&
            (n["appellation.name#preferred"] === true || n.preferred === true),
        );
        name =
          pref?._value ||
          item["appellation.name"][0]?._value ||
          (typeof item["appellation.name"][0] === "string"
            ? item["appellation.name"][0]
            : "");
      } else if (typeof item["appellation.name"] === "string") {
        name = item["appellation.name"];
      }
      const id =
        item["recordInformation.id"] || item["appellation.id"] || item.id || "";
      const inv = item["repositoryLocation.inventoryNumber"] || "";
      const uri = item["repositoryLocation.uri"] || "";
      return { id, name, inv, uri };
    })
    .filter((h) => h.id || h.name || h.inv);
};

export const projectDigitalResources = ref([]);

export const updateProjectDigitalResources = (list) => {
  if (!Array.isArray(list)) return;
  projectDigitalResources.value = list
    .map((item) => {
      let name = "";
      if (
        Array.isArray(item["appellation.name"]) &&
        item["appellation.name"].length > 0
      ) {
        const pref = item["appellation.name"].find(
          (n) =>
            n &&
            (n["appellation.name#preferred"] === true || n.preferred === true),
        );
        name =
          pref?._value ||
          item["appellation.name"][0]?._value ||
          (typeof item["appellation.name"][0] === "string"
            ? item["appellation.name"][0]
            : "");
      } else if (typeof item["appellation.name"] === "string") {
        name = item["appellation.name"];
      }
      const id =
        item["recordInformation.id"] || item["appellation.id"] || item.id || "";
      return { id, name };
    })
    .filter((d) => d.id || d.name);
};

export const projectActivities = ref([]);

export const updateProjectActivities = (list) => {
  if (!Array.isArray(list)) return;
  projectActivities.value = list
    .map((item) => {
      let name = "";
      if (
        Array.isArray(item["appellation.name"]) &&
        item["appellation.name"].length > 0
      ) {
        const pref = item["appellation.name"].find(
          (n) =>
            n &&
            (n["appellation.name#preferred"] === true || n.preferred === true),
        );
        name =
          pref?._value ||
          item["appellation.name"][0]?._value ||
          (typeof item["appellation.name"][0] === "string"
            ? item["appellation.name"][0]
            : "");
      } else if (typeof item["appellation.name"] === "string") {
        name = item["appellation.name"];
      }
      const id =
        item["recordInformation.id"] || item["appellation.id"] || item.id || "";
      return { id, name };
    })
    .filter((a) => a.id || a.name);
};

// ────────────────────────────────────────────────────────────
// 7. Global Organizations & Institutions Pool (Organisations-Pool)
// ────────────────────────────────────────────────────────────
export const DEFAULT_CURATED_ORGANIZATIONS = [
  {
    id: "ORG-SMB-ANT",
    name: "Antikensammlung, Staatliche Museen zu Berlin",
    gnd: "5035657-4",
    uri: "https://d-nb.info/gnd/5035657-4",
    country: "DE",
    city: "Berlin",
    townOrCity: "Berlin",
    buildingName: "Altes Museum / Museumsinsel",
    roadName: "Bodestraße",
    numberInRoad: "1-3",
    postcodeOrZipcode: "10178",
    role: "Verwahrende Institution / Museum",
    type: "museum",
    organization: "Stiftung Preußischer Kulturbesitz (SPK)",
  },
  {
    id: "ORG-SPK",
    name: "Stiftung Preußischer Kulturbesitz (SPK)",
    gnd: "2022718-4",
    uri: "https://d-nb.info/gnd/2022718-4",
    country: "DE",
    city: "Berlin",
    townOrCity: "Berlin",
    buildingName: "Von-der-Heydt-Kulturforum",
    roadName: "Von-der-Heydt-Straße",
    numberInRoad: "16-18",
    postcodeOrZipcode: "10785",
    role: "Trägerorganisation / Rechteinhaberin",
    type: "foundation",
    organization: "Stiftung Preußischer Kulturbesitz",
  },
  {
    id: "ORG-BCDH-BONN",
    name: "Bonn Center for Digital Humanities (BCDH), Universität Bonn",
    gnd: "1219537158",
    uri: "https://d-nb.info/gnd/1219537158",
    country: "DE",
    city: "Bonn",
    townOrCity: "Bonn",
    buildingName: "Hauptgebäude / Informatik",
    roadName: "Rabinstraße",
    numberInRoad: "8",
    postcodeOrZipcode: "53111",
    role: "3D-Digitalisierung & Datenarchitektur",
    type: "university",
    organization: "Rheinische Friedrich-Wilhelms-Universität Bonn",
  },
  {
    id: "ORG-DAI",
    name: "Deutsches Archäologisches Institut (DAI)",
    gnd: "1009088-7",
    uri: "https://d-nb.info/gnd/1009088-7",
    country: "DE",
    city: "Berlin",
    townOrCity: "Berlin",
    buildingName: "Zentrale",
    roadName: "Podbielskiallee",
    numberInRoad: "69-71",
    postcodeOrZipcode: "14195",
    role: "Archäologische Forschung & Fachgazetteer",
    type: "research",
    organization: "Deutsches Archäologisches Institut",
  },
  {
    id: "ORG-SMB-AEMP",
    name: "Ägyptisches Museum und Papyrussammlung, Berlin",
    gnd: "5035658-6",
    uri: "https://d-nb.info/gnd/5035658-6",
    country: "DE",
    city: "Berlin",
    townOrCity: "Berlin",
    buildingName: "Neues Museum / Museumsinsel",
    roadName: "Bodestraße",
    numberInRoad: "1-3",
    postcodeOrZipcode: "10178",
    role: "Verwahrende Institution / Museum",
    type: "museum",
    organization: "Staatliche Museen zu Berlin",
  },
  {
    id: "ORG-LEIZA",
    name: "Leibniz-Zentrum für Archäologie (LEIZA)",
    gnd: "1280826955",
    uri: "https://d-nb.info/gnd/1280826955",
    country: "DE",
    city: "Mainz",
    townOrCity: "Mainz",
    buildingName: "LEIZA Neubau",
    roadName: "Ludwig-Lindenschmit-Forum",
    numberInRoad: "1",
    postcodeOrZipcode: "55116",
    role: "Restaurierung & Konservierung",
    type: "research",
    organization: "Leibniz-Gemeinschaft",
  },
  {
    id: "ORG-LOUVRE",
    name: "Musée du Louvre, Paris",
    gnd: "1006837-5",
    uri: "https://d-nb.info/gnd/1006837-5",
    country: "FR",
    city: "Paris",
    townOrCity: "Paris",
    buildingName: "Palais du Louvre",
    roadName: "Rue de Rivoli",
    numberInRoad: "75001",
    postcodeOrZipcode: "75001",
    role: "Verwahrende Institution / Nationalmuseum",
    type: "museum",
    organization: "République Française",
  },
  {
    id: "ORG-BRITISH-MUS",
    name: "The British Museum, London",
    gnd: "38352-1",
    uri: "https://d-nb.info/gnd/38352-1",
    country: "GB",
    city: "London",
    townOrCity: "London",
    buildingName: "British Museum",
    roadName: "Great Russell Street",
    numberInRoad: "WC1B 3DG",
    postcodeOrZipcode: "WC1B 3DG",
    role: "Verwahrende Institution / Nationalmuseum",
    type: "museum",
    organization: "Trustees of the British Museum",
  },
];

const savedOrganizationsRaw = (() => {
  try {
    const raw = localStorage.getItem("hermes_saved_organizations");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge in address fields if missing from previous version
        return parsed.map((p) => {
          const matchedCurated = DEFAULT_CURATED_ORGANIZATIONS.find(
            (c) => c.id === p.id || c.name === p.name,
          );
          return { ...(matchedCurated || {}), ...p };
        });
      }
    }
    localStorage.setItem(
      "hermes_saved_organizations",
      JSON.stringify(DEFAULT_CURATED_ORGANIZATIONS),
    );
    return [...DEFAULT_CURATED_ORGANIZATIONS];
  } catch (e) {
    return [...DEFAULT_CURATED_ORGANIZATIONS];
  }
})();

export const savedOrganizations = ref(savedOrganizationsRaw);

const recentOrganizationsRaw = (() => {
  try {
    const raw = localStorage.getItem("hermes_recent_organizations");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed.slice(0, 5);
    }
  } catch (e) {}
  // Default to first few saved organizations if none recorded yet
  return (savedOrganizationsRaw || []).slice(0, 5);
})();

export const recentOrganizations = ref(recentOrganizationsRaw);

export const recordRecentOrganization = (org) => {
  if (!org || !org.name) return;
  const nameTrimmed = String(org.name).trim();
  if (!nameTrimmed) return;
  const existingIdx = recentOrganizations.value.findIndex(
    (o) =>
      (o.name || "").trim().toLowerCase() === nameTrimmed.toLowerCase() ||
      (org.gnd && o.gnd && String(o.gnd).trim() === String(org.gnd).trim()),
  );
  if (existingIdx > -1) {
    const existing = recentOrganizations.value.splice(existingIdx, 1)[0];
    recentOrganizations.value.unshift({ ...existing, ...org });
  } else {
    recentOrganizations.value.unshift({ ...org, name: nameTrimmed });
  }
  if (recentOrganizations.value.length > 5) {
    recentOrganizations.value = recentOrganizations.value.slice(0, 5);
  }
  try {
    localStorage.setItem(
      "hermes_recent_organizations",
      JSON.stringify(recentOrganizations.value),
    );
  } catch (e) {}
};

const syncOrganizationsToStorage = () => {
  try {
    localStorage.setItem(
      "hermes_saved_organizations",
      JSON.stringify(savedOrganizations.value),
    );
  } catch (e) {
    console.error("Failed to sync organizations to storage:", e);
  }
};

export const addOrUpdateOrganization = (org) => {
  if (!org || !org.name) return;
  const nameTrimmed = String(org.name).trim();
  if (!nameTrimmed) return;
  const lowerName = nameTrimmed.toLowerCase();

  const existingIdx = savedOrganizations.value.findIndex(
    (o) =>
      (o.name || "").trim().toLowerCase() === lowerName ||
      (org.gnd && o.gnd && String(o.gnd).trim() === String(org.gnd).trim()),
  );

  const entry = {
    id: org.id || (org.gnd ? `ORG-GND-${org.gnd}` : `ORG-${Date.now()}`),
    name: nameTrimmed,
    gnd: org.gnd ? String(org.gnd).trim() : "",
    uri: org.uri || (org.gnd ? `https://d-nb.info/gnd/${org.gnd}` : ""),
    country: org.country || "DE",
    city: org.city || org.townOrCity || "",
    townOrCity: org.townOrCity || org.city || "",
    buildingName: org.buildingName || "",
    roadName: org.roadName || org.street || "",
    numberInRoad: org.numberInRoad || "",
    postcodeOrZipcode: org.postcodeOrZipcode || org.postcode || "",
    role: org.role || "Institution",
    type: org.type || "organization",
    organization: org.organization || "",
  };

  if (existingIdx > -1) {
    savedOrganizations.value[existingIdx] = {
      ...savedOrganizations.value[existingIdx],
      ...entry,
    };
  } else {
    savedOrganizations.value.unshift(entry);
  }
  syncOrganizationsToStorage();
};

export const removeSavedOrganization = (index) => {
  savedOrganizations.value.splice(index, 1);
  syncOrganizationsToStorage();
};

export const updateSavedOrganization = (index, org) => {
  if (!org || !org.name) return;
  savedOrganizations.value[index] = {
    ...savedOrganizations.value[index],
    ...org,
  };
  syncOrganizationsToStorage();
};

export const populateCarareAddressFromOrg = (
  targetObj,
  org,
  prefix = "address.",
) => {
  if (!targetObj || !org) return;
  if (org.buildingName) targetObj[`${prefix}buildingName`] = org.buildingName;
  if (org.roadName) targetObj[`${prefix}roadName`] = org.roadName;
  if (org.numberInRoad) targetObj[`${prefix}numberInRoad`] = org.numberInRoad;
  if (org.townOrCity || org.city)
    targetObj[`${prefix}townOrCity`] = org.townOrCity || org.city;
  if (org.postcodeOrZipcode)
    targetObj[`${prefix}postcodeOrZipcode`] = org.postcodeOrZipcode;
  if (org.country) targetObj[`${prefix}country`] = org.country;
};

export const clearAllOrganizations = () => {
  savedOrganizations.value = [];
  try {
    localStorage.removeItem("hermes_saved_organizations");
  } catch (e) {
    console.error("Failed to clear organizations:", e);
  }
};

// ────────────────────────────────────────────────────────────
// 8. Global Collections Pool (Sammlungs-Pool)
// ────────────────────────────────────────────────────────────
export const DEFAULT_CURATED_COLLECTIONS = [
  {
    id: "DE-MUS-814111_Antikensammlung_Skulpturen",
    title: "Antikensammlung Berlin — Skulpturen und Grabmonumente",
    titleEn:
      "Berlin Antiquities Collection — Sculptures and Funerary Monuments",
    source: "Antikensammlung, Staatliche Museen zu Berlin",
    sourceGnd: "5035657-4",
    statement:
      "Skulpturen, Grabmonumente und Votivreliefs der klassischen Antike aus dem Bestand der Antikensammlung Berlin.",
    keywords: [
      "Grabrelief",
      "Skulptur",
      "Marmor",
      "Spätklassik",
      "Hellenismus",
      "3D-Digitalisierung",
    ],
    rights: "CC BY-SA 4.0",
    coveragePeriod: "Spätklassik bis Hellenismus (-0330 bis -0030)",
  },
  {
    id: "DE-MUS-015418_Tairkap_Ensemble",
    title: "Grabensemble der Dame Tairkap (ÄM 3 – ÄM 6)",
    titleEn: "Funerary Ensemble of Lady Tairkap (ÄM 3 – ÄM 6)",
    source: "Ägyptisches Museum und Papyrussammlung, Berlin",
    sourceGnd: "5035658-6",
    statement:
      "Zentrale Bestandteile des thebanischen Grabensembles der Dame Tairkap (25./26. Dynastie, Spätzeit).",
    keywords: [
      "Sargensemble",
      "Holz",
      "Theben",
      "Spätzeit",
      "25. Dynastie",
      "3D-Digitalisierung",
    ],
    rights: "CC BY 4.0",
    coveragePeriod: "Spätzeit (746 - 525 v. Chr.)",
  },
  {
    id: "DE-IAA-9999999_Atlantis_Curated_Collection",
    title:
      "Schätze der ägäischen Tiefen: Das Pantheon der versunkenen Sphären von Thera-Atlantis",
    titleEn:
      "Treasures of the Aegean Deeps: The Pantheon of Sunken Spheres of Thera-Atlantis",
    source:
      "Institut für Archäo-Astronomie und Imaginäre Altertümer (IAA), Bonn",
    sourceGnd: "9999999-X",
    statement:
      "Archäologische Fundkomplexe spätbronzezeitlicher Himmelskunde und mechanischer Oreichalkos-Sphären.",
    keywords: [
      "Himmelsmechanismus",
      "Oreichalkos",
      "Archäoastronomie",
      "Späte Bronzezeit",
      "3D-Digitalisierung",
    ],
    rights: "CC BY-SA 4.0",
    coveragePeriod: "Spätbronzezeit (-1400 bis -1180)",
  },
];

const savedCollectionsRaw = (() => {
  try {
    const raw = localStorage.getItem("hermes_saved_collections");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    localStorage.setItem(
      "hermes_saved_collections",
      JSON.stringify(DEFAULT_CURATED_COLLECTIONS),
    );
    return [...DEFAULT_CURATED_COLLECTIONS];
  } catch (e) {
    return [...DEFAULT_CURATED_COLLECTIONS];
  }
})();

export const savedCollections = ref(savedCollectionsRaw);

const syncCollectionsToStorage = () => {
  try {
    localStorage.setItem(
      "hermes_saved_collections",
      JSON.stringify(savedCollections.value),
    );
  } catch (e) {
    console.error("Failed to sync collections to storage:", e);
  }
};

export const addOrUpdateCollection = (col) => {
  if (!col) return;
  const idTrimmed = String(col.id || "").trim();
  const titleVal = String(
    col.title ||
      (Array.isArray(col["title"]) ? col["title"][0]?._value : "") ||
      "",
  ).trim();
  if (!idTrimmed && !titleVal) return;

  const existingIdx = savedCollections.value.findIndex(
    (c) =>
      (idTrimmed && c.id === idTrimmed) ||
      (titleVal && c.title.toLowerCase() === titleVal.toLowerCase()),
  );

  const entry = {
    id: idTrimmed || `COL-${Date.now()}`,
    title: titleVal || idTrimmed,
    titleEn:
      col.titleEn ||
      (Array.isArray(col["title"]) && col["title"][1]?._value) ||
      "",
    source: col.source || "",
    sourceGnd: col.sourceGnd || "",
    statement: col.statement || "",
    keywords: Array.isArray(col.keywords)
      ? col.keywords
      : col.keywords
        ? [col.keywords]
        : [],
    rights: col.rights || col["rights.reproductionRights"] || "CC BY-SA 4.0",
    coveragePeriod:
      col.coveragePeriod || col["coverage.temporal.periodName"] || "",
  };

  if (existingIdx > -1) {
    savedCollections.value[existingIdx] = {
      ...savedCollections.value[existingIdx],
      ...entry,
    };
  } else {
    savedCollections.value.unshift(entry);
  }
  syncCollectionsToStorage();
};

export const removeSavedCollection = (index) => {
  savedCollections.value.splice(index, 1);
  syncCollectionsToStorage();
};

export const updateSavedCollection = (index, col) => {
  if (!col) return;
  savedCollections.value[index] = { ...savedCollections.value[index], ...col };
  syncCollectionsToStorage();
};

export const clearAllCollections = () => {
  savedCollections.value = [];
  try {
    localStorage.removeItem("hermes_saved_collections");
  } catch (e) {
    console.error("Failed to clear collections:", e);
  }
};

// ────────────────────────────────────────────────────────────
// 9. Master Campaign Presets & Smart Inheritance (Kampagnen-Klammer)
// ────────────────────────────────────────────────────────────
export const DEFAULT_CAMPAIGN_PRESET = {
  active: true,
  name: "3D-Digitalisierungskampagne Skulpturensaal 2026",
  source: "Antikensammlung, Staatliche Museen zu Berlin",
  sourceGnd: "5035657-4",
  country: "Deutschland",
  licence: "https://creativecommons.org/licenses/by/4.0/deed.de",
  copyrightCreditLine:
    "Antikensammlung, Staatliche Museen zu Berlin / BCDH Universität Bonn",
  accessRights: "Open access",
  metadataRights: "CC0 1.0 Universal",
  reproductionRights:
    "Freie Nutzung für Wissenschaft und Forschung unter Nennung der Quelle",
  activityId: "ACT-2026-DIGI-01",
  activityName: "3D-Streifenlicht-Scanning & Nahbereichsphotogrammetrie",
  eventType: "3D digitisation",
  eventMethod: "Streifenlicht-Scanning & Makro-Photogrammetrie",
  equipment: "Artec Leo 2026 Pro / Sony A7R V (polarisiertes Ringlicht)",
  software: "RealityCapture 1.4 / Blender 4.2 LTS / Substance 3D Designer",
  paradataNotes:
    "Streifenlicht-Scan mit 0.05 mm optischer Triangulation, Poisson Depth 14, 4K PBR Texturen (Albedo, Normal, Roughness), Delta-E < 1.2",
  actors: [
    {
      id: "ACT-OP-01",
      name: "Dr. Lukas Weber",
      roles: "3D-Messtechniker / Scan-Operator",
    },
    {
      id: "ACT-CUR-01",
      name: "Prof. Dr. Elena Vasiliou",
      roles: "Kuratorische Leitung",
    },
  ],
  contacts: [
    {
      name: "Dr. Lukas Weber",
      role: "Digitalisierungsbeauftragter",
      organization: "BCDH Universität Bonn",
      email: "weber@bcdh.uni-bonn.de",
    },
  ],
  defaultMaterials: ["Marmor"],
  defaultTemporal: {
    periodName: "Klassische Antike (-0480 bis -0323)",
    startDate: "-0480",
    endDate: "-0323",
  },
  repositoryLocation: "Antikensammlung Berlin, Hauptsaal Vitrine 12",
};

const savedCampaignRaw = (() => {
  try {
    const raw = localStorage.getItem("hermes_campaign_preset");
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_CAMPAIGN_PRESET, ...parsed };
    }
  } catch (e) {
    console.error("Failed to load campaign preset:", e);
  }
  return { ...DEFAULT_CAMPAIGN_PRESET };
})();

export const campaignPreset = reactive(savedCampaignRaw);

export const saveCampaignPreset = (newPreset) => {
  Object.assign(campaignPreset, newPreset);
  try {
    localStorage.setItem(
      "hermes_campaign_preset",
      JSON.stringify(campaignPreset),
    );
  } catch (e) {
    console.error("Failed to persist campaign preset:", e);
  }
};

export const resetCampaignPresetToDefault = () => {
  Object.assign(campaignPreset, DEFAULT_CAMPAIGN_PRESET);
  try {
    localStorage.setItem(
      "hermes_campaign_preset",
      JSON.stringify(campaignPreset),
    );
  } catch (e) {
    console.error("Failed to reset campaign preset:", e);
  }
};

// ────────────────────────────────────────────────────────────
// 10. Smart String Incrementer for Stamping / Cloning
// Handles: INV-2026-001 -> INV-2026-002, OBJ_9 -> OBJ_10,
// DE-MUS-01 -> DE-MUS-02, Fragment A -> Fragment B
// ────────────────────────────────────────────────────────────
export const incrementStringNumber = (str, fallbackSuffix = "_02") => {
  if (!str) return "";
  const s = String(str).trim();
  // 1. Match trailing number with optional prefix and suffix
  const numMatch = s.match(/^(.*?)(\d+)([^\d]*)$/);
  if (numMatch) {
    const prefix = numMatch[1];
    const numStr = numMatch[2];
    const suffix = numMatch[3];
    const nextVal = parseInt(numStr, 10) + 1;
    const padded = String(nextVal).padStart(numStr.length, "0");
    return `${prefix}${padded}${suffix}`;
  }
  // 2. Match single capital letter at end (e.g. "Fragment A" -> "Fragment B")
  const letterMatch = s.match(/^(.*?\s+)([A-Y])$/i);
  if (letterMatch) {
    const nextChar = String.fromCharCode(letterMatch[2].charCodeAt(0) + 1);
    return `${letterMatch[1]}${nextChar}`;
  }
  return `${s}${fallbackSuffix}`;
};

// ────────────────────────────────────────────────────────────
// 11. Smart Campaign Application Helper Functions
// ────────────────────────────────────────────────────────────
/**
 * Automatically propagates campaign presets (institution source, rights, actors, contacts, dating, materials)
 * onto a Heritage Asset record.
 *
 * @param {Object} asset - Target Heritage Asset form object.
 * @param {boolean} overwrite - Whether existing filled values should be replaced.
 * @returns {Object} Updated asset record.
 */
export const applyCampaignToHeritageAsset = (asset, overwrite = false) => {
  if (!asset || !campaignPreset) return asset;

  if (overwrite || !asset["recordInformation.source"]) {
    asset["recordInformation.source"] = campaignPreset.source || "";
  }
  if (overwrite || !asset["recordInformation.country"]) {
    asset["recordInformation.country"] =
      campaignPreset.country || "Deutschland";
  }
  if (overwrite || !asset["recordInformation.metadataRights"]) {
    asset["recordInformation.metadataRights"] =
      campaignPreset.metadataRights || "CC0 1.0 Universal";
  }
  if (overwrite || !asset["rights.licence"]) {
    asset["rights.licence"] = campaignPreset.licence || "";
  }
  if (overwrite || !asset["rights.copyrightCreditLine"]) {
    asset["rights.copyrightCreditLine"] =
      campaignPreset.copyrightCreditLine || "";
  }
  if (overwrite || !asset["rights.accessRights"]) {
    asset["rights.accessRights"] = campaignPreset.accessRights || "Open access";
  }
  if (overwrite || !asset["rights.reproductionRights"]) {
    asset["rights.reproductionRights"] =
      campaignPreset.reproductionRights || "";
  }
  if (overwrite || !asset["repositoryLocation"]) {
    asset["repositoryLocation"] = campaignPreset.repositoryLocation || "";
  }

  // Merge actors from campaign preset without duplicating existing ones
  if (
    Array.isArray(campaignPreset.actors) &&
    campaignPreset.actors.length > 0
  ) {
    if (!Array.isArray(asset["actors"])) asset["actors"] = [];
    campaignPreset.actors.forEach((ca) => {
      const exists = asset["actors"].some(
        (a) =>
          (a.name || "").trim().toLowerCase() ===
          (ca.name || "").trim().toLowerCase(),
      );
      if (!exists) {
        asset["actors"].push({
          id: ca.id || "",
          name: ca.name,
          roles: ca.roles || "",
        });
      }
    });
  }

  // Merge creation contacts from campaign preset without duplicating existing ones
  if (
    Array.isArray(campaignPreset.contacts) &&
    campaignPreset.contacts.length > 0
  ) {
    if (!Array.isArray(asset["recordInformation.creation.contacts"]))
      asset["recordInformation.creation.contacts"] = [];
    campaignPreset.contacts.forEach((cc) => {
      const exists = asset["recordInformation.creation.contacts"].some(
        (c) =>
          (c.name || "").trim().toLowerCase() ===
          (cc.name || "").trim().toLowerCase(),
      );
      if (!exists) {
        asset["recordInformation.creation.contacts"].push({
          name: cc.name,
          role: cc.role || cc.roles || "",
          organization: cc.organization || "",
          email: cc.email || "",
        });
      }
    });
  }

  // Populate default temporal dating classification if currently empty
  if (
    campaignPreset.defaultTemporal &&
    campaignPreset.defaultTemporal.periodName
  ) {
    if (
      !Array.isArray(asset["characters.temporal"]) ||
      asset["characters.temporal"].length === 0
    ) {
      asset["characters.temporal"] = [
        {
          "timeSpan.periodName": [
            {
              _value: campaignPreset.defaultTemporal.periodName,
              "timeSpan.periodName#lang": "de",
            },
          ],
          "timeSpan.startDate": campaignPreset.defaultTemporal.startDate || "",
          "timeSpan.endDate": campaignPreset.defaultTemporal.endDate || "",
        },
      ];
    }
  }

  // Populate default materials from controlled vocabulary if currently empty
  if (
    Array.isArray(campaignPreset.defaultMaterials) &&
    campaignPreset.defaultMaterials.length > 0
  ) {
    if (
      !Array.isArray(asset["characters.materials"]) ||
      asset["characters.materials"].length === 0
    ) {
      asset["characters.materials"] = campaignPreset.defaultMaterials.map(
        (m) => ({
          _value: m,
          "characters.materials#lang": "de",
        }),
      );
    }
  }

  return asset;
};

/**
 * Propagates campaign defaults (rights, source) onto a Digital Resource record.
 *
 * @param {Object} resource - Target Digital Resource form object.
 * @param {boolean} overwrite - Whether existing filled values should be replaced.
 * @returns {Object} Updated resource record.
 */
export const applyCampaignToDigitalResource = (resource, overwrite = false) => {
  if (!resource || !campaignPreset) return resource;
  if (overwrite || !resource["rights.licence"]) {
    resource["rights.licence"] = campaignPreset.licence || "";
  }
  if (overwrite || !resource["rights.copyrightCreditLine"]) {
    resource["rights.copyrightCreditLine"] =
      campaignPreset.copyrightCreditLine || "";
  }
  if (overwrite || !resource["rights.accessRights"]) {
    resource["rights.accessRights"] =
      campaignPreset.accessRights || "Open access";
  }
  if (overwrite || !resource["recordInformation.source"]) {
    resource["recordInformation.source"] = campaignPreset.source || "";
  }
  return resource;
};

/**
 * Propagates campaign metadata onto an Activity record.
 *
 * @param {Object} activity - Target Activity form object.
 * @param {boolean} overwrite - Whether existing filled values should be replaced.
 * @returns {Object} Updated activity record.
 */
export const applyCampaignToActivity = (activity, overwrite = false) => {
  if (!activity || !campaignPreset) return activity;
  if (overwrite || !activity["activityInformation.id"]) {
    activity["activityInformation.id"] = campaignPreset.activityId || "";
  }
  if (overwrite || !activity["activityInformation.activityName"]) {
    activity["activityInformation.activityName"] = [
      {
        _value: campaignPreset.activityName || "",
        "activityInformation.activityName#lang": "de",
      },
    ];
  }
  if (overwrite || !activity["activityInformation.activityType"]) {
    activity["activityInformation.activityType"] = [
      {
        _value: campaignPreset.eventType || "3D digitisation",
        "activityInformation.activityType#lang": "en",
      },
    ];
  }
  if (overwrite || !activity["activityInformation.description"]) {
    activity["activityInformation.description"] = [
      {
        _value: `Methode: ${campaignPreset.eventMethod || ""}. Geräte: ${campaignPreset.equipment || ""}. Software: ${campaignPreset.software || ""}. Paradaten: ${campaignPreset.paradataNotes || ""}`,
        "activityInformation.description#lang": "de",
      },
    ];
  }
  return activity;
};

// ============================================================================
// CURATED SOFTWARE POOL & EQUIPMENT / DEVICES POOL
// ============================================================================

export const DEFAULT_CURATED_SOFTWARE = [
  {
    id: "sw_1",
    name: "Agisoft Metashape Professional",
    version: "2.1",
    category: "Photogrammetrie & SfM",
    role: "SfM Alignment & Dense Cloud",
    description: "Photogrammetrische 3D-Rekonstruktion und dichte Punktwolken",
  },
  {
    id: "sw_2",
    name: "Blender",
    version: "4.2 LTS",
    category: "3D-Modellierung & Retopologie",
    role: "Mesh Decimation, Retopology & UV Unwrapping",
    description: "Open-Source 3D-Creation Suite",
  },
  {
    id: "sw_3",
    name: "Artec Studio",
    version: "19 Professional",
    category: "Streifenlicht-Scanning (SLS)",
    role: "Scan Registration & Sharp Mesh Fusion",
    description: "3D-Scanning und Post-Processing Suite",
  },
  {
    id: "sw_4",
    name: "RealityCapture",
    version: "1.4",
    category: "Photogrammetrie & Laserscan",
    role: "High-speed Photogrammetry & Laser Alignment",
    description: "All-in-One Photogrammetrie und LiDAR-Fusion",
  },
  {
    id: "sw_5",
    name: "MeshLab",
    version: "2023.12",
    category: "Mesh-Processing",
    role: "Poisson Surface Reconstruction & Repair",
    description: "Open-Source Werkzeug für 3D-Dreiecksnetze",
  },
  {
    id: "sw_6",
    name: "Adobe Substance 3D Painter",
    version: "10.0",
    category: "Textur & PBR",
    role: "PBR Material Authoring & Texture Painting",
    description: "Industriestandard für 3D-Texturierung",
  },
  {
    id: "sw_7",
    name: "Adobe Substance 3D Designer",
    version: "14.0",
    category: "Textur-Baking",
    role: "Normal, AO & Roughness Map Baking",
    description: "Parametrische Texturen und High-to-Low Poly Baking",
  },
  {
    id: "sw_8",
    name: "Adobe Photoshop Lightroom",
    version: "14.1",
    category: "Farbkalibrierung",
    role: "RAW Color Calibration (ColorChecker) & Delighting",
    description: "Digitale Bildverarbeitung und Weißabgleich",
  },
  {
    id: "sw_9",
    name: "CloudCompare",
    version: "2.13",
    category: "Punktwolken-Analyse",
    role: "Point Cloud Comparison & ICP Alignment",
    description: "3D-Punktwolken- und Netzvergleich",
  },
  {
    id: "sw_10",
    name: "Meshroom (AliceVision)",
    version: "2023.3",
    category: "Photogrammetrie & SfM",
    role: "Open-Source Photogrammetric Pipeline",
    description: "Open-Source SfM Pipeline basierend auf AliceVision",
  },
  {
    id: "sw_11",
    name: "Zeiss GOM Inspect",
    version: "2023",
    category: "Metrologie & Inspektion",
    role: "3D Metrology Inspection & Soll-Ist-Vergleich",
    description: "Optische 3D-Messtechnik und Bauteilprüfung",
  },
  {
    id: "sw_12",
    name: "Leica Cyclone FIELD 3D",
    version: "2024",
    category: "Laserscanning (TLS)",
    role: "Laser Scan In-Field Pre-Registration",
    description: "Terrestrische Laserscan-Erfassung",
  },
  {
    id: "sw_13",
    name: "FARO SCENE",
    version: "2024",
    category: "Laserscanning (TLS)",
    role: "Terrestrial Laser Scan Processing & Registration",
    description: "Laserscanner-Punktwolkenregistrierung",
  },
  {
    id: "sw_14",
    name: "Geomagic Wrap",
    version: "2021",
    category: "Surfacing & CAD",
    role: "Exact Surface Fitting & Non-Manifold Repair",
    description: "3D-Scandaten in exakte NURBS/CAD-Flächen überführen",
  },
  {
    id: "sw_15",
    name: "Instant Meshes",
    version: "1.0",
    category: "Retopologie",
    role: "Interactive Quad-Dominant Remeshing",
    description: "Schnelles, automatisiertes Quad-Remeshing",
  },
  {
    id: "sw_16",
    name: "Pixologic ZBrush",
    version: "2024",
    category: "Digitales Sculpting",
    role: "High-Poly Sculpting & Decimation Master",
    description: "Digitales Sculpting und Mikrotopographie",
  },
  {
    id: "sw_17",
    name: "QGIS",
    version: "3.34 LTR",
    category: "GIS & Georeferenzierung",
    role: "Spatial Georeferencing & Orthophoto Mapping",
    description: "Geoinformationssystem für Fundstellenkoordinaten",
  },
];

const savedSoftwareRaw = (() => {
  try {
    const raw = localStorage.getItem("hermes_saved_software");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return [...DEFAULT_CURATED_SOFTWARE];
})();

export const savedSoftware = ref(savedSoftwareRaw);

const syncSoftwareToStorage = () => {
  try {
    localStorage.setItem(
      "hermes_saved_software",
      JSON.stringify(savedSoftware.value),
    );
  } catch (e) {}
};

export const addOrUpdateSoftware = (sw) => {
  if (!sw || !sw.name) return;
  const lowerName = sw.name.trim().toLowerCase();
  const existingIdx = savedSoftware.value.findIndex(
    (s) => (s.name || "").trim().toLowerCase() === lowerName,
  );
  const entry = {
    id: sw.id || `sw_${Date.now()}`,
    name: sw.name.trim(),
    version: (sw.version || "").trim(),
    category: (sw.category || "").trim(),
    role: (sw.role || "").trim(),
    description: (sw.description || "").trim(),
  };
  if (existingIdx > -1) {
    savedSoftware.value[existingIdx] = {
      ...savedSoftware.value[existingIdx],
      ...entry,
    };
  } else {
    savedSoftware.value.unshift(entry);
  }
  syncSoftwareToStorage();
};

export const removeSavedSoftware = (index) => {
  savedSoftware.value.splice(index, 1);
  syncSoftwareToStorage();
};

export const updateSavedSoftware = (index, sw) => {
  if (!sw || !sw.name) return;
  savedSoftware.value[index] = { ...savedSoftware.value[index], ...sw };
  syncSoftwareToStorage();
};

export const resetSoftwareToDefaults = () => {
  savedSoftware.value = [...DEFAULT_CURATED_SOFTWARE];
  syncSoftwareToStorage();
};

export const clearAllSoftware = () => {
  savedSoftware.value = [];
  syncSoftwareToStorage();
};

// ----------------------------------------------------------------------------
// EQUIPMENT & DEVICES POOL (Hardware, Scanners, Cameras, Targets)
// ----------------------------------------------------------------------------

export const DEFAULT_CURATED_EQUIPMENT = [
  {
    id: "eq_1",
    name: "Artec Leo",
    type: "3D-Scanner (SLS / VCSEL)",
    specs: "0.1 mm 3D-Auflösung, 0.05 mm Punktgenauigkeit, kabellos",
    manufacturer: "Artec 3D",
  },
  {
    id: "eq_2",
    name: "Artec Space Spider",
    type: "3D-Scanner (SLS / Blaues LED)",
    specs: "0.05 mm Genauigkeit, 0.1 mm Auflösung für Mikrostrukturen",
    manufacturer: "Artec 3D",
  },
  {
    id: "eq_3",
    name: "Nikon Z8",
    type: "Spiegellose Vollformatkamera",
    specs: "45.7 MP Full-Frame CMOS, 14-Bit NEF RAW",
    manufacturer: "Nikon",
  },
  {
    id: "eq_4",
    name: "Nikkor Z 50mm f/1.8 S",
    type: "Objektiv",
    specs: "50mm Festbrennweite, verzeichnungsarm, Z-Mount",
    manufacturer: "Nikon",
  },
  {
    id: "eq_5",
    name: "Nikon D750",
    type: "Vollformat-DSLR",
    specs: "24.3 MP FX CMOS, 14-Bit NEF RAW",
    manufacturer: "Nikon",
  },
  {
    id: "eq_6",
    name: "AF-S NIKKOR 50mm f/1.8G",
    type: "Objektiv",
    specs: "50mm Festbrennweite, F-Mount",
    manufacturer: "Nikon",
  },
  {
    id: "eq_7",
    name: "Sony Alpha 7R V",
    type: "Spiegellose Vollformatkamera",
    specs: "61.0 MP Exmor R CMOS, BIONZ XR, Sensor-Shift",
    manufacturer: "Sony",
  },
  {
    id: "eq_8",
    name: "Sony FE 50mm f/1.2 GM",
    type: "Objektiv",
    specs: "50mm G-Master Festbrennweite, E-Mount",
    manufacturer: "Sony",
  },
  {
    id: "eq_9",
    name: "Sony Alpha 7 IV",
    type: "Spiegellose Vollformatkamera",
    specs: "33.0 MP Exmor R CMOS, E-Mount",
    manufacturer: "Sony",
  },
  {
    id: "eq_10",
    name: "Canon EOS R5",
    type: "Spiegellose Vollformatkamera",
    specs: "45.0 MP Full-Frame CMOS, RF-Mount",
    manufacturer: "Canon",
  },
  {
    id: "eq_11",
    name: "Canon RF 50mm f/1.2L USM",
    type: "Objektiv",
    specs: "50mm L-Serie Festbrennweite, RF-Mount",
    manufacturer: "Canon",
  },
  {
    id: "eq_12",
    name: "GOM ATOS Q",
    type: "3D-Scanner (SLS / Blue Light)",
    specs: "Industrieller Streifenlichtscanner, Blue Light Equalizer, VDI 2634",
    manufacturer: "Carl Zeiss / GOM",
  },
  {
    id: "eq_13",
    name: "Shining 3D EinScan Pro HD",
    type: "3D-Scanner (SLS)",
    specs: "Multifunktionaler Handheld-Scanner, 0.045 mm Genauigkeit",
    manufacturer: "Shining 3D",
  },
  {
    id: "eq_14",
    name: "Leica BLK360 G2",
    type: "Terrestrischer Laserscanner (TLS)",
    specs: "Kompakter Bildgebungslaser-Scanner, sphärische HDR-Kamera",
    manufacturer: "Leica Geosystems",
  },
  {
    id: "eq_15",
    name: "Leica RTC360",
    type: "Terrestrischer Laserscanner (TLS)",
    specs: "High-Speed 3D-Laserscanner, VIS-Technologie, 2 Mio. Pkt/Sek.",
    manufacturer: "Leica Geosystems",
  },
  {
    id: "eq_16",
    name: "FARO Focus Premium",
    type: "Terrestrischer Laserscanner (TLS)",
    specs: "Phasenvergleich-Laserscanner bis 350 m, Kalibrierzertifikat",
    manufacturer: "FARO Technologies",
  },
  {
    id: "eq_17",
    name: "Calibrite ColorChecker Passport Photo 2",
    type: "Farbkalibrier-Target",
    specs: "24-Patch Standardfarbfelder, 18% Neutralgrau, Weißabgleich",
    manufacturer: "Calibrite / X-Rite",
  },
  {
    id: "eq_18",
    name: "Invar-Maßstäbe (Calibrated Scale Bars)",
    type: "Längenmaßstab / Referenz",
    specs: "DKD-kalibrierte Invar-Maßstäbe (thermisch inert) per VDI/VDE 2634",
    manufacturer: "VDI/VDE zertifiziert",
  },
  {
    id: "eq_19",
    name: "Kaiser Nanodigital Kreuzpolarisations-Ringblitz",
    type: "Beleuchtung",
    specs: "Zirkulare Kreuzpolarisation zur reflexfreien Texturerfassung",
    manufacturer: "Kaiser Fototechnik",
  },
  {
    id: "eq_20",
    name: "Drehteller elektrisch (Turntable)",
    type: "Drehteller",
    specs:
      "Automatisierter 360-Grad Drehteller mit programmierbarem Schrittwinkel",
    manufacturer: "Studio Equipment",
  },
];

const savedEquipmentRaw = (() => {
  try {
    const raw = localStorage.getItem("hermes_saved_equipment");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return [...DEFAULT_CURATED_EQUIPMENT];
})();

export const savedEquipment = ref(savedEquipmentRaw);

const syncEquipmentToStorage = () => {
  try {
    localStorage.setItem(
      "hermes_saved_equipment",
      JSON.stringify(savedEquipment.value),
    );
  } catch (e) {}
};

export const addOrUpdateEquipment = (eq) => {
  if (!eq || !eq.name) return;
  const lowerName = eq.name.trim().toLowerCase();
  const existingIdx = savedEquipment.value.findIndex(
    (e) => (e.name || "").trim().toLowerCase() === lowerName,
  );
  const entry = {
    id: eq.id || `eq_${Date.now()}`,
    name: eq.name.trim(),
    type: (eq.type || "").trim(),
    specs: (eq.specs || "").trim(),
    manufacturer: (eq.manufacturer || "").trim(),
  };
  if (existingIdx > -1) {
    savedEquipment.value[existingIdx] = {
      ...savedEquipment.value[existingIdx],
      ...entry,
    };
  } else {
    savedEquipment.value.unshift(entry);
  }
  syncEquipmentToStorage();
};

export const removeSavedEquipment = (index) => {
  savedEquipment.value.splice(index, 1);
  syncEquipmentToStorage();
};

export const updateSavedEquipment = (index, eq) => {
  if (!eq || !eq.name) return;
  savedEquipment.value[index] = { ...savedEquipment.value[index], ...eq };
  syncEquipmentToStorage();
};

export const resetEquipmentToDefaults = () => {
  savedEquipment.value = [...DEFAULT_CURATED_EQUIPMENT];
  syncEquipmentToStorage();
};

export const clearAllEquipment = () => {
  savedEquipment.value = [];
  syncEquipmentToStorage();
};
