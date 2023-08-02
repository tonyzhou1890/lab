<template>
  <div class="poa fit ovh" :style="{
    color: color || 'white'
  }">
    <svg-icon v-for="(item, index) in backgroundIconList" :key="index" class="poa" :style="{
      width: item.width + 'px',
      height: item.width + 'px',
      left: item.left + '%',
      top: item.top + '%',
      transform: `rotate(${item.rotate}deg)`,
    }" :name="item.name" />
  </div>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import randomSwap from 'allbox/dist/array.random-swap'
import randomScatter from 'allbox/dist/graphic.random-scatter'
import randomRange from 'allbox/dist/number.random-range'

export interface BackgroundIconConfig {
  name: string,
  count: number,
  minWidth: number,
  maxWidth: number,
}

export interface BackgroundIcon {
  name: string,
  width: number,
  height: number,
  left: number,
  top: number,
  rotate: number
}

const props = defineProps<{
  icons: BackgroundIconConfig[],
  color?: string
}>()

const icons = toRef(props, 'icons')

const backgroundIconList = computed<BackgroundIcon[]>(() => {
  return randomSwap(icons.value.map(icon => {
    return randomScatter([[0, 0], [100, 100]], icon.count).map((item) => {
      const width = randomRange(icon.minWidth, icon.maxWidth) >> 0
      return {
        name: icon.name,
        left: item[0] >> 0,
        top: item[1] >> 0,
        width: width,
        height: width,
        rotate: (Math.random() * 360) >> 0
      }
    })
  }).flat())
})
</script>
