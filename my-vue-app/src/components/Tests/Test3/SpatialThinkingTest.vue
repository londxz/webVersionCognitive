<template>
  <div class="spatial-test">
    <!-- Начальный экран -->
    <div v-if="!testStarted" class="intro-screen">
      <div class="intro-content">
        <div class="intro-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          </svg>
        </div>
        <h2>Тест на пространственное мышление</h2>
        <p>Проверьте свою способность мысленно визуализировать и манипулировать графическими объектами. Вам будет представлен ряд задач, связанных с вращением, сборкой и трансформацией фигур.</p>
        <button @click="startTest" class="action-button">Начать тест</button>
      </div>
    </div>

    <!-- Экран с тестом -->
    <div v-else>
      <div v-if="currentQuestionIndex < questions.length && !testFinished" class="question-screen">
        <div class="progress-bar">
          <div class="progress-indicator" :style="{ width: `${(currentQuestionIndex / questions.length) * 100}%` }"></div>
        </div>
        
        <div class="question-counter">
          Вопрос {{ currentQuestionIndex + 1 }}/{{ questions.length }}
        </div>

        <div class="question-container">
          <h3 class="question-text">{{ questions[currentQuestionIndex].questionText }}</h3>
          
          <div class="question-image-container">
            <img :src="questions[currentQuestionIndex].image" alt="Задание" class="question-image" />
          </div>
          
          <div class="answer-options">
            <button 
              v-for="(answer, index) in questions[currentQuestionIndex].answers" 
              :key="index"
              @click="selectAnswer(index)" 
              class="option-button"
            >
              {{ answer.text }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Экран с результатами -->
      <div v-if="testFinished" class="results-screen">
        <div class="results-content">
          <div class="results-icon" :class="{ 'high-score': correctAnswers >= questions.length * 0.7 }">
            <svg v-if="correctAnswers >= questions.length * 0.7" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 15h8M10 9h.01M14 9h.01"></path>
            </svg>
          </div>
          
          <h2 class="results-title">Результаты теста</h2>
          
          <div class="score-display">
            <div class="score-circle">
              <span class="score-value">{{ correctAnswers }}</span>
              <span class="score-total">/{{ questions.length }}</span>
            </div>
            <p class="score-label">правильных ответов</p>
          </div>
          
          <div class="result-message">
            <p v-if="correctAnswers >= questions.length * 0.9">Отличный результат! У вас превосходное пространственное мышление.</p>
            <p v-else-if="correctAnswers >= questions.length * 0.7">Хороший результат! Ваше пространственное мышление выше среднего.</p>
            <p v-else-if="correctAnswers >= questions.length * 0.5">Неплохой результат. Есть потенциал для улучшения.</p>
            <p v-else>Пространственное мышление можно тренировать! Регулярные упражнения помогут улучшить результаты.</p>
          </div>
          
          <div v-if="mistakes.length" class="mistakes-container">
            <h4 class="mistakes-title">Ошибки в ответах:</h4>
            <ul class="mistakes-list">
              <li v-for="(mistake, index) in mistakes" :key="index" class="mistake-item">
                <strong>Вопрос {{ mistake.questionIndex + 1 }}:</strong> 
                Вы выбрали "{{ mistake.selectedAnswer }}", правильный ответ - "{{ mistake.correctAnswer }}"
              </li>
            </ul>
          </div>
          
          <button @click="restartTest" class="action-button">Пройти тест снова</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      testStarted: false,
      currentQuestionIndex: 0,
      correctAnswers: 0,
      mistakes: [],
      testFinished: false,
      selectedAnswers: {},
      questions: [
        {
          questionText: "При правильном соединении верхние части головоломки создадут одну из следующих фигур (1-5). Обратите внимание, что стороны, которые обозначены одинаковыми буквами (А, В, С), должны соприкасаться между собой. Выберите правильный ответ.",
          image: 'https://i.imgur.com/87ZioVU.png',
          answers: [
            { text: "Ответ 1", correct: true },
            { text: "Ответ 2", correct: false },
            { text: "Ответ 3", correct: false },
            { text: "Ответ 4", correct: false },
            { text: "Ответ 5", correct: false }
          ]
        },
        {
          questionText: "При правильном соединении верхние части головоломки создадут одну из следующих фигур (1-5). Обратите внимание, что стороны, которые обозначены одинаковыми буквами (А, B, С) должны соприкасаться между собой. Выберите правильный ответ.",
          image: 'https://i.imgur.com/8iwkYCi.png',
          answers: [
            { text: "Ответ 1", correct: false },
            { text: "Ответ 2", correct: false },
            { text: "Ответ 3", correct: false },
            { text: "Ответ 4", correct: false },
            { text: "Ответ 5", correct: true }
          ]
        },
        {
          questionText: "Какой из четырех возможных вариантов представляет собой куб в сложенном виде?",
          image: 'https://i.imgur.com/OffiyET.png',
          answers: [
            { text: "Ответ 1", correct: false },
            { text: "Ответ 2", correct: false },
            { text: "Ответ 3", correct: true },
            { text: "Ответ 4", correct: false }
          ]
        },
        {
          questionText: "Какой из четырех возможных вариантов представляет верхний куб, показанный с другого ракурса? Каждая грань куба уникальна и не повторяется.",
          image: 'https://i.imgur.com/cNQ8KeM.png',
          answers: [
            { text: "Ответ 1", correct: false },
            { text: "Ответ 2", correct: true },
            { text: "Ответ 3", correct: false },
            { text: "Ответ 4", correct: false }
          ]
        },
        {
          questionText: "Вверху представлена фигура. Из следующих 5 вариантов выберите один, изображающий ту же фигуру.",
          image: 'https://i.imgur.com/f8YXPFo.png',
          answers: [
            { text: "Ответ 1", correct: false },
            { text: "Ответ 2", correct: false },
            { text: "Ответ 3", correct: false },
            { text: "Ответ 4", correct: false },
            { text: "Ответ 5", correct: true }
          ]
        },
        {
          questionText: "Укажите правильную комбинацию фигур после вращения верхней модели (обе точки должны располагаться в тех же углах).",
          image: 'https://i.imgur.com/bxyxhiK.png',
          answers: [
            { text: "Ответ 1", correct: false },
            { text: "Ответ 2", correct: true },
            { text: "Ответ 3", correct: false },
            { text: "Ответ 4", correct: false },
            { text: "Ответ 5", correct: false }
          ]
        },
        {
          questionText: "Какое изображение (1-4) является зеркальным отражением верхней фигуры?",
          image: 'https://i.imgur.com/jQKYhTb.png',
          answers: [
            { text: "Ответ 1", correct: true },
            { text: "Ответ 2", correct: false },
            { text: "Ответ 3", correct: false },
            { text: "Ответ 4", correct: false }
          ]
        },
        {
          questionText: "При правильном соединении верхние части головоломки создадут одну из следующих фигур (А- Е). Обратите внимание, что стороны, которые обозначены одинаковыми буквами (х, y, z), должны соприкасаться между собой. Выберите правильный ответ.",
          image: 'https://i.imgur.com/Ow2CPN0.jpeg',
          answers: [
            { text: "Ответ 1", correct: false },
            { text: "Ответ 2", correct: true },
            { text: "Ответ 3", correct: false },
            { text: "Ответ 4", correct: false },
            { text: "Ответ 5", correct: false }
          ]
        },
        {
          questionText: "Какая из следующих фигур находится внутри квадрата?",
          image: 'https://i.imgur.com/9jfrflF.png',
          answers: [
            { text: "Ответ 1", correct: false },
            { text: "Ответ 2", correct: false },
            { text: "Ответ 3", correct: false },
            { text: "Ответ 4", correct: true },
            { text: "Ответ 5", correct: false }
          ]
        },
        {
          questionText: "Какая фигура (1-5) получится при сложении данного шаблона бумаги? Выберите правильный ответ.",
          image: 'https://i.imgur.com/PWciq7V.png',
          answers: [
            { text: "Ответ 1", correct: false },
            { text: "Ответ 2", correct: false },
            { text: "Ответ 3", correct: true },
            { text: "Ответ 4", correct: false },
            { text: "Ответ 5", correct: false }
          ]
        }
      ]
    };
  },
  methods: {
    startTest() {
      this.testStarted = true;
      this.currentQuestionIndex = 0;
      this.correctAnswers = 0;
      this.mistakes = [];
      this.testFinished = false;
      this.selectedAnswers = {};
      this.$emit('test-start');
    },
    
    selectAnswer(index) {
      const question = this.questions[this.currentQuestionIndex];
      const isCorrect = question.answers[index].correct;
      
      // Если ответ правильный, увеличиваем счетчик
      if (isCorrect) {
        this.correctAnswers++;
      } else {
        // Сохраняем информацию об ошибке
        this.mistakes.push({
          questionIndex: this.currentQuestionIndex,
          selectedAnswer: question.answers[index].text,
          correctAnswer: question.answers.find(ans => ans.correct).text
        });
      }
      
      // Переходим к следующему вопросу
      this.nextQuestion();
    },
    
    nextQuestion() {
      this.currentQuestionIndex++;
      if (this.currentQuestionIndex >= this.questions.length) {
        this.finishTest();
      }
    },
    
    finishTest() {
      this.testFinished = true;
      this.$emit('test-complete', this.correctAnswers, this.questions.length);
    },
    
    restartTest() {
      this.startTest();
    }
  }
};
</script>

