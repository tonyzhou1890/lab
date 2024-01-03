<template>
  <h2
    class="section-title flex items-center"
    :class="show ? 'show' : 'hide'"
  >
    <span class="q-mr-md"> <slot></slot></span>
    <q-icon
      class="arrow cp"
      data-show="false"
      name="arrow_circle_down"
      color="info"
      @click="toggle"
    />
  </h2>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    defaultShow?: boolean
  }>(),
  {
    defaultShow: true,
  }
)

const show = ref(props.defaultShow)

function toggle() {
  show.value = !show.value
}
</script>

<style lang="scss">
.section-title {
  &.hide {
    .arrow {
      transform: rotate(-90deg);
    }
  }
  &.hide ~ * {
    display: none;
  }
}
</style>
