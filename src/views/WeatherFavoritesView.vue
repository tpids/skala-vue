<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getWeather, normalizeWeatherStatus } from '../api/weatherApi.js'
import { getAirQuality, getLatestAirQuality, getAirQualityGrade } from '../api/airQualityApi.js'
import { getCityByName } from '../api/cityData.js'
import FavoriteWeather from '../components/exercise/FavoriteWeather.vue'

const router = useRouter()

const favoriteCities = ref(
  JSON.parse(localStorage.getItem('favoriteCities') || '[]')
)
const favoriteList = ref([])
const isLoading = ref(false)
const fetchError = ref(false)

const fetchFavoriteWeather = async () => {
  isLoading.value = true
  fetchError.value = false

  const results = await Promise.all(
    favoriteCities.value.map(async (name) => {
      const city = getCityByName(name)

      if (!city) {
        return null
      }

      try {
        const [weatherResponse, airResponse] = await Promise.all([
          getWeather(city.city),
          getAirQuality(city.lat, city.lon),
        ])
        const data = weatherResponse.data
        const airQuality = getLatestAirQuality(airResponse.data)

        return {
          id: city.id,
          name,
          temp: data.main.temp,
          status: normalizeWeatherStatus(data.weather[0].description),
          pm10: airQuality.pm10,
          pm25: airQuality.pm25,
          airQualityGrade: getAirQualityGrade(airQuality.pm25),
        }
      } catch {
        fetchError.value = true
        return null
      }
    })
  )

  favoriteList.value = results.filter(Boolean)
  isLoading.value = false
}

const goDetail = (id) => {
  router.push(`/weather/${id}`)
}

onMounted(fetchFavoriteWeather)
</script>

<template>
  <div class="favorites-container">
    <h3>⭐ 관심 지역 즐겨찾기</h3>
    <hr />

    <p v-if="isLoading">즐겨찾기 날씨 정보를 불러오는 중입니다.</p>
    <p v-else-if="fetchError">일부 날씨 정보를 불러오지 못했습니다.</p>
    <div v-else-if="favoriteList.length > 0" class="favorite-grid">
      <div
        v-for="item in favoriteList"
        :key="item.id"
        class="favorite-card-link"
        @click="goDetail(item.id)"
      >
        <FavoriteWeather :weather="item" />
      </div>
    </div>
    <p v-else>즐겨찾기에 등록된 지역이 없습니다.</p>

    <button class="back-btn" @click="router.push('/')">← 메인 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.favorites-container {
  background: var(--panel);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.favorite-grid {
  display: grid;
  gap: 12px;
  margin: 15px -5px;
}
.favorite-card-link {
  cursor: pointer;
  border-radius: 16px;
  transition: transform 0.2s ease;
}
.favorite-card-link:hover {
  transform: translateY(-2px);
}
.back-btn {
  padding: 8px 12px;
  background: var(--deep);
  color: var(--panel);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
