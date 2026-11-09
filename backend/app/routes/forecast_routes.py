from flask import Blueprint, request, jsonify, current_app
from app.services.weather_service import get_weather_forecast
from requests.exceptions import HTTPError, Timeout, RequestException

forecast_bp = Blueprint("forecast", __name__)


@forecast_bp.route("/forecast", methods=["GET"])
def weather_forecast():
    city = request.args.get("city")
    cache = current_app.extensions["skycast_cache"]
    cache_key = f"forecast_{city.strip().lower()}"
    cached_forecast = cache.get(cache_key)
    
    if cached_forecast:
        print(f"Cache HIT: {city}")
        return jsonify({
            "status": "success",
            "data": cached_forecast
        }), 200
    
    if not city:
        return jsonify({
            "status" : "error",
            "message": "City name is required."
        }), 400
    try:
        print(f"Cache MISS: {city}")
        forecast_data = get_weather_forecast(city)
        cache.set(cache_key, forecast_data, timeout=600) 
        return jsonify({
            "status" : "success",
            "data" : forecast_data
        }),200
    
    
    except HTTPError as error:
        status_code = error.response.status_code
        if status_code == 404:
            return jsonify({
                "status" : "error",
                "message" : "City not found. Please enter a valid city name"
            }),404
        return jsonify({
        "status": "error",
        "message": "Weather provider error."
        }), 502
                
    except Timeout:
        return jsonify({
            "status" : "error",
            "message": "Weather service timed out. Please try again."
        }),504
                
    except RequestException:
        return jsonify({
            "status": "error",
            "message": "Unable to connect to the weather service."
        }),502
        
    