<template>
  <div class="time-test">
    <!-- Начальный экран -->
    <div v-if="!testStarted" class="intro-screen">
      <div class="intro-content">
        <div class="intro-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <h2>Тест на восприятие времени</h2>
        <p>Проверьте свою способность оценивать временные интервалы. Вам нужно будет отмерить заданные промежутки времени, ориентируясь на свое внутреннее чувство.</p>
        <button @click="startTest" class="action-button">Начать тест</button>
      </div>
    </div>

    <!-- Экран с тестом -->
    <div v-else class="question-screen">
      <div class="progress-bar">
        <div class="progress-indicator" :style="{ width: `${(records.length / maxAttempts) * 100}%` }"></div>
      </div>
      
      <div class="question-counter">
        Попытка {{ records.length + 1 }}/{{ maxAttempts }}
      </div>

      <div class="question-container">
        <div class="time-selector" v-if="!isTiming && !measuredTime">
          <h3 class="question-text">Выберите временной интервал:</h3>
          <div class="interval-buttons">
            <button
              v-for="sec in intervals"
              :key="sec"
              @click="startInterval(sec)"
              class="interval-button"
            >
              {{ sec }} секунд
            </button>
          </div>
        </div>
        
        <div 
          class="time-box" 
          :class="{ 'waiting': !isTiming && !measuredTime, 'timing': isTiming, 'completed': measuredTime }"
          @click="handleClick"
        >
          <div v-if="!isTiming && !measuredTime" class="time-status">
            Выберите интервал и нажмите, чтобы начать
          </div>
          <div v-else-if="isTiming" class="time-status">
            <p>Отсчитываем {{ chosenSec }} секунд</p>
            <p class="time-instruction">Нажмите, когда считаете, что время прошло</p>
          </div>
          <div v-else class="time-status">
            <p>Ваш результат: <span class="time-result">{{ measuredTime.toFixed(2) }}</span> сек</p>
            <p>Отклонение: <span class="time-deviation" :class="getDeviationClass(measuredTime, chosenSec)">
              {{ getDeviation(measuredTime, chosenSec) }}
            </span></p>
            <button @click="resetTimer" class="action-button">Следующая попытка</button>
          </div>
        </div>
      </div>
      
      <!-- Результаты попыток -->
      <div v-if="records.length > 0" class="records-container">
        <h4 class="records-title">Ваши результаты:</h4>
        <div class="records-list">
          <div v-for="(record, idx) in records" :key="idx" class="record-item">
            <div class="record-info">
              <span class="record-label">Задано:</span>
              <span class="record-value">{{ record.planned }} сек</span>
            </div>
            <div class="record-info">
              <span class="record-label">Результат:</span>
              <span class="record-value">{{ record.measured.toFixed(2) }} сек</span>
            </div>
            <div class="record-info">
              <span class="record-label">Отклонение:</span>
              <span class="record-value" :class="getDeviationClass(record.measured, record.planned)">
                {{ getDeviation(record.measured, record.planned) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Финальные результаты -->
      <div v-if="showFinalResults" class="final-results">
        <div class="results-content">
          <div class="results-icon" :class="{ 'high-score': averageError < 1 }">
            <svg v-if="averageError < 1" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
              <span class="score-value">{{ averageError.toFixed(2) }}</span>
              <span class="score-unit">сек</span>
            </div>
            <p class="score-label">среднее отклонение</p>
          </div>
          
          <div class="result-stats">
            <div class="stat-item">
              <span class="stat-label">Лучший результат:</span>
              <span class="stat-value">{{ bestResult.toFixed(2) }} сек</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Худший результат:</span>
              <span class="stat-value">{{ worstResult.toFixed(2) }} сек</span>
            </div>
          </div>
          
          <div class="result-message">
            <p v-if="averageError < 0.5">Отличный результат! У вас исключительное чувство времени.</p>
            <p v-else-if="averageError < 1">Хороший результат! Ваше восприятие времени точнее, чем у большинства людей.</p>
            <p v-else-if="averageError < 2">Неплохой результат. У вас хорошее чувство времени.</p>
            <p v-else>Восприятие времени можно тренировать! Регулярные упражнения помогут улучшить точность.</p>
          </div>
          
          <button @click="restartTest" class="action-button">Пройти тест снова</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      testStarted: false,
      intervals: [3, 5, 7, 10],
      chosenSec: null,
      startTime: null,
      isTiming: false,
      measuredTime: null,
      records: [],
      maxAttempts: 5,
      showFinalResults: false
    };
  },
  computed: {
    averageError() {
      if (this.records.length === 0) return 0;
      const totalError = this.records.reduce((acc, rec) => acc + Math.abs(rec.planned - rec.measured), 0);
      return totalError / this.records.length;
    },
    bestResult() {
      if (this.records.length === 0) return 0;
      return Math.min(...this.records.map(rec => Math.abs(rec.planned - rec.measured)));
    },
    worstResult() {
      if (this.records.length === 0) return 0;
      return Math.max(...this.records.map(rec => Math.abs(rec.planned - rec.measured)));
    }
  },
  methods: {
    startTest() {
      this.testStarted = true;
      this.records = [];
      this.showFinalResults = false;
      this.$emit('test-start');
    },
    
    startInterval(sec) {
      this.chosenSec = sec;
    },
    
    handleClick() {
      if (this.measuredTime !== null || !this.chosenSec) {
        return; // Если уже есть измерение или не выбран интервал
      }
      
      if (!this.isTiming) {
        // Начинаем отсчет
        this.startTime = performance.now();
        this.isTiming = true;
      } else {
        // Завершаем отсчет и фиксируем результат
        const elapsed = (performance.now() - this.startTime) / 1000;
        this.measuredTime = elapsed;
        this.isTiming = false;
        
        // Сохраняем результат попытки
        this.records.push({ 
          planned: this.chosenSec, 
          measured: elapsed 
        });
        
        // Если это была последняя попытка, показываем финальные результаты
        if (this.records.length >= this.maxAttempts) {
          setTimeout(() => {
            this.showFinalResults = true;
            this.$emit('test-complete', this.calculateScore());
          }, 2000);
        }
      }
    },
    
    resetTimer() {
      this.chosenSec = null;
      this.startTime = null;
      this.isTiming = false;
      this.measuredTime = null;
    },
    
    getDeviation(measured, planned) {
      const diff = (measured - planned).toFixed(2);
      return diff > 0 ? `+${diff}` : `${diff}`;
    },
    
    getDeviationClass(measured, planned) {
      const diff = Math.abs(measured - planned);
      if (diff < 0.5) return 'excellent';
      if (diff < 1) return 'good';
      if (diff < 2) return 'average';
      return 'poor';
    },
    
    calculateScore() {
      // Расчет оценки: обратно пропорционально ошибке
      // Если среднее отклонение 0.5 сек или меньше - 10 баллов
      // Если 2 секунды и больше - 1 балл
      return Math.max(1, Math.min(10, Math.round(10 - (this.averageError / 0.2))));
    },
    
    restartTest() {
      this.startTest();
    }
  }
};
</script>

