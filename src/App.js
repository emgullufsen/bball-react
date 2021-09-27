import React, { Component, useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import './bulma.css';
import { yankDateString } from './yank';
import { io } from "socket.io/client-dist/socket.io";

function ScoresComponent() {
  const endPointBase = "https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1";
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [games, setGames] = useState([]);
  const [gdate, setGdate] = useState(new Date());
  const [resp, setResp] = useState({});
  let clearGames = () => { setGames([]); };
  let addOneDay = () => { setGdate(new Date(gdate.setDate(gdate.getDate() + 1))); };
  let subOneDay = () => { setGdate(new Date(gdate.setDate(gdate.getDate() - 1))); };
  let setGdateWithString = (e) => {
    let new_d = new Date(e.target.value);
    new_d.setHours(new_d.getHours() + 12);
    setGdate(new_d);
  };
  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    const socket = io({ path: "/scoresws" });
    socket.on('scoresupdate', function (scores) {
      setResp(scores);
    });
  }, []);

  useEffect(() => {
    if (resp.dates !== undefined){
      console.log(`scores date = ${resp.dates[0].date}, gdate = ${yankDateString(gdate)} and isSame = ${yankDateString(gdate) == resp.dates[0].date}`);
      if (resp.dates[0].date == yankDateString(gdate)){
        setGames(resp.dates[0].games);
      }
    }
  }, [resp]);

  useEffect(() => {
    let ds = yankDateString(gdate);
    fetch(`${endPointBase}&startDate=${ds}&endDate=${ds}`)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          console.log(result);
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
      <div className="columns is-centered">
        <div className="column is-one-fifth">
          <button onClick={subOneDay}>Prev Day</button>
          <div>
            <label htmlFor="date_picky">Or, pick a day:</label>
            <input type="date" id="date_picky" min="2021-03-01" max="2021-10-05" onChange={setGdateWithString} value={yankDateString(gdate)} />
          </div>
        </div>
        <div className="column is-one-third">
          <table className="table">
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
                  <td>{item.teams.home.team.name}<img src={'/images/' + item.teams.home.team.id + '.svg'}  /></td>
                  <td>{item.teams.home.score}</td>
                  <td>{item.teams.away.team.name}<img src={'/images/' + item.teams.away.team.id + '.svg'}  /></td>
                  <td>{item.teams.away.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="column is-one-fifth">
          <button onClick={addOneDay}>Next Day</button>
        </div>
      </div>

    );
  }
}

export { ScoresComponent };