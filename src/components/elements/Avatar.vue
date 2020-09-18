<template>
  <span class="inline-block relative" :style="{
        width: `${this.sizeMap[this.size] || this.size}px`,
        height: `${this.sizeMap[this.size] || this.size}px`,
      }">
    <img v-if="imgUrl" :src="imgUrl" :alt="imgAlt" class="absolute z-20" :class="avatarClasses" :style="avatarStyles"/>
    <span v-if="text" class="inline-flex items-center justify-center absolute z-10" :class="avatarClasses" :style="avatarStyles">
      <span class="font-medium leading-none" :class="'text-' + this.size">{{ text }}</span>
    </span>

    <span class="inline-block overflow-hidden z-0" :class="avatarClasses" :style="avatarStyles">
      <svg class="h-full w-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"/>
      </svg>
    </span>

    <slot name="notification" v-if="notification">
      <span class="absolute block transform rounded-full text-white shadow-solid"
            :class="notificationClasses"
            :style="notificationStyle"></span>
    </slot>
  </span>
</template>

<script>
export default {
  name: 'x-avatar',
  props: {
    type: {
      type: String,
      default: 'circular',
      validator: (val) => ['circular', 'rounded'].indexOf(val) > -1,
    },
    size: {
      type: [String, Number],
      default: 'md',
      validator: (val) => ['xs', 'sm', 'md', 'lg', 'xl'].indexOf(val) > -1
        || typeof (val) === 'number',
    },
    text: {
      type: String,
      default: null,
    },
    imgUrl: {
      type: String,
      default: null,
    },
    imgAlt: {
      type: String,
      default: null,
    },
    background: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: null,
    },
    notification: {
      type: Boolean,
      default: false,
    },
    notificationColor: {
      type: String,
      default: 'bg-green-400',
    },
    notificationPosition: {
      type: String,
      default: 'top-right',
      validator: (val) => ['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(val) > -1,
    },
  },
  data: () => ({
    sizeMap: {
      xs: 24, sm: 32, md: 40, lg: 48, xl: 56,
    },
    typeClassMap: { circular: 'rounded-full', rounded: 'rounded-md' },
    positionClassMap: {
      'top-left': ['top-0', 'left-0', '-translate-y-1/2', '-translate-x-1/2'],
      'top-right': ['top-0', 'right-0', '-translate-y-1/2', 'translate-x-1/2'],
      'bottom-left': ['bottom-0', 'left-0', '-translate-x-1/2'],
      'bottom-right': ['bottom-0', 'right-0', 'translate-x-1/2'],
    },
  }),
  computed: {
    bgColor() {
      return this.background ? this.background : 'bg-surface';
    },
    fgColor() {
      return this.color ? this.color : 'text-on-surface';
    },
    avatarStyles() {
      const styles = {
        width: `${this.sizeMap[this.size] || this.size}px`,
        height: `${this.sizeMap[this.size] || this.size}px`,
      };

      if (this.bgColor.startsWith('#')) styles.backgroundColor = this.bgColor;

      if (this.fgColor.startsWith('#')) styles.color = this.fgColor;

      return styles;
    },
    avatarClasses() {
      const classes = [this.typeClassMap[this.type]];

      if (!this.bgColor.startsWith('#')) classes.push(this.bgColor);

      if (!this.fgColor.startsWith('#')) classes.push(this.fgColor);

      return classes;
    },
    notificationStyle() {
      const styles = {
        width: `${(this.sizeMap[this.size] || this.size) / 4}px`,
        height: `${(this.sizeMap[this.size] || this.size) / 4}px`,
      };
      if (this.notificationColor.startsWith('#')) {
        styles.backgroundColor = this.notificationColor;
      }
      return styles;
    },
    notificationClasses() {
      const classes = [this.positionClassMap[this.notificationPosition]];

      if (!this.notificationColor.startsWith('#')) {
        classes.push(this.notificationColor);
      }
      return classes;
    },
  },
};
</script>
