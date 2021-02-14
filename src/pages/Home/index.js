// Dependencies
import { useContext } from "react";

import { AuthContext } from "../../App";

// Components
import { UsersMatches } from "../../components";

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
    <>
      <div className="title-container">
        <h2 className="welcome">Hola {state.userData.name}</h2>
        <div className="buttons-container">
          <div className="button-container">
            <button onClick={handleNewMatch}>Nueva Partida</button>
          </div>
        </div>
      </div>

      <UsersMatches />
    </>
  );
};

export default Home;
