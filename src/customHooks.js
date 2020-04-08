import { useState, useEffect } from "react";

export const useAjax = (endpoint, defaultValue = {}, localDataName) => {
  const [results, setResults] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
          console.warn(`No cached result for: ${localDataName}`);
        }
      });
  }, [endpoint, localDataName]);

  return [results, loading, error];
};
