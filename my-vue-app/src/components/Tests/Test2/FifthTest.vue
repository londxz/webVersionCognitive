<template>
  <div class="stroop-test">
    <!-- Экран с правилами -->
    <div v-if="showRules" class="intro-screen">
      <div class="intro-content">
        <div class="intro-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </div>
        <h2>Тест Струпа</h2>
        <p>В этом тесте вам будут показаны названия цветов, написанные разными цветами. Ваша задача: выбрать цвет, <strong>которым написано слово</strong>, а не тот цвет, который обозначает само слово.</p>
        
        <div class="test-example">
          <h3>Пример:</h3>
          <p class="example-text" style="color: blue; font-size: 24px; font-weight: bold;">Красный</p>
          <p>В этом примере правильный ответ: <strong>Синий</strong>, так как слово написано синим цветом, хотя само слово обозначает "красный".</p>
        </div>
        
        <p>Тест состоит из 15 заданий. Старайтесь отвечать быстро и точно.</p>
        <button class="action-button" @click="startTest">Начать тест</button>
      </div>
    </div>

    <!-- Экран с тестом -->
    <div v-else-if="currentQuestion < questions.length && !isTimeUp" class="question-screen">
      <div class="progress-bar">
        <div class="progress-indicator" :style="{ width: `${(currentQuestion / questions.length) * 100}%` }"></div>
      </div>
      
      <div class="question-counter">
        Вопрос {{ currentQuestion + 1 }} из {{ questions.length }}
      </div>

      <div class="question-container">
        <p class="stroop-word" :style="{ color: questions[currentQuestion].colorValue }">
          {{ questions[currentQuestion].word }}
        </p>
        
        <h3 class="question-text">Выберите ЦВЕТ, которым написано слово:</h3>
        
        <div class="stroop-options">
          <button 
            v-for="(colorName, index) in colors" 
            :key="colorName" 
            @click="submitAnswer(colorValues[index])"
            class="option-button"
          >
            {{ colorName }}
          </button>
        </div>
      </div>
    </div>

    <!-- Экран с результатами -->
    <div v-else class="results-screen">
      <div class="results-content">
        <div class="results-icon" :class="{ 'high-score': score >= 70 }">
          <svg v-if="score >= 70" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 15h8M10 9h.01M14 9h.01"></path>
          </svg>
        </div>
        
        <h2 class="results-title">Результаты теста Струпа</h2>
        
        <div class="score-display">
          <div class="score-circle">
            <span class="score-value">{{ score }}</span>
            <span class="score-label-small">%</span>
          </div>
          <p class="score-label">правильных ответов</p>
        </div>
        
        <div class="result-stats">
          <div class="stat-item">
            <span class="stat-label">Правильные ответы:</span>
            <span class="stat-value">{{ correctAnswers }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Всего вопросов:</span>
            <span class="stat-value">{{ questions.length }}</span>
          </div>
        </div>
        
        <div class="result-message">
          <p v-if="score >= 90">Отличный результат! У вас исключительная способность игнорировать отвлекающие стимулы.</p>
          <p v-else-if="score >= 70">Хороший результат! Ваша концентрация внимания выше среднего.</p>
          <p v-else-if="score >= 50">Неплохой результат. Есть потенциал для улучшения концентрации внимания.</p>
          <p v-else>Концентрацию внимания можно тренировать! Регулярные упражнения помогут улучшить результаты.</p>
        </div>
        
        <div class="action-buttons">
          <button @click="retryTest" class="action-button">Пройти тест снова</button>
          <button @click="showResultsTable = !showResultsTable" class="secondary-button">
            {{ showResultsTable ? 'Скрыть детали' : 'Показать детали' }}
          </button>
        </div>
        
        <!-- Таблица с результатами -->
        <div v-if="showResultsTable" class="results-table-container">
          <table class="results-table">
            <thead>
              <tr>
                <th>№</th>
                <th>Слово</th>
                <th>Цвет слова</th>
                <th>Ваш ответ</th>
                <th>Результат</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(question, index) in questionsWithAnswers" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ question.word }}</td>
                <td>{{ question.colorName }}</td>
                <td>{{ getColorNameByValue(question.userAnswer) }}</td>
                <td>
                  <span :class="{ 'correct': question.isCorrect, 'incorrect': !question.isCorrect }">
                    {{ question.isCorrect ? '✓' : '✗' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showRules: true,
      currentQuestion: 0,
      words: ['Красный', 'Зеленый', 'Синий', 'Желтый', 'Фиолетовый'],
      colorValues: ['red', 'green', 'blue', 'yellow', 'purple'],
      colors: ['Красный', 'Зеленый', 'Синий', 'Желтый', 'Фиолетовый'],
      questions: [],
      answers: [],
      isTimeUp: false,
      showResultsTable: false,
      questionsWithAnswers: [],
    };
  },
  created() {
    this.generateQuestions();
  },
  computed: {
    correctAnswers() {
      return this.answers.filter((answer, index) => answer === this.questions[index]?.colorValue).length;
    },
    score() {
      return this.answers.length === 0 ? 0 : Math.round((this.correctAnswers / this.answers.length) * 100);
    },
  },
  methods: {
    startTest() {
      this.showRules = false;
      this.currentQuestion = 0;
      this.answers = [];
      this.questionsWithAnswers = [];
      this.isTimeUp = false;
      this.showResultsTable = false;
      this.$emit('test-start');
    },
    
    generateQuestions() {
      const questions = [];
      for (let i = 0; i < 15; i++) {
        const word = this.words[Math.floor(Math.random() * this.words.length)];
        let colorIndex = Math.floor(Math.random() * this.colorValues.length);
        let colorValue = this.colorValues[colorIndex];
        
        // Проверяем, чтобы цвет текста не совпадал с его значением
        while (colorValue === this.getColorForWord(word)) {
          colorIndex = Math.floor(Math.random() * this.colorValues.length);
          colorValue = this.colorValues[colorIndex];
        } 
        
        questions.push({ 
          word, 
          colorValue,
          colorName: this.colors[colorIndex] 
        });
      }
      this.questions = this.shuffleQuestions(questions);
    },
    
    getColorForWord(word) {
      const index = this.words.indexOf(word);
      if (index !== -1) {
        return this.colorValues[index];
      }
      return '';
    },
    
    getColorNameByValue(colorValue) {
      const index = this.colorValues.indexOf(colorValue);
      if (index !== -1) {
        return this.colors[index];
      }
      return 'Неизвестно';
    },
    
    shuffleQuestions(questions) {
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }
      return questions;
    },
    
    submitAnswer(color) {
      // Сохраняем ответ и информацию для таблицы результатов
      this.answers.push(color);
      
      // Сохраняем детали для таблицы результатов
      this.questionsWithAnswers.push({
        word: this.questions[this.currentQuestion].word,
        colorName: this.getColorNameByValue(this.questions[this.currentQuestion].colorValue),
        userAnswer: color,
        isCorrect: color === this.questions[this.currentQuestion].colorValue
      });
      
      this.currentQuestion++;

      if (this.currentQuestion >= this.questions.length) {
        this.isTimeUp = true;
        this.$emit('test-complete', this.correctAnswers, this.questions.length);
      }
    },
    
    retryTest() {
      this.generateQuestions();
      this.startTest();
    }
  },
};
</script>

