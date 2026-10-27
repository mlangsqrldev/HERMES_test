<template>
  <div class="col-span-full border-2 border-primary/20 bg-base-100 rounded-2xl p-5 mb-6 shadow-sm">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-base-200">
      <div class="flex items-center gap-2.5">
        <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold shadow-xs">
          🎯
        </div>
        <div>
          <h4 class="font-bold text-base leading-tight flex items-center gap-2">
            <span>{{ currentLocale === 'de' ? '3D-Digitalisierungsmethoden, Technik & Equipment (CARARE consistsOf)' : '3D Digitisation Methods, Techniques & Equipment (CARARE consistsOf)' }}</span>
            <span class="badge badge-primary badge-sm font-semibold">CARARE 2.0.6</span>
          </h4>
          <p class="text-xs text-base-content/60 mt-0.5 max-w-3xl">
            {{ currentLocale === 'de'
              ? 'Laut CARARE-Schema werden Digitalisierungsmethoden (Photogrammetrie, SLS, TLS), Techniken und verwendete Hard-/Software nicht in der Ressource, sondern als Teilschritte (consistsOf) der Aktivität erfasst.'
              : 'According to the CARARE schema, digitisation methods (Photogrammetry, SLS, TLS), techniques and hardware/software belong to Activity sub-events (consistsOf), not the digital resource.' }}
          </p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="btn btn-xs btn-outline btn-primary gap-1"
          @click="addPredefinedSubactivity('both')"
          :title="currentLocale === 'de' ? 'Erstellt Erfassungs- und Verarbeitungs-Teilschritt automatisch' : 'Creates capture and post-processing steps'"
        >
          ⚡ {{ currentLocale === 'de' ? 'Standard-Workflow übernehmen (Erfassung + Verarbeitung)' : 'Apply Full Standard Workflow' }}
        </button>
      </div>
    </div>

    <!-- 1. METHODEN-WAHL -->
    <div class="mb-4 p-3.5 bg-base-200/40 rounded-xl border border-base-200">
      <div class="flex items-center justify-between mb-2">
        <label class="label-text font-bold text-xs uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
          <span>🎯</span>
          <span>{{ currentLocale === 'de' ? '1. Primäres 3D-Erfassungsverfahren' : '1. Primary 3D Acquisition Method' }}</span>
        </label>
        <span class="text-[11px] text-base-content/50">
          {{ currentLocale === 'de' ? 'Wählen Sie das Verfahren zur Vorkonfiguration' : 'Select method to configure sub-activities' }}
        </span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          type="button"
          class="btn btn-sm flex items-center justify-center gap-2 transition-all"
          :class="activeMethod === 'photogrammetry' ? 'btn-secondary text-secondary-content font-bold shadow-xs' : 'btn-ghost border border-base-300 hover:border-secondary/60'"
          @click="selectMethod('photogrammetry')"
        >
          <span>📷</span>
          <span class="truncate">{{ currentLocale === 'de' ? 'Photogrammetrie' : 'Photogrammetry' }}</span>
        </button>

        <button
          type="button"
          class="btn btn-sm flex items-center justify-center gap-2 transition-all"
          :class="activeMethod === 'sls' ? 'btn-primary text-primary-content font-bold shadow-xs' : 'btn-ghost border border-base-300 hover:border-primary/60'"
          @click="selectMethod('sls')"
        >
          <span>💡</span>
          <span class="truncate">SLS (Streifenlicht)</span>
        </button>

        <button
          type="button"
          class="btn btn-sm flex items-center justify-center gap-2 transition-all"
          :class="activeMethod === 'tls' ? 'btn-accent text-accent-content font-bold shadow-xs' : 'btn-ghost border border-base-300 hover:border-accent/60'"
          @click="selectMethod('tls')"
        >
          <span>🌐</span>
          <span class="truncate">TLS (Laserscan)</span>
        </button>

        <button
          type="button"
          class="btn btn-sm flex items-center justify-center gap-2 transition-all"
          :class="activeMethod === 'hybrid' ? 'btn-neutral text-neutral-content font-bold shadow-xs' : 'btn-ghost border border-base-300 hover:border-neutral/60'"
          @click="selectMethod('hybrid')"
        >
          <span>🔀</span>
          <span class="truncate">{{ currentLocale === 'de' ? 'Hybrid (SLS + Photo)' : 'Hybrid (SLS + Photo)' }}</span>
        </button>
      </div>
    </div>

    <!-- 2. HARDWARE & SOFTWARE KONFIGURATOR -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <!-- Left: Hardware Equipment -->
      <div class="p-3.5 bg-base-200/40 rounded-xl border border-base-200">
        <div class="flex items-center justify-between mb-2">
          <label class="label-text font-bold text-xs uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
            <span>📷</span>
            <span>{{ currentLocale === 'de' ? 'Hardware-Equipment (Kamera / Scanner)' : 'Hardware Equipment (Camera / Scanner)' }}</span>
          </label>
        </div>

        <!-- Quick Presets -->
        <div class="flex flex-wrap gap-1 mb-2.5">
          <button
            v-for="hw in currentHwPresets"
            :key="hw.name"
            type="button"
            class="badge badge-xs hover:badge-primary cursor-pointer transition-all gap-0.5"
            :class="selectedHardware.includes(hw.name) ? 'badge-primary font-bold' : 'badge-ghost border border-base-300'"
            @click="toggleHardware(hw.name)"
          >
            <span>+</span>
            <span>{{ hw.name }}</span>
          </button>
        </div>

        <input
          type="text"
          v-model="customHardware"
          class="input input-sm input-bordered w-full text-xs font-mono"
          :placeholder="currentLocale === 'de' ? 'z. B. Sony A7R V / Nikkor 50mm / Artec Leo' : 'e.g. Sony A7R V / Nikkor 50mm / Artec Leo'"
        />
      </div>

      <!-- Right: Processing Software & Techniques -->
      <div class="p-3.5 bg-base-200/40 rounded-xl border border-base-200">
        <div class="flex items-center justify-between mb-2">
          <label class="label-text font-bold text-xs uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
            <span>💻</span>
            <span>{{ currentLocale === 'de' ? 'Verarbeitungs-Software & Pipeline' : 'Processing Software & Pipeline' }}</span>
          </label>
        </div>

        <!-- Software Presets -->
        <div class="flex flex-wrap gap-1 mb-2.5">
          <button
            v-for="sw in SOFTWARE_PRESETS"
            :key="sw"
            type="button"
            class="badge badge-xs hover:badge-secondary cursor-pointer transition-all gap-0.5"
            :class="selectedSoftware.includes(sw) ? 'badge-secondary font-bold' : 'badge-ghost border border-base-300'"
            @click="toggleSoftware(sw)"
          >
            <span>+</span>
            <span>{{ sw }}</span>
          </button>
        </div>

        <input
          type="text"
          v-model="customSoftware"
          class="input input-sm input-bordered w-full text-xs font-mono"
          :placeholder="currentLocale === 'de' ? 'z. B. RealityCapture, Agisoft Metashape, Blender' : 'e.g. RealityCapture, Agisoft Metashape, Blender'"
        />
      </div>
    </div>

    <!-- 3. ACTIONS TO POPULATE CONSISTS-OF -->
    <div class="flex flex-wrap items-center justify-between gap-3 p-3 bg-primary/5 rounded-xl border border-primary/20">
      <div class="text-xs text-base-content/70">
        <span>{{ currentLocale === 'de' ? 'Aktuell hinterlegte Teilschritte in dieser Aktivität:' : 'Current sub-activities in this activity:' }}</span>
        <strong class="ml-1 text-primary">{{ (consistsOfList || []).length }}</strong>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="btn btn-xs btn-primary gap-1 font-bold shadow-xs"
          @click="addPredefinedSubactivity('capture')"
        >
          <span>➕</span>
          <span>{{ currentLocale === 'de' ? 'Erfassungs-Schritt anlegen' : 'Add Capture Step' }}</span>
        </button>

        <button
          type="button"
          class="btn btn-xs btn-outline btn-primary gap-1 font-bold"
          @click="addPredefinedSubactivity('processing')"
        >
          <span>➕</span>
          <span>{{ currentLocale === 'de' ? 'Post-Processing-Schritt anlegen' : 'Add Post-Processing Step' }}</span>
        </button>
      </div>
    </div>

    <!-- Active consistsOf Sub-Activities Mini-List -->
    <div v-if="consistsOfList && consistsOfList.length > 0" class="mt-3 space-y-2">
      <div
        v-for="(item, idx) in consistsOfList"
        :key="idx"
        class="p-2.5 bg-base-200/50 rounded-lg border border-base-300 flex items-start justify-between gap-3 text-xs"
      >
        <div class="space-y-1 min-w-0 flex-1">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="badge badge-xs badge-neutral font-mono">#{{ idx + 1 }}</span>
            <span class="font-bold text-base-content truncate">
              {{ item.hadSpecificPurpose || (currentLocale === 'de' ? 'Teilschritt ohne Titel' : 'Sub-activity') }}
            </span>
            <span v-if="item['hadSpecificPurpose#lang'] || item['#lang']" class="badge badge-xs badge-ghost uppercase font-mono">
              {{ item['hadSpecificPurpose#lang'] || item['#lang'] }}
            </span>
          </div>

          <div class="flex items-center gap-3 text-base-content/70 flex-wrap text-[11px]">
            <span v-if="item.methods">
              <strong>{{ currentLocale === 'de' ? 'Methode:' : 'Method:' }}</strong> {{ item.methods }}
            </span>
            <span v-if="item.techniques">
              <strong>{{ currentLocale === 'de' ? 'Technik:' : 'Technique:' }}</strong> {{ item.techniques }}
            </span>
            <span v-if="item.equipment">
              <strong>{{ currentLocale === 'de' ? 'Equipment:' : 'Equipment:' }}</strong> {{ item.equipment }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-1 shrink-0">
          <button
            type="button"
            class="btn btn-ghost btn-xs text-info"
            @click="$emit('edit-step', idx)"
          >
            {{ currentLocale === 'de' ? 'Bearbeiten' : 'Edit' }}
          </button>
          <button
            type="button"
            class="btn btn-ghost btn-xs text-error"
            @click="$emit('remove-step', idx)"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  consistsOfList: {
    type: Array,
    default: () => []
  },
  currentLocale: {
    type: String,
    default: 'de'
  }
});

