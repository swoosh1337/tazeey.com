// src/services/appfigures.ts

// Use the Netlify function proxy endpoint as the base URL
const BASE_URL = '/api/appfigures-proxy';

// Credentials are now handled by the proxy function, no longer needed here
// const PAT = import.meta.env.VITE_APPFIGURES_PAT;

// No longer need to create auth header in the frontend
// const createAuthHeader = (): HeadersInit => { ... };

// --- API Types (Simplified) ---
// Add more detailed types as needed based on API responses
export interface AppfiguresProduct {
  id: number;
  name: string;
  icon: string; // URL to the icon
  developer: string;
  // Add other relevant fields like store, bundle_identifier etc.
}

// Added back impressions & app_store_views
export interface AppfiguresAppStats {
  downloads?: number;    // From /reports/sales
  impressions?: number; // From /reports/usage (Apple Analytics)
  app_store_views?: number; // From /reports/usage (Apple Analytics)
}

export interface AppfiguresRating {
  stars: number;
  count: number;
  // ... other rating details
}

// Helper to handle potential errors from the proxy
const handleProxyError = async (response: Response): Promise<never> => {
  let errorDetails = {};
  try {
    // Try to parse the error body returned by the proxy
    errorDetails = await response.json();
  } catch (e) {
    // If body isn't JSON, use the status text
    errorDetails = { error: response.statusText };
  }
  console.error('Error received from proxy:', errorDetails);
  // Construct a meaningful error message
  const message = `Proxy error! status: ${response.status}. ${ 
    (errorDetails as any)?.error || 'Unknown error' 
  }. Details: ${ (errorDetails as any)?.details || 'N/A'}`;
  throw new Error(message);
};

// --- Service Functions --- Updated to use proxy endpoint ---

/**
 * Fetches the list of products (apps) associated with the account via the proxy.
 */
export const getProducts = async (): Promise<Record<string, AppfiguresProduct>> => {
  const url = `${BASE_URL}/products/mine`; // Path appended to proxy base
  try {
    const response = await fetch(url); // No headers needed here now
    if (!response.ok) {
      // Use the helper to throw a detailed error
      await handleProxyError(response);
    }
    // Only parse JSON if response.ok is true
    return await response.json();
  } catch (error) {
    console.error('Error in getProducts:', error);
    throw error; // Re-throw the original or the enhanced error from handleProxyError
  }
};

/**
 * Fetches **all-time** sales report data (downloads) for specific products.
 * NOTE: Assumes removing date params gets all-time totals. May need adjustment.
 */
export const getAllTimeSales = async (productIds: number[]): Promise<Record<string, AppfiguresAppStats>> => {
  const url = `${BASE_URL}/reports/sales?group_by=product&products=${productIds.join(',')}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      await handleProxyError(response);
    }
    const data = await response.json();
    // Re-structure to { productId: { downloads: X } }
    const stats: Record<string, AppfiguresAppStats> = {};
    for (const productId in data) {
      stats[productId] = { downloads: data[productId]?.downloads || 0 };
    }
    return stats;
  } catch (error) {
    console.error(`Error in getAllTimeSales:`, error);
    throw error;
  }
};

/**
 * Fetches **all-time** usage data (impressions, app_store_views) from Apple Analytics.
 * NOTE: Assumes removing date params gets all-time totals. May need adjustment.
 */
export const getAllTimeUsage = async (productIds: number[]): Promise<Record<string, AppfiguresAppStats>> => {
  // Endpoint requires group_by=network and networks=apple:analytics
  const url = `${BASE_URL}/reports/usage?group_by=network,product&networks=apple:analytics&products=${productIds.join(',')}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
        // 404 might mean no data for any product for Apple Analytics
        if (response.status === 404) return {};
        await handleProxyError(response);
    }
    const data = await response.json();

    // Response structure is likely nested under 'apple:analytics'
    const appleAnalyticsData = data['apple:analytics'];
    if (!appleAnalyticsData) {
      console.log('No Apple Analytics data found in /reports/usage response.');
      return {};
    }

    const stats: Record<string, AppfiguresAppStats> = {};
    // The structure might be { product_id: { metrics } } within appleAnalyticsData
    // Or potentially just { metrics } if only one product requested (though we send multiple)
    // We iterate through requested productIds to be safe
    for (const productId of productIds) {
        const productData = appleAnalyticsData[productId.toString()];
        if (productData) {
            stats[productId.toString()] = {
                impressions: productData.impressions || 0,
                app_store_views: productData.app_store_views || 0,
            };
        }
    }
    return stats;
  } catch (error) {
    console.error(`Error in getAllTimeUsage:`, error);
    // Return empty object on error to avoid breaking the page
    return {};
    // throw error;
  }
};

/**
 * Fetches ratings data for specific products.
 */
export const getRatings = async (productIds: number[]): Promise<Record<string, AppfiguresRating | null>> => {
    const url = `${BASE_URL}/ratings?products=${productIds.join(',')}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            // Handle 404 from proxy specifically (means no ratings found)
            if (response.status === 404) return {};
            await handleProxyError(response);
        }
        const data = await response.json();
        // Ensure correct structure { productId: { stars: X, count: Y } }
        const ratings: Record<string, AppfiguresRating | null> = {};
        for (const productId of productIds) {
            const productRating = data[productId.toString()];
            ratings[productId.toString()] = productRating ? {
                stars: productRating.stars || 0,
                count: productRating.total_rating_count || 0, // Adjust field name
            } : null;
        }
        return ratings;
    } catch (error) {
        console.error(`Error in getRatings:`, error);
        throw error;
    }
};

// Add functions for fetching reviews, etc., as needed 