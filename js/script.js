
//получаем селекты
const selectDay = document.querySelector('.select-day');
const selectMonth = document.querySelector('.select-month');
const selectYear = document.querySelector('.select-year');

const curentDate = new Date();

// заполняем селекты
const addSelectOption = (sel, from, to) => {
   for (let i = from; i <= to; i++) {
      if (sel === selectMonth) {
         let k = String(i).padStart(2, '0');
         sel.innerHTML += `<option value='${k}'>${k}</option>`;
      } else {
         sel.innerHTML += `<option value='${i}'>${i}</option>`;
      }

   }
};

const getSelectDay = addSelectOption(selectDay, 1, 31);
const getSelectMonth = addSelectOption(selectMonth, 1, 12);
const getSelectYear = addSelectOption(selectYear, 1960, curentDate.getFullYear());

//получаем value селектов + кастомная валидация
const select = document.querySelectorAll('.select-css'); // nodeList селектов
const btnSelect = document.querySelector('.btn-load');  //кнопка валидации селектов
const blockTwo = document.querySelector('.popup_blockTwo'); //блок с селектами
const blockTree = document.querySelector('.popup_blockTree'); //блок с загрузкой
const blockFour = document.querySelector('.popup_blockFour'); //следущий блок после блока с загрузкой

let getDay = ''; //переменные в которых будем хранить данные выбранные в селекте
let getMonth = ''; //переменные в которых будем хранить данные выбранные в селекте
let getYear = '';   //переменные в которых будем хранить данные выбранные в селекте

btnSelect.addEventListener('click', () => {
   select.forEach(item => {
      if (item.value === '') {
         item.classList.add('error');
      } else {
         item.classList.remove('error');
      }
   });
   if (selectDay.value !== '' && selectMonth.value !== '' && selectYear.value !== '') {
      //смена блока
      blockTwo.classList.remove('_active');
      blockTree.classList.add('_active');
      getDay = selectDay.value;
      getMonth = selectMonth.value;
      getYear = selectYear.value;
      showQuoteBlock();
      //смена блока с загрузкой через 2с
      swapBlockNoButton(blockTree, blockFour, 2);
   }

});

//смена блока через определённое время

const swapBlockNoButton = (block, block2, delay) => {
   setTimeout(() => {
      block.classList.remove('_active');
      block2.classList.add('_active');
   }, delay * 1000);
};


//Заполняем шапку 5го вопроса в зависимости от возраста
//получаем текущие год, месяц, день
const curentDay = curentDate.getDate();
const curentMonth = curentDate.getMonth() + 1;
const curentYear = curentDate.getFullYear();
//вычелсяем текущий возраст пользователя
const showQuoteBlock = () => {
   const date = `${curentYear}${String(curentMonth).padStart(2, '0')}${String(curentDay).padStart(2, '0')}`;
   const birthday = `${getYear}${String(getMonth).padStart(2, '0')}${String(getDay).padStart(2, '0')}`;
   const result = date - birthday;
   const curentAge = String(result).slice(0, 2);
   const curentAgeNumber = Number(curentAge);
   const quote = document.querySelector('.quest__subtitle-quote');
   if (curentAgeNumber >= 18 && curentAgeNumber <= 35) {
      quote.textContent = 'По вам скучает очень близкий человек, которого больше нет в мире живых.';
   } else if (curentAgeNumber >= 36 && curentAgeNumber <= 45) {
      quote.textContent = 'По вам скучает очень близкий человек, которого больше нет в мире живых. Возможно это дедушка или бабушка.';
   } else if (curentAgeNumber >= 46) {
      quote.textContent = 'По вам скучает очень близкий человек, которого больше нет в мире живых. Возможно это кто-то из Ваших родителей.';
   }
};

//запускаем анимацию прогрессбара и меняем его через 3 секунды
const btnBlockFive = document.querySelector('.btn-block-five');
const blockSix = document.querySelector('.popup_blockSix');
const blockSeven = document.querySelector('.popup_blockSeven');

btnBlockFive.addEventListener('click', () => {
   progress();
   swapBlockNoButton(blockSix, blockSeven, 3);
});

