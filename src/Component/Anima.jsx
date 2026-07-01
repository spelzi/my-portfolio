import { useEffect, useState } from "react";
import animationData from "./23111354.json";

function Anima() {
  // lottie-react mounts the player via its own effects, so it produces no
  // visible output during the very first paint either way — there's no
  // user-visible cost to deferring it one tick. Doing so server-side also
  // sidesteps a CJS/ESM interop crash in lottie-react under
  // renderToString(), and guarantees the server-rendered markup and the
  // client's first paint match exactly (no hydration mismatch).
  const [Lottie, setLottie] = useState(null);

  useEffect(() => {
    let cancelled = false;
    import("lottie-react").then((mod) => {
      if (!cancelled) setLottie(() => mod.default ?? mod);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return <div className="anima">{Lottie && <Lottie animationData={animationData} />}</div>;
}

export default Anima;
