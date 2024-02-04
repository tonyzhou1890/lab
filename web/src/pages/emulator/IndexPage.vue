<template>
  <div class="page-main app no-margin">
    <div
      class="info"
      v-show="showInfo"
    >
      <ServiceBaseInfo :service-name="ServiceSchema.i18nKey" />
    </div>
    <iframe
      v-show="src"
      class="frame"
      :src="src"
      frameborder="0"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import type { EventBus } from 'quasar'
import ServiceSchema from '@/core/service/emulator/schema'

const { locale } = useI18n()

const src = ref('')
const pageActive = ref<boolean>(false)

onMounted(() => {
  src.value = `${window.location.protocol}//${window.location.host}/third-party/emulatorjs/index.html?lang=${locale.value}`
  pageActive.value = true
})

onBeforeUnmount(() => {
  pageActive.value = false
})

const showInfo = ref<boolean>(true)
const bus = inject<EventBus>('bus')
bus.on('toggle-info', () => {
  console.log('toggle')
  if (pageActive.value) {
    showInfo.value = !showInfo.value
  }
})
</script>

<style lang="scss" scoped>
.page-main {
  padding: 0;
  max-width: 100%;
  background-color: $orange-1;
  min-height: calc(100vh - 50px);
  border-radius: 0;
  .info {
    padding: 20px;
  }
  .frame {
    padding: 0;
    margin: 0 auto;
    width: 100vw;
    height: calc(100vh - 50px);
    background-color: black !important;
    vertical-align: middle;
  }
}
</style>
