import { useState, useEffect } from "react";

export const useAjax = (endpoint, localDataName) => {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(endpoint)
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((response) => {
        setResults(response);
        setLoading(false);
        localStorage.setItem(`${localDataName}`, JSON.stringify(response));
      })
      .catch(() => {
        setLoading(false);

        const cachedResults = JSON.parse(
          localStorage.getItem(`${localDataName}`)
        );

        if (cachedResults) {
          setError(false);
          setResults(cachedResults);
        } else {
          setError(true);
        }
      });
  }, [endpoint, localDataName]);

  return [results, error, loading];
};
