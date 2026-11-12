import React from 'react';

const SearchFilterBar = ({
  placeholder = 'Search...',
  onSearch,
  onFilterChange,
  filterOptions,
}) => {
  return (
    <div className="search-filter-bar">
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        onChange={(e) => onSearch && onSearch(e.target.value)}
      />
      {filterOptions && filterOptions.length > 0 && (
        <select
          className="filter-select"
          onChange={(e) => onFilterChange && onFilterChange(e.target.value)}
          defaultValue=""
        >
          <option value="">All Categories</option>
          {filterOptions.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const lbl = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
      )}
    </div>
  );
};

export default SearchFilterBar;
