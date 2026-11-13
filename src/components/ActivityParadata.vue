<template>
  <div
    id="act-dap"
    class="col-span-full border-2 border-primary/20 bg-base-100 rounded-2xl p-5 mb-6 shadow-sm scroll-mt-24"
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
          <h4 class="font-bold text-base leading-tight text-base-content">
            Digital Authenticity Profile (DAP)
          </h4>
          <p
            class="text-xs text-base-content/70 mt-0.5 max-w-4xl leading-relaxed"
          >
            {{
              currentLocale === "de"
                ? "Dokumentiert in 5 Freitext-Dimensionen die Transformation des Objekts vom analogen Ausgangsbefund bis zum digitalen 3D-Modell."
                : "Documents in 5 free-text dimensions how the object was transformed from its analog state into the digital 3D model."
            }}
          </p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="flex items-center gap-2 flex-wrap">
        <span
          class="badge badge-sm font-mono gap-1.5 transition-all"
          :class="
            completedCount === 5
              ? 'badge-success text-success-content font-bold'
              : 'badge-warning text-warning-content'
          "
        >
          <span>{{ completedCount === 5 ? "✓" : "⚠️" }}</span>
          <span>{{
            currentLocale === "de"
              ? `${completedCount} von 5 Dimensionen erfasst`
              : `${completedCount} of 5 dimensions complete`
          }}</span>
        </span>

        <button
          type="button"
          class="btn btn-xs btn-outline btn-primary gap-1"
          @click="loadSampleDap"
          :title="
            currentLocale === 'de'
              ? 'Musterbeispiel für alle 5 DAP-Dimensionen laden'
              : 'Load sample data for all 5 DAP dimensions'
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

    <!-- 5 Dimensions (All visible in clean stacked cards for fast free-text entry) -->
    <div class="space-y-4">
      <div
        v-for="dim in DAP_DIMENSIONS"
        :key="dim.id"
        class="p-4 rounded-xl border bg-base-200/30 transition-colors"
        :class="
          dimTexts[dim.id]?.trim()
            ? 'border-success/40 bg-success/5'
            : 'border-base-300'
        "
      >
        <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div class="flex items-center gap-2 flex-wrap">
            <span
              class="badge badge-sm font-mono font-bold"
              :class="dim.badgeColor"
            >
              {{ dim.id }}
            </span>
            <h5 class="font-bold text-sm text-base-content">
              {{ currentLocale === "de" ? dim.titleDe : dim.titleEn }}
            </h5>
          </div>
          <span
            class="text-xs font-medium"
            :class="
              dimTexts[dim.id]?.trim() ? 'text-success' : 'text-base-content/40'
            "
          >
            {{
              dimTexts[dim.id]?.trim()
                ? currentLocale === "de"
                  ? "✓ Erfasst"
                  : "✓ Filled"
                : currentLocale === "de"
                  ? "Noch leer"
                  : "Empty"
            }}
          </span>
        </div>

        <p class="text-xs text-base-content/70 mb-2 leading-relaxed">
          {{ currentLocale === "de" ? dim.hintDe : dim.hintEn }}
        </p>

        <textarea
          v-model="dimTexts[dim.id]"
          @input="syncToConsistsOf"
          rows="3"
          class="textarea textarea-bordered w-full bg-base-100 text-sm leading-relaxed"
          :placeholder="
            currentLocale === 'de' ? dim.placeholderDe : dim.placeholderEn
          "
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch, onMounted } from "vue";

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

