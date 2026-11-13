<template>
  <div class="space-y-3">
    <!-- Header Bar -->
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <span class="font-bold text-sm text-base-content">{{
          resolvedTitle
        }}</span>
        <span class="badge badge-sm badge-ghost font-mono">
          {{ items.length }}
        </span>
      </div>

      <div class="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          class="btn btn-xs btn-outline gap-1"
          @click="showOrgPicker = true"
        >
          🏛️
          {{
            currentLocale === "de" ? "Organisation wählen" : "Pick Organisation"
          }}
        </button>
        <button
          type="button"
          class="btn btn-xs btn-outline btn-primary gap-1"
          @click="showPersonPicker = true"
        >
          👤
          {{
            currentLocale === "de"
              ? "Aus Personen-Pool wählen"
              : "Pick from Person Pool"
          }}
        </button>
        <button
          type="button"
          class="btn btn-xs btn-primary gap-1"
          @click="openAddForm()"
        >
          <span>+</span>
          {{ currentLocale === "de" ? "Neu hinzufügen" : "Add New" }}
        </button>
      </div>
    </div>

    <!-- Helpful context hint for historical creators -->
    <div
      v-if="mode === 'historical'"
      class="text-xs text-base-content/70 bg-base-200/50 border border-base-300/70 rounded-lg px-3 py-2"
    >
      {{
        currentLocale === "de"
          ? "Hinweis: Hier werden ausschließlich historische Urheber:innen / Schöpfer:innen des Kulturguts eingetragen (z. B. Bildhauer, Architekt, Werkstatt). Falls unbekannt, bleibt dieses Feld leer."
          : "Note: Enter only historical creators/authors of the heritage asset here (e.g. sculptor, architect, workshop). Leave empty if unknown."
      }}
    </div>

    <!-- Inline Add / Edit Form -->
    <div
      v-if="showForm"
      class="p-4 rounded-xl bg-base-200/60 border border-primary/30 space-y-3"
    >
      <div class="flex items-center justify-between">
        <h5 class="font-bold text-xs uppercase tracking-wide text-primary">
          {{
            editingIndex !== null
              ? currentLocale === "de"
                ? "Eintrag bearbeiten"
                : "Edit Entry"
              : currentLocale === "de"
                ? "Person / Organisation zuweisen"
                : "Assign Person / Organisation"
          }}
        </h5>
        <button
          type="button"
          class="btn btn-xs btn-ghost btn-circle"
          @click="closeForm"
        >
          ✕
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <!-- Name -->
        <div>
          <label class="label py-1">
            <span class="label-text font-semibold">
              {{ currentLocale === "de" ? "Name / Bezeichnung" : "Name" }} *
            </span>
          </label>
          <input
            type="text"
            v-model="draft.name"
            class="input input-sm input-bordered w-full bg-base-100"
            :placeholder="
              mode === 'historical'
                ? currentLocale === 'de'
                  ? 'z. B. Polyklet oder Unbekannte Werkstatt'
                  : 'e.g. Polykleitos or Unknown Workshop'
                : currentLocale === 'de'
                  ? 'z. B. Dr. Max Mustermann'
                  : 'e.g. Dr. Jane Doe'
            "
          />
        </div>

        <!-- Type -->
        <div>
          <label class="label py-1">
            <span class="label-text font-semibold">
              {{ currentLocale === "de" ? "Typ" : "Type" }}
            </span>
          </label>
          <select
            v-model="draft.type"
            class="select select-sm select-bordered w-full bg-base-100"
          >
            <option value="person">
              {{ currentLocale === "de" ? "Einzelperson" : "Person" }}
            </option>
            <option value="organization">
              {{
                currentLocale === "de"
                  ? "Organisation / Institution"
                  : "Organization / Institution"
              }}
            </option>
            <option v-if="mode === 'historical'" value="workshop">
              {{
                currentLocale === "de"
                  ? "Werkstatt / Kollektiv"
                  : "Workshop / Collective"
              }}
            </option>
          </select>
        </div>

        <!-- Identifier (for historical & activity) OR Organization (for contact) -->
        <div v-if="mode === 'contact'">
          <label class="label py-1">
            <span class="label-text font-semibold">
              {{ currentLocale === "de" ? "Organisation" : "Organization" }}
            </span>
          </label>
          <input
            type="text"
            v-model="draft.organization"
            class="input input-sm input-bordered w-full bg-base-100"
            :placeholder="
              currentLocale === 'de'
                ? 'z. B. Universität Bonn'
                : 'e.g. University of Bonn'
            "
          />
        </div>
        <div v-else>
          <label class="label py-1">
            <span class="label-text font-semibold">
              {{
                currentLocale === "de"
                  ? "Identifikator (GND / ORCID / URI)"
                  : "Identifier (GND / ORCID / URI)"
              }}
            </span>
          </label>
          <input
            type="text"
            v-model="draft.id"
            class="input input-sm input-bordered w-full bg-base-100"
            :placeholder="
              currentLocale === 'de'
                ? 'https://d-nb.info/gnd/... oder https://orcid.org/...'
                : 'https://d-nb.info/gnd/... or https://orcid.org/...'
            "
          />
        </div>

        <!-- Email for contacts -->
        <div v-if="mode === 'contact'">
          <label class="label py-1">
            <span class="label-text font-semibold">E-Mail</span>
          </label>
          <input
            type="email"
            v-model="draft.email"
            class="input input-sm input-bordered w-full bg-base-100"
            placeholder="name@institution.de"
          />
        </div>

        <!-- Single Role input for historical & contact -->
        <div
          v-if="!isMultiRole"
          :class="mode === 'contact' ? 'md:col-span-2' : 'md:col-span-3'"
        >
          <label class="label py-1">
            <span class="label-text font-semibold">
              {{ currentLocale === "de" ? "Rolle" : "Role" }}
            </span>
          </label>
          <input
            type="text"
            v-model="draft.singleRole"
            :list="datalistId"
            class="input input-sm input-bordered w-full bg-base-100"
            :placeholder="
              mode === 'historical'
                ? currentLocale === 'de'
                  ? 'z. B. Bildhauer, Architekt, Maler, Werkstatt...'
                  : 'e.g. Sculptor, Architect, Painter...'
                : currentLocale === 'de'
                  ? 'z. B. Datenlieferant, Kurator, Katalogisierer...'
                  : 'e.g. Data Provider, Curator, Cataloguer...'
            "
          />
          <datalist :id="datalistId">
            <option v-for="r in suggestedRoles" :key="r" :value="r" />
          </datalist>
        </div>

        <!-- Multi-Role Chips + Custom Input for Activity -->
        <div v-else class="md:col-span-3 space-y-2">
          <label class="label py-1">
            <span class="label-text font-semibold">
              {{
                currentLocale === "de"
                  ? "Rollen in dieser Aktivität (Mehrfachauswahl möglich)"
                  : "Roles in this Activity (multiple allowed)"
              }}
            </span>
          </label>

          <!-- Quick role toggle pills -->
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="roleOption in suggestedRoles"
              :key="roleOption"
              type="button"
              class="btn btn-xs transition-all"
              :class="
                draft.rolesList.includes(roleOption)
                  ? 'btn-primary'
                  : 'btn-ghost border border-base-300 bg-base-100'
              "
              @click="toggleDraftRole(roleOption)"
            >
              <span>{{
                draft.rolesList.includes(roleOption) ? "✓" : "+"
              }}</span>
              {{ roleOption }}
            </button>
          </div>

          <!-- Custom role input -->
          <div class="flex items-center gap-2">
            <input
              type="text"
              v-model="customRoleInput"
              @keydown.enter.prevent="addCustomRole"
              class="input input-sm input-bordered flex-1 bg-base-100"
              :placeholder="
                currentLocale === 'de'
                  ? 'Weitere Rolle eingeben und Enter drücken...'
                  : 'Type custom role and press Enter...'
              "
            />
            <button
              type="button"
              class="btn btn-sm btn-outline"
              :disabled="!customRoleInput.trim()"
              @click="addCustomRole"
            >
              + {{ currentLocale === "de" ? "Rolle hinzufügen" : "Add Role" }}
            </button>
          </div>

          <!-- Selected role badges -->
          <div
            v-if="draft.rolesList.length > 0"
            class="flex flex-wrap gap-1.5 pt-1"
          >
            <span
              v-for="(r, rIdx) in draft.rolesList"
              :key="r + rIdx"
              class="badge badge-primary gap-1 py-2.5 text-xs font-medium"
            >
              {{ r }}
              <button
                type="button"
                class="hover:text-error font-bold ml-0.5"
                @click="removeDraftRole(rIdx)"
              >
                ✕
              </button>
            </span>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-2 border-t border-base-300/70">
        <button type="button" class="btn btn-xs btn-ghost" @click="closeForm">
          {{ currentLocale === "de" ? "Abbrechen" : "Cancel" }}
        </button>
        <button
          type="button"
          class="btn btn-xs btn-primary"
          :disabled="!draft.name.trim()"
          @click="saveDraft"
        >
          {{
            editingIndex !== null
              ? currentLocale === "de"
                ? "Änderungen speichern"
                : "Save Changes"
              : currentLocale === "de"
                ? "Übernehmen"
                : "Apply"
          }}
        </button>
      </div>
    </div>

    <!-- Assigned Items Table -->
    <div
      v-if="items.length > 0"
      class="overflow-x-auto rounded-lg border border-base-300 bg-base-100"
    >
      <table class="table table-xs w-full">
        <thead class="bg-base-200/70">
          <tr>
            <th>{{ currentLocale === "de" ? "Name" : "Name" }}</th>
            <th>{{ currentLocale === "de" ? "Typ" : "Type" }}</th>
            <th v-if="mode === 'contact'">
              {{
                currentLocale === "de" ? "Organisation / E-Mail" : "Org / Email"
              }}
            </th>
            <th v-else>
              {{ currentLocale === "de" ? "Identifikator" : "Identifier" }}
            </th>
            <th>{{ currentLocale === "de" ? "Rolle(n)" : "Role(s)" }}</th>
            <th class="text-right w-20">
              {{ currentLocale === "de" ? "Aktionen" : "Actions" }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, idx) in items"
            :key="idx"
            class="hover:bg-base-200/40"
          >
            <td class="font-semibold text-base-content">
              {{ item.name }}
            </td>
            <td>
              <span class="badge badge-xs badge-ghost">
                {{ formatType(item.type || item.actorType) }}
              </span>
            </td>
            <td v-if="mode === 'contact'" class="text-xs text-base-content/75">
              <div v-if="item.organization">{{ item.organization }}</div>
              <div v-if="item.email" class="text-[11px] opacity-75">
                {{ item.email }}
              </div>
              <span v-if="!item.organization && !item.email" class="opacity-40"
                >—</span
              >
            </td>
            <td
              v-else
              class="text-xs font-mono text-base-content/75 max-w-[180px] truncate"
            >
              {{ item.id || "—" }}
            </td>
            <td>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="(role, rIdx) in extractRoles(item)"
                  :key="rIdx"
                  class="badge badge-xs badge-outline badge-primary font-medium"
                >
                  {{ role }}
                </span>
                <span
                  v-if="extractRoles(item).length === 0"
                  class="text-xs opacity-40"
                >
                  —
                </span>
              </div>
            </td>
            <td class="text-right">
              <div class="inline-flex items-center gap-1">
                <button
                  type="button"
                  class="btn btn-xs btn-ghost text-info"
                  :title="currentLocale === 'de' ? 'Bearbeiten' : 'Edit'"
                  @click="openEditForm(idx)"
                >
                  ✏️
                </button>
                <button
                  type="button"
                  class="btn btn-xs btn-ghost text-error"
                  :title="currentLocale === 'de' ? 'Entfernen' : 'Remove'"
                  @click="removeItem(idx)"
                >
                  ✕
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!showForm"
      class="text-xs text-base-content/50 italic py-3 px-4 rounded-lg border border-dashed border-base-300 text-center"
    >
      {{
        currentLocale === "de"
          ? "Noch keine Einträge zugewiesen."
          : "No entries assigned yet."
      }}
    </div>

    <!-- Person Pool Picker Modal -->
    <PersonPickerModal
      :is-open="showPersonPicker"
      :current-locale="currentLocale"
      :mode="mode === 'contact' ? 'contacts' : 'actors'"
      :current-items="items"
      @close="showPersonPicker = false"
      @select="handlePickedPersons"
    />

    <!-- Organization Pool Picker Modal -->
    <OrganizationPickerModal
      :is-open="showOrgPicker"
      :current-locale="currentLocale"
      @close="showOrgPicker = false"
      @select="handlePickedOrg"
    />
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import PersonPickerModal from "./PersonPickerModal.vue";
import OrganizationPickerModal from "./OrganizationPickerModal.vue";
import { addOrUpdatePerson } from "../utils/sharedState.js";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  mode: {
    type: String,
    default: "activity", // 'historical' | 'contact' | 'activity'
  },
  currentLocale: {
    type: String,
    default: "de",
  },
  title: {
    type: String,
    default: "",
  },
  allowMultiRoles: {
    type: Boolean,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

const items = computed(() =>
  Array.isArray(props.modelValue) ? props.modelValue : [],
);

const isMultiRole = computed(() =>
  props.allowMultiRoles !== null
    ? props.allowMultiRoles
    : props.mode === "activity",
);

const resolvedTitle = computed(() => {
  if (props.title) return props.title;
  if (props.mode === "historical") {
    return props.currentLocale === "de"
      ? "Urheber:innen / Schöpfer:innen (Historisch)"
      : "Historical Creators / Authors";
  }
  if (props.mode === "contact") {
    return props.currentLocale === "de"
      ? "Kontaktpersonen"
      : "Contacts";
  }
  return props.currentLocale === "de"
    ? "Beteiligte Personen & Organisationen"
    : "Involved Persons & Organizations";
});

const datalistId = `person-roles-${Math.random().toString(36).slice(2, 9)}`;

const suggestedRoles = computed(() => {
  if (props.mode === "historical") {
    return props.currentLocale === "de"
      ? [
          "Bildhauer",
          "Architekt",
          "Maler",
          "Töpfer",
          "Münzmeister",
          "Goldschmied",
          "Werkstatt",
          "Stifter",
          "Auftraggeber",
        ]
      : [
          "Sculptor",
          "Architect",
          "Painter",
          "Potter",
          "Mintmaster",
          "Goldsmith",
          "Workshop",
          "Donor",
          "Patron",
        ];
  }
  if (props.mode === "contact") {
    return props.currentLocale === "de"
      ? [
          "Datenlieferant",
          "Katalogisierer",
          "Digitalisierungsbeauftragter",
          "Kurator",
          "Ansprechpartner",
          "Rechteinhaber",
        ]
      : [
          "Data Provider",
          "Cataloguer",
          "Digitisation Officer",
          "Curator",
          "Contact Person",
          "Rights Holder",
        ];
  }
  return props.currentLocale === "de"
    ? [
        "Scan-Operator",
        "3D-Modelleur",
        "Postprocessing",
        "Kurator",
        "Fotograf",
        "Qualitätssicherung",
        "Projektleitung",
      ]
    : [
        "Scan Operator",
        "3D Modeller",
        "Postprocessing",
        "Curator",
        "Photographer",
        "Quality Assurance",
        "Project Lead",
      ];
});

const showForm = ref(false);
const editingIndex = ref(null);
const customRoleInput = ref("");
const showPersonPicker = ref(false);
const showOrgPicker = ref(false);

const draft = reactive({
  name: "",
  type: "person",
  id: "",
  organization: "",
  email: "",
  singleRole: "",
  rolesList: [],
});

const extractRoles = (item) => {
  if (!item) return [];
  if (Array.isArray(item.roles)) {
    return item.roles.map((r) => String(r).trim()).filter(Boolean);
  }
  const raw = item.roles || item.role || "";
  if (!raw) return [];
  return String(raw)
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);
};

