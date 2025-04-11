'use client';

import { useState, useEffect } from 'react';
import { DisabilityForecastChart } from '@/app/components/charts/DisabilityForecastChart';

export default function AnalysisPage() {
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [testData, setTestData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [anomalyDates, setAnomalyDates] = useState<string[]>(["2025-03-15"]);
  const [anomalyCount, setAnomalyCount] = useState<number>(0);
  const [anomalyDetails, setAnomalyDetails] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Load pre-processed data directly from JSON files
        const trainingData = await fetch('/backend/training_cases.json').then(res => res.json());
        const actualTestData = await fetch('/backend/test_cases.json').then(res => res.json());
        
        // Set the data states
        setHistoricalData(trainingData);
        setForecastData(SAMPLE_FORECAST_DATA);
        setTestData(actualTestData);
        
        // Analyze test data for anomalies
        analyzeTestDataForAnomalies(actualTestData, SAMPLE_FORECAST_DATA);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to sample data
        setHistoricalData(SAMPLE_HISTORICAL_DATA);
        setForecastData(SAMPLE_FORECAST_DATA);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Function to analyze test data for anomalies
  const analyzeTestDataForAnomalies = (testCases: any[], forecastData: any[]) => {
    // Count how many cases we have on March 15
    const march15Cases = testCases.filter(item => item["Date Submitted"] === "2025-03-15").length;
    
    // Find the forecast for March 15 in our forecast data
    const march15Forecast = forecastData.find(item => item.ds === "2025-03-15");
    
    if (march15Forecast) {
      const { yhat, yhat_upper } = march15Forecast;
      
      let anomalyMessage = "";
      
      if (march15Cases > yhat_upper) {
        anomalyMessage = `The actual case count (${march15Cases}) on March 15th exceeds the upper bound prediction (${yhat_upper.toFixed(2)}) by ${(march15Cases - yhat_upper).toFixed(2)} cases.`;
      } else if (march15Cases > yhat) {
        anomalyMessage = `The actual case count (${march15Cases}) on March 15th exceeds the predicted value (${yhat.toFixed(2)}) by ${(march15Cases - yhat).toFixed(2)} cases but is within the upper bound.`;
      }
      
      setAnomalyCount(march15Cases);
      setAnomalyDetails(anomalyMessage);
    }
  };

  // Function to prepare data for the chart - includes both historical and test data
  const prepareChartData = () => {
    const combinedData = {
      historicalData: historicalData,
      forecastData: forecastData,
      testData: testData
    };
    return combinedData;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Disability Applications Analysis</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-xl">Loading data...</div>
        </div>
      ) : (
        <>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <DisabilityForecastChart 
              historicalData={historicalData} 
              forecastData={forecastData} 
              testData={testData}
            />
          </div>
          
          {anomalyDates.length > 0 && (
            <div className="mt-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <p className="font-bold">Anomaly Detected!</p>
              <p>Unusual number of applications detected on: {anomalyDates.join(', ')}</p>
              {anomalyDetails && (
                <p className="mt-2">{anomalyDetails}</p>
              )}
            </div>
          )}
        </>
      )}
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">About the Forecast</h2>
          <p className="mb-2">
            This chart shows historical disability applications data along with forecasted future trends.
          </p>
          <p className="mb-2">
            <span className="font-semibold">Forecast (yhat):</span> The predicted number of disability applications.
          </p>
          <p className="mb-2">
            <span className="font-semibold">Upper Bound (yhat_upper):</span> The upper range of the prediction interval.
          </p>
          <p>
            <span className="font-semibold">Lower Bound (yhat_lower):</span> The lower range of the prediction interval.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Data Collection</h2>
          <p className="mb-2">
            The historical data is collected from the Ministry of Health and includes disability applications from January to February 2025.
          </p>
          <p className="mb-2">
            The forecast is generated using a time series prediction model trained on the historical data.
          </p>
          <p>
            The prediction model identifies patterns in past applications and projects future trends while accounting for uncertainty.
          </p>
          {anomalyDates.length > 0 && (
            <p className="mt-2 text-yellow-600">
              The system has detected an unusual spike in applications on March 15th that falls outside the expected range. 
              {anomalyCount > 0 && ` A total of ${anomalyCount} cases were submitted on this date.`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Sample data as fallback in case the JSON files can't be loaded
const SAMPLE_HISTORICAL_DATA = [
  // ... existing code ...
];

// Full dataset of sample forecast data (already processed)
const SAMPLE_FORECAST_DATA = [
  // ... existing code ...
]; 