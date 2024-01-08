import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    config: {
      form: {
        class: {
          'q-gutter-y-md': true,
          form: true,
          'q-mx-auto': true,
          ova: true,
        },
      },
      field: {
        outlined: true,
        hideBottomSpace: true,
      },
    },
  }),
  getters: {
    doubleCount: (state) => state.config,
  },
  actions: {
    // increment() {
    //   this.counter++
    // },
  },
})
