<template>
    <div class="tests-container">
        <h1 class="tests-main-title">Мои тесты</h1>
  
      <!-- Главное меню -->
      <div v-if="!currentTest" class="tests-menu">
        <div class="tests-menu-grid">
          <div
            v-for="(test, key) in tests"
            :key="key"
            class="tests-menu-item"
            :class="{ 'completed-test': isTestCompleted(key) }"
            @click="selectTest(key)"
          >
            <div class="tests-menu-item-icon" :class="getIconClass(key)">
              <i class="icon" v-html="getTestIcon(key)"></i>
            </div>
            <div class="tests-menu-item-info">
              <div class="tests-menu-item-title">
                {{ test }}
                <span v-if="isTestCompleted(key)" class="completed-badge" :title="`Пройдено: ${getCompletedCount(key)} раз`">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="completed-icon">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span class="attempts-count">{{ getCompletedCount(key) }}</span>
                </span>
              </div>
              
              <div class="test-meta-info">
                <span class="tests-menu-item-category">{{ getCategoryName(getTestCategory(key)) }}</span>
                <span class="difficulty-badge" :class="getDifficultyClass(key)">{{ getDifficultyLabel(key) }}</span>
              </div>
              
              <!-- Показываем лучший результат для пройденных тестов -->
              <div v-if="isTestCompleted(key)" class="best-result">
                <div class="best-result-label">Лучший результат:</div>
                <div class="progress-bar-container">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: `${getBestAccuracy(key)}%` }" :class="getAccuracyClass(getBestAccuracy(key))"></div>
                  </div>
                  <span class="progress-value">{{ getBestAccuracy(key) }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Контейнер теста -->
      <div v-else class="test-active-container">
        <div class="test-header">
          <button @click="backToMenu" class="back-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Назад к списку
          </button>
          <h2 class="test-title">{{ tests[currentTest] }}</h2>
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
  import Timer from '../components/Tests/Test1/ThisTimer.vue';
  import AttentionTest from '../components/Tests/Test1/AttentionTest.vue';
  import ReactionTest from '../components/Tests/Test1/ReactionTest.vue';
  import MemoryTest from '../components/Tests/Test1/MemoryTest.vue';
  import TextSelectionTest from '../components/Tests/Test1/TextSelectionTest.vue';
  import SumDigitsTest from '../components/Tests/Test1/SumDigitsTest.vue';
  import SecondTest from '../components/Tests/Test2/SecondTest.vue';
  import ThirdTest from '../components/Tests/Test2/ThirdTest.vue';
  import FourthTest from '../components/Tests/Test2/FourthTest.vue';
  import FifthTest from '../components/Tests/Test2/FifthTest.vue';
  import SovietLogicTest from '../components/Tests/Test3/SovietLogicTest.vue';
  import SpatialSkillTest from '../components/Tests/Test3/SpatialThinkingTest.vue';
  import QuickResponseTest from '../components/Tests/Test3/ReactionTimeTest.vue';
  import NBackMemory from '../components/Tests/Test3/NBackGame.vue';
  import TimeEvaluator from '../components/Tests/Test3/TimePerception.vue';
  import ColorTest from '../components/Tests/Test4/ColorTest.vue';
  import PuzzleGame from '../components/Tests/Test4/PuzzleGame.vue';
  
  export default {
    name: 'TestsListPage',
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
        currentTest: null,
        tests: {
          SumDigitsTest: 'Устный счет',
          AttentionTest: 'Внимание',
          ReactionTest: 'Реакция',
          MemoryTest: 'Память',
          TextSelectionTest: 'Выбор текста',
          SecondTest: 'Внимание 2',
          ThirdTest: 'Концентрация',
          FourthTest: 'Память 2',
          FifthTest: 'Тест струппа',
          SovietLogicTest: 'Логические загадки',
          SpatialSkillTest: 'Пространственное мышление 2',
          QuickResponseTest: 'Реакция 2',
          NBackMemory: 'Память 3',
          TimeEvaluator: 'Оценка времени',
          ColorTest: 'Различие цветов',
          PuzzleGame: 'Сборка пазлов'
        },
        // Категории тестов для определения иконок
        testCategories: {
          'math': ['SumDigitsTest'],
          'attention': ['AttentionTest', 'SecondTest', 'ThirdTest', 'FifthTest'],
          'reaction': ['ReactionTest', 'QuickResponseTest'],
          'memory': ['MemoryTest', 'FourthTest', 'NBackMemory'],
          'verbal': ['TextSelectionTest'],
          'spatial': ['SpatialSkillTest', 'PuzzleGame'],
          'logic': ['SovietLogicTest'],
          'time': ['TimeEvaluator'],
          'perception': ['ColorTest']
        },
        // Уровни сложности для тестов
        testDifficulties: {
          'easy': ['AttentionTest', 'ReactionTest'],
          'medium': ['SumDigitsTest', 'MemoryTest', 'TextSelectionTest', 'SecondTest', 'ThirdTest', 'FifthTest', 'QuickResponseTest', 'TimeEvaluator', 'ColorTest', 'PuzzleGame'],
          'hard': ['FourthTest', 'SovietLogicTest', 'SpatialSkillTest', 'NBackMemory']
        },
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
        },
        // Названия категорий
        categoryNames: {
          'math': 'Математика',
          'attention': 'Внимание',
          'reaction': 'Реакция',
          'memory': 'Память',
          'verbal': 'Вербальные',
          'spatial': 'Пространственные',
          'logic': 'Логика',
          'time': 'Восприятие времени',
          'perception': 'Восприятие'
        }
      };
    },
    computed: {
      isAuthenticated() {
        return this.$store.state.token !== null;
      },
      testResults() {
        return this.$store.state.testResults || [];
      }
    },
    methods: {
      selectTest(testName) {
        this.currentTest = testName;
      },
      backToMenu() {
        this.currentTest = null;
      },
      onTestComplete(score, total_test = 10) {
        this.$refs.timer.stopTimer();
        const totalTime = this.$refs.timer.timeElapsed;
        
        // Сохраняем результат теста
        this.saveTestResult(score, total_test, totalTime);
        
        // Показываем результат
        this.showTestResult(score, total_test, totalTime);
      },
      onTestStart() {
        this.$refs.timer.resetTimer();
        this.$refs.timer.startTimer();
      },
      // Проверка, проходил ли пользователь тест
      isTestCompleted(testKey) {
        const testName = this.tests[testKey];
        return this.testResults.some(result => result.test.test_name === testName);
      },
      // Получение количества попыток прохождения теста
      getCompletedCount(testKey) {
        const testName = this.tests[testKey];
        const results = this.testResults.filter(result => result.test.test_name === testName);
        return results.length;
      },
      // Получение лучшего результата точности теста
      getBestAccuracy(testKey) {
        const testName = this.tests[testKey];
        const results = this.testResults.filter(result => result.test.test_name === testName);
        if (results.length === 0) return 0;
        
        const accuracies = results.map(result => result.accuracy);
        return Math.max(...accuracies);
      },
      // Получение класса для индикатора точности
      getAccuracyClass(accuracy) {
        if (accuracy >= 80) return 'high-accuracy';
        if (accuracy >= 50) return 'medium-accuracy';
        return 'low-accuracy';
      },
      // Определение категории теста
      getTestCategory(testName) {
        for (const [category, tests] of Object.entries(this.testCategories)) {
          if (tests.includes(testName)) {
            return category;
          }
        }
        return 'attention'; // По умолчанию, если категория не найдена
      },
      // Получение SVG-иконки для теста
      getTestIcon(testName) {
        const category = this.getTestCategory(testName);
        return this.categoryIcons[category];
      },
      // Получение класса для контейнера иконки в зависимости от категории
      getIconClass(testName) {
        const category = this.getTestCategory(testName);
        return `icon-${category}`;
      },
      // Получение названия категории
      getCategoryName(categoryKey) {
        return this.categoryNames[categoryKey] || 'Другое';
      },
      // Определение сложности теста
      getTestDifficulty(testName) {
        for (const [difficulty, tests] of Object.entries(this.testDifficulties)) {
          if (tests.includes(testName)) {
            return difficulty;
          }
        }
        return 'medium'; // Средняя сложность по умолчанию
      },
      // Получение метки сложности
      getDifficultyLabel(testName) {
        const difficulty = this.getTestDifficulty(testName);
        switch(difficulty) {
          case 'easy': return 'Легкий';
          case 'medium': return 'Средний';
          case 'hard': return 'Сложный';
          default: return 'Средний';
        }
      },
      // Получение класса для индикатора сложности
      getDifficultyClass(testName) {
        const difficulty = this.getTestDifficulty(testName);
        return `difficulty-${difficulty}`;
      },
      async saveTestResult(score, total, time) {
        try {
          const testName = this.tests[this.currentTest];
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
              test_id: Object.keys(this.tests).indexOf(this.currentTest) + 1,
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
        
        alert(`${resultMessage}\nВы завершили тест "${this.tests[this.currentTest]}" за ${seconds} секунд.\nВаш результат: ${score} из ${total} (${percentage}%).`);
        
        this.backToMenu();
      },
    },
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
  
  .tests-menu {
    margin-bottom: 3rem;
  }
  
  .tests-menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }
  
  .tests-menu-item {
    background-color: #fff;
    border-radius: 0.75rem;
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
    display: flex;
    align-items: flex-start;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid #f3f4f6;
    position: relative;
    overflow: hidden;
  }
  
  /* Стилизация для пройденных тестов */
  .completed-test {
  background-color: #f8fafc;
  border-color: #cbd5e1;
}

