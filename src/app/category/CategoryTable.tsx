"use client"
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
  const [formData, setFormData] = useState({ categoryName: "", subCategoryName: "" });

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://192.168.29.225:8000/category");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category and its subcategories?")) {
      try {
        await axios.delete(`http://192.168.29.225:8000/category/${id}`);
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
      await axios.post("http://192.168.29.225:8000/category", formData);
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
      const promises = [];
  
      
      if (formData.categoryName !== selectedCategory.categoryName) {
        promises.push(
          axios.put(`http://192.168.29.225:8000/category/${selectedCategory.id}`, {
            categoryName: formData.categoryName,
          })
        );
      }
  
      
      const originalSubCategoryNames = selectedCategory.subCategories
        .map((sub) => sub.subCategoryName)
        .join(", ");
      if (formData.subCategoryName !== originalSubCategoryNames) {
        const updatedSubCategories = formData.subCategoryName
          .split(",")
          .map((name) => name.trim());
  
        
        updatedSubCategories.forEach((subCategoryName, index) => {
          const existingSubCategory = selectedCategory.subCategories[index];
  
          if (existingSubCategory) {
            
            promises.push(
              axios.put(`http://192.168.29.225:8000/subCategory/${existingSubCategory.id}`, {
                subCategoryName,
              })
            );
          } else {
            
            promises.push(
              axios.post(`http://192.168.29.225:8000/subCategory`, {
                categoryId: selectedCategory.id,
                subCategoryName,
              })
            );
          }
        });
  
        
        if (selectedCategory.subCategories.length > updatedSubCategories.length) {
          const removedSubCategories = selectedCategory.subCategories.slice(updatedSubCategories.length);
          removedSubCategories.forEach((sub) =>
            promises.push(axios.delete(`http://192.168.29.225:8000/subCategory/${sub.id}`))
          );
        }
      }
  
      
      await Promise.all(promises);
  
      alert("Category and subcategories updated successfully!");
      setIsUpdateModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error updating category or subcategories:", error);
      alert("Failed to update category or subcategories.");
    }
  };
  
  

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="flex h-screen w-full">
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => {
              setIsCreateModalOpen(true);
              setFormData({ categoryName: "", subCategoryName: "" });
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Category
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-center table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-3">Id</th>
                <th className="border border-gray-300 p-3">Category Name</th>
                <th className="border border-gray-300 p-3">Sub Categories</th>
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
                      {/* Displaying all subcategories for each category */}
                      {category.subCategories.map((subCategory) => (
                        <div key={subCategory.id}>{subCategory.subCategoryName}</div>
                      ))}
                    </td>
                    <td className="border border-gray-300 p-3">
                      <button
                        onClick={() => {
                          setSelectedCategory(category);
                          setFormData({
                            categoryName: category.categoryName,
                            subCategoryName: category.subCategories
                              .map((sub) => sub.subCategoryName)
                              .join(", "), 
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
            <input
              type="text"
              value={formData.subCategoryName}
              onChange={(e) => setFormData({ ...formData, subCategoryName: e.target.value })}
              placeholder="Sub Category"
              className="border p-2 rounded mb-4 w-full"
            />
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
            <input
              type="text"
              value={formData.subCategoryName}
              onChange={(e) => setFormData({ ...formData, subCategoryName: e.target.value })}
              placeholder="Sub Category"
              className="border p-2 rounded mb-4 w-full"
            />
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
      )}
    </div>
  );
};

export default CategoryTable;
