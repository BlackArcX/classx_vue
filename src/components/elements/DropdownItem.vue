<template>
  <div>
    <button :class="itemClasses" @click="handleClick"
            :aria-disabled="disabled" :tabindex="disabled ? null : -1">
      <span v-if="$slots.icon" :class="iconClasses">
        <slot name="icon"></slot>
      </span>
      <slot></slot>
    </button>

    <div v-if="divided" class="divider bg-border"></div>
  </div>
</template>

<script>
import { emitter } from '../../utils';

export default {
  name: 'x-dropdown-item',
  mixins: [emitter],
  props: {
    disabled: Boolean,
    divided: Boolean,
    icon: String,
  },
  methods: {
    handleClick(e) {
      if (!this.disabled) this.$emit('click', e);
      this.dispatch('x-dropdown', 'menu-item-click', [this.command, this]);
    },
  },
  computed: {
    itemClasses() {
      return [
        'group flex px-4 py-2 w-full text-sm text-left leading-5 focus:outline-none',
        this.disabled
          ? 'text-on-surface-disabled cursor-default'
          : 'text-on-surface-75 hover:bg-surface-dark hover:text-on-surface-80 focus:bg-surface-dark focus:text-on-surface-80',
      ];
    },
    iconClasses() {
      return [
        'mr-3',
        this.disabled
          ? 'text-on-surface-disabled'
          : 'text-on-surface-60 group-hover:text-on-surface-75 group-focus:text-on-surface-75',
      ];
    },
  },
};
</script>

<style scoped>
  .divider {
    height: 1px;
    width: 100%;
    margin: 2px 0;
  }
</style>
