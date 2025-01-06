"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Vendor {
  id: number;
  vendorName: string;
  registerAddress: string;
  gstNo: string;
  contactName: string;
  contactNumber: string;
  emailId: string;
}

const VendorTable: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const [formData, setFormData] = useState<Vendor>({
    id: 0,
    vendorName: '',
    registerAddress: '',
    gstNo: '',
    contactName: '',
    contactNumber: '',
    emailId: '',
  });

  const fetchVendors = async () => {
    try {
      const response = await axios.get("http://localhost:8000/vendors");
      setVendors(response.data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/vendors/${id}`);
      alert("Vendor deleted successfully!");
      fetchVendors();
    } catch (error) {
      console.error("Error deleting vendor:", error);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post("http://localhost:8000/vendors", formData);
      alert("Vendor created successfully!");
      setIsCreateModalOpen(false);
      fetchVendors();
    } catch (error) {
      console.error("Error creating vendor:", error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedVendor) return;
    try {
      await axios.put(`http://localhost:8000/vendors/${selectedVendor.id}`, formData);
      alert("Vendor updated successfully!");
      setIsUpdateModalOpen(false);
      fetchVendors();
    } catch (error) {
      console.error("Error updating vendor:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setFormData(vendor); // Pre-fill the form with the vendor's current data
    setIsUpdateModalOpen(true);
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Vendor Management</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Vendor
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-3">Vendor Name</th>
                <th className="border border-gray-300 p-3">Address</th>
                <th className="border border-gray-300 p-3">GST</th>
                <th className="border border-gray-300 p-3">Contact Name</th>
                <th className="border border-gray-300 p-3">Contact Number</th>
                <th className="border border-gray-300 p-3">Email</th>
                <th className="border border-gray-300 p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-3">{vendor.vendorName}</td>
                  <td className="border border-gray-300 p-3">{vendor.registerAddress}</td>
                  <td className="border border-gray-300 p-3">{vendor.gstNo}</td>
                  <td className="border border-gray-300 p-3">{vendor.contactName}</td>
                  <td className="border border-gray-300 p-3">{vendor.contactNumber}</td>
                  <td className="border border-gray-300 p-3">{vendor.emailId}</td>
                  <td className="border border-gray-300 p-3">
                    <button
                      onClick={() => handleEditClick(vendor)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                      aria-label="Edit Vendor"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(vendor.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      aria-label="Delete Vendor"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Add New Vendor</h2>
              <input
                type="text"
                name="vendorName"
                value={formData.vendorName}
                onChange={handleInputChange}
                placeholder="Vendor Name"
                className="border p-2 mb-4 w-full"
              />
              <input
                type="text"
                name="registerAddress"
                value={formData.registerAddress}
                onChange={handleInputChange}
                placeholder="Address"
                className="border p-2 mb-4 w-full"
              />
              <input
                type="text"
                name="gstNo"
                value={formData.gstNo}
                onChange={handleInputChange}
                placeholder="GST No."
                className="border p-2 mb-4 w-full"
              />
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                placeholder="Contact Name"
                className="border p-2 mb-4 w-full"
              />
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                placeholder="Contact Number"
                className="border p-2 mb-4 w-full"
              />
              <input
                type="email"
                name="emailId"
                value={formData.emailId}
                onChange={handleInputChange}
                placeholder="Email"
                className="border p-2 mb-4 w-full"
              />
              <button
                onClick={handleCreate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Create Vendor
              </button>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Update Modal */}
        {isUpdateModalOpen && selectedVendor && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Edit Vendor</h2>
              <input
                type="text"
                name="vendorName"
                value={formData.vendorName}
                onChange={handleInputChange}
                placeholder="Vendor Name"
                className="border p-2 mb-4 w-full"
              />
              <input
                type="text"
                name="registerAddress"
                value={formData.registerAddress}
                onChange={handleInputChange}
                placeholder="Address"
                className="border p-2 mb-4 w-full"
              />
              <input
                type="text"
                name="gstNo"
                value={formData.gstNo}
                onChange={handleInputChange}
                placeholder="GST No."
                className="border p-2 mb-4 w-full"
              />
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                placeholder="Contact Name"
                className="border p-2 mb-4 w-full"
              />
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                placeholder="Contact Number"
                className="border p-2 mb-4 w-full"
              />
              <input
                type="email"
                name="emailId"
                value={formData.emailId}
                onChange={handleInputChange}
                placeholder="Email"
                className="border p-2 mb-4 w-full"
              />
              <button
                onClick={handleUpdate}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Update Vendor
              </button>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorTable;
