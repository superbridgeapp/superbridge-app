import clsx from "clsx";
import { motion } from "framer-motion";
import Image from "next/image";

import { ChainDto } from "@/codegen/model";
import { cardThemes } from "@/config/card-themes";

import { NetworkIcon } from "./network-icon";

const item = {
  hidden: { opacity: 0, scale: 0.85 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 12,
    },
  },
};

const PlacehoderItem = {
  hidden: { opacity: 0, scale: 0.85 },
  show: {
    opacity: 0.2,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 12,
    },
  },
};

export const ChainCard = ({
  chain,
  onSelect,
}: {
  chain: ChainDto;
  onSelect: () => void;
}) => {
  return (
    <motion.div
      key={`chain-${chain.id}`}
      onClick={onSelect}
      variants={item}
      // hovers must not be a variant or stagger animation fails
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 1 }}
      className={clsx(
        "relative w-full  aspect-[3.25/4] shrink-0 flex flex-col shrink-0 cursor-pointer overflow-hidden rounded-2xl shadow-sm",
        cardThemes[chain.id]?.card.className
      )}
    >
      {/* overlay */}
      {cardThemes[chain.id]?.card.overlay?.image ? (
        <img
          src={cardThemes[chain.id]?.card.overlay?.image}
          className={clsx(
            "inset-0 z-0 absolute",
            cardThemes[chain.id]?.card.overlay?.className
          )}
          alt={chain.name}
          // fill
          loading="eager"
          sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
        />
      ) : (
        <div
          className={clsx(
            "inset-0 z-0 absolute",
            cardThemes[chain.id]?.card.overlay?.className
          )}
        />
      )}
      <div className="flex gap-4 flex-col capitalize items-center justify-center px-3 md:px-6 grow w-full relative z-10">
        {cardThemes[chain.id]?.icon ? (
          <Image
            alt={chain.name}
            src={cardThemes[chain.id]?.icon!}
            width={96}
            height={96}
            className="pointer-events-none w-16 h-16 md:w-20 md:h-20"
          />
        ) : (
          <NetworkIcon
            chain={chain}
            width={96}
            height={96}
            className="pointer-events-none w-16 h-16 md:w-24 md:h-24"
          />
        )}
        <h3
          className={clsx(
            `text-xs md:text-sm text-center font-heading`,
            cardThemes[chain.id]?.card.title
          )}
        >
          {chain.name}
        </h3>
      </div>
    </motion.div>
  );
};
