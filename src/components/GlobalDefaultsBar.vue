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

      <!-- 2. Person Pool, API Settings & Global Rights Box -->
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="btn btn-xs gap-1.5 btn-outline border-base-300 hover:border-primary hover:bg-primary/10"
          @click="isPersonModalOpen = true"
          :title="currentLocale === 'de' ? 'Zentralen Personen- und Akteurs-Pool öffnen und verwalten' : 'Open and manage central persons & actors pool'"
        >
          <span class="text-sm">👥</span>
          <span class="font-bold text-xs">{{ currentLocale === 'de' ? 'Personen-Pool' : 'Persons Pool' }}</span>
          <span class="badge badge-xs badge-neutral font-semibold">{{ savedPersons.length }}</span>
        </button>

        <button
          type="button"
          class="btn btn-xs gap-1.5 btn-outline border-base-300 hover:border-secondary hover:bg-secondary/10"
          @click="isApiSettingsOpen = true"
          :title="currentLocale === 'de' ? 'API-Zugangsdaten für GeoNames, Wikidata und Pleiades konfigurieren' : 'Configure API credentials for GeoNames, Wikidata and Pleiades'"
        >
          <span class="text-sm">🔑</span>
          <span class="font-bold text-xs">{{ currentLocale === 'de' ? 'API-Zugangsdaten' : 'API Credentials' }}</span>
        </button>

        <button
          type="button"
          class="btn btn-xs gap-1.5"
          :class="isRightsExpanded ? 'btn-neutral' : 'btn-outline border-base-300'"
          @click="isRightsExpanded = !isRightsExpanded"
        >
          <span class="text-sm">⚖️</span>
          <span class="font-bold text-xs">{{ currentLocale === 'de' ? 'Zentrale Rechte & Lizenzen' : 'Global Rights & Licenses' }}</span>
          <span class="badge badge-xs badge-primary font-mono truncate max-w-[120px]" :title="globalRights.licence">
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

    <!-- API Settings Modal -->
    <ApiSettingsModal
      :isOpen="isApiSettingsOpen"
      :currentLocale="currentLocale"
      @close="isApiSettingsOpen = false"
    />

    <!-- Collapsible Rights & Licenses Box ("einmal für alles eintragen") -->
    <div v-show="isRightsExpanded" class="p-4 bg-base-100 border-t border-base-200 transition-all">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h4 class="font-bold text-sm flex items-center gap-1.5 text-base-content">
            <span>⚖️</span>
            {{ currentLocale === 'de' ? 'Einmal für alle Datensätze festlegen' : 'Define once for all records' }}
          </h4>
          <p class="text-xs opacity-60">
            {{ currentLocale === 'de' ? 'Diese Angaben werden für Kulturgüter, 3D-Modelle, Bilder und Aktivitäten automatisch übernommen.' : 'These values are automatically applied to heritage assets, 3D models, images, and activities.' }}
          </p>
        </div>

        <!-- 1-Click Presets -->
        <div class="flex flex-wrap gap-1 items-center">
          <span class="text-[11px] opacity-60 font-semibold uppercase mr-1">{{ currentLocale === 'de' ? 'Vorlagen:' : 'Presets:' }}</span>
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

      <!-- Fields Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <!-- Metadaten-Rechte -->
        <div>
          <label class="label py-1">
            <span class="label-text text-xs font-bold">{{ currentLocale === 'de' ? 'Metadaten-Lizenz (CARARE)' : 'Metadata License' }}</span>
          </label>
          <input
            type="text"
            v-model="globalRights.metadataRights"
            class="input input-sm input-bordered w-full text-xs font-mono"
            placeholder="z.B. CC0 1.0 Universal"
          />
        </div>

        <!-- Lizenz der Medien/Modelle -->
        <div>
          <label class="label py-1">
            <span class="label-text text-xs font-bold">{{ currentLocale === 'de' ? 'Digitalisat-Lizenz (Modelle/Bilder)' : 'Resource License' }}</span>
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
              {{ currentLocale === 'de' ? lic.labelDe : lic.labelEn }}
            </option>
            <option v-if="isCustomLicence" :value="globalRights.licence">
              {{ globalRights.licence }}
            </option>
          </select>
        </div>

        <!-- Zugangsrechte -->
        <div>
          <label class="label py-1">
            <span class="label-text text-xs font-bold">{{ currentLocale === 'de' ? 'Zugangsrechte (Access)' : 'Access Rights' }}</span>
          </label>
          <select v-model="globalRights.accessRights" class="select select-sm select-bordered w-full text-xs">
            <option value="Open access">Open access (Öffentlich zugänglich)</option>
            <option value="Restricted access">Restricted access (Eingeschränkt)</option>
          </select>
        </div>

        <!-- Copyright Credit Line -->
        <div class="lg:col-span-1">
          <label class="label py-1">
            <span class="label-text text-xs font-bold">{{ currentLocale === 'de' ? 'Rechteinhaber / Credit Line' : 'Copyright Credit Line' }}</span>
          </label>
          <input
            type="text"
            v-model="globalRights.copyrightCreditLine"
            class="input input-sm input-bordered w-full text-xs"
            placeholder="z.B. Stiftung Preußischer Kulturbesitz..."
          />
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
import { defaultMetadataLanguage, globalRights, saveGlobalRights, savedPersons, CC_LICENCES, getLicenceShortCode, resolveLicenceUri } from '../utils/sharedState.js';
import PersonPickerModal from './PersonPickerModal.vue';
import ApiSettingsModal from './ApiSettingsModal.vue';
import FlagIcon from './FlagIcon.vue';

const props = defineProps({
  currentLocale: {
    type: String,
    default: 'de'
  }
});

const emit = defineEmits(['apply-rights', 'apply-language']);

const isRightsExpanded = ref(false);
const isPersonModalOpen = ref(false);
const isApiSettingsOpen = ref(false);
const appliedToast = ref('');

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
