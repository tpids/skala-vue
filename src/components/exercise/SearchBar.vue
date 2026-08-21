<script setup>
const props = defineProps({
  searchQuery: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update-query', 'toggle-map'])

const handleInput = (event) => {
  emit('update-query', event.target.value)
}

const clearQuery = () => {
  emit('update-query', '')
}

const openMap = () => {
  emit('toggle-map')
}
</script>

<template>
  <section class="search-box">
    <header class="search-header">
      <div>
        <span class="search-kicker">DISCOVER A CITY</span>
        <h3>도시 검색</h3>
      </div>
      <v-btn
        icon
        size="small"
        variant="tonal"
        aria-label="지도 열기/닫기"
        title="지도 열기/닫기"
        @click="openMap"
      >
        <v-icon icon="mdi-map-search-outline" size="21" />
      </v-btn>
    </header>

    <div class="search-control">
      <v-icon icon="mdi-magnify" size="22" />
      <input
        type="search"
        :value="searchQuery"
        @input="handleInput"
        placeholder="도시 이름을 입력하세요"
        aria-label="도시 이름 검색"
      />
      <v-btn
        v-if="props.searchQuery"
        icon
        size="small"
        variant="text"
        aria-label="검색어 지우기"
        @click="clearQuery"
      >
        <v-icon icon="mdi-close-circle" size="18" />
      </v-btn>
    </div>

    <div class="search-meta">
      <span>SEARCHING</span>
      <strong>{{ searchQuery || '전체 도시' }}</strong>
    </div>
  </section>
</template>

<style scoped>
.search-box {
  padding: 5px;
}

.search-header,
.search-meta,
.search-control {
  display: flex;
  align-items: center;
}

.search-header {
  justify-content: space-between;
  margin-bottom: 14px;
}

.search-header > .v-icon { color: var(--navy); }
.search-kicker { display: block; color: var(--muted); font-size: 9px; letter-spacing: 1.5px; font-weight: 800; }
h3 { margin: 4px 0 0; color: var(--text-strong); font-size: 18px; }

.search-control {
  min-height: 52px;
  gap: 9px;
  padding: 0 10px 0 14px;
  color: var(--muted);
  background: var(--surface-soft);
  border: 1px solid var(--line);
  border-radius: 12px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-control:focus-within {
  border-color: var(--navy);
  box-shadow: 0 0 0 3px rgba(42, 85, 84, 0.12);
}

.search-control input {
  min-width: 0;
  flex: 1;
  width: 100%;
  padding: 0;
  color: var(--text-strong);
  background: transparent;
  border: 0;
  outline: 0;
  font: inherit;
  font-size: 13px;
}

.search-control input::placeholder { color: var(--muted); }
.search-control input::-webkit-search-cancel-button { display: none; }
.search-control :deep(.v-btn) { color: var(--muted); }

.search-meta {
  gap: 8px;
  padding: 10px 3px 0;
  color: var(--muted);
  font-size: 10px;
}

.search-meta span { letter-spacing: 1.2px; font-weight: 800; }
.search-meta strong { color: var(--text-body); font-size: 12px; }
</style>