<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
import FavoriteWeather from './FavoriteWeather.vue'

// 날씨 데이터
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '광주', temp: 30, status: '맑음' },
  { id: 'city_05', name: '제주', temp: 22, status: '비' },
])

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

// 즐겨찾기
const favoriteCity = ref('')

const favoriteWeather = computed(() => {
  return weatherList.value.find(
    (item) => item.name === favoriteCity.value
  )
})

watch(favoriteCity, (newCity) => {
  if (newCity) {
    console.log(
      `[추가 watch] 즐겨찾기 도시가 ${newCity}(으)로 변경되었습니다.`
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

// 상세보기
const showDetail = (city) => {
  window.alert(
    `${city.name}의 현재 날씨는 [${city.status}] 상태입니다.`
  )
}

// 즐겨찾기 설정
const setFavorite = (city) => {
  favoriteCity.value = city.name
  selectedCityInfo.value = `${city.name}이 즐겨찾기로 설정되었습니다.`
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

    <!-- 즐겨찾기 -->
    <FavoriteWeather
      :weather="favoriteWeather"
    />

  </div>
</template>