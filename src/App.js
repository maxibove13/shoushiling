// Dependencies
import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Pages
import { Home, ForgottenPassword, Login, Register, Play } from "./pages";

// Components
import { Nav } from "./components";

export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: false,
  userData: null,
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
    default:
      return state;
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
      </AuthContext.Provider>

      <div className="App">
        <Switch>
          {/* <Route path="/login" exact>
            <Login />
          </Route>
          <Route path="/home" exact>
            <Home />
          </Route> */}
          <Route path="/play" exact>
            <Play />
          </Route>
          <Route path="/" exact>
            <AuthContext.Provider value={{ state, dispatch }}>
              {!state.isAuthenticated ? <Login /> : <Home />}
            </AuthContext.Provider>
          </Route>
          <Route path="/login/forgot" exact>
            <ForgottenPassword />
          </Route>
          <Route path="/home" exact>
            <Home />
          </Route>
          <Route path="/register" exact>
            <AuthContext.Provider value={{ dispatch }}>
              <Register />
            </AuthContext.Provider>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