const emit = defineEmits(['add-step', 'edit-step', 'remove-step']);

const activeMethod = ref('photogrammetry');
const selectedHardware = ref(['Nikon Z 8', 'NIKKOR Z 50mm f/1.8 S']);
const customHardware = ref('');
const selectedSoftware = ref(['RealityCapture', 'Blender 4.3']);
const customSoftware = ref('');

const PHOTO_HW = [
  { name: 'Sony A7R V (61 MP)' },
  { name: 'Nikon Z 8 (45.7 MP)' },
  { name: 'NIKKOR Z 50mm f/1.8 S' },
  { name: 'Sony FE 50mm f/1.4 GM' },
  { name: 'Phase One IQ4 150MP' },
  { name: 'Polfilter & Ringlicht' },
  { name: 'Elektrischer Drehteller' }
];

const SLS_HW = [
  { name: 'Artec Leo (VCSEL 3D-Scanner)' },
  { name: 'EinScan Pro HD (Streifenlicht)' },
  { name: 'GOM ATOS Q (Blaues Streifenlicht)' },
  { name: 'Breuckmann smartSCAN' },
  { name: 'Artec Eva' },
  { name: 'Optische Kalibriertargets' }
];

const TLS_HW = [
  { name: 'Leica RTC360 (3D-Laserscanner)' },
  { name: 'Faro Focus Core / Premium' },
  { name: 'Z+F IMAGER 5016' },
  { name: 'Leica BLK360 G2' },
  { name: 'Geodätische Passmarken' }
];

