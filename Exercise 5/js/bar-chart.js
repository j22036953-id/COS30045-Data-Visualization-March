(function() {
    const margin = {top:40, right:20, bottom:60, left:60}, w=500, h=400;
    const iw = w - margin.left - margin.right, ih = h - margin.top - margin.bottom;
    const svg = d3.select("#bar-chart").append("svg").attr("viewBox", `0 0 ${w} ${h}`)
        .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    d3.csv("data/TV_CLEANED.csv").then(data => {
        const filtered = data.filter(d => {
            const inches = +d.screenshot_inches, power = +d.Avg_mode_power, tech = d.Screen_Techn;
            return !isNaN(inches) && inches >= 54.5 && inches <= 55.5 && !isNaN(power) && tech;
        });
        if (filtered.length === 0) { svg.append("text").text("No 55-inch data").attr("x",10).attr("y",20).attr("fill","red"); return; }
        const techMap = new Map();
        filtered.forEach(d => { const t = d.Screen_Techn, p = +d.Avg_mode_power; techMap.set(t, (techMap.get(t)||0) + p); });
        const barData = Array.from(techMap, ([t, total]) => ({ tech: t, avg: total / filtered.filter(d => d.Screen_Techn === t).length }));
        barData.sort((a,b) => b.avg - a.avg);
        const x = d3.scaleBand().domain(barData.map(d => d.tech)).range([0, iw]).padding(0.2);
        const y = d3.scaleLinear().domain([0, d3.max(barData, d => d.avg)]).range([ih, 0]);
        svg.selectAll("rect").data(barData).join("rect")
            .attr("x", d => x(d.tech)).attr("y", d => y(d.avg)).attr("width", x.bandwidth())
            .attr("height", d => ih - y(d.avg)).attr("fill", "#fb8c00");
        svg.append("g").attr("transform", `translate(0,${ih})`).call(d3.axisBottom(x)).selectAll("text").attr("transform","rotate(-30)").style("text-anchor","end");
        svg.append("g").call(d3.axisLeft(y));
    }).catch(e => console.error(e));
})();