<template>
  <q-page class="col items-center">
    <div class="home-screen bg-primary por">
      <ScatterIconsBackground :icons="backgroundIcons" />
      <div class="content poa fit col items-center">
        <h1 class="title">{{ $t('global.title') }}</h1>

        <!-- search tools -->
        <q-select
          class="tool-search"
          rounded
          outlined
          v-model="toolModel"
          :options="tools"
          use-input
          hide-selected
          @filter="filterFn"
          hide-dropdown-icon
          :placeholder="$t('home.searchPlaceholder')"
          bg-color="white"
        >
          <template v-slot:append>
            <q-icon
              name="search"
              class="cursor-pointer"
            />
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
import { type QSelectProps } from 'quasar'

// background
const backgroundIcons = [
  {
    name: 'snow',
    count: 200,
    minWidth: 16,
    maxWidth: 30,
  },
]

// search tools
const toolModel = ref('')
const tools = ref([])
let filterFn: QSelectProps['onFilter'] = (val, update) => {
  update(
    () => {
      if (val === '') {
        tools.value = []
      } else {
        // const needle = val.toLowerCase()
        tools.value = []
      }
    },

    // "ref" is the Vue reference to the QSelect
    (ref) => {
      if (val !== '' && (ref?.options?.length as number) > 0) {
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

  .background {
    color: white;
  }

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
    text-shadow: 2px 2px 2px #333;
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

  .tool-section {
    height: 200vh;
  }
}

@media screen and (max-width: 800px) {
  .home-screen {
    .title {
      font-size: 12vw;
    }

    .tool-search {
      width: 80%;
    }
  }
}
</style>
