import { createApp } from 'vue'
import '..components/Tests/Test2/style.css'
import App from '..components/Tests/Test2/App.vue'
import router from '..components/Tests/Test2/router';

createApp(App).use(router).mount('#app');
