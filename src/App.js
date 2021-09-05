import React, { Component, useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import './bulma.css';

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

  let z = () => { setGames([]);};

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
      <div>
        <button onClick={z}>clicka meh</button>
      <table class="table">
        <thead>
          <tr>
            <th>Home Team</th>
            <th></th>
            <th>Away Team</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {games.map(item => (
          <tr key={item.gamePk}>
            <td>{item.teams.home.team.name}</td>
            <td>{item.teams.home.score}</td>
            <td>{item.teams.away.team.name}</td>
            <td>{item.teams.away.score}</td>
          </tr>
        ))}
        </tbody>
      </table>
      </div>
      
    );
  }
}

export { App, ScoresComponent };
