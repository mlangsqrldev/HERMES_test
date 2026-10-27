<template>
  <div v-if="isOpen" class="modal modal-open z-50">
    <div class="modal-box max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-base-100 shadow-2xl border border-base-300">
      
      <!-- Modal Header -->
      <div class="p-4 bg-base-200/80 border-b border-base-300 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl shadow-xs">
            🎯
          </div>
          <div>
            <h3 class="font-bold text-lg text-base-content flex items-center gap-2">
              {{ currentLocale === 'de' ? 'Kampagnen-Klammer & Vererbung' : 'Master Campaign Presets & Inheritance' }}
              <span class="badge badge-sm" :class="localPreset.active ? 'badge-success' : 'badge-ghost'">
                {{ localPreset.active ? (currentLocale === 'de' ? 'Aktiv' : 'Active') : (currentLocale === 'de' ? 'Inaktiv' : 'Inactive') }}
              </span>
            </h3>
            <p class="text-xs text-base-content/60">
              {{ currentLocale === 'de' 
                ? 'Definiere 1x Projekt, Institution, Lizenzen, Scanner & Paradaten – alle Objekte erben diese Daten automatisch.' 
                : 'Define project, institution, licenses, equipment & paradata once – all assets inherit these defaults automatically.' }}
            </p>
          </div>
        </div>

        <button type="button" class="btn btn-sm btn-circle btn-ghost" @click="close">✕</button>
      </div>

      <!-- Quick Template Bar -->
      <div class="px-5 py-2.5 bg-primary/5 border-b border-base-200 flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-base-content/70">
            {{ currentLocale === 'de' ? 'Schnell-Vorlagen:' : 'Quick Templates:' }}
          </span>
          <div class="flex flex-wrap gap-1.5">
            <button
              type="button"
              class="btn btn-xs btn-outline btn-primary gap-1"
              @click="applyQuickTemplate('3d_scanner')"
            >
              <span>🧊</span>
              <span>3D-Streifenlicht-Scan</span>
            </button>
            <button
              type="button"
              class="btn btn-xs btn-outline btn-secondary gap-1"
              @click="applyQuickTemplate('photogrammetry')"
            >
              <span>📸</span>
              <span>Photogrammetrie & Texturen</span>
            </button>
            <button
              type="button"
              class="btn btn-xs btn-outline btn-accent gap-1"
              @click="applyQuickTemplate('museum_inventory')"
            >
              <span>🏛️</span>
              <span>Museums-Inventur</span>
            </button>
          </div>
        </div>

        <!-- Toggle Active -->
        <label class="cursor-pointer label p-0 gap-2">
          <span class="label-text text-xs font-bold">
            {{ currentLocale === 'de' ? 'Vererbung aktiv' : 'Inheritance Active' }}
          </span>
          <input type="checkbox" v-model="localPreset.active" class="toggle toggle-success toggle-sm" />
        </label>
      </div>

      <!-- Modal Body (Tabs / Sections) -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">

        <!-- 1. Kampagne & Institution -->
        <div class="p-4 bg-base-200/40 rounded-xl border border-base-300/60 space-y-3">
          <div class="flex items-center justify-between border-b border-base-300/60 pb-2">
            <h4 class="font-bold text-sm flex items-center gap-2 text-primary">
              <span>🎯</span>
              <span>{{ currentLocale === 'de' ? '1. Projekt & Kampagnen-Basis' : '1. Project & Campaign Basics' }}</span>
            </h4>
            <span class="text-xs text-base-content/50">Gilt für Sektion 01 & alle Kulturgüter</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label py-1"><span class="label-text text-xs font-bold">Kampagnen- / Projektname</span></label>
              <input
                type="text"
                v-model="localPreset.name"
                class="input input-sm input-bordered w-full"
                placeholder="z. B. 3D-Digitalisierungskampagne Skulpturensaal 2026"
              />
            </div>

            <div class="form-control">
              <div class="flex items-center justify-between">
                <label class="label py-1"><span class="label-text text-xs font-bold">Quell-Institution (Source)</span></label>
                <button
                  type="button"
                  class="btn btn-xs btn-ghost text-primary gap-1"
                  @click="openOrgPicker"
                >
                  <span>🏛️</span>
                  <span>{{ currentLocale === 'de' ? 'Aus Organisations-Pool' : 'From Org Pool' }}</span>
                </button>
              </div>
              <input
                type="text"
                v-model="localPreset.source"
                class="input input-sm input-bordered w-full"
                placeholder="z. B. Antikensammlung, Staatliche Museen zu Berlin"
              />
            </div>

            <div class="form-control">
              <label class="label py-1"><span class="label-text text-xs font-bold">Land</span></label>
              <input
                type="text"
                v-model="localPreset.country"
                class="input input-sm input-bordered w-full"
                placeholder="z. B. Deutschland"
              />
            </div>

            <div class="form-control">
              <label class="label py-1"><span class="label-text text-xs font-bold">Standard-Aufbewahrungsort / Magazin</span></label>
              <input
                type="text"
                v-model="localPreset.repositoryLocation"
                class="input input-sm input-bordered w-full"
                placeholder="z. B. Hauptsaal, Vitrine 12 oder Magazin C"
              />
            </div>
          </div>
        </div>

        <!-- 2. Rechte, Lizenzen & Open Access -->
        <div class="p-4 bg-base-200/40 rounded-xl border border-base-300/60 space-y-3">
          <div class="flex items-center justify-between border-b border-base-300/60 pb-2">
            <h4 class="font-bold text-sm flex items-center gap-2 text-secondary">
              <span>⚖️</span>
              <span>{{ currentLocale === 'de' ? '2. Standard-Rechte & Lizenzen' : '2. Default Rights & Licences' }}</span>
            </h4>
            <span class="text-xs text-base-content/50">Wird für alle 300 Objekte & Digitalisate vererbt</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label py-1"><span class="label-text text-xs font-bold">Standard-Lizenz</span></label>
              <select v-model="localPreset.licence" class="select select-sm select-bordered w-full">
                <option v-for="lic in CC_LICENCES" :key="lic.code" :value="lic.uriDe">
                  {{ lic.labelDe }} ({{ lic.short }})
                </option>
              </select>
            </div>

            <div class="form-control">
              <label class="label py-1"><span class="label-text text-xs font-bold">Copyright / Creditline</span></label>
              <input
                type="text"
                v-model="localPreset.copyrightCreditLine"
                class="input input-sm input-bordered w-full"
                placeholder="z. B. Antikensammlung Berlin / BCDH Universität Bonn"
              />
            </div>

            <div class="form-control">
              <label class="label py-1"><span class="label-text text-xs font-bold">Zugangsrechte (Access Rights)</span></label>
              <input
                type="text"
                v-model="localPreset.accessRights"
                class="input input-sm input-bordered w-full"
                placeholder="Open access"
              />
            </div>

            <div class="form-control">
              <label class="label py-1"><span class="label-text text-xs font-bold">Metadatenrechte</span></label>
              <input
                type="text"
                v-model="localPreset.metadataRights"
                class="input input-sm input-bordered w-full"
                placeholder="CC0 1.0 Universal"
              />
            </div>
          </div>
        </div>

        <!-- 3. Scanner, Geräte & Paradaten (Sektion 04 & 03) -->
        <div class="p-4 bg-base-200/40 rounded-xl border border-base-300/60 space-y-3">
          <div class="flex items-center justify-between border-b border-base-300/60 pb-2">
            <h4 class="font-bold text-sm flex items-center gap-2 text-accent">
              <span>🛠️</span>
              <span>{{ currentLocale === 'de' ? '3. 3D-Equipment & Paradaten (Workflow)' : '3. 3D Equipment & Paradata' }}</span>
            </h4>
            <span class="text-xs text-base-content/50">Automatische Befüllung von Sektion 04</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label py-1"><span class="label-text text-xs font-bold">Aktivitäts-ID</span></label>
              <input
                type="text"
                v-model="localPreset.activityId"
                class="input input-sm input-bordered w-full font-mono text-xs"
                placeholder="ACT-2026-DIGI-01"
              />
            </div>

            <div class="form-control">
              <label class="label py-1"><span class="label-text text-xs font-bold">Event-Typ (AAT)</span></label>
              <input
                type="text"
                v-model="localPreset.eventType"
                class="input input-sm input-bordered w-full"
                placeholder="3D digitisation"
              />
            </div>

            <div class="form-control">
              <label class="label py-1"><span class="label-text text-xs font-bold">Hardware / Scanner</span></label>
              <input
                type="text"
                v-model="localPreset.equipment"
                class="input input-sm input-bordered w-full"
                placeholder="z. B. Artec Leo 2026 Pro / Sony A7R V polarisiert"
              />
            </div>

            <div class="form-control">
              <label class="label py-1"><span class="label-text text-xs font-bold">Software-Pipeline</span></label>
              <input
                type="text"
                v-model="localPreset.software"
                class="input input-sm input-bordered w-full"
                placeholder="z. B. RealityCapture 1.4 / Blender 4.2 LTS / Substance 3D"
              />
            </div>

            <div class="form-control col-span-full">
              <label class="label py-1"><span class="label-text text-xs font-bold">Standard-Paradatennotiz (Aufnahmebedingungen, Glättung, PBR)</span></label>
              <textarea
                v-model="localPreset.paradataNotes"
                class="textarea textarea-bordered textarea-sm w-full font-mono text-xs"
                rows="2"
                placeholder="Streifenlicht-Scan mit 0.05 mm optischer Triangulation, Poisson Depth 14, 4K PBR Texturen, Farbtreue Delta-E < 1.2"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 4. Kulturgut-Vorbelegungen (Material & Epoche) -->
        <div class="p-4 bg-base-200/40 rounded-xl border border-base-300/60 space-y-3">
          <div class="flex items-center justify-between border-b border-base-300/60 pb-2">
            <h4 class="font-bold text-sm flex items-center gap-2 text-warning">
              <span>🏺</span>
              <span>{{ currentLocale === 'de' ? '4. Kulturgut-Defaults (Epoche & Material)' : '4. Asset Defaults' }}</span>
            </h4>
            <span class="text-xs text-base-content/50">Wird für neu angelegte Kulturgüter vorbelegt</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label py-1"><span class="label-text text-xs font-bold">Standard-Epoche / Datierungsbezeichnung</span></label>
              <input
                type="text"
                v-model="localPreset.defaultTemporal.periodName"
                class="input input-sm input-bordered w-full"
                placeholder="z. B. Klassische Antike (-0480 bis -0323)"
              />
            </div>

            <div class="form-control">
              <label class="label py-1"><span class="label-text text-xs font-bold">Datierung Start / Ende (Jahr)</span></label>
              <div class="flex gap-2">
                <input
                  type="text"
                  v-model="localPreset.defaultTemporal.startDate"
                  class="input input-sm input-bordered w-1/2 font-mono text-xs"
                  placeholder="Start: -0480"
                />
                <input
                  type="text"
                  v-model="localPreset.defaultTemporal.endDate"
                  class="input input-sm input-bordered w-1/2 font-mono text-xs"
                  placeholder="Ende: -0323"
                />
              </div>
            </div>

            <div class="form-control col-span-full">
              <label class="label py-1"><span class="label-text text-xs font-bold">Standard-Materialien (Komma-getrennt)</span></label>
              <input
                type="text"
                :value="materialsString"
                @input="updateMaterialsString($event.target.value)"
                class="input input-sm input-bordered w-full"
                placeholder="z. B. Marmor, Bronze, Terracotta"
              />
            </div>
          </div>
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="p-4 bg-base-200/80 border-t border-base-300 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="btn btn-sm btn-ghost text-base-content/60"
            @click="resetToDefault"
          >
            🔄 {{ currentLocale === 'de' ? 'Standard zurücksetzen' : 'Reset to Default' }}
          </button>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="btn btn-sm btn-outline btn-accent gap-1.5"
            @click="handleBulkApply"
            :title="currentLocale === 'de' ? 'Wendet diese Kampagnen-Voreinstellungen auf alle 300 bereits erfassten Kulturgüter und Digitalisate an' : 'Applies presets to all existing records'"
          >
            <span>⚡</span>
            <span>{{ currentLocale === 'de' ? 'Auf alle vorhandenen Objekte anwenden' : 'Bulk-Apply to All Records' }}</span>
          </button>

          <button
            type="button"
            class="btn btn-sm btn-primary gap-1.5 shadow-sm"
            @click="saveAndClose"
          >
            <span>💾</span>
            <span>{{ currentLocale === 'de' ? 'Als Kampagnen-Standard speichern' : 'Save Campaign Presets' }}</span>
          </button>
        </div>
      </div>

    </div>
  </div>

  <!-- Organization Picker Helper Modal -->
  <OrganizationPickerModal
    :is-open="isOrgPickerOpen"
    :current-locale="currentLocale"
    initial-mode="pick"
    @close="isOrgPickerOpen = false"
    @select="handleOrgSelected"
  />
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import {
  campaignPreset,
  saveCampaignPreset,
  resetCampaignPresetToDefault,
  CC_LICENCES
} from '../utils/sharedState.js';
import OrganizationPickerModal from './OrganizationPickerModal.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  currentLocale: {
    type: String,
    default: 'de'
  }
});

