// Dependencies
import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Pages
import { Home, Login, Register } from "./pages";

// Components
import { Nav, ChooseOponent, Match } from "./components";

export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: false,
  userData: null,
  setPage: "Home",
  id_oponent: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      // action.payload contains the exact object delivered by the API, and the name of that object is userFound
      localStorage.setItem(
        "userData",
        JSON.stringify(action.payload.userFound)
      );
      localStorage.setItem(
        "token",
        JSON.stringify(action.payload.userFound.token)
      );

      return {
        ...state,
        isAuthenticated: true,
        userData: action.payload.userFound,
        token: action.payload.userFound.token,
      };
    case "LOGOUT":
      localStorage.clear();

      return {
        ...state,
        isAuthenticated: false,
        userData: null,
        token: null,
      };
    case "CHOOSING_OPONENT":
      return {
        ...state,
        setPage: "ChooseOponent",
      };
    default:
      return state;
    case "GO_HOME":
      return {
        ...state,
        setPage: "Home",
      };
    case "MATCH":
      return {
        ...state,
        setPage: "Match",
        id_oponent: action.payload,
      };
  }
};

// Assets

function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  useEffect(() => {
    const userFound = JSON.parse(localStorage.getItem("userData"));
    const token = localStorage.getItem("token");
    if (userFound && token) {
      dispatch({
        type: "LOGIN",
        payload: {
          userFound,
          token,
        },
      });
    }
  }, []);

  return (
    <Router>
      <AuthContext.Provider value={{ state, dispatch }}>
        <Nav />
        <div className="App">
          <Switch>
            <Route exact path="/">
              {!state.isAuthenticated ? (
                <Login />
              ) : state.setPage === "ChooseOponent" ? (
                <ChooseOponent />
              ) : state.setPage === "Match" ? (
                <Match />
              ) : (
                <Home />
              )}
            </Route>

            <Route path="/register" exact>
              <Register />
            </Route>
          </Switch>
        </div>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
