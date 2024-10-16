import clsx from "clsx";
import { HTMLMotionProps, motion } from "framer-motion";

import { useIsWidget } from "@/hooks/use-is-widget";

type PageTransitionProps = HTMLMotionProps<"div">;

// Animations
const container = {
  hidden: {
    y: "5vh",
    opacity: 0,
    transition: {
      type: "easeIn",
      duration: 0.15,
    },
  },
  show: {
    opacity: 1,
    y: "0vh",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 16,
    },
  },
};

export function PageTransition({ children, ...rest }: PageTransitionProps) {
  const isWidget = useIsWidget();
  return (
    <motion.div
      variants={container}
      initial={isWidget ? "show" : "hidden"}
      animate={"show"}
      exit={"hidden"}
      className={clsx(
        "flex items-start justify-center fixed inset-0 h-screen w-screen overflow-x-hidden",
        isWidget ? "overflow-y-hidden" : "overflow-y-auto"
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
