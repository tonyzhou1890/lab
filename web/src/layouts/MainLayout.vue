<template>
  <q-layout view="hHh Lpr lff">
    <q-header class="header">
      <q-toolbar class="toolbar">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title v-show="!hideMenuEtc">
          <img
            class="logo q-mr-md"
            src="/icons/favicon-128x128.png"
            alt="logo"
            v-show="hideMenuEtc"
          />
          <span>{{ title }}</span>
        </q-toolbar-title>
        <q-btn
          v-show="false"
          flat
          dense
          round
          icon="language"
          aria-label="language"
          @click="toggleLanguage"
        />
      </q-toolbar>
    </q-header>

    <LeftDrawer ref="leftDrawerRef" />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
  <vue-meta />
  <back-top />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { changePathLangIso } from '../core/utils'
import VueMeta from '@/components/VueMeta.vue'
import LeftDrawer from '@/components/LeftDrawer.vue'
import BackTop from '@/components/BackTop.vue'
const { locale, t } = useI18n({ useScope: 'global' })

const route = useRoute()
const router = useRouter()

// background
// const backgroundIcons = [
//   {
//     name: 'snow',
//     count: 100,
//     minWidth: 16,
//     maxWidth: 30,
//   },
// ]

const hideMenuEtc = computed(() => {
  return ['Home', 'LangHome', 'Nav'].includes(route.name as string)
})

// const noHeader = computed(() => {
//   return ['Home', 'LangHome'].includes(route.name as string)
// })

const title = computed(() => {
  const meta = route.meta
  let title = t('global.title')
  if (meta && meta.title) {
    title = `${t('global.title')}-${t(meta.title as string)}`
  }

  return title
})

locale.value = (route.params.lang as string) ?? 'zh-CN'

const leftDrawerRef = ref<typeof LeftDrawer | null>(null)

function toggleLeftDrawer() {
  if (leftDrawerRef.value) {
    leftDrawerRef.value.toggle()
  }
}

function toggleLanguage() {
  locale.value = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
  let path = changePathLangIso(route.path, locale.value as string)
  router.replace({
    path,
    query: route.query,
  })
}
</script>

<style lang="scss" scoped>
.page-bg {
  .bg {
    width: 100%;
    height: 100%;
  }
}
.header {
  .logo {
    width: 22px;
    height: 22px;
    vertical-align: middle;
  }
  :deep(.q-toolbar__title) {
    font-size: 16px;
  }
}
</style>
