import { motion } from "framer-motion";
import Lottie from "react-lottie-player";

import inProgress from "../animation/loading.json";
import inProgressDark from "../animation/loading-dark.json";

export function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key="sp-loading"
    >
      <Lottie
        animationData={inProgress}
        loop={true}
        className="w-24 h-24 opacity-50 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden dark:block"
        play
      />
      <Lottie
        animationData={inProgressDark}
        loop={true}
        className="w-24 h-24 opacity-50 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block dark:hidden"
        play
      />
    </motion.div>
  );
}
