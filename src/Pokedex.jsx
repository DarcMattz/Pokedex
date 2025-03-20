import { useState, useEffect } from "react";
import axios from "axios";

export default function Pokedex() {
  const [search, setSearch] = useState("");
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!search) return;
    const fetchPokemon = async () => {
      try {
        setError(null);
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`
        );
        setPokemon(response.data);
      } catch (err) {
        setError("Pokémon not found");
        setPokemon(null);
      }
    };
    fetchPokemon();
  }, [search]);

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Pokédex</h1>
      <input
        type="text"
        placeholder="Search Pokémon by name or ID"
        className="border p-2 mb-4 w-80 text-center"
        onChange={(e) => setSearch(e.target.value)}
      />
      {error && <p className="text-red-500">{error}</p>}
      {pokemon && (
        <div className="border p-4 rounded-lg text-center shadow-lg">
          <h2 className="text-xl font-bold capitalize">{pokemon.name}</h2>
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-32 h-32 mx-auto"
          />
          <p>Height: {pokemon.height}</p>
          <p>Weight: {pokemon.weight}</p>
          <p>Base Experience: {pokemon.base_experience}</p>
        </div>
      )}
    </div>
  );
}
