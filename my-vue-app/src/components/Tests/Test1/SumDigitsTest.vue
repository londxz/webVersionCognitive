<template>
  <div class="sum-digits-test">
    <!-- Начальный экран -->
    <div v-if="!testStarted" class="intro-screen">
      <div class="intro-content">
        <div class="intro-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 7l4-2.5 4 2.5 4-2.5 4 2.5"></path>
            <path d="M4 12l4-2.5 4 2.5 4-2.5 4 2.5"></path>
            <path d="M4 17l4-2.5 4 2.5 4-2.5 4 2.5"></path>
          </svg>
        </div>
        <h2>Тест на суммирование цифр</h2>
        <p>Проверьте свою математическую скорость и точность. Вам нужно будет сложить отдельные цифры в каждом ряду и ввести результат.</p>
        <button @click="startTest" class="action-button">Начать тест</button>
      </div>
    </div>

    <!-- Основной тест -->
    <div v-else-if="!resultsVisible" class="question-screen">
      <div class="progress-bar">
        <div class="progress-indicator" :style="{ width: '100%' }"></div>
      </div>
      
      <div class="question-counter">
        Задание: сложите цифры в каждом ряду
      </div>

      <div class="question-container">
        <div class="rows">
          <div v-for="(row, index) in rows" :key="index" class="row">
            <span class="number-row">{{ formatRow(row) }}</span>
            <input
              type="number"
              v-model.number="userAnswers[index]"
              class="answer-input"
              placeholder="Ответ"
            />
          </div>
        </div>
        
        <button @click="submitAnswers" class="action-button submit-button">Готово</button>
      </div>
    </div>

    <!-- Экран результатов -->
    <div v-if="resultsVisible" class="results-screen">
      <div class="results-content">
        <div class="results-icon" :class="{ 'high-score': correctAnswers >= 4 }">
          <svg v-if="correctAnswers >= 4" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
            <span class="score-total">/{{ rows.length }}</span>
          </div>
          <p class="score-label">правильных ответов</p>
        </div>
        
        <div class="result-message">
          <p v-if="correctAnswers === rows.length">Отлично! Вы безупречно справились со всеми заданиями.</p>
          <p v-else-if="correctAnswers >= rows.length * 0.7">Хороший результат! Вы уверенно справляетесь с арифметическими вычислениями.</p>
          <p v-else-if="correctAnswers >= rows.length * 0.5">Неплохой результат. Продолжайте тренировать ваши навыки счета.</p>
          <p v-else>Математические навыки можно улучшить регулярными тренировками. Попробуйте еще раз!</p>
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
      rows: [],
      userAnswers: [],
      correctAnswers: 0,
      resultsVisible: false,
      testStarted: false
    };
  },
  methods: {
    formatRow(row) {
      // Добавляем пробелы между цифрами для лучшей читаемости
      return row.split('').join(' ');
    },
    startTest() {
      this.testStarted = true;
      this.generateRows();
      this.$emit('test-start');
    },
    generateRows() {
      // Уменьшаем количество цифр в ряду до 6-8 и количество рядов до 5
      this.rows = Array.from({ length: 5 }, () =>
        Array.from({ length: 6 + Math.floor(Math.random() * 3) }, () => 
          Math.floor(Math.random() * 10)
        ).join("")
      );
      this.userAnswers = Array(this.rows.length).fill(null);
    },
    submitAnswers() {
      this.correctAnswers = this.rows.reduce((count, row, index) => {
        const correctSum = row
          .split("")
          .reduce((sum, digit) => sum + parseInt(digit), 0);
        return count + (this.userAnswers[index] === correctSum ? 1 : 0);
      }, 0);
      this.resultsVisible = true;
      this.$emit('test-complete', this.correctAnswers, 5);
    },
    restartTest() {
      this.generateRows();
      this.resultsVisible = false;
      this.correctAnswers = 0;
      this.$emit('test-start');
    },
  }
};
</script>

<style>
.sum-digits-test {
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

.rows {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 500px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.number-row {
  font-family: 'Courier New', monospace;
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: 0.2rem;
  color: #1f2937;
}

.answer-input {
  width: 80px;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1.25rem;
  text-align: center;
  transition: border-color 0.3s;
}

.answer-input:focus {
  outline: none;
  border-color: #3b4ce2;
  box-shadow: 0 0 0 2px rgba(59, 76, 226, 0.2);
}

.submit-button {
  margin-top: 1rem;
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
  background-color: #f9fafb;
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

.action-button:active {
  transform: translateY(1px);
}

/* Адаптивность для мобильных устройств */
@media (max-width: 640px) {
  .intro-screen h2, .results-title {
    font-size: 22px;
  }
  
  .intro-screen p, .result-message p {
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
  
  .number-row {
    font-size: 1.25rem;
  }
  
  .answer-input {
    width: 60px;
    padding: 0.5rem;
    font-size: 1rem;
  }
}
</style>