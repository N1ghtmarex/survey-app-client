<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'

const items = ref([])

onMounted(async () => {
  try {
    const { data } = await axios.get('https://localhost:7156/api/surveys')
    items.value = data.surveys
    console.log(items.value)
  } catch (e) {
    console.log(e)
  }
})
</script>

<template>
  <li v-for="item in items" :key="item.id">
    <router-link :to="`/surveypage/${item.id}`">{{ item.name }}</router-link>
  </li>
</template>
