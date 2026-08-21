import axios from 'axios'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

const weatherApi = axios.create({
  baseURL:
    'https://api.openweathermap.org/data/2.5',
})

export const normalizeWeatherStatus = (description) => {
  if (description.includes('비') || description.includes('소나기')) {
    return '비'
  }

  if (description.includes('눈')) {
    return '눈'
  }

  if (description.includes('구름')) {
    return '구름'
  }

  if (description.includes('흐림')) {
    return '흐림'
  }

  if (description.includes('맑')) {
    return '맑음'
  }

  return description
}

export const getWeather = (city) => {
  return weatherApi.get('/weather', {
    params: {
      q: city,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })
}