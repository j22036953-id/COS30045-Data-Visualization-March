// Will be defined after data loads
let xScale, colorScale;

function defineScales(data) {
    // Band scale for years (categorical)
    xScale = d3.scaleBand()
        .domain(data.map(d => d.year))
        .range([0, innerWidth])
        .padding(0.1);

    // Ordinal colour scale based on meat types
    colorScale = d3.scaleOrdinal()
        .domain(formatsInfo.map(f => f.id))
        .range(formatsInfo.map(f => f.color));
}