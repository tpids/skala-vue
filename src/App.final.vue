<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import UnitToggler from './views/UnitToggler.vue'
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
          <RouterLink to="/about" class="nav-item">
            <v-icon class="nav-icon" icon="mdi-information-outline" />
            <span>서비스 안내</span>
          </RouterLink>
        </nav>

        <div class="sidebar-bottom">
          <div class="unit-panel">
            <span class="unit-label">표시 단위</span>
            <UnitToggler />
          </div>
          <p class="sidebar-note">OpenWeather와<br />Open-Meteo 데이터 기반</p>
        </div>
      </aside>

      <main class="content-area">
        <div class="content-kicker">FIELD REPORT / 2026</div>
        <section v-if="isDashboard" class="dashboard-hero">
          <div>
            <span class="hero-eyebrow">TODAY'S ATMOSPHERE</span>
            <h1>도시의 오늘을<br /><em>한눈에 읽다.</em></h1>
            <p>날씨와 공기 상태를 한 화면에서 확인하세요.<br />지금 이 순간, 다섯 도시의 하늘을 기록합니다.</p>
          </div>
          <div class="hero-orbit" aria-hidden="true">
            <span class="orbit-ring ring-one"></span>
            <span class="orbit-ring ring-two"></span>
            <span class="orbit-sun">☼</span>
            <span class="orbit-cloud">☁</span>
          </div>
          <div class="hero-metrics">
            <div><strong>05</strong><span>TRACKED CITIES</span></div>
            <div><strong>LIVE</strong><span>WEATHER FEED</span></div>
            <div><strong>PM</strong><span>AIR QUALITY</span></div>
          </div>
        </section>
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style>
@import '@/assets/final.css';
</style>