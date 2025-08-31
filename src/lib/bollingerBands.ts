import { CandlestickData } from './demoData';
import { BollingerConfig } from '@/components/BollingerChart';

export interface BollingerBandResult {
  timestamp: number;
  basis: number;
  upper: number;
  lower: number;
}

export class BollingerBandsCalculator {
  private config: BollingerConfig;

  constructor(config: BollingerConfig) {
    this.config = config;
  }

  /**
   * Calculate Simple Moving Average
   */
  private calculateSMA(values: number[], period: number): number[] {
    const sma: number[] = [];
    
    for (let i = 0; i < values.length; i++) {
      if (i < period - 1) {
        sma.push(NaN);
      } else {
        const sum = values.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        sma.push(sum / period);
      }
    }
    
    return sma;
  }

  /**
   * Calculate Standard Deviation (sample standard deviation)
   */
  private calculateStandardDeviation(values: number[], period: number, smaValues: number[]): number[] {
    const stdDev: number[] = [];
    
    for (let i = 0; i < values.length; i++) {
      if (i < period - 1 || isNaN(smaValues[i])) {
        stdDev.push(NaN);
      } else {
        const subset = values.slice(i - period + 1, i + 1);
        const mean = smaValues[i];
        const squaredDifferences = subset.map(value => Math.pow(value - mean, 2));
        const variance = squaredDifferences.reduce((a, b) => a + b, 0) / (period - 1); // Sample std dev
        stdDev.push(Math.sqrt(variance));
      }
    }
    
    return stdDev;
  }

  /**
   * Apply offset to the bands
   */
  private applyOffset(values: number[], offset: number): number[] {
    if (offset === 0) return values;
    
    const result = new Array(values.length).fill(NaN);
    
    if (offset > 0) {
      // Shift forward (positive offset)
      for (let i = offset; i < values.length; i++) {
        result[i] = values[i - offset];
      }
    } else {
      // Shift backward (negative offset)
      for (let i = 0; i < values.length + offset; i++) {
        result[i] = values[i - offset];
      }
    }
    
    return result;
  }

  /**
   * Calculate Bollinger Bands
   */
  calculate(data: CandlestickData[]): BollingerBandResult[] {
    if (data.length < this.config.length) {
      return [];
    }

    // Extract source values (close prices)
    const sourceValues = data.map(candle => candle.close);
    
    // Calculate Simple Moving Average (basis line)
    const smaValues = this.calculateSMA(sourceValues, this.config.length);
    
    // Calculate Standard Deviation
    const stdDevValues = this.calculateStandardDeviation(sourceValues, this.config.length, smaValues);
    
    // Calculate upper and lower bands
    const upperBands = smaValues.map((sma, i) => 
      isNaN(sma) || isNaN(stdDevValues[i]) 
        ? NaN 
        : sma + (this.config.stdDev * stdDevValues[i])
    );
    
    const lowerBands = smaValues.map((sma, i) => 
      isNaN(sma) || isNaN(stdDevValues[i]) 
        ? NaN 
        : sma - (this.config.stdDev * stdDevValues[i])
    );
    
    // Apply offset if configured
    const offsetBasis = this.applyOffset(smaValues, this.config.offset);
    const offsetUpper = this.applyOffset(upperBands, this.config.offset);
    const offsetLower = this.applyOffset(lowerBands, this.config.offset);
    
    // Combine results
    const results: BollingerBandResult[] = [];
    
    for (let i = 0; i < data.length; i++) {
      if (!isNaN(offsetBasis[i]) && !isNaN(offsetUpper[i]) && !isNaN(offsetLower[i])) {
        results.push({
          timestamp: data[i].timestamp,
          basis: Number(offsetBasis[i].toFixed(4)),
          upper: Number(offsetUpper[i].toFixed(4)),
          lower: Number(offsetLower[i].toFixed(4))
        });
      }
    }
    
    return results;
  }

  /**
   * Get the latest Bollinger Band values for a given timestamp
   */
  getValuesAtTimestamp(data: CandlestickData[], timestamp: number): BollingerBandResult | null {
    const results = this.calculate(data);
    return results.find(result => result.timestamp === timestamp) || null;
  }
}