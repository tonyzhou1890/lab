<template>
  <div
    class="page-main position-relative app ova no-margin no-border-radius bg-transparent"
  >
    <ServiceBaseInfo :service-name="ServiceSchema.i18nKey" />
    <div class="content">
      <div
        class="search q-pb-md"
        ref="inputWrapperEl"
      >
        <q-input
          v-model.trim="filter"
          v-bind="config.field"
          @keyup.enter="() => handleJump()"
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
        v-model:pagination="pagination"
        :columns="columns"
        card-container-class="justify-center"
        :rows-per-page-options="[10, 20, 30, 50, 100]"
        @request="onTableRequest"
        class="flex"
      >
        <template v-slot:item="props">
          <div class="q-table__grid-item">
            <q-card
              class="q-table__grid-item-card q-table__card fit text-center"
            >
              <div class="q-table__grid-item-card-inner fit ovh">
                <div class="q-table__grid-item-row">
                  <div class="q-table__grid-item-value">
                    <span
                      class="text-bold text-h5 cp text-deco-under"
                      @click="() => showDetail(props.row)"
                      >{{ props.row.title }}</span
                    >
                    <!-- <q-icon
                    color="grey"
                    class="text-h5 cp"
                    name="play_circle_outline"
                    @click="() => showDetail(props.row)"
                  ></q-icon> -->
                  </div>
                </div>
                <div class="q-table__grid-item-row">
                  <div class="q-table__grid-item-value">
                    <span v-if="props.row.dynasty"
                      >[{{ props.row.dynasty }}]</span
                    >
                    <span
                      class="text-deco-under cp"
                      @click="() => handleJump(`/author:${props.row.author}`)"
                      >{{ props.row.author }}</span
                    >
                  </div>
                </div>
                <div class="q-table__grid-item-row">
                  <div class="q-table__grid-item-value poem-content text-body1">
                    {{ props.row.content }}
                  </div>
                </div>
              </div>
            </q-card>
          </div>
        </template>
      </q-table>
      <div
        v-if="pagination.rowsNumber"
        class="btns row justify-center"
      >
        <q-btn
          :loading="btnLoading"
          :label="$t('global.download.title')"
          color="primary"
          @click="handleDownload"
        ></q-btn>
      </div>
    </div>
  </div>
  <PoemDetail
    ref="detailRef"
    :data="detail"
    :font-family="fontName"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import PoemService from '@/core/service/poem'
import FontService from '@/core/service/font'
import { useQuasar, type QTableProps } from 'quasar'
import type { PoemItem } from '@/core/service/poem/core'
import ServiceSchema from '@/core/service/poem/schema'
import ServiceBaseInfo from '@/components/ServiceBaseInfo.vue'
import { useI18n } from 'vue-i18n'
import { errorNotify } from '@/core/error/utils'
import { CoreErrorEnum } from '@/core/error'
import { loading } from '@/core/io/utils'
import PoemDetail from './components/PoemDetail.vue'
import searchPatternCheck from 'allbox/dist/other.search-pattern-check'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'
import { RouteRecordName, useRoute, useRouter } from 'vue-router'

const { t } = useI18n()
const $q = useQuasar()

const appStore = useAppStore()
const { config } = storeToRefs(appStore)

const route = useRoute()
const router = useRouter()

const inputWrapperEl = ref<HTMLElement>()

// 是否初始化完毕
const initialized = ref<boolean>(false)

const service = new PoemService()

const list = ref<PoemItem[]>([])

const filter = ref<string>((route.query.keyword as string) ?? '')

const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0,
})

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

onMounted(() => {
  localInit()
  setFont()
})

// 本地依赖初始化
async function localInit() {
  try {
    loading.show()
    initialized.value = await service.initLocalDep()
    loading.hide()
    handleSearch()
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
    handleSearch()
  } catch (e) {
    errorNotify(e as Error, { t })
    loading.hide()
  }
}

// 表格切换页码之类的
const onTableRequest: QTableProps['onRequest'] = (prop) => {
  pagination.value.page = prop.pagination.page ?? 1
  pagination.value.rowsPerPage = prop.pagination.rowsPerPage ?? 10
  handleSearch()
}

watch(route, (newValue) => {
  filter.value = (newValue.query.keyword as string) ?? ''
  console.log(filter.value)
  pagination.value.page = 1
  if (initialized.value) {
    handleSearch()
  }
})

function handleJump(keyword?: string) {
  if (!keyword) {
    keyword = filter.value
  }
  if (route.query.keyword !== keyword) {
    router.push({
      name: route.name as RouteRecordName,
      query: {
        keyword,
      },
    })
  }
}

// 搜索
async function handleSearch(val?: string) {
  if (val === filter.value) return
  if (val) {
    filter.value = val
  }
  if (!initialized.value) return
  // 检查搜索条件
  const checked = searchPatternCheck(
    service.searchCfg,
    filter.value ?? '',
    true
  )

  if (!checked.valid) {
    return errorNotify(new Error(CoreErrorEnum[203]), { t })
  }
  try {
    loading.show()
    const res = await service.worker.searchPoem({
      keyword: checked?.pairs?.default as string,
      author: checked?.pairs?.author as string,
      page: pagination.value.page,
      size: pagination.value.rowsPerPage,
    })
    list.value = res.list
    pagination.value.rowsNumber = res.total
    loading.hide()

    inputWrapperEl.value?.scrollIntoView()
  } catch (e) {
    errorNotify(e as Error, { t })
    loading.hide()
  }
}

// 下载
const btnLoading = ref(false)

async function handleDownload() {
  btnLoading.value = true
  // 检查搜索条件
  const checked = searchPatternCheck(
    service.searchCfg,
    filter.value ?? '',
    true
  )

  if (!checked.valid) {
    return errorNotify(new Error(CoreErrorEnum[203]), { t })
  }
  try {
    const res = await service.worker.searchPoem({
      keyword: checked?.pairs?.default as string,
      author: checked?.pairs?.author as string,
      page: 1,
      size: 1 << 24,
    })
    const fileName = checked?.pairs?.author ?? checked?.pairs?.default ?? '诗词'

    const md = service.generateMd(res.list, fileName.toString())
    $q.dialog({
      title: t('global.download.title'),
      message: `${t('global.download.msg')}`,
      cancel: true,
      persistent: true,
    }).onOk(() => {
      service.saveAs(fileName + '.md', md)
    })
  } catch (e) {
    errorNotify(e as Error, { t })
  }
  btnLoading.value = false
}

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

// 自定义字体名称
const fontName = ref('霞鹜文楷 GB')

// 设置自定义字体
function setFont() {
  const fontService = new FontService()
  fontService.setCssFontAuto(fontName.value)
}
</script>

<style lang="scss" scoped>
.page-main {
  max-width: 100%;
  // 为了设置背景
  // height: calc(100vh - 50px);
  font-family: v-bind('fontName');
  &::before {
    content: '';
    width: 100%;
    height: 100%;
    display: block;
    position: fixed;
    left: 0;
    background-image: url('@/assets/images/poem/background.png');
    background-size: 100%;
    filter: opacity(5%);
    z-index: -1;
  }
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
  .q-table__grid-item {
    width: 320px;
    height: 480px;
    padding: 10px;
    .q-table__grid-item-card {
      padding: 35px 30px;
      background-image: url('@/assets/images/poem/poem-bg.jpg');
      background-size: 100% 100%;
    }
  }
  .text-deco-under {
    text-decoration: underline;
  }
  .poem-content {
    white-space: pre-wrap;
  }
}
</style>
