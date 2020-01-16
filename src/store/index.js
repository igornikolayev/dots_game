import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    checkServer: false
  },
  mutations: {
    changeCheck(state, status){
      state.checkServer=status;
    }
  },
  actions: {
  },
  modules: {
  }
})
