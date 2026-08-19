# Weather Mockup - Hands on

기본으로 제공된 Weather Mockup 코드에 개인적으로 기능과 데이터를 추가하여 확장했습니다.

## 1. 도시 데이터 추가

기본 데이터인 서울, 수원, 부산 외에 직접 도시 데이터를 추가했습니다.

- 광주
- 제주

```javascript
{ id: 'city_04', name: '광주', temp: 30, status: '맑음' },
{ id: 'city_05', name: '제주', temp: 22, status: '비' },
```

기존 `weatherList` 데이터 구조를 그대로 활용하여 별도의 화면 코드를 추가하지 않고도 새로운 도시가 자동으로 카드에 렌더링되도록 구성했습니다.

---

## 2. 실제 도시 검색 및 카드 필터링 기능 추가

기본 코드에서는 검색창에 입력한 도시명을 단순히 화면에 출력하는 형태였지만, 이를 실제 검색 기능으로 확장했습니다.

`computed()`와 JavaScript의 `filter()`를 활용하여 입력한 검색어가 포함된 도시만 화면에 표시하도록 구현했습니다.

```javascript
const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()

  if (!keyword) {
    return weatherList.value
  }

  return weatherList.value.filter((item) =>
    item.name.includes(keyword),
  )
})
```

검색 결과에 따라 날씨 카드 목록 자체가 변경되도록 구현했습니다.

예를 들어 `광`을 검색하면 광주 카드만 화면에 표시되도록 구현했습니다.

---

## 3. 검색 결과 없음 처리

존재하지 않는 도시를 검색했을 때 사용자에게 검색 결과가 없다는 것을 알려주는 기능을 추가했습니다.

```vue
<p v-if="filteredWeatherList.length === 0" class="no-result">
  🔍 "{{ searchQuery }}"에 해당하는 도시가 없습니다.
</p>
```

검색 결과가 존재하지 않는 경우 `filteredWeatherList.length === 0` 조건을 통해 안내 메시지를 표시하도록 구현했습니다.

예를 들어 `인천`을 검색하면 다음과 같이 표시됩니다.

> 🔍 "인천"에 해당하는 도시가 없습니다.

이를 통해 검색 결과가 없는 상황까지 처리할 수 있도록 기능을 확장했습니다.

---

## 4. Customization 정리

기본 스켈레톤 코드에서 제공된 기능을 기반으로 다음과 같은 기능을 직접 추가했습니다.

- 광주, 제주 데이터 추가
- `computed()`를 활용한 검색 결과 계산
- `filter()`를 활용한 실제 도시 검색
- 검색어에 따른 날씨 카드 필터링
- 검색 결과가 없는 경우 안내 메시지 추가

특히 기존의 단순한 도시명 출력 기능을 **실제 데이터 검색 및 카드 필터링 기능으로 확장**하여 사용자의 입력에 따라 화면에 표시되는 데이터가 동적으로 변경되도록 구현했습니다.