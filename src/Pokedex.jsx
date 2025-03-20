import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button } from "flowbite-react";

export default function Pokedex() {
  const [search, setSearch] = useState("");
  const [pokemon, setPokemon] = useState(null);
  const [weaknesses, setWeaknesses] = useState([]);
  const [error, setError] = useState(null);
  const [allPokemon, setAllPokemon] = useState([]);

  // Fetch all Pokémon (limited to first 100)
  useEffect(() => {
    const fetchAllPokemon = async () => {
      try {
        const response = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=1025"
        );
        setAllPokemon(response.data.results);
      } catch (err) {
        console.error("Error fetching Pokémon list:", err);
      }
    };
    fetchAllPokemon();
  }, []);

  // Fetch a Pokémon's details when searched or clicked
  useEffect(() => {
    if (!search) return;
    const fetchPokemon = async () => {
      try {
        setError(null);
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`
        );
        setPokemon(response.data);

        // Fetch weaknesses for all types
        const typeResponses = await Promise.all(
          response.data.types.map((type) => axios.get(type.type.url))
        );
        const allWeaknesses = new Set(
          typeResponses.flatMap((res) =>
            res.data.damage_relations.double_damage_from.map((t) => t.name)
          )
        );
        setWeaknesses(Array.from(allWeaknesses));
      } catch (err) {
        setError("Pokémon not found");
        setPokemon(null);
        setWeaknesses([]);
      }
    };
    fetchPokemon();
  }, [search]);

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">Pokédex</h1>
      <input
        type="text"
        placeholder="Search Pokémon by name or ID"
        className="border p-2 mb-4 w-80 text-center rounded-lg shadow-sm"
        onChange={(e) => setSearch(e.target.value)}
      />
      {error && <p className="text-red-500 font-semibold">{error}</p>}

      {/* Selected Pokémon Details */}
      {pokemon && (
        <Card className="w-80 p-4 text-center shadow-lg bg-white">
          <h2 className="text-xl font-bold capitalize text-gray-700">
            {pokemon.name}
          </h2>
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-32 h-32 mx-auto my-2"
          />
          <p className="text-gray-600">Height: {pokemon.height}</p>
          <p className="text-gray-600">Weight: {pokemon.weight}</p>
          <p className="text-gray-600">
            Base Experience: {pokemon.base_experience}
          </p>
          <p className="text-gray-600">
            Weaknesses:{" "}
            {weaknesses.length > 0 ? weaknesses.join(", ") : "None found"}
          </p>
        </Card>
      )}

      {/* Pokémon List */}
      <h2 className="text-2xl font-bold mt-6 text-gray-700">Pokémon List</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {allPokemon.map((poke, index) => (
          <Card
            key={index}
            className="cursor-pointer w-40 text-center shadow-md bg-white"
            onClick={() => setSearch(poke.name)}
          >
            <p className="capitalize text-gray-700 font-semibold">
              {poke.name}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
