// Составляет график цен по часам
const createRatesMap = (dataRanges) => {
  const MIDNIGHT = 23;
  let rates = {};
  // Если показатель переходит через полночь -
  // отталкиваемся не от `range.to`, а от MIDNIGHT
  dataRanges.forEach((range) => {
    if (range.to > range.from) {
      for (let i = range.from; i <= range.to; i++) {
        rates[i] = range.value;
      }
    } else {
      for (let j = range.from; j <= MIDNIGHT; j++) {
        rates[j] = range.value;
      }
      for (let q = 0; q < range.to; q++) {
        rates[q] = range.value;
      }
    }
  });
  return rates;
};

export default createRatesMap;
