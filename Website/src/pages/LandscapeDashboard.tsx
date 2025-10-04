import React from 'react';
import { Link } from 'react-router-dom';
import { Trees, Leaf, Droplets, DollarSign, TrendingUp, Award } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import satelliteGif from './public/images/satellite.gif'; // Ensure you have a satellite.gif in the images folder

interface YearlyLandscapeEntry {
  year: number;
  co2Reduction: number;
  cumulativeCO2: number;
}

interface LandscapeResults {
  envScore: number;
  scoreCategory: string;
  scoreColor: string;
  plantDescription: string;
  areaM2: number;
  factors: {
    co2FactorPerM2: number;
    o2FactorPerM2: number;
    waterUsePerM2: number;
  };
  plantingCost: number;
  annualMaintenanceCost: number;
  waterConsumptionM3PerYear: number;
  waterSource: string;
  co2ReductionTonsPerYear: number;
  o2ProductionM3PerYear: number;
  maintenanceYears: number;
  totalCost: number;
  equivalencies: {
    treesEquivalent: number;
    peopleO2Equivalent: number;
    carKmEquivalent: number;
  };
  yearlyData: YearlyLandscapeEntry[];
  recommendations: string[];
}

interface LandscapeDashboardProps {
  landscapeResults: LandscapeResults;
  location: string;
  onAnalyzeAgain: () => void;
}

