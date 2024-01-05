<template>
  <div class="page-main app">
    <ServiceBaseInfo service-name="font" />
    <div class="content q-pt-lg">
      <div class="file">
        <q-select
          outlined
          :label="$t('font.fileLabel')"
          :options="fontList"
          option-value="_id"
          option-label="name"
          v-model="fontSelectecd"
          map-options
          @update:model-value="selectFont"
        >
          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              class="font-select-item"
              :class="{
                select: !scope.opt.path && !scope.opt.file,
                local: scope.opt.file,
              }"
            >
              <q-item-section>
                <q-item-label
                  ><span class="name">{{ scope.opt.name }}</span></q-item-label
                >
              </q-item-section>
              <!-- 有 path，说明是远程字体，显示字体大小和图标 -->
              <q-item-section
                v-if="scope.opt.path"
                side
              >
                <q-icon
                  name="cloud"
                  color="blue-5"
                />
                <q-item-label caption>{{
                  format.humanStorageSize(scope.opt.compressedSize)
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div
        class="full-width"
        v-show="parsedFlag"
      >
        <!-- font info -->
        <section class="info-section">
          <SectionTitle>{{ $t('font.fontInfo') }}</SectionTitle>
          <q-list>
            <q-item
              v-for="item in fontInfo"
              :key="item._id"
            >
              <q-item-section class="text-bold">{{ item.name }}</q-item-section>
              <q-item-section>{{ item.value }}</q-item-section>
            </q-item>
          </q-list>
        </section>
        <!-- font glyph list -->
        <section class="glyph-section">
          <SectionTitle>{{ $t('font.glyphs') }}</SectionTitle>
          <q-select
            outlined
            class="glyph-select"
            :options="glyphsOptions"
            option-value="id"
            option-label="label"
            v-model="selectedGlyphGroup"
            emit-value
            map-options
            @update:model-value="drawGlyph"
          ></q-select>
          <!-- 字形列表 -->
          <div
            class="glyph-draw-list q-pt-md"
            ref="glyphContainer"
          >
            <div
              v-for="item in drawnGlyphs"
              :key="item._id"
              class="glyph-item hover-shadow inline-block q-ma-xs relative-position cursor-pointer"
              :data-index="item.index"
            >
              <img
                :src="item.dataUrl"
                class="glyph-img"
              />
              <p class="text-body1 ellipsis no-margin tac">
                {{ formatUnicode(item.glyph.unicode) }}
              </p>
              <q-tooltip
                anchor="top middle"
                self="bottom middle"
                class="text-body1"
                :offset="[10, 10]"
                >{{ $t('font.name') + '：' + item.glyph.name }}</q-tooltip
              >
            </div>
          </div>
        </section>
        <!-- 字体裁剪 -->
        <section class="cut-section">
          <SectionTitle>{{ $t('font.cut') }}</SectionTitle>
          <q-form
            class="cut-form q-gutter-y-md"
            bottom="false"
            @submit="onSubmit"
          >
            <q-input
              outlined
              v-model="toCutText"
              :label="$t('font.cutLabel')"
              class="text-body1 cut-text"
              type="textarea"
              lazy-rules
              :rules="[
                (val) =>
                  (val !== null && val !== '') || $t('global.form.required'),
              ]"
            />
            <div class="btns row justify-center">
              <q-btn
                :loading="btnLoading"
                :label="$t('global.form.submit')"
                type="submit"
                color="primary"
              ></q-btn>
            </div>
          </q-form>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import FontService, { FontConfig } from '@/core/service/font'
import type * as OpenType from 'opentype.js'
import { useI18n } from 'vue-i18n'
import {
  formatUnicode,
  setCssFont,
  getLocalFile,
  getFileName,
} from '@/core/utils/index'
import { useQuasar, format } from 'quasar'
import { CoreErrorEnum } from '@/core/error'
import { errorNotify } from '@/core/error/utils'
import { loading } from '@/core/io/utils'

interface FontInfoItem {
  _id?: number
  name: string
  value: string | number
}

interface GlyphOption {
  id: number
  label: string
}

const $q = useQuasar()

const { t } = useI18n()

const file = ref<File | null>(null)

const fontList = ref<(FontConfig & { _id: symbol; file?: File })[]>()
const fontSelectecd = ref<FontConfig & { file?: File }>()

const parsedFlag = ref(0)

const service = new FontService()

const glyphsOptions = ref<GlyphOption[]>([])

const selectedGlyphGroup = ref<null | number>(null)

const glyphContainer = ref<HTMLDivElement | null>(null)

const drawnGlyphs = ref<
  {
    _id: symbol
    dataUrl: string
    index: number
    glyph: OpenType.Glyph
  }[]
>([])

// 预览字体宽度
const fontWidth = 70

onMounted(async () => {
  try {
    await service.init()
    fontList.value = [
      {
        _id: Symbol(),
        name: t('font.localFile'),
        path: '',
        fontPath: '',
        version: '',
        compressedSize: 0,
      },
      ...service.fontIndex.list.map((item) => {
        return {
          ...item,
          _id: Symbol(),
        }
      }),
    ]
  } catch (e) {
    errorNotify(e, { t })
  }
})

// 选择字体
async function selectFont() {
  const cfg = fontSelectecd.value
  // 选择的本地
  if (!cfg?.path && !cfg?.file) {
    fontSelectecd.value = undefined
    const files = await getLocalFile({
      accept: '.ttf, .woff, .otf',
    })
    if (files[0]) {
      file.value = files[0]
      const name = getFileName(files[0])
      let fontCfg = fontList.value?.find(
        (item) => item.name === name && item.file
      )
      if (fontCfg) {
        // 如果列表缓存已经有了，直接替换
        fontCfg.file = files[0]
      } else {
        fontCfg = {
          _id: Symbol(),
          name: getFileName(files[0]),
          path: '',
          fontPath: '',
          file: files[0],
          version: '',
          compressedSize: 0,
        }
        // 否则添加新缓存到列表
        fontList.value?.push(fontCfg)
      }
      fontSelectecd.value = fontCfg
    }
  } else if (!cfg?.path) {
    // 缓存的字体
    file.value = cfg.file as File
  } else {
    // 远程拉取
    try {
      loading.show()
      const blob = await service.loadFont({
        ...cfg,
        loadCallback: loading.update,
      })
      if (blob) {
        // console.log(blob)
        file.value = new File([blob], cfg.name)
      } else {
        throw new Error(CoreErrorEnum[201])
      }
      loading.hide()
    } catch (e) {
      loading.hide()
      errorNotify(e, { t })
    }
  }
}

watch(file, async (newValue: File | null) => {
  if (newValue) {
    service.parse(await newValue.arrayBuffer())
    if (service.fontParsed) {
      glyphsOptions.value = service.glyphsOptions
      selectedGlyphGroup.value = 0
      parsedFlag.value++
      drawnGlyphs.value = service.drawSlectedGlyphs(0, fontWidth)
      // 设置字体
      fontFaceName.value = setCssFont(newValue)
      // console.log(service.fontParsed)
    }
  } else {
    parsedFlag.value = 0
    fontFaceName.value = ''
  }
})

// 字体信息
const fontInfo = computed<FontInfoItem[]>(() => {
  if (!parsedFlag.value) {
    return []
  }
  const names = service.fontParsed?.names
  return [
    {
      name: t('font.fontFamily'),
      value: names?.fontFamily?.zh ?? names?.fontFamily?.en ?? '',
    },
    {
      name: t('font.copyright'),
      value: names?.copyright?.zh ?? names?.copyright?.en ?? '',
    },
    {
      name: t('font.license'),
      value: names?.license?.zh ?? names?.license?.en ?? '',
    },
    {
      name: t('font.version'),
      value: names?.version?.zh ?? names?.version?.en ?? '',
    },
    {
      name: t('font.charNum'),
      value: service.fontParsed?.numGlyphs ?? 0,
    },
    {
      name: t('font.size'),
      value: format.humanStorageSize(service.fontBuffer?.byteLength ?? 0),
    },
  ].map((item: FontInfoItem) => {
    item._id = Math.random()
    return item
  })
})

const drawGlyph = () => {
  drawnGlyphs.value = service.drawSlectedGlyphs(
    selectedGlyphGroup.value!,
    fontWidth
  )
}

// 字体裁剪
const fontFaceName = ref('')
const toCutText = ref('')
const btnLoading = ref(false)

function onSubmit() {
  // 文字过滤--不要换行符、制表符等
  const text = toCutText.value.replace(/[\r\n\t]/g, '')
  if (!text) {
    return $q.notify(t('font.cutLabel'))
  }
  btnLoading.value = true
  const newFont = service.cutFont(text)
  btnLoading.value = false

  $q.dialog({
    title: t('global.download.title'),
    message: `${t('global.download.msg')}`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    const names = service.fontParsed?.names
    newFont.download(
      (names?.fontFamily?.zh || names?.fontFamily?.en || 'custom font') + '.otf'
    )
  })
}
</script>

<style lang="scss" scoped>
.page-main {
  .file,
  .glyph-select {
    width: 300px;
    max-width: 90%;
    margin: 0 auto;
  }
  .glyph-draw-list {
    .glyph-item {
      width: 72px;
      height: 107px;
      padding-top: 7px;
      box-sizing: border-box;
      border: 1px solid grey;
      vertical-align: middle;
      &:hover {
        border-color: $dark;
        background-color: $blue-2;
      }
      .glyph-img {
        width: 70px;
        height: 70px;
        vertical-align: middle;
      }
      &::before {
        content: attr(data-index);
        font-size: 12px;
        line-height: 14px;
        position: absolute;
        color: $grey;
        left: 3px;
        top: 0px;
      }
    }
  }
  .cut-section {
    .cut-text {
      font-family: v-bind('fontFaceName');
    }
  }
}
.font-select-item {
  &.select {
    color: $grey-1;
    background-color: $primary !important;
  }
}
</style>
