// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {

    // ----- Step 2: Apply style to HTML elements using D3 -----
    // Change colour of the main heading
    d3.select("h1")
        .style("color", "#fb8c00")
        .style("transition", "0.3s");

    // Change background of the intro paragraph
    d3.select(".intro")
        .style("background", "#fff3e0")
        .style("padding", "10px")
        .style("border-radius", "12px")
        .style("border-left", "4px solid #fb8c00");

    // Style all paragraphs inside .demo-section
    d3.selectAll(".demo-section p")
        .style("color", "#5d4030")
        .style("font-size", "1rem");

    // ----- Step 3: Append an element using D3 -----
    // Select the div with id "target-div" and append a new paragraph
    // Avoid duplicate on page reload by checking if already added
    const targetDiv = d3.select("#target-div");
    if (targetDiv.select(".d3-appended-p").empty()) {
        targetDiv.append("p")
            .attr("class", "d3-appended-p")
            .text("💡 D3 says: Purchasing a low energy consumption TV will help with your energy bills!")
            .style("font-weight", "bold")
            .style("color", "#e67a00")
            .style("margin-top", "10px")
            .style("background", "#fff0dd")
            .style("padding", "8px")
            .style("border-radius", "8px");
    }

    // ----- Step 4: Append an SVG and a rectangle using D3 -----
    const svgContainer = d3.select("#svg-container");
    
    // Check if SVG already exists to avoid duplication
    if (svgContainer.select("svg").empty()) {
        // Create SVG canvas
        const svg = svgContainer.append("svg")
            .attr("width", "100%")
            .attr("height", "150")
            .attr("viewBox", "0 0 400 100")
            .style("background", "#faf0e0")
            .style("border-radius", "8px")
            .style("margin-top", "10px");

        // Add rectangle with attributes
        svg.append("rect")
            .attr("x", 50)
            .attr("y", 25)
            .attr("width", 200)
            .attr("height", 50)
            .attr("rx", 8)
            .style("fill", "#fb8c00")
            .style("stroke", "#e67a00")
            .style("stroke-width", 2);

        // Optionally add a text label inside the SVG
        svg.append("text")
            .attr("x", 150)
            .attr("y", 55)
            .attr("text-anchor", "middle")
            .style("fill", "white")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .text("D3 Rectangle");
    }
});