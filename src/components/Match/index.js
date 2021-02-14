//Dependencies
import { useState, useEffect, useContext } from "react";

import { AuthContext } from "../../App";

// Components
import { ChooseMove, ShowMoves, ShowPoints } from "../../components";

// Assets
import "./styles.scss";

const initialLocalState = {
  userIsHost: true,
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

  // console.log(state.match);
  console.log(state);
  const pointsPlayer_1 = state.match.player_1.points;
  const pointsPlayer_2 = state.match.player_2.points;

  // Get oponent's name. I think it is easier to fetch it here rather than pass it up and down from <MatchRow/> that also fetches the oponent name.
  useEffect(() => {
    // To request the oponent name, first check if Oponent is player 1 or 2.
    let idOponent = state.match.player_2.id_user;
    if (state.userData._id === state.match.player_2.id_user) {
      setLocalState({
        ...localState,
        userIsHost: false,
        isSubmitting: true,
      });
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
        setLocalState({
          ...localState,
          oponentName: oponentName.name,
          isSubmitting: false,
        });
      })
      .catch((err) => {
        console.log("err", err);
        setLocalState({
          ...localState,
          isSubmitting: false,
          hasError: true,
        });
      });
  }, []);

  // render different scenarios
  const renderMoves = () => {
    switch (state.match.state) {
      case "waitingApproval":
        if (localState.userIsHost) {
          if (state.match.games.length === 0) {
            return (
              <>
                <h3>Que empiece el juego!</h3>
                <h3>Elige tu jugada</h3>
                {/* remember to update state to playing */}
                <ChooseMove chosenMove={handleChosenMove} />
                {/* {console.log(localState.chosenMove)} */}
                <button
                  className={localState.chosenMove === null ? "disabled" : ""}
                  disabled={localState.chosenMove === null}
                  onClick={submitMove}
                >
                  Jugar
                </button>
              </>
            );
          } else {
            console.log("here from match");
            return (
              <>
                <h3>Esperando a que {localState.oponentName} acepte la partida</h3>
                <button onClick={goHome}>Volver</button>
              </>
            );
          }
        } else {
          return (
            <>
              <h3>Que empiece el juego!</h3>
              <h3>Elige tu jugada</h3>
              {/* remember to update state to playing */}
              <ChooseMove chosenMove={handleChosenMove} />
              <button
                className={localState.chosenMove === null ? "disabled" : ""}
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
          (localState.userIsHost && !state.match.games[state.match.games.length - 1].wonBy) ||
          (!localState.userIsHost && state.match.games[state.match.games.length - 1].wonBy)
        ) {
          return (
            <>
              <h3>Esperando jugada de {localState.oponentName}</h3>
              <ShowMoves
                moves={[
                  state.match.games[state.match.games.length - 1].movePlayer_1,
                  state.match.games[state.match.games.length - 1].movePlayer_2,
                ]}
              />
            </>
          );
        } else {
          if (!localState.userKnowItsResult) {
            return (
              <>
                {renderResultMatch()}
                <ShowMoves
                  moves={[
                    state.match.games[state.match.games.length - 1].movePlayer_1,
                    state.match.games[state.match.games.length - 1].movePlayer_2,
                  ]}
                />
                <button
                  onClic
                  className={localState.chosenMove === null ? "disabled" : ""}
                  disabled={localState.chosenMove === null}
                  onClick={handleKeepPlaying}
                >
                  Jugar
                </button>
              </>
            );
          } else {
            return (
              <>
                <h3>Que siga el juego!</h3>
                <h3>Elige tu jugada</h3>
                {/* remember to update state to playing */}
                <ChooseMove chosenMove={handleChosenMove} />
                <button
                  className={localState.chosenMove === null ? "disabled" : ""}
                  disabled={localState.chosenMove === null}
                  onClick={submitMove}
                >
                  Jugar
                </button>
              </>
            );
          }
        }
        break;
      case "finished":
        return (
          <>
            {renderResultMatch()}
            <ShowMoves
              moves={[
                state.match.games[state.match.games.length - 1].movePlayer_1,
                state.match.games[state.match.games.length - 1].movePlayer_2,
              ]}
            />
          </>
        );
        break;
      default:
        return null;
    }
  };

  const submitMove = () => {
    // save games in a new variable to later use
    let gamesUpdated = state.match.games;

    if (localState.userIsHost) {
      // update the games array of match
      gamesUpdated.push({
        gameNumber: state.match.games.length + 1,
        movePlayer_1: localState.chosenMove,
      });

      // fetch a put request to update the match
      console.log(
        `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/matches`
      );
      fetch(
        `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/matches`,
        {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            Authorization: state.token,
          },
          body: JSON.stringify({
            state: state.match.state,
            _id: state.match._id,
            player_1: {
              id_user: state.match.player_1.id_user,
              points: pointsPlayer_1,
            },
            player_2: {
              id_user: state.match.player_2.id_user,
              points: pointsPlayer_2,
            },
            games: gamesUpdated,
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
    } else {
      // user is player_2

      // Check the winner of the game, return the winner
      let wonBy = 0;
      checkGameWinner(wonBy);

      let updatedPointsPlayer_1 = pointsPlayer_1;
      let updatedPointsPlayer_2 = pointsPlayer_2;
      if (wonBy === 1) {
        updatedPointsPlayer_1 = pointsPlayer_1 + 1;
      } else if (wonBy === 2) {
        updatedPointsPlayer_2 = pointsPlayer_2 + 1;
      }

      let updatedMatchState = state.match.state;
      if (updatedPointsPlayer_1 > 1 || updatedPointsPlayer_2 > 1) {
        updatedMatchState = "finished";
      }

      // update the last game according to selected move
      gamesUpdated[state.match.games.length - 1].movePlayer_2 = localState.chosenMove;
      gamesUpdated[state.match.games.length - 1].wonBy = wonBy;

      console.log(
        `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/matches`
      );
      fetch(
        `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/matches`,
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
            games: gamesUpdated,
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

  const renderResultMatch = () => {
    if (state.match.state === "playing") {
      if (pointsPlayer_1 !== pointsPlayer_2) {
        return (
          <h3>
            {(pointsPlayer_1 > pointsPlayer_2 && localState.userIsHost) ||
            (pointsPlayer_1 < pointsPlayer_2 && !localState.userIsHost)
              ? "Ganaste la jugada"
              : "Perdiste la jugada"}
          </h3>
        );
      } else {
        return <h3>Empatan la jugada</h3>;
      }
    } else {
      return (
        <h3>
          {(pointsPlayer_1 > pointsPlayer_2 && localState.userIsHost) ||
          (pointsPlayer_1 < pointsPlayer_2 && !localState.userIsHost)
            ? "Ganaste la partida!"
            : "Perdiste la partida!"}
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
    switch (true) {
      case state.match.games[state.match.games.length - 1].movePlayer_1 === "Rock" &&
        localState.chosenMove === "Rock":
        return (wonBy = 0);
      case state.match.games[state.match.games.length - 1].movePlayer_1 === "Rock" &&
        localState.chosenMove === "Paper":
        return (wonBy = 2);
      case state.match.games[state.match.games.length - 1].movePlayer_1 === "Rock" &&
        localState.chosenMove === "Scissor":
        return (wonBy = 1);
      case state.match.games[state.match.games.length - 1].movePlayer_1 === "Paper" &&
        localState.chosenMove === "Rock":
        return (wonBy = 1);
      case state.match.games[state.match.games.length - 1].movePlayer_1 === "Paper" &&
        localState.chosenMove === "Paper":
        return (wonBy = 0);
      case state.match.games[state.match.games.length - 1].movePlayer_1 === "Paper" &&
        localState.chosenMove === "Scissor":
        return (wonBy = 1);
      case state.match.games[state.match.games.length - 1].movePlayer_1 === "Scissor" &&
        localState.chosenMove === "Rock":
        return (wonBy = 2);
      case state.match.games[state.match.games.length - 1].movePlayer_1 === "Scissor" &&
        localState.chosenMove === "Paper":
        return (wonBy = 1);
      case state.match.games[state.match.games.length - 1].movePlayer_1 === "Scissor" &&
        localState.chosenMove === "Scissor":
        return (wonBy = 0);
      default:
        return;
    }
  };
  // Different scenarios when clicking resume match or show button in home

  return (
    <>
      {renderMoves()}
      <ShowPoints
        points={[pointsPlayer_1, pointsPlayer_2]}
        names={[state.userData.name, localState.oponentName]}
      />
    </>
  );
};

export default Match;
