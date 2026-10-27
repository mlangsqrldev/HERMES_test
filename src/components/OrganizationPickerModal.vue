<template>
  <dialog class="modal" :class="{ 'modal-open': isOpen }">
    <div class="modal-box max-w-4xl p-0 overflow-hidden flex flex-col max-h-[90vh] bg-base-100 shadow-2xl border border-base-300">
      
      <!-- Header -->
      <div class="p-5 bg-base-200/80 border-b border-base-300 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shadow-sm">
            🏛️
          </div>
          <div>
            <h3 class="font-bold text-lg leading-tight text-base-content">
              {{ mode === 'manage' 
                ? (locale === 'de' ? 'Organisations- & Institutionen-Pool' : 'Organizations & Institutions Pool')
                : (locale === 'de' ? 'Organisation / Einrichtung auswählen' : 'Select Organization / Institution') }}
            </h3>
            <p class="text-xs text-base-content/60 mt-0.5">
              {{ mode === 'manage'
                ? (locale === 'de' ? 'Zentrale Verwaltung von Museen, Universitäten, 3D-Laboren und Instituten mit GND-Kennungen.' : 'Central management of museums, universities, 3D labs and institutes with GND authority IDs.')
                : (locale === 'de' ? 'Wählen Sie eine Institution mit 1 Klick zur Übernahme von Name und GND-ID.' : 'Select an institution with 1 click to apply its name and GND ID.') }}
            </p>
          </div>
        </div>
        <button type="button" class="btn btn-sm btn-circle btn-ghost" @click="emitClose">✕</button>
      </div>

      <!-- Search & Controls Bar -->
      <div class="p-4 border-b border-base-200 bg-base-100 flex flex-wrap items-center justify-between gap-3">
        <div class="flex-1 min-w-[240px] relative">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            v-model="searchQuery"
            :placeholder="locale === 'de' ? 'Nach Name, GND, Stadt oder Rolle suchen...' : 'Search by name, GND, city or role...'"
            class="input input-sm input-bordered w-full pl-9 focus:border-primary text-xs"
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="btn btn-xs btn-ghost btn-circle absolute right-2 top-1/2 -translate-y-1/2">✕</button>
        </div>

        <!-- Filter Chips -->
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            class="btn btn-xs"
            :class="filterType === 'all' ? 'btn-neutral' : 'btn-ghost border border-base-300'"
            @click="filterType = 'all'"
          >
            {{ locale === 'de' ? 'Alle' : 'All' }} ({{ savedOrganizations.length }})
          </button>
          <button
            type="button"
            class="btn btn-xs"
            :class="filterType === 'museum' ? 'btn-neutral' : 'btn-ghost border border-base-300'"
            @click="filterType = 'museum'"
          >
            🏛️ {{ locale === 'de' ? 'Museen' : 'Museums' }}
          </button>
          <button
            type="button"
            class="btn btn-xs"
            :class="filterType === 'university' ? 'btn-neutral' : 'btn-ghost border border-base-300'"
            @click="filterType = 'university'"
          >
            🎓 {{ locale === 'de' ? 'Unis / Forschung' : 'Universities / Research' }}
          </button>
        </div>

        <!-- Toggle Add Form Button -->
        <button
          type="button"
          class="btn btn-sm btn-outline btn-primary gap-1"
          @click="showAddForm = !showAddForm"
        >
          <span class="text-base font-bold">{{ showAddForm ? '−' : '+' }}</span>
          {{ locale === 'de' ? 'Neue Organisation anlegen' : 'Add Organization' }}
        </button>
      </div>

      <!-- Recently Used Bar -->
      <div v-if="recentOrganizations && recentOrganizations.length > 0" class="px-4 py-2 bg-base-200/50 border-b border-base-200 flex items-center gap-2 flex-wrap">
        <span class="text-[11px] font-bold text-base-content/60 flex items-center gap-1">
          🕒 {{ locale === 'de' ? 'Zuletzt verwendet:' : 'Recently used:' }}
        </span>
        <button
          v-for="rOrg in recentOrganizations.slice(0, 5)"
          :key="rOrg.name"
          type="button"
          class="btn btn-xs btn-outline btn-primary gap-1 shadow-2xs hover:scale-105 transition-transform"
          @click="selectOrganization(rOrg)"
          :title="rOrg.gnd ? `${rOrg.name} (GND: ${rOrg.gnd})` : rOrg.name"
        >
          <span>🏛️</span>
          <span class="truncate max-w-[200px] font-semibold">{{ rOrg.name }}</span>
          <span v-if="rOrg.country" class="badge badge-xs badge-ghost font-mono uppercase text-[9px]">{{ rOrg.country }}</span>
        </button>
      </div>

      <!-- Expandable Add/Edit Form -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2 max-h-0 overflow-hidden"
        enter-to-class="opacity-100 translate-y-0 max-h-[600px]"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0 max-h-[600px]"
        leave-to-class="opacity-0 -translate-y-2 max-h-0 overflow-hidden"
      >
        <div v-if="showAddForm || editingIndex !== null" class="p-4 bg-primary/5 border-b border-primary/20">
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-bold text-sm text-primary flex items-center gap-1.5">
              <span>{{ editingIndex !== null ? '✏️' : '➕' }}</span>
              <span>
                {{ editingIndex !== null 
                  ? (locale === 'de' ? 'Organisation bearbeiten' : 'Edit Organization') 
                  : (locale === 'de' ? 'Neue Organisation zum Pool hinzufügen' : 'Add Organization to Pool') }}
              </span>
            </h4>
            <button type="button" class="btn btn-xs btn-ghost" @click="cancelEditForm">✕</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div class="md:col-span-2">
              <label class="label py-1"><span class="label-text font-bold">{{ locale === 'de' ? 'Name der Organisation / Institution' : 'Organization Name' }} *</span></label>
              <input type="text" v-model="formData.name" required class="input input-sm input-bordered w-full font-medium" :placeholder="locale === 'de' ? 'z. B. Antikensammlung, Staatliche Museen zu Berlin' : 'e.g. British Museum'" />
            </div>

            <div>
              <label class="label py-1"><span class="label-text font-bold">GND-Nummer</span></label>
              <div class="flex gap-1.5">
                <input type="text" v-model="formData.gnd" class="input input-sm input-bordered w-full font-mono text-xs" placeholder="z. B. 5035657-4" @blur="onGndBlur" />
                <button v-if="formData.gnd" type="button" class="btn btn-xs btn-outline" @click="openGndLink(formData.gnd)" title="GND Eintrag auf d-nb.info prüfen">
                  🔗
                </button>
              </div>
            </div>

            <div>
              <label class="label py-1"><span class="label-text font-bold">{{ locale === 'de' ? 'Kategorie / Typ' : 'Type' }}</span></label>
              <select v-model="formData.type" class="select select-sm select-bordered w-full text-xs">
                <option value="museum">{{ locale === 'de' ? 'Museum / Staatliche Sammlung' : 'Museum' }}</option>
                <option value="university">{{ locale === 'de' ? 'Universität / Institut / 3D-Labor' : 'University / Institute' }}</option>
                <option value="research">{{ locale === 'de' ? 'Forschungseinrichtung' : 'Research Institution' }}</option>
                <option value="foundation">{{ locale === 'de' ? 'Stiftung / Körperschaft' : 'Foundation' }}</option>
                <option value="archive">{{ locale === 'de' ? 'Archiv / Bibliothek' : 'Archive / Library' }}</option>
              </select>
            </div>

            <div>
              <label class="label py-1"><span class="label-text font-bold">{{ locale === 'de' ? 'Straße & Hausnummer' : 'Street & Number' }}</span></label>
              <div class="grid grid-cols-3 gap-1.5">
                <input type="text" v-model="formData.roadName" class="input input-sm input-bordered col-span-2 text-xs" :placeholder="locale === 'de' ? 'Straße (z. B. Bodestraße)' : 'Street'" />
                <input type="text" v-model="formData.numberInRoad" class="input input-sm input-bordered col-span-1 text-xs" :placeholder="locale === 'de' ? 'Nr. (1-3)' : 'No.'" />
              </div>
            </div>

            <div>
              <label class="label py-1"><span class="label-text font-bold">{{ locale === 'de' ? 'PLZ & Ort / Stadt' : 'Postcode & City' }}</span></label>
              <div class="grid grid-cols-3 gap-1.5">
                <input type="text" v-model="formData.postcodeOrZipcode" class="input input-sm input-bordered col-span-1 text-xs font-mono" :placeholder="locale === 'de' ? '10178' : 'Postcode'" />
                <input type="text" v-model="formData.city" class="input input-sm input-bordered col-span-2 text-xs" :placeholder="locale === 'de' ? 'Berlin, Bonn, Paris...' : 'City'" />
              </div>
            </div>

            <div>
              <label class="label py-1"><span class="label-text font-bold">{{ locale === 'de' ? 'Gebäude / Liegenschaft' : 'Building Name' }}</span></label>
              <input type="text" v-model="formData.buildingName" class="input input-sm input-bordered w-full text-xs" :placeholder="locale === 'de' ? 'z. B. Altes Museum / Museumsinsel' : 'e.g. Main Building'" />
            </div>

            <div>
              <label class="label py-1"><span class="label-text font-bold">{{ locale === 'de' ? 'Land / Staat' : 'Country' }}</span></label>
              <input type="text" v-model="formData.country" class="input input-sm input-bordered w-full text-xs font-mono uppercase" placeholder="DE, GB, FR, GR..." />
            </div>

            <div class="md:col-span-2">
              <label class="label py-1"><span class="label-text font-bold">{{ locale === 'de' ? 'Typische Rolle / Funktion' : 'Role / Function' }}</span></label>
              <input type="text" v-model="formData.role" class="input input-sm input-bordered w-full text-xs" :placeholder="locale === 'de' ? 'z. B. Verwahrende Institution, 3D-Digitalisierung, Rechteinhaber' : 'e.g. Custodian, Digitisation Specialist'" />
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-4 pt-2 border-t border-primary/10">
            <button type="button" class="btn btn-xs btn-ghost" @click="cancelEditForm">
              {{ locale === 'de' ? 'Abbrechen' : 'Cancel' }}
            </button>
            <button type="button" class="btn btn-xs btn-primary gap-1" @click="saveFormData">
              <span>💾</span>
              {{ editingIndex !== null ? (locale === 'de' ? 'Aktualisieren' : 'Update') : (locale === 'de' ? 'Im Pool speichern' : 'Save to Pool') }}
            </button>
          </div>
        </div>
      </transition>

      <!-- Organizations List -->
      <div class="overflow-y-auto p-4 flex-1 space-y-2">
        <div v-if="filteredOrganizations.length === 0" class="text-center py-12 text-base-content/50">
          <span class="text-3xl block mb-2">🏛️</span>
          <p class="font-bold text-sm">{{ locale === 'de' ? 'Keine Organisationen gefunden' : 'No organizations found' }}</p>
          <p class="text-xs opacity-75 mt-1">{{ locale === 'de' ? 'Passen Sie Ihre Suche an oder legen Sie eine neue Organisation an.' : 'Adjust your search query or add a new organization.' }}</p>
        </div>

        <div
          v-for="(org, idx) in filteredOrganizations"
          :key="org.id || idx"
          class="p-3.5 rounded-xl border border-base-200 bg-base-100 hover:border-primary/40 hover:bg-base-200/40 transition-all flex flex-wrap items-center justify-between gap-3 shadow-xs"
        >
          <!-- Left: Org Info -->
          <div class="flex items-start gap-3 flex-1 min-w-[280px]">
            <div class="w-9 h-9 rounded-lg bg-base-200 border border-base-300 flex items-center justify-center text-base shrink-0 mt-0.5">
              {{ org.type === 'university' ? '🎓' : (org.type === 'foundation' ? '⚖️' : '🏛️') }}
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-bold text-sm text-base-content leading-tight">{{ org.name }}</span>
                <span v-if="org.country" class="badge badge-xs badge-ghost font-mono uppercase">{{ org.country }}</span>
                <span v-if="org.city" class="badge badge-xs badge-outline text-base-content/70">{{ org.city }}</span>
              </div>
              
              <div class="flex items-center gap-2 mt-1.5 flex-wrap">
                <span v-if="org.gnd" class="badge badge-xs badge-primary font-mono gap-1 text-[10px]">
                  🏛️ GND: {{ org.gnd }}
                </span>
                <span v-if="org.role" class="text-xs text-base-content/60 italic">
                  {{ org.role }}
                </span>
                <span v-if="org.roadName || org.buildingName || org.postcodeOrZipcode" class="text-[11px] text-base-content/70 flex items-center gap-1 font-mono">
                  📍 {{ [org.buildingName, org.roadName ? (org.roadName + (org.numberInRoad ? ' ' + org.numberInRoad : '')) : '', org.postcodeOrZipcode, org.city || org.townOrCity].filter(Boolean).join(', ') }}
                </span>
              </div>
            </div>
          </div>

          <!-- Right: Actions -->
          <div class="flex items-center gap-1.5 shrink-0">
            <template v-if="mode === 'pick'">
              <button
                type="button"
                class="btn btn-sm btn-primary gap-1 shadow-xs"
                @click="selectOrganization(org)"
              >
                <span>✓</span>
                {{ locale === 'de' ? 'Auswählen' : 'Select' }}
              </button>
            </template>

            <template v-else>
              <button
                v-if="org.gnd"
                type="button"
                class="btn btn-xs btn-ghost text-base-content/60 hover:text-primary"
                @click="openGndLink(org.gnd)"
                title="GND Eintrag im Web öffnen"
              >
                🔗
              </button>
              <button
                type="button"
                class="btn btn-xs btn-ghost"
                @click="startEdit(org, idx)"
                title="Bearbeiten"
              >
                ✏️
              </button>
              <button
                type="button"
                class="btn btn-xs btn-ghost text-error"
                @click="removeOrganization(idx)"
                title="Entfernen"
              >
                🗑️
              </button>
            </template>
          </div>
        </div>
      </div>

      <!-- Footer Bar -->
      <div class="p-3 bg-base-200/50 border-t border-base-200 flex items-center justify-between text-xs text-base-content/60">
        <div class="flex items-center gap-2">
          <span>{{ savedOrganizations.length }} {{ locale === 'de' ? 'Organisationen im Pool' : 'organizations in pool' }}</span>
          <span class="opacity-40">•</span>
          <a href="https://lobid.org/gnd" target="_blank" rel="noopener" class="link link-hover text-primary font-medium flex items-center gap-1">
            GND Katalog (Lobid) ↗
          </a>
        </div>
        <button type="button" class="btn btn-xs btn-ghost" @click="emitClose">
          {{ locale === 'de' ? 'Schließen' : 'Close' }}
        </button>
      </div>

    </div>
    <form method="dialog" class="modal-backdrop" @click="emitClose"><button>close</button></form>
  </dialog>
