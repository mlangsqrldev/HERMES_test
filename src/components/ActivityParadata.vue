<template>
  <div
    class="col-span-full border-2 border-primary/20 bg-base-100 rounded-2xl p-5 mb-6 shadow-sm"
    data-xml-tag="consistsOf"
  >
    <!-- Header -->
    <div
      class="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-base-200"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold shadow-xs"
        >
          🛡️
        </div>
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h4 class="font-bold text-base leading-tight text-base-content">
              Digital Authenticity Profile (DAP)
            </h4>
          </div>
          <p
            class="text-xs text-base-content/70 mt-0.5 max-w-4xl leading-relaxed"
          >
            {{
              currentLocale === "de"
                ? "Dokumentiert die Transformation des Objekts vom analogen in das digitale Medium. Wählen oder tippen Sie die konkreten HECTOR-Bearbeitungsschritte (z.B. holes filled, icp registration, decimation)."
                : "Documents the transformation of the object from analog to digital medium. Select or type concrete HECTOR operations (e.g. holes filled, icp registration, decimation)."
            }}
          </p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="flex items-center gap-2 flex-wrap">
        <span
          class="badge badge-sm font-mono gap-1.5 transition-all"
          :class="
            completedCount === 6
              ? 'badge-success text-success-content font-bold'
              : 'badge-warning text-warning-content'
          "
        >
          <span>{{ completedCount === 6 ? "✓" : "⚠️" }}</span>
          <span>{{
            currentLocale === "de"
              ? `${completedCount} von 6 Dimensionen erfasst`
              : `${completedCount} of 6 dimensions complete`
          }}</span>
        </span>

        <button
          type="button"
          class="btn btn-xs btn-outline btn-primary gap-1"
          @click="loadSampleDap"
          :title="
            currentLocale === 'de'
              ? 'Beispiel für Museums-Digitalisierung (z.B. antike Vase / Grabstele) laden'
              : 'Load museum sample data'
          "
        >
          🏛️
          {{
            currentLocale === "de" ? "Musterbeispiel laden" : "Load Sample DAP"
          }}
        </button>

        <button
          type="button"
          class="btn btn-xs btn-ghost text-error"
          @click="clearAllDap"
          :title="
            currentLocale === 'de'
              ? 'Alle DAP-Einträge leeren'
              : 'Clear all DAP entries'
          "
        >
          🗑️
        </button>
      </div>
    </div>

    <!-- 6 Dimensions Navigation Tabs -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-5">
      <button
        v-for="dim in DAP_DIMENSIONS"
        :key="dim.id"
        type="button"
        class="p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[72px]"
        :class="
          activeDimId === dim.id
            ? 'bg-primary/10 border-primary shadow-xs ring-1 ring-primary/40'
            : 'bg-base-200/40 border-base-300 hover:border-primary/40'
        "
        @click="switchDimension(dim.id)"
      >
        <div class="flex items-center justify-between w-full mb-1">
          <span
            class="badge badge-xs font-mono font-bold"
            :class="dim.badgeColor"
          >
            {{ dim.id }}
          </span>
          <span
            class="text-xs"
            :title="isDimensionFilled(dim.id) ? 'Vollständig' : 'Noch leer'"
          >
            {{ isDimensionFilled(dim.id) ? "🟢" : "⚪" }}
          </span>
        </div>
        <div class="text-[11px] font-bold line-clamp-1 leading-snug">
          {{ currentLocale === "de" ? dim.shortTitleDe : dim.shortTitleEn }}
        </div>
        <div class="text-[10px] text-base-content/50 truncate">
          {{
            currentLocale === "de"
              ? dim.phaseLabelDe.split(" ")[0]
              : dim.phaseLabelEn.split(" ")[0]
          }}
        </div>
      </button>
    </div>

    <!-- Active Dimension Detail Card -->
    <div
      v-if="currentDim"
      class="p-5 bg-base-100 rounded-2xl border border-base-300 shadow-xs space-y-4 animate-fadeIn"
      :data-xml-tag="`consistsOf-${currentDim.id}`"
    >
      <!-- Dimension Header -->
      <div
        class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-base-200"
      >
        <div class="space-y-1">
          <div class="flex items-center gap-2 flex-wrap">
            <span
              class="badge badge-sm font-mono font-bold"
              :class="currentDim.badgeColor"
            >
              {{ currentDim.id }}
            </span>
            <span class="badge badge-ghost badge-sm text-[11px]">
              {{
                currentLocale === "de"
                  ? currentDim.phaseLabelDe
                  : currentDim.phaseLabelEn
              }}
            </span>
            <h5 class="font-bold text-sm text-base-content">
              {{
                currentLocale === "de" ? currentDim.titleDe : currentDim.titleEn
              }}
            </h5>
            <span
              class="badge badge-outline badge-xs font-mono text-[10px] text-primary"
            >
              {{ currentDim.uri }}
            </span>
            <span
              class="badge badge-neutral badge-xs font-mono text-[10px] opacity-80"
            >
              {{
                currentLocale === "de"
                  ? currentDim.carareTargetDe
                  : currentDim.carareTargetEn
              }}
            </span>
          </div>
          <!-- Question -->
          <p
            class="text-xs font-medium text-base-content/85 italic bg-base-200/50 px-3 py-1.5 rounded-lg border-l-2 border-primary"
          >
            ❓
            {{
              currentLocale === "de"
                ? currentDim.questionDe
                : currentDim.questionEn
            }}
          </p>
        </div>

        <!-- Completion Indicator -->
        <span
          class="badge badge-xs gap-1 py-2 px-2.5 font-bold"
          :class="
            isDimensionFilled(currentDim.id)
              ? 'badge-success text-success-content'
              : 'badge-warning text-warning-content'
          "
        >
          <span>{{ isDimensionFilled(currentDim.id) ? "✓" : "!" }}</span>
          <span>{{
            isDimensionFilled(currentDim.id)
              ? currentLocale === "de"
                ? "Pflichtfeld erfüllt"
                : "Required filled"
              : currentLocale === "de"
                ? "Pflichtfeld ausstehend"
                : "Required pending"
          }}</span>
        </span>
      </div>

      <!-- 1. HECTOR Begriffs-Eingabe & Live-Suche (Tags) -->
      <div class="space-y-2">
        <label
          class="label-text font-bold text-xs flex items-center justify-between text-base-content/80"
        >
          <span class="flex items-center gap-1.5">
            <span>🏷️</span>
            <span>{{
              currentLocale === "de"
                ? currentDim.inputLabelDe ||
                  "Bearbeitungsschritte & Evidenz (HECTOR-Begriffe):"
                : currentDim.inputLabelEn ||
                  "Processing Steps & Evidence (HECTOR terms):"
            }}</span>
            <span class="text-error font-black">*</span>
          </span>
          <span class="text-[10px] text-base-content/50 font-mono">{{
            currentLocale === "de"
              ? currentDim.placeholderDe
              : currentDim.placeholderEn
          }}</span>
        </label>

        <!-- Tag Chips & Live Search Bar Container -->
        <div
          class="flex flex-wrap gap-1.5 p-2 border border-base-300 rounded-xl bg-base-100 min-h-[2.75rem] items-center focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary"
        >
          <!-- Active Tags -->
          <div
            v-for="(tag, tIdx) in dimState[currentDim.id]?.tags || []"
            :key="tIdx"
            class="badge badge-primary gap-1.5 py-2 px-2.5 shadow-2xs text-xs font-semibold"
          >
            <span>{{ tag }}</span>
            <button
              type="button"
              class="hover:opacity-75 transition-opacity ml-0.5 text-xs font-bold"
              @click.prevent="removeTag(tIdx)"
              title="Entfernen"
            >
              ✕
            </button>
          </div>

          <!-- Live Search Input -->
          <div class="relative flex-1 min-w-[220px]">
            <div class="flex items-center gap-1.5 w-full">
              <input
                type="text"
                v-model="searchQuery"
                class="flex-1 bg-transparent outline-none text-xs text-base-content placeholder:text-base-content/40"
                :placeholder="
                  (dimState[currentDim.id]?.tags || []).length === 0
                    ? currentLocale === 'de'
                      ? 'HECTOR durchsuchen oder freien Begriff eingeben...'
                      : 'Search HECTOR or type custom term...'
                    : currentLocale === 'de'
                      ? 'Weiteren Begriff hinzufügen...'
                      : 'Add another term...'
                "
                @input="onSearchInput"
                @keydown.enter.prevent="addFromInput"
                @keydown.down.prevent="highlightNext"
                @keydown.up.prevent="highlightPrev"
                @keydown.esc.prevent="showDropdown = false"
                @focus="onFocus"
                @blur="onBlur"
              />
              <button
                type="button"
                class="btn btn-xs btn-primary font-bold px-2.5 shrink-0"
                :disabled="!searchQuery.trim()"
                @mousedown.prevent="addFromInput"
              >
                + {{ currentLocale === "de" ? "Hinzufügen" : "Add" }}
              </button>
            </div>

            <!-- Autocomplete Dropdown -->
            <div
              v-if="showDropdown && (suggestions.length > 0 || isSearching)"
              class="absolute left-0 top-full mt-1.5 w-80 max-w-[90vw] z-[100] bg-base-100 rounded-box shadow-xl border border-base-300 max-h-56 overflow-y-auto"
            >
              <div
                v-if="isSearching"
                class="p-2.5 text-xs text-base-content/60 flex items-center gap-2"
              >
                <span
                  class="loading loading-spinner loading-xs text-primary"
                ></span>
                {{
                  currentLocale === "de"
                    ? "Suche in HECTOR..."
                    : "Searching in HECTOR..."
                }}
              </div>
              <ul v-else class="menu menu-xs p-1">
                <li
                  v-for="(suggestion, sIdx) in suggestions"
                  :key="suggestion.uri || sIdx"
                >
                  <a
                    :class="{ active: sIdx === highlightedIndex }"
                    @mousedown.prevent="selectSuggestion(suggestion)"
                    class="flex flex-col items-start py-1.5"
                  >
                    <div class="flex items-center gap-2 w-full justify-between">
                      <span class="font-bold text-xs text-base-content">{{
                        suggestion.prefLabel
                      }}</span>
                      <span
                        class="badge badge-ghost badge-xs text-[9px] opacity-70"
                        >{{ suggestion.vocabLabel || "HECTOR" }}</span
                      >
                    </div>
                    <span
                      v-if="suggestion.uri"
                      class="text-[9px] opacity-50 truncate max-w-full font-mono"
                      >{{ suggestion.uri }}</span
                    >
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Die letzten 5 bleiben stehen (Quick Click Pills) -->
        <div class="flex items-center gap-1.5 flex-wrap pt-0.5">
          <span
            class="text-[11px] font-bold text-base-content/60 flex items-center gap-1"
          >
            <span>⚡</span>
            <span>{{
              currentLocale === "de"
                ? "Zuletzt verwendet (5 Begriffe):"
                : "Recent (5 terms):"
            }}</span>
          </span>
          <button
            v-for="chip in recentFiveTerms"
            :key="chip.label"
            type="button"
            class="badge badge-sm py-1.5 px-2.5 cursor-pointer transition-all text-[11px] gap-1"
            :class="
              isTagSelected(chip.label)
                ? 'badge-primary font-bold shadow-2xs'
                : 'badge-ghost hover:badge-primary/30 border-base-300'
            "
            @click="toggleTag(chip.label, chip.uri)"
            :title="chip.uri ? `${chip.label} (${chip.uri})` : chip.label"
          >
            <span>{{ isTagSelected(chip.label) ? "✓" : "+" }}</span>
            <span>{{ chip.label }}</span>
          </button>
        </div>
      </div>

      <!-- 2. Optionale Notiz / Freitext (1 Zeile) -->
      <div class="form-control">
        <label class="label py-0.5">
          <span
            class="label-text font-semibold text-xs text-base-content/75 flex items-center gap-1"
          >
            <span>📝</span>
            <span>{{
              currentLocale === "de"
                ? currentDim.noteLabelDe || "Optionale Notiz / Spezifikation:"
                : currentDim.noteLabelEn || "Optional note / specification:"
            }}</span>
          </span>
        </label>
        <input
          type="text"
          v-model="dimState[currentDim.id].note"
          @input="syncToConsistsOf"
          class="input input-sm input-bordered w-full text-xs"
          :placeholder="
            currentLocale === 'de'
              ? currentDim.notePlaceholderDe || 'Optionaler kurzer Freitext...'
              : currentDim.notePlaceholderEn || 'Optional brief note...'
          "
        />
      </div>

      <!-- 3. Optional Equipment / Hard- & Software (nur bei Dimensionen, wo Geräte sinnvoll sind) -->
      <div
        class="form-control"
        v-if="
          currentDim.showEquipment ||
          dimState[currentDim.id].equipment ||
          showOptionalEquipment
        "
      >
        <div class="flex flex-wrap items-center justify-between gap-2 py-1">
          <label class="label p-0">
            <span
              class="label-text font-semibold text-xs flex items-center gap-1 text-base-content/80"
            >
              <span>🛠️</span>
              <span>{{
                currentLocale === "de"
                  ? "Eingesetzte Hard- oder Software (CARARE equipment)"
                  : "Equipment or Software (CARARE equipment)"
              }}</span>
            </span>
            <span class="text-[10px] text-base-content/40 font-mono ml-2"
              >&lt;equipment&gt;</span
            >
          </label>
          <div class="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              class="btn btn-xs btn-outline btn-accent gap-1 font-bold shadow-2xs"
              @click="isEquipmentPickerOpen = true"
              :title="
                currentLocale === 'de'
                  ? 'Gerät aus dem zentralen Pool auswählen und einfügen'
                  : 'Pick equipment from central pool'
              "
            >
              📷 {{ currentLocale === "de" ? "Geräte-Pool" : "Equipment Pool" }}
            </button>
            <button
              type="button"
              class="btn btn-xs btn-outline btn-info gap-1 font-bold shadow-2xs"
              @click="isSoftwarePickerOpen = true"
              :title="
                currentLocale === 'de'
                  ? 'Software aus dem zentralen Pool auswählen und einfügen'
                  : 'Pick software from central pool'
              "
            >
              💻
              {{ currentLocale === "de" ? "Software-Pool" : "Software Pool" }}
            </button>
          </div>
        </div>
        <input
          type="text"
          v-model="dimState[currentDim.id].equipment"
          @input="syncToConsistsOf"
          class="input input-sm input-bordered w-full text-xs"
          :placeholder="
            currentLocale === 'de'
              ? currentDim.equipmentHintDe
              : currentDim.equipmentHintEn
          "
        />
      </div>
      <div v-else class="pt-0.5">
        <button
          type="button"
          class="text-[11px] text-base-content/50 hover:text-primary transition-colors flex items-center gap-1"
          @click="showOptionalEquipment = true"
        >
          <span>+</span>
          <span>{{
            currentLocale === "de"
              ? "Optionales Gerät oder Software für diese Dimension angeben"
              : "Optionally add equipment or software for this dimension"
          }}</span>
        </button>
      </div>

      <!-- Navigation Footer between Dimensions -->
      <div
        class="flex items-center justify-between pt-3 border-t border-base-200"
      >
        <button
          type="button"
          class="btn btn-xs btn-ghost gap-1"
          :disabled="currentDim.num === 1"
          @click="switchDimension(`DAP-${currentDim.num - 1}`)"
        >
          ←
          {{
            currentLocale === "de"
              ? "Vorherige Dimension"
              : "Previous Dimension"
          }}
        </button>

        <span class="text-xs font-mono text-base-content/50">
          {{ currentDim.num }} / 6
        </span>

        <button
          type="button"
          class="btn btn-xs btn-primary gap-1"
          :disabled="currentDim.num === 6"
          @click="switchDimension(`DAP-${currentDim.num + 1}`)"
        >
          {{ currentLocale === "de" ? "Nächste Dimension" : "Next Dimension" }}
          →
        </button>
      </div>
    </div>

    <!-- Equipment Modal Picker for DAP Dimensions -->
    <EquipmentPickerModal
      :isOpen="isEquipmentPickerOpen"
      mode="select"
      :locale="currentLocale"
      @close="isEquipmentPickerOpen = false"
      @select="handleSelectEquipment"
    />

    <!-- Software Modal Picker for DAP Dimensions -->
    <SoftwarePickerModal
      :isOpen="isSoftwarePickerOpen"
      mode="select"
      :locale="currentLocale"
      @close="isSoftwarePickerOpen = false"
      @select="handleSelectSoftware"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import SoftwarePickerModal from "./SoftwarePickerModal.vue";
