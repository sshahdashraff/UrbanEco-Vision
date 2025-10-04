import React, { useState } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';

// Import all pages
import Home from './pages/Home';
import UploadAnalyze from './pages/UploadAnalyze';
import CityBuilderGame from './pages/CityBuilderGame';
import ForecastSimulator from './pages/ForecastSimulator';
import About from './pages/About';

const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [rtl, setRtl] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleRtl = () => {
    setRtl(!rtl);
    if (!rtl) {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-white'}`}>
      {/* Navigation */}
      <nav className={`glass sticky top-0 z-50 ${darkMode ? 'dark:bg-gray-800/80' : 'bg-white/80'} backdrop-blur-lg shadow-lg border-b border-[#84f4e6]/20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center group">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#5c986a] to-[#84f4e6] rounded-xl flex items-center justify-center mr-3 transform group-hover:rotate-12 transition-transform duration-300">
                    <span className="text-2xl">🌿</span>
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-[#1a5059] to-[#5c986a] bg-clip-text text-transparent">
                    UrbanEco
                  </span>
                </Link>
              </div>
<div className="hidden sm:ml-32 sm:flex sm:space-x-6">
  <Link 
    to="/" 
    className={`${isActive('/') ? 'text-[#5c986a] border-[#5c986a]' : 'text-gray-600 hover:text-[#5c986a] hover:border-[#84f4e6]'} border-b-2 border-transparent inline-flex items-center px-6 pt-1 text-base font-semibold transition-all duration-300`}
  >
    Home
  </Link>
  <Link 
    to="/uploadanalyze" 
    className={`${isActive('/uploadanalyze') ? 'text-[#5c986a] border-[#5c986a]' : 'text-gray-600 hover:text-[#5c986a] hover:border-[#84f4e6]'} border-b-2 border-transparent inline-flex items-center px-6 pt-1 text-base font-semibold transition-all duration-300`}
  >
    Analyze
  </Link>
  <Link 
    to="/city-builder" 
    className={`${isActive('/city-builder') ? 'text-[#5c986a] border-[#5c986a]' : 'text-gray-600 hover:text-[#5c986a] hover:border-[#84f4e6]'} border-b-2 border-transparent inline-flex items-center px-6 pt-1 text-base font-semibold transition-all duration-300 group`}
  >
    <span className="mr-1 animate-pulse"></span>
    🎮 City Builder
  </Link>
  
  <Link 
    to="/forecast" 
    className={`${isActive('/forecast') ? 'text-[#5c986a] border-[#5c986a]' : 'text-gray-600 hover:text-[#5c986a] hover:border-[#84f4e6]'} border-b-2 border-transparent inline-flex items-center px-6 pt-1 text-base font-semibold transition-all duration-300`}
  >
    Forecast
  </Link>
  <Link 
    to="/about" 
    className={`${isActive('/about') ? 'text-[#5c986a] border-[#5c986a]' : 'text-gray-600 hover:text-[#5c986a] hover:border-[#84f4e6]'} border-b-2 border-transparent inline-flex items-center px-6 pt-1 text-base font-semibold transition-all duration-300`}
  >
    About
  </Link>
</div>            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-2">
              <button
                onClick={toggleDarkMode}
                className="p-3 rounded-xl text-gray-600 hover:text-[#5c986a] hover:bg-[#c5d9a9]/20 focus:outline-none transition-all duration-300 transform hover:scale-110"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-xl text-gray-600 hover:text-[#5c986a] hover:bg-[#c5d9a9]/20 focus:outline-none transition-all"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden glass border-t border-[#84f4e6]/20 animate-fade-in-down">
            <div className="pt-2 pb-3 space-y-1">
              <Link 
                to="/" 
                className={`block pl-4 pr-4 py-3 border-l-4 ${isActive('/') ? 'border-[#5c986a] bg-[#c5d9a9]/20 text-[#1a5059]' : 'border-transparent text-gray-600'} text-base font-semibold hover:bg-[#c5d9a9]/10 hover:border-[#84f4e6] hover:text-[#5c986a] transition-all`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/uploadanalyze" 
                className={`block pl-4 pr-4 py-3 border-l-4 ${isActive('/uploadanalyze') ? 'border-[#5c986a] bg-[#c5d9a9]/20 text-[#1a5059]' : 'border-transparent text-gray-600'} text-base font-semibold hover:bg-[#c5d9a9]/10 hover:border-[#84f4e6] hover:text-[#5c986a] transition-all`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Analyze
              </Link>
              <Link 
                to="/city-builder" 
                className={`block pl-4 pr-4 py-3 border-l-4 ${isActive('/city-builder') ? 'border-[#5c986a] bg-[#c5d9a9]/20 text-[#1a5059]' : 'border-transparent text-gray-600'} text-base font-semibold hover:bg-[#c5d9a9]/10 hover:border-[#84f4e6] hover:text-[#5c986a] transition-all`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="mr-2">🎮</span>
                City Builder Challenge
                <span className="ml-2 text-xs bg-gradient-to-r from-[#dda853] to-[#f0e0b5] text-white px-2 py-0.5 rounded-full">New</span>
              </Link>
              
              <Link 
                to="/forecast" 
                className={`block pl-4 pr-4 py-3 border-l-4 ${isActive('/forecast') ? 'border-[#5c986a] bg-[#c5d9a9]/20 text-[#1a5059]' : 'border-transparent text-gray-600'} text-base font-semibold hover:bg-[#c5d9a9]/10 hover:border-[#84f4e6] hover:text-[#5c986a] transition-all`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Forecast
              </Link>
              <Link 
                to="/about" 
                className={`block pl-4 pr-4 py-3 border-l-4 ${isActive('/about') ? 'border-[#5c986a] bg-[#c5d9a9]/20 text-[#1a5059]' : 'border-transparent text-gray-600'} text-base font-semibold hover:bg-[#c5d9a9]/10 hover:border-[#84f4e6] hover:text-[#5c986a] transition-all`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
            </div>
            <div className="pt-4 pb-3 border-t border-[#84f4e6]/20">
              <div className="flex items-center px-4 space-x-3">
                <button
                  onClick={toggleDarkMode}
                  className="p-3 rounded-xl text-gray-600 hover:text-[#5c986a] hover:bg-[#c5d9a9]/20 focus:outline-none transition-all"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <button
                  onClick={toggleRtl}
                  className="p-3 rounded-xl text-gray-600 hover:text-[#5c986a] hover:bg-[#c5d9a9]/20 focus:outline-none transition-all"
                  aria-label="Toggle RTL mode"
                >
                  <Globe className="h-5 w-5" />
                  <span className="sr-only">{rtl ? 'Switch to English' : 'التبديل إلى العربية'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/uploadanalyze" element={<UploadAnalyze />} />
          <Route path="/city-builder" element={<CityBuilderGame />} />
          
          <Route path="/forecast" element={<ForecastSimulator />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;