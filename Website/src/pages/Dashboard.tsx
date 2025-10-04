import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Zap, Percent, TrendingUp, Leaf, Download, Sparkles } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState({
    currentEnergyCost: 25000,
    solarInstallationCost: 150000,
    roiYears: 4.2,
    co2Saved: 120,
    energyProduced: 8500,
    selfSufficiency: 65,
    netSavings: 35000,
    surplusEnergy: 1200,
    maintenanceCost: 5000
  });

  const [sliders, setSliders] = useState({
    investmentLevel: 70,
    panelQuality: 80,
    coverage: 65,
    roofSpace: 1000
  });

  const monthlySavingsData = [
    { name: 'Jan', savings: 2800 },
    { name: 'Feb', savings: 3200 },
    { name: 'Mar', savings: 3500 },
    { name: 'Apr', savings: 4000 },
    { name: 'May', savings: 4200 },
    { name: 'Jun', savings: 4500 },
    { name: 'Jul', savings: 4800 },
    { name: 'Aug', savings: 4700 },
    { name: 'Sep', savings: 4300 },
    { name: 'Oct', savings: 3800 },
    { name: 'Nov', savings: 3300 },
    { name: 'Dec', savings: 2900 }
  ];

  const roiTimelineData = [
    { year: '2025', investment: -150000, savings: 0, balance: -150000 },
    { year: '2026', investment: 0, savings: 35000, balance: -115000 },
    { year: '2027', investment: 0, savings: 36000, balance: -79000 },
    { year: '2028', investment: 0, savings: 37000, balance: -42000 },
    { year: '2029', investment: 0, savings: 38000, balance: -4000 },
    { year: '2030', investment: 0, savings: 39000, balance: 35000 },
    { year: '2031', investment: 0, savings: 40000, balance: 75000 },
    { year: '2032', investment: 0, savings: 41000, balance: 116000 },
    { year: '2033', investment: 0, savings: 42000, balance: 158000 },
    { year: '2034', investment: 0, savings: 43000, balance: 201000 }
  ];

  const energySourceData = [
    { name: 'Solar', value: dashboardData.selfSufficiency },
    { name: 'Grid', value: 100 - dashboardData.selfSufficiency }
  ];
  const COLORS = ['#5c986a', '#dda853'];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSliders(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  useEffect(() => {
    const investmentFactor = sliders.investmentLevel / 70;
    const qualityFactor = sliders.panelQuality / 80;
    const coverageFactor = sliders.coverage / 65;
    const spaceFactor = sliders.roofSpace / 1000;
    
    const combinedFactor = (investmentFactor + qualityFactor + coverageFactor + spaceFactor) / 4;
    
    setDashboardData({
      currentEnergyCost: 25000,
      solarInstallationCost: Math.round(150000 * investmentFactor),
      roiYears: Math.round(4.2 / combinedFactor * 10) / 10,
      co2Saved: Math.round(120 * coverageFactor),
      energyProduced: Math.round(8500 * qualityFactor * spaceFactor),
      selfSufficiency: Math.round(65 * coverageFactor),
      netSavings: Math.round(35000 * combinedFactor),
      surplusEnergy: Math.round(1200 * qualityFactor * spaceFactor * (coverageFactor > 1 ? coverageFactor : 1)),
      maintenanceCost: Math.round(5000 * qualityFactor)
    });
  }, [sliders]);

  const formatCurrency = (value: number) => {
    return `EGP ${value.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c5d9a9]/20 via-white to-[#84f4e6]/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-3xl shadow-2xl overflow-hidden mb-8 border border-[#84f4e6]/30 animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1a5059] to-[#2b515a] p-8 border-b border-[#84f4e6]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#dda853] to-[#5c986a] rounded-2xl flex items-center justify-center mr-4 animate-pulse-glow">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">AI Dashboard</h1>
                  <p className="mt-2 text-[#84f4e6]">
                    Interactive analysis of your solar energy potential
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Adjustable Sliders */}
          <div className="p-8 bg-gradient-to-br from-[#c5d9a9]/10 to-white border-b border-[#84f4e6]/20 animate-fade-in-up stagger-1">
            <h2 className="text-2xl font-bold text-[#1a5059] mb-6 flex items-center">
              <Zap className="mr-2 h-6 w-6 text-[#dda853]" />
              Adjust Parameters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#2b515a]">
                  Investment Level
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    name="investmentLevel"
                    min="30"
                    max="100"
                    value={sliders.investmentLevel}
                    onChange={handleSliderChange}
                    className="w-full h-3 bg-[#c5d9a9]/30 rounded-full appearance-none cursor-pointer slider-thumb"
                    style={{
                      background: `linear-gradient(to right, #5c986a 0%, #5c986a ${sliders.investmentLevel}%, #c5d9a9 ${sliders.investmentLevel}%, #c5d9a9 100%)`
                    }}
                  />
                  <span className="min-w-[60px] text-right text-lg font-bold text-[#1a5059] bg-[#c5d9a9]/30 px-3 py-1 rounded-lg">
                    {sliders.investmentLevel}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#2b515a]">
                  Solar Panel Quality
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    name="panelQuality"
                    min="50"
                    max="100"
                    value={sliders.panelQuality}
                    onChange={handleSliderChange}
                    className="w-full h-3 bg-[#c5d9a9]/30 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #dda853 0%, #dda853 ${sliders.panelQuality}%, #c5d9a9 ${sliders.panelQuality}%, #c5d9a9 100%)`
                    }}
                  />
                  <span className="min-w-[60px] text-right text-lg font-bold text-[#1a5059] bg-[#c5d9a9]/30 px-3 py-1 rounded-lg">
                    {sliders.panelQuality}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#2b515a]">
                  Solar Coverage
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    name="coverage"
                    min="20"
                    max="100"
                    value={sliders.coverage}
                    onChange={handleSliderChange}
                    className="w-full h-3 bg-[#c5d9a9]/30 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #84f4e6 0%, #84f4e6 ${sliders.coverage}%, #c5d9a9 ${sliders.coverage}%, #c5d9a9 100%)`
                    }}
                  />
                  <span className="min-w-[60px] text-right text-lg font-bold text-[#1a5059] bg-[#c5d9a9]/30 px-3 py-1 rounded-lg">
                    {sliders.coverage}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#2b515a]">
                  Roof Space (m²)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    name="roofSpace"
                    min="500"
                    max="2000"
                    step="100"
                    value={sliders.roofSpace}
                    onChange={handleSliderChange}
                    className="w-full h-3 bg-[#c5d9a9]/30 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #2b515a 0%, #2b515a ${((sliders.roofSpace - 500) / 1500) * 100}%, #c5d9a9 ${((sliders.roofSpace - 500) / 1500) * 100}%, #c5d9a9 100%)`
                    }}
                  />
                  <span className="min-w-[60px] text-right text-lg font-bold text-[#1a5059] bg-[#c5d9a9]/30 px-3 py-1 rounded-lg">
                    {sliders.roofSpace}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Key Metrics */}
          <div className="p-8 animate-fade-in-up stagger-2">
            <h2 className="text-2xl font-bold text-[#1a5059] mb-6 flex items-center">
              <TrendingUp className="mr-2 h-6 w-6 text-[#5c986a]" />
              Key Metrics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-2xl border-l-4 border-[#dda853] card-hover group">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#dda853] to-[#5c986a] rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#2b515a]">Current Energy Costs</h3>
                </div>
                <p className="text-3xl font-bold text-[#1a5059]">{formatCurrency(dashboardData.currentEnergyCost)}</p>
                <p className="text-sm text-[#5c986a] mt-1">/month</p>
              </div>
              
              <div className="glass p-6 rounded-2xl border-l-4 border-[#5c986a] card-hover group">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#5c986a] to-[#84f4e6] rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#2b515a]">Solar Installation Cost</h3>
                </div>
                <p className="text-3xl font-bold text-[#1a5059]">{formatCurrency(dashboardData.solarInstallationCost)}</p>
                <p className="text-sm text-[#5c986a] mt-1">one-time investment</p>
              </div>
              
              <div className="glass p-6 rounded-2xl border-l-4 border-[#84f4e6] card-hover group">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#84f4e6] to-[#2b515a] rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#2b515a]">ROI Timeline</h3>
                </div>
                <p className="text-3xl font-bold text-[#1a5059]">{dashboardData.roiYears}</p>
                <p className="text-sm text-[#5c986a] mt-1">years</p>
              </div>
              
              <div className="glass p-6 rounded-2xl border-l-4 border-[#5c986a] card-hover group">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#5c986a] to-[#c5d9a9] rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#2b515a]">CO₂ Emissions Saved</h3>
                </div>
                <p className="text-3xl font-bold text-[#1a5059]">{dashboardData.co2Saved}</p>
                <p className="text-sm text-[#5c986a] mt-1">tons/year</p>
              </div>
              
              <div className="glass p-6 rounded-2xl border-l-4 border-[#dda853] card-hover group">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#dda853] to-[#84f4e6] rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#2b515a]">Energy Produced</h3>
                </div>
                <p className="text-3xl font-bold text-[#1a5059]">{dashboardData.energyProduced}</p>
                <p className="text-sm text-[#5c986a] mt-1">kWh/month</p>
              </div>
              
              <div className="glass p-6 rounded-2xl border-l-4 border-[#84f4e6] card-hover group">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#84f4e6] to-[#5c986a] rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <Percent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#2b515a]">Self-Sufficiency</h3>
                </div>
                <p className="text-3xl font-bold text-[#1a5059]">{dashboardData.selfSufficiency}%</p>
                <p className="text-sm text-[#5c986a] mt-1">energy independence</p>
              </div>
              
              <div className="glass p-6 rounded-2xl border-l-4 border-[#5c986a] card-hover group">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#5c986a] to-[#dda853] rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#2b515a]">Net Savings</h3>
                </div>
                <p className="text-3xl font-bold text-[#1a5059]">{formatCurrency(dashboardData.netSavings)}</p>
                <p className="text-sm text-[#5c986a] mt-1">/year</p>
              </div>
            </div>
          </div>
          
          {/* Charts */}
          <div className="p-8 border-t border-[#84f4e6]/20 animate-fade-in-up stagger-3">
            <h2 className="text-2xl font-bold text-[#1a5059] mb-8 flex items-center">
              <BarChart className="mr-2 h-6 w-6 text-[#84f4e6]" />
              Detailed Analysis
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Monthly Savings Chart */}
              <div className="glass p-6 rounded-2xl border border-[#84f4e6]/30 card-hover">
                <h3 className="text-lg font-bold text-[#1a5059] mb-4">Monthly Savings</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySavingsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#c5d9a9" />
                      <XAxis dataKey="name" stroke="#2b515a" />
                      <YAxis stroke="#2b515a" />
                      <Tooltip 
                        formatter={(value) => [`EGP ${value}`, 'Savings']}
                        contentStyle={{ backgroundColor: '#ffffff', border: '2px solid #84f4e6', borderRadius: '12px' }}
                      />
                      <Legend />
                      <Bar dataKey="savings" fill="url(#colorSavings)" name="Monthly Savings (EGP)" radius={[8, 8, 0, 0]} />
                      <defs>
                        <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#5c986a" stopOpacity={1}/>
                          <stop offset="100%" stopColor="#c5d9a9" stopOpacity={1}/>
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* ROI Timeline Chart */}
              <div className="glass p-6 rounded-2xl border border-[#84f4e6]/30 card-hover">
                <h3 className="text-lg font-bold text-[#1a5059] mb-4">ROI Timeline (10 Years)</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={roiTimelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#c5d9a9" />
                      <XAxis dataKey="year" stroke="#2b515a" />
                      <YAxis stroke="#2b515a" />
                      <Tooltip 
                        formatter={(value) => [`EGP ${value.toLocaleString()}`, 'Balance']}
                        contentStyle={{ backgroundColor: '#ffffff', border: '2px solid #84f4e6', borderRadius: '12px' }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="balance" 
                        stroke="#5c986a" 
                        name="Cumulative Balance" 
                        strokeWidth={3} 
                        dot={{ fill: '#dda853', r: 5 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Energy Source Distribution */}
              <div className="glass p-6 rounded-2xl border border-[#84f4e6]/30 card-hover">
                <h3 className="text-lg font-bold text-[#1a5059] mb-4">Energy Source Distribution</h3>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={energySourceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {energySourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Percentage']}
                        contentStyle={{ backgroundColor: '#ffffff', border: '2px solid #84f4e6', borderRadius: '12px' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* CO2 Reduction Impact */}
              <div className="glass p-6 rounded-2xl border border-[#84f4e6]/30 card-hover">
                <h3 className="text-lg font-bold text-[#1a5059] mb-4">Environmental Impact</h3>
                <div className="flex flex-col items-center justify-center h-80">
                  <div className="relative w-56 h-56 mb-6">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke="#c5d9a9" 
                        strokeWidth="8" 
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 45 * dashboardData.co2Saved / 200} ${2 * Math.PI * 45 * (1 - dashboardData.co2Saved / 200)}`}
                        strokeLinecap="round"
                        className="animate-pulse-glow"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#5c986a" />
                          <stop offset="100%" stopColor="#84f4e6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-4xl font-bold text-[#1a5059]">{dashboardData.co2Saved}</div>
                      <div className="text-sm text-[#2b515a] text-center">tons CO₂<br/>saved/year</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[#2b515a] mb-2">Equivalent to planting</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-[#5c986a] to-[#84f4e6] bg-clip-text text-transparent">
                      {Math.round(dashboardData.co2Saved * 45)} trees
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Export and Actions */}
          <div className="p-8 border-t border-[#84f4e6]/20 flex flex-wrap gap-4 justify-end bg-gradient-to-br from-[#c5d9a9]/10 to-white">
            <button className="group glass hover:bg-white text-[#1a5059] font-semibold py-3 px-6 border-2 border-[#84f4e6] rounded-xl shadow-lg flex items-center transition-all duration-300 transform hover:scale-105 btn-ripple">
              <Download className="h-5 w-5 mr-2 group-hover:animate-bounce" />
              Export as PDF
            </button>
            <button className="group bg-gradient-to-r from-[#5c986a] to-[#84f4e6] hover:from-[#84f4e6] hover:to-[#5c986a] text-white font-semibold py-3 px-6 rounded-xl shadow-lg flex items-center transition-all duration-300 transform hover:scale-105 btn-ripple">
              <Sparkles className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Find Solar Companies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;