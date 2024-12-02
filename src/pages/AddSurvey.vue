<script setup>
import axios from 'axios'
import { ref } from 'vue'

let createdSurveyId = null
const surveyTitle = ref('')
const surveyDescription = ref('')
const questions = ref([
  {
    text: '',
    answers: [''],
  },
])

function addQuestion() {
  questions.value.push({ text: '', answers: [''] })
}

function removeQuestion(index) {
  questions.value.splice(index, 1)
}

function addAnswerOption(questionIndex) {
  questions.value[questionIndex].answers.push('')
}

function removeAnswerOption(questionIndex, optionIndex) {
  questions.value[questionIndex].answers.splice(optionIndex, 1)
}

function submitSurvey() {
  if (!surveyTitle.value || questions.value.length === 0) {
    alert('Пожалуйста, заполните название опроса и добавьте хотя бы один вопрос.')
    return
  }

  for (const question of questions.value) {
    if (!question.text || question.answers.length === 0) {
      alert('Пожалуйста, заполните текст всех вопросов и добавьте варианты ответа.')
      return
    }
  }

  const newSurvey = {
    name: surveyTitle.value,
    description: surveyDescription.value,
    questions: questions.value.map((question) => ({
      title: question.text,
      type: 0,
      answers: question.answers.map((answer, index) => ({
        title: answer,
      })),
    })),
  }

  if (newSurvey.description == '') {
    newSurvey.description = null
  }

  console.log('Опрос создан:', newSurvey)
  try {
    axios.post('https://localhost:7156/api/surveys/create', newSurvey)
  } catch (error) {
    console.log(error)
  }

  surveyTitle.value = ''
  surveyDescription.value = ''
  questions.value = [{ text: '', answers: [''] }]
}
</script>

<template>
  <div class="survey-creation">
    <h1>Создание нового опроса</h1>

    <div class="form-group">
      <label for="survey-title">Название:</label>
      <input
        id="survey-title"
        type="text"
        v-model="surveyTitle"
        placeholder="Введите название опроса"
      />
    </div>

    <div class="form-group">
      <label for="survey-description">Описание:</label>
      <textarea
        id="survey-description"
        v-model="surveyDescription"
        placeholder="Введите описание опроса"
      ></textarea>
    </div>

    <div v-for="(question, questionIndex) in questions" :key="questionIndex" class="question-block">
      <h3>Вопрос {{ questionIndex + 1 }}</h3>

      <div class="form-group">
        <label>Текст вопроса:</label>
        <input type="text" v-model="question.text" placeholder="Введите текст вопроса" />
      </div>

      <div class="form-group">
        <label>Варианты ответа:</label>
        <div
          v-for="(option, optionIndex) in question.answers"
          :key="optionIndex"
          class="answer-option"
        >
          <input
            type="text"
            v-model="question.answers[optionIndex]"
            placeholder="Введите вариант ответа"
          />
          <button @click="removeAnswerOption(questionIndex, optionIndex)">Удалить</button>
        </div>
        <button @click="addAnswerOption(questionIndex)">Добавить вариант ответа</button>
      </div>

      <button class="remove-question" @click="removeQuestion(questionIndex)">Удалить вопрос</button>
    </div>

    <button @click="addQuestion">Добавить вопрос</button>

    <button @click="submitSurvey">Создать опрос</button>
  </div>
</template>

<style scoped>
.survey-creation {
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5em;
}

label {
  display: block;
  margin-bottom: 0.5em;
  font-weight: bold;
}

input,
textarea {
  width: 100%;
  padding: 0.5em;
  font-size: 1em;
  margin-bottom: 0.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 0.5em 1em;
  font-size: 1em;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.answer-option {
  display: flex;
  align-items: center;
  gap: 1em;
  margin-bottom: 0.5em;
}

.question-block {
  border: 1px solid #ddd;
  padding: 1em;
  margin-bottom: 1.5em;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.remove-question {
  background-color: #ff6347;
}

.remove-question:hover {
  background-color: #c44c3b;
}
</style>
