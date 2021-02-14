//Dependencies
import { useState, useEffect, useContext } from "react";

import { AuthContext } from "../../App";

// Assets
import "./styles.scss";

const MatchRow = ({ match, id_userMain, token }) => {
  const { state: authState, dispatch } = useContext(AuthContext);
  const [oponentName, setOponentName] = useState(null);
  // state to determines if own user is host or oponent (player_1 or 2)
  const [userIsHost, setUserIsHost] = useState(true);

  useEffect(() => {
    // To request the oponent name, first check if Oponent is player 1 or 2.
    let idOponent = match.player_2.id_user;
    if (id_userMain === match.player_2.id_user) {
      setUserIsHost(false);
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

  const handleResumeMatchClick = () => {
    dispatch({
      type: "RESUME_MATCH",
      payload: match,
    });
  };

  const handleRejectMatchClick = () => {
    // if new match is rejected fetch to update match state to rejected
    console.log(
      `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/matches`
    );
    fetch(
      `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/matches`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: authState.token,
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
          games: [
            {
              gameNumber: 1,
              movePlayer_1: match.player_1.movePlayer_1,
            },
          ],
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
          type: "FIRST_MOVE_SUCCESS",
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
          <p>{oponentName}</p>
          {userIsHost ? (
            <>
              <div>
                <p>{match.player_1.points}</p>
                <p>{match.player_2.points}</p>
              </div>
              <button onClick={handleResumeMatchClick} className="chooseOponent-button">
                Esperando
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
        <p>{match.player_1.points}</p>
        <p>{match.player_2.points}</p>
        <button onClick={handleResumeMatchClick} className="chooseOponent-button">
          {match.state === "playing" ? "Reanudar" : "Mostrar"}
        </button>
      </div>
    );
  }
};

export default MatchRow;
