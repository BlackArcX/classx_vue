<template>
  <div class="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center" style="min-height: calc(100vh - 64px);">
    <div class="bg-surface shadow overflow-hidden sm:rounded-md w-full">
      <div class="px-4 py-5 border-b border-border sm:px-6 text-center">
        <h3 class="text-lg leading-6 font-medium text-on-surface">
          Forget Password
        </h3>
        <p class="mt-1 text-sm leading-5 text-on-surface-60">
          Password reset link will be sent to your email
        </p>
      </div>

      <div class="px-4 py-5 sm:p-6">
        <x-form v-if="!emailSent" ref="form" :model="formData" :rules="rules" @submit.native.prevent="submit">
          <x-form-item label="Your Email" prop="email">
            <x-input type="email" v-model="formData.email" placeholder="i.e., example@mail.com"></x-input>
          </x-form-item>

          <x-form-item>
            <div class="mb-4">
              <p class="text-sm text-error-fg mb-2" v-if="apiError">{{apiError}}</p>
            </div>
            <x-button :loading="loading" wide>
              {{ loading ? 'Sending...' : 'Send reset password email' }}
            </x-button>
          </x-form-item>
        </x-form>

        <div v-else>
          <p class="text-center text-sm text-on-surface mt-10 mb-8 px-8">
            Password reset link has been sent to you via email.<br>
            Now you can close this tab.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from '../../firebase';

import Form from '../../components/elements/Form.vue';
import FormItem from '../../components/elements/FormItem.vue';
import Input from '../../components/elements/Input.vue';
import Button from '../../components/elements/Button.vue';

export default {
  components: {
    'x-form': Form,
    'x-form-item': FormItem,
    'x-input': Input,
    'x-button': Button,
  },
  data() {
    return {
      formData: {
        email: '',
      },
      rules: {
        email: [
          { type: 'email', required: true, trigger: 'blur' },
        ],
      },
      emailSent: false,
      loading: false,
      apiError: null,
    };
  },
  methods: {
    async submit() {
      this.apiError = null;
      let validated = false;
      try {
        validated = await this.$refs.form.validate();
      } catch (e) {
        validated = false;
      }
      if (!validated) return;

      this.loading = true;

      try {
        await auth.sendPasswordResetEmail(this.formData.email);
        this.emailSent = true;
      } catch (e) {
        let error = e;
        if (typeof e.toJSON === 'function') {
          error = e.toJSON();
        }
        if (typeof e.message === 'string') {
          try {
            error = { ...error, message: JSON.parse(e.message) };
            // eslint-disable-next-line no-empty
          } catch (_) {}
        }

        if (typeof error.message === 'string') {
          this.apiError = error.message;
        } else if (error.code === 'auth/internal-error') {
          this.apiError = 'An internal server error occurred. Please try again later.';
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
