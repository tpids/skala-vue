<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useConfigStore } from './stores/configStore'

const route = useRoute()
const configStore = useConfigStore()
const isDashboard = computed(() => route.name === 'WeatherHome')

const toggleTheme = () => {
  configStore.toggleDarkMode()
}
</script>
<template>
  <div class="final-app" :class="{ 'dark-mode': configStore.isDarkMode }">
    <header class="app-header">
      <div class="header-inner">
        <RouterLink to="/" class="brand" aria-label="Weatherly 홈">
          <span class="brand-mark">W</span>
          <span>
            <strong>Weatherly</strong>
            <small>LOCAL WEATHER DESK</small>
          </span>
        </RouterLink>

        <div class="header-actions">
          <span class="live-status"><i></i> LIVE DATA</span>
          <v-btn
            class="theme-button unit-button"
            icon
            variant="outlined"
            :aria-label="configStore.isCelsius ? '화씨로 전환' : '섭씨로 전환'"
            :title="configStore.isCelsius ? '화씨로 전환' : '섭씨로 전환'"
            @click="configStore.toggleUnit"
          >
            {{ configStore.isCelsius ? '°C' : '°F' }}
          </v-btn>
          <v-btn
            class="theme-button"
            icon
            variant="outlined"
            :aria-label="configStore.isDarkMode ? '라이트 모드' : '다크 모드'"
            :title="configStore.isDarkMode ? '라이트 모드' : '다크 모드'"
            @click="toggleTheme"
          >
            <v-icon :icon="configStore.isDarkMode ? 'mdi-weather-sunny' : 'mdi-weather-night'" />
          </v-btn>
        </div>
      </div>
    </header>

    <div class="page-frame">
      <aside class="sidebar">
        <div class="sidebar-label">MONITORING</div>
        <nav class="main-nav" aria-label="주요 메뉴">
          <RouterLink to="/" class="nav-item">
            <v-icon class="nav-icon" icon="mdi-view-dashboard-outline" />
            <span>대시보드</span>
            <span class="nav-arrow">↗</span>
          </RouterLink>
          <RouterLink to="/favorites" class="nav-item">
            <v-icon class="nav-icon" icon="mdi-star-outline" />
            <span>관심 지역</span>
          </RouterLink>
          <RouterLink to="/map" class="nav-item">
            <v-icon class="nav-icon" icon="mdi-map-outline" />
            <span>도시 지도</span>
          </RouterLink>
          <RouterLink to="/report" class="nav-item">
            <v-icon class="nav-icon" icon="mdi-chart-donut" />
            <span>환경 리포트</span>
          </RouterLink>
          <RouterLink to="/practice" class="nav-item">
            <v-icon class="nav-icon" icon="mdi-flask-outline" />
            <span>실습 보기</span>
          </RouterLink>
          <RouterLink to="/about" class="nav-item">
            <v-icon class="nav-icon" icon="mdi-information-outline" />
            <span>서비스 안내</span>
          </RouterLink>
        </nav>

        <div class="sidebar-bottom">
          <p class="sidebar-note">OpenWeather와<br />Open-Meteo 데이터 기반</p>
        </div>
      </aside>

      <main class="content-area">
        <div class="content-kicker">FIELD REPORT / 2026</div>
        <section v-if="isDashboard" class="dashboard-hero">
          <img
            class="hero-image"
            src="/sky.svg"
            alt="푸른 하늘과 구름"
          />
        </section>
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style>
@import '@/assets/final.css';
</style>