import * as LottieModule from "lottie-react";
import animationData from "./23111354.json";

const Lottie = LottieModule.default ?? LottieModule;

function Anima() {
  return (
    <div className="anima">
      <Lottie animationData={animationData} />
    </div>
  );
}

export default Anima;
