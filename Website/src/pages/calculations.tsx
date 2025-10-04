//Solar energy calculations and utility functions
//Water quality calculations and utility functions

// ==================== SOLAR CALCULATIONS ====================

export const productionFactors: { [key: string]: number } = {
  'Cairo': 1900, 'Giza': 1900, 'Alexandria': 1800, 'Aswan': 2200,
  'Luxor': 2150, 'Qena': 2100, 'Sohag': 2050, 'Assiut': 2000,
  'Minya': 1975, 'Beni Suef': 1950, 'Fayoum': 1930, 'Red Sea': 2150,
  'Matrouh': 1850, 'North Sinai': 2000, 'South Sinai': 2200,
  'New Valley': 2250, 'Ismailia': 1925, 'Suez': 1950,
  'Port Said': 1800, 'Damietta': 1800, 'Dakahlia': 1825,
  'Gharbia': 1850, 'Monufia': 1850, 'Qalyubia': 1900,
  'Sharqia': 1850, 'Kafr El Sheikh': 1800, 'Beheira': 1800
};

export const costPerKWp: { [key: string]: number } = {
  'residential': 12000,
  'commercial': 13000,
  'industrial': 14000
};

export const maintenanceFactors: { [key: string]: number } = {
  'residential': 0.02,
  'commercial': 0.03,
  'industrial': 0.04
};

export const calculateWeightedTariff = (sectorType: string, monthlyConsumption: number): number => {
  if (sectorType === 'residential') {
    let totalCost = 0;
    let remainingConsumption = monthlyConsumption;

    if (remainingConsumption > 0) {
      const tier1 = Math.min(remainingConsumption, 50);
      totalCost += tier1 * 0.68;
      remainingConsumption -= tier1;
    }

    if (remainingConsumption > 0) {
      const tier2 = Math.min(remainingConsumption, 50);
      totalCost += tier2 * 0.78;
      remainingConsumption -= tier2;
    }

    if (remainingConsumption > 0) {
      const tier3 = Math.min(remainingConsumption, 100);
      totalCost += tier3 * 0.95;
      remainingConsumption -= tier3;
    }

    if (remainingConsumption > 0) {
      const tier4 = Math.min(remainingConsumption, 150);
      totalCost += tier4 * 1.55;
      remainingConsumption -= tier4;
    }

    if (remainingConsumption > 0) {
      const tier5 = Math.min(remainingConsumption, 300);
      totalCost += tier5 * 1.95;
      remainingConsumption -= tier5;
    }

    if (remainingConsumption > 0) {
      const tier6 = Math.min(remainingConsumption, 350);
      totalCost += tier6 * 2.10;
      remainingConsumption -= tier6;
    }

    if (remainingConsumption > 0) {
      totalCost += remainingConsumption * 2.23;
    }

    return totalCost / monthlyConsumption;

  } else if (sectorType === 'commercial') {
    let totalCost = 0;
    let remainingConsumption = monthlyConsumption;

    if (remainingConsumption > 0) {
      const tier1 = Math.min(remainingConsumption, 100);
      totalCost += tier1 * 0.65;
      remainingConsumption -= tier1;
    }

    if (remainingConsumption > 0) {
      const tier2 = Math.min(remainingConsumption, 150);
      totalCost += tier2 * 1.36;
      remainingConsumption -= tier2;
    }

    if (remainingConsumption > 0) {
      const tier3 = Math.min(remainingConsumption, 350);
      totalCost += tier3 * 1.50;
      remainingConsumption -= tier3;
    }

    if (remainingConsumption > 0) {
      const tier4 = Math.min(remainingConsumption, 400);
      totalCost += tier4 * 1.65;
      remainingConsumption -= tier4;
    }

    if (remainingConsumption > 0) {
      totalCost += remainingConsumption * 1.80;
    }

    return totalCost / monthlyConsumption;

  } else if (sectorType === 'industrial') {
    return 1.70;
  }
  return 1.70;
};

