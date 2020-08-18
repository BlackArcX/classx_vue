<template>
  <div>
    <header class="bg-surface shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex">
        <nav class="flex flex-1 items-center text-sm leading-5 font-medium">
          <a class="text-on-surface hover:underline focus:outline-none focus:underline transition duration-150 ease-in-out">
            Classes
          </a>
          <svg class="flex-shrink-0 mx-2 h-5 w-5 text-border-dark last:hidden" fill="currentColor"
               viewBox="0 0 20 20">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"></path>
          </svg>
          <a class="text-on-surface hover:underline focus:outline-none focus:underline transition duration-150 ease-in-out">
            FA18-BCS-162@LHR
          </a>
          <svg class="flex-shrink-0 mx-2 h-5 w-5 text-border-dark last:hidden" fill="currentColor"
               viewBox="0 0 20 20">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"></path>
          </svg>
          <a class="text-on-surface hover:underline focus:outline-none focus:underline transition duration-150 ease-in-out">
            HUM103
          </a>
          <svg class="flex-shrink-0 mx-2 h-5 w-5 text-border-dark last:hidden" fill="currentColor"
               viewBox="0 0 20 20">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"></path>
          </svg>
        </nav>
        <nav class="flex">
          <a href="#" class="whitespace-no-wrap ml-8 py-4 px-1 border-b-2 border-indigo-500 font-medium text-sm leading-5 text-on-surface focus:outline-none focus:text-indigo-800 focus:border-indigo-700" aria-current="page">
            Resources
          </a>
          <a href="#" class="whitespace-no-wrap ml-8 py-4 px-1 border-b-2 border-transparent font-medium text-sm leading-5 text-primary-75 hover:text-on-surface hover:border-border focus:outline-none focus:text-primary-dark focus:border-border-dark">
            Tasks
          </a>
          <a href="#" class="whitespace-no-wrap ml-8 py-4 px-1 border-b-2 border-transparent font-medium text-sm leading-5 text-primary-75 hover:text-on-surface hover:border-border focus:outline-none focus:text-primary-dark focus:border-border-dark">
            About
          </a>
        </nav>
      </div>
    </header>

    <div></div>
  </div>
</template>

<script>
export default {
  created() {
    const { class: cls, course: courseCode } = this.$route.params;
    this.$store.dispatch('courses/fetchCourse', { cls, courseCode });
  },
};
</script>
