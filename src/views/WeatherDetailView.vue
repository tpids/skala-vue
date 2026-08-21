<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '../stores/configStore'
import { getWeather, normalizeWeatherStatus } from '../api/weatherApi.js'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const cities = {
  city_01: { name: '서울', city: 'Seoul' },
  city_02: { name: '수원', city: 'Suwon' },
  city_03: { name: '부산', city: 'Busan' },
  city_04: { name: '광주', city: 'Gwangju' },
  city_05: { name: '제주', city: 'Jeju' },
}

const cityData = ref(null)
const fetchError = ref(false)

onMounted(async () => {
  const city = cities[route.params.cityId]

  if (!city) {
    return
  }

  try {
    const response = await getWeather(city.city)
    const data = response.data
    cityData.value = {
      name: city.name,
      temp: data.main.temp,
      status: normalizeWeatherStatus(data.weather[0].description),
      humidity: `${data.main.humidity}%`,
      wind: `${data.wind.speed}m/s`,
    }
  } catch (error) {
    fetchError.value = true
  }
})
</script>

<template>
  <div class="detail-container">
    <h3>📊 지역별 상세 기상 관측 정보</h3>
    <hr />

    <div v-if="cityData" class="info-card">
      <h4>📍 지정 지역: {{ cityData.name }}</h4>
      <p>
        실시간 기온: <strong> {{ configStore.convertTemperature(cityData.temp) }}{{ configStore.unitSymbol }}</strong>
      </p>
      <p>기상 현황: {{ cityData.status }}</p>
      <p>대기 습도: {{ cityData.humidity }}</p>
      <p>현재 풍속: {{ cityData.wind }}</p>
    </div>
    <div v-else-if="fetchError">
      <p>날씨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
    </div>
    <div v-else>
      <p>해당 지역의 상세 데이터 장부가 존재하지 않습니다.</p>
    </div>

    <button @click="router.push('/')" class="back-btn">← 메인 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.detail-container {
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.info-card {
  background: #f1f2f6;
  padding: 15px;
  border-radius: 6px;
  margin: 15px 0;
}
.back-btn {
  padding: 8px 12px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>