<template>
  <div>
    <header class="bg-surface shadow-sm"
            v-if="$slots.breadcrumb || (breadcrumbLinks || breadcrumbItems || []).length > 0 || $slots['right-nav']">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex">
        <slot name="breadcrumb">
          <breadcrumb class="py-4" :links="breadcrumbLinks || breadcrumbItems" />
        </slot>
        <div class="flex-1"></div>
        <slot name="right-nav">
          <nav class="flex" v-if="(submenuItems || []).length > 1">
            <router-link :to="getLinkRoute(link)" v-slot="{ isActive, href, navigate }"
              v-for="link in submenuItems" :key="getLinkId(link)">
              <a :href="href" @click="navigate" :class="[
                 'whitespace-no-wrap ml-4 py-4 px-4 border-b-2 font-medium text-sm leading-5 focus:outline-none',
                 isActive ? 'border-border-light text-on-surface-80' : 'border-transparent text-on-surface-60 hover:text-on-surface-80 hover:border-border focus:border-border-dark'
               ]">
                {{getLinkName(link)}}
              </a>
            </router-link>
          </nav>
        </slot>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Breadcrumb from './Breadcrumb.vue';

export default {
  components: {
    Breadcrumb,
  },
  props: {
    breadcrumbLinks: Array,
    submenuLinks: Array,
  },
  data() {
    return {
      breadcrumbItems: [],
      submenuItems: [],

      activeRoute: { meta: {}, fullPath: '' },
    };
  },
  watch: {
    $route(to) {
      this.activeRoute = to;
      this.loadRelativeRoutes();
    },
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
    loadRelativeRoutes() {
      const breadcrumbItems = [];
      let submenuItems;
      const routes = this.activeRoute.fullPath.split('/');

      for (let i = 1; i <= routes.length; i += 1) {
        const path = routes.slice(0, i).join('/');
        let route = this.$router.match(path);

        // todo: get exact routed redirected from
        if (route.redirectedFrom) {
          route = {
            ...route,
            path: route.matched[0].path,
            fullPath: route.matched[0].fullPath,
            name: route.matched[0].name,
            meta: route.matched[0].meta,
          };

          delete route.redirectedFrom;
        }

        const matched = this.$router.options.routes.find(
          (e) => e.path === route.matched[0].path
            || (route.matched[0].name && e.name === route.matched[0].name),
        );
        if (matched && matched.children) {
          submenuItems = matched.children.map((e) => {
            if (typeof e.meta?.title === 'function') {
              e.meta.title = e.meta.title(route);
            }
            return {
              id: e.name || e.path,
              name: e.meta?.title,
              path: e.name
                ? { name: e.name, params: route.params }
                : { path: `${route.path}/${e.path}` },
            };
          });
        }

        if (route.meta.title && !route.meta.hidden) {
          if (typeof route.meta.title === 'function') {
            route.meta.title = route.meta.title(route);
          }
          breadcrumbItems.push({
            name: route.meta?.title,
            path,
          });
        }
      }

      this.breadcrumbItems = breadcrumbItems;
      this.submenuItems = submenuItems || [];
    },
  },
  created() {
    this.activeRoute = this.$route;
    this.loadRelativeRoutes();
  },
};
</script>
