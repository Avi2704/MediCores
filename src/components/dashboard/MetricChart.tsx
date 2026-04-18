'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { HealthMetric } from '@/types/health';

interface Props {
  data: HealthMetric[];
  metricKey: keyof Omit<HealthMetric, 'date'>;
  label: string;
  unit: string;
  color?: string;
  referenceMin?: number;
  referenceMax?: number;
}

export default function MetricChart({
  data,
  metricKey,
  label,
  unit,
  color = '#0EA5E9',
  referenceMin,
  referenceMax,
}: Props) {
  const chartData = data
    .filter((d) => d[metricKey] !== undefined)
    .map((d) => ({
      date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: d[metricKey],
    }));

  if (chartData.length === 0) {
    return null;
  }

  const latest = chartData[chartData.length - 1]?.value as number | undefined;
  let statusColor = 'text-green-600';
  if (latest !== undefined && referenceMax !== undefined && latest > referenceMax) {
    statusColor = 'text-amber-600';
  }
  if (latest !== undefined && referenceMin !== undefined && latest < referenceMin) {
    statusColor = 'text-amber-600';
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 text-sm">{label}</h3>
        {latest !== undefined && (
          <span className={`text-lg font-bold ${statusColor}`}>
            {latest}
            <span className="text-xs font-normal text-gray-400 ml-1">{unit}</span>
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#94A3B8' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#94A3B8' }}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: 12,
            }}
            formatter={(val) => [`${val} ${unit}`, label]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
