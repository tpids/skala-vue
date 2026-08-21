export const CITIES = [
  { id: 'city_01', name: '서울', city: 'Seoul', lat: 37.5665, lon: 126.978 },
  { id: 'city_02', name: '수원', city: 'Suwon', lat: 37.2636, lon: 127.0286 },
  { id: 'city_03', name: '부산', city: 'Busan', lat: 35.1796, lon: 129.0756 },
  { id: 'city_04', name: '광주', city: 'Gwangju', lat: 35.1595, lon: 126.8526 },
  { id: 'city_05', name: '제주', city: 'Jeju', lat: 33.4996, lon: 126.5312 },
]

export const getCityById = (cityId) => {
  return CITIES.find((city) => city.id === cityId)
}

export const getCityByName = (name) => {
  return CITIES.find((city) => city.name === name)
}
