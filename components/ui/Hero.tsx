import Link from "next/link";

const Hero = () => {
  return (
    <section className="flex-1 flex flex-col text-black  w-full   items-center justify-center ">
      <h1 className="text-5xl font-medium md:text-7xl mb-6 text-center">
        Own Every Chain, <br className="hidden md:block" />
        Effortlessly
      </h1>
      <p className="text-lg md:text-2xl text-center mb-10 max-w-3xl mx-auto">
        {" "}
        Mudra is the simplest multichain wallet designed for creators, traders,
        and explorers.
      </p>

      <Link
        href={"/wallet"}
        className=" px-6 py-2 border-none items-center gap-2 cursor-pointer  inline-flex bg-black/85 text-white font-bold hover:bg-black/85 rounded-full text-sm md:text-xl hover:opacity-90 transition-all duration-300"
      >
        Open Wallet
      </Link>
    </section>
  );
};

export default Hero;