export const calculateSolar = (formData: any) => {
  const monthlyConsumption = parseFloat(formData.consumption);
  const availableArea = parseFloat(formData.space);
  const solarCoveragePercent = parseFloat(formData.coverage.toString());
  const locationName = formData.location;
  const sectorType = formData.sectorType;

  const annualConsumption = monthlyConsumption * 12;
  const solarNeededKwhYear = annualConsumption * (solarCoveragePercent / 100);
  const productionFactor = productionFactors[locationName] || 1900;
  const systemSizeKwp = solarNeededKwhYear / productionFactor;
  const requiredArea = systemSizeKwp * 7;
  const areaWarning = availableArea < requiredArea;
  const installationCost = systemSizeKwp * (costPerKWp[sectorType] || 14000);
  const annualProduction = systemSizeKwp * productionFactor;
  const weightedTariff = calculateWeightedTariff(sectorType, monthlyConsumption);
  const currentMonthlyBill = monthlyConsumption * weightedTariff;
  const annualCurrentBill = currentMonthlyBill * 12;
  const annualSavings = annualProduction * weightedTariff;
  const maintenanceFactor = maintenanceFactors[sectorType] || 0.04;
  const annualMaintenanceCost = installationCost * maintenanceFactor;
  const netSavings = annualSavings - annualMaintenanceCost;
  const remainingAnnualConsumption = Math.max(0, annualConsumption - annualProduction);
  const remainingMonthlyConsumption = remainingAnnualConsumption / 12;
  const newWeightedTariff = remainingMonthlyConsumption > 0 ? calculateWeightedTariff(sectorType, remainingMonthlyConsumption) : 0;
  const newMonthlyBill = remainingMonthlyConsumption * newWeightedTariff;
  const annualNewBill = newMonthlyBill * 12;
  const paybackYears = installationCost / netSavings;
  const totalNetSavings = netSavings * 25;
  const roi = ((totalNetSavings - installationCost) / installationCost) * 100;
  const co2SavingTons = (annualProduction * 0.5) / 1000;
  const treesEquivalent = (co2SavingTons * 1000) / 22;

  const yearlyData = [];
  let cumulativeSavings = 0;
  let production = annualProduction;
  const degradationRate = 0.01;

  for (let year = 1; year <= 25; year++) {
    const yearSavings = production * weightedTariff - annualMaintenanceCost;
    cumulativeSavings += yearSavings;
    
    yearlyData.push({
      year,
      production: Math.round(production),
      savings: Math.round(yearSavings),
      cumulativeSavings: Math.round(cumulativeSavings),
      co2Saved: Math.round((production * 0.5) / 1000 * 10) / 10
    });

    production *= (1 - degradationRate);
  }

  return {
    systemSizeKwp: Math.round(systemSizeKwp * 100) / 100,
    requiredArea: Math.round(requiredArea * 10) / 10,
    availableArea,
    areaWarning,
    installationCost: Math.round(installationCost),
    annualProduction: Math.round(annualProduction),
    currentBill: Math.round(annualCurrentBill),
    newBill: Math.round(annualNewBill),
    annualSavings: Math.round(annualSavings),
    annualMaintenanceCost: Math.round(annualMaintenanceCost),
    netSavings: Math.round(netSavings),
    paybackYears: Math.round(paybackYears * 10) / 10,
    roi: Math.round(roi * 10) / 10,
    co2SavingTons: Math.round(co2SavingTons * 100) / 100,
    treesEquivalent: Math.round(treesEquivalent),
    yearlyData,
    productionFactor,
    solarCoveragePercent,
    weightedTariff: Math.round(weightedTariff * 100) / 100
  };
};

// ==================== WATER QUALITY CALCULATIONS ====================

// Water Quality Standards (WHO/EPA)
export const waterStandards = {
  pH: { min: 6.5, max: 8.5, optimal: 7.5 },
  dissolvedOxygen: { min: 5, optimal: 8 },
  TDS: { domestic: 500, agriculture: 2000, industrial: 2000 },
  turbidity: { max: 5 },
  nitrate: { max: 50 },
  BOD: { max: 3 }
};

// Parameter weights for WQI calculation
export const parameterWeights = {
  dissolvedOxygen: 0.3,
  pH: 0.2,
  TDS: 0.2,
  turbidity: 0.15,
  nitrate: 0.15
};

