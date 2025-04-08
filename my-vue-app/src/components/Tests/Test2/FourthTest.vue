<template>
  <div class="memory-test">
    <!-- Начальный экран -->
    <div v-if="!testStarted" class="intro-screen">
      <div class="intro-content">
        <div class="intro-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2"></rect>
          <path d="M8 2v4"></path>
          <path d="M16 2v4"></path>
          <circle cx="12" cy="11" r="3"></circle>
          <path d="M12 14v4"></path>
        </svg>
        </div>
        <h2>Тест на запоминание чисел</h2>
        <p>Проверьте свою кратковременную память. Запомните числа на экране, затем введите их по порядку.</p>
        
        <div class="instruction-box">
          <h3>Как проходить тест:</h3>
          <ol>
            <li>Вам будут показаны числа, которые нужно запомнить</li>
            <li>Время на запоминание ограничено</li>
            <li>Сложность будет постепенно повышаться</li>
            <li>После исчезновения чисел, введите их в том же порядке</li>
          </ol>
        </div>
        
        <button @click="startTest" class="action-button">Начать тест</button>
      </div>
    </div>

    <!-- Экран с тестом -->
    <div v-else class="question-screen">
      <div class="progress-bar">
        <div class="progress-indicator" :style="{ width: `${(currentLevel / maxLevels) * 100}%` }"></div>
      </div>
      
      <div class="question-counter">
        Уровень {{ currentLevel }}/{{ maxLevels }}
      </div>

      <div class="question-container">
        <div v-if="showNumbers" class="memory-phase">
          <h3 class="phase-title">Запомните эти числа</h3>
          <div class="numbers-grid" :class="getGridClass()">
            <div v-for="(number, index) in visibleNumbers" :key="index" class="number-item">
              {{ number }}
            </div>
          </div>
          <div class="timer-display">
            <p>Оставшееся время: {{ remainingTime }} сек</p>
          </div>
        </div>
        <div v-else class="recall-phase">
          <h3 class="phase-title">Введите запомненные числа</h3>
          <div class="input-grid" :class="getGridClass()">
            <div v-for="(_, index) in currentLevelNumbers" :key="'input-' + index" class="input-container">
              <input
                type="number"
                v-model="inputs[index]"
                placeholder="?"
                class="number-input"
                inputmode="numeric"
                pattern="[0-9]*"
              />
            </div>
          </div>
          <button @click="checkAnswers" class="action-button">Проверить</button>
        </div>
      </div>
      
      <!-- Результаты уровня -->
      <div v-if="showLevelResult" class="level-result">
        <div class="level-result-content">
          <div class="result-icon" :class="{ 'success': lastLevelSuccess }">
            <svg v-if="lastLevelSuccess" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          
          <h3 class="level-result-title">
            {{ lastLevelSuccess ? 'Правильно!' : 'Неверно!' }}
          </h3>
          
          <div class="numbers-comparison">
            <div class="original-numbers">
              <h4>Исходные числа:</h4>
              <p>{{ currentLevelNumbers.join(', ') }}</p>
            </div>
            
            <div class="your-answer">
              <h4>Ваш ответ:</h4>
              <p>{{ formatInputs() }}</p>
            </div>
          </div>
          
          <button 
            v-if="currentLevel < maxLevels && lastLevelSuccess" 
            @click="nextLevel" 
            class="action-button"
          >
            Следующий уровень
          </button>
          <button 
            v-else-if="currentLevel < maxLevels && !lastLevelSuccess" 
            @click="retryLevel" 
            class="retry-button"
          >
            Повторить уровень
          </button>
          <button 
            v-else 
            @click="finishTest" 
            class="action-button"
          >
            Завершить тест
          </button>
        </div>
      </div>
    </div>

    <!-- Экран с итоговыми результатами -->
    <div v-if="gameOver" class="results-screen">
      <div class="results-content">
        <div class="results-icon" :class="{ 'high-score': score >= (maxLevels * 0.7) }">
          <svg v-if="score >= (maxLevels * 0.7)" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
            <span class="score-total">/{{ maxLevels }}</span>
          </div>
          <p class="score-label">пройденных уровней</p>
        </div>
        
        <div class="memory-span">
          <h3>Объем вашей памяти:</h3>
          <p class="memory-span-value">{{ getMemorySpan() }}</p>
        </div>
        
        <div class="result-message">
          <p v-if="score >= maxLevels * 0.9">Отличный результат! У вас исключительная память.</p>
          <p v-else-if="score >= maxLevels * 0.7">Хороший результат! Ваша память работает отлично.</p>
          <p v-else-if="score >= maxLevels * 0.5">Неплохой результат. Есть потенциал для улучшения.</p>
          <p v-else>Память можно тренировать! Регулярные упражнения помогут улучшить результаты.</p>
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
      showNumbers: true,
      showLevelResult: false,
      lastLevelSuccess: false,
      gameOver: false,
      currentLevel: 1,
      maxLevels: 8,
      score: 0,
      currentLevelNumbers: [],
      inputs: [],
      remainingTime: 0,
      timer: null,
      attempts: 0
    };
  },
  computed: {
    visibleNumbers() {
      return this.currentLevelNumbers;
    }
  },
  methods: {
    startTest() {
      this.testStarted = true;
      this.gameOver = false;
      this.showLevelResult = false;
      this.currentLevel = 1;
      this.score = 0;
      this.attempts = 0;
      this.generateLevel();
      this.$emit('test-start');
    },
    
    generateLevel() {
      // Определяем количество чисел в зависимости от уровня
      // Начинаем с 3 чисел и постепенно увеличиваем
      const numbersCount = Math.min(2 + this.currentLevel, 10);
      
      // Определяем диапазон чисел в зависимости от уровня
      // Уровни 1-3: однозначные числа (1-9)
      // Уровни 4-6: двузначные числа до 50
      // Уровни 7+: двузначные числа до 99
      let maxNumber = 9;
      if (this.currentLevel >= 4 && this.currentLevel <= 6) {
        maxNumber = 50;
      } else if (this.currentLevel >= 7) {
        maxNumber = 99;
      }
      
      // Генерируем новые случайные числа
      this.currentLevelNumbers = Array(numbersCount).fill(0).map(() => {
        return Math.floor(Math.random() * maxNumber) + 1;
      });
      
      // Сбрасываем ввод
      this.inputs = Array(numbersCount).fill(null);
      
      // Показываем числа
      this.showNumbers = true;
      this.showLevelResult = false;
      
      // Запускаем таймер для запоминания
      // Время увеличивается с количеством чисел
      this.remainingTime = Math.min(5 + numbersCount, 15);
      this.startTimer();
    },
    
    startTimer() {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.remainingTime--;
        if (this.remainingTime <= 0) {
          clearInterval(this.timer);
          this.showNumbers = false;
        }
      }, 1000);
    },
    
    checkAnswers() {
      const correct = this.currentLevelNumbers.every((num, index) => {
        return num === Number(this.inputs[index]);
      });
      
      this.lastLevelSuccess = correct;
      this.showLevelResult = true;
      
      if (correct) {
        this.score = this.currentLevel;
      }
      
      this.attempts++;
    },
    
    formatInputs() {
      return this.inputs.map(input => input === null || input === '' ? '?' : input).join(', ');
    },
    
    nextLevel() {
      this.currentLevel++;
      this.generateLevel();
    },
    
    retryLevel() {
      this.generateLevel();
    },
    
    finishTest() {
      this.gameOver = true;
      this.$emit('test-complete', this.score, this.maxLevels);
    },
    
    restartTest() {
      this.startTest();
    },
    
    getGridClass() {
      // Определяем количество колонок в зависимости от количества чисел
      const count = this.currentLevelNumbers.length;
      if (count <= 4) return 'grid-cols-2';
      if (count <= 9) return 'grid-cols-3';
      return 'grid-cols-4';
    },
    
    getMemorySpan() {
      if (this.score === 0) return "Менее 3 чисел";
      return `${this.score + 2} ${this.getNumberLabel(this.score + 2)}`;
    },
    
    getNumberLabel(number) {
      // Правильное склонение слова "число"
      const lastDigit = number % 10;
      const lastTwoDigits = number % 100;
      
      if (lastDigit === 1 && lastTwoDigits !== 11) {
        return "число";
      } else if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) {
        return "числа";
      } else {
        return "чисел";
      }
    }
  },
  beforeUnmount() {
    clearInterval(this.timer);
  }
};
</script>