const currentHwPresets = computed(() => {
  if (activeMethod.value === 'photogrammetry') return PHOTO_HW;
  if (activeMethod.value === 'sls') return SLS_HW;
  if (activeMethod.value === 'tls') return TLS_HW;
  return [...PHOTO_HW.slice(0, 3), ...SLS_HW.slice(0, 3)];
});

const SOFTWARE_PRESETS = [
  'RealityCapture 1.4',
  'Agisoft Metashape Pro 2.1',
  'Artec Studio 19 Pro',
  'FARO SCENE',
  'CloudCompare',
  'MeshLab',
  'Blender 4.3 LTS',
  'Substance 3D Painter'
];

const selectMethod = (method) => {
  activeMethod.value = method;
  if (method === 'photogrammetry') {
    selectedHardware.value = ['Nikon Z 8 (45.7 MP)', 'NIKKOR Z 50mm f/1.8 S', 'Polfilter & Ringlicht'];
    selectedSoftware.value = ['RealityCapture 1.4', 'Blender 4.3 LTS'];
  } else if (method === 'sls') {
    selectedHardware.value = ['Artec Leo (VCSEL 3D-Scanner)', 'Optische Kalibriertargets'];
    selectedSoftware.value = ['Artec Studio 19 Pro', 'Blender 4.3 LTS'];
  } else if (method === 'tls') {
    selectedHardware.value = ['Leica RTC360 (3D-Laserscanner)', 'Geodätische Passmarken'];
    selectedSoftware.value = ['FARO SCENE', 'CloudCompare'];
  } else if (method === 'hybrid') {
    selectedHardware.value = ['Artec Leo (VCSEL 3D-Scanner)', 'Sony A7R V (61 MP)'];
    selectedSoftware.value = ['Artec Studio 19 Pro', 'RealityCapture 1.4', 'Blender 4.3 LTS'];
  }
};

