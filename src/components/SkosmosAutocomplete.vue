<template>
  <div class="relative w-full">
    <!-- Recently Used Vocabulary Terms (max 20) -->
    <div v-if="recentTerms && recentTerms.length > 0" class="mb-2">
      <div class="flex items-center justify-between mb-1">
        <span class="text-[11px] font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Zuletzt genutzte Begriffe (max. 20):
        </span>
        <span class="text-[10px] text-base-content/40">{{ recentTerms.length }}/20</span>
      </div>

      <div class="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
        <button
          v-for="chip in recentTerms"
          :key="chip.uri || chip.label"
          type="button"
          class="btn btn-xs normal-case font-normal border border-base-300 hover:border-primary hover:bg-primary/10 transition-colors"
          :class="isTermSelected(chip) ? 'btn-primary font-bold shadow-xs' : 'btn-ghost'"
          @click.prevent="selectRecentChip(chip)"
          :title="chip.uri || chip.label"
        >
          <span class="text-primary font-bold mr-0.5">+</span>
          <span>{{ chip.label }}</span>
        </button>
      </div>
    </div>

    <!-- Main Loading / Error / Select or Autocomplete -->
    <div v-if="loading"
      class="flex items-center gap-2 text-sm text-base-content/50 h-12 px-4 border border-base-200 rounded-lg">
      <span class="loading loading-spinner loading-xs"></span> Loading terms...
    </div>
    <div v-else-if="error" class="text-sm text-error h-12 px-4 flex items-center border border-error rounded-lg">
      Failed to load vocabulary.
    </div>
    <div v-else>
      <!-- Normal dropdown if <= 15 terms -->
      <select v-if="terms.length <= 15" v-model="internalValue" class="select select-bordered w-full" @change="onDropdownChange">
        <option value="" disabled>Select an option</option>
        <option v-for="term in terms" :key="term.uri" :value="formatTerm(term)">
          {{ term.prefLabel }}
        </option>
      </select>

      <!-- Autocomplete if > 15 terms -->
      <div v-else class="dropdown w-full" :class="{ 'dropdown-open': showDropdown }">
        <input type="text" class="input input-bordered w-full" v-model="searchQuery" @input="onSearch" @focus="onFocus"
          @blur="onBlur" :placeholder="props.placeholder" />
        <ul tabindex="0"
          class="dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-full max-h-64 overflow-y-auto border border-base-200"
          v-show="showDropdown">
          <li v-for="term in filteredTerms" :key="term.uri">
            <a @mousedown.prevent="selectTerm(term)">{{ term.prefLabel }}</a>
          </li>
          <li v-if="filteredTerms.length === 0" class="disabled">
            <a>No matches found</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { getRecentVocabList, recordRecentVocabTerm } from '../utils/vocabHistory.js';

