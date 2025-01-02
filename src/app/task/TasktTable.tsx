"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

// Define interfaces
interface Task {
  id: number;
  departmentId: number;
  customerId: number;
  siteId: number;
  workScope: string;
  proposedDate: string;
  priority: string;
  remark: string;
  status: string;
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

interface Customer {
  id: number;
  customerName: string;
}

interface Site {
  id: number;
  siteName: string;
}

const TaskTable: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sites, setSites] = useState<any[]>([]); // Array of sites
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Task>({
    id: 0,
    departmentId: 0,
    customerId: 0,
    siteId: 0,
    workScope: '',
    proposedDate: '',
    priority: '',
    remark: '',
    status: '',
    serviceId: 0
  });

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://192.168.29.225:8000/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://192.168.29.225:8000/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // Fetch services based on selected department
  const fetchServicesByDepartment = async (departmentId: number) => {
    try {
      const response = await axios.get(`http://192.168.29.225:8000/tasks/services/${departmentId}`);
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    }
  };

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://192.168.29.225:8000/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // Fetch sites based on selected customer
  const fetchSitesByCustomer = async (customerId: number) => {
    try {
      const response = await axios.get(`http://192.168.29.225:8000/sites/customer/${customerId}`);
      setSites(response.data);
    } catch (error) {
      console.error("Error fetching sites:", error);
      setSites([]);
    }
  };

  // Handle task deletion
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://192.168.29.225:8000/tasks/${id}`);
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
        await axios.put(`http://192.168.29.225:8000/tasks/${formData.id}`, formData);
        alert("Task updated successfully!");
      } else {
        await axios.post("http://192.168.29.225:8000/tasks", formData);
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
      customerId: 0,
      siteId: 0,
      workScope: '',
      proposedDate: '',
      priority: '',
      remark: '',
      status: '',
      serviceId: 0
    });
    setIsModalOpen(true);
  };

  // Handle department change
  const handleDepartmentChange = (departmentId: number) => {
    setFormData({ ...formData, departmentId, serviceId: 0 });
    fetchServicesByDepartment(departmentId);
  };

  // Handle customer change
  const handleCustomerChange = (customerId: number) => {
    setFormData({ ...formData, customerId, siteId: 0 }); // Reset siteId
    fetchSitesByCustomer(customerId);
  };

  useEffect(() => {
    fetchTasks();
    fetchDepartments();
    fetchCustomers();
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
                <th className="border border-gray-300 p-3">Customer</th>
                <th className="border border-gray-300 p-3">Site</th>
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
                    <td className="border border-gray-300 p-3">
                      {customers.find((customer) => customer.id === task.customerId)?.customerName}
                    </td>
                    <td className="border border-gray-300 p-3">
                      {sites.find((site) => site.id === task.siteId)?.siteName}
                    </td>
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

            <select
              value={formData.customerId}
              onChange={(e) => handleCustomerChange(parseInt(e.target.value, 10))}
              className="border p-2 rounded mb-4 w-full"
            >
              <option value={0}>Select Customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.customerName}
                </option>
              ))}
            </select>

            <select
              value={formData.siteId}
              onChange={(e) => setFormData({ ...formData, siteId: parseInt(e.target.value, 10) })}
              className="border p-2 rounded mb-4 w-full"
            >
              <option value={0}>Select Site</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.siteName}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={formData.workScope}
              onChange={(e) => setFormData({ ...formData, workScope: e.target.value })}
              placeholder="Work Scope"
              className="border p-2 rounded mb-4 w-full"
            />
            <input
              type="date"
              value={formData.proposedDate}
              onChange={(e) => setFormData({ ...formData, proposedDate: e.target.value })}
              className="border p-2 rounded mb-4 w-full"
            />
             <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="border p-2 rounded mb-4 w-full"
            >
              <option value="High">High</option>
              <option value="Mid">Mid</option>
              <option value="Low">Low</option>
            </select>
            <textarea
              value={formData.remark}
              onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
              placeholder="Remark"
              className="border p-2 rounded mb-4 w-full"
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="border p-2 rounded mb-4 w-full"
            >
              <option value="">Select Status</option>
              <option value="Open">Open</option>
              <option value="Accepted">Accepted</option>
              <option value="Assigned">Assigned</option>
            </select>

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
