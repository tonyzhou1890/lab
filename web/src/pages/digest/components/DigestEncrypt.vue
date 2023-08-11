<template>
  <div class="full-width">
    <q-form ref="formRef" @submit="onSubmit" class="q-gutter-md form">
      <!-- 选择是字符串还是文件 -->
      <q-field v-model="formData.type" borderless :label="$t('digest.encryptForm.type')">
        <q-radio name="type" v-model="formData.type" val="string" :label="$t('digest.encryptForm.string')" />
        <q-radio name="type" v-model="formData.type" val="file" :label="$t('digest.encryptForm.file')" />
      </q-field>
      <!-- 字符串 -->
      <q-input v-if="formData.type === 'string'" type="textarea" autogrow v-model="formData.stringInput"
        :label="$t('digest.encryptForm.string') + '*'" lazy-rules
        :rules="[(val) => (val && val.length > 0) || $t('global.form.required')]" />
      <!-- 文件 -->
      <q-file v-else v-model="formData.fileInput" :label="$t('digest.encryptForm.file') + '*'" lazy-rules :rules="[
        (val) => (val !== null && val !== '') || $t('global.form.required')]" />
      <!-- 算法 -->
      <q-select v-model="formData.algorithm" :options="options" :label="$t('digest.encryptForm.algorithm')" />
      <div class="btns row justify-center">
        <q-btn :loading="calculating" :label="$t('digest.start')" type="submit" color="primary"></q-btn>
      </div>
    </q-form>
    <section class="result-section">
      <h2 class="section-title">{{ $t('digest.encryptResult') }}</h2>
      <q-list>
        <q-item v-for="(item) in resultList" :key="item.name">
          <q-item-section class="text-bold">{{ item.name }}</q-item-section>
          <q-item-section>{{ item.value }}</q-item-section>
        </q-item>
      </q-list>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { QForm } from 'quasar'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n';
import digestService from '@/core/service/digest'

interface FormData {
  type: string
  stringInput: string
  fileInput: null | File
  algorithm: string
}

const { t } = useI18n()

const $q = useQuasar()

$q.notify({
  message: t('global.error.Not Found')
})


// 表单实例引用
const formRef = ref<QForm | null>(null)

// 表单数据
const formData = ref<FormData>({
  type: 'string', // string | file
  stringInput: '',
  fileInput: null,
  algorithm: 'md5'
})

const options = ['md5']

const result = ref('')

const calculating = ref(false)

async function onSubmit() {
  // 服务需要初始化
  await digestService.init()
  let source: string | ArrayBuffer = ''
  // 字符串直接使用原值
  if (formData.value.type === 'string') {
    source = formData.value.stringInput
  }
  // 文件需要转为 ArrayBuffer
  if (formData.value.type === 'file') {
    source = await formData.value.fileInput?.arrayBuffer() ?? ''
  }

  if (!source) {
    $q.notify({
      message: t('global.form.inputError'),
      position: 'top'
    })
    return
  }

  calculating.value = true
  const res = await digestService.worker.encrypt(formData.value.algorithm, source)
  if (typeof res === 'string') {
    result.value = res
  } else {
    res.coreErrorMsg
    $q.notify({
      message: t('global.error')
    })
  }

  calculating.value = false
}

// 显示的结果
const resultList = computed(() => {
  // md5 算法，结果四种表现形式，其中 16 位取 32 位结果的 9~24 位
  if (formData.value.algorithm === 'md5') {
    const upperResult = result.value.toUpperCase()
    return [
      {
        name: t('digest.md5.lower16'),
        value: result.value.substring(8, 24)
      },
      {
        name: t('digest.md5.upper16'),
        value: upperResult.substring(8, 24)
      },
      {
        name: t('digest.md5.lower32'),
        value: result.value
      },
      {
        name: t('digest.md5.upper32'),
        value: upperResult
      }
    ]
  }
  return []
})
</script>

<style lang="scss" scoped>
.form {
  max-width: 500px;
  margin: 0 auto;
}
</style>
