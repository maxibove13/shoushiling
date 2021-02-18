//Dependencies
import { useState, useEffect, useContext } from "react";

import { AuthContext } from "../../App";

// Components
import { ChooseMove, ShowMoves, ShowPoints } from "../../components";

// Assets
import "./styles.scss";

const initialLocalState = {
  oponentName: null,
  chosenMove: null,
  isSubmitting: false,
  hasError: false,
  userKnowItsResult: false,
};

const Match = () => {
  const { state, dispatch } = useContext(AuthContext);

  // state to determines if own user is host or oponent (player_1 or 2)
  const [localState, setLocalState] = useState(() => {
    return initialLocalState;
  });

  const pointsPlayer_1 = state.match.player_1.points;
  const pointsPlayer_2 = state.match.player_2.points;
  const userWins =
    (pointsPlayer_1 > pointsPlayer_2 && state.userData._id === state.match.player_1.id_user) ||
    (pointsPlayer_1 < pointsPlayer_2 && state.userData._id === state.match.player_2.id_user);

  //get oponents name
  useEffect(() => {
    let idOponent = state.match.player_2.id_user;
    if (state.userData._id === state.match.player_2.id_user) {
      idOponent = state.match.player_1.id_user;
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
          Authorization: state.token,
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
        setLocalState({ ...localState, oponentName: oponentName.name });
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, [
    localState.oponentName,
    localState.userKnowItsResult,
    state.match.player_1,
    state.match.player_2,
    state.userData._id,
    state.token,
  ]);

  // render different scenarios
  const renderMoves = () => {
    switch (state.match.state) {
      case "waitingApproval":
        if (state.userData._id === state.match.player_1.id_user) {
          if (state.match.games.length === 0) {
            return (
              <>
                <h3>¡Que comience el juego!</h3>
                <h3>Elige tu jugada</h3>
                <ChooseMove chosenMove={handleChosenMove} />

                <button
                  className={localState.chosenMove === null ? "disabled btn-play" : "btn-play"}
                  disabled={localState.chosenMove === null}
                  onClick={submitMove}
                >
                  Jugar
                </button>
              </>
            );
          } else {
            return (
              <>
                <h3>Esperando respuesta de {localState.oponentName}</h3>
                <button className="btn-continue" onClick={goHome}>
                  Volver
                </button>
              </>
            );
          }
        } else {
          return (
            <>
              <h3>¡Que comience el juego!</h3>
              <h3>Elige tu jugada</h3>
              {/* remember to update state to playing */}
              <ChooseMove chosenMove={handleChosenMove} />
              <button
                className={localState.chosenMove === null ? "disabled btn-play" : "btn-play"}
                disabled={localState.chosenMove === null}
                onClick={submitMove}
              >
                Jugar
              </button>
            </>
          );
        }
        break;
      case "playing":
        if (
          // If player_1 && even game || if player_2 && odd game (cause player_1 starts)
          (state.userData._id === state.match.player_1.id_user &&
            state.match.games.length % 2 === 0) ||
          (state.userData._id === state.match.player_2.id_user &&
            state.match.games.length % 2 === 1)
        ) {
          // if game is incomplete move, if user already saw its result move.
          if (
            state.match.games[state.match.games.length - 1].wonBy === undefined ||
            localState.userKnowItsResult
          ) {
            return (
              <>
                <h3>Que siga el juego!</h3>
                <h3>Elige tu jugada</h3>
                {/* remember to update state to playing */}
                <ChooseMove chosenMove={handleChosenMove} />

                <button
                  className={localState.chosenMove === null ? "disabled btn-play" : "btn-play"}
                  disabled={localState.chosenMove === null}
                  onClick={submitMove}
                >
                  Jugar
                </button>
              </>
            );
            // If game is complete, show results first
          } else {
            return (
              <div className="renderMoves-container">
                {renderResultMatch()}
                <ShowMoves
                  moves={
                    state.userData._id === state.match.player_1.id_user
                      ? [
                          state.match.games[state.match.games.length - 1].movePlayer_1,
                          state.match.games[state.match.games.length - 1].movePlayer_2,
                        ]
                      : [
                          state.match.games[state.match.games.length - 1].movePlayer_2,
                          state.match.games[state.match.games.length - 1].movePlayer_1,
                        ]
                  }
                />
                <button className="btn-continue" onClick={handleKeepPlaying}>
                  Continuar
                </button>
              </div>
            );
          }
        } else {
          return (
            <>
              <h3>Esperando jugada de {localState.oponentName}</h3>
              <ShowMoves
                moves={
                  state.userData._id === state.match.player_1.id_user
                    ? [
                        state.match.games[state.match.games.length - 1].movePlayer_1,
                        state.match.games[state.match.games.length - 1].movePlayer_2,
                      ]
                    : [
                        state.match.games[state.match.games.length - 1].movePlayer_2,
                        state.match.games[state.match.games.length - 1].movePlayer_1,
                      ]
                }
              />
              <button className="btn-continue" onClick={goHome}>
                Volver
              </button>
            </>
          );
        }
        break;
      case "finished":
        return (
          <>
            <div className="renderMoves-container">
              {renderResultMatch()}
              <ShowMoves
                moves={
                  state.userData._id === state.match.player_1.id_user
                    ? [
                        state.match.games[state.match.games.length - 1].movePlayer_1,
                        state.match.games[state.match.games.length - 1].movePlayer_2,
                      ]
                    : [
                        state.match.games[state.match.games.length - 1].movePlayer_2,
                        state.match.games[state.match.games.length - 1].movePlayer_1z,
                      ]
                }
              />
            </div>
            <button>Revancha</button>
            <button className="btn-continue">Volver</button>
          </>
        );
        break;
      default:
        return null;
    }
  };

  const submitMove = () => {
    if (state.match.games.length > 0) {
      if (state.match.games[state.match.games.length - 1].wonBy === undefined) {
        updateAndCloseGame();
      } else {
        pushNewGame();
      }
    } else {
      pushNewGame();
    }
  };

  const handleChosenMove = (chosenMoveFromChild) => {
    setLocalState({
      ...localState,
      chosenMove: chosenMoveFromChild,
    });
  };

  const handleKeepPlaying = () => {
    setLocalState({
      ...localState,
      userKnowItsResult: true,
    });
  };

  const pushNewGame = () => {
    // define the body request to push a new game assuming user is player_1
    let bodyReq = JSON.stringify({
      _id: state.match._id,
      games: [
        {
          gameNumber: state.match.games.length + 1,
          movePlayer_1: localState.chosenMove,
          movePlayer_2: "null",
        },
      ],
    });

    // if user is player_2, correct the bodyReq by updating movePlayer_2 instead of 1.
    if (state.userData._id === state.match.player_2.id_user) {
      bodyReq = JSON.stringify({
        _id: state.match._id,
        games: [
          {
            gameNumber: state.match.games.length + 1,
            movePlayer_1: "null",
            movePlayer_2: localState.chosenMove,
          },
        ],
      });
    }

    console.log(
      `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/matches/pushNewGame`
    );
    fetch(
      `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/matches/pushNewGame`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: state.token,
        },
        body: bodyReq,
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
          type: "RESUME_MATCH",
          payload: match,
        });
      })
      .catch((err) => {
        setLocalState({
          ...localState,
          isSubmitting: false,
          hasError: true,
        });
      });
  };

  const updateAndCloseGame = () => {
    let gameUpdated = state.match.games.slice(-1);
    let wonBy = 0;

    wonBy = checkGameWinner(wonBy);

    // wonBy == 1 means that user wons. We have to determine if user is player_1 or 2.
    let updatedPointsPlayer_1 = pointsPlayer_1;
    let updatedPointsPlayer_2 = pointsPlayer_2;
    if (wonBy > 0) {
      if (
        (wonBy === 1 && state.userData._id === state.match.player_1.id_user) ||
        (wonBy === 2 && state.userData._id === state.match.player_2.id_user)
      ) {
        updatedPointsPlayer_1 = pointsPlayer_1 + 1;
      } else {
        updatedPointsPlayer_2 = pointsPlayer_2 + 1;
      }
    }

    let updatedMatchState = "playing";
    if (updatedPointsPlayer_1 > 1 || updatedPointsPlayer_2 > 1) {
      updatedMatchState = "finished";
    }

    // if user is player_1 push the game with its move, else update movePlayer_2.
    if (state.userData._id === state.match.player_1.id_user) {
      gameUpdated[0].movePlayer_1 = localState.chosenMove;
    } else {
      gameUpdated[0].movePlayer_2 = localState.chosenMove;
    }
    gameUpdated[0].wonBy = wonBy;
    console.log("wonBy", wonBy);
    console.log(gameUpdated);

    console.log(
      `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/matches/updateMatch`
    );
    fetch(
      `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/matches/updateMatch`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: state.token,
        },
        body: JSON.stringify({
          state: updatedMatchState,
          _id: state.match._id,
          player_1: {
            id_user: state.match.player_1.id_user,
            points: updatedPointsPlayer_1,
          },
          player_2: {
            id_user: state.match.player_2.id_user,
            points: updatedPointsPlayer_2,
          },
          games: gameUpdated,
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
          type: "RESUME_MATCH",
          payload: match,
        });
      })
      .catch((err) => {
        setLocalState({
          ...localState,
          isSubmitting: false,
          hasError: true,
        });
      });
  };

  const renderResultMatch = () => {
    if (state.match.state === "playing") {
      if (state.match.games[state.match.games.length - 1].wonBy !== 0) {
        return (
          <h3 className={userWins ? "match-result win-match" : "match-result lose-match"}>
            {userWins ? "Ganaste la jugada" : "Perdiste la jugada"}
          </h3>
        );
      } else {
        return <h3 className="match-result">Empatan la jugada</h3>;
      }
    } else {
      return (
        <h3 className={userWins ? "match-result win-match" : "match-result lose-match"}>
          {userWins ? "Ganaste la partida!" : "Perdiste la partida!"}
        </h3>
      );
    }
  };

  const goHome = () => {
    dispatch({
      type: "GO_HOME",
    });
  };

  const checkGameWinner = (wonBy) => {
    let oponentMove = state.match.games[state.match.games.length - 1].movePlayer_2;
    if (state.userData._id === state.match.player_2.id_user) {
      oponentMove = state.match.games[state.match.games.length - 1].movePlayer_1;
    }

    switch (true) {
      case oponentMove === "Rock" && localState.chosenMove === "Rock":
        return (wonBy = 0);
      case oponentMove === "Rock" && localState.chosenMove === "Paper":
        return (wonBy = 1);
      case oponentMove === "Rock" && localState.chosenMove === "Scissor":
        return (wonBy = 2);
      case oponentMove === "Paper" && localState.chosenMove === "Rock":
        return (wonBy = 2);
      case oponentMove === "Paper" && localState.chosenMove === "Paper":
        return (wonBy = 0);
      case oponentMove === "Paper" && localState.chosenMove === "Scissor":
        return (wonBy = 1);
      case oponentMove === "Scissor" && localState.chosenMove === "Rock":
        return (wonBy = 1);
      case oponentMove === "Scissor" && localState.chosenMove === "Paper":
        return (wonBy = 2);
      case oponentMove === "Scissor" && localState.chosenMove === "Scissor":
        return (wonBy = 0);
      default:
        return;
    }
  };
  // Different scenarios when clicking resume match or show button in home

  return (
    <div className="match">
      {renderMoves()}
      <ShowPoints
        points={
          state.userData._id === state.match.player_1.id_user
            ? [pointsPlayer_1, pointsPlayer_2]
            : [pointsPlayer_2, pointsPlayer_1]
        }
        names={[state.userData.name, localState.oponentName]}
      />
    </div>
  );
};

export default Match;
