<script setup>
defineProps({
  weather: {
    type: Object,
    default: null,
  },
})
</script>

<template>
  <section class="favorite-box">
    <h3>⭐ 즐겨찾기 도시</h3>

    <div v-if="weather">
      <p>
        즐겨찾기:
        <strong>{{ weather.name }}</strong>
      </p>

      <p>
        현재 기온:
        <strong>{{ weather.temp }}°C</strong>
      </p>

      <p>
        날씨:
        <strong>{{ weather.status }}</strong>
      </p>
    </div>

    <p v-else>
      아직 즐겨찾기한 도시가 없습니다.
    </p>
  </section>
</template>

<style scoped>
.favorite-box {
  padding: 5px;
  margin-top: 5px;
  border-radius: 3px;
}
</style>