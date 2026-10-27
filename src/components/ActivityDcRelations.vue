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
            {{ currentLocale === 'de' ? 'Beziehungen & Verknüpfungen (Aktivitäts-Cross-Links)' : 'Relations & Cross-Links (Activity Cross-Links)' }}
            <span class="badge badge-primary badge-sm font-semibold">CARARE 2.0.6 / Dublin Core</span>
          </h4>
          <p class="text-xs text-base-content/60 mt-0.5">
            {{ currentLocale === 'de'
              ? 'Verknüpfen Sie diese Erfassungsaktivität per 1-Klick mit den erstellten digitalen Ressourcen (3D-Modelle, Rohbilder), den digitalisierten Kulturgütern (z. B. SK 740) oder übergeordneten Kampagnen.'
              : 'Link this activity with 1-click to created digital resources (3D models, RAW images), digitized heritage assets (e.g. SK 740), or parent campaigns.' }}
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
        <!-- 1. Dokumentiertes Kulturgut (wasPresentAt) -->
        <div class="p-3 bg-base-100 rounded-xl border border-base-300 flex flex-col justify-between gap-2.5 shadow-xs overflow-hidden min-w-0">
          <div class="flex flex-wrap items-center justify-between gap-1">
            <span class="text-xs font-bold flex items-center gap-1 text-secondary truncate max-w-full">
              <span>🏺</span>
              {{ currentLocale === 'de' ? 'Kulturgut (wasPresentAt)' : 'Heritage Asset (wasPresentAt)' }}
            </span>
            <span v-if="availableHeritageAssetsList && availableHeritageAssetsList.length > 0" class="text-[10px] text-base-content/50 font-mono shrink-0">
              {{ availableHeritageAssetsList.length }} {{ currentLocale === 'de' ? 'im Projekt' : 'available' }}
            </span>
          </div>

          <div v-if="availableHeritageAssetsList && availableHeritageAssetsList.length > 0" class="flex flex-wrap gap-1.5">
            <button
              v-for="ha in availableHeritageAssetsList"
              :key="ha.id"
              type="button"
              class="btn btn-xs normal-case gap-1 transition-all"
              :class="isRelationLinked('wasPresentAt', ha.id) ? 'btn-secondary text-secondary-content font-bold shadow-xs' : 'btn-outline border-base-300 hover:border-secondary hover:bg-secondary/10 font-normal'"
              @click="toggleRelation('wasPresentAt', ha.id)"
              :title="isRelationLinked('wasPresentAt', ha.id) ? (currentLocale === 'de' ? 'Bereits verknüpft – Klick zum Entfernen' : 'Linked – click to remove') : (currentLocale === 'de' ? 'Klick zum Verknüpfen' : 'Click to link')"
            >
              <span>{{ isRelationLinked('wasPresentAt', ha.id) ? '✓' : '+' }}</span>
              <span class="font-mono text-[11px]">{{ ha.id }}</span>
              <span v-if="ha.name" class="opacity-75 max-w-[110px] truncate">({{ ha.name }})</span>
            </button>
          </div>
          <div v-else class="text-xs text-warning font-semibold bg-warning/10 border border-warning/20 p-2 rounded-lg flex items-center gap-1.5">
            <span class="shrink-0">⚠️</span>
            <span class="leading-tight">{{ currentLocale === 'de' ? 'Noch nicht vorhanden (kein Kulturgut im Projekt)' : 'Not available yet (no heritage asset in project)' }}</span>
          </div>
        </div>

        <!-- 2. Erstelltes Digitalisat (hasCreated) -->
        <div class="p-3 bg-base-100 rounded-xl border border-base-300 flex flex-col justify-between gap-2.5 shadow-xs overflow-hidden min-w-0">
          <div class="flex flex-wrap items-center justify-between gap-1">
            <span class="text-xs font-bold flex items-center gap-1 text-primary truncate max-w-full">
              <span>🧊</span>
              {{ currentLocale === 'de' ? 'Digitalisat (hasCreated)' : 'Digital Resource (hasCreated)' }}
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
              :class="isRelationLinked('hasCreated', dr.id) ? 'btn-primary text-primary-content font-bold shadow-xs' : 'btn-outline border-base-300 hover:border-primary hover:bg-primary/10 font-normal'"
              @click="toggleRelation('hasCreated', dr.id)"
              :title="isRelationLinked('hasCreated', dr.id) ? (currentLocale === 'de' ? 'Bereits verknüpft – Klick zum Entfernen' : 'Linked – click to remove') : (currentLocale === 'de' ? 'Klick zum Verknüpfen' : 'Click to link')"
            >
              <span>{{ isRelationLinked('hasCreated', dr.id) ? '✓' : '+' }}</span>
              <span class="font-mono text-[11px]">{{ dr.id }}</span>
              <span v-if="dr.name" class="opacity-75 max-w-[110px] truncate">({{ dr.name }})</span>
            </button>
          </div>
          <div v-else class="text-xs text-warning font-semibold bg-warning/10 border border-warning/20 p-2 rounded-lg flex items-center gap-1.5">
            <span class="shrink-0">⚠️</span>
            <span class="leading-tight">{{ currentLocale === 'de' ? 'Noch nicht vorhanden (kein Digitalisat im Projekt)' : 'Not available yet (no digital resource in project)' }}</span>
          </div>
        </div>

        <!-- 3. Übergeordnete Kampagne / Projekt (isPartOf) -->
        <div class="p-3 bg-base-100 rounded-xl border border-base-300 flex flex-col justify-between gap-2.5 shadow-xs overflow-hidden min-w-0">
          <div class="flex flex-wrap items-center justify-between gap-1">
            <span class="text-xs font-bold flex items-center gap-1 text-base-content truncate max-w-full">
              <span>🏛️</span>
              {{ currentLocale === 'de' ? 'Kampagne / Projekt (isPartOf)' : 'Campaign / Project (isPartOf)' }}
            </span>
            <span v-if="availableActivitiesList.length > 0" class="text-[10px] text-base-content/50 font-mono shrink-0">
              {{ availableActivitiesList.length }} {{ currentLocale === 'de' ? 'im Projekt' : 'available' }}
            </span>
          </div>

          <div v-if="availableActivitiesList.length > 0" class="flex flex-wrap gap-1.5">
            <button
              v-for="act in availableActivitiesList"
              :key="act.id"
              type="button"
              class="btn btn-xs normal-case gap-1 transition-all"
              :class="isRelationLinked('isPartOf', act.id) ? 'btn-neutral text-neutral-content font-bold shadow-xs' : 'btn-outline border-base-300 hover:border-neutral hover:bg-base-200 font-normal'"
              @click="toggleRelation('isPartOf', act.id)"
              :title="isRelationLinked('isPartOf', act.id) ? (currentLocale === 'de' ? 'Bereits verknüpft – Klick zum Entfernen' : 'Linked – click to remove') : (currentLocale === 'de' ? 'Klick zum Verknüpfen' : 'Click to link')"
            >
              <span>{{ isRelationLinked('isPartOf', act.id) ? '✓' : '+' }}</span>
              <span class="font-mono text-[11px]">{{ act.id }}</span>
              <span v-if="act.name" class="opacity-75 max-w-[110px] truncate">({{ act.name }})</span>
            </button>
          </div>
          <div v-else class="text-xs text-warning font-semibold bg-warning/10 border border-warning/20 p-2 rounded-lg flex items-center gap-1.5">
            <span class="shrink-0">⚠️</span>
            <span class="leading-tight">{{ currentLocale === 'de' ? 'Keine weitere Kampagne / Aktivität im Projekt' : 'No other activity in project' }}</span>
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

    <!-- Relations Table -->
    <div class="overflow-x-auto">
      <table class="table table-sm w-full table-zebra">
        <thead class="bg-base-200">
          <tr>
            <th class="w-1/3 min-w-[220px]">{{ currentLocale === 'de' ? 'Beziehungstyp' : 'Relation Type' }}</th>
            <th class="w-1/2 min-w-[240px]">{{ currentLocale === 'de' ? 'Ziel (Inventarnummer / Ressourcen-ID / URI)' : 'Target (Inventory No / Resource ID / URI)' }}</th>
            <th class="w-28 font-mono text-[11px]">{{ currentLocale === 'de' ? 'CARARE Element' : 'CARARE Tag' }}</th>
            <th class="w-24 text-right">{{ currentLocale === 'de' ? 'Aktionen' : 'Actions' }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in activeRelationsList" :key="item.key + '_' + item.index" class="hover">
            <!-- Type badge (Never clipped!) -->
            <td class="align-top py-2.5">
              <div class="flex items-start gap-1.5">
                <span class="text-sm shrink-0 mt-0.5">{{ item.icon }}</span>
                <span class="badge badge-sm h-auto py-1 px-2 whitespace-normal break-words text-left leading-tight" :class="item.badgeClass">
                  {{ currentLocale === 'de' ? item.labelDe : item.labelEn }}
                </span>
              </div>
            </td>

            <!-- Target string with edit or link -->
            <td>
              <div v-if="editingKey === (item.key + '_' + item.index)" class="flex items-center gap-1.5 py-0.5">
                <input
                  type="text"
                  v-model="editingValue"
                  class="input input-xs input-bordered w-full font-mono text-xs"
                  @keydown.enter.prevent="saveEdit(item)"
                />
                <button type="button" class="btn btn-xs btn-success btn-square" @click="saveEdit(item)">✓</button>
                <button type="button" class="btn btn-xs btn-ghost btn-square" @click="cancelEdit">✕</button>
              </div>
              <div v-else class="flex items-center gap-2">
                <span class="font-mono text-xs font-semibold">{{ item.value }}</span>
                <span v-if="getMatchedLabel(item.value)" class="badge badge-xs badge-ghost font-normal opacity-70">
                  {{ getMatchedLabel(item.value) }}
                </span>
                <a
                  v-if="isUrl(item.value)"
                  :href="item.value"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary hover:underline text-[11px]"
                  title="Open Link"
                >
                  ↗
                </a>
              </div>
            </td>

            <!-- CARARE XML Tag -->
            <td class="font-mono text-[11px] text-base-content/60">
              &lt;{{ item.key }}&gt;
            </td>

            <!-- Actions -->
            <td class="text-right">
              <div class="flex items-center justify-end gap-1">
                <button
                  type="button"
                  class="btn btn-ghost btn-xs btn-square text-base-content/60 hover:text-base-content"
                  @click="startEdit(item)"
                  :title="currentLocale === 'de' ? 'Bearbeiten' : 'Edit'"
                >
                  ✎
                </button>
                <button
                  type="button"
                  class="btn btn-ghost btn-xs btn-square text-error hover:bg-error/10"
                  @click="removeRelation(item.key, item.index)"
                  :title="currentLocale === 'de' ? 'Löschen' : 'Delete'"
                >
                  ✕
                </button>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="activeRelationsList.length === 0">
            <td colspan="4" class="text-center py-6 text-base-content/40 italic">
              <div class="flex flex-col items-center justify-center gap-1">
                <span class="text-2xl">🔗</span>
                <span class="text-xs">
                  {{ currentLocale === 'de'
                    ? 'Noch keine Aktivitäts-Beziehungen hinterlegt. Nutzen Sie die 1-Klick-Schnellauswahl oben oder wählen Sie einen Typ manuell.'
                    : 'No activity relations defined yet. Use 1-click quick linking above or choose a type manually.' }}
                </span>
              </div>
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
  otherActivities: {
    type: Array,
    default: () => []
  },
  activeActivityId: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update']);

// Standard Dublin Core & CARARE 2.0.6 relation definitions for Activity
const RELATION_TYPES = [
  {
    key: 'wasPresentAt',
    labelDe: 'Erfasstes Kulturgut (wasPresentAt / Denkmal)',
    labelEn: 'Documented Heritage Asset (wasPresentAt / Monument)',
    badgeClass: 'badge-secondary font-medium',
    icon: '🏺',
    placeholderDe: 'z.B. SK 740 oder Inv. 1928,0412.1',
    placeholderEn: 'e.g. SK 740 or Inv. 1928,0412.1'
  },
  {
    key: 'hasCreated',
    labelDe: 'Hat erstellt (Digitalisat / 3D-Modell / Rohbilder)',
    labelEn: 'Has Created (Digital Resource / 3D Model / RAW Set)',
    badgeClass: 'badge-primary font-bold',
    icon: '🧊',
    placeholderDe: 'z.B. DO_3816816_HP oder SK_740_Nikarete_RAW_Set',
    placeholderEn: 'e.g. DO_3816816_HP or SK_740_Nikarete_RAW_Set'
  },
  {
    key: 'hasPart',
    labelDe: 'Enthält Teilaktivität (hasPart, z. B. Scan-Durchgang)',
    labelEn: 'Has Sub-Activity (hasPart, e.g. Laser Scanning Pass 1)',
    badgeClass: 'badge-accent font-medium',
    icon: '🧩',
    placeholderDe: 'z.B. ACT_2025_SCAN_TEXTURE oder Streifenlicht-Scan Teil 2',
    placeholderEn: 'e.g. ACT_2025_SCAN_TEXTURE or Structured Light Pass 2'
  },
  {
    key: 'isPartOf',
    labelDe: 'Ist Teil von Kampagne / Großprojekt (isPartOf)',
    labelEn: 'Is Part Of Campaign / Large Project (isPartOf)',
    badgeClass: 'badge-neutral font-medium',
    icon: '🏛️',
    placeholderDe: 'z.B. HECTOR 3D-Dokumentation 2024–2026',
    placeholderEn: 'e.g. HECTOR 3D Documentation Campaign 2024-2026'
  },
  {
    key: 'isSuccessorOf',
    labelDe: 'Ist Nachfolger von (isSuccessorOf, Folgekampagne)',
    labelEn: 'Is Successor Of (isSuccessorOf, Follow-up campaign)',
    badgeClass: 'badge-ghost border-base-300',
    icon: '⏭️',
    placeholderDe: 'z.B. ACT_2024_VORSTUDIE_01',
    placeholderEn: 'e.g. ACT_2024_PILOT_01'
  },
  {
    key: 'dcRelation',
    labelDe: 'Allgemeine DC-Beziehung (dcRelation, Publikation / DOI)',
    labelEn: 'General DC Relation (Publication / DOI / External URI)',
    badgeClass: 'badge-ghost border-base-300',
    icon: '🔗',
    placeholderDe: 'z.B. https://doi.org/10.11588/diglit.12345 oder Bericht-URI',
    placeholderEn: 'e.g. https://doi.org/10.11588/diglit.12345 or report URI'
  }
];

const selectedRelationType = ref('wasPresentAt');
const targetInput = ref('');
const editingKey = ref(null);
const editingValue = ref('');

const targetPlaceholder = computed(() => {
  const rel = RELATION_TYPES.find(r => r.key === selectedRelationType.value);
  if (!rel) return '';
  return props.currentLocale === 'de' ? rel.placeholderDe : rel.placeholderEn;
});

// Computed lists for 1-Click Hub
const availableHeritageAssetsList = computed(() => {
  if (!Array.isArray(props.projectHeritageAssets)) return [];
  return props.projectHeritageAssets.map(ha => {
    const id = ha.id || ha['recordInformation.id'] || ha['appellation.id'] || '';
    let name = ha.name || '';
    if (!name && ha['appellation.name']) {
      name = Array.isArray(ha['appellation.name'])
        ? (ha['appellation.name'][0]?._value || ha['appellation.name'][0] || '')
        : (ha['appellation.name']?._value || ha['appellation.name'] || '');
    }
    const inv = ha.inv || ha['repositoryLocation.inventoryNumber'] || '';
    return { id, name, inv };
  }).filter(h => Boolean(h.id));
});

const availableDigitalResourcesList = computed(() => {
  if (!Array.isArray(props.projectDigitalResources)) return [];
  return props.projectDigitalResources.map(dr => {
    const id = dr['recordInformation.id'] || dr['appellation.id'] || (dr.id && typeof dr.id === 'string' ? dr.id : '') || '';
    let name = dr.name || '';
    if (!name && dr['appellation.name']) {
      name = Array.isArray(dr['appellation.name'])
        ? (dr['appellation.name'][0]?._value || dr['appellation.name'][0] || '')
        : (dr['appellation.name']?._value || dr['appellation.name'] || '');
    }
    return { id, name };
  }).filter(d => Boolean(d.id));
});

const availableActivitiesList = computed(() => {
  if (!Array.isArray(props.otherActivities)) return [];
  return props.otherActivities.map(act => {
    const id = act['recordInformation.id'] || act['appellation.id'] || (act.id && typeof act.id === 'string' ? act.id : '') || '';
    let name = act.name || '';
    if (!name && act['appellation.name']) {
      name = Array.isArray(act['appellation.name'])
        ? (act['appellation.name'][0]?._value || act['appellation.name'][0] || '')
        : (act['appellation.name']?._value || act['appellation.name'] || '');
    }
    return { id, name };
  }).filter(a => Boolean(a.id) && a.id !== props.activeActivityId);
});

// Checks whether the currently selected relation category has NO targets in project
const isTargetCategoryEmpty = computed(() => {
  const type = selectedRelationType.value;
  if (type === 'wasPresentAt') {
    return availableHeritageAssetsList.value.length === 0;
  }
  if (type === 'hasCreated') {
    return availableDigitalResourcesList.value.length === 0;
  }
  if (type === 'hasPart' || type === 'isPartOf' || type === 'isSuccessorOf') {
    return availableActivitiesList.value.length === 0;
  }
  return false;
});

const emptyCategoryMessage = computed(() => {
  const type = selectedRelationType.value;
  if (type === 'wasPresentAt') {
    return props.currentLocale === 'de'
      ? 'Im Projekt wurde noch kein Kulturgut angelegt. Sie können ein Kulturgut im Reiter „Kulturgüter“ anlegen oder hier eine ID/Inventarnummer manuell eintragen.'
      : 'No heritage asset created in project yet. Create a heritage asset in the "Heritage Assets" tab or enter an ID manually.';
  }
  if (type === 'hasCreated') {
    return props.currentLocale === 'de'
      ? 'Im Projekt wurde noch kein Digitalisat angelegt. Sie können ein Digitalisat im Reiter „Digitalisate“ anlegen oder hier eine ID manuell eintragen.'
      : 'No digital resource created in project yet. Create a digital resource in the "Digital Resources" tab or enter an ID manually.';
  }
  if (type === 'hasPart' || type === 'isPartOf' || type === 'isSuccessorOf') {
    return props.currentLocale === 'de'
      ? 'Keine weiteren Aktivitäten im Projekt angelegt. Sie können eine ID/URI manuell eintragen.'
      : 'No other activities created in project yet. You can enter an ID/URI manually.';
  }
  return '';
});

// Quick suggestions based on selected relation type (1-Click toggle!)
const quickSuggestions = computed(() => {
  const type = selectedRelationType.value;

  if (type === 'wasPresentAt') {
    return availableHeritageAssetsList.value.map(ha => ({
      icon: '🏺',
      val: ha.id,
      label: `${ha.id}${ha.name ? ' (' + ha.name + ')' : ''}`,
      title: `Heritage Asset: ${ha.id}`
    })).slice(0, 10);
  }

  if (type === 'hasCreated') {
    return availableDigitalResourcesList.value.map(dr => ({
      icon: '🧊',
      val: dr.id,
      label: `${dr.id}${dr.name ? ' (' + dr.name + ')' : ''}`,
      title: `Digital Resource: ${dr.id}`
    })).slice(0, 10);
  }

  if (type === 'hasPart' || type === 'isPartOf' || type === 'isSuccessorOf') {
    return availableActivitiesList.value.map(act => ({
      icon: '📋',
      val: act.id,
      label: `${act.id}${act.name ? ' (' + act.name + ')' : ''}`,
      title: `Activity: ${act.id}`
    })).slice(0, 10);
  }

  // dcRelation: show cross-cutting suggestions
  return [
    ...availableHeritageAssetsList.value.map(ha => ({ icon: '🏺', val: ha.id, label: ha.id, title: ha.name })),
    ...availableDigitalResourcesList.value.map(dr => ({ icon: '🧊', val: dr.id, label: dr.id, title: dr.name })),
    ...availableActivitiesList.value.map(act => ({ icon: '📋', val: act.id, label: act.id, title: act.name }))
  ].slice(0, 10);
});

// List of all active relations across the fields
const activeRelationsList = computed(() => {
  const list = [];
  RELATION_TYPES.forEach(rel => {
    const arr = props.form[rel.key];
    if (Array.isArray(arr)) {
      arr.forEach((val, idx) => {
        if (val && String(val).trim()) {
          list.push({
            key: rel.key,
            index: idx,
            value: typeof val === 'object' ? (val._value || val.id || JSON.stringify(val)) : String(val).trim(),
            labelDe: rel.labelDe,
            labelEn: rel.labelEn,
            badgeClass: rel.badgeClass,
            icon: rel.icon
          });
        }
      });
    } else if (typeof arr === 'string' && arr.trim()) {
      list.push({
        key: rel.key,
        index: 0,
        value: arr.trim(),
        labelDe: rel.labelDe,
        labelEn: rel.labelEn,
        badgeClass: rel.badgeClass,
        icon: rel.icon
      });
    }
  });
  return list;
});

const activeRelationsCount = computed(() => activeRelationsList.value.length);

const isUrl = (str) => {
  if (!str) return false;
  return str.startsWith('http://') || str.startsWith('https://') || str.startsWith('doi:');
};

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
  const matchedHa = availableHeritageAssetsList.value.find(h => h.id === val || h.inv === val);
  if (matchedHa) {
    return matchedHa.name ? `Kulturgut: ${matchedHa.name}` : 'Kulturgut';
  }
  const matchedDr = availableDigitalResourcesList.value.find(d => d.id === val);
  if (matchedDr) {
    return matchedDr.name ? `Digitalisat: ${matchedDr.name}` : 'Digitalisat';
  }
  const matchedAct = availableActivitiesList.value.find(a => a.id === val);
  if (matchedAct) {
    return matchedAct.name ? `Aktivität: ${matchedAct.name}` : 'Aktivität';
  }
  return '';
};

const addRelation = () => {
  const val = targetInput.value.trim();
  if (!val) return;

  const key = selectedRelationType.value;
  if (!Array.isArray(props.form[key])) {
    props.form[key] = [];
  }

  // Avoid exact duplicates
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

const cancelEdit = () => {
  editingKey.value = null;
  editingValue.value = '';
};

const saveEdit = (item) => {
  const newVal = editingValue.value.trim();
  if (!newVal) {
    removeRelation(item.key, item.index);
  } else if (Array.isArray(props.form[item.key])) {
    props.form[item.key][item.index] = newVal;
    emit('update');
  }
  cancelEdit();
};
</script>
