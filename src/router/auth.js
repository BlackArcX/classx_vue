import store from '../store';

export default [
  {
    path: '/auth/login',
    name: 'auth-login',
    component: () => import('@/views/auth/auth.vue'),
    props: {
      isSignIn: true,
    },
  },
  {
    path: '/auth/signup',
    name: 'auth-signup',
    component: () => import('@/views/auth/auth.vue'),
    props: {
      isSignIn: false,
    },
  },
  {
    path: '/auth/forget-pass',
    name: 'auth-forget-pass',
    component: () => import('@/views/auth/ForgetPass.vue'),
  },
  {
    path: '/auth/setup-university',
    name: 'setup-university',
    component: () => import('@/views/auth/SetupUniversity.vue'),
    beforeEnter: (to, from, next) => {
      const { rollNumber, university } = store.state.profile.localProfile;

      if (rollNumber && university) {
        next({ name: 'setup-class', query: to.query });
      } else {
        next();
      }
    },
  },
  {
    path: '/auth/setup-class',
    name: 'setup-class',
    component: () => import('@/views/auth/SetupClass.vue'),
    beforeEnter: (to, from, next) => {
      const { rollNumber, university } = store.state.profile.localProfile;

      if (!rollNumber && !university) {
        next({ name: 'setup-university', query: to.query });
      } else {
        next();
      }
    },
  },
];
