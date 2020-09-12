<template>
  <div :class="[
      'relative shadow-sm flex x-input',
      {
        'is-disabled': inputDisabled,
        'is-exceed': inputExceed,
        'input-group--append': $slots.append,
        'input-group--prepend': $slots.prepend,
        'input--prefix': $slots.prefix,
        'input--suffix': $slots.suffix || clearable || showPassword || isWordLimitVisible
      },
    ]"
       @mouseenter="hovering = true"
       @mouseleave="hovering = false"
  >
    <template v-if="type !== 'textarea'">
      <div v-if="$slots.prepend"
           class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-blue-gray-100 bg-blue-gray-50 text-blue-gray-500 sm:text-sm">
        <slot name="prepend"></slot>
      </div>
      <div class="relative inline-block w-full">
        <input :tabindex="tabindex"
               v-if="type !== 'textarea'"
               :class="inputClasses"
               v-bind="$attrs"
               :type="showPassword ? (passwordVisible ? 'text': 'password') : type"
               :disabled="inputDisabled"
               :readonly="readonly"
               ref="input"
               @input="handleInput"
               @focus="handleFocus"
               @blur="handleBlur"
               @change="handleChange"
               :aria-label="label"
        >
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center" v-if="$slots.prefix">
            <slot name="prefix"></slot>
        </span>
        <span class="absolute inset-y-0 right-0 pr-3 flex items-center"
              v-if="getSuffixVisible()">
        <template class="pointer-events-none" v-if="!showClear || !showPwdVisible || !isWordLimitVisible">
          <slot name="suffix"></slot>
        </template>
        <button type="button" class="focus:outline-none" v-if="showClear" @click="clear" @mousedown.prevent>
          <svg class="h-5 w-5 text-blue-gray-400" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
               stroke="currentColor" viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <button type="button" class="focus:outline-none" v-if="showPwdVisible" @click="handlePasswordVisible">
          <svg v-if="passwordVisible" class="h-5 w-5 text-blue-gray-400" fill="none" stroke-linecap="round"
               stroke-linejoin="round"
               stroke-width="2" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
          </svg>
          <svg v-else class="h-5 w-5 text-blue-gray-400" fill="none" stroke-linecap="round"
               stroke-linejoin="round"
               stroke-width="2" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
        </button>
        <span v-if="isWordLimitVisible" class="text-xs text-blue-gray-400 pointer-events-none">
          {{ textLength }}/{{ upperLimit }}
        </span>
      </span>
      </div>
      <div v-if="$slots.append" class="inline-flex items-center px-3 rounded-r-md border border-l-0 border-blue-gray-100 bg-blue-gray-50 text-blue-gray-500 sm:text-sm">
        <slot name="append"></slot>
      </div>
    </template>
    <textarea
      v-else
      :tabindex="tabindex"
      :class="[inputClasses, 'pb-4']"
      @input="handleInput"
      ref="textarea"
      v-bind="$attrs"
      :disabled="inputDisabled"
      :readonly="readonly"
      :style="textareaStyle"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      :aria-label="label"
    ></textarea>
    <span v-if="isWordLimitVisible && type === 'textarea'"
          class="absolute bottom-0 right-0 pr-2 text-xs text-blue-gray-400">
      {{ textLength }}/{{ upperLimit }}
    </span>
  </div>
</template>

<script>
import { calcTextareaHeight, emitter } from '../utils';

