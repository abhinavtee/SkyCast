from flask import Blueprint, request, jsonify, current_app
from app.services.weather_service import get_current_weather
from requests.exceptions import (HTTPError, Timeout, RequestException) 

weather_bp = Blueprint("weather", __name__)

@weather_bp.route("/weather", methods=["GET"])
def current_weather():
    city = request.args.get("city")
    
    if not city:
        return jsonify({
            "status" : "error",
            "message": "City name is required."
        }), 400
    cache = current_app.extensions["skycast_cache"]
    cache_key = f"weather_{city.strip().lower()}"

    cached_weather = cache.get(cache_key)

    if cached_weather:
        print(f"Cache HIT: {city}")
        return jsonify({
        "status": "success",
        "data": cached_weather
    }), 200
        
    try:
         print(f"Cache MISS: {city}")
         weather_data = get_current_weather(city)
         cache.set(cache_key, weather_data, timeout=300)
         
         return jsonify({
                "status" : "success",
                "data" : weather_data
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
        
        
