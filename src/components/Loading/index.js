// Dependencies
import Lottie from "react-lottie";

//Assets
import animationData from "../../utilities/lottie-animations/spinner-light.json";
import "./styles.scss";

const Loading = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="loading">
      <Lottie className="lottie" options={defaultOptions} height={100} width={100} />
    </div>
  );
};

export default Loading;
