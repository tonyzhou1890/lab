/* eslint-disable */

/// <reference types="vite/client" />
import type { DefineComponent } from 'vue'
import SvgIcon from './components/SvgIcon.vue'
import ServiceBaseInfo from './components/ServiceBaseInfo.vue'
import SectionTitle from './components/SectionTitle.vue'

// Mocks all files ending in `.vue` showing them as plain Vue instances
declare module '*.vue' {
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    SvgIcon: DefineComponent<typeof SvgIcon>
    ServiceBaseInfo: DefineComponent<typeof ServiceBaseInfo>
    SectionTitle: DefineComponent<typeof SectionTitle>
  }
}
