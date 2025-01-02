"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface ServiceType {
  id: number;
  serviceType: string;
}

const ServiceTypeTable: React.FC = () => {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ServiceType>({ id: 0, serviceType: "" });

  const fetchServiceTypes = async () => {
    try {
      const response = await axios.get("http://localhost:8000/service-type");
      setServiceTypes(response.data);
    } catch (error) {
      console.error("Error fetching service types:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/service-type/${id}`);
      alert("ServiceType deleted successfully!");
      fetchServiceTypes();
    } catch (error) {
      console.error("Error deleting service type:", error);
    }
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8000/service-type/${formData.id}`, formData);
        alert("ServiceType updated successfully!");
      } else {
        await axios.post("http://localhost:8000/service-type", { serviceType: formData.serviceType });
        alert("ServiceType created successfully!");
      }
      setIsModalOpen(false);
      fetchServiceTypes();
    } catch (error) {
      console.error("Error saving service type:", error);
    }
  };

  const openModal = (serviceType: ServiceType | null = null) => {
    setIsEditing(!!serviceType);
    setFormData(serviceType || { id: 0, serviceType: "" });
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchServiceTypes();
  }, []);

  return (
    <div className="flex h-screen w-full p-6">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => openModal()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add ServiceType
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-screen text-center table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-3">Id</th>
                <th className="border border-gray-300 p-3">ServiceType Name</th>
                <th className="border border-gray-300 p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {serviceTypes.length > 0 ? (
                serviceTypes.map((type) => (
                  <tr key={type.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-3">{type.id}</td>
                    <td className="border border-gray-300 p-3">{type.serviceType}</td>
                    <td className="border border-gray-300 p-3">
                      <button
                        onClick={() => openModal(type)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(type.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-3 text-gray-500">
                    No service types available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              {isEditing ? "Edit ServiceType" : "Add ServiceType"}
            </h2>
            <input
              type="text"
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              placeholder="ServiceType Name"
              className="border p-2 rounded mb-4 w-full"
            />
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
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

export default ServiceTypeTable;
