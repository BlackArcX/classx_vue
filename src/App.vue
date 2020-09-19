<template>
  <div class="antialiased bg-background h-full">
    <Header></Header>
    <main>
        <router-view/>
    </main>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Header from './components/Header.vue';
import { auth } from './firebase';

export default {
  components: { Header },
  created() {
    auth.onAuthStateChanged(() => {
      this.$store.dispatch('profile/fetchProfile');
    });
  },
  computed: {
    ...mapState('profile', { isProfileAvailable: 'isAvailable' }),
    ...mapGetters('profile', ['isAuthenticated']),
  },
  watch: {
    isProfileAvailable() {
      if (!this.isProfileAvailable && this.$route.path.indexOf('auth') === -1 && this.isAuthenticated) {
        this.$router.push({ name: 'setup-university', query: { next: this.$route.path } });
      }
    },
    $route(to) {
      if (typeof to.meta.title === 'string') {
        document.title = `${to.meta.title} - ClassX`;
      } else if (typeof to.meta.title === 'function') {
        document.title = `${to.meta.title(to)} - ClassX`;
      } else {
        document.title = 'ClassX';
      }
    },
  },
};
</script>
