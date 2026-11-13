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
    throw new Error(
      "XML Syntaxfehler: " + parseError.textContent.slice(0, 300),
    );
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
    return Array.from(parent.children).filter((c) => getLocal(c) === targetTag);
  };

  const getDirectChild = (parent, tag) => {
    if (!parent || !parent.children) return null;
    const targetTag = tag.toLowerCase();
    return (
      Array.from(parent.children).find((c) => getLocal(c) === targetTag) || null
    );
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
      const name = (a.localName || a.name || "")
        .replace(/^.*:/, "")
        .toLowerCase();
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

  // Helper to reliably find closest ancestor <carare> element without CSS selector limitations on XML DOM
  const getParentCarare = (node) => {
    let p = node ? node.parentElement : null;
    while (p) {
      if (getLocal(p) === "carare") return p;
      p = p.parentElement;
    }
    return null;
  };

  // Find all nodes matching localName anywhere within scope (handles Document and Element roots)
  const findAllDescendants = (root, localName) => {
    const target = localName.toLowerCase();
    const matches = [];
    const walk = (node) => {
      if (!node) return;
      if (node.nodeType === 1) {
        if (getLocal(node) === target) {
          matches.push(node);
        }
      }
      const children =
        node.nodeType === 9
          ? node.documentElement
            ? [node.documentElement]
            : []
          : node.children || [];
      for (let i = 0; i < children.length; i++) {
        walk(children[i]);
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
      activities: 0,
    },
  };

  // Helper to reliably extract and normalize contacts structures (CARARE 2.0.6)
  const parseContacts = (container) => {
    if (!container) return [];
    return getDirectChildren(container, "contacts").map((c) => {
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
        "address.adminArea":
          getText(addr, "adminArea") || getText(addr, "county"),
        "address.postcodeOrZipcode":
          getText(addr, "postcode") || getText(addr, "postcodeOrZipcode"),
        "address.country": getText(addr, "country") || "DE",
      };
    });
  };

  // ----------------------------------------------------
  // 1. COLLECTION INFORMATION
  // ----------------------------------------------------
  const colEls = findAllDescendants(xmlDoc, "collectionInformation");
  for (const col of colEls) {
    const parentCarare = getParentCarare(col);
    const colId =
      getText(col, "id") ||
      getAttr(col, "id") ||
      (parentCarare ? getAttr(parentCarare, "id") : "") ||
      "Collection_1";

    // Deduplicate identical collection blocks (common in carareWrap repeating collection for each asset)
    if (result.Collection.some((c) => c.id && c.id === colId)) {
      continue;
    }

    const colRecord = {
      id: colId,
      title: getDirectChildren(col, "title").map((t) => ({
        _value: t.textContent.trim(),
        "title#lang": getLang(t, "de"),
        "title#preferred": getPreferred(t),
      })),
      source: getText(col, "source"),
      "source#lang": getLang(getDirectChild(col, "source"), "de"),
      statement: getText(col, "statement"),
      "statement#lang": getLang(getDirectChild(col, "statement"), "de"),
      "statement#preferred": getPreferred(getDirectChild(col, "statement")),
      keywords: getDirectChildren(col, "keywords").map((k) =>
        k.textContent.trim(),
      ),
      "keywords#lang": getLang(getDirectChild(col, "keywords"), "de"),
      "keywords#namespace": getAttr(
        getDirectChild(col, "keywords"),
        "namespace",
      ),
      language: getDirectChildren(col, "language").map((l) =>
        l.textContent.trim(),
      ),
      "creation.createdOn":
        getText(getDirectChild(col, "creation"), "createdOn") || "",
      "creation.query": getText(getDirectChild(col, "creation"), "query") || "",
      contacts: parseContacts(col),
      hasPart: getDirectChildren(col, "hasPart").map((x) =>
        x.textContent.trim(),
      ),
      wasDigitizedBy: getDirectChildren(col, "wasDigitizedBy").map((x) =>
        x.textContent.trim(),
      ),
      isPartOf: getDirectChildren(col, "isPartOf").map((x) =>
        x.textContent.trim(),
      ),
      dcRelation: getDirectChildren(col, "dcRelation").map((x) =>
        x.textContent.trim(),
      ),
    };

    // Ensure title has at least one entry if missing
    if (colRecord.title.length === 0 && colRecord.id) {
      colRecord.title.push({
        _value: colRecord.id,
        "title#lang": "de",
        "title#preferred": true,
      });
    }

    const rightsEl = getDirectChild(col, "rights");
    if (rightsEl) {
      colRecord["rights.copyrightCreditLine"] = getText(
        rightsEl,
        "copyrightCreditLine",
      );
      colRecord["rights.copyrightCreditLine#lang"] = getLang(
        getDirectChild(rightsEl, "copyrightCreditLine"),
        "de",
      );
      colRecord["rights.accessRights"] = getText(rightsEl, "accessRights");
      colRecord["rights.accessRights#lang"] = getLang(
        getDirectChild(rightsEl, "accessRights"),
        "en",
      );
      colRecord["rights.reproductionRights"] = getText(
        rightsEl,
        "reproductionRights",
      );
      colRecord["rights.reproductionRights#lang"] = getLang(
        getDirectChild(rightsEl, "reproductionRights"),
        "en",
      );
      colRecord["rights.licence"] = getText(rightsEl, "licence");
      colRecord["rights.licence#lang"] = getLang(
        getDirectChild(rightsEl, "licence"),
        "en",
      );
      colRecord["rights.europeanaRights"] = getText(
        rightsEl,
        "europeanaRights",
      );
    }

    const covEl = getDirectChild(col, "coverage");
    if (covEl) {
      const tempEl = getDirectChild(covEl, "temporal");
      if (tempEl) {
        const tsEl = getDirectChild(tempEl, "timeSpan");
        if (tsEl) {
          colRecord["coverage.temporal.timeSpan.startDate"] = getText(
            tsEl,
            "startDate",
          );
          colRecord["coverage.temporal.timeSpan.endDate"] = getText(
            tsEl,
            "endDate",
          );
          colRecord["coverage.temporal.timeSpan.dateRangeQualifier"] = getText(
            tsEl,
            "dateRangeQualifier",
          );
        }
        colRecord["coverage.temporal.periodName"] = getText(
          tempEl,
          "periodName",
        );
        colRecord["coverage.temporal.periodName#lang"] = getLang(
          getDirectChild(tempEl, "periodName"),
          "de",
        );
        colRecord["coverage.temporal.periodName#preferred"] = getPreferred(
          getDirectChild(tempEl, "periodName"),
        );
        colRecord["coverage.temporal.displayDate"] = getText(
          tempEl,
          "displayDate",
        );
        colRecord["coverage.temporal.scientificDate"] = getText(
          tempEl,
          "scientificDate",
        );
        colRecord["coverage.temporal.scientificDateMethod"] = getText(
          tempEl,
          "scientificDateMethod",
        );
      }
      const spatEl = getDirectChild(covEl, "spatial");
      if (spatEl) {
        const locSet = getDirectChild(spatEl, "locationSet");
        if (locSet) {
          colRecord["coverage.spatial.locationSet.namedLocation"] =
            getDirectChildren(locSet, "namedLocation").map((n) =>
              n.textContent.trim(),
            );
          colRecord["coverage.spatial.locationSet.geopoliticalArea"] = getText(
            locSet,
            "geopoliticalArea",
          );
          colRecord["coverage.spatial.locationSet.geopoliticalArea#lang"] =
            getLang(getDirectChild(locSet, "geopoliticalArea"), "de");
          colRecord["coverage.spatial.locationSet.geopoliticalAreaType"] =
            getText(locSet, "geopoliticalAreaType");
          colRecord["coverage.spatial.locationSet.cadastralReference"] =
            getText(locSet, "cadastralReference");
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
    const parentCarare = getParentCarare(ha);

    // Helper to search tag in <characters> or directly under <heritageAssetIdentification>
    const fromCharOrDirect = (tag) => {
      const fromChar = charEl ? getDirectChildren(charEl, tag) : [];
      if (fromChar.length > 0) return fromChar;
      return getDirectChildren(ha, tag);
    };

    const assetId = recInfo
      ? getText(recInfo, "id")
      : getText(ha, "id") ||
        getAttr(ha, "id") ||
        getText(appEl, "id") ||
        (parentCarare ? getAttr(parentCarare, "id") : "") ||
        "Asset_1";

    // Deduplicate identical asset blocks
    if (
      result.HeritageAsset.some(
        (existing) =>
          existing["recordInformation.id"] === assetId ||
          existing["appellation.id"] === assetId,
      )
    ) {
      continue;
    }

    // Appellation Names
    let names = appEl
      ? getDirectChildren(appEl, "name").map((n) => ({
          _value: n.textContent.trim(),
          "appellation.name#lang": getLang(n, "de"),
          "appellation.name#preferred": getPreferred(n),
        }))
      : [];

    if (names.length === 0) {
      const directNames = getDirectChildren(ha, "name").concat(
        getDirectChildren(ha, "title"),
      );
      if (directNames.length > 0) {
        names = directNames.map((n) => ({
          _value: n.textContent.trim(),
          "appellation.name#lang": getLang(n, "de"),
          "appellation.name#preferred": getPreferred(n),
        }));
      } else {
        names = [
          {
            _value: assetId,
            "appellation.name#lang": "de",
            "appellation.name#preferred": true,
          },
        ];
      }
    }

    const haRecord = {
      id: assetId,
      "recordInformation.id": assetId,
      "recordInformation.source": recInfo ? getText(recInfo, "source") : "",
      "recordInformation.source#lang": recInfo
        ? getLang(getDirectChild(recInfo, "source"), "de")
        : "de",
      "recordInformation.country": recInfo ? getText(recInfo, "country") : "DE",
      "recordInformation.country#lang": recInfo
        ? getLang(getDirectChild(recInfo, "country"), "de")
        : "de",
      "recordInformation.creation.date": recInfo
        ? getText(getDirectChild(recInfo, "creation"), "date")
        : "",
      "recordInformation.creation.contacts": parseContacts(
        getDirectChild(recInfo, "creation"),
      ),
      "recordInformation.language": recInfo
        ? getDirectChildren(recInfo, "language").map((l) =>
            l.textContent.trim(),
          )
        : ["de"],
      "recordInformation.metadataRights": recInfo
        ? getText(recInfo, "metadataRights")
        : "",

      "appellation.id": appEl ? getText(appEl, "id") : assetId,
      "appellation.name": names,

      description: getText(ha, "description"),
      "description#lang": getLang(getDirectChild(ha, "description"), "de"),
      generalType: getText(ha, "generalType") || "physical object",

      actors: getDirectChildren(ha, "actors").map((a) => {
        const actorName = getText(a, "name") || getText(a, "actor");
        const actorId = getText(a, "id") || getText(a, "actorUID");
        const actorType = getText(a, "actorType") || "person";
        const rolesList = getDirectChildren(a, "roles")
          .map((r) => r.textContent.trim())
          .filter(Boolean);
        const fallbackRole = getText(a, "role");
        const rolesArr =
          rolesList.length > 0 ? rolesList : fallbackRole ? [fallbackRole] : [];
        return {
          actor: actorName,
          actorUID: actorId,
          role: rolesArr[0] || "",
          name: actorName,
          id: actorId,
          type: actorType === "organisation" ? "organization" : actorType,
          roles: rolesArr,
        };
      }),

      "conditions.condition": condEl ? getText(condEl, "condition") : "",
      "conditions.condition#lang": condEl
        ? getLang(getDirectChild(condEl, "condition"), "de")
        : "de",
      "conditions.conditionAssessment": condEl
        ? getText(condEl, "conditionAssessment")
        : "",
      "conditions.conditionDate": condEl
        ? getText(condEl, "conditionDate")
        : "",
      "conditions.wasPresentAt": condEl ? getText(condEl, "wasPresentAt") : "",

      provenance: getText(ha, "provenance"),
      "provenance#lang": getLang(getDirectChild(ha, "provenance"), "de"),
      repositoryLocation: getText(ha, "repositoryLocation"),
      "repositoryLocation#lang": getLang(
        getDirectChild(ha, "repositoryLocation"),
        "de",
      ),

      "characters.heritageAssetType": fromCharOrDirect("heritageAssetType").map(
        (hat) => ({
          _value: hat.textContent.trim(),
          "#term": getAttr(hat, "term") || hat.textContent.trim(),
          "#lang": getLang(hat, "de"),
          "#namespace": getAttr(hat, "namespace"),
          "#termUID": getAttr(hat, "termUID"),
        }),
      ),

      "characters.materials": fromCharOrDirect("materials").map((m) => ({
        _value: m.textContent.trim(),
        "#lang": getLang(m, "de"),
        "#term": getAttr(m, "term") || m.textContent.trim(),
        "#namespace": getAttr(m, "namespace"),
        "#termUID": getAttr(m, "termUID"),
      })),

      "characters.inscriptions": fromCharOrDirect("inscriptions").map((i) => ({
        _value: i.textContent.trim(),
        "#lang": getLang(i, "de"),
        "#type": getAttr(i, "type"),
        "#namespace": getAttr(i, "namespace"),
        "#preferred": getPreferred(i),
      })),

      "characters.dimensions": fromCharOrDirect("dimensions").map((d) => ({
        extent: getText(d, "extent"),
        measurementType: getText(d, "measurementType"),
        units: getText(d, "units"),
        scale: getText(d, "scale"),
        value: parseFloat(getText(d, "value")) || getText(d, "value"),
      })),

      "characters.temporal": fromCharOrDirect("temporal").map((t) => {
        const ts = getDirectChild(t, "timeSpan");
        return {
          "timeSpan.startDate": ts ? getText(ts, "startDate") : "",
          "timeSpan.endDate": ts ? getText(ts, "endDate") : "",
          "timeSpan.dateRangeQualifier": ts
            ? getText(ts, "dateRangeQualifier")
            : "",
          periodName: getText(t, "periodName"),
          displayDate: getText(t, "displayDate") || getText(t, "periodName"),
        };
      }),

      spatial: getDirectChildren(ha, "spatial").map((s) => {
        const ls = getDirectChild(s, "locationSet");
        const geom = getDirectChild(s, "geometry");
        const qp = geom
          ? getDirectChild(geom, "quickpoint") || getDirectChild(geom, "point")
          : null;
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
          "locationSet.namedLocation#lang": ls
            ? getLang(getDirectChild(ls, "namedLocation"), "de")
            : "de",
          "locationSet.namedLocation#preferred": ls
            ? getPreferred(getDirectChild(ls, "namedLocation"))
            : true,
          "locationSet.namedLocation#namespace": ls
            ? getAttr(getDirectChild(ls, "namedLocation"), "namespace")
            : "",
          "locationSet.namedLocation#term": ls
            ? getAttr(getDirectChild(ls, "namedLocation"), "term")
            : "",
          "locationSet.namedLocation#termUID": ls
            ? getAttr(getDirectChild(ls, "namedLocation"), "termUID")
            : "",
          "locationSet.geopoliticalArea": ls
            ? getText(ls, "geopoliticalArea")
            : "",
          "locationSet.geopoliticalArea#lang": ls
            ? getLang(getDirectChild(ls, "geopoliticalArea"), "de")
            : "de",
          "locationSet.geopoliticalAreaType": ls
            ? getText(ls, "geopoliticalAreaType")
            : "",
          "locationSet.historicalName": ls
            ? getDirectChildren(ls, "historicalName").map((hn) => ({
                _value: hn.textContent.trim(),
                "historicalName#lang": getLang(hn, "de"),
                "historicalName#preferred": getPreferred(hn),
              }))
            : [],
          "geometry.quickpoint.x": qpX,
          "geometry.quickpoint.y": qpY,
        };
      }),

      references: getDirectChildren(ha, "references").map((r) => {
        const app = getDirectChild(r, "appellation");
        return {
          "appellation.name": app ? getText(app, "name") : getText(r, "name"),
          "appellation.name#lang": app
            ? getLang(getDirectChild(app, "name"), "de")
            : "de",
          "appellation.id": app ? getText(app, "id") : "",
          link: getText(r, "link") || getText(r, "url"),
          type: getText(r, "type"),
          rights: getText(r, "rights"),
        };
      }),

      hasRepresentation: getDirectChildren(ha, "hasRepresentation").map((hr) =>
        hr.textContent.trim(),
      ),
      isSuccessorOf: getDirectChildren(ha, "isSuccessorOf").map((x) =>
        x.textContent.trim(),
      ),
      wasPresentAt: getDirectChildren(ha, "wasPresentAt").map((x) =>
        x.textContent.trim(),
      ),
      hasPart: getDirectChildren(ha, "hasPart").map((x) =>
        x.textContent.trim(),
      ),
      isPartOf: getDirectChildren(ha, "isPartOf").map((x) =>
        x.textContent.trim(),
      ),
      isReplicaOf: getDirectChildren(ha, "isReplicaOf").map((x) =>
        x.textContent.trim(),
      ),
      wasDigitizedBy: getDirectChildren(ha, "wasDigitizedBy").map((x) =>
        x.textContent.trim(),
      ),
      dcRelation: getDirectChildren(ha, "dcRelation").map((x) =>
        x.textContent.trim(),
      ),
    };

    if (rightsEl) {
      haRecord["rights.copyrightCreditLine"] = getText(
        rightsEl,
        "copyrightCreditLine",
      );
      haRecord["rights.copyrightCreditLine#lang"] = getLang(
        getDirectChild(rightsEl, "copyrightCreditLine"),
        "de",
      );
      haRecord["rights.accessRights"] = getText(rightsEl, "accessRights");
      haRecord["rights.accessRights#lang"] = getLang(
        getDirectChild(rightsEl, "accessRights"),
        "en",
      );
      haRecord["rights.reproductionRights"] = getText(
        rightsEl,
        "reproductionRights",
      );
      haRecord["rights.reproductionRights#lang"] = getLang(
        getDirectChild(rightsEl, "reproductionRights"),
        "en",
      );
      haRecord["rights.licence"] = getText(rightsEl, "licence");
      haRecord["rights.licence#lang"] = getLang(
        getDirectChild(rightsEl, "licence"),
        "en",
      );
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
    const parentCarare = getParentCarare(dr);

    const resourceId = recInfo
      ? getText(recInfo, "id")
      : getText(dr, "id") ||
        getAttr(dr, "id") ||
        getText(appEl, "id") ||
        (parentCarare ? getAttr(parentCarare, "id") + "_res" : "") ||
        `Resource_${result.DigitalResource.length + 1}`;

    // Deduplicate
    if (
      result.DigitalResource.some(
        (existing) => existing["recordInformation.id"] === resourceId,
      )
    ) {
      continue;
    }

    // Normalized Type
    let rawType = getText(dr, "type");
    let normalizedType = "3D";
    const lowerType = rawType.toLowerCase();
    if (
      lowerType.includes("image") ||
      lowerType.includes("photo") ||
      lowerType.includes("jpg") ||
      lowerType.includes("png")
    ) {
      normalizedType = "Image";
    } else if (
      lowerType.includes("text") ||
      lowerType.includes("pdf") ||
      lowerType.includes("doc")
    ) {
      normalizedType = "Text";
    } else if (
      lowerType.includes("movie") ||
      lowerType.includes("video") ||
      lowerType.includes("mp4")
    ) {
      normalizedType = "Movie";
    } else if (
      lowerType.includes("sound") ||
      lowerType.includes("audio") ||
      lowerType.includes("mp3")
    ) {
      normalizedType = "Sound";
    } else {
      normalizedType = "3D";
    }

    // Appellation Names
    let names = appEl
      ? getDirectChildren(appEl, "name").map((n) => ({
          _value: n.textContent.trim(),
          "appellation.name#lang": getLang(n, "en"),
          "appellation.name#preferred": getPreferred(n),
        }))
      : [];

    if (names.length === 0) {
      const fallbackTitle =
        getText(dr, "title") || getText(dr, "name") || resourceId;
      names = [
        {
          _value: fallbackTitle,
          "appellation.name#lang": "en",
          "appellation.name#preferred": true,
        },
      ];
    }

    const drRecord = {
      id: resourceId,
      "recordInformation.id": resourceId,
      "recordInformation.source": recInfo ? getText(recInfo, "source") : "",
      "recordInformation.source#lang": recInfo
        ? getLang(getDirectChild(recInfo, "source"), "en")
        : "en",
      "recordInformation.country": recInfo ? getText(recInfo, "country") : "DE",
      "recordInformation.country#lang": recInfo
        ? getLang(getDirectChild(recInfo, "country"), "de")
        : "de",
      "recordInformation.creation.date": recInfo
        ? getText(getDirectChild(recInfo, "creation"), "date")
        : "",
      "recordInformation.creation.contacts": parseContacts(
        getDirectChild(recInfo, "creation"),
      ),
      "recordInformation.language": recInfo
        ? getDirectChildren(recInfo, "language").map((l) =>
            l.textContent.trim(),
          )
        : ["en"],
      "recordInformation.metadataRights": recInfo
        ? getText(recInfo, "metadataRights")
        : "",

      "appellation.id": appEl ? getText(appEl, "id") : resourceId,
      "appellation.name": names,

      description: getText(dr, "description"),
      "description#lang": getLang(getDirectChild(dr, "description"), "en"),
      note: getDirectChildren(dr, "note").map((n) => n.textContent.trim()),
      "note#lang": getLang(getDirectChild(dr, "note"), "en"),
      actors: getDirectChildren(dr, "actors").map((a) => {
        const actorName = getText(a, "name") || getText(a, "actor");
        const actorId = getText(a, "id") || getText(a, "actorUID");
        const actorType = getText(a, "actorType") || "person";
        const rolesList = getDirectChildren(a, "roles")
          .map((r) => r.textContent.trim())
          .filter(Boolean);
        const fallbackRole = getText(a, "role");
        const rolesArr =
          rolesList.length > 0 ? rolesList : fallbackRole ? [fallbackRole] : [];
        return {
          actor: actorName,
          actorUID: actorId,
          role: rolesArr[0] || "",
          name: actorName,
          id: actorId,
          type: actorType === "organisation" ? "organization" : actorType,
          roles: rolesArr,
        };
      }),

      type: normalizedType,
      format: getDirectChildren(dr, "format").map((f) => f.textContent.trim()),
      "format#lang": getLang(getDirectChild(dr, "format"), "en"),
      formatDetails: getText(dr, "formatDetails"),
      "formatDetails#lang": getLang(getDirectChild(dr, "formatDetails"), "en"),

      extent:
        getDirectChildren(dr, "extent").map((e) => e.textContent.trim())[0] ||
        getText(dr, "extent"),
      extentList: getDirectChildren(dr, "extent").map((e) =>
        e.textContent.trim(),
      ),
      created: getText(dr, "created"),
      language: getDirectChildren(dr, "language").map((l) =>
        l.textContent.trim(),
      ),

      link: getText(dr, "link"),
      object: getText(dr, "object"),
      isShownAt: getText(dr, "isShownAt"),
      publicationStatement: getDirectChildren(dr, "publicationStatement").map(
        (p) => ({
          publisher: getText(p, "publisher"),
          date: getText(p, "date"),
          place: getText(p, "place"),
        }),
      ),

      isRepresentationOf: getDirectChildren(dr, "isRepresentationOf").map((r) =>
        r.textContent.trim(),
      ),
      hasPart: getDirectChildren(dr, "hasPart").map((p) =>
        p.textContent.trim(),
      ),
      isPartOf: getDirectChildren(dr, "isPartOf").map((p) =>
        p.textContent.trim(),
      ),
      nextInSequence: getDirectChildren(dr, "nextInSequence").map((s) =>
        s.textContent.trim(),
      ),
      isPreviousInSequence: getDirectChildren(dr, "isPreviousInSequence").map(
        (s) => s.textContent.trim(),
      ),
      isDerivativeOf: getDirectChildren(dr, "isDerivativeOf").map((d) =>
        d.textContent.trim(),
      ),
      hasDerivative: getDirectChildren(dr, "hasDerivative").map((d) =>
        d.textContent.trim(),
      ),
      createdDerivative: getDirectChildren(dr, "createdDerivative").map((d) =>
        d.textContent.trim(),
      ),
      dcRelation: getDirectChildren(dr, "dcRelation").map((d) =>
        d.textContent.trim(),
      ),
    };

    if (rightsEl) {
      drRecord["rights.copyrightCreditLine"] = getText(
        rightsEl,
        "copyrightCreditLine",
      );
      drRecord["rights.copyrightCreditLine#lang"] = getLang(
        getDirectChild(rightsEl, "copyrightCreditLine"),
        "de",
      );
      drRecord["rights.accessRights"] = getText(rightsEl, "accessRights");
      drRecord["rights.accessRights#lang"] = getLang(
        getDirectChild(rightsEl, "accessRights"),
        "en",
      );
      drRecord["rights.reproductionRights"] = getText(
        rightsEl,
        "reproductionRights",
      );
      drRecord["rights.reproductionRights#lang"] = getLang(
        getDirectChild(rightsEl, "reproductionRights"),
        "en",
      );
      drRecord["rights.licence"] = getText(rightsEl, "licence");
      drRecord["rights.licence#lang"] = getLang(
        getDirectChild(rightsEl, "licence"),
        "en",
      );
    }

    const metEl = getDirectChild(dr, "metrologyAndSoftware");
    if (metEl) {
      const accEl = getDirectChild(metEl, "accuracy");
      const resEl = getDirectChild(metEl, "resolution");
      const swListEl = getDirectChild(metEl, "softwareList");
      if (accEl) {
        drRecord.accuracy = {
          pointAccuracy: getText(accEl, "pointAccuracy"),
          registrationRmse: getText(accEl, "registrationRmse"),
          volumetricAccuracy: getText(accEl, "volumetricAccuracy"),
          calibrationMethod: getText(accEl, "calibrationMethod"),
        };
      }
      if (resEl) {
        drRecord.resolution = {
          spatialResolution: getText(resEl, "spatialResolution"),
          gsd: getText(resEl, "gsd"),
          textureResolution: getText(resEl, "textureResolution"),
          sensorResolution: getText(resEl, "sensorResolution"),
        };
      }
      if (swListEl) {
        drRecord.softwareList = getDirectChildren(swListEl, "software").map(
          (s) => ({
            name: getAttr(s, "name") || s.textContent.trim(),
            version: getAttr(s, "version") || "",
            role: getAttr(s, "role") || "",
          }),
        );
      }
    } else {
      // Reconstruct accuracy, resolution, and softwareList from repeated CARARE <extent> and <note> elements
      const acc = {};
      const res = {};
      const swList = [];
      for (const extText of drRecord.extentList || []) {
        if (extText.startsWith("3D Point Accuracy:"))
          acc.pointAccuracy = extText.split(":").slice(1).join(":").trim();
        else if (extText.startsWith("Registration Error (RMSE):"))
          acc.registrationRmse = extText.split(":").slice(1).join(":").trim();
        else if (extText.startsWith("Volumetric Accuracy:"))
          acc.volumetricAccuracy = extText.split(":").slice(1).join(":").trim();
        else if (extText.startsWith("3D Spatial Resolution:"))
          res.spatialResolution = extText.split(":").slice(1).join(":").trim();
        else if (extText.startsWith("Ground Sampling Distance (GSD):"))
          res.gsd = extText.split(":").slice(1).join(":").trim();
        else if (extText.startsWith("Texture Resolution:"))
          res.textureResolution = extText.split(":").slice(1).join(":").trim();
        else if (extText.startsWith("Optical Sensor Resolution:"))
          res.sensorResolution = extText.split(":").slice(1).join(":").trim();
      }
      for (const nText of drRecord.note || []) {
        if (nText.startsWith("Metrology Calibration & Standard:")) {
          acc.calibrationMethod = nText.split(":").slice(1).join(":").trim();
        } else if (nText.startsWith("Software:")) {
          const parts = nText.split("|").map((p) => p.trim());
          const swObj = { name: "", version: "", role: "" };
          parts.forEach((part) => {
            if (part.startsWith("Software:"))
              swObj.name = part.replace("Software:", "").trim();
            else if (part.startsWith("Version:"))
              swObj.version = part.replace("Version:", "").trim();
            else if (part.startsWith("Role:"))
              swObj.role = part.replace("Role:", "").trim();
          });
          if (swObj.name) swList.push(swObj);
        }
      }
      // Smart fallback parser from formatDetails string if repeated tags were not present
      if ((!swList || swList.length === 0) && drRecord.formatDetails) {
        const fd = drRecord.formatDetails;
        if (!acc.pointAccuracy) {
          const accMatch = fd.match(/(?:Genauigkeit|Accuracy):\s*([^|;]+)/i);
          if (accMatch) acc.pointAccuracy = accMatch[1].trim();
        }
        if (!res.textureResolution) {
          const texMatch = fd.match(
            /(?:Texturauflösung|Texture Resolution):\s*([^|;]+)/i,
          );
          if (texMatch) res.textureResolution = texMatch[1].trim();
        }
        const swMatch = fd.match(/(?:Software|Pipeline):\s*([^|;]+)/i);
        if (swMatch) {
          const swItems = swMatch[1].split(",").map((s) => s.trim());
          swItems.forEach((item) => {
            const parts = item.split(/\s+(\d+[\.\d]*\w*)/);
            const name = parts[0] ? parts[0].trim() : item;
            const ver = parts[1] ? parts[1].trim() : "";
            swList.push({
              name,
              version: ver,
              role: "Processing & Optimization",
            });
          });
        }
      }

      if (Object.keys(acc).length > 0) drRecord.accuracy = acc;
      if (Object.keys(res).length > 0) drRecord.resolution = res;
      if (swList.length > 0) drRecord.softwareList = swList;
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
    const parentCarare = getParentCarare(act);

    const activityId = recInfo
      ? getText(recInfo, "id")
      : getText(act, "id") ||
        getAttr(act, "id") ||
        getText(appEl, "id") ||
        (parentCarare ? getAttr(parentCarare, "id") + "_act" : "") ||
        `Activity_${result.Activity.length + 1}`;

    // Deduplicate
    if (
      result.Activity.some(
        (existing) => existing["recordInformation.id"] === activityId,
      )
    ) {
      continue;
    }

    // Appellation Names
    let names = appEl
      ? getDirectChildren(appEl, "name").map((n) => ({
          _value: n.textContent.trim(),
          "appellation.name#lang": getLang(n, "de"),
          "appellation.name#preferred": getPreferred(n),
        }))
      : [];

    if (names.length === 0) {
      const fallbackTitle =
        getText(act, "title") || getText(act, "name") || activityId;
      names = [
        {
          _value: fallbackTitle,
          "appellation.name#lang": "de",
          "appellation.name#preferred": true,
        },
      ];
    }

    const actRecord = {
      id: activityId,
      "recordInformation.id": activityId,
      "recordInformation.source": recInfo ? getText(recInfo, "source") : "",
      "recordInformation.country": recInfo ? getText(recInfo, "country") : "DE",
      "recordInformation.creation.date": recInfo
        ? getText(getDirectChild(recInfo, "creation"), "date")
        : "",
      "recordInformation.creation.contacts": parseContacts(
        getDirectChild(recInfo, "creation"),
      ),
      "recordInformation.language": recInfo
        ? getDirectChildren(recInfo, "language").map((l) =>
            l.textContent.trim(),
          )
        : ["de"],
      "recordInformation.metadataRights": recInfo
        ? getText(recInfo, "metadataRights")
        : "",

      "appellation.id": appEl ? getText(appEl, "id") : activityId,
      "appellation.name": names,

      description: getText(act, "description"),
      "description#lang": getLang(getDirectChild(act, "description"), "de"),
      hasGeneralPurpose: getText(act, "hasGeneralPurpose"),
      "hasGeneralPurpose#lang": getLang(
        getDirectChild(act, "hasGeneralPurpose"),
        "en",
      ),

      eventType: getText(act, "eventType") || "3D digitisation",
      "eventType#term":
        getAttr(etEl, "term") || getText(act, "eventType") || "3D digitisation",
      "eventType#namespace": getAttr(etEl, "namespace") || "AAT",
      "eventType#lang": getLang(etEl, "en"),
      "eventType#termUID": getAttr(etEl, "termUID") || "",

      // Both ActivityCrud fields (id, name, actorType, roles) and aliases (actor, actorUID, role)
      actors: getDirectChildren(act, "actors").map((a) => {
        const actorName = getText(a, "name") || getText(a, "actor");
        const actorId = getText(a, "id") || getText(a, "actorUID");
        const actorType = getText(a, "actorType") || "person";
        const rolesList = getDirectChildren(a, "roles")
          .map((r) => r.textContent.trim())
          .filter(Boolean);
        const fallbackRole = getText(a, "role");
        const rolesArr =
          rolesList.length > 0 ? rolesList : fallbackRole ? [fallbackRole] : [];
        return {
          id: actorId,
          name: actorName,
          actorType: actorType,
          type: actorType === "organisation" ? "organization" : actorType,
          roles: rolesArr,
          actor: actorName,
          actorUID: actorId,
          role: rolesArr[0] || "",
        };
      }),

      temporal: getDirectChildren(act, "temporal").map((t) => {
        const ts = getDirectChild(t, "timeSpan");
        return {
          "timeSpan.startDate": ts ? getText(ts, "startDate") : "",
          "timeSpan.endDate": ts ? getText(ts, "endDate") : "",
          displayDate: getText(t, "displayDate") || getText(t, "periodName"),
          periodName: getText(t, "periodName") || getText(t, "displayDate"),
        };
      }),

      "spatial.locationSet.namedLocation": getText(
        getDirectChild(getDirectChild(act, "spatial"), "locationSet"),
        "namedLocation",
      ),

      // Paradata: Sub-activities (Capture, Representation, Mesh Processing, etc.)
      consistsOf: getDirectChildren(act, "consistsOf").map((co) => ({
        hadSpecificPurpose: getText(co, "hadSpecificPurpose"),
        startDate: getText(co, "startDate"),
        endDate: getText(co, "endDate"),
        methods: getDirectChildren(co, "methods").map((m) =>
          m.textContent.trim(),
        ),
        techniques: getDirectChildren(co, "techniques").map((t) =>
          t.textContent.trim(),
        ),
        materials: getDirectChildren(co, "materials").map((m) =>
          m.textContent.trim(),
        ),
        equipment: getDirectChildren(co, "equipment").map((e) =>
          e.textContent.trim(),
        ),
      })),

      assessments: getText(act, "assessments"),
      assessmentsList: getDirectChildren(act, "assessments").map((a) =>
        a.textContent.trim(),
      ),
      occurredAt: getDirectChildren(act, "occurredAt").map((x) =>
        x.textContent.trim(),
      ),
      happenedAt: getDirectChildren(act, "happenedAt").map((x) =>
        x.textContent.trim(),
      ),
      wasPresentAt: getDirectChildren(act, "wasPresentAt").map((x) =>
        x.textContent.trim(),
      ),
      hasPart: getDirectChildren(act, "hasPart").map((x) =>
        x.textContent.trim(),
      ),
      isPartOf: getDirectChildren(act, "isPartOf").map((x) =>
        x.textContent.trim(),
      ),
      hasCreated: getDirectChildren(act, "hasCreated").map((hc) =>
        hc.textContent.trim(),
      ),
      dcRelation: getDirectChildren(act, "dcRelation").map((x) =>
        x.textContent.trim(),
      ),
    };

    const dapEl = getDirectChild(act, "digitalAuthenticityProfile");
    if (dapEl) {
      const refEl = getDirectChild(dapEl, "dapReference");
      const capEl = getDirectChild(dapEl, "dapCapture");
      const repEl = getDirectChild(dapEl, "dapRepresentation");
      const dapObj = {};
      if (refEl) {
        const capPropsEl = getDirectChild(refEl, "capturableProperties");
        const notCapEl = getDirectChild(refEl, "notCapturableBoundaries");
        dapObj.dapReference = {
          digitizationIntent: getText(refEl, "digitizationIntent"),
          targetParadigm: getText(refEl, "targetParadigm"),
          conservatorialConstraints: getText(
            refEl,
            "conservatorialConstraints",
          ),
          capturableProperties: capPropsEl
            ? getDirectChildren(capPropsEl, "capturableProperty").map((c) =>
                c.textContent.trim(),
              )
            : [],
          notCapturableBoundaries: notCapEl
            ? getDirectChildren(notCapEl, "notCapturableBoundary").map((c) =>
                c.textContent.trim(),
              )
            : [],
        };
      }
      if (capEl) {
        const accEl = getDirectChild(capEl, "accuracy");
        const resEl = getDirectChild(capEl, "resolution");
        const hwEl = getDirectChild(capEl, "hardwareDevices");
        dapObj.dapCapture = {
          acquisitionModality: getText(capEl, "acquisitionModality"),
          calibrationAndLighting: getText(capEl, "calibrationAndLighting"),
          startDate: getText(capEl, "startDate"),
          endDate: getText(capEl, "endDate"),
          accuracy: accEl
            ? {
                pointAccuracy: getText(accEl, "pointAccuracy"),
                registrationRmse: getText(accEl, "registrationRmse"),
                volumetricAccuracy: getText(accEl, "volumetricAccuracy"),
                calibrationMethod: getText(accEl, "calibrationMethod"),
              }
            : {},
          resolution: resEl
            ? {
                spatialResolution: getText(resEl, "spatialResolution"),
                gsd: getText(resEl, "gsd"),
                textureResolution: getText(resEl, "textureResolution"),
                sensorResolution: getText(resEl, "sensorResolution"),
              }
            : {},
          hardwareDevices: hwEl
            ? getDirectChildren(hwEl, "hardwareDevice").map((h) => ({
                name: getAttr(h, "name") || h.textContent.trim(),
                type: getAttr(h, "type") || "",
                specs: getAttr(h, "specs") || "",
              }))
            : [],
        };
      }
      if (repEl) {
        const swPipeEl = getDirectChild(repEl, "softwarePipeline");
        const simEl = getDirectChild(repEl, "simulatedProperties");
        dapObj.dapRepresentation = {
          startDate: getText(repEl, "startDate"),
          endDate: getText(repEl, "endDate"),
          softwarePipeline: swPipeEl
            ? getDirectChildren(swPipeEl, "software").map((s) => ({
                name: getAttr(s, "name") || s.textContent.trim(),
                version: getAttr(s, "version") || "",
                role: getAttr(s, "role") || "",
                blackboxDeclared: getAttr(s, "blackboxDeclared") === "true",
              }))
            : [],
          geometryProcessing: getText(repEl, "geometryProcessing"),
          intentionalAlterations: getText(repEl, "intentionalAlterations"),
          simulatedProperties: simEl
            ? getDirectChildren(simEl, "simulatedProperty").map((sp) =>
                sp.textContent.trim(),
              )
            : [],
          blackboxTransparency: getText(repEl, "blackboxTransparency"),
        };
      }
      actRecord.digitalAuthenticityProfile = dapObj;
    }

    result.Activity.push(actRecord);
  }

  // Automated Bi-Directional Cross-Linking across all CARARE sections
  reconcileProjectRelations(result);

  // Populate Summary
  result.summary.collections = result.Collection.length;
  result.summary.assets = result.HeritageAsset.length;
  result.summary.resources = result.DigitalResource.length;
  result.summary.activities = result.Activity.length;

  const totalLoaded =
    result.summary.collections +
    result.summary.assets +
    result.summary.resources +
    result.summary.activities;
  if (totalLoaded === 0) {
    throw new Error(
      "In dieser Datei konnten keine CARARE-Objekte identifiziert werden. " +
        "Gültige Elemente sind <collectionInformation>, <heritageAssetIdentification>, <digitalResource> oder <activity>.",
    );
  }

  return result;
}

/**
 * Reconciles relations bidirectionally between Collections, Heritage Assets,
 * Digital Resources (Master & Derivatives), and Activities.
 * Ensures that if a relation is stated on one side, it is reflected on all related entities.
 */
function reconcileProjectRelations(result) {
  const ensureArray = (obj, key) => {
    if (!obj[key]) obj[key] = [];
    else if (!Array.isArray(obj[key])) obj[key] = [obj[key]];
    return obj[key];
  };

  const addUnique = (arr, val) => {
    if (!val || typeof val !== "string") return;
    const trimmed = val.trim();
    if (!trimmed || trimmed === "—" || trimmed === "-") return;
    if (!arr.includes(trimmed)) arr.push(trimmed);
  };

  const collections = result.Collection || [];
  const assets = result.HeritageAsset || [];
  const resources = result.DigitalResource || [];
  const activities = result.Activity || [];

  const assetMap = new Map();
  assets.forEach((ha) => {
    const id = ha["recordInformation.id"] || ha.id || ha["appellation.id"];
    if (id) assetMap.set(id, ha);
  });

  const resourceMap = new Map();
  resources.forEach((dr) => {
    const id = dr["recordInformation.id"] || dr.id || dr["appellation.id"];
    if (id) resourceMap.set(id, dr);
  });

  const activityMap = new Map();
  activities.forEach((act) => {
    const id = act["recordInformation.id"] || act.id || act["appellation.id"];
    if (id) activityMap.set(id, act);
  });

  const colId =
    collections[0]?.["recordInformation.id"] || collections[0]?.id || "";

  // 1. Digital Resource relations
  resources.forEach((dr) => {
    const drId = dr["recordInformation.id"] || dr.id || dr["appellation.id"];
    const isRepList = ensureArray(dr, "isRepresentationOf");
    const isDerivList = ensureArray(dr, "isDerivativeOf");
    const hasDerivList = ensureArray(dr, "hasDerivative");
    const dcList = ensureArray(dr, "dcRelation");
    const drPartOf = ensureArray(dr, "isPartOf");

    if (colId) addUnique(drPartOf, colId);

    // Cross-link to Heritage Asset
    isRepList.forEach((haId) => {
      const ha = assetMap.get(haId);
      if (ha) {
        const haRep = ensureArray(ha, "hasRepresentation");
        addUnique(haRep, drId);
      }
    });

    // Cross-link Derivatives
    isDerivList.forEach((masterId) => {
      const masterDr = resourceMap.get(masterId);
      if (masterDr) {
        const masterDerivs = ensureArray(masterDr, "hasDerivative");
        addUnique(masterDerivs, drId);
      }
    });

    hasDerivList.forEach((derivId) => {
      const derivDr = resourceMap.get(derivId);
      if (derivDr) {
        const derivMasters = ensureArray(derivDr, "isDerivativeOf");
        addUnique(derivMasters, drId);
      }
    });

    // Cross-link to Activity
    dcList.forEach((actId) => {
      const act = activityMap.get(actId);
      if (act) {
        const actCreated = ensureArray(act, "hasCreated");
        addUnique(actCreated, drId);

        isRepList.forEach((haId) => {
          const actPresent = ensureArray(act, "wasPresentAt");
          addUnique(actPresent, haId);

          const ha = assetMap.get(haId);
          if (ha) {
            const haDigi = ensureArray(ha, "wasDigitizedBy");
            addUnique(haDigi, actId);
          }
        });
      }
    });
  });

  // 2. Heritage Asset relations
  assets.forEach((ha) => {
    const haId = ha["recordInformation.id"] || ha.id || ha["appellation.id"];
    const repList = ensureArray(ha, "hasRepresentation");
    const digiList = ensureArray(ha, "wasDigitizedBy");
    const haPartOf = ensureArray(ha, "isPartOf");

    if (colId) addUnique(haPartOf, colId);

    repList.forEach((drId) => {
      const dr = resourceMap.get(drId);
      if (dr) {
        const drRep = ensureArray(dr, "isRepresentationOf");
        addUnique(drRep, haId);
      }
    });

    digiList.forEach((actId) => {
      const act = activityMap.get(actId);
      if (act) {
        const actPresent = ensureArray(act, "wasPresentAt");
        addUnique(actPresent, haId);
      }
    });
  });

  // 3. Activity relations
  activities.forEach((act) => {
    const actId =
      act["recordInformation.id"] || act.id || act["appellation.id"];
    const createdList = ensureArray(act, "hasCreated");
    const presentList = ensureArray(act, "wasPresentAt");
    const actPartOf = ensureArray(act, "isPartOf");

    if (colId) addUnique(actPartOf, colId);

    createdList.forEach((drId) => {
      const dr = resourceMap.get(drId);
      if (dr) {
        const drDc = ensureArray(dr, "dcRelation");
        addUnique(drDc, actId);
      }
    });

    presentList.forEach((haId) => {
      const ha = assetMap.get(haId);
      if (ha) {
        const haDigi = ensureArray(ha, "wasDigitizedBy");
        addUnique(haDigi, actId);
      }
    });
  });

  // 4. Collection relations
  collections.forEach((col) => {
    const colHasPart = ensureArray(col, "hasPart");
    assets.forEach((ha) => {
      const haId = ha["recordInformation.id"] || ha.id || ha["appellation.id"];
      addUnique(colHasPart, haId);
    });
  });

  // 5. Global Field Fallback & Inheritance
  // Ensures NO field is blank even if an imported file had slight omissions
  const colContacts = collections[0]?.contacts || [];
  const colCreatedOn =
    collections[0]?.["creation.createdOn"] ||
    collections[0]?.["recordInformation.creation.date"] ||
    "2026-10-15";

  assets.forEach((ha) => {
    if (
      !ha["recordInformation.creation.contacts"] ||
      ha["recordInformation.creation.contacts"].length === 0
    ) {
      if (colContacts.length > 0) {
        ha["recordInformation.creation.contacts"] = JSON.parse(
          JSON.stringify(colContacts),
        );
      }
    }
    if (!ha["recordInformation.creation.date"]) {
      ha["recordInformation.creation.date"] = colCreatedOn;
    }
    if (!ha["conditions.wasPresentAt"]) {
      const digi = ensureArray(ha, "wasDigitizedBy");
      if (digi.length > 0) ha["conditions.wasPresentAt"] = digi[0];
    }
    if (!ha["conditions.conditionDate"]) {
      ha["conditions.conditionDate"] =
        ha["recordInformation.creation.date"] || colCreatedOn;
    }
    const haTemps = ensureArray(ha, "characters.temporal");
    haTemps.forEach((t) => {
      if (!t.displayDate && t.periodName) t.displayDate = t.periodName;
      if (!t.periodName && t.displayDate) t.periodName = t.displayDate;
      if (
        !t.displayDate &&
        (t["timeSpan.startDate"] || t["timeSpan.endDate"])
      ) {
        t.displayDate = `${t["timeSpan.startDate"] || ""} bis ${t["timeSpan.endDate"] || ""}`;
      }
    });
  });

  resources.forEach((dr) => {
    if (
      !dr["recordInformation.creation.contacts"] ||
      dr["recordInformation.creation.contacts"].length === 0
    ) {
      if (colContacts.length > 0) {
        dr["recordInformation.creation.contacts"] = JSON.parse(
          JSON.stringify(colContacts),
        );
      }
    }
    if (!dr["recordInformation.creation.date"]) {
      dr["recordInformation.creation.date"] = colCreatedOn;
    }
    if (!dr["recordInformation.metadataRights"]) {
      dr["recordInformation.metadataRights"] =
        "CC0 1.0 Universal Public Domain";
    }
    if (!dr["recordInformation.country"]) {
      dr["recordInformation.country"] = "DE";
    }
  });

  activities.forEach((act) => {
    if (
      !act["recordInformation.creation.contacts"] ||
      act["recordInformation.creation.contacts"].length === 0
    ) {
      if (colContacts.length > 0) {
        act["recordInformation.creation.contacts"] = JSON.parse(
          JSON.stringify(colContacts),
        );
      }
    }
    if (!act["recordInformation.creation.date"]) {
      act["recordInformation.creation.date"] = colCreatedOn;
    }
    if (!act["recordInformation.metadataRights"]) {
      act["recordInformation.metadataRights"] =
        "CC0 1.0 Universal Public Domain";
    }
    if (!act["recordInformation.country"]) {
      act["recordInformation.country"] = "DE";
    }
    if (!act.hasGeneralPurpose) {
      act.hasGeneralPurpose =
        "Metrologisch exakte Konservierungsdokumentation und semantisch transparente Bereitstellung für Forschung und Lehre.";
    }
    const actTemps = ensureArray(act, "temporal");
    actTemps.forEach((t) => {
      if (!t.periodName) t.periodName = "3D-Digitalisierungskampagne";
      if (!t.displayDate) {
        if (t["timeSpan.startDate"] || t["timeSpan.endDate"]) {
          t.displayDate = `${t["timeSpan.startDate"] || ""} bis ${t["timeSpan.endDate"] || ""}`;
        } else {
          t.displayDate = t.periodName;
        }
      }
    });
  });
}
