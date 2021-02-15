//Dependencies

// Componets
import { MoveIconContainer } from "../../components";

// Assets
import "./styles.scss";

const ShowMoves = ({ moves }) => {
  return (
    <>
      <div className="show-move">
        <MoveIconContainer iconType={moves[0]} />
        <h3>vs</h3>
        <MoveIconContainer iconType={moves[1]} />
      </div>
    </>
  );
};

export default ShowMoves;
