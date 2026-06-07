(function() {
    const margin = {top:40, right:20, bottom:60, left:60}, w=500, h=400;
    const iw = w - margin.left - margin.right, ih = h - margin.top - margin.bottom;
    const svg = d3.select("#line-chart").append("svg").attr("viewBox", `0 0 ${w} ${h}`)
        .append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const data = [
        {year:1998, price:25}, {year:2000, price:28}, {year:2002, price:35},
        {year:2004, price:42}, {year:2006, price:55}, {year:2008, price:70},
        {year:2010, price:65}, {year:2012, price:60}, {year:2014, price:75},
        {year:2016, price:80}, {year:2018, price:90}, {year:2020, price:85},
        {year:2022, price:110}, {year:2024, price:120}
    ];
    const x = d3.scaleLinear().domain(d3.extent(data, d => d.year)).range([0, iw]);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.price)]).range([ih, 0]);
    const line = d3.line().x(d => x(d.year)).y(d => y(d.price)).curve(d3.curveCatmullRom);
    svg.append("path").attr("d", line(data)).attr("fill", "none").attr("stroke", "#e67a00").attr("stroke-width", 3);
    svg.append("g").attr("transform", `translate(0,${ih})`).call(d3.axisBottom(x).tickFormat(d3.format("d")));
    svg.append("g").call(d3.axisLeft(y));
})();