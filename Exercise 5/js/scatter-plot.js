(function() {
    const margin = {top:40, right:20, bottom:60, left:60}, w=500, h=400;
    const iw = w - margin.left - margin.right, ih = h - margin.top - margin.bottom;
    const svg = d3.select("#scatter-plot").append("svg").attr("viewBox", `0 0 ${w} ${h}`)
        .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    d3.csv("data/TV_CLEANED.csv").then(data => {
        const filtered = data.filter(d => { const s = +d.Star, p = +d.Avg_mode_power; return !isNaN(s) && !isNaN(p) && s>=0 && p>=0; });
        if (filtered.length === 0) { svg.append("text").text("No valid star data").attr("x",10).attr("y",20).attr("fill","red"); return; }
        const x = d3.scaleLinear().domain([0,6]).range([0, iw]);
        const y = d3.scaleLinear().domain([0, d3.max(filtered, d => +d.Avg_mode_power)]).range([ih, 0]);
        svg.selectAll("circle").data(filtered).join("circle")
            .attr("cx", d => x(+d.Star)).attr("cy", d => y(+d.Avg_mode_power)).attr("r", 4).attr("fill", "#1f77b4").attr("opacity", 0.6);
        svg.append("g").attr("transform", `translate(0,${ih})`).call(d3.axisBottom(x).ticks(6));
        svg.append("g").call(d3.axisLeft(y));
    }).catch(e => console.error(e));
})();