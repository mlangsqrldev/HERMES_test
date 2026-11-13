<template>
  <main
    class="flex flex-col items-center w-full min-h-screen relative bg-base-200/30"
    @dragenter="handleDragEnter"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <!-- Drag & Drop Overlay Indicator -->

    <div
      v-if="isDragOver"
      class="fixed inset-0 z-[100] bg-base-900/40 backdrop-blur-md flex flex-col items-center justify-center p-8 transition-all pointer-events-none"
    >
      <div
        class="glass-panel p-8 rounded-3xl shadow-2xl border-2 border-dashed border-primary flex flex-col items-center gap-4 text-center max-w-md animate-pulse bg-base-100/90"
      >
        <div class="p-4 rounded-2xl bg-primary/10 text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        <h3 class="font-display font-black text-2xl text-base-content">
          {{
            currentLocale === "de"
              ? "CARARE XML oder BagIt hier ablegen"
              : "Drop CARARE XML or BagIt here"
          }}
        </h3>

        <p class="text-xs text-base-content/70">
          {{
            currentLocale === "de"
              ? "Unterstützt alle CARARE 2.0.x XML-Dateien, BagIt-Archive (.zip) und HERMES-Templates (.json)"
              : "Supports any CARARE 2.0.x XML file, BagIt ZIP archives, and HERMES JSON templates"
          }}
        </p>
      </div>
    </div>

    <!-- Modern Glassmorphic Top Header + Docked Global Controls -->
    <div class="sticky top-0 z-50 w-full">
      <header
        class="glass-header w-full px-4 lg:px-8 py-3 flex items-center justify-between transition-all"
      >
      <!-- Brand & Logo (Authentic 2-Color Attic Red-Figure Vase Hermes + Chiseled Greek SVG Wordmark "ΗΕΡΜΗΣ") + App Title -->
      <div class="flex items-center gap-3.5 min-w-0">
        <div
          class="flex items-center gap-2.5 px-2.5 py-1 rounded-xl select-none shrink-0"
          style="
            background-color: #0a0c0e;
            border: 1px solid rgba(224, 122, 66, 0.42);
          "
          title="ΗΕΡΜΗΣ — HERMES"
        >
          <img
            src="/hermes-vase-icon.png?v=signet1"
            alt="ΗΕΡΜΗΣ"
            class="w-10 h-10 object-contain rounded-lg shrink-0"
          />

          <svg
            class="h-6 w-auto pr-1"
            viewBox="760 225 1630 370"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 780.0 240.0 L 836.4 240.0 L 836.4 352.8 L 939.8 352.8 L 939.8 240.0 L 996.2 240.0 L 996.2 522.0 L 939.8 522.0 L 939.8 404.5 L 836.4 404.5 L 836.4 522.0 L 780.0 522.0 Z M 1047.9 240.0 L 1254.7 240.0 L 1240.6 291.7 L 1104.3 291.7 L 1104.3 355.1 L 1221.8 355.1 L 1212.4 404.5 L 1104.3 404.5 L 1104.3 470.3 L 1245.3 470.3 L 1259.4 522.0 L 1047.9 522.0 Z M 1311.1 240.0 L 1456.8 240.0 L 1522.6 291.7 L 1522.6 371.6 L 1456.8 423.3 L 1367.5 423.3 L 1367.5 522.0 L 1311.1 522.0 Z M 1367.5 289.4 L 1367.5 374.0 L 1438.0 374.0 L 1466.2 348.1 L 1466.2 315.2 L 1438.0 289.4 Z M 1574.3 522.0 L 1588.4 240.0 L 1644.8 240.0 L 1701.2 385.7 L 1757.6 240.0 L 1814.0 240.0 L 1828.1 522.0 L 1771.7 522.0 L 1762.3 348.1 L 1715.3 465.6 L 1687.1 465.6 L 1640.1 348.1 L 1630.7 522.0 Z M 1879.8 240.0 L 1936.2 240.0 L 1936.2 352.8 L 2039.6 352.8 L 2039.6 240.0 L 2096.0 240.0 L 2096.0 522.0 L 2039.6 522.0 L 2039.6 404.5 L 1936.2 404.5 L 1936.2 522.0 L 1879.8 522.0 Z M 2147.7 240.0 L 2363.9 240.0 L 2349.8 291.7 L 2227.6 291.7 L 2307.5 376.3 L 2222.9 470.3 L 2354.5 470.3 L 2368.6 522.0 L 2147.7 522.0 L 2147.7 479.7 L 2241.7 381.0 L 2147.7 282.3 Z"
              fill="#E07A42"
              fill-rule="evenodd"
            />

            <path
              d="M 780.0 554.0 L 2368.0 554.0 L 2368.0 572.0 L 780.0 572.0 Z"
              fill="#E07A42"
            />
          </svg>
        </div>

        <div class="hidden sm:flex flex-col min-w-0">
          <div class="flex items-center gap-2">
            <h1
              class="font-display font-extrabold text-lg lg:text-xl tracking-tight text-base-content leading-tight truncate"
            >
              HERMES
            </h1>
            <span
              class="badge badge-xs badge-outline border-base-300 text-base-content/65 font-mono font-semibold"
              >v0.1.6</span
            >
          </div>
          <p class="text-[11px] lg:text-xs text-base-content/65 truncate">
            {{
              currentLocale === "de"
                ? "CARARE 2.0.6 Metadaten-Editor für 3D-Kulturgut"
                : "CARARE 2.0.6 Metadata Editor for 3D Cultural Heritage"
            }}
          </p>
        </div>
      </div>

      <!-- Right: Controls (Manual, XML Preview, Locale Switcher, Theme Switcher) -->

      <div class="flex items-center gap-2.5">
        <!-- Handbook / Manual Link Button -->

        <button
          type="button"
          class="btn btn-sm btn-ghost gap-1.5 px-2.5 font-medium border border-base-300/80 hover:border-primary text-xs text-base-content/85 hover:text-primary transition-all cursor-pointer"
          @click="openManual"
          :title="
            currentLocale === 'de'
              ? 'Praxis-Handbuch für Museum & Ausgrabung öffnen'
              : 'Open Field & Museum Handbook'
          "
        >
          <span>📖</span>

          <span class="hidden md:inline font-semibold">{{
            currentLocale === "de" ? "Handbuch" : "Manual"
          }}</span>
        </button>

        <!-- Toggle Side-by-Side Live XML Inspector -->

        <button
          type="button"
          class="btn btn-sm gap-1.5 px-2.5 font-semibold border transition-all cursor-pointer text-xs"
          :class="
            showSideXmlPreview
              ? 'btn-primary shadow-xs border-primary'
              : 'btn-ghost border-base-300/80 hover:border-primary'
          "
          @click="showSideXmlPreview = !showSideXmlPreview"
          :title="
            currentLocale === 'de'
              ? 'Live XML-Vorschau neben den Formularen ein-/ausblenden'
              : 'Toggle side-by-side Live XML Inspector'
          "
        >
          <span>💻</span>

          <span class="hidden md:inline">{{
            currentLocale === "de" ? "Live XML" : "Live XML"
          }}</span>
        </button>

        <!-- UI Language Switcher DE / EN – flags -->

        <div
          class="flex items-center border border-base-300/80 rounded-lg overflow-hidden bg-base-200/50 p-0.5 shadow-xs"
          :title="
            currentLocale === 'de'
              ? 'Oberflächensprache (UI) umschalten'
              : 'Switch UI Language'
          "
        >
          <span
            class="text-[10px] font-bold uppercase tracking-wider opacity-60 px-1.5 select-none"
            >UI</span
          >
          <button
            type="button"
            class="btn btn-xs border-0 rounded-md px-2 min-w-0"
            :class="
              currentLocale === 'de'
                ? 'btn-primary shadow-xs'
                : 'btn-ghost opacity-60 hover:opacity-100'
            "
            @click="currentLocale = 'de'"
            title="Deutsch"
          >
            <FlagIcon code="de" size="md" />
          </button>

          <button
            type="button"
            class="btn btn-xs border-0 rounded-md px-2 min-w-0"
            :class="
              currentLocale === 'en'
                ? 'btn-primary shadow-xs'
                : 'btn-ghost opacity-60 hover:opacity-100'
            "
            @click="currentLocale = 'en'"
            title="English"
          >
            <FlagIcon code="en" size="md" />
          </button>
        </div>

        <!-- Dark/Light toggle (Corporate is default light) -->

        <label
          class="btn btn-sm btn-ghost btn-circle swap swap-rotate"
          :title="
            currentLocale === 'de'
              ? 'Erscheinungsbild umschalten (Hell/Dunkel)'
              : 'Toggle theme (Light/Dark)'
          "
        >
          <input type="checkbox" value="business" class="theme-controller" />

          <!-- sun icon (shown when theme is dark/business to switch back to light) -->

          <svg
            class="swap-on fill-current w-4 h-4 text-warning"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
            />
          </svg>

          <!-- moon icon (shown when theme is light/corporate to switch to dark) -->

          <svg
            class="swap-off fill-current w-4 h-4 opacity-70"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
            />
          </svg>
        </label>
      </div>
    </header>

      <GlobalDefaultsBar
        :current-locale="currentLocale"
        :collection-form="getChildComp(collectionRef)?.form"
        :heritage-items="getChildComp(heritageRef)?.items || []"
        :digital-items="getChildComp(digitalRef)?.items || []"
        @apply-rights="applyGlobalRightsToAll"
        @apply-language="applyGlobalLanguageToAll"
        @apply-collection="applyGlobalCollectionToForm"
      />
    </div>

    <!-- Main Content Layout -->

    <div
      class="flex relative w-full max-w-[1920px] mx-auto px-3 lg:px-5 pt-5 pb-24 items-start gap-5"
    >
      <!-- Left Sidebar Container -->

      <aside
        class="sticky top-36 left-0 w-60 xl:w-64 shrink-0 flex flex-col gap-4 min-w-0"
      >
        <!-- Navigation Card -->

        <div
          class="glass-panel rounded-2xl p-4 shadow-lg border border-base-200/80 flex flex-col gap-4 overflow-hidden min-w-0"
        >
          <div
            class="flex items-center justify-between pb-2 border-b border-base-200/70"
          >
            <div>
              <h3
                class="font-display font-bold text-sm tracking-wide text-base-content/90"
              >
                {{
                  currentLocale === "de"
                    ? "Workflow & Validierung"
                    : "Workflow & Status"
                }}
              </h3>

              <p class="text-[11px] text-base-content/60">
                {{ completedSectionsCount }}/5
                {{
                  currentLocale === "de"
                    ? "Abschnitte bereit"
                    : "sections ready"
                }}
              </p>
            </div>

            <div
              class="radial-progress text-primary text-xs font-mono font-bold"
              :style="{
                '--value': (completedSectionsCount / 5) * 100,
                '--size': '2.2rem',
                '--thickness': '3px',
              }"
              role="progressbar"
            >
              {{ Math.round((completedSectionsCount / 5) * 100) }}%
            </div>
          </div>

          <!-- Tree Navigation Menu -->

          <ul class="w-full menu p-0 gap-1 min-w-0">
            <li
              v-for="(step, index) in steps"
              :key="index"
              class="rounded-xl transition-all w-full min-w-0 max-w-full overflow-hidden"
              :class="[
                index === activeStepIndex
                  ? 'bg-base-200/60 shadow-xs'
                  : 'hover:bg-base-200/30',
              ]"
            >
              <div
                class="flex items-center gap-2 cursor-pointer font-bold text-sm py-2 px-2.5 w-full min-w-0"
                @click="scrollToSection(index)"
                :class="
                  index === activeStepIndex
                    ? 'text-primary'
                    : 'text-base-content/80'
                "
              >
                <span
                  class="size-2.5 rounded-full shrink-0 shadow-2xs"
                  :class="{
                    'bg-success shadow-xs shadow-success/40':
                      getSectionQualityStatus(step.id).status === 'valid',

                    'bg-warning shadow-xs shadow-warning/40':
                      getSectionQualityStatus(step.id).status === 'warning',

                    'bg-error shadow-xs shadow-error/40':
                      getSectionQualityStatus(step.id).status === 'error',
                  }"
                  :title="
                    currentLocale === 'de'
                      ? getSectionQualityStatus(step.id).labelDe
                      : getSectionQualityStatus(step.id).labelEn
                  "
                ></span>

                <span class="flex-1 truncate">{{
                  currentLocale === "de" ? step.de : step.en
                }}</span>

                <span
                  v-if="getRecordCount(step.id) > 0"
                  class="badge badge-xs badge-neutral font-mono font-normal"
                >
                  {{ getRecordCount(step.id) }}
                </span>
              </div>

              <!-- Sub-entries: visible for active section OR when records exist -->
              <ul
                v-if="
                  index === activeStepIndex &&
                  (requiredTree[step.id] ||
                    step.id === 'heritage' ||
                    step.id === 'digital' ||
                    step.id === 'activity')
                "
                class="ml-3 pb-2 border-l-2 border-base-300/60 pl-2 space-y-0.5 w-[calc(100%-0.75rem)] min-w-0"
              >
                <!-- Required sub-blocks -->
                <li
                  v-for="(levelData, firstLevel) in requiredTree[step.id] || {}"
                  :key="firstLevel"
                  class="w-full min-w-0 max-w-full"
                >
                  <div
                    class="flex items-center gap-2 cursor-pointer text-xs font-medium py-1 px-1.5 rounded hover:bg-base-200/70 transition-colors w-full min-w-0"
                    @click="scrollToSubSection(index, firstLevel, levelData)"
                  >
                    <input
                      type="checkbox"
                      class="checkbox checkbox-xs cursor-pointer pointer-events-none"
                      :checked="
                        filledStatus[step.id]?.firstLevels?.[firstLevel]
                      "
                      tabindex="-1"
                    />

                    <span class="truncate opacity-85">{{
                      currentLocale === "de"
                        ? levelData.nameDE
                        : levelData.nameEN
                    }}</span>
                  </div>
                </li>

                <!-- Individual Heritage Asset entries -->
                <template v-if="step.id === 'heritage'">
                  <li
                    v-for="(item, itemIdx) in getChildComp(heritageRef)
                      ?.items || []"
                    :key="'ha-' + itemIdx"
                  >
                    <div
                      class="flex items-center gap-1.5 cursor-pointer text-[11px] py-1 px-1.5 rounded hover:bg-primary/10 hover:text-primary transition-colors"
                      @click="jumpToItem('heritage', index, itemIdx)"
                    >
                      <span class="opacity-60">↳</span>
                      <span class="truncate font-mono">{{
                        getSidebarItemLabel(item, itemIdx, "HA")
                      }}</span>
                    </div>
                  </li>
                </template>

                <!-- Individual Digital Resource entries -->
                <template v-if="step.id === 'digital'">
                  <li
                    v-for="(item, itemIdx) in getChildComp(digitalRef)?.items ||
                    []"
                    :key="'dr-' + itemIdx"
                  >
                    <div
                      class="flex items-center gap-1.5 cursor-pointer text-[11px] py-1 px-1.5 rounded hover:bg-primary/10 hover:text-primary transition-colors"
                      @click="jumpToItem('digital', index, itemIdx)"
                    >
                      <span class="opacity-60">↳</span>
                      <span class="truncate font-mono">{{
                        getSidebarItemLabel(item, itemIdx, "DR")
                      }}</span>
                    </div>
                  </li>
                </template>

                <!-- Activity sub-sections -->
                <template v-if="step.id === 'activity'">
                  <li v-for="actSub in activitySubNav" :key="actSub.id">
                    <div
                      class="flex items-center gap-1.5 cursor-pointer text-[11px] py-1 px-1.5 rounded hover:bg-primary/10 hover:text-primary transition-colors"
                      @click="scrollToActivityAnchor(index, actSub.id)"
                    >
                      <span class="opacity-60">↳</span>
                      <span class="truncate">{{
                        currentLocale === "de" ? actSub.de : actSub.en
                      }}</span>
                    </div>
                  </li>
                </template>
              </ul>
            </li>
          </ul>

          <!-- Legend -->

          <div
            class="flex flex-wrap items-center justify-between gap-1.5 text-[11px] pt-1 px-1 border-t border-base-200/70 text-base-content/70"
          >
            <div class="flex items-center gap-1.5">
              <span class="text-accent font-black text-sm leading-none">*</span>

              <span>{{ t("req") }}</span>
            </div>

            <div class="flex items-center gap-1.5">
              <span class="text-warning font-black text-sm leading-none"
                >~</span
              >

              <span>{{ t("rec") }}</span>
            </div>
          </div>
        </div>

        <!-- Actions & Export Card -->

        <div
          class="glass-panel rounded-2xl p-4 shadow-lg border border-base-200/80 flex flex-col gap-2.5"
        >
          <div class="flex items-center justify-between gap-2 px-1">
            <span
              class="text-xs font-bold uppercase tracking-wider text-base-content/50"
            >
              {{
                currentLocale === "de" ? "Aktionen & Export" : "Actions & Export"
              }}
            </span>
            <span
              class="badge badge-xs font-medium"
              :class="lastExportedAt ? 'badge-success/20 text-success' : 'badge-ghost opacity-70'"
              :title="
                lastExportedAt
                  ? (currentLocale === 'de' ? `Zuletzt exportiert um ${lastExportedAt}` : `Last exported at ${lastExportedAt}`)
                  : (currentLocale === 'de' ? 'Lokal zwischengespeichert (noch nicht als Datei exportiert)' : 'Saved locally (not yet exported to file)')
              "
            >
              {{
                lastExportedAt
                  ? `✓ ${lastExportedAt}`
                  : currentLocale === "de"
                    ? "Lokal gesichert"
                    : "Local only"
              }}
            </span>
          </div>

          <input
            type="file"
            ref="zipFileInput"
            class="hidden"
            accept=".zip,.xml,.json"
            @change="importFromBagIt"
          />

          <!-- Primäre Aktion: CARARE-Datei laden (öffnet Dateiauswahl-Fenster) -->

          <button
            type="button"
            class="btn btn-sm btn-primary gap-2 justify-start font-bold shadow-md shadow-primary/20 hover:scale-[1.02] transition-all"
            @click="triggerImport"
            :title="
              currentLocale === 'de'
                ? 'Dateiauswahl öffnen, um CARARE-XML (.xml), BagIt-ZIP (.zip) oder Template (.json) einzulesen'
                : 'Open file dialog to load CARARE XML (.xml), BagIt ZIP archive (.zip), or JSON profile'
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="18px"
              viewBox="0 -960 960 960"
              width="18px"
              fill="currentColor"
            >
              <path
                d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"
              />
            </svg>

            <span class="truncate">{{
              currentLocale === "de"
                ? "CARARE / BagIt laden"
                : "Load CARARE / BagIt"
            }}</span>
          </button>

          <!-- Alles leeren / zurücksetzen -->

          <button
            type="button"
            class="btn btn-xs btn-ghost text-error/80 hover:text-error hover:bg-error/10 gap-2 justify-start font-medium text-xs transition-all"
            @click="clearAllForms"
            :title="
              currentLocale === 'de'
                ? 'Alle Abschnitte und Formularfelder zurücksetzen'
                : 'Reset all sections and records'
            "
          >
            <span>🗑️</span>

            <span class="truncate">{{
              currentLocale === "de"
                ? "Formulare zurücksetzen"
                : "Reset All Records"
            }}</span>
          </button>

          <button
            class="btn btn-sm btn-outline gap-2 justify-start font-medium hover:border-primary hover:text-primary transition-all"
            @click="exportToBagInfoTxt"
            :disabled="currentFile != '' && progress != 100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="18px"
              viewBox="0 -960 960 960"
              width="18px"
              fill="currentColor"
            >
              <path
                d="M160-80v-80h640v80H160Zm320-160L200-600h160v-280h240v280h160L480-240Z"
              />
            </svg>

            {{ t("exportBagIt") }}
          </button>

          <button
            class="btn btn-sm btn-outline gap-2 justify-start font-medium hover:border-secondary hover:text-secondary transition-all"
            @click="exportMetadataReport"
            :disabled="currentFile != '' && progress != 100"
            :title="
              currentLocale === 'de'
                ? 'Wissenschaftlichen Metadatenbericht als druckfertiges PDF generieren'
                : 'Generate scholarly metadata report as publication-grade PDF'
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="18px"
              viewBox="0 -960 960 960"
              width="18px"
              fill="currentColor"
            >
              <path
                d="M280-280h400v-80H280v80Zm0-160h400v-80H280v80Zm0-160h280v-80H280v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Z"
              />
            </svg>

            {{
              currentLocale === "de"
                ? "Bericht (PDF)"
                : "Scholarly Report (PDF)"
            }}
          </button>

          <button
            class="btn btn-sm btn-primary gap-2 justify-start font-bold shadow-md shadow-primary/20 hover:scale-[1.02] transition-all"
            @click="exportToCarareXML"
            :disabled="currentFile != '' && progress != 100"
            :title="
              currentLocale === 'de'
                ? 'Exportiert alle Objekte in einer gemeinsamen CARARE-Sammeldatei (Batch / carareWrap)'
                : 'Export all objects in a single batch CARARE file'
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="18px"
              viewBox="0 -960 960 960"
              width="18px"
              fill="currentColor"
            >
              <path
                d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520Z"
              />
            </svg>
            {{ t("exportCARAREXML") }}
            {{
              heritageAssetsCount > 1
                ? currentLocale === "de"
                  ? "(Sammel-XML)"
                  : "(Batch XML)"
                : ""
            }}
          </button>

          <!-- Split Export Button: 1 standalone XML per Heritage Asset in ZIP -->
          <button
            v-if="heritageAssetsCount > 1"
            class="btn btn-sm btn-outline btn-primary gap-2 justify-start font-bold shadow-xs hover:scale-[1.02] transition-all"
            @click="exportSingleCarareXmlsZip"
            :disabled="currentFile != '' && progress != 100"
            :title="
              currentLocale === 'de'
                ? 'Erzeugt ein ZIP mit separaten XML-Dateien (1 XML-Datei pro Kulturgut für dateibasierte Repositorien und Harvester)'
                : 'Generate a ZIP with 1 separate XML file per heritage asset'
            "
          >
            <span class="text-base">📦</span>
            {{
              currentLocale === "de"
                ? "1 XML pro Objekt (ZIP)"
                : "1 XML per Asset (ZIP)"
            }}
          </button>

          <div
            v-if="exportStatus === 'success'"
            class="p-2.5 text-xs font-semibold text-success-content bg-success/20 border border-success/30 rounded-xl flex items-center gap-2 animate-fadeIn"
          >
            <span class="text-sm">✓</span> {{ t("exportSuccess") }}
          </div>

          <div
            v-if="exportStatus === 'error'"
            class="p-2.5 text-xs font-semibold text-error-content bg-error/20 border border-error/30 rounded-xl flex items-center gap-2 animate-fadeIn"
          >
            <span class="text-sm">⚠</span> {{ t("exportError") }}
            {{ errorMessage }}
          </div>
        </div>
      </aside>

      <!-- Main Scroll Section Container -->

      <div
        class="flex-1 min-w-0 flex flex-col gap-10 pb-32"
        ref="scrollContainer"
        @scroll="handleScroll"
      >
        <section
          v-for="(step, index) in steps"
          :key="index"
          ref="sectionRefs"
          :data-index="index"
          :data-step-id="step.id"
          @focusin="handleFormInteraction($event, step.id)"
          class="modern-card bg-base-100 shadow-md border border-base-200/80 rounded-2xl overflow-x-clip transition-all duration-300 scroll-mt-20"
        >
          <!-- Card Header (non-sticky to prevent overlapping fields during scroll) -->

          <div
            class="px-6 py-4 border-b border-base-200/70 flex items-center justify-between bg-base-100/90 rounded-t-2xl"
          >
            <div class="flex items-center gap-3">
              <span
                class="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary font-mono font-bold text-xs"
              >
                0{{ index + 1 }}
              </span>

              <h2
                class="font-display font-bold text-xl text-base-content tracking-tight"
              >
                {{ currentLocale == "de" ? step.de : step.en }}
              </h2>

              <span
                v-if="getRecordCount(step.id) > 0"
                class="badge badge-sm badge-ghost font-mono"
              >
                {{ getRecordCount(step.id) }}
                {{
                  currentLocale === "de"
                    ? getRecordCount(step.id) === 1
                      ? "Eintrag"
                      : "Einträge"
                    : getRecordCount(step.id) === 1
                      ? "record"
                      : "records"
                }}
              </span>

              <!-- Quality Status Ampel Badge -->

              <span
                class="badge badge-sm gap-1.5 text-[11px] font-semibold border shadow-2xs"
                :class="{
                  'badge-success bg-success/15 text-success border-success/30':
                    getSectionQualityStatus(step.id).status === 'valid',

                  'badge-warning bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/35':
                    getSectionQualityStatus(step.id).status === 'warning',

                  'badge-error bg-error/15 text-error border-error/30':
                    getSectionQualityStatus(step.id).status === 'error',
                }"
              >
                <span
                  class="size-1.5 rounded-full"
                  :class="{
                    'bg-success':
                      getSectionQualityStatus(step.id).status === 'valid',

                    'bg-warning':
                      getSectionQualityStatus(step.id).status === 'warning',

                    'bg-error':
                      getSectionQualityStatus(step.id).status === 'error',
                  }"
                ></span>

                {{
                  currentLocale === "de"
                    ? getSectionQualityStatus(step.id).labelDe
                    : getSectionQualityStatus(step.id).labelEn
                }}
              </span>
            </div>

            <div class="flex items-center gap-1" v-if="step.id != 'files'">
              <div
                class="tooltip tooltip-left z-30"
                :data-tip="t('addtemplate')"
              >
                <button
                  type="button"
                  class="btn btn-sm btn-ghost btn-circle"
                  @click="openAddTemplateModal(step.id)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-5 h-5 opacity-70 hover:opacity-100 text-primary"
                  >
                    <path
                      d="M5 21v-16q0 -0.825 0.588 -1.413T7 3h6v2H7v12.95l5 -2.15 5 2.15v-6.95h2v10L12 18 5 21Zm2 -16h6 -6Zm10 4v-2h-2v-2h2v-2h2v2h2v2h-2v2h-2Z"
                    />
                  </svg>
                </button>
              </div>

              <div class="tooltip tooltip-left z-30" :data-tip="t('template')">
                <button
                  type="button"
                  class="btn btn-sm btn-ghost btn-circle"
                  @click="openTemplateModal(step.id)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-5 h-5 opacity-70 hover:opacity-100 text-accent"
                  >
                    <path
                      d="M4 22v-14q0 -0.825 0.588 -1.413T6 6h8q0.825 0 1.413 0.588T16 8v14L10 19 4 22Zm2 -3.025 4 -2.15 4 2.15v-10.975H6v10.975Zm12 -0.975v-14H7v-2h11q0.825 0 1.413 0.588T20 4v14h-2ZM6 8h8 -8Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="p-4 sm:p-5">
            <CollectionInformationCrud
              v-if="step.id === 'collectionInformation'"
              :ref="
                (el) => {
                  if (el) collectionRef = el;
                }
              "
            />

            <HeritageAssetIdentificationCrud
              v-if="step.id === 'heritageAssetIdentification'"
              :ref="
                (el) => {
                  if (el) heritageRef = el;
                }
              "
              @create-digital-resource="handleCreateDigitalResourceForAsset"
            />

            <DigitalResourceCrud
              v-if="step.id === 'digitalResource'"
              :ref="
                (el) => {
                  if (el) digitalRef = el;
                }
              "
            />

            <ActivityCrud
              v-if="step.id === 'activity'"
              :ref="
                (el) => {
                  if (el) activityRef = el;
                }
              "
            />

            <div v-if="step.id === 'files'" class="space-y-6">
              <input
                type="file"
                ref="folderInput"
                webkitdirectory
                directory
                multiple
                class="hidden"
                @change="handleBrowserDirectorySelect"
              />

              <div class="flex items-center gap-4">
                <button
                  class="btn btn-primary gap-2"
                  @click="handleDirectorySelect"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="currentColor"
                  >
                    <path
                      d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z"
                    />
                  </svg>

                  {{ t("selectDir") }}
                </button>
              </div>

              <div
                v-if="currentFile && progress != 100"
                class="mt-4 p-4 rounded-xl bg-base-200/50 border border-base-300/50"
              >
                <div class="flex justify-between text-xs font-semibold mb-1.5">
                  <span class="truncate"
                    >{{ t("hashing") }} {{ currentFile }}</span
                  >

                  <span class="font-mono text-primary"
                    >{{ progress.toFixed(1) }}%</span
                  >
                </div>

                <progress
                  class="progress progress-primary w-full"
                  :value="progress"
                  max="100"
                ></progress>
              </div>

              <div
                class="border border-base-200 rounded-xl overflow-hidden shadow-xs"
              >
                <div class="overflow-x-auto">
                  <table class="table table-sm w-full table-zebra">
                    <thead
                      class="bg-base-200/70 text-xs uppercase font-bold text-base-content/70"
                    >
                      <tr>
                        <th>{{ t("file") }}</th>

                        <th>{{ t("hash") }}</th>

                        <th class="w-20 text-right">{{ t("actions") }}</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr
                        v-for="(hash, fileName, idx) in fileHashes"
                        :key="idx"
                        class="hover"
                      >
                        <td class="font-mono text-xs">{{ fileName }}</td>

                        <td class="font-mono text-xs text-base-content/70">
                          {{ hash }}
                        </td>

                        <td class="text-right">
                          <button
                            type="button"
                            class="btn btn-xs btn-ghost text-error"
                            @click.prevent="removeFileHash(fileName)"
                          >
                            {{ t("del") }}
                          </button>
                        </td>
                      </tr>

                      <tr
                        v-if="
                          !fileHashes || Object.keys(fileHashes).length === 0
                        "
                      >
                        <td
                          colspan="100"
                          class="text-center text-base-content/40 py-6 italic text-sm"
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

        <!-- (Bottom fallback removed: XML Inspector lives cleanly and exclusively side-by-side with forms) -->
      </div>

      <!-- Middle Interactive Resizer Handle (Drag to resize Form & XML panes) -->

      <div
        v-if="showSideXmlPreview"
        class="hidden lg:flex sticky top-20 z-30 w-3 self-stretch shrink-0 cursor-col-resize select-none items-center justify-center group py-4 transition-colors"
        :class="isDraggingResizer ? 'bg-primary/20' : 'hover:bg-primary/10'"
        @mousedown.prevent="startResizing"
        :title="
          currentLocale === 'de'
            ? 'Ziehen, um die Breite der Formulare und des XML-Inspektors anzupassen (Doppelklick für 500px)'
            : 'Drag to resize form and XML preview (double-click to reset)'
        "
        @dblclick="resetResizerWidth"
      >
        <div
          class="w-1.5 h-16 rounded-full transition-all group-hover:h-24 group-hover:w-2 flex flex-col items-center justify-center gap-1 shadow-sm"
          :class="
            isDraggingResizer
              ? 'bg-primary ring-2 ring-primary/40'
              : 'bg-base-content/25 group-hover:bg-primary'
          "
        >
          <span class="w-0.5 h-0.5 rounded-full bg-base-100"></span>

          <span class="w-0.5 h-0.5 rounded-full bg-base-100"></span>

          <span class="w-0.5 h-0.5 rounded-full bg-base-100"></span>
        </div>
      </div>

      <!-- Right Sticky Column: Side-by-Side Live XML Inspector (Synchronized with Forms) -->

      <aside
        v-if="showSideXmlPreview"
        ref="xmlPreviewSectionRef"
        class="sticky top-20 shrink-0 transition-all duration-75 max-w-full"
        :style="{ width: xmlPanelWidth + 'px' }"
      >
        <LiveXmlPreview
          :carare-xml="liveCarareXml"
          :current-locale="currentLocale"
          :highlighted-target="highlightedXmlTarget"
          :side-by-side="true"
          @xml-line-click="handleXmlLineClick"
          @close="showSideXmlPreview = false"
        />
      </aside>
    </div>
  </main>

  <dialog ref="templateModal" class="modal z-[9999]">
    <div class="modal-box max-w-lg">
      <div class="flex items-center justify-between mb-3">
        <div>
          <h3 class="font-bold text-lg leading-tight">
            {{
              currentLocale === "de" ? "Vorlagen verwalten" : "Manage Templates"
            }}
          </h3>

          <p class="text-xs text-base-content/60 mt-0.5">
            {{
              currentLocale === "de"
                ? "Wählen Sie eine Vorlage oder exportieren/importieren Sie Vorlagen als JSON."
                : "Select a template or export/import templates as JSON."
            }}
          </p>
        </div>

        <form method="dialog">
          <button class="btn btn-sm btn-ghost btn-circle">✕</button>
        </form>
      </div>

      <!-- Toast banner for template actions -->

      <div
        v-if="templateToastMessage"
        class="mb-3 px-3 py-2 rounded-xl bg-success/15 border border-success/30 text-success text-xs font-semibold flex items-center gap-2"
      >
        <span>✓</span>

        <span>{{ templateToastMessage }}</span>
      </div>

      <!-- JSON Export & Import Toolbar -->

      <div
        class="flex items-center gap-2 mb-4 p-2.5 rounded-xl bg-base-200/60 border border-base-200"
      >
        <button
          type="button"
          class="btn btn-xs btn-primary gap-1.5 flex-1 font-semibold text-[11px] shadow-xs"
          @click="exportTemplatesAsJson(activeTemplateStep)"
          :title="
            currentLocale === 'de'
              ? 'Vorlagen als JSON-Datei speichern/exportieren'
              : 'Save/export templates as JSON file'
          "
        >
          <span>⬇️</span>

          <span>{{
            currentLocale === "de" ? "JSON exportieren" : "Export JSON"
          }}</span>
        </button>

        <button
          type="button"
          class="btn btn-xs btn-secondary gap-1.5 flex-1 font-semibold text-[11px] shadow-xs"
          @click="triggerImportTemplatesJson"
          :title="
            currentLocale === 'de'
              ? 'Vorlagen aus JSON-Datei laden/importieren'
              : 'Load/import templates from JSON file'
          "
        >
          <span>⬆️</span>

          <span>{{
            currentLocale === "de" ? "JSON importieren" : "Import JSON"
          }}</span>
        </button>
      </div>

      <!-- Hidden file input for JSON import in web / fallback -->

      <input
        ref="templateJsonFileInput"
        type="file"
        accept=".json,application/json"
        class="hidden"
        @change="handleTemplateJsonFileSelected"
      />

      <div class="flex flex-col gap-2 max-h-[340px] overflow-y-auto pr-1">
        <div
          v-for="(tpl, idx) in templates[activeTemplateStep] || []"
          :key="idx"
          class="join w-full shadow-2xs border border-base-300 rounded-lg overflow-hidden"
        >
          <button
            class="btn btn-sm btn-ghost justify-start font-normal flex-1 join-item text-xs truncate hover:bg-primary/10"
            @click="applyTemplate(activeTemplateStep, tpl.data)"
            :title="
              currentLocale === 'de'
                ? 'Diese Vorlage in das Formular laden'
                : 'Apply template to form'
            "
          >
            <span class="mr-1">📋</span>

            <span class="font-medium truncate">{{ tpl.name }}</span>
          </button>

          <button
            type="button"
            class="btn btn-sm btn-ghost join-item px-2.5 text-xs text-base-content/70 hover:text-primary hover:bg-primary/10"
            @click.prevent="exportSingleTemplate(tpl)"
            :title="
              currentLocale === 'de'
                ? 'Nur diese Vorlage als JSON herunterladen'
                : 'Export only this template as JSON'
            "
          >
            ⬇️
          </button>

          <button
            type="button"
            class="btn btn-sm btn-ghost join-item px-2.5 text-error hover:bg-error/10"
            @click.prevent="confirmDeleteTemplate(activeTemplateStep, idx)"
            :title="
              currentLocale === 'de' ? 'Vorlage löschen' : 'Delete template'
            "
          >
            <svg
              class="size-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        <div
          v-if="
            !(
              templates[activeTemplateStep] &&
              templates[activeTemplateStep].length > 0
            )
          "
          class="text-xs italic opacity-50 py-4 text-center"
        >
          {{ t("noItems") }}
        </div>
      </div>

      <div class="divider my-4">{{ t("or") }}</div>

      <div class="modal-action w-full mt-0">
        <form method="dialog" class="w-full">
          <button class="btn btn-primary w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="w-5 h-5 mr-1"
            >
              <path
                d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z"
              />
            </svg>

            {{ t("customEdit") }}
          </button>
        </form>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>

  <dialog ref="addTemplateModal" class="modal z-[9999]">
    <div class="modal-box max-w-md">
      <h3 class="font-bold text-lg mb-6">{{ t("addtemplate") }}</h3>

      <div class="flex flex-col gap-4">
        <input
          type="text"
          v-model="newTemplateName"
          :placeholder="t('templateName')"
          class="input input-bordered w-full"
        />

        <div class="modal-action mt-2 w-full">
          <form method="dialog" class="w-full">
            <button
              class="btn btn-primary w-full"
              @click="addTemplate(activeAddTemplateStep)"
              :disabled="!newTemplateName"
            >
              {{ t("addtemplate") }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>

  <dialog ref="deleteTemplateModal" class="modal z-[9999]">
    <div class="modal-box">
      <h3 class="font-bold text-lg">{{ t("deleteTemplatePrompt") }}</h3>

      <p class="py-4">{{ t("deleteTemplateDesc") }}</p>

      <div class="modal-action">
        <form method="dialog" class="flex gap-2">
          <!-- if there is a button in form, it will close the modal -->

          <button class="btn btn-ghost">{{ t("cancel") }}</button>

          <button class="btn btn-error" @click="executeDeleteTemplate">
            {{ t("del") }}
          </button>
        </form>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>

  <!-- GeoNames API Credentials & Web Services Modal -->

  <ApiSettingsModal
    :is-open="isApiSettingsOpen"
    :current-locale="currentLocale"
    @close="closeApiSettings"
  />
</template>

<script setup>
import JSZip from "jszip";

import {
  ref,
  shallowRef,
  onMounted,
  onUnmounted,
  provide,
  computed,
  watch,
} from "vue";

import { themeChange } from "theme-change";

import CollectionInformationCrud from "./output_components/CollectionInformationCrud.vue";

import HeritageAssetIdentificationCrud from "./output_components/HeritageAssetIdentificationCrud.vue";

import DigitalResourceCrud from "./output_components/DigitalResourceCrud.vue";

import ActivityCrud from "./output_components/ActivityCrud.vue";

import GlobalDefaultsBar from "./components/GlobalDefaultsBar.vue";

import FlagIcon from "./components/FlagIcon.vue";

import ApiSettingsModal from "./components/ApiSettingsModal.vue";

import LiveXmlPreview from "./components/LiveXmlPreview.vue";

import defaultTemplates from "./assets/default_templates.json";

import { parseCarareXml } from "./utils/carareXmlParser.js";

import {
  defaultMetadataLanguage,
  globalRights,
  saveGlobalRights,
  resetGlobalRights,
  savedContacts,
  savedActors,
  savedOrganizations,
  normalizeYearDate,
  resolveLicenceUri,
  isApiSettingsOpen,
  openApiSettings,
  closeApiSettings,
} from "./utils/sharedState.js";

import { invoke } from "@tauri-apps/api/core";

import { listen } from "@tauri-apps/api/event";

import { open, save } from "@tauri-apps/plugin-dialog";

import { writeFile } from "@tauri-apps/plugin-fs";

import { isTauri, getAppStore } from "./utils/platform.js";

import { resolveTermUri, resolveTermList } from "./utils/termResolver.js";

import {
  generateMarkdownReport,
  generatePdfReport,
} from "./utils/markdownReportGenerator.js";

const isExporting = ref(false);

const exportStatus = ref(null); // 'success', 'error', or null
const lastExportedAt = ref("");

const markExported = () => {
  lastExportedAt.value = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const handleCreateDigitalResourceForAsset = (haItem) => {
  scrollToSection("digitalResource");
  setTimeout(() => {
    if (
      digitalRef.value &&
      typeof digitalRef.value.createForHeritageAsset === "function"
    ) {
      digitalRef.value.createForHeritageAsset(haItem);
    }
  }, 150);
};

const errorMessage = ref("");

const progress = ref(0);

const currentFile = ref("");

const fileHashes = ref({});

let unlistenFn = null;

const collectionTemplateModal = ref(null);

const heritageAssetTemplateModal = ref(null);

const digitalResourceTemplateModal = ref(null);

const activityTemplateModal = ref(null);

const addTemplateModal = ref(null);

const deleteTemplateModal = ref(null);

const templateToDelete = ref(null);

const activeAddTemplateStep = ref(null);

const templateModal = ref(null);

const activeTemplateStep = ref(null);

const templates = ref({});

const newTemplateName = ref("");

const store = shallowRef(null);

const collectionRef = shallowRef(null);

const heritageRef = shallowRef(null);

const digitalRef = shallowRef(null);

const activityRef = shallowRef(null);

const getChildComp = (refVar) => {
  if (!refVar) return null;

  const val = refVar.value !== undefined ? refVar.value : refVar;

  if (!val) return null;

  if (Array.isArray(val)) {
    return val.find((x) => x && typeof x === "object") || null;
  }

  return val;
};

const zipFileInput = ref(null);

const folderInput = ref(null);

const openManual = async () => {
  try {
    const { invoke } = await import("@tauri-apps/api/core");

    await invoke("open_manual_window");
  } catch (err) {
    console.warn("Tauri open_manual_window fallback:", err);

    const manualUrl = new URL("/manual.html", window.location.href).href;

    window.open(manualUrl, "_blank");
  }
};

// Localization State & Dictionary

const currentLocale = ref("en");

provide("currentLocale", currentLocale);

provide("defaultMetadataLanguage", defaultMetadataLanguage);

provide("globalRights", globalRights);

provide("savedContacts", savedContacts);

provide("savedActors", savedActors);

watch(currentLocale, (newLocale) => {
  if (globalRights.licence) {
    globalRights.licence = resolveLicenceUri(globalRights.licence, newLocale);
  }
});

const applyGlobalRightsToAll = (rightsObj) => {
  const components = [
    getChildComp(collectionRef),

    getChildComp(heritageRef),

    getChildComp(digitalRef),

    getChildComp(activityRef),
  ].filter(Boolean);

  const targetLicence = resolveLicenceUri(
    rightsObj.licence,
    currentLocale.value,
  );

  components.forEach((comp) => {
    if (comp.form) {
      if (
        "recordInformation.metadataRights" in comp.form ||
        comp.form["recordInformation.metadataRights"] !== undefined
      ) {
        comp.form["recordInformation.metadataRights"] =
          rightsObj.metadataRights;
      }

      if (
        "rights.copyrightCreditLine" in comp.form ||
        comp.form["rights.copyrightCreditLine"] !== undefined
      ) {
        comp.form["rights.copyrightCreditLine"] = rightsObj.copyrightCreditLine;
      }

      if (
        "rights.accessRights" in comp.form ||
        comp.form["rights.accessRights"] !== undefined
      ) {
        comp.form["rights.accessRights"] = rightsObj.accessRights;
      }

      if (
        "rights.licence" in comp.form ||
        comp.form["rights.licence"] !== undefined
      ) {
        comp.form["rights.licence"] = targetLicence;
      }

      if (
        "rights.reproductionRights" in comp.form ||
        comp.form["rights.reproductionRights"] !== undefined
      ) {
        comp.form["rights.reproductionRights"] = rightsObj.reproductionRights;
      }
    }

    if (Array.isArray(comp.items)) {
      comp.items.forEach((item) => {
        if ("recordInformation.metadataRights" in item)
          item["recordInformation.metadataRights"] = rightsObj.metadataRights;

        if ("rights.copyrightCreditLine" in item)
          item["rights.copyrightCreditLine"] = rightsObj.copyrightCreditLine;

        if ("rights.accessRights" in item)
          item["rights.accessRights"] = rightsObj.accessRights;

        if ("rights.licence" in item) item["rights.licence"] = targetLicence;
      });
    }
  });
};

const applyGlobalLanguageToAll = (lang) => {
  defaultMetadataLanguage.value = lang;

  const components = [
    getChildComp(collectionRef),

    getChildComp(heritageRef),

    getChildComp(digitalRef),

    getChildComp(activityRef),
  ].filter(Boolean);

  components.forEach((comp) => {
    if (comp.form) {
      if (Array.isArray(comp.form["recordInformation.language"])) {
        comp.form["recordInformation.language"] = [lang];
      }

      if (Array.isArray(comp.form["appellation.name"])) {
        comp.form["appellation.name"].forEach((n) => {
          if (n && typeof n === "object") n["appellation.name#lang"] = lang;
        });
      }

      if (Array.isArray(comp.form["title"])) {
        comp.form["title"].forEach((n) => {
          if (n && typeof n === "object") n["title#lang"] = lang;
        });
      }
    }

    if (Array.isArray(comp.items)) {
      comp.items.forEach((item) => {
        if (Array.isArray(item["recordInformation.language"])) {
          item["recordInformation.language"] = [lang];
        }

        if (Array.isArray(item["appellation.name"])) {
          item["appellation.name"].forEach((n) => {
            if (n && typeof n === "object") n["appellation.name#lang"] = lang;
          });
        }
      });
    }
  });
};

const applyGlobalCollectionToForm = (col) => {
  if (!col) return;

  const colComp = getChildComp(collectionRef);

  if (colComp && typeof colComp.loadFromCollectionPool === "function") {
    colComp.loadFromCollectionPool(col);
  } else if (colComp && colComp.form) {
    if (col.id) colComp.form["id"] = col.id;

    if (col.title) {
      if (Array.isArray(colComp.form["title"]) && colComp.form["title"][0]) {
        colComp.form["title"][0]._value = col.title;
      }
    }

    if (col.institution) colComp.form["source"] = col.institution;

    if (col.rights) {
      if (col.rights.licence)
        colComp.form["rights.licence"] = resolveLicenceUri(
          col.rights.licence,
          currentLocale.value,
        );

      if (col.rights.accessRights)
        colComp.form["rights.accessRights"] = col.rights.accessRights;

      if (col.rights.copyrightCreditLine)
        colComp.form["rights.copyrightCreditLine"] =
          col.rights.copyrightCreditLine;
    }
  }

  const el = sectionRefs.value?.[0];

  if (el && typeof el.scrollIntoView === "function") {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const uiTranslations = {
  en: {
    importBagIt: "Import CARARE XML / BagIt Archive",

    importSuccess: "Metadata successfully imported and verified.",

    importError:
      "Failed to parse source file. Ensure it complies with CARARE 2.0.x XML, BagIt ZIP archive standards, or HERMES JSON profiles.",

    exportBagIt: "Archival BagIt Package (.zip)",

    exportCARAREXML: "CARARE 2.0.6 XML",

    selectDir: "Select Payload Directory for Checksum Digest",

    hashing: "Computing Cryptographic Checksum:",

    file: "File Object",

    hash: "SHA-256 Digest",

    edit: "Edit Record",

    del: "Remove Record",

    noItems: "No archival records registered for this section.",

    req: "Mandatory Schema Fields",

    rec: "Recommended Curatorial Fields",

    template: "Populate from Template",

    addtemplate: "Save as Template",

    templateName: "Template Designation",

    or: "OR",

    actions: "Actions",

    customEdit: "Custom Entry Mode",

    deleteTemplatePrompt: "Permanently delete this template profile?",

    deleteTemplateDesc: "This operation is irreversible.",

    cancel: "Cancel",

    exportSuccess: "Archival export successfully generated.",

    exportError: "Archival export failed:",
  },

  de: {
    importBagIt: "CARARE XML / BagIt-Archiv laden",

    importSuccess: "Metadaten erfolgreich importiert und verifiziert.",

    importError:
      "Fehler beim Einlesen der Datei. Bitte stellen Sie sicher, dass es sich um eine valide CARARE 2.0.x XML-Datei, ein BagIt-Archiv (.zip) oder ein HERMES-Metadatenprofil handelt.",

    exportBagIt: "BagIt-Archivpaket (.zip)",

    exportCARAREXML: "CARARE 2.0.6 XML",

    selectDir: "Nutzdatenverzeichnis zur Prüfsummenbildung auswählen",

    hashing: "Kryptografische Hash-Berechnung:",

    file: "Dateiobjekt",

    hash: "SHA-256 Prüfsumme",

    edit: "Eintrag bearbeiten",

    del: "Eintrag löschen",

    noItems: "Für diesen Bereich liegen noch keine Einträge vor.",

    req: "Obligatorische Pflichtfelder",

    rec: "Empfohlene Kuratierungsfelder",

    template: "Aus Vorlage befüllen",

    addtemplate: "Als Vorlage speichern",

    templateName: "Bezeichnung der Vorlage",

    or: "ODER",

    actions: "Aktionen",

    customEdit: "Individuell erfassen",

    deleteTemplatePrompt: "Möchten Sie diese Vorlage unwiderruflich löschen?",

    deleteTemplateDesc: "Dieser Vorgang kann nicht rückgängig gemacht werden.",

    cancel: "Abbrechen",

    exportSuccess: "Archivierungsbericht erfolgreich erzeugt.",

    exportError: "Fehler beim Erzeugen des Exports:",
  },
};

const t = (key) =>
  uiTranslations[currentLocale.value]?.[key] || uiTranslations.en[key];

const openTemplateModal = (stepId) => {
  activeTemplateStep.value = stepId;

  templateModal.value?.showModal();
};

const openAddTemplateModal = (stepId) => {
  activeAddTemplateStep.value = stepId;

  addTemplateModal.value?.showModal();
};

const addTemplate = async (stepId) => {
  if (!newTemplateName.value || !store.value) return;

  let currentForm = null;

  if (stepId === "collectionInformation")
    currentForm = getChildComp(collectionRef)?.form;
  else if (stepId === "heritageAssetIdentification")
    currentForm = getChildComp(heritageRef)?.form;
  else if (stepId === "digitalResource")
    currentForm = getChildComp(digitalRef)?.form;
  else if (stepId === "activity") currentForm = getChildComp(activityRef)?.form;

  if (currentForm) {
    const dataToSave = JSON.parse(JSON.stringify(currentForm));

    if (!templates.value[stepId]) templates.value[stepId] = [];

    templates.value[stepId].push({
      name: newTemplateName.value,

      data: dataToSave,
    });

    await store.value.set(stepId, templates.value[stepId]);

    await store.value.save();
  }

  newTemplateName.value = "";

  addTemplateModal.value?.close();
};

const applyTemplate = (stepId, templateData) => {
  let targetRef = null;

  if (stepId === "collectionInformation") targetRef = collectionRef;
  else if (stepId === "heritageAssetIdentification") targetRef = heritageRef;
  else if (stepId === "digitalResource") targetRef = digitalRef;
  else if (stepId === "activity") targetRef = activityRef;

  const targetComp = getChildComp(targetRef);

  if (targetComp?.form) {
    const cleanData = JSON.parse(JSON.stringify(templateData));

    // Strip obsolete global fields so loading templates never reverts the form to old state

    delete cleanData["recordInformation.country"];

    delete cleanData["recordInformation.country#lang"];

    delete cleanData["recordInformation.country#authority"];

    delete cleanData["recordInformation.language"];

    delete cleanData["recordInformation.language#lang"];

    delete cleanData["recordInformation.metadataRights"];

    delete cleanData["recordInformation.metadataRights#lang"];

    delete cleanData["coverage.spatial.locationSet.geopoliticalArea"];

    delete cleanData["coverage.spatial.locationSet.geopoliticalArea#lang"];

    delete cleanData["spatial.locationSet.geopoliticalArea"];

    delete cleanData["spatial.locationSet.geopoliticalArea#lang"];

    if (stepId === "digitalResource") {
      delete cleanData["language"];

      delete cleanData["language#lang"];
    }

    if (stepId === "heritageAssetIdentification") {
      if (
        cleanData["repositoryLocation"] &&
        cleanData["repositoryLocation"].includes("Antikensammlung")
      ) {
        cleanData["repositoryLocation"] =
          "Antikensammlung, Staatliche Museen zu Berlin (GND: 5035657-4)";
      } else if (
        cleanData["repositoryLocation"] &&
        (cleanData["repositoryLocation"].includes("Ägyptisches Museum") ||
          cleanData["repositoryLocation"].includes("Aegyptisches"))
      ) {
        cleanData["repositoryLocation"] =
          "Ägyptisches Museum und Papyrussammlung, Staatliche Museen zu Berlin (GND: 5035655-0)";
      }
    }

    if (
      stepId === "collectionInformation" &&
      Array.isArray(cleanData["contacts"])
    ) {
      cleanData["contacts"] = cleanData["contacts"].map((c) => ({
        name: c.name || "",

        role: c.role || "",

        organization: c.organization || "",

        email: c.email || "",
      }));
    }

    Object.assign(targetComp.form, cleanData);
  }
};

const confirmDeleteTemplate = (stepId, index) => {
  templateToDelete.value = { stepId, index };

  deleteTemplateModal.value?.showModal();
};

const executeDeleteTemplate = async () => {
  if (templateToDelete.value) {
    const { stepId, index } = templateToDelete.value;

    templates.value[stepId].splice(index, 1);

    await store.value.set(stepId, templates.value[stepId]);

    await store.value.save();

    templateToDelete.value = null;
  }
};

const templateJsonFileInput = ref(null);

const templateToastMessage = ref("");

const saveJsonFile = async (data, filename) => {
  const jsonContent =
    typeof data === "string" ? data : JSON.stringify(data, null, 2);

  if (isTauri()) {
    try {
      const selectedPath = await save({
        defaultPath: filename,

        filters: [{ name: "HERMES Templates (*.json)", extensions: ["json"] }],
      });

      if (!selectedPath) return false;

      const encoder = new TextEncoder();

      await writeFile(selectedPath, encoder.encode(jsonContent));

      return true;
    } catch (err) {
      console.warn("Tauri save fallback to browser blob:", err);
    }
  }

  const blob = new Blob([jsonContent], {
    type: "application/json;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = filename;

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  URL.revokeObjectURL(url);

  return true;
};

const exportTemplatesAsJson = async (stepId = null) => {
  try {
    const isSectionOnly = Boolean(stepId && templates.value[stepId]);

    const payload = {
      $schema: "https://hermes-metadata.org/schemas/templates-v1.json",

      format: "hermes-templates",

      version: "1.0",

      exportedAt: new Date().toISOString(),

      activeStep: stepId || "all",

      templates: isSectionOnly
        ? {
            [stepId]: JSON.parse(JSON.stringify(templates.value[stepId] || [])),
          }
        : JSON.parse(JSON.stringify(templates.value)),
    };

    const defaultFilename = isSectionOnly
      ? `hermes-templates-${stepId}-${Date.now()}.json`
      : `hermes-templates-all-${Date.now()}.json`;

    const success = await saveJsonFile(payload, defaultFilename);

    if (success) {
      templateToastMessage.value =
        currentLocale.value === "de"
          ? "Vorlagen erfolgreich als JSON exportiert!"
          : "Templates exported as JSON successfully!";

      setTimeout(() => {
        templateToastMessage.value = "";
      }, 3500);
    }
  } catch (err) {
    console.error("Template export failed:", err);

    alert(
      (currentLocale.value === "de"
        ? "Fehler beim Exportieren: "
        : "Export failed: ") + err.message,
    );
  }
};

const exportSingleTemplate = async (tpl) => {
  try {
    const payload = {
      $schema: "https://hermes-metadata.org/schemas/templates-v1.json",

      format: "hermes-single-template",

      version: "1.0",

      exportedAt: new Date().toISOString(),

      section: activeTemplateStep.value,

      template: JSON.parse(JSON.stringify(tpl)),
    };

    const safeName = (tpl.name || "template").replace(
      /[^a-zA-Z0-9_\u00C0-\u017F-]/g,
      "_",
    );

    const defaultFilename = `hermes-template-${safeName}.json`;

    const success = await saveJsonFile(payload, defaultFilename);

    if (success) {
      templateToastMessage.value =
        currentLocale.value === "de"
          ? `Vorlage "${tpl.name}" erfolgreich exportiert!`
          : `Template "${tpl.name}" exported successfully!`;

      setTimeout(() => {
        templateToastMessage.value = "";
      }, 3500);
    }
  } catch (err) {
    console.error("Single template export failed:", err);

    alert(err.message);
  }
};

const triggerImportTemplatesJson = async () => {
  if (isTauri()) {
    try {
      const selected = await open({
        multiple: false,

        title:
          currentLocale.value === "de"
            ? "HERMES-Vorlagen (JSON) auswählen"
            : "Select HERMES Templates (JSON)",

        filters: [
          { name: "JSON Templates (*.json)", extensions: ["json"] },

          { name: "Alle Dateien (*.*)", extensions: ["*"] },
        ],
      });

      if (selected) {
        const filePath =
          typeof selected === "string" ? selected : selected?.path;

        if (filePath) {
          const { readFile } = await import("@tauri-apps/plugin-fs");

          const bytes = await readFile(filePath);

          const text = new TextDecoder("utf-8").decode(bytes);

          await applyImportedTemplatesText(text);

          return;
        }
      }

      return;
    } catch (err) {
      console.error("Tauri template import error:", err);

      alert(
        (currentLocale.value === "de"
          ? "Fehler beim Laden der Vorlagen: "
          : "Error loading templates: ") + (err.message || err),
      );

      return;
    }
  }

  if (templateJsonFileInput.value) {
    templateJsonFileInput.value.value = "";

    templateJsonFileInput.value.click();
  }
};

const handleTemplateJsonFileSelected = async (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  try {
    const text = await file.text();

    await applyImportedTemplatesText(text);
  } catch (err) {
    alert(
      (currentLocale.value === "de"
        ? "Fehler beim Laden der Datei: "
        : "Error reading file: ") + err.message,
    );
  }

  event.target.value = "";
};

const applyImportedTemplatesText = async (text) => {
  try {
    const parsed = JSON.parse(text);

    let importedCount = 0;

    // Case 1: Envelope with { templates: { stepId: [ ... ] } }

    if (parsed && typeof parsed.templates === "object") {
      for (const [stepKey, tplList] of Object.entries(parsed.templates)) {
        if (Array.isArray(tplList)) {
          if (!templates.value[stepKey]) templates.value[stepKey] = [];

          for (const tpl of tplList) {
            if (tpl && tpl.name) {
              const exIdx = templates.value[stepKey].findIndex(
                (t) => t.name === tpl.name,
              );

              if (exIdx >= 0) templates.value[stepKey][exIdx] = tpl;
              else templates.value[stepKey].push(tpl);

              importedCount++;
            }
          }

          if (store.value) {
            await store.value.set(stepKey, templates.value[stepKey]);
          }
        }
      }
    }

    // Case 2: Single template envelope { template: { name, data }, section: ... }
    else if (parsed && parsed.template && parsed.template.name) {
      const targetStep =
        parsed.section ||
        activeTemplateStep.value ||
        "heritageAssetIdentification";

      if (!templates.value[targetStep]) templates.value[targetStep] = [];

      const tpl = parsed.template;

      const exIdx = templates.value[targetStep].findIndex(
        (t) => t.name === tpl.name,
      );

      if (exIdx >= 0) templates.value[targetStep][exIdx] = tpl;
      else templates.value[targetStep].push(tpl);

      importedCount++;

      if (store.value) {
        await store.value.set(targetStep, templates.value[targetStep]);
      }
    }

    // Case 3: Array of templates [ { name, data }, ... ]
    else if (Array.isArray(parsed)) {
      const targetStep =
        activeTemplateStep.value || "heritageAssetIdentification";

      if (!templates.value[targetStep]) templates.value[targetStep] = [];

      for (const tpl of parsed) {
        if (tpl && tpl.name) {
          const exIdx = templates.value[targetStep].findIndex(
            (t) => t.name === tpl.name,
          );

          if (exIdx >= 0) templates.value[targetStep][exIdx] = tpl;
          else templates.value[targetStep].push(tpl);

          importedCount++;
        }
      }

      if (store.value) {
        await store.value.set(targetStep, templates.value[targetStep]);
      }
    }

    // Case 4: Direct dictionary of sections { collectionInformation: [...], ... }
    else if (typeof parsed === "object") {
      for (const [stepKey, val] of Object.entries(parsed)) {
        if (
          [
            "collectionInformation",
            "heritageAssetIdentification",
            "digitalResource",
            "activity",
          ].includes(stepKey) &&
          Array.isArray(val)
        ) {
          if (!templates.value[stepKey]) templates.value[stepKey] = [];

          for (const tpl of val) {
            if (tpl && tpl.name) {
              const exIdx = templates.value[stepKey].findIndex(
                (t) => t.name === tpl.name,
              );

              if (exIdx >= 0) templates.value[stepKey][exIdx] = tpl;
              else templates.value[stepKey].push(tpl);

              importedCount++;
            }
          }

          if (store.value) {
            await store.value.set(stepKey, templates.value[stepKey]);
          }
        }
      }
    }

    if (store.value) {
      await store.value.save();
    }

    if (importedCount > 0) {
      templateToastMessage.value =
        currentLocale.value === "de"
          ? `${importedCount} Vorlage(n) erfolgreich importiert!`
          : `${importedCount} template(s) imported successfully!`;

      setTimeout(() => {
        templateToastMessage.value = "";
      }, 3500);
    } else {
      alert(
        currentLocale.value === "de"
          ? "Keine gültigen Vorlagen in der Datei gefunden."
          : "No valid templates found in JSON file.",
      );
    }
  } catch (err) {
    console.error("Failed to parse templates JSON:", err);

    alert(
      (currentLocale.value === "de"
        ? "Ungültiges JSON-Format: "
        : "Invalid JSON format: ") + err.message,
    );
  }
};

const loadSampleDataset = async (silent = false) => {
  try {
    let xmlText = "";

    try {
      const resp = await fetch(
        "/CARARE_Phantasie_Kollektion_3D_Master_und_Derivate.xml",
      );

      if (resp.ok) xmlText = await resp.text();
    } catch (e) {
      console.warn("Fetch fallback:", e);
    }

    if (!xmlText) {
      try {
        const { readTextFile } = await import("@tauri-apps/plugin-fs");

        xmlText = await readTextFile(
          "CARARE_Phantasie_Kollektion_3D_Master_und_Derivate.xml",
        );
      } catch (err) {
        console.warn("Tauri fs fallback:", err);
      }
    }

    if (xmlText) {
      const parsedData = parseCarareXml(xmlText);

      const loadedSummary = [];

      const populate = (compRef, dataArray, labelDe, labelEn) => {
        const comp = getChildComp(compRef);

        if (!comp || !Array.isArray(dataArray) || dataArray.length === 0)
          return;

        if (typeof comp.loadItems === "function") {
          comp.loadItems(dataArray);
        } else {
          comp.items = dataArray;

          if (typeof comp.edit === "function") comp.edit(0);

          if (comp.form && dataArray[0]) {
            comp.isEditing = true;

            comp.editIndex = 0;

            Object.assign(comp.form, JSON.parse(JSON.stringify(dataArray[0])));
          }
        }

        loadedSummary.push(
          `${dataArray.length} ${currentLocale.value === "de" ? labelDe : labelEn}`,
        );
      };

      populate(
        collectionRef,
        parsedData.Collection,
        "Sammlung(en)",
        "Collection(s)",
      );

      populate(
        heritageRef,
        parsedData.HeritageAsset,
        "Kulturgut/-güter",
        "Heritage Asset(s)",
      );

      populate(
        digitalRef,
        parsedData.DigitalResource,
        "Digitale Ressource(n)",
        "Digital Resource(s)",
      );

      populate(
        activityRef,
        parsedData.Activity,
        "Aktivität(en)",
        "Activity/Activities",
      );

      if (!silent && loadedSummary.length > 0) {
        const title =
          currentLocale.value === "de"
            ? "3D-Musterkollektion erfolgreich geladen:\n"
            : "3D Sample Collection successfully loaded:\n";

        alert(title + loadedSummary.map((s) => "• " + s).join("\n"));
      }

      return true;
    }
  } catch (err) {
    console.error("Error loading sample dataset:", err);

    if (!silent) alert("Fehler beim Laden des Beispiels: " + err.message);
  }

  return false;
};

onMounted(async () => {
  try {
    store.value = await getAppStore("templates.json", { autoSave: true });

    // Load existing templates

    const keys = await store.value.keys();

    for (const stepId of keys) {
      templates.value[stepId] = (await store.value.get(stepId)) || [];
    }

    // Ensure default templates (including Nikarete SK 740) are populated/merged

    for (const [stepId, tpls] of Object.entries(defaultTemplates)) {
      if (!templates.value[stepId]) templates.value[stepId] = [];

      for (const tpl of tpls) {
        const existingIdx = templates.value[stepId].findIndex(
          (t) => t.name === tpl.name,
        );

        if (existingIdx === -1) {
          templates.value[stepId].push(tpl);
        } else {
          templates.value[stepId][existingIdx] = tpl;
        }
      }

      if (store.value) {
        await store.value.set(stepId, templates.value[stepId]);

        await store.value.save();
      }
    }
  } catch (err) {
    console.error("Error loading templates store:", err);
  }

  if (isTauri()) {
    try {
      // Listen for the progress event emitted from Rust

      unlistenFn = await listen("hash-progress", (event) => {
        const { filename, bytes_processed, total_bytes } = event.payload;

        const percentage = (bytes_processed / total_bytes) * 100;

        currentFile.value = filename;

        progress.value = percentage;
      });
    } catch (err) {
      console.warn("Could not attach hash-progress listener:", err);
    }
  }
});

onUnmounted(() => {
  // Clean up the listener when the component is destroyed

  if (unlistenFn) {
    unlistenFn();
  }
});

let manifestContent = "";

const handleDirectorySelect = async () => {
  if (isTauri()) {
    try {
      // Open the native OS folder picker

      const selectedDirPath = await open({
        directory: true,

        multiple: false,
      });

      // If the user closes the dialog without selecting anything, just return

      if (!selectedDirPath) return;

      console.log("Selected directory:", selectedDirPath);

      // Pass the clean, absolute path directly to Rust

      fileHashes.value = await invoke("generate_bag_hashes", {
        baseDir: selectedDirPath,
      });

      // Reset manifest content just in case they click it twice

      manifestContent = "";

      for (const [relativePath, hash] of Object.entries(fileHashes.value)) {
        manifestContent += `${hash} data/${relativePath}\n`;
      }

      console.log("Generated Manifest Data:\n", manifestContent);
    } catch (error) {
      // Now, if anything fails (Rust error or JS error), you will actually see it!

      console.error("Error generating hashes:", error);
    }
  } else {
    // Browser fallback

    if (folderInput.value) {
      folderInput.value.click();
    }
  }
};

const handleBrowserDirectorySelect = async (event) => {
  const files = event.target.files;

  if (!files || files.length === 0) return;

  const newHashes = { ...fileHashes.value };

  const totalFiles = files.length;

  let processedFiles = 0;

  for (const file of Array.from(files)) {
    currentFile.value = file.name;

    progress.value = (processedFiles / totalFiles) * 100;

    const buffer = await file.arrayBuffer();

    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);

    const hashArray = Array.from(new Uint8Array(hashBuffer));

    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const relativePath = file.webkitRelativePath || file.name;

    newHashes[relativePath] = hashHex;

    processedFiles++;

    progress.value = (processedFiles / totalFiles) * 100;
  }

  fileHashes.value = newHashes;

  currentFile.value = "";

  progress.value = 100;

  manifestContent = "";

  for (const [relativePath, hash] of Object.entries(fileHashes.value)) {
    manifestContent += `${hash} data/${relativePath}\n`;
  }

  event.target.value = "";
};

// const stepsEN = [

//   "Collection",

//   "Heritage Asset",

//   "Digital Resources",

//   "Activities",

import schemaDict from "./assets/schema_dictionary.json";

// Group definition mapping internal IDs to display names

const steps = [
  {
    id: "collectionInformation",
    en: "Collection Information",
    de: "Sammlungs-Identifikation",
  },

  {
    id: "heritageAssetIdentification",
    en: "Heritage Asset Identification",
    de: "Kulturgut-Erfassung",
  },

  {
    id: "digitalResource",
    en: "Digital Resources & 3D Assets",
    de: "Digitale Ressourcen & 3D-Modelle",
  },

  {
    id: "activity",
    en: "Activities & Authenticity (DAP)",
    de: "Aktivitäten & Authentizität (DAP)",
  },

  {
    id: "files",
    en: "Archival Payload & Checksums (BagIt)",
    de: "Archivierungs-Payload & Prüfsummen (BagIt)",
  },
];

// Tree representation of required fields

const requiredTree = computed(() => {
  const tree = {};

  for (const [group, fields] of Object.entries(schemaDict)) {
    // Only map required fields

    const reqFields = fields.filter((f) => f.status === "required");

    if (reqFields.length === 0) continue;

    tree[group] = {};

    reqFields.forEach((f) => {
      const parts = f.fieldPath.split(".");

      const firstLevel = parts[0];

      if (firstLevel === "rights") return;

      if (!tree[group][firstLevel]) {
        // Look up the parent node in the unfiltered fields array

        const parentNode =
          fields.find((field) => field.fieldPath === firstLevel) || {};

        tree[group][firstLevel] = {
          nameEN: parentNode.nameEN || firstLevel,

          nameDE: parentNode.nameDE || firstLevel,

          fields: [], // array to hold the required leaf fields
        };
      }

      tree[group][firstLevel].fields.push(f);
    });
  }

  return tree;
});

const getComponentRef = (groupId) => {
  if (groupId === "collectionInformation") return getChildComp(collectionRef);

  if (groupId === "heritageAssetIdentification")
    return getChildComp(heritageRef);

  if (groupId === "digitalResource") return getChildComp(digitalRef);

  if (groupId === "activity") return getChildComp(activityRef);

  return null;
};

const isAppMounted = ref(false);

onMounted(() => {
  isAppMounted.value = true;
});

const filledStatus = computed(() => {
  const status = {};

  if (!isAppMounted.value) return status;

  for (const step of steps) {
    const groupId = step.id;

    status[groupId] = { groupFilled: false, firstLevels: {} };

    if (groupId === "files") {
      status[groupId].groupFilled =
        Object.keys(fileHashes.value || {}).length > 0;

      continue;
    }

    const comp = getComponentRef(groupId);

    const fieldsMap = requiredTree.value[groupId];

    console.log(fieldsMap);

    if (!fieldsMap) {
      status[groupId].groupFilled = true;

      continue;
    }

    if (!comp) {
      status[groupId].groupFilled = false;

      continue;
    }

    let allGroupFilled = true;

    for (const [firstLevel, levelData] of Object.entries(fieldsMap)) {
      let allFirstLevelFilled = false;

      const checkFilled = (dataObj) => {
        if (!dataObj) return false;

        const firstLevelVal = dataObj[firstLevel];

        if (Array.isArray(firstLevelVal)) {
          return firstLevelVal.length > 0;
        }

        return levelData.fields.every((field) => {
          let val = dataObj[field.fieldPath];

          // Direct alias and fallback resolution for technical CARARE schema paths

          if (val === undefined || val === null || val === "") {
            if (
              field.fieldPath === "recordInformation.id" ||
              field.fieldPath === "id"
            ) {
              val =
                dataObj["id"] ||
                dataObj["recordInformation.id"] ||
                dataObj["appellation.id"] ||
                dataObj["_id"];
            } else if (
              field.fieldPath === "recordInformation.metadataRights" ||
              field.fieldPath === "metadataRights"
            ) {
              val =
                dataObj["recordInformation.metadataRights"] ||
                dataObj["metadataRights"] ||
                dataObj["rights.licence"] ||
                dataObj["rights.copyrightCreditLine"] ||
                "CC0 1.0 Universal";
            } else if (
              field.fieldPath === "recordInformation.country" ||
              field.fieldPath === "country"
            ) {
              val =
                dataObj["recordInformation.country"] ||
                dataObj["country"] ||
                "DE";
            } else if (
              field.fieldPath === "recordInformation.language" ||
              field.fieldPath === "language"
            ) {
              val = dataObj["recordInformation.language"] ||
                dataObj["language"] || ["de"];
            } else if (field.fieldPath.startsWith("recordInformation.")) {
              const shortKey = field.fieldPath.replace(
                "recordInformation.",
                "",
              );

              val = dataObj[shortKey];
            }
          }

          if (val !== undefined && val !== null) {
            if (Array.isArray(val)) {
              if (val.length === 0) return false;

              if (typeof val[0] === "object" && val[0] !== null) {
                return val.some(
                  (item) => (item._value || item.value || "").trim() !== "",
                );
              }

              return true;
            }

            return String(val).trim() !== "";
          }

          // If field.fieldPath is a subfield of an array (e.g. recordInformation.creation.contacts.organization)

          const parts = field.fieldPath.split(".");

          for (let i = parts.length - 1; i > 0; i--) {
            const parentPath = parts.slice(0, i).join(".");

            const childProp = parts.slice(i).join(".");

            if (Array.isArray(dataObj[parentPath])) {
              // If parent array is empty, this nested sub-requirement does not block the firstLevel

              if (dataObj[parentPath].length === 0) return true;

              return dataObj[parentPath].every((item) => {
                const subVal = item[childProp] || item[parts[parts.length - 1]];

                return (
                  subVal !== null &&
                  subVal !== undefined &&
                  String(subVal).trim() !== ""
                );
              });
            }
          }

          return false;
        });
      };

      // 1. Check if ANY saved item has ALL required fields filled (support Array or Ref)

      const itemsList = Array.isArray(comp.items)
        ? comp.items
        : comp.items && Array.isArray(comp.items.value)
          ? comp.items.value
          : [];

      if (itemsList.length > 0) {
        allFirstLevelFilled = itemsList.some(checkFilled);
      }

      // 2. Fallback to check if the current active form has ALL required fields filled

      if (!allFirstLevelFilled && comp.form) {
        allFirstLevelFilled = checkFilled(comp.form);
      }

      status[groupId].firstLevels[firstLevel] = allFirstLevelFilled;

      if (!allFirstLevelFilled) {
        allGroupFilled = false;
      }
    }

    status[groupId].groupFilled = allGroupFilled;
  }

  return status;
});

const getRecordCount = (groupId) => {
  if (groupId === "files") return Object.keys(fileHashes.value || {}).length;

  const comp = getComponentRef(groupId);

  if (!comp) return 0;

  if (Array.isArray(comp.items)) return comp.items.length;

  return 0;
};

const getSectionQualityStatus = (stepId) => {
  if (!isAppMounted.value) {
    return {
      status: "error",
      labelDe: "Wird geladen...",
      labelEn: "Loading...",
      icon: "🔴",
    };
  }

  if (stepId === "collectionInformation") {
    const comp = getChildComp(collectionRef);

    const form = comp?.form;

    if (!form)
      return {
        status: "error",
        labelDe: "Nicht erfasst",
        labelEn: "Not recorded",
        icon: "🔴",
      };

    const hasId = Boolean(String(form.id || "").trim());

    const hasTitle = Array.isArray(form.title)
      ? form.title.some(
          (t) => t && String(t._value || t.value || "").trim() !== "",
        )
      : Boolean(String(form.title || "").trim());

    const isComplete = filledStatus.value["collectionInformation"]?.groupFilled;

    if (isComplete) {
      return {
        status: "valid",
        labelDe: "Vollständig",
        labelEn: "Complete",
        icon: "🟢",
      };
    }

    if (hasId || hasTitle) {
      return {
        status: "warning",
        labelDe: "In Bearbeitung",
        labelEn: "In Progress",
        icon: "🟡",
      };
    }

    return {
      status: "error",
      labelDe: "Pflichtfelder fehlen",
      labelEn: "Missing required",
      icon: "🔴",
    };
  }

  if (stepId === "heritageAssetIdentification") {
    const comp = getChildComp(heritageRef);

    const count = comp?.items?.length || 0;

    if (count === 0) {
      const form = comp?.form;

      const hasId = Boolean(
        String(form?.["recordInformation.id"] || "").trim(),
      );

      if (hasId) {
        return {
          status: "warning",
          labelDe: "Entwurf ungespeichert",
          labelEn: "Unsaved draft",
          icon: "🟡",
        };
      }

      return {
        status: "error",
        labelDe: "Keine Kulturgüter",
        labelEn: "No assets",
        icon: "🔴",
      };
    }

    if (comp?.validationStats) {
      const vs = comp.validationStats;

      if (vs.error > 0)
        return {
          status: "error",
          labelDe: `${vs.error} mit Fehlern`,
          labelEn: `${vs.error} with errors`,
          icon: "🔴",
        };

      if (vs.warning > 0)
        return {
          status: "warning",
          labelDe: `${vs.valid}/${vs.total} exportbereit`,
          labelEn: `${vs.valid}/${vs.total} ready`,
          icon: "🟡",
        };

      return {
        status: "valid",
        labelDe: "Alle exportbereit",
        labelEn: "All ready",
        icon: "🟢",
      };
    }

    return filledStatus.value["heritageAssetIdentification"]?.groupFilled
      ? {
          status: "valid",
          labelDe: "Vollständig",
          labelEn: "Complete",
          icon: "🟢",
        }
      : {
          status: "warning",
          labelDe: "In Bearbeitung",
          labelEn: "In Progress",
          icon: "🟡",
        };
  }

  if (stepId === "digitalResource") {
    const comp = getChildComp(digitalRef);

    const items = comp?.items || [];

    if (items.length === 0) {
      const form = comp?.form;

      const hasId = Boolean(
        String(form?.["recordInformation.id"] || "").trim(),
      );

      if (hasId)
        return {
          status: "warning",
          labelDe: "Entwurf ungespeichert",
          labelEn: "Unsaved draft",
          icon: "🟡",
        };

      return {
        status: "error",
        labelDe: "Keine Ressourcen",
        labelEn: "No resources",
        icon: "🔴",
      };
    }

    if (comp?.validationStats) {
      const vs = comp.validationStats;

      if (vs.error > 0)
        return {
          status: "error",
          labelDe: `${vs.error} mit Fehlern`,
          labelEn: `${vs.error} with errors`,
          icon: "🔴",
        };

      if (vs.warning > 0)
        return {
          status: "warning",
          labelDe: `${vs.valid}/${vs.total} vollständig`,
          labelEn: `${vs.valid}/${vs.total} complete`,
          icon: "🟡",
        };

      return {
        status: "valid",
        labelDe: "Alle vollständig",
        labelEn: "All complete",
        icon: "🟢",
      };
    }

    return {
      status: "valid",
      labelDe: "Vollständig",
      labelEn: "Complete",
      icon: "🟢",
    };
  }

  if (stepId === "activity") {
    const comp = getChildComp(activityRef);

    const items = comp?.items || [];

    if (items.length === 0) {
      const form = comp?.form;

      const hasId = Boolean(
        String(form?.["recordInformation.id"] || "").trim(),
      );

      if (hasId)
        return {
          status: "warning",
          labelDe: "Entwurf ungespeichert",
          labelEn: "Unsaved draft",
          icon: "🟡",
        };

      return {
        status: "error",
        labelDe: "Keine Aktivitäten",
        labelEn: "No activities",
        icon: "🔴",
      };
    }

    if (comp?.validationStats) {
      const vs = comp.validationStats;

      if (vs.error > 0)
        return {
          status: "error",
          labelDe: `${vs.error} mit Fehlern`,
          labelEn: `${vs.error} with errors`,
          icon: "🔴",
        };

      if (vs.warning > 0)
        return {
          status: "warning",
          labelDe: `${vs.valid}/${vs.total} vollständig`,
          labelEn: `${vs.valid}/${vs.total} complete`,
          icon: "🟡",
        };

      return {
        status: "valid",
        labelDe: "Alle vollständig",
        labelEn: "All complete",
        icon: "🟢",
      };
    }

    return {
      status: "valid",
      labelDe: "Vollständig",
      labelEn: "Complete",
      icon: "🟢",
    };
  }

  if (stepId === "files") {
    const fileCount = Object.keys(fileHashes.value || {}).length;

    if (currentFile.value && progress.value > 0 && progress.value < 100) {
      return {
        status: "warning",
        labelDe: "Hashing läuft...",
        labelEn: "Hashing in progress...",
        icon: "🟡",
      };
    }

    if (fileCount > 0) {
      return {
        status: "valid",
        labelDe: `${fileCount} gehasht`,
        labelEn: `${fileCount} hashed`,
        icon: "🟢",
      };
    }

    return {
      status: "error",
      labelDe: "Keine Dateien",
      labelEn: "No files",
      icon: "🔴",
    };
  }

  return { status: "error", labelDe: "Fehlt", labelEn: "Missing", icon: "🔴" };
};

const completedSectionsCount = computed(() => {
  let count = 0;

  for (const step of steps) {
    if (filledStatus.value[step.id]?.groupFilled) count++;
  }

  return count;
});

const activeStepIndex = ref(0);

const sectionRefs = ref([]);

const scrollContainer = ref(null);

let observer = null;

// Helper to generate a SHA-256 hash from a string or binary buffer

const generateSHA256 = async (input) => {
  let data;

  if (typeof input === "string") {
    data = new TextEncoder().encode(input);
  } else if (input instanceof Uint8Array) {
    data = input;
  } else if (input instanceof ArrayBuffer) {
    data = new Uint8Array(input);
  } else {
    data = new TextEncoder().encode(String(input));
  }

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

const scrollToSection = (index) => {
  if (sectionRefs.value[index]) {
    sectionRefs.value[index].scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

const activitySubNav = [
  { id: "act-basics", de: "Basisdaten & Zeitraum", en: "Basics & Dates" },
  { id: "act-actors", de: "Beteiligte & Rollen", en: "Actors & Roles" },
  { id: "act-3d", de: "3D-Digitalisierung", en: "3D Digitisation" },
  {
    id: "act-processing",
    de: "Prozessierungsschritte",
    en: "Processing Steps",
  },
  {
    id: "act-dap",
    de: "Authentizitätsprofil (DAP)",
    en: "Authenticity Profile (DAP)",
  },
];

const getSidebarItemLabel = (item, idx, prefix) => {
  if (!item) return `${prefix}-${idx + 1}`;
  const id =
    item["recordInformation.id"] ||
    item["appellation.id"] ||
    `${prefix}-${idx + 1}`;
  let name = "";
  if (Array.isArray(item["appellation.name"]) && item["appellation.name"][0]) {
    name = item["appellation.name"][0]._value || "";
  } else if (Array.isArray(item["title"]) && item["title"][0]) {
    name = item["title"][0]._value || "";
  }
  return name ? `${id}: ${name}` : id;
};

const scrollToSubSection = (sectionIndex, firstLevel, levelData) => {
  const sectionEl = sectionRefs.value?.[sectionIndex];
  if (!sectionEl) return;
  const searchNames = [levelData?.nameDE, levelData?.nameEN, firstLevel].filter(
    Boolean,
  );
  const headings = sectionEl.querySelectorAll(
    "h2, h3, h4, h5, span.font-bold, label",
  );
  for (const h of headings) {
    const text = (h.textContent || "").trim().toLowerCase();
    if (searchNames.some((n) => text.includes(n.toLowerCase()))) {
      h.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
  }
  scrollToSection(sectionIndex);
};

const jumpToItem = (stepId, sectionIndex, itemIdx) => {
  scrollToSection(sectionIndex);
  const comp =
    stepId === "heritage"
      ? getChildComp(heritageRef)
      : stepId === "digital"
        ? getChildComp(digitalRef)
        : null;
  if (comp && typeof comp.edit === "function") {
    comp.edit(itemIdx);
  }
};

const scrollToActivityAnchor = (sectionIndex, anchorId) => {
  const target = document.getElementById(anchorId);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    scrollToSection(sectionIndex);
  }
};

const handleScroll = () => {
  if (!scrollContainer.value) return;

  const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value;

  // If the user has scrolled to within 5px of the absolute bottom

  if (Math.ceil(scrollTop + clientHeight) >= scrollHeight - 5) {
    activeStepIndex.value = steps.length - 1;
  }
};

const handleGlobalKeyDown = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
    const activeModal = document.querySelector("dialog[open]");

    const activeDrawer = document.querySelector(".drawer-toggle:checked");

    if (activeModal || activeDrawer) {
      return;
    }

    e.preventDefault();

    const currentComp = [
      collectionRef.value?.[0],

      heritageRef.value?.[0],

      digitalRef.value?.[0],

      activityRef.value?.[0],
    ][activeStepIndex.value];

    if (currentComp && typeof currentComp.save === "function") {
      currentComp.save();
    }
  }
};

onMounted(() => {
  themeChange(false);

  window.addEventListener("keydown", handleGlobalKeyDown);

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // If the section intersects with our viewport boundaries, update the active step

        if (entry.isIntersecting) {
          activeStepIndex.value = Number(entry.target.dataset.index);
        }
      });
    },

    {
      // These margins ensure the step updates when the header is near the top of the screen,

      // rather than waiting for the entire section to be visible.

      rootMargin: "-20% 0px -70% 0px",

      threshold: 0,
    },
  );

  sectionRefs.value.forEach((el) => {
    if (el) observer.observe(el);
  });
});

onUnmounted(() => {
  if (observer) observer.disconnect();

  window.removeEventListener("keydown", handleGlobalKeyDown);
});

// 1. Add these refs near your other state variables in App.vue

// ==========================================

// DRAG & DROP AND IMPORT LOGIC

// ==========================================

const isDragOver = ref(false);

let dragCounter = 0;

const handleDragEnter = (e) => {
  e.preventDefault();

  dragCounter++;

  isDragOver.value = true;
};

const handleDragOver = (e) => {
  e.preventDefault();

  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = "copy";
  }

  isDragOver.value = true;
};

const handleDragLeave = (e) => {
  e.preventDefault();

  dragCounter--;

  if (dragCounter <= 0) {
    dragCounter = 0;

    isDragOver.value = false;
  }
};

const handleDrop = async (e) => {
  e.preventDefault();

  dragCounter = 0;

  isDragOver.value = false;

  const file = e.dataTransfer?.files?.[0];

  if (file) {
    await processImportFile(file);
  }
};

const triggerImport = async () => {
  if (isTauri()) {
    try {
      const selected = await open({
        multiple: false,

        title:
          currentLocale.value === "de"
            ? "CARARE-Datei oder BagIt-Archiv auswählen"
            : "Select CARARE file or BagIt archive",

        filters: [
          {
            name: "CARARE XML, BagIt ZIP, Templates",
            extensions: ["xml", "zip", "json"],
          },

          { name: "CARARE XML (*.xml)", extensions: ["xml"] },

          { name: "BagIt ZIP (*.zip)", extensions: ["zip"] },

          { name: "Templates (*.json)", extensions: ["json"] },

          { name: "Alle Dateien (*.*)", extensions: ["*"] },
        ],
      });

      if (selected) {
        const filePath =
          typeof selected === "string" ? selected : selected?.path;

        if (filePath) {
          const fileName = filePath.split(/[/\\]/).pop() || "imported_carare";

          const { readFile } = await import("@tauri-apps/plugin-fs");

          const fileBytes = await readFile(filePath);

          const blob = new Blob([fileBytes]);

          const fileObj = new File([blob], fileName);

          await processImportFile(fileObj);

          return;
        }
      }

      return;
    } catch (err) {
      console.error("Tauri native file import error:", err);

      alert(
        (currentLocale.value === "de"
          ? "Fehler beim Laden der Datei: "
          : "Error loading file: ") + (err.message || err),
      );

      return;
    }
  }

  if (zipFileInput.value) {
    zipFileInput.value.value = "";

    zipFileInput.value.click();
  }
};

const removeFileHash = (fileName) => {
  if (fileHashes.value && fileHashes.value[fileName]) {
    delete fileHashes.value[fileName];

    manifestContent = "";

    for (const [relativePath, hash] of Object.entries(fileHashes.value)) {
      manifestContent += `${hash} data/${relativePath}\n`;
    }
  }
};

const clearAllForms = () => {
  try {
    resetGlobalRights();
  } catch (e) {}

  const colComp = getChildComp(collectionRef);

  const haComp = getChildComp(heritageRef);

  const drComp = getChildComp(digitalRef);

  const actComp = getChildComp(activityRef);

  if (colComp) {
    colComp.items = [];
    colComp.resetForm?.(true);
  }

  if (haComp) {
    haComp.items = [];
    haComp.resetForm?.(true);
  }

  if (drComp) {
    drComp.items = [];
    drComp.resetForm?.(true);
  }

  if (actComp) {
    actComp.items = [];
    actComp.resetForm?.(true);
  }

  rawLiveCarareXml.value = "";
};

const loadNikaretePreset = () => {
  try {
    const colTpl = defaultTemplates.collectionInformation?.find((t) =>
      t.name.includes("Nikarete"),
    );

    const haTpl = defaultTemplates.heritageAssetIdentification?.find((t) =>
      t.name.includes("Nikarete"),
    );

    const drHpTpl = defaultTemplates.digitalResource?.find((t) =>
      t.name.includes("Nikarete High-Poly"),
    );

    const drLpTpl = defaultTemplates.digitalResource?.find((t) =>
      t.name.includes("Nikarete Low-Poly"),
    );

    const actTpl = defaultTemplates.activity?.find((t) =>
      t.name.includes("Nikarete"),
    );

    const colComp = getChildComp(collectionRef);

    const haComp = getChildComp(heritageRef);

    const drComp = getChildComp(digitalRef);

    const actComp = getChildComp(activityRef);

    if (colTpl && colComp) {
      colComp.items = [JSON.parse(JSON.stringify(colTpl.data))];

      if (typeof colComp.edit === "function") colComp.edit(0);
      else if (colComp.form) {
        colComp.isEditing = true;
        colComp.editIndex = 0;
        Object.assign(colComp.form, JSON.parse(JSON.stringify(colTpl.data)));
      }
    }

    if (haTpl && haComp) {
      haComp.items = [JSON.parse(JSON.stringify(haTpl.data))];

      if (typeof haComp.edit === "function") haComp.edit(0);
      else if (haComp.form) {
        haComp.isEditing = true;
        haComp.editIndex = 0;
        Object.assign(haComp.form, JSON.parse(JSON.stringify(haTpl.data)));
      }
    }

    if (drComp) {
      const drItems = [];

      if (drHpTpl) drItems.push(JSON.parse(JSON.stringify(drHpTpl.data)));

      if (drLpTpl) drItems.push(JSON.parse(JSON.stringify(drLpTpl.data)));

      if (drItems.length > 0) {
        drComp.items = drItems;

        if (typeof drComp.edit === "function") drComp.edit(0);
        else if (drComp.form) {
          drComp.isEditing = true;
          drComp.editIndex = 0;
          Object.assign(drComp.form, JSON.parse(JSON.stringify(drItems[0])));
        }
      }
    }

    if (actTpl && actComp) {
      actComp.items = [JSON.parse(JSON.stringify(actTpl.data))];

      if (typeof actComp.edit === "function") actComp.edit(0);
      else if (actComp.form) {
        actComp.isEditing = true;
        actComp.editIndex = 0;
        Object.assign(actComp.form, JSON.parse(JSON.stringify(actTpl.data)));
      }
    }

    alert(
      currentLocale.value === "de"
        ? 'Datensatz "Grabnaiskos der Nikarete (SK 740)" erfolgreich in alle Abschnitte geladen!'
        : 'Record "Grabnaiskos der Nikarete (SK 740)" successfully loaded into all sections!',
    );
  } catch (err) {
    console.error("Error loading Nikarete preset:", err);

    alert(
      currentLocale.value === "de"
        ? "Fehler beim Laden des Nikarete-Datensatzes."
        : "Error loading Nikarete dataset.",
    );
  }
};

const importFromBagIt = async (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  await processImportFile(file);

  event.target.value = "";
};

const processImportFile = async (file) => {
  if (!file) return;

  try {
    let parsedData = {
      Collection: [],

      HeritageAsset: [],

      DigitalResource: [],

      Activity: [],
    };

    if (file.name.toLowerCase().endsWith(".xml")) {
      const xmlText = await file.text();

      parsedData = parseCarareXml(xmlText);
    } else if (file.name.toLowerCase().endsWith(".json")) {
      const jsonText = await file.text();

      const jsonObj = JSON.parse(jsonText);

      if (jsonObj.collectionInformation) {
        parsedData.Collection = jsonObj.collectionInformation.map(
          (t) => t.data || t,
        );

        parsedData.HeritageAsset = (
          jsonObj.heritageAssetIdentification || []
        ).map((t) => t.data || t);

        parsedData.DigitalResource = (jsonObj.digitalResource || []).map(
          (t) => t.data || t,
        );

        parsedData.Activity = (jsonObj.activity || []).map((t) => t.data || t);
      } else {
        Object.assign(parsedData, jsonObj);
      }
    } else {
      // Treat as ZIP Archive (BagIt)

      const zip = await JSZip.loadAsync(file);

      const xmlFile = Object.values(zip.files).find((f) =>
        f.name.toLowerCase().endsWith(".xml"),
      );

      if (xmlFile) {
        const xmlText = await xmlFile.async("string");

        parsedData = parseCarareXml(xmlText);
      } else {
        const bagInfoFile = Object.values(zip.files).find((f) =>
          f.name.endsWith("bag-info.txt"),
        );

        if (!bagInfoFile) {
          alert(t("importError"));

          return;
        }

        const bagInfoContent = await bagInfoFile.async("string");

        const lines = bagInfoContent.split("\n");

        let currentRecords = {
          Collection: {},

          HeritageAsset: {},

          DigitalResource: {},

          Activity: {},
        };

        let firstKeyOfSection = {
          Collection: null,

          HeritageAsset: null,

          DigitalResource: null,

          Activity: null,
        };

        const setProperty = (obj, rawSubKey, val) => {
          if (obj[rawSubKey] !== undefined) {
            if (!Array.isArray(obj[rawSubKey]))
              obj[rawSubKey] = [obj[rawSubKey]];

            obj[rawSubKey].push(val);
          } else {
            obj[rawSubKey] = val;
          }
        };

        const stdHeaders = [
          "Bagging-Date",

          "BagIt-Version",

          "Tag-File-Character-Encoding",

          "Payload-Oxum",

          "Bag-Size",
        ];

        lines.forEach((line) => {
          const separatorIdx = line.indexOf(":");

          if (separatorIdx === -1) return;

          const rawKey = line.substring(0, separatorIdx).trim();

          const value = line.substring(separatorIdx + 1).trim();

          if (stdHeaders.includes(rawKey) || !value || rawKey.startsWith("#"))
            return;

          const dotIdx = rawKey.indexOf(".");

          if (dotIdx === -1) return;

          const section = rawKey.substring(0, dotIdx);

          const subKey = rawKey.substring(dotIdx + 1);

          if (!parsedData[section]) return;

          const rootField = subKey.split(".")[0];

          if (!firstKeyOfSection[section]) {
            firstKeyOfSection[section] = rootField;
          } else if (rootField === firstKeyOfSection[section]) {
            parsedData[section].push({ ...currentRecords[section] });

            currentRecords[section] = {};
          }

          setProperty(currentRecords[section], subKey, value);
        });

        Object.keys(currentRecords).forEach((sec) => {
          if (Object.keys(currentRecords[sec]).length > 0) {
            parsedData[sec].push(currentRecords[sec]);
          }
        });
      }
    }

    // Feed Data directly back into child Crud components with 100% field population

    const loadedSummary = [];

    const populateComponent = (compRef, dataArray, labelDe, labelEn) => {
      const comp = getChildComp(compRef);

      if (!comp) {
        console.warn("Component ref not found for import:", labelEn);

        return;
      }

      if (!Array.isArray(dataArray) || dataArray.length === 0) return;

      if (typeof comp.loadItems === "function") {
        comp.loadItems(dataArray);
      } else {
        if (Array.isArray(comp.items)) {
          comp.items.splice(0, comp.items.length, ...dataArray);
        } else if (comp.items && Array.isArray(comp.items.value)) {
          comp.items.value = [...dataArray];
        } else {
          comp.items = dataArray;
        }

        if (typeof comp.edit === "function") {
          comp.edit(0);
        }

        if (comp.form && dataArray[0]) {
          comp.isEditing = true;

          comp.editIndex = 0;

          Object.assign(comp.form, JSON.parse(JSON.stringify(dataArray[0])));
        }
      }

      loadedSummary.push(
        `${dataArray.length} ${currentLocale.value === "de" ? labelDe : labelEn}`,
      );
    };

    populateComponent(
      collectionRef,
      parsedData.Collection,
      "Sammlung(en)",
      "Collection(s)",
    );

    populateComponent(
      heritageRef,
      parsedData.HeritageAsset,
      "Kulturgut/-güter",
      "Heritage Asset(s)",
    );

    populateComponent(
      digitalRef,
      parsedData.DigitalResource,
      "Digitale Ressource(n)",
      "Digital Resource(s)",
    );

    populateComponent(
      activityRef,
      parsedData.Activity,
      "Aktivität(en)",
      "Activity/Activities",
    );

    if (loadedSummary.length > 0) {
      const titlePrefix =
        currentLocale.value === "de"
          ? `CARARE-Datei "${file.name}" erfolgreich importiert:\n`
          : `CARARE file "${file.name}" successfully imported:\n`;

      alert(titlePrefix + loadedSummary.map((s) => "• " + s).join("\n"));
    } else {
      alert(t("importSuccess"));
    }
  } catch (error) {
    console.error("Import error:", error);

    alert(t("importError") + ": " + error.message);
  }
};

// ==========================================

// EXPORT LOGIC

// ==========================================

const getRecordsFromComponent = (componentRef) => {
  const child = getChildComp(componentRef);

  if (!child) return [];

  const records = [...(child.items || [])];

  if (child.form) {
    const formId = (
      (typeof child.form["recordInformation.id"] === "string"
        ? child.form["recordInformation.id"]
        : "") ||
      (typeof child.form["appellation.id"] === "string"
        ? child.form["appellation.id"]
        : "") ||
      (typeof child.form["id"] === "string" ? child.form["id"] : "")
    ).trim();

    const existingIdx = formId
      ? records.findIndex((r) => {
          const rId = (
            (typeof r["recordInformation.id"] === "string"
              ? r["recordInformation.id"]
              : "") ||
            (typeof r["appellation.id"] === "string"
              ? r["appellation.id"]
              : "") ||
            (typeof r["id"] === "string" ? r["id"] : "")
          ).trim();
          return rId && rId === formId;
        })
      : -1;

    const isEditingExisting = Boolean(
      child.isEditing &&
      child.editIndex !== null &&
      child.editIndex !== undefined &&
      child.editIndex >= 0 &&
      child.editIndex < records.length,
    );

    if (isEditingExisting) {
      records[child.editIndex] = JSON.parse(JSON.stringify(child.form));
    } else if (existingIdx >= 0) {
      records[existingIdx] = JSON.parse(JSON.stringify(child.form));
    } else {
      // Ignore pre-populated default fields and attribute keys when checking for unsaved user input

      const defaultPrepopulatedKeys = new Set([
        "language",

        "recordInformation.language",

        "recordInformation.metadataRights",

        "rights.copyrightCreditLine",

        "rights.accessRights",

        "rights.reproductionRights",

        "rights.licence",

        "repositoryLocation",

        "coverage.spatial.locationSet.address.country",
      ]);

      const hasSubstantiveValue = (val) => {
        if (val === "" || val === null || val === undefined) return false;

        if (Array.isArray(val)) {
          return val.some((item) => hasSubstantiveValue(item));
        }

        if (typeof val === "object") {
          return Object.entries(val).some(([k, v]) => {
            if (k.includes("#")) return false;

            return hasSubstantiveValue(v);
          });
        }

        return String(val).trim() !== "";
      };

      const hasUnsavedData = Object.entries(child.form).some(([key, val]) => {
        if (key.includes("#")) return false;

        if (defaultPrepopulatedKeys.has(key)) return false;

        return hasSubstantiveValue(val);
      });

      if (hasUnsavedData) {
        records.push(JSON.parse(JSON.stringify(child.form)));
      }
    }
  }

  const cleanEmptyAttributes = (obj) => {
    const isEmptyVal = (val) => {
      if (val === "" || val === null || val === undefined) return true;

      if (Array.isArray(val) && val.length === 0) return true;

      return false;
    };

    if (Array.isArray(obj)) {
      return obj.map((item) => cleanEmptyAttributes(item));
    } else if (obj && typeof obj === "object") {
      const cleaned = {};

      for (const [k, v] of Object.entries(obj)) {
        if (k.includes("#")) {
          const parentKey = k.split("#")[0];

          let hasValue = false;

          if (obj.hasOwnProperty(parentKey)) {
            hasValue = !isEmptyVal(obj[parentKey]);
          } else if (
            obj.hasOwnProperty("_value") ||
            obj.hasOwnProperty("value") ||
            obj.hasOwnProperty("#text")
          ) {
            let parentVal = obj["_value"];

            if (parentVal === undefined) parentVal = obj["value"];

            if (parentVal === undefined) parentVal = obj["#text"];

            hasValue = !isEmptyVal(parentVal);
          }

          if (!hasValue) {
            continue;
          }
        }

        cleaned[k] =
          typeof v === "object" && v !== null ? cleanEmptyAttributes(v) : v;
      }

      return cleaned;
    }

    return obj;
  };

  return records.map((record) => cleanEmptyAttributes(record));
};

const exportToBagInfoTxt = async () => {
  // Reset states and indicate loading

  isExporting.value = true;

  exportStatus.value = null;

  errorMessage.value = "";

  try {
    const allData = {
      Collection: getRecordsFromComponent(collectionRef),

      HeritageAsset: getRecordsFromComponent(heritageRef),

      DigitalResource: getRecordsFromComponent(digitalRef),

      Activity: getRecordsFromComponent(activityRef),
    };

    let bagInfoContent = "";

    bagInfoContent += `Bagging-Date: ${new Date().toISOString().substring(0, 10)}\n`;

    bagInfoContent += `Bag-Software-Agent: HERMES (Heritage Metadata Entry System) v0.1.5\n`;

    bagInfoContent += `Metadata-Schemas: CARARE 2.0.6 (metadata/carare-v2.0.6.xml)\n`;

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

    // Generate 100% CARARE 2.0.6 compliant XML for the BagIt archive

    const carareXmlString = buildXmlString("carare", allData);

    // Generate human-readable Markdown and PDF reports

    const carareMdString = generateMarkdownReport(allData, currentLocale.value);

    const cararePdfDoc = generatePdfReport(allData, currentLocale.value);

    const cararePdfBuffer = new Uint8Array(cararePdfDoc.output("arraybuffer"));

    let bagitContent = `BagIt-Version: 1.0\n`;

    bagitContent += `Tag-File-Character-Encoding: UTF-8\n`;

    const bagitHash = await generateSHA256(bagitContent);

    const bagInfoHash = await generateSHA256(bagInfoContent);

    const carareXmlHash = await generateSHA256(carareXmlString);

    const carareMdHash = await generateSHA256(carareMdString);

    const cararePdfHash = await generateSHA256(cararePdfBuffer);

    let tagmanifestContent = `${bagitHash} bagit.txt\n`;

    tagmanifestContent += `${bagInfoHash} bag-info.txt\n`;

    tagmanifestContent += `${carareXmlHash} metadata/carare-v2.0.6.xml\n`;

    tagmanifestContent += `${carareMdHash} metadata/carare-metadata.md\n`;

    tagmanifestContent += `${cararePdfHash} metadata/carare-metadata.pdf\n`;

    const zip = new JSZip();

    zip.file("bagit.txt", bagitContent);

    zip.file("bag-info.txt", bagInfoContent);

    zip.file("metadata/carare-v2.0.6.xml", carareXmlString);

    zip.file("metadata/carare-metadata.md", carareMdString);

    zip.file("metadata/carare-metadata.pdf", cararePdfBuffer);

    zip.file("tagmanifest-sha256.txt", tagmanifestContent);

    zip.file("manifest-sha256.txt", manifestContent);

    zip.folder("data");

    const zipArrayBuffer = await zip.generateAsync({ type: "uint8array" });

    // --- 2. Save File (Native Dialog in Tauri, Browser Download in Web) ---

    const defaultFilename = `hermes-bagit-${Date.now()}.zip`;

    if (isTauri()) {
      const selectedPath = await save({
        defaultPath: defaultFilename,

        filters: [
          {
            name: "ZIP Archive",

            extensions: ["zip"],
          },
        ],
      });

      if (!selectedPath) {
        isExporting.value = false;

        return;
      }

      await writeFile(selectedPath, zipArrayBuffer);
    } else {
      const blob = new Blob([zipArrayBuffer], { type: "application/zip" });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;

      a.download = defaultFilename;

      document.body.appendChild(a);

      a.click();

      document.body.removeChild(a);

      URL.revokeObjectURL(url);
    }

    // --- On Successful Save ---

    exportStatus.value = "success";
    markExported();

    setTimeout(() => {
      exportStatus.value = null;
    }, 4000);
  } catch (error) {
    console.error("Export failed:", error);

    exportStatus.value = "error";

    errorMessage.value =
      error.message || "An unexpected error occurred during export.";
  } finally {
    isExporting.value = false;
  }
};

const exportMetadataReport = async () => {
  isExporting.value = true;

  exportStatus.value = null;

  errorMessage.value = "";

  try {
    const allData = {
      Collection: getRecordsFromComponent(collectionRef),

      HeritageAsset: getRecordsFromComponent(heritageRef),

      DigitalResource: getRecordsFromComponent(digitalRef),

      Activity: getRecordsFromComponent(activityRef),
    };

    const pdfDoc = generatePdfReport(allData, currentLocale.value);

    const pdfBuffer = new Uint8Array(pdfDoc.output("arraybuffer"));

    const defaultFilename = `hermes-metadata-report-${Date.now()}.pdf`;

    if (isTauri()) {
      const selectedPath = await save({
        defaultPath: defaultFilename,

        filters: [{ name: "PDF Document", extensions: ["pdf"] }],
      });

      if (!selectedPath) {
        isExporting.value = false;

        return;
      }

      await writeFile(selectedPath, pdfBuffer);
    } else {
      const blob = new Blob([pdfBuffer], { type: "application/pdf" });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;

      a.download = defaultFilename;

      document.body.appendChild(a);

      a.click();

      document.body.removeChild(a);

      URL.revokeObjectURL(url);
    }

    exportStatus.value = "success";
    markExported();

    setTimeout(() => {
      exportStatus.value = null;
    }, 4000);
  } catch (error) {
    console.error("Report export failed:", error);

    exportStatus.value = "error";

    errorMessage.value = error.message || "Failed to generate PDF report.";
  } finally {
    isExporting.value = false;
  }
};

const xmlPreviewSectionRef = ref(null);

const showSideXmlPreview = ref(false);

const highlightedXmlTarget = ref(null);

const xmlPanelWidth = ref(480);

const isDraggingResizer = ref(false);

let activeFieldHighlightTimer = null;

let lastHighlightedFormEl = null;

// Load saved resizer width from localStorage if available

try {
  const savedWidth = localStorage.getItem("hermes_xml_panel_width");

  if (savedWidth) {
    const parsed = parseInt(savedWidth, 10);

    if (!isNaN(parsed) && parsed >= 280 && parsed <= 1200) {
      xmlPanelWidth.value = parsed;
    }
  }
} catch (e) {}

const startResizing = (e) => {
  isDraggingResizer.value = true;

  document.body.style.cursor = "col-resize";

  document.body.style.userSelect = "none";

  const startX = e.clientX;

  const startWidth = xmlPanelWidth.value;

  const onMouseMove = (moveEvent) => {
    // Dragging left increases XML width, dragging right decreases it

    const deltaX = startX - moveEvent.clientX;

    const maxWidth = Math.max(300, window.innerWidth - 450);

    const newWidth = Math.min(maxWidth, Math.max(280, startWidth + deltaX));

    xmlPanelWidth.value = newWidth;
  };

  const onMouseUp = () => {
    isDraggingResizer.value = false;

    document.body.style.cursor = "";

    document.body.style.userSelect = "";

    window.removeEventListener("mousemove", onMouseMove);

    window.removeEventListener("mouseup", onMouseUp);

    try {
      localStorage.setItem(
        "hermes_xml_panel_width",
        xmlPanelWidth.value.toString(),
      );
    } catch (e) {}
  };

  window.addEventListener("mousemove", onMouseMove);

  window.addEventListener("mouseup", onMouseUp);
};

const resetResizerWidth = () => {
  xmlPanelWidth.value = 480;

  try {
    localStorage.setItem("hermes_xml_panel_width", "480");
  } catch (e) {}
};

const scrollToXmlPreview = () => {
  showSideXmlPreview.value = true;

  if (
    xmlPreviewSectionRef.value &&
    typeof xmlPreviewSectionRef.value.scrollIntoView === "function"
  ) {
    xmlPreviewSectionRef.value.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

// ==========================================

// BIDIRECTIONAL FORM <-> XML SYNCHRONIZATION

// ==========================================

const resolveXmlTagFromLabelText = (rawText, stepId) => {
  if (!rawText) return "";

  const text = rawText
    .replace(/\*/g, "")
    .replace(/~/g, "")
    .trim()
    .toLowerCase();

  if (!text) return "";

  // 1. Check explicit tag in parentheses or brackets, e.g. "(pointAccuracy)" or "<extent>"

  const parenTagMatch = rawText.match(/\(([a-zA-Z][a-zA-Z0-9]+)\)/);

  if (parenTagMatch && parenTagMatch[1].length > 2) {
    return parenTagMatch[1];
  }

  const angleTagMatch = rawText.match(/<([a-zA-Z][a-zA-Z0-9]+)>/);

  if (angleTagMatch) {
    return angleTagMatch[1];
  }

  // 2. Check schemaDict for this stepId

  const groupFields = schemaDict[stepId] || [];

  for (const f of groupFields) {
    const de = (f.nameDE || "").trim().toLowerCase();

    const en = (f.nameEN || "").trim().toLowerCase();

    if (
      (de && (text === de || text.includes(de))) ||
      (en && (text === en || text.includes(en)))
    ) {
      const parts = (f.fieldPath || "").split(".");

      return parts[parts.length - 1] || f.fieldPath;
    }
  }

  // 3. Common DE/EN keyword fallback map

  const keywordMap = [
    { keys: ["punktgenauigkeit", "point accuracy"], tag: "pointAccuracy" },

    {
      keys: ["registrierungsfehler", "rmse", "registration error"],
      tag: "registrationRmse",
    },

    {
      keys: ["volumetrische genauigkeit", "volumetric accuracy"],
      tag: "volumetricAccuracy",
    },

    { keys: ["kalibrierung", "calibration"], tag: "calibrationMethod" },

    { keys: ["genauigkeit", "accuracy"], tag: "accuracy" },

    {
      keys: ["räumliche 3d-auflösung", "raumauflösung", "spatial resolution"],
      tag: "spatialResolution",
    },

    {
      keys: ["gsd", "bodenauflösung", "objektauflösung", "ground sampling"],
      tag: "gsd",
    },

    {
      keys: ["texturauflösung", "texture resolution"],
      tag: "textureResolution",
    },

    { keys: ["sensorauflösung", "sensor resolution"], tag: "sensorResolution" },

    { keys: ["auflösung", "resolution"], tag: "resolution" },

    { keys: ["software", "version"], tag: "softwareList" },

    {
      keys: [
        "dap phase 1",
        "dap schritt 1",
        "erkenntnisziel",
        "digitizationintent",
      ],
      tag: "dapReference",
    },

    {
      keys: ["dap phase 2", "dap schritt 2", "erfassungsmodalität"],
      tag: "dapCapture",
    },

    {
      keys: ["dap phase 3", "dap schritt 3", "simulierte eigenschaften"],
      tag: "dapRepresentation",
    },

    {
      keys: ["erfassbare merkmale", "capturable"],
      tag: "capturableProperties",
    },

    {
      keys: ["nicht erfassbare", "not capturable"],
      tag: "notCapturableBoundaries",
    },

    { keys: ["formatdetails", "format details"], tag: "formatDetails" },

    { keys: ["dateiformat", "format"], tag: "format" },

    { keys: ["dateigröße", "ausmaß", "extent", "file size"], tag: "extent" },

    { keys: ["titel", "title"], tag: "title" },

    {
      keys: ["beschreibung", "description", "abstract", "statement"],
      tag: stepId === "collectionInformation" ? "statement" : "description",
    },

    { keys: ["schlagwort", "keyword"], tag: "keywords" },

    { keys: ["lizenz", "licence", "license"], tag: "licence" },

    {
      keys: ["urheberrecht", "copyright", "credit line"],
      tag: "copyrightCreditLine",
    },

    { keys: ["zugangsrechte", "access rights"], tag: "accessRights" },

    {
      keys: ["reproduktionsrechte", "reproduction rights"],
      tag: "reproductionRights",
    },

    { keys: ["metadaten-rechte", "metadata rights"], tag: "metadataRights" },

    { keys: ["rechte", "rights"], tag: "rights" },

    { keys: ["provenienz", "provenance", "herkunft"], tag: "provenance" },

    {
      keys: ["benannter ort", "named location", "standort", "aufbewahrungsort"],
      tag: "namedLocation",
    },

    { keys: ["stadt", "ort", "town", "city"], tag: "townOrCity" },

    { keys: ["land", "country"], tag: "country" },

    { keys: ["adresse", "address"], tag: "address" },

    {
      keys: [
        "breitengrad",
        "längengrad",
        "koordinaten",
        "coordinates",
        "quickpoint",
      ],
      tag: "quickpoint",
    },

    { keys: ["material"], tag: "materials" },

    { keys: ["inschrift", "inscription"], tag: "inscriptions" },

    { keys: ["maße", "abmessung", "dimension"], tag: "dimensions" },

    {
      keys: ["epoche", "zeitraum", "period", "timespan", "datierung"],
      tag: "temporal",
    },

    { keys: ["akteur", "actor", "person"], tag: "actors" },

    {
      keys: ["kontakt", "contact", "organisation", "organization"],
      tag: "contacts",
    },

    {
      keys: [
        "literatur",
        "referenz",
        "reference",
        "publikation",
        "publication",
      ],
      tag: "references",
    },

    { keys: ["methode", "method"], tag: "methods" },

    { keys: ["technik", "technique"], tag: "techniques" },

    {
      keys: ["gerät", "ausrüstung", "equipment", "hardware"],
      tag: "equipment",
    },

    { keys: ["bewertung", "assessment"], tag: "assessments" },

    { keys: ["teilschritt", "consistsof"], tag: "consistsOf" },

    { keys: ["ereignistyp", "event type"], tag: "eventType" },

    { keys: ["link", "url", "uri", "dateipfad"], tag: "link" },

    { keys: ["sprache", "language"], tag: "language" },

    { keys: ["datum", "date", "erstellt", "created"], tag: "date" },

    {
      keys: ["bezeichnung", "objektname", "name", "appellation"],
      tag: "appellation",
    },

    {
      keys: ["identifikator", "inventarnummer", "datensatz-id", "id"],
      tag: "id",
    },
  ];

  for (const item of keywordMap) {
    if (item.keys.some((k) => text.includes(k))) {
      return item.tag;
    }
  }

  return "";
};

const handleFormInteraction = (event, stepId) => {
  if (!stepId || stepId === "files") return;

  const target = event.target;

  if (!target || !(target instanceof HTMLElement)) return;

  // Ignore clicks on modal dialogs or pure action buttons (like delete/clear) unless inside data-xml-tag

  const xmlTagContainer = target.closest("[data-xml-tag]");

  let resolvedTag = xmlTagContainer
    ? xmlTagContainer.getAttribute("data-xml-tag")
    : "";

  let textHint = "";

  // Get value hint from input/select/textarea if focused/clicked

  const inputEl =
    target.closest("input, textarea, select") ||
    (xmlTagContainer &&
      xmlTagContainer.querySelector("input, textarea, select"));

  if (inputEl && inputEl.value && typeof inputEl.value === "string") {
    const val = inputEl.value.trim();

    if (val.length >= 2 && val.length <= 90) {
      textHint = val;
    }
  }

  if (!resolvedTag) {
    // Find nearest label or field wrapper

    const fieldWrapper = target.closest(
      ".form-control, .collapse, .p-3, .p-3\\.5, .p-4, div",
    );

    let labelText = "";

    const directLabel =
      target.closest("label") || fieldWrapper?.querySelector("label");

    if (directLabel) {
      labelText = directLabel.textContent || "";
    } else if (inputEl && inputEl.placeholder) {
      labelText = inputEl.placeholder;
    }

    resolvedTag = resolveXmlTagFromLabelText(labelText, stepId);
  }

  if (!resolvedTag && !inputEl) return;

  highlightedXmlTarget.value = {
    sectionTag: stepId,

    tagName: resolvedTag || stepId,

    textHint,

    timestamp: Date.now(),
  };
};

const pulseHighlightFormElement = (el) => {
  if (!el) return;

  if (lastHighlightedFormEl) {
    lastHighlightedFormEl.classList.remove(
      "ring-4",
      "ring-amber-400",
      "bg-amber-500/10",
      "rounded-xl",
      "transition-all",
      "duration-500",
    );
  }

  if (activeFieldHighlightTimer) {
    clearTimeout(activeFieldHighlightTimer);
  }

  el.classList.add(
    "ring-4",
    "ring-amber-400",
    "bg-amber-500/10",
    "rounded-xl",
    "transition-all",
    "duration-500",
  );

  lastHighlightedFormEl = el;

  activeFieldHighlightTimer = setTimeout(() => {
    el.classList.remove("ring-4", "ring-amber-400", "bg-amber-500/10");
  }, 2400);
};

const handleXmlLineClick = (payload) => {
  if (!payload) return;

  const {
    sectionTag,
    tagName,
    parentTag,
    rawLine = "",
    blockText = "",
  } = payload;

  const targetSectionId = sectionTag || "collectionInformation";

  const stepIdx = steps.findIndex((s) => s.id === targetSectionId);

  const sectionEl =
    stepIdx >= 0 ? sectionRefs.value[stepIdx] : sectionRefs.value[0];

  if (!sectionEl) return;

  // If clicking inside Activity DAP or repeated CARARE <consistsOf>, switch to the right DAP tab automatically

  if (targetSectionId === "activity") {
    const combinedText =
      `${tagName} ${parentTag} ${rawLine} ${blockText}`.toLowerCase();

    if (
      [
        "dapreference",
        "digitizationintent",
        "targetparadigm",
        "conservatorialconstraints",
        "capturableproperties",
        "capturableproperty",
        "notcapturableboundaries",
        "notcapturableboundary",
      ].includes(tagName.toLowerCase()) ||
      combinedText.includes("dap phase 1") ||
      combinedText.includes("[dap capturable]") ||
      combinedText.includes("[dap not capturable]")
    ) {
      window.dispatchEvent(
        new CustomEvent("hermes:select-dap-tab", { detail: "reference" }),
      );
    } else if (
      [
        "dapcapture",
        "acquisitionmodality",
        "calibrationandlighting",
        "hardwaredevices",
        "hardwaredevice",
        "accuracy",
        "pointaccuracy",
        "registrationrmse",
        "volumetricaccuracy",
        "calibrationmethod",
        "resolution",
        "spatialresolution",
        "gsd",
        "sensorresolution",
      ].includes(tagName.toLowerCase()) ||
      combinedText.includes("dap phase 2") ||
      combinedText.includes("hardware:") ||
      combinedText.includes("metrological")
    ) {
      window.dispatchEvent(
        new CustomEvent("hermes:select-dap-tab", { detail: "capture" }),
      );
    } else if (
      [
        "daprepresentation",
        "softwarepipeline",
        "geometryprocessing",
        "intentionalalterations",
        "simulatedproperties",
        "simulatedproperty",
        "blackboxtransparency",
      ].includes(tagName.toLowerCase()) ||
      combinedText.includes("dap phase 3") ||
      combinedText.includes("[dap simulated]") ||
      combinedText.includes("[geometry processing]") ||
      combinedText.includes("[intentional alterations]") ||
      combinedText.includes("software:")
    ) {
      window.dispatchEvent(
        new CustomEvent("hermes:select-dap-tab", { detail: "representation" }),
      );
    }
  }

  setTimeout(() => {
    let targetDataTag = tagName;

    const lowerRaw = rawLine.toLowerCase();

    const lowerBlock = blockText.toLowerCase();

    // Map repeated CARARE tags back to specific [data-xml-tag] targets

    if (targetSectionId === "digitalResource") {
      if (tagName === "extent") {
        if (lowerRaw.includes("point accuracy"))
          targetDataTag = "pointAccuracy";
        else if (
          lowerRaw.includes("rmse") ||
          lowerRaw.includes("registration error")
        )
          targetDataTag = "registrationRmse";
        else if (lowerRaw.includes("volumetric accuracy"))
          targetDataTag = "volumetricAccuracy";
        else if (lowerRaw.includes("spatial resolution"))
          targetDataTag = "spatialResolution";
        else if (
          lowerRaw.includes("ground sampling") ||
          lowerRaw.includes("gsd")
        )
          targetDataTag = "gsd";
        else if (lowerRaw.includes("texture resolution"))
          targetDataTag = "textureResolution";
        else if (lowerRaw.includes("sensor resolution"))
          targetDataTag = "sensorResolution";
      } else if (tagName === "note") {
        if (lowerRaw.includes("software:")) targetDataTag = "softwareList";
        else if (lowerRaw.includes("calibration"))
          targetDataTag = "calibrationMethod";
      }
    } else if (targetSectionId === "activity") {
      if (tagName === "capturableProperty")
        targetDataTag = "capturableProperties";
      else if (tagName === "notCapturableBoundary")
        targetDataTag = "notCapturableBoundaries";
      else if (tagName === "hardwareDevice") targetDataTag = "hardwareDevices";
      else if (tagName === "simulatedProperty")
        targetDataTag = "simulatedProperties";
      else if (tagName === "software") targetDataTag = "softwarePipeline";
      else if (tagName === "techniques") {
        if (lowerRaw.includes("[dap capturable]"))
          targetDataTag = "capturableProperties";
        else if (lowerRaw.includes("[dap not capturable]"))
          targetDataTag = "notCapturableBoundaries";
        else if (lowerRaw.includes("[dap simulated]"))
          targetDataTag = "simulatedProperties";
        else if (lowerRaw.includes("[geometry processing]"))
          targetDataTag = "geometryProcessing";
        else if (lowerRaw.includes("[intentional alterations]"))
          targetDataTag = "intentionalAlterations";
        else if (lowerRaw.includes("[blackbox"))
          targetDataTag = "blackboxTransparency";
        else if (lowerRaw.includes("accuracy")) targetDataTag = "accuracy";
        else if (lowerRaw.includes("resolution"))
          targetDataTag = "spatialResolution";
      } else if (tagName === "equipment") {
        if (lowerRaw.includes("hardware:")) targetDataTag = "hardwareDevices";
        else if (lowerRaw.includes("software:"))
          targetDataTag = "softwarePipeline";
      } else if (
        tagName === "consistsOf" ||
        tagName === "hadSpecificPurpose" ||
        tagName === "methods"
      ) {
        if (lowerBlock.includes("dap phase 1")) targetDataTag = "dapReference";
        else if (lowerBlock.includes("dap phase 2"))
          targetDataTag = "dapCapture";
        else if (lowerBlock.includes("dap phase 3"))
          targetDataTag = "dapRepresentation";
      } else if (tagName === "assessments") {
        if (lowerRaw.includes("accuracy")) targetDataTag = "accuracy";
        else if (lowerRaw.includes("resolution"))
          targetDataTag = "spatialResolution";
        else targetDataTag = "digitalAuthenticityProfile";
      }
    }

    // 1. Try [data-xml-tag] inside sectionEl

    let matchedEl =
      sectionEl.querySelector(`[data-xml-tag="${targetDataTag}"]`) ||
      sectionEl.querySelector(`[data-xml-tag="${tagName}"]`) ||
      (parentTag
        ? sectionEl.querySelector(`[data-xml-tag="${parentTag}"]`)
        : null);

    // 2. Try matching input/textarea value with inner text of clicked XML line

    if (!matchedEl) {
      const textMatch = rawLine.match(/>([^<]+)</);

      const innerVal = textMatch ? textMatch[1].trim() : "";

      if (innerVal && innerVal.length >= 2) {
        const allInputs = Array.from(
          sectionEl.querySelectorAll("input, textarea, select"),
        );

        const foundInput = allInputs.find(
          (inp) =>
            inp.value &&
            String(inp.value).trim().includes(innerVal.slice(0, 35)),
        );

        if (foundInput) {
          matchedEl =
            foundInput.closest(".form-control, .p-3, .p-2\\.5, div") ||
            foundInput;
        }
      }
    }

    // 3. Try matching label text using schemaDict[targetSectionId]

    if (!matchedEl && tagName) {
      const groupFields = schemaDict[targetSectionId] || [];

      const matchingSchemaEntry = groupFields.find((f) => {
        const parts = (f.fieldPath || "").split(".");

        return parts[parts.length - 1]?.toLowerCase() === tagName.toLowerCase();
      });

      const candidateLabels = [];

      if (matchingSchemaEntry) {
        if (matchingSchemaEntry.nameDE)
          candidateLabels.push(matchingSchemaEntry.nameDE.toLowerCase());

        if (matchingSchemaEntry.nameEN)
          candidateLabels.push(matchingSchemaEntry.nameEN.toLowerCase());
      }

      candidateLabels.push(tagName.toLowerCase());

      const allLabels = Array.from(
        sectionEl.querySelectorAll(
          "label, h3, h4, h5, summary, .collapse-title",
        ),
      );

      const foundLabel = allLabels.find((lbl) => {
        const txt = (lbl.textContent || "").toLowerCase();

        return candidateLabels.some((c) => c && txt.includes(c));
      });

      if (foundLabel) {
        // If inside a closed collapse, open it

        const collapseParent = foundLabel.closest(".collapse");

        if (collapseParent) {
          const checkbox = collapseParent.querySelector(
            'input[type="checkbox"]',
          );

          if (checkbox && !checkbox.checked) checkbox.checked = true;
        }

        matchedEl =
          foundLabel.closest(".form-control, .collapse, .p-3, div") ||
          foundLabel;
      }
    }

    const scrollTarget = matchedEl || sectionEl;

    const rect = scrollTarget.getBoundingClientRect();

    const isComfortablyVisible =
      rect.top >= 90 && rect.bottom <= window.innerHeight - 90;

    if (!isComfortablyVisible) {
      scrollTarget.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    pulseHighlightFormElement(scrollTarget);

    // Focus the first input/textarea/select inside matchedEl without jumping scroll

    if (matchedEl) {
      const focusable = matchedEl.matches("input, textarea, select")
        ? matchedEl
        : matchedEl.querySelector(
            "input:not([type='hidden']):not([type='checkbox']), textarea, select",
          );

      if (focusable && typeof focusable.focus === "function") {
        setTimeout(() => {
          focusable.focus({ preventScroll: true });
        }, 300);
      }
    }
  }, 60);
};

/**
 * Constructs the CARARE 2.0.6 compliant XML document string.
 *
 * Architecture & Cardinality Rules:
 * 1. Root container is <carareWrap>.
 * 2. In compliance with CARARE 2.0.6 XSD, each physical object is wrapped in its own
 *    <carare> record with a unique identifier.
 * 3. The project's single <collectionInformation> (cardinality 0..1 in schema) is shared
 *    and embedded into each <carare> record.
 * 4. Multiple <digitalResource> elements (3D master mesh, WebGL GLB derivative, raw photos)
 *    are repeated within the relevant object's <carare> record.
 * 5. Digitisation activities are linked to each object via <wasDigitizedBy>.
 * 6. Child elements are validated and strictly ordered according to CARARE schema sequence:
 *    collectionInformation -> heritageAssetIdentification -> digitalResource -> activity.
 *
 * @param {string} mode - Export mode ('carare' or legacy mode).
 * @param {Object|null} customAllData - Optional override for data records.
 * @returns {string} Fully serialized XML document with <?xml ... ?> declaration.
 */
const buildXmlString = (mode = "carare", customAllData = null) => {
  const allData = customAllData || {
    Collection: getRecordsFromComponent(collectionRef),

    HeritageAsset: getRecordsFromComponent(heritageRef),

    DigitalResource: getRecordsFromComponent(digitalRef),

    Activity: getRecordsFromComponent(activityRef),
  };
  const collections = allData.Collection || [];
  const heritageAssets = allData.HeritageAsset || [];
  const digitalResources = allData.DigitalResource || [];
  const activities = allData.Activity || [];

  const ignoredKeys = new Set([
    "language",

    "language#lang",

    "recordInformation.language",

    "recordInformation.language#lang",

    "recordInformation.metadataRights",

    "recordInformation.metadataRights#lang",

    "recordInformation.country",

    "recordInformation.country#authority",

    "recordInformation.country#lang",

    "rights.copyrightCreditLine",

    "rights.copyrightCreditLine#lang",

    "rights.accessRights",

    "rights.accessRights#lang",

    "rights.reproductionRights",

    "rights.reproductionRights#lang",

    "rights.licence",

    "rights.licence#lang",

    "repositoryLocation",

    "coverage.spatial.locationSet.address.country",

    "generalType",
  ]);

  const hasSubstantialData = (records) => {
    if (!records || !records.length) return false;

    return records.some((rec) => {
      if (!rec || typeof rec !== "object") return false;

      return Object.entries(rec).some(([key, val]) => {
        if (key.includes("#") || ignoredKeys.has(key)) return false;

        if (val === "" || val === null || val === undefined) return false;

        if (Array.isArray(val)) {
          if (val.length === 0) return false;

          return val.some((item) => {
            if (typeof item === "object" && item !== null) {
              return Object.entries(item).some(
                ([ik, iv]) =>
                  !ik.includes("#") &&
                  iv !== "" &&
                  iv !== null &&
                  iv !== undefined,
              );
            }

            return String(item).trim() !== "";
          });
        }

        if (typeof val === "object") {
          return Object.entries(val).some(
            ([ik, iv]) =>
              !ik.includes("#") && iv !== "" && iv !== null && iv !== undefined,
          );
        }

        return String(val).trim() !== "";
      });
    });
  };

  const hasAnyRecords =
    hasSubstantialData(collections) ||
    hasSubstantialData(heritageAssets) ||
    hasSubstantialData(digitalResources) ||
    hasSubstantialData(activities);

  // Return empty string on fresh restart when no data is entered

  if (!hasAnyRecords) {
    return "";
  }

  class XmlNode {
    constructor(name) {
      this.name = name;

      this.attributes = {};

      this.text = "";

      this.children = [];
    }

    getOrCreateChild(name) {
      let child = this.children.find((c) => c.name === name);

      if (!child) {
        child = new XmlNode(name);

        this.children.push(child);
      }

      return child;
    }

    addChild(name) {
      const child = new XmlNode(name);

      this.children.push(child);

      return child;
    }
  }

  const schemaSequenceMap = {
    carareWrap: ["carare"],

    carare: [
      "collectionInformation",
      "heritageAssetIdentification",
      "digitalResource",
      "activity",
    ],

    collectionInformation: [
      "id",
      "title",
      "source",
      "contacts",
      "rights",
      "language",
      "statement",
      "creation",
      "keywords",
      "coverage",
      "dcRelation",
    ],

    heritageAssetIdentification: [
      "recordInformation",
      "appellation",
      "description",
      "generalType",
      "actors",
      "designations",
      "conditions",
      "provenance",
      "characters",
      "spatial",
      "repositoryLocation",
      "publicationStatement",
      "rights",
      "references",
      "hasRepresentation",
      "isSuccessorOf",
      "wasPresentAt",
      "hasPart",
      "isPartOf",
      "isReplicaOf",
      "wasDigitizedBy",
      "dcRelation",
    ],

    digitalResource: [
      "recordInformation",
      "appellation",
      "description",
      "note",
      "actors",
      "type",
      "format",
      "formatDetails",
      "extent",
      "publicationStatement",
      "created",
      "language",
      "link",
      "object",
      "isShownAt",
      "rights",
      "isRepresentationOf",
      "hasPart",
      "isPartOf",
      "nextInSequence",
      "isPreviousInSequence",
      "isDerivativeOf",
      "hasDerivative",
      "createdDerivative",
      "dcRelation",
    ],

    activity: [
      "recordInformation",
      "appellation",
      "description",
      "hasGeneralPurpose",
      "eventType",
      "actors",
      "temporal",
      "spatial",
      "consistsOf",
      "assessments",
      "occurredAt",
      "happenedAt",
      "wasPresentAt",
      "hasPart",
      "isPartOf",
      "hasCreated",
      "dcRelation",
    ],

    recordInformation: [
      "id",
      "source",
      "country",
      "creation",
      "update",
      "language",
      "metadataRights",
    ],

    appellation: ["name", "id"],

    rights: [
      "copyrightCreditLine",
      "accessRights",
      "reproductionRights",
      "licence",
      "europeanaRights",
    ],

    spatial: [
      "locationSet",
      "geometry",
      "representations",
      "cartesianCoordinates3D",
    ],

    locationSet: [
      "namedLocation",
      "address",
      "geopoliticalArea",
      "geopoliticalAreaType",
      "cadastralReference",
      "historicalName",
    ],

    geometry: [
      "spatialReferenceSystem",
      "quickpoint",
      "boundingBox",
      "otherGeometries",
      "entity",
      "storedPrecision",
      "area",
    ],

    quickpoint: ["x", "y", "z", "accuracy"],

    boundingBox: ["minX", "maxX", "minY", "maxY", "minZ", "maxZ", "accuracy"],

    otherGeometries: ["type", "accuracy"],

    cartesianCoordinates3D: ["cartesianCoordinatesSystem", "viewpoints"],

    viewpoints: ["x", "y", "z"],

    characters: [
      "heritageAssetType",
      "temporal",
      "materials",
      "inscriptions",
      "dimensions",
      "craft",
    ],

    temporal: [
      "timeSpan",
      "periodName",
      "displayDate",
      "scientificDate",
      "scientificDateMethod",
    ],

    timeSpan: ["startDate", "endDate", "dateRangeQualifier"],

    dimensions: ["extent", "measurementType", "units", "scale", "value"],

    craft: [
      "placeOfRegistration",
      "nationality",
      "constructionMethod",
      "propulsion",
      "lastJourneyDetails",
    ],

    lastJourneyDetails: [
      "departure",
      "destination",
      "cargo",
      "mannerOfLoss",
      "dateOfLoss",
      "displayDate",
    ],

    designations: [
      "protectionType",
      "grade",
      "dateFrom",
      "dateTo",
      "displayDate",
    ],

    conditions: [
      "condition",
      "conditionAssessment",
      "conditionDate",
      "displayDate",
      "wasPresentAt",
    ],

    publicationStatement: ["publisher", "place", "date"],

    references: [
      "appellation",
      "actors",
      "type",
      "rights",
      "publicationStatement",
      "note",
      "link",
    ],

    consistsOf: [
      "hadSpecificPurpose",
      "startDate",
      "endDate",
      "methods",
      "techniques",
      "materials",
      "equipment",
    ],

    actors: [
      "id",
      "name",
      "actorType",
      "roles",
      "contacts",
      "vitalDates",
      "placeOfBirth",
      "placeOfDeath",
      "placeOfActivity",
      "bibliographicalNote",
    ],

    vitalDates: ["dateOfBirth", "dateOfDeath", "displayDate"],

    contacts: [
      "name",
      "role",
      "organization",
      "address",
      "phone",
      "fax",
      "email",
      "description",
    ],

    address: [
      "buildingName",
      "numberInRoad",
      "roadName",
      "townOrCity",
      "postcodeOrZipcode",
      "locality",
      "adminArea",
      "country",
    ],

    creation: ["date", "contacts", "createdOn", "query"],

    update: ["date", "contacts"],

    coverage: ["temporal", "spatial"],

    type: ["x", "y", "z"],
  };

  const navigateSegments = (node, segments) => {
    let current = node;

    let startIndex = 0;

    if (
      segments.length > 0 &&
      segments[0].toLowerCase() === current.name.toLowerCase()
    ) {
      startIndex = 1;
    }

    for (let i = startIndex; i < segments.length; i++) {
      current = current.getOrCreateChild(segments[i]);
    }

    return current;
  };

  const populateNode = (targetNode, data) => {
    if (data === null || data === undefined) return;

    if (typeof data !== "object") {
      let textVal = String(data);

      if (targetNode.name.toLowerCase().includes("date")) {
        textVal = normalizeYearDate(textVal);
      }

      targetNode.text = textVal;

      return;
    }

    for (const [rawKey, val] of Object.entries(data)) {
      if (val === null || val === undefined || val === "") continue;

      if (rawKey.startsWith("#")) {
        let attrName = rawKey.substring(1);

        targetNode.attributes[attrName] =
          attrName === "preferred"
            ? String(val) === "true"
              ? "true"
              : "false"
            : String(val);

        continue;
      }

      if (rawKey === "_value" || rawKey === "#text") {
        let textVal = String(val);

        if (targetNode.name.toLowerCase().includes("date")) {
          textVal = normalizeYearDate(textVal);
        }

        targetNode.text = textVal;

        continue;
      }

      let fieldPath = rawKey;

      let attrName = null;

      if (rawKey.includes("#")) {
        const parts = rawKey.split("#");

        fieldPath = parts[0];

        attrName = parts[1];
      }

      const segments = fieldPath.split(".").filter(Boolean);

      if (segments.length === 0) {
        if (attrName) {
          targetNode.attributes[attrName] =
            attrName === "preferred"
              ? String(val) === "true"
                ? "true"
                : "false"
              : String(val);
        }

        continue;
      }

      const lastSegment = segments[segments.length - 1];

      if (Array.isArray(val)) {
        if (val.length === 0) continue;

        const parentSegments = segments.slice(0, segments.length - 1);

        const parent = navigateSegments(targetNode, parentSegments);

        const siblingLang = data[`${rawKey}#lang`];

        val.forEach((item, itemIdx) => {
          if (item === null || item === undefined || item === "") return;

          if (typeof item === "object") {
            const hasObjContent = Object.entries(item).some(([k, v]) => {
              if (k.includes("#")) return false;

              if (Array.isArray(v)) return v.length > 0;

              return v !== null && v !== undefined && String(v).trim() !== "";
            });

            if (!hasObjContent) return;
          }

          const child = parent.addChild(lastSegment);

          if (attrName && typeof item !== "object") {
            child.attributes[attrName] = String(item);
          }

          if (
            typeof item !== "object" &&
            siblingLang &&
            !child.attributes["lang"]
          ) {
            child.attributes["lang"] = String(siblingLang);
          }

          if (typeof item === "object") {
            for (const [k, v] of Object.entries(item)) {
              if (k === `${lastSegment}#lang` || k === "#lang") {
                child.attributes["lang"] = String(v);
              } else if (
                k === `${lastSegment}#preferred` ||
                k === "#preferred"
              ) {
                child.attributes["preferred"] =
                  String(v) === "true" ? "true" : "false";
              }
            }

            if (
              child.attributes["preferred"] === undefined &&
              ((parent.name === "appellation" && lastSegment === "name") ||
                (parent.name === "collectionInformation" &&
                  lastSegment === "title"))
            ) {
              child.attributes["preferred"] = itemIdx === 0 ? "true" : "false";
            }
          }

          populateNode(child, item);
        });
      } else {
        if (
          attrName &&
          lastSegment.toLowerCase() === targetNode.name.toLowerCase()
        ) {
          targetNode.attributes[attrName] =
            attrName === "preferred"
              ? String(val) === "true"
                ? "true"
                : "false"
              : String(val);
        } else {
          const current = navigateSegments(targetNode, segments);

          if (attrName) {
            current.attributes[attrName] =
              attrName === "preferred"
                ? String(val) === "true"
                  ? "true"
                  : "false"
                : String(val);
          } else {
            populateNode(current, val);
          }
        }
      }
    }
  };

  const hasContent = (node) => {
    if (
      node.text !== null &&
      node.text !== undefined &&
      String(node.text).trim() !== ""
    ) {
      return true;
    }

    if (
      Object.keys(node.attributes).length > 0 &&
      (node.name === "software" ||
        node.name === "hardwareDevice" ||
        node.name === "carare")
    ) {
      return true;
    }

    return node.children.some((c) => hasContent(c));
  };

  const escapeXml = (str) => {
    if (str === null || str === undefined) return "";

    return String(str)
      .replace(/&/g, "&amp;")

      .replace(/</g, "&lt;")

      .replace(/>/g, "&gt;")

      .replace(/"/g, "&quot;")

      .replace(/'/g, "&apos;");
  };

  const sortChildrenBySchema = (node) => {
    const order = schemaSequenceMap[node.name];

    if (order && node.children.length > 1) {
      node.children.sort((a, b) => {
        const idxA = order.indexOf(a.name);

        const idxB = order.indexOf(b.name);

        const posA = idxA === -1 ? 999 : idxA;

        const posB = idxB === -1 ? 999 : idxB;

        return posA - posB;
      });
    }

    node.children.forEach(sortChildrenBySchema);
  };

  const cleanAndValidateNode = (node, parentName = "", parentNode = null) => {
    const fallbackLang =
      defaultMetadataLanguage.value || currentLocale.value || "de";

    const todayIso = new Date().toISOString().substring(0, 10);

    if (
      (!node.text || !String(node.text).trim()) &&
      node.children.length === 0 &&
      node.attributes["term"]
    ) {
      node.text = String(node.attributes["term"]).trim();
    }

    // Ensure WrapCollection (collectionInformation) always has valid <coverage><spatial><locationSet>
    if (node.name === "collectionInformation") {
      let cov = node.children.find((c) => c.name === "coverage");
      if (!cov) {
        cov = node.addChild("coverage");
      }
      let spat = cov.children.find((c) => c.name === "spatial");
      if (!spat) {
        spat = cov.addChild("spatial");
      }
      let locSet = spat.children.find((c) => c.name === "locationSet");
      if (!locSet) {
        locSet = spat.addChild("locationSet");
      }
      let namedLoc = locSet.children.find((c) => c.name === "namedLocation");
      if (!namedLoc || !namedLoc.text || !String(namedLoc.text).trim()) {
        if (!namedLoc) namedLoc = locSet.addChild("namedLocation");
        namedLoc.text = "Bonn, Deutschland";
        namedLoc.attributes["lang"] = fallbackLang;
        namedLoc.attributes["preferred"] = "true";
      }
      let addr = locSet.children.find((c) => c.name === "address");
      if (!addr) {
        addr = locSet.addChild("address");
      }
      let country = addr.children.find((c) => c.name === "country");
      if (!country || !country.text || !String(country.text).trim()) {
        if (!country) country = addr.addChild("country");
        country.text = "DE";
      }
    }

    if (
      (node.name === "heritageAssetIdentification" ||
        node.name === "digitalResource") &&
      hasContent(node)
    ) {
      node.getOrCreateChild("recordInformation");

      node.getOrCreateChild("appellation");
    }

    if (node.name === "digitalResource" && hasContent(node)) {
      let linkChild = node.children.find((c) => c.name === "link");

      if (!linkChild || !linkChild.text || !linkChild.text.trim()) {
        if (!linkChild) {
          linkChild = node.addChild("link");
        }

        linkChild.text = "https://carare.eu/resource";
      }

      let objectChild = node.children.find((c) => c.name === "object");

      if (!objectChild || !objectChild.text || !objectChild.text.trim()) {
        if (!objectChild) {
          objectChild = node.addChild("object");
        }

        objectChild.text = linkChild.text || "https://carare.eu/resource";
      }
    }

    if (
      node.name === "recordInformation" &&
      (hasContent(node) ||
        parentName === "heritageAssetIdentification" ||
        parentName === "digitalResource")
    ) {
      let idChild = node.getOrCreateChild("id");

      if (!idChild.text || !String(idChild.text).trim()) {
        const siblingAppId = parentNode?.children

          ?.find((c) => c.name === "appellation")

          ?.children?.find((c) => c.name === "id")

          ?.text?.trim();

        const parentAttrId = parentNode?.attributes?.["id"]?.trim();

        const prefix =
          parentName === "digitalResource"
            ? "DR"
            : parentName === "activity"
              ? "ACT"
              : "HA";

        idChild.text = siblingAppId || parentAttrId || `${prefix}-001`;
      }

      let creationChild = node.getOrCreateChild("creation");

      let dateChild = creationChild.getOrCreateChild("date");

      if (!dateChild.text || !String(dateChild.text).trim()) {
        dateChild.text = todayIso;
      }
    }

    if (node.name === "appellation") {
      node.children = node.children.filter(
        (c) => c.name !== "name" || (c.text && String(c.text).trim() !== ""),
      );

      if (
        hasContent(node) ||
        parentName === "heritageAssetIdentification" ||
        parentName === "digitalResource"
      ) {
        const parentRecId = parentNode?.children

          ?.find((c) => c.name === "recordInformation")

          ?.children?.find((c) => c.name === "id")

          ?.text?.trim();

        let idChild = node.children.find(
          (c) => c.name === "id" && c.text && String(c.text).trim() !== "",
        );

        let nameChild = node.children.find(
          (c) => c.name === "name" && c.text && String(c.text).trim() !== "",
        );

        if (!nameChild) {
          nameChild = node.addChild("name");

          nameChild.text =
            (idChild && String(idChild.text).trim()) ||
            parentRecId ||
            "Unbenannt";

          nameChild.attributes["lang"] = fallbackLang;

          nameChild.attributes["preferred"] = "true";
        }

        if (!idChild) {
          idChild = node.getOrCreateChild("id");

          idChild.text =
            parentRecId || String(nameChild.text).trim() || "ID-001";
        }
      }
    }

    if (node.name === "otherGeometries" && hasContent(node)) {
      let typeChild = node.getOrCreateChild("type");

      typeChild.text = "";

      if (typeChild.children.length === 0) {
        const xChild = typeChild.addChild("x");

        xChild.text = "0";
      }
    }

    if (node.name === "address" && node.children.length > 0) {
      node.children.forEach((c) => {
        if (c.name === "postcode") c.name = "postcodeOrZipcode";

        if (c.name === "county") c.name = "adminArea";
      });
    }

    if (node.name === "carare") {
      if (!node.attributes["id"] || !String(node.attributes["id"]).trim()) {
        node.attributes["id"] = "CARARE-1";
      }
    }

    if (
      (node.name === "description" ||
        node.name === "provenance" ||
        node.name === "namedLocation") &&
      hasContent(node)
    ) {
      if (!node.attributes["lang"] || !String(node.attributes["lang"]).trim()) {
        node.attributes["lang"] = fallbackLang;
      }
    }

    if (
      node.name === "name" &&
      (parentName === "appellation" || parentName === "namedLocation")
    ) {
      if (!node.attributes["lang"] || !String(node.attributes["lang"]).trim()) {
        node.attributes["lang"] = fallbackLang;
      }
    }

    // Normalize xs:decimal fields (x, y, z, minX..maxZ, dimensions/value)

    if (
      [
        "x",
        "y",
        "z",
        "minX",
        "maxX",
        "minY",
        "maxY",
        "minZ",
        "maxZ",
        "value",
      ].includes(node.name) &&
      node.text
    ) {
      const cleanedDec = String(node.text)
        .replace(",", ".")
        .match(/-?\d+(\.\d+)?/);

      node.text = cleanedDec ? cleanedDec[0] : "0";
    }

    // Normalize europeanaRights to strict CARARE 2.0.6 XSD enumeration

    if (node.name === "europeanaRights" && node.text) {
      const validEuropeana = [
        "The Public Domain Mark (PDM)",

        "No copyright - non commercial re-use only (NoC-NC)",

        "No copyright - other known legal restriction (NoC-OKLR)",

        "The Creative Commons CC0 1.0 Universal Public Domain Dedication (CC0)",

        "Creative Commons - Attribution (BY)",

        "Creative Commons - Attribution, ShareAlike (BY-SA)",

        "Creative Commons - Attribution, No Derivatives (BY-ND)",

        "Creative Commons - Attribution, Non-Commercial (BY-NC)",

        "Creative Commons - Attribution, Non-Commercial, ShareAlike (BY-NC-SA)",

        "Creative Commons - Attribution, Non-Commercial, No Derivatives (BY-NC-ND)",

        "In Copyright (InC)",

        "In Copyright - Educational Use Permitted (InC-EDU)",

        "In Copyright - EU Orphan work (InC-EU-OW)",

        "Copyright Not Evaluated (CNE)",
      ];

      if (!validEuropeana.includes(node.text.trim())) {
        const u = node.text.toUpperCase();

        if (u.includes("CC0"))
          node.text =
            "The Creative Commons CC0 1.0 Universal Public Domain Dedication (CC0)";
        else if (u.includes("BY-NC-SA"))
          node.text =
            "Creative Commons - Attribution, Non-Commercial, ShareAlike (BY-NC-SA)";
        else if (u.includes("BY-NC-ND"))
          node.text =
            "Creative Commons - Attribution, Non-Commercial, No Derivatives (BY-NC-ND)";
        else if (u.includes("BY-NC"))
          node.text = "Creative Commons - Attribution, Non-Commercial (BY-NC)";
        else if (u.includes("BY-SA"))
          node.text = "Creative Commons - Attribution, ShareAlike (BY-SA)";
        else if (u.includes("BY-ND"))
          node.text = "Creative Commons - Attribution, No Derivatives (BY-ND)";
        else if (u.includes("BY"))
          node.text = "Creative Commons - Attribution (BY)";
        else if (u.includes("PDM") || u.includes("PUBLIC DOMAIN"))
          node.text = "The Public Domain Mark (PDM)";
        else if (u.includes("INC")) node.text = "In Copyright (InC)";
        else node.text = "Copyright Not Evaluated (CNE)";
      }
    }

    if (node.name === "generalType" && node.text) {
      const t = node.text.toLowerCase().trim();

      if (
        t.includes("artefact") ||
        t.includes("artifact") ||
        t.includes("object")
      ) {
        node.text = "Artefact";
      } else if (
        t.includes("monument") ||
        t.includes("building") ||
        t.includes("denkmal")
      ) {
        node.text = "Monument";
      } else if (t.includes("3d")) {
        node.text = "3D";
      } else if (
        t.includes("image") ||
        t.includes("bild") ||
        t.includes("foto")
      ) {
        node.text = "Image";
      } else if (t.includes("sound") || t.includes("audio")) {
        node.text = "Sound";
      } else if (t.includes("movie") || t.includes("video")) {
        node.text = "Movie";
      } else if (t.includes("text")) {
        node.text = "Text";
      } else {
        node.text = "Artefact";
      }
    }

    if (node.name === "type" && parentName === "digitalResource" && node.text) {
      const t = node.text.toLowerCase().trim();

      if (t.includes("3d") || t.includes("model") || t.includes("mesh")) {
        node.text = "3D";
      } else if (t.includes("image") || t.includes("foto")) {
        node.text = "Image";
      } else if (t.includes("sound") || t.includes("audio")) {
        node.text = "Sound";
      } else if (t.includes("movie") || t.includes("video")) {
        node.text = "Movie";
      } else if (t.includes("text") || t.includes("pdf")) {
        node.text = "Text";
      } else {
        node.text = "3D";
      }
    }

    if (
      (node.name === "createdOn" ||
        (node.name === "date" &&
          (parentName === "creation" || parentName === "update"))) &&
      node.text
    ) {
      const rawDate = node.text.trim();

      if (/^-?\d{4}$/.test(rawDate)) {
        node.text = `${rawDate}-01-01`;
      } else if (/^-?\d{4}-\d{2}$/.test(rawDate)) {
        node.text = `${rawDate}-01`;
      } else if (/^(\d{2})\.(\d{2})\.(\d{4})$/.test(rawDate)) {
        const m = rawDate.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);

        node.text = `${m[3]}-${m[2]}-${m[1]}`;
      } else if (!/^-?\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
        node.text = todayIso;
      }
    }

    for (const attr of [
      "preferred",
      "openAccess",
      "isPart",
      "blackboxDeclared",
    ]) {
      if (node.attributes[attr] !== undefined) {
        node.attributes[attr] =
          String(node.attributes[attr]).toLowerCase() === "true"
            ? "true"
            : "false";
      }
    }

    // Automatic URI & Authority Vocabulary Resolution (HECTOR, Pleiades, Getty AAT, GND)

    if (
      [
        "heritageAssetType",
        "eventType",
        "assessments",
        "roles",
        "placeOfBirth",
        "placeOfDeath",
        "placeOfActivity",
        "namedLocation",
        "historicalName",
      ].includes(node.name)
    ) {
      const candidate =
        node.text ||
        node.attributes["term"] ||
        node.attributes["termUID"] ||
        "";

      if (candidate) {
        const resolved = resolveTermUri(candidate);

        if (resolved && resolved.uri) {
          node.text = resolved.label;

          node.attributes["term"] = resolved.label;

          node.attributes["termUID"] = resolved.termUID;

          node.attributes["namespace"] = resolved.namespace;
        }
      }
    } else if (
      ["materials", "methods", "techniques", "periodName"].includes(
        node.name,
      ) &&
      node.text
    ) {
      node.text = resolveTermList(node.text);
    }

    // Strict XSD attribute whitelist per (parentName, node.name)

    const getAllowedAttributes = (elName, pName) => {
      if (elName === "carareWrap")
        return ["xmlns", "xmlns:hermes", "xmlns:xsi", "xsi:schemaLocation"];

      if (elName === "carare") return ["id"];

      if (
        [
          "title",
          "statement",
          "displayDate",
          "periodName",
          "dateOfLoss",
          "bibliographicalNote",
        ].includes(elName)
      ) {
        return ["lang", "preferred"];
      }

      if (
        [
          "source",
          "language",
          "protectionType",
          "grade",
          "condition",
          "conditionAssessment",
          "conditionDate",

          "provenance",
          "materials",
          "repositoryLocation",
          "note",
          "format",
          "formatDetails",
          "hasGeneralPurpose",

          "metadataRights",
          "copyrightCreditLine",
          "accessRights",
          "reproductionRights",
          "licence",
          "measurementType",

          "placeOfRegistration",
          "nationality",
          "constructionMethod",
          "propulsion",
          "lastJourneyDetails",
          "departure",

          "destination",
          "cargo",
          "mannerOfLoss",
          "scientificDate",
          "scientificDateMethod",
          "actorType",
          "dateOfBirth",

          "dateOfDeath",
          "role",
          "organization",
          "publisher",
          "place",
          "hadSpecificPurpose",
          "methods",
          "techniques",
          "equipment",
        ].includes(elName)
      ) {
        return ["lang"];
      }

      if (
        ["keywords", "dateRangeQualifier", "geopoliticalAreaType"].includes(
          elName,
        )
      )
        return ["lang", "namespace"];

      if (elName === "dcRelation") {
        if (pName === "collectionInformation") return ["lang", "preferred"];

        if (pName === "heritageAssetIdentification") return ["type"];

        return [];
      }

      if (elName === "description") return ["lang", "preferred", "type"];

      if (
        [
          "heritageAssetType",
          "eventType",
          "assessments",
          "roles",
          "placeOfBirth",
          "placeOfDeath",
          "placeOfActivity",
        ].includes(elName)
      ) {
        return ["lang", "namespace", "term", "termUID"];
      }

      if (["namedLocation", "historicalName"].includes(elName))
        return ["lang", "preferred", "namespace", "term", "termUID"];

      if (elName === "inscriptions")
        return ["lang", "type", "namespace", "preferred"];

      if (elName === "type") return pName === "references" ? ["lang"] : [];

      if (elName === "extent") {
        if (pName === "digitalResource")
          return ["term", "lang", "namespace", "termUID"];

        if (pName === "dimensions") return ["lang"];

        return [];
      }

      if (elName === "name") {
        if (pName === "appellation") return ["lang", "preferred"];

        if (pName === "actors" || pName === "contacts") return ["lang"];

        return [];
      }

      if (elName === "country") {
        if (pName === "address") return ["lang", "authority"];

        if (pName === "recordInformation") return ["lang"];

        return [];
      }

      if (
        [
          "buildingName",
          "numberInRoad",
          "townOrCity",
          "locality",
          "adminArea",
        ].includes(elName)
      )
        return ["lang", "authority"];

      if (elName === "postcodeOrZipcode") return ["authority"];

      if (elName === "geopoliticalArea") return ["lang", "type"];

      if (elName === "cadastralReference") return ["ref"];

      if (elName === "value") return ["valueAccuracy"];

      if (elName === "vitalDates") return ["type", "lang"];

      if (elName === "digitalAuthenticityProfile") return ["schemaVersion"];

      if (elName === "software")
        return ["name", "version", "role", "blackboxDeclared"];

      if (elName === "hardwareDevice") return ["name", "type", "specs"];

      if (
        [
          "capturableProperty",
          "notCapturableBoundary",
          "simulatedProperty",
        ].includes(elName)
      )
        return ["status"];

      return [];
    };

    const allowedAttrs = getAllowedAttributes(node.name, parentName);

    for (const k of Object.keys(node.attributes)) {
      if (!allowedAttrs.includes(k)) {
        delete node.attributes[k];
      }
    }

    node.children.forEach((c) => cleanAndValidateNode(c, node.name, node));
  };

  const serializeXmlNode = (node, indentLevel = 0) => {
    const indent = "  ".repeat(indentLevel);

    let attrStr = "";

    for (const [attrName, attrVal] of Object.entries(node.attributes)) {
      if (attrVal !== null && attrVal !== undefined && attrVal !== "") {
        attrStr += ` ${attrName}="${escapeXml(attrVal)}"`;
      }
    }

    const validChildren = node.children.filter((c) => hasContent(c));

    const hasText =
      node.text !== null &&
      node.text !== undefined &&
      String(node.text).trim() !== "";

    const hasChildren = validChildren.length > 0;

    if (!hasText && !hasChildren && Object.keys(node.attributes).length === 0) {
      return "";
    }

    if (hasChildren) {
      let xml = `${indent}<${node.name}${attrStr}>\n`;

      if (hasText) {
        xml += `${indent}  ${escapeXml(node.text)}\n`;
      }

      for (const child of validChildren) {
        const childXml = serializeXmlNode(child, indentLevel + 1);

        if (childXml) {
          xml += childXml;
        }
      }

      xml += `${indent}</${node.name}>\n`;

      return xml;
    } else if (hasText) {
      return `${indent}<${node.name}${attrStr}>${escapeXml(node.text)}</${node.name}>\n`;
    } else {
      return `${indent}<${node.name}${attrStr} />\n`;
    }
  };

  const rootNode = new XmlNode("carareWrap");

  rootNode.attributes["xmlns"] = "http://www.carare.eu/carareSchema";

  rootNode.attributes["xmlns:xsi"] =
    "http://www.w3.org/2001/XMLSchema-instance";

  rootNode.attributes["xsi:schemaLocation"] =
    "http://www.carare.eu/carareSchema http://www.carare.eu/xmlSchemas/v2.0.6/carare-v2.0.6.xsd";

  const enrichCollectionRecord = (colRecord) => {
    const rec = { ...colRecord };

    rec["rights.copyrightCreditLine"] =
      rec["rights.copyrightCreditLine"] ||
      globalRights.copyrightCreditLine ||
      "";

    rec["rights.accessRights"] =
      rec["rights.accessRights"] || globalRights.accessRights || "";

    rec["rights.reproductionRights"] =
      rec["rights.reproductionRights"] || globalRights.reproductionRights || "";

    rec["rights.licence"] = rec["rights.licence"] || globalRights.licence || "";

    const hasSpatialArr =
      Array.isArray(rec["coverage.spatial"]) && rec["coverage.spatial"].length > 0;
    const matchedOrg =
      (savedOrganizations.value || []).find((o) => o.name === rec["source"]) ||
      savedOrganizations.value?.[0];
    if (!hasSpatialArr && !rec["coverage.spatial.locationSet.address.country"]) {
      rec["coverage.spatial.locationSet.address.country"] = (
        matchedOrg?.country || "DE"
      ).toUpperCase();
    }
    if (
      !hasSpatialArr &&
      (!rec["coverage.spatial.locationSet.namedLocation"] ||
        (Array.isArray(rec["coverage.spatial.locationSet.namedLocation"]) &&
          rec["coverage.spatial.locationSet.namedLocation"].length === 0))
    ) {
      const loc = matchedOrg
        ? matchedOrg.city
          ? `${matchedOrg.city}, ${matchedOrg.name}`
          : matchedOrg.name
        : rec["source"] || "Bonn, Deutschland";
      rec["coverage.spatial.locationSet.namedLocation"] = [loc];
    }

    return rec;
  };

  // Normalize actors array so actorType ('person' | 'organisation') and repeated roles array serialize cleanly
  const normalizeActorsForXml = (actorsList) => {
    if (!Array.isArray(actorsList)) return actorsList;
    return actorsList
      .filter((a) => a && (a.name || a.actor))
      .map((a) => {
        const rawType = (a.actorType || a.type || "person").toLowerCase();
        const actorType =
          rawType === "organization" || rawType === "organisation"
            ? "organisation"
            : rawType === "workshop"
              ? "organisation"
              : "person";
        let rolesArr = [];
        if (Array.isArray(a.roles)) {
          rolesArr = a.roles.map((r) => String(r).trim()).filter(Boolean);
        } else if (a.roles || a.role) {
          rolesArr = String(a.roles || a.role)
            .split(",")
            .map((r) => r.trim())
            .filter(Boolean);
        }
        const out = {
          id: a.id || a.actorUID || "",
          name: a.name || a.actor || "",
          actorType,
        };
        if (rolesArr.length > 0) {
          out.roles = rolesArr;
        }
        return out;
      });
  };

  const enrichHeritageAssetRecord = (haRecord) => {
    const rec = { ...haRecord };

    if (Array.isArray(rec["actors"])) {
      rec["actors"] = normalizeActorsForXml(rec["actors"]);
    }

    // Inherit physical heritage asset rights, or fallback to general rights
    rec["rights.copyrightCreditLine"] =
      rec["rights.copyrightCreditLine"] ||
      globalRights.haCopyrightCreditLine ||
      globalRights.copyrightCreditLine ||
      "";

    rec["rights.accessRights"] =
      rec["rights.accessRights"] ||
      globalRights.haAccessRights ||
      globalRights.accessRights ||
      "";

    rec["rights.reproductionRights"] =
      rec["rights.reproductionRights"] ||
      globalRights.haReproductionRights ||
      globalRights.reproductionRights ||
      "";

    rec["rights.licence"] =
      rec["rights.licence"] ||
      globalRights.haLicence ||
      globalRights.licence ||
      "";

    // Automatically link to digitisation activity via wasDigitizedBy if not explicitly set
    const existingWdb = Array.isArray(rec["wasDigitizedBy"])
      ? rec["wasDigitizedBy"].filter(Boolean)
      : rec["wasDigitizedBy"]
        ? [rec["wasDigitizedBy"]]
        : [];
    if (existingWdb.length === 0 && activities && activities.length > 0) {
      const actId =
        activities[0]["recordInformation.id"] ||
        activities[0]["appellation.id"] ||
        "Activity_1";
      rec["wasDigitizedBy"] = [actId];
    }

    return rec;
  };

  // Enrich DigitalResource: map accuracy, resolution, softwareList & extentList into repeated <extent> and <note> elements!

  const enrichDigitalResourceRecord = (drRecord) => {
    const rec = { ...drRecord };

    if (Array.isArray(rec["actors"])) {
      rec["actors"] = normalizeActorsForXml(rec["actors"]);
    }

    rec["rights.copyrightCreditLine"] =
      rec["rights.copyrightCreditLine"] ||
      globalRights.copyrightCreditLine ||
      "";

    rec["rights.accessRights"] =
      rec["rights.accessRights"] || globalRights.accessRights || "";

    rec["rights.reproductionRights"] =
      rec["rights.reproductionRights"] || globalRights.reproductionRights || "";

    rec["rights.licence"] = rec["rights.licence"] || globalRights.licence || "";

    const acc = rec["accuracy"] || {};

    const res = rec["resolution"] || {};

    const swList = Array.isArray(rec["softwareList"])
      ? rec["softwareList"]
      : [];

    const extList = Array.isArray(rec["extentList"])
      ? [...rec["extentList"]]
      : [];

    // Build repeated <extent> tags (CARARE XSD allows maxOccurs="unbounded" on <extent>)

    const repeatedExtents = [];

    if (extList.length > 0) {
      extList.forEach((e) => {
        if (e && !repeatedExtents.includes(e)) repeatedExtents.push(e);
      });
    } else {
      if (rec["extent"]) {
        if (Array.isArray(rec["extent"])) {
          rec["extent"].forEach((e) => {
            if (e) repeatedExtents.push(e);
          });
        } else {
          repeatedExtents.push(String(rec["extent"]));
        }
      }

      if (res.spatialResolution)
        repeatedExtents.push(`3D Spatial Resolution: ${res.spatialResolution}`);

      if (res.gsd)
        repeatedExtents.push(`Ground Sampling Distance (GSD): ${res.gsd}`);

      if (res.textureResolution)
        repeatedExtents.push(`Texture Resolution: ${res.textureResolution}`);

      if (res.sensorResolution)
        repeatedExtents.push(
          `Optical Sensor Resolution: ${res.sensorResolution}`,
        );

      if (acc.pointAccuracy)
        repeatedExtents.push(`3D Point Accuracy: ${acc.pointAccuracy}`);

      if (acc.registrationRmse)
        repeatedExtents.push(
          `Registration Error (RMSE): ${acc.registrationRmse}`,
        );

      if (acc.volumetricAccuracy)
        repeatedExtents.push(`Volumetric Accuracy: ${acc.volumetricAccuracy}`);
    }

    if (repeatedExtents.length > 0) {
      rec["extent"] = repeatedExtents;
    }

    // Build repeated <note> tags for Calibration and each Software + Version + Role

    const existingNotes = Array.isArray(rec["note"])
      ? [...rec["note"]]
      : rec["note"]
        ? [String(rec["note"])]
        : [];

    if (acc.calibrationMethod) {
      const calNote = `Metrology Calibration & Standard: ${acc.calibrationMethod}`;

      if (!existingNotes.includes(calNote)) existingNotes.push(calNote);
    }

    swList.forEach((sw) => {
      if (sw && sw.name) {
        const swNote = `Software: ${sw.name}${sw.version ? ` | Version: ${sw.version}` : ""}${sw.role ? ` | Role: ${sw.role}` : ""}`;

        if (!existingNotes.includes(swNote)) existingNotes.push(swNote);
      }
    });

    if (existingNotes.length > 0) {
      rec["note"] = existingNotes;
    }

    // Strip internal non-CARARE keys before populateNode

    delete rec["accuracy"];

    delete rec["resolution"];

    delete rec["softwareList"];

    delete rec["extentList"];

    delete rec["digitalAuthenticityProfile"];

    delete rec["assessmentsList"];

    return rec;
  };

  // Enrich Activity: map DAP into repeated <consistsOf> and repeated <assessments> elements

  const enrichActivityRecord = (actRecord) => {
    const rec = { ...actRecord };

    if (Array.isArray(rec["actors"])) {
      rec["actors"] = normalizeActorsForXml(rec["actors"]);
    }

    let assessList = [];

    if (
      Array.isArray(rec["assessmentsList"]) &&
      rec["assessmentsList"].length > 0
    ) {
      assessList = [...rec["assessmentsList"]];
    } else if (Array.isArray(rec["assessments"])) {
      assessList = [...rec["assessments"]];
    } else if (rec["assessments"]) {
      assessList = [String(rec["assessments"])];
    }

    // Ensure regular processing <consistsOf> steps precede DAP <consistsOf> blocks
    const consistsOfList = Array.isArray(rec["consistsOf"])
      ? rec["consistsOf"]
      : [];
    const isDapCo = (c) =>
      Boolean(
        c &&
        (c.isDap ||
          String(c.hadSpecificPurpose || "").includes(
            "Digital Authenticity Profile",
          ) ||
          String(c["methods#termUID"] || "").includes("/dap/DAP-")),
      );
    const regularCo = consistsOfList.filter((c) => !isDapCo(c));
    const dapCo = consistsOfList.filter((c) => isDapCo(c));
    if (consistsOfList.length > 0) {
      rec["consistsOf"] = [...regularCo, ...dapCo];
    }

    // Auto-derive CARARE <assessments> from DAP-1 (physical evidence) and DAP-5 (evaluation balance) if not already present
    const dap1 = consistsOfList.find(
      (c) =>
        c &&
        (c.dapId === "DAP-1" ||
          String(c["methods#termUID"] || "").endsWith("/DAP-1") ||
          String(c.hadSpecificPurpose || "").includes("Dimension 1 von 5") ||
          String(c.hadSpecificPurpose || "").includes("DAP-1")),
    );

    if (dap1) {
      const dap1Text =
        (Array.isArray(dap1.methods)
          ? dap1.methods.join("; ")
          : dap1.methods) ||
        dap1.materials ||
        dap1.techniques ||
        "";

      if (dap1Text && !assessList.some((a) => String(a).includes("DAP-1"))) {
        assessList.push(`DAP-1 Ausgangsbefund: ${dap1Text}`);
      }
    }

    const dap5 = consistsOfList.find(
      (c) =>
        c &&
        (c.dapId === "DAP-5" ||
          String(c["methods#termUID"] || "").endsWith("/DAP-5") ||
          String(c.hadSpecificPurpose || "").includes("Dimension 5 von 5") ||
          String(c.hadSpecificPurpose || "").includes("DAP-5") ||
          String(c.hadSpecificPurpose || "").includes("DAP-6")),
    );

    if (dap5) {
      const dap5Text =
        (Array.isArray(dap5.methods)
          ? dap5.methods.join("; ")
          : dap5.methods) ||
        dap5.techniques ||
        "";

      if (dap5Text && !assessList.some((a) => String(a).includes("DAP-5"))) {
        assessList.push(`DAP-5 Abbildungsbilanz: ${dap5Text}`);
      }
    }

    if (assessList.length > 0) {
      rec["assessments"] = assessList;
    } else {
      delete rec["assessments"];
    }

    delete rec["digitalAuthenticityProfile"];

    delete rec["accuracy"];

    delete rec["resolution"];

    delete rec["softwareList"];

    delete rec["assessmentsList"];

    return rec;
  };

  if (heritageAssets.length > 0) {
    const assignedDrSet = new Set();
    const assignedActSet = new Set();

    heritageAssets.forEach((haRecord, idx) => {
      const carareId =
        haRecord["recordInformation.id"] ||
        haRecord["appellation.id"] ||
        `CARARE-${idx + 1}`;
      const haId = String(
        haRecord["recordInformation.id"] || haRecord["appellation.id"] || "",
      );

      const carareContainer = rootNode.addChild("carare");

      carareContainer.attributes["id"] = carareId;

      // Exactly ONE collectionInformation per carare record (CARARE 2.0.6: minOccurs="1" maxOccurs="1")
      if (collections.length > 0 && collections[0]) {
        const colNode = carareContainer.addChild("collectionInformation");

        populateNode(colNode, enrichCollectionRecord(collections[0]));
      }

      const haNode = carareContainer.addChild("heritageAssetIdentification");

      populateNode(haNode, enrichHeritageAssetRecord(haRecord));

      // Identify relations specific to this heritage asset
      const haRelIds = new Set(
        [
          ...(Array.isArray(haRecord["hasRepresentation"])
            ? haRecord["hasRepresentation"]
            : [haRecord["hasRepresentation"]]),
          ...(Array.isArray(haRecord["hasPart"])
            ? haRecord["hasPart"]
            : [haRecord["hasPart"]]),
          ...(Array.isArray(haRecord["isRelatedTo"])
            ? haRecord["isRelatedTo"]
            : [haRecord["isRelatedTo"]]),
          ...(Array.isArray(haRecord["wasDigitizedBy"])
            ? haRecord["wasDigitizedBy"]
            : [haRecord["wasDigitizedBy"]]),
          ...(Array.isArray(haRecord["dcRelation"])
            ? haRecord["dcRelation"]
            : [haRecord["dcRelation"]]),
        ]
          .filter(Boolean)
          .map(String),
      );

      const haDrs = digitalResources.filter((drRecord) => {
        if (heritageAssets.length === 1) return true;
        const drId = String(
          drRecord["recordInformation.id"] || drRecord["appellation.id"] || "",
        );
        if (haRelIds.has(drId)) return true;
        const drRelIds = new Set(
          [
            ...(Array.isArray(drRecord["isRepresentationOf"])
              ? drRecord["isRepresentationOf"]
              : [drRecord["isRepresentationOf"]]),
            ...(Array.isArray(drRecord["isRelatedTo"])
              ? drRecord["isRelatedTo"]
              : [drRecord["isRelatedTo"]]),
            ...(Array.isArray(drRecord["hasRepresentation"])
              ? drRecord["hasRepresentation"]
              : [drRecord["hasRepresentation"]]),
            ...(Array.isArray(drRecord["isPartOf"])
              ? drRecord["isPartOf"]
              : [drRecord["isPartOf"]]),
            ...(Array.isArray(drRecord["dcRelation"])
              ? drRecord["dcRelation"]
              : [drRecord["dcRelation"]]),
          ]
            .filter(Boolean)
            .map(String),
        );
        if (haId && drRelIds.has(haId)) return true;
        if (haId && drId) {
          const haTokens = haId
            .split(/[-_\s]+/)
            .filter(
              (t) =>
                t.length > 2 && !/^(HA|HERMES|CARARE|DR|ACT|\d+)$/i.test(t),
            );
          if (
            haTokens.some((tok) =>
              drId.toUpperCase().includes(tok.toUpperCase()),
            )
          )
            return true;
        }
        return false;
      });

      const matchedDrIds = new Set(
        haDrs
          .map((d) =>
            String(d["recordInformation.id"] || d["appellation.id"] || ""),
          )
          .filter(Boolean),
      );

      const haActs = activities.filter((actRecord) => {
        // If there is only 1 campaign activity in the project, it brackets all heritage assets
        if (activities.length === 1) return true;
        if (heritageAssets.length === 1) return true;
        const actId = String(
          actRecord["recordInformation.id"] ||
            actRecord["appellation.id"] ||
            "",
        );
        if (haRelIds.has(actId)) return true;
        const actRelIds = new Set(
          [
            ...(Array.isArray(actRecord["isRelatedTo"])
              ? actRecord["isRelatedTo"]
              : [actRecord["isRelatedTo"]]),
            ...(Array.isArray(actRecord["hasRepresentation"])
              ? actRecord["hasRepresentation"]
              : [actRecord["hasRepresentation"]]),
            ...(Array.isArray(actRecord["dcRelation"])
              ? actRecord["dcRelation"]
              : [actRecord["dcRelation"]]),
          ]
            .filter(Boolean)
            .map(String),
        );
        if (haId && actRelIds.has(haId)) return true;
        if ([...matchedDrIds].some((dId) => actRelIds.has(dId))) return true;
        if (haId && actId) {
          const haTokens = haId
            .split(/[-_\s]+/)
            .filter(
              (t) =>
                t.length > 2 && !/^(HA|HERMES|CARARE|DR|ACT|\d+)$/i.test(t),
            );
          if (
            haTokens.some((tok) =>
              actId.toUpperCase().includes(tok.toUpperCase()),
            )
          )
            return true;
        }
        return false;
      });

      haDrs.forEach((drRecord) => {
        const dId =
          drRecord["recordInformation.id"] || drRecord["appellation.id"] || "";
        assignedDrSet.add(dId);
        const drNode = carareContainer.addChild("digitalResource");
        populateNode(drNode, enrichDigitalResourceRecord(drRecord));
      });

      if (idx === heritageAssets.length - 1) {
        digitalResources.forEach((drRecord) => {
          const dId =
            drRecord["recordInformation.id"] ||
            drRecord["appellation.id"] ||
            "";
          if (!assignedDrSet.has(dId)) {
            const drNode = carareContainer.addChild("digitalResource");
            populateNode(drNode, enrichDigitalResourceRecord(drRecord));
          }
        });
      }

      haActs.forEach((actRecord) => {
        const aId =
          actRecord["recordInformation.id"] ||
          actRecord["appellation.id"] ||
          "";
        assignedActSet.add(aId);
        const actNode = carareContainer.addChild("activity");
        populateNode(actNode, enrichActivityRecord(actRecord));
      });

      if (idx === heritageAssets.length - 1) {
        activities.forEach((actRecord) => {
          const aId =
            actRecord["recordInformation.id"] ||
            actRecord["appellation.id"] ||
            "";
          if (!assignedActSet.has(aId)) {
            const actNode = carareContainer.addChild("activity");
            populateNode(actNode, enrichActivityRecord(actRecord));
          }
        });
      }
    });
  } else {
    const defaultId = collections[0]?.["id"] || "HERMES-COLLECTION-001";

    const carareContainer = rootNode.addChild("carare");

    carareContainer.attributes["id"] = defaultId;

    collections.forEach((colRecord) => {
      const colNode = carareContainer.addChild("collectionInformation");

      populateNode(colNode, enrichCollectionRecord(colRecord));
    });

    digitalResources.forEach((drRecord) => {
      const drNode = carareContainer.addChild("digitalResource");

      populateNode(drNode, enrichDigitalResourceRecord(drRecord));
    });

    activities.forEach((actRecord) => {
      const actNode = carareContainer.addChild("activity");

      populateNode(actNode, enrichActivityRecord(actRecord));
    });
  }

  cleanAndValidateNode(rootNode);

  sortChildrenBySchema(rootNode);

  let xmlOut = `<?xml version="1.0" encoding="UTF-8"?>\n`;

  xmlOut += serializeXmlNode(rootNode, 0);

  return xmlOut;
};

const rawLiveCarareXml = ref("");

let debounceXmlTimer = null;

const updateLiveXmlDebounced = () => {
  if (debounceXmlTimer) clearTimeout(debounceXmlTimer);

  debounceXmlTimer = setTimeout(() => {
    try {
      rawLiveCarareXml.value = buildXmlString("carare");
    } catch (e) {
      rawLiveCarareXml.value = `<!-- XML preview error: ${e.message} -->`;
    }
  }, 300);
};

// Immediate first build

try {
  rawLiveCarareXml.value = buildXmlString("carare");
} catch (e) {
  rawLiveCarareXml.value = `<!-- XML preview error: ${e.message} -->`;
}

// Watch forms to trigger debounced update

watch(
  [
    () => getChildComp(collectionRef)?.form,

    () => getChildComp(heritageRef)?.form,

    () => getChildComp(digitalRef)?.form,

    () => getChildComp(activityRef)?.form,

    () => getChildComp(collectionRef)?.items,

    () => getChildComp(heritageRef)?.items,

    () => getChildComp(digitalRef)?.items,

    () => getChildComp(activityRef)?.items,

    currentLocale,
  ],

  () => {
    updateLiveXmlDebounced();
  },

  { deep: true },
);

const liveCarareXml = computed(() => {
  return rawLiveCarareXml.value || "";
});

const exportSingleCarareXmlsZip = async () => {
  isExporting.value = true;
  exportStatus.value = null;
  errorMessage.value = "";

  try {
    const allData = {
      Collection: getRecordsFromComponent(collectionRef),
      HeritageAsset: getRecordsFromComponent(heritageRef),
      DigitalResource: getRecordsFromComponent(digitalRef),
      Activity: getRecordsFromComponent(activityRef),
    };

    const heritageAssets = allData.HeritageAsset || [];
    if (heritageAssets.length === 0) {
      throw new Error(
        currentLocale.value === "de"
          ? "Keine Kulturgüter vorhanden."
          : "No heritage assets recorded.",
      );
    }

    const zip = new JSZip();

    heritageAssets.forEach((haRecord, idx) => {
      const haId = String(
        haRecord["recordInformation.id"] ||
          haRecord["appellation.id"] ||
          `HA-${idx + 1}`,
      ).trim();
      const safeId = haId.replace(/[^a-zA-Z0-9._-]/g, "_");

      // Generate a standalone CARARE XML file for this single heritage asset
      const singleXml = buildXmlString("carare", {
        Collection: allData.Collection || [],
        HeritageAsset: [haRecord],
        DigitalResource: allData.DigitalResource || [],
        Activity: allData.Activity || [],
      });

      zip.file(`CARARE_${safeId}.xml`, singleXml);
    });

    // Also include a summary README inside the ZIP
    const isDe = currentLocale.value === "de";
    const readmeContent = isDe
      ? `HERMES CARARE 2.0.6 - Einzelfile-Export (1 XML-Datei pro Kulturgut)
` +
        `====================================================================

` +
        `Anzahl generierter CARARE-Objektdateien: ${heritageAssets.length}
` +
        `Erstellungsdatum: ${new Date().toISOString()}

` +
        `Jede Datei enthält einen vollwertigen, validen CARARE-2.0.6-Datensatz (<carareWrap><carare id="...">),
` +
        `bestehend aus der Sammlungsidentifikation, genau dem jeweiligen Kulturgut,
` +
        `dessen zugeordneten 3D-Ressourcen und der Digitalisierungsaktivität.
`
      : `HERMES CARARE 2.0.6 - Individual Record Export (1 XML file per object)
` +
        `===================================================================

` +
        `Number of CARARE object files: ${heritageAssets.length}
` +
        `Generated: ${new Date().toISOString()}

` +
        `Each XML file contains a self-contained, valid CARARE 2.0.6 record (<carareWrap><carare id="...">),
` +
        `including collection information, exactly one heritage asset, its digital resources, and activity.
`;

    zip.file("README.txt", readmeContent);

    const zipContent = await zip.generateAsync({ type: "uint8array" });
    const defaultFilename = `hermes-carare-einzelfiles-${Date.now()}.zip`;

    if (isTauri()) {
      const selectedPath = await save({
        defaultPath: defaultFilename,
        filters: [{ name: "ZIP Archive", extensions: ["zip"] }],
      });
      if (!selectedPath) {
        isExporting.value = false;
        return;
      }
      await writeFile(selectedPath, zipContent);
    } else {
      const blob = new Blob([zipContent], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = defaultFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    exportStatus.value = "success";
    markExported();
    setTimeout(() => {
      exportStatus.value = null;
    }, 4000);
  } catch (error) {
    console.error("Single CARARE XML Export failed:", error);
    exportStatus.value = "error";
    errorMessage.value =
      error.message || "An unexpected error occurred during export.";
  } finally {
    isExporting.value = false;
  }
};

const exportToCarareXML = async () => {
  isExporting.value = true;

  exportStatus.value = null;

  errorMessage.value = "";

  try {
    const carareXmlContent = buildXmlString("carare");

    const defaultFilename = `hermes-carare-${Date.now()}.xml`;

    if (isTauri()) {
      const selectedPath = await save({
        defaultPath: defaultFilename,

        filters: [
          {
            name: "CARARE 2.0.6 XML File",

            extensions: ["xml"],
          },
        ],
      });

      if (!selectedPath) {
        isExporting.value = false;

        return;
      }

      const encoder = new TextEncoder();

      const xmlArrayBuffer = encoder.encode(carareXmlContent);

      await writeFile(selectedPath, xmlArrayBuffer);
    } else {
      const blob = new Blob([carareXmlContent], { type: "application/xml" });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;

      a.download = defaultFilename;

      document.body.appendChild(a);

      a.click();

      document.body.removeChild(a);

      URL.revokeObjectURL(url);
    }

    exportStatus.value = "success";
    markExported();

    setTimeout(() => {
      exportStatus.value = null;
    }, 4000);
  } catch (error) {
    console.error("CARARE XML Export failed:", error);

    exportStatus.value = "error";

    errorMessage.value =
      error.message || "An unexpected error occurred during XML export.";
  } finally {
    isExporting.value = false;
  }
};
</script>