const formatType = (t) => {
  const val = (t || "person").toLowerCase();
  if (val === "organization" || val === "organisation") {
    return props.currentLocale === "de" ? "Organisation" : "Organisation";
  }
  if (val === "workshop") {
    return props.currentLocale === "de" ? "Werkstatt" : "Workshop";
  }
  return props.currentLocale === "de" ? "Person" : "Person";
};

const resetDraft = () => {
  draft.name = "";
  draft.type = "person";
  draft.id = "";
  draft.organization = "";
  draft.email = "";
  draft.singleRole = "";
  draft.rolesList = [];
  customRoleInput.value = "";
};

const openAddForm = () => {
  editingIndex.value = null;
  resetDraft();
  showForm.value = true;
};

const openEditForm = (idx) => {
  const item = items.value[idx];
  if (!item) return;
  editingIndex.value = idx;
  draft.name = item.name || "";
  draft.type = item.type || item.actorType || "person";
  draft.id = item.id || "";
  draft.organization = item.organization || "";
  draft.email = item.email || "";
  const roles = extractRoles(item);
  draft.singleRole = roles[0] || "";
  draft.rolesList = [...roles];
  customRoleInput.value = "";
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  editingIndex.value = null;
  resetDraft();
};

const toggleDraftRole = (role) => {
  const idx = draft.rolesList.indexOf(role);
  if (idx >= 0) {
    draft.rolesList.splice(idx, 1);
  } else {
    draft.rolesList.push(role);
  }
};

