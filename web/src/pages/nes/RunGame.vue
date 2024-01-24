<template>
  <div class="page-wrapper">
    <iframe
      v-if="src"
      class="frame fit"
      :src="src"
      frameborder="0"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import config from '@/core/config'

const { locale } = useI18n()

const route = useRoute()

const path = new URL(
  (route.query.path as string) ||
    (route.query.name ? `./${route.query.name}.zip` : ''),
  config.deps.nes.url
)

const src = ref<string>()

onMounted(() => {
  src.value = `${window.location.protocol}//${
    window.location.host
  }/third-party/emulatorjs/embed.html?game-name=${
    route.query.name
  }&game-url=${encodeURIComponent(path.toString())}&lang=${locale.value}`
})
</script>

<style lang="scss" scoped>
.page-wrapper {
  padding: 0;
  margin: 0 auto;
  width: 100vw;
  height: calc(100vh - 50px);
  background-color: black !important;
  .frame {
    vertical-align: middle;
  }
}
</style>
