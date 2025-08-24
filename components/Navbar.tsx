import { Github } from "lucide-react";
import { Bungee_Shade } from "next/font/google";
import Link from "next/link";

const bungeeShade = Bungee_Shade({
  weight: "400", // This specifies the font weight, which can be a numeric value (100-900) or a descriptive value (normal, bold, etc.). In this case, "400" represents a normal font weight. For example, "700" would represent a bold font weight.
  subsets: ["latin"],
});

const Navbar = () => {
  return (
    <div className=" flex justify-center">
      <header className="my-4 w-full max-w-7xl flex items-center justify-between px-2 sm:px-4 md:px-8 py-2 sm:py-3 rounded-full backdrop-blur-md bg-white/30 shadow-sm transition-all duration-300 ">
        <div className="cursor-pointer">
          <div className="flex flex-row items-center">
            <Link href={"/"}>
              <h1
                id="page-logo"
                className={` ${bungeeShade.className}  text-black text-lg sm:text-xl md:text-2xl whitespace-nowrap`}
              >
                Mudra Wallet
              </h1>
            </Link>
          </div>
        </div>
        <Link
          href="https://github.com/navdeep1840"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden px-4 sm:px-5 py-1.5 sm:py-2 items-center gap-2 md:inline-flex bg-black/85 text-white font-medium rounded-full text-xs sm:text-sm md:text-base hover:opacity-90 transition-all duration-300"
        >
          Source <Github className="h-4 w-4" />
        </Link>
      </header>
    </div>
  );
};

export default Navbar;
