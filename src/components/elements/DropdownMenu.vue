<template>
  <transition :duration="{ enter: 200, leave: 75 }"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95">
    <div :class="menuClasses" v-show="show">
      <div class="rounded-md bg-surface shadow-xs" ref="dropdown">
        <div class="py-1">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'x-dropdown-menu',
  inject: ['dropdown'],
  props: {
    position: {
      type: String,
      default: 'bottom-left',
      validator: (val) => ['bottom-left', 'top-left', 'bottom-right', 'top-right'].indexOf(val) > -1,
    },
  },
  data() {
    return {
      show: false,
      positionClassMap: {
        'bottom-left': 'top-full left-0 mt-2 origin-top-left',
        'bottom-right': 'top-full right-0 mt-2 origin-top-right',
        'top-left': 'bottom-full left-0 mb-2 origin-bottom-left',
        'top-right': 'bottom-full right-0 mb-2 origin-bottom-right',
      },
    };
  },
  computed: {
    menuClasses() {
      return [
        this.positionClassMap[this.position],
        'transform transition duration-200 absolute w-56 rounded-md shadow-lg',
      ];
    },
  },
  created() {
    this.$on('visible', (val) => {
      this.show = val;
    });
  },
  mounted() {
    this.dropdown.menuItems = this.$slots.default.map((e) => e.elm);
    this.dropdown.dropdownElm = this.$refs.dropdown;
    this.dropdown.initDomOperation();
  },
};
</script>

<style scoped>
  .top-full {
    top: 100%
  }

  .bottom-full {
    bottom: 100%
  }
</style>
