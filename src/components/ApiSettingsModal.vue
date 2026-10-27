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
                ? 'Zugangsdaten & Webservice-Status für GeoNames'
                : 'Credentials & webservice status for GeoNames' }}
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
          <div class="flex flex-col gap-2">
            <div>
              <label class="label py-1">
                <span class="label-text text-xs font-bold">
                  {{ currentLocale === 'de' ? 'GeoNames Benutzername (Username)' : 'GeoNames Username' }}
                </span>
                <span class="text-accent font-bold text-xs">*</span>
              </label>
              <div class="relative">
                <input
                  id="api-geonames-username"
                  type="text"
                  v-model="form.geonamesUsername"
                  class="input input-sm input-bordered w-full font-mono text-xs pr-8"
                  :placeholder="currentLocale === 'de' ? 'z.B. mein_geonames_account' : 'e.g. my_geonames_account'"
                  autocomplete="off"
                />
                <span v-if="form.geonamesUsername" class="absolute right-2 top-1/2 -translate-y-1/2 text-success text-sm">✓</span>
              </div>
            </div>

            <div>
              <label class="label py-1">
                <span class="label-text text-xs font-bold text-base-content/80">
                  {{ currentLocale === 'de' ? 'GeoNames Passwort / Token (optional)' : 'GeoNames Password / Token (optional)' }}
                </span>
                <span class="badge badge-xs badge-ghost text-[10px]">{{ currentLocale === 'de' ? 'Nur bei Premium' : 'Premium only' }}</span>
              </label>
              <input
                id="api-geonames-password"
                type="password"
                v-model="form.geonamesPassword"
                class="input input-sm input-bordered w-full font-mono text-xs"
                :placeholder="currentLocale === 'de' ? 'Optionales Passwort / Token' : 'Optional password / token'"
                autocomplete="new-password"
              />
            </div>
          </div>

          <div class="mt-2.5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              class="btn btn-xs btn-outline gap-1.5"
              :disabled="!form.geonamesUsername || isTesting"
              @click="testGeonamesConnection"
            >
              <svg v-if="isTesting" class="animate-spin size-3 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"/>
              </svg>
              <span>🔍</span>
              {{ currentLocale === 'de' ? 'Verbindung testen' : 'Test Connection' }}
            </button>

            <span v-if="testResult" class="text-xs font-semibold" :class="testResult.success ? 'text-success' : 'text-error'">
              {{ testResult.message }}
            </span>
          </div>

          <div class="mt-2.5 p-2.5 rounded-lg bg-base-200/60 border border-base-300/80 text-[11px] text-base-content/70 leading-relaxed">
            <span class="font-bold text-info">💡 {{ currentLocale === 'de' ? 'Wichtiger Hinweis zu GeoNames:' : 'Important note for GeoNames:' }}</span>
            {{ currentLocale === 'de'
              ? 'Für die weltweite Ortssuche benötigt GeoNames ausschließlich Ihren registrierten Benutzernamen. Nach der kostenlosen Registrierung auf geonames.org muss unter „Manage Account“ lediglich einmalig auf „Enable Free Web Services“ geklickt werden.'
              : 'For global place search, GeoNames only requires your registered username. After free registration at geonames.org, simply click "Enable Free Web Services" once on your account page.' }}
          </div>

          <!-- Free Webservice Activation Alert -->
          <div v-if="testResult && testResult.needsActivation" class="mt-3 p-3 rounded-xl bg-warning/15 border border-warning/40 text-xs space-y-2">
            <div class="font-bold text-warning-content flex items-center gap-1.5">
              <span>⚠️</span>
              <span>{{ currentLocale === 'de' ? 'GeoNames-Account muss einmalig freigeschaltet werden' : 'GeoNames account must be enabled once' }}</span>
            </div>
            <p class="text-base-content/80 text-[11px] leading-relaxed">
              {{ currentLocale === 'de'
                ? 'Ihr Benutzername ist korrekt! GeoNames deaktiviert neue Accounts jedoch standardmäßig für Webdienste, bis Sie sich auf geonames.org einloggen und auf der Seite „Manage Account“ auf „Click here to enable free webservices“ klicken.'
                : 'Your username is correct! However, GeoNames disables new accounts for web services by default until you log in and click "Click here to enable free webservices" on the "Manage Account" page.' }}
            </p>
            <div>
              <a
                href="https://www.geonames.org/manageaccount"
                target="_blank"
                rel="noopener"
                class="btn btn-xs btn-warning text-warning-content font-bold gap-1 shadow-xs"
              >
                <span>🔗</span>
                <span>{{ currentLocale === 'de' ? 'Freischaltung öffnen (geonames.org/manageaccount) ↗' : 'Open Activation Page (geonames.org/manageaccount) ↗' }}</span>
              </a>
            </div>
          </div>
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
  geonamesPassword: apiCredentials.geonamesPassword || '',
});

watch(() => props.isOpen, (val) => {
  if (val) {
    form.geonamesUsername = apiCredentials.geonamesUsername || '';
    form.geonamesPassword = apiCredentials.geonamesPassword || '';
    saved.value = false;
    testResult.value = null;
  }
});

const isTesting = ref(false);
const testResult = ref(null);

const testGeonamesConnection = async () => {
  if (!form.geonamesUsername) return;
  isTesting.value = true;
  testResult.value = null;

  try {
    const uname = encodeURIComponent(form.geonamesUsername.trim());
    const url = `https://secure.geonames.org/searchJSON?q=Berlin&maxRows=1&username=${uname}&type=json`;
    const res = await fetch(url);
    const data = await res.json().catch(() => null);

    if (data?.status?.message) {
      const isActivationError = data.status.value === 19 || String(data.status.message).toLowerCase().includes('not enabled');
      testResult.value = {
        success: false,
        needsActivation: isActivationError,
        message: isActivationError
          ? (props.currentLocale === 'de'
              ? '⚠️ Account noch nicht für Webdienste freigeschaltet (siehe Hinweis unten)'
              : '⚠️ Account not yet enabled for web services (see note below)')
          : `⚠️ GeoNames: ${data.status.message}`
      };
      return;
    }

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    if (Array.isArray(data?.geonames) && data.geonames.length > 0) {
      testResult.value = {
        success: true,
        needsActivation: false,
        message: props.currentLocale === 'de'
          ? `✓ Verbindung erfolgreich! (${data.geonames[0].name}, ${data.geonames[0].countryCode})`
          : `✓ Connection successful! (${data.geonames[0].name}, ${data.geonames[0].countryCode})`
      };
    } else {
      testResult.value = {
        success: true,
        needsActivation: false,
        message: props.currentLocale === 'de' ? '✓ Server erreichbar' : '✓ Server reached'
      };
    }
  } catch (err) {
    testResult.value = {
      success: false,
      needsActivation: false,
      message: props.currentLocale === 'de'
        ? `Fehler beim Verbindungstest: ${err.message}`
        : `Connection test error: ${err.message}`
    };
  } finally {
    isTesting.value = false;
  }
};

const saveSettings = () => {
  saveApiCredentials({ ...form });
  saved.value = true;
  setTimeout(() => {
    saved.value = false;
    emit('close');
  }, 1200);
};
</script>
