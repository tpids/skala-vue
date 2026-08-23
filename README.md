# skala-vue 실습

**배포 사이트**
https://skala-vue-kappa.vercel.app/

## 실행방법
```bash
npm install
npm run dev
```

## 목차
- [Weather Mockup - Hands on](#weather-mockup---hands-on)
- [Weather Composition - Hands on](#weather-composition---hands-on)
- [Weather Component - Hands on](#weather-component---hands-on)
- [Weather Router - Hands on](#weather-router---hands-on)
- [Weather Store - Hands on](#weather-store---hands-on)
- [Weather Axios - Hands on](#weather-axios---hands-on)
- [Weather UI Library - Hands on](#weather-ui-library---hands-on)
- [Weather Deployment - Hands on](#weather-deployment---hands-on)
- [최종 과제 설명](#최종-과제-설명)
- [API 키 및 환경 변수 관리](#api-키-및-환경-변수-관리)
- [배포](#배포)


## Weather Mockup - Hands on

기본으로 제공된 Weather Mockup 코드에 개인적으로 기능과 데이터를 추가하여 확장했다.

### 1. 도시 데이터 추가

기본 데이터인 서울, 수원, 부산 외에 직접 도시 데이터를 추가했다.

- 광주
- 제주

```javascript
{ id: 'city_04', name: '광주', temp: 30, status: '맑음' },
{ id: 'city_05', name: '제주', temp: 22, status: '비' },
```

기존 `weatherList` 데이터 구조를 그대로 활용하여 별도의 화면 코드를 추가하지 않고도 새로운 도시가 자동으로 카드에 렌더링되도록 구성했다.

---

### 2. 실제 도시 검색 및 카드 필터링 기능 추가

기본 코드에서는 검색창에 입력한 도시명을 단순히 화면에 출력하는 형태였지만, 이를 실제 검색 기능으로 확장했다.

`computed()`와 JavaScript의 `filter()`를 활용하여 입력한 검색어가 포함된 도시만 화면에 표시하도록 구현했다.

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

검색 결과에 따라 날씨 카드 목록 자체가 변경되도록 구현했다.

예를 들어 `광`을 검색하면 광주 카드만 화면에 표시되도록 구현했다.

---

### 3. 검색 결과 없음 처리

존재하지 않는 도시를 검색했을 때 사용자에게 검색 결과가 없다는 것을 알려주는 기능을 추가했다.

```vue
<p v-if="filteredWeatherList.length === 0" class="no-result">
  🔍 "{{ searchQuery }}"에 해당하는 도시가 없습니다.
</p>
```

검색 결과가 존재하지 않는 경우 `filteredWeatherList.length === 0` 조건을 통해 안내 메시지를 표시하도록 구현했다.

예를 들어 `인천`을 검색하면 다음과 같이 표시됩니다.

> 🔍 "인천"에 해당하는 도시가 없습니다.

이를 통해 검색 결과가 없는 상황까지 처리할 수 있도록 기능을 확장했다.

---

### 4. 추가 기능 구현

기본 코드에서 제공된 기능을 기반으로 다음과 같은 기능을 직접 추가했다.

- 광주, 제주 데이터 추가
- `computed()`를 활용한 검색 결과 계산
- `filter()`를 활용한 실제 도시 검색
- 검색어에 따른 날씨 카드 필터링
- 검색 결과가 없는 경우 안내 메시지 추가

특히 기존의 단순한 도시명 출력 기능을 **실제 데이터 검색 및 카드 필터링 기능으로 확장**하여 사용자의 입력에 따라 화면에 표시되는 데이터가 동적으로 변경되도록 구현했다.

---

## Weather Composition - Hands on

### 추가 기능 구현 - 즐겨찾기 도시 기능

기본 요구사항 외에 Composition API 활용 능력을 높이기 위해 **즐겨찾기 도시 기능**을 추가 구현했다.

사용자가 원하는 도시를 즐겨찾기로 설정하면 해당 도시의 날씨 정보를 별도로 확인할 수 있도록 구성했다.

---

### 구현 내용

#### 1. 반응형 상태 관리 (ref)

`favoriteCity`를 새로운 반응형 상태 변수로 추가하여 사용자가 선택한 즐겨찾기 도시 정보를 관리했다.

```javascript
const favoriteCity = ref('')
```

도시 카드의 즐겨찾기 버튼 클릭 시 선택한 도시명이 저장되며, 값이 변경되면 Vue의 반응형 시스템을 통해 화면이 자동으로 업데이트된다.

#### 2. Computed를 활용한 즐겨찾기 데이터 계산

저장된 즐겨찾기 도시명을 기반으로 `weatherList`에서 해당 도시의 날씨 정보를 찾아 반환하는 `favoriteWeather`를 구현했다.

```
const favoriteWeather = computed(() => {
  return weatherList.value.find(
    (item) => item.name === favoriteCity.value
  )
})
```
Computed를 활용하여 기존 데이터를 직접 변경하지 않고, 필요한 데이터를 계산하여 관리하도록 구현했다.

#### 3. Watch를 활용한 상태 변화 감지

즐겨찾기 도시가 변경되는 상황을 감지하기 위해 `watch`를 추가했다.

```
watch(favoriteCity, (newCity) => {
  console.log(
    `⭐ 즐겨찾기 도시가 ${newCity}(으)로 변경되었습니다.`
  )
})
```
사용자가 새로운 도시를 즐겨찾기로 선택할 때마다 변경 내용을 콘솔에서 확인할 수 있도록 했다.

#### 4. watchEffect를 활용한 자동 의존성 추적

```
watchEffect(() => {
  console.log(
    `🤖 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`
  )
})
```

watchEffect는 내부에서 사용하는 반응형 데이터를 Vue가 자동으로 추적하여 해당 데이터가 변경될 때마다 함수를 다시 실행한다.

이번 실습에서는 searchQuery를 자동으로 추적하여 사용자가 검색어를 입력할 때마다 현재 검색어를 콘솔에 출력하도록 구현했다.

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

---

# Weather Component - Hands on

### 실습 내용

기존 Weather 코드를 기능별 Component로 분리하여 코드의 역할을 명확하게 구성했다.

#### Component 구성

- WeatherParent.vue
  - 날씨 데이터 및 모든 반응형 상태 관리
  - computed, watch, watchEffect 유지
  - 자식 Component와 데이터 및 이벤트 통신

- BaseDashboardCard.vue
  - 검색 영역과 날씨 목록의 공통 디자인 담당
  - <slot>을 사용하여 자식 Component 삽입

- SearchBar.vue
  - 도시 검색 UI 담당
  - Props로 검색어 전달
  - Emits로 검색어 변경 내용을 부모에게 전달

- WeatherCard.vue
  - 도시별 날씨 정보 표시
  - Props로 날씨 데이터 전달
  - 카드 선택, 상세보기, 즐겨찾기 이벤트를 Emits로 부모에게 전달

- FavoriteWeather.vue
  - 기존에 추가했던 즐겨찾기 기능을 별도 Component로 분리
  - 즐겨찾기 도시의 기온과 날씨 상태 표시

#### 적용한 Vue 기능
 - Props  → 부모 → 자식 데이터 전달
 - Emits  → 자식 → 부모 이벤트 전달
 - Slot   → 공통 Component 내부에 콘텐츠 삽입

--- 

 # Weather Router - Hands on

기존 Weather Component 구조에 Vue Router를 적용하여 화면을 View 단위로 분리하고,
페이지 이동 및 동적 라우팅 기능을 구현했다.

---

## Vue Router 설정

기존 Weather 화면에 Vue Router를 적용하여 각각의 기능을 별도의 View로 분리했다.

라우터에서 각 경로에 해당하는 View를 연결하고, View가 실제로 접근될 때 로딩되도록 **Lazy Loading**을 적용했다.

```javascript
const routes = [
  {
    path: '/',
    name: 'WeatherHome',
    component: () => import('../views/WeatherHomeView.vue'),
  },
  {
    path: '/weather/:cityId',
    name: 'WeatherDetail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    path: '/about',
    name: 'WeatherAbout',
    component: () => import('../views/WeatherAboutView.vue'),
  },
  {
    path: '/favorites',
    name: 'WeatherFavorites',
    component: () => import('../views/WeatherFavoritesView.vue'),
  },
]
```

View별로 경로를 분리하여 하나의 화면에서 여러 기능을 관리하던 기존 구조를 Router 기반의 페이지 구조로 확장했다.

---

#### 날씨 상세 페이지 Programmatic Navigation

기존 `WeatherCard`의 상세보기 기능에서는 `window.alert()`를 사용했지만,
Vue Router를 활용하여 실제 상세 페이지로 이동하도록 변경했다.

```
const showDetail = (city) => {
  router.push(`/weather/${city.id}`)
}
```

이를 통해 단순 알림창을 표시하는 방식에서
도시 ID를 이용한 `Dynamic Route` 기반 상세 페이지 이동으로 기능을 확장했다.

#### Favorites View 추가

추가 View 요구사항을 충족하기 위해 `WeatherFavoritesView.vue`를 작성했다.
/favorites 경로에서 사용자가 등록한 즐겨찾기 지역을 확인할 수 있도록 구성했다.
즐겨찾기 데이터는 `localStorage`를 활용하여 저장하고,
여러 도시를 동시에 즐겨찾기에 등록할 수 있도록 배열 형태로 관리했다.

```
const favoriteCities = ref(
  JSON.parse(localStorage.getItem('favoriteCities') || '[""]')
)
```
즐겨찾기 설정 및 해제 시 `localStorage`의 데이터를 함께 업데이트하도록 구현했다.

#### 즐겨찾기 상태 시각화
기존에는 즐겨찾기 설정 여부를 상태 메시지로만 확인할 수 있었지만,
현재 즐겨찾기 상태를 별 모양으로 직관적으로 확인할 수 있도록 개선했다.

```
{{ isFavorite ? '⭐' : '☆' }}
```
- ☆ : 즐겨찾기하지 않은 상태
- ⭐ : 즐겨찾기 상태
또한 즐겨찾기 버튼에 `isFavorite Props`를 전달하여
부모 Component의 즐겨찾기 상태가 변경되면 카드의 별 모양도 자동으로 변경되도록 구성했다.

#### 여러 도시 즐겨찾기 지원

기존에는 하나의 `favoriteCity`만 저장하여 하나의 도시만 즐겨찾기할 수 있었지만,
이를 `favoriteCities` 배열로 변경하여 여러 도시를 동시에 관리할 수 있도록 개선했다.

```
const favoriteCities = ref(
  JSON.parse(localStorage.getItem('favoriteCities') || '[]')
)
```

즐겨찾기 설정 시 배열에 도시를 추가하고,
이미 즐겨찾기된 도시를 다시 선택하면 해당 도시를 배열에서 제거하도록 구현했다.

---

# Weather Store - Hands on

## 추가 기능 구현 - 날씨 설정 Store 확장 기능 

기본으로 제공된 `configStore`를 확장하여 날씨 단위 변경 기능과 다크모드 기능을 추가 구현했다.

Pinia Store를 활용하여 애플리케이션 전역에서 사용하는 설정 데이터를 중앙 관리하도록 구성했다.

---

## 온도 단위 변경 기능 추가 (섭씨 / 화씨)

기본 `configStore`의 단위 관리 기능을 활용하여 사용자가 원하는 온도 단위를 선택할 수 있도록 구현했다.

### 구현 내용

#### 1) State - 현재 온도 단위 관리

```javascript
const unit = ref('celsius')
```
현재 선택된 온도 단위를 저장하며 기본값은 섭씨(celsius)로 설정했다.

지원 단위:
- celsius : 섭씨(℃)
- fahrenheit : 화씨(℉)

#### 2) Getter - 단위 표시 기호 반환

```
const unitSymbol = computed(() => {
  return unit.value === 'celsius'
    ? '℃'
    : '℉'
})
```
현재 설정된 단위 상태에 따라 화면에 표시할 기호를 자동으로 반환하도록 구현했다.

#### 3) Action - 단위 전환 기능

```
function toggleUnit() {
  unit.value =
    unit.value === 'celsius'
      ? 'fahrenheit'
      : 'celsius'
}
```
버튼 클릭 시 섭씨와 화씨가 토글되도록 구현했다.

---

## 온도 변환 로직 Store 관리
기존에는 각 Component에서 온도 변환 계산식을 작성해야 했지만,
`configStore` 내부에서 변환 로직을 관리하도록 개선했다.

추가 Action
```
function convertTemperature(celsius) {
  if (unit.value === 'celsius') {
    return celsius
  }

  return (celsius * 9 / 5 + 32).toFixed(1)
}
```
Component에서는 변환 계산식을 직접 작성하지 않고 Store의 함수를 호출하여 사용한다.
```
{{ configStore.convertTemperature(weather.temp) }}
{{ configStore.unitSymbol }}
```

---

## 다크모드 기능 추가 

사용자의 화면 환경 설정을 개선하기 위해 다크모드 기능을 추가했다.
`configStore`에서 다크모드 상태를 관리하고,
Vue의 Class Binding과 CSS를 활용하여 화면 스타일을 동적으로 변경하도록 구현했다.

### 구현 내용

#### 1) State - 다크모드 상태 관리
```
const isDarkMode = ref(false)
```

#### 2) Getter - 테마 아이콘 표시
```
const themeSymbol = computed(() => {
  return isDarkMode.value
    ? '🌙'
    : '☀️'
})
```

#### 3) Action - 다크모드 전환
```
function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value
}
```
---

#### CSS 기반 다크모드 적용

Pinia에서는 다크모드 상태만 관리하고,
실제 화면 색상 변경은 CSS Class를 통해 처리했다.

---

# Weather Axios - Hands on

## 실제 날씨 API 연동 및 외부 API 확장 기능 구현 

기존 Weather Application에서는 Mock Data를 사용하여 날씨 정보를 표시하였지만,
Axios를 활용하여 OpenWeatherMap API와 Open-Meteo Air Quality API를 연동하여
실제 날씨 데이터와 대기질 정보를 제공하도록 확장했다.

---

### Axios 라이브러리 활용

실제 외부 API와 통신하기 위해 Axios 라이브러리를 설치하고 활용했다.

### OpenWeatherMap API 연동 

OpenWeatherMap API를 활용하여 실제 날씨 데이터를 가져오도록 변경했다.

### 환경 변수 활용

API Key를 코드에 직접 작성하지 않고 `.env` 파일을 활용하여 관리했다.

### Open-Meteo Air Quality API 추가 

#### 추가 기능 구현
기존 날씨 정보뿐만 아니라 사용자의 외출 판단에 도움을 줄 수 있도록
대기질 정보를 제공하는 기능을 추가했다.
Open-Meteo Air Quality API를 추가 연동하여
미세먼지와 초미세먼지 정보를 제공하도록 확장했다.

---

# Weather UI Library - Hands on

## Vuetify 및 Material Design Icons 적용

최종 제출 화면의 일관된 UI를 구성하기 위해 Vue 전용 UI 라이브러리인 **Vuetify**를 적용했다.
버튼, 아이콘, Snackbar, Progress Circular 등의 UI를 Vuetify 컴포넌트로 구성하고,
Material Design Icons를 함께 사용했다.

### 적용한 Vuetify 컴포넌트

- `v-btn`: 테마 전환, 단위 전환, 상세보기, 새로고침, 지도 이동 버튼
- `v-icon`: 메뉴, 날씨, 미세먼지, 지도, 비교 기능 아이콘
- `v-snackbar`: 카드 선택 및 즐겨찾기 변경 알림
- `v-progress-circular`: API 로딩 상태 표시

`main.js`에서 Vuetify와 MDI를 등록하여 최종 앱에서 공통으로 사용할 수 있도록 구성했다.

```javascript
const vuetify = createVuetify({
  components: {
    VBtn,
    VIcon,
    VProgressCircular,
    VSnackbar,
  },
})
```

---

# Weather Deployment - Hands on

## 코드 품질 관리

ESLint를 적용하여 JavaScript 및 Vue 파일의 코드 품질을 검사하도록 구성했다.

`eslint.config.js`를 통해 ESLint 권장 규칙과 Vue 권장 규칙을 적용하고,
프로젝트에 맞지 않는 일부 규칙은 조정했다.

### ESLint 실행

```bash
# 코드 검사
npm run lint

# 자동 수정
npm run lint:fix
```

현재 ESLint 검사를 통해 사용하지 않는 변수, Vue 문법 및 코드 작성 규칙 등을 확인할 수 있도록 구성했다.

---

# 최종 과제 설명

`App.final.vue`를 제출용 진입 화면으로 구성하고, 기존 실습 화면과 분리했다.

- Weatherly 브랜드 헤더 및 반응형 사이드바
- 대시보드, 관심 지역, 도시 지도, 환경 리포트, 도시 비교, 실습 보기, 서비스 안내 메뉴
- 라이트모드와 다크모드 테마
- 헤더의 `°C / °F` 단위 전환 버튼
- 카드 hover 및 반응형 카드 grid
- 로컬 `public/sky.svg`를 활용한 날씨 이미지 히어로
- 카드 선택 및 즐겨찾기 변경 시 Snackbar 알림

실습 과제는 `/practice`에서 확인할 수 있으며, 최종 앱과 스타일이 충돌하지 않도록
실습 스타일은 `.exercise-app` 범위 안에서만 적용되도록 구성했다.

---

### 추가 도시 및 날씨 정보

공통 도시 데이터 파일에 도시를 추가했다.

- 서울
- 수원
- 부산
- 광주
- 제주
- 인천

각 도시의 날씨 조회에는 도시명과 위도·경도 정보를 사용한다.
OpenWeatherMap의 날씨 응답에서 다음 데이터를 표시한다.

- 기온
- 날씨 상태
- 습도
- 풍속
- 날씨 아이콘
- 미세먼지

날씨 상태의 원본 표현인 `튼구름`, `실 비`, `온흐림` 등은
`normalizeWeatherStatus()`를 통해 `구름`, `비`, `흐림`처럼 간결한 화면용 표현으로 변환했다.

---

### 도시 지도 기능 

사이드바의 `도시 지도` 메뉴를 별도의 `/map` View로 구성했다.

- 도시 목록에서 도시 선택
- 선택한 도시의 위도·경도 기반 지도 표시
- OpenStreetMap 임베드 사용
- 새 창에서 크게 보기 제공
- 모바일 반응형 레이아웃 지원

검색창의 지도 아이콘은 검색 중인 도시를 기준으로 지도를 열고 닫는 토글 기능을 제공한다.

---

### 환경 리포트 

`/report` 경로에 날씨와 대기질을 종합 비교하는 환경 리포트를 추가했다.

- 가장 맑은 도시
- 관심이 필요한 도시
- 평균 PM2.5
- 도시별 공기질 순위
- 도시별 기온 및 날씨 상태
- 새로고침을 통한 API 재조회
- 마지막 데이터 업데이트 시간

---

### 도시 비교 기능 

`/compare` 경로에 두 도시의 실시간 상태를 비교하는 페이지를 추가했다.

사용자가 두 도시를 선택하면 OpenWeatherMap과 Open-Meteo API를 다시 호출하여 다음 항목을 나란히 표시한다.

- 기온
- 날씨 상태
- 습도
- 풍속
- PM10
- PM2.5
- 미세먼지 등급

화면 폭이 좁아지면 비교 카드가 세로로 전환되도록 반응형으로 구성했다.

---

## API 키 및 환경 변수 관리

OpenWeatherMap API Key는 Vite 환경 변수로 관리한다.

- 로컬 개발: `.env`
- GitHub 공유: `.env.example`
- 배포 환경: Vercel Environment Variables

실제 API Key는 GitHub 저장소에 포함하지 않는다.

```env
VITE_WEATHER_API_KEY=your_openweathermap_api_key
```

`.env`와 환경별 설정 파일은 .gitignore에 등록하고,
공유 가능한 환경 변수 템플릿은 `.env.example`로 제공한다.

```
.env
.env.*
!.env.example
```

---

## 배포

- **배포 플랫폼**: Vercel
- **배포 URL**: https://skala-vue-kappa.vercel.app/
- **배포 방식**: GitHub 저장소 연동을 통한 자동 배포