const DAP_DIMENSIONS = [
  {
    id: "DAP-1",
    num: 1,
    uri: "http://hector.org/vocab/dap/DAP-1",
    badgeColor: "badge-primary",
    titleDe:
      "Dimension 1 von 5: Materielle Spuren und Merkmale (Ausgangsbefund am Objekt)",
    titleEn:
      "Dimension 1 of 5: Material Traces and Features (Object Condition)",
    purposeDe:
      "Digital Authenticity Profile, Dimension 1 von 5: Materielle Spuren und Merkmale (Ausgangsbefund am Objekt)",
    hintDe:
      "Welche materiellen Spuren, Beschädigungen, Bearbeitungsspuren oder historischen Restaurierungen weist das physische Objekt auf?",
    hintEn:
      "Which material traces, damages, tool marks, or historical restorations are present on the physical object?",
    placeholderDe:
      "z. B. Abgebrochene rechte Hand, Bestoßungen am Gewand, Brandspuren auf der Rückseite, antike Drehspuren, historische Restaurierungskittung am Hals...",
    placeholderEn:
      "e.g. Broken right hand, chips along the drapery, burn marks on the reverse, historical restoration fills...",
  },
  {
    id: "DAP-2",
    num: 2,
    uri: "http://hector.org/vocab/dap/DAP-2",
    badgeColor: "badge-secondary",
    titleDe: "Dimension 2 von 5: Aufnahmeprozess und Erfassungsumfang",
    titleEn: "Dimension 2 of 5: Acquisition Process and Coverage",
    purposeDe:
      "Digital Authenticity Profile, Dimension 2 von 5: Aufnahmeprozess und Erfassungsumfang",
    hintDe:
      "Wie wurde das Objekt erfasst? Welche Bereiche blieben ausgespart oder abgeschattet (z. B. Standfläche, Hohlräume)?",
    hintEn:
      "How was the object captured? Which areas were omitted or occluded (e.g. base, cavities)?",
    placeholderDe:
      "z. B. 360°-Rundumerfassung mittels Streifenlichtscan; Standfläche aus Standsicherheitsgründen ausgespart; Innenhohlraum teilweise abgeschattet.",
    placeholderEn:
      "e.g. 360° capture using structured-light scanning; base omitted for stability; interior cavity partially occluded.",
  },
  {
    id: "DAP-3",
    num: 3,
    uri: "http://hector.org/vocab/dap/DAP-3",
    badgeColor: "badge-accent",
    titleDe: "Dimension 3 von 5: Geometrie-Bearbeitung",
    titleEn: "Dimension 3 of 5: Geometry Processing",
    purposeDe:
      "Digital Authenticity Profile, Dimension 3 von 5: Geometrie-Bearbeitung",
    hintDe:
      "Welche Eingriffe wurden an der 3D-Geometrie vorgenommen (z. B. Löcher geschlossen, Ausrichtung, Dezimierung, Glättung)?",
    hintEn:
      "Which operations were performed on the 3D geometry (e.g. hole filling, alignment, decimation, smoothing)?",
    placeholderDe:
      "z. B. Ausrichtung der Einzelscans per ICP, Entfernung von Messrauschen, geschlossene Löcher an der Standfläche, Dezimierung auf 250k Polygone für Web-Derivat.",
    placeholderEn:
      "e.g. ICP alignment of single scans, noise removal, watertight hole filling at the base, decimation to 250k polygons.",
  },
  {
    id: "DAP-4",
    num: 4,
    uri: "http://hector.org/vocab/dap/DAP-4",
    badgeColor: "badge-info",
    titleDe: "Dimension 4 von 5: Textur, Shader und Material",
    titleEn: "Dimension 4 of 5: Texture, Shader and Material",
    purposeDe:
      "Digital Authenticity Profile, Dimension 4 von 5: Textur, Shader und Material",
    hintDe:
      "Wie wurden Texturen, Farben, Lichteffekte (Delighting) und Materialeigenschaften (PBR/Shader) erzeugt bzw. angepasst?",
    hintEn:
      "How were textures, colors, lighting (delighting), and material properties (PBR/shaders) generated or adjusted?",
    placeholderDe:
      "z. B. Farbkalibrierung mittels ColorChecker, Delighting der Texturkacheln, Normal-Map-Bake aus High-Poly-Mesh.",
    placeholderEn:
      "e.g. Color calibration using ColorChecker, delighting of texture tiles, normal map bake from high-poly mesh.",
  },
  {
    id: "DAP-5",
    num: 5,
    uri: "http://hector.org/vocab/dap/DAP-5",
    badgeColor: "badge-success",
    titleDe: "Dimension 5 von 5: Abbildungsbilanz",
    titleEn: "Dimension 5 of 5: Representation Balance",
    purposeDe:
      "Digital Authenticity Profile, Dimension 5 von 5: Abbildungsbilanz",
    hintDe:
      "Abschließende Bewertung: Was bildet das digitale 3D-Modell authentisch ab und wo liegen bewusste Grenzen oder Abweichungen zum Original?",
    hintEn:
      "Final assessment: What does the digital 3D model represent authentically and where are intentional limits or deviations from the original?",
    placeholderDe:
      "z. B. Alle sichtbaren Oberflächenspuren und Beschädigungen sind maßstabsgetreu erhalten; lediglich die Standfläche wurde plan geschlossen.",
    placeholderEn:
      "e.g. All visible surface traces and damages are preserved to scale; only the base was closed flat.",
  },
];

