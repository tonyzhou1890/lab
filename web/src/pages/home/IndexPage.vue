<template>
  <q-page class="col items-center">
    <div class="home-screen row">
      <div class="content row fix">
        <div class="left column inline items-center">
          <h1 class="title text-bold">{{ $t('global.title') }}</h1>
          <p class="desc">{{ $t('home.desc') }}</p>
          <div>
            <q-btn
              :to="startTo"
              color="secondary"
              class="start-btn"
              size="lg"
              >{{ $t('home.start') }}</q-btn
            >
          </div>
        </div>
        <div
          class="right column inline items-center"
          color="primary"
        >
          <div class="icons-wrapper">
            <svg-icon
              v-for="item in icons"
              :key="item"
              :name="item"
            ></svg-icon>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { changePathLangIso } from '@/core/utils'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()

const startTo = computed(() => {
  return changePathLangIso('/nav', locale.value)
})

const icons = ['text', 'image', 'dict', 'font', 'game', 'ellipsis']
</script>

<style lang="scss" scoped>
.home-screen {
  height: calc(100vh - 50px);
  overflow: auto;
  box-sizing: border-box;
  color: white;
  background-image: linear-gradient(
    to bottom,
    var(--q-primary),
    rgba($primary, 0.5) 50%,
    var(--q-primary)
  );

  .content {
    max-width: 1500px;
    margin: 0 auto;
  }

  .left,
  .right {
    flex: 1;
    height: 100%;
    padding: 30px;
  }

  .title {
    margin: 15vh 0 0;
    font-size: 45px;
    line-height: 1;
    color: white;
    text-shadow: 2px 2px 2px #333;
  }

  .desc {
    margin: 30px 0;
    font-size: 18px;
  }

  .start-btn {
    width: auto;
  }

  .icons-wrapper {
    margin-top: 15vh;
    font-size: 90px;
    letter-spacing: 1em;
  }
}

@media screen and (max-width: 650px) {
  .home-screen {
    .content {
      flex-direction: column;
    }
    .left,
    .right {
      width: 100%;
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
