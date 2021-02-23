// Dependencies
import { useState, useContext } from "react";
import { AuthContext } from "../../App";

// Assets
import "./styles.scss";

const Login = () => {
  const { dispatch } = useContext(AuthContext);

  // Define input initialState (userData)
  const initialState = {
    email: "",
    password: "",
    isSubmitting: false,
    validationError: null,
  };

  // In order not to run the initialState every time the component is rerender I pass the initial state as a function to useState.
  const [userData, setUserData] = useState(() => {
    return initialState;
  });

  // function that assigns to userData.name (userData.email or userData.password) the value entered by user in the input. This function is triggered onChange in the form inputs.
  const handleInputChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
      validationError: null,
    });
  };

  // function that is triggered when the submit button associated with the form is submited.
  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent default form action

    // Frontend validations
    if (!userData.email.includes("@")) {
      setUserData({
        ...userData,
        isSubmitting: false,
        validationError: "Email inválido",
      });
    } else {
      // Notify that is about to submit
      setUserData({
        ...userData,
        isSubmitting: true,
        validationError: null,
      });

      //request a post petition to the /login endpoint of the API
      console.log(
        `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/login`
      );
      fetch(
        `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userData.email,
            password: userData.password,
          }),
        }
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw res;
        })
        .then((userData) => {
          dispatch({
            type: "LOGIN",
            payload: userData,
          });
        })
        .catch((error) => {
          if (error.status === 401) {
            setUserData({
              ...userData,
              isSubmitting: false,
              validationError: "Credenciales inválidas",
            });
          } else {
            setUserData({
              ...userData,
              isSubmitting: false,
              validationError: "Error inesperado",
            });
            console.log(error);
          }
        });
    }
  };

  const handleRegisterClick = () => {
    dispatch({
      type: "REGISTER",
    });
  };

  return (
    <div>
      <div className="title-container main-title">
        <h2>Shoushiling</h2>
        <h3>Piedra, papel y tijera</h3>
      </div>

      <form onSubmit={handleFormSubmit} id="loginForm">
        <label className="small-text">
          Email
          <input
            type="text"
            value={userData.email.toLowerCase()}
            onChange={handleInputChange}
            name="email"
            id="email"
          />
        </label>
        <label className="small-text">
          Contraseña
          <input
            type="password"
            value={userData.password}
            onChange={handleInputChange}
            name="password"
            id="password"
          />
        </label>
        <p className="small-text forgot-pass disabled">¿Olvidaste tu contraseña?</p>
      </form>
      <div className="validation-error small-text">
        <p>{userData.validationError}</p>
      </div>

      {/* Login button */}
      <div className="buttons-container">
        <div className="button-container">
          <button
            type="submit"
            form="loginForm"
            disabled={
              userData.isSubmitting || userData.email === "" || userData.password === ""
            }
            className={
              // If email or password input are "" style "disable" class.
              userData.email === "" || userData.password === ""
                ? "disabled btn-disabled-hover"
                : ""
            }
          >
            {userData.isSubmitting ? "Cargando" : "Iniciar sesión"}
          </button>
        </div>
      </div>
      <div className="buttons-container register-button-container">
        <h3>¿No tienes cuenta?</h3>
        <button onClick={handleRegisterClick} className="button-secondary">
          Regístrate
        </button>
      </div>
    </div>
  );
};

export default Login;
