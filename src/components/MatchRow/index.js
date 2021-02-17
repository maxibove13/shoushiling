//Dependencies
import { useState, useEffect, useContext } from "react";

import { AuthContext } from "../../App";

// Assets
import "./styles.scss";

const MatchRow = ({ match, id_userMain, token }) => {
  const { dispatch } = useContext(AuthContext);
  const [oponentName, setOponentName] = useState(null);

  const handleResumeMatchClick = () => {
    dispatch({
      type: "RESUME_MATCH",
      payload: match,
    });
  };

  // get oponent's name
  useEffect(() => {
    let idOponent = match.player_2.id_user;
    if (id_userMain === match.player_2.id_user) {
      idOponent = match.player_1.id_user;
    }

    console.log(
      `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/users/nameById`
    );
    fetch(
      `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/users/nameById`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          id_user: idOponent,
        }),
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res;
        }
      })
      .then((oponentName) => {
        setOponentName(oponentName.name);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  const handleRejectMatchClick = () => {
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
          Authorization: token,
        },
        body: JSON.stringify({
          state: "rejected",
          _id: match._id,
          player_1: {
            id_user: match.player_1.id_user,
            points: match.player_1.points,
          },
          player_2: {
            id_user: match.player_2.id_user,
            points: match.player_2.points,
          },
          games: match.state.games,
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
        dispatch({
          type: "GO_HOME",
          payload: match,
        });
      })
      .catch((err) => {
        dispatch({
          type: "FIRST_MOVE_FAILURE",
        });
      });
  };

  if (match.state === "waitingApproval") {
    return (
      <>
        <div className="chooseOponent-row">
          <div className="oponent-name-container">
            <p>{oponentName}</p>
          </div>
          {id_userMain === match.player_1.id_user ? (
            <>
              <div className="points hide">
                <p>{match.player_1.points}</p>
                <p>-</p>
                <p>{match.player_2.points}</p>
              </div>
              <button onClick={handleResumeMatchClick} className="btn-resume-match">
                Reanudar
              </button>
            </>
          ) : (
            <div>
              <button onClick={handleResumeMatchClick} className="chooseOponent-button">
                Aceptar
              </button>
              <button onClick={handleRejectMatchClick} className="chooseOponent-button">
                Rechazar
              </button>
            </div>
          )}
        </div>
      </>
    );
  } else {
    return (
      <div className="chooseOponent-row">
        <p>{oponentName}</p>
        <p>
          {id_userMain === match.player_1.id_user
            ? match.player_1.points
            : match.player_2.points}
        </p>
        <p>
          {id_userMain === match.player_1.id_user
            ? match.player_2.points
            : match.player_1.points}
        </p>
        <button onClick={handleResumeMatchClick} className="chooseOponent-button">
          {match.state === "playing" ? "Reanudar" : "Mostrar"}
        </button>
      </div>
    );
  }
};

export default MatchRow;
