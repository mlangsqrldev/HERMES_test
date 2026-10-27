<template>
  <div class="w-full bg-base-100 rounded-box border border-base-200 shadow-sm mb-6 overflow-hidden">
    <!-- Header Summary Bar -->
    <div class="p-3.5 bg-base-200/50 flex flex-wrap items-center justify-between gap-3 border-b border-base-200">
      
      <!-- 1. Global Metadata Language Selector -->
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-xs font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          {{ currentLocale === 'de' ? 'Standard-Metadatensprache:' : 'Default Metadata Language:' }}
        </span>

        <div class="flex items-center border border-base-300 rounded-lg overflow-hidden bg-base-200/50">
          <button
            v-for="lang in availableLanguages"
            :key="lang.code"
            type="button"
            class="btn btn-xs border-0 rounded-none px-1.5 min-w-0"
            :class="defaultMetadataLanguage === lang.code ? 'btn-primary' : 'btn-ghost opacity-60 hover:opacity-100'"
            @click="setLanguage(lang.code)"
            :title="lang.name"
          >
            <FlagIcon :code="lang.code" size="md" />
          </button>
        </div>

        <button
          type="button"
          class="btn btn-xs btn-outline btn-primary gap-1"
          @click="emitApplyLanguage"
          :title="currentLocale === 'de' ? 'Aktualisiert die Sprache in allen Feldern und Datensätzen' : 'Applies this language to all fields and records'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ currentLocale === 'de' ? 'Auf alle anwenden' : 'Apply to all' }}
        </button>
      </div>

      <!-- 2. Pools, Settings & Global Rights -->
      <div class="flex items-center gap-2 flex-wrap">
        <!-- Person Pool -->
        <button
          type="button"
          class="btn btn-xs gap-1.5 btn-outline border-base-300 hover:border-primary hover:bg-primary/10 shadow-xs"
          @click="isPersonModalOpen = true"
          :title="currentLocale === 'de' ? 'Zentralen Personen- und Akteurs-Pool öffnen und verwalten' : 'Open and manage central persons & actors pool'"
        >
          <span class="text-sm">👥</span>
          <span class="font-bold text-xs">{{ currentLocale === 'de' ? 'Personen' : 'Persons' }}</span>
          <span class="badge badge-xs badge-neutral font-semibold">{{ savedPersons.length }}</span>
        </button>

        <!-- Organization Pool -->
        <button
          type="button"
          class="btn btn-xs gap-1.5 btn-outline border-base-300 hover:border-primary hover:bg-primary/10 shadow-xs"
          @click="isOrgModalOpen = true"
          :title="currentLocale === 'de' ? 'Zentralen Organisations- und Institutionen-Pool öffnen und verwalten' : 'Open and manage central organizations & institutions pool'"
        >
          <span class="text-sm">🏛️</span>
          <span class="font-bold text-xs">{{ currentLocale === 'de' ? 'Organisationen' : 'Organizations' }}</span>
          <span class="badge badge-xs badge-primary font-semibold text-primary-content">{{ savedOrganizations.length }}</span>
        </button>

        <!-- Collections Pool -->
        <button
          type="button"
          class="btn btn-xs gap-1.5 btn-outline border-base-300 hover:border-accent hover:bg-accent/10 shadow-xs"
          @click="isCollectionModalOpen = true"
          :title="currentLocale === 'de' ? 'Sammlungs-Pool (Collections) verwalten und Profile auswählen' : 'Manage collections pool and select collection profiles'"
        >
          <span class="text-sm">📂</span>
          <span class="font-bold text-xs">{{ currentLocale === 'de' ? 'Sammlungen' : 'Collections' }}</span>
          <span class="badge badge-xs badge-accent font-semibold">{{ savedCollections.length }}</span>
        </button>

        <!-- Master Campaign Presets (Kampagnen-Klammer) -->
        <button
          type="button"
          class="btn btn-xs gap-1.5 btn-outline border-base-300 hover:border-warning hover:bg-warning/10 shadow-xs"
          @click="isCampaignModalOpen = true"
          :title="currentLocale === 'de' ? 'Kampagnen-Klammer & Vererbung für alle Objekte konfigurieren' : 'Configure master campaign presets & inheritance'"
        >
          <span class="text-sm">🎯</span>
          <span class="font-bold text-xs">{{ currentLocale === 'de' ? 'Kampagne' : 'Campaign' }}</span>
          <span class="badge badge-xs" :class="campaignPreset.active ? 'badge-warning font-semibold text-warning-content' : 'badge-ghost'">
            {{ campaignPreset.active ? (currentLocale === 'de' ? 'Aktiv' : 'On') : (currentLocale === 'de' ? 'Aus' : 'Off') }}
          </span>
        </button>

        <!-- API Settings -->
        <button
          type="button"
          class="btn btn-xs gap-1.5 btn-outline border-base-300 hover:border-secondary hover:bg-secondary/10 shadow-xs"
          @click="isApiSettingsOpen = true"
          :title="currentLocale === 'de' ? 'API-Zugangsdaten für GeoNames, Wikidata und Pleiades konfigurieren' : 'Configure API credentials for GeoNames, Wikidata and Pleiades'"
        >
          <span class="text-sm">🔑</span>
          <span class="font-bold text-xs">{{ currentLocale === 'de' ? 'APIs' : 'APIs' }}</span>
        </button>

        <!-- Rights Collapsible Trigger -->
        <button
          type="button"
          class="btn btn-xs gap-1.5 shadow-xs"
          :class="isRightsExpanded ? 'btn-neutral' : 'btn-outline border-base-300'"
          @click="isRightsExpanded = !isRightsExpanded"
        >
          <span class="text-sm">⚖️</span>
          <span class="font-bold text-xs">{{ currentLocale === 'de' ? 'Rechte' : 'Rights' }}</span>
          <span class="badge badge-xs badge-primary font-mono truncate max-w-[110px]" :title="globalRights.licence">
            {{ getLicenceShortCode(globalRights.licence) || 'CC BY 4.0' }}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-3.5 transition-transform duration-200"
            :class="{ 'rotate-180': isRightsExpanded }"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

    </div>

    <!-- Person Pool Modal -->
    <PersonPickerModal
      :isOpen="isPersonModalOpen"
      mode="manage"
      @close="isPersonModalOpen = false"
    />

    <!-- Organization Pool Modal -->
    <OrganizationPickerModal
      :isOpen="isOrgModalOpen"
      mode="manage"
      :currentLocale="currentLocale"
      @close="isOrgModalOpen = false"
    />

    <!-- Collection Pool Modal -->
    <CollectionPickerModal
      :isOpen="isCollectionModalOpen"
      mode="manage"
      :currentLocale="currentLocale"
      @close="isCollectionModalOpen = false"
      @select="handleCollectionSelect"
    />

    <!-- Master Campaign Preset Modal -->
    <CampaignPresetModal
      :isOpen="isCampaignModalOpen"
      :currentLocale="currentLocale"
      @close="isCampaignModalOpen = false"
      @bulk-apply-campaign="handleBulkApplyCampaign"
    />

    <!-- API Settings Modal -->
    <ApiSettingsModal
      :isOpen="isApiSettingsOpen"
      :currentLocale="currentLocale"
      @close="isApiSettingsOpen = false"
    />

    <!-- Collapsible Rights & Licenses Box ("einmal für alles eintragen") -->
    <div v-show="isRightsExpanded" class="p-4 bg-base-100 border-t border-base-200 transition-all">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h4 class="font-bold text-sm flex items-center gap-1.5 text-base-content">
            <span>⚖️</span>
            {{ currentLocale === 'de' ? 'Globale Rechteverwaltung (Einmal für alle Datensätze festlegen)' : 'Global Rights Management (Define once for all records)' }}
          </h4>
          <p class="text-xs opacity-60">
            {{ currentLocale === 'de' ? 'Rechte werden hier global konfiguriert und automatisch in alle Kulturgüter, Digitalisate und Aktivitäten übernommen.' : 'Rights are managed globally here and automatically inherited by all assets, digital resources, and activities.' }}
          </p>
        </div>

        <!-- 1-Click Master Presets -->
        <div class="flex flex-wrap gap-1 items-center">
          <span class="text-[11px] opacity-60 font-semibold uppercase mr-1">{{ currentLocale === 'de' ? 'Schnellvorlagen:' : 'Quick Presets:' }}</span>
          <button
            type="button"
            class="btn btn-xs btn-outline normal-case font-normal"
            @click="applyRightsPreset('ccby')"
          >
            🌐 CC-BY 4.0 (Open Access)
          </button>
          <button
            type="button"
            class="btn btn-xs btn-outline normal-case font-normal"
            @click="applyRightsPreset('cc0')"
          >
            🔓 CC0 1.0 (Public Domain)
          </button>
          <button
            type="button"
            class="btn btn-xs btn-outline normal-case font-normal"
            @click="applyRightsPreset('ccbysa')"
          >
            ⚖️ CC-BY-SA 4.0
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
        <!-- 1. METADATEN-RECHTE (z.B. CC0 1.0 Universal für Metadaten) -->
        <div class="lg:col-span-4 p-3.5 bg-primary/5 rounded-2xl border border-primary/20 flex flex-col justify-between">
          <div>
            <div class="flex flex-wrap items-center justify-between gap-1.5 mb-2 pb-1 border-b border-primary/15">
              <span class="font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5 whitespace-nowrap">
                <span>🏛️</span>
                <span>{{ currentLocale === 'de' ? '1. Metadaten-Rechte' : '1. Metadata Rights' }}</span>
              </span>
              <span class="badge badge-primary badge-xs font-semibold shrink-0">CARARE / Europeana</span>
            </div>
            <p class="text-[11px] text-base-content/60 mb-2 leading-relaxed">
              {{ currentLocale === 'de'
                ? 'Gilt für die beschreibenden Metadaten im CARARE-Dokument (Europeana verlangt standardmäßig CC0).'
                : 'Applies to descriptive metadata in the CARARE record (Europeana requires CC0 by default).' }}
            </p>

            <label class="label py-0.5">
              <span class="label-text text-xs font-semibold">
                {{ currentLocale === 'de' ? 'Metadaten-Lizenz:' : 'Metadata License:' }}
              </span>
            </label>
            <input
              type="text"
              v-model="globalRights.metadataRights"
              class="input input-sm input-bordered w-full font-mono text-xs mb-2"
              placeholder="z.B. CC0 1.0 Universal"
              @change="emitApplyRights"
            />

            <!-- Metadaten Schnell-Buttons -->
            <div class="flex flex-wrap gap-1">
              <button
                type="button"
                class="badge badge-xs cursor-pointer transition-all"
                :class="globalRights.metadataRights === 'CC0 1.0 Universal' ? 'badge-primary font-bold' : 'badge-ghost border border-base-300'"
                @click="globalRights.metadataRights = 'CC0 1.0 Universal'; emitApplyRights()"
              >
                CC0 1.0 Universal
              </button>
              <button
                type="button"
                class="badge badge-xs cursor-pointer transition-all"
                :class="globalRights.metadataRights === 'Public Domain Mark 1.0' ? 'badge-primary font-bold' : 'badge-ghost border border-base-300'"
                @click="globalRights.metadataRights = 'Public Domain Mark 1.0'; emitApplyRights()"
              >
                Public Domain Mark 1.0
              </button>
            </div>
          </div>
        </div>

        <!-- 2. DATEN- & DIGITALISAT-RECHTE (3D-Modelle, Bilder, Punktwolken) -->
        <div class="lg:col-span-8 p-3.5 bg-base-200/40 rounded-2xl border border-base-300 flex flex-col justify-between">
          <div>
            <div class="flex flex-wrap items-center justify-between gap-1.5 mb-2 pb-1 border-b border-base-300/60">
              <span class="font-bold text-xs uppercase tracking-wider text-base-content/80 flex items-center gap-1.5 whitespace-nowrap">
                <span>🧊</span>
                <span>{{ currentLocale === 'de' ? '2. Daten- & Medien-Rechte (3D / Bilder)' : '2. Data & Media Rights (3D / Images)' }}</span>
              </span>
              <span class="badge badge-neutral badge-xs font-mono font-semibold shrink-0">
                {{ getLicenceShortCode(globalRights.licence) || 'CC BY 4.0' }}
              </span>
            </div>
            <p class="text-[11px] text-base-content/60 mb-2 leading-relaxed">
              {{ currentLocale === 'de'
                ? 'Gilt für die eigentlichen 3D-Daten, Texturen, Orthofotos und Rohbilder (Lizenz, Credit-Line und Zugang).'
                : 'Applies to actual 3D data, textures, orthophotos, and RAW images (license, credit line, and access).' }}
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2.5">
              <!-- Digitalisat-Lizenz -->
              <div>
                <label class="label py-0.5">
                  <span class="label-text text-xs font-semibold">
                    {{ currentLocale === 'de' ? 'Daten-Lizenz (Digitalisate):' : 'Data License (Resources):' }}
                  </span>
                </label>
                <select
                  v-model="globalRights.licence"
                  class="select select-sm select-bordered w-full text-xs font-mono"
                  @change="emitApplyRights"
                >
                  <option
                    v-for="lic in CC_LICENCES"
                    :key="lic.code"
                    :value="currentLocale === 'en' ? lic.uriEn : lic.uriDe"
                  >
                    {{ lic.code }} — {{ currentLocale === 'de' ? lic.labelDe : lic.labelEn }}
                  </option>
                  <option v-if="isCustomLicence" :value="globalRights.licence">
                    {{ globalRights.licence }}
                  </option>
                </select>
              </div>

              <!-- Zugangsrechte -->
              <div>
                <label class="label py-0.5">
                  <span class="label-text text-xs font-semibold">
                    {{ currentLocale === 'de' ? 'Zugangsrechte (Access):' : 'Access Rights:' }}
                  </span>
                </label>
                <select v-model="globalRights.accessRights" class="select select-sm select-bordered w-full text-xs" @change="emitApplyRights">
                  <option value="Open access">Open access (Öffentlich zugänglich)</option>
                  <option value="Restricted access">Restricted access (Eingeschränkt)</option>
                </select>
              </div>

              <!-- Copyright / Credit Line -->
              <div>
                <label class="label py-0.5">
                  <span class="label-text text-xs font-semibold">
                    {{ currentLocale === 'de' ? 'Rechteinhaber / Credit Line:' : 'Copyright / Credit Line:' }}
                  </span>
                </label>
                <input
                  type="text"
                  v-model="globalRights.copyrightCreditLine"
                  class="input input-sm input-bordered w-full text-xs"
                  placeholder="z.B. Staatliche Museen zu Berlin / BCDH Uni Bonn"
                  @change="emitApplyRights"
                />
              </div>

              <!-- Reproduktionsrechte -->
              <div>
                <label class="label py-0.5">
                  <span class="label-text text-xs font-semibold">
                    {{ currentLocale === 'de' ? 'Reproduktionsrechte:' : 'Reproduction Rights:' }}
                  </span>
                </label>
                <input
                  type="text"
                  v-model="globalRights.reproductionRights"
                  class="input input-sm input-bordered w-full text-xs"
                  placeholder="z.B. Freie Nutzung für Wissenschaft und Forschung"
                  @change="emitApplyRights"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Button & Feedback -->
      <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-base-200">
        <div class="text-xs text-success flex items-center gap-1.5" v-if="appliedToast">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span class="font-bold">{{ appliedToast }}</span>
        </div>
        <div v-else class="text-xs text-base-content/50 italic">
          {{ currentLocale === 'de' ? 'Wird für alle neu angelegten und bestehenden Teile übernommen.' : 'Applied to all new and existing records.' }}
        </div>

        <button
          type="button"
          class="btn btn-sm btn-primary gap-1.5"
          @click="emitApplyRights"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span class="font-bold">{{ currentLocale === 'de' ? 'Auf alle Abschnitte & Datensätze anwenden' : 'Apply to all records & sections' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { 
  defaultMetadataLanguage, 
  globalRights, 
  saveGlobalRights, 
  savedPersons, 
  savedOrganizations, 
  savedCollections,
  campaignPreset,
  CC_LICENCES, 
  getLicenceShortCode, 
  resolveLicenceUri 
} from '../utils/sharedState.js';
import PersonPickerModal from './PersonPickerModal.vue';
import OrganizationPickerModal from './OrganizationPickerModal.vue';
import CollectionPickerModal from './CollectionPickerModal.vue';
import CampaignPresetModal from './CampaignPresetModal.vue';
import ApiSettingsModal from './ApiSettingsModal.vue';
import FlagIcon from './FlagIcon.vue';

const props = defineProps({
  currentLocale: {
    type: String,
    default: 'de'
  }
});

const emit = defineEmits(['apply-rights', 'apply-language', 'apply-collection', 'bulk-apply-campaign']);

const isRightsExpanded = ref(false);
const isPersonModalOpen = ref(false);
const isOrgModalOpen = ref(false);
const isCollectionModalOpen = ref(false);
const isCampaignModalOpen = ref(false);
const isApiSettingsOpen = ref(false);
const appliedToast = ref('');

const handleCollectionSelect = (col) => {
  emit('apply-collection', col);
  showToast(props.currentLocale === 'de' ? `Sammlung "${col.title || col.id}" ausgewählt!` : `Collection "${col.title || col.id}" selected!`);
};

const handleBulkApplyCampaign = (preset) => {
  emit('bulk-apply-campaign', preset);
  showToast(props.currentLocale === 'de' ? 'Kampagne auf alle Datensätze übertragen!' : 'Campaign presets applied to all records!');
};

const isCustomLicence = computed(() => {
  if (!globalRights.licence) return false;
  return !CC_LICENCES.some(l => l.uriDe === globalRights.licence || l.uriEn === globalRights.licence);
});

const availableLanguages = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
];

const setLanguage = (langCode) => {
  defaultMetadataLanguage.value = langCode;
  emitApplyLanguage();
};

const emitApplyLanguage = () => {
  emit('apply-language', defaultMetadataLanguage.value);
  showToast(props.currentLocale === 'de' ? `Standardsprache auf "${defaultMetadataLanguage.value.toUpperCase()}" gesetzt!` : `Default language set to "${defaultMetadataLanguage.value.toUpperCase()}"!`);
};

const emitApplyRights = () => {
  saveGlobalRights(globalRights);
  emit('apply-rights', globalRights);
  showToast(props.currentLocale === 'de' ? 'Rechte & Lizenzen für alle Abschnitte übernommen!' : 'Rights & licenses applied to all sections!');
};

const applyRightsPreset = (type) => {
  const isEn = props.currentLocale === 'en';
  if (type === 'ccby') {
    globalRights.metadataRights = 'CC0 1.0 Universal';
    globalRights.licence = isEn
      ? 'https://creativecommons.org/licenses/by/4.0/deed.en'
      : 'https://creativecommons.org/licenses/by/4.0/deed.de';
    globalRights.accessRights = 'Open access';
    globalRights.reproductionRights = isEn
      ? 'Free use for science and research citing the source'
      : 'Freie Nutzung für Wissenschaft und Forschung unter Nennung der Quelle';
  } else if (type === 'cc0') {
    globalRights.metadataRights = 'CC0 1.0 Universal';
    globalRights.licence = isEn
      ? 'https://creativecommons.org/publicdomain/zero/1.0/deed.en'
      : 'https://creativecommons.org/publicdomain/zero/1.0/deed.de';
    globalRights.accessRights = 'Open access';
    globalRights.reproductionRights = isEn ? 'Public Domain' : 'Gemeinfrei / Public Domain';
  } else if (type === 'ccbysa') {
    globalRights.metadataRights = 'CC0 1.0 Universal';
    globalRights.licence = isEn
      ? 'https://creativecommons.org/licenses/by-sa/4.0/deed.en'
      : 'https://creativecommons.org/licenses/by-sa/4.0/deed.de';
    globalRights.accessRights = 'Open access';
    globalRights.reproductionRights = isEn
      ? 'ShareAlike under same conditions'
      : 'Weitergabe unter gleichen Bedingungen';
  }
  emitApplyRights();
};

const showToast = (msg) => {
  appliedToast.value = msg;
  setTimeout(() => {
    appliedToast.value = '';
  }, 3500);
};
</script>
