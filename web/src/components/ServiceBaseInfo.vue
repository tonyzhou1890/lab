<template>
  <div class="service-title tac">
    <h1 class="title">{{ info.title }}</h1>
  </div>
  <p class="desc tac">{{ info.desc }}</p>
  <section
    v-if="info.doc"
    class="doc-section"
  >
    <SectionTitle :defaultShow="false">{{ $t('global.doc') }}</SectionTitle>
    <QMarkdown
      :src="info.doc"
      no-heading-anchor-links
    />
    <!-- <pre class="doc">{{ info.doc }}</pre> -->
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { QMarkdown } from '@quasar/quasar-ui-qmarkdown'
import '@quasar/quasar-ui-qmarkdown/dist/index.css'

const props = defineProps<{
  serviceName: string
}>()

const { t } = useI18n()

const info = computed(() => {
  const title = t(`${props.serviceName}.title`)
  const desc = t(`${props.serviceName}.desc`)
  const doc = t(`${props.serviceName}.doc`)
  return {
    title,
    desc,
    // 如果没有文本，i18n 会使用 key 作为结果
    doc: doc === `${props.serviceName}.doc` ? '' : doc,
  }
})
</script>
