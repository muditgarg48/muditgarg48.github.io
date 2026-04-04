import { useState, useMemo } from 'react';

/**
 * useFiltering hook to manage searching, sorting, and filtering logic for a list.
 * 
 * @param {Array} data - The raw list of items.
 * @param {Object} options - Configuration for filtering and sorting.
 * @param {Array} options.searchFields - Array of keys to search within each item.
 * @param {Object} options.sortLogic - Map of sortBy keys to sort comparator functions.
 * @param {Object} options.filterLogic - Map of filter keys to filter functions.
 * @returns {Object} - { searchTerm, setSearchTerm, sortBy, setSortBy, filter, setFilter, filteredData }
 */
const useFiltering = (data, { searchFields = [], sortLogic = {}, filterLogic = {} } = {}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("Newest");
    const [filter, setFilter] = useState("All");

    const filteredData = useMemo(() => {
        if (!data) return [];
        let result = [...data];

        // 1. Filter
        if (filter !== "All" && filterLogic[filter]) {
            result = result.filter(item => filterLogic[filter](item));
        }

        // 2. Search
        if (searchTerm) {
            const lowSearch = searchTerm.toLowerCase();
            result = result.filter(item => 
                searchFields.some(field => {
                    const value = item[field];
                    if (!value) return false;
                    
                    if (Array.isArray(value)) {
                        return value.some(v => v.toString().toLowerCase().includes(lowSearch));
                    }
                    return value.toString().toLowerCase().includes(lowSearch);
                })
            );
        }

        // 3. Sort
        if (sortLogic[sortBy]) {
            result.sort(sortLogic[sortBy]);
        }

        return result;
    }, [data, searchTerm, sortBy, filter, searchFields, sortLogic, filterLogic]);

    return {
        searchTerm, setSearchTerm,
        sortBy, setSortBy,
        filter, setFilter,
        filteredData
    };
};

export default useFiltering;
