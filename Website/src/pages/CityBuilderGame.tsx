import React, { useState, useEffect, useCallback } from 'react';
import { Sun, Droplet, Trees, Trophy, RotateCcw, Play, Pause } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Solution {
  id: string;
  name: string;
  icon: React.ReactNode;
  cost: number;
  co2Reduction: number;
  color: string;
  gradient: string;
}

interface PlacedSolution extends Solution {
  gridPosition: number;
}

const CityBuilderGame: React.FC = () => {
  const navigate = useNavigate();
  const [budget, setBudget] = useState(500000);
  const [currentCO2, setCurrentCO2] = useState(100);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [placedSolutions, setPlacedSolutions] = useState<PlacedSolution[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const INITIAL_CO2 = 100;
  const TARGET_CO2 = 50;
  const INITIAL_BUDGET = 500000;
  const INITIAL_TIME = 30;

  const solutions: Solution[] = [
    {
      id: 'solar',
      name: 'Solar Panels',
      icon: <Sun className="h-8 w-8" />,
      cost: 80000,
      co2Reduction: 15,
      color: '#dda853',
      gradient: 'from-[#dda853] to-[#f0e0b5]'
    },
    {
      id: 'water',
      name: 'Water Recycling',
      icon: <Droplet className="h-8 w-8" />,
      cost: 60000,
      co2Reduction: 10,
      color: '#84f4e6',
      gradient: 'from-[#84f4e6] to-[#2b515a]'
    },
    {
      id: 'green',
      name: 'Green Spaces',
      icon: <Trees className="h-8 w-8" />,
      cost: 40000,
      co2Reduction: 8,
      color: '#5c986a',
      gradient: 'from-[#5c986a] to-[#c5d9a9]'
    }
  ];

useEffect(() => {
  if (isPlaying && timeLeft > 0 && !gameOver) {
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  } else if (timeLeft === 0 || currentCO2 <= TARGET_CO2) {
    endGame();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isPlaying, timeLeft, currentCO2, gameOver]);

  const endGame = () => {
    setIsPlaying(false);
    setGameOver(true);
    checkAchievements();
  };

  const checkAchievements = () => {
    const newAchievements: string[] = [];
    const reduction = ((INITIAL_CO2 - currentCO2) / INITIAL_CO2) * 100;

    if (currentCO2 <= TARGET_CO2) newAchievements.push('🎯 Mission Complete!');
    if (reduction >= 60) newAchievements.push('⭐ Carbon Crusher');
    if (budget >= INITIAL_BUDGET * 0.5) newAchievements.push('💰 Budget Master');
    if (placedSolutions.length >= 6) newAchievements.push('🏗️ Master Builder');

    setAchievements(newAchievements);
  };

  const handleGridClick = useCallback((position: number) => {
    if (!selectedSolution || !isPlaying) return;

    const alreadyPlaced = placedSolutions.find(s => s.gridPosition === position);
    if (alreadyPlaced) return;

    if (budget >= selectedSolution.cost) {
      const newSolution: PlacedSolution = { ...selectedSolution, gridPosition: position };
      setPlacedSolutions([...placedSolutions, newSolution]);
      setBudget(budget - selectedSolution.cost);
      setCurrentCO2(Math.max(0, currentCO2 - selectedSolution.co2Reduction));
      setSelectedSolution(null);
    }
  }, [selectedSolution, budget, currentCO2, placedSolutions, isPlaying]);

  const resetGame = () => {
    setBudget(INITIAL_BUDGET);
    setCurrentCO2(INITIAL_CO2);
    setTimeLeft(INITIAL_TIME);
    setIsPlaying(false);
    setPlacedSolutions([]);
    setGameOver(false);
    setAchievements([]);
    setSelectedSolution(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const reductionPercentage = ((INITIAL_CO2 - currentCO2) / INITIAL_CO2) * 100;
  const co2Progress = (currentCO2 / INITIAL_CO2) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b2d33] via-[#0f3e46] to-[#173f3f] text-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Floating Timer (visible while playing) */}
        {isPlaying && !gameOver && (
          <div className="fixed top-24 right-6 z-50">
            <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg">
              <span className="text-sm font-semibold text-[#dda853] mr-2">Time</span>
              <span className="text-lg font-extrabold text-white">{formatTime(timeLeft)}</span>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#dda853] via-[#e8c57d] to-[#f0e0b5]">
            🎮 City Builder Challenge
          </h1>
          <p className="text-xl text-[#d9f5f2]/90">Optimize Your Block & Reduce Carbon by 50%!</p>
          <div className="mt-4">
            <button
              onClick={() => setShowGuide(true)}
              className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-6 rounded-full border border-white/20 transition-all"
            >
              📖 How to Play
            </button>
          </div>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#84f4e6] text-sm font-semibold uppercase">Mission</span>
              <Trophy className="h-5 w-5 text-[#dda853]" />
            </div>
            <div className="text-3xl font-bold">Reduce 50%</div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#dda853] text-sm font-semibold uppercase">Time Left</span>
              <div className={`text-2xl font-bold ${timeLeft < 10 ? 'text-red-400 animate-pulse' : ''}`}>
                {formatTime(timeLeft)}
              </div>
            </div>
            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#dda853] to-[#f0e0b5] transition-all"
                style={{ width: `${(timeLeft / INITIAL_TIME) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#c5d9a9] text-sm font-semibold uppercase">Budget</span>
              <span className="text-2xl font-bold">EGP {(budget / 1000).toFixed(0)}K</span>
            </div>
            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#5c986a] to-[#c5d9a9] transition-all"
                style={{ width: `${(budget / INITIAL_BUDGET) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {showGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
            <div className="bg-gradient-to-b from-[#0b2d33] to-[#1a5059] rounded-3xl p-8 max-w-lg mx-4 border border-white/20 shadow-2xl animate-fade-in-up">
              <h2 className="text-3xl font-extrabold mb-4 text-center">📖 How to Play</h2>
              <ul className="space-y-3 text-[#d9f5f2]/90 text-lg">
                <li>🌞 <strong>Shine with Solar!</strong> Each panel slashes CO₂ fast.</li>
                <li>💧 <strong>Save Every Drop!</strong> Recycling water keeps your city clean.</li>
                <li>🌳 <strong>Green is the New Gold!</strong> Trees absorb CO₂ and refresh the air.</li>
                <li>💰 <strong>Spend wisely!</strong> Balance your budget with impact.</li>
                <li>⏳ <strong>Time is ticking…</strong> Every second counts!</li>
                <li>🏆 <strong>Goal:</strong> Reduce CO₂ by 50% to win.</li>
              </ul>
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowGuide(false)}
                  className="bg-gradient-to-r from-[#5c986a] to-[#2b515a] hover:from-[#2b515a] hover:to-[#1a5059] text-white font-bold py-3 px-6 rounded-full transition-all"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CO2 Progress */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-1">Carbon Emissions</h3>
              <p className="text-[#d9f5f2]/70">Reduced by {reductionPercentage.toFixed(0)}%</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-extrabold text-[#84f4e6]">{currentCO2.toFixed(0)} tons</div>
              <div className="text-sm text-[#d9f5f2]/70">Target: {TARGET_CO2} tons</div>
            </div>
          </div>
          <div className="h-8 bg-black/30 rounded-full overflow-hidden relative">
            <div 
              className={`h-full transition-all duration-500 ${
                currentCO2 <= TARGET_CO2 
                  ? 'bg-gradient-to-r from-[#5c986a] to-[#c5d9a9]' 
                  : 'bg-gradient-to-r from-red-500 to-orange-500'
              }`}
              style={{ width: `${co2Progress}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold">{currentCO2.toFixed(0)} / {TARGET_CO2} tons</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Solutions Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4">Available Solutions</h3>
              <div className="space-y-3">
                {solutions.map(solution => (
                  <button
                    key={solution.id}
                    onClick={() => setSelectedSolution(solution)}
                    disabled={!isPlaying || budget < solution.cost}
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 ${
                      selectedSolution?.id === solution.id
                        ? 'border-white scale-105 shadow-xl'
                        : 'border-white/20 hover:border-white/40'
                    } ${
                      budget < solution.cost ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-102'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${solution.color}15, ${solution.color}05)`
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${solution.gradient}`}>
                        {solution.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-bold text-sm">{solution.name}</div>
                        <div className="text-xs text-[#d9f5f2]/70">-{solution.co2Reduction} tons CO₂</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">EGP {(solution.cost / 1000).toFixed(0)}K</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Game Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4">City Block Grid</h3>
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-3 mb-6">
                {[...Array(16)].map((_, index) => {
                  const placed = placedSolutions.find(s => s.gridPosition === index);
                  return (
                    <button
                      key={index}
                      onClick={() => handleGridClick(index)}
                      disabled={!isPlaying || !selectedSolution}
                      className={`aspect-square rounded-xl border-2 transition-all duration-300 flex items-center justify-center ${
                        placed
                          ? 'border-white/40 shadow-lg scale-105'
                          : selectedSolution && isPlaying
                          ? 'border-dashed border-white/40 hover:border-white hover:scale-105 cursor-pointer'
                          : 'border-white/20 cursor-not-allowed'
                      }`}
                      style={{
                        background: placed 
                          ? `linear-gradient(135deg, ${placed.color}40, ${placed.color}20)`
                          : 'rgba(255,255,255,0.05)'
                      }}
                    >
                      {placed && (
                        <div className="text-center">
                          <div className="mb-1">{placed.icon}</div>
                          <div className="text-xs font-semibold">-{placed.co2Reduction}</div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Control Buttons */}
              <div className="flex gap-3">
                {!isPlaying && !gameOver && timeLeft === INITIAL_TIME && (
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="flex-1 bg-gradient-to-r from-[#5c986a] to-[#2b515a] hover:from-[#2b515a] hover:to-[#1a5059] text-white font-bold py-4 px-6 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-2xl"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Start Game
                  </button>
                )}

                {isPlaying && !gameOver && (
                  <>
                    <button
                      onClick={() => setIsPlaying(false)}
                      className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white font-bold py-4 px-6 rounded-full flex items-center justify-center transition-all duration-300 border border-white/20"
                    >
                      <Pause className="mr-2 h-5 w-5" />
                      Pause
                    </button>
                    <button
                      onClick={endGame}
                      className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-full transition-all duration-300 shadow-lg"
                    >
                      Finish
                    </button>
                  </>
                )}

                {!isPlaying && !gameOver && timeLeft < INITIAL_TIME && timeLeft > 0 && (
                  <>
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="flex-1 bg-gradient-to-r from-[#5c986a] to-[#2b515a] hover:from-[#2b515a] hover:to-[#1a5059] text-white font-bold py-4 px-6 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-2xl"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Resume
                    </button>
                    <button
                      onClick={endGame}
                      className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-full transition-all duration-300 shadow-lg"
                    >
                      Finish
                    </button>
                  </>
                )}

                {!isPlaying && !gameOver && (
                  <button
                    onClick={resetGame}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white font-bold py-4 px-6 rounded-full flex items-center justify-center transition-all duration-300 border border-white/20"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Game Over Modal */}
        {gameOver && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
            <div className="bg-gradient-to-b from-[#0b2d33] to-[#1a5059] rounded-3xl p-8 max-w-lg mx-4 border border-white/20 shadow-2xl animate-fade-in-up">
              <h2 className="text-4xl font-extrabold mb-4 text-center">
                {currentCO2 <= TARGET_CO2 ? '🎉 Mission Complete!' : '⏰ Time\'s Up!'}
              </h2>
              <p className="text-xl text-center mb-6">
                You reduced carbon by <span className="text-[#dda853] font-bold">{reductionPercentage.toFixed(0)}%</span>
              </p>

              {achievements.length > 0 && (
                <div className="bg-white/10 rounded-2xl p-4 mb-6">
                  <h3 className="text-lg font-bold mb-2">🏆 Achievements</h3>
                  <div className="space-y-2">
                    {achievements.map((achievement, idx) => (
                      <div key={idx} className="text-[#d9f5f2]/90">{achievement}</div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={resetGame}
                  className="flex-1 bg-gradient-to-r from-[#5c986a] to-[#2b515a] hover:from-[#2b515a] hover:to-[#1a5059] text-white font-bold py-3 px-6 rounded-full transition-all"
                >
                  Play Again
                </button>
                <button
                  onClick={() => navigate('/forecast', { state: { gameExitHint: 'Now we will go to forecasting.' } })}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-full border border-white/20 transition-all"
                >
                  Exit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CityBuilderGame;
