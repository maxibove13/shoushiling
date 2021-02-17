//Dependencies
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../App";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Assets
import "./styles.scss";
import logo from "../../utilities/icons/shoushiling-logo.png";

import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faCogs } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const { state, dispatch } = useContext(AuthContext);

  const initialMenuState = false;

  const [menu, setMenu] = useState(initialMenuState);

  useEffect(() => {
    setMenu(false);
  }, [state.isAuthenticated]);

  const showMenu = () => {
    setMenu(!menu);
  };

  const handleLogoClick = () => {
    dispatch({
      type: "GO_HOME",
    });
  };

  return (
    <>
      <header className="nav-bar">
        <div className="icons-header">
          <FontAwesomeIcon icon={faBars} onClick={showMenu} />
        </div>
        <img onClick={handleLogoClick} src={logo} alt="shoushiling-logo" />
        <div className="icons-header">
          <FontAwesomeIcon icon={faCogs} className="disabled" />
        </div>
      </header>
      <nav className={menu ? "show-nav" : undefined}>
        <div className="categories disabled">
          <h2>Estadísticas</h2>
          <h2>Aprende</h2>
        </div>
        {state.isAuthenticated && (
          <div className="options">
            <h3>Cambiar contraseña</h3>
            <h3 onClick={() => dispatch({ type: "LOGOUT" })}>Cerrar sesión</h3>
          </div>
        )}
      </nav>
    </>
  );
};

export default Header;