import EquipmentPickerModal from "./EquipmentPickerModal.vue";
import {
  getRecentVocabList,
  recordRecentVocabTerm,
} from "../utils/vocabHistory.js";

const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  currentLocale: {
    type: String,
    default: "de",
  },
});

const emit = defineEmits(["update:description"]);

const DAP_DIMENSIONS = [
  {
    id: "DAP-1",
    num: 1,
    phaseKey: "reference",
    phaseLabelDe: "Reference (vor der Digitalisierung)",
    phaseLabelEn: "Reference (Pre-Capture)",
    badgeColor: "badge-secondary",
    shortTitleDe: "1. Materielle Spuren",
    shortTitleEn: "1. Material Traces",
    titleDe: "DAP-1: Materielle Spuren & Merkmale",
    titleEn: "DAP-1: Material Traces & Features",
    uri: "http://hector.org/vocab/dap/DAP-1",
    questionDe:
      "Welche materielle Evidenz seiner Geschichte trägt das Objekt (Beschädigungen, Bearbeitungs- und Gebrauchsspuren, Restaurierungen, stilistische Merkmale)?",
    questionEn:
      "What material evidence of its history does the object carry (damage, manufacturing and usage traces, restorations, stylistic features)?",
    inputLabelDe: "Spuren & Merkmale am physischen Objekt (HECTOR-Befunde):",
    inputLabelEn:
      "Material Traces & Features on Physical Object (HECTOR terms):",
    placeholderDe:
      "z.B. Bestoßungen & Absplitterungen, Rissbildung, Drehspuren, Brandspuren, Historische Kittung",
    placeholderEn:
      "e.g. chipping, cracks, turning marks, fire marks, historical fills",
    noteLabelDe: "Zustandsbefund / Präzisierung (z.B. Kittungen am Gefäßhals):",
    noteLabelEn: "Condition note / specification (e.g. fills at vessel neck):",
    notePlaceholderDe: "Befund zum Objektzustand...",
    notePlaceholderEn: "Condition note...",
    carareTargetDe: "Ziel: <assessments> & <materials>",
    carareTargetEn: "Target: <assessments> & <materials>",
    showEquipment: false,
    equipmentHintDe: "z.B. Beleuchtung, Lupenleuchte, Referenzfarbkarte",
    equipmentHintEn: "e.g. Lighting, magnifying lamp, reference color card",
  },
  {
    id: "DAP-2",
    num: 2,
    phaseKey: "capture",
    phaseLabelDe: "Capture (während der Digitalisierung)",
    phaseLabelEn: "Capture (During Digitisation)",
    badgeColor: "badge-info",
    shortTitleDe: "2. Aufnahmeprozess",
    shortTitleEn: "2. Capture Scope",
    titleDe: "DAP-2: Aufnahmeprozess & Erfassungsumfang",
    titleEn: "DAP-2: Acquisition Process & Scope of Capture",
    uri: "http://hector.org/vocab/dap/DAP-2",
    questionDe: "Was wurde erfasst, was nicht, und warum?",
    questionEn: "What was captured, what was omitted, and why?",
    inputLabelDe: "Erfassungsumfang & Auslassungsgründe (HECTOR-Begriffe):",
    inputLabelEn: "Capture Scope & Omission Reasons (HECTOR terms):",
    placeholderDe:
      "z.B. 360°-Rundumerfassung, Standfläche ausgespart, Hohlraum abgeschattet, berührungslos",
    placeholderEn:
      "e.g. 360° capture, bottom omitted, cavity shadowed, markerless",
    noteLabelDe:
      "Grund für Auslassung (z.B. Standfläche aus Standsicherheitsgründen ausgespart):",
    noteLabelEn:
      "Reason for omission (e.g. base omitted due to structural stability):",
    notePlaceholderDe: "Grund für Auslassung / Beschränkung...",
    notePlaceholderEn: "Reason for omission / limit...",
    carareTargetDe: "Ziel: <hadSpecificPurpose> & <equipment>",
    carareTargetEn: "Target: <hadSpecificPurpose> & <equipment>",
    showEquipment: true,
    equipmentHintDe:
      "z.B. Artec Leo 3D Scanner; Nikon Z8 (50mm f/1.8); Invar-Maßstäbe",
    equipmentHintEn:
      "e.g. Artec Leo 3D Scanner; Nikon Z8 (50mm f/1.8); Invar scale bars",
  },
  {
    id: "DAP-3",
    num: 3,
    phaseKey: "representation",
    phaseLabelDe: "Representation (nach der Digitalisierung)",
    phaseLabelEn: "Representation (Post-Digitisation)",
    badgeColor: "badge-primary",
    shortTitleDe: "3. Geometrie-Eingriff",
    shortTitleEn: "3. Geometry Edits",
    titleDe: "DAP-3: Geometrie-Bearbeitung",
    titleEn: "DAP-3: Geometry Processing",
    uri: "http://hector.org/vocab/dap/DAP-3",
    questionDe:
      "Welche Eingriffe gab es an der Form (z.B. holes filled, icp registration, decimation)?",
    questionEn:
      "What interventions were made to the 3D shape (e.g. holes filled, icp registration, decimation)?",
    inputLabelDe: "Geometrie-Verarbeitungsschritte (HECTOR-Techniken):",
    inputLabelEn: "Geometry Processing Operations (HECTOR techniques):",
    placeholderDe:
      "z.B. holes filled, icp registration, decimation, noise removal, remeshing",
    placeholderEn:
      "e.g. holes filled, icp registration, decimation, noise removal, remeshing",
    noteLabelDe: "Präzisierung (z.B. Low-Poly Web-Derivat 50k Triangles):",
    noteLabelEn: "Specification (e.g. Low-poly web derivative 50k triangles):",
    notePlaceholderDe: "Präzisierung zur Geometrie...",
    notePlaceholderEn: "Specification of geometry...",
    carareTargetDe: "Ziel: <techniques> & <equipment>",
    carareTargetEn: "Target: <techniques> & <equipment>",
    showEquipment: true,
    equipmentHintDe: "z.B. Agisoft Metashape Pro 2.1, Blender 4.2, MeshLab",
    equipmentHintEn: "e.g. Agisoft Metashape Pro 2.1, Blender 4.2, MeshLab",
  },
  {
    id: "DAP-4",
    num: 4,
    phaseKey: "representation",
    phaseLabelDe: "Representation (nach der Digitalisierung)",
    phaseLabelEn: "Representation (Post-Digitisation)",
    badgeColor: "badge-accent",
    shortTitleDe: "4. Textur & Shader",
    shortTitleEn: "4. Texture & Shader",
    titleDe: "DAP-4: Textur, Shader & Material",
    titleEn: "DAP-4: Texture, Shader & Material",
    uri: "http://hector.org/vocab/dap/DAP-4",
    questionDe:
      "Welche Eingriffe gab es an der Oberfläche (z.B. delighting, color checker calibration, uv unwrapping)?",
    questionEn:
      "What interventions were made to the texture/surface (e.g. delighting, color checker calibration, uv unwrapping)?",
    inputLabelDe: "Oberflächen- & Textur-Bearbeitung (HECTOR-Techniken):",
    inputLabelEn: "Texture & Surface Operations (HECTOR techniques):",
    placeholderDe:
      "z.B. delighting, color checker calibration, uv unwrapping, normal baking, pbr mapping",
    placeholderEn:
      "e.g. delighting, color checker calibration, uv unwrapping, normal baking, pbr mapping",
    noteLabelDe:
      "Präzisierung (z.B. Farbkalibriert nach ColorChecker, 4K PBR-Maps):",
    noteLabelEn: "Specification (e.g. ColorChecker calibrated, 4K PBR maps):",
    notePlaceholderDe: "Präzisierung zur Textur...",
    notePlaceholderEn: "Specification of texture...",
    carareTargetDe: "Ziel: <techniques> & <equipment>",
    carareTargetEn: "Target: <techniques> & <equipment>",
    showEquipment: true,
    equipmentHintDe: "z.B. Substance 3D Painter 10; Adobe Lightroom 14.1",
    equipmentHintEn: "e.g. Substance 3D Painter 10; Adobe Lightroom 14.1",
  },
  {
    id: "DAP-5",
    num: 5,
    phaseKey: "cross-cutting",
    phaseLabelDe: "Übergreifend",
    phaseLabelEn: "Cross-cutting",
    badgeColor: "badge-warning",
    shortTitleDe: "5. Begründung",
    shortTitleEn: "5. Scholarly Rationale",
    titleDe: "DAP-5: Wissenschaftliche Begründung",
    titleEn: "DAP-5: Scholarly Rationale & Principles",
    uri: "http://hector.org/vocab/dap/DAP-5",
    questionDe:
      "Warum wurde so entschieden (London Charter, Sevilla-Prinzipien, Konservierung)?",
    questionEn:
      "Why were these decisions made (London Charter, Seville Principles, conservation)?",
    inputLabelDe:
      "Wissenschaftliche Leitlinien & Prinzipien (HECTOR / Chartas):",
    inputLabelEn: "Methodological Principles & Charters (HECTOR / Charters):",
    placeholderDe:
      "z.B. London Charter Principle 4, Seville Principles, Keine spekulative Ergänzung, Konservatorische Auflagen",
    placeholderEn:
      "e.g. London Charter Principle 4, Seville Principles, no speculative restoration, conservation requirements",
    noteLabelDe: "Methodische Begründung / Rechtfertigung:",
    noteLabelEn: "Scholarly rationale / justification:",
    notePlaceholderDe: "Begründung der methodischen Entscheidungen...",
    notePlaceholderEn: "Rationale for methodological decisions...",
    carareTargetDe: "Ziel: <methods> & <hadSpecificPurpose>",
    carareTargetEn: "Target: <methods> & <hadSpecificPurpose>",
    showEquipment: false,
    equipmentHintDe: "z.B. Richtlinien / Dokumentation",
    equipmentHintEn: "e.g. Guidelines / Documentation",
  },
  {
    id: "DAP-6",
    num: 6,
    phaseKey: "result",
    phaseLabelDe: "Ergebnis",
    phaseLabelEn: "Result",
    badgeColor: "badge-success",
    shortTitleDe: "6. Abbildungsbilanz",
    shortTitleEn: "6. Balance of Evidence",
    titleDe: "DAP-6: Abbildungsbilanz",
    titleEn: "DAP-6: Balance of Evidence & Transformation Limits",
    uri: "http://hector.org/vocab/dap/DAP-6",
    questionDe:
      "Was ist aus den Spuren und Merkmalen aus DAP-1 im Endprodukt geworden: erhalten, verändert, verloren oder nicht erfasst?",
    questionEn:
      "What became of the material traces from DAP-1 in the final 3D result: preserved, altered, lost, or unrecorded?",
    inputLabelDe: "Status der Spuren im 3D-Endprodukt (Evaluationsurteil):",
    inputLabelEn: "Status of Traces in Final 3D Asset (Evaluation Verdict):",
    placeholderDe:
      "z.B. Materielle Spuren erhalten, Beschädigungen dokumentiert, Hohlraum unvollständig, Standfläche plan geschlossen",
    placeholderEn:
      "e.g. material traces preserved, damages recorded, cavity incomplete, base plane closed",
    noteLabelDe:
      "Fazit zur Transformationsgrenze (z.B. Grenzen der Transformation transparent dokumentiert):",
    noteLabelEn: "Transformation summary / limits note:",
    notePlaceholderDe: "Fazit zur Abbildungsbilanz...",
    notePlaceholderEn: "Conclusion on transformation limits...",
    carareTargetDe: "Ziel: <assessments> & <hadSpecificPurpose>",
    carareTargetEn: "Target: <assessments> & <hadSpecificPurpose>",
    showEquipment: false,
    equipmentHintDe: "z.B. Qualitätsprüfung nach ISO 17025 / Prüfbericht",
    equipmentHintEn: "e.g. Quality inspection report",
  },
];

