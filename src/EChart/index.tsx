import React, {useState} from "react";
import ReactECharts from 'echarts-for-react';
import chartData from '../../mocks/market.js';

export default () => {
    const [selectedKey, setSelectedKey] = useState('CBOT');
    const selected = chartData[selectedKey];

    const handleChange = (e) => {
        setSelectedKey(e.target.value);
    };

    const hasSecondary = !!selected.secondaryData;

    const option = {
        title: {
            text: selected.label,
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {type: 'line'},
            formatter: (params) => {
                const items = params.map(p => {
                    const date = new Date(p.value[0]).toLocaleDateString('it-IT');
                    return `${p.seriesName}: ${p.value[1]} ${p.axisIndex === 1 ? selected.secondaryUnit : selected.unit}`;
                });
                return `${params[0].axisValueLabel}<br/>${items.join('<br/>')}`;
            }
        },

        xAxis: {
            type: 'time',
            axisLabel: {
                formatter: (value) => {
                    const date = new Date(value);
                    return date.getFullYear().toString(); // Mostra solo l'anno
                },
            },
            splitLine: {
                show: true,
            },
        },
        yAxis: [
            {
                type: 'value',
                name: selected.unit,
            },
            ...(hasSecondary
                ? [{
                    type: 'value',
                    name: selected.secondaryLabel,
                    position: 'right',
                    offset: 0,
                    axisLine: {lineStyle: {color: '#888'}},
                    axisLabel: {
                        formatter: `{value} ${selected.secondaryUnit}`
                    },
                }]
                : [])

        ],
        series: [
            {
                name: selected.label,
                type: 'line',
                smooth: true,
                showSymbol: false,
                lineStyle: {width: 2},
                data: selected.data.historicalData,
            },
            {
                name: 'Previsione Massima',
                type: 'line',
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    color: '#f5bc85'
                },
                data: selected.data.forecastMax,
            },
            {
                name: 'Previsione Minima',
                type: 'line',
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    color: '#f5bc85'
                },
                data: selected.data.forecastMin,
            },
            ...(hasSecondary
                ? [{
                    name: selected.secondaryLabel,
                    type: 'line',
                    yAxisIndex: 1,
                    smooth: true,
                    showSymbol: false,
                    lineStyle: {width: 1, color: '#c79da3'},
                    areaStyle: {},
                    data: selected.secondaryData,
                }]
                : [])

        ],
        dataZoom: [
            {
                show: true,
                realtime: true,
                start: 80,
                end: 90
            },
            {
                type: 'inside',
                realtime: true,
                start: 80,
                end: 90
            }
        ],

    };

    return (
        <>
            <h1 className="app-title">Andamento Mercati</h1>

            <select className="market-select" value={selectedKey} onChange={handleChange}>
                {Object.entries(chartData).map(([key, {label}]) => (
                    <option key={key} value={key}>{label} ({chartData[key].unit})</option>
                ))}
            </select>

            <div className="chart-box">
                <ReactECharts option={option} style={{height: '100%', width: '100%'}}/>
            </div>
        </>
    )
}