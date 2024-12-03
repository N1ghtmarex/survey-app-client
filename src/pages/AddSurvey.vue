<script setup>
import axios from 'axios'
import { ref } from 'vue'

const surveyTitle = ref('')
const surveyDescription = ref('')
const questions = ref([
  {
    title: '',
    type: 0,
    answers: [
      {
        title: '',
      },
    ],
  },
])

function addQuestion() {
  questions.value.push({
    title: '',
    type: 0,
    answers: [
      {
        title: '',
      },
    ],
  })
}

function removeQuestion(index) {
  questions.value.splice(index, 1)
}

function addAnswer(questionIndex) {
  questions.value[questionIndex].answers.push({
    title: '',
  })
}

function removeAnswer(questionIndex, answerIndex) {
  questions.value[questionIndex].answers.splice(answerIndex, 1)
}

async function createSurvey() {
  if (!surveyTitle.value || questions.value.length === 0) {
    alert('Пожалуйста, заполните название опроса и добавьте хотя бы один вопрос.')
    return
  }

  for (const question of questions.value) {
    if (!question.title || question.answers.length === 0) {
      alert('Пожалуйста, заполните текст всех вопросов и добавьте варианты ответа.')
      return
    }
    if (question.answers.some((answer) => !answer.title)) {
      alert('Все варианты ответов должны быть заполнены.')
      return
    }
  }

  const newSurvey = {
    name: surveyTitle.value,
    description: surveyDescription.value || null,
    questions: questions.value,
  }

  try {
    const response = await axios.post('https://localhost:7156/api/surveys/create', newSurvey)
    if (response.status === 200) {
      alert('Опрос создан!')
      resetSurvey()
    } else {
      alert('Ошибка! Пожалуйста, повторите попытку позднее.')
    }
  } catch (error) {
    console.error(error)
    alert('Произошла ошибка при отправке данных.')
  }
}

function resetSurvey() {
  surveyTitle.value = ''
  surveyDescription.value = ''
  questions.value = [
    {
      title: '',
      type: 0,
      answers: [
        {
          title: '',
        },
      ],
    },
  ]
}
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
    <h1 class="text-2xl font-bold mb-6 text-center">Создание нового опроса</h1>

    <div class="mb-4">
      <label for="survey-title" class="block text-lg font-semibold mb-2">Название:</label>
      <input
        id="survey-title"
        type="text"
        v-model="surveyTitle"
        placeholder="Введите название опроса"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div class="mb-6">
      <label for="survey-description" class="block text-lg font-semibold mb-2">Описание:</label>
      <textarea
        id="survey-description"
        v-model="surveyDescription"
        placeholder="Введите описание опроса (необязательно)"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>
    </div>

    <div
      v-for="(question, questionIndex) in questions"
      :key="questionIndex"
      class="mb-6 p-4 border border-gray-300 rounded-lg bg-white"
    >
      <h3 class="text-lg font-semibold mb-4">Вопрос {{ questionIndex + 1 }}</h3>

      <div class="mb-4">
        <label class="block font-semibold mb-2">Текст вопроса:</label>
        <input
          type="text"
          v-model="question.title"
          placeholder="Введите текст вопроса"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="mb-4">
        <label class="block font-semibold mb-2">Варианты ответа:</label>
        <div
          v-for="(answer, answerIndex) in question.answers"
          :key="answerIndex"
          class="flex items-center gap-4 mb-2"
        >
          <input
            type="text"
            v-model="answer.title"
            placeholder="Введите вариант ответа"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            @click="removeAnswer(questionIndex, answerIndex)"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Удалить
          </button>
        </div>
        <button
          @click="addAnswer(questionIndex)"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Добавить вариант ответа
        </button>
      </div>

      <button
        @click="removeQuestion(questionIndex)"
        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 w-full"
      >
        Удалить вопрос
      </button>
    </div>

    <div class="flex justify-between items-center mt-6">
      <button
        @click="addQuestion"
        class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Добавить вопрос
      </button>
      <button
        @click="createSurvey"
        class="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
      >
        Создать опрос
      </button>
    </div>
  </div>
</template>
