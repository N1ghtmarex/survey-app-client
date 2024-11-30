import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Survey from './pages/Survey.vue'

const app = createApp(App)

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/survey/:id', name: 'Survey', component: Survey, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

app.use(router)

app.mount('#app')
