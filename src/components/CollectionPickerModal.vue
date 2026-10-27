<template>
  <dialog class="modal" :class="{ 'modal-open': isOpen }">
    <div class="modal-box max-w-4xl p-0 overflow-hidden flex flex-col max-h-[90vh] bg-base-100 shadow-2xl border border-base-300">
      
      <!-- Header -->
      <div class="p-5 bg-base-200/80 border-b border-base-300 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center font-bold text-lg shadow-sm">
            📂
          </div>
          <div>
            <h3 class="font-bold text-lg leading-tight text-base-content">
              {{ mode === 'manage' 
                ? (locale === 'de' ? 'Sammlungs-Pool (Collections) verwalten' : 'Manage Collections Pool')
                : (locale === 'de' ? 'Sammlung / Collection auswählen' : 'Select Collection') }}
            </h3>
            <p class="text-xs text-base-content/60 mt-0.5">
              {{ mode === 'manage'
                ? (locale === 'de' ? 'Zentrale Profile und Metadaten-Vorlagen für Sammlungen, Ensembles und Archivkörper.' : 'Central profiles and metadata templates for collections, ensembles, and archival corpora.')
                : (locale === 'de' ? 'Wählen Sie ein Sammlungs-Profil zur sofortigen Übernahme aller Basisdaten in Sektion 01.' : 'Select a collection profile to populate all baseline metadata in Section 01.') }}
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
            :placeholder="locale === 'de' ? 'Nach Titel, Sammlungs-ID oder Institution suchen...' : 'Search by title, collection ID or institution...'"
            class="input input-sm input-bordered w-full pl-9 focus:border-primary text-xs"
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="btn btn-xs btn-ghost btn-circle absolute right-2 top-1/2 -translate-y-1/2">✕</button>
        </div>

        <div class="flex items-center gap-2">
          <!-- Button to save current active collection into pool -->
          <button
            v-if="currentFormData && (currentFormData['id'] || currentFormData['source'])"
            type="button"
            class="btn btn-sm btn-outline btn-accent gap-1 text-xs"
            @click="saveCurrentFormToPool"
            :title="locale === 'de' ? 'Aktuell im Formular eingegebene Sammlung als Vorlage im Pool speichern' : 'Save current form values into the pool'"
          >
            <span>💾</span>
            {{ locale === 'de' ? 'Aktuelle Sammlung merken' : 'Save Current Collection' }}
          </button>

          <!-- Toggle Add Form -->
          <button
            type="button"
            class="btn btn-sm btn-outline btn-primary gap-1 text-xs"
            @click="showAddForm = !showAddForm"
          >
            <span class="text-base font-bold">{{ showAddForm ? '−' : '+' }}</span>
            {{ locale === 'de' ? 'Neue Sammlung' : 'New Collection' }}
          </button>
        </div>
      </div>

      <!-- Expandable Add/Edit Form -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2 max-h-0 overflow-hidden"
        enter-to-class="opacity-100 translate-y-0 max-h-[700px]"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0 max-h-[700px]"
        leave-to-class="opacity-0 -translate-y-2 max-h-0 overflow-hidden"
      >
        <div v-if="showAddForm || editingIndex !== null" class="p-4 bg-accent/5 border-b border-accent/20">
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-bold text-sm text-accent flex items-center gap-1.5">
              <span>{{ editingIndex !== null ? '✏️' : '➕' }}</span>
              <span>
                {{ editingIndex !== null 
                  ? (locale === 'de' ? 'Sammlung bearbeiten' : 'Edit Collection') 
                  : (locale === 'de' ? 'Neues Sammlungs-Profil anlegen' : 'Create New Collection Profile') }}
              </span>
            </h4>
            <button type="button" class="btn btn-xs btn-ghost" @click="cancelEditForm">✕</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label class="label py-1"><span class="label-text font-bold">{{ locale === 'de' ? 'Sammlungs-Identifikator (ID)' : 'Collection ID' }} *</span></label>
              <input type="text" v-model="formData.id" required class="input input-sm input-bordered w-full font-mono text-xs" placeholder="z. B. DE-MUS-814111_Collection_Skulpturen" />
            </div>

            <div>
              <label class="label py-1"><span class="label-text font-bold">{{ locale === 'de' ? 'Verwahrende Einrichtung / Quelle' : 'Source Institution' }}</span></label>
              <input type="text" v-model="formData.source" class="input input-sm input-bordered w-full text-xs" placeholder="z. B. Antikensammlung, Staatliche Museen zu Berlin" />
            </div>

            <div class="md:col-span-2">
              <label class="label py-1"><span class="label-text font-bold">{{ locale === 'de' ? 'Titel der Sammlung (Hauptsprache DE)' : 'Collection Title (Primary)' }} *</span></label>
              <input type="text" v-model="formData.title" required class="input input-sm input-bordered w-full font-medium" placeholder="z. B. Skulpturen und Grabmonumente der klassischen Antike" />
            </div>

            <div class="md:col-span-2">
              <label class="label py-1"><span class="label-text font-bold">{{ locale === 'de' ? 'Englischer Titel (optional)' : 'English Title (optional)' }}</span></label>
              <input type="text" v-model="formData.titleEn" class="input input-sm input-bordered w-full text-xs" placeholder="e.g. Classical Antiquity Sculptures and Funerary Monuments" />
            </div>

            <div class="md:col-span-2">
              <label class="label py-1"><span class="label-text font-bold">{{ locale === 'de' ? 'Kuratierungs-Statement / Beschreibung' : 'Curation Statement' }}</span></label>
              <textarea v-model="formData.statement" rows="2" class="textarea textarea-sm textarea-bordered w-full text-xs" placeholder="Kurze Beschreibung des Sammlungsprofils..."></textarea>
            </div>

            <div>
              <label class="label py-1"><span class="label-text font-bold">{{ locale === 'de' ? 'Standard-Lizenz / Rechte' : 'Rights & License' }}</span></label>
              <input type="text" v-model="formData.rights" class="input input-sm input-bordered w-full text-xs" placeholder="CC BY-SA 4.0" />
            </div>

            <div>
              <label class="label py-1"><span class="label-text font-bold">{{ locale === 'de' ? 'Schlagwörter (kommagetrennt)' : 'Keywords (comma-separated)' }}</span></label>
              <input type="text" v-model="keywordsInput" class="input input-sm input-bordered w-full text-xs" placeholder="Skulptur, Relief, Marmor, 3D" />
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-4 pt-2 border-t border-accent/10">
            <button type="button" class="btn btn-xs btn-ghost" @click="cancelEditForm">
              {{ locale === 'de' ? 'Abbrechen' : 'Cancel' }}
            </button>
            <button type="button" class="btn btn-xs btn-accent gap-1" @click="saveFormData">
              <span>💾</span>
              {{ editingIndex !== null ? (locale === 'de' ? 'Aktualisieren' : 'Update') : (locale === 'de' ? 'Im Pool speichern' : 'Save to Pool') }}
            </button>
          </div>
        </div>
      </transition>

      <!-- Collections List -->
      <div class="overflow-y-auto p-4 flex-1 space-y-3">
        <div v-if="filteredCollections.length === 0" class="text-center py-12 text-base-content/50">
          <span class="text-3xl block mb-2">📂</span>
          <p class="font-bold text-sm">{{ locale === 'de' ? 'Keine Sammlungen gefunden' : 'No collections found' }}</p>
          <p class="text-xs opacity-75 mt-1">{{ locale === 'de' ? 'Legen Sie ein neues Profil an oder merken Sie die aktuelle Sammlung.' : 'Add a new profile or save the current collection.' }}</p>
        </div>

        <div
          v-for="(col, idx) in filteredCollections"
          :key="col.id || idx"
          class="p-4 rounded-xl border border-base-200 bg-base-100 hover:border-accent/40 hover:bg-base-200/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
        >
          <!-- Left: Collection Details -->
          <div class="space-y-1.5 flex-1 min-w-[280px]">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="badge badge-sm badge-accent font-mono text-[10px]">{{ col.id }}</span>
              <span v-if="col.source" class="badge badge-sm badge-outline text-base-content/75 text-[11px]">
                🏛️ {{ col.source }}
              </span>
              <span v-if="col.rights" class="badge badge-sm badge-ghost font-mono text-[10px]">
                ⚖️ {{ col.rights }}
              </span>
            </div>

            <h4 class="font-bold text-base text-base-content leading-snug">
              {{ col.title }}
            </h4>

            <p v-if="col.titleEn && col.titleEn !== col.title" class="text-xs text-base-content/60 italic">
              {{ col.titleEn }}
            </p>

            <p v-if="col.statement" class="text-xs text-base-content/75 line-clamp-2 mt-1">
              {{ col.statement }}
            </p>

            <!-- Keywords Chips -->
            <div v-if="col.keywords && col.keywords.length > 0" class="flex flex-wrap gap-1 pt-1">
              <span
                v-for="(kw, kIdx) in col.keywords.slice(0, 6)"
                :key="kIdx"
                class="badge badge-xs bg-base-200 border-base-300 text-[10px]"
              >
                #{{ kw }}
              </span>
              <span v-if="col.keywords.length > 6" class="text-[10px] opacity-50">
                +{{ col.keywords.length - 6 }}
              </span>
            </div>
          </div>

          <!-- Right: Actions -->
          <div class="flex sm:flex-col items-end gap-2 shrink-0 w-full sm:w-auto justify-end">
            <button
              type="button"
              class="btn btn-sm btn-accent gap-1.5 shadow-xs w-full sm:w-auto"
              @click="selectCollection(col)"
              :title="locale === 'de' ? 'Diese Sammlung in Sektion 01 übernehmen' : 'Apply this collection to Section 01'"
            >
              <span>✓</span>
              {{ mode === 'pick' ? (locale === 'de' ? 'Übernehmen' : 'Select') : (locale === 'de' ? 'In Editor laden' : 'Load into Editor') }}
            </button>

            <div class="flex items-center gap-1">
              <button
                type="button"
                class="btn btn-xs btn-ghost"
                @click="startEdit(col, idx)"
                title="Bearbeiten"
              >
                ✏️
              </button>
              <button
                type="button"
                class="btn btn-xs btn-ghost text-error"
                @click="removeCollection(idx)"
                title="Löschen"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Bar -->
      <div class="p-3 bg-base-200/50 border-t border-base-200 flex items-center justify-between text-xs text-base-content/60">
        <span>{{ savedCollections.length }} {{ locale === 'de' ? 'Sammlungs-Profile im Pool' : 'collection profiles in pool' }}</span>
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
  savedCollections,
  addOrUpdateCollection,
  removeSavedCollection,
  updateSavedCollection
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
  },
  currentFormData: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'select']);

