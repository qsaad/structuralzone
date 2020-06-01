import {PagesList} from '@/data/pages'
import _ from 'lodash'

export const strict = false

export const state = () => ({
  pagesList : PagesList,
  sidebar: false
})//STATE


export const getters = {
  getPagesList : state => state.pagesList,
}//GETTER

export const mutations = {
  toggleSidebar (state) {
    state.sidebar = !state.sidebar
  }
}//MUTATIONS

export const actions = {
  //analysisCount : (context,payload) => {context.commit("ANALYSIS_COUNT",payload)},
  async nuxtServerInit ({ commit, dispatch }, { req }) {
    //console.log(req.session.user)
    console.log('server init')
  }
}//ACTIONS
