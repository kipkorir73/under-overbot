export const calculateStats = (digitHistory, strategy) => {
  if (digitHistory.length < 2) {
    return {
      wins: 0,
      losses: 0,
      winRate: 0,
      heatmap: Array(10).fill(0).map(() => ({ over: 0, under: 0 }))
    };
  }

  const stats = {
    wins: 0,
    losses: 0,
    winRate: 0,
    heatmap: Array(10).fill(0).map(() => ({ over: 0, under: 0 }))
  };

  // Analyze history to calculate stats
  for (let i = 0; i < digitHistory.length - 1; i++) {
    const currentDigit = digitHistory[i];
    const nextDigit = digitHistory[i + 1];
    
    // Check if current digit would trigger an OVER signal
    if (currentDigit < strategy.underThreshold) {
      const isWin = nextDigit > strategy.underThreshold;
      stats.heatmap[currentDigit].over += isWin ? 1 : 0;
      stats.wins += isWin ? 1 : 0;
      stats.losses += isWin ? 0 : 1;
    }
    
    // Check if current digit would trigger an UNDER signal
    if (currentDigit > strategy.overThreshold) {
      const isWin = nextDigit < strategy.overThreshold;
      stats.heatmap[currentDigit].under += isWin ? 1 : 0;
      stats.wins += isWin ? 1 : 0;
      stats.losses += isWin ? 0 : 1;
    }
  }

  stats.winRate = stats.wins / (stats.wins + stats.losses) || 0;
  
  return stats;
};

export const updateStats = (currentStats, signal, nextDigit, strategy) => {
  const threshold = signal.type === 'OVER' ? strategy.underThreshold : strategy.overThreshold;
  const isWin = signal.type === 'OVER' 
    ? nextDigit > threshold 
    : nextDigit < threshold;

  const newStats = {
    ...currentStats,
    wins: isWin ? currentStats.wins + 1 : currentStats.wins,
    losses: isWin ? currentStats.losses : currentStats.losses + 1,
    heatmap: [...currentStats.heatmap]
  };

  // Update heatmap for the signal digit
  newStats.heatmap[signal.digit] = {
    ...currentStats.heatmap[signal.digit],
    [signal.type.toLowerCase()]: currentStats.heatmap[signal.digit][signal.type.toLowerCase()] + (isWin ? 1 : 0)
  };

  newStats.winRate = newStats.wins / (newStats.wins + newStats.losses) || 0;

  return newStats;
};
