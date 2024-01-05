<template>
  <transition name="el-fade-in">
    <q-btn
      v-if="visible"
      class="fixed cursor-pointer"
      @click.stop="handleClick"
      :style="{
        right: styleRight,
        bottom: styleBottom,
      }"
      round
      color="primary"
      icon="arrow_upward"
    >
    </q-btn>
  </transition>
</template>

<script setup lang="ts">
// 根据 element-ui Backtop 改写
// 同时去掉了 throttle，因为 quasar 自带的 throttle 无法保证最后一次执行
import { computed, onBeforeUnmount, onMounted, ref, toRefs } from 'vue'

function cubic(value: number) {
  return Math.pow(value, 3)
}

function easeInOutCubic(value: number) {
  return value < 0.5 ? cubic(value * 2) / 2 : 1 - cubic((1 - value) * 2) / 2
}

const props = withDefaults(
  defineProps<{
    visibilityHeight?: number
    target?: string
    right?: number
    bottom?: number
  }>(),
  {
    visibilityHeight: 200,
    target: '',
    right: 40,
    bottom: 40,
  }
)

const { visibilityHeight, target, right, bottom } = toRefs(props)

const el = ref<Element>()
const container = ref<Element | Document>()
const visible = ref<boolean>(false)

const styleBottom = computed(() => {
  return `${bottom.value}px`
})

const styleRight = computed(() => {
  return `${right.value}px`
})

const emit = defineEmits<{
  (e: 'click', data: Event): void
}>()

function init() {
  container.value = document
  el.value = document.documentElement
  if (target.value) {
    const temp = document.querySelector(target.value)
    if (!temp) {
      throw new Error(`target is not existed: ${target.value}`)
    }
    container.value = el.value = temp
  }
}

function onScroll() {
  const scrollTop = el.value?.scrollTop
  visible.value = (scrollTop ?? 0) >= visibilityHeight.value
}

function handleClick(e: Event) {
  scrollToTop()
  emit('click', e)
}

function scrollToTop() {
  if (!el.value) return
  const beginTime = Date.now()
  const beginValue = el.value.scrollTop
  const rAF = window.requestAnimationFrame || ((func) => setTimeout(func, 16))
  const frameFunc = () => {
    if (!el.value) return
    const progress = (Date.now() - beginTime) / 500
    if (progress < 1) {
      el.value.scrollTop = beginValue * (1 - easeInOutCubic(progress))
      rAF(frameFunc)
    } else {
      el.value.scrollTop = 0
    }
  }
  rAF(frameFunc)
}

onMounted(() => {
  init()
  container.value?.addEventListener('scroll', onScroll)
})

onBeforeUnmount(() => {
  container.value?.removeEventListener('scroll', onScroll)
})
</script>
