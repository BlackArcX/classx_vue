import { classesCollection } from '../../firebase';

export default {
  namespaced: true,
  state: {
    classes: [],
    $unsubFn: null,
  },
  getters: {
    universities(state) {
      const universities = state.classes.reduce((rv, el) => {
        // eslint-disable-next-line no-param-reassign
        (rv[el.uniName] = rv[el.uniName] || []).push(el);
        return rv;
      }, {});

      return Object.entries(universities).map((e) => ({
        name: e[0],
        classes: e[1],
      }));
    },
  },
  actions: {
    async subscribe({ commit }) {
      const unsubFn = classesCollection.onSnapshot((snapshot) => {
        const classesArray = [];
        snapshot.forEach((doc) => {
          console.log(doc.data());
          classesArray.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        commit('updateClasses', classesArray);
      });

      commit('$setUnsubFn', unsubFn);
    },
  },
  mutations: {
    $setUnsubFn(state, $unsubFn) {
      state.$unsubFn = $unsubFn;
    },
    updateClasses(state, classes) {
      state.classes = classes;
    },
    unsubscribe(state) {
      if (state.$unsubFn) {
        state.$unsubFn();
      }
    },
  },
};