const addCustomRole = () => {
  const val = customRoleInput.value.trim();
  if (!val) return;
  if (!draft.rolesList.includes(val)) {
    draft.rolesList.push(val);
  }
  customRoleInput.value = "";
};

const removeDraftRole = (idx) => {
  draft.rolesList.splice(idx, 1);
};

const buildEntryFromDraft = () => {
  const normalizedType =
    draft.type === "organisation" ? "organization" : draft.type || "person";
  if (props.mode === "contact") {
    return {
      name: draft.name.trim(),
      role: draft.singleRole.trim(),
      organization: draft.organization.trim(),
      email: draft.email.trim(),
      type: normalizedType,
    };
  }
  const rolesOut = isMultiRole.value
    ? [...draft.rolesList]
    : draft.singleRole.trim()
      ? [draft.singleRole.trim()]
      : [];
  return {
    name: draft.name.trim(),
    id: draft.id.trim(),
    type: normalizedType,
    roles: rolesOut,
  };
};

const saveDraft = () => {
  if (!draft.name.trim()) return;
  const entry = buildEntryFromDraft();
  const next = [...items.value];
  if (editingIndex.value !== null && editingIndex.value >= 0) {
    next[editingIndex.value] = entry;
  } else {
    next.push(entry);
    // Persist person identity in pool without roles
    addOrUpdatePerson({
      name: entry.name,
      id: entry.id || "",
      organization: entry.organization || "",
      email: entry.email || "",
      type: entry.type || "person",
    });
  }
  emit("update:modelValue", next);
  closeForm();
};

