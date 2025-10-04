import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, AlertTriangle, CheckCircle, TrendingUp, Activity } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface WaterParameter {
  value: number;
  standard: string;
  index?: number;
}

interface WaterResults {
  parameters: {
    pH: WaterParameter;
    dissolvedOxygen: WaterParameter;
    TDS: WaterParameter;
    turbidity: WaterParameter;
    nitrate: WaterParameter;
    [key: string]: WaterParameter;
  };
  wqi: number;
  status: string;
  recommendations: string[];
}

interface WaterQualityDashboardProps {
  waterResults: WaterResults;
  location: string;
  sectorType: string;
  onAnalyzeAgain: () => void;
}

const WaterQualityDashboard: React.FC<WaterQualityDashboardProps> = ({ waterResults, location, sectorType, onAnalyzeAgain }) => {
  // Prepare data for radar chart
  const radarData = [
    { parameter: 'pH', value: waterResults.parameters.pH.index, fullMark: 100 },
    { parameter: 'DO', value: waterResults.parameters.dissolvedOxygen.index, fullMark: 100 },
    { parameter: 'TDS', value: waterResults.parameters.TDS.index, fullMark: 100 },
    { parameter: 'Turbidity', value: waterResults.parameters.turbidity.index, fullMark: 100 },
    { parameter: 'Nitrate', value: waterResults.parameters.nitrate.index, fullMark: 100 }
  ];

  // Prepare data for parameter comparison bar chart
  const barData = [
    { 
      name: 'pH', 
      measured: waterResults.parameters.pH.value, 
      standard: 8.5,
      status: waterResults.parameters.pH.value <= 8.5 ? 'Good' : 'Poor'
    },
    { 
      name: 'DO', 
      measured: waterResults.parameters.dissolvedOxygen.value, 
      standard: 5,
      status: waterResults.parameters.dissolvedOxygen.value >= 5 ? 'Good' : 'Poor'
    },
    { 
      name: 'TDS', 
      measured: waterResults.parameters.TDS.value, 
      standard: 500,
      status: waterResults.parameters.TDS.value <= 500 ? 'Good' : 'Poor'
    },
    { 
      name: 'Turbidity', 
      measured: waterResults.parameters.turbidity.value, 
      standard: 5,
      status: waterResults.parameters.turbidity.value <= 5 ? 'Good' : 'Poor'
    },
    { 
      name: 'Nitrate', 
      measured: waterResults.parameters.nitrate.value, 
      standard: 50,
      status: waterResults.parameters.nitrate.value <= 50 ? 'Good' : 'Poor'
    }
  ];

  // Historical trend data (simulated)
  const trendData = [
    { month: 'Jan', wqi: 45, status: 'Good' },
    { month: 'Feb', wqi: 52, status: 'Poor' },
    { month: 'Mar', wqi: 48, status: 'Good' },
    { month: 'Apr', wqi: 65, status: 'Poor' },
    { month: 'May', wqi: 72, status: 'Poor' },
    { month: 'Jun', wqi: waterResults.wqi, status: waterResults.status }
  ];

  // WQI classification data for reference chart
  const wqiClassificationData = [
    { range: 'Excellent', min: 0, max: 25, color: '#10b981' },
    { range: 'Good', min: 26, max: 50, color: '#3b82f6' },
    { range: 'Poor', min: 51, max: 75, color: '#f59e0b' },
    { range: 'Very Poor', min: 76, max: 100, color: '#ef4444' }
  ];

  const getStatusIcon = (status: string) => {
    if (status === 'Excellent' || status === 'Good') {
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    }
    return <AlertTriangle className="h-6 w-6 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-[#5c986a]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#5c986a] to-[#84f4e6] flex items-center justify-center">
                <Droplet className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#1a5059]">Water Quality Dashboard</h1>
                <p className="text-gray-600">{location} • {sectorType.charAt(0).toUpperCase() + sectorType.slice(1)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Analysis Date</p>
              <p className="text-lg font-semibold text-[#1a5059]">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* WQI Score */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-[#5c986a]/20">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-8 w-8 text-[#5c986a]" />
              <span className="text-sm font-semibold px-3 py-1 rounded-full bg-[#5c986a]/10 text-[#5c986a]">
                {waterResults.status}
              </span>
            </div>
            <h3 className="text-4xl font-bold text-[#1a5059] mb-1">{waterResults.wqi}</h3>
            <p className="text-sm text-gray-600">Water Quality Index</p>
            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500 bg-[#5c986a]" 
                   style={{ width: `${waterResults.wqi}%` }}></div>
            </div>
          </div>

          {/* pH Level */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-[#84f4e6]/20">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-[#84f4e6]/20 rounded-full flex items-center justify-center">
                <span className="font-bold text-[#84f4e6]">pH</span>
              </div>
              {getStatusIcon(waterResults.parameters.pH.value <= 8.5 && waterResults.parameters.pH.value >= 6.5 ? 'Good' : 'Poor')}
            </div>
            <h3 className="text-4xl font-bold text-[#1a5059] mb-1">{waterResults.parameters.pH.value}</h3>
            <p className="text-sm text-gray-600">pH Level</p>
            <p className="text-xs text-gray-500 mt-2">Standard: {waterResults.parameters.pH.standard}</p>
          </div>

          {/* Dissolved Oxygen */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-[#5c986a]/20">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8 text-[#5c986a]" />
              {getStatusIcon(waterResults.parameters.dissolvedOxygen.value >= 5 ? 'Good' : 'Poor')}
            </div>
            <h3 className="text-4xl font-bold text-[#1a5059] mb-1">{waterResults.parameters.dissolvedOxygen.value}</h3>
            <p className="text-sm text-gray-600">DO (mg/L)</p>
            <p className="text-xs text-gray-500 mt-2">Standard: {waterResults.parameters.dissolvedOxygen.standard}</p>
          </div>

          {/* TDS */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-[#84f4e6]/20">
            <div className="flex items-center justify-between mb-2">
              <Droplet className="h-8 w-8 text-[#84f4e6]" />
              {getStatusIcon(waterResults.parameters.TDS.value <= 500 ? 'Good' : 'Poor')}
            </div>
            <h3 className="text-4xl font-bold text-[#1a5059] mb-1">{waterResults.parameters.TDS.value}</h3>
            <p className="text-sm text-gray-600">TDS (mg/L)</p>
            <p className="text-xs text-gray-500 mt-2">Standard: {waterResults.parameters.TDS.standard}</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart - Parameter Distribution */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-[#5c986a]/20">
            <h3 className="text-xl font-bold text-[#1a5059] mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-[#5c986a]" />
              Parameter Quality Index
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#c5d9a9" />
                <PolarAngleAxis dataKey="parameter" tick={{ fill: '#1a5059', fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#1a5059', fontSize: 10 }} />
                <Radar name="Quality Index" dataKey="value" stroke="#5c986a" fill="#5c986a" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500 text-center mt-2">
              Higher values indicate parameters closer to standards
            </p>
          </div>

          {/* Bar Chart - Parameter Comparison */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-[#84f4e6]/20">
            <h3 className="text-xl font-bold text-[#1a5059] mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-[#84f4e6]" />
              Measured vs Standard Values
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#c5d9a9" />
                <XAxis dataKey="name" tick={{ fill: '#1a5059', fontSize: 12 }} />
                <YAxis tick={{ fill: '#1a5059', fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="measured" fill="#31498bff" name="Measured" radius={[8, 8, 0, 0]} />
                <Bar dataKey="standard" fill="#5c986a" name="Standard" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart - Historical Trend */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-[#5c986a]/20">
            <h3 className="text-xl font-bold text-[#1a5059] mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-[#5c986a]" />
              WQI Trend (6 Months)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#c5d9a9" />
                <XAxis dataKey="month" tick={{ fill: '#1a5059', fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#1a5059', fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="wqi" stroke="#5c986a" strokeWidth={3} dot={{ fill: '#5c986a', r: 5 }} name="WQI Score" />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs text-gray-600">Good (≤50)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                <span className="text-xs text-gray-600">Poor (51-75)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-xs text-gray-600">Very Poor (76-100)</span>
              </div>
            </div>
          </div>

          {/* WQI Classification Reference */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-[#84f4e6]/20">
            <h3 className="text-xl font-bold text-[#1a5059] mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-[#5c986a]" />
              WQI Classification
            </h3>
            <div className="space-y-4">
              {wqiClassificationData.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">{item.range}</span>
                    <span className="text-xs text-gray-500">{item.min} - {item.max}</span>
                  </div>
                  <div className="h-8 rounded-full overflow-hidden" style={{ backgroundColor: `${item.color}20` }}>
                    <div className="h-full flex items-center px-4">
                      <div className="w-full h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    </div>
                  </div>
                  {waterResults.wqi >= item.min && waterResults.wqi <= item.max && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="bg-white rounded-full p-1 shadow-lg border-2" style={{ borderColor: item.color }}>
                        <Activity className="h-4 w-4" style={{ color: item.color }} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-[#5c986a]/20">
          <h3 className="text-xl font-bold text-[#1a5059] mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
            Treatment Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {waterResults.recommendations.map((rec: string, idx: number) => (
              <div key={idx} className="bg-gradient-to-br from-orange-50 to-yellow-50 p-4 rounded-xl border border-orange-200">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                    <span className="text-white font-bold text-sm">{idx + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{rec}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Parameters Detail Table */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-[#5c986a]/20">
          <h3 className="text-xl font-bold text-[#1a5059] mb-4 flex items-center">
            <Droplet className="h-5 w-5 mr-2 text-[#84f4e6]" />
            Detailed Parameter Analysis
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Parameter</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Measured Value</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Standard</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Quality Index</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(waterResults.parameters).map(([key, param]: [string, WaterParameter], idx) => {
                  const isGood = key === 'dissolvedOxygen' ? param.value >= 5 : 
                                 key === 'pH' ? param.value >= 6.5 && param.value <= 8.5 :
                                 param.value <= parseFloat(param.standard.split('≤')[1] || param.standard.split('-')[1] || '100');
                  return (
                    <tr key={key} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-gray-50' : ''}`}>
                      <td className="py-4 px-4 font-medium text-gray-800 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                      <td className="text-center py-4 px-4 text-gray-700">{param.value}</td>
                      <td className="text-center py-4 px-4 text-gray-600 text-sm">{param.standard}</td>
                      <td className="text-center py-4 px-4">
                        {param.index && (
                          <span className="font-semibold text-[#5c986a]">{param.index}</span>
                        )}
                      </td>
                      <td className="text-center py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isGood ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {isGood ? 'Within Standard' : 'Exceeds Standard'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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

export default WaterQualityDashboard;