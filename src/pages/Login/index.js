// Dependencies
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

//Components
import { Button } from "../../components";

// Assets
import "./styles.scss";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const Login = () => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("https://shoushilingapi.herokuapp.com/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const users = await res.json();
      const name = users[0].name;
      console.log(name);
      setUserData(name);
    };

    fetchUser();
  }, []);

  console.log(userData);

  return (
    <div>
      <div className="title-container">
        <h2>Shoushiling</h2>
        <h3>Piedra, papel y tijera</h3>
      </div>
      <form>
        <label className="small-text">
          Email <input type="text" name="email" />
        </label>
        <label className="small-text">
          Contraseña <input type="text" name="password" />
        </label>
        <Link to="/login/forgot" />
        <p className="small-text forgot-pass">¿Olvidaste tu contraseña?</p>
        <Link />
      </form>

      <div className="buttons-container">
        <Button text={"Iniciar sesión"} />
        <Button
          buttonVariant={"button-google"}
          text={"Iniciar sesión con Google"}
          iconButton={faGoogle}
        />
      </div>
      <div className="buttons-container ">
        <h3>¿No tienes cuenta?</h3>
        <Button buttonVariant={"button-secondary"} text={"Regístrate"} />
      </div>
    </div>
  );
};

export default Login;
