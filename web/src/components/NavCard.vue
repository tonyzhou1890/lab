<template>
  <q-card class="text-dark page-main nav-com">
    <q-bar
      v-if="!isPage"
      class="bar"
    >
      <q-space />

      <q-btn
        dense
        flat
        icon="close"
        v-close-popup
      >
        <q-tooltip class="bg-white text-dark">Close</q-tooltip>
      </q-btn>
    </q-bar>

    <q-card-section v-if="!isHome">
      <p class="text-h5 nav-title">{{ $t('layout.pageNav') }}</p>
      <q-list class="page-list">
        <q-item
          v-for="item in pageList"
          :key="item.title"
          clickable
          :tag="item.htmlTag"
          :target="item.target"
          :href="item.link"
          :to="item.route"
          class="page-nav-item bg-white q-ma-md relative-position text-dark"
        >
          <q-item-section
            v-if="item.icon"
            avatar
          >
            <q-icon :name="item.icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ $t(item.title) }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-card-section>
      <p
        v-if="!isHome"
        class="text-h5 nav-title"
      >
        {{ $t('layout.serviceNav') }}
      </p>
      <q-list
        v-for="group in groupedServiceList"
        :key="group.key"
      >
        <p class="text-h6 nav-title">{{ $t(group.key) }}</p>
        <q-list class="page-list service-list">
          <q-item
            v-for="item in group.value"
            :key="item.code"
            clickable
            :tag="item.htmlTag"
            :target="item.target"
            :href="item.link"
            :to="item.route"
            class="page-nav-item bg-white service-list-item column q-ma-md relative-position text-dark"
            :data-first-char="item.firstChar"
          >
            <q-item-section>
              <q-item-label class="text-bold">{{ item.name }}</q-item-label>
              <q-item-label
                :title="item.desc"
                class="service-desc ellipsis-2-lines"
                >{{ item.desc }}</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import serviceSchema from '@/core/service/schema'
import { groupService } from '@/core/service/service-schema'
import { changePathLangIso } from '@/core/utils'

const props = defineProps<{
  // type 为 page 的时候，dialog 不可关闭
  type?: string
}>()

const type = toRef(props, 'type')

const open = ref(type.value === 'page')

const isPage = computed(() => {
  return type.value === 'page'
})

const route = useRoute()
const router = useRouter()

const isHome = computed(() => {
  return route.name === 'Home' || route.name === 'LangHome'
})

const { locale, t } = useI18n({ useScope: 'global' })

function toggle(value?: boolean) {
  if (isPage.value) return
  if (value !== undefined) {
    open.value = !!value
  } else {
    open.value = !open.value
  }
}

defineExpose({ toggle })

// 导航页面列表
const pageList = computed<
  {
    icon: string
    title: string
    htmlTag?: string
    target?: string
    link?: string
    route?: {
      path?: string
      name?: string
    }
  }[]
>(() => [
  {
    icon: 'home',
    title: 'layout.home',
    htmlTag: 'router-link',
    target: '_self',
    route: {
      path: `/${locale.value}`,
    },
  },
])

// 应用列表
const groupedServiceList = computed(() => {
  const list = groupService(Object.values(serviceSchema))
  const routes = router.getRoutes()
  return list.map((group) => {
    const routeList = group.value.map((item) => {
      const htmlTag = item.extra
        ? 'a'
        : item.link && item.link.startsWith('http')
        ? 'a'
        : 'router-link'
      let path = ''
      if (htmlTag !== 'a') {
        for (let i = 0; i < routes.length; i++) {
          if (item.code && item.code === routes[i].name) {
            path = changePathLangIso(routes[i].path, locale.value as string)
            break
          }
        }
      }
      return {
        code: item.code,
        firstChar: t(item.name)[0],
        desc: t(item.desc),
        name: t(item.name),
        htmlTag,
        target: htmlTag === 'a' ? '_blank' : '_self',
        link: item.link,
        route:
          htmlTag === 'a'
            ? ''
            : {
                path,
                query: route.query,
              },
      }
    })
    return {
      key: group.key,
      value: routeList,
    }
  })
})
</script>

<style lang="scss" scoped>
.nav-com {
  font-size: 16px;

  .bar {
    background-color: transparent;
  }

  .nav-title {
    margin-bottom: 0;
  }

  .page-nav-item {
    display: inline-flex;
    width: 200px;
    border: 1px solid $dark;
  }

  .service-list-item {
    height: 78px;
    vertical-align: middle;

    .service-desc {
      color: $grey-7;
      font-size: 14px;
      min-height: 2.4em;
    }

    &::before {
      content: attr(data-first-char);
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) scale(2, 1);
      font-size: 40px;
      font-weight: bold;
      color: rgba($color: #000000, $alpha: 0.1);
    }
  }

  // 都不生效
  // &:deep(.q-item.q-router-link--active) {
  //   .q-item.q-router-link--active,
  //   .q-item--active {
  //     color: inherit;
  //   }
  // }
  // &:deep(.q-router-link--active) {
  //   display: none;
  // }
}

@media screen and (max-width: 750px) {
  .page-main {
    padding: 10px 0;
  }
  .nav-com {
    .page-nav-item {
      width: calc(50% - 32px);
    }
  }
}

@media screen and (max-width: 380px) {
  .nav-com {
    .page-nav-item {
      width: calc(100% - 32px);
    }
  }
}
</style>
