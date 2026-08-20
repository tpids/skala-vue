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

---

# Weather Composition - Hands on

## 추가 기능 구현 - 즐겨찾기 도시 기능 ⭐

기본 요구사항 외에 Composition API 활용 능력을 높이기 위해 **즐겨찾기 도시 기능**을 추가 구현하였다.

사용자가 원하는 도시를 즐겨찾기로 설정하면 해당 도시의 날씨 정보를 별도로 확인할 수 있도록 구성하였다.

---

### 구현 내용

#### 1. 반응형 상태 관리 (ref)

`favoriteCity`를 새로운 반응형 상태 변수로 추가하여 사용자가 선택한 즐겨찾기 도시 정보를 관리하였다.

```javascript
const favoriteCity = ref('')
```

도시 카드의 즐겨찾기 버튼 클릭 시 선택한 도시명이 저장되며, 값이 변경되면 Vue의 반응형 시스템을 통해 화면이 자동으로 업데이트된다.

#### 2. Computed를 활용한 즐겨찾기 데이터 계산

저장된 즐겨찾기 도시명을 기반으로 `weatherList`에서 해당 도시의 날씨 정보를 찾아 반환하는 `favoriteWeather`를 구현하였다.

```
const favoriteWeather = computed(() => {
  return weatherList.value.find(
    (item) => item.name === favoriteCity.value
  )
})
```
Computed를 활용하여 기존 데이터를 직접 변경하지 않고, 필요한 데이터를 계산하여 관리하도록 구현하였다.

#### 3. Watch를 활용한 상태 변화 감지

즐겨찾기 도시가 변경되는 상황을 감지하기 위해 `watch`를 추가하였다.

```
watch(favoriteCity, (newCity) => {
  console.log(
    `⭐ 즐겨찾기 도시가 ${newCity}(으)로 변경되었습니다.`
  )
})
```

사용자가 새로운 도시를 즐겨찾기로 선택할 때마다 변경 내용을 콘솔에서 확인할 수 있도록 하였다.

---

#### 기능 동작 흐름
```
도시 카드의 즐겨찾기 버튼 클릭
          ↓
favoriteCity 상태 변경 (ref)
          ↓
favoriteWeather 재계산 (computed)
          ↓
즐겨찾기 영역 화면 업데이트
          ↓
watch를 통한 변경 로그 출력
```

이번 추가 기능을 통해 Vue Composition API의 핵심 기능인 반응형 상태 관리(ref), 계산 속성(computed), 상태 변화 감시(watch) 를 실제 기능 구현 과정에서 활용하였다.