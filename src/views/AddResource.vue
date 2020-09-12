<template>
  <Page>
    <div class="bg-surface overflow-hidden shadow rounded-lg mt-8">
      <div class="px-4 py-5 border-b border-border-75 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-on-surface flex items-center">
          Add Resource <small class="ml-4">(Testing Version)</small>
        </h3>
      </div>
      <div class="px-4 py-5 sm:p-6">
        <form @submit.prevent="saveResource">
          <label>Provider:</label>
          <div>
            <input type="radio" name="provider" value="google-drive" id="google-drive" required
                   v-model="formData.provider">
            <label for="google-drive">&nbsp;Google Drive</label>
            <br>
            <input type="radio" name="provider" value="other" id="other" v-model="formData.provider">
            <label for="other">&nbsp;Other</label>
          </div>

          <template v-if="formData.provider === 'google-drive'">
            <label for="driveId">File Id:</label>
            <div>
              <input class="w-full" type="text" id="driveId" required v-model="formData.driveFileId">
              <button class="px-3 py-2" type="button" @click="getDriveFileInfo">Fetch Info</button>
            </div>

            <label for="name">File Name:</label>
            <input type="text" id="name" required v-model="formData.fileName">

            <label for="owner">Created By:</label>
            <input type="text" id="owner" required v-model="formData.owner">

            <label for="date">Created At:</label>
            <input type="date" id="date" required v-model="formData.date">

            <label for="downloadUrl">Download URL:</label>
            <input type="url" id="downloadUrl" required v-model="formData.downloadUrl">

            <label for="viewUrl">View URL:</label>
            <input type="url" id="viewUrl" required v-model="formData.viewUrl">
          </template>

          <div></div>
          <div>
            <input type="submit" class="px-6" value="Save">
          </div>
        </form>
      </div>
    </div>
  </Page>
</template>

<script>
export default {
  data() {
    const { class: cls, course: courseCode } = this.$route.params;

    return {
      cls,
      courseCode,
      formData: {
        provider: 'google-drive',
        driveFileId: null,
        fileName: null,
        owner: null,
        date: new Date().toISOString().split('T')[0],
        downloadUrl: null,
        viewUrl: null,
      },
      fileInfo: null,
      error: null,
      fetching: false,
    };
  },
  computed: {
    resourceInfo() {
      let info = {};
      if (this.formData.provider === 'google-drive') {
        info = {
          driveFileId: this.formData.driveFileId,
          name: this.formData.fileName,
          date: new Date(this.formData.date),
          ext: (this.fileInfo || {}).fileExtension,
          isHeading: false,
          mimeType: (this.fileInfo || {}).mimeType,
          uploadedBy: this.formData.owner,
          downloadUrl: this.formData.downloadUrl,
          viewUrl: this.formData.viewUrl,
          size: (this.fileInfo || {}).fileSize,
          thumbnail: (this.fileInfo || {}).thumbnailLink,
        };
      }

      return info;
    },
  },
  methods: {
    async getDriveFileInfo() {
      let info;
      try {
        this.fetching = true;
        info = await fetch(`https://www.googleapis.com/drive/v2/files/${this.formData.driveFileId}?key=AIzaSyAY4FiU4-Pp8NWbqM-aQZkcV3fm8yM12fw`);
        info = await info.json();
      } catch (e) {
        this.fetching = false;
        this.error = e;
      }

      this.fileInfo = info;
      this.formData.fileName = info.title.split('.').slice(0, -1).join('.');
      [this.formData.owner] = (info.ownerNames || []);
      [this.formData.date] = (info.createdDate || '').split('T');
      this.formData.downloadUrl = info.webContentLink;
      this.formData.viewUrl = info.alternateLink;

      debugger;
    },
    async saveResource() {
      if (this.formData.provider !== 'google-drive') return;
      let { courseId } = this.$store.getters['courses/courseByCode'](this.cls, this.courseCode) || {};
      if (!courseId) {
        await this.$store.dispatch('courses/fetchCourse', { cls: this.cls, courseCode: this.courseCode });
        courseId = (this.$store.getters['courses/courseByCode'](this.cls, this.courseCode) || {}).id;
      }

      await this.$store.dispatch('courses/saveResource', {
        courseId,
        data: this.resourceInfo,
      });

      await this.$router.push({
        name: 'course:resources',
        params: {
          class: this.cls,
          course: this.courseCode,
        },
      });
    },
  },
};
</script>

<style>
form {
  grid-template-columns: 100px 1fr;
  @apply grid gap-4;
}

label {
  @apply text-sm py-2;
}

input {
  @apply rounded border border-border shadow-sm py-2 px-2 text-sm;
}
</style>
