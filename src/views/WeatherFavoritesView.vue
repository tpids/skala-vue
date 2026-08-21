<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '../stores/configStore'

const router = useRouter()
const configStore = useConfigStore()

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '광주', temp: 30, status: '맑음' },
  { id: 'city_05', name: '제주', temp: 22, status: '비' },
])

// 검색어 및 선택된 도시
const favoriteCities = ref(
  JSON.parse(localStorage.getItem('favoriteCities') || '[]')
)

// 즐겨찾기 도시 감시
const favoriteList = computed(() => {
  return weatherList.value.filter(
    (item) => favoriteCities.value.includes(item.name)
  )
})

const goDetail = (id) => {
  router.push(`/weather/${id}`)
}
</script>

<template>
  <div class="favorites-container">
    <h3>⭐ 관심 지역 즐겨찾기</h3>
    <hr />

    <ul v-if="favoriteList.length > 0" class="favorite-list">
      <li v-for="item in favoriteList" :key="item.id" class="favorite-item" @click="goDetail(item.id)">
        <span>{{ item.name }}</span>
        <span>{{configStore.convertTemperature(item.temp) }}{{ configStore.unitSymbol }} · {{ item.status }}</span>
      </li>
    </ul>
    <p v-else>즐겨찾기에 등록된 지역이 없습니다.</p>

    <button class="back-btn" @click="router.push('/')">← 메인 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.favorites-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.favorite-list {
  list-style: none;
  padding: 0;
  margin: 15px 0;
}
.favorite-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 12px;
  margin-bottom: 8px;
  background: #fff8e1;
  border-radius: 6px;
  cursor: pointer;
}
.favorite-item:hover {
  background: #ffecb3;
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
