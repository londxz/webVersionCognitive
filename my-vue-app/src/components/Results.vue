<template>
  <div class="results-container">
    <h1 class="results-title">Ваши результаты тестирования</h1>
    
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Загрузка результатов...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12" y2="16"></line>
        </svg>
      </div>
      <h2>Не удалось загрузить результаты</h2>
      <p>{{ error }}</p>
      <button @click="fetchResults" class="retry-btn">Повторить попытку</button>
    </div>
    
    <div v-else-if="results.length === 0" class="empty-container">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      </div>
      <h2>У вас пока нет результатов</h2>
      <p>Пройдите когнитивные тесты, чтобы увидеть ваши результаты здесь</p>
      <router-link to="/tests" class="start-tests-btn">Начать тестирование</router-link>
    </div>
    
    <div v-else>
      <div class="filter-section">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Поиск по названию теста"
            class="search-input"
          >
        </div>
        <div class="filter-buttons">
          <button 
            v-for="period in filterPeriods" 
            :key="period.value"
            :class="['filter-btn', { active: currentPeriod === period.value }]"
            @click="setFilterPeriod(period.value)"
          >
            {{ period.label }}
          </button>
        </div>
      </div>
      
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-card-icon tests-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
          </div>
          <div class="stat-card-content">
            <h3>Всего тестов</h3>
            <p>{{ uniqueTestsCount }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-card-icon accuracy-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
          <div class="stat-card-content">
            <h3>Средняя точность</h3>
            <p>{{ averageAccuracy }}%</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-card-icon date-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div class="stat-card-content">
            <h3>Последний тест</h3>
            <p>{{ lastTestDate }}</p>
          </div>
        </div>
      </div>
      
      <div class="results-list">
        <div v-for="(result, index) in paginatedResults" :key="index" class="result-card">
          <div class="result-header">
            <h3>{{ result.test.test_name }}</h3>
            <span class="result-date">{{ formatDate(result.complete_time) }}</span>
          </div>
          
          <div class="result-details">
            <div class="progress-container">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: `${result.accuracy}%` }"
                  :class="getAccuracyClass(result.accuracy)"
                ></div>
              </div>
              <div class="progress-labels">
                <span>Точность</span>
                <span>{{ result.accuracy }}%</span>
              </div>
            </div>
            
            <div class="result-stats">
              <div class="stat">
                <span class="stat-label">Правильных ответов</span>
                <span class="stat-value">{{ result.number_correct_answers }} из {{ result.number_all_answers }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Попытка</span>
                <span class="stat-value">#{{ result.try_number || 1 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="totalPages > 1" class="pagination">
        <button 
          class="pagination-btn" 
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          &laquo;
        </button>
        
        <button 
          v-for="page in displayedPages" 
          :key="page"
          :class="['pagination-btn', { active: currentPage === page }]"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
        
        <button 
          class="pagination-btn" 
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          &raquo;
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResultsPage',
  data() {
    return {
      loading: true,
      error: null,
      searchQuery: '',
      currentPeriod: 'all',
      currentPage: 1,
      itemsPerPage: 5,
      filterPeriods: [
        { label: 'Все', value: 'all' },
        { label: 'За неделю', value: 'week' },
        { label: 'За месяц', value: 'month' },
        { label: 'За год', value: 'year' },
      ]
    };
  },
  computed: {
    // Получаем результаты тестов из хранилища Vuex
    results() {
      // Возвращаем результаты из хранилища
      return this.$store.state.testResults || [];
    },
    
    filteredResults() {
      let filtered = [...this.results];
      
      // Фильтрация по поисковому запросу
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(result => 
          result.test.test_name.toLowerCase().includes(query)
        );
      }
      
      // Фильтрация по периоду
      if (this.currentPeriod !== 'all') {
        const now = new Date();
        let startDate = new Date();
        
        switch (this.currentPeriod) {
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
          case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        }
        
        filtered = filtered.filter(result => 
          new Date(result.complete_time) >= startDate
        );
      }
      
      // Сортировка по дате (от новых к старым)
      return filtered.sort((a, b) => 
        new Date(b.complete_time) - new Date(a.complete_time)
      );
    },
    paginatedResults() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredResults.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredResults.length / this.itemsPerPage);
    },
    displayedPages() {
      const pages = [];
      const maxVisiblePages = 5;
      
      if (this.totalPages <= maxVisiblePages) {
        // Если всего страниц меньше или равно максимально видимым
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Если страниц больше максимально видимых
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = startPage + maxVisiblePages - 1;
        
        if (endPage > this.totalPages) {
          endPage = this.totalPages;
          startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
      }
      
      return pages;
    },
    averageAccuracy() {
      if (this.filteredResults.length === 0) return 0;
      
      const sum = this.filteredResults.reduce((total, result) => total + result.accuracy, 0);
      return (sum / this.filteredResults.length).toFixed(1);
    },
    lastTestDate() {
      if (this.filteredResults.length === 0) return 'Нет данных';
      
      return this.formatDate(this.filteredResults[0].complete_time);
    },
    // Добавляем вычисляемое свойство для подсчета уникальных тестов
    uniqueTestsCount() {
      // Получаем все уникальные названия тестов
      const uniqueTestNames = new Set(this.filteredResults.map(result => result.test.test_name));
      // Возвращаем количество уникальных тестов
      return uniqueTestNames.size;
    }
  },
  methods: {
    async fetchResults() {
      this.loading = true;
      this.error = null;
      
      try {
        // Имитируем запрос к API
        setTimeout(() => {
          // Проверяем, есть ли данные в хранилище
          if (this.$store.state.testResults.length === 0) {
            this.error = 'Нет доступных результатов. Пройдите несколько тестов, чтобы увидеть статистику.';
          }
          this.loading = false;
        }, 500);
      } catch (error) {
        console.error('Ошибка при получении результатов:', error);
        this.error = 'Не удалось загрузить результаты. Пожалуйста, попробуйте позже.';
        this.loading = false;
      }
    },
    formatDate(dateString) {
      try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(date);
      } catch (e) {
        return "Некорректная дата";
      }
    },
    setFilterPeriod(period) {
      this.currentPeriod = period;
      this.currentPage = 1; // Сбрасываем пагинацию
    },
    getAccuracyClass(accuracy) {
      if (accuracy >= 80) return 'high';
      if (accuracy >= 50) return 'medium';
      return 'low';
    }
  },
  created() {
    this.fetchResults();
  },
  watch: {
    searchQuery() {
      this.currentPage = 1; // Сбрасываем страницу при изменении поискового запроса
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

.results-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Roboto', sans-serif;
}

.results-title {
  font-size: 2rem;
  color: #111827; /* Это черный цвет, как в App1.vue */
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 600;
}

/* Загрузка и ошибки */
.loading-container,
.error-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(1rem); }
  to { opacity: 1; transform: translateY(0); }
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 0.25rem solid #f3f3f3;
  border-top: 0.25rem solid #3b4ce2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  color: #ef4444;
  margin-bottom: 1.5rem;
}

