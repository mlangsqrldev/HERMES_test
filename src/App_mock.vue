<template>
  <main class="flex flex-col items-center w-full min-h-screen relative drawer">
    <input id="my-drawer-1" type="checkbox" class="drawer-toggle" />
    <div
      class="relative sticky top-0 bg-base-100/95 backdrop-blur z-50 w-full flex justify-center p-4 mb-8 text-4xl font-semibold border-b"
    >
      <p class="text-accent">HER</p>
      itage&nbsp;
      <p class="text-accent">M</p>
      etadata&nbsp;
      <p class="text-accent">E</p>
      ntry&nbsp;
      <p class="text-accent">S</p>
      ystem
      <div class="flex gap-4 absolute right-4 top-1/2 -translate-y-1/2">
        <label class="swap cursor-pointer">
          <input
            type="checkbox"
            false-value="en"
            true-value="de"
            v-model="currentLocale"
          />

          <svg
            class="swap-on fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <defs>
              <clipPath id="de-clip">
                <rect x="0" y="4" width="24" height="16" rx="1.5" />
              </clipPath>
            </defs>
            <g clip-path="url(#de-clip)">
              <rect x="0" y="4" width="24" height="5.33" fill="#000000" />
              <rect x="0" y="9.33" width="24" height="5.34" fill="#FF0000" />
              <rect x="0" y="14.67" width="24" height="5.33" fill="#FFCE00" />
            </g>
          </svg>

          <svg
            class="swap-off fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <defs>
              <clipPath id="uk-clip">
                <rect x="0" y="4" width="24" height="16" rx="1.5" />
              </clipPath>
            </defs>
            <g clip-path="url(#uk-clip)">
              <rect x="0" y="4" width="24" height="16" fill="#012169" />

              <path
                d="M0,4 L24,20 M24,4 L0,20"
                stroke="#FFFFFF"
                stroke-width="2.5"
              />
              <path
                d="M0,4 L24,20 M24,4 L0,20"
                stroke="#C8102E"
                stroke-width="1.2"
              />

              <path d="M12,4 V20 M0,12 H24" stroke="#FFFFFF" stroke-width="4" />
              <path
                d="M12,4 V20 M0,12 H24"
                stroke="#C8102E"
                stroke-width="2.4"
              />
            </g>
          </svg>
        </label>

        <label class="flex cursor-pointer gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
          <input
            type="checkbox"
            value="corporate"
            class="toggle theme-controller"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <path
              d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
            />
          </svg>
        </label>
      </div>
    </div>

    <div class="flex relative w-full max-w-7xl mx-auto px-4 items-start">
      <div
        class="sticky top-28 left-0 w-1/5 flex flex-col items-center p-4 bg-base-100/95 backdrop-blur h-full"
      >
        <ul class="steps steps-vertical cursor-pointer mb-6">
          <li
            v-for="(step, index) in currentLocale == 'de' ? stepsDE : stepsEN"
            :key="index"
            class="step px-2 transition-all duration-300"
            :class="{ 'step-primary': index <= activeStepIndex }"
            @click="scrollToSection(index)"
          >
            {{ step }}
          </li>
        </ul>
        
        <input type="file" ref="fileInput" class="hidden" accept=".zip" @change="importFromBagIt" />
        
        <button class="w-full btn btn-outline m-2" @click="triggerImport">
          {{ t("importBagIt") }}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="currentColor"
            class="size-[1.2em] primary-content"
          >
            <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
          </svg>
        </button>

        <button
          class="w-full btn btn-outline m-2"
          @click="exportToBagInfoTxt"
          :disabled="currentFile != '' && progress != 100"
        >
          {{ t("exportBagIt") }}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="currentColor"
            stroke-width="2.5"
            stroke="currentColor"
            class="size-[1.2em] primary-content"
          >
            <path
              d="M160-80v-80h640v80H160Zm320-160L200-600h160v-280h240v280h160L480-240Z"
            />
          </svg>
        </button>

        <button class="w-full btn btn-ghost text-warning border-warning/50 mt-8 m-2" @click="fillDummyData">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
          </svg>
          {{ t("fillMock") }}
        </button>

      </div>

      <div
        class="w-2/3 flex flex-col gap-12 pb-32"
        ref="scrollContainer"
        @scroll="handleScroll"
      >
        <section
          v-for="(step, index) in currentLocale == 'de' ? stepsDE : stepsEN"
          :key="index"
          ref="sectionRefs"
          :data-index="index"
          class="card bg-base-100 shadow-xl border border-base-200"
        >
          <div class="card-body">
            <h2 class="card-title text-2xl mb-6 border-b pb-2">{{ step }}</h2>

            <CollectionInformationCrud
              v-if="step == 'Collection' || step == 'Sammlung'"
              ref="collectionRef"
            />
            <HeritageAssetIdentificationCrud
              v-if="step == 'Heritage Asset' || step == 'Kulturgut'"
              ref="heritageRef"
            />
            <DigitalResourceCrud
              v-if="step == 'Digital Resource' || step == 'Digitale Ressource'"
              ref="digitalRef"
            />
            <ActivityCrud
              v-if="step == 'Activities' || step == 'Aktivitäten'"
              ref="activityRef"
            />
            <div v-if="step == 'Files' || step == 'Dateien'" ref="filesRef">
              <button class="btn btn-primary" @click="handleDirectorySelect">
                {{ t("selectDir") }}
              </button>

              <div v-if="currentFile && progress != 100" class="mt-4">
                <p class="text-sm truncate">
                  {{ t("hashing") }} {{ currentFile }}
                </p>
                <progress
                  class="progress progress-primary w-full"
                  :class="
                    progress == 100 ? 'progress-green' : 'progress-primary'
                  "
                  :value="progress"
                  max="100"
                ></progress>
                <span class="text-xs">{{ progress.toFixed(2) }}%</span>
              </div>
              <div
                class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 mt-6 shadow-sm"
              >
                <div class="overflow-x-auto">
                  <table class="table table-xs w-full table-zebra">
                    <thead class="bg-base-200">
                      <tr>
                        <th>{{ t("file") }}</th>
                        <th>
                          {{ t("hash") }}
                        </th>
                        <th class="w-24">{{ t("actions") }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(hash, fileName, idx) in fileHashes"
                        :key="idx"
                      >
                        <td>
                          {{ fileName }}
                        </td>
                        <td>
                          {{ hash }}
                        </td>
                        <td>
                          <div class="flex gap-1">
                            <button
                              type="button"
                              class="btn btn-xs btn-ghost text-info"
                              @click.prevent="edit(idx)"
                            >
                              {{ t("edit") }}
                            </button>
                            <button
                              type="button"
                              class="btn btn-xs btn-ghost text-error"
                              @click.prevent="remove(idx)"
                            >
                              {{ t("del") }}
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="!fileHashes || Object.keys(fileHashes).length === 0">
                        <td
                          colspan="100"
                          class="text-center text-base-content/40 py-4 italic"
                        >
                          {{ t("noItems") }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup>
import JSZip from "jszip";
import { ref, onMounted, onUnmounted, provide } from "vue";
import { themeChange } from "theme-change";
import CollectionInformationCrud from "./output_components/CollectionInformationCrud.vue";
import HeritageAssetIdentificationCrud from "./output_components/HeritageAssetIdentificationCrud.vue";
import DigitalResourceCrud from "./output_components/DigitalResourceCrud.vue";
import ActivityCrud from "./output_components/ActivityCrud.vue";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { open } from "@tauri-apps/plugin-dialog";

const progress = ref(0);
const currentFile = ref("");
const fileHashes = ref({});
let unlistenFn = null;

// Localization State & Dictionary
const currentLocale = ref("en");
provide("currentLocale", currentLocale);

const uiTranslations = {
  en: {
    importBagIt: "Import BagIt Archive",
    importSuccess: "BagIt Archive successfully imported!",
    importError: "Failed to parse BagIt archive. Ensure it is a valid HERMES format.",
    exportBagIt: "Export BagIt Archive",
    selectDir: "Select Data Directory to Hash",
    hashing: "Hashing:",
    file: "File",
    hash: "Hash",
    edit: "Edit",
    del: "Del",
    noItems: "No items added yet.",
    fillMock: "[DEV] Mock Data"
  },
  de: {
    importBagIt: "BagIt-Archiv importieren",
    importSuccess: "BagIt-Archiv erfolgreich importiert!",
    importError: "Fehler beim Parsen des BagIt-Archivs. Stellen Sie sicher, dass es ein gültiges HERMES-Format ist.",
    exportBagIt: "BagIt-Archiv exportieren",
    selectDir: "Datenverzeichnis zum Hashen auswählen",
    hashing: "Wird gehasht:",
    file: "Datei",
    hash: "Hash",
    edit: "Bearbeiten",
    del: "Löschen",
    noItems: "Noch keine Elemente hinzugefügt.",
    fillMock: "[DEV] Testdaten"
  },
};

const t = (key) =>
  uiTranslations[currentLocale.value]?.[key] || uiTranslations.en[key];

onMounted(async () => {
  // Listen for the progress event emitted from Rust
  unlistenFn = await listen("hash-progress", (event) => {
    const { filename, bytes_processed, total_bytes } = event.payload;
    const percentage = (bytes_processed / total_bytes) * 100;

    currentFile.value = filename;
    progress.value = percentage;
  });
});

onUnmounted(() => {
  if (unlistenFn) {
    unlistenFn();
  }
});

let manifestContent = "";
const handleDirectorySelect = async () => {
  try {
    const selectedDirPath = await open({
      directory: true,
      multiple: false,
    });

    if (!selectedDirPath) return;

    fileHashes.value = await invoke("generate_bag_hashes", {
      baseDir: selectedDirPath,
    });

    manifestContent = "";
    for (const [relativePath, hash] of Object.entries(fileHashes.value)) {
      manifestContent += `${hash} data/${relativePath}\n`;
    }
  } catch (error) {
    console.error("Error generating hashes:", error);
  }
};

const stepsEN = ["Collection", "Heritage Asset", "Digital Resource", "Activities", "Files"];
const stepsDE = ["Sammlung", "Kulturgut", "Digitale Ressource", "Aktivitäten", "Dateien"];

const activeStepIndex = ref(0);
const sectionRefs = ref([]);
const scrollContainer = ref(null);
let observer = null;

const generateSHA256 = async (text) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

const scrollToSection = (index) => {
  if (sectionRefs.value[index]) {
    sectionRefs.value[index].scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const handleScroll = () => {
  if (!scrollContainer.value) return;
  const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value;
  if (Math.ceil(scrollTop + clientHeight) >= scrollHeight - 5) {
    activeStepIndex.value = stepsEN.length - 1;
  }
};

onMounted(() => {
  themeChange(false);
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeStepIndex.value = Number(entry.target.dataset.index);
        }
      });
    },
    { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
  );

  sectionRefs.value.forEach((el) => {
    if (el) observer.observe(el);
  });
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});

