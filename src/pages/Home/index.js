// Dependencies
import { useEffect, useContext, useReducer } from "react";

import { AuthContext } from "../../App";

// Components
import { Loading, UsersMatches } from "../../components";

// Assets
import "./styles.scss";

const initialLocalState = {
  matches: [],
  isFetching: true,
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

const Home = () => {
  const { state, dispatch } = useContext(AuthContext);
  const [localState, localDispatch] = useReducer(reducer, initialLocalState);

  const handleNewMatch = () => {
    dispatch({
      type: "CHOOSING_OPONENT",
    });
  };

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
          Authorization: state.token,
        },
        body: JSON.stringify({
          id_user: state.userData._id,
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
  }, [state, dispatch]);

  return (
    <>
      {localState.isFetching ? (
        <Loading />
      ) : (
        <>
          <div className="welcome-container">
            <h3 className="welcome">Hola {state.userData.name},</h3>
          </div>
          <div className="buttons-container">
            <div className="button-container">
              <button className="btn-new-game" onClick={handleNewMatch}>
                Nueva Partida
              </button>
            </div>
          </div>
          <UsersMatches matches={localState.matches} />
        </>
      )}
    </>
  );
};

export default Home;
