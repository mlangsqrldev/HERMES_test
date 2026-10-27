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
      <div class="glass-panel p-8 rounded-3xl shadow-2xl border-2 border-dashed border-primary flex flex-col items-center gap-4 text-center max-w-md animate-pulse bg-base-100/90">
        <div class="p-4 rounded-2xl bg-primary/10 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h3 class="font-display font-black text-2xl text-base-content">
          {{ currentLocale === 'de' ? 'CARARE XML oder BagIt hier ablegen' : 'Drop CARARE XML or BagIt here' }}
        </h3>
        <p class="text-xs text-base-content/70">
          {{ currentLocale === 'de' ? 'Unterstützt alle CARARE 2.0.x XML-Dateien, BagIt-Archive (.zip) und HERMES-Templates (.json)' : 'Supports any CARARE 2.0.x XML file, BagIt ZIP archives, and HERMES JSON templates' }}
        </p>
      </div>
    </div>

    <!-- Modern Glassmorphic Top Header -->
    <header class="glass-header sticky top-0 z-50 w-full px-4 lg:px-8 py-3 flex items-center justify-between transition-all">
      <!-- Brand & Logo -->
      <div class="flex items-center gap-3">
        <div class="relative flex items-center justify-center w-11 h-11 rounded-full ring-2 ring-primary/40 shadow-md shadow-primary/20 overflow-hidden bg-base-100">
          <img src="/hermes_god_logo.png" alt="HERMES Logo - Greek God Hermes" class="w-full h-full object-cover" />
          <span class="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
          </span>
        </div>
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <span class="font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">HERMES</span>
            <span class="badge badge-xs font-mono text-[10px] badge-primary badge-outline px-1.5 py-0.5">v0.1.5</span>
            <span class="badge badge-xs font-mono text-[10px] badge-ghost opacity-70">CARARE 2.0.6</span>
          </div>
          <span class="text-[11px] font-medium text-base-content/60 tracking-normal hidden sm:inline">
            Heritage Metadata Entry System
          </span>
        </div>
      </div>

      <!-- Center: Interactive Quick-Nav Pills -->
      <nav class="hidden md:flex items-center gap-1.5 bg-base-100/70 p-1 rounded-full border border-base-content/10 backdrop-blur-md shadow-xs">
        <button
          v-for="(step, idx) in steps"
          :key="step.id"
          type="button"
          @click="scrollToSection(idx)"
          class="px-3 py-1 text-xs font-medium rounded-full transition-all flex items-center gap-1.5"
          :class="idx === activeStepIndex 
            ? 'bg-primary text-primary-content shadow-xs font-semibold' 
            : 'hover:bg-base-200 text-base-content/75'"
        >
          <span 
            class="w-2 h-2 rounded-full transition-all shrink-0"
            :class="{
              'bg-success shadow-xs shadow-success/50': getSectionQualityStatus(step.id).status === 'valid',
              'bg-warning shadow-xs shadow-warning/50': getSectionQualityStatus(step.id).status === 'warning',
              'bg-error shadow-xs shadow-error/50': getSectionQualityStatus(step.id).status === 'error'
            }"
          ></span>
          <span>{{ currentLocale === 'de' ? step.de : step.en }}</span>
          <span 
            v-if="getRecordCount(step.id) > 0"
            class="px-1.5 py-0.2 rounded-full text-[10px] font-mono leading-none"
            :class="idx === activeStepIndex ? 'bg-primary-content/25 text-primary-content' : 'bg-base-300 text-base-content/80'"
          >
            {{ getRecordCount(step.id) }}
          </span>
        </button>
      </nav>

      <!-- Right: Controls (Shortcut, Locale Switcher, Theme Switcher) -->
      <div class="flex items-center gap-2.5">
        <!-- Save Shortcut Badge -->
        <div class="hidden xl:flex items-center gap-1 text-xs text-base-content/60 bg-base-200/60 px-2.5 py-1 rounded-lg border border-base-300/60" :title="currentLocale === 'de' ? 'Aktiven Eintrag speichern (Strg+S)' : 'Save active record (Ctrl+S)'">
          <kbd class="kbd kbd-xs">Ctrl</kbd>+<kbd class="kbd kbd-xs">S</kbd>
          <span class="text-[11px]">{{ currentLocale === 'de' ? 'Speichern' : 'Save' }}</span>
        </div>

        <!-- GeoNames & API Settings Button -->
        <button
          type="button"
          class="btn btn-sm btn-ghost gap-1.5 px-2.5 font-medium border border-base-300/80 hover:border-primary text-xs"
          @click="openApiSettings"
          :title="currentLocale === 'de' ? 'API-Zugangsdaten (GeoNames Benutzername & Passwort/Token) verwalten' : 'Manage API credentials (GeoNames username & password/token)'"
        >
          <span>🔑</span>
          <span class="hidden md:inline font-semibold">GeoNames</span>
        </button>

        <!-- Handbook / Manual Link Button -->
        <button
          type="button"
          class="btn btn-sm btn-ghost gap-1.5 px-2.5 font-medium border border-base-300/80 hover:border-primary text-xs text-base-content/85 hover:text-primary transition-all cursor-pointer"
          @click="openManual"
          :title="currentLocale === 'de' ? 'Praxis-Handbuch für Museum & Ausgrabung öffnen' : 'Open Field & Museum Handbook'"
        >
          <span>📖</span>
          <span class="hidden md:inline font-semibold">{{ currentLocale === 'de' ? 'Handbuch' : 'Manual' }}</span>
        </button>

        <!-- UI Language Switcher DE / EN – flags -->
        <div class="flex items-center border border-base-300/80 rounded-lg overflow-hidden bg-base-200/50 p-0.5 shadow-xs">
          <button
            type="button"
            class="btn btn-xs border-0 rounded-md px-2 min-w-0"
            :class="currentLocale === 'de' ? 'btn-primary shadow-xs' : 'btn-ghost opacity-60 hover:opacity-100'"
            @click="currentLocale = 'de'"
            title="Deutsch"
          >
            <FlagIcon code="de" size="md" />
          </button>
          <button
            type="button"
            class="btn btn-xs border-0 rounded-md px-2 min-w-0"
            :class="currentLocale === 'en' ? 'btn-primary shadow-xs' : 'btn-ghost opacity-60 hover:opacity-100'"
            @click="currentLocale = 'en'"
            title="English"
          >
            <FlagIcon code="en" size="md" />
          </button>
        </div>

        <!-- Dark/Light toggle -->
        <label class="btn btn-sm btn-ghost btn-circle swap swap-rotate" :title="currentLocale === 'de' ? 'Erscheinungsbild umschalten' : 'Toggle theme'">
          <input type="checkbox" value="corporate" class="theme-controller" />
          <!-- sun icon -->
          <svg class="swap-on fill-current w-4 h-4 text-warning" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
          <!-- moon icon -->
          <svg class="swap-off fill-current w-4 h-4 opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
        </label>
      </div>
    </header>

    <!-- Main Content Layout -->
    <div class="flex relative w-full max-w-7xl mx-auto px-4 pt-6 pb-24 items-start gap-8">
      <!-- Left Sidebar Container -->
      <aside class="sticky top-20 left-0 w-72 shrink-0 flex flex-col gap-4">
        <!-- Navigation Card -->
        <div class="glass-panel rounded-2xl p-4 shadow-lg border border-base-200/80 flex flex-col gap-4">
          <div class="flex items-center justify-between pb-2 border-b border-base-200/70">
            <div>
              <h3 class="font-display font-bold text-sm tracking-wide text-base-content/90">{{ currentLocale === 'de' ? 'Workflow & Validierung' : 'Workflow & Status' }}</h3>
              <p class="text-[11px] text-base-content/60">{{ completedSectionsCount }}/5 {{ currentLocale === 'de' ? 'Abschnitte bereit' : 'sections ready' }}</p>
            </div>
            <div class="radial-progress text-primary text-xs font-mono font-bold" :style="{ '--value': (completedSectionsCount / 5) * 100, '--size': '2.2rem', '--thickness': '3px' }" role="progressbar">
              {{ Math.round((completedSectionsCount / 5) * 100) }}%
            </div>
          </div>

          <!-- Tree Navigation Menu -->
          <ul class="w-full menu p-0 gap-1">
            <li v-for="(step, index) in steps" :key="index" :tabindex="index" class="collapse rounded-xl transition-all" :class="[
              step.id !== 'files' ? 'collapse-arrow' : '',
              index === activeStepIndex ? 'collapse-open bg-base-200/60 shadow-xs' : 'collapse-close hover:bg-base-200/30',
            ]">
              <div class="flex items-center gap-2 cursor-pointer font-bold text-sm collapse-title py-2 px-3"
                @click="scrollToSection(index)"
                :class="index === activeStepIndex ? 'text-primary' : 'text-base-content/80'">
                <span 
                  class="size-2.5 rounded-full shrink-0 shadow-2xs"
                  :class="{
                    'bg-success shadow-xs shadow-success/40': getSectionQualityStatus(step.id).status === 'valid',
                    'bg-warning shadow-xs shadow-warning/40': getSectionQualityStatus(step.id).status === 'warning',
                    'bg-error shadow-xs shadow-error/40': getSectionQualityStatus(step.id).status === 'error'
                  }"
                  :title="currentLocale === 'de' ? getSectionQualityStatus(step.id).labelDe : getSectionQualityStatus(step.id).labelEn"
                ></span>
                <span class="flex-1 truncate">{{ currentLocale === "de" ? step.de : step.en }}</span>
                <span v-if="getRecordCount(step.id) > 0" class="badge badge-xs badge-neutral font-mono font-normal">
                  {{ getRecordCount(step.id) }}
                </span>
              </div>

              <ul v-if="requiredTree[step.id]" class="ml-4 pb-2 border-l-2 border-base-300/60 pl-3 collapse-content">
                <li v-for="(levelData, firstLevel) in requiredTree[step.id]" :key="firstLevel" class="my-0.5">
                  <div class="flex items-center gap-2 cursor-default text-xs font-medium py-1 px-1.5 rounded hover:bg-base-200/50"
                    @click="scrollToSection(index)">
                    <input type="checkbox" class="checkbox checkbox-xs cursor-default"
                      :checked="filledStatus[step.id]?.firstLevels?.[firstLevel]" onclick="return false;" />
                    <span class="truncate opacity-80">{{ currentLocale === "de" ? levelData.nameDE : levelData.nameEN }}</span>
                  </div>
                </li>
              </ul>
            </li>
          </ul>

          <!-- Legend -->
          <div class="flex items-center justify-between text-[11px] pt-1 px-1 border-t border-base-200/70 text-base-content/70">
            <div class="flex items-center gap-1.5">
              <span class="text-accent font-black text-sm leading-none">*</span>
              <span>{{ t("req") }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-warning font-black text-sm leading-none">~</span>
              <span>{{ t("rec") }}</span>
            </div>
          </div>
        </div>

        <!-- Actions & Export Card -->
        <div class="glass-panel rounded-2xl p-4 shadow-lg border border-base-200/80 flex flex-col gap-2.5">
          <div class="text-xs font-bold uppercase tracking-wider text-base-content/50 px-1">
            {{ currentLocale === 'de' ? 'Aktionen & Export' : 'Actions & Export' }}
          </div>

          <input type="file" ref="zipFileInput" class="hidden" accept=".zip,.xml,.json" @change="importFromBagIt" />

          <!-- Primäre Aktion: CARARE-Datei laden (öffnet Dateiauswahl-Fenster) -->
          <button 
            type="button"
            class="btn btn-sm btn-primary gap-2 justify-start font-bold shadow-md shadow-primary/20 hover:scale-[1.02] transition-all" 
            @click="triggerImport"
            :title="currentLocale === 'de' ? 'Dateiauswahl-Fenster öffnen um CARARE-XML (.xml), BagIt-ZIP (.zip) oder Template (.json) zu laden' : 'Open file dialog to select and load CARARE XML (.xml), BagIt ZIP (.zip), or Template (.json)'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
              <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
            </svg>
            <span class="truncate">{{ currentLocale === 'de' ? 'CARARE-Datei laden' : 'Load CARARE file' }}</span>
          </button>


          <!-- Alles leeren / zurücksetzen -->
          <button 
            type="button"
            class="btn btn-xs btn-ghost text-error/80 hover:text-error hover:bg-error/10 gap-2 justify-start font-medium text-xs transition-all" 
            @click="clearAllForms"
            :title="currentLocale === 'de' ? 'Alle Abschnitte und Formulare leeren' : 'Clear all sections and forms'"
          >
            <span>🗑️</span>
            <span class="truncate">{{ currentLocale === 'de' ? 'Alle Einträge leeren' : 'Clear all records' }}</span>
          </button>

          <button class="btn btn-sm btn-outline gap-2 justify-start font-medium hover:border-primary hover:text-primary transition-all" @click="exportToBagInfoTxt"
            :disabled="currentFile != '' && progress != 100">
            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
              <path d="M160-80v-80h640v80H160Zm320-160L200-600h160v-280h240v280h160L480-240Z" />
            </svg>
            {{ t("exportBagIt") }}
          </button>

          <button class="btn btn-sm btn-primary gap-2 justify-start font-bold shadow-md shadow-primary/20 hover:scale-[1.02] transition-all" @click="exportToCarareXML"
            :disabled="currentFile != '' && progress != 100">
            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
              <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520Z"/>
            </svg>
            {{ t("exportCARAREXML") }}
          </button>

          <div v-if="exportStatus === 'success'"
            class="p-2.5 text-xs font-semibold text-success-content bg-success/20 border border-success/30 rounded-xl flex items-center gap-2 animate-fadeIn">
            <span class="text-sm">✓</span> {{ t("exportSuccess") }}
          </div>

          <div v-if="exportStatus === 'error'"
            class="p-2.5 text-xs font-semibold text-error-content bg-error/20 border border-error/30 rounded-xl flex items-center gap-2 animate-fadeIn">
            <span class="text-sm">⚠</span> {{ t("exportError") }} {{ errorMessage }}
          </div>
        </div>
      </aside>

      <!-- Main Scroll Section Container -->
      <div class="flex-1 min-w-0 flex flex-col gap-10 pb-32" ref="scrollContainer" @scroll="handleScroll">
        <GlobalDefaultsBar 
          :current-locale="currentLocale" 
          @apply-rights="applyGlobalRightsToAll"
          @apply-language="applyGlobalLanguageToAll"
          @apply-collection="applyGlobalCollectionToForm"
          @bulk-apply-campaign="applyGlobalCampaignToAll"
        />

        <section v-for="(step, index) in steps" :key="index" ref="sectionRefs" :data-index="index"
          class="modern-card bg-base-100 shadow-md border border-base-200/80 rounded-2xl overflow-hidden transition-all duration-300 scroll-mt-20">
          <!-- Card Header (non-sticky to prevent overlapping fields during scroll) -->
          <div class="px-6 py-4 border-b border-base-200/70 flex items-center justify-between bg-base-100/90 rounded-t-2xl">
            <div class="flex items-center gap-3">
              <span class="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary font-mono font-bold text-xs">
                0{{ index + 1 }}
              </span>
              <h2 class="font-display font-bold text-xl text-base-content tracking-tight">
                {{ currentLocale == "de" ? step.de : step.en }}
              </h2>
              <span v-if="getRecordCount(step.id) > 0" class="badge badge-sm badge-ghost font-mono">
                {{ getRecordCount(step.id) }} {{ currentLocale === 'de' ? (getRecordCount(step.id) === 1 ? 'Eintrag' : 'Einträge') : (getRecordCount(step.id) === 1 ? 'record' : 'records') }}
              </span>
              <!-- Quality Status Ampel Badge -->
              <span 
                class="badge badge-sm gap-1.5 text-[11px] font-semibold border shadow-2xs"
                :class="{
                  'badge-success bg-success/15 text-success border-success/30': getSectionQualityStatus(step.id).status === 'valid',
                  'badge-warning bg-warning/15 text-warning border-warning/30': getSectionQualityStatus(step.id).status === 'warning',
                  'badge-error bg-error/15 text-error border-error/30': getSectionQualityStatus(step.id).status === 'error'
                }"
              >
                <span 
                  class="size-1.5 rounded-full"
                  :class="{
                    'bg-success': getSectionQualityStatus(step.id).status === 'valid',
                    'bg-warning': getSectionQualityStatus(step.id).status === 'warning',
                    'bg-error': getSectionQualityStatus(step.id).status === 'error'
                  }"
                ></span>
                {{ currentLocale === 'de' ? getSectionQualityStatus(step.id).labelDe : getSectionQualityStatus(step.id).labelEn }}
              </span>
            </div>

            <div class="flex items-center gap-1" v-if="step.id != 'files'">
              <div class="tooltip tooltip-bottom" :data-tip="t('addtemplate')">
                <button type="button" class="btn btn-sm btn-ghost btn-circle" @click="openAddTemplateModal(step.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 opacity-70 hover:opacity-100 text-primary">
                    <path d="M5 21v-16q0 -0.825 0.588 -1.413T7 3h6v2H7v12.95l5 -2.15 5 2.15v-6.95h2v10L12 18 5 21Zm2 -16h6 -6Zm10 4v-2h-2v-2h2v-2h2v2h2v2h-2v2h-2Z" />
                  </svg>
                </button>
              </div>
              <div class="tooltip tooltip-bottom" :data-tip="t('template')">
                <button type="button" class="btn btn-sm btn-ghost btn-circle" @click="openTemplateModal(step.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 opacity-70 hover:opacity-100 text-accent">
                    <path d="M4 22v-14q0 -0.825 0.588 -1.413T6 6h8q0.825 0 1.413 0.588T16 8v14L10 19 4 22Zm2 -3.025 4 -2.15 4 2.15v-10.975H6v10.975Zm12 -0.975v-14H7v-2h11q0.825 0 1.413 0.588T20 4v14h-2ZM6 8h8 -8Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="p-6">
            <CollectionInformationCrud v-if="step.id === 'collectionInformation'" ref="collectionRef" />
            <HeritageAssetIdentificationCrud v-if="step.id === 'heritageAssetIdentification'" ref="heritageRef" />
            <DigitalResourceCrud v-if="step.id === 'digitalResource'" ref="digitalRef" />
            <ActivityCrud v-if="step.id === 'activity'" ref="activityRef" />
            <div v-if="step.id === 'files'" class="space-y-6">
              <input type="file" ref="folderInput" webkitdirectory directory multiple class="hidden" @change="handleBrowserDirectorySelect" />
              <div class="flex items-center gap-4">
                <button class="btn btn-primary gap-2" @click="handleDirectorySelect">
                  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                    <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z"/>
                  </svg>
                  {{ t("selectDir") }}
                </button>
              </div>

              <div v-if="currentFile && progress != 100" class="mt-4 p-4 rounded-xl bg-base-200/50 border border-base-300/50">
                <div class="flex justify-between text-xs font-semibold mb-1.5">
                  <span class="truncate">{{ t("hashing") }} {{ currentFile }}</span>
                  <span class="font-mono text-primary">{{ progress.toFixed(1) }}%</span>
                </div>
                <progress class="progress progress-primary w-full" :value="progress" max="100"></progress>
              </div>

              <div class="border border-base-200 rounded-xl overflow-hidden shadow-xs">
                <div class="overflow-x-auto">
                  <table class="table table-sm w-full table-zebra">
                    <thead class="bg-base-200/70 text-xs uppercase font-bold text-base-content/70">
                      <tr>
                        <th>{{ t("file") }}</th>
                        <th>{{ t("hash") }}</th>
                        <th class="w-20 text-right">{{ t("actions") }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(hash, fileName, idx) in fileHashes" :key="idx" class="hover">
                        <td class="font-mono text-xs">{{ fileName }}</td>
                        <td class="font-mono text-xs text-base-content/70">{{ hash }}</td>
                        <td class="text-right">
                          <button type="button" class="btn btn-xs btn-ghost text-error" @click.prevent="removeFileHash(fileName)">
                            {{ t("del") }}
                          </button>
                        </td>
                      </tr>
                      <tr v-if="!fileHashes || Object.keys(fileHashes).length === 0">
                        <td colspan="100" class="text-center text-base-content/40 py-6 italic text-sm">
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
  <dialog ref="templateModal" class="modal">
    <div class="modal-box max-w-md">
      <h3 class="font-bold text-lg mb-6">{{ currentLocale === 'de' ? 'Vorlage wählen' : 'Choose a Template' }}</h3>

      <form method="dialog" class="flex flex-col gap-3">
        <div v-for="(tpl, idx) in templates[activeTemplateStep] || []" :key="idx" class="join w-full">
          <button class="btn btn-outline justify-start font-normal flex-1 join-item"
            @click="applyTemplate(activeTemplateStep, tpl.data)">
            {{ tpl.name }}
          </button>
          <button class="btn btn-outline btn-error join-item"
            @click.prevent="confirmDeleteTemplate(activeTemplateStep, idx)">
            <svg class="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
              stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        <div v-if="!(templates[activeTemplateStep] && templates[activeTemplateStep].length > 0)"
          class="text-sm italic opacity-50 py-4">{{ t('noItems') }}</div>
      </form>

      <div class="divider my-6">{{ t('or') }}</div>

      <div class="modal-action w-full mt-0">
        <form method="dialog" class="w-full">
          <button class="btn btn-primary w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-1">
              <path
                d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
            </svg>
            {{ t('customEdit') }}
          </button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
  <dialog ref="addTemplateModal" class="modal">
    <div class="modal-box max-w-md">
      <h3 class="font-bold text-lg mb-6">{{ t('addtemplate') }}</h3>

      <div class="flex flex-col gap-4">
        <input type="text" v-model="newTemplateName" :placeholder="t('templateName')"
          class="input input-bordered w-full" />
        <div class="modal-action mt-2 w-full">
          <form method="dialog" class="w-full">
            <button class="btn btn-primary w-full" @click="addTemplate(activeAddTemplateStep)"
              :disabled="!newTemplateName">
              {{ t('addtemplate') }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
  <dialog ref="deleteTemplateModal" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">{{ t('deleteTemplatePrompt') }}</h3>
      <p class="py-4">{{ t('deleteTemplateDesc') }}</p>
      <div class="modal-action">
        <form method="dialog" class="flex gap-2">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn btn-ghost">{{ t('cancel') }}</button>
          <button class="btn btn-error" @click="executeDeleteTemplate">{{ t('del') }}</button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>

  <!-- GeoNames API Credentials & Web Services Modal -->
  <ApiSettingsModal :is-open="isApiSettingsOpen" :current-locale="currentLocale" @close="closeApiSettings" />
</template>

<script setup>
import JSZip from "jszip";
import { ref, shallowRef, onMounted, onUnmounted, provide, computed, watch } from "vue";
import { themeChange } from "theme-change";
import CollectionInformationCrud from "./output_components/CollectionInformationCrud.vue";
import HeritageAssetIdentificationCrud from "./output_components/HeritageAssetIdentificationCrud.vue";
import DigitalResourceCrud from "./output_components/DigitalResourceCrud.vue";
import ActivityCrud from "./output_components/ActivityCrud.vue";
import GlobalDefaultsBar from "./components/GlobalDefaultsBar.vue";
import FlagIcon from "./components/FlagIcon.vue";
import ApiSettingsModal from "./components/ApiSettingsModal.vue";
import defaultTemplates from "./assets/default_templates.json";
import { parseCarareXml } from "./utils/carareXmlParser.js";
import { 
  defaultMetadataLanguage, 
  globalRights, 
  saveGlobalRights, 
  savedContacts, 
  savedActors, 
  savedOrganizations, 
  normalizeYearDate, 
  resolveLicenceUri,
  isApiSettingsOpen,
  openApiSettings,
  closeApiSettings,
  applyCampaignToHeritageAsset,
  applyCampaignToDigitalResource,
  applyCampaignToActivity
} from "./utils/sharedState.js";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { open, save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";
import { isTauri, getAppStore } from "./utils/platform.js";

const isExporting = ref(false);
const exportStatus = ref(null); // 'success', 'error', or null
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
const collectionRef = ref([]);
const heritageRef = ref([]);
const digitalRef = ref([]);
const activityRef = ref([]);
const zipFileInput = ref(null);
const folderInput = ref(null);
const openManual = async () => {
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    await invoke('open_manual_window');
  } catch (err) {
    console.warn('Tauri open_manual_window fallback:', err);
    const manualUrl = new URL('/manual.html', window.location.href).href;
    window.open(manualUrl, '_blank');
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
    collectionRef.value?.[0],
    heritageRef.value?.[0],
    digitalRef.value?.[0],
    activityRef.value?.[0]
  ].filter(Boolean);

  const targetLicence = resolveLicenceUri(rightsObj.licence, currentLocale.value);

  components.forEach(comp => {
    if (comp.form) {
      if ('recordInformation.metadataRights' in comp.form || comp.form['recordInformation.metadataRights'] !== undefined) {
        comp.form['recordInformation.metadataRights'] = rightsObj.metadataRights;
      }
      if ('rights.copyrightCreditLine' in comp.form || comp.form['rights.copyrightCreditLine'] !== undefined) {
        comp.form['rights.copyrightCreditLine'] = rightsObj.copyrightCreditLine;
      }
      if ('rights.accessRights' in comp.form || comp.form['rights.accessRights'] !== undefined) {
        comp.form['rights.accessRights'] = rightsObj.accessRights;
      }
      if ('rights.licence' in comp.form || comp.form['rights.licence'] !== undefined) {
        comp.form['rights.licence'] = targetLicence;
      }
      if ('rights.reproductionRights' in comp.form || comp.form['rights.reproductionRights'] !== undefined) {
        comp.form['rights.reproductionRights'] = rightsObj.reproductionRights;
      }
    }
    if (Array.isArray(comp.items)) {
      comp.items.forEach(item => {
        if ('recordInformation.metadataRights' in item) item['recordInformation.metadataRights'] = rightsObj.metadataRights;
        if ('rights.copyrightCreditLine' in item) item['rights.copyrightCreditLine'] = rightsObj.copyrightCreditLine;
        if ('rights.accessRights' in item) item['rights.accessRights'] = rightsObj.accessRights;
        if ('rights.licence' in item) item['rights.licence'] = targetLicence;
      });
    }
  });
};

const applyGlobalLanguageToAll = (lang) => {
  defaultMetadataLanguage.value = lang;
  const components = [
    collectionRef.value?.[0],
    heritageRef.value?.[0],
    digitalRef.value?.[0],
    activityRef.value?.[0]
  ].filter(Boolean);

  components.forEach(comp => {
    if (comp.form) {
      if (Array.isArray(comp.form['recordInformation.language'])) {
        comp.form['recordInformation.language'] = [lang];
      }
      if (Array.isArray(comp.form['appellation.name'])) {
        comp.form['appellation.name'].forEach(n => {
          if (n && typeof n === 'object') n['appellation.name#lang'] = lang;
        });
      }
      if (Array.isArray(comp.form['title'])) {
        comp.form['title'].forEach(n => {
          if (n && typeof n === 'object') n['title#lang'] = lang;
        });
      }
    }
    if (Array.isArray(comp.items)) {
      comp.items.forEach(item => {
        if (Array.isArray(item['recordInformation.language'])) {
          item['recordInformation.language'] = [lang];
        }
        if (Array.isArray(item['appellation.name'])) {
          item['appellation.name'].forEach(n => {
            if (n && typeof n === 'object') n['appellation.name#lang'] = lang;
          });
        }
      });
    }
  });
};

const applyGlobalCollectionToForm = (col) => {
  if (!col) return;
  const colComp = collectionRef.value?.[0];
  if (colComp && typeof colComp.loadFromCollectionPool === 'function') {
    colComp.loadFromCollectionPool(col);
  } else if (colComp && colComp.form) {
    if (col.id) colComp.form['id'] = col.id;
    if (col.title) {
      if (Array.isArray(colComp.form['title']) && colComp.form['title'][0]) {
        colComp.form['title'][0]._value = col.title;
      }
    }
    if (col.institution) colComp.form['source'] = col.institution;
    if (col.rights) {
      if (col.rights.licence) colComp.form['rights.licence'] = resolveLicenceUri(col.rights.licence, currentLocale.value);
      if (col.rights.accessRights) colComp.form['rights.accessRights'] = col.rights.accessRights;
      if (col.rights.copyrightCreditLine) colComp.form['rights.copyrightCreditLine'] = col.rights.copyrightCreditLine;
    }
  }
  const el = sectionRefs.value?.[0];
  if (el && typeof el.scrollIntoView === 'function') {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const applyGlobalCampaignToAll = (preset) => {
  if (!preset) return;
  // 1. Heritage Assets
  const haComp = heritageRef.value?.[0];
  if (haComp) {
    if (haComp.form) applyCampaignToHeritageAsset(haComp.form, true);
    if (Array.isArray(haComp.items)) {
      haComp.items.forEach(item => applyCampaignToHeritageAsset(item, true));
    }
  }
  // 2. Digital Resources
  const drComp = digitalRef.value?.[0];
  if (drComp) {
    if (drComp.form) applyCampaignToDigitalResource(drComp.form, true);
    if (Array.isArray(drComp.items)) {
      drComp.items.forEach(item => applyCampaignToDigitalResource(item, true));
    }
  }
  // 3. Activities
  const actComp = activityRef.value?.[0];
  if (actComp) {
    if (actComp.form) applyCampaignToActivity(actComp.form, true);
    if (Array.isArray(actComp.items)) {
      actComp.items.forEach(item => applyCampaignToActivity(item, true));
    }
  }
};

const uiTranslations = {
  en: {
    importBagIt: "Import CARARE XML / BagIt",
    importSuccess: "Data successfully imported!",
    importError:
      "Failed to parse file. Ensure it is a valid CARARE XML, BagIt ZIP, or HERMES JSON.",
    exportBagIt: "BagIt Archive",
    exportCARAREXML: "CARARE XML",
    selectDir: "Select Data Directory to Hash",
    hashing: "Hashing:",
    file: "File",
    hash: "Hash",
    edit: "Edit",
    del: "Delete",
    noItems: "No items added yet.",
    req: "Required fields",
    rec: "Recommended fields",
    template: "Fill from template",
    addtemplate: "Add as template",
    templateName: "Template name",
    or: "OR",
    customEdit: "Custom Edit",
    deleteTemplatePrompt: "Are you sure you want to delete this template?",
    deleteTemplateDesc: "This action cannot be undone.",
    cancel: "Cancel",
    exportSuccess: "Export downloaded successfully!",
    exportError: "Failed to export:",
  },
  de: {
    importBagIt: "CARARE XML / BagIt importieren",
    importSuccess: "Daten erfolgreich importiert!",
    importError:
      "Fehler beim Parsen der Datei. Stellen Sie sicher, dass es ein gültiges CARARE XML, BagIt ZIP oder HERMES JSON ist.",
    exportBagIt: "BagIt-Archiv",
    exportCARAREXML: "CARARE XML",
    selectDir: "Datenverzeichnis zum Hashen auswählen",
    hashing: "Wird gehasht:",
    file: "Datei",
    hash: "Hash",
    edit: "Bearbeiten",
    del: "Löschen",
    noItems: "Noch keine Elemente hinzugefügt.",
    req: "Pflichtfelder",
    rec: "Empfohlene Felder",
    template: "Aus Vorlage befüllen",
    addtemplate: "Als Vorlage hinzufügen",
    templateName: "Vorlagenname",
    or: "ODER",
    customEdit: "Manuell bearbeiten",
    deleteTemplatePrompt: "Sind Sie sicher, dass Sie diese Vorlage löschen möchten?",
    deleteTemplateDesc: "Diese Aktion kann nicht rückgängig gemacht werden.",
    cancel: "Abbrechen",
    exportSuccess: "Export erfolgreich heruntergeladen!",
    exportError: "Export fehlgeschlagen:",
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
  if (stepId === "collectionInformation") currentForm = collectionRef.value?.[0].form;
  else if (stepId === "heritageAssetIdentification") currentForm = heritageRef.value?.[0].form;
  else if (stepId === "digitalResource") currentForm = digitalRef.value?.[0].form;
  else if (stepId === "activity") currentForm = activityRef.value?.[0].form;

  // console.log(collectionRef.value)
  // console.log(currentForm)
  if (currentForm) {
    const dataToSave = JSON.parse(JSON.stringify(currentForm));
    // console.log(dataToSave)
    if (!templates.value[stepId]) templates.value[stepId] = [];
    templates.value[stepId].push({
      name: newTemplateName.value,
      data: dataToSave
    });

    await store.value.set(stepId, templates.value[stepId]);
    await store.value.save();
  }

  newTemplateName.value = "";
  addTemplateModal.value?.close();
};

const applyTemplate = (stepId, templateData) => {
  let targetRef = null;
  if (stepId === "collectionInformation") targetRef = collectionRef.value;
  else if (stepId === "heritageAssetIdentification") targetRef = heritageRef.value;
  else if (stepId === "digitalResource") targetRef = digitalRef.value;
  else if (stepId === "activity") targetRef = activityRef.value;

  if (targetRef && targetRef[0]?.form) {
    const cleanData = JSON.parse(JSON.stringify(templateData));
    // Strip obsolete global fields so loading templates never reverts the form to old state
    delete cleanData['recordInformation.country'];
    delete cleanData['recordInformation.country#lang'];
    delete cleanData['recordInformation.country#authority'];
    delete cleanData['recordInformation.language'];
    delete cleanData['recordInformation.language#lang'];
    delete cleanData['recordInformation.metadataRights'];
    delete cleanData['recordInformation.metadataRights#lang'];
    delete cleanData['coverage.spatial.locationSet.geopoliticalArea'];
    delete cleanData['coverage.spatial.locationSet.geopoliticalArea#lang'];
    delete cleanData['spatial.locationSet.geopoliticalArea'];
    delete cleanData['spatial.locationSet.geopoliticalArea#lang'];
    if (stepId === 'digitalResource') {
      delete cleanData['language'];
      delete cleanData['language#lang'];
    }
    if (stepId === 'heritageAssetIdentification') {
      if (cleanData['repositoryLocation'] && cleanData['repositoryLocation'].includes('Antikensammlung')) {
        cleanData['repositoryLocation'] = 'Antikensammlung, Staatliche Museen zu Berlin (GND: 5035657-4)';
      } else if (cleanData['repositoryLocation'] && (cleanData['repositoryLocation'].includes('Ägyptisches Museum') || cleanData['repositoryLocation'].includes('Aegyptisches'))) {
        cleanData['repositoryLocation'] = 'Ägyptisches Museum und Papyrussammlung, Staatliche Museen zu Berlin (GND: 5035655-0)';
      }
    }
    if (stepId === 'collectionInformation' && Array.isArray(cleanData['contacts'])) {
      cleanData['contacts'] = cleanData['contacts'].map(c => ({
        name: c.name || '',
        role: c.role || '',
        organization: c.organization || '',
        email: c.email || ''
      }));
    }
    Object.assign(targetRef[0].form, cleanData);
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

onMounted(async () => {
  try {
    store.value = await getAppStore('templates.json', { autoSave: true });

    // Load existing templates
    const keys = await store.value.keys();
    for (const stepId of keys) {
      templates.value[stepId] = (await store.value.get(stepId)) || [];
    }

    // Ensure default templates (including Nikarete SK 740) are populated/merged
    for (const [stepId, tpls] of Object.entries(defaultTemplates)) {
      if (!templates.value[stepId]) templates.value[stepId] = [];
      for (const tpl of tpls) {
        const existingIdx = templates.value[stepId].findIndex(t => t.name === tpl.name);
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
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

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
//   "Files",
// ];

// const stepsDE = [
//   "Sammlung",
//   "Kulturgut",
//   "Digitale Ressourcen",
//   "Aktivitäten",
//   "Dateien",
// ];
import schemaDict from "./assets/schema_dictionary.json";

// Group definition mapping internal IDs to display names
const steps = [
  { id: "collectionInformation", en: "Collection", de: "Sammlung" },
  { id: "heritageAssetIdentification", en: "Heritage Asset", de: "Kulturgut" },
  { id: "digitalResource", en: "Digital Resources", de: "Digitale Ressourcen" },
  { id: "activity", en: "Activities", de: "Aktivitäten" },
  { id: "files", en: "Files", de: "Dateien" },
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
  if (groupId === "collectionInformation") return collectionRef.value?.[0];
  if (groupId === "heritageAssetIdentification") return heritageRef.value?.[0];
  if (groupId === "digitalResource") return digitalRef.value?.[0];
  if (groupId === "activity") return activityRef.value?.[0];
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
    console.log(fieldsMap)
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
          if (dataObj[field.fieldPath] !== undefined) {
            const val = dataObj[field.fieldPath];
            if (Array.isArray(val)) {
              if (val.length === 0) return false;
              if (typeof val[0] === 'object' && val[0] !== null) {
                return val.some(item => (item._value || item.value || '').trim() !== '');
              }
              return true;
            }
            return val !== null && val !== undefined && String(val).trim() !== "";
          }

          // If field.fieldPath is a subfield of an array (e.g. recordInformation.creation.contacts.organization)
          const parts = field.fieldPath.split(".");
          for (let i = parts.length - 1; i > 0; i--) {
            const parentPath = parts.slice(0, i).join(".");
            const childProp = parts.slice(i).join(".");
            if (Array.isArray(dataObj[parentPath])) {
              // If parent array is empty, this nested sub-requirement does not block the firstLevel
              if (dataObj[parentPath].length === 0) return true;
              return dataObj[parentPath].every(item => {
                const subVal = item[childProp] || item[parts[parts.length - 1]];
                return subVal !== null && subVal !== undefined && String(subVal).trim() !== "";
              });
            }
          }
          return false;
        });
      };

      // 1. Check if ANY saved item has ALL required fields filled
      if (comp.items && comp.items.length > 0) {
        allFirstLevelFilled = comp.items.some(checkFilled);
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
    return { status: 'error', labelDe: 'Wird geladen...', labelEn: 'Loading...', icon: '🔴' };
  }

  if (stepId === 'collectionInformation') {
    const comp = collectionRef.value?.[0];
    const form = comp?.form;
    if (!form) return { status: 'error', labelDe: 'Nicht erfasst', labelEn: 'Not recorded', icon: '🔴' };
    const hasId = Boolean(String(form.id || '').trim());
    const hasTitle = Array.isArray(form.title) 
      ? form.title.some(t => t && String(t._value || t.value || '').trim() !== '')
      : Boolean(String(form.title || '').trim());
    const isComplete = filledStatus.value['collectionInformation']?.groupFilled;

    if (isComplete) {
      return { status: 'valid', labelDe: 'Vollständig', labelEn: 'Complete', icon: '🟢' };
    }
    if (hasId || hasTitle) {
      return { status: 'warning', labelDe: 'In Bearbeitung', labelEn: 'In Progress', icon: '🟡' };
    }
    return { status: 'error', labelDe: 'Pflichtfelder fehlen', labelEn: 'Missing required', icon: '🔴' };
  }

  if (stepId === 'heritageAssetIdentification') {
    const comp = heritageRef.value?.[0];
    const count = comp?.items?.length || 0;
    if (count === 0) {
      const form = comp?.form;
      const hasId = Boolean(String(form?.['recordInformation.id'] || '').trim());
      if (hasId) {
        return { status: 'warning', labelDe: 'Entwurf ungespeichert', labelEn: 'Unsaved draft', icon: '🟡' };
      }
      return { status: 'error', labelDe: 'Keine Kulturgüter', labelEn: 'No assets', icon: '🔴' };
    }
    if (comp?.validationStats) {
      const vs = comp.validationStats;
      if (vs.error > 0) return { status: 'error', labelDe: `${vs.error} mit Fehlern`, labelEn: `${vs.error} with errors`, icon: '🔴' };
      if (vs.warning > 0) return { status: 'warning', labelDe: `${vs.valid}/${vs.total} exportbereit`, labelEn: `${vs.valid}/${vs.total} ready`, icon: '🟡' };
      return { status: 'valid', labelDe: 'Alle exportbereit', labelEn: 'All ready', icon: '🟢' };
    }
    return filledStatus.value['heritageAssetIdentification']?.groupFilled 
      ? { status: 'valid', labelDe: 'Vollständig', labelEn: 'Complete', icon: '🟢' }
      : { status: 'warning', labelDe: 'In Bearbeitung', labelEn: 'In Progress', icon: '🟡' };
  }

  if (stepId === 'digitalResource') {
    const comp = digitalRef.value?.[0];
    const items = comp?.items || [];
    if (items.length === 0) {
      const form = comp?.form;
      const hasId = Boolean(String(form?.['recordInformation.id'] || '').trim());
      if (hasId) return { status: 'warning', labelDe: 'Entwurf ungespeichert', labelEn: 'Unsaved draft', icon: '🟡' };
      return { status: 'error', labelDe: 'Keine Ressourcen', labelEn: 'No resources', icon: '🔴' };
    }
    if (comp?.validationStats) {
      const vs = comp.validationStats;
      if (vs.error > 0) return { status: 'error', labelDe: `${vs.error} mit Fehlern`, labelEn: `${vs.error} with errors`, icon: '🔴' };
      if (vs.warning > 0) return { status: 'warning', labelDe: `${vs.valid}/${vs.total} vollständig`, labelEn: `${vs.valid}/${vs.total} complete`, icon: '🟡' };
      return { status: 'valid', labelDe: 'Alle vollständig', labelEn: 'All complete', icon: '🟢' };
    }
    return { status: 'valid', labelDe: 'Vollständig', labelEn: 'Complete', icon: '🟢' };
  }

  if (stepId === 'activity') {
    const comp = activityRef.value?.[0];
    const items = comp?.items || [];
    if (items.length === 0) {
      const form = comp?.form;
      const hasId = Boolean(String(form?.['recordInformation.id'] || '').trim());
      if (hasId) return { status: 'warning', labelDe: 'Entwurf ungespeichert', labelEn: 'Unsaved draft', icon: '🟡' };
      return { status: 'error', labelDe: 'Keine Aktivitäten', labelEn: 'No activities', icon: '🔴' };
    }
    if (comp?.validationStats) {
      const vs = comp.validationStats;
      if (vs.error > 0) return { status: 'error', labelDe: `${vs.error} mit Fehlern`, labelEn: `${vs.error} with errors`, icon: '🔴' };
      if (vs.warning > 0) return { status: 'warning', labelDe: `${vs.valid}/${vs.total} vollständig`, labelEn: `${vs.valid}/${vs.total} complete`, icon: '🟡' };
      return { status: 'valid', labelDe: 'Alle vollständig', labelEn: 'All complete', icon: '🟢' };
    }
    return { status: 'valid', labelDe: 'Vollständig', labelEn: 'Complete', icon: '🟢' };
  }

  if (stepId === 'files') {
    const fileCount = Object.keys(fileHashes.value || {}).length;
    if (currentFile.value && progress.value > 0 && progress.value < 100) {
      return { status: 'warning', labelDe: 'Hashing läuft...', labelEn: 'Hashing in progress...', icon: '🟡' };
    }
    if (fileCount > 0) {
      return { status: 'valid', labelDe: `${fileCount} gehasht`, labelEn: `${fileCount} hashed`, icon: '🟢' };
    }
    return { status: 'error', labelDe: 'Keine Dateien', labelEn: 'No files', icon: '🔴' };
  }

  return { status: 'error', labelDe: 'Fehlt', labelEn: 'Missing', icon: '🔴' };
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

// Helper to generate a SHA-256 hash from a string
const generateSHA256 = async (text) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
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
      activityRef.value?.[0]
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
        title: currentLocale.value === "de" ? "CARARE-Datei oder BagIt-Archiv auswählen" : "Select CARARE file or BagIt archive",
        filters: [
          { name: "CARARE XML, BagIt ZIP, Templates", extensions: ["xml", "zip", "json"] },
          { name: "CARARE XML (*.xml)", extensions: ["xml"] },
          { name: "BagIt ZIP (*.zip)", extensions: ["zip"] },
          { name: "Templates (*.json)", extensions: ["json"] },
          { name: "Alle Dateien (*.*)", extensions: ["*"] }
        ]
      });
      if (selected) {
        const filePath = typeof selected === "string" ? selected : selected?.path;
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
      console.warn("Tauri native file picker fallback:", err);
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
  if (collectionRef.value?.[0]) collectionRef.value[0].items = [];
  if (heritageRef.value?.[0]) heritageRef.value[0].items = [];
  if (digitalRef.value?.[0]) digitalRef.value[0].items = [];
  if (activityRef.value?.[0]) activityRef.value[0].items = [];

  if (collectionRef.value?.[0]?.resetForm) collectionRef.value[0].resetForm(true);
  if (heritageRef.value?.[0]?.resetForm) heritageRef.value[0].resetForm(true);
  if (digitalRef.value?.[0]?.resetForm) digitalRef.value[0].resetForm(true);
  if (activityRef.value?.[0]?.resetForm) activityRef.value[0].resetForm(true);
};

const loadNikaretePreset = () => {
  try {
    const colTpl = defaultTemplates.collectionInformation?.find((t) => t.name.includes("Nikarete"));
    const haTpl = defaultTemplates.heritageAssetIdentification?.find((t) => t.name.includes("Nikarete"));
    const drHpTpl = defaultTemplates.digitalResource?.find((t) => t.name.includes("Nikarete High-Poly"));
    const drLpTpl = defaultTemplates.digitalResource?.find((t) => t.name.includes("Nikarete Low-Poly"));
    const actTpl = defaultTemplates.activity?.find((t) => t.name.includes("Nikarete"));

    if (colTpl && collectionRef.value?.[0]) {
      collectionRef.value[0].items = [JSON.parse(JSON.stringify(colTpl.data))];
      if (typeof collectionRef.value[0].edit === 'function') {
        collectionRef.value[0].edit(0);
      }
    }
    if (haTpl && heritageRef.value?.[0]) {
      heritageRef.value[0].items = [JSON.parse(JSON.stringify(haTpl.data))];
      if (typeof heritageRef.value[0].edit === 'function') {
        heritageRef.value[0].edit(0);
      }
    }
    if (digitalRef.value?.[0]) {
      const drItems = [];
      if (drHpTpl) drItems.push(JSON.parse(JSON.stringify(drHpTpl.data)));
      if (drLpTpl) drItems.push(JSON.parse(JSON.stringify(drLpTpl.data)));
      if (drItems.length > 0) {
        digitalRef.value[0].items = drItems;
        if (typeof digitalRef.value[0].edit === 'function') {
          digitalRef.value[0].edit(0);
        }
      }
    }
    if (actTpl && activityRef.value?.[0]) {
      activityRef.value[0].items = [JSON.parse(JSON.stringify(actTpl.data))];
      if (typeof activityRef.value[0].edit === 'function') {
        activityRef.value[0].edit(0);
      }
    }

    alert(currentLocale.value === 'de' 
      ? 'Datensatz "Grabnaiskos der Nikarete (SK 740)" erfolgreich in alle Abschnitte geladen!' 
      : 'Record "Grabnaiskos der Nikarete (SK 740)" successfully loaded into all sections!');
  } catch (err) {
    console.error("Error loading Nikarete preset:", err);
    alert(currentLocale.value === 'de' ? 'Fehler beim Laden des Nikarete-Datensatzes.' : 'Error loading Nikarete dataset.');
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
        parsedData.Collection = jsonObj.collectionInformation.map((t) => t.data || t);
        parsedData.HeritageAsset = (jsonObj.heritageAssetIdentification || []).map((t) => t.data || t);
        parsedData.DigitalResource = (jsonObj.digitalResource || []).map((t) => t.data || t);
        parsedData.Activity = (jsonObj.activity || []).map((t) => t.data || t);
      } else {
        Object.assign(parsedData, jsonObj);
      }
    } else {
      // Treat as ZIP Archive (BagIt)
      const zip = await JSZip.loadAsync(file);
      const xmlFile = Object.values(zip.files).find((f) => f.name.toLowerCase().endsWith(".xml"));
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
            if (!Array.isArray(obj[rawSubKey])) obj[rawSubKey] = [obj[rawSubKey]];
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

          if (stdHeaders.includes(rawKey) || !value || rawKey.startsWith("#")) return;

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

    // Feed Data directly back into child Crud components
    const loadedSummary = [];
    if (collectionRef.value?.[0] && parsedData.Collection?.length > 0) {
      collectionRef.value[0].items = parsedData.Collection;
      if (typeof collectionRef.value[0].edit === 'function') {
        collectionRef.value[0].edit(0);
      }
      loadedSummary.push(`${parsedData.Collection.length} ${currentLocale.value === 'de' ? 'Sammlung(en)' : 'Collection(s)'}`);
    }
    if (heritageRef.value?.[0] && parsedData.HeritageAsset?.length > 0) {
      heritageRef.value[0].items = parsedData.HeritageAsset;
      if (typeof heritageRef.value[0].edit === 'function') {
        heritageRef.value[0].edit(0);
      }
      loadedSummary.push(`${parsedData.HeritageAsset.length} ${currentLocale.value === 'de' ? 'Kulturgut/-güter' : 'Heritage Asset(s)'}`);
    }
    if (digitalRef.value?.[0] && parsedData.DigitalResource?.length > 0) {
      digitalRef.value[0].items = parsedData.DigitalResource;
      if (typeof digitalRef.value[0].edit === 'function') {
        digitalRef.value[0].edit(0);
      }
      loadedSummary.push(`${parsedData.DigitalResource.length} ${currentLocale.value === 'de' ? 'Digitale Ressource(n)' : 'Digital Resource(s)'}`);
    }
    if (activityRef.value?.[0] && parsedData.Activity?.length > 0) {
      activityRef.value[0].items = parsedData.Activity;
      if (typeof activityRef.value[0].edit === 'function') {
        activityRef.value[0].edit(0);
      }
      loadedSummary.push(`${parsedData.Activity.length} ${currentLocale.value === 'de' ? 'Aktivität(en)' : 'Activity/Activities'}`);
    }

    if (loadedSummary.length > 0) {
      const titlePrefix = currentLocale.value === 'de' 
        ? `CARARE-Datei "${file.name}" erfolgreich importiert:\n` 
        : `CARARE file "${file.name}" successfully imported:\n`;
      alert(titlePrefix + loadedSummary.map(s => '• ' + s).join('\n'));
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
        cleaned[k] = typeof v === "object" && v !== null ? cleanEmptyAttributes(v) : v;
      }
      return cleaned;
    }
    return obj;
  };

  return records.map(record => cleanEmptyAttributes(record));
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

const exportToCarareXML = async () => {
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
      carare: ["collectionInformation", "heritageAssetIdentification", "digitalResource", "activity"],
      collectionInformation: [
        "id", "title", "source", "contacts", "rights", "language", "statement", "creation", "keywords", "coverage", "dcRelation"
      ],
      heritageAssetIdentification: [
        "recordInformation", "appellation", "description", "generalType", "actors", "designations", "conditions", "provenance", "characters", "spatial", "repositoryLocation", "publicationStatement", "rights", "references", "hasRepresentation", "isSuccessorOf", "wasPresentAt", "hasPart", "isPartOf", "isReplicaOf", "wasDigitizedBy", "dcRelation"
      ],
      digitalResource: [
        "recordInformation", "appellation", "description", "note", "actors", "type", "format", "formatDetails", "extent", "publicationStatement", "created", "language", "link", "object", "isShownAt", "rights", "isRepresentationOf", "hasPart", "isPartOf", "nextInSequence", "isPreviousInSequence", "isDerivativeOf", "hasDerivative", "createdDerivative", "dcRelation"
      ],
      activity: [
        "recordInformation", "appellation", "description", "hasGeneralPurpose", "eventType", "actors", "temporal", "spatial", "consistsOf", "assessments", "occurredAt", "happenedAt", "wasPresentAt", "hasPart", "isPartOf", "hasCreated", "dcRelation"
      ],
      recordInformation: ["id", "source", "country", "creation", "update", "language", "metadataRights"],
      appellation: ["name", "id"],
      rights: ["copyrightCreditLine", "accessRights", "reproductionRights", "licence", "europeanaRights"],
      spatial: ["locationSet", "geometry", "representations", "cartesianCoordinates3D"],
      locationSet: ["namedLocation", "address", "geopoliticalArea", "geopoliticalAreaType", "cadastralReference", "historicalName"],
      geometry: ["spatialReferenceSystem", "quickpoint", "boundingBox", "otherGeometries", "entity", "storedPrecision", "area"],
      quickpoint: ["x", "y", "z", "accuracy"],
      boundingBox: ["minX", "maxX", "minY", "maxY", "minZ", "maxZ", "accuracy"],
      otherGeometries: ["type", "accuracy"],
      cartesianCoordinates3D: ["cartesianCoordinatesSystem", "viewpoints"],
      viewpoints: ["x", "y", "z"],
      characters: ["heritageAssetType", "temporal", "materials", "inscriptions", "dimensions", "craft"],
      temporal: ["timeSpan", "periodName", "displayDate", "scientificDate", "scientificDateMethod"],
      timeSpan: ["startDate", "endDate", "dateRangeQualifier"],
      dimensions: ["extent", "measurementType", "units", "scale", "value"],
      craft: ["placeOfRegistration", "nationality", "constructionMethod", "propulsion", "lastJourneyDetails"],
      lastJourneyDetails: ["departure", "destination", "cargo", "mannerOfLoss", "dateOfLoss", "displayDate"],
      designations: ["protectionType", "grade", "dateFrom", "dateTo", "displayDate"],
      conditions: ["condition", "conditionAssessment", "conditionDate", "displayDate", "wasPresentAt"],
      publicationStatement: ["publisher", "place", "date"],
      references: ["appellation", "actors", "type", "rights", "publicationStatement", "note", "link"],
      consistsOf: ["hadSpecificPurpose", "startDate", "endDate", "methods", "techniques", "materials", "equipment"],
      actors: ["id", "name", "actorType", "roles", "contacts", "vitalDates", "placeOfBirth", "placeOfDeath", "placeOfActivity", "bibliographicalNote"],
      vitalDates: ["dateOfBirth", "dateOfDeath", "displayDate"],
      contacts: ["name", "role", "organization", "address", "phone", "fax", "email", "description"],
      address: ["buildingName", "numberInRoad", "roadName", "townOrCity", "postcodeOrZipcode", "locality", "adminArea", "postcode", "county", "country"],
      creation: ["date", "contacts", "createdOn", "query"],
      update: ["date", "contacts"],
      coverage: ["temporal", "spatial"]
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
          targetNode.attributes[attrName] = attrName === "preferred" ? (String(val) === "true" ? "true" : "false") : String(val);
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

        // CARARE schema uses camelCase / lowercase elements (strictly avoid PascalCase)
        const segments = fieldPath.split(".").filter(Boolean);

        if (segments.length === 0) {
          if (attrName) {
            targetNode.attributes[attrName] = attrName === "preferred" ? (String(val) === "true" ? "true" : "false") : String(val);
          }
          continue;
        }

        const lastSegment = segments[segments.length - 1];

        if (Array.isArray(val)) {
          if (val.length === 0) continue;

          const parentSegments = segments.slice(0, segments.length - 1);
          const parent = navigateSegments(targetNode, parentSegments);

          val.forEach((item, itemIdx) => {
            if (item === null || item === undefined || item === "") return;
            const child = parent.addChild(lastSegment);
            if (attrName && typeof item !== "object") {
              child.attributes[attrName] = String(item);
            }
            if (typeof item === "object") {
              // Extract attributes: in CARARE XSD, language is 'lang' (not xml:lang)
              for (const [k, v] of Object.entries(item)) {
                if (k.endsWith("#lang") || k === "#lang") {
                  child.attributes["lang"] = String(v);
                } else if (k.endsWith("#preferred") || k === "#preferred") {
                  child.attributes["preferred"] = String(v) === "true" ? "true" : "false";
                }
              }
              // Set default preferred only where allowed by schema (appellation.name and collection.title)
              if (child.attributes["preferred"] === undefined && ((parent.name === "appellation" && lastSegment === "name") || (parent.name === "collectionInformation" && lastSegment === "title"))) {
                child.attributes["preferred"] = itemIdx === 0 ? "true" : "false";
              }
            }
            populateNode(child, item);
          });
        } else {
          if (attrName && lastSegment.toLowerCase() === targetNode.name.toLowerCase()) {
            targetNode.attributes[attrName] = attrName === "preferred" ? (String(val) === "true" ? "true" : "false") : String(val);
          } else {
            const current = navigateSegments(targetNode, segments);
            if (attrName) {
              current.attributes[attrName] = attrName === "preferred" ? (String(val) === "true" ? "true" : "false") : String(val);
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
      if (Object.keys(node.attributes).length > 0) {
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

    const cleanAndValidateNode = (node, parentName = "") => {
      // 1. CARARE Schema: <description>, <appellation><name>, <namedLocation><name> require @lang attribute
      if (node.name === "description" && (node.text || node.children.length > 0)) {
        if (!node.attributes["lang"]) {
          node.attributes["lang"] = currentLocale.value || "de";
        }
      }
      if (node.name === "name" && (parentName === "appellation" || parentName === "namedLocation")) {
        if (!node.attributes["lang"]) {
          node.attributes["lang"] = currentLocale.value || "de";
        }
      }
      // CARARE Schema: digitalResource MUST have a <link> element (xs:anyURI, minOccurs=1)
      if (node.name === "digitalResource") {
        let linkChild = node.children.find(c => c.name === "link");
        if (!linkChild || !linkChild.text || !linkChild.text.trim()) {
          if (!linkChild) {
            linkChild = node.addChild("link");
          }
          linkChild.text = "https://carare.eu/resource";
        }
      }

      // 2. Disallowed attributes on wrapper elements in CARARE schema
      if (node.name === "spatial" || node.name === "references") {
        delete node.attributes["lang"];
        delete node.attributes["preferred"];
      }
      if (node.name === "country") {
        delete node.attributes["authority"];
      }

      // 3. Strict enumerations in CARARE schema
      if (node.name === "generalType" && node.text) {
        const t = node.text.toLowerCase().trim();
        if (t.includes("artefact") || t.includes("artifact") || t.includes("object")) {
          node.text = "Artefact";
        } else if (t.includes("monument") || t.includes("building") || t.includes("denkmal")) {
          node.text = "Monument";
        } else if (t.includes("3d")) {
          node.text = "3D";
        } else if (t.includes("image") || t.includes("bild") || t.includes("foto")) {
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

      // 4. xs:date formatting for date fields that require YYYY-MM-DD
      if ((node.name === "createdOn" || (node.name === "date" && (parentName === "creation" || parentName === "update"))) && node.text) {
        if (/^\d{4}$/.test(node.text.trim())) {
          node.text = `${node.text.trim()}-01-01`;
        }
      }

      // 5. Ensure boolean attributes are strictly lowercase
      for (const attr of ["preferred", "openAccess", "isPart"]) {
        if (node.attributes[attr] !== undefined) {
          node.attributes[attr] = String(node.attributes[attr]).toLowerCase() === "true" ? "true" : "false";
        }
      }

      node.children.forEach(c => cleanAndValidateNode(c, node.name));
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

      if (
        !hasText &&
        !hasChildren &&
        Object.keys(node.attributes).length === 0
      ) {
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

    const collections = allData.Collection || [];
    const heritageAssets = allData.HeritageAsset || [];
    const digitalResources = allData.DigitalResource || [];
    const activities = allData.Activity || [];

    // Helper to enrich collection record with central global rights and country from organization
    const enrichCollectionRecord = (colRecord) => {
      const rec = { ...colRecord };
      rec["rights.copyrightCreditLine"] = rec["rights.copyrightCreditLine"] || globalRights.copyrightCreditLine || "";
      rec["rights.accessRights"] = rec["rights.accessRights"] || globalRights.accessRights || "";
      rec["rights.reproductionRights"] = rec["rights.reproductionRights"] || globalRights.reproductionRights || "";
      rec["rights.licence"] = rec["rights.licence"] || globalRights.licence || "";

      // Ensure country is always populated from organisation into metadata
      if (!rec["coverage.spatial.locationSet.address.country"]) {
        const matchedOrg = (savedOrganizations.value || []).find(o => o.name === rec["source"]) || savedOrganizations.value?.[0];
        rec["coverage.spatial.locationSet.address.country"] = (matchedOrg?.country || "DE").toUpperCase();
      }
      return rec;
    };

    const enrichHeritageAssetRecord = (haRecord) => {
      const rec = { ...haRecord };
      rec["rights.copyrightCreditLine"] = rec["rights.copyrightCreditLine"] || globalRights.copyrightCreditLine || "";
      rec["rights.accessRights"] = rec["rights.accessRights"] || globalRights.accessRights || "";
      rec["rights.reproductionRights"] = rec["rights.reproductionRights"] || globalRights.reproductionRights || "";
      rec["rights.licence"] = rec["rights.licence"] || globalRights.licence || "";
      return rec;
    };

    const enrichDigitalResourceRecord = (drRecord) => {
      const rec = { ...drRecord };
      rec["rights.copyrightCreditLine"] = rec["rights.copyrightCreditLine"] || globalRights.copyrightCreditLine || "";
      rec["rights.accessRights"] = rec["rights.accessRights"] || globalRights.accessRights || "";
      rec["rights.reproductionRights"] = rec["rights.reproductionRights"] || globalRights.reproductionRights || "";
      rec["rights.licence"] = rec["rights.licence"] || globalRights.licence || "";
      return rec;
    };

    if (heritageAssets.length > 0) {
      heritageAssets.forEach((haRecord, idx) => {
        const carareId = haRecord["recordInformation.id"] || haRecord["appellation.id"] || `CARARE-${idx + 1}`;
        const carareContainer = rootNode.addChild("carare");
        carareContainer.attributes["id"] = carareId;

        // Shared collection information
        if (collections.length > 0) {
          collections.forEach((colRecord) => {
            const colNode = carareContainer.addChild("collectionInformation");
            populateNode(colNode, enrichCollectionRecord(colRecord));
          });
        }

        // Heritage Asset Identification
        const haNode = carareContainer.addChild("heritageAssetIdentification");
        populateNode(haNode, enrichHeritageAssetRecord(haRecord));

        // Digital Resources
        digitalResources.forEach((drRecord) => {
          const drNode = carareContainer.addChild("digitalResource");
          populateNode(drNode, enrichDigitalResourceRecord(drRecord));
        });

        // Activities
        activities.forEach((actRecord) => {
          const actNode = carareContainer.addChild("activity");
          populateNode(actNode, actRecord);
        });
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
        populateNode(actNode, actRecord);
      });
    }

    // Clean and normalize node attributes & enumerations strictly according to CARARE schema
    cleanAndValidateNode(rootNode);

    // Sort all nodes recursively according to CARARE schema sequence
    sortChildrenBySchema(rootNode);

    let carareXmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    carareXmlContent += serializeXmlNode(rootNode, 0);

    const defaultFilename = `hermes-carare-${Date.now()}.xml`;
    if (isTauri()) {
      const selectedPath = await save({
        defaultPath: defaultFilename,
        filters: [
          {
            name: "CARARE XML File",
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
