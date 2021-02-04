//Dependencies
import { Link } from "react-router-dom";

// Assets
import "./styles.scss";

const Button = () => {
  return (
    <div className="button-container">
      <Link to="/play">
        <button className="small-text" onClick="">
          Jugar
        </button>
      </Link>
    </div>
  );
};

export default Button;
