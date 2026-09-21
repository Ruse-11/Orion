export const forest = {
  name: "Silent Valley Forest Reserve",
  region: "Western Ghats · Kerala",
  areaHa: 384.6,
  trees: 12482,
  canopy: 67.4,
  agb: 18421,
  biomassDensity: 47.9,
  carbon: 8658,
  co2e: 31763,
  health: 87,
  risk: 23,
  analysisDate: "21 Sep 2026"
};

export const tree = {
  id: "TREE-08421",
  lat: 11.0792,
  lon: 76.2124,
  canopyArea: 34.7,
  confidence: 96.4,
  biomass: 412,
  carbon: 193,
  health: "Healthy"
};

export const biomassTrend = [
  { year: "2022", value: 14280 },
  { year: "2023", value: 15140 },
  { year: "2024", value: 16490 },
  { year: "2025", value: 17560 },
  { year: "2026", value: 18421 }
];

export const changeTrend = [
  { year: "2022", canopy: 72.8 },
  { year: "2023", canopy: 71.6 },
  { year: "2024", canopy: 70.9 },
  { year: "2025", canopy: 69.1 },
  { year: "2026", canopy: 67.4 }
];

export const alerts = [
  { id: "A-2041", severity: "HIGH", area: "4.7 ha", confidence: 93.2, date: "14 Sep 2026", type: "Canopy removal" },
  { id: "AL-0881", severity: "MEDIUM", area: "2.1 ha", confidence: 88.4, date: "02 Aug 2026", type: "Vegetation stress" },
  { id: "AL-0714", severity: "LOW", area: "0.8 ha", confidence: 81.7, date: "18 Jun 2026", type: "Minor disturbance" }
];

export const canopyGeoJson = {
  type: "FeatureCollection",
  name: "sylvasense_canopy_demo",
  features: [
    { type: "Feature", properties: { id: tree.id, canopy_m2: tree.canopyArea, biomass_kg: tree.biomass, carbon_kg: tree.carbon, confidence: tree.confidence, health: tree.health }, geometry: { type: "Point", coordinates: [tree.lon, tree.lat] } },
    { type: "Feature", properties: { id: "TREE-08422", canopy_m2: 29.1, biomass_kg: 347, confidence: 95.1, health: "Healthy" }, geometry: { type: "Point", coordinates: [76.2132, 11.0797] } },
    { type: "Feature", properties: { id: "TREE-08423", canopy_m2: 26.3, biomass_kg: 288, confidence: 92.8, health: "Monitor" }, geometry: { type: "Point", coordinates: [76.2117, 11.0785] } }
  ]
} as const;
