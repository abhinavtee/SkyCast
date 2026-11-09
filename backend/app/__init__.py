import os
from flask import Flask
from flask_cors import CORS
from flask_caching import Cache
from app.routes import health_bp
from dotenv import load_dotenv
from app.routes.weather_routes import weather_bp
from app.routes.forecast_routes import forecast_bp

def create_app():
    load_dotenv()
    app = Flask(__name__)
    cache = Cache(app, config={
        "CACHE_TYPE" : "SimpleCache",
        "CACHE_DEFAULT_TIMEOUT": 300
    })
    app.extensions["skycast_cache"] = cache
    frontend_url = os.getenv(
        "FRONTEND_URL",
        "http://localhost:5173"
        )

    CORS(app, resources={
        r"/api/*": {"origins": frontend_url}
        })
    
    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(weather_bp, url_prefix="/api")
    app.register_blueprint(forecast_bp, url_prefix="/api")
    
    return app