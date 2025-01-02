import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface UpdateProductModalProps {
  show: boolean;
  onHide: () => void;
  productId: string; 
  fetchProducts: () => void;
}

const UpdateProductModal: React.FC<UpdateProductModalProps> = ({ show, onHide, productId, fetchProducts }) => {
  const [productName, setProductName] = useState<string>('');
  const [productDescription, setProductDescription] = useState<string>('');
  const [HSN, setHSN] = useState<string>('');
  const [subCategoryId, setSubCategoryId] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');

  // Fetch existing product data
  useEffect(() => {
    const fetchProductData = async () => {
      if (productId) {
        try {
          const response = await axios.get(`http://192.168.29.225:8000/products/${productId}`);
          const productData = response.data;
          setProductName(productData.productName);
          setProductDescription(productData.productDescription);
          setHSN(productData.HSN);
          setSubCategoryId(productData.subCategoryId);
          setCategoryId(productData.categoryId);
        } catch (error) {
          console.error('Error fetching product data:', error);
        }
      }
    };

    if (show) {
      fetchProductData();
    }
  }, [productId, show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedProduct = {
        productName,
        productDescription,
        HSN,
        subCategoryId,
        categoryId: parseInt(categoryId, 10),  // Convert to integer
      };

      await axios.put(`http://192.168.29.225:8000/products/${productId}`, updatedProduct);
      fetchProducts();
      onHide();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 transition-opacity ${
        show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Update Product</h3>
          <button onClick={onHide} className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                className="p-3 border border-gray-300 rounded-md mt-1"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Product Description</label>
              <input
                type="text"
                className="p-3 border border-gray-300 rounded-md mt-1"
                placeholder="Enter product description"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">HSN</label>
              <input
                type="text"
                className="p-3 border border-gray-300 rounded-md mt-1"
                placeholder="Enter HSN"
                value={HSN}
                onChange={(e) => setHSN(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">SubCategory</label>
              <input
                type="text"
                className="p-3 border border-gray-300 rounded-md mt-1"
                placeholder="Enter subcategory"
                value={subCategoryId}
                onChange={(e) => setSubCategoryId(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                className="p-3 border border-gray-300 rounded-md mt-1"
                placeholder="Enter category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onHide}
              className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProductModal;
