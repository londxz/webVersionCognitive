<template>
  <div class="text-selection-test">
    <!-- Начальный экран -->
    <div v-if="!testStarted" class="intro-screen">
      <div class="intro-content">
        <div class="intro-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <h2>Тест: выделение слов</h2>
        <p>Проверьте свою внимательность и способность находить осмысленные слова в буквенной последовательности.</p>
        
        <div class="instruction-box">
          <h3>Инструкция:</h3>
          <ol>
            <li>В тексте ниже скрыто <strong>{{ totalWords }}</strong> слов.</li>
            <li><strong>Нажимайте на слова</strong>, чтобы выделить их.</li>
            <li>Найденные слова отобразятся в списке внизу.</li>
            <li>Когда найдете все слова, нажмите "Завершить тест".</li>
          </ol>
          <div class="example-box">
            <p>Например, в тексте <strong>"клодфир<span class="example-highlight">кошка</span>довоапрягл"</strong> вы можете найти слово <strong>"кошка"</strong>, нажав на любую из её букв.</p>
          </div>
        </div>
        
        <button @click="startTest" class="action-button">Начать тест</button>
      </div>
    </div>

    <!-- Экран с тестом -->
    <div v-else-if="!showResults" class="question-screen">
      <div class="progress-bar">
        <div class="progress-indicator" :style="{ width: `${(selectedWords.length / totalWords) * 100}%` }"></div>
      </div>
      
      <div class="question-counter">
        Найдено: {{ selectedWords.length }} из {{ totalWords }}
      </div>

      <div class="question-container">
        <h3 class="question-text">Нажимайте на слова в тексте ниже:</h3>
        
        <div class="text-area-container">
          <div class="text-area">
            <span 
              v-for="(char, index) in textChars" 
              :key="index" 
              @click="checkWordAt(index)"
              :class="{ 'highlighted': isHighlighted(index) }"
              class="char"
            >
              {{ char }}
            </span>
          </div>
        </div>
        
        <div class="found-words">
          <h4>Найденные слова ({{ selectedWords.length }}):</h4>
          <div class="word-chips">
            <span 
              v-for="(word, index) in selectedWords" 
              :key="index"
              class="word-chip"
            >
              {{ word }}
            </span>
          </div>
        </div>
        
        <button @click="finishTest" class="action-button">Завершить тест</button>
      </div>
    </div>

    <!-- Экран с результатами -->
    <div v-if="showResults" class="results-screen">
      <div class="results-content">
        <div class="results-icon" :class="{ 'high-score': selectedWords.length >= totalWords * 0.7 }">
          <svg v-if="selectedWords.length >= totalWords * 0.7" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
            <span class="score-value">{{ selectedWords.length }}</span>
            <span class="score-total">/{{ totalWords }}</span>
          </div>
          <p class="score-label">найденных слов</p>
        </div>
        
        <div class="result-message">
          <p v-if="selectedWords.length === totalWords">Отличный результат! Вы нашли все слова.</p>
          <p v-else-if="selectedWords.length >= totalWords * 0.7">Хороший результат! Вы нашли большинство слов.</p>
          <p v-else-if="selectedWords.length >= totalWords * 0.5">Неплохой результат. Есть потенциал для улучшения.</p>
          <p v-else>Внимательность можно тренировать! Попробуйте еще раз.</p>
        </div>
        
        <div v-if="selectedWords.length < totalWords" class="missed-words">
          <h4>Пропущенные слова:</h4>
          <div class="word-chips">
            <span 
              v-for="word in missedWords" 
              :key="word"
              class="word-chip missed"
            >
              {{ word }}
            </span>
          </div>
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
      text: "",
      words: ["белок", "стол", "замок", "капуста", "лимон", "книга", "дорога", "кошка", "кит", "лес", "зебра",
              "палка", "очаг", "жук", "овраг", "дрова", "шапка", "норка", "солнце", "гриб", "парта", "ложка", "дверь"],
      selectedWords: [],
      totalWords: 23,
      showResults: false,
      highlightedIndices: {}
    };
  },
  computed: {
    textChars() {
      return this.text.split('');
    },
    missedWords() {
      return this.words.filter(word => !this.selectedWords.includes(word));
    }
  },
  created() {
    // Генерируем текст при создании компонента
    this.generateTextWithWords();
  },
  methods: {
    // Метод для генерации текста со встроенными словами и случайными буквами
    generateTextWithWords() {
      // Массив для хранения позиций начала каждого слова
      const wordPositions = [];
      // Общая длина текста (будем формировать строку из случайных букв)
      const totalLength = 300;
      // Создаем массив из случайных букв
      const randomLetters = Array(totalLength).fill().map(() => this.getRandomLetter());
      
      // Словарь для хранения позиций начала слов
      const wordStartPositions = {};
      
      // Встраиваем все слова в случайные позиции
      for (const word of this.words) {
        let positioned = false;
        let attempts = 0;
        
        // Пытаемся разместить слово в случайной позиции
        while (!positioned && attempts < 50) {
          // Выбираем случайную позицию, оставляя достаточно места для слова
          const startPos = Math.floor(Math.random() * (totalLength - word.length));
          
          // Проверяем, не перекрывается ли с уже размещенными словами
          let canPlace = true;
          for (let i = 0; i < word.length; i++) {
            const pos = startPos + i;
            if (wordPositions.includes(pos)) {
              canPlace = false;
              break;
            }
          }
          
          if (canPlace) {
            // Размещаем слово
            for (let i = 0; i < word.length; i++) {
              randomLetters[startPos + i] = word.charAt(i);
              wordPositions.push(startPos + i);
            }
            
            // Запоминаем позицию начала слова
            wordStartPositions[word] = startPos;
            positioned = true;
          }
          
          attempts++;
        }
      }
      
      // Сохраняем сгенерированный текст
      this.text = randomLetters.join('');
      
      // Сохраняем информацию о позициях слов (для отладки)
      this.wordStartPositions = wordStartPositions;
    },
    
    getRandomLetter() {
      const letters = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
      return letters.charAt(Math.floor(Math.random() * letters.length));
    },
    
    startTest() {
      this.testStarted = true;
      this.selectedWords = [];
      this.showResults = false;
      this.highlightedIndices = {};
      this.$emit('test-start');
    },
    
    isHighlighted(index) {
      return this.highlightedIndices[index] === true;
    },
    
    // Улучшенный метод для проверки слова при нажатии на символ
    checkWordAt(index) {
      // Проверяем все возможные слова, начинающиеся или заканчивающиеся на данном индексе
      const maxWordLength = Math.max(...this.words.map(w => w.length));
      
      // Проверяем слова, начинающиеся с текущей позиции
      for (let length = 2; length <= maxWordLength; length++) {
        if (index + length <= this.text.length) {
          const potentialWord = this.text.substring(index, index + length);
          
          if (this.words.includes(potentialWord) && !this.selectedWords.includes(potentialWord)) {
            // Нашли слово! Добавляем его в выбранные
            this.selectedWords.push(potentialWord);
            
            // Подсвечиваем буквы этого слова
            for (let i = 0; i < potentialWord.length; i++) {
              this.highlightedIndices[index + i] = true;
            }
            
            return;
          }
        }
      }
      
      // Проверяем слова, заканчивающиеся на текущей позиции
      for (let length = 2; length <= maxWordLength; length++) {
        if (index - length + 1 >= 0) {
          const startIndex = index - length + 1;
          const potentialWord = this.text.substring(startIndex, index + 1);
          
          if (this.words.includes(potentialWord) && !this.selectedWords.includes(potentialWord)) {
            // Нашли слово! Добавляем его в выбранные
            this.selectedWords.push(potentialWord);
            
            // Подсвечиваем буквы этого слова
            for (let i = 0; i < potentialWord.length; i++) {
              this.highlightedIndices[startIndex + i] = true;
            }
            
            return;
          }
        }
      }
    },
    
    finishTest() {
      this.showResults = true;
      this.$emit('test-complete', this.selectedWords.length, this.totalWords);
    },
    
    restartTest() {
      this.startTest();
    }
  }
};
</script>

