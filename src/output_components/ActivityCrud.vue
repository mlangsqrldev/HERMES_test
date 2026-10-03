<template>
  <div class="drawer drawer-end activity-crud">
    <input id="drawer-activity" type="checkbox" class="drawer-toggle" v-model="isDrawerOpen" />
    
    <div class="drawer-content">
      
      <div class="container mx-auto p-4 max-w-7xl">

        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">
          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">
             <div>
               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ t('saved') }} {{ getLabel('activity', 'activity') }}</h4>
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
          <h3 class="text-xl font-bold mb-4 capitalize">{{ isEditing ? t('edit') : t('add') }} {{ getLabel('activity', 'activity') }}</h3>
          <form @submit.prevent="save">
            <div class="grid grid-cols-1 gap-x-6">
              
        <div class="col-span-full border border-base-300 bg-base-100/50 p-5 rounded-box mb-6 mt-2">
        <div class=" items-center flex flex-row">
          <label class="label mb-2 pb-0">
            <span class="label-text font-bold text-lg capitalize">{{ getLabel('recordInformation', 'recordInformation') }}</span>
          </label>
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation', 'The ID, language, creation information and other metadata describing the record. The ID element of this information block holds the ID assigned by the content provider. Content providers are strongly recommended to complete this element.', 'doc')" v-if="getLabel('recordInformation', 'The ID, language, creation information and other metadata describing the record. The ID element of this information block holds the ID assigned by the content provider. Content providers are strongly recommended to complete this element.', 'doc')">
              <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
            <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                        fill="currentColor"
                        stroke-width="2.5"
                        stroke="currentColor"
                        class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
            </button>
            </div>
            </div>
              <!--       <div class="text-sm text-base-content/60 mb-4 px-1">{{ getLabel('recordInformation', 'The ID, language, creation information and other metadata describing the record. The ID element of this information block holds the ID assigned by the content provider. Content providers are strongly recommended to complete this element.', 'doc') }}</div> -->
          <div class="grid grid-cols-1 gap-x-6">
            
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('recordInformation.id', 'id') }}</span><span class="text-accent font-black">*</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation.id', 'The local ID number of this record about the activity in the content provider\'s information system. Mandatory – must be unique within the collection.', 'doc')" v-if="getLabel('recordInformation.id', 'The local ID number of this record about the activity in the content provider\'s information system. Mandatory – must be unique within the collection.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"     required v-model="form['recordInformation.id']" class="input input-bordered w-full validator " :placeholder="getLabel('recordInformation.id', 'e.g. internal ID from the museum documentation system', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('recordInformation.source', 'source') }}</span><span class="text-accent font-black">*</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation.source', 'Name of the organisation that maintains this record about the activity.', 'doc')" v-if="getLabel('recordInformation.source', 'Name of the organisation that maintains this record about the activity.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"     required v-model="form['recordInformation.source']" class="input input-bordered w-full validator " :placeholder="getLabel('recordInformation.source', 'e.g. Stiftung Preußischer Kulturbesitz, Staatliche Museen zu Berlin, Collection of Classical Antiquities', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">  
        <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('recordInformation.country', 'country') }}</span><span class="text-accent font-black">*</span></label>

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation.country', 'Country in which the head office of the organisation that maintains this record is based.', 'doc')" v-if="getLabel('recordInformation.country', 'Country in which the head office of the organisation that maintains this record is based.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
                </button>
              </div>
              </div>
          <select v-model="form['recordInformation.country']" class="select select-bordered w-full">
            <option disabled value="">{{ currentLocale === 'de' ? getLabel('recordInformation.country', 'country') + ' ' + t('select') : t('select') + ' ' + getLabel('recordInformation.country', 'country') }}</option>
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
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('recordInformation.creation.date', 'date') }}</span><span class="text-accent font-black">*</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation.creation.date', 'Date when this record about the activity was created.', 'doc')" v-if="getLabel('recordInformation.creation.date', 'Date when this record about the activity was created.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="date" :max="maxDate"    required v-model="form['recordInformation.creation.date']" class="input input-bordered w-full validator " :placeholder="getLabel('recordInformation.creation.date', 'e.g. 2025-04-14', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">
          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">
             <div class="flex flex-row items-center">
               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('recordInformation.creation.contacts', 'contacts') }}</h4>
               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation.creation.contacts', '', 'doc')" v-if="getLabel('recordInformation.creation.contacts', '', 'doc')">
                    <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
                  <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                              fill="currentColor"
                              stroke-width="2.5"
                              stroke="currentColor"
                              class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
                  </button>
                  </div>
             </div>
             <button type="button" class="btn btn-sm btn-primary" @click.prevent="openDrawer('recordInformation.creation.contacts')">{{ currentLocale === 'de' ? getLabel('recordInformation.creation.contacts', 'recordInformation.creation.contacts') + ' ' + t('add') : t('add') + ' ' + getLabel('recordInformation.creation.contacts', 'recordInformation.creation.contacts') }}</button>
          </div>

          <!-- Reusable Contacts Quick-Bar -->
          <div class="mb-3 p-2.5 bg-base-200/50 rounded-lg border border-base-300 flex flex-wrap items-center gap-1.5" v-if="savedContacts && savedContacts.length > 0">
            <span class="text-[11px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1 mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {{ currentLocale === 'de' ? 'Wiederverwenden (1-Klick):' : 'Reuse (1-Click):' }}
            </span>
            <button
              v-for="(sc, scIdx) in savedContacts"
              :key="scIdx"
              type="button"
              class="btn btn-xs normal-case border-base-300 hover:border-primary hover:bg-primary/10 gap-1 font-normal"
              @click.prevent="quickAddContact(sc)"
              :title="sc.organization ? `${sc.name} (${sc.organization})` : sc.name"
            >
              <span class="text-primary font-bold">+</span>
              <span class="font-medium">{{ sc.name }}</span>
              <span v-if="sc.role" class="badge badge-ghost badge-xs text-[10px]">{{ sc.role }}</span>
            </button>
          </div>
          
          <div class="overflow-x-auto">
             <table class="table table-xs w-full table-zebra">
                <thead class="bg-base-200"><tr><th>{{ getLabel('recordInformation.creation.contacts.name', 'name') }}</th><th class="w-24">{{ t('actions') }}</th></tr></thead>
                <tbody>
                   <tr v-for="(subItem, subIdx) in form['recordInformation.creation.contacts']" :key="subIdx">
                      <td>{{ subItem['name'] }}</td>
                      <td>
                          <div class="flex gap-1">
                            <button type="button" class="btn btn-xs btn-ghost text-info" @click.prevent="openDrawer('recordInformation.creation.contacts', subIdx)">{{ t('edit') }}</button>
                            <button type="button" class="btn btn-xs btn-ghost text-error" @click.prevent="removeDrawerItem('recordInformation.creation.contacts', subIdx)">{{ t('del') }}</button>
                          </div>
                      </td>
                   </tr>
                   <tr v-if="!form['recordInformation.creation.contacts'] || form['recordInformation.creation.contacts'].length === 0">
                      <td colspan="10" class="text-center text-base-content/40 py-4 italic">{{ t('noItems') }}</td>
                   </tr>
                </tbody>
             </table>
          </div>
        </div>
          </div>
          
        </div>
    <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">
       <div class="flex flex-row items-center">
               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('recordInformation.language', 'language') }}<span class="text-warning font-black">~</span></h4>
               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation.language', 'Default language of the metadata in this record. ISO 639-1 two-letter code.', 'doc')" v-if="getLabel('recordInformation.language', 'Default language of the metadata in this record. ISO 639-1 two-letter code.', 'doc')">
  <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
<svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
            fill="currentColor"
            stroke-width="2.5"
            stroke="currentColor"
            class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
</button>
</div>
             </div>
      
      <div class="flex flex-wrap gap-2 p-2">
        <div v-for="lang in [
          {code: 'de', svg: '<svg class=&quot;h-4 w-6 rounded-xs border border-base-300&quot; viewBox=&quot;0 0 5 3&quot;><rect width=&quot;5&quot; height=&quot;3&quot; y=&quot;0&quot; fill=&quot;#000&quot;/><rect width=&quot;5&quot; height=&quot;2&quot; y=&quot;1&quot; fill=&quot;#D00&quot;/><rect width=&quot;5&quot; height=&quot;1&quot; y=&quot;2&quot; fill=&quot;#FFC800&quot;/></svg>'},
          {code: 'en', svg: '<svg class=&quot;h-4 w-6 rounded-xs border border-base-300&quot; viewBox=&quot;0 0 50 30&quot; ><rect width=&quot;50&quot; height=&quot;30&quot; fill=&quot;#012169&quot;/><path d=&quot;M0 0 L50 30 M50 0 L0 30&quot; stroke=&quot;#fff&quot; stroke-width=&quot;6&quot;/><path d=&quot;M0 0 L50 30&quot; stroke=&quot;#C8102E&quot; stroke-width=&quot;2&quot;/><path d=&quot;M50 0 L0 30&quot; stroke=&quot;#C8102E&quot; stroke-width=&quot;2&quot;/><path d=&quot;M25 0 V30 M0 15 H50&quot; stroke=&quot;#fff&quot; stroke-width=&quot;10&quot;/><path d=&quot;M25 0 V30 M0 15 H50&quot; stroke=&quot;#C8102E&quot; stroke-width=&quot;6&quot;/></svg>'},
          {code: 'fr', svg: '<svg class=&quot;h-4 w-6 rounded-xs border border-base-300&quot; viewBox=&quot;0 0 3 2&quot;><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;0&quot; fill=&quot;#002395&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;1&quot; fill=&quot;#FFF&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;2&quot; fill=&quot;#ED2939&quot;/></svg>'},
          {code: 'it', svg: '<svg class=&quot;h-4 w-6 rounded-xs border border-base-300&quot; viewBox=&quot;0 0 3 2&quot;><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;0&quot; fill=&quot;#009246&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;1&quot; fill=&quot;#FFF&quot;/><rect width=&quot;1&quot; height=&quot;2&quot; x=&quot;2&quot; fill=&quot;#CE2B37&quot;/></svg>'},
          {code: 'es', svg: '<svg class=&quot;h-4 w-6 rounded-xs border border-base-300&quot; viewBox=&quot;0 0 3 2&quot;><rect width=&quot;3&quot; height=&quot;2&quot; y=&quot;0&quot; fill=&quot;#C1272D&quot;/><rect width=&quot;3&quot; height=&quot;1&quot; y=&quot;0.5&quot; fill=&quot;#FCE300&quot;/></svg>'}
        ]" 
             :key="lang.code" 
             @click="toggleLang('recordInformation.language', lang.code, false)" 
             class="group relative flex h-9 px-3 cursor-pointer items-center justify-center gap-1.5 rounded-lg border-2 bg-base-200 shadow-xs transition-all hover:bg-base-300/60"
             :class="[
                 (form['recordInformation.language'] || []).includes(lang.code)
                     ? 'border-accent bg-accent/10 font-bold'
                     : 'border-transparent hover:border-base-300'
             ]">
          <span class="select-none flex items-center" v-html="lang.svg"></span>
          <span class="text-xs uppercase tracking-wider text-base-content/80">{{ lang.code }}</span>

          <button type="button" @click.stop="setPreferredLang('recordInformation.language', lang.code, false)"
              class="btn btn-circle btn-ghost btn-xs ml-1" 
              :class="[
                  preferredLanguages['recordInformation.language'] === lang.code
                      ? 'text-warning opacity-100'
                      : 'opacity-0 group-hover:opacity-60 hover:text-warning'
              ]" 
              :title="preferredLanguages['recordInformation.language'] === lang.code ? 'Preferred Language' : 'Set as preferred'">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5"
                  :fill="preferredLanguages['recordInformation.language'] === lang.code ? 'currentColor' : 'none'" viewBox="0 0 24 24"
                  stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
          </button>
        </div>
      </div>
      
      <div class="mt-2 text-xs text-base-content/60">
        <p>{{ t('languageTip') }}</p>
      </div>
      
    </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">  
        <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('recordInformation.metadataRights', 'metadataRights') }}</span><span class="text-accent font-black">*</span></label>

          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation.metadataRights', 'Licence for the use of these metadata about the activity.', 'doc')" v-if="getLabel('recordInformation.metadataRights', 'Licence for the use of these metadata about the activity.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
                </button>
              </div>
              </div>
          <select v-model="form['recordInformation.metadataRights']" class="select select-bordered w-full">
            <option disabled value="">{{ currentLocale === 'de' ? getLabel('recordInformation.metadataRights', 'metadataRights') + ' ' + t('select') : t('select') + ' ' + getLabel('recordInformation.metadataRights', 'metadataRights') }}</option>
            <template v-if="currentLocale === 'de'">
              <option value="https://creativecommons.org/licenses/by/4.0/deed.de">Creative Commons - Attribution (BY)</option>
