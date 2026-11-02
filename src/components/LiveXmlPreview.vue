<template>
  <div class="border border-base-300 bg-base-100 rounded-2xl shadow-md overflow-hidden flex flex-col">
    <!-- Top Header Bar -->
    <div class="p-3 bg-base-100 border-b border-base-200 flex items-center justify-between gap-2">
      <div class="flex items-center gap-2 min-w-0">
        <div class="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shadow-xs shrink-0">
          💻
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-1.5 flex-wrap">
            <h3 class="font-bold text-xs leading-tight truncate text-base-content/90">
              {{ currentLocale === 'de' ? 'CARARE 2.0.6 XML-Vorschau' : 'CARARE 2.0.6 XML Preview' }}
            </h3>
            <span class="badge badge-success badge-xs font-mono font-bold">
              ✓ CARARE 2.0.6
            </span>
          </div>
          <p class="text-[10px] text-base-content/50 truncate">
            {{ currentLocale === 'de'
              ? 'Direktsprung zu den Ressourcen im XML-Dokument'
              : 'Direct jump to resources in XML document' }}
          </p>
        </div>
      </div>

      <!-- Close / Hide button directly in XML inspector header -->
      <button
        type="button"
        class="btn btn-xs btn-ghost btn-circle text-base-content/60 hover:text-base-content"
        @click="$emit('close')"
        :title="currentLocale === 'de' ? 'XML-Vorschau schließen' : 'Close XML preview'"
      >
        ✕
      </button>
    </div>

    <!-- Direct Jump Bar: Clean Category Grouped Navigation (Single Row, No Clutter) -->
    <div
      v-if="hasXmlContent && detectedResources.length > 0"
      class="px-3 py-1.5 bg-base-200/50 border-b border-base-200 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0"
    >
      <span class="text-[10px] font-bold text-base-content/60 uppercase tracking-wider shrink-0 mr-0.5">
        {{ currentLocale === 'de' ? 'Ressourcen:' : 'Resources:' }}
      </span>

      <!-- 1. Collection -->
      <button
        v-if="groupedResources.collection.length > 0"
        type="button"
        class="btn btn-xs rounded-lg gap-1 font-mono text-[11px] shrink-0 transition-all shadow-2xs"
        :class="activeResourceKey === groupedResources.collection[0].key
          ? 'btn-primary font-bold shadow-sm'
          : 'btn-ghost border border-base-300 hover:border-primary/60 hover:bg-base-200'"
        @click="jumpToResource(groupedResources.collection[0])"
        :title="groupedResources.collection[0].fullId || 'Collection'"
      >
        <span>📂</span>
        <span>{{ currentLocale === 'de' ? 'Sammlung' : 'Collection' }}</span>
        <span v-if="groupedResources.collection[0].id" class="badge badge-xs font-mono opacity-85">
          {{ groupedResources.collection[0].id }}
        </span>
      </button>

      <!-- 2. Heritage Assets -->
      <div v-if="groupedResources.heritageAsset.length > 0" class="flex items-center shrink-0">
        <button
          v-if="groupedResources.heritageAsset.length === 1"
          type="button"
          class="btn btn-xs rounded-lg gap-1 font-mono text-[11px] transition-all shadow-2xs"
          :class="activeResourceKey === groupedResources.heritageAsset[0].key
            ? 'btn-primary font-bold shadow-sm'
            : 'btn-ghost border border-base-300 hover:border-primary/60 hover:bg-base-200'"
          @click="jumpToResource(groupedResources.heritageAsset[0])"
        >
          <span>🏛️</span>
          <span>{{ currentLocale === 'de' ? 'Kulturgut' : 'Asset' }}</span>
          <span class="badge badge-xs font-mono opacity-85">{{ groupedResources.heritageAsset[0].id }}</span>
        </button>

        <div v-else class="flex items-center bg-base-100 rounded-lg border border-base-300 px-1.5 py-0.5 shadow-2xs">
          <span class="text-xs mr-1">🏛️</span>
          <select
            class="select select-xs select-ghost font-mono text-[11px] font-semibold py-0 h-5 min-h-5 leading-none focus:outline-none cursor-pointer pr-5"
            @change="onSelectGroupResource($event)"
          >
            <option disabled :selected="!groupedResources.heritageAsset.some(r => r.key === activeResourceKey)">
              {{ currentLocale === 'de' ? `🏛️ Kulturgüter (${groupedResources.heritageAsset.length}) ▾` : `🏛️ Heritage Assets (${groupedResources.heritageAsset.length}) ▾` }}
            </option>
            <option
              v-for="res in groupedResources.heritageAsset"
              :key="res.key"
              :value="res.key"
              :selected="activeResourceKey === res.key"
            >
              {{ res.id }}
            </option>
          </select>
        </div>
      </div>

      <!-- 3. Digital Resources (3D Models) -->
      <div v-if="groupedResources.digitalResource.length > 0" class="flex items-center shrink-0">
        <button
          v-if="groupedResources.digitalResource.length === 1"
          type="button"
          class="btn btn-xs rounded-lg gap-1 font-mono text-[11px] transition-all shadow-2xs"
          :class="activeResourceKey === groupedResources.digitalResource[0].key
            ? 'btn-primary font-bold shadow-sm'
            : 'btn-ghost border border-base-300 hover:border-primary/60 hover:bg-base-200'"
          @click="jumpToResource(groupedResources.digitalResource[0])"
        >
          <span>💻</span>
          <span>{{ currentLocale === 'de' ? 'Digitalisat' : 'Resource' }}</span>
          <span class="badge badge-xs font-mono opacity-85">{{ groupedResources.digitalResource[0].id }}</span>
        </button>

        <div v-else class="flex items-center bg-base-100 rounded-lg border border-base-300 px-1.5 py-0.5 shadow-2xs">
          <span class="text-xs mr-1">💻</span>
          <select
            class="select select-xs select-ghost font-mono text-[11px] font-semibold py-0 h-5 min-h-5 leading-none focus:outline-none cursor-pointer pr-5"
            @change="onSelectGroupResource($event)"
          >
            <option disabled :selected="!groupedResources.digitalResource.some(r => r.key === activeResourceKey)">
              {{ currentLocale === 'de' ? `💻 3D-Digitalisate (${groupedResources.digitalResource.length}) ▾` : `💻 3D Resources (${groupedResources.digitalResource.length}) ▾` }}
            </option>
            <option
              v-for="res in groupedResources.digitalResource"
              :key="res.key"
              :value="res.key"
              :selected="activeResourceKey === res.key"
            >
              {{ res.id }}
            </option>
          </select>
        </div>
      </div>

      <!-- 4. Activities (DAP) -->
      <div v-if="groupedResources.activity.length > 0" class="flex items-center shrink-0">
        <button
          v-if="groupedResources.activity.length === 1"
          type="button"
          class="btn btn-xs rounded-lg gap-1 font-mono text-[11px] transition-all shadow-2xs"
          :class="activeResourceKey === groupedResources.activity[0].key
            ? 'btn-primary font-bold shadow-sm'
            : 'btn-ghost border border-base-300 hover:border-primary/60 hover:bg-base-200'"
          @click="jumpToResource(groupedResources.activity[0])"
        >
          <span>⚡</span>
          <span>{{ currentLocale === 'de' ? 'Aktivität' : 'Activity' }}</span>
          <span class="badge badge-xs font-mono opacity-85">{{ groupedResources.activity[0].id }}</span>
        </button>

        <div v-else class="flex items-center bg-base-100 rounded-lg border border-base-300 px-1.5 py-0.5 shadow-2xs">
          <span class="text-xs mr-1">⚡</span>
          <select
            class="select select-xs select-ghost font-mono text-[11px] font-semibold py-0 h-5 min-h-5 leading-none focus:outline-none cursor-pointer pr-5"
            @change="onSelectGroupResource($event)"
          >
            <option disabled :selected="!groupedResources.activity.some(r => r.key === activeResourceKey)">
              {{ currentLocale === 'de' ? `⚡ DAP-Aktivitäten (${groupedResources.activity.length}) ▾` : `⚡ DAP Activities (${groupedResources.activity.length}) ▾` }}
            </option>
            <option
              v-for="res in groupedResources.activity"
              :key="res.key"
              :value="res.key"
              :selected="activeResourceKey === res.key"
            >
              {{ res.id }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Clean Empty State when XML is empty on fresh start/restart -->
    <div
      v-if="!hasXmlContent"
      class="p-10 text-center text-base-content/40 flex flex-col items-center justify-center min-h-[360px]"
    >
      <div class="text-4xl mb-3 opacity-60">📄</div>
      <p class="font-bold text-sm text-base-content/70">
        {{ currentLocale === 'de' ? 'Keine XML-Daten vorhanden' : 'No XML data yet' }}
      </p>
      <p class="text-xs text-base-content/50 mt-1 max-w-xs text-center leading-normal">
        {{ currentLocale === 'de'
          ? 'Geben Sie Formulardaten ein oder laden Sie eine CARARE-Datei, um die Live-XML-Vorschau zu aktivieren.'
          : 'Enter metadata or load a CARARE file to view the live XML preview.' }}
      </p>
    </div>

    <!-- Light Clean Code Container when XML exists -->
    <div
      v-else
      ref="codeScrollContainer"
      class="bg-slate-50 text-slate-800 dark:bg-[#0f172a] dark:text-[#e2e8f0] font-mono text-[11.5px] overflow-y-auto select-text leading-relaxed border-t border-base-200"
      :class="sideBySide ? 'max-h-[calc(100vh-16.5rem)] min-h-[460px]' : 'max-h-[640px]'"
    >
      <table class="w-full border-collapse table-fixed">
        <colgroup>
          <col class="w-11" />
          <col />
        </colgroup>
        <tbody>
          <tr
            v-for="item in xmlLines"
            :key="item.lineNumber"
            :data-xml-line="item.lineNumber"
            @click="onLineClick(item)"
            class="cursor-pointer transition-colors duration-150 group"
            :class="getRowClasses(item)"
            :title="currentLocale === 'de' ? 'Klicken, um zum zugehörigen Formularfeld zu springen' : 'Click to jump to form field'"
          >
            <td
              class="select-none text-right pr-2 pl-1 py-0.5 text-[10px] border-r border-slate-200 dark:border-slate-800 align-top transition-colors font-mono"
              :class="isLineInActiveRange(item.lineNumber)
                ? 'text-amber-700 dark:text-amber-300 font-bold bg-amber-500/20 border-r-amber-400'
                : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'"
            >
              {{ item.lineNumber }}
            </td>
            <td
              class="pl-2.5 pr-2.5 py-0.5 font-mono text-[11px] align-top break-words [overflow-wrap:anywhere] whitespace-pre-wrap"
              v-html="item.highlightedHtml"
            ></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';

const props = defineProps({
  carareXml: {
    type: String,
    default: ''
  },
  currentLocale: {
    type: String,
    default: 'de'
  },
  highlightedTarget: {
    type: Object,
    default: null
  },
  sideBySide: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['xml-line-click', 'close']);

const codeScrollContainer = ref(null);
const activeLineRange = ref(null);
const activeResourceKey = ref(null);

const activeXmlString = computed(() => {
  return (props.carareXml || '').trim();
});

const hasXmlContent = computed(() => {
  return activeXmlString.value.length > 0;
});

const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const highlightXmlLine = (line) => {
  const trimmed = line.trim();
  if (trimmed.startsWith('<?xml')) {
    return `<span class="text-amber-600 dark:text-amber-300 font-semibold">${escapeHtml(line)}</span>`;
  }
  if (trimmed.startsWith('<!--')) {
    return `<span class="text-slate-400 dark:text-slate-500 italic">${escapeHtml(line)}</span>`;
  }

  return line.replace(/(<!--[\s\S]*?-->|<\/?[^>]+>)/g, (match) => {
    if (match.startsWith('<!--')) {
      return `<span class="text-slate-400 dark:text-slate-500 italic">${escapeHtml(match)}</span>`;
    }
    const tagMatch = match.match(/^<(\/?)([\w:.-]+)([\s\S]*?)(\/?)>$/);
    if (!tagMatch) {
      return escapeHtml(match);
    }
    const [, slashOpen, tagName, attrPart, slashClose] = tagMatch;
    const tagColorClass = 'text-sky-600 dark:text-sky-400 font-semibold';

    const highlightedAttrs = attrPart.replace(
      /([\w:.-]+)(\s*=\s*)("[^"]*"|'[^']*')/g,
      (_, attrName, eq, attrVal) =>
        `<span class="text-amber-600 dark:text-amber-300">${escapeHtml(attrName)}</span><span class="text-slate-400">${escapeHtml(eq)}</span><span class="text-emerald-600 dark:text-emerald-300">${escapeHtml(attrVal)}</span>`
    );

    return `<span class="text-slate-400">&lt;${slashOpen}</span><span class="${tagColorClass}">${escapeHtml(tagName)}</span>${highlightedAttrs}<span class="text-slate-400">${slashClose}&gt;</span>`;
  });
};

const xmlLines = computed(() => {
  if (!hasXmlContent.value) return [];
  const rawLines = activeXmlString.value.split(/\r?\n/);
  return rawLines.map((raw, idx) => ({
    lineNumber: idx + 1,
    raw,
    highlightedHtml: highlightXmlLine(raw)
  }));
});

// Detect all distinct resources in the XML (Collection, Heritage Asset, Digital Resource, Activity)
const detectedResources = computed(() => {
  if (!hasXmlContent.value) return [];

  const lines = xmlLines.value;
  const list = [];
  const seenKeys = new Set();

  for (let idx = 0; idx < lines.length; idx++) {
    const rawLine = lines[idx].raw;
    const lineNum = lines[idx].lineNumber;

    let type = null;
    let icon = '';
    let labelDe = '';
    let labelEn = '';

    if (/<collectionInformation\b/.test(rawLine)) {
      type = 'collectionInformation';
      icon = '📂';
      labelDe = 'Sammlung';
      labelEn = 'Collection';
    } else if (/<heritageAssetIdentification\b/.test(rawLine)) {
      type = 'heritageAssetIdentification';
      icon = '🏛️';
      labelDe = 'Kulturgut';
      labelEn = 'Heritage Asset';
    } else if (/<digitalResource\b/.test(rawLine)) {
      type = 'digitalResource';
      icon = '💻';
      labelDe = 'Digitalisat';
      labelEn = 'Digital Resource';
    } else if (/<activity\b/.test(rawLine)) {
      type = 'activity';
      icon = '⚡';
      labelDe = 'Aktivität';
      labelEn = 'Activity';
    }

    if (type) {
      const maxPeek = Math.min(lines.length, idx + 45);
      let snippet = '';
      for (let j = idx; j < maxPeek; j++) {
        snippet += lines[j].raw + '\n';
        if (new RegExp(`</${type}\\s*>`).test(lines[j].raw)) break;
      }

      let id = '';
      const idMatch = snippet.match(/<id[^>]*>([^<]+)<\/id>/);
      const nameMatch = snippet.match(/<name[^>]*>([^<]+)<\/name>/);
      const titleMatch = snippet.match(/<title[^>]*>([^<]+)<\/title>/);

      if (idMatch && idMatch[1]?.trim()) {
        id = idMatch[1].trim();
      } else if (nameMatch && nameMatch[1]?.trim()) {
        id = nameMatch[1].trim();
      } else if (titleMatch && titleMatch[1]?.trim()) {
        id = titleMatch[1].trim();
      }

      // Deduplicate all distinct resource entities
      const dedupeKey = `${type}-${id || lineNum}`;
      if (seenKeys.has(dedupeKey)) {
        continue;
      }
      seenKeys.add(dedupeKey);

      const displayId = id.length > 22 ? id.substring(0, 20) + '…' : id;

      list.push({
        key: `${type}-${lineNum}`,
        type,
        icon,
        typeLabel: props.currentLocale === 'de' ? labelDe : labelEn,
        id: displayId,
        fullId: id,
        lineNumber: lineNum
      });
    }
  }

  return list;
});

const groupedResources = computed(() => {
  const groups = {
    collection: [],
    heritageAsset: [],
    digitalResource: [],
    activity: []
  };

  detectedResources.value.forEach(res => {
    if (res.type === 'collectionInformation') groups.collection.push(res);
    else if (res.type === 'heritageAssetIdentification') groups.heritageAsset.push(res);
    else if (res.type === 'digitalResource') groups.digitalResource.push(res);
    else if (res.type === 'activity') groups.activity.push(res);
  });

  return groups;
});

const onSelectGroupResource = (event) => {
  const selectedKey = event.target.value;
  const target = detectedResources.value.find(r => r.key === selectedKey);
  if (target) {
    jumpToResource(target);
  }
};

const scrollToLineNumber = (lineNum, forceScroll = false) => {
  nextTick(() => {
    const container = codeScrollContainer.value;
    if (!container) return;
    const rowEl = container.querySelector(`[data-xml-line="${lineNum}"]`);
    if (!rowEl) return;

    if (!forceScroll) {
      const cRect = container.getBoundingClientRect();
      const rRect = rowEl.getBoundingClientRect();
      if (rRect.top >= cRect.top + 20 && rRect.bottom <= cRect.bottom - 20) {
        return; // Already comfortably in view
      }
    }

    rowEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
};

const jumpToResource = (res) => {
  activeResourceKey.value = res.key;
  activeLineRange.value = {
    start: res.lineNumber,
    end: res.lineNumber + 4,
    tagName: res.type,
    sectionTag: res.type
  };
  scrollToLineNumber(res.lineNumber, true);

  emit('xml-line-click', {
    sectionTag: res.type,
    tagName: res.type,
    parentTag: 'carare',
    rawLine: xmlLines.value[res.lineNumber - 1]?.raw || '',
    blockText: '',
    lineNumber: res.lineNumber
  });
};

const isLineInActiveRange = (lineNumber) => {
  if (!activeLineRange.value) return false;
  return lineNumber >= activeLineRange.value.start && lineNumber <= activeLineRange.value.end;
};

const getRowClasses = (item) => {
  if (isLineInActiveRange(item.lineNumber)) {
    return 'bg-amber-100 dark:bg-amber-500/25 border-l-4 border-amber-500 shadow-xs';
  }
  return 'hover:bg-slate-100 dark:hover:bg-slate-800/70';
};

const TOP_SECTIONS = ['collectionInformation', 'heritageAssetIdentification', 'digitalResource', 'activity'];

const findTagBlocksInRange = (lines, tag, minLine, maxLine) => {
  const blocks = [];
  const openRegex = new RegExp(`<${tag}(\\s|>|/)`);
  const closeRegex = new RegExp(`</${tag}\\s*>`);
  const selfCloseRegex = new RegExp(`<${tag}[^>]*/>`);

  let i = minLine;
  while (i <= maxLine) {
    const raw = lines[i - 1]?.raw || '';
    if (openRegex.test(raw)) {
      const start = i;
      if (selfCloseRegex.test(raw) || closeRegex.test(raw)) {
        blocks.push({ start, end: start, text: raw, tagName: tag });
        i++;
        continue;
      }
      let depth = 0;
      let end = start;
      const textParts = [];
      for (let j = start; j <= maxLine; j++) {
        const lRaw = lines[j - 1]?.raw || '';
        textParts.push(lRaw);
        if (openRegex.test(lRaw) && !selfCloseRegex.test(lRaw)) depth++;
        if (closeRegex.test(lRaw)) {
          depth--;
          if (depth <= 0) {
            end = j;
            break;
          }
        }
      }
      blocks.push({ start, end, text: textParts.join('\n'), tagName: tag });
      i = end + 1;
    } else {
      i++;
    }
  }
  return blocks;
};

const getSectionLineBounds = (lines, sectionTag) => {
  if (!sectionTag || !TOP_SECTIONS.includes(sectionTag)) {
    return { minLine: 1, maxLine: lines.length };
  }
  const blocks = findTagBlocksInRange(lines, sectionTag, 1, lines.length);
  if (blocks.length > 0) {
    return { minLine: blocks[0].start, maxLine: blocks[0].end };
  }
  return { minLine: 1, maxLine: lines.length };
};

const detectSectionForLine = (lines, lineNumber) => {
  for (const sec of TOP_SECTIONS) {
    const blocks = findTagBlocksInRange(lines, sec, 1, lines.length);
    for (const b of blocks) {
      if (lineNumber >= b.start && lineNumber <= b.end) {
        return sec;
      }
    }
  }
  return '';
};

const detectParentTagForLine = (lines, lineNumber) => {
  const stack = [];
  for (let i = 1; i < lineNumber; i++) {
    const raw = (lines[i - 1]?.raw || '').trim();
    if (!raw || raw.startsWith('<?') || raw.startsWith('<!--')) continue;
    const openMatch = raw.match(/^<([\w:.-]+)(?:\s[^>]*)?>$/);
    const closeMatch = raw.match(/^<\/([\w:.-]+)\s*>$/);
    const singleLineMatch = raw.match(/^<([\w:.-]+)(?:\s[^>]*)?>.*<\/\1\s*>$/);
    const selfCloseMatch = raw.match(/^<([\w:.-]+)[^>]*\/>$/);
    if (singleLineMatch || selfCloseMatch) {
      continue;
    }
    if (openMatch) {
      stack.push({ tag: openMatch[1], line: i });
    } else if (closeMatch) {
      for (let s = stack.length - 1; s >= 0; s--) {
        if (stack[s].tag === closeMatch[1]) {
          stack.splice(s, 1);
          break;
        }
      }
    }
  }
  return stack.length > 0 ? stack[stack.length - 1].tag : '';
};

const jumpToXmlTag = (tagName, sectionTag = '', textHint = '', emitToForm = false) => {
  const lines = xmlLines.value;
  if (!lines.length) return;

  const { minLine, maxLine } = getSectionLineBounds(lines, sectionTag);

  let blocks = findTagBlocksInRange(lines, tagName, minLine, maxLine);
  if (blocks.length === 0 && (minLine > 1 || maxLine < lines.length)) {
    blocks = findTagBlocksInRange(lines, tagName, 1, lines.length);
  }

  let matchedBlock = null;
  if (blocks.length > 0) {
    if (textHint && textHint.trim()) {
      const needle = textHint.trim().toLowerCase();
      matchedBlock = blocks.find(b => b.text.toLowerCase().includes(needle)) || blocks[0];
    } else {
      matchedBlock = blocks[0];
    }
  } else if (sectionTag && TOP_SECTIONS.includes(sectionTag)) {
    const secBlocks = findTagBlocksInRange(lines, sectionTag, 1, lines.length);
    if (secBlocks.length > 0) {
      matchedBlock = {
        start: secBlocks[0].start,
        end: Math.min(secBlocks[0].start + 8, secBlocks[0].end),
        tagName: sectionTag,
        text: secBlocks[0].text
      };
    }
  }

  if (matchedBlock) {
    activeLineRange.value = {
      start: matchedBlock.start,
      end: matchedBlock.end,
      tagName: matchedBlock.tagName,
      sectionTag: sectionTag || detectSectionForLine(lines, matchedBlock.start)
    };
    scrollToLineNumber(matchedBlock.start, false);

    if (emitToForm) {
      emit('xml-line-click', {
        sectionTag: activeLineRange.value.sectionTag,
        tagName: matchedBlock.tagName,
        parentTag: detectParentTagForLine(lines, matchedBlock.start),
        rawLine: lines[matchedBlock.start - 1]?.raw || '',
        blockText: matchedBlock.text,
        lineNumber: matchedBlock.start
      });
    }
  }
};

watch(
  () => props.highlightedTarget,
  (target) => {
    if (!target || (!target.tagName && !target.sectionTag)) return;
    jumpToXmlTag(target.tagName || target.sectionTag, target.sectionTag, target.textHint, false);
  },
  { deep: true }
);

const onLineClick = (item) => {
  const lines = xmlLines.value;
  const lineNum = item.lineNumber;
  const raw = item.raw.trim();

  const tagMatch = raw.match(/<\/?([\w:.-]+)/);
  let clickedTag = tagMatch ? tagMatch[1] : '';
  if (!clickedTag || clickedTag === 'xml' || clickedTag === 'carare') {
    clickedTag = detectParentTagForLine(lines, lineNum) || 'collectionInformation';
  }

  const sectionTag = detectSectionForLine(lines, lineNum);
  const parentTag = detectParentTagForLine(lines, lineNum);

  const { minLine, maxLine } = getSectionLineBounds(lines, sectionTag);
  const blocks = findTagBlocksInRange(lines, clickedTag, minLine, maxLine);
  const enclosingBlock = blocks.find(b => lineNum >= b.start && lineNum <= b.end) || {
    start: lineNum,
    end: lineNum,
    tagName: clickedTag,
    text: item.raw
  };

  activeLineRange.value = {
    start: enclosingBlock.start,
    end: enclosingBlock.end,
    tagName: clickedTag,
    sectionTag
  };

  emit('xml-line-click', {
    sectionTag,
    tagName: clickedTag,
    parentTag,
    rawLine: item.raw,
    blockText: enclosingBlock.text,
    lineNumber: lineNum
  });
};
</script>
