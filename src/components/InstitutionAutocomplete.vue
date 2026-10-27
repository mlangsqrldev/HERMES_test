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
          :class="inputClass || 'input input-sm input-bordered w-full pr-8 text-xs'"
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
import { savedOrganizations } from '../utils/sharedState.js';

const props = defineProps({
  modelValue: { type: String, default: '' },
  inputId: { type: String, default: 'institution-autocomplete' },
  placeholder: { type: String, default: '' },
  inputClass: { type: String, default: '' },
  emitMode: { type: String, default: 'label' }, // 'label' | 'gnd' | 'uri'
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
  if (val !== undefined && val !== null && val !== query.value) {
    query.value = val;
  }
}, { immediate: true });

const onFocus = () => {
  if (results.value.length && query.value.length >= 2) open.value = true;
};

const onInput = () => {
  chosenItem.value = null;
  emit('update:modelValue', query.value);
  clearTimeout(debounceTimer);
  if (query.value.trim().length < 2) {
    results.value = [];
    open.value = false;
    loading.value = false;
    return;
  }
  loading.value = true;
  debounceTimer = setTimeout(searchGND, 200);
};

// Curated instant-response cultural heritage institutions
const CURATED_INSTITUTIONS = [
  {
    id: '5035657-4',
    gnd: '5035657-4',
    label: 'Antikensammlung, Staatliche Museen zu Berlin',
    place: 'Berlin',
    category: 'Museum, Sammlung',
    description: 'Bodestraße 1-3, 10178 Berlin · Staatliche Museen zu Berlin',
    uri: 'https://d-nb.info/gnd/5035657-4'
  },
  {
    id: '35353-X',
    gnd: '35353-X',
    label: 'Staatliche Museen zu Berlin, Stiftung Preußischer Kulturbesitz',
    place: 'Berlin',
    category: 'Museumsverbund',
    description: 'Stauffenbergstraße 41, 10785 Berlin',
    uri: 'https://d-nb.info/gnd/35353-X'
  },
  {
    id: '5035655-0',
    gnd: '5035655-0',
    label: 'Ägyptisches Museum und Papyrussammlung, Staatliche Museen zu Berlin',
    place: 'Berlin',
    category: 'Museum, Sammlung',
    description: 'Bodestraße 1-3, 10178 Berlin',
    uri: 'https://d-nb.info/gnd/5035655-0'
  },
  {
    id: '5035656-2',
    gnd: '5035656-2',
    label: 'Vorderasiatisches Museum, Staatliche Museen zu Berlin',
    place: 'Berlin',
    category: 'Museum, Sammlung',
    description: 'Bodestraße 1-3, 10178 Berlin',
    uri: 'https://d-nb.info/gnd/5035656-2'
  },
  {
    id: '5035658-6',
    gnd: '5035658-6',
    label: 'Münzkabinett, Staatliche Museen zu Berlin',
    place: 'Berlin',
    category: 'Museum, Sammlung',
    description: 'Bodestraße 1-3, 10178 Berlin',
    uri: 'https://d-nb.info/gnd/5035658-6'
  },
  {
    id: '36150-1',
    gnd: '36150-1',
    label: 'Bonn Center for Digital Humanities, Universität Bonn',
    place: 'Bonn',
    category: 'Forschungsinstitut, Universität',
    description: 'Am Hof 1, 53113 Bonn · Rheinische Friedrich-Wilhelms-Universität',
    uri: 'https://d-nb.info/gnd/36150-1'
  },
  {
    id: '2019912-1',
    gnd: '2019912-1',
    label: 'LVR-LandesMuseum Bonn (Rheinisches Landesmuseum)',
    place: 'Bonn',
    category: 'Museum',
    description: 'Colmantstraße 14-16, 53115 Bonn',
    uri: 'https://d-nb.info/gnd/2019912-1'
  },
  {
    id: '1007926-9',
    gnd: '1007926-9',
    label: 'Deutsches Archäologisches Institut (DAI)',
    place: 'Berlin',
    category: 'Forschungsinstitut',
    description: 'Podbielskiallee 69-71, 14195 Berlin',
    uri: 'https://d-nb.info/gnd/1007926-9'
  },
  {
    id: '1009028-9',
    gnd: '1009028-9',
    label: 'Leibniz-Zentrum für Archäologie (LEIZA) / RGZM',
    place: 'Mainz',
    category: 'Forschungsinstitut, Museum',
    description: 'Ludwig-Lindenschmit-Forum 1, 55116 Mainz',
    uri: 'https://d-nb.info/gnd/1009028-9'
  },
  {
    id: '2005521-3',
    gnd: '2005521-3',
    label: 'Bayerisches Nationalmuseum',
    place: 'München',
    category: 'Museum',
    description: 'Prinzregentenstraße 3, 80538 München',
    uri: 'https://d-nb.info/gnd/2005521-3'
  },
  {
    id: '10041280-9',
    gnd: '10041280-9',
    label: 'Archäologische Staatssammlung München',
    place: 'München',
    category: 'Museum, Archäologie',
    description: 'Lerchenfeldstraße 2, 80538 München',
    uri: 'https://d-nb.info/gnd/10041280-9'
  },
  {
    id: '38352-1',
    gnd: '38352-1',
    label: 'British Museum',
    place: 'London',
    category: 'Museum',
    description: 'Great Russell St, London WC1B 3DG',
    uri: 'https://d-nb.info/gnd/38352-1'
  },
  {
    id: '1087308992',
    gnd: '1087308992',
    label: 'Musée du Louvre',
    place: 'Paris',
    category: 'Museum',
    description: 'Rue de Rivoli, 75001 Paris',
    uri: 'https://d-nb.info/gnd/1087308992'
  }
];

