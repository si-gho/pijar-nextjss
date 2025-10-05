import { useState, useEffect, useCallback, useRef } from 'react';

interface InfiniteScrollOptions {
  pageSize?: number;
  threshold?: number;
  enabled?: boolean;
}

interface InfiniteScrollResult<T> {
  items: T[];
  loading: boolean;
  hasMore: boolean;
  error: string | null;
  loadingRef: React.RefObject<HTMLDivElement>;
  refresh: () => void;
  loadMore: () => void;
}

export function useInfiniteScroll<T>(
  apiEndpoint: string,
  options: InfiniteScrollOptions = {}
): InfiniteScrollResult<T> {
  const {
    pageSize = 20,
    threshold = 0.1,
    enabled = true
  } = options;

  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  
  const observerRef = useRef<IntersectionObserver>();
  const loadingRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !enabled) return;

    setLoading(true);
    setError(null);

    try {
      const url = new URL(apiEndpoint, window.location.origin);
      url.searchParams.set('page', page.toString());
      url.searchParams.set('limit', pageSize.toString());

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newItems = Array.isArray(data) ? data : data.items || [];

      if (newItems.length < pageSize) {
        setHasMore(false);
      }

      setItems(prev => page === 1 ? newItems : [...prev, ...newItems]);
      setPage(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Infinite scroll error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, page, pageSize, loading, hasMore, enabled]);

  const refresh = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    isInitialLoad.current = true;
  }, []);

  // Initial load
  useEffect(() => {
    if (enabled && isInitialLoad.current) {
      isInitialLoad.current = false;
      loadMore();
    }
  }, [enabled, loadMore]);

  // Intersection Observer setup
  useEffect(() => {
    if (!enabled || loading || !hasMore) return;

    const currentLoadingRef = loadingRef.current;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMore();
        }
      },
      { 
        threshold,
        rootMargin: '100px' // Start loading 100px before reaching the trigger
      }
    );

    if (currentLoadingRef) {
      observerRef.current.observe(currentLoadingRef);
    }

    return () => {
      if (observerRef.current && currentLoadingRef) {
        observerRef.current.unobserve(currentLoadingRef);
      }
    };
  }, [loading, hasMore, enabled, loadMore, threshold]);

  return {
    items,
    loading,
    hasMore,
    error,
    loadingRef,
    refresh,
    loadMore
  };
}