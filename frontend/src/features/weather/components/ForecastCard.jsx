function ForecastCard({ forecast }) {
  return (
    <div className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-md shadow-sky-100/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <h3 className="text-base font-bold tracking-tight text-slate-800">
        {new Date(`${forecast.date}T12:00:00`).toLocaleDateString("en-IN", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })}
      </h3>
      {/*Weather Icon */}
      <img
        src={`https://openweathermap.org/img/wn/${forecast.icon}@2x.png`}
        alt={forecast.description}
        className="mx-auto h-24 w-24 drop-shadow-sm"
      />
      {/* Temperature */}
      <p className="text-4xl font-extrabold tracking-tight text-slate-900">
        {Math.round(forecast.temp)}°C
      </p>

      {/* Weather Description */}
      <p className="mt-2 text-sm font-medium capitalize text-slate-500">
        {forecast.description}
      </p>
      {/* Min and Max Temperature */}
      <div className="mt-3 flex justify-center gap-4 text-sm text-slate-500">
        <p>
          Min:{" "}
          <span className="font-semibold text-slate-700">
            {Math.round(forecast.minTemp)}°C
          </span>
        </p>

        <p>
          Max:{" "}
          <span className="font-semibold text-slate-700">
            {Math.round(forecast.maxTemp)}°C
          </span>
        </p>
      </div>
    </div>
  );
}

export default ForecastCard;