// --- Lobid-GND API query for corporate bodies (museums, archives, collections, universities) ---
const searchGND = async () => {
  const q = query.value.trim();
  if (q.length < 2) {
    loading.value = false;
    return;
  }

  // 1. Instant match from saved organizations pool + curated institutions
  const qLower = q.toLowerCase();
  const poolMatches = (savedOrganizations?.value || []).filter(Boolean).map(org => ({
    id: org.gnd ? String(org.gnd) : (org.id || ''),
    gnd: org.gnd ? String(org.gnd) : '',
    label: org.name || '',
    place: org.city || '',
    category: org.role || org.type || 'Organisation',
    description: [org.city, org.role].filter(Boolean).join(' · '),
    uri: org.uri || (org.gnd ? `https://d-nb.info/gnd/${org.gnd}` : '')
  })).filter(inst =>
    String(inst.label || '').toLowerCase().includes(qLower) ||
    (inst.gnd && inst.gnd.includes(q)) ||
    (inst.place && String(inst.place).toLowerCase().includes(qLower)) ||
    (inst.description && String(inst.description).toLowerCase().includes(qLower))
  );

  const curatedMatches = CURATED_INSTITUTIONS.filter(inst => 
    String(inst.label || '').toLowerCase().includes(qLower) ||
    String(inst.gnd || '').includes(q) ||
    (inst.place && String(inst.place).toLowerCase().includes(qLower)) ||
    (inst.description && String(inst.description).toLowerCase().includes(qLower))
  );

  const instantMatches = [...poolMatches];
  curatedMatches.forEach(c => {
    if (!instantMatches.some(m => (m.gnd && m.gnd === c.gnd) || String(m.label || '').toLowerCase() === String(c.label || '').toLowerCase())) {
      instantMatches.push(c);
    }
  });

  if (instantMatches.length > 0) {
    results.value = [...instantMatches];
    open.value = true;
    highlighted.value = 0;
  }

  // Check cache
  if (queryCache.has(q)) {
    const cached = queryCache.get(q);
    const merged = [...instantMatches];
    cached.forEach(c => {
      if (!merged.some(m => m.id === c.id)) merged.push(c);
    });
    results.value = merged;
    open.value = results.value.length > 0;
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
        isil: null,
      };
    }).filter(r => r.label && r.label !== r.id);

    const merged = [...instantMatches];
    mapped.forEach(c => {
      if (!merged.some(m => m.id === c.id)) merged.push(c);
    });

    queryCache.set(q, merged);
    results.value = merged;
    open.value = results.value.length > 0;
    highlighted.value = 0;
  } catch (e) {
    if (e.name !== 'AbortError') {
      console.warn('Lobid GND search notice:', e);
      if (instantMatches.length > 0) {
        results.value = instantMatches;
        open.value = true;
      } else {
        results.value = [];
      }
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
