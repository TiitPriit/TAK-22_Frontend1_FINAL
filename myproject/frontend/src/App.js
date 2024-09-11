import React, { useState } from 'react';
import Login from './components/Login';
import TodoApp from './components/TodoApp';
import WeatherApp from './components/WeatherApp';

const App = () => {
  const [token, setToken] = useState(null);

  if (!token) {
    return <Login setToken={setToken} />;
  }
  
  return (
    <div>
      <h1>TODO Application</h1>
      <TodoApp token={token} />
      <h1>Weather Application</h1>
      <WeatherApp token={token} />
    </div>
  );
};

export default App;