const activeDimId = ref("DAP-3"); // Default to geometry or DAP-1
const showOptionalEquipment = ref(false);

const dimState = reactive({
  "DAP-1": { tags: [], note: "", equipment: "" },
  "DAP-2": { tags: [], note: "", equipment: "" },
  "DAP-3": { tags: [], note: "", equipment: "" },
  "DAP-4": { tags: [], note: "", equipment: "" },
  "DAP-5": { tags: [], note: "", equipment: "" },
  "DAP-6": { tags: [], note: "", equipment: "" },
});

const isEquipmentPickerOpen = ref(false);
const isSoftwarePickerOpen = ref(false);

const searchQuery = ref("");
const showDropdown = ref(false);
const isSearching = ref(false);
const suggestions = ref([]);
const highlightedIndex = ref(-1);

const currentDim = computed(() => {
  return (
    DAP_DIMENSIONS.find((d) => d.id === activeDimId.value) || DAP_DIMENSIONS[0]
  );
});

const effectiveVocabKey = computed(() => {
  return `dap_${currentDim.value.id.toLowerCase().replace("-", "_")}`;
});

const recentFiveTerms = computed(() => {
  const list = getRecentVocabList(effectiveVocabKey.value).value || [];
  return list.slice(0, 5);
});

const isDimensionFilled = (dimId) => {
  const s = dimState[dimId];
  if (!s) return false;
  return (
    (Array.isArray(s.tags) && s.tags.length > 0) ||
    Boolean(s.note && s.note.trim())
  );
};

