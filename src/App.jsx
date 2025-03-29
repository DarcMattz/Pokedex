import Pokedex from "./Pokedex";
import { TopBar } from "./components/TopBar";
import { FaAnglesUp } from "react-icons/fa6";

function App() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <TopBar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 pb-24 dark:bg-gray-900">
        <Pokedex />
      </main>
      <div className="sticky z-10 bottom-10 right-10 w-min ml-auto">
        <div
          className="bg-red-400 text-red-100 rounded-full cursor-pointer flex items-center justify-center w-16 h-16"
          onClick={scrollToTop}
        >
          <FaAnglesUp size={24} />
        </div>
      </div>
    </>
  );
}

export default App;
