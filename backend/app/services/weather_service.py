import os
import requests

#For Weather Details
def get_current_weather(city):
    api_key = os.getenv("OPENWEATHER_API_KEY")
    base_url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "q" : city,
        "appid" : api_key,
        "units" : "metric"
    }
    response = requests.get(base_url, params=params, timeout=10)
    response.raise_for_status()
    weather_data = response.json()
    return weather_data

#For Forecast Details
def get_weather_forecast(city):
    api_key = os.getenv("OPENWEATHER_API_KEY")
    base_url = "https://api.openweathermap.org/data/2.5/forecast"
    params = {
        "q" : city,
        "appid" : api_key,
        "units" : "metric"
    }
    response = requests.get(base_url, params=params, timeout=10)
    response.raise_for_status()
    forecast_data = response.json()
    
    return forecast_data