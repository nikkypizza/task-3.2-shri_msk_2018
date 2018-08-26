import {assert} from 'chai';
import createRatesMap from '../utils/createRatesMap.js';

const getMockArr = (objAmount, from, to) => {
  const mockArr = [];

  for (let i = 0; i < objAmount; i++) {
    let mockArrIt = {
      from,
      to,
      value: 10
    };
    mockArr[i] = mockArrIt;
  }
  return mockArr;
};

describe(`createRatesMap()`, () => {
  describe(`Basic Functionality`, () => {
    it(`should return an object that is not empty`, () => {
      assert.isObject(createRatesMap(getMockArr(10, 1, 2)));
      assert.isNotEmpty(createRatesMap(getMockArr(10, 1, 2)));
    });
    it(`range.from and range.to should not be equal`, () => {
      assert.throws(() => createRatesMap(getMockArr(5, 1, 1)));
      assert.throws(() => createRatesMap(getMockArr(5, 1, 1)));
    });
    it(`rates amount should neither exceed length of day (24) nor equal 0`, () => {
      assert.throws(() => createRatesMap(getMockArr(25, 2, 1)), `rates amount should not be <= 0 or exceed length of a day`);
      assert.throws(() => createRatesMap(getMockArr(0, 2, 1)), `rates amount should not be <= 0 or exceed length of a day`);
      assert.throws(() => createRatesMap(getMockArr(-5, 2, 1)), `rates amount should not be <= 0 or exceed length of a day`);
    });
  });
});

// work in progress
