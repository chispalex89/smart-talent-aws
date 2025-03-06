import { useState, useEffect } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

const useFetch = <T,>(
  url: string,
  options?: RequestInit,
): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL || process.env.REACT_APP_API_BASE_URL;
  console.log(baseUrl);
  console.log(import.meta.env);
  console.log(process.env);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const requestUrl = `${baseUrl}/${url}`;
      try {
        const response = await fetch(requestUrl, options);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, options]);

  return { data, loading, error };
};

export default useFetch;
