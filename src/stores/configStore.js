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
  }
})