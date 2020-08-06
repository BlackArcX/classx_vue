<template>
  <div class="sticky w-full top-0">
    <nav class="bg-dark shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center h-16">
          <div>
            <h1 class="inline-flex items-center font-medium leading-5 text-on-primary text-lg">
              Class Resources
            </h1>
          </div>
          <div class="flex-1 w-full">
            <label for="search" class="sr-only">Search projects</label>

            <div class="relative max-w-lg mx-auto text-dark-lighter focus-within:text-black">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clip-rule="evenodd"></path>
                </svg>
              </div>
              <input ref="search" id="search" placeholder="Search documents" type="search" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false"
                     class="font-medium block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-darker bg-opacity-25 text-black placeholder-dark-lighter focus:outline-none focus:bg-white focus:placeholder-gray-400 focus:text-gray-900 sm:text-sm transition duration-150 ease-in-out">
              <div class="opacity-100 absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none transition duration-150 ease-in-out">
                <span style="padding-left: 1px;"
                      class="inline-block w-5 h-5 text-center text-white border border-dark-lighter rounded-sm text-xs opacity-75">/</span>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  created() {
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && this.$refs.search && document.activeElement !== this.$refs.search) {
        this.$refs.search.focus();
        e.preventDefault();
      }
    });
  },
};
</script>

<style scoped>
#search:focus+div {
  opacity: 0;
}
</style>
