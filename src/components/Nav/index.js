//Dependencies
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../App";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Assets
import "./styles.scss";
import logo from "../../utilities/icons/shoushiling-logo.png";

import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faCogs } from "@fortawesome/free-solid-svg-icons";

const Nav = () => {
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
      <nav>
        <div>
          {menu && state.isAuthenticated === true ? (
            <h3 onClick={() => dispatch({ type: "LOGOUT" })}>Logout</h3>
          ) : (
            ""
          )}
        </div>
      </nav>
    </>
  );
};

export default Nav;
