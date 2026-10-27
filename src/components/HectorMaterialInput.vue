<template>
  <div class="space-y-3 w-full">
    <!-- 1. Recently Used Materials (max 20) with 1-Click Select -->
    <div v-if="recentMaterials.length > 0" class="bg-base-200/50 p-2.5 rounded-lg border border-base-300">
      <div class="flex items-center justify-between mb-1.5">
        <span class="text-xs font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ currentLocale === 'de' ? 'Zuletzt genutzte Begriffe (max. 20):' : 'Recently used terms (max 20):' }}
        </span>
        <a href="https://vocabs.bcdh.uni-bonn.de/hector/de/page/material" target="_blank" rel="noopener" class="text-xs link link-hover text-primary flex items-center gap-1 opacity-80 hover:opacity-100">
          HECTOR Skosmos
          <svg xmlns="http://www.w3.org/2000/svg" class="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      <div class="flex flex-wrap gap-1 max-h-28 overflow-y-auto pr-1">
        <button
          v-for="chip in recentMaterials"
          :key="chip.uri || chip.label"
          type="button"
          class="btn btn-xs normal-case font-normal border border-base-300 hover:border-primary hover:bg-primary/10 transition-colors"
          :class="isAlreadySelected(chip) ? 'btn-neutral opacity-50 cursor-default' : 'btn-ghost'"
          :disabled="isAlreadySelected(chip)"
          @click.prevent="addRecentMaterial(chip)"
          :title="chip.uri || chip.label"
        >
          <span class="text-primary font-bold mr-0.5">+</span>
          <span>{{ chip.label }}</span>
        </button>
      </div>
    </div>

    <!-- 2. Selected Materials List & Integrated Input -->
    <div class="flex flex-wrap gap-2 p-2.5 border border-base-300 rounded-xl relative overflow-visible h-auto min-h-[3.25rem] items-center w-full bg-base-100 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary">
      <div
        v-for="(item, idx) in modelValue"
        :key="idx"
        class="badge badge-primary gap-1.5 py-3 px-3 shadow-xs text-xs font-medium"
      >
        <span class="truncate max-w-[280px]" :title="item">{{ getDisplayLabel(item) }}</span>
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
          :placeholder="modelValue.length === 0 ? (currentLocale === 'de' ? 'Material in HECTOR suchen oder eintippen...' : 'Search material in HECTOR or type...') : (currentLocale === 'de' ? 'Weiteres Material hinzufügen...' : 'Add another material...')"
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
          class="absolute left-0 top-full mt-2 w-80 max-w-[90vw] z-[100] bg-base-100 rounded-box shadow-xl border border-base-300 max-h-64 overflow-y-auto"
        >
          <div v-if="isSearching" class="p-3 text-xs text-base-content/60 flex items-center gap-2">
            <span class="loading loading-spinner loading-xs text-primary"></span>
            {{ currentLocale === 'de' ? 'Suche in HECTOR...' : 'Searching in HECTOR...' }}
          </div>
          <ul v-else class="menu menu-xs p-1">
            <li v-for="(suggestion, sIdx) in suggestions" :key="suggestion.uri">
              <a
                :class="{ 'active': sIdx === highlightedIndex }"
                @mousedown.prevent="selectSuggestion(suggestion)"
                class="flex flex-col items-start py-1.5"
              >
                <div class="flex items-center gap-2 w-full justify-between">
                  <span class="font-bold text-sm">{{ suggestion.prefLabel }}</span>
                  <span class="badge badge-ghost badge-xs text-[10px] opacity-70">HECTOR</span>
                </div>
                <span class="text-[10px] opacity-50 truncate max-w-full font-mono">{{ suggestion.uri }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getRecentVocabList, recordRecentVocabTerm } from '../utils/vocabHistory.js';

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

const recentMaterials = getRecentVocabList('materials');

