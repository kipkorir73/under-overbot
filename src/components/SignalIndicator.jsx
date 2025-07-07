export default function SignalIndicator({ signal }) {
  if (!signal) return null;
  
  return (
    <div className={`rounded-lg p-4 ${
      signal.type === 'OVER' ? 'bg-green-900' : 'bg-red-900'
    }`}>
      <h2 className="text-xl font-semibold mb-2">
        {signal.type} Opportunity
      </h2>
      <p>Digit: {signal.digit}</p>
      <p>Confidence: {(signal.confidence * 100).toFixed(0)}%</p>
    </div>
  );
}
