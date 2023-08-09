<template>
  <div class="page-main app">
    <ServiceBaseInfo service-name="font" />
    <div class="content">
      <div class="file">
        <q-file v-model="file" :label="$t('font.fileLabel')" accept=".ttf, .woff, .otf" />
      </div>
      <div class="full-width" v-show="parsedFlag">
        <!-- font info -->
        <section class="info-section">
          <h2 class="section-title">{{ $t('font.fontInfo') }}</h2>
          <q-list>
            <q-item v-for="item in fontInfo" :key="item._id">
              <q-item-section class="text-bold">{{ item.name }}</q-item-section>
              <q-item-section>{{ item.value }}</q-item-section>
            </q-item>
          </q-list>
        </section>
        <!-- font glyph list -->
        <section class="glyph-section">
          <h2 class="section-title">{{ $t('font.glyphs') }}</h2>
          <q-select class="glyph-select" :options="glyphsOptions" option-value="id" option-label="label"
            v-model="selectedGlyphGroup" emit-value map-options @update:model-value="drawGlyph"></q-select>
          <div class="glyph-draw-list q-pt-md" ref="glyphContainer"></div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import fontService from '@/core/service/font'
import type * as OpenType from 'opentype.js'
import { useI18n } from 'vue-i18n'
import ServiceBaseInfo from '@/components/ServiceBaseInfo.vue'

interface FontInfoItem {
  _id?: number
  name: string
  value: string | number
}

interface GlyphOption {
  id: number
  label: string
}

const { t } = useI18n()

const file = ref(null)

let parsedFont: OpenType.Font | undefined = undefined
let parsedFlag = ref(false)

watch(file, async (newValue: File | null) => {
  console.log(newValue)
  if (newValue) {
    parsedFont = await fontService.parse(await newValue.arrayBuffer())
    if (parsedFont) {
      selectedGlyphGroup.value = 0
      parsedFlag.value = true
      drawGlyph()
    }
    console.log(parsedFont)
  }
})

// 字体信息
const fontInfo = computed<FontInfoItem[]>(() => {
  if (!parsedFlag.value) {
    return []
  }
  const names = parsedFont?.names
  return [
    {
      name: t('font.fontFamily'),
      value: names?.fontFamily?.zh ?? '',
    },
    {
      name: t('font.copyright'),
      value: names?.copyright?.zh ?? '',
    },
    {
      name: t('font.license'),
      value: names?.license?.zh ?? '',
    },
    {
      name: t('font.version'),
      value: names?.version?.zh ?? '',
    },
    {
      name: t('font.charNum'),
      value: parsedFont?.numGlyphs ?? 0,
    },
  ].map((item: FontInfoItem) => {
    item._id = Math.random()
    return item
  })
})

// 字形信息
const glyphsOptions = computed<GlyphOption[]>(() => {
  if (!parsedFlag.value) {
    return []
  }
  return new Array(Math.ceil((parsedFont?.numGlyphs ?? 0) / 100))
    .fill(0)
    .map((_, index: number) => {
      return {
        id: index,
        label: `${100 * index + 1}~${Math.min(
          100 * (index + 1),
          parsedFont?.numGlyphs ?? 0
        )}`,
      }
    })
})

const selectedGlyphGroup = ref<null | number>(null)

const glyphContainer = ref<HTMLDivElement | null>(null)

const drawGlyph = () => {
  setTimeout(() => {
    if (
      parsedFont &&
      glyphContainer.value &&
      selectedGlyphGroup.value !== null
    ) {
      const start = selectedGlyphGroup.value * 100
      const end = Math.min(
        (selectedGlyphGroup.value + 1) * 100,
        parsedFont?.numGlyphs ?? 0
      )
      const fragment = document.createDocumentFragment()
      const DPR = window.devicePixelRatio
      for (let i = start; i < end; i++) {
        const canvas = document.createElement('canvas')
        canvas.style.width = '50px'
        canvas.style.height = '50px'
        canvas.width = 50 * DPR
        canvas.height = 50 * DPR
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
        ctx.scale(DPR, DPR)
        ctx.font = '12px arial'
        ctx.fillStyle = 'gray'
        ctx.fillText(i.toString(), 0, 12)
        const glyph = parsedFont.glyphs.get(i)
        if (glyph !== undefined) {
          glyph.draw(ctx, 5, 40, 35)
        }
        fragment.appendChild(canvas)
      }
      glyphContainer.value.innerHTML = ''
      glyphContainer.value.appendChild(fragment)
    }
  })
}
</script>

<style lang="scss">
.page-main {

  .file,
  .glyph-select {
    width: 300px;
    max-width: 90%;
    margin: 0 auto;
  }
}
</style>
