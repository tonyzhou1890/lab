<template>
  <div class="full-width">
    <q-form
      ref="formRef"
      @submit="onSubmit"
      v-bind="config.form"
    >
      <!-- 字符串 -->
      <q-input
        type="textarea"
        autogrow
        v-bind="config.field"
        v-model="formData.stringInput"
        :label="$t('qrcode.genForm.string') + '*'"
        maxlength="300"
        counter
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
      <section-title>{{ $t('qrcode.qrcode') }}</section-title>
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
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'

interface FormData {
  stringInput: string
}

const $q = useQuasar()

const appStore = useAppStore()
const { config } = storeToRefs(appStore)

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
