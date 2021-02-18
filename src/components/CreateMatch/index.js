// Dependencies
import { useEffect, useReducer, useContext } from "react";

import { AuthContext } from "../../App";

// Components
import { Loading } from "../../components";

// Assets
import "./styles.scss";

const initiallocalState = {
  match: {
    player_1: {
      id_user: null,
    },
    player_2: {
      id_user: null,
    },
  },
  isFetching: false,
  hasError: false,
  matchCreated: false,
  errorMessage: null,
};

// Reducer to handle new match action
const reducer = (localState, action) => {
  switch (action.type) {
    case "NEW_MATCH_REQUEST":
      return {
        ...localState,
        isFetching: true,
        hasError: false,
      };
    case "NEW_MATCH_SUCCESS":
      return {
        ...localState,
        isFetching: false,
        matchCreated: true,
        match: action.payload,
      };
    case "NEW_MATCH_FAILURE":
      return {
        ...localState,
        isFetching: false,
        hasError: true,
        errorMessage: action.payload,
      };
    default:
      return localState;
  }
};

const CreateMatch = () => {
  const [localState, localDispatch] = useReducer(reducer, initiallocalState);
  const { state: authState, dispatch } = useContext(AuthContext);

  useEffect(() => {
    //
    localDispatch({
      type: "NEW_MATCH_REQUEST",
    });

    console.log(authState.id_oponent);
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
        if (res.ok || res.status === 400) {
          return res.json();
        }
        throw res;
      })
      .then((resObject) => {
        if (!resObject.msg) {
          dispatch({
            type: "RESUME_MATCH",
            payload: resObject,
          });
        } else {
          localDispatch({
            type: "NEW_MATCH_FAILURE",
            payload: resObject.msg,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        localDispatch({
          type: "NEW_MATCH_FAILURE",
          payload: "Error inesperado",
        });
      });
  }, []);

  const goBackChooseOponentClick = () => {
    dispatch({
      type: "CHOOSING_OPONENT",
    });
  };

  return (
    <>
      {localState.isFetching ? (
        <Loading />
      ) : localState.hasError ? (
        <div className="already-have-match-container">
          <h3>{localState.errorMessage}</h3>
          <button onClick={goBackChooseOponentClick}>Volver</button>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default CreateMatch;
