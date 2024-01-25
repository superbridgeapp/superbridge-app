import { HTMLMotionProps, motion } from "framer-motion";
import { useState } from "react";

type PageTransitionProps = HTMLMotionProps<"div">;

const SlideContainerVariants = {
  visible: { y: "0", opacity: 1 },
  hidden: { y: "-100dvh", opacity: 0 },
  intro: { y: "100dvh", opacity: 1 },
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
      className={`flex items-start justify-center fixed inset-0 w-screen h-screen transform-gpu  ${
        isAnimating ? "overflow-visible" : "overflow-scroll"
      }`}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
