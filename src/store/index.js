import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import permission from './modules/permission'
import settings from './modules/settings'
import user from './modules/user'
import workflow from './modules/workflow'
import tagsView from './modules/tagsView'
import food from './modules/food'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    permission,
    settings,
    user,
    workflow,
    tagsView,
    food
  },
  getters
})

export default store
