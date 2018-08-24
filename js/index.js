import parseJSON from './utils/getData.js';
import createRatesMap from './utils/createRatesMap.js';

const pathToInputData = `js/data/input.json`;
// Принимаем JSON и преобразуем его в объект
const inputData = parseJSON(pathToInputData);
// На основе "rates" из JSON составляем объект с почасовыми тарифами
const ratesRangeData = createRatesMap(inputData.rates);
const HOURS_IN_DAY = 24;
// Расписание работы режимов
const DEVICE_MODES = {
  undefined: { start: 0, end: 23 },
  day: { start: 7, end: 20 },
  night: { start: 21, end: 6 }
};

// Принимает объект устройства и возвращает значение часа
// с которого начинать работу будет дешевле всего, и стоимость работы
const calcDeviceBestCostMap = (item) => {
  let deviceModeStart = eval(`DEVICE_MODES.${item.mode}.start`);
  let deviceModeEnd = eval(`DEVICE_MODES.${item.mode}.end`);
  let startingIndex = deviceModeStart + (item.duration - 1);
  let costVariants = {};

  // Алгоритм для дневного и круглосуточного режимов
  if (item.mode !== `night`) {
    // Устройство должно работать неприрывно напротяжении своего duration:
    //  - берем duration как 'неразбивный блок' и прогоняем его по всем возможным ценовым вариантам
    //  - собираем их в объект
    for (let i = startingIndex; i <= deviceModeEnd; i++) {
      let sum = 0;

      // Прибавляем стоимость работы устройства на текущий час i
      // и добавляем оставшиеся значения от item.duration
      sum += ratesRangeData[i];
      for (let j = 0; j < item.duration - 1; j++) {
        sum += ratesRangeData[i - j];
      }

      costVariants[i] = (sum * item.power / 1000).toFixed(2);
    }
  } else {
    const NIGHT_MODE_BY_ITERATION = 30;

    // Для преодоления полуночи и сохранения релевантных цен
    // сбрасываем счетчик k вычитая из него HOURS_IN_DAY
    for (let i = startingIndex; i <= NIGHT_MODE_BY_ITERATION; i++) {
      let k = i >= HOURS_IN_DAY ? i - HOURS_IN_DAY : i;
      if (k === 0) { k = 1; }
      let sum = 0;
      // Прибавляем стоимость работы устройства на текущий час k
      // и добавляем оставшиеся значения от item.duration
      sum += ratesRangeData[k];
      for (let j = 0; j < item.duration - 1; j++) {
        sum += ratesRangeData[k - j];
      }

      // Введем еще один счетчик чтобы сравнЯть ключи в
      // результирующем объекте вне зависимости от режима работы прибора
      let m = i;
      if (m >= HOURS_IN_DAY) { m -= HOURS_IN_DAY; }
      costVariants[m] = (sum * item.power / 1000).toFixed(2);
    }
  }
  // Находим минимальное значение энергопотребления ...
  let minPrice = Object.values(costVariants).sort((prev, next) => prev - next)[0];
  // И индекс его начала
  let minPriceIndex = Object.keys(costVariants).find((key) => costVariants[key] === minPrice);

  const intervalPricesMap = { name: item.name, minPriceIndex, minPrice }
  return intervalPricesMap;
};

// Собирает все вычисления в аутпут объект
const getOutputData = (inputData) => {
  var schedule = {};
  for (var i = 0; i <= HOURS_IN_DAY - 1; i++) {
    schedule[i] = [];
  }
  let outputData = {
    schedule: schedule,
    consumedEnergy: {
      value: null,
      devices: {}
    }
  };

  inputData.devices.forEach((it) => {
    let cheapestOptionMap = calcDeviceBestCostMap(it);
    let scheduleFrom = cheapestOptionMap.minPriceIndex;
    let scheduleTo = parseInt(scheduleFrom) + parseInt(it.duration - 1);

    if (scheduleTo <= HOURS_IN_DAY - 1) {
      for (let i = scheduleFrom; i <= scheduleTo; i++) {
        outputData.schedule[i].unshift(it.id);
      }
    } else {
      for (let j = scheduleFrom; j <= HOURS_IN_DAY - 1; j++) {
        outputData.schedule[j].unshift(it.id);
      }
      for (let k = 0; k < scheduleFrom; k++) {
        outputData.schedule[k].unshift(it.id);
      }
    }
    outputData.consumedEnergy.value += parseFloat(cheapestOptionMap.minPrice);
    outputData.consumedEnergy.devices[it.id] = cheapestOptionMap.minPrice;
  });

  return outputData;
};

// Результат как объект
const finalOutputData = getOutputData(inputData);
// и как JSON
const finalOutputDataJSON = JSON.stringify(finalOutputData);

console.log(finalOutputData);

/*
TODO:
- Рефакторинг, избавиться от eval
- Написать TLD юнит тесты
*/
