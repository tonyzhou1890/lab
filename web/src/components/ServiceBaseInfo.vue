<template>
  <div class="service-title tac">
    <h1 class="title">{{ info.title }}</h1>
  </div>
  <p class="desc tac">{{ info.desc }}</p>
  <section
    v-if="info.doc"
    class="service-base-info doc-section"
  >
    <SectionTitle
      :defaultShow="false"
      @toggle="handleToggle"
      >{{ $t('global.doc') }}</SectionTitle
    >
    <QMarkdown
      :src="info.doc"
      no-heading-anchor-links
      :class="{
        'self-control': initialState,
      }"
    />
    <!-- <pre class="doc">{{ info.doc }}</pre> -->
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { QMarkdown } from '@quasar/quasar-ui-qmarkdown'
import '@quasar/quasar-ui-qmarkdown/dist/index.css'

const props = defineProps<{
  serviceName: string
}>()

const { t } = useI18n()

// 初始状态--即第一次打开页面
const initialState = ref<boolean>(true)

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

function handleToggle() {
  initialState.value = false
}
</script>

<style lang="scss">
.service-base-info {
  &.doc-section {
    .self-control {
      height: 80px;
      overflow: hidden;
      color: transparent;
      background-image: linear-gradient(180deg, black, transparent);
      -webkit-background-clip: text;
      background-clip: text;
    }
  }
}
</style>
