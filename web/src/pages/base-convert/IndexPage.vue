<template>
  <div class="page-main app">
    <ServiceBaseInfo :service-name="ServiceSchame.i18nKey" />
    <div class="content">
      <q-form
        ref="formRef"
        @submit="onSubmit"
        class="q-gutter-md form"
      >
        <!-- 源进制 -->
        <q-select
          v-model="formData.sourceBase"
          :options="baseOptions"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          :label="$t('baseConvert.sourceBase')"
        />
        <q-input
          v-if="formData.sourceBase === 37"
          v-model.trim="formData.sourceBaseStr"
          @update:model-value="
            (val) => handleUpdateBaseStr(val, 'sourceBaseStr')
          "
          :rules="[
            (val) => (val && val.length > 0) || $t('global.form.required'),
          ]"
          :placeholder="$t('baseConvert.baseNumsInput')"
        />
        <!-- 源数据 -->
        <q-input
          type="textarea"
          autogrow
          v-model="formData.stringInput"
          class="textarea ova"
          :label="$t('baseConvert.source') + '*'"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || $t('global.form.required'),
          ]"
        />
        <!-- 目标进制 -->
        <q-select
          v-model="formData.targetBase"
          :options="baseOptions"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          :label="$t('baseConvert.targetBase')"
        />
        <q-input
          v-if="formData.targetBase === 37"
          v-model.trim="formData.targetBaseStr"
          @update:model-value="
            (val) => handleUpdateBaseStr(val, 'targetBaseStr')
          "
          :rules="[
            (val) => (val && val.length > 0) || $t('global.form.required'),
          ]"
          :placeholder="$t('baseConvert.baseNumsInput')"
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
        <h2 class="section-title">{{ $t('global.form.result') }}</h2>
        <div class="result ova break-all">
          {{ result }}
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ServiceSchame from '@/core/service/base-convert/schema'
import BaseConvertService from '@/core/service/base-convert'
import ServiceBaseInfo from '@/components/ServiceBaseInfo.vue'
import { errorNotify } from '@/core/error/utils'

const { t } = useI18n()

const service = new BaseConvertService()

const baseOptions = service.baseList.map((item) => {
  return {
    label:
      (item === 37 ? t('baseConvert.custom') : item) + t('baseConvert.base'),
    value: item,
  }
})

const formData = ref<{
  sourceBase: number
  sourceBaseStr: string
  stringInput: string
  targetBase: number
  targetBaseStr: string
}>({
  sourceBase: 10,
  sourceBaseStr: '',
  stringInput: '',
  targetBase: 2,
  targetBaseStr: '',
})

const result = ref<string>('')

function onSubmit() {
  try {
    result.value = service.convert(
      formData.value.stringInput,
      formData.value.sourceBase,
      formData.value.targetBase,
      formData.value.sourceBaseStr,
      formData.value.targetBaseStr
    )
  } catch (e) {
    errorNotify(e, { t })
  }
}

function handleUpdateBaseStr(val: any, key: 'sourceBaseStr' | 'targetBaseStr') {
  formData.value[key] = service.purifyBaseStr(String(val ?? ''))
}
</script>

<style lang="scss" scoped>
.page-main {
  .content {
    .form {
      max-width: 500px;
      margin: 0 auto;
    }
  }
}
</style>
