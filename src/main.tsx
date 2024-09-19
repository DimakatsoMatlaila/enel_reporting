import { CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GlobalProvider } from "./hooks/global-provider";
import { ExtendThemeProvider } from "./theme";
//import { Analytics } from "@vercel/analytics/react"
//import { SpeedInsights } from "@vercel/speed-insights/next"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ExtendThemeProvider>
      <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <GlobalProvider>
          <App />
          
          </GlobalProvider>
        </QueryClientProvider>
      </ExtendThemeProvider>
  </React.StrictMode>
);
