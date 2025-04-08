<template>
  <div id="app">
    <!-- Мобильная навигация (гамбургер меню) -->
    <nav v-if="$route.path !== '/login' && $route.path !== '/register'" class="main-navigation">
      <div class="nav-container">
        <div class="logo">
          <h1>Когнитивные тесты</h1>
        </div>
        
        <!-- Кнопка бургер-меню для мобильных устройств -->
        <button class="menu-toggle" @click="mobileMenuOpen = !mobileMenuOpen">
          <span class="menu-icon"></span>
        </button>
        
        <!-- Навигационные ссылки - скрываются на мобильных, выводятся с помощью меню -->
        <div class="nav-links" :class="{ 'show-mobile-menu': mobileMenuOpen }">
          <router-link to="/" exact @click="mobileMenuOpen = false">Главная</router-link>
          <router-link to="/tests" @click="mobileMenuOpen = false">Мои тесты</router-link>
          <router-link to="/results" @click="mobileMenuOpen = false">Результаты</router-link>
          <button @click="logout" v-if="isAuthenticated" class="logout-btn">Выйти</button>
        </div>
        
        <div class="auth-links" v-if="!isAuthenticated">
          <router-link to="/login" class="auth-btn">Войти</router-link>
          <router-link to="/register" class="auth-btn register">Зарегистрироваться</router-link>
        </div>
      </div>
    </nav>
    <main :class="{ 'test-active': isTestActive }">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      mobileMenuOpen: false
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.token !== null;
    },
    isTestActive() {
      // Проверяем, находимся ли мы на странице с активным тестом
      return this.$route.path === '/tests' && 
             this.$route.query.active === 'true';
    }
  },
  methods: {
    logout() {
      this.$store.commit('logout');
      this.mobileMenuOpen = false;
      this.$router.push('/login');
    },
  },
  watch: {
    // Закрываем мобильное меню при изменении маршрута
    '$route'() {
      this.mobileMenuOpen = false;
    }
  }
};
</script>

<style>
:root {
  --primary-color: #3b4ce2;
  --primary-hover: #2538df;
  --secondary-color: #42b983;
  --text-color: #2c3e50;
  --background-color: #f8f9fa;
  --card-background: #ffffff;
  --border-color: #e0e0e0;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Roboto', 'Avenir', Helvetica, Arial, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
}

#app {
  text-align: center;
  max-width: 100%;
  margin: 0 auto;
}

main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  padding-top: 4.5rem; /* Добавляем отступ для фиксированного меню */
}

/* Когда тест активен, делаем главное меню меньше */
main.test-active {
  padding-top: 0;
}

.main-navigation {
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 0.75rem 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.logo h1 {
  font-size: 1.25rem;
  color: var(--primary-color);
  margin: 0;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-links a {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  padding: 0.625rem 0.875rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-links a:hover {
  color: var(--primary-color);
  background-color: rgba(59, 76, 226, 0.08);
}

.nav-links a.router-link-exact-active,
.nav-links a.router-link-active {
  color: var(--primary-color);
  font-weight: 600;
  background-color: rgba(59, 76, 226, 0.08);
  border-bottom: none;
}

.auth-links {
  display: flex;
  gap: 1rem;
}

.auth-btn {
  text-decoration: none;
  padding: 0.625rem 1.125rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.auth-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.auth-btn.register {
  background-color: var(--primary-color);
  color: white;
}

.auth-btn.register:hover {
  background-color: var(--primary-hover);
}

.logout-btn {
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.625rem 1.125rem;
  color: var(--text-color);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  border-color: #ccc;
  transform: translateY(-2px);
}

/* Кнопка для мобильного меню */
.menu-toggle {
  display: none;
  background: transparent;
  border: none;
  width: 30px;
  height: 30px;
  position: relative;
  cursor: pointer;
  z-index: 101;
}

.menu-icon,
.menu-icon:before,
.menu-icon:after {
  content: '';
  display: block;
  width: 100%;
  height: 3px;
  background-color: var(--primary-color);
  position: absolute;
  transition: all 0.3s ease;
}

.menu-icon {
  top: 14px;
}

.menu-icon:before {
  top: -8px;
}

.menu-icon:after {
  top: 8px;
}

/* Общие стили для всех компонентов */
h1, h2, h3, h4, h5, h6 {
  margin-bottom: 1rem;
  color: var(--text-color);
  word-wrap: break-word;
  overflow-wrap: break-word;
}

button {
  cursor: pointer;
  font-family: inherit;
}

/* Общие стили для предотвращения выхода текста за границы */
.card-title, .test-title, .test-category, .result-title, .category-name {
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
}

/* Адаптивность */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }
  
  .menu-toggle {
    display: block;
  }
  
  .nav-links {
    position: fixed;
    top: 0;
    right: -100%;
    width: 70%;
    height: 100vh;
    background-color: white;
    flex-direction: column;
    align-items: flex-start;
    padding: 4rem 1.5rem 2rem;
    z-index: 100;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    transition: right 0.3s ease;
  }
  
  .nav-links.show-mobile-menu {
    right: 0;
  }
  
  .nav-links a {
    width: 100%;
    padding: 1rem;
    border-radius: 0;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .nav-links .logout-btn {
    margin-top: 1rem;
    width: 100%;
  }
  
  .auth-links {
    display: none;
  }
  
  main {
    padding: 1rem;
    padding-top: 4rem;
  }
  
  .logo h1 {
    font-size: 1rem;
  }
  
  /* Дополнительные стили для мобильной версии */
  .card-title, .test-title, .test-category, .result-title, .category-name {
    font-size: 1.1rem;
    line-height: 1.3;
  }
  
  /* Стиль для активного мобильного меню - анимация бургера в крестик */
  .show-mobile-menu + .menu-toggle .menu-icon {
    background-color: transparent;
  }
  
  .show-mobile-menu + .menu-toggle .menu-icon:before {
    transform: rotate(45deg);
    top: 0;
  }
  
  .show-mobile-menu + .menu-toggle .menu-icon:after {
    transform: rotate(-45deg);
    top: 0;
  }
}
</style>