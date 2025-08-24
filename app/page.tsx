import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Hero from "@/components/ui/Hero";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col max-w-7xl w-full px-4 ">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
}
