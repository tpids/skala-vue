<script setup>
import { ref, computed } from 'vue'

// API 연동을 대비한 가상의 백엔드 데이터 배열
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  // 나만의 데이터 커스텀 지역 추가
  { id: 'city_04', name: '광주', temp: 30, status: '맑음' },
  { id: 'city_05', name: '제주', temp: 22, status: '비' },
])

// 검색어 및 선택된 도시 정보
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 검색어에 따라 도시 목록 필터링
const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()

  // 검색어가 없으면 전체 도시 출력
  if (!keyword) {
    return weatherList.value
  }

  // 도시 이름에 검색어가 포함된 도시만 출력
  return weatherList.value.filter((item) =>
    item.name.includes(keyword),
  )
})

// 상세보기
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <!-- 도시 검색 -->
    <section class="search-box">
      <h3>🔍 도시 검색</h3>

      <input type="text" :value="searchQuery" @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 도시 이름 입력" />

      <p>
        검색 중인 도시:
        <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <!-- 날씨 현황 -->
    <section class="list-box">
      <h3>🏙️ 지역별 날씨 현황</h3>

      <div v-for="item in filteredWeatherList" :key="item.id" class="weather-card"
        @click="selectedCityInfo = `${item.name}이 선택되었습니다.`">
        <h4>{{ item.name }} ({{ item.status }})</h4>

        <p>현재 기온: {{ item.temp }}°C</p>

        <!-- 조건부 렌더링 -->
        <span v-if="item.temp >= 25" class="badge hot">
          🔥 더움 (25도 이상)
        </span>

        <span v-else class="badge cool">
          ❄️ 선선함 (25도 미만)
        </span>

        <!-- 이벤트 버블링 방지 -->
        <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
          상세보기
        </button>
      </div>

      <!-- 검색 결과가 없는 경우 -->
      <p v-if="filteredWeatherList.length === 0" class="no-result">
        🔍 "{{ searchQuery }}"에 해당하는 도시가 없습니다.
      </p>
    </section>

    <!-- 선택 상태 -->
    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>

    <!-- Customization -->
    <section class="custom-section">
      <h3>✨ 나만의 Weather Mockup</h3>

      <p>
        직접 추가한 지역:
        <strong>광주, 제주</strong>
      </p>

      <p>
        검색 기능 추가, 검색 결과 없을 때 안내 메시지 표시, 상세보기 버튼 클릭 시 알림창 표시
      </p>
    </section>
  </div>
</template>