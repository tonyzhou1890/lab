<template>
  <div class="page-main app bg-orange-2 fit no-margin relative-position">
    <ServiceBaseInfo :service-name="ServiceSchame.i18nKey" />
    <div class="content">
      <q-form
        @submit="onSubmit"
        v-bind="config.form"
      >
        <!-- 工作时间 -->
        <q-input
          v-model.number="formData.workTime"
          :label="$t('tomatoTimer.work')"
          type="number"
          v-bind="config.field"
          :min="1"
          :max="60"
          :step="1"
          :rules="[(val) => !isEmpty(val) || $t('global.form.required')]"
        />
        <!-- 休息时间 -->
        <q-input
          type="number"
          v-bind="config.field"
          v-model.number="formData.shortBreak"
          :min="1"
          :max="60"
          :step="1"
          :label="$t('tomatoTimer.shortBreak')"
          :rules="[(val) => !isEmpty(val) || $t('global.form.required')]"
        />
        <!-- 周期 -->
        <q-input
          v-model.number="formData.round"
          :label="$t('tomatoTimer.round')"
          type="number"
          v-bind="config.field"
          :min="1"
          :max="20"
          :step="1"
          :rules="[(val) => !isEmpty(val) || $t('global.form.required')]"
        />
        <!-- 长休息时间 -->
        <q-input
          type="number"
          v-bind="config.field"
          v-model.number="formData.longBreak"
          :min="1"
          :max="60"
          :step="1"
          :label="$t('tomatoTimer.longBreak')"
          :rules="[(val) => !isEmpty(val) || $t('global.form.required')]"
        />
        <div class="btns row justify-center">
          <q-btn
            :label="$t('global.start')"
            type="submit"
            color="primary"
          ></q-btn>
        </div>
      </q-form>
    </div>
    <div
      v-if="tomatoData.running"
      class="running-mask absolute-top-left fit flex column items-center justify-center text-white"
      ref="runningContainerEl"
      :class="{
        'bg-cyan-3': tomatoData.stage !== 'work',
        'bg-orange-2': tomatoData.stage === 'work',
      }"
    >
      <div class="countdown text-bold flex column items-center justify-center">
        <p class="countdown-time no-margin">
          {{ tomatoData.formated }}
        </p>
        <p class="round">
          <span v-if="tomatoData.round"
            >{{ $t('tomatoTimer.round') }}{{ tomatoData.round }}</span
          >
          <span v-if="tomatoData.round && tomatoData.stage">--</span>
          <span v-if="tomatoData.stage">{{
            $t(`tomatoTimer.${tomatoData.stage}`)
          }}</span>
        </p>
      </div>
      <q-btn
        color="primary"
        icon="clear"
        round
        @click="handleClear"
      ></q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import ServiceSchame from '@/core/service/tomato-timer/schema'
import ServiceBaseInfo from '@/components/ServiceBaseInfo.vue'
import TomatoTimerService, {
  TomatoTimerCfg,
  TomatoTimerData,
  StageDoneCb,
} from '@/core/service/tomato-timer'
import { isEmpty } from '@/core/utils/validate'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'

const { t } = useI18n()

const $q = useQuasar()

const appStore = useAppStore()
const { config } = storeToRefs(appStore)

const runningContainerEl = ref<HTMLElement>()

const formData = ref<TomatoTimerCfg>({
  workTime: 25,
  shortBreak: 5,
  round: 4,
  longBreak: 30,
})

const tomatoData = ref<TomatoTimerData>({
  running: false,
  time: 0,
  formated: '',
  stage: '',
  round: 0,
})

let service: TomatoTimerService | null = null

onMounted(async () => {
  service = new TomatoTimerService(formData, tomatoData)
  await service.loadCache()
  nextTick(() => {
    if (tomatoData.value.running) {
      service?.resume(stageDoneCb)
      $q.dialog({
        title: t('global.resume'),
        message: t('tomatoTimer.fullscreen'),
        position: 'top',
        cancel: true,
      })
        .onOk(() => {
          runningContainerEl.value?.requestFullscreen()
        })
        .onCancel(() => {
          /** */
        })
    }
  })
})

onBeforeUnmount(() => {
  service?.end()
})

function onSubmit() {
  service!.start(tomatoData, stageDoneCb)
  nextTick(() => {
    if (tomatoData.value.running) {
      runningContainerEl.value?.requestFullscreen()
    }
  })
}

const stageDoneCb: StageDoneCb = (doneStage, doneRound) => {
  console.log(doneStage, doneRound)
}

async function handleClear() {
  service!.clear()
  if (document.fullscreenElement) {
    await document.exitFullscreen()
  }
}
</script>

<style lang="scss" scoped>
.page-main {
  .running-mask {
    .countdown {
      width: 400px;
      height: 400px;
      background-image: url('@/assets/images/tomato-timer/tomato.svg');
      background-size: 100%;
      padding-top: 50px;
      .countdown-time {
        font-size: 50px;
      }
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
  .unit {
    white-space: nowrap;
  }
}

@media screen and (max-width: 500px) {
  .page-main {
    .running-mask {
      .countdown {
        width: 300px;
        height: 300px;
        padding-top: 40px;
        .countdown-time {
          font-size: 34px;
        }
      }
    }
  }
}
</style>
