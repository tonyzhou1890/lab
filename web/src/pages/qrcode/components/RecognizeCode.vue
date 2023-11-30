<template>
  <div class="full-width">
    <q-form
      ref="formRef"
      @submit="onSubmit"
      class="form"
    >
      <!-- 文件 -->
      <q-file
        v-model="formData.fileInput"
        :label="$t('qrcode.recognizeForm.file') + '*'"
        lazy-rules
        accept="image/png, image/jpeg, image/webp"
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
      <h2 class="section-title">{{ $t('qrcode.recognizeResult') }}</h2>
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

interface FormData {
  fileInput: null | File
}

const { t } = useI18n()

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
