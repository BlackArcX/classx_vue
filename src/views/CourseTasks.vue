<template>
  <div>
    <template v-if="activeTasks.length">
      <h1 class="text-lg leading-6 font-medium text-on-surface py-3 mt-4">Active Tasks</h1>
      <div class="bg-surface shadow overflow-hidden sm:rounded-md">
        <ul>
          <template v-for="task in activeTasks">
            <li :key="task.id" class="border-t border-border-75 first:border-t-0">
              <div class="flex items-center px-4 py-4 sm:px-6">
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 mr-3 bg-primary rounded-full flex items-center justify-center">
                    <svg class="text-on-primary w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                  </div>
                </div>
                <div class="min-w-0 flex-1 flex flex-col">
                  <div class="text-sm leading-5 font-medium text-on-surface truncate">
                    {{ task.title }}
                  </div>
                  <div class="mt-1 text-sm leading-5 text-on-surface-60 truncate">
                    Due {{ formatRelative(task.dueDate.toDate()) }}
                  </div>
                </div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </template>

    <template v-if="oldTasks.length">
      <h1 class="text-lg leading-6 font-medium text-on-surface py-3 mt-4">Old Tasks</h1>
      <div v-if="oldTasks" class="bg-surface shadow overflow-hidden sm:rounded-md">
        <ul>
          <template v-for="task in oldTasks">
            <li :key="task.id" class="border-t border-border-75 first:border-t-0">
              <div class="flex items-center px-4 py-4 sm:px-6">
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 mr-3 bg-primary rounded-full flex items-center justify-center">
                    <svg class="text-on-primary w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                  </div>
                </div>
                <div class="min-w-0 flex-1 flex flex-col">
                  <div class="text-sm leading-5 font-medium text-on-surface truncate">
                    {{ task.title }}
                  </div>
                  <div class="mt-1 text-sm leading-5 text-on-surface-60 truncate">
                    Due {{ formatDateTime(task.dueDate.toDate()) }}
                  </div>
                </div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    const { class: cls, course: courseCode } = this.$route.params;

    return {
      cls,
      courseCode,
    };
  },
  computed: {
    tasks() {
      return this.$store.getters['courses/tasksByCourseCode'](this.cls, this.courseCode);
    },
    activeTasks() {
      return (this.tasks || []).filter((e) => e.dueDate.toDate() > new Date());
    },
    oldTasks() {
      return (this.tasks || []).filter((e) => e.dueDate.toDate() < new Date());
    },
  },
  created() {
    this.$store.dispatch('courses/watchTasks', {
      cls: this.cls,
      courseCode: this.courseCode,
    });
  },
  beforeDestroy() {
    const { id } = this.$store.getters['courses/courseByCode'](this.cls, this.courseCode) || {};
    this.$store.commit('courses/unwatchTasks', id);
  },
};
</script>
