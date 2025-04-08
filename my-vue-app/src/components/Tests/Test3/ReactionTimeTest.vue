<template>
  <div class="reaction-test">
    <!-- Начальный экран -->
    <div v-if="!testStarted" class="intro-screen">
      <div class="intro-content">
        <div class="intro-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-16h-9l1-4z"></path>
          </svg>
        </div>
        <h2>Тест на время реакции</h2>
        <p>Проверьте скорость вашей реакции. Когда красный экран сменится на зеленый, нажмите как можно быстрее. Постарайтесь не нажимать преждевременно!</p>
        <button @click="startTest" class="action-button">Начать тест</button>
      </div>
    </div>

    <!-- Экран с тестом -->
    <div v-else class="question-screen">
      <div class="progress-bar">
        <div class="progress-indicator" :style="{ width: `${(attempts / maxAttempts) * 100}%` }"></div>
      </div>
      
      <div class="question-counter">
        Попытка {{ attempts }}/{{ maxAttempts }}
      </div>

      <div class="question-container">
        <div 
          class="reaction-box" 
          :class="stateClass" 
          @click="handleClick"
        >
          <p v-if="state === 'waiting'">Нажмите, чтобы начать</p>
          <p v-if="state === 'ready'">Ждите зелёного...</p>
          <p v-if="state === 'click'">Нажмите!</p>
          <p v-if="state === 'tooSoon'">Слишком рано!</p>
          <p v-if="state === 'result'">Ваше время: <span class="result-time">{{ reactionTime }} мс</span></p>
        </div>
        
        <div v-if="feedback" class="feedback-message" :class="getFeedbackClass()">
          {{ feedback }}
        </div>
      </div>
      
      <!-- Статистика попыток -->
      <div v-if="attempts > 0" class="stats-container">
        <h4 class="stats-title">Статистика:</h4>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">Попытки:</span>
            <span class="stat-value">{{ attempts }}/{{ maxAttempts }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Лучшее время:</span>
            <span class="stat-value">{{ bestTime }} мс</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Среднее время:</span>
            <span class="stat-value">{{ averageTime }} мс</span>
          </div>
        </div>
      </div>
      
      <!-- Экран с результатами -->
      <div v-if="showResults" class="results-screen">
        <div class="results-content">
          <div class="results-icon" :class="{ 'high-score': averageTime < 300 }">
            <svg v-if="averageTime < 300" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-16h-9l1-4z"></path>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          
          <h2 class="results-title">Результаты теста</h2>
          
          <div class="score-display">
            <div class="score-circle">
              <span class="score-value">{{ averageTime }}</span>
              <span class="score-unit">мс</span>
            </div>
            <p class="score-label">среднее время реакции</p>
          </div>
          
          <div class="result-stats">
            <div class="stat-item">
              <span class="stat-label">Лучшее время:</span>
              <span class="stat-value">{{ bestTime }} мс</span>
            </div>
          </div>
          
          <div class="result-message">
            <p v-if="averageTime < 200">Невероятная реакция! У вас скорость реакции профессионального спортсмена.</p>
            <p v-else-if="averageTime < 250">Великолепная реакция! Ваша скорость реакции значительно выше среднего.</p>
            <p v-else-if="averageTime < 300">Отличная реакция! Ваше время реакции выше среднего.</p>
            <p v-else-if="averageTime < 350">Хорошая реакция. Ваше время реакции на уровне среднего человека.</p>
            <p v-else>Скорость реакции можно улучшить тренировками. Регулярные упражнения помогут улучшить результаты.</p>
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
      state: 'waiting',
      startTime: 0,
      reactionTime: null,
      timeout: null,
      attempts: 0,
      maxAttempts: 5,
      timeHistory: [],
      feedback: '',
      showResults: false
    };
  },
  computed: {
    stateClass() {
      return {
        'waiting': this.state === 'waiting',
        'ready': this.state === 'ready',
        'click': this.state === 'click',
        'tooSoon': this.state === 'tooSoon',
        'result': this.state === 'result',
      };
    },
    bestTime() {
      if (this.timeHistory.length === 0) return 0;
      return Math.min(...this.timeHistory);
    },
    averageTime() {
      if (this.timeHistory.length === 0) return 0;
      const sum = this.timeHistory.reduce((acc, val) => acc + val, 0);
      return Math.round(sum / this.timeHistory.length);
    }
  },
  methods: {
    startTest() {
      this.testStarted = true;
      this.state = 'waiting';
      this.reactionTime = null;
      this.attempts = 0;
      this.timeHistory = [];
      this.feedback = '';
      this.showResults = false;
      this.$emit('test-start');
    },
    
    handleClick() {
      // Если тест не начат, игнорируем клик
      if (!this.testStarted) return;
      
      switch (this.state) {
        case 'waiting': {
          // Начинаем тест
          this.startNextAttempt();
          break;
        }
        
        case 'ready': {
          // Слишком рано нажал
          clearTimeout(this.timeout);
          this.state = 'tooSoon';
          this.feedback = 'Вы нажали слишком рано! Дождитесь, пока квадрат станет зеленым.';
          
          // Через 2 секунды возвращаемся в исходное состояние
          setTimeout(() => {
            this.state = 'waiting';
            this.feedback = '';
          }, 2000);
          break;
        }
        
        case 'click': {
          // Измеряем время реакции
          const reactionTime = Math.round(performance.now() - this.startTime);
          this.reactionTime = reactionTime;
          this.timeHistory.push(reactionTime);
          this.attempts++;
          this.state = 'result';
          
          // Добавляем отзыв о результате
          if (reactionTime < 200) {
            this.feedback = 'Невероятно быстро!';
          } else if (reactionTime < 300) {
            this.feedback = 'Очень хорошее время!';
          } else if (reactionTime < 400) {
            this.feedback = 'Хорошее время реакции.';
          } else {
            this.feedback = 'Неплохо, но можно быстрее.';
          }
          
          // Если это последняя попытка, показываем результаты
          if (this.attempts >= this.maxAttempts) {
            setTimeout(() => {
              this.showResults = true;
              this.$emit('test-complete', this.calculateScore());
            }, 2000);
          } else {
            // Иначе через 2 секунды начинаем следующую попытку
            setTimeout(() => {
              this.state = 'waiting';
              this.feedback = '';
            }, 2000);
          }
          break;
        }
        
        case 'result':
        case 'tooSoon': {
          // Игнорируем клики в этих состояниях
          break;
        }
      }
    },
    
    startNextAttempt() {
      this.state = 'ready';
      this.feedback = '';
      
      // Случайная задержка от 2 до 5 секунд
      const randomDelay = Math.floor(Math.random() * 3000) + 2000;
      
      this.timeout = setTimeout(() => {
        this.state = 'click';
        this.startTime = performance.now();
      }, randomDelay);
    },
    
    getFeedbackClass() {
      if (this.state === 'tooSoon') return 'error-feedback';
      if (this.reactionTime < 200) return 'excellent-feedback';
      if (this.reactionTime < 300) return 'good-feedback';
      if (this.reactionTime < 400) return 'average-feedback';
      return 'normal-feedback';
    },
    
    calculateScore() {
      // Преобразуем среднее время реакции в баллы по шкале от 1 до 10
      if (this.averageTime < 200) return 10;
      if (this.averageTime < 250) return 9;
      if (this.averageTime < 300) return 8;
      if (this.averageTime < 350) return 7;
      if (this.averageTime < 400) return 6;
      if (this.averageTime < 450) return 5;
      if (this.averageTime < 500) return 4;
      if (this.averageTime < 550) return 3;
      if (this.averageTime < 600) return 2;
      return 1;
    },
    
    restartTest() {
      this.startTest();
    }
  },
  
  beforeUnmount() {
    clearTimeout(this.timeout);
  }
};
</script>

