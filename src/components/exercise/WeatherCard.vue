<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

const weatherIcon = computed(() => {
  if (props.weather.status.includes('비')) return 'mdi-weather-pouring'
  if (props.weather.status.includes('눈')) return 'mdi-weather-snowy'
  if (props.weather.status.includes('구름')) return 'mdi-weather-cloudy'
  if (props.weather.status.includes('흐림')) return 'mdi-weather-partly-cloudy'
  return 'mdi-weather-sunny'
})

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
  <article
    class="weather-card"
    @click="selectCard"
  >
    <header class="weather-card-header">
      <div>
        <span class="city-label">LOCAL STATION</span>
        <h4>{{ weather.name }}</h4>
      </div>
      <button
        class="btn-favorite"
        :class="{ active: isFavorite }"
        :title="isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'"
        @click.stop="setFavorite"
      >
        {{ isFavorite ? '⭐' : '☆' }}
      </button>
    </header>

    <div class="weather-card-main">
      <div class="weather-icon-wrap">
        <v-icon :icon="weatherIcon" size="42" />
      </div>
      <div class="temperature-block">
        <strong>{{ configStore.convertTemperature(weather.temp) }}</strong>
        <span>{{ configStore.unitSymbol }}</span>
      </div>
      <div class="status-block">
        <strong>{{ weather.status }}</strong>
        <span>{{ weather.temp >= 25 ? '따뜻한 하루' : '선선한 하루' }}</span>
      </div>
    </div>

    <div class="air-quality-panel">
      <span><v-icon icon="mdi-weather-hazy" size="16" /> PM2.5</span>
      <strong>{{ weather.airQualityGrade || '측정 정보 없음' }}</strong>
      <small v-if="weather.pm25 !== null && weather.pm25 !== undefined">{{ weather.pm25 }} μg/m³</small>
    </div>

    <footer class="weather-card-footer">
      <span class="updated-label">LIVE OBSERVATION</span>
      <v-btn
        class="btn-detail"
        size="small"
        variant="tonal"
        prepend-icon="mdi-arrow-top-right"
        @click.stop="clickDetail"
      >
        상세보기
      </v-btn>
    </footer>
  </article>
</template>

<style scoped>
.weather-card {
  min-height: 0;
  aspect-ratio: 1 / 1;
  padding: 16px;
  margin: 10px 0;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.weather-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 30px rgba(27, 47, 42, 0.12);
}

.weather-card-header,
.weather-card-main,
.weather-card-footer {
  display: flex;
  align-items: center;
}

.weather-card-header {
  justify-content: space-between;
}

.city-label,
.updated-label {
  display: block;
  color: var(--muted);
  font-size: 9px;
  letter-spacing: 1.4px;
  font-weight: 800;
}

h4 {
  margin: 4px 0 0;
  color: var(--text-strong);
  font-size: 21px;
}

.btn-favorite {
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 50%;
  color: var(--text-strong);
  background: var(--surface-soft);
  font-size: 19px;
  line-height: 1;
  border: none;
  cursor: pointer;
}

.btn-favorite.active {
  transform: scale(1.1);
  background: var(--lime);
}

.weather-card-main {
  gap: 14px;
  padding: 18px 0 14px;
}

.weather-icon-wrap {
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  color: var(--navy);
  background: var(--lime);
  border-radius: 18px;
}

.temperature-block {
  display: flex;
  align-items: flex-start;
  color: var(--text-strong);
}

.temperature-block strong {
  font-size: 36px;
  line-height: 0.95;
  letter-spacing: -2px;
}

.temperature-block span {
  margin: 2px 0 0 3px;
  font-size: 16px;
  font-weight: 800;
}

.status-block {
  display: grid;
  gap: 3px;
  margin-left: auto;
  text-align: right;
}

.status-block strong { color: var(--text-strong); font-size: 14px; }
.status-block span { color: var(--muted); font-size: 11px; }

.air-quality-panel {
  min-height: 43px;
  padding: 8px 11px;
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--text-body);
  background: var(--surface-soft);
  border: 1px solid var(--line);
  border-radius: 9px;
  font-size: 11px;
}

.air-quality-panel span { display: inline-flex; align-items: center; gap: 4px; }
.air-quality-panel strong { margin-left: auto; color: var(--text-strong); }
.air-quality-panel small { color: var(--muted); }

.weather-card-footer {
  margin-top: auto;
  justify-content: space-between;
  padding-top: 12px;
}

.btn-detail { margin-left: auto; }

@media (max-width: 480px) {
  .weather-card-main { gap: 10px; }
  .weather-card { padding: 14px; }
  .weather-icon-wrap { width: 48px; height: 48px; }
  .temperature-block strong { font-size: 32px; }
}
</style>