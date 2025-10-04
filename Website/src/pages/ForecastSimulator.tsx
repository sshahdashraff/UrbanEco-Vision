import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Sun, Sliders, Download, Sparkles, ArrowRight } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Types
interface HourlyProduction { hour: number; production: number }
interface MonthlyProduction { month: string; production: number }
interface YearlyProduction { year: number; production: number }
interface CostTrend { year: number; cost: number }
interface DegradationPoint { year: number; efficiency: number }

interface SimulationResults {
  dailyProduction: HourlyProduction[];
  monthlyProduction: MonthlyProduction[];
  yearlyProduction: YearlyProduction[];
  costTrends: CostTrend[];
  degradation: DegradationPoint[];
  totalProduction: number;
  averageDailyProduction: number;
  peakProduction: number;
  co2Reduction: number;
  roi: number | string;
}

const ForecastSimulator: React.FC = () => {
  // State for location and parameters
  const navigate = useNavigate();
  const [location, setLocation] = useState<string>('Cairo, Egypt');
  const [parameters, setParameters] = useState({
    // Solar parameters
    panelSize: 330, // Watts per panel
    panelCount: 100,
    investment: 500000, // EGP
    gridConnection: 'grid' as 'grid' | 'off-grid',
    panelType: 'monocrystalline' as 'monocrystalline' | 'polycrystalline' | 'bifacial',
    installationType: 'rooftop' as 'rooftop' | 'ground-mounted',
    // Water parameters
    populationServed: 50000,
    waterDemand: 150, // liters per capita per day
    currentLeakageRate: 25, // percentage
    infrastructureAge: 20, // years
    waterSource: 'municipal' as 'municipal' | 'groundwater' | 'surface-water',
    treatmentType: 'conventional' as 'conventional' | 'advanced' | 'desalination'
  });

  // State for simulation results
  const [simulationResults, setSimulationResults] = useState<SimulationResults>({
    dailyProduction: [],
    monthlyProduction: [],
    yearlyProduction: [],
    costTrends: [],
    degradation: [],
    totalProduction: 0,
    averageDailyProduction: 0,
    peakProduction: 0,
    co2Reduction: 0,
    roi: '—'
  });

  // State for simulation status
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);

  // State for Oracle modal
  const [showOracleModal, setShowOracleModal] = useState(true);
  const [selectedGuardian, setSelectedGuardian] = useState<'solara' | null>('solara');

  // Handle parameter changes
  const handleParameterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement & HTMLSelectElement;
    setParameters(prev => ({
      ...prev,
      [name]: name === 'panelSize' || name === 'panelCount' || name === 'investment'
        ? Number(value)
        : value
    }));
  };

  // Handle location change
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  // Run simulation
  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationComplete(false);
    setSimulationProgress(0);

    // Simulate progress
    const timer = window.setInterval(() => {
      setSimulationProgress(prev => {
        const next = Math.min(prev + 5, 100);
        if (next >= 100) {
          clearInterval(timer);
          setIsSimulating(false);
          setSimulationComplete(true);
        }
        return next;
      });
    }, 150);

    // Generate simulation results based on parameters (simulate latency)
    setTimeout(() => {
      // Calculate system capacity in kW
      const systemCapacity = (parameters.panelSize * parameters.panelCount) / 1000; // kW

      // Efficiency factors based on panel type
      const efficiencyFactor =
        parameters.panelType === 'monocrystalline' ? 1.0 :
        parameters.panelType === 'polycrystalline' ? 0.9 :
        parameters.panelType === 'bifacial' ? 1.15 : 1.0;

      // Location-based solar irradiance factor (simplified)
      const irradianceFactor = location.includes('Cairo') ? 1.0 :
                              location.includes('Alexandria') ? 0.95 :
                              location.includes('Aswan') ? 1.1 : 1.0;

      // Installation type factor
      const installationFactor = parameters.installationType === 'rooftop' ? 1.0 : 1.05;

      // Grid connection factor
      const gridFactor = parameters.gridConnection === 'grid' ? 1.0 : 0.85;

      // Calculate base daily production per kW (simplified model: average peak equivalent hours)
      const baseProduction = 4.5 * efficiencyFactor * irradianceFactor * installationFactor * gridFactor; // kWh per kW per day

      // Generate hourly production data (simplified model)
      const dailyProduction: HourlyProduction[] = Array.from({ length: 24 }, (_, hour) => {
        let production = 0;

        if (hour >= 6 && hour <= 18) {
          // Bell curve peaking at noon
          const hourFactor = 1 - Math.abs(hour - 12) / 6;
          production = systemCapacity * baseProduction * hourFactor * hourFactor; // kWh in that hour (approx)
        }

        return { hour, production: Math.round(production * 100) / 100 };
      });

      // Generate monthly production data (simplified model)
      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];

      const monthlyProduction: MonthlyProduction[] = monthNames.map((month, index) => {
        let seasonalFactor = 1.0;
        // Summer (May-Sep) boost
        if (index >= 4 && index <= 8) seasonalFactor = 1.2;
        // Winter (Nov-Feb) lower
        if (index === 10 || index === 11 || index === 0 || index === 1) seasonalFactor = 0.8;

        const production = systemCapacity * baseProduction * seasonalFactor * daysInMonth[index];
        return { month, production: Math.round(production) };
      });

      // Calculate total annual production
      const totalProduction = monthlyProduction.reduce((sum, m) => sum + m.production, 0);

      // Generate yearly production data with degradation
      const yearlyProduction: YearlyProduction[] = Array.from({ length: 25 }, (_, i) => {
        const year = 2025 + i;
        const degradationFactor = Math.pow(0.995, i); // 0.5% per year
        const production = Math.round(totalProduction * degradationFactor);
        return { year, production };
      });

      // Generate cost trends (simplified model)
      const costTrends: CostTrend[] = Array.from({ length: 25 }, (_, i) => {
        const year = 2025 + i;
        const costFactor = Math.pow(1.03, i); // 3% inflation
        const baseElectricityCost = 1.5; // EGP/kWh
        const cost = Math.round(baseElectricityCost * costFactor * 100) / 100;
        return { year, cost };
      });

      // Generate panel degradation data
      const degradation: DegradationPoint[] = Array.from({ length: 25 }, (_, i) => {
        const year = 2025 + i;
        const efficiency = Math.round(100 * Math.pow(0.995, i) * 100) / 100;
        return { year, efficiency };
      });

      // Calculate other metrics
      const averageDailyProduction = Math.round(totalProduction / 365);
      const peakProduction = Math.max(...dailyProduction.map(d => d.production), 0);
      const co2Reduction = Math.round(totalProduction * 0.5); // 0.5 kg CO2 per kWh (simplified)

      // Calculate ROI (years)
      const electricityCost = 1.5; // EGP per kWh (base)
      const annualSavings = totalProduction * electricityCost; // EGP/year
      const roi = annualSavings > 0 ? Math.round((parameters.investment / annualSavings) * 10) / 10 : '—';

      setSimulationResults({
        dailyProduction,
        monthlyProduction,
        yearlyProduction,
        costTrends,
        degradation,
        totalProduction,
        averageDailyProduction,
        peakProduction,
        co2Reduction,
        roi
      });

      // Ensure final progress state
      setSimulationProgress(100);
      setIsSimulating(false);
      setSimulationComplete(true);

      clearInterval(timer);
    }, 1200);
  };

  // Use this data in my project
  const handleUseData = () => {
    // implement saving to project storage / context as needed
    alert('Data has been saved to your project. You can now view it in your dashboard.');
  };

  // Export report (simple CSV export example)
  const handleExportReport = () => {
    const { yearlyProduction } = simulationResults;
    if (!yearlyProduction || yearlyProduction.length === 0) return alert('No results to export yet.');

    const rows = [['Year','AnnualProduction(kWh)'], ...yearlyProduction.map(r => [String(r.year), String(r.production)])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'solar_yearly_production.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Reset simulation state when switching between guardians
  // Reset state helper (not needed for single-guardian flow)

  // Format number with commas
  const formatNumber = (num: number | string) => {
    if (typeof num === 'string') return num;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const guardianDetails = {
    solara: {
      intro: "I guide you to harness the sun. From rooftops to facades, I reveal hidden solar potential and pathways to resilient, low-carbon power.",
      icon: Sun,
      gradient: 'from-[#dda853] to-[#5c986a]',
      color: '#dda853'
    }
  } as const;

  const handleGuardianSelect = () => {
    setSelectedGuardian('solara');
    setShowOracleModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8 border border-[#84f4e6]/20">
          <div className="p-6 border-b border-[#84f4e6]/20 bg-gradient-to-r from-[#1a5059] to-[#5c986a]">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Solar Energy Forecast Tool</h1>
                <p className="mt-2 text-[#84f4e6]">Simulate solar production, costs, and panel degradation for your specific parameters</p>
              </div>
              
            </div>
          </div>

          {/* Input Parameters */}
          <div className="p-6 bg-gradient-to-br from-[#c5d9a9]/10 to-white border-b border-[#84f4e6]/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-[#1a5059] mb-4">Location & System Parameters</h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-[#5c986a]" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={handleLocationChange}
                    className="w-full px-4 py-3 border-2 border-[#84f4e6]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5c986a] focus:border-transparent transition-all"
                    placeholder="e.g., Cairo, Egypt"
                  />
                </div>

                {selectedGuardian === 'solara' && (
                  // Solar Parameters
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Sun className="h-4 w-4 mr-1 text-[#5c986a]" />
                        Panel Type
                      </label>
                      <select
                        name="panelType"
                        value={parameters.panelType}
                        onChange={handleParameterChange}
                        className="w-full px-4 py-3 border-2 border-[#84f4e6]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5c986a] focus:border-transparent transition-all"
                      >
                        <option value="monocrystalline">Monocrystalline (High Efficiency)</option>
                        <option value="polycrystalline">Polycrystalline (Standard)</option>
                        <option value="bifacial">Bifacial (Dual-sided)</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Sliders className="h-4 w-4 mr-1 text-[#5c986a]" />
                        Panel Size (Watts)
                      </label>
                      <input
                        type="number"
                        name="panelSize"
                        value={parameters.panelSize}
                        onChange={handleParameterChange}
                        min={250}
                        max={600}
                        step={10}
                        className="w-full px-4 py-3 border-2 border-[#84f4e6]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5c986a] focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Sliders className="h-4 w-4 mr-1 text-[#5c986a]" />
                        Number of Panels
                      </label>
                      <input
                        type="number"
                        name="panelCount"
                        value={parameters.panelCount}
                        onChange={handleParameterChange}
                        min={10}
                        max={1000}
                        step={10}
                        className="w-full px-4 py-3 border-2 border-[#84f4e6]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5c986a] focus:border-transparent transition-all"
                      />
                    </div>
                  </>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold text-[#1a5059] mb-4">Financial & Installation Parameters</h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Sliders className="h-4 w-4 mr-1 text-[#5c986a]" />
                    Investment Range (EGP)
                  </label>
                  <input
                    type="number"
                    name="investment"
                    value={parameters.investment}
                    onChange={handleParameterChange}
                    min={100000}
                    max={10000000}
                    step={50000}
                    className="w-full px-4 py-3 border-2 border-[#84f4e6]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5c986a] focus:border-transparent transition-all"
                  />
                </div>

                {selectedGuardian === 'solara' && (
                  // Solar System Parameters
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Sliders className="h-4 w-4 mr-1 text-[#5c986a]" />
                        Grid Connection
                      </label>
                      <select
                        name="gridConnection"
                        value={parameters.gridConnection}
                        onChange={handleParameterChange}
                        className="w-full px-4 py-3 border-2 border-[#84f4e6]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5c986a] focus:border-transparent transition-all"
                      >
                        <option value="grid">Grid-Connected</option>
                        <option value="off-grid">Off-Grid (Battery Storage)</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Sliders className="h-4 w-4 mr-1 text-[#5c986a]" />
                        Installation Type
                      </label>
                      <select
                        name="installationType"
                        value={parameters.installationType}
                        onChange={handleParameterChange}
                        className="w-full px-4 py-3 border-2 border-[#84f4e6]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5c986a] focus:border-transparent transition-all"
                      >
                        <option value="rooftop">Rooftop Installation</option>
                        <option value="ground-mounted">Ground-Mounted System</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="mt-8">
                  <button
                    onClick={runSimulation}
                    disabled={isSimulating}
                    className="w-full bg-gradient-to-r from-[#5c986a] to-[#84f4e6] hover:from-[#4a7d56] hover:to-[#6cd9c7] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                  >
                    {isSimulating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Simulating...
                      </>
                    ) : (
                      'Run Simulation'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Simulation Progress */}
          {isSimulating && (
            <div className="p-6 border-b border-[#84f4e6]/20 bg-gradient-to-br from-[#c5d9a9]/20 to-white">
              <h2 className="text-xl font-semibold text-[#1a5059] mb-4">Simulation in Progress</h2>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#5c986a] to-[#84f4e6] h-3 rounded-full transition-all duration-300 animate-pulse"
                  style={{ width: `${simulationProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 text-center font-medium">
                {simulationProgress < 30 ? 'Analyzing location data...' :
                 simulationProgress < 60 ? 'Calculating solar production...' :
                 simulationProgress < 90 ? 'Generating financial projections...' :
                 'Finalizing results...'}
              </p>
            </div>
          )}

          {/* Simulation Results */}
          {simulationComplete && (
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h2 className="text-2xl font-semibold text-[#1a5059]">Simulation Results</h2>
                <div className="flex space-x-3 mt-4 md:mt-0">
                  <button
                    onClick={handleUseData}
                    className="inline-flex items-center px-5 py-3 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-[#5c986a] to-[#84f4e6] hover:from-[#4a7d56] hover:to-[#6cd9c7] focus:outline-none transition-all transform hover:scale-105"
                  >
                    Use This Data in My Project
                  </button>
                  <button
                    onClick={handleExportReport}
                    className="inline-flex items-center px-5 py-3 border-2 border-[#84f4e6] text-sm font-medium rounded-xl shadow-sm text-[#1a5059] bg-white hover:bg-[#c5d9a9]/20 focus:outline-none transition-all transform hover:scale-105"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </button>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-[#5c986a]/10 to-[#84f4e6]/10 p-6 rounded-2xl border-2 border-[#84f4e6]/30 shadow-lg transform hover:scale-105 transition-all">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Annual Production</h3>
                  <p className="text-3xl font-bold bg-gradient-to-r from-[#1a5059] to-[#5c986a] bg-clip-text text-transparent">{formatNumber(simulationResults.totalProduction)} kWh</p>
                </div>

                <div className="bg-gradient-to-br from-[#5c986a]/10 to-[#84f4e6]/10 p-6 rounded-2xl border-2 border-[#84f4e6]/30 shadow-lg transform hover:scale-105 transition-all">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Daily Average</h3>
                  <p className="text-3xl font-bold bg-gradient-to-r from-[#1a5059] to-[#5c986a] bg-clip-text text-transparent">{formatNumber(simulationResults.averageDailyProduction)} kWh</p>
                </div>

                <div className="bg-gradient-to-br from-[#5c986a]/10 to-[#84f4e6]/10 p-6 rounded-2xl border-2 border-[#84f4e6]/30 shadow-lg transform hover:scale-105 transition-all">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">CO₂ Reduction</h3>
                  <p className="text-3xl font-bold bg-gradient-to-r from-[#1a5059] to-[#5c986a] bg-clip-text text-transparent">{formatNumber(simulationResults.co2Reduction)} kg/year</p>
                </div>

                <div className="bg-gradient-to-br from-[#5c986a]/10 to-[#84f4e6]/10 p-6 rounded-2xl border-2 border-[#84f4e6]/30 shadow-lg transform hover:scale-105 transition-all">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">ROI Period</h3>
                  <p className="text-3xl font-bold bg-gradient-to-r from-[#1a5059] to-[#5c986a] bg-clip-text text-transparent">{simulationResults.roi} years</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Daily Production Chart */}
                <div className="bg-white p-6 rounded-2xl border-2 border-[#84f4e6]/30 shadow-lg">
                  <h3 className="text-lg font-medium text-[#1a5059] mb-4">Daily Production Profile</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={simulationResults.dailyProduction}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#c5d9a9" />
                        <XAxis dataKey="hour" label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5 }} stroke="#1a5059" />
                        <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} stroke="#1a5059" />
                        <Tooltip formatter={(value: number | string) => [`${value} kWh`, 'Production']} contentStyle={{ borderRadius: '8px', border: '2px solid #84f4e6' }} />
                        <defs>
                          <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FFD700" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#FFA500" stopOpacity={0.8}/>
                          </linearGradient>
                        </defs>
                        <Bar dataKey="production" fill="url(#colorDaily)" name="Solar Production" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Monthly Production Chart */}
                <div className="bg-white p-6 rounded-2xl border-2 border-[#84f4e6]/30 shadow-lg">
                  <h3 className="text-lg font-medium text-[#1a5059] mb-4">Monthly Production</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={simulationResults.monthlyProduction}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#c5d9a9" />
                        <XAxis dataKey="month" stroke="#1a5059" />
                        <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} stroke="#1a5059" />
                        <Tooltip formatter={(value: number | string) => [`${value} kWh`, 'Production']} contentStyle={{ borderRadius: '8px', border: '2px solid #84f4e6' }} />
                        <defs>
                          <linearGradient id="colorMonthly" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#5c986a" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#84f4e6" stopOpacity={0.8}/>
                          </linearGradient>
                        </defs>
                        <Bar dataKey="production" fill="url(#colorMonthly)" name="Monthly Production" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Long-term Production Chart */}
                <div className="bg-white p-6 rounded-2xl border-2 border-[#84f4e6]/30 shadow-lg">
                  <h3 className="text-lg font-medium text-[#1a5059] mb-4">25-Year Production Forecast</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={simulationResults.yearlyProduction}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#c5d9a9" />
                        <XAxis dataKey="year" stroke="#1a5059" />
                        <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} stroke="#1a5059" />
                        <Tooltip formatter={(value: number | string) => [`${value} kWh`, 'Annual Production']} contentStyle={{ borderRadius: '8px', border: '2px solid #84f4e6' }} />
                        <Line type="monotone" dataKey="production" stroke="#5c986a" name="Annual Production" strokeWidth={3} dot={{ r: 4, fill: '#5c986a' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Panel Degradation Chart */}
                <div className="bg-white p-6 rounded-2xl border-2 border-[#84f4e6]/30 shadow-lg">
                  <h3 className="text-lg font-medium text-[#1a5059] mb-4">Panel Efficiency Over Time</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={simulationResults.degradation}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#c5d9a9" />
                        <XAxis dataKey="year" stroke="#1a5059" />
                        <YAxis domain={[80, 100]} label={{ value: 'Efficiency %', angle: -90, position: 'insideLeft' }} stroke="#1a5059" />
                        <Tooltip formatter={(value: number | string) => [`${value}%`, 'Panel Efficiency']} contentStyle={{ borderRadius: '8px', border: '2px solid #84f4e6' }} />
                        <Line type="monotone" dataKey="efficiency" stroke="#84f4e6" name="Panel Efficiency" strokeWidth={3} dot={{ r: 4, fill: '#84f4e6' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Oracle Introduction Modal */}
      {showOracleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in p-4">
          <div className="relative z-10 w-full max-w-3xl animate-scale-in" style={{ animationDuration: '500ms' }}>
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#0b2d33] to-[#1a5059] text-white border border-white/10 max-h-[90vh] overflow-y-auto">
              <div className="relative h-1 w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-[#dda853] via-[#84f4e6] to-[#5c986a] animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
              </div>

              <div className="p-6 sm:p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-4 animate-bounce-subtle">
                    <Sparkles className="h-5 w-5 text-[#dda853] mr-2 animate-spin-slow" />
                    <span className="text-sm font-bold">Oracle Awaits</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 leading-tight animate-fade-in-down">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#dda853] via-[#e8c57d] to-[#f0e0b5] animate-gradient-x">
                      The Oracle Reveals Your Path
                    </span>
                  </h2>

                  <p className="text-base sm:text-lg text-[#d9f5f2]/90 mb-2 leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>You've seen today. You've optimized tomorrow.</p>
                  <p className="text-lg sm:text-xl font-bold text-white mb-3 animate-fade-in" style={{ animationDelay: '400ms' }}>What about the next years?</p>
                  <p className="text-sm text-[#84f4e6]/90 italic animate-fade-in" style={{ animationDelay: '600ms' }}>Choose your guardian to reveal your city's destiny...</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-center mb-4 text-[#c5d9a9] animate-pulse">Select Your Guardian</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div
                      onClick={handleGuardianSelect}
                      className="group cursor-pointer bg-gradient-to-br from-white/10 to-[#dda853]/10 p-5 rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-2 border-transparent hover:border-[#dda853] animate-fade-in-left"
                      style={{ animationDelay: '800ms' }}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-3 group-hover:rotate-12 transition-transform duration-500 shadow-lg bg-gradient-to-br from-[#dda853] to-[#5c986a]">
                          <Sun className="h-8 w-8 text-white group-hover:scale-125 transition-transform" />
                        </div>
                        <h4 className="text-xl font-bold mb-2 text-white group-hover:text-[#dda853] transition-colors">SOLARA</h4>
                        <p className="text-[#dda853] font-semibold mb-2 text-sm">Guardian of Energy</p>
                        <p className="text-[#d9f5f2]/80 text-xs leading-relaxed">{guardianDetails.solara.intro}</p>
                        <div className="mt-4 inline-flex items-center text-[#dda853] group-hover:text-white transition-colors text-sm">
                          <span className="font-semibold">Select</span>
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center animate-fade-in" style={{ animationDelay: '1000ms' }}>
                  <button onClick={() => navigate('/about')} className="text-[#d9f5f2]/70 hover:text-white transition-colors underline text-xs">Skip for now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastSimulator;
