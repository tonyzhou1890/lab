<template>
  <div class="page-main app">
    <ServiceBaseInfo :service-name="ServiceSchame.i18nKey" />
    <div class="content">
      <q-form
        ref="formRef"
        @submit="onSubmit"
        class="form"
      >
        <!-- 源类型 -->
        <q-select
          v-model="formData.sourceType"
          :options="typeOptions"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          :label="$t('angleConvert.sourceType')"
        />
        <!-- 源数据 -->
        <q-input
          type="number"
          v-model.number="formData.stringInput"
          :label="$t('angleConvert.sourceInput') + '*'"
          :rules="[(val) => !isEmpty(val) || $t('global.form.required')]"
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
        <div class="result text-body1 text-center ova break-all">
          {{ result }}
          <template v-if="formData.resultType === 'D' && !isEmpty(result)"
            >°</template
          >
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ServiceSchame from '@/core/service/angle-convert/schema'
import AngleConvertService, { AngleType } from '@/core/service/angle-convert'
import ServiceBaseInfo from '@/components/ServiceBaseInfo.vue'
import { errorNotify } from '@/core/error/utils'
import { isEmpty } from '@/core/utils/validate'

const { t } = useI18n()

const service = new AngleConvertService()

const typeOptions = service.typeList.map((item) => {
  return {
    label: t('angleConvert.' + item),
    value: item,
  }
})

const formData = ref<{
  sourceType: AngleType
  stringInput: number
  resultType: AngleType
}>({
  sourceType: 'D',
  stringInput: 0,
  resultType: 'R',
})

const result = ref<number | null>(null)

function onSubmit() {
  const targetType = formData.value.sourceType === 'D' ? 'R' : 'D'
  try {
    result.value = service.convert(
      formData.value.stringInput,
      formData.value.sourceType,
      targetType
    )
    result.value = Number(result.value.toFixed(5))
    formData.value.resultType = targetType
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
