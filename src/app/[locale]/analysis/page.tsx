'use client';

import { useState, useEffect } from 'react';
import { DisabilityForecastChart } from '@/app/components/charts/DisabilityForecastChart';

export default function AnalysisPage() {
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch this data from an API
    // For this example, we're using the hard-coded data
    setHistoricalData(SAMPLE_HISTORICAL_DATA);
    setForecastData(SAMPLE_FORECAST_DATA);
    setIsLoading(false);
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Disability Applications Analysis</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-xl">Loading data...</div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <DisabilityForecastChart 
            historicalData={historicalData} 
            forecastData={forecastData} 
          />
        </div>
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
  // Add more historical data as needed
];

// Full dataset of sample forecast data
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
  // Add more forecast data as needed
]; 