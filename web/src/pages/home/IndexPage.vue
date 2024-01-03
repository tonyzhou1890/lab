<template>
  <q-page class="col items-center text-grey-1">
    <div class="header ova column items-center">
      <h1 class="title text-bold row items-center">
        <img
          class="logo q-mr-md"
          src="/icons/favicon-128x128.png"
          alt="logo"
        />{{ $t('global.title') }}
      </h1>
      <div
        class="subtitle flex text-h4"
        key="subtitle"
      >
        <span>{{ subtitles[0] }}</span>
        <q-separator
          vertical
          color="grey-1"
          spaced="md"
        />
        <span>{{ subtitles[1] }}</span>
      </div>
      <p class="desc">{{ $t('home.desc') }}</p>
      <q-input
        square
        outlined
        v-model="keyword"
        class="search-input"
        :placeholder="$t('home.searchPlaceholder')"
        @keydown.enter="handleSearch"
      >
        <template v-slot:append>
          <q-icon
            name="search"
            class="cp input-icon"
            @click="handleSearch"
          />
        </template>
      </q-input>
    </div>
    <div class="content column fix items-center">
      <nav-card
        type="page"
        hide-page-nav
        ref="nav"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
// import { changePathLangIso } from '@/core/utils'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import NavCard from '@/components/NavCard.vue'

const { t } = useI18n()

const subtitles = t('home.subtitle').split('#')

const keyword = ref('')
const nav = ref<typeof NavCard>()

function handleSearch() {
  nav.value!.setFilter(keyword.value.trim())
}
</script>

<style lang="scss" scoped>
.header {
  background-color: $primary;
  .logo {
    width: 60px;
    height: 60px;
    background-color: white;
  }
  .title {
    font-size: 65px;
  }
  .search-input {
    margin: 30px 0;
    width: 90vw;
    max-width: 1200px;

    background-color: $grey-1;
  }
  &::after {
    content: '';
    width: 100vw;
    height: 7.8vw;
    // 存在边线，需要 -1 像素解决
    margin-bottom: -2px;
    background-image: url('@/assets/images/home/wave.png?t');
    background-size: 100%;
  }
}
.home-screen {
  overflow: auto;
  box-sizing: border-box;

  .content {
    width: 100%;
    max-width: 1500px;
    padding: 0 20px;
    margin: 0 auto;
  }

  .title {
    margin: 5vh 0 0;
    font-size: 45px;
    line-height: 1;
    // text-shadow: 2px 2px 2px #333;
  }
  .desc {
    margin: 30px 0 0;
    font-size: 18px;
  }

  .start-btn {
    width: auto;
  }

  .icons-wrapper {
    margin-top: 15vh;
    font-size: 90px;
    letter-spacing: 1em;
    box-shadow: 0px 0px 14px white;
    background: rgba(256, 256, 256, 0.5);
  }
}

@media screen and (max-width: 650px) {
  .header {
    .title {
      font-size: 45px;
    }
  }
  .home-screen {
    .content {
      flex-direction: column;
    }
    .title {
      margin-top: 5vh;
    }

    .icons-wrapper {
      margin-top: 5vh;
    }
  }
}
</style>
