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
            {{ currentLocale === 'de' ? 'Beziehungen & Verknüpfungen (Cross-Links & Relationen)' : 'Relations & Cross-Links' }}
            <span class="badge badge-primary badge-sm font-semibold">CARARE 2.0.6 / Dublin Core</span>
          </h4>
          <p class="text-xs text-base-content/60 mt-0.5">
            {{ currentLocale === 'de'
              ? 'Verknüpfen Sie dieses Kulturgut per 1-Klick mit digitalen Ressourcen (3D-Modell, Fotos), Erfassungs-Aktivitäten (Scan-Kampagnen) oder übergeordneten Denkmälern.'
              : 'Link this heritage asset with 1-click to digital resources, capture activities, or parent monuments.' }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span class="badge badge-ghost text-xs font-mono">
          {{ activeRelationsCount }} {{ currentLocale === 'de' ? (activeRelationsCount === 1 ? 'Verknüpfung' : 'Verknüpfungen') : (activeRelationsCount === 1 ? 'relation' : 'relations') }}
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
        <!-- 1. Aktivitäten (wasDigitizedBy) -->
        <div class="p-3 bg-base-100 rounded-xl border border-base-300 flex flex-col justify-between gap-2.5 shadow-xs overflow-hidden min-w-0">
          <div class="flex flex-wrap items-center justify-between gap-1">
            <span class="text-xs font-bold flex items-center gap-1 text-secondary truncate max-w-full">
              <span>📸</span>
              {{ currentLocale === 'de' ? 'Aktivität (wasDigitizedBy)' : 'Activity (wasDigitizedBy)' }}
            </span>
            <span v-if="availableActivitiesList && availableActivitiesList.length > 0" class="text-[10px] text-base-content/50 font-mono shrink-0">
              {{ availableActivitiesList.length }} {{ currentLocale === 'de' ? 'im Projekt' : 'available' }}
            </span>
          </div>

          <div v-if="availableActivitiesList && availableActivitiesList.length > 0" class="flex flex-wrap gap-1.5">
            <button
              v-for="act in availableActivitiesList"
              :key="act.id"
              type="button"
              class="btn btn-xs normal-case gap-1 transition-all"
              :class="isRelationLinked('wasDigitizedBy', act.id) ? 'btn-secondary text-secondary-content font-bold shadow-xs' : 'btn-outline border-base-300 hover:border-secondary hover:bg-secondary/10 font-normal'"
              @click="toggleRelation('wasDigitizedBy', act.id)"
              :title="isRelationLinked('wasDigitizedBy', act.id) ? (currentLocale === 'de' ? 'Bereits verknüpft – Klick zum Entfernen' : 'Linked – click to remove') : (currentLocale === 'de' ? 'Klick zum Verknüpfen' : 'Click to link')"
            >
              <span>{{ isRelationLinked('wasDigitizedBy', act.id) ? '✓' : '+' }}</span>
              <span class="font-mono text-[11px]">{{ act.id }}</span>
              <span v-if="act.name" class="opacity-75 max-w-[110px] truncate">({{ act.name }})</span>
            </button>
          </div>
          <div v-else class="text-xs text-warning font-semibold bg-warning/10 border border-warning/20 p-2 rounded-lg flex items-center gap-1.5">
            <span class="shrink-0">⚠️</span>
            <span class="leading-tight">{{ currentLocale === 'de' ? 'Noch nicht vorhanden (keine Aktivität im Projekt)' : 'Not available yet (no activity in project)' }}</span>
          </div>
        </div>

        <!-- 2. Digitalisate (hasRepresentation) -->
        <div class="p-3 bg-base-100 rounded-xl border border-base-300 flex flex-col justify-between gap-2.5 shadow-xs overflow-hidden min-w-0">
          <div class="flex flex-wrap items-center justify-between gap-1">
            <span class="text-xs font-bold flex items-center gap-1 text-primary truncate max-w-full">
              <span>🧊</span>
              {{ currentLocale === 'de' ? 'Digitalisat (hasRepresentation)' : 'Digital Resource (hasRepresentation)' }}
            </span>
            <span v-if="availableDigitalResourcesList && availableDigitalResourcesList.length > 0" class="text-[10px] text-base-content/50 font-mono shrink-0">
              {{ availableDigitalResourcesList.length }} {{ currentLocale === 'de' ? 'im Projekt' : 'available' }}
            </span>
          </div>

          <div v-if="availableDigitalResourcesList && availableDigitalResourcesList.length > 0" class="flex flex-wrap gap-1.5">
            <button
              v-for="dr in availableDigitalResourcesList"
              :key="dr.id"
              type="button"
              class="btn btn-xs normal-case gap-1 transition-all"
              :class="isRelationLinked('hasRepresentation', dr.id) ? 'btn-primary text-primary-content font-bold shadow-xs' : 'btn-outline border-base-300 hover:border-primary hover:bg-primary/10 font-normal'"
              @click="toggleRelation('hasRepresentation', dr.id)"
              :title="isRelationLinked('hasRepresentation', dr.id) ? (currentLocale === 'de' ? 'Bereits verknüpft – Klick zum Entfernen' : 'Linked – click to remove') : (currentLocale === 'de' ? 'Klick zum Verknüpfen' : 'Click to link')"
            >
              <span>{{ isRelationLinked('hasRepresentation', dr.id) ? '✓' : '+' }}</span>
              <span class="font-mono text-[11px]">{{ dr.id }}</span>
              <span v-if="dr.name" class="opacity-75 max-w-[110px] truncate">({{ dr.name }})</span>
            </button>
          </div>
          <div v-else class="text-xs text-warning font-semibold bg-warning/10 border border-warning/20 p-2 rounded-lg flex items-center gap-1.5">
            <span class="shrink-0">⚠️</span>
            <span class="leading-tight">{{ currentLocale === 'de' ? 'Noch nicht vorhanden (kein Digitalisat im Projekt)' : 'Not available yet (no digital resource in project)' }}</span>
          </div>
        </div>

        <!-- 3. Übergeordnetes Monument / Ensemble (isPartOf) -->
        <div class="p-3 bg-base-100 rounded-xl border border-base-300 flex flex-col justify-between gap-2.5 shadow-xs overflow-hidden min-w-0">
          <div class="flex flex-wrap items-center justify-between gap-1">
            <span class="text-xs font-bold flex items-center gap-1 text-base-content truncate max-w-full">
              <span>🏛️</span>
              {{ currentLocale === 'de' ? 'Monument / Ensemble (isPartOf)' : 'Monument / Ensemble (isPartOf)' }}
            </span>
            <span v-if="availableHeritageAssetsList.length > 0" class="text-[10px] text-base-content/50 font-mono shrink-0">
              {{ availableHeritageAssetsList.length }} {{ currentLocale === 'de' ? 'im Projekt' : 'available' }}
            </span>
          </div>

          <div v-if="availableHeritageAssetsList.length > 0" class="flex flex-wrap gap-1.5">
            <button
              v-for="ha in availableHeritageAssetsList"
              :key="ha.id"
              type="button"
              class="btn btn-xs normal-case gap-1 transition-all"
              :class="isRelationLinked('isPartOf', ha.id) ? 'btn-neutral text-neutral-content font-bold shadow-xs' : 'btn-outline border-base-300 hover:border-neutral hover:bg-base-200 font-normal'"
              @click="toggleRelation('isPartOf', ha.id)"
              :title="isRelationLinked('isPartOf', ha.id) ? (currentLocale === 'de' ? 'Bereits verknüpft – Klick zum Entfernen' : 'Linked – click to remove') : (currentLocale === 'de' ? 'Klick zum Verknüpfen' : 'Click to link')"
            >
              <span>{{ isRelationLinked('isPartOf', ha.id) ? '✓' : '+' }}</span>
              <span class="font-mono text-[11px]">{{ ha.id }}</span>
              <span v-if="ha.name" class="opacity-75 max-w-[110px] truncate">({{ ha.name }})</span>
            </button>
          </div>
          <div v-else class="text-xs text-warning font-semibold bg-warning/10 border border-warning/20 p-2 rounded-lg flex items-center gap-1.5">
            <span class="shrink-0">⚠️</span>
            <span class="leading-tight">{{ currentLocale === 'de' ? 'Kein weiteres Kulturgut im Projekt angelegt' : 'No other heritage assets in project' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Specific / Manual Relation Bar -->
    <div class="p-3.5 bg-base-200/50 rounded-xl border border-base-300 mb-5">
      <div class="text-xs font-bold uppercase tracking-wider text-base-content/70 mb-2.5 flex items-center gap-1.5">
        <span>➕</span>
        {{ currentLocale === 'de' ? 'Spezifische Beziehung / Externe URI verknüpfen' : 'Link Specific Relation / External URI' }}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        <!-- 1. Relation Type Selector -->
        <div class="md:col-span-5">
          <label class="label py-0.5">
            <span class="label-text text-xs font-semibold">
              {{ currentLocale === 'de' ? 'Beziehungstyp (Relation):' : 'Relation Type:' }}
            </span>
          </label>
          <select v-model="selectedRelationType" class="select select-sm select-bordered w-full text-xs font-medium">
            <option v-for="rel in RELATION_TYPES" :key="rel.key" :value="rel.key">
              {{ currentLocale === 'de' ? rel.labelDe : rel.labelEn }}
            </option>
          </select>
        </div>

        <!-- 2. Target Selector & Input -->
        <div class="md:col-span-5">
          <label class="label py-0.5 flex justify-between items-center">
            <span class="label-text text-xs font-semibold">
              {{ currentLocale === 'de' ? 'Ziel-Identifikator / URI:' : 'Target Identifier / URI:' }}
            </span>
          </label>
          <input
            type="text"
            v-model="targetInput"
            @keydown.enter.prevent="addRelation"
            class="input input-sm input-bordered w-full text-xs font-mono"
            :placeholder="targetPlaceholder"
          />
        </div>

        <!-- 3. Add Button -->
        <div class="md:col-span-2">
          <button
            type="button"
            class="btn btn-sm btn-primary w-full gap-1"
            @click="addRelation"
            :disabled="!targetInput.trim()"
          >
            <span>+</span>
            <span>{{ currentLocale === 'de' ? 'Hinzufügen' : 'Add' }}</span>
          </button>
        </div>
      </div>

      <!-- Quick Suggestion Chips (1-Click Link!) -->
      <div v-if="quickSuggestions.length > 0" class="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-base-300/60">
        <span class="text-[11px] text-base-content/60 mr-1 flex items-center gap-1">
          <span>💡</span>
          {{ currentLocale === 'de' ? 'Vorhandene Objekte (Klick zum direkten Verknüpfen):' : 'Available objects (Click to link directly):' }}
        </span>
        <button
          v-for="(sug, sIdx) in quickSuggestions"
          :key="sIdx"
          type="button"
          class="badge badge-sm cursor-pointer transition-all gap-1 py-1"
          :class="isRelationLinked(selectedRelationType, sug.val) ? 'badge-primary font-bold shadow-xs' : 'badge-ghost border-base-300 hover:badge-primary/20'"
          @click="toggleRelation(selectedRelationType, sug.val)"
          :title="isRelationLinked(selectedRelationType, sug.val) ? (currentLocale === 'de' ? 'Bereits verknüpft – Klick zum Entfernen' : 'Linked – click to remove') : (currentLocale === 'de' ? 'Klick zum Verknüpfen' : 'Click to link')"
        >
          <span>{{ isRelationLinked(selectedRelationType, sug.val) ? '✓' : '+' }}</span>
          <span>{{ sug.icon }}</span>
          <span class="truncate max-w-[200px]">{{ sug.label }}</span>
        </button>
      </div>

      <!-- Explicit "Noch nicht vorhanden" Banner if target category has 0 items -->
      <div v-else-if="isTargetCategoryEmpty" class="alert alert-warning/20 border border-warning/40 py-2.5 px-3 rounded-xl text-xs flex items-center gap-2 mt-2.5">
        <span class="text-warning text-base font-bold shrink-0">⚠️</span>
        <div class="min-w-0">
          <span class="font-bold text-base-content">{{ currentLocale === 'de' ? 'Noch nicht vorhanden:' : 'Not available yet:' }}</span>
          <span class="text-base-content/80 ml-1">{{ emptyCategoryMessage }}</span>
        </div>
      </div>
    </div>

    <!-- Active Relations Table -->
    <div class="overflow-x-auto">
      <table class="table table-sm w-full table-zebra">
        <thead class="bg-base-200">
          <tr>
            <th class="w-1/3 min-w-[220px]">{{ currentLocale === 'de' ? 'Beziehungstyp' : 'Relation Type' }}</th>
            <th class="w-1/2 min-w-[240px]">{{ currentLocale === 'de' ? 'Verknüpfter Identifikator / Ziel' : 'Linked Identifier / Target' }}</th>
            <th class="w-24 text-right">{{ currentLocale === 'de' ? 'Aktionen' : 'Actions' }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in activeRelationsList" :key="item.key + '_' + item.index" class="hover">
            <!-- Type Badge (Never clipped!) -->
            <td class="align-top py-2.5">
              <div class="flex items-start gap-1.5">
                <span class="text-sm shrink-0 mt-0.5">{{ item.icon }}</span>
                <span class="badge badge-sm h-auto py-1 px-2 whitespace-normal break-words text-left leading-tight" :class="item.badgeClass">
                  {{ currentLocale === 'de' ? item.labelDe : item.labelEn }}
                </span>
              </div>
            </td>

            <!-- Target ID / Value (Inline Editable) -->
            <td>
              <div v-if="editingKey === item.key + '_' + item.index" class="flex items-center gap-1">
                <input
                  type="text"
                  v-model="editingValue"
                  class="input input-xs input-bordered w-full font-mono text-xs"
                  @keydown.enter.prevent="saveEdit(item)"
                  @keydown.esc.prevent="editingKey = null"
                />
                <button type="button" class="btn btn-xs btn-success btn-square" @click="saveEdit(item)">✓</button>
                <button type="button" class="btn btn-xs btn-ghost btn-square" @click="editingKey = null">✕</button>
              </div>
              <div v-else class="font-mono text-xs font-semibold text-base-content/90 flex items-center gap-2">
                <span>{{ item.value }}</span>
                <span v-if="getMatchedLabel(item.value)" class="badge badge-xs badge-ghost font-normal opacity-70">
                  {{ getMatchedLabel(item.value) }}
                </span>
              </div>
            </td>

            <!-- Actions -->
            <td class="text-right">
              <div class="flex items-center justify-end gap-1">
                <button
                  type="button"
                  class="btn btn-xs btn-ghost text-info"
                  @click="startEdit(item)"
                  :title="currentLocale === 'de' ? 'Bearbeiten' : 'Edit'"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                  </svg>
                </button>
                <button
                  type="button"
                  class="btn btn-xs btn-ghost text-error"
                  @click="removeRelation(item.key, item.index)"
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
            <td colspan="3" class="text-center py-5 text-base-content/40 italic">
              {{ currentLocale === 'de'
                ? 'Noch keine Beziehungen hinterlegt. Nutzen Sie die 1-Klick-Schnellauswahl oben oder wählen Sie einen Typ manuell.'
                : 'No relations added yet. Use the 1-click quick linking above or choose a type manually.' }}
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
  projectDigitalResources: {
    type: Array,
    default: () => []
  },
  projectActivities: {
    type: Array,
    default: () => []
  },
  otherHeritageAssets: {
    type: Array,
    default: () => []
  },
  activeAssetId: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update']);

// Standard Dublin Core & CARARE 2.0.6 relation definitions for Heritage Asset
const RELATION_TYPES = [
  {
    key: 'hasRepresentation',
    labelDe: 'Ist dargestellt durch (Digitalisat / 3D-Modell / Foto)',
    labelEn: 'Has Representation (Digital Resource / 3D Model)',
    badgeClass: 'badge-primary font-bold',
    icon: '🧊',
    placeholderDe: 'z.B. DO_3816816_HP oder SK_740_Nikarete_HP',
    placeholderEn: 'e.g. DO_3816816_HP or SK_740_Nikarete_HP'
  },
  {
    key: 'wasDigitizedBy',
    labelDe: 'Wurde digitalisiert durch (Aktivität / Kampagne)',
    labelEn: 'Was Digitized By (Activity / Campaign)',
    badgeClass: 'badge-secondary font-medium',
    icon: '📸',
    placeholderDe: 'z.B. ACT_3D_SCAN_2025_01 oder Kampagne 2025',
    placeholderEn: 'e.g. ACT_3D_SCAN_2025_01 or Campaign 2025'
  },
  {
    key: 'wasPresentAt',
    labelDe: 'War anwesend bei (Ereignis / Ausgrabung)',
    labelEn: 'Was Present At (Event / Excavation)',
    badgeClass: 'badge-accent font-medium',
    icon: '⏳',
    placeholderDe: 'z.B. Grabungskampagne Athen 1888 oder Restauration 2024',
    placeholderEn: 'e.g. Athens Excavation 1888 or Restoration 2024'
  },
  {
    key: 'hasPart',
    labelDe: 'Hat Teil (Fragment / Bestandteil)',
    labelEn: 'Has Part (Fragment / Sub-component)',
    badgeClass: 'badge-neutral font-medium',
    icon: '🧩',
    placeholderDe: 'z.B. SK_740_Fragment_A oder Kopf der Statue',
    placeholderEn: 'e.g. SK_740_Fragment_A or Head of statue'
  },
  {
    key: 'isPartOf',
    labelDe: 'Ist Teil von (Ensemble / Monument / Grabbezirk)',
    labelEn: 'Is Part Of (Ensemble / Monument Complex)',
    badgeClass: 'badge-ghost border-base-300',
    icon: '🏛️',
    placeholderDe: 'z.B. Grabbezirk des Nikarete oder Naiskos Gesamtbau',
    placeholderEn: 'e.g. Grave precinct of Nikarete'
  },
  {
    key: 'isSuccessorOf',
    labelDe: 'Ist Nachfolger von (Vorgängerbau)',
    labelEn: 'Is Successor Of',
    badgeClass: 'badge-ghost border-base-300',
    icon: '⏭️',
    placeholderDe: 'z.B. Vorgängerbauwerk / Phase 1',
    placeholderEn: 'e.g. Predecessor building / Phase 1'
  },
  {
    key: 'isReplicaOf',
    labelDe: 'Ist Nachbildung von (Originalwerk)',
    labelEn: 'Is Replica Of (Original)',
    badgeClass: 'badge-ghost border-base-300',
    icon: '🪞',
    placeholderDe: 'z.B. Originalstatue im Nationalmuseum Athen',
    placeholderEn: 'e.g. Original statue in National Museum Athens'
  },
  {
    key: 'dcRelation',
    labelDe: 'Allgemeine DC-Beziehung (dcRelation)',
    labelEn: 'General DC Relation',
    badgeClass: 'badge-ghost border-base-300',
    icon: '🔗',
    placeholderDe: 'z.B. https://arachne.dainst.org/entity/12345',
    placeholderEn: 'e.g. https://arachne.dainst.org/entity/12345'
  }
];

const selectedRelationType = ref('wasDigitizedBy');
const targetInput = ref('');
const editingKey = ref(null);
const editingValue = ref('');

const targetPlaceholder = computed(() => {
  const rel = RELATION_TYPES.find(r => r.key === selectedRelationType.value);
  if (!rel) return '';
  return props.currentLocale === 'de' ? rel.placeholderDe : rel.placeholderEn;
});

// Computed lists for 1-Click Hub
const availableActivitiesList = computed(() => {
  if (!Array.isArray(props.projectActivities)) return [];
  return props.projectActivities.map(act => {
    const id = act['recordInformation.id'] || act['appellation.id'] || act.id || '';
    const name = Array.isArray(act['appellation.name'])
      ? (act['appellation.name'][0]?._value || act['appellation.name'][0] || '')
      : (act['appellation.name']?._value || act['appellation.name'] || '');
    return { id, name };
  }).filter(a => Boolean(a.id));
});

const availableDigitalResourcesList = computed(() => {
  if (!Array.isArray(props.projectDigitalResources)) return [];
  return props.projectDigitalResources.map(dr => {
    const id = dr['recordInformation.id'] || dr['appellation.id'] || dr.id || '';
    const name = Array.isArray(dr['appellation.name'])
      ? (dr['appellation.name'][0]?._value || dr['appellation.name'][0] || '')
      : (dr['appellation.name']?._value || dr['appellation.name'] || '');
    return { id, name };
  }).filter(d => Boolean(d.id));
});

const availableHeritageAssetsList = computed(() => {
  if (!Array.isArray(props.otherHeritageAssets)) return [];
  return props.otherHeritageAssets.map(ha => {
    const id = ha['recordInformation.id'] || ha['appellation.id'] || ha.id || '';
    const name = Array.isArray(ha['appellation.name'])
      ? (ha['appellation.name'][0]?._value || ha['appellation.name'][0] || '')
      : (ha['appellation.name']?._value || ha['appellation.name'] || '');
    return { id, name };
  }).filter(h => Boolean(h.id) && h.id !== props.activeAssetId);
});

// Checks whether the currently selected relation category has NO targets in project
const isTargetCategoryEmpty = computed(() => {
  const type = selectedRelationType.value;
  if (type === 'wasDigitizedBy' || type === 'wasPresentAt') {
    return availableActivitiesList.value.length === 0;
  }
  if (type === 'hasRepresentation') {
    return availableDigitalResourcesList.value.length === 0;
  }
  if (type === 'hasPart' || type === 'isPartOf' || type === 'isSuccessorOf' || type === 'isReplicaOf') {
    return availableHeritageAssetsList.value.length === 0;
  }
  return false;
});

const emptyCategoryMessage = computed(() => {
  const type = selectedRelationType.value;
  if (type === 'wasDigitizedBy' || type === 'wasPresentAt') {
    return props.currentLocale === 'de'
      ? 'Im Projekt wurde noch keine Aktivität angelegt. Sie können eine Aktivität im Reiter „Aktivitäten“ erstellen oder hier eine ID/URI manuell eintragen.'
      : 'No activity created in project yet. Create an activity in the "Activities" tab first or enter an ID/URI manually.';
  }
  if (type === 'hasRepresentation') {
    return props.currentLocale === 'de'
      ? 'Im Projekt wurde noch kein Digitalisat angelegt. Sie können ein Digitalisat im Reiter „Digitalisate“ erstellen oder hier eine ID/URI manuell eintragen.'
      : 'No digital resource created in project yet. Create a resource in the "Digital Resources" tab first or enter an ID/URI manually.';
  }
  if (type === 'hasPart' || type === 'isPartOf' || type === 'isSuccessorOf' || type === 'isReplicaOf') {
    return props.currentLocale === 'de'
      ? 'Keine weiteren Kulturgüter im Projekt angelegt. Sie können eine übergeordnete ID/URI manuell eintragen.'
      : 'No other heritage assets in project yet. You can enter an ID/URI manually.';
  }
  return '';
});

// Quick suggestions based on selected relation type
const quickSuggestions = computed(() => {
  const type = selectedRelationType.value;

  if (type === 'hasRepresentation') {
    return availableDigitalResourcesList.value.map(dr => ({
      icon: '🧊',
      val: dr.id,
      label: `${dr.id}${dr.name ? ' (' + dr.name + ')' : ''}`,
      title: `Digital Resource: ${dr.id}`
    })).slice(0, 10);
  }

  if (type === 'wasDigitizedBy' || type === 'wasPresentAt') {
    return availableActivitiesList.value.map(act => ({
      icon: '📸',
      val: act.id,
      label: `${act.id}${act.name ? ' (' + act.name + ')' : ''}`,
      title: `Activity: ${act.id}`
    })).slice(0, 10);
  }

  if (type === 'hasPart' || type === 'isPartOf' || type === 'isSuccessorOf' || type === 'isReplicaOf') {
    return availableHeritageAssetsList.value.map(ha => ({
      icon: '🏛️',
      val: ha.id,
      label: `${ha.id}${ha.name ? ' (' + ha.name + ')' : ''}`,
      title: `Heritage Asset: ${ha.id}`
    })).slice(0, 10);
  }

  // General dcRelation: show all available objects
  return [
    ...availableDigitalResourcesList.value.map(dr => ({ icon: '🧊', val: dr.id, label: dr.id, title: dr.name })),
    ...availableActivitiesList.value.map(act => ({ icon: '📸', val: act.id, label: act.id, title: act.name })),
    ...availableHeritageAssetsList.value.map(ha => ({ icon: '🏛️', val: ha.id, label: ha.id, title: ha.name }))
  ].slice(0, 10);
});

// Flat list of all currently populated relations in form
const activeRelationsList = computed(() => {
  const list = [];
  RELATION_TYPES.forEach(rel => {
    const arr = props.form[rel.key];
    if (Array.isArray(arr)) {
      arr.forEach((val, idx) => {
        if (val) {
          list.push({
            key: rel.key,
            index: idx,
            value: typeof val === 'object' ? (val._value || val.id || JSON.stringify(val)) : String(val),
            labelDe: rel.labelDe,
            labelEn: rel.labelEn,
            badgeClass: rel.badgeClass,
            icon: rel.icon
          });
        }
      });
    }
  });
  return list;
});

const activeRelationsCount = computed(() => activeRelationsList.value.length);

const isRelationLinked = (key, val) => {
  if (!props.form || !Array.isArray(props.form[key])) return false;
  return props.form[key].some(item => {
    const itemVal = typeof item === 'object' ? (item._value || item.id) : String(item);
    return itemVal === val;
  });
};

const toggleRelation = (key, val) => {
  if (!val) return;
  if (!Array.isArray(props.form[key])) {
    props.form[key] = [];
  }
  const idx = props.form[key].findIndex(item => {
    const itemVal = typeof item === 'object' ? (item._value || item.id) : String(item);
    return itemVal === val;
  });
  if (idx > -1) {
    props.form[key].splice(idx, 1);
  } else {
    props.form[key].push(val);
  }
  emit('update');
};

const getMatchedLabel = (val) => {
  const matchedDr = (props.projectDigitalResources || []).find(d => (d['recordInformation.id'] || d['appellation.id'] || d.id) === val);
  if (matchedDr) {
    const name = Array.isArray(matchedDr['appellation.name']) ? (matchedDr['appellation.name'][0]?._value || matchedDr['appellation.name'][0]) : (matchedDr['appellation.name']?._value || matchedDr['appellation.name']);
    return name ? `Digitalisat: ${name}` : 'Digitalisat';
  }
  const matchedAct = (props.projectActivities || []).find(a => (a['recordInformation.id'] || a['appellation.id'] || a.id) === val);
  if (matchedAct) {
    const name = Array.isArray(matchedAct['appellation.name']) ? (matchedAct['appellation.name'][0]?._value || matchedAct['appellation.name'][0]) : (matchedAct['appellation.name']?._value || matchedAct['appellation.name']);
    return name ? `Aktivität: ${name}` : 'Aktivität';
  }
  const matchedHa = (props.otherHeritageAssets || []).find(h => (h['recordInformation.id'] || h['appellation.id'] || h.id) === val);
  if (matchedHa) {
    const name = Array.isArray(matchedHa['appellation.name']) ? (matchedHa['appellation.name'][0]?._value || matchedHa['appellation.name'][0]) : (matchedHa['appellation.name']?._value || matchedHa['appellation.name']);
    return name ? `Kulturgut: ${name}` : 'Kulturgut';
  }
  return '';
};

const addRelation = () => {
  const key = selectedRelationType.value;
  const val = targetInput.value.trim();
  if (!val) return;

  if (!Array.isArray(props.form[key])) {
    props.form[key] = [];
  }
  if (!props.form[key].includes(val)) {
    props.form[key].push(val);
  }

  targetInput.value = '';
  emit('update');
};

const removeRelation = (key, index) => {
  if (Array.isArray(props.form[key])) {
    props.form[key].splice(index, 1);
    emit('update');
  }
};

const startEdit = (item) => {
  editingKey.value = item.key + '_' + item.index;
  editingValue.value = item.value;
};

const saveEdit = (item) => {
  if (editingValue.value.trim() && Array.isArray(props.form[item.key])) {
    props.form[item.key][item.index] = editingValue.value.trim();
    emit('update');
  }
  editingKey.value = null;
};
</script>
