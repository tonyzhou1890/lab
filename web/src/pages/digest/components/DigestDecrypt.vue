<template>
  <div class="full-width">
    <q-form ref="formRef" @submit="onSubmit" class="q-gutter-md">
      <!-- 摘要密文 -->
      <q-input type="textarea" autogrow v-model="formData.stringInput" :label="$t('digest.decryptForm.string') + '*'"
        lazy-rules :rules="[(val) => (val && val.length > 0) || $t('global.form.required')]" />
      <!-- 算法 -->
      <q-select v-model="formData.algorithm" :options="options" :label="$t('digest.decryptForm.algorithm')" />
      <div class="btns row justify-center">
        <q-btn :label="$t('digest.start')" type="submit" color="primary"></q-btn>
        <q-btn :label="$t('digest.stop')" @click="handleStop" color="primary"></q-btn>
      </div>
    </q-form>
    <section class="result-section">
      <h2 class="section-title">{{ $t('digest.encryptResult') }}</h2>
      <q-list>
        <q-item v-for="item in resultList" :key="item.name">
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
import { useI18n } from 'vue-i18n';

interface FormData {
  stringInput: string
  algorithm: string
}

const { t } = useI18n()

// 表单实例引用
const formRef = ref<QForm | null>(null)

// 表单数据
const formData = ref<FormData>({
  stringInput: '',
  algorithm: 'md5'
})

const options = ['md5']

const result = ref('')

function onSubmit(e: SubmitEvent | Event) {
  console.log(e)
}

function handleStop() { console.log() }

// 显示的结果
const resultList = computed(() => {
  const upperResult = result.value.toUpperCase()
  return [
    {
      name: t('digest.calculating'),
      value: result.value.substring(9, 25)
    },
    {
      name: t('digest.speed'),
      value: upperResult.substring(9, 25)
    },
    {
      name: t('digest.timeRemaining'),
      value: result.value
    },
    {
      name: t('digest.result'),
      value: upperResult
    }
  ]
})
</script>

<style lang="scss" scoped>
.form {
  max-width: 500px;
  margin: 0 auto;
}
</style>
