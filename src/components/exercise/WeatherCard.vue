<script setup>
const props = defineProps({
  weather: {
    type: Object,
    required: true,
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
      현재 기온: {{ weather.temp }}°C
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

    <button
      class="btn-detail"
      @click.stop="clickDetail"
    >
      상세보기
    </button>

    <button
      class="btn-favorite"
      @click.stop="setFavorite"
    >
      ⭐ 즐겨찾기
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
</style>