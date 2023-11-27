<template>
  <!-- 元素 -->
  <template v-if="data">
    <div
      class="cell flex column justify-center fit cp ovh"
      :data-is-lan="data.atomicNumber >= 57 && data.atomicNumber <= 71"
      :data-is-a="data.atomicNumber >= 89 && data.atomicNumber <= 103"
    >
      <p class="atomic-number ellipsis">{{ data.atomicNumber }}</p>
      <p class="symbol text-bold ellipsis">{{ data.symbol }}</p>
      <p class="name name-ch ellipsis">{{ data.names.zh?.text }}</p>
      <p class="atomic-mass ellipsis">{{ data.atomicMass }}</p>
    </div>
  </template>
  <!-- 镧系、锕系 -->
  <template v-if="cellIndex === 92">
    <div
      class="cell flex column justify-center fit cp ovh"
      data-is-lan="true"
    >
      <p class="ellipsis">镧系</p>
      <p class="ellipsis">57-71</p>
    </div>
  </template>
  <template v-if="cellIndex === 110">
    <div
      class="cell flex column justify-center fit cp ovh"
      data-is-a="true"
    >
      <p class="ellipsis">锕系</p>
      <p class="ellipsis">89-103</p>
    </div>
  </template>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { ElementData } from '@/core/service/periodic-table-of-elements/core'

const props = defineProps<{
  data?: ElementData
  cellIndex: number
}>()

const { data, cellIndex } = toRefs(props)
</script>

<style lang="scss" scoped>
.cell {
  padding: 5px;
  box-sizing: border-box;
  background-color: #d4c477;
  border: 2px solid transparent;
  &:hover {
    background-color: aquamarine !important;
    border-color: purple;
  }
  &[data-is-lan='true'] {
    background-color: #e07b5f;
  }
  &[data-is-a='true'] {
    background-color: #b67525;
  }
}
p {
  margin: 0;
  line-height: 1.1;
}
.atomic-number {
  font-size: 14px;
}
</style>
