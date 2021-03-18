"use strict"

const selectDay = document.querySelector('.select-day');
const selectMonth = document.querySelector('.select-month');
const selectYear = document.querySelector('.select-year');

const curentDate = new Date()

//заполняем селекты
const addSelectOption = (sel, from, to) => {
   for (let i = from; i <= to; i++) {
      if (sel === selectMonth) {
         let k = String(i).padStart(2, '0');
         sel.innerHTML += `<option value='${k}'>${k}</option>`;
      } else {
         sel.innerHTML += `<option value='${i}'>${i}</option>`;
      }

   }
}
const getSelectDay = addSelectOption(selectDay, 1, 31);
const getSelectMonth = addSelectOption(selectMonth, 1, 12);
const getSelectYear = addSelectOption(selectYear, 1960, curentDate.getFullYear());

//получаем value селектов + кастомная валидация
const btnSelect = document.querySelector('.button-select');
const select = document.querySelectorAll('.select-css');

let getDay = '';
let getMonth = '';
let getYear = '';

const getSelectValue = () => {
   btnSelect.setAttribute('disabled', true);
   let count = 0;
   select.forEach(elem => {
      if (elem.value === '') {
         elem.classList.add('error');
         elem.addEventListener('change', () => {
            elem.classList.remove('error');
            count++;
            if (count === 3) {
               getDay = selectDay.value;
               getMonth = selectMonth.value;
               getYear = selectYear.value;
               btnSelect.removeAttribute('disabled');
               showQuoteBlock();
            }
         })
      }
   })
}
getSelectValue()

//Меняем блоки с вопросами по клику кнопки
const btn = document.querySelectorAll('.button');
const block = document.querySelectorAll('.quiz__item');
//счётчик блоков
let count = 0;
//изменения счётчика при клике на кнопку
const increaseCount = () => {
   btn.forEach(item => {
      item.addEventListener('click', () => {
         count++;
         showBlockQuiz();
      })
   })
}
increaseCount()

// смена блоков
const load = document.querySelector('.load');
const rec = document.querySelector('.rec');

const showBlockQuiz = () => {
   //перебираем nodeList блоков
   block.forEach((elem, index) => {
      //если счётчик === индексу то убираем или добавляем класс
      if (count === index) {
         elem.classList.add('active');
      } else {
         elem.classList.remove('active');
      }
      //смена блока с анимацией загрузки через определённое время
      if (count === 3 && index === 3) {
         swapBlockNoButton(load, 2000);

      }
      if (count === 6 && index === 6) {
         swapBlockNoButton(rec, 3000)
         progress();
      }
   })
};

const swapBlockNoButton = (block, delay) => {
   setTimeout(() => {
      block.classList.remove('active');
      block.nextElementSibling.classList.add('active');
      count++;
   }, delay);
}

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
   const quote = document.querySelector('.quiz__subtitle-quote');
   if (curentAgeNumber >= 18 && curentAgeNumber <= 35) {
      quote.textContent = 'По вам скучает очень близкий человек, которого больше нет в мире живых.';
   } else if (curentAgeNumber >= 36 && curentAgeNumber <= 45) {
      quote.textContent = 'По вам скучает очень близкий человек, которого больше нет в мире живых. Возможно это дедушка или бабушка.';
   } else if (curentAgeNumber >= 46) {
      quote.textContent = 'По вам скучает очень близкий человек, которого больше нет в мире живых. Возможно это кто-то из Ваших родителей.';
   }
}


//Анимация прогрессбара 
function progress() {
   const percent = document.querySelector('.record__percent');
   const progress = document.querySelector('.record__progress');
   let count = 1;
   let per = 3;
   let loading = setInterval(animate, 15);
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
const nextDay = document.querySelector('.body-last-item__center span')
nextDay.textContent = `${String(curentDay + 1).padStart(2, '0')}.${String(curentMonth).padStart(2, '0')}.${curentYear}`

//================================================================================================================
//ДЕЛАЕМ ЗАПРОС ПО НАЖАТИЮ КНОПКИ "Позвонить и прослушать"

// const url = 'https://swapi.dev/api/people/1/';

//Делаем основной запрос
const fetchStarWars = () => {
   fetch('https://swapi.dev/api/people/1/')
      .then(response => response.json())
      .then(data => {
         getInfo(data);
         createHTMLdocument(data)
      }).catch(e => {
         console.error('Что-то пошло не так', e);
      })
}

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
}

const getItemUrl = (category, array) => {
   if (Array.isArray(category)) {
      for (const item of category) {
         fetch(item)
            .then(response => response.json())
            .then(category => {
               array.push(category.name || category.title);
            })
      }
   } else {
      fetch(category)
         .then(response => response.json())
         .then(category => {
            array.push(category.name);
         })
   }
}

//создаём HTML разметку
function createHTMLdocument(data) {
   // создаём шапку нашего блока
   const starWarsBlock = document.querySelector('.star-wars');
   const img = document.createElement('img');
   img.src = '../img/lucke.jpg';
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
         let divKey;
         let divValue;
         //вставляем информацию из вложенных запросов
         if (Array.isArray(elements) || elements.includes('http')) {
            if (key === 'homeworld') {
               createKey(divKey, keyFinal, divParent)
               createValue(divValue, worldResult, divParent)
            }
            if (key === 'films') {
               createKey(divKey, keyFinal, divParent)
               createValue(divValue, filmResult, divParent)
            }
            if (key === 'starships') {
               createKey(divKey, keyFinal, divParent)
               createValue(divValue, starshipResult, divParent)
            } if (key === 'vehicles') {
               createKey(divKey, keyFinal, divParent)
               createValue(divValue, vehiclesResult, divParent)
            }
         } else {
            createKey(divKey, keyFinal, divParent)
            createValue(divValue, elements, divParent)
         }
      }
   }, 500)
}
//создаём ключи
function createKey(divKey, keyFinal, divParent) {
   divKey = document.createElement('div');
   divKey.classList.add('key');
   divKey.textContent = keyFinal;
   divParent.append(divKey);
}
//создаём значения
function createValue(divValue, category, divParent) {
   if (Array.isArray(category)) {
      divValue = document.createElement('div');
      divValue.classList.add('value');
      divValue.innerHTML = category.join('<br>').replace(/,/);
      divParent.append(divValue);
   } else {
      divValue = document.createElement('div');
      divValue.classList.add('value');
      divValue.innerHTML = category;
      divParent.append(divValue);
   }

}

document.querySelector('.body-last-item__button').onclick = fetchStarWars;