const dimTexts = reactive({
  "DAP-1": "",
  "DAP-2": "",
  "DAP-3": "",
  "DAP-4": "",
  "DAP-5": "",
});

const completedCount = computed(() => {
  return DAP_DIMENSIONS.filter((d) => Boolean((dimTexts[d.id] || "").trim()))
    .length;
});

const isDapEntry = (item) => {
  if (!item) return false;
  if (item.isDap) return true;
  const p = String(item.hadSpecificPurpose || "");
  const uid = String(item["methods#termUID"] || "");
  return (
    p.includes("Digital Authenticity Profile") ||
    p.includes("DAP-") ||
    uid.includes("/dap/DAP-")
  );
};

let isSyncing = false;

const syncToConsistsOf = () => {
  if (!props.form) return;
  isSyncing = true;
  const existing = Array.isArray(props.form["consistsOf"])
    ? props.form["consistsOf"]
    : [];
  const regularSteps = existing.filter((item) => !isDapEntry(item));

  const dapSteps = [];
  DAP_DIMENSIONS.forEach((dim) => {
    const val = (dimTexts[dim.id] || "").trim();
    if (val) {
      dapSteps.push({
        isDap: true,
        dapId: dim.id,
        hadSpecificPurpose: dim.purposeDe,
        "hadSpecificPurpose#lang": "de",
        methods: val,
        "methods#lang": props.currentLocale === "en" ? "en" : "de",
        "methods#termUID": dim.uri,
      });
    }
  });

  props.form["consistsOf"] = [...regularSteps, ...dapSteps];
  setTimeout(() => {
    isSyncing = false;
  }, 0);
};

const initFromConsistsOf = () => {
  if (isSyncing || !props.form || !Array.isArray(props.form["consistsOf"])) {
    return;
  }
  const list = props.form["consistsOf"];

  DAP_DIMENSIONS.forEach((dim) => {
    const found = list.find((item) => {
      const p = String(item.hadSpecificPurpose || "");
      const uid = String(item["methods#termUID"] || "");
      const m = Array.isArray(item.methods)
        ? item.methods.join(" ")
        : String(item.methods || "");
      return (
        item.dapId === dim.id ||
        uid.endsWith(`/${dim.id}`) ||
        p.includes(`Dimension ${dim.num} von 5`) ||
        p.includes(dim.id) ||
        m.includes(dim.id)
      );
    });

    if (found) {
      const methodText = Array.isArray(found.methods)
        ? found.methods.join("; ")
        : String(found.methods || "");
      const techText = Array.isArray(found.techniques)
        ? found.techniques.join("; ")
        : String(found.techniques || "");
      dimTexts[dim.id] = (methodText || techText || "").trim();
    } else {
      dimTexts[dim.id] = "";
    }
  });
};

const loadSampleDap = () => {
  dimTexts["DAP-1"] =
    "Abgebrochene Partien und Bestoßungen an der Oberfläche, feine Rissbildung sowie historische Restaurierungskittungen dokumentiert.";
  dimTexts["DAP-2"] =
    "360°-Rundumerfassung im Museum; Standfläche aus Standsicherheitsgründen ausgespart; tiefer liegende Hohlräume teilweise abgeschattet.";
  dimTexts["DAP-3"] =
    "ICP-Ausrichtung der Einzelscans, Entfernung von Messrauschen, plane Schließung der Standfläche und Dezimierung für Web-Derivat.";
  dimTexts["DAP-4"] =
    "Farbkalibrierung mittels ColorChecker, Delighting der Texturaufnahmen und Normal-Map-Bake aus dem hochauflösenden Modell.";
  dimTexts["DAP-5"] =
    "Alle sichtbaren Oberflächenspuren und Beschädigungen sind maßstabsgetreu abgebildet; lediglich die ausgesparte Standfläche wurde plan geschlossen.";
  syncToConsistsOf();
};

const clearAllDap = () => {
  DAP_DIMENSIONS.forEach((dim) => {
    dimTexts[dim.id] = "";
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
