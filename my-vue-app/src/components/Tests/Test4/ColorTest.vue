<template>
  <div class="color-test">
    <!-- Начальный экран -->
    <div v-if="!testStarted" class="intro-screen">
      <div class="intro-content">
        <div class="intro-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="4" r="2"></circle>
            <circle cx="5" cy="12" r="2"></circle>
            <circle cx="19" cy="12" r="2"></circle>
            <circle cx="8" cy="20" r="2"></circle>
            <circle cx="16" cy="20" r="2"></circle>
            <path d="M12 6v4"></path>
            <path d="M7 12h10"></path>
            <path d="M9 18l-1-3"></path>
            <path d="M15 18l1-3"></path>
          </svg>
        </div>
        <h2>Тест на различие цветов</h2>
        <p>Проверьте свою способность различать тонкие оттенки цветов. Найдите квадрат, который отличается от остальных.</p>
        
        <div class="instruction-box">
          <h3>Как проходить тест:</h3>
          <ol>
            <li>Среди квадратов найдите тот, который отличается по цвету от остальных</li>
            <li>Нажмите на отличающийся квадрат</li>
            <li>С каждым уровнем различия в оттенках становятся менее заметными</li>
            <li>Будьте внимательны, цвета могут быть очень близкими!</li>
          </ol>
        </div>
        
        <button @click="startTest" class="action-button">Начать тест</button>
      </div>
    </div>

    <!-- Экран с игрой -->
    <div v-else-if="!testCompleted" class="question-screen">
      <div class="progress-bar">
        <div class="progress-indicator" :style="{ width: `${(currentLevel / maxLevels) * 100}%` }"></div>
      </div>
      
      <div class="question-counter">
        Уровень {{ currentLevel }}/{{ maxLevels }}
      </div>

      <div class="question-container">
        <h3 class="question-text">Выберите квадрат, который отличается от остальных:</h3>
        
        <div 
            class="color-grid" 
            :class="[getGridSizeClass(), { 'disabled': showFeedback }]"
          >
          <div 
            v-for="(color, index) in gridColors" 
            :key="index" 
            :style="{ backgroundColor: color }"
            :class="{ 
              'grid-item': true,
              'correct-item': showFeedback && index === correctIndex,
              'wrong-item': showFeedback && lastWrongIndex === index 
            }"
            @click="!showFeedback && checkAnswer(index)">
          </div>
        </div>
        
        <div v-if="showFeedback" class="feedback-message">
          <div v-if="lastAnswerCorrect" class="success-message">
            <p>✅ Правильно!</p>
            <button @click="nextLevel" class="action-button">Продолжить</button>
          </div>
          <div v-else class="error-message">
            <p>❌ Неверно! Попробуйте снова.</p>
            <button @click="tryAgain" class="action-button">Понятно</button>
          </div>
        </div>
        
        <div class="stats-bar">
          <div class="stat-item">
            <span class="stat-label">Верно:</span>
            <span class="stat-value correct">{{ correctAnswers }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Ошибки:</span>
            <span class="stat-value incorrect">{{ errorCount }}</span>
          </div>
        </div>
        
        <div class="skip-level">
          <button v-if="skipsRemaining > 0" @click="skipLevel" class="skip-button">
            Пропустить уровень ({{ skipsRemaining }} осталось)
          </button>
        </div>
      </div>
    </div>

    <!-- Экран результатов -->
    <div v-if="testCompleted" class="results-screen">
      <div class="results-content">
        <div class="results-icon" :class="{ 'high-score': score >= maxLevels * 0.7 }">
          <svg v-if="score >= maxLevels * 0.7" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
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
        
        <div class="result-stats">
          <div class="stat-item">
            <span class="stat-label">Правильные ответы:</span>
            <span class="stat-value">{{ correctAnswers }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Ошибки:</span>
            <span class="stat-value">{{ errorCount }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Точность:</span>
            <span class="stat-value">{{ accuracy }}%</span>
          </div>
        </div>
        
        <div class="result-message">
          <p v-if="score >= maxLevels * 0.9">Отличный результат! У вас исключительное цветовое восприятие.</p>
          <p v-else-if="score >= maxLevels * 0.7">Хороший результат! Вы хорошо различаете оттенки.</p>
          <p v-else-if="score >= maxLevels * 0.5">Неплохой результат. Есть потенциал для улучшения.</p>
          <p v-else>Цветовое восприятие можно тренировать! Регулярные упражнения помогут улучшить результаты.</p>
        </div>
        
        <button @click="restartTest" class="action-button">Пройти тест снова</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ColorTest',
  data() {
    return {
      testStarted: false,
      testCompleted: false,
      currentLevel: 1,
      maxLevels: 10,
      score: 0,
      gridColors: [],
      correctIndex: null,
      errorCount: 0,
      correctAnswers: 0,
      totalAttempts: 0,
      showFeedback: false,
      lastAnswerCorrect: false,
      lastWrongIndex: null,
      skipsRemaining: 2  // Пользователь может пропустить до 2 уровней
    };
  },
  computed: {
    accuracy() {
      if (this.totalAttempts === 0) return 0;
      // Ограничиваем точность до 100% (не более)
      return Math.min(100, Math.round((this.correctAnswers / this.totalAttempts) * 100));
    }
  },
  methods: {
    startTest() {
      this.testStarted = true;
      this.testCompleted = false;
      this.currentLevel = 1;
      this.score = 0;
      this.errorCount = 0;
      this.correctAnswers = 0;
      this.totalAttempts = 0;
      this.showFeedback = false;
      this.skipsRemaining = 2;
      this.generateGrid();
      this.$emit('test-start');
    },
    
    getGridSizeClass() {
      // Динамически определяем размер сетки в зависимости от уровня
      // Начинаем с 2x2, затем 3x3, затем 4x4
      if (this.currentLevel <= 3) return 'grid-small';
      if (this.currentLevel <= 6) return 'grid-medium';
      return 'grid-large';
    },
    
    getGridSize() {
      // Возвращает общее количество ячеек в сетке
      if (this.currentLevel <= 3) return 4; // 2x2
      if (this.currentLevel <= 6) return 9; // 3x3
      return 16; // 4x4
    },
    
    generateGrid() {
      // Базовая логика генерации цветов
      const baseColor = this.randomColor();
      let differentColor;
      
      // Используем разные дельты для разных уровней и проверяем, что цвета отличаются
      let maxAttempts = 5;  // Ограничиваем количество попыток для избежания бесконечного цикла
      let attempts = 0;
      let validColorFound = false;
      
      while (!validColorFound && attempts < maxAttempts) {
        attempts++;
        differentColor = this.generateSimilarColor(baseColor, this.currentLevel);
        // Проверяем, достаточно ли отличается цвет
        const colorDifference = this.calculateColorDifference(baseColor, differentColor);
        // Минимальная разница должна уменьшаться с каждым уровнем, но не должна быть нулевой
        const minDifference = Math.max(5, 30 - (this.currentLevel * 2.5));
        
        if (colorDifference >= minDifference) {
          validColorFound = true;  // Если цвета достаточно разные, выходим из цикла
        }
      }
      
      // Если не удалось найти подходящий цвет, используем последний сгенерированный
      if (!validColorFound && attempts > 0) {
        // differentColor уже содержит последний сгенерированный цвет
      }
      
      // Размер сетки увеличивается с уровнем сложности
      const gridSize = this.getGridSize();
      
      this.gridColors = Array(gridSize).fill(baseColor);
      this.correctIndex = Math.floor(Math.random() * gridSize);
      this.gridColors[this.correctIndex] = differentColor;
    },
    
    calculateColorDifference(color1, color2) {
      // Извлекаем RGB компоненты
      const r1 = parseInt(color1.slice(1, 3), 16);
      const g1 = parseInt(color1.slice(3, 5), 16);
      const b1 = parseInt(color1.slice(5, 7), 16);
      
      const r2 = parseInt(color2.slice(1, 3), 16);
      const g2 = parseInt(color2.slice(3, 5), 16);
      const b2 = parseInt(color2.slice(5, 7), 16);
      
      // Вычисляем среднее различие по каналам
      return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
    },
    
    generateSimilarColor(baseColor, level) {
      // Убираем "#" из baseColor и преобразуем его в массив RGB
      let r = parseInt(baseColor.slice(1, 3), 16);
      let g = parseInt(baseColor.slice(3, 5), 16);
      let b = parseInt(baseColor.slice(5, 7), 16);

      // Чем выше уровень, тем меньше разница в цвете
      // Начинаем с разницы 30 на первом уровне и уменьшаем до минимума 8
      const delta = Math.max(8, 30 - (level * 2));
      
      // Выбираем случайный канал(ы) для изменения, чтобы избежать одновременного изменения всех каналов
      const channels = Math.floor(Math.random() * 3) + 1; // 1, 2 или 3 канала
      
      if (channels === 1 || channels === 3) {
        // Изменяем красный канал
        r = Math.min(255, Math.max(0, r + (Math.random() > 0.5 ? delta : -delta)));
      }
      
      if (channels === 2 || channels === 3) {
        // Изменяем зеленый канал
        g = Math.min(255, Math.max(0, g + (Math.random() > 0.5 ? delta : -delta)));
      }
      
      if (channels === 1 || channels === 2) {
        // Изменяем синий канал
        b = Math.min(255, Math.max(0, b + (Math.random() > 0.5 ? delta : -delta)));
      }

      // Преобразуем обратно в шестнадцатеричный цвет
      return `#${r.toString(16).padStart(2, "0")}${g
        .toString(16)
        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    },
    
    checkAnswer(index) {
      this.totalAttempts++;
      this.showFeedback = true;
      
      if (index === this.correctIndex) {
        // Правильный ответ
        this.lastAnswerCorrect = true;
        this.correctAnswers++;
        this.score = this.currentLevel;
      } else {
        // Неправильный ответ
        this.lastAnswerCorrect = false;
        this.errorCount++;
        this.lastWrongIndex = index;
      }
    },
    
    tryAgain() {
      this.showFeedback = false;
      this.lastWrongIndex = null;
      // Не меняем сетку, даем еще одну попытку
    },
    
    nextLevel() {
      if (this.currentLevel < this.maxLevels) {
        this.currentLevel++;
        this.showFeedback = false;
        this.generateGrid();
      } else {
        this.endTest();
      }
    },
    
    skipLevel() {
      if (this.skipsRemaining > 0) {
        this.skipsRemaining--;
        
        if (this.currentLevel < this.maxLevels) {
          this.currentLevel++;
          this.showFeedback = false;
          this.generateGrid();
        } else {
          this.endTest();
        }
      }
    },
    
    endTest() {
      this.testCompleted = true;
      this.$emit('test-complete', this.score, this.maxLevels);
    },
    
    restartTest() {
      this.startTest();
    },
    
    randomColor() {
      // Генерируем случайный цвет, но избегаем очень темных и очень светлых оттенков
      const minValue = 50;  // Минимальное значение для каждого канала (не слишком темный)
      const maxValue = 200; // Максимальное значение для каждого канала (не слишком светлый)
      
      const r = minValue + Math.floor(Math.random() * (maxValue - minValue));
      const g = minValue + Math.floor(Math.random() * (maxValue - minValue));
      const b = minValue + Math.floor(Math.random() * (maxValue - minValue));
      
      return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    }
  }
};
</script>

<style>
.color-test {
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
  background-color: #f7e2fa;
  border-radius: 50%;
  margin-bottom: 1rem;
  color: #d946ef;
}

.intro-screen h2 {
  color: #d946ef;
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
  background-color: #f7e2fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: left;
  border-left: 4px solid #d946ef;
}

.instruction-box h3 {
  color: #d946ef;
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
  background-color: #d946ef;
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

.color-grid {
  display: grid;
  gap: 10px;
  max-width: 450px;
  margin: 0 auto 1.5rem;
}

.grid-small {
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
}

.grid-medium {
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
}

.grid-large {
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
}

.color-grid.disabled {
  pointer-events: none;
}

.grid-item {
  width: 90px;
  height: 90px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.grid-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.grid-item.correct-item {
  box-shadow: 0 0 0 3px #10b981, 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: pulse-green 1s infinite;
}

.grid-item.wrong-item {
  box-shadow: 0 0 0 3px #ef4444, 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: pulse-red 1s infinite;
}

@keyframes pulse-green {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

@keyframes pulse-red {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}

.feedback-message {
  text-align: center;
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 450px;
}

.success-message {
  background-color: #dcfce7;
  padding: 1rem;
  border-radius: 8px;
  color: #10b981;
}

.error-message {
  background-color: #fee2e2;
  padding: 1rem;
  border-radius: 8px;
  color: #ef4444;
}

.stats-bar {
  display: flex;
  gap: 2rem;
  padding: 0.75rem 1.5rem;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 1rem;
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
  font-size: 18px;
  font-weight: 600;
}

.stat-value.correct {
  color: #10b981;
}

.stat-value.incorrect {
  color: #ef4444;
}

.skip-level {
  margin-top: 0.5rem;
}

.skip-button {
  background-color: #f9fafb;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.skip-button:hover {
  background-color: #e5e7eb;
  color: #4b5563;
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
  background-color: #f7e2fa;
  border-radius: 50%;
  margin-bottom: 0.5rem;
  position: relative;
}

.score-value {
  font-size: 40px;
  font-weight: 700;
  color: #d946ef;
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

.result-stats {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
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
  background-color: #d946ef;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.action-button:hover {
  background-color: #c026d3;
}

.action-button:active {
  transform: translateY(1px);
}

/* Адаптивность для мобильных устройств */
@media (max-width: 640px) {
  .grid-item {
    width: 50px;  /* Уменьшение ширины квадрата */
    height: 50px; /* Уменьшение высоты квадрата */
  }
  
  .color-grid {
    gap: 5px; /* Уменьшение отступов между квадратами */
  }
  
  .grid-small {
    grid-template-columns: repeat(2, 1fr); /* 2 колонки для маленькой сетки */
    grid-template-rows: repeat(2, 1fr);
  }

  .grid-medium {
    grid-template-columns: repeat(3, 1fr); /* 3 колонки для средней сетки */
    grid-template-rows: repeat(3, 1fr);
  }

  .grid-large {
    grid-template-columns: repeat(4, 1fr); /* 4 колонки для большой сетки */
    grid-template-rows: repeat(4, 1fr);
  }
}
</style>