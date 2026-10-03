<template>
  <div class="space-y-3 w-full">
    <!-- 1. Recently Used Monument Types (max 20) with 1-Click Select -->
    <div v-if="recentTerms && recentTerms.length > 0" class="bg-base-200/50 p-2.5 rounded-lg border border-base-300">
      <div class="flex items-center justify-between mb-1.5">
        <span class="text-xs font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ currentLocale === 'de' ? 'Zuletzt genutzte Monument-Typen (max. 20):' : 'Recently used monument types (max 20):' }}
        </span>
        <a href="https://vocabs.bcdh.uni-bonn.de/hector/de/page/heritage_asset" target="_blank" rel="noopener" class="text-xs link link-hover text-primary flex items-center gap-1 opacity-80 hover:opacity-100">
          HECTOR Kulturgut
          <svg xmlns="http://www.w3.org/2000/svg" class="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      <div class="flex flex-wrap gap-1 max-h-28 overflow-y-auto pr-1">
        <button
          v-for="chip in recentTerms"
          :key="chip.uri || chip.label"
          type="button"
          class="btn btn-xs normal-case font-normal border border-base-300 hover:border-primary hover:bg-primary/10 transition-colors"
          :class="isAlreadySelected(chip) ? 'btn-neutral opacity-50 cursor-default' : 'btn-ghost'"
          :disabled="isAlreadySelected(chip)"
          @click.prevent="addRecentTerm(chip)"
          :title="(chip.facet ? `[${chip.facet}] ` : '') + (chip.uri || chip.label)"
        >
          <span class="text-primary font-bold mr-0.5">+</span>
          <span>{{ chip.label }}</span>
          <span v-if="chip.facet" class="badge badge-ghost badge-xs opacity-60 text-[9px] ml-0.5">{{ chip.facet }}</span>
        </button>
      </div>
    </div>

    <!-- 2. Facet Quick-Filters for HECTOR Vocabulary -->
    <div class="flex flex-wrap items-center gap-1.5 text-xs">
      <span class="font-bold opacity-60 uppercase tracking-wider text-[10px] mr-1">
        {{ currentLocale === 'de' ? 'Facetten:' : 'Facets:' }}
      </span>
      <button
        v-for="facet in facets"
        :key="facet.id"
        type="button"
        class="btn btn-xs normal-case"
        :class="activeFacet === facet.id ? 'btn-primary font-bold shadow-xs' : 'btn-ghost border border-base-300 font-medium'"
        @click="activeFacet = facet.id"
      >
        <span>{{ facet.icon }}</span>
        <span>{{ currentLocale === 'de' ? facet.nameDe : facet.nameEn }}</span>
      </button>
    </div>

    <!-- 3. Selected Items & Search Input -->
    <div class="flex flex-wrap gap-2 p-2.5 input input-bordered h-auto min-h-[3.25rem] items-center w-full bg-base-100 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary">
      <div
        v-for="(item, idx) in modelValue"
        :key="idx"
        class="badge badge-primary gap-1.5 py-3 px-3 shadow-xs text-xs font-medium"
      >
        <span class="truncate max-w-[280px]" :title="getItemTitle(item)">{{ getDisplayLabel(item) }}</span>
        <button
          type="button"
          class="hover:opacity-75 transition-opacity"
          @click.prevent="removeItem(idx)"
          :title="currentLocale === 'de' ? 'Entfernen' : 'Remove'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-3.5 h-3.5 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Search Input inside the container -->
      <div class="relative flex-1 min-w-[220px]">
        <input
          type="text"
          v-model="searchQuery"
          class="w-full bg-transparent outline-none text-base-content text-sm placeholder:text-base-content/40"
          :placeholder="modelValue.length === 0 ? (currentLocale === 'de' ? 'Monument-Typ in HECTOR suchen (z.B. Grab, Statue, Relief)...' : 'Search monument type in HECTOR (e.g. Tomb, Statue, Relief)...') : (currentLocale === 'de' ? 'Weitere Klassifikation hinzufügen...' : 'Add another classification...')"
          @input="onSearchInput"
          @keydown.enter.prevent="addFromInput"
          @keydown.down.prevent="highlightNext"
          @keydown.up.prevent="highlightPrev"
          @focus="showDropdown = true"
          @blur="onBlur"
        />

        <!-- Autocomplete Suggestions Dropdown -->
        <div
          v-if="showDropdown && (suggestions.length > 0 || isSearching)"
          class="absolute left-0 top-full mt-2 w-88 max-w-[90vw] z-50 bg-base-100 rounded-box shadow-xl border border-base-300 max-h-64 overflow-y-auto"
        >
          <div v-if="isSearching" class="p-3 text-xs text-base-content/60 flex items-center gap-2">
            <span class="loading loading-spinner loading-xs text-primary"></span>
            {{ currentLocale === 'de' ? 'Suche in HECTOR-Facetten...' : 'Searching in HECTOR facets...' }}
          </div>
          <ul v-else class="menu menu-xs p-1">
            <li v-for="(suggestion, sIdx) in filteredSuggestions" :key="suggestion.uri || sIdx">
              <a
                :class="{ 'active': sIdx === highlightedIndex }"
                @mousedown.prevent="selectSuggestion(suggestion)"
                class="flex flex-col items-start py-1.5"
              >
                <div class="flex items-center gap-2 w-full justify-between">
                  <span class="font-bold text-sm">{{ suggestion.prefLabel }}</span>
                  <span class="badge badge-ghost badge-xs text-[10px] opacity-70">
                    {{ suggestion.facet || 'HECTOR' }}
                  </span>
                </div>
                <span v-if="suggestion.uri" class="text-[10px] opacity-50 truncate max-w-full font-mono">{{ suggestion.uri }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { getRecentVocabList, recordRecentVocabTerm } from '../utils/vocabHistory.js';
import { defaultMetadataLanguage } from '../utils/sharedState.js';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  currentLocale: {
    type: String,
    default: 'de'
  }
});

