<template>
  <template></template>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useMeta } from 'quasar'
import { useI18n } from 'vue-i18n'
import type { MetaOptions } from 'quasar/dist/types/meta'

const route = useRoute()
const { t } = useI18n()

useMeta(() => {
  const meta = route.meta
  const metaOptions: MetaOptions = {
    title: t('global.title'),
    // meta tags
    meta: {
      description: { name: 'description', content: t('global.desc') },
      keywords: { name: 'keywords', content: t('global.keywords') },
    },
  }
  if (meta && meta.title) {
    metaOptions.title = `${t(meta.title as string)} | ${t('global.title')}`
  }
  if (meta && meta.desc) {
    metaOptions!.meta!.description!.content = t(meta.desc as string)
  }
  if (meta && meta.keywords) {
    metaOptions!.meta!.keywords!.content = t(meta.keywords as string)
  }
  return metaOptions
})
</script>
