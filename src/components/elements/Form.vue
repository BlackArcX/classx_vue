<template>
  <form :class="[
    { 'label-top': labelTop },
    { 'form--inline': inline }
  ]">
     <div v-if="hasHeader" class="pb-3 border-b border-border">
      <slot name="header">
        <h3 v-if="$slots.title || title" class="text-lg leading-6 font-medium text-blue-gray-900">
          <slot name="title">{{title}}</slot>
        </h3>
        <p  v-if="$slots.subtitle || subtitle" class="mt-1 text-sm leading-5 text-blue-gray-400">
          <slot name="subtitle">{{subtitle}}</slot>
        </p>
      </slot>
    </div>
    <slot></slot>
    <div class="mt-8 border-t border-gray-200 pt-5" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </form>
</template>

<script>
export default {
  name: 'x-form',
  provide() {
    return {
      xForm: this,
    };
  },
  props: {
    model: Object,
    rules: Object,
    labelTop: {
      type: Boolean,
      default: true,
    },
    labelWidth: String,
    labelSuffix: {
      type: String,
      default: '',
    },
    inline: Boolean,
    inlineMessage: Boolean,
    statusIcon: Boolean,
    showMessage: {
      type: Boolean,
      default: true,
    },
    size: String,
    disabled: Boolean,
    validateOnRuleChange: {
      type: Boolean,
      default: true,
    },
    hideRequiredAsterisk: {
      type: Boolean,
      default: false,
    },
    title: String,
    subtitle: String,
  },
  watch: {
    rules() {
      // remove then add event listeners on form-item after form rules change
      this.fields.forEach((field) => {
        field.removeValidateEvents();
        field.addValidateEvents();
      });
      if (this.validateOnRuleChange) {
        this.validate();
      }
    },
  },
  computed: {
    autoLabelWidth() {
      if (!this.potentialLabelWidthArr.length) return 0;
      const max = Math.max(...this.potentialLabelWidthArr);
      return max ? `${max}px` : '';
    },
    hasHeader() {
      return this.$slots.title || this.title || this.$slots.subtitle || this.subtitle;
    },
  },
  data() {
    return {
      fields: [],
      potentialLabelWidthArr: [], // use this array to calculate auto width
    };
  },
  created() {
    this.$on('x.form.addField', (field) => {
      if (field) {
        this.fields.push(field);
      }
    });
    /* istanbul ignore next */
    this.$on('x.form.removeField', (field) => {
      if (field.prop) {
        this.fields.splice(this.fields.indexOf(field), 1);
      }
    });
  },
  methods: {
    resetFields() {
      if (!this.model) {
        console.warn('[Form]model is required for resetFields to work.');
        return;
      }
      this.fields.forEach((field) => {
        field.resetField();
      });
    },
    clearValidate(props = []) {
      let fields;
      if (props.length) {
        fields = typeof props === 'string'
          ? this.fields.filter((field) => props === field.prop)
          : this.fields.filter((field) => props.indexOf(field.prop) > -1);
      } else {
        fields = this.fields;
      }
      fields.forEach((field) => {
        field.clearValidate();
      });
    },
    validate(cb) {
      let callback = cb;
      if (!this.model) {
        console.warn('Form model is required for validate to work!');
        return false;
      }
      let promise;
      // if no callback, return promise
      if (typeof callback !== 'function' && window.Promise) {
        promise = new window.Promise((resolve, reject) => {
          callback = (valid) => {
            if (valid) {
              resolve(valid);
            } else {
              reject(valid);
            }
          };
        });
      }
      let valid = true;
      let count = 0;
      if (this.fields.length === 0 && callback) {
        callback(true);
      }
      let invalidFields = {};
      this.fields.forEach((field) => {
        // eslint-disable-next-line no-shadow
        field.validate('', (message, field) => {
          if (message) {
            valid = false;
          }
          invalidFields = { ...invalidFields, ...field };
          // eslint-disable-next-line no-plusplus
          if (typeof callback === 'function' && ++count === this.fields.length) {
            callback(valid, invalidFields);
          }
        });
      });
      if (promise) {
        return promise;
      }
      return null;
    },
    validateField(properties, cb) {
      const props = [].concat(properties);
      const fields = this.fields.filter((field) => props.indexOf(field.prop) !== -1);
      if (!fields.length) {
        console.warn('please pass correct props!');
        return;
      }
      fields.forEach((field) => {
        field.validate('', cb);
      });
    },
    getLabelWidthIndex(width) {
      const index = this.potentialLabelWidthArr.indexOf(width);
      // it's impossible
      if (index === -1) {
        throw new Error(`unexpected width ${width}`);
      }
      return index;
    },
    registerLabelWidth(val, oldVal) {
      if (val && oldVal) {
        const index = this.getLabelWidthIndex(oldVal);
        this.potentialLabelWidthArr.splice(index, 1, val);
      } else if (val) {
        this.potentialLabelWidthArr.push(val);
      }
    },
    deregisterLabelWidth(val) {
      const index = this.getLabelWidthIndex(val);
      this.potentialLabelWidthArr.splice(index, 1);
    },
  },
};
</script>

<style>
  .label-top .kMEfp {
    display: block;
  }
</style>
