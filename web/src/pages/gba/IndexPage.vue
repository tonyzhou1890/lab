<template>
  <div class="page-main app no-margin">
    <ServiceBaseInfo service-name="gba" />
    <div class="content">
      <div class="search-input flex column">
        <q-input
          v-model.trim="filter"
          v-bind="config.field"
          @keyup.enter="handleJump()"
          :label="$t('gba.searchPlaceholder')"
        />
      </div>

      <div
        v-if="tags?.length > 1"
        class="row flex justify-center q-mt-md q-gutter-md"
      >
        <q-btn
          v-for="item in tags"
          :key="item"
          rounded
          color="primary"
          dense
          class="q-px-md"
          @click="handleJump(`/tag:${item}`)"
          >{{ item }}</q-btn
        >
      </div>
      <q-table
        v-if="gameList?.length"
        virtual-scroll
        flat
        grid
        bordered
        :virtual-scroll-sticky-size-start="48"
        row-key="index"
        :rows="gameList"
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
              class="q-table__grid-item-card q-table__card fit text-center cp"
              @click="handleToRun(props.row)"
            >
              <div
                class="q-table__grid-item-card-inner fit ovh relative-position"
              >
                <!-- tags -->
                <div
                  class="item-tags absolute-top-left text-caption text-white"
                >
                  <!-- 语言 -->
                  <span
                    v-for="lang in props.row.lang || []"
                    :key="lang"
                    class="item-tag q-pa-xs"
                    >{{ $t(`global.lang.${lang}`) }}</span
                  >
                  <!-- 版本 -->
                  <span
                    v-for="edition in props.row.edition || []"
                    :key="edition"
                    class="item-tag q-pa-xs"
                    >{{ edition }}</span
                  >
                </div>
                <!-- 大小 -->
                <span
                  class="item-size absolute-top-right q-pa-xs text-caption text-white"
                  v-if="props.row.compressedSize"
                  >{{ format.humanStorageSize(props.row.compressedSize) }}</span
                >
                <div class="q-table__grid-item-row game-cover">
                  <div
                    class="q-table__grid-item-value fit flex items-center justify-center"
                  >
                    <q-img
                      v-if="props.row.cover"
                      :src="props.row.cover"
                      class="cover-img fit"
                    >
                      <template v-slot:error>
                        <div
                          class="fit flex justify-center items-center bg-white"
                        >
                          <q-icon
                            color="grey-4"
                            class="text-h1 cp img-inner-icon"
                            name="videogame_asset"
                          >
                          </q-icon>
                        </div>
                      </template>
                    </q-img>
                    <q-icon
                      v-else
                      color="grey-4"
                      class="text-h1 cp"
                      name="videogame_asset"
                    ></q-icon>
                  </div>
                </div>
                <div class="q-table__grid-item-row name-row">
                  <div
                    class="q-table__grid-item-value ellipsis q-pa-xs bg-primary"
                    :title="props.row.name"
                  >
                    <span class="text-body1 text-white">{{
                      removeBraceletsContent(props.row.name || '')
                    }}</span>
                  </div>
                </div>
              </div>
            </q-card>
          </div>
        </template>
      </q-table>
      <div
        v-else
        class="no-data-notice q-pt-md column tac"
      >
        <p class="text-h4 text-grey">{{ $t('global.content.noData') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import GBAService from '@/core/service/gba'
import { SourceItemCfg } from '@/core/typings/general-types'
import { useI18n } from 'vue-i18n'
import { errorNotify } from '@/core/error/utils'
import { useRoute, useRouter, type RouteRecordName } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'
import { CoreErrorEnum } from '@/core/error'
import searchPatternCheck from 'allbox/dist/other.search-pattern-check'
import { type QTableProps, format } from 'quasar'
import { removeBraceletsContent, replaceArrayWithMap } from '@/core/utils'

const { t } = useI18n()

const appStore = useAppStore()
const { config } = storeToRefs(appStore)

const route = useRoute()
const router = useRouter()

const filter = ref<string>('')

const gameList = ref<SourceItemCfg[]>([])

const tags = ref<string[]>([])
const langMap = ref<{ [x: string]: string }>({})

const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0,
})

const service = new GBAService()

// 表格的表头
const columns = computed<QTableProps['columns']>(() => [
  {
    name: 'cover',
    label: 'cover',
    field: 'cover',
  },
  {
    name: 'name',
    label: 'name',
    field: 'name',
  },
  {
    name: 'size',
    label: 'size',
    field: 'compressedSize',
  },
])

onMounted(async () => {
  try {
    await service.init()
    tags.value = [
      ...service.gameIndex.langList.map((item) => {
        const str = t(`global.lang.${item}`)
        langMap.value[str] = item
        return str
      }),
      ...service.gameIndex.editionList,
    ]
    handleSearch()
  } catch (e) {
    errorNotify(e, { t })
  }
})

watch(route, (newValue) => {
  filter.value = (newValue.query.keyword as string) ?? ''

  pagination.value.page = 1
  handleSearch()
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
function handleSearch() {
  // 检查搜索条件
  const checked = searchPatternCheck(
    service.searchCfg,
    filter.value ?? '',
    true
  )

  if (!checked.valid) {
    return errorNotify(new Error(CoreErrorEnum[203]), { t })
  }
  const res = service.search({
    keyword: (checked?.pairs?.default as string) ?? '',
    tags: replaceArrayWithMap(
      (checked?.pairs?.tag as string[]) ?? [],
      langMap.value
    ),
    page: pagination.value.page,
    size: pagination.value.rowsPerPage,
  })
  gameList.value = res.list
  pagination.value.rowsNumber = res.total
}

// 表格切换页码之类的
const onTableRequest: QTableProps['onRequest'] = (prop) => {
  pagination.value.page = prop.pagination.page ?? 1
  pagination.value.rowsPerPage = prop.pagination.rowsPerPage ?? 10
  handleSearch()
}

function handleToRun(item: SourceItemCfg) {
  const { href } = router.resolve({
    name: 'GBARun',
    query: {
      path: item.path,
      name: item.name,
      'v-header-subtitle': removeBraceletsContent(item.name || ''),
    },
  })
  window.open(href, '_blank')
}
</script>

<style lang="scss" scoped>
.page-main {
  max-width: 100%;
  background-color: $orange-1;
  min-height: calc(100vh - 50px);
  .search-input {
    max-width: 500px;
    margin: 0 auto;
  }
  .q-table__grid-item {
    width: 276px;
    padding: 10px;
    .item-tags,
    .item-size {
      display: inline-block;
      background-color: rgba($color: #000000, $alpha: 0.5);
      z-index: 1;
    }
    .item-tag {
      display: block;
    }
    .q-table__grid-item-card {
      padding: 0;
    }
    .game-cover {
      width: 100%;
      height: 224px;
      vertical-align: middle;
      // .img-inner-icon {
      //   margin-top: 50%;
      //   transform: translateY(-50%);
      // }
      .cover-img {
        vertical-align: middle;
      }
    }
    .name-row {
      margin-top: 0;
    }
  }
}

@media screen and (max-width: 420px) {
  .page-main {
    .game-list {
      .game-item {
        width: calc(100% - 32px);
      }
    }
  }
}
</style>
