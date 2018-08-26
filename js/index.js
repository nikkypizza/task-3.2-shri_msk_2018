import parseJSON from './utils/getData.js';
import createRatesMap from './utils/createRatesMap.js';

const HOURS_IN_DAY = 24;
const DEVICE_MODES = {
  undefined: {start: 0, end: 23},
  day: {start: 7, end: 20},
  night: {start: 21, end: 6}
};
const inputData = parseJSON(`js/data/input.json`);

// На основе "rates" из JSON составляем объект с почасовыми тарифами
const ratesRangeData = createRatesMap(inputData.rates);

const calcDeviceBestCostMap = (item) => {
  let deviceModeStart = eval(`DEVICE_MODES.${item.mode}.start`);
  let deviceModeEnd = eval(`DEVICE_MODES.${item.mode}.end`);
  let startingIndex = deviceModeStart + (item.duration - 1);
  let costVariants = {};

  if (item.mode !== `night`) {
    // берем duration как 'неразбивный блок' и прогоняем его
    // по всем возможным ценовым вариантам и собираем в объект
    for (let i = startingIndex; i <= deviceModeEnd; i++) {
      let sum = 0;

      // Прибавляем стоимость работы устройства на текущий час i
      // и оставшиеся значения от duration
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
      if (k === 0) {
        k = 1;
      }
      let sum = 0;
      // Прибавляем стоимость работы устройства на текущий час k
      // и добавляем оставшиеся значения от duration
      sum += ratesRangeData[k];
      for (let j = 0; j < item.duration - 1; j++) {
        sum += ratesRangeData[k - j];
      }
      // Введем еще один счетчик, чтобы сравнЯть ключи в
      // результирующем объекте вне зависимости от режима работы прибора
      let m = i;
      if (m >= HOURS_IN_DAY) {
        m -= HOURS_IN_DAY;
      }
      costVariants[m] = (sum * item.power / 1000).toFixed(2);
    }
  }
  // Находим минимальное значение энергопотребления и его индекс
  let minPrice = Object.values(costVariants).sort((prev, next) => prev - next)[0];
  let minPriceIndex = Object.keys(costVariants).find((key) => costVariants[key] === minPrice);

  const intervalPricesMap = {
    name: item.name,
    minPriceIndex,
    minPrice
  };
  return intervalPricesMap;
};

const getOutputData = (input) => {
  let schedule = {};
  for (let i = 0; i <= HOURS_IN_DAY - 1; i++) {
    schedule[i] = [];
  }
  let outputData = {
    schedule,
    consumedEnergy: {
      value: null,
      devices: {}
    }
  };

  input.devices.forEach((it) => {
    let cheapestOptionMap = calcDeviceBestCostMap(it);
    let scheduleFrom = cheapestOptionMap.minPriceIndex;
    let scheduleTo = parseInt(scheduleFrom, 10) + parseInt(it.duration - 1, 10);

    if (scheduleTo <= HOURS_IN_DAY - 1) {
      for (let b = scheduleFrom; b <= scheduleTo; b++) {
        outputData.schedule[b].unshift(it.id);
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

const finalOutputData = getOutputData(inputData); // Результат как объект
const finalOutputDataJSON = JSON.stringify(finalOutputData); // и как JSON

console.log(finalOutputData);
