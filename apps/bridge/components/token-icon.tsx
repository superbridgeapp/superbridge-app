import clsx from "clsx";
import { useEffect, useState } from "react";

import { BaseToken } from "@/types/token";

export const TokenIcon = ({
  token,
  className,
}: {
  token: BaseToken | null | undefined;
  className?: string;
}) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [token?.logoURI]);

  if (error || !token?.logoURI) {
    return (
      <div
        className={clsx(
          className,
          "flex rounded-full bg-zinc-400 dark:bg-zinc-800 overflow-hidden font-heading border  p-1 text-xs items-center justify-center text-white"
        )}
      >
        {(token?.symbol ?? "TOK").substring(0, 3)}
      </div>
    );
  }
  return (
    <img
      loading="lazy"
      src={token?.logoURI}
      className={clsx(className, "rounded-full bg-zinc-50 overflow-hidden")}
      onError={() => setError(true)}
      alt={`${token?.symbol} image`}
    />
  );
};
