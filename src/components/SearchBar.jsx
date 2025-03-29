import { useState } from "react";
import { FloatingLabel } from "flowbite-react";

export default function SearchBar({ onSearch }) {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    if (searchInput.trim()) {
      onSearch(searchInput);
    }
  };

  return (
    <div className="flex p-5 text-gray-700 dark:text-white">
      <FloatingLabel
        variant="outlined"
        label="Search Pokemon"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Trigger search on Enter
      />
    </div>
  );
}