<option value="https://creativecommons.org/licenses/by-nd/4.0/deed.de">Creative Commons - Attribution, No Derivatives (BY-ND)</option>
<option value="https://creativecommons.org/licenses/by-nc/4.0/deed.de">Creative Commons - Attribution, Non-Commercial (BY-NC)</option>
<option value="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.de">Creative Commons - Attribution, Non-Commercial, No Derivatives (BY-NC-ND)</option>
<option value="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.de">Creative Commons - Attribution, Non-Commercial, ShareAlike (BY-NC-SA)</option>
<option value="https://creativecommons.org/licenses/by-sa/4.0/deed.de">Creative Commons - Attribution, ShareAlike (BY-SA)</option>
<option value="https://creativecommons.org/publicdomain/zero/1.0/deed.de">The Creative Commons CC0 1.0 Universal Public Domain Dedication (CC0)</option>
            </template>
            <template v-else>
              <option value="https://creativecommons.org/licenses/by/4.0/deed.en">Creative Commons - Attribution (BY)</option>
<option value="https://creativecommons.org/licenses/by-nd/4.0/deed.en">Creative Commons - Attribution, No Derivatives (BY-ND)</option>
<option value="https://creativecommons.org/licenses/by-nc/4.0/deed.en">Creative Commons - Attribution, Non-Commercial (BY-NC)</option>
<option value="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.en">Creative Commons - Attribution, Non-Commercial, No Derivatives (BY-NC-ND)</option>
<option value="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en">Creative Commons - Attribution, Non-Commercial, ShareAlike (BY-NC-SA)</option>
<option value="https://creativecommons.org/licenses/by-sa/4.0/deed.en">Creative Commons - Attribution, ShareAlike (BY-SA)</option>
<option value="https://creativecommons.org/publicdomain/zero/1.0/deed.en">The Creative Commons CC0 1.0 Universal Public Domain Dedication (CC0)</option>
            </template>
          </select>
          
        </div>
          </div>
          
        </div>
        <div class="col-span-full border border-base-300 bg-base-100/50 p-5 rounded-box mb-6 mt-2">
        <div class=" items-center flex flex-row">
          <label class="label mb-2 pb-0">
            <span class="label-text font-bold text-lg capitalize">{{ getLabel('appellation', 'appellation') }}</span>
          </label>
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('appellation', 'This is the name of the event.. Content providers are strongly recommended to complete this element.', 'doc')" v-if="getLabel('appellation', 'This is the name of the event.. Content providers are strongly recommended to complete this element.', 'doc')">
              <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
            <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                        fill="currentColor"
                        stroke-width="2.5"
                        stroke="currentColor"
                        class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
            </button>
            </div>
            </div>
              <!--       <div class="text-sm text-base-content/60 mb-4 px-1">{{ getLabel('appellation', 'This is the name of the event.. Content providers are strongly recommended to complete this element.', 'doc') }}</div> -->
          <div class="grid grid-cols-1 gap-x-6">
            
        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">
          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">
             <div class="flex flex-row items-center">
               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('appellation.name', 'name') }}<span class="text-accent font-black">*</span></h4>
               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('appellation.name', 'This is the name and ID number of the event. Mandatory. Can be provided in multiple languages, with a preferred value indicated.', 'doc')" v-if="getLabel('appellation.name', 'This is the name and ID number of the event. Mandatory. Can be provided in multiple languages, with a preferred value indicated.', 'doc')">
                    <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
                  <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                              fill="currentColor"
                              stroke-width="2.5"
                              stroke="currentColor"
                              class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
                  </button>
                  </div>
             </div>
             <button type="button" class="btn btn-sm btn-primary" @click.prevent="if(!form['appellation.name']) { form['appellation.name'] = []; } form['appellation.name'].push({_value: '', 'appellation.name#lang': defaultMetadataLanguage.value || 'de', 'appellation.name#preferred': form['appellation.name'].length === 0})">{{ currentLocale === 'de' ? getLabel('appellation.name', 'appellation.name') + ' ' + t('add') : t('add') + ' ' + getLabel('appellation.name', 'appellation.name') }}</button>
          </div>
          <div class="p-4 pt-0">
             <ul class="list bg-base-100 rounded-box shadow-md w-full">
                <li v-for="(item, idx) in form['appellation.name']" :key="idx" class="list-row flex items-center justify-between group h-auto py-2">
                   <div class="flex-1 w-full mr-4">
                      <input type="text" v-model="item['_value']" class="input input-bordered w-full" :placeholder="getLabel('appellation.name', 'e.g. 3D Digitization of Attic Grave Monuments from the Berlin Antiquities Collection', 'plac')" />
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
                        <button type="button" @click.prevent="removeDrawerItem('appellation.name', idx)" class="btn btn-square btn-ghost text-error">
                          <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
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
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('appellation.id', 'id') }}</span><span class="text-accent font-black">*</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('appellation.id', 'Unique identifier of this activity. Mandatory.', 'doc')" v-if="getLabel('appellation.id', 'Unique identifier of this activity. Mandatory.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"     required v-model="form['appellation.id']" class="input input-bordered w-full validator " :placeholder="getLabel('appellation.id', 'e.g. internal ID of the activity module in the museum documentation system', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
          </div>
          
        </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('description', 'description') }}</span><span class="text-accent font-black">*</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('description', 'Free-text description of the event or activity that took place. Can be provided in multiple languages.', 'doc')" v-if="getLabel('description', 'Free-text description of the event or activity that took place. Can be provided in multiple languages.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
          <textarea v-model="form['description']" class="textarea textarea-bordered w-full h-24" :placeholder="getLabel('description', 'e.g. This pilot project focuses on the 3D acquisition and asset documentation of 18 Attic funerary monuments from the Antikensammlung, Berlin. Conducted in 2025 as a collaboration between the Staatliche Museen zu Berlin and the Bonn Center for Digital Humanities ...', 'plac')"></textarea>
          
        </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('hasGeneralPurpose', 'hasGeneralPurpose') }}</span><span class="text-warning font-black">~</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('hasGeneralPurpose', 'A free text description of the general goal or purpose of an activity – e.g. practising, preparing, monitoring, researching, designing, testing, etc.', 'doc')" v-if="getLabel('hasGeneralPurpose', 'A free text description of the general goal or purpose of an activity – e.g. practising, preparing, monitoring, researching, designing, testing, etc.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
          <textarea v-model="form['hasGeneralPurpose']" class="textarea textarea-bordered w-full h-24" :placeholder="getLabel('hasGeneralPurpose', 'e.g. The digitization has a research-oriented purpose, aiming to support the use of the assets in scholarly contexts. At the same time, the campaign serves as a pilot project for prototyping documentation processes.', 'plac')"></textarea>
          
        </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('eventType', 'eventType') }}</span><span class="text-accent font-black">*</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('eventType', 'General classification of the type of event or activity which took place, e.g. survey, archaeological excavation, digitization, rebuilding. Not repeating – an event has exactly one type.', 'doc')" v-if="getLabel('eventType', 'General classification of the type of event or activity which took place, e.g. survey, archaeological excavation, digitization, rebuilding. Not repeating – an event has exactly one type.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"     required v-model="form['eventType']" class="input input-bordered w-full validator " :placeholder="getLabel('eventType', 'e.g. Digitization', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">
          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">
             <div class="flex flex-row items-center">
               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('actors', 'actors') }}</h4>
               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('actors', 'The people or organisations involved in this event, may be repeated.', 'doc')" v-if="getLabel('actors', 'The people or organisations involved in this event, may be repeated.', 'doc')">
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
               <button type="button" class="btn btn-sm btn-secondary gap-1" @click.prevent="openPersonPicker('actors')">
                 <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                 </svg>
                 {{ currentLocale === 'de' ? '📋 Aus Personen-Liste wählen (Multiauswahl)' : '📋 Select from Persons (Multi)' }}
               </button>
               <button type="button" class="btn btn-sm btn-primary" @click.prevent="openDrawer('actors')">{{ currentLocale === 'de' ? getLabel('actors', 'actors') + ' ' + t('add') : t('add') + ' ' + getLabel('actors', 'actors') }}</button>
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
        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">
          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">
             <div class="flex flex-row items-center">
               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('temporal', 'temporal') }}</h4>
               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('temporal', 'The date or time span of the event.', 'doc')" v-if="getLabel('temporal', 'The date or time span of the event.', 'doc')">
                    <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
                  <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                              fill="currentColor"
                              stroke-width="2.5"
                              stroke="currentColor"
                              class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
                  </button>
                  </div>
             </div>
             <button type="button" class="btn btn-sm btn-primary" @click.prevent="openDrawer('temporal')">{{ currentLocale === 'de' ? getLabel('temporal', 'temporal') + ' ' + t('add') : t('add') + ' ' + getLabel('temporal', 'temporal') }}</button>
          </div>
          
          <div class="overflow-x-auto">
             <table class="table table-xs w-full table-zebra">
                <thead class="bg-base-200"><tr><th class="w-24">{{ t('actions') }}</th></tr></thead>
                <tbody>
                   <tr v-for="(subItem, subIdx) in form['temporal']" :key="subIdx">
                      
                      <td>
                          <div class="flex gap-1">
                            <button type="button" class="btn btn-xs btn-ghost text-info" @click.prevent="openDrawer('temporal', subIdx)">{{ t('edit') }}</button>
                            <button type="button" class="btn btn-xs btn-ghost text-error" @click.prevent="removeDrawerItem('temporal', subIdx)">{{ t('del') }}</button>
                          </div>
                      </td>
                   </tr>
                   <tr v-if="!form['temporal'] || form['temporal'].length === 0">
                      <td colspan="10" class="text-center text-base-content/40 py-4 italic">{{ t('noItems') }}</td>
                   </tr>
                </tbody>
             </table>
          </div>
        </div>
        <div class="col-span-full border border-base-300 bg-base-100/50 p-5 rounded-box mb-6 mt-2">
        <div class=" items-center flex flex-row">
          <label class="label mb-2 pb-0">
            <span class="label-text font-bold text-lg capitalize">{{ getLabel('spatial', 'spatial') }}</span>
          </label>
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('spatial', 'The location or area covered by the event.', 'doc')" v-if="getLabel('spatial', 'The location or area covered by the event.', 'doc')">
              <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
            <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                        fill="currentColor"
                        stroke-width="2.5"
                        stroke="currentColor"
                        class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
            </button>
            </div>
            </div>
              <!--       <div class="text-sm text-base-content/60 mb-4 px-1">{{ getLabel('spatial', 'The location or area covered by the event.', 'doc') }}</div> -->
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
          <div class="grid grid-cols-1 gap-x-6">
            
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('spatial.locationSet.namedLocation', 'namedLocation') }}</span><span class="text-accent font-black">*</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('spatial.locationSet.namedLocation', 'Name of the place or location where this activity took place.', 'doc')" v-if="getLabel('spatial.locationSet.namedLocation', 'Name of the place or location where this activity took place.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"     required v-model="form['spatial.locationSet.namedLocation']" class="input input-bordered w-full validator " :placeholder="getLabel('spatial.locationSet.namedLocation', 'e.g. Pergamon Museum, Berlin', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
              <!-- Moderne Ortsangabe via GeoNames -->
              <div class="mt-2">
                <PlaceAutocomplete
                  input-id="activity-spatial-geonames"
                  allowed-modes="modern"
                  default-mode="modern"
                  :placeholder="currentLocale === 'de' ? 'Ort der Aktivität via GeoNames suchen...' : 'Search activity place via GeoNames...'"
                  @select="(item) => {
                    form['spatial.locationSet.namedLocation'] = item.name;
                    if (item.country) form['spatial.locationSet.geopoliticalArea'] = item.country;
                  }"
                />
              </div>
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('spatial.locationSet.geopoliticalArea', 'geopoliticalArea') }}</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('spatial.locationSet.geopoliticalArea', 'Higher-level geopolitical unit (country, region, city) in which this activity took place.', 'doc')" v-if="getLabel('spatial.locationSet.geopoliticalArea', 'Higher-level geopolitical unit (country, region, city) in which this activity took place.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"      v-model="form['spatial.locationSet.geopoliticalArea']" class="input input-bordered w-full validator " :placeholder="getLabel('spatial.locationSet.geopoliticalArea', 'e.g. Berlin', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('spatial.locationSet.geopoliticalAreaType', 'geopoliticalAreaType') }}</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('spatial.locationSet.geopoliticalAreaType', 'Classification of the geopolitical area.', 'doc')" v-if="getLabel('spatial.locationSet.geopoliticalAreaType', 'Classification of the geopolitical area.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"      v-model="form['spatial.locationSet.geopoliticalAreaType']" class="input input-bordered w-full validator " :placeholder="getLabel('spatial.locationSet.geopoliticalAreaType', 'e.g. city', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">
          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">
             <div class="flex flex-row items-center">
               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('spatial.locationSet.historicalName', 'historicalName') }}</h4>
               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('spatial.locationSet.historicalName', 'Historical name of the place, if it differs from the current name.', 'doc')" v-if="getLabel('spatial.locationSet.historicalName', 'Historical name of the place, if it differs from the current name.', 'doc')">
                    <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
                  <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                              fill="currentColor"
                              stroke-width="2.5"
                              stroke="currentColor"
                              class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
                  </button>
                  </div>
             </div>
             <button type="button" class="btn btn-sm btn-primary" @click.prevent="if(!form['spatial.locationSet.historicalName']) form['spatial.locationSet.historicalName'] = []; form['spatial.locationSet.historicalName'].push(''); inlineEditing['spatial.locationSet.historicalName_' + (form['spatial.locationSet.historicalName'].length - 1)] = true;">{{ currentLocale === 'de' ? getLabel('spatial.locationSet.historicalName', 'spatial.locationSet.historicalName') + ' ' + t('add') : t('add') + ' ' + getLabel('spatial.locationSet.historicalName', 'spatial.locationSet.historicalName') }}</button>
          </div>
          
          <ul class="list bg-base-100 rounded-box shadow-md w-full">
             
             <li v-for="(subItem, subIdx) in form['spatial.locationSet.historicalName']" :key="subIdx" class="list-row flex items-center justify-between h-auto py-2">
                <div v-if="!inlineEditing['spatial.locationSet.historicalName_' + subIdx]">{{ subItem }}</div>
                 <div v-else class="flex-1 mr-4">
                   <input type="text"        v-model="form['spatial.locationSet.historicalName'][subIdx]" class="input input-sm input-bordered w-full validator " :placeholder="getLabel('spatial.locationSet.historicalName', 'e.g. not applicable if place name is unchanged', 'plac')" />
                   <div class="validator-hint text-xs mt-1">Enter valid value</div>
                 </div>
                <div class="flex gap-1 shrink-0">
                   <button type="button" @click.prevent="inlineEditing['spatial.locationSet.historicalName_' + subIdx] = !inlineEditing['spatial.locationSet.historicalName_' + subIdx]" class="btn btn-square btn-ghost" :class="inlineEditing['spatial.locationSet.historicalName_' + subIdx] ? 'text-success' : 'text-info'">
                   <svg v-if="!inlineEditing['spatial.locationSet.historicalName_' + subIdx]" class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                   <svg v-else class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                 </button>
                   <button type="button" @click.prevent="removeDrawerItem('spatial.locationSet.historicalName', subIdx)" class="btn btn-square btn-ghost text-error">
                     <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                   </button>
                </div>
             </li>
             
             <li v-if="!form['spatial.locationSet.historicalName'] || form['spatial.locationSet.historicalName'].length === 0" class="p-4 text-center text-sm text-base-content/40 italic">
                {{ t('noItems') }}
             </li>
          </ul>
        </div>
          </div>
          
        </div>
          </div>
          
        </div>
        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">
          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">
             <div class="flex flex-row items-center">
               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('consistsOf', 'consistsOf') }}</h4>
               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('consistsOf', 'this is a repeating group of elements which allows the specific activity (or activities) that took place during the overall Event to be described.', 'doc')" v-if="getLabel('consistsOf', 'this is a repeating group of elements which allows the specific activity (or activities) that took place during the overall Event to be described.', 'doc')">
                    <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
                  <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                              fill="currentColor"
                              stroke-width="2.5"
                              stroke="currentColor"
                              class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
                  </button>
                  </div>
             </div>
             <button type="button" class="btn btn-sm btn-primary" @click.prevent="openDrawer('consistsOf')">{{ currentLocale === 'de' ? getLabel('consistsOf', 'consistsOf') + ' ' + t('add') : t('add') + ' ' + getLabel('consistsOf', 'consistsOf') }}</button>
          </div>
          
          <div class="overflow-x-auto">
             <table class="table table-xs w-full table-zebra">
                <thead class="bg-base-200"><tr><th class="w-24">{{ t('actions') }}</th></tr></thead>
                <tbody>
                   <tr v-for="(subItem, subIdx) in form['consistsOf']" :key="subIdx">
                      
                      <td>
                          <div class="flex gap-1">
                            <button type="button" class="btn btn-xs btn-ghost text-info" @click.prevent="openDrawer('consistsOf', subIdx)">{{ t('edit') }}</button>
                            <button type="button" class="btn btn-xs btn-ghost text-error" @click.prevent="removeDrawerItem('consistsOf', subIdx)">{{ t('del') }}</button>
                          </div>
                      </td>
                   </tr>
                   <tr v-if="!form['consistsOf'] || form['consistsOf'].length === 0">
                      <td colspan="10" class="text-center text-base-content/40 py-4 italic">{{ t('noItems') }}</td>
                   </tr>
                </tbody>
             </table>
          </div>
        </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('assessments', 'assessments') }}</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('assessments', 'Assessments made of the monument during the event, e.g. of the condition of the monument.', 'doc')" v-if="getLabel('assessments', 'Assessments made of the monument during the event, e.g. of the condition of the monument.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
          <textarea v-model="form['assessments']" class="textarea textarea-bordered w-full h-24" :placeholder="getLabel('assessments', 'e.g. condition assessment of the monument during the event', 'plac')"></textarea>
          
        </div>
        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">
          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">
             <div class="flex flex-row items-center">
               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('occurredAt', 'occurredAt') }}<span class="text-warning font-black">~</span></h4>
               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('occurredAt', 'Can be used to associate this activity to the time span that overlaps with the occurrence of that activity.', 'doc')" v-if="getLabel('occurredAt', 'Can be used to associate this activity to the time span that overlaps with the occurrence of that activity.', 'doc')">
                    <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
                  <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                              fill="currentColor"
                              stroke-width="2.5"
                              stroke="currentColor"
                              class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
                  </button>
                  </div>
             </div>
             <button type="button" class="btn btn-sm btn-primary" @click.prevent="if(!form['occurredAt']) form['occurredAt'] = []; form['occurredAt'].push(''); inlineEditing['occurredAt_' + (form['occurredAt'].length - 1)] = true;">{{ currentLocale === 'de' ? getLabel('occurredAt', 'occurredAt') + ' ' + t('add') : t('add') + ' ' + getLabel('occurredAt', 'occurredAt') }}</button>
          </div>
          
          <ul class="list bg-base-100 rounded-box shadow-md w-full">
             
             <li v-for="(subItem, subIdx) in form['occurredAt']" :key="subIdx" class="list-row flex items-center justify-between h-auto py-2">
                <div v-if="!inlineEditing['occurredAt_' + subIdx]">{{ subItem }}</div>
                 <div v-else class="flex-1 mr-4">
                   <input type="text"        v-model="form['occurredAt'][subIdx]" class="input input-sm input-bordered w-full validator " :placeholder="getLabel('occurredAt', 'e.g. ID or URI of the overlapping time span', 'plac')" />
                   <div class="validator-hint text-xs mt-1">Enter valid value</div>
                 </div>
                <div class="flex gap-1 shrink-0">
                   <button type="button" @click.prevent="inlineEditing['occurredAt_' + subIdx] = !inlineEditing['occurredAt_' + subIdx]" class="btn btn-square btn-ghost" :class="inlineEditing['occurredAt_' + subIdx] ? 'text-success' : 'text-info'">
                   <svg v-if="!inlineEditing['occurredAt_' + subIdx]" class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                   <svg v-else class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                 </button>
                   <button type="button" @click.prevent="removeDrawerItem('occurredAt', subIdx)" class="btn btn-square btn-ghost text-error">
                     <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                   </button>
                </div>
             </li>
             
             <li v-if="!form['occurredAt'] || form['occurredAt'].length === 0" class="p-4 text-center text-sm text-base-content/40 italic">
                {{ t('noItems') }}
             </li>
          </ul>
        </div>
        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">
          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">
             <div class="flex flex-row items-center">
               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('happenedAt', 'happenedAt') }}<span class="text-warning font-black">~</span></h4>
               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('happenedAt', 'Can be used to relate this event to the place where it happened (as an institutional identifier, e.g. GND).', 'doc')" v-if="getLabel('happenedAt', 'Can be used to relate this event to the place where it happened (as an institutional identifier, e.g. GND).', 'doc')">
                    <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
                  <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                              fill="currentColor"
                              stroke-width="2.5"
                              stroke="currentColor"
                              class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
                  </button>
                  </div>
             </div>
             <button type="button" class="btn btn-sm btn-primary" @click.prevent="if(!form['happenedAt']) form['happenedAt'] = []; form['happenedAt'].push(''); inlineEditing['happenedAt_' + (form['happenedAt'].length - 1)] = true;">{{ currentLocale === 'de' ? getLabel('happenedAt', 'happenedAt') + ' ' + t('add') : t('add') + ' ' + getLabel('happenedAt', 'happenedAt') }}</button>
          </div>
          
          <!-- Quick action: Adopt from Collection if available -->
          <div v-if="collectionInstitution.fullLabel" class="mb-2">
            <button
              v-if="!form['happenedAt'] || form['happenedAt'].length === 0 || !form['happenedAt'].includes(collectionInstitution.fullLabel)"
              type="button"
              class="btn btn-xs btn-outline btn-primary gap-1"
              @click="if(!form['happenedAt']) form['happenedAt'] = []; form['happenedAt'].push(collectionInstitution.fullLabel)"
              :title="currentLocale === 'de' ? 'Übernimmt die Einrichtung aus der Sammlung als Ereignisort' : 'Adopt institution from Collection as event location'"
            >
              <span>🏛️</span>
              <span>{{ currentLocale === 'de' ? 'Aus Sammlung übernehmen:' : 'Adopt from collection:' }}</span>
              <span class="font-bold underline truncate max-w-[260px]">{{ collectionInstitution.fullLabel }}</span>
            </button>
          </div>

          <!-- Institution / GND -->
          <div class="mb-3">
            <InstitutionAutocomplete
              input-id="activity-happenedat-gnd"
              emit-mode="gnd"
              :placeholder="currentLocale === 'de' ? 'Einrichtung / GND suchen...' : 'Search institution / GND...'"
              @select="(item) => {
                if (!form['happenedAt']) form['happenedAt'] = [];
                const val = item.uri || item.gnd || item.label;
                form['happenedAt'].push(val);
              }"
            />
          </div>
          
          <ul class="list bg-base-100 rounded-box shadow-md w-full">
             
             <li v-for="(subItem, subIdx) in form['happenedAt']" :key="subIdx" class="list-row flex items-center justify-between h-auto py-2">
                <div v-if="!inlineEditing['happenedAt_' + subIdx]">{{ subItem }}</div>
                 <div v-else class="flex-1 mr-4">
                   <input type="text"        v-model="form['happenedAt'][subIdx]" class="input input-sm input-bordered w-full validator " :placeholder="getLabel('happenedAt', 'e.g. https://d-nb.info/gnd/5035657-4', 'plac')" />
                   <div class="validator-hint text-xs mt-1">Enter valid value</div>
                 </div>
                <div class="flex gap-1 shrink-0">
                   <button type="button" @click.prevent="inlineEditing['happenedAt_' + subIdx] = !inlineEditing['happenedAt_' + subIdx]" class="btn btn-square btn-ghost" :class="inlineEditing['happenedAt_' + subIdx] ? 'text-success' : 'text-info'">
                   <svg v-if="!inlineEditing['happenedAt_' + subIdx]" class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                   <svg v-else class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                 </button>
                   <button type="button" @click.prevent="removeDrawerItem('happenedAt', subIdx)" class="btn btn-square btn-ghost text-error">
                     <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                   </button>
                </div>
             </li>
             
             <li v-if="!form['happenedAt'] || form['happenedAt'].length === 0" class="p-4 text-center text-sm text-base-content/40 italic">
                {{ t('noItems') }}
             </li>
          </ul>
        </div>
        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">
          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">
             <div class="flex flex-row items-center">
               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('wasPresentAt', 'wasPresentAt') }}<span class="text-warning font-black">~</span></h4>
               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('wasPresentAt', 'Can be used to relate this activity to the actors who were present.', 'doc')" v-if="getLabel('wasPresentAt', 'Can be used to relate this activity to the actors who were present.', 'doc')">
                    <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
                  <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                              fill="currentColor"
                              stroke-width="2.5"
                              stroke="currentColor"
                              class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
                  </button>
                  </div>
             </div>
             <button type="button" class="btn btn-sm btn-primary" @click.prevent="if(!form['wasPresentAt']) form['wasPresentAt'] = []; form['wasPresentAt'].push(''); inlineEditing['wasPresentAt_' + (form['wasPresentAt'].length - 1)] = true;">{{ currentLocale === 'de' ? getLabel('wasPresentAt', 'wasPresentAt') + ' ' + t('add') : t('add') + ' ' + getLabel('wasPresentAt', 'wasPresentAt') }}</button>
          </div>
          
          <ul class="list bg-base-100 rounded-box shadow-md w-full">
             
             <li v-for="(subItem, subIdx) in form['wasPresentAt']" :key="subIdx" class="list-row flex items-center justify-between h-auto py-2">
                <div v-if="!inlineEditing['wasPresentAt_' + subIdx]">{{ subItem }}</div>
                 <div v-else class="flex-1 mr-4">
                   <input type="text"        v-model="form['wasPresentAt'][subIdx]" class="input input-sm input-bordered w-full validator " :placeholder="getLabel('wasPresentAt', 'e.g. ID/URI of the actors present', 'plac')" />
                   <div class="validator-hint text-xs mt-1">Enter valid value</div>
                 </div>
                <div class="flex gap-1 shrink-0">
                   <button type="button" @click.prevent="inlineEditing['wasPresentAt_' + subIdx] = !inlineEditing['wasPresentAt_' + subIdx]" class="btn btn-square btn-ghost" :class="inlineEditing['wasPresentAt_' + subIdx] ? 'text-success' : 'text-info'">
                   <svg v-if="!inlineEditing['wasPresentAt_' + subIdx]" class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                   <svg v-else class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                 </button>
                   <button type="button" @click.prevent="removeDrawerItem('wasPresentAt', subIdx)" class="btn btn-square btn-ghost text-error">
                     <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                   </button>
                </div>
             </li>
             
             <li v-if="!form['wasPresentAt'] || form['wasPresentAt'].length === 0" class="p-4 text-center text-sm text-base-content/40 italic">
                {{ t('noItems') }}
             </li>
          </ul>
        </div>
        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">
          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">
             <div class="flex flex-row items-center">
               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('hasPart', 'hasPart') }}<span class="text-warning font-black">~</span></h4>
               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('hasPart', 'This activity is an overarching event composed of several smaller, standalone sub-activity records.', 'doc')" v-if="getLabel('hasPart', 'This activity is an overarching event composed of several smaller, standalone sub-activity records.', 'doc')">
                    <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
                  <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                              fill="currentColor"
                              stroke-width="2.5"
                              stroke="currentColor"
                              class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
                  </button>
                  </div>
             </div>
             <button type="button" class="btn btn-sm btn-primary" @click.prevent="if(!form['hasPart']) form['hasPart'] = []; form['hasPart'].push(''); inlineEditing['hasPart_' + (form['hasPart'].length - 1)] = true;">{{ currentLocale === 'de' ? getLabel('hasPart', 'hasPart') + ' ' + t('add') : t('add') + ' ' + getLabel('hasPart', 'hasPart') }}</button>
          </div>
          
          <ul class="list bg-base-100 rounded-box shadow-md w-full">
             
             <li v-for="(subItem, subIdx) in form['hasPart']" :key="subIdx" class="list-row flex items-center justify-between h-auto py-2">
                <div v-if="!inlineEditing['hasPart_' + subIdx]">{{ subItem }}</div>
                 <div v-else class="flex-1 mr-4">
                   <input type="text"        v-model="form['hasPart'][subIdx]" class="input input-sm input-bordered w-full validator " :placeholder="getLabel('hasPart', 'e.g. ID/URI of the activity record of a second sub-campaign', 'plac')" />
                   <div class="validator-hint text-xs mt-1">Enter valid value</div>
                 </div>
                <div class="flex gap-1 shrink-0">
                   <button type="button" @click.prevent="inlineEditing['hasPart_' + subIdx] = !inlineEditing['hasPart_' + subIdx]" class="btn btn-square btn-ghost" :class="inlineEditing['hasPart_' + subIdx] ? 'text-success' : 'text-info'">
                   <svg v-if="!inlineEditing['hasPart_' + subIdx]" class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                   <svg v-else class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                 </button>
                   <button type="button" @click.prevent="removeDrawerItem('hasPart', subIdx)" class="btn btn-square btn-ghost text-error">
                     <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                   </button>
                </div>
             </li>
             
             <li v-if="!form['hasPart'] || form['hasPart'].length === 0" class="p-4 text-center text-sm text-base-content/40 italic">
                {{ t('noItems') }}
             </li>
          </ul>
        </div>
        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">
          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">
             <div class="flex flex-row items-center">
               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('isPartOf', 'isPartOf') }}<span class="text-warning font-black">~</span></h4>
               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('isPartOf', 'This is the relation between an activity and the general activity of which it forms a part.', 'doc')" v-if="getLabel('isPartOf', 'This is the relation between an activity and the general activity of which it forms a part.', 'doc')">
                    <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
                  <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                              fill="currentColor"
                              stroke-width="2.5"
                              stroke="currentColor"
                              class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
                  </button>
                  </div>
             </div>
             <button type="button" class="btn btn-sm btn-primary" @click.prevent="if(!form['isPartOf']) form['isPartOf'] = []; form['isPartOf'].push(''); inlineEditing['isPartOf_' + (form['isPartOf'].length - 1)] = true;">{{ currentLocale === 'de' ? getLabel('isPartOf', 'isPartOf') + ' ' + t('add') : t('add') + ' ' + getLabel('isPartOf', 'isPartOf') }}</button>
          </div>
          
          <ul class="list bg-base-100 rounded-box shadow-md w-full">
             
             <li v-for="(subItem, subIdx) in form['isPartOf']" :key="subIdx" class="list-row flex items-center justify-between h-auto py-2">
                <div v-if="!inlineEditing['isPartOf_' + subIdx]">{{ subItem }}</div>
                 <div v-else class="flex-1 mr-4">
                   <input type="text"        v-model="form['isPartOf'][subIdx]" class="input input-sm input-bordered w-full validator " :placeholder="getLabel('isPartOf', 'e.g. ID/URI of the parent funding programme', 'plac')" />
                   <div class="validator-hint text-xs mt-1">Enter valid value</div>
                 </div>
                <div class="flex gap-1 shrink-0">
                   <button type="button" @click.prevent="inlineEditing['isPartOf_' + subIdx] = !inlineEditing['isPartOf_' + subIdx]" class="btn btn-square btn-ghost" :class="inlineEditing['isPartOf_' + subIdx] ? 'text-success' : 'text-info'">
                   <svg v-if="!inlineEditing['isPartOf_' + subIdx]" class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                   <svg v-else class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                 </button>
                   <button type="button" @click.prevent="removeDrawerItem('isPartOf', subIdx)" class="btn btn-square btn-ghost text-error">
                     <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                   </button>
                </div>
             </li>
             
             <li v-if="!form['isPartOf'] || form['isPartOf'].length === 0" class="p-4 text-center text-sm text-base-content/40 italic">
                {{ t('noItems') }}
             </li>
          </ul>
        </div>
        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">
          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">
             <div class="flex flex-row items-center">
               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('hasCreated', 'hasCreated') }}<span class="text-accent font-black">*</span></h4>
               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('hasCreated', 'This is the relation between an activity and a digital resource or digital file that it created.', 'doc')" v-if="getLabel('hasCreated', 'This is the relation between an activity and a digital resource or digital file that it created.', 'doc')">
                    <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
                  <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                              fill="currentColor"
                              stroke-width="2.5"
                              stroke="currentColor"
                              class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
                  </button>
                  </div>
             </div>
             <button type="button" class="btn btn-sm btn-primary" @click.prevent="if(!form['hasCreated']) form['hasCreated'] = []; form['hasCreated'].push(''); inlineEditing['hasCreated_' + (form['hasCreated'].length - 1)] = true;">{{ currentLocale === 'de' ? getLabel('hasCreated', 'hasCreated') + ' ' + t('add') : t('add') + ' ' + getLabel('hasCreated', 'hasCreated') }}</button>
          </div>
          
          <ul class="list bg-base-100 rounded-box shadow-md w-full">
             
             <li v-for="(subItem, subIdx) in form['hasCreated']" :key="subIdx" class="list-row flex items-center justify-between h-auto py-2">
                <div v-if="!inlineEditing['hasCreated_' + subIdx]">{{ subItem }}</div>
                 <div v-else class="flex-1 mr-4">
                   <input type="text"   required     v-model="form['hasCreated'][subIdx]" class="input input-sm input-bordered w-full validator " :placeholder="getLabel('hasCreated', 'e.g. reference to all 3D models created during this activity (DOIs of the respective digital resources) https://bonndata.uni-bonn.de/dataverse/altes_museum_berlin', 'plac')" />
                   <div class="validator-hint text-xs mt-1">Enter valid value</div>
                 </div>
                <div class="flex gap-1 shrink-0">
                   <button type="button" @click.prevent="inlineEditing['hasCreated_' + subIdx] = !inlineEditing['hasCreated_' + subIdx]" class="btn btn-square btn-ghost" :class="inlineEditing['hasCreated_' + subIdx] ? 'text-success' : 'text-info'">
                   <svg v-if="!inlineEditing['hasCreated_' + subIdx]" class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                   <svg v-else class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                 </button>
                   <button type="button" @click.prevent="removeDrawerItem('hasCreated', subIdx)" class="btn btn-square btn-ghost text-error">
                     <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                   </button>
                </div>
             </li>
             
             <li v-if="!form['hasCreated'] || form['hasCreated'].length === 0" class="p-4 text-center text-sm text-base-content/40 italic">
                {{ t('noItems') }}
             </li>
          </ul>
        </div>
        <div class="col-span-full border-2 border-base-200 bg-base-100 p-4 rounded-box mb-6 shadow-sm">
          <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200">
             <div class="flex flex-row items-center">
               <h4 class="font-bold text-lg capitalize text-base-content/60">{{ getLabel('dcRelation', 'dcRelation') }}</h4>
               <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('dcRelation', 'This is for general relations from this activity, e.g. to publications.', 'doc')" v-if="getLabel('dcRelation', 'This is for general relations from this activity, e.g. to publications.', 'doc')">
                    <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
                  <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                              fill="currentColor"
                              stroke-width="2.5"
                              stroke="currentColor"
                              class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
                  </button>
                  </div>
             </div>
             <button type="button" class="btn btn-sm btn-primary" @click.prevent="if(!form['dcRelation']) form['dcRelation'] = []; form['dcRelation'].push(''); inlineEditing['dcRelation_' + (form['dcRelation'].length - 1)] = true;">{{ currentLocale === 'de' ? getLabel('dcRelation', 'dcRelation') + ' ' + t('add') : t('add') + ' ' + getLabel('dcRelation', 'dcRelation') }}</button>
          </div>
          
          <ul class="list bg-base-100 rounded-box shadow-md w-full">
             
             <li v-for="(subItem, subIdx) in form['dcRelation']" :key="subIdx" class="list-row flex items-center justify-between h-auto py-2">
                <div v-if="!inlineEditing['dcRelation_' + subIdx]">{{ subItem }}</div>
                 <div v-else class="flex-1 mr-4">
                   <input type="url"     pattern="[Hh][Tt][Tt][Pp][Ss]?://(?:(?:[a-zA-Z¡-￿0-9]+-?)*[a-zA-Z¡-￿0-9]+)(?:.(?:[a-zA-Z¡-￿0-9]+-?)*[a-zA-Z¡-￿0-9]+)*(?:.(?:[a-zA-Z¡-￿]{2,}))(?::d{2,5})?(?:/[^s]*)?"   v-model="form['dcRelation'][subIdx]" class="input input-sm input-bordered w-full validator " :placeholder="getLabel('dcRelation', 'e.g. link to a related publication', 'plac')" />
                   <div class="validator-hint text-xs mt-1">Enter valid value</div>
                 </div>
                <div class="flex gap-1 shrink-0">
                   <button type="button" @click.prevent="inlineEditing['dcRelation_' + subIdx] = !inlineEditing['dcRelation_' + subIdx]" class="btn btn-square btn-ghost" :class="inlineEditing['dcRelation_' + subIdx] ? 'text-success' : 'text-info'">
                   <svg v-if="!inlineEditing['dcRelation_' + subIdx]" class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                   <svg v-else class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                 </button>
                   <button type="button" @click.prevent="removeDrawerItem('dcRelation', subIdx)" class="btn btn-square btn-ghost text-error">
                     <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                   </button>
                </div>
             </li>
             
             <li v-if="!form['dcRelation'] || form['dcRelation'].length === 0" class="p-4 text-center text-sm text-base-content/40 italic">
                {{ t('noItems') }}
             </li>
          </ul>
        </div>
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
              <button type="submit" class="btn btn-primary capitalize">{{ t('save') }} {{ getLabel('activity', 'activity') }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="drawer-side z-[100]">
      <label for="drawer-activity" aria-label="close sidebar" class="drawer-overlay"></label>
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
            <label for="drawer-activity" class="btn btn-circle btn-ghost btn-sm drawer-overlay">✕</label>
          </div>
          <form @submit.prevent="saveDrawer" class="space-y-4">
            
      <div v-if="activeDrawerField === 'recordInformation.creation.contacts'">
        <div class="grid grid-cols-1 gap-x-6">
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('recordInformation.creation.contacts.name', 'name') }}</span><span class="text-warning font-black">~</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('recordInformation.creation.contacts.name', 'First and last name of the person responsible for creating the metadata about this activity.', 'doc')" v-if="getLabel('recordInformation.creation.contacts.name', 'First and last name of the person responsible for creating the metadata about this activity.', 'doc')">
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
      <div v-if="activeDrawerField === 'actors'">
        <div class="grid grid-cols-1 gap-x-6">
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('actors.id', 'id') }}</span><span class="text-accent font-black">*</span></label>
          
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
                        <input type="text"     required v-model="drawerForm['id']" class="input input-bordered w-full validator " :placeholder="getLabel('actors.id', 'e.g. https://orcid.org/0000-0003-3047-2722', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('actors.name', 'name') }}</span><span class="text-warning font-black">~</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('actors.name', 'Name of the person or organisation involved in this event.', 'doc')" v-if="getLabel('actors.name', 'Name of the person or organisation involved in this event.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"      v-model="drawerForm['name']" class="input input-bordered w-full validator " :placeholder="getLabel('actors.name', 'e.g. name of the person involved', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('actors.actorType', 'actorType') }}</span><span class="text-warning font-black">~</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('actors.actorType', 'Classification of the actor: individual, group, or organisation.', 'doc')" v-if="getLabel('actors.actorType', 'Classification of the actor: individual, group, or organisation.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"      v-model="drawerForm['actorType']" class="input input-bordered w-full validator " :placeholder="getLabel('actors.actorType', 'e.g. individual | group | organization', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('actors.roles', 'roles') }}</span><span class="text-warning font-black">~</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('actors.roles', 'Role(s) of the person or organisation in this activity. Multiple roles possible.', 'doc')" v-if="getLabel('actors.roles', 'Role(s) of the person or organisation in this activity. Multiple roles possible.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"      v-model="drawerForm['roles']" class="input input-bordered w-full validator " :placeholder="getLabel('actors.roles', 'e.g. 3D Data Acquisition Lead', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div></div>
      </div>
      <div v-if="activeDrawerField === 'temporal'">
        <div class="grid grid-cols-1 gap-x-6">
        <div class="col-span-full border border-base-300 bg-base-100/50 p-5 rounded-box mb-6 mt-2">
        <div class=" items-center flex flex-row">
          <label class="label mb-2 pb-0">
            <span class="label-text font-bold text-lg capitalize">{{ getLabel('temporal.timeSpan', 'timeSpan') }}</span>
          </label>
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('temporal.timeSpan', '', 'doc')" v-if="getLabel('temporal.timeSpan', '', 'doc')">
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
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('temporal.timeSpan.startDate', 'startDate') }}</span><span class="text-accent font-black">*</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('temporal.timeSpan.startDate', 'The start date of the event. Format: ISO 8601 (YYYY-MM-DD).', 'doc')" v-if="getLabel('temporal.timeSpan.startDate', 'The start date of the event. Format: ISO 8601 (YYYY-MM-DD).', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text" pattern="^(-?[0-9]{1,})(?:-(0[1-9]|1[0-2])(?:-(0[1-9]|[12][0-9]|3[01]))?)?$" required v-model="drawerForm['timeSpan.startDate']" class="input input-bordered w-full validator " :placeholder="getLabel('temporal.timeSpan.startDate', 'e.g. -500, 48, -7 or 2025', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('temporal.timeSpan.endDate', 'endDate') }}</span><span class="text-accent font-black">*</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('temporal.timeSpan.endDate', 'The end date of the event. Format: ISO 8601 (YYYY-MM-DD).', 'doc')" v-if="getLabel('temporal.timeSpan.endDate', 'The end date of the event. Format: ISO 8601 (YYYY-MM-DD).', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text" pattern="^(-?[0-9]{1,})(?:-(0[1-9]|1[0-2])(?:-(0[1-9]|[12][0-9]|3[01]))?)?$" required v-model="drawerForm['timeSpan.endDate']" class="input input-bordered w-full validator " :placeholder="getLabel('temporal.timeSpan.endDate', 'e.g. -400, 48, -7 or 2025', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
          </div>
          
        </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('temporal.periodName', 'periodName') }}</span><span class="text-warning font-black">~</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('temporal.periodName', 'The name of the project period to which this activity is assigned.', 'doc')" v-if="getLabel('temporal.periodName', 'The name of the project period to which this activity is assigned.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"      v-model="drawerForm['periodName']" class="input input-bordered w-full validator " :placeholder="getLabel('temporal.periodName', 'e.g. Pilot phase digitisation programme 2025', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div></div>
      </div>
      <div v-if="activeDrawerField === 'spatial.locationSet.historicalName'">
        
          <div class="form-control w-full">
             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('spatial.locationSet.historicalName', 'historicalName') }}</span></label>
             <input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('spatial.locationSet.historicalName', '', 'plac')"/>
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
      <div v-if="activeDrawerField === 'consistsOf'">
        <div class="grid grid-cols-1 gap-x-6">
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('consistsOf.hadSpecificPurpose', 'hadSpecificPurpose') }}</span><span class="text-accent font-black">*</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('consistsOf.hadSpecificPurpose', 'A free text note describing the specific goal or purpose of this activity – e.g. carrying out 3D data acquisition, restoration, completing a survey, constructing a building.', 'doc')" v-if="getLabel('consistsOf.hadSpecificPurpose', 'A free text note describing the specific goal or purpose of this activity – e.g. carrying out 3D data acquisition, restoration, completing a survey, constructing a building.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
          <textarea v-model="drawerForm['hadSpecificPurpose']" class="textarea textarea-bordered w-full h-24" :placeholder="getLabel('consistsOf.hadSpecificPurpose', 'e.g. High-precision structured-light scanning with a spatial resolution of 0.1 mm was carried out on the sepulchral sculptures.', 'plac')"></textarea>
          
        </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('consistsOf.startDate', 'startDate') }}</span><span class="text-accent font-black">*</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('consistsOf.startDate', 'The start date of this specific activity. Format: ISO 8601 (YYYY-MM-DD).', 'doc')" v-if="getLabel('consistsOf.startDate', 'The start date of this specific activity. Format: ISO 8601 (YYYY-MM-DD).', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"    pattern='^(-?[0-9]{1,})(?:-(0[1-9]|1[0-2])(?:-(0[1-9]|[12][0-9]|3[01]))?)?$' required v-model="drawerForm['startDate']" class="input input-bordered w-full validator " :placeholder="getLabel('consistsOf.startDate', 'e.g. -500, 48, -7 or 2025', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('consistsOf.endDate', 'endDate') }}</span><span class="text-accent font-black">*</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('consistsOf.endDate', 'The end date of this specific activity. Format: ISO 8601 (YYYY-MM-DD).', 'doc')" v-if="getLabel('consistsOf.endDate', 'The end date of this specific activity. Format: ISO 8601 (YYYY-MM-DD).', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"    pattern='^(-?[0-9]{1,})(?:-(0[1-9]|1[0-2])(?:-(0[1-9]|[12][0-9]|3[01]))?)?$' required v-model="drawerForm['endDate']" class="input input-bordered w-full validator " :placeholder="getLabel('consistsOf.endDate', 'e.g. -400, 48, -7 or 2025', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('consistsOf.methods', 'methods') }}</span><span class="text-accent font-black">*</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('consistsOf.methods', 'The methods used in this specific activity – e.g. open area excavation, sample survey, restoration, photogrammetric survey.', 'doc')" v-if="getLabel('consistsOf.methods', 'The methods used in this specific activity – e.g. open area excavation, sample survey, restoration, photogrammetric survey.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"     required v-model="drawerForm['methods']" class="input input-bordered w-full validator " :placeholder="getLabel('consistsOf.methods', 'e.g. structured-light 3D scanning | close-range photogrammetric survey | 3D data processing', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('consistsOf.techniques', 'techniques') }}</span><span class="text-accent font-black">*</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('consistsOf.techniques', 'The techniques used in this specific activity.', 'doc')" v-if="getLabel('consistsOf.techniques', 'The techniques used in this specific activity.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"     required v-model="drawerForm['techniques']" class="input input-bordered w-full validator " :placeholder="getLabel('consistsOf.techniques', 'e.g. UV unwrapping; texture blending; physically based rendering (PBR)', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('consistsOf.materials', 'materials') }}</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('consistsOf.materials', 'The materials used during the event method.', 'doc')" v-if="getLabel('consistsOf.materials', 'The materials used during the event method.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"      v-model="drawerForm['materials']" class="input input-bordered w-full validator " :placeholder="getLabel('consistsOf.materials', 'e.g. conservation materials, bonding agents (for restoration work)', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div>
        <div class="form-control w-full mb-4">
        <div class="flex flex-row items-center">
          <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('consistsOf.equipment', 'equipment') }}</span><span class="text-accent font-black">*</span></label>
          
          <div @click.stop.prevent class="tooltip tooltip-accent tooltip-right" :data-tip="getLabel('consistsOf.equipment', 'The equipment used during this activity – hardware and/or software, listed individually.', 'doc')" v-if="getLabel('consistsOf.equipment', 'The equipment used during this activity – hardware and/or software, listed individually.', 'doc')">
                <button type="button" class="btn btn-circle w-6 h-6 p-1 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" 
                          fill="currentColor"
                          stroke-width="2.5"
                          stroke="currentColor"
                          class="size-[1.2em] primary-content"><path  d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
              </button>
              </div>
              </div>
                        <input type="text"     required v-model="drawerForm['equipment']" class="input input-bordered w-full validator " :placeholder="getLabel('consistsOf.equipment', 'e.g. Artec Leo 3D scanner; Nikon Z8 camera with 24-70mm f/2.8 lens and colour reference card; software: Artec Studio 19, Blender 4.2, Substance Designer 14, Adobe Photoshop Lightroom 14.1', 'plac')" />
              <div class="validator-hint">{{t('validationHint')}}</div>        
          
          </div></div>
      </div>
      <div v-if="activeDrawerField === 'occurredAt'">
        
          <div class="form-control w-full">
             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('occurredAt', 'occurredAt') }}</span><span class="text-warning font-black">~</span></label>
             <input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('occurredAt', '', 'plac')"/>
          </div>
          
          <div class="form-control w-full"></div>
      </div>
      <div v-if="activeDrawerField === 'happenedAt'">
        
          <div class="form-control w-full">
             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('happenedAt', 'happenedAt') }}</span><span class="text-warning font-black">~</span></label>
             <input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('happenedAt', '', 'plac')"/>
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
      <div v-if="activeDrawerField === 'hasCreated'">
        
          <div class="form-control w-full">
             <label class="label"><span class="label-text font-bold capitalize">{{ getLabel('hasCreated', 'hasCreated') }}</span><span class="text-accent font-black">*</span></label>
             <input type="text" v-model="drawerForm['_value']" class="input input-bordered w-full mb-4" :placeholder="getLabel('hasCreated', '', 'plac')"/>
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
import { ref, reactive, inject, shallowRef, onMounted } from 'vue';
import { load } from '@tauri-apps/plugin-store';
import SkosmosAutocomplete from '../components/SkosmosAutocomplete.vue';
import PersonPickerModal from '../components/PersonPickerModal.vue';
import InstitutionAutocomplete from '../components/InstitutionAutocomplete.vue';
import PlaceAutocomplete from '../components/PlaceAutocomplete.vue';
import {
  defaultMetadataLanguage,
  globalRights,
  savedContacts,
  savedActors,
  savedPersons,
  addSavedContact,
  addSavedActor,
  addOrUpdatePerson,
  normalizeYearDate,
  collectionInstitution
} from '../utils/sharedState.js';

