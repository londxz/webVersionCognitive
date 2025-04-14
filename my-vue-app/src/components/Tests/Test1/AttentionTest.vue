<template>
  <div class="attention-test">
    <!-- Начальный экран -->
    <div v-if="!testStarted" class="intro-screen">
      <div class="intro-content">
        <div class="intro-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </div>
        <h2>Тест на внимательность</h2>
        <p>В этом тесте вы увидите слова, написанные разными цветами. Ваша задача - выбрать вариант, который правильно описывает цвета слов на экране, а не их значения.</p>
        <button @click="startTest" class="action-button">Начать тест</button>
      </div>
    </div>

    <!-- Экран с тестом -->
    <div v-else-if="currentTask <= totalTasks && !testCompleted" class="question-screen">
      <div class="progress-bar">
        <div class="progress-indicator" :style="{ width: progress + '%' }"></div>
      </div>
      
      <div class="question-counter">
        Задание {{ currentTask }}/{{ totalTasks }}
      </div>

      <div class="question-container">
        <div class="words-container">
          <span
          v-for="(word, index) in taskWords"
          :key="index"
          :style="{ color: word.color }"
          class="word"
        >
        {{ word.text }}
      </span>
    </div>
  </div>
        
        <h3 class="question-text">Выберите вариант, который правильно описывает ЦВЕТА слов (не их значения):</h3>
        
        <div class="options">
          <button
            v-for="(option, index) in options"
            :key="index"
            @click="checkAnswer(option)"
            class="option-button"
          >
            {{ formatOption(option) }}
          </button>
        </div>
      </div>
    </div>

    <!-- Экран с результатами -->
    <div v-if="testCompleted" class="results-screen">
      <div class="results-content">
        <div class="results-icon" :class="{ 'high-score': score >= totalTasks * 0.7 }">
          <svg v-if="score >= totalTasks * 0.7" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
            <span class="score-total">/{{ totalTasks }}</span>
          </div>
          <p class="score-label">правильных ответов</p>
        </div>
        
        <div class="result-message">
          <p v-if="score >= totalTasks * 0.9">Отличный результат! У вас феноменальная внимательность.</p>
          <p v-else-if="score >= totalTasks * 0.7">Хороший результат! Ваша внимательность выше среднего.</p>
          <p v-else-if="score >= totalTasks * 0.5">Неплохой результат. Есть потенциал для улучшения.</p>
          <p v-else>Внимательность можно тренировать! Регулярные упражнения помогут улучшить результаты.</p>
        </div>
        
        <button @click="restartTest" class="action-button">Пройти тест снова</button>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      testStarted: false,
      currentTask: 1,
      totalTasks: 10,
      words: ['Красный', 'Синий','Зеленый','Желтый','Белый'],
      colors: ['red', 'blue', 'green', 'yellow', 'white'],
      taskWords: [],
      correctAnswer: [],
      options: [],
      score: 0,
      testCompleted: false,
    };
  },
  computed: {
    progress() {
      return (this.currentTask / this.totalTasks) * 100;
    },
  },
  methods: {
    startTest() {
      this.testStarted = true;
      this.currentTask = 1;
      this.score = 0;
      this.testCompleted = false;
      this.$emit('test-start');
      this.generateTask();
    },
    generateTask() {
      const wordsCount = Math.min(this.currentTask, 10); // Ограничиваем до 10 слов
      const words = [];
      const answer = [];
      for (let i = 0; i < wordsCount; i++) {
        const randomColorText = this.words[Math.floor(Math.random() * this.words.length)];
        const randomColorIndex = Math.floor(Math.random() * this.colors.length);
        const randomColor = this.colors[randomColorIndex];
        words.push({ text: randomColorText, color: randomColor });
        answer.push(this.words[randomColorIndex]);
      }
      this.taskWords = words;
      this.correctAnswer = answer;

      // Генерируем варианты ответов с небольшими отличиями
      this.generateOptions(answer, wordsCount);
    },
    generateOptions(correctAnswer, wordsCount) {
      const options = [correctAnswer]; // Добавляем правильный ответ

      // Создаём ещё 2 варианта ответов с малыми отличиями от правильного
      while (options.length < 3) {
        // Клонируем правильный ответ
        const variant = [...correctAnswer];
        
        // Изменяем 1-2 случайные позиции
        const changeCount = 1 + Math.floor(Math.random() * 2); // 1 или 2 изменения
        const positionsToChange = new Set();
        
        // Выбираем случайные позиции для изменения
        while (positionsToChange.size < changeCount && positionsToChange.size < wordsCount) {
          const pos = Math.floor(Math.random() * wordsCount);
          positionsToChange.add(pos);
        }
        
        // Меняем выбранные позиции
        for (const pos of positionsToChange) {
          let newColor;
          // Выбираем цвет, отличный от правильного
          do {
            const randomIndex = Math.floor(Math.random() * this.words.length);
            newColor = this.words[randomIndex];
          } while (newColor === correctAnswer[pos]);
          
          variant[pos] = newColor;
        }
        
        // Проверяем, что такого варианта ещё нет
        const isDuplicate = options.some(opt => 
          JSON.stringify(opt) === JSON.stringify(variant)
        );
        
        if (!isDuplicate) {
          options.push(variant);
        }
      }

      // Перемешиваем варианты
      this.options = options.sort(() => Math.random() - 0.5);
    },
    formatOption(option) {
      // Форматируем длинные варианты ответов для лучшего отображения
      if (option.length > 6) {
        // Разделяем на две строки, если вариантов много
        const firstHalf = option.slice(0, Math.ceil(option.length/2)).join(', ');
        const secondHalf = option.slice(Math.ceil(option.length/2)).join(', ');
        return firstHalf + ',\n' + secondHalf;
      }
      return option.join(', ');
    },
    checkAnswer(selectedOption) {
      if (JSON.stringify(selectedOption) === JSON.stringify(this.correctAnswer)) {
        this.score++;
      }
      if (this.currentTask < this.totalTasks) {
        this.currentTask++;
        this.generateTask();
      } else {
        this.testCompleted = true;
        this.$emit('test-complete', this.score);
      }
    },
    restartTest() {
      this.startTest();
    },
  },
};
</script>

<style>
.attention-test {
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

.words-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Два столбца */
  gap: 10px; /* Промежуток между словами */
  margin: 20px 0;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.word {
  font-size: 18px; /* Размер шрифта для обычных устройств */
  padding: 8px 12px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  display: flex;
  justify-content: center; /* Центрирование текста */
  align-items: center; /* Центрирование текста по вертикали */
}


.words {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 0 auto;
  max-width: 90%;
}

.question-text {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 1.5rem 0;
  text-align: center;
}

.options {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
  width: 100%;
}

.option-button {
  min-height: 60px;
  width: 90%;
  max-width: 400px;
  padding: 12px 15px;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1.4;
  white-space: pre-wrap;
  transition: all 0.2s;
  color: #1f2937;
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
  .words-container {
    grid-template-columns: repeat(2, 1fr); /* Два столбца на мобильных устройствах */
    gap: 8px; /* Уменьшенный промежуток */
  }
  .word {
    font-size: 16px; /* Уменьшенный размер шрифта */
    padding: 6px 10px; /* Уменьшенные отступы */
  }

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
  
  .option-button {
    min-height: 50px;
    padding: 10px;
    font-size: 14px;
  }
}
</style>