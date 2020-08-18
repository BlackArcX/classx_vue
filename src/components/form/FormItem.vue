<template>
  <div class="kMEfp sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start pt-5 first:pt-0" :class="[{
      'el-form-item--feedback': twForm && twForm.statusIcon,
      'is-error': validateState === 'error',
      'is-validating': validateState === 'validating',
      'is-success': validateState === 'success',
      'is-required': isRequired || required,
      'is-no-asterisk': twForm && twForm.hideRequiredAsterisk
    },
    sizeClass ? 'el-form-item--' + sizeClass : ''
  ]">
    <label-wrap
      :is-auto-width="labelStyle && labelStyle.width === 'auto'"
      :update-all="form.labelWidth === 'auto'">
      <label :for="labelFor" class="block text-sm font-medium leading-5 text-blue-gray-500 sm:mt-px"
             :style="labelStyle" v-if="label || $slots.label" :class="{ 'sm:pt-2 mb-1': !$slots.label }">
        <slot name="label">{{label + twForm.labelSuffix}}</slot>
        <span v-if="required" class="text-orange-500 pl-1" style="font-family: monospace;">*</span>
      </label>
    </label-wrap>
    <div class="sm:col-span-2" :style="contentStyle">
      <slot></slot>
      <transition name="el-zoom-in-top">
        <slot
          v-if="validateState === 'error' && showMessage && form.showMessage"
          name="error"
          :error="validateMessage">
          <div
            class="mt-2 text-sm text-red-600"
            :class="{
              'el-form-item__error--inline': typeof inlineMessage === 'boolean'
                ? inlineMessage
                : (twForm && twForm.inlineMessage || false)
            }"
          >
            {{validateMessage}}
          </div>
        </slot>
      </transition>
    </div>
  </div>
</template>
<script>
import AsyncValidator from 'async-validator';
import { emitter, getPropByPath } from '../utils';
import LabelWrap from './LabelWrap.vue';

