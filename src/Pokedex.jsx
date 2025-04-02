import { useState, useEffect } from "react";
import { Card, Spinner } from "flowbite-react";
import { BsStars } from "react-icons/bs";
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
  const [weaknesses, setWeaknesses] = useState([]);
  const [resistances, setResistances] = useState([]);
  const [isShiny, setIsShiny] = useState(false);

  useEffect(() => {
    const loadPokemonList = async () => {
      setListLoading(true);
      setAllPokemon(await fetchAllPokemon());
      setListLoading(false);
    };
    loadPokemonList();
  }, []);

  useEffect(() => {
    setIsShiny(false);
    if (search) fetchPokemonDetails(search, setLoading, setError, setPokemon);
  }, [search]);

  useEffect(() => {
    const fetchTypeEffectiveness = async () => {
      if (!pokemon) return;

      let typeMultipliers = {}; // Store multipliers for each type

      for (const type of pokemon.types) {
        const res = await fetch(type.type.url);
        const data = await res.json();

        // Apply type effectiveness
        data.damage_relations.double_damage_from.forEach((weakType) => {
          typeMultipliers[weakType.name] =
            (typeMultipliers[weakType.name] || 1) * 2;
        });
        data.damage_relations.half_damage_from.forEach((resistType) => {
          typeMultipliers[resistType.name] =
            (typeMultipliers[resistType.name] || 1) * 0.5;
        });
        data.damage_relations.no_damage_from.forEach((immuneType) => {
          typeMultipliers[immuneType.name] = 0;
        });
      }

      // Extract weaknesses (multiplier > 1)
      const calculatedWeaknesses = Object.entries(typeMultipliers)
        .filter(([_, multiplier]) => multiplier > 1)
        .map(([typeName]) => typeName);

      // Extract resistances (multiplier < 1 but > 0)
      const calculatedResistances = Object.entries(typeMultipliers)
        .filter(([_, multiplier]) => multiplier < 1 && multiplier > 0)
        .map(([typeName]) => typeName);

      setWeaknesses(calculatedWeaknesses);
      setResistances(calculatedResistances);
    };

    fetchTypeEffectiveness();
  }, [pokemon]);

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
        <Card className="w-80 p-2 text-center shadow-lg">
          <div className="flex">
            <div className="flex-1 font-sans text-left text-sm font-normal text-gray-500 dark:text-gray-400">
              #{pokemon.id}
            </div>

            <div className="flex gap-2">
              {pokemon.types.map((typeInfo) => (
                <span
                  key={typeInfo.type.name}
                  className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-600 dark:bg-blue-600 dark:text-white"
                >
                  {typeInfo.type.name}
                </span>
              ))}
            </div>
          </div>
          <h2 className="text-xl font-bold capitalize text-gray-900 dark:text-white">
            {pokemon.name}
          </h2>
          <img
            src={
              isShiny
                ? pokemon.sprites.other["official-artwork"].front_shiny
                : pokemon.sprites.other["official-artwork"].front_default
            }
            alt={pokemon.name}
            className="w-32 h-32 mx-auto my-1"
          />
          <div
            onClick={() => setIsShiny(!isShiny)}
            className="absolute cursor-pointer hover:bg-gray-100 rounded-3xl p-1 text-amber-400"
          >
            <BsStars />
          </div>
          <div className="flex-col justify-between">
            {/* Resistances Section */}
            <div className="flex-1 items-center text-center space-y-2 mt-1">
              <p className="text-gray-700 dark:text-white text-sm">
                Resistant To
              </p>
              <div className="flex gap-2 justify-center flex-wrap px-2 py-1 bg-green-100 rounded dark:bg-green-600">
                {resistances.length > 0 ? (
                  resistances.map((resistType) => (
                    <span
                      key={resistType}
                      className="text-xs font-semibold  text-green-600 dark:text-white"
                    >
                      {resistType}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    None
                  </p>
                )}
              </div>
            </div>
            {/* Weaknesses Section */}
            <div className="flex-1 items-center text-center space-y-2 mt-4">
              <p className="text-gray-700 dark:text-white text-sm">Weak To</p>
              <div className="flex gap-2 justify-center flex-wrap dark:bg-red-600 rounded bg-red-100">
                {weaknesses.length > 0 ? (
                  weaknesses.map((weakType) => (
                    <span
                      key={weakType}
                      className="text-xs font-semibold px-2 py-1 text-red-600 dark:text-white"
                    >
                      {weakType}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    Loading...
                  </p>
                )}
              </div>
            </div>
          </div>
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
