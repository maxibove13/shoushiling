//Dependencies
import { Link } from "react-router-dom";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Assets
import "./styles.scss";

const Button = ({ buttonVariant, text }) => {
  return (
    <div className="button-container">
      <button className={`small-text ${buttonVariant}`}>{text}</button>
    </div>
  );
};

export default Button;
