const sampleData = [
    { year: 1991, beef: 0.7055, pig: 14.5729, poultry: 1.9485, sheep: 0.6401 },
    { year: 2010, beef: 4.2049, pig: 22.6989, poultry: 2.9889, sheep: 1.9391 },
    { year: 2020, beef: 4.9904, pig: 29.3815, poultry: 7.1149, sheep: 1.9391 },
    { year: 2024, beef: 4.9904, pig: 29.3815, poultry: 7.1149, sheep: 1.9391 }
];

defineScales(sampleData);
drawDonutCharts(sampleData);
drawStackedBars(sampleData);
addLegend();