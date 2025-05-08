export const generateMarketData = (startDate, endDate, startValue, volatility) => {
    const data = [];

    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    let value = startValue;

    while (currentDate <= end) {
        const dateFormatted = currentDate.toISOString().split('T')[0];

        // Simula variazione giornaliera casuale
        const change = (Math.random() - 0.5) * volatility;
        value = Math.max(0, value + change);

        // Salva coppia [data, valore]
        data.push([dateFormatted, parseFloat(value.toFixed(2))]);

        currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(data);
    return data;
};

export const generateForecastRange = (startDate, endDate, initialValue, volatility, gap = 100) => {
    const forecastMax = [];
    const forecastMin = [];

    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    let value = initialValue;

    while (currentDate <= end) {
        const dateStr = currentDate.toISOString().split('T')[0];

        // Variazione lineare con un po’ di rumore
        const change = (Math.random() - 0.5) * volatility;
        value = Math.max(0, value + change);
        const max = parseFloat(value.toFixed(2));
        const min = parseFloat((max - gap).toFixed(2));

        forecastMax.push([dateStr, max]);
        forecastMin.push([dateStr, min]);

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return { forecastMax, forecastMin };
};
