<template>
  <div v-if="!isLoading">
    <x-button v-if="!isAuthenticated" variant="outline-dark"
              @click="$router.push({ name: 'auth-login', query: { next: $route.path } })">
      Sign in
    </x-button>
    <div v-else class="h-8 w-8">
      <x-dropdown class="light">
        <div class="h-8 w-8 rounded-full focus:outline-none focus:shadow-outline transition duration-150">
          <XAvatar :img-url="photoUrl" text="NU" size="sm"/>
        </div>

        <x-dropdown-menu slot="dropdown" position="bottom-right">
          <x-dropdown-item @click="$router.push(userClassLink)" divided>
            <svg slot="icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            My Class
          </x-dropdown-item>
          <x-dropdown-item @click="logout">
            <svg slot="icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Logout
          </x-dropdown-item>
        </x-dropdown-menu>
      </x-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import { auth } from '../firebase';

import XButton from './elements/Button.vue';
import XAvatar from './elements/Avatar.vue';
import XDropdown from './elements/Dropdown.vue';
import XDropdownMenu from './elements/DropdownMenu.vue';
import XDropdownItem from './elements/DropdownItem.vue';

export default {
  components: {
    XButton,
    XAvatar,
    XDropdown,
    XDropdownMenu,
    XDropdownItem,
  },
  computed: {
    ...mapGetters('profile', ['isAuthenticated']),
    ...mapState('profile', ['isLoading', 'profile']),
    photoUrl() {
      return auth.currentUser.photoURL;
    },
    userClassLink() {
      if (this.profile.class) {
        return { name: 'class:courses', params: { class: this.profile.class.id } };
      }
      return { name: 'classes' };
    },
  },
  methods: {
    ...mapActions('profile', ['logout']),
  },
  created() {
    window.auth = auth;
  },
};
</script>