<style>
.text-selection-test {
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
  margin-bottom: 1rem;
  font-size: 16px;
  line-height: 1.5;
}

.instruction-box {
  background-color: #f0f4ff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: left;
  border-left: 4px solid #3b4ce2;
}

.instruction-box h3 {
  color: #3b4ce2;
  margin-bottom: 0.75rem;
  font-size: 18px;
}

.instruction-box ol {
  padding-left: 1.25rem;
  margin-bottom: 1rem;
}

.instruction-box li {
  margin-bottom: 0.5rem;
  color: #4b5563;
}

.example-box {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  border: 1px dashed #cbd5e1;
}

.example-highlight {
  background-color: #d1fae5;
  padding: 0.125rem 0.25rem;
  border-radius: 4px;
  font-weight: bold;
  color: #065f46;
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

.question-text {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
  text-align: center;
}

.text-area-container {
  width: 100%;
  max-width: 600px;
  margin-bottom: 1.5rem;
  background-color: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow-wrap: break-word;
  word-wrap: break-word;
}

.text-area {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  line-height: 1.8;
}

.char {
  display: inline-block;
  font-family: 'Courier New', monospace;
  font-size: 22px;
  padding: 5px 3px;
  margin: 2px;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
  border-radius: 4px;
}

.char:hover {
  background-color: #e0f2fe;
  transform: scale(1.1);
}

.char.highlighted {
  background-color: #d1fae5;
  color: #065f46;
  font-weight: bold;
  box-shadow: 0 0 0 1px #10b981;
}

.found-words {
  width: 100%;
  max-width: 600px;
  margin-bottom: 1.5rem;
}

.found-words h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.word-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.word-chip {
  padding: 0.5rem 0.75rem;
  background-color: #e0f2fe;
  color: #0369a1;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.word-chip.missed {
  background-color: #fef9c3;
  color: #a16207;
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

.missed-words {
  margin-bottom: 2rem;
  width: 100%;
}

.missed-words h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
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
  
  .char {
    font-size: 20px;
    padding: 4px 2px;
    margin: 1px;
  }
  
  .text-area-container {
    padding: 1rem 0.5rem;
  }
  
  .text-area {
    justify-content: center;
  }
  
  .word-chip {
    font-size: 0.75rem;
    padding: 0.375rem 0.625rem;
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
  
  .example-box {
    padding: 0.75rem;
  }
}
</style>