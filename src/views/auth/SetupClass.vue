<template>
  <div class="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center" style="min-height: calc(100vh - 64px);">
    <div class="bg-surface shadow overflow-hidden sm:rounded-md w-full">
      <div class="px-4 py-5 border-b border-border sm:px-6 text-center">
        <h3 class="text-lg leading-6 font-medium text-on-surface">
          Get Started with ClassX
        </h3>
        <p class="mt-1 text-sm leading-5 text-on-surface-60">
          Please enter the following detail to get started
        </p>
      </div>

      <div class="px-4 py-5 sm:p-6">
        <x-form :model="formData" :rules="rules" ref="form" @submit.prevent.native="submit">
          <x-form-item label="Your Name" prop="name">
            <x-input v-model="formData.name" placeholder="i.e., Ali"></x-input>
          </x-form-item>

          <x-form-item label="Your Class" prop="klass">
            <div class="flex flex-col space-y-4 mt-4">
              <div v-if="!classes" class="text-sm text-on-surface-75 text-center">
                Loading related classes...
              </div>
              <template v-else>
                <x-radio v-for="cls in classes" :key="cls.id" :label="cls.id" v-model="formData.klass">
                  {{cls.name}}
                  <span slot="description">{{cls.CR}}</span>
                </x-radio>
              </template>
            </div>
          </x-form-item>

          <x-form-item>
            <div class="flex space-x-4">
              <x-button type="button" @click="back" wide variant="secondary">Back</x-button>
              <x-button wide>Get started</x-button>
            </div>
          </x-form-item>
        </x-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Form from '../../components/elements/Form.vue';
import FormItem from '../../components/elements/FormItem.vue';
import Input from '../../components/elements/Input.vue';
import Button from '../../components/elements/Button.vue';
import Radio from '../../components/elements/Radio.vue';

export default {
  components: {
    'x-form': Form,
    'x-form-item': FormItem,
    'x-input': Input,
    'x-button': Button,
    'x-radio': Radio,
  },
  created() {
    this.$store.dispatch('profile/loadRelatedClasses');
  },
  computed: {
    ...mapState('profile', { classes: 'relatedClasses' }),
  },
  watch: {
    classes() {
      if (this.classes) {
        this.formData.klass = this.classes[0].id;
      }
    },
  },
  data() {
    return {
      formData: {
        name: '',
        klass: '',
      },
      rules: {
        name: [
          { required: true, message: 'Name is required', trigger: 'blur' },
        ],
        klass: [
          { required: true, message: 'Class is required', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    async submit() {
      let validated = false;
      try {
        validated = await this.$refs.form.validate();
      } catch (e) {
        validated = false;
      }
      if (!validated) return;

      this.$store.commit('profile/updateLocalProfile', {
        name: this.formData.name,
        classPath: `/classes/${this.formData.klass}`,
        className: this.classes.find((e) => e.id === this.formData.klass).name,
      });

      await this.$store.dispatch('profile/saveLocalProfile');

      if (this.$route.query.next) {
        await this.$router.push(this.$route.query.next);
      } else {
        await this.$router.push({ name: 'home' });
      }
    },
    back() {
      this.$store.commit('profile/clearLocalProfile', {});
      this.$router.push({ name: 'setup-university', query: this.$route.query });
    },
  },
};
</script>