const LandscapeDashboard: React.FC<LandscapeDashboardProps> = ({ landscapeResults, location, onAnalyzeAgain }) => {
  const results = landscapeResults;

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 dark:text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1a5059] dark:text-white mb-2 flex items-center justify-center gap-3">
            <Trees className="h-10 w-10 text-[#5c986a]" />
            Landscape Environmental Impact Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">{location} • CO₂ Sequestration & Oxygen Production Analysis</p>
        </div>

        {/* Results Dashboard */}
        {results && (
          <>
            {/* Environmental Score */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border-2 border-[#5c986a]/20 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Award className="h-12 w-12" style={{ color: results.scoreColor }} />
                  <div>
                    <h2 className="text-3xl font-bold text-[#1a5059] dark:text-white">Environmental Score: {results.envScore}</h2>
                    <p className="text-lg font-semibold" style={{ color: results.scoreColor }}>
                      Rating: {results.scoreCategory}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{results.plantDescription}</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold" 
                       style={{ backgroundColor: `${results.scoreColor}20`, color: results.scoreColor }}>
                    {results.envScore}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 p-6 rounded-2xl border-2 border-green-500/30 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">CO₂ Reduction</h3>
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-[#1a5059]">{results.co2ReductionTonsPerYear} tons/yr</p>
                <p className="text-xs text-gray-600 mt-1">≈ {results.equivalencies.treesEquivalent} trees</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 p-6 rounded-2xl border-2 border-blue-500/30 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">O₂ Production</h3>
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-[#1a5059] dark:text-white">{results.o2ProductionM3PerYear} m³/yr</p>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">For {results.equivalencies.peopleO2Equivalent} people</p>
              </div>

              <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 p-6 rounded-2xl border-2 border-cyan-500/30 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Water Usage</h3>
                  <Droplets className="h-6 w-6 text-cyan-600" />
                </div>
                <p className="text-3xl font-bold text-[#1a5059]">{results.waterConsumptionM3PerYear} m³/yr</p>
                <p className="text-xs text-gray-600 mt-1">{results.waterSource}</p>
              </div>

              <div className="bg-gradient-to-br from-[#dda853]/20 to-[#dda853]/5 p-6 rounded-2xl border-2 border-[#dda853]/30 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Total Cost</h3>
                  <DollarSign className="h-6 w-6 text-[#dda853]" />
                </div>
                <p className="text-3xl font-bold text-[#1a5059]">{formatNumber(results.totalCost)} USD</p>
                <p className="text-xs text-gray-600 mt-1">{results.maintenanceYears} years</p>
              </div>
            </div>

            {/* Environmental Equivalencies */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border-2 border-[#5c986a]/20 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-[#1a5059] mb-6">Environmental Impact Equivalencies</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 dark:bg-gray-700/40 rounded-xl border-2 border-green-200 dark:border-gray-700">
                  <h4 className="font-semibold text-green-800 mb-2">Car Emissions Offset</h4>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">{formatNumber(results.equivalencies.carKmEquivalent)} km</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">of driving per year</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-gray-700/40 rounded-xl border-2 border-blue-200 dark:border-gray-700">
                  <h4 className="font-semibold text-blue-800 mb-2">Tree Equivalent</h4>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{results.equivalencies.treesEquivalent}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">mature trees' CO₂ absorption</p>
                </div>
                <div className="p-4 bg-cyan-50 dark:bg-gray-700/40 rounded-xl border-2 border-cyan-200 dark:border-gray-700">
                  <h4 className="font-semibold text-cyan-800 mb-2">Oxygen for People</h4>
                  <p className="text-3xl font-bold text-cyan-700 dark:text-cyan-300">{results.equivalencies.peopleO2Equivalent}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">people's annual O₂ needs</p>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* CO₂ Reduction Over Time */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-2 border-[#5c986a]/20 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-[#1a5059] mb-4">CO₂ Sequestration (25 Years)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={results.yearlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#c5d9a9" />
                      <XAxis dataKey="year" stroke="#1a5059" />
                      <YAxis stroke="#1a5059" />
                    <Tooltip 
                      formatter={(value: number | string) => [`${value} kg`, 'CO₂ Reduction']}
                        contentStyle={{ borderRadius: '8px', border: '2px solid #5c986a' }}
                      />
                      <Line type="monotone" dataKey="co2Reduction" stroke="#10b981" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Cumulative Environmental Impact */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-2 border-[#5c986a]/20 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-[#1a5059] mb-4">Cumulative CO₂ Sequestration</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results.yearlyData.filter((_: YearlyLandscapeEntry, i: number) => i % 2 === 0)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#c5d9a9" />
                      <XAxis dataKey="year" stroke="#1a5059" />
                      <YAxis stroke="#1a5059" />
                      <Tooltip 
                        formatter={(value: number | string) => [`${formatNumber(Number(value))} kg`, 'Cumulative CO₂']}
                        contentStyle={{ borderRadius: '8px', border: '2px solid #5c986a' }}
                      />
                      <Bar dataKey="cumulativeCO2" fill="#5c986a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Resource Breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border-2 border-[#5c986a]/20 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-[#1a5059] mb-6">Resource Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-200">Area Covered</span>
                    <span className="font-bold text-[#1a5059] dark:text-white">{results.areaM2} m²</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-200">CO₂ Factor (per m²)</span>
                    <span className="font-bold text-[#1a5059] dark:text-white">{results.factors.co2FactorPerM2} kg/m²/yr</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-200">O₂ Factor (per m²)</span>
                    <span className="font-bold text-[#1a5059] dark:text-white">{formatNumber(results.factors.o2FactorPerM2)} L/m²/yr</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-200">Water Use (per m²)</span>
                    <span className="font-bold text-[#1a5059] dark:text-white">{results.factors.waterUsePerM2} L/m²/yr</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-200">Planting Cost</span>
                    <span className="font-bold text-[#1a5059] dark:text-white">{formatNumber(results.plantingCost)} USD</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-200">Annual Maintenance</span>
                    <span className="font-bold text-[#1a5059] dark:text-white">{formatNumber(results.annualMaintenanceCost)} USD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-2 border-[#5c986a]/20 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-[#1a5059] mb-4 flex items-center gap-2">
                <Leaf className="h-6 w-6 text-[#5c986a]" />
                Recommendations
              </h3>
              <ul className="space-y-3">
                {results.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-gray-700/40 rounded-lg">
                    <Leaf className="h-5 w-5 text-[#5c986a] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-200">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
        {/* Satellite Imagery */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border-2 border-[#5c986a]/20 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-[#1a5059] mb-4">Satellite View</h3>
          <div className="flex justify-center">
            <img 
                src={`${import.meta.env.BASE_URL}Images/satelliteGif.gif`}
              alt="NASA Worldview Satellite Imagery"
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-300 text-center mt-3">NASA Worldview - {location}</p>
        </div>

            {/* Action Buttons (Unified style) */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
              <button
                onClick={onAnalyzeAgain}
                className="group glass border-2 border-[#5c986a] text-[#1a5059] font-bold py-4 px-8 rounded-full inline-flex items-center justify-center transition-all duration-300 hover:bg-[#5c986a]/10 transform hover:scale-105"
              >
                Analyze Again
              </button>
              <button
                onClick={() => window.print()}
                className="bg-gradient-to-r from-[#5c986a] to-[#84f4e6] hover:from-[#84f4e6] hover:to-[#5c986a] text-white font-bold py-4 px-8 rounded-full inline-flex items-center justify-center transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                Save Results
              </button>
              <Link
                to="/city-builder"
                className="bg-white text-[#1a5059] border-2 border-[#84f4e6] hover:bg-[#c5d9a9]/20 font-bold py-4 px-8 rounded-full inline-flex items-center justify-center transition-all duration-300"
              >
                Go to Game
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LandscapeDashboard;
