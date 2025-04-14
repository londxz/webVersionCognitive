<template>
  <div class="auth-container">
    <h1>Регистрация</h1>
    <form @submit.prevent="handleSubmit" class="registration-form">
      <!-- Основная информация -->
      <div class="form-section">
        <h3>Учетные данные</h3>
        <div class="form-row">
          <div class="nice-form-group">
            <label for="username">Имя пользователя</label>
            <input id="username" v-model="user.username" placeholder="Имя пользователя" required>
          </div>
        </div>
      </div>
      
      <!-- Личная информация -->
      <div class="form-section">
        <h3>Личная информация</h3>
        <div class="form-row">
          <div class="nice-form-group">
            <label for="age">Возраст</label>
            <input id="age" v-model="user.age" type="number" min="1" max="120" placeholder="Возраст">
          </div>
          <div class="nice-form-group">
            <label for="residence">Место проживания</label>
            <input id="residence" v-model="user.residence" placeholder="Город, страна">
          </div>
        </div>
      </div>
      
      <!-- Образование -->
      <div class="form-section">
        <h3>Образование и специальность</h3>
        <div class="form-row">
          <div class="nice-form-group">
            <label for="education">Образование</label>
            <select id="education" v-model="user.education">
              <option value="">Выберите уровень образования</option>
              <option value="secondary">Среднее</option>
              <option value="higher">Высшее</option>
              <option value="postgraduate">Послевузовское</option>
              <option value="other">Другое</option>
            </select>
          </div>
          <div class="nice-form-group">
            <label for="specialty">Специальность</label>
            <input id="specialty" v-model="user.specialty" placeholder="Специальность">
          </div>
        </div>
      </div>
      
      <!-- Физические параметры -->
      <div class="form-section">
        <h3>Физические параметры</h3>
        <div class="form-row">
          <div class="nice-form-group">
            <label for="height">Рост (см)</label>
            <input id="height" v-model="user.height" type="number" min="50" max="250" placeholder="Рост">
          </div>
          <div class="nice-form-group">
            <label for="weight">Вес (кг)</label>
            <input id="weight" v-model="user.weight" type="number" min="20" max="300" placeholder="Вес">
          </div>
        </div>
        <div class="form-row">
          <div class="nice-form-group">
            <label for="dominant_hand">Доминирующая рука</label>
            <select id="dominant_hand" v-model="user.dominant_hand">
              <option value="">Выберите руку</option>
              <option value="right">Правая</option>
              <option value="left">Левая</option>
              <option value="both">Обе</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Здоровье и привычки -->
      <div class="form-section">
        <h3>Здоровье и привычки</h3>
        <div class="checkbox-grid">
          <div class="nice-form-group checkbox-group">
            <label>
              <input v-model="user.smoking" type="checkbox">
              <span>Курение</span>
            </label>
          </div>
          <div class="nice-form-group checkbox-group">
            <label>
              <input v-model="user.alcohol" type="checkbox">
              <span>Употребление алкоголя</span>
            </label>
          </div>
          <div class="nice-form-group checkbox-group">
            <label>
              <input v-model="user.insomnia" type="checkbox">
              <span>Страдаю бессонницей</span>
            </label>
          </div>
          <div class="nice-form-group checkbox-group">
            <label>
              <input v-model="user.gamer" type="checkbox">
              <span>Играю в компьютерные игры</span>
            </label>
          </div>
        </div>
        
        <div class="form-row">
          <div class="nice-form-group">
            <label for="sport">Занимаюсь спортом</label>
            <textarea id="sport" v-model="user.diseases" placeholder="Укажите виды спорта (если занимаетесь)" rows="2"></textarea>
          </div>
          <div class="nice-form-group">
            <label for="diseases">Заболевания</label>
            <textarea id="diseases" v-model="user.diseases" placeholder="Укажите ваши заболевания (если есть)" rows="2"></textarea>
          </div>
        </div>
        
        <div class="form-row">
          <div class="nice-form-group">
            <label for="current_mood">Текущее настроение</label>
            <select id="current_mood" v-model="user.current_mood">
              <option value="">Выберите настроение</option>
              <option value="excellent">Отличное</option>
              <option value="good">Хорошее</option>
              <option value="normal">Нормальное</option>
              <option value="bad">Плохое</option>
              <option value="terrible">Ужасное</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Пароль и подтверждение -->
      <div class="form-section">
        <h3>Безопасность</h3>
        <div class="form-row">
          <div class="nice-form-group">
            <label for="password">Пароль</label>
            <input id="password" v-model="user.password" type="password" placeholder="Пароль" required>
          </div>
          <div class="nice-form-group">
            <label for="password_confirm">Подтверждение пароля</label>
            <input id="password_confirm" v-model="passwordConfirm" type="password" placeholder="Подтвердите пароль" required>
            <span class="error-message" v-if="passwordError">{{ passwordError }}</span>
          </div>
        </div>
      </div>
      
      <button type="submit" class="submit-btn" :disabled="!isFormValid">Зарегистрироваться</button>
    </form>
    <p class="login-link">Уже есть аккаунт? <router-link to="/login">Войдите</router-link></p>
  </div>
