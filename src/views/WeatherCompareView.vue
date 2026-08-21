<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { getWeather, normalizeWeatherStatus } from '../api/weatherApi.js'
import { getAirQuality, getLatestAirQuality, getAirQualityGrade } from '../api/airQualityApi.js'
import { CITIES } from '../api/cityData.js'
import { useConfigStore } from '../stores/configStore'

const configStore = useConfigStore()
const firstCityId = ref(CITIES[0].id)
const secondCityId = ref(CITIES[1].id)
const cityData = ref({})
const isLoading = ref(false)
const hasError = ref(false)

const firstCity = computed(() => CITIES.find((city) => city.id === firstCityId.value) || CITIES[0])
const secondCity = computed(() => CITIES.find((city) => city.id === secondCityId.value) || CITIES[1])

const fetchCity = async (city) => {
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
    humidity: weather.main.humidity,
    wind: weather.wind.speed,
    pm10: air.pm10,
    pm25: air.pm25,
    grade: getAirQualityGrade(air.pm25),
  }
}

const fetchComparison = async () => {
  if (firstCityId.value === secondCityId.value) {
    secondCityId.value = CITIES.find((city) => city.id !== firstCityId.value)?.id || CITIES[1].id
    return
  }

  isLoading.value = true
  hasError.value = false
  try {
    const [first, second] = await Promise.all([fetchCity(firstCity.value), fetchCity(secondCity.value)])
    cityData.value = { [first.id]: first, [second.id]: second }
  } catch {
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

const firstData = computed(() => cityData.value[firstCityId.value])
const secondData = computed(() => cityData.value[secondCityId.value])

watch([firstCityId, secondCityId], fetchComparison)
onMounted(fetchComparison)
</script>

<template>
  <div class="compare-page">
    <header class="page-heading">
      <div>
        <span class="page-kicker">CITY COMPARE / LIVE DATA</span>
        <h1>도시 비교</h1>
        <p>두 도시의 날씨와 공기 상태를 한눈에 비교하세요.</p>
      </div>
      <v-icon icon="mdi-compare-horizontal" size="48" class="heading-icon" />
    </header>

    <section class="compare-controls">
      <div class="select-group">
        <label for="first-city">첫 번째 도시</label>
        <select id="first-city" v-model="firstCityId">
          <option v-for="city in CITIES" :key="city.id" :value="city.id">{{ city.name }}</option>
        </select>
      </div>
      <span class="versus">VS</span>
      <div class="select-group">
        <label for="second-city">두 번째 도시</label>
        <select id="second-city" v-model="secondCityId">
          <option v-for="city in CITIES" :key="city.id" :value="city.id">{{ city.name }}</option>
        </select>
      </div>
    </section>

    <div v-if="isLoading" class="compare-empty">
      <v-progress-circular indeterminate color="primary" />
      <p>두 도시의 최신 데이터를 비교하는 중입니다.</p>
    </div>
    <div v-else-if="hasError" class="compare-empty">
      <v-icon icon="mdi-cloud-alert-outline" size="42" />
      <strong>비교 데이터를 불러오지 못했습니다.</strong>
    </div>
    <section v-else-if="firstData && secondData" class="comparison-grid">
      <article v-for="item in [firstData, secondData]" :key="item.id" class="compare-card">
        <header>
          <span class="station-label">LIVE STATION</span>
          <h2>{{ item.name }}</h2>
          <strong class="compare-temp">{{ configStore.convertTemperature(item.temp) }}{{ configStore.unitSymbol }}</strong>
          <p>{{ item.status }}</p>
        </header>
        <div class="compare-metrics">
          <div><span><v-icon icon="mdi-water-percent" /> 습도</span><strong>{{ item.humidity }}%</strong></div>
          <div><span><v-icon icon="mdi-weather-windy" /> 풍속</span><strong>{{ item.wind }}m/s</strong></div>
          <div><span><v-icon icon="mdi-weather-hazy" /> PM10</span><strong>{{ item.pm10 ?? '-' }}</strong></div>
          <div><span><v-icon icon="mdi-lungs" /> PM2.5</span><strong>{{ item.pm25 ?? '-' }}</strong></div>
        </div>
        <footer><span>공기질</span><strong>{{ item.grade }}</strong></footer>
      </article>
    </section>
  </div>
</template>

<style scoped>
.compare-page { min-width: 0; }
.page-heading { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 24px; }
.page-kicker { color: var(--muted); font-size: 9px; letter-spacing: 1.5px; font-weight: 800; }
.page-heading h1 { margin: 7px 0 5px; color: var(--text-strong); font-size: clamp(30px, 4vw, 48px); letter-spacing: -1.5px; }
.page-heading p { margin: 0; color: var(--text-body); font-size: 13px; }
.heading-icon { color: var(--navy); }
.compare-controls { max-width: 680px; margin: 0 auto 18px; padding: 18px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: end; gap: 16px; background: var(--panel); border: 1px solid var(--line); border-radius: 14px; box-shadow: var(--shadow); }
.select-group { display: grid; gap: 7px; }
.select-group label { color: var(--muted); font-size: 10px; letter-spacing: 1px; font-weight: 800; }
.select-group select { width: 100%; padding: 11px 12px; color: var(--text-strong); background: var(--surface-soft); border: 1px solid var(--line); border-radius: 8px; font: inherit; cursor: pointer; }
.versus { padding-bottom: 10px; color: var(--muted); font-size: 11px; font-weight: 900; }
.comparison-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.compare-card { padding: 24px; color: var(--text-strong); background: var(--panel); border: 1px solid var(--line); border-radius: 16px; box-shadow: var(--shadow); }
.station-label { color: var(--muted); font-size: 9px; letter-spacing: 1.4px; font-weight: 800; }
.compare-card h2 { margin: 8px 0 12px; font-size: 26px; }
.compare-temp { font-size: 48px; letter-spacing: -2px; }
.compare-card header p { margin: 3px 0 22px; color: var(--muted); font-size: 13px; }
.compare-metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 9px; }
.compare-metrics div { padding: 12px; background: var(--surface-soft); border: 1px solid var(--line); border-radius: 9px; }
.compare-metrics span { display: flex; align-items: center; gap: 5px; color: var(--muted); font-size: 10px; }
.compare-metrics strong { display: block; margin-top: 8px; font-size: 16px; }
.compare-card footer { margin-top: 16px; padding-top: 14px; display: flex; justify-content: space-between; border-top: 1px solid var(--line); color: var(--muted); font-size: 12px; }
.compare-card footer strong { color: var(--text-strong); }
.compare-empty { min-height: 280px; display: grid; place-content: center; justify-items: center; gap: 9px; color: var(--muted); text-align: center; }
@media (max-width: 650px) { .page-heading { align-items: flex-start; } .heading-icon { display: none; } .compare-controls { grid-template-columns: 1fr; gap: 10px; } .versus { justify-self: center; padding: 0; } .comparison-grid { grid-template-columns: 1fr; } }
</style>
