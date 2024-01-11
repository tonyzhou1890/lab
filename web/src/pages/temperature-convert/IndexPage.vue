<template>
  <div class="page-main app">
    <ServiceBaseInfo :service-name="ServiceSchame.i18nKey" />
    <div class="content">
      <q-form
        ref="formRef"
        @submit="onSubmit"
        v-bind="config.form"
      >
        <!-- 源温度 -->
        <q-select
          v-model="formData.sourceType"
          :options="typeOptions"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          v-bind="config.field"
          :label="$t('temperatureConvert.sourceType')"
        />
        <!-- 源数据 -->
        <q-input
          type="number"
          v-bind="config.field"
          v-model.number="formData.stringInput"
          :label="$t('temperatureConvert.sourceInput') + '*'"
          :rules="[(val) => !isEmpty(val) || $t('global.form.required')]"
        />
        <!-- 目标温度 -->
        <q-select
          v-model="formData.targetType"
          :options="typeOptions"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          v-bind="config.field"
          :label="$t('temperatureConvert.targetType')"
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
        <section-title>{{ $t('global.form.result') }}</section-title>
        <div class="result text-h6 text-center ova break-all">
          {{ result }}
          <template v-if="formData.resultType === 'C' && !isEmpty(result)"
            >℃</template
          >
          <template v-if="formData.resultType === 'F' && !isEmpty(result)"
            >℉</template
          >
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ServiceSchame from '@/core/service/temperature-convert/schema'
import TemperatureConvertService, {
  TempType,
} from '@/core/service/temperature-convert'
import ServiceBaseInfo from '@/components/ServiceBaseInfo.vue'
import { errorNotify } from '@/core/error/utils'
import { isEmpty } from '@/core/utils/validate'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'

const { t } = useI18n()

const appStore = useAppStore()
const { config } = storeToRefs(appStore)

const service = new TemperatureConvertService()

const typeOptions = service.typeList.map((item) => {
  return {
    label: t('temperatureConvert.' + item),
    value: item,
  }
})

const formData = ref<{
  sourceType: TempType
  stringInput: number
  targetType: TempType
  resultType: TempType
}>({
  sourceType: 'C',
  stringInput: 0,
  targetType: 'F',
  resultType: 'F',
})

const result = ref<number | null>(null)

function onSubmit() {
  try {
    result.value = service.convert(
      formData.value.stringInput,
      formData.value.sourceType,
      formData.value.targetType
    )
    result.value = Number(result.value.toFixed(5))
    formData.value.resultType = formData.value.targetType
  } catch (e) {
    errorNotify(e, { t })
  }
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
