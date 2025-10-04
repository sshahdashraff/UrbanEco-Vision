import React from 'react';
import { Users, Sun, Award} from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-gray-800 dark:text-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#1a5059] to-[#5c986a] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
              Building Smarter, Greener Cities with <span className="text-[#84f4e6]">UrbanEco</span>
            </h1>
            <p className="text-xl text-[#c5d9a9] max-w-3xl mx-auto">
              We help cities leap from plans to progress using data, AI, and nature-positive design to turn streets into energy hubs, water systems into circular networks, and neighborhoods into vibrant, resilient places to live.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#1a5059] dark:text-white mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                UrbanEco accelerates the journey to smart, sustainable cities by weaving clean energy, circular water, and regenerative landscapes into everyday urban life.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                By combining AI, geospatial data, and systems design, we reveal high‑impact opportunities solar rooftops that pay back fast, leak detection that saves millions of liters, and green corridors that cool districts and boost wellbeing.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Our platform turns complexity into clarity: actionable insights, credible forecasts, and trusted partners so decision‑makers can act with speed and confidence.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9 rounded-2xl bg-gradient-to-br from-[#5c986a] to-[#84f4e6] p-8 text-white flex items-center justify-center shadow-xl transform hover:scale-105 transition-all">
                <div className="text-center">
                  <Sun className="h-24 w-24 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Cities that Work with Nature</h3>
                  <p className="text-[#c5d9a9]">From energy-positive blocks to water-wise districts—designed by data, inspired by people</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Green Goals Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#c5d9a9]/10 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1a5059] dark:text-white text-center mb-12">Smart City Outcomes We Aim For</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center border-2 border-[#84f4e6]/30 dark:border-gray-700 transform hover:scale-105 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Sun className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a5059] dark:text-white mb-3">Energy‑Positive Districts</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Scale rooftop and facade PV so neighborhoods generate more clean energy than they consume.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center border-2 border-[#84f4e6]/30 dark:border-gray-700 transform hover:scale-105 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-[#5c986a] to-[#84f4e6] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a5059] dark:text-white mb-3">Carbon‑Light Operations</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Cut emissions across energy, mobility, and materials with measurable, transparent impact.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center border-2 border-[#84f4e6]/30 dark:border-gray-700 transform hover:scale-105 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-[#84f4e6] to-[#5c986a] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a5059] dark:text-white mb-3">Thriving Communities</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create cooler, greener, safer streets that boost health, jobs, and local pride.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Creative Ideas Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1a5059] dark:text-white text-center mb-12">Creative Ideas to Build a Smart City</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#c5d9a9]/20 to-white dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border-2 border-[#84f4e6]/30 dark:border-gray-700 shadow-lg">
              <h3 className="text-xl font-semibold text-[#1a5059] dark:text-white mb-2">Solar Canopies & Cool Corridors</h3>
              <p className="text-gray-700 dark:text-gray-300">Turn parking lots and bus stops into shade‑giving power stations that charge e‑mobility and cool streets.</p>
            </div>
            <div className="bg-gradient-to-br from-[#c5d9a9]/20 to-white dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border-2 border-[#84f4e6]/30 dark:border-gray-700 shadow-lg">
              <h3 className="text-xl font-semibold text-[#1a5059] dark:text-white mb-2">Digital Water Twins</h3>
              <p className="text-gray-700 dark:text-gray-300">Use sensors and AI to spot leaks in hours, optimize pressure, and reuse treated water for urban greening.</p>
            </div>
            <div className="bg-gradient-to-br from-[#c5d9a9]/20 to-white dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border-2 border-[#84f4e6]/30 dark:border-gray-700 shadow-lg">
              <h3 className="text-xl font-semibold text-[#1a5059] dark:text-white mb-2">Pocket Forests & Green Roofs</h3>
              <p className="text-gray-700 dark:text-gray-300">Plant native micro‑forests and retrofit rooftops to cut heat, capture rain, and create biodiverse havens.</p>
            </div>
            <div className="bg-gradient-to-br from-[#c5d9a9]/20 to-white dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border-2 border-[#84f4e6]/30 dark:border-gray-700 shadow-lg">
              <h3 className="text-xl font-semibold text-[#1a5059] dark:text-white mb-2">Waste‑to‑Value Hubs</h3>
              <p className="text-gray-700 dark:text-gray-300">Transform organics into compost and biogas; turn recyclables into local materials for urban upgrades.</p>
            </div>
            <div className="bg-gradient-to-br from-[#c5d9a9]/20 to-white dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border-2 border-[#84f4e6]/30 dark:border-gray-700 shadow-lg">
              <h3 className="text-xl font-semibold text-[#1a5059] dark:text-white mb-2">Citizen Dashboards</h3>
              <p className="text-gray-700 dark:text-gray-300">Open, real‑time dashboards for air, energy, and water so communities can co‑create solutions.</p>
            </div>
            <div className="bg-gradient-to-br from-[#c5d9a9]/20 to-white dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border-2 border-[#84f4e6]/30 dark:border-gray-700 shadow-lg">
              <h3 className="text-xl font-semibold text-[#1a5059] dark:text-white mb-2">15‑Minute Services</h3>
              <p className="text-gray-700 dark:text-gray-300">Design neighborhoods where daily needs are a short walk or ride away lower traffic, higher life quality.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;