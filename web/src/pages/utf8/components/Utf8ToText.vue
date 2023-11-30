<template>
  <div class="full-width">
    <q-form
      ref="formRef"
      @submit="onSubmit"
      class="form"
    >
      <!-- 文本 -->
      <q-input
        type="textarea"
        autogrow
        v-model="formData.utf8Input"
        class="textarea ova"
        :label="$t('utf8.utf8Input') + '*'"
        lazy-rules
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
      <h2 class="section-title">{{ $t('global.form.result') }}</h2>
      <div class="result text-body1 text-center ova break-all">
        {{ result }}
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import type { QForm } from 'quasar'
import { useI18n } from 'vue-i18n'
import type Utf8Service from '@/core/service/utf8'
import { errorNotify } from '@/core/error/utils'

const { t } = useI18n()

const props = defineProps<{
  service: Utf8Service
}>()

const { service } = toRefs(props)

interface FormData {
  utf8Input: string
}

// 表单实例引用
const formRef = ref<QForm | null>(null)

// 表单数据
const formData = ref<FormData>({
  utf8Input: '',
})

const result = ref<string | null>(null)

async function onSubmit() {
  try {
    const buf = service.value.utf8StringParse(formData.value.utf8Input)
    if (!buf) {
      errorNotify(new Error(t('utf8.inputError')))
    } else {
      result.value = service.value.decode(buf)
    }
  } catch (e) {
    errorNotify(e)
  }
}
</script>

<style lang="scss" scoped>
.form {
  max-width: 500px;
  margin: 0 auto;
  .textarea {
    max-height: 200px;
  }
}
.result {
  max-height: 200px;
}
</style>
