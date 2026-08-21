<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getWeather, normalizeWeatherStatus } from '../api/weatherApi.js'
import { getAirQuality, getLatestAirQuality, getAirQualityGrade } from '../api/airQualityApi.js'
import { CITIES } from '../api/cityData.js'

import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'

const router = useRouter()
const route = useRoute()

// 날씨 데이터 api 호출
const weatherList = ref([])

const fetchWeather = async () => {
  const result = await Promise.all(CITIES.map(async (city) => {
    try {
      const [weatherResponse, airResponse] = await Promise.all([
        getWeather(city.city),
        getAirQuality(city.lat, city.lon),
      ])
      const airQuality = getLatestAirQuality(airResponse.data)

      return {
        id: city.id,
        name: city.name,
        temp: Math.round(weatherResponse.data.main.temp),
        status: normalizeWeatherStatus(weatherResponse.data.weather[0].description),
        humidity: weatherResponse.data.main.humidity,
        wind: weatherResponse.data.wind.speed,
        icon: weatherResponse.data.weather[0].icon,
        pm10: airQuality.pm10,
        pm25: airQuality.pm25,
        airQualityGrade: getAirQualityGrade(airQuality.pm25),
      }
    } catch(error) {
      console.log(`${city.name} API 오류`, error)
      return null
    }
  }))

  weatherList.value = result.filter(Boolean)
}

// 검색어 및 선택 상태
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const showToast = ref(false)

const notify = (message) => {
  selectedCityInfo.value = message
  showToast.value = false
  requestAnimationFrame(() => {
    showToast.value = true
  })
}

// 검색 결과
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  if (!query) {
    return weatherList.value
  }

  return weatherList.value.filter((item) =>
    item.name.includes(query)
  )
})

// 즐겨찾기
const favoriteCities = ref(
  JSON.parse(localStorage.getItem('favoriteCities') || '["서울"]')
)

// 초기 마운트 시 검색어 복원
onMounted(() => {
  if(route.query.search){
    searchQuery.value = route.query.search
  }
  fetchWeather()
})

// 검색어 변경 시 URL 쿼리 변경
watch(searchQuery, (newQuery) => {
  router.push({
    path: route.path,
    query: {
      search: newQuery || undefined,
    },
  })
})

// 검색어 감시
watchEffect(() => {
  console.log(
    `[watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`
  )
})

// 선택된 도시 상태 표시
const selectCard = (city) => {
  notify(`${city.name}이 선택되었습니다.`)
}

// 즐겨찾기 감시
watch(favoriteCities, (newCities) => {
  if (newCities.length > 0) {
    console.log(
      `[추가 watch] 즐겨찾기 도시가 ${newCities.join(', ')}(으)로 변경되었습니다.`
    )
  }
})

// 검색어 변경
const updateQuery = (query) => {
  searchQuery.value = query
}

// 상세보기 → Programmatic Navigation
const showDetail = (city) => {
  router.push(`/weather/${city.id}`)
}

// 즐겨찾기 설정
const setFavorite = (city) => {
  if (favoriteCities.value.includes(city.name)) {
    // 즐겨찾기 해제
    favoriteCities.value = favoriteCities.value.filter(name => name !== city.name)
    localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities.value))
    notify(`${city.name}이 즐겨찾기에서 해제되었습니다.`)
  } else {
    // 즐겨찾기 설정
    favoriteCities.value.push(city.name)
    localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities.value))
    notify(`${city.name}이 즐겨찾기로 설정되었습니다.`)
  }
}

</script>

<template>
  <div class="dashboard-wrapper">

    <!-- 검색 영역 -->
    <BaseDashboardCard>
      <SearchBar
        :search-query="searchQuery"
        @update-query="updateQuery"
      />
    </BaseDashboardCard>

    <!-- 날씨 목록 -->
    <BaseDashboardCard>
      <h3>🏙️ 지역별 날씨 현황</h3>

      <div class="weather-grid">
        <div
          v-for="item in filteredWeatherList"
          :key="item.id"
        >
          <WeatherCard
            :weather="item"
            :is-favorite="favoriteCities.includes(item.name)"
            @select-card="selectCard"
            @click-detail="showDetail"
            @set-favorite="setFavorite"
          />
        </div>
      </div>

      <p
        v-if="filteredWeatherList.length === 0"
        class="no-result"
        style="text-align: center; color: #e74c3c; padding: 10px 0"
      >
        😭 {{ searchQuery }} 검색 결과와 일치하는 도시가 없습니다.
      </p>
    </BaseDashboardCard>

    <v-snackbar
      v-model="showToast"
      location="bottom right"
      :timeout="2400"
      color="primary"
      variant="flat"
    >
      <v-icon icon="mdi-check-circle-outline" class="mr-2" />
      {{ selectedCityInfo }}
    </v-snackbar>

  </div>
</template>