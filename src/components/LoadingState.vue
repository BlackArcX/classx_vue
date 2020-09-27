<template>
  <div class="flex items-center" style="min-height: calc(100vh - 60px - 54px);">
    <div class="w-full py-8">

      <div class="flex items-center justify-center text-on-surface-80">
        <span class="inline-block loading w-8 h-8 relative"></span>
        <h2 class="text-center leading-9 sm:text-lg sm:leading-10">
          Loading...
        </h2>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading {
  top: 7px;
  left: 5px;
}

.loading::before {
  @apply block;
}
</style>
