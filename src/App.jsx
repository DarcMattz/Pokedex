import Pokedex from "./Pokedex";
import { TopBar } from "./components/TopBar";

function App() {
  return (
    <>
      <TopBar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 pb-24 dark:bg-gray-900">
        <Pokedex />
      </main>
    </>
  );
}

export default App;
