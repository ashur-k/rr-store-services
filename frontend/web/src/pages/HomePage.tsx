import { useEffect, useState } from "react";

import { useAuth } from "../features/auth/useAuth";
import { getStoreHealth } from "../features/store/api/storeApi";

import { useMyStores } from "../features/store/hooks/useMyStores";

export function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const [status, setStatus] = useState("Checking...");
  const { data: stores, isLoading, error } = useMyStores();


  useEffect(() => {
    if (loading || !isAuthenticated) {
      return;
    }

    getStoreHealth()
      .then((data) => {
        setStatus(data.status);
      })
      .catch((error) => {
        console.error("Store health check failed:", error);
        setStatus("Failed");
      });
  }, [loading, isAuthenticated]);

  return (
    <main>
      <h1>Welcome to RR Store</h1>
      <p>Store service: {status}</p>

      <p>
        My stores: {isLoading ? "Loading..." : stores?.length ?? 0}
      </p>

      {error && <p>Failed to load stores</p>}
    </main>
  );
}