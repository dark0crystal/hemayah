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
  TooltipProps,
  Scatter
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

interface TestDataPoint {
  'Civil ID': string;
  'Disability Description': string;
  'Disability Type': string;
  'Date Submitted': string;
}

interface ChartDataPoint {
  date: string;
  formattedDate: string;
  count?: number;
  testCount?: number;
  anomalyCount?: number;
  yhat?: number;
  yhat_lower?: number;
  yhat_upper?: number;
  isAnomaly?: boolean;
}

interface DisabilityForecastChartProps {
  historicalData: HistoricalDataPoint[];
  forecastData: ForecastDataPoint[];
  testData?: TestDataPoint[];
}

export function DisabilityForecastChart({ 
  historicalData, 
  forecastData,
  testData = []
}: DisabilityForecastChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [todayDate, setTodayDate] = useState<string>('');
  const [anomalyPointSize, setAnomalyPointSize] = useState<number>(6);

  // Twinkling animation effect for anomaly points
  useEffect(() => {
    if (testData.length > 0) {
      const interval = setInterval(() => {
        setAnomalyPointSize(prev => prev === 6 ? 10 : 6);
      }, 600);
      
      return () => clearInterval(interval);
    }
  }, [testData]);

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
      
      // Process test data - count applications by date
      if (testData && testData.length > 0) {
        const testCountsByDate = new Map<string, number>();
        
        testData.forEach(item => {
          const date = item['Date Submitted'];
          testCountsByDate.set(date, (testCountsByDate.get(date) || 0) + 1);
        });
        
        // Add test counts to existing chart data points or create new ones
        testCountsByDate.forEach((count, date) => {
          const existingPoint = processedData.find(point => point.date === date);
          
          if (existingPoint) {
            existingPoint.testCount = count;
          } else {
            processedData.push({
              date,
              formattedDate: formatDate(date),
              testCount: count
            });
          }
        });
      }
      
      // Process forecast data
      forecastData.forEach(item => {
        const existingPoint = processedData.find(point => point.date === item.ds);
        
        if (existingPoint) {
          existingPoint.yhat = item.yhat;
          existingPoint.yhat_lower = item.yhat_lower;
          existingPoint.yhat_upper = item.yhat_upper;
        } else {
          processedData.push({
            date: item.ds,
            formattedDate: formatDate(item.ds),
            yhat: item.yhat,
            yhat_lower: item.yhat_lower,
            yhat_upper: item.yhat_upper
          });
        }
      });

      // Mark anomalies - test data exceeding upper bound
      processedData.forEach(point => {
        if (point.testCount !== undefined && point.yhat_upper !== undefined && point.testCount > point.yhat_upper) {
          point.isAnomaly = true;
          point.anomalyCount = point.testCount;
        }
      });

      // Sort by date
      processedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      return processedData;
    };
    
    // Set today's date for the reference line
    setTodayDate(dayjs().format('YYYY-MM-DD'));
    
    // Process and set chart data
    setChartData(processData());
  }, [historicalData, forecastData, testData]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as ChartDataPoint;
      
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-bold">{`Date: ${dataPoint.formattedDate}`}</p>
          
          {dataPoint.count !== undefined && (
            <p>{`Actual Cases: ${dataPoint.count}`}</p>
          )}
          
          {dataPoint.testCount !== undefined && (
            <p className={`${dataPoint.isAnomaly ? 'text-red-600 font-bold' : 'text-purple-600'}`}>
              {`Test Cases: ${dataPoint.testCount}`}
              {dataPoint.isAnomaly && ' ⚠️ ANOMALY'}
            </p>
          )}
          
          {dataPoint.yhat !== undefined && (
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
      <h2 className="text-xl font-bold mb-4">البيانات التاريخية والتنبؤية</h2>
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
            {/* <ReferenceLine
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
            /> */}

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
            
            {/* Test data */}
            {testData && testData.length > 0 && (
              <Line
                type="monotone"
                dataKey="testCount"
                stroke="#9333ea"
                strokeWidth={3}
                dot={{ r: 5, fill: "#9333ea", strokeWidth: 2, stroke: "#ffffff" }}
                activeDot={{ r: 8, fill: "#9333ea", strokeWidth: 2, stroke: "#ffffff" }}
                name="Test Cases"
                connectNulls
                isAnimationActive={true}
                animationDuration={1500}
                animationEasing="ease-in-out"
                strokeDasharray="5 5"
              />
            )}
            
            {/* Anomaly points with twinkling effect */}
            {testData && testData.length > 0 && (
              <Scatter
                dataKey="anomalyCount"
                fill="#ff0000"
                name="Anomalies"
                shape={({ cx, cy }) => (
                  <svg>
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r={anomalyPointSize} 
                      fill="#ff0000" 
                      stroke="#ffffff" 
                      strokeWidth={2} 
                    />
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r={anomalyPointSize + 4} 
                      fill="none" 
                      stroke="#ff0000" 
                      strokeWidth={1.5} 
                      strokeDasharray="4 4"
                      opacity={0.6}
                    />
                  </svg>
                )}
              />
            )}

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
      <div className="mt-4 flex items-center justify-center gap-6 flex-wrap">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div>
          <span>Historical Data</span>
        </div>
        {testData && testData.length > 0 && (
          <>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-purple-600 rounded-full mr-2"></div>
              <span>Test Data</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-600 rounded-full mr-2 animate-pulse"></div>
              <span className="font-semibold text-red-600">Anomalies (exceeding forecast)</span>
            </div>
          </>
        )}
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