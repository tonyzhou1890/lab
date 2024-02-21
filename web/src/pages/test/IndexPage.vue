<template>
  <div class="page-main app">
    <q-btn @click="handleGet">获取</q-btn>
  </div>
</template>

<script setup lang="ts">
import { apiBundle } from '@/boot/axios'
import config from '@/core/config'

function handleGet() {
  apiBundle.IOAPI!.get(config.deps.tomatoTimer.url).then((res) => {
    console.log(res)
  })
}
</script>
