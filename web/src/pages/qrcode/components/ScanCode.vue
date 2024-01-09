<template>
  <div class="full-width">
    <div
      class="video-wrapper"
      :class="{ full: scanning }"
    >
      <q-btn
        v-if="scanning"
        icon="close"
        round
        color="primary"
        class="close-icon"
        @click="stopScan"
      ></q-btn>
      <video
        class="scan-video fit"
        src=""
        ref="videoRef"
      ></video>
    </div>
    <div
      v-if="!scanning"
      class="btns row justify-center q-mt-md"
    >
      <q-btn
        :label="$t('qrcode.scan')"
        @click="onSubmit"
        color="primary"
      ></q-btn>
    </div>
    <section class="result-section">
      <section-title>{{ $t('qrcode.recognizeResult') }}</section-title>
      <q-list>
        <q-item class="result">
          <q-item-section class="break-all">{{ result }}</q-item-section>
        </q-item>
      </q-list>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { useQuasar, throttle } from 'quasar'
import { useI18n } from 'vue-i18n'
import qrcodeService from '@/core/service/qrcode'
import type QrScanner from 'qr-scanner'

const $q = useQuasar()
const { t } = useI18n()

// 视频引用
const videoRef = ref<HTMLVideoElement | null>(null)

const result = ref('')

let scanInstance: QrScanner | null = null

const scanning = ref<boolean>(false)

function stopScan() {
  scanInstance?.stop()
  scanning.value = false
}

async function onSubmit() {
  if (!(await qrcodeService.QrScanner.hasCamera())) {
    return $q.notify(t('qrcode.error.noCamera'))
  }

  if (!scanInstance) {
    scanInstance = new qrcodeService.QrScanner(
      videoRef.value as HTMLVideoElement,
      (res) => {
        result.value = res.data
        $q.notify(t('qrcode.codeFind'))
        stopScan()
      },
      {
        onDecodeError: throttle((error: Error | string) => {
          $q.notify(
            t('qrcode.error.' + error) || t('qrcode.error.No QR code found')
          )
          // scanInstance?.stop()
        }, 5000),
        preferredCamera: 'environment',
      }
    )
  }

  scanning.value = true

  scanInstance.start()
}

onUnmounted(() => {
  if (scanInstance) {
    scanInstance.destroy()
  }
})
</script>

<style lang="scss" scoped>
.form,
.result {
  max-width: 500px;
  margin: 0 auto;
}
.video-wrapper {
  width: 0;
  height: 0;
  .close-icon {
    cursor: pointer;
    position: absolute;
    top: 60px;
    right: 10px;
    z-index: 10;
  }
  &.full {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100vw;
    height: 100vh;
    background-color: black;
  }
}
</style>
