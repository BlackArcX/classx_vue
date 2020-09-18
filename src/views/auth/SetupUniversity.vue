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
        <x-form :model="formData" :rules="rules" @submit.native.prevent="submit" ref="form">
          <x-form-item label="Your University">
            <button type="button" class="cursor-default relative w-full rounded-md border border-border bg-surface pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline transition ease-in-out duration-150 sm:text-sm sm:leading-5">
              <div class="flex items-center space-x-3">
                <img src="../../assets/cui_lahore.png" class="flex-shrink-0 h-6 w-6 rounded-full" alt="">
                <span class="block truncate text-on-surface-75">COMSATS, Lahore</span>
              </div>
              <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg class="h-5 w-5 text-on-surface-60" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                  <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </span>
            </button>
          </x-form-item>

          <x-form-item label="Roll Number" prop="rollNumber">
            <x-input v-mask="'AA##-AAA-###'" placeholder="i.e., FA18-BCS-000" v-model="formData.rollNumber"/>
          </x-form-item>

          <x-form-item class="mt-4">
            <x-button wide>
              Next
              <svg class="w-4 h-4 text-on-primary relative" style="right: -.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </x-button>
          </x-form-item>
        </x-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mask } from 'vue-the-mask';
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
  directives: {
    mask,
  },
  data() {
    const programs = 'BAF,BAR,BBA,BCE,BCS,BDE,BEC,BEE,BET,BID,BMC,BPH,BPY,BSE,BSM,BSS,BST,BTE,CHE,EEE,PCH,PCS,PEE,PHM,PMS,PMT,PPC,PPH,PST,R06,RBA,RCH,RCS,REC,REE,REL,RMS,RMT,RPH,RPM,RST';

    return {
      formData: {
        rollNumber: '',
      },
      rules: {
        rollNumber: [
          { required: true, message: 'Roll number is required', trigger: 'blur' },
          {
            trigger: 'blur',
            validator(rule, value, callback) {
              const match = value.match(/(\w{2})(\d{2})-(\w{3})-(\d{3})/i);
              if (!match) {
                callback(new Error('Invalid roll number.'));
              } else if (['SP', 'FA'].indexOf(match[1].toUpperCase()) === -1) {
                callback(new Error(`Invalid roll number. (Batch:${match[1].toUpperCase()}${match[2]})`));
              } else if (+match[2] > +new Date().getUTCFullYear().toString().slice(-2) || +match[2] < 12) {
                callback(new Error(`Invalid roll number. (Batch: ${match[1].toUpperCase()}${match[2]})`));
              } else if (programs.split(',').indexOf(match[3].toUpperCase()) === -1) {
                callback(new Error(`Invalid roll number. (Program: ${match[3].toUpperCase()})`));
              }
              callback();
            },
          },
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
        rollNumber: this.formData.rollNumber,
        uniPath: '/universities/COMSATS@LHR',
        uniName: 'COMSATS Lahore',
      });

      setTimeout(() => {
        this.$router.push({ name: 'setup-class', query: this.$route.query });
      }, 100);
    },
  },
};
</script>
