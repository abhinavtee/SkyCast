export const groupForecastByDay = (forecastData) => {
  const dailyForecasts = {};
  const timezoneoffset = forecastData.city.timezone;

  forecastData.list.forEach((item) => {
    // Convert forecast timestamp into the city's local time
    const localDate = new Date((item.dt + timezoneoffset) * 1000);
    const dateKey = localDate.toISOString().split("T")[0];

    //Create a group for each date
    if (!dailyForecasts[dateKey]) {
      dailyForecasts[dateKey] = {
        date: dateKey,
        temperatures: [],
        forecasts: [],
      };
    }
    dailyForecasts[dateKey].temperatures.push(item.main.temp);
    dailyForecasts[dateKey].forecasts.push(item);
  });

  return Object.values(dailyForecasts).map((day)=>{
    //Find the forecast close to 12 PM

    const middayForecast = day.forecasts.reduce((closest, current)=>{
        const closestHour = new Date(
           ( closest.dt + timezoneoffset) *1000
        ).getUTCHours();

    const currentHour = new Date(
        (current.dt + timezoneoffset) * 1000
    ).getUTCHours();

    return Math.abs(currentHour -12) < Math.abs(closestHour -12) ? current : closest;
    });

    return {
        date : day.date,
        minTemp: Math.min(...day.temperatures),
        maxTemp: Math.max(...day.temperatures),
        temp: middayForecast.main.temp,
        description: middayForecast.weather[0].description,
        icon: middayForecast.weather[0].icon,
    }
  })
};