const emit = defineEmits(['close', 'bulk-apply-campaign']);

const localPreset = ref(JSON.parse(JSON.stringify(campaignPreset)));

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    localPreset.value = JSON.parse(JSON.stringify(campaignPreset));
  }
});

const materialsString = computed(() => {
  if (Array.isArray(localPreset.value.defaultMaterials)) {
    return localPreset.value.defaultMaterials.join(', ');
  }
  return '';
});

const updateMaterialsString = (str) => {
  if (!str) {
    localPreset.value.defaultMaterials = [];
    return;
  }
  localPreset.value.defaultMaterials = str.split(',').map(s => s.trim()).filter(Boolean);
};

const isOrgPickerOpen = ref(false);
const openOrgPicker = () => {
  isOrgPickerOpen.value = true;
};

const handleOrgSelected = (org) => {
  if (org && org.name) {
    localPreset.value.source = org.name;
    localPreset.value.sourceGnd = org.gnd || '';
    if (org.country) localPreset.value.country = org.country;
  }
  isOrgPickerOpen.value = false;
};

const applyQuickTemplate = (tplKey) => {
  if (tplKey === '3d_scanner') {
    localPreset.value.activityName = '3D-Streifenlicht-Scanning & Nahbereichsphotogrammetrie';
    localPreset.value.eventType = '3D digitisation';
    localPreset.value.equipment = 'Artec Leo 2026 Pro / Sony A7R V (polarisiertes Ringlicht)';
    localPreset.value.software = 'RealityCapture 1.4 / Blender 4.2 LTS / Substance 3D';
    localPreset.value.paradataNotes = 'Optische Triangulation 0.05 mm, Poisson Depth 14, 4K PBR Texturen (Albedo, Normal, Roughness), Delta-E < 1.2';
    localPreset.value.licence = 'https://creativecommons.org/licenses/by/4.0/deed.de';
    localPreset.value.accessRights = 'Open access';
    localPreset.value.defaultMaterials = ['Marmor'];
    localPreset.value.defaultTemporal.periodName = 'Klassische Antike (-0480 bis -0323)';
    localPreset.value.defaultTemporal.startDate = '-0480';
    localPreset.value.defaultTemporal.endDate = '-0323';
  } else if (tplKey === 'photogrammetry') {
    localPreset.value.activityName = 'High-Resolution Nahbereichsphotogrammetrie & Farbreproduktion';
    localPreset.value.eventType = 'photogrammetry';
    localPreset.value.equipment = 'Phase One IQ4 150MP / Schneider Kreuznach 80mm / Broncolor Blitzanlage';
    localPreset.value.software = 'Agisoft Metashape Pro 2.1 / Capture One Pro 24';
    localPreset.value.paradataNotes = 'Kreuzpolarisierte Aufnahmen (ColorChecker Digital SG), 16-Bit RAW Farbtiefe, mittlere Reprojektionsabweichung 0.28 px';
    localPreset.value.licence = 'https://creativecommons.org/licenses/by-sa/4.0/deed.de';
    localPreset.value.defaultMaterials = ['Terracotta', 'Ton'];
  } else if (tplKey === 'museum_inventory') {
    localPreset.value.activityName = 'Museums-Inventarisierung & Sammlungsdigitalisierung 2026';
    localPreset.value.eventType = 'digitisation';
    localPreset.value.equipment = 'Nikon Z8 / Profoto Studioblitze';
    localPreset.value.software = 'Adobe Lightroom Classic / MuseumPlus Bridge';
    localPreset.value.paradataNotes = 'Standard-Mehransichten-Dokumentation (Vorder-, Rück-, Unterseite, Detailaufnahmen)';
    localPreset.value.licence = 'https://creativecommons.org/licenses/by/4.0/deed.de';
  }
};

const resetToDefault = () => {
  resetCampaignPresetToDefault();
  localPreset.value = JSON.parse(JSON.stringify(campaignPreset));
};

const saveAndClose = () => {
  saveCampaignPreset(localPreset.value);
  emit('close');
};

const handleBulkApply = () => {
  saveCampaignPreset(localPreset.value);
  emit('bulk-apply-campaign', localPreset.value);
  emit('close');
};

const close = () => {
  emit('close');
};
</script>
