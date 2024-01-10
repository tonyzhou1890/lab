<template>
  <q-dialog
    class="dialog column"
    v-model="visible"
    :style="{
      fontFamily,
    }"
  >
    <div class="card relative-position">
      <div class="card-inner fit ova">
        <div class="content fit ova tac">
          <p class="title text-h5 text-bold">{{ data.title }}</p>
          <p class="author color-grey">
            <span v-if="data.dynasty">[{{ data.dynasty }}]</span>
            <span>{{ data.author }}</span>
          </p>
          <div class="content-text">{{ data.content }}</div>
        </div>
      </div>
      <q-icon
        name="cancel"
        color="grey"
        class="poa close-icon cp bg-white text-h4"
        @click="handleClose"
      ></q-icon>
    </div>
    <!-- <q-card class="card">
      <q-card-section class="column tac">
        <p class="title text-h5">{{ data.title }}</p>
        <p class="author color-grey">
          <span v-if="data.dynasty">[{{ data.dynasty }}]</span>
          <span>{{ data.author }}</span>
        </p>
        <pre class="content">{{ data.content }}</pre>
      </q-card-section>
      <q-icon
        name="cancel"
        color="grey"
        class="poa close-icon bg-white text-h4"
        @click="handleClose"
      ></q-icon>
    </q-card> -->
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick, toRefs } from 'vue'
import type { PoemItem } from '@/core/service/poem/core'

const props = defineProps<{
  data: PoemItem
  fontFamily: string
}>()

const { data, fontFamily } = toRefs(props)
console.log(fontFamily.value)

const visible = ref(false)

function show() {
  nextTick(() => {
    visible.value = true
  })
}

function hide() {
  visible.value = false
}

function handleClose() {
  visible.value = false
}

defineExpose({
  show,
  hide,
})
</script>

<style lang="scss" scoped>
.dialog {
  .card {
    // 这里产生了新的 css 变量名，但是浏览器找不到对应的键值对
    // font-family: v-bind('fontFamily');
    width: 450px;
    max-width: 90vw;
    height: 600px;
    max-height: 85vh;
    padding-bottom: 1rem;
    box-sizing: border-box;
    overflow: hidden !important;
    .card-inner {
      border-radius: 4px;
      box-sizing: border-box;
      background-image: url('@/assets/images/poem/poem-bg.jpg');
      background-size: 100% 100%;
      padding: 15% 10%;
    }
    .content-text {
      white-space: pre-wrap;
      font-size: 1.14rem;
    }
  }
  .close-icon {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 50%;
  }
}
</style>
