<template>
  <Page>
    <div v-for="semester in classes[$route.params.class]" :key="semester.name">
        <h1 class="text-lg leading-6 font-medium text-on-surface py-3 mt-4">{{semester.name}}</h1>

        <div class="bg-surface shadow overflow-hidden sm:rounded-md">
          <ul>
            <li class="border-t border-border-75 first:border-t-0"
                v-for="course in semester.courses" :key="course.id">

              <router-link
                :to="{name: 'course:details', params: {'class': $route.params.class, 'course': course.code, }}"
                class="block hover:bg-surface-dark focus:outline-none focus:bg-gray-50 transition duration-300 ease-in-out">
                <div class="flex items-center px-4 py-4 sm:px-6">
                  <div class="flex-shrink-0">
                    <div :style="{background: generateColor(course.title)}"
                      class="h-10 w-10 mr-3 rounded-full flex items-center justify-center">
                      <svg class="text-on-primary h-5 w-5" fill="none" stroke-linecap="round"
                           stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"
                           stroke="currentColor">
                        <path
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                      </svg>
                    </div>
                  </div>

                  <div class="min-w-0 flex-1 flex flex-col">
                    <div class="text-sm leading-5 font-medium text-on-surface truncate">
                      {{course.title}}
                    </div>
                    <div class="mt-2 text-sm leading-5 text-on-surface-60 truncate">{{course.code}}
                      - {{course.teacher}}
                    </div>
                  </div>

                  <div>
                    <svg class="h-5 w-5 text-on-background-75" viewBox="0 0 20 20"
                         fill="currentColor">
                      <path fill-rule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </router-link>

            </li>
          </ul>
        </div>
  </div>

    <div v-if="classes[$route.params.class].length === 0">
      <LoadingState v-if="isLoading" />
      <EmptyState v-else />
    </div>
  </Page>
</template>

<script>
import { mapState } from 'vuex';
import Page from '../components/Page.vue';
import EmptyState from '../components/EmptyState.vue';
import LoadingState from '../components/LoadingState.vue';

export default {
  components: {
    EmptyState,
    LoadingState,
    Page,
  },
  data() {
    return {
      links: [
        {
          id: 'classes',
          name: 'Classes',
          route: { name: 'classes' },
        },
        {
          id: 'class:courses',
          name: this.$route.params.class,
          route: {
            name: 'class:courses',
            params: { class: this.$route.params.class },
          },
        },
      ],
    };
  },
  methods: {
    generateColor(text) {
      // eslint-disable-next-line no-bitwise
      let h = Array.from(text || '').reduce((hash, e) => ((hash << 5) - hash + e.charCodeAt(0)) | 0, 0);
      h = (h % 72) * 5;
      return `hsla(${h}, 78%, 52%, 0.8)`;
    },
  },
  created() {
    this.$store.dispatch('subjects/fetchClassSubjects', this.$route.params.class);
  },
  computed: {
    ...mapState('subjects', ['classes']),
    isLoading() {
      return this.$store.state.subjects.loading[this.$route.params.class] || false;
    },
  },
};
</script>
