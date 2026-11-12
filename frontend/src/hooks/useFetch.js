import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const useFetch = (urlOrFn, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const executeFetch = useCallback(async () => {
    if (!urlOrFn) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let result;
      if (typeof urlOrFn === 'function') {
        result = await urlOrFn();
      } else if (typeof urlOrFn === 'string') {
        const response = await api.get(urlOrFn);
        result = response?.data !== undefined ? response.data : response;
      } else {
        result = urlOrFn;
      }
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlOrFn, ...dependencies]);

  useEffect(() => {
    executeFetch();
  }, [executeFetch]);

  return { data, loading, error, refetch: executeFetch };
};

export default useFetch;
