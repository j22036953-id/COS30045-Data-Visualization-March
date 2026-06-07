// ========== SHARED CONSTANTS ==========

// Histogram dimensions
const margin = { top: 50, right: 30, bottom: 60, left: 70 };
const width = 900;
const height = 500;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Scatterplot dimensions
const marginS = { top: 50, right: 80, bottom: 60, left: 70 };
const widthS = 900;
const heightS = 500;
const innerWidthS = widthS - marginS.left - marginS.right;
const innerHeightS = heightS - marginS.top - marginS.bottom;

// Colours
const bodyBackgroundColor = "#faf8f0";
const barColor = "#fb8c00";

// Tooltip dimensions
const tooltipWidth = 120;
const tooltipHeight = 30;
const tooltipPadding = 10;

// Colour scale for screen technologies
const colorScale = d3.scaleOrdinal()
    .domain(["LED", "LCD", "OLED"])
    .range(["#fb8c00", "#4caf50", "#2196f3"]);

// Filter definitions
const filters_screen = [
    { id: "all", label: "All", isActive: true },
    { id: "LED", label: "LED", isActive: false },
    { id: "LCD", label: "LCD", isActive: false },
    { id: "OLED", label: "OLED", isActive: false }
];

const filters_size = [
    { id: "all", label: "All Sizes", isActive: true },
    { id: "24", label: "24\"", isActive: false },
    { id: "32", label: "32\"", isActive: false },
    { id: "55", label: "55\"", isActive: false },
    { id: "65", label: "65\"", isActive: false },
    { id: "98", label: "98\"", isActive: false }
];

// Bin generator (initialised later)
let binGenerator = null;
let currentData = [];
let activeTech = "all";
let activeSize = "all";

function createBins(data, valueKey = "energyConsumption") {
    if (!binGenerator) {
        binGenerator = d3.bin()
            .domain([0, 1800])
            .thresholds(20);
    }
    return binGenerator(data.map(d => +d[valueKey]).filter(v => !isNaN(v)));
}

function filterData(data) {
    return data.filter(d => {
        const techMatch = (activeTech === "all" || d.screenTech === activeTech);
        const sizeMatch = (activeSize === "all" || Math.floor(d.screenSize) === parseInt(activeSize));
        return techMatch && sizeMatch;
    });
}