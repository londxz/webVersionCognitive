<template>
    <div class="timer">
      Время прохождения теста: {{ formattedTime }}
    </div>
  </template>
  
  <script>
  export default {
    name: 'ThisTimer', // Измените имя компонента здесь
    data() {
      return {
        timeElapsed: 0,
        timer: null,
      };
    },
    computed: {
      formattedTime() {
        const seconds = Math.floor((this.timeElapsed / 1000) % 60);
        const minutes = Math.floor(this.timeElapsed / 60000);
        return `${minutes} мин ${seconds} сек`;
      },
    },
    methods: {
      startTimer() {
        this.resetTimer();
        this.timer = setInterval(() => {
          this.timeElapsed += 100;
        }, 100);
      },
      stopTimer() {
        clearInterval(this.timer);
        this.timer = null;
      },
      resetTimer() {
        this.stopTimer();
        this.timeElapsed = 0;
      },
    },
    beforeUnmount() {
      this.stopTimer();
    },
  };
  </script>
  
  <style>
  .timer {
    font-size: 18px;
    font-weight: bold;
    margin: 20px 0;
    text-align: center;
  }
  </style>