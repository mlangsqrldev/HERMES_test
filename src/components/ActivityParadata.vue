<template>
  <div class="col-span-full border-2 border-secondary/25 bg-base-100 rounded-2xl p-5 mb-6 shadow-sm">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-base-200">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center text-lg font-bold">
          🔬
        </div>
        <div>
          <h4 class="font-bold text-base leading-tight flex items-center gap-2">
            {{ currentLocale === 'de' ? '3D-Paradaten der Erfassungsaktivität (Löcherschließung, Aufnahmeprozess & Nachbearbeitung)' : '3D Activity Paradata (Hole Filling, Capture Process & Processing)' }}
            <span class="badge badge-secondary badge-sm font-semibold">London Charter / Sevilla</span>
          </h4>
          <p class="text-xs text-base-content/60 mt-0.5">
            {{ currentLocale === 'de'
              ? 'Paradaten dokumentieren die methodischen Entscheidungen und menschlichen Eingriffe dieser Aktivität: wie wurden Löcher geschlossen (z. B. Screened Poisson), was wurde weggelassen (z. B. Sockel) und welche Shader manuell erstellt wurden.'
              : 'Paradata documents methodical decisions and human interventions during this activity: how holes were filled (e.g. Screened Poisson), capture omissions (e.g. base), and manual shader generation.' }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="btn btn-xs btn-outline btn-secondary gap-1"
          @click="syncToDescription"
          :title="currentLocale === 'de' ? 'Fügt die Paradaten strukturiert in CARARE <description> ein' : 'Syncs paradata into CARARE description'"
        >
          ⚡ {{ currentLocale === 'de' ? 'In CARARE-Aktivitätsbeschreibung übernehmen' : 'Sync into CARARE Description' }}
        </button>
      </div>
    </div>

    <!-- 1. AUFNAHMEPROZESS & ERFASSUNGSUMFANG (LIMITATIONEN & AUSLASSUNGEN) -->
    <div class="p-3.5 bg-base-200/40 rounded-xl border border-base-200 mb-4">
      <div class="flex items-center justify-between mb-1.5">
        <label class="label-text font-bold text-xs uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
          <span>📷</span>
          {{ currentLocale === 'de' ? '1. Aufnahmeprozess & Erfassungsumfang (Limitationen / Auslassungen)' : '1. Capture Scope & Exclusions (Limitations)' }}
        </label>
        <span class="text-[10px] text-base-content/50">
          {{ currentLocale === 'de' ? 'z. B. Nur Vorderseite erfasst, Sockel weggelassen' : 'e.g. Front only captured, base omitted' }}
        </span>
      </div>

      <!-- Quick Preset Chips -->
      <div class="flex flex-wrap gap-1 mb-2">
        <button
          v-for="chip in SCOPE_PRESETS"
          :key="chip.de"
          type="button"
          class="badge badge-ghost badge-xs hover:badge-secondary cursor-pointer transition-all gap-1"
          @click="appendPreset('scope', currentLocale === 'de' ? chip.de : chip.en)"
        >
          <span>+</span>
          <span>{{ currentLocale === 'de' ? chip.de : chip.en }}</span>
        </button>
      </div>

      <textarea
        v-model="scopeText"
        class="textarea textarea-bordered textarea-sm w-full font-mono text-xs leading-relaxed"
        rows="2"
        :placeholder="currentLocale === 'de'
          ? 'z. B. Nur die Vorderseite konnte erfasst werden; der Sockel und die unzugängliche Rückseite wurden aufgrund der Vitrinen-Wandaufstellung ausgelassen.'
          : 'e.g. Only the front side was captured; the base and back were omitted due to wall mounting inside the exhibition showcase.'"
      ></textarea>
    </div>

    <!-- 2. GEOMETRISCHE MODELLIERUNG & NETZREPARATUR (FILL HOLES) -->
    <div class="p-3.5 bg-base-200/40 rounded-xl border border-base-200 mb-4">
      <div class="flex items-center justify-between mb-1.5">
        <label class="label-text font-bold text-xs uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
          <span>🔺</span>
          {{ currentLocale === 'de' ? '2. Geometrie-Bearbeitung & Löcherschließung (Fill Holes & Modellierung)' : '2. Mesh Repair & Hole Filling (Decisions)' }}
        </label>
        <span class="text-[10px] text-base-content/50">
          {{ currentLocale === 'de' ? 'z. B. Löcher geschlossen, Poisson-Rekonstruktion' : 'e.g. Closed holes, Poisson reconstruction' }}
        </span>
      </div>

      <!-- Quick Preset Chips -->
      <div class="flex flex-wrap gap-1 mb-2">
        <button
          v-for="chip in MESH_PRESETS"
          :key="chip.de"
          type="button"
          class="badge badge-ghost badge-xs hover:badge-secondary cursor-pointer transition-all gap-1"
          @click="appendPreset('mesh', currentLocale === 'de' ? chip.de : chip.en)"
        >
          <span>+</span>
          <span>{{ currentLocale === 'de' ? chip.de : chip.en }}</span>
        </button>
      </div>

      <textarea
        v-model="meshText"
        class="textarea textarea-bordered textarea-sm w-full font-mono text-xs leading-relaxed"
        rows="2"
        :placeholder="currentLocale === 'de'
          ? 'z. B. Geometrische Löcher und Hinterschneidungen im Faltenwurf wurden durch Screened Poisson Surface Reconstruction geschlossen und Rauschen bilateral geglättet.'
          : 'e.g. Geometric holes and undercuts in drapery folds were closed via Screened Poisson Reconstruction; surface noise was bilaterally smoothed.'"
      ></textarea>
    </div>

    <!-- 3. TEXTUR-, SHADER- & MATERIAL-PARADATEN -->
    <div class="p-3.5 bg-base-200/40 rounded-xl border border-base-200 mb-4">
      <div class="flex items-center justify-between mb-1.5">
        <label class="label-text font-bold text-xs uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
          <span>🎨</span>
          {{ currentLocale === 'de' ? '3. Textur-, Shader- & Material-Paradaten' : '3. Texture, Shader & Material Paradata' }}
        </label>
        <span class="text-[10px] text-base-content/50">
          {{ currentLocale === 'de' ? 'z. B. Händisch SSS-Map erstellt, Normal-Baking' : 'e.g. Handcrafted SSS map, normal baking' }}
        </span>
      </div>

      <!-- Quick Preset Chips -->
      <div class="flex flex-wrap gap-1 mb-2">
        <button
          v-for="chip in SHADER_PRESETS"
          :key="chip.de"
          type="button"
          class="badge badge-ghost badge-xs hover:badge-secondary cursor-pointer transition-all gap-1"
          @click="appendPreset('shader', currentLocale === 'de' ? chip.de : chip.en)"
        >
          <span>+</span>
          <span>{{ currentLocale === 'de' ? chip.de : chip.en }}</span>
        </button>
      </div>

      <textarea
        v-model="shaderText"
        class="textarea textarea-bordered textarea-sm w-full font-mono text-xs leading-relaxed"
        rows="2"
        :placeholder="currentLocale === 'de'
          ? 'z. B. SSS-Map (Subsurface Scattering) für Transluzenz des pentelischen Marmors händisch modelliert; Normal-Map aus High-Poly-Master gebaked.'
          : 'e.g. SSS map manually handcrafted for marble translucency; normal map baked from high-poly master.'"
      ></textarea>
    </div>

    <!-- 4. LONDON CHARTER / SEVILLA PRINZIPIEN (METHODISCHE BEGRÜNDUNG) -->
    <div class="p-3.5 bg-base-200/40 rounded-xl border border-base-200">
      <div class="flex items-center justify-between mb-1.5">
        <label class="label-text font-bold text-xs uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
          <span>📜</span>
          {{ currentLocale === 'de' ? '4. Wissenschaftliche Begründung (London Charter & Sevilla Principles)' : '4. Methodical Reasoning (London Charter)' }}
        </label>
        <span class="text-[10px] text-base-content/50">
          {{ currentLocale === 'de' ? 'Begründung für Rekonstruktionen & Hypothesen' : 'Scholarly rationale for reconstructions' }}
        </span>
      </div>

      <!-- Quick Preset Chips -->
      <div class="flex flex-wrap gap-1 mb-2">
        <button
          v-for="chip in REASONING_PRESETS"
          :key="chip.de"
          type="button"
          class="badge badge-ghost badge-xs hover:badge-secondary cursor-pointer transition-all gap-1"
          @click="appendPreset('reasoning', currentLocale === 'de' ? chip.de : chip.en)"
        >
          <span>+</span>
          <span>{{ currentLocale === 'de' ? chip.de : chip.en }}</span>
        </button>
      </div>

      <textarea
        v-model="reasoningText"
        class="textarea textarea-bordered textarea-sm w-full font-mono text-xs leading-relaxed"
        rows="2"
        :placeholder="currentLocale === 'de'
          ? 'z. B. Rekonstruktion fehlender Partien erfolgte hypothesenfrei als planare Schließung zur Wahrung wissenschaftlicher Transparenz gemäß London Charter.'
          : 'e.g. Reconstruction of missing geometry was performed strictly non-hypothetically using planar bridging according to London Charter principles.'"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  description: {
    type: String,
    default: ''
  },
  currentLocale: {
    type: String,
    default: 'de'
  }
});

