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
        <h2>Тест на память</h2>
        <p>Проверьте свою способность запоминать и вспоминать детали изображений и повседневные факты</p>
        <button @click="startTest" class="action-button">Начать тест</button>
      </div>
    </div>

    <!-- Экран с вопросом -->
    <div v-else-if="currentQuestion <= totalQuestions && !testCompleted" class="question-screen">
      <div class="progress-bar">
        <div class="progress-indicator" :style="{ width: `${(currentQuestion / totalQuestions) * 100}%` }"></div>
      </div>
      
      <div class="question-counter">
        Вопрос {{ currentQuestion }}/{{ totalQuestions }}
      </div>

      <div class="question-container">
        <div class="image-frame">
          <img :src="currentImage" alt="Тестовое изображение" class="question-image">
        </div>
        
        <h3 class="question-text">{{ currentQuestionText }}</h3>

        <div class="answer-options">
          <button 
            v-for="(option, index) in currentOptions" 
            :key="index"
            @click="checkAnswer(option)" 
            class="option-button"
          >
            {{ option }}
          </button>
        </div>
      </div>
    </div>

    <!-- Экран результатов -->
    <div v-if="testCompleted" class="results-screen">
      <div class="results-content">
        <div class="results-icon" :class="{ 'high-score': score >= totalQuestions * 0.7 }">
          <svg v-if="score >= totalQuestions * 0.7" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
            <span class="score-total">/{{ totalQuestions }}</span>
          </div>
          <p class="score-label">правильных ответов</p>
        </div>
        
        <div class="result-message">
          <p v-if="score >= totalQuestions * 0.9">Отличный результат! У вас феноменальная память.</p>
          <p v-else-if="score >= totalQuestions * 0.7">Хороший результат! Ваша память работает отлично.</p>
          <p v-else-if="score >= totalQuestions * 0.5">Неплохой результат. Есть потенциал для улучшения.</p>
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
      currentQuestion: 1,
      totalQuestions: 10,
      questions: [
        {
          text: "Помните какое сегодня число?",
          options: ["Да", "Нет"],
          answer: "Да",
          image: "https://trikky.ru/wp-content/blogs.dir/1/files/2024/05/11/i-23.jpeg",
        },
        {
          text: "Просто посмотрите на эту картинку.",
          options: ["Далее"],
          answer: "Далее",
          image: "https://image.jimcdn.com/app/cms/image/transf/none/path/s303186db9a6eac8a/backgroundarea/i24b4150e4347aa1f/version/1522171045/image.jpg",
        },
        {
          text: "Какое число было обведено на первой картинке?",
          options: ["3", "4", "5"],
          answer: "4",
          image: "https://pic.rutubelist.ru/video/21/62/216230a4acde4e677dc396832de6c50b.jpg",
        },
        {
          text: "Помните что Вы вчера ели на завтрак?",
          options: ["Да", "Нет"],
          answer: "Да",
          image: "https://i.pinimg.com/originals/a0/b9/03/a0b9032669a104ae3fb94fca5aace424.jpg",
        },
        {
          text: "Помните сколько у Вас двоюродных братьев и сестер?",
          options: ["Да", "Нет"],
          answer: "Да",
          image: "https://m.media-amazon.com/images/M/MV5BNTgzNGE1MTktNzAyZC00ZWYxLTljYTUtNDYxNDE1NGFiNzIzXkEyXkFqcGdeQXVyNDg4MjkzNDk@._V1_.jpg",
        },
        {
          text: "Была ли ложка на картинке с вопросом про завтрак?",
          options: ["Да", "Нет"],
          answer: "Нет",
          image: "https://pic.rutubelist.ru/video/21/62/216230a4acde4e677dc396832de6c50b.jpg",
        },
        {
          text: "Помните день рождения своего отца?",
          options: ["Да", "Нет"],
          answer: "Да",
          image: "https://sun9-40.userapi.com/impg/a2vuhBxQUt5-IGoI1i25rN9ZRgeQOcMvLJ0BhQ/7PHF_jv9A8g.jpg?size=1280x947&quality=95&sign=f87c039426a1802ea697ca8b12f41dbb&c_uniq_tag=amtE40_42hqpxK_noX4OfAJGb0z9L0gVAwBhcM",
        },
        {
          text: "Какого цвета была куртка на девушке по центру из вопроса про братьев и сестер?",
          options: ["Красная", "Зеленая", "Синяя"],
          answer: "Синяя",
          image: "https://pic.rutubelist.ru/video/21/62/216230a4acde4e677dc396832de6c50b.jpg",
        },
        {
          text: "На картинке с отцом на небе были облака?",
          options: ["Да, много", "Да, немного", "Нет"],
          answer: "Да, много",
          image: "https://pic.rutubelist.ru/video/21/62/216230a4acde4e677dc396832de6c50b.jpg",
        },
        {
          text: "Сколько бабочек было на второй картинке?",
          options: ["3", "4", "5"],
          answer: "3",
          image: "https://pic.rutubelist.ru/video/21/62/216230a4acde4e677dc396832de6c50b.jpg",
        },
      ],
      score: 0,
      testCompleted: false,
    };
  },
  computed: {
    currentQuestionText() {
      return this.questions[this.currentQuestion - 1].text;
    },
    currentOptions() {
      return this.questions[this.currentQuestion - 1].options;
    },
    currentImage() {
      return this.questions[this.currentQuestion - 1].image;
    },
  },
  methods: {
    startTest() {
      this.testStarted = true;
      this.$emit('test-start');
    },
    checkAnswer(selectedOption) {
      const correctAnswer = this.questions[this.currentQuestion - 1].answer;
      if (selectedOption === correctAnswer) {
        this.score++;
      }

      if (this.currentQuestion < this.totalQuestions) {
        this.currentQuestion++;
      } else {
        this.testCompleted = true;
        this.$emit('test-complete', this.score, this.totalQuestions);
      }
    },
    restartTest() {
      this.currentQuestion = 1;
      this.score = 0;
      this.testCompleted = false;
      this.$emit('test-start');
    },
  },
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

.image-frame {
  width: 100%;
  max-width: 450px;
  margin: 0 auto 1.5rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.question-image {
  width: 100%;
  height: auto;
  display: block;
}

.question-text {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
  text-align: center;
}

.answer-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 400px;
}

.option-button {
  padding: 0.75rem 1.5rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.option-button:hover {
  background-color: #f9fafb;
  border-color: #3b4ce2;
  color: #3b4ce2;
}

.option-button:active {
  transform: translateY(1px);
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
  .intro-screen h2, .results-title {
    font-size: 22px;
  }
  
  .intro-screen p, .question-text, .option-button, .result-message p {
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
}
</style>