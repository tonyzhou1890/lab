<template>
  <div class="page-main app">
    <ServiceBaseInfo :service-name="ServiceSchema.i18nKey" />
    <div class="content">
      <div class="input-wrapper flex column-flex">
        <!-- 文件 -->
        <q-file
          v-model="image"
          :label="$t('imageClassifier.image') + '*'"
          accept="image/png, image/jpeg, image/webp"
          class="image-input fit"
          v-bind="config.field"
          :rules="[
            (val) => (val !== null && val !== '') || $t('global.form.required'),
          ]"
        />
        <img
          v-show="imageBase64"
          :src="imageBase64"
          ref="imageRef"
          class="image"
        />
      </div>
      <section class="result-section">
        <section-title>{{ $t('global.form.result') }}</section-title>
        <div class="result text-h6 text-center ova break-all">
          <div
            v-for="item in imageRes"
            :key="item.label"
            class="result-row"
          >
            <span>{{ item.label }}</span>
            <span>（{{ (item.confidence * 100).toFixed(2) }}%）</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, toRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import { errorNotify } from '@/core/error/utils'
import { loading } from '@/core/io/utils'
import ServiceBaseInfo from '@/components/ServiceBaseInfo.vue'
import ImageClassifierService from '@/core/service/image-classifier'
import ServiceSchema from '@/core/service/image-classifier/schema'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'
import { fileToBase64 } from '@/core/utils'

const { t } = useI18n()

const appStore = useAppStore()
const { config } = storeToRefs(appStore)

const image = ref<File>()
const imageBase64 = ref<string>('')
const imageRef = ref<HTMLImageElement>()
const imageRes = ref<
  {
    label: string
    confidence: number
  }[]
>([])
let service: ImageClassifierService

watch(image, handleFileChange)

async function handleFileChange() {
  if (!image.value) return
  try {
    loading.show()
    if (!service) {
      service = new ImageClassifierService()
      await service.init()
    }
    imageBase64.value = await fileToBase64(image.value)
    const input = toRaw(imageRef).value
    console.log(input)
    imageRes.value = await service.classify(input)
    console.log(imageRes.value)
  } catch (e) {
    errorNotify(e, { t })
  }
  loading.hide()
}
</script>

<style lang="scss" scoped>
.page-main {
  .content {
    .input-wrapper,
    .image {
      width: 500px;
      max-width: 100%;
      margin: auto;
    }
    .image {
      margin-top: 16px;
    }
  }
}
</style>
