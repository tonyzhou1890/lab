<template>
  <q-card
    class="text-dark page-main nav-com relative-position"
    :class="{
      'is-page': isPage,
    }"
  >
    <q-btn
      v-if="!isPage"
      flat
      icon="close"
      class="absolute-top-right close-btn"
      v-close-popup
      @click="handleClose"
    >
      <q-tooltip class="bg-white text-dark text-body1">{{
        $t('global.close')
      }}</q-tooltip>
    </q-btn>

    <q-card-section
      :class="{ 'q-px-none': isPage }"
      v-show="!isPage"
    >
      <q-input
        square
        outlined
        v-model="filter"
        class="search-input"
        :placeholder="$t('nav.searchLabel')"
      />
    </q-card-section>

    <q-card-section class="nav-section">
      <q-card-section
        v-if="!hidePageNav && pageList.length"
        class="q-pa-none"
      >
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
            class="page-nav-item bg-white q-ma-md relative-position text-dark block-shadow"
          >
            <q-item-section
              v-if="item.icon"
              avatar
            >
              <q-icon :name="item.icon" />
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ item.titleStr }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-section class="q-pa-none">
        <p
          v-if="!hidePageNav"
          class="text-h5 nav-title"
        >
          {{ $t('layout.serviceNav') }}
        </p>
        <q-list
          v-for="group in groupedServiceList"
          :key="group.key"
          class="group q-mb-lg"
        >
          <p
            class="text-h5 text-bold nav-title inline-block q-pa-md q-ma-none tac block-shadow"
          >
            {{ group.name }}
          </p>
          <q-list class="page-list service-list">
            <!-- html structured data: https://schema.org/WebApplication -->
            <!-- https://validator.schema.org/ -->
            <q-item
              v-for="item in group.value"
              :key="item.code"
              clickable
              :tag="item.htmlTag"
              :target="item.target"
              :href="item.link"
              :to="item.route"
              class="page-nav-item bg-white service-list-item column q-ma-md relative-position text-dark block-shadow"
              itemscope
              itemtype="https://schema.org/WebApplication"
            >
              <q-item-section class="service-item-inner tac ova">
                <!-- external link tag -->
                <div
                  v-if="item.link"
                  class="external-link absolute-top-right"
                >
                  <q-icon
                    name="link"
                    class="rotate-45"
                  />
                </div>
                <div class="service-icon text-white flex flex-center text-h5">
                  <q-icon
                    v-if="item.icon"
                    size="2rem"
                    :name="(item.icon as string)"
                  ></q-icon>
                  <span
                    v-else
                    class="icon-text"
                    >{{ item.firstChar }}</span
                  >
                </div>
                <q-item-label
                  :title="item.name"
                  class="service-name text-bold ellipsis"
                  itemprop="name"
                  >{{ item.name }}</q-item-label
                >
                <q-item-label
                  :title="item.desc"
                  class="service-desc ellipsis-2-lines"
                  itemprop="abstract"
                  >{{ item.desc }}</q-item-label
                >
                <q-item-label
                  v-if="item.keywords"
                  hidden
                  itemprop="keywords"
                  >{{ item.keywords }}</q-item-label
                >
                <span
                  v-if="group.key !== 'default'"
                  itemprop="applicationCategory"
                  hidden
                  >{{ group.name }}</span
                >
                <span
                  v-if="item.appUrl"
                  itemprop="url"
                  hidden
                  >{{ item.appUrl }}</span
                >
              </q-item-section>
            </q-item>
          </q-list>
        </q-list>
      </q-card-section>
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
import config from '@/core/config'

const props = defineProps<{
  // type 为 page 的时候，dialog 不可关闭
  type?: string
  // 隐藏页面导航
  hidePageNav?: boolean
}>()

const type = toRef(props, 'type')

const isPage = computed(() => {
  return type.value === 'page'
})

const filter = ref<string>('')

const route = useRoute()
const router = useRouter()

const { locale, t } = useI18n({ useScope: 'global' })

const emit = defineEmits<{
  (e: 'close'): void
}>()

function handleClose() {
  emit('close')
}

function setFilter(value: string) {
  filter.value = value
}

defineExpose({ setFilter })

// 导航页面列表
const pageList = computed<
  {
    icon: string
    title: string
    titleStr: string
    htmlTag?: string
    target?: string
    link?: string
    route?: {
      path?: string
      name?: string
    }
  }[]
>(() =>
  [
    {
      icon: 'home',
      title: 'layout.home',
      titleStr: '',
      htmlTag: 'router-link',
      target: '_self',
      route: {
        path: `/${locale.value}`,
      },
    },
  ]
    .map((page) => {
      page.titleStr = t(page.title)
      return page
    })
    .filter((page) => {
      const keyword = filter.value.trim()
      if (!keyword) return true
      return page.titleStr.includes(keyword)
    })
)

// 应用列表
const groupedServiceList = computed(() => {
  const list = groupService(
    Object.values(serviceSchema).filter((item) => !item.ignore)
  )
  const routes = router.getRoutes()
  console.log(routes)
  return list
    .map((group) => {
      group.name = t(`global.category.${group.key}`)
      const routeList = group.value
        .map((item) => {
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
            icon: item.icon,
            firstChar: t(item.i18nKey + '.title')[0],
            name: t(item.i18nKey + '.title'),
            keywords: t(item.i18nKey + '.keywords'),
            desc: t(item.i18nKey + '.desc'),
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
            appUrl: item.link || `https://${config.hostname}${path}`,
          }
        })
        .filter((service) => {
          const keyword = filter.value.trim().toLowerCase()
          if (!keyword) return true
          return (
            service.name.toLowerCase().includes(keyword) ||
            service.desc.toLowerCase().includes(keyword)
          )
        })
      return {
        key: group.key,
        name: group.name,
        value: routeList,
      }
    })
    .filter((group) => group.value.length)
})
</script>

<style lang="scss" scoped>
.nav-com {
  font-size: 16px;
  box-shadow: none;
  padding-top: 30px;
  overflow: visible;
  .close-btn {
    z-index: 3;
  }
  .bar {
    background-color: transparent;
  }

  .search-input {
    background-color: rgba($color: #ffffff, $alpha: 0.7);
  }

  .nav-title {
    min-width: 120px;
    background-color: white;
  }

  .page-list {
    margin: 0 -16px;
  }

  .page-nav-item {
    display: inline-flex;
    width: 200px;
    background-color: white;
    // border: 1px solid $dark;
    border-radius: 4px;
    &:hover {
      background-color: $info !important;
      .service-desc {
        color: white !important;
      }
      color: white !important;
    }
  }

  .service-list-item {
    height: 178px;
    vertical-align: middle;

    .service-item-inner {
      z-index: 3;
    }

    .external-link {
      line-height: 1;
      font-size: 1.4rem;
    }

    .service-icon {
      width: 50px;
      height: 50px;
      border-radius: 8px;
      margin: 0 auto 10px;
      background-color: $primary;
    }

    .service-name {
      font-size: 22px;
    }

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

  &.is-page {
    background-color: transparent;
    width: 90vw;
    padding: 0;
    .nav-section {
      background-color: transparent;
      padding: 0;
      border-radius: 4px;
    }
  }
}

@media screen and (max-width: 750px) {
  .nav-com {
    .page-nav-item {
      width: calc(50% - 32px);
      &:nth-child(2n) {
        margin-right: 0;
      }
    }
  }
}

@media screen and (max-width: 420px) {
  .nav-com {
    .page-nav-item {
      width: calc(100% - 32px);
      margin-right: 0;
    }
  }
}
</style>
