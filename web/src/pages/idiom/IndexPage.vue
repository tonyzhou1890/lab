<template>
  <div class="page-main app">
    <ServiceBaseInfo :service-name="ServiceSchame.i18nKey" />
    <div class="content">
      <div class="search q-pb-md">
        <q-input
          filled
          v-model="filter"
          @keyup.enter="() => handleSearch()"
          :label="$t('idiom.searchPlaceholder')"
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
                @search="handleSearch"
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
                @search="handleSearch"
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
                @search="handleSearch"
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
                @search="handleSearch"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import IdiomService from '@/core/service/idiom'
import type { IdiomItem } from '@/core/service/idiom/core'
import ServiceSchame from '@/core/service/idiom/schema'
import ServiceBaseInfo from '@/components/ServiceBaseInfo.vue'
import { useI18n } from 'vue-i18n'
import { errorNotify } from '@/core/error/utils'
import { loading } from '@/core/io/utils'
import IdiomList from './components/IdiomList.vue'

const { t } = useI18n()
// 是否初始化完毕
const initialized = ref<boolean>(false)

const service = new IdiomService()

const result = ref<IdiomItem | null>(null)

const filter = ref<string>('')

// 本地依赖初始化
async function localInit() {
  try {
    loading.show()
    initialized.value = await service.initLocalDep()
    loading.hide()
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
  } catch (e) {
    errorNotify(e, { t })
    loading.hide()
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
