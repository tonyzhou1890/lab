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
        <q-btn
          v-show="showInfoIcon"
          flat
          dense
          round
          icon="info"
          @click="toggleInfo"
        />
      </q-toolbar>
    </q-header>

    <LeftDrawer ref="leftDrawerRef" />

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer
      class="footer beian q-pa-md tac text-body2"
      v-show="isHome"
    >
      <p class="q-mx-md q-mb-none inline-block">
        <a
          href="https://beian.miit.gov.cn"
          rel="noreferrer"
          target="_blank"
          class="text-white"
          >苏ICP备20008433号-2</a
        >
      </p>
      <p class="q-mx-md q-mb-none inline-block">
        <img
          class="beian-icon q-mr-xs"
          src="~@/assets/images/global/gongan-icon.png"
          alt=""
        />
        <a
          href="https://beian.mps.gov.cn/#/query/webSearch?code=32128102010331"
          rel="noreferrer"
          target="_blank"
          class="text-white"
          >苏公网安备32128102010331</a
        >
      </p>
    </q-footer>
  </q-layout>
  <vue-meta />
  <back-top
    :right="10"
    :bottom="100"
  />
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { changePathLangIso } from '../core/utils'
import VueMeta from '@/components/VueMeta.vue'
import LeftDrawer from '@/components/LeftDrawer.vue'
import BackTop from '@/components/BackTop.vue'
import { EventBus } from 'quasar/dist/types/utils'
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

const isHome = computed(() => {
  return ['Home', 'LangHome'].includes(route.name as string)
})

const title = computed(() => {
  const meta = route.meta
  let title = t('global.title')
  if (meta && meta.title) {
    title = `${title}-${t(meta.title as string)}`
  } else if (route.query['v-header-subtitle']) {
    title = `${title}-${route.query['v-header-subtitle']}`
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

// 展示页面信息操作
const showInfoIcon = computed(() => {
  const meta = route.meta
  return !!meta.infoIcon
})

const bus = inject<EventBus>('bus')

function toggleInfo() {
  bus!.emit('toggle-info')
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
.footer {
  .beian-icon {
    vertical-align: middle;
    width: 14px;
  }
}
</style>
