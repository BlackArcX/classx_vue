import { db } from '../../firebase';

export default {
  namespaced: true,
  state: {
    courses: [],
  },
  getters: {
    courseByCode(state) {
      return (cls, code) => state.courses.find(
        (e) => e.classRef.id === cls && e.code === code,
      );
    },
  },
  actions: {
    async fetchCourse({ commit }, { cls, courseCode }) {
      const clsRef = db.doc(`/classes/${cls}`);
      const courses = await db.collection('registeredCourses')
        .where('classRef', '==', clsRef)
        .where('code', '==', courseCode)
        .get();

      const [course] = courses.docs;
      commit('setCourse', {
        id: course.id,
        ...course.data(),
      });
    },
    async addResource() {
    },
  },
  mutations: {
    setCourse(state, course) {
      state.courses.push(course);
    },
  },
};
