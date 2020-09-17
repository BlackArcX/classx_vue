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
        <x-form :model="formData" ref="form">
          <x-form-item label="Your Name" prop="name">
            <x-input v-model="formData.name"></x-input>
          </x-form-item>

          <x-form-item label="Your Class" prop="klass">
            <div class="flex flex-col space-y-4 mt-4">
              <x-radio label="fa18-bcs-a" v-model="formData.klass">
                FA18-BCS-A
                <span slot="description">Sharaiz Khan</span>
              </x-radio>
              <x-radio label="fa18-bcs-b" v-model="formData.klass">
                FA18-BCS-B
                <span slot="description">Sharaiz Khan</span>
              </x-radio>
              <x-radio label="fa18-bcs-c" v-model="formData.klass">
                FA18-BCS-C
                <span slot="description">Sharaiz Khan</span>
              </x-radio>
              <x-radio label="fa18-bcs-d" v-model="formData.klass">
                FA18-BCS-D
                <span slot="description">Sharaiz Khan</span>
              </x-radio>
            </div>
          </x-form-item>

          <x-form-item>
            <x-button wide>Get started</x-button>
          </x-form-item>
        </x-form>
      </div>
    </div>
  </div>
</template>

<script>
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
  data() {
    return {
      formData: {
        name: '',
        klass: '',
      },
    };
  },
};
</script>
