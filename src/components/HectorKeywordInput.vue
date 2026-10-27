<template>
  <div class="space-y-3 w-full">
    <!-- Selected Keyword Chips and Search Input -->
    <div class="flex flex-wrap gap-2 p-2.5 border border-base-300 rounded-xl relative overflow-visible h-auto min-h-[3.25rem] items-center w-full bg-base-100 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary">
      <div
        v-for="(keyword, idx) in normalizedKeywords"
        :key="idx"
        class="badge badge-primary gap-1.5 py-3 px-3 shadow-xs text-xs font-medium"
      >
        <span class="truncate max-w-[280px]">{{ getKeywordLabel(keyword) }}</span>
        <button
          type="button"
          class="hover:opacity-75 transition-opacity"
          @click.prevent="removeKeyword(idx)"
          :title="currentLocale === 'de' ? 'Entfernen' : 'Remove'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-3.5 h-3.5 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Live Search / Tag Input -->
      <div class="relative flex-1 min-w-[200px]">
        <input
          type="text"
          v-model="searchQuery"
          class="w-full bg-transparent outline-none text-base-content text-sm placeholder:text-base-content/40"
          :placeholder="normalizedKeywords.length === 0 
            ? (currentLocale === 'de' ? 'Schlagwort in HECTOR suchen oder eingeben & Enter...' : 'Search keyword in HECTOR or type & Enter...') 
            : (currentLocale === 'de' ? 'Weiteres Schlagwort suchen / tippen...' : 'Add another keyword...')"
          @input="onSearchInput"
          @keydown.enter.prevent="addFromInput"
          @keydown.down.prevent="highlightNext"
          @keydown.up.prevent="highlightPrev"
          @keydown.esc.prevent="showDropdown = false"
          @focus="onFocus"
          @blur="onBlur"
        />

        <!-- Autocomplete Suggestions Dropdown -->
        <div
          v-if="showDropdown && (suggestions.length > 0 || isSearching)"
          class="absolute left-0 top-full mt-2 w-96 max-w-[90vw] z-[100] bg-base-100 rounded-box shadow-xl border border-base-300 max-h-64 overflow-y-auto"
        >
          <div v-if="isSearching" class="p-3 text-xs text-base-content/60 flex items-center gap-2">
            <span class="loading loading-spinner loading-xs text-primary"></span>
            {{ currentLocale === 'de' ? 'Suche im HECTOR-Vokabular...' : 'Searching in HECTOR vocabulary...' }}
          </div>
          <ul v-else class="menu menu-xs p-1">
            <li v-for="(suggestion, sIdx) in suggestions" :key="suggestion.uri || sIdx">
              <a
                :class="{ 'active': sIdx === highlightedIndex }"
                @mousedown.prevent="selectSuggestion(suggestion)"
                class="flex flex-col items-start py-1.5"
              >
                <div class="flex items-center gap-2 w-full justify-between">
                  <span class="font-bold text-sm text-base-content">{{ suggestion.prefLabel }}</span>
                  <span class="badge badge-ghost badge-xs text-[10px] opacity-70">
                    {{ suggestion.vocabLabel || 'HECTOR' }}
                  </span>
                </div>
                <span v-if="suggestion.uri" class="text-[10px] opacity-50 truncate max-w-full font-mono">{{ suggestion.uri }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Quick Selection Chips from HECTOR Vocabulary -->
    <div v-if="popularKeywords && popularKeywords.length > 0" class="bg-base-200/50 p-2.5 rounded-lg border border-base-300">
      <div class="flex items-center justify-between mb-1.5">
        <span class="text-xs font-bold text-base-content/75 flex items-center gap-1.5">
          <span class="badge badge-xs badge-primary font-bold">HECTOR</span>
          <span>{{ currentLocale === 'de' ? 'Häufige HECTOR Fachvokabular-Schlagwörter:' : 'Popular HECTOR Vocabulary Keywords:' }}</span>
        </span>
        <span class="text-[10px] text-base-content/40">{{ currentLocale === 'de' ? '1 Klick zum Hinzufügen' : '1 Click to add' }}</span>
      </div>

      <div class="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
        <button
          v-for="chip in popularKeywords"
          :key="chip.label"
          type="button"
          class="btn btn-xs normal-case transition-all gap-1 border"
          :class="isAlreadySelected(chip.label)
            ? 'btn-neutral opacity-50 cursor-default'
            : 'btn-ghost bg-base-100 hover:border-primary hover:bg-primary/10 border-base-300 font-normal'"
          :disabled="isAlreadySelected(chip.label)"
          @click.prevent="addPopularKeyword(chip)"
          :title="chip.uri ? `${chip.label} (${chip.uri})` : chip.label"
        >
          <span v-if="!isAlreadySelected(chip.label)" class="text-primary font-bold">+</span>
          <span v-else class="font-bold">✓</span>
          <span>{{ chip.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
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

const popularKeywords = getRecentVocabList('keywords');

const normalizedKeywords = computed(() => {
  return Array.isArray(props.modelValue) ? props.modelValue : [];
});

const getKeywordLabel = (item) => {
  if (!item) return '';
  if (typeof item === 'object') return item._value || item.prefLabel || item.label || '';
  return String(item);
};

const isAlreadySelected = (label) => {
  if (!label) return false;
  const l = String(label).toLowerCase().trim();
  return normalizedKeywords.value.some(k => getKeywordLabel(k).toLowerCase().trim() === l);
};

const addKeyword = (term, uri = '') => {
  if (!term || typeof term !== 'string') return;
  const val = term.trim();
  if (!val) return;
  if (isAlreadySelected(val)) return;

  const current = [...normalizedKeywords.value, val];
  emit('update:modelValue', current);
  recordRecentVocabTerm('keywords', { label: val, uri, source: 'HECTOR' });
};

const addPopularKeyword = (chip) => {
  if (chip && chip.label) {
    addKeyword(chip.label, chip.uri || '');
  }
};

const removeKeyword = (idx) => {
  const current = [...normalizedKeywords.value];
  current.splice(idx, 1);
  emit('update:modelValue', current);
};

const addFromInput = () => {
  if (highlightedIndex.value >= 0 && suggestions.value[highlightedIndex.value]) {
    selectSuggestion(suggestions.value[highlightedIndex.value]);
    return;
  }
  const query = searchQuery.value.trim();
  if (query) {
    addKeyword(query);
    searchQuery.value = '';
    suggestions.value = [];
    showDropdown.value = false;
  }
};

const selectSuggestion = (suggestion) => {
  if (!suggestion) return;
  addKeyword(suggestion.prefLabel, suggestion.uri || '');
  searchQuery.value = '';
  suggestions.value = [];
  showDropdown.value = false;
  highlightedIndex.value = -1;
};

const highlightNext = () => {
  if (suggestions.value.length === 0) return;
  highlightedIndex.value = (highlightedIndex.value + 1) % suggestions.value.length;
};

const highlightPrev = () => {
  if (suggestions.value.length === 0) return;
  highlightedIndex.value = (highlightedIndex.value - 1 + suggestions.value.length) % suggestions.value.length;
};

let searchTimer = null;
const onSearchInput = () => {
  const query = searchQuery.value.trim();
  highlightedIndex.value = -1;

  if (!query) {
    suggestions.value = [];
    showDropdown.value = false;
    return;
  }

  // 1. Instant local match from popular keywords
  const localMatches = (popularKeywords.value || [])
    .filter(c => (c.label || '').toLowerCase().includes(query.toLowerCase()))
    .map(c => ({
      prefLabel: c.label,
      uri: c.uri,
      vocabLabel: 'HECTOR (Lokal)'
    }));

  suggestions.value = localMatches;
  showDropdown.value = true;

  // 2. Query BCDH Skosmos REST APIs for HECTOR
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(async () => {
    if (query.length < 2) return;
    try {
      isSearching.value = true;
      const lang = props.currentLocale === 'de' ? 'de' : 'en';

      const [resAssets, resHector, resEpochs] = await Promise.allSettled([
        fetch(`https://vocabs.bcdh.uni-bonn.de/rest/v1/hector_heritage_assets/search?query=${encodeURIComponent(query)}*&lang=${lang}`),
        fetch(`https://vocabs.bcdh.uni-bonn.de/rest/v1/hector/search?query=${encodeURIComponent(query)}*&lang=${lang}`),
        fetch(`https://vocabs.bcdh.uni-bonn.de/rest/v1/hector_epochs/search?query=${encodeURIComponent(query)}*&lang=${lang}`)
      ]);

      const found = [...localMatches];
      const seen = new Set(localMatches.map(m => (m.prefLabel || '').toLowerCase()));

      const processResults = (res, label) => {
        if (res.status === 'fulfilled' && res.value.ok) {
          return res.value.json().then(data => {
            if (data && Array.isArray(data.results)) {
              data.results.forEach(r => {
                const pLabel = r.prefLabel || r.altLabel || '';
                if (pLabel && !seen.has(pLabel.toLowerCase())) {
                  seen.add(pLabel.toLowerCase());
                  found.push({
                    prefLabel: pLabel,
                    uri: r.uri,
                    vocabLabel: label
                  });
                }
              });
            }
          }).catch(() => {});
        }
      };

      await Promise.all([
        processResults(resAssets, 'HECTOR Kulturgut'),
        processResults(resHector, 'HECTOR'),
        processResults(resEpochs, 'HECTOR Epochen')
      ]);

      suggestions.value = found.slice(0, 15);
    } catch (e) {
      console.warn('HECTOR keyword search error:', e);
    } finally {
      isSearching.value = false;
    }
  }, 220);
};

const onFocus = () => {
  if (searchQuery.value.trim() && suggestions.value.length > 0) {
    showDropdown.value = true;
  }
};

const onBlur = () => {
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
};
</script>
