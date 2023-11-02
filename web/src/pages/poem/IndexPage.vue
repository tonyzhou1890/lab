<template>
  <div class="page-main app">
    <ServiceBaseInfo :service-name="ServiceSchame.i18nKey" />
    <div class="content">
      <div class="search q-pb-md">
        <q-input
          filled
          v-model="filter"
          @keyup.enter="() => handleSearch()"
          :label="$t('poem.searchPlaceholder')"
        />
      </div>
      <div
        v-if="!initialized"
        class="no-data-notice q-pt-md column tac"
      >
        <p class="text-h4 text-grey">{{ $t('global.dep.noData') }}</p>
        <div>
          <q-btn
            color="primary"
            class="btn"
            @click="() => init()"
          >
            <span>{{ $t('global.dep.loadDep') }}</span>
          </q-btn>
        </div>
      </div>
      <q-table
        v-else
        virtual-scroll
        flat
        grid
        bordered
        :virtual-scroll-sticky-size-start="48"
        row-key="index"
        :rows="list"
        :columns="columns"
        :rows-per-page-options="[10, 20, 30, 50, 100]"
      >
        <template v-slot:item="props">
          <div class="q-table__grid-item col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <q-card
              class="q-table__grid-item-card q-table__card q-table--flat q-table--bordered"
            >
              <div class="q-table__grid-item-row">
                <div class="q-table__grid-item-title">
                  {{ props.colsMap.title.label }}
                </div>
                <div class="q-table__grid-item-value row items-center">
                  <span class="text-bold">{{ props.row.title }}</span
                  ><q-icon
                    color="grey"
                    class="text-h5 cp"
                    name="play_circle_outline"
                    @click="() => showDetail(props.row)"
                  ></q-icon>
                </div>
              </div>
              <div class="q-table__grid-item-row">
                <div class="q-table__grid-item-title">
                  {{ props.colsMap.author.label }}
                </div>
                <div class="q-table__grid-item-value">
                  <span v-if="props.row.dynasty"
                    >[{{ props.row.dynasty }}]</span
                  >
                  <span
                    class="text-deco-under cp"
                    @click="() => handleSearch(props.row.author)"
                    >{{ props.row.author }}</span
                  >
                </div>
              </div>
              <div class="q-table__grid-item-row">
                <div class="q-table__grid-item-title">
                  {{ props.colsMap.content.label }}
                </div>
                <div class="q-table__grid-item-value">
                  {{ props.colsMap.content.format(props.row.content) }}
                </div>
              </div>
            </q-card>
          </div>
        </template>
      </q-table>
    </div>
  </div>
  <PoemDetail
    ref="detailRef"
    :data="detail"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AreaCodeService from '@/core/service/poem'
import { type QTableProps } from 'quasar'
import type { PoemItem } from '@/core/service/poem/core'
import ServiceSchame from '@/core/service/poem/schema'
import ServiceBaseInfo from '@/components/ServiceBaseInfo.vue'
import { useI18n } from 'vue-i18n'
import { errorNotify } from '@/core/error/utils'
import { loading } from '@/core/io/utils'
import PoemDetail from './components/PoemDetail.vue'

const { t } = useI18n()
// 是否初始化完毕
const initialized = ref<boolean>(false)

const service = new AreaCodeService()

const list = ref<PoemItem[]>([])

const filter = ref<string>('')

// 表格的表头
const columns = computed<QTableProps['columns']>(() => [
  // {
  //   name: 'index',
  //   label: t('poem.freListIndex'),
  //   field: 'index',
  //   align: 'center',
  // },
  {
    name: 'title',
    label: t('poem.poemTitle'),
    field: 'title',
    align: 'center',
  },
  {
    name: 'author',
    label: t('poem.poemAuthor'),
    field: 'author',
    format: (_, row) => {
      let str = ''
      if (row.dynasty) {
        str += `[${row.dynasty}]`
      }
      str += row.author
      return str
    },
    align: 'center',
  },
  {
    name: 'content',
    label: t('poem.poemContent'),
    field: 'content',
    format: (val) =>
      (val ?? '').split('\n').slice(0, 2).join('\n').substring(0, 30),
    align: 'center',
  },
])

// 本地依赖初始化
async function localInit() {
  try {
    loading.show()
    initialized.value = await service.initLocalDep()
    loading.hide()
  } catch (e) {
    errorNotify(e as Error, { t })
    loading.hide()
  }
}

// 网络依赖初始化
async function init() {
  try {
    loading.show()
    await service.init({
      loadCallback: loading.update,
    })
    initialized.value = true

    loading.hide()
  } catch (e) {
    errorNotify(e as Error, { t })
    loading.hide()
  }
}

// 搜索
async function handleSearch(val?: string) {
  if (val === filter.value) return
  if (val) {
    filter.value = val
  }
  if (!initialized.value || !filter.value) return
  try {
    loading.show()
    list.value = await service.worker.searchPoem(filter.value)
    loading.hide()
  } catch (e) {
    errorNotify(e as Error, { t })
    loading.hide()
  }
}

onMounted(() => {
  localInit()
})

// 详情
const detailRef = ref<typeof PoemDetail | null>(null)
const detail = ref<PoemItem>({
  _id: 0,
  title: '',
  dynasty: '',
  author: '',
  content: '',
})

function showDetail(poem: PoemItem) {
  detail.value = poem
  detailRef.value?.show()
}
</script>

<style lang="scss" scoped>
.page-main {
  .search {
    width: 500px;
    max-width: 90%;
    margin: 0 auto;
  }
  .no-data-notice {
    max-width: 500px;
    margin: auto;
    .btn {
      width: auto;
    }
  }
  .text-deco-under {
    text-decoration: underline;
  }
}
</style>