<style scoped>
.reaction-test {
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
  background-color: #fde8eb;
  border-radius: 50%;
  margin-bottom: 1rem;
  color: #ec4899;
}

.intro-screen h2 {
  color: #ec4899;
  font-size: 28px;
  margin-bottom: 1rem;
}

.intro-screen p {
  color: #4b5563;
  margin-bottom: 2rem;
  font-size: 16px;
  line-height: 1.5;
}

/* Стили экрана с тестом */
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
  background-color: #ec4899;
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

.reaction-box {
  width: 300px;
  height: 300px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.1s ease;
  user-select: none;
}

.reaction-box p {
  font-size: 18px;
  font-weight: 600;
  color: white;
  text-align: center;
  padding: 1rem;
}

.reaction-box.waiting {
  background-color: #9ca3af;
}

.reaction-box.ready {
  background-color: #ef4444;
}

.reaction-box.click {
  background-color: #10b981;
}

.reaction-box.tooSoon {
  background-color: #f59e0b;
}

.reaction-box.result {
  background-color: #3b82f6;
}

.result-time {
  font-size: 1.25em;
  font-weight: 700;
}

.feedback-message {
  margin-top: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  text-align: center;
}

.error-feedback {
  background-color: #fee2e2;
  color: #b91c1c;
}

.excellent-feedback {
  background-color: #dcfce7;
  color: #15803d;
}

.good-feedback {
  background-color: #e0f2fe;
  color: #0369a1;
}

.average-feedback {
  background-color: #fef3c7;
  color: #92400e;
}

.normal-feedback {
  background-color: #f3f4f6;
  color: #4b5563;
}

/* Статистика попыток */
.stats-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto 1.5rem;
  padding: 0 1.5rem;
}

.stats-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  text-align: center;
}

.stats-grid {
  display: flex;
  justify-content: space-between;
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

/* Стили экрана результатов */
.results-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.results-content {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 500px;
  text-align: center;
  width: 90%;
}

.results-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  background-color: #fef9c3;
  border-radius: 50%;
  margin-bottom: 1.5rem;
  color: #ca8a04;
}

.results-icon.high-score {
  background-color: #fde8eb;
  color: #ec4899;
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
  background-color: #fde8eb;
  border-radius: 50%;
  margin-bottom: 0.5rem;
  position: relative;
}

.score-value {
  font-size: 28px;
  font-weight: 700;
  color: #ec4899;
}

.score-unit {
  font-size: 16px;
  color: #ec4899;
  opacity: 0.8;
  position: absolute;
  top: 65px;
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
  margin-bottom: 1.5rem;
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
  background-color: #ec4899;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.action-button:hover {
  background-color: #db2777;
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
    font-size: 24px;
  }
  
  .score-unit {
    font-size: 14px;
    top: 55px;
    right: 25px;
  }
  
  .intro-icon, .results-icon {
    width: 60px;
    height: 60px;
  }
  
  .reaction-box {
    width: 250px;
    height: 250px;
  }
  
  .reaction-box p {
    font-size: 16px;
  }
  
  .feedback-message {
    font-size: 14px;
    padding: 0.625rem 1rem;
  }
  
  .stats-grid {
    padding: 0.75rem;
  }
  
  .stat-item {
    padding: 0 0.375rem;
  }
  
  .stat-label {
    font-size: 10px;
  }
  
  .stat-value {
    font-size: 14px;
  }
}
</style>