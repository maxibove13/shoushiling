// Dependencies
import Lottie from "react-lottie";

//Assets
import animationData from "../../utilities/lottie-animations/gem-rotation.json";
import "./styles.scss";

const index = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="maintenance">
      <Lottie options={defaultOptions} height={300} width={300} />
      <h1>Not Yet</h1>
    </div>
  );
};

export default index;
