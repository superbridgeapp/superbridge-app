import clsx from "clsx";
import { motion } from "framer-motion";

import { DeploymentDto, DeploymentType } from "@/codegen/model";
import { BridgePlaceholder } from "@/components/bridge-placeholder";
import { useDeployments } from "@/hooks/use-deployments";
import { useNavigate } from "@/hooks/use-navigate";

const spring = {
  type: "spring",
  damping: 25,
  stiffness: 1000,
};

const SUPERCHAIN_COMING_SOON: {
  name: string;
  displayName: string;
  type: DeploymentType;
}[] = [
  {
    name: "soneium-mainnet",
    displayName: "Soneium Mainnet",
    type: DeploymentType.mainnet,
  },
];
const NEW_DEPLOYMENTS = ["world-chain"];

export const DeploymentsGrid = () => {
  const deployments = useDeployments();
  const navigate = useNavigate();

  const onDeploymentClick = (n: DeploymentDto) => {
    navigate(n);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 px-3 md:px-16 pb-24 pt-[108px] md:pt-24 xl:pt-32 w-full h-auto w-screen max-w-[1334px]">
      {deployments.map((n) => (
        <motion.div
          key={"grid" + n.displayName}
          transition={spring}
          whileHover={{
            scale: 1.0175,
          }}
          whileTap={{
            scale: 1.01,
            opacity: 1,
          }}
          onTap={() => onDeploymentClick(n)}
        >
          <div className="w-full aspect-[3/4] relative ">
            <BridgePlaceholder
              deployment={n}
              newDeployment={NEW_DEPLOYMENTS.includes(n.name)}
            />
          </div>
        </motion.div>
      ))}

      {SUPERCHAIN_COMING_SOON.map((n, index) => (
        <motion.div
          key={"grid" + n.displayName}
          transition={spring}
          whileHover={{
            scale: 1,
          }}
          whileTap={{
            scale: 1,
            opacity: 0.8,
          }}
        >
          <div
            className={clsx(
              "w-full aspect-[3/4] relative",
              index === SUPERCHAIN_COMING_SOON.length - 1 && "mb-40"
            )}
          >
            <BridgePlaceholder deployment={n} comingSoon />
          </div>
        </motion.div>
      ))}
    </div>
  );
};
