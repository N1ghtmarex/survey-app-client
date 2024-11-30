<script setup>
import Header from './components/Header.vue'
import Home from './pages/Home.vue'
</script>

<template>
  <div class="bg-white w-4/5 m-auto h-screen rounded-xl shadow-xl mt-14">
    <Header />

    <div class="p-10">
      <h2 class="text-2xl font-bold mb-8">Все опросы</h2>
      <router-view></router-view>
    </div>
  </div>
</template>
