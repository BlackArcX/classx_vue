import { db } from '../../firebase';

export default {
  namespaced: true,
  state: {
    classes: {},
  },
  getters: {
    classByName(state) {
      return (name) => state[name];
    },
  },
  actions: {
    async fetchClassSubjects({ commit }, cls) {
      const snapshot = await db.collection(`/classes/${cls}/semesters/`).get();
      let semesters = snapshot.docs.map((e) => ({ id: e.id, ...e.data() }));

      semesters = (await Promise.all(semesters.map(async (semester) => ({
        ...semester,
        courses: await Promise.all(semester.courses.map(
          async (courseRef) => {
            const course = await courseRef.get();
            return {
              id: course.id,
              exists: course.exists,
              ...course.data(),
            };
          },
        )),
      })))).reverse();

      commit('setClassSubjects', { cls, semesters });
    },
  },
  mutations: {
    setClassSubjects(state, { cls, semesters }) {
      state.classes = { ...state.classes, [cls]: semesters };
    },
  },
};
