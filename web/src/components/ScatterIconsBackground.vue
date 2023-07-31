<template>
  <div class="poa full ovh" :style="{
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
import allbox from 'allbox'

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
  return allbox.array.randomSwap(icons.value.map(icon => {
    return allbox.graphic.randomScatter([[0, 0], [100, 100]], icon.count).map((item) => {
      const width = allbox.number.randomRange(icon.minWidth, icon.maxWidth) >> 0
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
