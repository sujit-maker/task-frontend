"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Task {
  id: number;
  taskTypeId: number;
  departmentId: number;
  customerName: string;
  customerAddress: string;
  gstNo: string;
  contactName: string;
  contactNo: string;
  emailId: string;
  requirement: string;
}

interface Department {
  id: number;
  departmentName: string;
}

interface TaskType {
  id: number;
  taskType: string;
}

const TaskTable: React.FC = () => {
  const [Tasks, setTasks] = useState<Task[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Task>({
    id: 0,
    taskTypeId: 0,
    departmentId: 0,
    customerName: '',
    customerAddress: '',
    gstNo: '',
    contactName: '',
    contactNo: '',
    emailId: '',
    requirement: ''
  });

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchTaskTypes = async () => {
    try {
      const response = await axios.get("http://localhost:8000/tasktype");
      setTaskTypes(response.data);
    } catch (error) {
      console.error("Error fetching task types:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:8000/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/tasks/${id}`);
      alert("Task deleted successfully!");
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

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

  const openModal = (task: Task | null = null) => {
    setIsEditing(!!task);
    setFormData(task || {
      id: 0,
      taskTypeId: 0,
      departmentId: 0,
      customerName: '',
      customerAddress: '',
      gstNo: '',
      contactName: '',
      contactNo: '',
      emailId: '',
      requirement: ''
    });
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchTasks();
    fetchDepartments();
    fetchTaskTypes();
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
          <table className="w-screen text-center table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-3">ID</th>
                <th className="border border-gray-300 p-3">Task Type</th>
                <th className="border border-gray-300 p-3">Department</th>
                <th className="border border-gray-300 p-3">Customer Name</th>
                <th className="border border-gray-300 p-3">Contact No</th>
                <th className="border border-gray-300 p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Tasks.length > 0 ? (
                Tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-3">{task.id}</td>
                    <td className="border border-gray-300 p-3">
                      {taskTypes.find((type) => type.id === task.taskTypeId)?.taskType}
                    </td>
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
                  <td colSpan={6} className="p-3 text-gray-500">
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
            <select
              value={formData.taskTypeId}
              onChange={(e) => setFormData({ ...formData, taskTypeId: parseInt(e.target.value, 10) })}
              className="border p-2 rounded mb-4 w-full"
            >
              <option value={0}>Select Task Type</option>
              {taskTypes.map((taskType) => (
                <option key={taskType.id} value={taskType.id}>
                  {taskType.taskType}
                </option>
              ))}
            </select>
            <select
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: parseInt(e.target.value, 10) })}
              className="border p-2 rounded mb-4 w-full"
            >
              <option value={0}>Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.departmentName}
                </option>
              ))}
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
