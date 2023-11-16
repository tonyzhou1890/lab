<template>
  <div class="full-width tac">
    <div class="stopwatch">
      <p class="time text-h3 text-bold">{{ stopwatch.formated }}</p>
      <div class="row justify-center">
        <!-- 开始--未进行 -->
        <q-btn
          v-if="!stopwatch.running"
          icon="play_arrow"
          round
          color="primary"
          @click="handleStart"
        ></q-btn>
        <!-- 停止--进行中并且暂停状态 -->
        <q-btn
          v-if="stopwatch.running && stopwatch.paused"
          icon="stop"
          round
          color="primary"
          class="q-mr-md"
          @click="handleStop"
        ></q-btn>
        <!-- 快照--进行中并且未暂停 -->
        <q-btn
          v-if="stopwatch.running && !stopwatch.paused"
          icon="flag"
          round
          color="primary"
          class="q-mr-md"
          @click="handleSnap"
        ></q-btn>
        <!-- 暂停--进行中并且未暂停 -->
        <q-btn
          v-if="stopwatch.running && !stopwatch.paused"
          icon="pause"
          round
          color="primary"
          @click="handleToggle"
        ></q-btn>
        <!-- 恢复--进行中并且暂停状态 -->
        <q-btn
          v-if="stopwatch.paused && stopwatch.running"
          icon="play_arrow"
          round
          color="primary"
          @click="handleToggle"
        ></q-btn>
      </div>
      <div
        class="snapshots tac q-mt-md"
        v-if="stopwatch.snapshots.length"
      >
        <q-table
          flat
          bordered
          :rows="stopwatch.snapshots"
          :columns="columns"
          row-key="time"
          :rows-per-page-options="[0]"
          hide-header
          hide-bottom
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import TimeService, { type StopwatchData } from '@/core/service/time'
import { formatOffsetTime } from '@/core/utils/time'

const stopwatch = ref<StopwatchData>({
  time: 0,
  formated: formatOffsetTime(0),
  snapshots: [],
  index: 0,
  running: false,
  paused: false,
})

const columns = [
  {
    name: 'index',
    label: 'index',
    field: 'index',
  },
  {
    name: 'formatedOffset',
    label: 'formatedOffset',
    field: 'formatedOffset',
    format: (val: string) => `+${val}`,
  },
  {
    name: 'formated',
    label: 'formated',
    field: 'formated',
  },
]

let service: null | TimeService = null

onMounted(() => {
  service = new TimeService()
})

onBeforeUnmount(() => {
  service?.end()
})

function handleStart() {
  service?.connectStopwatch(stopwatch)
}

function handleStop() {
  service?.stopStopwatch()
}

function handleToggle() {
  service?.toggleStopwatch()
}

function handleSnap() {
  service?.snapStopwatch()
}
</script>

<style scoped lang="scss">
.snapshots {
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}
</style>
