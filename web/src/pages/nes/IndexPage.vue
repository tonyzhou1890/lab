<template>
  <div class="page-main app no-margin">
    <ServiceBaseInfo service-name="nes" />
    <div class="content">
      <div class="search-input">
        <q-input
          v-model.trim="filter"
          v-bind="config.field"
          @keyup.enter="() => handleSearch()"
          :label="$t('nes.searchPlaceholder')"
        />
      </div>

      <q-table
        v-if="nesList?.length"
        virtual-scroll
        flat
        grid
        bordered
        :virtual-scroll-sticky-size-start="48"
        row-key="index"
        :rows="nesList"
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
                <span
                  class="item-size absolute-top-right q-pa-xs text-caption text-white"
                  v-if="props.row.compressedSize"
                  >{{ format.humanStorageSize(props.row.compressedSize) }}</span
                >
                <div class="q-table__grid-item-row nes-cover">
                  <div
                    class="q-table__grid-item-value fit flex items-center justify-center"
                  >
                    <q-img
                      v-if="props.row.cover"
                      :src="props.row.cover"
                      class="cover-img fit"
                    ></q-img>
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
                      props.row.name
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
import { onMounted, ref, computed } from 'vue'
import NesService from '@/core/service/nes'
import { SourceItemCfg } from '@/core/typings/general-types'
import { useI18n } from 'vue-i18n'
import { errorNotify } from '@/core/error/utils'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'
import { type QTableProps, format } from 'quasar'

const { t } = useI18n()

const appStore = useAppStore()
const { config } = storeToRefs(appStore)

const router = useRouter()

const filter = ref<string>('')

const nesList = ref<SourceItemCfg[]>([])

const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0,
})

const service = new NesService()

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
    handleSearch()
  } catch (e) {
    errorNotify(e, { t })
  }
})

// 搜索
function handleSearch() {
  const res = service.search({
    keyword: filter.value,
    page: pagination.value.page,
    size: pagination.value.rowsPerPage,
  })
  nesList.value = res.list
  pagination.value.rowsNumber = res.total
}

// 表格切换页码之类的
const onTableRequest: QTableProps['onRequest'] = (prop) => {
  pagination.value.page = prop.pagination.page ?? 1
  pagination.value.rowsPerPage = prop.pagination.rowsPerPage ?? 10
  handleSearch()
}

function handleToRun(item: SourceItemCfg) {
  console.log(item)
  const { href } = router.resolve({
    name: 'NesRun',
    query: {
      path: item.path,
      name: item.name,
      'v-header-subtitle': item.name,
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
    .item-size {
      display: inline-block;
      background-color: rgba($color: #000000, $alpha: 0.3);
      z-index: 1;
    }
    .q-table__grid-item-card {
      padding: 0;
    }
    .nes-cover {
      width: 100%;
      height: 224px;
      vertical-align: middle;
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
    .nes-list {
      .nes-item {
        width: calc(100% - 32px);
      }
    }
  }
}
</style>
