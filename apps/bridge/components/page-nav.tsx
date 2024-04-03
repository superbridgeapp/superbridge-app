import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

const PageNav = () => {
  return (
    <nav className="flex flex-row justify-between items-center pl-1 pr-3 py-2 md:py-4 md:pl-2 md:pr-4 sticky top-0 w-screen z-10 bg-white dark:bg-zinc-950 border-b ">
      <Link href="/" className="cursor-pointer">
        <Image
          src={"/img/logo.svg"}
          width={174}
          height={40}
          alt={"Superbridge"}
          draggable={false}
          className="rounded-full  dark:hidden"
        />
        <Image
          src={"/img/logo-dark.svg"}
          width={174}
          height={40}
          alt={"Superbridge"}
          draggable={false}
          className="rounded-full  hidden dark:inline-flex"
        />
      </Link>
      <Link
        href="/"
        className="flex rounded-full shadow-sm bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-sm font-bold tracking-tighter py-2 md:py-3 px-4 hover:scale-105 transition-transform cursor-pointer grow-0 items-center leading-4"
      >
        Launch App
      </Link>
    </nav>
  );
};

export default PageNav;
