<template>
  <nav class="flex items-center text-sm leading-5 font-medium">
    <template v-for="link in links">
      <router-link :to="getLinkRoute(link)" :key="`a-${getLinkId(link)}`"
         class="text-on-surface-75 hover:text-on-surface focus:outline-none focus:underline transition duration-150 ease-in-out">
        {{getLinkName(link)}}
      </router-link>
      <svg :key="`s-${getLinkId(link)}`" class="flex-shrink-0 mx-2 h-5 w-5 text-border-dark last:hidden"
           fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" clip-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"></path>
      </svg>
    </template>
  </nav>
</template>

<script>
export default {
  props: {
    links: Array,
  },
  methods: {
    getLinkId(link) {
      return link.id ?? link.name ?? link;
    },
    getLinkName(link) {
      return link.name ?? link;
    },
    getLinkRoute(link) {
      return link.path ?? link;
    },
  },
};
</script>
