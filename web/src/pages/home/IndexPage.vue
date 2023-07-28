<template>
  <q-page class="col items-center">
    <div class="home-screen bg-primary por">
      <div class="background poa full ovh">
        <svg-icon v-for="(item, index) in backgroundIconList" :key="index" class="poa" :style="{
          width: item.width + 'px',
          height: item.width + 'px',
          left: item.postion[0] + '%',
          top: item.postion[1] + '%'
        }" name="snow" color="white" />
      </div>
      <div class="content poa full col items-center">

        <h1 class="title">{{ $t('global.title') }}</h1>

        <!-- search tools -->
        <q-select class="tool-search" rounded outlined v-model="toolModel" :options="tools" use-input hide-selected
          @filter="filterFn" hide-dropdown-icon :placeholder="$t('home.searchPlaceholder')" bg-color="white">
          <template v-slot:append>
            <q-icon name="search" class="cursor-pointer" />
          </template>
          <!-- <template v-slot:label>
          <p class="placeholder">{{ $t('home.searchPlaceholder') }}</p>
        </template> -->
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-italic text-grey">
                {{ $t('global.noOption') }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>
    <div class="tool-section">
      <ul class="tool-list">
        <li class="tool-item"></li>
      </ul>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMeta } from 'quasar';
import { useI18n } from 'vue-i18n';
import { type QSelectProps } from 'quasar'
import allbox from 'allbox'

const { t } = useI18n()

useMeta({
  title: `${t('home.title')} | ${t('global.title')}`
})

// background
const backgroundIconList = ref(allbox.graphic.randomScatter([[0, 0], [100, 100]], 100).map((item: [number, number]) => {
  return {
    postion: item,
    width: allbox.number.randomRange(10, 20)
  }
}))

// search tools
const toolModel = ref('')
const tools = ref([])
let filterFn: QSelectProps['onFilter'] = (val, update) => {
  update(
    () => {
      if (val === '') {
        tools.value = []
      }
      else {
        // const needle = val.toLowerCase()
        tools.value = []
      }
    },

    // "ref" is the Vue reference to the QSelect
    ref => {
      if (val !== '' && ref?.options?.length as number > 0) {
        ref.setOptionIndex(-1) // reset optionIndex in case there is something selected
        ref.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
      }
    }
  )
}
</script>

<style lang="scss" scoped>
.home-screen {
  height: calc(100vh - 50px);
  overflow: auto;
  box-sizing: border-box;

  .content {
    text-align: center;
    padding-top: 20vh;
  }

  .title {
    margin: 0;
    font-size: 8vw;
    font-style: italic;
    font-family: kai;
    line-height: 1;
    color: white;
  }

  .tool-search {
    width: 70%;
    margin: 13vh auto 0;

    &.q-field--focused {
      .placeholder {
        display: none;
      }
    }
  }
}

@media screen and (max-width: 800px) {
  .home-screen {
    .tool-search {
      width: 80%;
    }
  }
}
</style>
