// Dependencies
import { useEffect, useReducer, useContext } from "react";

import { AuthContext } from "../../App";

// Assets
import "./styles.scss";

const initialMatchState = {
  match: {
    player_1: {
      id_user: "60218dba5a4ddb37d0e63ecd",
    },
    player_2: {
      id_user: "60218dba5a4ddb37d0e63ecd",
    },
  },
  isFetching: false,
  hasError: false,
  matchCreated: false,
};

// Reducer to handle new match action
const reducer = (matchState, action) => {
  switch (action.type) {
    case "NEW_MATCH_REQUEST":
      return {
        ...matchState,
        // match: {
        //   player_1: { id_user: action.payload.userData._id },
        //   player_2: { id_user: action.payload.id_oponent },
        // },
        isFetching: true,
        hasError: false,
      };
    case "NEW_MATCH_SUCCESS":
      return {
        ...matchState,
        isFetching: false,
        matchCreated: true,
        match: action.payload.match,
      };
    case "NEW_MATCH_FAILURE":
      return {
        ...matchState,
        isFetching: false,
        hasError: true,
      };
    default:
      return matchState;
  }
};

const Match = () => {
  const [matchState, dispatch] = useReducer(reducer, initialMatchState);
  const { state: authState } = useContext(AuthContext);

  //console.log(authState.id_oponent, authState.userData._id);

  useEffect(() => {
    //
    dispatch({
      type: "NEW_MATCH_REQUEST",
    });
    console.log(authState.id_oponent, authState.userData._id);
    // Fetch a create match request
    console.log(
      `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/matches`
    );
    fetch(
      `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/matches`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: authState.token,
        },
        body: JSON.stringify({
          player_1: { id_user: authState.userData._id },
          player_2: { id_user: authState.id_oponent },
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
          type: "NEW_MATCH_SUCCESS",
          payload: match,
        });
      })
      .catch((err) => {
        dispatch({
          type: "NEW_MATCH_FAILURE",
        });
      });
  }, []);

  const makeMove = () => {};

  return (
    <>
      {!matchState.matchCreated ? (
        <h2>Creating match</h2>
      ) : (
        <div>
          <ul>
            <li>Piedra</li>
            <li>Papel</li>
            <li>Tijera</li>
          </ul>
        </div>
      )}
    </>
  );
};

// <div className="chooseOponent-row">
//   <p>{user.name}</p>
//   <button onClick={chooseOponentAction} className="chooseOponent-button">
//     {matchState.isFetching
//       ? "Cargando"
//       : matchState.hasError
//       ? "Error"
//       : "Elegir"}
//   </button>
// </div>;

export default Match;
