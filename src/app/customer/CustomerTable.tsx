"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Customer {
  id: string;
  customerId: string;
  customerName: string;
  registerAddress: string;
  gstNo: string;
  contactName: string;
  contactNumber: string;
  emailId: string;
}

const CustomerTable: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    registerAddress: "",
    gstNo: "",
    contactName: "",
    contactNumber: "",
    emailId: "",
  });

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCreate = async () => {
    try {
      await axios.post("http://localhost:8000/customers", formData);
      alert("Customer added successfully!");
      setIsCreateModalOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  const handleUpdate = async () => {
    if (selectedCustomer) {
      try {
        await axios.put(
          `http://localhost:8000/customers/${selectedCustomer.id}`,
          formData
        );
        alert("Customer updated successfully!");
        setIsUpdateModalOpen(false);
        fetchCustomers();
      } catch (error) {
        console.error("Error updating customer:", error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`http://localhost:8000/customers/${id}`);
        alert("Customer deleted successfully!");
        fetchCustomers();
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  const handleUpdateModalOpen = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      customerId: customer.customerId,
      customerName: customer.customerName,
      registerAddress: customer.registerAddress,
      gstNo: customer.gstNo,
      contactName: customer.contactName,
      contactNumber: customer.contactNumber,
      emailId: customer.emailId,
    });
    setIsUpdateModalOpen(true);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="flex h-screen mt-3">
    <div className="flex-1 p-6 overflow-auto lg:ml-72 "> 
      <div className="flex justify-between items-center mb-5 mt-16">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Customer
          </button>
        </div>

        <div className="overflow-x-auto" style={{ maxWidth: "100vw" }}>
          <table className="min-w-[1100px] w-full text-center border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-3">CustomerId</th>
                <th className="border border-gray-300 p-3">CustomerName</th>
                <th className="border border-gray-300 p-3">Register Address</th>
                <th className="border border-gray-300 p-3">GST</th>
                <th className="border border-gray-300 p-3">Contact Name</th>
                <th className="border border-gray-300 p-3">Contact Number</th>
                <th className="border border-gray-300 p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-3">{customer.customerId}</td>
                  <td className="border border-gray-300 p-3">{customer.customerName}</td>
                  <td className="border border-gray-300 p-3">{customer.registerAddress}</td>
                  <td className="border border-gray-300 p-3">{customer.gstNo}</td>
                  <td className="border border-gray-300 p-3">{customer.contactName}</td>
                  <td className="border border-gray-300 p-3">{customer.contactNumber}</td>
                  <td className="border border-gray-300 p-3">
                    <button
                      onClick={() => handleUpdateModalOpen(customer)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id)}
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

      {/* Create Modal */}
      {isCreateModalOpen && (
        <Modal
          title="Add Customer"
          formData={formData}
          onInputChange={handleInputChange}
          onSave={handleCreate}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {/* Update Modal */}
      {isUpdateModalOpen && selectedCustomer && (
        <Modal
          title="Update Customer"
          formData={formData}
          onInputChange={handleInputChange}
          onSave={handleUpdate}
          onClose={() => setIsUpdateModalOpen(false)}
        />
      )}
    </div>
  );
};

// Modal Component for Add and Update
const Modal: React.FC<{
  title: string;
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onClose: () => void;
}> = ({ title, formData, onInputChange, onSave, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg w-96">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <input
        name="customerId"
        value={formData.customerId}
        onChange={onInputChange}
        placeholder="Customer ID"
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        name="customerName"
        value={formData.customerName}
        onChange={onInputChange}
        placeholder="Customer Name"
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        name="registerAddress"
        value={formData.registerAddress}
        onChange={onInputChange}
        placeholder="Register Address"
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        name="gstNo"
        value={formData.gstNo}
        onChange={onInputChange}
        placeholder="GST Number"
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        name="contactName"
        value={formData.contactName}
        onChange={onInputChange}
        placeholder="Contact Name"
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        name="contactNumber"
        value={formData.contactNumber}
        onChange={onInputChange}
        placeholder="Contact Number"
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        name="emailId"
        value={formData.emailId}
        onChange={onInputChange}
        placeholder="Email ID"
        className="w-full mb-3 p-2 border rounded"
      />
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

export default CustomerTable;
