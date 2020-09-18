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
        <x-form ref="form" :model="formData" @submit.native.prevent="submit">

          <template v-if="isSignIn">
            <x-form-item label="Your Email" prop="email">
              <x-input v-model="formData.email" type="email" autocomplete="email"></x-input>
            </x-form-item>

            <x-form-item label="Your Password" prop="password">
              <x-input v-model="formData.password" type="password" autocomplete="current-password"></x-input>
            </x-form-item>
          </template>

          <template v-else>
            <x-form-item label="Your Email" prop="email">
              <x-input v-model="formData.email" type="email" autocomplete="email"></x-input>
            </x-form-item>

            <x-form-item :label="isSignIn ? 'Your Password' : 'New Password'" prop="password">
              <x-input v-model="formData.password" type="password" autocomplete="new-password"></x-input>
            </x-form-item>

            <x-form-item v-if="!isSignIn" label="Confirm Password" prop="password2">
              <x-input v-model="formData.password2" type="password" autocomplete="new-password"></x-input>
            </x-form-item>
          </template>

          <x-form-item>
            <div class="mb-4">
              <p class="text-sm text-error-fg mb-2" v-if="apiError">{{apiError}}</p>

              <p class="text-sm text-on-surface-80 flex justify-between">
                <router-link :to="{ name: isSignIn ? 'auth-signup' : 'auth-login' }"
                   class="hover:underline cursor-pointer">
                  {{isSignIn ? 'Don\'t have account?' : 'Already have account?'}}
                </router-link>

                <router-link :to="{ name: 'auth-forget-pass' }" v-if="isSignIn"
                             class="hover:underline cursor-pointer">
                  Forget Password?
                </router-link>
              </p>
            </div>
            <x-button wide :loading="emailBtnLoading">
              {{
                emailBtnLoading
                ? isSignIn ? 'Logging in...' : 'Signing up...'
                : isSignIn ? 'Login with Email' : 'Sign up with Email'
              }}
            </x-button>
          </x-form-item>
        </x-form>

        <div class="w-full border-b border-border my-4"></div>

        <x-button wide :loading="googleBtnLoading" style="background: #3981f3;"
                  class="relative" @click="signInWithGoogle">
          <div class="h-6 w-6 rounded p-1 bg-white absolute" style="left: 6px">
            <img alt="" class="h-full" src="https://developers.google.com/identity/images/g-logo.png">
          </div>

          {{
            googleBtnLoading
            ? isSignIn ? 'Logging in...' : 'Signing up...'
            : isSignIn ? 'Login with Google' : 'Sign up with Google'
          }}
        </x-button>
      </div>
    </div>
  </div>
</template>

<script>
import Form from '../../components/elements/Form.vue';
import FormItem from '../../components/elements/FormItem.vue';
import Input from '../../components/elements/Input.vue';
import Button from '../../components/elements/Button.vue';
import { auth, googleAuthProvider } from '../../firebase';

export default {
  components: {
    'x-form': Form,
    'x-form-item': FormItem,
    'x-input': Input,
    'x-button': Button,
  },
  props: {
    isSignIn: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      formData: {
        email: '',
        password: '',
        password2: '',
      },
      rules: {
        email: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur' }],
        password2: [{
          required: true,
          trigger: 'blur',
          validator: (rule, value) => value === this.formData.password,
        }],
      },
      emailBtnLoading: false,
      googleBtnLoading: false,
      apiError: null,
    };
  },
  methods: {
    async signInWithGoogle() {
      this.googleBtnLoading = true;
      try {
        await auth.signInWithPopup(googleAuthProvider);
        if (this.$route.query.next) {
          await this.$router.push(this.$route.query.next);
        } else {
          await this.$router.push({ name: 'home' });
        }
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
        this.googleBtnLoading = false;
      }
    },
    async submit() {
      this.apiError = null;
      let validated = false;
      try {
        validated = await this.$refs.form.validate();
      } catch (e) {
        validated = false;
      }
      if (!validated) return;

      this.emailBtnLoading = true;

      try {
        if (this.isSignIn) {
          await auth.signInWithEmailAndPassword(this.formData.email, this.formData.password);
        } else {
          await auth.createUserWithEmailAndPassword(this.formData.email, this.formData.password);
        }

        if (this.$route.query.next) {
          await this.$router.push(this.$route.query.next);
        } else {
          await this.$router.push({ name: 'home' });
        }
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
        console.log(error);
      } finally {
        this.emailBtnLoading = false;
      }
    },
  },
};
</script>