const injectedLocale = inject('currentLocale', ref('de'));
const locale = computed(() => props.currentLocale || injectedLocale.value || 'de');

const searchQuery = ref('');
const showAddForm = ref(false);
const editingIndex = ref(null);
const keywordsInput = ref('');

const formData = reactive({
  id: '',
  title: '',
  titleEn: '',
  source: '',
  sourceGnd: '',
  statement: '',
  rights: 'CC BY-SA 4.0',
  coveragePeriod: '',
  keywords: []
});

const resetFormData = () => {
  formData.id = '';
  formData.title = '';
  formData.titleEn = '';
  formData.source = '';
  formData.sourceGnd = '';
  formData.statement = '';
  formData.rights = 'CC BY-SA 4.0';
  formData.coveragePeriod = '';
  formData.keywords = [];
  keywordsInput.value = '';
  editingIndex.value = null;
  showAddForm.value = false;
};

const filteredCollections = computed(() => {
  let list = (savedCollections.value || []).filter(Boolean);

  if (searchQuery.value && searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(c => 
      c && (
        String(c.title || '').toLowerCase().includes(q) ||
        String(c.titleEn || '').toLowerCase().includes(q) ||
        String(c.id || '').toLowerCase().includes(q) ||
        String(c.source || '').toLowerCase().includes(q) ||
        String(c.statement || '').toLowerCase().includes(q) ||
        (Array.isArray(c.keywords) && c.keywords.some(k => String(k || '').toLowerCase().includes(q)))
      )
    );
  }

  return list;
});

