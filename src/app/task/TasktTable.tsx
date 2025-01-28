"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

interface Department {
  id: number;
  departmentName: string;
}

interface Service {
  id: number;
  serviceName: string;
}

interface Customer {
  username: string;
  id: number;
  customerName: string;
}

interface Site {
  id: number;
  siteName: string;
}

interface Task {
  id?: number;
  departmentId: number;
  serviceId: number;
  customerId: number;
  siteId: number;
  workScope: string;
  proposedDate: string;
  priority: string;
  remark: string;
  status: string;
  hodId: number;
  managerId: number;
  executiveId: number;
  site: Site;
  service: Service;
}

const TaskTable: React.FC = () => {
  const { userId } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [executives, setExecutives] = useState<Customer[]>([]);
  const [managers, setManagers] = useState<Customer[]>([]);
  const [hods, setHods] = useState<Customer[]>([]);
  const [formHods, setFormHods] = useState<Customer[]>([]);
  const [formManagers, setFormManagers] = useState<Customer[]>([]);
  const [formExecutive, setFormExecutive] = useState<Customer[]>([]);
  const [formServices, setFormServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Task>({
    departmentId: 0,
    serviceId: 0,
    customerId: 0,
    siteId: 0,
    workScope: "",
    proposedDate:"",
    priority: "Low",
    remark: "",
    status: "Open",
    hodId: 0,
    managerId: 0,
    executiveId: 0,
    site: { id: 0, siteName: "" },
    service: { id: 0, serviceName: "" },
  });

  const fetchTasks = async () => {
    const userId = localStorage.getItem("userId");
    const userType = localStorage.getItem("userType");

    try {
      let response;
      if (userType === "SUPERADMIN") {
        response = await axios.get("http://localhost:8000/tasks");
      } else {
        response = await axios.get(
          `http://localhost:8000/tasks/user/${userId}`
        );
      }

      // Ensure tasks have Service field populated
      if (response.data && Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        setTasks([]);
      }
    } catch (error) {
      setTasks([]);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:8000/departments");
      setDepartments(response.data);
    } catch (error) {
      console.log("Error fetching departments:", error);
    }
  };

  const fetchExecutives = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/users/executives"
      );
      setExecutives(response.data);
    } catch (error) {
      console.log("Error fetching executives:", error);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users/managers");
      setManagers(response.data);
    } catch (error) {
      console.log("Error fetching managers:", error);
    }
  };

  const fetchHodsByDepartment = async (departmentName: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/users/hods/${departmentName}`
      );
      setFormHods(response.data);
    } catch (error) {
      console.log("Error fetching HODs:", error);
      setFormHods([]);
    }
  };

  const fetchManagersByDepartment = async (departmentName: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/users/manager/${departmentName}`
      );
      setFormManagers(response.data);
    } catch (error) {
      console.log("Error fetching Managers:", error);
      setFormManagers([]);
    }
  };

  const fetchExecutivesByDepartment = async (departmentName: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/users/executive/${departmentName}`
      );
      setFormExecutive(response.data);
    } catch (error) {
      console.log("Error fetching Executives:", error);
      setFormExecutive([]);
    }
  };

  const fetchServicesByDepartment = async (departmentId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/tasks/services/${departmentId}`
      );
      setFormServices(response.data);
    } catch (error) {
      console.log("Error fetching services:", error);
      setFormServices([]);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/customers");
      setCustomers(response.data);
    } catch (error) {
      console.log("Error fetching customers:", error);
    }
  };

  const fetchSitesByCustomer = async (customerId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/sites/customer/${customerId}`
      );
      setSites(response.data);
    } catch (error) {
      console.log("Error fetching sites:", error);
      setSites([]);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/tasks/${id}`);
      alert("Task deleted successfully!");
      fetchTasks();
    } catch (error) {
      console.log("Error deleting task:", error);
    }
  };

  const fetchAllHods = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users/hods");
      setHods(response.data);
    } catch (error) {
      console.log("Error fetching all HODs:", error);
    }
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.departmentId || !formData.serviceId) {
        alert("Please select a valid department and service.");
        return;
      }
  
      // Prepare data for the API
      const sanitizedData = {
        ...formData,
        proposedDate: new Date(formData.proposedDate).toISOString(), // Ensure ISO format
        site: undefined, // Remove nested objects
        service: undefined,
        managerId: formData.managerId || null, // Convert 0 to null for optional fields
        executiveId: formData.executiveId || null,
      };
  
      if (isEditing) {
        await axios.put(`http://localhost:8000/tasks/${formData.id}`, sanitizedData);
        alert("Task updated successfully!");
      } else {
        await axios.post("http://localhost:8000/tasks", sanitizedData);
        alert("Task created successfully!");
      }
  
      setIsModalOpen(false);
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error("Error saving task:", error);
      alert("An error occurred while saving the task.");
    }
  };
  

  const openModal = (task: Task | null = null) => {
    setIsEditing(!!task);
    setFormData(
      task || {

        departmentId: 0,
        serviceId: 0,
        customerId: 0,
        siteId: 0,
        workScope: "",
        proposedDate: "",
        priority: "Low",
        remark: "",
        status: "Open",
        hodId: 0,
        managerId: 0,
        executiveId: 0,
        site: { id: 0, siteName: "" },
        service: { id: 0, serviceName: "" },
      }
    );
    setIsModalOpen(true);
  };

  const handleDepartmentChange = (
    departmentId: number,
    departmentName: string
  ) => {
    setFormData({ ...formData, departmentId, serviceId: 0, hodId: 0 , managerId:0, executiveId:0 });
    fetchServicesByDepartment(departmentId);
    fetchHodsByDepartment(departmentName);
    fetchManagersByDepartment(departmentName);
    fetchExecutivesByDepartment(departmentName);
  };

  const handleCustomerChange = (customerId: number) => {
    setFormData({ ...formData, customerId, siteId: 0 });
    fetchSitesByCustomer(customerId);
  };

  useEffect(() => {
    if (userId) {
      fetchTasks();
      fetchDepartments();
      fetchCustomers();
      fetchExecutives();
      fetchManagers();
      fetchAllHods();
    }
  }, [userId]);

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
          <table
            className="w-screen text-center border-collapse border border-gray-200"
            style={{ width: "1200px" }}
          >
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-3">Department</th>
                <th className="border border-gray-300 p-3">Service</th>
                <th className="border border-gray-300 p-3">Customer</th>
                <th className="border border-gray-300 p-3">Site</th>
                <th className="border border-gray-300 p-3">HOD</th>
                <th className="border border-gray-300 p-3">Manager</th>
                <th className="border border-gray-300 p-3">Executive</th>
                <th className="border border-gray-300 p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-3">
                      {
                        departments.find(
                          (dept) => dept.id === task.departmentId
                        )?.departmentName
                      }
                    </td>
                    <td className="border border-gray-300 p-3">
                      {task.service?.serviceName || "No Service"}
                    </td>

                    <td className="border border-gray-300 p-3">
                      {
                        customers.find(
                          (customer) => customer.id === task.customerId
                        )?.customerName
                      }
                    </td>
                    <td className="border border-gray-300 p-3">
                      {task.site?.siteName || "No Service"}
                    </td>

                    <td className="border border-gray-300 p-3">
                      {hods.find((hod) => hod.id === task.hodId)?.username ||
                        "N/A"}
                    </td>
                    <td className="border border-gray-300 p-3">
                      {managers.find((manager) => manager.id === task.managerId)
                        ?.username || "N/A"}
                    </td>
                    <td className="border border-gray-300 p-3">
                      {executives.find(
                        (executive) => executive.id === task.executiveId
                      )?.username || "N/A"}
                    </td>
        
                    <td className="border border-gray-300 p-3">
                      <button
                        onClick={() => openModal(task)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id!)}
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
          <div className="bg-white p-6 rounded shadow-lg w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">
              {isEditing ? "Edit Task" : "Add Task"}
            </h2>

            <select
              value={formData.departmentId}
              onChange={(e) => {
                const departmentId = parseInt(e.target.value, 10);
                const departmentName =
                  departments.find((dept) => dept.id === departmentId)
                    ?.departmentName || "";
                handleDepartmentChange(departmentId, departmentName);
              }}
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
              onChange={(e) =>
                setFormData({
                  ...formData,
                  serviceId: parseInt(e.target.value, 10),
                })
              }
              className="border p-2 rounded mb-4 w-full"
            >
              <option value={0}>Select Service</option>
              {formServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.serviceName}
                </option>
              ))}
            </select>

            <select
              value={formData.customerId}
              onChange={(e) =>
                handleCustomerChange(parseInt(e.target.value, 10))
              }
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
              onChange={(e) =>
                setFormData({
                  ...formData,
                  siteId: parseInt(e.target.value, 10),
                })
              }
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
              onChange={(e) =>
                setFormData({ ...formData, workScope: e.target.value })
              }
              placeholder="Work Scope"
              className="border p-2 rounded mb-4 w-full"
            />

            <label htmlFor="">Proposed Date</label>
            <input
              type="date"
              value={formData.proposedDate}
              onChange={(e) =>
                setFormData({ ...formData, proposedDate: e.target.value })
              }
              placeholder="Proposed Date"
              className="border p-2 rounded mb-4 w-full"
            />

            <select
              value={formData.hodId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hodId: parseInt(e.target.value, 10),
                })
              }
              className="border p-2 rounded mb-4 w-full"
            >
              <option value={0}>Select HOD</option>
              {formHods.map((hod) => (
                <option key={hod.id} value={hod.id}>
                  {hod.username}
                </option>
              ))}
            </select>
            <select
              value={formData.managerId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  managerId: parseInt(e.target.value, 10),
                })
              }
              className="border p-2 rounded mb-4 w-full max-h-40 overflow-y-auto"
            >
              <option value={0}>Select Manager</option>
              {formManagers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.username}
                </option>
              ))}
            </select>

            <select
              value={formData.executiveId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  executiveId: parseInt(e.target.value, 10),
                })
              }
              className="border p-2 rounded mb-4 w-full max-h-40 overflow-y-auto"
            >
<option value={0}>Select Executive</option>
              {formExecutive.map((executive) => (
                <option key={executive.id} value={executive.id}>
                  {executive.username}
                </option>
              ))}
            </select>

            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              className="border p-2 rounded mb-4 w-full"
            >
              <option value="">Select Priority</option>
              <option value="High">High</option>
              <option value="Mid">Mid</option>
              <option value="Low">Low</option>
            </select>
            <textarea
              value={formData.remark}
              onChange={(e) =>
                setFormData({ ...formData, remark: e.target.value })
              }
              placeholder="Remark"
              className="border p-2 rounded mb-4 w-full"
            />
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="border p-2 rounded mb-4 w-full"
              disabled
            >
              <option value="Open">Open</option>
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