const currentLocale = inject('currentLocale', ref('en'));
const fieldLabels = {
  "recordInformation": {
    "en": "Record information",
    "de": "Datensatzinformationen",
    "docEn": "The ID, language, creation information and other metadata describing the record. The ID element of this information block holds the ID assigned by the content provider. Content providers are strongly recommended to complete this element.",
    "docDe": "Die ID, Sprache, Erstellungsinformationen und andere Metadaten, die den Datensatz beschreiben. Das ID-Element dieses Informationsblocks enthält die vom Datenanbieter zugewiesene ID. Datenanbietern wird dringend empfohlen, dieses Element auszufüllen.",
    "placEn": "",
    "placDe": ""
  },
  "recordInformation.id": {
    "en": "Record ID",
    "de": "Datensatz-ID",
    "docEn": "The local ID number of this record about the activity in the content provider\\'s information system. Mandatory – must be unique within the collection.",
    "docDe": "Lokale ID dieses Datensatzes über die Aktivität im System des Datenanbieters. Pflichtfeld – muss innerhalb der Sammlung eindeutig sein.",
    "placEn": "e.g. internal ID from the museum documentation system",
    "placDe": "z.B. interne ID aus dem Museumsdokumentationssystem"
  },
  "recordInformation.source": {
    "en": "Source",
    "de": "Quelle",
    "docEn": "Name of the organisation that maintains this record about the activity.",
    "docDe": "Name der Organisation, die diesen Datensatz über die Aktivität pflegt.",
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
    "docEn": "Date when this record about the activity was created.",
    "docDe": "Datum, an dem dieser Datensatz über die Aktivität angelegt wurde.",
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
    "docEn": "First and last name of the person responsible for creating the metadata about this activity.",
    "docDe": "Vorname(n) und Nachname der Person, die für die Erfassung der Metadaten zu dieser Aktivität verantwortlich ist.",
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
    "docEn": "Licence for the use of these metadata about the activity.",
    "docDe": "Lizenz für die Nutzung dieser Metadaten zur Aktivität.",
    "placEn": "e.g. CC BY-SA 4.0",
    "placDe": "z.B. CC BY-SA 4.0"
  },
  "appellation": {
    "en": "Appellation",
    "de": "Bezeichnung",
    "docEn": "This is the name of the event.. Content providers are strongly recommended to complete this element.",
    "docDe": "Dies ist der Name des Ereignisses.. Datenanbietern wird dringend empfohlen, dieses Element auszufüllen.",
    "placEn": "",
    "placDe": ""
  },
  "appellation.name": {
    "en": "Title",
    "de": "Titel",
    "docEn": "This is the name and ID number of the event. Mandatory. Can be provided in multiple languages, with a preferred value indicated.",
    "docDe": "Name der Aktivität bzw. des Ereignisses. Pflichtfeld. Kann mehrsprachig angegeben werden, bevorzugter Wert markierbar.",
    "placEn": "e.g. 3D Digitization of Attic Grave Monuments from the Berlin Antiquities Collection",
    "placDe": "z.B. 3D-Digitalisierung der Attischen Grabmäler der Antikensammlung, Berlin"
  },
  "appellation.id": {
    "en": "ID",
    "de": "ID",
    "docEn": "Unique identifier of this activity. Mandatory.",
    "docDe": "Eindeutige Kennung dieser Aktivität. Pflichtfeld.",
    "placEn": "e.g. internal ID of the activity module in the museum documentation system",
    "placDe": "z.B. interne ID des Aktivitätsmoduls im Museumsdokumentationssystem"
  },
  "description": {
    "en": "Description",
    "de": "Beschreibung",
    "docEn": "Free-text description of the event or activity that took place. Can be provided in multiple languages.",
    "docDe": "Freitext-Beschreibung des Ereignisses oder der Aktivität, die stattgefunden hat. Kann mehrsprachig angegeben werden.",
    "placEn": "e.g. This pilot project focuses on the 3D acquisition and asset documentation of 18 Attic funerary monuments from the Antikensammlung, Berlin. Conducted in 2025 as a collaboration between the Staatliche Museen zu Berlin and the Bonn Center for Digital Humanities ...",
    "placDe": "z.B. Dieses Pilotprojekt fokussiert auf die 3D-Erfassung und Asset-Dokumentation von 18 attischen Grabmälern der Antikensammlung, Berlin. Durchgeführt 2025 als Kooperation zwischen den Staatlichen Museen zu Berlin und dem Bonn Center for Digital Humanities ..."
  },
  "hasGeneralPurpose": {
    "en": "Has General Purpose",
    "de": "Übergeordneter Zweck",
    "docEn": "A free text description of the general goal or purpose of an activity – e.g. practising, preparing, monitoring, researching, designing, testing, etc.",
    "docDe": "Freitext-Beschreibung des übergeordneten Ziels oder Zwecks der Aktivität – z.B. Üben, Vorbereiten, Überwachen, Forschen, Entwerfen, Testen. [Hinweis: UI-Beschriftung \\'Hat Allgemeinen Zweck\\'.]",
    "placEn": "e.g. The digitization has a research-oriented purpose, aiming to support the use of the assets in scholarly contexts. At the same time, the campaign serves as a pilot project for prototyping documentation processes.",
    "placDe": "z.B. Die Digitalisierung hat einen forschungsorientierten Zweck und unterstützt die Nutzung der Assets in wissenschaftlichen Kontexten. Gleichzeitig dient die Kampagne als Pilotprojekt zur Erprobung von Dokumentationsprozessen."
  },
  "eventType": {
    "en": "Event Type",
    "de": "Ereignistyp",
    "docEn": "General classification of the type of event or activity which took place, e.g. survey, archaeological excavation, digitization, rebuilding. Not repeating – an event has exactly one type.",
    "docDe": "Allgemeine Klassifikation des Ereignis- oder Aktivitätstyps – z.B. Survey, archäologische Ausgrabung, Digitalisierung, Wiederaufbau. Nicht wiederholbar – ein Ereignis hat genau einen Typ.",
    "placEn": "e.g. Digitization",
    "placDe": "z.B. Digitalisierung"
  },
  "actors": {
    "en": "Actors",
    "de": "Akteure",
    "docEn": "The people or organisations involved in this event, may be repeated.",
    "docDe": "Die Personen oder Organisationen, die an diesem Ereignis beteiligt sind, kann wiederholt werden.",
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
    "docEn": "Name of the person or organisation involved in this event.",
    "docDe": "Name der Person oder Organisation, die an diesem Ereignis beteiligt war.",
    "placEn": "e.g. name of the person involved",
    "placDe": "z.B. Name der beteiligten Person"
  },
  "actors.actorType": {
    "en": "Actor Type",
    "de": "Akteurtyp",
    "docEn": "Classification of the actor: individual, group, or organisation.",
    "docDe": "Klassifikation des Akteurs: Einzelperson, Gruppe oder Organisation.",
    "placEn": "e.g. individual | group | organization",
    "placDe": "z.B. Einzelperson | Gruppe | Organisation"
  },
  "actors.roles": {
    "en": "Roles",
    "de": "Rollen",
    "docEn": "Role(s) of the person or organisation in this activity. Multiple roles possible.",
    "docDe": "Rolle(n) der Person oder Organisation bei dieser Aktivität. Mehrfachnennung möglich.",
    "placEn": "e.g. 3D Data Acquisition Lead",
    "placDe": "z.B. Leitung 3D-Datenerfassung"
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
  "temporal": {
    "en": "Temporal",
    "de": "Zeitlich",
    "docEn": "The date or time span of the event.",
    "docDe": "Das Datum oder die Zeitspanne des Ereignisses.",
    "placEn": "",
    "placDe": ""
  },
  "temporal.timeSpan": {
    "en": "Time span",
    "de": "Zeitspanne",
    "docEn": "",
    "docDe": "",
    "placEn": "",
    "placDe": ""
  },
  "temporal.timeSpan.startDate": {
    "en": "Start Date",
    "de": "Startdatum",
    "docEn": "The start date of the event. Format: ISO 8601 (YYYY-MM-DD).",
    "docDe": "Startdatum der Aktivität bzw. des Ereignisses. Format: ISO 8601 (JJJJ-MM-TT).",
    "placEn": "e.g. 2025-01-30",
    "placDe": "z.B. 2025-01-30"
  },
  "temporal.timeSpan.endDate": {
    "en": "End Date",
    "de": "Enddatum",
    "docEn": "The end date of the event. Format: ISO 8601 (YYYY-MM-DD).",
    "docDe": "Enddatum der Aktivität bzw. des Ereignisses. Format: ISO 8601 (JJJJ-MM-TT).",
    "placEn": "e.g. 2025-01-30",
    "placDe": "z.B. 2025-01-30"
  },
  "temporal.timeSpan.dateRangeQualifier": {
    "en": "Date range qualifier",
    "de": "Datumsbereichs-Qualifikator",
    "docEn": "the nature of the time span given (e.g. throughout, at some time during, etc.) Use of a controlled vocabulary is recommended.",
    "docDe": "die Art der angegebenen Zeitspanne (z.B. durchgehend, zu einem bestimmten Zeitpunkt während usw.). Die Verwendung eines kontrollierten Vokabulars wird empfohlen.",
    "placEn": "",
    "placDe": ""
  },
  "temporal.periodName": {
    "en": "Project period name",
    "de": "Zeitraum der Maßnahme",
    "docEn": "The name of the project period to which this activity is assigned.",
    "docDe": "Name der Projektperiode, der diese Aktivität zugeordnet wird.",
    "placEn": "e.g. Pilot phase digitisation programme 2025",
    "placDe": "z.B. Pilotphase Digitalisierungsprogramm 2025"
  },
  "temporal.displayDate": {
    "en": "Display date",
    "de": "Anzeigedatum",
    "docEn": "a free text field used to display the date or period for users (e.g. early 19th century, 1950s). The element may be repeated using the XML:lang attribute if the element value is available in alternate languages. A preferred/alternate attribute may be used to indicate which value is preferred.",
    "docDe": "ein Freitextfeld, das zur Anzeige des Datums oder der Epoche für Benutzer verwendet wird. Ein bevorzugt/alternativ-Attribut kann verwendet werden, um anzuzeigen, welcher Wert bevorzugt wird.",
    "placEn": "",
    "placDe": ""
  },
  "temporal.scientificDate": {
    "en": "Scientific date",
    "de": "Wissenschaftliches Datum",
    "docEn": "date according to scientific dating methods, e.g. ‘1250 bp +/-30 PBN-1675’, recorded precisely as received from the specialist.",
    "docDe": "Datum nach wissenschaftlichen Datierungsmethoden, z.B. \\'1250 bp +/-30 PBN-1675\\', genau so erfasst, wie vom Spezialisten erhalten.",
    "placEn": "",
    "placDe": ""
  },
  "temporal.scientificDateMethod": {
    "en": "Scientific date method",
    "de": "Wissenschaftliche Datierungsmethode",
    "docEn": "e.g. ‘radiocarbon dating’. Use of a controlled vocabulary is recommended; the vocabulary used should be indicated using an attribute. No particular common vocabulary is recommended for use.",
    "docDe": "z.B. \\'Radiokarbon-Datierung\\'. Die Verwendung eines kontrollierten Vokabulars wird empfohlen.",
    "placEn": "",
    "placDe": ""
  },
  "spatial": {
    "en": "Spatial",
    "de": "Räumlich",
    "docEn": "The location or area covered by the event.",
    "docDe": "Der vom Ereignis abgedeckte Ort oder das abgedeckte Gebiet.",
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
    "docEn": "Name of the place or location where this activity took place.",
    "docDe": "Name des Ortes oder Standorts, an dem diese Aktivität stattfand.",
    "placEn": "e.g. Pergamon Museum, Berlin",
    "placDe": "z.B. Pergamonmuseum, Berlin"
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
    "docEn": "Higher-level geopolitical unit (country, region, city) in which this activity took place.",
    "docDe": "Übergeordnete geopolitische Einheit (Land, Region, Stadt), in der diese Aktivität stattfand.",
    "placEn": "e.g. Berlin",
    "placDe": "z.B. Berlin"
  },
  "spatial.locationSet.geopoliticalAreaType": {
    "en": "Geopolitical Area Type",
    "de": "Typ Des Geopolitischen Gebiets",
    "docEn": "Classification of the geopolitical area.",
    "docDe": "Klassifikation des geopolitischen Gebiets.",
    "placEn": "e.g. city",
    "placDe": "z.B. Stadt"
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
    "placEn": "e.g. not applicable if place name is unchanged",
    "placDe": "z.B. nicht zutreffend, falls Ortsname unverändert"
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
    "en": "Spatial reference system",
    "de": "Räumliches Referenzsystem",
    "docEn": "Use of a controlled vocabulary is recommended, and the vocabulary used may be indicated using an attribute (e.g. WGS84). The ESPG spatial coordinate reference is recommended for use. (Mandatory where coordinates are provided)",
    "docDe": "Die Verwendung eines kontrollierten Vokabulars wird empfohlen. Die räumliche Koordinatenreferenz ESPG wird zur Verwendung empfohlen. (Obligatorisch, wenn Koordinaten bereitgestellt werden)",
    "placEn": "",
    "placDe": ""
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
    "en": "X",
    "de": "X",
    "docEn": "according to the spatial coordinate system in use",
    "docDe": "gemäß dem verwendeten räumlichen Koordinatensystem",
    "placEn": "",
    "placDe": ""
  },
  "spatial.geometry.quickpoint.y": {
    "en": "Y",
    "de": "Y",
    "docEn": "according to the spatial coordinate system in use",
    "docDe": "gemäß dem verwendeten räumlichen Koordinatensystem",
    "placEn": "",
    "placDe": ""
  },
  "spatial.geometry.quickpoint.z": {
    "en": "Z",
    "de": "Z",
    "docEn": "height",
    "docDe": "Höhe",
    "placEn": "",
    "placDe": ""
  },
  "spatial.geometry.quickpoint.accuracy": {
    "en": "Accuracy",
    "de": "Genauigkeit",
    "docEn": "",
    "docDe": "",
    "placEn": "",
    "placDe": ""
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
  "consistsOf": {
    "en": "Consists of",
    "de": "Besteht aus",
    "docEn": "this is a repeating group of elements which allows the specific activity (or activities) that took place during the overall Event to be described.",
    "docDe": "dies ist eine sich wiederholende Gruppe von Elementen, die es ermöglicht, die spezifische Aktivität (oder Aktivitäten) zu beschreiben, die während des Gesamtereignisses stattfand(en).",
    "placEn": "",
    "placDe": ""
  },
  "consistsOf.hadSpecificPurpose": {
    "en": "Had Specific Purpose",
    "de": "Hatte Bestimmten Zweck",
    "docEn": "A free text note describing the specific goal or purpose of this activity – e.g. carrying out 3D data acquisition, restoration, completing a survey, constructing a building.",
    "docDe": "Freitext zur Beschreibung des konkreten Ziels oder Zwecks dieser Teilaktivität – z.B. 3D-Datenerfassung, Restaurierung, Survey, Gebäudeerrichtung.",
    "placEn": "e.g. High-precision structured-light scanning with a spatial resolution of 0.1 mm was carried out on the sepulchral sculptures.",
    "placDe": "z.B. Hochpräzises Structured-Light-Scanning mit räumlicher Auflösung von 0,1 mm wurde an den Grabreliefs durchgeführt."
  },
  "consistsOf.startDate": {
    "en": "Start Date",
    "de": "Startdatum",
    "docEn": "The start date of this specific activity. Format: ISO 8601 (YYYY-MM-DD).",
    "docDe": "Startdatum dieser Teilaktivität. Format: ISO 8601 (JJJJ-MM-TT).",
    "placEn": "e.g. 2025-01-30",
    "placDe": "z.B. 2025-01-30"
  },
  "consistsOf.endDate": {
    "en": "End Date",
    "de": "Enddatum",
    "docEn": "The end date of this specific activity. Format: ISO 8601 (YYYY-MM-DD).",
    "docDe": "Enddatum dieser Teilaktivität. Format: ISO 8601 (JJJJ-MM-TT).",
    "placEn": "e.g. 2025-01-30",
    "placDe": "z.B. 2025-01-30"
  },
  "consistsOf.methods": {
    "en": "Methods",
    "de": "Methoden",
    "docEn": "The methods used in this specific activity – e.g. open area excavation, sample survey, restoration, photogrammetric survey.",
    "docDe": "Die in dieser Teilaktivität verwendete(n) Methode(n) – z.B. Flächengrabung, Survey, Restaurierung, photogrammetrische Vermessung.",
    "placEn": "e.g. structured-light 3D scanning | close-range photogrammetric survey | 3D data processing",
    "placDe": "z.B. Structured-Light-3D-Scanning | Nahbereichs-Photogrammetrie | 3D-Datenverarbeitung"
  },
  "consistsOf.techniques": {
    "en": "Techniques",
    "de": "Techniken",
    "docEn": "The techniques used in this specific activity.",
    "docDe": "Die in dieser Teilaktivität verwendete(n) Technik(en).",
    "placEn": "e.g. UV unwrapping; texture blending; physically based rendering (PBR)",
    "placDe": "z.B. UV-Unwrapping; Texturüberblendung; Physically Based Rendering (PBR)"
  },
  "consistsOf.materials": {
    "en": "Materials",
    "de": "Materialien",
    "docEn": "The materials used during the event method.",
    "docDe": "Die während der Methode in dieser Teilaktivität verwendeten Materialien.",
    "placEn": "e.g. conservation materials, bonding agents (for restoration work)",
    "placDe": "z.B. Konservierungsmittel, Verbindungsmittel (bei Restaurierungsarbeiten)"
  },
  "consistsOf.equipment": {
    "en": "Equipment",
    "de": "Ausrüstung",
    "docEn": "The equipment used during this activity – hardware and/or software, listed individually.",
    "docDe": "Die in dieser Teilaktivität verwendete Ausrüstung – Hardware und/oder Software, jeweils einzeln aufgeführt.",
    "placEn": "e.g. Artec Leo 3D scanner; Nikon Z8 camera with 24-70mm f/2.8 lens and colour reference card; software: Artec Studio 19, Blender 4.2, Substance Designer 14, Adobe Photoshop Lightroom 14.1",
    "placDe": "z.B. 3D-Scanner Artec Leo; Kamera Nikon Z8 mit 24-70mm f/2.8 Objektiv und Farbreferenzkarte; Software: Artec Studio 19, Blender 4.2, Substance Designer 14, Adobe Photoshop Lightroom 14.1"
  },
  "assessments": {
    "en": "Assessments",
    "de": "Bewertungen",
    "docEn": "Assessments made of the monument during the event, e.g. of the condition of the monument.",
    "docDe": "Während des Ereignisses vorgenommene Bewertungen des Denkmals – z.B. zum Zustand.",
    "placEn": "e.g. condition assessment of the monument during the event",
    "placDe": "z.B. Zustandsbewertung des Denkmals während des Ereignisses"
  },
  "occurredAt": {
    "en": "Occurred At",
    "de": "Fand Statt Bei",
    "docEn": "Can be used to associate this activity to the time span that overlaps with the occurrence of that activity.",
    "docDe": "Verknüpft diese Aktivität mit einem Zeitraum, der sich mit dem Vorkommen dieser Aktivität überschneidet.",
    "placEn": "e.g. ID or URI of the overlapping time span",
    "placDe": "z.B. ID oder URI des überschneidenden Zeitraums"
  },
  "happenedAt": {
    "en": "Happened At",
    "de": "Fand Statt In",
    "docEn": "Can be used to relate this event to the place where it happened (as an institutional identifier, e.g. GND).",
    "docDe": "Verknüpft dieses Ereignis mit dem Ort, an dem es stattfand (als institutioneller Identifier, z.B. GND).",
    "placEn": "e.g. https://d-nb.info/gnd/5035657-4",
    "placDe": "z.B. https://d-nb.info/gnd/5035657-4"
  },
  "wasPresentAt": {
    "en": "Was Present At",
    "de": "War Anwesend Bei",
    "docEn": "Can be used to relate this activity to the actors who were present.",
    "docDe": "Verknüpft diese Aktivität mit den Akteuren, die anwesend waren.",
    "placEn": "e.g. ID/URI of the actors present",
    "placDe": "z.B. ID/URI der anwesenden Akteure"
  },
  "hasPart": {
    "en": "Has Part",
    "de": "Hat Teil",
    "docEn": "This activity is an overarching event composed of several smaller, standalone sub-activity records.",
    "docDe": "Diese Aktivität ist ein übergeordnetes Ereignis, das aus mehreren kleineren, eigenständigen Teil-Aktivitäts-Datensätzen besteht.",
    "placEn": "e.g. ID/URI of the activity record of a second sub-campaign",
    "placDe": "z.B. ID/URI des Aktivitäts-Datensatzes einer zweiten Teilkampagne"
  },
  "isPartOf": {
    "en": "Is Part Of",
    "de": "Ist Teil Von",
    "docEn": "This is the relation between an activity and the general activity of which it forms a part.",
    "docDe": "Beziehung zwischen dieser Aktivität und der übergeordneten Aktivität, von der sie ein Teil ist.",
    "placEn": "e.g. ID/URI of the parent funding programme",
    "placDe": "z.B. ID/URI des übergeordneten Förderprogramms"
  },
  "hasCreated": {
    "en": "Has Created",
    "de": "Hat Erstellt",
    "docEn": "This is the relation between an activity and a digital resource or digital file that it created.",
    "docDe": "Beziehung zwischen dieser Aktivität und einer digitalen Ressource oder Datei, die durch sie erstellt wurde.",
    "placEn": "e.g. reference to all 3D models created during this activity (DOIs of the respective digital resources) https://bonndata.uni-bonn.de/dataverse/altes_museum_berlin",
    "placDe": "z.B. Verweis auf alle im Rahmen dieser Aktivität erstellten 3D-Modelle (DOIs der jeweiligen digitalen Ressourcen) https://bonndata.uni-bonn.de/dataverse/altes_museum_berlin"
  },
  "dcRelation": {
    "en": "DC Relation",
    "de": "DC-Beziehung",
    "docEn": "This is for general relations from this activity, e.g. to publications.",
    "docDe": "Für allgemeine Beziehungen ausgehend von dieser Aktivität – z.B. zu Publikationen.",
    "placEn": "e.g. link to a related publication",
    "placDe": "z.B. Link zu einer zugehörigen Publikation"
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
  'hasGeneralPurpose': '',
  'hasGeneralPurpose#lang': '',
  'eventType': '',
  'eventType#term': '',
  'eventType#namespace': '',
  'eventType#lang': '',
  'eventType#termUID': '',
  'actors': [],
  'temporal': [],
  'spatial.locationSet.namedLocation': '',
  'spatial.locationSet.namedLocation#lang': '',
  'spatial.locationSet.namedLocation#preferred': false,
  'spatial.locationSet.namedLocation#namespace': '',
  'spatial.locationSet.namedLocation#term': '',
  'spatial.locationSet.namedLocation#termUID': '',
  'spatial.locationSet.geopoliticalArea': '',
  'spatial.locationSet.geopoliticalArea#lang': '',
  'spatial.locationSet.geopoliticalAreaType': '',
  'spatial.locationSet.geopoliticalAreaType#lang': '',
  'spatial.locationSet.geopoliticalAreaType#namespace': '',
  'spatial.locationSet.historicalName': [],
  'spatial.locationSet.historicalName#lang': '',
  'spatial.locationSet.historicalName#namespace': '',
  'spatial.locationSet.historicalName#term': '',
  'spatial.locationSet.historicalName#termUID': '',
  'spatial.locationSet.historicalName#preferred': false,
  'consistsOf': [],
  'assessments': '',
  'assessments#term': '',
  'assessments#namespace': '',
  'assessments#lang': '',
  'assessments#termUID': '',
  'occurredAt': [],
  'happenedAt': [],
  'wasPresentAt': [],
  'hasPart': [],
  'isPartOf': [],
  'hasCreated': [],
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
        const raw = localStorage.getItem(`hermes_templates_activity_${f}`);
        if (raw) tpls = JSON.parse(raw);
      }
      templates.value[f] = tpls || [];
    }
  } catch (error) {
    console.error('Error loading templates store:', error);
    for (const f of ['contacts', 'references', 'temporal', 'spatial']) {
      try {
        const raw = localStorage.getItem(`hermes_templates_activity_${f}`);
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
    localStorage.setItem(`hermes_templates_activity_${field}`, JSON.stringify(templates.value[field]));
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
      localStorage.setItem(`hermes_templates_activity_${field}`, JSON.stringify(templates.value[field]));
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

const saveDrawer = () => {
  const field = activeDrawerField.value;
  if (!form[field]) form[field] = [];

  // Normalize year dates for consistsOf and temporal
  if (field === 'consistsOf') {
    if (drawerForm['startDate']) drawerForm['startDate'] = normalizeYearDate(drawerForm['startDate']);
    if (drawerForm['endDate']) drawerForm['endDate'] = normalizeYearDate(drawerForm['endDate']);
  } else if (field === 'temporal') {
    if (drawerForm['timeSpan.startDate']) drawerForm['timeSpan.startDate'] = normalizeYearDate(drawerForm['timeSpan.startDate']);
    if (drawerForm['timeSpan.endDate']) drawerForm['timeSpan.endDate'] = normalizeYearDate(drawerForm['timeSpan.endDate']);
  }

  const isPrimitive = drawerForm.hasOwnProperty('_value') && Object.keys(drawerForm).length === 1;
  const dataToSave = isPrimitive ? drawerForm['_value'] : JSON.parse(JSON.stringify(drawerForm));

  if (drawerEditIndex.value > -1) form[field][drawerEditIndex.value] = dataToSave;
  else form[field].push(dataToSave);
  
  if (field === 'recordInformation.creation.contacts' && typeof dataToSave === 'object' && dataToSave?.name) {
    addOrUpdatePerson(dataToSave);
  } else if (field === 'actors' && typeof dataToSave === 'object' && dataToSave?.name) {
    addOrUpdatePerson(dataToSave);
  }

  closeDrawer();
};

const removeDrawerItem = (field, index) => {
  if (confirm(t('deleteEntryPrompt'))) form[field].splice(index, 1);
};

const save = () => {
  if (Array.isArray(form['consistsOf'])) {
    form['consistsOf'].forEach(item => {
      if (item && item.startDate) item.startDate = normalizeYearDate(item.startDate);
      if (item && item.endDate) item.endDate = normalizeYearDate(item.endDate);
    });
  }
  if (Array.isArray(form['temporal'])) {
    form['temporal'].forEach(item => {
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
  isEditing.value = false;
  editIndex.value = null;
  Object.keys(preferredLanguages).forEach(k => delete preferredLanguages[k]);
};
defineExpose({ items, form });
</script>