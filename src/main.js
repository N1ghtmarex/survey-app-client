import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import AddSurvey from './pages/AddSurvey.vue'
import SurveyPage from './pages/SurveyPage.vue'
import Logout from './pages/Logout.vue'

const app = createApp(App)

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/addSurvey', name: 'AddSurvey', component: AddSurvey },
  { path: '/survey/:id', name: 'Survey', component: SurveyPage, props: true },
  { path: '/logout', name: 'Logout', component: Logout },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

app.use(router)

app.mount('#app')
