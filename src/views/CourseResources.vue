<template>
  <div>
    <template v-for="category in Object.entries(resources)">
      <h1 :key="category[0]" class="text-md leading-6 font-medium text-on-surface py-3 mt-4">{{category[0]}}</h1>

      <div class="bg-surface shadow overflow-hidden sm:rounded-md">
        <ul>
          <template v-for="resource in category[1]">
            <li :key="resource.id" class="border-t border-border-75 first:border-t-0">
              <div class="flex items-center px-4 py-4 sm:px-6">
                <div class="flex-shrink-0">
                  <img :src="`/img/file-icons/${iconsMap[resource.ext] || 'file'}.svg`" class="mr-4 w-8">
                </div>
                <div class="min-w-0 flex-1 flex flex-col">
                  <div class="text-sm leading-5 font-medium text-on-surface truncate">
                    {{ resource.name }}
                  </div>
                  <div class="mt-1 text-sm leading-5 text-on-surface-60 truncate">
                    {{ formatDistance(resource.date.toDate()) }} ago
                  </div>
                </div>
                <div class="flex">
                  <a v-if="resource.openUrl || resource.driveFileId"
                     target="_blank" class="text-on-surface-60 hover:text-on-surface"
                     :href="resource.openUrl || `https://drive.google.com/file/d/${resource.driveFileId}/view`">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </a>
                  <a v-if="resource.downloadUrl || resource.driveFileId"
                     target="_blank" class="ml-4 text-on-surface-60 hover:text-on-surface"
                     :href="resource.downloadUrl || `https://drive.google.com/u/0/uc?id=${resource.driveFileId}&export=download`">
                    <svg class="h-5 w-5" fill="none" stroke-linecap="round" stroke-linejoin="round"
                         stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                  </a>
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
      iconsMap: {
        doc: 'doc',
        docx: 'doc',
        jpg: 'img',
        jpeg: 'img',
        png: 'img',
        ppt: 'ppt',
        pptx: 'ppt',
        pdf: 'pdf',
        rtf: 'doc',
        xls: 'xls',
        xlsx: 'xls',
        zip: 'zip',
      },
    };
  },
  computed: {
    resources() {
      return this.$store.getters['courses/resourcesByCourseCode'](this.cls, this.courseCode) || {};
    },
  },
  created() {
    this.$store.dispatch('courses/watchResources', {
      cls: this.cls,
      courseCode: this.courseCode,
    });
  },
  beforeDestroy() {
    const { id } = this.$store.getters['courses/courseByCode'](this.cls, this.courseCode) || {};
    this.$store.commit('courses/unwatchResources', id);
  },
};
</script>
