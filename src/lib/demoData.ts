export interface CandlestickData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  [key: string]: any; // For KLineCharts compatibility
}

export const generateDemoData = (): CandlestickData[] => {
  const data: CandlestickData[] = [];
  const startPrice = 100;
  const startTime = Date.now() - (250 * 24 * 60 * 60 * 1000); // 250 days ago
  
  let currentPrice = startPrice;
  
  for (let i = 0; i < 250; i++) {
    const timestamp = startTime + (i * 24 * 60 * 60 * 1000);
    
    // Generate realistic price movement
    const volatility = 0.02; // 2% daily volatility
    const trend = Math.sin(i * 0.02) * 0.001; // Slight sinusoidal trend
    const randomWalk = (Math.random() - 0.5) * volatility;
    
    const priceChange = (trend + randomWalk) * currentPrice;
    const open = currentPrice;
    
    // Generate high, low, close with some randomness
    const range = Math.abs(priceChange) * (1 + Math.random());
    const high = Math.max(open, open + priceChange) + (Math.random() * range * 0.5);
    const low = Math.min(open, open + priceChange) - (Math.random() * range * 0.5);
    const close = open + priceChange + (Math.random() - 0.5) * range * 0.3;
    
    // Generate volume (higher volume on larger price moves)
    const baseVolume = 1000000;
    const volumeMultiplier = 1 + Math.abs(priceChange / currentPrice) * 10;
    const volume = Math.floor(baseVolume * volumeMultiplier * (0.5 + Math.random()));
    
    data.push({
      timestamp,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume
    });
    
    currentPrice = close;
  }
  
  return data;
};