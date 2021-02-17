//Dependencies
import { useEffect, useContext, useReducer } from "react";

import { AuthContext } from "../../App";

// Components
import { MatchRow } from "../../components";

// Assets
import "./styles.scss";

const initialLocalState = {
  matches: [],
  isFetching: false,
  hasError: false,
  oponentName: null,
};

// Reducer
const reducer = (localState, action) => {
  switch (action.type) {
    case "FETCH_MATCHES_REQUEST":
      return {
        ...localState,
        isFetching: true,
        hasError: false,
      };
    case "FETCH_MATCHES_SUCCESS":
      return {
        ...localState,
        isFetching: false,
        hasError: false,
        matches: action.payload,
      };
    case "FETCH_MATCHES_FAILURE":
      return {
        ...localState,
        isFetching: false,
        hasError: true,
      };
    case "FETCH_OPONENT_NAME_SUCCESS":
      return {
        ...localState,
        isFetching: false,
        hasError: false,
        oponentName: action.payload,
      };
    case "FETCH_OPONENT_NAME_FAILURE":
      return {
        ...localState,
        isFetching: false,
        hasError: true,
      };
    default:
      return localState;
  }
};

const UsersMatches = () => {
  const [localState, localDispatch] = useReducer(reducer, initialLocalState);
  const { state: authState, dispatch } = useContext(AuthContext);

  useEffect(() => {
    // Notify is about to fetch
    localDispatch({
      type: "FETCH_MATCHES_REQUEST",
    });

    // Fetch matches by associated user
    console.log(
      `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/matches/byUserId`
    );
    fetch(
      `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/matches/byUserId`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: authState.token,
        },
        body: JSON.stringify({
          id_user: authState.userData._id,
        }),
      }
    )
      .then((res) => {
        if (res.ok || res.status === 401) {
          return res.json();
        } else {
          throw res;
        }
      })
      .then((matches) => {
        // This is not working.
        if (matches.status === 401) {
          dispatch({
            type: "LOGOUT",
          });
        } else {
          localDispatch({
            type: "FETCH_MATCHES_SUCCESS",
            payload: matches,
          });
        }
      })
      .catch((err) => {
        console.log("hereErr", err);
        localDispatch({
          type: "FETCH_MATCHES_FAILURE",
        });
      });
  }, [authState, dispatch]);

  return (
    <>
      {localState.isFetching ? (
        "Cargando"
      ) : localState.hasError ? (
        "Error inesperado"
      ) : (
        <div className="matches-list-container">
          <h3>Partidas en curso</h3>
          <div className="table activeMatches">
            <div className="table-header">
              <p>Oponente</p>
              <p>Marcador</p>
              <p className="hide-always">Jugadas</p>
            </div>
            {localState.matches.some((match) => {
              return match.state === "waitingApproval" || match.state === "playing";
            }) ? (
              localState.matches.map((match) => {
                if (match.state === "waitingApproval" || match.state === "playing") {
                  return <MatchRow key={match._id} match={match} />;
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
            {localState.matches.some((match) => {
              return match.state === "finished";
            }) ? (
              localState.matches.map((match) => {
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
      )}
    </>
  );
};

export default UsersMatches;
