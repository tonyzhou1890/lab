<template>
  <div class="full-width tac">
    <div class="clock">
      <p class="date text-h5 text-bold">{{ time.date }}</p>
      <p class="time text-h3 text-bold">{{ time.time }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import TimeService from '@/core/service/time'

const time = ref<{
  date: string
  time: string
}>({
  date: '',
  time: '',
})

let service: TimeService | null = null

onMounted(() => {
  service = new TimeService()
  service.connectClock(time)
})

onBeforeUnmount(() => {
  service?.end()
})

console.log('active')
</script>

<style lang="scss" scoped></style>
