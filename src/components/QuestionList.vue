<script setup>
import { onMounted, ref } from 'vue'
import { formatInTimeZone } from 'date-fns-tz'
import { ru } from 'date-fns/locale'
import axios from 'axios'

const props = defineProps({
  survey: ref(),
})

let surveyStatus = ref('')
let currentQuestionIndex = ref(0)
let selectedAnswers = ref({})
let choices = ref([])
let viewStatus = ref(false)

axios.default.withCredentials = true

function nextQuestion() {
  currentQuestionIndex.value++
}

function prevQuestion() {
  currentQuestionIndex.value--
}

function view() {
  viewStatus.value = !viewStatus.value
}

function selectAnswer(questionId, answerId) {
  if (!viewStatus.value) {
    selectedAnswers.value[questionId] = answerId
    makeChoice(answerId)
  } else {
    return
  }
}

function startSurvey(surveyId) {
  try {
    axios
      .post(
        'https://localhost:7156/api/surveys/start',
        {
          surveyId: surveyId,
        },
        {
          withCredentials: true,
          headers: {
            'Access-Control-Allow-Credentials': true,
          },
        },
      )
      .then((response) => {
        surveyStatus.value = 'InProgress'
      })
  } catch (error) {
    console.log(error)
  }
}

function makeChoice(answerId) {
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
  } catch (e) {
    console.log(e)
  }
}

function completeSurvey(surveyId) {
  for (let i in selectedAnswers.value) {
    makeChoice(selectedAnswers.value[i])
  }

  try {
    axios
      .post(
        'https://localhost:7156/api/surveys/complete',
        {
          surveyId: surveyId,
        },
        {
          withCredentials: true,
        },
      )
      .then((surveyStatus.value = 'Completed'))
  } catch (e) {
    console.log(e)
  }
}

onMounted(() => {
  try {
    axios
      .get(`https://localhost:7156/api/surveys/status/${props.survey.id}`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data)
        surveyStatus.value = response.data
      })
  } catch (error) {
    console.log(error)
  }

  getChoices(props.survey.id)
})

function getChoices(surveyId) {
  try {
    axios
      .get(`https://localhost:7156/api/choice/survey/${surveyId}`, {
        withCredentials: true,
      })
      .then((response) => {
        choices.value = response.data.choices
        console.log(choices.value)
      })
  } catch (e) {
    console.log(e)
  }
}
</script>

<template>
  <div class="about" v-if="surveyStatus != 'InProgress'">
    <h1>Название опроса: {{ survey.name }}</h1>
    <p>Описание: {{ survey.description }}</p>
    <p>
      Добавлен:
      {{
        formatInTimeZone(
          survey.createdAt,
          Intl.DateTimeFormat().resolvedOptions().timeZone,
          'dd.MM.yyyy HH:mm',
          { locale: ru },
        )
      }}
    </p>
    <p>
      Изменен:
      {{
        formatInTimeZone(
          survey.updatedAt,
          Intl.DateTimeFormat().resolvedOptions().timeZone,
          'dd.MM.yyyy HH:mm',
          { locale: ru },
        )
      }}
    </p>
    <button v-if="surveyStatus == 'Опрос не начат'" @click="startSurvey(survey.id)">Начать</button>
    <button v-if="surveyStatus == 'Completed' && !viewStatus" @click="view">
      Посмотреть результаты
    </button>
    <button v-if="surveyStatus == 'Completed' && viewStatus" @click="view">
      Закончить просмотр
    </button>
  </div>
  <div class="question" v-if="surveyStatus == 'InProgress' || viewStatus">
    <h1>
      {{ currentQuestionIndex + 1 }} вопрос: {{ survey.questions[currentQuestionIndex].title }}
    </h1>
    <ul>
      <li
        class="answer-option"
        @click="selectAnswer(answer.questionId, answer.id)"
        v-for="(answer, index) in survey.questions[currentQuestionIndex].answers"
        :key="answer.id"
        :class="{
          'selected-answer':
            choices.some((x) => x.answerId == answer.id) ||
            selectedAnswers[answer.questionId] == answer.id,
        }"
      >
        <p>{{ index + 1 }}) {{ answer.title }}</p>
      </li>
    </ul>
    <button v-if="currentQuestionIndex != 0" @click="prevQuestion">Назад</button>
    <button v-if="currentQuestionIndex != survey.questions.length - 1" @click="nextQuestion">
      Далее
    </button>
  </div>
  <button v-if="surveyStatus == 'InProgress'" @click="completeSurvey(survey.id)">Завершить</button>
</template>

<style scoped>
.answer-option {
  cursor: pointer;
  padding: 5px 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  margin-bottom: 5px;
}

.answer-option:hover {
  background-color: #e0e0e0;
}

.selected-answer {
  background-color: #cce5ff; /* Светло-синий цвет */
  border-color: #66b2ff;
  font-weight: bold;
}
</style>
