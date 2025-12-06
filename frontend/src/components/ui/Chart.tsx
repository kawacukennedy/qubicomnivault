import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';

interface ChartProps {
  type: 'line' | 'area' | 'bar' | 'pie' | 'candlestick';
  data: any[];
  dataKey: string;
  xAxisKey?: string;
  height?: number;
  className?: string;
}

const Chart: React.FC<ChartProps> = ({
  type,
  data,
  dataKey,
  xAxisKey = 'name',
  height = 300,
  className,
}) => {
  const commonProps = {
    data,
    margin: { top: 5, right: 30, left: 20, bottom: 5 },
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip
              formatter={(value: any) => [value.toLocaleString(), dataKey]}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#229FFF"
              strokeWidth={2}
              dot={{ fill: '#229FFF' }}
            />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip
              formatter={(value: any) => [value.toLocaleString(), dataKey]}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke="#229FFF"
              fill="#EAF6FF"
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip
              formatter={(value: any) => [value.toLocaleString(), dataKey]}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Bar dataKey={dataKey} fill="#229FFF" />
          </BarChart>
        );
      case 'pie':
        const COLORS = ['#229FFF', '#FF3B3B', '#2AB94B', '#FFA800', '#A05EFF'];
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      case 'candlestick':
        // For candlestick, use ComposedChart with bars for high/low and lines for open/close
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip
              formatter={(value: any, name: string) => [
                value.toLocaleString(),
                name,
              ]}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Bar dataKey="high" fill="#2AB94B" />
            <Bar dataKey="low" fill="#FF3B3B" />
            <Line
              type="monotone"
              dataKey="open"
              stroke="#FFA800"
              strokeWidth={1}
            />
            <Line
              type="monotone"
              dataKey="close"
              stroke="#A05EFF"
              strokeWidth={1}
            />
          </ComposedChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export { Chart };