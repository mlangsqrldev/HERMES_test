<template>
  <div class="relative w-full" ref="rootEl">
    <!-- Input row -->
    <div class="flex gap-1.5 items-center">
      <div class="relative flex-1">
        <input
          :id="inputId"
          type="text"
          v-model="query"
          @input="onInput"
          @keydown.down.prevent="moveDown"
          @keydown.up.prevent="moveUp"
          @keydown.enter.prevent="selectHighlighted"
          @keydown.escape="close"
          @focus="onFocus"
          :placeholder="placeholder || (currentLocale === 'de' ? 'Einrichtung / GND suchen (z.B. Antikensammlung Berlin)...' : 'Search institution / GND (e.g. Antikensammlung Berlin)...')"
          class="input input-sm input-bordered w-full pr-8 text-xs"
          autocomplete="off"
        />
        <!-- Loading spinner / clear -->
        <span class="absolute right-2 top-1/2 -translate-y-1/2">
          <svg v-if="loading" class="animate-spin size-3.5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"/>
          </svg>
          <button v-else-if="query" type="button" @click="clear" class="text-base-content/40 hover:text-base-content text-sm leading-none">✕</button>
        </span>
      </div>
    </div>

    <!-- Chosen value badge -->
    <div v-if="chosenItem" class="mt-1.5 flex items-center gap-1.5 flex-wrap">
      <div class="flex items-center gap-1 bg-primary/10 border border-primary/30 rounded-lg px-2 py-0.5 text-xs max-w-full">
        <span class="font-semibold truncate max-w-[240px]" :title="chosenItem.label">{{ chosenItem.label }}</span>
        <span v-if="chosenItem.place" class="text-[11px] opacity-60">({{ chosenItem.place }})</span>
        <span v-if="chosenItem.gnd" class="badge badge-xs badge-primary font-mono ml-1" title="GND-Nummer">GND: {{ chosenItem.gnd }}</span>
        <a :href="chosenItem.uri" target="_blank" class="ml-1 opacity-60 hover:opacity-100 text-[10px]" title="GND-Eintrag öffnen">↗</a>
        <button type="button" @click="clearChosen" class="ml-1 opacity-50 hover:opacity-100 text-xs">✕</button>
      </div>
    </div>

    <!-- Dropdown -->
    <ul
      v-if="open && results.length"
      class="absolute z-50 mt-1 w-full bg-base-100 border border-base-300 rounded-xl shadow-xl max-h-72 overflow-y-auto text-sm"
    >
      <li
        v-for="(item, i) in results"
        :key="item.id"
        @mouseenter="highlighted = i"
        @mousedown.prevent="select(item)"
        class="px-3 py-2 cursor-pointer flex flex-col gap-0.5 transition-colors border-b border-base-200/50 last:border-b-0"
        :class="highlighted === i ? 'bg-primary/10 text-primary' : 'hover:bg-base-200'"
      >
        <div class="flex items-center justify-between gap-2">
          <span class="font-semibold text-sm leading-tight truncate">{{ item.label }}</span>
          <span v-if="item.gnd" class="badge badge-xs badge-primary font-mono shrink-0 font-bold">GND: {{ item.gnd }}</span>
          <span v-else class="badge badge-xs badge-ghost font-mono shrink-0 opacity-60">{{ item.id }}</span>
        </div>
        <span v-if="item.description" class="text-[11px] text-base-content/65 line-clamp-1">{{ item.description }}</span>
        <span class="text-[10px] font-mono text-base-content/40 truncate">{{ item.uri }}</span>
      </li>
    </ul>

    <!-- No results -->
    <div v-if="open && !loading && query.length >= 2 && results.length === 0"
         class="absolute z-50 mt-1 w-full bg-base-100 border border-base-200 rounded-xl shadow-lg px-3 py-2 text-xs text-base-content/60 italic">
      {{ currentLocale === 'de' ? 'Keine Einrichtung in der GND gefunden.' : 'No institution found in GND.' }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch, inject, onBeforeUnmount } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  inputId: { type: String, default: 'institution-autocomplete' },
  placeholder: { type: String, default: '' },
  emitMode: { type: String, default: 'uri' }, // 'uri' | 'gnd' | 'label' | 'isil' (alias for gnd)
});

const emit = defineEmits(['update:modelValue', 'select']);

