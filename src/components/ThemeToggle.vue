<template>
  <span role="checkbox" tabindex="0" aria-checked="false"
        @click="isLight=!isLight"
        class="bg-surface relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:shadow-outline">
    <span aria-hidden="true"
          :class="isLight ? 'translate-x-5' : 'translate-x-0'"
          class="translate-x-0 relative inline-block h-5 w-5 rounded-full bg-on-primary shadow transform transition ease-in-out duration-200">
      <span
        :class="isLight ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200'"
        class="ease-in duration-200 absolute inset-0 h-full w-full flex items-center justify-center transition-opacity">
        <svg viewBox="0 0 20 20" fill="currentColor" class="h-3 w-3 text-surface">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
        </svg>
      </span>
      <span
        :class="isLight ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100'"
        class="opacity-0 ease-out duration-100 absolute inset-0 h-full w-full flex items-center justify-center transition-opacity">
        <svg viewBox="0 0 20 20" fill="currentColor" class="h-3 w-3 text-surface">
          <path fill-rule="evenodd" clip-rule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"></path>
        </svg>
      </span>
    </span>
  </span>
</template>

<script>
export default {
  data() {
    const theme = localStorage.theme || ((
      window.matchMedia
      && window.matchMedia('(prefers-color-scheme: dark)').matches
    ) ? 'dark' : 'auto');

    document.body.classList.remove(theme !== 'dark' ? 'dark' : 'light');
    document.body.classList.add(theme);

    return {
      isLight: theme !== 'dark',
    };
  },
  watch: {
    isLight(val) {
      document.body.classList.remove(val ? 'dark' : 'light');
      document.body.classList.add(val ? 'light' : 'dark');
      localStorage.theme = val ? 'light' : 'dark';
    },
  },
};
</script>
