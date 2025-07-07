export default function LiveStats({ stats }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Live Stats</h2>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-700 rounded p-3 text-center">
          <div className="text-2xl font-bold">{stats.wins}</div>
          <div className="text-sm text-gray-300">Wins</div>
        </div>
        
        <div className="bg-gray-700 rounded p-3 text-center">
          <div className="text-2xl font-bold">{stats.losses}</div>
          <div className="text-sm text-gray-300">Losses</div>
        </div>
        
        <div className="bg-gray-700 rounded p-3 text-center">
          <div className="text-2xl font-bold">
            {isNaN(stats.winRate) ? '0' : (stats.winRate * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-300">Win Rate</div>
        </div>
      </div>
    </div>
  );
}
