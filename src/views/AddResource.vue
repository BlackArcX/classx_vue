<template>
  <Page>
    <div class="bg-surface overflow-hidden shadow rounded-lg mt-8">
      <div class="px-4 py-5 border-b border-border-75 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-on-surface flex items-center">
          Add Resource <small class="ml-4">(Beta Version)</small>
        </h3>
      </div>
      <div class="px-4 py-5 sm:p-6">
        <x-form ref="form" :rules="rules" :model="formData" @submit.prevent.native="saveResource">
          <x-form-item label="Provider" prop="provider">
            <div class="mt-4">
              <x-radio v-model="formData.provider" label="google-drive">
                Google Drive
              </x-radio>
              <x-radio v-model="formData.provider" label="custom">
                Custom Link
              </x-radio>
            </div>
          </x-form-item>

          <template v-if="formData.provider === 'google-drive'">
            <x-form-item label="File Id" prop="driveFileId" :error="error">
              <x-input v-model="formData.driveFileId">
                <x-button slot="append" @click="getDriveFileInfo"
                          type="button" class="rounded-l-none flex-shrink-0" variant="outline">
                  Fetch Info
                </x-button>
              </x-input>
            </x-form-item>

            <template v-if="fileInfo">
              <x-form-item label="File Name" prop="fileName">
                <x-input v-model="formData.fileName"></x-input>
              </x-form-item>

              <x-form-item label="Uploaded By" prop="owner">
                <x-input v-model="formData.owner"></x-input>
              </x-form-item>

              <x-form-item label="Upload Date" prop="date">
                <x-input v-model="formData.date" type="date"></x-input>
              </x-form-item>
            </template>
          </template>

          <template v-if="formData.provider === 'custom'">
            <x-form-item label="Resource Name" prop="fileName">
              <x-input v-model="formData.fileName"></x-input>
            </x-form-item>

            <x-form-item label="Resource Type" prop="ext">
              <x-input v-model="formData.ext" placeholder="i.e., pdf, ppt, doc or link"></x-input>
            </x-form-item>

            <x-form-item label="Download Url" prop="downloadUrl">
              <x-input v-model="formData.downloadUrl" type="url"></x-input>
            </x-form-item>

            <x-form-item label="View Url" prop="viewUrl">
              <x-input v-model="formData.viewUrl" type="url"></x-input>
            </x-form-item>

            <x-form-item label="Uploaded By" prop="owner">
              <x-input v-model="formData.owner"></x-input>
            </x-form-item>

            <x-form-item label="Upload Date" prop="date">
              <x-input v-model="formData.date" type="date"></x-input>
            </x-form-item>
          </template>

          <x-form-item>
            <x-button :loading="loading">
              {{ loading ? 'Saving Resource...' : 'Add Resource' }}
            </x-button>
          </x-form-item>
        </x-form>
      </div>
    </div>
  </Page>
</template>

<script>
import { isSameDay, format } from 'date-fns';
import * as mime from 'mime-types';
import { mapState } from 'vuex';

import { firebaseConfig as config } from '../firebase';
import Form from '../components/elements/Form.vue';
import FormItem from '../components/elements/FormItem.vue';
import Input from '../components/elements/Input.vue';
import Button from '../components/elements/Button.vue';
import Radio from '../components/elements/Radio.vue';

