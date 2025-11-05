const CACHE_PREFIX = 'github_cache_';
const CACHE_VERSION = '1.0';
const DEFAULT_TTL = 60 * 60 * 1000; // 1 hour in milliseconds (matches GitHub rate limit window)

/**
 * Get cache key for a specific API endpoint
 */
const getCacheKey = (endpoint) => {
  return `${CACHE_PREFIX}${CACHE_VERSION}_${btoa(endpoint)}`;
};

/**
 * Get cache entry with metadata
 * Returns null if cache is missing, expired, or corrupted
 */
const getCacheEntry = (cacheKey) => {
  try {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;
    
    const entry = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is expired
    if (now > entry.expiresAt) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    // Validate cache structure
    if (!entry.data) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return entry.data;
  } catch (error) {
    // Cache is corrupted - remove it
    console.error('Corrupted cache detected, removing:', error);
    try {
      localStorage.removeItem(cacheKey);
    } catch (removeError) {
      console.error('Error removing corrupted cache:', removeError);
    }
    return null;
  }
};

/**
 * Set cache entry with expiration
 */
const setCacheEntry = (cacheKey, data, ttl = DEFAULT_TTL) => {
  const entry = {
    data,
    expiresAt: Date.now() + ttl,
    cachedAt: Date.now()
  };
  
  try {
    localStorage.setItem(cacheKey, JSON.stringify(entry));
  } catch (error) {
    console.error('Error writing cache:', error);
    // If localStorage is full, try to clear old entries and retry
    if (error.name === 'QuotaExceededError') {
      clearExpiredCache();
      try {
        localStorage.setItem(cacheKey, JSON.stringify(entry));
      } catch (retryError) {
        console.error('Failed to cache after cleanup:', retryError);
      }
    }
  }
};

/**
 * Clear expired and corrupted cache entries
 */
const clearExpiredCache = () => {
  try {
    const keys = Object.keys(localStorage);
    const now = Date.now();
    
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const entry = JSON.parse(cached);
            // Remove expired or invalid entries
            if (now > entry.expiresAt || !entry.data) {
              localStorage.removeItem(key);
            }
          }
        } catch (error) {
          // Remove corrupted entries
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.error('Error clearing expired cache:', error);
  }
};

/**
 * Fetch GitHub API data with caching
 * Always fetches fresh data if cache is missing/expired/corrupted, then caches it
 * @param {string} endpoint - GitHub API endpoint
 * @param {number} ttl - Time to live in milliseconds (default: 1 hour)
 * @returns {Promise} - Cached or fresh data
 */
export const fetchWithCache = async (endpoint, ttl = DEFAULT_TTL) => {
  const cacheKey = getCacheKey(endpoint);
  
  // Check cache first - returns null if missing, expired, or corrupted
  const cached = getCacheEntry(cacheKey);
  if (cached !== null) {
    return cached;
  }
  
  // Cache miss/expired/corrupted - fetch fresh data and cache it
  try {
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      // Handle rate limiting
      if (response.status === 403) {
        const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
        const rateLimitReset = response.headers.get('X-RateLimit-Reset');
        
        if (rateLimitRemaining === '0') {
          throw new Error(`GitHub API rate limit exceeded. Resets at ${new Date(rateLimitReset * 1000).toLocaleString()}`);
        }
      }
      
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Always cache the fresh data (even if previous cache was corrupted)
    setCacheEntry(cacheKey, data, ttl);
    
    return data;
  } catch (error) {
    console.error('GitHub API fetch error:', error);
    throw error;
  }
};

/**
 * Get branch info for a repository
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} branch - Branch name
 * @returns {Promise} - Branch data
 */
export const getBranchInfo = async (owner, repo, branch) => {
  const endpoint = `https://api.github.com/repos/${owner}/${repo}/branches/${branch}`;
  return fetchWithCache(endpoint);
};

/**
 * Get commits list for a repository
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {number} perPage - Number of commits per page (default: 7)
 * @returns {Promise} - Commits list
 */
export const getCommitsList = async (owner, repo, perPage = 7) => {
  const endpoint = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=${perPage}`;
  return fetchWithCache(endpoint);
};

/**
 * Get detailed commit information
 * @param {string} commitUrl - Full commit URL from GitHub API
 * @returns {Promise} - Detailed commit data
 */
export const getCommitDetails = async (commitUrl) => {
  // Use longer TTL for commit details since they don't change
  return fetchWithCache(commitUrl, DEFAULT_TTL * 24); // 24 hours
};

// Clean expired cache on module load
if (typeof window !== 'undefined') {
  clearExpiredCache();
}