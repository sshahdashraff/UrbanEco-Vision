import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Zap, DollarSign, TrendingUp, Leaf, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface YearlyDataEntry {
  year: number;
  savings: number;
  cumulativeSavings: number;
  production: number;
  co2Saved: number;
}

interface SolarResults {
  yearlyData: YearlyDataEntry[];
  installationCost: number;
  annualProduction: number;
  productionFactor: number;
  solarCoveragePercent: number;
  roi: number;
  paybackYears: number;
  netSavings: number;
  areaWarning?: boolean;
  requiredArea?: number;
  availableArea?: number;
  systemSizeKwp: number;
  currentBill: number;
  weightedTariff: number;
  annualSavings: number;
  co2SavingTons: number;
  treesEquivalent: number;
  newBill: number;
}

interface SolarDashboardProps {
  solarResults: SolarResults;
  location: string;
  sectorType: string;
  onAnalyzeAgain: () => void;
}

const SolarDashboard: React.FC<SolarDashboardProps> = ({ solarResults, location, sectorType, onAnalyzeAgain }) => {
  // Prepare data for financial projection chart
  const financialProjection = solarResults.yearlyData.map((year: YearlyDataEntry) => ({
    year: year.year,
    savings: year.savings,
    cumulative: year.cumulativeSavings,
    investment: year.year === 1 ? -solarResults.installationCost : 0
  }));

  // Prepare data for production degradation chart
  const productionData = solarResults.yearlyData.slice(0, 25).map((year: YearlyDataEntry) => ({
    year: year.year,
    production: year.production,
    co2Saved: year.co2Saved
  }));

  // Monthly production estimate (simplified)
  const monthlyProduction = [
    { month: 'Jan', production: solarResults.annualProduction * 0.07 },
    { month: 'Feb', production: solarResults.annualProduction * 0.08 },
    { month: 'Mar', production: solarResults.annualProduction * 0.09 },
    { month: 'Apr', production: solarResults.annualProduction * 0.09 },
    { month: 'May', production: solarResults.annualProduction * 0.10 },
    { month: 'Jun', production: solarResults.annualProduction * 0.10 },
    { month: 'Jul', production: solarResults.annualProduction * 0.10 },
    { month: 'Aug', production: solarResults.annualProduction * 0.09 },
    { month: 'Sep', production: solarResults.annualProduction * 0.08 },
    { month: 'Oct', production: solarResults.annualProduction * 0.08 },
    { month: 'Nov', production: solarResults.annualProduction * 0.07 },
    { month: 'Dec', production: solarResults.annualProduction * 0.05 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-[#5c986a]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#5c986a] to-[#84f4e6] flex items-center justify-center">
                <Sun className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#1a5059]">Solar Energy Dashboard</h1>
                <p className="text-gray-600">{location} • {sectorType.charAt(0).toUpperCase() + sectorType.slice(1)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Analysis Date</p>
              <p className="text-lg font-semibold text-[#1a5059]">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Area Warning */}
        {solarResults.areaWarning && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-xl">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
              <div>
                <p className="font-semibold text-yellow-800">Insufficient Space</p>
                <p className="text-sm text-yellow-700">
                  Required area: {solarResults.requiredArea}m² | Available: {solarResults.availableArea}m²
                </p>
              </div>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-[#5c986a]/20">
            <div className="flex items-center justify-between mb-2">
              <Zap className="h-8 w-8 text-[#5c986a]" />
              <span className="text-sm font-semibold px-3 py-1 rounded-full bg-[#5c986a]/10 text-[#5c986a]">
                System Size
              </span>
            </div>
            <h3 className="text-4xl font-bold text-[#1a5059] mb-1">{solarResults.systemSizeKwp}</h3>
            <p className="text-sm text-gray-600">kWp Capacity</p>
            <p className="text-xs text-gray-500 mt-2">Production Factor: {solarResults.productionFactor} kWh/kWp/yr</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-[#84f4e6]/20">
            <div className="flex items-center justify-between mb-2">
              <Sun className="h-8 w-8 text-[#84f4e6]" />
              <CheckCircle className="h-6 w-6 text-[#5c986a]" />
            </div>
            <h3 className="text-4xl font-bold text-[#1a5059] mb-1">{solarResults.annualProduction.toLocaleString()}</h3>
            <p className="text-sm text-gray-600">Annual Production (kWh)</p>
            <p className="text-xs text-gray-500 mt-2">Coverage: {solarResults.solarCoveragePercent}% of consumption</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-[#5c986a]/20">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8 text-[#5c986a]" />
              <span className="text-sm font-semibold px-3 py-1 rounded-full bg-[#5c986a]/10 text-[#5c986a]">
                ROI {solarResults.roi}%
              </span>
            </div>
            <h3 className="text-4xl font-bold text-[#1a5059] mb-1">{solarResults.paybackYears}</h3>
            <p className="text-sm text-gray-600">Payback Period (Years)</p>
            <p className="text-xs text-gray-500 mt-2">Net savings: {solarResults.netSavings.toLocaleString()} EGP/yr</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-[#84f4e6]/20">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-8 w-8 text-[#84f4e6]" />
              <Activity className="h-6 w-6 text-[#5c986a]" />
            </div>
            <h3 className="text-4xl font-bold text-[#1a5059] mb-1">{solarResults.installationCost.toLocaleString()}</h3>
            <p className="text-sm text-gray-600">Installation Cost (EGP)</p>
            {/* Optional: Maintenance cost not provided in results type */}
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Financial Projection */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-[#5c986a]/20">
            <h3 className="text-xl font-bold text-[#1a5059] mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-[#5c986a]" />
              25-Year Financial Projection
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={financialProjection.slice(0, 25)}>
                <defs>
                  <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5c986a" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#5c986a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#c5d9a9" />
                <XAxis dataKey="year" tick={{ fill: '#1a5059', fontSize: 12 }} />
                <YAxis tick={{ fill: '#1a5059', fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="cumulative" stroke="#5c986a" fillOpacity={1} fill="url(#colorCumulative)" name="Cumulative Savings (EGP)" />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500 text-center mt-2">
              Total 25-year net savings: {(solarResults.netSavings * 25).toLocaleString()} EGP
            </p>
          </div>

          {/* Monthly Production Estimate */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-[#84f4e6]/20">
            <h3 className="text-xl font-bold text-[#1a5059] mb-4 flex items-center">
              <Sun className="h-5 w-5 mr-2 text-[#84f4e6]" />
              Estimated Monthly Production
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyProduction}>
                <CartesianGrid strokeDasharray="3 3" stroke="#c5d9a9" />
                <XAxis dataKey="month" tick={{ fill: '#1a5059', fontSize: 12 }} />
                <YAxis tick={{ fill: '#1a5059', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="production" fill="#318b63ff" radius={[8, 8, 0, 0]} name="Production (kWh)" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500 text-center mt-2">
              Peak production months: May - August
            </p>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Production Over Time */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-[#5c986a]/20">
            <h3 className="text-xl font-bold text-[#1a5059] mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-[#5c986a]" />
              Production Degradation (25 Years)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#c5d9a9" />
                <XAxis dataKey="year" tick={{ fill: '#1a5059', fontSize: 12 }} />
                <YAxis tick={{ fill: '#1a5059', fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="production" stroke="#5c986a" strokeWidth={3} dot={{ fill: '#5c986a', r: 4 }} name="Annual Production (kWh)" />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500 text-center mt-2">
              Average degradation: 1% per year
            </p>
          </div>

          {/* Environmental Impact */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-[#5c986a]/20">
            <h3 className="text-xl font-bold text-[#1a5059] mb-4 flex items-center">
              <Leaf className="h-5 w-5 mr-2 text-[#5c986a]" />
              Cumulative CO₂ Reduction
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={productionData}>
                <defs>
                  <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5c986a" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#5c986a" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#c5d9a9" />
                <XAxis dataKey="year" tick={{ fill: '#1a5059', fontSize: 12 }} />
                <YAxis tick={{ fill: '#1a5059', fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="co2Saved" stroke="#5c986a" fillOpacity={1} fill="url(#colorCO2)" name="CO₂ Saved (tons)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Details */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-[#5c986a]/20">
          <h3 className="text-xl font-bold text-[#1a5059] mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-[#5c986a]" />
            Financial Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Current Annual Bill</p>
              <p className="text-2xl font-bold text-[#1a5059]">{solarResults.currentBill.toLocaleString()} EGP</p>
              <p className="text-xs text-gray-500 mt-1">Average tariff: {solarResults.weightedTariff} EGP/kWh</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-[#5c986a]/30">
              <p className="text-sm text-gray-600 mb-1">New Annual Bill</p>
              <p className="text-2xl font-bold text-[#5c986a]">{solarResults.newBill.toLocaleString()} EGP</p>
              <p className="text-xs text-gray-500 mt-1">After {solarResults.solarCoveragePercent}% solar coverage</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-[#84f4e6]/30">
              <p className="text-sm text-gray-600 mb-1">Annual Savings</p>
              <p className="text-2xl font-bold text-[#5c986a]">{solarResults.annualSavings.toLocaleString()} EGP</p>
              <p className="text-xs text-gray-500 mt-1">Before maintenance costs</p>
            </div>
          </div>
        </div>

        {/* Environmental Impact Details */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl p-6 border-2 border-[#5c986a]/20">
          <h3 className="text-xl font-bold text-[#1a5059] mb-4 flex items-center">
            <Leaf className="h-5 w-5 mr-2 text-[#5c986a]" />
            Environmental Impact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-white rounded-2xl">
              <div className="text-5xl font-bold text-[#5c986a] mb-2">
                {solarResults.co2SavingTons}
              </div>
              <p className="text-gray-700 font-semibold mb-1">Tons of CO₂ Saved Annually</p>
              <p className="text-sm text-gray-500">Equivalent to removing cars from the road for a year</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl">
              <div className="text-5xl font-bold text-[#5c986a] mb-2">
                {solarResults.treesEquivalent}
              </div>
              <p className="text-gray-700 font-semibold mb-1">Equivalent Trees Planted</p>
              <p className="text-sm text-gray-500">Based on carbon sequestration rates</p>
            </div>
          </div>
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
      </div>
    </div>
  );
};

export default SolarDashboard;