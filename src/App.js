import React, { Component, useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

function ScoresComponent() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [games, setGames] = useState([]);

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch("http://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&startDate=2021-09-04&endDate=2021-09-04")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          console.log(result)
          setGames(result.dates[0].games);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <ul>
        {games.map(item => (
          <li key={item.gamePk}>
            {item.teams.away.team.name} {item.teams.home.team.name}
          </li>
        ))}
      </ul>
    );
  }
}

export { App, ScoresComponent };
