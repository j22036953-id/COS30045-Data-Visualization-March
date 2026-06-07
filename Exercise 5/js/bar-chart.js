(function() {
    const margin = {top:70, right:40, bottom:100, left:90}, w=600, h=500;
    const iw = w - margin.left - margin.right, ih = h - margin.top - margin.bottom;
    const svg = d3.select("#bar-chart").append("svg").attr("viewBox", `0 0 ${w} ${h}`)
        .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    d3.csv("data/TV_CLEANED.csv").then(data => {
        const techCol = data[0].hasOwnProperty("Screen_Tech") ? "Screen_Tech" : "Screen_Techn";
        const sizeCol = data[0].hasOwnProperty("screensize_inches") ? "screensize_inches" : "screenshot_inches";
        const filtered = data.filter(d => {
            const inches = +d[sizeCol];
            const power = +d.Avg_mode_power;
            const tech = d[techCol];
            return !isNaN(inches) && inches >= 54.5 && inches <= 55.5 && !isNaN(power) && tech;
        });
        if (filtered.length === 0) {
            svg.append("text").text("No 55-inch data").attr("x",10).attr("y",20).attr("fill","red");
            return;
        }
        const techMap = new Map();
        filtered.forEach(d => { const t = d[techCol]; const p = +d.Avg_mode_power; techMap.set(t, (techMap.get(t)||0) + p); });
        const barData = Array.from(techMap, ([t, total]) => ({ tech: t, avg: total / filtered.filter(d => d[techCol] === t).length }));
        barData.sort((a,b) => b.avg - a.avg);
        const x = d3.scaleBand().domain(barData.map(d => d.tech)).range([0, iw]).padding(0.2);
        const y = d3.scaleLinear().domain([0, d3.max(barData, d => d.avg)]).range([ih, 0]);
        svg.selectAll("rect").data(barData).join("rect")
            .attr("x", d => x(d.tech)).attr("y", d => y(d.avg))
            .attr("width", x.bandwidth()).attr("height", d => ih - y(d.avg))
            .attr("fill", "#fb8c00").attr("rx", 4);
        svg.append("g").attr("transform", `translate(0,${ih})`).call(d3.axisBottom(x))
            .selectAll("text").attr("transform","rotate(-25)").style("text-anchor","end").attr("dx", "-0.5em").attr("dy", "0.5em");
        svg.append("g").call(d3.axisLeft(y));
        svg.append("text").attr("x", iw/2).attr("y", ih+50).attr("text-anchor","middle").text("Screen Technology");
        svg.append("text").attr("x", -65).attr("y", 25).attr("text-anchor","middle").text("Avg Power (Watts)");
        svg.append("text").attr("x", iw/2).attr("y", -30).attr("text-anchor","middle").style("font-size","14px").style("font-weight","bold")
            .text("Avg Power Consumption for 55‑inch TVs");
    }).catch(e => console.error(e));
})();