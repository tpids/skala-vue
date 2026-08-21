import axios from 'axios'

const airApi = axios.create({
  baseURL: 'https://air-quality-api.open-meteo.com/v1'
})

export const getLatestAirQuality = (data) => {
  const times = data.hourly?.time || []
  const now = Date.now()
  let latestIndex = 0

  times.forEach((time, index) => {
    if (Math.abs(new Date(time).getTime() - now) < Math.abs(new Date(times[latestIndex]).getTime() - now)) {
      latestIndex = index
    }
  })

  return {
    pm10: data.hourly?.pm10?.[latestIndex] ?? null,
    pm25: data.hourly?.pm2_5?.[latestIndex] ?? null,
  }
}

export const getAirQualityGrade = (pm25) => {
  if (pm25 === null || pm25 === undefined) {
    return '측정 정보 없음'
  }

  if (pm25 <= 15) return '좋음'
  if (pm25 <= 35) return '보통'
  if (pm25 <= 75) return '나쁨'
  return '매우 나쁨'
}

export const getAirQuality = (lat, lon) => {
  return airApi.get('/air-quality', {
    params: {
      latitude: lat,
      longitude: lon,
      hourly: 'pm10,pm2_5',
      timezone: 'Asia/Seoul'
    }
  })
}