<style>
.stroop-test {
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
  max-width: 600px;
}

.intro-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  background-color: #f0f4ff;
  border-radius: 50%;
  margin-bottom: 1rem;
  color: #3b4ce2;
}

.intro-screen h2 {
  color: #3b4ce2;
  font-size: 28px;
  margin-bottom: 1rem;
}

.intro-screen p {
  color: #4b5563;
  margin-bottom: 1.5rem;
  font-size: 16px;
  line-height: 1.5;
}

.test-example {
  background-color: #f0f4ff;
  border-radius: 0.5rem;
  padding: 1rem 1.5rem;
  margin: 1rem 0 1.5rem;
  border-left: 4px solid #3b4ce2;
  text-align: left;
}

.test-example h3 {
  font-size: 18px;
  margin-bottom: 0.75rem;
  color: #1f2937;
}

.example-text {
  margin: 1rem 0;
  text-align: center;
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
  background-color: #3b4ce2;
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

.stroop-word {
  font-size: 48px;
  font-weight: 700;
  margin: 2rem 0;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.question-text {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
  text-align: center;
}

.stroop-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.option-button {
  padding: 0.75rem 1.5rem;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  color: #1f2937;
  min-width: 120px;
}

.option-button:hover {
  background-color: #e5e7eb;
  transform: translateY(-2px);
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
  max-width: 700px;
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
  margin-bottom: 1rem;
}

.score-circle {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
  background-color: #f0f4ff;
  border-radius: 50%;
  margin-bottom: 0.5rem;
  position: relative;
}

.score-value {
  font-size: 40px;
  font-weight: 700;
  color: #3b4ce2;
}

.score-label-small {
  font-size: 16px;
  color: #6b7280;
  position: absolute;
  top: 30px;
  right: 30px;
}

.score-label {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

.result-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.result-message {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 8px;
}

.result-message p {
  margin: 0;
  color: #4b5563;
  font-size: 16px;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.action-button {
  padding: 0.75rem 1.5rem;
  background-color: #3b4ce2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.action-button:hover {
  background-color: #2d3ebd;
}

.secondary-button {
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: #3b4ce2;
  border: 1px solid #3b4ce2;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.secondary-button:hover {
  background-color: #f0f4ff;
}

.action-button:active, .secondary-button:active {
  transform: translateY(1px);
}

/* Таблица результатов */
.results-table-container {
  margin-top: 1rem;
  max-width: 100%;
  overflow-x: auto;
}

.results-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 14px;
}

.results-table th, .results-table td {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  text-align: center;
}

.results-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #1f2937;
}

.results-table tr:nth-child(even) {
  background-color: #f9fafb;
}

.correct {
  color: #10b981;
  font-weight: bold;
}

.incorrect {
  color: #ef4444;
  font-weight: bold;
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
  
  .score-label-small {
    font-size: 14px;
    top: 30px;
    right: 25px;
  }
  
  .intro-icon, .results-icon {
    width: 60px;
    height: 60px;
  }
  
  .stroop-word {
    font-size: 36px;
    margin: 1.5rem 0;
  }
  
  .option-button {
    padding: 0.625rem 1rem;
    font-size: 14px;
    min-width: 100px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .test-example {
    padding: 0.75rem 1rem;
  }
  
  .result-stats {
    gap: 1rem;
  }
}
</style>