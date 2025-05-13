import React, { useState, useEffect, Suspense, lazy } from 'react';
import {
  getProducts,
  getAllTimeSales,
  getAllTimeUsage,
  getRatings,
  type AppfiguresProduct,
  type AppfiguresAppStats,
  type AppfiguresRating,
} from '../services/appfigures';

// Combined interface for product with its stats
interface ProductWithStats extends AppfiguresProduct {
  stats?: AppfiguresAppStats;
  rating?: AppfiguresRating | null;
}

// Interface for web app projects
interface WebApp {
  id: string;
  name: string;
  description: string;
  url: string;
  imageUrl: string;
}

// Mapping from app name to App Store URL
const appStoreUrls: Record<string, string> = {
  StraySync: 'https://apps.apple.com/us/app/straysync/id6742747753',
  Decaff: 'https://apps.apple.com/us/app/decaff/id6739958581',
  Meditrace: 'https://apps.apple.com/us/app/meditrace/id6737521772',
};

// Web app projects data
const webApps: WebApp[] = [
  {
    id: 'rootsgarden',
    name: 'Roots',
    description: 'A habit tracking app',
    url: 'https://www.rootsgarden.space',
    imageUrl: 'https://placehold.co/400x400/e9f5db/1a472a?text=Roots+Garden',
  },
];

// Loading placeholder component
const LoadingPlaceholder = ({ count = 3 }: { count?: number }) => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 h-full flex items-start space-x-4">
          <div className="w-14 h-14 bg-gray-200 rounded-xl flex-shrink-0"></div>
          <div className="flex-grow">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="space-y-1.5">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Mobile apps content component (without the header)
const MobileAppsContent = ({ mobileApps, formatNumber }: { mobileApps: ProductWithStats[], formatNumber: (num?: number) => string }) => (
  <>
    {mobileApps.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mobileApps
          .filter((product) => product.name !== 'SSENTIF' && product.name !== 'Support Decaff small')
          .map((product) => {
            const appUrl = appStoreUrls[product.name]; // Get URL from map
            return (
              // Wrap card in an anchor tag if URL exists
              <a
                key={product.id} // Key moved to the anchor tag
                href={appUrl || '#'} // Use URL or fallback to #
                target={appUrl ? "_blank" : undefined} // Only open in new tab if URL exists
                rel={appUrl ? "noopener noreferrer" : undefined}
                className={`block ${appUrl ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div
                  className="bg-white rounded-xl border border-gray-200 p-5 transition-shadow hover:shadow-lg h-full flex items-start space-x-4"
                >
                  <img
                    src={product.icon}
                    alt={`${product.name} icon`}
                    className="w-14 h-14 rounded-xl flex-shrink-0 mt-1"
                    loading="lazy"
                  />
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    <div className="text-sm text-gray-700 space-y-1.5">
                      <p>Downloads: {formatNumber(product.stats?.downloads)} </p>
                      <p>App Store Views: {formatNumber(product.stats?.app_store_views)} </p>
                      <p>Impressions: {formatNumber(product.stats?.impressions)} </p>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
      </div>
    ) : (
      <p className="text-gray-500">No mobile app data found.</p>
    )}
  </>
);

// Lazy load the mobile apps content to improve initial load time
const LazyMobileAppsContent = lazy(() => Promise.resolve({
  default: MobileAppsContent
}));

// Web apps section component
const WebAppsSection = () => (
  <section>
    <h2 className="text-3xl font-medium mb-6 border-b pb-2 border-gray-200">Web Apps</h2>
    {webApps.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {webApps.map((app) => (
          <a
            key={app.id}
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block cursor-pointer"
          >
            <div className="bg-white rounded-xl border border-gray-200 p-5 transition-shadow hover:shadow-lg h-full flex items-start space-x-4">
              <img
                src={app.imageUrl}
                alt={`${app.name} preview`}
                className="w-14 h-14 rounded-xl flex-shrink-0 mt-1"
                loading="lazy"
              />
              <div className="flex-grow">
                <h3 className="text-xl font-semibold mb-2">{app.name}</h3>
                <div className="text-sm text-gray-700">
                  <p>{app.description}</p>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">No web apps to display yet.</p>
    )}
  </section>
);

const ProjectsPage = () => {
  const [mobileApps, setMobileApps] = useState<ProductWithStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all products and stats from the new endpoint
        const fetchedProductsObject = await getProducts();
        // The new endpoint returns a flat object keyed by product id, each containing product, sales, usage, ratings, etc.
        const productList = Object.values(fetchedProductsObject)
          .map((entry: any) => {
            // Find the first 'product' property (some entries may have multiple)
            const product = entry.product || entry;
            // Merge stats from sales, usage, and ratings if present
            const stats = {
              ...(entry.sales || {}),
              ...(entry.usage || {}),
            };
            return {
              ...product,
              stats,
              rating: entry.ratings || null,
            };
          });
        setMobileApps(productList);
      } catch (err) {
        console.error('Failed to fetch project data:', err);
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, []);

  // Helper to format large numbers
  const formatNumber = (num?: number): string => {
    if (num === undefined || num === null) return 'N/A';
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-semibold mb-8">Projects</h1>

      {error && (
        <p className="text-center text-red-500">Error loading data: {error}</p>
      )}

      <div className="space-y-12">
        {/* Mobile Apps Section with separated header */}
        <section>
          <h2 className="text-3xl font-medium mb-6 border-b pb-2 border-gray-200">Mobile Apps</h2>
          
          <Suspense fallback={<LoadingPlaceholder count={3} />}>
            {loading ? (
              <LoadingPlaceholder count={mobileApps.length || 3} />
            ) : (
              <LazyMobileAppsContent mobileApps={mobileApps} formatNumber={formatNumber} />
            )}
          </Suspense>
        </section>

        {/* Web Apps Section */}
        <WebAppsSection />
      </div>
    </div>
  );
};

export default ProjectsPage; 