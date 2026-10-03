<template>
  <span class="inline-flex items-center justify-center shrink-0 leading-none" :class="sizeClass">
    <!-- DE: Germany -->
    <svg v-if="normalizedCode === 'de'" viewBox="0 0 5 3" class="w-full h-full rounded-xs shadow-xs object-cover border border-black/10 overflow-hidden">
      <rect width="5" height="3" y="0" fill="#000000"/>
      <rect width="5" height="2" y="1" fill="#DD0000"/>
      <rect width="5" height="1" y="2" fill="#FFCE00"/>
    </svg>

    <!-- EN / GB: United Kingdom -->
    <svg v-else-if="normalizedCode === 'en' || normalizedCode === 'gb'" viewBox="0 0 50 30" class="w-full h-full rounded-xs shadow-xs object-cover border border-black/10 overflow-hidden">
      <rect width="50" height="30" fill="#012169"/>
      <path d="M0 0 L50 30 M50 0 L0 30" stroke="#FFFFFF" stroke-width="6"/>
      <path d="M0 0 L50 30" stroke="#C8102E" stroke-width="2"/>
      <path d="M50 0 L0 30" stroke="#C8102E" stroke-width="2"/>
      <path d="M25 0 V30 M0 15 H50" stroke="#FFFFFF" stroke-width="10"/>
      <path d="M25 0 V30 M0 15 H50" stroke="#C8102E" stroke-width="6"/>
    </svg>

    <!-- FR: France -->
    <svg v-else-if="normalizedCode === 'fr'" viewBox="0 0 3 2" class="w-full h-full rounded-xs shadow-xs object-cover border border-black/10 overflow-hidden">
      <rect width="1" height="2" x="0" fill="#002654"/>
      <rect width="1" height="2" x="1" fill="#FFFFFF"/>
      <rect width="1" height="2" x="2" fill="#ED2939"/>
    </svg>

    <!-- IT: Italy -->
    <svg v-else-if="normalizedCode === 'it'" viewBox="0 0 3 2" class="w-full h-full rounded-xs shadow-xs object-cover border border-black/10 overflow-hidden">
      <rect width="1" height="2" x="0" fill="#009246"/>
      <rect width="1" height="2" x="1" fill="#FFFFFF"/>
      <rect width="1" height="2" x="2" fill="#CE2B37"/>
    </svg>

    <!-- ES: Spain -->
    <svg v-else-if="normalizedCode === 'es'" viewBox="0 0 3 2" class="w-full h-full rounded-xs shadow-xs object-cover border border-black/10 overflow-hidden">
      <rect width="3" height="2" y="0" fill="#AA151B"/>
      <rect width="3" height="1" y="0.5" fill="#F1BF00"/>
    </svg>

    <!-- EL: Greece -->
    <svg v-else-if="normalizedCode === 'el' || normalizedCode === 'gr'" viewBox="0 0 27 18" class="w-full h-full rounded-xs shadow-xs object-cover border border-black/10 overflow-hidden">
      <rect width="27" height="18" fill="#0D5EAF"/>
      <path d="M0 2h27M0 6h27M0 10h27M0 14h27" stroke="#FFF" stroke-width="2"/>
      <rect width="10" height="10" fill="#0D5EAF"/>
      <path d="M5 0v10M0 5h10" stroke="#FFF" stroke-width="2"/>
    </svg>

    <!-- Fallback: clean text badge -->
    <span v-else class="text-[10px] font-bold uppercase tracking-wider text-base-content/80 font-mono px-1 py-0.5 bg-base-300 rounded">
      {{ code }}
    </span>
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: 'md', // 'sm' | 'md' | 'lg'
  },
});

const normalizedCode = computed(() => (props.code || '').trim().toLowerCase());

const sizeClass = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'w-3.5 h-2.5';
    case 'sm':
      return 'w-4 h-3';
    case 'lg':
      return 'w-7 h-5';
    case 'xl':
      return 'w-10 h-7';
    case 'md':
    default:
      return 'w-5 h-3.5';
  }
});
</script>
