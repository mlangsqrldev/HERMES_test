<template>
  <dialog class="modal" :class="{ 'modal-open': isOpen }">
    <div class="modal-box max-w-4xl p-0 overflow-hidden flex flex-col max-h-[90vh] bg-base-100 shadow-2xl border border-base-300">
      
      <!-- Header -->
      <div class="p-5 bg-base-200/80 border-b border-base-300 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
            👥
          </div>
          <div>
            <h3 class="font-bold text-lg leading-tight">
              {{ mode === 'manage' 
                ? (currentLocale === 'de' ? 'Personen- & Akteurs-Pool verwalten' : 'Manage Persons & Actors Pool')
                : (currentLocale === 'de' ? 'Personen & Akteure auswählen (Multiauswahl)' : 'Select Persons & Actors (Multi-select)') }}
            </h3>
            <p class="text-xs text-base-content/60 mt-0.5">
              {{ mode === 'manage'
                ? (currentLocale === 'de' ? 'Zentraler Datenpool für Akteure, Kontakte und Urheber. Neue Einträge stehen sofort allen Formularen zur Verfügung.' : 'Central pool for actors, contacts and creators. New entries are instantly available everywhere.')
                : (currentLocale === 'de' ? 'Wählen Sie eine oder mehrere Personen/Organisationen zur Übernahme in den aktuellen Datensatz.' : 'Select one or more persons/organisations to add to the current record.') }}
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
            :placeholder="currentLocale === 'de' ? 'Nach Name, Rolle, Organisation oder GND suchen...' : 'Search by name, role, organisation or ID...'"
            class="input input-sm input-bordered w-full pl-9"
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
            {{ currentLocale === 'de' ? 'Alle' : 'All' }} ({{ savedPersons.length }})
          </button>
          <button
            type="button"
            class="btn btn-xs"
            :class="filterType === 'person' ? 'btn-neutral' : 'btn-ghost border border-base-300'"
            @click="filterType = 'person'"
          >
            👤 {{ currentLocale === 'de' ? 'Personen' : 'Persons' }}
          </button>
          <button
            type="button"
            class="btn btn-xs"
            :class="filterType === 'organization' ? 'btn-neutral' : 'btn-ghost border border-base-300'"
            @click="filterType = 'organization'"
          >
            🏛️ {{ currentLocale === 'de' ? 'Organisationen' : 'Organizations' }}
          </button>
        </div>

        <!-- Toggle Add New Person Form -->
        <button
          type="button"
          class="btn btn-sm btn-outline btn-primary gap-1"
          @click="showAddForm = !showAddForm"
        >
          <span class="text-base font-bold">{{ showAddForm ? '−' : '+' }}</span>
          {{ currentLocale === 'de' ? 'Neue Person anlegen' : 'Create New Person' }}
        </button>
      </div>

      <!-- Inline Create/Edit Person Form (Expandable) -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2 max-h-0 overflow-hidden"
        enter-to-class="opacity-100 translate-y-0 max-h-[600px]"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0 max-h-[600px]"
        leave-to-class="opacity-0 -translate-y-2 max-h-0 overflow-hidden"
      >
        <div ref="formContainerRef" v-if="showAddForm || editingIndex !== null" class="p-4 bg-primary/5 border-b border-primary/20">
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-bold text-sm text-primary flex items-center gap-1.5">
              <span>{{ editingIndex !== null ? '✏️' : '➕' }}</span>
              <span>
                {{ editingIndex !== null 
                  ? (currentLocale === 'de' ? 'Person bearbeiten' : 'Edit Person') 
                  : (currentLocale === 'de' ? 'Neue Person zum Pool hinzufügen' : 'Add New Person to Pool') }}
              </span>
            </h4>
            <button type="button" class="btn btn-xs btn-ghost" @click="cancelEditForm">✕</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label class="label py-1"><span class="label-text font-bold">{{ currentLocale === 'de' ? 'Name / Institution' : 'Name / Institution' }} *</span></label>
              <input type="text" v-model="formData.name" required class="input input-sm input-bordered w-full" :placeholder="currentLocale === 'de' ? 'z. B. Max Mustermann oder Deutsches Archäologisches Institut' : 'e.g. Jane Doe or Archaeological Institute'" />
            </div>

            <div>
              <label class="label py-1"><span class="label-text font-bold">{{ currentLocale === 'de' ? 'Rolle(n)' : 'Roles' }}</span></label>
              <input type="text" v-model="formData.roles" class="input input-sm input-bordered w-full" :placeholder="currentLocale === 'de' ? 'z.B. Creator, Custodian, Documentation' : 'e.g. Creator, Custodian, Documentation'" />
            </div>

            <div>
              <label class="label py-1"><span class="label-text font-bold">{{ currentLocale === 'de' ? 'Identifikator / URI (GND, Wikidata, ORCID)' : 'Identifier / URI (GND, Wikidata, ORCID)' }}</span></label>
              <input type="text" v-model="formData.id" class="input input-sm input-bordered w-full" placeholder="https://d-nb.info/gnd/... oder https://orcid.org/..." />
            </div>

            <div>
              <label class="label py-1"><span class="label-text font-bold">{{ currentLocale === 'de' ? 'Organisation / Körperschaft' : 'Organisation' }}</span></label>
              <input type="text" v-model="formData.organization" class="input input-sm input-bordered w-full" :placeholder="currentLocale === 'de' ? 'z.B. Staatliche Museen zu Berlin, SPK' : 'e.g. State Museums of Berlin'" />
            </div>

            <div>
              <label class="label py-1"><span class="label-text font-bold">E-Mail</span></label>
              <input type="email" v-model="formData.email" class="input input-sm input-bordered w-full" placeholder="name@institution.de" />
            </div>

            <div>
              <label class="label py-1"><span class="label-text font-bold">{{ currentLocale === 'de' ? 'Typ' : 'Type' }}</span></label>
              <select v-model="formData.type" class="select select-sm select-bordered w-full">
                <option value="person">{{ currentLocale === 'de' ? 'Einzelperson (Person)' : 'Individual Person' }}</option>
                <option value="organization">{{ currentLocale === 'de' ? 'Organisation / Museum / Institut' : 'Organization / Museum / Institute' }}</option>
                <option value="workshop">{{ currentLocale === 'de' ? 'Werkstatt / Kollektiv / Anonym' : 'Workshop / Collective / Anonymous' }}</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-4 pt-2 border-t border-primary/10">
            <button type="button" class="btn btn-xs btn-ghost" @click="cancelEditForm">
              {{ currentLocale === 'de' ? 'Abbrechen' : 'Cancel' }}
            </button>
            <button type="button" class="btn btn-xs btn-primary font-bold" @click="savePersonForm" :disabled="!formData.name.trim()">
              {{ currentLocale === 'de' ? 'Im Pool speichern' : 'Save to Pool' }}
            </button>
          </div>
        </div>
      </transition>

      <!-- Multi-select Selection Controls (when not in manage mode) -->
      <div v-if="mode !== 'manage'" class="px-5 py-2.5 bg-base-200/50 border-b border-base-200 flex items-center justify-between text-xs">
        <div class="flex items-center gap-3">
          <label class="flex items-center gap-1.5 cursor-pointer font-semibold">
            <input
              type="checkbox"
              class="checkbox checkbox-xs checkbox-primary"
              :checked="isAllSelected"
              @change="toggleSelectAll"
            />
            <span>{{ isAllSelected ? (currentLocale === 'de' ? 'Alle abwählen' : 'Deselect all') : (currentLocale === 'de' ? 'Alle gefilterten auswählen' : 'Select all filtered') }}</span>
          </label>
          <span class="text-base-content/40">|</span>
          <span class="text-base-content/70">
            <strong>{{ selectedIds.size }}</strong> {{ currentLocale === 'de' ? 'Person(en) ausgewählt' : 'person(s) selected' }}
          </span>
        </div>

        <button
          v-if="selectedIds.size > 0"
          type="button"
          class="btn btn-ghost btn-xs text-error hover:bg-error/10"
          @click="selectedIds.clear()"
        >
          {{ currentLocale === 'de' ? 'Auswahl aufheben' : 'Clear selection' }}
        </button>
      </div>

      <!-- Person List Body -->
      <div class="flex-1 overflow-y-auto p-4 space-y-2 divide-y divide-base-200">
        <div
          v-for="(person, index) in filteredPersons"
          :key="person.name + index"
          class="pt-2 first:pt-0 flex items-center justify-between gap-3 p-3 rounded-xl transition-all duration-150 cursor-pointer border"
          :class="[
            selectedIds.has(person.name) 
              ? 'bg-primary/10 border-primary shadow-sm' 
              : 'hover:bg-base-200/60 border-transparent hover:border-base-300'
          ]"
          @click="togglePerson(person)"
        >
          <!-- Left: Checkbox (if multi-select) & Details -->
          <div class="flex items-start gap-3 flex-1 min-w-0">
            <div v-if="mode !== 'manage'" class="pt-0.5" @click.stop>
              <input
                type="checkbox"
                class="checkbox checkbox-sm checkbox-primary"
                :checked="selectedIds.has(person.name)"
                @change="togglePerson(person)"
              />
            </div>

            <!-- Avatar Icon -->
            <div
              class="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold shrink-0"
              :class="person.type === 'organization' ? 'bg-secondary/15 text-secondary' : person.type === 'workshop' ? 'bg-accent/15 text-accent' : 'bg-primary/15 text-primary'"
            >
              {{ person.type === 'organization' ? '🏛️' : person.type === 'workshop' ? '🏺' : '👤' }}
            </div>

            <!-- Name, Roles, Org, ID -->
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-bold text-sm leading-snug truncate text-base-content">
                  {{ person.name }}
                </span>
                
                <!-- Roles badge -->
                <span v-if="person.roles || person.role" class="badge badge-sm badge-outline font-medium text-[11px]">
                  {{ person.roles || person.role }}
                </span>

                <!-- Already added indicator -->
                <span
                  v-if="isAlreadyInRecord(person)"
                  class="badge badge-sm badge-success/20 text-success border-success/30 text-[10px] gap-1 font-semibold"
                >
                  ✓ {{ currentLocale === 'de' ? 'Bereits im Datensatz' : 'Already in record' }}
                </span>
              </div>

              <!-- Metadata row -->
              <div class="flex items-center gap-3 text-xs text-base-content/60 mt-1 flex-wrap">
                <span v-if="person.organization" class="flex items-center gap-1 truncate max-w-[280px]" :title="person.organization">
                  🏛️ {{ person.organization }}
                </span>
                <span v-if="person.email" class="flex items-center gap-1 truncate max-w-[200px]" :title="person.email">
                  ✉️ {{ person.email }}
                </span>
                <span v-if="person.id" class="flex items-center gap-1 font-mono text-[10px] bg-base-200 px-1.5 py-0.5 rounded truncate max-w-[240px]" :title="person.id">
                  🔗 {{ person.id }}
                </span>
              </div>
            </div>
          </div>

          <!-- Right: Action buttons (Edit / Delete) -->
          <div class="flex items-center gap-1 shrink-0" @click.stop>
            <button
              type="button"
              class="btn btn-ghost btn-xs btn-square text-info hover:bg-info/10"
              :title="currentLocale === 'de' ? 'Eintrag bearbeiten' : 'Edit entry'"
              @click.stop="startEditPerson(person)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              type="button"
              class="btn btn-ghost btn-xs btn-square text-error hover:bg-error/10"
              :title="currentLocale === 'de' ? 'Aus Pool entfernen' : 'Remove from pool'"
              @click.stop="confirmDeletePerson(person)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="filteredPersons.length === 0" class="py-12 text-center text-base-content/50">
          <div class="text-3xl mb-2">🔍</div>
          <p class="font-medium text-sm">
            {{ currentLocale === 'de' ? 'Keine Personen gefunden' : 'No persons found' }}
          </p>
          <p class="text-xs mt-1 text-base-content/40">
            {{ currentLocale === 'de' ? 'Passen Sie die Suche an oder legen Sie oben eine neue Person an.' : 'Adjust search or create a new person above.' }}
          </p>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-4 bg-base-200/80 border-t border-base-300 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="text-xs text-base-content/60">
            <span v-if="mode !== 'manage'">
              {{ selectedIds.size }} {{ currentLocale === 'de' ? 'Personen zur Übernahme markiert' : 'persons selected for import' }}
            </span>
            <span v-else>
              {{ savedPersons.length }} {{ currentLocale === 'de' ? 'gespeicherte Personen im Gesamtpool' : 'saved persons in master pool' }}
            </span>
          </div>

          <button
            v-if="savedPersons.length > 0"
            type="button"
            class="btn btn-xs btn-ghost text-error hover:bg-error/10 gap-1 border border-error/30"
            @click="handleClearAllPersons"
            :title="currentLocale === 'de' ? 'Löscht alle gespeicherten Personen aus dem Datenpool' : 'Deletes all saved persons from master pool'"
          >
            🗑️ {{ currentLocale === 'de' ? 'Gesamten Pool leeren' : 'Clear All' }}
          </button>
        </div>

        <div class="flex items-center gap-2">
          <button type="button" class="btn btn-sm btn-ghost" @click="emitClose">
            {{ currentLocale === 'de' ? 'Schließen' : 'Close' }}
          </button>

          <button
            v-if="mode !== 'manage'"
            type="button"
            class="btn btn-sm btn-primary gap-1 font-bold shadow-md"
            :disabled="selectedIds.size === 0"
            @click="confirmSelection"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ currentLocale === 'de' ? `Ausgewählte hinzufügen (${selectedIds.size})` : `Add Selected (${selectedIds.size})` }}
          </button>
        </div>
      </div>

    </div>

    <!-- Backdrop click to close -->
    <div class="modal-backdrop bg-black/40 backdrop-blur-xs" @click="emitClose"></div>
  </dialog>
