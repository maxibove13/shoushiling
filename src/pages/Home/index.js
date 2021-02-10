// Dependencies
import { useContext } from "react";
import { AuthContext } from "../../App";

// Assets
import "./styles.scss";

const Home = () => {
  //const [userData, setUserData] = useState({ name: "Max" }); // Inicializo userData como {name:"Max"}
  const { state, dispatch } = useContext(AuthContext);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const res = await fetch("http://localhost:5000/users", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const users = await res.json();
  //     const firstUser = users[0];
  //     setUserData(firstUser);
  //   };

  //   fetchUser();
  // }, []);
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
