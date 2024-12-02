<script setup>
import axios from 'axios'
import { ref } from 'vue'

if (document.cookie.includes('auth_status=true')) {
  window.location.href = '/'
}

const username = ref('')
const password = ref('')

const handleLogin = () => {
  console.log('Email:', username.value, 'Password:', password.value)

  try {
    axios.default.withCredentials = true
    axios
      .post(
        'https://localhost:7156/api/users/login',
        {
          username: username.value,
          password: password.value,
        },
        {
          withCredentials: true,
        },
      )
      .then((response) => {
        window.location.href = '/'
      })
      .catch((error) => {
        console.log(error)
      })
  } catch (e) {
    console.log(e)
  }
}
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md border">
      <h2 class="text-2xl font-bold text-center text-gray-700">Добро пожаловать!</h2>
      <form @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-600"
              >Имя пользователя</label
            >
            <input
              v-model="username"
              type="username"
              id="username"
              placeholder="Введите имя пользователя"
              class="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-600">Пароль</label>
            <input
              v-model="password"
              type="password"
              id="password"
              placeholder="Введите пароль"
              class="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Войти
          </button>
        </div>
      </form>
      <div class="text-sm text-center text-gray-500">
        Нет аккаунта?
        <router-link to="/register">
          <span class="text-blue-500 hover:underline">Зарегистрируйтесь</span>
        </router-link>
      </div>
    </div>
  </div>
</template>
