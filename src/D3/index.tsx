// LineChart.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import chartData from '../../mocks/market.js';

export default () => {
    const data = chartData.CBOT.data.historicalData;
    const width = 800;
    const height = 400;
    const svgRef = useRef();

    useEffect(() => {
        if (!data || data.length === 0) return;

        // Cleanup
        d3.select(svgRef.current).selectAll('*').remove();

        // Set margins
        const margin = { top: 20, right: 30, bottom: 40, left: 50 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Create SVG
        const svg = d3
            .select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        const g = svg
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const x = d3.scaleTime()
            .domain(d3.extent(data, d => new Date(d[0])))
            .range([0, innerWidth]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d[1])])
            .nice()
            .range([innerHeight, 0]);

        // Axes
        g.append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%Y')));

        g.append('g')
            .call(d3.axisLeft(y));

        // Line generator
        const line = d3.line()
            .x(d => x(new Date(d[0])))
            .y(d => y(d[1]))
            .curve(d3.curveMonotoneX); // smooth line

        // Draw line
        g.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#0074D9')
            .attr('stroke-width', 2)
            .attr('d', line);

    }, [data, width, height]);

    return <>
        <svg ref={svgRef}></svg>
    </>;
};
