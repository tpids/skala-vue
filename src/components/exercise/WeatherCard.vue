<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

const props = defineProps({
  weather: {
    type: Object,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'select-card',
  'click-detail',
  'set-favorite',
])

const selectCard = () => {
  emit('select-card', props.weather)
}

const clickDetail = () => {
  emit('click-detail', props.weather)
}

const setFavorite = () => {
  emit('set-favorite', props.weather)
}
</script>

<template>
  <div
    class="weather-card"
    @click="selectCard"
  >
    <h4>
      {{ weather.name }} ({{ weather.status }})
    </h4>

    <p>
      현재 기온:
      {{configStore.convertTemperature(weather.temp) }}{{ configStore.unitSymbol }}
    </p>

    <span
      v-if="weather.temp >= 25"
      class="badge hot"
    >
      🔥 더움 (25도 이상)
    </span>

    <span
      v-else
      class="badge cool"
    >
      ❄️ 선선함 (25도 미만)
    </span>

    <p class="air-quality">
      미세먼지: {{ weather.airQualityGrade || '측정 정보 없음' }}
      <span v-if="weather.pm25 !== null && weather.pm25 !== undefined">
        ({{ weather.pm25 }} μg/m³)
      </span>
    </p>

    <button
      class="btn-detail"
      @click.stop="clickDetail"
    >
      상세보기
    </button>

    <button
      class="btn-favorite"
      :class="{ active: isFavorite }"
      :title="isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'"
      @click.stop="setFavorite"
    >
      {{ isFavorite ? '⭐' : '☆' }}
    </button>
  </div>
</template>

<style scoped>
.weather-card {
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
}

.badge {
  display: inline-block;
  margin: 5px 0;
}

.btn-detail,
.btn-favorite {
  margin-right: 5px;
}

.btn-favorite {
  font-size: 20px;
  border: none;
  background: transparent;
  cursor: pointer;
}

.btn-favorite.active {
  transform: scale(1.1);
}
</style>