const collectionRef = ref([]);
const heritageRef = ref([]);
const digitalRef = ref([]);
const activityRef = ref([]);
const fileInput = ref(null);

// ==========================================
// TEMPORARY DEV DATA INJECTION
// ==========================================
const fillDummyData = () => {
  const refs = [collectionRef, heritageRef, digitalRef, activityRef];
  
  refs.forEach(compRef => {
    const child = compRef.value?.[0];
    if (!child || !child.form) return;
    
    Object.keys(child.form).forEach(key => {
      const val = child.form[key];
      const fieldName = key.split('.').pop();
      const lowerKey = fieldName.toLowerCase();

      // Skip filling if it's an array (requires deeper drawer interaction)
      // except for simple primitive arrays like 'keywords'
      if (Array.isArray(val)) {
        if (lowerKey.includes('keyword') || lowerKey.includes('tag')) {
          child.form[key] = ['Lorem', 'Ipsum', 'MockData'];
        }
      } else {
        // Heuristics for standard required formats
        if (lowerKey.includes('date')) {
          child.form[key] = new Date().toISOString().split('T')[0];
        } else if (lowerKey.includes('url') || lowerKey.includes('relation') || lowerKey.includes('link')) {
          child.form[key] = 'https://example.com/mock-data';
        } else if (lowerKey.includes('id') || lowerKey.includes('identifier')) {
          child.form[key] = `MOCK-ID-${Math.floor(Math.random() * 10000)}`;
        } else if (lowerKey.includes('email')) {
          child.form[key] = 'test@example.com';
        } else if (typeof val === 'boolean') {
          child.form[key] = true;
        } else {
          // Standard text fallback
          child.form[key] = `Lorem ipsum dolor sit amet (${fieldName})`;
        }
      }
    });
  });
};

