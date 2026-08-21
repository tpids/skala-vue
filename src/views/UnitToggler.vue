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

    <button
      @click="configStore.toggleUnit"
      class="toggle-btn"
    >
      단위변경
    </button>

    <!-- 다크모드 -->
    <button
      @click="configStore.toggleDarkMode"
      class="toggle-btn"
    >
      {{ configStore.themeSymbol }}
      {{ configStore.isDarkMode ? '라이트모드' : '다크모드' }}
    </button>
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