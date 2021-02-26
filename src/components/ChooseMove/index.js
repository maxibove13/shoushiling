//Dependencies
import { useState } from "react";

// Assets
import "./styles.scss";
import rockContainer from "../../utilities/icons/rock-container.png";
import paperContainer from "../../utilities/icons/paper-container.png";
import scissorContainer from "../../utilities/icons/scissor-container.png";

const initialClicks = {
  rock: false,
  paper: false,
  scissor: false,
};

const ChooseMove = ({ chosenMove }) => {
  const [clicks, setClicks] = useState(initialClicks);

  const handleChosenMove = (icon) => {
    if (icon === "Rock") {
      if (clicks.rock) {
        setClicks({ ...clicks, rock: false, paper: false, scissor: false });
        chosenMove(null);
      } else {
        setClicks({ ...clicks, rock: true, paper: false, scissor: false });
        chosenMove(icon);
      }
    } else if (icon === "Paper") {
      if (clicks.paper) {
        setClicks({ ...clicks, rock: false, paper: false, scissor: false });
        chosenMove(null);
      } else {
        setClicks({ ...clicks, rock: false, paper: true, scissor: false });
        chosenMove(icon);
      }
    } else if (icon === "Scissor") {
      if (clicks.scissor) {
        setClicks({ ...clicks, rock: false, paper: false, scissor: false });
        chosenMove(null);
      } else {
        setClicks({ ...clicks, rock: false, paper: false, scissor: true });
        chosenMove(icon);
      }
    }
  };

  return (
    <>
      <div className="ChooseMove choose-move-icon moves-container">
        <img
          className={clicks.rock ? "clicked" : undefined}
          onClick={() => handleChosenMove("Rock")}
          src={rockContainer}
          alt="rock-icon"
        />
        <img
          className={clicks.paper ? "clicked" : undefined}
          onClick={() => handleChosenMove("Paper")}
          src={paperContainer}
          alt="paper-icon"
        />
        <img
          className={clicks.scissor ? "clicked" : undefined}
          onClick={() => handleChosenMove("Scissor")}
          src={scissorContainer}
          alt="scissor-icon"
        />
      </div>
    </>
  );
};

export default ChooseMove;