// WQI Classification ranges
export const wqiClassification = [
  { min: 0, max: 25, status: 'Excellent', color: '#10b981', description: 'Water is of excellent quality' },
  { min: 26, max: 50, status: 'Good', color: '#3b82f6', description: 'Water is generally safe for use' },
  { min: 51, max: 75, status: 'Poor', color: '#f59e0b', description: 'Water requires treatment' },
  { min: 76, max: 100, status: 'Very Poor', color: '#ef4444', description: 'Water is highly polluted' },
  { min: 100, max: Infinity, status: 'Unsuitable', color: '#991b1b', description: 'Water is unsuitable for use' }
];

// Calculate Water Quality Index
export const calculateWQI = (waterData: {
  pH: number;
  dissolvedOxygen: number;
  TDS: number;
  turbidity: number;
  nitrate: number;
  BOD: number;
  sectorType: string;
}) => {
  const { pH, dissolvedOxygen, TDS, turbidity, nitrate, BOD, sectorType } = waterData;
  
  // Get TDS standard based on sector
  const tdsStandard = sectorType === 'domestic' 
    ? waterStandards.TDS.domestic 
    : sectorType === 'agriculture' 
    ? waterStandards.TDS.agriculture 
    : waterStandards.TDS.industrial;

  // Calculate sub-indices (Qi) - Simple normalization
  // For parameters where LOWER is better (pH, TDS, Turbidity, Nitrate): Qi = (measured/standard) × 100
  // For parameters where HIGHER is better (DO): Qi = (standard/measured) × 100 to invert
  
  const qPH = (pH / waterStandards.pH.max) * 100; // pH / 8.5 * 100
  const qDO = (waterStandards.dissolvedOxygen.min / dissolvedOxygen) * 100; // 5 / DO * 100 (inverted)
  const qTDS = (TDS / tdsStandard) * 100;
  const qTurbidity = (turbidity / waterStandards.turbidity.max) * 100;
  const qNitrate = (nitrate / waterStandards.nitrate.max) * 100;
  
  // Calculate weighted WQI (lower is better)
  const weights = parameterWeights;
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  
  const wqi = (
    qDO * weights.dissolvedOxygen +
    qPH * weights.pH +
    qTDS * weights.TDS +
    qTurbidity * weights.turbidity +
    qNitrate * weights.nitrate
  ) / totalWeight;

  // Determine quality status
  const classification = wqiClassification.find(c => wqi >= c.min && wqi <= c.max) || wqiClassification[4];

  // Generate recommendations
  const recommendations = [];
  
  if (pH < waterStandards.pH.min) {
    recommendations.push('pH is too low (acidic). Consider adding alkaline treatment or lime.');
  } else if (pH > waterStandards.pH.max) {
    recommendations.push('pH is too high (alkaline). Consider acidification treatment.');
  }
  
  if (dissolvedOxygen < waterStandards.dissolvedOxygen.min) {
    recommendations.push('Dissolved oxygen is below required level. Aeration or oxygenation is needed.');
  }
  
  if (TDS > tdsStandard) {
    recommendations.push(`Total dissolved solids exceed ${sectorType} standards. Reverse osmosis or distillation recommended.`);
  }
  
  if (turbidity > waterStandards.turbidity.max) {
    recommendations.push('Turbidity is high. Filtration and sedimentation treatment required.');
  }
  
  if (nitrate > waterStandards.nitrate.max) {
    recommendations.push('Nitrate levels are high. Ion exchange or biological treatment needed.');
  }
  
  if (BOD > waterStandards.BOD.max) {
    recommendations.push('Biological oxygen demand is high. Biological treatment or disinfection required.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Water quality is within acceptable standards. Regular monitoring recommended.');
  }

  return {
    wqi: Math.round(wqi * 10) / 10,
    status: classification.status,
    color: classification.color,
    description: classification.description,
    recommendations,
    parameters: {
      pH: { value: pH, index: Math.round(qPH * 10) / 10, standard: `${waterStandards.pH.min}-${waterStandards.pH.max}` },
      dissolvedOxygen: { value: dissolvedOxygen, index: Math.round(qDO * 10) / 10, standard: `≥${waterStandards.dissolvedOxygen.min} mg/L` },
      TDS: { value: TDS, index: Math.round(qTDS * 10) / 10, standard: `≤${tdsStandard} mg/L` },
      turbidity: { value: turbidity, index: Math.round(qTurbidity * 10) / 10, standard: `≤${waterStandards.turbidity.max} NTU` },
      nitrate: { value: nitrate, index: Math.round(qNitrate * 10) / 10, standard: `≤${waterStandards.nitrate.max} mg/L` },
      BOD: { value: BOD, standard: `≤${waterStandards.BOD.max} mg/L` }
    }
  };
};

