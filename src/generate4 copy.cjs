const fs = require("fs");
const path = require("path");

function generateVueCRUD(dictionary = {}, enumerations = {}) {
  const vueComponents = {};

  // Utility to build a hierarchical tree from flat dictionary paths
  const buildTree = (dictArray) => {
    const root = { children: {}, name: "root", path: "" };

    dictArray.forEach((field) => {
      const parts = field.fieldPath.split(".");
      let current = root;
      parts.forEach((part, index) => {
        if (!current.children[part]) {
          current.children[part] = {
            name: part,
            path: parts.slice(0, index + 1).join("."),
            children: {},
            def: null,
          };
        }
        current = current.children[part];
        // If this is the leaf node of the current path, attach the definition
        if (index === parts.length - 1) {
          current.def = field;
        }
      });
    });

    return root;
  };

  Object.keys(dictionary).forEach((groupName) => {
    const groupFields = dictionary[groupName];
    if (!groupFields || groupFields.length === 0) return;

    const treeRoot = buildTree(groupFields);
    const arraySchemas = {};

    // 1. Labels & Documentation Map
    const labelsMap = {};
    groupFields.forEach((f) => {
      const fallback = f.fieldPath.split(".").pop();
      const safeDoc = (f.documentationEN || "")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "\\'");
      const safeDocDE = (f.documentationDE || f.documentationEN || "")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "\\'");
      const safePlac = (f.placeholderEN || "")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "\\'");
      const safePlacDE = (f.placeholderDE || f.placeholderEN || "")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "\\'");

      labelsMap[f.fieldPath] = {
        en: f.nameEN || fallback,
        de: f.nameDE || fallback,
        docEn: safeDoc,
        docDe: safeDocDE,
        placEn: safePlac,
        placDe: safePlacDE,
      };
    });
    const labelsMapString = JSON.stringify(labelsMap, null, 2);

    // 2. Build Initial Vue State
    const stateLines = [];
    const buildStateFromTree = (node) => {
      Object.values(node.children).forEach((child) => {
        const status = child.def?.status;
        if (status === "hidden") return;

        const isArray = child.def?.isArray;
        const hasOnlyLangAndPreferred = child.def?.attributes
          && child.def.attributes.length === 2
          && child.def.attributes.some(a => a.name === 'lang')
          && child.def.attributes.some(a => a.name === 'preferred') && child.def.attributes.some(attr => Object.keys(attr).some(k => k !== 'name' && k !== 'type'));

        if (isArray) {
          if (hasOnlyLangAndPreferred) {
            stateLines.push(`'${child.path}': [{ _value: '', '${child.path}#lang': 'en', '${child.path}#preferred': true }]`);
          } else {
            stateLines.push(`'${child.path}': []`);
          }
        } else if (Object.keys(child.children).length > 0) {
          buildStateFromTree(child);
        } else {
          stateLines.push(`'${child.path}': ''`);
        }

        if (child.def?.attributes && !hasOnlyLangAndPreferred) {
          child.def.attributes.forEach((attr) => {
            if (attr.name !== "name" && attr.name !== "type") {
              const initVal = attr.value !== undefined ? `'${attr.value}'` : (attr.type === "xs:boolean" ? "false" : "''");
              stateLines.push(`'${child.path}#${attr.name}': ${initVal}`);
            }
          });
        }
      });
    };
    buildStateFromTree(treeRoot);

    const reactiveState = stateLines.join(",\n  ");
    const mainTableKeys = stateLines.map((line) =>
      line.split(":")[0].replace(/'/g, "").trim(),
    );

    const getLeafKeys = (node, localPath = "") => {
      let keys = [];
      Object.values(node.children).forEach((child) => {
        const status = child.def?.status;
        if (status === "hidden") return;

        const childLocalPath = localPath
          ? `${localPath}.${child.name}`
          : child.name;

        if (Object.keys(child.children).length > 0) {
          keys = keys.concat(getLeafKeys(child, childLocalPath));
        } else {
          keys.push(childLocalPath);
        }
      });
      return keys;
    };

    // 3. UI GENERATOR
    const buildFormFields = (node, isDrawer = false, drawerBasePath = "") => {
      let html = "";
      Object.values(node.children).forEach((child) => {
        const status = child.def?.status;
        if (status === "hidden") return;

        const dictPath = child.path;

        // Resolve model binding path (relative if inside a drawer)
        let modelPath = dictPath;
        if (isDrawer && drawerBasePath) {
          modelPath = dictPath.startsWith(drawerBasePath + ".")
            ? dictPath.substring(drawerBasePath.length + 1)
            : dictPath;
        }

        const baseObj = isDrawer ? "drawerForm" : "form";
        const isArray = child.def?.isArray && !isDrawer;
        const rawName = child.name;

        const rawType = child.def?.type || "xs:string";
        let htmlInputType = "text";
        if (rawType === "xs:date") htmlInputType = "date";
        if (rawType === "isodate") htmlInputType = "text";
        if (rawType === "isodate") console.log(dictPath);
        if (rawType === "xs:email") htmlInputType = "email";
        if (rawType === "xs:decimal" || rawType === "xs:integer")
          htmlInputType = "number";
        if (child.name === "dcRelation") htmlInputType = "url";
        if (child.name === "link") htmlInputType = "url";

        // Using the original documentation as a fallback for the Vue function
        const fallbackDoc = child.def?.documentationEN
          ? child.def.documentationEN
            .replace(/"/g, "&quot;")
            .replace(/'/g, "\\'")
          : "";
        const fallbackPlac = child.def?.placeholderEN
          ? child.def.placeholderEN.replace(/"/g, "&quot;").replace(/'/g, "\\'")
          : "";

        const hasChildren = Object.keys(child.children).length > 0;
        const validAttributes = child.def?.attributes ? child.def.attributes.filter(attr => Object.keys(attr).some(k => k !== 'name' && k !== 'type')) : [];
        const renderableAttributes = validAttributes.filter(attr => attr.value === undefined);
        const hasAttributes = renderableAttributes.length > 0;

        let attributesHtml = '';
        if (hasAttributes) {
          attributesHtml += `<div class="flex flex-col gap-2 mt-2 p-3 bg-base-200/30 rounded-box border border-base-200 w-full">`;
          renderableAttributes.forEach(attr => {
            const attrModelPath = `${modelPath}#${attr.name}`;

            attributesHtml += `
             <label class="label"><span class="label-text font-bold capitalize">${attr.name}</span></label>`;
            let attrInputType = "text";
            if (attr.type === "xs:date") attrInputType = "date";
            if (attr.type === "xs:email") attrInputType = "email";
            if (attr.type === "xs:decimal" || attr.type === "xs:integer") attrInputType = "number";

            if (attr.type === "xs:boolean") {
              attributesHtml += `
                 <input type="checkbox" v-model="${baseObj}['${attrModelPath}']" class="checkbox checkbox-sm checkbox-primary" />
               `;
            } else {
              attributesHtml += `
               <div class="flex flex-row items-center gap-2">
                 <input type="${attrInputType}" v-model="${baseObj}['${attrModelPath}']" class="input input-sm input-bordered flex-1" placeholder="${attr.name}" />
               </div>`;
            }
          });
          attributesHtml += `</div>`;
        }

        if (isArray && !isDrawer) {
          arraySchemas[dictPath] = child;

          const leafKeys = getLeafKeys(child);
          const isPrimitive = leafKeys.length === 0;

          const hasOnlyLangAndPreferred = child.def?.attributes
            && child.def.attributes.length === 2
            && child.def.attributes.some(a => a.name === 'lang')
            && child.def.attributes.some(a => a.name === 'preferred') && child.def.attributes.some(attr => Object.keys(attr).some(k => k !== 'name' && k !== 'type'));

          if (isPrimitive && hasOnlyLangAndPreferred) {
            let required = status === "required" ? `<span class="text-accent font-black">*</span>` : "";
            let recommended = status === "recommended" ? `<span class="text-warning font-black">~</span>` : "";

            html += `
        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">
          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">
             <div class="flex flex-row items-center">
               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('${dictPath}', '${rawName}') }}${required}${recommended}</h4>          
               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('${dictPath}', '${fallbackDoc}', 'doc')" v-if="getLabel('${dictPath}', '${fallbackDoc}', 'doc')">
                  <button class="btn btn-circle w-6 h-6 p-1 cursor-help">
                    <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" fill="currentColor" stroke-width="2.5" stroke="currentColor" class="size-[1.2em] primary-content"><path d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
                  </button>
               </div>
             </div>
             <button type="button" class="btn btn-sm btn-primary" @click.prevent="if(!${baseObj}['${modelPath}']) { ${baseObj}['${modelPath}'] = []; } ${baseObj}['${modelPath}'].push({_value: '', '${modelPath}#lang': 'en', '${modelPath}#preferred': ${baseObj}['${modelPath}'].length === 0})">{{ currentLocale === 'de' ? getLabel('${dictPath}', '${dictPath}') + ' ' + t('add') : t('add') + ' ' + getLabel('${dictPath}', '${dictPath}') }}</button>
          </div>
          <div class="p-4 pt-0">
             <ul class="list bg-base-100 rounded-box shadow-md w-full">
                <li v-for="(item, idx) in ${baseObj}['${modelPath}']" :key="idx" class="list-row flex items-center justify-between group h-auto py-2">
                   <div class="flex-1 w-full mr-4">
                      <input type="text" v-model="item['_value']" class="input input-bordered w-full" :placeholder="getLabel('${dictPath}', '', 'plac')" />
                   </div>
                   
                   <div class="flex gap-2 items-center">
                     <div class="dropdown dropdown-end shrink-0">
                       <div tabindex="0" role="button" class="btn btn-ghost min-w-[80px]">
                         <span v-if="item['${modelPath}#lang'] === 'de'" v-html="'<svg class=&quot;h-5 w-8 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 5 3&quot;><rect width=&quot;5&quot; height=&quot;3&quot; y=&quot;0&quot; fill=&quot;#000&quot;/><rect width=&quot;5&quot; height=&quot;2&quot; y=&quot;1&quot; fill=&quot;#D00&quot;/><rect width=&quot;5&quot; height=&quot;1&quot; y=&quot;2&quot; fill=&quot;#FFC800&quot;/></svg>'"></span>
                         <span v-else-if="item['${modelPath}#lang'] === 'en'" v-html="'<svg class=&quot;h-5 w-8 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 50 30&quot; ><rect width=&quot;50&quot; height=&quot;30&quot; fill=&quot;#012169&quot;/><path d=&quot;M0 0 L50 30 M50 0 L0 30&quot; stroke=&quot;#fff&quot; stroke-width=&quot;6&quot;/><path d=&quot;M0 0 L50 30&quot; stroke=&quot;#C8102E&quot; stroke-width=&quot;2&quot;/><path d=&quot;M50 0 L0 30&quot; stroke=&quot;#C8102E&quot; stroke-width=&quot;2&quot;/><path d=&quot;M25 0 V30 M0 15 H50&quot; stroke=&quot;#fff&quot; stroke-width=&quot;10&quot;/><path d=&quot;M25 0 V30 M0 15 H50&quot; stroke=&quot;#C8102E&quot; stroke-width=&quot;6&quot;/></svg>'"></span>
                         <span v-else-if="item['${modelPath}#lang'] === 'fr'" v-html="'<svg class=&quot;h-5 w-8 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 3 2&quot;><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;0&quot; fill=&quot;#002395&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;1&quot; fill=&quot;#FFF&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;2&quot; fill=&quot;#ED2939&quot;/></svg>'"></span>
                         <span v-else-if="item['${modelPath}#lang'] === 'it'" v-html="'<svg class=&quot;h-5 w-8 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 3 2&quot;><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;0&quot; fill=&quot;#009246&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;1&quot; fill=&quot;#FFF&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;2&quot; fill=&quot;#CE2B37&quot;/></svg>'"></span>
                         <span v-else-if="item['${modelPath}#lang'] === 'es'" v-html="'<svg class=&quot;h-5 w-8 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 3 2&quot;><rect width=&quot;3&quot; height=&quot;2&quot; y=&quot;0&quot; fill=&quot;#C1272D&quot;/><rect width=&quot;3&quot; height=&quot;1&quot; y=&quot;0.5&quot; fill=&quot;#FCE300&quot;/></svg>'"></span>
                         <span v-else class="text-sm font-bold uppercase">{{ item['${modelPath}#lang'] || t('select') }}</span>
                       </div>
                       <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32 z-[1]">
                         <li><a @click.prevent="item['${modelPath}#lang'] = 'de'; document.activeElement?.blur()">
                           <span v-html="'<svg class=&quot;h-4 w-6 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 5 3&quot;><rect width=&quot;5&quot; height=&quot;3&quot; y=&quot;0&quot; fill=&quot;#000&quot;/><rect width=&quot;5&quot; height=&quot;2&quot; y=&quot;1&quot; fill=&quot;#D00&quot;/><rect width=&quot;5&quot; height=&quot;1&quot; y=&quot;2&quot; fill=&quot;#FFC800&quot;/></svg>'"></span> DE
                         </a></li>
                         <li><a @click.prevent="item['${modelPath}#lang'] = 'en'; document.activeElement?.blur()">
                           <span v-html="'<svg class=&quot;h-4 w-6 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 50 30&quot; ><rect width=&quot;50&quot; height=&quot;30&quot; fill=&quot;#012169&quot;/><path d=&quot;M0 0 L50 30 M50 0 L0 30&quot; stroke=&quot;#fff&quot; stroke-width=&quot;6&quot;/><path d=&quot;M0 0 L50 30&quot; stroke=&quot;#C8102E&quot; stroke-width=&quot;2&quot;/><path d=&quot;M50 0 L0 30&quot; stroke=&quot;#C8102E&quot; stroke-width=&quot;2&quot;/><path d=&quot;M25 0 V30 M0 15 H50&quot; stroke=&quot;#fff&quot; stroke-width=&quot;10&quot;/><path d=&quot;M25 0 V30 M0 15 H50&quot; stroke=&quot;#C8102E&quot; stroke-width=&quot;6&quot;/></svg>'"></span> EN
                         </a></li>
                         <li><a @click.prevent="item['${modelPath}#lang'] = 'fr'; document.activeElement?.blur()">
                           <span v-html="'<svg class=&quot;h-4 w-6 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 3 2&quot;><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;0&quot; fill=&quot;#002395&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;1&quot; fill=&quot;#FFF&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;2&quot; fill=&quot;#ED2939&quot;/></svg>'"></span> FR
                         </a></li>
                         <li><a @click.prevent="item['${modelPath}#lang'] = 'it'; document.activeElement?.blur()">
                           <span v-html="'<svg class=&quot;h-4 w-6 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 3 2&quot;><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;0&quot; fill=&quot;#009246&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;1&quot; fill=&quot;#FFF&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;2&quot; fill=&quot;#CE2B37&quot;/></svg>'"></span> IT
                         </a></li>
                         <li><a @click.prevent="item['${modelPath}#lang'] = 'es'; document.activeElement?.blur()">
                           <span v-html="'<svg class=&quot;h-4 w-6 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 3 2&quot;><rect width=&quot;3&quot; height=&quot;2&quot; y=&quot;0&quot; fill=&quot;#C1272D&quot;/><rect width=&quot;3&quot; height=&quot;1&quot; y=&quot;0.5&quot; fill=&quot;#FCE300&quot;/></svg>'"></span> ES
                         </a></li>
                       </ul>
                     </div>
  
                     <div class="flex gap-1 shrink-0">
                        <button type="button" @click.prevent="item['${modelPath}#preferred'] = !item['${modelPath}#preferred']; if(item['${modelPath}#preferred']) { ${baseObj}['${modelPath}'].forEach((i, iIdx) => { if (iIdx !== idx) i['${modelPath}#preferred'] = false; }); }" 
                            class="btn btn-square btn-ghost transition-opacity" 
                            :class="item['${modelPath}#preferred'] ? 'text-warning opacity-100' : 'opacity-0 text-base-content/30 group-hover:opacity-100 hover:text-warning'" 
                            title="Set as preferred">
                            <svg xmlns="http://www.w3.org/2000/svg" class="size-[1.2em]" :fill="item['${modelPath}#preferred'] ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        </button>
                        
                        <button type="button" @click.prevent="${baseObj}['${modelPath}'].splice(idx, 1)" class="btn btn-square btn-ghost text-error opacity-0 group-hover:opacity-100 transition-opacity">
                           <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                     </div>
                   </div>
                </li>
                
                <li v-if="!${baseObj}['${modelPath}'] || ${baseObj}['${modelPath}'].length === 0" class="p-4 text-center text-sm text-base-content/40 italic">
                   {{ t('noItems') }}
                </li>
             </ul>
          </div>
        </div>`;
            return;
          }

          let subHeaders = isPrimitive
            ? `<th>{{ t('value') }}</th>`
            : leafKeys
              .filter((k) => k.includes("id") || k.includes("name") || k.includes("measurementType") || k.includes("value") || k.includes("units"))
              .map(
                (k) =>
                  `<th>{{ getLabel('${dictPath}.${k}', '${k.split(".").pop()}') }}</th>`,
              )
              .join("");

          let subCells = isPrimitive
            ? `<td>{{ subItem }}</td>`
            : leafKeys
              .filter((k) => k.includes("id") || k.includes("name") || k.includes("measurementType") || k.includes("value") || k.includes("units"))
              .map((k) => `<td>{{ subItem['${k}'] }}</td>`)
              .join("");

          const displayColsCount = isPrimitive ? 1 : leafKeys.length;

          let subListHtml = "";
          if (displayColsCount === 1) {
            const displayFieldVal = isPrimitive ? "subItem" : `subItem['${leafKeys.filter(k => k.includes("id") || k.includes("name"))[0]}']`;
            const itemDisplayHtml = isPrimitive
              ? `<div v-if="!inlineEditing['${dictPath}_' + subIdx]">{{ ${displayFieldVal} }}</div>
                 <div v-else class="flex-1 mr-4">
                   <input type="${htmlInputType}" ${htmlInputType === "date" ? ':max="maxDate"' : ""} ${rawType === "xs:decimal" ? 'step=".00000001"' : ""} ${status === "required" ? "required" : ""}  ${htmlInputType === "url" ? 'pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"' : ""}  ${rawType === "isodate" ? "pattern='^(-?[0-9]{4,})(?:-(0[1-9]|1[0-2])(?:-(0[1-9]|[12][0-9]|3[01]))?)?$'" : ""} v-model="form['${dictPath}'][subIdx]" class="input input-sm input-bordered w-full validator ${rawType === "xs:decimal" ? '[&::-webkit-inner-spin-button]:appearance-none' : ""}" :placeholder="getLabel('${dictPath}', '${fallbackPlac}', 'plac')" />
                   <div class="validator-hint text-xs mt-1">${htmlInputType === "email" ? "Enter valid email address" : "Enter valid value"}</div>
                 </div>`
              : `<div>{{ ${displayFieldVal} }}</div>`;

            const editButtonHtml = isPrimitive
              ? `<button type="button" @click.prevent="inlineEditing['${dictPath}_' + subIdx] = !inlineEditing['${dictPath}_' + subIdx]" class="btn btn-square btn-ghost" :class="inlineEditing['${dictPath}_' + subIdx] ? 'text-success' : 'text-info'">
                   <svg v-if="!inlineEditing['${dictPath}_' + subIdx]" class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                   <svg v-else class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                 </button>`
              : `<button type="button" @click.prevent="openDrawer('${dictPath}', subIdx)" class="btn btn-square btn-ghost text-info">
                   <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                 </button>`;

            subListHtml = `
          <ul class="list bg-base-100 rounded-box shadow-md w-full">
             
             <li v-for="(subItem, subIdx) in form['${dictPath}']" :key="subIdx" class="list-row flex items-center justify-between h-auto py-2">
                ${itemDisplayHtml}
                <div class="flex gap-1 shrink-0">
                   ${editButtonHtml}
                   <button type="button" @click.prevent="removeDrawerItem('${dictPath}', subIdx)" class="btn btn-square btn-ghost text-error">
                     <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                   </button>
                </div>
             </li>
             
             <li v-if="!form['${dictPath}'] || form['${dictPath}'].length === 0" class="p-4 text-center text-sm text-base-content/40 italic">
                {{ t('noItems') }}
             </li>
          </ul>`;
          } else {
            subListHtml = `
          <div class="overflow-x-auto">
             <table class="table table-xs w-full table-zebra">
                <thead class="bg-base-200"><tr>${subHeaders}<th class="w-24">{{ t('actions') }}</th></tr></thead>
                <tbody>
                   <tr v-for="(subItem, subIdx) in form['${dictPath}']" :key="subIdx">
                      ${subCells}
                      <td>
                          <div class="flex gap-1">
                            <button type="button" class="btn btn-xs btn-ghost text-info" @click.prevent="openDrawer('${dictPath}', subIdx)">{{ t('edit') }}</button>
                            <button type="button" class="btn btn-xs btn-ghost text-error" @click.prevent="removeDrawerItem('${dictPath}', subIdx)">{{ t('del') }}</button>
                          </div>
                      </td>
                   </tr>
                   <tr v-if="!form['${dictPath}'] || form['${dictPath}'].length === 0">
                      <td colspan="10" class="text-center text-base-content/40 py-4 italic">{{ t('noItems') }}</td>
                   </tr>
                </tbody>
             </table>
          </div>`;
          }

          let required =
            status === "required"
              ? `<span class="text-accent font-black">*</span>`
              : "";
          let recommended =
            status === "recommended"
              ? `<span class="text-warning font-black">~</span>`
              : "";

          if (rawName === "keywords" || rawName === "materials") {
            html += `
        <div class="form-control w-full mb-4">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('${dictPath}', '${rawName}') }}
          </span>${required}${recommended}</label> <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" data-tip="Input keywords">
  <button class="btn btn-circle w-6 h-6 p-1 cursor-help">
<svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
            fill="currentColor"
            stroke-width="2.5"
            stroke="currentColor"
            class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
</button>
</div>
          <div class="flex flex-wrap gap-2 p-2 input input-bordered h-auto min-h-[3rem] items-center w-full">
            <div v-for="(keyword, kIdx) in ${baseObj}['${modelPath}']" :key="kIdx" class="badge badge-primary gap-1 p-3">
              {{ keyword }}
              <svg @click.prevent="${baseObj}['${modelPath}'].splice(kIdx, 1)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-4 h-4 stroke-current cursor-pointer hover:text-base-100/50 transition-colors">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <input 
              type="text" 
              class="flex-1 min-w-[150px] bg-transparent outline-none text-base-content" 
              :placeholder="currentLocale === 'de' ? 'Enter drücken zum Hinzufügen...' : 'Press Enter to add...'" 
              @keydown.enter.prevent="if($event.target.value.trim()){ if(!${baseObj}['${modelPath}']) ${baseObj}['${modelPath}'] = []; if(!${baseObj}['${modelPath}'].includes($event.target.value.trim())) ${baseObj}['${modelPath}'].push($event.target.value.trim()); $event.target.value=''; }" 
            />
          </div>
          ${attributesHtml}
        </div>`;
            return;
          }
          if (rawName === 'language') {
            html += `
    <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">
       <div class="flex flex-row items-center">
               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('${dictPath}', '${rawName}') }}${required}${recommended}</h4>
               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('${dictPath}', '${fallbackDoc}', 'doc')" v-if="getLabel('${dictPath}', '${fallbackDoc}', 'doc')">
  <button class="btn btn-circle w-6 h-6 p-1 cursor-help">
<svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
            fill="currentColor"
            stroke-width="2.5"
            stroke="currentColor"
            class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
</button>
</div>
             </div>
      
      <div class="flex flex-wrap gap-4 p-4 justify-center">
        <div v-for="lang in [
          {code: 'de', svg: '<svg class=&quot;h-8 w-12 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 5 3&quot;><rect width=&quot;5&quot; height=&quot;3&quot; y=&quot;0&quot; fill=&quot;#000&quot;/><rect width=&quot;5&quot; height=&quot;2&quot; y=&quot;1&quot; fill=&quot;#D00&quot;/><rect width=&quot;5&quot; height=&quot;1&quot; y=&quot;2&quot; fill=&quot;#FFC800&quot;/></svg>'},
          {code: 'en', svg: '<svg class=&quot;h-8 w-12 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 50 30&quot; ><rect width=&quot;50&quot; height=&quot;30&quot; fill=&quot;#012169&quot;/><path d=&quot;M0 0 L50 30 M50 0 L0 30&quot; stroke=&quot;#fff&quot; stroke-width=&quot;6&quot;/><path d=&quot;M0 0 L50 30&quot; stroke=&quot;#C8102E&quot; stroke-width=&quot;2&quot;/><path d=&quot;M50 0 L0 30&quot; stroke=&quot;#C8102E&quot; stroke-width=&quot;2&quot;/><path d=&quot;M25 0 V30 M0 15 H50&quot; stroke=&quot;#fff&quot; stroke-width=&quot;10&quot;/><path d=&quot;M25 0 V30 M0 15 H50&quot; stroke=&quot;#C8102E&quot; stroke-width=&quot;6&quot;/></svg>'},
          {code: 'fr', svg: '<svg class=&quot;h-8 w-12 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 3 2&quot;><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;0&quot; fill=&quot;#002395&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;1&quot; fill=&quot;#FFF&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;2&quot; fill=&quot;#ED2939&quot;/></svg>'},
          {code: 'it', svg: '<svg class=&quot;h-8 w-12 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 3 2&quot;><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;0&quot; fill=&quot;#009246&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;1&quot; fill=&quot;#FFF&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;2&quot; fill=&quot;#CE2B37&quot;/></svg>'},
          {code: 'es', svg: '<svg class=&quot;h-8 w-12 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 3 2&quot;><rect width=&quot;3&quot; height=&quot;2&quot; y=&quot;0&quot; fill=&quot;#C1272D&quot;/><rect width=&quot;3&quot; height=&quot;1&quot; y=&quot;0.5&quot; fill=&quot;#FCE300&quot;/></svg>'}
        ]" 
             :key="lang.code" 
             @click="toggleLang('${modelPath}', lang.code, ${isDrawer})" 
             class="group relative flex h-26 w-26 cursor-pointer flex-col items-center justify-center rounded-box border-2 bg-base-200 shadow-sm transition-all"
             :class="[
                 (${baseObj}['${modelPath}'] || []).includes(lang.code)
                     ? 'border-accent'
                     : 'border-transparent hover:border-base-300'
             ]">
          <span class="select-none mb-2" v-html="lang.svg"></span>
          <span class="text-xs font-bold uppercase tracking-wider text-base-content/60">{{ lang.code }}</span>

          <button @click.stop="setPreferredLang('${modelPath}', lang.code, ${isDrawer})"
              class="btn btn-circle btn-ghost btn-xs absolute right-1 top-1 transition-opacity" 
              :class="[
                  preferredLanguages['${modelPath}'] === lang.code
                      ? 'text-warning opacity-100'
                      : 'opacity-0 text-base-content/30 group-hover:opacity-100 hover:text-warning'
              ]" 
              :title="preferredLanguages['${modelPath}'] === lang.code ? 'Preferred Language' : 'Set as preferred'">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"
                  :fill="preferredLanguages['${modelPath}'] === lang.code ? 'currentColor' : 'none'" viewBox="0 0 24 24"
                  stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
          </button>
        </div>
      </div>
      
      <div class="mt-2 text-xs text-base-content/60">
        <p>{{ t('languageTip') }}</p>
      </div>
      ${attributesHtml}
    </div>`;
            return;
          }

          html += `
        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">
          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">
             <div class="flex flex-row items-center">
               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('${dictPath}', '${rawName}') }}${required}${recommended}</h4>
               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('${dictPath}', '${fallbackDoc}', 'doc')" v-if="getLabel('${dictPath}', '${fallbackDoc}', 'doc')">
                    <button class="btn btn-circle w-6 h-6 p-1 cursor-help">
                  <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                              fill="currentColor"
                              stroke-width="2.5"
                              stroke="currentColor"
                              class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
                  </button>
                  </div>
             </div>
             ${isPrimitive
              ? `<button type="button" class="btn btn-sm btn-primary" @click.prevent="if(!form['${dictPath}']) form['${dictPath}'] = []; form['${dictPath}'].push(''); inlineEditing['${dictPath}_' + (form['${dictPath}'].length - 1)] = true;">{{ currentLocale === 'de' ? getLabel('${dictPath}', '${dictPath}') + ' ' + t('add') : t('add') + ' ' + getLabel('${dictPath}', '${dictPath}') }}</button>`
              : `<button type="button" class="btn btn-sm btn-primary" @click.prevent="openDrawer('${dictPath}')">{{ currentLocale === 'de' ? getLabel('${dictPath}', '${dictPath}') + ' ' + t('add') : t('add') + ' ' + getLabel('${dictPath}', '${dictPath}') }}</button>`}
          </div>
          ${subListHtml}
        </div>`;
          return;
        }

        if (hasChildren) {
          html += `
        <div class="col-span-full border border-base-300 bg-base-100/50 p-5 rounded-box mb-6 mt-2">
        <div class=" items-center flex flex-row">
          <label class="label mb-2 pb-0">
            <span class="label-text font-bold text-lg capitalize">{{ getLabel('${dictPath}', '${rawName}') }}</span>
          </label>
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('${dictPath}', '${fallbackDoc}', 'doc')" v-if="getLabel('${dictPath}', '${fallbackDoc}', 'doc')">
              <button class="btn btn-circle w-6 h-6 p-1 cursor-help">
            <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                        fill="currentColor"
                        stroke-width="2.5"
                        stroke="currentColor"
                        class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
            </button>
            </div>
            </div>
              <!--       ${fallbackDoc ? `<div class="text-sm text-base-content/60 mb-4 px-1">{{ getLabel('${dictPath}', '${fallbackDoc}', 'doc') }}</div>` : ""} -->
          <div class="grid grid-cols-1 gap-x-6">
            ${buildFormFields(child, isDrawer, drawerBasePath)}
          </div>
          ${attributesHtml}
        </div>`;
          return;
        }

        let required =
          status === "required"
            ? `<span class="text-accent font-black">*</span>`
            : "";
        let recommended =
          status === "recommended"
            ? `<span class="text-warning font-black">~</span>`
            : "";

        // Skosmos Autocomplete
        if (child.def?.vocab) {
          html += `
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">  
        <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('${dictPath}', '${rawName}') }}</span>${required}${recommended}</label>

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('${dictPath}', '${fallbackDoc}', 'doc')" v-if="getLabel('${dictPath}', '${fallbackDoc}', 'doc')">
            <button class="btn btn-circle w-6 h-6 p-1 cursor-help">
          <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                      fill="currentColor" stroke-width="2.5" stroke="currentColor" class="size-[1.2em] primary-content"><path d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
            </button>
          </div>
          </div>
          <SkosmosAutocomplete v-model="${baseObj}['${modelPath}']" vocab-url="${child.def.vocab}" :placeholder="getLabel('${dictPath}', '${fallbackPlac}', 'plac')" />
          ${attributesHtml}
        </div>`;
          return;
        }

        // Dropdown Enumerations
        if (child.def?.enumerations && child.def.enumerations.length > 0) {
          let enumKey = enumerations[dictPath] ? dictPath : `${groupName}.${dictPath}`;
          if (enumKey.endsWith('.country')) {
            enumKey = 'country';
          } else if (enumKey.endsWith('.europeanaRights')) {
            enumKey = 'europeanaRights';
          } else if (enumKey.endsWith('.metadataRights')) {
            enumKey = 'metadataRights';
          }

          const hasEnums = enumerations[enumKey];
          const optionsHtmlDE = hasEnums && enumerations[enumKey]["de"]
            ? Object.entries(enumerations[enumKey]["de"])
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([key, value]) => `<option value="${value}">${key}</option>`)
              .join("\n")
            : [...child.def.enumerations]
              .sort((a, b) => a.localeCompare(b))
              .map((opt) => `<option value="${opt}">${opt}</option>`)
              .join("\n");
          const optionsHtmlEN = hasEnums && enumerations[enumKey]["en"]
            ? Object.entries(enumerations[enumKey]["en"])
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([key, value]) => `<option value="${value}">${key}</option>`)
              .join("\n")
            : [...child.def.enumerations]
              .sort((a, b) => a.localeCompare(b))
              .map((opt) => `<option value="${opt}">${opt}</option>`)
              .join("\n");

          html += `
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">  
        <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('${dictPath}', '${rawName}') }}</span>${required}${recommended}</label>

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('${dictPath}', '${fallbackDoc}', 'doc')" v-if="getLabel('${dictPath}', '${fallbackDoc}', 'doc')">
                <button class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
                </button>
              </div>
              </div>
          <select v-model="${baseObj}['${modelPath}']" class="select select-bordered w-full">
            <option disabled value="">{{ currentLocale === 'de' ? getLabel('${dictPath}', '${rawName}') + ' ' + t('select') : t('select') + ' ' + getLabel('${dictPath}', '${rawName}') }}</option>
            <template v-if="currentLocale === 'de'">
              ${optionsHtmlDE}
            </template>
            <template v-else>
              ${optionsHtmlEN}
            </template>
          </select>
          ${attributesHtml}
        </div>`;
          return;
        }

        // Textarea Support
        if (child.def?.inputType === "textarea") {
          html += `
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('${dictPath}', '${rawName}') }}</span>${required}${recommended}</label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('${dictPath}', '${fallbackDoc}', 'doc')" v-if="getLabel('${dictPath}', '${fallbackDoc}', 'doc')">
                <button class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
          <textarea v-model="${baseObj}['${modelPath}']" class="textarea textarea-bordered w-full h-24" :placeholder="getLabel('${dictPath}', '${fallbackPlac}', 'plac')"></textarea>
          ${attributesHtml}
        </div>`;
          return;
        }

        // Standard Primitive Fields

        if (rawType === "xs:boolean") {
          html += `
        <div class="form-control w-full mb-4">
          <label class="label cursor-pointer justify-start gap-4">
            <input type="checkbox" v-model="${baseObj}['${modelPath}']" class="checkbox checkbox-primary" />
            <span class="label-text font-bold capitalize">{{ getLabel('${dictPath}', '${rawName}') }}</span>
           </label>
           ${attributesHtml}
        </div>`;
          return;
        }

        html += `
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('${dictPath}', '${rawName}') }}</span>${required}${recommended}</label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('${dictPath}', '${fallbackDoc}', 'doc')" v-if="getLabel('${dictPath}', '${fallbackDoc}', 'doc')">
                <button class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="${htmlInputType}" ${htmlInputType === "date" ? ':max="maxDate"' : ""} ${rawType === "xs:decimal" ? 'step=".00000001"' : ""} ${htmlInputType === "url" ? 'pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"' : ""} ${rawType === "isodate" ? "pattern='^(-?[0-9]{4,})(?:-(0[1-9]|1[0-2])(?:-(0[1-9]|[12][0-9]|3[01]))?)?$'" : ""} ${status === "required" ? "required" : ""} v-model="${baseObj}['${modelPath}']" class="input input-bordered w-full validator ${rawType === "xs:decimal" ? '[&::-webkit-inner-spin-button]:appearance-none' : ""}" :placeholder="getLabel('${dictPath}', '${fallbackPlac}', 'plac')" />
              <div class="validator-hint">${htmlInputType === "email" ? `{{t('validationEmail')}}` : `{{t('validationHint')}}`}</div>        
          ${attributesHtml}
          </div>`;
      });
      return html;
    };

    const formFields = buildFormFields(treeRoot);

    // 4. Generate Drawer Form Contents
    let drawerContents = "";
    Object.keys(arraySchemas).forEach((path) => {
      const childNode = arraySchemas[path];
      const hasChildren = Object.keys(childNode.children).length > 0;
      let required =
        childNode.def?.status === "required"
          ? `<span class="text-accent font-black">*</span>`
          : "";
      let recommended =
        childNode.def?.status === "recommended"
          ? `<span class="text-warning font-black">~</span>`
          : "";

      let daHtml = `
          <div class="form-control w-full">`;
      const validDrawerAttr = childNode.def?.attributes ? childNode.def.attributes.filter(attr => attr.name !== 'name' && attr.name !== 'type') : [];
      const renderableDrawerAttr = validDrawerAttr.filter(attr => attr.value === undefined);
      if (renderableDrawerAttr.length > 0) {
        renderableDrawerAttr.forEach(attr => {
          const attrModelPath = `#${attr.name}`;
          daHtml += `
             <label class="label"><span class="label-text font-bold capitalize">${attr.name}</span></label>`;
          let attrInputType = "text";
          if (attr.type === "xs:date") attrInputType = "date";
          if (attr.type === "xs:email") attrInputType = "email";
          if (attr.type === "xs:decimal" || attr.type === "xs:integer") attrInputType = "number";

          if (attr.type === "xs:boolean") {
            daHtml += `
               <input type="checkbox" v-model="drawerForm['${attrModelPath}']" class="checkbox checkbox-sm checkbox-primary" />`;
          } else {
            daHtml += `
               <input type="${attrInputType}" v-model="drawerForm['${attrModelPath}']" class="input input-bordered w-full" placeholder="${attr.name}" />`;
          }
        });
      }
      daHtml += `</div>`;

      let dForm;
      if (hasChildren) {
        dForm = `<div class="grid grid-cols-1 gap-x-6">${buildFormFields(childNode, true, path)}</div>`;
      } else {
        const isTextarea = childNode.def?.inputType === "textarea";
        dForm = `
          <div class="form-control w-full">
             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('${path}', '${childNode.name}') }}</span>${required}${recommended}</label>
             ${childNode.name === "dcRelation"
            ? `<label class="input validator input-bordered w-full">
                  <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </g>
                  </svg>
                  <input type="url" required placeholder="https://" v-model="drawerForm['_value']" pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?" title="Must be valid URI"  />
                </label>
                <p class="validator-hint">Must be valid URI</p>`
            : childNode.def?.vocab
              ? `<SkosmosAutocomplete v-model="drawerForm['_value']" vocab-url="${childNode.def.vocab}" class="mb-4" :placeholder="getLabel('${path}', '', 'plac')"/>`
              : isTextarea
                ? `<textarea v-model="drawerForm['_value']" class="textarea textarea-bordered w-full h-24 mb-4" :placeholder="getLabel('${path}', '', 'plac')"></textarea>`
                : `<input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('${path}', '', 'plac')"/>`
          }
          </div>
          ${daHtml}`;
      }

      drawerContents += `
      <div v-if="activeDrawerField === '${path}'">
        ${dForm}
      </div>`;
    });

    const mainTableHeaders = mainTableKeys
      .filter(
        (k) =>
          k.includes("recordInformation.id") || k.includes("appellation.name"),
      )
      .map((k) => `<th>{{ getLabel('${k}', '${k.split(".").pop()}') }}</th>`)
      .join("");
    const mainTableCells = mainTableKeys
      .filter(
        (k) =>
          k.includes("recordInformation.id") || k.includes("appellation.name"),
      )
      .map(
        (k) =>
          `<td>{{ Array.isArray(item['${k}']) ? item['${k}'].length + ' ' + t('items') : item['${k}'] }}</td>`,
      )
      .join("");

    let drawerContentHtml = "";


    let required = groupFields.def?.status === "required" ? `<span class="text-accent font-black">*</span>` : "";
    let recommended = groupFields.def?.status === "recommended" ? `<span class="text-warning font-black">~</span>` : "";

    // Apply the overarching table and save layout ONLY for Activities
    if (groupName === "activity" || groupName === "digitalResource") {
      drawerContentHtml = `
      <div class="container mx-auto p-4 max-w-7xl">

        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">
          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">
             <div>
               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ t('saved') }} {{ getLabel('${groupName}', '${groupName}') }}${required}${recommended}</h4>
             </div>
          </div>
          <div class="overflow-x-auto">
             <table class="table table-xs w-full table-zebra">
                <thead class="bg-base-200">
                  <tr>
                    ${mainTableHeaders}
                    <th class="w-24">{{ t('actions') }}</th>
                  </tr>
                </thead>
                <tbody>
                   <tr v-for="(item, idx) in items" :key="idx">
                      ${mainTableCells}
                      <td>
                         <div class="flex gap-1">
                           <button type="button" class="btn btn-xs btn-ghost text-info" @click.prevent="edit(idx)">{{ t('edit') }}</button>
                           <button type="button" class="btn btn-xs btn-ghost text-error" @click.prevent="remove(idx)">{{ t('del') }}</button>
                         </div>
                      </td>
                   </tr>
                   <tr v-if="!items || items.length === 0">
                      <td colspan="100" class="text-center text-base-content/40 py-4 italic">{{ t('noItems') }}</td>
                   </tr>
                </tbody>
             </table>
          </div>
        </div>

        <div class="bg-base-200 p-6 rounded-box shadow-sm mb-10">
          <h3 class="text-xl font-bold mb-4 capitalize">{{ isEditing ? t('edit') : t('add') }} {{ getLabel('${groupName}', '${groupName}') }}</h3>
          <form @submit.prevent="save">
            <div class="grid grid-cols-1 gap-x-6">
              ${formFields}
            </div>
            
            <div class="mt-8 pt-4 border-t border-base-300 flex justify-end gap-2">
              <button v-if="isEditing" type="button" class="btn btn-ghost" @click="resetForm()">{{ t('cancel') }}</button>
              <button type="submit" class="btn btn-primary capitalize">{{ t('save') }} {{ getLabel('${groupName}', '${groupName}') }}</button>
            </div>
          </form>
        </div>
      </div>`;
    } else {
      // Fallback to the original logic for all other groups
      drawerContentHtml = `
      <div class="container mx-auto p-4 max-w-7xl">
        <div class="bg-base-200 p-6 rounded-box shadow-sm mb-10">
          <form @submit.prevent="save">
            <div class="grid grid-cols-1 gap-x-6">
              ${formFields}
            </div>
          </form>
        </div>
      </div>`;
    }

    // 5. Final Component Assembly
    const vueTemplate = `
<template>
  <div class="drawer drawer-end ${groupName}-crud">
    <input id="drawer-${groupName}" type="checkbox" class="drawer-toggle" v-model="isDrawerOpen" />
    
    <div class="drawer-content">
      ${drawerContentHtml}
    </div>

    <div class="drawer-side z-[100]">
      <label for="drawer-${groupName}" aria-label="close sidebar" class="drawer-overlay"></label>
      <div class="w-full max-w-lg min-h-full bg-base-100 flex flex-col pointer-events-auto">
        <div class="flex-1 overflow-y-auto p-6">
          <div class="flex items-start justify-between mb-6 pb-4 border-b border-base-200">
            <div class="flex items-center">
              <h2 class="text-2xl font-bold">{{ currentLocale === 'de' ? (getLabel(activeDrawerField, activeDrawerField.split('.').slice(-1)[0]) + ' ' + (drawerEditIndex > -1 ? t('edit') : t('add'))) : ((drawerEditIndex > -1 ? t('edit') : t('add')) + ' ' + getLabel(activeDrawerField, activeDrawerField.split('.').slice(-1)[0])) }}</h2>
              <div class="tooltip tooltip-bottom ml-4" :data-tip="t('addtemplate')" v-if="['contacts', 'references', 'temporal', 'spatial'].includes(activeDrawerField.split('.').slice(-1)[0] )">
                <button class="btn btn-square btn-ghost btn-sm btn-transparent" @click.prevent="openAddTemplateModal(activeDrawerField.split('.').slice(-1)[0])">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                    <path d="M5 21v-16q0 -0.825 0.588 -1.413T7 3h6v2H7v12.95l5 -2.15 5 2.15v-6.95h2v10L12 18 5 21Zm2 -16h6 -6Zm10 4v-2h-2v-2h2v-2h2v2h2v2h-2v2h-2Z" />
                  </svg>
                </button>
              </div>
              <div class="tooltip tooltip-bottom ml-2" :data-tip="t('template')" v-if="['contacts', 'references', 'temporal', 'spatial'].includes(activeDrawerField.split('.').slice(-1)[0] )">
                <button class="btn btn-square btn-ghost btn-sm btn-transparent" @click.prevent="openTemplateModal(activeDrawerField.split('.').slice(-1)[0])">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                    <path d="M4 22v-14q0 -0.825 0.588 -1.413T6 6h8q0.825 0 1.413 0.588T16 8v14L10 19 4 22Zm2 -3.025 4 -2.15 4 2.15v-10.975H6v10.975Zm12 -0.975v-14H7v-2h11q0.825 0 1.413 0.588T20 4v14h-2ZM6 8h8 -8Z" />
                  </svg>
                </button>
              </div>
            </div>
            <label for="drawer-${groupName}" class="btn btn-circle btn-ghost btn-sm drawer-overlay">✕</label>
          </div>
          <form @submit.prevent="saveDrawer" class="space-y-4">
            ${drawerContents}
            <div class="mt-8 pt-4">
              <button type="submit" class="btn btn-primary w-full">{{ t('saveToList') }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <dialog ref="templateModal" class="modal">
    <div class="modal-box max-w-md">
      <h3 class="font-bold text-lg mb-6">{{ currentLocale === 'de' ? 'Vorlage wählen' : 'Choose a Template' }}</h3>
      <form method="dialog" class="flex flex-col gap-3">
        <div v-for="(tpl, idx) in templates[activeTemplateField] || []" :key="idx" class="join w-full">
          <button class="btn btn-outline justify-start font-normal flex-1 join-item"
            @click="applyTemplate(tpl.data)">
            {{ tpl.name }}
          </button>
          <button class="btn btn-outline btn-error join-item"
            @click.prevent="confirmDeleteTemplate(activeTemplateField, idx)">
            <svg class="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        <div v-if="!(templates[activeTemplateField] && templates[activeTemplateField].length > 0)"
          class="text-sm italic opacity-50 py-4">{{ t('noItems') }}</div>
      </form>
      <div class="divider my-6">{{ t('or') }}</div>
      <div class="modal-action w-full mt-0">
        <form method="dialog" class="w-full">
          <button class="btn btn-primary w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-1">
              <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
            </svg>
            {{ t('customEdit') }}
          </button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop"><button>close</button></form>
  </dialog>
  <dialog ref="addTemplateModal" class="modal">
    <div class="modal-box max-w-md">
      <h3 class="font-bold text-lg mb-6">{{ t('addtemplate') }}</h3>
      <div class="flex flex-col gap-4">
        <input type="text" v-model="newTemplateName" :placeholder="t('templateName')" class="input input-bordered w-full" />
        <div class="modal-action mt-2 w-full">
          <form method="dialog" class="w-full">
            <button class="btn btn-primary w-full" @click="addTemplate()" :disabled="!newTemplateName">{{ t('addtemplate') }}</button>
          </form>
        </div>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop"><button>close</button></form>
  </dialog>
  <dialog ref="deleteTemplateModal" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">{{ t('deleteTemplatePrompt') }}</h3>
      <p class="py-4">{{ t('deleteTemplateDesc') }}</p>
      <div class="modal-action">
        <form method="dialog" class="flex gap-2">
          <button class="btn btn-ghost">{{ t('cancel') }}</button>
          <button class="btn btn-error" @click="executeDeleteTemplate">{{ t('del') }}</button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop"><button>close</button></form>
  </dialog>
</template>

<script setup>
import { ref, reactive, inject, shallowRef, onMounted } from 'vue';
import { load } from '@tauri-apps/plugin-store';
import SkosmosAutocomplete from '../components/SkosmosAutocomplete.vue';

const currentLocale = inject('currentLocale', ref('en'));
const fieldLabels = ${labelsMapString};
const inlineEditing = reactive({});

// UI Translations Dictionary
const uiTranslations = {
  en: {
    add: 'Add', addItem: '+ Add Item', edit: 'Edit', del: 'Del',
    deletePrompt: 'Are you sure you want to delete this record?',
    deleteEntryPrompt: 'Delete this entry?', actions: 'Actions',
    value: 'Value', noItems: 'No items added yet.', select: 'Select',
    saveToList: 'Add', saved: 'Saved', cancel: 'Cancel',
    save: 'Save', items: 'items',
    languageTip: '💡 Tip: Click a flag to select/deselect a language. Click the star icon to set it as the preferred language.',
    validationHint: 'Enter valid value',
    validationEmail: 'Enter valid email address',
    addtemplate: 'Add Template', template: 'Use Template', templateName: 'Template Name', or: 'OR', customEdit: 'Custom Edit', deleteTemplatePrompt: 'Delete Template?', deleteTemplateDesc: 'Are you sure you want to delete this template?'
  },
  de: {
    add: 'hinzufügen', addItem: '+ Element hinzufügen', edit: 'bearbeiten', del: 'Löschen',
    deletePrompt: 'Möchten Sie diesen Datensatz wirklich löschen?',
    deleteEntryPrompt: 'Diesen Eintrag löschen?', actions: 'Aktionen',
    value: 'Wert', noItems: 'Noch keine Elemente hinzugefügt.', select: 'auswählen',
    saveToList: 'Hinzufügen', saved: 'Gespeicherte', cancel: 'Abbrechen',
    save: 'speichern', items: 'Elemente',
    languageTip: '💡 Tipp: Klicken Sie auf eine Flagge, um eine Sprache auszuwählen/abzuwählen. Klicken Sie auf das Sternsymbol, um sie als bevorzugte Sprache festzulegen.',
    validationHint: 'Geben Sie einen gültigen Wert ein',
    validationEmail: 'Geben Sie eine gültige E-Mail-Adresse ein',
    addtemplate: 'Vorlage erstellen', template: 'Vorlage nutzen', templateName: 'Name der Vorlage', or: 'ODER', customEdit: 'Manuell bearbeiten', deleteTemplatePrompt: 'Vorlage löschen?', deleteTemplateDesc: 'Sind Sie sicher, dass Sie diese Vorlage löschen möchten?'
  }
};

const t = (key) => uiTranslations[currentLocale.value]?.[key] || uiTranslations.en[key];

const getLabel = (path, fallback, type = 'name') => {
  const lang = currentLocale.value === 'de' ? 'de' : 'en';
  if (type === 'doc') {
    return fieldLabels[path]?.[lang === 'de' ? 'docDe' : 'docEn'] || fallback;
  }
  if (type === 'plac') {
    return fieldLabels[path]?.[lang === 'de' ? 'placDe' : 'placEn'] || fallback;
  }
  return fieldLabels[path]?.[lang] || fallback;
};
const today = new Date();
const maxDate = \`\${new Date().getFullYear()}-\${String(new Date().getMonth() + 1).padStart(2, '0')}-\${String(new Date().getDate()).padStart(2, '0')}\`;

const items = ref([]);
const isEditing = ref(false);
const editIndex = ref(null);
const form = reactive({ ${reactiveState} });

// Language Selection Helpers
const toggleLang = (fieldPath, code, isDrawer = false) => {
  const targetForm = isDrawer ? drawerForm : form;
  if (!targetForm[fieldPath]) targetForm[fieldPath] = [];
  const arr = targetForm[fieldPath];
  const idx = arr.indexOf(code);
  if (idx === -1) {
    arr.push(code);
  } else {
    arr.splice(idx, 1);
  }
};

const preferredLanguages = reactive({});
const setPreferredLang = (fieldPath, target, isDrawer = false) => {
  const targetForm = isDrawer ? drawerForm : form;
  if (!targetForm[fieldPath] || !Array.isArray(targetForm[fieldPath])) return;
  const arr = targetForm[fieldPath];

  const getPrefKey = (obj) => {
    return Object.keys(obj).find((k) => k === 'preferred' || k === '#preferred' || k.endsWith('#preferred')) || fieldPath + '#preferred';
  };

  const getLangKey = (obj) => {
    return Object.keys(obj).find((k) => k === 'lang' || k === '#lang' || k.endsWith('#lang')) || fieldPath + '#lang';
  };

  if (typeof target === 'string') {
    preferredLanguages[fieldPath] = target;
    const isStringArray = arr.length > 0 && typeof arr[0] === 'string';
    if (isStringArray && !arr.includes(target)) {
      arr.push(target);
    }
  }

  arr.forEach((item, idx) => {
    if (typeof item === 'object' && item !== null) {
      const prefKey = getPrefKey(item);
      const langKey = getLangKey(item);

      let isMatch = false;
      if (typeof target === 'number') {
        isMatch = (idx === target);
      } else if (typeof target === 'object' && target !== null) {
        isMatch = (item === target);
      } else if (typeof target === 'string') {
        isMatch = (item[langKey] === target || item['_value'] === target);
      }

      item[prefKey] = isMatch;
    }
  });
};

// Drawer State
const isDrawerOpen = ref(false);
const activeDrawerField = ref('');
const drawerEditIndex = ref(-1);
const drawerForm = reactive({});

// --- Template State and Logic ---
const store = shallowRef(null);
const templates = ref({});
const activeTemplateField = ref('');
const templateModal = ref(null);
const addTemplateModal = ref(null);
const deleteTemplateModal = ref(null);
const templateToDelete = ref(null);
const newTemplateName = ref('');

onMounted(async () => {
  try {
    store.value = await load('templates.json', { autoSave: true });
    for (const f of ['contacts', 'references', 'temporal', 'spatial']) {
      templates.value[f] = await store.value.get(f) || [];
    }
  } catch (error) {
    console.error('Error loading templates store:', error);
  }
});

const openTemplateModal = (field) => {
  activeTemplateField.value = field;
  templateModal.value?.showModal();
};

const openAddTemplateModal = (field) => {
  activeTemplateField.value = field;
  newTemplateName.value = '';
  addTemplateModal.value?.showModal();
};

const addTemplate = async () => {
  if (!store.value || !activeTemplateField.value || !newTemplateName.value) return;
  const tplName = newTemplateName.value;
  const field = activeTemplateField.value;
  
  if (!templates.value[field]) templates.value[field] = [];
  
  templates.value[field].push({
    name: tplName,
    data: JSON.parse(JSON.stringify(drawerForm))
  });
  
  await store.value.set(field, JSON.parse(JSON.stringify(templates.value[field])));
  await store.value.save();
  addTemplateModal.value?.close();
};

const applyTemplate = (templateData) => {
  // Clear out the current drawer form first
  Object.keys(drawerForm).forEach(k => delete drawerForm[k]);
  // Apply the template data
  Object.assign(drawerForm, JSON.parse(JSON.stringify(templateData)));
  templateModal.value?.close();
};

const confirmDeleteTemplate = (field, idx) => {
  templateToDelete.value = { field, idx };
  deleteTemplateModal.value?.showModal();
};

const executeDeleteTemplate = async () => {
  if (templateToDelete.value && store.value) {
    const { field, idx } = templateToDelete.value;
    templates.value[field].splice(idx, 1);
    await store.value.set(field, JSON.parse(JSON.stringify(templates.value[field])));
    await store.value.save();
    templateToDelete.value = null;
  }
};
// --------------------------------

const openDrawer = (field, index = -1) => {
  activeDrawerField.value = field;
  drawerEditIndex.value = index;
  Object.keys(drawerForm).forEach(k => delete drawerForm[k]); // clear state
  
  if (index > -1) {
    const item = form[field][index];
    if (typeof item === 'object' && item !== null) {
      Object.assign(drawerForm, JSON.parse(JSON.stringify(item)));
      // Populate preferred languages for drawer fields
      Object.keys(drawerForm).forEach(k => {
        if (k.endsWith('language') && Array.isArray(drawerForm[k])) {
          preferredLanguages[field + '.' + k] = drawerForm[k][0] || '';
        }
      });
    } else {
      drawerForm['_value'] = item;
    }
  }
  isDrawerOpen.value = true;
};

const closeDrawer = () => { isDrawerOpen.value = false; };

const saveDrawer = () => {
  const field = activeDrawerField.value;
  if (!form[field]) form[field] = [];

  const isPrimitive = drawerForm.hasOwnProperty('_value') && Object.keys(drawerForm).length === 1;
  const dataToSave = isPrimitive ? drawerForm['_value'] : JSON.parse(JSON.stringify(drawerForm));

  if (drawerEditIndex.value > -1) form[field][drawerEditIndex.value] = dataToSave;
  else form[field].push(dataToSave);
  
  closeDrawer();
};

const removeDrawerItem = (field, index) => {
  if (confirm(t('deleteEntryPrompt'))) form[field].splice(index, 1);
};

const save = () => {
  if (isEditing.value) items.value[editIndex.value] = JSON.parse(JSON.stringify(form));
  else items.value.push(JSON.parse(JSON.stringify(form)));
  resetForm();
};

const edit = (index) => {
  isEditing.value = true;
  editIndex.value = index;
  Object.assign(form, JSON.parse(JSON.stringify(items.value[index])));
  // Populate preferred languages
  Object.keys(form).forEach(k => {
    if (k.endsWith('language') && Array.isArray(form[k])) {
      preferredLanguages[k] = form[k][0] || '';
    }
  });
};

const remove = (index) => {
  if(confirm(t('deletePrompt'))) {
    items.value.splice(index, 1);
    if (isEditing.value && editIndex.value === index) resetForm();
  }
};

const resetForm = () => {
  Object.keys(form).forEach(key => {
    if (Array.isArray(form[key])) {
      if (form[key].length > 0 && typeof form[key][0] === 'object' && form[key][0] !== null && (key + '#preferred') in form[key][0]) {
        form[key] = [{ _value: '', [key + '#lang']: 'en', [key + '#preferred']: true }];
      } else {
        form[key] = [];
      }
    } else {
      form[key] = '';
    }
  });
  isEditing.value = false;
  editIndex.value = null;
  Object.keys(preferredLanguages).forEach(k => delete preferredLanguages[k]);
};
defineExpose({ items, form });
</script>
`;

    vueComponents[groupName] = vueTemplate
      .replace(/<\/script>/g, "</script>")
      .trim();
  });

  return vueComponents;
}

