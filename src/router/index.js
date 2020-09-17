import Vue from 'vue';
import VueRouter from 'vue-router';
// import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/teachers/:id',
    name: 'teacher:profile',
    component: () => import(/* webpackChunkName: "teachers" */ '@/views/TeacherProfile.vue'),
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
    path: '/classes/:class/:course/resources/add',
    name: 'resources:add',
    component: () => import(/* webpackChunkName: "resources" */ '@/views/AddResource.vue'),
  },
  {
    path: '/classes/:class/:course',
    component: () => import(/* webpackChunkName: "course" */ '@/views/CourseDetail.vue'),
    name: 'course:details',
    redirect: { name: 'course:resources' },
    meta: {
      title: (route) => route.params.course,
    },
    children: [
      {
        path: 'resources',
        name: 'course:resources',
        component: () => import(/* webpackChunkName: "course" */ '@/views/CourseResources.vue'),
        meta: { title: 'Resources' },
      },
      {
        path: 'tasks',
        name: 'course:tasks',
        component: () => import(/* webpackChunkName: "course" */ '@/views/CourseTasks.vue'),
        meta: { title: 'Tasks' },
      },
      {
        path: 'about',
        name: 'course:about',
        component: () => import(/* webpackChunkName: "course" */ '@/views/CourseAbout.vue'),
        meta: { title: 'About' },
      },
    ],
  },
  {
    path: '/classes/:class',
    name: 'class:courses',
    component: () => import(/* webpackChunkName: "classes" */ '@/views/ClassCourses.vue'),
    meta: {
      title: (route) => route.params.class,
    },
  },
  {
    path: '/classes',
    name: 'classes',
    component: () => import(/* webpackChunkName: "classes" */ '@/views/Classes.vue'),
    meta: {
      title: 'Classes',
    },
  },
  {
    path: '/get-started',
    name: 'auth-step1',
    component: () => import('@/views/auth/step1.vue'),
  },
  {
    path: '/',
    name: 'home',
    redirect: { name: 'classes' },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
