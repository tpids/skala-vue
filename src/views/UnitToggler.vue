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
    <!-- 온도 단위 -->
    <span>
      날씨단위:
      <strong>
        {{ configStore.unit === 'celsius' ? '섭씨(℃)' : '화씨(℉)' }}
      </strong>
    </span>

    <v-btn
      size="small"
      variant="tonal"
      @click="configStore.toggleUnit"
      class="toggle-btn"
    >
      단위변경
    </v-btn>

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

.toggle-btn:hover {
  opacity: 0.85;
}
</style>