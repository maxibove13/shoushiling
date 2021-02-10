// Dependencies
import { useState, useContext } from "react";
//import { Link } from "react-router-dom";
import { AuthContext } from "../../App";

//Components
import { Button } from "../../components";

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
    if (userData.email !== "" || userData.password !== "") {
      if (!userData.email.includes("@")) {
        userData.validationError = "Email inválido";
      } else if (userData.password.length < 4) {
        console.log(
          "La contraseña debe tener más de 4 caracteres alfanuméricos"
        );
      } else {
        // Notify that isSubmitting
        setUserData({
          ...userData,
          isSubmitting: true,
          validationError: null,
        });
        fetch(" http://localhost:5000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userData.email,
            password: userData.password,
          }),
        })
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
            setUserData({
              ...userData,
              isSubmitting: false,
              validationError: "Email o password incorrectos",
            });
          });
        // const fetchUser = async () => {
        //   const res = await fetch("http://localhost:5000/login", {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //       email: userData.email,
        //       password: userData.password,
        //     }),
        //   });
        //   if (!res.ok) {
        //     setUserData({
        //       ...userData,
        //       isSubmitting: false,
        //       errorValidation: "Error al conectarse con el servidor",
        //     });
        //     //throw new Error("Error fetching the API");
        //   } else {
        //     const userData = await res.json();
        //   }
        // };
        // fetchUser();
        setUserData({
          ...userData,
          isSubmitting: false,
        });
        //console.log(userData);
      }
    } else {
      console.log("Ingrese email y contraseña");
    }
  };

  return (
    <div>
      <div className="title-container">
        <h2>Shoushiling</h2>
        <h3>Piedra, papel y tijera</h3>
      </div>

      <form onSubmit={handleFormSubmit} id="loginForm">
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
        <p className="small-text forgot-pass">¿Olvidaste tu contraseña?</p>
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
              userData.isSubmitting ||
              userData.email === "" ||
              userData.password === ""
            }
            className={
              // If email or password input are "" style "disable" class.
              userData.email === "" || userData.password === ""
                ? "disabled"
                : ""
            }
          >
            {userData.isSubmitting ? "Cargando" : "Iniciar sesión"}
          </button>
        </div>
      </div>
      <div className="buttons-container">
        <h3>¿No tienes cuenta?</h3>
        <Button buttonVariant={"button-secondary"} text={"Regístrate"} />
      </div>
    </div>
  );
};

export default Login;
