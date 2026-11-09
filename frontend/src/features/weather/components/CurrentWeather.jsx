import { Droplets, Wind, Gauge, Eye, Sunrise, Sunset, Sun } from "lucide-react";

function CurrentWeather({ weather }) {
  const weatherDate = new Date((weather.dt + weather.timezone) * 1000);
  const formattedDate = weatherDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const formattedTime = weatherDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });

  // Calculate sunrise and sunset times
  const sunriseTime = new Date((weather.sys.sunrise + weather.timezone) * 1000);

  const sunsetTime = new Date((weather.sys.sunset + weather.timezone) * 1000);

  // Format sunrise time
  const formattedSunrise = sunriseTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });

  // Format sunset time
  const formattedSunset = sunsetTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });

  //Calculate daylight duration in milliseconds
  const daylightDuration = (weather.sys.sunset - weather.sys.sunrise) * 1000;

  //Convert milliseconds in total minutes
  const totalMinutes = Math.floor(daylightDuration / (1000 * 60));

  //Calculate hrs and remianing minutes
  const daylightHours = Math.floor(totalMinutes / 60);
  const daylightMinutes = totalMinutes % 60;

  //Format the duration
  const formattedDaylight = `${daylightHours}h ${daylightMinutes}m`;

  return (
    <div className="mt-8 w-full rounded-3xl border border-white/80 bg-white/90 p-5 shadow-lg shadow-sky-100/60 backdrop-blur-sm sm:p-8">
      {/* Main Weather Information */}

      {/* Date and Last Updated */}

      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-slate-700">{formattedDate}</p>
        <p className="text-xs text-slate-500">
          Last updated at {formattedTime}
        </p>
      </div>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* City Information */}
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {weather.name}, {weather.sys.country}
          </h2>
          <p className="mt-1 text-sm capitalize text-slate-500">
            {weather.weather[0].description}
          </p>
        </div>
        {/* Temperature  and Weather Icon*/}
        <div className="flex items-center gap-3">
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            className="h-24 w-24 drop-shadow-md sm:h-28 sm:w-28"
          />
          <div>
            <p className="text-6xl font-extrabold tracking-tight text-slate-900 sm:text-7xl">
              {Math.round(weather.main.temp)}°C
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Feels like {Math.round(weather.main.feels_like)}°C
            </p>

            {/* Temperature Range */}
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <p className="text-slate-500">
                Min:{" "}
                <span className="font-semibold text-slate-700">
                  {Math.round(weather.main.temp_min)}°C
                </span>
              </p>
              <p className="text-slate-500">
                Max:{" "}
                <span className="font-semibold text-slate-700">
                  {Math.round(weather.main.temp_max)}°C
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Additional Weather Details */}
      <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
        {/* Humidity */}
        <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-sky-50/70 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center gap-2 text-slate-500">
            <Droplets className="h-5 w-5 text-sky-600" />
            <p className="text-sm">Humidity</p>
          </div>
          <p className="mt-3 text-xl font-semibold text-slate-900">
            {weather.main.humidity}%
          </p>
        </div>

        {/* Wind Speed */}
        <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-sky-50/70 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center gap-2 text-slate-500">
            <Wind className="h-5 w-5 text-sky-600" />
            <p className="text-sm">Wind Speed</p>
          </div>
          <p className="mt-3 text-xl font-semibold text-slate-900">
            {weather.wind.speed} m/s
          </p>
        </div>

        {/* Pressure */}
        <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-sky-50/70 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center gap-2 text-slate-500">
            <Gauge className="h-5 w-5 text-sky-600" />
            <p className="text-sm">Pressure</p>
          </div>
          <p className="mt-3 text-xl font-semibold text-slate-900">
            {weather.main.pressure} hPa
          </p>
        </div>

        {/* Visibility */}
        <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-sky-50/70 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center gap-2 text-slate-500">
            <Eye className="h-5 w-5 text-sky-600" />
            <p className="text-sm">Visibility</p>
          </div>
          <p className="mt-3 text-xl font-semibold text-slate-900">
            {(weather.visibility / 1000).toFixed(1)} km
          </p>
        </div>
        {/* Sunrise */}
        <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-sky-50/70 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center gap-2 text-slate-500">
            <Sunrise className="h-5 w-5 text-amber-500" />
            <p className="text-sm">Sunrise</p>
          </div>

          <p className="mt-3 text-xl font-semibold text-slate-900">
            {formattedSunrise}
          </p>
        </div>

        {/* Sunset */}
        <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-sky-50/70 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center gap-2 text-slate-500">
            <Sunset className="h-5 w-5 text-orange-600" />
            <p className="text-sm">Sunset</p>
          </div>

          <p className="mt-3 text-xl font-semibold text-slate-900">
            {formattedSunset}
          </p>
        </div>
        {/* Daylight Duration */}
        <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-sky-50/70 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center gap-2 text-slate-500">
            <Sun className="h-5 w-5 text-amber-500" />
            <p className="text-sm">Daylight Duration</p>
          </div>

          <p className="mt-3 text-xl font-semibold text-slate-900">
            {formattedDaylight}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CurrentWeather;
