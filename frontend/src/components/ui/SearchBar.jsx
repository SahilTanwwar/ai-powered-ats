import { Search, MapPin } from "lucide-react";
import { useState } from "react";

export default function SearchBar({
  onSearch,
  query,
  location,
  onQueryChange,
  onLocationChange,
}) {
  const [localQuery, setLocalQuery] = useState("");
  const [localLocation, setLocalLocation] = useState("");

  const currentQuery = query ?? localQuery;
  const currentLocation = location ?? localLocation;

  const handleQueryChange = (value) => {
    if (onQueryChange) {
      onQueryChange(value);
      return;
    }
    setLocalQuery(value);
  };

  const handleLocationChange = (value) => {
    if (onLocationChange) {
      onLocationChange(value);
      return;
    }
    setLocalLocation(value);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(currentQuery, currentLocation);
    }
  };

  return (
    <div className="card-modern w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-3">
      <div className="flex-1 flex items-center gap-2 w-full">
        <Search className="text-[#0A65CC] ml-3" size={20} />
        <input 
          type="text" 
          placeholder="Job title, keyword, company" 
          value={currentQuery}
          onChange={(e) => handleQueryChange(e.target.value)}
          className="modern-input ml-2"
        />
      </div>

      <div className="hidden md:block w-px h-8 bg-[#E4E5E8]"></div>

      <div className="flex-1 flex items-center gap-2 w-full">
        <MapPin className="text-[#0A65CC] ml-3" size={20} />
        <input 
          type="text" 
          placeholder="City, state or zip code" 
          value={currentLocation}
          onChange={(e) => handleLocationChange(e.target.value)}
          className="modern-input ml-2"
        />
      </div>

      <button onClick={handleSearch} className="btn-primary w-full md:w-auto px-6 py-2.5">
        Find Job
      </button>
    </div>
  );
}