// ==========================================
// IMPORT LOGIC
// ==========================================
const triggerImport = () => {
  if (fileInput.value) fileInput.value.click();
};

const importFromBagIt = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const zip = await JSZip.loadAsync(file);
    const bagInfoFile = Object.values(zip.files).find(f => f.name.endsWith('bag-info.txt'));

    if (!bagInfoFile) {
      alert(t('importError'));
      return;
    }

    const bagInfoContent = await bagInfoFile.async("string");
    const lines = bagInfoContent.split('\n');

    const parsedData = { Collection: [], HeritageAsset: [], DigitalResource: [], Activity: [] };
    let currentRecords = { Collection: {}, HeritageAsset: {}, DigitalResource: {}, Activity: {} };
    let firstKeyOfSection = { Collection: null, HeritageAsset: null, DigitalResource: null, Activity: null };

    const setNestedValue = (obj, pathParts, value) => {
      let current = obj;
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!current[pathParts[i]]) current[pathParts[i]] = {};
        current = current[pathParts[i]];
      }
      const lastKey = pathParts[pathParts.length - 1];

      if (current[lastKey] !== undefined) {
        if (!Array.isArray(current[lastKey])) current[lastKey] = [current[lastKey]];
        current[lastKey].push(value);
      } else {
        current[lastKey] = value;
      }
    };

    const stdHeaders = ['Bagging-Date', 'BagIt-Version', 'Tag-File-Character-Encoding', 'Payload-Oxum', 'Bag-Size'];

    lines.forEach(line => {
      const separatorIdx = line.indexOf(':');
      if (separatorIdx === -1) return;

      const rawKey = line.substring(0, separatorIdx).trim();
      const value = line.substring(separatorIdx + 1).trim();

      if (stdHeaders.includes(rawKey) || !value) return;

      const parts = rawKey.split('.');
      const section = parts.shift();

      if (!parsedData[section]) return; 

      const rootField = parts[0];
      
      if (!firstKeyOfSection[section]) {
        firstKeyOfSection[section] = rootField;
      } else if (rootField === firstKeyOfSection[section]) {
        parsedData[section].push({ ...currentRecords[section] });
        currentRecords[section] = {};
      }

      setNestedValue(currentRecords[section], parts, value);
    });

    Object.keys(currentRecords).forEach(sec => {
      if (Object.keys(currentRecords[sec]).length > 0) {
        parsedData[sec].push(currentRecords[sec]);
      }
    });

    if (collectionRef.value?.[0]) collectionRef.value[0].items = parsedData.Collection;
    if (heritageRef.value?.[0]) heritageRef.value[0].items = parsedData.HeritageAsset;
    if (digitalRef.value?.[0]) digitalRef.value[0].items = parsedData.DigitalResource;
    if (activityRef.value?.[0]) activityRef.value[0].items = parsedData.Activity;

    alert(t('importSuccess'));

  } catch (error) {
    console.error(error);
    alert(t('importError'));
  }
  
  event.target.value = '';
};

