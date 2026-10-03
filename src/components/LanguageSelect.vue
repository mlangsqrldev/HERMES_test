<template>
    <div class="flex flex-wrap gap-2 p-2">
        <div v-for="lang in languages" :key="lang.code" @click="toggleLanguage(lang.code)"
            class="group relative flex h-9 px-3 cursor-pointer items-center justify-center gap-1.5 rounded-lg border-2 bg-base-200 text-sm shadow-xs transition-all hover:bg-base-300/60"
            :class="[
                selectedLanguages.includes(lang.code)
                    ? 'border-accent bg-accent/10 font-bold'
                    : 'border-transparent hover:border-base-300'
            ]">
            <FlagIcon :code="lang.code" size="sm" />
            <span class="text-xs font-bold uppercase">{{ lang.code }}</span>

            <button @click.stop="setPreferred(lang.code)"
                class="btn btn-circle btn-ghost btn-xs ml-1 transition-opacity" :class="[
                    preferredLanguage === lang.code
                        ? 'text-warning opacity-100'
                        : 'opacity-0 text-base-content/30 group-hover:opacity-100 hover:text-warning'
                ]" :title="preferredLanguage === lang.code ? 'Preferred Language' : 'Set as preferred'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5"
                    :fill="preferredLanguage === lang.code ? 'currentColor' : 'none'" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            </button>
        </div>
    </div>

    <div class="mt-8 p-4 bg-base-200 rounded-box max-w-sm">
        <h3 class="font-bold text-lg mb-2">Current State</h3>
        <p><strong>Selected:</strong> {{ selectedLanguages.join(', ') || 'None' }}</p>
        <p><strong>Preferred:</strong> {{ preferredLanguage || 'None' }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import FlagIcon from './FlagIcon.vue';

// Define the available languages
const languages = [
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
];

// Reactive state
const selectedLanguages = ref([]);
const preferredLanguage = ref(null);

// Methods
const toggleLanguage = (code) => {
    const index = selectedLanguages.value.indexOf(code);

    if (index === -1) {
        selectedLanguages.value.push(code);
    } else {
        selectedLanguages.value.splice(index, 1);

        // If the user unselects their preferred language, clear the preference
        if (preferredLanguage.value === code) {
            preferredLanguage.value = null;
        }
    }
};

const setPreferred = (code) => {
    preferredLanguage.value = code;

    // UX Enhancement: If a user sets a language as preferred, auto-select it 
    // if it isn't already selected.
    if (!selectedLanguages.value.includes(code)) {
        selectedLanguages.value.push(code);
    }
};
</script>