import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";

import { ToastProvider } from "../components/feedback/ToastProvider";
import { AuthProvider } from "../features/auth/AuthProvider";
import { store } from "./reduxStore";

interface ProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

export function Providers({ children }: ProvidersProps) {
  return (
    <ToastProvider>
      <AuthProvider>
        <ReduxProvider store={store}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ReduxProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