const completedCount = computed(() => {
  let count = 0;
  for (let i = 1; i <= 6; i++) {
    if (isDimensionFilled(`DAP-${i}`)) {
      count++;
    }
  }
  return count;
});

const switchDimension = (dimId) => {
  activeDimId.value = dimId;
  searchQuery.value = "";
  showDropdown.value = false;
  suggestions.value = [];
};

const isTagSelected = (label) => {
  if (!label || !currentDim.value) return false;
  const tags = dimState[currentDim.value.id]?.tags || [];
  const lower = label.toLowerCase().trim();
  return tags.some((t) => t.toLowerCase().trim() === lower);
};

const addTag = (term, uri = "") => {
  if (!term || !currentDim.value) return;
  const val = String(term).trim();
  if (!val) return;
  const s = dimState[currentDim.value.id];
  if (!Array.isArray(s.tags)) s.tags = [];
  if (!isTagSelected(val)) {
    s.tags.push(val);
    recordRecentVocabTerm(effectiveVocabKey.value, {
      label: val,
      uri,
      source: "HECTOR",
    });
    syncToConsistsOf();
  }
};

const toggleTag = (label, uri = "") => {
  if (!label || !currentDim.value) return;
  const s = dimState[currentDim.value.id];
  if (!Array.isArray(s.tags)) s.tags = [];
  const lower = label.toLowerCase().trim();
  const idx = s.tags.findIndex((t) => t.toLowerCase().trim() === lower);
  if (idx >= 0) {
    s.tags.splice(idx, 1);
  } else {
    s.tags.push(label.trim());
    recordRecentVocabTerm(effectiveVocabKey.value, {
      label: label.trim(),
      uri,
      source: "HECTOR",
    });
  }
  syncToConsistsOf();
};

