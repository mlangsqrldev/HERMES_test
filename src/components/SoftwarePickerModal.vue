<template>
  <dialog class="modal z-[9999]" :class="{ 'modal-open': isOpen }">
    <div
      class="modal-box max-w-4xl p-0 overflow-hidden flex flex-col max-h-[90vh] bg-base-100 shadow-2xl border border-base-300"
    >
      <!-- Header -->
      <div
        class="p-5 bg-base-200/80 border-b border-base-300 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shadow-sm"
          >
            💻
          </div>
          <div>
            <h3 class="font-bold text-lg leading-tight text-base-content">
              {{
                mode === "manage"
                  ? locale === "de"
                    ? "Software- & Pipeline-Pool verwalten"
                    : "Manage Software & Pipeline Pool"
                  : locale === "de"
                    ? "Software auswählen"
                    : "Select Software"
              }}
            </h3>
            <p class="text-xs text-base-content/60 mt-0.5">
              {{
                mode === "manage"
                  ? locale === "de"
                    ? "Zentraler Datenpool für 3D-Rekonstruktions-, Scan- und Modellierungs-Software. Steht allen Formularen zur Verfügung."
                    : "Central pool for 3D reconstruction, scanning and modeling software. Available across all forms."
                  : locale === "de"
                    ? "Wählen Sie eine Software aus dem Pool zur Übernahme mit Version und Funktion."
                    : "Select a software tool from the pool to apply its name, version and role."
              }}
            </p>
          </div>
        </div>
        <button
          type="button"
          class="btn btn-sm btn-circle btn-ghost"
          @click="emitClose"
        >
          ✕
        </button>
      </div>

      <!-- Search & Controls Bar -->
      <div
        class="p-4 border-b border-base-200 bg-base-100 flex flex-wrap items-center justify-between gap-3"
      >
        <div class="flex-1 min-w-[240px] relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            v-model="searchQuery"
            :placeholder="
              locale === 'de'
                ? 'Nach Software, Version, Kategorie oder Rolle suchen...'
                : 'Search by software name, version, category or role...'
            "
            class="input input-sm input-bordered w-full pl-9 focus:border-primary text-xs"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="btn btn-xs btn-ghost btn-circle absolute right-2 top-1/2 -translate-y-1/2"
          >
            ✕
          </button>
        </div>

        <!-- Filter Chips -->
        <div class="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            class="btn btn-xs"
            :class="
              filterCategory === 'all'
                ? 'btn-neutral'
                : 'btn-ghost border border-base-300'
            "
            @click="filterCategory = 'all'"
          >
            {{ locale === "de" ? "Alle" : "All" }} ({{ savedSoftware.length }})
          </button>
          <button
            type="button"
            class="btn btn-xs"
            :class="
              filterCategory === 'photogrammetry'
                ? 'btn-neutral'
                : 'btn-ghost border border-base-300'
            "
            @click="filterCategory = 'photogrammetry'"
          >
            📷 Photogrammetrie
          </button>
          <button
            type="button"
            class="btn btn-xs"
            :class="
              filterCategory === 'sls'
                ? 'btn-neutral'
                : 'btn-ghost border border-base-300'
            "
            @click="filterCategory = 'sls'"
          >
            💡 SLS / Scan
          </button>
          <button
            type="button"
            class="btn btn-xs"
            :class="
              filterCategory === '3d'
                ? 'btn-neutral'
                : 'btn-ghost border border-base-300'
            "
            @click="filterCategory = '3d'"
          >
            🧊 3D &amp; Mesh
          </button>
        </div>

        <!-- Toggle Add Form Button -->
        <button
          type="button"
          class="btn btn-sm btn-outline btn-primary gap-1"
          @click="showAddForm = !showAddForm"
        >
          <span class="text-base font-bold">{{ showAddForm ? "−" : "+" }}</span>
          {{ locale === "de" ? "Neue Software anlegen" : "Add Software" }}
        </button>
      </div>

      <!-- Add/Edit Form Collapsible -->
      <div
        v-if="showAddForm"
        class="p-4 bg-primary/5 border-b border-primary/20 animate-fadeIn"
      >
        <h4
          class="font-bold text-xs uppercase text-primary mb-3 flex items-center gap-1.5"
        >
          <span>{{ editingIndex !== null ? "✏️" : "✨" }}</span>
          <span>{{
            editingIndex !== null
              ? locale === "de"
                ? "Software bearbeiten"
                : "Edit Software"
              : locale === "de"
                ? "Neue Software zur festen Liste hinzufügen"
                : "Add New Software to Master Pool"
          }}</span>
        </h4>
        <form
          @submit.prevent="saveSoftwareForm"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs"
        >
          <div>
            <label class="label py-0.5"
              ><span class="label-text text-[11px] font-bold"
                >Software-Name *</span
              ></label
            >
            <input
              type="text"
              v-model="formState.name"
              required
              placeholder="z.B. Agisoft Metashape"
              class="input input-sm input-bordered w-full text-xs"
            />
          </div>
          <div>
            <label class="label py-0.5"
              ><span class="label-text text-[11px] font-bold"
                >Version</span
              ></label
            >
            <input
              type="text"
              v-model="formState.version"
              placeholder="z.B. 2.1 oder 4.2 LTS"
              class="input input-sm input-bordered w-full text-xs font-mono"
            />
          </div>
          <div>
            <label class="label py-0.5"
              ><span class="label-text text-[11px] font-bold"
                >Kategorie</span
              ></label
            >
            <input
              type="text"
              v-model="formState.category"
              placeholder="z.B. Photogrammetrie & SfM"
              class="input input-sm input-bordered w-full text-xs"
            />
          </div>
          <div>
            <label class="label py-0.5"
              ><span class="label-text text-[11px] font-bold"
                >Funktion / Rolle</span
              ></label
            >
            <input
              type="text"
              v-model="formState.role"
              placeholder="z.B. Dense Cloud Reconstruction"
              class="input input-sm input-bordered w-full text-xs"
            />
          </div>
          <div
            class="md:col-span-2 lg:col-span-4 flex items-center justify-end gap-2 pt-2"
          >
            <button
              type="button"
              class="btn btn-xs btn-ghost"
              @click="cancelEdit"
            >
              {{ locale === "de" ? "Abbrechen" : "Cancel" }}
            </button>
            <button type="submit" class="btn btn-xs btn-primary font-bold">
              {{
                editingIndex !== null
                  ? locale === "de"
                    ? "Änderungen speichern"
                    : "Save Changes"
                  : locale === "de"
                    ? "Hinzufügen"
                    : "Add to Pool"
              }}
            </button>
          </div>
        </form>
      </div>

      <!-- Main Software Table / List -->
      <div class="flex-1 overflow-y-auto p-4">
        <div
          class="border border-base-200 rounded-xl overflow-hidden shadow-2xs bg-base-100"
        >
          <table class="table table-sm w-full">
            <thead
              class="bg-base-200/60 text-xs font-bold uppercase text-base-content/70"
            >
              <tr>
                <th>Software-Name</th>
                <th class="w-24">Version</th>
                <th>Kategorie</th>
                <th>Typische Rolle / Funktion</th>
                <th class="w-32 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(sw, idx) in filteredSoftware"
                :key="sw.id || idx"
                class="hover cursor-pointer transition-colors"
                @click="mode === 'select' ? selectSoftware(sw) : null"
              >
                <td>
                  <div class="flex items-center gap-2">
                    <span class="text-base">💻</span>
                    <div>
                      <div class="font-bold text-xs text-base-content">
                        {{ sw.name }}
                      </div>
                      <div
                        v-if="sw.description"
                        class="text-[10px] text-base-content/50 max-w-xs truncate"
                      >
                        {{ sw.description }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="font-mono text-xs text-primary font-semibold">
                  {{ sw.version || "—" }}
                </td>
                <td>
                  <span class="badge badge-ghost badge-xs text-[10px]">{{
                    sw.category || "Allgemein"
                  }}</span>
                </td>
                <td class="text-xs text-base-content/75 max-w-xs truncate">
                  {{ sw.role || "—" }}
                </td>
                <td class="text-right" @click.stop>
                  <div class="flex items-center justify-end gap-1">
                    <button
                      v-if="mode === 'select'"
                      type="button"
                      class="btn btn-xs btn-primary gap-1 font-bold"
                      @click="selectSoftware(sw)"
                    >
                      ✓ {{ locale === "de" ? "Wählen" : "Select" }}
                    </button>
                    <button
                      type="button"
                      class="btn btn-xs btn-ghost btn-circle text-base-content/60 hover:text-base-content"
                      @click="startEdit(sw)"
                      title="Bearbeiten"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      class="btn btn-xs btn-ghost btn-circle text-error/60 hover:text-error"
                      @click="deleteSoftware(sw)"
                      title="Löschen"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredSoftware.length === 0">
                <td
                  colspan="5"
                  class="text-center py-8 text-base-content/40 italic text-xs"
                >
                  {{
                    locale === "de"
                      ? "Keine Software im Pool gefunden."
                      : "No software found matching query."
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="p-3 bg-base-200/60 border-t border-base-200 flex items-center justify-between text-xs"
      >
        <div class="flex items-center gap-2 text-base-content/60">
          <span
            >{{ savedSoftware.length }}
            {{
              locale === "de"
                ? "Software-Pakete im Pool"
                : "software packages in pool"
            }}</span
          >
          <span>•</span>
          <button
            type="button"
            class="link link-hover text-primary font-semibold text-[11px]"
            @click="resetSoftwareToDefaults"
            :title="
              locale === 'de'
                ? 'Setzt die Liste auf die kuratierte Standardauswahl zurück'
                : 'Reset to default curated software'
            "
          >
            ↺
            {{
              locale === "de"
                ? "Auf Standard-Pool zurücksetzen"
                : "Reset to Defaults"
            }}
          </button>
        </div>
        <button type="button" class="btn btn-sm btn-ghost" @click="emitClose">
          {{ locale === "de" ? "Schließen" : "Close" }}
        </button>
      </div>
    </div>
    <form
      method="dialog"
      class="modal-backdrop bg-black/50 backdrop-blur-sm"
      @click="emitClose"
    >
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import {
  savedSoftware,
  addOrUpdateSoftware,
  removeSavedSoftware,
  updateSavedSoftware,
  resetSoftwareToDefaults,
} from "../utils/sharedState.js";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: "manage", // 'manage' | 'select'
  },
  locale: {
    type: String,
    default: "de",
  },
});

