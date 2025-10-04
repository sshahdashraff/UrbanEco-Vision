import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BarChart2, ArrowRight, Sparkles, ArrowDown, Sun, Droplet, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const problemRef = useRef<HTMLDivElement | null>(null);
  const guardiansRef = useRef<HTMLDivElement | null>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [guardianIntroOpen, setGuardianIntroOpen] = useState(false);
  const [selectedGuardian, setSelectedGuardian] = useState<null | 'solara' | 'aqualis' | 'terra'>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setParallaxOffset(y);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const guardians = useMemo(
    () => ([
      { id: 'solara' as const, label: 'SOLARA', subtitle: 'Energy Future', Icon: Sun, bgFrom: '#dda853', bgTo: '#5c986a' },
      { id: 'aqualis' as const, label: 'AQUALIS', subtitle: 'Water Wisdom', Icon: Droplet, bgFrom: '#2b515a', bgTo: '#84f4e6' },
      { id: 'terra' as const, label: 'TERRA', subtitle: 'Landscape Guardian', Icon: Leaf, bgFrom: '#5c986a', bgTo: '#84f4e6' },
    ]),
    []
  );

  const guardianDetails: Record<'solara' | 'aqualis' | 'terra', { intro: string; points: string[]; }> = useMemo(() => ({
    solara: {
      intro:
        "I guide you to harness the sun. From rooftops to facades, I reveal hidden solar potential and pathways to resilient, low-carbon power.",
      points: [
        "Detect viable rooftops and sizing for PV",
        "Simulate production across seasons",
        "Optimize ROI with smart storage",
      ],
    },
    aqualis: {
      intro:
        "I protect every drop. I uncover leaks, balance demand, and design smarter reuse so water flows wisely through your city.",
      points: [
        "Spot leakage and pressure hotspots",
        "Plan greywater recycling loops",
        "Right-size irrigation and reuse",
      ],
    },
    terra: {
      intro:
        "I cool the streets and weave nature back into concrete. I map shade, plant corridors, and living roofs for healthier urban life.",
      points: [
        "Prioritize green corridors and shade trees",
        "Evaluate green roofs and walls",
        "Design microclimate-friendly spaces",
      ],
    },
  }), []);

  const handleObjectiveClick = (objective: 'solara' | 'aqualis' | 'terra') => {
    setSelectedGuardian(objective);
    setGuardianIntroOpen(true);
  };

  const handleStartJourney = () => {
    if (!selectedGuardian) return;
    navigate(`/uploadanalyze?objective=${selectedGuardian}`);
  };

  const scrollToProblem = () => {
    problemRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToGuardians = () => {
    guardiansRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const Counter: React.FC<{ to: number; duration?: number; suffix?: string; decimals?: number }> = ({ to, duration = 1500, suffix = '', decimals = 0 }) => {
    const [value, setValue] = useState(0);
    useEffect(() => {
      let raf = 0;
      const start = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Number((to * eased).toFixed(decimals)));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    }, [to, duration, decimals]);
    return <span>{value.toFixed(decimals)}{suffix}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b2d33] via-[#0f3e46] to-[#173f3f] text-white">
      {/* Hero Section - Story First */}
      <section className="relative h-[100vh] px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Hero Atmosphere with Smart City Content */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_50%_0%,rgba(132,244,230,0.08),transparent_70%)]"
            style={{ transform: `translateY(${parallaxOffset * 0.03}px)` }}
          />
          <div className="absolute inset-0 mix-blend-overlay opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #ffffff 0 1px, transparent 1px 4px)' }} />

          {/* Smart City Skyline with Details */}
          <svg className="absolute bottom-0 left-0 w-[140%] h-[45vh] opacity-60" style={{ transform: `translateY(${parallaxOffset * 0.08}px)` }} viewBox="0 0 1400 350" preserveAspectRatio="none">
            {/* Buildings with solar panels and green roofs */}
            <defs>
              <linearGradient id="buildingGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0e3b42" />
                <stop offset="100%" stopColor="#0a2b31" />
              </linearGradient>
              <pattern id="solarPanel" x="0" y="0" width="20" height="5" patternUnits="userSpaceOnUse">
                <rect width="9" height="4" fill="#dda853" opacity="0.3" />
              </pattern>
              <pattern id="windows" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
                <rect x="2" y="2" width="5" height="5" fill="#84f4e6" opacity="0.2" />
              </pattern>
            </defs>
            
            {/* Building 1 - Solar panels visible */}
            <g>
              <rect x="80" y="180" width="60" height="120" fill="url(#buildingGrad1)" />
              <rect x="80" y="180" width="60" height="120" fill="url(#windows)" />
              <rect x="80" y="175" width="60" height="5" fill="url(#solarPanel)" />
            </g>
            
            {/* Building 2 - Tall with green roof */}
            <g>
              <rect x="220" y="130" width="70" height="170" fill="url(#buildingGrad1)" />
              <rect x="220" y="130" width="70" height="170" fill="url(#windows)" />
              <rect x="220" y="125" width="70" height="5" fill="#5c986a" opacity="0.5" />
            </g>
            
            {/* Building 3 - Solar facade */}
            <g>
              <rect x="360" y="160" width="80" height="140" fill="url(#buildingGrad1)" />
              <rect x="360" y="160" width="80" height="140" fill="url(#windows)" />
              <rect x="360" y="155" width="80" height="5" fill="url(#solarPanel)" />
            </g>
            
            {/* More buildings */}
            <rect x="520" y="145" width="65" height="155" fill="url(#buildingGrad1)" />
            <rect x="520" y="145" width="65" height="155" fill="url(#windows)" />
            <rect x="520" y="140" width="65" height="5" fill="#5c986a" opacity="0.5" />
            
            <rect x="660" y="120" width="75" height="180" fill="url(#buildingGrad1)" />
            <rect x="660" y="120" width="75" height="180" fill="url(#windows)" />
            <rect x="660" y="115" width="75" height="5" fill="url(#solarPanel)" />
            
            <rect x="820" y="155" width="70" height="145" fill="url(#buildingGrad1)" />
            <rect x="820" y="155" width="70" height="145" fill="url(#windows)" />
            
            <rect x="980" y="170" width="60" height="130" fill="url(#buildingGrad1)" />
            <rect x="980" y="170" width="60" height="130" fill="url(#windows)" />
            <rect x="980" y="165" width="60" height="5" fill="#5c986a" opacity="0.5" />
            
            <rect x="1120" y="140" width="85" height="160" fill="url(#buildingGrad1)" />
            <rect x="1120" y="140" width="85" height="160" fill="url(#windows)" />
            <rect x="1120" y="135" width="85" height="5" fill="url(#solarPanel)" />
            
            {/* Ground */}
            <rect x="0" y="300" width="1400" height="50" fill="#0a2b31" />
          </svg>

          {/* Floating Smart City Info Cards */}
          <style>{`
            @keyframes floatCard { 0%, 100% { transform: translateY(0px) translateX(0); } 50% { transform: translateY(-20px) translateX(5px); } }
            @keyframes fadeSlideIn { 0% { opacity: 0; transform: translateX(-30px); } 100% { opacity: 1; transform: translateX(0); } }
            @keyframes pulseData { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }
            @keyframes dataFlow { 0% { stroke-dashoffset: 800; opacity: 0; } 20% { opacity: 0.8; } 80% { opacity: 0.8; } 100% { stroke-dashoffset: 0; opacity: 0; } }
          `}</style>

          {/* Smart City Info Cards - Left Side (Vertical) */}
          <div className="hidden xl:flex xl:flex-col absolute left-8 2xl:left-12 top-24 h-[70vh]" style={{ animation: 'fadeSlideIn 1.2s ease-out 0.3s both' }}>
            <div className="backdrop-blur-md bg-white/10 border border-[#84f4e6]/30 rounded-2xl p-5 shadow-2xl max-w-xs" style={{ animation: 'floatCard 6s ease-in-out infinite' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#dda853] to-[#f0e0b5] flex items-center justify-center shadow-lg">
                  <span className="text-xl">🌞</span>
                </div>
                <div>
                  <div className="text-[#dda853] text-xs font-semibold uppercase tracking-wider">Solar Energy</div>
                  <div className="text-white text-lg font-bold">40% Potential</div>
                </div>
              </div>
              <div className="text-[#d9f5f2]/80 text-sm">Rooftop solar can power 2M+ homes</div>
            </div>

            <div
  className="backdrop-blur-md bg-white/10 border border-[#84f4e6]/30 rounded-2xl p-5 shadow-2xl max-w-xs mt-auto mb-10"
  style={{ animation: 'floatCard 7s ease-in-out infinite 0.5s' }}
>
  <div className="flex items-center gap-3 mb-2">
    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#84f4e6] to-[#2b515a] flex items-center justify-center shadow-lg">
      <span className="text-xl">💧</span>
    </div>

    <div>
      <div className="text-[#84f4e6] text-xs font-semibold uppercase tracking-wider">
        Water Systems
      </div>
      <div className="text-white text-lg font-bold">Smart Sensors</div>
    </div>
  </div>
  <div className="text-[#d9f5f2]/80 text-sm">
    Real-time leak detection saves 30%
  </div>
</div>

          </div>

          {/* Smart City Info Cards - Right Side (Vertical) */}
          <div className="hidden xl:block absolute right-8 2xl:right-12 top-48 space-y-8" style={{ animation: 'fadeSlideIn 1.2s ease-out 0.6s both' }}>
            <div className="backdrop-blur-md bg-white/10 border border-[#c5d9a9]/30 rounded-2xl p-5 shadow-2xl max-w-xs" style={{ animation: 'floatCard 6.5s ease-in-out infinite 0.3s' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#5c986a] to-[#c5d9a9] flex items-center justify-center shadow-lg">
                  <span className="text-xl">🌳</span>
                </div>
                <div>
                  <div className="text-[#c5d9a9] text-xs font-semibold uppercase tracking-wider">Green Spaces</div>
                  <div className="text-white text-lg font-bold">-5°C Cooling</div>
                </div>
              </div>
              <div className="text-[#d9f5f2]/80 text-sm">Urban forests reduce heat islands</div>
            </div>
          </div>

          {/* Data Flow Visualization */}
          <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 1400 900" preserveAspectRatio="none">
            <defs>
              <linearGradient id="dataGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#84f4e6" />
                <stop offset="50%" stopColor="#dda853" />
                <stop offset="100%" stopColor="#5c986a" />
              </linearGradient>
            </defs>
            <path d="M 100 200 Q 400 180 700 450" stroke="url(#dataGrad)" strokeWidth="2" fill="none" strokeDasharray="10 10" opacity="0.5" style={{ animation: 'dataFlow 8s ease-in-out infinite' }} />
            <path d="M 1300 250 Q 1000 280 700 450" stroke="url(#dataGrad)" strokeWidth="2" fill="none" strokeDasharray="10 10" opacity="0.5" style={{ animation: 'dataFlow 9s ease-in-out infinite 1s' }} />
            <path d="M 200 350 Q 500 400 700 450" stroke="url(#dataGrad)" strokeWidth="2" fill="none" strokeDasharray="10 10" opacity="0.5" style={{ animation: 'dataFlow 7s ease-in-out infinite 2s' }} />
            <path d="M 1200 400 Q 950 420 700 450" stroke="url(#dataGrad)" strokeWidth="2" fill="none" strokeDasharray="10 10" opacity="0.5" style={{ animation: 'dataFlow 8.5s ease-in-out infinite 1.5s' }} />
          </svg>

          {/* Ambient light effects */}
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#dda853]/15 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-32 right-1/4 w-80 h-80 bg-[#84f4e6]/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
          <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-[#5c986a]/10 rounded-full blur-[90px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 h-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6 animate-fade-in-down">
            <Sparkles className="h-5 w-5 text-[#dda853] mr-2" />
            <span className="text-sm font-semibold text-[#c5d9a9]">Story-First Urban Transformation</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-5 animate-fade-in-up">
            Every City Has a Story to Tell...
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#dda853] via-[#e8c57d] to-[#f0e0b5] drop-shadow-[0_2px_8px_rgba(221,168,83,0.35)]">What Will Yours Be?</span>
          </h1>

          <p className="text-lg md:text-xl text-[#d9f5f2]/90 max-w-2xl mx-auto mb-10 animate-fade-in-up stagger-1">
            Explore how Egypt can turn challenges into a brighter, cooler, cleaner future.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-2">
            <button
              onClick={() => navigate('/uploadanalyze')}
              className="group relative overflow-hidden bg-gradient-to-r from-[#5c986a] to-[#2b515a] hover:from-[#2b515a] hover:to-[#1a5059] text-white font-bold py-4 px-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-[1.03]"
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-[radial-gradient(200px_80px_at_20%_-20%,#ffffff,transparent)]" />
              <BarChart2 className="mr-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
              Analyze My Space
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </button>

            <button
              onClick={scrollToProblem}
              className="group bg-white/10 hover:bg-white/15 backdrop-blur-lg text-white font-semibold py-4 px-8 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              Learn More
              <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>

          <button onClick={scrollToProblem} className="absolute bottom-8 inline-flex flex-col items-center text-white bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300 animate-bounce">
            <span className="text-sm font-semibold mb-1">Scroll to Explore</span>
            <ArrowDown className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Section 1: The Problem (Emotional Hook) */}
      <section ref={problemRef} className="py-24 px-4 sm:px-6 lg:px-8 bg-white text-[#1a5059]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3 animate-fade-in-up">As Cairo grows, so do its challenges:</h2>
            <div className="relative flex items-center justify-center">
              <div className="h-1 w-56 bg-gradient-to-r from-[#dda853] to-[#5c986a] mx-auto rounded-full animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
            {/* Energy */}
            <div className="relative overflow-hidden px-3 py-2 rounded-2xl bg-[#f6faf9] border-2 border-[#e1f2ef] shadow-md hover:shadow-xl transition-all duration-300 lg:col-span-3 lg:mt-0">
              <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br from-[#dda853]/30 to-[#f0e0b5]/20 blur-2xl" />
              <div className="text-3xl mb-1">⚡</div>
              <div className="text-xl font-bold"><Counter to={27} suffix="B" /> EGP</div>
              <p className="text-[#2b515a] text-base">annual value of avoidable electricity losses (est., Egypt)</p>
            </div>
            {/* Water */}
            <div className="relative overflow-hidden px-3 py-2 rounded-2xl bg-[#f6faf9] border-2 border-[#e1f2ef] shadow-md hover:shadow-xl transition-all duration-300 lg:col-span-3 lg:mt-16">
              <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br from-[#84f4e6]/30 to-[#2b515a]/20 blur-2xl" />
              <div className="text-3xl mb-1">💧</div>
              <div className="text-xl font-bold"><Counter to={35} suffix="%" /></div>
              <p className="text-[#2b515a] text-base">non‑revenue water in Egypt’s networks (est.)</p>
            </div>
            {/* Waste */}
            <div className="relative overflow-hidden px-3 py-2 rounded-2xl bg-[#f6faf9] border-2 border-[#e1f2ef] shadow-md hover:shadow-xl transition-all duration-300 lg:col-span-3 lg:mt-32">
              <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br from-[#5c986a]/30 to-[#c5d9a9]/20 blur-2xl" />
              <div className="text-3xl mb-1">🗑️</div>
              <div className="text-xl font-bold"><Counter to={95000} /> tons</div>
              <p className="text-[#2b515a] text-base">municipal waste generated daily in Egypt (≈20% recycled)</p>
            </div>
            {/* Heat */}
            <div className="relative overflow-hidden px-3 py-2 rounded-2xl bg-[#f6faf9] border-2 border-[#e1f2ef] shadow-md hover:shadow-xl transition-all duration-300 lg:col-span-3 lg:mt-48">
              <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br from-[#dda853]/30 to-[#5c986a]/20 blur-2xl" />
              <div className="text-3xl mb-1">🌡️</div>
              <div className="text-xl font-bold"><Counter to={7} suffix="°C" /></div>
              <p className="text-[#2b515a] text-base">urban heat islands hotter than surroundings (major cities)</p>
            </div>
          </div>
          <p className="text-center mt-10 text-xl text-[#2b515a]">But your city can be different...</p>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#e7f6f3]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-3 text-[#1a5059]">How to use UrbanEco</h2>
          <p className="text-lg text-[#2b515a] mb-10">Three simple steps to turn data into action</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-white border border-[#84f4e6]/30 shadow">
              <div className="text-sm font-semibold text-[#5c986a] mb-1">Step 1</div>
              <h3 className="text-xl font-bold text-[#1a5059] mb-2">Choose your path</h3>
              <p className="text-[#2b515a]">Pick Solar (Solara), Water (Aqualis), or Landscape (Terra) and head to Analyze.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#84f4e6]/30 shadow">
              <div className="text-sm font-semibold text-[#5c986a] mb-1">Step 2</div>
              <h3 className="text-xl font-bold text-[#1a5059] mb-2">Tell us about your site</h3>
              <p className="text-[#2b515a]">Answer a few questions. We validate your inputs and prepare a personalized dashboard.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#84f4e6]/30 shadow">
              <div className="text-sm font-semibold text-[#5c986a] mb-1">Step 3</div>
              <h3 className="text-xl font-bold text-[#1a5059] mb-2">Explore and act</h3>
              <p className="text-[#2b515a]">Review insights, save results, and jump into the City Builder game to test ideas.</p>
            </div>
          </div>
                    <div className="flex justify-center mt-8">
            <button
              onClick={scrollToGuardians}
              className="group bg-gradient-to-r from-[#5c986a] to-[#2b515a] hover:from-[#2b515a] hover:to-[#1a5059] text-white font-bold py-4 px-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-[1.03]"
            >
              Choose Your Path
              <ArrowDown className="ml-2 h-6 w-6 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: The Journey Begins */}
      <section ref={guardiansRef} className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#e7f6f3]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-[#2b515a] mb-4">Choose Your Path</h3>
            <p className="text-[#2b515a]">Click any guardian to begin your transformation...</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guardians.map(g => (
              <div
                key={g.id}
                onClick={() => handleObjectiveClick(g.id)}
                className="group cursor-pointer bg-gradient-to-br from-white to-[#eaf7f4] p-6 rounded-3xl text-left hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] card-hover border-2 border-transparent hover:border-[#dda853]"
              >
                <div className="flex items-center justify-between">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mr-6 group-hover:rotate-6 transition-transform duration-500 shadow-lg"
                    style={{ backgroundImage: `linear-gradient(135deg, ${g.bgFrom}, ${g.bgTo})` }}>
                    <g.Icon className="h-10 w-10 text-white group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold mb-1 text-[#1a5059] group-hover:text-[#dda853] transition-colors">{g.label}</h4>
                    <p className="text-[#2b515a]">{g.subtitle}</p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-[#5c986a] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guardian Intro Modal (Full Screen Scroll) */}
      {guardianIntroOpen && selectedGuardian && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => setGuardianIntroOpen(false)} />
          <div className="relative z-10 w-full max-w-3xl mx-4 animate-fade-in-up max-h-[85vh] overflow-y-auto" style={{ animationDuration: '500ms' }}>
            <div className="rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#0b2d33] to-[#1a5059] text-white border border-white/10">
              <div className="relative h-1 w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-[#dda853] via-[#5c986a] to-[#84f4e6] animate-pulse" />
              </div>
              <div className="p-6 sm:p-10">
                <div className="mb-6 inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full">
                  <Sparkles className="h-5 w-5 text-[#dda853] mr-2" />
                  <span className="text-sm">Guardian Introduction</span>
                </div>

                <div className="flex items-start gap-6 mb-8">
                  <div className="h-16 w-16 rounded-2xl flex items-center justify-center shadow-md animate-float"
                    style={{ backgroundImage: `linear-gradient(135deg, ${selectedGuardian === 'solara' ? '#dda853,#5c986a' : selectedGuardian === 'aqualis' ? '#2b515a,#84f4e6' : '#5c986a,#84f4e6'})` }}>
                    {selectedGuardian === 'solara' && <Sun className="h-9 w-9 text-white" />}
                    {selectedGuardian === 'aqualis' && <Droplet className="h-9 w-9 text-white" />}
                    {selectedGuardian === 'terra' && <Leaf className="h-9 w-9 text-white" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl md:text-4xl font-extrabold leading-tight">
                      {selectedGuardian === 'solara' && 'I am Solara, Guardian of Energy.'}
                      {selectedGuardian === 'aqualis' && 'I am Aqualis, Guardian of Water.'}
                      {selectedGuardian === 'terra' && 'I am Terra, Guardian of Landscape.'}
                    </h3>
                    <p className="text-[#d9f5f2]/90 mt-3 animate-fade-in-up">
                      {guardianDetails[selectedGuardian].intro}
                    </p>
                  </div>
                </div>

                {selectedGuardian !== 'aqualis' && (
                  <div className="w-full rounded-2xl bg-white/10 border border-white/15 p-5 mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-xl p-4 bg-black/20">
                        <div className="text-sm text-white/70 mb-2">Current</div>
                        {selectedGuardian === 'solara' || selectedGuardian === 'terra' ? (
                          <img
                            src={`${import.meta.env.BASE_URL}Images/${selectedGuardian === 'terra' ? 'landscape_before.jpeg' : 'solar_before.jpeg'}`}
                            alt="Current skyline – inefficient"
                            className="w-full h-auto max-h-64 sm:max-h-72 object-contain rounded-lg"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-24 rounded-lg bg-black/20 flex items-center justify-center">skyline – inefficient</div>
                        )}
                      </div>
                      <div className="rounded-xl p-4 bg-black/20">
                        <div className="text-sm text-white/70 mb-2">Optimized</div>
                        {selectedGuardian === 'solara' || selectedGuardian === 'terra' ? (
                          <img
                            src={`${import.meta.env.BASE_URL}Images/${selectedGuardian === 'terra' ? 'landscape_after.jpeg' : 'solar_after.jpeg'}`}
                            alt="Optimized skyline – cooler, cleaner city"
                            className="w-full h-auto max-h-64 sm:max-h-72 object-contain rounded-lg"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-24 rounded-lg bg-black/20 flex items-center justify-center">cooler, cleaner city</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <ul className="space-y-3 mb-10">
                  {guardianDetails[selectedGuardian].points.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-3 animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                      <span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ backgroundImage: 'linear-gradient(135deg, #dda853, #5c986a)' }} />
                      <span className="text-white/90">{p}</span>
                    </li>
                  ))}
                </ul>

                <h4 className="text-2xl font-bold mb-2">First, tell me about your space...</h4>
                <p className="text-white/80 mb-4">Answer a few quick questions to personalize your journey.</p>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleStartJourney}
                    className="bg-white text-[#1a5059] hover:bg-[#c5d9a9] font-bold py-3 px-6 rounded-full inline-flex items-center justify-center transition-all duration-300 shadow-lg"
                  >
                    Start the journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setGuardianIntroOpen(false)}
                    className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold py-3 px-6 rounded-full transition-all"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#0b2d33] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#84f4e6] text-lg mb-2">
            Building a sustainable future, one solution at a time
          </p>
          <p className="text-[#c5d9a9]">
            &copy; {new Date().getFullYear()} UrbanEco. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;