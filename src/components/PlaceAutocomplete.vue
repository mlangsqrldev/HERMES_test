<template>
  <div class="relative w-full" ref="rootEl">

    <!-- Mode Tabs (shown when both are allowed) -->
    <div v-if="allowedModes === 'both'" class="flex gap-1 mb-1.5">
      <button
        type="button"
        class="btn btn-xs gap-1"
        :class="mode === 'ancient' ? 'btn-warning' : 'btn-ghost border border-base-300 opacity-60 hover:opacity-100'"
        @click="mode = 'ancient'; clear()"
      >
        🏛️ {{ currentLocale === 'de' ? 'Antik / Fundort (Pleiades)' : 'Ancient / Findspot (Pleiades)' }}
      </button>
      <button
        type="button"
        class="btn btn-xs gap-1"
        :class="mode === 'modern' ? 'btn-info' : 'btn-ghost border border-base-300 opacity-60 hover:opacity-100'"
        @click="mode = 'modern'; clear()"
      >
        🌍 {{ currentLocale === 'de' ? 'Modern / Geodaten (GeoNames)' : 'Modern / Geodata (GeoNames)' }}
      </button>
    </div>

    <!-- Fixed mode badge (when locked to one mode) -->
    <div v-else class="mb-1.5 flex items-center gap-1.5">
      <span v-if="mode === 'ancient'" class="badge badge-warning badge-xs font-semibold gap-1 py-1 px-2">
        🏛️ {{ currentLocale === 'de' ? 'Fundort via Pleiades' : 'Findspot via Pleiades' }}
      </span>
      <span v-else class="badge badge-info badge-xs font-semibold gap-1 py-1 px-2">
        🌍 {{ currentLocale === 'de' ? 'Moderne Geodaten via GeoNames' : 'Modern geodata via GeoNames' }}
      </span>
    </div>

    <!-- GeoNames warning if no username -->
    <div v-if="mode === 'modern' && !geonamesUsername"
         class="alert alert-warning alert-sm py-1.5 px-3 text-xs mb-1.5 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
      <span>
        {{ currentLocale === 'de'
          ? 'Kein GeoNames-Benutzername konfiguriert. Bitte unter API-Zugangsdaten eintragen.'
          : 'No GeoNames username configured. Please set it under API Credentials.' }}
      </span>
    </div>

    <!-- Input -->
    <div class="relative">
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
        :placeholder="computedPlaceholder"
        :disabled="mode === 'modern' && !geonamesUsername"
        class="input input-sm input-bordered w-full pr-8 text-xs"
        autocomplete="off"
      />
      <span class="absolute right-2 top-1/2 -translate-y-1/2">
        <svg v-if="loading" class="animate-spin size-3.5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"/>
        </svg>
        <button v-else-if="query" type="button" @click="clear" class="text-base-content/40 hover:text-base-content text-sm">✕</button>
      </span>
    </div>

    <!-- Chosen badge -->
    <div v-if="chosenItem" class="mt-1.5 flex items-center gap-1.5 flex-wrap">
      <div class="flex items-center gap-1 bg-info/10 border border-info/30 rounded-lg px-2 py-0.5 text-xs max-w-full">
        <span class="text-sm">{{ mode === 'ancient' ? '🏛️' : '🌍' }}</span>
        <span class="font-semibold truncate max-w-[200px]" :title="chosenItem.name">{{ chosenItem.name }}</span>
        <span v-if="chosenItem.country" class="opacity-60 text-[11px]">({{ chosenItem.country }})</span>
        <span v-if="chosenItem.lat && chosenItem.lng" class="text-[10px] font-mono opacity-70 ml-1">
          📍 {{ Number(chosenItem.lat).toFixed(4) }}, {{ Number(chosenItem.lng).toFixed(4) }}
        </span>
        <a :href="chosenItem.uri" target="_blank" class="ml-1 opacity-60 hover:opacity-100 text-[10px]" title="Link öffnen">↗</a>
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
        :class="highlighted === i ? 'bg-info/10 text-info' : 'hover:bg-base-200'"
      >
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-1.5 min-w-0">
            <span class="text-base shrink-0">{{ mode === 'ancient' ? '🏛️' : '🌍' }}</span>
            <span class="font-semibold text-sm leading-tight truncate">{{ item.name }}</span>
            <span v-if="item.country" class="text-[11px] opacity-60 shrink-0 font-medium">({{ item.country }})</span>
          </div>
          <span v-if="item.lat && item.lng" class="text-[10px] font-mono opacity-50 shrink-0 ml-2">
            📍 {{ Number(item.lat).toFixed(3) }}, {{ Number(item.lng).toFixed(3) }}
          </span>
        </div>
        <span v-if="item.description" class="text-[11px] text-base-content/65 line-clamp-1 ml-6">{{ item.description }}</span>
        <span class="text-[10px] font-mono text-base-content/40 ml-6 truncate">{{ item.uri }}</span>
      </li>
    </ul>

    <!-- No results -->
    <div v-if="open && !loading && query.length >= 2 && results.length === 0"
         class="absolute z-50 mt-1 w-full bg-base-100 border border-base-200 rounded-xl shadow-lg px-3 py-2 text-xs text-base-content/60 italic">
      {{ currentLocale === 'de' ? 'Kein Ort gefunden.' : 'No place found.' }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, inject, onBeforeUnmount } from 'vue';