export default {
  name: 'tw-form-item',
  mixins: [emitter],
  provide() {
    return {
      twFormItem: this,
    };
  },
  inject: ['twForm'],
  props: {
    label: String,
    labelWidth: String,
    prop: String,
    required: {
      type: Boolean,
      default: undefined,
    },
    rules: [Object, Array],
    error: String,
    validateStatus: String,
    for: String,
    inlineMessage: {
      type: [String, Boolean],
      default: '',
    },
    showMessage: {
      type: Boolean,
      default: true,
    },
    size: String,
  },
  components: {
    LabelWrap,
  },
  watch: {
    error: {
      immediate: true,
      handler(value) {
        this.validateMessage = value;
        this.validateState = value ? 'error' : '';
      },
    },
    validateStatus(value) {
      this.validateState = value;
    },
  },
  computed: {
    labelFor() {
      return this.for || this.prop;
    },
    labelStyle() {
      const ret = {};
      if (this.form.labelPosition === 'top') return ret;
      const labelWidth = this.labelWidth || this.form.labelWidth;
      if (labelWidth) {
        ret.width = labelWidth;
      }
      return ret;
    },
    contentStyle() {
      const ret = {};
      const { label } = this;
      if (this.form.labelPosition === 'top' || this.form.inline) return ret;
      if (!label && !this.labelWidth && this.isNested) return ret;
      const labelWidth = this.labelWidth || this.form.labelWidth;
      if (labelWidth === 'auto') {
        if (this.labelWidth === 'auto') {
          ret.marginLeft = this.computedLabelWidth;
        } else if (this.form.labelWidth === 'auto') {
          ret.marginLeft = this.twForm.autoLabelWidth;
        }
      } else {
        ret.marginLeft = labelWidth;
      }
      return ret;
    },
    form() {
      let parent = this.$parent;
      let parentName = parent.$options.name;
      while (parentName !== 'tw-form') {
        if (parentName === 'tw-form-item') {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.isNested = true;
        }
        parent = parent.$parent;
        parentName = parent.$options.name;
      }
      return parent;
    },
    fieldValue() {
      const { model } = this.form;
      if (!model || !this.prop) { return null; }
      let path = this.prop;
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.');
      }
      return getPropByPath(model, path, true).v;
    },
    isRequired() {
      const rules = this.getRules();
      let isRequired = false;
      if (rules && rules.length) {
        rules.every((rule) => {
          if (rule.required) {
            isRequired = true;
            return false;
          }
          return true;
        });
      }
      return isRequired;
    },
    formSize() {
      return this.twForm.size;
    },
    twFormItemSize() {
      return this.size || this.formSize;
    },
    sizeClass() {
      return this.twFormItemSize || (this.$ELEMENT || {}).size;
    },
  },
  data() {
    return {
      validateState: '',
      validateMessage: '',
      validateDisabled: false,
      validator: {},
      isNested: false,
      computedLabelWidth: '',
    };
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    validate(trigger, callback = () => {}) {
      this.validateDisabled = false;
      const rules = this.getFilteredRule(trigger);
      if ((!rules || rules.length === 0) && this.required === undefined) {
        callback();
        return true;
      }
      this.validateState = 'validating';
      const descriptor = {};
      if (rules && rules.length > 0) {
        rules.forEach((rule) => {
          // eslint-disable-next-line no-param-reassign
          delete rule.trigger;
        });
      }
      descriptor[this.prop] = rules;
      const validator = new AsyncValidator(descriptor);
      const model = {};
      model[this.prop] = this.fieldValue;
      validator.validate(model, { firstFields: true }, (errors, invalidFields) => {
        this.validateState = !errors ? 'success' : 'error';
        this.validateMessage = errors ? errors[0].message : '';
        callback(this.validateMessage, invalidFields);
        if (this.twForm) {
          this.twForm.$emit('validate', this.prop, !errors, this.validateMessage || null);
        }
      });
      return true;
    },
    clearValidate() {
      this.validateState = '';
      this.validateMessage = '';
      this.validateDisabled = false;
    },
    resetField() {
      this.validateState = '';
      this.validateMessage = '';
      const { model } = this.form;
      const value = this.fieldValue;
      let path = this.prop;
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.');
      }
      const prop = getPropByPath(model, path, true);
      this.validateDisabled = true;
      if (Array.isArray(value)) {
        prop.o[prop.k] = [].concat(this.initialValue);
      } else {
        prop.o[prop.k] = this.initialValue;
      }
      // reset validateDisabled after onFieldChange triggered
      this.$nextTick(() => {
        this.validateDisabled = false;
      });
      this.broadcast('ElTimeSelect', 'fieldReset', this.initialValue);
    },
    getRules() {
      let formRules = this.form.rules;
      const selfRules = this.rules;
      const requiredRule = this.required !== undefined ? { required: !!this.required } : [];
      const prop = getPropByPath(formRules, this.prop || '');
      formRules = formRules ? (prop.o[this.prop || ''] || prop.v) : [];
      return [].concat(selfRules || formRules || []).concat(requiredRule);
    },
    getFilteredRule(trigger) {
      const rules = this.getRules();
      return rules.filter((rule) => {
        if (!rule.trigger || trigger === '') return true;
        if (Array.isArray(rule.trigger)) {
          return rule.trigger.indexOf(trigger) > -1;
        }
        return rule.trigger === trigger;
      }).map((rule) => ({ ...rule }));
    },
    onFieldBlur() {
      this.validate('blur');
    },
    onFieldChange() {
      if (this.validateDisabled) {
        this.validateDisabled = false;
        return;
      }
      this.validate('change');
    },
    updateComputedLabelWidth(width) {
      this.computedLabelWidth = width ? `${width}px` : '';
    },
    addValidateEvents() {
      const rules = this.getRules();
      if (rules.length || this.required !== undefined) {
        this.$on('tw.form.blur', this.onFieldBlur);
        this.$on('tw.form.change', this.onFieldChange);
      }
    },
    removeValidateEvents() {
      this.$off();
    },
  },
  mounted() {
    if (this.prop) {
      this.dispatch('tw-form', 'tw.form.addField', [this]);
      let initialValue = this.fieldValue;
      if (Array.isArray(initialValue)) {
        initialValue = [].concat(initialValue);
      }
      Object.defineProperty(this, 'initialValue', {
        value: initialValue,
      });
      this.addValidateEvents();
    }
  },
  beforeDestroy() {
    this.dispatch('tw-form', 'tw.form.removeField', [this]);
  },
};
</script>

<style>
  .is-error input {
    @apply border-red-300 text-red-900;
  }

  .is-error input:focus {
    @apply shadow-outline-red border-red-300;
  }
</style>
