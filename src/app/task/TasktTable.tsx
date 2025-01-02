"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";

// Define interfaces
interface Task {
  id: number;
  departmentId: number;
  customerName: string;
  customerAddress: string;
  gstNo: string;
  contactName: string;
  contactNo: string;
  emailId: string;
  requirement: string;
  serviceId: number;
}

interface Department {
  id: number;
  departmentName: string;
}

interface Service {
  id: number;
  serviceName: string;
}

const TaskTable: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [services, setServices] = useState<Service[]>([]); // Store services based on department
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Task>({
    id: 0,
    departmentId: 0,
    customerName: '',
    customerAddress: '',
    gstNo: '',
    contactName: '',
    contactNo: '',
    emailId: '',
    requirement: '',
    serviceId: 0
  });

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:8000/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // Fetch services based on selected department
  const fetchServicesByDepartment = async (departmentId: number) => {
    try {
      const response = await axios.get(`http://localhost:8000/tasks/services/${departmentId}`);
      setServices(response.data); // Assuming response contains services based on departmentId
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]); // Clear services if error occurs
    }
  };

  // Handle task deletion
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/tasks/${id}`);
      alert("Task deleted successfully!");
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Handle task save (add or update)
  const handleSave = async () => {
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8000/tasks/${formData.id}`, formData);
        alert("Task updated successfully!");
      } else {
        await axios.post("http://localhost:8000/tasks", formData);
        alert("Task created successfully!");
      }
      setIsModalOpen(false);
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  // Open modal for adding or editing a task
  const openModal = (task: Task | null = null) => {
    setIsEditing(!!task);
    setFormData(task || {
      id: 0,
      departmentId: 0,
      customerName: '',
      customerAddress: '',
      gstNo: '',
      contactName: '',
      contactNo: '',
      emailId: '',
      requirement: '',
      serviceId: 0
    });
    setIsModalOpen(true);
  };

  // Handle department change
  const handleDepartmentChange = (departmentId: number) => {
    setFormData({ ...formData, departmentId, serviceId: 0 }); // Reset serviceId when department changes
    fetchServicesByDepartment(departmentId); // Fetch services based on selected department
  };

  // Fetch tasks and departments when component mounts
  useEffect(() => {
    fetchTasks();
    fetchDepartments();
  }, []);

  return (
    <div className="flex h-screen w-full p-6">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => openModal()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Task
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-center table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-3">ID</th>
                <th className="border border-gray-300 p-3">Department</th>
                <th className="border border-gray-300 p-3">Customer Name</th>
                <th className="border border-gray-300 p-3">Contact No</th>
                <th className="border border-gray-300 p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-3">{task.id}</td>
                    <td className="border border-gray-300 p-3">
                      {departments.find((dept) => dept.id === task.departmentId)?.departmentName}
                    </td>
                    <td className="border border-gray-300 p-3">{task.customerName}</td>
                    <td className="border border-gray-300 p-3">{task.contactNo}</td>
                    <td className="border border-gray-300 p-3">
                      <button
                        onClick={() => openModal(task)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-3 text-gray-500">
                    No tasks available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              {isEditing ? "Edit Task" : "Add Task"}
            </h2>

            <select
              value={formData.departmentId}
              onChange={(e) => handleDepartmentChange(parseInt(e.target.value, 10))}
              className="border p-2 rounded mb-4 w-full"
            >
              <option value={0}>Select Department</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.departmentName}
                </option>
              ))}
            </select>
            <select
              value={formData.serviceId}
              onChange={(e) => setFormData({ ...formData, serviceId: parseInt(e.target.value, 10) })}
              className="border p-2 rounded mb-4 w-full"
            >
              <option value={0}>Select Service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.serviceName}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              placeholder="Customer Name"
              className="border p-2 rounded mb-4 w-full"
            />
            <textarea
              value={formData.customerAddress}
              onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
              placeholder="Customer Address"
              className="border p-2 rounded mb-4 w-full"
            />
            <input
              type="text"
              value={formData.gstNo}
              onChange={(e) => setFormData({ ...formData, gstNo: e.target.value })}
              placeholder="GST No"
              className="border p-2 rounded mb-4 w-full"
            />
            <input
              type="text"
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              placeholder="Contact Name"
              className="border p-2 rounded mb-4 w-full"
            />
            <input
              type="text"
              value={formData.contactNo}
              onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
              placeholder="Contact No"
              className="border p-2 rounded mb-4 w-full"
            />
            <input
              type="email"
              value={formData.emailId}
              onChange={(e) => setFormData({ ...formData, emailId: e.target.value })}
              placeholder="Email ID"
              className="border p-2 rounded mb-4 w-full"
            />
            <textarea
              value={formData.requirement}
              onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
              placeholder="Requirement"
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

export default TaskTable;
