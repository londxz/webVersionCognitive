import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    user: null,
    token: localStorage.getItem('token') || null,
    testResults: JSON.parse(localStorage.getItem('testResults')) || [],
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.testResults = [];
      localStorage.removeItem('token');
      localStorage.removeItem('testResults');
      axios.defaults.headers.common['Authorization'] = '';
    },
    async addTestResult(state, result) {
      // Проверяем, есть ли уже результат для этого теста
      const existingIndex = state.testResults.findIndex(
        r => r.test.test_name === result.test.test_name && r.try_number === result.try_number
      );
      
      if (existingIndex >= 0) {
        // Обновляем существующий результат
        state.testResults[existingIndex] = result;
      } else {
        // Добавляем метку времени, если её нет
        if (!result.complete_time) {
          result.complete_time = new Date().toISOString();
        }
        // Добавляем новый результат
        state.testResults.push(result);
      }
      
      // Сохраняем в localStorage
      localStorage.setItem('testResults', JSON.stringify(state.testResults));
    if (!state.token) return;

      try {
        const response = await axios.post('https://georgiy.pythonanywhere.com/api/add-result/', result, {
          headers: {
            Authorization: `Token ${state.token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error('Failed to add result:', error);
        throw error;
      }
      },
  },
  actions: {
    async register({ commit }, userData) {
      try {
        console.log('Отправляемые данные:', userData);
        
        const response = await axios.post('https://georgiy.pythonanywhere.com/api/register/', userData);
        console.log('Ответ сервера:', response.data);
        
        if (response.data.token) {
          commit('setToken', response.data.token);
        }
        
        if (response.data.user) {
          commit('setUser', response.data.user);
        }
        
        return response;
      } catch (error) {
        console.error('Детали ошибки:', error.response ? error.response.data : error);
        throw error;
      }
    },
    
    async login({ commit }, credentials) {
      try {
        console.log('Данные для входа:', credentials);
        
        const response = await axios.post('https://georgiy.pythonanywhere.com/api/login/', {
          username: credentials.username,
          password: credentials.password
        });
        
        console.log('Ответ сервера при входе:', response.data);
        
        const token = response.data.token || response.data.access || response.data.key;
        
        if (token) {
          commit('setToken', token);
          axios.defaults.headers.common['Authorization'] = `Token ${token}`;
          await this.dispatch('fetchUser');
        } else {
          console.error('Токен не получен в ответе:', response.data);
          throw new Error('Не удалось получить токен авторизации');
        }
        
        return response;
      } catch (error) {
        console.error('Ошибка входа:', error);
        
        // Вывод деталей ошибки для отладки
        if (error.response && error.response.data) {
          console.error('Детали ошибки:', error.response.data);
        }
        
        throw error;
      }
    },

    async fetchUser({ commit, state }) {
      console.log(state);
      if (!state.token) return;

      try {
        const response = await axios.get('https://georgiy.pythonanywhere.com/api/user/', {
          headers: {
            Authorization: `Token ${state.token}`,
          },
        });
        console.log(response);
        commit('setUser', response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    },
  },
});