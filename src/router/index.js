import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
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
    path: '/classes/:class/:course/resources/add',
    name: 'resources:add',
    component: () => import(/* webpackChunkName: "resources" */ '@/views/AddResource.vue'),
  },
  {
    path: '/classes/:class/:course',
    name: 'course:resources',
    component: () => import(/* webpackChunkName: "classes" */ '@/views/CourseResources.vue'),
  },
  {
    path: '/classes/:class',
    name: 'class:courses',
    component: () => import(/* webpackChunkName: "classes" */ '@/views/ClassCourses.vue'),
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
