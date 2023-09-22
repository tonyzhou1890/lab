<template>
  <div class="page-main app">
    <ServiceBaseInfo :service-name="ServiceSchame.i18nKey" />
    <q-form
      ref="formRef"
      @submit="onSubmit"
      class="q-gutter-md form"
    >
      <q-file
        v-model="file"
        :label="$t('favicon.file') + '*'"
        accept=".jp(e)g, .png, .ico, .webp, .svg"
        lazy-rules
        :rules="[
          (val) => (val !== null && val !== '') || $t('global.form.required'),
        ]"
      ></q-file>
      <div class="btns row justify-center">
        <q-btn
          :loading="btnLoading"
          :label="$t('global.form.submit')"
          type="submit"
          color="primary"
        ></q-btn>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import FaviconService from '@/core/service/favicon'
import ServiceSchame from '@/core/service/favicon/schema'
import ServiceBaseInfo from '@/components/ServiceBaseInfo.vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { errorNotify } from '@/core/error/utils'
import { loading } from '@/core/io/utils'

const { t } = useI18n()
const $q = useQuasar()
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

const file = ref<File | null>(null)

const btnLoading = ref<boolean>(false)

async function onSubmit() {
  btnLoading.value = true
  try {
    service.pack = null
    await service.generate(file.value as File)
  } catch (e) {
    errorNotify(e as Error, { t })
  }
  btnLoading.value = false
  if (service.pack) {
    $q.dialog({
      title: t('global.download.title'),
      message: `${t('global.download.msg')}`,
      cancel: true,
      persistent: true,
    }).onOk(() => {
      service.saveAs('favicon.zip', service.pack as Blob)
    })
  }
}

// 转为 ico
// async function handleChangeToIco() {
//   if (!file.value) return
//   try {
//     const buf = await file.value.arrayBuffer()
//     const res = await faviconService.worker.transformFormat(
//       new Uint8Array(buf),
//       MagickFormat.Ico
//     )
//     window.open(URL.createObjectURL(res))
//     console.log(res)
//   } catch (e) {
//     console.log(e)
//   }
// }
</script>

<style lang="scss" scoped>
.page-main {
  .form {
    max-width: 500px;
    margin: 0 auto;
  }
}
</style>
