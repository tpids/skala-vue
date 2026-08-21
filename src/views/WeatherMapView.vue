<script setup>
import { computed, ref } from 'vue'
import { CITIES } from '../api/cityData.js'

const selectedCityId = ref(CITIES[0].id)

const selectedCity = computed(() => {
  return CITIES.find((city) => city.id === selectedCityId.value) || CITIES[0]
})

const mapUrl = computed(() => {
  const { lat, lon } = selectedCity.value
  const delta = 0.12
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lon - delta}%2C${lat - delta}%2C${lon + delta}%2C${lat + delta}&layer=mapnik&marker=${lat}%2C${lon}`
})

const openExternalMap = () => {
  const { lat, lon } = selectedCity.value
  window.open(
    `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=12/${lat}/${lon}`,
    '_blank',
    'noopener,noreferrer'
  )
}
</script>

<template>
  <div class="map-page">
    <header class="page-heading">
      <div>
        <span class="page-kicker">LOCATION ATLAS / LIVE MAP</span>
        <h1>도시 지도</h1>
        <p>관심 있는 도시를 선택하고 현재 위치를 확인하세요.</p>
      </div>
      <v-icon icon="mdi-map-marker-radius-outline" size="48" class="heading-icon" />
    </header>

    <section class="map-layout">
      <aside class="city-picker">
        <span class="picker-label">SELECT A CITY</span>
        <h2>도시 선택</h2>
        <div class="city-list">
          <v-btn
            v-for="city in CITIES"
            :key="city.id"
            class="city-option"
            :class="{ selected: city.id === selectedCityId }"
            variant="text"
            block
            @click="selectedCityId = city.id"
          >
            <v-icon icon="mdi-map-marker-outline" size="18" />
            <span>{{ city.name }}</span>
            <v-icon
              v-if="city.id === selectedCityId"
              icon="mdi-arrow-right"
              size="17"
              class="option-arrow"
            />
          </v-btn>
        </div>
      </aside>

      <section class="map-card">
        <header class="map-card-header">
          <div>
            <span class="picker-label">CURRENT VIEW</span>
            <h2>{{ selectedCity.name }} 위치</h2>
          </div>
          <v-btn
            size="small"
            variant="tonal"
            prepend-icon="mdi-open-in-new"
            @click="openExternalMap"
          >
            크게 보기
          </v-btn>
        </header>
        <iframe
          class="city-map"
          :src="mapUrl"
          :title="`${selectedCity.name} 지도`"
          loading="lazy"
        ></iframe>
        <div class="map-caption">
          <v-icon icon="mdi-information-outline" size="16" />
          {{ selectedCity.name }} 관측소 주변 지도 · OpenStreetMap
        </div>
      </section>
    </section>
  </div>
</template>

<style scoped>
.map-page {
  min-width: 0;
}

.page-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-kicker,
.picker-label {
  color: var(--muted);
  font-size: 9px;
  letter-spacing: 1.5px;
  font-weight: 800;
}

.page-heading h1 {
  margin: 7px 0 5px;
  color: var(--text-strong);
  font-size: clamp(30px, 4vw, 48px);
  letter-spacing: -1.5px;
}

.page-heading p {
  margin: 0;
  color: var(--text-body);
  font-size: 13px;
}

.heading-icon {
  color: var(--navy);
  opacity: 0.8;
}

.map-layout {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 18px;
}

.city-picker,
.map-card {
  padding: 20px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: var(--shadow);
}

.city-picker h2,
.map-card h2 {
  margin: 5px 0 16px;
  color: var(--text-strong);
  font-size: 18px;
}

.city-list {
  display: grid;
  gap: 5px;
}

.city-option {
  justify-content: flex-start;
  min-height: 42px;
  padding: 0 10px;
  color: var(--text-body);
  border-radius: 9px;
  text-transform: none;
}

.city-option :deep(.v-btn__content) {
  width: 100%;
  justify-content: flex-start;
  gap: 8px;
}

.city-option.selected {
  color: var(--deep);
  background: var(--lime);
}

.option-arrow {
  margin-left: auto;
}

.map-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.map-card-header h2 { margin-bottom: 0; }

.city-map {
  width: 100%;
  height: clamp(360px, 55vh, 570px);
  display: block;
  border: 0;
  border-radius: 11px;
}

.map-caption {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
  color: var(--muted);
  font-size: 11px;
}

@media (max-width: 700px) {
  .page-heading { align-items: flex-start; }
  .heading-icon { display: none; }
  .map-layout { grid-template-columns: 1fr; }
  .city-list { grid-template-columns: repeat(2, 1fr); }
  .city-map { height: 330px; }
}
</style>
