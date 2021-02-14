//Dependencies

// Assets
import "./styles.scss";

const ShowPoints = ({ points, names }) => {
  return (
    <>
      <div className="show-points">
        <div>
          <h3>{names[0]}</h3>
          <p>{points[0]}</p>
        </div>
        <div>
          <h3>{names[1]}</h3>
          <p>{points[1]}</p>
        </div>
      </div>
    </>
  );
};

export default ShowPoints;
