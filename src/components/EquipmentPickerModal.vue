<template>
  <dialog class="modal z-[9999]" :class="{ 'modal-open': isOpen }">
    <div class="modal-box max-w-4xl p-0 overflow-hidden flex flex-col max-h-[90vh] bg-base-100 shadow-2xl border border-base-300">
      
      <!-- Header -->
      <div class="p-5 bg-base-200/80 border-b border-base-300 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-lg shadow-sm">
            📷
          </div>
          <div>
            <h3 class="font-bold text-lg leading-tight text-base-content">
              {{ mode === 'manage' 
                ? (locale === 'de' ? 'Geräte- & Hardware-Pool verwalten' : 'Manage Equipment & Hardware Pool')
                : (locale === 'de' ? 'Gerät / Hardware auswählen' : 'Select Equipment / Device') }}
            </h3>
            <p class="text-xs text-base-content/60 mt-0.5">
              {{ mode === 'manage'
                ? (locale === 'de' ? 'Zentraler Datenpool für 3D-Scanner, Kameras, Objektive und Kalibriertargets. Steht allen Aktivitäten zur Verfügung.' : 'Central pool for 3D scanners, cameras, lenses and calibration targets. Available across all activities.')
                : (locale === 'de' ? 'Wählen Sie ein Gerät aus dem Pool zur Übernahme in die Aktivität oder Metadaten.' : 'Select equipment from the pool to apply to the activity or metadata.') }}
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
            :placeholder="locale === 'de' ? 'Nach Modell, Hersteller, Typ oder Spezifikation suchen...' : 'Search by model, maker, type or specs...'"
            class="input input-sm input-bordered w-full pl-9 focus:border-accent text-xs"
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="btn btn-xs btn-ghost btn-circle absolute right-2 top-1/2 -translate-y-1/2">✕</button>
        </div>

        <!-- Filter Chips -->
        <div class="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            class="btn btn-xs"
            :class="filterCategory === 'all' ? 'btn-neutral' : 'btn-ghost border border-base-300'"
            @click="filterCategory = 'all'"
          >
            {{ locale === 'de' ? 'Alle' : 'All' }} ({{ savedEquipment.length }})
          </button>
          <button
            type="button"
            class="btn btn-xs"
            :class="filterCategory === 'camera' ? 'btn-neutral' : 'btn-ghost border border-base-300'"
            @click="filterCategory = 'camera'"
          >
            📸 Kameras
          </button>
          <button
            type="button"
            class="btn btn-xs"
            :class="filterCategory === 'scanner' ? 'btn-neutral' : 'btn-ghost border border-base-300'"
            @click="filterCategory = 'scanner'"
          >
            💡 3D-Scanner / TLS
          </button>
          <button
            type="button"
            class="btn btn-xs"
            :class="filterCategory === 'optics' ? 'btn-neutral' : 'btn-ghost border border-base-300'"
            @click="filterCategory = 'optics'"
          >
            🔍 Objektive
          </button>
          <button
            type="button"
            class="btn btn-xs"
            :class="filterCategory === 'calibration' ? 'btn-neutral' : 'btn-ghost border border-base-300'"
            @click="filterCategory = 'calibration'"
          >
            🎯 Targets / Kalibrierung
          </button>
        </div>

        <!-- Toggle Add Form Button -->
        <button
          type="button"
          class="btn btn-sm btn-outline btn-accent gap-1"
          @click="showAddForm = !showAddForm"
        >
          <span class="text-base font-bold">{{ showAddForm ? '−' : '+' }}</span>
          {{ locale === 'de' ? 'Neues Gerät anlegen' : 'Add Equipment' }}
        </button>
      </div>

      <!-- Add/Edit Form Collapsible -->
      <div v-if="showAddForm" class="p-4 bg-accent/5 border-b border-accent/20 animate-fadeIn">
        <h4 class="font-bold text-xs uppercase text-accent mb-3 flex items-center gap-1.5">
          <span>{{ editingIndex !== null ? '✏️' : '✨' }}</span>
          <span>{{ editingIndex !== null ? (locale === 'de' ? 'Gerät bearbeiten' : 'Edit Equipment') : (locale === 'de' ? 'Neues Gerät zur festen Liste hinzufügen' : 'Add New Equipment to Master Pool') }}</span>
        </h4>
        <form @submit.prevent="saveEquipmentForm" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label class="label py-0.5"><span class="label-text text-[11px] font-bold">Modell / Gerätebezeichnung *</span></label>
            <input type="text" v-model="formState.name" required placeholder="z.B. Nikon D850 oder GOM ATOS Q" class="input input-sm input-bordered w-full text-xs" />
          </div>
          <div>
            <label class="label py-0.5"><span class="label-text text-[11px] font-bold">Hersteller / Fabrikat</span></label>
            <input type="text" v-model="formState.manufacturer" placeholder="z.B. Nikon, Sony, Carl Zeiss" class="input input-sm input-bordered w-full text-xs" />
          </div>
          <div>
            <label class="label py-0.5"><span class="label-text text-[11px] font-bold">Gerätetyp / Kategorie</span></label>
            <input type="text" v-model="formState.type" placeholder="z.B. Vollformat-DSLR, 3D-Scanner (SLS)" class="input input-sm input-bordered w-full text-xs" />
          </div>
          <div>
            <label class="label py-0.5"><span class="label-text text-[11px] font-bold">Spezifikationen / Details</span></label>
            <input type="text" v-model="formState.specs" placeholder="z.B. 45.7 MP BSI-Sensor, Blaulicht-Streifenmuster" class="input input-sm input-bordered w-full text-xs" />
          </div>
          <div class="md:col-span-2 lg:col-span-4 flex items-center justify-end gap-2 pt-2">
            <button type="button" class="btn btn-xs btn-ghost" @click="cancelEdit">
              {{ locale === 'de' ? 'Abbrechen' : 'Cancel' }}
            </button>
            <button type="submit" class="btn btn-xs btn-accent font-bold">
              {{ editingIndex !== null ? (locale === 'de' ? 'Änderungen speichern' : 'Save Changes') : (locale === 'de' ? 'Hinzufügen' : 'Add to Pool') }}
            </button>
          </div>
        </form>
      </div>

      <!-- Main Equipment Table / List -->
      <div class="flex-1 overflow-y-auto p-4">
        <div class="border border-base-200 rounded-xl overflow-hidden shadow-2xs bg-base-100">
          <table class="table table-sm w-full">
            <thead class="bg-base-200/60 text-xs font-bold uppercase text-base-content/70">
              <tr>
                <th>Gerätebezeichnung</th>
                <th class="w-28">Hersteller</th>
                <th class="w-36">Gerätetyp</th>
                <th>Spezifikationen</th>
                <th class="w-32 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(eq, idx) in filteredEquipment"
                :key="eq.id || idx"
                class="hover cursor-pointer transition-colors"
                @click="mode === 'select' ? selectEquipment(eq) : null"
              >
                <td>
                  <div class="flex items-center gap-2">
                    <span class="text-base">{{ getEquipmentIcon(eq.type) }}</span>
                    <div>
                      <div class="font-bold text-xs text-base-content">{{ eq.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="text-xs text-base-content/75 font-medium">
                  {{ eq.manufacturer || '—' }}
                </td>
                <td>
                  <span class="badge badge-ghost badge-xs text-[10px]">{{ eq.type || 'Allgemein' }}</span>
                </td>
                <td class="text-xs text-base-content/65 max-w-xs truncate" :title="eq.specs">
                  {{ eq.specs || '—' }}
                </td>
                <td class="text-right" @click.stop>
                  <div class="flex items-center justify-end gap-1">
                    <button
                      v-if="mode === 'select'"
                      type="button"
                      class="btn btn-xs btn-accent gap-1 font-bold"
                      @click="selectEquipment(eq)"
                    >
                      ✓ {{ locale === 'de' ? 'Wählen' : 'Select' }}
                    </button>
                    <button
                      type="button"
                      class="btn btn-xs btn-ghost btn-circle text-base-content/60 hover:text-base-content"
                      @click="startEdit(eq)"
                      title="Bearbeiten"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      class="btn btn-xs btn-ghost btn-circle text-error/60 hover:text-error"
                      @click="deleteEquipment(eq)"
                      title="Löschen"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredEquipment.length === 0">
                <td colspan="5" class="text-center py-8 text-base-content/40 italic text-xs">
                  {{ locale === 'de' ? 'Kein Gerät im Pool gefunden.' : 'No equipment found matching query.' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-3 bg-base-200/60 border-t border-base-200 flex items-center justify-between text-xs">
        <div class="flex items-center gap-2 text-base-content/60">
          <span>{{ savedEquipment.length }} {{ locale === 'de' ? 'Geräte im Pool' : 'devices in pool' }}</span>
          <span>•</span>
          <button
            type="button"
            class="link link-hover text-accent font-semibold text-[11px]"
            @click="resetEquipmentToDefaults"
            :title="locale === 'de' ? 'Setzt die Geräteliste auf die kuratierte Standardauswahl zurück' : 'Reset to default curated equipment'"
          >
            ↺ {{ locale === 'de' ? 'Auf Standard-Pool zurücksetzen' : 'Reset to Defaults' }}
          </button>
        </div>
        <button type="button" class="btn btn-sm btn-ghost" @click="emitClose">
          {{ locale === 'de' ? 'Schließen' : 'Close' }}
        </button>
      </div>

    </div>
  </dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import {
  savedEquipment,
  addOrUpdateEquipment,
  removeSavedEquipment,
  updateSavedEquipment,
  resetEquipmentToDefaults
} from '../utils/sharedState.js';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String,
    default: 'manage' // 'manage' | 'select'
  },
  locale: {
    type: String,
    default: 'de'
  }
});

const emit = defineEmits(['close', 'select']);

const searchQuery = ref('');
const filterCategory = ref('all');
const showAddForm = ref(false);
const editingIndex = ref(null);

const formState = reactive({
  id: '',
  name: '',
  manufacturer: '',
  type: '',
  specs: ''
});

const getEquipmentIcon = (type = '') => {
  const t = String(type).toLowerCase();
  if (t.includes('scanner') || t.includes('sls') || t.includes('tls') || t.includes('laser')) return '💡';
  if (t.includes('objektiv') || t.includes('optik') || t.includes('lens')) return '🔍';
  if (t.includes('target') || t.includes('colorchecker') || t.includes('maßstab') || t.includes('scale')) return '🎯';
  if (t.includes('blitz') || t.includes('licht') || t.includes('beleuchtung')) return '⚡';
  if (t.includes('drehteller') || t.includes('turntable')) return '🔄';
  return '📷';
};

const filteredEquipment = computed(() => {
  return savedEquipment.value.filter(eq => {
    // Category filter
    if (filterCategory.value !== 'all') {
      const t = (eq.type || '').toLowerCase();
      if (filterCategory.value === 'camera' && !t.includes('kamera') && !t.includes('dslr') && !t.includes('dslm') && !t.includes('mittelformat')) return false;
      if (filterCategory.value === 'scanner' && !t.includes('scanner') && !t.includes('sls') && !t.includes('tls') && !t.includes('laser')) return false;
      if (filterCategory.value === 'optics' && !t.includes('objektiv') && !t.includes('optik') && !t.includes('lens')) return false;
      if (filterCategory.value === 'calibration' && !t.includes('target') && !t.includes('kalibrier') && !t.includes('maßstab') && !t.includes('scale') && !t.includes('drehteller') && !t.includes('beleuchtung')) return false;
    }

    // Search query filter
    if (!searchQuery.value) return true;
    const q = searchQuery.value.toLowerCase().trim();
    return (
      (eq.name && eq.name.toLowerCase().includes(q)) ||
      (eq.manufacturer && eq.manufacturer.toLowerCase().includes(q)) ||
      (eq.type && eq.type.toLowerCase().includes(q)) ||
      (eq.specs && eq.specs.toLowerCase().includes(q))
    );
  });
});

const emitClose = () => {
  cancelEdit();
  emit('close');
};

const selectEquipment = (eq) => {
  emit('select', { ...eq });
  emitClose();
};

const startEdit = (eq) => {
  const idx = savedEquipment.value.findIndex(e => e.id === eq.id || (e.name === eq.name && e.manufacturer === eq.manufacturer));
  editingIndex.value = idx >= 0 ? idx : null;
  formState.id = eq.id || `eq_${Date.now()}`;
  formState.name = eq.name || '';
  formState.manufacturer = eq.manufacturer || '';
  formState.type = eq.type || '';
  formState.specs = eq.specs || '';
  showAddForm.value = true;
};

const cancelEdit = () => {
  editingIndex.value = null;
  formState.id = '';
  formState.name = '';
  formState.manufacturer = '';
  formState.type = '';
  formState.specs = '';
  showAddForm.value = false;
};

const saveEquipmentForm = () => {
  if (!formState.name.trim()) return;

  if (editingIndex.value !== null && editingIndex.value >= 0) {
    updateSavedEquipment(editingIndex.value, { ...formState });
  } else {
    addOrUpdateEquipment({ ...formState });
  }

  cancelEdit();
};

const deleteEquipment = (eq) => {
  const idx = savedEquipment.value.findIndex(e => e.id === eq.id || (e.name === eq.name && e.manufacturer === eq.manufacturer));
  if (idx >= 0) {
    removeSavedEquipment(idx);
  }
};
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.15s ease-out forwards;
}
</style>

