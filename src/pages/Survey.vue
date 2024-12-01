<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'

import QuestionList from '.././components/QuestionList.vue'

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
    console.log(survey.value.questions)
  } catch (e) {
    console.log(e)
  }
})
</script>

<template>
  <div v-if="survey">
    <QuestionList :survey="survey" />
  </div>
</template>
