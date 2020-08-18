<template>
  <div>
    <header class="bg-surface shadow-sm">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <nav class="flex items-center text-sm leading-5 font-medium">
          <a class="text-on-surface hover:underline focus:outline-none focus:underline transition duration-150 ease-in-out">
            Classes
          </a>
        </nav>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-for="university in universities" :key="university.name">
        <h1 class="text-lg leading-6 font-medium text-on-surface py-3 mt-4">{{university.name}}</h1>

        <div class="bg-surface shadow overflow-hidden sm:rounded-md">
          <ul>
            <li class="border-t border-border-75 first:border-t-0" v-for="cls in university.classes" :key="cls.id">

              <router-link :to="{name: 'class:courses', params: {'class': cls.id}}" class="block hover:bg-surface-dark focus:outline-none focus:bg-gray-50 transition duration-300 ease-in-out">
                <div class="flex items-center px-4 py-4 sm:px-6">
                  <div class="flex-shrink-0">
                    <div class="h-10 w-10 mr-3 bg-primary rounded-full flex items-center justify-center">
                      <svg class="text-on-primary h-5 w-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                    </div>
                  </div>

                  <div class="min-w-0 flex-1 flex flex-col">
                    <div class="text-sm leading-5 font-medium text-on-surface truncate">{{cls.name}}</div>
                    <div class="mt-2 text-sm leading-5 text-on-surface-60 truncate">{{cls.representative}}</div>
                  </div>

                  <div>
                    <svg class="h-5 w-5 text-on-background-75" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </router-link>

            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  created() {
    this.$store.dispatch('classes/subscribe');
  },
  computed: {
    ...mapGetters('classes', ['universities']),
  },
  destroyed() {
    this.$store.commit('classes/unsubscribe');
  },
};
</script>
