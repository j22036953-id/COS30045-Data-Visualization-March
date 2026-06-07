// Shared constants for all charts
const margin = { top: 50, right: 0, bottom: 50, left: 70 };
const width = 900;
const height = 350;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Meat types: id (used in CSV), label (for legend), color
const formatsInfo = [
    { id: "beef", label: "Beef", color: "#76B6C2" },
    { id: "pig", label: "Pork", color: "#4CDDF7" },
    { id: "poultry", label: "Poultry", color: "#ED7864" },
    { id: "sheep", label: "Sheep", color: "#2F8999" }
];