</template>

<script setup>
import { ref, reactive, computed, inject } from 'vue';
import { savedPersons, addOrUpdatePerson, removeSavedPerson, updateSavedPerson, clearAllPersons } from '../utils/sharedState.js';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String,
    default: 'actors' // 'actors' | 'contacts' | 'manage'
  },
  currentItems: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close', 'select']);

const currentLocale = inject('currentLocale', ref('en'));

const searchQuery = ref('');
const filterType = ref('all'); // 'all' | 'person' | 'organization'
const selectedIds = reactive(new Set());

const showAddForm = ref(false);
const editingIndex = ref(null);

const formData = reactive({
  name: '',
  roles: '',
  id: '',
  organization: '',
  email: '',
  type: 'person'
});

const resetFormData = () => {
  formData.name = '';
  formData.roles = '';
  formData.id = '';
  formData.organization = '';
  formData.email = '';
  formData.type = 'person';
  showAddForm.value = false;
  editingIndex.value = null;
};

const formContainerRef = ref(null);

const startEditPerson = (person) => {
  const actualIdx = (savedPersons.value || []).findIndex(p => p === person || (p.name === person.name && p.id === person.id));
  editingIndex.value = actualIdx !== -1 ? actualIdx : 0;
  showAddForm.value = true;
  formData.name = person.name || '';
  formData.roles = person.roles || person.role || '';
  formData.id = person.id || '';
  formData.organization = person.organization || '';
  formData.email = person.email || '';
  formData.type = person.type || 'person';

  setTimeout(() => {
    formContainerRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 50);
};

const savePersonForm = () => {
  if (!formData.name.trim()) return;

  const personObj = {
    name: formData.name.trim(),
    roles: formData.roles.trim(),
    role: formData.roles.trim(),
    id: formData.id.trim(),
    organization: formData.organization.trim(),
    email: formData.email.trim(),
    type: formData.type
  };

  if (editingIndex.value !== null && editingIndex.value >= 0) {
    updateSavedPerson(editingIndex.value, personObj);
  } else {
    addOrUpdatePerson(personObj);
    // Auto-select newly added person in multi-select mode
    selectedIds.add(personObj.name);
  }

  resetFormData();
};

const confirmDeletePerson = (person) => {
  const actualIdx = (savedPersons.value || []).findIndex(p => p === person || (p.name === person.name && p.id === person.id));
  if (actualIdx !== -1) {
    removeSavedPerson(actualIdx);
  }
  selectedIds.delete(person.name);
};

const filteredPersons = computed(() => {
  let list = savedPersons.value || [];
  
  if (filterType.value !== 'all') {
    list = list.filter(p => {
      if (filterType.value === 'person') return p.type !== 'organization';
      if (filterType.value === 'organization') return p.type === 'organization' || p.type === 'workshop';
      return true;
    });
  }

  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return list;

  return list.filter(p => {
    const nameMatch = (p.name || '').toLowerCase().includes(q);
    const rolesMatch = (p.roles || p.role || '').toLowerCase().includes(q);
    const orgMatch = (p.organization || '').toLowerCase().includes(q);
    const idMatch = (p.id || '').toLowerCase().includes(q);
    const emailMatch = (p.email || '').toLowerCase().includes(q);
    return nameMatch || rolesMatch || orgMatch || idMatch || emailMatch;
  });
});

const isAllSelected = computed(() => {
  if (filteredPersons.value.length === 0) return false;
  return filteredPersons.value.every(p => selectedIds.has(p.name));
});

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    filteredPersons.value.forEach(p => selectedIds.delete(p.name));
  } else {
    filteredPersons.value.forEach(p => selectedIds.add(p.name));
  }
};

