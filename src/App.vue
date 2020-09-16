<template>
  <div class="antialiased bg-background h-full">
    <Header></Header>
    <main>
        <router-view/>
    </main>
  </div>
</template>

<script>
import Header from './components/Header.vue';

export default {
  components: { Header },
  watch: {
    $route (to, from) {
      document.title = to.meta.title || 'clase'
    }
  },
};
</script>
