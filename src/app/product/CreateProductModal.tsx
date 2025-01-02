import React, { useState, useEffect } from "react";
import axios from "axios";

interface CreateProductModalProps {
  show: boolean;
  onHide: () => void;
  fetchProducts: () => void;
}


const CreateProductModal: React.FC<CreateProductModalProps> = ({
  show,
  onHide,
  fetchProducts,
}) => {
  const [productId, setProductId] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [HSN, setHSN] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [subCategoryId, setSubCategoryId] = useState<string>("");
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const [selectedSubCategoryName, setSelectedSubCategoryName] = useState<string>("");

  const [categories, setCategories] = useState<{ id: number; categoryName: string; subCategories: { id: number; subCategoryName: string }[] }[]>([]);
  const [subCategories, setSubCategories] = useState<{ id: number; subCategoryName: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://192.168.29.225:8000/category");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const fetchSubCategories = async (categoryId: string) => {
    try {
      const category = categories.find(cat => cat.id.toString() === categoryId);
      if (category) {
        setSubCategories(category.subCategories);
      } else {
        setSubCategories([]);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory = categories.find(
      (cat) => cat.id === parseInt(selectedCategoryId, 10)
    );

 
    if (selectedCategory) {
      setCategoryId(selectedCategoryId);
      setSelectedCategoryName(selectedCategory.categoryName); // Update the name of the selected category
      setSubCategoryId(""); // Reset subcategory selection
      setSelectedSubCategoryName(""); // Reset subcategory name
      fetchSubCategories(selectedCategoryId); // Fetch subcategories for selected category
    }
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSubCategoryId = e.target.value;
    const selectedSubCategory = subCategories.find(
      (sub) => sub.id === parseInt(selectedSubCategoryId, 10)
    );

    if (selectedSubCategory) {
      setSubCategoryId(selectedSubCategoryId);
      setSelectedSubCategoryName(selectedSubCategory.subCategoryName); // Update the name of the selected subcategory
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newProduct = {
        productId,
        productName,
        productDescription,
        HSN,
        categoryId: parseInt(categoryId, 10),
        subCategoryId: parseInt(subCategoryId, 10),
      };
      await axios.post("http://192.168.29.225:8000/products", newProduct);
      fetchProducts();
      onHide();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };


  return (
    <div
      className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 transition-opacity ${
        show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Add New Product</h3>
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
              <label className="text-sm font-medium text-gray-700">ProductId</label>
              <input
                type="text"
                className="p-3 border border-gray-300 rounded-md mt-1"
                placeholder="Enter Product ID"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">ProductName</label>
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
                placeholder="Enter Product Description"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category Dropdown */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <select
                  className="p-3 border border-gray-300 rounded-md mt-1"
                  value={categoryId}
                  onChange={handleCategoryChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory Dropdown */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Subcategory</label>
                <select
                  className="p-3 border border-gray-300 rounded-md mt-1"
                  value={subCategoryId}
                  onChange={handleSubCategoryChange}
                  required
                >
                  <option value="">Select Subcategory</option>
                  {subCategories.map((subCategory) => (
                    <option key={subCategory.id} value={subCategory.id}>
                      {subCategory.subCategoryName}
                    </option>
                  ))}
                </select>
              </div>
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
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
