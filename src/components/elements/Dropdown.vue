<template>
  <div class="relative inline-block text-left" v-click-away="away">
    <slot></slot>
    <slot name="dropdown"></slot>
  </div>
</template>

<script>
import { directive as clickAway } from 'vue-clickaway';

export default {
  name: 'x-dropdown',
  directives: {
    clickAway,
  },
  provide() {
    return {
      dropdown: this,
    };
  },
  props: {
    trigger: {
      type: String,
      default: 'click',
    },
    hideOnClick: {
      type: Boolean,
      default: true,
    },
    placement: {
      type: String,
      default: 'bottom-end',
    },
    tabindex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      visible: false,
      triggerElm: null,
      menuItems: null,
      menuItemsArray: null,
      dropdownElm: null,
      focusing: false,
    };
  },
  mounted() {
    this.$on('menu-item-click', this.handleMenuItemClick);
  },
  watch: {
    visible(val) {
      this.$slots.dropdown[0].child.$emit('visible', val);
      this.$emit('visible-change', val);
    },
  },
  methods: {
    away() {
      if (this.visible) {
        this.hide();
      }
    },
    show() {
      if (this.triggerElm.disabled) return;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.visible = true;
      }, this.trigger === 'click' ? 0 : this.showTimeout);
    },
    hide() {
      if (this.triggerElm.disabled) return;
      this.removeTabindex();
      if (this.tabindex >= 0) {
        this.resetTabindex(this.triggerElm);
      }
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.visible = false;
      }, this.trigger === 'click' ? 0 : this.hideTimeout);
    },
    handleClick() {
      if (this.triggerElm.disabled) return;
      if (this.visible) {
        this.hide();
      } else {
        this.show();
      }
    },
    handleTriggerKeyDown(ev) {
      const { keyCode } = ev;
      if ([38, 40].indexOf(keyCode) > -1) { // up/down
        this.removeTabindex();
        this.resetTabindex(this.menuItems[0]);
        this.menuItems[0].focus();
        ev.preventDefault();
        ev.stopPropagation();
      } else if (keyCode === 13) { // space enter
        this.handleClick();
      } else if ([9, 27].indexOf(keyCode) > -1) { // tab || esc
        this.hide();
      }
    },
    handleItemKeyDown(ev) {
      const { keyCode, target } = ev;
      const currentIndex = this.menuItemsArray.indexOf(target);
      const max = this.menuItemsArray.length - 1;
      let nextIndex;
      if ([38, 40].indexOf(keyCode) > -1) { // up/down
        if (keyCode === 38) { // up
          nextIndex = currentIndex !== 0 ? currentIndex - 1 : 0;
        } else { // down
          nextIndex = currentIndex < max ? currentIndex + 1 : max;
        }
        this.removeTabindex();
        this.resetTabindex(this.menuItems[nextIndex]);
        this.menuItems[nextIndex].focus();
        ev.preventDefault();
        ev.stopPropagation();
      } else if (keyCode === 13) { // enter
        this.triggerElmFocus();
        target.click();
        if (this.hideOnClick) { // click
          this.visible = false;
        }
      } else if ([9, 27].indexOf(keyCode) > -1) { // tab // esc
        this.hide();
        this.triggerElmFocus();
      }
    },
    resetTabindex(ele) {
      this.removeTabindex();
      ele.setAttribute('tabindex', '0');
    },
    removeTabindex() {
      this.triggerElm.setAttribute('tabindex', '-1');
      this.menuItemsArray.forEach((item) => {
        item.setAttribute('tabindex', '-1');
      });
    },
    initAria() {
      this.dropdownElm.setAttribute('id', this.listId);
      this.triggerElm.setAttribute('aria-haspopup', 'list');
      this.triggerElm.setAttribute('aria-controls', this.listId);
      if (!this.splitButton) {
        this.triggerElm.setAttribute('role', 'button');
        this.triggerElm.setAttribute('tabindex', this.tabindex);
        this.triggerElm.setAttribute(
          'class',
          `${this.triggerElm.getAttribute('class') || ''} x-dropdown-selfdefine`,
        );
      }
    },
    initEvent() {
      const {
        trigger, show, hide, handleClick, handleTriggerKeyDown, handleItemKeyDown,
      } = this;
      this.triggerElm = this.$slots.default[0].elm;
      const { dropdownElm } = this;
      this.triggerElm.addEventListener('keydown', handleTriggerKeyDown); // triggerElm keydown
      dropdownElm.addEventListener('keydown', handleItemKeyDown, true); // item keydown


      this.triggerElm.addEventListener('focus', () => {
        this.focusing = true;
      });
      this.triggerElm.addEventListener('blur', () => {
        this.focusing = false;
      });
      this.triggerElm.addEventListener('click', () => {
        this.focusing = false;
      });

      if (trigger === 'hover') {
        this.triggerElm.addEventListener('mouseenter', show);
        this.triggerElm.addEventListener('mouseleave', hide);
        dropdownElm.addEventListener('mouseenter', show);
        dropdownElm.addEventListener('mouseleave', hide);
      } else if (trigger === 'click') {
        this.triggerElm.addEventListener('click', handleClick);
      }
    },
    handleMenuItemClick(command, instance) {
      if (this.hideOnClick) {
        this.visible = false;
      }
      this.$emit('command', command, instance);
    },
    triggerElmFocus() {
      if (this.triggerElm.focus) {
        this.triggerElm.focus();
      }
    },
    initDomOperation() {
      this.menuItemsArray = [].slice.call(this.menuItems);
      this.initEvent();
      this.initAria();
    },
  },
};
</script>
