export const connectToDerivWS = ({ onOpen, onClose, onTick }) => {
  const ws = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089');
  let activeSymbol = 'R_10';
  
  ws.onopen = () => {
    subscribeToSymbol(activeSymbol);
    onOpen();
  };
  
  ws.onclose = onClose;
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.msg_type === 'tick') {
      onTick(data);
    }
  };
  
  const subscribeToSymbol = (symbol) => {
    ws.send(JSON.stringify({
      ticks: symbol,
      subscribe: 1
    }));
  };
  
  const changeSymbol = (symbol) => {
    ws.send(JSON.stringify({
      forget: activeSymbol
    }));
    activeSymbol = symbol;
    subscribeToSymbol(symbol);
  };
  
  return {
    changeSymbol,
    close: () => ws.close()
  };
};
