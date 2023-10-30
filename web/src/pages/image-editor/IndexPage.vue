<template>
  <div class="page-main app">
    <div class="menu-bar"></div>
    <div class="body-wrapper">
      <div class="left-panel"></div>
      <div class="scene"></div>
      <div class="right-panel"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import FaviconService from '@/core/service/favicon'
import { useI18n } from 'vue-i18n'
import { errorNotify } from '@/core/error/utils'
import { loading } from '@/core/io/utils'

const { t } = useI18n()
// 是否初始化完毕
const initialed = ref<boolean>(false)

const service = new FaviconService()

// 挂载
onMounted(async () => {
  await init()
})

// 初始化
async function init() {
  try {
    loading.show()
    await service.init({
      loadCallback: loading.update,
    })
    initialed.value = true

    loading.hide()
  } catch (e) {
    errorNotify(e as Error, { t })
  }
}
</script>

<style lang="scss" scoped>
.page-main {
  .form {
    max-width: 500px;
    margin: 0 auto;
  }
}
</style>
