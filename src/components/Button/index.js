//Dependencies
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Assets
import "./styles.scss";

const Button = ({ buttonVariant, text, iconButton }) => {
  return (
    <div className="button-container">
      <Link to="/login/forgot">
        <button className={`small-text ${buttonVariant}`}>
          <FontAwesomeIcon className="fontawesome-icon" icon={iconButton} />
          {text}
        </button>
      </Link>
    </div>
  );
};

export default Button;
