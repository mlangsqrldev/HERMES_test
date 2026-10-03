<template>
  <dialog class="modal" :class="{ 'modal-open': isOpen }">
    <div class="modal-box max-w-xl p-0 overflow-hidden flex flex-col bg-base-100 shadow-2xl border border-base-300">
      <!-- Header -->
      <div class="p-5 bg-base-200/80 border-b border-base-300 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center text-lg">
            🔑
          </div>
          <div>
            <h3 class="font-bold text-lg leading-tight">
              {{ currentLocale === 'de' ? 'API-Zugangsdaten' : 'API Credentials' }}
            </h3>
            <p class="text-xs text-base-content/60 mt-0.5">
              {{ currentLocale === 'de'
                ? 'Zugangsdaten & Status externer Dienste (GeoNames, GND / Lobid, Wikidata, Pleiades)'
                : 'Credentials & status of external services (GeoNames, GND / Lobid, Wikidata, Pleiades)' }}
            </p>
          </div>
        </div>
        <button type="button" class="btn btn-sm btn-circle btn-ghost" @click="$emit('close')">✕</button>
      </div>

      <!-- Body -->
      <div class="p-6 flex flex-col gap-5 overflow-y-auto">

        <!-- GeoNames -->
        <div class="border border-base-200 rounded-xl p-4">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-xl">🌍</span>
            <div>
              <h4 class="font-bold text-sm">GeoNames</h4>
              <p class="text-xs text-base-content/60">
                {{ currentLocale === 'de'
                  ? 'Kostenloser Account unter geonames.org erforderlich'
                  : 'Free account at geonames.org required (modern place search)' }}
              </p>
            </div>
            <a href="https://www.geonames.org/login" target="_blank"
               class="ml-auto btn btn-xs btn-ghost btn-outline gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {{ currentLocale === 'de' ? 'Registrieren' : 'Register' }}
            </a>
          </div>
          <label class="label py-1">
            <span class="label-text text-xs font-bold">
              {{ currentLocale === 'de' ? 'GeoNames Benutzername' : 'GeoNames Username' }}
            </span>
          </label>
          <div class="relative">
            <input
              id="api-geonames-username"
              type="text"
              v-model="form.geonamesUsername"
              class="input input-sm input-bordered w-full font-mono text-xs pr-8"
              :placeholder="currentLocale === 'de' ? 'z.B. mein_benutzername' : 'e.g. my_username'"
              autocomplete="off"
            />
            <span v-if="form.geonamesUsername" class="absolute right-2 top-1/2 -translate-y-1/2 text-success text-sm">✓</span>
          </div>
          <p class="text-[11px] text-base-content/50 mt-1.5">
            {{ currentLocale === 'de'
              ? 'Wird nur für API-Abfragen an api.geonames.org verwendet. Nie weitergeleitet.'
              : 'Only used for API queries to api.geonames.org. Never transmitted elsewhere.' }}
          </p>
        </div>

        <!-- Wikidata -->
        <div class="border border-base-200 rounded-xl p-4">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-xl">🔗</span>
            <div>
              <h4 class="font-bold text-sm">Wikidata</h4>
              <p class="text-xs text-base-content/60">
                {{ currentLocale === 'de'
                  ? 'Kein Account erforderlich – SPARQL-Endpoint ist öffentlich'
                  : 'No account required – SPARQL endpoint is public' }}
              </p>
            </div>
            <span class="ml-auto badge badge-success badge-sm gap-1 font-normal">
              ● {{ currentLocale === 'de' ? 'Öffentlich' : 'Public' }}
            </span>
          </div>
          <label class="label py-1">
            <span class="label-text text-xs font-bold">
              {{ currentLocale === 'de' ? 'Bevorzugte Beschriftungssprache' : 'Preferred Label Language' }}
            </span>
          </label>
          <select id="api-wikidata-lang" v-model="form.wikidataLang" class="select select-sm select-bordered w-full text-xs">
            <option value="de">🇩🇪 Deutsch (de)</option>
            <option value="en">🇬🇧 English (en)</option>
            <option value="fr">🇫🇷 Français (fr)</option>
            <option value="it">🇮🇹 Italiano (it)</option>
            <option value="es">🇪🇸 Español (es)</option>
          </select>
        </div>

        <!-- Pleiades -->
        <div class="border border-base-200 rounded-xl p-4">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xl">🏛️</span>
            <div>
              <h4 class="font-bold text-sm">Pleiades</h4>
              <p class="text-xs text-base-content/60">
                {{ currentLocale === 'de'
                  ? 'Kein Account erforderlich – API für antike Orte ist öffentlich'
                  : 'No account required – ancient places API is public' }}
              </p>
            </div>
            <span class="ml-auto badge badge-success badge-sm gap-1 font-normal">
              ● {{ currentLocale === 'de' ? 'Öffentlich' : 'Public' }}
            </span>
          </div>
          <p class="text-[11px] text-base-content/50 mt-2">
            pleiades.stoa.org – {{ currentLocale === 'de' ? 'Für antike Ortsnamen und Koordinaten.' : 'For ancient place names and coordinates.' }}
          </p>
        </div>

        <!-- Lobid / GND -->
        <div class="border border-base-200 rounded-xl p-4">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xl">🏛️</span>
            <div>
              <h4 class="font-bold text-sm">GND (Gemeinsame Normdatei / Lobid)</h4>
              <p class="text-xs text-base-content/60">
                {{ currentLocale === 'de'
                  ? 'Kein Account erforderlich – Schnelle offene Schnittstelle der DNB / hbz'
                  : 'No account required – Fast open API by German National Library / hbz' }}
              </p>
            </div>
            <span class="ml-auto badge badge-success badge-sm gap-1 font-normal">
              ● {{ currentLocale === 'de' ? 'Öffentlich' : 'Public' }}
            </span>
          </div>
          <p class="text-[11px] text-base-content/50 mt-2">
            lobid.org/gnd – {{ currentLocale === 'de' ? 'Ermöglicht blitzschnelle Suche nach Körperschaften, Museen, Sammlungen und Einrichtungen.' : 'Enables lightning-fast search for corporate bodies, museums, collections and institutions.' }}
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-base-200 bg-base-200/40 flex items-center justify-between gap-3">
        <div class="text-xs text-success flex items-center gap-1.5" v-if="saved">
          ✅ <span class="font-bold">{{ currentLocale === 'de' ? 'Gespeichert!' : 'Saved!' }}</span>
        </div>
        <div v-else class="text-xs text-base-content/50 italic">
          {{ currentLocale === 'de' ? 'Daten werden nur lokal gespeichert.' : 'Credentials are stored locally only.' }}
        </div>
        <div class="flex gap-2">
          <button type="button" class="btn btn-sm btn-ghost" @click="$emit('close')">
            {{ currentLocale === 'de' ? 'Abbrechen' : 'Cancel' }}
          </button>
          <button type="button" class="btn btn-sm btn-primary gap-1.5" @click="saveSettings">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ currentLocale === 'de' ? 'Speichern' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
    <div class="modal-backdrop bg-black/40 backdrop-blur-sm" @click="$emit('close')"></div>
  </dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { apiCredentials, saveApiCredentials } from '../utils/sharedState.js';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  currentLocale: { type: String, default: 'de' }
});

const emit = defineEmits(['close']);
const saved = ref(false);

const form = reactive({
  geonamesUsername: apiCredentials.geonamesUsername || '',
  wikidataLang: apiCredentials.wikidataLang || 'de',
});

watch(() => props.isOpen, (val) => {
  if (val) {
    form.geonamesUsername = apiCredentials.geonamesUsername || '';
    form.wikidataLang = apiCredentials.wikidataLang || 'de';
    saved.value = false;
  }
});

const saveSettings = () => {
  saveApiCredentials({ ...form });
  saved.value = true;
  setTimeout(() => {
    saved.value = false;
    emit('close');
  }, 1200);
};
</script>
