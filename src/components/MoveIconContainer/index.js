// Dependencies
import { useState } from "react";

// Assets
import "./styles.scss";
import rockContainer from "../../utilities/icons/rock-container.png";
import paperContainer from "../../utilities/icons/paper-container.png";
import scissorContainer from "../../utilities/icons/scissor-container.png";
import dotsContainer from "../../utilities/icons/dots-container.png";

const MoveIconContainer = ({ iconType, parentHandleClick, whoIsParent, classToChild }) => {
  const [clickedMove, setClickedMove] = useState(false);

  // Display iconContainer according to the iconType pass down from match
  let iconContainerToDisplay = dotsContainer;
  switch (iconType) {
    case "Rock":
      iconContainerToDisplay = rockContainer;
      break;
    case "Paper":
      iconContainerToDisplay = paperContainer;
      break;
    case "Scissor":
      iconContainerToDisplay = scissorContainer;
      break;
    case "null":
      iconContainerToDisplay = dotsContainer;
      break;
    default:
  }

  const passClickedIconToParent = () => {
    if (clickedMove) {
      parentHandleClick(iconType);
    } else {
      parentHandleClick(null);
    }

    setClickedMove(!clickedMove);
    console.log(clickedMove);
  };

  return (
    <div className={whoIsParent === "ChooseMove" ? "choose-move-icon" : "show-moves-icon"}>
      <img
        className={!clickedMove ? classToChild : ""}
        onClick={passClickedIconToParent}
        src={iconContainerToDisplay}
        alt="rock-icon"
      />
    </div>
  );
};

export default MoveIconContainer;
