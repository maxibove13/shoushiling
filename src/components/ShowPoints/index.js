//Dependencies

// Assets
import "./styles.scss";

const ShowPoints = ({ points, names }) => {
  return (
    <>
      <div className="show-points">
        <div className="playing-names-container">
          <p>{names[0]}</p>
          <p>{points[0]}</p>
        </div>
        <div className="playing-points-container">
          <p>{names[1]}</p>
          <p>{points[1]}</p>
        </div>
      </div>
    </>
  );
};

export default ShowPoints;
