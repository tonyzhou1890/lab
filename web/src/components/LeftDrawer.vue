<template>
  <q-dialog
    v-model="open"
    :maximized="true"
    transition-show="slide-right"
    transition-hide="slide-left"
    class="left-drawer"
  >
    <NavCard />
  </q-dialog>
</template>

<script setup lang="ts">
import NavCard from './NavCard.vue'
import { ref } from 'vue'

const open = ref(false)

function toggle(value?: boolean) {
  if (value !== undefined) {
    open.value = !!value
  } else {
    open.value = !open.value
  }
}

defineExpose({ toggle })
</script>
