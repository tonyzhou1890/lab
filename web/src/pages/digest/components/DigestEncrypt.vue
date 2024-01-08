<template>
  <div class="full-width">
    <q-form
      ref="formRef"
      @submit="onSubmit"
      v-bind="config.form"
    >
      <!-- 选择是字符串还是文件 -->
      <q-field
        v-model="formData.type"
        borderless
        v-bind="config.field"
        :label="$t('digest.encryptForm.type')"
      >
        <q-radio
          name="type"
          v-model="formData.type"
          val="string"
          :label="$t('digest.encryptForm.string')"
        />
        <q-radio
          name="type"
          v-model="formData.type"
          val="file"
          :label="$t('digest.encryptForm.file')"
        />
      </q-field>
      <!-- 字符串 -->
      <q-input
        v-if="formData.type === 'string'"
        type="textarea"
        autogrow
        v-bind="config.field"
        v-model="formData.stringInput"
        :label="$t('digest.encryptForm.string') + '*'"
        :rules="[
          (val) => (val && val.length > 0) || $t('global.form.required'),
        ]"
      />
      <!-- 文件 -->
      <q-file
        v-else
        v-model="formData.fileInput"
        v-bind="config.field"
        :label="$t('digest.encryptForm.file') + '*'"
        :rules="[
          (val) => (val !== null && val !== '') || $t('global.form.required'),
        ]"
      />
      <!-- 算法 -->
      <q-select
        v-model="formData.algorithm"
        v-bind="config.field"
        :options="options"
        :label="$t('digest.encryptForm.algorithm')"
      />
      <div class="btns row justify-center">
        <q-btn
          :loading="calculating"
          :label="$t('digest.start')"
          type="submit"
          color="primary"
        ></q-btn>
      </div>
    </q-form>
    <section class="result-section">
      <SectionTitle>{{ $t('digest.encryptResult') }}</SectionTitle>
      <q-list class="text-body1">
        <q-item
          v-for="item in resultList"
          :key="item._id"
        >
          <q-item-section class="text-bold col-4 col-md-6">{{
            item.name
          }}</q-item-section>
          <q-item-section class="break-all">{{ item.value }}</q-item-section>
        </q-item>
      </q-list>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { QForm } from 'quasar'
import { useI18n } from 'vue-i18n'
import digestService, { encryptTypes } from '@/core/service/digest'
import { errorNotify } from '@/core/error/utils'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'

interface FormData {
  type: string
  stringInput: string
  fileInput: null | File
  algorithm: string
}

const { t } = useI18n()

const appStore = useAppStore()
const { config } = storeToRefs(appStore)

// 表单实例引用
const formRef = ref<QForm | null>(null)

// 表单数据
const formData = ref<FormData>({
  type: 'string', // string | file
  stringInput: '',
  fileInput: null,
  algorithm: 'md5',
})

function copyForm() {
  return {
    type: formData.value.type,
    stringInput: formData.value.type,
    fileInput: formData.value.fileInput,
    algorithm: formData.value.algorithm,
  }
}

const oldFormData = ref<FormData>(copyForm())

const options = encryptTypes.map((item) => item.name)

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
    source = (await formData.value.fileInput?.arrayBuffer()) ?? ''
  }

  oldFormData.value = copyForm()

  console.log('submit')

  calculating.value = true

  try {
    const res = await digestService.worker.encrypt(
      formData.value.algorithm,
      source
    )
    result.value = res || ''
  } catch (e) {
    errorNotify(e, {
      t,
      i18nKey: 'digest',
    })
  }

  calculating.value = false
}

// 显示的结果
const resultList = computed(() => {
  const algorithm = oldFormData.value.algorithm
  // md5 算法，结果四种表现形式，其中 16 位取 32 位结果的 9~24 位
  if (algorithm === 'md5') {
    const upperResult = result.value.toUpperCase()
    return [
      {
        name: t('digest.md5.lower16'),
        value: result.value.substring(8, 24),
        _id: Math.random(),
      },
      {
        name: t('digest.md5.upper16'),
        value: upperResult.substring(8, 24),
        _id: Math.random(),
      },
      {
        name: t('digest.md5.lower32'),
        value: result.value,
        _id: Math.random(),
      },
      {
        name: t('digest.md5.upper32'),
        value: upperResult,
        _id: Math.random(),
      },
    ]
  } else if (
    [
      'sha1',
      'sha256',
      'sha512',
      'sha3-224',
      'sha3-256',
      'sha3-384',
      'sha3-512',
    ].includes(algorithm)
  ) {
    // sha 算法
    return [
      {
        _id: Math.random(),
        name: t('digest.sha.lower'),
        value: result.value,
      },
      {
        _id: Math.random(),
        name: t('digest.sha.upper'),
        value: result.value.toUpperCase(),
      },
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
