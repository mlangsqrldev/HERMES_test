<template>
  <div
    class="w-full bg-base-100 rounded-box border border-base-200 shadow-sm mb-6 overflow-hidden"
  >
    <!-- Header Summary Bar -->
    <div
      class="p-3.5 bg-base-200/50 flex flex-wrap items-center justify-between gap-3 border-b border-base-200"
    >
      <!-- 1. Global Metadata Language Selector -->
      <div class="flex flex-wrap items-center gap-2">
        <span
          class="text-xs font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-4 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
            />
          </svg>
          {{
            currentLocale === "de"
              ? "Metadaten-Sprache (xml:lang):"
              : "Metadata Language (xml:lang):"
          }}
        </span>

        <div
          class="flex items-center border border-base-300 rounded-lg overflow-hidden bg-base-200/50"
        >
          <button
            v-for="lang in availableLanguages"
            :key="lang.code"
            type="button"
            class="btn btn-xs border-0 rounded-none px-1.5 min-w-0"
            :class="
              defaultMetadataLanguage === lang.code
                ? 'btn-primary'
                : 'btn-ghost opacity-60 hover:opacity-100'
            "
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
          :title="
            currentLocale === 'de'
              ? 'Aktualisiert die Sprache in allen Feldern und Datensätzen'
              : 'Applies this language to all fields and records'
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {{ currentLocale === "de" ? "Auf alle anwenden" : "Apply to all" }}
        </button>
      </div>

      <!-- 2. Pools, Settings & Global Rights -->
      <div class="flex items-center gap-2 flex-wrap">
        <!-- Person Pool -->
        <button
          type="button"
          class="btn btn-xs gap-1.5 btn-outline border-base-300 hover:border-primary hover:bg-primary/10 shadow-xs"
          @click="isPersonModalOpen = true"
          :title="
            currentLocale === 'de'
              ? 'Zentralen Personen- und Akteurs-Pool öffnen und verwalten'
              : 'Open and manage central persons & actors pool'
          "
        >
          <span class="text-sm">👥</span>
          <span class="font-bold text-xs">{{
            currentLocale === "de" ? "Personen" : "Persons"
          }}</span>
          <span class="badge badge-xs badge-neutral font-semibold">{{
            savedPersons.length
          }}</span>
        </button>

        <!-- Organization Pool -->
        <button
          type="button"
          class="btn btn-xs gap-1.5 btn-outline border-base-300 hover:border-primary hover:bg-primary/10 shadow-xs"
          @click="isOrgModalOpen = true"
          :title="
            currentLocale === 'de'
              ? 'Zentralen Organisations- und Institutionen-Pool öffnen und verwalten'
              : 'Open and manage central organizations & institutions pool'
          "
        >
          <span class="text-sm">🏛️</span>
          <span class="font-bold text-xs">{{
            currentLocale === "de" ? "Organisationen" : "Organizations"
          }}</span>
          <span
            class="badge badge-xs badge-primary font-semibold text-primary-content"
            >{{ savedOrganizations.length }}</span
          >
        </button>

        <!-- Collections Pool -->
        <button
          type="button"
          class="btn btn-xs gap-1.5 btn-outline border-base-300 hover:border-accent hover:bg-accent/10 shadow-xs"
          @click="isCollectionModalOpen = true"
          :title="
            currentLocale === 'de'
              ? 'Sammlungs-Pool (Collections) verwalten und Profile auswählen'
              : 'Manage collections pool and select collection profiles'
          "
        >
          <span class="text-sm">📂</span>
          <span class="font-bold text-xs">{{
            currentLocale === "de" ? "Sammlungen" : "Collections"
          }}</span>
          <span class="badge badge-xs badge-accent font-semibold">{{
            savedCollections.length
          }}</span>
        </button>

        <!-- Software Pool -->
        <button
          type="button"
          class="btn btn-xs gap-1.5 btn-outline border-base-300 hover:border-info hover:bg-info/10 shadow-xs"
          @click="isSoftwareModalOpen = true"
          :title="
            currentLocale === 'de'
              ? 'Zentralen Software- & Pipeline-Pool öffnen und verwalten'
              : 'Open and manage central software & pipeline pool'
          "
        >
          <span class="text-sm">💻</span>
          <span class="font-bold text-xs">{{
            currentLocale === "de" ? "Software" : "Software"
          }}</span>
          <span class="badge badge-xs badge-info font-semibold">{{
            savedSoftware.length
          }}</span>
        </button>

        <!-- Equipment / Geräte Pool -->
        <button
          type="button"
          class="btn btn-xs gap-1.5 btn-outline border-base-300 hover:border-accent hover:bg-accent/10 shadow-xs"
          @click="isEquipmentModalOpen = true"
          :title="
            currentLocale === 'de'
              ? 'Zentralen Geräte- und Hardware-Pool (3D-Scanner, Kameras, Targets) verwalten'
              : 'Open and manage central equipment & hardware pool'
          "
        >
          <span class="text-sm">📷</span>
          <span class="font-bold text-xs">{{
            currentLocale === "de" ? "Geräte" : "Equipment"
          }}</span>
          <span class="badge badge-xs badge-accent font-semibold">{{
            savedEquipment.length
          }}</span>
        </button>

        <!-- API Settings -->
        <button
          type="button"
          class="btn btn-xs gap-1.5 btn-outline border-base-300 hover:border-secondary hover:bg-secondary/10 shadow-xs"
          @click="isApiSettingsOpen = true"
          :title="
            currentLocale === 'de'
              ? 'API-Zugangsdaten für GeoNames, Wikidata und Pleiades konfigurieren'
              : 'Configure API credentials for GeoNames, Wikidata and Pleiades'
          "
        >
          <span class="text-sm">🔑</span>
          <span class="font-bold text-xs">{{
            currentLocale === "de" ? "APIs" : "APIs"
          }}</span>
        </button>

        <!-- Rights Modal Trigger -->
        <button
          type="button"
          class="btn btn-xs gap-1.5 btn-outline border-base-300 hover:border-primary hover:bg-primary/10 shadow-xs"
          @click="isRightsModalOpen = true"
          :title="
            currentLocale === 'de'
              ? 'Globale Rechte & Bereichs-Abweichungen verwalten'
              : 'Manage global rights & per-section overrides'
          "
        >
          <span class="text-sm">⚖️</span>
          <span class="font-bold text-xs">{{
            currentLocale === "de" ? "Rechte" : "Rights"
          }}</span>
          <span
            class="badge badge-xs badge-primary font-mono truncate max-w-[110px]"
            :title="globalRights.licence"
          >
            {{ getLicenceShortCode(globalRights.licence) || "CC BY 4.0" }}
          </span>
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

    <!-- Software Pool Modal -->
    <SoftwarePickerModal
      :isOpen="isSoftwareModalOpen"
      mode="manage"
      :locale="currentLocale"
      @close="isSoftwareModalOpen = false"
    />

    <!-- Equipment Pool Modal -->
    <EquipmentPickerModal
      :isOpen="isEquipmentModalOpen"
      mode="manage"
      :locale="currentLocale"
      @close="isEquipmentModalOpen = false"
    />

    <!-- API Settings Modal -->
    <ApiSettingsModal
      :isOpen="isApiSettingsOpen"
      :currentLocale="currentLocale"
      @close="isApiSettingsOpen = false"
    />

    <!-- Rights & Licenses Modal -->
    <RightsSettingsModal
      :isOpen="isRightsModalOpen"
      :locale="currentLocale"
      :collectionForm="collectionForm"
      :heritageItems="heritageItems"
      :digitalItems="digitalItems"
      @close="isRightsModalOpen = false"
      @apply-rights="onApplyRightsFromModal"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  defaultMetadataLanguage,
  globalRights,
  savedPersons,
  savedOrganizations,
  savedCollections,
  savedSoftware,
  savedEquipment,
  getLicenceShortCode,
} from "../utils/sharedState.js";
import PersonPickerModal from "./PersonPickerModal.vue";
import OrganizationPickerModal from "./OrganizationPickerModal.vue";
import CollectionPickerModal from "./CollectionPickerModal.vue";
import SoftwarePickerModal from "./SoftwarePickerModal.vue";
import EquipmentPickerModal from "./EquipmentPickerModal.vue";
import ApiSettingsModal from "./ApiSettingsModal.vue";
import RightsSettingsModal from "./RightsSettingsModal.vue";
import FlagIcon from "./FlagIcon.vue";

