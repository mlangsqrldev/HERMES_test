<template>
  <div class="drawer drawer-end digitalResource-crud">
    <input id="drawer-digitalResource" type="checkbox" class="drawer-toggle" v-model="isDrawerOpen" />
    
    <div class="drawer-content">
      
      <div class="container mx-auto p-4 max-w-7xl">

        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">
          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">
             <div>
               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ t('saved') }} {{ getLabel('digitalResource', 'digitalResource') }}</h4>
             </div>
          </div>
          <div class="overflow-x-auto">
             <table class="table table-xs w-full table-zebra">
                <thead class="bg-base-200">
                  <tr>
                    <th>{{ getLabel('recordInformation.id', 'id') }}</th><th>{{ getLabel('appellation.name', 'name') }}</th><th>{{ getLabel('appellation.name#lang', 'name#lang') }}</th><th>{{ getLabel('appellation.name#preferred', 'name#preferred') }}</th>
                    <th class="w-24">{{ t('actions') }}</th>
                  </tr>
                </thead>
                <tbody>
                   <tr v-for="(item, idx) in items" :key="idx">
                      <td>{{ Array.isArray(item['recordInformation.id']) ? item['recordInformation.id'].length + ' ' + t('items') : item['recordInformation.id'] }}</td><td>{{ Array.isArray(item['appellation.name']) ? item['appellation.name'].length + ' ' + t('items') : item['appellation.name'] }}</td><td>{{ Array.isArray(item['appellation.name#lang']) ? item['appellation.name#lang'].length + ' ' + t('items') : item['appellation.name#lang'] }}</td><td>{{ Array.isArray(item['appellation.name#preferred']) ? item['appellation.name#preferred'].length + ' ' + t('items') : item['appellation.name#preferred'] }}</td>
                      <td>
                         <div class="flex gap-1">
                           <button type="button" class="btn btn-xs btn-ghost text-info" @click.prevent="edit(idx)">{{ t('edit') }}</button>
                           <button type="button" class="btn btn-xs btn-ghost text-error" @click.prevent="remove(idx)">{{ t('del') }}</button>
                         </div>
                      </td>
                   </tr>
                   <tr v-if="!items || items.length === 0">
                      <td colspan="100" class="text-center text-base-content/40 py-4 italic">{{ t('noItems') }}</td>
                   </tr>
                </tbody>
             </table>
          </div>
        </div>

        <div class="bg-base-200 p-6 rounded-box shadow-sm mb-10">
          <h3 class="text-xl font-bold mb-4 capitalize">{{ isEditing ? t('edit') : t('add') }} {{ getLabel('digitalResource', 'digitalResource') }}</h3>
          <form @submit.prevent="save">
            <div class="grid grid-cols-1 gap-x-6">
              
        <div class="col-span-full border border-base-300 bg-base-100/50 p-5 rounded-box mb-6 mt-2">
        <div class=" items-center flex flex-row">
          <label class="label mb-2 pb-0">
            <span class="label-text font-bold text-lg capitalize">{{ getLabel('recordInformation', 'recordInformation') }}</span>
          </label>
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation', 'The ID, language, creation information and other metadata describing the record. The ID element of this information block holds the ID assigned by the content provider, cf. section 8.', 'doc')" v-if="getLabel('recordInformation', 'The ID, language, creation information and other metadata describing the record. The ID element of this information block holds the ID assigned by the content provider, cf. section 8.', 'doc')">
              <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
            <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                        fill="currentColor"
                        stroke-width="2.5"
                        stroke="currentColor"
                        class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
            </button>
            </div>
            </div>
              <!--       <div class="text-sm text-base-content/60 mb-4 px-1">{{ getLabel('recordInformation', 'The ID, language, creation information and other metadata describing the record. The ID element of this information block holds the ID assigned by the content provider, cf. section 8.', 'doc') }}</div> -->
          <div class="grid grid-cols-1 gap-x-6">
            
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('recordInformation.id', 'id') }}</span><span class="text-accent font-black">*</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation.id', 'The local ID number in the content provider\'s information system. Mandatory – must be unique within the collection.', 'doc')" v-if="getLabel('recordInformation.id', 'The local ID number in the content provider\'s information system. Mandatory – must be unique within the collection.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"     required v-model="form['recordInformation.id']" class="input input-bordered w-full validator " :placeholder="getLabel('recordInformation.id', 'e.g. 3816816', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center justify-between">
          <div class="flex flex-row items-center">
            <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('recordInformation.source', 'source') }}</span><span class="text-accent font-black">*</span></label>
            <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation.source', 'The name of the organisation that maintains this record about the digital resource.', 'doc')" v-if="getLabel('recordInformation.source', 'The name of the organisation that maintains this record about the digital resource.', 'doc')">
                  <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
                <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                            fill="currentColor"
                            stroke-width="2.5"
                            stroke="currentColor"
                            class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
                </button>
            </div>
          </div>
          <button type="button" class="btn btn-xs btn-outline btn-accent gap-1" @click.prevent="openOrgPicker('source')" :title="currentLocale === 'de' ? 'Organisation aus dem Pool wählen' : 'Select organization from pool'">🏛️ {{ currentLocale === 'de' ? 'Aus Organisations-Pool' : 'From Organizations' }}</button>
        </div>
        <input type="text"     required v-model="form['recordInformation.source']" class="input input-bordered w-full validator " :placeholder="getLabel('recordInformation.source', 'e.g. Stiftung Preußischer Kulturbesitz, Staatliche Museen zu Berlin, Collection of Classical Antiquities', 'plac')" />
        <div class="validator-hint">{{t('validationHint')}}</div>        
          
          <!-- Recently Used Organizations Bar -->
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
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation.creation.date', 'Date when this record about the digital resource was created. Not to be confused with the creation date of the digital resource itself (see \'Created\').', 'doc')" v-if="getLabel('recordInformation.creation.date', 'Date when this record about the digital resource was created. Not to be confused with the creation date of the digital resource itself (see \'Created\').', 'doc')">
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
      </div>
    </div>
  </div>