export default {
  name: 'x-input',
  mixins: [emitter],
  inheritAttrs: false,
  inject: {
    xForm: {
      default: '',
    },
    xFormItem: {
      default: '',
    },
  },
  data() {
    return {
      textareaCalcStyle: {},
      hovering: false,
      focused: false,
      isComposing: false,
      passwordVisible: false,
    };
  },
  props: {
    value: [String, Number],
    size: String,
    resize: String,
    form: String,
    disabled: Boolean,
    readonly: Boolean,
    type: {
      type: String,
      default: 'text',
    },
    autosize: {
      type: [Boolean, Object],
      default: false,
    },
    validateEvent: {
      type: Boolean,
      default: true,
    },
    label: String,
    clearable: {
      type: Boolean,
      default: false,
    },
    showPassword: {
      type: Boolean,
      default: false,
    },
    showWordLimit: {
      type: Boolean,
      default: false,
    },
    tabindex: String,
    inputClass: String,
  },
  computed: {
    inputClasses() {
      return [
        this.$slots['leading-icon'] ? 'leading-icon' : '',
        this.$slots['trailing-icon'] ? 'trailing-icon' : '',
        'block w-full border-blue-gray-100 focus:border-blue-gray-300 sm:text-sm sm:leading-5 text-blue-gray-800',
        'focus:shadow-outline-blue-gray font-normal text-sm form-input transition duration-100',
        this.inputClass,
      ];
    },
    elFormItemSize() {
      return (this.xFormItem || {}).xFormItemSize;
    },
    validateState() {
      return this.xFormItem ? this.xFormItem.validateState : '';
    },
    needStatusIcon() {
      return this.xForm ? this.xForm.statusIcon : false;
    },
    textareaStyle() {
      return { ...this.textareaCalcStyle, resize: this.resize };
    },
    inputDisabled() {
      return this.disabled || (this.xForm || {}).disabled;
    },
    nativeInputValue() {
      return this.value === null || this.value === undefined ? '' : String(this.value);
    },
    showClear() {
      return this.clearable
        && !this.inputDisabled
        && !this.readonly
        && this.nativeInputValue
        && (this.focused || this.hovering);
    },
    showPwdVisible() {
      return this.showPassword
        && !this.inputDisabled
        && !this.readonly
        && (!!this.nativeInputValue || this.focused);
    },
    isWordLimitVisible() {
      return this.showWordLimit
        && this.$attrs.maxlength
        && (this.type === 'text' || this.type === 'textarea')
        && !this.inputDisabled
        && !this.readonly
        && !this.showPassword;
    },
    upperLimit() {
      return this.$attrs.maxlength;
    },
    textLength() {
      if (typeof this.value === 'number') {
        return String(this.value).length;
      }
      return (this.value || '').length;
    },
    inputExceed() {
      // show exceed style if length of initial value greater then maxlength
      return this.isWordLimitVisible
        && (this.textLength > this.upperLimit);
    },
  },
  watch: {
    value(val) {
      this.$nextTick(this.resizeTextarea);
      if (this.validateEvent) {
        this.dispatch('x-form-item', 'x.form.change', [val]);
      }
    },
    nativeInputValue() {
      this.setNativeInputValue();
    },
    type() {
      this.$nextTick(() => {
        this.setNativeInputValue();
        this.resizeTextarea();
        this.updateIconOffset();
      });
    },
  },
  methods: {
    focus() {
      this.getInput().focus();
    },
    blur() {
      this.getInput().blur();
    },
    handleBlur(event) {
      this.focused = false;
      this.$emit('blur', event);
      if (this.validateEvent) {
        this.dispatch('x-form-item', 'x.form.blur', [this.value]);
      }
    },
    select() {
      this.getInput().select();
    },
    resizeTextarea() {
      if (this.$isServer) return;
      const { autosize, type } = this;
      if (type !== 'textarea') return;
      if (!autosize) {
        this.textareaCalcStyle = {
          minHeight: calcTextareaHeight(this.$refs.textarea).minHeight,
        };
        return;
      }
      const { minRows } = autosize;
      const { maxRows } = autosize;
      this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
    },
    setNativeInputValue() {
      const input = this.getInput();
      if (!input) return;
      if (input.value === this.nativeInputValue) return;
      input.value = this.nativeInputValue;
    },
    handleFocus(event) {
      this.focused = true;
      this.$emit('focus', event);
    },
    handleInput(event) {
      if (this.isComposing) return;
      if (event.target.value === this.nativeInputValue) return;
      this.$emit('input', event.target.value);
      this.$nextTick(this.setNativeInputValue);
    },
    handleChange(event) {
      this.$emit('change', event.target.value);
    },
    calcIconOffset(place) {
      const elList = [].slice.call(this.$el.querySelectorAll(`.x-input__${place}`) || []);
      if (!elList.length) return;
      let el = null;
      for (let i = 0; i < elList.length; i += 1) {
        if (elList[i].parentNode === this.$el) {
          el = elList[i];
          break;
        }
      }
      if (!el) return;
      const pendantMap = {
        suffix: 'append',
        prefix: 'prepend',
      };
      const pendant = pendantMap[place];
      if (this.$slots[pendant]) {
        const width = this.$el.querySelector(`.x-input-group__${pendant}`).offsetWidth;
        el.style.transform = `translateX(${place === 'suffix' ? '-' : ''}${width}px)`;
      } else {
        el.removeAttribute('style');
      }
    },
    updateIconOffset() {
      this.calcIconOffset('prefix');
      this.calcIconOffset('suffix');
    },
    clear() {
      this.$emit('input', '');
      this.$emit('change', '');
      this.$emit('clear');
    },
    handlePasswordVisible() {
      this.passwordVisible = !this.passwordVisible;
      this.focus();
    },
    getInput() {
      return this.$refs.input || this.$refs.textarea;
    },
    getSuffixVisible() {
      return this.$slots.suffix
        || this.showClear
        || this.showPassword
        || this.isWordLimitVisible
        || (this.validateState && this.needStatusIcon);
    },
  },
  created() {
    this.$on('inputSelect', this.select);
  },
  mounted() {
    this.setNativeInputValue();
    this.resizeTextarea();
    this.updateIconOffset();
  },
  updated() {
    this.$nextTick(this.updateIconOffset);
  },
};
</script>

<style scoped>
.input--prefix input {
  @apply pl-10;
}

.input--suffix input {
  @apply pr-10;
}

.input-group--prepend input {
  @apply rounded-l-none;
}

.input-group--append input {
  @apply rounded-r-none;
}

.x-input:focus-within,
input:focus {
  z-index: 1;
}
</style>
