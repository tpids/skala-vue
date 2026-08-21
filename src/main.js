import './assets/main.css'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import { VBtn, VIcon, VProgressCircular, VSnackbar } from 'vuetify/components'

// import App from './App.vue'
// import App from './App.exercise.vue'
// import App from './App2.vue'
import router from './router'

import App from './App.final.vue'

const vuetify = createVuetify({
	components: {
		VBtn,
		VIcon,
		VProgressCircular,
		VSnackbar,
	},
	theme: {
		defaultTheme: 'weatherLight',
		themes: {
			weatherLight: {
				dark: false,
				colors: {
					primary: '#2a5554',
					secondary: '#d5f36b',
					surface: '#ffffff',
				},
			},
		},
	},
	icons: {
		defaultSet: 'mdi',
	},
})

createApp(App).use(createPinia()).use(router).use(vuetify).mount('#app')