import { db } from '../../firebase';

export function optionalOrderComparator(a, b) {
  if (a.order && b.order) return a.order - b.order;
  if (a.order) return -1;
  if (b.order) return 1;
  return 0;
}

export default {
  namespaced: true,
  state: {
    courses: {},
    resources: {},
    resourceObservers: {},
    tasks: {},
    tasksObservers: {},
    loading: {},
  },
  getters: {
    courseByCode(state) {
      return (cls, code) => Object.values(state.courses)
        .find((e) => {
          if (e.classes && e.classes?.length > 0) {
            return (e.classes || []).find((c) => c.id === cls) && e.code === code;
          }
          return e.class.id === cls && e.code === code;
        });
    },
    resourcesByCourseCode(state, getters) {
      return (cls, code) => state.resources[(getters.courseByCode(cls, code) || {}).id];
    },
    tasksByCourseCode(state, getters) {
      return (cls, code) => state.tasks[(getters.courseByCode(cls, code) || {}).id];
    },
  },
  actions: {
    async fetchCourse({ commit }, { cls, courseCode }) {
      commit('setCourseLoading', { course: `${cls}/${courseCode}` });
      const clsRef = db.doc(`/classes/${cls}`);

      let courses = await db.collection('subjects')
        .where('class', '==', clsRef)
        .where('code', '==', courseCode)
        .get();

      if (courses.docs?.length === 0) {
        courses = await db.collection('subjects')
          .where('classes', 'array-contains', clsRef)
          .where('code', '==', courseCode)
          .get();
      }

      const [course] = courses.docs;
      if (course) {
        commit('setCourse', {
          id: course.id,
          ...course.data(),
        });
      } else {
        commit('setCourse', {
          id: `${cls}--${courseCode}`,
          class: { id: cls },
          code: courseCode,
        });
      }

      commit('setCourseLoading', { course: `${cls}/${courseCode}`, loading: false });
    },

    async watchTasks({
      state, commit, getters, dispatch,
    }, { cls, courseCode }) {
      commit('setCourseLoading', { course: `${cls}/${courseCode}`, level: 'tasks' });
      let courseId = (getters.courseByCode(cls, courseCode) || {}).id;

      if (!courseId) {
        await dispatch('fetchCourse', { cls, courseCode });
        courseId = getters.courseByCode(cls, courseCode).id;
      }

      if (state.tasksObservers[courseId]) return;

      state.tasksObservers[courseId] = db.collection(`subjects/${courseId}/tasks`)
        .orderBy('dueDate')
        .onSnapshot((snapshot) => {
          commit('setCourseLoading', { course: `${cls}/${courseCode}`, level: 'tasks', loading: false });

          const tasks = [];
          snapshot.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() });
          });

          commit('setTasks', {
            courseId,
            tasks,
          });
        });
    },

    async watchResources({
      state, commit, getters, dispatch,
    }, { cls, courseCode }) {
      commit('setCourseLoading', { course: `${cls}/${courseCode}`, level: 'resources' });
      let courseId = (getters.courseByCode(cls, courseCode) || {}).id;

      if (!courseId) {
        await dispatch('fetchCourse', { cls, courseCode });
        courseId = getters.courseByCode(cls, courseCode).id;
      }

      if (state.resourceObservers[courseId]) return;

      state.resourceObservers[courseId] = db.collection(`subjects/${courseId}/resources`)
        .orderBy('date')
        .onSnapshot((snapshot) => {
          commit('setCourseLoading', { course: `${cls}/${courseCode}`, level: 'resources', loading: false });
          const resources = [];

          snapshot.forEach((doc) => {
            resources.push({ id: doc.id, ...doc.data() });
          });

          commit('setResources', {
            courseId,
            resources,
          });
        });
    },

    async saveResource(_, { courseId, resourcesId, data }) {
      if (!resourcesId) {
        await db.collection(`subjects/${courseId}/resources`).add(data);
      } else {
        await db.doc(`subjects/${courseId}/resources/${resourcesId}`).set(data);
      }
    },
  },
  mutations: {
    setCourse(state, course) {
      state.courses[course.id] = course;
    },
    setResources(state, { courseId, resources }) {
      const localResources = resources.sort(optionalOrderComparator);
      const categorizedResources = Object.fromEntries(localResources.reduce((acc, el) => {
        if (el.isHeading) {
          acc.push([el.name, []]);
        } else {
          if (!acc[acc.length - 1]) acc.push(['Resources', []]);
          acc[acc.length - 1][1].push(el);
        }
        return acc;
      }, []));

      state.resources = {
        ...state.resources,
        [courseId]: categorizedResources,
      };
    },
    setTasks(state, { courseId, tasks }) {
      state.tasks = {
        ...state.tasks,
        [courseId]: tasks.sort(optionalOrderComparator),
      };
    },
    unwatchResources(state, courseId) {
      const observer = state.resourceObservers[courseId];
      if (observer && observer.unsubscribe) {
        observer.unsubscribe();

        delete state.resourceObservers[courseId];
      }
    },
    unwatchTasks(state, courseId) {
      const observer = state.tasksObservers[courseId];
      if (observer && observer.unsubscribe) {
        observer.unsubscribe();

        delete state.tasksObservers[courseId];
      }
    },
    setCourseLoading(state, { course, loading = true, level = 'default' }) {
      if (!state.loading[course]) {
        state.loading[course] = {};
      }

      state.loading = {
        ...state.loading,
        [course]: {
          ...state.loading[course],
          [level]: loading,
        },
      };
    },
  },
};
