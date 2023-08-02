<template>
  <q-layout view="hHh Lpr lff">
    <q-header class="header">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <span>{{ $t('global.title') }}</span>
        </q-toolbar-title>
        <q-btn v-show="false" flat dense round icon="language" aria-label="language" @click="toggleLanguage" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" overlay :width="200" bordered>
      <q-list>

        <q-item v-for="item in drawerList" :key="item.title" clickable tag="a" :target="item.extra ? '_blank' : '_self'"
          :href="item.link">
          <q-item-section v-if="item.icon" avatar>
            <q-icon :name="item.icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ $t(item.title) }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { changePathLangIso } from '../core/utils'
const { locale } = useI18n({ useScope: 'global' });

const route = useRoute()
const router = useRouter()

locale.value = route.params.lang ?? 'zh-CN'

const drawerList = ref([
  {
    icon: 'home',
    title: 'layout.home',
    link: `/${locale.value}`,
    extra: false
  }
])

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function toggleLanguage() {
  locale.value = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
  let path = changePathLangIso(route.path, locale.value as string)
  router.replace({
    path,
    query: route.query
  })
}

</script>
