import { db } from '../../firebase';

export default {
  namespaced: true,
  state: {
    courses: {},
    resources: {},
    resourceObservers: {},
    tasks: {},
    tasksObservers: {},
  },
  getters: {
    courseByCode(state) {
      return (cls, code) => Object.values(state.courses)
        .find(
          (e) => e.class.id === cls && e.code === code,
        );
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
      const clsRef = db.doc(`/classes/${cls}`);
      const courses = await db.collection('subjects')
        .where('class', '==', clsRef)
        .where('code', '==', courseCode)
        .get();

      const [course] = courses.docs;
      commit('setCourse', {
        id: course.id,
        ...course.data(),
      });
    },
    async watchTasks({
      state, commit, getters, dispatch,
    }, { cls, courseCode }) {
      let courseId = (getters.courseByCode(cls, courseCode) || {}).id;
      if (!courseId) {
        await dispatch('fetchCourse', { cls, courseCode });
        courseId = getters.courseByCode(cls, courseCode).id;
      }

      if (state.tasksObservers[courseId]) return;

      state.tasksObservers[courseId] = db.collection(`subjects/${courseId}/tasks`)
        .orderBy('dueDate')
        .onSnapshot((snapshot) => {
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
      let courseId = (getters.courseByCode(cls, courseCode) || {}).id;
      if (!courseId) {
        await dispatch('fetchCourse', { cls, courseCode });
        courseId = getters.courseByCode(cls, courseCode).id;
      }

      if (state.resourceObservers[courseId]) return;

      state.resourceObservers[courseId] = db.collection(`subjects/${courseId}/resources`)
        .orderBy('date')
        .onSnapshot((snapshot) => {
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
  },
  mutations: {
    setCourse(state, course) {
      state.courses[course.id] = course;
    },
    setResources(state, { courseId, resources }) {
      const categorizedResources = Object.fromEntries(resources.reduce((acc, el) => {
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
        [courseId]: tasks,
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
  },
};
