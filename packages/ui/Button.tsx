import React from "react";

export const Button = ({ onClick }: { onClick: () => void }) => {
  return <button onClick={onClick}>Boop</button>;
};
