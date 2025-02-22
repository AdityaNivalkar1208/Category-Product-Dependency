import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "./components/Navbar";
import CategoryList from "./components/CategoryList";
import ProductList from "./components/ProductList";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Router>
          <>
            <Navbar />
            <main className="container mx-auto px-4 py-8 min-h-screen bg-gray-100">
              <Routes>
                <Route path="/" element={<CategoryList />} />
                <Route path="/products" element={<ProductList />} />
              </Routes>
            </main>
          </>
        </Router>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
