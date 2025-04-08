<template>
  <div class="memory-test">
    <!-- Начальный экран с правилами -->
    <div v-if="showRules" class="intro-screen">
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
        <h2>Тест N-Back: Тренировка рабочей памяти</h2>
        
        <div class="rules-content">
          <p>Этот тест измеряет вашу <strong>рабочую память</strong> и способность концентрироваться.</p>
          
          <h3>Как играть:</h3>
          <ol>
            <li>Вы увидите последовательность цифр, появляющихся одна за другой.</li>
            <li>Ваша задача — определить, совпадает ли <strong>текущая цифра</strong> с <strong>первой цифрой</strong> в последовательности.</li>
            <li>Если цифры совпадают — нажмите <strong>"Да"</strong>.</li>
            <li>Если цифры не совпадают — нажмите <strong>"Нет"</strong>.</li>
          </ol>
          
          <div class="example">
            <h4>Пример:</h4>
            <div class="example-sequence">
              <span class="example-digit">4</span>
              <span class="example-digit">7</span>
              <span class="example-digit">4</span>
            </div>
            <p>В этом примере правильный ответ: <strong>"Да"</strong>, так как первая и последняя цифры совпадают (обе 4).</p>
          </div>
          
          <div class="tips">
            <h4>Советы:</h4>
            <ul>
              <li>У вас есть 3 жизни. За каждый неправильный ответ вы теряете одну жизнь.</li>
              <li>За правильные ответы вы получаете очки.</li>
              <li>Игра состоит из 20 раундов или заканчивается, когда вы потеряете все жизни.</li>
              <li>Чем дольше вы играете, тем сложнее будет запоминать цифры.</li>
            </ul>
          </div>
        </div>
        
        <button class="action-button" @click="startGame">Начать игру</button>
      </div>
    </div>

    <!-- Основной экран игры -->
    <div v-else class="game-screen">
      <div class="progress-bar">
        <div class="progress-indicator" :style="{ width: `${(round / 20) * 100}%` }"></div>
      </div>
      
      <div class="question-counter">
        Раунд {{ round }}/20
      </div>
      
      <div class="game-container">
        <div class="sequence-container">
          <div 
            v-for="(num, index) in sequence" 
            :key="index" 
            class="digit-box"
            :class="getOpacityClass(index)"
          >
            {{ num }}
          </div>
        </div>
        
        <div class="controls">
          <button @click="answer(false)" class="no-button">Нет</button>
          <button @click="answer(true)" class="yes-button">Да</button>
        </div>
        
        <div class="stats">
          <div class="stat-item">
            <span class="stat-label">Жизни</span>
            <span class="stat-value">{{ lives }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Счет</span>
            <span class="stat-value">{{ score }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Точность</span>
            <span class="stat-value">{{ accuracy }}%</span>
          </div>
        </div>
      </div>
      
      <!-- Результаты в конце игры (без всплывающего окна) -->
      <div v-if="gameOver" class="game-over-results">
        <div class="results-icon" :class="{ 'high-score': accuracy >= 80 }">
          <svg v-if="accuracy >= 80" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 15h8M10 9h.01M14 9h.01"></path>
          </svg>
        </div>
        
        <h3 class="results-title">Игра завершена</h3>
        
        <div class="result-stats">
          <div class="stat-item">
            <span class="stat-label">Правильно</span>
            <span class="stat-value">{{ correctAnswers }} из {{ Math.min(20, round - 1) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Точность</span>
            <span class="stat-value">{{ accuracy }}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Очки</span>
            <span class="stat-value">{{ score }}</span>
          </div>
        </div>
        
        <div class="result-message">
          <p v-if="accuracy >= 90">Потрясающе! У вас отличная рабочая память и концентрация.</p>
          <p v-else-if="accuracy >= 70">Хороший результат! Ваша рабочая память лучше, чем у большинства людей.</p>
          <p v-else-if="accuracy >= 50">Неплохой результат. Вы можете улучшить свою рабочую память с практикой.</p>
          <p v-else>Рабочую память можно тренировать! Регулярные упражнения помогут улучшить результат.</p>
        </div>
        
        <button @click="restartGame" class="action-button">Пройти тест снова</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showRules: true, // Показываем правила по умолчанию
      sequence: [],
      lives: 3,
      score: 0,
      round: 1,
      correctAnswers: 0,
      transparencyLevels: [0, 0, 0],
      gameOver: false,
      streak: 0,
      isBlinking: false,
      leftCounter: 0,
      centerCounter: 0
    };
  },
  computed: {
    accuracy() {
      // Исправляем ошибку расчета процента
      if (this.round <= 1) return 100;
      // Используем Math.min, чтобы убедиться, что не делим на число больше, чем количество сыгранных раундов
      return Math.round((this.correctAnswers / Math.min(this.round - 1, 20)) * 100);
    }
  },
  mounted() {
    // Инициализируем последовательность, но не начинаем игру сразу
    this.sequence = [
      this.getRandomDigit(false),
      this.getRandomDigit(false),
      this.getRandomDigit(true, 0.8)
    ];
  },
  methods: {
    startGame() {
      this.showRules = false;
      // Эмитим событие test-start когда игра действительно начинается
      this.$emit('test-start');
    },
    getRandomDigit(forceMatch = false, probabilityMatch = 0.8) {
      if (forceMatch && this.sequence.length > 0 && Math.random() < probabilityMatch) {
        return this.sequence[0];
      }
      return Math.floor(Math.random() * 10);
    },
    getOpacityClass(index) {
      const level = this.transparencyLevels[index];
      return `opacity-${Math.round(level * 5)}`;
    },
    answer(isYes) {
      if (this.gameOver) {
        return;
      }
      
      const correct = (this.sequence[0] === this.sequence[2]) === isYes;
      this.leftCounter++;
      this.centerCounter++;
      
      if (correct) {
        this.correctAnswers++;
        this.score += 100;
        this.streak++;
      } else {
        this.lives--;
        this.streak = 0;
        this.leftCounter = 0;
        this.centerCounter = 0;
        this.transparencyLevels[0] = 0;
        this.transparencyLevels[1] = 0;
      }
      
      if (this.leftCounter >= 3) {
        this.transparencyLevels[0] = 1;
      } else {
        this.transparencyLevels[0] = 0;
      }
      
      if (this.centerCounter >= 3) {
        this.transparencyLevels[1] = 1;
      } else {
        this.transparencyLevels[1] = 0;
      }
      
      if (this.lives <= 0 || this.round >= 20) {
        this.gameOver = true;
        
        // 1. Определяем максимально возможное количество правильных ответов
        const totalPossibleAnswers = 10;
        
        // 2. Рассчитываем коэффициент прохождения раундов
        const completedRounds = Math.min(20, this.round - 1);
        const completionRatio = completedRounds / 20;
        
        // 3. Учитываем потраченные жизни (снижаем результат)
        const lostLives = 3 - this.lives;
        const livesLostPenalty = lostLives * 0.2; // 20% штрафа за каждую потерянную жизнь
        
        // 4. Рассчитываем итоговый коэффициент выполнения
        const finalCompletionRatio = Math.max(0, completionRatio - livesLostPenalty);
        
        // 5. Переводим в количество правильных ответов из 10
        const correctAnswers = Math.round(finalCompletionRatio * totalPossibleAnswers);
        
        // 6. Передаем в TestsList количество правильных ответов и общее количество вопросов
        this.$emit('test-complete', correctAnswers, totalPossibleAnswers);
        return;
      }
      
      if (this.streak >= 3) {
        this.blinkRightDigit();
      } else {
        this.shiftSequence();
      }
    },
    blinkRightDigit() {
      this.isBlinking = true;
      setTimeout(() => {
        this.isBlinking = false;
        this.shiftSequence();
      }, 300);
    },
    shiftSequence() {
      this.sequence = [
        this.sequence[1],
        this.sequence[2],
        this.getRandomDigit(true, 0.8)
      ];
      this.transparencyLevels = [
        this.transparencyLevels[0],
        0,
        0.4
      ];
      this.round++;
    },
    restartGame() {
      this.sequence = [
        this.getRandomDigit(false),
        this.getRandomDigit(false),
        this.getRandomDigit(true, 0.8)
      ];
      this.lives = 3;
      this.score = 0;
      this.round = 1;
      this.correctAnswers = 0;
      this.transparencyLevels = [0, 0, 0];
      this.gameOver = false;
      this.streak = 0;
      this.isBlinking = false;
      this.leftCounter = 0;
      this.centerCounter = 0;
      this.showRules = true;
    }
  }
};
</script>

<style scoped>
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
  background-color: #ddf4f0;
  border-radius: 50%;
  margin-bottom: 1rem;
  color: #14b8a6; /* Сине-зеленый цвет для тестов на память */
}