const emit = defineEmits(["close", "select"]);

const searchQuery = ref("");
const filterCategory = ref("all");
const showAddForm = ref(false);
const editingIndex = ref(null);

const formState = reactive({
  name: "",
  version: "",
  category: "",
  role: "",
  description: "",
});

const emitClose = () => {
  showAddForm.value = false;
  editingIndex.value = null;
  emit("close");
};

const filteredSoftware = computed(() => {
  let list = savedSoftware.value || [];

  if (filterCategory.value === "photogrammetry") {
    list = list.filter(
      (s) =>
        (s.category || "").toLowerCase().includes("photo") ||
        (s.name || "").toLowerCase().includes("meta") ||
        (s.name || "").toLowerCase().includes("reality"),
    );
  } else if (filterCategory.value === "sls") {
    list = list.filter(
      (s) =>
        (s.category || "").toLowerCase().includes("scan") ||
        (s.category || "").toLowerCase().includes("sls") ||
        (s.name || "").toLowerCase().includes("artec"),
    );
  } else if (filterCategory.value === "3d") {
    list = list.filter(
      (s) =>
        (s.category || "").toLowerCase().includes("3d") ||
        (s.category || "").toLowerCase().includes("mesh") ||
        (s.name || "").toLowerCase().includes("blender"),
    );
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase();
    list = list.filter(
      (s) =>
        (s.name || "").toLowerCase().includes(q) ||
        (s.version || "").toLowerCase().includes(q) ||
        (s.category || "").toLowerCase().includes(q) ||
        (s.role || "").toLowerCase().includes(q),
    );
  }

  return list;
});

const selectSoftware = (sw) => {
  emit("select", sw);
  emitClose();
};

const startEdit = (sw) => {
  const idx = savedSoftware.value.findIndex((s) => s === sw || s.id === sw.id);
  editingIndex.value = idx !== -1 ? idx : null;
  formState.name = sw.name || "";
  formState.version = sw.version || "";
  formState.category = sw.category || "";
  formState.role = sw.role || "";
  formState.description = sw.description || "";
  showAddForm.value = true;
};

const cancelEdit = () => {
  editingIndex.value = null;
  formState.name = "";
  formState.version = "";
  formState.category = "";
  formState.role = "";
  formState.description = "";
  showAddForm.value = false;
};

const saveSoftwareForm = () => {
  if (!formState.name.trim()) return;
  if (editingIndex.value !== null) {
    updateSavedSoftware(editingIndex.value, { ...formState });
  } else {
    addOrUpdateSoftware({ ...formState });
  }
  cancelEdit();
};

const deleteSoftware = (sw) => {
  const idx = savedSoftware.value.findIndex((s) => s === sw || s.id === sw.id);
  if (idx !== -1) {
    removeSavedSoftware(idx);
  }
};
</script>
