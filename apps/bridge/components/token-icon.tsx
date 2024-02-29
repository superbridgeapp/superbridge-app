import clsx from "clsx";
import { useEffect, useState } from "react";

import { Token } from "@/types/token";

export const TokenIcon = ({
  token,
  className,
}: {
  token: Token | null;
  className?: string;
}) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [token?.logoURI]);

  if (error) {
    return (
      <div
        className={clsx(
          className,
          "rounded-full bg-zinc-50 overflow-hidden font-medium"
        )}
      >
        {token?.symbol.substring(0, 2)}
      </div>
    );
  }
  return (
    <img
      src={token?.logoURI}
      className={clsx(className, "rounded-full bg-zinc-50 overflow-hidden")}
      onError={() => setError(true)}
    />
  );
};
