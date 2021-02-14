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
  const [localState, dispatch] = useReducer(reducer, initialLocalState);
  const { state: authState } = useContext(AuthContext);

  useEffect(() => {
    // Notify is about to fetch
    dispatch({
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
        if (res.ok) {
          return res.json();
        } else {
          throw res;
        }
      })
      .then((matches) => {
        dispatch({
          type: "FETCH_MATCHES_SUCCESS",
          payload: matches,
        });
      })
      .catch((err) => {
        dispatch({
          type: "FETCH_MATCHES_FAILURE",
        });
      });
  }, []);

  return (
    <>
      {localState.isFetching ? (
        "Cargando"
      ) : localState.hasError ? (
        "Error inesperado"
      ) : (
        <>
          <div className="table activeMatches">
            <h3>Partidas en curso</h3>
            {localState.matches.map((match) => {
              if (match.state === "waitingApproval" || match.state === "playing") {
                return (
                  <MatchRow
                    key={match._id}
                    match={match}
                    id_userMain={authState.userData._id}
                    token={authState.token}
                  />
                );
              }
            })}
          </div>
          <div className="table finishedMatches">
            <h3>Histórico de partidas</h3>
            {localState.matches.map((match) => {
              if (match.state === "finished") {
                return <MatchRow key={match._id} match={match} token={authState.token} />;
              }
            })}
          </div>
        </>
      )}
    </>
  );
};

export default UsersMatches;
