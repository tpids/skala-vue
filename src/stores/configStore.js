import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  // state
  const unit = ref('celsius')

  // getter
  const unitSymbol = computed(() => {
    return unit.value === 'celsius' ? '℃' : '℉'
  })

  // 추가 state
  const decimalPlaces = ref(1)

  // 추가 getter
  const isCelsius = computed(() => {
    return unit.value === 'celsius'
  })

  // 다크모드 상태
  const isDarkMode = ref(false)

  // 다크모드 상태 확인
  const themeSymbol = computed(() => {
    return isDarkMode.value ? '🌙' : '☀️'
  })

  function toggleDarkMode() {
    // 다크모드 토글
    isDarkMode.value = !isDarkMode.value
  }

  // action
  function toggleUnit() {
    unit.value =
      unit.value === 'celsius'
        ? 'fahrenheit'
        : 'celsius'
  }

  // 추가 action
  function convertTemperature(celsius) {
    if (unit.value === 'celsius') {
      return celsius
    }

    return (celsius * 9 / 5 + 32).toFixed(decimalPlaces.value)
  }

  return {
    unit,
    unitSymbol,
    decimalPlaces,
    isCelsius,
    toggleUnit,
    convertTemperature,
    isDarkMode,
    themeSymbol,
    toggleDarkMode,
  }
})