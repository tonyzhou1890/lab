<template>
  <div class="page-main app">
    <ServiceBaseInfo :service-name="ServiceSchema.i18nKey" />
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
import ServiceSchema from '@/core/service/time/schema'
import ServiceBaseInfo from '@/components/ServiceBaseInfo.vue'
import ClockCom from './components/ClockCom.vue'
import CountdownCom from './components/CountdownCom.vue'
import StopwatchCom from './components/StopwatchCom.vue'

const { t } = useI18n()

interface TabItem {
  name: string
  value: string
  component: Component
}

// 当前 tab
const currTab = ref('clock')

// tab 列表
const tabList = computed<TabItem[]>(() => {
  return [
    {
      name: t('time.clock.label'),
      value: 'clock',
      component: ClockCom,
    },
    {
      name: t('time.countdown.label'),
      value: 'countdown',
      component: CountdownCom,
    },
    {
      name: t('time.stopwatch.label'),
      value: 'stopwatch',
      component: StopwatchCom,
    },
  ]
})
</script>