const props = defineProps({
  currentLocale: {
    type: String,
    default: "de",
  },
  collectionForm: {
    type: Object,
    default: null,
  },
  heritageItems: {
    type: Array,
    default: () => [],
  },
  digitalItems: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits([
  "apply-rights",
  "apply-language",
  "apply-collection",
]);

const isRightsModalOpen = ref(false);
const isPersonModalOpen = ref(false);
const isOrgModalOpen = ref(false);
const isCollectionModalOpen = ref(false);
const isSoftwareModalOpen = ref(false);
const isEquipmentModalOpen = ref(false);
const isApiSettingsOpen = ref(false);
const appliedToast = ref("");

const handleCollectionSelect = (col) => {
  emit("apply-collection", col);
  showToast(
    props.currentLocale === "de"
      ? `Sammlung "${col.title || col.id}" ausgewählt!`
      : `Collection "${col.title || col.id}" selected!`,
  );
};

const availableLanguages = [
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];

const setLanguage = (langCode) => {
  defaultMetadataLanguage.value = langCode;
  emitApplyLanguage();
};

const emitApplyLanguage = () => {
  emit("apply-language", defaultMetadataLanguage.value);
  showToast(
    props.currentLocale === "de"
      ? `Standardsprache auf "${defaultMetadataLanguage.value.toUpperCase()}" gesetzt!`
      : `Default language set to "${defaultMetadataLanguage.value.toUpperCase()}"!`,
  );
};

const onApplyRightsFromModal = (rights) => {
  emit("apply-rights", rights);
  showToast(
    props.currentLocale === "de"
      ? "Rechte & Lizenzen für alle Abschnitte übernommen!"
      : "Rights & licenses applied to all sections!",
  );
};

const showToast = (msg) => {
  appliedToast.value = msg;
  setTimeout(() => {
    appliedToast.value = "";
  }, 3500);
};
</script>