</div>
        <div class="col-span-full border border-base-300 bg-base-100/50 p-5 rounded-box mb-6 mt-2">
        <div class=" items-center flex flex-row">
          <label class="label mb-2 pb-0">
            <span class="label-text font-bold text-lg capitalize">{{ getLabel('appellation', 'appellation') }}</span>
          </label>
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('appellation', 'The ID and the name given to the information source (see section 11).', 'doc')" v-if="getLabel('appellation', 'The ID and the name given to the information source (see section 11).', 'doc')">
              <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
            <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                        fill="currentColor"
                        stroke-width="2.5"
                        stroke="currentColor"
                        class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
            </button>
            </div>
            </div>
              <!--       <div class="text-sm text-base-content/60 mb-4 px-1">{{ getLabel('appellation', 'The ID and the name given to the information source (see section 11).', 'doc') }}</div> -->
          <div class="grid grid-cols-1 gap-x-6">
            
        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">
          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">
             <div class="flex flex-row items-center">
               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('appellation.name', 'name') }}<span class="text-accent font-black">*</span></h4>
               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('appellation.name', 'Name of this digital resource. Mandatory. Can be provided in multiple languages, with a preferred value indicated.', 'doc')" v-if="getLabel('appellation.name', 'Name of this digital resource. Mandatory. Can be provided in multiple languages, with a preferred value indicated.', 'doc')">
                    <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
                  <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                              fill="currentColor"
                              stroke-width="2.5"
                              stroke="currentColor"
                              class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
                  </button>
                  </div>
             </div>
             <button type="button" class="btn btn-sm btn-primary" @click.prevent="if(!form['appellation.name']) form['appellation.name'] = []; form['appellation.name'].push(''); inlineEditing['appellation.name_' + (form['appellation.name'].length - 1)] = true;">{{ currentLocale === 'de' ? getLabel('appellation.name', 'appellation.name') + ' ' + t('add') : t('add') + ' ' + getLabel('appellation.name', 'appellation.name') }}</button>
          </div>
          
          <ul class="list bg-base-100 rounded-box shadow-md w-full">
             
             <li v-for="(subItem, subIdx) in form['appellation.name']" :key="subIdx" class="list-row flex items-center justify-between h-auto py-2">
                <div v-if="!inlineEditing['appellation.name_' + subIdx]">{{ subItem }}</div>
                 <div v-else class="flex-1 mr-4">
                   <input type="text"   required     v-model="form['appellation.name'][subIdx]" class="input input-sm input-bordered w-full validator " :placeholder="getLabel('appellation.name', 'e.g. 3D model of a female fragment of the tomb of Nikarete', 'plac')" />
                   <div class="validator-hint text-xs mt-1">Enter valid value</div>
                 </div>
                <div class="flex gap-1 shrink-0">
                   <button type="button" @click.prevent="inlineEditing['appellation.name_' + subIdx] = !inlineEditing['appellation.name_' + subIdx]" class="btn btn-square btn-ghost" :class="inlineEditing['appellation.name_' + subIdx] ? 'text-success' : 'text-info'">
                   <svg v-if="!inlineEditing['appellation.name_' + subIdx]" class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                   <svg v-else class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                 </button>
                   <button type="button" @click.prevent="removeDrawerItem('appellation.name', subIdx)" class="btn btn-square btn-ghost text-error">
                     <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                   </button>
                </div>
             </li>
             
             <li v-if="!form['appellation.name'] || form['appellation.name'].length === 0" class="p-4 text-center text-sm text-base-content/40 italic">
                {{ t('noItems') }}
             </li>
          </ul>
        </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('appellation.id', 'id') }}</span><span class="text-accent font-black">*</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('appellation.id', 'Unique identifier of this digital resource. Mandatory. Recommendation: use a DOI or other persistent URI.', 'doc')" v-if="getLabel('appellation.id', 'Unique identifier of this digital resource. Mandatory. Recommendation: use a DOI or other persistent URI.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"     required v-model="form['appellation.id']" class="input input-bordered w-full validator " :placeholder="getLabel('appellation.id', 'e.g. https://doi.org/10.60507/FK2/MHT0HM', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
          </div>
          
        </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('description', 'description') }}</span><span class="text-accent font-black">*</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('description', 'Description of the digital resource – e.g. describing the view of the heritage asset shown, or technical details of the 3D model. Can be provided in multiple languages, with a preferred value indicated.', 'doc')" v-if="getLabel('description', 'Description of the digital resource – e.g. describing the view of the heritage asset shown, or technical details of the 3D model. Can be provided in multiple languages, with a preferred value indicated.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
          <textarea v-model="form['description']" class="textarea textarea-bordered w-full h-24" :placeholder="getLabel('description', 'e.g. 3D mesh model generated using a structured light scanner with a spatial resolution of 0.1 mm. Final mesh resolution: 15.8 million polygons (faces), 7.9 million vertices, 16384×16384 pixel texture.', 'plac')"></textarea>
          
        </div>
        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">
          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">
             <div class="flex flex-row items-center">
               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('note', 'note') }}</h4>
               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('note', 'Additional note on the digital resource that does not fit into the description – e.g. notes on versions, limitations, or particularities.', 'doc')" v-if="getLabel('note', 'Additional note on the digital resource that does not fit into the description – e.g. notes on versions, limitations, or particularities.', 'doc')">
                    <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
                  <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                              fill="currentColor"
                              stroke-width="2.5"
                              stroke="currentColor"
                              class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
                  </button>
                  </div>
             </div>
             <button type="button" class="btn btn-sm btn-primary" @click.prevent="if(!form['note']) form['note'] = []; form['note'].push(''); inlineEditing['note_' + (form['note'].length - 1)] = true;">{{ currentLocale === 'de' ? getLabel('note', 'note') + ' ' + t('add') : t('add') + ' ' + getLabel('note', 'note') }}</button>
          </div>
          
          <ul class="list bg-base-100 rounded-box shadow-md w-full">
             
             <li v-for="(subItem, subIdx) in form['note']" :key="subIdx" class="list-row flex items-center justify-between h-auto py-2">
                <div v-if="!inlineEditing['note_' + subIdx]">{{ subItem }}</div>
                 <div v-else class="flex-1 mr-4">
                   <input type="text"        v-model="form['note'][subIdx]" class="input input-sm input-bordered w-full validator " :placeholder="getLabel('note', 'e.g. The web-optimized version contains reduced texture resolution compared to the archival master.', 'plac')" />
                   <div class="validator-hint text-xs mt-1">Enter valid value</div>
                 </div>
                <div class="flex gap-1 shrink-0">
                   <button type="button" @click.prevent="inlineEditing['note_' + subIdx] = !inlineEditing['note_' + subIdx]" class="btn btn-square btn-ghost" :class="inlineEditing['note_' + subIdx] ? 'text-success' : 'text-info'">
                   <svg v-if="!inlineEditing['note_' + subIdx]" class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                   <svg v-else class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                 </button>
                   <button type="button" @click.prevent="removeDrawerItem('note', subIdx)" class="btn btn-square btn-ghost text-error">
                     <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                   </button>
                </div>
             </li>
             
             <li v-if="!form['note'] || form['note'].length === 0" class="p-4 text-center text-sm text-base-content/40 italic">
                {{ t('noItems') }}
             </li>
          </ul>
        </div>

        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">
          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">
             <div class="flex flex-row items-center">
               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('actors', 'actors') }}</h4>
               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('actors', 'The actors involved in the creation of a digital resource', 'doc')" v-if="getLabel('actors', 'The actors involved in the creation of a digital resource', 'doc')">
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
              :title="sa.id ? `${sa.name} (${sa.id})` : sa.name"
            >
              <span class="text-secondary font-bold">+</span>
              <span class="font-medium">{{ sa.name }}</span>
              <span v-if="sa.role" class="badge badge-ghost badge-xs text-[10px]">{{ sa.role }}</span>
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

        <!-- Technical 3D Metadata & Photogrammetry RAW Panel (CARARE 2.0.6 / HECTOR) -->
        <DigitalResource3DMetadata
          v-model:formats="form['format']"
          v-model:formatDetails="form['formatDetails']"
          v-model:extent="form['extent']"
          :current-locale="currentLocale"
        />
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">  
        <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('type', 'type') }}</span><span class="text-accent font-black">*</span></label>

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('type', 'The nature or genre of the digital resource. Select from 5 predefined values. For a 3D model: \'3D\'.', 'doc')" v-if="getLabel('type', 'The nature or genre of the digital resource. Select from 5 predefined values. For a 3D model: \'3D\'.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
                </button>
              </div>
              </div>
          <select v-model="form['type']" class="select select-bordered w-full">
            <option disabled value="">{{ currentLocale === 'de' ? getLabel('type', 'type') + ' ' + t('select') : t('select') + ' ' + getLabel('type', 'type') }}</option>
            <template v-if="currentLocale === 'de'">
              <option value="3D-Modell">3D-Modell</option>
<option value="Bild">Bild</option>
<option value="Film">Film</option>
<option value="Text">Text</option>
<option value="Ton">Ton</option>
            </template>
            <template v-else>
              <option value="3D">3D</option>
<option value="Image">Image</option>
<option value="Movie">Movie</option>
<option value="Sound">Sound</option>
<option value="Text">Text</option>
            </template>
          </select>
          
        </div>
        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">
          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">
             <div class="flex flex-row items-center">
               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('publicationStatement', 'publicationStatement') }}</h4>
               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('publicationStatement', '(see section 11)', 'doc')" v-if="getLabel('publicationStatement', '(see section 11)', 'doc')">
                    <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
                  <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                              fill="currentColor"
                              stroke-width="2.5"
                              stroke="currentColor"
                              class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
                  </button>
                  </div>
             </div>
             <button type="button" class="btn btn-sm btn-primary" @click.prevent="openDrawer('publicationStatement')">{{ currentLocale === 'de' ? getLabel('publicationStatement', 'publicationStatement') + ' ' + t('add') : t('add') + ' ' + getLabel('publicationStatement', 'publicationStatement') }}</button>
          </div>
          
          <div class="overflow-x-auto">
             <table class="table table-xs w-full table-zebra">
                <thead class="bg-base-200"><tr><th class="w-24">{{ t('actions') }}</th></tr></thead>
                <tbody>
                   <tr v-for="(subItem, subIdx) in form['publicationStatement']" :key="subIdx">
                      
                      <td>
                          <div class="flex gap-1">
                            <button type="button" class="btn btn-xs btn-ghost text-info" @click.prevent="openDrawer('publicationStatement', subIdx)">{{ t('edit') }}</button>
                            <button type="button" class="btn btn-xs btn-ghost text-error" @click.prevent="removeDrawerItem('publicationStatement', subIdx)">{{ t('del') }}</button>
                          </div>
                      </td>
                   </tr>
                   <tr v-if="!form['publicationStatement'] || form['publicationStatement'].length === 0">
                      <td colspan="10" class="text-center text-base-content/40 py-4 italic">{{ t('noItems') }}</td>
                   </tr>
                </tbody>
             </table>
          </div>
        </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('created', 'created') }}</span><span class="text-warning font-black">~</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('created', 'The date when the digital resource itself was created – distinct from the creation and publication dates of the metadata.', 'doc')" v-if="getLabel('created', 'The date when the digital resource itself was created – distinct from the creation and publication dates of the metadata.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="date" :max="maxDate"     v-model="form['created']" class="input input-bordered w-full validator " :placeholder="getLabel('created', 'e.g. 2025-01-30', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <!-- Metadata language managed globally; excluded from individual digital resource form -->
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('link', 'link') }}</span><span class="text-accent font-black">*</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('link', 'The URL of the resource in the best available resolution/quality – a direct link to the file itself, not to the webpage that contains it.', 'doc')" v-if="getLabel('link', 'The URL of the resource in the best available resolution/quality – a direct link to the file itself, not to the webpage that contains it.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="url"   pattern="[Hh][Tt][Tt][Pp][Ss]?://(?:(?:[a-zA-Z¡-￿0-9]+-?)*[a-zA-Z¡-￿0-9]+)(?:.(?:[a-zA-Z¡-￿0-9]+-?)*[a-zA-Z¡-￿0-9]+)*(?:.(?:[a-zA-Z¡-￿]{2,}))(?::d{2,5})?(?:/[^s]*)?"  required v-model="form['link']" class="input input-bordered w-full validator " :placeholder="getLabel('link', 'e.g. https://doi.org/10.60507/FK2/MHT0HM/F3BFT8', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('object', 'object') }}</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('object', 'A URL to a thumbnail of this resource.', 'doc')" v-if="getLabel('object', 'A URL to a thumbnail of this resource.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"      v-model="form['object']" class="input input-bordered w-full validator " :placeholder="getLabel('object', 'e.g. https://[domain]/thumbnails/sk740_nikarete.jpg', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('isShownAt', 'isShownAt') }}</span><span class="text-warning font-black">~</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('isShownAt', 'A URL to the digital object on the content provider\'s website in its full information context.', 'doc')" v-if="getLabel('isShownAt', 'A URL to the digital object on the content provider\'s website in its full information context.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"      v-model="form['isShownAt']" class="input input-bordered w-full validator " :placeholder="getLabel('isShownAt', 'e.g. https://id.smb.museum/object/699203/', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <!-- Global Rights Status Card (managed globally in top bar) -->
        <div class="col-span-full p-4 rounded-xl border border-warning/30 bg-warning/5 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-warning/10 text-warning flex items-center justify-center text-lg">
              🛡️
            </div>
            <div>
              <div class="font-bold text-sm flex items-center gap-2">
                <span>{{ currentLocale === 'de' ? 'Rechte & Lizenzen (Global verwaltet)' : 'Rights & Licences (Globally Managed)' }}</span>
                <span class="badge badge-warning badge-xs uppercase font-bold">{{ currentLocale === 'de' ? 'Zentral' : 'Global' }}</span>
              </div>
              <div class="text-xs text-base-content/70 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span><strong>{{ currentLocale === 'de' ? 'Lizenz:' : 'Licence:' }}</strong> {{ form['rights.licence'] || (currentLocale === 'de' ? 'Standard (global)' : 'Default (global)') }}</span>
                <span v-if="form['rights.copyrightCreditLine']"><strong>{{ currentLocale === 'de' ? 'Rechteinhaber:' : 'Copyright:' }}</strong> {{ form['rights.copyrightCreditLine'] }}</span>
                <span v-if="form['rights.accessRights']"><strong>{{ currentLocale === 'de' ? 'Zugang:' : 'Access:' }}</strong> {{ form['rights.accessRights'] }}</span>
              </div>
            </div>
          </div>
          <div class="text-[11px] text-base-content/50 italic">
            {{ currentLocale === 'de' ? 'Rechte werden einheitlich über die obere Leiste für das gesamte Projekt festgelegt.' : 'Rights are managed centrally across the project in the top toolbar.' }}
          </div>
        </div>
        <!-- Unified Dublin Core & CARARE Relations Manager for Digital Resource -->
        <DigitalResourceDcRelations
          :form="form"
          :current-locale="currentLocale"
          :project-heritage-assets="projectHeritageAssets"
          :project-activities="projectActivities"
          :other-digital-resources="items"
          :active-resource-id="form['recordInformation.id'] || form['appellation.id']"
        />
            </div>
            
            <div class="mt-8 pt-4 border-t border-base-300 flex items-center justify-end gap-2">
              <span v-if="saveSuccessBadge" class="badge badge-success gap-1 text-white py-3 px-3 transition-all animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                {{ currentLocale === 'de' ? 'Gespeichert' : 'Saved' }}
              </span>
              <button v-if="isEditing" type="button" class="btn btn-outline btn-sm gap-1" @click="resetForm()">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                {{ currentLocale === 'de' ? 'Neuer Datensatz' : 'New Record' }}
              </button>
              <button v-if="isEditing" type="button" class="btn btn-ghost" @click="resetForm()">{{ t('cancel') }}</button>
              <button type="submit" class="btn btn-primary capitalize">{{ t('save') }} {{ getLabel('digitalResource', 'digitalResource') }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="drawer-side z-[100]">
      <label for="drawer-digitalResource" aria-label="close sidebar" class="drawer-overlay"></label>
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
            <label for="drawer-digitalResource" class="btn btn-circle btn-ghost btn-sm drawer-overlay">✕</label>
          </div>
          <form @submit.prevent="saveDrawer" class="space-y-4">
            
      <div v-if="activeDrawerField === 'recordInformation.creation.contacts'">
        <div class="grid grid-cols-1 gap-x-6">
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('recordInformation.creation.contacts.name', 'name') }}</span><span class="text-warning font-black">~</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation.creation.contacts.name', 'First and last name of the person responsible for creating the metadata about this digital resource.', 'doc')" v-if="getLabel('recordInformation.creation.contacts.name', 'First and last name of the person responsible for creating the metadata about this digital resource.', 'doc')">
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
        <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('recordInformation.creation.contacts.role', 'role') }}</span><span class="text-warning font-black">~</span></label>

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
                        <input type="text"     required v-model="drawerForm['organization']" class="input input-bordered w-full validator " :placeholder="getLabel('recordInformation.creation.contacts.organization', 'e.g. Stiftung Preußischer Kulturbesitz, Staatliche Museen zu Berlin', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('recordInformation.creation.contacts.email', 'email') }}</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation.creation.contacts.email', '', 'doc')" v-if="getLabel('recordInformation.creation.contacts.email', '', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="email"      v-model="drawerForm['email']" class="input input-bordered w-full validator " :placeholder="getLabel('recordInformation.creation.contacts.email', '', 'plac')" />
              <div class="validator-hint">{{t('validationEmail')}}</div>        
          
          </div>
        <div class="col-span-full border border-base-300 bg-base-100/50 p-5 rounded-box mb-6 mt-2">
        <div class=" items-center flex flex-row">
          <label class="label mb-2 pb-0">
            <span class="label-text font-bold text-lg capitalize">{{ getLabel('recordInformation.creation.contacts.address', 'address') }}</span>
          </label>
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation.creation.contacts.address', 'The postal address of the person or organization', 'doc')" v-if="getLabel('recordInformation.creation.contacts.address', 'The postal address of the person or organization', 'doc')">
              <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
            <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                        fill="currentColor"
                        stroke-width="2.5"
                        stroke="currentColor"
                        class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
            </button>
            </div>
            </div>
              <!--       <div class="text-sm text-base-content/60 mb-4 px-1">{{ getLabel('recordInformation.creation.contacts.address', 'The postal address of the person or organization', 'doc') }}</div> -->
          <div class="grid grid-cols-1 gap-x-6">
            
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('recordInformation.creation.contacts.address.numberInRoad', 'numberInRoad') }}</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation.creation.contacts.address.numberInRoad', 'The number in a road or street used to identify a property', 'doc')" v-if="getLabel('recordInformation.creation.contacts.address.numberInRoad', 'The number in a road or street used to identify a property', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"      v-model="drawerForm['address.numberInRoad']" class="input input-bordered w-full validator " :placeholder="getLabel('recordInformation.creation.contacts.address.numberInRoad', '', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('recordInformation.creation.contacts.address.roadName', 'roadName') }}</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation.creation.contacts.address.roadName', '', 'doc')" v-if="getLabel('recordInformation.creation.contacts.address.roadName', '', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"      v-model="drawerForm['address.roadName']" class="input input-bordered w-full validator " :placeholder="getLabel('recordInformation.creation.contacts.address.roadName', '', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('recordInformation.creation.contacts.address.townOrCity', 'townOrCity') }}</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation.creation.contacts.address.townOrCity', '', 'doc')" v-if="getLabel('recordInformation.creation.contacts.address.townOrCity', '', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"      v-model="drawerForm['address.townOrCity']" class="input input-bordered w-full validator " :placeholder="getLabel('recordInformation.creation.contacts.address.townOrCity', '', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('recordInformation.creation.contacts.address.postcodeOrZipcode', 'postcodeOrZipcode') }}</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation.creation.contacts.address.postcodeOrZipcode', '', 'doc')" v-if="getLabel('recordInformation.creation.contacts.address.postcodeOrZipcode', '', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"      v-model="drawerForm['address.postcodeOrZipcode']" class="input input-bordered w-full validator " :placeholder="getLabel('recordInformation.creation.contacts.address.postcodeOrZipcode', '', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">  
        <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('recordInformation.creation.contacts.address.country', 'country') }}</span></label>

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation.creation.contacts.address.country', '', 'doc')" v-if="getLabel('recordInformation.creation.contacts.address.country', '', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
                </button>
              </div>
              </div>
          <select v-model="drawerForm['address.country']" class="select select-bordered w-full">
            <option disabled value="">{{ currentLocale === 'de' ? getLabel('recordInformation.creation.contacts.address.country', 'country') + ' ' + t('select') : t('select') + ' ' + getLabel('recordInformation.creation.contacts.address.country', 'country') }}</option>
            <template v-if="currentLocale === 'de'">
              <option value="AF">Afghanistan</option>
