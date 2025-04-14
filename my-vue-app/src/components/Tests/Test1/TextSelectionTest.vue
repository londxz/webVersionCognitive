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
            <li><strong>Нажимайте на буквы</strong>, чтобы выделить их.</li>
            <li>Найденные слова отобразятся в списке внизу.</li>
            <li>Когда найдете все слова, нажмите "Завершить тест".</li>
          </ol>
          <div class="example-box">
            <p>Например, в тексте <strong>"клодфир<span class="example-highlight">кошка</span>довоапрягл"</strong> вы можете найти слово <strong>"кошка"</strong>, нажав на все её буквы.</p>
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

      <div class="text-area">
        <span
          v-for="(char, index) in textChars"
          :key="index"
          @click="selectChar(index)"
          :class="{ 'highlighted': isHighlighted(index) }"
          class="char"
        >
          {{ char }}
        </span>
      </div>

      <div class="question-container">
        <h3 class="question-text">Нажимайте на буквы в тексте ниже:</h3>
        
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
      highlightedIndices: {},
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
    this.generateTextWithWords();
  },
  methods: {
    generateTextWithWords() {
      const totalLength = 300;
      const randomLetters = Array(totalLength).fill().map(() => this.getRandomLetter());
      const wordPositions = [];
      
      for (const word of this.words) {
        let positioned = false;
        let attempts = 0;
        
        while (!positioned && attempts < 50) {
          const startPos = Math.floor(Math.random() * (totalLength - word.length));
          let canPlace = true;
          
          for (let i = 0; i < word.length; i++) {
            if (wordPositions.includes(startPos + i)) {
                canPlace = false;
                break;
            }
          }
          
          if (canPlace) {
            for (let i = 0; i < word.length; i++) {
              randomLetters[startPos + i] = word.charAt(i);
              wordPositions.push(startPos + i);
            }
            positioned = true;
          }
          attempts++;
        }
      }
      this.text = randomLetters.join('');
    },
    
    getRandomLetter() {
      const letters = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
      return letters.charAt(Math.floor(Math.random() * letters.length));
    },

    selectChar(index) {
      this.highlightedIndices[index] = !this.highlightedIndices[index];
      this.checkWordCompletion();
    },
    
    checkWordCompletion() {
      this.words.forEach(word => {
        const startIndex = this.text.indexOf(word);
        if (startIndex !== -1) {
          const allSelected = [...word].every((char, index) => this.highlightedIndices[startIndex + index]);
          if (allSelected && !this.selectedWords.includes(word)) {
            this.selectedWords.push(word);
          }
        }
      });
    },
    
    finishTest() {
      this.showResults = true;
      this.$emit('test-complete', this.selectedWords.length, this.totalWords);
    },
    
    restartTest() {
      this.startTest();
    },
    
    startTest() {
      this.testStarted = true;
      this.selectedWords = [];
      this.showResults = false;
      this.highlightedIndices = {};
      this.$emit('test-start');
    },

    isHighlighted(index) {
      return this.highlightedIndices[index];
    },
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
  margin: 1rem 0;
  font-size: 16px;
  color: #4b5563;
}

.text-area {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.char {
  cursor: pointer;
  padding: 0.5rem;
  font-size: 20px;
}

.highlighted {
  background-color: #d1fae5;
}

.question-container {
  padding: 1rem;
}

.found-words {
  margin-top: 1rem;
}

.word-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.word-chip {
  background-color: #e0f2fe;
  border-radius: 12px;
  padding: 0.5rem 1rem;
  color: #0d9488;
}

.missed {
  background-color: #fee2e2;
  color: #b91c1c;
}
</style>