const getDisplayLabel = (item) => {
  if (!item) return '';
  if (typeof item === 'object') {
    return item._value || item['#term'] || item.term || item.label || item.prefLabel || item.name || '';
  }
  if (typeof item !== 'string') return String(item);
  const match = item.match(/^(.*?)\s*<.*?>$/);
  return match ? match[1] : item;
};

const isAlreadySelected = (chip) => {
  const current = props.modelValue || [];
  const chipLabel = (chip.label || chip.prefLabel || '').toLowerCase();
  const chipUri = chip.uri || '';
  return current.some(item => {
    const display = getDisplayLabel(item).toLowerCase();
    if (chipUri) {
      if (typeof item === 'string' && item.includes(chipUri)) return true;
      if (typeof item === 'object' && (item['#termUID'] === chipUri || item['#namespace'] === chipUri || item.uri === chipUri)) return true;
    }
    return display === chipLabel;
  });
};

const addValue = (valueStr, rawItem = null) => {
  if (!valueStr) return;
  const current = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
  if (!current.includes(valueStr)) {
    current.push(valueStr);
    emit('update:modelValue', current);
  }
  recordRecentVocabTerm('materials', rawItem || valueStr);
};

const addRecentMaterial = (chip) => {
  const val = chip.uri ? `${chip.label} <${chip.uri}>` : chip.label;
  addValue(val, chip);
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
  const localMatches = (recentMaterials.value || []).filter(c =>
    (c.label || '').toLowerCase().includes(query.toLowerCase())
  ).map(c => ({
    prefLabel: c.label,
    uri: c.uri
  }));

  suggestions.value = localMatches;
  showDropdown.value = true;

  // 2. Debounced API search against HECTOR Skosmos REST API
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(async () => {
    if (query.length < 2) return;
    try {
      isSearching.value = true;
      const lang = props.currentLocale === 'de' ? 'de' : 'en';
      const res = await fetch(`https://vocabs.bcdh.uni-bonn.de/rest/v1/hector/search?query=${encodeURIComponent(query)}*&lang=${lang}`);
      if (res.ok) {
        const data = await res.json();
        if (data.results && Array.isArray(data.results)) {
          const apiSuggestions = data.results.map(r => ({
            prefLabel: r.prefLabel || r.altLabel || query,
            uri: r.uri
          }));
          const seen = new Set(localMatches.map(m => m.uri));
          const combined = [...localMatches];
          for (const item of apiSuggestions) {
            if (!seen.has(item.uri)) {
              seen.add(item.uri);
              combined.push(item);
            }
          }
          suggestions.value = combined;
        }
      }
    } catch (err) {
      console.warn('HECTOR search failed:', err);
    } finally {
      isSearching.value = false;
    }
  }, 250);
};

const selectSuggestion = (suggestion) => {
  const val = `${suggestion.prefLabel} <${suggestion.uri}>`;
  addValue(val, { label: suggestion.prefLabel, uri: suggestion.uri });
  searchQuery.value = '';
  suggestions.value = [];
  showDropdown.value = false;
};

const addFromInput = () => {
  if (highlightedIndex.value >= 0 && suggestions.value[highlightedIndex.value]) {
    selectSuggestion(suggestions.value[highlightedIndex.value]);
    return;
  }
  const text = searchQuery.value.trim();
  if (!text) return;

  if (suggestions.value.length > 0 && suggestions.value[0].prefLabel.toLowerCase() === text.toLowerCase()) {
    selectSuggestion(suggestions.value[0]);
    return;
  }

  addValue(text, { label: text, uri: '' });
  searchQuery.value = '';
  suggestions.value = [];
  showDropdown.value = false;
};

const highlightNext = () => {
  if (suggestions.value.length === 0) return;
  highlightedIndex.value = (highlightedIndex.value + 1) % suggestions.value.length;
};

const highlightPrev = () => {
  if (suggestions.value.length === 0) return;
  highlightedIndex.value = (highlightedIndex.value - 1 + suggestions.value.length) % suggestions.value.length;
};

const onBlur = () => {
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
};
</script>