const removeTag = (tIdx) => {
  if (!currentDim.value) return;
  const s = dimState[currentDim.value.id];
  if (Array.isArray(s.tags)) {
    s.tags.splice(tIdx, 1);
    syncToConsistsOf();
  }
};

const addFromInput = () => {
  if (
    highlightedIndex.value >= 0 &&
    suggestions.value[highlightedIndex.value]
  ) {
    selectSuggestion(suggestions.value[highlightedIndex.value]);
    return;
  }
  const q = searchQuery.value.trim();
  if (q) {
    addTag(q);
    searchQuery.value = "";
    suggestions.value = [];
    showDropdown.value = false;
  }
};

const selectSuggestion = (sug) => {
  if (!sug) return;
  addTag(sug.prefLabel, sug.uri || "");
  searchQuery.value = "";
  suggestions.value = [];
  showDropdown.value = false;
  highlightedIndex.value = -1;
};

const highlightNext = () => {
  if (suggestions.value.length === 0) return;
  highlightedIndex.value =
    (highlightedIndex.value + 1) % suggestions.value.length;
};

const highlightPrev = () => {
  if (suggestions.value.length === 0) return;
  highlightedIndex.value =
    (highlightedIndex.value - 1 + suggestions.value.length) %
    suggestions.value.length;
};

