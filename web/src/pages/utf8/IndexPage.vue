<template>
  <div class="page-main app">
    <ServiceBaseInfo :service-name="ServiceSchame.i18nKey" />
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
        class="bg-transparent q-px-none"
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
          <component
            :is="tab.component"
            :service="service"
          />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Component } from 'vue'
import { useI18n } from 'vue-i18n'
import ServiceSchame from '@/core/service/utf8/schema'
import Utf8Service from '@/core/service/utf8'
import ServiceBaseInfo from '@/components/ServiceBaseInfo.vue'
import TextToUtf8 from './components/TextToUtf8.vue'
import Utf8ToText from './components/Utf8ToText.vue'

const { t } = useI18n()

interface TabItem {
  name: string
  value: string
  component: Component
}

// 当前 tab
const currTab = ref('text')

const service = new Utf8Service()
// tab 列表
const tabList = computed<TabItem[]>(() => {
  return [
    {
      name: t('utf8.textToUtf8'),
      value: 'text',
      component: TextToUtf8,
    },
    {
      name: t('utf8.utf8ToText'),
      value: 'utf8',
      component: Utf8ToText,
    },
  ]
})
</script>
