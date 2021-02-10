// Dependencies
import { useContext } from "react";
import { AuthContext } from "../../App";

// Assets
import "./styles.scss";

const Home = () => {
  const { state, dispatch } = useContext(AuthContext);

  return (
    <div className="title-container">
      <h2 className="welcome">Hola {state.userData.name}</h2>
      {/* <button onClick={() => dispatch({ type: "LOGOUT" })}>
        Cerrar sesión
      </button> */}
    </div>
  );
};

export default Home;