.empty-icon {
  color: #9ca3af;
  margin-bottom: 1.5rem;
}

.error-container h2,
.empty-container h2 {
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 1rem;
}

.error-container p,
.empty-container p,
.loading-container p {
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.retry-btn,
.start-tests-btn {
  background-color: #3b4ce2;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  text-decoration: none;
  display: inline-block;
}

.retry-btn:hover,
.start-tests-btn:hover {
  background-color: #2538df;
}

/* Фильтры и поиск */
.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.1);
}

.search-box {
  flex: 1;
  min-width: 15rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #3b4ce2;
  box-shadow: 0 0 0 2px rgba(59, 76, 226, 0.1);
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.625rem 1rem;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn:hover {
  background-color: #e5e7eb;
  border-color: #9ca3af;
}

.filter-btn.active {
  background-color: #3b4ce2;
  color: white;
  border-color: #3b4ce2;
}

/* Статистические карточки */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background-color: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-0.25rem);
}

.stat-card-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: white;
}

.tests-icon {
  background-color: #3b82f6;
}

.accuracy-icon {
  background-color: #10b981;
}

.date-icon {
  background-color: #f59e0b;
}

.stat-card-content h3 {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 0.375rem;
  font-weight: 500;
}

.stat-card-content p {
  font-size: 1.5rem;
  color: #1f2937;
  font-weight: 600;
}

/* Список результатов */
.results-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.result-card {
  background-color: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.result-card:hover {
  transform: translateY(-0.25rem);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.result-header h3 {
  font-size: 1.25rem;
  color: #1f2937;
  font-weight: 600;
}

.result-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.result-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.progress-container {
  width: 100%;
}

.progress-bar {
  height: 0.75rem;
  background-color: #e5e7eb;
  border-radius: 0.375rem;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  border-radius: 0.375rem;
  transition: width 0.5s ease;
}

.progress-fill.high {
  background-color: #10b981;
}

.progress-fill.medium {
  background-color: #f59e0b;
}

.progress-fill.low {
  background-color: #ef4444;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #6b7280;
}

.result-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.stat {
  flex: 1;
  min-width: 10rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  display: block;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.125rem;
  color: #1f2937;
  font-weight: 500;
}

/* Пагинация */
.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.pagination-btn {
  padding: 0.5rem 0.75rem;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.3s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #e5e7eb;
  border-color: #9ca3af;
}

.pagination-btn.active {
  background-color: #3b4ce2;
  color: white;
  border-color: #3b4ce2;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Адаптивность */
@media (max-width: 768px) {
  .results-container {
    padding: 1rem;
  }
  
  .results-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .filter-buttons {
    justify-content: center;
  }
  
  .result-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .result-stats {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .stat {
    min-width: auto;
  }
}
</style>