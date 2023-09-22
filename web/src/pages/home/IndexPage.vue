<template>
  <q-page class="col items-center text-primary">
    <div class="home-screen row">
      <div class="content column fix items-center">
        <h1 class="title text-bold">{{ $t('global.title') }}</h1>
        <p class="desc">{{ $t('home.desc') }}</p>
        <!-- <div>
          <q-btn
            :to="startTo"
            color="primary"
            class="start-btn"
            size="lg"
            >{{ $t('home.start') }}</q-btn
          >
        </div>
        <div class="icons-wrapper row justify-center">
          <svg-icon
            v-for="item in icons"
            :key="item"
            :name="item"
            class="svg-icon"
          ></svg-icon>
        </div> -->
        <nav-card type="page" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// import { changePathLangIso } from '@/core/utils'
// import { computed } from 'vue'
// import { useI18n } from 'vue-i18n'
import NavCard from '@/components/NavCard.vue'
// const { locale } = useI18n()

// const startTo = computed(() => {
//   return changePathLangIso('/nav', locale.value)
// })

// const icons = ['text', 'image', 'dict', 'font', 'game', 'ellipsis']
</script>

<style lang="scss" scoped>
.home-screen {
  overflow: auto;
  box-sizing: border-box;
  // background-image: linear-gradient(
  //   to bottom,
  //   var(--q-primary),
  //   rgba($primary, 0.5) 50%,
  //   var(--q-primary)
  // );

  .content {
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
    margin: 30px 0;
    font-size: 18px;
    color: $secondary;
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
