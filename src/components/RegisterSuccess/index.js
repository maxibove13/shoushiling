// Dependencies
import Lottie from "react-lottie";

//Assets
import animationData from "../../utilities/lottie-animations/success.json";
import "./styles.scss";

const RegisterSuccess = ({ variantStyle }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div
      className={
        variantStyle === "change-password"
          ? "register-success change-password"
          : "register-success"
      }
    >
      <div>
        <Lottie options={defaultOptions} height={100} width={100} />
      </div>
    </div>
  );
};

export default RegisterSuccess;
