<template>
  <div class="puzzle-test">
    <!-- Начальный экран -->
    <div v-if="!testStarted" class="intro-screen">
      <div class="intro-content">
        <div class="intro-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          </svg>
        </div>
        <h2>Тест на пространственное мышление</h2>
        <p>Проверьте свою способность визуально организовывать и собирать изображения из отдельных фрагментов</p>
        <button @click="startTest" class="action-button">Начать тест</button>
      </div>
    </div>

    <!-- Экран с тестом -->
    <div v-else-if="!isFinished" class="question-screen">
      <div class="progress-bar">
        <div class="progress-indicator" :style="{ width: `${(currentLevel / levels.length) * 100}%` }"></div>
      </div>
      
      <div class="question-counter">
        Уровень {{ currentLevel }}/{{ levels.length }}
      </div>

      <div class="question-container">
        <h3 class="question-text">Соберите изображение, перетаскивая фрагменты</h3>
        
        <div class="puzzle-grid" 
        :style="{ gridTemplateColumns: `repeat(${gridX}, 1fr)`, gridTemplateRows: `repeat(${gridY}, 1fr)` }">
          <div
            v-for="(piece, index) in shuffledPieces"
            :key="index"
            class="puzzle-piece"
            :style="{ backgroundImage: `url(${currentImage})`, backgroundPosition: piece.position }"
            @dragstart="dragStart(index)"
            @dragover.prevent
            @drop="drop(index)"
            @click="handlePieceClick(index)" 
            draggable="true"
          ></div>
        </div>
        
        <div class="puzzle-actions">
          <button @click="shufflePuzzle" class="secondary-button">Перемешать</button>
          <button @click="checkPuzzle" class="action-button">Проверить</button>
        </div>
        
        <div class="feedback-message" v-if="errorMessage || isSolved">
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          <div v-if="isSolved" class="success-message">
            <p>✅ Правильно! Пазл собран верно.</p>
            <button v-if="currentLevel < levels.length" @click="nextLevel" class="action-button">Следующий уровень</button>
            <button v-else @click="finishTest" class="action-button">Завершить тест</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Экран результатов -->
    <div v-else class="results-screen">
      <div class="results-content">
        <div class="results-icon" :class="{ 'high-score': score >= levels.length * 0.7 }">
          <svg v-if="score >= levels.length * 0.7" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
            <span class="score-total">/{{ levels.length }}</span>
          </div>
          <p class="score-label">собранных пазлов</p>
        </div>
        
        <div class="result-stats">
          <div class="stat-item">
            <span class="stat-label">Попытки:</span>
            <span class="stat-value">{{ attempts }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Точность:</span>
            <span class="stat-value">{{ accuracy }}%</span>
          </div>
        </div>
        
        <div class="result-message">
          <p v-if="score >= levels.length * 0.9">Отличный результат! У вас великолепное пространственное мышление.</p>
          <p v-else-if="score >= levels.length * 0.7">Хороший результат! Ваше пространственное мышление хорошо развито.</p>
          <p v-else-if="score >= levels.length * 0.5">Неплохой результат. Есть потенциал для улучшения.</p>
          <p v-else>Пространственное мышление можно тренировать! Регулярные упражнения помогут улучшить результаты.</p>
        </div>
        
        <button @click="restartTest" class="action-button">Пройти тест снова</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PuzzleGame",
  data() {
    return {
      testStarted: false,
      levels: [ [2, 2], [3, 2], [3, 3], [4, 3], [4, 4] ], // Размер сетки на каждом уровне
      currentLevel: 1,
      gridX: 2,
      gridY: 2,
      pieces: [],
      shuffledPieces: [],
      originalPieces: [], // Сохраняем оригинальный порядок пазлов
      draggedIndex: null,
      score: 0,
      attempts: 0,
      isSolved: false,
      isFinished: false,
      errorMessage: "",
      levelImages: [
        'https://i.imgur.com/S7e0ZVG.jpeg',
        'https://i.imgur.com/mDMhTAU.jpeg',
        'https://i.imgur.com/BTIbfAS.jpeg',
        'https://i.imgur.com/WpuHQxI.jpeg',
        'https://i.imgur.com/vFhmOxb.jpeg'
      ],
      firstSelectedIndex: null,
    };
  },
  computed: {
    currentImage() {
      return this.levelImages[this.currentLevel - 1];
    },
    accuracy() {
      return this.attempts > 0 ? ((this.score / this.attempts) * 100).toFixed(1) : 0;
    },
  },
  methods: {
    startTest() {
      this.testStarted = true;
      this.currentLevel = 1;
      this.score = 0;
      this.attempts = 0;
      this.isFinished = false;
      this.generatePuzzle();
      this.$emit('test-start');
    },
    restartTest() {
      this.startTest();
    },
    
    generatePuzzle() {
      // Логика генерации пазла
      const [x, y] = this.levels[this.currentLevel - 1];
      this.gridX = x;
      this.gridY = y;

      this.pieces = [];
      // Рассчитываем размер шага для позиционирования фона
      const totalCells = x * y;
      const backgroundSize = 300; // Размер фона в пикселях
      const cellWidth = backgroundSize / x;
      const cellHeight = backgroundSize / y;

      for (let i = 0; i < totalCells; i++) {
        const row = Math.floor(i / x);
        const col = i % x;
        
        this.pieces.push({
          id: i,
          position: `-${col * cellWidth}px -${row * cellHeight}px`,
          correctIndex: i
        });
      }

      // Сохраняем оригинальный порядок
      this.originalPieces = JSON.parse(JSON.stringify(this.pieces));
      
      // Перемешиваем пазлы
      this.shufflePuzzle();
      this.isSolved = false;
      this.errorMessage = "";
    },

    // Функция для перемешивания пазлов
    shufflePuzzle() {
      // Создаем новый массив с перемешанными элементами
      // Используем метод для обеспечения хорошего перемешивания
      const array = JSON.parse(JSON.stringify(this.pieces));
      
      // Проверяем, что пазл действительно перемешан
      let isShuffled = false;
      
      while (!isShuffled) {
        // Алгоритм перемешивания Фишера-Йейтса
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        
        // Проверяем, что порядок отличается от правильного
        let different = false;
        for (let i = 0; i < array.length; i++) {
          if (array[i].id !== i) {
            different = true;
            break;
          }
        }
        
        isShuffled = different;
      }
      
      this.shuffledPieces = array;
    },

    handlePieceClick(index) {
      if (this.firstSelectedIndex === null) {
        this.firstSelectedIndex = index;
      } else {
        [this.shuffledPieces[this.firstSelectedIndex], this.shuffledPieces[index]] =
        [this.shuffledPieces[index], this.shuffledPieces[this.firstSelectedIndex]];
        this.firstSelectedIndex = null;
      }
    },

    dragStart(index) {
      this.draggedIndex = index;
    },

    drop(index) {
      if (this.draggedIndex !== null) {
        // Меняем местами элементы
        [this.shuffledPieces[index], this.shuffledPieces[this.draggedIndex]] =
          [this.shuffledPieces[this.draggedIndex], this.shuffledPieces[index]];
        this.draggedIndex = null;
      }
    },

    // Проверка правильности собранного пазла
    checkPuzzle() {
      this.attempts++;
      this.errorMessage = "";
      
      // Сравниваем текущее расположение с правильным
      let isCorrect = true;
      
      for (let i = 0; i < this.shuffledPieces.length; i++) {
        // Проверяем, находится ли элемент на своей позиции путем сравнения id с correctIndex
        if (this.shuffledPieces[i].id !== this.originalPieces[i].id) {
          isCorrect = false;
          break;
        }
      }
      
      if (isCorrect) {
        this.isSolved = true;
        this.score++;
      } else {
        this.errorMessage = "❌ Пазл собран неправильно, попробуйте еще раз!";
      }
    },

    finishTest() {
      this.isFinished = true;
      this.$emit('test-complete', this.score, this.levels.length);
    },

    nextLevel() {
      if (this.currentLevel < this.levels.length) {
        this.currentLevel++;
        this.generatePuzzle();
        this.isSolved = false;
      } else {
        this.finishTest();
      }
    },
  }
};
</script>

<style scoped>
.puzzle-test {
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

/* Стили экрана с вопросом */
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

.question-text {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
  text-align: center;
}

.puzzle-grid {
  display: grid;
  width: 300px;
  height: 300px;
  margin: 0 auto 1.5rem;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.puzzle-piece {
  width: 100%;
  height: 100%;
  background-size: 300px 300px;
  cursor: grab;
  border: 1px solid #e5e7eb;
  transition: transform 0.2s;
}

.puzzle-piece:hover {
  transform: scale(0.98);
}

.puzzle-piece:active {
  cursor: grabbing;
}

.puzzle-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.feedback-message {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
}

.success-message {
  background-color: #dcfce7;
  color: #10b981;
  padding: 0.75rem;
  border-radius: 8px;
  text-align: center;
}

.error-message {
  background-color: #fee2e2;
  color: #ef4444;
  padding: 0.75rem;
  border-radius: 8px;
  text-align: center;
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
}

.stat-value {
  font-size: 20px;
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
  
  .puzzle-grid {
    width: 260px;
    height: 260px;
    background-size: 260px 260px;
  }
  
  .puzzle-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>