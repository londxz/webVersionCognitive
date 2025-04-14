<template>
  <div class="concentration-test">
    <!-- Начальный экран -->
    <div v-if="!testStarted" class="intro-screen">
      <div class="intro-content">
        <div class="intro-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </div>
        <h2>Тест на концентрацию внимания</h2>
        <p>Проверьте свою способность к длительной концентрации внимания. Вам будут показаны изображения, на которых нужно определить правильный ответ.</p>
        <button @click="startTest" class="action-button">Начать тест</button>
      </div>
    </div>

    <!-- Экран с тестом -->
    <div v-else-if="currentQuestion < questions.length" class="question-screen">
      <div class="progress-bar">
        <div class="progress-indicator" :style="{ width: `${(currentQuestion / questions.length) * 100}%` }"></div>
      </div>
      
      <div class="question-counter">
        Вопрос {{ currentQuestion + 1 }}/{{ questions.length }}
      </div>

      <div class="question-container">
        <h3 class="question-text">{{ currentQuestionData.question }}</h3>
        
        <div class="question-image-container">
          <img :src="currentQuestionData.image" alt="Вопрос" class="question-image" />
        </div>
        
        <div class="answer-options">
          <button 
            v-for="(answer, index) in currentQuestionData.answers" 
            :key="index"
            @click="checkAnswer(answer)" 
            class="option-button"
          >
            {{ answer.text }}
          </button>
        </div>
      </div>
    </div>

    <!-- Экран с результатами -->
    <div v-else class="results-screen">
      <div class="results-content">
        <div class="results-icon" :class="{ 'high-score': score >= questions.length * 0.7 }">
          <svg v-if="score >= questions.length * 0.7" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
            <span class="score-value">{{ score }}</span>
            <span class="score-total">/{{ questions.length }}</span>
          </div>
          <p class="score-label">правильных ответов</p>
        </div>
        
        <div class="result-message">
          <p v-if="score === questions.length">Отличный результат! Ваша концентрация внимания превосходна.</p>
          <p v-else-if="score >= questions.length * 0.7">Хороший результат! Ваша концентрация внимания на высоком уровне.</p>
          <p v-else-if="score >= questions.length * 0.5">Неплохой результат. Есть потенциал для улучшения концентрации.</p>
          <p v-else>Концентрацию внимания можно тренировать! Регулярные упражнения помогут улучшить результаты.</p>
        </div>
        
        <button @click="restartTest" class="action-button">Пройти тест снова</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      testStarted: false,
      currentQuestion: 0,
      score: 0,
      questions: [
        {
          image: 'https://i.imgur.com/zZTSx7k.jpeg',
          question: "Укажите правильный ответ",
          answers: [
            { text: '3', correct: false },
            { text: '5', correct: true },
            { text: '4', correct: false },
            { text: '2', correct: false },
          ],
        },
        {
          image: 'https://i.imgur.com/Em451ow.jpeg',
          question: "Укажите правильный ответ",
          answers: [
            { text: '3', correct: false },
            { text: '4', correct: true },
            { text: '5', correct: false },
            { text: '6', correct: false },
          ],
        },
        {
          image: 'https://i.imgur.com/tkAbQey.jpeg',
          question: "Укажите правильный ответ",
          answers: [
            { text: '3', correct: false },
            { text: '1', correct: false },
            { text: '2', correct: true },
            { text: '4', correct: false },
          ],
        },
        {
          image: 'https://i.imgur.com/G2TnE7W.jpeg',
          question: "Укажите правильный ответ",
          answers: [
            { text: '8', correct: false },
            { text: '7', correct: true },
            { text: '5', correct: false },
            { text: '6', correct: false },
          ],
        },
        {
          image: 'https://i.imgur.com/sfYYtqK.jpeg',
          question: "Укажите правильный ответ",
          answers: [
            { text: '4', correct: false },
            { text: '2', correct: false },
            { text: '1', correct: false },
            { text: '3', correct: true },
          ],
        },
      ],
    };
  },
  computed: {
    currentQuestionData() {
      return this.questions[this.currentQuestion];
    },
  },
  methods: {
    startTest() {
      this.testStarted = true;
      this.currentQuestion = 0;
      this.score = 0;
      this.$emit('test-start');
    },
    
    checkAnswer(answer) {
      if (answer.correct) {
        this.score++;
      }
      this.nextQuestion();
    },
    
    nextQuestion() {
      this.currentQuestion++;
      if (this.currentQuestion >= this.questions.length) {
        this.$emit('test-complete', this.score, this.questions.length);
      }
    },
    
    restartTest() {
      this.startTest();
    }
  }
};
</script>

<style scoped>
.concentration-test {
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
  background-color: #f0ecfc;
  border-radius: 50%;
  margin-bottom: 1rem;
  color: #8b5cf6;
}

.intro-screen h2 {
  color: #8b5cf6;
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
  background-color: #8b5cf6;
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
  max-width: 500px;
  margin-bottom: 1.5rem;
  background-color: #f9f7ff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.question-image {
  width: 100%;
  height: auto;
  border-radius: 4px;
  display: block;
}

.answer-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 500px;
}

.option-button {
  padding: 0.875rem 1rem;
  background-color: #f9f7ff;
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
  background-color: #f0ecfc;
  border-color: #8b5cf6;
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
  max-width: 500px;
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
  margin-bottom: 2rem;
}

.score-circle {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
  background-color: #f0ecfc;
  border-radius: 50%;
  margin-bottom: 0.5rem;
  position: relative;
}

.score-value {
  font-size: 40px;
  font-weight: 700;
  color: #8b5cf6;
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
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f9f7ff;
  border-radius: 8px;
}

.result-message p {
  margin: 0;
  color: #4b5563;
  font-size: 16px;
  line-height: 1.5;
}

.action-button {
  padding: 0.75rem 1.5rem;
  background-color: #8b5cf6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.action-button:hover {
  background-color: #7c3aed;
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