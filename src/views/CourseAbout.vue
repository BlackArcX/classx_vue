<template>
  <div>
    <h1 class="text-lg leading-6 font-medium text-on-surface py-3 mt-4">About Course</h1>

    <div class="bg-surface shadow overflow-hidden sm:rounded-lg mt-4">
      <div class="px-4 py-5 sm:px-6">
        <dl class="grid grid-cols-1 col-gap-4 row-gap-8 sm:grid-cols-2">
          <div class="sm:col-span-1">
            <dt class="text-sm leading-5 font-semibold text-on-surface-60">
              Course Title
            </dt>
            <dd class="mt-1 text-sm leading-5 text-on-surface-80">
              {{course.title}}
            </dd>
          </div>
          <div class="sm:col-span-1">
            <dt class="text-sm leading-5 font-semibold text-on-surface-60">
              Teacher
            </dt>
            <dd class="mt-1 text-sm leading-5 text-on-surface-80">
              {{course.teacher}}
            </dd>
          </div>
          <div class="sm:col-span-1">
            <dt class="text-sm leading-5 font-semibold text-on-surface-60">
              Credit Code
            </dt>
            <dd class="mt-1 text-sm leading-5 text-on-surface-80">
              {{course.code}}
            </dd>
          </div>
          <div class="sm:col-span-1">
            <dt class="text-sm leading-5 font-semibold text-on-surface-60">
              Credit Hours
            </dt>
            <dd class="mt-1 text-sm leading-5 text-on-surface-80">
              {{course.creditHours}}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const { course: courseCode, class: cls } = this.$route.params;
    return {
      courseCode,
      cls,
    };
  },
  computed: {
    course() {
      return this.$store.getters['courses/courseByCode'](this.cls, this.courseCode) || {};
    },
  },
};
</script>