// ==========================================
// EXPORT LOGIC
// ==========================================
const getRecordsFromComponent = (componentRef) => {
  const child = componentRef.value?.[0];
  if (!child) return [];

  const records = [...(child.items || [])];

  if (child.form) {
    const hasUnsavedData = Object.values(child.form).some((val) => {
      if (Array.isArray(val)) return val.length > 0;
      return val !== "" && val !== null && val !== undefined;
    });

    if (hasUnsavedData) {
      records.push(JSON.parse(JSON.stringify(child.form)));
    }
  }

  return records;
};

const exportToBagInfoTxt = async () => {
  const allData = {
    Collection: getRecordsFromComponent(collectionRef),
    HeritageAsset: getRecordsFromComponent(heritageRef),
    DigitalResource: getRecordsFromComponent(digitalRef),
    Activity: getRecordsFromComponent(activityRef),
  };

  let bagInfoContent = "";
  bagInfoContent += `Bagging-Date: ${new Date().toISOString().substring(0, 10)}\n`;

  const processField = (path, value) => {
    if (value === null || value === undefined || value === "") return;

    if (Array.isArray(value)) {
      if (value.length === 0) return;
      value.forEach((item) => {
        if (typeof item === "object" && item !== null) {
          for (const [subKey, subValue] of Object.entries(item)) {
            processField(`${path}.${subKey}`, subValue);
          }
        } else {
          processField(path, item);
        }
      });
    } else if (typeof value === "object") {
      for (const [subKey, subValue] of Object.entries(value)) {
        processField(`${path}.${subKey}`, subValue);
      }
    } else {
      const cleanValue = String(value)
        .replace(/[\r\n]+/g, " ")
        .trim();
      bagInfoContent += `${path}: ${cleanValue}\n`;
    }
  };

  for (const [sectionTitle, records] of Object.entries(allData)) {
    records.forEach((record) => {
      for (const [key, value] of Object.entries(record)) {
        processField(`${sectionTitle}.${key}`, value);
      }
    });
  }
  
  let bagitContent = `BagIt-Version: 1.0\n`;
  bagitContent += `Tag-File-Character-Encoding: UTF-8\n`;

  const bagitHash = await generateSHA256(bagitContent);
  const bagInfoHash = await generateSHA256(bagInfoContent);

  let tagmanifestContent = `${bagitHash} bagit.txt\n`;
  tagmanifestContent += `${bagInfoHash} bag-info.txt\n`;

  const zip = new JSZip();

  zip.file("bagit.txt", bagitContent);
  zip.file("bag-info.txt", bagInfoContent);
  zip.file("tagmanifest-sha256.txt", tagmanifestContent);
  zip.file("manifest-sha256.txt", manifestContent);

  zip.folder("data");

  const zipBlob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(zipBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `hermes-bagit-${Date.now()}.zip`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
</script>