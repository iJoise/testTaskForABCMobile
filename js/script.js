
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
//ф-я преобразования http в https
const HTTPSify = (url) => {
   const urlObj = new URL(url)
   urlObj.protocol = 'https'
   return urlObj.toString()
}
//ф-я запросов по вложенным ссылкам
const fetchItem = (endpointUrl) =>
   fetch(HTTPSify(endpointUrl)).then((r) => r.json())

//ф-я запроса характеристик персонажа по id
const getPersonData = (personId) =>
   fetch(`https://swapi.dev/api/people/${personId}/`).then((r) => r.json())

/**
 * создаём новый объект с учётом ответа по вложенным сслкам
 */
const enrichPersonData = async (data) => {
   return {
      ...data,
      homeworld: await fetchItem(data.homeworld),
      films: await Promise.all(data.films.map(fetchItem)),
      vehicles: await Promise.all(data.vehicles.map(fetchItem)),
      starships: await Promise.all(data.starships.map(fetchItem)),
      species: await Promise.all(data.species.map(fetchItem))
   }
}

/**
 *  Нормализуем объект для дальнейшего рендера на страницу
 */
const normalizePersonData = (data) => {
   const {
      height,
      mass,
      hair_color,
      skin_color,
      eye_color,
      birth_year,
      gender,
      homeworld,
      films,
      vehicles,
      starships,
      created,
      edited,
      ...rest
   } = data

   return {
      ...rest,
      characteristics: [
         { name: 'Height', value: height },
         { name: 'Mass', value: mass },
         { name: 'Hair color', value: hair_color },
         { name: 'Skin Color', value: skin_color },
         { name: 'Eye Color', value: eye_color },
         { name: 'Birth Year', value: birth_year },
         { name: 'Gender', value: gender },
         { name: 'Homeworld', value: homeworld.name },
         { name: 'Films', value: films.map((film) => film.title).join(', ') },
         {
            name: 'Vehicles',
            value: vehicles.map((vehicles) => vehicles.name).join(', ')
         },
         {
            name: 'Starships',
            value: starships.map((ship) => ship.name).join(', ')
         },
         { name: 'Created at', value: new Date(created).toLocaleDateString() },
         { name: 'Edited at', value: new Date(created).toLocaleDateString() }
      ]
   }
}
/**
 * Рендер персонажа на страницу
 */
const renderPerson = (data) => {
   const renderTarget = document.querySelector('.star-wars')
   renderTarget.innerHTML = `
      <h1>${data.name}</h1>
      <img src="img/lucke.jpg">
      ${data.characteristics
         .map(
            (char) => `
            <div class="star-wars__char">
               <div class="key">${char.name}</div>
               <div class="value">${char.value}</div>
            </div>
      `
         )
         .join('')}
   `
}

const btnRunFetch = document.querySelector('.btn_green')

btnRunFetch.addEventListener('click', () =>
   getPersonData(1)
      .then((data) => {
         console.log('Raw API data', data)
         return enrichPersonData(data)
      })
      .then((data) => {
         console.log('Enriched person data', data)
         return normalizePersonData(data)
      })
      .then((data) => {
         console.log('Normalized person data', data)
         renderPerson(data)
      })
)