.tests-menu-item:hover {
  transform: translateY(-0.25rem);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  background-color: #f9fafb;
  border-color: #e5e7eb;
}
  
  .tests-menu-item-icon {
    width: 3.5rem;
    height: 3.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    color: white;
    margin-right: 1.25rem;
    flex-shrink: 0;
  }
  
  .tests-menu-item-info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  
  .tests-menu-item-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.375rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .completed-badge {
    display: flex;
    align-items: center;
    color: #047857;
    margin-left: 0.5rem;
  }
  
  .completed-icon {
    color: #10b981;
    margin-right: 0.25rem;
  }
  
  .attempts-count {
    font-size: 0.75rem;
    background-color: #d1fae5;
    color: #047857;
    padding: 0.125rem 0.375rem;
    border-radius: 1rem;
    margin-left: 0.25rem;
  }
  
  .test-meta-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 0.75rem;
    width: 100%;
    gap: 0.5rem;
  }
  
  .tests-menu-item-category {
    font-size: 0.875rem;
    color: #6b7280;
    max-width: 60%;
  }
  
  .difficulty-badge {
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
    min-width: 4.5rem;
    max-width: 6rem;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
  
  /* Стили для отображения лучшего результата */
  .best-result {
    margin-top: 0.5rem;
    width: 100%;
  }
  
  .best-result-label {
    font-size: 0.75rem;
    color: #6b7280;
    margin-bottom: 0.25rem;
  }
  
  .progress-bar-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .progress-bar {
    flex-grow: 1;
    height: 0.5rem;
    background-color: #e5e7eb;
    border-radius: 0.25rem;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    border-radius: 0.25rem;
    transition: width 0.5s ease;
  }
  
  .high-accuracy {
    background-color: #10b981;
  }
  
  .medium-accuracy {
    background-color: #0ea5e9;
  }
  
  .low-accuracy {
    background-color: #f59e0b;
  }
  
  .progress-value {
    font-size: 0.75rem;
    font-weight: 600;
    color: #374151;
    min-width: 2.5rem;
    text-align: right;
  }
  
  .icon {
    width: 24px;
    height: 24px;
  }
  
  /* Стили для активного теста */
  .test-active-container {
    background-color: #fff;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.05);
    margin-bottom: 2rem;
  }
  
  .test-header {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
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
  }
  
  .back-button:hover {
    background-color: #f3f4f6;
    color: #3b4ce2;
  }
  
  .test-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
    margin: 0 auto 0 1rem;
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
    
    .tests-menu-grid {
      grid-template-columns: 1fr;
    }
    
    .test-active-container {
      padding: 1rem;
    }
    
    .test-header {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .test-title {
      margin: 1rem 0;
    }
    
    .tests-menu-item-icon {
      width: 3rem;
      height: 3rem;
      margin-right: 0.75rem;
    }
    
    .tests-menu-item-title {
      font-size: 1rem;
    }
  }
  </style>