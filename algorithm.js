let inputData = `{
  "devices": [{
      "id": "Dishwasha",
      "name": "Посудомоечная машина",
      "power": 950,
      "duration": 3,
      "mode": "night"
    }
  ],
  "rates": [{
      "from": 7,
      "to": 10,
      "value": 6.46
    },
    {
      "from": 10,
      "to": 17,
      "value": 5.38
    },
    {
      "from": 17,
      "to": 21,
      "value": 6.46
    },
    {
      "from": 21,
      "to": 23,
      "value": 5.38
    },
    {
      "from": 23,
      "to": 7,
      "value": 1.79
    }
  ],
  "maxPower": 2100
}`;
// maxPower = лимит мощности на час времени
// цикл работы прибора неприрывен

const computeSchedule = (data) => {
  const input = JSON.parse(data);
  const modesMap = {
    day: {
      // if duration > 14 && mode === day => throw ERROR
      from: 7,
      to: 20
    },
    night: {
      // if duration > 10 && mode === night => throw ERROR
      from: 21,
      to: 6
    },
    undefined: {
      from: 0,
      to: 23
    }
  };
  console.log(input);
};

computeSchedule(inputData);
/*
0-6 && 21-23 = night
7-20 = day

 ----OUTPUT
 {
  "schedule": {
      "0": ["Fridge", "Thermo", "Dishwasha"],
      "1": ["Fridge", "Thermo", "Dishwasha"],
      "2": ["Fridge", "Thermo", "Dishwasha"],
      "3": ["Fridge", "Thermo"],
      "4": ["Fridge", "Thermo"],
      "5": ["Fridge", "Thermo"],
      "6": ["Fridge", "Thermo"],
      "7": ["Fridge", "Thermo"],
      "8": ["Fridge", "Thermo"],
      "9": ["Fridge", "Thermo"],
      "10": ["Fridge", "Thermo", "Oven"],
      "11": ["Fridge", "Thermo", "Oven"],
      "12": ["Fridge", "Thermo"],
      "13": ["Fridge", "Thermo"],
      "14": ["Fridge", "Thermo"],
      "15": ["Fridge", "Thermo"],
      "16": ["Fridge", "Thermo"],
      "17": ["Fridge", "Thermo"],
      "18": ["Fridge", "Thermo"],
      "19": ["Fridge", "Thermo"],
      "20": ["Fridge", "Thermo"],
      "21": ["Fridge", "Thermo"],
      "22": ["Fridge", "Thermo"],
      "23": ["Fridge", "Thermo", "Condito"]
  },
  "consumedEnergy": {
      "value": 38.939,
      "devices": {
          "Dishwasha": 5.1015,
          "Oven": 21.52,
          "Fridge": 5.398,
          "Thermo": 5.398,
          "Condito": 1.5215
      }
  }
}
  */
