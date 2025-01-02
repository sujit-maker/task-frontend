"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface TaskType {
  id: number;
  taskType: string;
  departmentId: number;
}

interface Department {
  id: number;
  departmentName: string;
}

const TaskTypeTable: React.FC = () => {
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<TaskType>({
    id: 0,
    taskType: "",
    departmentId: 0,
  });

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
      await axios.delete(`http://localhost:8000/tasktype/${id}`);
      alert("Task type deleted successfully!");
      fetchTaskTypes();
    } catch (error) {
      console.error("Error deleting task type:", error);
    }
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:8000/tasktype/${formData.id}`,
          formData
        );
        alert("Task type updated successfully!");
      } else {
        await axios.post("http://localhost:8000/tasktype", formData);
        alert("Task type created successfully!");
      }
      setIsModalOpen(false);
      fetchTaskTypes();
    } catch (error) {
      console.error("Error saving task type:", error);
    }
  };

  const openModal = (taskType: TaskType | null = null) => {
    setIsEditing(!!taskType);
    setFormData(taskType || { id: 0, taskType: "", departmentId: 0 });
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchTaskTypes();
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
            Add Task Type
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-center table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-3">Id</th>
                <th className="border border-gray-300 p-3">Task Type Name</th>
                <th className="border border-gray-300 p-3">Department ID</th>
                <th className="border border-gray-300 p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {taskTypes.length > 0 ? (
                taskTypes.map((type) => (
                  <tr key={type.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-3">{type.id}</td>
                    <td className="border border-gray-300 p-3">
                      {type.taskType}
                    </td>
                    <td className="border border-gray-300 p-3">
                      {departments.find((dept) => dept.id === type.departmentId)
                        ?.departmentName || "Unknown Department"}
                    </td>
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
                  <td colSpan={4} className="p-3 text-gray-500">
                    No task types available.
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
              {isEditing ? "Edit Task Type" : "Add Task Type"}
            </h2>
            <input
              type="text"
              value={formData.taskType}
              onChange={(e) =>
                setFormData({ ...formData, taskType: e.target.value })
              }
              placeholder="Task Type Name"
              className="border p-2 rounded mb-4 w-full"
            />
            <select
              value={formData.departmentId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  departmentId: parseInt(e.target.value, 10),
                })
              }
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

export default TaskTypeTable;