// Process uploaded CSV/Excel data for multiple monitoring points
export const processWaterQualityData = (dataPoints: Array<{
  location: string;
  pH: number;
  dissolvedOxygen: number;
  TDS: number;
  turbidity: number;
  nitrate: number;
  BOD: number;
  sectorType: string;
  date?: string;
}>) => {
  const results = dataPoints.map(point => ({
    location: point.location,
    date: point.date || new Date().toISOString().split('T')[0],
    ...calculateWQI(point)
  }));

  // Calculate statistics by location
  const locationStats = results.reduce((acc: any, result) => {
    if (!acc[result.location]) {
      acc[result.location] = { wqiValues: [], count: 0 };
    }
    acc[result.location].wqiValues.push(result.wqi);
    acc[result.location].count++;
    return acc;
  }, {});

  Object.keys(locationStats).forEach(location => {
    const values = locationStats[location].wqiValues;
    locationStats[location].average = Math.round((values.reduce((a: number, b: number) => a + b, 0) / values.length) * 10) / 10;
    locationStats[location].min = Math.round(Math.min(...values) * 10) / 10;
    locationStats[location].max = Math.round(Math.max(...values) * 10) / 10;
  });

  return {
    results,
    locationStats,
    summary: {
      totalPoints: results.length,
      averageWQI: Math.round((results.reduce((sum, r) => sum + r.wqi, 0) / results.length) * 10) / 10,
      excellentCount: results.filter(r => r.status === 'Excellent').length,
      goodCount: results.filter(r => r.status === 'Good').length,
      poorCount: results.filter(r => r.status === 'Poor').length,
      veryPoorCount: results.filter(r => r.status === 'Very Poor').length,
      unsuitableCount: results.filter(r => r.status === 'Unsuitable').length
    }
  };
};

// ==================== LANDSCAPE CALCULATIONS ====================

// Plant type factors (evidence-based, conservative estimates)
export const landscapeFactors: { 
  [key: string]: { 
    co2: number; 
    o2: number; 
    water: { min: number; max: number }; 
    cost: { min: number; max: number };
    description: string;
  } 
} = {
  'ShadeTree': {
    co2: 1.0,  // kg CO₂/m²/yr
    o2: 36500, // L O₂/m²/yr
    water: { min: 200, max: 600 }, // L/m²/yr
    cost: { min: 5, max: 30 }, // USD/m²
    description: 'Urban canopy trees with high CO₂ sequestration'
  },
  'GrassTurf': {
    co2: 0.05,
    o2: 1800,
    water: { min: 800, max: 1100 },
    cost: { min: 2, max: 10 },
    description: 'Lawn grass suitable for hot/dry climate'
  },
  'DecorativePlants': {
    co2: 0.08,
    o2: 900,
    water: { min: 200, max: 500 },
    cost: { min: 3, max: 15 },
    description: 'Ornamental plants and shrubs'
  },
  'DesertPlants': {
    co2: 0.035, // Average of 0.02-0.05
    o2: 350,
    water: { min: 50, max: 250 },
    cost: { min: 1, max: 6 },
    description: 'Native xerophytes with minimal water needs'
  }
};

// Water source efficiency factors
export const waterSourceFactors: { [key: string]: number } = {
  'DrinkingWater': 1.0,
  'TreatedWater': 0.8,  // 20% efficiency gain
  'Rainwater': 0.6      // 40% efficiency gain
};

