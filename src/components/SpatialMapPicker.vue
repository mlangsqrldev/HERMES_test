<template>
  <div class="spatial-map-picker w-full rounded-2xl border border-base-300 bg-base-100 overflow-hidden shadow-sm flex flex-col">
    <!-- Map Toolbar Header -->
    <div class="px-3.5 py-2 bg-base-200/70 border-b border-base-300 flex flex-wrap items-center justify-between gap-2 text-xs">
      <div class="flex items-center gap-2">
        <span class="text-base">🗺️</span>
        <span class="font-bold text-base-content/80">
          {{ currentLocale === 'de' ? 'Interaktive Fundort-Karte' : 'Interactive Location Map' }}
        </span>
        <span v-if="hasValidCoords" class="badge badge-xs badge-primary font-mono font-bold tracking-tight px-1.5 py-0.5">
          {{ currentLat.toFixed(5) }}, {{ currentLng.toFixed(5) }}
        </span>
        <span v-else class="badge badge-xs badge-ghost text-base-content/50 italic">
          {{ currentLocale === 'de' ? 'Kein Punkt gesetzt' : 'No pin set' }}
        </span>
      </div>

      <div class="flex items-center gap-1.5">
        <!-- Layer switcher buttons -->
        <div class="join">
          <button
            type="button"
            class="btn btn-xs join-item"
            :class="activeTileLayer === 'osm' ? 'btn-neutral' : 'btn-ghost border border-base-300'"
            @click="switchLayer('osm')"
            :title="currentLocale === 'de' ? 'Standardkarte (OpenStreetMap)' : 'Standard Map (OSM)'"
          >
            OSM
          </button>
          <button
            type="button"
            class="btn btn-xs join-item"
            :class="activeTileLayer === 'topo' ? 'btn-neutral' : 'btn-ghost border border-base-300'"
            @click="switchLayer('topo')"
            :title="currentLocale === 'de' ? 'Topographische Geländekarte (OpenTopoMap)' : 'Topographic Map (OpenTopoMap)'"
          >
            Topo
          </button>
          <button
            type="button"
            class="btn btn-xs join-item"
            :class="activeTileLayer === 'sat' ? 'btn-neutral' : 'btn-ghost border border-base-300'"
            @click="switchLayer('sat')"
            :title="currentLocale === 'de' ? 'Satellitenbild / Luftbild (Esri World Imagery)' : 'Satellite Imagery (Esri)'"
          >
            Sat
          </button>
        </div>

        <!-- API Settings Shortcut -->
        <button
          type="button"
          class="btn btn-xs btn-ghost gap-1 opacity-75 hover:opacity-100 border border-base-300/60"
          @click="openApiSettings"
          :title="currentLocale === 'de' ? 'API-Zugangsdaten (GeoNames)' : 'API Credentials (GeoNames)'"
        >
          🔑 <span class="hidden sm:inline text-[11px]">GeoNames</span>
        </button>


        <!-- Recenter on marker button -->
        <button
          v-if="hasValidCoords"
          type="button"
          class="btn btn-xs btn-ghost gap-1 text-primary hover:bg-primary/10"
          @click="recenterMap"
          :title="currentLocale === 'de' ? 'Auf Markierung zentrieren' : 'Center on Pin'"
        >
          🎯 {{ currentLocale === 'de' ? 'Zentrieren' : 'Center' }}
        </button>

        <!-- Clear marker button -->
        <button
          v-if="hasValidCoords && !readonly"
          type="button"
          class="btn btn-xs btn-ghost text-error hover:bg-error/10"
          @click="clearCoords"
          :title="currentLocale === 'de' ? 'Koordinaten entfernen' : 'Clear coordinates'"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Map Canvas Container -->
    <div class="relative w-full" :style="{ height: height }">
      <div ref="mapContainer" class="w-full h-full z-0"></div>

      <!-- Quick Instruction Overlay (fades out or discreet in corner) -->
      <div
        v-if="!readonly"
        class="absolute bottom-2 left-2 z-10 bg-base-100/90 backdrop-blur-md border border-base-300 text-[10px] text-base-content/70 px-2 py-1 rounded-lg pointer-events-none shadow-sm flex items-center gap-1.5"
      >
        <span class="text-primary font-bold">👆</span>
        <span>
          {{ currentLocale === 'de'
            ? 'Klicken oder Pin ziehen, um Koordinaten (X/Y) zu setzen'
            : 'Click or drag pin to set coordinates (X/Y)' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { openApiSettings } from '../utils/sharedState.js';

const props = defineProps({
  lat: {
    type: [Number, String],
    default: null
  },
  lng: {
    type: [Number, String],
    default: null
  },
  locationName: {
    type: String,
    default: ''
  },
  currentLocale: {
    type: String,
    default: 'de'
  },
  height: {
    type: String,
    default: '230px'
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:lat', 'update:lng', 'change', 'clear']);

const mapContainer = ref(null);
let map = null;
let marker = null;
let currentTileLayer = null;
const activeTileLayer = ref('osm'); // 'osm' | 'topo' | 'sat'

// Tile layer URLs (all reliable, no API key required)
const TILE_LAYERS = {
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  },
  topo: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap, SRTM | &copy; OpenTopoMap'
  },
  sat: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }
};

// Numerical coordinate parsing
const currentLat = computed(() => {
  const n = parseFloat(props.lat);
  return isNaN(n) ? null : n;
});

const currentLng = computed(() => {
  const n = parseFloat(props.lng);
  return isNaN(n) ? null : n;
});

const hasValidCoords = computed(() => {
  return currentLat.value !== null && currentLng.value !== null &&
    currentLat.value >= -90 && currentLat.value <= 90 &&
    currentLng.value >= -180 && currentLng.value <= 180;
});

// Modern SVG Pin divIcon (zero broken image links in bundler)
const createPinIcon = (label = '') => {
  return L.divIcon({
    className: 'hermes-map-pin',
    html: `
      <div style="position: relative; width: 32px; height: 32px; cursor: grab;">
        <div style="
          width: 28px;
          height: 28px;
          background: #0284c7;
          border: 2px solid #ffffff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="width: 8px; height: 8px; background: #ffffff; border-radius: 50%;"></div>
        </div>
        <div style="
          position: absolute;
          bottom: -4px;
          left: 5px;
          width: 14px;
          height: 5px;
          background: rgba(0,0,0,0.25);
          border-radius: 50%;
          filter: blur(1.5px);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [14, 28],
    popupAnchor: [2, -28]
  });
};

const initMap = () => {
  if (!mapContainer.value || map) return;

  // Default view: Center on Athens/Mediterranean or given coords
  const initialLat = hasValidCoords.value ? currentLat.value : 37.9715;
  const initialLng = hasValidCoords.value ? currentLng.value : 23.7257;
  const initialZoom = hasValidCoords.value ? 12 : 5;

  map = L.map(mapContainer.value, {
    center: [initialLat, initialLng],
    zoom: initialZoom,
    zoomControl: true,
    attributionControl: false
  });

  // Add scale control
  L.control.scale({ imperial: false, metric: true, position: 'bottomright' }).addTo(map);

  // Set tile layer
  switchLayer(activeTileLayer.value);

  // Add marker if coordinates present
  if (hasValidCoords.value) {
    addOrUpdateMarker(currentLat.value, currentLng.value);
  }

  // Click on map to place/move pin
  if (!props.readonly) {
    map.on('click', (e) => {
      const lat = parseFloat(e.latlng.lat.toFixed(6));
      const lng = parseFloat(e.latlng.lng.toFixed(6));
      emitCoordinates(lat, lng);
      addOrUpdateMarker(lat, lng);
    });
  }

  // Auto-resize on window/drawer resize
  window.addEventListener('resize', invalidateSize);
  setTimeout(invalidateSize, 250);
};

const switchLayer = (type) => {
  activeTileLayer.value = type;
  if (!map) return;
  if (currentTileLayer) {
    map.removeLayer(currentTileLayer);
  }
  const cfg = TILE_LAYERS[type] || TILE_LAYERS.osm;
  currentTileLayer = L.tileLayer(cfg.url, {
    maxZoom: 18,
    attribution: cfg.attribution
  }).addTo(map);
};

const addOrUpdateMarker = (lat, lng) => {
  if (!map) return;

  const latlng = [lat, lng];

  if (!marker) {
    marker = L.marker(latlng, {
      icon: createPinIcon(),
      draggable: !props.readonly
    }).addTo(map);

    if (!props.readonly) {
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        const newLat = parseFloat(pos.lat.toFixed(6));
        const newLng = parseFloat(pos.lng.toFixed(6));
        emitCoordinates(newLat, newLng);
      });
    }
  } else {
    marker.setLatLng(latlng);
  }

  const popupTitle = props.locationName || (props.currentLocale === 'de' ? 'Ausgewählter Ort' : 'Selected Location');
  marker.bindPopup(`
    <div style="font-family: inherit; font-size: 11px; line-height: 1.4; padding: 2px;">
      <b style="color: #0284c7;">📍 ${popupTitle}</b><br/>
      <span style="font-family: monospace; color: #475569;">${lat.toFixed(5)}, ${lng.toFixed(5)}</span>
    </div>
  `);
};

const removeMarker = () => {
  if (marker && map) {
    map.removeLayer(marker);
    marker = null;
  }
};

const emitCoordinates = (lat, lng) => {
  emit('update:lat', String(lat));
  emit('update:lng', String(lng));
  emit('change', { lat, lng });
};

const recenterMap = () => {
  if (!map || !hasValidCoords.value) return;
  map.setView([currentLat.value, currentLng.value], Math.max(map.getZoom(), 12), { animate: true });
};

const clearCoords = () => {
  removeMarker();
  emit('update:lat', '');
  emit('update:lng', '');
  emit('clear');
};

const invalidateSize = () => {
  if (map) {
    map.invalidateSize();
  }
};

// Watch for external coordinate updates (e.g. from PlaceAutocomplete)
watch([currentLat, currentLng], ([newLat, newLng]) => {
  if (newLat !== null && newLng !== null) {
    if (map) {
      addOrUpdateMarker(newLat, newLng);
      map.setView([newLat, newLng], Math.max(map.getZoom(), 11), { animate: true });
    }
  } else {
    removeMarker();
  }
});

watch(() => props.locationName, () => {
  if (marker && hasValidCoords.value) {
    addOrUpdateMarker(currentLat.value, currentLng.value);
  }
});

let resizeObserver = null;
let intersectionObserver = null;

onMounted(() => {
  nextTick(() => {
    initMap();
    if (mapContainer.value) {
      resizeObserver = new ResizeObserver(() => {
        invalidateSize();
      });
      resizeObserver.observe(mapContainer.value);

      if (typeof window !== 'undefined' && window.IntersectionObserver) {
        intersectionObserver = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              invalidateSize();
            }
          }
        }, { threshold: 0.05 });
        intersectionObserver.observe(mapContainer.value);
      }
    }
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', invalidateSize);
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  if (intersectionObserver) {
    intersectionObserver.disconnect();
    intersectionObserver = null;
  }
  if (map) {
    map.remove();
    map = null;
  }
});

defineExpose({
  recenter: recenterMap,
  invalidateSize
});
</script>

<style>
/* Leaflet customizations to match DaisyUI theme */
.hermes-map-pin {
  background: transparent;
  border: none;
}
.leaflet-popup-content-wrapper {
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
}
.leaflet-container {
  font-family: inherit;
}
</style>
