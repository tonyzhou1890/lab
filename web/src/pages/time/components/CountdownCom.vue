<template>
  <div class="full-width tac">
    <div
      v-if="!isRunning"
      class="set-time flex flex-center column"
    >
      <q-time
        v-model="time"
        format24h
        with-seconds
      ></q-time>
      <q-btn
        icon="play_arrow"
        round
        color="primary"
        class="q-mt-md"
        @click="handleStart"
      />
    </div>
    <div
      v-else
      class="countdown"
    >
      <p class="time text-h3 text-bold">{{ countdown.formated }}</p>
      <div class="row justify-center">
        <q-btn
          icon="stop"
          round
          color="primary"
          class="q-mr-md"
          @click="handleStop"
        ></q-btn>
        <template v-if="!countdown.done">
          <q-btn
            v-if="!countdown.paused"
            icon="pause"
            round
            color="primary"
            @click="handleToggle"
          ></q-btn>
          <q-btn
            v-else
            icon="play_arrow"
            round
            color="primary"
            @click="handleToggle"
          ></q-btn>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import TimeService from '@/core/service/time'

const { t } = useI18n()

const isRunning = ref<boolean>(false)

const time = ref('00:05:00')

const countdown = ref({
  time: 0,
  formated: '',
  index: 0,
  done: false,
  paused: false,
})

let service: null | TimeService = null

onMounted(() => {
  service = new TimeService({ t })
})

onBeforeUnmount(() => {
  service?.end()
})

function handleStart() {
  if (time.value === '00:00:00') return
  isRunning.value = true
  service?.connectCountdown(countdown, time.value)
}

function handleStop() {
  isRunning.value = false
}

function handleToggle() {
  service?.toggleCountdown()
}
</script>