const removeItem = (idx) => {
  const next = [...items.value];
  next.splice(idx, 1);
  emit("update:modelValue", next);
};

const handlePickedPersons = (selectedList) => {
  if (!Array.isArray(selectedList) || selectedList.length === 0) return;
  const next = [...items.value];
  selectedList.forEach((p) => {
    const pName = (p.name || "").trim();
    if (!pName) return;
    const exists = next.some(
      (item) => (item.name || "").trim().toLowerCase() === pName.toLowerCase(),
    );
    if (!exists) {
      if (props.mode === "contact") {
        next.push({
          name: pName,
          role: p.role || "",
          organization: p.organization || "",
          email: p.email || "",
          type: p.type || "person",
        });
      } else {
        next.push({
          name: pName,
          id: p.id || "",
          type: p.type || "person",
          roles: Array.isArray(p.roles) ? p.roles : [],
        });
      }
    }
  });
  emit("update:modelValue", next);
};

const handlePickedOrg = (org) => {
  if (!org || !org.name) return;
  const orgName = org.name.trim();
  const next = [...items.value];
  const exists = next.some(
    (item) => (item.name || "").trim().toLowerCase() === orgName.toLowerCase(),
  );
  if (!exists) {
    if (props.mode === "contact") {
      next.push({
        name: orgName,
        role: "",
        organization: orgName,
        email: org.email || "",
        type: "organization",
      });
    } else {
      next.push({
        name: orgName,
        id: org.id || org.uri || "",
        type: "organization",
        roles: [],
      });
    }
    emit("update:modelValue", next);
  }
};
</script>
