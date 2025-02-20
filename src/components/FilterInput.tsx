import { useState } from "react";
import { Search, X } from "lucide-react";

export function FilterInput({
  value,
  onChange,
  placeholder = "Search...",
  debounce = 300,
}) {
  const [inputValue, setInputValue] = useState(value || "");

  // Optional: Debounce input changes for performance
  const handleChange = (e) => {
    setInputValue(e.target.value);
    if (debounce) {
      clearTimeout(window.filterTimeout);
      window.filterTimeout = setTimeout(
        () => onChange(e.target.value),
        debounce
      );
    } else {
      onChange(e.target.value);
    }
  };

  const clearInput = () => {
    setInputValue("");
    onChange("");
  };

  return (
    <div className="ml-2 relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full border border-gray-300 p-2 pl-10 pr-10 text-gray-700 outline-none transition focus:ring-2 focus:ring-blue-400"
      />
      {inputValue && (
        <X
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
          onClick={clearInput}
        />
      )}
    </div>
  );
}
