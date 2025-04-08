<template>
  <div class="auth-container">
    <div class="login-card">
      <h1>Вход в систему</h1>
      <form @submit.prevent="login" class="login-form">
        <div class="nice-form-group">
          <label for="username">Имя пользователя</label>
          <input 
            id="username"
            v-model="username" 
            type="text" 
            placeholder="Введите имя пользователя" 
            required
            autocomplete="username"
          >
        </div>
        
        <div class="nice-form-group">
          <label for="password">Пароль</label>
          <div class="password-field">
            <input 
              id="password"
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="Введите ваш пароль" 
              required
              autocomplete="current-password"
            >
            <button 
              type="button" 
              class="toggle-password" 
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? 'Скрыть' : 'Показать' }}
            </button>
          </div>
        </div>
        
        <div class="remember-forgot">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe">
            <span>Запомнить меня</span>
          </label>
          <a href="#" class="forgot-password">Забыли пароль?</a>
        </div>
        
        <div v-if="error" class="error-message">{{ error }}</div>
        
        <button type="submit" class="login-btn" :disabled="isLoggingIn">
          <span v-if="isLoggingIn">Вход...</span>
          <span v-else>Войти</span>
        </button>
      </form>
      
      <div class="login-footer">
        <p>Нет аккаунта? <router-link to="/register">Зарегистрируйтесь</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
      rememberMe: false,
      showPassword: false,
      isLoggingIn: false,
      error: '',
    };
  },
  mounted() {
    // Проверяем, есть ли сохраненное имя пользователя
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
      this.username = rememberedUsername;
      this.rememberMe = true;
    }
  },
  methods: {
    async login() {
      if (!this.username || !this.password) {
        this.error = 'Введите имя пользователя и пароль';
        return;
      }
      
      this.isLoggingIn = true;
      this.error = '';
      
      try {
        // Отправляем данные для входа в формате, ожидаемом бэкендом
        const loginData = {
          username: this.username,
          password: this.password,
        };

        console.log('Отправляем для входа:', loginData);
        
        // Вызываем действие входа из хранилища Vuex
        await this.$store.dispatch('login', loginData);
        
        // Сохраняем имя пользователя, если выбрана опция "Запомнить меня"
        if (this.rememberMe) {
          localStorage.setItem('rememberedUsername', this.username);
        } else {
          localStorage.removeItem('rememberedUsername');
        }
        
        // Перенаправляем на главную страницу
        this.$router.push('/');
      } catch (error) {
        console.error('Ошибка входа:', error);
        
        // Более детальное отображение ошибки
        if (error.response) {
          // Если есть ответ от сервера
          if (error.response.data && error.response.data.detail) {
            this.error = error.response.data.detail;
          } else if (error.response.data && typeof error.response.data === 'object') {
            // Если ответ содержит объект с ошибками
            const errorMessages = Object.entries(error.response.data)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ');
            this.error = errorMessages;
          } else {
            this.error = `Ошибка: ${error.response.status}`;
          }
        } else if (error.request) {
          // Если запрос был отправлен, но не получен ответ
          this.error = 'Сервер не отвечает. Проверьте соединение.';
        } else {
          // Если возникла ошибка при настройке запроса
          this.error = 'Ошибка при отправке запроса.';
        }
      } finally {
        this.isLoggingIn = false;
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap");

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 10rem);
  padding: 2rem;
}

.login-card {
  background-color: #fff;
  border-radius: 0.625rem;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  width: 100%;
  max-width: 28rem;
  transition: transform 0.3s, box-shadow 0.3s;
}

.login-card:hover {
  transform: translateY(-0.25rem);
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.15);
}

h1 {
  color: #3b4ce2;
  text-align: center;
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.nice-form-group {
  position: relative;
}

.nice-form-group label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
}

.nice-form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.nice-form-group input:focus {
  outline: none;
  border-color: #3b4ce2;
  box-shadow: 0 0 0 2px rgba(59, 76, 226, 0.1);
}

.password-field {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: color 0.3s;
}

.toggle-password:hover {
  color: #3b4ce2;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.remember-me input {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}

.forgot-password {
  color: #3b4ce2;
  text-decoration: none;
  transition: color 0.3s;
}

.forgot-password:hover {
  color: #2538df;
  text-decoration: underline;
}

.login-btn {
  background: #3b4ce2;
  color: white;
  padding: 0.875rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 0.5rem;
}

.login-btn:hover {
  background: #2538df;
}

.login-btn:disabled {
  background: #a0a0a0;
  cursor: not-allowed;
}

.login-footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.login-footer a {
  color: #3b4ce2;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.login-footer a:hover {
  color: #2538df;
  text-decoration: underline;
}

.error-message {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  text-align: center;
}

@media (max-width: 640px) {
  .auth-container {
    padding: 1rem;
  }
  
  .login-card {
    padding: 1.5rem;
  }
  
  .remember-forgot {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>