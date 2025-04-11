import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
  TooltipProps
} from 'recharts';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Initialize dayjs plugins
dayjs.extend(customParseFormat);

// Date formatting function
const formatDate = (dateString: string) => {
  return dayjs(dateString).format('MMM D, YYYY');
};

interface HistoricalDataPoint {
  'Civil ID': string;
  'Disability Description': string;
  'Disability Type': string;
  'Date Submitted': string;
}

interface ForecastDataPoint {
  ds: string;
  yhat: number;
  yhat_lower: number;
  yhat_upper: number;
}

interface ChartDataPoint {
  date: string;
  formattedDate: string;
  count?: number;
  yhat?: number;
  yhat_lower?: number;
  yhat_upper?: number;
}

interface DisabilityForecastChartProps {
  historicalData: HistoricalDataPoint[];
  forecastData: ForecastDataPoint[];
}

export function DisabilityForecastChart({ 
  historicalData, 
  forecastData 
}: DisabilityForecastChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [todayDate, setTodayDate] = useState<string>('');

  useEffect(() => {
    // Process the input data and prepare it for the chart
    const processData = () => {
      const processedData: ChartDataPoint[] = [];
      
      // Process historical data - count applications by date
      const historicalCountsByDate = new Map<string, number>();
      
      historicalData.forEach(item => {
        const date = item['Date Submitted'];
        historicalCountsByDate.set(date, (historicalCountsByDate.get(date) || 0) + 1);
      });
      
      // Convert the map to array of chart data points
      Array.from(historicalCountsByDate.entries())
        .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
        .forEach(([date, count]) => {
          processedData.push({
            date,
            formattedDate: formatDate(date),
            count
          });
        });
      
      // Process forecast data
      forecastData.forEach(item => {
        processedData.push({
          date: item.ds,
          formattedDate: formatDate(item.ds),
          yhat: item.yhat,
          yhat_lower: item.yhat_lower,
          yhat_upper: item.yhat_upper
        });
      });

      // Sort by date
      processedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      return processedData;
    };
    
    // Set today's date for the reference line
    setTodayDate(dayjs().format('YYYY-MM-DD'));
    
    // Process and set chart data
    setChartData(processData());
  }, [historicalData, forecastData]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as ChartDataPoint;
      
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-bold">{`Date: ${dataPoint.formattedDate}`}</p>
          
          {dataPoint.count !== undefined ? (
            <p>{`Actual Cases: ${dataPoint.count}`}</p>
          ) : (
            <>
              <p>{`Forecast: ${dataPoint.yhat?.toFixed(2)}`}</p>
              <p>{`Lower Bound: ${dataPoint.yhat_lower?.toFixed(2)}`}</p>
              <p>{`Upper Bound: ${dataPoint.yhat_upper?.toFixed(2)}`}</p>
            </>
          )}
        </div>
      );
    }
    
    return null;
  };

  const dateTickFormatter = (value: string) => {
    return dayjs(value).format('MMM D');
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Disability Applications: Historical and Forecast</h2>
      <div className="h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 50,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12 }}
              tickFormatter={dateTickFormatter}
              interval="preserveStartEnd"
              minTickGap={30}
            />
            <YAxis 
              label={{ value: 'Number of Cases', angle: -90, position: 'insideLeft' }}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            
            {/* Present day reference line */}
            <ReferenceLine
              x={todayDate}
              stroke="#ff0000"
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{
                value: "Today",
                position: "top",
                fill: "#ff0000",
                fontSize: 12
              }}
            />

            {/* Historical data */}
            <Line
              type="monotone"
              dataKey="count"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
              name="Historical Cases"
              connectNulls
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />

            {/* Forecast data */}
            <Line
              type="monotone"
              dataKey="yhat"
              stroke="#059669"
              strokeWidth={2}
              dot={{ r: 1 }}
              name="Forecast"
              connectNulls
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-in-out"
              animationBegin={300}
            />
            
            {/* Forecast bounds as area */}
            <Area
              type="monotone"
              dataKey="yhat_upper"
              stroke="none"
              fill="#10b981"
              fillOpacity={0.2}
              name="Upper Bound"
              isAnimationActive={true}
              animationDuration={1000}
            />
            <Area
              type="monotone"
              dataKey="yhat_lower"
              stroke="none"
              fill="#10b981"
              fillOpacity={0.2}
              name="Lower Bound"
              isAnimationActive={true}
              animationDuration={1000}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div>
          <span>Historical Data</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-emerald-600 rounded-full mr-2"></div>
          <span>Forecast</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-emerald-200 rounded mr-2"></div>
          <span>Forecast Range (Lower/Upper Bounds)</span>
        </div>
      </div>
    </div>
  );
} 