<style scoped>
.time-test {
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
  background-color: #f1f5f9;
  border-radius: 50%;
  margin-bottom: 1rem;
  color: #64748b;
}

.intro-screen h2 {
  color: #64748b;
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
  background-color: #64748b;
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

.time-selector {
  width: 100%;
  max-width: 500px;
  margin-bottom: 1.5rem;
  text-align: center;
}

.question-text {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  text-align: center;
}

.interval-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.interval-button {
  padding: 0.75rem 1.25rem;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.interval-button:hover {
  background-color: #e2e8f0;
  color: #475569;
}

.time-box {
  width: 100%;
  max-width: 500px;
  height: 200px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.time-box.waiting {
  background-color: #f8fafc;
  border: 2px dashed #cbd5e1;
}

.time-box.timing {
  background-color: #fef2f2;
  border: 2px solid #fee2e2;
  animation: pulse 2s infinite;
}

.time-box.completed {
  background-color: #f0f9ff;
  border: 2px solid #bae6fd;
  cursor: default;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.2);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}

.time-status {
  text-align: center;
  padding: 1.5rem;
  width: 100%;
}

.time-instruction {
  font-size: 14px;
  color: #ef4444;
  margin-top: 1rem;
}

.time-result {
  font-size: 24px;
  font-weight: 600;
  color: #0ea5e9;
}

.time-deviation {
  font-weight: 600;
}

.time-deviation.excellent {
  color: #10b981;
}

.time-deviation.good {
  color: #0ea5e9;
}

.time-deviation.average {
  color: #f59e0b;
}

.time-deviation.poor {
  color: #ef4444;
}

/* Стили для списка результатов */
.records-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto 1.5rem;
}

.records-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  text-align: center;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.record-item {
  display: flex;
  justify-content: space-between;
  background-color: #f8fafc;
  padding: 0.75rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.record-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.record-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.record-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

/* Стили финальных результатов */
.final-results {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.results-content {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 500px;
  text-align: center;
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
  background-color: #f1f5f9;
  border-radius: 50%;
  margin-bottom: 0.5rem;
  position: relative;
}

.score-value {
  font-size: 32px;
  font-weight: 700;
  color: #64748b;
}

.score-unit {
  font-size: 16px;
  color: #94a3b8;
  position: absolute;
  bottom: 30px;
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
  color: #64748b;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.result-message {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f1f5f9;
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
  background-color: #64748b;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.action-button:hover {
  background-color: #475569;
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
    font-size: 28px;
  }
  
  .score-unit {
    font-size: 14px;
    bottom: 25px;
    right: 25px;
  }
  
  .intro-icon, .results-icon {
    width: 60px;
    height: 60px;
  }
  
  .time-box {
    height: 150px;
  }
  
  .interval-buttons {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .interval-button {
    flex: 1;
    min-width: 80px;
    font-size: 14px;
    padding: 0.625rem 1rem;
  }
  
  .record-item {
    padding: 0.625rem;
  }
  
  .record-label {
    font-size: 10px;
  }
  
  .record-value {
    font-size: 12px;
  }
}
</style>