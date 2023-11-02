<template>
  <div class="service-title tac">
    <h1 class="title">{{ info.title }}</h1>
  </div>
  <p class="desc">{{ info.desc }}</p>
  <section
    v-if="info.doc"
    class="doc-section"
    :data-expand="expand"
  >
    <h2 class="section-title">
      <span>{{ $t('global.doc') }}</span>
      <q-icon
        class="arrow cp"
        name="arrow_forward"
        color="grey"
        @click="toggleDoc"
      />
    </h2>
    <QMarkdown
      v-show="expand"
      :src="info.doc"
      no-heading-anchor-links
    />
    <!-- <pre class="doc">{{ info.doc }}</pre> -->
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { QMarkdown } from '@quasar/quasar-ui-qmarkdown'

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

const expand = ref<boolean>(false)

function toggleDoc() {
  expand.value = !expand.value
}
</script>

<style lang="scss" scoped>
.doc-section {
  &[data-expand='true'] {
    .arrow {
      transform: rotate(90deg);
    }
  }
}
</style>
