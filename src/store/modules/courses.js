import { db } from '../../firebase';

export default {
  namespaced: true,
  state: {
    courses: {},
    resources: {},
    resourceObservers: {},
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
    async watchResources({
      state, commit, getters, dispatch,
    }, { cls, courseCode }) {
      let courseId = getters.courseByCode(cls, courseCode);
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
    unwatchResources(state, courseId) {
      if (state.resourceObservers[courseId] && state.resourceObservers[courseId].unsubscribe) {
        state.resourceObservers[courseId].unsubscribe();
      }
    },
  },
};
