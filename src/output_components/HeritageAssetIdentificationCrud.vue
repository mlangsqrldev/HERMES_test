<template>

  <div class="drawer drawer-end heritageAssetIdentification-crud">

    <input id="drawer-heritageAssetIdentification" type="checkbox" class="drawer-toggle" v-model="isDrawerOpen" />

    

    <div class="drawer-content">

      

      <div class="container mx-auto p-4 max-w-7xl">

        <!-- Quality Dashboard, Batch Controls & Table/Grid Container -->

        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">

          

          <!-- Top Row: Title, Record Count & Mode Toggle -->

          <div class="flex flex-wrap justify-between items-center mb-3 pb-3 border-b border-base-200 gap-3">

             <div class="flex items-center gap-3">

               <h4 class="font-bold text-lg text-base-content/80 flex items-center gap-2">

                 <span>🏺</span>

                 <span>{{ t('saved') }} {{ getLabel('heritageAssetIdentification', 'Kulturgüter / Heritage Assets') }}</span>

                 <span class="badge badge-primary badge-sm font-bold">{{ items.length }}</span>

               </h4>

             </div>

             <div class="flex items-center gap-2">

               <button

                 type="button"

                 class="btn btn-xs btn-outline btn-success gap-1"

                 @click="addNewHeritageAsset"

                 :title="currentLocale === 'de' ? 'Neues Kulturgut mit Kampagnen-Defaults anlegen' : 'Create new asset with campaign defaults'"

               >

                 <span>➕</span>

                 <span>{{ currentLocale === 'de' ? 'Neues Kulturgut' : 'New Asset' }}</span>

               </button>

             </div>

          </div>



          <!-- Feature 6: Qualitäts-Dashboard & Ampelsystem (KPIs & Filters) -->

          <div class="bg-base-200/40 rounded-xl p-3 border border-base-200 mb-4 space-y-2.5">

            <div class="flex flex-wrap items-center justify-between gap-3">

              <!-- KPI Status Chips (Clickable Filters) -->

              <div class="flex flex-wrap items-center gap-1.5">

                <span class="text-xs font-bold text-base-content/60 uppercase tracking-wider mr-1">

                  {{ currentLocale === 'de' ? 'Qualitäts-Status:' : 'Quality Status:' }}

                </span>

                

                <button

                  type="button"

                  class="btn btn-xs rounded-full gap-1.5 transition-all"

                  :class="filterStatus === 'all' ? 'btn-neutral shadow-xs' : 'btn-ghost border border-base-300/80'"

                  @click="filterStatus = 'all'"

                >

                  <span>📦</span>

                  <span>{{ currentLocale === 'de' ? 'Alle' : 'All' }}</span>

                  <span class="badge badge-xs badge-ghost">{{ validationStats.total }}</span>

                </button>



                <button

                  type="button"

                  class="btn btn-xs rounded-full gap-1.5 transition-all"

                  :class="filterStatus === 'valid' ? 'btn-success text-success-content shadow-xs font-bold' : 'btn-ghost border border-success/30 text-success'"

                  @click="filterStatus = 'valid'"

                  :title="currentLocale === 'de' ? 'Nur vollständig erfasste, exportbereite Kulturgüter anzeigen' : 'Show only complete and valid assets'"

                >

                  <span class="size-2 rounded-full bg-success"></span>

                  <span>{{ currentLocale === 'de' ? 'Valide & Vollständig' : 'Valid & Complete' }}</span>

                  <span class="badge badge-xs badge-success badge-outline">{{ validationStats.valid }}</span>

                </button>



                <button

                  type="button"

                  class="btn btn-xs rounded-full gap-1.5 transition-all"

                  :class="filterStatus === 'warning' ? 'btn-warning text-warning-content shadow-xs font-bold' : 'btn-ghost border border-warning/30 text-warning'"

                  @click="filterStatus = 'warning'"

                  :title="currentLocale === 'de' ? 'Kulturgüter mit fehlenden empfohlenen Feldern (z. B. Maße, Epoche, Material)' : 'Assets with missing recommended fields'"

                >

                  <span class="size-2 rounded-full bg-warning"></span>

                  <span>{{ currentLocale === 'de' ? 'Unvollständig' : 'Incomplete' }}</span>

                  <span class="badge badge-xs badge-warning badge-outline">{{ validationStats.warning }}</span>

                </button>



                <button

                  type="button"

                  class="btn btn-xs rounded-full gap-1.5 transition-all"

                  :class="filterStatus === 'error' ? 'btn-error text-error-content shadow-xs font-bold' : 'btn-ghost border border-error/30 text-error'"

                  @click="filterStatus = 'error'"

                  :title="currentLocale === 'de' ? 'Kulturgüter mit fehlenden Pflichtfeldern (ID oder Name fehlt)' : 'Assets missing required fields (ID or title)'"

                >

                  <span class="size-2 rounded-full bg-error"></span>

                  <span>{{ currentLocale === 'de' ? 'Kritische Fehler' : 'Errors' }}</span>

                  <span class="badge badge-xs badge-error badge-outline">{{ validationStats.error }}</span>

                </button>

              </div>



              <!-- Live Search Filter Input -->

              <div class="relative w-full sm:w-64">

                <input

                  type="text"

                  v-model="searchQuery"

                  class="input input-xs input-bordered w-full pl-7 text-xs"

                  :placeholder="currentLocale === 'de' ? 'ID, Name, Material filtern...' : 'Filter ID, name, material...'"

                />

                <span class="absolute left-2 top-1.5 text-xs opacity-50">🔍</span>

                <button

                  v-if="searchQuery"

                  type="button"

                  class="absolute right-1.5 top-1 btn btn-ghost btn-circle btn-xs size-4 text-[10px]"

                  @click="searchQuery = ''"

                >

                  ✕

                </button>

              </div>

            </div>



            <!-- Progress Indicator -->

            <div class="flex items-center gap-3 pt-1">

              <progress

                class="progress progress-success w-full h-1.5 bg-base-300"

                :value="validationStats.validPercent"

                max="100"

              ></progress>

              <span class="text-[11px] font-mono font-semibold text-base-content/70 whitespace-nowrap">

                {{ validationStats.validPercent }}% {{ currentLocale === 'de' ? 'exportbereit' : 'ready' }}

              </span>

            </div>

          </div>



          <!-- Feature 5: Multi-Select Floating Bulk Actions Bar -->

          <div

            v-if="selectedOriginalIndices.length > 0"

            class="sticky bottom-6 z-30 my-3 p-3 bg-neutral text-neutral-content rounded-xl shadow-2xl border border-neutral-content/20 flex flex-wrap items-center justify-between gap-3 animate-fadeIn"

          >

            <div class="flex items-center gap-2">

              <span class="badge badge-warning font-bold text-xs">

                ✓ {{ selectedOriginalIndices.length }} {{ currentLocale === 'de' ? 'ausgewählt' : 'selected' }}

              </span>

              <span class="text-xs opacity-80 hidden md:inline">

                {{ currentLocale === 'de' ? 'Massenaktionen auf markierte Kulturgüter anwenden:' : 'Apply bulk actions:' }}

              </span>

            </div>



            <div class="flex flex-wrap items-center gap-1.5">

              <!-- Bulk Apply Campaign -->

              <button

                type="button"

                class="btn btn-xs btn-warning text-warning-content font-bold gap-1"

                @click="bulkApplyCampaignToSelected"

                :title="currentLocale === 'de' ? 'Kampagnen-Voreinstellungen auf alle ausgewählten Objekte vererben' : 'Inherit campaign presets to selected'"

              >

                <span>🎯</span>

                <span>{{ currentLocale === 'de' ? 'Aus Kampagne vererben' : 'Inherit from Campaign' }}</span>

              </button>



              <!-- Bulk Assign Licence -->

              <div class="dropdown dropdown-bottom dropdown-end">

                <button tabindex="0" type="button" class="btn btn-xs btn-outline btn-neutral-content text-neutral-content gap-1">

                  <span>⚖️</span>

                  <span>{{ currentLocale === 'de' ? 'Lizenz zuweisen' : 'Assign Licence' }}</span>

                </button>

                <ul tabindex="0" class="dropdown-content z-30 menu p-1 shadow-lg bg-base-100 text-base-content rounded-box w-64 border border-base-300 text-xs">

                  <li v-for="lic in CC_LICENCES" :key="lic.code">

                    <a @click.prevent="bulkAssignLicence(lic.uriDe)">

                      {{ lic.short }} — {{ lic.fullName }}

                    </a>

                  </li>

                </ul>

              </div>



              <!-- Bulk Assign Repository / Org -->

              <button

                type="button"

                class="btn btn-xs btn-outline btn-neutral-content text-neutral-content gap-1"

                @click="openOrgPickerForBulk"

              >

                <span>🏛️</span>

                <span>{{ currentLocale === 'de' ? 'Aufbewahrungsort' : 'Repository' }}</span>

              </button>



              <!-- Bulk Delete -->

              <button

                type="button"

                class="btn btn-xs btn-error text-error-content font-bold gap-1"

                @click="bulkDeleteSelected"

              >

                <span>🗑️</span>

                <span>{{ currentLocale === 'de' ? 'Löschen' : 'Delete' }}</span>

              </button>



              <!-- Clear Selection -->

              <button

                type="button"

                class="btn btn-xs btn-ghost text-neutral-content opacity-70 hover:opacity-100"

                @click="selectedOriginalIndices = []"

              >

                ✕ {{ currentLocale === 'de' ? 'Abwählen' : 'Deselect' }}

              </button>

            </div>

          </div>



          <!-- Standard Table View -->

          <div class="overflow-x-auto">

             <table class="table table-sm w-full table-zebra">

                <thead class="bg-base-200">

                  <tr>

                    <th class="w-10 text-center">

                      <input

                        type="checkbox"

                        class="checkbox checkbox-xs"

                        :checked="isAllFilteredSelected"

                        @change="toggleSelectAllFiltered"

                        :title="currentLocale === 'de' ? 'Alle gefilterten Objekte auswählen' : 'Select all filtered'"

                      />

                    </th>

                    <th class="w-12 text-center">{{ currentLocale === 'de' ? 'Status' : 'Status' }}</th>

                    <th>{{ currentLocale === 'de' ? 'Datensatz-ID' : 'Record ID' }}</th>

                    <th>{{ currentLocale === 'de' ? 'Name' : 'Name' }}</th>

                    <th>{{ currentLocale === 'de' ? 'Material' : 'Material' }}</th>

                    <th class="w-60 text-right">{{ currentLocale === 'de' ? 'Aktionen' : t('actions') }}</th>

                  </tr>

                </thead>

                <tbody>

                   <tr

                     v-for="{ item, originalIndex } in filteredItemsWithIndices"

                     :key="originalIndex"

                     :class="{

                       'bg-primary/10 font-medium': isEditing && editIndex === originalIndex,

                       'bg-warning/5': selectedOriginalIndices.includes(originalIndex)

                     }"

                   >

                      <td class="text-center">

                        <input

                          type="checkbox"

                          class="checkbox checkbox-xs"

                          :checked="selectedOriginalIndices.includes(originalIndex)"

                          @change="toggleSelectIndex(originalIndex)"

                        />

                      </td>



                      <!-- Status Indicator Badge -->

                      <td class="text-center">

                        <div

                          class="tooltip tooltip-right"

                          :data-tip="getAssetValidationStatus(item).details.length > 0

                            ? (currentLocale === 'de' ? 'Fehlt: ' : 'Missing: ') + getAssetValidationStatus(item).details.join(', ')

                            : getAssetValidationStatus(item).label"

                        >

                          <span

                            class="inline-flex items-center justify-center size-5 rounded-full text-xs font-bold shadow-2xs"

                            :class="{

                              'bg-success/20 text-success': getAssetValidationStatus(item).status === 'valid',

                              'bg-warning/20 text-warning': getAssetValidationStatus(item).status === 'warning',

                              'bg-error/20 text-error': getAssetValidationStatus(item).status === 'error'

                            }"

                          >

                            {{ getAssetValidationStatus(item).icon }}

                          </span>

                        </div>

                      </td>



                      <td class="font-mono text-xs font-semibold">

                        {{ item['recordInformation.id'] || item['appellation.id'] || '—' }}

                      </td>

                      <td class="font-medium">

                        {{ getDisplayName(item) }}

                      </td>

                      <td>

                        <div class="flex flex-wrap gap-1 max-w-md">

                          <span v-for="(mat, mIdx) in (item['characters.materials'] || [])" :key="mIdx" class="badge badge-outline badge-xs">

                            {{ getDisplayMaterial(mat) }}

                          </span>

                          <span v-if="!item['characters.materials'] || item['characters.materials'].length === 0" class="text-xs opacity-40 italic">—</span>

                        </div>

                      </td>

                      <td class="text-right">

                         <div class="flex gap-1 justify-end items-center">

                           <button type="button" class="btn btn-xs btn-ghost text-info" @click.prevent="edit(originalIndex)" :title="t('edit')">

                             {{ t('edit') }}

                           </button>

                           <!-- Feature 5: Smart Duplicate Button -->

                           <button

                             type="button"

                             class="btn btn-xs btn-ghost text-secondary flex items-center gap-1 font-bold"

                             @click.prevent="smartDuplicate(originalIndex)"

                             :title="currentLocale === 'de' ? 'Smart-Klonen: Zählt ID automatisch hoch (+1) und übernimmt gemeinsame Daten' : 'Smart Duplicate: auto-increments ID and copies metadata'"

                           >

                             <span>⚡</span>

                             <span>{{ currentLocale === 'de' ? '+1 Klonen' : '+1 Clone' }}</span>

                           </button>

                           <button type="button" class="btn btn-xs btn-ghost text-error" @click.prevent="remove(originalIndex)" :title="t('del')">

                             {{ t('del') }}

                           </button>

                         </div>

                      </td>

                   </tr>

                   <tr v-if="filteredItemsWithIndices.length === 0">

                      <td colspan="6" class="text-center text-base-content/40 py-6 italic">

                        {{ items.length === 0 ? t('noItems') : (currentLocale === 'de' ? 'Keine Kulturgüter passend zum Filter gefunden.' : 'No matching heritage assets found.') }}

                      </td>

                   </tr>

                </tbody>

             </table>

          </div>



        </div>



        <div class="bg-base-200 p-6 rounded-box shadow-sm mb-10">

          <div class="flex flex-wrap items-center justify-between mb-4 gap-2">

            <div class="flex items-center gap-3">

              <h3 class="text-xl font-bold capitalize">

                {{ isEditing ? t('edit') : t('add') }} {{ getLabel('heritageAssetIdentification', 'heritageAssetIdentification') }}

              </h3>

              <span v-if="isEditing" class="badge badge-info badge-sm">

                {{ currentLocale === 'de' ? 'Bearbeitungsmodus aktiv' : 'Editing mode' }}

              </span>

            </div>



            <div class="flex items-center gap-2">

              <button

                type="button"

                class="btn btn-xs btn-outline btn-warning gap-1 font-bold shadow-2xs"

                @click.prevent="applyCampaignToCurrentForm"

                :title="currentLocale === 'de' ? 'Übernimmt alle Voreinstellungen der Master-Kampagne (Institution, Lizenz, Epoche, Material) in dieses Kulturgut' : 'Inherit campaign presets into this asset'"

              >

                <span>🎯</span>

                <span>{{ currentLocale === 'de' ? 'Aus Kampagne vererben' : 'Inherit from Campaign' }}</span>

              </button>

            </div>

          </div>

          <form @submit.prevent="save" @invalid.capture="handleInvalid">

            <div class="grid grid-cols-1 gap-x-6">

              

        <div class="col-span-full border border-base-300 bg-base-100/50 p-5 rounded-box mb-6 mt-2">

        <div class=" items-center flex flex-row">

          <label class="label mb-2 pb-0">

            <span class="label-text font-bold text-lg capitalize">{{ getLabel('recordInformation', 'recordInformation') }}</span>

          </label>

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation', 'The ID, language, creation information and other metadata describing the record. The ID element of this information block holds the ID assigned by the content provider.', 'doc')" v-if="getLabel('recordInformation', 'The ID, language, creation information and other metadata describing the record. The ID element of this information block holds the ID assigned by the content provider.', 'doc')">

              <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help" :title="getLabel('recordInformation', 'The ID, language, creation information and other metadata describing the record.', 'doc')">

            <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                        fill="currentColor"

                        stroke-width="2.5"

                        stroke="currentColor"

                        class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

            </button>

            </div>

            </div>

              <!--       <div class="text-sm text-base-content/60 mb-4 px-1">{{ getLabel('recordInformation', 'The ID, language, creation information and other metadata describing the record. The ID element of this information block holds the ID assigned by the content provider.', 'doc') }}</div> -->

          <div class="grid grid-cols-1 gap-x-6">

            

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('recordInformation.id', 'id') }}</span><span class="text-accent font-black">*</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation.id', 'Unique ID of the record in the content provider\'s system. Mandatory field – assigned by the content provider\'s system and must not be changed afterwards.', 'doc')" v-if="getLabel('recordInformation.id', 'Unique ID of the record in the content provider\'s system. Mandatory field – assigned by the content provider\'s system and must not be changed afterwards.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

                        <input type="text"     required v-model="form['recordInformation.id']" class="input input-bordered w-full validator " :placeholder="getLabel('recordInformation.id', 'e.g. 699203', 'plac')" />

              <div class="validator-hint">{{t('validationHint')}}</div>        

          

          </div>

        <div class="form-control w-full mb-4">

          <div class="flex flex-wrap justify-between items-center mb-1 gap-2">

            <div class="flex flex-row items-center">

              <label class="label pb-0"><span class="label-text font-bold capitalize">{{ getLabel('recordInformation.source', 'source') }}</span><span class="text-accent font-black">*</span></label>

              <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation.source', 'Name of the organisation that maintains this record.', 'doc')" v-if="getLabel('recordInformation.source', 'Name of the organisation that maintains this record.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

                  <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                              fill="currentColor"

                              stroke-width="2.5"

                              stroke="currentColor"

                              class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

                </button>

              </div>

            </div>

            <button

              type="button"

              class="btn btn-xs btn-outline btn-secondary gap-1 font-semibold text-[11px]"

              @click.prevent="openOrgPicker('source')"

              :title="currentLocale === 'de' ? 'Organisation aus dem Pool auswählen' : 'Pick organization from pool'"

            >

              🏛️ {{ currentLocale === 'de' ? 'Aus Organisations-Pool wählen' : 'From Organization Pool' }}

            </button>

          </div>

          <!-- Integrated Institution / GND Autocomplete in Source field -->

          <InstitutionAutocomplete

            input-id="heritage-source-gnd"

            emit-mode="label"

            v-model="form['recordInformation.source']"

            :input-class="'input input-bordered w-full validator text-sm'"

            :placeholder="getLabel('recordInformation.source', 'z.B. Stiftung Preußischer Kulturbesitz, Staatliche Museen zu Berlin, Antikensammlung', 'plac')"

            @select="(item) => { form['recordInformation.source'] = item.label; }"

          />

          <div class="validator-hint">{{t('validationHint')}}</div>

          <!-- Recently Used Organizations Bar for Source -->
          <div v-if="recentOrganizations && recentOrganizations.length > 0" class="mt-2 p-2 bg-base-200/50 rounded-lg border border-base-300 flex items-center gap-1.5 flex-wrap">
            <span class="text-[11px] font-bold text-base-content/60 flex items-center gap-1 mr-1">
              🕒 {{ currentLocale === 'de' ? 'Zuletzt verwendet:' : 'Recently used:' }}
            </span>
            <button
              v-for="rOrg in recentOrganizations.slice(0, 5)"
              :key="'source-rec-' + rOrg.name"
              type="button"
              class="btn btn-xs gap-1"
              :class="form['recordInformation.source'] === rOrg.name ? 'btn-primary font-bold shadow-xs' : 'btn-outline border-base-300'"
              @click.prevent="form['recordInformation.source'] = rOrg.name"
            >
              <span>🏛️</span>
              <span class="truncate max-w-[180px]">{{ rOrg.name }}</span>
              <span v-if="rOrg.country" class="badge badge-xs badge-ghost font-mono uppercase text-[9px]">{{ rOrg.country }}</span>
            </button>
          </div>        

        </div>

        <div class="col-span-full border border-base-300 bg-base-100/50 p-5 rounded-box mb-6 mt-2">

        <div class=" items-center flex flex-row">

          <label class="label mb-2 pb-0">

            <span class="label-text font-bold text-lg capitalize">{{ getLabel('recordInformation.creation', 'creation') }}</span>

          </label>

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation.creation', 'When created and by whom;', 'doc')" v-if="getLabel('recordInformation.creation', 'When created and by whom;', 'doc')">

              <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

            <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                        fill="currentColor"

                        stroke-width="2.5"

                        stroke="currentColor"

                        class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

            </button>

            </div>

            </div>

              <!--       <div class="text-sm text-base-content/60 mb-4 px-1">{{ getLabel('recordInformation.creation', 'When created and by whom;', 'doc') }}</div> -->

          <div class="grid grid-cols-1 gap-x-6">

            

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('recordInformation.creation.date', 'date') }}</span><span class="text-warning font-black">~</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation.creation.date', 'Date when this record about the heritage asset was created in the system. Not to be confused with the date of origin of the object (see Temporal classification) or the date of digitisation (see Activities).', 'doc')" v-if="getLabel('recordInformation.creation.date', 'Date when this record about the heritage asset was created in the system. Not to be confused with the date of origin of the object (see Temporal classification) or the date of digitisation (see Activities).', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

                        <input type="date" :max="maxDate"     v-model="form['recordInformation.creation.date']" class="input input-bordered w-full validator " :placeholder="getLabel('recordInformation.creation.date', 'e.g. 2025-04-14', 'plac')" />

              <div class="validator-hint">{{t('validationHint')}}</div>        

          

          </div>

          <!-- Contacts Table in Creation -->
          <div class="col-span-full border border-base-200 bg-base-100 p-3.5 rounded-xl mt-2 mb-2 shadow-xs">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-2.5 pb-2 border-b border-base-200">
              <div class="flex items-center gap-2">
                <span class="font-bold text-sm text-base-content flex items-center gap-1.5">
                  <span>👥</span>
                  <span>{{ getLabel('recordInformation.creation.contacts', 'contacts') }}</span>
                </span>
                <span class="badge badge-xs badge-neutral font-mono">{{ (form['recordInformation.creation.contacts'] || []).length }}</span>
              </div>
              <div class="flex items-center gap-1.5 flex-wrap">
                <button type="button" class="btn btn-xs btn-outline btn-accent gap-1" @click.prevent="openOrgPicker('contacts')">
                  🏛️ {{ currentLocale === 'de' ? 'Organisation' : 'Organization' }}
                </button>
                <button type="button" class="btn btn-xs btn-secondary gap-1 font-bold shadow-xs" @click.prevent="openPersonPicker('contacts')">
                  👤 {{ currentLocale === 'de' ? 'Aus Personen-Pool wählen' : 'Select from Person Pool' }}
                </button>
                <button type="button" class="btn btn-xs btn-primary gap-1" @click.prevent="openDrawer('recordInformation.creation.contacts')">
                  + {{ currentLocale === 'de' ? 'Kontakt anlegen' : 'Add Contact' }}
                </button>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="table table-xs w-full table-zebra">
                <thead class="bg-base-200/60">
                  <tr>
                    <th>{{ getLabel('recordInformation.creation.contacts.name', 'name') }}</th>
                    <th>{{ getLabel('recordInformation.creation.contacts.role', 'role') }}</th>
                    <th>{{ getLabel('recordInformation.creation.contacts.organization', 'organization') }}</th>
                    <th>{{ getLabel('recordInformation.creation.contacts.email', 'email') }}</th>
                    <th class="w-20">{{ t('actions') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(subItem, subIdx) in form['recordInformation.creation.contacts']" :key="subIdx">
                    <td class="font-semibold">{{ subItem['name'] }}</td>
                    <td>{{ subItem['role'] }}</td>
                    <td>{{ subItem['organization'] }}</td>
                    <td>{{ subItem['email'] }}</td>
                    <td>
                      <div class="flex gap-1">
                        <button type="button" class="btn btn-xs btn-ghost text-info" @click.prevent="openDrawer('recordInformation.creation.contacts', subIdx)">{{ t('edit') }}</button>
                        <button type="button" class="btn btn-xs btn-ghost text-error" @click.prevent="removeDrawerItem('recordInformation.creation.contacts', subIdx)">✕</button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="!form['recordInformation.creation.contacts'] || form['recordInformation.creation.contacts'].length === 0">
                    <td colspan="5" class="text-center text-base-content/40 py-3 italic">{{ t('noItems') }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          </div>

          

        </div>

          </div>

          

        </div>

        <div class="col-span-full border border-base-300 bg-base-100/50 p-5 rounded-box mb-6 mt-2">

        <div class=" items-center flex flex-row">

          <label class="label mb-2 pb-0">

            <span class="label-text font-bold text-lg capitalize">{{ getLabel('appellation', 'appellation') }}</span>

          </label>

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('appellation', 'Information about the identifier (ID) and name of the monument.', 'doc')" v-if="getLabel('appellation', 'Information about the identifier (ID) and name of the monument.', 'doc')">

              <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help" :title="getLabel('appellation', 'Information about the identifier (ID) and name of the monument.', 'doc')">

            <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                        fill="currentColor"

                        stroke-width="2.5"

                        stroke="currentColor"

                        class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

            </button>

            </div>

            </div>

              <!--       <div class="text-sm text-base-content/60 mb-4 px-1">{{ getLabel('appellation', 'Information about the identifier (ID) and name of the monument.', 'doc') }}</div> -->

          <div class="grid grid-cols-1 gap-x-6">

            

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('appellation.id', 'id') }}</span><span class="text-accent font-black">*</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('appellation.id', 'Inventory number or institutional identifier of the heritage asset (e.g. museum number). Distinct from the Record ID above, which identifies the technical record.', 'doc')" v-if="getLabel('appellation.id', 'Inventory number or institutional identifier of the heritage asset (e.g. museum number). Distinct from the Record ID above, which identifies the technical record.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

                        <input type="text"     required v-model="form['appellation.id']" class="input input-bordered w-full validator " :placeholder="getLabel('appellation.id', 'e.g. SK 740', 'plac')" />

              <div class="validator-hint">{{t('validationHint')}}</div>        

          

          </div>

        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">

          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">

             <div class="flex flex-row items-center">

               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('appellation.name', 'name') }}<span class="text-accent font-black">*</span></h4>          

               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('appellation.name', 'Name of the heritage asset. Can be provided in multiple languages, with a preferred value indicated.', 'doc')" v-if="getLabel('appellation.name', 'Name of the heritage asset. Can be provided in multiple languages, with a preferred value indicated.', 'doc')">

                  <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help" :title="getLabel('appellation.name', 'Name of the heritage asset.', 'doc')">

                    <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" fill="currentColor" stroke-width="2.5" stroke="currentColor" class="size-[1.2em] primary-content"><path d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

                  </button>

               </div>

             </div>

             <button type="button" class="btn btn-sm btn-primary" @click.prevent="if(!form['appellation.name']) { form['appellation.name'] = []; } form['appellation.name'].push({_value: '', 'appellation.name#lang': 'en', 'appellation.name#preferred': form['appellation.name'].length === 0})">{{ currentLocale === 'de' ? getLabel('appellation.name', 'appellation.name') + ' ' + t('add') : t('add') + ' ' + getLabel('appellation.name', 'appellation.name') }}</button>

          </div>

          <div class="p-4 pt-0">

             <ul class="list bg-base-100 rounded-box shadow-md w-full">

                <li v-for="(item, idx) in form['appellation.name']" :key="idx" class="list-row flex items-center justify-between group h-auto py-2">

                   <div class="flex-1 w-full mr-4">

                      <input type="text" v-model="item['_value']" class="input input-bordered w-full" :placeholder="getLabel('appellation.name', '', 'plac')" />

                   </div>

                   

                   <div class="flex gap-2 items-center">

                     <div class="dropdown dropdown-end shrink-0">

                       <div tabindex="0" role="button" class="btn btn-ghost min-w-[80px]">

                         <span v-if="item['appellation.name#lang'] === 'de'" v-html="'<svg class=&quot;h-5 w-8 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 5 3&quot;><rect width=&quot;5&quot; height=&quot;3&quot; y=&quot;0&quot; fill=&quot;#000&quot;/><rect width=&quot;5&quot; height=&quot;2&quot; y=&quot;1&quot; fill=&quot;#D00&quot;/><rect width=&quot;5&quot; height=&quot;1&quot; y=&quot;2&quot; fill=&quot;#FFC800&quot;/></svg>'"></span>

                         <span v-else-if="item['appellation.name#lang'] === 'en'" v-html="'<svg class=&quot;h-5 w-8 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 50 30&quot; ><rect width=&quot;50&quot; height=&quot;30&quot; fill=&quot;#012169&quot;/><path d=&quot;M0 0 L50 30 M50 0 L0 30&quot; stroke=&quot;#fff&quot; stroke-width=&quot;6&quot;/><path d=&quot;M0 0 L50 30&quot; stroke=&quot;#C8102E&quot; stroke-width=&quot;2&quot;/><path d=&quot;M50 0 L0 30&quot; stroke=&quot;#C8102E&quot; stroke-width=&quot;2&quot;/><path d=&quot;M25 0 V30 M0 15 H50&quot; stroke=&quot;#fff&quot; stroke-width=&quot;10&quot;/><path d=&quot;M25 0 V30 M0 15 H50&quot; stroke=&quot;#C8102E&quot; stroke-width=&quot;6&quot;/></svg>'"></span>

                         <span v-else-if="item['appellation.name#lang'] === 'fr'" v-html="'<svg class=&quot;h-5 w-8 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 3 2&quot;><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;0&quot; fill=&quot;#002395&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;1&quot; fill=&quot;#FFF&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;2&quot; fill=&quot;#ED2939&quot;/></svg>'"></span>

                         <span v-else-if="item['appellation.name#lang'] === 'it'" v-html="'<svg class=&quot;h-5 w-8 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 3 2&quot;><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;0&quot; fill=&quot;#009246&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;1&quot; fill=&quot;#FFF&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;2&quot; fill=&quot;#CE2B37&quot;/></svg>'"></span>

                         <span v-else-if="item['appellation.name#lang'] === 'es'" v-html="'<svg class=&quot;h-5 w-8 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 3 2&quot;><rect width=&quot;3&quot; height=&quot;2&quot; y=&quot;0&quot; fill=&quot;#C1272D&quot;/><rect width=&quot;3&quot; height=&quot;1&quot; y=&quot;0.5&quot; fill=&quot;#FCE300&quot;/></svg>'"></span>

                         <span v-else class="text-sm font-bold uppercase">{{ item['appellation.name#lang'] || t('select') }}</span>

                       </div>

                       <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32 z-[1]">

                         <li><a @click.prevent="item['appellation.name#lang'] = 'de'; document.activeElement?.blur()">

                           <span v-html="'<svg class=&quot;h-4 w-6 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 5 3&quot;><rect width=&quot;5&quot; height=&quot;3&quot; y=&quot;0&quot; fill=&quot;#000&quot;/><rect width=&quot;5&quot; height=&quot;2&quot; y=&quot;1&quot; fill=&quot;#D00&quot;/><rect width=&quot;5&quot; height=&quot;1&quot; y=&quot;2&quot; fill=&quot;#FFC800&quot;/></svg>'"></span> DE

                         </a></li>

                         <li><a @click.prevent="item['appellation.name#lang'] = 'en'; document.activeElement?.blur()">

                           <span v-html="'<svg class=&quot;h-4 w-6 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 50 30&quot; ><rect width=&quot;50&quot; height=&quot;30&quot; fill=&quot;#012169&quot;/><path d=&quot;M0 0 L50 30 M50 0 L0 30&quot; stroke=&quot;#fff&quot; stroke-width=&quot;6&quot;/><path d=&quot;M0 0 L50 30&quot; stroke=&quot;#C8102E&quot; stroke-width=&quot;2&quot;/><path d=&quot;M50 0 L0 30&quot; stroke=&quot;#C8102E&quot; stroke-width=&quot;2&quot;/><path d=&quot;M25 0 V30 M0 15 H50&quot; stroke=&quot;#fff&quot; stroke-width=&quot;10&quot;/><path d=&quot;M25 0 V30 M0 15 H50&quot; stroke=&quot;#C8102E&quot; stroke-width=&quot;6&quot;/></svg>'"></span> EN

                         </a></li>

                         <li><a @click.prevent="item['appellation.name#lang'] = 'fr'; document.activeElement?.blur()">

                           <span v-html="'<svg class=&quot;h-4 w-6 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 3 2&quot;><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;0&quot; fill=&quot;#002395&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;1&quot; fill=&quot;#FFF&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;2&quot; fill=&quot;#ED2939&quot;/></svg>'"></span> FR

                         </a></li>

                         <li><a @click.prevent="item['appellation.name#lang'] = 'it'; document.activeElement?.blur()">

                           <span v-html="'<svg class=&quot;h-4 w-6 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 3 2&quot;><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;0&quot; fill=&quot;#009246&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;1&quot; fill=&quot;#FFF&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;2&quot; fill=&quot;#CE2B37&quot;/></svg>'"></span> IT

                         </a></li>

                         <li><a @click.prevent="item['appellation.name#lang'] = 'es'; document.activeElement?.blur()">

                           <span v-html="'<svg class=&quot;h-4 w-6 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 3 2&quot;><rect width=&quot;3&quot; height=&quot;2&quot; y=&quot;0&quot; fill=&quot;#C1272D&quot;/><rect width=&quot;3&quot; height=&quot;1&quot; y=&quot;0.5&quot; fill=&quot;#FCE300&quot;/></svg>'"></span> ES

                         </a></li>

                       </ul>

                     </div>

  

                     <div class="flex gap-1 shrink-0">

                        <button type="button" @click.prevent="item['appellation.name#preferred'] = !item['appellation.name#preferred']; if(item['appellation.name#preferred']) { form['appellation.name'].forEach((i, iIdx) => { if (iIdx !== idx) i['appellation.name#preferred'] = false; }); }" 

                            class="btn btn-square btn-ghost transition-opacity" 

                            :class="item['appellation.name#preferred'] ? 'text-warning opacity-100' : 'opacity-0 text-base-content/30 group-hover:opacity-100 hover:text-warning'" 

                            title="Set as preferred">

                            <svg xmlns="http://www.w3.org/2000/svg" class="size-[1.2em]" :fill="item['appellation.name#preferred'] ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">

                                <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />

                            </svg>

                        </button>

                        

                        <button type="button" @click.prevent="form['appellation.name'].splice(idx, 1)" class="btn btn-square btn-ghost text-error opacity-0 group-hover:opacity-100 transition-opacity">

                           <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>

                        </button>

                     </div>

                   </div>

                </li>

                

                <li v-if="!form['appellation.name'] || form['appellation.name'].length === 0" class="p-4 text-center text-sm text-base-content/40 italic">

                   {{ t('noItems') }}

                </li>

             </ul>

          </div>

        </div>

          </div>

          

        </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center justify-between">
          <div class="flex flex-row items-center">
            <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('description', 'description') }}</span><span class="text-accent font-black">*</span></label>
            <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('description', 'Free-text description of the heritage asset. Can be provided in multiple languages.', 'doc')" v-if="getLabel('description', 'Free-text description of the heritage asset. Can be provided in multiple languages.', 'doc')">
              <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
                <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                            fill="currentColor"
                            stroke-width="2.5"
                            stroke="currentColor"
                            class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
            </div>
          </div>
          <LanguageBadgePicker v-model="form['description#lang']" />
        </div>

        <textarea v-model="form['description']" class="textarea textarea-bordered w-full h-24" :placeholder="getLabel('description', 'e.g. Female fragment of an Attic grave naiskos in Pentelic marble, executed in relief technique ...', 'plac')"></textarea>

        </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">  

        <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('generalType', 'generalType') }}</span><span class="text-accent font-black">*</span></label>



          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('generalType', 'General classification of the heritage asset. Select from 7 predefined CARARE types.', 'doc')" v-if="getLabel('generalType', 'General classification of the heritage asset. Select from 7 predefined CARARE types.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

                </button>

              </div>

              </div>

          <select v-model="form['generalType']" class="select select-bordered w-full">

            <option disabled value="">{{ currentLocale === 'de' ? getLabel('generalType', 'generalType') + ' ' + t('select') : t('select') + ' ' + getLabel('generalType', 'generalType') }}</option>

            <template v-if="currentLocale === 'de'">

              <option value="3D-Modell">3D-Modell</option>

<option value="Artefakt">Artefakt</option>

<option value="Bild">Bild</option>

<option value="Film">Film</option>

<option value="Monument">Monument</option>

<option value="Text">Text</option>

<option value="Ton">Ton</option>

            </template>

            <template v-else>

              <option value="3D">3D</option>

<option value="Artefact">Artefact</option>

<option value="Image">Image</option>

<option value="Monument">Monument</option>

<option value="Movie">Movie</option>

<option value="Sound">Sound</option>

<option value="Text">Text</option>

            </template>

          </select>

          

        </div>

        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">

          <div class="flex flex-wrap justify-between items-center mb-4 pb-2 border-b border-base-200 gap-2">

             <div class="flex flex-row items-center">

               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('actors', 'actors') }}</h4>

               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('actors', 'The actors involved with this monument; may be repeated', 'doc')" v-if="getLabel('actors', 'The actors involved with this monument; may be repeated', 'doc')">

                    <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

                  <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                              fill="currentColor"

                              stroke-width="2.5"

                              stroke="currentColor"

                              class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

                  </button>

                  </div>

             </div>

             <div class="flex flex-wrap items-center justify-end gap-2">

               <button

                 v-if="form['actors'] && form['actors'].length > 0"

                 type="button"

                 class="btn btn-sm btn-ghost text-error hover:bg-error/10 gap-1 border border-error/30"

                 @click.prevent="clearFormActors"

                 :title="currentLocale === 'de' ? 'Entfernt alle Akteure aus diesem Datensatz' : 'Clears all actors from this record'"

               >

                 🗑️ {{ currentLocale === 'de' ? 'Alle leeren' : 'Clear All' }}

               </button>

               <button type="button" class="btn btn-sm btn-outline btn-accent gap-1" @click.prevent="openOrgPicker('actors')" :title="currentLocale === 'de' ? 'Organisation aus dem Pool wählen' : 'Select organization from pool'">🏛️ {{ currentLocale === 'de' ? 'Aus Organisations-Pool' : 'From Organizations' }}</button>

                <button type="button" class="btn btn-sm btn-secondary gap-1" @click.prevent="openPersonPicker('actors')">

                 <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">

                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />

                 </svg>

                 {{ currentLocale === 'de' ? '📋 Aus Personen-Liste wählen (Multiauswahl)' : '📋 Select from Persons (Multi)' }}

               </button>

               

             </div>

          </div>



          <!-- Reusable Actors Quick-Bar -->

          <div class="mb-3 p-2.5 bg-base-200/50 rounded-lg border border-base-300 flex flex-wrap items-center gap-1.5" v-if="savedActors && savedActors.length > 0">

            <span class="text-[11px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1 mr-1">

              <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">

                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />

              </svg>

              {{ currentLocale === 'de' ? 'Wiederverwenden (1-Klick):' : 'Reuse (1-Click):' }}

            </span>

            <button

              v-for="(sa, saIdx) in savedActors"

              :key="saIdx"

              type="button"

              class="btn btn-xs normal-case border-base-300 hover:border-secondary hover:bg-secondary/10 gap-1 font-normal"

              @click.prevent="quickAddActor(sa)"

              :title="sa.roles ? `${sa.name} (${sa.roles})` : sa.name"

            >

              <span class="text-secondary font-bold">+</span>

              <span class="font-medium">{{ sa.name }}</span>

              <span v-if="sa.roles" class="badge badge-ghost badge-xs text-[10px]">{{ sa.roles }}</span>

            </button>

          </div>

          

          <div class="overflow-x-auto">

             <table class="table table-xs w-full table-zebra">

                <thead class="bg-base-200"><tr><th>{{ getLabel('actors.id', 'id') }}</th><th>{{ getLabel('actors.name', 'name') }}</th><th class="w-24">{{ t('actions') }}</th></tr></thead>

                <tbody>

                   <tr v-for="(subItem, subIdx) in form['actors']" :key="subIdx">

                      <td>{{ subItem['id'] }}</td><td>{{ subItem['name'] }}</td>

                      <td>

                          <div class="flex gap-1">

                            <button type="button" class="btn btn-xs btn-ghost text-info" @click.prevent="openDrawer('actors', subIdx)">{{ t('edit') }}</button>

                            <button type="button" class="btn btn-xs btn-ghost text-error" @click.prevent="removeDrawerItem('actors', subIdx)">{{ t('del') }}</button>

                          </div>

                      </td>

                   </tr>

                   <tr v-if="!form['actors'] || form['actors'].length === 0">

                      <td colspan="10" class="text-center text-base-content/40 py-4 italic">{{ t('noItems') }}</td>

                   </tr>

                </tbody>

             </table>

          </div>

        </div>

        <div class="col-span-full border border-base-300 bg-base-100/50 p-5 rounded-box mb-6 mt-2">

        <div class=" items-center flex flex-row">

          <label class="label mb-2 pb-0">

            <span class="label-text font-bold text-lg capitalize">{{ getLabel('conditions', 'conditions') }}</span>

          </label>

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('conditions', 'This is information about the condition of a monument or building. The element is repeatable.', 'doc')" v-if="getLabel('conditions', 'This is information about the condition of a monument or building. The element is repeatable.', 'doc')">

              <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

            <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                        fill="currentColor"

                        stroke-width="2.5"

                        stroke="currentColor"

                        class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

            </button>

            </div>

            </div>

              <!--       <div class="text-sm text-base-content/60 mb-4 px-1">{{ getLabel('conditions', 'This is information about the condition of a monument or building. The element is repeatable.', 'doc') }}</div> -->

          <div class="grid grid-cols-1 gap-x-6">

            

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">  

        <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('conditions.condition', 'condition') }}</span><span class="text-warning font-black">~</span></label>



          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('conditions.condition', 'General professional assessment of the condition. This assessment is based on the expertise of the documenting person and is not defined by fixed thresholds.', 'doc')" v-if="getLabel('conditions.condition', 'General professional assessment of the condition. This assessment is based on the expertise of the documenting person and is not defined by fixed thresholds.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

                </button>

              </div>

              </div>

          <select v-model="form['conditions.condition']" class="select select-bordered w-full">

            <option disabled value="">{{ currentLocale === 'de' ? getLabel('conditions.condition', 'condition') + ' ' + t('select') : t('select') + ' ' + getLabel('conditions.condition', 'condition') }}</option>

            <template v-if="currentLocale === 'de'">

              <option value="gut">gut</option>

<option value="mittelmäßig">mittelmäßig</option>

<option value="ruiniert">ruiniert</option>

<option value="schlecht">schlecht</option>

<option value="teilweise zerstört">teilweise zerstört</option>

<option value="unter Restaurierung">unter Restaurierung</option>

            </template>

            <template v-else>

              <option value="bad">bad</option>

<option value="fair">fair</option>

<option value="good">good</option>

<option value="part destroyed">part destroyed</option>

<option value="poor">poor</option>

<option value="under restoration">under restoration</option>

            </template>

          </select>

          

        </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('conditions.conditionAssessment', 'conditionAssessment') }}</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('conditions.conditionAssessment', 'A detailed assessment of the condition of a heritage asset and any treatment required, including an estimation of the percentage affected.', 'doc')" v-if="getLabel('conditions.conditionAssessment', 'A detailed assessment of the condition of a heritage asset and any treatment required, including an estimation of the percentage affected.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

          <textarea v-model="form['conditions.conditionAssessment']" class="textarea textarea-bordered w-full h-24" :placeholder="getLabel('conditions.conditionAssessment', 'e.g. Surface weathering on the front, approx. 15% of the relief surface affected. Conservation treatment recommended.', 'plac')"></textarea>

          

        </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('conditions.conditionDate', 'conditionDate') }}</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('conditions.conditionDate', 'The date when the assessment of condition was made. Free text to allow for a descriptive date, e.g. \'1950s\'. [NEW – per the CARARE schema (3.3 Conditions), previously undocumented.]', 'doc')" v-if="getLabel('conditions.conditionDate', 'The date when the assessment of condition was made. Free text to allow for a descriptive date, e.g. \'1950s\'. [NEW – per the CARARE schema (3.3 Conditions), previously undocumented.]', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

                        <input type="date" :max="maxDate"     v-model="form['conditions.conditionDate']" class="input input-bordered w-full validator " :placeholder="getLabel('conditions.conditionDate', 'e.g. 2010 | 1950s', 'plac')" />

              <div class="validator-hint">{{t('validationHint')}}</div>        

          

          </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('conditions.wasPresentAt', 'wasPresentAt') }}</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('conditions.wasPresentAt', 'Relation to an associated event/activity at which the condition assessment was made. Give the ID number of the target record or a URI.', 'doc')" v-if="getLabel('conditions.wasPresentAt', 'Relation to an associated event/activity at which the condition assessment was made. Give the ID number of the target record or a URI.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

                        <input type="text"      v-model="form['conditions.wasPresentAt']" class="input input-bordered w-full validator " :placeholder="getLabel('conditions.wasPresentAt', 'e.g. conservation measures 2010, carried out by a qualified conservator', 'plac')" />

              <div class="validator-hint">{{t('validationHint')}}</div>        

          

          </div>

          </div>

          

        </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('provenance', 'provenance') }}</span><span class="text-accent font-black">*</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('provenance', 'Free text describing the ownership and custody history of the heritage asset since its creation – relevant to its authenticity, integrity and interpretation. Instead of free text, a link to detailed documentation can also be provided.', 'doc')" v-if="getLabel('provenance', 'Free text describing the ownership and custody history of the heritage asset since its creation – relevant to its authenticity, integrity and interpretation. Instead of free text, a link to detailed documentation can also be provided.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

          <textarea v-model="form['provenance']" class="textarea textarea-bordered w-full h-24" :placeholder="getLabel('provenance', 'e.g. https://doi.org/10.11588/diglit.69318#0219', 'plac')"></textarea>

          

        </div>

        <div class="col-span-full border border-base-300 bg-base-100/50 p-5 rounded-box mb-6 mt-2">

        <div class=" items-center flex flex-row">

          <label class="label mb-2 pb-0">

            <span class="label-text font-bold text-lg capitalize">{{ getLabel('characters', 'characters') }}</span>

          </label>

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('characters', 'This is a set of index information to describe the character of the monument. Content providers are strongly recommended to complete this element.', 'doc')" v-if="getLabel('characters', 'This is a set of index information to describe the character of the monument. Content providers are strongly recommended to complete this element.', 'doc')">

              <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

            <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                        fill="currentColor"

                        stroke-width="2.5"

                        stroke="currentColor"

                        class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

            </button>

            </div>

            </div>

              <!--       <div class="text-sm text-base-content/60 mb-4 px-1">{{ getLabel('characters', 'This is a set of index information to describe the character of the monument. Content providers are strongly recommended to complete this element.', 'doc') }}</div> -->

          <div class="grid grid-cols-1 gap-x-6">

            

        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">

          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">

             <div class="flex flex-row items-center">

               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('characters.heritageAssetType', 'heritageAssetType') }}<span class="text-accent font-black">*</span></h4>

               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('characters.heritageAssetType', 'Typological classification as a monument – e.g. tombstone, dwelling, fortification.', 'doc')" v-if="getLabel('characters.heritageAssetType', 'Typological classification as a monument – e.g. tombstone, dwelling, fortification.', 'doc')">

                    <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

                  <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                              fill="currentColor"

                              stroke-width="2.5"

                              stroke="currentColor"

                              class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

                  </button>

                  </div>

             </div>

          </div>

          <HectorMonumentTypeInput v-model="form['characters.heritageAssetType']" :current-locale="currentLocale" />

        </div>

        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">

          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">

             <div class="flex flex-row items-center">

               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('characters.temporal', 'temporal') }}</h4>

               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('characters.temporal', 'Information about the date and/or period of an entity.. Content providers are strongly recommended to complete this element.', 'doc')" v-if="getLabel('characters.temporal', 'Information about the date and/or period of an entity.. Content providers are strongly recommended to complete this element.', 'doc')">

                    <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

                  <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                              fill="currentColor"

                              stroke-width="2.5"

                              stroke="currentColor"

                              class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

                  </button>

                  </div>

             </div>

             <button type="button" class="btn btn-sm btn-primary" @click.prevent="openDrawer('characters.temporal')">{{ currentLocale === 'de' ? getLabel('characters.temporal', 'characters.temporal') + ' ' + t('add') : t('add') + ' ' + getLabel('characters.temporal', 'characters.temporal') }}</button>

          </div>



          <!-- Direct PeriodO Epochen-Gazetteer Quick Selector for Heritage Asset -->

          <div class="p-4 bg-base-200/40 rounded-2xl border border-base-300/80 mb-4 space-y-2">

            <div class="flex flex-wrap items-center justify-between gap-2 mb-1">

              <div class="flex items-center gap-2">

                <span class="badge badge-primary font-bold text-xs px-2.5 py-1">🏛️ HECTOR Epochen & PeriodO</span>

                <span class="text-xs font-bold text-base-content/80">

                  {{ currentLocale === 'de' ? 'Archäologische Datierung & Epoche direkt zuweisen:' : 'Directly assign archaeological epoch & dating:' }}

                </span>

              </div>

              <span class="text-[11px] text-base-content/50 italic">

                {{ currentLocale === 'de' ? 'Kanonische Datierung für das Kulturgut (CARARE characters.temporal)' : 'Canonical dating for the heritage asset' }}

              </span>

            </div>



            <PeriodoAutocomplete

              :current-locale="currentLocale"

              v-model="quickPeriodoSelect"

              @select="handleDirectPeriodoAdd"

            />

          </div>

          

          <div class="overflow-x-auto">

             <table class="table table-xs w-full table-zebra">

                <thead class="bg-base-200">

                  <tr>

                    <th>{{ currentLocale === 'de' ? 'Epoche (PeriodO / Vokabular)' : 'Epoch (PeriodO / Vocabulary)' }}</th>

                    <th>{{ currentLocale === 'de' ? 'Von (startDate)' : 'Start Date' }}</th>

                    <th>{{ currentLocale === 'de' ? 'Bis (endDate)' : 'End Date' }}</th>

                    <th>{{ currentLocale === 'de' ? 'Datierung (displayDate)' : 'Display Date' }}</th>

                    <th>{{ currentLocale === 'de' ? 'PeriodO ARK / Authority' : 'Authority' }}</th>

                    <th class="w-24 text-right">{{ t('actions') }}</th>

                  </tr>

                </thead>

                <tbody>

                   <tr v-for="(subItem, subIdx) in form['characters.temporal']" :key="subIdx" class="hover">

                      <td class="font-bold text-sm">

                        <div class="flex items-center gap-1.5">

                          <span>{{ subItem['periodName'] || '–' }}</span>

                          <span v-if="subItem['timeSpan.dateRangeQualifier'] && subItem['timeSpan.dateRangeQualifier'].includes('ark:/99152')" class="badge badge-info badge-outline badge-xs font-mono">PeriodO</span>

                          <span v-else-if="subItem['timeSpan.dateRangeQualifier'] && subItem['timeSpan.dateRangeQualifier'].includes('hector')" class="badge badge-primary badge-xs font-mono">HECTOR</span>

                        </div>

                      </td>

                      <td class="font-mono text-xs font-semibold">{{ subItem['timeSpan.startDate'] || '–' }}</td>

                      <td class="font-mono text-xs font-semibold">{{ subItem['timeSpan.endDate'] || '–' }}</td>

                      <td class="text-xs text-base-content/80">{{ subItem['displayDate'] || '–' }}</td>

                      <td class="text-xs font-mono">

                        <a v-if="subItem['timeSpan.dateRangeQualifier']" :href="subItem['timeSpan.dateRangeQualifier']" target="_blank" rel="noopener" class="link link-primary text-[11px] truncate max-w-[150px] inline-block" :title="subItem['timeSpan.dateRangeQualifier']">

                          {{ subItem['timeSpan.dateRangeQualifier'].replace('http://n2t.net/', '').replace('http://vocabs.bcdh.uni-bonn.de/hector_epochs/', 'hector:') }}

                        </a>

                        <span v-else class="text-base-content/30">–</span>

                      </td>

                      <td class="text-right">

                          <div class="flex gap-1 justify-end">

                            <button type="button" class="btn btn-xs btn-ghost text-info" @click.prevent="openDrawer('characters.temporal', subIdx)">{{ t('edit') }}</button>

                            <button type="button" class="btn btn-xs btn-ghost text-error" @click.prevent="removeDrawerItem('characters.temporal', subIdx)">{{ t('del') }}</button>

                          </div>

                      </td>

                   </tr>

                   <tr v-if="!form['characters.temporal'] || form['characters.temporal'].length === 0">

                      <td colspan="6" class="text-center text-base-content/40 py-6 italic">

                        {{ currentLocale === 'de' ? 'Noch keine Epoche oder Datierung zugewiesen. Wählen Sie oben eine PeriodO-Epoche (z. B. Tiberius, Augustus) oder klicken Sie auf Hinzufügen.' : 'No epoch or dating assigned. Select a PeriodO epoch above or click Add.' }}

                      </td>

                   </tr>

                </tbody>

             </table>

          </div>

        </div>

        <div class="form-control w-full mb-6">

          <div class="flex flex-row items-center mb-2">

            <label class="label p-0 mr-2">

              <span class="label-text font-bold capitalize text-base">{{ getLabel('characters.materials', 'materials') }}</span>

              <span class="text-accent font-black ml-1">*</span>

            </label>

            <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('characters.materials', 'Materials of which the heritage asset is composed. Use HECTOR vocabulary recommendations.', 'doc')">

              <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

                <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" fill="currentColor" stroke-width="2.5" stroke="currentColor" class="size-[1.2em] primary-content"><path d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

            </div>

          </div>

          <HectorMaterialInput v-model="form['characters.materials']" :current-locale="currentLocale" />

        </div>

        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">

          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">

             <div class="flex flex-row items-center">

               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('characters.inscriptions', 'inscriptions') }}<span class="text-warning font-black">~</span></h4>

               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('characters.inscriptions', 'Full inscription text, in the original script where applicable. Can be provided in multiple languages.', 'doc')" v-if="getLabel('characters.inscriptions', 'Full inscription text, in the original script where applicable. Can be provided in multiple languages.', 'doc')">

                    <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

                  <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                              fill="currentColor"

                              stroke-width="2.5"

                              stroke="currentColor"

                              class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

                  </button>

                  </div>

             </div>

             <div class="flex items-center gap-2">
               <LanguageBadgePicker v-model="form['characters.inscriptions#lang']" />
               <button type="button" class="btn btn-sm btn-primary" @click.prevent="if(!form['characters.inscriptions']) form['characters.inscriptions'] = []; form['characters.inscriptions'].push(''); inlineEditing['characters.inscriptions_' + (form['characters.inscriptions'].length - 1)] = true;">{{ currentLocale === 'de' ? getLabel('characters.inscriptions', 'characters.inscriptions') + ' ' + t('add') : t('add') + ' ' + getLabel('characters.inscriptions', 'characters.inscriptions') }}</button>
             </div>

          </div>

          

          <ul class="list bg-base-100 rounded-box shadow-md w-full">

             

             <li v-for="(subItem, subIdx) in form['characters.inscriptions']" :key="subIdx" class="list-row flex items-center justify-between h-auto py-2">

                <div v-if="!inlineEditing['characters.inscriptions_' + subIdx]">{{ subItem }}</div>

                 <div v-else class="flex-1 mr-4">

                   <input type="text"        v-model="form['characters.inscriptions'][subIdx]" class="input input-sm input-bordered w-full validator " :placeholder="getLabel('characters.inscriptions', 'e.g. 1-line inscription on the cornice: Νικαρέτη Κτησιφῶντος ...', 'plac')" />

                   <div class="validator-hint text-xs mt-1">Enter valid value</div>

                 </div>

                <div class="flex gap-1 shrink-0">

                   <button type="button" @click.prevent="inlineEditing['characters.inscriptions_' + subIdx] = !inlineEditing['characters.inscriptions_' + subIdx]" class="btn btn-square btn-ghost" :class="inlineEditing['characters.inscriptions_' + subIdx] ? 'text-success' : 'text-info'">

                   <svg v-if="!inlineEditing['characters.inscriptions_' + subIdx]" class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>

                   <svg v-else class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>

                 </button>

                   <button type="button" @click.prevent="removeDrawerItem('characters.inscriptions', subIdx)" class="btn btn-square btn-ghost text-error">

                     <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>

                   </button>

                </div>

             </li>

             

             <li v-if="!form['characters.inscriptions'] || form['characters.inscriptions'].length === 0" class="p-4 text-center text-sm text-base-content/40 italic">

                {{ t('noItems') }}

             </li>

          </ul>

        </div>

        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">

          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">

             <div class="flex flex-row items-center">

               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('characters.dimensions', 'dimensions') }}</h4>

               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('characters.dimensions', '', 'doc')" v-if="getLabel('characters.dimensions', '', 'doc')">

                    <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

                  <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                              fill="currentColor"

                              stroke-width="2.5"

                              stroke="currentColor"

                              class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

                  </button>

                  </div>

             </div>

             <button type="button" class="btn btn-sm btn-primary" @click.prevent="openDrawer('characters.dimensions')">{{ currentLocale === 'de' ? getLabel('characters.dimensions', 'characters.dimensions') + ' ' + t('add') : t('add') + ' ' + getLabel('characters.dimensions', 'characters.dimensions') }}</button>

          </div>

          

          <div class="overflow-x-auto">

             <table class="table table-xs w-full table-zebra">

                <thead class="bg-base-200">

                  <tr>

                    <th>{{ getLabel('characters.dimensions.extent', 'extent') }}</th>

                    <th>{{ getLabel('characters.dimensions.measurementType', 'measurementType') }}</th>

                    <th>{{ getLabel('characters.dimensions.value', 'value') }}</th>

                    <th>{{ getLabel('characters.dimensions.units', 'units') }}</th>

                    <th>{{ getLabel('characters.dimensions.scale', 'scale') }}</th>

                    <th class="w-24">{{ t('actions') }}</th>

                  </tr>

                </thead>

                <tbody>

                   <tr v-for="(subItem, subIdx) in form['characters.dimensions']" :key="subIdx">

                      <td class="font-medium">{{ subItem['extent'] || subItem['characters.dimensions.extent'] || '-' }}</td>

                      <td>{{ subItem['measurementType'] || subItem['characters.dimensions.measurementType'] || '-' }}</td>

                      <td class="font-mono font-semibold">{{ subItem['value'] || subItem['characters.dimensions.value'] || '-' }}</td>

                      <td>{{ subItem['units'] || subItem['characters.dimensions.units'] || '-' }}</td>

                      <td>{{ subItem['scale'] || subItem['characters.dimensions.scale'] || '-' }}</td>

                      <td>

                          <div class="flex gap-1">

                            <button type="button" class="btn btn-xs btn-ghost text-info" @click.prevent="openDrawer('characters.dimensions', subIdx)">{{ t('edit') }}</button>

                            <button type="button" class="btn btn-xs btn-ghost text-error" @click.prevent="removeDrawerItem('characters.dimensions', subIdx)">{{ t('del') }}</button>

                          </div>

                      </td>

                   </tr>

                   <tr v-if="!form['characters.dimensions'] || form['characters.dimensions'].length === 0">

                      <td colspan="10" class="text-center text-base-content/40 py-4 italic">{{ t('noItems') }}</td>

                   </tr>

                </tbody>

             </table>

          </div>

        </div>

          </div>

          

        </div>

        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">

          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">

             <div class="flex flex-row items-center">

               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('spatial', 'spatial') }}</h4>

               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('spatial', 'This is information about the place at which the heritage asset is located, included named places, postal address, the map coordinates and geometry of the heritage asset.. Content providers are strongly recommended to complete this element.', 'doc')" v-if="getLabel('spatial', 'This is information about the place at which the heritage asset is located, included named places, postal address, the map coordinates and geometry of the heritage asset.. Content providers are strongly recommended to complete this element.', 'doc')">

                    <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

                  <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                              fill="currentColor"

                              stroke-width="2.5"

                              stroke="currentColor"

                              class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

                  </button>

                  </div>

             </div>

             <div class="flex items-center gap-2">

               <button

                 type="button"

                 class="btn btn-sm gap-1.5 transition-colors shadow-sm"

                 :class="isSpatialMapExpanded ? 'btn-neutral text-neutral-content' : 'btn-outline border-base-300 text-base-content'"

                 @click="isSpatialMapExpanded = !isSpatialMapExpanded"

                 :title="currentLocale === 'de' ? 'Interaktive Karte ein-/ausblenden' : 'Toggle interactive map'"

               >

                 <span v-if="!isSpatialMapExpanded">🗺️</span>

                 <span v-else>✕</span>

                 <span>{{ currentLocale === 'de' ? (isSpatialMapExpanded ? 'Karte schließen' : 'Kartenansicht') : (isSpatialMapExpanded ? 'Close Map' : 'Map View') }}</span>

               </button>

               <button type="button" class="btn btn-sm btn-primary" @click.prevent="openDrawer('spatial')">{{ currentLocale === 'de' ? getLabel('spatial', 'spatial') + ' ' + t('add') : t('add') + ' ' + getLabel('spatial', 'spatial') }}</button>

             </div>

          </div>



          <!-- Interactive Map Preview on Main Card -->

          <div v-if="isSpatialMapExpanded" class="mb-4 rounded-2xl overflow-hidden border border-base-300 shadow-sm">

            <SpatialMapPicker

              :current-locale="currentLocale"

              :lat="primarySpatialCoords.lat"

              :lng="primarySpatialCoords.lng"

              :location-name="primarySpatialCoords.name"

              @update:lat="(v) => setPrimarySpatialCoord('y', v)"

              @update:lng="(v) => setPrimarySpatialCoord('x', v)"

              height="280px"

            />

          </div>

          

          <!-- Reusable Spatial Quick-Bar -->

          <div class="mb-3 p-2.5 bg-base-200/50 rounded-lg border border-base-300 flex flex-wrap items-center gap-1.5" v-if="savedSpatial && savedSpatial.length > 0">

            <span class="text-[11px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1 mr-1">

              <span>📍</span>

              {{ currentLocale === 'de' ? 'Wiederverwenden (1-Klick):' : 'Reuse (1-Click):' }}

            </span>

            <button

              v-for="(sp, spIdx) in savedSpatial"

              :key="spIdx"

              type="button"

              class="btn btn-xs normal-case border-base-300 hover:border-primary hover:bg-primary/10 gap-1 font-normal group"

              @click.prevent="quickAddSpatial(sp)"

              :title="`${sp.name || sp.namedLocation} (${sp.geopoliticalArea || ''}) - X:${sp.x || '-'}, Y:${sp.y || '-'}`"

            >

              <span class="text-primary font-bold">+</span>

              <span class="font-medium">{{ sp.name || sp.namedLocation }}</span>

              <span v-if="sp.geopoliticalArea" class="badge badge-ghost badge-xs text-[10px] opacity-70">{{ sp.geopoliticalArea }}</span>

              <span

                class="opacity-0 group-hover:opacity-100 hover:text-error ml-1 transition-opacity text-[11px]"

                @click.stop="removeSavedSpatial(spIdx)"

                :title="currentLocale === 'de' ? 'Aus Liste entfernen' : 'Remove from list'"

              >✕</span>

            </button>

          </div>

          

          <div class="overflow-x-auto">

             <table class="table table-xs w-full table-zebra">

                <thead class="bg-base-200">

                  <tr>

                    <th>{{ getLabel('spatial.locationSet.namedLocation', 'namedLocation') }}</th>

                    <th>{{ getLabel('spatial.locationSet.geopoliticalArea', 'geopoliticalArea') }}</th>

                    <th>{{ currentLocale === 'de' ? 'Koordinaten (X/Y)' : 'Coordinates (X/Y)' }}</th>

                    <th class="w-28 text-right">{{ t('actions') }}</th>

                  </tr>

                </thead>

                <tbody>

                   <tr v-for="(subItem, subIdx) in form['spatial']" :key="subIdx">

                      <td class="font-medium">

                        <div class="flex items-center gap-1.5 flex-wrap">

                          <span v-if="subItem['locationSet.historicalName']" class="badge badge-warning badge-xs font-semibold gap-1">

                            🏛️ {{ subItem['locationSet.historicalName'] }}

                          </span>

                          <span v-if="subItem['locationSet.namedLocation'] && subItem['locationSet.namedLocation'] !== subItem['locationSet.historicalName']" :class="subItem['locationSet.historicalName'] ? 'text-xs opacity-75' : ''">

                            {{ subItem['locationSet.namedLocation'] }}

                          </span>

                          <span v-else-if="!subItem['locationSet.historicalName']">

                            {{ subItem['locationSet.namedLocation'] || '-' }}

                          </span>

                        </div>

                      </td>

                      <td>

                        <span v-if="subItem['locationSet.geopoliticalArea']" class="badge badge-info/15 text-info border border-info/30 badge-xs font-medium">

                          🌍 {{ subItem['locationSet.geopoliticalArea'] }}

                        </span>

                        <span v-else-if="subItem['locationSet.historicalName']" class="text-xs opacity-40 italic">

                          {{ currentLocale === 'de' ? '– (Historischer Ort)' : '– (Historical site)' }}

                        </span>

                        <span v-else class="opacity-40">-</span>

                      </td>

                      <td class="font-mono text-xs">

                        <span v-if="subItem['geometry.quickpoint.x'] || subItem['geometry.quickpoint.y']">

                          {{ subItem['geometry.quickpoint.y'] || '0' }}, {{ subItem['geometry.quickpoint.x'] || '0' }}

                        </span>

                        <span v-else class="opacity-40">-</span>

                      </td>

                      <td class="text-right">

                          <div class="flex gap-1 justify-end">

                            <button

                              type="button"

                              class="btn btn-xs btn-ghost text-primary"

                              @click.prevent="saveItemToSpatialPool(subItem)"

                              :title="currentLocale === 'de' ? 'In Liste zum Wiederverwenden merken' : 'Save to reusable spatial list'"

                            >

                              💾

                            </button>

                            <button type="button" class="btn btn-xs btn-ghost text-info" @click.prevent="openDrawer('spatial', subIdx)">{{ t('edit') }}</button>

                            <button type="button" class="btn btn-xs btn-ghost text-error" @click.prevent="removeDrawerItem('spatial', subIdx)">{{ t('del') }}</button>

                          </div>

                      </td>

                   </tr>

                   <tr v-if="!form['spatial'] || form['spatial'].length === 0">

                      <td colspan="10" class="text-center text-base-content/40 py-4 italic">{{ t('noItems') }}</td>

                   </tr>

                </tbody>

             </table>

          </div>

        </div>

        <div class="form-control w-full mb-4">
          <div class="flex flex-row items-center justify-between">
            <div class="flex flex-row items-center">
              <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('repositoryLocation', 'repositoryLocation') }}</span><span class="text-accent font-black">*</span></label>
              <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('repositoryLocation', 'Institution currently holding the heritage asset, possibly with its current location.', 'doc')" v-if="getLabel('repositoryLocation', 'Institution currently holding the heritage asset, possibly with its current location.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
                  <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" fill="currentColor" stroke-width="2.5" stroke="currentColor" class="size-[1.2em] primary-content"><path d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
                </button>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <LanguageBadgePicker v-model="form['repositoryLocation#lang']" />
              <button
                type="button"
                class="btn btn-xs btn-outline btn-primary gap-1 font-semibold"
                @click.prevent="openOrgPickerForRepo"
                :title="currentLocale === 'de' ? 'Organisation aus dem Pool auswählen' : 'Pick organization from pool'"
              >
                🏛️ {{ currentLocale === 'de' ? 'Aus Organisations-Pool wählen' : 'Pick from Organization Pool' }}
              </button>
            </div>
          </div>

          <!-- Selected Repository Location Display Badge -->
          <div v-if="form['repositoryLocation']" class="p-3 bg-base-200 rounded-xl border border-primary/30 flex items-center justify-between gap-3 shadow-xs my-2">
            <div class="flex items-center gap-2.5 min-w-0">
              <span class="text-xl">🏛️</span>
              <div class="min-w-0">
                <div class="font-bold text-sm text-base-content truncate">{{ form['repositoryLocation'] }}</div>
                <div class="text-[11px] text-base-content/60">{{ currentLocale === 'de' ? 'Verwahrende Institution / Aufbewahrungsort' : 'Custodial institution / Repository' }}</div>
              </div>
            </div>
            <button
              type="button"
              class="btn btn-xs btn-circle btn-ghost text-error hover:bg-error/10"
              @click.prevent="form['repositoryLocation'] = ''"
              :title="currentLocale === 'de' ? 'Auswahl entfernen' : 'Clear selection'"
            >
              ✕
            </button>
          </div>

          <!-- Empty State Warning if required -->
          <div v-else class="p-3 bg-warning/5 rounded-xl border border-warning/30 flex items-center justify-between gap-2 my-2 text-warning text-xs">
            <span class="flex items-center gap-1.5">
              <span>⚠️</span>
              <span>{{ currentLocale === 'de' ? 'Kein Aufbewahrungsort gewählt. Bitte über den Organisations-Pool auswählen.' : 'No repository selected. Please select from the Organization Pool.' }}</span>
            </span>
            <button
              type="button"
              class="btn btn-xs btn-primary gap-1"
              @click.prevent="openOrgPickerForRepo"
            >
              🏛️ {{ currentLocale === 'de' ? 'Pool öffnen' : 'Open Pool' }}
            </button>
          </div>

          <!-- Hidden input for HTML form validation if required -->
          <input type="hidden" required v-model="form['repositoryLocation']" />

          <!-- Quick action: Adopt from Collection if available -->
          <div v-if="collectionInstitution.fullLabel" class="mt-1 flex items-center gap-2 flex-wrap">
            <button
              v-if="form['repositoryLocation'] !== collectionInstitution.fullLabel"
              type="button"
              class="btn btn-xs btn-outline btn-primary gap-1"
              @click="form['repositoryLocation'] = collectionInstitution.fullLabel"
              :title="currentLocale === 'de' ? 'Übernimmt die Einrichtung aus der Sammlung' : 'Adopt institution from Collection'"
            >
              <span>🏛️</span>
              <span>{{ currentLocale === 'de' ? 'Aus Sammlung übernehmen:' : 'Adopt from collection:' }}</span>
              <span class="font-bold underline truncate max-w-[260px]">{{ collectionInstitution.fullLabel }}</span>
            </button>
            <span v-else class="text-[11px] text-success font-medium flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              {{ currentLocale === 'de' ? 'Identisch mit Sammlung (Collection)' : 'Identical to Collection' }}
            </span>
          </div>
        </div>

        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">

          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">

             <div class="flex flex-row items-center">

               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('references', 'references') }}</h4>

               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('references', 'These are sources of information about the heritage asset in publications and archival sources (for example, photographs, drawings, plans, bibliographic references etc.). Digital objects (image, text, video, audio, 3D model, etc.) which are accessible online and will represent the asset in Europeana should be describe as Digital Resources, not References.', 'doc')" v-if="getLabel('references', 'These are sources of information about the heritage asset in publications and archival sources (for example, photographs, drawings, plans, bibliographic references etc.). Digital objects (image, text, video, audio, 3D model, etc.) which are accessible online and will represent the asset in Europeana should be describe as Digital Resources, not References.', 'doc')">

                    <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

                  <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                              fill="currentColor"

                              stroke-width="2.5"

                              stroke="currentColor"

                              class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

                  </button>

                  </div>

             </div>

             <button type="button" class="btn btn-sm btn-primary" @click.prevent="openDrawer('references')">{{ currentLocale === 'de' ? getLabel('references', 'references') + ' ' + t('add') : t('add') + ' ' + getLabel('references', 'references') }}</button>

          </div>

          

          <div class="overflow-x-auto">

             <table class="table table-xs w-full table-zebra">

                <thead class="bg-base-200"><tr><th>{{ getLabel('references.appellation.id', 'id') }}</th><th>{{ getLabel('references.appellation.name', 'name') }}</th><th>{{ getLabel('references.actors.id', 'id') }}</th><th>{{ getLabel('references.actors.name', 'name') }}</th><th class="w-24">{{ t('actions') }}</th></tr></thead>

                <tbody>

                   <tr v-for="(subItem, subIdx) in form['references']" :key="subIdx">

                      <td>{{ subItem['appellation.id'] }}</td><td>{{ subItem['appellation.name'] }}</td><td>{{ subItem['actors.id'] }}</td><td>{{ subItem['actors.name'] }}</td>

                      <td>

                          <div class="flex gap-1">

                            <button type="button" class="btn btn-xs btn-ghost text-info" @click.prevent="openDrawer('references', subIdx)">{{ t('edit') }}</button>

                            <button type="button" class="btn btn-xs btn-ghost text-error" @click.prevent="removeDrawerItem('references', subIdx)">{{ t('del') }}</button>

                          </div>

                      </td>

                   </tr>

                   <tr v-if="!form['references'] || form['references'].length === 0">

                      <td colspan="10" class="text-center text-base-content/40 py-4 italic">{{ t('noItems') }}</td>

                   </tr>

                </tbody>

             </table>

          </div>

        </div>

        <!-- Unified Dublin Core & CARARE Relations Manager for Heritage Asset -->

        <HeritageAssetDcRelations

          :form="form"

          :current-locale="currentLocale"

          :project-digital-resources="projectDigitalResources"

          :project-activities="projectActivities"

          :other-heritage-assets="items"

          :active-asset-id="form['recordInformation.id'] || form['appellation.id']"

        />

            </div>



            <!-- Form Action Buttons -->

            <div class="mt-8 pt-4 border-t border-base-300 flex flex-wrap justify-between items-center gap-3">

              <div>

                <button v-if="isEditing" type="button" class="btn btn-ghost" @click="resetForm()">{{ t('cancel') }}</button>

              </div>

              <div class="flex flex-wrap items-center gap-2">

                <span v-if="saveSuccessBadge" class="badge badge-success text-success-content font-bold px-3 py-3 text-xs gap-1">

                  ✓ {{ currentLocale === 'de' ? 'Gespeichert' : 'Saved' }}

                </span>

                <button v-if="isEditing" type="button" class="btn btn-outline" @click="resetForm()">

                  + {{ currentLocale === 'de' ? 'Neuer Datensatz' : 'New Record' }}

                </button>

                <button type="button" class="btn btn-outline btn-secondary flex items-center gap-2" @click="saveAndContinueNextPart">

                  <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">

                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />

                  </svg>

                  {{ currentLocale === 'de' ? 'Speichern & Nächstes Teil anlegen' : 'Save & Add Next Part' }}

                </button>

                <button type="submit" class="btn btn-primary capitalize">

                  {{ t('save') }} {{ getLabel('heritageAssetIdentification', 'heritageAssetIdentification') }}

                </button>

              </div>

            </div>

          </form>

        </div>

      </div>

    </div>



    <div class="drawer-side z-[100]">

      <label for="drawer-heritageAssetIdentification" aria-label="close sidebar" class="drawer-overlay"></label>

      <div class="w-full max-w-lg min-h-full bg-base-100 flex flex-col pointer-events-auto">

        <div class="flex-1 overflow-y-auto p-6">

          <div class="flex items-start justify-between mb-6 pb-4 border-b border-base-200">

            <div class="flex items-center">

              <h2 class="text-2xl font-bold">{{ currentLocale === 'de' ? (getLabel(activeDrawerField, activeDrawerField.split('.').slice(-1)[0]) + ' ' + (drawerEditIndex > -1 ? t('edit') : t('add'))) : ((drawerEditIndex > -1 ? t('edit') : t('add')) + ' ' + getLabel(activeDrawerField, activeDrawerField.split('.').slice(-1)[0])) }}</h2>

              <div class="tooltip tooltip-bottom ml-4" :data-tip="t('addtemplate')" v-if="['contacts', 'references', 'temporal', 'spatial'].includes(activeDrawerField.split('.').slice(-1)[0] )">

                <button type="button" class="btn btn-square btn-ghost btn-sm btn-transparent" @click.prevent="openAddTemplateModal(activeDrawerField.split('.').slice(-1)[0])">

                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">

                    <path d="M5 21v-16q0 -0.825 0.588 -1.413T7 3h6v2H7v12.95l5 -2.15 5 2.15v-6.95h2v10L12 18 5 21Zm2 -16h6 -6Zm10 4v-2h-2v-2h2v-2h2v2h2v2h-2v2h-2Z" />

                  </svg>

                </button>

              </div>

              <div class="tooltip tooltip-bottom ml-2" :data-tip="t('template')" v-if="['contacts', 'references', 'temporal', 'spatial'].includes(activeDrawerField.split('.').slice(-1)[0] )">

                <button type="button" class="btn btn-square btn-ghost btn-sm btn-transparent" @click.prevent="openTemplateModal(activeDrawerField.split('.').slice(-1)[0])">

                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">

                    <path d="M4 22v-14q0 -0.825 0.588 -1.413T6 6h8q0.825 0 1.413 0.588T16 8v14L10 19 4 22Zm2 -3.025 4 -2.15 4 2.15v-10.975H6v10.975Zm12 -0.975v-14H7v-2h11q0.825 0 1.413 0.588T20 4v14h-2ZM6 8h8 -8Z" />

                  </svg>

                </button>

              </div>

            </div>

            <label for="drawer-heritageAssetIdentification" class="btn btn-circle btn-ghost btn-sm drawer-overlay">✕</label>

          </div>

          <form @submit.prevent="saveDrawer" @invalid.capture="handleInvalid" class="space-y-4">

            

      <div v-if="activeDrawerField === 'recordInformation.creation.contacts'">

        <div class="flex justify-end gap-2 mb-3">
          <button type="button" class="btn btn-xs btn-secondary gap-1" @click.prevent="openPersonPicker('contacts')">
            👤 {{ currentLocale === 'de' ? 'Aus Personen-Pool übernehmen' : 'Fill from Person Pool' }}
          </button>
        </div>

        <div class="grid grid-cols-1 gap-x-6">

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('recordInformation.creation.contacts.name', 'name') }}</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation.creation.contacts.name', 'First and last name of the person who created this record.', 'doc')" v-if="getLabel('recordInformation.creation.contacts.name', 'First and last name of the person who created this record.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

                        <input type="text"      v-model="drawerForm['name']" class="input input-bordered w-full validator " :placeholder="getLabel('recordInformation.creation.contacts.name', 'e.g. John Doe', 'plac')" />

              <div class="validator-hint">{{t('validationHint')}}</div>        

          

          </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">  

        <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('recordInformation.creation.contacts.role', 'role') }}</span></label>



          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation.creation.contacts.role', 'Role of the person in the project or institution.', 'doc')" v-if="getLabel('recordInformation.creation.contacts.role', 'Role of the person in the project or institution.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

                </button>

              </div>

              </div>

          <select v-model="drawerForm['role']" class="select select-bordered w-full">

            <option disabled value="">{{ currentLocale === 'de' ? getLabel('recordInformation.creation.contacts.role', 'role') + ' ' + t('select') : t('select') + ' ' + getLabel('recordInformation.creation.contacts.role', 'role') }}</option>

            <template v-if="currentLocale === 'de'">

              <option value="Dokumentar">Dokumentar</option>

