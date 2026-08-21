<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '../stores/configStore'
import { getWeather, normalizeWeatherStatus } from '../api/weatherApi.js'
import { getAirQuality, getLatestAirQuality, getAirQualityGrade } from '../api/airQualityApi.js'
import { getCityById } from '../api/cityData.js'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const cityData = ref(null)
const fetchError = ref(false)

const weatherIcon = computed(() => {
  if (!cityData.value) return 'mdi-weather-sunny'
  if (cityData.value.status.includes('비')) return 'mdi-weather-pouring'
  if (cityData.value.status.includes('눈')) return 'mdi-weather-snowy'
  if (cityData.value.status.includes('구름')) return 'mdi-weather-cloudy'
  if (cityData.value.status.includes('흐림')) return 'mdi-weather-partly-cloudy'
  return 'mdi-weather-sunny'
})

onMounted(async () => {
  const city = getCityById(route.params.cityId)

  if (!city) {
    return
  }

  try {
    const [weatherResponse, airResponse] = await Promise.all([
      getWeather(city.city),
      getAirQuality(city.lat, city.lon),
    ])
    const data = weatherResponse.data
    const airQuality = getLatestAirQuality(airResponse.data)
    cityData.value = {
      name: city.name,
      temp: data.main.temp,
      status: normalizeWeatherStatus(data.weather[0].description),
      humidity: `${data.main.humidity}%`,
      wind: `${data.wind.speed}m/s`,
      pm10: airQuality.pm10,
      pm25: airQuality.pm25,
      airQualityGrade: getAirQualityGrade(airQuality.pm25),
    }
  } catch {
    fetchError.value = true
  }
})
</script>

<template>
  <div class="detail-container">
    <header class="detail-heading">
      <div>
        <span class="detail-kicker">WEATHER REPORT / LIVE</span>
        <h3>지역별 상세 관측</h3>
      </div>
      <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="router.push('/')">
        대시보드
      </v-btn>
    </header>

    <section v-if="cityData" class="detail-content">
      <div class="detail-hero">
        <div>
          <span class="city-pin"><v-icon icon="mdi-map-marker" size="15" /> LOCAL STATION</span>
          <h1>{{ cityData.name }}</h1>
          <p>OpenWeatherMap · Open-Meteo 실시간 관측</p>
        </div>
        <div class="detail-weather-symbol">
          <v-icon :icon="weatherIcon" size="64" />
          <span>{{ cityData.status }}</span>
        </div>
        <div class="detail-temperature">
          <strong>{{ configStore.convertTemperature(cityData.temp) }}</strong>
          <span>{{ configStore.unitSymbol }}</span>
        </div>
      </div>

      <div class="detail-metrics">
        <div class="metric-card">
          <span><v-icon icon="mdi-water-percent" /> 습도</span>
          <strong>{{ cityData.humidity }}</strong>
        </div>
        <div class="metric-card">
          <span><v-icon icon="mdi-weather-windy" /> 풍속</span>
          <strong>{{ cityData.wind }}</strong>
        </div>
        <div class="metric-card">
          <span><v-icon icon="mdi-weather-hazy" /> PM10</span>
          <strong>{{ cityData.pm10 ?? '-' }} <small v-if="cityData.pm10 !== null">μg/m³</small></strong>
        </div>
        <div class="metric-card">
          <span><v-icon icon="mdi-lungs" /> PM2.5</span>
          <strong>{{ cityData.pm25 ?? '-' }} <small v-if="cityData.pm25 !== null">μg/m³</small></strong>
        </div>
      </div>

      <div class="air-quality-summary">
        <div>
          <span class="detail-kicker">AIR QUALITY INDEX</span>
          <strong>현재 공기 상태</strong>
        </div>
        <span class="quality-grade">{{ cityData.airQualityGrade }}</span>
      </div>
    </section>
    <section v-else-if="fetchError" class="detail-empty">
      <v-icon icon="mdi-cloud-alert-outline" size="42" />
      <strong>날씨 정보를 불러오지 못했습니다.</strong>
      <p>잠시 후 다시 시도해 주세요.</p>
    </section>
    <section v-else class="detail-empty">
      <v-progress-circular indeterminate color="primary" />
      <p>실시간 관측 정보를 불러오는 중입니다.</p>
    </section>
  </div>
</template>

<style scoped>
.detail-container {
  margin: 0 auto;
  background: var(--panel);
  padding: clamp(20px, 3vw, 34px);
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.detail-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--line);
}
.detail-kicker,
.city-pin {
  color: var(--muted);
  font-size: 9px;
  letter-spacing: 1.5px;
  font-weight: 800;
}
.detail-heading h3 { margin: 5px 0 0; color: var(--text-strong); font-size: 22px; }
.detail-hero {
  min-height: 220px;
  margin-top: 24px;
  padding: 28px;
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 28px;
  color: #f4f7e9;
  background: var(--deep);
  border-radius: 14px;
}
.city-pin { display: flex; align-items: center; gap: 4px; color: var(--lime); }
.detail-hero h1 { margin: 12px 0 6px; color: #fff; font-size: clamp(30px, 4vw, 48px); letter-spacing: -1.5px; }
.detail-hero p { margin: 0; color: rgba(244, 247, 233, 0.6); font-size: 11px; }
.detail-weather-symbol { display: grid; justify-items: center; gap: 6px; color: var(--lime); }
.detail-weather-symbol span { color: #fff; font-size: 12px; }
.detail-temperature { display: flex; align-items: flex-start; color: #fff; }
.detail-temperature strong { font-size: 64px; line-height: 0.9; letter-spacing: -3px; }
.detail-temperature span { margin: 3px 0 0 4px; font-size: 19px; font-weight: 800; }
.detail-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 16px; }
.metric-card { padding: 16px; background: var(--surface-soft); border: 1px solid var(--line); border-radius: 11px; }
.metric-card span { display: flex; align-items: center; gap: 6px; color: var(--muted); font-size: 11px; }
.metric-card span .v-icon { font-size: 16px; }
.metric-card strong { display: block; margin-top: 12px; color: var(--text-strong); font-size: 19px; }
.metric-card small { color: var(--muted); font-size: 9px; font-weight: 600; }
.air-quality-summary { margin-top: 16px; padding: 17px 19px; display: flex; align-items: center; justify-content: space-between; background: var(--surface-muted); border-radius: 11px; }
.air-quality-summary strong { display: block; margin-top: 5px; color: var(--text-strong); font-size: 14px; }
.quality-grade { padding: 8px 13px; color: var(--deep); background: var(--lime); border-radius: 20px; font-size: 12px; font-weight: 800; }
.detail-empty { min-height: 280px; display: grid; place-content: center; justify-items: center; gap: 10px; color: var(--muted); text-align: center; }
.detail-empty strong { color: var(--text-strong); }
.detail-empty p { margin: 0; color: var(--muted); }

@media (max-width: 700px) {
  .detail-heading :deep(.v-btn) { padding: 0 6px; }
  .detail-hero { grid-template-columns: 1fr auto; gap: 16px; padding: 22px; }
  .detail-temperature { grid-column: 1 / -1; }
  .detail-temperature strong { font-size: 52px; }
  .detail-metrics { grid-template-columns: repeat(2, 1fr); }
}
</style>