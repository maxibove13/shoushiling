import React from "react";

// Assets
import "./styles.scss";
import rockContainer from "../../utilities/icons/rock-container.png";
import paperContainer from "../../utilities/icons/paper-container.png";
import scissorContainer from "../../utilities/icons/scissor-container.png";
import dotsContainer from "../../utilities/icons/dots-container.png";

const MoveIconContainer = ({ iconType }) => {
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

  return (
    <div className="move-icons">
      <img src={iconContainerToDisplay} alt="rock-icon" />
    </div>
  );
};

export default MoveIconContainer;
