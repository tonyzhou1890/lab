<template>
  <div class="page-main app">
    <ServiceBaseInfo :service-name="ServiceSchame.i18nKey" />
    <div class="content ova">
      <div class="table-wrapper">
        <div class="row table-row">
          <div
            v-for="item in 18"
            :key="item"
            class="col table-col col-index tac text-bold"
          >
            <p class="col-index-text">{{ item }}</p>
          </div>
        </div>
        <div
          v-for="(row, rIdx) in tableData"
          :key="rIdx"
          class="row table-row"
        >
          <div
            v-for="(el, cIdx) in row"
            :key="cIdx"
            class="col table-col"
          >
            <ElementCell
              :data="el"
              :cellIndex="rIdx * 18 + cIdx"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PeriodicTableOfElementsService from '@/core/service/periodic-table-of-elements'
import { ElementData } from '@/core/service/periodic-table-of-elements/core'
import ServiceSchame from '@/core/service/periodic-table-of-elements/schema'
import ServiceBaseInfo from '@/components/ServiceBaseInfo.vue'
import { useI18n } from 'vue-i18n'
import { errorNotify } from '@/core/error/utils'
import { loading } from '@/core/io/utils'
import ElementCell from './components/ElementCell.vue'

const { t } = useI18n()
// 是否初始化完毕
const initialized = ref<boolean>(false)

const service = new PeriodicTableOfElementsService()

const tableData = ref<ElementData[][]>([])

// 挂载
onMounted(async () => {
  await init()
})

// 初始化
async function init() {
  try {
    loading.show()
    await service.init()
    tableData.value = service.getData()
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
    max-width: 1500px;
    margin: 0 auto;
    .table-wrapper {
      min-width: 1000px;
    }
    .table-row {
      white-space: nowrap;
      .table-col {
        display: inline-block;
        width: calc(1 / 18);
        height: 90px;
        padding: 2px;
        box-sizing: border-box;
        overflow: hidden;
      }
      .col-index {
        height: 30px;
      }
    }
  }
}
</style>