</template>

<script setup>
import { ref, computed, reactive, inject } from 'vue';
import {
  savedOrganizations,
  recentOrganizations,
  recordRecentOrganization,
  addOrUpdateOrganization,
  removeSavedOrganization,
  updateSavedOrganization
} from '../utils/sharedState.js';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String,
    default: 'manage' // 'manage' or 'pick'
  },
  currentLocale: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close', 'select']);

const injectedLocale = inject('currentLocale', ref('de'));
const locale = computed(() => props.currentLocale || injectedLocale.value || 'de');

const searchQuery = ref('');
const filterType = ref('all');
const showAddForm = ref(false);
const editingIndex = ref(null);

const formData = reactive({
  id: '',
  name: '',
  gnd: '',
  uri: '',
  country: 'DE',
  city: '',
  townOrCity: '',
  buildingName: '',
  roadName: '',
  numberInRoad: '',
  postcodeOrZipcode: '',
  role: '',
  type: 'museum',
  organization: ''
});

const resetFormData = () => {
  formData.id = '';
  formData.name = '';
  formData.gnd = '';
  formData.uri = '';
  formData.country = 'DE';
  formData.city = '';
  formData.townOrCity = '';
  formData.buildingName = '';
  formData.roadName = '';
  formData.numberInRoad = '';
  formData.postcodeOrZipcode = '';
  formData.role = '';
  formData.type = 'museum';
  formData.organization = '';
  editingIndex.value = null;
  showAddForm.value = false;
};

