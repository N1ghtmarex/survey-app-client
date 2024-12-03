<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

let survey = ref({})
let changedQuestionsId = []
let changedAnswersId = []
let addedQuestions = [{}]
let addedAnswers = [{}]
let removedQuestionsId = []
let removedAnswersId = []

function changeQuestion(id) {
  if (!changedQuestionsId.includes(id) && id != null) {
    changedQuestionsId.push(id)
  }
}

function changeAnswer(id) {
  if (!changedAnswersId.includes(id) && id != null) {
    changedAnswersId.push(id)
  }
}

function getSurvey() {
  try {
    axios.get(`https://localhost:7156/api/surveys/${props.id}`).then((response) => {
      survey.value = response.data
      console.log(response)
    })
  } catch (error) {
    console.log(error)
  }
}

function addAnswer(index) {
  let question = survey.value.questions[index]

  let answer = {
    questionId: question.id,
    title: '',
  }

  question.answers.push(answer)

  if (question.id == null) {
    addedQuestions.push(question)
  } else {
    addedAnswers.push(answer)
  }
}

function removeAnswer(questionIndex, answersIndex) {
  let answerId = survey.value.questions[questionIndex].answers[answersIndex].id
  if (answerId != null && !removedAnswersId.includes(answerId)) {
    removedAnswersId.push(answerId)
  }
  survey.value.questions[questionIndex].answers.splice(answersIndex, 1)
}

function removeQuestion(questionIndex, questionId) {
  if (questionId != null && !removedQuestionsId.includes(questionId)) {
    removedQuestionsId.push(questionId)
  }

  survey.value.questions.splice(questionIndex, 1)
}

function addQuestion(index) {
  let newQuestion = {
    id: null,
    index: index,
    surveyId: survey.value.id,
    title: '',
    type: 0,
    answers: [],
  }

  survey.value.questions.push(newQuestion)

  addedQuestions.push(newQuestion)
}

function updateSurvey() {
  try {
    axios.put('https://localhost:7156/api/surveys', {
      id: survey.value.id,
      name: survey.value.name,
      description: survey.value.description,
    })

    let changedQuestions = survey.value.questions.filter((question) =>
      changedQuestionsId.includes(question.id),
    )

    changedQuestions.forEach((question) => {
      axios.put('https://localhost:7156/api/question', {
        id: question.id,
        title: question.title,
        type: question.type,
      })
    })

    let nullQuestions = survey.value.questions.filter((x) => x.id == null)
    nullQuestions.forEach((question) => {
      if (question.title != undefined) {
        axios
          .post('https://localhost:7156/api/question', {
            surveyId: survey.value.id,
            title: question.title,
            type: question.type,
          })
          .then((response) => {
            let questionId = response.data
            question.answers.forEach((answer) => {
              axios.post('https://localhost:7156/api/answer/add', {
                questionId: questionId,
                title: answer.title,
              })
            })
          })
      }
    })

    let changedAnswers = survey.value.questions.flatMap((question) =>
      question.answers.filter((answer) => changedAnswersId.includes(answer.id)),
    )

    changedAnswers.forEach((answer) => {
      axios.put('https://localhost:7156/api/answer', {
        id: answer.id,
        title: answer.title,
      })
    })

    console.log(addedAnswers.length)
    addedAnswers.forEach((answer) => {
      if (answer.questionId != null) {
        axios.post('https://localhost:7156/api/answer/add', {
          questionId: answer.questionId,
          title: answer.title,
        })
      }
    })

    removedQuestionsId.forEach((id) => {
      axios.delete(`https://localhost:7156/api/question/${id}`)
    })

    removedAnswersId.forEach((id) => {
      console.log(id)
      axios.delete(`https://localhost:7156/api/answer/${id}`)
    })
  } catch (error) {
    console.log(error)
  }
  let nullAnswerNotNullQuestion = survey.value.questions.flatMap((question) =>
    question.answers.filter((answer) => answer.id == null && answer.questionId != null),
  )
}

onMounted(() => {
  getSurvey()
})
</script>

<template>
  <div class="w-1/2 mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
    <div>
      <h1 class="block text-lg font-semibold mb-2">Название опроса:</h1>
      <input
        type="text"
        v-model="survey.name"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <h1 class="block text-lg font-semibold mb-2">Описание:</h1>
      <textarea
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        v-model="survey.description"
      ></textarea>
    </div>
    <div
      v-for="(question, questionIndex) in survey.questions"
      :key="question.id"
      class="mb-6 p-4 border border-gray-300 rounded-lg bg-white"
    >
      <h1 class="block font-semibold mb-2">Текст вопроса:</h1>
      <input
        type="text"
        @change="changeQuestion(question.id)"
        v-model="question.title"
        class="w-1/2 flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        class="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        @click="removeQuestion(questionIndex, question.id)"
      >
        Удалить
      </button>
      <div>
        <h1 class="block text-lg font-semibold mb-2">Варианты ответа</h1>
        <div
          v-for="(answer, anserIndex) in question.answers"
          :key="answer.id"
          class="flex items-center gap-4 mb-2"
        >
          <div>
            <input
              @change="changeAnswer(answer.id)"
              type="text"
              v-model="answer.title"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              class="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              @click="removeAnswer(questionIndex, anserIndex)"
            >
              Удалить
            </button>
          </div>
        </div>
        <button
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          @click="addAnswer(questionIndex)"
        >
          Добавить вариант ответа
        </button>
      </div>
    </div>
    <button
      class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      @click="addQuestion"
    >
      Добавить вопрос
    </button>
    <button
      class="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      @click="updateSurvey"
    >
      Сохранить
    </button>
  </div>
</template>