let searchTimer = null;
const onSearchInput = () => {
  const q = searchQuery.value.trim();
  highlightedIndex.value = -1;

  if (!q) {
    suggestions.value = [];
    showDropdown.value = false;
    return;
  }

  // 1. Instant local matches from recent & seeds
  const localList = getRecentVocabList(effectiveVocabKey.value).value || [];
  const localMatches = localList
    .filter((c) => (c.label || "").toLowerCase().includes(q.toLowerCase()))
    .map((c) => ({
      prefLabel: c.label,
      uri: c.uri || "",
      vocabLabel: "HECTOR (Lokal)",
    }));

  suggestions.value = localMatches;
  showDropdown.value = true;

  // 2. Query HECTOR online REST API
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(async () => {
    if (q.length < 2) return;
    try {
      isSearching.value = true;
      const lang = props.currentLocale === "de" ? "de" : "en";
      const res = await fetch(
        `https://vocabs.bcdh.uni-bonn.de/rest/v1/hector/search?query=${encodeURIComponent(q)}*&lang=${lang}`,
      );
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.results)) {
          const found = [...localMatches];
          const seen = new Set(
            localMatches.map((m) => m.prefLabel.toLowerCase()),
          );
          data.results.forEach((r) => {
            const label = r.prefLabel || r.altLabel || "";
            if (label && !seen.has(label.toLowerCase())) {
              seen.add(label.toLowerCase());
              found.push({
                prefLabel: label,
                uri: r.uri,
                vocabLabel: "HECTOR",
              });
            }
          });
          suggestions.value = found.slice(0, 15);
        }
      }
    } catch (e) {
      // offline / quiet fallback to local
    } finally {
      isSearching.value = false;
    }
  }, 200);
};

