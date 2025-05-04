'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface StockChartProps {
  symbol: string;
  data: {
    date: string;
    value: number;
  }[];
  color?: string;
  height?: number;
  showControls?: boolean;
}

type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y' | 'All';

export default function StockChart({ 
  symbol, 
  data, 
  color = '#00C805',
  height = 300,
  showControls = true
}: StockChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    // Filter data based on selected time range
    const filteredData = filterDataByTimeRange(data, timeRange);
    setChartData(filteredData.map(item => ({
      x: new Date(item.date).getTime(),
      y: item.value
    })));
  }, [data, timeRange]);

  // Function to filter data based on time range
  const filterDataByTimeRange = (data: any[], range: TimeRange) => {
    const now = new Date();
    let startDate = new Date();
    
    switch (range) {
      case '1D':
        startDate.setDate(now.getDate() - 1);
        break;
      case '1W':
        startDate.setDate(now.getDate() - 7);
        break;
      case '1M':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '1Y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'All':
        return data;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }
    
    return data.filter(item => new Date(item.date) >= startDate);
  };

  // Calculate price change
  const calculateChange = () => {
    if (chartData.length < 2) return { value: 0, percent: 0 };
    
    const firstValue = chartData[0].y;
    const lastValue = chartData[chartData.length - 1].y;
    const change = lastValue - firstValue;
    const percentChange = (change / firstValue) * 100;
    
    return {
      value: change,
      percent: percentChange
    };
  };

  const change = calculateChange();
  const isPositive = change.value >= 0;
  const changeColor = isPositive ? '#00C805' : '#FF5000';

  // Chart options
  const options = {
    chart: {
      type: 'area' as const,
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout' as const,
        speed: 800,
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth' as const,
      width: 2,
      colors: [changeColor]
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 100]
      },
      colors: [changeColor]
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy'
      },
      y: {
        formatter: function(value: number) {
          return `$${value.toFixed(2)}`;
        }
      }
    },
    xaxis: {
      type: 'datetime' as const,
      labels: {
        datetimeUTC: false,
        format: timeRange === '1D' ? 'HH:mm' : 'dd MMM'
      }
    },
    yaxis: {
      labels: {
        formatter: function(value: number) {
          return `$${value.toFixed(2)}`;
        }
      }
    },
    grid: {
      borderColor: '#f1f1f1'
    },
    theme: {
      mode: 'light' as const
    }
  };

  // Series data
  const series = [{
    name: symbol,
    data: chartData
  }];

  const timeRangeButtons: TimeRange[] = ['1D', '1W', '1M', '3M', '1Y', 'All'];

  return (
    <div className="chart-container">
      {showControls && (
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            {timeRangeButtons.map((range) => (
              <button
                key={range}
                className={`px-3 py-1 text-sm rounded-md ${
                  timeRange === range
                    ? 'bg-gray-200 font-medium'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
          <div className={isPositive ? 'green-text' : 'red-text'}>
            {isPositive ? '+' : ''}
            ${Math.abs(change.value).toFixed(2)} ({isPositive ? '+' : ''}
            {change.percent.toFixed(2)}%)
          </div>
        </div>
      )}
      <div id={`chart-${symbol}`}>
        {typeof window !== 'undefined' && (
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={height}
          />
        )}
      </div>
    </div>
  );
}
