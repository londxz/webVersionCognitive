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
        <h2>Тест на реакцию</h2>
        <p>Проверьте скорость своей реакции! Вам предстоит выполнить 5 попыток. Нажмите на круг, как только он станет зелёным. Действуйте быстро, но не торопитесь - если нажмёте слишком рано, попытка не засчитается.</p>
        <button @click="startTest" class="action-button">Начать тест</button>
      </div>
    </div>

    <!-- Экран с тестом -->
    <div v-else-if="!testCompleted" class="question-screen">
      <div class="progress-bar">
        <div class="progress-indicator" :style="{ width: `${(currentAttempt / totalAttempts) * 100}%` }"></div>
      </div>
      
      <div class="question-counter">
        Попытка {{ currentAttempt }}/{{ totalAttempts }}
      </div>

      <div class="question-container">
        <div 
          class="circle-container"
          @click="handleClick"
        >
          <div
            :class="['reaction-circle', isGreen ? 'green' : isWaiting ? 'red' : 'neutral']"
          >
            <p v-if="!isGreen && !isWaiting">Нажмите, чтобы начать</p>
            <p v-if="!isGreen && isWaiting">Ждите зеленый...</p>
            <p v-if="isGreen">Нажмите!</p>
          </div>
        </div>
        
        <div v-if="lastReactionTime !== null" class="feedback-message">
          <p class="last-time">Ваше время реакции: <strong>{{ lastReactionTime }} мс</strong></p>
        </div>
        
        <div v-if="tooSoonMessage" class="error-message">
          <p>Слишком рано! Дождитесь, пока круг станет зеленым.</p>
        </div>
      </div>
    </div>

    <!-- Экран с результатами -->
    <div v-if="testCompleted" class="results-screen">
      <div class="results-content">
        <div class="results-icon" :class="{ 'high-score': averageReactionTime < 300 }">
          <svg v-if="averageReactionTime < 300" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
            <span class="score-value">{{ averageReactionTime }}</span>
            <span class="score-label-small">мс</span>
          </div>
          <p class="score-label">среднее время реакции</p>
        </div>
        
        <div class="result-stats">
          <div class="stat-item">
            <span class="stat-label">Лучшее время:</span>
            <span class="stat-value">{{ bestReactionTime }} мс</span>
          </div>
        </div>
        
        <div class="result-message">
          <p v-if="averageReactionTime < 200">Невероятно быстрая реакция! Это уровень профессиональных спортсменов.</p>
          <p v-else-if="averageReactionTime < 250">Отличная реакция! Вы быстрее большинства людей.</p>
          <p v-else-if="averageReactionTime < 300">Хорошая реакция, выше среднего.</p>
          <p v-else-if="averageReactionTime < 350">Ваша реакция на уровне среднего человека.</p>
          <p v-else>Ваша реакция немного ниже среднего. Регулярные тренировки помогут её улучшить!</p>
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
      isGreen: false,
      isWaiting: false,
      currentAttempt: 1,
      totalAttempts: 5,
      reactionTimes: [],
      lastReactionTime: null,
      tooSoonMessage: false,
      timeoutId: null,
      startTime: 0,
      testCompleted: false
    };
  },
  computed: {
    averageReactionTime() {
      if (this.reactionTimes.length === 0) return 0;
      const sum = this.reactionTimes.reduce((a, b) => a + b, 0);
      return Math.round(sum / this.reactionTimes.length);
    },
    bestReactionTime() {
      if (this.reactionTimes.length === 0) return 0;
      return Math.min(...this.reactionTimes);
    }
  },
  methods: {
    startTest() {
      this.testStarted = true;
      this.testCompleted = false;
      this.currentAttempt = 1;
      this.reactionTimes = [];
      this.lastReactionTime = null;
      this.$emit('test-start');
    },
    
    startNextAttempt() {
      this.isGreen = false;
      this.isWaiting = true;
      this.tooSoonMessage = false;
      this.lastReactionTime = null;

      // Случайная задержка от 2 до 5 секунд
      const randomDelay = Math.floor(Math.random() * 3000) + 2000;
      
      this.timeoutId = setTimeout(() => {
        this.isGreen = true;
        this.isWaiting = false;
        this.startTime = performance.now();
      }, randomDelay);
    },
    
    handleClick() {
      if (!this.testStarted) {
        return;
      }
      
      if (!this.isWaiting && !this.isGreen) {
        // Начинаем попытку
        this.startNextAttempt();
      } else if (this.isWaiting) {
        // Слишком рано нажали
        clearTimeout(this.timeoutId);
        this.isWaiting = false;
        this.tooSoonMessage = true;
        
        // Автоматически начинаем новую попытку через 2 секунды
        setTimeout(() => {
          this.tooSoonMessage = false;
          this.startNextAttempt();
        }, 2000);
      } else if (this.isGreen) {
        // Правильно нажали на зеленый
        const reactionTime = Math.round(performance.now() - this.startTime);
        this.reactionTimes.push(reactionTime);
        this.lastReactionTime = reactionTime;
        this.isGreen = false;

        // Если не последняя попытка
        if (this.currentAttempt < this.totalAttempts) {
          this.currentAttempt++;
          
          // Автоматически начинаем следующую попытку через 2 секунды
          setTimeout(() => {
            this.startNextAttempt();
          }, 2000);
        } else {
          // Тест завершен
          this.testCompleted = true;
          this.$emit('test-complete', this.reactionTimes.length > 0 ? Math.floor(1000 / this.averageReactionTime * 5) : 0);
        }
      }
    },
    
    restartTest() {
      this.startTest();
    }
  },
  
  beforeUnmount() {
    clearTimeout(this.timeoutId);
  }
};
</script>

<style>
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

.circle-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1.5rem 0;
  width: 100%;
}

.reaction-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: white;
  font-weight: 600;
  transition: background-color 0.1s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 1rem;
}

.reaction-circle.neutral {
  background-color: #9ca3af;
}

.reaction-circle.red {
  background-color: #ef4444;
}

.reaction-circle.green {
  background-color: #10b981;
}

.reaction-circle:hover {
  transform: scale(1.02);
}

.reaction-circle:active {
  transform: scale(0.98);
}

.feedback-message {
  margin-top: 1rem;
  color: #4b5563;
  font-size: 18px;
  text-align: center;
}

.last-time {
  background-color: #f3f4f6;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  display: inline-block;
}

.error-message {
  margin-top: 1rem;
  background-color: #fee2e2;
  color: #ef4444;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-align: center;
  width: 80%;
  max-width: 400px;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
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
  margin-bottom: 1.5rem;
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
  font-size: 36px;
  font-weight: 700;
  color: #3b4ce2;
}

.score-label-small {
  font-size: 16px;
  color: #6b7280;
  position: absolute;
  bottom: 30px;
  right: 25px;
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

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
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
    font-size: 28px;
  }
  
  .score-label-small {
    font-size: 14px;
    bottom: 30px;
    right: 20px;
  }
  
  .intro-icon, .results-icon {
    width: 60px;
    height: 60px;
  }
  
  .reaction-circle {
    width: 150px;
    height: 150px;
    font-size: 14px;
  }
  
  .feedback-message {
    font-size: 16px;
  }
}
</style>