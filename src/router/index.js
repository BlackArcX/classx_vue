import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/subjects',
    name: 'subjects',
    component: () => import(/* webpackChunkName: "subjects" */ '@/views/Subjects.vue'),
  },
  {
    path: '/subjects/:id',
    name: 'subject:detail',
    component: () => import(/* webpackChunkName: "subjects" */ '@/views/SubjectDetail.vue'),
  },
  {
    path: '/classes',
    name: 'classes',
    component: () => import(/* webpackChunkName: "classes" */ '@/views/Classes.vue'),
  },
  {
    path: '/classes/:id',
    name: 'classes:detail',
    component: () => import(/* webpackChunkName: "classes" */ '@/views/ClassDetail.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