// EPA conversion factors for equivalencies
export const epaConversions = {
  co2PerKmDriven: 0.404,        // kg CO₂ per km driven (average car)
  co2PerTreeYear: 21.77,        // kg CO₂ absorbed by tree per year
  o2PerPersonYear: 230000       // L O₂ consumed per person per year
};

// Normalize value between 0 and 1 based on expected range
const normalizeValue = (value: number, min: number, max: number): number => {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
};

// Calculate environmental score (0-100)
const calculateEnvScore = (
  co2Reduction: number,
  o2Production: number,
  waterEfficiency: number,
  areaM2: number
): number => {
  // Normalize metrics based on expected ranges per m²
  const normalizedCO2 = normalizeValue(co2Reduction / areaM2, 0, 1.2);
  const normalizedO2 = normalizeValue(o2Production / areaM2, 0, 40000);
  const normalizedWater = waterEfficiency; // Already 0-1
  
  // Weighted score (CO₂: 45%, O₂: 25%, Water: 30%)
  const score = (
    normalizedCO2 * 0.45 +
    normalizedO2 * 0.25 +
    normalizedWater * 0.30
  ) * 100;
  
  return Math.round(Math.max(0, Math.min(100, score)) * 10) / 10;
};

// Generate recommendations based on inputs
const generateLandscapeRecommendations = (
  plantType: string,
  waterSource: string,
  waterConsumption: number,
  areaM2: number
): string[] => {
  const recommendations = [];
  
  // Water source recommendations
  if (waterSource === 'DrinkingWater') {
    recommendations.push('Consider switching to treated water or rainwater harvesting to conserve drinking water.');
  }
  
  // Plant type specific recommendations
  if (plantType === 'GrassTurf' && waterConsumption > 90000) {
    recommendations.push('Grass turf requires significant water. Consider replacing portions with desert plants to reduce water consumption.');
  }
  
  if (plantType === 'ShadeTree') {
    recommendations.push('Space trees 5-8 meters apart for optimal canopy development and CO₂ sequestration.');
  }
  
  if (plantType === 'DesertPlants') {
    recommendations.push('Excellent choice for water conservation. Use drip irrigation and mulch to maximize efficiency.');
  }
  
  // Area-specific recommendations
  if (areaM2 > 500) {
    recommendations.push('For large areas, consider a mixed planting approach combining trees, shrubs, and ground cover for optimal environmental benefits.');
  }
  
  // General best practices
  recommendations.push('Install soil moisture sensors to optimize irrigation scheduling and reduce water waste.');
  recommendations.push('Apply organic mulch (5-10 cm depth) to reduce evaporation and maintain soil moisture.');
  
  return recommendations;
};

