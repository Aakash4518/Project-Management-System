import { useEffect, useState } from "react";
import api from "../api/client";

export const useFetch = (url, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!url) {
      setLoading(false);
      setError("");
      setData(null);
      return;
    }

    let mounted = true;
    setLoading(true);

    api
      .get(url)
      .then((response) => {
        if (mounted) setData(response.data.data);
      })
      .catch((err) => {
        if (mounted) setError(err.response?.data?.message || "Request failed");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [url, ...deps]);

  return { data, loading, error, setData };
};
