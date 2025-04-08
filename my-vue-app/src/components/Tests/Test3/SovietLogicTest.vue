<template>
  <div class="logic-test">
    <!-- Начальный экран -->
    <div v-if="!testStarted" class="intro-screen">
      <div class="intro-content">
        <div class="intro-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18" cy="18" r="3"></circle>
            <circle cx="6" cy="6" r="3"></circle>
            <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
            <path d="M11 18H8a2 2 0 0 1-2-2V9"></path>
          </svg>
        </div>
        <h2>Советские логические загадки</h2>
        <p>Проверьте свои аналитические способности, решая классические логические задачи. Вам необходимо внимательно изучить условия каждой задачи и найти правильное решение.</p>
        <button @click="startTest" class="action-button">Начать тест</button>
      </div>
    </div>

    <!-- Экран с тестом -->
    <div v-else class="question-screen">
      <div class="progress-bar">
        <div class="progress-indicator" :style="{ width: `${(currentTaskIndex / tasks.length) * 100}%` }"></div>
      </div>
      
      <div class="question-counter">
        Задача {{ currentTaskIndex + 1 }}/{{ tasks.length }}
      </div>

      <div class="question-container">
        <h3 class="question-text">{{ currentTask.question }}</h3>
        
        <div class="task-description" v-html="formattedDescription"></div>
        
        <div class="task-image-container" v-if="currentTask.image">
          <img 
            :src="currentTask.image" 
            alt="Изображение задачи" 
            class="task-image clickable-image" 
            @click="openImageModal(currentTask.image)" 
          />
        </div>
        
        <div class="task-controls">
          <button @click="showAnswer = !showAnswer" class="control-button show-answer">
            {{ showAnswer ? 'Скрыть ответ' : 'Показать ответ' }}
          </button>
          <div class="navigation-buttons">
            <button v-if="currentTaskIndex > 0" @click="prevTask" class="control-button nav-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Предыдущая
            </button>
            <button v-if="currentTaskIndex < tasks.length - 1" @click="nextTask" class="control-button nav-button">
              Следующая
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
            <button v-else @click="finishTest" class="control-button finish-button">
              Завершить тест
            </button>
          </div>
        </div>
        
        <div v-if="showAnswer" class="answer-container">
          <h4 class="answer-title">Ответ:</h4>
          <p class="answer-text">{{ currentTask.answer }}</p>
          <div v-if="currentTask.answerImage" class="answer-image-container">
            <img 
              :src="currentTask.answerImage" 
              alt="Решение задачи" 
              class="answer-image clickable-image" 
              @click="openImageModal(currentTask.answerImage)" 
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно для просмотра изображений -->
    <div v-if="showImageModal" class="image-modal" @click="closeImageModal">
      <div class="image-modal-content" @click.stop>
        <img :src="currentModalImage" alt="Увеличенное изображение" class="modal-image" />
        <button class="modal-close-button" @click="closeImageModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      testStarted: false,
      currentTaskIndex: 0,
      showAnswer: false,
      showImageModal: false,
      currentModalImage: null,
      tasks: [
        {
          question: "Где заяц?",
          description:
            "Ребята отправились в лес покататься на коньках и лыжах.\n\nНавстречу им выбежал заяц, и испугавшись, присел, а затем помчался по своим делам. Ребята было погнались за зайцем, но из виду его потеряли.\n\nА он, меж тем, до сих пор на картинке.\n\nПомогите детям найти зайца!",
          image: require('@/assets/test1/1.-Заяц-400x168.png'),
          answer: "Заяц затаился между мальчиком и девочкой.",
          answerImage: require('@/assets/test1/2.-Заяц-ответ-400x168.png'),
        },
        {
          question: "Кто куда?",
          description:
            "На улице встретились приятели:\n\n– Степа, здравствуй! Ты куда направляешься? – говорит Петя.\n\n– Я иду в дом №23, – отвечает Степа. – А ты куда, Петя?\n\n– Я пошел к приятелю Ивану в дом №7!\n\nКто из мальчиков на картинке Степа, а кто Петя?",
          image: require('@/assets/test1/3.-Кто-куда-400x196.png'),
          answer: "Обратите внимание на номер дома – №19. Соответственно отсчет на улице ведется слева направо. Выходит, мальчик Степа тот, что в кепке – его дорога в сторону дома с большим номером, чем 19. Пете, наоборот, нужно к дому с меньшим номером 7, значит, налево, и это мальчик с газетой.",
          answerImage: null,
        },
        {
          question: "Чей котик?",
          description:
            "Популярная задачка для детей на внимание.\n\nНа картинке три девочки: Таня, Катя и Ира.\n\nКто из них хозяйка котика и почему?",
          image: require('@/assets/test1/4.-Чей-котик-400x211.png'),
          answer: "Хозяйка котика Ира, та, что с одним бантиком на косичке – она отдала второй своему питомцу. У остальных подружек бантики на месте, у каждой по два.",
          answerImage: null,
        },
        {
          question: "Кого как зовут?",
          description:
            "На рисунке пять ребят.\n\nКоля стоит с краю, а если Нюра встанет рядом с Володей, два Пети окажутся рядом друг с другом.\n\nКого из ребят как зовут?",
          image: require('@/assets/test1/5.-Как-зовут-400x164.png'),
          answer: "Ребята по порядку: Коля, Володя, Петя, Нюра, Петя.",
          answerImage: require('@/assets/test1/6.-Как-зовут-ответ-400x189.png'),
        },
        {
          question: "Кто принесет больше воды?",
          description:
            "Два друга помогают поливать огород. Они носят воду в лейках с реки.\n\nКто из мальчиков принесет больше воды?",
          image: require('@/assets/test1/7.-Кто-воды-400x232.png'),
          answer: "У одного мальчика лейка больше, но обратите внимание: у обеих леек носики находятся на одном уровне, а значит, выше него налить воду не удастся – вспомните закон о сообщающихся сосудах. Мальчики принесут воды поровну.",
          answerImage: null,
        },
        {
          question: "В городе",
          description:
            "Эта задачка детям, которые живут в городах, наверняка будет по зубам.\n\nХудожник нарисовал городской пейзаж, но допустил пять ошибок. Найдите их!",
          image: require('@/assets/test1/8.-В-городе-400x239.png'),
          answer: "У светофора только два огня, а должно быть три.\n\nУ троллейбуса только одна штанга, художник забыл нарисовать вторую.\n\nНа улице левостороннее движение, а в СССР правостороннее. О том, что это СССР, говорит русскоязычная афиша.\n\nНа табличке указан номер дома 0, но такого быть не может.\n\nНа афише 31 сентября, а такого не бывает – проверьте по календарю.",
          answerImage: null,
        },
        {
          question: "На реке",
          description:
            "Внимательно рассмотрите картинку и ответьте на вопросы:\n\nВ каком направлении идет пароход – по течению или против?\n\nКакое время года запечатлено на картинке?\n\nКакое время дня изобразил художник?\n\nМелко или глубоко на реке в этом месте?\n\nБлизко или далеко пристань и на каком она берегу?",
          image: require('@/assets/test1/9.-На-реке-400x240.png'),
          answer: "Плавучие бакены (деревянные треугольники на воде) направлены против течения, а значит, теплоход идет вверх по руслу.\n\nНа небе стая птиц летит углом, у которого одна сторона короче другой, значит, это журавли. По кронам деревьев можно понять, где юг – на его стороне всегда больше ветвей и листьев. Объединив эти факты, определяем, что птицы летят на юг, а значит, скоро зима, соответственно на картинке изображена осень.\n\nНа вершинах бакенов есть фонари, их ставят вечером, утром снимают. На берегу за теплоходом можно разглядеть движущееся в сторону деревни стадо. Значит, художник изобразил конец дня, вечер.\n\nНа палубе матрос шестом измеряет глубину фарватера, значит, река в этом месте уже неглубокая.\n\nПассажиры подготовились к выходу – они стоят со своим багажом, значит, скоро пристань. По тем же пассажирам можно определить, с какой стороны пристань – с той, с которой вы смотрите на рисунок. Вспоминаем, что теплоход идет вверх по течению. Чтобы понять, где правый и левый берег, надо встать лицом по направлению течения. Объединив этот факт с положением пассажиров, определяем, что пристань будет на правом берегу.",
          answerImage: null,
        },
        {
          question: "Куда идет поезд?",
          description:
            "На картинке изображен участок железной дороги «Москва – Смоленск». На улице начало апреля. Поезд идет по направлению стрелки, концы которой показывают запад и восток. Определите, в какой город идет поезд – в Москву или в Смоленск?",
          image: require('@/assets/test1/10.-Поезд-400x234.png'),
          answer: "На участке железной дороги два склона, на одном снег уже растаял, на другом нет. Значит, снег лежит на северном склоне. Смоленск находится западнее Москвы. Выходит, поезд идет на запад с востока, а значит, из Москвы в Смоленск.",
          answerImage: null,
        },
        {
          question: "Загадка с туристами",
          description:
            "Рассмотрите картинку и ответьте на вопросы: \n\nСколько туристов проживает в лагере? \n\nКогда туристы приехали на поляну: недавно или сегодня? \n\nНа чем туристы добрались до поляны? \n\nДалеко ли расположен ближайший населенный пункт? \n\nНа картинке дует ветер с юга или с севера? \n\nНа изображении утро, день или вечер? \n\nКуда подевался Шура? \n\nТурист с каким именем вчера дежурил? \n\nОпределите, какое число и месяц в запечатленном дне?",
          image: require('@/assets/test1/11.-Туристы-351x400.png'),
          answer: "В лагере в настоящий момент живут 4 человека: на скатерти 4 ложки и 4 тарелки, в списке дежурства 4 имени. \n\nРебята на поляне несколько дней – между палаткой и деревом паук успел сплести паутину. \n\nУ дерева справа стоят весла, значит, туристы прибыли сюда на лодке. \n\nСлева у скатерти гуляет курица, значит, она пришла из какого-то населенного пункта, соответственно он недалеко. \n\nНа палатке есть флажок, он развевается по направлению ветра. Еловые ветки всегда гуще с юга. Значит, ветер сейчас южный. \n\nЕсли юг слева, значит, тени падают на запад, соответственно солнце в моменте находится на востоке. Выходит, на картинке утро. \n\nВидите сачок над кустом? – это Шура ловит бабочек. \n\nОпределим по рюкзакам: Коля что-то ищет в рюкзаке с буквой «К», из того, что с буквой «В», виден штатив, значит, Вася фотографирует. Мы уже определили, что Шура ловит бабочек. Значит, сегодня дежурит Петя. Смотрим на график дежурств – перед Петей, вчера, дежурил Коля. \n\nЗапечатлено утро 8 августа. Число видим в графике дежурств, а август определяем по арбузу – именно в этом сезоне во времена СССР собирали урожай этих плодов.",
          answerImage: null,
        },
        {
          question: "В советской квартире",
          description:
            "Рассматривая эту загадку, ответьте на шесть вопросов: \n\nВ какое время года происходит действие на рисунке? \n\nВ каком месяце происходит действие? \n\nХодит ли сейчас мальчик в школу или отдыхает на каникулах? \n\nПроведен ли в квартире водопровод? \n\nКроме отца и сына кто живет в квартире на картинке? \n\nКто по профессии папа мальчика?",
          image: require('@/assets/test1/12.-Квартира-400x216.png'),
          answer: "На картинке действие происходит зимой – у мальчика на ногах валенки, и истоплена печь – открыт душник. \n\nНа картинке декабрь – у календаря открыт последний лист, над ним закреплена пачка предыдущих листов. \n\nПервые семь дней в календаре зачеркнуты, значит, это первая половина месяца, а зимние каникулы начинаются позже. Выходит, мальчик ходит в школу. \n\nМальчик моет руки в подвесном рукомойнике, значит, водопровода в квартире нет. \n\nУ кресла лежат игрушки, среди них куклы, значит, в доме с большой вероятностью живет маленькая девочка. \n\nПапа мальчика – врач – у него из кармана выглядывает фонендоскоп, а на столе лежит врачебный молоточек.",
          answerImage: null,
        },
        {
          question: "На переправе",
          description:
            "Взгляните на пейзаж и подумайте: \n\nКакое время года на рисунке – ранняя весна или поздняя осень? \n\nНа север или на юг летят птицы? \n\nОпределите, в какое время суток происходит действие? \n\nСудоходная ли эта река? \n\nКакое направление у течения: на север, юг, запад или восток? \n\nГлубокая ли река у места, где сейчас стоит лодка? \n\nЕсть ли мост недалеко от этого места? \n\nДалеко ли железная дорога?",
          image: require('@/assets/test1/13.-Переправа-400x382.png'),
          answer: "В поле идет посев – лошадь запряжена в сеялку, а на деревьях нет листьев, значит, сейчас весна. При осеннем посеве на деревьях еще есть листва. \n\nВесной птицы летят с юга в сторону севера. \n\nТень от людей падает на северо-запад, значит, сейчас ранее утро. \n\nБакены на реке говорят о том, что здесь ходят суда. \n\nСудя по тому, как вода огибает бакен, река течет с севера на юг. \n\nРядом с лодкой рыбачит мальчик, поплавок на его удочке далеко от крючка, выходит, у берега довольно глубоко. \n\nХорошо организованная переправа указывает на то, что моста рядом нет. \n\nРядом с переправой стоит железнодорожник – железная дорога, скорее всего, рядом.",
          answerImage: null,
        },
        {
          question: "Ночная дорога",
          description:
            "Художник допустил семь ошибок на рисунке. Попробуйте найти все.",
          image: require('@/assets/test1/14.-Дорога-400x228.png'),
          answer: "Тень от ЛЭП не такая, какой должна быть. \n\nНа ЛЭП художник забыл нарисовать изоляторы. \n\nСозвездие Большая Медведица изображено неправильно – зеркально. \n\nМежду Большой Медведицей и Полярной звездой не может находиться Луна. \n\nВ зоне ЛЭП деревья расти не могут – это запрещено и их постоянно убирают. \n\nУказатель стоит на с той стороны – он должен быть справа при правостороннем движении, а действие происходит в СССР – на картинке автомобиль ГАЗ – 13 «Чайка». \n\nГрузовик едет по следу от колес «Чайки», но в другую сторону, хотя дорога, очевидно, рассчитана на две полосы.",
          answerImage: null,
        },
        {
          question: "С каким счётом закончился матч?",
          description:
            "Восемь болельщиков переживают каждый гол. Всего забито восемь голов. Определите, с каким счетом закончился матч?",
          image: require('@/assets/test1/19.-Звездочка-2-353x400.png'),
          answer: "Отследите реакцию болельщиков, и вы поймете, кто за какую команду болел. Персонажи на местах 1, 5, 6, 7 болели за одну команду, остальные за другую – об этом говорит синхронность чувств людей. Получается, первые радовались больше, их команда победила со счетом 5:3.",
          answerImage: require('@/assets/test1/20.-Здездочка-2-ответ-353x400.png'),
        },
        {
          question: "Что хочет сказать жестами мальчик?",
          description:
            "Язык жестов советские дети, да и взрослые тоже, использовали довольно часто. Эта задачка как раз на расшифровку посланий – попробуйте догадаться, что хочет сказать мальчик. Подсказка: определите часто повторяющиеся движения, сопоставьте их с распространенными звуками, а затем подберите смысл под оставшиеся движения.",
          image: require('@/assets/test1/21.-Звездочка-3.png'),
          answer: "Жесты под номерами 2, 8, 12, 15, очевидно, самые популярные. По логике это самые часто встречающиеся буквы А и О. Повторяются и буквы 5, 11 и 14; 9 и 13. Дальше нужно подбирать смысл. Один из наиболее вероятных ответов:",
          answerImage: require('@/assets/test1/22.-Звездочка-3-ответ.png'),
        },
        {
          question: "Кто сильнее?",
          description:
            "Четыре мальчика, по два с каждом стороны, стараются растащить палки, перешнурованные веревкой. Один конец веревки привязан к одной палке, свободный конец держит девочка и тянет его к себе. Чем закончится состязание?",
          image: require('@/assets/test1/23.-Звездочка-4-400x331.png'),
          answer: "Конструкция из перешнурованных между собой палок – это устойчивый полиспаст. В данном случае у девочки 16-кратное превосходство в силе – если она приложит небольшое усилие, с легкостью притянет палки друг к дружке, у мальчиков не получится их разъединить.",
          answerImage: null,
        },
      ],
    };
  },
  computed: {
    currentTask() {
      return this.tasks[this.currentTaskIndex];
    },
    formattedDescription() {
      return this.currentTask.description
        .split("\n\n")
        .map((paragraph) => `<p>${paragraph}</p>`)
        .join("");
    },
  },
  methods: {
    startTest() {
      this.testStarted = true;
      this.currentTaskIndex = 0;
      this.showAnswer = false;
      this.$emit('test-start');
    },
    
    nextTask() {
      if (this.currentTaskIndex < this.tasks.length - 1) {
        this.currentTaskIndex++;
        this.showAnswer = false;
      }
    },
    
    prevTask() {
      if (this.currentTaskIndex > 0) {
        this.currentTaskIndex--;
        this.showAnswer = false;
      }
    },
    
    finishTest() {
      this.$emit('test-complete', this.tasks.length);
    },
    
    openImageModal(image) {
      if (image) {
        this.currentModalImage = image;
        this.showImageModal = true;
      }
    },
    
    closeImageModal() {
      this.showImageModal = false;
    }
  },
};
</script>

