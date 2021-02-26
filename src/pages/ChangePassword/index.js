// Dependencies
import { useState, useContext } from "react";
import { AuthContext } from "../../App";

// Components
import { RegisterSuccess } from "../../components";

// Assets
import "./styles.scss";

const ChangePassword = () => {
  const { state, dispatch } = useContext(AuthContext);

  // Define input initialState (userData)
  const initialState = {
    email: "",
    actualPassword: "",
    newPassword: "",
    newCheckPassword: "",
    isSubmitting: false,
    validationError: null,
    success: false,
  };

  const [userData, setUserData] = useState(() => {
    return initialState;
  });

  const handleInputChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent default form action

    // Frontend validations
    console.log(userData.email);
    if (!userData.email.includes("@")) {
      setUserData({
        ...userData,
        isSubmitting: false,
        validationError: "Email inválido",
      });
    } else if (userData.newPassword.length < 8) {
      setUserData({
        ...userData,
        isSubmitting: false,
        validationError: "La contraseña debe tener más de 8 caracteres",
      });
    } else if (userData.newPassword !== userData.newCheckPassword) {
      setUserData({
        ...userData,
        isSubmitting: false,
        validationError: "Las nuevas contraseñas no coinciden",
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
        `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/updatePassword`
      );
      fetch(
        `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/updatePassword`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: state.token,
          },
          body: JSON.stringify({
            email: state.userData.email,
            actualPassword: userData.actualPassword,
            newPassword: userData.newPassword,
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
          setUserData({
            ...userData,
            isSubmitting: false,
            success: true,
          });
        })
        .catch((error) => {
          if (error.status === 400) {
            setUserData({
              ...userData,
              isSubmitting: false,
              validationError: "Email y contraseña actual no coinciden",
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

  const goBackHome = () => {
    console.log("hey");
    dispatch({
      type: "GO_HOME",
    });
  };

  return !userData.success ? (
    <div>
      <div className="title-container title-register">
        <h2>Cambiar contraseña</h2>
      </div>

      <form onSubmit={handleFormSubmit} id="registerForm">
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
          Contraseña actual
          <input
            type="password"
            value={userData.actualPassword}
            onChange={handleInputChange}
            name="actualPassword"
            id="actualPassword"
          />
        </label>
        <label className="small-text">
          Nueva contraseña
          <input
            type="password"
            value={userData.newPassword}
            onChange={handleInputChange}
            name="newPassword"
            id="newPassword"
          />
        </label>
        <label className="small-text">
          Confirmar nueva contraseña
          <input
            type="password"
            value={userData.newCheckPassword}
            onChange={handleInputChange}
            name="newCheckPassword"
            id="newCheckPassword"
          />
        </label>
      </form>
      <div className={"small-text validation-error"}>
        <p>{userData.validationError}</p>
      </div>

      {/* Register button */}
      <div className="buttons-container">
        <div className="btn-changePassword-container">
          <button
            type="submit"
            form="registerForm"
            disabled={
              userData.isSubmitting ||
              userData.email === "" ||
              userData.actualPassword === "" ||
              userData.newPassword === "" ||
              userData.newCheckPassword === ""
            }
            className={
              // If any input is "", style "disable" class.
              userData.isSubmitting ||
              userData.email === "" ||
              userData.actualPassword === "" ||
              userData.newPassword === "" ||
              userData.newCheckPassword === ""
                ? "disabled btn-disabled-hover"
                : ""
            }
          >
            {userData.isSubmitting ? "Cargando" : "Confirmar"}
          </button>
          <button onClick={goBackHome} className="small-text">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="update-password-success">
      <h2>Cambio de contraseña exitoso</h2>
      <RegisterSuccess variantStyle={"change-password"} />
      <button onClick={goBackHome} className="small-text">
        Volver
      </button>
    </div>
  );
};

export default ChangePassword;
