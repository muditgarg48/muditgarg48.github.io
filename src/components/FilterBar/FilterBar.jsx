import React, { useState } from 'react';
import './FilterBar.css';

const FilterBar = ({ 
    searchTerm, setSearchTerm, 
    sortBy, setSortBy, sortOptions = [],
    filter, setFilter, filterOptions = [],
    placeholder = "Search..."
}) => {
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <div className="filter-section">
            <div className="search-wrapper">
                <div className="search-icon">🔍</div>
                <input
                    type="text"
                    placeholder={placeholder}
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {sortOptions.length > 0 && (
                <div className="sort-wrapper">
                    <button
                        className={`sort-btn ${isSortOpen ? 'active' : ''}`}
                        onClick={() => { 
                            setIsSortOpen(!isSortOpen); 
                            setIsFilterOpen(false); 
                        }}
                    >
                        Sort By: {sortBy} <span className="chevron"></span>
                    </button>
                    {isSortOpen && (
                        <div className="sort-dropdown">
                            {sortOptions.map(s => (
                                <div
                                    key={s}
                                    className={`sort-option ${sortBy === s ? 'selected' : ''}`}
                                    onClick={() => { 
                                        setSortBy(s); 
                                        setIsSortOpen(false); 
                                    }}
                                >
                                    {s}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {filterOptions.length > 0 && (
                <div className="filter-wrapper">
                    <button
                        className={`filter-btn ${isFilterOpen ? 'active' : ''}`}
                        onClick={() => { 
                            setIsFilterOpen(!isFilterOpen); 
                            setIsSortOpen(false); 
                        }}
                    >
                        Filter By: {filter} <span className="chevron"></span>
                    </button>
                    {isFilterOpen && (
                        <div className="filter-dropdown">
                            {filterOptions.map(f => (
                                <div
                                    key={f}
                                    className={`filter-option ${filter === f ? 'selected' : ''}`}
                                    onClick={() => { 
                                        setFilter(f); 
                                        setIsFilterOpen(false); 
                                    }}
                                >
                                    {f}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FilterBar;
