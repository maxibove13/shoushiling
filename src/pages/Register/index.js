// Dependencies
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../App";

// Components
import { Button } from "../../components";

// Assets
import "./styles.scss";

const Register = () => {
  const { dispatch } = useContext(AuthContext);

  // Define input initialState (userData)
  const initialState = {
    name: "",
    email: "",
    password: "",
    checkPassword: "",
    isSubmitting: false,
    validationError: null,
    registered: false,
  };

  // In order not to run the initialState every time the component is rerender I pass the initial state as a function to useState.
  const [userData, setUserData] = useState(() => {
    return initialState;
  });

  const handleInputChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
      validationError: null,
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent default form action

    // Frontend validations
    if (!userData.email.includes("@")) {
      setUserData({
        ...userData,
        isSubmitting: false,
        validationError: "Email inválido",
      });
    } else if (userData.name.length < 3) {
      setUserData({
        ...userData,
        isSubmitting: false,
        validationError: "El nombre debe contener al menos 3 caracteres",
      });
    } else if (userData.password.length < 8) {
      setUserData({
        ...userData,
        isSubmitting: false,
        validationError: "La contraseña debe tener más de 8 caracteres",
      });
    } else if (userData.password !== userData.checkPassword) {
      setUserData({
        ...userData,
        isSubmitting: false,
        validationError: "La contraseñas no coinciden",
      });
    } else {
      // Register the user or display the API errors
      console.log(
        `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/register`
      );
      fetch(
        `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: userData.name,
            email: userData.email,
            password: userData.password,
          }),
        }
      )
        .then((res) => {
          if (res.ok || res.status === 400) {
            return res.json();
          }
          throw res;
        })
        // Print the validation error from the API
        .then((resObject) => {
          if (resObject.msg === undefined) {
            setUserData({
              ...userData,
              isSubmitting: false,
              validationError: "Registro exitoso",
              registered: true,
            });
            dispatch({
              type: "LOGIN",
              payload: resObject,
            });
          } else {
            setUserData({
              ...userData,
              isSubmitting: false,
              validationError: resObject.msg,
            });
          }
        })
        // Catch the response & print the error message
        .catch((err) => {
          console.log(err);
          setUserData({
            ...userData,
            isSubmitting: false,
            validationError: "Error inesperado",
          });
        });
    }
  };

  return (
    <div>
      <div className="title-container">
        <h2>Registro</h2>
      </div>

      <form onSubmit={handleFormSubmit} id="registerForm">
        <label className="small-text">
          Nombre
          <input
            type="text"
            value={userData.name}
            onChange={handleInputChange}
            name="name"
            id="name"
          />
        </label>
        <label className="small-text">
          Email
          <input
            type="text"
            value={userData.email}
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
        <label className="small-text">
          Confirmar contraseña
          <input
            type="password"
            value={userData.checkPassword}
            onChange={handleInputChange}
            name="checkPassword"
            id="checkPassword"
          />
        </label>
      </form>
      <div
        className={
          userData.registered
            ? "small-text succesfull"
            : "small-text validation-error "
        }
      >
        <p>{userData.validationError}</p>
      </div>

      {/* Register button */}
      <div className="buttons-container">
        <div className="button-container">
          <button
            type="submit"
            form="registerForm"
            disabled={
              userData.isSubmitting ||
              userData.name === "" ||
              userData.email === "" ||
              userData.password === "" ||
              userData.checkPassword === ""
            }
            className={
              // If any input is "", style "disable" class.
              userData.isSubmitting ||
              userData.name === "" ||
              userData.email === "" ||
              userData.password === "" ||
              userData.checkPassword === ""
                ? "disabled"
                : ""
            }
          >
            {userData.isSubmitting ? "Cargando" : "Regístrate"}
          </button>
          <Link to="/">
            <p className="small-text already-have-account">
              ¿Ya tienes cuenta?
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
