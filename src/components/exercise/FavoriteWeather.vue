<script setup>
import { useConfigStore } from '../../stores/configStore'

const configStore = useConfigStore()

defineProps({
  weather: {
    type: Object,
    default: null,
  },
})
</script>

<template>
  <section class="favorite-box">
    <h3>⭐ 즐겨찾기 도시</h3>

    <div v-if="weather">
      <p>
        즐겨찾기:
        <strong>{{ weather.name }}</strong>
      </p>

      <p>
        현재 기온:
        <strong>{{configStore.unit === 'celsius' ? weather.temp : (weather.temp * 9 / 5 + 32).toFixed(1)}}{{ configStore.unitSymbol }}</strong>
      </p>

      <p>
        날씨:
        <strong>{{ weather.status }}</strong>
      </p>

      <p>
        미세먼지:
        <strong>{{ weather.airQualityGrade || '측정 정보 없음' }}</strong>
        <span v-if="weather.pm25 !== null && weather.pm25 !== undefined">
          ({{ weather.pm25 }} μg/m³)
        </span>
      </p>
    </div>

    <p v-else>
      아직 즐겨찾기한 도시가 없습니다.
    </p>
  </section>
</template>

<style scoped>
.favorite-box {
  padding: 5px;
  margin-top: 5px;
  border-radius: 3px;
}
</style>