//Dependencies

// Assets
import "./styles.scss";

const OponentRow = ({ user, toParent }) => {
  // const { dispatch } = useContext(AuthContext);

  const handleClick = () => {
    //console.log(user._id);
    toParent(user._id);
  };

  return (
    <>
      <div className="chooseOponent-row">
        <p>{user.name}</p>
        <button onClick={handleClick} className="chooseOponent-button">
          Invitar
        </button>
      </div>
    </>
  );
};

export default OponentRow;
