import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WalletGenerator from "@/components/WalletGenerator";
import React from "react";

const WalletPage = () => {
  return (
    <div className="min-h-screen flex flex-col max-w-7xl w-full px-4 ">
      <Navbar />
      <WalletGenerator />
      <Footer />
    </div>
  );
};

export default WalletPage;
