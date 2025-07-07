import { useState, useEffect } from 'react';

export default function StrategyControls({ strategy, onUpdate }) {
  const [localStrategy, setLocalStrategy] = useState(strategy);
  
  useEffect(() => {
    setLocalStrategy(strategy);
  }, [strategy]);
  
  const handleChange = (e) => {
    setLocalStrategy({
      ...localStrategy,
      [e.target.name]: parseInt(e.target.value)
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(localStrategy);
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Strategy Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Under Threshold (≤)</label>
          <input
            type="number"
            name="underThreshold"
            min="0"
            max="9"
            value={localStrategy.underThreshold}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded p-2"
          />
        </div>
        
        <div>
          <label className="block mb-1">Over Threshold (≥)</label>
          <input
            type="number"
            name="overThreshold"
            min="0"
            max="9"
            value={localStrategy.overThreshold}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded p-2"
          />
        </div>
        
        <div>
          <label className="block mb-1">Lookback Ticks</label>
          <input
            type="number"
            name="lookbackTicks"
            min="1"
            max="20"
            value={localStrategy.lookbackTicks}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded p-2"
          />
        </div>
        
        <div>
          <label className="block mb-1">Required Streak</label>
          <input
            type="number"
            name="requiredStreak"
            min="1"
            max="20"
            value={localStrategy.requiredStreak}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded p-2"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 rounded py-2 font-medium"
        >
          Update Strategy
        </button>
      </form>
    </div>
  );
}
