import { db, auth } from '../../firebase';

export default {
  namespaced: true,
  state: {
    isAvailable: null,
    profile: null,
    profileObserver: null,
    localProfile: JSON.parse(localStorage.getItem('localProfile') || '{}'),
    relatedClasses: null,
    isLoading: false,
  },
  getters: {
    isAuthenticated(state) {
      return state.profile;
    },
  },
  actions: {
    async fetchProfile({ commit }) {
      if (!auth.currentUser) return;

      commit('setLoading', true);
      const observer = db.doc(`/users/${auth.currentUser.uid}`)
        .onSnapshot((document) => {
          commit('setProfileAvailability', document.exists);
          commit('setLoading', false);

          if (document.exists) {
            commit('setProfileData', document.data());
            commit('setProfileObserver', observer);
          } else {
            observer.unsubscribe();
          }
        });
    },
    async logout({ commit }) {
      await auth.signOut();
      commit('setProfileAvailability', null);
      commit('setProfileData', null);
    },
    async loadRelatedClasses({ state, commit }) {
      const rollNumber = state.localProfile?.rollNumber || state.profile?.rollNumber;
      if (!rollNumber) return;

      const cls = rollNumber.split('-').slice(0, 2).join('-');
      const classesSnapshot = await db.collection('/classes')
        .where('class', '==', cls)
        .get();

      commit(
        'setRelatedClasses',
        classesSnapshot.docs.map((e) => ({
          id: e.id,
          ...e.data(),
        })),
      );
    },
    async saveLocalProfile({ state, commit, dispatch }) {
      if (
        !state.localProfile.rollNumber
        || !state.localProfile.name
        || !auth.currentUser
        || state.isAvailable
        || state.profileObserver
      ) {
        return;
      }

      const profile = state.localProfile;
      profile.uniRef = db.doc(profile.uniPath);
      profile.classRef = db.doc(profile.classPath);

      await db.doc(`/users/${auth.currentUser.uid}`).set(profile);
      dispatch('fetchProfile');
      commit('clearLocalProfile');
    },
  },
  mutations: {
    setProfileAvailability(state, availability) {
      state.isAvailable = availability;
    },
    setProfileData(state, profile) {
      state.profile = profile;
    },
    setRelatedClasses(state, classes) {
      state.relatedClasses = classes;
    },
    updateLocalProfile(state, profile) {
      state.localProfile = {
        ...state.localProfile,
        ...profile,
      };

      localStorage.setItem('localProfile', JSON.stringify(state.localProfile));
    },
    clearLocalProfile(state) {
      state.localProfile = {};
      state.relatedClasses = null;
      localStorage.removeItem('localProfile');
    },
    setProfileObserver(state, observer) {
      state.profileObserver = observer;
    },
    setLoading(state, loading) {
      state.isLoading = loading;
    },
  },
};