<option value="EG">Ägypten</option>
<option value="AX">Åland</option>
<option value="AL">Albanien</option>
<option value="DZ">Algerien</option>
<option value="AS">Amerikanisch-Samoa</option>
<option value="VI">Amerikanische Jungferninseln</option>
<option value="AD">Andorra</option>
<option value="AO">Angola</option>
<option value="AI">Anguilla</option>
<option value="AQ">Antarktis (Sonderstatus durch Antarktis-Vertrag)</option>
<option value="AG">Antigua und Barbuda</option>
<option value="GQ">Äquatorialguinea</option>
<option value="AR">Argentinien</option>
<option value="AM">Armenien</option>
<option value="AW">Aruba</option>
<option value="AZ">Aserbaidschan</option>
<option value="ET">Äthiopien</option>
<option value="AU">Australien</option>
<option value="BS">Bahamas</option>
<option value="BH">Bahrain</option>
<option value="BD">Bangladesch</option>
<option value="BB">Barbados</option>
<option value="BY">Belarus (Weißrussland)</option>
<option value="BE">Belgien</option>
<option value="BZ">Belize</option>
<option value="BJ">Benin</option>
<option value="BM">Bermuda</option>
<option value="BT">Bhutan</option>
<option value="BO">Bolivien</option>
<option value="BQ">Bonaire, Sint Eustatius und Saba</option>
<option value="BA">Bosnien und Herzegowina</option>
<option value="BW">Botswana</option>
<option value="BV">Bouvetinsel</option>
<option value="BR">Brasilien</option>
<option value="VG">Britische Jungferninseln</option>
<option value="IO">Britisches Territorium im Indischen Ozean</option>
<option value="BN">Brunei Darussalam</option>
<option value="BG">Bulgarien</option>
<option value="BF">Burkina Faso</option>
<option value="BI">Burundi</option>
<option value="CL">Chile</option>
<option value="CN">China, Volksrepublik</option>
<option value="CK">Cookinseln</option>
<option value="CR">Costa Rica</option>
<option value="CI">Cote d'Ivoire (Elfenbeinküste)</option>
<option value="CW">Curaçao</option>
<option value="DK">Dänemark</option>
<option value="DE">Deutschland</option>
<option value="DM">Dominica</option>
<option value="DO">Dominikanische Republik</option>
<option value="DJ">Dschibuti</option>
<option value="EC">Ecuador</option>
<option value="SV">El Salvador</option>
<option value="ER">Eritrea</option>
<option value="EE">Estland</option>
<option value="EU">Europäische Union</option>
<option value="FK">Falklandinseln</option>
<option value="FO">Färöer</option>
<option value="FJ">Fidschi</option>
<option value="FI">Finnland</option>
<option value="FR">Frankreich</option>
<option value="GF">Französisch-Guayana</option>
<option value="PF">Französisch-Polynesien</option>
<option value="TF">Französische Süd- und Antarktisgebiete</option>
<option value="GA">Gabun</option>
<option value="GM">Gambia</option>
<option value="GE">Georgien</option>
<option value="GH">Ghana</option>
<option value="GI">Gibraltar</option>
<option value="GD">Grenada</option>
<option value="GR">Griechenland</option>
<option value="GL">Grönland</option>
<option value="GP">Guadeloupe</option>
<option value="GU">Guam</option>
<option value="GT">Guatemala</option>
<option value="GG">Guernsey (Kanalinsel)</option>
<option value="GN">Guinea</option>
<option value="GW">Guinea-Bissau</option>
<option value="GY">Guyana</option>
<option value="HT">Haiti</option>
<option value="HM">Heard und McDonaldinseln</option>
<option value="HN">Honduras</option>
<option value="HK">Hongkong</option>
<option value="IN">Indien</option>
<option value="ID">Indonesien</option>
<option value="IM">Insel Man</option>
<option value="IQ">Irak</option>
<option value="IR">Iran, Islamische Republik</option>
<option value="IE">Irland</option>
<option value="IS">Island</option>
<option value="IL">Israel</option>
<option value="IT">Italien</option>
<option value="JM">Jamaika</option>
<option value="JP">Japan</option>
<option value="YE">Jemen</option>
<option value="JE">Jersey (Kanalinsel)</option>
<option value="JO">Jordanien</option>
<option value="KY">Kaimaninseln</option>
<option value="KH">Kambodscha</option>
<option value="CM">Kamerun</option>
<option value="CA">Kanada</option>
<option value="CV">Kap Verde</option>
<option value="KZ">Kasachstan</option>
<option value="QA">Katar</option>
<option value="KE">Kenia</option>
<option value="KG">Kirgisistan</option>
<option value="KI">Kiribati</option>
<option value="CC">Kokosinseln</option>
<option value="CO">Kolumbien</option>
<option value="KM">Komoren</option>
<option value="CD">Kongo, Demokratische Republik (ehem. Zaire)</option>
<option value="KP">Korea, Demokratische Volksrepublik (Nordkorea)</option>
<option value="KR">Korea, Republik (Südkorea)</option>
<option value="XK">Kosovo</option>
<option value="HR">Kroatien</option>
<option value="CU">Kuba</option>
<option value="KW">Kuwait</option>
<option value="LA">Laos, Demokratische Volksrepublik</option>
<option value="LS">Lesotho</option>
<option value="LV">Lettland</option>
<option value="LB">Libanon</option>
<option value="LR">Liberia</option>
<option value="LY">Libysch-Arabische Dschamahirija (Libyen)</option>
<option value="LI">Liechtenstein</option>
<option value="LT">Litauen</option>
<option value="LU">Luxemburg</option>
<option value="MO">Macao</option>
<option value="MG">Madagaskar</option>
<option value="MW">Malawi</option>
<option value="MY">Malaysia</option>
<option value="MV">Malediven</option>
<option value="ML">Mali</option>
<option value="MT">Malta</option>
<option value="MA">Marokko</option>
<option value="MH">Marshallinseln</option>
<option value="MQ">Martinique</option>
<option value="MR">Mauretanien</option>
<option value="MU">Mauritius</option>
<option value="YT">Mayotte</option>
<option value="MK">Mazedonien, ehem. Jugoslawische Republik [2b]</option>
<option value="MX">Mexiko</option>
<option value="FM">Mikronesien</option>
<option value="MD">Moldawien (Republik Moldau)</option>
<option value="MC">Monaco</option>
<option value="MN">Mongolei</option>
<option value="ME">Montenegro</option>
<option value="MS">Montserrat</option>
<option value="MZ">Mosambik</option>
<option value="MM">Myanmar (Burma)</option>
<option value="NA">Namibia</option>
<option value="NR">Nauru</option>
<option value="NP">Nepal</option>
<option value="NC">Neukaledonien</option>
<option value="NZ">Neuseeland</option>
<option value="NI">Nicaragua</option>
<option value="NL">Niederlande</option>
<option value="AN">Niederländische Antillen</option>
<option value="NE">Niger</option>
<option value="NG">Nigeria</option>
<option value="NU">Niue</option>
<option value="MP">Nördliche Marianen</option>
<option value="NF">Norfolkinsel</option>
<option value="NO">Norwegen</option>
<option value="OM">Oman</option>
<option value="AT">Österreich</option>
<option value="TL">Osttimor (Timor-Leste)</option>
<option value="PK">Pakistan</option>
<option value="PS">Palästinensische Autonomiegebiete</option>
<option value="PW">Palau</option>
<option value="PA">Panama</option>
<option value="PG">Papua-Neuguinea</option>
<option value="PY">Paraguay</option>
<option value="PE">Peru</option>
<option value="PH">Philippinen</option>
<option value="PN">Pitcairninseln</option>
<option value="PL">Polen</option>
<option value="PT">Portugal</option>
<option value="PR">Puerto Rico</option>
<option value="TW">Republik China (Taiwan)</option>
<option value="CG">Republik Kongo</option>
<option value="RE">Réunion</option>
<option value="RW">Ruanda</option>
<option value="RO">Rumänien</option>
<option value="RU">Russische Föderation</option>
<option value="BL">Saint-Barthélemy</option>
<option value="MF">Saint-Martin (franz. Teil)</option>
<option value="SB">Salomonen</option>
<option value="ZM">Sambia</option>
<option value="WS">Samoa</option>
<option value="SM">San Marino</option>
<option value="ST">São Tomé und Príncipe</option>
<option value="SA">Saudi-Arabien</option>
<option value="SE">Schweden</option>
<option value="CH">Schweiz (Confoederatio Helvetica)</option>
<option value="SN">Senegal</option>
<option value="RS">Serbien</option>
<option value="SC">Seychellen</option>
<option value="SL">Sierra Leone</option>
<option value="ZW">Simbabwe</option>
<option value="SG">Singapur</option>
<option value="SX">Sint Maarten (niederl. Teil)</option>
<option value="SK">Slowakei</option>
<option value="SI">Slowenien</option>
<option value="SO">Somalia</option>
<option value="ES">Spanien</option>
<option value="LK">Sri Lanka</option>
<option value="SH">St. Helena</option>
<option value="KN">St. Kitts und Nevis</option>
<option value="LC">St. Lucia</option>
<option value="PM">St. Pierre und Miquelon</option>
<option value="VC">St. Vincent und die Grenadinen</option>
<option value="ZA">Südafrika</option>
<option value="SD">Sudan</option>
<option value="GS">Südgeorgien und die Südlichen Sandwichinseln</option>
<option value="SS">Südsudan</option>
<option value="SR">Suriname</option>
<option value="SJ">Svalbard und Jan Mayen</option>
<option value="SZ">Swasiland</option>
<option value="SY">Syrien, Arabische Republik</option>
<option value="TJ">Tadschikistan</option>
<option value="TZ">Tansania, Vereinigte Republik</option>
<option value="TH">Thailand</option>
<option value="TG">Togo</option>
<option value="TK">Tokelau</option>
<option value="TO">Tonga</option>
<option value="TT">Trinidad und Tobago</option>
<option value="TD">Tschad</option>
<option value="CZ">Tschechische Republik</option>
<option value="TN">Tunesien</option>
<option value="TR">Türkei</option>
<option value="TM">Turkmenistan</option>
<option value="TC">Turks- und Caicosinseln</option>
<option value="TV">Tuvalu</option>
<option value="UG">Uganda</option>
<option value="UA">Ukraine</option>
<option value="HU">Ungarn</option>
<option value="UM">United States Minor Outlying Islands</option>
<option value="UY">Uruguay</option>
<option value="UZ">Usbekistan</option>
<option value="VU">Vanuatu</option>
<option value="VA">Vatikanstadt</option>
<option value="VE">Venezuela</option>
<option value="AE">Vereinigte Arabische Emirate</option>
<option value="US">Vereinigte Staaten von Amerika</option>
<option value="GB">Vereinigtes Königreich Großbritannien und Nordirland</option>
<option value="VN">Vietnam</option>
<option value="WF">Wallis und Futuna</option>
<option value="CX">Weihnachtsinsel</option>
<option value="XW">Weltweit</option>
<option value="EH">Westsahara</option>
<option value="CF">Zentralafrikanische Republik</option>
<option value="CY">Zypern</option>
            </template>
            <template v-else>
              <option value="AF">Afghanistan</option>