//Анимация прогрессбара 
function progress() {
   const percent = document.querySelector('.record__percent');
   const progress = document.querySelector('.record__progress');
   let count = 1;
   let per = 3;
   let loading = setInterval(animate, 25);
   function animate() {
      if (count === 100 && per === 300) {
         clearInterval(loading);
      } else {
         per = per + 3;
         count = count + 1;
         progress.style.width = per + 'px';
         percent.textContent = count + '%';
      }
   }
}



//выводим завтрашнюю дату события
const nextDay = document.querySelector('.body-last-item__center span');
nextDay.textContent = `${String(curentDay + 1).padStart(2, '0')}.${String(curentMonth).padStart(2, '0')}.${curentYear}`;


//================================================================================================================
//ДЕЛАЕМ ЗАПРОС ПО НАЖАТИЮ КНОПКИ "Позвонить и прослушать"

// const url = 'https://swapi.dev/api/people/1/';

//Делаем основной запрос
const fetchStarWars = () => {
   fetch('https://swapi.dev/api/people/1/')
      .then(response => response.json())
      .then(data => {
         getInfo(data);
         createHTMLdocument(data);
      }).catch(e => {
         console.error('Что-то пошло не так', e);
      });
};

//создаём массивы где будут храниться результаты запросов по вложенным ссылкам
const filmResult = [];
const starshipResult = [];
const vehiclesResult = [];
const worldResult = [];


//Делаем запросы по вложенным ссылкам
const getInfo = (data) => {
   if (data.homeworld) {
      const world = data.homeworld;
      getItemUrl(world, worldResult);
   }
   if (data.films) {
      const films = data.films;
      getItemUrl(films, filmResult);
   }
   if (data.starships) {
      const starships = data.starships;
      getItemUrl(starships, starshipResult);
   }
   if (data.vehicles) {
      const vehicles = data.vehicles;
      getItemUrl(vehicles, vehiclesResult);
   }
};

const getItemUrl = (category, array) => {
   if (Array.isArray(category)) {
      for (const item of category) {
         fetch(item)
            .then(response => response.json())
            .then(category => {
               array.push(category.name || category.title);
            });
      }
   } else {
      fetch(category)
         .then(response => response.json())
         .then(category => {
            array.push(category.name);
         });
   }
};

//создаём HTML разметку
function createHTMLdocument(data) {
   console.log(data);
   // создаём шапку нашего блока
   const starWarsBlock = document.querySelector('.star-wars');
   const img = document.createElement('img');
   img.src = 'img/lucke.jpg';
   starWarsBlock.prepend(img);
   const h1 = document.createElement('h1');
   h1.textContent = data.name;
   starWarsBlock.prepend(h1);

   setTimeout(() => {
      for (const key in data) {
         const elements = data[key];
         const keyFinal = key[0].toUpperCase() + key.slice(1).replace(/_/, ' ');
         //убираем не нужные елементы
         if (key === 'name' || key === 'species' || key === 'url') {
            continue;
         }
         const divParent = document.createElement('div');
         divParent.classList.add('star-wars__char');
         starWarsBlock.append(divParent);
         //вставляем информацию из вложенных запросов
         if (Array.isArray(elements) || elements.includes('http')) {
            if (key === 'homeworld') {
               createKey(keyFinal, divParent);
               createValue(worldResult, divParent);
            }
            if (key === 'films') {
               createKey(keyFinal, divParent);
               createValue(filmResult, divParent);
            }
            if (key === 'starships') {
               createKey(keyFinal, divParent);
               createValue(starshipResult, divParent);
            } if (key === 'vehicles') {
               createKey(keyFinal, divParent);
               createValue(vehiclesResult, divParent);
            }
         } else {
            createKey(keyFinal, divParent);
            createValue(elements, divParent);
         }
      }
   }, 2000);
}
//создаём ключи
function createKey(keyFinal, divParent) {
   const divKey = document.createElement('div');
   divKey.classList.add('key');
   divKey.textContent = keyFinal;
   divParent.append(divKey);
}
//создаём значения
function createValue(category, divParent) {
   const divValue = document.createElement('div');
   divValue.classList.add('value');
   if (Array.isArray(category)) {
      divValue.innerHTML = category.join('<br>').replace(/,/);
   } else {
      divValue.innerHTML = category;
   }
   divParent.append(divValue);
}


const btnRunFeth = document.querySelector('.btn_green');
btnRunFeth.addEventListener('click', () => {
   fetchStarWars();
});