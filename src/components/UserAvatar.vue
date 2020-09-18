<template>
  <div v-if="!isLoading">
    <x-button v-if="!isAuthenticated" variant="outline"
              @click="$router.push({ name: 'auth-login' })">
      Sign in
    </x-button>
    <div v-else class="h-8 w-8">
      <XAvatar :img-url="photoUrl" text="NU" size="sm" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { auth } from '../firebase';
import XButton from './elements/Button.vue';
import XAvatar from './elements/Avatar.vue';

export default {
  components: {
    XButton,
    XAvatar,
  },
  computed: {
    ...mapGetters('profile', ['isAuthenticated']),
    ...mapState('profile', ['isLoading']),
    photoUrl() {
      return auth.currentUser.photoURL;
    },
  },
  created() {
    window.auth = auth;
  },
};
</script>
