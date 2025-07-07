export default function SignalIndicator({ signal, waitingForResult }) {
  if (!signal) return null;
  
  return (
    <div className={`rounded-lg p-4 transition-all ${
      signal.type === 'OVER' 
        ? (waitingForResult ? 'bg-green-800' : 'bg-green-900') 
        : (waitingForResult ? 'bg-red-800' : 'bg-red-900')
    }`}>
      <h2 className="text-xl font-semibold mb-2">
        {signal.type} Opportunity {waitingForResult && '(Waiting for result)'}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-300">Current Digit</p>
          <p className="text-lg font-medium">{signal.digit}</p>
        </div>
        <div>
          <p className="text-sm text-gray-300">Confidence</p>
          <p className="text-lg font-medium">{(signal.confidence * 100).toFixed(0)}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-300">Threshold</p>
          <p className="text-lg font-medium">{signal.threshold}</p>
        </div>
        <div>
          <p className="text-sm text-gray-300">Signal</p>
          <p className="text-lg font-medium">
            {signal.type === 'OVER' ? `> ${signal.threshold}` : `< ${signal.threshold}`}
          </p>
        </div>
      </div>
    </div>
  );
}
