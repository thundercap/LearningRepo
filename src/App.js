import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [weatherIcon, setWeatherIcon] = useState('');
  const [sunrise, setSunrise] = useState(null);
  const [sunset, setSunset] = useState(null);
  const [error, setError] = useState('');

  const API_KEY = '44f9950b413203d948af01c2bef02bc8';

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
      );

      setWeatherData(response.data);
      setWeatherIcon(response.data.weather[0].icon);
      setSunrise(response.data.sys.sunrise);
      setSunset(response.data.sys.sunset);
      setError('');
      const backgroundColor = getBackgroundColor(response.data.weather[0].main);
      document.body.style.backgroundColor = backgroundColor;
    } catch (error) {
      setWeatherData(null);
      setWeatherIcon('');
      setSunrise(null);
      setSunset(null);
      setError('City not found');
    }
  };
  const getBackgroundColor = (weatherCondition) => {
    switch (weatherCondition) {
      case 'Clear':
        return '#87CEEB'; // Light Blue for clear sky
      case 'Clouds':
        return '#B0C4DE'; // Light Steel Blue for clouds
      case 'Rain':
        return '#4682B4'; // Steel Blue for rain
      case 'Snow':
        return '#FFFAFA'; // Snow for snow
      default:
        return '#FFF'; // Default background color
    }
  };

  const getWindDirection = (degree) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round((degree % 360) / 45);
    return directions[index];
  };

  return (
    <div className="container">
      <div className="profile-card">
        <h1>Weather App</h1>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeatherData}>Get Weather</button>

        {weatherData && (
          <div className="weather-info">
            <h2>{weatherData.name}, {weatherData.sys.country}</h2>
            <img
              src={`http://openweathermap.org/img/w/${weatherIcon}.png`}
              alt={weatherData.weather[0].description}
            />
            <p>{weatherData.weather[0].description}</p>
            <p>
              Temperature:{(weatherData.main.temp - 273.15).toFixed(1)} °C</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Wind: {weatherData.wind.speed} m/s, {getWindDirection(weatherData.wind.deg)}</p>
            <p>Sunrise: {new Date(sunrise * 1000).toLocaleTimeString()}</p>
            <p>Sunset: {new Date(sunset * 1000).toLocaleTimeString()}</p>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default App;
