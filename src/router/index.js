import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'WeatherHome',
      component: () => import('../views/WeatherHomeView.vue'),
    },
    {
      path: '/weather/:cityId',
      name: 'WeatherDetail',
      component: () => import('../views/WeatherDetailView.vue'),
    },
    {
      path: '/about',
      name: 'WeatherAbout',
      component: () => import('../views/WeatherAboutView.vue'),
    },
    {
      path: '/favorites',
      name: 'WeatherFavorites',
      component: () => import('../views/WeatherFavoritesView.vue'),
    },
    {
      path: '/map',
      name: 'WeatherMap',
      component: () => import('../views/WeatherMapView.vue'),
    },
    {
      path: '/report',
      name: 'WeatherReport',
      component: () => import('../views/WeatherReportView.vue'),
    },
    {
      path: '/practice',
      name: 'PracticeApp',
      component: () => import('../App.exercise.vue'),
    },
    {
      // catch-all: 정의되지 않은 모든 경로를 404 화면으로 연결
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router