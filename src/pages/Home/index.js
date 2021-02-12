// Dependencies
import { useState, useContext } from "react";

import { AuthContext } from "../../App";

// Assets
import "./styles.scss";

const Home = () => {
  const { state, dispatch } = useContext(AuthContext);

  const handleNewMatch = () => {
    dispatch({
      type: "CHOOSING_OPONENT",
    });
  };

  return (
    <div className="title-container">
      <h2 className="welcome">Hola {state.userData.name}</h2>
      <div className="buttons-container">
        <div className="button-container">
          <button onClick={handleNewMatch}>Nueva Partida</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