const emit = defineEmits(['update:modelValue']);

const searchQuery = ref('');
const showDropdown = ref(false);
const isSearching = ref(false);
const suggestions = ref([]);
const highlightedIndex = ref(-1);
const activeFacet = ref('all');

const recentTerms = getRecentVocabList('monument_type');

const facets = [
  { id: 'all', icon: '🏛️', nameDe: 'Alle Facetten', nameEn: 'All Facets' },
  { id: 'arch', icon: '🏛️', nameDe: 'Architektur & Grab', nameEn: 'Architecture & Grave' },
  { id: 'sculpt', icon: '🗿', nameDe: 'Plastik & Relief', nameEn: 'Sculpture & Relief' },
  { id: 'container', icon: '🏺', nameDe: 'Sarkophag & Gefäß', nameEn: 'Sarcophagus & Vessel' },
  { id: 'other', icon: '💡', nameDe: 'Beleuchtung & Sonstiges', nameEn: 'Lighting & Other' }
];

const filteredSuggestions = computed(() => {
  if (activeFacet.value === 'all') return suggestions.value;
  return suggestions.value.filter(s => {
    const f = (s.facet || '').toLowerCase();
    if (activeFacet.value === 'arch') return f.includes('architektur') || f.includes('grab') || f.includes('tempel') || f.includes('altar');
    if (activeFacet.value === 'sculpt') return f.includes('plastik') || f.includes('relief') || f.includes('statue') || f.includes('porträt');
    if (activeFacet.value === 'container') return f.includes('behälter') || f.includes('gefäß') || f.includes('sarkophag') || f.includes('keramik');
    if (activeFacet.value === 'other') return f.includes('beleuchtung') || f.includes('ornament') || f.includes('gerät');
    return true;
  });
});

const getDisplayLabel = (item) => {
  if (!item) return '';
  if (typeof item === 'object') {
    return item._value || item['#term'] || item.label || '';
  }
  const match = String(item).match(/^(.*?)\s*<.*?>$/);
  return match ? match[1] : String(item);
};

const getItemTitle = (item) => {
  if (!item) return '';
  if (typeof item === 'object') {
    return `${item._value || ''} (${item['#termUID'] || ''})`;
  }
  return String(item);
};

const isAlreadySelected = (chip) => {
  const current = props.modelValue || [];
  const chipLabel = (chip.label || chip.prefLabel || '').toLowerCase();
  const chipUri = chip.uri || '';
  return current.some(item => {
    if (typeof item === 'object') {
      if (chipUri && item['#termUID'] === chipUri) return true;
      return (item._value || '').toLowerCase() === chipLabel;
    }
    const str = String(item);
    if (chipUri && str.includes(chipUri)) return true;
    return getDisplayLabel(str).toLowerCase() === chipLabel;
  });
};

const addValue = (entry) => {
  if (!entry) return;
  const current = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
  
  // Decide whether to store as object or formatted string:
  // If array already has objects, add object; otherwise format string or object
  const label = typeof entry === 'object' ? (entry._value || entry.prefLabel || entry.label) : String(entry);
  const uri = typeof entry === 'object' ? (entry['#termUID'] || entry.uri || '') : '';
  const facet = typeof entry === 'object' ? (entry.facet || '') : '';

  // Check duplicate
  const exists = current.some(item => {
    const l = getDisplayLabel(item).toLowerCase();
    return l === label.toLowerCase();
  });
  if (!exists) {
    // Add structured object compatible with CARARE heritageAssetType schema
    const itemObj = {
      _value: label,
      '#term': label,
      '#namespace': uri ? 'http://vocabs.bcdh.uni-bonn.de/hector_heritage_assets/' : '',
      '#termUID': uri,
      '#lang': defaultMetadataLanguage.value || 'de'
    };
    current.push(itemObj);
    emit('update:modelValue', current);
  }
  recordRecentVocabTerm('monument_type', { label, uri, facet });
};

