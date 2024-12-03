<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'

const items = ref([])

function deleteSurvey(id, index) {
  let name = items.value.find((x) => x.id == id).name
  try {
    axios.delete(`https://localhost:7156/api/surveys/${id}`).then((respone) => {
      if (respone.status == 204) {
        alert(`Опрос "${name}" удален!`)
        items.value.splice(index, 1)
      }
    })
  } catch (error) {
    console.log(error)
  }
}

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
  <div class="mt-2" v-for="(item, index) in items" :key="item.id">
    <li class="flex items-center">
      <router-link :to="`/survey/${item.id}`">
        <div class="flex">
          <img class="w-6 object-cover" src="/survey.jpg" alt="Опрос" />
          {{ item.name }}
        </div>
      </router-link>
      <div class="text-sm text-blue-600 px-1">
        <span>[</span>
        <router-link :to="`/survey/edit/${item.id}`" class="hover:text-blue-950"
          ><span>Редактировать</span></router-link
        >
        <span> | </span>
        <span @click="deleteSurvey(item.id, index)" class="cursor-pointer hover:text-red-600"
          >Удалить</span
        >
        <span>]</span>
      </div>
    </li>
  </div>
</template>
