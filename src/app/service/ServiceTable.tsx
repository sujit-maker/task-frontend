"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface ServiceType {
  id: number;
  serviceType: string;
}

interface Service {
  id: string;
  serviceName: string;
  serviceDescription: string;
  SAC: string;
  serviceTypeId: number;
  ServiceType: ServiceType; // Nested service type object
}

const ServiceTable: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    serviceName: "",
    serviceDescription: "",
    SAC: "",
    serviceTypeId: 0,
  });

  const fetchServices = async () => {
    try {
      const response = await axios.get("http://localhost:8000/service");
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchServiceTypes = async () => {
    try {
      const response = await axios.get("http://localhost:8000/service-type");
      setServiceTypes(response.data);
    } catch (error) {
      console.error("Error fetching service types:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: name === "serviceTypeId" ? +value : value }));
  };

  const handleCreate = async () => {
    try {
      await axios.post("http://localhost:8000/service", formData);
      alert("Service added successfully!");
      setIsCreateModalOpen(false);
      fetchServices();
    } catch (error) {
      console.error("Error adding service:", error);
    }
  };

  const handleUpdate = async () => {
    if (selectedService) {
      try {
        await axios.put(`http://localhost:8000/service/${selectedService.id}`, formData);
        alert("Service updated successfully!");
        setIsUpdateModalOpen(false);
        fetchServices();
      } catch (error) {
        console.error("Error updating service:", error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axios.delete(`http://localhost:8000/service/${id}`);
        alert("Service deleted successfully!");
        fetchServices();
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };

  useEffect(() => {
    fetchServices();
    fetchServiceTypes();
  }, []);

  return (
    <div className="flex flex-col items-center h-screen p-6 bg-gray-100">
      <div className="w-full max-w-6xl bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Service Management</h1>
          <button
            onClick={() => {
              setFormData({ serviceName: "", serviceDescription: "", SAC: "", serviceTypeId: 0 });
              setIsCreateModalOpen(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Service
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Service Name</th>
                <th className="border border-gray-300 px-4 py-2">Description</th>
                <th className="border border-gray-300 px-4 py-2">SAC</th>
                <th className="border border-gray-300 px-4 py-2">Service Type</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{service.serviceName}</td>
                  <td className="border border-gray-300 px-4 py-2">{service.serviceDescription}</td>
                  <td className="border border-gray-300 px-4 py-2">{service.SAC}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {service.ServiceType?.serviceType || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => {
                        setSelectedService(service);
                        setFormData({
                          serviceName: service.serviceName,
                          serviceDescription: service.serviceDescription,
                          SAC: service.SAC,
                          serviceTypeId: service.serviceTypeId,
                        });
                        setIsUpdateModalOpen(true);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isCreateModalOpen && (
        <Modal
          title="Add Service"
          formData={formData}
          serviceTypes={serviceTypes}
          onInputChange={handleInputChange}
          onSave={handleCreate}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {isUpdateModalOpen && (
        <Modal
          title="Update Service"
          formData={formData}
          serviceTypes={serviceTypes}
          onInputChange={handleInputChange}
          onSave={handleUpdate}
          onClose={() => setIsUpdateModalOpen(false)}
        />
      )}
    </div>
  );
};

const Modal: React.FC<{
  title: string;
  formData: any;
  serviceTypes: ServiceType[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSave: () => void;
  onClose: () => void;
}> = ({ title, formData, serviceTypes, onInputChange, onSave, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg w-96">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <input
        name="serviceName"
        value={formData.serviceName}
        onChange={onInputChange}
        placeholder="Service Name"
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        name="serviceDescription"
        value={formData.serviceDescription}
        onChange={onInputChange}
        placeholder="Description"
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        name="SAC"
        value={formData.SAC}
        onChange={onInputChange}
        placeholder="SAC"
        className="w-full mb-3 p-2 border rounded"
      />
      <select
        name="serviceTypeId"
        value={formData.serviceTypeId}
        onChange={onInputChange}
        className="w-full mb-3 p-2 border rounded"
      >
        <option value={0}>Select Service Type</option>
        {serviceTypes.map((type) => (
          <option key={type.id} value={type.id}>
            {type.serviceType}
          </option>
        ))}
      </select>
      <div className="flex justify-end space-x-2">
        <button onClick={onSave} className="bg-blue-500 text-white px-4 py-2 rounded">
          Save
        </button>
        <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default ServiceTable;
