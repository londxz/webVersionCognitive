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
        <h2>Тест на сравнение строк</h2>
        <p>Проверьте свою внимательность при сравнении строк текста. Вам нужно определить, одинаковые ли строки или они отличаются.</p>
        <button @click="startTest" class="action-button">Начать тест</button>
      </div>
    </div>

    <!-- Экран с тестом -->
    <div v-else-if="!isTestFinished" class="question-screen">
      <div class="progress-bar">
        <div class="progress-indicator" :style="{ width: `${(currentQuestion / totalQuestions) * 100}%` }"></div>
      </div>
      
      <div class="question-counter">
        Вопрос {{ currentQuestion + 1 }}/{{ totalQuestions }}
      </div>

      <div class="question-container">
        <h3 class="question-text">Сравните две строки и определите, одинаковые ли они.</h3>
        
        <div class="string-comparison">
          <div class="string-box">
            <div class="string-label">Строка 1:</div>
            <div class="string-content">{{ currentPair.string1 }}</div>
          </div>
          
          <div class="string-box">
            <div class="string-label">Строка 2:</div>
            <div class="string-content">{{ currentPair.string2 }}</div>
          </div>
        </div>
        
        <div class="answer-options">
          <button @click="checkAnswer(true)" class="option-button">Одинаковые</button>
          <button @click="checkAnswer(false)" class="option-button">Не одинаковые</button>
        </div>
      </div>
    </div>

    <!-- Экран с результатами -->
    <div v-if="isTestFinished" class="results-screen">
      <div class="results-content">
        <div class="results-icon" :class="{ 'high-score': correctAnswers >= totalQuestions * 0.7 }">
          <svg v-if="correctAnswers >= totalQuestions * 0.7" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
            <span class="score-total">/{{ totalQuestions }}</span>
          </div>
          <p class="score-label">правильных ответов</p>
        </div>
        
        <div class="result-message">
          <p v-if="correctAnswers === totalQuestions">Отличный результат! Вы очень внимательны к деталям.</p>
          <p v-else-if="correctAnswers >= totalQuestions * 0.7">Хороший результат! Ваша внимательность на высоком уровне.</p>
          <p v-else-if="correctAnswers >= totalQuestions * 0.5">Неплохой результат. Есть потенциал для улучшения внимательности.</p>
          <p v-else>Внимательность можно тренировать! Регулярные упражнения помогут улучшить результаты.</p>
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
      currentQuestion: 0,
      correctAnswers: 0,
      isTestFinished: false,
      questions: [
        { string1: "ууйцууу", string2: "ууйцууу" },
        { string1: "ооОооОооО", string2: "ооОооОоО" },
        { string1: "вувовоувввв", string2: "вувовоуввв" },
        { string1: "ГгГОрВвввыы", string2: "ГгГОрВвввыы" },
        { string1: "zzZzZZZzzzZzZZz", string2: "zzZzZZZzzZzZZz" },
        { string1: "Оваовоаува", string2: "Оваовоаува" },
      ],
    };
  },
  computed: {
    currentPair() {
      return this.questions[this.currentQuestion];
    },
    totalQuestions() {
      return this.questions.length;
    },
  },
  methods: {
    startTest() {
      this.testStarted = true;
      this.currentQuestion = 0;
      this.correctAnswers = 0;
      this.isTestFinished = false;
      this.$emit('test-start');
    },
    
    checkAnswer(isSame) {
      const areEqual = this.currentPair.string1 === this.currentPair.string2;
      if (isSame === areEqual) {
        this.correctAnswers++;
      }
      
      this.currentQuestion++;
      if (this.currentQuestion >= this.totalQuestions) {
        this.finishTest();
      }
    },
    
    finishTest() {
      this.isTestFinished = true;
      this.$emit('test-complete', this.correctAnswers, this.totalQuestions);
    },
    
    restartTest() {
      this.startTest();
    }
  }
};
</script>

<style scoped>
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
  background-color: #f0ecfc;
  border-radius: 50%;
  margin-bottom: 1rem;
  color: #8b5cf6;
}

.intro-screen h2 {
  color: #8b5cf6;
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
  background-color: #8b5cf6;
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

.string-comparison {
  width: 100%;
  max-width: 600px;
  margin-bottom: 2rem;
}

.string-box {
  background-color: #f9f7ff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #e2d9fc;
}

.string-label {
  font-size: 14px;
  color: #8b5cf6;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.string-content {
  font-family: 'Courier New', monospace;
  font-size: 20px;
  color: #1f2937;
  word-break: break-all;
  line-height: 1.6;
  background-color: white;
  border-radius: 6px;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
}

.answer-options {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.option-button {
  padding: 0.75rem 1.5rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 150px;
}

.option-button:first-child {
  background-color: #ecfdf5;
  color: #059669;
  border-color: #a7f3d0;
}

.option-button:last-child {
  background-color: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

.option-button:first-child:hover {
  background-color: #d1fae5;
}

.option-button:last-child:hover {
  background-color: #fee2e2;
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
  background-color: #f0ecfc;
  border-radius: 50%;
  margin-bottom: 0.5rem;
  position: relative;
}

.score-value {
  font-size: 40px;
  font-weight: 700;
  color: #8b5cf6;
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
  background-color: #f9f7ff;
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
  background-color: #8b5cf6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.action-button:hover {
  background-color: #7c3aed;
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
  
  .answer-options {
    flex-direction: column;
    width: 100%;
  }
  
  .option-button {
    width: 100%;
    min-width: auto;
  }
  
  .string-content {
    font-size: 16px;
  }
}
</style>