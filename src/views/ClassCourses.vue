<template>
  <div>
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <nav class="flex items-center text-sm leading-5 font-medium">
          <a class="text-primary-dark hover:underline focus:outline-none focus:underline transition duration-150 ease-in-out">
            Classes
          </a>
          <svg class="flex-shrink-0 mx-2 h-5 w-5 text-border-dark last:hidden" fill="currentColor"
               viewBox="0 0 20 20">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"></path>
          </svg>
          <a class="text-primary-dark hover:underline focus:outline-none focus:underline transition duration-150 ease-in-out">
            FA18-BCS-162@LHR
          </a>
          <svg class="flex-shrink-0 mx-2 h-5 w-5 text-border-dark last:hidden" fill="currentColor"
               viewBox="0 0 20 20">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"></path>
          </svg>
        </nav>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-for="semester in this.classes[this.$route.params.id]" :key="semester.name">
        <h1 class="text-lg leading-6 font-medium text-gray-900 py-3 mt-4">{{semester.name}}</h1>

        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul>
            <li class="border-t border-border-light first:border-t-0"
                v-for="course in semester.courses" :key="course.id">

              <router-link :to="{name: 'classes:detail', params: {id: course.id}}"
                           class="block hover:bg-white-light focus:outline-none focus:bg-gray-50 transition duration-300 ease-in-out">
                <div class="flex items-center px-4 py-4 sm:px-6">
                  <div class="flex-shrink-0">
                    <div
                      class="h-10 w-10 mr-3 bg-primary-light rounded-full flex items-center justify-center">
                      <svg class="text-on-primary h-5 w-5" fill="none" stroke-linecap="round"
                           stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"
                           stroke="currentColor">
                        <path
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                      </svg>
                    </div>
                  </div>

                  <div class="min-w-0 flex-1 flex flex-col">
                    <div class="text-sm leading-5 font-medium text-accent truncate">
                      {{course.title}}
                    </div>
                    <div class="mt-2 text-sm leading-5 text-primary-light truncate">{{course.code}}
                      - {{course.teacher}}
                    </div>
                  </div>

                  <div>
                    <svg class="h-5 w-5 text-on-background-light" viewBox="0 0 20 20"
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
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    created() {
      this.$store.dispatch('subjects/fetchClassSubjects', this.$route.params.id);
    },
    computed: {
      ...mapState('subjects', ['classes']),
    },
  };
</script>
