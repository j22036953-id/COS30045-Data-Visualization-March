(function() {
    const margin = { top: 40, right: 20, bottom: 60, left: 60 };
    const width = 500;
    const height = 400;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("background", "#faf8f0")
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    d3.csv("data/TV_CLEANED.csv").then(data => {
        // Filter 55-inch TVs only
        const filtered = data.filter(d => +d.Screen_Size_Inches === 55 && d.Screen_tech && d.Power_Consumption);
        
        // Compute average power consumption per screen technology
        const techMap = new Map();
        filtered.forEach(d => {
            const tech = d.Screen_tech;
            const power = +d.Power_Consumption;
            if (!techMap.has(tech)) techMap.set(tech, { total: 0, count: 0 });
            const entry = techMap.get(tech);
            entry.total += power;
            entry.count++;
        });
        
        const barData = Array.from(techMap, ([tech, { total, count }]) => ({
            tech,
            avgPower: total / count
        }));
        
        barData.sort((a,b) => b.avgPower - a.avgPower);
        
        const xScale = d3.scaleBand()
            .domain(barData.map(d => d.tech))
            .range([0, innerWidth])
            .padding(0.2);
        
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(barData, d => d.avgPower)])
            .range([innerHeight, 0]);
        
        svg.selectAll("rect")
            .data(barData)
            .join("rect")
            .attr("x", d => xScale(d.tech))
            .attr("y", d => yScale(d.avgPower))
            .attr("width", xScale.bandwidth())
            .attr("height", d => innerHeight - yScale(d.avgPower))
            .attr("fill", "#fb8c00")
            .attr("rx", 4);
        
        // Axes
        svg.append("g")
            .attr("transform", `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "rotate(-30)")
            .style("text-anchor", "end");
        
        svg.append("g").call(d3.axisLeft(yScale));
        
        svg.append("text")
            .attr("x", innerWidth/2)
            .attr("y", innerHeight + 40)
            .attr("text-anchor", "middle")
            .text("Screen Technology");
        
        svg.append("text")
            .attr("x", -40)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .text("Avg Power (Watts)");
    }).catch(error => console.error(error));
})();