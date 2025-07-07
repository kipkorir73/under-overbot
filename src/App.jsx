import { useState, useEffect, useRef } from 'react';
import VolatilitySelector from './components/VolatilitySelector';
import DigitDisplay from './components/DigitDisplay';
import SignalIndicator from './components/SignalIndicator';
import StrategyControls from './components/StrategyControls';
import LiveStats from './components/LiveStats';
import Heatmap from './components/Heatmap';
import { connectToDerivWS } from './services/derivService';
import { calculateStats, updateStats } from './services/statsService';

function App() {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [activeSymbol, setActiveSymbol] = useState('R_10');
  const [digitHistory, setDigitHistory] = useState([]);
  const [currentDigit, setCurrentDigit] = useState(null);
  const [activeSignal, setActiveSignal] = useState(null);
  const [waitingForResult, setWaitingForResult] = useState(false);
  const [lastSignal, setLastSignal] = useState(null);
  const [stats, setStats] = useState({
    wins: 0,
    losses: 0,
    winRate: 0,
    heatmap: Array(10).fill(0).map(() => ({ over: 0, under: 0 }))
  });
  const [strategy, setStrategy] = useState({
    underThreshold: 4,
    overThreshold: 6,
    lookbackTicks: 5,
    requiredStreak: 4
  });
  
  const wsRef = useRef(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = connectToDerivWS({
      onOpen: () => setConnectionStatus('connected'),
      onClose: () => setConnectionStatus('disconnected'),
      onTick: handleTick
    });
    
    wsRef.current = ws;
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleTick = (tick) => {
    const digit = parseInt(tick.quote.toString().slice(-1));
    setCurrentDigit(digit);
    
    // Update digit history
    const newHistory = [...digitHistory.slice(-9999), digit];
    setDigitHistory(newHistory);
    
    // Check if we're waiting to evaluate a previous signal
    if (waitingForResult && lastSignal) {
      setStats(prev => updateStats(prev, lastSignal, digit, strategy));
      setWaitingForResult(false);
    }
    
    // Check for new signals
    checkForSignals(digit);
    
    // Update overall stats periodically
    if (newHistory.length % 100 === 0 && newHistory.length > strategy.lookbackTicks) {
      setStats(calculateStats(newHistory, strategy));
    }
  };

  const checkForSignals = (digit) => {
    const recentDigits = digitHistory.slice(-strategy.lookbackTicks);
    const underCount = recentDigits.filter(d => d < strategy.underThreshold).length;
    const overCount = recentDigits.filter(d => d > strategy.overThreshold).length;

    if (underCount >= strategy.requiredStreak) {
      const signal = { 
        type: 'OVER', 
        digit, 
        confidence: underCount / strategy.lookbackTicks,
        threshold: strategy.underThreshold
      };
      setActiveSignal(signal);
      speakAlert(signal);
      setWaitingForResult(true);
      setLastSignal(signal);
    } 
    else if (overCount >= strategy.requiredStreak) {
      const signal = { 
        type: 'UNDER', 
        digit, 
        confidence: overCount / strategy.lookbackTicks,
        threshold: strategy.overThreshold
      };
      setActiveSignal(signal);
      speakAlert(signal);
      setWaitingForResult(true);
      setLastSignal(signal);
    } 
    else {
      setActiveSignal(null);
    }
  };

  const speakAlert = (signal) => {
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance();
      msg.text = `Sniper alert: Go ${signal.type} on ${activeSymbol.replace('R_', 'Volatility ')}`;
      window.speechSynthesis.speak(msg);
    }
  };

  const handleSymbolChange = (symbol) => {
    if (wsRef.current) {
      wsRef.current.changeSymbol(symbol);
    }
    setActiveSymbol(symbol);
    setDigitHistory([]);
    setActiveSignal(null);
    setWaitingForResult(false);
    setLastSignal(null);
  };

  const updateStrategy = (newStrategy) => {
    setStrategy(newStrategy);
    // Recalculate stats with new strategy
    if (digitHistory.length > 0) {
      setStats(calculateStats(digitHistory, newStrategy));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-blue-400 mb-2">Deriv Over/Under Sniper</h1>
        <div className="flex flex-wrap items-center gap-4">
          <VolatilitySelector 
            activeSymbol={activeSymbol}
            onChange={handleSymbolChange}
          />
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            connectionStatus === 'connected' ? 'bg-green-600' : 'bg-red-600'
          }`}>
            {connectionStatus.toUpperCase()}
          </div>
          <div className="text-sm">
            Ticks: {digitHistory.length}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DigitDisplay 
            currentDigit={currentDigit}
            history={digitHistory.slice(-30)}
          />
          <SignalIndicator 
            signal={activeSignal} 
            waitingForResult={waitingForResult}
          />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <StrategyControls 
            strategy={strategy}
            onUpdate={updateStrategy}
          />
          <LiveStats stats={stats} />
          <Heatmap data={stats.heatmap} />
        </div>
      </div>
    </div>
  );
}

export default App;
