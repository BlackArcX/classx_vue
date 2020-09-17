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
      if (typeof to.meta.title == "string")
        document.title = `${to.meta.title} - ClassX`;
      else if (typeof to.meta.title == "function")
        document.title = `${to.meta.title(to)} - ClassX`;
      else
        document.title = `ClassX`;
    }
  },
};
</script>