const onGndBlur = () => {
  if (formData.gnd) {
    formData.gnd = String(formData.gnd).trim();
    if (!formData.uri) {
      formData.uri = `https://d-nb.info/gnd/${formData.gnd}`;
    }
  }
};

const openGndLink = (gnd) => {
  if (!gnd) return;
  const url = `https://d-nb.info/gnd/${encodeURIComponent(gnd)}`;
  window.open(url, '_blank');
};

const filteredOrganizations = computed(() => {
  let list = (savedOrganizations.value || []).filter(Boolean);

  if (filterType.value !== 'all') {
    list = list.filter(o => o && o.type === filterType.value);
  }

  if (searchQuery.value && searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(o => 
      o && (
        String(o.name || '').toLowerCase().includes(q) ||
        String(o.gnd || '').toLowerCase().includes(q) ||
        String(o.city || '').toLowerCase().includes(q) ||
        String(o.role || '').toLowerCase().includes(q)
      )
    );
  }

  return list;
});

const saveFormData = () => {
  if (!formData.name.trim()) return;

  onGndBlur();

  if (editingIndex.value !== null) {
    updateSavedOrganization(editingIndex.value, { ...formData });
  } else {
    addOrUpdateOrganization({ ...formData });
  }

  resetFormData();
};

const startEdit = (org, index) => {
  editingIndex.value = index;
  Object.assign(formData, org);
  showAddForm.value = true;
};

const cancelEditForm = () => {
  resetFormData();
};

const removeOrganization = (index) => {
  removeSavedOrganization(index);
};

const selectOrganization = (org) => {
  if (org) {
    recordRecentOrganization(org);
  }
  emit('select', org);
  emitClose();
};

const emitClose = () => {
  cancelEditForm();
  searchQuery.value = '';
  emit('close');
};
</script>