<option value="AX">Åland Islands</option>
<option value="AL">Albania</option>
<option value="DZ">Algeria</option>
<option value="AS">American Samoa</option>
<option value="AD">Andorra</option>
<option value="AO">Angola</option>
<option value="AI">Anguilla</option>
<option value="AQ">Antarctica</option>
<option value="AG">Antigua and Barbuda</option>
<option value="AR">Argentina</option>
<option value="AM">Armenia</option>
<option value="AW">Aruba</option>
<option value="AU">Australia</option>
<option value="AT">Austria</option>
<option value="AZ">Azerbaijan</option>
<option value="BS">Bahamas</option>
<option value="BH">Bahrain</option>
<option value="BD">Bangladesh</option>
<option value="BB">Barbados</option>
<option value="BY">Belarus</option>
<option value="BE">Belgium</option>
<option value="BZ">Belize</option>
<option value="BJ">Benin</option>
<option value="BM">Bermuda</option>
<option value="BT">Bhutan</option>
<option value="BO">Bolivia, Plurinational State of</option>
<option value="BQ">Bonaire, Sint Eustatius and Saba</option>
<option value="BA">Bosnia and Herzegovina</option>
<option value="BW">Botswana</option>
<option value="BV">Bouvet Island</option>
<option value="BR">Brazil</option>
<option value="IO">British Indian Ocean Territory</option>
<option value="BN">Brunei Darussalam</option>
<option value="BG">Bulgaria</option>
<option value="BF">Burkina Faso</option>
<option value="BI">Burundi</option>
<option value="KH">Cambodia</option>
<option value="CM">Cameroon</option>
<option value="CA">Canada</option>
<option value="CV">Cape Verde</option>
<option value="KY">Cayman Islands</option>
<option value="CF">Central African Republic</option>
<option value="TD">Chad</option>
<option value="CL">Chile</option>
<option value="CN">China</option>
<option value="CX">Christmas Island</option>
<option value="CC">Cocos (Keeling) Islands</option>
<option value="CO">Colombia</option>
<option value="KM">Comoros</option>
<option value="CG">Congo</option>
<option value="CD">Congo, the Democratic Republic of the</option>
<option value="CK">Cook Islands</option>
<option value="CR">Costa Rica</option>
<option value="CI">Côte d'Ivoire</option>
<option value="HR">Croatia</option>
<option value="CU">Cuba</option>
<option value="CW">Curacao</option>
<option value="CY">Cyprus</option>
<option value="CZ">Czech Republic</option>
<option value="DK">Denmark</option>
<option value="DJ">Djibouti</option>
<option value="DM">Dominica</option>
<option value="DO">Dominican Republic</option>
<option value="EC">Ecuador</option>
<option value="EG">Egypt</option>
<option value="SV">El Salvador</option>
<option value="GQ">Equatorial Guinea</option>
<option value="ER">Eritrea</option>
<option value="EE">Estonia</option>
<option value="ET">Ethiopia</option>
<option value="EU">European Union</option>
<option value="FK">Falkland Islands (Malvinas)</option>
<option value="FO">Faroe Islands</option>
<option value="FJ">Fiji</option>
<option value="FI">Finland</option>
<option value="FR">France</option>
<option value="GF">French Guiana</option>
<option value="PF">French Polynesia</option>
<option value="TF">French Southern Territories</option>
<option value="GA">Gabon</option>
<option value="GM">Gambia</option>
<option value="GE">Georgia</option>
<option value="DE">Germany</option>
<option value="GH">Ghana</option>
<option value="GI">Gibraltar</option>
<option value="GR">Greece</option>
<option value="GL">Greenland</option>
<option value="GD">Grenada</option>
<option value="GP">Guadeloupe</option>
<option value="GU">Guam</option>
<option value="GT">Guatemala</option>
<option value="GG">Guernsey</option>
<option value="GN">Guinea</option>
<option value="GW">Guinea-Bissau</option>
<option value="GY">Guyana</option>
<option value="HT">Haiti</option>
<option value="HM">Heard Island and McDonald Islands</option>
<option value="VA">Holy See (Vatican City State)</option>
<option value="HN">Honduras</option>
<option value="HK">Hong Kong</option>
<option value="HU">Hungary</option>
<option value="IS">Iceland</option>
<option value="IN">India</option>
<option value="ID">Indonesia</option>
<option value="IR">Iran, Islamic Republic of</option>
<option value="IQ">Iraq</option>
<option value="IE">Ireland</option>
<option value="IM">Isle of Man</option>
<option value="IL">Israel</option>
<option value="IT">Italy</option>
<option value="JM">Jamaica</option>
<option value="JP">Japan</option>
<option value="JE">Jersey</option>
<option value="JO">Jordan</option>
<option value="KZ">Kazakhstan</option>
<option value="KE">Kenya</option>
<option value="KI">Kiribati</option>
<option value="KP">Korea, Democratic People's Republic of</option>
<option value="KR">Korea, Republic of</option>
<option value="XK">Kosovo</option>
<option value="KW">Kuwait</option>
<option value="KG">Kyrgyzstan</option>
<option value="LA">Lao People's Democratic Republic</option>
<option value="LV">Latvia</option>
<option value="LB">Lebanon</option>
<option value="LS">Lesotho</option>
<option value="LR">Liberia</option>
<option value="LY">Libyan Arab Jamahiriya</option>
<option value="LI">Liechtenstein</option>
<option value="LT">Lithuania</option>
<option value="LU">Luxembourg</option>
<option value="MO">Macao</option>
<option value="MK">Macedonia, the Former Yugoslav Republic of</option>
<option value="MG">Madagascar</option>
<option value="MW">Malawi</option>
<option value="MY">Malaysia</option>
<option value="MV">Maldives</option>
<option value="ML">Mali</option>
<option value="MT">Malta</option>
<option value="MH">Marshall Islands</option>
<option value="MQ">Martinique</option>
<option value="MR">Mauritania</option>
<option value="MU">Mauritius</option>
<option value="YT">Mayotte</option>
<option value="MX">Mexico</option>
<option value="FM">Micronesia, Federated States of</option>
<option value="MD">Moldova, Republic of</option>
<option value="MC">Monaco</option>
<option value="MN">Mongolia</option>
<option value="ME">Montenegro</option>
<option value="MS">Montserrat</option>
<option value="MA">Morocco</option>
<option value="MZ">Mozambique</option>
<option value="MM">Myanmar</option>
<option value="NA">Namibia</option>
<option value="NR">Nauru</option>
<option value="NP">Nepal</option>
<option value="NL">Netherlands</option>
<option value="AN">Netherlands Antilles</option>
<option value="NC">New Caledonia</option>
<option value="NZ">New Zealand</option>
<option value="NI">Nicaragua</option>
<option value="NE">Niger</option>
<option value="NG">Nigeria</option>
<option value="NU">Niue</option>
<option value="NF">Norfolk Island</option>
<option value="MP">Northern Mariana Islands</option>
<option value="NO">Norway</option>
<option value="OM">Oman</option>
<option value="PK">Pakistan</option>
<option value="PW">Palau</option>
<option value="PS">Palestinian Territory, Occupied</option>
<option value="PA">Panama</option>
<option value="PG">Papua New Guinea</option>
<option value="PY">Paraguay</option>
<option value="PE">Peru</option>
<option value="PH">Philippines</option>
<option value="PN">Pitcairn</option>
<option value="PL">Poland</option>
<option value="PT">Portugal</option>
<option value="PR">Puerto Rico</option>
<option value="QA">Qatar</option>
<option value="RE">Reunion</option>
<option value="RO">Romania</option>
<option value="RU">Russian Federation</option>
<option value="RW">Rwanda</option>
<option value="BL">Saint Barthélemy</option>
<option value="SH">Saint Helena</option>
<option value="KN">Saint Kitts and Nevis</option>
<option value="LC">Saint Lucia</option>
<option value="MF">Saint Martin</option>
<option value="PM">Saint Pierre and Miquelon</option>
<option value="VC">Saint Vincent and the Grenadines</option>
<option value="WS">Samoa</option>
<option value="SM">San Marino</option>
<option value="ST">Sao Tome and Principe</option>
<option value="SA">Saudi Arabia</option>
<option value="SN">Senegal</option>
<option value="RS">Serbia</option>
<option value="SC">Seychelles</option>
<option value="SL">Sierra Leone</option>
<option value="SG">Singapore</option>
<option value="SX">Sint Maarten (Dutch Part)</option>
<option value="SK">Slovakia</option>
<option value="SI">Slovenia</option>
<option value="SB">Solomon Islands</option>
<option value="SO">Somalia</option>
<option value="ZA">South Africa</option>
<option value="GS">South Georgia and the South Sandwich Islands</option>
<option value="SS">South Sudan</option>
<option value="ES">Spain</option>
<option value="LK">Sri Lanka</option>
<option value="SD">Sudan</option>
<option value="SR">Suriname</option>
<option value="SJ">Svalbard and Jan Mayen</option>
<option value="SZ">Swaziland</option>
<option value="SE">Sweden</option>
<option value="CH">Switzerland</option>
<option value="SY">Syrian Arab Republic</option>
<option value="TW">Taiwan, Province of China</option>
<option value="TJ">Tajikistan</option>
<option value="TZ">Tanzania, United Republic of</option>
<option value="TH">Thailand</option>
<option value="TL">Timor-Leste</option>
<option value="TG">Togo</option>
<option value="TK">Tokelau</option>
<option value="TO">Tonga</option>
<option value="TT">Trinidad and Tobago</option>
<option value="TN">Tunisia</option>
<option value="TR">Turkey</option>
<option value="TM">Turkmenistan</option>
<option value="TC">Turks and Caicos Islands</option>
<option value="TV">Tuvalu</option>
<option value="UG">Uganda</option>
<option value="UA">Ukraine</option>
<option value="AE">United Arab Emirates</option>
<option value="GB">United Kingdom</option>
<option value="US">United States</option>
<option value="UM">United States Minor Outlying Islands</option>
<option value="UY">Uruguay</option>
<option value="UZ">Uzbekistan</option>
<option value="VU">Vanuatu</option>
<option value="VE">Venezuela, Bolivarian Republic of</option>
<option value="VN">Viet Nam</option>
<option value="VG">Virgin Islands, British</option>
<option value="VI">Virgin Islands, U.S.</option>
<option value="WF">Wallis and Futuna</option>
<option value="EH">Western Sahara</option>
<option value="XW">Worldwide</option>
<option value="YE">Yemen</option>
<option value="ZM">Zambia</option>
<option value="ZW">Zimbabwe</option>
            </template>
          </select>
          
        </div>
          </div>
          
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
      <div v-if="activeDrawerField === 'note'">
        
          <div class="form-control w-full">
             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('note', 'note') }}</span></label>
             <textarea v-model="drawerForm['_value']" class="textarea textarea-bordered w-full h-24 mb-4" :placeholder="getLabel('note', '', 'plac')"></textarea>
          </div>
          
          <div class="form-control w-full">
             <label class="label"><span class="label-text font-bold capitalize">lang</span></label>
               <input type="text" v-model="drawerForm['#lang']" class="input input-bordered w-full" placeholder="lang" /></div>
      </div>
      <div v-if="activeDrawerField === 'actors'">
        <div class="grid grid-cols-1 gap-x-6">
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('actors.id', 'id') }}</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('actors.id', 'Unique ID of the person or organisation involved. Recommendation: ORCID for individuals, Wikidata/GND for organisations.', 'doc')" v-if="getLabel('actors.id', 'Unique ID of the person or organisation involved. Recommendation: ORCID for individuals, Wikidata/GND for organisations.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"      v-model="drawerForm['id']" class="input input-bordered w-full validator " :placeholder="getLabel('actors.id', 'e.g. https://orcid.org/0000-0003-3047-2722', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('actors.name', 'name') }}</span><span class="text-accent font-black">*</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('actors.name', 'Name of the person or organisation involved in creating this digital resource.', 'doc')" v-if="getLabel('actors.name', 'Name of the person or organisation involved in creating this digital resource.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"     required v-model="drawerForm['name']" class="input input-bordered w-full validator " :placeholder="getLabel('actors.name', 'e.g. name of the person involved in creating the resource', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('actors.actorType', 'actorType') }}</span><span class="text-accent font-black">*</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('actors.actorType', 'Classification of the actor: individual or organisation.', 'doc')" v-if="getLabel('actors.actorType', 'Classification of the actor: individual or organisation.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"     required v-model="drawerForm['actorType']" class="input input-bordered w-full validator " :placeholder="getLabel('actors.actorType', 'e.g. individual | organization', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('actors.roles', 'roles') }}</span><span class="text-accent font-black">*</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('actors.roles', 'Role(s) of the person or organisation in creating this digital resource. An actor can have multiple roles.', 'doc')" v-if="getLabel('actors.roles', 'Role(s) of the person or organisation in creating this digital resource. An actor can have multiple roles.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"     required v-model="drawerForm['roles']" class="input input-bordered w-full validator " :placeholder="getLabel('actors.roles', 'e.g. 3D Data Acquisition Lead | Data Processing', 'plac')" />
          </div>
        </div>
      </div>
      <div v-if="activeDrawerField === 'format'">
        
          <div class="form-control w-full">
             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('format', 'format') }}</span><span class="text-accent font-black">*</span></label>
             <input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('format', '', 'plac')"/>
          </div>
          
          <div class="form-control w-full">
             <label class="label"><span class="label-text font-bold capitalize">lang</span></label>
               <input type="text" v-model="drawerForm['#lang']" class="input input-bordered w-full" placeholder="lang" /></div>
      </div>
      <div v-if="activeDrawerField === 'publicationStatement'">
        <div class="grid grid-cols-1 gap-x-6">
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('publicationStatement.publisher', 'publisher') }}</span><span class="text-accent font-black">*</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('publicationStatement.publisher', 'Organisation publishing or making this digital resource available online.', 'doc')" v-if="getLabel('publicationStatement.publisher', 'Organisation publishing or making this digital resource available online.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"     required v-model="drawerForm['publisher']" class="input input-bordered w-full validator " :placeholder="getLabel('publicationStatement.publisher', 'e.g. University of Bonn, Bonn Center for Digital Humanities', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('publicationStatement.place', 'place') }}</span><span class="text-accent font-black">*</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('publicationStatement.place', 'Place of publication.', 'doc')" v-if="getLabel('publicationStatement.place', 'Place of publication.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"     required v-model="drawerForm['place']" class="input input-bordered w-full validator " :placeholder="getLabel('publicationStatement.place', 'e.g. Bonn, Germany', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('publicationStatement.date', 'date') }}</span><span class="text-accent font-black">*</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('publicationStatement.date', 'Date of publication.', 'doc')" v-if="getLabel('publicationStatement.date', 'Date of publication.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="date" :max="maxDate"    required v-model="drawerForm['date']" class="input input-bordered w-full validator " :placeholder="getLabel('publicationStatement.date', 'e.g. 2025-04-18', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div></div>
      </div>
      <div v-if="activeDrawerField === 'language'">
        
          <div class="form-control w-full">
             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('language', 'language') }}</span><span class="text-warning font-black">~</span></label>
             <input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('language', '', 'plac')"/>
          </div>
          
          <div class="form-control w-full">
             <label class="label"><span class="label-text font-bold capitalize">lang</span></label>
               <input type="text" v-model="drawerForm['#lang']" class="input input-bordered w-full" placeholder="lang" /></div>
      </div>
      <div v-if="activeDrawerField === 'isRepresentationOf'">
        
          <div class="form-control w-full">
             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('isRepresentationOf', 'isRepresentationOf') }}</span><span class="text-accent font-black">*</span></label>
             <input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('isRepresentationOf', '', 'plac')"/>
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
      <div v-if="activeDrawerField === 'nextInSequence'">
        
          <div class="form-control w-full">
             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('nextInSequence', 'nextInSequence') }}</span><span class="text-warning font-black">~</span></label>
             <input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('nextInSequence', '', 'plac')"/>
          </div>
          
          <div class="form-control w-full"></div>
      </div>
      <div v-if="activeDrawerField === 'isPreviousInSequence'">
        
          <div class="form-control w-full">
             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('isPreviousInSequence', 'isPreviousInSequence') }}</span><span class="text-warning font-black">~</span></label>
             <input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('isPreviousInSequence', '', 'plac')"/>
          </div>
          
          <div class="form-control w-full"></div>
      </div>
      <div v-if="activeDrawerField === 'isDerivativeOf'">
        
          <div class="form-control w-full">
             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('isDerivativeOf', 'isDerivativeOf') }}</span><span class="text-warning font-black">~</span></label>
             <input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('isDerivativeOf', '', 'plac')"/>
          </div>
          
          <div class="form-control w-full"></div>
      </div>
      <div v-if="activeDrawerField === 'hasDerivative'">
        
          <div class="form-control w-full">
             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('hasDerivative', 'hasDerivative') }}</span><span class="text-warning font-black">~</span></label>
             <input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('hasDerivative', '', 'plac')"/>
          </div>
          
          <div class="form-control w-full"></div>
      </div>
      <div v-if="activeDrawerField === 'createdDerivative'">
        
          <div class="form-control w-full">
             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('createdDerivative', 'createdDerivative') }}</span><span class="text-warning font-black">~</span></label>
             <input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('createdDerivative', '', 'plac')"/>
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
            <div class="mt-8 pt-4">
              <button type="submit" class="btn btn-primary w-full">{{ t('saveToList') }}</button>
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
    :currentItems="orgPickerTarget === 'actors' ? form['actors'] : []"
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
import { ref, reactive, inject, shallowRef, onMounted, watch } from 'vue';
import { load } from '@tauri-apps/plugin-store';
import SkosmosAutocomplete from '../components/SkosmosAutocomplete.vue';
import PersonPickerModal from '../components/PersonPickerModal.vue';
import OrganizationPickerModal from '../components/OrganizationPickerModal.vue';
import DigitalResourceDcRelations from '../components/DigitalResourceDcRelations.vue';
import DigitalResource3DMetadata from '../components/DigitalResource3DMetadata.vue';
import {
  recentOrganizations,
  recordRecentOrganization,
  savedOrganizations,
  projectHeritageAssets,
  projectActivities,
  updateProjectDigitalResources,
  defaultMetadataLanguage,
  globalRights,
  saveGlobalRights,
  savedContacts,
  savedActors,
  savedPersons,
  addSavedContact,
  addSavedActor,
  addOrUpdatePerson,
  normalizeYearDate,
  CC_LICENCES,
  resolveLicenceUri
} from '../utils/sharedState.js';

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
        actorType: 'organization',
        roles: org.category || 'Content Provider'
      });
    }
  } else if (orgPickerTarget.value === 'source') {
    form['recordInformation.source'] = org.name;
  }
  isOrgPickerOpen.value = false;
};

