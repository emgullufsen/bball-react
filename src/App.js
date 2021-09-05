import React, { Component, useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import './bulma.css';

const getTodayDate = (d) => {
  let day = d.getDate().toString();
  let month = (d.getMonth() + 1).toString();
  let year = d.getFullYear().toString();
  let day_p = (day.length < 2) ? `0${day}` : day;
  let month_p = (month.length < 2) ? `0${month}` : month;
  return `${year}-${month_p}-${day_p}`;
};

function ScoresComponent() {
  const endPointBase = "http://statsapi.mlb.com/api/v1/schedule/games/?sportId=1";
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [games, setGames] = useState([]);
  const [gdate, setGdate] = useState(new Date());

  let clearGames = () => { setGames([]); };

  let addOneDay = () => { setGdate(new Date(gdate.setDate(gdate.getDate() + 1))); };
  let subOneDay = () => { setGdate(new Date(gdate.setDate(gdate.getDate() - 1))); };
  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    let ds = getTodayDate(gdate);
    fetch(`${endPointBase}&startDate=${ds}&endDate=${ds}`)
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
  }, [gdate]);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div class="columns is-centered">
        <div class="column is-one-fifth">
          <button onClick={subOneDay}>Prev Day</button>
        </div>
        <div class="column is-one-third">
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
        <div class="column is-one-fifth">
          <button onClick={addOneDay}>Next Day</button>
        </div>
      </div>

    );
  }
}

export { ScoresComponent };