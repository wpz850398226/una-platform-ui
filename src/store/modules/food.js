import { getCompanyId } from '@/utils/food.js'

import { getDisesByType } from '@/api/food.js'

const state = {
  foodList: [],
  companyId: getCompanyId()
}

const mutations = {
  set_foodList: (state, list) => {
    state.foodList = list
  },
  set_companyId: (state, companyId) => {
    state.companyId = companyId
  }
}

const actions = {
  getDishesByType({ commit }) {
    return new Promise((resolve, reject) => {
      // 分类获取所有菜品
      getDisesByType().then(res => {
        console.log('所有菜品')
        console.log(res)
        if (res.status === 200) {
          const base = res.data
          commit('set_foodList', base)
          resolve()
        } else {
          this.$message(res.data.message)
          reject()
        }
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
