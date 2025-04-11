'use client';

import { useState, useEffect } from 'react';
import { DisabilityForecastChart } from '@/app/components/charts/DisabilityForecastChart';

export default function AnalysisPage() {
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [anomalyDates, setAnomalyDates] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      
      try {
        // First, train model and get forecast data
        const trainResponse = await fetchForecastData();
        if (trainResponse) {
          setForecastData(trainResponse);
        }
        
        // Use hard-coded historical data
        setHistoricalData(SAMPLE_HISTORICAL_DATA);
        
        // Optionally check for anomalies in test data
        const testResponse = await checkForAnomalies();
        if (testResponse?.anomaly_periods) {
          setAnomalyDates(testResponse.anomaly_periods);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('Failed to fetch data. Using sample data instead.');
        // Fallback to sample data
        setHistoricalData(SAMPLE_HISTORICAL_DATA);
        setForecastData(SAMPLE_FORECAST_DATA);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchForecastData = async () => {
    try {
      // Prepare training data for upload
      const formData = new FormData();
      const trainingBlob = new Blob([JSON.stringify(SAMPLE_HISTORICAL_DATA)], {
        type: 'application/json'
      });
      formData.append('training_file', trainingBlob, 'training_data.json');

      // Make API call to forecast endpoint
      const response = await fetch('http://localhost:8000/forecast', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      throw error;
    }
  };

  const checkForAnomalies = async () => {
    try {
      // Prepare test data for upload (use the March 15 data that has potential anomalies)
      const formData = new FormData();
      const testBlob = new Blob([JSON.stringify(TEST_DATA)], {
        type: 'application/json'
      });
      formData.append('test_file', testBlob, 'test_data.json');

      // Make API call to check endpoint
      const response = await fetch('http://localhost:8000/check', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking for anomalies:', error);
      // Just log error but don't throw - this is optional functionality
      return null;
    }
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
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errorMessage}
            </div>
          )}
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <DisabilityForecastChart 
              historicalData={historicalData} 
              forecastData={forecastData} 
            />
          </div>
          
          {anomalyDates.length > 0 && (
            <div className="mt-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <p className="font-bold">Anomaly Detected!</p>
              <p>Unusual number of applications detected on: {anomalyDates.join(', ')}</p>
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
              The system has detected an unusual spike in applications that falls outside the expected range.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Full dataset of sample historical data from the Ministry
const SAMPLE_HISTORICAL_DATA = [
  {
    "Civil ID": "10000001",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-17"
  },
  {
    "Civil ID": "10000002",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-15"
  },
  {
    "Civil ID": "10000003",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-04"
  },
  {
    "Civil ID": "10000004",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-10"
  },
  {
    "Civil ID": "10000005",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-17"
  },
  {
    "Civil ID": "10000006",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-11"
  },
  {
    "Civil ID": "10000007",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-18"
  },
  {
    "Civil ID": "10000008",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-28"
  },
  {
    "Civil ID": "10000009",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-21"
  },
  {
    "Civil ID": "10000010",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-24"
  },
  {
    "Civil ID": "10000011",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-15"
  },
  {
    "Civil ID": "10000012",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-11"
  },
  {
    "Civil ID": "10000013",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-13"
  },
  {
    "Civil ID": "10000014",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-24"
  },
  {
    "Civil ID": "10000015",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-28"
  },
  {
    "Civil ID": "10000016",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-07"
  },
  {
    "Civil ID": "10000017",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-08"
  },
  {
    "Civil ID": "10000018",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-26"
  },
  {
    "Civil ID": "10000019",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-05"
  },
  {
    "Civil ID": "10000020",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-16"
  },
  {
    "Civil ID": "10000021",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-06"
  },
  {
    "Civil ID": "10000022",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-07"
  },
  {
    "Civil ID": "10000023",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-05"
  },
  {
    "Civil ID": "10000024",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-24"
  },
  {
    "Civil ID": "10000025",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-11"
  },
  {
    "Civil ID": "10000026",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-27"
  },
  {
    "Civil ID": "10000027",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-31"
  },
  {
    "Civil ID": "10000028",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-29"
  },
  {
    "Civil ID": "10000029",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-28"
  },
  {
    "Civil ID": "10000030",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-27"
  },
  {
    "Civil ID": "10000031",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-13"
  },
  {
    "Civil ID": "10000032",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-05"
  },
  {
    "Civil ID": "10000033",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-02"
  },
  {
    "Civil ID": "10000034",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-03"
  },
  {
    "Civil ID": "10000035",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-25"
  },
  {
    "Civil ID": "10000036",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-15"
  },
  {
    "Civil ID": "10000037",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-25"
  },
  {
    "Civil ID": "10000038",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-12"
  },
  {
    "Civil ID": "10000039",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-18"
  },
  {
    "Civil ID": "10000040",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-12"
  },
  {
    "Civil ID": "10000041",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-11"
  },
  {
    "Civil ID": "10000042",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-21"
  },
  {
    "Civil ID": "10000043",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-01"
  },
  {
    "Civil ID": "10000044",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-13"
  },
  {
    "Civil ID": "10000045",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-12"
  },
  {
    "Civil ID": "10000046",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-14"
  },
  {
    "Civil ID": "10000047",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-27"
  },
  {
    "Civil ID": "10000048",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-03"
  },
  {
    "Civil ID": "10000049",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-25"
  },
  {
    "Civil ID": "10000050",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-20"
  },
  {
    "Civil ID": "10000051",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-03"
  },
  {
    "Civil ID": "10000052",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-11"
  },
  {
    "Civil ID": "10000053",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-20"
  },
  {
    "Civil ID": "10000054",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-04"
  },
  {
    "Civil ID": "10000055",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-10"
  },
  {
    "Civil ID": "10000056",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-28"
  },
  {
    "Civil ID": "10000057",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-16"
  },
  {
    "Civil ID": "10000058",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-20"
  },
  {
    "Civil ID": "10000059",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-14"
  },
  {
    "Civil ID": "10000060",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-12"
  },
  {
    "Civil ID": "10000061",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-31"
  },
  {
    "Civil ID": "10000062",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-26"
  },
  {
    "Civil ID": "10000063",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-14"
  },
  {
    "Civil ID": "10000064",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-15"
  },
  {
    "Civil ID": "10000065",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-14"
  },
  {
    "Civil ID": "10000066",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-19"
  },
  {
    "Civil ID": "10000067",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-25"
  },
  {
    "Civil ID": "10000068",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-10"
  },
  {
    "Civil ID": "10000069",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-06"
  },
  {
    "Civil ID": "10000070",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-09"
  },
  {
    "Civil ID": "10000071",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-10"
  },
  {
    "Civil ID": "10000072",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-04"
  },
  {
    "Civil ID": "10000073",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-08"
  },
  {
    "Civil ID": "10000074",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-21"
  },
  {
    "Civil ID": "10000075",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-17"
  },
  {
    "Civil ID": "10000076",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-09"
  },
  {
    "Civil ID": "10000077",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-15"
  },
  {
    "Civil ID": "10000078",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-02"
  },
  {
    "Civil ID": "10000079",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-26"
  },
  {
    "Civil ID": "10000080",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-26"
  },
  {
    "Civil ID": "10000081",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-07"
  },
  {
    "Civil ID": "10000082",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-10"
  },
  {
    "Civil ID": "10000083",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-25"
  },
  {
    "Civil ID": "10000084",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-11"
  },
  {
    "Civil ID": "10000085",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-05"
  },
  {
    "Civil ID": "10000086",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-20"
  },
  {
    "Civil ID": "10000087",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-01"
  },
  {
    "Civil ID": "10000088",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-20"
  },
  {
    "Civil ID": "10000089",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-01"
  },
  {
    "Civil ID": "10000090",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-17"
  },
  {
    "Civil ID": "10000091",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-28"
  },
  {
    "Civil ID": "10000092",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-25"
  },
  {
    "Civil ID": "10000093",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-01"
  },
  {
    "Civil ID": "10000094",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-06"
  },
  {
    "Civil ID": "10000095",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-09"
  },
  {
    "Civil ID": "10000096",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-12"
  },
  {
    "Civil ID": "10000097",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-22"
  },
  {
    "Civil ID": "10000098",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-04"
  },
  {
    "Civil ID": "10000099",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-11"
  },
  {
    "Civil ID": "10000100",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-28"
  },
  {
    "Civil ID": "10000101",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-20"
  },
  {
    "Civil ID": "10000102",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-21"
  },
  {
    "Civil ID": "10000103",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-06"
  },
  {
    "Civil ID": "10000104",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-18"
  },
  {
    "Civil ID": "10000105",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-24"
  },
  {
    "Civil ID": "10000106",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-14"
  },
  {
    "Civil ID": "10000107",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-17"
  },
  {
    "Civil ID": "10000108",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-01"
  },
  {
    "Civil ID": "10000109",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-18"
  },
  {
    "Civil ID": "10000110",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-18"
  },
  {
    "Civil ID": "10000111",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-20"
  },
  {
    "Civil ID": "10000112",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-19"
  },
  {
    "Civil ID": "10000113",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-04"
  },
  {
    "Civil ID": "10000114",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-16"
  },
  {
    "Civil ID": "10000115",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-30"
  },
  {
    "Civil ID": "10000116",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-11"
  },
  {
    "Civil ID": "10000117",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-20"
  },
  {
    "Civil ID": "10000118",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-12"
  },
  {
    "Civil ID": "10000119",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-26"
  },
  {
    "Civil ID": "10000120",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-16"
  },
  {
    "Civil ID": "10000121",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-04"
  },
  {
    "Civil ID": "10000122",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-28"
  },
  {
    "Civil ID": "10000123",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-13"
  },
  {
    "Civil ID": "10000124",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-14"
  },
  {
    "Civil ID": "10000125",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-16"
  },
  {
    "Civil ID": "10000126",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-23"
  },
  {
    "Civil ID": "10000127",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-05"
  },
  {
    "Civil ID": "10000128",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-12"
  },
  {
    "Civil ID": "10000129",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-12"
  },
  {
    "Civil ID": "10000130",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-08"
  },
  {
    "Civil ID": "10000131",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-11"
  },
  {
    "Civil ID": "10000132",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-05"
  },
  {
    "Civil ID": "10000133",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-22"
  },
  {
    "Civil ID": "10000134",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-27"
  },
  {
    "Civil ID": "10000135",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-18"
  },
  {
    "Civil ID": "10000136",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-23"
  },
  {
    "Civil ID": "10000137",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-05"
  },
  {
    "Civil ID": "10000138",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-19"
  },
  {
    "Civil ID": "10000139",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-22"
  },
  {
    "Civil ID": "10000140",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-05"
  },
  {
    "Civil ID": "10000141",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-18"
  },
  {
    "Civil ID": "10000142",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-23"
  },
  {
    "Civil ID": "10000143",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-18"
  },
  {
    "Civil ID": "10000144",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-02"
  },
  {
    "Civil ID": "10000145",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-07"
  },
  {
    "Civil ID": "10000146",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-23"
  },
  {
    "Civil ID": "10000147",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-17"
  },
  {
    "Civil ID": "10000148",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-28"
  },
  {
    "Civil ID": "10000149",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-16"
  },
  {
    "Civil ID": "10000150",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-14"
  },
  {
    "Civil ID": "10000151",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-02"
  },
  {
    "Civil ID": "10000152",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-19"
  },
  {
    "Civil ID": "10000153",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-26"
  },
  {
    "Civil ID": "10000154",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-05"
  },
  {
    "Civil ID": "10000155",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-07"
  },
  {
    "Civil ID": "10000156",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-25"
  },
  {
    "Civil ID": "10000157",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-06"
  },
  {
    "Civil ID": "10000158",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-07"
  },
  {
    "Civil ID": "10000159",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-17"
  },
  {
    "Civil ID": "10000160",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-07"
  },
  {
    "Civil ID": "10000161",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-20"
  },
  {
    "Civil ID": "10000162",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-24"
  },
  {
    "Civil ID": "10000163",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-10"
  },
  {
    "Civil ID": "10000164",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-23"
  },
  {
    "Civil ID": "10000165",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-14"
  },
  {
    "Civil ID": "10000166",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-09"
  },
  {
    "Civil ID": "10000167",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-30"
  },
  {
    "Civil ID": "10000168",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-05"
  },
  {
    "Civil ID": "10000169",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-02"
  },
  {
    "Civil ID": "10000170",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-03"
  },
  {
    "Civil ID": "10000171",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-14"
  },
  {
    "Civil ID": "10000172",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-07"
  },
  {
    "Civil ID": "10000173",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-25"
  },
  {
    "Civil ID": "10000174",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-06"
  },
  {
    "Civil ID": "10000175",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-01"
  },
  {
    "Civil ID": "10000176",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-02"
  },
  {
    "Civil ID": "10000177",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-04"
  },
  {
    "Civil ID": "10000178",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-28"
  },
  {
    "Civil ID": "10000179",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-05"
  },
  {
    "Civil ID": "10000180",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-23"
  },
  {
    "Civil ID": "10000181",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-21"
  },
  {
    "Civil ID": "10000182",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-18"
  },
  {
    "Civil ID": "10000183",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-06"
  },
  {
    "Civil ID": "10000184",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-10"
  },
  {
    "Civil ID": "10000185",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-25"
  },
  {
    "Civil ID": "10000186",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-14"
  },
  {
    "Civil ID": "10000187",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-15"
  },
  {
    "Civil ID": "10000188",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-12"
  },
  {
    "Civil ID": "10000189",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-26"
  },
  {
    "Civil ID": "10000190",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-27"
  },
  {
    "Civil ID": "10000191",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-10"
  },
  {
    "Civil ID": "10000192",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-03-01"
  },
  {
    "Civil ID": "10000193",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-23"
  },
  {
    "Civil ID": "10000194",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-20"
  },
  {
    "Civil ID": "10000195",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-31"
  },
  {
    "Civil ID": "10000196",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-09"
  },
  {
    "Civil ID": "10000197",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-04"
  },
  {
    "Civil ID": "10000198",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-15"
  },
  {
    "Civil ID": "10000199",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-22"
  },
  {
    "Civil ID": "10000200",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-20"
  },
  {
    "Civil ID": "10000201",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-24"
  },
  {
    "Civil ID": "10000202",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-26"
  },
  {
    "Civil ID": "10000203",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-11"
  },
  {
    "Civil ID": "10000204",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-08"
  },
  {
    "Civil ID": "10000205",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-20"
  },
  {
    "Civil ID": "10000206",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-20"
  },
  {
    "Civil ID": "10000207",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-12"
  },
  {
    "Civil ID": "10000208",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-12"
  },
  {
    "Civil ID": "10000209",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-09"
  },
  {
    "Civil ID": "10000210",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-16"
  },
  {
    "Civil ID": "10000211",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-03"
  },
  {
    "Civil ID": "10000212",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-26"
  },
  {
    "Civil ID": "10000213",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-05"
  },
  {
    "Civil ID": "10000214",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-21"
  },
  {
    "Civil ID": "10000215",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-19"
  },
  {
    "Civil ID": "10000216",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-12"
  },
  {
    "Civil ID": "10000217",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-18"
  },
  {
    "Civil ID": "10000218",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-03"
  },
  {
    "Civil ID": "10000219",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-28"
  },
  {
    "Civil ID": "10000220",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-04"
  },
  {
    "Civil ID": "10000221",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-13"
  },
  {
    "Civil ID": "10000222",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-03"
  },
  {
    "Civil ID": "10000223",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-06"
  },
  {
    "Civil ID": "10000224",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-13"
  },
  {
    "Civil ID": "10000225",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-31"
  },
  {
    "Civil ID": "10000226",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-25"
  },
  {
    "Civil ID": "10000227",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-20"
  },
  {
    "Civil ID": "10000228",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-17"
  },
  {
    "Civil ID": "10000229",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-23"
  },
  {
    "Civil ID": "10000230",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-13"
  },
  {
    "Civil ID": "10000231",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-29"
  },
  {
    "Civil ID": "10000232",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-18"
  },
  {
    "Civil ID": "10000233",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-24"
  },
  {
    "Civil ID": "10000234",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-24"
  },
  {
    "Civil ID": "10000235",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-06"
  },
  {
    "Civil ID": "10000236",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-03"
  },
  {
    "Civil ID": "10000237",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-06"
  },
  {
    "Civil ID": "10000238",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-15"
  },
  {
    "Civil ID": "10000239",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-15"
  },
  {
    "Civil ID": "10000240",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-11"
  },
  {
    "Civil ID": "10000241",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-12"
  },
  {
    "Civil ID": "10000242",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-27"
  },
  {
    "Civil ID": "10000243",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-30"
  },
  {
    "Civil ID": "10000244",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-06"
  },
  {
    "Civil ID": "10000245",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-16"
  },
  {
    "Civil ID": "10000246",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-21"
  },
  {
    "Civil ID": "10000247",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-27"
  },
  {
    "Civil ID": "10000248",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-24"
  },
  {
    "Civil ID": "10000249",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-28"
  },
  {
    "Civil ID": "10000250",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-03"
  },
  {
    "Civil ID": "10000251",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-08"
  },
  {
    "Civil ID": "10000252",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-17"
  },
  {
    "Civil ID": "10000253",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-09"
  },
  {
    "Civil ID": "10000254",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-05"
  },
  {
    "Civil ID": "10000255",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-30"
  },
  {
    "Civil ID": "10000256",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-25"
  },
  {
    "Civil ID": "10000257",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-14"
  },
  {
    "Civil ID": "10000258",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-14"
  },
  {
    "Civil ID": "10000259",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-19"
  },
  {
    "Civil ID": "10000260",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-12"
  },
  {
    "Civil ID": "10000261",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-02"
  },
  {
    "Civil ID": "10000262",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-23"
  },
  {
    "Civil ID": "10000263",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-15"
  },
  {
    "Civil ID": "10000264",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-29"
  },
  {
    "Civil ID": "10000265",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-13"
  },
  {
    "Civil ID": "10000266",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-25"
  },
  {
    "Civil ID": "10000267",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-12"
  },
  {
    "Civil ID": "10000268",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-01"
  },
  {
    "Civil ID": "10000269",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-03"
  },
  {
    "Civil ID": "10000270",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-12"
  },
  {
    "Civil ID": "10000271",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-27"
  },
  {
    "Civil ID": "10000272",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-23"
  },
  {
    "Civil ID": "10000273",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-26"
  },
  {
    "Civil ID": "10000274",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-19"
  },
  {
    "Civil ID": "10000275",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-09"
  },
  {
    "Civil ID": "10000276",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-15"
  },
  {
    "Civil ID": "10000277",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-25"
  },
  {
    "Civil ID": "10000278",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-15"
  },
  {
    "Civil ID": "10000279",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-01"
  },
  {
    "Civil ID": "10000280",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-09"
  },
  {
    "Civil ID": "10000281",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-03"
  },
  {
    "Civil ID": "10000282",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-14"
  },
  {
    "Civil ID": "10000283",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-21"
  },
  {
    "Civil ID": "10000284",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-14"
  },
  {
    "Civil ID": "10000285",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-19"
  },
  {
    "Civil ID": "10000286",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-02"
  },
  {
    "Civil ID": "10000287",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-31"
  },
  {
    "Civil ID": "10000288",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-22"
  },
  {
    "Civil ID": "10000289",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-07"
  },
  {
    "Civil ID": "10000290",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-08"
  },
  {
    "Civil ID": "10000291",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-29"
  },
  {
    "Civil ID": "10000292",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-07"
  },
  {
    "Civil ID": "10000293",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-03"
  },
  {
    "Civil ID": "10000294",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-14"
  },
  {
    "Civil ID": "10000295",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-20"
  },
  {
    "Civil ID": "10000296",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-14"
  },
  {
    "Civil ID": "10000297",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-21"
  },
  {
    "Civil ID": "10000298",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-23"
  },
  {
    "Civil ID": "10000299",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-09"
  },
  {
    "Civil ID": "10000300",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-02"
  },
  {
    "Civil ID": "10000301",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-31"
  },
  {
    "Civil ID": "10000302",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-12"
  },
  {
    "Civil ID": "10000303",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-12"
  },
  {
    "Civil ID": "10000304",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-20"
  },
  {
    "Civil ID": "10000305",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-20"
  },
  {
    "Civil ID": "10000306",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-14"
  },
  {
    "Civil ID": "10000307",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-02"
  },
  {
    "Civil ID": "10000308",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-05"
  },
  {
    "Civil ID": "10000309",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-20"
  },
  {
    "Civil ID": "10000310",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-05"
  },
  {
    "Civil ID": "10000311",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-01"
  },
  {
    "Civil ID": "10000312",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-01"
  },
  {
    "Civil ID": "10000313",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-22"
  },
  {
    "Civil ID": "10000314",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-06"
  },
  {
    "Civil ID": "10000315",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-11"
  },
  {
    "Civil ID": "10000316",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-20"
  },
  {
    "Civil ID": "10000317",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-07"
  },
  {
    "Civil ID": "10000318",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-01"
  },
  {
    "Civil ID": "10000319",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-11"
  },
  {
    "Civil ID": "10000320",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-20"
  },
  {
    "Civil ID": "10000321",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-07"
  },
  {
    "Civil ID": "10000322",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-19"
  },
  {
    "Civil ID": "10000323",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-16"
  },
  {
    "Civil ID": "10000324",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-02"
  },
  {
    "Civil ID": "10000325",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-13"
  },
  {
    "Civil ID": "10000326",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-08"
  },
  {
    "Civil ID": "10000327",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-17"
  },
  {
    "Civil ID": "10000328",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-04"
  },
  {
    "Civil ID": "10000329",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-27"
  },
  {
    "Civil ID": "10000330",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-09"
  },
  {
    "Civil ID": "10000331",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-27"
  },
  {
    "Civil ID": "10000332",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-17"
  },
  {
    "Civil ID": "10000333",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-22"
  },
  {
    "Civil ID": "10000334",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-31"
  },
  {
    "Civil ID": "10000335",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-19"
  },
  {
    "Civil ID": "10000336",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-24"
  },
  {
    "Civil ID": "10000337",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-19"
  },
  {
    "Civil ID": "10000338",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-27"
  },
  {
    "Civil ID": "10000339",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-27"
  },
  {
    "Civil ID": "10000340",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-29"
  },
  {
    "Civil ID": "10000341",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-19"
  },
  {
    "Civil ID": "10000342",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-04"
  },
  {
    "Civil ID": "10000343",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-04"
  },
  {
    "Civil ID": "10000344",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-18"
  },
  {
    "Civil ID": "10000345",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-24"
  },
  {
    "Civil ID": "10000346",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-12"
  },
  {
    "Civil ID": "10000347",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-04"
  },
  {
    "Civil ID": "10000348",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-14"
  },
  {
    "Civil ID": "10000349",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-25"
  },
  {
    "Civil ID": "10000350",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-22"
  },
  {
    "Civil ID": "10000351",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-21"
  },
  {
    "Civil ID": "10000352",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-07"
  },
  {
    "Civil ID": "10000353",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-17"
  },
  {
    "Civil ID": "10000354",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-25"
  },
  {
    "Civil ID": "10000355",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-05"
  },
  {
    "Civil ID": "10000356",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-20"
  },
  {
    "Civil ID": "10000357",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-26"
  },
  {
    "Civil ID": "10000358",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-15"
  },
  {
    "Civil ID": "10000359",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-02"
  },
  {
    "Civil ID": "10000360",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-14"
  },
  {
    "Civil ID": "10000361",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-10"
  },
  {
    "Civil ID": "10000362",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-07"
  },
  {
    "Civil ID": "10000363",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-28"
  },
  {
    "Civil ID": "10000364",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-17"
  },
  {
    "Civil ID": "10000365",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-06"
  },
  {
    "Civil ID": "10000366",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-16"
  },
  {
    "Civil ID": "10000367",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-10"
  },
  {
    "Civil ID": "10000368",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-15"
  },
  {
    "Civil ID": "10000369",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-09"
  },
  {
    "Civil ID": "10000370",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-28"
  },
  {
    "Civil ID": "10000371",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-18"
  },
  {
    "Civil ID": "10000372",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-07"
  },
  {
    "Civil ID": "10000373",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-28"
  },
  {
    "Civil ID": "10000374",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-27"
  },
  {
    "Civil ID": "10000375",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-10"
  },
  {
    "Civil ID": "10000376",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-09"
  },
  {
    "Civil ID": "10000377",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-19"
  },
  {
    "Civil ID": "10000378",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-17"
  },
  {
    "Civil ID": "10000379",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-21"
  },
  {
    "Civil ID": "10000380",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-18"
  },
  {
    "Civil ID": "10000381",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-29"
  },
  {
    "Civil ID": "10000382",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-22"
  },
  {
    "Civil ID": "10000383",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-27"
  },
  {
    "Civil ID": "10000384",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-30"
  },
  {
    "Civil ID": "10000385",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-18"
  },
  {
    "Civil ID": "10000386",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-20"
  },
  {
    "Civil ID": "10000387",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-24"
  },
  {
    "Civil ID": "10000388",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-26"
  },
  {
    "Civil ID": "10000389",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-09"
  },
  {
    "Civil ID": "10000390",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-03"
  },
  {
    "Civil ID": "10000391",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-24"
  },
  {
    "Civil ID": "10000392",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-22"
  },
  {
    "Civil ID": "10000393",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-22"
  },
  {
    "Civil ID": "10000394",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-15"
  },
  {
    "Civil ID": "10000395",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-20"
  },
  {
    "Civil ID": "10000396",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-22"
  },
  {
    "Civil ID": "10000397",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-01"
  },
  {
    "Civil ID": "10000398",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-17"
  },
  {
    "Civil ID": "10000399",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-07"
  },
  {
    "Civil ID": "10000400",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-02"
  },
  {
    "Civil ID": "10000401",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-27"
  },
  {
    "Civil ID": "10000402",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-02"
  },
  {
    "Civil ID": "10000403",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-05"
  },
  {
    "Civil ID": "10000404",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-15"
  },
  {
    "Civil ID": "10000405",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-17"
  },
  {
    "Civil ID": "10000406",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-13"
  },
  {
    "Civil ID": "10000407",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-13"
  },
  {
    "Civil ID": "10000408",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-01"
  },
  {
    "Civil ID": "10000409",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-25"
  },
  {
    "Civil ID": "10000410",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-23"
  },
  {
    "Civil ID": "10000411",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-07"
  },
  {
    "Civil ID": "10000412",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-21"
  },
  {
    "Civil ID": "10000413",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-26"
  },
  {
    "Civil ID": "10000414",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-04"
  },
  {
    "Civil ID": "10000415",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-21"
  },
  {
    "Civil ID": "10000416",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-04"
  },
  {
    "Civil ID": "10000417",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-14"
  },
  {
    "Civil ID": "10000418",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-12"
  },
  {
    "Civil ID": "10000419",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-27"
  },
  {
    "Civil ID": "10000420",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-08"
  },
  {
    "Civil ID": "10000421",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-08"
  },
  {
    "Civil ID": "10000422",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-22"
  },
  {
    "Civil ID": "10000423",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-13"
  },
  {
    "Civil ID": "10000424",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-09"
  },
  {
    "Civil ID": "10000425",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-15"
  },
  {
    "Civil ID": "10000426",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-22"
  },
  {
    "Civil ID": "10000427",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-12"
  },
  {
    "Civil ID": "10000428",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-08"
  },
  {
    "Civil ID": "10000429",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-15"
  },
  {
    "Civil ID": "10000430",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-30"
  },
  {
    "Civil ID": "10000431",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-03"
  },
  {
    "Civil ID": "10000432",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-27"
  },
  {
    "Civil ID": "10000433",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-01"
  },
  {
    "Civil ID": "10000434",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-21"
  },
  {
    "Civil ID": "10000435",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-07"
  },
  {
    "Civil ID": "10000436",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-22"
  },
  {
    "Civil ID": "10000437",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-04"
  },
  {
    "Civil ID": "10000438",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-05"
  },
  {
    "Civil ID": "10000439",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-08"
  },
  {
    "Civil ID": "10000440",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-23"
  },
  {
    "Civil ID": "10000441",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-20"
  },
  {
    "Civil ID": "10000442",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-13"
  },
  {
    "Civil ID": "10000443",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-27"
  },
  {
    "Civil ID": "10000444",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-28"
  },
  {
    "Civil ID": "10000445",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-27"
  },
  {
    "Civil ID": "10000446",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-11"
  },
  {
    "Civil ID": "10000447",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-24"
  },
  {
    "Civil ID": "10000448",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-08"
  },
  {
    "Civil ID": "10000449",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-31"
  },
  {
    "Civil ID": "10000450",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-09"
  },
  {
    "Civil ID": "10000451",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-05"
  },
  {
    "Civil ID": "10000452",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-07"
  },
  {
    "Civil ID": "10000453",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-11"
  },
  {
    "Civil ID": "10000454",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-18"
  },
  {
    "Civil ID": "10000455",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-03"
  },
  {
    "Civil ID": "10000456",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-03"
  },
  {
    "Civil ID": "10000457",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-03"
  },
  {
    "Civil ID": "10000458",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-20"
  },
  {
    "Civil ID": "10000459",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-02"
  },
  {
    "Civil ID": "10000460",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-27"
  },
  {
    "Civil ID": "10000461",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-18"
  },
  {
    "Civil ID": "10000462",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-22"
  },
  {
    "Civil ID": "10000463",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-01"
  },
  {
    "Civil ID": "10000464",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-11"
  },
  {
    "Civil ID": "10000465",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-01"
  },
  {
    "Civil ID": "10000466",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-06"
  },
  {
    "Civil ID": "10000467",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-17"
  },
  {
    "Civil ID": "10000468",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-26"
  },
  {
    "Civil ID": "10000469",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-25"
  },
  {
    "Civil ID": "10000470",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-21"
  },
  {
    "Civil ID": "10000471",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-09"
  },
  {
    "Civil ID": "10000472",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-01"
  },
  {
    "Civil ID": "10000473",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-20"
  },
  {
    "Civil ID": "10000474",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-16"
  },
  {
    "Civil ID": "10000475",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-21"
  },
  {
    "Civil ID": "10000476",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-10"
  },
  {
    "Civil ID": "10000477",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-20"
  },
  {
    "Civil ID": "10000478",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-27"
  },
  {
    "Civil ID": "10000479",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-20"
  },
  {
    "Civil ID": "10000480",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-02"
  },
  {
    "Civil ID": "10000481",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-25"
  },
  {
    "Civil ID": "10000482",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-16"
  },
  {
    "Civil ID": "10000483",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-02"
  },
  {
    "Civil ID": "10000484",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-18"
  },
  {
    "Civil ID": "10000485",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-10"
  },
  {
    "Civil ID": "10000486",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-09"
  },
  {
    "Civil ID": "10000487",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-04"
  },
  {
    "Civil ID": "10000488",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-01-16"
  },
  {
    "Civil ID": "10000489",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-29"
  },
  {
    "Civil ID": "10000490",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-24"
  },
  {
    "Civil ID": "10000491",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-02-27"
  },
  {
    "Civil ID": "10000492",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-01-15"
  },
  {
    "Civil ID": "10000493",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-17"
  },
  {
    "Civil ID": "10000494",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-25"
  },
  {
    "Civil ID": "10000495",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-02-07"
  },
  {
    "Civil ID": "10000496",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-02-05"
  },
  {
    "Civil ID": "10000497",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-01-01"
  },
  {
    "Civil ID": "10000498",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-14"
  },
  {
    "Civil ID": "10000499",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-01-26"
  },
  {
    "Civil ID": "10000500",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-02-16"
  }
];

// Sample test data with potential anomaly on March 15
const TEST_DATA = [
  {
    "Civil ID": "20000001",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000002",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  // Add more test data as needed
  {
    "Civil ID": "20000099",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000100",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  }
];

// Full dataset of sample forecast data (fallback data)
const SAMPLE_FORECAST_DATA = [
  {
    "ds": "2025-03-02",
    "yhat": 7.9993471027726875,
    "yhat_lower": 4.569895231097037,
    "yhat_upper": 11.50020272262829
  },
  {
    "ds": "2025-03-03",
    "yhat": 9.75758159014378,
    "yhat_lower": 6.564910015697562,
    "yhat_upper": 13.25683703680574
  },
  {
    "ds": "2025-03-04",
    "yhat": 9.380539127757201,
    "yhat_lower": 5.955303707918983,
    "yhat_upper": 12.527835642093018
  },
  {
    "ds": "2025-03-05",
    "yhat": 8.584415954825188,
    "yhat_lower": 5.268325183790299,
    "yhat_upper": 11.752508104435368
  },
  {
    "ds": "2025-03-06",
    "yhat": 8.36083031120376,
    "yhat_lower": 4.736046514147865,
    "yhat_upper": 11.839848155559324
  },
  {
    "ds": "2025-03-07",
    "yhat": 10.147319318449277,
    "yhat_lower": 6.905657571010501,
    "yhat_upper": 13.55569168793824
  },
  {
    "ds": "2025-03-08",
    "yhat": 8.807059713777074,
    "yhat_lower": 5.311609156005852,
    "yhat_upper": 12.031392312114537
  },
  {
    "ds": "2025-03-09",
    "yhat": 8.13719988227911,
    "yhat_lower": 5.062897735612322,
    "yhat_upper": 11.595787770908835
  },
  {
    "ds": "2025-03-10",
    "yhat": 9.895434369647166,
    "yhat_lower": 7.007981339706416,
    "yhat_upper": 13.405724771084135
  },
  {
    "ds": "2025-03-11",
    "yhat": 9.518391907259963,
    "yhat_lower": 6.252380287045598,
    "yhat_upper": 12.736894415301538
  },
  {
    "ds": "2025-03-12",
    "yhat": 8.7222687343284,
    "yhat_lower": 5.327775366137883,
    "yhat_upper": 11.986270941263461
  },
  {
    "ds": "2025-03-13",
    "yhat": 8.498683090708006,
    "yhat_lower": 5.279268391497581,
    "yhat_upper": 12.198621704829199
  },
  {
    "ds": "2025-03-14",
    "yhat": 10.285172097952877,
    "yhat_lower": 6.816482632190183,
    "yhat_upper": 13.702128037940788
  },
  {
    "ds": "2025-03-15",
    "yhat": 8.944912493287019,
    "yhat_lower": 5.9003553459050035,
    "yhat_upper": 12.29711814819235
  },
  {
    "ds": "2025-03-16",
    "yhat": 8.275052661780352,
    "yhat_lower": 4.979356301428694,
    "yhat_upper": 11.688419393161253
  },
  {
    "ds": "2025-03-17",
    "yhat": 10.033287149154763,
    "yhat_lower": 6.757486406437768,
    "yhat_upper": 13.365757295631957
  },
  {
    "ds": "2025-03-18",
    "yhat": 9.65624468676393,
    "yhat_lower": 6.337022300737948,
    "yhat_upper": 12.776346376024922
  },
  {
    "ds": "2025-03-19",
    "yhat": 8.860121513831672,
    "yhat_lower": 5.50637314520641,
    "yhat_upper": 11.990801570266242
  },
  {
    "ds": "2025-03-20",
    "yhat": 8.636535870208139,
    "yhat_lower": 5.506418779093485,
    "yhat_upper": 11.959106010729295
  },
  {
    "ds": "2025-03-21",
    "yhat": 10.423024877458504,
    "yhat_lower": 6.9681860806343225,
    "yhat_upper": 13.741849857323313
  },
  {
    "ds": "2025-03-22",
    "yhat": 9.082765272790347,
    "yhat_lower": 6.064568848042519,
    "yhat_upper": 12.383681565754857
  },
  {
    "ds": "2025-03-23",
    "yhat": 8.412905441286773,
    "yhat_lower": 5.214628360481701,
    "yhat_upper": 11.719157854058842
  },
  {
    "ds": "2025-03-24",
    "yhat": 10.17113992865815,
    "yhat_lower": 6.868344827733444,
    "yhat_upper": 13.507998247765444
  },
  {
    "ds": "2025-03-25",
    "yhat": 9.794097466266692,
    "yhat_lower": 6.321929784722113,
    "yhat_upper": 13.079290181581461
  },
  {
    "ds": "2025-03-26",
    "yhat": 8.99797429333873,
    "yhat_lower": 5.826464786546015,
    "yhat_upper": 12.37821497287899
  },
  {
    "ds": "2025-03-27",
    "yhat": 8.774388649713476,
    "yhat_lower": 5.324602767289213,
    "yhat_upper": 12.072273019820958
  },
  {
    "ds": "2025-03-28",
    "yhat": 10.560877656960077,
    "yhat_lower": 7.229960747054451,
    "yhat_upper": 13.961512008259914
  },
  {
    "ds": "2025-03-29",
    "yhat": 9.220618052291115,
    "yhat_lower": 5.845247567331944,
    "yhat_upper": 12.382338381331472
  },
  {
    "ds": "2025-03-30",
    "yhat": 8.550758220790605,
    "yhat_lower": 5.116955607672298,
    "yhat_upper": 11.7755475461295
  },
  {
    "ds": "2025-03-31",
    "yhat": 10.308992708157772,
    "yhat_lower": 7.18164754313837,
    "yhat_upper": 13.72570829499564
  },
  {
    "ds": "2025-04-01",
    "yhat": 9.931950245770661,
    "yhat_lower": 6.610358392166057,
    "yhat_upper": 13.17962385987789
  },
  {
    "ds": "2025-04-02",
    "yhat": 9.135827072842003,
    "yhat_lower": 5.623988533596376,
    "yhat_upper": 12.321380938219136
  },
  {
    "ds": "2025-04-03",
    "yhat": 8.912241429218815,
    "yhat_lower": 5.610750383231956,
    "yhat_upper": 12.45625610340108
  },
  {
    "ds": "2025-04-04",
    "yhat": 10.698730436465706,
    "yhat_lower": 7.620176224538677,
    "yhat_upper": 13.950233428991147
  },
  {
    "ds": "2025-04-05",
    "yhat": 9.358470831794444,
    "yhat_lower": 6.225885478601382,
    "yhat_upper": 12.786490058887269
  },
  {
    "ds": "2025-04-06",
    "yhat": 8.688611000291822,
    "yhat_lower": 5.319868275019117,
    "yhat_upper": 12.085894202527323
  },
  {
    "ds": "2025-04-07",
    "yhat": 10.446845487663264,
    "yhat_lower": 7.097978055150565,
    "yhat_upper": 13.786001387654549
  },
  {
    "ds": "2025-04-08",
    "yhat": 10.06980302527222,
    "yhat_lower": 6.9121676591480234,
    "yhat_upper": 13.52849233671425
  },
  {
    "ds": "2025-04-09",
    "yhat": 9.273679852345214,
    "yhat_lower": 5.935672918748149,
    "yhat_upper": 12.399383807389214
  },
  {
    "ds": "2025-04-10",
    "yhat": 9.050094208723063,
    "yhat_lower": 5.64901990977635,
    "yhat_upper": 12.130544529992843
  },
  {
    "ds": "2025-04-11",
    "yhat": 10.836583215968673,
    "yhat_lower": 7.634187977781687,
    "yhat_upper": 13.910391098542604
  },
  {
    "ds": "2025-04-12",
    "yhat": 9.49632361129521,
    "yhat_lower": 6.146060306302531,
    "yhat_upper": 12.46336255079557
  },
  {
    "ds": "2025-04-13",
    "yhat": 8.826463779795656,
    "yhat_lower": 5.657477702860136,
    "yhat_upper": 11.85901645381329
  },
  {
    "ds": "2025-04-14",
    "yhat": 10.584698267168754,
    "yhat_lower": 7.294792297707643,
    "yhat_upper": 13.911447303691904
  },
  {
    "ds": "2025-04-15",
    "yhat": 10.207655804776186,
    "yhat_lower": 6.859190931657503,
    "yhat_upper": 13.619696171946416
  },
  {
    "ds": "2025-04-16",
    "yhat": 9.411532631852337,
    "yhat_lower": 6.144333152063127,
    "yhat_upper": 12.715491461247659
  },
  {
    "ds": "2025-04-17",
    "yhat": 9.187946988227312,
    "yhat_lower": 5.844907659833947,
    "yhat_upper": 12.586245283611499
  },
  {
    "ds": "2025-04-18",
    "yhat": 10.974435995472273,
    "yhat_lower": 7.55725346402674,
    "yhat_upper": 14.226109806492905
  },
  {
    "ds": "2025-04-19",
    "yhat": 9.634176390801102,
    "yhat_lower": 6.209931015699537,
    "yhat_upper": 13.02131556953346
  },
  {
    "ds": "2025-04-20",
    "yhat": 8.964316559299487,
    "yhat_lower": 5.531892260329846,
    "yhat_upper": 12.418572733178117
  },
  {
    "ds": "2025-04-21",
    "yhat": 10.722551046672143,
    "yhat_lower": 7.510634107217889,
    "yhat_upper": 13.785382337948715
  },
  {
    "ds": "2025-04-22",
    "yhat": 10.34550858428396,
    "yhat_lower": 6.705110362409708,
    "yhat_upper": 13.598798057929953
  },
  {
    "ds": "2025-04-23",
    "yhat": 9.549385411355548,
    "yhat_lower": 6.64289506951755,
    "yhat_upper": 12.80960982223232
  },
  {
    "ds": "2025-04-24",
    "yhat": 9.325799767732649,
    "yhat_lower": 6.157299763357559,
    "yhat_upper": 12.705644348461147
  },
  {
    "ds": "2025-04-25",
    "yhat": 11.112288774975873,
    "yhat_lower": 7.870599839223642,
    "yhat_upper": 14.444451543996626
  },
  {
    "ds": "2025-04-26",
    "yhat": 9.772029170301868,
    "yhat_lower": 6.2941616128156435,
    "yhat_upper": 13.066965443598544
  },
  {
    "ds": "2025-04-27",
    "yhat": 9.102169338800707,
    "yhat_lower": 5.840395526786498,
    "yhat_upper": 12.305009474671701
  },
  {
    "ds": "2025-04-28",
    "yhat": 10.860403826175528,
    "yhat_lower": 7.52875774095143,
    "yhat_upper": 14.184025455006779
  },
  {
    "ds": "2025-04-29",
    "yhat": 10.483361363786722,
    "yhat_lower": 7.3662184568982045,
    "yhat_upper": 13.934523925452428
  },
  {
    "ds": "2025-04-30",
    "yhat": 9.687238190858885,
    "yhat_lower": 6.5529724260370115,
    "yhat_upper": 12.970026791571202
  },
  {
    "ds": "2025-05-01",
    "yhat": 9.463652547237988,
    "yhat_lower": 6.161825694201011,
    "yhat_upper": 12.742163388204325
  },
  {
    "ds": "2025-05-02",
    "yhat": 11.250141554481498,
    "yhat_lower": 7.8696709210423785,
    "yhat_upper": 14.430724694892909
  },
  {
    "ds": "2025-05-03",
    "yhat": 9.909881949814375,
    "yhat_lower": 6.664171941295387,
    "yhat_upper": 13.281847485349832
  },
  {
    "ds": "2025-05-04",
    "yhat": 9.240022118307127,
    "yhat_lower": 5.947897622284771,
    "yhat_upper": 12.680721651906731
  },
  {
    "ds": "2025-05-05",
    "yhat": 10.99825660568102,
    "yhat_lower": 7.6007854113309445,
    "yhat_upper": 14.540342673640186
  },
  {
    "ds": "2025-05-06",
    "yhat": 10.621214143289487,
    "yhat_lower": 7.4188636000102886,
    "yhat_upper": 13.94908254242532
  },
  {
    "ds": "2025-05-07",
    "yhat": 9.825090970362094,
    "yhat_lower": 6.271226952735247,
    "yhat_upper": 13.152791685793131
  },
  {
    "ds": "2025-05-08",
    "yhat": 9.60150532673703,
    "yhat_lower": 6.251738383743854,
    "yhat_upper": 12.97480250320427
  },
  {
    "ds": "2025-05-09",
    "yhat": 11.387994333987127,
    "yhat_lower": 8.268453304792502,
    "yhat_upper": 14.617591760718504
  },
  {
    "ds": "2025-05-10",
    "yhat": 10.047734729315142,
    "yhat_lower": 6.597403700029973,
    "yhat_upper": 13.424844746450601
  },
  {
    "ds": "2025-05-11",
    "yhat": 9.377874897808368,
    "yhat_lower": 6.172906649844532,
    "yhat_upper": 12.709792587318507
  },
  {
    "ds": "2025-05-12",
    "yhat": 11.13610938518651,
    "yhat_lower": 7.878359856713717,
    "yhat_upper": 14.426932997400005
  },
  {
    "ds": "2025-05-13",
    "yhat": 10.759066922793453,
    "yhat_lower": 7.176300555865906,
    "yhat_upper": 14.08255124360122
  },
  {
    "ds": "2025-05-14",
    "yhat": 9.96294374986537,
    "yhat_lower": 6.93161197482099,
    "yhat_upper": 13.467102475165897
  },
  {
    "ds": "2025-05-15",
    "yhat": 9.739358106241278,
    "yhat_lower": 6.201087317146182,
    "yhat_upper": 12.873183722853955
  },
  {
    "ds": "2025-05-16",
    "yhat": 11.525847113490727,
    "yhat_lower": 8.1830596900681,
    "yhat_upper": 14.784851886443654
  },
  {
    "ds": "2025-05-17",
    "yhat": 10.18558750881847,
    "yhat_lower": 6.965394533975006,
    "yhat_upper": 13.351395976553613
  },
  {
    "ds": "2025-05-18",
    "yhat": 9.515727677314791,
    "yhat_lower": 6.286351226902541,
    "yhat_upper": 12.8691766384172
  },
  {
    "ds": "2025-05-19",
    "yhat": 11.273962164686136,
    "yhat_lower": 8.030278439816206,
    "yhat_upper": 14.421583231768793
  },
  {
    "ds": "2025-05-20",
    "yhat": 10.896919702300021,
    "yhat_lower": 7.285286869839643,
    "yhat_upper": 14.105046169596033
  },
  {
    "ds": "2025-05-21",
    "yhat": 10.100796529368582,
    "yhat_lower": 6.748977549007969,
    "yhat_upper": 13.27547805310018
  },
  {
    "ds": "2025-05-22",
    "yhat": 9.877210885747704,
    "yhat_lower": 6.670860770742216,
    "yhat_upper": 13.144536964908163
  },
  {
    "ds": "2025-05-23",
    "yhat": 11.663699892994325,
    "yhat_lower": 8.35352026187385,
    "yhat_upper": 14.90481608679074
  },
  {
    "ds": "2025-05-24",
    "yhat": 10.323440288328415,
    "yhat_lower": 7.185263862089866,
    "yhat_upper": 13.757757111843187
  },
  {
    "ds": "2025-05-25",
    "yhat": 9.653580456818622,
    "yhat_lower": 6.2168401478957716,
    "yhat_upper": 13.062102667384714
  },
  {
    "ds": "2025-05-26",
    "yhat": 11.411814944189521,
    "yhat_lower": 8.392893217557297,
    "yhat_upper": 14.781305951783883
  },
  {
    "ds": "2025-05-27",
    "yhat": 11.034772481803989,
    "yhat_lower": 7.696737475552276,
    "yhat_upper": 14.28799775602207
  },
  {
    "ds": "2025-05-28",
    "yhat": 10.238649308871855,
    "yhat_lower": 6.983491857298631,
    "yhat_upper": 13.54822418929055
  },
  {
    "ds": "2025-05-29",
    "yhat": 10.015063665251953,
    "yhat_lower": 6.7195923404012206,
    "yhat_upper": 13.249443559905473
  },
  {
    "ds": "2025-05-30",
    "yhat": 11.801552672495271,
    "yhat_lower": 8.291429008658527,
    "yhat_upper": 14.861601289205366
  }
]