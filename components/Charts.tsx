'use client';

import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { ChartConfig, ChartDataPoint } from '@/lib/chart-generator';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartComponentProps {
  config: ChartConfig;
  height?: number;
}

export function ChartComponent({ config, height = 300 }: ChartComponentProps) {
  // Type guard to check if data is ChartDataPoint[]
  const isChartDataPoint = (data: any): data is ChartDataPoint[] => {
    return data.length > 0 && 'label' in data[0];
  };

  const chartData = config.data as ChartDataPoint[];
  
  const data = {
    labels: chartData.map((d) => d.label),
    datasets: [
      {
        label: config.title,
        data: chartData.map((d) => d.value),
        backgroundColor: config.colors || [
          '#3B82F6',
          '#8B5CF6',
          '#EC4899',
          '#10B981',
          '#F59E0B',
          '#EF4444',
        ],
        borderColor: config.type === 'line' ? config.colors?.[0] || '#3B82F6' : 'transparent',
        borderWidth: config.type === 'line' ? 2 : 0,
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: config.showLegend !== false,
        position: 'bottom',
        labels: {
          font: {
            family: 'Inter, sans-serif',
            size: 12,
          },
          padding: 15,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: '600',
        },
        bodyFont: {
          size: 12,
        },
        cornerRadius: 8,
      },
    },
    scales:
      config.type !== 'doughnut' && config.type !== 'pie'
        ? {
            y: {
              beginAtZero: true,
              ticks: {
                font: {
                  size: 11,
                },
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.05)',
              },
            },
            x: {
              ticks: {
                font: {
                  size: 11,
                },
              },
              grid: {
                display: false,
              },
            },
          }
        : undefined,
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{config.title}</h3>
      <div style={{ height: `${height}px` }}>
        {config.type === 'bar' && <Bar data={data} options={options} />}
        {config.type === 'line' && <Line data={data} options={options} />}
        {(config.type === 'doughnut' || config.type === 'pie') && (
          <Doughnut data={data} options={options} />
        )}
      </div>
    </div>
  );
}

// Progress Card Component
interface ProgressCardProps {
  label: string;
  value: number;
  total: number;
  color: string;
  icon?: string;
}

export function ProgressCard({ label, value, total, color, icon }: ProgressCardProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon && <span className="text-2xl">{icon}</span>}
          <h3 className="text-sm font-medium text-gray-600">{label}</h3>
        </div>
        <span className="text-2xl font-bold" style={{ color }}>
          {value}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
      
      <p className="text-xs text-gray-500">
        {percentage}% of total ({value}/{total})
      </p>
    </div>
  );
}

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = '#3B82F6',
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold" style={{ color }}>
            {value}
          </p>
        </div>
        {icon && (
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${color}20` }}
          >
            {icon}
          </div>
        )}
      </div>
      
      {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
      
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          <span className={trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}>
            {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-gray-500">vs last period</span>
        </div>
      )}
    </div>
  );
}

// Chart Grid Component
interface ChartGridProps {
  charts: ChartConfig[];
}

export function ChartGrid({ charts }: ChartGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {charts.map((chart, index) => (
        <ChartComponent key={index} config={chart} />
      ))}
    </div>
  );
}
