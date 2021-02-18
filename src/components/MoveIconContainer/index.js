// Dependencies

// Assets
import "./styles.scss";
import rockContainer from "../../utilities/icons/rock-container.png";
import paperContainer from "../../utilities/icons/paper-container.png";
import scissorContainer from "../../utilities/icons/scissor-container.png";
import dotsContainer from "../../utilities/icons/dots-container.png";

const MoveIconContainer = ({ iconType, whoIsParent }) => {
  // Display iconContainer according to the iconType pass down from <ChooseMove/>
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

  return (
    <div className={whoIsParent === "ChooseMove" ? "choose-move-icon" : "show-moves-icon"}>
      <img src={iconContainerToDisplay} alt="rock-icon" />
    </div>
  );
};

export default MoveIconContainer;
