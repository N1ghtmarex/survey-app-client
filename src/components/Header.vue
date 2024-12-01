<template>
  <header class="flex justify-between border-b border-slate-300 px-8 py-2">
    <router-link to="/">
      <div class="flex items-center gap-4">
        <img src="/logo.png" alt="Logo" class="w-10" />
        <div>
          <h2 class="text-xl font-bold">SurveyApp</h2>
          <p class="text-slate-500">Приложения для проведения опросов</p>
        </div>
      </div>
    </router-link>

    <ul class="flex items-center gap-10 text-slate-500">
      <li class="hover:text-black cursor-pointer">
        <router-link to="/">
          <span>Все опросы</span>
        </router-link>
      </li>
      <li class="hover:text-black cursor-pointer">
        <span>Пройденные опросы</span>
      </li>
      <li class="hover:text-black cursor-pointer">
        <router-link to="/login">
          <span>Войти</span>
        </router-link>
      </li>
    </ul>
  </header>
</template>
