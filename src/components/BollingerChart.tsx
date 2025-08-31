import React, { useEffect, useRef, useState } from 'react';
import { init, dispose, Chart } from 'klinecharts';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { BollingerSettings } from './BollingerSettings';
import { generateDemoData } from '@/lib/demoData';
import { BollingerBandsCalculator } from '@/lib/bollingerBands';

export interface BollingerConfig {
  length: number;
  maType: 'SMA';
  source: 'close';
  stdDev: number;
  offset: number;
  style: {
    basis: {
      visible: boolean;
      color: string;
      lineWidth: number;
      lineStyle: 'solid' | 'dashed';
    };
    upper: {
      visible: boolean;
      color: string;
      lineWidth: number;
      lineStyle: 'solid' | 'dashed';
    };
    lower: {
      visible: boolean;
      color: string;
      lineWidth: number;
      lineStyle: 'solid' | 'dashed';
    };
    fill: {
      visible: boolean;
      opacity: number;
    };
  };
}

const defaultConfig: BollingerConfig = {
  length: 20,
  maType: 'SMA',
  source: 'close',
  stdDev: 2,
  offset: 0,
  style: {
    basis: {
      visible: true,
      color: '#3b82f6',
      lineWidth: 2,
      lineStyle: 'solid'
    },
    upper: {
      visible: true,
      color: '#22c55e',
      lineWidth: 1,
      lineStyle: 'solid'
    },
    lower: {
      visible: true,
      color: '#ef4444',
      lineWidth: 1,
      lineStyle: 'solid'
    },
    fill: {
      visible: true,
      opacity: 0.1
    }
  }
};

export const BollingerChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const klineChart = useRef<Chart | null>(null);
  const [config, setConfig] = useState<BollingerConfig>(defaultConfig);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [indicatorAdded, setIndicatorAdded] = useState(false);

  useEffect(() => {
    if (chartRef.current) {
      // Initialize chart
      klineChart.current = init(chartRef.current);
      
      // Configure chart appearance with demo data
      const demoData = generateDemoData();
      klineChart.current?.applyNewData(demoData);

      return () => {
        if (klineChart.current) {
          dispose(chartRef.current!);
          klineChart.current = null;
        }
      };
    }
  }, []);

  const addBollingerBands = () => {
    if (!klineChart.current || indicatorAdded) return;

    // Create a custom Bollinger Bands indicator
    const bollResult = klineChart.current.createIndicator('BOLL', false);
    
    if (bollResult) {
      setIndicatorAdded(true);
    }
  };

  const updateBollingerBands = (newConfig: BollingerConfig) => {
    setConfig(newConfig);
    
    if (klineChart.current && indicatorAdded) {
      // Remove existing indicator
      klineChart.current.removeIndicator({ name: 'BOLL' });
      setIndicatorAdded(false);
      
      // Add updated indicator
      setTimeout(() => {
        addBollingerBands();
      }, 100);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-foreground">FindScan - Bollinger Bands</h1>
          {!indicatorAdded && (
            <Button
              onClick={addBollingerBands}
              variant="default"
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              Add Bollinger Bands
            </Button>
          )}
        </div>
        
        {indicatorAdded && (
          <Button
            onClick={() => setSettingsOpen(true)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        )}
      </div>

      {/* Chart */}
      <div className="flex-1 relative">
        <div 
          ref={chartRef} 
          className="w-full h-full"
          style={{ 
            background: 'hsl(var(--chart-background))'
          }}
        />
      </div>

      {/* Settings Modal */}
      {settingsOpen && (
        <BollingerSettings
          config={config}
          onConfigChange={updateBollingerBands}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
};