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

    <!-- GeoNames status / tip -->
    <div v-if="mode === 'modern' && !geonamesUsername"
         class="alert alert-info/15 border border-info/30 py-1.5 px-3 text-xs mb-1.5 flex items-center justify-between gap-2 rounded-xl">
      <div class="flex items-center gap-1.5 text-base-content/80 text-[11px]">
        <span>🌍</span>
        <span>
          {{ currentLocale === 'de'
            ? 'Kein GeoNames-Account hinterlegt – Ortssuche via OpenStreetMap aktiv.'
            : 'No GeoNames account configured – searching via OpenStreetMap.' }}
        </span>
      </div>
      <button type="button" class="btn btn-xs btn-ghost border border-base-300/80 gap-1 text-[11px]" @click.stop="openApiSettings">
        🔑 {{ currentLocale === 'de' ? 'GeoNames konfigurieren' : 'Configure GeoNames' }}
      </button>
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
            <span v-if="item.source" class="badge badge-xs text-[9px] uppercase font-mono px-1 shrink-0"
              :class="item.source === 'geonames' ? 'badge-primary' : (item.source === 'pleiades' ? 'badge-warning' : 'badge-ghost')">
              {{ item.source }}
            </span>
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
import { apiCredentials, openApiSettings } from '../utils/sharedState.js';

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

// ── Pleiades & Ancient Findspots (Pleiades / DAI Gazetteer) ─────────────────────
const searchPleiades = async () => {
  const q = query.value.trim();
  if (!q) {
    results.value = [];
    loading.value = false;
    return;
  }

  const combinedResults = [];
  const seenUris = new Set();

  const addResult = (res) => {
    if (!res || !res.name || !res.uri) return;
    if (seenUris.has(res.uri)) return;
    seenUris.add(res.uri);
    combinedResults.push(res);
  };

  // 1. Direct Pleiades Place ID or URL lookup (e.g. "579986" or "https://pleiades.stoa.org/places/579986")
  const idMatch = q.match(/^(?:https?:\/\/pleiades\.stoa\.org\/places\/)?(\d+)\/?$/);
  if (idMatch) {
    const pleiadesId = idMatch[1];
    try {
      const res = await fetch(`https://pleiades.stoa.org/places/${pleiadesId}/json`);
      if (res.ok) {
        const place = await res.json();
        const pt = place.representativePoint || [];
        addResult({
          id: pleiadesId,
          name: place.title || `Pleiades ${pleiadesId}`,
          description: place.description || 'Pleiades Ancient Place',
          uri: `https://pleiades.stoa.org/places/${pleiadesId}`,
          country: '',
          lat: pt.length >= 2 ? String(pt[1]) : '',
          lng: pt.length >= 2 ? String(pt[0]) : '',
          source: 'pleiades',
        });
      }
    } catch (_) {}
  }

  // 2. Fetch via Vite Proxy /api/pleiades/search_rss
  try {
    const proxyUrl = `/api/pleiades/search_rss?SearchableText=${encodeURIComponent(q)}&portal_type=Place&review_state=published`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const text = await res.text();
      const itemBlocks = text.match(/<item[\s\S]*?<\/item>/gi) || [];
      for (const block of itemBlocks.slice(0, 10)) {
        const titleMatch = block.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        const linkMatch = block.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
        const descMatch = block.match(/<description[^>]*>([\s\S]*?)<\/description>/i);
        const pointMatch = block.match(/<(?:[a-zA-Z0-9_-]+:)?point[^>]*>([\s\S]*?)<\/(?:[a-zA-Z0-9_-]+:)?point>/i);

        const title = titleMatch ? titleMatch[1].trim() : '';
        const link = linkMatch ? linkMatch[1].trim() : '';
        const desc = descMatch ? descMatch[1].trim() : '';
        let lat = '', lng = '';
        if (pointMatch && pointMatch[1].trim()) {
          const parts = pointMatch[1].trim().split(/\s+/);
          if (parts.length >= 2) {
            lat = parts[0];
            lng = parts[1];
          }
        }
        if (title && link) {
          const pid = link.replace('https://pleiades.stoa.org/places/', '').replace(/\/$/, '');
          addResult({
            id: pid,
            name: title,
            description: desc,
            uri: link,
            country: '',
            lat,
            lng,
            source: 'pleiades',
          });
        }
      }
    }
  } catch (err) {
    console.warn('Pleiades proxy query notice:', err);
  }

  // 3. Query DAI Archaeological Gazetteer (iDAI.gazetteer - gazetteer.dainst.org)
  // Has native CORS: *, returns coordinates, and cross-references Pleiades IDs!
  try {
    const daiUrl = `https://gazetteer.dainst.org/search.json?q=${encodeURIComponent(q)}&limit=15`;
    const res = await fetch(daiUrl);
    if (res.ok) {
      const data = await res.json();
      const resultsList = data.result || [];
      for (const item of resultsList) {
        const title = item.prefName?.title || item.gazId;
        const coords = item.prefLocation?.coordinates || [];
        const lng = coords[0] !== undefined ? String(coords[0]) : '';
        const lat = coords[1] !== undefined ? String(coords[1]) : '';
        const identifiers = item.identifiers || [];
        const pleiadesEntry = identifiers.find(x => x.context === 'pleiades');
        const pleiadesId = pleiadesEntry ? pleiadesEntry.value : null;
        const uri = pleiadesId 
          ? `https://pleiades.stoa.org/places/${pleiadesId}` 
          : (item['@id'] || `https://gazetteer.dainst.org/place/${item.gazId}`);

        const types = Array.isArray(item.types) ? item.types.join(', ') : '';
        const desc = [
          pleiadesId ? `Pleiades: ${pleiadesId}` : null,
          types || 'Archäologischer Fundort'
        ].filter(Boolean).join(' · ');

        addResult({
          id: pleiadesId || `dai_${item.gazId}`,
          name: title,
          description: desc,
          uri,
          country: '',
          lat,
          lng,
          source: pleiadesId ? 'pleiades' : 'iDAI.gazetteer',
        });
      }
    }
  } catch (err) {
    console.error('DAI gazetteer error:', err);
  }

  results.value = combinedResults.slice(0, 15);
  open.value = results.value.length > 0;
  highlighted.value = 0;
  loading.value = false;
};