const toggleHardware = (name) => {
  const idx = selectedHardware.value.indexOf(name);
  if (idx >= 0) {
    selectedHardware.value.splice(idx, 1);
  } else {
    selectedHardware.value.push(name);
  }
};

const toggleSoftware = (name) => {
  const idx = selectedSoftware.value.indexOf(name);
  if (idx >= 0) {
    selectedSoftware.value.splice(idx, 1);
  } else {
    selectedSoftware.value.push(name);
  }
};

const getEffectiveHardware = () => {
  const list = [...selectedHardware.value];
  if (customHardware.value.trim()) list.push(customHardware.value.trim());
  return list.join('; ');
};

const getEffectiveSoftware = () => {
  const list = [...selectedSoftware.value];
  if (customSoftware.value.trim()) list.push(customSoftware.value.trim());
  return list.join('; ');
};

const addPredefinedSubactivity = (kind) => {
  const isDe = props.currentLocale === 'de';
  const lang = isDe ? 'de' : 'en';

  if (kind === 'capture' || kind === 'both') {
    let methodText = '';
    let techText = '';
    let matText = '';
    let purposeText = '';

    if (activeMethod.value === 'photogrammetry') {
      methodText = isDe ? 'Nahbereichs-Photogrammetrie (Structure-from-Motion / SfM)' : 'Close-range photogrammetry (SfM / MVS)';
      techText = isDe ? 'Polarisierte Beleuchtung (Cross-Polarisation), Drehteller-Multiwinkel, Farbkalibrierung' : 'Cross-polarised lighting, turntable multi-angle, color calibration';
      matText = isDe ? 'X-Rite ColorChecker Classic, kalibrierte Passmarken' : 'X-Rite ColorChecker Classic, calibrated scale bars';
      purposeText = isDe ? 'Hochauflösende 3D-Oberflächenerfassung und Texturierung mittels Nahbereichsphotogrammetrie' : 'High-resolution 3D surface capture and texturing via close-range photogrammetry';
    } else if (activeMethod.value === 'sls') {
      methodText = isDe ? 'Streifenlicht-3D-Scanning (Structured light scanning)' : 'Structured light 3D scanning';
      techText = isDe ? 'Optische Streifenmusterprojektion, berührungslose Sub-Millimeter-Abtastung' : 'Optical fringe projection, non-contact sub-millimeter sampling';
      matText = isDe ? '3D-Kalibriertargets' : '3D calibration targets';
      purposeText = isDe ? 'Berührungslose hochpräzise Streifenlicht-3D-Erfassung der geometrischen Oberfläche' : 'Non-contact high-precision structured light 3D capture of geometric surface';
    } else if (activeMethod.value === 'tls') {
      methodText = isDe ? 'Terrestrisches Laserscanning (TLS)' : 'Terrestrial laser scanning (TLS)';
      techText = isDe ? 'Phasenvergleichs-/Laufzeitmessung, geodätische Scan-Registrierung' : 'Phase-shift / time-of-flight LiDAR, geodetic station alignment';
      matText = isDe ? 'Retroreflektierende Passmarken' : 'Retroreflective targets';
      purposeText = isDe ? 'Großräumige hochpräzise 3D-Laserscan-Erfassung des Denkmals / Objekts' : 'Large-scale high-precision 3D terrestrial laser scan acquisition';
    } else {
      methodText = isDe ? 'Hybride 3D-Erfassung (Streifenlichtscanning & Nahbereichsphotogrammetrie)' : 'Hybrid 3D acquisition (Structured light & photogrammetry)';
      techText = isDe ? 'Multisensor-Fusion, optische Geometrieabtastung und PBR-Farbaufnahme' : 'Multi-sensor data fusion, optical geometry sampling and PBR color capture';
      matText = isDe ? 'Kalibrierkörper, Passmarken, ColorChecker' : 'Calibration targets, scale bars, ColorChecker';
      purposeText = isDe ? 'Kombinierte 3D-Erfassung für maximale Geometrie-Genauigkeit und Texturauflösung' : 'Combined 3D acquisition for maximum geometric precision and texture resolution';
    }

    const captureStep = {
      hadSpecificPurpose: purposeText,
      'hadSpecificPurpose#lang': lang,
      startDate: new Date().getFullYear().toString(),
      endDate: new Date().getFullYear().toString(),
      methods: methodText,
      'methods#lang': lang,
      techniques: techText,
      'techniques#lang': lang,
      materials: matText,
      'materials#lang': lang,
      equipment: `Hardware: ${getEffectiveHardware()}; Software: ${getEffectiveSoftware()}`,
      'equipment#lang': lang
    };

    emit('add-step', captureStep);
  }

  if (kind === 'processing' || kind === 'both') {
    const procStep = {
      hadSpecificPurpose: isDe
        ? '3D-Post-Processing: Bereinigung der Punktwolke, Netzoptimierung, UV-Unwrapping und Textur-Baking'
        : '3D post-processing: point cloud cleanup, mesh decimation, UV unwrapping and texture baking',
      'hadSpecificPurpose#lang': lang,
      startDate: new Date().getFullYear().toString(),
      endDate: new Date().getFullYear().toString(),
      methods: isDe ? 'Polygondezimierung, Quad-Remeshing, PBR-Textur-Baking' : 'Polygon decimation, quad remeshing, PBR texture baking',
      'methods#lang': lang,
      techniques: isDe ? 'Poisson-Rekonstruktion, Non-overlapping UV-Packing, Tangent-Space Normal Baking' : 'Poisson reconstruction, non-overlapping UV packing, tangent-space normal baking',
      'techniques#lang': lang,
      materials: '',
      equipment: `Software: ${getEffectiveSoftware() || 'Blender 4.3 LTS, Instant Meshes, RealityCapture'}`,
      'equipment#lang': lang
    };

    emit('add-step', procStep);
  }
};
</script>
