<template>
  <button :class="buttonClasses" @click="onClick">
    <slot name="leading-icon" :class="leadingIconClassList[size]"></slot>
    <span class="flex items-center"><slot></slot></span>
    <slot name="trailing-icon" :class="trailingIconClassList[size]"></slot>
  </button>
</template>

<script>
export default {
  name: 'x-button',
  props: {
    loading: Boolean,
    size: {
      type: String,
      default: 'md',
      validator: (val) => ['xs', 'sm', 'md', 'lg', 'xl'].indexOf(val) > -1,
    },
    variant: {
      type: String,
      default: 'primary',
      validator: (val) => ['primary', 'secondary', 'white', 'dark', 'danger', 'outline', 'outline-dark'].indexOf(val) > -1,
    },
    wide: Boolean,
  },
  data() {
    return {
      defaultClassList: [
        'transition', 'ease-in-out', 'duration-150', 'font-medium', 'inline-flex', 'items-center',
        'focus:z-10',
      ],
      variantClassList: {
        primary: [
          'border border-transparent text-white bg-primary hover:bg-primary focus:outline-none',
          'focus:border-blue-gray-900 focus:shadow-outline active:bg-primary-light',
        ],
        secondary: [
          'border border-transparent text-on-surface-75 bg-background focus:outline-none',
          'focus:border-border-dark focus:shadow-outline active:bg-blue-gray-200',
        ],
        white: [
          'border border-border text-on-primary bg-white hover:text-gray-600 focus:outline-none',
          'focus:border-blue-300 focus:shadow-outline active:text-gray-800 active:bg-gray-50',
        ],
        dark: [
          'border border-transparent text-white bg-gray-600 hover:bg-gray-500 focus:outline-none',
          'focus:shadow-outline focus:border-gray-700 active:bg-gray-700',
        ],
        danger: [
          'border border-transparent text-red-700 bg-red-100 hover:bg-red-50 focus:outline-none',
          'focus:border-red-300 focus:shadow-outline-red active:bg-red-200',
        ],
        outline: [
          'border border-border text-on-surface-75 bg-transparent focus:outline-none',
          'focus:shadow-outline',
        ],
        'outline-dark': [
          'border-2 border-border-dark text-on-surface-75 bg-transparent focus:outline-none',
          'focus:shadow-outline',
        ],
      },
      sizeClassList: {
        xs: ['px-2', 'py-1', 'text-xs', 'leading-4', 'rounded'],
        sm: ['px-3', 'py-2', 'text-sm', 'leading-4', 'rounded-md'],
        md: ['px-4', 'py-2', 'text-sm', 'leading-5', 'rounded-md'],
        lg: ['px-4', 'py-2', 'text-base', 'leading-6', 'rounded-md'],
        xl: ['px-6', 'py-3', 'text-base', 'leading-6', 'rounded-md'],
      },
      leadingIconClassList: {
        xs: ['-ml-1', 'mr-2', 'h-4', 'w-4'],
        sm: ['-ml-1', 'mr-2', 'h-4', 'w-4'],
        md: ['-ml-1', 'mr-2', 'h-5 w-5'],
        lg: ['-ml-1', 'mr-3', 'h-5 w-5'],
        xl: ['-ml-1', 'mr-3', 'h-5 w-5'],
      },
      trailingIconClassList: {
        xs: ['ml-2', '-mr-0.5', 'h-4', 'w-4'],
        sm: ['ml-2', '-mr-0.5', 'h-4', 'w-4'],
        md: ['ml-2', '-mr-0.5', 'h-4', 'w-4'],
        lg: ['ml-3', '-mr-1', 'h-5', 'w-5'],
        xl: ['ml-3', '-mr-1', 'h-5', 'w-5'],
      },
    };
  },
  computed: {
    buttonClasses() {
      return [
        { loading: this.loading },
        this.wide ? 'inline-flex justify-center w-full' : '',
        ...this.variantClassList[this.variant],
        ...this.sizeClassList[this.size],
        ...this.defaultClassList,
      ];
    },
  },
  methods: {
    onClick(e) {
      this.$emit('click', e);
    },
  },
};
</script>

<style scoped>
  .loading {
    position: relative;
  }

  .loading::before {
    content: '';
    height: 1rem;
    width: 1rem;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-left-color: currentColor;
    border-radius: 50%;
    animation: rotate 1s linear infinite;
    transform: rotate(6deg);
    position: relative;
    left: -5px;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
</style>
