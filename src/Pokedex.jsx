import { useState, useEffect } from "react";
import { Card, Spinner } from "flowbite-react";
import {
  fetchAllPokemon,
  fetchPokemonDetails,
} from "./services/pokemonService";
import SearchBar from "./components/SearchBar";

export default function Pokedex() {
  const [search, setSearch] = useState("");
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState(null);
  const [allPokemon, setAllPokemon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);

  useEffect(() => {
    const loadPokemonList = async () => {
      setListLoading(true);
      setAllPokemon(await fetchAllPokemon());
      setListLoading(false);
    };
    loadPokemonList();
  }, []);

  useEffect(() => {
    if (search) fetchPokemonDetails(search, setLoading, setError, setPokemon);
  }, [search]);

  return (
    <div className="flex flex-col items-center p-4 min-h-screen">
      {/* Search Input */}
      <SearchBar onSearch={setSearch} />

      {/* Error Message */}
      {error && <p className="text-red-500 font-semibold">{error}</p>}

      {/* Loading Spinner */}
      {loading && <Spinner size="xl" className="my-4" />}

      {/* Pokémon Details */}
      {pokemon && !loading && (
        <Card className="w-80 p-4 text-center shadow-lg">
          <h2 className="text-xl font-bold capitalize text-gray-900 dark:text-white">
            {pokemon.name}
          </h2>
          <img
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
            className="w-32 h-32 mx-auto my-2"
          />
          <p className="text-gray-700 dark:text-white">
            Height: {pokemon.height}
          </p>
          <p className="text-gray-700 dark:text-white">
            Weight: {pokemon.weight}
          </p>
          <p className="text-gray-700 dark:text-white">
            Base Experience: {pokemon.base_experience}
          </p>
        </Card>
      )}

      {/* Pokémon List */}
      <h2 className="text-2xl font-bold mt-6 text-gray-700 dark:text-white">
        Pokémon List
      </h2>

      {listLoading ? (
        <Spinner size="xl" className="my-4" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4 mt-4">
          {allPokemon.map((poke, index) => {
            const pokemonId = poke.url.split("/").slice(-2, -1)[0];
            return (
              <button
                key={index}
                onClick={() => setSearch(poke.name)}
                className="outline-primary-600 dark:outline-primary-500 group hover:border-primary-600 dark:hover:border-primary-500 cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-gray-50 outline-offset-2 focus:outline-2 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-center gap-6 p-4">
                  <div className="relative flex flex-1 flex-col items-center gap-2 pt-5">
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`}
                      alt={poke.name}
                      className="w-8 h-8"
                    />

                    <div className="flex flex-1 flex-col items-start gap-1.5 border-gray-200  dark:border-gray-700">
                      <div className="w-full font-sans text-sm leading-4 font-semibold text-gray-900 dark:text-gray-200">
                        {poke.name}
                      </div>

                      <div className="absolute top-0 left-0 font-sans text-sm leading-5 font-normal text-gray-500 dark:text-gray-400">
                        #{pokemonId}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
