<template>
  <div
    class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm"
  >
    <!-- Header -->
    <div
      class="flex flex-wrap justify-between items-center gap-2 mb-4 pb-2 border-b border-base-200"
    >
      <div class="flex flex-row items-center gap-1.5">
        <h4 class="font-bold text-lg capitalize text-base-content/80">
          {{
            title ||
            (currentLocale === "de" ? "Zeitliche Einordnung (Temporal)" : "Temporal")
          }}
        </h4>
        <div
          v-if="tooltip"
          @click.stop.prevent
          class="tooltip tooltip-accent tooltip-right"
          :data-tip="tooltip"
        >
          <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill-rule="evenodd"
              clip-rule="evenodd"
              viewBox="0 0 512 512"
              fill="currentColor"
              class="size-[1.2em]"
            >
              <path
                d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7z"
              />
            </svg>
          </button>
        </div>
      </div>

      <button
        type="button"
        class="btn btn-sm btn-outline btn-primary gap-1"
        @click.prevent="openModal(null)"
      >
        <span>+</span>
        {{ currentLocale === "de" ? "Temporal hinzufügen" : "Add Temporal" }}
      </button>
    </div>

    <!-- Entries Table -->
    <div v-if="items.length > 0" class="overflow-x-auto rounded-xl border border-base-200">
      <table class="table table-zebra table-sm w-full">
        <thead>
          <tr class="bg-base-200/60">
            <th>{{ currentLocale === "de" ? "Epoche / Periode" : "Period" }}</th>
            <th>{{ currentLocale === "de" ? "Beginn" : "Start Date" }}</th>
            <th>{{ currentLocale === "de" ? "Ende" : "End Date" }}</th>
            <th>{{ currentLocale === "de" ? "Anzeigedatum" : "Display Date" }}</th>
            <th>{{ currentLocale === "de" ? "Qualifier / URI" : "Qualifier / URI" }}</th>
            <th class="w-24 text-right">
              {{ currentLocale === "de" ? "Aktionen" : "Actions" }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in items" :key="idx" class="hover">
            <td class="font-bold text-sm">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span>{{ item["periodName"] || "–" }}</span>
                <span
                  v-if="
                    item['timeSpan.dateRangeQualifier'] &&
                    item['timeSpan.dateRangeQualifier'].includes('ark:/99152')
                  "
                  class="badge badge-info badge-outline badge-xs font-mono"
                >
                  PeriodO
                </span>
                <span
                  v-else-if="
                    item['timeSpan.dateRangeQualifier'] &&
                    item['timeSpan.dateRangeQualifier'].includes('hector')
                  "
                  class="badge badge-primary badge-xs font-mono"
                >
                  HECTOR
                </span>
              </div>
            </td>
            <td class="font-mono text-xs font-semibold">
              {{ item["timeSpan.startDate"] || "–" }}
            </td>
            <td class="font-mono text-xs font-semibold">
              {{ item["timeSpan.endDate"] || "–" }}
            </td>
            <td class="text-xs text-base-content/80">
              {{ item["displayDate"] || "–" }}
            </td>
            <td class="text-xs font-mono">
              <a
                v-if="
                  item['timeSpan.dateRangeQualifier'] &&
                  item['timeSpan.dateRangeQualifier'].startsWith('http')
                "
                :href="item['timeSpan.dateRangeQualifier']"
                target="_blank"
                rel="noopener"
                class="link link-primary text-[11px] truncate max-w-[160px] inline-block"
                :title="item['timeSpan.dateRangeQualifier']"
              >
                {{
                  item["timeSpan.dateRangeQualifier"]
                    .replace("http://n2t.net/", "")
                    .replace(
                      "http://vocabs.bcdh.uni-bonn.de/hector_epochs/",
                      "hector:",
                    )
                }}
              </a>
              <span v-else>{{ item["timeSpan.dateRangeQualifier"] || "–" }}</span>
            </td>
            <td class="text-right">
              <div class="flex gap-1 justify-end">
                <button
                  type="button"
                  class="btn btn-xs btn-ghost text-info"
                  @click.prevent="openModal(idx)"
                >
                  {{ currentLocale === "de" ? "Bearbeiten" : "Edit" }}
                </button>
                <button
                  type="button"
                  class="btn btn-xs btn-ghost text-error hover:bg-error/10"
                  @click.prevent="removeItem(idx)"
                  :title="currentLocale === 'de' ? 'Löschen' : 'Delete'"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="text-center py-4 text-xs opacity-60 italic border border-dashed border-base-300 rounded-xl"
    >
      {{
        currentLocale === "de"
          ? "Noch keine zeitlichen Einträge vorhanden. Klicken Sie auf „Temporal hinzufügen“."
          : "No temporal entries yet. Click 'Add Temporal' to add one."
      }}
    </div>

    <!-- Centered Modal -->
    <dialog class="modal z-[9999]" :class="{ 'modal-open': isModalOpen }">
      <div
        class="modal-box max-w-2xl w-11/12 bg-base-100 border border-base-300 shadow-2xl p-0 overflow-hidden flex flex-col max-h-[90vh]"
      >
        <!-- Modal Header -->
        <div
          class="px-5 py-4 bg-base-200/70 border-b border-base-300 flex items-center justify-between gap-3 shrink-0"
        >
          <div class="flex items-center gap-2.5">
            <div
              class="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg"
            >
              ⏳
            </div>
            <div>
              <h3 class="font-bold text-base leading-tight">
                {{
                  editingIndex !== null
                    ? currentLocale === "de"
                      ? "Temporal-Eintrag bearbeiten"
                      : "Edit Temporal Entry"
                    : currentLocale === "de"
                      ? "Temporal hinzufügen"
                      : "Add Temporal Entry"
                }}
              </h3>
              <p class="text-xs text-base-content/60">
                {{
                  currentLocale === "de"
                    ? "Epoche (PeriodO/HECTOR) oder konkrete Zeitspanne erfassen"
                    : "Specify historical period (PeriodO/HECTOR) or explicit date span"
                }}
              </p>
            </div>
          </div>
          <button
            type="button"
            class="btn btn-sm btn-ghost btn-circle"
            @click="closeModal"
          >
            ✕
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-5 overflow-y-auto space-y-4 flex-1">
          <!-- Period Name with PeriodO / HECTOR Autocomplete -->
          <div class="form-control w-full">
            <label class="label py-1">
              <span class="label-text font-bold text-xs uppercase tracking-wider">
                {{
                  currentLocale === "de"
                    ? "Epoche / Periode (PeriodName)"
                    : "Period Name"
                }}
              </span>
            </label>
            <PeriodoAutocomplete
              :current-locale="currentLocale"
              v-model="draft['periodName']"
              @select="handlePeriodoSelect"
            />
          </div>

          <!-- Start & End Date -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="form-control w-full">
              <label class="label py-1">
                <span class="label-text font-bold text-xs uppercase tracking-wider">
                  {{
                    currentLocale === "de"
                      ? "Beginn (Start Date)"
                      : "Start Date"
                  }}
                </span>
              </label>
              <input
                type="text"
                v-model="draft['timeSpan.startDate']"
                class="input input-sm input-bordered w-full font-mono"
                :placeholder="
                  currentLocale === 'de'
                    ? 'z. B. -450, 48 oder 2024-05-01'
                    : 'e.g. -450, 48 or 2024-05-01'
                "
              />
            </div>

            <div class="form-control w-full">
              <label class="label py-1">
                <span class="label-text font-bold text-xs uppercase tracking-wider">
                  {{
                    currentLocale === "de" ? "Ende (End Date)" : "End Date"
                  }}
                </span>
              </label>
              <input
                type="text"
                v-model="draft['timeSpan.endDate']"
                class="input input-sm input-bordered w-full font-mono"
                :placeholder="
                  currentLocale === 'de'
                    ? 'z. B. -400, 120 oder 2025-12-31'
                    : 'e.g. -400, 120 or 2025-12-31'
                "
              />
            </div>
          </div>

          <!-- Display Date -->
          <div class="form-control w-full">
            <label class="label py-1">
              <span class="label-text font-bold text-xs uppercase tracking-wider">
                {{
                  currentLocale === "de"
                    ? "Anzeigedatum / Freitext (Display Date)"
                    : "Display Date"
                }}
              </span>
            </label>
            <input
              type="text"
              v-model="draft['displayDate']"
              class="input input-sm input-bordered w-full"
              :placeholder="
                currentLocale === 'de'
                  ? 'z. B. 5. Jahrhundert v. Chr. / Klassik'
                  : 'e.g. 5th century BCE / Classical'
              "
            />
          </div>

          <!-- Date Range Qualifier / URI -->
          <div class="form-control w-full">
            <label class="label py-1">
              <span class="label-text font-bold text-xs uppercase tracking-wider">
                {{
                  currentLocale === "de"
                    ? "Qualifier / Normdaten-URI (Date Range Qualifier)"
                    : "Date Range Qualifier / Authority URI"
                }}
              </span>
            </label>
            <input
              type="text"
              v-model="draft['timeSpan.dateRangeQualifier']"
              class="input input-sm input-bordered w-full font-mono text-xs"
              placeholder="http://n2t.net/ark:/99152/... oder throughout"
            />
          </div>
        </div>

        <!-- Modal Footer -->
        <div
          class="px-5 py-3.5 bg-base-200/70 border-t border-base-300 flex justify-end gap-2 shrink-0"
        >
          <button type="button" class="btn btn-sm btn-ghost" @click="closeModal">
            {{ currentLocale === "de" ? "Abbrechen" : "Cancel" }}
          </button>
          <button
            type="button"
            class="btn btn-sm btn-primary font-bold"
            @click="saveEntry"
          >
            {{
              editingIndex !== null
                ? currentLocale === "de"
                  ? "Änderungen speichern"
                  : "Save Changes"
                : currentLocale === "de"
                  ? "Übernehmen"
                  : "Add Entry"
            }}
          </button>
        </div>
      </div>
      <form
        method="dialog"
        class="modal-backdrop bg-black/50 backdrop-blur-sm"
        @click="closeModal"
      >
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import PeriodoAutocomplete from "./PeriodoAutocomplete.vue";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  currentLocale: {
    type: String,
    default: "de",
  },
  title: {
    type: String,
    default: "",
  },
  tooltip: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const items = computed(() =>
  Array.isArray(props.modelValue) ? props.modelValue : [],
);

const isModalOpen = ref(false);
const editingIndex = ref(null);

const draft = reactive({
  periodName: "",
  "timeSpan.startDate": "",
  "timeSpan.endDate": "",
  displayDate: "",
  "timeSpan.dateRangeQualifier": "",
});

const resetDraft = () => {
  draft.periodName = "";
  draft["timeSpan.startDate"] = "";
  draft["timeSpan.endDate"] = "";
  draft.displayDate = "";
  draft["timeSpan.dateRangeQualifier"] = "";
};

const openModal = (idx = null) => {
  resetDraft();
  if (idx !== null && items.value[idx]) {
    editingIndex.value = idx;
    const item = items.value[idx];
    draft.periodName = item.periodName || "";
    draft["timeSpan.startDate"] = item["timeSpan.startDate"] || "";
    draft["timeSpan.endDate"] = item["timeSpan.endDate"] || "";
    draft.displayDate = item.displayDate || "";
    draft["timeSpan.dateRangeQualifier"] =
      item["timeSpan.dateRangeQualifier"] || "";
  } else {
    editingIndex.value = null;
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editingIndex.value = null;
};

const handlePeriodoSelect = (data) => {
  if (!data) return;
  if (data.label) draft.periodName = data.label;
  if (data.start !== undefined && data.start !== null) {
    draft["timeSpan.startDate"] = String(data.start);
  }
  if (data.stop !== undefined && data.stop !== null) {
    draft["timeSpan.endDate"] = String(data.stop);
  }
  if (data.displayDate) {
    draft.displayDate = data.displayDate;
  } else if (data.start && data.stop) {
    draft.displayDate = `${data.start} – ${data.stop}`;
  }
  if (data.uri) {
    draft["timeSpan.dateRangeQualifier"] = data.uri;
  }
};

const saveEntry = () => {
  const entry = {
    periodName: (draft.periodName || "").trim(),
    "timeSpan.startDate": (draft["timeSpan.startDate"] || "").trim(),
    "timeSpan.endDate": (draft["timeSpan.endDate"] || "").trim(),
    displayDate: (draft.displayDate || "").trim(),
    "timeSpan.dateRangeQualifier": (
      draft["timeSpan.dateRangeQualifier"] || ""
    ).trim(),
  };

  const hasContent = Object.values(entry).some((v) => v !== "");
  if (!hasContent) {
    closeModal();
    return;
  }

  const next = [...items.value];
  if (editingIndex.value !== null) {
    next[editingIndex.value] = entry;
  } else {
    next.push(entry);
  }
  emit("update:modelValue", next);
  closeModal();
};

const removeItem = (idx) => {
  const next = [...items.value];
  next.splice(idx, 1);
  emit("update:modelValue", next);
};
</script>

