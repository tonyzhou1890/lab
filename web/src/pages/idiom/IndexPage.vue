<template>
  <div class="page-main app">
    <ServiceBaseInfo :service-name="ServiceSchema.i18nKey" />
    <div class="content">
      <div class="search q-pb-md">
        <!-- <q-input
          v-model="filter"
          v-bind="config.field"
          @keyup.enter="() => handleJump()"
          :label="$t('idiom.searchPlaceholder')"
        /> -->
        <q-select
          v-model.trim="filter"
          :options="filteredList"
          v-bind="config.field"
          use-input
          input-debounce="0"
          behavior="menu"
          :label="$t('idiom.searchPlaceholder')"
          @filter="handleFilter"
          @keyup.enter="handleJump()"
          @update:model-value="handleChange"
        ></q-select>
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
      <section class="result-section">
        <q-list
          v-if="result"
          bordered
          separator
          class="result-list text-body1"
        >
          <q-item>
            <q-item-section
              side
              class="text-bold"
              >{{ $t('idiom.data.word') }}</q-item-section
            >
            <q-item-section class="break-all">{{ result.word }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section
              side
              class="text-bold"
              >{{ $t('idiom.data.phonetic') }}</q-item-section
            >
            <q-item-section class="break-all">{{
              result.phonetic
            }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section
              side
              class="text-bold"
              >{{ $t('idiom.data.definition') }}</q-item-section
            >
            <q-item-section class="break-all">{{
              result.definition
            }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section
              side
              class="text-bold"
              >{{ $t('idiom.data.source') }}</q-item-section
            >
            <q-item-section class="break-all">{{
              result.source
            }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section
              side
              class="text-bold"
              >{{ $t('idiom.data.example') }}</q-item-section
            >
            <q-item-section class="break-all">{{
              result.example
            }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section
              side
              class="text-bold"
              >{{ $t('idiom.data.synonyms') }}</q-item-section
            >
            <q-item-section class="break-all">
              <IdiomList
                :list="result.synonyms"
                @search="handleJump"
              />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section
              side
              class="text-bold"
              >{{ $t('idiom.data.antonyms') }}</q-item-section
            >
            <q-item-section class="break-all">
              <IdiomList
                :list="result.antonyms"
                @search="handleJump"
              />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section
              side
              class="text-bold"
              >{{ $t('idiom.data.wisecrack') }}</q-item-section
            >
            <q-item-section class="break-all">{{
              result.wisecrack
            }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section
              side
              class="text-bold"
              >{{ $t('idiom.data.grammar') }}</q-item-section
            >
            <q-item-section class="break-all">{{
              result.grammar
            }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section
              side
              class="text-bold"
              >{{ $t('idiom.data.english') }}</q-item-section
            >
            <q-item-section class="break-all">{{
              result.english
            }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section
              side
              class="text-bold"
              >{{ $t('idiom.data.franch') }}</q-item-section
            >
            <q-item-section class="break-all">{{
              result.franch
            }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section
              side
              class="text-bold"
              >{{ $t('idiom.data.japanese') }}</q-item-section
            >
            <q-item-section class="break-all">{{
              result.japanese
            }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section
              side
              class="text-bold"
              >{{ $t('idiom.data.german') }}</q-item-section
            >
            <q-item-section class="break-all">{{
              result.german
            }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section
              side
              class="text-bold"
              >{{ $t('idiom.data.russian') }}</q-item-section
            >
            <q-item-section class="break-all">{{
              result.russian
            }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section
              side
              class="text-bold"
              >{{ $t('idiom.data.story') }}</q-item-section
            >
            <q-item-section class="break-all">{{
              result.story
            }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section
              side
              class="text-bold"
              >{{ $t('idiom.data.chain') }}</q-item-section
            >
            <q-item-section class="break-all">
              <IdiomList
                :list="result.chain || []"
                @search="handleJump"
              />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section
              side
              class="text-bold"
              >{{ $t('idiom.data.phoneticChain') }}</q-item-section
            >
            <q-item-section class="break-all">
              <IdiomList
                :list="result.phoneticChain || []"
                @search="handleJump"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import IdiomService from '@/core/service/idiom'
import type { IdiomItem } from '@/core/service/idiom/core'
import ServiceSchema from '@/core/service/idiom/schema'
import { useI18n } from 'vue-i18n'
import { errorNotify } from '@/core/error/utils'
import { loading } from '@/core/io/utils'
import IdiomList from './components/IdiomList.vue'
import { useRoute, useRouter, RouteRecordName } from 'vue-router'
import { CoreErrorEnum } from '@/core/error'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'
import { QSelectProps } from 'quasar'

const { t } = useI18n()

const appStore = useAppStore()
const { config } = storeToRefs(appStore)

const route = useRoute()
const router = useRouter()

// 是否初始化完毕
const initialized = ref<boolean>(false)

const service = new IdiomService()

const result = ref<IdiomItem | null>(null)

const filter = ref<string>((route.query.keyword as string) ?? '')
const filteredList = ref<string[]>([])

// 本地依赖初始化
async function localInit() {
  try {
    loading.show()
    initialized.value = await service.initLocalDep()
    loading.hide()
    handleSearch()
  } catch (e) {
    errorNotify(e, { t })
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
    errorNotify(e, { t })
    loading.hide()
  }
}

watch(route, (newValue) => {
  filter.value = newValue.query.keyword as string
  if (initialized.value) {
    handleSearch()
  }
})

const handleFilter: QSelectProps['onFilter'] = (val, update) => {
  update(async () => {
    if (initialized.value) {
      filteredList.value = await service.worker.fuzzySearch(val)
    }
  })
}

function handleChange(val: string) {
  if (val) {
    handleJump(val)
  }
}

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
  console.log(val)
  if (val === filter.value) return
  if (val) {
    filter.value = val
  }
  if (!initialized.value || !filter.value) return
  try {
    loading.show()
    result.value = (await service.worker.searchIdiom(filter.value)) ?? null
    loading.hide()

    if (!result.value) {
      errorNotify(new Error(CoreErrorEnum[200]), { t })
    }
  } catch (e) {
    errorNotify(e as Error, { t })
    loading.hide()
  }
}

onMounted(() => {
  localInit()
})
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
