import React, {useEffect, useRef, useState} from 'react';
import {
    VictoryChart,
    VictoryLine,
    VictoryAxis,
    VictoryTooltip,
    VictoryVoronoiContainer,
    VictoryLegend,
    VictoryLabel, VictoryZoomContainer
} from 'victory';

// Utilità per generare i dati
const generateMarketData = (startDate, endDate, startValue, volatility) => {
    const data = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    let value = startValue;

    while (currentDate <= end) {
        const dateFormatted = currentDate.toISOString().split('T')[0];
        const change = (Math.random() - 0.5) * volatility;
        value = Math.max(0, value + change);
        data.push({x: new Date(dateFormatted), y: parseFloat(value.toFixed(2))});
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return data;
};

// Utilità per generare i dati
const generateForecastData = (startDate, endDate, startValue, volatility) => {
    const data = {
        forecastMax: [],
        forecastMin: [],
    };
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    let value = startValue;

    while (currentDate <= end) {
        const dateFormatted = currentDate.toISOString().split('T')[0];
        const change = (Math.random() - 0.5) * volatility;
        value = Math.max(0, value + change);
        data.forecastMax.push({x: new Date(dateFormatted), y: parseFloat(value.toFixed(2))});
        data.forecastMin.push({x: new Date(dateFormatted), y: parseFloat(value.toFixed(2)) - 100});
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return data;
};

const today = new Date();
const forecastMaxDate = new Date().setDate(today.getDate() + 90);
const zoomMaxDate = new Date().setDate(today.getDate() + 90);
const zoomMinDate = new Date().setDate(today.getDate() - 90);


const {forecastMin, forecastMax} = generateForecastData(today, forecastMaxDate, 650, 10);

const markets = {
    CBOT: {
        label: 'n.2 US - CBOT',
        unitLeft: '¢$/bu',
        unitRight: 'Volumi',
        data: [
            {
                name: 'historical',
                legend: 'Dati storici',
                data: generateMarketData('2020-01-01', today, 650, 10),
                stroke: {color: "#0077cc"},
                type: 'line',
            },
            {
                name: 'forecastMin',
                legend: 'Previsione minima',
                data: forecastMin,
                stroke: {color: "#f5bc85"},
                type: 'line',
            },
            {
                name: 'forecastMax',
                legend: 'Previsione massima',
                data: forecastMax,
                stroke: {color: "#f5bc85"},
                type: 'line',
            },
            {
                name: 'financial',
                legend: 'Indicatore finanziario',
                data: generateMarketData(today, forecastMaxDate, 10000, 1000),
                stroke: {color: "#f58585"},
                type: 'line',
            },
        ]
    },
    MATIF: {
        label: 'UE - MATIF',
        unit: '€/t',
        data: generateMarketData('2020-01-01', today, 280, 5)
    },
    BOLOGNA: {
        label: 'C.tto 103 - BOLOGNA',
        unit: '€/t',
        data: generateMarketData('2020-01-01', today, 320, 4)
    }
};

export default () => {
    const [selectedMarket, setSelectedMarket] = useState('CBOT');
    const selected = markets[selectedMarket];

    const ref = useRef(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (ref.current) {
            setWidth(ref.current.offsetWidth);
        }
    }, []);

    return (
        <div ref={ref} style={{width: "100%"}}>
            <select
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
            >
                {Object.keys(markets).map(key => (
                    <option key={key} value={key}>{markets[key].label}</option>
                ))}
            </select>

            {width && (
                <VictoryChart
                    scale={{x: 'time'}}
                    width={width}
                    height={500}
                    domainPadding={20}
                    containerComponent={
                        <VictoryZoomContainer
                            zoomDimension="x"
                            zoomDomain={{
                                x: [zoomMinDate, zoomMaxDate],
                            }}
                        />
                    }
                >
                    {/** Axis block */}
                    {/* label for left y-axis */}
                    <VictoryLabel
                        text={selected.unitLeft}
                        x={50}
                        y={30}
                        textAnchor="middle"
                        style={{fontSize: 15}}
                    />

                    {/* left y-axis */}
                    <VictoryAxis
                        dependentAxis
                        style={{
                            grid: {
                                stroke: "lightgray",
                            },
                            tickLabels: {
                                fontSize: 12,
                                padding: 5,
                            },
                        }}
                    />

                    {/* label for right y-axis */}
                    <VictoryLabel
                        text={selected.unitRight}
                        x={width - 50}
                        y={30}
                        textAnchor="middle"
                        style={{fontSize: 15}}
                    />

                    {/* right y-axis */}
                    {selected.data.unitRight && (
                        <>
                            <VictoryAxis
                                dependentAxis
                                orientation="right"
                                style={{
                                    tickLabels: {fontSize: 12, padding: 5},
                                }}
                            />

                            {/* x-axis */}
                            <VictoryAxis
                                tickFormat={(t) => {
                                    const date = new Date(t);
                                    return (date.getMonth() - 1) + '/' + date.getFullYear();
                                }}
                            />
                        </>
                    )}

                    {/** Data block */}
                    {selected.data.map((dataSet: any) => {
                        if (dataSet.type === 'line') {
                            return (
                                <VictoryLine
                                    data={dataSet.data}
                                    style={{data: {stroke: dataSet.stroke.color, strokeWidth: 2}}}
                                />
                            )
                        }
                    })}

                    {/** Legend block */}
                    {/*<VictoryLegend*/}
                    {/*    itemsPerRow={4}*/}
                    {/*    x={50}*/}
                    {/*    y={220}*/}
                    {/*    data={selected.data.map((dataSet) => ({*/}
                    {/*        name: dataSet.legend || '?',*/}
                    {/*    }))}*/}
                    {/*/>*/}
                </VictoryChart>
            )}
        </div>
    );
}
