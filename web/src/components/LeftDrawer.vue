<template>
  <q-drawer
    v-model="open"
    overlay
    :width="width"
    transition-show="slide-right"
    transition-hide="slide-left"
    class="left-drawer block-shadow"
  >
    <NavCard
      class="dialog-nav"
      @close="toggle"
    />
  </q-drawer>
</template>

<script setup lang="ts">
import NavCard from './NavCard.vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { debounce } from 'quasar'

const open = ref(false)

function toggle(value?: boolean) {
  if (value !== undefined) {
    open.value = !!value
  } else {
    open.value = !open.value
  }
}

defineExpose({ toggle })

const width = ref(504)

const setWidth = debounce(() => {
  if (window) {
    const dw = document.body.clientWidth
    if (dw < 504) {
      width.value = dw
    } else {
      width.value = 504
    }
  }
}, 30)

onMounted(() => {
  window.addEventListener('resize', setWidth)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', setWidth)
})
</script>

<style lang="scss" scoped>
.left-drawer {
  max-width: 100vw;
  .dialog-nav {
    margin: 0;
  }
}
</style>