const currentLocale = inject('currentLocale', ref('de'));
const query = ref('');
const results = ref([]);
const loading = ref(false);
const open = ref(false);
const highlighted = ref(0);
const chosenItem = ref(null);
const rootEl = ref(null);

let debounceTimer = null;
let currentAbortController = null;
const queryCache = new Map();

// If modelValue is set externally, show it as text
watch(() => props.modelValue, (val) => {
  if (!chosenItem.value && val) {
    query.value = val;
  }
}, { immediate: true });

const onFocus = () => {
  if (results.value.length && query.value.length >= 2) open.value = true;
};

const onInput = () => {
  chosenItem.value = null;
  clearTimeout(debounceTimer);
  if (query.value.trim().length < 2) {
    results.value = [];
    open.value = false;
    loading.value = false;
    return;
  }
  loading.value = true;
  debounceTimer = setTimeout(searchGND, 250);
};

// --- Lobid-GND API query for corporate bodies (museums, archives, collections, universities) ---
const searchGND = async () => {
  const q = query.value.trim();
  if (q.length < 2) {
    loading.value = false;
    return;
  }

  // Check cache first for instant sub-millisecond response
  if (queryCache.has(q)) {
    results.value = queryCache.get(q);
    open.value = results.value.length > 0;
    highlighted.value = 0;
    loading.value = false;
    return;
  }

  if (currentAbortController) {
    currentAbortController.abort();
  }
  currentAbortController = new AbortController();

  try {
    const encoded = encodeURIComponent(q);
    const url = `https://lobid.org/gnd/search?q=${encoded}&filter=type:CorporateBody&format=json&size=15`;
    const res = await fetch(url, {
      signal: currentAbortController.signal,
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const mapped = (data.member || []).map(m => {
      const gnd = m.gndIdentifier || (m.id ? m.id.split('/').pop() : '');
      const label = m.preferredName || gnd;
      const uri = m.id || `https://d-nb.info/gnd/${gnd}`;

      const places = Array.isArray(m.placeOfBusiness)
        ? m.placeOfBusiness.map(p => p.label).filter(Boolean)
        : [];
      const place = places.join(', ');

      const categories = Array.isArray(m.gndSubjectCategory)
        ? m.gndSubjectCategory.map(c => c.label).filter(Boolean)
        : [];
      const category = categories.slice(0, 2).join(', ');

      const description = [place, category].filter(Boolean).join(' · ');

      const variants = Array.isArray(m.variantName)
        ? m.variantName.slice(0, 2).join('; ')
        : '';

      return {
        id: gnd,
        gnd,
        label,
        place,
        category,
        description: description || variants,
        variants,
        uri,
        isil: null, // For backward compatibility if referenced
      };
    }).filter(r => r.label && r.label !== r.id);

    queryCache.set(q, mapped);
    results.value = mapped;
    open.value = results.value.length > 0;
    highlighted.value = 0;
  } catch (e) {
    if (e.name !== 'AbortError') {
      console.error('Lobid GND search error:', e);
      results.value = [];
    }
  } finally {
    loading.value = false;
  }
};

const select = (item) => {
  chosenItem.value = item;
  query.value = (props.emitMode === 'gnd' || props.emitMode === 'isil') && item.gnd ? item.gnd : item.label;
  open.value = false;

  let valToEmit = item.uri;
  if (props.emitMode === 'gnd' || props.emitMode === 'isil') {
    valToEmit = item.gnd || item.uri;
  } else if (props.emitMode === 'label') {
    valToEmit = item.label;
  }

  emit('update:modelValue', valToEmit);
  emit('select', item);
};

const selectHighlighted = () => {
  if (open.value && results.value[highlighted.value]) {
    select(results.value[highlighted.value]);
  }
};

const moveDown = () => {
  if (highlighted.value < results.value.length - 1) highlighted.value++;
};
const moveUp = () => {
  if (highlighted.value > 0) highlighted.value--;
};
const close = () => {
  open.value = false;
};
const clear = () => {
  query.value = '';
  results.value = [];
  open.value = false;
  chosenItem.value = null;
  emit('update:modelValue', '');
};
const clearChosen = () => {
  chosenItem.value = null;
  query.value = '';
  emit('update:modelValue', '');
};

// Close on outside click
const handleOutsideClick = (e) => {
  if (rootEl.value && !rootEl.value.contains(e.target)) close();
};
document.addEventListener('mousedown', handleOutsideClick);
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleOutsideClick);
  if (currentAbortController) currentAbortController.abort();
});
</script>