const addRecentTerm = (chip) => {
  addValue({
    _value: chip.label,
    prefLabel: chip.label,
    label: chip.label,
    uri: chip.uri,
    facet: chip.facet
  });
};

const removeItem = (index) => {
  const current = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
  current.splice(index, 1);
  emit('update:modelValue', current);
};

let searchTimer = null;
const onSearchInput = () => {
  const query = searchQuery.value.trim();
  highlightedIndex.value = -1;

  if (!query) {
    suggestions.value = [];
    return;
  }

  // 1. Instant local filter from recent terms
  const localMatches = (recentTerms.value || []).filter(c =>
    (c.label || '').toLowerCase().includes(query.toLowerCase())
  ).map(c => ({
    prefLabel: c.label,
    uri: c.uri,
    facet: c.facet || 'Letzte'
  }));

  suggestions.value = localMatches;
  showDropdown.value = true;

  // 2. Search both hector_heritage_assets and hector Skosmos API
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(async () => {
    if (query.length < 2) return;
    try {
      isSearching.value = true;
      const lang = props.currentLocale === 'de' ? 'de' : 'en';

      const [resAssets, resHector] = await Promise.allSettled([
        fetch(`https://vocabs.bcdh.uni-bonn.de/rest/v1/hector_heritage_assets/search?query=${encodeURIComponent(query)}*&lang=${lang}`),
        fetch(`https://vocabs.bcdh.uni-bonn.de/rest/v1/hector/search?query=${encodeURIComponent(query)}*&lang=${lang}`)
      ]);

      const found = [];
      const seen = new Set(localMatches.map(m => m.uri));

      if (resAssets.status === 'fulfilled' && resAssets.value.ok) {
        const data = await resAssets.value.json();
        if (data.results && Array.isArray(data.results)) {
          data.results.forEach(r => {
            const uri = r.uri;
            if (!seen.has(uri)) {
              seen.add(uri);
              found.push({
                prefLabel: r.prefLabel || r.altLabel || query,
                uri: uri,
                facet: determineFacet(r.prefLabel || '')
              });
            }
          });
        }
      }

      if (resHector.status === 'fulfilled' && resHector.value.ok) {
        const data = await resHector.value.json();
        if (data.results && Array.isArray(data.results)) {
          data.results.forEach(r => {
            const uri = r.uri;
            if (!seen.has(uri)) {
              seen.add(uri);
              found.push({
                prefLabel: r.prefLabel || r.altLabel || query,
                uri: uri,
                facet: determineFacet(r.prefLabel || '')
              });
            }
          });
        }
      }

      suggestions.value = [...localMatches, ...found];
    } catch (err) {
      console.warn('HECTOR Monument Type search failed:', err);
    } finally {
      isSearching.value = false;
    }
  }, 250);
};

const determineFacet = (label) => {
  const l = label.toLowerCase();
  if (l.includes('grab') || l.includes('tempel') || l.includes('altar') || l.includes('stele') || l.includes('pfeiler') || l.includes('bau') || l.includes('haus')) {
    return 'Architekturtyp';
  }
  if (l.includes('statue') || l.includes('relief') || l.includes('skulptur') || l.includes('porträt') || l.includes('plastik') || l.includes('büste')) {
    return 'Plastik';
  }
  if (l.includes('sarkophag') || l.includes('gefäß') || l.includes('urne') || l.includes('behälter') || l.includes('kasten') || l.includes('vase')) {
    return 'Behälter';
  }
  if (l.includes('kandelaber') || l.includes('lampe') || l.includes('licht')) {
    return 'Beleuchtung';
  }
  return 'Kulturgut';
};

const selectSuggestion = (suggestion) => {
  addValue(suggestion);
  searchQuery.value = '';
  suggestions.value = [];
  showDropdown.value = false;
};

const addFromInput = () => {
  if (highlightedIndex.value >= 0 && filteredSuggestions.value[highlightedIndex.value]) {
    selectSuggestion(filteredSuggestions.value[highlightedIndex.value]);
    return;
  }
  const text = searchQuery.value.trim();
  if (!text) return;

  if (filteredSuggestions.value.length > 0 && filteredSuggestions.value[0].prefLabel.toLowerCase() === text.toLowerCase()) {
    selectSuggestion(filteredSuggestions.value[0]);
    return;
  }

  addValue({ _value: text, label: text, prefLabel: text, uri: '', facet: 'Eigener Begriff' });
  searchQuery.value = '';
  suggestions.value = [];
  showDropdown.value = false;
};

const highlightNext = () => {
  if (filteredSuggestions.value.length === 0) return;
  highlightedIndex.value = (highlightedIndex.value + 1) % filteredSuggestions.value.length;
};

const highlightPrev = () => {
  if (filteredSuggestions.value.length === 0) return;
  highlightedIndex.value = (highlightedIndex.value - 1 + filteredSuggestions.value.length) % filteredSuggestions.value.length;
};

const onBlur = () => {
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
};
</script>