const togglePerson = (person) => {
  if (props.mode === 'manage') return;
  if (selectedIds.has(person.name)) {
    selectedIds.delete(person.name);
  } else {
    selectedIds.add(person.name);
  }
};

const isAlreadyInRecord = (person) => {
  if (!props.currentItems || !Array.isArray(props.currentItems)) return false;
  const pName = (person.name || '').trim().toLowerCase();
  return props.currentItems.some(item => {
    if (!item) return false;
    const name = (item.name || item['actors.name'] || '').trim().toLowerCase();
    return name === pName;
  });
};

const confirmSelection = () => {
  const selectedPersons = (savedPersons.value || []).filter(p => selectedIds.has(p.name));
  
  let formattedOutput = [];
  if (props.mode === 'actors') {
    formattedOutput = selectedPersons.map(p => ({
      id: p.id || '',
      name: p.name,
      roles: p.roles || p.role || ''
    }));
  } else if (props.mode === 'contacts') {
    formattedOutput = selectedPersons.map(p => ({
      name: p.name,
      role: p.role || p.roles || '',
      organization: p.organization || '',
      email: p.email || ''
    }));
  } else {
    formattedOutput = selectedPersons;
  }

  emit('select', formattedOutput);
  emitClose();
};

const handleClearAllPersons = () => {
  clearAllPersons();
  selectedIds.clear();
};

const emitClose = () => {
  resetFormData();
  emit('close');
};
</script>
