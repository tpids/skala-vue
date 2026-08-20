<script setup>
defineProps({
  searchQuery: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update-query'])

const handleInput = (event) => {
  emit('update-query', event.target.value)
}
</script>

<template>
  <section class="search-box">
    <h3>🔍 도시 검색</h3>

    <input
      type="text"
      :value="searchQuery"
      @input="handleInput"
      placeholder="검색할 도시 이름 입력"
    />

    <p>
      검색 중인 도시:
      <strong>{{ searchQuery }}</strong>
    </p>
  </section>
</template>

<style scoped>
.search-box {
  padding: 10px;
}
</style>