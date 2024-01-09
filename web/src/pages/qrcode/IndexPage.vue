<template>
  <div class="page-main app">
    <ServiceBaseInfo service-name="qrcode" />
    <div class="content">
      <q-tabs
        v-model="currTab"
        class="text-teal"
      >
        <q-tab
          v-for="tab in tabList"
          :key="tab.value"
          :name="tab.value"
          :label="tab.name"
        />
      </q-tabs>
      <q-tab-panels
        v-model="currTab"
        v-bind="config.tabPanels"
      >
        <q-tab-panel
          v-for="tab in tabList"
          :key="tab.value"
          :name="tab.value"
          v-bind="config.tabPanel"
        >
          <component :is="tab.component" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Component } from 'vue'
import { useI18n } from 'vue-i18n'
import ServiceBaseInfo from '@/components/ServiceBaseInfo.vue'
import GenCode from './components/GenCode.vue'
import RecognizeCode from './components/RecognizeCode.vue'
import ScanCode from './components/ScanCode.vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'

const { t } = useI18n()

const appStore = useAppStore()
const { config } = storeToRefs(appStore)

interface TabItem {
  name: string
  value: string
  component: Component
}
// 当前 tab
const currTab = ref('generate')
// tab 列表
const tabList = computed<TabItem[]>(() => {
  return [
    {
      name: t('qrcode.generate'),
      value: 'generate',
      component: GenCode,
    },
    {
      name: t('qrcode.recognize'),
      value: 'recognize',
      component: RecognizeCode,
    },
    {
      name: t('qrcode.scan'),
      value: 'scan',
      component: ScanCode,
    },
  ]
})
</script>
