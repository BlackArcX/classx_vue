<template>
  <div class="antialiased bg-white-dark h-full">
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
};
</script>