<style scoped>
.logic-test {
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
  background-color: #e0f2fe;
  border-radius: 50%;
  margin-bottom: 1rem;
  color: #0ea5e9;
}

.task-image-container {
  margin-bottom: 1.5rem;
  background-color: #f7f7f7;
  padding: 1rem;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  display: flex;
  justify-content: center;
}

.task-image {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.clickable-image {
  cursor: pointer;
  transition: transform 0.2s;
}

.clickable-image:hover {
  transform: scale(1.05);
}

.task-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 600px;
}

.control-button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.show-answer {
  background-color: #f0f9ff;
  color: #0ea5e9;
  border: 1px solid #bae6fd;
  width: 100%;
}

.show-answer:hover {
  background-color: #e0f2fe;
}

.navigation-buttons {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.nav-button {
  flex: 1;
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.nav-button:hover {
  background-color: #e5e7eb;
}

.finish-button {
  flex: 1;
  background-color: #0ea5e9;
  color: white;
  border: none;
}

.finish-button:hover {
  background-color: #0284c7;
}

.answer-container {
  margin-top: 1.5rem;
  background-color: #f0f9ff;
  padding: 1.5rem;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  border: 1px solid #bae6fd;
  text-align: left;
}

.answer-title {
  font-size: 18px;
  font-weight: 600;
  color: #0ea5e9;
  margin-bottom: 1rem;
}

.answer-text {
  font-size: 16px;
  line-height: 1.6;
  color: #1f2937;
  white-space: pre-line;
}

.answer-image-container {
  margin-top: 1.5rem;
  background-color: #f7f7f7;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: center;
}

.answer-image {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.action-button {
  padding: 0.75rem 1.5rem;
  background-color: #0ea5e9;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.action-button:hover {
  background-color: #0284c7;
}

/* Модальное окно для просмотра изображений */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.image-modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.modal-image {
  max-width: 100%;
  max-height: 90vh;
  border-radius: 8px;
}

.modal-close-button {
  position: absolute;
  top: -40px;
  right: 0;
  background-color: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 640px) {
  .intro-screen h2, .question-text {
    font-size: 22px;
  }
  
  .intro-screen p, .task-description p, .answer-text {
    font-size: 14px;
  }
  
  .intro-icon {
    width: 60px;
    height: 60px;
  }
  
  .navigation-buttons {
    flex-direction: column;
  }
  
  .control-button {
    font-size: 14px;
    padding: 0.625rem 1rem;
  }
  .intro-screen h2 {
    color: #0ea5e9;
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
  background-color: #0ea5e9;
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

.question-text {
  font-size: 20px;
  font-weight: 600;
  color: #0ea5e9;
  margin-bottom: 1.5rem;
  text-align: center;
}

.task-description {
  margin-bottom: 1.5rem;
  background-color: #f0f9ff;
  padding: 1.5rem;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  text-align: left;
  border: 1px solid #bae6fd;
}

.task-description p {
  margin-bottom: 1rem;
  font-size: 16px;
  line-height: 1.6;
  color: #1f2937;
}

.task-description p:last-child {
  margin-bottom: 0;
}

.task-image-container {
  margin-bottom: 1.5rem;
  background-color: #f7f7f7;
  padding: 1rem;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  display: flex;
  justify-content: center;
}
}
</style>