import "./WeatherWidget.css"

const WeatherWidget = () => {
  // Sample weather data
  const weatherData = [
    { day: "Mon", temp: 28, condition: "sunny", icon: "☀️" },
    { day: "Tue", temp: 26, condition: "partly cloudy", icon: "⛅" },
    { day: "Wed", temp: 24, condition: "cloudy", icon: "☁️" },
    { day: "Thu", temp: 22, condition: "rainy", icon: "🌧️" },
    { day: "Fri", temp: 25, condition: "partly cloudy", icon: "⛅" },
  ]

  return (
    <div className="weather-widget">
      <div className="current-weather">
        <div className="weather-location">
          <h3>Paris, France</h3>
          <p>Your next destination</p>
        </div>
        <div className="weather-info">
          <div className="weather-temp">
            <span className="temp-value">28°</span>
            <span className="weather-icon large">☀️</span>
          </div>
          <p className="weather-condition">Sunny</p>
        </div>
      </div>

      <div className="weather-forecast">
        {weatherData.map((day, index) => (
          <div key={index} className="forecast-day">
            <p className="day-name">{day.day}</p>
            <div className="day-icon">{day.icon}</div>
            <p className="day-temp">{day.temp}°</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeatherWidget
