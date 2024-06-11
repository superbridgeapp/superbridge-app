import Link from "next/link";
import { base, optimism } from "viem/chains";

import { useDeployment } from "@/hooks/use-deployment";

const links: { [x: number]: string | undefined } = {
  [base.id]: "https://status.base.org/",
  [optimism.id]: "https://status.optimism.io/",
};

export const WithdrawalsPaused = () => {
  const deployment = useDeployment();

  return (
    <div className="bg-card flex items-center gap-3 w-full p-4 rounded-[16px]">
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
          fill="none"
          viewBox="0 0 60 60"
          className="h-6 w-6"
        >
          <g clipPath="url(#clip0_188_489)">
            <path
              fill="#FF3801"
              d="M31.28 51.8c0 4.45 3.15 7.84 7.51 7.84 4.36 0 7.51-3.42 7.51-7.84s-3.12-7.75-7.51-7.75-7.51 3.33-7.51 7.75zm-.54-44.53c0-4.3 3.75-7.27 8.11-7.27 4.36 0 8.14 3.06 8.14 7.27 0 1.03-.15 2.3-.33 3.94L43.87 36.4c-.39 3.66-2.03 5.66-5.03 5.66-3 0-4.63-2.24-5.03-5.66l-2.79-25.19c-.18-1.67-.3-2.91-.3-3.94h.02zM12 7.27C12 2.97 15.75 0 20.11 0c4.36 0 8.14 3.06 8.14 7.27 0 1.03-.15 2.3-.33 3.94L25.13 36.4c-.39 3.66-2.03 5.66-5.03 5.66-3 0-4.63-2.24-5.03-5.66L12.3 11.2c-.18-1.67-.3-2.91-.3-3.94v.01zm8.05 36.78c-4.3 0-7.51 3.33-7.51 7.75s3.15 7.84 7.51 7.84c4.36 0 7.51-3.42 7.51-7.84s-3.12-7.75-7.51-7.75z"
            ></path>
          </g>
          <defs>
            <clipPath id="clip0_188_489">
              <path
                fill="#fff"
                d="M0 0H35V59.64H0z"
                transform="translate(12)"
              ></path>
            </clipPath>
          </defs>
        </svg>
      </span>
      <span className=" text-xs">
        Proving and finalizing {deployment?.l2.name} withdrawals is currently
        paused. <br />
        {links[deployment?.l2.id ?? 0] && (
          <Link
            href={links[deployment?.l2.id ?? 0] ?? ""}
            target="_blank"
            className=" text-muted-foreground cursor-pointer hover:underline"
          >
            More info &amp; updates&hellip;
          </Link>
        )}
      </span>
    </div>
  );
};
