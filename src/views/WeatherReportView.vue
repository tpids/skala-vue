<script setup>
import { computed, onMounted, ref } from 'vue'
import { getWeather, normalizeWeatherStatus } from '../api/weatherApi.js'
import { getAirQuality, getLatestAirQuality, getAirQualityGrade } from '../api/airQualityApi.js'
import { CITIES } from '../api/cityData.js'
import { useConfigStore } from '../stores/configStore'

const configStore = useConfigStore()
const reportList = ref([])
const isLoading = ref(false)
const hasError = ref(false)
const updatedAt = ref('')

const fetchReport = async () => {
  isLoading.value = true
  hasError.value = false

  const results = await Promise.all(CITIES.map(async (city) => {
    try {
      const [weatherResponse, airResponse] = await Promise.all([
        getWeather(city.city),
        getAirQuality(city.lat, city.lon),
      ])
      const weather = weatherResponse.data
      const air = getLatestAirQuality(airResponse.data)

      return {
        id: city.id,
        name: city.name,
        temp: weather.main.temp,
        status: normalizeWeatherStatus(weather.weather[0].description),
        pm25: air.pm25,
        pm10: air.pm10,
        grade: getAirQualityGrade(air.pm25),
      }
    } catch (error) {
      hasError.value = true
      return null
    }
  }))

  reportList.value = results.filter(Boolean).sort((a, b) => (a.pm25 ?? 999) - (b.pm25 ?? 999))
  updatedAt.value = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  isLoading.value = false
}

const bestCity = computed(() => reportList.value[0])
const worstCity = computed(() => reportList.value[reportList.value.length - 1])
const averagePm25 = computed(() => {
  if (!reportList.value.length) return '-'
  const values = reportList.value.map((item) => item.pm25).filter((value) => value !== null)
  return values.length ? (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1) : '-'
})

onMounted(fetchReport)
</script>

<template>
  <div class="report-page">
    <header class="page-heading">
      <div>
        <span class="page-kicker">AIR & WEATHER / COMPARISON</span>
        <h1>환경 리포트</h1>
        <p>다섯 도시의 날씨와 공기 상태를 비교합니다.</p>
      </div>
      <v-btn
        variant="tonal"
        prepend-icon="mdi-refresh"
        :loading="isLoading"
        @click="fetchReport"
      >
        새로고침
      </v-btn>
    </header>

    <div v-if="isLoading" class="report-empty">
      <v-progress-circular indeterminate color="primary" />
      <p>환경 데이터를 모으는 중입니다.</p>
    </div>
    <div v-else-if="reportList.length" class="report-content">
      <section class="report-summary">
        <div class="summary-item best">
          <span>가장 맑은 도시</span>
          <strong>{{ bestCity.name }}</strong>
          <small>PM2.5 {{ bestCity.pm25 ?? '-' }} μg/m³</small>
        </div>
        <div class="summary-item average">
          <span>평균 PM2.5</span>
          <strong>{{ averagePm25 }}</strong>
          <small>μg/m³ · 다섯 도시 기준</small>
        </div>
        <div class="summary-item worst">
          <span>관심이 필요한 도시</span>
          <strong>{{ worstCity.name }}</strong>
          <small>PM2.5 {{ worstCity.pm25 ?? '-' }} μg/m³</small>
        </div>
      </section>

      <section class="ranking-panel">
        <header class="ranking-header">
          <div>
            <span class="page-kicker">CITY RANKING</span>
            <h2>공기질 순위</h2>
          </div>
          <span class="updated-at">업데이트 {{ updatedAt }}</span>
        </header>

        <div class="ranking-list">
          <article v-for="(item, index) in reportList" :key="item.id" class="ranking-row">
            <span class="rank-number">{{ String(index + 1).padStart(2, '0') }}</span>
            <div class="rank-city">
              <strong>{{ item.name }}</strong>
              <span>{{ item.status }} · {{ configStore.convertTemperature(item.temp) }}{{ configStore.unitSymbol }}</span>
            </div>
            <div class="rank-bar">
              <span :style="{ width: `${Math.min((item.pm25 || 0) * 1.5, 100)}%` }"></span>
            </div>
            <div class="rank-air">
              <strong>{{ item.pm25 ?? '-' }}</strong>
              <span>{{ item.grade }}</span>
            </div>
          </article>
        </div>
      </section>
    </div>
    <div v-else class="report-empty">
      <v-icon icon="mdi-cloud-alert-outline" size="42" />
      <strong>환경 데이터를 불러오지 못했습니다.</strong>
      <p v-if="hasError">잠시 후 새로고침해 주세요.</p>
    </div>
  </div>
</template>

<style scoped>
.report-page { min-width: 0; }
.page-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 24px; }
.page-kicker { color: var(--muted); font-size: 9px; letter-spacing: 1.5px; font-weight: 800; }
.page-heading h1 { margin: 7px 0 5px; color: var(--text-strong); font-size: clamp(30px, 4vw, 48px); letter-spacing: -1.5px; }
.page-heading p { margin: 0; color: var(--text-body); font-size: 13px; }
.report-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.summary-item { min-height: 140px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; color: var(--text-strong); background: var(--panel); border: 1px solid var(--line); border-radius: 14px; box-shadow: var(--shadow); }
.summary-item span { color: var(--muted); font-size: 11px; }
.summary-item strong { font-size: 28px; letter-spacing: -1px; }
.summary-item small { color: var(--text-body); font-size: 10px; }
.summary-item.best { border-top: 4px solid #76c68b; }
.summary-item.average { border-top: 4px solid var(--navy); }
.summary-item.worst { border-top: 4px solid #e29a7d; }
.ranking-panel { margin-top: 18px; padding: 22px; background: var(--panel); border: 1px solid var(--line); border-radius: 16px; box-shadow: var(--shadow); }
.ranking-header { display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 17px; border-bottom: 1px solid var(--line); }
.ranking-header h2 { margin: 5px 0 0; color: var(--text-strong); font-size: 20px; }
.updated-at { color: var(--muted); font-size: 10px; }
.ranking-list { display: grid; }
.ranking-row { min-height: 72px; display: grid; grid-template-columns: 42px 130px minmax(80px, 1fr) 92px; align-items: center; gap: 16px; border-bottom: 1px solid var(--line); }
.ranking-row:last-child { border-bottom: 0; }
.rank-number { color: var(--muted); font-size: 12px; font-weight: 800; }
.rank-city strong, .rank-city span, .rank-air strong, .rank-air span { display: block; }
.rank-city strong { color: var(--text-strong); font-size: 15px; }
.rank-city span { margin-top: 3px; color: var(--muted); font-size: 10px; }
.rank-bar { height: 6px; overflow: hidden; background: var(--surface-soft); border-radius: 10px; }
.rank-bar span { height: 100%; display: block; background: var(--lime-dark, var(--lime)); border-radius: inherit; }
.rank-air { text-align: right; }
.rank-air strong { color: var(--text-strong); font-size: 16px; }
.rank-air span { margin-top: 2px; color: var(--muted); font-size: 10px; }
.report-empty { min-height: 300px; display: grid; place-content: center; justify-items: center; gap: 9px; color: var(--muted); text-align: center; }
.report-empty p { margin: 0; }
@media (max-width: 700px) {
  .page-heading { align-items: flex-start; flex-direction: column; }
  .report-summary { grid-template-columns: 1fr; }
  .summary-item { min-height: 108px; }
  .ranking-panel { padding: 16px; }
  .ranking-row { grid-template-columns: 30px 1fr 78px; gap: 9px; }
  .rank-bar { display: none; }
}
</style>
