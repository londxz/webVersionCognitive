<template>
  <div class="dashboard-container">
    <div v-if="loading" class="loading-spinner">
      <div class="spinner"></div>
      <p>Загрузка данных...</p>
    </div>

    <div v-else-if="user" class="dashboard-content">
      <div class="welcome-card">
        <div class="user-avatar">
          <span>{{ userInitials }}</span>
        </div>
        <div class="welcome-text">
          <h1>Добро пожаловать, {{ user.first_name || user.username }}!</h1>
          <p>Вы успешно вошли в систему исследования когнитивных функций.</p>
        </div>
      </div>

      <div class="dashboard-stats">
        <div class="stat-card">
          <div class="stat-icon tests-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <h3>Доступно тестов</h3>
            <p class="stat-value">10</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon completed-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <h3>Пройдено тестов</h3>
            <p class="stat-value">{{ completedTests }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon accuracy-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <h3>Средняя точность</h3>
            <p class="stat-value">{{ averageAccuracy }}%</p>
          </div>
        </div>
      </div>

      <div class="dashboard-actions">
        <router-link to="/tests" class="action-card">
          <div class="action-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16.5 15"></polyline>
            </svg>
          </div>
          <div class="action-text">
            <h3>Начать тестирование</h3>
            <p>Пройдите когнитивные тесты для оценки ваших способностей</p>
          </div>
        </router-link>

        <router-link to="/results" class="action-card">
          <div class="action-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div class="action-text">
            <h3>Посмотреть результаты</h3>
            <p>Ознакомьтесь с вашими предыдущими результатами</p>
          </div>
        </router-link>
      </div>
    </div>

    <div v-else class="error-container">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12" y2="16"></line>
        </svg>
      </div>
      <h2>Ошибка загрузки данных</h2>
      <p>Не удалось загрузить данные пользователя. Пожалуйста, попробуйте войти снова.</p>
      <button @click="logout" class="error-btn">Выйти</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardPage',
  data() {
    return {
      loading: true,
      completedTests: 0,
      averageAccuracy: 0,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    userInitials() {
      if (!this.user) return '';
      
      const firstName = this.user.first_name || '';
      const lastName = this.user.last_name || '';
      
      if (firstName && lastName) {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`;
      } else if (firstName) {
        return firstName.charAt(0);
      } else if (this.user.username) {
        return this.user.username.charAt(0).toUpperCase();
      } else {
        return 'U';
      }
    }
  },
  methods: {
    logout() {
      this.$store.commit('logout');
      this.$router.push('/login');
    },
    async fetchTestResults() {
      try {
        // Получаем данные из хранилища
        const testResults = this.$store.state.testResults || [];
        
        // Вычисляем количество уникальных пройденных тестов и среднюю точность
        const uniqueTestNames = new Set(testResults.map(result => result.test.test_name));
        this.completedTests = uniqueTestNames.size;
        
        if (testResults.length > 0) {
          this.averageAccuracy = Math.round(
            testResults.reduce((sum, result) => sum + result.accuracy, 0) / testResults.length
          );
        } else {
          this.averageAccuracy = 0;
        }
        
        this.loading = false;
      } catch (error) {
        console.error('Ошибка при загрузке результатов тестов:', error);
        this.loading = false;
      }
    }
  },
  created() {
    // Если пользовательские данные не загружены, загружаем их
    if (!this.user) {
      this.$store.dispatch('fetchUser')
        .then(() => this.fetchTestResults())
        .catch(() => {
          this.loading = false;
        });
    } else {
      this.fetchTestResults();
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Roboto', sans-serif;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 0.25rem solid #f3f3f3;
  border-top: 0.25rem solid #3b4ce2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.dashboard-content {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(1rem); }
  to { opacity: 1; transform: translateY(0); }
}

.welcome-card {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 0.75rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.1);
}

.user-avatar {
  width: 5rem;
  height: 5rem;
  background-color: #3b4ce2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
  color: white;
  font-size: 2rem;
  font-weight: 600;
}

.welcome-text h1 {
  color: #1f2937;
  margin-bottom: 0.5rem;
  font-size: 1.75rem;
}

.welcome-text p {
  color: #6b7280;
  font-size: 1.125rem;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: #fff;
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

.stat-icon {
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

.completed-icon {
  background-color: #10b981;
}

.accuracy-icon {
  background-color: #f59e0b;
}

.stat-info h3 {
  color: #4b5563;
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.stat-value {
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
}

.dashboard-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(24rem, 1fr));
  gap: 1.5rem;
}

.action-card {
  background-color: #fff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.1);
  text-decoration: none;
  transition: all 0.3s ease;
}

.action-card:hover {
  transform: translateY(-0.25rem);
  box-shadow: 0 0.5rem 1.5rem rgba(59, 76, 226, 0.2);
  background-color: #f0f4ff;
}

.action-icon {
  width: 3rem;
  height: 3rem;
  background-color: #3b4ce2;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
  color: white;
}

.action-text h3 {
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.action-text p {
  color: #6b7280;
  font-size: 0.875rem;
}

.error-container {
  text-align: center;
  padding: 3rem;
  background-color: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.1);
}

.error-icon {
  color: #ef4444;
  margin-bottom: 1.5rem;
}

.error-container h2 {
  color: #1f2937;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.error-container p {
  color: #6b7280;
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
}

.error-btn {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.error-btn:hover {
  background-color: #dc2626;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .welcome-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }
  
  .user-avatar {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .dashboard-stats {
    grid-template-columns: 1fr;
  }
  
  .dashboard-actions {
    grid-template-columns: 1fr;
  }
  
  .action-card {
    flex-direction: column;
    text-align: center;
  }
  
  .action-icon {
    margin-right: 0;
    margin-bottom: 1rem;
  }
}
</style>