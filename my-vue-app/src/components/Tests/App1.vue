<template>
  <div class="tests-container">
    <h1 class="tests-main-title">Когнитивные тесты</h1>

    <!-- Категории тестов (главная страница) -->
    <div v-if="!currentCategory && !currentTest" class="category-grid">
      <div
        v-for="(category, key) in categories"
        :key="key"
        class="category-card"
        @click="selectCategory(key)"
      >
        <div class="category-icon" :class="`icon-${key}`">
          <i class="icon" v-html="categoryIcons[key]"></i>
        </div>
        <div class="category-content">
          <h3 class="category-title">{{ category.title }}</h3>
          <p class="category-description">{{ category.description }}</p>
        </div>
      </div>
    </div>

    <!-- Список тестов в категории -->
    <div v-else-if="currentCategory && !currentTest" class="category-detail">
      <div class="category-header">
        <button @click="backToCategories" class="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Назад
        </button>
        <div class="category-title-container">
          <div class="category-icon-small" :class="`icon-${currentCategory}`">
            <i class="icon" v-html="categoryIcons[currentCategory]"></i>
          </div>
          <h2 class="category-title-large">{{ categories[currentCategory].title }}</h2>
        </div>
      </div>

      <p class="category-detail-description">{{ categories[currentCategory].description }}</p>

      <div class="tests-list">
        <div
          v-for="test in getCategoryTests(currentCategory)"
          :key="test.key"
          class="test-card"
          @click="selectTest(test.key)"
        >
          <h3 class="test-title">{{ test.name }}</h3>
          <p class="test-description">{{ test.description }}</p>
          <div class="test-card-footer">
            <span class="difficulty" :class="`difficulty-${test.difficulty}`">
              {{ getDifficultyLabel(test.difficulty) }}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="arrow-icon">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Контейнер активного теста -->
    <div v-else-if="currentTest" class="test-active-container">
      <div class="test-header">
        <button @click="backToCategory" class="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Назад
        </button>
        <h2 class="test-active-title">{{ getTestName(currentTest) }}</h2>
        <Timer ref="timer" class="test-timer" />
      </div>
      
      <div class="test-content">
        <component
          :is="currentTest"
          @test-complete="onTestComplete"
          @test-start="onTestStart"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Timer from './Test1/ThisTimer.vue';
import AttentionTest from './Test1/AttentionTest.vue';
import ReactionTest from './Test1/ReactionTest.vue';
import MemoryTest from './Test1/MemoryTest.vue';
import TextSelectionTest from './Test1/TextSelectionTest.vue';
import SumDigitsTest from './Test1/SumDigitsTest.vue';
import SecondTest from './Test2/SecondTest.vue';
import ThirdTest from './Test2/ThirdTest.vue';
import FourthTest from './Test2/FourthTest.vue';
import FifthTest from './Test2/FifthTest.vue';
import SovietLogicTest from "../Tests/Test3/SovietLogicTest.vue";
import SpatialSkillTest from "../Tests/Test3/SpatialThinkingTest.vue";
import QuickResponseTest from "../Tests/Test3/ReactionTimeTest.vue";
import NBackMemory from "../Tests/Test3/NBackGame.vue";
import TimeEvaluator from "../Tests/Test3/TimePerception.vue";
import ColorTest from "./Test4/ColorTest.vue";
import PuzzleGame from "./Test4/PuzzleGame.vue";

