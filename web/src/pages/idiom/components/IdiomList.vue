<template>
  <div class="wrapper ova">
    <q-chip
      square
      color="primary"
      text-color="white"
      class="chip cp"
      clickable
      v-for="item in computedList"
      :key="item"
      @click="handleSearch(item)"
      >{{ item }}</q-chip
    >
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue'

const props = defineProps<{
  list: string | string[]
}>()

const { list } = toRefs(props)

const computedList = computed(() => {
  if (typeof list.value === 'string') {
    return list.value.split(/[，、]/).filter((v) => v)
  }
  return list.value.filter((v) => v)
})

const emit = defineEmits<{
  (e: 'search', data: string): void
}>()

function handleSearch(word: string) {
  console.log(word)
  emit('search', word)
}
</script>

<style lang="scss" scoped>
.wrapper {
  max-height: 200px;
}
</style>
