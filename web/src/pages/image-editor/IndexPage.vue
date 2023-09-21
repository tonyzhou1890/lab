<template>
  <div class="page-main app flex">
    <div class="toolbar"></div>
    <div class="stage-container">
      <canvas
        ref="canvasRef"
        class="fit"
      ></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import imageEditorService from '@/core/service/image-editor'
import type { ImageEditor } from '@/core/service/image-editor'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
// import { MagickFormat } from '@imagemagick/magick-wasm'

const $q = useQuasar()

const { t } = useI18n()

// 是否初始化完毕
const initialed = ref<boolean>(false)

// 编辑器实例
let editorInstance: ImageEditor | null = null

const canvasRef = ref<HTMLCanvasElement | null>(null)

// 挂载
onMounted(async () => {
  await init()
})

// 初始化
async function init() {
  try {
    await imageEditorService.init({
      loadCallback(progressEvent) {
        console.log(progressEvent)
      },
    })

    editorInstance = new imageEditorService.ImageEditor({
      canvas: canvasRef.value!,
      t,
    })
    console.log(editorInstance)
    initialed.value = true
  } catch (e) {
    console.log(e)
    $q.notify((e as Error).message)
  }
}

// 转为 ico
// async function handleChangeToIco() {
//   if (!file.value) return
//   try {
//     const buf = await file.value.arrayBuffer()
//     const res = await imageEditorService.worker.transformFormat(
//       new Uint8Array(buf),
//       MagickFormat.Ico
//     )
//     window.open(URL.createObjectURL(res))
//     console.log(res)
//   } catch (e) {
//     console.log(e)
//   }
// }
</script>

<style lang="scss" scoped>
.page-main {
  width: 100vw;
  height: calc(100vh - 50px);
  padding: 0;
  background-color: white;
  .toolbar {
    width: 50px;
    height: 100%;
  }
  .stage-container {
    width: calc(100% - 50px);
    height: 100%;
  }
}
</style>
