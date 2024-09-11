import React, { useState } from 'react';
import axios from 'axios';

const WeatherApp = ({ token }) => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);

  const handleGetWeather = async () => {
    console.log('Fetching weather for city:', city); // Debugging log
    try {
      const response = await axios.get(`http://localhost:3007/weather/${city}`, {
        headers: { 'x-access-token': token },
      });
      console.log('Weather response:', response.data); // Debugging log
      setWeather(response.data);
    } catch (error) {
      console.error('Error fetching weather data', error);
    }
  };

  return (
    <div>
      <h2>Weather Information</h2>
      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={handleGetWeather}>Get Weather</button>
      {weather && (
        <div>
          <h3>{weather.name}</h3>
          <p>{weather.weather[0].description}</p>
          <p>Temperature: {weather.main.temp - 273.15}°C</p> {/* Convert from Kelvin to Celsius */}
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
          <p>Pressure: {weather.main.pressure} hPa</p>
          <p>Visibility: {weather.visibility / 1000} km</p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;