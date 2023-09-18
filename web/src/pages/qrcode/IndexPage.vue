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
        class="bg-transparent"
        keep-alive
        v-model="currTab"
        animated
        swipeable
        transition-prev="jump-up"
        transition-next="jump-up"
      >
        <q-tab-panel
          v-for="tab in tabList"
          :key="tab.value"
          :name="tab.value"
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

const { t } = useI18n()

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