const emit = defineEmits(['update:description', 'synced']);

const scopeText = ref('');
const meshText = ref('');
const shaderText = ref('');
const reasoningText = ref('');

// Presets
const SCOPE_PRESETS = [
  {
    de: 'Sockel weggelassen (Ausstellungskontext)',
    en: 'Base omitted due to display mounting'
  },
  {
    de: 'Nur Schauseite/Vorderseite erfasst (Wandvitrine)',
    en: 'Front side only captured (wall display)'
  },
  {
    de: 'Unterseite unzugänglich',
    en: 'Underside inaccessible'
  },
  {
    de: 'Hinterschneidungen durch Ausleuchtungsgrenzen partiell unvollständig',
    en: 'Undercuts partially incomplete due to lighting constraints'
  }
];

const MESH_PRESETS = [
  {
    de: 'Löcher geschlossen via Screened Poisson Surface Reconstruction',
    en: 'Holes filled via Screened Poisson Surface Reconstruction'
  },
  {
    de: 'Planare Schließung von Fehlstellen (Bridging & Hole Filling)',
    en: 'Planar hole filling & boundary bridging applied'
  },
  {
    de: 'Bilaterale Glättung von Rauschen (Mesh Denoising)',
    en: 'Bilateral mesh denoising applied'
  },
  {
    de: 'Keine Rekonstruktion fehlender Bruchstücke (Authentizität nach Charta von Venedig)',
    en: 'No hypothetical completion of broken fragments'
  }
];

