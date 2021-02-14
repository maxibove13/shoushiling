//Dependencies
import { useState } from "react";

// Assets
import "./styles.scss";

const ChooseMove = ({ chosenMove }) => {
  const [clickedMove, setClickedMove] = useState(false);

  const handleChosenMove = (e) => {
    setClickedMove(!clickedMove);

    if (clickedMove) {
      chosenMove(e.target.value);
    } else {
      chosenMove(null);
    }
  };

  return (
    <>
      <div className="moves-container">
        <button value="Rock" onClick={handleChosenMove}>
          Piedra
        </button>
        <button value="Paper" onClick={handleChosenMove}>
          Papel
        </button>
        <button value="Scissor" onClick={handleChosenMove}>
          Tijera
        </button>
      </div>
    </>
  );
};

export default ChooseMove;
