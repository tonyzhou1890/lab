<template>
  <div class="full-width">
    <q-form
      ref="formRef"
      @submit="onSubmit"
      v-bind="config.form"
    >
      <!-- 文件 -->
      <q-file
        v-model="formData.fileInput"
        :label="$t('qrcode.recognizeForm.file') + '*'"
        accept="image/png, image/jpeg, image/webp"
        v-bind="config.field"
        :rules="[
          (val) => (val !== null && val !== '') || $t('global.form.required'),
        ]"
      />
      <div class="btns row justify-center">
        <q-btn
          :loading="calculating"
          :label="$t('global.form.submit')"
          type="submit"
          color="primary"
        ></q-btn>
      </div>
    </q-form>
    <section class="result-section">
      <section-title>{{ $t('qrcode.recognizeResult') }}</section-title>
      <q-list>
        <q-item class="result">
          <q-item-section class="break-all">{{ result }}</q-item-section>
        </q-item>
      </q-list>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { QForm } from 'quasar'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import qrcodeService from '@/core/service/qrcode'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'

interface FormData {
  fileInput: null | File
}

const { t } = useI18n()

const appStore = useAppStore()
const { config } = storeToRefs(appStore)

const $q = useQuasar()

// 表单实例引用
const formRef = ref<QForm | null>(null)

// 表单数据
const formData = ref<FormData>({
  fileInput: null,
})

const result = ref('')

const calculating = ref(false)

async function onSubmit() {
  calculating.value = true

  const res = await qrcodeService.QrScanner.scanImage(
    formData.value.fileInput as File
  ).catch((e) => {
    console.log(e)
    $q.notify(t('qrcode.error.' + e) || t('qrcode.error.No QR code found'))
  })

  if (res) {
    result.value = res
  }

  calculating.value = false
}
</script>

<style lang="scss" scoped>
.form,
.result {
  max-width: 500px;
  margin: 0 auto;
}
</style>
