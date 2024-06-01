import Link from "next/link";
import Image from "next/image";

const PageFooter = () => {
  return (
    <footer className="flex flex-col items-center justify-center w-full px-8 py-16">
      <Image
        src={"/img/superbridge-icon.svg"}
        width={256}
        height={256}
        alt={"Superbridge Logo"}
        className="dark:hidden w-32 h-32"
      />
      <Image
        src={"/img/superbridge-icon-dark.svg"}
        width={256}
        height={256}
        alt={"Superbridge Logo"}
        className="hidden dark:inline-flex w-32 h-32"
      />
      <h1 className="font-foreground font-bold text-foreground text-3xl uppercase text-center tracking-tighter">
        Superbridge
      </h1>
      <div className="flex gap-2 mt-6 flex-wrap justify-center">
        <Link
          className="rounded-full shadow-sm bg-card text-sm font-medium tracking-tighter py-2 px-4 hover:scale-105 transition-transform cursor-pointer grow-0 flex items-center leading-4"
          href="https://superbridge.app/docs"
          target="_blank"
        >
          Docs
        </Link>
        <Link
          className="rounded-full shadow-sm bg-card text-sm font-medium tracking-tighter py-2 px-4 hover:scale-105 transition-transform cursor-pointer grow-0 flex items-center leading-4"
          href="/support"
        >
          Support
        </Link>
        <Link
          className="rounded-full shadow-sm bg-card text-sm font-medium tracking-tighter py-2 px-4 hover:scale-105 transition-transform cursor-pointer grow-0 flex items-center leading-4"
          href="https://github.com/superbridgeapp"
          target="_blank"
        >
          GitHub
        </Link>
        <Link
          className="rounded-full shadow-sm bg-card text-sm font-medium tracking-tighter py-2 px-4 hover:scale-105 transition-transform cursor-pointer grow-0 flex items-center leading-4"
          href="https://x.com/superbridgeapp"
          target="_blank"
        >
          x.com
        </Link>
        <Link
          className="rounded-full shadow-sm bg-card text-sm font-medium tracking-tighter py-2 px-4 hover:scale-105 transition-transform cursor-pointer grow-0 flex items-center leading-4"
          href="https://warpcast.com/superbridge"
          target="_blank"
        >
          Warpcast
        </Link>
      </div>
      <p className="p-10 text-xs text-center text-muted-foreground">
        ©2024 Superbridge is a product by Blob Engineering Pte Ltd.
      </p>
    </footer>
  );
};

export default PageFooter;