<style scoped>
.spatial-test {
  max-width: 800px;
  margin: 0 auto;
  padding: 0;
  font-family: 'Roboto', sans-serif;
  position: relative;
  overflow: hidden;
  height: 100%;
}

/* Стили начального экрана */
.intro-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
  background-color: white;
}

.intro-content {
  max-width: 500px;
}

.intro-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  background-color: #ebe9fe;
  border-radius: 50%;
  margin-bottom: 1rem;
  color: #4f46e5;
}

.intro-screen h2 {
  color: #4f46e5;
  font-size: 28px;
  margin-bottom: 1rem;
}

.intro-screen p {
  color: #4b5563;
  margin-bottom: 2rem;
  font-size: 16px;
  line-height: 1.5;
}

/* Стили экрана вопроса */
.question-screen {
  position: relative;
  padding: 0;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
}

.progress-bar {
  height: 6px;
  background-color: #e5e7eb;
  width: 100%;
}

.progress-indicator {
  height: 100%;
  background-color: #4f46e5;
  transition: width 0.3s ease;
}

.question-counter {
  padding: 1rem;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
  border-bottom: 1px solid #f3f4f6;
}

.question-container {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.question-text {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
  text-align: center;
}

.question-image-container {
  width: 100%;
  max-width: 600px;
  margin-bottom: 1.5rem;
  background-color: #f3f4f7;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;
}

.question-image {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.answer-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  width: 100%;
  max-width: 600px;
}

.option-button {
  padding: 0.875rem 1rem;
  background-color: #f3f4f7;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.option-button:hover {
  background-color: #ebe9fe;
  border-color: #4f46e5;
  color: #4f46e5;
}

/* Стили экрана результатов */
.results-screen {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: white;
  border-radius: 12px;
}

.results-content {
  max-width: 600px;
}

.results-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  background-color: #fee2e2;
  border-radius: 50%;
  margin-bottom: 1.5rem;
  color: #ef4444;
}

