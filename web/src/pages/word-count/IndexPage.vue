<template>
  <q-page>
    <div class="page-bg">
      <ScatterIconsBackground
        :icons="backgroundIcons"
        color="gray"
      />
    </div>
    <div class="page-main app">
      <div class="page-title tac">
        <h1 class="title">{{ $t(meta.title as string) }}</h1>
      </div>
      <div class="content">
        <p class="desc">{{ $t(meta.desc as string) }}</p>
        <div class="file">
          <q-file
            v-model="file"
            :label="$t('wordCount.fileLabel')"
            accept=".txt"
          />
        </div>
        <div
          class="full-width"
          v-show="file"
        >
          <!-- file info -->
          <section class="info-section">
            <h2 class="section-title">{{ $t('wordCount.fileInfo') }}</h2>
            <q-list>
              <q-item
                v-for="item in fileInfo"
                :key="item._id"
              >
                <q-item-section class="text-bold">{{
                  item.name
                }}</q-item-section>
                <q-item-section>{{ item.value }}</q-item-section>
              </q-item>
            </q-list>
          </section>
          <!-- word fre list -->
          <section class="fre-section">
            <h2 class="section-title">{{ $t('wordCount.freSection') }}</h2>
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
                <q-table
                  virtual-scroll
                  flat
                  bordered
                  :virtual-scroll-sticky-size-start="48"
                  row-key="index"
                  :rows="tab.list"
                  :columns="columns"
                  :rows-per-page-options="[10, 20, 30, 50, 100, 0]"
                />
              </q-tab-panel>
            </q-tab-panels>
          </section>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import wordCountService from '@/core/service/word-count'
import type { WordCountItem, GroupedWordData } from '@/core/service/word-count'
import { type QTableProps } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()
const meta = ref(route.meta)

// background
const backgroundIcons = [
  {
    name: 'snow',
    count: 200,
    minWidth: 16,
    maxWidth: 30,
  },
]

const file = ref<null | File>(null)
const fileText = ref('')
let wordCountList = shallowRef<WordCountItem[]>([])

watch(file, async (newValue: File | null) => {
  if (newValue) {
    fileText.value = await newValue.text()
    await wordCountService.init()
    wordCountList.value = wordCountService.count(fileText.value)
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
      value: ((file.value?.size ?? 0) / 1024).toFixed(2) + 'kb',
    },
    {
      name: t('wordCount.textLength'),
      value: fileText.value.length,
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
])
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
