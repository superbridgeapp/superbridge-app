import Image from "next/image";

const PageNav = () => {
  return (
    <nav className="flex flex-row justify-between items-center pl-1 pr-3 py-2 md:py-4 md:pl-2 md:pr-4 sticky top-0 w-screen z-10 bg-background border-b ">
      <a href="/" className="cursor-pointer">
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
      </a>
      <a
        href="/"
        className="flex rounded-full shadow-sm bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-sm font-bold tracking-tighter py-2 md:py-3 px-4 hover:scale-105 transition-transform cursor-pointer grow-0 items-center leading-4"
      >
        Launch App
      </a>
    </nav>
  );
};

export default PageNav;