const onFocus = () => {
  if (searchQuery.value.trim() && suggestions.value.length > 0) {
    showDropdown.value = true;
  }
};

const onBlur = () => {
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
};

const handleSelectEquipment = (eq) => {
  if (!eq || !currentDim.value) return;
  showOptionalEquipment.value = true;
  const label = `${eq.name}${eq.manufacturer ? ` (${eq.manufacturer})` : ""}`;
  const curr = (dimState[currentDim.value.id].equipment || "").trim();
  dimState[currentDim.value.id].equipment = curr ? `${curr}; ${label}` : label;
  syncToConsistsOf();
};

const handleSelectSoftware = (sw) => {
  if (!sw || !currentDim.value) return;
  showOptionalEquipment.value = true;
  const label = `${sw.name}${sw.version ? ` v${sw.version}` : ""}${sw.role ? ` (${sw.role})` : ""}`;
  const curr = (dimState[currentDim.value.id].equipment || "").trim();
  dimState[currentDim.value.id].equipment = curr ? `${curr}; ${label}` : label;
  syncToConsistsOf();
};

// Synchronize dimState into props.form['consistsOf'] and props.form['assessments']
const syncToConsistsOf = () => {
  if (!props.form) return;
  if (!Array.isArray(props.form["consistsOf"])) {
    props.form["consistsOf"] = [];
  }

  const list = props.form["consistsOf"];
  const startDate = props.form["temporal"]?.[0]?.["timeSpan.startDate"] || "";
  const endDate = props.form["temporal"]?.[0]?.["timeSpan.endDate"] || "";

  DAP_DIMENSIONS.forEach((dim) => {
    const s = dimState[dim.id];
    const tags = s.tags || [];
    const note = (s.note || "").trim();
    const equipText = String(s.equipment || "").trim();

    // Find existing item for this DAP dimension
    const existingIdx = list.findIndex((item) => {
      const m = Array.isArray(item.methods)
        ? item.methods.join(" ")
        : String(item.methods || "");
      const p = String(item.hadSpecificPurpose || "");
      return m.includes(dim.id) || p.includes(dim.id);
    });

    const hasContent = tags.length > 0 || note || equipText;

    if (hasContent) {
      // Semantic mapping of DAP dimensions into CARARE schema:
      // DAP-1 (Traces) -> <materials> & physical baseline (also flows into <assessments>)
      // DAP-2 (Capture) -> <hadSpecificPurpose> for omitted parts, <techniques> & <equipment>
      // DAP-3 (Geometry) -> <techniques> (ICP, decimation, retopology) & <equipment>
      // DAP-4 (Texture) -> <techniques> (delighting, UV unwrap, PBR calibration) & <equipment>
      // DAP-5 (Rationale) -> <hadSpecificPurpose> & <methods> (principles/charters)
      // DAP-6 (Evaluation) -> <hadSpecificPurpose> & <methods> (also flows into <assessments>)
      let hadSpecificPurpose = `${dim.id}: ${dim.shortTitleDe}`;
      let techniquesText = "";
      let materialsText = "";
      const fullContent = [tags.join("; "), note].filter(Boolean).join(" — ");

      if (dim.id === "DAP-1") {
        hadSpecificPurpose = `DAP-1 Materielle Evidenz & Befund: ${fullContent || "Ausgangszustand"}`;
        materialsText = fullContent;
        techniquesText = fullContent;
      } else if (dim.id === "DAP-2") {
        hadSpecificPurpose = `DAP-2 Erfassungsumfang & Auslassungen: ${fullContent || "Aufnahmeprozess"}`;
        techniquesText = fullContent;
      } else if (dim.id === "DAP-3") {
        hadSpecificPurpose = `DAP-3 Geometriebearbeitung (HECTOR): ${fullContent || "Geometrie"}`;
        techniquesText = fullContent;
      } else if (dim.id === "DAP-4") {
        hadSpecificPurpose = `DAP-4 Textur, Shader & Material: ${fullContent || "Texturierung"}`;
        techniquesText = fullContent;
      } else if (dim.id === "DAP-5") {
        hadSpecificPurpose = `DAP-5 Begründung & Leitlinien: ${fullContent || "Wissenschaftliche Kriterien"}`;
        techniquesText = fullContent;
      } else if (dim.id === "DAP-6") {
        hadSpecificPurpose = `DAP-6 Abbildungsbilanz & Evidenzvergleich: ${fullContent || "Transformationsgrenzen"}`;
        techniquesText = fullContent;
      }

      const consistsOfRecord = {
        hadSpecificPurpose,
        startDate: startDate,
        endDate: endDate,
        methods: `${dim.titleDe} (${dim.uri})`,
        techniques: techniquesText,
        materials: materialsText,
        equipment: equipText,
      };

      if (existingIdx >= 0) {
        list[existingIdx] = { ...list[existingIdx], ...consistsOfRecord };
      } else {
        list.push(consistsOfRecord);
      }
    } else if (existingIdx >= 0) {
      list.splice(existingIdx, 1);
    }
  });

  // Automatically synchronize CARARE <assessments> for DAP-1 (physical evidence) and DAP-6 (evaluation balance)
  if (!Array.isArray(props.form["assessments"])) {
    props.form["assessments"] = [];
  }
  const assessList = props.form["assessments"];

  // Remove existing DAP assessment entries before repopulating
  for (let i = assessList.length - 1; i >= 0; i--) {
    const a = String(assessList[i] || "");
    if (a.startsWith("DAP-1") || a.startsWith("DAP-6")) {
      assessList.splice(i, 1);
    }
  }

  // Populate DAP-1 initial physical condition as CARARE assessment
  const dap1Tags = dimState["DAP-1"]?.tags || [];
  const dap1Note = (dimState["DAP-1"]?.note || "").trim();
  if (dap1Tags.length > 0 || dap1Note) {
    assessList.push(
      `DAP-1 Ausgangsbefund: ${dap1Tags.join("; ")}${dap1Note ? ` — ${dap1Note}` : ""}`,
    );
  }

  // DAP-6 Abbildungsbilanz als Assessment
  const dap6Tags = dimState["DAP-6"]?.tags || [];
  const dap6Note = (dimState["DAP-6"]?.note || "").trim();
  if (dap6Tags.length > 0 || dap6Note) {
    assessList.push(
      `DAP-6 Abbildungsbilanz: ${dap6Tags.join("; ")}${dap6Note ? ` — ${dap6Note}` : ""}`,
    );
  }
};

