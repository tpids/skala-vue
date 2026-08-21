<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div
    style="
      text-align: center;
      margin-left: auto;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    "
  >
    <div class="unit-switch" role="group" aria-label="온도 단위 선택">
      <button
        type="button"
        :class="{ active: configStore.unit === 'celsius' }"
        :aria-pressed="configStore.unit === 'celsius'"
        @click="configStore.unit !== 'celsius' && configStore.toggleUnit()"
      >
        °C
      </button>
      <button
        type="button"
        :class="{ active: configStore.unit === 'fahrenheit' }"
        :aria-pressed="configStore.unit === 'fahrenheit'"
        @click="configStore.unit !== 'fahrenheit' && configStore.toggleUnit()"
      >
        °F
      </button>
    </div>

    <!-- 다크모드 -->
    <v-btn
      size="small"
      variant="text"
      @click="configStore.toggleDarkMode"
      class="toggle-btn"
    >
      <v-icon :icon="configStore.isDarkMode ? 'mdi-weather-sunny' : 'mdi-weather-night'" />
      {{ configStore.isDarkMode ? '라이트모드' : '다크모드' }}
    </v-btn>
  </div>
</template>

<style scoped>
.toggle-btn {
  padding: 6px 10px;
  background-color: #4b6584;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.unit-switch {
  display: inline-flex;
  padding: 3px;
  gap: 2px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
}

.unit-switch button {
  min-width: 31px;
  padding: 4px 6px;
  color: var(--muted);
  background: transparent;
  border: 0;
  border-radius: 5px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 800;
}

.unit-switch button.active {
  color: var(--deep);
  background: var(--lime);
}

.toggle-btn:hover {
  opacity: 0.85;
}
</style>