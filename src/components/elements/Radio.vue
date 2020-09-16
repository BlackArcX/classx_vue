<template>
  <div class="flex mt-4 first:mt-0"
       :class="[ $slots.description ? 'items-start' : 'items-center' ]"
       role="radio">
    <input
      ref="radio"
      :value="label"
      type="radio"
      v-model="model"
      @change="handleChange"
      :name="name"
      class="form-radio"
      :disabled="isDisabled"
      :tabindex="tabIndex">
    <label class="ml-3 focus:outline-none flex-1"
           :tabindex="-1"
           @keydown.space.stop.prevent="model = isDisabled ? model : label"
           @click="model = isDisabled ? model : label">
      <span class="block text-sm leading-5 font-medium text-on-surface-75" @keydown.stop>
        <slot>{{label}}</slot>
      </span>
      <span class="text-sm text-on-surface-60" v-if="$slots.description">
        <slot name="description"></slot>
      </span>
    </label>
  </div>
</template>
<script>
import { emitter } from '../../utils';

export default {
  name: 'xRadio',
  mixins: [emitter],
  inject: {
    xForm: {
      default: '',
    },
    xFormItem: {
      default: '',
    },
  },
  componentName: 'xRadio',
  props: {
    value: {},
    label: {},
    disabled: Boolean,
    name: String,
  },
  data() {
    return {
      focus: false,
    };
  },
  computed: {
    isGroup() {
      let parent = this.$parent;
      while (parent) {
        if (parent.$options.componentName !== 'xRadioGroup') {
          parent = parent.$parent;
        } else {
          // eslint-disable-next-line no-underscore-dangle,vue/no-side-effects-in-computed-properties
          this._radioGroup = parent;
          return true;
        }
      }
      return false;
    },
    model: {
      get() {
        // eslint-disable-next-line no-underscore-dangle
        return this.isGroup ? this._radioGroup.value : this.value;
      },
      set(val) {
        if (this.isGroup) {
          this.dispatch('xRadioGroup', 'input', [val]);
        } else {
          this.$emit('input', val);
        }

        if (this.$refs.radio) {
          this.$refs.radio.checked = this.model === this.label;
        }
      },
    },
    isDisabled() {
      return this.isGroup
        // eslint-disable-next-line no-underscore-dangle
        ? this._radioGroup.disabled || this.disabled || (this.xForm || {}).disabled
        : this.disabled || (this.xForm || {}).disabled;
    },
    tabIndex() {
      return (this.isDisabled || (this.isGroup && this.model !== this.label)) ? -1 : 0;
    },
  },
  methods: {
    handleChange() {
      this.$nextTick(() => {
        this.$emit('change', this.model);

        if (this.isGroup) {
          this.dispatch('xRadioGroup', 'handleChange', this.model);
        }
      });
    },
  },
};
</script>

<style scoped>
input[type=radio] {
  @apply h-4 w-4 transition duration-150 ease-in-out text-accent;
}

input[type=radio] {
  background-image: none;
  @apply border-border bg-transparent;
}

input[type=radio]:checked {
  border-width: .35rem;
  border-style: solid;
  @apply border-accent;
}
</style>