const SHADER_PRESETS = [
  {
    de: 'Händisch SSS-Map (Subsurface Scattering) für Marmor-Transluzenz erstellt',
    en: 'Handcrafted SSS map created for marble translucency'
  },
  {
    de: 'Normal Map & Ambient Occlusion aus High-Poly Master gebaked',
    en: 'Normal map & AO baked from high-poly master'
  },
  {
    de: 'Fotogrammetrie-Schlagschatten händisch entfernt (Delighting)',
    en: 'Photogrammetric cast shadows manually removed (delighting)'
  },
  {
    de: 'PBR Roughness-Map anhand historischer Materialoberfläche kalibriert',
    en: 'PBR roughness map calibrated to historic material surface'
  }
];

const REASONING_PRESETS = [
  {
    de: 'Hypothesenfreie Glättung und Schließung von Fehlstellen zur Vermeidung von Artefakten',
    en: 'Non-hypothetical smoothing and hole closing to prevent artifacts'
  },
  {
    de: 'Historische Parallelen gleicher Epoche zur Orientierung herangezogen',
    en: 'Contemporary parallels from same epoch referenced for guidance'
  }
];

const appendPreset = (type, val) => {
  let target = scopeText;
  if (type === 'mesh') target = meshText;
  else if (type === 'shader') target = shaderText;
  else if (type === 'reasoning') target = reasoningText;

  if (!target.value.trim()) {
    target.value = val;
  } else if (!target.value.includes(val)) {
    target.value = target.value.trim() + '; ' + val;
  }
};

const syncToDescription = () => {
  const isDe = props.currentLocale === 'de';
  const paradataParts = [];

  if (scopeText.value.trim()) {
    paradataParts.push(isDe ? `• Erfassungsumfang & Grenzen: ${scopeText.value.trim()}` : `• Capture Scope & Exclusions: ${scopeText.value.trim()}`);
  }
  if (meshText.value.trim()) {
    paradataParts.push(isDe ? `• Geometrie & Löcherschließung: ${meshText.value.trim()}` : `• Geometry & Hole Filling: ${meshText.value.trim()}`);
  }
  if (shaderText.value.trim()) {
    paradataParts.push(isDe ? `• Textur & Shader: ${shaderText.value.trim()}` : `• Textures & Shaders: ${shaderText.value.trim()}`);
  }
  if (reasoningText.value.trim()) {
    paradataParts.push(isDe ? `• Wissenschaftliche Begründung (London Charter): ${reasoningText.value.trim()}` : `• Scholarly Reasoning (London Charter): ${reasoningText.value.trim()}`);
  }

  if (paradataParts.length === 0) {
    alert(isDe ? 'Bitte füllen Sie mindestens ein Paradaten-Feld aus.' : 'Please fill in at least one paradata field.');
    return;
  }

  const header = isDe ? '[3D-Paradaten / Prozessdokumentation]' : '[3D Paradata / Process Documentation]';
  const paradataBlock = `${header}\n${paradataParts.join('\n')}`;

  // Update description
  let newDesc = props.description || '';
  if (newDesc.includes(header)) {
    // Replace existing block
    const parts = newDesc.split(header);
    newDesc = parts[0].trim() + (parts[0].trim() ? '\n\n' : '') + paradataBlock;
  } else {
    newDesc = newDesc.trim() ? `${newDesc.trim()}\n\n${paradataBlock}` : paradataBlock;
  }

  emit('update:description', newDesc);
  emit('synced', { paradataBlock });
};
</script>
