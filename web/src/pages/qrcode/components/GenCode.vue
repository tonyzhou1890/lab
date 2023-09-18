<template>
  <div class="full-width">
    <q-form
      ref="formRef"
      @submit="onSubmit"
      class="q-gutter-md form"
    >
      <!-- 字符串 -->
      <q-input
        type="textarea"
        autogrow
        v-model="formData.stringInput"
        :label="$t('qrcode.genForm.string') + '*'"
        lazy-rules
        maxlength="300"
        :rules="[
          (val) => (val && val.length > 0) || $t('global.form.required'),
        ]"
      />
      <div class="btns row justify-center">
        <q-btn
          :label="$t('global.form.submit')"
          type="submit"
          color="primary"
        ></q-btn>
      </div>
    </q-form>
    <section class="result-section">
      <h2 class="section-title">{{ $t('qrcode.qrcode') }}</h2>
      <div class="content tac">
        <canvas ref="canvasRef"></canvas>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { QForm } from 'quasar'
import { useQuasar } from 'quasar'
import qrcodeService from '@/core/service/qrcode'

interface FormData {
  stringInput: string
}

const $q = useQuasar()

// 表单实例引用
const formRef = ref<QForm | null>(null)

// 表单数据
const formData = ref<FormData>({
  stringInput: '',
})

const canvasRef = ref<HTMLCanvasElement | null>(null)

async function onSubmit() {
  // 服务需要初始化
  try {
    await qrcodeService.QrCode.toCanvas(
      canvasRef.value as HTMLCanvasElement,
      formData.value.stringInput,
      {
        width: 300,
        margin: 2,
      }
    )
  } catch (e) {
    $q.notify((e as Error).message)
  }
}
</script>

<style lang="scss" scoped>
.form {
  max-width: 500px;
  margin: 0 auto;
}
</style>