<option value="Kurator">Kurator</option>

<option value="Projektleitung">Projektleitung</option>

            </template>

            <template v-else>

              <option value="Curator">Curator</option>

<option value="Documentation">Documentation</option>

<option value="Project Management">Project Management</option>

            </template>

          </select>

          

        </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center justify-between">
          <div class="flex flex-row items-center">
            <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('recordInformation.creation.contacts.organization', 'organization') }}</span><span class="text-accent font-black">*</span></label>
            <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation.creation.contacts.organization', 'Organisation to which the contact person belongs.', 'doc')" v-if="getLabel('recordInformation.creation.contacts.organization', 'Organisation to which the contact person belongs.', 'doc')">
              <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
                <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                            fill="currentColor"
                            stroke-width="2.5"
                            stroke="currentColor"
                            class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
            </div>
          </div>
          <button type="button" class="btn btn-xs btn-ghost text-accent gap-1" @click.prevent="openOrgPicker('contacts')">
            🏛️ {{ currentLocale === 'de' ? 'Aus Pool' : 'From Pool' }}
          </button>
        </div>

                        <input type="text"     required v-model="drawerForm['organization']" class="input input-bordered w-full validator " :placeholder="getLabel('recordInformation.creation.contacts.organization', 'e.g. Stiftung Preußischer Kulturbesitz, Staatliche Museen zu Berlin', 'plac')" />

              <div class="validator-hint">{{t('validationHint')}}</div>        

          

          </div></div>

      </div>

      <div v-if="activeDrawerField === 'recordInformation.language'">

        

          <div class="form-control w-full">

             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('recordInformation.language', 'language') }}</span><span class="text-warning font-black">~</span></label>

             <input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('recordInformation.language', '', 'plac')"/>

          </div>

          

          <div class="form-control w-full">

             <label class="label"><span class="label-text font-bold capitalize">lang</span></label>

               <input type="text" v-model="drawerForm['#lang']" class="input input-bordered w-full" placeholder="lang" /></div>

      </div>

      <div v-if="activeDrawerField === 'appellation.name'">

        

          <div class="form-control w-full">

             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('appellation.name', 'name') }}</span><span class="text-accent font-black">*</span></label>

             <input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('appellation.name', '', 'plac')"/>

          </div>

          

          <div class="form-control w-full">

             <label class="label"><span class="label-text font-bold capitalize">lang</span></label>

               <input type="text" v-model="drawerForm['#lang']" class="input input-bordered w-full" placeholder="lang" />

             <label class="label"><span class="label-text font-bold capitalize">preferred</span></label>

               <input type="checkbox" v-model="drawerForm['#preferred']" class="checkbox checkbox-sm checkbox-primary" /></div>

      </div>

      <div v-if="activeDrawerField === 'actors'">

        <div class="grid grid-cols-1 gap-x-6">

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('actors.id', 'id') }}</span><span class="text-warning font-black">~</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('actors.id', 'Unique identifier of the creator of the heritage asset (e.g. artist, workshop, sculptor) or another involved person/organisation. If the creator is unknown or cannot be identified, this field can be left empty. Recommendation: use an authority file URI, e.g. GND or Wikidata for historical persons. Workshops as a collective or corporate author can also be given.', 'doc')" v-if="getLabel('actors.id', 'Unique identifier of the creator of the heritage asset (e.g. artist, workshop, sculptor) or another involved person/organisation. If the creator is unknown or cannot be identified, this field can be left empty. Recommendation: use an authority file URI, e.g. GND or Wikidata for historical persons. Workshops as a collective or corporate author can also be given.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

                        <input type="text"      v-model="drawerForm['id']" class="input input-bordered w-full validator " :placeholder="getLabel('actors.id', 'e.g. https://d-nb.info/gnd/119126893', 'plac')" />

              <div class="validator-hint">{{t('validationHint')}}</div>        

          

          </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('actors.name', 'name') }}</span><span class="text-warning font-black">~</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('actors.name', 'Name of the person or organisation related to the heritage asset – e.g. creator, workshop, conservator, custodian or curator.', 'doc')" v-if="getLabel('actors.name', 'Name of the person or organisation related to the heritage asset – e.g. creator, workshop, conservator, custodian or curator.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

                        <input type="text"      v-model="drawerForm['name']" class="input input-bordered w-full validator " :placeholder="getLabel('actors.name', 'e.g. Kallikrates', 'plac')" />

              <div class="validator-hint">{{t('validationHint')}}</div>        

          

          </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('actors.roles', 'roles') }}</span><span class="text-warning font-black">~</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('actors.roles', 'Role(s) of this person or organisation in relation to the heritage asset. An actor can have multiple roles at once. Examples: Creator, Custodian, Repository Manager, Curator, Conservator.', 'doc')" v-if="getLabel('actors.roles', 'Role(s) of this person or organisation in relation to the heritage asset. An actor can have multiple roles at once. Examples: Creator, Custodian, Repository Manager, Curator, Conservator.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

                        <input type="text" list="actor-roles-list" v-model="drawerForm['roles']" class="input input-bordered w-full" :placeholder="getLabel('actors.roles', 'e.g. Architect, Sculptor', 'plac')" />

                        <datalist id="actor-roles-list">

                          <option value="Kurator" />

                          <option value="Curator" />

                          <option value="Dokumentar" />

                          <option value="Documentation" />

                          <option value="Projektleitung" />

                          <option value="Project Management" />

                          <option value="Urheber / Schöpfer" />

                          <option value="Creator" />

                          <option value="Architekt" />

                          <option value="Architect" />

                          <option value="Bildhauer" />

                          <option value="Sculptor" />

                          <option value="Fotograf" />

                          <option value="Photographer" />

                          <option value="Restaurator / Konservator" />

                          <option value="Conservator" />

                          <option value="Verwahrer" />

                          <option value="Custodian" />

                        </datalist>

          

          </div></div>

      </div>

      <div v-if="activeDrawerField === 'characters.heritageAssetType'">

        

          <div class="form-control w-full">

             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('characters.heritageAssetType', 'heritageAssetType') }}</span><span class="text-accent font-black">*</span></label>

             <input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('characters.heritageAssetType', '', 'plac')"/>

          </div>

          

          <div class="form-control w-full">

             <label class="label"><span class="label-text font-bold capitalize">term</span></label>

               <input type="text" v-model="drawerForm['#term']" class="input input-bordered w-full" placeholder="term" />

             <label class="label"><span class="label-text font-bold capitalize">lang</span></label>

               <input type="text" v-model="drawerForm['#lang']" class="input input-bordered w-full" placeholder="lang" />

             <label class="label"><span class="label-text font-bold capitalize">namespace</span></label>

               <input type="text" v-model="drawerForm['#namespace']" class="input input-bordered w-full" placeholder="namespace" />

             <label class="label"><span class="label-text font-bold capitalize">termUID</span></label>

               <input type="text" v-model="drawerForm['#termUID']" class="input input-bordered w-full" placeholder="termUID" /></div>

      </div>

      <div v-if="activeDrawerField === 'characters.temporal'">

        <div class="grid grid-cols-1 gap-x-6">

        <div class="col-span-full border border-base-300 bg-base-100/50 p-5 rounded-box mb-6 mt-2">

        <div class=" items-center flex flex-row">

          <label class="label mb-2 pb-0">

            <span class="label-text font-bold text-lg capitalize">{{ getLabel('characters.temporal.timeSpan', 'timeSpan') }}</span>

          </label>

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('characters.temporal.timeSpan', '', 'doc')" v-if="getLabel('characters.temporal.timeSpan', '', 'doc')">

              <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

            <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                        fill="currentColor"

                        stroke-width="2.5"

                        stroke="currentColor"

                        class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

            </button>

            </div>

            </div>

              <!--        -->

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">  

        <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('characters.temporal.periodName', 'periodName') }}</span></label>



          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('characters.temporal.periodName', 'The name given to the historical period in which the object was created. Can be provided in multiple languages, with a preferred value indicated.', 'doc')" v-if="getLabel('characters.temporal.periodName', 'The name given to the historical period in which the object was created. Can be provided in multiple languages, with a preferred value indicated.', 'doc')">

            <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

          <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                      fill="currentColor" stroke-width="2.5" stroke="currentColor" class="size-[1.2em] primary-content"><path d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

            </button>

          </div>

          </div>

          <PeriodoAutocomplete :current-locale="currentLocale" v-model="drawerForm['periodName']" @select="handlePeriodoSelect" class="mb-2" />

          

        </div>

          <div class="grid grid-cols-1 gap-x-6">

            

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('characters.temporal.timeSpan.startDate', 'startDate') }}</span><span class="text-accent font-black">*</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('characters.temporal.timeSpan.startDate', 'Earliest date of the temporal classification of the heritage asset (not of the digitisation). Machine-readable date; negative values denote years BCE.', 'doc')" v-if="getLabel('characters.temporal.timeSpan.startDate', 'Earliest date of the temporal classification of the heritage asset (not of the digitisation). Machine-readable date; negative values denote years BCE.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

                        <input type="text"    pattern='^(-?[0-9]{1,})(?:-(0[1-9]|1[0-2])(?:-(0[1-9]|[12][0-9]|3[01]))?)?$' required v-model="drawerForm['timeSpan.startDate']" class="input input-bordered w-full validator " :placeholder="getLabel('characters.temporal.timeSpan.startDate', 'e.g. -500, 48, -7 or 2025', 'plac')" />

              <div class="validator-hint">{{t('validationHint')}}</div>        

          

          </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('characters.temporal.timeSpan.endDate', 'endDate') }}</span><span class="text-accent font-black">*</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('characters.temporal.timeSpan.endDate', 'Latest date of the temporal classification of the heritage asset (not of the digitisation). Machine-readable date; negative values denote years BCE.', 'doc')" v-if="getLabel('characters.temporal.timeSpan.endDate', 'Latest date of the temporal classification of the heritage asset (not of the digitisation). Machine-readable date; negative values denote years BCE.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

                        <input type="text"    pattern='^(-?[0-9]{1,})(?:-(0[1-9]|1[0-2])(?:-(0[1-9]|[12][0-9]|3[01]))?)?$' required v-model="drawerForm['timeSpan.endDate']" class="input input-bordered w-full validator " :placeholder="getLabel('characters.temporal.timeSpan.endDate', 'e.g. -400, 48, -7 or 2025', 'plac')" />

              <div class="validator-hint">{{t('validationHint')}}</div>        

          

          </div>

          </div>

          

        </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('characters.temporal.displayDate', 'displayDate') }}</span><span class="text-warning font-black">~</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('characters.temporal.displayDate', 'Human-readable date for display purposes in the UI. Can be provided in multiple languages, with a preferred value indicated.', 'doc')" v-if="getLabel('characters.temporal.displayDate', 'Human-readable date for display purposes in the UI. Can be provided in multiple languages, with a preferred value indicated.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

                        <input type="text"      v-model="drawerForm['displayDate']" class="input input-bordered w-full validator " :placeholder="getLabel('characters.temporal.displayDate', 'e.g. 3rd third of the 4th century BCE', 'plac')" />

              <div class="validator-hint">{{t('validationHint')}}</div>        

          

          </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('characters.temporal.scientificDate', 'scientificDate') }}</span><span class="text-warning font-black">~</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('characters.temporal.scientificDate', 'Date according to scientific dating methods (e.g. radiocarbon). Recorded precisely as received from the specialist laboratory, including error margin and lab code.', 'doc')" v-if="getLabel('characters.temporal.scientificDate', 'Date according to scientific dating methods (e.g. radiocarbon). Recorded precisely as received from the specialist laboratory, including error margin and lab code.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

                        <input type="text"      v-model="drawerForm['scientificDate']" class="input input-bordered w-full validator " :placeholder="getLabel('characters.temporal.scientificDate', 'e.g. 1250 BP ±30 (lab code PBN-1675)', 'plac')" />

              <div class="validator-hint">{{t('validationHint')}}</div>        

          

          </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">  

        <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('characters.temporal.scientificDateMethod', 'scientificDateMethod') }}</span><span class="text-warning font-black">~</span></label>



          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('characters.temporal.scientificDateMethod', 'Method used for the scientific dating given above.', 'doc')" v-if="getLabel('characters.temporal.scientificDateMethod', 'Method used for the scientific dating given above.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

                </button>

              </div>

              </div>

          <select v-model="drawerForm['scientificDateMethod']" class="select select-bordered w-full">

            <option disabled value="">{{ currentLocale === 'de' ? getLabel('characters.temporal.scientificDateMethod', 'scientificDateMethod') + ' ' + t('select') : t('select') + ' ' + getLabel('characters.temporal.scientificDateMethod', 'scientificDateMethod') }}</option>

            <template v-if="currentLocale === 'de'">

              <option value="Archäomagnetische Datierung">Archäomagnetische Datierung</option>

<option value="Dendrochronologie">Dendrochronologie</option>

<option value="Kalium-Argon-Datierung">Kalium-Argon-Datierung</option>

<option value="Klassifikation byzantinischer Münzen">Klassifikation byzantinischer Münzen</option>

<option value="Optisch datierte Lumineszenz (OSL)">Optisch datierte Lumineszenz (OSL)</option>

<option value="Radiokarbonmethode (C14)">Radiokarbonmethode (C14)</option>

<option value="Radiometrische Datierung">Radiometrische Datierung</option>

<option value="Textkritische Analyse">Textkritische Analyse</option>

<option value="Thermolumineszenzdatierung">Thermolumineszenzdatierung</option>

<option value="Untersuchung organischer Pigmente">Untersuchung organischer Pigmente</option>

<option value="Untersuchung von Keramikglasuren">Untersuchung von Keramikglasuren</option>

<option value="Vergleich mit archäologischen Funden">Vergleich mit archäologischen Funden</option>

            </template>

            <template v-else>

              <option value="Analysis of organic pigments">Analysis of organic pigments</option>

<option value="Archaeomagnetic dating">Archaeomagnetic dating</option>

<option value="Classification of Byzantine coins">Classification of Byzantine coins</option>

<option value="Comparison with archaeological finds">Comparison with archaeological finds</option>

<option value="Dendrochronology">Dendrochronology</option>

<option value="Examination of ceramic glazes">Examination of ceramic glazes</option>

<option value="Optically stimulated luminescence (OSL)">Optically stimulated luminescence (OSL)</option>

<option value="Potassium-argon dating">Potassium-argon dating</option>

<option value="Radiocarbon dating (C14)">Radiocarbon dating (C14)</option>

<option value="Radiometric dating">Radiometric dating</option>

<option value="Text-critical analysis">Text-critical analysis</option>

<option value="Thermoluminescence dating">Thermoluminescence dating</option>

            </template>

          </select>

          

        </div></div>

      </div>

      <div v-if="activeDrawerField === 'characters.materials'">

        

          <div class="form-control w-full">

             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('characters.materials', 'materials') }}</span><span class="text-accent font-black">*</span></label>

             <input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('characters.materials', '', 'plac')"/>

          </div>

          

          <div class="form-control w-full">

             <label class="label"><span class="label-text font-bold capitalize">lang</span></label>

               <input type="text" v-model="drawerForm['#lang']" class="input input-bordered w-full" placeholder="lang" /></div>

      </div>

      <div v-if="activeDrawerField === 'characters.inscriptions'">

        

          <div class="form-control w-full">

             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('characters.inscriptions', 'inscriptions') }}</span><span class="text-warning font-black">~</span></label>

             <textarea v-model="drawerForm['_value']" class="textarea textarea-bordered w-full h-24 mb-4" :placeholder="getLabel('characters.inscriptions', '', 'plac')"></textarea>

          </div>

          

          <div class="form-control w-full">

             <label class="label"><span class="label-text font-bold capitalize">lang</span></label>

               <input type="text" v-model="drawerForm['#lang']" class="input input-bordered w-full" placeholder="lang" />

             <label class="label"><span class="label-text font-bold capitalize">namespace</span></label>

               <input type="text" v-model="drawerForm['#namespace']" class="input input-bordered w-full" placeholder="namespace" />

             <label class="label"><span class="label-text font-bold capitalize">preferred</span></label>

               <input type="checkbox" v-model="drawerForm['#preferred']" class="checkbox checkbox-sm checkbox-primary" /></div>

      </div>

      <div v-if="activeDrawerField === 'characters.dimensions'">

        <div class="grid grid-cols-1 gap-x-6">

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">  

        <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('characters.dimensions.extent', 'extent') }}</span><span class="text-warning font-black">~</span></label>



          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('characters.dimensions.extent', 'Notes the part of the heritage asset being measured.', 'doc')" v-if="getLabel('characters.dimensions.extent', 'Notes the part of the heritage asset being measured.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

                </button>

              </div>

              </div>

          <select v-model="drawerForm['extent']" class="select select-bordered w-full">

            <option disabled value="">{{ currentLocale === 'de' ? getLabel('characters.dimensions.extent', 'extent') + ' ' + t('select') : t('select') + ' ' + getLabel('characters.dimensions.extent', 'extent') }}</option>

            <template v-if="currentLocale === 'de'">

              <option value="Artefakt">Artefakt</option>

<option value="Basis">Basis</option>

<option value="Säule">Säule</option>

<option value="Sockel">Sockel</option>

            </template>

            <template v-else>

              <option value="artifact">artifact</option>

<option value="base">base</option>

<option value="column">column</option>

<option value="pedestal">pedestal</option>

            </template>

          </select>

          

        </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">  

        <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('characters.dimensions.measurementType', 'measurementType') }}</span><span class="text-warning font-black">~</span></label>



          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('characters.dimensions.measurementType', 'Indicates the type of measurement.', 'doc')" v-if="getLabel('characters.dimensions.measurementType', 'Indicates the type of measurement.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

                </button>

              </div>

              </div>

          <select v-model="drawerForm['measurementType']" class="select select-bordered w-full">

            <option disabled value="">{{ currentLocale === 'de' ? getLabel('characters.dimensions.measurementType', 'measurementType') + ' ' + t('select') : t('select') + ' ' + getLabel('characters.dimensions.measurementType', 'measurementType') }}</option>

            <template v-if="currentLocale === 'de'">

              <option value="Breite">Breite</option>

<option value="Durchmesser">Durchmesser</option>

<option value="Gewicht">Gewicht</option>

<option value="Höhe">Höhe</option>

<option value="Länge">Länge</option>

<option value="Tiefe">Tiefe</option>

<option value="Umfang">Umfang</option>

            </template>

            <template v-else>

              <option value="Circumference">Circumference</option>

<option value="Depth">Depth</option>

<option value="Diameter">Diameter</option>

<option value="Height">Height</option>

<option value="Length">Length</option>

<option value="Weight">Weight</option>

<option value="Width">Width</option>

            </template>

          </select>

          

        </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">  

        <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('characters.dimensions.units', 'units') }}</span><span class="text-warning font-black">~</span></label>



          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('characters.dimensions.units', 'Gives the unit of measurement.', 'doc')" v-if="getLabel('characters.dimensions.units', 'Gives the unit of measurement.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

                </button>

              </div>

              </div>

          <select v-model="drawerForm['units']" class="select select-bordered w-full">

            <option disabled value="">{{ currentLocale === 'de' ? getLabel('characters.dimensions.units', 'units') + ' ' + t('select') : t('select') + ' ' + getLabel('characters.dimensions.units', 'units') }}</option>

            <template v-if="currentLocale === 'de'">

              <option value="Gramm">Gramm</option>

<option value="Kilogramm">Kilogramm</option>

<option value="Meter">Meter</option>

<option value="Millimeter">Millimeter</option>

<option value="Zentimeter">Zentimeter</option>

            </template>

            <template v-else>

              <option value="Gramm">Gramm</option>

<option value="Kilogramm">Kilogramm</option>

<option value="Meter">Meter</option>

<option value="Millimeter">Millimeter</option>

<option value="Zentimeter">Zentimeter</option>

            </template>

          </select>

          

        </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('characters.dimensions.scale', 'scale') }}</span><span class="text-warning font-black">~</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('characters.dimensions.scale', 'Scale information, if relevant – e.g. for models, replicas or scaled representations. For original objects at original size, this field can be left empty.', 'doc')" v-if="getLabel('characters.dimensions.scale', 'Scale information, if relevant – e.g. for models, replicas or scaled representations. For original objects at original size, this field can be left empty.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

                        <input type="text" v-model="drawerForm['scale']" class="input input-bordered w-full" :placeholder="getLabel('characters.dimensions.scale', 'e.g. 1:10 (relevant for models/replicas only)', 'plac')" />

          </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('characters.dimensions.value', 'value') }}</span><span class="text-warning font-black">~</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('characters.dimensions.value', 'Numerical measurement value in the specified unit.', 'doc')" v-if="getLabel('characters.dimensions.value', 'Numerical measurement value in the specified unit.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

                        <input type="text" inputmode="decimal" v-model="drawerForm['value']" class="input input-bordered w-full" :placeholder="getLabel('characters.dimensions.value', 'e.g. 118 | 56 | 59 | 40 oder 1,9', 'plac')" />

          </div></div>

      </div>

      <div v-if="activeDrawerField === 'spatial'">

        <div class="grid grid-cols-1 gap-x-6">

        <div class="col-span-full border border-base-300 bg-base-100/50 p-5 rounded-box mb-6 mt-2">

        <div class=" items-center flex flex-row">

          <label class="label mb-2 pb-0">

            <span class="label-text font-bold text-lg capitalize">{{ getLabel('spatial.locationSet', 'locationSet') }}</span>

          </label>

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('spatial.locationSet', '', 'doc')" v-if="getLabel('spatial.locationSet', '', 'doc')">

              <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

            <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                        fill="currentColor"

                        stroke-width="2.5"

                        stroke="currentColor"

                        class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

            </button>

            </div>

            </div>

              <!--        -->

          <!-- Auswahl: Historischer Name vs. Moderner Ortsname -->

          <div class="tabs tabs-boxed bg-base-200/80 p-1 mb-4 flex">

            <button

              type="button"

              class="tab tab-sm flex-1 gap-1.5 font-semibold transition-all"

              :class="spatialKind === 'historical' ? 'tab-active !bg-warning !text-warning-content shadow-sm' : 'text-base-content/70 hover:text-base-content'"

              @click="setSpatialKind('historical')"

            >

              🏛️ {{ currentLocale === 'de' ? 'Historischer Name / Fundort' : 'Historical Name / Findspot' }}

            </button>

            <button

              type="button"

              class="tab tab-sm flex-1 gap-1.5 font-semibold transition-all"

              :class="spatialKind === 'modern' ? 'tab-active !bg-info !text-info-content shadow-sm' : 'text-base-content/70 hover:text-base-content'"

              @click="setSpatialKind('modern')"

            >

              🌍 {{ currentLocale === 'de' ? 'Moderner Ortsname / Geodaten' : 'Modern Location / Geodata' }}

            </button>

          </div>



          <!-- FALL 1: HISTORISCHER NAME (Geospatial Area entfällt) -->

          <div v-if="spatialKind === 'historical'" class="grid grid-cols-1 gap-x-6">

            <div class="alert alert-warning/15 border border-warning/30 p-3 rounded-xl mb-3 flex items-start gap-2.5">

              <span class="text-base">🏛️</span>

              <div class="text-xs">

                <div class="font-bold text-base-content">

                  {{ currentLocale === 'de' ? 'Historischer Name / Antiker Fundort' : 'Historical Name / Ancient Findspot' }}

                </div>

                <div class="text-base-content/70 text-[11px] mt-0.5">

                  {{ currentLocale === 'de' 

                    ? 'Für historische Namen entfallen moderne geopolitische Einheiten (Land / Region). Fundorte können direkt über Pleiades oder die interaktive Karte georeferenziert werden.' 

                    : 'For historical names, modern geopolitical areas (country/region) are omitted. Findspots can be georeferenced via Pleiades or the map.' }}

                </div>

              </div>

            </div>



            <div class="form-control w-full mb-4">

              <label class="label pb-1.5">

                <span class="label-text font-bold">{{ getLabel('spatial.locationSet.historicalName', 'Historischer Name') }}</span>

                <span class="text-accent font-black">*</span>

              </label>

              <input

                type="text"

                required

                v-model="drawerForm['locationSet.historicalName']"

                @input="onHistoricalNameInput"

                class="input input-bordered w-full font-medium"

                :placeholder="getLabel('spatial.locationSet.historicalName', 'z.B. Pergamon, Troia, Olympia, Konstantinopel', 'plac')"

              />

              <!-- Autocomplete Pleiades / DAI -->

              <div class="mt-2.5">

                <PlaceAutocomplete

                  input-id="heritage-spatial-place-hist"

                  allowed-modes="ancient"

                  default-mode="ancient"

                  :placeholder="currentLocale === 'de' ? 'Antiken Fundort suchen (Pleiades / DAI)...' : 'Search ancient findspot (Pleiades / DAI)...'"

                  @select="handleSpatialPlaceSelect"

                />

              </div>

            </div>

          </div>



          <!-- FALL 2: MODERNER ORT (Geospatial Area wird automatisch ausgefüllt) -->

          <div v-else class="grid grid-cols-1 gap-x-6">

            <div class="form-control w-full mb-3">

              <label class="label pb-1.5">

                <span class="label-text font-bold">{{ getLabel('spatial.locationSet.namedLocation', 'Moderner Ortsname') }}</span>

                <span class="text-accent font-black">*</span>

              </label>

              <input

                type="text"

                required

                v-model="drawerForm['locationSet.namedLocation']"

                @input="onModernLocationInput"

                class="input input-bordered w-full font-medium"

                :placeholder="getLabel('spatial.locationSet.namedLocation', 'z.B. Berlin, Athen, Bergama, Rom', 'plac')"

              />

              <!-- Autocomplete GeoNames / OSM -->

              <div class="mt-2.5">

                <PlaceAutocomplete

                  input-id="heritage-spatial-place-modern"

                  allowed-modes="modern"

                  default-mode="modern"

                  :placeholder="currentLocale === 'de' ? 'Modernen Ort suchen (GeoNames / OSM)...' : 'Search modern place (GeoNames / OSM)...'"

                  @select="handleSpatialPlaceSelect"

                />

              </div>

            </div>



            <!-- Automatisch ausgefüllter geopolitischer Bereich -->

            <div class="alert alert-info/15 border border-info/30 p-3 rounded-xl flex items-center justify-between gap-3 mb-3">

              <div class="flex items-center gap-2.5 min-w-0">

                <span class="text-lg shrink-0">🌍</span>

                <div class="min-w-0">

                  <div class="text-[10px] font-bold uppercase tracking-wider text-base-content/60">

                    {{ currentLocale === 'de' ? 'Geopolitischer Bereich (automatisch ausgefüllt)' : 'Geopolitical Area (auto-filled)' }}

                  </div>

                  <div class="text-sm font-semibold truncate">

                    <span v-if="drawerForm['locationSet.geopoliticalArea']" class="text-info font-bold">

                      {{ drawerForm['locationSet.geopoliticalArea'] }}

                    </span>

                    <span v-else class="text-base-content/40 italic font-normal text-xs">

                      {{ currentLocale === 'de' ? 'Wird anhand der Ortsangabe ermittelt...' : 'Determined from place name...' }}

                    </span>

                    <span v-if="drawerForm['locationSet.geopoliticalAreaType']" class="badge badge-info/20 text-info badge-xs ml-1.5 font-normal">

                      {{ drawerForm['locationSet.geopoliticalAreaType'] }}

                    </span>

                  </div>

                </div>

              </div>

              <button

                type="button"

                class="btn btn-xs btn-ghost border border-base-300 shrink-0 text-[11px]"

                @click="showManualGeoFields = !showManualGeoFields"

              >

                {{ showManualGeoFields ? (currentLocale === 'de' ? 'Ausblenden' : 'Hide') : (currentLocale === 'de' ? 'Manuell anpassen' : 'Edit') }}

              </button>

            </div>



            <!-- Optionale manuelle Anpassung für Geopolitical Area -->

            <div v-if="showManualGeoFields" class="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-base-200/50 rounded-xl border border-base-300 mb-3">

              <div class="form-control w-full">

                <label class="label py-1">

                  <span class="label-text font-semibold text-xs">{{ getLabel('spatial.locationSet.geopoliticalArea', 'Geopolitischer Bereich') }}</span>

                </label>

                <input

                  type="text"

                  v-model="drawerForm['locationSet.geopoliticalArea']"

                  class="input input-sm input-bordered w-full"

                  :placeholder="getLabel('spatial.locationSet.geopoliticalArea', 'z.B. Deutschland, Griechenland', 'plac')"

                />

              </div>

              <div class="form-control w-full">

                <label class="label py-1">

                  <span class="label-text font-semibold text-xs">{{ getLabel('spatial.locationSet.geopoliticalAreaType', 'Typ') }}</span>

                </label>

                <input

                  type="text"

                  v-model="drawerForm['locationSet.geopoliticalAreaType']"

                  class="input input-sm input-bordered w-full"

                  :placeholder="getLabel('spatial.locationSet.geopoliticalAreaType', 'e.g. country', 'plac')"

                />

              </div>

            </div>

          </div>

          

        </div>

        <div class="col-span-full border border-base-300 bg-base-100/50 p-5 rounded-box mb-6 mt-2">

        <div class=" items-center flex flex-row">

          <label class="label mb-2 pb-0">

            <span class="label-text font-bold text-lg capitalize">{{ getLabel('spatial.geometry', 'geometry') }}</span>

          </label>

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('spatial.geometry', '', 'doc')" v-if="getLabel('spatial.geometry', '', 'doc')">

              <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

            <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                        fill="currentColor"

                        stroke-width="2.5"

                        stroke="currentColor"

                        class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

            </button>

            </div>

            </div>

              <!--        -->

          <div class="grid grid-cols-1 gap-x-6">

            

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('spatial.geometry.spatialReferenceSystem', 'spatialReferenceSystem') }}</span><span class="text-warning font-black">~</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('spatial.geometry.spatialReferenceSystem', 'Coordinate reference system for the following geometry information. Mandatory where coordinates are provided.', 'doc')" v-if="getLabel('spatial.geometry.spatialReferenceSystem', 'Coordinate reference system for the following geometry information. Mandatory where coordinates are provided.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

                        <input type="text"      v-model="drawerForm['geometry.spatialReferenceSystem']" class="input input-bordered w-full validator " :placeholder="getLabel('spatial.geometry.spatialReferenceSystem', 'e.g. EPSG:4326 (WGS84)', 'plac')" />

              <div class="validator-hint">{{t('validationHint')}}</div>        

          

          </div>

        <div class="col-span-full border border-base-300 bg-base-100/50 p-5 rounded-box mb-6 mt-2">

        <div class=" items-center flex flex-row">

          <label class="label mb-2 pb-0">

            <span class="label-text font-bold text-lg capitalize">{{ getLabel('spatial.geometry.quickpoint', 'quickpoint') }}</span>

          </label>

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('spatial.geometry.quickpoint', 'this is the centre point', 'doc')" v-if="getLabel('spatial.geometry.quickpoint', 'this is the centre point', 'doc')">

              <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

            <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                        fill="currentColor"

                        stroke-width="2.5"

                        stroke="currentColor"

                        class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

            </button>

            </div>

            </div>

              <!--       <div class="text-sm text-base-content/60 mb-4 px-1">{{ getLabel('spatial.geometry.quickpoint', 'this is the centre point', 'doc') }}</div> -->

          <div class="grid grid-cols-1 gap-x-6">

            <!-- Interaktive Karte zur Fundort-Auswahl und Prüfung -->

            <div class="col-span-full mb-3">

              <SpatialMapPicker

                :current-locale="currentLocale"

                :lat="drawerForm['geometry.quickpoint.y']"

                :lng="drawerForm['geometry.quickpoint.x']"

                :location-name="drawerForm['locationSet.namedLocation'] || drawerForm['locationSet.historicalName']"

                @update:lat="(v) => drawerForm['geometry.quickpoint.y'] = v"

                @update:lng="(v) => drawerForm['geometry.quickpoint.x'] = v"

                @change="onDrawerMapCoordsChange"

                height="220px"

              />

            </div>

            

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('spatial.geometry.quickpoint.x', 'x') }}</span><span class="text-warning font-black">~</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('spatial.geometry.quickpoint.x', 'X coordinate of the centre point according to the spatial coordinate system in use.', 'doc')" v-if="getLabel('spatial.geometry.quickpoint.x', 'X coordinate of the centre point according to the spatial coordinate system in use.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

                        <input type="number"  step=".00000001"    v-model="drawerForm['geometry.quickpoint.x']" class="input input-bordered w-full validator [&::-webkit-inner-spin-button]:appearance-none" :placeholder="getLabel('spatial.geometry.quickpoint.x', 'e.g. 23.7275 (longitude in WGS84)', 'plac')" />

              <div class="validator-hint">{{t('validationHint')}}</div>        

          

          </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('spatial.geometry.quickpoint.y', 'y') }}</span><span class="text-warning font-black">~</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('spatial.geometry.quickpoint.y', 'Y coordinate of the centre point according to the spatial coordinate system in use.', 'doc')" v-if="getLabel('spatial.geometry.quickpoint.y', 'Y coordinate of the centre point according to the spatial coordinate system in use.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

                        <input type="number"  step=".00000001"    v-model="drawerForm['geometry.quickpoint.y']" class="input input-bordered w-full validator [&::-webkit-inner-spin-button]:appearance-none" :placeholder="getLabel('spatial.geometry.quickpoint.y', 'e.g. 37.9838 (latitude in WGS84)', 'plac')" />

              <div class="validator-hint">{{t('validationHint')}}</div>        

          

          </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('spatial.geometry.quickpoint.z', 'z') }}</span><span class="text-warning font-black">~</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('spatial.geometry.quickpoint.z', 'Height of the centre point, e.g. metres above sea level.', 'doc')" v-if="getLabel('spatial.geometry.quickpoint.z', 'Height of the centre point, e.g. metres above sea level.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

                        <input type="number"  step=".00000001"    v-model="drawerForm['geometry.quickpoint.z']" class="input input-bordered w-full validator [&::-webkit-inner-spin-button]:appearance-none" :placeholder="getLabel('spatial.geometry.quickpoint.z', 'e.g. 70 (metres above sea level)', 'plac')" />

              <div class="validator-hint">{{t('validationHint')}}</div>        

          

          </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('spatial.geometry.quickpoint.accuracy', 'accuracy') }}</span><span class="text-warning font-black">~</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('spatial.geometry.quickpoint.accuracy', 'The accuracy of the given point in metres, as free text.', 'doc')" v-if="getLabel('spatial.geometry.quickpoint.accuracy', 'The accuracy of the given point in metres, as free text.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

                        <input type="text"      v-model="drawerForm['geometry.quickpoint.accuracy']" class="input input-bordered w-full validator " :placeholder="getLabel('spatial.geometry.quickpoint.accuracy', 'e.g. ±5 m', 'plac')" />

              <div class="validator-hint">{{t('validationHint')}}</div>        

          

          </div>

          </div>

          

        </div>

          </div>

          

        </div></div>

      </div>

      <div v-if="activeDrawerField === 'references'">

        <div class="grid grid-cols-1 gap-x-6">

        <div class="col-span-full border border-base-300 bg-base-100/50 p-5 rounded-box mb-6 mt-2">

        <div class=" items-center flex flex-row">

          <label class="label mb-2 pb-0">

            <span class="label-text font-bold text-lg capitalize">{{ getLabel('references.appellation', 'appellation') }}</span>

          </label>

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('references.appellation', 'The ID and name given to the information source.', 'doc')" v-if="getLabel('references.appellation', 'The ID and name given to the information source.', 'doc')">

              <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

            <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                        fill="currentColor"

                        stroke-width="2.5"

                        stroke="currentColor"

                        class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

            </button>

            </div>

            </div>

              <!--       <div class="text-sm text-base-content/60 mb-4 px-1">{{ getLabel('references.appellation', 'The ID and name given to the information source.', 'doc') }}</div> -->

          <div class="grid grid-cols-1 gap-x-6">

            

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('references.appellation.id', 'id') }}</span><span class="text-warning font-black">~</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('references.appellation.id', 'Unique ID or URI assigned to the cited information source.', 'doc')" v-if="getLabel('references.appellation.id', 'Unique ID or URI assigned to the cited information source.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

                        <input type="text"      v-model="drawerForm['appellation.id']" class="input input-bordered w-full validator " :placeholder="getLabel('references.appellation.id', 'e.g. https://doi.org/10.11588/diglit.3456', 'plac')" />

              <div class="validator-hint">{{t('validationHint')}}</div>        

          

          </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('references.appellation.name', 'name') }}</span><span class="text-warning font-black">~</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('references.appellation.name', 'The name or title given to the cited information source.', 'doc')" v-if="getLabel('references.appellation.name', 'The name or title given to the cited information source.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

                        <input type="text"      v-model="drawerForm['appellation.name']" class="input input-bordered w-full validator " :placeholder="getLabel('references.appellation.name', 'e.g. Description of ancient sculptures excluding the Pergamon finds', 'plac')" />

              <div class="validator-hint">{{t('validationHint')}}</div>        

          

          </div>

          </div>

          

        </div>

        <div class="col-span-full border border-base-300 bg-base-100/50 p-5 rounded-box mb-6 mt-2">

        <div class=" items-center flex flex-row">

          <label class="label mb-2 pb-0">

            <span class="label-text font-bold text-lg capitalize">{{ getLabel('references.actors', 'actors') }}</span>

          </label>

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('references.actors', '(creator, author, contributor, editor, etc.)', 'doc')" v-if="getLabel('references.actors', '(creator, author, contributor, editor, etc.)', 'doc')">

              <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

            <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                        fill="currentColor"

                        stroke-width="2.5"

                        stroke="currentColor"

                        class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

            </button>

            </div>

            </div>

              <!--       <div class="text-sm text-base-content/60 mb-4 px-1">{{ getLabel('references.actors', '(creator, author, contributor, editor, etc.)', 'doc') }}</div> -->

          <div class="grid grid-cols-1 gap-x-6">

            

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('references.actors.id', 'id') }}</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('references.actors.id', 'Unique ID of the person or organisation involved in the cited source (e.g. author, publisher).', 'doc')" v-if="getLabel('references.actors.id', 'Unique ID of the person or organisation involved in the cited source (e.g. author, publisher).', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

                        <input type="text"      v-model="drawerForm['actors.id']" class="input input-bordered w-full validator " :placeholder="getLabel('references.actors.id', 'e.g. https://d-nb.info/gnd/2015909-2', 'plac')" />

              <div class="validator-hint">{{t('validationHint')}}</div>        

          

          </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('references.actors.name', 'name') }}</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('references.actors.name', 'The name of the person or organization)', 'doc')" v-if="getLabel('references.actors.name', 'The name of the person or organization)', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

                        <input type="text"      v-model="drawerForm['actors.name']" class="input input-bordered w-full validator " :placeholder="getLabel('references.actors.name', '', 'plac')" />

              <div class="validator-hint">{{t('validationHint')}}</div>        

          

          </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">  

        <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('references.actors.roles', 'roles') }}</span></label>



          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('references.actors.roles', 'The roles of the actor (creator, custodian, repository manager, curator, architect, sculptor, photographer, compiler, etc.). Use of a controlled vocabulary such as the Getty Art and Architecture thesaurus is recommended; the vocabulary used should be indicated using an attribute.', 'doc')" v-if="getLabel('references.actors.roles', 'The roles of the actor (creator, custodian, repository manager, curator, architect, sculptor, photographer, compiler, etc.). Use of a controlled vocabulary such as the Getty Art and Architecture thesaurus is recommended; the vocabulary used should be indicated using an attribute.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

                </button>

              </div>

              </div>

          <select v-model="drawerForm['actors.roles']" class="select select-bordered w-full">

            <option disabled value="">{{ currentLocale === 'de' ? getLabel('references.actors.roles', 'roles') + ' ' + t('select') : t('select') + ' ' + getLabel('references.actors.roles', 'roles') }}</option>

            <template v-if="currentLocale === 'de'">

              <option value="Architekt">Architekt</option>

<option value="Bearbeiter">Bearbeiter</option>

<option value="Betreuer">Betreuer</option>

<option value="Bildhauer">Bildhauer</option>

<option value="Ersteller">Ersteller</option>

<option value="Fotograf">Fotograf</option>

<option value="Kurator">Kurator</option>

<option value="Repository-Manager">Repository-Manager</option>

            </template>

            <template v-else>

              <option value="Architect">Architect</option>

<option value="Creator">Creator</option>

<option value="Curator">Curator</option>

<option value="Custodian">Custodian</option>

<option value="Editor">Editor</option>

<option value="Photographer">Photographer</option>

<option value="Repository manager">Repository manager</option>

<option value="Sculptor">Sculptor</option>

            </template>

          </select>

          

        </div>

          </div>

          

        </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">  

        <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('references.type', 'type') }}</span></label>



          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('references.type', 'The type of the cited source.', 'doc')" v-if="getLabel('references.type', 'The type of the cited source.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

                </button>

              </div>

              </div>

          <select v-model="drawerForm['type']" class="select select-bordered w-full">

            <option disabled value="">{{ currentLocale === 'de' ? getLabel('references.type', 'type') + ' ' + t('select') : t('select') + ' ' + getLabel('references.type', 'type') }}</option>

            <template v-if="currentLocale === 'de'">

              <option value="Archiv">Archiv</option>

<option value="Artikel">Artikel</option>

<option value="Buch">Buch</option>

<option value="Datei">Datei</option>

<option value="Datensatz">Datensatz</option>

<option value="Kapitel">Kapitel</option>

            </template>

            <template v-else>

              <option value="Archive">Archive</option>

<option value="Article">Article</option>

<option value="Book">Book</option>

<option value="Chapter">Chapter</option>

<option value="File">File</option>

<option value="Record">Record</option>

            </template>

          </select>

          

        </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('references.rights', 'rights') }}</span><span class="text-accent font-black">*</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('references.rights', 'Rights information relating to this cited source.', 'doc')" v-if="getLabel('references.rights', 'Rights information relating to this cited source.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

                        <input type="text"     required v-model="drawerForm['rights']" class="input input-bordered w-full validator " :placeholder="getLabel('references.rights', 'e.g. This object is protected by copyright but freely accessible ...', 'plac')" />

              <div class="validator-hint">{{t('validationHint')}}</div>        

          

          </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('references.note', 'note') }}</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('references.note', 'Additional note on the cited source.', 'doc')" v-if="getLabel('references.note', 'Additional note on the cited source.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

          <textarea v-model="drawerForm['note']" class="textarea textarea-bordered w-full h-24" :placeholder="getLabel('references.note', 'e.g. Second, revised edition', 'plac')"></textarea>

          

        </div>

        <div class="form-control w-full mb-4">

        <div class="flex flex-row items-center">

          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('references.link', 'link') }}</span><span class="text-warning font-black">~</span></label>

          

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('references.link', 'Direct link to the cited resource.', 'doc')" v-if="getLabel('references.link', 'Direct link to the cited resource.', 'doc')">

                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">

              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 

                          fill="currentColor"

                          stroke-width="2.5"

                          stroke="currentColor"

                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>

              </button>

              </div>

              </div>

                        <input type="url"   pattern="[Hh][Tt][Tt][Pp][Ss]?://(?:(?:[a-zA-Z¡-￿0-9]+-?)*[a-zA-Z¡-￿0-9]+)(?:.(?:[a-zA-Z¡-￿0-9]+-?)*[a-zA-Z¡-￿0-9]+)*(?:.(?:[a-zA-Z¡-￿]{2,}))(?::d{2,5})?(?:/[^s]*)?"   v-model="drawerForm['link']" class="input input-bordered w-full validator " :placeholder="getLabel('references.link', 'e.g. https://doi.org/10.11588/diglit.3456#0291', 'plac')" />

              <div class="validator-hint">{{t('validationHint')}}</div>        

          

          </div></div>

      </div>

      <div v-if="activeDrawerField === 'hasRepresentation'">

        

          <div class="form-control w-full">

             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('hasRepresentation', 'hasRepresentation') }}</span><span class="text-warning font-black">~</span></label>

             <input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('hasRepresentation', '', 'plac')"/>

          </div>

          

          <div class="form-control w-full"></div>

      </div>

      <div v-if="activeDrawerField === 'isSuccessorOf'">

        

          <div class="form-control w-full">

             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('isSuccessorOf', 'isSuccessorOf') }}</span><span class="text-warning font-black">~</span></label>

             <input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('isSuccessorOf', '', 'plac')"/>

          </div>

          

          <div class="form-control w-full"></div>

      </div>

      <div v-if="activeDrawerField === 'wasPresentAt'">

        

          <div class="form-control w-full">

             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('wasPresentAt', 'wasPresentAt') }}</span><span class="text-warning font-black">~</span></label>

             <input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('wasPresentAt', '', 'plac')"/>

          </div>

          

          <div class="form-control w-full"></div>

      </div>

      <div v-if="activeDrawerField === 'hasPart'">

        

          <div class="form-control w-full">

             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('hasPart', 'hasPart') }}</span><span class="text-warning font-black">~</span></label>

             <input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('hasPart', '', 'plac')"/>

          </div>

          

          <div class="form-control w-full"></div>

      </div>

      <div v-if="activeDrawerField === 'isPartOf'">

        

          <div class="form-control w-full">

             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('isPartOf', 'isPartOf') }}</span><span class="text-warning font-black">~</span></label>

             <input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('isPartOf', '', 'plac')"/>

          </div>

          

          <div class="form-control w-full"></div>

      </div>

      <div v-if="activeDrawerField === 'isReplicaOf'">

        

          <div class="form-control w-full">

             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('isReplicaOf', 'isReplicaOf') }}</span><span class="text-warning font-black">~</span></label>

             <input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('isReplicaOf', '', 'plac')"/>

          </div>

          

          <div class="form-control w-full"></div>

      </div>

      <div v-if="activeDrawerField === 'wasDigitizedBy'">

        

          <div class="form-control w-full">

             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('wasDigitizedBy', 'wasDigitizedBy') }}</span><span class="text-warning font-black">~</span></label>

             <input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('wasDigitizedBy', '', 'plac')"/>

          </div>

          

          <div class="form-control w-full"></div>

      </div>

      <div v-if="activeDrawerField === 'dcRelation'">

        

          <div class="form-control w-full">

             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('dcRelation', 'dcRelation') }}</span></label>

             <label class="input validator input-bordered w-full">

                  <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">

                    <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">

                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>

                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>

                    </g>

                  </svg>

                  <input type="url" required placeholder="https://" v-model="drawerForm['_value']" pattern="[Hh][Tt][Tt][Pp][Ss]?://(?:(?:[a-zA-Z¡-￿0-9]+-?)*[a-zA-Z¡-￿0-9]+)(?:.(?:[a-zA-Z¡-￿0-9]+-?)*[a-zA-Z¡-￿0-9]+)*(?:.(?:[a-zA-Z¡-￿]{2,}))(?::d{2,5})?(?:/[^s]*)?" title="Must be valid URI"  />

                </label>

                <p class="validator-hint">Must be valid URI</p>

          </div>

          

          <div class="form-control w-full"></div>

      </div>

            <div class="sticky bottom-0 bg-base-100/95 backdrop-blur-md border-t border-base-200 pt-3 pb-2 -mx-6 px-6 mt-6 z-20">

              <button type="submit" class="btn btn-primary w-full shadow-md">{{ t('saveToList') }}</button>

            </div>

          </form>

        </div>

      </div>

    </div>

  </div>

  <PersonPickerModal

    :isOpen="isPersonPickerOpen"

    :mode="personPickerMode"

    :currentItems="personPickerMode === 'actors' ? form['actors'] : form['recordInformation.creation.contacts']"

    @close="isPersonPickerOpen = false"

    @select="handlePersonsSelected"

  />

  <OrganizationPickerModal

    :isOpen="isOrgPickerOpen"

    mode="pick"

    :current-locale="currentLocale"

    @close="isOrgPickerOpen = false"

    @select="handleOrgSelected"

  />

  <dialog ref="templateModal" class="modal">

    <div class="modal-box max-w-md">

      <h3 class="font-bold text-lg mb-6">{{ currentLocale === 'de' ? 'Vorlage wählen' : 'Choose a Template' }}</h3>

      <form method="dialog" class="flex flex-col gap-3">

        <div v-for="(tpl, idx) in templates[activeTemplateField] || []" :key="idx" class="join w-full">

          <button type="button" class="btn btn-outline justify-start font-normal flex-1 join-item"

            @click="applyTemplate(tpl.data)">

            {{ tpl.name }}

          </button>

          <button type="button" class="btn btn-outline btn-error join-item"

            @click.prevent="confirmDeleteTemplate(activeTemplateField, idx)">

            <svg class="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">

              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />

            </svg>

          </button>

        </div>

        <div v-if="!(templates[activeTemplateField] && templates[activeTemplateField].length > 0)"

          class="text-sm italic opacity-50 py-4">{{ t('noItems') }}</div>

      </form>

      <div class="divider my-6">{{ t('or') }}</div>

      <div class="modal-action w-full mt-0">

        <form method="dialog" class="w-full">

          <button type="button" class="btn btn-primary w-full">

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-1">

              <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />

            </svg>

            {{ t('customEdit') }}

          </button>

        </form>

      </div>

    </div>

    <form method="dialog" class="modal-backdrop"><button>close</button></form>

  </dialog>

  <dialog ref="addTemplateModal" class="modal">

    <div class="modal-box max-w-md">

      <h3 class="font-bold text-lg mb-6">{{ t('addtemplate') }}</h3>

      <div class="flex flex-col gap-4">

        <input type="text" v-model="newTemplateName" :placeholder="t('templateName')" class="input input-bordered w-full" />

        <div class="modal-action mt-2 w-full">

          <form method="dialog" class="w-full">

            <button type="button" class="btn btn-primary w-full" @click="addTemplate()" :disabled="!newTemplateName">{{ t('addtemplate') }}</button>

          </form>

        </div>

      </div>

    </div>

    <form method="dialog" class="modal-backdrop"><button>close</button></form>

  </dialog>

  <dialog ref="deleteTemplateModal" class="modal">

    <div class="modal-box">

      <h3 class="font-bold text-lg">{{ t('deleteTemplatePrompt') }}</h3>

      <p class="py-4">{{ t('deleteTemplateDesc') }}</p>

      <div class="modal-action">

        <form method="dialog" class="flex gap-2">

          <button type="button" class="btn btn-ghost">{{ t('cancel') }}</button>

          <button type="button" class="btn btn-error" @click="executeDeleteTemplate">{{ t('del') }}</button>

        </form>

      </div>

    </div>

    <form method="dialog" class="modal-backdrop"><button>close</button></form>

  </dialog>