</template>

<script>
export default {
  name: 'RegisterPage',
  data() {
    return {
      user: {
        username: '',
        age: null,
        education: '',
        specialty: '',
        residence: '',
        height: null,
        weight: null,
        dominant_hand: '',
        diseases: '',
        smoking: false,
        alcohol: false,
        sport: '',
        insomnia: false,
        current_mood: '',
        gamer: false,
        password: '',
      },
      passwordConfirm: '',
    };
  },
  computed: {
    passwordError() {
      if (this.passwordConfirm && this.user.password !== this.passwordConfirm) {
        return 'Пароли не совпадают';
      }
      return '';
    },
    isFormValid() {
      return !this.passwordError && this.user.username && this.user.password;
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.isFormValid) return;
      
      try {
        // Для отладки: добавьте email, даже если его нет в форме
        const userData = {
          ...this.user,
          email: `${this.user.username}@example.com`, // Временно добавляем email для отладки
          // Преобразуем числовые поля в числа
          age: this.user.age ? parseInt(this.user.age) : null,
          height: this.user.height ? parseInt(this.user.height) : null,
          weight: this.user.weight ? parseInt(this.user.weight) : null,
          password2: this.passwordConfirm
        };

        // Отправляем данные на сервер
        await this.$store.dispatch('register', userData);
        this.$router.push('/login');
      } catch (error) {
        console.error('Ошибка регистрации:', error);
        // Выводим более подробную информацию об ошибке, если она есть
        if (error.response && error.response.data) {
          console.error('Детали ошибки:', error.response.data);
          alert('Ошибка регистрации: ' + JSON.stringify(error.response.data));
        } else {
          alert('Ошибка регистрации. Проверьте данные и повторите попытку.');
        }
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap");

.auth-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 0.625rem;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #3b4ce2;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-weight: 500;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.form-section {
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  background-color: #f9f9fa;
  border-radius: 0.5rem;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.nice-form-group {
  flex: 1;
  min-width: 250px;
}

.nice-form-group label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
}

.nice-form-group input,
.nice-form-group select,
.nice-form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.nice-form-group input:focus,
.nice-form-group select:focus,
.nice-form-group textarea:focus {
  outline: none;
  border-color: #3b4ce2;
  box-shadow: 0 0 0 2px rgba(59, 76, 226, 0.1);
}

.nice-form-group textarea {
  min-height: 5rem;
  resize: vertical;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  cursor: pointer;
  width: auto;
}

.checkbox-group input {
  width: 1.125rem;
  height: 1.125rem;
  cursor: pointer;
}

.submit-btn {
  background: #3b4ce2;
  color: white;
  padding: 0.875rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
  transition: background 0.3s;
}

.submit-btn:hover {
  background: #2538df;
}

.submit-btn:disabled {
  background: #a0a0a0;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  margin-top: 1.25rem;
  font-size: 0.875rem;
}

.login-link a {
  color: #3b4ce2;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}

.error-message {
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
}

@media (max-width: 768px) {
  .auth-container {
    margin: 1rem;
    padding: 1rem;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0.625rem;
  }
  
  .nice-form-group {
    min-width: 100%;
  }
  
  .form-section {
    padding: 0.875rem;
  }
  
  .checkbox-grid {
    grid-template-columns: 1fr;
  }
}
</style>