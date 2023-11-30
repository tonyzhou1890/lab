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
        v-model="formData.stringInput"
        class="textarea ova"
        :label="$t('utf8.textInput') + '*'"
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
        {{ result ? `[${result}]` : '' }}
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import type { QForm } from 'quasar'
import type Utf8Service from '@/core/service/utf8'
import { errorNotify } from '@/core/error/utils'

const props = defineProps<{
  service: Utf8Service
}>()

const { service } = toRefs(props)

interface FormData {
  stringInput: string
}

// 表单实例引用
const formRef = ref<QForm | null>(null)

// 表单数据
const formData = ref<FormData>({
  stringInput: '',
})

const result = ref<Uint8Array | null>(null)

async function onSubmit() {
  try {
    result.value = service.value.encode(formData.value.stringInput)
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
