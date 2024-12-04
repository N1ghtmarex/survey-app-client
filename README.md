# survey-app-client

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
### Главная страница
На главной странице отображаются все существующие опросы. При нажатии на название опроса происходит перенаправление на страницу с опросом. При нажатии на соответсвующие кнопки можно редактировать или удалить опрос.
![1.png](https://s2.radikal.cloud/2024/12/03/1.png)

### Страница опроса
На странице опроса представлено название, описание, дата и время изменения и создания. Если опрос еще не был начат, то будет присутствовать кнопка "Начать", после нажатия на которую происходит запуск прохождения опроса.
![2.png](https://s2.radikal.cloud/2024/12/03/2.png)

### Страница прохождения опроса (1/2)
При прохождении опроса, на экране отображается список вопросов и вариантов ответов.
![3.png](https://s2.radikal.cloud/2024/12/03/3.png)

### Страница прохождения опроса (2/2)
После того, как пользователь выберет ответы на вопросы, он может завершить прохождение кнопкой "Завершить"
![4.png](https://s2.radikal.cloud/2024/12/03/4.png)

### Страница опроса после завершения прохождения
После прохождения опроса отображается дата и время начала, а также завершения прохождения опроса. Ниже присутствует кнопка "Посмотреть результат".
![5.png](https://s2.radikal.cloud/2024/12/03/5.png)

### Страница просмотра результатов
Страница результатов аналогична странице прохождения опроса, за исключением того, что выбор ответов недоступен. Пользователь может наблюдать какие ответы были выбраны.
![6.png](https://s2.radikal.cloud/2024/12/03/6.png)

### Страница редактирования опроса
![7.png](https://s2.radikal.cloud/2024/12/03/7.png)

### Страница создания нового опроса
![8.png](https://s2.radikal.cloud/2024/12/03/8.png)
