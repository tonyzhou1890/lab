import { RouteRecordRaw } from 'vue-router'
import serviceSchema from '@/core/service/schema'
import config from '@/core/config'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/pages/home/IndexPage.vue'),
      },
    ],
  },

  {
    path: `/:lang(${config.langIsoList.join('|')})/`,
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'LangHome',
        component: () => import('@/pages/home/IndexPage.vue'),
      },
      {
        path: 'nav',
        name: 'Nav',
        component: () => import('@/pages/nav/IndexPage.vue'),
        meta: {
          title: 'nav.title',
          keywords: 'nav.keywords',
          desc: 'nav.desc',
        },
      },
      {
        path: 'service/font',
        name: 'Font',
        component: () => import('@/pages/font/IndexPage.vue'),
      },
      {
        path: 'service/word-count',
        name: 'WordCount',
        component: () => import('@/pages/word-count/IndexPage.vue'),
      },
      {
        path: 'service/digest',
        name: 'Digest',
        component: () => import('@/pages/digest/IndexPage.vue'),
      },
      {
        path: 'service/counter',
        name: 'Counter',
        component: () => import('@/pages/counter/IndexPage.vue'),
      },
      {
        path: 'service/qrcode',
        name: 'QRCode',
        component: () => import('@/pages/qrcode/IndexPage.vue'),
      },
      {
        path: 'service/favicon',
        name: 'Favicon',
        component: () => import('@/pages/favicon/IndexPage.vue'),
      },
      {
        path: 'service/area-code',
        name: 'AreaCode',
        component: () => import('@/pages/area-code/IndexPage.vue'),
      },
      {
        path: 'service/poem',
        name: 'Poem',
        component: () => import('@/pages/poem/IndexPage.vue'),
      },
      {
        path: 'service/m-icons',
        name: 'MIcons',
        component: () => import('@/pages/m-icons/IndexPage.vue'),
      },
      {
        path: 'service/idiom',
        name: 'Idiom',
        component: () => import('@/pages/idiom/IndexPage.vue'),
      },
      {
        path: 'service/utf8',
        name: 'Utf8',
        component: () => import('@/pages/utf8/IndexPage.vue'),
      },
      {
        path: 'service/time',
        name: 'Time',
        component: () => import('@/pages/time/IndexPage.vue'),
      },
      {
        path: 'service/base-convert',
        name: 'BaseConvert',
        component: () => import('@/pages/base-convert/IndexPage.vue'),
      },
      {
        path: 'service/temperature-convert',
        name: 'TemperatureConvert',
        component: () => import('@/pages/temperature-convert/IndexPage.vue'),
      },
      {
        path: 'service/angle-convert',
        name: 'AngleConvert',
        component: () => import('@/pages/angle-convert/IndexPage.vue'),
      },
      {
        path: 'service/bmi',
        name: 'BMI',
        component: () => import('@/pages/bmi/IndexPage.vue'),
      },
      {
        path: 'service/periodic-table-of-elements',
        name: 'PeriodicTableOfElements',
        component: () =>
          import('@/pages/periodic-table-of-elements/IndexPage.vue'),
      },
      {
        path: 'service/nes',
        name: 'Nes',
        component: () => import('@/pages/nes/IndexPage.vue'),
      },
      {
        path: 'service/nes/run',
        name: 'NesRun',
        component: () => import('@/pages/nes/RunGame.vue'),
      },
      {
        path: 'service/gba',
        name: 'GBA',
        component: () => import('@/pages/gba/IndexPage.vue'),
      },
      {
        path: 'service/gba/run',
        name: 'GBARun',
        component: () => import('@/pages/gba/RunGame.vue'),
      },
      {
        path: 'service/shake-test',
        name: 'ShakeTest',
        component: () => import('@/pages/shake-test/IndexPage.vue'),
      },
      {
        path: ':catchAll(.*)*',
        component: () => import('@/pages/404/IndexPage.vue'),
      },
    ].map((item) => {
      if (item.name) {
        const service = Object.values(serviceSchema).find(
          (service) => service.code === item.name
        )
        if (service) {
          const newRoute = {
            ...item,
            meta: {
              title: `${service.i18nKey}.title`,
              keywords: `${service.i18nKey}.keywords`,
              desc: `${service.i18nKey}.desc`,
            },
          }
          return newRoute
        }
      }
      return item
    }),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/404/IndexPage.vue'),
  },
]

export default routes