const props = defineProps({
  modelValue: {
    type: [String, Array],
    default: ''
  },
  vocabUrl: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    required: true
  },
  vocabKey: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const effectiveKey = computed(() => {
  if (props.vocabKey) return props.vocabKey;
  if (props.vocabUrl && props.vocabUrl.includes('epoch')) return 'epochs';
  if (props.placeholder && props.placeholder.toLowerCase().includes('epoch')) return 'epochs';
  return 'general';
});

const recentTerms = computed(() => {
  return getRecentVocabList(effectiveKey.value).value || [];
});

const terms = ref([]);
const loading = ref(true);
const error = ref(false);

const internalValue = ref(props.modelValue);
const searchQuery = ref('');
const showDropdown = ref(false);

const isTermSelected = (chip) => {
  if (!internalValue.value) return false;
  const currentStr = String(internalValue.value);
  if (chip.uri && currentStr.includes(chip.uri)) return true;
  const match = currentStr.match(/^(.*?)\s*<.*?>$/);
  const currentLabel = match ? match[1].toLowerCase() : currentStr.toLowerCase();
  return currentLabel === (chip.label || '').toLowerCase();
};

const selectRecentChip = (chip) => {
  const val = chip.uri ? `${chip.label} <${chip.uri}>` : chip.label;
  internalValue.value = val;
  searchQuery.value = chip.label;
  recordRecentVocabTerm(effectiveKey.value, chip);
};

watch(() => props.modelValue, (newVal) => {
  internalValue.value = newVal;
  if (terms.value.length > 15 && newVal) {
    const match = String(newVal).match(/^(.*?) <.*>$/);
    searchQuery.value = match ? match[1] : newVal;
  }
});

watch(internalValue, (newVal) => {
  emit('update:modelValue', newVal);
});

const formatTerm = (term) => {
  return `${term.prefLabel} <${term.uri}>`;
};

const fetchTree = async (url, visited = new Set()) => {
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();

    let fetchedTerms = [];
    if (data.narrower && Array.isArray(data.narrower)) {
      fetchedTerms = data.narrower;
    } else if (data.results && Array.isArray(data.results)) {
      fetchedTerms = data.results;
    } else if (Array.isArray(data)) {
      fetchedTerms = data;
    } else if (data.concept && data.concept.narrower) {
      fetchedTerms = data.concept.narrower;
    }

    let allTerms = [];

    const childPromises = fetchedTerms.map(async (t) => {
      if (visited.has(t.uri)) return [];
      visited.add(t.uri);

      let terms = [{
        uri: t.uri,
        prefLabel: t.prefLabel || t.label || t.uri
      }];

      const mightHaveChildren = t.hasChildren !== false && t.hasNarrower !== false;

      if (mightHaveChildren) {
        try {
          const nextUrl = new URL(url);
          nextUrl.searchParams.set('uri', t.uri);
          const childTerms = await fetchTree(nextUrl.toString(), visited);
          terms = terms.concat(childTerms);
        } catch (err) {
          console.warn('Could not fetch children for', t.uri, err);
        }
      }
      return terms;
    });

    const results = await Promise.all(childPromises);
    for (const res of results) {
      allTerms = allTerms.concat(res);
    }

    return allTerms;
  } catch (err) {
    console.warn('Error fetching tree at url', url, err);
    return [];
  }
};

const fetchTerms = async () => {
  try {
    loading.value = true;
    error.value = false;

    terms.value = await fetchTree(props.vocabUrl);

    if (terms.value.length > 15 && props.modelValue) {
      const match = String(props.modelValue).match(/^(.*?) <.*>$/);
      searchQuery.value = match ? match[1] : props.modelValue;
    }
  } catch (e) {
    console.error('Error fetching Skosmos vocabulary:', e);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (props.vocabUrl) {
    fetchTerms();
  }
});

const filteredTerms = computed(() => {
  if (!searchQuery.value) {
    return terms.value.slice(0, 15);
  }
  const query = searchQuery.value.toLowerCase();
  const filtered = terms.value.filter(t => (t.prefLabel || '').toLowerCase().includes(query));
  return filtered.slice(0, 15);
});

const onSearch = () => {
  showDropdown.value = true;
};

const onFocus = () => {
  showDropdown.value = true;
};

const onBlur = () => {
  setTimeout(() => {
    showDropdown.value = false;
    if (internalValue.value) {
      const match = String(internalValue.value).match(/^(.*?) <.*>$/);
      searchQuery.value = match ? match[1] : internalValue.value;
    } else {
      searchQuery.value = '';
    }
  }, 200);
};

const onDropdownChange = () => {
  if (internalValue.value) {
    recordRecentVocabTerm(effectiveKey.value, internalValue.value);
  }
};

const selectTerm = (term) => {
  const formatted = formatTerm(term);
  internalValue.value = formatted;
  searchQuery.value = term.prefLabel;
  recordRecentVocabTerm(effectiveKey.value, { label: term.prefLabel, uri: term.uri });
  showDropdown.value = false;
};
</script>
