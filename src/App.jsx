import { useState, useEffect } from "react";
import Pokedex from "./Pokedex";
import { TopBar } from "./components/TopBar";
import { FaAnglesUp } from "react-icons/fa6";

function App() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 100); // Show button after scrolling 100px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <TopBar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 pb-24 dark:bg-gray-900">
        <Pokedex />
      </main>
      {showButton && (
        <div className="fixed bottom-10 right-10">
          <button
            className="bg-red-400 text-red-100 rounded-full cursor-pointer flex items-center justify-center w-14 h-14 shadow-md hover:bg-red-500 transition"
            onClick={scrollToTop}
          >
            <FaAnglesUp size={24} />
          </button>
        </div>
      )}
    </>
  );
}
export default App;
