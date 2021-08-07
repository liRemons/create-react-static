import { Store } from '@royjs/core';

export default new Store({
  state : {
    count: 0
  },
  actions:{
    add(state, payload){
      state.count ++
    },
    reduce(state, payload){
      state.count --
    }
  }
})