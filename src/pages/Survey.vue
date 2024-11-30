<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const survey = ref()

onMounted(async () => {
  try {
    const { data } = await axios.get(`https://localhost:7156/api/surveys/${props.id}`)
    survey.value = data
    console.log(data.questions)
  } catch (e) {
    console.log(e)
  }
})
</script>

<template>
  <div v-if="survey">
    <h1>Название опроса: {{ survey.name }}</h1>
    <p>Описание: {{ survey.description }}</p>
    <div v-for="question in survey.questions" :key="question.id">
      <h1>Текст вопроса: {{ question.title }}</h1>
      <ul>
        <li v-for="(answer, index) in question.answers" :key="answer.id">
          {{ index + 1 + ') ' + answer.title }}
        </li>
      </ul>
    </div>
  </div>
</template>
