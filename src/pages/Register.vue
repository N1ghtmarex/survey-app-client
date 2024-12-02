<script setup>
import axios from 'axios'
import { ref } from 'vue'

const name = ref('')
const password = ref('')
const confirmPassword = ref('')

const register = () => {
  if (password.value !== confirmPassword.value) {
    alert('Пароли не совпадают!')
    return
  }

  try {
    axios
      .post('https://localhost:7156/api/users/register', {
        username: name.value,
        password: password.value,
      })
      .then((response) => {
        alert('Регистрация выполнена!')
      })
      .catch((error) => {
        alert(error.response.data.Message)
      })
  } catch (e) {
    console.log(e)
  }
}
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md border">
      <h2 class="text-2xl font-bold text-center text-gray-700">Регистрация</h2>
      <form @submit.prevent="register">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-600">Имя</label>
            <input
              v-model="name"
              type="text"
              id="name"
              placeholder="Введите имя"
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
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-600"
              >Подтвердите пароль</label
            >
            <input
              v-model="confirmPassword"
              type="password"
              id="confirmPassword"
              placeholder="Подтвердите пароль"
              class="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
          >
            Зарегистрироваться
          </button>
        </div>
      </form>
      <div class="text-sm text-center text-gray-500">
        Уже есть аккаунт?
        <router-link to="/login">
          <span class="text-blue-500 hover:underline">Войти</span>
        </router-link>
      </div>
    </div>
  </div>
</template>