// Execution
const outputDir = path.join(process.cwd(), "src/output_components");
const schemaPath = path.join(process.cwd(), "src/assets/schema_dictionary.json");
const enumerationsPath = path.join(process.cwd(), "src/assets/enumerations.json");

let schemaDictionary = {};
if (fs.existsSync(schemaPath)) {
  try {
    schemaDictionary = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
    console.log("Loaded schema_dictionary.json for UI generation.");
  } catch (err) {
    console.error("Error reading schema_dictionary.json:", err.message);
    process.exit(1);
  }
} else {
  console.error("schema_dictionary.json not found. Exiting...");
  process.exit(1);
}
let enumerationsDictionary = {};
if (fs.existsSync(enumerationsPath)) {
  try {
    enumerationsDictionary = JSON.parse(fs.readFileSync(enumerationsPath, "utf8"));
    console.log("Loaded enumerations.json for UI generation.");
  } catch (err) {
    console.error("Error reading enumerations.json:", err.message);
    process.exit(1);
  }
} else {
  console.error("enumerations.json not found. Exiting...");
  process.exit(1);
}

const generatedFiles = generateVueCRUD(schemaDictionary, enumerationsDictionary);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

Object.entries(generatedFiles).forEach(([name, content]) => {
  const fileName = `${name.charAt(0).toUpperCase() + name.slice(1)}Crud.vue`;
  fs.writeFileSync(path.join(outputDir, fileName), content, "utf8");
  console.log(`✅ Generated: ${fileName}`);
});

console.log("\n🎉 Done!");