const clearFormActors = () => {
  form['actors'] = [];
};

const currentLocale = inject('currentLocale', ref('en'));
const fieldLabels = {
  "recordInformation": {
    "en": "Record information",
    "de": "Datensatzinformationen",
    "docEn": "The ID, language, creation information and other metadata describing the record. The ID element of this information block holds the ID assigned by the content provider, cf. section 8.",
    "docDe": "Die ID, Sprache, Erstellungsinformationen und andere Metadaten, die den Datensatz beschreiben. Das ID-Element dieses Informationsblocks enthält die vom Datenanbieter zugewiesene ID, vgl. Abschnitt 8.",
    "placEn": "",
    "placDe": ""
  },
  "recordInformation.id": {
    "en": "Record ID",
    "de": "Datensatz-ID",
    "docEn": "The local ID number in the content provider\\'s information system. Mandatory – must be unique within the collection.",
    "docDe": "Lokale ID dieses Datensatzes im System des Datenanbieters. Pflichtfeld – muss innerhalb der Sammlung eindeutig sein.",
    "placEn": "e.g. 3816816",
    "placDe": "z.B. 3816816"
  },
  "recordInformation.source": {
    "en": "Source",
    "de": "Quelle",
    "docEn": "The name of the organisation that maintains this record about the digital resource.",
    "docDe": "Name der Organisation, die diesen Datensatz über die digitale Ressource pflegt.",
    "placEn": "e.g. Stiftung Preußischer Kulturbesitz, Staatliche Museen zu Berlin, Collection of Classical Antiquities",
    "placDe": "z.B. Stiftung Preußischer Kulturbesitz, Staatliche Museen zu Berlin, Antikensammlung"
  },
  "recordInformation.country": {
    "en": "Country",
    "de": "Land",
    "docEn": "Country in which the head office of the organisation that maintains this record is based.",
    "docDe": "Land, in dem die Organisation mit der Hauptverantwortung für diesen Datensatz ansässig ist.",
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
    "docEn": "Date when this record about the digital resource was created. Not to be confused with the creation date of the digital resource itself (see \\'Created\\').",
    "docDe": "Datum, an dem dieser Datensatz über die digitale Ressource angelegt wurde. Nicht zu verwechseln mit dem Erstellungsdatum der digitalen Ressource selbst (siehe Feld \\'Erstellt\\').",
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
    "docEn": "First and last name of the person responsible for creating the metadata about this digital resource.",
    "docDe": "Vorname(n) und Nachname der Person, die für die Erfassung der Metadaten zu dieser digitalen Ressource verantwortlich ist.",
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
    "placEn": "e.g. John Doe",
    "placDe": "z.B. Max Mustermann"
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
    "en": "Language (Metadata)",
    "de": "Sprache (Metadaten)",
    "docEn": "Default language of the metadata in this record. ISO 639-1 two-letter code.",
    "docDe": "Standardsprache der Metadaten dieses Datensatzes. ISO 639-1 zweistelliger Code.",
    "placEn": "e.g. de | en | fr",
    "placDe": "z.B. de | en | fr"
  },
  "recordInformation.metadataRights": {
    "en": "Metadata Rights",
    "de": "Metadatenrechte",
    "docEn": "Licence for the use of these metadata – not for the digital resource itself (see \\'Rights\\' below).",
    "docDe": "Lizenz für die Nutzung dieser Metadaten – nicht für die digitale Ressource selbst (siehe \\'Rechte\\' weiter unten).",
    "placEn": "e.g. CC BY-SA 4.0",
    "placDe": "z.B. CC BY-SA 4.0"
  },
  "appellation": {
    "en": "Appellation",
    "de": "Bezeichnung",
    "docEn": "The ID and the name given to the information source (see section 11).",
    "docDe": "Die ID und der Name der Informationsquelle (siehe Abschnitt 11).",
    "placEn": "",
    "placDe": ""
  },
  "appellation.name": {
    "en": "Name",
    "de": "Name",
    "docEn": "Name of this digital resource. Mandatory. Can be provided in multiple languages, with a preferred value indicated.",
    "docDe": "Name dieser digitalen Ressource. Pflichtfeld. Kann mehrsprachig angegeben werden, bevorzugter Wert markierbar.",
    "placEn": "e.g. 3D model of a female fragment of the tomb of Nikarete",
    "placDe": "z.B. 3D-Modell des weiblichen Fragments vom Grabmal der Nikarete"
  },
  "appellation.id": {
    "en": "ID",
    "de": "ID",
    "docEn": "Unique identifier of this digital resource. Mandatory. Recommendation: use a DOI or other persistent URI.",
    "docDe": "Eindeutige Kennung dieser digitalen Ressource. Pflichtfeld. Empfehlung: DOI oder andere persistente URI verwenden.",
    "placEn": "e.g. https://doi.org/10.60507/FK2/MHT0HM",
    "placDe": "z.B. https://doi.org/10.60507/FK2/MHT0HM"
  },
  "description": {
    "en": "Description",
    "de": "Beschreibung",
    "docEn": "Description of the digital resource – e.g. describing the view of the heritage asset shown, or technical details of the 3D model. Can be provided in multiple languages, with a preferred value indicated.",
    "docDe": "Beschreibung der digitalen Ressource – z.B. welche Ansicht des Kulturguts gezeigt wird oder technische Details des 3D-Modells. Kann mehrsprachig angegeben werden, bevorzugter Wert markierbar.",
    "placEn": "e.g. 3D mesh model generated using a structured light scanner with a spatial resolution of 0.1 mm. Final mesh resolution: 15.8 million polygons (faces), 7.9 million vertices, 16384×16384 pixel texture.",
    "placDe": "z.B. 3D-Mesh-Modell, erstellt mit einem Structured-Light-Scanner bei 0,1 mm räumlicher Auflösung. Finale Netzauflösung: 15,8 Mio. Polygone (Faces), 7,9 Mio. Eckpunkte (Vertices), Textur 16384×16384 Pixel."
  },
  "note": {
    "en": "Note",
    "de": "Anmerkung",
    "docEn": "Additional note on the digital resource that does not fit into the description – e.g. notes on versions, limitations, or particularities.",
    "docDe": "Zusätzliche Anmerkung zur digitalen Ressource, die nicht in die Beschreibung passt – z.B. Hinweise auf Versionen, Einschränkungen oder Besonderheiten.",
    "placEn": "e.g. The web-optimized version contains reduced texture resolution compared to the archival master.",
    "placDe": "z.B. Web-optimierte Version enthält reduzierte Texturauflösung gegenüber dem Archivmaster."
  },
  "actors": {
    "en": "Actors",
    "de": "Akteure",
    "docEn": "The actors involved in the creation of a digital resource",
    "docDe": "Die an der Erstellung einer digitalen Ressource beteiligten Akteure",
    "placEn": "",
    "placDe": ""
  },
  "actors.id": {
    "en": "ID",
    "de": "ID",
    "docEn": "Unique ID of the person or organisation involved. Recommendation: ORCID for individuals, Wikidata/GND for organisations.",
    "docDe": "Eindeutige ID der beteiligten Person oder Organisation. Empfehlung: ORCID für Personen, Wikidata/GND für Organisationen.",
    "placEn": "e.g. https://orcid.org/0000-0003-3047-2722",
    "placDe": "z.B. https://orcid.org/0000-0003-3047-2722"
  },
  "actors.name": {
    "en": "Name",
    "de": "Name",
    "docEn": "Name of the person or organisation involved in creating this digital resource.",
    "docDe": "Name der Person oder Organisation, die an der Erstellung dieser digitalen Ressource beteiligt war.",
    "placEn": "e.g. name of the person involved in creating the resource",
    "placDe": "z.B. Name der an der Erstellung beteiligten Person"
  },
  "actors.actorType": {
    "en": "Actor Type",
    "de": "Akteurtyp",
    "docEn": "Classification of the actor: individual or organisation.",
    "docDe": "Klassifikation des Akteurs: Einzelperson oder Organisation.",
    "placEn": "e.g. individual | organization",
    "placDe": "z.B. Einzelperson | Organisation"
  },
  "actors.roles": {
    "en": "Roles",
    "de": "Rollen",
    "docEn": "Role(s) of the person or organisation in creating this digital resource. An actor can have multiple roles.",
    "docDe": "Rolle(n) der Person oder Organisation bei der Erstellung dieser digitalen Ressource. Mehrere Rollen pro Akteur möglich.",
    "placEn": "e.g. 3D Data Acquisition Lead | Data Processing",
    "placDe": "z.B. Leitung 3D-Datenerfassung | Datenverarbeitung"
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
    "en": "Organisation",
    "de": "Organisation",
    "docEn": "Organisation to which the involved person belongs.",
    "docDe": "Organisation, der die beteiligte Person angehört.",
    "placEn": "e.g. University of Bonn, Bonn Center for Digital Humanities",
    "placDe": "z.B. Universität Bonn, Bonn Center for Digital Humanities"
  },
  "actors.contacts.email": {
    "en": "Email",
    "de": "E-Mail",
    "docEn": "Email address of the involved person.",
    "docDe": "E-Mail-Adresse der beteiligten Person.",
    "placEn": "e.g. email address of the involved person",
    "placDe": "z.B. E-Mail-Adresse der beteiligten Person"
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
    "en": "House Number",
    "de": "Hausnummer",
    "docEn": "House number of the actor\\'s address.",
    "docDe": "Hausnummer der Adresse des Akteurs.",
    "placEn": "e.g. 22",
    "placDe": "z.B. 22"
  },
  "actors.contacts.address.roadName": {
    "en": "Street",
    "de": "Straße",
    "docEn": "Street name of the actor\\'s address.",
    "docDe": "Straßenname der Adresse des Akteurs.",
    "placEn": "e.g. Maximilianstraße",
    "placDe": "z.B. Maximilianstraße"
  },
  "actors.contacts.address.townOrCity": {
    "en": "City",
    "de": "Ort",
    "docEn": "City of the actor\\'s address.",
    "docDe": "Ort der Adresse des Akteurs.",
    "placEn": "e.g. Bonn",
    "placDe": "z.B. Bonn"
  },
  "actors.contacts.address.postcodeOrZipcode": {
    "en": "Postcode",
    "de": "Postleitzahl",
    "docEn": "Postcode of the actor\\'s address.",
    "docDe": "Postleitzahl der Adresse des Akteurs.",
    "placEn": "e.g. 53111",
    "placDe": "z.B. 53111"
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
    "en": "Country (Address)",
    "de": "Land (Adresse)",
    "docEn": "Country of the actor\\'s address.",
    "docDe": "Land der Adresse des Akteurs.",
    "placEn": "e.g. Germany",
    "placDe": "z.B. Deutschland"
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
  "type": {
    "en": "Type",
    "de": "Typ",
    "docEn": "The nature or genre of the digital resource. Select from 5 predefined values. For a 3D model: \\'3D\\'.",
    "docDe": "Art bzw. Genre der digitalen Ressource. Auswahl aus 5 vordefinierten Werten. Für ein 3D-Modell: \\'3D\\'.",
    "placEn": "e.g. Text | Image | Sound | Movie | 3D",
    "placDe": "z.B. Text | Bild | Ton | Film | 3D"
  },
  "format": {
    "en": "Format",
    "de": "Format",
    "docEn": "The file format of the resource. Recommendation: use a controlled vocabulary, such as Internet Media Types (MIME).",
    "docDe": "Dateiformat der digitalen Ressource. Empfehlung: kontrolliertes Vokabular verwenden, z.B. MIME-Typen.",
    "placEn": "e.g. Model: OBJ + MTL; texture: JPEG",
    "placDe": "z.B. Modell: OBJ + MTL; Textur: JPEG"
  },
  "formatDetails": {
    "en": "Format Details",
    "de": "Formatdetails",
    "docEn": "Additional information about the file or its production that could help in selecting an appropriate viewer.",
    "docDe": "Zusätzliche technische Informationen zur Datei oder ihrer Erstellung, die bei der Wahl eines geeigneten Viewers helfen können.",
    "placEn": "e.g. Original source format: OBJ + MTL + JPEG textures (file size in GB). Web-optimized version (file size in MB), viewable in any WebGL-capable browser or Sketchfab viewer.",
    "placDe": "z.B. Originalformat: OBJ + MTL + JPEG-Texturen (Dateigröße in GB). Web-optimierte Version (Dateigröße in MB), abspielbar in jedem WebGL-fähigen Browser oder Sketchfab-Viewer."
  },
  "extent": {
    "en": "Extent",
    "de": "Ausmaß",
    "docEn": "The size or extent of the resource, including the unit of measurement.",
    "docDe": "Größe bzw. Umfang der Ressource inklusive Maßeinheit.",
    "placEn": "e.g. 45 MB (web version); 2.3 GB (archival version)",
    "placDe": "z.B. 45 MB (Webversion); 2,3 GB (Archivversion)"
  },
  "publicationStatement": {
    "en": "Publication statement",
    "de": "Publikationsangabe",
    "docEn": "(see section 11)",
    "docDe": "(siehe Abschnitt 11)",
    "placEn": "",
    "placDe": ""
  },
  "publicationStatement.publisher": {
    "en": "Publisher",
    "de": "Herausgeber",
    "docEn": "Organisation publishing or making this digital resource available online.",
    "docDe": "Organisation, die diese digitale Ressource online bereitstellt bzw. veröffentlicht.",
    "placEn": "e.g. University of Bonn, Bonn Center for Digital Humanities",
    "placDe": "z.B. Universität Bonn, Bonn Center for Digital Humanities"
  },
  "publicationStatement.place": {
    "en": "Place",
    "de": "Ort",
    "docEn": "Place of publication.",
    "docDe": "Ort der Veröffentlichung.",
    "placEn": "e.g. Bonn, Germany",
    "placDe": "z.B. Bonn, Deutschland"
  },
  "publicationStatement.date": {
    "en": "Date",
    "de": "Datum",
    "docEn": "Date of publication.",
    "docDe": "Datum der Veröffentlichung.",
    "placEn": "e.g. 2025-04-18",
    "placDe": "z.B. 2025-04-18"
  },
  "created": {
    "en": "Created",
    "de": "Erstellt",
    "docEn": "The date when the digital resource itself was created – distinct from the creation and publication dates of the metadata.",
    "docDe": "Datum, an dem die digitale Ressource selbst erstellt wurde – zu unterscheiden vom Erstellungs- und Veröffentlichungsdatum der Metadaten.",
    "placEn": "e.g. 2025-01-30",
    "placDe": "z.B. 2025-01-30"
  },
  "language": {
    "en": "Language (Resource)",
    "de": "Sprache (Ressource)",
    "docEn": "Language of the digital resource itself. Mandatory for text-type resources.",
    "docDe": "Sprache der digitalen Ressource selbst. Pflicht bei textbasierten Ressourcen.",
    "placEn": "e.g. en (for English-language labels within the 3D model)",
    "placDe": "z.B. en (für englischsprachige Beschriftungen im 3D-Modell)"
  },
  "link": {
    "en": "Link",
    "de": "Link",
    "docEn": "The URL of the resource in the best available resolution/quality – a direct link to the file itself, not to the webpage that contains it.",
    "docDe": "URL der digitalen Ressource selbst, in bester verfügbarer Auflösung/Qualität – ein direkter Link zur Rohdatei, nicht zur Webseite, die sie enthält.",
    "placEn": "e.g. https://doi.org/10.60507/FK2/MHT0HM/F3BFT8",
    "placDe": "z.B. https://doi.org/10.60507/FK2/MHT0HM/F3BFT8"
  },
  "object": {
    "en": "Object (Thumbnail)",
    "de": "Vorschaubild",
    "docEn": "A URL to a thumbnail of this resource.",
    "docDe": "URL zu einem Vorschaubild (Thumbnail) dieser Ressource.",
    "placEn": "e.g. https://[domain]/thumbnails/sk740_nikarete.jpg",
    "placDe": "z.B. https://[domain]/thumbnails/sk740_nikarete.jpg"
  },
  "isShownAt": {
    "en": "Is Shown At",
    "de": "Wird Gezeigt Bei",
    "docEn": "A URL to the digital object on the content provider\\'s website in its full information context.",
    "docDe": "URL zur digitalen Ressource auf der Website der Institution, im vollständigen Informationskontext.",
    "placEn": "e.g. https://id.smb.museum/object/699203/",
    "placDe": "z.B. https://id.smb.museum/object/699203/"
  },
  "rights": {
    "en": "Rights",
    "de": "Rechte",
    "docEn": "Content providers are strongly recommended to complete this element.",
    "docDe": "Datenanbietern wird dringend empfohlen, dieses Element auszufüllen.",
    "placEn": "",
    "placDe": ""
  },
  "rights.copyrightCreditLine": {
    "en": "Copyright Credit Line",
    "de": "Urheberrechtsvermerk",
    "docEn": "A statement about the rights holder and rights dates for this digital resource.",
    "docDe": "Aussage über den Rechteinhaber und das Rechtsdatum für diese digitale Ressource.",
    "placEn": "e.g. Staatliche Museen zu Berlin, Antikensammlung / Bonn Center for Digital Humanities, 2025",
    "placDe": "z.B. Staatliche Museen zu Berlin, Antikensammlung / Bonn Center for Digital Humanities, 2025"
  },
  "rights.accessRights": {
    "en": "Access Rights",
    "de": "Zugriffsrechte",
    "docEn": "A statement about the access rights to this digital resource.",
    "docDe": "Aussage über die Zugänglichkeit dieser digitalen Ressource.",
    "placEn": "e.g. Freely accessible online; high-resolution archival version available upon request for research purposes.",
    "placDe": "z.B. Frei online zugänglich; hochauflösende Archivversion auf Anfrage für Forschungszwecke verfügbar."
  },
  "rights.reproductionRights": {
    "en": "Reproduction Rights",
    "de": "Reproduktionsrechte",
    "docEn": "A statement about the reproduction rights for this digital resource, including contact information.",
    "docDe": "Aussage über die Reproduktionsrechte an dieser digitalen Ressource, einschließlich Kontaktinformationen.",
    "placEn": "e.g. reproductions of the 3D model free of charge for research purposes; commercial use via the foundation\\'s image agency",
    "placDe": "z.B. Reproduktionen des 3D-Modells für Forschungszwecke kostenfrei; kommerzielle Nutzung über die Bildagentur der Stiftung"
  },
  "rights.licence": {
    "en": "Licence",
    "de": "Lizenz",
    "docEn": "A URI indicating a licence or conditions for the use of this digital resource.",
    "docDe": "URI, die eine Lizenz oder Nutzungsbedingungen für diese digitale Ressource angibt.",
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
  "isRepresentationOf": {
    "en": "Is Representation Of",
    "de": "Ist Darstellung Von",
    "docEn": "The relation between this digital resource and the heritage asset that it represents.",
    "docDe": "Beziehung zwischen dieser digitalen Ressource und dem Kulturgut, das sie darstellt.",
    "placEn": "e.g. SK 740 (inventory number) or https://id.smb.museum/object/699203",
    "placDe": "z.B. SK 740 (Inventarnummer) oder https://id.smb.museum/object/699203"
  },
  "hasPart": {
    "en": "Has Part",
    "de": "Hat Teil",
    "docEn": "The relation between this digital resource and other digital resources which it contains.",
    "docDe": "Beziehung zwischen dieser digitalen Ressource und anderen digitalen Ressourcen, die sie enthält.",
    "placEn": "e.g. SK_740_Nikarete_texture_images (https://doi.org/10.60507/FK2/MHT0HM/F3BFT8)",
    "placDe": "z.B. SK_740_Nikarete_texture_images (https://doi.org/10.60507/FK2/MHT0HM/F3BFT8)"
  },
  "isPartOf": {
    "en": "Is Part Of",
    "de": "Ist Teil Von",
    "docEn": "The relation between this digital resource and the digital resources of which it forms part.",
    "docDe": "Beziehung zwischen dieser digitalen Ressource und den digitalen Ressourcen, zu denen sie gehört.",
    "placEn": "e.g. ID of the parent record",
    "placDe": "z.B. ID des übergeordneten Datensatzes"
  },
  "nextInSequence": {
    "en": "Next In Sequence",
    "de": "Nächstes In Der Sequenz",
    "docEn": "The relation between this digital resource and the next digital resource in the sequence.",
    "docDe": "Beziehung zwischen dieser digitalen Ressource und der nächsten in einer Sequenz.",
    "placEn": "e.g. ID of the next resource in the sequence",
    "placDe": "z.B. ID der nächsten Ressource in der Sequenz"
  },
  "isPreviousInSequence": {
    "en": "Is Previous In Sequence",
    "de": "Ist Vorheriges In Der Sequenz",
    "docEn": "The relation between this digital resource and the previous digital resource in the sequence.",
    "docDe": "Beziehung zwischen dieser digitalen Ressource und der vorherigen in einer Sequenz.",
    "placEn": "e.g. ID of the previous resource in the sequence",
    "placDe": "z.B. ID der vorherigen Ressource in der Sequenz"
  },
  "isDerivativeOf": {
    "en": "Is Derivative Of",
    "de": "Ist Ableitung Von",
    "docEn": "The relation between this digital resource and the digital resource which it is a derivative of.",
    "docDe": "Beziehung zwischen dieser digitalen Ressource und der digitalen Ressource, von der sie ein Derivat ist.",
    "placEn": "e.g. ID of the source model",
    "placDe": "z.B. ID des Ausgangsmodells"
  },
  "hasDerivative": {
    "en": "Has Derivative",
    "de": "Hat Ableitung",
    "docEn": "The relation between this digital resource and a derivative of it.",
    "docDe": "Beziehung zwischen dieser digitalen Ressource und einem Derivat davon.",
    "placEn": "e.g. SK_740_Nikarete_LP (https://doi.org/10.60507/FK2/MHT0HM/QIPWZC)",
    "placDe": "z.B. SK_740_Nikarete_LP (https://doi.org/10.60507/FK2/MHT0HM/QIPWZC)"
  },
  "createdDerivative": {
    "en": "Created Derivative",
    "de": "Erstelltes Derivat",
    "docEn": "The relation which defines the reuse of this digital resource to create derivatives. A specialisation of \\'Is Derivative Of\\'.",
    "docDe": "Beziehung, die die Weiterverwendung dieser digitalen Ressource zur Erstellung von Derivaten beschreibt. Spezialisierung von \\'Ist Ableitung Von\\'.",
    "placEn": "e.g. ID of the derivative created during the digitisation process",
    "placDe": "z.B. ID des im Digitalisierungsprozess erzeugten Derivats"
  },
  "dcRelation": {
    "en": "DC Relation",
    "de": "DC-Beziehung",
    "docEn": "For general relations from this digital resource.",
    "docDe": "Für allgemeine Beziehungen ausgehend von dieser digitalen Ressource.",
    "placEn": "e.g. https://doi.org/10.60507/FK2/MHT0HM",
    "placDe": "z.B. https://doi.org/10.60507/FK2/MHT0HM"
  }
};
const inlineEditing = reactive({});

// UI Translations Dictionary
const uiTranslations = {
  en: {
    add: 'Add', addItem: '+ Add Item', edit: 'Edit', del: 'Del',
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
    add: 'hinzufügen', addItem: '+ Element hinzufügen', edit: 'bearbeiten', del: 'Löschen',
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

watch(items, (newVal) => {
  updateProjectDigitalResources(newVal);
}, { deep: true, immediate: true });
const isEditing = ref(false);
const editIndex = ref(null);
const form = reactive({ 'recordInformation.id': '',
  'recordInformation.source': '',
  'recordInformation.source#lang': defaultMetadataLanguage.value || 'de',
  'recordInformation.country': '',
  'recordInformation.country#lang': defaultMetadataLanguage.value || 'de',
  'recordInformation.country#authority': 'iso31661a2',
  'recordInformation.creation.date': '',
  'recordInformation.creation.contacts': [],
  'recordInformation.language': defaultMetadataLanguage.value ? [defaultMetadataLanguage.value] : ['de'],
  'recordInformation.language#lang': defaultMetadataLanguage.value || 'de',
  'recordInformation.metadataRights': globalRights?.metadataRights || '',
  'recordInformation.metadataRights#lang': defaultMetadataLanguage.value || 'de',
  'appellation.name': [],
  'appellation.name#lang': defaultMetadataLanguage.value || 'de',
  'appellation.name#preferred': false,
  'appellation.id': '',
  'description': '',
  'note': [],
  'note#lang': defaultMetadataLanguage.value || 'de',
  'actors': [],
  'type': '',
  'format': [],
  'format#lang': defaultMetadataLanguage.value || 'de',
  'formatDetails': '',
  'formatDetails#lang': defaultMetadataLanguage.value || 'de',
  'extent': '',
  'extent#term': '',
  'extent#lang': defaultMetadataLanguage.value || 'de',
  'extent#namespace': '',
  'extent#termUID': '',
  'publicationStatement': [],
  'created': '',
  'language': defaultMetadataLanguage.value ? [defaultMetadataLanguage.value] : ['de'],
  'language#lang': defaultMetadataLanguage.value || 'de',
  'link': '',
  'object': '',
  'isShownAt': '',
  'rights.copyrightCreditLine': globalRights?.copyrightCreditLine || '',
  'rights.copyrightCreditLine#lang': defaultMetadataLanguage.value || 'de',
  'rights.accessRights': globalRights?.accessRights || '',
  'rights.accessRights#lang': defaultMetadataLanguage.value || 'de',
  'rights.reproductionRights': globalRights?.reproductionRights || '',
  'rights.reproductionRights#lang': defaultMetadataLanguage.value || 'de',
  'rights.licence': resolveLicenceUri(globalRights?.licence, currentLocale?.value || 'de') || '',
  'rights.licence#lang': defaultMetadataLanguage.value || 'de',
  'isRepresentationOf': [],
  'hasPart': [],
  'isPartOf': [],
  'nextInSequence': [],
  'isPreviousInSequence': [],
  'isDerivativeOf': [],
  'hasDerivative': [],
  'createdDerivative': [],
  'dcRelation': [] });

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

// --- Template State and Logic ---
const saveSuccessBadge = ref(false);
const store = shallowRef(null);
const templates = ref({});
const activeTemplateField = ref('');
const templateModal = ref(null);
const addTemplateModal = ref(null);
const deleteTemplateModal = ref(null);
const templateToDelete = ref(null);
const newTemplateName = ref('');

onMounted(async () => {
  try {
    store.value = await load('templates.json', { autoSave: true });
    for (const f of ['contacts', 'references', 'temporal', 'spatial']) {
      let tpls = await store.value.get(f);
      if (!tpls || tpls.length === 0) {
        const raw = localStorage.getItem(`hermes_templates_digital_${f}`);
        if (raw) tpls = JSON.parse(raw);
      }
      templates.value[f] = tpls || [];
    }
  } catch (error) {
    console.error('Error loading templates store:', error);
    for (const f of ['contacts', 'references', 'temporal', 'spatial']) {
      try {
        const raw = localStorage.getItem(`hermes_templates_digital_${f}`);
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
    localStorage.setItem(`hermes_templates_digital_${field}`, JSON.stringify(templates.value[field]));
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
      localStorage.setItem(`hermes_templates_digital_${field}`, JSON.stringify(templates.value[field]));
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
  isDrawerOpen.value = true;
};

const closeDrawer = () => { isDrawerOpen.value = false; };

const quickAddContact = (contact) => {
  if (!form['recordInformation.creation.contacts']) {
    form['recordInformation.creation.contacts'] = [];
  }
  const exists = form['recordInformation.creation.contacts'].some(c => c.name === contact.name && c.role === contact.role);
  if (!exists) {
    form['recordInformation.creation.contacts'].push(JSON.parse(JSON.stringify(contact)));
  }
};

const quickAddActor = (actor) => {
  if (!form['actors']) {
    form['actors'] = [];
  }
  const exists = form['actors'].some(a => a.name === actor.name && a.role === actor.role);
  if (!exists) {
    form['actors'].push(JSON.parse(JSON.stringify(actor)));
  }
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

const applyGlobalRights = () => {
  form['recordInformation.metadataRights'] = globalRights.metadataRights || '';
  form['rights.copyrightCreditLine'] = globalRights.copyrightCreditLine || '';
  form['rights.accessRights'] = globalRights.accessRights || '';
  form['rights.reproductionRights'] = globalRights.reproductionRights || '';
  form['rights.licence'] = resolveLicenceUri(globalRights.licence, currentLocale.value) || '';
};

const saveDrawer = () => {
  const field = activeDrawerField.value;
  if (!form[field]) form[field] = [];

  const isPrimitive = drawerForm.hasOwnProperty('_value') && Object.keys(drawerForm).length === 1;
  const dataToSave = isPrimitive ? drawerForm['_value'] : JSON.parse(JSON.stringify(drawerForm));

  if (drawerEditIndex.value > -1) form[field][drawerEditIndex.value] = dataToSave;
  else form[field].push(dataToSave);
  
  if (field === 'recordInformation.creation.contacts' && typeof dataToSave === 'object' && dataToSave?.name) {
    addSavedContact(dataToSave);
  } else if (field === 'actors' && typeof dataToSave === 'object' && dataToSave?.name) {
    addSavedActor(dataToSave);
  }

  closeDrawer();
};

const removeDrawerItem = (field, index) => {
  if (confirm(t('deleteEntryPrompt'))) form[field].splice(index, 1);
};

const save = () => {
  if (!form['recordInformation.country']) {
    form['recordInformation.country'] = 'DE';
  }
  if (!form['language'] || form['language'].length === 0) {
    form['language'] = defaultMetadataLanguage.value ? [defaultMetadataLanguage.value] : ['de'];
  }
  if (!form['recordInformation.language'] || form['recordInformation.language'].length === 0) {
    form['recordInformation.language'] = defaultMetadataLanguage.value ? [defaultMetadataLanguage.value] : ['de'];
  }
  if (!form['recordInformation.metadataRights']) {
    form['recordInformation.metadataRights'] = globalRights.metadataRights || 'https://creativecommons.org/publicdomain/zero/1.0/deed.de';
  }
  if (isEditing.value) {
    items.value[editIndex.value] = JSON.parse(JSON.stringify(form));
  } else {
    items.value.push(JSON.parse(JSON.stringify(form)));
    isEditing.value = true;
    editIndex.value = items.value.length - 1;
  }
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
};

const remove = (index) => {
  if(confirm(t('deletePrompt'))) {
    items.value.splice(index, 1);
    if (isEditing.value && editIndex.value === index) resetForm();
  }
};

const resetForm = () => {
  const defLang = defaultMetadataLanguage.value || 'de';
  Object.keys(form).forEach(key => {
    if (Array.isArray(form[key])) {
      if (form[key].length > 0 && typeof form[key][0] === 'object' && form[key][0] !== null && (key + '#preferred') in form[key][0]) {
        form[key] = [{ _value: '', [key + '#lang']: defLang, [key + '#preferred']: true }];
      } else {
        form[key] = [];
      }
    } else {
      form[key] = '';
    }
  });
  form['recordInformation.language'] = [defLang];
  form['recordInformation.metadataRights'] = globalRights.metadataRights || '';
  form['rights.copyrightCreditLine'] = globalRights.copyrightCreditLine || '';
  form['rights.accessRights'] = globalRights.accessRights || '';
  form['rights.reproductionRights'] = globalRights.reproductionRights || '';
  form['rights.licence'] = resolveLicenceUri(globalRights.licence, currentLocale.value) || '';
  isEditing.value = false;
  editIndex.value = null;
  Object.keys(preferredLanguages).forEach(k => delete preferredLanguages[k]);
};
defineExpose({ items, form });
</script>