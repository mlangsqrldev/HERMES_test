<template>
  <div class="drawer drawer-end collectionInformation-crud">
    <input id="drawer-collectionInformation" type="checkbox" class="drawer-toggle" v-model="isDrawerOpen" />
    
    <div class="drawer-content">
      
      <div class="container mx-auto p-4 max-w-7xl">
        <div class="bg-base-200 p-6 rounded-box shadow-sm mb-10">
          <div class="flex flex-wrap items-center justify-between gap-3 mb-4 pb-2 border-b border-base-300">
            <div class="flex items-center gap-2">
              <h3 class="text-xl font-bold flex items-center gap-2">
                <span>📂</span> {{ currentLocale === 'de' ? 'Sammlung erfassen (Collection)' : 'Collection Information' }}
              </h3>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                class="btn btn-sm btn-outline btn-secondary gap-1.5"
                @click.prevent="isCollectionPickerOpen = true"
                :title="currentLocale === 'de' ? 'Aus kuratiertem Sammlungs-Pool laden' : 'Load from Collection Pool'"
              >
                📂 {{ currentLocale === 'de' ? 'Aus Sammlungs-Pool laden' : 'From Collection Pool' }}
              </button>
              <button
                type="button"
                class="btn btn-sm btn-ghost border border-base-300 gap-1.5 hover:bg-base-200"
                @click.prevent="saveCurrentToPool"
                :title="currentLocale === 'de' ? 'Aktuelle Formulardaten als Vorlage im Sammlungs-Pool speichern' : 'Save current form to collection pool'"
              >
                💾 {{ currentLocale === 'de' ? 'Im Pool merken' : 'Save to Pool' }}
              </button>
              <button
                type="button"
                class="btn btn-sm btn-primary gap-1"
                @click.prevent="resetForm(true)"
                :title="currentLocale === 'de' ? 'Formular leeren für neue Sammlung' : 'New Collection'"
              >
                ➕ {{ currentLocale === 'de' ? 'Neue Sammlung' : 'New Collection' }}
              </button>
            </div>
          </div>
          <form @submit.prevent="save" @invalid.capture="handleInvalid">
            <div class="grid grid-cols-1 gap-x-6">
              
                <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center justify-between">
          <div class="flex flex-row items-center">
            <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('id', 'id') }}</span><span class="text-accent font-black">*</span></label>
            <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('id', 'Unique identifier for this data package. No spaces or special characters. Can be an institutional ID, a URI, or a self-chosen string. Once assigned, do not change.', 'doc')" v-if="getLabel('id', 'Unique identifier for this data package. No spaces or special characters. Can be an institutional ID, a URI, or a self-chosen string. Once assigned, do not change.', 'doc')">
              <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help" :title="getLabel('id', '', 'doc')">
                <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" fill="currentColor" stroke-width="2.5" stroke="currentColor" class="size-[1.2em] primary-content"><path d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
            </div>
          </div>
          <button
            v-if="detectedGndId && form['id'] !== detectedGndId"
            type="button"
            class="btn btn-xs btn-outline btn-primary gap-1 font-mono text-[11px]"
            @click.prevent="form['id'] = detectedGndId"
            :title="currentLocale === 'de' ? 'GND-ID der Einrichtung als Datensatz-ID übernehmen' : 'Apply institution GND ID as record ID'"
          >
            🏛️ GND-ID: {{ detectedGndId }} als ID übernehmen
          </button>
        </div>
        <input type="text" required v-model="form['id']" class="input input-bordered w-full validator" :placeholder="getLabel('id', 'z.B. DE-MUS-814111_Collection oder 5035657-4', 'plac')" />
        <div class="validator-hint">{{t('validationHint')}}</div>
        </div>
        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">
          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">
             <div class="flex flex-row items-center">
               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('title', 'title') }}<span class="text-accent font-black">*</span></h4>          
               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('title', 'Name of this data package or the underlying project. Can be provided in multiple languages, with a preferred value indicated.', 'doc')" v-if="getLabel('title', 'Name of this data package or the underlying project. Can be provided in multiple languages, with a preferred value indicated.', 'doc')">
                  <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help" :title="getLabel('title', '', 'doc')">
                    <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" fill="currentColor" stroke-width="2.5" stroke="currentColor" class="size-[1.2em] primary-content"><path d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
                  </button>
               </div>
             </div>
             <button type="button" class="btn btn-sm btn-primary" @click.prevent="if(!form['title']) { form['title'] = []; } form['title'].push({_value: '', 'title#lang': 'en', 'title#preferred': form['title'].length === 0})">{{ currentLocale === 'de' ? getLabel('title', 'title') + ' ' + t('add') : t('add') + ' ' + getLabel('title', 'title') }}</button>
          </div>
          <div class="p-4 pt-0">
             <ul class="list bg-base-100 rounded-box shadow-md w-full">
                <li v-for="(item, idx) in form['title']" :key="idx" class="list-row flex items-center justify-between group h-auto py-2">
                   <div class="flex-1 w-full mr-4">
                      <input type="text" v-model="item['_value']" class="input input-bordered w-full" :placeholder="getLabel('title', '', 'plac')" />
                   </div>
                   
                   <div class="flex gap-2 items-center">
                     <div class="dropdown dropdown-end shrink-0">
                       <div tabindex="0" role="button" class="btn btn-ghost min-w-[80px]">
                         <span v-if="item['title#lang'] === 'de'" v-html="'<svg class=&quot;h-5 w-8 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 5 3&quot;><rect width=&quot;5&quot; height=&quot;3&quot; y=&quot;0&quot; fill=&quot;#000&quot;/><rect width=&quot;5&quot; height=&quot;2&quot; y=&quot;1&quot; fill=&quot;#D00&quot;/><rect width=&quot;5&quot; height=&quot;1&quot; y=&quot;2&quot; fill=&quot;#FFC800&quot;/></svg>'"></span>
                         <span v-else-if="item['title#lang'] === 'en'" v-html="'<svg class=&quot;h-5 w-8 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 50 30&quot; ><rect width=&quot;50&quot; height=&quot;30&quot; fill=&quot;#012169&quot;/><path d=&quot;M0 0 L50 30 M50 0 L0 30&quot; stroke=&quot;#fff&quot; stroke-width=&quot;6&quot;/><path d=&quot;M0 0 L50 30&quot; stroke=&quot;#C8102E&quot; stroke-width=&quot;2&quot;/><path d=&quot;M50 0 L0 30&quot; stroke=&quot;#C8102E&quot; stroke-width=&quot;2&quot;/><path d=&quot;M25 0 V30 M0 15 H50&quot; stroke=&quot;#fff&quot; stroke-width=&quot;10&quot;/><path d=&quot;M25 0 V30 M0 15 H50&quot; stroke=&quot;#C8102E&quot; stroke-width=&quot;6&quot;/></svg>'"></span>
                         <span v-else-if="item['title#lang'] === 'fr'" v-html="'<svg class=&quot;h-5 w-8 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 3 2&quot;><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;0&quot; fill=&quot;#002395&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;1&quot; fill=&quot;#FFF&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;2&quot; fill=&quot;#ED2939&quot;/></svg>'"></span>
                         <span v-else-if="item['title#lang'] === 'it'" v-html="'<svg class=&quot;h-5 w-8 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 3 2&quot;><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;0&quot; fill=&quot;#009246&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;1&quot; fill=&quot;#FFF&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;2&quot; fill=&quot;#CE2B37&quot;/></svg>'"></span>
                         <span v-else-if="item['title#lang'] === 'es'" v-html="'<svg class=&quot;h-5 w-8 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 3 2&quot;><rect width=&quot;3&quot; height=&quot;2&quot; y=&quot;0&quot; fill=&quot;#C1272D&quot;/><rect width=&quot;3&quot; height=&quot;1&quot; y=&quot;0.5&quot; fill=&quot;#FCE300&quot;/></svg>'"></span>
                         <span v-else class="text-sm font-bold uppercase">{{ item['title#lang'] || t('select') }}</span>
                       </div>
                       <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32 z-[1]">
                         <li><a @click.prevent="item['title#lang'] = 'de'; document.activeElement?.blur()">
                           <span v-html="'<svg class=&quot;h-4 w-6 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 5 3&quot;><rect width=&quot;5&quot; height=&quot;3&quot; y=&quot;0&quot; fill=&quot;#000&quot;/><rect width=&quot;5&quot; height=&quot;2&quot; y=&quot;1&quot; fill=&quot;#D00&quot;/><rect width=&quot;5&quot; height=&quot;1&quot; y=&quot;2&quot; fill=&quot;#FFC800&quot;/></svg>'"></span> DE
                         </a></li>
                         <li><a @click.prevent="item['title#lang'] = 'en'; document.activeElement?.blur()">
                           <span v-html="'<svg class=&quot;h-4 w-6 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 50 30&quot; ><rect width=&quot;50&quot; height=&quot;30&quot; fill=&quot;#012169&quot;/><path d=&quot;M0 0 L50 30 M50 0 L0 30&quot; stroke=&quot;#fff&quot; stroke-width=&quot;6&quot;/><path d=&quot;M0 0 L50 30&quot; stroke=&quot;#C8102E&quot; stroke-width=&quot;2&quot;/><path d=&quot;M50 0 L0 30&quot; stroke=&quot;#C8102E&quot; stroke-width=&quot;2&quot;/><path d=&quot;M25 0 V30 M0 15 H50&quot; stroke=&quot;#fff&quot; stroke-width=&quot;10&quot;/><path d=&quot;M25 0 V30 M0 15 H50&quot; stroke=&quot;#C8102E&quot; stroke-width=&quot;6&quot;/></svg>'"></span> EN
                         </a></li>
                         <li><a @click.prevent="item['title#lang'] = 'fr'; document.activeElement?.blur()">
                           <span v-html="'<svg class=&quot;h-4 w-6 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 3 2&quot;><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;0&quot; fill=&quot;#002395&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;1&quot; fill=&quot;#FFF&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;2&quot; fill=&quot;#ED2939&quot;/></svg>'"></span> FR
                         </a></li>
                         <li><a @click.prevent="item['title#lang'] = 'it'; document.activeElement?.blur()">
                           <span v-html="'<svg class=&quot;h-4 w-6 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 3 2&quot;><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;0&quot; fill=&quot;#009246&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;1&quot; fill=&quot;#FFF&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;2&quot; fill=&quot;#CE2B37&quot;/></svg>'"></span> IT
                         </a></li>
                         <li><a @click.prevent="item['title#lang'] = 'es'; document.activeElement?.blur()">
                           <span v-html="'<svg class=&quot;h-4 w-6 rounded shadow-sm border border-base-300&quot; viewBox=&quot;0 0 3 2&quot;><rect width=&quot;3&quot; height=&quot;2&quot; y=&quot;0&quot; fill=&quot;#C1272D&quot;/><rect width=&quot;3&quot; height=&quot;1&quot; y=&quot;0.5&quot; fill=&quot;#FCE300&quot;/></svg>'"></span> ES
                         </a></li>
                       </ul>
                     </div>
  
                     <div class="flex gap-1 shrink-0">
                        <button type="button" @click.prevent="item['title#preferred'] = !item['title#preferred']; if(item['title#preferred']) { form['title'].forEach((i, iIdx) => { if (iIdx !== idx) i['title#preferred'] = false; }); }" 
                            class="btn btn-square btn-ghost transition-opacity" 
                            :class="item['title#preferred'] ? 'text-warning opacity-100' : 'opacity-0 text-base-content/30 group-hover:opacity-100 hover:text-warning'" 
                            title="Set as preferred">
                            <svg xmlns="http://www.w3.org/2000/svg" class="size-[1.2em]" :fill="item['title#preferred'] ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        </button>
                        
                        <button type="button" @click.prevent="form['title'].splice(idx, 1)" class="btn btn-square btn-ghost text-error opacity-0 group-hover:opacity-100 transition-opacity">
                           <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                     </div>
                   </div>
                </li>
                
                <li v-if="!form['title'] || form['title'].length === 0" class="p-4 text-center text-sm text-base-content/40 italic">
                   {{ t('noItems') }}
                </li>
             </ul>
          </div>
        </div>
                <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center justify-between">
          <div class="flex flex-row items-center">
            <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('source', 'source') }} ({{ currentLocale === 'de' ? 'Name der Einrichtung' : 'Institution Name' }})</span><span class="text-accent font-black">*</span></label>
            <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('source', 'Name of the organisation providing this data package. This is the data supplier, not necessarily the rights holder.', 'doc')" v-if="getLabel('source', 'Name of the organisation providing this data package. This is the data supplier, not necessarily the rights holder.', 'doc')">
              <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
                <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" fill="currentColor" stroke-width="2.5" stroke="currentColor" class="size-[1.2em] primary-content"><path d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
            </div>
          </div>
          <button
            type="button"
            class="btn btn-xs btn-outline btn-secondary gap-1 font-semibold text-[11px]"
            @click.prevent="isOrgPickerOpen = true"
            :title="currentLocale === 'de' ? 'Organisation aus dem Pool auswählen' : 'Pick organization from pool'"
          >
            🏛️ {{ currentLocale === 'de' ? 'Aus Organisations-Pool wählen' : 'From Organization Pool' }}
          </button>
        </div>
        <!-- Integrated Institution / GND Autocomplete in Source field -->
        <InstitutionAutocomplete
          input-id="collection-source-gnd"
          emit-mode="label"
          v-model="form['source']"
          :input-class="'input input-bordered w-full validator text-sm'"
          :placeholder="getLabel('source', 'z.B. Staatliche Museen zu Berlin, Antikensammlung (GND-Suche)', 'plac')"
          @select="handleCollectionInstitutionSelect"
        />
        <div class="validator-hint">{{t('validationHint')}}</div>
        </div>
        <!-- Contacts Table in Collection Information -->
        <div class="col-span-full border border-base-200 bg-base-100 p-3.5 rounded-xl mt-2 mb-4 shadow-xs">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-2.5 pb-2 border-b border-base-200">
            <div class="flex items-center gap-2">
              <span class="font-bold text-sm text-base-content flex items-center gap-1.5">
                <span>👥</span>
                <span>{{ getLabel('contacts', 'contacts') }}</span>
              </span>
              <span class="badge badge-xs badge-neutral font-mono">{{ (form['contacts'] || []).length }}</span>
            </div>
            <div class="flex items-center gap-1.5 flex-wrap">
              <button type="button" class="btn btn-xs btn-outline btn-accent gap-1" @click.prevent="openOrgPicker('contacts')">
                🏛️ {{ currentLocale === 'de' ? 'Organisation' : 'Organization' }}
              </button>
              <button type="button" class="btn btn-xs btn-secondary gap-1 font-bold shadow-xs" @click.prevent="openPersonPicker('contacts')">
                👤 {{ currentLocale === 'de' ? 'Aus Personen-Pool wählen' : 'Select from Person Pool' }}
              </button>
              <button type="button" class="btn btn-xs btn-primary gap-1" @click.prevent="openDrawer('contacts')">
                + {{ currentLocale === 'de' ? 'Kontakt anlegen' : 'Add Contact' }}
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="table table-xs w-full table-zebra">
              <thead class="bg-base-200/60">
                <tr>
                  <th>{{ getLabel('contacts.name', 'name') }}</th>
                  <th>{{ getLabel('contacts.role', 'role') }}</th>
                  <th>{{ getLabel('contacts.organization', 'organization') }}</th>
                  <th>{{ getLabel('contacts.email', 'email') }}</th>
                  <th class="w-20">{{ t('actions') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(subItem, subIdx) in form['contacts']" :key="subIdx">
                  <td class="font-semibold">{{ subItem['name'] }}</td>
                  <td>{{ subItem['role'] }}</td>
                  <td>{{ subItem['organization'] }}</td>
                  <td>{{ subItem['email'] }}</td>
                  <td>
                    <div class="flex gap-1">
                      <button type="button" class="btn btn-xs btn-ghost text-info" @click.prevent="openDrawer('contacts', subIdx)">{{ t('edit') }}</button>
                      <button type="button" class="btn btn-xs btn-ghost text-error" @click.prevent="removeDrawerItem('contacts', subIdx)">✕</button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!form['contacts'] || form['contacts'].length === 0">
                  <td colspan="5" class="text-center text-base-content/40 py-3 italic">{{ t('noItems') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center justify-between">
          <div class="flex flex-row items-center">
            <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('statement', 'statement') }}</span><span class="text-warning font-black">~</span></label>
            
            <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('statement', 'Free-text description of the data package. Describes the content and institutional context. Can be provided in multiple languages, with a preferred value indicated.', 'doc')" v-if="getLabel('statement', 'Free-text description of the data package. Describes the content and institutional context. Can be provided in multiple languages, with a preferred value indicated.', 'doc')">
                  <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
                <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                            fill="currentColor"
                            stroke-width="2.5"
                            stroke="currentColor"
                            class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
                </button>
              </div>
          </div>
          <LanguageBadgePicker v-model="form['statement#lang']" />
        </div>
          <textarea v-model="form['statement']" class="textarea textarea-bordered w-full h-24" :placeholder="getLabel('statement', 'e.g. Pilot project for the 3D documentation of 18 Attic grave monuments from the Berlin Antiquities Collection ...', 'plac')"></textarea>
          
        </div>
        <div class="col-span-full border border-base-300 bg-base-100/50 p-5 rounded-box mb-6 mt-2">
        <div class=" items-center flex flex-row">
          <label class="label mb-2 pb-0">
            <span class="label-text font-bold text-lg capitalize">{{ getLabel('creation', 'creation') }}</span>
          </label>
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('creation', 'Information about how the resources being harvested were collected includes:', 'doc')" v-if="getLabel('creation', 'Information about how the resources being harvested were collected includes:', 'doc')">
              <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
            <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                        fill="currentColor"
                        stroke-width="2.5"
                        stroke="currentColor"
                        class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
            </button>
            </div>
            </div>
              <!--       <div class="text-sm text-base-content/60 mb-4 px-1">{{ getLabel('creation', 'Information about how the resources being harvested were collected includes:', 'doc') }}</div> -->
          <div class="grid grid-cols-1 gap-x-6">
            
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('creation.createdOn', 'createdOn') }}</span><span class="text-warning font-black">~</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('creation.createdOn', 'Date when this data package was created. Format: ISO 8601 (YYYY-MM-DD).', 'doc')" v-if="getLabel('creation.createdOn', 'Date when this data package was created. Format: ISO 8601 (YYYY-MM-DD).', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="date" :max="maxDate"     v-model="form['creation.createdOn']" class="input input-bordered w-full validator " :placeholder="getLabel('creation.createdOn', 'e.g. 2025-01-30', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
          </div>
        </div>
        <div class="form-control w-full mb-4">
          <label class="label pb-1">
            <span class="label-text font-bold capitalize text-base flex items-center gap-2">
              <span>🏷️</span>
              <span>{{ getLabel('keywords', 'keywords') }}</span>
              <span class="text-warning font-black">~</span>
            </span>
          </label>
          <div class="text-xs text-base-content/60 mb-2">
            {{ currentLocale === 'de'
              ? 'Thematische Schlagwörter aus dem HECTOR-Fachvokabular (BCDH Skosmos REST-API) mit Live-Suche und automatischen Vorschlägen.'
              : 'Thematic keywords from HECTOR vocabulary (BCDH Skosmos REST API) with live search.' }}
          </div>
          <HectorKeywordInput v-model="form['keywords']" :current-locale="currentLocale" />
        </div>
        <div class="col-span-full border border-base-300 bg-base-100/50 p-5 rounded-box mb-6 mt-2">
        <div class=" items-center flex flex-row">
          <label class="label mb-2 pb-0">
            <span class="label-text font-bold text-lg capitalize">{{ getLabel('coverage', 'coverage') }}</span>
          </label>
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('coverage', 'Of the collection', 'doc')" v-if="getLabel('coverage', 'Of the collection', 'doc')">
              <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
            <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                        fill="currentColor"
                        stroke-width="2.5"
                        stroke="currentColor"
                        class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
            </button>
            </div>
            </div>
              <!--       <div class="text-sm text-base-content/60 mb-4 px-1">{{ getLabel('coverage', 'Of the collection', 'doc') }}</div> -->
          <div class="grid grid-cols-1 gap-x-6">
            
        <div class="col-span-full border border-base-300 bg-base-100/50 p-5 rounded-box mb-6 mt-2">
        <div class=" items-center flex flex-row">
          <label class="label mb-2 pb-0">
            <span class="label-text font-bold text-lg capitalize">{{ getLabel('coverage.temporal', 'temporal') }}</span>
          </label>
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('coverage.temporal', 'General temporal coverage of the collection', 'doc')" v-if="getLabel('coverage.temporal', 'General temporal coverage of the collection', 'doc')">
              <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
            <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                        fill="currentColor"
                        stroke-width="2.5"
                        stroke="currentColor"
                        class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
            </button>
            </div>
            </div>
            <!-- Explanatory note: Collection coverage vs. Heritage Asset object dating -->
            <div class="alert alert-info/10 border border-info/30 rounded-xl p-3 mb-3 flex items-start gap-2.5 text-xs">
              <span class="text-info text-base mt-0.5">ℹ️</span>
              <div>
                <div class="font-bold text-info">
                  {{ currentLocale === 'de' ? 'Optionaler Sammlungszeitraum (Makro-Ebene)' : 'Optional Collection Temporal Coverage (Macro Level)' }}
                </div>
                <div class="text-base-content/75 mt-0.5 leading-relaxed">
                  {{ currentLocale === 'de' 
                    ? 'Hier wird der globale, übergreifende Zeitraum der gesamten Sammlung erfasst. Die fachspezifische Datierung des konkreten Kulturguts (z. B. Tiberische Zeit, Nikarete-Epoche) gehört in Sektion 02 „Kulturgut“ (Heritage Asset → characters.temporal).' 
                    : 'This describes the general macro timeframe of the whole harvested collection. Archaeological dating of specific artifacts belongs in Section 02 "Heritage Asset" (characters.temporal).' }}
                </div>
              </div>
            </div>
          <div class="grid grid-cols-1 gap-x-6">
            
        <!-- Canonical PeriodO Epoch & Dating Input -->
        <div class="p-4 bg-base-200/40 rounded-2xl border border-base-300/80 mb-4 space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-1">
            <div class="flex items-center gap-2">
              <span class="badge badge-primary font-bold text-xs px-2.5 py-1">🏛️ PeriodO & HECTOR Epochen</span>
              <span class="text-xs font-bold text-base-content/80">
                {{ currentLocale === 'de' ? 'Kanonische Epoche & Zeitspanne zuweisen:' : 'Assign canonical epoch & timespan:' }}
              </span>
            </div>
            <span class="text-[11px] text-base-content/50 italic">
              {{ currentLocale === 'de' ? 'Überträgt Epochenname und Von/Bis-Jahre automatisch' : 'Populates period name and start/end dates' }}
            </span>
          </div>

          <PeriodoAutocomplete
            :current-locale="currentLocale"
            v-model="form['coverage.temporal.periodName']"
            @select="handlePeriodoSelect"
          />
        </div>
        <div class="col-span-full border border-base-300 bg-base-100/50 p-5 rounded-box mb-6 mt-2">
        <div class=" items-center flex flex-row">
          <label class="label mb-2 pb-0">
            <span class="label-text font-bold text-lg capitalize">{{ getLabel('coverage.temporal.timeSpan', 'timeSpan') }}</span>
          </label>
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('coverage.temporal.timeSpan', '', 'doc')" v-if="getLabel('coverage.temporal.timeSpan', '', 'doc')">
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
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('coverage.temporal.timeSpan.startDate', 'startDate') }}</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('coverage.temporal.timeSpan.startDate', 'Earliest date of the general temporal coverage of this data package (not of individual objects).', 'doc')" v-if="getLabel('coverage.temporal.timeSpan.startDate', 'Earliest date of the general temporal coverage of this data package (not of individual objects).', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"    pattern='^(-?[0-9]{1,})(?:-(0[1-9]|1[0-2])(?:-(0[1-9]|[12][0-9]|3[01]))?)?$'  v-model="form['coverage.temporal.timeSpan.startDate']" class="input input-bordered w-full validator " :placeholder="getLabel('coverage.temporal.timeSpan.startDate', 'e.g. -500, 48, -7 or 2025', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('coverage.temporal.timeSpan.endDate', 'endDate') }}</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('coverage.temporal.timeSpan.endDate', 'Latest date of the general temporal coverage of this data package (not of individual objects).', 'doc')" v-if="getLabel('coverage.temporal.timeSpan.endDate', 'Latest date of the general temporal coverage of this data package (not of individual objects).', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"    pattern='^(-?[0-9]{1,})(?:-(0[1-9]|1[0-2])(?:-(0[1-9]|[12][0-9]|3[01]))?)?$'  v-model="form['coverage.temporal.timeSpan.endDate']" class="input input-bordered w-full validator " :placeholder="getLabel('coverage.temporal.timeSpan.endDate', 'e.g. -400, 48, -7 or 2025', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('coverage.temporal.timeSpan.dateRangeQualifier', 'dateRangeQualifier') }}</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('coverage.temporal.timeSpan.dateRangeQualifier', 'the nature of the time span given (e.g. throughout, at some time during, etc.) Use of a controlled vocabulary is recommended.', 'doc')" v-if="getLabel('coverage.temporal.timeSpan.dateRangeQualifier', 'the nature of the time span given (e.g. throughout, at some time during, etc.) Use of a controlled vocabulary is recommended.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"      v-model="form['coverage.temporal.timeSpan.dateRangeQualifier']" class="input input-bordered w-full validator " :placeholder="getLabel('coverage.temporal.timeSpan.dateRangeQualifier', '', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
          </div>
        </div>
      </div>
    </div>
                <div class="col-span-full border border-base-300 bg-base-100/50 p-5 rounded-box mb-6 mt-2">
        <div class=" items-center flex flex-row mb-3">
          <label class="label mb-0 pb-0">
            <span class="label-text font-bold text-lg capitalize">{{ getLabel('coverage.spatial', 'spatial') }}</span>
          </label>
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('coverage.spatial', 'General spatial coverage of the collection, e.g. the country covered.', 'doc')" v-if="getLabel('coverage.spatial', 'General spatial coverage of the collection, e.g. the country covered.', 'doc')">
              <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
            <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                        fill="currentColor"
                        stroke-width="2.5"
                        stroke="currentColor"
                        class="size-[1.2em] primary-content"><path d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
            </button>
            </div>
            </div>

        <!-- Spatial Coverage Linked exclusively via Organisation -->
        <div class="col-span-full border-2 border-base-200 bg-base-100 p-5 rounded-2xl shadow-xs">
          <div class="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-base-200">
            <div class="flex items-center gap-2.5">
              <span class="text-xl">🏛️</span>
              <div>
                <h4 class="font-bold text-lg text-base-content/90">
                  {{ currentLocale === 'de' ? 'Räumliche Verortung (Zentral über Organisation)' : 'Spatial Location (Centrally via Organization)' }}
                </h4>
                <p class="text-xs text-base-content/60">
                  {{ currentLocale === 'de'
                    ? 'Standort, Adressen, Stadt und Land werden ausschließlich zentral über den Organisations-Pool verwaltet und automatisch in die CARARE-Metadaten geschrieben.'
                    : 'Location, addresses, city, and country are managed centrally via organizations and written to XML metadata.' }}
                </p>
              </div>
            </div>
            <button
              type="button"
              class="btn btn-sm btn-outline btn-primary gap-1.5"
              @click.prevent="isOrgPickerOpen = true"
            >
              <span>🏛️</span>
              <span>{{ currentLocale === 'de' ? 'Organisation aus Pool wählen / anlegen' : 'Select / Create Organization in Pool' }}</span>
            </button>
          </div>

          <!-- Quick Select Chips: Last 5 Used Organizations -->
          <div v-if="recentOrganizations && recentOrganizations.length > 0" class="mb-4 p-3 bg-base-200/50 rounded-xl border border-base-300">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xs font-bold text-base-content/80 flex items-center gap-1.5">
                <span>🕒</span>
                <span>{{ currentLocale === 'de' ? 'Zuletzt verwendete Organisationen (max. 5):' : 'Recently used organizations (max. 5):' }}</span>
              </span>
              <span class="text-[11px] text-base-content/40">{{ currentLocale === 'de' ? '1 Klick übernimmt Adresse & Land' : '1 click applies address & country' }}</span>
            </div>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="org in recentOrganizations.slice(0, 5)"
                :key="'rec-' + org.name"
                type="button"
                class="btn btn-xs gap-1.5 transition-all"
                :class="form['source'] === org.name ? 'btn-primary font-bold shadow-xs' : 'btn-outline border-base-300 hover:border-primary'"
                @click.prevent="handleOrgPicked(org)"
              >
                <span>🏛️</span>
                <span>{{ org.name }}</span>
                <span v-if="org.city" class="opacity-60 text-[10px]">({{ org.city }})</span>
                <span v-if="form['source'] === org.name" class="font-bold">✓</span>
              </button>
            </div>
          </div>

          <!-- Active Linked Location Summary Card -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-base-200/40 rounded-xl border border-base-200">
            <div class="space-y-1.5">
              <span class="text-[11px] font-bold uppercase tracking-wider text-base-content/50">
                {{ currentLocale === 'de' ? 'Verknüpfte Institution / Träger' : 'Linked Institution' }}
              </span>
              <div class="font-semibold text-sm break-words leading-snug">
                {{ form['source'] || (currentLocale === 'de' ? '— Noch keine Institution zugewiesen —' : '— No institution assigned —') }}
              </div>
              <div v-if="detectedGndId" class="pt-0.5">
                <span class="inline-flex items-center gap-1 badge badge-info badge-sm whitespace-nowrap font-mono font-bold text-[11px] py-1 px-2.5 shadow-xs">
                  <span>🏛️</span>
                  <span>GND: {{ detectedGndId }}</span>
                </span>
              </div>
            </div>

            <div class="space-y-1">
              <span class="text-[11px] font-bold uppercase tracking-wider text-base-content/50">
                {{ currentLocale === 'de' ? 'Hinterlegte Adresse & Land (in Metadaten)' : 'Stored Address & Country (in metadata)' }}
              </span>
              <div class="text-xs text-base-content/80 flex flex-wrap items-center gap-1.5">
                <span v-if="form['coverage.spatial.locationSet.address.townOrCity']">
                  {{ form['coverage.spatial.locationSet.address.postcodeOrZipcode'] }} {{ form['coverage.spatial.locationSet.address.townOrCity'] }}
                </span>
                <span v-if="form['coverage.spatial.locationSet.address.roadName']" class="opacity-70">
                  • {{ form['coverage.spatial.locationSet.address.roadName'] }} {{ form['coverage.spatial.locationSet.address.numberInRoad'] }}
                </span>
                <span class="badge badge-xs badge-accent font-mono font-bold uppercase">
                  {{ form['coverage.spatial.locationSet.address.country'] || 'DE' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
          </div>
        </div>
        <CollectionDcRelations
          :form="form"
          :current-locale="currentLocale"
          :project-heritage-assets="projectHeritageAssets"
          :project-digital-resources="projectDigitalResources"
          :project-activities="projectActivities"
          :other-collections="items"
          :active-collection-id="form['id']"
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
              <button type="submit" class="btn btn-primary capitalize">{{ t('save') }} {{ getLabel('collectionInformation', 'collectionInformation') }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="drawer-side z-[100]">
      <label for="drawer-collectionInformation" aria-label="close sidebar" class="drawer-overlay"></label>
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
            <label for="drawer-collectionInformation" class="btn btn-circle btn-ghost btn-sm drawer-overlay">✕</label>
          </div>
          <form @submit.prevent="saveDrawer" @invalid.capture="handleInvalid" class="space-y-4">
            
      <div v-if="activeDrawerField === 'contacts'">
        <!-- Quick-fill from Person Pool -->
        <div class="flex items-center justify-between bg-base-200/50 p-2.5 rounded-xl mb-4 border border-base-300">
          <span class="text-xs font-semibold text-base-content/70">
            {{ currentLocale === 'de' ? 'Aus Personen-Pool übernehmen:' : 'Quick-fill from Person Pool:' }}
          </span>
          <div class="flex gap-1.5">
            <button type="button" class="btn btn-xs btn-outline btn-accent gap-1" @click.prevent="openOrgPicker('contacts')">
              🏛️ {{ currentLocale === 'de' ? 'Organisation' : 'Org' }}
            </button>
            <button type="button" class="btn btn-xs btn-secondary gap-1 font-bold shadow-xs" @click.prevent="openPersonPicker('contacts')">
              👤 {{ currentLocale === 'de' ? 'Person wählen' : 'Select Person' }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-x-6">
          <div class="form-control w-full mb-4">
            <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('contacts.name', 'name') }}</span></label>
            <input type="text" v-model="drawerForm['name']" class="input input-bordered w-full" :placeholder="getLabel('contacts.name', 'e.g. John Doe', 'plac')" />
          </div>

          <div class="form-control w-full mb-4">
            <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('contacts.role', 'role') }}</span></label>
            <select v-model="drawerForm['role']" class="select select-bordered w-full">
              <option disabled value="">{{ currentLocale === 'de' ? getLabel('contacts.role', 'role') + ' ' + t('select') : t('select') + ' ' + getLabel('contacts.role', 'role') }}</option>
              <template v-if="currentLocale === 'de'">
                <option value="Dokumentar">Dokumentar</option>
                <option value="Kurator">Kurator</option>
                <option value="Projektleitung">Projektleitung</option>
                <option value="Datenpflege">Datenpflege</option>
                <option value="Restaurator">Restaurator</option>
              </template>
              <template v-else>
                <option value="Curator">Curator</option>
                <option value="Documentation">Documentation</option>
                <option value="Project Management">Project Management</option>
                <option value="Data Management">Data Management</option>
                <option value="Conservator">Conservator</option>
              </template>
            </select>
          </div>

          <div class="form-control w-full mb-4">
            <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('contacts.organization', 'organization') }}</span><span class="text-accent font-black">*</span></label>
            <input type="text" required v-model="drawerForm['organization']" class="input input-bordered w-full validator" :placeholder="getLabel('contacts.organization', 'e.g. Stiftung Preußischer Kulturbesitz', 'plac')" />
            <div class="validator-hint">{{t('validationHint')}}</div>
          </div>

          <div class="form-control w-full mb-4">
            <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('contacts.email', 'email') }}</span></label>
            <input type="email" v-model="drawerForm['email']" class="input input-bordered w-full" placeholder="person@institution.org" />
          </div>
        </div>
      </div>
      <div v-if="activeDrawerField === 'title'">
        
          <div class="form-control w-full">
             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('title', 'title') }}</span><span class="text-accent font-black">*</span></label>
             <input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('title', '', 'plac')"/>
          </div>
          
          <div class="form-control w-full">
             <label class="label"><span class="label-text font-bold capitalize">lang</span></label>
               <input type="text" v-model="drawerForm['#lang']" class="input input-bordered w-full" placeholder="lang" />
             <label class="label"><span class="label-text font-bold capitalize">preferred</span></label>
               <input type="checkbox" v-model="drawerForm['#preferred']" class="checkbox checkbox-sm checkbox-primary" /></div>
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
      <div v-if="activeDrawerField === 'keywords'">
        
          <div class="form-control w-full">
             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('keywords', 'keywords') }}</span><span class="text-warning font-black">~</span></label>
             <input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('keywords', '', 'plac')"/>
          </div>
          
          <div class="form-control w-full">
             <label class="label"><span class="label-text font-bold capitalize">lang</span></label>
               <input type="text" v-model="drawerForm['#lang']" class="input input-bordered w-full" placeholder="lang" />
             <label class="label"><span class="label-text font-bold capitalize">namespace</span></label>
               <input type="text" v-model="drawerForm['#namespace']" class="input input-bordered w-full" placeholder="namespace" /></div>
      </div>
      <div v-if="activeDrawerField === 'coverage.spatial.locationSet.namedLocation'">
        
          <div class="form-control w-full">
             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('coverage.spatial.locationSet.namedLocation', 'namedLocation') }}</span></label>
             <input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('coverage.spatial.locationSet.namedLocation', '', 'plac')"/>
          </div>
          
          <div class="form-control w-full">
             <label class="label"><span class="label-text font-bold capitalize">lang</span></label>
               <input type="text" v-model="drawerForm['#lang']" class="input input-bordered w-full" placeholder="lang" />
             <label class="label"><span class="label-text font-bold capitalize">preferred</span></label>
               <input type="checkbox" v-model="drawerForm['#preferred']" class="checkbox checkbox-sm checkbox-primary" />
             <label class="label"><span class="label-text font-bold capitalize">namespace</span></label>
               <input type="text" v-model="drawerForm['#namespace']" class="input input-bordered w-full" placeholder="namespace" />
             <label class="label"><span class="label-text font-bold capitalize">term</span></label>
               <input type="text" v-model="drawerForm['#term']" class="input input-bordered w-full" placeholder="term" />
             <label class="label"><span class="label-text font-bold capitalize">termUID</span></label>
               <input type="text" v-model="drawerForm['#termUID']" class="input input-bordered w-full" placeholder="termUID" /></div>
      </div>
      <div v-if="activeDrawerField === 'coverage.spatial.locationSet.historicalName'">
        
          <div class="form-control w-full">
             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('coverage.spatial.locationSet.historicalName', 'historicalName') }}</span></label>
             <input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('coverage.spatial.locationSet.historicalName', '', 'plac')"/>
          </div>
          
          <div class="form-control w-full">
             <label class="label"><span class="label-text font-bold capitalize">lang</span></label>
               <input type="text" v-model="drawerForm['#lang']" class="input input-bordered w-full" placeholder="lang" />
             <label class="label"><span class="label-text font-bold capitalize">namespace</span></label>
               <input type="text" v-model="drawerForm['#namespace']" class="input input-bordered w-full" placeholder="namespace" />
             <label class="label"><span class="label-text font-bold capitalize">term</span></label>
               <input type="text" v-model="drawerForm['#term']" class="input input-bordered w-full" placeholder="term" />
             <label class="label"><span class="label-text font-bold capitalize">termUID</span></label>
               <input type="text" v-model="drawerForm['#termUID']" class="input input-bordered w-full" placeholder="termUID" />
             <label class="label"><span class="label-text font-bold capitalize">preferred</span></label>
               <input type="checkbox" v-model="drawerForm['#preferred']" class="checkbox checkbox-sm checkbox-primary" /></div>
      </div>
      <div v-if="activeDrawerField === 'dcRelation'">
        
          <div class="form-control w-full">
             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('dcRelation', 'dcRelation') }}</span><span class="text-warning font-black">~</span></label>
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
          
          <div class="form-control w-full">
             <label class="label"><span class="label-text font-bold capitalize">lang</span></label>
               <input type="text" v-model="drawerForm['#lang']" class="input input-bordered w-full" placeholder="lang" />
             <label class="label"><span class="label-text font-bold capitalize">preferred</span></label>
               <input type="checkbox" v-model="drawerForm['#preferred']" class="checkbox checkbox-sm checkbox-primary" /></div>
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
    mode="contacts"
    :currentItems="form['contacts']"
    @close="isPersonPickerOpen = false"
    @select="handlePersonsSelected"
  />
  <OrganizationPickerModal
    :isOpen="isOrgPickerOpen"
    mode="pick"
    :current-locale="currentLocale"
    @close="isOrgPickerOpen = false"
    @select="handleOrgPicked"
  />
  <CollectionPickerModal
    :isOpen="isCollectionPickerOpen"
    mode="pick"
    :current-locale="currentLocale"
    @close="isCollectionPickerOpen = false"
    @select="handleCollectionPicked"
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
import { ref, reactive, inject, shallowRef, onMounted, onBeforeUnmount, watch } from 'vue';
import { load } from '@tauri-apps/plugin-store';
import SkosmosAutocomplete from '../components/SkosmosAutocomplete.vue';
import PeriodoAutocomplete from '../components/PeriodoAutocomplete.vue';
import HectorKeywordInput from '../components/HectorKeywordInput.vue';
import CollectionDcRelations from '../components/CollectionDcRelations.vue';
import PersonPickerModal from '../components/PersonPickerModal.vue';
import OrganizationPickerModal from '../components/OrganizationPickerModal.vue';
import CollectionPickerModal from '../components/CollectionPickerModal.vue';
import InstitutionAutocomplete from '../components/InstitutionAutocomplete.vue';
import PlaceAutocomplete from '../components/PlaceAutocomplete.vue';
import LanguageBadgePicker from '../components/LanguageBadgePicker.vue';
import {
  defaultMetadataLanguage,
  globalRights,
  saveGlobalRights,
  savedContacts,
  savedPersons,
  savedOrganizations,
  recentOrganizations,
  recordRecentOrganization,
  savedCollections,
  addSavedContact,
  addOrUpdatePerson,
  addOrUpdateCollection,
  normalizeYearDate,
  CC_LICENCES,
  resolveLicenceUri,
  collectionInstitution,
  setCollectionInstitution,
  projectHeritageAssets,
  projectDigitalResources,
  projectActivities
} from '../utils/sharedState.js';
import { getRecentVocabList, recordRecentVocabTerm } from '../utils/vocabHistory.js';