import { apiCredentials } from '../utils/sharedState.js';

const props = defineProps({
  modelValue: { type: String, default: '' },
  inputId: { type: String, default: 'place-autocomplete' },
  defaultMode: { type: String, default: 'ancient' }, // 'ancient' | 'modern'
  allowedModes: { type: String, default: 'both' },   // 'both' | 'ancient' | 'modern'
  placeholder: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue', 'select']);

const currentLocale = inject('currentLocale', ref('de'));
const geonamesUsername = computed(() => apiCredentials.geonamesUsername || '');

const mode = ref(props.allowedModes !== 'both' ? props.allowedModes : props.defaultMode);
const query = ref('');
const results = ref([]);
const loading = ref(false);
const open = ref(false);
const highlighted = ref(0);
const chosenItem = ref(null);
const rootEl = ref(null);
let debounceTimer = null;

const computedPlaceholder = computed(() => {
  if (props.placeholder) return props.placeholder;
  if (mode.value === 'ancient') {
    return currentLocale.value === 'de' ? 'Antiken Fundort suchen (Pleiades)...' : 'Search ancient findspot (Pleiades)...';
  }
  return currentLocale.value === 'de' ? 'Modernen Ort suchen (GeoNames)...' : 'Search modern place (GeoNames)...';
});

watch(() => props.modelValue, (val) => {
  if (!chosenItem.value && val) query.value = val;
}, { immediate: true });

const onFocus = () => {
  if (results.value.length && query.value.length >= 2) open.value = true;
};

const onInput = () => {
  chosenItem.value = null;
  clearTimeout(debounceTimer);
  if (query.value.length < 2) {
    results.value = [];
    open.value = false;
    return;
  }
  loading.value = true;
  debounceTimer = setTimeout(() => {
    if (mode.value === 'ancient') searchPleiades();
    else searchGeoNames();
  }, 450);
};

// ── Pleiades ──────────────────────────────────────────────────────────────────
const searchPleiades = async () => {
  try {
    const url = `https://pleiades.stoa.org/search_rss?SearchableText=${encodeURIComponent(query.value)}&portal_type=Place&review_state=published`;
    const res = await fetch(url);
    const text = await res.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'application/xml');
    const items = Array.from(xml.querySelectorAll('item'));
    results.value = items.slice(0, 12).map(item => {
      const link = item.querySelector('link')?.textContent?.trim() || '';
      const id = link.replace('https://pleiades.stoa.org/places/', '').replace(/\/$/, '');
      const pointEl = item.getElementsByTagNameNS('http://www.georss.org/georss', 'point')[0]
        || item.querySelector('point');
      const pointText = pointEl?.textContent?.trim() || '';
      let lat = '', lng = '';
      if (pointText) {
        const parts = pointText.split(/\s+/);
        if (parts.length >= 2) {
          lat = parts[0];
          lng = parts[1];
        }
      }
      return {
        id,
        name: item.querySelector('title')?.textContent?.trim() || id,
        description: item.querySelector('description')?.textContent?.trim() || '',
        uri: link,
        country: '',
        lat,
        lng,
        source: 'pleiades',
      };
    }).filter(r => r.name && r.uri);
    open.value = results.value.length > 0;
    highlighted.value = 0;
  } catch (e) {
    console.error('Pleiades search error:', e);
    results.value = [];
  } finally {
    loading.value = false;
  }
};

// ── GeoNames ──────────────────────────────────────────────────────────────────
const searchGeoNames = async () => {
  if (!geonamesUsername.value) {
    loading.value = false;
    return;
  }
  try {
    const lang = apiCredentials.wikidataLang || 'de';
    const url = `https://secure.geonames.org/searchJSON?q=${encodeURIComponent(query.value)}&maxRows=12&lang=${lang}&username=${geonamesUsername.value}&type=json`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.status) throw new Error(data.status.message);
    results.value = (data.geonames || []).map(g => ({
      id: String(g.geonameId),
      name: g.name,
      description: [g.fcodeName, g.adminName1, g.countryName].filter(Boolean).join(', '),
      country: g.countryName || g.countryCode || '',
      countryCode: g.countryCode || '',
      adminName1: g.adminName1 || '',
      uri: `https://www.geonames.org/${g.geonameId}`,
      lat: String(g.lat ?? ''),
      lng: String(g.lng ?? ''),
      source: 'geonames',
    }));
    open.value = results.value.length > 0;
    highlighted.value = 0;
  } catch (e) {
    console.error('GeoNames search error:', e);
    results.value = [];
  } finally {
    loading.value = false;
  }
};

const select = (item) => {
  chosenItem.value = item;
  query.value = item.name;
  open.value = false;
  emit('update:modelValue', item.uri);
  emit('select', item);
};

const selectHighlighted = () => {
  if (open.value && results.value[highlighted.value]) select(results.value[highlighted.value]);
};

const moveDown = () => { if (highlighted.value < results.value.length - 1) highlighted.value++; };
const moveUp = () => { if (highlighted.value > 0) highlighted.value--; };
const close = () => { open.value = false; };
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

const handleOutsideClick = (e) => {
  if (rootEl.value && !rootEl.value.contains(e.target)) close();
};
document.addEventListener('mousedown', handleOutsideClick);
onBeforeUnmount(() => document.removeEventListener('mousedown', handleOutsideClick));
</script>
