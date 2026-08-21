<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getWeather, normalizeWeatherStatus } from '../api/weatherApi.js'

import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import FavoriteWeather from '../components/exercise/FavoriteWeather.vue'

const router = useRouter()
const route = useRoute()

// 날씨 데이터 api 호출
const weatherList = ref([])

const cities = [
  { id:'city_01', name:'서울', city:'Seoul' },
  { id:'city_02', name:'수원', city:'Suwon' },
  { id:'city_03', name:'부산', city:'Busan' },
  { id:'city_04', name:'광주', city:'Gwangju' },
  { id:'city_05', name:'제주', city:'Jeju' },
]


const fetchWeather = async () => {

  const result = []

  for (const city of cities) {

    try {

      const response = await getWeather(city.city)

      result.push({
        id: city.id,
        name: city.name,
        temp: Math.round(response.data.main.temp),
        status: normalizeWeatherStatus(response.data.weather[0].description),
        humidity: response.data.main.humidity,
        wind: response.data.wind.speed,
        icon: response.data.weather[0].icon
      })

    } catch(error) {
      console.log(`${city.name} API 오류`, error)
    }

  }

  weatherList.value = result
}

// 검색어 및 선택된 도시
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

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

// 즐겨찾기 도시
const favoriteWeather = computed(() => {
  return weatherList.value.filter(
    (item) => favoriteCities.value.includes(item.name)
  )
})

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

// 선택된 도시 감시
watch(selectedCityInfo, (newInfo) => {
  console.log(
    `[watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`
  )
})

// 검색어 감시
watchEffect(() => {
  console.log(
    `[watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`
  )
})

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

// 도시 선택
const selectCard = (city) => {
  selectedCityInfo.value = `${city.name}이 선택되었습니다.`
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
    selectedCityInfo.value = `${city.name}이 즐겨찾기에서 해제되었습니다.`
  } else {
    // 즐겨찾기 설정
    favoriteCities.value.push(city.name)
    localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities.value))
    selectedCityInfo.value = `${city.name}이 즐겨찾기로 설정되었습니다.`
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

      <p
        v-if="filteredWeatherList.length === 0"
        class="no-result"
        style="text-align: center; color: #e74c3c; padding: 10px 0"
      >
        😭 {{ searchQuery }} 검색 결과와 일치하는 도시가 없습니다.
      </p>
    </BaseDashboardCard>

    <!-- 상태바 -->
    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>

    <FavoriteWeather
    v-for="weather in favoriteWeather"
    :key="weather.id"
    :weather="weather"
    />

  </div>
</template>

<style scoped>
.status-bar {
  background: #e8f5e9;
  padding: 10px;
  text-align: center;
  color: #2e7d32;
  font-weight: bold;
  border-radius: 6px;
}
</style>