const currentLocale = inject('currentLocale', ref('en'));
const fieldLabels = {
  "id": {
    "en": "ID",
    "de": "ID",
    "docEn": "Unique identifier for this data package. No spaces or special characters. Can be an institutional ID, a URI, or a self-chosen string. Once assigned, do not change.",
    "docDe": "Eindeutiger Bezeichner für dieses Datenpaket. Keine Leerzeichen oder Sonderzeichen. Kann eine institutionelle ID, eine URI oder eine selbst gewählte Zeichenkette sein. Einmal vergeben, nicht mehr ändern.",
    "placEn": "e.g. DE-MUS-814111",
    "placDe": "z.B. DE-MUS-814111"
  },
  "title": {
    "en": "Title",
    "de": "Titel",
    "docEn": "Name of this data package or the underlying project. Can be provided in multiple languages, with a preferred value indicated.",
    "docDe": "Name dieses Datenpakets bzw. des zugrundeliegenden Projekts. Kann mehrsprachig angegeben werden, bevorzugter Wert markierbar.",
    "placEn": "e.g. 3D Digitization of Attic Grave Monuments from the Berlin Antiquities Collection",
    "placDe": "z.B. 3D-Digitalisierung der Attischen Grabmäler der Antikensammlung, Berlin"
  },
  "source": {
    "en": "Source",
    "de": "Quelle",
    "docEn": "Name of the organisation providing this data package. This is the data supplier, not necessarily the rights holder.",
    "docDe": "Name der Organisation, die dieses Datenpaket bereitstellt. Dies ist der Datenlieferant, nicht zwingend der Rechteinhaber.",
    "placEn": "e.g. Stiftung Preußischer Kulturbesitz, Staatliche Museen zu Berlin, Collection of Classical Antiquities",
    "placDe": "z.B. Stiftung Preußischer Kulturbesitz, Staatliche Museen zu Berlin, Antikensammlung"
  },
  "contacts": {
    "en": "Contacts",
    "de": "Kontakte",
    "docEn": "For the collection",
    "docDe": "Für die Sammlung",
    "placEn": "",
    "placDe": ""
  },
  "contacts.name": {
    "en": "Name",
    "de": "Name",
    "docEn": "First and last name of the contact person for this data package. An ORCID ID can be added as an additional attribute.",
    "docDe": "Vorname(n) und Nachname der Ansprechperson für dieses Datenpaket. Eine ORCID-ID kann als zusätzliches Attribut ergänzt werden.",
    "placEn": "e.g. John Doe",
    "placDe": "z.B. Max Mustermann"
  },
  "contacts.role": {
    "en": "Role",
    "de": "Rolle",
    "docEn": "Role of the contact person in the project. Recommendation: use a controlled vocabulary.",
    "docDe": "Aufgabe der Ansprechperson im Projekt. Empfehlung: kontrolliertes Vokabular verwenden.",
    "placEn": "e.g. Documentation | Curator | Data Management",
    "placDe": "z.B. Dokumentation | Kurator | Datenpflege"
  },
  "contacts.organization": {
    "en": "Organisation",
    "de": "Organisation",
    "docEn": "Name of the organisation to which the contact person belongs.",
    "docDe": "Name der Organisation, der die Ansprechperson angehört.",
    "placEn": "e.g. Stiftung Preußischer Kulturbesitz, Staatliche Museen zu Berlin",
    "placDe": "z.B. Stiftung Preußischer Kulturbesitz, Staatliche Museen zu Berlin"
  },
  "contacts.email": {
    "en": "Email",
    "de": "E-Mail",
    "docEn": "Email address of the contact person.",
    "docDe": "E-Mail-Adresse der Ansprechperson.",
    "placEn": "e.g. person@institution.com",
    "placDe": "z.B. person@institution.de"
  },
  "contacts.address": {
    "en": "Address",
    "de": "Adresse",
    "docEn": "The postal address of the person or organization",
    "docDe": "Die Postanschrift der Person oder Organisation",
    "placEn": "",
    "placDe": ""
  },
  "contacts.address.buildingName": {
    "en": "Building Name",
    "de": "Adresszusatz",
    "docEn": "Address supplement, e.g. building or department name (cf. DIN 5008).",
    "docDe": "Zusatz zur Adresse, z.B. Name des Gebäudes oder der Abteilung (vgl. DIN 5008).",
    "placEn": "e.g. Generaldirektion",
    "placDe": "z.B. Generaldirektion"
  },
  "contacts.address.numberInRoad": {
    "en": "House Number",
    "de": "Hausnummer",
    "docEn": "House number of the address.",
    "docDe": "Hausnummer der Adresse.",
    "placEn": "e.g. 41",
    "placDe": "z.B. 41"
  },
  "contacts.address.roadName": {
    "en": "Street",
    "de": "Straße",
    "docEn": "Street name of the address, without house number.",
    "docDe": "Straßenname der Adresse, ohne Hausnummer.",
    "placEn": "e.g. Stauffenbergstr.",
    "placDe": "z.B. Stauffenbergstr."
  },
  "contacts.address.townOrCity": {
    "en": "City",
    "de": "Ort",
    "docEn": "City or town of the address.",
    "docDe": "Ort (Stadt/Gemeinde) der Adresse.",
    "placEn": "e.g. Berlin",
    "placDe": "z.B. Berlin"
  },
  "contacts.address.postcodeOrZipcode": {
    "en": "Postcode",
    "de": "Postleitzahl",
    "docEn": "Postcode of the address.",
    "docDe": "Postleitzahl der Adresse.",
    "placEn": "e.g. 10785",
    "placDe": "z.B. 10785"
  },
  "contacts.address.locality": {
    "en": "Locality",
    "de": "Örtlichkeit",
    "docEn": "A named area within which a monument or building lies",
    "docDe": "Ein benanntes Gebiet, in dem ein Denkmal oder Gebäude liegt",
    "placEn": "",
    "placDe": ""
  },
  "contacts.address.adminArea": {
    "en": "Admin area",
    "de": "Verwaltungsbezirk",
    "docEn": "The name by which an administrative area is known, e.g. Shropshire",
    "docDe": "Der Name, unter dem ein Verwaltungsgebiet bekannt ist, z.B. Shropshire",
    "placEn": "",
    "placDe": ""
  },
  "contacts.address.country": {
    "en": "Country",
    "de": "Land",
    "docEn": "Country of the address.",
    "docDe": "Land der Adresse.",
    "placEn": "e.g. Germany",
    "placDe": "z.B. Deutschland"
  },
  "contacts.phone": {
    "en": "Phone",
    "de": "Telefon",
    "docEn": "",
    "docDe": "",
    "placEn": "",
    "placDe": ""
  },
  "contacts.fax": {
    "en": "Fax",
    "de": "Fax",
    "docEn": "",
    "docDe": "",
    "placEn": "",
    "placDe": ""
  },
  "contacts.description": {
    "en": "Description",
    "de": "Beschreibung",
    "docEn": "",
    "docDe": "",
    "placEn": "",
    "placDe": ""
  },
  "rights": {
    "en": "Rights",
    "de": "Rechte",
    "docEn": "Associated with the collection as a whole. Content providers are strongly recommended to complete this element.",
    "docDe": "Mit der Sammlung als Ganzes verbunden. Datenanbietern wird dringend empfohlen, dieses Element auszufüllen.",
    "placEn": "",
    "placDe": ""
  },
  "rights.copyrightCreditLine": {
    "en": "Copyright Credit Line",
    "de": "Urheberrechtsvermerk",
    "docEn": "Copyright notice for this data package: name of the rights holder and year.",
    "docDe": "Urheberrechtsvermerk für dieses Datenpaket: Name des Rechteinhabers und Jahr.",
    "placEn": "e.g. Staatliche Museen zu Berlin, Antikensammlung, 2025",
    "placDe": "z.B. Staatliche Museen zu Berlin, Antikensammlung, 2025"
  },
  "rights.accessRights": {
    "en": "Access Rights",
    "de": "Zugriffsrechte",
    "docEn": "Access rights for this data package (image files and metadata together) – i.e. for all records delivered together.",
    "docDe": "Zugriffsrechte für dieses Datenpaket (Bilddateien und Metadaten zusammen) – d.h. für alle Datensätze, die gemeinsam ausgeliefert werden.",
    "placEn": "e.g. Open Access | Restricted Access",
    "placDe": "z.B. Open Access | Eingeschränkter Zugang"
  },
  "rights.reproductionRights": {
    "en": "Reproduction Rights",
    "de": "Reproduktionsrechte",
    "docEn": "A statement about the reproduction rights for this data package, including contact information for enquiries.",
    "docDe": "Aussage über die Reproduktionsrechte an diesem Datenpaket, einschließlich Kontaktinformationen für Anfragen.",
    "placEn": "e.g. reproductions free of charge for scholarly use; commercial use upon request",
    "placDe": "z.B. Reproduktionen für wissenschaftliche Zwecke kostenfrei; kommerzielle Nutzung auf Anfrage"
  },
  "rights.licence": {
    "en": "Licence",
    "de": "Lizenz",
    "docEn": "Licence for this data package. Name or URI of the licence under which all contained records are provided.",
    "docDe": "Lizenz für dieses Datenpaket. Name oder URI der Lizenz, unter der alle enthaltenen Datensätze bereitgestellt werden.",
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
  "language": {
    "en": "Language",
    "de": "Sprache",
    "docEn": "Default language of all metadata in this data package. ISO 639-1 two-letter code.",
    "docDe": "Standardsprache aller Metadaten dieses Datenpakets. ISO 639-1 zweistelliger Code.",
    "placEn": "e.g. de | en | fr | it",
    "placDe": "z.B. de | en | fr | it"
  },
  "statement": {
    "en": "Statement",
    "de": "Aussage",
    "docEn": "Free-text description of the data package. Describes the content and institutional context. Can be provided in multiple languages, with a preferred value indicated.",
    "docDe": "Freitext-Beschreibung des Datenpakets. Beschreibt den inhaltlichen und institutionellen Kontext. Kann mehrsprachig angegeben werden, bevorzugter Wert markierbar.",
    "placEn": "e.g. Pilot project for the 3D documentation of 18 Attic grave monuments from the Berlin Antiquities Collection ...",
    "placDe": "z.B. Pilotprojekt zur 3D-Erfassung von 18 attischen Grabmälern der Antikensammlung, Berlin ..."
  },
  "creation": {
    "en": "Creation",
    "de": "Erstellung",
    "docEn": "Information about how the resources being harvested were collected includes:",
    "docDe": "Informationen darüber, wie die geernteten Ressourcen gesammelt wurden, umfassen:",
    "placEn": "",
    "placDe": ""
  },
  "creation.createdOn": {
    "en": "Created On",
    "de": "Erstellt am",
    "docEn": "Date when this data package was created. Format: ISO 8601 (YYYY-MM-DD).",
    "docDe": "Datum, an dem dieses Datenpaket angelegt wurde. Format: ISO 8601 (JJJJ-MM-TT).",
    "placEn": "e.g. 2025-01-30",
    "placDe": "z.B. 2025-01-30"
  },
  "creation.query": {
    "en": "Query",
    "de": "Abfrage",
    "docEn": "The query used to extract the data.",
    "docDe": "Die zur Extraktion der Daten verwendete Abfrage.",
    "placEn": "",
    "placDe": ""
  },
  "keywords": {
    "en": "Keywords",
    "de": "Schlagwörter",
    "docEn": "Thematic keywords for the entire data package. Multiple entries possible. Recommendation: use a controlled vocabulary.",
    "docDe": "Thematische Schlagwörter für das gesamte Datenpaket. Mehrere Einträge möglich. Empfehlung: kontrolliertes Vokabular verwenden.",
    "placEn": "e.g. Grave relief | Photogrammetry | Attic (culture)",
    "placDe": "z.B. Grabrelief | Photogrammetrie | Attika (Kultur)"
  },
  "coverage": {
    "en": "Coverage",
    "de": "Abdeckung",
    "docEn": "Of the collection",
    "docDe": "Der Sammlung",
    "placEn": "",
    "placDe": ""
  },
  "coverage.temporal": {
    "en": "Temporal",
    "de": "Zeitlich",
    "docEn": "General temporal coverage of the collection",
    "docDe": "Allgemeine zeitliche Abdeckung der Sammlung",
    "placEn": "",
    "placDe": ""
  },
  "coverage.temporal.timeSpan": {
    "en": "Time span",
    "de": "Zeitspanne",
    "docEn": "",
    "docDe": "",
    "placEn": "",
    "placDe": ""
  },
  "coverage.temporal.timeSpan.startDate": {
    "en": "Temporal Coverage – Start Date",
    "de": "Zeitliche Abdeckung – Startdatum",
    "docEn": "Earliest date of the general temporal coverage of this data package (not of individual objects).",
    "docDe": "Frühestes Datum der allgemeinen zeitlichen Abdeckung dieses Datenpakets (nicht einzelner Objekte).",
    "placEn": "e.g. -0500 (fifth century BCE)",
    "placDe": "z.B. -0500 (fünftes Jahrhundert v. Chr.)"
  },
  "coverage.temporal.timeSpan.endDate": {
    "en": "Temporal Coverage – End Date",
    "de": "Zeitliche Abdeckung – Enddatum",
    "docEn": "Latest date of the general temporal coverage of this data package (not of individual objects).",
    "docDe": "Spätestes Datum der allgemeinen zeitlichen Abdeckung dieses Datenpakets (nicht einzelner Objekte).",
    "placEn": "e.g. -0400 (fourth century BCE)",
    "placDe": "z.B. -0400 (viertes Jahrhundert v. Chr.)"
  },
  "coverage.temporal.timeSpan.dateRangeQualifier": {
    "en": "Date range qualifier",
    "de": "Datumsbereichs-Qualifikator",
    "docEn": "the nature of the time span given (e.g. throughout, at some time during, etc.) Use of a controlled vocabulary is recommended.",
    "docDe": "die Art der angegebenen Zeitspanne (z.B. durchgehend, zu einem bestimmten Zeitpunkt während usw.). Die Verwendung eines kontrollierten Vokabulars wird empfohlen.",
    "placEn": "",
    "placDe": ""
  },
  "coverage.temporal.periodName": {
    "en": "Period name",
    "de": "Epochenname",
    "docEn": "the name given to the period in history when something occurred. The element may be repeated using the XML:lang attribute if the element value is available in alternate languages. A preferred/alternate attribute may be used to indicate which value is preferred.",
    "docDe": "der Name der Epoche in der Geschichte, in der etwas passiert ist. Das Element kann unter Verwendung des XML:lang-Attributs wiederholt werden.",
    "placEn": "",
    "placDe": ""
  },
  "coverage.temporal.displayDate": {
    "en": "Display date",
    "de": "Anzeigedatum",
    "docEn": "a free text field used to display the date or period for users (e.g. early 19th century, 1950s). The element may be repeated using the XML:lang attribute if the element value is available in alternate languages. A preferred/alternate attribute may be used to indicate which value is preferred.",
    "docDe": "ein Freitextfeld, das zur Anzeige des Datums oder der Epoche für Benutzer verwendet wird. Ein bevorzugt/alternativ-Attribut kann verwendet werden, um anzuzeigen, welcher Wert bevorzugt wird.",
    "placEn": "",
    "placDe": ""
  },
  "coverage.temporal.scientificDate": {
    "en": "Scientific date",
    "de": "Wissenschaftliches Datum",
    "docEn": "date according to scientific dating methods, e.g. ‘1250 bp +/-30 PBN-1675’, recorded precisely as received from the specialist.",
    "docDe": "Datum nach wissenschaftlichen Datierungsmethoden, z.B. \\'1250 bp +/-30 PBN-1675\\', genau so erfasst, wie vom Spezialisten erhalten.",
    "placEn": "",
    "placDe": ""
  },
  "coverage.temporal.scientificDateMethod": {
    "en": "Scientific date method",
    "de": "Wissenschaftliche Datierungsmethode",
    "docEn": "e.g. ‘radiocarbon dating’. Use of a controlled vocabulary is recommended; the vocabulary used should be indicated using an attribute. No particular common vocabulary is recommended for use.",
    "docDe": "z.B. \\'Radiokarbon-Datierung\\'. Die Verwendung eines kontrollierten Vokabulars wird empfohlen.",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial": {
    "en": "Spatial",
    "de": "Räumlich",
    "docEn": "General spatial coverage of the collection, e.g. the country covered.",
    "docDe": "Allgemeine räumliche Abdeckung der Sammlung, z.B. das abgedeckte Land.",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.locationSet": {
    "en": "Spatial Coverage",
    "de": "Räumliche Abdeckung",
    "docEn": "General geographic coverage of this data package, e.g. the country covered. Recommendation: provide a GeoNames URI as attribute.",
    "docDe": "Allgemeine geografische Abdeckung dieses Datenpakets, z.B. das abgedeckte Land. Empfehlung: GeoNames-URI als Attribut angeben.",
    "placEn": "e.g. Greece (Attica) | Berlin, Germany",
    "placDe": "z.B. Griechenland (Attika) | Berlin, Deutschland"
  },
  "coverage.spatial.locationSet.namedLocation": {
    "en": "Named location",
    "de": "Benannter Ort",
    "docEn": "The name of a place or location which is relevant to the entity being described, for example ‘Lake Windermere’. The element may be repeated using the XML:lang attribute if the element value is available in alternate languages. A preferred/alternate attribute may be used to indicate which value is preferred. Use of a controlled vocabulary such as http://www.geonames.org/ is recommended. Content providers are strongly recommended to complete this element.",
    "docDe": "Der Name eines Ortes oder Standorts, der für die beschriebene Entität relevant ist. Die Verwendung eines kontrollierten Vokabulars wird empfohlen.. Datenanbietern wird dringend empfohlen, dieses Element auszufüllen.",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.locationSet.address": {
    "en": "Address",
    "de": "Adresse",
    "docEn": "The postal address",
    "docDe": "Die Postanschrift",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.locationSet.address.buildingName": {
    "en": "Building name",
    "de": "Gebäudename",
    "docEn": "",
    "docDe": "",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.locationSet.address.numberInRoad": {
    "en": "Number in road",
    "de": "Hausnummer",
    "docEn": "The number in a road or street used to identify a property",
    "docDe": "Die Hausnummer in einer Straße zur Identifizierung eines Grundstücks",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.locationSet.address.roadName": {
    "en": "Road name",
    "de": "Straßenname",
    "docEn": "",
    "docDe": "",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.locationSet.address.townOrCity": {
    "en": "Town or city",
    "de": "Stadt oder Ort",
    "docEn": "",
    "docDe": "",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.locationSet.address.postcodeOrZipcode": {
    "en": "Postcode or zipcode",
    "de": "Postleitzahl",
    "docEn": "",
    "docDe": "",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.locationSet.address.locality": {
    "en": "Locality",
    "de": "Örtlichkeit",
    "docEn": "A named area within which a monument or building lies",
    "docDe": "Ein benanntes Gebiet, in dem ein Denkmal oder Gebäude liegt",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.locationSet.address.adminArea": {
    "en": "Admin area",
    "de": "Verwaltungsbezirk",
    "docEn": "The name by which an administrative area is known, e.g. Shropshire",
    "docDe": "Der Name, unter dem ein Verwaltungsgebiet bekannt ist, z.B. Shropshire",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.locationSet.address.country": {
    "en": "Country",
    "de": "Land",
    "docEn": "",
    "docDe": "",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.locationSet.geopoliticalArea": {
    "en": "Geopolitical area",
    "de": "Geopolitisches Gebiet",
    "docEn": "The name of an administrative region which does not form part of the address, for example Scotland, England, Tuscany etc. May also be used for a historical geopolitical area, or an administrative unit (e.g. as defined in the INSPIRE directive).",
    "docDe": "Der Name einer Verwaltungsregion, die nicht Teil der Adresse ist, z.B. Schottland, England, Toskana usw. Kann auch für ein historisches geopolitisches Gebiet oder eine Verwaltungseinheit verwendet werden.",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.locationSet.geopoliticalAreaType": {
    "en": "Geopolitical area type",
    "de": "Typ des geopolitischen Gebiets",
    "docEn": "",
    "docDe": "",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.locationSet.cadastralReference": {
    "en": "Cadastral reference",
    "de": "Katasterreferenz",
    "docEn": "",
    "docDe": "",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.locationSet.historicalName": {
    "en": "Historical name",
    "de": "Historischer Name",
    "docEn": "The element may be repeated using the XML:lang attribute if the element value is available in alternate languages. A preferred/alternate attribute may be used to indicate which value is preferred.",
    "docDe": "Das Element kann unter Verwendung des XML:lang-Attributs wiederholt werden, wenn der Elementwert in alternativen Sprachen verfügbar ist. Ein bevorzugt/alternativ-Attribut kann verwendet werden, um anzuzeigen, welcher Wert bevorzugt wird.",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.geometry": {
    "en": "Geometry",
    "de": "Geometrie",
    "docEn": "",
    "docDe": "",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.geometry.spatialReferenceSystem": {
    "en": "Spatial reference system",
    "de": "Räumliches Referenzsystem",
    "docEn": "Use of a controlled vocabulary is recommended, and the vocabulary used may be indicated using an attribute (e.g. WGS84). The ESPG spatial coordinate reference is recommended for use. (Mandatory where coordinates are provided)",
    "docDe": "Die Verwendung eines kontrollierten Vokabulars wird empfohlen. Die räumliche Koordinatenreferenz ESPG wird zur Verwendung empfohlen. (Obligatorisch, wenn Koordinaten bereitgestellt werden)",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.geometry.quickpoint": {
    "en": "Quickpoint",
    "de": "Quickpoint",
    "docEn": "this is the centre point",
    "docDe": "dies ist der Mittelpunkt",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.geometry.quickpoint.x": {
    "en": "X",
    "de": "X",
    "docEn": "according to the spatial coordinate system in use",
    "docDe": "gemäß dem verwendeten räumlichen Koordinatensystem",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.geometry.quickpoint.y": {
    "en": "Y",
    "de": "Y",
    "docEn": "according to the spatial coordinate system in use",
    "docDe": "gemäß dem verwendeten räumlichen Koordinatensystem",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.geometry.quickpoint.z": {
    "en": "Z",
    "de": "Z",
    "docEn": "height",
    "docDe": "Höhe",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.geometry.quickpoint.accuracy": {
    "en": "Accuracy",
    "de": "Genauigkeit",
    "docEn": "",
    "docDe": "",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.geometry.boundingBox": {
    "en": "Bounding box",
    "de": "Begrenzungsrahmen",
    "docEn": "",
    "docDe": "",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.geometry.boundingBox.minX": {
    "en": "Min x",
    "de": "Min x",
    "docEn": "according to the spatial coordinate system in use",
    "docDe": "gemäß dem verwendeten räumlichen Koordinatensystem",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.geometry.boundingBox.maxX": {
    "en": "Max x",
    "de": "Max x",
    "docEn": "according to the spatial coordinate system in use",
    "docDe": "gemäß dem verwendeten räumlichen Koordinatensystem",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.geometry.boundingBox.minY": {
    "en": "Min y",
    "de": "Min y",
    "docEn": "according to the spatial coordinate system in use",
    "docDe": "gemäß dem verwendeten räumlichen Koordinatensystem",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.geometry.boundingBox.maxY": {
    "en": "Max y",
    "de": "Max y",
    "docEn": "according to the spatial coordinate system in use",
    "docDe": "gemäß dem verwendeten räumlichen Koordinatensystem",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.geometry.boundingBox.minZ": {
    "en": "Min z",
    "de": "Min z",
    "docEn": "height",
    "docDe": "Höhe",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.geometry.boundingBox.maxZ": {
    "en": "Max z",
    "de": "Max z",
    "docEn": "height",
    "docDe": "Höhe",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.geometry.boundingBox.accuracy": {
    "en": "Accuracy",
    "de": "Genauigkeit",
    "docEn": "",
    "docDe": "",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.geometry.otherGeometries": {
    "en": "Other geometries",
    "de": "Andere Geometrien",
    "docEn": "Datum, units",
    "docDe": "Bezugssystem, Einheiten",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.geometry.otherGeometries.type": {
    "en": "Type",
    "de": "Typ",
    "docEn": "(Point, Line, Polygon) (repeating group to allow a series of points to be recorded)",
    "docDe": "(Punkt, Linie, Polygon) (wiederholende Gruppe, um die Aufzeichnung einer Reihe von Punkten zu ermöglichen)",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.geometry.otherGeometries.type.x": {
    "en": "X",
    "de": "X",
    "docEn": "according to the spatial coordinate system in use",
    "docDe": "gemäß dem verwendeten räumlichen Koordinatensystem",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.geometry.otherGeometries.type.y": {
    "en": "Y",
    "de": "Y",
    "docEn": "according to the spatial coordinate system in use",
    "docDe": "gemäß dem verwendeten räumlichen Koordinatensystem",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.geometry.otherGeometries.type.z": {
    "en": "Z",
    "de": "Z",
    "docEn": "height",
    "docDe": "Höhe",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.geometry.otherGeometries.accuracy": {
    "en": "Accuracy",
    "de": "Genauigkeit",
    "docEn": "free-text, the accuracy of the point in metres.",
    "docDe": "Freitext, die Genauigkeit des Punktes in Metern.",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.geometry.entity": {
    "en": "Entity",
    "de": "Entität",
    "docEn": "GML, Well-known text (WKT).",
    "docDe": "GML, Well-known text (WKT).",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.geometry.storedPrecision": {
    "en": "Stored precision",
    "de": "Gespeicherte Genauigkeit",
    "docEn": "The precision of a coordinate as stored in the system and as delivered to the users.",
    "docDe": "Die Genauigkeit einer Koordinate, wie sie im System gespeichert und an die Benutzer geliefert wird.",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.geometry.area": {
    "en": "Area",
    "de": "Fläche",
    "docEn": "Units",
    "docDe": "Einheiten",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.representations": {
    "en": "Representations",
    "de": "Darstellungen",
    "docEn": "How a feature is represented on a map",
    "docDe": "Wie ein Merkmal auf einer Karte dargestellt wird",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.cartesianCoordinates3D": {
    "en": "Cartesian coordinates3d",
    "de": "Kartesische Koordinaten 3D",
    "docEn": "use for the local coordinates within a 3D model",
    "docDe": "wird für die lokalen Koordinaten innerhalb eines 3D-Modells verwendet",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.cartesianCoordinates3D.cartesianCoordinatesSystem": {
    "en": "Cartesian coordinates system",
    "de": "Kartesisches Koordinatensystem",
    "docEn": "this is the local coordinate system in use within the particular software",
    "docDe": "dies ist das lokale Koordinatensystem, das innerhalb der jeweiligen Software verwendet wird",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.cartesianCoordinates3D.viewpoints": {
    "en": "Viewpoints",
    "de": "Blickwinkel",
    "docEn": "a viewpoint within the 3D model, i.e. where the camera is positioned in the digitisation process",
    "docDe": "ein Blickwinkel innerhalb des 3D-Modells, d.h. wo die Kamera im Digitalisierungsprozess positioniert ist",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.cartesianCoordinates3D.viewpoints.x": {
    "en": "X",
    "de": "X",
    "docEn": "",
    "docDe": "",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.cartesianCoordinates3D.viewpoints.y": {
    "en": "Y",
    "de": "Y",
    "docEn": "",
    "docDe": "",
    "placEn": "",
    "placDe": ""
  },
  "coverage.spatial.cartesianCoordinates3D.viewpoints.z": {
    "en": "Z",
    "de": "Z",
    "docEn": "",
    "docDe": "",
    "placEn": "",
    "placDe": ""
  },
  "dcRelation": {
    "en": "DC Relation",
    "de": "DC-Relation",
    "docEn": "General link to related resources – points to the institution, a related project, or a publication.",
    "docDe": "Allgemeiner Link zu verwandten Ressourcen – verweist auf die Institution, ein verwandtes Projekt oder eine Publikation.",
    "placEn": "e.g. https://www.smb.museum/museen-einrichtungen/antikensammlung/home/",
    "placDe": "z.B. https://www.smb.museum/museen-einrichtungen/antikensammlung/home/"
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
const isEditing = ref(false);
const editIndex = ref(null);

const clearFormContacts = () => {
  form['contacts'] = [];
};

const recentKeywords = getRecentVocabList('keywords');

const addKeyword = (term) => {
  if (!term || typeof term !== 'string') return;
  const val = term.trim();
  if (!val) return;
  if (!form['keywords']) form['keywords'] = [];
  if (!form['keywords'].includes(val)) {
    form['keywords'].push(val);
    recordRecentVocabTerm('keywords', val);
  }
};

const removeKeyword = (idx) => {
  if (form['keywords']) {
    form['keywords'].splice(idx, 1);
  }
};

const form = reactive({ 'id': '',
  'title': [{ _value: '', 'title#lang': defaultMetadataLanguage.value || 'de', 'title#preferred': true }],
  'source': '',
  'source#lang': defaultMetadataLanguage.value || 'de',
  'contacts': [],
  'rights.copyrightCreditLine': globalRights?.copyrightCreditLine || '',
  'rights.copyrightCreditLine#lang': defaultMetadataLanguage.value || 'de',
  'rights.accessRights': globalRights?.accessRights || '',
  'rights.accessRights#lang': defaultMetadataLanguage.value || 'de',
  'rights.reproductionRights': globalRights?.reproductionRights || '',
  'rights.reproductionRights#lang': defaultMetadataLanguage.value || 'de',
  'rights.licence': resolveLicenceUri(globalRights?.licence, currentLocale?.value || 'de') || '',
  'rights.licence#lang': defaultMetadataLanguage.value || 'de',
  'language': defaultMetadataLanguage.value ? [defaultMetadataLanguage.value] : ['de'],
  'language#lang': defaultMetadataLanguage.value || 'de',
  'statement': '',
  'statement#lang': '',
  'statement#preferred': false,
  'creation.createdOn': '',
  'keywords': [],
  'keywords#lang': '',
  'keywords#namespace': '',
  'coverage.temporal.timeSpan.startDate': '',
  'coverage.temporal.timeSpan.endDate': '',
  'coverage.temporal.timeSpan.dateRangeQualifier': '',
  'coverage.temporal.timeSpan.dateRangeQualifier#namespace': '',
  'coverage.temporal.timeSpan.dateRangeQualifier#lang': '',
  'coverage.temporal.periodName': '',
  'coverage.temporal.periodName#lang': '',
  'coverage.temporal.periodName#preferred': false,
  'coverage.temporal.scientificDate': '',
  'coverage.temporal.scientificDate#lang': '',
  'coverage.temporal.scientificDateMethod': '',
  'coverage.temporal.scientificDateMethod#lang': '',
  'coverage.spatial.locationSet.namedLocation': [],
  'coverage.spatial.locationSet.namedLocation#lang': '',
  'coverage.spatial.locationSet.namedLocation#preferred': false,
  'coverage.spatial.locationSet.namedLocation#namespace': '',
  'coverage.spatial.locationSet.namedLocation#term': '',
  'coverage.spatial.locationSet.namedLocation#termUID': '',
  'coverage.spatial.locationSet.address.buildingName': '',
  'coverage.spatial.locationSet.address.buildingName#lang': '',
  'coverage.spatial.locationSet.address.buildingName#authority': '',
  'coverage.spatial.locationSet.address.numberInRoad': '',
  'coverage.spatial.locationSet.address.numberInRoad#lang': '',
  'coverage.spatial.locationSet.address.numberInRoad#authority': '',
  'coverage.spatial.locationSet.address.roadName': '',
  'coverage.spatial.locationSet.address.townOrCity': '',
  'coverage.spatial.locationSet.address.townOrCity#lang': '',
  'coverage.spatial.locationSet.address.townOrCity#authority': '',
  'coverage.spatial.locationSet.address.postcodeOrZipcode': '',
  'coverage.spatial.locationSet.address.postcodeOrZipcode#authority': '',
  'coverage.spatial.locationSet.address.country': '',
  'coverage.spatial.locationSet.address.country#lang': '',
  'coverage.spatial.locationSet.address.country#authority': 'iso31661a2',
  'coverage.spatial.locationSet.geopoliticalArea': '',
  'coverage.spatial.locationSet.geopoliticalArea#lang': '',
  'coverage.spatial.locationSet.geopoliticalAreaType': '',
  'coverage.spatial.locationSet.geopoliticalAreaType#lang': '',
  'coverage.spatial.locationSet.geopoliticalAreaType#namespace': '',
  'coverage.spatial.locationSet.cadastralReference': '',
  'coverage.spatial.locationSet.cadastralReference#ref': '',
  'coverage.spatial.locationSet.historicalName': [],
  'coverage.spatial.locationSet.historicalName#lang': '',
  'coverage.spatial.locationSet.historicalName#namespace': '',
  'coverage.spatial.locationSet.historicalName#term': '',
  'coverage.spatial.locationSet.historicalName#termUID': '',
  'coverage.spatial.locationSet.historicalName#preferred': false,
  'dcRelation': [],
  'dcRelation#lang': '',
  'dcRelation#preferred': false });

const detectedGndId = ref('');

const handleCollectionInstitutionSelect = (item) => {
  if (!item) return;
  // Lower field gets the Institution Name
  form['source'] = item.label;

  // Upper field gets the GND ID (or offers it via chip)
  if (item.gnd) {
    detectedGndId.value = item.gnd;
    if (!form['id'] || form['id'] === 'HERMES-COLLECTION-001' || form['id'] === 'Collection_1' || form['id'].includes('Collection')) {
      form['id'] = item.gnd;
    }
  }

  setCollectionInstitution({
    name: item.label,
    gnd: item.gnd || '',
    uri: item.uri || ''
  });
};

// Synchronize collection institution to global shared state for auto-fill in HeritageAsset
watch([() => form['source'], () => form['id']], ([newSource, newId]) => {
  if (newSource || newId) {
    setCollectionInstitution({
      name: newSource || '',
      gnd: (newId && !newId.startsWith('http')) ? newId : '',
      uri: (newId && newId.startsWith('http')) ? newId : ''
    });
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
        const raw = localStorage.getItem(`hermes_templates_collection_${f}`);
        if (raw) tpls = JSON.parse(raw);
      }
      templates.value[f] = tpls || [];
    }
  } catch (error) {
    console.error('Error loading templates store:', error);
    for (const f of ['contacts', 'references', 'temporal', 'spatial']) {
      try {
        const raw = localStorage.getItem(`hermes_templates_collection_${f}`);
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
    localStorage.setItem(`hermes_templates_collection_${field}`, JSON.stringify(templates.value[field]));
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
      localStorage.setItem(`hermes_templates_collection_${field}`, JSON.stringify(templates.value[field]));
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

const quickAddContact = (contact) => {
  if (!form['contacts']) {
    form['contacts'] = [];
  }
  const exists = form['contacts'].some(c => c.name === contact.name && c.role === contact.role);
  if (!exists) {
    form['contacts'].push(JSON.parse(JSON.stringify(contact)));
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
  form['rights.copyrightCreditLine'] = globalRights.copyrightCreditLine || '';
  form['rights.accessRights'] = globalRights.accessRights || '';
  form['rights.reproductionRights'] = globalRights.reproductionRights || '';
  form['rights.licence'] = resolveLicenceUri(globalRights.licence, currentLocale.value) || '';
};

const isPersonPickerOpen = ref(false);

const openPersonPicker = () => {
  isPersonPickerOpen.value = true;
};

const handlePersonsSelected = (selectedList) => {
  if (!form['contacts']) form['contacts'] = [];
  if (activeDrawerField.value === 'contacts' && selectedList.length > 0) {
    const p = selectedList[0];
    drawerForm['name'] = p.name || '';
    drawerForm['role'] = p.role || p.roles || '';
    drawerForm['organization'] = p.organization || '';
    drawerForm['email'] = p.email || '';
  }
  selectedList.forEach(p => {
    const exists = form['contacts'].some(c => (c.name || '').trim().toLowerCase() === (p.name || '').trim().toLowerCase());
    if (!exists) {
      form['contacts'].push({
        name: p.name || '',
        role: p.role || p.roles || '',
        organization: p.organization || '',
        email: p.email || ''
      });
    }
  });
  isPersonPickerOpen.value = false;
};

const saveDrawer = () => {
  const field = activeDrawerField.value;
  if (!form[field]) form[field] = [];

  const isPrimitive = drawerForm.hasOwnProperty('_value') && Object.keys(drawerForm).length === 1;
  const dataToSave = isPrimitive ? drawerForm['_value'] : JSON.parse(JSON.stringify(drawerForm));

  if (drawerEditIndex.value > -1) form[field][drawerEditIndex.value] = dataToSave;
  else form[field].push(dataToSave);
  
  if (field === 'contacts' && typeof dataToSave === 'object' && dataToSave?.name) {
    addOrUpdatePerson(dataToSave);
  }

  closeDrawer();
};

const removeDrawerItem = (field, index) => {
  if (Array.isArray(form[field])) {
    form[field].splice(index, 1);
  }
};

const save = () => {
  if (!form['language'] || form['language'].length === 0) {
    form['language'] = defaultMetadataLanguage.value ? [defaultMetadataLanguage.value] : ['de'];
  }
  // Auto-populate central global rights silently into metadata
  form['rights.copyrightCreditLine'] = form['rights.copyrightCreditLine'] || globalRights?.copyrightCreditLine || '';
  form['rights.accessRights'] = form['rights.accessRights'] || globalRights?.accessRights || '';
  form['rights.reproductionRights'] = form['rights.reproductionRights'] || globalRights?.reproductionRights || '';
  form['rights.licence'] = form['rights.licence'] || resolveLicenceUri(globalRights?.licence, currentLocale.value) || '';

  // Ensure country is always populated from organisation into metadata
  if (!form['coverage.spatial.locationSet.address.country']) {
    const matchedOrg = (savedOrganizations.value || []).find(o => o.name === form['source']) || savedOrganizations.value?.[0];
    form['coverage.spatial.locationSet.address.country'] = (matchedOrg?.country || 'DE').toUpperCase();
  }

  if (form['coverage.temporal.timeSpan.startDate']) {
    form['coverage.temporal.timeSpan.startDate'] = normalizeYearDate(form['coverage.temporal.timeSpan.startDate']);
  }
  if (form['coverage.temporal.timeSpan.endDate']) {
    form['coverage.temporal.timeSpan.endDate'] = normalizeYearDate(form['coverage.temporal.timeSpan.endDate']);
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

const remove = (index) => {
  items.value.splice(index, 1);
  if (isEditing.value && editIndex.value === index) resetForm(true);
};

const isOrgPickerOpen = ref(false);
const isCollectionPickerOpen = ref(false);
const orgPickerTarget = ref('source');

const openOrgPicker = (target = 'source') => {
  orgPickerTarget.value = target;
  isOrgPickerOpen.value = true;
};

const getDisplayName = (item) => {
  if (!item) return '—';
  if (Array.isArray(item['title']) && item['title'].length > 0) {
    const pref = item['title'].find(t => t && t['title#preferred']);
    if (pref && pref._value) return pref._value;
    const firstWithVal = item['title'].find(t => t && t._value);
    if (firstWithVal && firstWithVal._value) return firstWithVal._value;
  }
  if (typeof item['title'] === 'string' && item['title']) return item['title'];
  return item['id'] || '—';
};

const duplicate = (index) => {
  const sourceItem = items.value[index];
  if (!sourceItem) return;
  const cloned = JSON.parse(JSON.stringify(sourceItem));
  cloned.id = `${cloned.id || 'Collection'}_copy_${Date.now().toString().slice(-4)}`;
  if (Array.isArray(cloned.title) && cloned.title[0]) {
    cloned.title[0]._value = `${cloned.title[0]._value || ''} (Kopie)`;
  }
  items.value.push(cloned);
  edit(items.value.length - 1);
};

const saveCurrentToPool = () => {
  const titleVal = getDisplayName(form);
  const colObj = {
    id: form['id'] || `COL-${Date.now().toString().slice(-4)}`,
    title: titleVal !== '—' ? titleVal : 'Unbenannte Sammlung',
    institution: form['source'] || '',
    rights: {
      licence: form['rights.licence'] || '',
      accessRights: form['rights.accessRights'] || '',
      copyrightCreditLine: form['rights.copyrightCreditLine'] || ''
    },
    statement: form['statement'] || '',
    keywords: Array.isArray(form['keywords']) ? [...form['keywords']] : []
  };
  addOrUpdateCollection(colObj);
  alert(currentLocale.value === 'de' ? `Sammlung "${colObj.title}" erfolgreich im Sammlungs-Pool gemerkt!` : `Collection "${colObj.title}" saved to pool!`);
};

const saveItemToPool = (item) => {
  if (!item) return;
  const titleVal = getDisplayName(item);
  const colObj = {
    id: item['id'] || `COL-${Date.now().toString().slice(-4)}`,
    title: titleVal !== '—' ? titleVal : 'Unbenannte Sammlung',
    institution: item['source'] || '',
    rights: {
      licence: item['rights.licence'] || '',
      accessRights: item['rights.accessRights'] || '',
      copyrightCreditLine: item['rights.copyrightCreditLine'] || ''
    },
    statement: item['statement'] || '',
    keywords: Array.isArray(item['keywords']) ? [...item['keywords']] : []
  };
  addOrUpdateCollection(colObj);
  alert(currentLocale.value === 'de' ? `Sammlung "${colObj.title}" im Sammlungs-Pool gespeichert!` : `Collection "${colObj.title}" saved to pool!`);
};

const applyOrgToSpatial = (org) => {
  if (!org) return;
  form['coverage.spatial.locationSet.address.buildingName'] = org.buildingName || org.name || '';
  form['coverage.spatial.locationSet.address.roadName'] = org.roadName || '';
  form['coverage.spatial.locationSet.address.numberInRoad'] = org.numberInRoad || '';
  form['coverage.spatial.locationSet.address.postcodeOrZipcode'] = org.postcodeOrZipcode || '';
  form['coverage.spatial.locationSet.address.townOrCity'] = org.city || '';
  form['coverage.spatial.locationSet.address.country'] = (org.country || 'DE').toUpperCase();

  if (org.city) {
    if (!form['coverage.spatial.locationSet.namedLocation']) form['coverage.spatial.locationSet.namedLocation'] = [];
    const locName = `${org.city} (${(org.country || 'DE').toUpperCase()})`;
    if (!form['coverage.spatial.locationSet.namedLocation'].includes(locName) && !form['coverage.spatial.locationSet.namedLocation'].includes(org.city)) {
      form['coverage.spatial.locationSet.namedLocation'].push(locName);
    }
  }
};

const handleOrgPicked = (org) => {
  if (!org) return;
  recordRecentOrganization(org);
  if (orgPickerTarget.value === 'contacts') {
    if (!form['contacts']) form['contacts'] = [];
    const exists = form['contacts'].some(c => (c.name || '').trim().toLowerCase() === (org.name || '').trim().toLowerCase());
    if (!exists) {
      form['contacts'].push({
        name: org.name,
        role: org.role || org.category || 'Organisation',
        organization: org.name,
        email: org.email || ''
      });
    }
    if (activeDrawerField.value === 'contacts') {
      drawerForm['name'] = org.name;
      drawerForm['organization'] = org.name;
      drawerForm['email'] = org.email || '';
    }
  } else {
    applyOrgToSpatial(org);
    form['source'] = org.name || '';
    if (org.gnd) {
      detectedGndId.value = org.gnd;
      if (!form['id'] || form['id'] === 'HERMES-COLLECTION-001' || form['id'] === 'Collection_1' || form['id'].includes('Collection')) {
        form['id'] = org.gnd;
      }
    }
  }
  isOrgPickerOpen.value = false;
};

const handleCollectionPicked = (col) => {
  if (!col) return;
  loadFromCollectionPool(col);
  isCollectionPickerOpen.value = false;
};

const handlePeriodoSelect = (data) => {
  if (!data) return;
  if (data.periodName) form['coverage.temporal.periodName'] = data.periodName;
  if (data.startDate) form['coverage.temporal.timeSpan.startDate'] = normalizeYearDate(data.startDate);
  if (data.endDate) form['coverage.temporal.timeSpan.endDate'] = normalizeYearDate(data.endDate);
  if (data.dateRangeQualifier) form['coverage.temporal.timeSpan.dateRangeQualifier'] = data.dateRangeQualifier;
};

const loadFromCollectionPool = (col) => {
  if (!col) return;
  if (col.id) form['id'] = col.id;
  if (col.title) {
    if (!Array.isArray(form['title']) || form['title'].length === 0) {
      form['title'] = [{ _value: col.title, 'title#lang': defaultMetadataLanguage.value || 'de', 'title#preferred': true }];
    } else {
      form['title'][0]._value = col.title;
    }
  }
  if (col.titleEn) {
    if (!Array.isArray(form['title'])) form['title'] = [];
    const enIdx = form['title'].findIndex(t => t && t['title#lang'] === 'en');
    if (enIdx > -1) {
      form['title'][enIdx]._value = col.titleEn;
    } else {
      form['title'].push({ _value: col.titleEn, 'title#lang': 'en', 'title#preferred': false });
    }
  }
  const sourceVal = col.source || col.institution || '';
  if (sourceVal) form['source'] = sourceVal;
  if (col.sourceGnd || col.gnd) {
    detectedGndId.value = col.sourceGnd || col.gnd;
  }
  if (col.rights) {
    if (typeof col.rights === 'string') {
      form['rights.licence'] = resolveLicenceUri(col.rights, currentLocale.value);
    } else if (typeof col.rights === 'object') {
      if (col.rights.licence) form['rights.licence'] = resolveLicenceUri(col.rights.licence, currentLocale.value);
      if (col.rights.accessRights) form['rights.accessRights'] = col.rights.accessRights;
      if (col.rights.copyrightCreditLine) form['rights.copyrightCreditLine'] = col.rights.copyrightCreditLine;
    }
  }
  if (col.statement) form['statement'] = col.statement;
  if (col.coveragePeriod) {
    form['coverage.temporal.periodName'] = col.coveragePeriod;
  }
  if (Array.isArray(col.keywords) && col.keywords.length > 0) {
    form['keywords'] = [...new Set([...(form['keywords'] || []), ...col.keywords])];
  }
  formSnapshot.value = JSON.stringify(form);
};

const resetForm = (force = false) => {
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
  form['language'] = [defLang];
  form['rights.copyrightCreditLine'] = globalRights.copyrightCreditLine || '';
  form['rights.accessRights'] = globalRights.accessRights || '';
  form['rights.reproductionRights'] = globalRights.reproductionRights || '';
  form['rights.licence'] = resolveLicenceUri(globalRights.licence, currentLocale.value) || '';
  isEditing.value = false;
  editIndex.value = null;
  Object.keys(preferredLanguages).forEach(k => delete preferredLanguages[k]);
  formSnapshot.value = JSON.stringify(form);
  return true;
};

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});

defineExpose({ items, form, save, resetForm, isFormDirty, loadFromCollectionPool });
</script>