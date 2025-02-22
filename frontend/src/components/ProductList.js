import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


const credentials = btoa(
  `${process.env.REACT_APP_API_USERNAME}:${process.env.REACT_APP_API_PASSWORD}`
);

const ProductList = () => {
  const [page, setPage] = useState(1);
  const [newProduct, setNewProduct] = useState({ name: "", categoryId: "" });
  const [editingProduct, setEditingProduct] = useState(null);
  const queryClient = useQueryClient();

  // Fetch Products
  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ["products", page],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5000/api/products?page=${page}`, {
        headers: { Authorization: `Basic ${credentials}` },
      });
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      return data.data || [];
    },
  });

  // Fetch Categories
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5000/api/categories`, {
        headers: { Authorization: `Basic ${credentials}` },
      });
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      return data.categories || [];
    },
  });

  // Create Product
  const createMutation = useMutation({
    mutationFn: async (product) => {
      if (!product.name || !product.categoryId) {
        throw new Error("Product name and category are required.");
      }
      const response = await fetch(`http://localhost:5000/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify(product),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      setNewProduct({ name: "", categoryId: "" });
    },
  });

  // Update Product
  const updateMutation = useMutation({
    mutationFn: async (product) => {
      if (!product.name || !product.categoryId) {
        throw new Error("Product name and category are required.");
      }
      const response = await fetch(`http://localhost:5000/api/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify(product),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      setEditingProduct(null);
    },
  });

  // Delete Product
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      });
    },
    onSuccess: () => queryClient.invalidateQueries(["products"]),
  });

  if (productsLoading || categoriesLoading)
    return <div className="text-center">Loading...</div>;

  if (productsError || categoriesError)
    return <div className="text-center text-red-500">Error loading data.</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Product Management</h2>

      {/* Add New Product */}
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          placeholder="Product Name"
          className="border rounded px-3 py-2 w-full"
        />
        <select
          value={newProduct.categoryId}
          onChange={(e) =>
            setNewProduct({ ...newProduct, categoryId: e.target.value })
          }
          className="border rounded px-3 py-2 w-full"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => createMutation.mutate(newProduct)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* Product List */}
      <ul className="space-y-2">
        {products.length === 0 ? (
          <li>No products available</li>
        ) : (
          products.map((product) => (
            <li
              key={product.id}
              className="flex items-center border p-2 rounded"
            >
              <div className="flex-1 text-left">
                {editingProduct?.id === product.id ? (
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        name: e.target.value,
                      })
                    }
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  product.name
                )}
              </div>

              <div className="flex-1 text-left ml-14 text-gray-500">
                {editingProduct?.id === product.id ? (
                  <select
                    value={editingProduct.categoryId}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        categoryId: e.target.value,
                      })
                    }
                    className="border rounded px-2 py-1 w-full"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  `(${product.Category?.name || "No Category"})`
                )}
              </div>

              <div className="flex space-x-2">
                {editingProduct?.id === product.id ? (
                  <>
                    <button
                      onClick={() => updateMutation.mutate(editingProduct)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingProduct({ ...product })}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(product.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))
        )}
      </ul>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className={`px-4 py-2 rounded ${
            page === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700">Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;
