// components/SearchBar.jsx
// Search input that filters notes by title or content.
// Calls onSearch with the current query string on every keystroke.

import { Search, X } from 'lucide-react'

const SearchBar = ({ value, onChange, placeholder = 'Search notes by title or content...' }) => {
  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 bg-white text-navy text-sm placeholder-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-secondary hover:text-navy hover:bg-gray-100 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}

export default SearchBar
