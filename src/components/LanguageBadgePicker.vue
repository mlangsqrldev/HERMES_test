<template>
  <div class="dropdown dropdown-end shrink-0 inline-block">
    <div
      tabindex="0"
      role="button"
      class="btn btn-xs btn-ghost gap-1.5 px-2 h-7 min-h-0 border border-base-300 hover:border-primary/60 bg-base-200/50 hover:bg-base-200 shadow-2xs rounded-lg transition-all"
      :title="titleText"
    >
      <FlagIcon :code="activeLang" size="xs" />
      <span class="text-[11px] font-bold uppercase tracking-wider font-mono">{{ activeLang }}</span>
      <span class="text-[8px] opacity-40">▼</span>
    </div>
    <ul
      tabindex="0"
      class="dropdown-content menu menu-xs p-1.5 shadow-2xl bg-base-100 rounded-xl w-36 z-[120] border border-base-300 mt-1"
    >
      <li v-for="lang in availableLanguages" :key="lang.code">
        <a
          class="flex items-center justify-between py-1 px-2 rounded-lg cursor-pointer"
          :class="activeLang === lang.code ? 'active font-bold bg-primary text-primary-content' : 'hover:bg-base-200'"
          @click.prevent="selectLang(lang.code)"
        >
          <div class="flex items-center gap-1.5">
            <FlagIcon :code="lang.code" size="xs" />
            <span class="text-xs">{{ lang.name }}</span>
          </div>
          <span class="text-[10px] font-mono uppercase opacity-70">{{ lang.code }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import FlagIcon from './FlagIcon.vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  defaultLanguage: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const injectedLocale = inject('currentLocale', ref('de'));
const defaultMetadataLanguage = inject('defaultMetadataLanguage', ref('de'));

const activeLang = computed(() => {
  return (props.modelValue || props.defaultLanguage || defaultMetadataLanguage.value || injectedLocale.value || 'de').toLowerCase();
});

const availableLanguages = [
  { code: 'de', name: 'Deutsch' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
  { code: 'es', name: 'Español' },
  { code: 'el', name: 'Ελληνικά' }
];

const titleText = computed(() => {
  return injectedLocale.value === 'de'
    ? `Sprache (@lang="${activeLang.value}") ändern`
    : `Change language (@lang="${activeLang.value}")`;
});

const selectLang = (code) => {
  emit('update:modelValue', code);
  emit('change', code);
  if (document.activeElement && typeof document.activeElement.blur === 'function') {
    document.activeElement.blur();
  }
};
</script>
