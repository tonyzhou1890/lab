<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        404
      </div>

      <div class="text-h2" style="opacity:.4">
        {{ $t('404.notFound') }}
      </div>

      <q-btn class="q-mt-xl" color="white" text-color="blue" unelevated :to="`/${locale || 'zh-CN'}`"
        :label="$t('404.home')" no-caps />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { locale } = useI18n({ useScope: 'global' });
</script>