export default {
  components: {
    'x-form': Form,
    'x-form-item': FormItem,
    'x-input': Input,
    'x-button': Button,
    'x-radio': Radio,
  },
  created() {
    window.mime = mime;
  },
  data() {
    const { class: cls, course: courseCode } = this.$route.params;

    return {
      cls,
      courseCode,
      loading: false,
      formData: {
        provider: 'google-drive',
        driveFileId: null,
        fileName: null,
        owner: this.profile?.name,
        date: format(new Date(), 'yyyy-MM-dd'),
        ext: null,
        downloadUrl: null,
        viewUrl: null,
      },
      rules: {
        provider: [
          { required: true, message: 'Please select one of the provider', trigger: 'blur' },
        ],
        driveFileId: [
          { required: true, message: 'Drive file id is required', trigger: 'blur' },
          { len: 33, message: 'Invalid file id must be exactly 33 characters', trigger: 'blur' },
        ],
        fileName: [
          { required: true, message: 'File name is required', trigger: 'blur' },
        ],
        owner: [
          { required: true, message: 'Uploader name is required', trigger: 'blur' },
        ],
        date: [
          { required: true, message: 'Uploader date is required', trigger: 'blur' },
        ],
        ext: [
          { required: true, message: 'File extension is required', trigger: 'blur' },
          {
            trigger: 'blur',
            message: 'Unknown file extension',
            validator: (rule, value) => value === 'link' || !!mime.lookup(value),
          },
        ],
        downloadUrl: [
          { type: 'url' },
          {
            trigger: 'blur',
            message: "Download URL & view URL can't be null together",
            validator: (rule, value) => (!!value || !!this.formData.viewUrl),
          },
        ],
        viewUrl: [
          { type: 'url' },
          {
            trigger: 'blur',
            message: "View URL & download URL can't be null together",
            validator: (rule, value) => (!!value || !!this.formData.downloadUrl),
          },
        ],
      },
      fileInfo: null,
      error: null,
      fetching: false,
    };
  },
  computed: {
    ...mapState('profile', ['profile']),
    resourceInfo() {
      let info = {};
      if (this.formData.provider === 'google-drive') {
        info = {
          driveFileId: this.formData.driveFileId,
          name: this.formData.fileName,
          ext: this.fileInfo?.fileExtension ?? '',
          isHeading: false,
          mimeType: this.fileInfo?.mimeType ?? '',
          uploadedBy: this.formData.owner,
          downloadUrl: this.fileInfo?.webContentLink ?? '',
          viewUrl: this.formData?.alternateLink ?? '',
          size: this.fileInfo?.fileSize ?? '',
          thumbnail: this.fileInfo?.thumbnailLink ?? '',
        };

        if (isSameDay(new Date(this.formData.date), new Date(this.fileInfo?.createdDate))) {
          info.date = new Date(this.fileInfo?.createdDate);
        } else {
          info.date = new Date(this.formData.date);
        }
      } else {
        info = {
          name: this.formData.fileName,
          isHeading: false,
          uploadedBy: this.formData.owner,
          downloadUrl: this.formData.downloadUrl ?? '',
          viewUrl: this.formData.viewUrl ?? '',
          date: new Date(this.formData.date),
          ext: this.formData.ext,
        };

        if (this.formData.ext !== 'link') {
          info.mimeType = mime(this.formData.ext);
        }
      }

      return info;
    },
  },
  methods: {
    async getDriveFileInfo() {
      let validated = false;
      try {
        validated = await this.$refs.form.validate();
      } catch (e) {
        validated = false;
      }
      if (!validated) return;

      let info;
      try {
        this.fetching = true;
        info = await fetch(
          `https://www.googleapis.com/drive/v2/files/${this.formData.driveFileId}?key=${config.apiKey}`,
        );
        info = await info.json();

        if (info.error) {
          throw new Error(info.error.message);
        }

        this.fileInfo = info;
        this.formData.fileName = info.title.split('.').slice(0, -1).join('.');
        [this.formData.owner] = (info.ownerNames || []);
        [this.formData.date] = (info.createdDate || '').split('T');
      } catch (e) {
        this.fetching = false;
        if (e instanceof Error) {
          this.error = e.message;
        } else {
          this.error = e.toString();
        }
      }
    },
    async saveResource() {
      let validated = false;
      try {
        validated = await this.$refs.form.validate();
      } catch (e) {
        validated = false;
      }
      if (!validated) return;

      try {
        this.loading = true;
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
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
  },
  watch: {
    profile() {
      this.formData.owner = this.profile?.name;
    },
  },
};
</script>
