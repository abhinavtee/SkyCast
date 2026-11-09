import { checkBackendHealth } from "@/services/healthService";
import AppHeader from "../../../components/layout/AppHeader";
import WeatherSearch from "../components/WeatherSearch";
import { useState, useEffect } from "react";
import { fetchWeather, fetchForecast } from "@/services/weatherService";
import CurrentWeather from "../components/CurrentWeather";
import { AlertCircle } from "lucide-react";
import { groupForecastByDay } from "@/utils/forecastUtils";
import ForecastCard from "../components/ForecastCard";
import AppFooter from "../../../components/layout/AppFooter";

function WeatherPage() {
  const [backendStatus, setBackendStatus] = useState("");
  const [searchedCity, setSearchedCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastSearchedCity, setLastSearchedCity] = useState("");
  const [dailyForecasts, setDailyForecasts] = useState([]);
  const [forecastError, setForecastError] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [isSearchesLoaded, setIsSearchesLoaded] = useState(false);

  useEffect(() => {
    const fetchBackendHealth = async () => {
      try {
        const data = await checkBackendHealth();

        setBackendStatus(data.message);
      } catch (error) {
        console.error("Backend connection failed", error);
        setBackendStatus("Backend connection failed");
      }
    };
    fetchBackendHealth();
  }, []);

  // Restore recent searches when the component mounts
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
    setIsSearchesLoaded(true);
  }, []);

  // Persist recent searches whenever the list changes
  useEffect(() => {
    if (!isSearchesLoaded) return;
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }, [recentSearches, isSearchesLoaded]);

  //Forecast retry handle function
  const handleForecastRetry = async () => {
    if (!searchedCity) return;
    setForecastLoading(true);
    setForecastError("");
    try {
      const forecastResult = await fetchForecast(searchedCity);
      const dailyForecast = groupForecastByDay(forecastResult.data);
      setDailyForecasts(dailyForecast);
    } catch (error) {
      console.error("Forecast retry failed", error);
      setForecastError("Unable to fetech the forecast, Please try again.");
    } finally {
      setForecastLoading(false);
    }
  };
  //Callback
  const handleSearch = async (city) => {
    setLoading(true);
    setError("");
    setForecastError("");
    setLastSearchedCity(city);
    setDailyForecasts([]); // Clear previous forecast
    setWeather(null);

    //Fetch Current Weather
    try {
      const result = await fetchWeather(city);
      setWeather(result.data);
      setSearchedCity(city);
      setRecentSearches((previousSearches) => {
        const updateSearches = [
          city,
          ...previousSearches.filter(
            (searchedCity) => searchedCity.toLowerCase() !== city.toLowerCase(),
          ),
        ];
        return updateSearches.slice(0, 5);
      });
    } catch (error) {
      console.error("Weather fetch failed", error);

      if (error.response) {
        //Backend returned an error response
        setError(error.response.data.message || "Something went wrong.");
      } else if (error.code == "ECONNABORTED") {
        //Request Timeout
        setError("Request timed out. Please try again later.");
      } else if (error.request) {
        // Backend is unavailable or network connection failed
        setError(
          "Unable to connect to SkyCast. Please check your connection or try again later.",
        );
      } else {
        // Unexpected error
        setError("Something went wrong. Please try again.");
      }
      setLoading(false);
      return;
    }

    // Fetch 5 days forecast
    try {
      const forecastResult = await fetchForecast(city);
      const dailyForecast = groupForecastByDay(forecastResult.data);
      setDailyForecasts(dailyForecast);
    } catch (error) {
      console.error("Forecast fetch failed", error);

      if (error.response) {
        setForecastError(
          error.response.data.message || "Unable to fetch weather forecast.",
        );
      } else if (error.code === "ECONNABORTED") {
        setForecastError("Forecast request timed out. Please try again.");
      } else if (error.request) {
        setForecastError("Unable to connect to the forecast service.");
      } else {
        setForecastError("Something went wrong while fetching the forecast.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100">
        <AppHeader />

        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <section>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Weather Dashboard
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Get real-time weather updates and forecasts for your city.
            </p>
            {searchedCity && (
              <p className="mt-4 text-sm font-medium text-sky-600">
                Showing weather for : {searchedCity}
              </p>
            )}
            {backendStatus && (
              <p className="mt-3 text-sm text-emerald-600">
                Backend Status : {backendStatus}
              </p>
            )}
            <WeatherSearch onSearch={handleSearch} loading={loading} />
            {recentSearches.length > 0 && (
              <section className="mt-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-700">
                    Recent Searches
                  </h2>

                  <button
                    type="button"
                    onClick={() => setRecentSearches([])}
                    className="text-xs font-medium text-slate-500 transition-colors hover:text-red-600"
                  >
                    Clear history
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleSearch(city)}
                      disabled={loading}
                      className="rounded-full border border-sky-100 bg-white/90 px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </section>
            )}
            {loading && (
              <div
                className="mt-6 flex items-center justify-center gap-3  rounded-xl bg-sky-50 p-4"
                role="status"
              >
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />

                <p className="text-sm font-medium text-sky-700">
                  Fetching weather data...
                </p>
              </div>
            )}
            {error && (
              <div
                role="alert"
                className="mt-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleSearch(lastSearchedCity)}
                  disabled={loading}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Try Again
                </button>
              </div>
            )}
            {weather && <CurrentWeather weather={weather} />}
            {forecastError && (
              <div
                role="alert"
                className="mt-5 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />

                  <p className="text-sm text-amber-700">{forecastError}</p>
                </div>

                <button
                  type="button"
                  onClick={handleForecastRetry}
                  disabled={forecastLoading}
                  className="flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {forecastLoading && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}

                  {forecastLoading ? "Retrying..." : "Retry Forecast"}
                </button>
              </div>
            )}
            {dailyForecasts.length > 0 && (
              <section className="mt-8">
                <h2 className="mb-4 text-xl font-bold text-slate-900">
                  5-Day Forecast
                </h2>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  {dailyForecasts.map((day) => (
                    <ForecastCard key={day.date} forecast={day} />
                  ))}
                </div>
              </section>
            )}
          </section>
        </main>
        <AppFooter />
      </div>
    </>
  );
}

export default WeatherPage;
