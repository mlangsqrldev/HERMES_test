<template>
  <div class="col-span-full border-2 border-primary/20 bg-base-100 rounded-2xl p-5 mb-6 shadow-sm">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-base-200">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
          🔗
        </div>
        <div>
          <h4 class="font-bold text-base leading-tight flex items-center gap-2">
            {{ currentLocale === 'de' ? 'Beziehungen & Verknüpfungen (DC-Relation)' : 'Relations & Cross-Links (DC-Relation)' }}
            <span class="badge badge-primary badge-sm font-semibold">CARARE 2.0.6 / Dublin Core</span>
            <span class="text-warning font-black">~</span>
          </h4>
          <p class="text-xs text-base-content/60 mt-0.5">
            {{ currentLocale === 'de'
              ? 'Verknüpfen Sie diese Sammlung per 1-Klick mit enthaltenen Kulturgütern (hasPart), zugehörigen Digitalisaten, Digitalisierungs-Aktivitäten oder externen Repositorien/Websites.'
              : 'Link this collection with 1-click to included heritage assets (hasPart), digital resources, capture activities, or external repositories.' }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span class="badge badge-ghost text-xs font-mono">
          {{ activeRelationsList.length }} {{ currentLocale === 'de' ? (activeRelationsList.length === 1 ? 'Verknüpfung' : 'Verknüpfungen') : (activeRelationsList.length === 1 ? 'relation' : 'relations') }}
        </span>
      </div>
    </div>

    <!-- 1-Click Quick Link Bar -->
    <div class="mb-5 p-3.5 bg-base-200/50 rounded-xl border border-base-300">
      <div class="flex items-center justify-between mb-2.5">
        <span class="text-xs font-bold uppercase tracking-wider text-base-content/75 flex items-center gap-1.5">
          <span>⚡</span>
          {{ currentLocale === 'de' ? '1-Klick Schnell-Verknüpfung' : '1-Click Quick Linking' }}
        </span>
        <span class="text-[11px] text-base-content/50">
          {{ currentLocale === 'de' ? 'Klicken zum direkten Verknüpfen / Aufheben' : 'Click to link or unlink directly' }}
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <!-- 1. Enthaltene Kulturgüter (hasPart) -->
        <div class="p-3 bg-base-100 rounded-xl border border-base-300 flex flex-col justify-between gap-2.5 shadow-xs overflow-hidden min-w-0">
          <div class="flex flex-wrap items-center justify-between gap-1">
            <span class="text-xs font-bold flex items-center gap-1 text-primary truncate max-w-full">
              <span>🏛️</span>
              {{ currentLocale === 'de' ? 'Kulturgüter (hasPart)' : 'Heritage Assets (hasPart)' }}
            </span>
            <span v-if="projectHeritageAssets && projectHeritageAssets.length > 0" class="text-[10px] text-base-content/50 font-mono shrink-0">
              {{ projectHeritageAssets.length }} {{ currentLocale === 'de' ? 'im Projekt' : 'in project' }}
            </span>
          </div>

          <div v-if="projectHeritageAssets && projectHeritageAssets.length > 0" class="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
            <button
              v-for="ha in projectHeritageAssets"
              :key="ha.id"
              type="button"
              class="btn btn-xs normal-case gap-1 transition-all"
              :class="isRelationLinked('hasPart', ha.id) ? 'btn-primary text-primary-content font-bold shadow-xs' : 'btn-outline border-base-300 hover:border-primary hover:bg-primary/10 font-normal'"
              @click.prevent="toggleQuickLink('hasPart', ha.id, ha.name)"
              :title="ha.name ? `${ha.name} (${ha.id})` : ha.id"
            >
              <span>{{ isRelationLinked('hasPart', ha.id) ? '✓' : '+' }}</span>
              <span class="truncate max-w-[130px]">{{ ha.name || ha.id }}</span>
            </button>
          </div>
          <div v-else class="text-[11px] text-base-content/40 italic py-1">
            {{ currentLocale === 'de' ? 'Keine Kulturgüter im Projekt.' : 'No heritage assets yet.' }}
          </div>
        </div>

        <!-- 2. Digitale Ressourcen (hasPart / isFormatOf) -->
        <div class="p-3 bg-base-100 rounded-xl border border-base-300 flex flex-col justify-between gap-2.5 shadow-xs overflow-hidden min-w-0">
          <div class="flex flex-wrap items-center justify-between gap-1">
            <span class="text-xs font-bold flex items-center gap-1 text-info truncate max-w-full">
              <span>🧊</span>
              {{ currentLocale === 'de' ? 'Digitalisate (hasPart)' : 'Digital Resources (hasPart)' }}
            </span>
            <span v-if="projectDigitalResources && projectDigitalResources.length > 0" class="text-[10px] text-base-content/50 font-mono shrink-0">
              {{ projectDigitalResources.length }} {{ currentLocale === 'de' ? 'im Projekt' : 'in project' }}
            </span>
          </div>

          <div v-if="projectDigitalResources && projectDigitalResources.length > 0" class="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
            <button
              v-for="dr in projectDigitalResources"
              :key="dr.id"
              type="button"
              class="btn btn-xs normal-case gap-1 transition-all"
              :class="isRelationLinked('hasPart', dr.id) ? 'btn-info text-info-content font-bold shadow-xs' : 'btn-outline border-base-300 hover:border-info hover:bg-info/10 font-normal'"
              @click.prevent="toggleQuickLink('hasPart', dr.id, dr.name)"
              :title="dr.name ? `${dr.name} (${dr.id})` : dr.id"
            >
              <span>{{ isRelationLinked('hasPart', dr.id) ? '✓' : '+' }}</span>
              <span class="truncate max-w-[130px]">{{ dr.name || dr.id }}</span>
            </button>
          </div>
          <div v-else class="text-[11px] text-base-content/40 italic py-1">
            {{ currentLocale === 'de' ? 'Keine Digitalisate im Projekt.' : 'No digital resources yet.' }}
          </div>
        </div>

        <!-- 3. Aktivitäten (wasDigitizedBy) -->
        <div class="p-3 bg-base-100 rounded-xl border border-base-300 flex flex-col justify-between gap-2.5 shadow-xs overflow-hidden min-w-0">
          <div class="flex flex-wrap items-center justify-between gap-1">
            <span class="text-xs font-bold flex items-center gap-1 text-secondary truncate max-w-full">
              <span>📸</span>
              {{ currentLocale === 'de' ? 'Aktivitäten (wasDigitizedBy)' : 'Activities (wasDigitizedBy)' }}
            </span>
            <span v-if="projectActivities && projectActivities.length > 0" class="text-[10px] text-base-content/50 font-mono shrink-0">
              {{ projectActivities.length }} {{ currentLocale === 'de' ? 'im Projekt' : 'in project' }}
            </span>
          </div>

          <div v-if="projectActivities && projectActivities.length > 0" class="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
            <button
              v-for="act in projectActivities"
              :key="act.id"
              type="button"
              class="btn btn-xs normal-case gap-1 transition-all"
              :class="isRelationLinked('wasDigitizedBy', act.id) ? 'btn-secondary text-secondary-content font-bold shadow-xs' : 'btn-outline border-base-300 hover:border-secondary hover:bg-secondary/10 font-normal'"
              @click.prevent="toggleQuickLink('wasDigitizedBy', act.id, act.name)"
              :title="act.name ? `${act.name} (${act.id})` : act.id"
            >
              <span>{{ isRelationLinked('wasDigitizedBy', act.id) ? '✓' : '+' }}</span>
              <span class="truncate max-w-[130px]">{{ act.name || act.id }}</span>
            </button>
          </div>
          <div v-else class="text-[11px] text-base-content/40 italic py-1">
            {{ currentLocale === 'de' ? 'Keine Aktivitäten im Projekt.' : 'No activities yet.' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Manual Add/Edit Form -->
    <div class="p-4 bg-base-200/40 rounded-xl border border-base-300 mb-4">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-bold uppercase tracking-wider text-base-content/75 flex items-center gap-1.5">
          <span>➕</span>
          {{ isEditing ? (currentLocale === 'de' ? 'Beziehung bearbeiten' : 'Edit Relation') : (currentLocale === 'de' ? 'Manuelle Beziehung hinzufügen' : 'Add Custom Relation') }}
        </span>
        <button v-if="isEditing" type="button" class="btn btn-xs btn-ghost text-error" @click="cancelEdit">
          {{ currentLocale === 'de' ? 'Abbrechen' : 'Cancel' }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        <!-- Relation Type Selector -->
        <div class="md:col-span-5">
          <label class="label py-1">
            <span class="label-text text-xs font-bold">{{ currentLocale === 'de' ? 'Beziehungstyp (Dublin Core / CARARE):' : 'Relation Type:' }}</span>
          </label>
          <select v-model="selectedRelationType" class="select select-sm select-bordered w-full text-xs font-medium">
            <option v-for="rel in RELATION_TYPES" :key="rel.key" :value="rel.key">
              {{ rel.icon }} {{ currentLocale === 'de' ? rel.labelDe : rel.labelEn }} ({{ rel.key }})
            </option>
          </select>
        </div>

        <!-- Target ID / URI / Name Input -->
        <div class="md:col-span-5">
          <label class="label py-1">
            <span class="label-text text-xs font-bold">{{ currentLocale === 'de' ? 'Ziel-ID / URI / URL / Bezeichner:' : 'Target ID / URI / Link:' }}</span>
          </label>
          <input
            type="text"
            v-model="targetValue"
            class="input input-sm input-bordered w-full text-xs font-mono"
            :placeholder="activeTypeConfig ? (currentLocale === 'de' ? activeTypeConfig.placeholderDe : activeTypeConfig.placeholderEn) : 'z.B. https://www.smb.museum/...'"
            @keydown.enter.prevent="addOrUpdateRelation"
          />
        </div>

        <!-- Submit Button -->
        <div class="md:col-span-2">
          <button
            type="button"
            class="btn btn-sm btn-primary w-full gap-1.5 font-bold"
            :disabled="!targetValue.trim()"
            @click="addOrUpdateRelation"
          >
            <span>{{ isEditing ? '✓' : '+' }}</span>
            <span>{{ isEditing ? (currentLocale === 'de' ? 'Aktualisieren' : 'Update') : (currentLocale === 'de' ? 'Hinzufügen' : 'Add') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Active Relations Table -->
    <div class="overflow-x-auto border border-base-300 rounded-xl">
      <table class="table table-xs w-full table-zebra">
        <thead class="bg-base-200/80 text-xs">
          <tr>
            <th class="w-48">{{ currentLocale === 'de' ? 'Typ / Art' : 'Relation Type' }}</th>
            <th>{{ currentLocale === 'de' ? 'Ziel-ID / Ressource / URI' : 'Target / Identifier / URI' }}</th>
            <th class="w-20 text-right">{{ currentLocale === 'de' ? 'Aktionen' : 'Actions' }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in activeRelationsList" :key="idx" class="hover">
            <td>
              <div class="flex items-center gap-1.5">
                <span class="text-sm">{{ getTypeConfig(item.type).icon }}</span>
                <span class="badge badge-sm font-semibold" :class="getTypeConfig(item.type).badgeClass">
                  {{ item.type }}
                </span>
              </div>
            </td>
            <td>
              <div class="flex items-center gap-2">
                <span class="font-mono text-xs font-bold">{{ item.value }}</span>
                <a
                  v-if="item.value && (item.value.startsWith('http://') || item.value.startsWith('https://'))"
                  :href="item.value"
                  target="_blank"
                  rel="noopener"
                  class="link link-primary text-[10px]"
                >
                  ↗
                </a>
              </div>
            </td>
            <td class="text-right">
              <div class="flex items-center justify-end gap-1">
                <button
                  type="button"
                  class="btn btn-xs btn-ghost text-info"
                  @click="startEdit(item, idx)"
                  :title="currentLocale === 'de' ? 'Bearbeiten' : 'Edit'"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                  </svg>
                </button>
                <button
                  type="button"
                  class="btn btn-xs btn-ghost text-error"
                  @click="removeRelation(idx)"
                  :title="currentLocale === 'de' ? 'Löschen' : 'Delete'"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="activeRelationsList.length === 0">
            <td colspan="3" class="text-center py-5 text-base-content/40 italic text-xs">
              {{ currentLocale === 'de'
                ? 'Noch keine DC-Relationen hinterlegt. Nutzen Sie die 1-Klick-Schnellauswahl oben oder fügen Sie eine URL/ID manuell hinzu.'
                : 'No DC relations added yet. Use the 1-click quick linking above or add a URL/ID manually.' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  form: {
    type: Object,
    required: true
  },
  currentLocale: {
    type: String,
    default: 'de'
  },
  projectHeritageAssets: {
    type: Array,
    default: () => []
  },
  projectDigitalResources: {
    type: Array,
    default: () => []
  },
  projectActivities: {
    type: Array,
    default: () => []
  },
  otherCollections: {
    type: Array,
    default: () => []
  },
  activeCollectionId: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update']);

const RELATION_TYPES = [
  {
    key: 'hasPart',
    labelDe: 'Enthält Kulturgut / Digitalisat (hasPart)',
    labelEn: 'Contains Asset / Resource (hasPart)',
    badgeClass: 'badge-primary text-primary-content font-bold',
    icon: '🏛️',
    placeholderDe: 'z.B. SK_740 oder HERMES-HA-001',
    placeholderEn: 'e.g. SK_740 or HERMES-HA-001'
  },
  {
    key: 'wasDigitizedBy',
    labelDe: 'Digitalisiert durch Aktivität (wasDigitizedBy)',
    labelEn: 'Digitized by Activity (wasDigitizedBy)',
    badgeClass: 'badge-secondary font-medium',
    icon: '📸',
    placeholderDe: 'z.B. ACT-2025-01 oder Scan-Kampagne',
    placeholderEn: 'e.g. ACT-2025-01 or Scan Campaign'
  },
  {
    key: 'isPartOf',
    labelDe: 'Ist Teil einer übergeordneten Sammlung (isPartOf)',
    labelEn: 'Is Part of Parent Collection (isPartOf)',
    badgeClass: 'badge-neutral font-medium',
    icon: '📦',
    placeholderDe: 'z.B. Staatliche Museen zu Berlin Gesamtbestand',
    placeholderEn: 'e.g. SMB Master Collection'
  },
  {
    key: 'isVersionOf',
    labelDe: 'Ist Version von (isVersionOf)',
    labelEn: 'Is Version Of (isVersionOf)',
    badgeClass: 'badge-ghost border-base-300',
    icon: '📑',
    placeholderDe: 'z.B. Version 1.0 der Sammlung',
    placeholderEn: 'e.g. Version 1.0 of the collection'
  },
  {
    key: 'references',
    labelDe: 'Verweist auf externe Quelle / Publikation (references)',
    labelEn: 'References Source / Publication',
    badgeClass: 'badge-ghost border-base-300',
    icon: '📖',
    placeholderDe: 'z.B. https://doi.org/... oder https://d-nb.info/...',
    placeholderEn: 'e.g. https://doi.org/... or https://d-nb.info/...'
  },
  {
    key: 'replaces',
    labelDe: 'Ersetzt frühere Sammlung (replaces)',
    labelEn: 'Replaces Previous Collection (replaces)',
    badgeClass: 'badge-ghost border-base-300',
    icon: '🔄',
    placeholderDe: 'z.B. HERMES-COL-2024-ALT',
    placeholderEn: 'e.g. HERMES-COL-2024-OLD'
  },
  {
    key: 'dcRelation',
    labelDe: 'Allgemeine DC-Relation / Link (dcRelation)',
    labelEn: 'General DC Relation / Link (dcRelation)',
    badgeClass: 'badge-info font-medium',
    icon: '🔗',
    placeholderDe: 'z.B. https://www.smb.museum/museen-einrichtungen/antikensammlung/home/',
    placeholderEn: 'e.g. https://www.smb.museum/museen-einrichtungen/antikensammlung/home/'
  }
];

const selectedRelationType = ref('hasPart');
const targetValue = ref('');
const isEditing = ref(false);
const editIndex = ref(-1);

const activeTypeConfig = computed(() => {
  return RELATION_TYPES.find(r => r.key === selectedRelationType.value) || RELATION_TYPES[0];
});

const getTypeConfig = (typeKey) => {
  return RELATION_TYPES.find(r => r.key === typeKey) || {
    key: typeKey,
    labelDe: typeKey,
    labelEn: typeKey,
    badgeClass: 'badge-ghost border-base-300',
    icon: '🔗'
  };
};

// Form data holds `props.form['dcRelation']`
const activeRelationsList = computed(() => {
  const raw = props.form['dcRelation'];
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map(entry => {
      if (typeof entry === 'object' && entry !== null) {
        return {
          type: entry.type || entry['#type'] || 'dcRelation',
          value: entry.value || entry._value || entry.id || ''
        };
      }
      const str = String(entry).trim();
      if (str.includes(':')) {
        const parts = str.split(/:(.+)/);
        const typeCandidate = parts[0].trim();
        const isKnownType = RELATION_TYPES.some(r => r.key === typeCandidate);
        if (isKnownType) {
          return { type: typeCandidate, value: parts[1].trim() };
        }
      }
      return { type: 'dcRelation', value: str };
    }).filter(r => Boolean(r.value));
  } else if (typeof raw === 'string' && raw.trim()) {
    return [{ type: 'dcRelation', value: raw.trim() }];
  }
  return [];
});

const syncToForm = (list) => {
  props.form['dcRelation'] = list.map(item => {
    if (item.type === 'dcRelation') return item.value;
    return `${item.type}:${item.value}`;
  });
  emit('update', props.form['dcRelation']);
};

const isRelationLinked = (type, targetId) => {
  if (!targetId) return false;
  return activeRelationsList.value.some(r => 
    r.type === type && (r.value === targetId || r.value.includes(targetId))
  );
};

const toggleQuickLink = (type, targetId, targetLabel = '') => {
  if (!targetId) return;
  const list = [...activeRelationsList.value];
  const existingIdx = list.findIndex(r => r.type === type && (r.value === targetId || r.value.includes(targetId)));
  
  if (existingIdx > -1) {
    list.splice(existingIdx, 1);
  } else {
    list.push({ type, value: targetId });
  }
  syncToForm(list);
};

const addOrUpdateRelation = () => {
  const val = targetValue.value.trim();
  if (!val) return;
  const list = [...activeRelationsList.value];

  if (isEditing.value && editIndex.value >= 0 && editIndex.value < list.length) {
    list[editIndex.value] = { type: selectedRelationType.value, value: val };
    isEditing.value = false;
    editIndex.value = -1;
  } else {
    list.push({ type: selectedRelationType.value, value: val });
  }

  targetValue.value = '';
  syncToForm(list);
};

const startEdit = (item, idx) => {
  isEditing.value = true;
  editIndex.value = idx;
  selectedRelationType.value = item.type;
  targetValue.value = item.value;
};

const cancelEdit = () => {
  isEditing.value = false;
  editIndex.value = -1;
  targetValue.value = '';
};

const removeRelation = (idx) => {
  const list = [...activeRelationsList.value];
  list.splice(idx, 1);
  syncToForm(list);
  if (isEditing.value && editIndex.value === idx) {
    cancelEdit();
  }
};
</script>
