export const isSuperbridge = process.env["NEXT_PUBLIC_SUPERBRIDGE"] === "true";
export const isRollbridge = !isSuperbridge;
