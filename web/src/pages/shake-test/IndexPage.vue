<template>
  <div class="page-main app">
    <ServiceBaseInfo :service-name="ServiceSchame.i18nKey" />
    <div class="content">
      <div class="row q-mx-auto relative-position graphic-wrapper">
        <div
          class="fit graphic"
          :style="{
            clipPath: `polygon(50% 50%, ${
              (acceleration.xScale + 1) * 50
            }% 50%, 50% ${(acceleration.yScale + 1) * 50}%)`,
          }"
        ></div>
        <div class="absolute graphic-coord fit"></div>
      </div>
      <q-list class="acc-data flex column items-center">
        <q-item>
          <q-item-section class="text-bold">x</q-item-section>
          <q-item-section
            ><span>{{ acceleration.x }}m/s<sup>2</sup></span></q-item-section
          >
        </q-item>
        <q-item>
          <q-item-section class="text-bold">y</q-item-section>
          <q-item-section
            ><span>{{ acceleration.y }}m/s<sup>2</sup></span></q-item-section
          >
        </q-item>
      </q-list>
      <q-slider
        v-model="accuracy"
        :min="0.1"
        :max="1"
        :step="0.1"
      ></q-slider>
      <div class="btns row justify-center">
        <q-btn
          v-if="!running"
          :label="$t('global.start')"
          @click="handleStart"
          color="primary"
        ></q-btn>
        <q-btn
          v-else
          :label="$t('global.stop')"
          @click="handleEnd"
          color="secondary"
        ></q-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ServiceSchame from '@/core/service/shake-test/schema'
import ShakeTestService from '@/core/service/shake-test'
import ServiceBaseInfo from '@/components/ServiceBaseInfo.vue'
import { errorNotify } from '@/core/error/utils'
import { throttle } from 'quasar'

const { t } = useI18n()

const service = new ShakeTestService()

const accuracy = ref<number>(0.5)

const acceleration = ref<{
  x: number
  y: number
  // 对精度求值
  xScale: number
  yScale: number
}>({
  x: 0,
  y: 0,
  xScale: 0,
  yScale: 0,
})

const running = ref<boolean>(false)

async function handleStart() {
  try {
    await service.enableSensor()
    service.startLog(
      throttle((d, e, logs, calc) => {
        const res = calc(accuracy.value)
        // 确保即使只有一个有值，图也有显示
        if (res.xScale && !res.yScale) {
          res.yScale = 0.01
        } else if (!res.xScale && res.yScale) {
          res.xScale = 0.01
        }
      }, 100)
    )
    running.value = true
  } catch (e) {
    errorNotify(e, { t })
  }
}

function handleEnd() {
  service.endLog()
  running.value = false
}

onUnmounted(() => {
  if (service) {
    service.end()
  }
})
</script>

<style lang="scss" scoped>
.page-main {
  .content {
    overflow: visible;
    max-width: 500px;
    margin: 0 auto;
    .graphic-wrapper {
      width: 90vw;
      height: 90vw;
      max-width: 500px;
      max-height: 500px;
    }
    .graphic {
      background-image: radial-gradient(blue, red);
      clip-path: polygon(0 0, 0 0, 0 0);
      transition: clip-path 0.2s;
    }
    .graphic-coord {
      left: 0;
      top: 0;
      &::before {
        content: '';
        width: 100%;
        height: 2px;
        background-color: $blue-3;
        background-image: linear-gradient(90deg, #b40861, blue, #b40861);
        position: absolute;
        left: 0;
        top: calc(50% - 1px);
        z-index: 1;
      }
      &::after {
        content: '';
        width: 2px;
        height: 100%;
        background-color: $blue-3;
        background-image: linear-gradient(#b40861, blue, #b40861);
        position: absolute;
        left: calc(50% - 1px);
        top: 0;
        z-index: 1;
      }
    }
  }
}
</style>
