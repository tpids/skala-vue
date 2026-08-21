import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// import App from './App.vue'
// import App from './App.exercise.vue'
// import App from './App2.vue'
import router from './router'

import App from './App.final.vue'

createApp(App).use(createPinia()).use(router).mount('#app')