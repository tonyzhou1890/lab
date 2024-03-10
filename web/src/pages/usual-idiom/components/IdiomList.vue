<template>
  <div
    v-for="item in compiledList"
    :key="item.word"
    class="idiom q-mb-md"
  >
    <p class="word q-mr-md">{{ item.word }}</p>
    <p
      v-if="item.info"
      class="info q-mr-md"
      v-html="item.info"
    ></p>
  </div>
</template>

<script setup lang="ts">
import { IdiomItem } from '@/core/service/idiom/core'
import { computed, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  list: IdiomItem[]
}>()

const { list } = toRefs(props)

const compiledList = computed(() => {
  return list.value.map((item) => {
    const temp = {
      word: item.word,
      info: '',
    }
    if (item.phonetic) {
      temp.info += item.phonetic
    }
    if (item.definition) {
      temp.info += `&emsp;${item.definition}`
    }
    if (item.source) {
      temp.info += `&emsp;[${t('idiom.data.source')}]${item.source}`
    }
    // if (item.story) {
    //   temp.info += `&emsp;[${t('idiom.data.story')}]${item.story}`
    // }
    if (item.example && item.example !== item.source) {
      temp.info += `&emsp;[${t('idiom.data.example')}]${item.example}`
    }
    if (item.synonyms) {
      temp.info += `&emsp;[${t('idiom.data.synonyms')}]${item.synonyms}`
    }
    if (item.antonyms) {
      temp.info += `&emsp;[${t('idiom.data.antonyms')}]${item.antonyms}`
    }
    if (item.wisecrack) {
      temp.info += `&emsp;[${t('idiom.data.wisecrack')}]${item.wisecrack}`
    }
    if (item.grammar) {
      temp.info += `&emsp;[${t('idiom.data.grammar')}]${item.grammar}`
    }
    if (item.english) {
      temp.info += `&emsp;${item.english}`
    }
    return temp
  })
})
</script>

<style lang="scss" scoped>
.idiom {
  white-space: pre-wrap;
  p {
    display: inline;
  }
  .word {
    font-size: 1.2em;
  }
  .info {
    font-size: 0.8em;
  }
}
</style>