const saveFormData = () => {
  if (!formData.title.trim() && !formData.id.trim()) return;

  const kwList = keywordsInput.value
    ? keywordsInput.value.split(',').map(s => s.trim()).filter(Boolean)
    : (Array.isArray(formData.keywords) ? formData.keywords : []);

  const payload = {
    ...formData,
    keywords: kwList
  };

  if (editingIndex.value !== null) {
    updateSavedCollection(editingIndex.value, payload);
  } else {
    addOrUpdateCollection(payload);
  }

  resetFormData();
};

const saveCurrentFormToPool = () => {
  if (!props.currentFormData) return;
  const f = props.currentFormData;
  
  let primaryTitle = '';
  let enTitle = '';
  if (Array.isArray(f['title']) && f['title'].length > 0) {
    const pref = f['title'].find(t => t && t['title#preferred']);
    primaryTitle = pref?._value || f['title'][0]?._value || '';
    const en = f['title'].find(t => t && t['title#lang'] === 'en');
    if (en) enTitle = en._value;
  } else if (typeof f['title'] === 'string') {
    primaryTitle = f['title'];
  }

  const payload = {
    id: f['id'] || `COL-${Date.now()}`,
    title: primaryTitle || f['id'] || 'Sammlung',
    titleEn: enTitle,
    source: f['source'] || '',
    sourceGnd: '',
    statement: f['statement'] || '',
    keywords: Array.isArray(f['keywords']) ? f['keywords'] : [],
    rights: f['rights.reproductionRights'] || f['rights.licence'] || 'CC BY-SA 4.0',
    coveragePeriod: f['coverage.temporal.periodName'] || ''
  };

  addOrUpdateCollection(payload);
  alert(locale.value === 'de' ? 'Sammlung erfolgreich im Pool gemerkt!' : 'Collection saved to pool!');
};

const startEdit = (col, index) => {
  editingIndex.value = index;
  Object.assign(formData, col);
  keywordsInput.value = Array.isArray(col.keywords) ? col.keywords.join(', ') : '';
  showAddForm.value = true;
};

const cancelEditForm = () => {
  resetFormData();
};

const removeCollection = (index) => {
  removeSavedCollection(index);
};

const selectCollection = (col) => {
  emit('select', col);
  emitClose();
};

const emitClose = () => {
  cancelEditForm();
  searchQuery.value = '';
  emit('close');
};
</script>
