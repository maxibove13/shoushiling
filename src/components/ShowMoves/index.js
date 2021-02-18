//Dependencies

// Componets
import { MoveIconContainer } from "../../components";

// Assets
import "./styles.scss";

const ShowMoves = ({ moves }) => {
  return (
    <>
      <div className="show-move">
        <MoveIconContainer iconType={moves[0]} whoIsParent="ShowMoves" />
        <h3>vs</h3>
        <MoveIconContainer iconType={moves[1]} whoIsParent="ShowMoves" />
      </div>
    </>
  );
};

export default ShowMoves;
