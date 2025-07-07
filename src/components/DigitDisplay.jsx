export default function DigitDisplay({ currentDigit, history }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Live Digit Stream</h2>
      
      <div className="flex justify-center mb-6">
        <div className={`text-6xl font-bold ${
          currentDigit !== null ? 'text-blue-400' : 'text-gray-500'
        }`}>
          {currentDigit !== null ? currentDigit : '--'}
        </div>
      </div>
      
      <div className="grid grid-cols-10 gap-2">
        {history.map((digit, idx) => (
          <div key={idx} className="bg-gray-700 rounded p-2 text-center">
            {digit}
          </div>
        ))}
      </div>
    </div>
  );
}
