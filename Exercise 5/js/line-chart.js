(function() {
    // Hardcoded data (replace with CSV later)
    const weatherData = [
        { date: new Date(2024, 0, 7), avgTemp: 21.7, minTemp: 16.2, maxTemp: 26.4 },
        { date: new Date(2024, 0, 14), avgTemp: 20.9, minTemp: 15.5, maxTemp: 25.3 },
        { date: new Date(2024, 0, 21), avgTemp: 19.9, minTemp: 14.2, maxTemp: 23.8 },
        { date: new Date(2024, 0, 28), avgTemp: 20.4, minTemp: 14.8, maxTemp: 24.5 },
        { date: new Date(2024, 1, 4), avgTemp: 20.0, minTemp: 15.0, maxTemp: 23.6 },
        { date: new Date(2024, 1, 11), avgTemp: 21.6, minTemp: 15.2, maxTemp: 26.0 },
        { date: new Date(2024, 1, 18), avgTemp: 22.0, minTemp: 16.0, maxTemp: 27.0 },
        { date: new Date(2024, 1, 25), avgTemp: 21.1, minTemp: 15.1, maxTemp: 25.8 }
    ];

    const margin = { top: 40, right: 30, bottom: 50, left: 50 };
    const width = 800;
    const height = 500;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select("#line-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("background", "#faf8f0")
        .style("border", "1px solid #ccc")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleTime()
        .domain(d3.extent(weatherData, d => d.date))
        .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(weatherData, d => d.maxTemp)])
        .range([innerHeight, 0]);

    const lineGen = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.avgTemp))
        .curve(d3.curveCatmullRom);

    svg.append("path")
        .attr("d", lineGen(weatherData))
        .attr("fill", "none")
        .attr("stroke", "#e67a00")
        .attr("stroke-width", 3);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b"));
    svg.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(xAxis);

    svg.append("g").call(d3.axisLeft(yScale));

    svg.append("text")
        .attr("x", -40)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .text("Temperature (°C)");

    svg.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 40)
        .attr("text-anchor", "middle")
        .text("Week");
})();