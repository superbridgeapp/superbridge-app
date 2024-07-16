import clsx from "clsx";
import { HTMLMotionProps, motion } from "framer-motion";
import { useState } from "react";

type PageTransitionProps = HTMLMotionProps<"div">;

const SlideContainerVariants = {
  visible: { y: "0dvh" },
  hidden: { y: "100dvh" },
  intro: { y: "100dvh" },
};

export function PageTransition({ children, ...rest }: PageTransitionProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  return (
    <motion.div
      initial="intro"
      animate={"visible"}
      onAnimationStart={() => setIsAnimating(true)}
      onAnimationComplete={() => setIsAnimating(false)}
      variants={SlideContainerVariants}
      exit={"hidden"}
      transition={{ type: "spring", damping: 12 }}
      className={clsx(
        isAnimating ? "overflow-visible" : "overflow-x-hidden overflow-y-auto",
        `flex items-start justify-center fixed inset-0 h-screen w-screen`
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
