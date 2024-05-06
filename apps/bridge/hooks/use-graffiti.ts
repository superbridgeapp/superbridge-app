import { useRouter } from "next/router";
import { Hex, toHex } from "viem";

export const useGraffiti = (): Hex => {
  const router = useRouter();

  const injected =
    !!router.query.graffiti && typeof router.query.graffiti === "string"
      ? router.query.graffiti
      : null;
  return toHex(injected ? `superbridge${injected}` : "superbridge");
};
