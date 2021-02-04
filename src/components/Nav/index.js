//Dependencies
import { Link } from "react-router-dom";

// Assets
import "./styles.scss";
import logo from "../../utilities/icons/shoushiling-logo.png";

const Nav = () => {
  return (
    <header className="nav-bar">
      <Link className="link" to="/">
        <img src={logo} alt="shoushiling-logo" />
      </Link>
    </header>
  );
};

export default Nav;
