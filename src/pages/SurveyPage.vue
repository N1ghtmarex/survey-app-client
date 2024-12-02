<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { formatInTimeZone } from 'date-fns-tz'
import { ca, ru, tr } from 'date-fns/locale'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

let surveyStatus = ref()
let surveyBind = ref({})
let survey = ref({})
let choices = ref([])
let selectedAnswers = ref({})

function viewResult() {
  surveyStatus.value = 'view'
}

function getChoices() {
  try {
    axios
      .get(`https://localhost:7156/api/choice/survey/${props.id}`, {
        withCredentials: true,
      })
      .then((response) => {
        choices.value = response.data.choices
      })
  } catch (error) {
    log.console(error)
  }
}

function startSurvey() {
  try {
    axios
      .post(
        'https://localhost:7156/api/surveys/start',
        {
          surveyId: props.id,
        },
        {
          withCredentials: true,
        },
      )
      .then((response) => {
        surveyStatus.value = 'В процессе'
      })
  } catch (error) {
    console.log(error)
  }
}

function makeChoice(questionId, answerId) {
  if (surveyStatus.value == 'В процессе') {
    let index = choices.value.findIndex((x) => x.questionId == questionId)
    if (index > -1) {
      choices.value[index].answerId = answerId
    } else {
      choices.value.push({
        questionId: questionId,
        answerId: answerId,
      })
    }
    try {
      axios.post(
        'https://localhost:7156/api/choice',
        {
          answerId: answerId,
        },
        {
          withCredentials: true,
        },
      )
    } catch (error) {
      console.log(error)
    }
  }
}

function comleteSurvey() {
  try {
    axios
      .post(
        'https://localhost:7156/api/surveys/complete',
        {
          surveyId: props.id,
        },
        {
          withCredentials: true,
        },
      )
      .then((surveyStatus.value = 'Завершен'))
  } catch (e) {
    console.log(e)
  }
}

function getSurvey() {
  try {
    axios.get(`https://localhost:7156/api/surveys/${props.id}`).then((response) => {
      survey.value = response.data
    })
  } catch (error) {
    console.log(error)
  }
}

function getUserSurveyBind() {
  try {
    axios
      .get(`https://localhost:7156/api/surveys/bind/${props.id}`, {
        withCredentials: true,
      })
      .then((response) => {
        surveyBind.value = response.data
        if (surveyBind.value.status == 0) {
          surveyStatus.value = 'В процессе'
          getChoices()
        } else if (surveyBind.value.status == 1) {
          surveyStatus.value = 'Завершен'
          getChoices()
        }
      })
      .catch((error) => {
        if (error.response.status == 404) {
          surveyStatus.value = 'Не начат'
        }
      })
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getUserSurveyBind()
  getSurvey()
})
</script>

<template>
  <div class="about">
    <div class="flex">
      <img class="w-10" src="/survey.jpg" alt="Survey Logo" />
      <span class="text-3xl font-bold">{{ survey.name }}</span>
    </div>
    <div v-if="surveyStatus != 'В процессе'" class="bg-slate-100 w-1/2 p-4">
      <span>{{ survey.description }}</span>
    </div>
    <div
      v-if="surveyStatus != 'В процессе' && surveyStatus != 'view'"
      class="date grid grid-cols-2 w-1/2"
    >
      <div>
        <div class="flex gap-1">
          <h1>Создан:</h1>
          <p v-if="survey.createdAt != undefined">
            {{
              formatInTimeZone(
                survey.createdAt,
                Intl.DateTimeFormat().resolvedOptions().timeZone,
                'HH:mm dd.MM.yyyy',
                { locale: ru },
              )
            }}
          </p>
        </div>

        <div class="flex gap-1">
          <h1>Изменен:</h1>
          <p v-if="survey.updatedAt != undefined">
            {{
              formatInTimeZone(
                survey.updatedAt,
                Intl.DateTimeFormat().resolvedOptions().timeZone,
                'HH:mm dd.MM.yyyy',
                { locale: ru },
              )
            }}
          </p>
        </div>
      </div>
      <div v-if="surveyStatus == 'Завершен'">
        <div class="flex gap-1">
          <h1>Начат:</h1>
          <p v-if="surveyBind.startedAt != undefined">
            {{
              formatInTimeZone(
                surveyBind.startedAt,
                Intl.DateTimeFormat().resolvedOptions().timeZone,
                'EEEE, HH:mm dd.MM.yyyy',
                { locale: ru },
              )
            }}
          </p>
        </div>

        <div class="flex gap-1">
          <h1>Завершен:</h1>
          <p v-if="surveyBind.completedAt != undefined">
            {{
              formatInTimeZone(
                surveyBind.completedAt,
                Intl.DateTimeFormat().resolvedOptions().timeZone,
                'EEEE, HH:mm dd.MM.yyyy',
                { locale: ru },
              )
            }}
          </p>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-center w-1/2 mt-6">
      <button
        v-if="surveyStatus == 'Завершен'"
        class="result-btn p-2 bg-indigo-700 text-white hover:bg-indigo-800"
        @click="viewResult"
      >
        Посмотреть результат
      </button>
    </div>
  </div>

  <div v-if="surveyStatus == 'view' || surveyStatus == 'В процессе'">
    <div v-for="(question, index) in survey.questions" :key="question.id" class="mb-8">
      <div class="bg-slate-300 w-1/2">
        <h1 class="font-bold text-xl">{{ index + 1 }}. {{ question.title }}</h1>
      </div>
      <div
        class="bg-slate-100 w-1/2 text-lg"
        v-for="answer in question.answers"
        :key="answer.id"
        @click="makeChoice(question.id, answer.id)"
      >
        <input
          type="radio"
          :checked="
            choices.some((x) => x.answerId == answer.id) ||
            selectedAnswers[question.id] == answer.id
          "
          :disabled="surveyStatus == 'view'"
        />
        <label>{{ answer.title }}</label>
      </div>
    </div>

    <div class="flex items-center justify-center w-1/2">
      <button
        v-if="surveyStatus == 'В процессе'"
        @click="comleteSurvey"
        class="p-1 bg-indigo-700 text-white hover:bg-indigo-800 w-1/4"
      >
        Завершить
      </button>
    </div>
    <div class="flex items-center justify-center w-1/2">
      <button
        v-if="surveyStatus == 'view'"
        @click="surveyStatus = 'Завершен'"
        class="p-1 bg-indigo-700 text-white hover:bg-indigo-800 w-1/4"
      >
        Закончить просмотр
      </button>
    </div>
  </div>

  <div v-if="surveyStatus == 'Не начат'" class="w-1/2">
    <button @click="startSurvey" class="p-1 bg-indigo-700 text-white hover:bg-indigo-800 w-1/4">
      Начать
    </button>
  </div>
</template>

<style scoped>
.selected-answer {
  color: blue;
}
</style>
