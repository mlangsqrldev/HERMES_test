/**
 * Universal CARARE XML Parser for HERMES.
 * Parses any CARARE 2.0.x compliant XML file (namespace-agnostic)
 * into HERMES component records (Collection, HeritageAsset, DigitalResource, Activity).
 * 
 * Capable of handling:
 * - Single records or multi-record wrappers (<carareWrap>, <carare>)
 * - Default namespaces, prefixed namespaces (carare:, car:, etc.), or un-namespaced XML
 * - Single-entity XML files (e.g. only HeritageAsset, only DigitalResource)
 * - Digital Authenticity Profile / Paradata (<consistsOf> for Capture & Representation)
 * - Vocabulary attributes (term, namespace, termUID, lang, xml:lang, preferred)
 */

export function parseCarareXml(xmlString) {
  if (!xmlString || typeof xmlString !== "string") {
    throw new Error("Empty or invalid XML content provided.");
  }

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "application/xml");

  const parseError = xmlDoc.querySelector("parsererror");
  if (parseError) {
    throw new Error("XML Syntaxfehler: " + parseError.textContent.slice(0, 300));
  }

  // Helper functions for namespace-agnostic DOM traversal
  const getLocal = (node) => {
    if (!node) return "";
    const name = node.localName || node.nodeName || "";
    return name.replace(/^.*:/, "").toLowerCase();
  };

  const getDirectChildren = (parent, tag) => {
    if (!parent || !parent.children) return [];
    const targetTag = tag.toLowerCase();
    return Array.from(parent.children).filter(c => getLocal(c) === targetTag);
  };

  const getDirectChild = (parent, tag) => {
    if (!parent || !parent.children) return null;
    const targetTag = tag.toLowerCase();
    return Array.from(parent.children).find(c => getLocal(c) === targetTag) || null;
  };

  const getText = (parent, tag) => {
    const el = tag ? getDirectChild(parent, tag) : parent;
    return el && el.textContent ? el.textContent.trim() : "";
  };

  const getAttr = (el, attrName) => {
    if (!el || !el.attributes) return "";
    const target = attrName.toLowerCase();
    for (let i = 0; i < el.attributes.length; i++) {
      const a = el.attributes[i];
      const name = (a.localName || a.name || "").replace(/^.*:/, "").toLowerCase();
      if (name === target) {
        return a.value;
      }
    }
    return "";
  };

  const getLang = (el, fallback = "de") => {
    return getAttr(el, "lang") || getAttr(el, "xml:lang") || fallback;
  };

  const getPreferred = (el) => {
    const val = getAttr(el, "preferred");
    return val === "true" || val === "1";
  };

  // Find all nodes matching localName anywhere within scope
  const findAllDescendants = (root, localName) => {
    const target = localName.toLowerCase();
    const matches = [];
    const walk = (node) => {
      if (node && node.nodeType === 1) {
        if (getLocal(node) === target) {
          matches.push(node);
        }
        for (let i = 0; i < node.children.length; i++) {
          walk(node.children[i]);
        }
      }
    };
    walk(root);
    return matches;
  };

  const result = {
    Collection: [],
    HeritageAsset: [],
    DigitalResource: [],
    Activity: [],
    summary: {
      collections: 0,
      assets: 0,
      resources: 0,
      activities: 0
    }
  };

  // ----------------------------------------------------
  // 1. COLLECTION INFORMATION
  // ----------------------------------------------------
  const colEls = findAllDescendants(xmlDoc, "collectionInformation");
  for (const col of colEls) {
    const parentCarare = col.closest ? col.closest("carare") : col.parentElement;
    const colId = getText(col, "id") || getAttr(col, "id") || (parentCarare ? getAttr(parentCarare, "id") : "") || "Collection_1";

    // Deduplicate identical collection blocks (common in carareWrap repeating collection for each asset)
    if (result.Collection.some(c => c.id && c.id === colId)) {
      continue;
    }

    const colRecord = {
      id: colId,
      title: getDirectChildren(col, "title").map(t => ({
        _value: t.textContent.trim(),
        "title#lang": getLang(t, "de"),
        "title#preferred": getPreferred(t)
      })),
      source: getText(col, "source"),
      "source#lang": getLang(getDirectChild(col, "source"), "de"),
      statement: getText(col, "statement"),
      "statement#lang": getLang(getDirectChild(col, "statement"), "de"),
      "statement#preferred": getPreferred(getDirectChild(col, "statement")),
      keywords: getDirectChildren(col, "keywords").map(k => k.textContent.trim()),
      "keywords#lang": getLang(getDirectChild(col, "keywords"), "de"),
      "keywords#namespace": getAttr(getDirectChild(col, "keywords"), "namespace"),
      language: getDirectChildren(col, "language").map(l => l.textContent.trim()),
      "creation.createdOn": getText(getDirectChild(col, "creation"), "createdOn") || "",
      "creation.query": getText(getDirectChild(col, "creation"), "query") || "",
      contacts: getDirectChildren(col, "contacts").map(c => {
        const addr = getDirectChild(c, "address");
        return {
          name: getText(c, "name"),
          role: getText(c, "role"),
          organization: getText(c, "organization"),
          email: getText(c, "email"),
          phone: getText(c, "phone"),
          fax: getText(c, "fax"),
          "address.buildingName": getText(addr, "buildingName"),
          "address.numberInRoad": getText(addr, "numberInRoad"),
          "address.roadName": getText(addr, "roadName"),
          "address.townOrCity": getText(addr, "townOrCity"),
          "address.county": getText(addr, "county"),
          "address.postcodeOrZipcode": getText(addr, "postcode") || getText(addr, "postcodeOrZipcode"),
          "address.country": getText(addr, "country") || "DE"
        };
      })
    };

    // Ensure title has at least one entry if missing
    if (colRecord.title.length === 0 && colRecord.id) {
      colRecord.title.push({ _value: colRecord.id, "title#lang": "de", "title#preferred": true });
    }

    const rightsEl = getDirectChild(col, "rights");
    if (rightsEl) {
      colRecord["rights.copyrightCreditLine"] = getText(rightsEl, "copyrightCreditLine");
      colRecord["rights.copyrightCreditLine#lang"] = getLang(getDirectChild(rightsEl, "copyrightCreditLine"), "de");
      colRecord["rights.accessRights"] = getText(rightsEl, "accessRights");
      colRecord["rights.accessRights#lang"] = getLang(getDirectChild(rightsEl, "accessRights"), "en");
      colRecord["rights.reproductionRights"] = getText(rightsEl, "reproductionRights");
      colRecord["rights.reproductionRights#lang"] = getLang(getDirectChild(rightsEl, "reproductionRights"), "en");
      colRecord["rights.licence"] = getText(rightsEl, "licence");
      colRecord["rights.licence#lang"] = getLang(getDirectChild(rightsEl, "licence"), "en");
      colRecord["rights.europeanaRights"] = getText(rightsEl, "europeanaRights");
    }

    const covEl = getDirectChild(col, "coverage");
    if (covEl) {
      const tempEl = getDirectChild(covEl, "temporal");
      if (tempEl) {
        const tsEl = getDirectChild(tempEl, "timeSpan");
        if (tsEl) {
          colRecord["coverage.temporal.timeSpan.startDate"] = getText(tsEl, "startDate");
          colRecord["coverage.temporal.timeSpan.endDate"] = getText(tsEl, "endDate");
          colRecord["coverage.temporal.timeSpan.dateRangeQualifier"] = getText(tsEl, "dateRangeQualifier");
        }
        colRecord["coverage.temporal.periodName"] = getText(tempEl, "periodName");
        colRecord["coverage.temporal.periodName#lang"] = getLang(getDirectChild(tempEl, "periodName"), "de");
        colRecord["coverage.temporal.periodName#preferred"] = getPreferred(getDirectChild(tempEl, "periodName"));
        colRecord["coverage.temporal.displayDate"] = getText(tempEl, "displayDate");
        colRecord["coverage.temporal.scientificDate"] = getText(tempEl, "scientificDate");
        colRecord["coverage.temporal.scientificDateMethod"] = getText(tempEl, "scientificDateMethod");
      }
      const spatEl = getDirectChild(covEl, "spatial");
      if (spatEl) {
        const locSet = getDirectChild(spatEl, "locationSet");
        if (locSet) {
          colRecord["coverage.spatial.locationSet.namedLocation"] = getDirectChildren(locSet, "namedLocation").map(n => n.textContent.trim());
          colRecord["coverage.spatial.locationSet.geopoliticalArea"] = getText(locSet, "geopoliticalArea");
          colRecord["coverage.spatial.locationSet.geopoliticalArea#lang"] = getLang(getDirectChild(locSet, "geopoliticalArea"), "de");
          colRecord["coverage.spatial.locationSet.geopoliticalAreaType"] = getText(locSet, "geopoliticalAreaType");
          colRecord["coverage.spatial.locationSet.cadastralReference"] = getText(locSet, "cadastralReference");
        }
      }
    }

    result.Collection.push(colRecord);
  }

  // ----------------------------------------------------
  // 2. HERITAGE ASSET IDENTIFICATION
  // ----------------------------------------------------
  const haEls = findAllDescendants(xmlDoc, "heritageAssetIdentification");
  for (const ha of haEls) {
    const recInfo = getDirectChild(ha, "recordInformation");
    const appEl = getDirectChild(ha, "appellation");
    const charEl = getDirectChild(ha, "characters");
    const rightsEl = getDirectChild(ha, "rights");
    const condEl = getDirectChild(ha, "conditions");
    const parentCarare = ha.closest ? ha.closest("carare") : ha.parentElement;

    // Helper to search tag in <characters> or directly under <heritageAssetIdentification>
    const fromCharOrDirect = (tag) => {
      const fromChar = charEl ? getDirectChildren(charEl, tag) : [];
      if (fromChar.length > 0) return fromChar;
      return getDirectChildren(ha, tag);
    };

    const assetId = recInfo ? getText(recInfo, "id") : (getText(ha, "id") || getAttr(ha, "id") || getText(appEl, "id") || (parentCarare ? getAttr(parentCarare, "id") : "") || "Asset_1");

    // Deduplicate identical asset blocks
    if (result.HeritageAsset.some(existing => existing["recordInformation.id"] === assetId || existing["appellation.id"] === assetId)) {
      continue;
    }

    // Appellation Names
    let names = appEl ? getDirectChildren(appEl, "name").map(n => ({
      _value: n.textContent.trim(),
      "appellation.name#lang": getLang(n, "de"),
      "appellation.name#preferred": getPreferred(n)
    })) : [];

    if (names.length === 0) {
      const directNames = getDirectChildren(ha, "name").concat(getDirectChildren(ha, "title"));
      if (directNames.length > 0) {
        names = directNames.map(n => ({
          _value: n.textContent.trim(),
          "appellation.name#lang": getLang(n, "de"),
          "appellation.name#preferred": getPreferred(n)
        }));
      } else {
        names = [{ _value: assetId, "appellation.name#lang": "de", "appellation.name#preferred": true }];
      }
    }

    const haRecord = {
      "recordInformation.id": assetId,
      "recordInformation.source": recInfo ? getText(recInfo, "source") : "",
      "recordInformation.source#lang": recInfo ? getLang(getDirectChild(recInfo, "source"), "de") : "de",
      "recordInformation.country": recInfo ? getText(recInfo, "country") : "DE",
      "recordInformation.country#lang": recInfo ? getLang(getDirectChild(recInfo, "country"), "de") : "de",
      "recordInformation.creation.date": recInfo ? getText(getDirectChild(recInfo, "creation"), "date") : "",
      "recordInformation.language": recInfo ? getDirectChildren(recInfo, "language").map(l => l.textContent.trim()) : ["de"],
      "recordInformation.metadataRights": recInfo ? getText(recInfo, "metadataRights") : "",

      "appellation.id": appEl ? getText(appEl, "id") : assetId,
      "appellation.name": names,

      description: getText(ha, "description"),
      "description#lang": getLang(getDirectChild(ha, "description"), "de"),
      generalType: getText(ha, "generalType") || "physical object",

      actors: getDirectChildren(ha, "actors").map(a => {
        const actorName = getText(a, "name") || getText(a, "actor");
        const actorId = getText(a, "id") || getText(a, "actorUID");
        const actorRole = getText(a, "roles") || getText(a, "role");
        return {
          actor: actorName,
          actorUID: actorId,
          role: actorRole,
          name: actorName,
          id: actorId,
          roles: actorRole
        };
      }),

      "conditions.condition": condEl ? getText(condEl, "condition") : "",
      "conditions.condition#lang": condEl ? getLang(getDirectChild(condEl, "condition"), "de") : "de",
      "conditions.conditionAssessment": condEl ? getText(condEl, "conditionAssessment") : "",
      "conditions.conditionDate": condEl ? getText(condEl, "conditionDate") : "",
      "conditions.wasPresentAt": condEl ? getText(condEl, "wasPresentAt") : "",

      provenance: getText(ha, "provenance"),
      "provenance#lang": getLang(getDirectChild(ha, "provenance"), "de"),
      repositoryLocation: getText(ha, "repositoryLocation"),
      "repositoryLocation#lang": getLang(getDirectChild(ha, "repositoryLocation"), "de"),

      "characters.heritageAssetType": fromCharOrDirect("heritageAssetType").map(hat => ({
        _value: hat.textContent.trim(),
        "#term": getAttr(hat, "term") || hat.textContent.trim(),
        "#lang": getLang(hat, "de"),
        "#namespace": getAttr(hat, "namespace"),
        "#termUID": getAttr(hat, "termUID")
      })),

      "characters.materials": fromCharOrDirect("materials").map(m => ({
        _value: m.textContent.trim(),
        "#lang": getLang(m, "de"),
        "#term": getAttr(m, "term") || m.textContent.trim(),
        "#namespace": getAttr(m, "namespace"),
        "#termUID": getAttr(m, "termUID")
      })),

      "characters.inscriptions": fromCharOrDirect("inscriptions").map(i => ({
        _value: i.textContent.trim(),
        "#lang": getLang(i, "de"),
        "#type": getAttr(i, "type"),
        "#namespace": getAttr(i, "namespace"),
        "#preferred": getPreferred(i)
      })),

      "characters.dimensions": fromCharOrDirect("dimensions").map(d => ({
        extent: getText(d, "extent"),
        measurementType: getText(d, "measurementType"),
        units: getText(d, "units"),
        scale: getText(d, "scale"),
        value: parseFloat(getText(d, "value")) || getText(d, "value")
      })),

      "characters.temporal": fromCharOrDirect("temporal").map(t => {
        const ts = getDirectChild(t, "timeSpan");
        return {
          "timeSpan.startDate": ts ? getText(ts, "startDate") : "",
          "timeSpan.endDate": ts ? getText(ts, "endDate") : "",
          "timeSpan.dateRangeQualifier": ts ? getText(ts, "dateRangeQualifier") : "",
          periodName: getText(t, "periodName"),
          displayDate: getText(t, "displayDate") || getText(t, "periodName")
        };
      }),

      spatial: getDirectChildren(ha, "spatial").map(s => {
        const ls = getDirectChild(s, "locationSet");
        const geom = getDirectChild(s, "geometry");
        const qp = geom ? (getDirectChild(geom, "quickpoint") || getDirectChild(geom, "point")) : null;
        let qpX = qp ? getText(qp, "x") : "";
        let qpY = qp ? getText(qp, "y") : "";
        if (!qpX && geom) {
          const coords = getDirectChild(geom, "coordinates");
          if (coords) {
            qpX = getText(coords, "x") || getText(coords, "longitude");
            qpY = getText(coords, "y") || getText(coords, "latitude");
          }
        }

        return {
          "locationSet.namedLocation": ls ? getText(ls, "namedLocation") : "",
          "locationSet.namedLocation#lang": ls ? getLang(getDirectChild(ls, "namedLocation"), "de") : "de",
          "locationSet.namedLocation#preferred": ls ? getPreferred(getDirectChild(ls, "namedLocation")) : true,
          "locationSet.namedLocation#namespace": ls ? getAttr(getDirectChild(ls, "namedLocation"), "namespace") : "",
          "locationSet.namedLocation#term": ls ? getAttr(getDirectChild(ls, "namedLocation"), "term") : "",
          "locationSet.namedLocation#termUID": ls ? getAttr(getDirectChild(ls, "namedLocation"), "termUID") : "",
          "locationSet.geopoliticalArea": ls ? getText(ls, "geopoliticalArea") : "",
          "locationSet.geopoliticalArea#lang": ls ? getLang(getDirectChild(ls, "geopoliticalArea"), "de") : "de",
          "locationSet.geopoliticalAreaType": ls ? getText(ls, "geopoliticalAreaType") : "",
          "locationSet.historicalName": ls ? getDirectChildren(ls, "historicalName").map(hn => ({
            _value: hn.textContent.trim(),
            "historicalName#lang": getLang(hn, "de"),
            "historicalName#preferred": getPreferred(hn)
          })) : [],
          "geometry.quickpoint.x": qpX,
          "geometry.quickpoint.y": qpY
        };
      }),

      references: getDirectChildren(ha, "references").map(r => {
        const app = getDirectChild(r, "appellation");
        return {
          "appellation.name": app ? getText(app, "name") : getText(r, "name"),
          "appellation.name#lang": app ? getLang(getDirectChild(app, "name"), "de") : "de",
          "appellation.id": app ? getText(app, "id") : "",
          link: getText(r, "link") || getText(r, "url"),
          type: getText(r, "type"),
          rights: getText(r, "rights")
        };
      }),

      hasRepresentation: getDirectChildren(ha, "hasRepresentation").map(hr => hr.textContent.trim()),
      isSuccessorOf: getDirectChildren(ha, "isSuccessorOf").map(x => x.textContent.trim()),
      wasPresentAt: getDirectChildren(ha, "wasPresentAt").map(x => x.textContent.trim()),
      hasPart: getDirectChildren(ha, "hasPart").map(x => x.textContent.trim()),
      isPartOf: getDirectChildren(ha, "isPartOf").map(x => x.textContent.trim()),
      isReplicaOf: getDirectChildren(ha, "isReplicaOf").map(x => x.textContent.trim()),
      wasDigitizedBy: getDirectChildren(ha, "wasDigitizedBy").map(x => x.textContent.trim()),
      dcRelation: getDirectChildren(ha, "dcRelation").map(x => x.textContent.trim())
    };

    if (rightsEl) {
      haRecord["rights.copyrightCreditLine"] = getText(rightsEl, "copyrightCreditLine");
      haRecord["rights.copyrightCreditLine#lang"] = getLang(getDirectChild(rightsEl, "copyrightCreditLine"), "de");
      haRecord["rights.accessRights"] = getText(rightsEl, "accessRights");
      haRecord["rights.accessRights#lang"] = getLang(getDirectChild(rightsEl, "accessRights"), "en");
      haRecord["rights.reproductionRights"] = getText(rightsEl, "reproductionRights");
      haRecord["rights.reproductionRights#lang"] = getLang(getDirectChild(rightsEl, "reproductionRights"), "en");
      haRecord["rights.licence"] = getText(rightsEl, "licence");
      haRecord["rights.licence#lang"] = getLang(getDirectChild(rightsEl, "licence"), "en");
    }

    result.HeritageAsset.push(haRecord);
  }

  // ----------------------------------------------------
  // 3. DIGITAL RESOURCE
  // ----------------------------------------------------
  const drEls = findAllDescendants(xmlDoc, "digitalResource");
  for (const dr of drEls) {
    const recInfo = getDirectChild(dr, "recordInformation");
    const appEl = getDirectChild(dr, "appellation");
    const rightsEl = getDirectChild(dr, "rights");
    const parentCarare = dr.closest ? dr.closest("carare") : dr.parentElement;

    const resourceId = recInfo ? getText(recInfo, "id") : (getText(dr, "id") || getAttr(dr, "id") || getText(appEl, "id") || (parentCarare ? getAttr(parentCarare, "id") + "_res" : "") || `Resource_${result.DigitalResource.length + 1}`);

    // Deduplicate
    if (result.DigitalResource.some(existing => existing["recordInformation.id"] === resourceId)) {
      continue;
    }

    // Normalized Type
    let rawType = getText(dr, "type");
    let normalizedType = "3D";
    const lowerType = rawType.toLowerCase();
    if (lowerType.includes("image") || lowerType.includes("photo") || lowerType.includes("jpg") || lowerType.includes("png")) {
      normalizedType = "Image";
    } else if (lowerType.includes("text") || lowerType.includes("pdf") || lowerType.includes("doc")) {
      normalizedType = "Text";
    } else if (lowerType.includes("movie") || lowerType.includes("video") || lowerType.includes("mp4")) {
      normalizedType = "Movie";
    } else if (lowerType.includes("sound") || lowerType.includes("audio") || lowerType.includes("mp3")) {
      normalizedType = "Sound";
    } else {
      normalizedType = "3D";
    }

    // Appellation Names
    let names = appEl ? getDirectChildren(appEl, "name").map(n => ({
      _value: n.textContent.trim(),
      "appellation.name#lang": getLang(n, "en"),
      "appellation.name#preferred": getPreferred(n)
    })) : [];

    if (names.length === 0) {
      const fallbackTitle = getText(dr, "title") || getText(dr, "name") || resourceId;
      names = [{ _value: fallbackTitle, "appellation.name#lang": "en", "appellation.name#preferred": true }];
    }

    const drRecord = {
      "recordInformation.id": resourceId,
      "recordInformation.source": recInfo ? getText(recInfo, "source") : "",
      "recordInformation.source#lang": recInfo ? getLang(getDirectChild(recInfo, "source"), "en") : "en",
      "recordInformation.country": recInfo ? getText(recInfo, "country") : "DE",
      "recordInformation.country#lang": recInfo ? getLang(getDirectChild(recInfo, "country"), "de") : "de",
      "recordInformation.creation.date": recInfo ? getText(getDirectChild(recInfo, "creation"), "date") : "",
      "recordInformation.language": recInfo ? getDirectChildren(recInfo, "language").map(l => l.textContent.trim()) : ["en"],
      "recordInformation.metadataRights": recInfo ? getText(recInfo, "metadataRights") : "",

      "appellation.id": appEl ? getText(appEl, "id") : resourceId,
      "appellation.name": names,

      description: getText(dr, "description"),
      "description#lang": getLang(getDirectChild(dr, "description"), "en"),
      note: getDirectChildren(dr, "note").map(n => n.textContent.trim()),
      "note#lang": getLang(getDirectChild(dr, "note"), "en"),
      actors: getDirectChildren(dr, "actors").map(a => {
        const actorName = getText(a, "name") || getText(a, "actor");
        const actorId = getText(a, "id") || getText(a, "actorUID");
        const actorRole = getText(a, "roles") || getText(a, "role");
        return {
          actor: actorName,
          actorUID: actorId,
          role: actorRole,
          name: actorName,
          id: actorId,
          roles: actorRole
        };
      }),

      type: normalizedType,
      format: getDirectChildren(dr, "format").map(f => f.textContent.trim()),
      "format#lang": getLang(getDirectChild(dr, "format"), "en"),
      formatDetails: getText(dr, "formatDetails"),
      "formatDetails#lang": getLang(getDirectChild(dr, "formatDetails"), "en"),

      extent: getDirectChildren(dr, "extent").map(e => e.textContent.trim()).join(", ") || getText(dr, "extent"),
      created: getText(dr, "created"),
      language: getDirectChildren(dr, "language").map(l => l.textContent.trim()),

      link: getText(dr, "link"),
      object: getText(dr, "object"),
      isShownAt: getText(dr, "isShownAt"),

      isRepresentationOf: getDirectChildren(dr, "isRepresentationOf").map(r => r.textContent.trim()),
      hasPart: getDirectChildren(dr, "hasPart").map(p => p.textContent.trim()),
      isPartOf: getDirectChildren(dr, "isPartOf").map(p => p.textContent.trim()),
      nextInSequence: getDirectChildren(dr, "nextInSequence").map(s => s.textContent.trim()),
      isPreviousInSequence: getDirectChildren(dr, "isPreviousInSequence").map(s => s.textContent.trim()),
      isDerivativeOf: getDirectChildren(dr, "isDerivativeOf").map(d => d.textContent.trim()),
      hasDerivative: getDirectChildren(dr, "hasDerivative").map(d => d.textContent.trim()),
      createdDerivative: getDirectChildren(dr, "createdDerivative").map(d => d.textContent.trim()),
      dcRelation: getDirectChildren(dr, "dcRelation").map(d => d.textContent.trim())
    };

    if (rightsEl) {
      drRecord["rights.copyrightCreditLine"] = getText(rightsEl, "copyrightCreditLine");
      drRecord["rights.copyrightCreditLine#lang"] = getLang(getDirectChild(rightsEl, "copyrightCreditLine"), "de");
      drRecord["rights.accessRights"] = getText(rightsEl, "accessRights");
      drRecord["rights.accessRights#lang"] = getLang(getDirectChild(rightsEl, "accessRights"), "en");
      drRecord["rights.reproductionRights"] = getText(rightsEl, "reproductionRights");
      drRecord["rights.reproductionRights#lang"] = getLang(getDirectChild(rightsEl, "reproductionRights"), "en");
      drRecord["rights.licence"] = getText(rightsEl, "licence");
      drRecord["rights.licence#lang"] = getLang(getDirectChild(rightsEl, "licence"), "en");
    }

    result.DigitalResource.push(drRecord);
  }

  // ----------------------------------------------------
  // 4. ACTIVITY (Paradata & Digitization Workflow)
  // ----------------------------------------------------
  const actEls = findAllDescendants(xmlDoc, "activity");
  for (const act of actEls) {
    const recInfo = getDirectChild(act, "recordInformation");
    const appEl = getDirectChild(act, "appellation");
    const etEl = getDirectChild(act, "eventType");
    const parentCarare = act.closest ? act.closest("carare") : act.parentElement;

    const activityId = recInfo ? getText(recInfo, "id") : (getText(act, "id") || getAttr(act, "id") || getText(appEl, "id") || (parentCarare ? getAttr(parentCarare, "id") + "_act" : "") || `Activity_${result.Activity.length + 1}`);

    // Deduplicate
    if (result.Activity.some(existing => existing["recordInformation.id"] === activityId)) {
      continue;
    }

    // Appellation Names
    let names = appEl ? getDirectChildren(appEl, "name").map(n => ({
      _value: n.textContent.trim(),
      "appellation.name#lang": getLang(n, "de"),
      "appellation.name#preferred": getPreferred(n)
    })) : [];

    if (names.length === 0) {
      const fallbackTitle = getText(act, "title") || getText(act, "name") || activityId;
      names = [{ _value: fallbackTitle, "appellation.name#lang": "de", "appellation.name#preferred": true }];
    }

    const actRecord = {
      "recordInformation.id": activityId,
      "recordInformation.source": recInfo ? getText(recInfo, "source") : "",
      "recordInformation.creation.date": recInfo ? getText(getDirectChild(recInfo, "creation"), "date") : "",

      "appellation.id": appEl ? getText(appEl, "id") : activityId,
      "appellation.name": names,

      description: getText(act, "description"),
      "description#lang": getLang(getDirectChild(act, "description"), "de"),
      hasGeneralPurpose: getText(act, "hasGeneralPurpose"),
      "hasGeneralPurpose#lang": getLang(getDirectChild(act, "hasGeneralPurpose"), "en"),

      eventType: getText(act, "eventType") || "3D digitisation",
      "eventType#term": getAttr(etEl, "term") || getText(act, "eventType") || "3D digitisation",
      "eventType#namespace": getAttr(etEl, "namespace") || "AAT",
      "eventType#lang": getLang(etEl, "en"),
      "eventType#termUID": getAttr(etEl, "termUID") || "",

      // Both ActivityCrud fields (id, name, actorType, roles) and aliases (actor, actorUID, role)
      actors: getDirectChildren(act, "actors").map(a => {
        const actorName = getText(a, "name") || getText(a, "actor");
        const actorId = getText(a, "id") || getText(a, "actorUID");
        const actorType = getText(a, "actorType");
        const actorRole = getText(a, "roles") || getText(a, "role");
        return {
          id: actorId,
          name: actorName,
          actorType: actorType,
          roles: actorRole,
          actor: actorName,
          actorUID: actorId,
          role: actorRole
        };
      }),

      temporal: getDirectChildren(act, "temporal").map(t => {
        const ts = getDirectChild(t, "timeSpan");
        return {
          "timeSpan.startDate": ts ? getText(ts, "startDate") : "",
          "timeSpan.endDate": ts ? getText(ts, "endDate") : "",
          displayDate: getText(t, "displayDate") || getText(t, "periodName"),
          periodName: getText(t, "periodName") || getText(t, "displayDate")
        };
      }),

      "spatial.locationSet.namedLocation": getText(getDirectChild(getDirectChild(act, "spatial"), "locationSet"), "namedLocation"),

      // Paradata: Sub-activities (Capture, Representation, Mesh Processing, etc.)
      consistsOf: getDirectChildren(act, "consistsOf").map(co => ({
        hadSpecificPurpose: getText(co, "hadSpecificPurpose"),
        startDate: getText(co, "startDate"),
        endDate: getText(co, "endDate"),
        methods: getDirectChildren(co, "methods").map(m => m.textContent.trim()),
        techniques: getDirectChildren(co, "techniques").map(t => t.textContent.trim()),
        materials: getDirectChildren(co, "materials").map(m => m.textContent.trim()),
        equipment: getDirectChildren(co, "equipment").map(e => e.textContent.trim())
      })),

      assessments: getText(act, "assessments"),
      occurredAt: getDirectChildren(act, "occurredAt").map(x => x.textContent.trim()),
      happenedAt: getDirectChildren(act, "happenedAt").map(x => x.textContent.trim()),
      wasPresentAt: getDirectChildren(act, "wasPresentAt").map(x => x.textContent.trim()),
      hasPart: getDirectChildren(act, "hasPart").map(x => x.textContent.trim()),
      isPartOf: getDirectChildren(act, "isPartOf").map(x => x.textContent.trim()),
      hasCreated: getDirectChildren(act, "hasCreated").map(hc => hc.textContent.trim()),
      dcRelation: getDirectChildren(act, "dcRelation").map(x => x.textContent.trim())
    };

    result.Activity.push(actRecord);
  }

  // Populate Summary
  result.summary.collections = result.Collection.length;
  result.summary.assets = result.HeritageAsset.length;
  result.summary.resources = result.DigitalResource.length;
  result.summary.activities = result.Activity.length;

  const totalLoaded = result.summary.collections + result.summary.assets + result.summary.resources + result.summary.activities;
  if (totalLoaded === 0) {
    throw new Error(
      "In dieser Datei konnten keine CARARE-Objekte identifiziert werden. " +
      "Gültige Elemente sind <collectionInformation>, <heritageAssetIdentification>, <digitalResource> oder <activity>."
    );
  }

  return result;
}
