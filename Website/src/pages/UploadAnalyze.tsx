import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Sparkles, Sun, Leaf, Droplet, Recycle, CheckCircle, ArrowRight } from 'lucide-react';
import { calculateSolar, calculateWQI, calculateLandscape, productionFactors } from './calculations';
import WaterQualityDashboard from './WaterQualityDashboard';
import SolarDashboard from './SolarDashboard';
import LandscapeDashboard from './LandscapeDashboard';

// Types for results
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

const UploadAnalyze: React.FC = () => {
  const navigate = useNavigate();
  // Preselect objective from query param if present
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const objective = params.get('objective');
    if (objective && (['solara','aqualis','terra','cyclo'].includes(objective))) {
      setFormData(prev => ({ ...prev, objective: objective === 'solara' ? 'solar' : objective === 'aqualis' ? 'water' : objective === 'terra' ? 'landscape' : 'waste' }));
    }
  }, []);
  const [formData, setFormData] = useState({
    objective: '',
    billAmount: '',
    location: '',
    sectorType: '',
    consumption: '',
    space: '',
    coverage: 60,

    area_m2: '',
    plantType: '',
    waterSource: '',
    cost_per_m2: '',
    maintenance_years: 10,

    turbidity: '',
    pH: '',
    dissolvedOxygen: '',
    TDS: '',
    BOD: '',
    nitrate: '',
  });
  const [processingComplete, setProcessingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [solarResults, setSolarResults] = useState<SolarResults | null>(null);
  const [waterResults, setWaterResults] = useState<WaterResults | null>(null);
  const [landscapeResults, setLandscapeResults] = useState<LandscapeResults | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (notice) {
      setNotice(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const objective = formData.objective;

    if (!objective) newErrors.objective = 'Choose a path to begin your story.';

    if (objective === 'solar') {
      if (!formData.location) newErrors.location = 'Where in Egypt is your site located?';
      if (!formData.sectorType) newErrors.sectorType = 'What kind of place is it?';
      if (!formData.consumption || Number(formData.consumption) <= 0) newErrors.consumption = 'Tell us your monthly consumption (kWh).';
      if (!formData.space || Number(formData.space) <= 0) newErrors.space = 'How much roof can host your solar? (m²)';
    }

    if (objective === 'water') {
      if (!formData.location) newErrors.location = 'Where are we testing water?';
      if (!formData.sectorType) newErrors.sectorType = 'Which sector best fits your use?';
      const numericFields = ['turbidity','pH','dissolvedOxygen','TDS','nitrate','BOD'] as const;
      numericFields.forEach(f => {
        const v = String(((formData as unknown) as Record<string, string>)[f] ?? '').trim();
        if (!v) newErrors[f] = 'Add a value so the index makes sense.';
      });
    }

    if (objective === 'landscape') {
      if (!formData.location) newErrors.location = 'Where will your green space live?';
      if (!formData.area_m2 || Number(formData.area_m2) <= 0) newErrors.area_m2 = 'How large is the area (m²)?';
      if (!formData.plantType) newErrors.plantType = 'Choose your planting style.';
      if (!formData.waterSource) newErrors.waterSource = 'Choose a water source to plan sustainably.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setProcessingComplete(false);
      const keysToCheck = ['billAmount','location','sectorType','consumption','space','area_m2','plantType','waterSource','cost_per_m2','turbidity','pH','dissolvedOxygen','TDS','BOD','nitrate'] as const;
      const isNothingEntered = formData.objective === '' && keysToCheck.every(k => String(((formData as unknown) as Record<string, string>)[k] ?? '').trim() === '');
      if (isNothingEntered) {
        setNotice('No data yet — share a few details to unlock your personalized dashboard.');
      } else {
        setNotice('Almost there — complete the highlighted fields to reveal your insights.');
      }
      return;
    }
    
    setIsLoading(true);

    if (formData.objective === 'solar') {
      const results = calculateSolar(formData);
      setSolarResults(results);
      setTimeout(() => {
        setProcessingComplete(true);
        setIsLoading(false);
        setNotice(null);
      }, 1200);
    } else if (formData.objective === 'water') {
      const results = calculateWQI({
        pH: parseFloat(formData.pH),
        dissolvedOxygen: parseFloat(formData.dissolvedOxygen),
        TDS: parseFloat(formData.TDS),
        turbidity: parseFloat(formData.turbidity),
        nitrate: parseFloat(formData.nitrate),
        BOD: parseFloat(formData.BOD),
        sectorType: formData.sectorType
      });
      setWaterResults(results);
      setTimeout(() => {
        setProcessingComplete(true);
        setIsLoading(false);
        setNotice(null);
      }, 1200);
    } else if (formData.objective === 'landscape') {
      const results = calculateLandscape({
        area: parseFloat(formData.area_m2),
        location: formData.location,
        plantType: formData.plantType,
        waterSource: formData.waterSource,
        costPerM2: formData.cost_per_m2 ? parseFloat(formData.cost_per_m2) : undefined,
        maintenanceYears: formData.maintenance_years
      });
      setLandscapeResults(results);
      setTimeout(() => {
        setProcessingComplete(true);
        setIsLoading(false);
        setNotice(null);
      }, 1200);
    } else if (formData.objective === 'waste' || !formData.objective) {
      setErrors(prev => ({ ...prev, objective: 'This path is not ready yet. Pick Solar, Water, or Landscape.' }));
      setProcessingComplete(false);
      setIsLoading(false);
      setNotice('There is nothing to analyze. Please enter your details to begin.');
    }
  };

  const getObjectiveIcon = (obj: string) => {
    switch(obj) {
      case 'solar': return <Sun className="h-8 w-8" />;
      case 'landscape': return <Leaf className="h-8 w-8" />;
      case 'water': return <Droplet className="h-8 w-8" />;
      case 'waste': return <Recycle className="h-8 w-8" />;
      default: return <Sparkles className="h-8 w-8" />;
    }
  };

  const getObjectiveColor = (obj: string) => {
    switch(obj) {
      case 'solar': return 'from-[#dda853] to-[#5c986a]';
      case 'landscape': return 'from-[#5c986a] to-[#c5d9a9]';
      case 'water': return 'from-[#84f4e6] to-[#2b515a]';
      case 'waste': return 'from-[#5c986a] to-[#84f4e6]';
      default: return 'from-[#1a5059] to-[#5c986a]';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c5d9a9]/20 via-white to-[#84f4e6]/20 py-12 px-4 sm:px-6 lg:px-8">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(92, 152, 106, 0.3); }
          50% { box-shadow: 0 0 40px rgba(132, 244, 230, 0.5); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.6s ease-out;
        }
        .animate-scale-in {
          animation: scaleIn 0.5s ease-out;
        }
        .animate-pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }
        .stagger-1 {
          animation-delay: 0.1s;
        }
        .stagger-2 {
          animation-delay: 0.2s;
        }
        .glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
        }
      `}</style>

      <div className="absolute top-20 right-10 w-72 h-72 bg-[#dda853] rounded-full opacity-10 blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-[#84f4e6] rounded-full opacity-10 blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="glass rounded-3xl shadow-2xl overflow-hidden border border-[#84f4e6]/30 animate-fade-in-up">
          <div className={`bg-gradient-to-r ${getObjectiveColor(formData.objective)} p-8`}>
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-pulse-glow">
                {getObjectiveIcon(formData.objective)}
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white text-center mb-2 animate-fade-in-down">
              Analyze Your Smart City Potential
            </h1>
            <p className="text-center text-white/90 text-lg animate-fade-in-down stagger-1">
              Choose an objective and enter your details for personalized analysis
            </p>
          </div>

          <div className="p-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 animate-scale-in">
                <div className="w-16 h-16 rounded-full border-4 border-[#84f4e6]/40 border-t-[#5c986a] animate-spin mb-4" />
                <h3 className="text-xl font-bold text-[#1a5059] mb-1">Preparing your dashboard...</h3>
                <p className="text-sm text-[#2b515a]">Crunching numbers, drawing insights, crafting visuals</p>
              </div>
            ) : processingComplete ? (
              <div className="animate-scale-in">
                {formData.objective === 'solar' && solarResults ? (
                  <SolarDashboard
                    solarResults={solarResults}
                    location={formData.location}
                    sectorType={formData.sectorType}
                    onAnalyzeAgain={() => {
                      setProcessingComplete(false);
                      setSolarResults(null);
                    }}
                  />
                  
                ) : formData.objective === 'landscape' && landscapeResults ? (
                  <LandscapeDashboard
                    landscapeResults={landscapeResults}
                    location={formData.location}
                    onAnalyzeAgain={() => {
                      setProcessingComplete(false);
                      setLandscapeResults(null);
                    }}
                  />
                ) : formData.objective === 'water' && waterResults ? (
                  <WaterQualityDashboard 
                    waterResults={waterResults}
                    location={formData.location}
                    sectorType={formData.sectorType}
                    onAnalyzeAgain={() => {
                      setProcessingComplete(false);
                      setWaterResults(null);
                    }}
                  />
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#5c986a] to-[#84f4e6] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#1a5059] mb-4">
                      Analysis Complete!
                    </h2>
                    <p className="text-[#2b515a] text-lg mb-8 max-w-md mx-auto">
                      Your {formData.objective} potential has been analyzed successfully.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        className="group glass border-2 border-[#5c986a] text-[#1a5059] font-bold py-4 px-8 rounded-full inline-flex items-center justify-center transition-all duration-300 hover:bg-[#5c986a]/10 transform hover:scale-105"
                        onClick={() => {
                          setProcessingComplete(false);
                        }}
                      >
                        <ArrowRight className="mr-2 h-5 w-5 rotate-180" />
                        Analyze Again
                      </button>
                      <button
                        className="bg-gradient-to-r from-[#5c986a] to-[#84f4e6] hover:from-[#84f4e6] hover:to-[#5c986a] text-white font-bold py-4 px-8 rounded-full inline-flex items-center justify-center transition-all duration-300 shadow-lg transform hover:scale-105"
                        onClick={() => navigate('/city-builder')}
                      >
                        Go to Game
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="animate-fade-in-up stagger-2">
                <div className="mb-8">
                  <label className="block text-lg font-bold text-[#1a5059] mb-2 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-[#dda853]" />
                    Which path would you like to explore?
                  </label>
                  <p className="text-sm text-[#2b515a] mb-4">Start your story with sun, water, or green.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { value: 'solar', icon: Sun, label: 'SOLARA', color: 'from-[#dda853] to-[#5c986a]' },
                      { value: 'water', icon: Droplet, label: 'AQUALIS', color: 'from-[#84f4e6] to-[#2b515a]' },
                      { value: 'landscape', icon: Leaf, label: 'TERRA', color: 'from-[#5c986a] to-[#c5d9a9]' }
                    ].map((obj) => (
                      <div
                        key={obj.value}
                        onClick={() => setFormData(prev => ({ ...prev, objective: obj.value }))}
                        className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                          formData.objective === obj.value
                            ? `bg-gradient-to-br ${obj.color} text-white border-transparent shadow-lg`
                            : 'glass border-[#84f4e6]/30 hover:border-[#5c986a]'
                        }`}
                      >
                        <obj.icon className={`h-8 w-8 mx-auto mb-3 ${formData.objective === obj.value ? 'text-white' : 'text-[#5c986a]'}`} />
                        <p className={`text-center font-semibold ${formData.objective === obj.value ? 'text-white' : 'text-[#1a5059]'}`}>
                          {obj.label}
                        </p>
                      </div>
                    ))}
                  </div>
                  {errors.objective && <p className="mt-2 text-sm text-red-600">{errors.objective}</p>}
                </div>

                {/* SOLAR FORM */}
                {formData.objective === 'solar' && (
                  <div className="space-y-6 animate-fade-in-up">
                    <div className="glass p-6 rounded-2xl border border-[#84f4e6]/30">
                      <h3 className="text-xl font-bold text-[#1a5059] mb-1 flex items-center">
                        <Zap className="h-5 w-5 mr-2 text-[#dda853]" />
                        Tell us about your energy scene
                      </h3>
                      <p className="text-sm text-[#2b515a] mb-4">We’ll turn your monthly story into a solar plan.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-[#2b515a] mb-1">What’s your monthly electricity bill (EGP)?</label>
                          <input
                            type="number"
                            name="billAmount"
                            value={formData.billAmount}
                            onChange={handleInputChange}
                            placeholder="e.g., 2500"
                            className="w-full p-3 rounded-xl border border-[#84f4e6]/30 focus:ring-2 focus:ring-[#5c986a] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#2b515a] mb-1">How many kWh do you use each month?</label>
                          <input
                            type="number"
                            name="consumption"
                            value={formData.consumption}
                            onChange={handleInputChange}
                            placeholder="e.g., 1200"
                            className="w-full p-3 rounded-xl border border-[#84f4e6]/30 focus:ring-2 focus:ring-[#5c986a] focus:outline-none"
                            required
                          />
                          {errors.consumption && <p className="mt-1 text-xs text-red-600">{errors.consumption}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#2b515a] mb-1">Where is your site located?</label>
                          <select
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-xl border border-[#84f4e6]/30 focus:ring-2 focus:ring-[#5c986a] focus:outline-none"
                            required
                          >
                            <option value="">Select location</option>
                            {Object.keys(productionFactors).map((loc) => (
                              <option key={loc} value={loc}>{loc}</option>
                            ))}
                          </select>
                          {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#2b515a] mb-1">Which sector describes your site?</label>
                          <select
                            name="sectorType"
                            value={formData.sectorType}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-xl border border-[#84f4e6]/30 focus:ring-2 focus:ring-[#5c986a] focus:outline-none"
                            required
                          >
                            <option value="">Select sector</option>
                            <option value="residential">Residential</option>
                            <option value="commercial">Commercial</option>
                            <option value="industrial">Industrial</option>
                          </select>
                          {errors.sectorType && <p className="mt-1 text-xs text-red-600">{errors.sectorType}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#2b515a] mb-1">How much roof can host solar (m²)?</label>
                          <input
                            type="number"
                            name="space"
                            value={formData.space}
                            onChange={handleInputChange}
                            placeholder="e.g., 150"
                            className="w-full p-3 rounded-xl border border-[#84f4e6]/30 focus:ring-2 focus:ring-[#5c986a] focus:outline-none"
                            required
                          />
                          {errors.space && <p className="mt-1 text-xs text-red-600">{errors.space}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#2b515a] mb-1">How much solar coverage would you like (%)?</label>
                          <input
                            type="range"
                            name="coverage"
                            min="0"
                            max="100"
                            value={formData.coverage}
                            onChange={handleInputChange}
                            className="w-full accent-[#5c986a]"
                          />
                          <p className="text-[#2b515a] mt-1 text-sm">{formData.coverage}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Landscape Form */}
                {formData.objective === 'landscape' && (
                  <div className="space-y-6 animate-fade-in-up">
                    <div className="glass p-6 rounded-2xl border border-[#84f4e6]/30">
                      <h3 className="text-xl font-bold text-[#1a5059] mb-1 flex items-center">
                        <Leaf className="h-5 w-5 mr-2 text-[#5c986a]" />
                        Tell us about your green space
                      </h3>
                      <p className="text-sm text-[#2b515a] mb-4">We’ll estimate cooling, CO₂ capture, and costs.</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-[#2b515a] mb-1">How large is the area to be planted (m²)?</label>
                          <input
                            type="number"
                            name="area_m2"
                            value={formData.area_m2}
                            onChange={handleInputChange}
                            placeholder="e.g., 600"
                            className="w-full p-3 rounded-xl border border-[#84f4e6]/30 focus:ring-2 focus:ring-[#5c986a] focus:outline-none"
                          />
                          {errors.area_m2 && <p className="mt-1 text-xs text-red-600">{errors.area_m2}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#2b515a] mb-1">Where will your green space live?</label>
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="e.g., Cairo • Nasr City"
                            className="w-full p-3 rounded-xl border border-[#84f4e6]/30 focus:ring-2 focus:ring-[#5c986a] focus:outline-none"
                          />
                          {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#2b515a] mb-1">What planting style do you envision?</label>
                          {errors.plantType && <p className="mt-1 text-xs text-red-600">{errors.plantType}</p>}
                          <select
                            name="plantType"
                            value={formData.plantType}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-xl border border-[#84f4e6]/30 focus:ring-2 focus:ring-[#5c986a] focus:outline-none"
                          >
                            <option value="">Select plant type</option>
                            <option value="ShadeTree">Shade Tree</option>
                            <option value="GrassTurf">Grass Turf</option>
                            <option value="DecorativePlants">Decorative Plants</option>
                            <option value="DesertPlants">Desert Plants</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#2b515a] mb-1">What’s the water source?</label>
                          {errors.waterSource && <p className="mt-1 text-xs text-red-600">{errors.waterSource}</p>}
                          <select
                            name="waterSource"
                            value={formData.waterSource}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-xl border border-[#84f4e6]/30 focus:ring-2 focus:ring-[#5c986a] focus:outline-none"
                          >
                            <option value="">Select water source</option>
                            <option value="DrinkingWater">Drinking Water</option>
                            <option value="TreatedWater">Treated Water</option>
                            <option value="Rainwater">Rainwater</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#2b515a] mb-1">Estimated cost per m²? (optional)</label>
                          <input
                            type="number"
                            name="cost_per_m2"
                            value={formData.cost_per_m2}
                            onChange={handleInputChange}
                            placeholder="Enter cost per m² or leave blank"
                            className="w-full p-3 rounded-xl border border-[#84f4e6]/30 focus:ring-2 focus:ring-[#5c986a] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#2b515a] mb-1">How many years of maintenance? (optional)</label>
                          <input
                            type="number"
                            name="maintenance_years"
                            value={formData.maintenance_years}
                            onChange={handleInputChange}
                            placeholder="Enter number of years"
                            className="w-full p-3 rounded-xl border border-[#84f4e6]/30 focus:ring-2 focus:ring-[#5c986a] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}






                                {/* Water Form */}
                {formData.objective === 'water' && (
                  <div className="space-y-6 animate-fade-in-up">
                    <div className="glass p-6 rounded-2xl border border-[#84f4e6]/30">
                      <h3 className="text-xl font-bold text-[#1a5059] mb-1 flex items-center">
                        <Droplet className="h-5 w-5 mr-2 text-[#84f4e6]" />
                        Tell us about your water sample
                      </h3>
                      <p className="text-sm text-[#2b515a] mb-4">We’ll assess quality and recommend actions.</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-[#2b515a] mb-1">Where are we assessing water quality?</label>
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="e.g., Alexandria • Al Attarin"
                            className="w-full p-3 rounded-xl border border-[#84f4e6]/30 focus:ring-2 focus:ring-[#5c986a] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#2b515a] mb-1">Which sector best fits your use?</label>
                          <select
                            name="sectorType"
                            value={formData.sectorType}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-xl border border-[#84f4e6]/30 focus:ring-2 focus:ring-[#5c986a] focus:outline-none"
                          >
                            <option value="">Select sector</option>
                            <option value="domestic">Domestic</option>
                            <option value="agriculture">Agriculture</option>
                            <option value="industrial">Industrial</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#2b515a] mb-1">What is the turbidity (NTU)?</label>
                          <input
                            type="number"
                            step="0.01"
                            name="turbidity"
                            value={formData.turbidity}
                            onChange={handleInputChange}
                            placeholder="e.g., 2.5"
                            className="w-full p-3 rounded-xl border border-[#84f4e6]/30 focus:ring-2 focus:ring-[#5c986a] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#2b515a] mb-1">What’s the pH value?</label>
                          <input
                            type="number"
                            step="0.1"
                            name="pH"
                            value={formData.pH}
                            onChange={handleInputChange}
                            placeholder="e.g., 7.2"
                            className="w-full p-3 rounded-xl border border-[#84f4e6]/30 focus:ring-2 focus:ring-[#5c986a] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#2b515a] mb-1">How much dissolved oxygen (mg/L)?</label>
                          <input
                            type="number"
                            step="0.01"
                            name="dissolvedOxygen"
                            value={formData.dissolvedOxygen}
                            onChange={handleInputChange}
                            placeholder="e.g., 6.5"
                            className="w-full p-3 rounded-xl border border-[#84f4e6]/30 focus:ring-2 focus:ring-[#5c986a] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#2b515a] mb-1">What’s the total dissolved solids (mg/L)?</label>
                          <input
                            type="number"
                            step="1"
                            name="TDS"
                            value={formData.TDS}
                            onChange={handleInputChange}
                            placeholder="e.g., 350"
                            className="w-full p-3 rounded-xl border border-[#84f4e6]/30 focus:ring-2 focus:ring-[#5c986a] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#2b515a] mb-1">What’s the BOD (mg/L)?</label>
                          <input
                            type="number"
                            step="0.01"
                            name="BOD"
                            value={formData.BOD}
                            onChange={handleInputChange}
                            placeholder="e.g., 3.1"
                            className="w-full p-3 rounded-xl border border-[#84f4e6]/30 focus:ring-2 focus:ring-[#5c986a] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#2b515a] mb-1">What’s the nitrate (mg/L)?</label>
                          <input
                            type="number"
                            step="0.01"
                            name="nitrate"
                            value={formData.nitrate}
                            onChange={handleInputChange}
                            placeholder="e.g., 12"
                            className="w-full p-3 rounded-xl border border-[#84f4e6]/30 focus:ring-2 focus:ring-[#5c986a] focus:outline-none"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-[#2b515a] mb-2">
                            Upload CSV/Excel (optional)
                          </label>
                          <input
                            type="file"
                            name="optionalFile"
                            accept=".csv, .xlsx, .xls"
                            onChange={handleFileChange}
                            className="w-full p-3 rounded-xl border border-[#84f4e6]/30 focus:ring-2 focus:ring-[#5c986a] focus:outline-none bg-white"
                          />
                          <p className="text-xs text-[#5c986a] mt-1">Upload water quality data file for batch analysis</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
                  <button
                    type="submit"
                    className="group bg-gradient-to-r from-[#5c986a] to-[#84f4e6] hover:from-[#84f4e6] hover:to-[#5c986a] text-white font-bold py-4 px-8 rounded-full inline-flex items-center justify-center transition-all duration-300 shadow-lg transform hover:scale-105"
                  >
                    <Sparkles className="mr-2 h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
                    Analyze
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/city-builder')}
                    className="bg-white text-[#1a5059] border-2 border-[#84f4e6] hover:bg-[#c5d9a9]/20 font-bold py-4 px-8 rounded-full inline-flex items-center justify-center transition-all duration-300"
                  >
                    Go to Game
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
                {notice && (
                  <div className="mt-4 text-center" aria-live="polite">
                    <div className="inline-block rounded-xl border-2 border-[#84f4e6]/40 bg-white/80 text-[#1a5059] px-4 py-3 text-sm">
                      {notice}
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadAnalyze;