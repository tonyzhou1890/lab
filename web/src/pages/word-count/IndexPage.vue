<template>
  <div class="page-main app">
    <ServiceBaseInfo service-name="wordCount" />
    <div class="content q-pt-md">
      <div class="file">
        <q-file
          v-model="file"
          v-bind="config.field"
          :label="$t('wordCount.fileLabel')"
          accept=".txt, .md, .json, .js, .css, .html, .vue, .ts, .jsx, .c, .csv, .svg"
        />
      </div>
      <div
        class="full-width"
        v-show="file"
      >
        <!-- file info -->
        <section class="info-section">
          <section-title>{{ $t('wordCount.fileInfo') }}</section-title>
          <q-list>
            <q-item
              v-for="item in fileInfo"
              :key="item._id"
            >
              <q-item-section class="text-bold">{{ item.name }}</q-item-section>
              <q-item-section>{{ item.value }}</q-item-section>
            </q-item>
          </q-list>
        </section>
        <!-- word fre list -->
        <section class="fre-section">
          <SectionTitle>{{ $t('wordCount.freSection') }}</SectionTitle>
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
              <q-table
                virtual-scroll
                flat
                bordered
                :virtual-scroll-sticky-size-start="48"
                row-key="index"
                :rows="tab.list"
                :columns="columns"
                :rows-per-page-options="[10, 20, 30, 50, 100, 0]"
                style="max-height: 400px"
              />
            </q-tab-panel>
          </q-tab-panels>
          <!-- export buttons -->
          <div class="q-pa-md text-center">
            <q-btn-dropdown
              color="primary"
              :label="$t('wordCount.exportExcel')"
              :loading="exportExcelLoading"
              class="q-mr-md"
            >
              <q-list>
                <q-item
                  v-for="item in tabList"
                  :key="item.value"
                  clickable
                  v-close-popup
                  @click="() => onExportExcelItemClick(item)"
                >
                  <q-item-section>
                    <q-item-label>{{ item.name }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <q-btn-dropdown
              color="primary"
              :label="$t('wordCount.exportTxt')"
              :loading="exportTxtLoading"
            >
              <q-list>
                <q-item
                  v-for="item in tabList"
                  :key="item.value"
                  clickable
                  v-close-popup
                  @click="() => onExportTxtItemClick(item)"
                >
                  <q-item-section>
                    <q-item-label>{{ item.name }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import wordCountService from '@/core/service/word-count'
import type { WordCountItem, GroupedWordData } from '@/core/service/word-count'
import { getFileName } from '@/core/utils'
import { Loading, type QTableProps } from 'quasar'
import { format } from 'quasar'
import { useI18n } from 'vue-i18n'
import ServiceBaseInfo from '@/components/ServiceBaseInfo.vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'
import thousandsSep from 'allbox/dist/number.format.thousands-sep'

const { t } = useI18n()

const appStore = useAppStore()
const { config } = storeToRefs(appStore)

const file = ref<null | File>(null)
const fileText = ref('')
let wordCountList = shallowRef<WordCountItem[]>([])

watch(file, async (newValue: File | null) => {
  if (newValue) {
    fileText.value = await newValue.text()
    Loading.show()
    await wordCountService.init().catch((e) => console.log(e))
    wordCountList.value = wordCountService.count(fileText.value)
    Loading.hide()
  }
})

// 文本信息
const fileInfo = computed(() => {
  return [
    {
      name: t('wordCount.fileName'),
      value: file.value?.name ?? '',
      _id: 0,
    },
    {
      name: t('wordCount.fileSize'),
      value: format.humanStorageSize(file.value?.size ?? 0),
    },
    {
      name: t('wordCount.textLength'),
      value: thousandsSep(fileText.value.length),
    },
  ].map((item) => {
    item._id = Math.random()
    return item
  })
})

// 当前 tab
const currTab = ref('all')
// tab 列表
const tabList = computed<GroupedWordData>(() => {
  const groupedData = wordCountService.listGrouping(wordCountList.value)
  return groupedData.map((item) => {
    return {
      ...item,
      name: t(item.name),
    }
  })
})

// 表格的表头
const columns = computed<QTableProps['columns']>(() => [
  {
    name: 'index',
    label: t('wordCount.freListIndex'),
    field: 'index',
    align: 'center',
  },
  {
    name: 'word',
    label: t('wordCount.freListWord'),
    field: 'word',
    align: 'center',
  },
  {
    name: 'count',
    label: t('wordCount.freListCount'),
    field: 'count',
    align: 'center',
  },
  {
    name: 'percent',
    label: t('wordCount.freListPercent') + '(%)',
    field: 'percent',
    align: 'center',
  },
])

// 导出 excel
const exportExcelLoading = ref(false)

async function onExportExcelItemClick(tab: GroupedWordData[number]) {
  console.log(file.value)
  if (exportExcelLoading.value) return
  exportExcelLoading.value = true
  await wordCountService.downloadExcel(
    tabList.value,
    (getFileName(file.value as File) ?? 'New File') + '.xlsx',
    t,
    tab.value
  )
  exportExcelLoading.value = false
}

// 导出生词本
const exportTxtLoading = ref(false)

async function onExportTxtItemClick(tab: GroupedWordData[number]) {
  if (exportTxtLoading.value) return
  exportTxtLoading.value = true
  await wordCountService.downloadTxt(
    tabList.value,
    (getFileName(file.value as File) ?? 'New File') + '.txt',
    tab.value
  )
  exportTxtLoading.value = false
}
</script>

<style lang="scss">
.page-main {
  .file {
    width: 300px;
    max-width: 90%;
    margin: 0 auto;
  }

  .word-list-table {
    max-height: 400px;
  }
}
</style>
