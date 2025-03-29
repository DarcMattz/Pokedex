import axios from "axios";

// Fetch all Pokémon (first 120)
export const fetchAllPokemon = async () => {
  try {
    const response = await axios.get(
      "https://pokeapi.co/api/v2/pokemon?limit=120"
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching Pokémon list:", error);
    return [];
  }
};

// Fetch Pokémon details by name or ID
export const fetchPokemonDetails = async (
  search,
  setLoading,
  setError,
  setPokemon
) => {
  if (!search.trim()) return; // Prevent empty searches
  try {
    setLoading(true);
    setError(null);
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`
    );
    setPokemon(response.data);
  } catch (error) {
    setError(
      error.response?.status === 404
        ? "Pokémon not found"
        : "Something went wrong"
    );
    setPokemon(null);
  } finally {
    setLoading(false);
  }
};
