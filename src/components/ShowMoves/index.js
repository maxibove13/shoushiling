//Dependencies

// Assets
import "./styles.scss";

const ShowMoves = ({ moves }) => {
  return (
    <>
      <div className="show-move">
        <div>{moves[0]}</div>
        <div>{!moves[0] ? "waiting" : moves[0]}</div>
      </div>
    </>
  );
};

export default ShowMoves;