.results-icon.high-score {
  background-color: #dcfce7;
  color: #10b981;
}

.results-title {
  color: #1f2937;
  font-size: 24px;
  margin-bottom: 1.5rem;
}

.score-display {
  margin-bottom: 1.5rem;
}

.score-circle {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
  background-color: #ebe9fe;
  border-radius: 50%;
  margin-bottom: 0.5rem;
  position: relative;
}

.score-value {
  font-size: 40px;
  font-weight: 700;
  color: #4f46e5;
}

.score-total {
  font-size: 20px;
  color: #6b7280;
  position: absolute;
  top: 50%;
  right: 30px;
}

.score-label {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

.result-message {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f3f4f7;
  border-radius: 8px;
}

.result-message p {
  margin: 0;
  color: #4b5563;
  font-size: 16px;
  line-height: 1.5;
}

.mistakes-container {
  margin-bottom: 1.5rem;
  width: 100%;
  text-align: left;
}

.mistakes-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.mistakes-list {
  background-color: #f3f4f7;
  border-radius: 8px;
  padding: 1rem;
  list-style-type: none;
}

.mistake-item {
  margin-bottom: 0.75rem;
  font-size: 14px;
  color: #4b5563;
  padding-left: 1.5rem;
  position: relative;
}

.mistake-item:last-child {
  margin-bottom: 0;
}

.mistake-item::before {
  content: "•";
  position: absolute;
  left: 0.5rem;
  color: #ef4444;
}

.action-button {
  padding: 0.75rem 1.5rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.action-button:hover {
  background-color: #4338ca;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 640px) {
  .intro-screen h2, .results-title {
    font-size: 22px;
  }
  
  .intro-screen p, .question-text, .result-message p {
    font-size: 14px;
  }
  
  .score-circle {
    width: 100px;
    height: 100px;
  }
  
  .score-value {
    font-size: 32px;
  }
  
  .score-total {
    font-size: 18px;
    right: 25px;
  }
  
  .intro-icon, .results-icon {
    width: 60px;
    height: 60px;
  }
  
  .answer-options {
    grid-template-columns: 1fr;
  }
}
</style>