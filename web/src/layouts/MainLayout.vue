<template>
  <q-layout view="hHh Lpr lff">
    <div class="page-bg">
      <ScatterIconsBackground
        :icons="backgroundIcons"
        color="gray"
      />
    </div>
    <q-header class="header">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          v-show="!hideMeneEtc"
        />
        <q-toolbar-title>
          <span v-show="!hideMeneEtc">{{ $t('global.title') }}</span>
        </q-toolbar-title>
        <q-btn
          v-show="true"
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
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { changePathLangIso } from '../core/utils'
import VueMeta from '@/components/VueMeta.vue'
import LeftDrawer from '@/components/LeftDrawer.vue'
const { locale } = useI18n({ useScope: 'global' })

const route = useRoute()
const router = useRouter()

// background
const backgroundIcons = [
  {
    name: 'snow',
    count: 100,
    minWidth: 16,
    maxWidth: 30,
  },
]

const hideMeneEtc = computed(() => {
  return ['Home', 'LangHome', 'Nav'].includes(route.name as string)
})

locale.value = route.params.lang ?? 'zh-CN'

const leftDrawerRef = ref<typeof LeftDrawer | null>(null)

function toggleLeftDrawer() {
  if (leftDrawerRef.value) {
    leftDrawerRef.value.toggle(true)
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