export default {
  name: 'TestsApp',
  components: {
    Timer,
    AttentionTest,
    ReactionTest,
    MemoryTest,
    TextSelectionTest,
    SumDigitsTest,
    SecondTest,
    ThirdTest,
    FourthTest,
    FifthTest,
    SovietLogicTest,
    SpatialSkillTest,
    QuickResponseTest,
    NBackMemory,
    TimeEvaluator,
    ColorTest,
    PuzzleGame
  },
  data() {
    return {
      currentCategory: null,
      currentTest: null,
      categories: {
        math: {
          title: 'Математические тесты',
          description: 'Оценка способностей к счету и математическим вычислениям'
        },
        attention: {
          title: 'Тесты на внимание',
          description: 'Оценка концентрации внимания и способности к фокусировке'
        },
        reaction: {
          title: 'Тесты на реакцию',
          description: 'Измерение скорости реакции и времени отклика'
        },
        memory: {
          title: 'Тесты на память',
          description: 'Проверка кратковременной и рабочей памяти'
        },
        verbal: {
          title: 'Вербальные тесты',
          description: 'Оценка вербального интеллекта и языковых способностей'
        },
        spatial: {
          title: 'Тесты на пространственное мышление',
          description: 'Оценка способности к визуализации и манипуляции объектами в пространстве'
        },
        logic: {
          title: 'Тесты на логику',
          description: 'Проверка логического мышления и способности к решению задач'
        },
        time: {
          title: 'Тесты на восприятие времени',
          description: 'Оценка чувства времени и временной ориентации'
        },
        perception: {
          title: 'Тесты на восприятие',
          description: 'Проверка восприятия цветов, форм и других визуальных характеристик'
        }
      },
      allTests: [
        {
          key: 'SumDigitsTest',
          name: 'Устный счет',
          category: 'math',
          description: 'Проверка навыков быстрого сложения цифр и расчетов в уме',
          difficulty: 'medium'
        },
        {
          key: 'AttentionTest',
          name: 'Внимание',
          category: 'attention',
          description: 'Оценка способности различать цвета слов и их значения',
          difficulty: 'easy'
        },
        {
          key: 'ReactionTest',
          name: 'Реакция',
          category: 'reaction',
          description: 'Измерение скорости нажатия кнопки при изменении стимула',
          difficulty: 'easy'
        },
        {
          key: 'MemoryTest',
          name: 'Память',
          category: 'memory',
          description: 'Оценка кратковременной памяти и запоминания деталей',
          difficulty: 'medium'
        },
        {
          key: 'TextSelectionTest',
          name: 'Выбор текста',
          category: 'verbal',
          description: 'Поиск осмысленных слов в наборе букв',
          difficulty: 'medium'
        },
        {
          key: 'SecondTest',
          name: 'Внимание 2',
          category: 'attention',
          description: 'Проверка внимательности при сравнении строк',
          difficulty: 'medium'
        },
        {
          key: 'ThirdTest',
          name: 'Концентрация',
          category: 'attention',
          description: 'Оценка способности к длительной концентрации внимания',
          difficulty: 'medium'
        },
        {
          key: 'FourthTest',
          name: 'Память 2',
          category: 'memory',
          description: 'Проверка запоминания чисел на короткий период времени',
          difficulty: 'hard'
        },
        {
          key: 'FifthTest',
          name: 'Тест Струпа',
          category: 'attention',
          description: 'Классический тест на когнитивную гибкость и внимание',
          difficulty: 'medium'
        },
        {
          key: 'SovietLogicTest',
          name: 'Логические загадки',
          category: 'logic',
          description: 'Решение задач на логическое мышление',
          difficulty: 'hard'
        },
        {
          key: 'SpatialSkillTest',
          name: 'Пространственное мышление 2',
          category: 'spatial',
          description: 'Продвинутый тест на пространственные навыки',
          difficulty: 'hard'
        },
        {
          key: 'QuickResponseTest',
          name: 'Реакция 2',
          category: 'reaction',
          description: 'Улучшенный тест на время реакции',
          difficulty: 'medium'
        },
        {
          key: 'NBackMemory',
          name: 'N-назад',
          category: 'memory',
          description: 'Тренировка рабочей памяти методом N-назад',
          difficulty: 'hard'
        },
        {
          key: 'TimeEvaluator',
          name: 'Оценка времени',
          category: 'time',
          description: 'Проверка точности восприятия временных интервалов',
          difficulty: 'medium'
        },
        {
          key: 'ColorTest',
          name: 'Различие цветов',
          category: 'perception',
          description: 'Оценка способности различать тонкие оттенки цветов',
          difficulty: 'medium'
        },
        {
          key: 'PuzzleGame',
          name: 'Сборка пазлов',
          category: 'spatial',
          description: 'Сборка изображения из отдельных фрагментов',
          difficulty: 'medium'
        }
      ],
      // SVG иконки для каждой категории
      categoryIcons: {
        'math': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7l4-2.5 4 2.5 4-2.5 4 2.5"></path><path d="M4 12l4-2.5 4 2.5 4-2.5 4 2.5"></path><path d="M4 17l4-2.5 4 2.5 4-2.5 4 2.5"></path></svg>',
        'attention': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
        'reaction': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-16h-9l1-4z"></path></svg>',
        'memory': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="M8 2v4"></path><path d="M16 2v4"></path><circle cx="12" cy="11" r="3"></circle><path d="M12 14v4"></path></svg>',
        'verbal': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
        'spatial': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>',
        'logic': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><path d="M11 18H8a2 2 0 0 1-2-2V9"></path></svg>',
        'time': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
        'perception': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="2"></circle><circle cx="5" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle><circle cx="8" cy="20" r="2"></circle><circle cx="16" cy="20" r="2"></circle><path d="M12 6v4"></path><path d="M7 12h10"></path><path d="M9 18l-1-3"></path><path d="M15 18l1-3"></path></svg>'
      }
    };
  },
  methods: {
    selectCategory(categoryKey) {
      this.currentCategory = categoryKey;
    },
    
    selectTest(testKey) {
      this.currentTest = testKey;
    },
    
    backToCategories() {
      this.currentCategory = null;
    },
    
    backToCategory() {
      this.currentTest = null;
    },
    
    getCategoryTests(categoryKey) {
      return this.allTests.filter(test => test.category === categoryKey);
    },
    
    getTestName(testKey) {
      const test = this.allTests.find(t => t.key === testKey);
      return test ? test.name : testKey;
    },
    
    getDifficultyLabel(difficulty) {
      switch(difficulty) {
        case 'easy': return 'Легкий';
        case 'medium': return 'Средний';
        case 'hard': return 'Сложный';
        default: return 'Средний';
      }
    },
    
    onTestStart() {
      if (this.$refs.timer) {
        this.$refs.timer.resetTimer();
        this.$refs.timer.startTimer();
      }
    },
    
    onTestComplete(score, total_test = 10) {
      if (this.$refs.timer) {
        this.$refs.timer.stopTimer();
        const totalTime = this.$refs.timer.timeElapsed;
        
        // Сохраняем результат теста
        this.saveTestResult(score, total_test, totalTime);
        
        // Показываем результат
        this.showTestResult(score, total_test, totalTime);
      }
    },
    
    saveTestResult(score, total, time) {
      try {
        const test = this.allTests.find(t => t.key === this.currentTest);
        const testName = test ? test.name : this.currentTest;
        const seconds = Math.floor(time / 1000);
        const percentage = Math.round((score / total) * 100);
        
        // Определяем номер попытки
        let tryNumber = 1;
        
        // Получаем текущие результаты для этого теста
        const existingResults = this.$store.state.testResults.filter(
          result => result.test.test_name === testName
        );
        
        // Если есть предыдущие попытки, увеличиваем номер
        if (existingResults.length > 0) {
          // Находим максимальный номер попытки
          const maxTryNumber = Math.max(...existingResults.map(r => r.try_number || 1));
          tryNumber = maxTryNumber + 1;
        }
        
        // Создаем объект с результатами
        const testResult = {
          test: {
            test_id: this.allTests.findIndex(t => t.key === this.currentTest) + 1,
            test_name: testName
          },
          try_number: tryNumber,
          number_all_answers: total,
          number_correct_answers: score,
          accuracy: percentage,
          completion_time_seconds: seconds,
          complete_time: new Date().toISOString()
        };
        
        // Сохраняем результат в хранилище Vuex
        this.$store.commit('addTestResult', testResult);
        
        console.log('Сохранение результатов теста:', testResult);
      } catch (error) {
        console.error('Ошибка при сохранении результатов:', error);
      }
    },
    
    showTestResult(score, total, time) {
      const test = this.allTests.find(t => t.key === this.currentTest);
      const testName = test ? test.name : this.currentTest;
      const seconds = Math.floor(time / 1000);
      const percentage = Math.round((score / total) * 100);
      
      let resultMessage = '';
      if (percentage >= 90) {
        resultMessage = 'Отличный результат!';
      } else if (percentage >= 70) {
        resultMessage = 'Хороший результат!';
      } else if (percentage >= 50) {
        resultMessage = 'Неплохой результат.';
      } else {
        resultMessage = 'Есть куда расти.';
      }
      
      alert(`${resultMessage}\nВы завершили тест "${testName}" за ${seconds} секунд.\nВаш результат: ${score} из ${total} (${percentage}%).`);
      
      this.backToCategory();
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

.tests-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  color: #1f2937;
}

.tests-main-title {
  font-size: 2.25rem;
  color: #111827;
  text-align: center;
  margin-bottom: 3rem;
  font-weight: 700;
}

/* Стили для сетки категорий */
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.category-card {
  display: flex;
  background-color: #fff;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #f3f4f6;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.category-icon {
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.category-content {
  padding: 1.5rem;
  flex-grow: 1;
}

.category-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #111827;
}

.category-description {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

/* Стили для детальной страницы категории */
.category-detail {
  background-color: #fff;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.category-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  margin-right: 1rem;
}

.back-button:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.category-title-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.category-icon-small {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  color: white;
}

.category-title-large {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.category-detail-description {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.tests-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.test-card {
  background-color: #f9fafb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #f3f4f6;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.test-card:hover {
  background-color: #f3f4f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.test-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.75rem;
}

.test-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  flex-grow: 1;
}

.test-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.difficulty {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
}

.difficulty-easy {
  background-color: #d1fae5;
  color: #065f46;
}

.difficulty-medium {
  background-color: #e0f2fe;
  color: #0369a1;
}

.difficulty-hard {
  background-color: #fef3c7;
  color: #92400e;
}

.arrow-icon {
  color: #9ca3af;
}

/* Стили для активного теста */
.test-active-container {
  background-color: #fff;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.test-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.test-active-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 auto 0 0;
  padding-left: 1rem;
}

.test-content {
  margin-bottom: 2rem;
}

.test-timer {
  font-size: 1rem;
  font-weight: 500;
  color: #4b5563;
  background-color: #f3f4f6;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}

/* Цвета для категорий */
.icon-math {
  background-color: #6366f1; /* Индиго */
}

.icon-attention {
  background-color: #8b5cf6; /* Пурпурный */
}

.icon-reaction {
  background-color: #ec4899; /* Розовый */
}

.icon-memory {
  background-color: #14b8a6; /* Сине-зеленый */
}

.icon-verbal {
  background-color: #f59e0b; /* Янтарный */
}

.icon-spatial {
  background-color: #4f46e5; /* Темно-индиго */
}

.icon-logic {
  background-color: #0ea5e9; /* Голубой */
}

.icon-time {
  background-color: #64748b; /* Серый */
}

.icon-perception {
  background-color: #d946ef; /* Фуксия */
}

/* Адаптивный дизайн */
@media (max-width: 768px) {
  .tests-container {
    padding: 1rem;
  }
  
  .tests-main-title {
    font-size: 1.75rem;
    margin-bottom: 2rem;
  }
  
  .category-grid {
    grid-template-columns: 1fr;
  }
  
  .category-card {
    flex-direction: row;
  }
  
  .category-icon {
    width: 60px;
  }
  
  .category-title {
    font-size: 1rem;
  }
  
  .category-description {
    font-size: 0.75rem;
  }
  
  .tests-list {
    grid-template-columns: 1fr;
  }
  
  .category-title-large {
    font-size: 1.25rem;
  }
  
  .test-active-container {
    padding: 1rem;
  }
  
  .test-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .test-active-title {
    padding-left: 0;
    margin: 1rem 0;
  }
}
</style>