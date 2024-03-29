<template>
  <div class="full-width">
    <q-form
      ref="formRef"
      @submit="onSubmit"
      v-bind="config.form"
      class="ovh"
    >
      <!-- 摘要密文 -->
      <q-input
        type="textarea"
        autogrow
        v-bind="config.field"
        v-model="formData.stringInput"
        :label="$t('digest.decryptForm.string') + '*'"
        :rules="[
          (val) => (val && val.length > 0) || $t('global.form.required'),
        ]"
      />
      <!-- 原字符串最大长度 -->
      <q-field
        v-model="formData.sourceLength"
        v-bind="config.field"
        borderless
        :label="$t('digest.decryptForm.sourceLength') + '*'"
      >
        <q-slider
          v-model="formData.sourceLength"
          :min="1"
          :max="20"
          label-always
        ></q-slider>
      </q-field>
      <!-- 字符集 -->
      <q-select
        v-model="formData.charsetKeys"
        :options="charsetOptions"
        multiple
        v-bind="config.field"
        emit-value
        map-options
        :label="$t('digest.decryptForm.charset') + '*'"
        :rules="[
          (val) => (val && val.length > 0) || $t('global.form.required'),
        ]"
      />
      <!-- 算法 -->
      <q-select
        v-model="formData.algorithm"
        v-bind="config.field"
        :options="options"
        :label="$t('digest.decryptForm.algorithm')"
      />
      <div class="btns row justify-center">
        <q-btn
          v-if="!decrypting"
          :label="$t('digest.start')"
          type="submit"
          color="primary"
        ></q-btn>
        <q-btn
          v-else
          :label="$t('digest.stop')"
          @click="handleStop"
          color="primary"
        ></q-btn>
      </div>
    </q-form>
    <section class="result-section">
      <section-title>{{ $t('digest.encryptResult') }}</section-title>
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
import { charset, decryptTypes } from '@/core/service/digest'
import digestService from '@/core/service/digest'
import serviceSchema from '@/core/service/digest/schema'
import type { DecryptCallbackParameter } from '@/core/service/digest'
import { errorNotify } from '@/core/error/utils'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'

interface FormData {
  stringInput: string
  sourceLength: number
  algorithm: string
  charsetKeys: string[]
}

const { t } = useI18n()

const appStore = useAppStore()
const { config } = storeToRefs(appStore)

// 表单实例引用
const formRef = ref<QForm | null>(null)

// 表单数据
const formData = ref<FormData>({
  stringInput: '',
  sourceLength: 6,
  algorithm: 'md5',
  charsetKeys: [],
})

// 可用算法
const options = decryptTypes.map((item) => item.name)

// 字符集
const charsetOptions = computed(() => {
  return charset.map((item) => {
    return {
      value: item.name,
      label: t(`digest.charset.${item.name}`),
    }
  })
})

const result = ref({
  total: 0n,
  checkedItems: 0n,
  speed: 0n,
  result: '',
  timeRemaining: 0n,
})

// 运行中
const decrypting = ref(false)

// 停止回调，由解码函数返回
let stop: null | (() => void) = null

// 解码进度回调
function decryptCallback(data: DecryptCallbackParameter): void {
  // 错误处理
  if (data.error) {
    errorNotify(data.error, {
      i18nKey: serviceSchema.i18nKey,
      t,
    })
    decrypting.value = false
  } else {
    // 结果显示
    result.value.total = data.total
    result.value.checkedItems = data.checkedItems
    result.value.speed = data.speed
    result.value.timeRemaining = data.timeRemaining

    if (data.result || data.checkedItems === data.total) {
      decrypting.value = false
      result.value.result = data.result || t('digest.notFound')
    }
  }
  // handleStop()
}

async function onSubmit(): Promise<void> {
  // 服务需要初始化
  await digestService.init()
  // 设置字符
  const chars: string[] = []
  formData.value.charsetKeys.map((key) => {
    chars.push(...(charset.find((item) => item.name === key)?.chars ?? []))
  })

  decrypting.value = true

  stop = digestService.decrypt(
    formData.value.algorithm,
    formData.value.stringInput.toLowerCase(),
    formData.value.sourceLength,
    chars,
    decryptCallback
  )
}

function handleStop() {
  stop?.()
  decrypting.value = false
}

// 显示的结果
const resultList = computed(() => {
  const v = result.value
  return [
    {
      name: t('digest.calculating'),
      value: `${v.checkedItems} / ${v.total}`,
      _id: Math.random(),
    },
    {
      name: t('digest.speed'),
      value: `${v.speed} / s`,
      _id: Math.random(),
    },
    {
      name: t('digest.timeRemaining'),
      value: `${v.timeRemaining} s`,
      _id: Math.random(),
    },
    {
      name: t('digest.result'),
      value: v.result,
      _id: Math.random(),
    },
  ]
})
</script>
