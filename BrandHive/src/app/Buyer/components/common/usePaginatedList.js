import { useState, useCallback, useRef } from "react";

/**
 * Reusable Custom Hook for React Native Infinite Scroll Pagination
 *
 * @param {Function} fetchApiFunc - API function to call: async (params) => response
 * @param {Object} defaultFilters - Initial filter/search params
 * @param {number} pageSize - Number of items per page (default 20)
 */
export const usePaginatedList = (fetchApiFunc, defaultFilters = {}, pageSize = 20) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: pageSize,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const filtersRef = useRef(defaultFilters);
  filtersRef.current = defaultFilters;

  const loadPage = useCallback(
    async (pageToLoad = 1, isRefresh = false, isMore = false) => {
      if (isMore && (!pagination.hasNextPage || isLoadingMore || isLoading)) return;

      try {
        if (isRefresh) setIsRefreshing(true);
        else if (isMore) setIsLoadingMore(true);
        else setIsLoading(true);

        setError(null);

        const params = {
          page: pageToLoad,
          limit: pageSize,
          ...filtersRef.current,
        };

        const res = await fetchApiFunc(params);

        let items = [];
        let pagMeta = null;

        if (res?.data && Array.isArray(res.data)) {
          items = res.data;
          pagMeta = res.pagination || null;
        } else if (Array.isArray(res)) {
          items = res;
        }

        if (isRefresh || pageToLoad === 1) {
          setData(items);
        } else {
          // Deduplicate items using _id or id
          setData((prev) => {
            const existingIds = new Set(prev.map((i) => String(i._id || i.id)));
            const newItems = items.filter((i) => !existingIds.has(String(i._id || i.id)));
            return [...prev, ...newItems];
          });
        }

        if (pagMeta) {
          setPagination(pagMeta);
        } else {
          setPagination({
            page: pageToLoad,
            limit: pageSize,
            total: items.length,
            totalPages: pageToLoad,
            hasNextPage: false,
            hasPrevPage: pageToLoad > 1,
          });
        }
      } catch (err) {
        console.error("Pagination fetch error:", err);
        setError(err?.message || "Failed to load data.");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
        setIsRefreshing(false);
      }
    },
    [fetchApiFunc, pageSize, pagination.hasNextPage, isLoading, isLoadingMore]
  );

  const refresh = useCallback(() => {
    return loadPage(1, true, false);
  }, [loadPage]);

  const loadMore = useCallback(() => {
    if (pagination.hasNextPage && !isLoadingMore && !isLoading) {
      loadPage(pagination.page + 1, false, true);
    }
  }, [loadPage, pagination.hasNextPage, pagination.page, isLoadingMore, isLoading]);

  return {
    data,
    pagination,
    isLoading,
    isLoadingMore,
    isRefreshing,
    error,
    loadPage,
    refresh,
    loadMore,
    setData,
  };
};

export default usePaginatedList;
