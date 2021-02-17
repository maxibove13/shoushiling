//Dependencies
import { useState } from "react";

// Components
import { MoveIconContainer } from "../../components";

// Assets
import "./styles.scss";

const ChooseMove = ({ chosenMove }) => {
  const [clickedMoveType, setClickedMoveType] = useState("null");

  const handleChosenMove = (iconClickedFromChild) => {
    console.log(iconClickedFromChild);

    if (iconClickedFromChild !== null) {
      setClickedMoveType(iconClickedFromChild);
    }

    chosenMove(iconClickedFromChild);
  };

  return (
    <>
      <div className="moves-container">
        <MoveIconContainer
          classToChild={clickedMoveType === "Rock" ? "clicked" : ""}
          whoIsParent="ChooseMove"
          parentHandleClick={handleChosenMove}
          iconType="Rock"
        ></MoveIconContainer>
        <MoveIconContainer
          classToChild={clickedMoveType === "Paper" ? "clicked" : ""}
          whoIsParent="ChooseMove"
          value="Paper"
          parentHandleClick={handleChosenMove}
          iconType="Paper"
        ></MoveIconContainer>
        <MoveIconContainer
          classToChild={clickedMoveType === "Scissor" ? "clicked" : ""}
          whoIsParent="ChooseMove"
          parentHandleClick={handleChosenMove}
          iconType="Scissor"
        ></MoveIconContainer>
      </div>
    </>
  );
};

export default ChooseMove;