</template>



<script setup>

import { ref, reactive, computed, inject, shallowRef, onMounted, onBeforeUnmount, watch } from 'vue';

import { load } from '@tauri-apps/plugin-store';

import SkosmosAutocomplete from '../components/SkosmosAutocomplete.vue';

import PeriodoAutocomplete from '../components/PeriodoAutocomplete.vue';

import HectorMaterialInput from '../components/HectorMaterialInput.vue';

import HectorMonumentTypeInput from '../components/HectorMonumentTypeInput.vue';

import PersonPickerModal from '../components/PersonPickerModal.vue';

import OrganizationPickerModal from '../components/OrganizationPickerModal.vue';

import InstitutionAutocomplete from '../components/InstitutionAutocomplete.vue';

import PlaceAutocomplete from '../components/PlaceAutocomplete.vue';

import SpatialMapPicker from '../components/SpatialMapPicker.vue';

import HeritageAssetDcRelations from '../components/HeritageAssetDcRelations.vue';

import LanguageBadgePicker from '../components/LanguageBadgePicker.vue';

import { 

  savedOrganizations,
  recentOrganizations,
  recordRecentOrganization,
  defaultMetadataLanguage, 

  globalRights, 

  saveGlobalRights, 

  savedContacts, 

  savedActors, 

  savedPersons, 

  savedSpatial,

  addSavedContact, 

  addSavedActor, 

  addOrUpdatePerson, 

  addOrUpdateSavedSpatial,

  removeSavedSpatial,

  formatGeopoliticalCountry,

  resolveGeopoliticalArea,

  normalizeYearDate, 

  CC_LICENCES, 

  resolveLicenceUri, 

  collectionInstitution, 

  updateProjectHeritageAssets,

  projectDigitalResources,

  projectActivities,

  campaignPreset,

  applyCampaignToHeritageAsset,

  incrementStringNumber,

  getLicenceShortCode

} from '../utils/sharedState.js';



