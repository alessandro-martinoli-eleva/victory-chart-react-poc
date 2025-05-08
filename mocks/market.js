import {generateMarketData, generateForecastRange} from "../utils/factory.js";

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const nextYear = new Date(tomorrow);
nextYear.setFullYear(nextYear.getFullYear() + 1);

const historicalCBOT = generateMarketData('2020-01-01', today, 650, 10);
const historicalCBOTLastValue = historicalCBOT[historicalCBOT.length - 1][1];
const historicalMATIF = generateMarketData('2020-01-01', today, 280, 5);
const historicalMATIFLastValue = historicalMATIF[historicalMATIF.length - 1][1];
const historicalBOLOGNA = generateMarketData('2020-01-01', today, 320, 4);
const historicalBOLOGNALastValue = historicalBOLOGNA[historicalBOLOGNA.length - 1][1];

const forecastCBOT = generateForecastRange(tomorrow, nextYear, historicalCBOTLastValue + 50, 20, 100);
const forecastMATIF = generateForecastRange(tomorrow, nextYear, historicalMATIFLastValue + 50, 20, 100);
const forecastBOLOGNA = generateForecastRange(tomorrow, nextYear, historicalBOLOGNALastValue + 50, 20, 100);

export default {
    'CBOT': {
        label: 'n.2 US - CBOT',
        unit: '¢$/bu',
        data: {
            historicalData: historicalCBOT,
            forecastMax: forecastCBOT.forecastMax,
            forecastMin: forecastCBOT.forecastMin,
        },
        secondaryLabel: 'Indice Finanziario',
        secondaryUnit: 'pts',
        secondaryData: generateMarketData('2020-01-01', today, 0, 1000),
    },
    'MATIF': {
        label: 'UE - MATIF',
        unit: '€/t',
        data: {
            historicalData: historicalMATIF,
            forecastMax: forecastMATIF.forecastMax,
            forecastMin: forecastMATIF.forecastMin,
        },
    },
    'BOLOGNA': {
        label: 'C.tto 103 - BOLOGNA',
        unit: '€/t',
        data: {
            historicalData: historicalBOLOGNA,
            forecastMax: forecastBOLOGNA.forecastMax,
            forecastMin: forecastBOLOGNA.forecastMin,
        },
    }
};
