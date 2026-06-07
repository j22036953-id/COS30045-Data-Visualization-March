(function() {
    const margin = { top: 40, right: 20, bottom: 60, left: 60 };
    const width = 500;
    const height = 400;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select("#scatter-plot")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("background", "#faf8f0")
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    d3.csv("data/TV_CLEANED.csv").then(data => {
        // Filter valid rows with star rating and power consumption
        const filtered = data.filter(d => {
            const star = +d.Star_Rating;
            const power = +d.Power_Consumption;
            return !isNaN(star) && !isNaN(power) && star >= 0 && power >= 0;
        });
        
        const xScale = d3.scaleLinear()
            .domain([0, 6])   // star rating from 0 to 6
            .range([0, innerWidth]);
        
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(filtered, d => +d.Power_Consumption)])
            .range([innerHeight, 0]);
        
        // Draw points
        svg.selectAll("circle")
            .data(filtered)
            .join("circle")
            .attr("cx", d => xScale(+d.Star_Rating))
            .attr("cy", d => yScale(+d.Power_Consumption))
            .attr("r", 4)
            .attr("fill", "#1f77b4")
            .attr("opacity", 0.6);
        
        // Axes
        svg.append("g")
            .attr("transform", `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(xScale).ticks(6));
        
        svg.append("g").call(d3.axisLeft(yScale));
        
        svg.append("text")
            .attr("x", innerWidth/2)
            .attr("y", innerHeight + 40)
            .attr("text-anchor", "middle")
            .text("Star Rating");
        
        svg.append("text")
            .attr("x", -40)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .text("Power Consumption (Watts)");
    }).catch(error => console.error(error));
})();