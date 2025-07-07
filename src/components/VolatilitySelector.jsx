export default function VolatilitySelector({ activeSymbol, onChange }) {
  const symbols = [
    { value: 'R_10', label: 'Volatility 10' },
    { value: 'R_25', label: 'Volatility 25' },
    { value: 'R_50', label: 'Volatility 50' },
    { value: 'R_75', label: 'Volatility 75' },
    { value: 'R_100', label: 'Volatility 100' }
  ];
  
  return (
    <select
      value={activeSymbol}
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-700 rounded px-3 py-1"
    >
      {symbols.map(symbol => (
        <option key={symbol.value} value={symbol.value}>
          {symbol.label}
        </option>
      ))}
    </select>
  );
}
