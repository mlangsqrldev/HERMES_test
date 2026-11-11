<template>
  <div class="border-2 border-primary/20 bg-base-100 rounded-2xl p-5 mb-6 shadow-md transition-all">
    <!-- Header with 3D / Methodology Badge -->
    <div class="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-base-200">
      <div class="flex items-center gap-2.5">
        <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
          🧊
        </div>
        <div>
          <h4 class="font-bold text-base leading-tight flex items-center gap-2 flex-wrap">
            <span>{{ currentLocale === 'de' ? 'Technische Metadaten & 3D-Erfassung' : 'Technical Metadata & 3D Acquisition' }}</span>
            <span class="badge badge-primary badge-sm font-semibold">CARARE 2.0.6 / HECTOR</span>
          </h4>
          <p class="text-xs text-base-content/60 mt-0.5">
            {{ currentLocale === 'de'
              ? 'Strikte Unterscheidung der Erfassungsverfahren (Photogrammetrie, SLS, TLS) inklusive Rohbild-Dokumentation und automatischem CARARE-Export.'
              : 'Strict distinction of acquisition workflows (Photogrammetry, SLS, TLS) including RAW image documentation and automatic CARARE export.' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Schema Info Banner -->
    <div class="mb-4 p-3.5 bg-primary/5 rounded-xl border border-primary/20 flex items-start gap-3">
      <div class="text-xl">ℹ️</div>
      <div class="text-xs text-base-content/75 space-y-1">
        <p class="font-bold text-primary">
          {{ currentLocale === 'de'
            ? 'Hinweis zum CARARE 2.0 Schema (Methoden & Equipment):'
            : 'CARARE 2.0 Schema Notice (Methods & Equipment):' }}
        </p>
        <p>
          {{ currentLocale === 'de'
            ? 'Angaben zur Erfassungsmethode (Photogrammetrie, SLS, TLS), zu Kameras, 3D-Scannern und Verarbeitungssoftware gehören schema-konform zur Aktivität (Activity -> consistsOf). Dieses Panel dokumentiert die technischen Eigenschaften der digitalen Ressource selbst (Dateiformat, Polygone, Texturen, Extent).'
            : 'Acquisition methods (Photogrammetry, SLS, TLS), cameras, 3D scanners and software belong schema-conformantly to Activity sub-events (Activity -> consistsOf). This panel documents the technical properties of the digital resource itself (file format, polygons, textures, extent).' }}
        </p>
      </div>
    </div>

    <!-- 1. RESSOURCEN- & ASSET-TYP -->
    <div class="mb-5 p-3.5 bg-base-200/40 rounded-xl border border-base-300">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <label class="label-text font-bold text-xs uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
          <span>🧊</span>
          <span>{{ currentLocale === 'de' ? '1. Typ der digitalen Ressource' : '1. Digital Resource Asset Type' }}</span>
          <span class="text-accent font-black">*</span>
        </label>
        <span class="text-[11px] text-base-content/50">
          {{ currentLocale === 'de' ? 'Bestimmt die abzufragenden Netz- und Geometrieparameter' : 'Determines geometry parameters' }}
        </span>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="at in ASSET_TYPES"
          :key="at.code"
          type="button"
          class="btn btn-sm gap-2 transition-all"
          :class="assetType === at.code ? 'btn-primary font-bold shadow-xs' : 'btn-ghost border border-base-300 hover:border-primary/50'"
          @click="setAssetType(at.code)"
        >
          <span>{{ at.icon }}</span>
          <span>{{ currentLocale === 'de' ? at.labelDe : at.labelEn }}</span>
        </button>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- SECTION 2A: METHODE PHOTOGRAMMETRIE                          -->
    <!-- ============================================================ -->
    <div v-if="acquisitionMethod === 'photogrammetry' || acquisitionMethod === 'hybrid'" class="p-4 bg-secondary/5 rounded-xl border border-secondary/25 mb-5">
      <div class="flex items-center justify-between mb-3">
        <div class="font-bold text-xs uppercase tracking-wider text-secondary flex items-center gap-1.5">
          <span>📷</span>
          <span>{{ currentLocale === 'de' ? 'Photogrammetrie-Aufnahme (Kamera, Sensor, Objektiv & Rohbilder)' : 'Photogrammetry Acquisition (Camera, Sensor, Lens & RAW)' }}</span>
        </div>
        <span class="badge badge-secondary badge-xs font-semibold">SfM / Bildbasiert</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
        <!-- Kamera-Modell (HECTOR Skosmos) -->
        <div class="relative">
          <label class="label py-0.5">
            <span class="label-text text-xs font-semibold flex items-center justify-between w-full">
              <span>{{ currentLocale === 'de' ? 'Kamera (HECTOR):' : 'Camera (HECTOR):' }}</span>
              <span v-if="isSearchingCamera" class="loading loading-spinner loading-xs text-secondary"></span>
            </span>
          </label>
          <input
            type="text"
            v-model="photoCamera"
            @focus="showCameraDropdown = true"
            @input="onCameraInput"
            class="input input-sm input-bordered w-full text-xs font-medium"
            :placeholder="currentLocale === 'de' ? 'HECTOR durchsuchen (z.B. Nikon Z 8)...' : 'Search HECTOR (e.g. Nikon Z 8)...'"
          />
          <!-- Camera Dropdown -->
          <div
            v-if="showCameraDropdown && (cameraSuggestions.length > 0 || isSearchingCamera)"
            class="absolute left-0 top-full mt-1 w-72 max-w-[90vw] z-[100] bg-base-100 rounded-box shadow-xl border border-base-300 max-h-56 overflow-y-auto"
          >
            <div v-if="isSearchingCamera" class="p-2.5 text-xs text-base-content/60 flex items-center gap-2">
              <span class="loading loading-spinner loading-xs text-secondary"></span>
              {{ currentLocale === 'de' ? 'Suche in HECTOR...' : 'Searching HECTOR...' }}
            </div>
            <ul v-else class="menu menu-xs p-1">
              <li v-for="sug in cameraSuggestions" :key="sug.uri">
                <a @mousedown.prevent="selectCameraSuggestion(sug)" class="flex flex-col items-start py-1.5 hover:bg-secondary/10">
                  <div class="flex items-center gap-2 w-full justify-between">
                    <span class="font-bold text-xs">{{ sug.prefLabel }}</span>
                    <span class="badge badge-secondary badge-xs text-[9px]">HECTOR</span>
                  </div>
                  <span class="text-[9px] opacity-50 truncate max-w-full font-mono">{{ sug.uri }}</span>
                </a>
              </li>
            </ul>
          </div>
          <!-- Presets -->
          <div class="flex flex-wrap items-center gap-1.5 mt-2">
            <button
              type="button"
              class="btn btn-xs btn-outline btn-accent gap-1 font-bold shadow-2xs"
              @click="openEquipmentPicker('camera')"
              :title="currentLocale === 'de' ? 'Kamera oder Gerät aus dem zentralen Pool auswählen' : 'Pick camera or equipment from central pool'"
            >
              📷 {{ currentLocale === 'de' ? 'Aus Geräte-Pool' : 'From Equipment Pool' }}
            </button>
            <button
              v-for="cam in HECTOR_CAMERAS"
              :key="cam.name"
              type="button"
              class="preset-chip"
              @click="applyCamera(cam)"
            >
              {{ cam.name }}
            </button>
          </div>
        </div>

        <!-- Sensor-Auflösung -->
        <div>
          <label class="label py-0.5">
            <span class="label-text text-xs font-semibold">
              {{ currentLocale === 'de' ? 'Sensor / Bildauflösung:' : 'Sensor / Resolution:' }}
            </span>
          </label>
          <input
            type="text"
            v-model="photoSensor"
            @input="onFieldChanged"
            class="input input-sm input-bordered w-full font-mono text-xs"
            :placeholder="currentLocale === 'de' ? 'z.B. 45.7 MP' : 'e.g. 45.7 MP'"
          />
          <div class="flex flex-wrap gap-1.5 mt-2">
            <button
              v-for="res in SENSOR_PRESETS"
              :key="res"
              type="button"
              class="preset-chip font-mono"
              @click="photoSensor = res; onFieldChanged()"
            >
              {{ res }}
            </button>
          </div>
        </div>

        <!-- Objektiv / Brennweite -->
        <div>
          <label class="label py-0.5">
            <span class="label-text text-xs font-semibold">
              {{ currentLocale === 'de' ? 'Objektiv / Brennweite:' : 'Lens / Focal Length:' }}
            </span>
          </label>
          <input
            type="text"
            v-model="photoLens"
            @input="onFieldChanged"
            class="input input-sm input-bordered w-full text-xs font-medium"
            :placeholder="currentLocale === 'de' ? 'z.B. NIKKOR Z 50mm f/1.8 S' : 'e.g. NIKKOR Z 50mm f/1.8 S'"
          />
          <div class="flex flex-wrap gap-1.5 mt-2">
            <button
              v-for="lens in LENS_PRESETS"
              :key="lens"
              type="button"
              class="preset-chip"
              @click="photoLens = lens; onFieldChanged()"
            >
              {{ lens.split(' ')[0] + ' ' + (lens.split(' ')[1] || '') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Photogrammetrie Rohbilder-Dokumentation -->
      <div class="p-3.5 bg-base-100 rounded-xl border border-secondary/20">
        <div class="font-semibold text-xs text-base-content/80 flex items-center gap-1.5 mb-2.5">
          <span>📸</span>
          <span>{{ currentLocale === 'de' ? 'Photogrammetrie-Rohbilder & Kalibrierung (RAW Datensatz)' : 'Photogrammetry RAW Image Set & Calibration' }}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label class="label py-0.5"><span class="label-text text-xs font-medium">{{ currentLocale === 'de' ? 'Rohbild-Format:' : 'RAW Image Format:' }}</span></label>
            <input
              type="text"
              v-model="photoRawFormat"
              @input="onFieldChanged"
              class="input input-sm input-bordered w-full font-mono text-xs"
              placeholder="e.g. Nikon NEF / Adobe DNG"
            />
          </div>
          <div>
            <label class="label py-0.5"><span class="label-text text-xs font-medium">{{ currentLocale === 'de' ? 'Anzahl Rohaufnahmen:' : 'RAW Image Count:' }}</span></label>
            <input
              type="text"
              v-model="photoImageCount"
              @input="onFieldChanged"
              class="input input-sm input-bordered w-full font-mono text-xs"
              placeholder="e.g. 245 Aufnahmen"
            />
          </div>
          <div>
            <label class="label py-0.5"><span class="label-text text-xs font-medium">{{ currentLocale === 'de' ? 'Farbkalibrierung:' : 'Color Calibration:' }}</span></label>
            <input
              type="text"
              v-model="photoColorTarget"
              @input="onFieldChanged"
              class="input input-sm input-bordered w-full text-xs"
              placeholder="e.g. X-Rite ColorChecker Classic"
            />
          </div>
          <div>
            <label class="label py-0.5"><span class="label-text text-xs font-medium">{{ currentLocale === 'de' ? 'Bodenauflösung (GSD):' : 'GSD Resolution:' }}</span></label>
            <input
              type="text"
              v-model="photoGsd"
              @input="onFieldChanged"
              class="input input-sm input-bordered w-full font-mono text-xs"
              placeholder="e.g. 0.15 mm/px"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- SECTION 2B: METHODE SLS (STREIFENLICHTSCANNING)               -->
    <!-- ============================================================ -->
    <div v-if="acquisitionMethod === 'sls' || acquisitionMethod === 'hybrid'" class="p-4 bg-primary/5 rounded-xl border border-primary/25 mb-5">
      <div class="flex items-center justify-between mb-3">
        <div class="font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
          <span>💡</span>
          <span>{{ currentLocale === 'de' ? 'SLS (Streifenlichtscanning / Structured Light)' : 'SLS (Structured Light Scanning)' }}</span>
        </div>
        <span class="badge badge-primary badge-xs font-semibold">Streifenlicht / Triangulation</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <!-- SLS Scanner Hardware (HECTOR) -->
        <div class="relative">
          <label class="label py-0.5">
            <span class="label-text text-xs font-semibold flex items-center justify-between w-full">
              <span>{{ currentLocale === 'de' ? 'SLS-Scanner (HECTOR):' : 'SLS Scanner (HECTOR):' }}</span>
              <span v-if="isSearchingSls" class="loading loading-spinner loading-xs text-primary"></span>
            </span>
          </label>
          <input
            type="text"
            v-model="slsScanner"
            @focus="showSlsDropdown = true"
            @input="onSlsInput"
            class="input input-sm input-bordered w-full text-xs font-medium"
            :placeholder="currentLocale === 'de' ? 'HECTOR durchsuchen (z.B. Artec Spider II, GOM ATOS)...' : 'Search HECTOR (e.g. Artec Spider)...'"
          />
          <!-- SLS Dropdown -->
          <div
            v-if="showSlsDropdown && (slsSuggestions.length > 0 || isSearchingSls)"
            class="absolute left-0 top-full mt-1 w-72 max-w-[90vw] z-[100] bg-base-100 rounded-box shadow-xl border border-base-300 max-h-56 overflow-y-auto"
          >
            <div v-if="isSearchingSls" class="p-2.5 text-xs text-base-content/60 flex items-center gap-2">
              <span class="loading loading-spinner loading-xs text-primary"></span>
              {{ currentLocale === 'de' ? 'Suche in HECTOR...' : 'Searching HECTOR...' }}
            </div>
            <ul v-else class="menu menu-xs p-1">
              <li v-for="sug in slsSuggestions" :key="sug.uri">
                <a @mousedown.prevent="selectSlsSuggestion(sug)" class="flex flex-col items-start py-1.5 hover:bg-primary/10">
                  <div class="flex items-center gap-2 w-full justify-between">
                    <span class="font-bold text-xs">{{ sug.prefLabel }}</span>
                    <span class="badge badge-primary badge-xs text-[9px]">HECTOR SLS</span>
                  </div>
                  <span class="text-[9px] opacity-50 truncate max-w-full font-mono">{{ sug.uri }}</span>
                </a>
              </li>
            </ul>
          </div>
          <!-- Presets -->
          <div class="flex flex-wrap items-center gap-1.5 mt-2">
            <button
              type="button"
              class="btn btn-xs btn-outline btn-accent gap-1 font-bold shadow-2xs"
              @click="openEquipmentPicker('camera')"
              :title="currentLocale === 'de' ? 'SLS-Scanner aus dem zentralen Pool auswählen' : 'Pick SLS scanner from central pool'"
            >
              💡 {{ currentLocale === 'de' ? 'Aus Geräte-Pool' : 'From Equipment Pool' }}
            </button>
            <button
              v-for="s in HECTOR_SLS_SCANNERS"
              :key="s.name"
              type="button"
              class="preset-chip"
              @click="applySlsScanner(s)"
            >
              {{ s.name }}
            </button>
          </div>
        </div>

        <!-- Messfeld / FOV -->
        <div>
          <label class="label py-0.5">
            <span class="label-text text-xs font-semibold">
              {{ currentLocale === 'de' ? 'Messfeld / Field of View (FOV):' : 'Field of View (FOV):' }}
            </span>
          </label>
          <input
            type="text"
            v-model="slsFov"
            @input="onFieldChanged"
            class="input input-sm input-bordered w-full text-xs font-medium"
            :placeholder="currentLocale === 'de' ? 'z.B. 180×140 mm (Nahbereich) oder 300 mm' : 'e.g. 180×140 mm'"
          />
          <div class="flex flex-wrap gap-1.5 mt-2">
            <button
              v-for="fov in ['90×70 mm (Makro)', '180×140 mm', '300×200 mm', '500 mm']"
              :key="fov"
              type="button"
              class="preset-chip font-mono"
              @click="slsFov = fov; onFieldChanged()"
            >
              {{ fov.split(' ')[0] }}
            </button>
          </div>
        </div>

        <!-- 3D-Punktgenauigkeit -->
        <div>
          <label class="label py-0.5">
            <span class="label-text text-xs font-semibold">
              {{ currentLocale === 'de' ? '3D-Punktgenauigkeit:' : '3D Point Accuracy:' }}
            </span>
          </label>
          <input
            type="text"
            v-model="slsAccuracy"
            @input="onFieldChanged"
            class="input input-sm input-bordered w-full font-mono text-xs"
            placeholder="e.g. 0.05 mm"
          />
          <div class="flex flex-wrap gap-1.5 mt-2">
            <button
              v-for="acc in ['0.02 mm', '0.05 mm', '0.1 mm', '0.2 mm']"
              :key="acc"
              type="button"
              class="preset-chip font-mono"
              @click="slsAccuracy = acc; onFieldChanged()"
            >
              {{ acc }}
            </button>
          </div>
        </div>
      </div>

      <!-- WICHTIG: SLS Rohbilder & Texturaufnahmen -->
      <div class="p-3 bg-base-100 rounded-lg border border-primary/20">
        <div class="flex items-center justify-between mb-2">
          <div class="font-semibold text-xs text-base-content/80 flex items-center gap-1.5">
            <span>🖼️</span>
            <span>{{ currentLocale === 'de' ? 'SLS-Rohbilder & Textur-Aufnahmen (Bilderfassung beim Streifenlicht)' : 'SLS RAW Images & Texture Acquisition' }}</span>
          </div>
          <label class="cursor-pointer flex items-center gap-1.5 text-xs">
            <input type="checkbox" v-model="slsHasRawImages" @change="onFieldChanged" class="checkbox checkbox-xs checkbox-primary" />
            <span class="font-medium">{{ currentLocale === 'de' ? 'Rohbilder vorhanden' : 'RAW images present' }}</span>
          </label>
        </div>

        <div v-if="slsHasRawImages" class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div>
            <label class="label py-0.5"><span class="label-text text-[11px] font-medium">{{ currentLocale === 'de' ? 'Kamerasystem für Textur:' : 'Texture Camera System:' }}</span></label>
            <input
              type="text"
              v-model="slsCameraSystem"
              @input="onFieldChanged"
              class="input input-xs input-bordered w-full text-xs"
              placeholder="e.g. Integrierte Farbkamera / Externe DSLR"
            />
          </div>
          <div>
            <label class="label py-0.5"><span class="label-text text-[11px] font-medium">{{ currentLocale === 'de' ? 'Anzahl Textur-/Streifen-Rohbilder:' : 'Texture / RAW Shots Count:' }}</span></label>
            <input
              type="text"
              v-model="slsRawCount"
              @input="onFieldChanged"
              class="input input-xs input-bordered w-full font-mono text-xs"
              placeholder="e.g. 60 Texturaufnahmen"
            />
          </div>
          <div>
            <label class="label py-0.5"><span class="label-text text-[11px] font-medium">{{ currentLocale === 'de' ? 'Rohbild- / Projekt-Format:' : 'RAW / Project Format:' }}</span></label>
            <input
              type="text"
              v-model="slsRawFormat"
              @input="onFieldChanged"
              class="input input-xs input-bordered w-full font-mono text-xs"
              placeholder="e.g. TIFF 16-Bit / Artec Project (.obp)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- SECTION 2C: METHODE TLS (TERRESTRISCHES LASERSCANNING)        -->
    <!-- ============================================================ -->
    <div v-if="acquisitionMethod === 'tls' || acquisitionMethod === 'hybrid'" class="p-4 bg-accent/5 rounded-xl border border-accent/25 mb-5">
      <div class="flex items-center justify-between mb-3">
        <div class="font-bold text-xs uppercase tracking-wider text-accent flex items-center gap-1.5">
          <span>🌐</span>
          <span>{{ currentLocale === 'de' ? 'TLS (Terrestrisches Laserscanning / LiDAR)' : 'TLS (Terrestrial Laser Scanning / LiDAR)' }}</span>
        </div>
        <span class="badge badge-accent badge-xs font-semibold">LiDAR / Phasenvergleich / ToF</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <!-- TLS Scanner Hardware (HECTOR) -->
        <div class="relative">
          <label class="label py-0.5">
            <span class="label-text text-xs font-semibold flex items-center justify-between w-full">
              <span>{{ currentLocale === 'de' ? 'TLS-Scanner (HECTOR):' : 'TLS Scanner (HECTOR):' }}</span>
              <span v-if="isSearchingTls" class="loading loading-spinner loading-xs text-accent"></span>
            </span>
          </label>
          <input
            type="text"
            v-model="tlsScanner"
            @focus="showTlsDropdown = true"
            @input="onTlsInput"
            class="input input-sm input-bordered w-full text-xs font-medium"
            :placeholder="currentLocale === 'de' ? 'HECTOR durchsuchen (z.B. Faro Focus S350, Leica RTC360)...' : 'Search HECTOR (e.g. Faro Focus S350)...'"
          />
          <!-- TLS Dropdown -->
          <div
            v-if="showTlsDropdown && (tlsSuggestions.length > 0 || isSearchingTls)"
            class="absolute left-0 top-full mt-1 w-72 max-w-[90vw] z-[100] bg-base-100 rounded-box shadow-xl border border-base-300 max-h-56 overflow-y-auto"
          >
            <div v-if="isSearchingTls" class="p-2.5 text-xs text-base-content/60 flex items-center gap-2">
              <span class="loading loading-spinner loading-xs text-accent"></span>
              {{ currentLocale === 'de' ? 'Suche in HECTOR...' : 'Searching HECTOR...' }}
            </div>
            <ul v-else class="menu menu-xs p-1">
              <li v-for="sug in tlsSuggestions" :key="sug.uri">
                <a @mousedown.prevent="selectTlsSuggestion(sug)" class="flex flex-col items-start py-1.5 hover:bg-accent/10">
                  <div class="flex items-center gap-2 w-full justify-between">
                    <span class="font-bold text-xs">{{ sug.prefLabel }}</span>
                    <span class="badge badge-accent badge-xs text-[9px]">HECTOR TLS</span>
                  </div>
                  <span class="text-[9px] opacity-50 truncate max-w-full font-mono">{{ sug.uri }}</span>
                </a>
              </li>
            </ul>
          </div>
          <!-- Presets -->
          <div class="flex flex-wrap items-center gap-1.5 mt-2">
            <button
              type="button"
              class="btn btn-xs btn-outline btn-accent gap-1 font-bold shadow-2xs"
              @click="openEquipmentPicker('camera')"
              :title="currentLocale === 'de' ? 'TLS-Scanner aus dem zentralen Pool auswählen' : 'Pick TLS scanner from central pool'"
            >
              💡 {{ currentLocale === 'de' ? 'Aus Geräte-Pool' : 'From Equipment Pool' }}
            </button>
            <button
              v-for="s in HECTOR_TLS_SCANNERS"
              :key="s.name"
              type="button"
              class="preset-chip"
              @click="applyTlsScanner(s)"
            >
              {{ s.name }}
            </button>
          </div>
        </div>

        <!-- Scanpositionen / Standpunkte -->
        <div>
          <label class="label py-0.5">
            <span class="label-text text-xs font-semibold">
              {{ currentLocale === 'de' ? 'Anzahl Scanpositionen / Stationen:' : 'Scan Positions / Stations:' }}
            </span>
          </label>
          <input
            type="text"
            v-model="tlsPositions"
            @input="onFieldChanged"
            class="input input-sm input-bordered w-full font-mono text-xs"
            placeholder="e.g. 14 Standpunkte"
          />
          <div class="flex flex-wrap gap-1.5 mt-2">
            <button
              v-for="pos in ['6 Stationen', '14 Stationen', '28 Stationen', '45 Stationen']"
              :key="pos"
              type="button"
              class="preset-chip font-mono"
              @click="tlsPositions = pos; onFieldChanged()"
            >
              {{ pos.split(' ')[0] }}
            </button>
          </div>
        </div>

        <!-- Scanauflösung & Messgenauigkeit -->
        <div>
          <label class="label py-0.5">
            <span class="label-text text-xs font-semibold">
              {{ currentLocale === 'de' ? 'Messgenauigkeit / Reichweite:' : 'Measurement Accuracy / Range:' }}
            </span>
          </label>
          <input
            type="text"
            v-model="tlsAccuracy"
            @input="onFieldChanged"
            class="input input-sm input-bordered w-full font-mono text-xs"
            placeholder="e.g. 1.0 mm @ 10m"
          />
          <div class="flex flex-wrap gap-1.5 mt-2">
            <button
              v-for="acc in ['1.0 mm @ 10m', '1.5 mm @ 10m', '2.0 mm @ 25m']"
              :key="acc"
              type="button"
              class="preset-chip font-mono"
              @click="tlsAccuracy = acc; onFieldChanged()"
            >
              {{ acc.split(' ')[0] }}
            </button>
          </div>
        </div>
      </div>

      <!-- WICHTIG: TLS Rohbilder & HDR-Panoramen zur Kolorierung -->
      <div class="p-3 bg-base-100 rounded-lg border border-accent/20">
        <div class="flex items-center justify-between mb-2">
          <div class="font-semibold text-xs text-base-content/80 flex items-center gap-1.5">
            <span>🌅</span>
            <span>{{ currentLocale === 'de' ? 'TLS-Rohbilder & HDR-Panoramen (Farbkolorierung beim Laserscan)' : 'TLS RAW Images & HDR Panoramas (True Color)' }}</span>
          </div>
          <label class="cursor-pointer flex items-center gap-1.5 text-xs">
            <input type="checkbox" v-model="tlsHasRawImages" @change="onFieldChanged" class="checkbox checkbox-xs checkbox-accent" />
            <span class="font-medium">{{ currentLocale === 'de' ? 'HDR-Rohbilder vorhanden' : 'HDR RAW images present' }}</span>
          </label>
        </div>

        <div v-if="tlsHasRawImages" class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div>
            <label class="label py-0.5"><span class="label-text text-[11px] font-medium">{{ currentLocale === 'de' ? 'Panoramakamera-System:' : 'Panorama Camera System:' }}</span></label>
            <input
              type="text"
              v-model="tlsCameraSystem"
              @input="onFieldChanged"
              class="input input-xs input-bordered w-full text-xs"
              placeholder="e.g. Faro HDR Panorama-System / Leica 36 MP"
            />
          </div>
          <div>
            <label class="label py-0.5"><span class="label-text text-[11px] font-medium">{{ currentLocale === 'de' ? 'Anzahl HDR-Panoramen / Belichtungsreihen:' : 'HDR Panoramas Count:' }}</span></label>
            <input
              type="text"
              v-model="tlsRawCount"
              @input="onFieldChanged"
              class="input input-xs input-bordered w-full font-mono text-xs"
              placeholder="e.g. 14 HDR-Panoramen (70 Rohbilder)"
            />
          </div>
          <div>
            <label class="label py-0.5"><span class="label-text text-[11px] font-medium">{{ currentLocale === 'de' ? 'Kolorierungs-Modus:' : 'Coloration Mode:' }}</span></label>
            <input
              type="text"
              v-model="tlsColorMode"
              @input="onFieldChanged"
              class="input input-xs input-bordered w-full text-xs"
              placeholder="e.g. Fotorealistische RGB-Punktwolke (True Color)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- SECTION 3: DATEIFORMATE (CARARE <format>)                    -->
    <!-- ============================================================ -->
    <div class="mb-5 p-3.5 bg-base-200/30 rounded-xl border border-base-200">
      <div class="flex items-center justify-between mb-2">
        <label class="label-text font-bold text-xs uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
          <span>📁</span>
          <span>{{ currentLocale === 'de' ? '2. Dateiformate (MIME-Types & HECTOR 3D-Formate)' : '2. File Formats (MIME Types & HECTOR 3D)' }}</span>
          <span class="text-accent font-black">*</span>
        </label>
        <span class="text-[11px] text-base-content/50">
          {{ currentLocale === 'de' ? 'Klicken zum Hinzufügen / Entfernen' : 'Click to toggle' }}
        </span>
      </div>

      <div class="space-y-2 mb-2.5">
        <!-- 3D Formate -->
        <div class="flex flex-wrap items-center gap-1.5">
          <span class="text-[11px] font-bold text-base-content/50 w-24">3D-Modelle:</span>
          <button
            v-for="fmt in FORMATS_3D"
            :key="fmt.code"
            type="button"
            class="btn btn-xs rounded-lg transition-all"
            :class="isFormatSelected(fmt.mime) || isFormatSelected(fmt.label)
              ? 'btn-primary font-bold shadow-xs' 
              : 'btn-ghost border border-base-300 hover:border-primary/60 font-normal'"
            @click="toggleFormat(fmt)"
          >
            <span>{{ fmt.icon }}</span>
            <span>{{ fmt.label }}</span>
            <span class="text-[10px] opacity-60 font-mono">({{ fmt.ext }})</span>
          </button>
        </div>

        <!-- Punktwolken-Formate -->
        <div class="flex flex-wrap items-center gap-1.5">
          <span class="text-[11px] font-bold text-base-content/50 w-24">Punktwolken:</span>
          <button
            v-for="fmt in FORMATS_POINTCLOUD"
            :key="fmt.code"
            type="button"
            class="btn btn-xs rounded-lg transition-all"
            :class="isFormatSelected(fmt.mime) || isFormatSelected(fmt.label)
              ? 'btn-accent text-accent-content font-bold shadow-xs' 
              : 'btn-ghost border border-base-300 hover:border-accent/60 font-normal'"
            @click="toggleFormat(fmt)"
          >
            <span>{{ fmt.icon }}</span>
            <span>{{ fmt.label }}</span>
            <span class="text-[10px] opacity-60 font-mono">({{ fmt.ext }})</span>
          </button>
        </div>

        <!-- RAW-Bilder & Texturen -->
        <div class="flex flex-wrap items-center gap-1.5">
          <span class="text-[11px] font-bold text-base-content/50 w-24">RAW & Textur:</span>
          <button
            v-for="fmt in FORMATS_RAW_2D"
            :key="fmt.code"
            type="button"
            class="btn btn-xs rounded-lg transition-all"
            :class="isFormatSelected(fmt.mime) || isFormatSelected(fmt.label)
              ? 'btn-secondary text-secondary-content font-bold shadow-xs' 
              : 'btn-ghost border border-base-300 hover:border-secondary/60 font-normal'"
            @click="toggleFormat(fmt)"
          >
            <span>{{ fmt.icon }}</span>
            <span>{{ fmt.label }}</span>
            <span class="text-[10px] opacity-60 font-mono">({{ fmt.ext }})</span>
          </button>
        </div>
      </div>

      <!-- Current Selected Formats List & Custom Input -->
      <div class="flex flex-wrap items-center gap-2 p-2.5 bg-base-100 rounded-xl border border-base-300/80">
        <span class="text-xs font-semibold text-base-content/60 px-1">
          {{ currentLocale === 'de' ? 'Gewählte Formate:' : 'Selected formats:' }}
        </span>

        <div v-for="(f, fIdx) in formats" :key="fIdx" class="badge badge-neutral gap-1.5 py-2.5 px-2.5">
          <span class="font-mono text-xs">{{ f }}</span>
          <button type="button" class="hover:text-error text-xs ml-1" @click="removeFormat(fIdx)">✕</button>
        </div>

        <span v-if="!formats || formats.length === 0" class="text-xs italic text-base-content/40">
          {{ currentLocale === 'de' ? 'Noch keine Formate ausgewählt' : 'No formats selected' }}
        </span>

        <!-- Custom Add Input -->
        <div class="ml-auto flex items-center gap-1">
          <input
            type="text"
            v-model="customFormatInput"
            @keydown.enter.prevent="addCustomFormat"
            class="input input-xs input-bordered w-36 font-mono text-xs"
            :placeholder="currentLocale === 'de' ? 'Anderes Format...' : 'Other format...'"
          />
          <button type="button" class="btn btn-xs btn-primary btn-square" @click="addCustomFormat">+</button>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- SECTION 4: 3D-GEOMETRIE & NETZ-METRIKEN                      -->
    <!-- ============================================================ -->
    <div v-if="assetType === 'mesh' || assetType === 'pointcloud'" class="p-4 bg-base-200/40 rounded-xl border border-base-200 mb-5">
      <div class="font-bold text-xs uppercase tracking-wider text-base-content/70 flex items-center gap-1.5 mb-3">
        <span>🔺</span>
        <span>{{ currentLocale === 'de' ? '3. 3D-Geometrie, Netz-Metriken & Texturen' : '3. 3D Geometry, Mesh Metrics & Textures' }}</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <!-- Polygonanzahl / Dreiecke -->
        <div v-if="assetType === 'mesh'">
          <label class="label py-0.5">
            <span class="label-text text-xs font-semibold">
              {{ currentLocale === 'de' ? 'Polygonanzahl / Dreiecke (Faces):' : 'Polygon / Triangle Count:' }}
            </span>
          </label>
          <input
            type="text"
            v-model="polygonCount"
            @input="onFieldChanged"
            class="input input-sm input-bordered w-full font-mono text-xs"
            placeholder="e.g. 15.8 Mio. Faces"
          />
          <div class="flex flex-wrap gap-1.5 mt-2">
            <button
              v-for="p in ['50.000 Faces (Web)', '500.000 Faces', '2.5 Mio. Faces', '15.8 Mio. Faces']"
              :key="p"
              type="button"
              class="preset-chip font-mono"
              @click="polygonCount = p; onFieldChanged()"
            >
              {{ p.split(' ')[0] }}
            </button>
          </div>
        </div>

        <!-- Vertices / Eckpunkte oder Punktwolkenanzahl -->
        <div>
          <label class="label py-0.5">
            <span class="label-text text-xs font-semibold">
              {{ assetType === 'pointcloud' ? (currentLocale === 'de' ? 'Punktanzahl (Points):' : 'Point Count:') : (currentLocale === 'de' ? 'Eckpunkte (Vertices):' : 'Vertex Count:') }}
            </span>
          </label>
          <input
            type="text"
            v-model="vertexCount"
            @input="onFieldChanged"
            class="input input-sm input-bordered w-full font-mono text-xs"
            :placeholder="assetType === 'pointcloud' ? 'e.g. 480 Mio. Punkte' : 'e.g. 7.9 Mio. Vertices'"
          />
        </div>

        <!-- Modellkategorie -->
        <div>
          <label class="label py-0.5">
            <span class="label-text text-xs font-semibold">
              {{ currentLocale === 'de' ? '3D-Modellkategorie:' : '3D Model Category:' }}
            </span>
          </label>
          <select
            v-model="meshCategory"
            @change="onFieldChanged"
            class="select select-sm select-bordered w-full text-xs"
          >
            <option value="High-Poly Master Mesh">{{ currentLocale === 'de' ? 'High-Poly Master (Archiv / Forschung)' : 'High-Poly Master (Archival / Research)' }}</option>
            <option value="Low-Poly Real-Time VR Mesh">{{ currentLocale === 'de' ? 'Low-Poly Real-Time (VR / WebGL / Echtzeit)' : 'Low-Poly Real-Time (VR / WebGL)' }}</option>
            <option value="Watertight Solid">{{ currentLocale === 'de' ? 'Wasserdichtes Netz (3D-Druck / CAD)' : 'Watertight Solid (3D Print / CAD)' }}</option>
            <option value="Dense Point Cloud">{{ currentLocale === 'de' ? 'Dichte Punktwolke (Point Cloud)' : 'Dense Point Cloud' }}</option>
          </select>
        </div>
      </div>

      <!-- Texturen & PBR (nur bei Mesh) -->
      <div v-if="assetType === 'mesh'" class="pt-3 border-t border-base-300">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="label py-0.5"><span class="label-text text-xs font-semibold">{{ currentLocale === 'de' ? 'Texturauflösung:' : 'Texture Resolution:' }}</span></label>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="res in TEXTURE_RESOLUTIONS"
                :key="res.label"
                type="button"
                class="btn btn-xs rounded-lg"
                :class="textureResolution === res.val ? 'btn-secondary font-bold' : 'btn-ghost border border-base-300'"
                @click="textureResolution = res.val; onFieldChanged()"
              >
                {{ res.label }}
              </button>
            </div>
          </div>
          <div>
            <label class="label py-0.5"><span class="label-text text-xs font-semibold">{{ currentLocale === 'de' ? 'PBR-Materialkarten:' : 'PBR Texture Maps:' }}</span></label>
            <div class="flex flex-wrap gap-1.5">
              <label
                v-for="map in PBR_MAPS"
                :key="map.code"
                class="preset-chip"
                :class="selectedMaps.includes(map.code) ? 'ring-2 ring-primary bg-primary/15 font-bold text-primary' : ''"
              >
                <input
                  type="checkbox"
                  :value="map.code"
                  v-model="selectedMaps"
                  @change="onFieldChanged"
                  class="checkbox checkbox-xs checkbox-primary hidden"
                />
                <span>{{ selectedMaps.includes(map.code) ? '✓' : '+' }}</span>
                <span>{{ map.label }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- SECTION 4B: METROLOGIE — GENAUIGKEIT & AUFLÖSUNG (DAP/SCHEMA) -->
    <!-- ============================================================ -->
    <div class="p-5 bg-info/5 rounded-2xl border border-info/25 mb-5">
      <div class="flex flex-wrap items-start justify-between gap-3 mb-4 pb-3 border-b border-info/20">
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <span class="font-bold text-sm uppercase tracking-wider text-info flex items-center gap-1.5">
              <span>📏</span>
              <span>{{ currentLocale === 'de' ? '4. Metrologie: Genauigkeit & Auflösung' : '4. Metrology: Accuracy & Resolution' }}</span>
            </span>
            <span class="px-2 py-0.5 rounded-md bg-info/15 text-info font-mono text-[11px] font-semibold">
              HERMES-DAP &amp; CARARE &lt;extent&gt;
            </span>
          </div>
          <p class="text-xs text-base-content/70 leading-relaxed max-w-3xl">
            {{ currentLocale === 'de'
              ? 'Dedizierte Felder für messtechnische Genauigkeit und räumliche/optische Auflösung. Werden im HERMES-DAP XML als <accuracy> und <resolution> sowie im 100% CARARE-konformen XML als wiederholte <extent>- und <note>-Elemente ausgegeben.'
              : 'Dedicated fields for metrological accuracy and spatial/optical resolution. Exported as <accuracy> and <resolution> in Extended HERMES-DAP XML, and as repeated <extent> and <note> elements in 100% CARARE-compliant XML.' }}
          </p>
        </div>
      </div>

      <!-- Unterbereich A: Genauigkeit (Accuracy) -->
      <div class="mb-6" data-xml-tag="accuracy">
        <div class="text-xs font-bold text-base-content/85 mb-3 flex flex-wrap items-center gap-2">
          <span class="px-2 py-0.5 rounded bg-info text-info-content font-mono text-[11px]">A</span>
          <span class="text-sm">{{ currentLocale === 'de' ? 'Genauigkeit – Messtechnische Präzision & Kalibrierung' : 'Accuracy – Metrological Precision & Calibration' }}</span>
          <code class="text-[11px] font-mono px-2 py-0.5 rounded bg-base-200 text-info">&lt;accuracy&gt;</code>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- 3D-Punktgenauigkeit -->
          <div class="bg-base-100 p-4 rounded-xl border border-base-300 shadow-2xs flex flex-col justify-between" data-xml-tag="pointAccuracy">
            <div>
              <div class="flex items-start justify-between gap-2 mb-1">
                <span class="text-xs font-bold text-base-content leading-snug">
                  {{ currentLocale === 'de' ? '3D-Punktgenauigkeit' : '3D Point Accuracy' }}
                </span>
                <code class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-info/10 text-info shrink-0">&lt;pointAccuracy&gt;</code>
              </div>
              <p class="text-[11px] text-base-content/60 mb-2.5 leading-relaxed">
                {{ currentLocale === 'de'
                  ? 'Maximale Einzelpunkt-Abweichung des Sensors im Messvolumen (z.B. nach VDI/VDE 2634).'
                  : 'Maximum single-point deviation of the sensor within the measuring volume (e.g. per VDI/VDE 2634).' }}
              </p>
            </div>
            <div>
              <input
                type="text"
                v-model="accuracyPoint"
                @input="onFieldChanged"
                class="input input-sm input-bordered w-full font-mono text-xs"
                placeholder="z.B. 0.05 mm"
              />
              <div class="flex flex-wrap gap-1.5 mt-2">
                <button
                  v-for="preset in ['0.02 mm', '0.05 mm', '0.1 mm', '1.0 mm @ 10m']"
                  :key="preset"
                  type="button"
                  class="preset-chip font-mono"
                  @click="accuracyPoint = preset; slsAccuracy = preset; onFieldChanged()"
                >
                  {{ preset }}
                </button>
              </div>
            </div>
          </div>

          <!-- Registrierungsfehler / RMSE -->
          <div class="bg-base-100 p-4 rounded-xl border border-base-300 shadow-2xs flex flex-col justify-between" data-xml-tag="registrationRmse">
            <div>
              <div class="flex items-start justify-between gap-2 mb-1">
                <span class="text-xs font-bold text-base-content leading-snug">
                  {{ currentLocale === 'de' ? 'Registrierungsfehler / RMSE' : 'Registration Error / RMSE' }}
                </span>
                <code class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-info/10 text-info shrink-0">&lt;registrationRmse&gt;</code>
              </div>
              <p class="text-[11px] text-base-content/60 mb-2.5 leading-relaxed">
                {{ currentLocale === 'de'
                  ? 'Root-Mean-Square-Error der globalen Scan-Registrierung (ICP) bzw. Bündelblockausgleichung.'
                  : 'Root-Mean-Square Error of global scan registration (ICP) or bundle adjustment reprojection error.' }}
              </p>
            </div>
            <div>
              <input
                type="text"
                v-model="accuracyRmse"
                @input="onFieldChanged"
                class="input input-sm input-bordered w-full font-mono text-xs"
                placeholder="z.B. 0.018 mm ICP-RMSE (0.32 px)"
              />
              <div class="flex flex-wrap gap-1.5 mt-2">
                <button
                  v-for="preset in ['0.02 mm ICP-RMSE', '0.35 px Reproj.-Error', '0.05 mm RMSE', '1.2 mm Cloud-to-Cloud']"
                  :key="preset"
                  type="button"
                  class="preset-chip font-mono"
                  @click="accuracyRmse = preset; onFieldChanged()"
                >
                  {{ preset }}
                </button>
              </div>
            </div>
          </div>

          <!-- Volumetrische Genauigkeit -->
          <div class="bg-base-100 p-4 rounded-xl border border-base-300 shadow-2xs flex flex-col justify-between" data-xml-tag="volumetricAccuracy">
            <div>
              <div class="flex items-start justify-between gap-2 mb-1">
                <span class="text-xs font-bold text-base-content leading-snug">
                  {{ currentLocale === 'de' ? 'Volumetrische Genauigkeit' : 'Volumetric Accuracy' }}
                </span>
                <code class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-info/10 text-info shrink-0">&lt;volumetricAccuracy&gt;</code>
              </div>
              <p class="text-[11px] text-base-content/60 mb-2.5 leading-relaxed">
                {{ currentLocale === 'de'
                  ? 'Längenmessabweichung über die Gesamtausdehnung des Objekts (z.B. mm pro Meter Objektlänge).'
                  : 'Length measurement error across total object extent (e.g. mm per meter of object length).' }}
              </p>
            </div>
            <div>
              <input
                type="text"
                v-model="accuracyVolumetric"
                @input="onFieldChanged"
                class="input input-sm input-bordered w-full font-mono text-xs"
                placeholder="z.B. 0.05 mm + 0.3 mm/m"
              />
              <div class="flex flex-wrap gap-1.5 mt-2">
                <button
                  v-for="preset in ['0.05 mm + 0.3 mm/m', '0.1 mm + 0.3 mm/m', '± 0.15 mm auf 1.2 m']"
                  :key="preset"
                  type="button"
                  class="preset-chip font-mono"
                  @click="accuracyVolumetric = preset; onFieldChanged()"
                >
                  {{ preset }}
                </button>
              </div>
            </div>
          </div>

          <!-- Kalibrierungsmethode & Norm -->
          <div class="bg-base-100 p-4 rounded-xl border border-base-300 shadow-2xs flex flex-col justify-between" data-xml-tag="calibrationMethod">
            <div>
              <div class="flex items-start justify-between gap-2 mb-1">
                <span class="text-xs font-bold text-base-content leading-snug">
                  {{ currentLocale === 'de' ? 'Kalibrierung & Referenzstandard' : 'Calibration & Reference Standard' }}
                </span>
                <code class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-info/10 text-info shrink-0">&lt;calibrationMethod&gt;</code>
              </div>
              <p class="text-[11px] text-base-content/60 mb-2.5 leading-relaxed">
                {{ currentLocale === 'de'
                  ? 'Verwendete Prüfplaketten, Maßstäbe, Kalibrierstandards (VDI/VDE 2634) und Farbtargets.'
                  : 'Calibration plates, scale bars, metrological standards (VDI/VDE 2634), and color targets used.' }}
              </p>
            </div>
            <div>
              <input
                type="text"
                v-model="accuracyCalibration"
                @input="onFieldChanged"
                class="input input-sm input-bordered w-full text-xs"
                placeholder="z.B. VDI/VDE 2634, Invar-Maßstab, ColorChecker"
              />
              <div class="flex flex-wrap gap-1.5 mt-2">
                <button
                  v-for="preset in ['VDI/VDE 2634 + ColorChecker', 'Invar-Maßstab + Kalibrierplatte', 'Werkskalibrierung + Target']"
                  :key="preset"
                  type="button"
                  class="preset-chip"
                  @click="accuracyCalibration = preset; onFieldChanged()"
                >
                  {{ preset }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Unterbereich B: Auflösung (Resolution) -->
      <div data-xml-tag="resolution">
        <div class="text-xs font-bold text-base-content/85 mb-3 flex flex-wrap items-center gap-2">
          <span class="px-2 py-0.5 rounded bg-secondary text-secondary-content font-mono text-[11px]">B</span>
          <span class="text-sm">{{ currentLocale === 'de' ? 'Auflösung – Geometrische & Optische Abtastdichte' : 'Resolution – Geometric & Optical Sampling Density' }}</span>
          <code class="text-[11px] font-mono px-2 py-0.5 rounded bg-base-200 text-secondary">&lt;resolution&gt;</code>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Räumliche 3D-Auflösung (Punktabstand) -->
          <div class="bg-base-100 p-4 rounded-xl border border-base-300 shadow-2xs flex flex-col justify-between" data-xml-tag="spatialResolution">
            <div>
              <div class="flex items-start justify-between gap-2 mb-1">
                <span class="text-xs font-bold text-base-content leading-snug">
                  {{ currentLocale === 'de' ? 'Räumliche 3D-Auflösung (Punktabstand)' : '3D Spatial Resolution (Point Spacing)' }}
                </span>
                <code class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary/10 text-secondary shrink-0">&lt;spatialResolution&gt;</code>
              </div>
              <p class="text-[11px] text-base-content/60 mb-2.5 leading-relaxed">
                {{ currentLocale === 'de'
                  ? 'Kleinster aufgelöster 3D-Punktabstand (Point Spacing) bzw. Kantenlänge des Polygonnetzes.'
                  : 'Smallest resolved 3D point spacing or triangle edge length on the mesh surface.' }}
              </p>
            </div>
            <div>
              <input
                type="text"
                v-model="resolutionSpatial"
                @input="onFieldChanged"
                class="input input-sm input-bordered w-full font-mono text-xs"
                placeholder="z.B. 0.1 mm Punktabstand"
              />
              <div class="flex flex-wrap gap-1.5 mt-2">
                <button
                  v-for="preset in ['0.05 mm', '0.1 mm', '0.25 mm', '1.5 mm @ 10m']"
                  :key="preset"
                  type="button"
                  class="preset-chip font-mono"
                  @click="resolutionSpatial = preset; onFieldChanged()"
                >
                  {{ preset }}
                </button>
              </div>
            </div>
          </div>

          <!-- Ground Sampling Distance (GSD) -->
          <div class="bg-base-100 p-4 rounded-xl border border-base-300 shadow-2xs flex flex-col justify-between" data-xml-tag="gsd">
            <div>
              <div class="flex items-start justify-between gap-2 mb-1">
                <span class="text-xs font-bold text-base-content leading-snug">
                  {{ currentLocale === 'de' ? 'Objekt-Pixelauflösung (GSD)' : 'Ground Sampling Distance (GSD)' }}
                </span>
                <code class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary/10 text-secondary shrink-0">&lt;gsd&gt;</code>
              </div>
              <p class="text-[11px] text-base-content/60 mb-2.5 leading-relaxed">
                {{ currentLocale === 'de'
                  ? 'Physische Größe eines projizierten Kamerapixels auf der Objektoberfläche in mm/px.'
                  : 'Physical footprint of a single camera pixel projected onto the object surface in mm/px.' }}
              </p>
            </div>
            <div>
              <input
                type="text"
                v-model="photoGsd"
                @input="onFieldChanged"
                class="input input-sm input-bordered w-full font-mono text-xs"
                placeholder="z.B. 0.12 mm/px"
              />
              <div class="flex flex-wrap gap-1.5 mt-2">
                <button
                  v-for="preset in ['0.05 mm/px', '0.12 mm/px', '< 0.15 mm/px', '0.30 mm/px']"
                  :key="preset"
                  type="button"
                  class="preset-chip font-mono"
                  @click="photoGsd = preset; onFieldChanged()"
                >
                  {{ preset }}
                </button>
              </div>
            </div>
          </div>

          <!-- UV-Texturauflösung -->
          <div class="bg-base-100 p-4 rounded-xl border border-base-300 shadow-2xs flex flex-col justify-between" data-xml-tag="textureResolution">
            <div>
              <div class="flex items-start justify-between gap-2 mb-1">
                <span class="text-xs font-bold text-base-content leading-snug">
                  {{ currentLocale === 'de' ? 'UV-Texturauflösung' : 'UV Texture Resolution' }}
                </span>
                <code class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary/10 text-secondary shrink-0">&lt;textureResolution&gt;</code>
              </div>
              <p class="text-[11px] text-base-content/60 mb-2.5 leading-relaxed">
                {{ currentLocale === 'de'
                  ? 'Abmessungen der gebackenen Textur-Atlanten (Albedo, Normal, Roughness, AO) in Pixeln.'
                  : 'Dimensions of baked UV texture atlases (Albedo, Normal, Roughness, AO) in pixels.' }}
              </p>
            </div>
            <div>
              <input
                type="text"
                v-model="textureResolution"
                @input="onFieldChanged"
                class="input input-sm input-bordered w-full font-mono text-xs"
                placeholder="z.B. 8192×8192 px (8K)"
              />
              <div class="flex flex-wrap gap-1.5 mt-2">
                <button
                  v-for="res in TEXTURE_RESOLUTIONS"
                  :key="res.label"
                  type="button"
                  class="preset-chip font-mono"
                  @click="textureResolution = res.val; onFieldChanged()"
                >
                  {{ res.label }}
                </button>
              </div>
            </div>
          </div>

          <!-- Optische Sensorauflösung -->
          <div class="bg-base-100 p-4 rounded-xl border border-base-300 shadow-2xs flex flex-col justify-between" data-xml-tag="sensorResolution">
            <div>
              <div class="flex items-start justify-between gap-2 mb-1">
                <span class="text-xs font-bold text-base-content leading-snug">
                  {{ currentLocale === 'de' ? 'Optische Sensorauflösung' : 'Optical Sensor Resolution' }}
                </span>
                <code class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary/10 text-secondary shrink-0">&lt;sensorResolution&gt;</code>
              </div>
              <p class="text-[11px] text-base-content/60 mb-2.5 leading-relaxed">
                {{ currentLocale === 'de'
                  ? 'Native Auflösung des bildgebenden Kamerasensors bzw. der Streifenlicht-Messkamera.'
                  : 'Native resolution of the imaging camera sensor or structured-light measurement camera.' }}
              </p>
            </div>
            <div>
              <input
                type="text"
                v-model="photoSensor"
                @input="onFieldChanged"
                class="input input-sm input-bordered w-full font-mono text-xs"
                placeholder="z.B. 45.7 MP"
              />
              <div class="flex flex-wrap gap-1.5 mt-2">
                <button
                  v-for="res in SENSOR_PRESETS"
                  :key="res"
                  type="button"
                  class="preset-chip font-mono"
                  @click="photoSensor = res; onFieldChanged()"
                >
                  {{ res }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- HINWEIS: SOFTWARE & EQUIPMENT GEHÖREN ZUR AKTIVITÄT          -->
    <!-- ============================================================ -->
    <div class="p-4 bg-info/10 border border-info/30 rounded-2xl mb-5 flex items-start gap-3">
      <span class="text-2xl shrink-0">ℹ️</span>
      <div class="text-xs space-y-1">
        <span class="font-bold text-info-content text-sm block">
          {{ currentLocale === 'de' ? 'Software & Aufnahme-Equipment gehören zur Aktivität (Activity)' : 'Software & Acquisition Equipment belong to Activity' }}
        </span>
        <p class="text-base-content/75 leading-relaxed">
          {{ currentLocale === 'de'
            ? 'Gemäß CARARE 2.0.6 Schema wird eingesetzte Software (z.B. RealityCapture, Artec Studio, Blender) und Hardware (Kameras, 3D-Scanner) nicht in der Digitalen Ressource erfasst, sondern als Teilschritt (<consistsOf> / <equipment>) im Modul „Aktivität / Kampagne“. Die Digitale Ressource beschreibt ausschließlich das fertige Datenprodukt (Geometrie, Texturen, Genauigkeit, Bounding Box, Extent).'
            : 'According to CARARE 2.0.6, processing software and hardware equipment do not belong to the Digital Resource, but are documented as sub-events (<consistsOf> / <equipment>) in the "Activity / Campaign" module. The Digital Resource exclusively describes the delivered digital object.' }}
        </p>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- SECTION 5: DATEIGRÖSSE & WIEDERHOLTE CARARE <extent>-FELDER  -->
    <!-- ============================================================ -->
    <div class="p-3.5 bg-base-200/30 rounded-xl border border-base-200 mb-5" data-xml-tag="extent">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
        <div>
          <label class="label py-1">
            <span class="label-text font-bold text-xs uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
              <span>💾</span>
              <span>{{ currentLocale === 'de' ? 'Dateigröße (Messumfang)' : 'File Size (Extent)' }}</span>
              <span class="text-accent font-black">*</span>
            </span>
          </label>
          <div class="join w-full">
            <input
              type="number"
              step="any"
              v-model="fileSizeValue"
              @input="updateExtent"
              class="input input-sm input-bordered join-item w-full font-mono text-xs"
              placeholder="e.g. 450"
            />
            <select v-model="fileSizeUnit" @change="updateExtent" class="select select-sm select-bordered join-item font-semibold text-xs">
              <option value="MB">MB</option>
              <option value="GB">GB</option>
              <option value="KB">KB</option>
              <option value="TB">TB</option>
            </select>
          </div>
        </div>

        <!-- CARARE <extent> Primary -->
        <div>
          <label class="label py-1">
            <span class="label-text font-bold text-xs uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
              <span>📐</span>
              <span>{{ currentLocale === 'de' ? 'Primäres Ausmaß (CARARE <extent>)' : 'Primary Extent (CARARE <extent>)' }}</span>
            </span>
          </label>
          <input
            type="text"
            :value="extent"
            @input="$emit('update:extent', $event.target.value)"
            class="input input-sm input-bordered w-full font-mono text-xs"
            placeholder="e.g. 450 MB"
          />
        </div>
      </div>


    </div>

    <!-- ============================================================ -->
    <!-- SECTION 6: CARARE <formatDetails> OUTPUT & SYNCHRONISATION    -->
    <!-- ============================================================ -->
    <div data-xml-tag="formatDetails">
      <div class="flex items-center justify-between mb-1.5">
        <label class="label-text font-bold text-xs uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
          <span>📋</span>
          <span>{{ currentLocale === 'de' ? 'Formatdetails (CARARE <formatDetails> XML-Element)' : 'Format Details (CARARE <formatDetails>)' }}</span>
          <span class="text-accent font-black">*</span>
        </label>
      </div>

      <textarea
        :value="formatDetails"
        @input="$emit('update:formatDetails', $event.target.value)"
        class="textarea textarea-bordered w-full h-24 font-mono text-xs leading-relaxed"
        :placeholder="currentLocale === 'de'
          ? 'z.B. Photogrammetrie: Nikon Z 8 (45.7 MP), NIKKOR Z 50mm f/1.8 S. 245 RAW-Aufnahmen (Nikon NEF, X-Rite ColorChecker). 3D-Geometrie: 15.8M Faces, 7.9M Vertices. Texturen: 8K PBR. Software: RealityCapture.'
          : 'e.g. Photogrammetry: Nikon Z 8 (45.7 MP), 245 RAW shots. Mesh: 15.8M faces, 8K PBR textures. Software: RealityCapture.'"
      ></textarea>
      <div class="mt-1 text-[11px] text-base-content/50">
        <span>
          {{ currentLocale === 'de'
            ? 'ℹ️ Dieses Feld wird automatisch aus den obigen Parametern für den CARARE XML Export generiert und kann bei Bedarf manuell angepasst werden.'
            : 'ℹ️ This field is automatically generated from the parameters above for CARARE XML export and can be adjusted manually if needed.' }}
        </span>
      </div>
    </div>

    <!-- Equipment Modal Picker -->
    <EquipmentPickerModal
      :isOpen="isEquipmentPickerOpen"
      mode="select"
      :locale="currentLocale"
      @close="isEquipmentPickerOpen = false"
      @select="handleSelectEquipment"
    />

    <!-- Software Modal Picker -->
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
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import SoftwarePickerModal from './SoftwarePickerModal.vue';
import EquipmentPickerModal from './EquipmentPickerModal.vue';

const props = defineProps({
  form: {
    type: Object,
    default: null
  },
  formats: {
    type: Array,
    default: () => []
  },
  formatDetails: {
    type: String,
    default: ''
  },
  extent: {
    type: String,
    default: ''
  },
  currentLocale: {
    type: String,
    default: 'de'
  }
});

const emit = defineEmits([
  'update:formats',
  'update:formatDetails',
  'update:extent'
]);

// ----------------------------------------------------
// Acquisition Method & Asset Type
// ----------------------------------------------------
const acquisitionMethod = ref('');
const assetType = ref('mesh');

const isEquipmentPickerOpen = ref(false);
const isSoftwarePickerOpen = ref(false);
const equipmentPickerTarget = ref('camera');

const openEquipmentPicker = (target = 'camera') => {
  equipmentPickerTarget.value = target;
  isEquipmentPickerOpen.value = true;
};

const handleSelectSoftware = (sw) => {
  if (!sw) return;
  if (!Array.isArray(softwareList.value)) {
    softwareList.value = [];
  }
  softwareList.value.push({
    name: sw.name,
    version: sw.version || '',
    role: sw.role || sw.category || ''
  });
  syncSoftwareListToLegacy();
  onFieldChanged();
};

const handleSelectEquipment = (eq) => {
  if (!eq) return;
  const target = equipmentPickerTarget.value;
  if (target === 'sls') {
    slsScanner.value = eq.name;
  } else if (target === 'tls') {
    tlsScanner.value = eq.name;
  } else if (target === 'lens') {
    photoLens.value = eq.name;
  } else if (target === 'target') {
    photoColorTarget.value = eq.name;
  } else {
    // Default camera
    photoCamera.value = eq.name;
    if (eq.specs && eq.specs.includes('MP')) {
      const match = eq.specs.match(/(\d+(?:\.\d+)?\s*MP)/i);
      if (match) photoSensor.value = match[1];
    }
  }
  onFieldChanged();
};

const ASSET_TYPES = [
  { code: 'mesh', icon: '🧊', labelDe: '3D-Polygonnetz (Mesh)', labelEn: '3D Mesh' },
  { code: 'pointcloud', icon: '☁️', labelDe: 'Punktwolke (Point Cloud)', labelEn: 'Point Cloud' },
  { code: 'rawset', icon: '📦', labelDe: 'Rohdatensatz (RAW-Paket)', labelEn: 'RAW Image/Scan Package' },
  { code: 'texture', icon: '🖼️', labelDe: '2D-Textur / Bildersatz', labelEn: '2D Texture / Ortho' }
];

const setMethod = (method) => {
  acquisitionMethod.value = method;
  onFieldChanged();
};

const setAssetType = (type) => {
  assetType.value = type;
  onFieldChanged();
};

// ----------------------------------------------------
// 1. Photogrammetry Data
// ----------------------------------------------------
const photoCamera = ref('Nikon Z 8');
const photoSensor = ref('45.7 MP (8256×5504 px)');
const photoLens = ref('NIKKOR Z 50mm f/1.8 S');
const photoRawFormat = ref('Nikon NEF (14-Bit Lossless)');
const photoImageCount = ref('245 Aufnahmen');
const photoColorTarget = ref('X-Rite ColorChecker Classic');
const photoGsd = ref('< 0.15 mm/px');

const isSearchingCamera = ref(false);
const showCameraDropdown = ref(false);
const cameraSuggestions = ref([]);
let cameraDebounce = null;

const onCameraInput = () => {
  onFieldChanged();
  const q = photoCamera.value.trim();
  if (q.length < 2) {
    cameraSuggestions.value = [];
    showCameraDropdown.value = false;
    return;
  }
  showCameraDropdown.value = true;
  if (cameraDebounce) clearTimeout(cameraDebounce);
  cameraDebounce = setTimeout(async () => {
    isSearchingCamera.value = true;
    try {
      const lang = props.currentLocale === 'de' ? 'de' : 'en';
      const res = await fetch(`https://vocabs.bcdh.uni-bonn.de/rest/v1/hector_3d_documentation/search?query=${encodeURIComponent(q)}*&lang=${lang}`);
      if (res.ok) {
        const data = await res.json();
        cameraSuggestions.value = (data.results || []).map(r => ({
          uri: r.uri,
          prefLabel: r.prefLabel || q
        }));
      }
    } catch (e) {
      console.warn('Skosmos camera search error:', e);
    } finally {
      isSearchingCamera.value = false;
    }
  }, 200);
};

const selectCameraSuggestion = (sug) => {
  photoCamera.value = sug.prefLabel;
  showCameraDropdown.value = false;
  const found = HECTOR_CAMERAS.find(c => c.name.toLowerCase() === sug.prefLabel.toLowerCase());
  if (found) {
    if (found.res) photoSensor.value = found.res;
    if (found.lens) photoLens.value = found.lens;
  }
  onFieldChanged();
};

const applyCamera = (cam) => {
  photoCamera.value = cam.name;
  if (cam.res) photoSensor.value = cam.res;
  if (cam.lens) photoLens.value = cam.lens;
  onFieldChanged();
};

const HECTOR_CAMERAS = [
  { name: 'Nikon Z 8', res: '45.7 MP', lens: 'NIKKOR Z 50mm f/1.8 S' },
  { name: 'Nikon D750', res: '24.3 MP', lens: 'AF-S NIKKOR 50mm f/1.8G' },
  { name: 'Canon EOS R5', res: '45.0 MP', lens: 'Canon RF 50mm f/1.8 STM' },
  { name: 'Sony Alpha 7R V', res: '61.0 MP', lens: 'Sony FE 50mm f/1.4 GM' }
];

const SENSOR_PRESETS = [
  '45.7 MP',
  '61.0 MP',
  '24.3 MP',
  '20.1 MP',
  '100 MP',
  '150 MP'
];

const LENS_PRESETS = [
  'NIKKOR Z 50mm f/1.8 S',
  'AF-S NIKKOR 50mm f/1.8G',
  'Canon RF 50mm f/1.8 STM',
  '35mm Festbrennweite',
  '85mm Makro'
];

// ----------------------------------------------------
// 2. SLS (Structured Light Scanning) Data
// ----------------------------------------------------
const slsScanner = ref('Artec Spider II');
const slsFov = ref('180×140 mm');
const slsAccuracy = ref('0.05 mm');
const slsHasRawImages = ref(true);
const slsCameraSystem = ref('Integrierte Farbkamera im Scanner');
const slsRawCount = ref('60 Texturaufnahmen');
const slsRawFormat = ref('TIFF 16-Bit / Scan-Rohdaten');

const isSearchingSls = ref(false);
const showSlsDropdown = ref(false);
const slsSuggestions = ref([]);
let slsDebounce = null;

const onSlsInput = () => {
  onFieldChanged();
  const q = slsScanner.value.trim();
  if (q.length < 2) {
    slsSuggestions.value = [];
    showSlsDropdown.value = false;
    return;
  }
  showSlsDropdown.value = true;
  if (slsDebounce) clearTimeout(slsDebounce);
  slsDebounce = setTimeout(async () => {
    isSearchingSls.value = true;
    try {
      const lang = props.currentLocale === 'de' ? 'de' : 'en';
      const res = await fetch(`https://vocabs.bcdh.uni-bonn.de/rest/v1/hector_3d_documentation/search?query=${encodeURIComponent(q)}*&lang=${lang}`);
      if (res.ok) {
        const data = await res.json();
        slsSuggestions.value = (data.results || []).map(r => ({
          uri: r.uri,
          prefLabel: r.prefLabel || q
        }));
      }
    } catch (e) {
      console.warn('Skosmos SLS search error:', e);
    } finally {
      isSearchingSls.value = false;
    }
  }, 200);
};

const selectSlsSuggestion = (sug) => {
  slsScanner.value = sug.prefLabel;
  showSlsDropdown.value = false;
  const found = HECTOR_SLS_SCANNERS.find(s => s.name.toLowerCase() === sug.prefLabel.toLowerCase());
  if (found) {
    if (found.acc) slsAccuracy.value = found.acc;
    if (found.fov) slsFov.value = found.fov;
  }
  onFieldChanged();
};

const applySlsScanner = (s) => {
  slsScanner.value = s.name;
  if (s.acc) slsAccuracy.value = s.acc;
  if (s.fov) slsFov.value = s.fov;
  onFieldChanged();
};

const HECTOR_SLS_SCANNERS = [
  { name: 'Artec Spider II', acc: '0.05 mm', fov: '180×140 mm' },
  { name: 'Artec Spider I', acc: '0.05 mm', fov: '180×140 mm' },
  { name: 'Artec Leo', acc: '0.1 mm', fov: '300×200 mm' },
  { name: 'Artec Eva', acc: '0.1 mm', fov: '300×200 mm' },
  { name: 'GOM ATOS Q', acc: '0.02 mm', fov: '100 mm' },
  { name: 'Breuckmann smartSCAN HE', acc: '0.02 mm', fov: '125 mm' },
  { name: 'EinScan Pro 2X', acc: '0.04 mm', fov: '200 mm' }
];

// ----------------------------------------------------
// 3. TLS (Terrestrial Laser Scanning) Data
// ----------------------------------------------------
const tlsScanner = ref('Faro Focus S350');
const tlsPositions = ref('14 Stationen');
const tlsAccuracy = ref('1.0 mm @ 10m');
const tlsHasRawImages = ref(true);
const tlsCameraSystem = ref('Integrierte HDR-Panoramakamera (36 MP)');
const tlsRawCount = ref('14 Panoramen à 5 Belichtungen (70 HDR-Rohbilder)');
const tlsColorMode = ref('Fotorealistische RGB-Punktwolke (True Color)');

const isSearchingTls = ref(false);
const showTlsDropdown = ref(false);
const tlsSuggestions = ref([]);
let tlsDebounce = null;

const onTlsInput = () => {
  onFieldChanged();
  const q = tlsScanner.value.trim();
  if (q.length < 2) {
    tlsSuggestions.value = [];
    showTlsDropdown.value = false;
    return;
  }
  showTlsDropdown.value = true;
  if (tlsDebounce) clearTimeout(tlsDebounce);
  tlsDebounce = setTimeout(async () => {
    isSearchingTls.value = true;
    try {
      const lang = props.currentLocale === 'de' ? 'de' : 'en';
      const res = await fetch(`https://vocabs.bcdh.uni-bonn.de/rest/v1/hector_3d_documentation/search?query=${encodeURIComponent(q)}*&lang=${lang}`);
      if (res.ok) {
        const data = await res.json();
        tlsSuggestions.value = (data.results || []).map(r => ({
          uri: r.uri,
          prefLabel: r.prefLabel || q
        }));
      }
    } catch (e) {
      console.warn('Skosmos TLS search error:', e);
    } finally {
      isSearchingTls.value = false;
    }
  }, 200);
};

const selectTlsSuggestion = (sug) => {
  tlsScanner.value = sug.prefLabel;
  showTlsDropdown.value = false;
  const found = HECTOR_TLS_SCANNERS.find(s => s.name.toLowerCase() === sug.prefLabel.toLowerCase());
  if (found && found.acc) {
    tlsAccuracy.value = found.acc;
  }
  onFieldChanged();
};

const applyTlsScanner = (s) => {
  tlsScanner.value = s.name;
  if (s.acc) tlsAccuracy.value = s.acc;
  onFieldChanged();
};

const HECTOR_TLS_SCANNERS = [
  { name: 'Faro Focus S350', acc: '1.0 mm @ 10m' },
  { name: 'Faro Focus S70', acc: '1.0 mm @ 10m' },
  { name: 'Faro Focus S150 Plus', acc: '1.0 mm @ 10m' },
  { name: 'Leica RTC360', acc: '1.9 mm @ 10m' },
  { name: 'Leica BLK360 G2', acc: '4.0 mm @ 10m' },
  { name: 'Z+F IMAGER 5016', acc: '1.0 mm @ 10m' },
  { name: 'Riegl VZ-400i', acc: '1.5 mm @ 50m' }
];

// ----------------------------------------------------
// 4. Formats (MIME & HECTOR)
// ----------------------------------------------------
const FORMATS_3D = [
  { code: 'obj', label: 'Wavefront OBJ', ext: '.obj + .mtl', mime: 'model/obj', icon: '🧊' },
  { code: 'glb', label: 'glTF 2.0 Binary', ext: '.glb', mime: 'model/gltf-binary', icon: '⚡' },
  { code: 'gltf', label: 'glTF JSON', ext: '.gltf', mime: 'model/gltf+json', icon: '📄' },
  { code: 'ply', label: 'Stanford PLY', ext: '.ply', mime: 'model/ply', icon: '📊' },
  { code: 'stl', label: 'Stereolithography STL', ext: '.stl', mime: 'model/stl', icon: '🖨️' },
  { code: 'fbx', label: 'Autodesk FBX', ext: '.fbx', mime: 'application/octet-stream; fbx', icon: '🎬' }
];

const FORMATS_POINTCLOUD = [
  { code: 'e57', label: 'E57 Punktwolke', ext: '.e57', mime: 'application/x-e57', icon: '☁️' },
  { code: 'las', label: 'LAS / LAZ LiDAR', ext: '.las', mime: 'application/octet-stream; las', icon: '☁️' },
  { code: 'pts', label: 'PTS Point Cloud', ext: '.pts', mime: 'text/plain; pts', icon: '📊' }
];

const FORMATS_RAW_2D = [
  { code: 'nef', label: 'Nikon RAW (NEF)', ext: '.nef', mime: 'image/x-nikon-nef', icon: '📸' },
  { code: 'cr3', label: 'Canon RAW (CR3)', ext: '.cr3', mime: 'image/x-canon-cr3', icon: '📸' },
  { code: 'dng', label: 'Adobe DNG RAW', ext: '.dng', mime: 'image/x-adobe-dng', icon: '📸' },
  { code: 'tiff', label: 'TIFF Textur / 16-Bit', ext: '.tif', mime: 'image/tiff', icon: '🖼️' },
  { code: 'jpeg', label: 'JPEG Textur (HQ)', ext: '.jpg', mime: 'image/jpeg', icon: '🖼️' },
  { code: 'png', label: 'PNG Textur (Lossless)', ext: '.png', mime: 'image/png', icon: '🖼️' }
];

const customFormatInput = ref('');

const isFormatSelected = (val) => {
  if (!props.formats || !Array.isArray(props.formats)) return false;
  return props.formats.some(f => f.toLowerCase().includes(val.toLowerCase()));
};

const toggleFormat = (fmt) => {
  const current = [...(props.formats || [])];
  const idx = current.findIndex(f => f.toLowerCase() === fmt.mime.toLowerCase() || f.toLowerCase() === fmt.label.toLowerCase());
  if (idx !== -1) {
    current.splice(idx, 1);
  } else {
    current.push(fmt.mime);
  }
  emit('update:formats', current);
};

const removeFormat = (idx) => {
  const current = [...(props.formats || [])];
  current.splice(idx, 1);
  emit('update:formats', current);
};

const addCustomFormat = () => {
  const val = customFormatInput.value.trim();
  if (!val) return;
  const current = [...(props.formats || [])];
  if (!current.includes(val)) {
    current.push(val);
    emit('update:formats', current);
  }
  customFormatInput.value = '';
};

// ----------------------------------------------------
// 5. Geometry & Mesh Metrics
// ----------------------------------------------------
const polygonCount = ref('15.8 Mio. Faces');
const vertexCount = ref('7.9 Mio. Vertices');
const meshCategory = ref('High-Poly Master Mesh');

const textureResolution = ref('8K (8192×8192 px)');
const selectedMaps = ref(['albedo', 'normal', 'roughness', 'ao']);

const TEXTURE_RESOLUTIONS = [
  { label: '1K (1024)', val: '1024×1024 px (1K)' },
  { label: '2K (2048)', val: '2048×2048 px (2K)' },
  { label: '4K (4096)', val: '4096×4096 px (4K)' },
  { label: '8K (8192)', val: '8192×8192 px (8K)' },
  { label: '16K (16384)', val: '16384×16384 px (16K)' }
];

const PBR_MAPS = [
  { code: 'albedo', label: 'Albedo / BaseColor' },
  { code: 'normal', label: 'Normal Map' },
  { code: 'roughness', label: 'Roughness' },
  { code: 'metallic', label: 'Metallic' },
  { code: 'ao', label: 'Ambient Occlusion (AO)' },
  { code: 'displacement', label: 'Displacement / Height' }
];

// ----------------------------------------------------
// 5B. Metrology: Dedicated Accuracy & Resolution Fields
// ----------------------------------------------------
const accuracyPoint = ref('0.05 mm');
const accuracyRmse = ref('0.018 mm ICP-RMSE');
const accuracyVolumetric = ref('0.05 mm + 0.3 mm/m');
const accuracyCalibration = ref('VDI/VDE 2634 Kalibrierplatte, Invar-Maßstab & X-Rite ColorChecker Passport');
const resolutionSpatial = ref('0.1 mm');

// ----------------------------------------------------
// 6. Processing Software & Versions (Structured List)
// ----------------------------------------------------
const softwareList = ref([
  { name: 'Artec Studio', version: '19', role: 'Scan-Registrierung & Mesh-Fusion (SLS)' },
  { name: 'Blender', version: '4.2', role: 'Mesh-Dezimation, Retopologie & UV-Unwrapping' },
  { name: 'Substance Designer', version: '14', role: 'PBR-Textur-Baking (Albedo, Normal, Roughness, AO)' },
  { name: 'Adobe Photoshop Lightroom', version: '14.1', role: 'RAW-Farbkalibrierung (X-Rite ColorChecker)' }
]);

const STRUCTURED_SOFTWARE_PRESETS = [
  { name: 'Artec Studio', version: '19', roleDe: 'SLS Scan-Registrierung & Mesh-Fusion', roleEn: 'SLS Scan Registration & Mesh Fusion' },
  { name: 'RealityCapture', version: '1.4', roleDe: 'Photogrammetrie SfM/MVS & Texturierung', roleEn: 'Photogrammetry SfM/MVS & Texturing' },
  { name: 'Agisoft Metashape', version: '2.1', roleDe: 'Bündelblockausgleichung & Dense Cloud', roleEn: 'Bundle Adjustment & Dense Cloud' },
  { name: 'Blender', version: '4.2', roleDe: 'Mesh-Dezimation, UV-Mapping & Shader', roleEn: 'Mesh Decimation, UV Mapping & Shaders' },
  { name: 'Substance Designer', version: '14', roleDe: 'PBR-Textur-Baking (Normal/Roughness/AO)', roleEn: 'PBR Texture Baking (Normal/Roughness/AO)' },
  { name: 'Adobe Photoshop Lightroom', version: '14.1', roleDe: 'RAW-Farbkalibrierung (ColorChecker)', roleEn: 'RAW Color Calibration (ColorChecker)' },
  { name: 'CloudCompare', version: '2.13', roleDe: 'Punktwolken-Analyse & ICP-Abgleich', roleEn: 'Point Cloud Analysis & ICP Alignment' },
  { name: 'FARO SCENE', version: '2024.1', roleDe: 'TLS-Registrierung & Kolorierung', roleEn: 'TLS Registration & Colorization' }
];

const processingSoftware = ref('Artec Studio 19, Blender 4.2, Substance Designer 14, Adobe Photoshop Lightroom 14.1');

const addStructuredSoftware = () => {
  softwareList.value.push({ name: '', version: '', role: '' });
  syncSoftwareListToLegacy();
};

const addStructuredSoftwarePreset = (preset) => {
  const isDe = props.currentLocale === 'de';
  const exists = softwareList.value.some(
    s => s.name.toLowerCase() === preset.name.toLowerCase() && s.version === preset.version
  );
  if (!exists) {
    softwareList.value.push({
      name: preset.name,
      version: preset.version,
      role: isDe ? preset.roleDe : preset.roleEn
    });
    syncSoftwareListToLegacy();
  }
};

const removeStructuredSoftware = (idx) => {
  softwareList.value.splice(idx, 1);
  syncSoftwareListToLegacy();
};

const syncSoftwareListToLegacy = () => {
  const formatted = softwareList.value
    .filter(s => s.name && s.name.trim())
    .map(s => {
      const ver = s.version && s.version.trim() ? ` v${s.version.trim()}` : '';
      const role = s.role && s.role.trim() ? ` (${s.role.trim()})` : '';
      return `${s.name.trim()}${ver}${role}`;
    });
  if (formatted.length > 0) {
    processingSoftware.value = formatted.join(', ');
  }
  onFieldChanged();
};

const isSearchingSoftware = ref(false);
const showSoftwareDropdown = ref(false);
const softwareSuggestions = ref([]);
let softwareDebounce = null;

const onSoftwareInput = () => {
  onFieldChanged();
  const q = processingSoftware.value.trim();
  if (q.length < 2) {
    softwareSuggestions.value = [];
    showSoftwareDropdown.value = false;
    return;
  }
  showSoftwareDropdown.value = true;
  if (softwareDebounce) clearTimeout(softwareDebounce);
  softwareDebounce = setTimeout(async () => {
    isSearchingSoftware.value = true;
    try {
      const lang = props.currentLocale === 'de' ? 'de' : 'en';
      const res = await fetch(`https://vocabs.bcdh.uni-bonn.de/rest/v1/hector_3d_documentation/search?query=${encodeURIComponent(q)}*&lang=${lang}`);
      if (res.ok) {
        const data = await res.json();
        softwareSuggestions.value = (data.results || []).map(r => ({
          uri: r.uri,
          prefLabel: r.prefLabel || q
        }));
      }
    } catch (e) {
      console.warn('Skosmos software search error:', e);
    } finally {
      isSearchingSoftware.value = false;
    }
  }, 200);
};

const selectSoftwareSuggestion = (sug) => {
  addSoftwarePreset(sug.prefLabel);
  showSoftwareDropdown.value = false;
};

const SOFTWARE_PRESETS = ['RealityCapture', 'Artec Studio 19', 'Agisoft Metashape', 'FARO SCENE', 'CloudCompare', 'Blender 4.2'];

const addSoftwarePreset = (sw) => {
  if (!processingSoftware.value) {
    processingSoftware.value = sw;
  } else if (!processingSoftware.value.includes(sw)) {
    processingSoftware.value += `, ${sw}`;
  }
  const exists = softwareList.value.some(s => s.name && sw.toLowerCase().includes(s.name.toLowerCase()));
  if (!exists) {
    softwareList.value.push({ name: sw, version: '', role: '' });
  }
  onFieldChanged();
};

// ----------------------------------------------------
// 7. File Size & Repeated CARARE <extent> Elements
// ----------------------------------------------------
const fileSizeValue = ref('450');
const fileSizeUnit = ref('MB');

const computedRepeatedExtents = computed(() => {
  const list = [];
  if (fileSizeValue.value) {
    list.push(`File Size: ${fileSizeValue.value} ${fileSizeUnit.value}`);
  } else if (props.extent) {
    list.push(props.extent);
  }
  if (assetType.value === 'mesh') {
    if (polygonCount.value) list.push(`Polygon Count: ${polygonCount.value}`);
    if (vertexCount.value) list.push(`Vertex Count: ${vertexCount.value}`);
    if (textureResolution.value) list.push(`Texture Resolution: ${textureResolution.value}`);
  } else if (assetType.value === 'pointcloud') {
    if (vertexCount.value) list.push(`Point Count: ${vertexCount.value}`);
  }
  if (resolutionSpatial.value) {
    list.push(`3D Spatial Resolution: ${resolutionSpatial.value}`);
  }
  if (photoGsd.value) {
    list.push(`Ground Sampling Distance (GSD): ${photoGsd.value}`);
  }
  if (accuracyPoint.value) {
    list.push(`3D Point Accuracy: ${accuracyPoint.value}`);
  }
  if (accuracyRmse.value) {
    list.push(`Registration Error (RMSE): ${accuracyRmse.value}`);
  }
  if (photoSensor.value && (acquisitionMethod.value === 'photogrammetry' || acquisitionMethod.value === 'hybrid')) {
    list.push(`Optical Sensor Resolution: ${photoSensor.value}`);
  }
  return list;
});

const updateExtent = () => {
  if (!fileSizeValue.value) return;
  let extra = '';
  if (assetType.value === 'mesh' && polygonCount.value) {
    extra = ` (${polygonCount.value})`;
  } else if (assetType.value === 'pointcloud' && vertexCount.value) {
    extra = ` (${vertexCount.value})`;
  } else if (acquisitionMethod.value === 'photogrammetry' && photoImageCount.value) {
    extra = ` (${photoImageCount.value})`;
  } else if (acquisitionMethod.value === 'tls' && tlsPositions.value) {
    extra = ` (${tlsPositions.value})`;
  }
  const fullExtent = `${fileSizeValue.value} ${fileSizeUnit.value}${extra}`;
  emit('update:extent', fullExtent);
  syncStructuredFormFields();
};

// Synchronize structured Accuracy, Resolution, SoftwareList & ExtentList onto parent form
const syncStructuredFormFields = () => {
  if (!props.form) return;
  props.form['accuracy'] = {
    pointAccuracy: accuracyPoint.value || slsAccuracy.value || '',
    registrationRmse: accuracyRmse.value || '',
    volumetricAccuracy: accuracyVolumetric.value || '',
    calibrationMethod: accuracyCalibration.value || photoColorTarget.value || ''
  };
  props.form['resolution'] = {
    spatialResolution: resolutionSpatial.value || '',
    gsd: photoGsd.value || '',
    textureResolution: textureResolution.value || '',
    sensorResolution: photoSensor.value || ''
  };
  props.form['softwareList'] = softwareList.value
    .filter(s => s && s.name && s.name.trim())
    .map(s => ({
      name: s.name.trim(),
      version: (s.version || '').trim(),
      role: (s.role || '').trim()
    }));
  props.form['extentList'] = [...computedRepeatedExtents.value];
};

const loadFromForm = () => {
  if (!props.form) return;
  if (props.form['accuracy'] && typeof props.form['accuracy'] === 'object') {
    if (props.form['accuracy'].pointAccuracy) accuracyPoint.value = props.form['accuracy'].pointAccuracy;
    if (props.form['accuracy'].registrationRmse) accuracyRmse.value = props.form['accuracy'].registrationRmse;
    if (props.form['accuracy'].volumetricAccuracy) accuracyVolumetric.value = props.form['accuracy'].volumetricAccuracy;
    if (props.form['accuracy'].calibrationMethod) accuracyCalibration.value = props.form['accuracy'].calibrationMethod;
  }
  if (props.form['resolution'] && typeof props.form['resolution'] === 'object') {
    if (props.form['resolution'].spatialResolution) resolutionSpatial.value = props.form['resolution'].spatialResolution;
    if (props.form['resolution'].gsd) photoGsd.value = props.form['resolution'].gsd;
    if (props.form['resolution'].textureResolution) textureResolution.value = props.form['resolution'].textureResolution;
    if (props.form['resolution'].sensorResolution) photoSensor.value = props.form['resolution'].sensorResolution;
  }
  if (Array.isArray(props.form['softwareList']) && props.form['softwareList'].length > 0) {
    softwareList.value = props.form['softwareList'].map(s => ({
      name: s.name || '',
      version: s.version || '',
      role: s.role || ''
    }));
  }
};

watch(
  () => props.form && (props.form['recordInformation.id'] || props.form['appellation.id']),
  () => {
    loadFromForm();
    syncStructuredFormFields();
  }
);

// ----------------------------------------------------
// Reactive Trigger
// ----------------------------------------------------
const onFieldChanged = () => {
  syncStructuredFormFields();
  generateSummaries();
};

// ----------------------------------------------------
// CARARE <formatDetails> Generator
// ----------------------------------------------------
const generateSummaries = () => {
  const isDe = props.currentLocale === 'de';
  const parts = [];

  // A. Photogrammetry block
  if (acquisitionMethod.value === 'photogrammetry' || acquisitionMethod.value === 'hybrid') {
    const photoBits = [];
    if (photoCamera.value) photoBits.push(`${isDe ? 'Kamera' : 'Camera'}: ${photoCamera.value}`);
    if (photoSensor.value) photoBits.push(`${isDe ? 'Sensor' : 'Sensor'}: ${photoSensor.value}`);
    if (photoLens.value) photoBits.push(`${isDe ? 'Objektiv' : 'Lens'}: ${photoLens.value}`);
    if (photoImageCount.value) photoBits.push(`${isDe ? 'Rohbilder' : 'RAW Shots'}: ${photoImageCount.value} (${photoRawFormat.value || 'RAW'})`);
    if (photoColorTarget.value) photoBits.push(`Kalibrierung: ${photoColorTarget.value}`);
    if (photoGsd.value) photoBits.push(`GSD: ${photoGsd.value}`);
    if (photoBits.length > 0) {
      parts.push(`[Photogrammetrie] ${photoBits.join(' | ')}`);
    }
  }

  // B. SLS block
  if (acquisitionMethod.value === 'sls' || acquisitionMethod.value === 'hybrid') {
    const slsBits = [];
    if (slsScanner.value) slsBits.push(`Scanner: ${slsScanner.value}`);
    if (slsAccuracy.value) slsBits.push(`${isDe ? 'Genauigkeit' : 'Accuracy'}: ${slsAccuracy.value}`);
    if (slsFov.value) slsBits.push(`Messfeld (FOV): ${slsFov.value}`);
    if (slsHasRawImages.value) {
      const rawText = `${slsRawCount.value || 'Rohbilder'} (${slsRawFormat.value || 'TIFF/RAW'}, ${slsCameraSystem.value || 'Farbkamera'})`;
      slsBits.push(`${isDe ? 'Textur-Rohbilder' : 'Texture RAW'}: ${rawText}`);
    }
    if (slsBits.length > 0) {
      parts.push(`[SLS Streifenlicht] ${slsBits.join(' | ')}`);
    }
  }

  // C. TLS block
  if (acquisitionMethod.value === 'tls' || acquisitionMethod.value === 'hybrid') {
    const tlsBits = [];
    if (tlsScanner.value) tlsBits.push(`TLS: ${tlsScanner.value}`);
    if (tlsPositions.value) tlsBits.push(`${isDe ? 'Standpunkte' : 'Stations'}: ${tlsPositions.value}`);
    if (tlsAccuracy.value) tlsBits.push(`${isDe ? 'Genauigkeit' : 'Accuracy'}: ${tlsAccuracy.value}`);
    if (tlsHasRawImages.value) {
      const rawText = `${tlsRawCount.value || 'HDR-Panoramen'} (${tlsCameraSystem.value || 'HDR-Kamera'}, ${tlsColorMode.value || 'RGB'})`;
      tlsBits.push(`${isDe ? 'Kolorierungs-Rohbilder' : 'Color RAW'}: ${rawText}`);
    }
    if (tlsBits.length > 0) {
      parts.push(`[TLS Laserscan] ${tlsBits.join(' | ')}`);
    }
  }

  // D. Geometry & Mesh
  if (assetType.value === 'mesh') {
    const geoBits = [meshCategory.value];
    if (polygonCount.value) geoBits.push(polygonCount.value);
    if (vertexCount.value) geoBits.push(vertexCount.value);
    parts.push(`3D-Mesh: ${geoBits.filter(Boolean).join(', ')}`);

    // Textures
    const mapLabels = selectedMaps.value.map(m => {
      const found = PBR_MAPS.find(x => x.code === m);
      return found ? found.label : m;
    });
    if (textureResolution.value || mapLabels.length > 0) {
      const texStr = isDe ? 'Texturen' : 'Textures';
      const resStr = textureResolution.value ? `${textureResolution.value}` : '';
      const mapsStr = mapLabels.length > 0 ? `PBR: ${mapLabels.join(', ')}` : '';
      parts.push(`${texStr}: ${[resStr, mapsStr].filter(Boolean).join(' | ')}`);
    }
  } else if (assetType.value === 'pointcloud') {
    if (vertexCount.value) {
      parts.push(`Punktwolke: ${vertexCount.value}`);
    }
  }

  // D2. Accuracy & Resolution Summary
  const metBits = [];
  if (accuracyPoint.value) metBits.push(`Point Accuracy: ${accuracyPoint.value}`);
  if (accuracyRmse.value) metBits.push(`RMSE: ${accuracyRmse.value}`);
  if (resolutionSpatial.value) metBits.push(`Spatial Res.: ${resolutionSpatial.value}`);
  if (photoGsd.value) metBits.push(`GSD: ${photoGsd.value}`);
  if (metBits.length > 0) {
    parts.push(`${isDe ? 'Metrologie' : 'Metrology'}: ${metBits.join(' | ')}`);
  }

  const generated = parts.length > 0 ? parts.join('. ') + '.' : '';
  emit('update:formatDetails', generated);

  if (fileSizeValue.value) {
    updateExtent();
  }
};

const handleClickOutside = (e) => {
  if (!e.target.closest('.relative')) {
    showCameraDropdown.value = false;
    showSlsDropdown.value = false;
    showTlsDropdown.value = false;
    showSoftwareDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  loadFromForm();
  if (props.extent) {
    const match = props.extent.match(/([\d.,]+)\s*(MB|GB|KB|TB|Bytes)/i);
    if (match) {
      fileSizeValue.value = parseFloat(match[1]);
      fileSizeUnit.value = match[2].toUpperCase();
    }
  }
  syncStructuredFormFields();
  if (!props.formatDetails) {
    generateSummaries();
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