.intro-screen h2 {
  color: #14b8a6;
  font-size: 28px;
  margin-bottom: 1rem;
}

.intro-screen p {
  color: #4b5563;
  margin-bottom: 2rem;
  font-size: 16px;
  line-height: 1.5;
}

.rules-content {
  text-align: left;
  margin: 20px 0;
}

.example {
  background-color: #effaf8;
  border-radius: 8px;
  padding: 15px;
  margin: 20px 0;
  border-left: 4px solid #14b8a6;
}

.example-sequence {
  display: flex;
  justify-content: center;
  margin: 15px 0;
  gap: 20px;
}

.example-digit {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #14b8a6;
  color: white;
  font-size: 24px;
  font-weight: bold;
  border-radius: 8px;
}

.tips {
  background-color: #fffbea;
  border-radius: 8px;
  padding: 15px;
  margin: 20px 0;
  border-left: 4px solid #eab308;
}

/* Стили игрового экрана */
.game-screen {
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
}

.game-container {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sequence-container {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 30px 0;
}

.digit-box {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #14b8a6;
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(20, 184, 166, 0.2);
}

.controls {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 30px 0;
}

.controls button {
  padding: 12px 30px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.no-button {
  background-color: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.yes-button {
  background-color: #14b8a6;
  color: white;
}

.no-button:hover {
  background-color: #e2e8f0;
  color: #475569;
  transform: translateY(-2px);
}

.yes-button:hover {
  background-color: #0d9488;
  transform: translateY(-2px);
}

.stats {
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 500px;
  margin: 30px 0;
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 15px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

/* Финальные результаты */
.game-over-results {
  background-color: #f0f9ff;
  border-radius: 12px;
  padding: 2rem;
  margin-top: 30px;
  text-align: center;
  border: 2px solid #14b8a6;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
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

.results-title {
  font-size: 24px;
  font-weight: 700;
  color: #14b8a6;
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
}

.result-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.result-message {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #effaf8;
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

/* Стили для прозрачности */
.opacity-0 { opacity: 1; }
.opacity-1 { opacity: 0.8; }
.opacity-2 { opacity: 0.6; }
.opacity-3 { opacity: 0.4; }
.opacity-4 { opacity: 0.2; }
.opacity-5 { opacity: 0; }

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
  
  .intro-icon, .results-icon {
    width: 60px;
    height: 60px;
  }
  
  .digit-box {
    width: 50px;
    height: 50px;
    font-size: 2rem;
  }
  
  .sequence-container {
    gap: 1rem;
  }
  
  .controls button {
    padding: 10px 20px;
    font-size: 14px;
  }
  
  .stat-label {
    font-size: 12px;
  }
  
  .stat-value {
    font-size: 16px;
  }
}
</style>