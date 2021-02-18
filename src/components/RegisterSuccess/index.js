// Dependencies
import Lottie from "react-lottie";

//Assets
import animationData from "../../utilities/lottie-animations/success.json";
import "./styles.scss";

const RegisterSuccess = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="register-success">
      <Lottie className="lottie" options={defaultOptions} height={240} width={240} />
    </div>
  );
};

export default RegisterSuccess;