// Main landscape calculation function
export const calculateLandscape = (formData: {
  area: number;
  location: string;
  plantType: string;
  waterSource: string;
  costPerM2?: number;
  maintenanceYears?: number;
}) => {
  const areaM2 = parseFloat(formData.area.toString());
  const plantType = formData.plantType;
  const waterSource = formData.waterSource;
  const maintenanceYears = formData.maintenanceYears || 1;
  
  // Get factors for selected plant type
  const factors = landscapeFactors[plantType];
  if (!factors) {
    throw new Error('Invalid plant type selected');
  }
  
  // Calculate CO₂ reduction
  const co2ReductionKgPerYear = areaM2 * factors.co2;
  const co2ReductionTonsPerYear = co2ReductionKgPerYear / 1000;
  
  // Calculate O₂ production
  const o2ProductionLPerYear = areaM2 * factors.o2;
  
  // Calculate water consumption (use average of min/max)
  const waterUsePerM2 = (factors.water.min + factors.water.max) / 2;
  const waterSourceEfficiency = waterSourceFactors[waterSource] || 1.0;
  const waterConsumptionLPerYear = areaM2 * waterUsePerM2 * waterSourceEfficiency;
  const waterConsumptionM3PerYear = waterConsumptionLPerYear / 1000;
  
  // Water efficiency score (inverse of water use, normalized)
  const maxWaterUse = 1100; // Max water use per m² (grass turf max)
  const waterEfficiency = 1 - (waterUsePerM2 / maxWaterUse);
  
  // Calculate costs
  const avgCostPerM2 = formData.costPerM2 || (factors.cost.min + factors.cost.max) / 2;
  const plantingCost = areaM2 * avgCostPerM2;
  const annualMaintenanceCost = plantingCost * 0.15; // 15% of planting cost
  const totalCost = plantingCost + (annualMaintenanceCost * maintenanceYears);
  
  // Calculate equivalencies using EPA conversions
  const carKmEquivalent = co2ReductionKgPerYear / epaConversions.co2PerKmDriven;
  const treesEquivalent = co2ReductionKgPerYear / epaConversions.co2PerTreeYear;
  const peopleO2Equivalent = o2ProductionLPerYear / epaConversions.o2PerPersonYear;
  
  // Calculate environmental score
  const envScore = calculateEnvScore(
    co2ReductionKgPerYear,
    o2ProductionLPerYear,
    waterEfficiency,
    areaM2
  );
  
  // Determine score category
  let scoreCategory = '';
  let scoreColor = '';
  if (envScore >= 75) {
    scoreCategory = 'Excellent';
    scoreColor = '#10b981';
  } else if (envScore >= 60) {
    scoreCategory = 'Good';
    scoreColor = '#3b82f6';
  } else if (envScore >= 40) {
    scoreCategory = 'Moderate';
    scoreColor = '#f59e0b';
  } else {
    scoreCategory = 'Poor';
    scoreColor = '#ef4444';
  }
  
  // Generate recommendations
  const recommendations = generateLandscapeRecommendations(
    plantType,
    waterSource,
    waterConsumptionLPerYear,
    areaM2
  );
  
  // Calculate yearly projections (25 years)
  const yearlyData = [];
  let cumulativeCO2 = 0;
  let cumulativeO2 = 0;
  let annualCO2 = co2ReductionKgPerYear;
  let annualO2 = o2ProductionLPerYear;
  const maturityRate = 0.05; // 5% increase per year until maturity (year 10)
  
  for (let year = 1; year <= 25; year++) {
    // Trees increase sequestration until maturity (~10 years), then plateau
    if (plantType === 'ShadeTree' && year <= 10) {
      annualCO2 *= (1 + maturityRate);
      annualO2 *= (1 + maturityRate);
    }
    
    cumulativeCO2 += annualCO2;
    cumulativeO2 += annualO2;
    
    yearlyData.push({
      year,
      co2Reduction: Math.round(annualCO2 * 10) / 10,
      cumulativeCO2: Math.round(cumulativeCO2 * 10) / 10,
      o2Production: Math.round(annualO2),
      waterUse: Math.round(waterConsumptionLPerYear)
    });
  }
  
  return {
    areaM2: Math.round(areaM2 * 10) / 10,
    plantType,
    plantDescription: factors.description,
    waterSource,
    co2ReductionKgPerYear: Math.round(co2ReductionKgPerYear * 10) / 10,
    co2ReductionTonsPerYear: Math.round(co2ReductionTonsPerYear * 100) / 100,
    o2ProductionLPerYear: Math.round(o2ProductionLPerYear),
    o2ProductionM3PerYear: Math.round(o2ProductionLPerYear / 1000 * 10) / 10,
    waterConsumptionLPerYear: Math.round(waterConsumptionLPerYear),
    waterConsumptionM3PerYear: Math.round(waterConsumptionM3PerYear * 10) / 10,
    plantingCost: Math.round(plantingCost),
    annualMaintenanceCost: Math.round(annualMaintenanceCost),
    totalCost: Math.round(totalCost),
    maintenanceYears,
    envScore,
    scoreCategory,
    scoreColor,
    equivalencies: {
      carKmEquivalent: Math.round(carKmEquivalent),
      treesEquivalent: Math.round(treesEquivalent * 10) / 10,
      peopleO2Equivalent: Math.round(peopleO2Equivalent * 10) / 10
    },
    recommendations,
    yearlyData,
    factors: {
      co2FactorPerM2: factors.co2,
      o2FactorPerM2: factors.o2,
      waterUsePerM2: Math.round(waterUsePerM2),
      costPerM2: Math.round(avgCostPerM2 * 100) / 100
    }
  };
};
