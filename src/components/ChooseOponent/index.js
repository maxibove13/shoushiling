// Dependencies
import { useEffect, useReducer, useContext } from "react";

import { AuthContext } from "../../App";

//Components
import { OponentRow } from "..";

// Assets
import "./styles.scss";

const initialLocalState = {
  users: [],
  isFetching: false,
  hasError: false,
};

// Reducer
const reducer = (localState, action) => {
  switch (action.type) {
    case "FETCH_USERS_REQUEST":
      return {
        ...localState,
        isFetching: true,
        hasError: false,
      };
    case "FETCH_USERS_SUCCESS":
      return {
        ...localState,
        isFetching: false,
        users: action.payload.users,
      };
    case "FETCH_USERS_FAILURE":
      return {
        ...localState,
        isFetching: false,
        hasError: true,
      };
    default:
      return localState;
  }
};

const ChooseOponent = () => {
  const [localState, dispatch] = useReducer(reducer, initialLocalState);
  const { state: authState, dispatch: appDispatch } = useContext(AuthContext);

  // Execute at first render
  useEffect(() => {
    // Notify is about to fetch
    dispatch({
      type: "FETCH_USERS_REQUEST",
    });

    // Fetch all users (oponents)
    console.log(
      `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/users`
    );
    fetch(
      `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/users`
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res;
        }
      })
      .then((usersData) => {
        dispatch({
          type: "FETCH_USERS_SUCCESS",
          payload: usersData,
        });
      })
      .catch((err) => {
        dispatch({
          type: "FETCH_USERS_FAILURE",
        });
      });
  }, []);

  const fromChildCallbackFunction = (saluteFromChild) => {
    //console.log(saluteFromChild);
    appDispatch({
      type: "CREATE_MATCH",
      payload: saluteFromChild,
    });
  };

  return (
    <div>
      <h2>Elige tu oponente</h2>
      <div className="chooseOponent-table">
        {localState.isFetching
          ? "Cargando"
          : localState.hasError
          ? "Has error"
          : localState.users.map((user) => {
              // Map only if it is not the own user
              if (user._id !== authState.userData._id) {
                return (
                  <OponentRow
                    key={user._id}
                    toParent={fromChildCallbackFunction}
                    user={user}
                  ></OponentRow>
                );
              }
            })}
      </div>
    </div>
  );
};

export default ChooseOponent;