const currentLocale = inject('currentLocale', ref('en'));

const fieldLabels = {

  "recordInformation": {

    "en": "Record information",

    "de": "Datensatzinformationen",

    "docEn": "The ID, language, creation information and other metadata describing the record. The ID element of this information block holds the ID assigned by the content provider.",

    "docDe": "Die ID, Sprache, Erstellungsinformationen und andere Metadaten, die den Datensatz beschreiben. Das ID-Element dieses Informationsblocks enthält die vom Datenanbieter zugewiesene ID.",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.id": {

    "en": "Record ID",

    "de": "Datensatz-ID",

    "docEn": "Unique ID of the record in the content provider\\'s system. Mandatory field – assigned by the content provider\\'s system and must not be changed afterwards.",

    "docDe": "Eindeutige ID des Datensatzes im System des Datenlieferanten. Pflichtfeld – wird vom System des Inhaltsanbieters vergeben und darf danach nicht mehr geändert werden.",

    "placEn": "e.g. 699203",

    "placDe": "z.B. 699203"

  },

  "recordInformation.source": {

    "en": "Source",

    "de": "Quelle",

    "docEn": "Name of the organisation that maintains this record.",

    "docDe": "Name der Organisation, die diesen Datensatz pflegt.",

    "placEn": "e.g. Stiftung Preußischer Kulturbesitz, Staatliche Museen zu Berlin, Collection of Classical Antiquities",

    "placDe": "z.B. Stiftung Preußischer Kulturbesitz, Staatliche Museen zu Berlin, Antikensammlung"

  },

  "recordInformation.country": {

    "en": "Country",

    "de": "Land",

    "docEn": "Country in which the organisation primarily responsible for the record is based.",

    "docDe": "Land, in dem die Organisation mit der Hauptverantwortung für den Datensatz ansässig ist.",

    "placEn": "e.g. Germany",

    "placDe": "z.B. Deutschland"

  },

  "recordInformation.creation": {

    "en": "Creation",

    "de": "Erstellung",

    "docEn": "When created and by whom;",

    "docDe": "Wann erstellt und von wem;",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.creation.date": {

    "en": "Date",

    "de": "Datum",

    "docEn": "Date when this record about the heritage asset was created in the system. Not to be confused with the date of origin of the object (see Temporal classification) or the date of digitisation (see Activities).",

    "docDe": "Datum, an dem dieser Datensatz über das Kulturgut im System angelegt wurde. Nicht zu verwechseln mit dem Entstehungsdatum des Objekts (siehe Zeitliche Einordnung) oder dem Datum der Digitalisierung (siehe Aktivitäten).",

    "placEn": "e.g. 2025-04-14",

    "placDe": "z.B. 2025-04-14"

  },

  "recordInformation.creation.contacts": {

    "en": "Contacts",

    "de": "Kontakte",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.creation.contacts.name": {

    "en": "Name",

    "de": "Name",

    "docEn": "First and last name of the person who created this record.",

    "docDe": "Vorname(n) und Nachname der Person, die diesen Datensatz angelegt hat.",

    "placEn": "e.g. John Doe",

    "placDe": "z.B. Max Mustermann"

  },

  "recordInformation.creation.contacts.role": {

    "en": "Role",

    "de": "Rolle",

    "docEn": "Role of the person in the project or institution.",

    "docDe": "Rolle der Person im Projekt oder in der Institution.",

    "placEn": "e.g. Documentation",

    "placDe": "z.B. Dokumentation"

  },

  "recordInformation.creation.contacts.organization": {

    "en": "Organisation",

    "de": "Organisation",

    "docEn": "Organisation to which the contact person belongs.",

    "docDe": "Organisation, der die kontaktierte Person angehört.",

    "placEn": "e.g. Stiftung Preußischer Kulturbesitz, Staatliche Museen zu Berlin",

    "placDe": "z.B. Stiftung Preußischer Kulturbesitz, Staatliche Museen zu Berlin"

  },

  "recordInformation.creation.contacts.email": {

    "en": "Email",

    "de": "E-Mail",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.creation.contacts.address": {

    "en": "Address",

    "de": "Adresse",

    "docEn": "The postal address of the person or organization",

    "docDe": "Die Postanschrift der Person oder Organisation",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.creation.contacts.address.buildingName": {

    "en": "Building name",

    "de": "Gebäudename",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.creation.contacts.address.numberInRoad": {

    "en": "Number in road",

    "de": "Hausnummer",

    "docEn": "The number in a road or street used to identify a property",

    "docDe": "Die Hausnummer in einer Straße zur Identifizierung eines Grundstücks",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.creation.contacts.address.roadName": {

    "en": "Road name",

    "de": "Straßenname",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.creation.contacts.address.townOrCity": {

    "en": "Town or city",

    "de": "Stadt oder Ort",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.creation.contacts.address.postcodeOrZipcode": {

    "en": "Postcode or zipcode",

    "de": "Postleitzahl",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.creation.contacts.address.locality": {

    "en": "Locality",

    "de": "Örtlichkeit",

    "docEn": "A named area within which a monument or building lies",

    "docDe": "Ein benanntes Gebiet, in dem ein Denkmal oder Gebäude liegt",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.creation.contacts.address.adminArea": {

    "en": "Admin area",

    "de": "Verwaltungsbezirk",

    "docEn": "The name by which an administrative area is known, e.g. Shropshire",

    "docDe": "Der Name, unter dem ein Verwaltungsgebiet bekannt ist, z.B. Shropshire",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.creation.contacts.address.country": {

    "en": "Country",

    "de": "Land",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.creation.contacts.phone": {

    "en": "Phone",

    "de": "Telefon",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.creation.contacts.fax": {

    "en": "Fax",

    "de": "Fax",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.creation.contacts.description": {

    "en": "Description",

    "de": "Beschreibung",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.update": {

    "en": "Update",

    "de": "Aktualisierung",

    "docEn": "The date of the last update to the record and by whom.",

    "docDe": "Das Datum der letzten Aktualisierung des Datensatzes und durch wen.",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.update.date": {

    "en": "Date",

    "de": "Datum",

    "docEn": "Date of the last update to this record.",

    "docDe": "Datum der letzten Aktualisierung dieses Datensatzes.",

    "placEn": "e.g. 2025-09-12",

    "placDe": "z.B. 2025-09-12"

  },

  "recordInformation.update.contacts": {

    "en": "Contacts",

    "de": "Kontakte",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.update.contacts.name": {

    "en": "Name",

    "de": "Name",

    "docEn": "First and last name of the person who made the most recent update to this record.",

    "docDe": "Vorname(n) und Nachname der Person, die die letzte Aktualisierung dieses Datensatzes vorgenommen hat.",

    "placEn": "e.g. Jane Doe",

    "placDe": "z.B. Maxine Musterfrau"

  },

  "recordInformation.update.contacts.role": {

    "en": "Role",

    "de": "Rolle",

    "docEn": "The particular role played by the person or organization",

    "docDe": "Die spezielle Rolle, die die Person oder Organisation spielt",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.update.contacts.organization": {

    "en": "Organization",

    "de": "Organisation",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.update.contacts.email": {

    "en": "Email",

    "de": "E-Mail",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.update.contacts.address": {

    "en": "Address",

    "de": "Adresse",

    "docEn": "The postal address of the person or organization",

    "docDe": "Die Postanschrift der Person oder Organisation",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.update.contacts.address.buildingName": {

    "en": "Building name",

    "de": "Gebäudename",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.update.contacts.address.numberInRoad": {

    "en": "Number in road",

    "de": "Hausnummer",

    "docEn": "The number in a road or street used to identify a property",

    "docDe": "Die Hausnummer in einer Straße zur Identifizierung eines Grundstücks",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.update.contacts.address.roadName": {

    "en": "Road name",

    "de": "Straßenname",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.update.contacts.address.townOrCity": {

    "en": "Town or city",

    "de": "Stadt oder Ort",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.update.contacts.address.postcodeOrZipcode": {

    "en": "Postcode or zipcode",

    "de": "Postleitzahl",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.update.contacts.address.locality": {

    "en": "Locality",

    "de": "Örtlichkeit",

    "docEn": "A named area within which a monument or building lies",

    "docDe": "Ein benanntes Gebiet, in dem ein Denkmal oder Gebäude liegt",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.update.contacts.address.adminArea": {

    "en": "Admin area",

    "de": "Verwaltungsbezirk",

    "docEn": "The name by which an administrative area is known, e.g. Shropshire",

    "docDe": "Der Name, unter dem ein Verwaltungsgebiet bekannt ist, z.B. Shropshire",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.update.contacts.address.country": {

    "en": "Country",

    "de": "Land",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.update.contacts.phone": {

    "en": "Phone",

    "de": "Telefon",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.update.contacts.fax": {

    "en": "Fax",

    "de": "Fax",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.update.contacts.description": {

    "en": "Description",

    "de": "Beschreibung",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "recordInformation.language": {

    "en": "Language",

    "de": "Sprache",

    "docEn": "Language of the metadata in this record. ISO 639-1 two-letter code.",

    "docDe": "Sprache der Metadaten dieses Datensatzes. ISO 639-1 zweistelliger Code.",

    "placEn": "e.g. de | en | fr",

    "placDe": "z.B. de | en | fr"

  },

  "recordInformation.metadataRights": {

    "en": "Metadata Rights",

    "de": "Metadatenrechte",

    "docEn": "Licence for the use of these metadata – not for the heritage asset or the digital resource.",

    "docDe": "Lizenz für die Nutzung dieser Metadaten – nicht für das Kulturgut oder die digitale Ressource.",

    "placEn": "e.g. CC BY-SA 4.0",

    "placDe": "z.B. CC BY-SA 4.0"

  },

  "appellation": {

    "en": "Appellation",

    "de": "Bezeichnung",

    "docEn": "Information about the identifier (ID) and name of the monument.",

    "docDe": "Informationen über den Identifikator (ID) und den Namen des Denkmals.",

    "placEn": "",

    "placDe": ""

  },

  "appellation.id": {

    "en": "Inventory Number",

    "de": "Inventarnummer",

    "docEn": "Inventory number or institutional identifier of the heritage asset (e.g. museum number). Distinct from the Record ID above, which identifies the technical record.",

    "docDe": "Inventarnummer oder institutionelle Kennung des Kulturguts (z.B. Museumsnummer). Zu unterscheiden von der Datensatz-ID weiter oben, die den technischen Datensatz identifiziert.",

    "placEn": "e.g. SK 740",

    "placDe": "z.B. SK 740"

  },

  "appellation.name": {

    "en": "Name",

    "de": "Name",

    "docEn": "Name of the heritage asset. Can be provided in multiple languages, with a preferred value indicated.",

    "docDe": "Bezeichnung des Kulturguts. Kann mehrsprachig angegeben werden, bevorzugter Wert markierbar. [Hinweis: laut Schema (4.2 Appellation) steht \\'Name\\' vor \\'ID\\'.]",

    "placEn": "e.g. Grave naiskos of Nikarete: Female fragment from the tomb of Nikarete",

    "placDe": "z.B. Grabnaiskos der Nikarete: Weibliches Fragment vom Grabmal der Nikarete"

  },

  "description": {

    "en": "Description",

    "de": "Beschreibung",

    "docEn": "Free-text description of the heritage asset. Can be provided in multiple languages.",

    "docDe": "Freitext-Beschreibung des Kulturguts. Kann mehrsprachig angegeben werden.",

    "placEn": "e.g. Female fragment of an Attic grave naiskos in Pentelic marble, executed in relief technique ...",

    "placDe": "z.B. Weibliches Fragment eines attischen Grabnaiskos aus pentelischem Marmor, in Relieftechnik gearbeitet ..."

  },

  "generalType": {

    "en": "General Type",

    "de": "Allgemeiner Typ",

    "docEn": "General classification of the heritage asset. Select from 7 predefined CARARE types.",

    "docDe": "Allgemeine Klassifikation des Kulturguts. Auswahl aus 7 vordefinierten Typen des CARARE-Schemas.",

    "placEn": "e.g. Artefact | Monument | Text | Image | Sound | Movie | 3D",

    "placDe": "z.B. Artefact | Monument | Text | Image | Sound | Movie | 3D"

  },

  "actors": {

    "en": "Actors",

    "de": "Akteure",

    "docEn": "The actors involved with this monument; may be repeated",

    "docDe": "Die Akteure, die an diesem Denkmal beteiligt sind; kann wiederholt werden",

    "placEn": "",

    "placDe": ""

  },

  "actors.id": {

    "en": "ID",

    "de": "ID",

    "docEn": "Unique identifier of the creator of the heritage asset (e.g. artist, workshop, sculptor) or another involved person/organisation. If the creator is unknown or cannot be identified, this field can be left empty. Recommendation: use an authority file URI, e.g. GND or Wikidata for historical persons. Workshops as a collective or corporate author can also be given.",

    "docDe": "Eindeutige Kennung des Schöpfers/der Schöpferin des Kulturguts (z.B. Künstler, Werkstatt, Bildhauer) oder einer anderen beteiligten Person/Organisation. Falls der Schöpfer unbekannt oder nicht identifizierbar ist, kann dieses Feld leer bleiben. Empfehlung: Normdaten-URI verwenden, z.B. GND oder Wikidata für historische Personen. Auch Werkstätten als kollektiver bzw. korporativer Urheber können angegeben werden.",

    "placEn": "e.g. https://d-nb.info/gnd/119126893",

    "placDe": "z.B. https://d-nb.info/gnd/119126893"

  },

  "actors.name": {

    "en": "Name",

    "de": "Name",

    "docEn": "Name of the person or organisation related to the heritage asset – e.g. creator, workshop, conservator, custodian or curator.",

    "docDe": "Name der Person oder Organisation, die in Bezug zum Kulturgut steht – z.B. Schöpfer, Werkstatt, Restaurator, Verwalter oder Kurator.",

    "placEn": "e.g. Kallikrates",

    "placDe": "z.B. Kallikrates"

  },

  "actors.actorType": {

    "en": "Actor type",

    "de": "Akteurtyp",

    "docEn": "Indicates whether the actor is an individual, a group of individuals or an organization.",

    "docDe": "Gibt an, ob der Akteur eine Einzelperson, eine Gruppe von Personen oder eine Organisation ist.",

    "placEn": "",

    "placDe": ""

  },

  "actors.roles": {

    "en": "Roles",

    "de": "Rollen",

    "docEn": "Role(s) of this person or organisation in relation to the heritage asset. An actor can have multiple roles at once. Examples: Creator, Custodian, Repository Manager, Curator, Conservator.",

    "docDe": "Rolle(n) dieser Person oder Organisation in Bezug auf das Kulturgut. Ein Akteur kann mehrere Rollen gleichzeitig haben. Beispiele: Ersteller, Verwahrer, Repository-Manager, Kurator, Restaurator.",

    "placEn": "e.g. Architect",

    "placDe": "z.B. Architekt"

  },

  "actors.contacts": {

    "en": "Contacts",

    "de": "Kontakte",

    "docEn": "Contact information if known",

    "docDe": "Kontaktinformationen, falls bekannt",

    "placEn": "",

    "placDe": ""

  },

  "actors.contacts.name": {

    "en": "Name",

    "de": "Name",

    "docEn": "Title, first name, last name, other name",

    "docDe": "Titel, Vorname, Nachname, sonstiger Name",

    "placEn": "",

    "placDe": ""

  },

  "actors.contacts.role": {

    "en": "Role",

    "de": "Rolle",

    "docEn": "The particular role played by the person or organization",

    "docDe": "Die spezielle Rolle, die die Person oder Organisation spielt",

    "placEn": "",

    "placDe": ""

  },

  "actors.contacts.organization": {

    "en": "Organization",

    "de": "Organisation",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "actors.contacts.email": {

    "en": "Email",

    "de": "E-Mail",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "actors.contacts.address": {

    "en": "Address",

    "de": "Adresse",

    "docEn": "The postal address of the person or organization",

    "docDe": "Die Postanschrift der Person oder Organisation",

    "placEn": "",

    "placDe": ""

  },

  "actors.contacts.address.buildingName": {

    "en": "Building name",

    "de": "Gebäudename",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "actors.contacts.address.numberInRoad": {

    "en": "Number in road",

    "de": "Hausnummer",

    "docEn": "The number in a road or street used to identify a property",

    "docDe": "Die Hausnummer in einer Straße zur Identifizierung eines Grundstücks",

    "placEn": "",

    "placDe": ""

  },

  "actors.contacts.address.roadName": {

    "en": "Road name",

    "de": "Straßenname",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "actors.contacts.address.townOrCity": {

    "en": "Town or city",

    "de": "Stadt oder Ort",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "actors.contacts.address.postcodeOrZipcode": {

    "en": "Postcode or zipcode",

    "de": "Postleitzahl",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "actors.contacts.address.locality": {

    "en": "Locality",

    "de": "Örtlichkeit",

    "docEn": "A named area within which a monument or building lies",

    "docDe": "Ein benanntes Gebiet, in dem ein Denkmal oder Gebäude liegt",

    "placEn": "",

    "placDe": ""

  },

  "actors.contacts.address.adminArea": {

    "en": "Admin area",

    "de": "Verwaltungsbezirk",

    "docEn": "The name by which an administrative area is known, e.g. Shropshire",

    "docDe": "Der Name, unter dem ein Verwaltungsgebiet bekannt ist, z.B. Shropshire",

    "placEn": "",

    "placDe": ""

  },

  "actors.contacts.address.country": {

    "en": "Country",

    "de": "Land",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "actors.contacts.phone": {

    "en": "Phone",

    "de": "Telefon",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "actors.contacts.fax": {

    "en": "Fax",

    "de": "Fax",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "actors.contacts.description": {

    "en": "Description",

    "de": "Beschreibung",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "actors.vitalDates": {

    "en": "Vital dates",

    "de": "Lebensdaten",

    "docEn": "Date of birth, date of death if known.",

    "docDe": "Geburtsdatum, Todesdatum falls bekannt.",

    "placEn": "",

    "placDe": ""

  },

  "actors.vitalDates.dateOfBirth": {

    "en": "Date of birth",

    "de": "Geburtsdatum",

    "docEn": "If this is a prehistoric date use the minus (-) sign to denote it.",

    "docDe": "Wenn es sich um ein prähistorisches Datum handelt, verwenden Sie das Minuszeichen (-), um dies zu kennzeichnen.",

    "placEn": "",

    "placDe": ""

  },

  "actors.vitalDates.dateOfDeath": {

    "en": "Date of death",

    "de": "Todesdatum",

    "docEn": "If this is a prehistoric date use the minus (-) sign to denote it.",

    "docDe": "Wenn es sich um ein prähistorisches Datum handelt, verwenden Sie das Minuszeichen (-), um dies zu kennzeichnen.",

    "placEn": "",

    "placDe": ""

  },

  "actors.vitalDates.displayDate": {

    "en": "Display date",

    "de": "Anzeigedatum",

    "docEn": "A free text field used to display the date or period for users (e.g. early 19th century, 1950s). The element may be repeated using the XML:lang attribute if the element value is available in alternate languages. A preferred/alternate attribute should be used to indicate which value is preferred.",

    "docDe": "Ein Freitextfeld, das zur Anzeige des Datums oder der Epoche für Benutzer verwendet wird. Ein bevorzugt/alternativ-Attribut sollte verwendet werden, um anzuzeigen, welcher Wert bevorzugt wird.",

    "placEn": "",

    "placDe": ""

  },

  "actors.placeOfBirth": {

    "en": "Place of birth",

    "de": "Geburtsort",

    "docEn": "Use of a controlled vocabulary such as http://www.geonames.org/ is recommended, and the vocabulary used may be indicated with an attribute.",

    "docDe": "Die Verwendung eines kontrollierten Vokabulars wie http://www.geonames.org/ wird empfohlen, und das verwendete Vokabular kann mit einem Attribut angegeben werden.",

    "placEn": "",

    "placDe": ""

  },

  "actors.placeOfDeath": {

    "en": "Place of death",

    "de": "Sterbeort",

    "docEn": "Use of a controlled vocabulary such as http://www.geonames.org/ is recommended, and the vocabulary used may be indicated with an attribute.",

    "docDe": "Die Verwendung eines kontrollierten Vokabulars wie http://www.geonames.org/ wird empfohlen, und das verwendete Vokabular kann mit einem Attribut angegeben werden.",

    "placEn": "",

    "placDe": ""

  },

  "actors.placeOfActivity": {

    "en": "Place of activity",

    "de": "Ort der Tätigkeit",

    "docEn": "Use of a controlled vocabulary such as http://www.geonames.org/ is recommended, and the vocabulary used may be indicated with an attribute.",

    "docDe": "Die Verwendung eines kontrollierten Vokabulars wie http://www.geonames.org/ wird empfohlen, und das verwendete Vokabular kann mit einem Attribut angegeben werden.",

    "placEn": "",

    "placDe": ""

  },

  "actors.bibliographicalNote": {

    "en": "Bibliographical note",

    "de": "Bibliografische Notiz",

    "docEn": "The element may be repeated using the XML:lang attribute if the element value is available in alternate languages. A preferred/alternate attribute may be used to indicate which value is preferred.",

    "docDe": "Das Element kann unter Verwendung des XML:lang-Attributs wiederholt werden, wenn der Elementwert in alternativen Sprachen verfügbar ist. Ein bevorzugt/alternativ-Attribut kann verwendet werden, um anzuzeigen, welcher Wert bevorzugt wird.",

    "placEn": "",

    "placDe": ""

  },

  "designations": {

    "en": "Designations",

    "de": "Ausweisungen",

    "docEn": "This is information about any designations for a monument or building which provide it with protection in law.  There may be more than one designation.",

    "docDe": "Dies sind Informationen über etwaige Ausweisungen für ein Denkmal oder Gebäude, die ihm rechtlichen Schutz verleihen. Es kann mehr als eine Ausweisung geben.",

    "placEn": "",

    "placDe": ""

  },

  "designations.protectionType": {

    "en": "Protection type",

    "de": "Schutzart",

    "docEn": "The type of designation or protection.",

    "docDe": "Die Art der Ausweisung oder des Schutzes.",

    "placEn": "",

    "placDe": ""

  },

  "designations.grade": {

    "en": "Grade",

    "de": "Grad",

    "docEn": "The grade or level of protection.",

    "docDe": "Der Grad oder das Niveau des Schutzes.",

    "placEn": "",

    "placDe": ""

  },

  "designations.dateFrom": {

    "en": "Date from",

    "de": "Datum von",

    "docEn": "The date it came into force.",

    "docDe": "Das Datum des Inkrafttretens.",

    "placEn": "",

    "placDe": ""

  },

  "designations.dateTo": {

    "en": "Date to",

    "de": "Datum bis",

    "docEn": "The date until which the monument will be / has been protected.",

    "docDe": "Das Datum, bis zu dem das Denkmal geschützt wird / wurde.",

    "placEn": "",

    "placDe": ""

  },

  "designations.displayDate": {

    "en": "Display date",

    "de": "Anzeigedatum",

    "docEn": "A free text field used to display the date or period for users (e.g. early 19th century, 1950s). The element may be repeated using the XML:lang attribute if the element value is available in alternate languages. A preferred/alternate attribute should be used to indicate which value is preferred.",

    "docDe": "Ein Freitextfeld, das zur Anzeige des Datums oder der Epoche für Benutzer verwendet wird. Ein bevorzugt/alternativ-Attribut sollte verwendet werden, um anzuzeigen, welcher Wert bevorzugt wird.",

    "placEn": "",

    "placDe": ""

  },

  "conditions": {

    "en": "Conditions",

    "de": "Bedingungen",

    "docEn": "This is information about the condition of a monument or building. The element is repeatable.",

    "docDe": "Dies sind Informationen über den Zustand eines Denkmals oder Gebäudes. Das Element ist wiederholbar.",

    "placEn": "",

    "placDe": ""

  },

  "conditions.condition": {

    "en": "Condition",

    "de": "Zustand",

    "docEn": "General professional assessment of the condition. This assessment is based on the expertise of the documenting person and is not defined by fixed thresholds.",

    "docDe": "Allgemeine fachliche Einschätzung des Erhaltungszustands. Diese Bewertung basiert auf der Expertise der dokumentierenden Person und ist nicht durch feste Schwellenwerte definiert.",

    "placEn": "e.g. good | fair | bad | poor | part destroyed | under restoration",

    "placDe": "z.B. good | fair | bad | poor | part destroyed | under restoration"

  },

  "conditions.conditionAssessment": {

    "en": "Condition Assessment",

    "de": "Zustandsbewertung",

    "docEn": "A detailed assessment of the condition of a heritage asset and any treatment required, including an estimation of the percentage affected.",

    "docDe": "Detaillierte fachliche Einschätzung des Zustands des Kulturguts, einschließlich erforderlicher Maßnahmen und einer Schätzung des betroffenen Flächenanteils.",

    "placEn": "e.g. Surface weathering on the front, approx. 15% of the relief surface affected. Conservation treatment recommended.",

    "placDe": "z.B. Oberflächenverwitterung an der Vorderseite, ca. 15% der Reliefoberfläche betroffen. Konservierungsmaßnahme empfohlen."

  },

  "conditions.conditionDate": {

    "en": "Condition Date",

    "de": "Datum der Zustandsbewertung",

    "docEn": "The date when the assessment of condition was made. Free text to allow for a descriptive date, e.g. \\'1950s\\'. [NEW – per the CARARE schema (3.3 Conditions), previously undocumented.]",

    "docDe": "Datum, an dem die Zustandsbewertung vorgenommen wurde. Freitext, um auch ungenaue Datumsangaben zu ermöglichen (z.B. \\'1950er Jahre\\'). [NEU – laut CARARE-Schema (3.3 Conditions), bisher nicht dokumentiert.]",

    "placEn": "e.g. 2010 | 1950s",

    "placDe": "z.B. 2010 | 1950er Jahre"

  },

  "conditions.displayDate": {

    "en": "Display date",

    "de": "Anzeigedatum",

    "docEn": "A free text field used to display the date or period for users (e.g. early 19th century, 1950s). The element may be repeated using the XML:lang attribute if the element value is available in alternate languages. A preferred/alternate attribute should be used to indicate which value is preferred.",

    "docDe": "Ein Freitextfeld, das zur Anzeige des Datums oder der Epoche für Benutzer verwendet wird. Ein bevorzugt/alternativ-Attribut sollte verwendet werden, um anzuzeigen, welcher Wert bevorzugt wird.",

    "placEn": "",

    "placDe": ""

  },

  "conditions.wasPresentAt": {

    "en": "Was Present At (Condition Assessment)",

    "de": "War Anwesend Bei (Zustandsbewertung)",

    "docEn": "Relation to an associated event/activity at which the condition assessment was made. Give the ID number of the target record or a URI.",

    "docDe": "Verweist auf die Aktivität, bei der diese Zustandsbewertung vorgenommen wurde. ID-Nummer des Zieldatensatzes oder URI angeben.",

    "placEn": "e.g. conservation measures 2010, carried out by a qualified conservator",

    "placDe": "z.B. Restaurierungsmaßnahmen 2010, durchgeführt von einer Diplom-Restauratorin/einem Diplom-Restaurator"

  },

  "provenance": {

    "en": "Provenance",

    "de": "Provenienz",

    "docEn": "Free text describing the ownership and custody history of the heritage asset since its creation – relevant to its authenticity, integrity and interpretation. Instead of free text, a link to detailed documentation can also be provided.",

    "docDe": "Freitext zur Eigentums- und Verwahrungsgeschichte des Kulturguts seit seiner Entstehung – relevant für Authentizität, Integrität und Interpretation. Statt Freitext kann auch ein Link zu einer ausführlichen Dokumentation angegeben werden.",

    "placEn": "e.g. https://doi.org/10.11588/diglit.69318#0219",

    "placDe": "z.B. https://doi.org/10.11588/diglit.69318#0219"

  },

  "characters": {

    "en": "Characters",

    "de": "Eigenschaften",

    "docEn": "This is a set of index information to describe the character of the monument. Content providers are strongly recommended to complete this element.",

    "docDe": "Dies ist ein Satz von Indexinformationen zur Beschreibung des Charakters des Denkmals. Datenanbietern wird dringend empfohlen, dieses Element auszufüllen.",

    "placEn": "",

    "placDe": ""

  },

  "characters.heritageAssetType": {

    "en": "Monument Type",

    "de": "Denkmaltyp",

    "docEn": "Typological classification as a monument – e.g. tombstone, dwelling, fortification.",

    "docDe": "Typologische Einordnung als Denkmal – z.B. Grabstein, Wohnhaus, Befestigung.",

    "placEn": "e.g. tombstone",

    "placDe": "z.B. Grabstein"

  },

  "characters.temporal": {

    "en": "Temporal",

    "de": "Zeitlich",

    "docEn": "Information about the date and/or period of an entity.. Content providers are strongly recommended to complete this element.",

    "docDe": "Informationen über das Datum und/oder die Epoche einer Entität.. Datenanbietern wird dringend empfohlen, dieses Element auszufüllen.",

    "placEn": "",

    "placDe": ""

  },

  "characters.temporal.timeSpan": {

    "en": "Time span",

    "de": "Zeitspanne",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "characters.temporal.timeSpan.startDate": {

    "en": "Start Date",

    "de": "Startdatum",

    "docEn": "Earliest date of the temporal classification of the heritage asset (not of the digitisation). Machine-readable date; negative values denote years BCE.",

    "docDe": "Frühestes Datum der zeitlichen Einordnung des Kulturguts (nicht der Digitalisierung). Maschinenlesbares Datum; negative Werte bezeichnen Jahre v. Chr. (TODO: Darstellung von Roh- vs. Anzeigewert noch nicht final entschieden, siehe Protokoll.)",

    "placEn": "e.g. -330",

    "placDe": "z.B. -330"

  },

  "characters.temporal.timeSpan.endDate": {

    "en": "End Date",

    "de": "Enddatum",

    "docEn": "Latest date of the temporal classification of the heritage asset (not of the digitisation). Machine-readable date; negative values denote years BCE.",

    "docDe": "Spätestes Datum der zeitlichen Einordnung des Kulturguts (nicht der Digitalisierung). Maschinenlesbares Datum; negative Werte bezeichnen Jahre v. Chr.",

    "placEn": "e.g. -320",

    "placDe": "z.B. -320"

  },

  "characters.temporal.timeSpan.dateRangeQualifier": {

    "en": "Date range qualifier",

    "de": "Datumsbereichs-Qualifikator",

    "docEn": "the nature of the time span given (e.g. throughout, at some time during, etc.) Use of a controlled vocabulary is recommended.",

    "docDe": "die Art der angegebenen Zeitspanne (z.B. durchgehend, zu einem bestimmten Zeitpunkt während usw.). Die Verwendung eines kontrollierten Vokabulars wird empfohlen.",

    "placEn": "",

    "placDe": ""

  },

  "characters.temporal.periodName": {

    "en": "Period Name",

    "de": "Epochenname",

    "docEn": "The name given to the historical period in which the object was created. Can be provided in multiple languages, with a preferred value indicated.",

    "docDe": "Name der historischen Epoche oder Periode, in der das Objekt entstand. Kann mehrsprachig angegeben werden, bevorzugter Wert markierbar.",

    "placEn": "e.g. Late Classical period",

    "placDe": "z.B. Spätklassische Periode"

  },

  "characters.temporal.displayDate": {

    "en": "Display Date",

    "de": "Anzeigezeitraum",

    "docEn": "Human-readable date for display purposes in the UI. Can be provided in multiple languages, with a preferred value indicated.",

    "docDe": "Menschenlesbare Zeitangabe für die Anzeige im UI. Kann mehrsprachig angegeben werden, bevorzugter Wert markierbar.",

    "placEn": "e.g. 3rd third of the 4th century BCE",

    "placDe": "z.B. 3. Drittel 4. Jh. v. Chr."

  },

  "characters.temporal.scientificDate": {

    "en": "Scientific Date",

    "de": "Wissenschaftliches Datum",

    "docEn": "Date according to scientific dating methods (e.g. radiocarbon). Recorded precisely as received from the specialist laboratory, including error margin and lab code.",

    "docDe": "Datum nach wissenschaftlichen Datierungsmethoden (z.B. Radiokarbon). Wird exakt wie vom Fachlabor übermittelt erfasst, inklusive Fehlerbereich und Labor-Code.",

    "placEn": "e.g. 1250 BP ±30 (lab code PBN-1675)",

    "placDe": "z.B. 1250 BP ±30 (Labor-Code PBN-1675)"

  },

  "characters.temporal.scientificDateMethod": {

    "en": "Scientific Date Method",

    "de": "Methode der wissenschaftlichen Datierung",

    "docEn": "Method used for the scientific dating given above.",

    "docDe": "Methode der wissenschaftlichen Datierung, die für das wissenschaftliche Datum verwendet wurde. (TODO: Prüfen, ob Feld wiederholbar sein muss, siehe Protokoll.)",

    "placEn": "e.g. radiocarbon dating",

    "placDe": "z.B. Radiokarbondatierung"

  },

  "characters.materials": {

    "en": "Material",

    "de": "Material",

    "docEn": "The basic materials of which the heritage asset is composed. Multiple entries possible.",

    "docDe": "Grundmaterial(ien), aus denen das Kulturgut besteht. Mehrere Einträge möglich.",

    "placEn": "e.g. Pentelic marble",

    "placDe": "z.B. Marmor, pentelisch"

  },

  "characters.inscriptions": {

    "en": "Inscription Content",

    "de": "Inschriftsinhalt",

    "docEn": "Full inscription text, in the original script where applicable. Can be provided in multiple languages.",

    "docDe": "Vollständiger Inschriftstext, ggf. im Original-Schriftsystem. Kann mehrsprachig angegeben werden.",

    "placEn": "e.g. 1-line inscription on the cornice: Νικαρέτη Κτησιφῶντος ...",

    "placDe": "z.B. 1-zeilige Inschrift auf der Giebelleiste: Νικαρέτη Κτησιφῶντος ..."

  },

  "characters.dimensions": {

    "en": "Dimensions",

    "de": "Abmessungen",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "characters.dimensions.extent": {

    "en": "Extent",

    "de": "Ausmaß",

    "docEn": "Notes the part of the heritage asset being measured.",

    "docDe": "Gibt an, welcher Teil des Kulturguts vermessen wird.",

    "placEn": "e.g. sculpture | pedestal",

    "placDe": "z.B. Skulptur | Sockel"

  },

  "characters.dimensions.measurementType": {

    "en": "Measurement Type",

    "de": "Maßart",

    "docEn": "Indicates the type of measurement.",

    "docDe": "Bezeichnet die Art der Messung.",

    "placEn": "e.g. height | length | width | weight",

    "placDe": "z.B. Höhe | Länge | Breite | Gewicht"

  },

  "characters.dimensions.units": {

    "en": "Units",

    "de": "Einheit",

    "docEn": "Gives the unit of measurement.",

    "docDe": "Gibt die verwendete Maßeinheit an.",

    "placEn": "e.g. centimetres | kilograms",

    "placDe": "z.B. Zentimeter | Kilogramm"

  },

  "characters.dimensions.scale": {

    "en": "Scale",

    "de": "Maßstab",

    "docEn": "Scale information, if relevant – e.g. for models, replicas or scaled representations. For original objects at original size, this field can be left empty.",

    "docDe": "Maßstabsangabe, falls relevant – z.B. bei Modellen, Repliken oder maßstäblichen Darstellungen. Bei Originalobjekten in Originalgröße kann dieses Feld leer bleiben.",

    "placEn": "e.g. 1:10 (relevant for models/replicas only)",

    "placDe": "z.B. 1:10 (nur bei Modellen/Repliken relevant)"

  },

  "characters.dimensions.value": {

    "en": "Value",

    "de": "Maß",

    "docEn": "Numerical measurement value in the specified unit.",

    "docDe": "Numerischer Messwert in der angegebenen Einheit.",

    "placEn": "e.g. 118 | 56 | 59 | 40",

    "placDe": "z.B. 118 | 56 | 59 | 40"

  },

  "characters.craft": {

    "en": "Craft",

    "de": "Wasserfahrzeug",

    "docEn": "This is a set of information to describe shipwrecks if any",

    "docDe": "Dies ist eine Sammlung von Informationen zur Beschreibung von Schiffswracks, falls vorhanden",

    "placEn": "",

    "placDe": ""

  },

  "characters.craft.placeOfRegistration": {

    "en": "Place of registration",

    "de": "Registrierungsort",

    "docEn": "Of the ship",

    "docDe": "Des Schiffes",

    "placEn": "",

    "placDe": ""

  },

  "characters.craft.nationality": {

    "en": "Nationality",

    "de": "Nationalität",

    "docEn": "Of the ship",

    "docDe": "Des Schiffes",

    "placEn": "",

    "placDe": ""

  },

  "characters.craft.constructionMethod": {

    "en": "Construction method",

    "de": "Bauweise",

    "docEn": "Of the ship",

    "docDe": "Des Schiffes",

    "placEn": "",

    "placDe": ""

  },

  "characters.craft.propulsion": {

    "en": "Propulsion",

    "de": "Antrieb",

    "docEn": "Of the ship",

    "docDe": "Des Schiffes",

    "placEn": "",

    "placDe": ""

  },

  "characters.craft.lastJourneyDetails": {

    "en": "Last journey details",

    "de": "Details zur letzten Reise",

    "docEn": "Of the ship",

    "docDe": "Des Schiffes",

    "placEn": "",

    "placDe": ""

  },

  "characters.craft.lastJourneyDetails.departure": {

    "en": "Departure",

    "de": "Abfahrt",

    "docEn": "Port of departure",

    "docDe": "Abfahrtshafen",

    "placEn": "",

    "placDe": ""

  },

  "characters.craft.lastJourneyDetails.destination": {

    "en": "Destination",

    "de": "Ziel",

    "docEn": "Port of destination",

    "docDe": "Zielhafen",

    "placEn": "",

    "placDe": ""

  },

  "characters.craft.lastJourneyDetails.cargo": {

    "en": "Cargo",

    "de": "Fracht",

    "docEn": "Of the ship",

    "docDe": "Des Schiffes",

    "placEn": "",

    "placDe": ""

  },

  "characters.craft.lastJourneyDetails.mannerOfLoss": {

    "en": "Manner of loss",

    "de": "Art des Verlusts",

    "docEn": "How the ship was lost",

    "docDe": "Wie das Schiff verloren ging",

    "placEn": "",

    "placDe": ""

  },

  "characters.craft.lastJourneyDetails.dateOfLoss": {

    "en": "Date of loss",

    "de": "Verlustdatum",

    "docEn": "When the ship was lost .. If this is a prehistoric date use the minus (-) sign to denote it.",

    "docDe": "Wann das Schiff verloren ging.. Wenn es sich um ein prähistorisches Datum handelt, verwenden Sie das Minuszeichen (-), um dies zu kennzeichnen.",

    "placEn": "",

    "placDe": ""

  },

  "characters.craft.lastJourneyDetails.displayDate": {

    "en": "Display date",

    "de": "Anzeigedatum",

    "docEn": "A free text field used to display the date or period for users (e.g. early 19th century, 1950s). The element may be repeated using the XML:lang attribute if the element value is available in alternate languages. A preferred/alternate attribute should be used to indicate which value is preferred.",

    "docDe": "Ein Freitextfeld, das zur Anzeige des Datums oder der Epoche für Benutzer verwendet wird. Ein bevorzugt/alternativ-Attribut sollte verwendet werden, um anzuzeigen, welcher Wert bevorzugt wird.",

    "placEn": "",

    "placDe": ""

  },

  "spatial": {

    "en": "Spatial",

    "de": "Räumlich",

    "docEn": "This is information about the place at which the heritage asset is located, included named places, postal address, the map coordinates and geometry of the heritage asset.. Content providers are strongly recommended to complete this element.",

    "docDe": "Dies sind Informationen über den Ort, an dem sich das Kulturgut befindet.. Datenanbietern wird dringend empfohlen, dieses Element auszufüllen.",

    "placEn": "",

    "placDe": ""

  },

  "spatial.locationSet": {

    "en": "Location set",

    "de": "Ortsdatensatz",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "spatial.locationSet.namedLocation": {

    "en": "Named Location",

    "de": "Benannter Ort",

    "docEn": "Name of a place or location relevant to the heritage asset. Can be provided in multiple languages, with a preferred value indicated.",

    "docDe": "Name eines Ortes oder einer Lokalität, die für das Kulturgut relevant ist. Kann mehrsprachig angegeben werden, bevorzugter Wert markierbar.",

    "placEn": "e.g. Attica, Greece",

    "placDe": "z.B. Attika, Griechenland"

  },

  "spatial.locationSet.address": {

    "en": "Address",

    "de": "Adresse",

    "docEn": "The postal address",

    "docDe": "Die Postanschrift",

    "placEn": "",

    "placDe": ""

  },

  "spatial.locationSet.address.buildingName": {

    "en": "Building name",

    "de": "Gebäudename",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "spatial.locationSet.address.numberInRoad": {

    "en": "Number in road",

    "de": "Hausnummer",

    "docEn": "The number in a road or street used to identify a property",

    "docDe": "Die Hausnummer in einer Straße zur Identifizierung eines Grundstücks",

    "placEn": "",

    "placDe": ""

  },

  "spatial.locationSet.address.roadName": {

    "en": "Road name",

    "de": "Straßenname",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "spatial.locationSet.address.townOrCity": {

    "en": "Town or city",

    "de": "Stadt oder Ort",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "spatial.locationSet.address.postcodeOrZipcode": {

    "en": "Postcode or zipcode",

    "de": "Postleitzahl",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "spatial.locationSet.address.locality": {

    "en": "Locality",

    "de": "Örtlichkeit",

    "docEn": "A named area within which a monument or building lies",

    "docDe": "Ein benanntes Gebiet, in dem ein Denkmal oder Gebäude liegt",

    "placEn": "",

    "placDe": ""

  },

  "spatial.locationSet.address.adminArea": {

    "en": "Admin area",

    "de": "Verwaltungsbezirk",

    "docEn": "The name by which an administrative area is known, e.g. Shropshire",

    "docDe": "Der Name, unter dem ein Verwaltungsgebiet bekannt ist, z.B. Shropshire",

    "placEn": "",

    "placDe": ""

  },

  "spatial.locationSet.address.country": {

    "en": "Country",

    "de": "Land",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "spatial.locationSet.geopoliticalArea": {

    "en": "Geopolitical Area",

    "de": "Geopolitisches Gebiet",

    "docEn": "Higher-level geopolitical unit (country, region, province).",

    "docDe": "Übergeordnete geopolitische Einheit (Land, Region, Provinz).",

    "placEn": "e.g. Greece",

    "placDe": "z.B. Griechenland"

  },

  "spatial.locationSet.geopoliticalAreaType": {

    "en": "Geopolitical Area Type",

    "de": "Typ des geopolitischen Gebiets",

    "docEn": "Classification of the geopolitical area.",

    "docDe": "Klassifikation des geopolitischen Gebiets.",

    "placEn": "e.g. first order administrative division",

    "placDe": "z.B. Verwaltungsregion erster Ordnung"

  },

  "spatial.locationSet.cadastralReference": {

    "en": "Cadastral reference",

    "de": "Katasterreferenz",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "spatial.locationSet.historicalName": {

    "en": "Historical Name",

    "de": "Historischer Name",

    "docEn": "Historical name of the place, if it differs from the current name.",

    "docDe": "Historischer Name des Ortes, falls dieser sich vom heutigen Namen unterscheidet.",

    "placEn": "e.g. Constantinople (for present-day Istanbul)",

    "placDe": "z.B. Konstantinopel (für heutiges Istanbul)"

  },

  "spatial.geometry": {

    "en": "Geometry",

    "de": "Geometrie",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "spatial.geometry.spatialReferenceSystem": {

    "en": "Spatial Reference System",

    "de": "Räumliches Referenzsystem",

    "docEn": "Coordinate reference system for the following geometry information. Mandatory where coordinates are provided.",

    "docDe": "Koordinatenreferenzsystem für die folgenden Geometrieangaben. Pflichtfeld, sobald Koordinaten angegeben werden.",

    "placEn": "e.g. EPSG:4326 (WGS84)",

    "placDe": "z.B. EPSG:4326 (WGS84)"

  },

  "spatial.geometry.quickpoint": {

    "en": "Quickpoint",

    "de": "Quickpoint",

    "docEn": "this is the centre point",

    "docDe": "dies ist der Mittelpunkt",

    "placEn": "",

    "placDe": ""

  },

  "spatial.geometry.quickpoint.x": {

    "en": "X Coordinate",

    "de": "X-Koordinate",

    "docEn": "X coordinate of the centre point according to the spatial coordinate system in use.",

    "docDe": "X-Koordinate des Mittelpunkts gemäß dem verwendeten räumlichen Koordinatensystem.",

    "placEn": "e.g. 23.7275 (longitude in WGS84)",

    "placDe": "z.B. 23.7275 (Längengrad bei WGS84)"

  },

  "spatial.geometry.quickpoint.y": {

    "en": "Y Coordinate",

    "de": "Y-Koordinate",

    "docEn": "Y coordinate of the centre point according to the spatial coordinate system in use.",

    "docDe": "Y-Koordinate des Mittelpunkts gemäß dem verwendeten räumlichen Koordinatensystem.",

    "placEn": "e.g. 37.9838 (latitude in WGS84)",

    "placDe": "z.B. 37.9838 (Breitengrad bei WGS84)"

  },

  "spatial.geometry.quickpoint.z": {

    "en": "Z Coordinate (Height)",

    "de": "Z-Koordinate (Höhe)",

    "docEn": "Height of the centre point, e.g. metres above sea level.",

    "docDe": "Höhenangabe des Mittelpunkts, z.B. Meter über Meeresspiegel.",

    "placEn": "e.g. 70 (metres above sea level)",

    "placDe": "z.B. 70 (Meter über Meeresspiegel)"

  },

  "spatial.geometry.quickpoint.accuracy": {

    "en": "Accuracy",

    "de": "Genauigkeit",

    "docEn": "The accuracy of the given point in metres, as free text.",

    "docDe": "Genauigkeit des angegebenen Punktes in Metern, als Freitext.",

    "placEn": "e.g. ±5 m",

    "placDe": "z.B. ±5 m"

  },

  "spatial.geometry.boundingBox": {

    "en": "Bounding box",

    "de": "Begrenzungsrahmen",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "spatial.geometry.boundingBox.minX": {

    "en": "Min x",

    "de": "Min x",

    "docEn": "according to the spatial coordinate system in use",

    "docDe": "gemäß dem verwendeten räumlichen Koordinatensystem",

    "placEn": "",

    "placDe": ""

  },

  "spatial.geometry.boundingBox.maxX": {

    "en": "Max x",

    "de": "Max x",

    "docEn": "according to the spatial coordinate system in use",

    "docDe": "gemäß dem verwendeten räumlichen Koordinatensystem",

    "placEn": "",

    "placDe": ""

  },

  "spatial.geometry.boundingBox.minY": {

    "en": "Min y",

    "de": "Min y",

    "docEn": "according to the spatial coordinate system in use",

    "docDe": "gemäß dem verwendeten räumlichen Koordinatensystem",

    "placEn": "",

    "placDe": ""

  },

  "spatial.geometry.boundingBox.maxY": {

    "en": "Max y",

    "de": "Max y",

    "docEn": "according to the spatial coordinate system in use",

    "docDe": "gemäß dem verwendeten räumlichen Koordinatensystem",

    "placEn": "",

    "placDe": ""

  },

  "spatial.geometry.boundingBox.minZ": {

    "en": "Min z",

    "de": "Min z",

    "docEn": "height",

    "docDe": "Höhe",

    "placEn": "",

    "placDe": ""

  },

  "spatial.geometry.boundingBox.maxZ": {

    "en": "Max z",

    "de": "Max z",

    "docEn": "height",

    "docDe": "Höhe",

    "placEn": "",

    "placDe": ""

  },

  "spatial.geometry.boundingBox.accuracy": {

    "en": "Accuracy",

    "de": "Genauigkeit",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "spatial.geometry.otherGeometries": {

    "en": "Other geometries",

    "de": "Andere Geometrien",

    "docEn": "Datum, units",

    "docDe": "Bezugssystem, Einheiten",

    "placEn": "",

    "placDe": ""

  },

  "spatial.geometry.otherGeometries.type": {

    "en": "Type",

    "de": "Typ",

    "docEn": "(Point, Line, Polygon) (repeating group to allow a series of points to be recorded)",

    "docDe": "(Punkt, Linie, Polygon) (wiederholende Gruppe, um die Aufzeichnung einer Reihe von Punkten zu ermöglichen)",

    "placEn": "",

    "placDe": ""

  },

  "spatial.geometry.otherGeometries.type.x": {

    "en": "X",

    "de": "X",

    "docEn": "according to the spatial coordinate system in use",

    "docDe": "gemäß dem verwendeten räumlichen Koordinatensystem",

    "placEn": "",

    "placDe": ""

  },

  "spatial.geometry.otherGeometries.type.y": {

    "en": "Y",

    "de": "Y",

    "docEn": "according to the spatial coordinate system in use",

    "docDe": "gemäß dem verwendeten räumlichen Koordinatensystem",

    "placEn": "",

    "placDe": ""

  },

  "spatial.geometry.otherGeometries.type.z": {

    "en": "Z",

    "de": "Z",

    "docEn": "height",

    "docDe": "Höhe",

    "placEn": "",

    "placDe": ""

  },

  "spatial.geometry.otherGeometries.accuracy": {

    "en": "Accuracy",

    "de": "Genauigkeit",

    "docEn": "free-text, the accuracy of the point in metres.",

    "docDe": "Freitext, die Genauigkeit des Punktes in Metern.",

    "placEn": "",

    "placDe": ""

  },

  "spatial.geometry.entity": {

    "en": "Entity",

    "de": "Entität",

    "docEn": "GML, Well-known text (WKT).",

    "docDe": "GML, Well-known text (WKT).",

    "placEn": "",

    "placDe": ""

  },

  "spatial.geometry.storedPrecision": {

    "en": "Stored precision",

    "de": "Gespeicherte Genauigkeit",

    "docEn": "The precision of a coordinate as stored in the system and as delivered to the users.",

    "docDe": "Die Genauigkeit einer Koordinate, wie sie im System gespeichert und an die Benutzer geliefert wird.",

    "placEn": "",

    "placDe": ""

  },

  "spatial.geometry.area": {

    "en": "Area",

    "de": "Fläche",

    "docEn": "Units",

    "docDe": "Einheiten",

    "placEn": "",

    "placDe": ""

  },

  "spatial.representations": {

    "en": "Representations",

    "de": "Darstellungen",

    "docEn": "How a feature is represented on a map",

    "docDe": "Wie ein Merkmal auf einer Karte dargestellt wird",

    "placEn": "",

    "placDe": ""

  },

  "spatial.cartesianCoordinates3D": {

    "en": "Cartesian coordinates3d",

    "de": "Kartesische Koordinaten 3D",

    "docEn": "use for the local coordinates within a 3D model",

    "docDe": "wird für die lokalen Koordinaten innerhalb eines 3D-Modells verwendet",

    "placEn": "",

    "placDe": ""

  },

  "spatial.cartesianCoordinates3D.cartesianCoordinatesSystem": {

    "en": "Cartesian coordinates system",

    "de": "Kartesisches Koordinatensystem",

    "docEn": "this is the local coordinate system in use within the particular software",

    "docDe": "dies ist das lokale Koordinatensystem, das innerhalb der jeweiligen Software verwendet wird",

    "placEn": "",

    "placDe": ""

  },

  "spatial.cartesianCoordinates3D.viewpoints": {

    "en": "Viewpoints",

    "de": "Blickwinkel",

    "docEn": "a viewpoint within the 3D model, i.e. where the camera is positioned in the digitisation process",

    "docDe": "ein Blickwinkel innerhalb des 3D-Modells, d.h. wo die Kamera im Digitalisierungsprozess positioniert ist",

    "placEn": "",

    "placDe": ""

  },

  "spatial.cartesianCoordinates3D.viewpoints.x": {

    "en": "X",

    "de": "X",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "spatial.cartesianCoordinates3D.viewpoints.y": {

    "en": "Y",

    "de": "Y",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "spatial.cartesianCoordinates3D.viewpoints.z": {

    "en": "Z",

    "de": "Z",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "repositoryLocation": {

    "en": "Repository Location",

    "de": "Aufbewahrungsort",

    "docEn": "Institution currently holding the heritage asset, possibly with its current location.",

    "docDe": "Institution, die das Kulturgut aktuell verwahrt, ggf. mit aktuellem Standort.",

    "placEn": "e.g. Antikensammlung, Staatliche Museen zu Berlin (GND: 5035657-4)",

    "placDe": "z.B. Antikensammlung, Staatliche Museen zu Berlin (GND: 5035657-4)"

  },

  "publicationStatement": {

    "en": "Publication statement",

    "de": "Publikationsangabe",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "publicationStatement.publisher": {

    "en": "Publisher",

    "de": "Herausgeber",

    "docEn": "Organisation publishing or making accessible this record about the heritage asset.",

    "docDe": "Organisation, die diesen Datensatz zum Kulturgut veröffentlicht bzw. zugänglich macht.",

    "placEn": "e.g. Staatliche Museen zu Berlin, Antikensammlung",

    "placDe": "z.B. Staatliche Museen zu Berlin, Antikensammlung"

  },

  "publicationStatement.place": {

    "en": "Place",

    "de": "Ort",

    "docEn": "Place of publication.",

    "docDe": "Ort der Veröffentlichung.",

    "placEn": "e.g. Berlin, Germany",

    "placDe": "z.B. Berlin, Deutschland"

  },

  "publicationStatement.date": {

    "en": "Date",

    "de": "Datum",

    "docEn": "Date of publication.",

    "docDe": "Datum der Veröffentlichung.",

    "placEn": "e.g. 2025-04-18",

    "placDe": "z.B. 2025-04-18"

  },

  "rights": {

    "en": "Rights",

    "de": "Rechte",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "rights.copyrightCreditLine": {

    "en": "Copyright Credit Line",

    "de": "Urheberrechtsvermerk",

    "docEn": "Copyright notice for the heritage asset itself (not for the digital resource). Name of the rights holder and year if applicable.",

    "docDe": "Urheberrechtsvermerk für das Kulturgut selbst (nicht für die digitale Ressource). Name des Rechteinhabers und ggf. Jahr.",

    "placEn": "e.g. Staatliche Museen zu Berlin, Antikensammlung, 2025",

    "placDe": "z.B. Staatliche Museen zu Berlin, Antikensammlung, 2025"

  },

  "rights.accessRights": {

    "en": "Access Rights",

    "de": "Zugriffsrechte",

    "docEn": "A statement about the access rights to the heritage asset.",

    "docDe": "Aussage über die Zugänglichkeit des Kulturguts.",

    "placEn": "e.g. Open Access | Restricted Access",

    "placDe": "z.B. Open Access | Eingeschränkter Zugang"

  },

  "rights.reproductionRights": {

    "en": "Reproduction Rights",

    "de": "Reproduktionsrechte",

    "docEn": "A statement about the reproduction rights for the heritage asset, including contact information.",

    "docDe": "Aussage über die Reproduktionsrechte am Kulturgut, einschließlich Kontaktinformationen. ",

    "placEn": "e.g. reproductions free of charge for research and teaching; commercial use via the foundation\\'s image agency",

    "placDe": "z.B. Reproduktionen für Forschung und Lehre kostenfrei; kommerzielle Nutzung über die Bildagentur der Stiftung"

  },

  "rights.licence": {

    "en": "Licence",

    "de": "Lizenz",

    "docEn": "Licence for the heritage asset. Recommendation: use a Creative Commons URI.",

    "docDe": "Lizenz für das Kulturgut. Empfehlung: Creative-Commons-URI verwenden.",

    "placEn": "e.g. CC BY-SA 4.0",

    "placDe": "z.B. CC BY-SA 4.0"

  },

  "rights.europeanaRights": {

    "en": "Europeana rights",

    "de": "Europeana-Rechte",

    "docEn": "Europeana Rights – one of the 12 rights statements used by Europeana in its portal.  See: http://pro.europeana.eu/page/available-rights-statements.  Required for content being provided to Europeana.",

    "docDe": "Europeana-Rechte – eine der 12 Rechte-Erklärungen, die Europeana in ihrem Portal verwendet. Erforderlich für Inhalte, die Europeana bereitgestellt werden.",

    "placEn": "",

    "placDe": ""

  },

  "references": {

    "en": "References",

    "de": "Referenzen",

    "docEn": "These are sources of information about the heritage asset in publications and archival sources (for example, photographs, drawings, plans, bibliographic references etc.). Digital objects (image, text, video, audio, 3D model, etc.) which are accessible online and will represent the asset in Europeana should be describe as Digital Resources, not References.",

    "docDe": "Dies sind Informationsquellen über das Kulturgut in Publikationen und Archivquellen (z.B. Fotografien, Zeichnungen, Pläne, bibliografische Referenzen usw.). Digitale Objekte (Bild, Text, Video, Audio, 3D-Modell usw.), die online zugänglich sind und das Gut in Europeana repräsentieren, sollten als digitale Ressourcen (Digital Resources) und nicht als Referenzen beschrieben werden.",

    "placEn": "",

    "placDe": ""

  },

  "references.appellation": {

    "en": "Appellation",

    "de": "Bezeichnung",

    "docEn": "The ID and name given to the information source.",

    "docDe": "Die ID und der Name der Informationsquelle.",

    "placEn": "",

    "placDe": ""

  },

  "references.appellation.id": {

    "en": "Reference ID",

    "de": "Referenz-ID",

    "docEn": "Unique ID or URI assigned to the cited information source.",

    "docDe": "Eindeutige ID oder URI der zitierten Informationsquelle.",

    "placEn": "e.g. https://doi.org/10.11588/diglit.3456",

    "placDe": "z.B. https://doi.org/10.11588/diglit.3456"

  },

  "references.appellation.name": {

    "en": "Title",

    "de": "Titel",

    "docEn": "The name or title given to the cited information source.",

    "docDe": "Name oder Titel der zitierten Informationsquelle. [Hinweis: laut Schema steht \\'Appellation\\' (Name+ID) als erstes Unterelement von References.]",

    "placEn": "e.g. Description of ancient sculptures excluding the Pergamon finds",

    "placDe": "z.B. Beschreibung der antiken Skulpturen mit Ausschluss der pergamenischen Fundstücke"

  },

  "references.actors": {

    "en": "Actors",

    "de": "Akteure",

    "docEn": "(creator, author, contributor, editor, etc.)",

    "docDe": "(Ersteller, Autor, Mitwirkender, Herausgeber usw.)",

    "placEn": "",

    "placDe": ""

  },

  "references.actors.id": {

    "en": "Actor ID",

    "de": "Akteur-ID",

    "docEn": "Unique ID of the person or organisation involved in the cited source (e.g. author, publisher).",

    "docDe": "Eindeutige ID der Person oder Organisation, die an der zitierten Quelle beteiligt war (z.B. Autor, Herausgeber).",

    "placEn": "e.g. https://d-nb.info/gnd/2015909-2",

    "placDe": "z.B. https://d-nb.info/gnd/2015909-2"

  },

  "references.actors.name": {

    "en": "Name",

    "de": "Name",

    "docEn": "The name of the person or organization)",

    "docDe": "Der Name der Person oder Organisation)",

    "placEn": "",

    "placDe": ""

  },

  "references.actors.actorType": {

    "en": "Actor type",

    "de": "Akteurtyp",

    "docEn": "Indicates whether the actor is an individual, a group of individuals or an organization.",

    "docDe": "Gibt an, ob der Akteur eine Einzelperson, eine Gruppe von Personen oder eine Organisation ist.",

    "placEn": "",

    "placDe": ""

  },

  "references.actors.roles": {

    "en": "Roles",

    "de": "Rollen",

    "docEn": "The roles of the actor (creator, custodian, repository manager, curator, architect, sculptor, photographer, compiler, etc.). Use of a controlled vocabulary such as the Getty Art and Architecture thesaurus is recommended; the vocabulary used should be indicated using an attribute.",

    "docDe": "Die Rollen des Akteurs (Ersteller, Verwahrer, Repository-Manager, Kurator, Architekt, Bildhauer, Fotograf, Kompilator usw.).",

    "placEn": "",

    "placDe": ""

  },

  "references.actors.contacts": {

    "en": "Contacts",

    "de": "Kontakte",

    "docEn": "Contact information if known",

    "docDe": "Kontaktinformationen, falls bekannt",

    "placEn": "",

    "placDe": ""

  },

  "references.actors.contacts.name": {

    "en": "Name",

    "de": "Name",

    "docEn": "Title, first name, last name, other name",

    "docDe": "Titel, Vorname, Nachname, sonstiger Name",

    "placEn": "",

    "placDe": ""

  },

  "references.actors.contacts.role": {

    "en": "Role",

    "de": "Rolle",

    "docEn": "Role of the organisation or person in relation to the cited reference.",

    "docDe": "Rolle der Organisation oder Person in Bezug auf die zitierte Referenz.",

    "placEn": "e.g. Publisher",

    "placDe": "z.B. Herausgeber"

  },

  "references.actors.contacts.organization": {

    "en": "Organisation",

    "de": "Organisation",

    "docEn": "Name of the organisation involved in the cited source.",

    "docDe": "Name der Organisation, die an der zitierten Quelle beteiligt war.",

    "placEn": "e.g. Royal Museums of Berlin",

    "placDe": "z.B. Königliche Museen zu Berlin"

  },

  "references.actors.contacts.email": {

    "en": "Email",

    "de": "E-Mail",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "references.actors.contacts.address": {

    "en": "Address",

    "de": "Adresse",

    "docEn": "The postal address of the person or organization",

    "docDe": "Die Postanschrift der Person oder Organisation",

    "placEn": "",

    "placDe": ""

  },

  "references.actors.contacts.address.buildingName": {

    "en": "Building name",

    "de": "Gebäudename",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "references.actors.contacts.address.numberInRoad": {

    "en": "Number in road",

    "de": "Hausnummer",

    "docEn": "The number in a road or street used to identify a property",

    "docDe": "Die Hausnummer in einer Straße zur Identifizierung eines Grundstücks",

    "placEn": "",

    "placDe": ""

  },

  "references.actors.contacts.address.roadName": {

    "en": "Road name",

    "de": "Straßenname",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "references.actors.contacts.address.townOrCity": {

    "en": "Town or city",

    "de": "Stadt oder Ort",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "references.actors.contacts.address.postcodeOrZipcode": {

    "en": "Postcode or zipcode",

    "de": "Postleitzahl",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "references.actors.contacts.address.locality": {

    "en": "Locality",

    "de": "Örtlichkeit",

    "docEn": "A named area within which a monument or building lies",

    "docDe": "Ein benanntes Gebiet, in dem ein Denkmal oder Gebäude liegt",

    "placEn": "",

    "placDe": ""

  },

  "references.actors.contacts.address.adminArea": {

    "en": "Admin area",

    "de": "Verwaltungsbezirk",

    "docEn": "The name by which an administrative area is known, e.g. Shropshire",

    "docDe": "Der Name, unter dem ein Verwaltungsgebiet bekannt ist, z.B. Shropshire",

    "placEn": "",

    "placDe": ""

  },

  "references.actors.contacts.address.country": {

    "en": "Country",

    "de": "Land",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "references.actors.contacts.phone": {

    "en": "Phone",

    "de": "Telefon",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "references.actors.contacts.fax": {

    "en": "Fax",

    "de": "Fax",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "references.actors.contacts.description": {

    "en": "Description",

    "de": "Beschreibung",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "references.actors.vitalDates": {

    "en": "Vital dates",

    "de": "Lebensdaten",

    "docEn": "Date of birth, date of death if known.",

    "docDe": "Geburtsdatum, Todesdatum falls bekannt.",

    "placEn": "",

    "placDe": ""

  },

  "references.actors.vitalDates.dateOfBirth": {

    "en": "Date of birth",

    "de": "Geburtsdatum",

    "docEn": "If this is a prehistoric date use the minus (-) sign to denote it.",

    "docDe": "Wenn es sich um ein prähistorisches Datum handelt, verwenden Sie das Minuszeichen (-), um dies zu kennzeichnen.",

    "placEn": "",

    "placDe": ""

  },

  "references.actors.vitalDates.dateOfDeath": {

    "en": "Date of death",

    "de": "Todesdatum",

    "docEn": "If this is a prehistoric date use the minus (-) sign to denote it.",

    "docDe": "Wenn es sich um ein prähistorisches Datum handelt, verwenden Sie das Minuszeichen (-), um dies zu kennzeichnen.",

    "placEn": "",

    "placDe": ""

  },

  "references.actors.vitalDates.displayDate": {

    "en": "Display date",

    "de": "Anzeigedatum",

    "docEn": "A free text field used to display the date or period for users (e.g. early 19th century, 1950s). The element may be repeated using the XML:lang attribute if the element value is available in alternate languages. A preferred/alternate attribute should be used to indicate which value is preferred.",

    "docDe": "Ein Freitextfeld, das zur Anzeige des Datums oder der Epoche für Benutzer verwendet wird. Ein bevorzugt/alternativ-Attribut sollte verwendet werden, um anzuzeigen, welcher Wert bevorzugt wird.",

    "placEn": "",

    "placDe": ""

  },

  "references.actors.placeOfBirth": {

    "en": "Place of birth",

    "de": "Geburtsort",

    "docEn": "Use of a controlled vocabulary such as http://www.geonames.org/ is recommended, and the vocabulary used may be indicated with an attribute.",

    "docDe": "Die Verwendung eines kontrollierten Vokabulars wie http://www.geonames.org/ wird empfohlen, und das verwendete Vokabular kann mit einem Attribut angegeben werden.",

    "placEn": "",

    "placDe": ""

  },

  "references.actors.placeOfDeath": {

    "en": "Place of death",

    "de": "Sterbeort",

    "docEn": "Use of a controlled vocabulary such as http://www.geonames.org/ is recommended, and the vocabulary used may be indicated with an attribute.",

    "docDe": "Die Verwendung eines kontrollierten Vokabulars wie http://www.geonames.org/ wird empfohlen, und das verwendete Vokabular kann mit einem Attribut angegeben werden.",

    "placEn": "",

    "placDe": ""

  },

  "references.actors.placeOfActivity": {

    "en": "Place of activity",

    "de": "Ort der Tätigkeit",

    "docEn": "Use of a controlled vocabulary such as http://www.geonames.org/ is recommended, and the vocabulary used may be indicated with an attribute.",

    "docDe": "Die Verwendung eines kontrollierten Vokabulars wie http://www.geonames.org/ wird empfohlen, und das verwendete Vokabular kann mit einem Attribut angegeben werden.",

    "placEn": "",

    "placDe": ""

  },

  "references.actors.bibliographicalNote": {

    "en": "Bibliographical note",

    "de": "Bibliografische Notiz",

    "docEn": "The element may be repeated using the XML:lang attribute if the element value is available in alternate languages. A preferred/alternate attribute may be used to indicate which value is preferred.",

    "docDe": "Das Element kann unter Verwendung des XML:lang-Attributs wiederholt werden, wenn der Elementwert in alternativen Sprachen verfügbar ist. Ein bevorzugt/alternativ-Attribut kann verwendet werden, um anzuzeigen, welcher Wert bevorzugt wird.",

    "placEn": "",

    "placDe": ""

  },

  "references.type": {

    "en": "Type",

    "de": "Typ",

    "docEn": "The type of the cited source.",

    "docDe": "Art der zitierten Quelle.",

    "placEn": "e.g. book | article | website",

    "placDe": "z.B. Buch | Artikel | Website"

  },

  "references.rights": {

    "en": "Rights",

    "de": "Rechte",

    "docEn": "Rights information relating to this cited source.",

    "docDe": "Rechtsangaben zu dieser zitierten Quelle.",

    "placEn": "e.g. This object is protected by copyright but freely accessible ...",

    "placDe": "z.B. Dieses Objekt ist durch das Urheberrecht geschützt, aber kostenfrei zugänglich ..."

  },

  "references.publicationStatement": {

    "en": "Publication statement",

    "de": "Publikationsangabe",

    "docEn": "",

    "docDe": "",

    "placEn": "",

    "placDe": ""

  },

  "references.publicationStatement.publisher": {

    "en": "Publisher (Publication Statement)",

    "de": "Herausgeber (Publikationsangabe)",

    "docEn": "Publisher of the cited source, as part of the publication statement (place, date, publisher).",

    "docDe": "Herausgeber der zitierten Quelle, im Sinne der Publikationsangabe (Ort, Datum, Herausgeber).",

    "placEn": "e.g. Royal Museums of Berlin",

    "placDe": "z.B. Königliche Museen zu Berlin"

  },

  "references.publicationStatement.place": {

    "en": "Place",

    "de": "Ort",

    "docEn": "Of publication",

    "docDe": "Der Publikation",

    "placEn": "",

    "placDe": ""

  },

  "references.publicationStatement.date": {

    "en": "Date",

    "de": "Datum",

    "docEn": "Of publication",

    "docDe": "Der Publikation",

    "placEn": "",

    "placDe": ""

  },

  "references.note": {

    "en": "Note",

    "de": "Anmerkung",

    "docEn": "Additional note on the cited source.",

    "docDe": "Zusätzliche Anmerkung zur zitierten Quelle.",

    "placEn": "e.g. Second, revised edition",

    "placDe": "z.B. Zweite, überarbeitete Auflage"

  },

  "references.link": {

    "en": "Link",

    "de": "Link",

    "docEn": "Direct link to the cited resource.",

    "docDe": "Direkter Link zur zitierten Ressource.",

    "placEn": "e.g. https://doi.org/10.11588/diglit.3456#0291",

    "placDe": "z.B. https://doi.org/10.11588/diglit.3456#0291"

  },

  "hasRepresentation": {

    "en": "Has Representation",

    "de": "Hat Darstellung",

    "docEn": "The relation between this heritage asset and a digital resource in which it is represented. Give the ID number of the target record or a URI.",

    "docDe": "Beziehung zwischen diesem Kulturgut und einer digitalen Ressource, in der es dargestellt wird. [Hinweis: UI-Beschriftung \\'Hat Darstellung\\'; Schema-Begriff \\'hasRepresentation\\'.]",

    "placEn": "e.g. 3818816 (ID of the digital resource)",

    "placDe": "z.B. 3818816 (ID der digitalen Ressource)"

  },

  "isSuccessorOf": {

    "en": "Is Successor Of",

    "de": "Ist Nachfolger Von",

    "docEn": "The relation between a heritage asset and an earlier one, e.g. a church is successor of an earlier church on the same site.",

    "docDe": "Beziehung zwischen diesem Kulturgut und einem früheren, z.B. eine Kirche ist Nachfolgerin einer früheren Kirche am selben Ort.",

    "placEn": "e.g. ID of the predecessor object",

    "placDe": "z.B. ID des Vorgängerobjekts"

  },

  "wasPresentAt": {

    "en": "Was Present At",

    "de": "War Anwesend Bei",

    "docEn": "The relation between a heritage asset and an activity that it was present at, e.g. a castle was present at a siege, a cross was present at a digitisation event.",

    "docDe": "Beziehung zwischen diesem Kulturgut und einer Aktivität, bei der es anwesend war – z.B. eine Burg war bei einer Belagerung anwesend, ein Kreuz war bei einer Digitalisierung anwesend.",

    "placEn": "e.g. conservation measures 2010, carried out by a qualified conservator",

    "placDe": "z.B. Restaurierungsmaßnahmen 2010, durchgeführt von einer Diplom-Restauratorin/einem Diplom-Restaurator"

  },

  "hasPart": {

    "en": "Has Part",

    "de": "Hat Teil",

    "docEn": "Used for heritage assets that incorporate other assets.",

    "docDe": "Wird für Kulturgüter verwendet, die andere Objekte enthalten.",

    "placEn": "e.g. SK 740.a (ID of a related sub-object)",

    "placDe": "z.B. SK 740.a (ID eines zugehörigen Teilobjekts)"

  },

  "isPartOf": {

    "en": "Is Part Of",

    "de": "Ist Teil Von",

    "docEn": "The relation between a heritage asset and the larger heritage asset of which it is part.",

    "docDe": "Beziehung zwischen diesem Kulturgut und dem größeren Kulturgut, zu dem es gehört.",

    "placEn": "e.g. ID of the parent heritage asset",

    "placDe": "z.B. ID des übergeordneten Kulturguts"

  },

  "isReplicaOf": {

    "en": "Is Replica Of",

    "de": "Ist Replik Von",

    "docEn": "The relation between a replica and the original heritage asset.",

    "docDe": "Beziehung zwischen einer Replik und dem Original-Kulturgut.",

    "placEn": "e.g. ID of the original object",

    "placDe": "z.B. ID des Originalobjekts"

  },

  "wasDigitizedBy": {

    "en": "Was Digitized By",

    "de": "Wurde Digitalisiert Von",

    "docEn": "The relation between a heritage asset and an activity in which it was digitised (a specialisation of \\'Was Present At\\').",

    "docDe": "Beziehung zwischen diesem Kulturgut und einer Aktivität, bei der es digitalisiert wurde (Spezialfall von \\'War Anwesend Bei\\').",

    "placEn": "e.g. Pilot project for 3D documentation of 18 Attic grave monuments of the Antikensammlung, Berlin",

    "placDe": "z.B. Pilotprojekt zur 3D-Erfassung und Asset-Dokumentation von 18 attischen Grabmälern der Antikensammlung, Berlin"

  },

  "dcRelation": {

    "en": "DC Relation",

    "de": "DC-Beziehung",

    "docEn": "General link to related resources. URI of the object in an external system.",

    "docDe": "Allgemeine Verknüpfung zu verwandten Ressourcen. URI des Objekts in einem externen System.",

    "placEn": "e.g. https://id.smb.museum/object/699203",

    "placDe": "z.B. https://id.smb.museum/object/699203"

  }

};

const inlineEditing = reactive({});



// UI Translations Dictionary

const uiTranslations = {

  en: {

    add: 'Add', addItem: '+ Add Item', edit: 'Edit', del: 'Del', duplicate: 'Duplicate',

    deletePrompt: 'Are you sure you want to delete this record?',

    deleteEntryPrompt: 'Delete this entry?', actions: 'Actions',

    value: 'Value', noItems: 'No items added yet.', select: 'Select',

    saveToList: 'Add', saved: 'Saved', cancel: 'Cancel',

    save: 'Save', items: 'items',

    languageTip: '💡 Tip: Click a flag to select/deselect a language. Click the star icon to set it as the preferred language.',

    validationHint: 'Enter valid value',

    validationEmail: 'Enter valid email address',

    addtemplate: 'Add Template', template: 'Use Template', templateName: 'Template Name', or: 'OR', customEdit: 'Custom Edit', deleteTemplatePrompt: 'Delete Template?', deleteTemplateDesc: 'Are you sure you want to delete this template?'

  },

  de: {

    add: 'hinzufügen', addItem: '+ Element hinzufügen', edit: 'bearbeiten', del: 'Löschen', duplicate: 'Duplizieren',

    deletePrompt: 'Möchten Sie diesen Datensatz wirklich löschen?',

    deleteEntryPrompt: 'Diesen Eintrag löschen?', actions: 'Aktionen',

    value: 'Wert', noItems: 'Noch keine Elemente hinzugefügt.', select: 'auswählen',

    saveToList: 'Hinzufügen', saved: 'Gespeicherte', cancel: 'Abbrechen',

    save: 'speichern', items: 'Elemente',

    languageTip: '💡 Tipp: Klicken Sie auf eine Flagge, um eine Sprache auszuwählen/abzuwählen. Klicken Sie auf das Sternsymbol, um sie als bevorzugte Sprache festzulegen.',

    validationHint: 'Geben Sie einen gültigen Wert ein',

    validationEmail: 'Geben Sie eine gültige E-Mail-Adresse ein',

    addtemplate: 'Vorlage erstellen', template: 'Vorlage nutzen', templateName: 'Name der Vorlage', or: 'ODER', customEdit: 'Manuell bearbeiten', deleteTemplatePrompt: 'Vorlage löschen?', deleteTemplateDesc: 'Sind Sie sicher, dass Sie diese Vorlage löschen möchten?'

  }

};



const t = (key) => uiTranslations[currentLocale.value]?.[key] || uiTranslations.en[key];



const getLabel = (path, fallback, type = 'name') => {

  const lang = currentLocale.value === 'de' ? 'de' : 'en';

  if (type === 'doc') {

    return fieldLabels[path]?.[lang === 'de' ? 'docDe' : 'docEn'] || fallback;

  }

  if (type === 'plac') {

    return fieldLabels[path]?.[lang === 'de' ? 'placDe' : 'placEn'] || fallback;

  }

  return fieldLabels[path]?.[lang] || fallback;

};

const today = new Date();

const maxDate = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;



const items = ref([]);

const isEditing = ref(false);

const editIndex = ref(null);

const form = reactive({ 'recordInformation.id': '',

  'recordInformation.source': '',

  'recordInformation.source#lang': '',

  'recordInformation.country': '',

  'recordInformation.country#lang': '',

  'recordInformation.country#authority': 'iso31661a2',

  'recordInformation.creation.date': '',

  'recordInformation.creation.contacts': [],

  'recordInformation.language': [defaultMetadataLanguage?.value || 'de'],

  'recordInformation.language#lang': '',

  'recordInformation.metadataRights': globalRights?.metadataRights || '',

  'recordInformation.metadataRights#lang': '',

  'appellation.id': '',

  'appellation.name': [{ _value: '', 'appellation.name#lang': defaultMetadataLanguage?.value || 'de', 'appellation.name#preferred': true }],

  'description': '',

  'generalType': '',

  'actors': [],

  'conditions.condition': '',

  'conditions.condition#lang': '',

  'conditions.conditionAssessment': '',

  'conditions.conditionAssessment#lang': '',

  'conditions.conditionDate': '',

  'conditions.conditionDate#lang': '',

  'conditions.wasPresentAt': '',

  'provenance': '',

  'provenance#lang': '',

  'characters.heritageAssetType': [],

  'characters.heritageAssetType#term': '',

  'characters.heritageAssetType#lang': '',

  'characters.heritageAssetType#namespace': '',

  'characters.heritageAssetType#termUID': '',

  'characters.temporal': [],

  'characters.materials': [],

  'characters.materials#lang': '',

  'characters.inscriptions': [],

  'characters.inscriptions#lang': '',

  'characters.inscriptions#namespace': '',

  'characters.inscriptions#preferred': false,

  'characters.dimensions': [],

  'spatial': [],

  'repositoryLocation': collectionInstitution?.fullLabel || '',

  'repositoryLocation#lang': '',

  'rights.copyrightCreditLine': globalRights?.copyrightCreditLine || '',

  'rights.copyrightCreditLine#lang': '',

  'rights.accessRights': globalRights?.accessRights || '',

  'rights.accessRights#lang': '',

  'rights.reproductionRights': globalRights?.reproductionRights || '',

  'rights.reproductionRights#lang': '',

  'rights.licence': resolveLicenceUri(globalRights?.licence, currentLocale?.value || 'de') || '',

  'rights.licence#lang': '',

  'references': [],

  'hasRepresentation': [],

  'isSuccessorOf': [],

  'wasPresentAt': [],

  'hasPart': [],

  'isPartOf': [],

  'isReplicaOf': [],

  'wasDigitizedBy': [],

  'dcRelation': [] });



// Automatically prefill repositoryLocation from Collection if currently empty

watch(() => collectionInstitution.fullLabel, (newVal) => {

  if (newVal && !form['repositoryLocation']) {

    form['repositoryLocation'] = newVal;

  }

}, { immediate: true });



// Language Selection Helpers

const toggleLang = (fieldPath, code, isDrawer = false) => {

  const targetForm = isDrawer ? drawerForm : form;

  if (!targetForm[fieldPath]) targetForm[fieldPath] = [];

  const arr = targetForm[fieldPath];

  const idx = arr.indexOf(code);

  if (idx === -1) {

    arr.push(code);

  } else {

    arr.splice(idx, 1);

  }

};



const preferredLanguages = reactive({});

const setPreferredLang = (fieldPath, target, isDrawer = false) => {

  const targetForm = isDrawer ? drawerForm : form;

  if (!targetForm[fieldPath] || !Array.isArray(targetForm[fieldPath])) return;

  const arr = targetForm[fieldPath];



  const getPrefKey = (obj) => {

    return Object.keys(obj).find((k) => k === 'preferred' || k === '#preferred' || k.endsWith('#preferred')) || fieldPath + '#preferred';

  };



  const getLangKey = (obj) => {

    return Object.keys(obj).find((k) => k === 'lang' || k === '#lang' || k.endsWith('#lang')) || fieldPath + '#lang';

  };



  if (typeof target === 'string') {

    preferredLanguages[fieldPath] = target;

    const isStringArray = arr.length > 0 && typeof arr[0] === 'string';

    if (isStringArray && !arr.includes(target)) {

      arr.push(target);

    }

  }



  arr.forEach((item, idx) => {

    if (typeof item === 'object' && item !== null) {

      const prefKey = getPrefKey(item);

      const langKey = getLangKey(item);



      let isMatch = false;

      if (typeof target === 'number') {

        isMatch = (idx === target);

      } else if (typeof target === 'object' && target !== null) {

        isMatch = (item === target);

      } else if (typeof target === 'string') {

        isMatch = (item[langKey] === target || item['_value'] === target);

      }



      item[prefKey] = isMatch;

    }

  });

};



// Drawer State

const isDrawerOpen = ref(false);

const activeDrawerField = ref('');

const drawerEditIndex = ref(-1);

const drawerForm = reactive({});



const handlePeriodoSelect = (data) => {

  if (data.periodName) drawerForm['periodName'] = data.periodName;

  if (data.startDate) drawerForm['timeSpan.startDate'] = normalizeYearDate(data.startDate);

  if (data.endDate) drawerForm['timeSpan.endDate'] = normalizeYearDate(data.endDate);

  if (data.dateRangeQualifier) drawerForm['timeSpan.dateRangeQualifier'] = data.dateRangeQualifier;

  if (!drawerForm['displayDate']) {

    drawerForm['displayDate'] = formatPeriodDisplay(data.startDate, data.endDate, data.periodName);

  }

};



const quickPeriodoSelect = ref('');



const formatPeriodDisplay = (start, stop, name) => {

  if (!start && !stop) return name || '';

  const fmt = (y) => {

    if (!y) return '';

    const n = parseInt(y, 10);

    if (isNaN(n)) return y;

    return n < 0 ? `${Math.abs(n)} v. Chr.` : `${n} n. Chr.`;

  };

  if (start && stop) return `${fmt(start)} – ${fmt(stop)}`;

  return fmt(start || stop);

};



const handleDirectPeriodoAdd = (data) => {

  if (!Array.isArray(form['characters.temporal'])) {

    form['characters.temporal'] = [];

  }

  const sDate = normalizeYearDate(data.startDate || '');

  const eDate = normalizeYearDate(data.endDate || '');

  const dDate = formatPeriodDisplay(sDate, eDate, data.periodName);

  

  form['characters.temporal'].push({

    'periodName': data.periodName || '',

    'timeSpan.startDate': sDate,

    'timeSpan.endDate': eDate,

    'timeSpan.dateRangeQualifier': data.dateRangeQualifier || '',

    'displayDate': dDate

  });

  quickPeriodoSelect.value = '';

};



const clearFormActors = () => {

  form['actors'] = [];

};



// --- Template State and Logic ---

const store = shallowRef(null);

const templates = ref({});

const activeTemplateField = ref('');

const templateModal = ref(null);

const addTemplateModal = ref(null);

const deleteTemplateModal = ref(null);

const templateToDelete = ref(null);

const newTemplateName = ref('');



const formSnapshot = ref('');

const isFormDirty = () => formSnapshot.value !== '' && JSON.stringify(form) !== formSnapshot.value;



const handleInvalid = (event) => {

  if (event?.target && typeof event.target.scrollIntoView === 'function') {

    event.target.scrollIntoView({ behavior: 'smooth', block: 'center' });

    event.target.focus();

  }

};



const handleKeydown = (e) => {

  if (e.key === 'Escape' && isDrawerOpen.value) {

    e.preventDefault();

    closeDrawer();

    return;

  }

  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {

    if (isDrawerOpen.value) {

      e.preventDefault();

      saveDrawer();

    }

  }

};



onMounted(async () => {

  formSnapshot.value = JSON.stringify(form);

  window.addEventListener('keydown', handleKeydown);

  try {

    store.value = await load('templates.json', { autoSave: true });

    for (const f of ['contacts', 'references', 'temporal', 'spatial']) {

      let tpls = await store.value.get(f);

      if (!tpls || tpls.length === 0) {

        const raw = localStorage.getItem(`hermes_templates_heritage_${f}`);

        if (raw) tpls = JSON.parse(raw);

      }

      templates.value[f] = tpls || [];

    }

  } catch (error) {

    console.error('Error loading templates store:', error);

    for (const f of ['contacts', 'references', 'temporal', 'spatial']) {

      try {

        const raw = localStorage.getItem(`hermes_templates_heritage_${f}`);

        templates.value[f] = raw ? JSON.parse(raw) : [];

      } catch (e) {

        templates.value[f] = [];

      }

    }

  }

});



const openTemplateModal = (field) => {

  activeTemplateField.value = field;

  templateModal.value?.showModal();

};



const openAddTemplateModal = (field) => {

  activeTemplateField.value = field;

  newTemplateName.value = '';

  addTemplateModal.value?.showModal();

};



const addTemplate = async () => {

  if (!activeTemplateField.value || !newTemplateName.value.trim()) return;

  const tplName = newTemplateName.value.trim();

  const field = activeTemplateField.value;

  

  if (!templates.value[field]) templates.value[field] = [];

  

  const existingIdx = templates.value[field].findIndex(t => t.name.trim().toLowerCase() === tplName.toLowerCase());

  if (existingIdx !== -1) {

    templates.value[field][existingIdx].data = JSON.parse(JSON.stringify(drawerForm));

  } else {

    templates.value[field].push({

      name: tplName,

      data: JSON.parse(JSON.stringify(drawerForm))

    });

  }

  

  if (store.value) {

    await store.value.set(field, JSON.parse(JSON.stringify(templates.value[field])));

    await store.value.save();

  }

  try {

    localStorage.setItem(`hermes_templates_heritage_${field}`, JSON.stringify(templates.value[field]));

  } catch (e) {}

  addTemplateModal.value?.close();

};



const applyTemplate = (templateData) => {

  // Clear out the current drawer form first

  Object.keys(drawerForm).forEach(k => delete drawerForm[k]);

  // Apply the template data

  Object.assign(drawerForm, JSON.parse(JSON.stringify(templateData)));

  templateModal.value?.close();

};



const confirmDeleteTemplate = (field, idx) => {

  templateToDelete.value = { field, idx };

  deleteTemplateModal.value?.showModal();

};



const executeDeleteTemplate = async () => {

  if (templateToDelete.value) {

    const { field, idx } = templateToDelete.value;

    templates.value[field].splice(idx, 1);

    if (store.value) {

      await store.value.set(field, JSON.parse(JSON.stringify(templates.value[field])));

      await store.value.save();

    }

    try {

      localStorage.setItem(`hermes_templates_heritage_${field}`, JSON.stringify(templates.value[field]));

    } catch (e) {}

    templateToDelete.value = null;

  }

};

// --------------------------------



const openDrawer = (field, index = -1) => {

  activeDrawerField.value = field;

  drawerEditIndex.value = index;

  Object.keys(drawerForm).forEach(k => delete drawerForm[k]); // clear state

  

  if (index > -1) {

    const item = form[field][index];

    if (typeof item === 'object' && item !== null) {

      Object.assign(drawerForm, JSON.parse(JSON.stringify(item)));

      // Populate preferred languages for drawer fields

      Object.keys(drawerForm).forEach(k => {

        if (k.endsWith('language') && Array.isArray(drawerForm[k])) {

          preferredLanguages[field + '.' + k] = drawerForm[k][0] || '';

        }

      });

    } else {

      drawerForm['_value'] = item;

    }

  }

  if (field === 'spatial') {

    showManualGeoFields.value = false;

    if (index > -1) {

      const item = form[field][index];

      if (item && item['locationSet.historicalName'] && !item['locationSet.geopoliticalArea']) {

        spatialKind.value = 'historical';

      } else if (item && item['locationSet.geopoliticalArea']) {

        spatialKind.value = 'modern';

      } else {

        spatialKind.value = 'historical';

      }

    } else {

      spatialKind.value = 'historical';

    }

  }

  isDrawerOpen.value = true;

};



const closeDrawer = () => { isDrawerOpen.value = false; };



const spatialKind = ref('historical');

const showManualGeoFields = ref(false);



const setSpatialKind = (kind) => {

  spatialKind.value = kind;

  if (kind === 'historical') {

    // For historical findspots, geopolitical area information is removed

    drawerForm['locationSet.geopoliticalArea'] = '';

    drawerForm['locationSet.geopoliticalAreaType'] = '';

    if (!drawerForm['locationSet.historicalName'] && drawerForm['locationSet.namedLocation']) {

      drawerForm['locationSet.historicalName'] = drawerForm['locationSet.namedLocation'];

    }

  } else {

    // For modern places, automatically populate geopolitical area if known

    if (!drawerForm['locationSet.geopoliticalArea'] && drawerForm['locationSet.namedLocation']) {

      onModernLocationInput();

    }

  }

};



const onHistoricalNameInput = () => {

  if (!drawerForm['locationSet.namedLocation']) {

    drawerForm['locationSet.namedLocation'] = drawerForm['locationSet.historicalName'];

  }

};



const onModernLocationInput = () => {

  if (spatialKind.value !== 'modern') return;

  const val = drawerForm['locationSet.namedLocation'];

  if (!val) return;

  const resolved = resolveGeopoliticalArea(val);

  if (resolved) {

    drawerForm['locationSet.geopoliticalArea'] = resolved.geopoliticalArea;

    if (!drawerForm['locationSet.geopoliticalAreaType']) {

      drawerForm['locationSet.geopoliticalAreaType'] = resolved.geopoliticalAreaType || 'country';

    }

  }

};



const handleSpatialPlaceSelect = (item) => {

  if (!item) return;

  if (item.source === 'pleiades' || item.source === 'iDAI.gazetteer' || spatialKind.value === 'historical') {

    spatialKind.value = 'historical';

    drawerForm['locationSet.historicalName'] = item.name;

    drawerForm['locationSet.namedLocation'] = item.name;

    // For historical names, geopolitical area information is removed

    drawerForm['locationSet.geopoliticalArea'] = '';

    drawerForm['locationSet.geopoliticalAreaType'] = '';

  } else {

    // Modern place: auto-fill geopolitical area

    spatialKind.value = 'modern';

    drawerForm['locationSet.namedLocation'] = item.name;

    const country = formatGeopoliticalCountry(item.country, item.countryCode);

    if (country) {

      drawerForm['locationSet.geopoliticalArea'] = country;

      drawerForm['locationSet.geopoliticalAreaType'] = 'country';

    } else {

      const resolved = resolveGeopoliticalArea(item.name);

      if (resolved) {

        drawerForm['locationSet.geopoliticalArea'] = resolved.geopoliticalArea;

        drawerForm['locationSet.geopoliticalAreaType'] = resolved.geopoliticalAreaType;

      }

    }

  }

  if (item.lat && item.lng) {

    drawerForm['geometry.quickpoint.x'] = String(item.lng);

    drawerForm['geometry.quickpoint.y'] = String(item.lat);

    drawerForm['geometry.spatialReferenceSystem'] = 'EPSG:4326 (WGS84)';

  }

};



const isSpatialMapExpanded = ref(true);



const syncToHeritageRegistry = () => {

  const all = [...(items.value || [])];

  if (form && (form['recordInformation.id'] || (form['appellation.name'] && form['appellation.name'].length > 0))) {

    if (!all.some(it => it['recordInformation.id'] === form['recordInformation.id'])) {

      all.push(form);

    }

  }

  updateProjectHeritageAssets(all);

};



watch(() => [items.value, form['recordInformation.id'], form['appellation.name']], () => {

  syncToHeritageRegistry();

}, { deep: true, immediate: true });



const primarySpatialCoords = computed(() => {

  if (Array.isArray(form['spatial']) && form['spatial'].length > 0) {

    for (const s of form['spatial']) {

      if (s && (s['geometry.quickpoint.y'] || s['geometry.quickpoint.x'])) {

        return {

          lat: s['geometry.quickpoint.y'],

          lng: s['geometry.quickpoint.x'],

          name: s['locationSet.namedLocation'] || s['locationSet.historicalName'] || ''

        };

      }

    }

  }

  return { lat: null, lng: null, name: '' };

});



const setPrimarySpatialCoord = (axis, val) => {

  if (!Array.isArray(form['spatial']) || form['spatial'].length === 0) {

    form['spatial'] = [{

      'locationSet.namedLocation': '',

      'locationSet.geopoliticalArea': '',

      'geometry.spatialReferenceSystem': 'EPSG:4326 (WGS84)',

      'geometry.quickpoint.x': '',

      'geometry.quickpoint.y': ''

    }];

  }

  const key = axis === 'y' ? 'geometry.quickpoint.y' : 'geometry.quickpoint.x';

  form['spatial'][0][key] = val;

  if (!form['spatial'][0]['geometry.spatialReferenceSystem']) {

    form['spatial'][0]['geometry.spatialReferenceSystem'] = 'EPSG:4326 (WGS84)';

  }

};



const onDrawerMapCoordsChange = ({ lat, lng }) => {

  drawerForm['geometry.quickpoint.y'] = String(lat);

  drawerForm['geometry.quickpoint.x'] = String(lng);

  if (!drawerForm['geometry.spatialReferenceSystem']) {

    drawerForm['geometry.spatialReferenceSystem'] = 'EPSG:4326 (WGS84)';

  }

};



const saveDrawer = () => {

  const field = activeDrawerField.value;

  if (!form[field]) form[field] = [];



  // Normalize year dates for characters.temporal

  if (field === 'characters.temporal') {

    if (drawerForm['timeSpan.startDate']) {

      drawerForm['timeSpan.startDate'] = normalizeYearDate(drawerForm['timeSpan.startDate']);

    }

    if (drawerForm['timeSpan.endDate']) {

      drawerForm['timeSpan.endDate'] = normalizeYearDate(drawerForm['timeSpan.endDate']);

    }

  }



  // Normalize decimal comma to dot for characters.dimensions

  if (field === 'characters.dimensions' && drawerForm['value']) {

    drawerForm['value'] = String(drawerForm['value']).replace(',', '.').trim();

  }



  // Normalize spatial data: omit geospatial area for historical, auto-fill for modern

  if (field === 'spatial') {

    if (spatialKind.value === 'historical') {

      delete drawerForm['locationSet.geopoliticalArea'];

      delete drawerForm['locationSet.geopoliticalAreaType'];

      if (!drawerForm['locationSet.namedLocation'] && drawerForm['locationSet.historicalName']) {

        drawerForm['locationSet.namedLocation'] = drawerForm['locationSet.historicalName'];

      }

    } else {

      if (!drawerForm['locationSet.geopoliticalArea'] && drawerForm['locationSet.namedLocation']) {

        const resolved = resolveGeopoliticalArea(drawerForm['locationSet.namedLocation']);

        if (resolved) {

          drawerForm['locationSet.geopoliticalArea'] = resolved.geopoliticalArea;

          if (!drawerForm['locationSet.geopoliticalAreaType']) {

            drawerForm['locationSet.geopoliticalAreaType'] = resolved.geopoliticalAreaType || 'country';

          }

        }

      }

    }

  }



  const isPrimitive = drawerForm.hasOwnProperty('_value') && Object.keys(drawerForm).length === 1;

  const dataToSave = isPrimitive ? drawerForm['_value'] : JSON.parse(JSON.stringify(drawerForm));



  if (drawerEditIndex.value > -1) form[field][drawerEditIndex.value] = dataToSave;

  else form[field].push(dataToSave);

  

  if (field === 'recordInformation.creation.contacts' && typeof dataToSave === 'object') {

    addOrUpdatePerson(dataToSave);

  } else if (field === 'actors' && typeof dataToSave === 'object') {

    addOrUpdatePerson(dataToSave);

  } else if (field === 'references' && typeof dataToSave === 'object' && dataToSave['actors.name']) {

    addOrUpdatePerson({

      id: dataToSave['actors.id'] || '',

      name: dataToSave['actors.name'] || '',

      roles: dataToSave['actors.roles'] || ''

    });

  }



  closeDrawer();

};



const removeDrawerItem = (field, index) => {

  if (Array.isArray(form[field])) {

    form[field].splice(index, 1);

  }

};



const saveSuccessBadge = ref(false);



const save = () => {

  if (!form['recordInformation.country']) {
    form['recordInformation.country'] = collectionInstitution.country || 'DE';
  }
  if (!form['recordInformation.language'] || form['recordInformation.language'].length === 0) {
    form['recordInformation.language'] = defaultMetadataLanguage.value ? [defaultMetadataLanguage.value] : ['de'];
  }
  if (!form['recordInformation.metadataRights']) {
    form['recordInformation.metadataRights'] = globalRights.metadataRights || 'https://creativecommons.org/publicdomain/zero/1.0/deed.de';
  }

  if (Array.isArray(form['characters.temporal'])) {

    form['characters.temporal'].forEach(item => {

      if (item && item['timeSpan.startDate']) item['timeSpan.startDate'] = normalizeYearDate(item['timeSpan.startDate']);

      if (item && item['timeSpan.endDate']) item['timeSpan.endDate'] = normalizeYearDate(item['timeSpan.endDate']);

    });

  }

  if (isEditing.value) {

    items.value[editIndex.value] = JSON.parse(JSON.stringify(form));

  } else {

    items.value.push(JSON.parse(JSON.stringify(form)));

    isEditing.value = true;

    editIndex.value = items.value.length - 1;

  }

  formSnapshot.value = JSON.stringify(form);

  saveSuccessBadge.value = true;

  setTimeout(() => {

    saveSuccessBadge.value = false;

  }, 3000);

};



const edit = (index) => {

  isEditing.value = true;

  editIndex.value = index;

  Object.assign(form, JSON.parse(JSON.stringify(items.value[index])));

  // Populate preferred languages

  Object.keys(form).forEach(k => {

    if (k.endsWith('language') && Array.isArray(form[k])) {

      preferredLanguages[k] = form[k][0] || '';

    }

  });

  formSnapshot.value = JSON.stringify(form);

};



const getDisplayName = (item) => {

  if (Array.isArray(item['appellation.name']) && item['appellation.name'][0]) {

    const val = item['appellation.name'][0]._value || item['appellation.name'][0];

    if (val) return val;

  }

  return item['appellation.id'] || item['recordInformation.id'] || '—';

};



const getDisplayMaterial = (mat) => {

  if (!mat) return '';

  if (typeof mat === 'object') {

    return mat._value || mat['#term'] || mat.term || mat.label || mat.prefLabel || mat.name || mat.value || '';

  }

  if (typeof mat !== 'string') return String(mat);

  const match = mat.match(/^(.*?)\s*<.*?>$/);

  return match ? match[1] : mat;

};



// ────────────────────────────────────────────────────────────

// Feature 4, 5, 6: Batch Controls, Quality Validation & Grid View

// ────────────────────────────────────────────────────────────

const viewMode = ref('table'); // 'table' | 'grid'

const filterStatus = ref('all'); // 'all' | 'valid' | 'warning' | 'error'

const searchQuery = ref('');

const selectedOriginalIndices = ref([]);



// Quality Status Calculation (Ampelsystem)

const getAssetValidationStatus = (item) => {

  if (!item) return { status: 'error', icon: '🔴', label: 'Fehler', details: ['Kein Datensatz'] };

  

  const id = item['recordInformation.id'] || item['appellation.id'];

  let name = '';

  if (Array.isArray(item['appellation.name']) && item['appellation.name'][0]) {

    name = typeof item['appellation.name'][0] === 'object' ? item['appellation.name'][0]._value : item['appellation.name'][0];

  } else if (typeof item['appellation.name'] === 'string') {

    name = item['appellation.name'];

  }

  

  const missingErrors = [];

  const missingWarns = [];

  

  if (!id || !String(id).trim()) missingErrors.push('ID');

  if (!name || !String(name).trim()) missingErrors.push(currentLocale.value === 'de' ? 'Name/Titel' : 'Name/Title');

  

  if (missingErrors.length > 0) {

    return {

      status: 'error',

      icon: '🔴',

      label: currentLocale.value === 'de' ? 'Pflichtfelder fehlen' : 'Required fields missing',

      details: missingErrors

    };

  }

  

  // Recommended Fields for CARARE

  const hasMaterial = Array.isArray(item['characters.materials']) && item['characters.materials'].length > 0;

  const hasType = Array.isArray(item['characters.heritageAssetType']) && item['characters.heritageAssetType'].length > 0;

  if (!hasMaterial && !hasType) missingWarns.push(currentLocale.value === 'de' ? 'Material/Typ' : 'Material/Type');

  

  const hasTemporal = Array.isArray(item['characters.temporal']) && item['characters.temporal'].length > 0;

  if (!hasTemporal) missingWarns.push(currentLocale.value === 'de' ? 'Datierung/Epoche' : 'Dating/Period');

  

  const hasLicence = !!item['rights.licence'];

  if (!hasLicence) missingWarns.push(currentLocale.value === 'de' ? 'Lizenz' : 'Licence');

  

  const hasDimensions = Array.isArray(item['characters.dimensions']) && item['characters.dimensions'].length > 0;

  if (!hasDimensions) missingWarns.push(currentLocale.value === 'de' ? 'Maße' : 'Dimensions');



  if (missingWarns.length > 0) {

    return {

      status: 'warning',

      icon: '🟡',

      label: currentLocale.value === 'de' ? 'Unvollständig' : 'Incomplete',

      details: missingWarns

    };

  }

  

  return {

    status: 'valid',

    icon: '🟢',

    label: currentLocale.value === 'de' ? 'Vollständig & Valide' : 'Complete & Valid',

    details: []

  };

};



const validationStats = computed(() => {

  let valid = 0;

  let warning = 0;

  let error = 0;

  (items.value || []).forEach(item => {

    const st = getAssetValidationStatus(item).status;

    if (st === 'valid') valid++;

    else if (st === 'warning') warning++;

    else if (st === 'error') error++;

  });

  const total = items.value?.length || 0;

  const validPercent = total > 0 ? Math.round((valid / total) * 100) : 0;

  return { total, valid, warning, error, validPercent };

});



const filteredItemsWithIndices = computed(() => {

  const q = searchQuery.value.trim().toLowerCase();

  const list = items.value || [];

  return list.map((item, originalIndex) => ({ item, originalIndex }))

    .filter(({ item }) => {

      const st = getAssetValidationStatus(item).status;

      if (filterStatus.value !== 'all' && st !== filterStatus.value) return false;

      if (!q) return true;

      const id = String(item['recordInformation.id'] || item['appellation.id'] || '').toLowerCase();

      const name = String(getDisplayName(item)).toLowerCase();

      const mats = (item['characters.materials'] || []).map(m => getDisplayMaterial(m).toLowerCase()).join(' ');

      return id.includes(q) || name.includes(q) || mats.includes(q);

    });

});



const isAllFilteredSelected = computed(() => {

  if (filteredItemsWithIndices.value.length === 0) return false;

  return filteredItemsWithIndices.value.every(({ originalIndex }) => 

    selectedOriginalIndices.value.includes(originalIndex)

  );

});



const toggleSelectAllFiltered = () => {

  if (isAllFilteredSelected.value) {

    const currentIndices = filteredItemsWithIndices.value.map(f => f.originalIndex);

    selectedOriginalIndices.value = selectedOriginalIndices.value.filter(idx => !currentIndices.includes(idx));

  } else {

    filteredItemsWithIndices.value.forEach(({ originalIndex }) => {

      if (!selectedOriginalIndices.value.includes(originalIndex)) {

        selectedOriginalIndices.value.push(originalIndex);

      }

    });

  }

};



const toggleSelectIndex = (origIdx) => {

  const i = selectedOriginalIndices.value.indexOf(origIdx);

  if (i > -1) selectedOriginalIndices.value.splice(i, 1);

  else selectedOriginalIndices.value.push(origIdx);

};



// Feature 5: Smart Duplicate with Automatic Incrementing

const smartDuplicate = (index) => {

  const item = JSON.parse(JSON.stringify(items.value[index]));

  const oldId = item['recordInformation.id'] || item['appellation.id'] || 'ITEM_01';

  const newId = incrementStringNumber(oldId, '_02');

  

  item['recordInformation.id'] = newId;

  item['appellation.id'] = newId;

  

  if (Array.isArray(item['appellation.name']) && item['appellation.name'][0]) {

    const oldName = typeof item['appellation.name'][0] === 'object' 

      ? (item['appellation.name'][0]._value || '') 

      : String(item['appellation.name'][0]);

    const newName = incrementStringNumber(oldName, ' (Kopie)');

    if (typeof item['appellation.name'][0] === 'object') {

      item['appellation.name'][0]._value = newName;

    } else {

      item['appellation.name'][0] = newName;

    }

  }



  // Clear object-unique fields (dimensions, inscriptions, relations)

  item['characters.dimensions'] = [];

  item['characters.inscriptions'] = [];

  item['hasRepresentation'] = [];

  item['dcRelation'] = [];



  items.value.splice(index + 1, 0, item);

  edit(index + 1);

};



const duplicate = (index) => {

  smartDuplicate(index);

};



// Feature 3: Campaign Inheritance

const applyCampaignToCurrentForm = () => {

  applyCampaignToHeritageAsset(form, true);

  formSnapshot.value = JSON.stringify(form);

  saveSuccessBadge.value = true;

  setTimeout(() => { saveSuccessBadge.value = false; }, 2500);

};



const addNewHeritageAsset = () => {

  resetForm(true);

  if (campaignPreset && campaignPreset.active) {

    applyCampaignToHeritageAsset(form, false);

  }

  isEditing.value = false;

  editIndex.value = null;

};



// Feature 4: Grid View Helpers

const addNewInGrid = () => {

  const lastItem = items.value[items.value.length - 1];

  let newId = `HA-${items.value.length + 1}`;

  if (lastItem) {

    const lastId = lastItem['recordInformation.id'] || lastItem['appellation.id'];

    if (lastId) newId = incrementStringNumber(lastId);

  }

  const newItem = {

    'recordInformation.id': newId,

    'appellation.id': newId,

    'appellation.name': [{ _value: '', 'appellation.name#lang': defaultMetadataLanguage?.value || 'de' }],

    'characters.materials': [],

    'characters.temporal': [],

    'repositoryLocation': '',

    'rights.licence': globalRights?.licence || ''

  };

  if (campaignPreset && campaignPreset.active) {

    applyCampaignToHeritageAsset(newItem, false);

  }

  items.value.push(newItem);

};



const openInFormMode = (originalIndex) => {

  viewMode.value = 'table';

  edit(originalIndex);

};



const getGridNameValue = (item) => {

  if (Array.isArray(item['appellation.name']) && item['appellation.name'][0]) {

    return item['appellation.name'][0]._value || item['appellation.name'][0] || '';

  }

  return typeof item['appellation.name'] === 'string' ? item['appellation.name'] : '';

};



const setGridNameValue = (originalIndex, val) => {

  if (!items.value[originalIndex]) return;

  const lang = defaultMetadataLanguage?.value || 'de';

  items.value[originalIndex]['appellation.name'] = [{ _value: val, 'appellation.name#lang': lang }];

};



const getGridTemporalValue = (item) => {

  if (Array.isArray(item['characters.temporal']) && item['characters.temporal'][0]) {

    const t = item['characters.temporal'][0];

    const pName = Array.isArray(t['timeSpan.periodName']) && t['timeSpan.periodName'][0] 

      ? (t['timeSpan.periodName'][0]._value || t['timeSpan.periodName'][0]) 

      : (t['timeSpan.periodName'] || '');

    if (pName) return pName;

    if (t['timeSpan.startDate'] || t['timeSpan.endDate']) {

      return `${t['timeSpan.startDate'] || ''} bis ${t['timeSpan.endDate'] || ''}`;

    }

  }

  return '';

};



const setGridTemporalValue = (originalIndex, val) => {

  if (!items.value[originalIndex]) return;

  const lang = defaultMetadataLanguage?.value || 'de';

  items.value[originalIndex]['characters.temporal'] = [{

    'timeSpan.periodName': [{ _value: val, 'timeSpan.periodName#lang': lang }],

    'timeSpan.startDate': '',

    'timeSpan.endDate': ''

  }];

};



const quickPromptMaterial = (originalIndex) => {

  const promptMsg = currentLocale.value === 'de' ? 'Materialbezeichnung eingeben (z. B. Marmor, Bronze, Terracotta):' : 'Enter material name:';

  const val = prompt(promptMsg);

  if (val && val.trim()) {

    if (!Array.isArray(items.value[originalIndex]['characters.materials'])) {

      items.value[originalIndex]['characters.materials'] = [];

    }

    items.value[originalIndex]['characters.materials'].push({

      _value: val.trim(),

      'characters.materials#lang': 'de'

    });

  }

};



const onGridFieldChange = (originalIndex, field, val) => {

  if (!items.value[originalIndex]) return;

  if (field === 'id') {

    items.value[originalIndex]['appellation.id'] = val;

  }

};



// Feature 5: Bulk Actions Logic

const bulkApplyCampaignToSelected = () => {

  if (selectedOriginalIndices.value.length === 0) return;

  selectedOriginalIndices.value.forEach(idx => {

    if (items.value[idx]) {

      applyCampaignToHeritageAsset(items.value[idx], false);

    }

  });

  alert(currentLocale.value === 'de' 

    ? `Kampagnen-Voreinstellungen auf ${selectedOriginalIndices.value.length} Kulturgüter übertragen!` 

    : `Campaign presets applied to ${selectedOriginalIndices.value.length} heritage assets!`);

};



const bulkAssignLicence = (licenceUri) => {

  if (!licenceUri || selectedOriginalIndices.value.length === 0) return;

  selectedOriginalIndices.value.forEach(idx => {

    if (items.value[idx]) items.value[idx]['rights.licence'] = licenceUri;

  });

};



const openOrgPickerForRepo = () => { openOrgPicker('repositoryLocation'); };

const openOrgPickerForBulk = () => {

  openOrgPicker('bulkRepository');

};



const bulkDeleteSelected = () => {

  if (selectedOriginalIndices.value.length === 0) return;

  const sorted = [...selectedOriginalIndices.value].sort((a, b) => b - a);

  sorted.forEach(idx => {

    items.value.splice(idx, 1);

  });

  selectedOriginalIndices.value = [];

  resetForm(true);

};



const saveAndContinueNextPart = () => {

  if (!form['recordInformation.id'] && !form['appellation.id']) {

    alert(currentLocale.value === 'de' ? 'Bitte geben Sie mindestens eine ID ein.' : 'Please enter an ID first.');

    return;

  }



  // 1. Save current item into items array

  if (isEditing.value && editIndex.value !== null) {

    items.value[editIndex.value] = JSON.parse(JSON.stringify(form));

  } else {

    items.value.push(JSON.parse(JSON.stringify(form)));

  }



  // 2. Preserve shared ensemble/institutional metadata

  const preservedSource = form['recordInformation.source'];

  const preservedSourceLang = form['recordInformation.source#lang'];

  const preservedCountry = form['recordInformation.country'];

  const preservedCountryLang = form['recordInformation.country#lang'];

  const preservedCountryAuth = form['recordInformation.country#authority'];

  const preservedCreationDate = form['recordInformation.creation.date'];

  const preservedContacts = JSON.parse(JSON.stringify(form['recordInformation.creation.contacts'] || []));

  const preservedLang = JSON.parse(JSON.stringify(form['recordInformation.language'] || []));

  const preservedMetaRights = form['recordInformation.metadataRights'];

  const preservedMetaRightsLang = form['recordInformation.metadataRights#lang'];

  

  const preservedActors = JSON.parse(JSON.stringify(form['actors'] || []));

  const preservedProvenance = form['provenance'];

  const preservedProvenanceLang = form['provenance#lang'];

  const preservedTemporal = JSON.parse(JSON.stringify(form['characters.temporal'] || []));

  const preservedMaterials = JSON.parse(JSON.stringify(form['characters.materials'] || []));

  const preservedSpatial = JSON.parse(JSON.stringify(form['spatial'] || []));

  const preservedRepo = form['repositoryLocation'];

  const preservedRepoLang = form['repositoryLocation#lang'];

  const preservedCredit = form['rights.copyrightCreditLine'];

  const preservedCreditLang = form['rights.copyrightCreditLine#lang'];

  const preservedAccess = form['rights.accessRights'];

  const preservedAssetType = JSON.parse(JSON.stringify(form['characters.heritageAssetType'] || []));



  // 3. Clear object-specific fields

  resetForm();



  // 4. Restore preserved fields

  form['recordInformation.source'] = preservedSource;

  form['recordInformation.source#lang'] = preservedSourceLang;

  form['recordInformation.country'] = preservedCountry;

  form['recordInformation.country#lang'] = preservedCountryLang;

  form['recordInformation.country#authority'] = preservedCountryAuth;

  form['recordInformation.creation.date'] = preservedCreationDate;

  form['recordInformation.creation.contacts'] = preservedContacts;

  form['recordInformation.language'] = preservedLang;

  form['recordInformation.metadataRights'] = preservedMetaRights;

  form['recordInformation.metadataRights#lang'] = preservedMetaRightsLang;



  form['actors'] = preservedActors;

  form['provenance'] = preservedProvenance;

  form['provenance#lang'] = preservedProvenanceLang;

  form['characters.temporal'] = preservedTemporal;

  form['characters.materials'] = preservedMaterials;

  form['spatial'] = preservedSpatial;

  form['repositoryLocation'] = preservedRepo || collectionInstitution?.fullLabel || '';

  form['repositoryLocation#lang'] = preservedRepoLang;

  form['rights.copyrightCreditLine'] = preservedCredit;

  form['rights.copyrightCreditLine#lang'] = preservedCreditLang;

  form['rights.accessRights'] = preservedAccess;

  form['characters.heritageAssetType'] = preservedAssetType;



  isEditing.value = false;

  editIndex.value = null;

};



const remove = (index) => {

  items.value.splice(index, 1);

  if (isEditing.value && editIndex.value === index) resetForm(true);

};



const quickAddContact = (contact) => {

  if (!form['recordInformation.creation.contacts']) form['recordInformation.creation.contacts'] = [];

  form['recordInformation.creation.contacts'].push(JSON.parse(JSON.stringify(contact)));

};



const quickAddActor = (actor) => {

  if (!form['actors']) form['actors'] = [];

  form['actors'].push(JSON.parse(JSON.stringify(actor)));

};



const quickAddSpatial = (sp) => {

  if (!form['spatial']) form['spatial'] = [];

  const isHist = Boolean(sp.historicalName || (sp.uri && sp.uri.includes('pleiades')));

  form['spatial'].push({

    'locationSet.namedLocation': sp.namedLocation || sp.name || '',

    'locationSet.historicalName': sp.historicalName || (isHist ? (sp.namedLocation || sp.name || '') : ''),

    'locationSet.geopoliticalArea': isHist ? '' : (sp.geopoliticalArea || ''),

    'locationSet.geopoliticalAreaType': isHist ? '' : (sp.geopoliticalAreaType || (sp.geopoliticalArea ? 'country' : '')),

    'geometry.spatialReferenceSystem': 'EPSG:4326 (WGS84)',

    'geometry.quickpoint.x': sp.x || '',

    'geometry.quickpoint.y': sp.y || '',

    'geometry.quickpoint.uri': sp.uri || ''

  });

};



const saveItemToSpatialPool = (item) => {

  addOrUpdateSavedSpatial(item);

};



const isOrgPickerOpen = ref(false);

const orgPickerTarget = ref('actors');



const openOrgPicker = (target = 'actors') => {

  orgPickerTarget.value = target;

  isOrgPickerOpen.value = true;

};



const handleOrgSelected = (org) => {

  if (!org) return;
  recordRecentOrganization(org);

  if (orgPickerTarget.value === 'actors') {

    if (!form['actors']) form['actors'] = [];

    const exists = form['actors'].some(a => (a.name || '').trim().toLowerCase() === (org.name || '').trim().toLowerCase());

    if (!exists) {

      form['actors'].push({

        id: org.gnd || org.uri || '',

        name: org.name,

        roles: org.category || 'Institution / Organisation'

      });

    }

  } else if (orgPickerTarget.value === 'contacts') {

    if (activeDrawerField.value === 'recordInformation.creation.contacts' && isDrawerOpen.value) {

      drawerForm['organization'] = org.name;

    } else {

      if (!form['recordInformation.creation.contacts']) form['recordInformation.creation.contacts'] = [];

      const exists = form['recordInformation.creation.contacts'].some(c => (c.name || '').trim().toLowerCase() === (org.name || '').trim().toLowerCase());

      if (!exists) {

        form['recordInformation.creation.contacts'].push({

          name: org.name,

          role: org.category || 'Organisation',

          organization: org.name,

          email: ''

        });

      }

    }

  } else if (orgPickerTarget.value === 'repositoryLocation') {

    form['repositoryLocation'] = org.gnd ? `${org.name} (GND: ${org.gnd})` : org.name;

  } else if (orgPickerTarget.value === 'source') {

    form['recordInformation.source'] = org.name;

  } else if (orgPickerTarget.value === 'bulkRepository') {

    const repoStr = org.gnd ? `${org.name} (GND: ${org.gnd})` : org.name;

    selectedOriginalIndices.value.forEach(idx => {

      if (items.value[idx]) items.value[idx]['repositoryLocation'] = repoStr;

    });

  }

  isOrgPickerOpen.value = false;

};



const isPersonPickerOpen = ref(false);

const personPickerMode = ref('actors');



const openPersonPicker = (mode = 'actors') => {

  personPickerMode.value = mode;

  isPersonPickerOpen.value = true;

};



const handlePersonsSelected = (selectedList) => {

  if (personPickerMode.value === 'actors') {

    if (!form['actors']) form['actors'] = [];

    selectedList.forEach(p => {

      const exists = form['actors'].some(a => (a.name || '').trim().toLowerCase() === (p.name || '').trim().toLowerCase());

      if (!exists) {

        form['actors'].push({

          id: p.id || '',

          name: p.name,

          roles: p.roles || p.role || ''

        });

      }

    });

  } else if (personPickerMode.value === 'contacts') {

    if (activeDrawerField.value === 'recordInformation.creation.contacts' && isDrawerOpen.value && selectedList.length > 0) {

      const p = selectedList[0];

      drawerForm['name'] = p.name || '';

      drawerForm['role'] = p.role || p.roles || '';

      drawerForm['organization'] = p.organization || '';

      drawerForm['email'] = p.email || '';

      return;

    }

    if (!form['recordInformation.creation.contacts']) form['recordInformation.creation.contacts'] = [];

    selectedList.forEach(p => {

      const exists = form['recordInformation.creation.contacts'].some(c => (c.name || '').trim().toLowerCase() === (p.name || '').trim().toLowerCase());

      if (!exists) {

        form['recordInformation.creation.contacts'].push({

          name: p.name,

          role: p.role || p.roles || '',

          organization: p.organization || '',

          email: p.email || ''

        });

      }

    });

  }

};



const isCustomFormLicence = (val) => {

  if (!val) return false;

  return !CC_LICENCES.some(l => l.uriDe === val || l.uriEn === val);

};



const onLicenceChanged = () => {

  if (form['rights.licence']) {

    globalRights.licence = form['rights.licence'];

    saveGlobalRights(globalRights);

  }

};



const saveCurrentLicenceAsDefault = () => {

  if (form['rights.licence']) {

    globalRights.licence = form['rights.licence'];

    saveGlobalRights(globalRights);

  }

};



watch(currentLocale, (newLocale) => {

  if (form['rights.licence']) {

    form['rights.licence'] = resolveLicenceUri(form['rights.licence'], newLocale);

  }

});



const applyGlobalRightsToForm = () => {

  if (!globalRights) return;

  form['recordInformation.metadataRights'] = globalRights.metadataRights || '';

  form['rights.copyrightCreditLine'] = globalRights.copyrightCreditLine || '';

  form['rights.accessRights'] = globalRights.accessRights || '';

  form['rights.licence'] = resolveLicenceUri(globalRights.licence, currentLocale.value) || '';

  form['rights.reproductionRights'] = globalRights.reproductionRights || '';

};



const resetForm = (force = false) => {

  const metaLang = defaultMetadataLanguage?.value || 'de';

  Object.keys(form).forEach(key => {

    if (Array.isArray(form[key])) {

      if (form[key].length > 0 && typeof form[key][0] === 'object' && form[key][0] !== null && (key + '#preferred') in form[key][0]) {

        form[key] = [{ _value: '', [key + '#lang']: metaLang, [key + '#preferred']: true }];

      } else {

        form[key] = [];

      }

    } else {

      form[key] = '';

    }

  });



  form['recordInformation.language'] = [metaLang];

  if (globalRights) {

    form['recordInformation.metadataRights'] = globalRights.metadataRights || '';

    form['rights.copyrightCreditLine'] = globalRights.copyrightCreditLine || '';

    form['rights.accessRights'] = globalRights.accessRights || '';

    form['rights.licence'] = resolveLicenceUri(globalRights.licence, currentLocale.value) || '';

    form['rights.reproductionRights'] = globalRights.reproductionRights || '';

  }



  if (campaignPreset && campaignPreset.active) {

    applyCampaignToHeritageAsset(form, false);

  }



  isEditing.value = false;

  editIndex.value = null;

  Object.keys(preferredLanguages).forEach(k => delete preferredLanguages[k]);

  formSnapshot.value = JSON.stringify(form);

  return true;

};



onBeforeUnmount(() => {

  window.removeEventListener('keydown', handleKeydown);

});



defineExpose({ items, form, save, saveAndContinueNextPart, resetForm, isFormDirty, validationStats });

</script>