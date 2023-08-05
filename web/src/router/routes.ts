import { RouteRecordRaw } from 'vue-router'
import serviceSchema from '@/core/service/schema'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/home/IndexPage.vue') },
    ],
  },

  {
    path: '/:lang/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/home/IndexPage.vue') },
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
