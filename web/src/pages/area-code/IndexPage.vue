<template>
  <div class="page-main app">
    <ServiceBaseInfo :service-name="ServiceSchame.i18nKey" />
    <div class="content">
      <q-input
        filled
        v-model="filter"
        :label="$t('areaCode.searchPlaceholder')"
      />
      <q-tree
        :nodes="tree"
        :filter="filter"
        :filter-method="filterMethod"
        default-expand-all
        node-key="label"
        ref="treeEl"
      >
        <template v-slot:default-header="prop">
          <div class="row items-center">
            <span class="text-weight-bold">
              {{ prop.node.label }}
            </span>
            <span> （{{ prop.node.code }}） </span>
          </div>
        </template>
      </q-tree>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import AreaCodeService from '@/core/service/area-code'
import { AreaCodeTreeNode } from '@/core/service/area-code/core'
import ServiceSchame from '@/core/service/area-code/schema'
import ServiceBaseInfo from '@/components/ServiceBaseInfo.vue'
import { useI18n } from 'vue-i18n'
import { errorNotify } from '@/core/error/utils'
import { loading } from '@/core/io/utils'
import { QTree } from 'quasar'

const { t } = useI18n()
// 是否初始化完毕
const initialed = ref<boolean>(false)

const service = new AreaCodeService()

const tree = ref<AreaCodeTreeNode[]>([])

const filter = ref<string>('')

const treeEl = ref<QTree | null>(null)

// 挂载
onMounted(async () => {
  await init()
  nextTick(() => {
    treeEl?.value?.expandAll()
  })
  console.log(tree)
})

// 初始化
async function init() {
  try {
    loading.show()
    await service.init()
    tree.value = service.getData()
    initialed.value = true

    loading.hide()
  } catch (e) {
    errorNotify(e as Error, { t })
    loading.hide()
  }
}

/**
 * 过滤节点
 */
function filterMethod(node: AreaCodeTreeNode, filter: string) {
  return node.label.includes(filter) || node.code.includes(filter)
}
</script>

<style lang="scss" scoped>
.page-main {
  .content {
    max-width: 500px;
    margin: 0 auto;
  }
}
</style>
