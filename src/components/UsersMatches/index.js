//Dependencies
import { useState, useContext } from "react";

import { AuthContext } from "../../App";

// Components
import { MatchRow } from "../../components";

// Assets
import "./styles.scss";

const UsersMatches = ({ matches }) => {
  const { state, dispatch } = useContext(AuthContext);
  const [activeMatches, setActiveMatches] = useState(matches);

  const handleRejectedMatchOnParent = (rejectedMatch) => {
    console.log(matches, rejectedMatch);
    let newMatches = matches.filter((match) => {
      return match._id !== rejectedMatch._id;
    });
    console.log(newMatches);
    setActiveMatches(newMatches);

    // if new match is rejected fetch to update match state to rejected
    console.log(
      `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/matches/rejectMatch`
    );
    fetch(
      `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/matches/rejectMatch`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: state.token,
        },
        body: JSON.stringify({
          state: "rejected",
          _id: rejectedMatch._id,
          player_1: {
            id_user: rejectedMatch.player_1.id_user,
            points: rejectedMatch.player_1.points,
          },
          player_2: {
            id_user: rejectedMatch.player_2.id_user,
            points: rejectedMatch.player_2.points,
          },
          games: rejectedMatch.state.games,
        }),
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then((match) => {
        // setRejectedMatch(true);
        console.log(match);
        // dispatch({
        //   type: "GO_HOME",
        //   payload: match,
        // });
      })
      .catch((err) => {
        dispatch({
          type: "FIRST_MOVE_FAILURE",
        });
      });
  };

  return (
    <>
      <div className="matches-list-container">
        <h3>Partidas en curso</h3>
        <div className="table activeMatches">
          <div className="table-header">
            <p>Oponente</p>
            <p>Marcador</p>
            <p className="hide-always">Jugadas</p>
          </div>
          {activeMatches.some((match) => {
            return match.state === "waitingApproval" || match.state === "playing";
          }) ? (
            activeMatches.map((match) => {
              if (match.state === "waitingApproval" || match.state === "playing") {
                return (
                  <MatchRow
                    key={match._id}
                    match={match}
                    rejectedMatch={() => handleRejectedMatchOnParent(match)}
                  />
                );
              }
              return null;
            })
          ) : (
            <p className="no-matches">No tienes partidas en curso</p>
          )}
        </div>
        <h3>Últimas partidas</h3>
        <div className="table finished-matches">
          <div className="table-header">
            <p>Oponente</p>
            <p>Resultado</p>
            <p className="hide-always">Jugadas</p>
          </div>
          {activeMatches.some((match) => {
            return match.state === "finished";
          }) ? (
            activeMatches.map((match) => {
              if (match.state === "finished") {
                return <MatchRow key={match._id} match={match} />;
              }
              return null;
            })
          ) : (
            <p className="no-matches">Aún no tienes partidas finalizadas</p>
          )}
        </div>
      </div>
    </>
  );
};

export default UsersMatches;
