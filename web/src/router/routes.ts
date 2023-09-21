import { RouteRecordRaw } from 'vue-router'
import serviceSchema from '@/core/service/schema'
import config from '@/core/config'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('pages/home/IndexPage.vue'),
      },
    ],
  },

  {
    path: `/:lang(${config.langIsoList.join('|')})/`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'LangHome',
        component: () => import('pages/home/IndexPage.vue'),
      },
      {
        path: 'nav',
        name: 'Nav',
        component: () => import('pages/nav/IndexPage.vue'),
        meta: {
          title: 'nav.title',
          keywords: 'nav.keywords',
          desc: 'nav.desc',
        },
      },
      {
        path: 'service/font',
        name: 'Font',
        component: () => import('pages/font/IndexPage.vue'),
      },
      {
        path: 'service/word-count',
        name: 'WordCount',
        component: () => import('pages/word-count/IndexPage.vue'),
      },
      {
        path: 'service/digest',
        name: 'Digest',
        component: () => import('pages/digest/IndexPage.vue'),
      },
      {
        path: 'service/counter',
        name: 'Counter',
        component: () => import('pages/counter/IndexPage.vue'),
      },
      {
        path: 'service/qrcode',
        name: 'QRCode',
        component: () => import('pages/qrcode/IndexPage.vue'),
      },
      {
        path: 'service/image-editor',
        name: 'ImageEditor',
        component: () => import('pages/image-editor/IndexPage.vue'),
      },
      {
        path: ':catchAll(.*)*',
        component: () => import('pages/404/IndexPage.vue'),
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
              title: service.name,
              keywords: service.keywords,
              desc: service.desc,
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
    component: () => import('pages/404/IndexPage.vue'),
  },
]

export default routes
