<template>
  <div class="page-main app">
    <ServiceBaseInfo :service-name="ServiceSchema.i18nKey" />
    <div class="content relative-position">
      <q-tabs
        v-model="currTab"
        class="text-teal"
      >
        <q-tab
          v-for="tab in tabList"
          :key="tab.key"
          :name="tab.key"
          :label="tab.key + '(' + tab.list.length + ')'"
        />
      </q-tabs>
      <q-tab-panels
        v-model="currTab"
        v-bind="config.tabPanels"
      >
        <q-tab-panel
          v-for="tab in tabList"
          :key="tab.key"
          :name="tab.key"
          v-bind="config.tabPanel"
        >
          <IdiomList :list="tab.list"></IdiomList>
        </q-tab-panel>
      </q-tab-panels>
      <div class="tabs-wrapper absolute-left"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UsualIdiomService, { IdiomGroup } from '@/core/service/usual-idiom'
import ServiceSchema from '@/core/service/usual-idiom/schema'
import { useI18n } from 'vue-i18n'
import { errorNotify } from '@/core/error/utils'
import { loading } from '@/core/io/utils'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'
import IdiomList from './components/IdiomList.vue'

const { t } = useI18n()

const appStore = useAppStore()
const { config } = storeToRefs(appStore)

const currTab = ref<string>('')
const tabList = ref<IdiomGroup[]>([])

const service = new UsualIdiomService()

// 本地依赖初始化
async function init() {
  try {
    loading.show()
    await service.init()
    currTab.value = service.data[0]?.key ?? ''
    tabList.value = service.data
    loading.hide()
  } catch (e) {
    errorNotify(e, { t })
    loading.hide()
  }
}

onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.page-main {
  .result-list {
    :deep(.q-item) {
      .q-item__section:first-child {
        width: 30%;
        min-width: 80px;
        max-width: 180px;
      }
    }
  }
}
</style>