// ── GeoNames & OpenStreetMap Fallback ──────────────────────────────────────────
const searchGeoNames = async () => {
  const q = query.value.trim();
  if (!q) {
    results.value = [];
    loading.value = false;
    return;
  }

  const lang = apiCredentials.wikidataLang || 'de';
  const uname = geonamesUsername.value?.trim();

  // 1. Try GeoNames if username is configured
  if (uname) {
    try {
      // Free GeoNames accounts use api.geonames.org (secure.geonames.org requires paid account)
      const endpoint = apiCredentials.geonamesPassword ? 'https://secure.geonames.org' : 'http://api.geonames.org';
      const url = `${endpoint}/searchJSON?q=${encodeURIComponent(q)}&maxRows=12&lang=${lang}&username=${encodeURIComponent(uname)}&type=json`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.status && data.status.message) {
          console.warn('GeoNames API message:', data.status.message);
        } else if (Array.isArray(data.geonames) && data.geonames.length > 0) {
          results.value = data.geonames.map(g => ({
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
          loading.value = false;
          return;
        }
      }
    } catch (e) {
      console.warn('GeoNames fetch error, falling back to OpenStreetMap:', e);
    }
  }

  // 2. OpenStreetMap Nominatim Fallback (Always works, free, global coverage)
  try {
    const osmUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=10&addressdetails=1&accept-language=${lang}`;
    const res = await fetch(osmUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });
    if (res.ok) {
      const osmData = await res.json();
      results.value = (osmData || []).map(item => {
        const addr = item.address || {};
        const country = addr.country || '';
        const shortName = item.name || item.display_name.split(',')[0];
        return {
          id: `osm_${item.osm_type || 'node'}_${item.osm_id || Math.random()}`,
          name: shortName,
          description: item.display_name,
          country: country,
          countryCode: (addr.country_code || '').toUpperCase(),
          adminName1: addr.state || addr.region || '',
          uri: `https://www.openstreetmap.org/${item.osm_type || 'node'}/${item.osm_id}`,
          lat: String(item.lat ?? ''),
          lng: String(item.lon ?? ''),
          source: 'OpenStreetMap',
        };
      });
      open.value = results.value.length > 0;
      highlighted.value = 0;
    }
  } catch (err) {
    console.error('Location search fallback error:', err);
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
