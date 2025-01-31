"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface SubCategory {
  id: number;
  subCategoryName: string;
}

interface Category {
  id: number;
  categoryName: string;
  subCategories: SubCategory[];
}

const CategoryTable: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    categoryName: "",
    subCategories: [{ subCategoryName: "" }],
  });

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8000/category");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category and its subcategories?")) {
      try {
        await axios.delete(`http://localhost:8000/category/${id}`);
        alert("Category deleted successfully!");
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category. Ensure there are no dependent entries.");
      }
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post("http://localhost:8000/category", {
        categoryName: formData.categoryName,
        subCategories: formData.subCategories,
      });
      alert("Category created successfully!");
      setIsCreateModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedCategory) return;

    try {
      await axios.put(`http://localhost:8000/category/${selectedCategory.id}`, {
        categoryName: formData.categoryName,
        subCategories: formData.subCategories,
      });
      alert("Category and subcategories updated successfully!");
      setIsUpdateModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error updating category or subcategories:", error);
      alert("Failed to update category or subcategories.");
    }
  };

  const addSubCategoryField = () => {
    setFormData({
      ...formData,
      subCategories: [...formData.subCategories, { subCategoryName: "" }],
    });
  };

  const removeSubCategoryField = (index: number) => {
    const updatedSubCategories = formData.subCategories.filter((_, i) => i !== index);
    setFormData({ ...formData, subCategories: updatedSubCategories });
  };

  const handleSubCategoryChange = (index: number, value: string) => {
    const updatedSubCategories = formData.subCategories.map((sub, i) =>
      i === index ? { ...sub, subCategoryName: value } : sub
    );
    setFormData({ ...formData, subCategories: updatedSubCategories });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="flex h-screen mt-3">
    <div className="flex-1 p-6 overflow-auto lg:ml-72 "> 
      <div className="flex justify-between items-center mb-5 mt-16">
          <button
            onClick={() => {
              setIsCreateModalOpen(true);
              setFormData({ categoryName: "", subCategories: [{ subCategoryName: "" }] });
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Category
          </button>
        </div>

        <div className="overflow-x-auto" style={{ maxWidth: "100vw" }}>
          <table className="min-w-[1100px] w-full text-center border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-3">Id</th>
                <th className="border border-gray-300 p-3">Category Name</th>
                <th className="border border-gray-300 p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-3">{category.id}</td>
                    <td className="border border-gray-300 p-3">{category.categoryName}</td>
                    <td className="border border-gray-300 p-3">
                      <button
                        onClick={() => {
                          setSelectedCategory(category);
                          setFormData({
                            categoryName: category.categoryName,
                            subCategories: category.subCategories.map((sub) => ({
                              subCategoryName: sub.subCategoryName,
                            })),
                          });
                          setIsUpdateModalOpen(true);
                        }}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-3 text-gray-500">
                    No categories available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Add Category</h2>
            <input
              type="text"
              value={formData.categoryName}
              onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
              placeholder="Category Name"
              className="border p-2 rounded mb-2 w-full"
            />
            
            <div className="mt-4">
              <button
                onClick={handleCreate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Category</h2>
            <input
              type="text"
              value={formData.categoryName}
              onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
              placeholder="Category Name"
              className="border p-2 rounded mb-2 w-full"
            />
            
           
            <div className="mt-4">
              <button
                onClick={handleUpdate}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
              >
                Update
              </button>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryTable;