<style>
.memory-test {
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
  background-color: #e8f4f2;
  border-radius: 50%;
  margin-bottom: 1rem;
  color: #14b8a6;
}

.intro-screen h2 {
  color: #14b8a6;
  font-size: 28px;
  margin-bottom: 1rem;
}

.intro-screen p {
  color: #4b5563;
  margin-bottom: 1rem;
  font-size: 16px;
  line-height: 1.5;
}

.instruction-box {
  background-color: #e8f4f2;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: left;
  border-left: 4px solid #14b8a6;
}

.instruction-box h3 {
  color: #14b8a6;
  margin-bottom: 0.75rem;
  font-size: 18px;
}

.instruction-box ol {
  padding-left: 1.25rem;
  margin-bottom: 0.5rem;
}

.instruction-box li {
  margin-bottom: 0.5rem;
  color: #4b5563;
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
  background-color: #14b8a6;
  transition: width 0.3s ease;
}

.question-counter {
  padding: 1rem;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
  border-bottom: 1px solid #f3f4f6;
  font-weight: 600;
}

.question-container {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.phase-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
  text-align: center;
}

.numbers-grid, .input-grid {
  display: grid;
  gap: 12px;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 500px;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

.number-item {
  background-color: #f3f9f8;
  border: 1px solid #a7e1db;
  color: #14b8a6;
  padding: 15px;
  font-size: 24px;
  font-weight: 600;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.input-container {
  width: 100%;
}

.number-input {
  width: 100%;
  padding: 14px 10px;
  font-size: 18px;
  text-align: center;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  color: #1f2937;
  background-color: white;
  outline: none;
  transition: all 0.3s;
}

.number-input:focus {
  border-color: #14b8a6;
  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.2);
}

.timer-display {
  margin-top: 1rem;
  font-size: 16px;
  color: #4b5563;
  font-weight: 500;
  background-color: #f3f9f8;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: 1px solid #a7e1db;
}

/* Стили для показа результатов по уровню */
.level-result {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.level-result-content {
  background-color: white;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.result-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.result-icon.success {
  background-color: #dcfce7;
  color: #10b981;
}

.result-icon:not(.success) {
  background-color: #fee2e2;
  color: #ef4444;
}

.level-result-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.numbers-comparison {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  text-align: left;
}

.original-numbers, .your-answer {
  padding: 0.5rem;
}

.original-numbers h4, .your-answer h4 {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.original-numbers p, .your-answer p {
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
}

.retry-button {
  padding: 0.75rem 1.5rem;
  background-color: #f3f4f6;
  color: #1f2937;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-button:hover {
  background-color: #e5e7eb;
  border-color: #9ca3af;
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
  z-index: 100;
}

.results-content {
  max-width: 500px;
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
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
  background-color: #f3f9f8;
  border-radius: 50%;
  margin-bottom: 0.5rem;
  position: relative;
}

.score-value {
  font-size: 40px;
  font-weight: 700;
  color: #14b8a6;
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

.memory-span {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f3f9f8;
  border-radius: 8px;
  border: 1px solid #a7e1db;
}

.memory-span h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.memory-span-value {
  font-size: 24px;
  font-weight: 700;
  color: #14b8a6;
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
  background-color: #14b8a6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.action-button:hover {
  background-color: #0d9488;
}

.action-button:active {
  transform: translateY(1px);
}

/* Адаптивность для мобильных устройств */
@media (max-width: 640px) {
  .intro-screen h2, .results-title, .level-result-title {
    font-size: 22px;
  }
  
  .intro-screen p, .phase-title, .result-message p {
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
  
  .numbers-grid, .input-grid {
    gap: 8px;
  }
  
  .number-item {
    padding: 10px;
    font-size: 20px;
  }
  
  .number-input {
    padding: 10px 8px;
    font-size: 16px;
  }
  
  .memory-span-value {
    font-size: 20px;
  }
  
  .instruction-box {
    padding: 1rem;
  }
  
  .instruction-box h3 {
    font-size: 16px;
  }
  
  .instruction-box ol {
    padding-left: 1rem;
  }
  
  .numbers-comparison {
    padding: 0.75rem;
  }
  
  .level-result-content {
    padding: 1.5rem;
  }
}
</style>