// Initialize dimState from props.form['consistsOf']
const initFromConsistsOf = () => {
  if (!props.form || !Array.isArray(props.form["consistsOf"])) return;

  const list = props.form["consistsOf"];
  DAP_DIMENSIONS.forEach((dim) => {
    const found = list.find((item) => {
      const m = Array.isArray(item.methods)
        ? item.methods.join(" ")
        : String(item.methods || "");
      const p = String(item.hadSpecificPurpose || "");
      return m.includes(dim.id) || p.includes(dim.id);
    });

    if (found) {
      let rawText = "";
      if (found.techniques) {
        rawText = Array.isArray(found.techniques)
          ? found.techniques.join("; ")
          : found.techniques;
      } else if (found.materials) {
        rawText = Array.isArray(found.materials)
          ? found.materials.join("; ")
          : found.materials;
      } else if (
        found.hadSpecificPurpose &&
        found.hadSpecificPurpose.includes(":")
      ) {
        rawText = found.hadSpecificPurpose.split(":").slice(1).join(":").trim();
      }

      const parts = rawText.split(" — ");
      const tagsPart = parts[0] || "";
      dimState[dim.id].note = parts.slice(1).join(" — ").trim();
      dimState[dim.id].tags = tagsPart
        .split(";")
        .map((t) => t.trim())
        .filter(Boolean);
      dimState[dim.id].equipment = Array.isArray(found.equipment)
        ? found.equipment.join("; ")
        : found.equipment || "";
    }
  });
};

const loadSampleDap = () => {
  dimState["DAP-1"].tags = [
    "Bestoßungen & Absplitterungen",
    "Rissbildung",
    "Antike Drehspuren",
    "Brandspuren / Ruß",
    "Historische Restaurierungskittung",
  ];
  dimState["DAP-1"].note = "Kittungen am Gefäßhals";
  dimState["DAP-1"].equipment = "";

  dimState["DAP-2"].tags = [
    "360°-Rundumerfassung",
    "Standfläche ausgespart",
    "Hohlraum abgeschattet",
    "Berührungslos (markerless)",
    "scale bar alignment",
  ];
  dimState["DAP-2"].note = "Standfläche aus Standsicherheitsgründen ausgespart";
  dimState["DAP-2"].equipment =
    "Artec Leo 3D Scanner; Nikon Z8 (50mm f/1.8); Invar-Maßstäbe";

  dimState["DAP-3"].tags = [
    "holes filled",
    "icp registration",
    "decimation",
    "noise removal",
    "point cloud alignment",
  ];
  dimState["DAP-3"].note = "Low-Poly Web-Derivat mit Normal-Map-Bake";
  dimState["DAP-3"].equipment = "Artec Studio 19; Blender 4.2 LTS";

  dimState["DAP-4"].tags = [
    "delighting",
    "uv unwrapping",
    "texture baking",
    "color checker calibration",
    "pbr roughness mapping",
  ];
  dimState["DAP-4"].note = "Farbkalibriert nach ColorChecker";
  dimState["DAP-4"].equipment = "Substance 3D Painter 10; Adobe Lightroom 14.1";

  dimState["DAP-5"].tags = [
    "London Charter Principle 4",
    "Seville Principles",
    "Keine spekulative Ergänzung",
    "Konservatorische Auflagen",
  ];
  dimState["DAP-5"].note = "Wissenschaftliche Nachvollziehbarkeit";
  dimState["DAP-5"].equipment = "";

  dimState["DAP-6"].tags = [
    "Materielle Spuren erhalten",
    "Beschädigungen dokumentiert",
    "Hohlraum unvollständig",
    "Standfläche plan geschlossen",
  ];
  dimState["DAP-6"].note =
    "Grenzen der Transformation transparent dokumentiert";
  dimState["DAP-6"].equipment = "";

  syncToConsistsOf();
};

const clearAllDap = () => {
  DAP_DIMENSIONS.forEach((dim) => {
    dimState[dim.id].tags = [];
    dimState[dim.id].note = "";
    dimState[dim.id].equipment = "";
  });
  syncToConsistsOf();
};

watch(
  () => props.form["consistsOf"],
  () => {
    initFromConsistsOf();
  },
  { deep: true },
);

onMounted(() => {
  initFromConsistsOf();
});
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.15s ease-out forwards;
}
</style>
