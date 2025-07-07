export default function Heatmap({ data }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Digit Performance</h2>
      
      <div className="grid grid-cols-10 gap-1">
        {data.map((digitData, digit) => (
          <div key={digit} className="text-center">
            <div className="text-xs mb-1">{digit}</div>
            <div className="flex flex-col space-y-1">
              <div 
                className={`h-4 ${digitData.over > 0 ? 'bg-green-500' : 'bg-gray-700'}`}
                style={{ width: `${Math.min(100, digitData.over * 20)}%` }}
                title={`Over wins: ${digitData.over}`}
              ></div>
              <div 
                className={`h-4 ${digitData.under > 0 ? 'bg-red-500' : 'bg-gray-700'}`}
                style={{ width: `${Math.min(100, digitData.under * 20)}%` }}
                title={`Under wins: ${digitData.under}`}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between mt-2 text-xs">
        <span className="text-green-400">Over</span>
        <span className="text-red-400">Under</span>
      </div>
    </div>
  );
}
