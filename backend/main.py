from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from typing import List
import pandas as pd
import json
from prophet import Prophet
from io import BytesIO
import uvicorn

app = FastAPI(title="📊 Case Anomaly Tracker API")

# Global model storage for reuse
trained_model = None
trained_forecast = None

# --- Helper Functions ---
def load_json_file(file: UploadFile):
    content = file.file.read()
    data = json.load(BytesIO(content))
    df = pd.DataFrame(data)
    df['date'] = pd.to_datetime(df["Date Submitted"])
    return df

def prepare_time_series(df):
    ts = df.groupby('date').size().reset_index(name='y')
    ts.rename(columns={'date': 'ds'}, inplace=True)
    return ts

def train_prophet(ts, future_days=90):
    model = Prophet()
    model.fit(ts)
    future = model.make_future_dataframe(periods=future_days)
    forecast = model.predict(future)
    return model, forecast

def detect_test_anomalies(test_ts, forecast):
    merged = pd.merge(test_ts, forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']], on='ds', how='left')
    merged['anomaly'] = (merged['y'] > merged['yhat_upper']) | (merged['y'] < merged['yhat_lower'])
    anomalies = merged[merged['anomaly']]
    return anomalies['ds'].dt.strftime('%Y-%m-%d').tolist()

# --- Endpoint 1: Forecast and train the model ---
@app.post("/forecast")
async def forecast_cases(training_file: UploadFile = File(...)):
    global trained_model, trained_forecast
    try:
        df_train = load_json_file(training_file)
        ts = prepare_time_series(df_train)
        trained_model, trained_forecast = train_prophet(ts)

        forecast_json = trained_forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(90)
        forecast_json['ds'] = forecast_json['ds'].dt.strftime('%Y-%m-%d')
        return forecast_json.to_dict(orient='records')
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# --- Endpoint 2: Check new test data only ---
@app.post("/check")
async def check_anomalies(test_file: UploadFile = File(...)):
    global trained_forecast
    if trained_forecast is None:
        return JSONResponse(status_code=400, content={"error": "You must first call /forecast with training data."})

    try:
        df_test = load_json_file(test_file)
        test_ts = prepare_time_series(df_test)
        anomaly_periods = detect_test_anomalies(test_ts, trained_forecast)

        if anomaly_periods:
            return {"anomaly_periods": anomaly_periods}
        else:
            return {"message": "There are no unusual or abnormal patterns."}

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# --- To run locally ---
# uvicorn main:app --host 0.0.0.0 --port 8000 --reload