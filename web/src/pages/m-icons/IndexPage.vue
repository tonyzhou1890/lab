<template>
  <div class="page-main app">
    <ServiceBaseInfo :service-name="ServiceSchame.i18nKey" />
    <div class="content">
      <q-input
        class="search-input"
        outlined
        v-model="filter"
        :label="$t('mIcons.searchPlaceholder')"
      />
      <div class="content">
        <q-tabs
          v-model="currTab"
          class="text-teal"
        >
          <q-tab
            v-for="tab in tabList"
            :key="tab.key"
            :name="tab.key"
            :label="tab.label"
          ></q-tab>
        </q-tabs>

        <q-tab-panels
          class="bg-transparent"
          keep-alive
          v-model="currTab"
          animated
          swipeable
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel
            v-for="tab in tabList"
            :key="tab.key"
            :name="tab.key"
            class="icons-tab row"
          >
            <div
              v-for="icon in tab.icons"
              :key="icon.label"
              class="column items-center col-xs-12 col-sm-6 col-md-4"
            >
              <q-icon
                class="icon"
                :name="icon.icon"
              ></q-icon>
              <p class="label text-grey full-width text-center">
                {{ icon.label }}
              </p>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import type { IconsData } from '@/core/service/m-icons/core'
import MdIconsService from '@/core/service/m-icons'
import ServiceSchame from '@/core/service/m-icons/schema'
import ServiceBaseInfo from '@/components/ServiceBaseInfo.vue'
import { useI18n } from 'vue-i18n'
import { errorNotify } from '@/core/error/utils'
import { loading } from '@/core/io/utils'

const { t } = useI18n()
// 是否初始化完毕
const initialized = ref<boolean>(false)

const service = new MdIconsService()

const filter = ref<string>('')

const data = ref<IconsData[]>([])
const currTab = ref('')

const tabList = computed(() => {
  const res = service.filterList(data.value, filter.value, t)
  console.log(res)
  return res
})

// 挂载
onMounted(async () => {
  await init()
})

// 初始化
async function init() {
  try {
    loading.show()
    await service.init()
    data.value = service.getData()
    if (data.value.length) {
      currTab.value = data.value[0].key
    }
    console.log(data.value)
    initialized.value = true

    loading.hide()
  } catch (e) {
    errorNotify(e as Error, { t })
    loading.hide()
  }
}
</script>

<style lang="scss" scoped>
.page-main {
  .content {
    .search-input {
      max-width: 500px;
      margin: 0 auto;
    }
    .icons-tab {
      .icon {
        font-size: 3rem;
      }
      .label {
        font-size: 1.4rem;
        word-break: break-all;
      }
    }
  }
}
</style>
