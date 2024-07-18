import { useRouter } from "next/router";

export const useGraffiti = (): string => {
  const router = useRouter();

  const injected =
    !!router.query.graffiti && typeof router.query.graffiti === "string"
      ? router.query.graffiti
      : null;
  return injected ? `superbridge${injected}` : "superbridge";
};
