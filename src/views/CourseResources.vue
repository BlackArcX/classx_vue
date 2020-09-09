<template>
  <div>
    <div>Resources</div>
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
