<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../../stores/configStore'

const configStore = useConfigStore()

const props = defineProps({
  weather: {
    type: Object,
    default: null,
  },
})

const weatherIcon = computed(() => {
  if (!props.weather) return 'mdi-weather-sunny'
  if (props.weather.status.includes('비')) return 'mdi-weather-pouring'
  if (props.weather.status.includes('눈')) return 'mdi-weather-snowy'
  if (props.weather.status.includes('구름')) return 'mdi-weather-cloudy'
  if (props.weather.status.includes('흐림')) return 'mdi-weather-partly-cloudy'
  return 'mdi-weather-sunny'
})
</script>

<template>
  <section class="favorite-box">
    <header class="favorite-header">
      <div>
        <span class="favorite-kicker">SAVED LOCATION</span>
        <h3>즐겨찾기 도시</h3>
      </div>
      <v-icon icon="mdi-star" class="favorite-header-icon" />
    </header>

    <div v-if="weather" class="favorite-content">
      <div class="favorite-place">
        <div class="favorite-weather-icon">
          <v-icon :icon="weatherIcon" size="30" />
        </div>
        <div>
          <strong>{{ weather.name }}</strong>
          <span>{{ weather.status }}</span>
        </div>
      </div>

      <strong class="favorite-temperature">{{ configStore.convertTemperature(weather.temp) }}<small>{{ configStore.unitSymbol }}</small></strong>

      <div class="favorite-air">
        <span><v-icon icon="mdi-weather-hazy" size="15" /> PM2.5</span>
        <strong>{{ weather.airQualityGrade || '측정 정보 없음' }}</strong>
        <span v-if="weather.pm25 !== null && weather.pm25 !== undefined">
          {{ weather.pm25 }} μg/m³
        </span>
      </div>
    </div>

    <div v-else class="favorite-empty">
      <v-icon icon="mdi-star-outline" size="24" />
      아직 즐겨찾기한 도시가 없습니다.
    </div>
  </section>
</template>

<style scoped>
.favorite-box {
  margin-top: 16px;
  padding: 18px 20px;
  color: var(--text-body);
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 16px;
}

.favorite-header,
.favorite-content,
.favorite-place,
.favorite-air {
  display: flex;
  align-items: center;
}

.favorite-header {
  justify-content: space-between;
  padding-bottom: 13px;
  border-bottom: 1px solid var(--line);
}

.favorite-kicker {
  display: block;
  color: var(--muted);
  font-size: 9px;
  letter-spacing: 1.4px;
  font-weight: 800;
}

h3 {
  margin: 4px 0 0;
  color: var(--text-strong);
  font-size: 16px;
}

.favorite-header-icon {
  color: var(--lime-dark, var(--lime));
}

.favorite-content {
  gap: 18px;
  padding-top: 16px;
}

.favorite-place {
  gap: 10px;
  min-width: 150px;
}

.favorite-place strong,
.favorite-place span {
  display: block;
}

.favorite-place strong {
  color: var(--text-strong);
  font-size: 17px;
}

.favorite-place span {
  margin-top: 2px;
  color: var(--muted);
  font-size: 11px;
}

.favorite-weather-icon {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  color: var(--navy);
  background: var(--lime);
  border-radius: 13px;
}

.favorite-temperature {
  color: var(--text-strong);
  font-size: 30px;
  letter-spacing: -1px;
}

.favorite-temperature small {
  margin-left: 2px;
  font-size: 13px;
  letter-spacing: 0;
}

.favorite-air {
  min-height: 36px;
  gap: 7px;
  margin-left: auto;
  padding: 7px 10px;
  color: var(--text-body);
  background: var(--surface-soft);
  border: 1px solid var(--line);
  border-radius: 8px;
  font-size: 11px;
}

.favorite-air span:first-child {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.favorite-air strong { color: var(--text-strong); }
.favorite-air span:last-child { color: var(--muted); }

.favorite-empty {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 16px;
  color: var(--muted);
}

@media (max-width: 620px) {
  .favorite-content { align-items: flex-start; flex-wrap: wrap; gap: 12px; }
  .favorite-air { width: 100%; margin-left: 0; }
}
</style>