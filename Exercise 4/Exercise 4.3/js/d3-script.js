document.addEventListener("DOMContentLoaded", function() {
    console.log("D3 script started");

    const width = 900;
    const height = 500;
    const margin = { top: 50, right: 30, bottom: 80, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(".responsive-svg-container")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("border", "1px solid #ccc")
        .style("background", "#faf8f0")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    d3.csv("data/data.csv").then(data => {
        console.log("CSV loaded, rows:", data.length);

        // Count models per brand
        const brandCounts = new Map();
        data.forEach(d => {
            const brand = d.Brand_Reg;
            if (brand) brandCounts.set(brand, (brandCounts.get(brand) || 0) + 1);
        });

        let brandArray = Array.from(brandCounts, ([brand, count]) => ({ brand, count }));
        brandArray.sort((a, b) => b.count - a.count);
        const topBrands = brandArray.slice(0, 10);
        console.log("Top brands:", topBrands);

        const xScale = d3.scaleBand()
            .domain(topBrands.map(d => d.brand))
            .range([0, innerWidth])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(topBrands, d => d.count)])
            .range([innerHeight, 0]);

        // Draw bars
        svg.selectAll(".bar")
            .data(topBrands)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.brand))
            .attr("y", d => yScale(d.count))
            .attr("width", xScale.bandwidth())
            .attr("height", d => innerHeight - yScale(d.count))
            .attr("fill", "#fb8c00")
            .attr("rx", 4);

        // X axis
        svg.append("g")
            .attr("transform", `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "rotate(-30)")
            .style("text-anchor", "end");

        // Y axis
        svg.append("g").call(d3.axisLeft(yScale));

        // Labels
        svg.append("text")
            .attr("x", innerWidth / 2)
            .attr("y", innerHeight + 50)
            .attr("text-anchor", "middle")
            .text("Brand");

        svg.append("text")
            .attr("x", -40)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .text("Number of Models");
    }).catch(error => {
        console.error("Error loading CSV:", error);
        d3.select(".responsive-svg-container").append("p").text("Error loading CSV. Check console.").style("color", "red");
    });
});